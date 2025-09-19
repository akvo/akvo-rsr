#!/bin/bash
# Pre-Fix Memory Leak Test
# Establishes baseline memory leak patterns before applying fixes

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== PRE-FIX Memory Leak Test ===${NC}"
echo "Date: $(date)"
echo "Git commit: $(git rev-parse HEAD)"
echo ""

# Start clean environment
echo "Starting clean environment..."
docker compose down
docker compose up -d rsrdbhost rsr-memcached
docker compose up -d web

# Wait for services to be ready
echo "Waiting for services..."
sleep 30

# Run memory leak test with default parameters
echo -e "${BLUE}Running baseline memory leak test...${NC}"
python3 "$(dirname "$0")/memory_leak_tester.py" \
    --test-type=pre-fix \
    --scenario=iati \
    --duration=60

# Collect additional metrics
echo ""
echo -e "${BLUE}=== System Metrics ===${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -5

# Check Django process memory
echo ""
echo "Django process memory usage:"
docker compose exec web python manage.py shell -c "
import psutil
print(f'Memory: {psutil.virtual_memory().percent}%')
print(f'CPU: {psutil.cpu_percent()}%')
"

echo ""
echo -e "${GREEN}Pre-fix baseline test completed.${NC}"
echo "Check results files in memory_test_results/ directory"
echo ""
echo "Next steps:"
echo "1. Apply your memory leak fixes to the codebase"
echo "2. Run: ./memory-leak-testing/scripts/post_fix_test.sh"
echo "3. Compare results with: python3 memory-leak-testing/scripts/compare_test_results.py"