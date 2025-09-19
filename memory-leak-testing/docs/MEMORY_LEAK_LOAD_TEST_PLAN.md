# Memory Leak Load Test Plan
## Akvo RSR - IATI Endpoint Memory Leak Validation

### Test Objective
Validate memory leak fixes in IATI data processing pipeline through controlled load testing that replicates production memory growth patterns identified in the analysis.

---

## 🎯 Test Scope and Targets

### Primary Test Targets (Based on Analysis)
1. **IATI Organisation Export Endpoints**
   - `/organisation/{id}/iati/` 
   - `/organisation/{id}/iati-org/.xml`
   - Organisation bulk export operations

2. **Secondary API Endpoints**  
   - `/rest/v1/project_by_uuid/?format=csv` (pagination load)
   - `/rest/v1/project_up/?format=xml` (XML serialization)
   - Project results framework endpoints

3. **System Components**
   - Database connection pool behavior
   - Django memory management
   - Background job processing (Django-Q)

### Success Metrics
- **Pre-Fix**: Replicate 200-1,300 MB/h memory growth rates
- **Post-Fix**: Achieve <50 MB/h sustained memory growth
- **Request Duration**: Reduce IATI processing from 35-51s to <10s
- **Database Connections**: Stable connection pool usage

---

## 🏗️ Test Environment Setup

### Local Development Environment Configuration

#### 1. Database Setup (Using Existing Scripts)
```bash
# Use the existing production dump script
cd scripts/data
./make-and-restore-production-dump.sh

# This script will:
# 1. Create a fresh production dump from rsr-prod-database-2024
# 2. Restore it to local rsrdb database
# 3. Restart the web container

# Verify key data volumes match production patterns
docker compose exec web python manage.py shell -c "
from akvo.rsr.models import Organisation, Project
from django.db.models import Count
print(f'Organisations: {Organisation.objects.count()}')
print(f'Projects: {Project.objects.count()}')
print(f'Large orgs (>100 projects): {Organisation.objects.annotate(project_count=Count(\"projects\")).filter(project_count__gt=100).count()}')
print(f'Target test orgs available: {Organisation.objects.filter(pk__in=[6195, 3257, 4144, 13, 4645, 5844, 6313, 6375, 4651, 4143]).count()}/10')
"
```

#### 2. Memory Monitoring Setup
```bash
# Enable memory profiling middleware in development
echo "ENABLE_MEMORY_PROFILING=True" >> akvo/settings/local.conf
echo "MEMORY_PROFILING_SAMPLE_RATE=1.0" >> akvo/settings/local.conf
echo "MEMORY_GROWTH_THRESHOLD_MB=5" >> akvo/settings/local.conf

# Start monitoring services
docker compose up -d web rsrdbhost rsr-memcached
docker compose exec web python manage.py migrate
docker compose exec web python manage.py collectstatic --noinput
```

#### 3. Logging Configuration
```bash
# Enhanced logging for memory analysis
cat > logging_config.py << EOF
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            'format': '{asctime} {name} {levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'memory_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'memory_test_logs.log',
            'formatter': 'detailed',
        },
    },
    'loggers': {
        'akvo.rsr.middleware.memory_profiling': {
            'handlers': ['memory_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
EOF
```

---

## 📊 Test Framework Implementation

