#!/bin/bash
# Memory Leak Test Runner
# Integrates with existing production dump script for comprehensive testing

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
DEFAULT_DURATION=45
DEFAULT_CONCURRENT=5
TEST_SCENARIO="iati"

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "========================================================================"
    echo -e "${BLUE}$1${NC}"
    echo "========================================================================"
}

# Check prerequisites
check_prerequisites() {
    print_header "CHECKING PREREQUISITES"
    
    # Check if we're in the right directory
    if [[ ! -f "scripts/data/make-and-restore-production-dump.sh" ]]; then
        print_error "Must run from akvo-rsr root directory"
        exit 1
    fi
    
    # Check if memory test script exists
    if [[ ! -f "memory_leak_tester.py" ]]; then
        print_error "memory_leak_tester.py not found. Please ensure test scripts are in the root directory."
        exit 1
    fi
    
    # Check if docker compose is available
    if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
        print_error "Docker and docker compose are required"
        exit 1
    fi
    
    # Check if required services are defined in docker-compose
    if ! docker compose config --services | grep -q "web\|rsrdbhost"; then
        print_error "Required services (web, rsrdbhost) not found in docker-compose configuration"
        exit 1
    fi
    
    # Check if Python dependencies are available
    if ! python3 -c "import aiohttp, psutil" &> /dev/null; then
        print_warning "Python dependencies may be missing. Install with: pip3 install aiohttp psutil pandas matplotlib seaborn"
    fi
    
    print_success "Prerequisites check completed"
}

# Load production database
setup_database() {
    print_header "SETTING UP PRODUCTION DATABASE"
    
    cd scripts/data
    
    print_status "Running production database dump and restore..."
    print_status "This may take several minutes depending on database size"
    
    if ./make-and-restore-production-dump.sh; then
        print_success "Production database loaded successfully"
    else
        print_error "Failed to load production database"
        exit 1
    fi
    
    cd ../../
    
    # Verify test data is available
    print_status "Verifying test data availability..."
    
    docker compose exec -T web python manage.py shell << 'EOF'
from akvo.rsr.models import Organisation, Project
from django.db.models import Count

target_orgs = [6195, 3257, 4144, 13, 4645, 5844, 6313, 6375, 4651, 4143]
available_orgs = Organisation.objects.filter(pk__in=target_orgs)
available_count = available_orgs.count()

print(f"📊 Database Statistics:")
print(f"Total organisations: {Organisation.objects.count()}")
print(f"Total projects: {Project.objects.count()}")
print(f"Target test orgs available: {available_count}/{len(target_orgs)}")

if available_count < 8:
    print("⚠️  WARNING: Less than 8 target organizations available")
    exit(1)
else:
    print("✅ Sufficient test data available")
    
# Show available test organizations
print(f"\n🎯 Available Test Organizations:")
for org in available_orgs[:5]:  # Show first 5
    project_count = org.projects.count()
    print(f"  - {org.pk}: {org.name[:50]}... ({project_count} projects)")
EOF
    
    if [[ $? -eq 0 ]]; then
        print_success "Test data verification completed"
    else
        print_error "Insufficient test data available"
        exit 1
    fi
}

# Run pre-fix test
run_pre_fix_test() {
    print_header "RUNNING PRE-FIX BASELINE TEST"
    
    print_status "Starting pre-fix memory leak test (Duration: ${DEFAULT_DURATION} minutes)"
    print_status "This will establish baseline memory leak patterns..."
    
    if python3 memory_leak_tester.py \
        --test-type=pre-fix \
        --scenario=${TEST_SCENARIO} \
        --duration=${DEFAULT_DURATION} \
        --concurrent=${DEFAULT_CONCURRENT}; then
        print_success "Pre-fix baseline test completed"
    else
        print_error "Pre-fix test failed"
        exit 1
    fi
}

# Run post-fix test
run_post_fix_test() {
    print_header "RUNNING POST-FIX VALIDATION TEST"
    
    print_status "Rebuilding web container with fixes..."
    docker compose build web
    docker compose up -d web
    
    # Wait for container to be ready
    print_status "Waiting for web service to be ready..."
    sleep 30
    
    print_status "Starting post-fix memory leak test (Duration: ${DEFAULT_DURATION} minutes)"
    print_status "This will validate memory leak fixes..."
    
    if python3 memory_leak_tester.py \
        --test-type=post-fix \
        --scenario=${TEST_SCENARIO} \
        --duration=${DEFAULT_DURATION} \
        --concurrent=${DEFAULT_CONCURRENT}; then
        print_success "Post-fix validation test completed"
    else
        print_error "Post-fix test failed"
        exit 1
    fi
}

