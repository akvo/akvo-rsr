#!/usr/bin/env python3
"""
Memory leak load test framework for Akvo RSR IATI endpoints
Based on production memory leak analysis findings
"""
import asyncio
import aiohttp
import psutil
import time
import json
import csv
import argparse
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import logging
import os
import sys

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('memory_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MemoryLeakTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.memory_data = []
        self.request_data = []
        self.start_time = None
        
        # Get Docker container process if running in container
        self.process = self._get_target_process()
        
    def _get_target_process(self):
        """Find the Django process to monitor"""
        try:
            # First try to find gunicorn master process
            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                if 'gunicorn' in proc.info['name'] and 'master' in ' '.join(proc.info['cmdline']):
                    logger.info(f"Found gunicorn master process: {proc.info['pid']}")
                    return proc
            
            # Fallback to current process (if running tests directly)
            logger.info("Using current process for memory monitoring")
            return psutil.Process()
            
        except Exception as e:
            logger.warning(f"Could not identify target process: {e}")
            return psutil.Process()
        
    def get_memory_usage(self):
        """Get current memory usage in MB with additional system metrics"""
        try:
            memory_info = self.process.memory_info()
            system_memory = psutil.virtual_memory()
            
            return {
                'timestamp': datetime.now().isoformat(),
                'rss_mb': memory_info.rss / 1024 / 1024,
                'vms_mb': memory_info.vms / 1024 / 1024,
                'percent': self.process.memory_percent(),
                'system_used_percent': system_memory.percent,
                'system_available_mb': system_memory.available / 1024 / 1024,
                'elapsed_minutes': (time.time() - self.start_time) / 60 if self.start_time else 0
            }
        except Exception as e:
            logger.error(f"Error getting memory usage: {e}")
            return {
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'elapsed_minutes': (time.time() - self.start_time) / 60 if self.start_time else 0
            }
    
    async def make_request(self, session, url, request_id, timeout=300):
        """Make individual request and measure response time"""
        start_time = time.time()
        memory_before = self.get_memory_usage()
        
        try:
            async with session.get(url, timeout=timeout) as response:
                content = await response.read()
                content_length = len(content)
                duration = time.time() - start_time
                memory_after = self.get_memory_usage()
                
                self.request_data.append({
                    'request_id': request_id,
                    'url': url,
                    'status': response.status,
                    'duration_s': duration,
                    'content_length': content_length,
                    'memory_before_mb': memory_before.get('rss_mb', 0),
                    'memory_after_mb': memory_after.get('rss_mb', 0),
                    'memory_delta_mb': memory_after.get('rss_mb', 0) - memory_before.get('rss_mb', 0),
                    'timestamp': datetime.now().isoformat()
                })
                
                # Log slow requests (matching production patterns)
                if duration > 10:
                    logger.warning(f"Slow request {request_id}: {url} took {duration:.2f}s")
                
                return response.status, duration
                
        except asyncio.TimeoutError:
            duration = time.time() - start_time
            logger.error(f"Request {request_id} timed out after {duration:.2f}s: {url}")
            
            self.request_data.append({
                'request_id': request_id,
                'url': url,
                'status': 'TIMEOUT',
                'duration_s': duration,
                'error': f'Timeout after {timeout}s',
                'timestamp': datetime.now().isoformat()
            })
            return 'TIMEOUT', duration
            
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"Request {request_id} failed: {e}")
            
            self.request_data.append({
                'request_id': request_id,
                'url': url,
                'status': 'ERROR',
                'duration_s': duration,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            return 'ERROR', duration
    
    async def run_load_test(self, endpoints, concurrent_requests=5, duration_minutes=30, 
                           request_interval=2, scenario_name="default"):
        """Run load test against specified endpoints"""
        logger.info(f"=== Starting {scenario_name} Load Test ===")
        logger.info(f"Duration: {duration_minutes} minutes")
        logger.info(f"Concurrent requests: {concurrent_requests}")
        logger.info(f"Target endpoints: {len(endpoints)}")
        logger.info(f"Request interval: {request_interval} seconds")
        
        self.start_time = time.time()
        end_time = self.start_time + (duration_minutes * 60)
        request_id = 0
        batch_count = 0
        
        # Record initial memory state
        initial_memory = self.get_memory_usage()
        logger.info(f"Initial memory usage: {initial_memory['rss_mb']:.2f} MB")
        
        async with aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=300),  # 5 minute timeout
            connector=aiohttp.TCPConnector(limit=concurrent_requests * 2)
        ) as session:
            
            while time.time() < end_time:
                batch_start = time.time()
                batch_count += 1
                
                # Record memory usage
                memory_usage = self.get_memory_usage()
                self.memory_data.append(memory_usage)
                
                # Log memory growth every 5 minutes
                if batch_count % 150 == 0:  # 150 batches = ~5 minutes at 2s intervals
                    memory_growth = memory_usage['rss_mb'] - initial_memory['rss_mb']
                    elapsed_minutes = memory_usage['elapsed_minutes']
                    growth_rate = memory_growth / elapsed_minutes * 60 if elapsed_minutes > 0 else 0
                    logger.info(f"Memory growth: {memory_growth:.2f} MB ({growth_rate:.2f} MB/h)")
                
                # Create batch of concurrent requests
                tasks = []
                for _ in range(concurrent_requests):
                    endpoint = endpoints[request_id % len(endpoints)]
                    url = f"{self.base_url}{endpoint}"
                    tasks.append(self.make_request(session, url, request_id))
                    request_id += 1
                
                # Execute requests concurrently
                try:
                    await asyncio.gather(*tasks, return_exceptions=True)
                except Exception as e:
                    logger.error(f"Batch {batch_count} failed: {e}")
                
                # Wait before next batch (accounting for request execution time)
                batch_duration = time.time() - batch_start
                sleep_time = max(0, request_interval - batch_duration)
                if sleep_time > 0:
                    await asyncio.sleep(sleep_time)
                
        # Final memory measurement
        final_memory = self.get_memory_usage()
        total_memory_growth = final_memory['rss_mb'] - initial_memory['rss_mb']
        
        logger.info(f"=== Test Completed ===")
        logger.info(f"Total requests: {request_id}")
        logger.info(f"Total batches: {batch_count}")
        logger.info(f"Final memory: {final_memory['rss_mb']:.2f} MB")
        logger.info(f"Total memory growth: {total_memory_growth:.2f} MB")
        
        return self.analyze_results(scenario_name)
    
    def analyze_results(self, scenario_name="default"):
        """Analyze memory growth and request performance"""
        if len(self.memory_data) < 2:
            return {"error": "Insufficient data for analysis"}
        
        # Memory analysis
        start_memory = self.memory_data[0]['rss_mb']
        end_memory = self.memory_data[-1]['rss_mb']
        peak_memory = max(m['rss_mb'] for m in self.memory_data if 'rss_mb' in m)
        memory_growth = end_memory - start_memory
        
        # Calculate memory growth rate (MB/hour)
        duration_hours = self.memory_data[-1]['elapsed_minutes'] / 60
        growth_rate_mb_h = memory_growth / duration_hours if duration_hours > 0 else 0
        
        # Request performance analysis
        successful_requests = [r for r in self.request_data if r.get('status') == 200]
        failed_requests = [r for r in self.request_data if r.get('status') not in [200, 'ERROR', 'TIMEOUT']]
        timeout_requests = [r for r in self.request_data if r.get('status') == 'TIMEOUT']
        error_requests = [r for r in self.request_data if r.get('status') == 'ERROR']
        
        # Response time analysis
        if successful_requests:
            response_times = [r['duration_s'] for r in successful_requests]
            avg_response_time = sum(response_times) / len(response_times)
            p95_response_time = sorted(response_times)[int(len(response_times) * 0.95)]
        else:
            avg_response_time = 0
            p95_response_time = 0
        
        # Memory leak indicators
        slow_requests = [r for r in self.request_data if r.get('duration_s', 0) > 30]
        memory_growth_per_request = memory_growth / len(self.request_data) if self.request_data else 0
        
        results = {
            'scenario': scenario_name,
            'test_duration_minutes': duration_hours * 60,
            'timestamp': datetime.now().isoformat(),
            
            'memory_analysis': {
                'start_memory_mb': round(start_memory, 2),
                'end_memory_mb': round(end_memory, 2),
                'peak_memory_mb': round(peak_memory, 2),
                'memory_growth_mb': round(memory_growth, 2),
                'growth_rate_mb_h': round(growth_rate_mb_h, 2),
                'memory_growth_per_request_kb': round(memory_growth_per_request * 1024, 2),
                'memory_stability': memory_growth < 50  # Target: <50MB growth
            },
            
            'request_analysis': {
                'total_requests': len(self.request_data),
                'successful_requests': len(successful_requests),
                'failed_requests': len(failed_requests),
                'timeout_requests': len(timeout_requests),
                'error_requests': len(error_requests),
                'success_rate_percent': round(len(successful_requests) / len(self.request_data) * 100, 2) if self.request_data else 0,
                'avg_response_time_s': round(avg_response_time, 2),
                'p95_response_time_s': round(p95_response_time, 2),
                'max_response_time_s': round(max(r.get('duration_s', 0) for r in self.request_data), 2),
                'slow_requests_over_30s': len(slow_requests),
                'requests_per_minute': round(len(self.request_data) / (duration_hours * 60), 2) if duration_hours > 0 else 0
            },
            
            'performance_indicators': {
                'memory_leak_detected': growth_rate_mb_h > 100,  # >100 MB/h indicates leak
                'performance_degradation': avg_response_time > 10,  # >10s indicates issues
                'system_instability': len(timeout_requests) / len(self.request_data) > 0.1 if self.request_data else False,
                'iati_performance_acceptable': avg_response_time < 10 and len(timeout_requests) == 0
            }
        }
        
        return results
    
    def save_results(self, results, test_type="default"):
        """Save test results to files for comparison"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create results directory
        results_dir = "memory_test_results"
        os.makedirs(results_dir, exist_ok=True)
        
        # Save analysis results
        results_file = f"{results_dir}/{test_type}_results_{timestamp}.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        logger.info(f"Results saved to: {results_file}")
        
        # Save raw memory data
        if self.memory_data:
            memory_file = f"{results_dir}/{test_type}_memory_{timestamp}.csv"
            with open(memory_file, 'w', newline='') as f:
                fieldnames = self.memory_data[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.memory_data)
            logger.info(f"Memory data saved to: {memory_file}")
        
        # Save raw request data
        if self.request_data:
            requests_file = f"{results_dir}/{test_type}_requests_{timestamp}.csv"
            with open(requests_file, 'w', newline='') as f:
                fieldnames = self.request_data[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.request_data)
            logger.info(f"Request data saved to: {requests_file}")
        
        return results_file

def main():
    parser = argparse.ArgumentParser(description='Memory leak load test for Akvo RSR')
    parser.add_argument('--test-type', default='baseline', help='Test type (pre-fix, post-fix, baseline)')
    parser.add_argument('--scenario', default='iati', choices=['iati', 'mixed', 'stress'], help='Test scenario')
    parser.add_argument('--duration', type=int, default=30, help='Test duration in minutes')
    parser.add_argument('--concurrent', type=int, default=5, help='Concurrent requests')
    parser.add_argument('--base-url', default='http://localhost:8000', help='Base URL for testing')
    
    args = parser.parse_args()
    
    # Test endpoint configurations based on production analysis
    IATI_ENDPOINTS = [
        "/organisation/6195/iati/",
        "/organisation/3257/iati/", 
        "/organisation/4144/iati/",
        "/organisation/13/iati/",
        "/organisation/4645/iati/",
        "/organisation/5844/iati/",
        "/organisation/6313/iati/",
        "/organisation/6375/iati-org/.xml",
        "/organisation/4651/iati/",
        "/organisation/4143/iati/",
        "/organisation/2562/iati/"
    ]
    
    API_ENDPOINTS = [
        "/rest/v1/project_by_uuid/?format=csv&ordering=-default_finance_type&page=1",
        "/rest/v1/project_by_uuid/?format=csv&ordering=-default_finance_type&page=7", 
        "/rest/v1/project_up/?format=xml&ordering=-donate_url&page=10",
        "/rest/v1/project/427/?format=json",
        "/metrics"
    ]
    
    # Test scenario configurations matching the test plan
    SCENARIO_CONFIGS = {
        'iati': {
            'name': 'IATI_BULK_SIMULATION',
            'endpoints': IATI_ENDPOINTS,
            'concurrent_requests': 3,  # Match production concurrent IATI requests
            'request_interval': 5,
            'description': 'Replicate the IATI Bulk Data Service load pattern'
        },
        'mixed': {
            'name': 'MIXED_API_LOAD',
            'endpoints': IATI_ENDPOINTS + API_ENDPOINTS,
            'concurrent_requests': 8,
            'request_interval': 2,
            'description': 'Test secondary endpoints during IATI processing'
        },
        'stress': {
            'name': 'DB_CONNECTION_STRESS',
            'endpoints': [f'/organisation/{i}/iati/' for i in range(1, 100)],
            'concurrent_requests': 15,
            'request_interval': 1,
            'description': 'Test database connection pool behavior'
        }
    }

    # Get scenario configuration
    scenario_config = SCENARIO_CONFIGS[args.scenario]
    endpoints = scenario_config['endpoints']
    scenario_name = f"{scenario_config['name']}_{args.test_type}"

    # Override concurrent requests and interval if not specified by user
    if args.concurrent == 5:  # Default value, use scenario default
        concurrent_requests = scenario_config['concurrent_requests']
    else:
        concurrent_requests = args.concurrent

    request_interval = scenario_config['request_interval']

    logger.info(f"Scenario: {scenario_config['description']}")
    logger.info(f"Concurrent requests: {concurrent_requests} (scenario optimized)")
    logger.info(f"Request interval: {request_interval}s (scenario optimized)")
    
    # Run the test
    tester = MemoryLeakTester(args.base_url)
    
    try:
        results = asyncio.run(tester.run_load_test(
            endpoints=endpoints,
            concurrent_requests=concurrent_requests,
            duration_minutes=args.duration,
            request_interval=request_interval,
            scenario_name=scenario_name
        ))
        
        # Save results
        results_file = tester.save_results(results, args.test_type)
        
        # Print summary
        print("\n" + "="*60)
        print(f"MEMORY LEAK TEST SUMMARY - {args.test_type.upper()}")
        print("="*60)
        print(f"Scenario: {scenario_name}")
        print(f"Duration: {results['test_duration_minutes']:.1f} minutes")
        print(f"Total Requests: {results['request_analysis']['total_requests']}")
        print(f"Success Rate: {results['request_analysis']['success_rate_percent']:.1f}%")
        print(f"Memory Growth: {results['memory_analysis']['memory_growth_mb']:.2f} MB")
        print(f"Growth Rate: {results['memory_analysis']['growth_rate_mb_h']:.2f} MB/hour")
        print(f"Avg Response Time: {results['request_analysis']['avg_response_time_s']:.2f}s")
        print(f"Slow Requests (>30s): {results['request_analysis']['slow_requests_over_30s']}")
        
        # Performance assessment
        print("\nPERFORMANCE ASSESSMENT:")
        indicators = results['performance_indicators']
        print(f"Memory Leak Detected: {'YES' if indicators['memory_leak_detected'] else 'NO'}")
        print(f"Performance Issues: {'YES' if indicators['performance_degradation'] else 'NO'}")
        print(f"System Instability: {'YES' if indicators['system_instability'] else 'NO'}")
        print(f"IATI Performance OK: {'YES' if indicators['iati_performance_acceptable'] else 'NO'}")
        
        print(f"\nResults saved to: {results_file}")
        print("="*60)
        
        # Exit with error code if major issues detected
        if indicators['memory_leak_detected'] or indicators['system_instability']:
            sys.exit(1)
        
    except KeyboardInterrupt:
        logger.info("Test interrupted by user")
        if tester.memory_data or tester.request_data:
            results = tester.analyze_results(f"{scenario_name}_INTERRUPTED")
            tester.save_results(results, f"{args.test_type}_interrupted")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()