### Memory Monitoring Script
```python
#!/usr/bin/env python3
"""
Memory leak load test framework
"""
import asyncio
import aiohttp
import psutil
import time
import json
import csv
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class MemoryLeakTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.process = psutil.Process()
        self.memory_data = []
        self.request_data = []
        
    def get_memory_usage(self):
        """Get current memory usage in MB"""
        memory_info = self.process.memory_info()
        return {
            'timestamp': datetime.now().isoformat(),
            'rss_mb': memory_info.rss / 1024 / 1024,
            'vms_mb': memory_info.vms / 1024 / 1024,
            'percent': self.process.memory_percent()
        }
    
    async def make_request(self, session, url, request_id):
        """Make individual request and measure response time"""
        start_time = time.time()
        try:
            async with session.get(url, timeout=300) as response:
                content_length = len(await response.read())
                duration = time.time() - start_time
                
                self.request_data.append({
                    'request_id': request_id,
                    'url': url,
                    'status': response.status,
                    'duration_s': duration,
                    'content_length': content_length,
                    'timestamp': datetime.now().isoformat()
                })
                
                return response.status, duration
        except Exception as e:
            duration = time.time() - start_time
            self.request_data.append({
                'request_id': request_id,
                'url': url,
                'status': 'ERROR',
                'duration_s': duration,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            return 'ERROR', duration
    
    async def run_load_test(self, endpoints, concurrent_requests=5, duration_minutes=30):
        """Run load test against specified endpoints"""
        print(f"Starting {duration_minutes}-minute load test...")
        print(f"Concurrent requests: {concurrent_requests}")
        print(f"Target endpoints: {len(endpoints)}")
        
        end_time = time.time() + (duration_minutes * 60)
        request_id = 0
        
        async with aiohttp.ClientSession() as session:
            while time.time() < end_time:
                # Record memory usage
                self.memory_data.append(self.get_memory_usage())
                
                # Create batch of concurrent requests
                tasks = []
                for _ in range(concurrent_requests):
                    url = f"{self.base_url}{endpoints[request_id % len(endpoints)]}"
                    tasks.append(self.make_request(session, url, request_id))
                    request_id += 1
                
                # Execute requests concurrently
                await asyncio.gather(*tasks, return_exceptions=True)
                
                # Wait before next batch
                await asyncio.sleep(2)
                
        print(f"Completed load test. Total requests: {request_id}")
        return self.analyze_results()
    
    def analyze_results(self):
        """Analyze memory growth and request performance"""
        if len(self.memory_data) < 2:
            return {"error": "Insufficient data"}
        
        start_memory = self.memory_data[0]['rss_mb']
        end_memory = self.memory_data[-1]['rss_mb']
        memory_growth = end_memory - start_memory
        
        # Calculate memory growth rate
        duration_hours = len(self.memory_data) * 2 / 3600  # 2-second intervals
        growth_rate_mb_h = memory_growth / duration_hours if duration_hours > 0 else 0
        
        # Request performance analysis
        successful_requests = [r for r in self.request_data if r['status'] == 200]
        failed_requests = [r for r in self.request_data if r['status'] != 200]
        
        avg_response_time = sum(r['duration_s'] for r in successful_requests) / len(successful_requests) if successful_requests else 0
        
        return {
            'memory_analysis': {
                'start_memory_mb': start_memory,
                'end_memory_mb': end_memory,
                'memory_growth_mb': memory_growth,
                'growth_rate_mb_h': growth_rate_mb_h,
                'peak_memory_mb': max(m['rss_mb'] for m in self.memory_data)
            },
            'request_analysis': {
                'total_requests': len(self.request_data),
                'successful_requests': len(successful_requests),
                'failed_requests': len(failed_requests),
                'success_rate': len(successful_requests) / len(self.request_data) * 100,
                'avg_response_time_s': avg_response_time,
                'max_response_time_s': max(r['duration_s'] for r in self.request_data),
                'requests_over_30s': len([r for r in self.request_data if r['duration_s'] > 30])
            }
        }
    
    def save_results(self, results, filename_prefix="memory_test"):
        """Save test results to files"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save analysis results
        with open(f"{filename_prefix}_results_{timestamp}.json", 'w') as f:
            json.dump(results, f, indent=2)
        
        # Save raw memory data
        with open(f"{filename_prefix}_memory_{timestamp}.csv", 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=self.memory_data[0].keys())
            writer.writeheader()
            writer.writerows(self.memory_data)
        
        # Save raw request data
        with open(f"{filename_prefix}_requests_{timestamp}.csv", 'w', newline='') as f:
            if self.request_data:
                writer = csv.DictWriter(f, fieldnames=self.request_data[0].keys())
                writer.writeheader()
                writer.writerows(self.request_data)

if __name__ == "__main__":
    # Test configuration based on analysis findings
    IATI_TEST_ENDPOINTS = [
        "/organisation/6195/iati/",
        "/organisation/3257/iati/", 
        "/organisation/4144/iati/",
        "/organisation/13/iati/",
        "/organisation/4645/iati/",
        "/organisation/5844/iati/",
        "/organisation/6313/iati/",
        "/organisation/6375/iati-org/.xml",
        "/organisation/4651/iati/",
        "/organisation/4143/iati/"
    ]
    
    API_TEST_ENDPOINTS = [
        "/rest/v1/project_by_uuid/?format=csv&ordering=-default_finance_type&page=1",
        "/rest/v1/project_by_uuid/?format=csv&ordering=-default_finance_type&page=7",
        "/rest/v1/project_up/?format=xml&ordering=-donate_url&page=10",
        "/rest/v1/project/427/?format=json"
    ]
    
    # Run tests
    tester = MemoryLeakTester()
    
    print("=== IATI Endpoints Memory Leak Test ===")
    asyncio.run(tester.run_iati_test())
```