# Compare results and generate report
generate_report() {
    print_header "GENERATING VALIDATION REPORT"
    
    print_status "Comparing test results and generating validation report..."
    
    if python3 compare_test_results.py; then
        print_success "Validation report generated successfully"
        
        # Show report location
        if [[ -f "memory_leak_fix_validation_report.md" ]]; then
            print_success "📄 Detailed report: memory_leak_fix_validation_report.md"
        fi
        
        # Show charts location
        if [[ -d "memory_test_charts" ]]; then
            print_success "📊 Comparison charts: memory_test_charts/"
        fi
        
    else
        exit_code=$?
        if [[ $exit_code -eq 1 ]]; then
            print_error "❌ VALIDATION FAILED: Memory leak fixes did not meet success criteria"
            print_error "Review the validation report for detailed analysis"
            return 1
        else
            print_error "Failed to generate validation report"
            return 1
        fi
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS] COMMAND"
    echo ""
    echo "Commands:"
    echo "  full                Run complete test cycle (setup + pre-fix + post-fix + report)"
    echo "  setup               Setup database only"
    echo "  pre-fix            Run pre-fix baseline test only"
    echo "  post-fix           Run post-fix validation test only"  
    echo "  compare            Generate comparison report only"
    echo ""
    echo "Options:"
    echo "  -d, --duration N    Test duration in minutes (default: ${DEFAULT_DURATION})"
    echo "  -c, --concurrent N  Concurrent requests (default: ${DEFAULT_CONCURRENT})"
    echo "  -s, --scenario S    Test scenario: iati, mixed, stress (default: ${TEST_SCENARIO})"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 full                           # Run complete test cycle"
    echo "  $0 -d 60 -c 8 full              # 60-minute test with 8 concurrent requests"
    echo "  $0 setup                         # Setup database only"
    echo "  $0 pre-fix                       # Run baseline test only"
    echo "  $0 post-fix                      # Run validation test only"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--duration)
            DEFAULT_DURATION="$2"
            shift 2
            ;;
        -c|--concurrent)
            DEFAULT_CONCURRENT="$2"
            shift 2
            ;;
        -s|--scenario)
            TEST_SCENARIO="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        full|setup|pre-fix|post-fix|compare)
            COMMAND="$1"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Check if command was provided
if [[ -z "${COMMAND:-}" ]]; then
    print_error "No command specified"
    usage
    exit 1
fi

# Main execution
main() {
    print_header "AKVO RSR MEMORY LEAK TEST RUNNER"
    echo "Command: $COMMAND"
    echo "Duration: ${DEFAULT_DURATION} minutes"
    echo "Concurrent Requests: ${DEFAULT_CONCURRENT}"
    echo "Test Scenario: ${TEST_SCENARIO}"
    echo ""
    
    case $COMMAND in
        full)
            check_prerequisites
            setup_database
            run_pre_fix_test
            
            print_header "READY FOR MEMORY LEAK FIXES"
            print_warning "Please apply your memory leak fixes to the codebase now."
            print_warning "When ready, the post-fix test will begin..."
            echo ""
            read -p "Press Enter when memory leak fixes have been applied and you're ready to continue..."
            
            run_post_fix_test
            generate_report
            ;;
        setup)
            check_prerequisites
            setup_database
            ;;
        pre-fix)
            check_prerequisites
            run_pre_fix_test
            ;;
        post-fix)
            check_prerequisites
            run_post_fix_test
            ;;
        compare)
            generate_report
            ;;
        *)
            print_error "Invalid command: $COMMAND"
            usage
            exit 1
            ;;
    esac
    
    if [[ $? -eq 0 ]]; then
        print_header "🎉 MEMORY LEAK TEST COMPLETED SUCCESSFULLY"
    else
        print_header "❌ MEMORY LEAK TEST FAILED"
        exit 1
    fi
}

# Run main function
main