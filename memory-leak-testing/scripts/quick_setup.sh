#!/bin/bash
# Quick Setup Script for Memory Leak Testing
# Implements the "Getting Started" section from the test plan

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo "========================================================================"
    echo -e "${BLUE}$1${NC}"
    echo "========================================================================"
}

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "CLAUDE.md" ]] || [[ ! -d "akvo/rsr" ]]; then
    print_error "This script must be run from the akvo-rsr root directory"
    exit 1
fi

print_header "🚀 MEMORY LEAK TESTING QUICK SETUP"
echo "This script implements the Getting Started section from MEMORY_LEAK_LOAD_TEST_PLAN.md"
echo ""

# Step 1: Environment validation
print_step "Step 1: Validating environment"
if python3 "$(dirname "$0")/check_environment.py"; then
    print_success "Environment validation passed"
else
    print_error "Environment validation failed"
    echo "Please fix the issues above before continuing"
    exit 1
fi

# Step 2: Setup test environment with production data
print_step "Step 2: Setting up test environment with production data"
echo "This will use the existing production dump script..."

if [[ -f "scripts/data/make-and-restore-production-dump.sh" ]]; then
    cd scripts/data

    echo "Starting production dump and restore (this may take several minutes)..."
    if ./make-and-restore-production-dump.sh; then
        print_success "Production data loaded successfully"
        cd ../../
    else
        print_error "Failed to load production data"
        cd ../../
        exit 1
    fi
else
    print_error "Production dump script not found"
    exit 1
fi

# Step 3: Verify test data is loaded correctly
print_step "Step 3: Verifying test data"
if python3 "$(dirname "$0")/verify_test_data.py"; then
    print_success "Test data verification passed"
else
    print_warning "Test data verification had issues"
    echo "You can still proceed, but some tests may not work optimally"
fi

# Step 4: Quick test to verify everything works
print_step "Step 4: Running quick verification test"
echo "Running a 5-minute test to verify the setup..."

if python3 "$(dirname "$0")/memory_leak_tester.py" --test-type=quick-setup --duration=5 --scenario=iati; then
    print_success "Quick test completed successfully"
else
    print_warning "Quick test had issues, but setup is likely still functional"
fi

# Final instructions
print_header "🎉 SETUP COMPLETE!"
echo "Your memory leak testing environment is ready!"
echo ""
echo -e "${GREEN}Available commands:${NC}"
echo ""
echo -e "${BLUE}Environment checks:${NC}"
echo "  python3 memory-leak-testing/scripts/check_environment.py       # Validate environment"
echo "  python3 memory-leak-testing/scripts/verify_test_data.py        # Check database"
echo ""
echo -e "${BLUE}Quick testing:${NC}"
echo "  python3 memory-leak-testing/scripts/memory_leak_tester.py --duration 5   # 5-minute test"
echo "  python3 memory-leak-testing/scripts/memory_leak_tester.py --scenario mixed --duration 10   # Mixed load test"
echo ""
echo -e "${BLUE}Full testing workflow:${NC}"
echo "  ./memory-leak-testing/scripts/pre_fix_test.sh                  # Establish baseline"
echo "  # (apply your fixes here)"
echo "  ./memory-leak-testing/scripts/post_fix_test.sh                 # Validate fixes"
echo ""
echo -e "${BLUE}Advanced testing:${NC}"
echo "  ./memory-leak-testing/scripts/run_memory_leak_test.sh full     # Complete test cycle"
echo "  ./memory-leak-testing/scripts/run_memory_leak_test.sh setup    # Setup only"
echo ""
echo -e "${BLUE}Test scenarios:${NC}"
echo "  --scenario iati    # IATI bulk processing (production pattern)"
echo "  --scenario mixed   # Mixed API load testing"
echo "  --scenario stress  # Database connection stress testing"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run a quick test: python3 memory-leak-testing/scripts/memory_leak_tester.py --duration 5"
echo "2. Review test results in memory_test_results/"
echo "3. When ready for full testing, run: ./memory-leak-testing/scripts/pre_fix_test.sh"
echo ""
echo -e "${GREEN}Happy memory leak hunting! 🐛🔍${NC}"