### Test Execution Scripts

#### Pre-Fix Test
```bash
#!/bin/bash
# pre_fix_test.sh

echo "=== PRE-FIX Memory Leak Test ==="
echo "Date: $(date)"
echo "Git commit: $(git rev-parse HEAD)"

# Start clean environment
docker compose down
docker compose up -d rsrdbhost rsr-memcached
docker compose up -d web

# Wait for services to be ready
echo "Waiting for services..."
sleep 30

# Run memory leak test
python3 memory-leak-testing/scripts/memory_leak_tester.py --test-type=pre-fix --duration=60

# Collect additional metrics
echo "=== System Metrics ==="
docker stats --no-stream rsr-web-1
docker compose exec web python manage.py shell -c "
import psutil
print(f'Memory: {psutil.virtual_memory().percent}%')
print(f'CPU: {psutil.cpu_percent()}%')
"

echo "Pre-fix test completed. Check results files."
```

#### Post-Fix Test  
```bash
#!/bin/bash
# post_fix_test.sh

echo "=== POST-FIX Memory Leak Test ==="
echo "Date: $(date)" 
echo "Git commit: $(git rev-parse HEAD)"

# Clean environment with fixes applied
docker compose down
docker compose build web  # Rebuild with fixes
docker compose up -d

sleep 30

# Run same test scenarios
python3 memory-leak-testing/scripts/memory_leak_tester.py --test-type=post-fix --duration=60

echo "=== Comparison Analysis ==="
python3 memory-leak-testing/scripts/compare_test_results.py pre-fix post-fix

echo "Post-fix test completed."
```

---

## 🧪 Test Scenarios

### Scenario 1: IATI Bulk Processing Simulation
**Objective**: Replicate the IATI Bulk Data Service load pattern
```python
SCENARIO_1_CONFIG = {
    'name': 'IATI_BULK_SIMULATION',
    'endpoints': IATI_TEST_ENDPOINTS,
    'concurrent_requests': 3,  # Match production concurrent IATI requests
    'duration_minutes': 45,
    'request_interval_seconds': 5,
    'target_memory_growth': 200  # MB/hour threshold
}
```

### Scenario 2: Mixed API Load  
**Objective**: Test secondary endpoints during IATI processing
```python
SCENARIO_2_CONFIG = {
    'name': 'MIXED_API_LOAD',
    'endpoints': IATI_TEST_ENDPOINTS + API_TEST_ENDPOINTS,
    'concurrent_requests': 8,
    'duration_minutes': 30,
    'request_interval_seconds': 2,
    'target_memory_growth': 100  # MB/hour threshold
}
```

### Scenario 3: Database Connection Stress
**Objective**: Test database connection pool behavior
```python
SCENARIO_3_CONFIG = {
    'name': 'DB_CONNECTION_STRESS', 
    'endpoints': ['/organisation/{}/iati/'.format(i) for i in range(1, 100)],
    'concurrent_requests': 15,
    'duration_minutes': 20,
    'request_interval_seconds': 1,
    'target_memory_growth': 150  # MB/hour threshold
}
```

---

## 📈 Success Criteria and Metrics

### Pre-Fix Expected Results (Baseline)
- **Memory Growth Rate**: 200-1,300 MB/hour
- **IATI Request Duration**: 30-50 seconds average
- **Success Rate**: 60-80% (due to timeouts)
- **Database Connections**: >50 new connections/minute
- **Memory Pattern**: Continuous growth with no cleanup

### Post-Fix Target Results
- **Memory Growth Rate**: <50 MB/hour sustained
- **IATI Request Duration**: <10 seconds average  
- **Success Rate**: >95%
- **Database Connections**: <10 new connections/minute
- **Memory Pattern**: Stable or periodic cleanup visible

