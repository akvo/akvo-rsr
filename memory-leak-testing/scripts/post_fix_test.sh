#!/bin/bash
# Post-Fix Memory Leak Test
# Validates memory leak fixes by comparing against pre-fix baseline

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== POST-FIX Memory Leak Test ===${NC}"
echo "Date: $(date)"
echo "Git commit: $(git rev-parse HEAD)"
echo ""

# Clean environment with fixes applied
echo "Rebuilding environment with fixes..."
docker compose down
docker compose build web  # Rebuild with fixes
docker compose up -d rsrdbhost rsr-memcached
docker compose up -d web

# Wait for services to be ready
echo "Waiting for services..."
sleep 30

# Run same test scenarios as pre-fix
echo -e "${BLUE}Running post-fix validation test...${NC}"
python3 "$(dirname "$0")/memory_leak_tester.py" \
    --test-type=post-fix \
    --scenario=iati \
    --duration=60

echo ""
echo -e "${BLUE}=== Comparison Analysis ===${NC}"

# Generate comparison report
if python3 "$(dirname "$0")/compare_test_results.py"; then
    echo -e "${GREEN}✅ Validation completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Validation completed with warnings${NC}"
fi

echo ""
echo -e "${GREEN}Post-fix validation test completed.${NC}"
echo ""
echo "Generated files:"
echo "• Test results: memory_test_results/"
echo "• Comparison report: memory_leak_fix_validation_report.md"
echo "• Charts: memory_test_charts/"
echo ""
echo "Review the validation report to see if fixes were successful!"