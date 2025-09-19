# Memory Leak Testing Framework

This folder contains a comprehensive memory leak testing framework for Akvo RSR, specifically designed to detect, analyze, and validate fixes for memory leaks in the IATI processing pipeline.

## 📁 Folder Structure

```
memory-leak-testing/
├── README.md                 # This file
├── docs/                     # Documentation
│   └── MEMORY_LEAK_LOAD_TEST_PLAN.md
├── scripts/                  # Testing scripts
│   ├── check_environment.py
│   ├── compare_test_results.py
│   ├── memory_leak_tester.py
│   ├── post_fix_test.sh
│   ├── pre_fix_test.sh
│   ├── quick_setup.sh
│   ├── run_memory_leak_test.sh
│   └── verify_test_data.py
├── analysis/                 # Analysis data and reports
│   ├── COMPREHENSIVE_MEMORY_LEAK_ANALYSIS_REPORT.md
│   ├── memory-leak-analysis-*.md
│   └── monitoring-data/
└── reports/                  # Generated test reports (created during testing)
```

## 🚀 Quick Start

### Option 1: Complete Automated Setup
```bash
# From project root directory
./memory-leak-testing/scripts/quick_setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Validate environment
python3 memory-leak-testing/scripts/check_environment.py

# 2. Load production data
cd scripts/data && ./make-and-restore-production-dump.sh && cd ../../

# 3. Verify test data
python3 memory-leak-testing/scripts/verify_test_data.py

# 4. Run quick test
python3 memory-leak-testing/scripts/memory_leak_tester.py --duration 5
```

## 🧪 Available Scripts

### Core Testing Scripts

#### `memory_leak_tester.py`
The main testing framework that simulates production load patterns and measures memory usage.

**Usage:**
```bash
# Basic test
python3 memory-leak-testing/scripts/memory_leak_tester.py --duration 30

# IATI scenario (production pattern)
python3 memory-leak-testing/scripts/memory_leak_tester.py --scenario iati --duration 60

# Mixed load scenario
python3 memory-leak-testing/scripts/memory_leak_tester.py --scenario mixed --duration 30

# Database stress scenario
python3 memory-leak-testing/scripts/memory_leak_tester.py --scenario stress --duration 20
```