### Validation Criteria
```python
def validate_fix_success(pre_results, post_results):
    """Validate memory leak fix based on test results"""
    criteria = {
        'memory_improvement': post_results['growth_rate_mb_h'] < (pre_results['growth_rate_mb_h'] * 0.25),
        'performance_improvement': post_results['avg_response_time_s'] < (pre_results['avg_response_time_s'] * 0.5),
        'reliability_improvement': post_results['success_rate'] > (pre_results['success_rate'] + 20),
        'memory_stability': post_results['peak_memory_mb'] < (post_results['start_memory_mb'] * 1.5)
    }
    
    passed_criteria = sum(criteria.values())
    total_criteria = len(criteria)
    
    return {
        'overall_success': passed_criteria >= 3,  # Must pass 3/4 criteria
        'criteria_results': criteria,
        'success_rate': f"{passed_criteria}/{total_criteria}"
    }
```

---

## 🔧 Test Data Requirements

### Production Data Verification
```bash
# Verify production data is correctly loaded using existing dump script
docker compose exec web python manage.py shell << EOF
from akvo.rsr.models import Organisation, Project
from django.db.models import Count

# Verify organizations matching production analysis are available
target_orgs = [6195, 3257, 4144, 13, 4645, 5844, 6313, 6375, 4651, 4143]
available_orgs = []
for org_id in target_orgs:
    try:
        org = Organisation.objects.get(pk=org_id)
        project_count = org.projects.count()
        print(f"✅ Org {org_id}: {org.name} - {project_count} projects")
        available_orgs.append(org_id)
    except Organisation.DoesNotExist:
        print(f"❌ Org {org_id}: NOT FOUND in database dump")

print(f"\\n📊 Database Statistics:")
print(f"Total organisations: {Organisation.objects.count()}")
print(f"Total projects: {Project.objects.count()}")
print(f"Large orgs (>10 projects): {Organisation.objects.annotate(project_count=Count('projects')).filter(project_count__gt=10).count()}")
print(f"Target test orgs available: {len(available_orgs)}/{len(target_orgs)}")

if len(available_orgs) < 8:
    print("⚠️  WARNING: Less than 8 target organizations available. Test may not fully replicate production patterns.")
else:
    print("✅ Sufficient test data available for memory leak testing")
EOF
```

### Environment Variables
```bash
# Test configuration
export MEMORY_TEST_DURATION=60  # minutes
export MEMORY_TEST_CONCURRENT_REQUESTS=5
export MEMORY_TEST_SAMPLE_RATE=1.0
export MEMORY_TEST_THRESHOLD_MB=5

# Django settings for testing
export DJANGO_SETTINGS_MODULE=akvo.settings
export ENABLE_MEMORY_PROFILING=True
export DEBUG=False  # Use production-like settings
```

---

## 📋 Test Execution Checklist

### Pre-Test Setup
- [ ] Production database dump loaded
- [ ] Memory profiling middleware enabled  
- [ ] Docker containers built and running
- [ ] Test scripts configured with correct endpoints
- [ ] Logging configured for detailed analysis
- [ ] Baseline system metrics recorded

### During Test Execution
- [ ] Monitor Docker container resources
- [ ] Watch for error patterns in logs
- [ ] Record any system alerts or warnings
- [ ] Note any unusual system behavior
- [ ] Verify test is exercising target code paths

### Post-Test Analysis
- [ ] Memory growth rate calculated and compared
- [ ] Request performance metrics analyzed
- [ ] Database connection patterns reviewed
- [ ] Error rates and types documented
- [ ] Fix validation criteria evaluated
- [ ] Results compared against production patterns

### Test Reporting
- [ ] Generate test summary report
- [ ] Document any deviations from expected behavior
- [ ] Provide recommendations based on results
- [ ] Archive test data and results
- [ ] Update test plan based on findings

---

## 🚀 Getting Started

### Quick Start Commands
```bash
# 1. Setup test environment with production data (using existing script)
cd scripts/data
./make-and-restore-production-dump.sh

# 2. Verify test data is loaded correctly
docker compose exec web python manage.py shell -c "
from akvo.rsr.models import Organisation
target_orgs = [6195, 3257, 4144, 13, 4645, 5844, 6313, 6375, 4651, 4143]
available = Organisation.objects.filter(pk__in=target_orgs).count()
print(f'Test orgs available: {available}/{len(target_orgs)}')
"

# 3. Run pre-fix baseline test (establishes the problem)
python3 memory-leak-testing/scripts/memory_leak_tester.py --test-type=pre-fix --duration=45

# 4. Apply your memory leak fixes to the codebase
# (Edit IATI endpoints, database connections, etc.)
git checkout memory-leak-fixes
docker compose build web

# 5. Run post-fix validation test (proves the fix works)  
python3 memory-leak-testing/scripts/memory_leak_tester.py --test-type=post-fix --duration=45

# 6. Generate validation report and charts (pass/fail decision)
python3 memory-leak-testing/scripts/compare_test_results.py
```

---

## 📋 Step-by-Step Testing Workflow

### 🚀 Quick Start (Recommended)

#### Option 1: Complete Automated Setup
```bash
# Run the complete setup script (handles everything)
./memory-leak-testing/scripts/quick_setup.sh
```

This single command will:
- ✅ Validate your environment
- ✅ Load production data
- ✅ Verify test data
- ✅ Run a quick verification test
- ✅ Show you next steps

#### Option 2: Manual Step-by-Step
Follow the manual workflow below if you prefer to run each step individually.

---

### 📋 Manual Testing Workflow

#### Step 1: Environment Validation
```bash
# Install dependencies first
cd memory-leak-testing && uv sync && cd ..

# Check if everything is ready for testing
uv run --project memory-leak-testing python memory-leak-testing/scripts/check_environment.py
```

**What this checks:**
- Python packages (aiohttp, psutil, pandas, matplotlib, seaborn)
- Docker services (web, rsrdbhost, rsr-memcached)
- Test files exist
- Web service is responding
- Memory profiling middleware is active

#### Step 2: Load Production Data
```bash
# Go to the data scripts directory
cd scripts/data

# Run the production dump script (takes 5-15 minutes)
./make-and-restore-production-dump.sh

# Return to project root
cd ../../
```

#### Step 3: Verify Test Data
```bash
# Verify database has the right data for testing
uv run --project memory-leak-testing python memory-leak-testing/scripts/verify_test_data.py
```

**What this checks:**
- Database connectivity
- Target organizations from memory leak analysis exist
- Sufficient data for meaningful testing

#### Step 4: Quick Verification Test
```bash
# 5-minute test to verify setup
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --test-type=verification --duration=5 --scenario=iati
```

---

### 🧪 Testing Scenarios

#### Scenario 1: IATI Bulk Processing (Production Pattern)
```bash
# Short test (10 minutes)
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --scenario=iati --duration=10

# Full test (60 minutes)
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --scenario=iati --duration=60
```

**Configuration:**
- 3 concurrent requests (matches production)
- 5-second intervals between batches
- Targets IATI organization export endpoints

#### Scenario 2: Mixed API Load
```bash
# Mixed load test
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --scenario=mixed --duration=30
```

**Configuration:**
- 8 concurrent requests
- 2-second intervals
- IATI + API endpoints combined

#### Scenario 3: Database Connection Stress
```bash
# Connection stress test
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --scenario=stress --duration=20
```

**Configuration:**
- 15 concurrent requests
- 1-second intervals
- Tests many different organization IDs

---

### 🔬 Pre-Fix vs Post-Fix Testing

#### Complete Pre/Post-Fix Workflow

**Step 1: Establish Baseline (Pre-Fix)**
```bash
# Run baseline test to document the memory leak
./memory-leak-testing/scripts/pre_fix_test.sh
```

**Step 2: Apply Your Memory Leak Fixes**
```bash
# Make your code changes here
# Edit IATI endpoints, database connections, etc.
git add .
git commit -m "Fix memory leaks in IATI processing"
```

**Step 3: Validate Fixes (Post-Fix)**
```bash
# Test with fixes applied
./memory-leak-testing/scripts/post_fix_test.sh
```

#### Manual Pre/Post-Fix Testing

**Manual Pre-Fix Test:**
```bash
# Document current memory leak behavior
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --test-type=pre-fix --scenario=iati --duration=45
```

**Manual Post-Fix Test:**
```bash
# Rebuild with fixes
docker compose build web
docker compose up -d

# Test with fixes
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --test-type=post-fix --scenario=iati --duration=45

# Compare results
uv run --project memory-leak-testing python memory-leak-testing/scripts/compare_test_results.py
```

---

### 📊 Understanding Test Results

#### Key Success Metrics
Your fix is successful if it meets **at least 4 of 5 criteria**:

1. ✅ Memory growth rate <50 MB/hour
2. ✅ Average response time <10 seconds
3. ✅ Success rate >95%
4. ✅ Zero timeout requests
5. ✅ Memory stable (peak <150% of start)