**Parameters:**
- `--test-type`: Test type identifier (pre-fix, post-fix, baseline)
- `--scenario`: Test scenario (iati, mixed, stress)
- `--duration`: Test duration in minutes
- `--concurrent`: Number of concurrent requests
- `--base-url`: Base URL for testing (default: http://localhost:8000)

#### `compare_test_results.py`
Compares pre-fix and post-fix test results to validate memory leak fixes.

**Usage:**
```bash
# Auto-compare latest results
python3 memory-leak-testing/scripts/compare_test_results.py

# Compare specific files
python3 memory-leak-testing/scripts/compare_test_results.py --pre-fix-file results1.json --post-fix-file results2.json
```

### Helper Scripts

#### `check_environment.py`
Validates that the testing environment is properly configured.

**Checks:**
- Python packages (aiohttp, psutil, pandas, matplotlib, seaborn)
- Docker services (web, rsrdbhost, rsr-memcached)
- Test files existence
- Web service responsiveness
- Memory profiling middleware status

#### `verify_test_data.py`
Verifies that the database contains the required test data.

**Verifies:**
- Database connectivity
- Target organizations from production analysis
- Sufficient data volume for testing

### Workflow Scripts

#### `pre_fix_test.sh`
Establishes baseline memory leak patterns before applying fixes.

**Features:**
- Clean environment setup
- 60-minute IATI scenario test
- System metrics collection
- Baseline documentation

#### `post_fix_test.sh`
Validates memory leak fixes against the baseline.

**Features:**
- Container rebuild with fixes
- Same test scenario as pre-fix
- Automatic comparison report generation
- Pass/fail validation

#### `quick_setup.sh`
Complete automated setup implementing the full test plan workflow.

**Process:**
1. Environment validation
2. Production data loading
3. Test data verification
4. Quick verification test
5. Usage instructions

#### `run_memory_leak_test.sh`
Advanced test runner with multiple execution modes.

**Usage:**
```bash
# Complete test cycle
./memory-leak-testing/scripts/run_memory_leak_test.sh full

# Individual steps
./memory-leak-testing/scripts/run_memory_leak_test.sh setup
./memory-leak-testing/scripts/run_memory_leak_test.sh pre-fix
./memory-leak-testing/scripts/run_memory_leak_test.sh post-fix
./memory-leak-testing/scripts/run_memory_leak_test.sh compare
```

## 📊 Test Scenarios

### IATI Bulk Processing (Production Pattern)
- **Purpose**: Replicate the exact load pattern that caused memory leaks
- **Configuration**: 3 concurrent requests, 5-second intervals
- **Endpoints**: IATI organization export endpoints
- **Duration**: 30-60 minutes recommended

### Mixed API Load
- **Purpose**: Test secondary endpoints during IATI processing
- **Configuration**: 8 concurrent requests, 2-second intervals
- **Endpoints**: IATI + general API endpoints
- **Duration**: 20-30 minutes recommended

### Database Connection Stress
- **Purpose**: Test database connection pool behavior
- **Configuration**: 15 concurrent requests, 1-second intervals
- **Endpoints**: Multiple organization IATI endpoints
- **Duration**: 15-20 minutes recommended

## 📈 Success Criteria

Memory leak fixes are considered successful if they meet **at least 4 of 5 criteria**:

1. ✅ Memory growth rate <50 MB/hour
2. ✅ Average response time <10 seconds
3. ✅ Success rate >95%
4. ✅ Zero timeout requests
5. ✅ Memory stable (peak <150% of start)

## 📁 Generated Files

### Test Results
All test results are saved in `memory_test_results/` (created automatically):
- `{test-type}_results_{timestamp}.json` - Analysis summary
- `{test-type}_memory_{timestamp}.csv` - Raw memory data
- `{test-type}_requests_{timestamp}.csv` - Request performance data

### Reports
- `memory_leak_fix_validation_report.md` - Detailed comparison analysis
- `memory_test_charts/memory_leak_fix_comparison.png` - Visual comparison

### Logs
- `memory_test.log` - Test execution logs
- `memory_profiling.log` - Memory profiling middleware logs

## 🔧 Configuration

### Environment Variables
Memory profiling is configured in `docker-compose.override.yaml`:
```yaml
environment:
  - ENABLE_MEMORY_PROFILING=true
  - MEMORY_PROFILING_SAMPLE_RATE=1.0
  - MEMORY_GROWTH_THRESHOLD_MB=5
```

### Django Settings
Logging configuration is in `akvo/settings/90-finish.conf`:
- Memory profiling formatter
- Dedicated memory profiling log handler
- Specific loggers for memory middleware

## 🐛 Troubleshooting

### Common Issues

**Environment validation fails:**
```bash
# Install missing Python packages
pip3 install aiohttp psutil pandas matplotlib seaborn

# Start Docker services
docker compose up -d
```

**Web service not responding:**
```bash
# Check service status
docker compose ps

# Restart if needed
docker compose restart web
```

**Database connection issues:**
```bash
# Restart database
docker compose restart rsrdbhost
sleep 30
```

**Target organizations not found:**
```bash
# Reload production data
cd scripts/data
./make-and-restore-production-dump.sh
cd ../../
```

**Memory profiling not working:**
```bash
# Check metrics endpoint (credentials from docker-compose.override.yaml)
curl -u devuser:devpass http://localhost:8000/metrics | grep memory
```

## 📚 Documentation

### Primary Documentation
- **`docs/MEMORY_LEAK_LOAD_TEST_PLAN.md`** - Comprehensive test plan with step-by-step workflows

### Analysis Documentation
- **`analysis/COMPREHENSIVE_MEMORY_LEAK_ANALYSIS_REPORT.md`** - Production issue analysis
- **`analysis/memory-leak-analysis-*.md`** - Time-partitioned analysis reports
- **`analysis/monitoring-data/`** - Raw prometheus metrics and GCP logs

## 🎯 Best Practices

### For Developers
1. Always run `check_environment.py` before testing
2. Use production data for realistic testing
3. Test multiple scenarios, not just IATI
4. Compare pre-fix vs post-fix results
5. Validate that fixes meet all success criteria

### For Testing
1. Allow sufficient test duration (30+ minutes)
2. Monitor system resources during testing
3. Run tests in clean environment
4. Document any deviations from expected behavior
5. Archive test results for future reference

### For Production Deployment
1. Only deploy after validation passes
2. Monitor production metrics for 24-48 hours post-deployment
3. Verify production patterns match test results
4. Have rollback plan ready

## 🔗 Integration

This framework integrates with:
- **Django middleware**: Memory profiling middleware in `akvo/rsr/middleware/memory_profiling.py`
- **Prometheus metrics**: Memory metrics exported to `/metrics` endpoint
- **Docker environment**: Production-like testing environment
- **Production data**: Real database dumps for realistic testing
- **CI/CD**: Can be integrated into deployment pipelines

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the comprehensive test plan documentation
3. Examine test logs in `memory_test.log`
4. Check Django logs with `docker compose logs web`

---

*This framework provides comprehensive memory leak testing capabilities designed specifically for the Akvo RSR production environment and memory leak patterns.*