#### Expected Results Comparison

**Pre-Fix (Problematic):**
- Memory Growth Rate: 200-1,300 MB/hour
- IATI Request Duration: 30-50 seconds average
- Success Rate: 60-80% (due to timeouts)
- Memory Pattern: Continuous growth with no cleanup

**Post-Fix (Fixed):**
- Memory Growth Rate: <50 MB/hour sustained
- IATI Request Duration: <10 seconds average
- Success Rate: >95%
- Memory Pattern: Stable or periodic cleanup visible

#### Output Files
All results are saved in `memory_test_results/`:
- `{test-type}_results_{timestamp}.json` - Analysis summary
- `{test-type}_memory_{timestamp}.csv` - Raw memory data
- `{test-type}_requests_{timestamp}.csv` - Request performance data

#### Reports Generated
- `memory_leak_fix_validation_report.md` - Detailed analysis and recommendations
- `memory_test_charts/memory_leak_fix_comparison.png` - Visual comparison charts

---

### 🔧 Advanced Testing Options

#### Custom Test Parameters
```bash
# Custom duration and concurrency
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --duration=90 --concurrent=10 --scenario=mixed

# Test specific endpoints
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --base-url=http://localhost
```

#### Using the Full Test Runner
```bash
# Complete test cycle with manual fix step
./memory-leak-testing/scripts/run_memory_leak_test.sh full

# Just setup database
./memory-leak-testing/scripts/run_memory_leak_test.sh setup

# Only run pre-fix test
./memory-leak-testing/scripts/run_memory_leak_test.sh pre-fix

# Only run post-fix test
./memory-leak-testing/scripts/run_memory_leak_test.sh post-fix

# Only generate comparison report
./memory-leak-testing/scripts/run_memory_leak_test.sh compare
```

---

### 🐛 Troubleshooting

#### Common Issues and Solutions

**"Environment validation failed"**
```bash
# Check what's missing
uv run --project memory-leak-testing python memory-leak-testing/scripts/check_environment.py

# Common fixes:
cd memory-leak-testing && uv sync
docker compose up -d
```

**"Web service not responding"**
```bash
# Check service status
docker compose ps

# Check logs
docker compose logs web

# Restart if needed
docker compose restart web
```

**"Database connection failed"**
```bash
# Check database status
docker compose ps rsrdbhost

# Restart database
docker compose restart rsrdbhost

# Wait for startup
sleep 30
```

**"Target organizations not found"**
```bash
# Reload production data
cd scripts/data
./make-and-restore-production-dump.sh
cd ../../

# Verify again
uv run --project memory-leak-testing python memory-leak-testing/scripts/verify_test_data.py
```

**"Memory profiling not working"**
```bash
# Check metrics endpoints (use credentials from docker-compose.override.yaml)
curl -u devuser:devpass http://localhost/metrics | grep memory
curl -u devuser:devpass http://localhost/report-metrics | grep memory

# Check environment variables
docker compose config | grep MEMORY
```

---

### 📚 Available Scripts Reference

#### Main Testing Scripts
- `check_environment.py` - Environment validation
- `verify_test_data.py` - Database verification
- `memory_leak_tester.py` - Core testing framework
- `compare_test_results.py` - Results comparison
- `run_memory_leak_test.sh` - Advanced test runner
- `pre_fix_test.sh` - Pre-fix testing
- `post_fix_test.sh` - Post-fix testing
- `quick_setup.sh` - Complete automated setup

#### Quick Reference Commands
```bash
# Complete setup
./quick_setup.sh

# Environment check
uv run --project memory-leak-testing python memory-leak-testing/scripts/check_environment.py

# Database verification
uv run --project memory-leak-testing python memory-leak-testing/scripts/verify_test_data.py

# Quick test
uv run --project memory-leak-testing python memory-leak-testing/scripts/memory_leak_tester.py --duration=5

# Pre-fix baseline
./memory-leak-testing/scripts/pre_fix_test.sh

# Post-fix validation
./memory-leak-testing/scripts/post_fix_test.sh

# Manual comparison
uv run --project memory-leak-testing python memory-leak-testing/scripts/compare_test_results.py
```

---

This test plan provides a comprehensive framework to validate memory leak fixes with quantifiable metrics that directly correspond to the production issue analysis.