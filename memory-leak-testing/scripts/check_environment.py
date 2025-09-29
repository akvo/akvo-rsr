#!/usr/bin/env python3
"""
Simple environment validation for memory leak testing.
Checks if all prerequisites are met before running tests.
"""
import sys
import os
import subprocess
import importlib.util
import urllib.request
import urllib.error

def print_status(message, status="INFO"):
    colors = {
        "INFO": "\033[0;34m",
        "SUCCESS": "\033[0;32m",
        "WARNING": "\033[1;33m",
        "ERROR": "\033[0;31m"
    }
    reset = "\033[0m"
    prefix = {"INFO": "ℹ️", "SUCCESS": "✅", "WARNING": "⚠️", "ERROR": "❌"}
    print(f"{colors.get(status, '')}{prefix.get(status, '')} {message}{reset}")

def check_python_packages():
    """Check if required Python packages are available."""
    print_status("Checking Python packages...")

    required = {
        'aiohttp': 'Required for async HTTP testing',
        'psutil': 'Required for memory monitoring'
    }
    optional = {
        'pandas': 'For enhanced data analysis',
        'matplotlib': 'For generating charts',
        'seaborn': 'For enhanced visualizations'
    }

    missing_required = []
    missing_optional = []

    for pkg, description in required.items():
        if importlib.util.find_spec(pkg) is None:
            missing_required.append(pkg)
            print_status(f"Missing {pkg}: {description}", "ERROR")
        else:
            print_status(f"Found {pkg}", "SUCCESS")

    for pkg, description in optional.items():
        if importlib.util.find_spec(pkg) is None:
            missing_optional.append(pkg)
            print_status(f"Missing {pkg}: {description}", "WARNING")
        else:
            print_status(f"Found {pkg}", "SUCCESS")

    if missing_required:
        print_status(f"Install missing packages: pip3 install {' '.join(missing_required)}", "ERROR")
        return False

    if missing_optional:
        print_status(f"Optional packages missing. Install with: pip3 install {' '.join(missing_optional)}", "WARNING")

    return True

def check_docker_services():
    """Check if Docker services are running."""
    print_status("Checking Docker services...")

    try:
        # Check if docker compose is available
        result = subprocess.run(['docker', 'compose', 'version'],
                              capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            print_status("Docker Compose not available", "ERROR")
            return False

        print_status("Docker Compose is available", "SUCCESS")

        # Check service status
        result = subprocess.run(['docker', 'compose', 'ps'],
                              capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            print_status("Failed to get Docker service status", "ERROR")
            return False

        output = result.stdout
        required_services = ['web', 'rsrdbhost']
        optional_services = ['rsr-memcached']

        all_required_running = True
        for service in required_services:
            # Check if service appears in ps output and has "Up" status
            if service in output and 'Up' in output:
                print_status(f"Service {service} is running", "SUCCESS")
            else:
                print_status(f"Service {service} is not running", "ERROR")
                all_required_running = False

        for service in optional_services:
            if service in output and 'Up' in output:
                print_status(f"Service {service} is running", "SUCCESS")
            else:
                print_status(f"Service {service} is not running (optional)", "WARNING")

        if not all_required_running:
            print_status("Start services with: docker compose up -d", "ERROR")

        return all_required_running

    except (FileNotFoundError, subprocess.TimeoutExpired):
        print_status("Docker not found or not responding", "ERROR")
        return False

def check_test_files():
    """Check if test files exist."""
    print_status("Checking test files...")

    # Get the script directory and project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))

    files = {
        os.path.join(script_dir, 'memory_leak_tester.py'): 'Main testing script',
        os.path.join(script_dir, 'run_memory_leak_test.sh'): 'Test execution script',
        os.path.join(script_dir, 'compare_test_results.py'): 'Results comparison script',
        os.path.join(project_root, 'scripts/data/make-and-restore-production-dump.sh'): 'Database setup script'
    }

    all_exist = True
    for file_path, description in files.items():
        file_name = os.path.basename(file_path)
        try:
            with open(file_path, 'r'):
                print_status(f"Found {file_name}: {description}", "SUCCESS")
        except FileNotFoundError:
            print_status(f"Missing {file_name}: {description}", "ERROR")
            all_exist = False

    return all_exist

def check_web_service():
    """Check if web service is responding."""
    print_status("Checking web service...")

    try:
        # Check web service health via docker compose exec
        result = subprocess.run([
            'docker', 'compose', 'exec', '-T', 'web',
            'curl', '-f', 'http://localhost:8000/healthz'
        ], capture_output=True, text=True, timeout=10)

        if result.returncode == 0:
            print_status("Web service is responding (internal health check)", "SUCCESS")
            return True
        else:
            # Try alternative health check
            result = subprocess.run([
                'docker', 'compose', 'exec', '-T', 'web',
                'curl', '-f', 'http://localhost:8000/'
            ], capture_output=True, text=True, timeout=10)

            if result.returncode == 0:
                print_status("Web service is responding (alternative check)", "SUCCESS")
                return True
            else:
                print_status("Web service not responding internally", "ERROR")
                print_status("Check with: docker compose logs web", "INFO")
                return False

    except (subprocess.TimeoutExpired, FileNotFoundError):
        print_status("Cannot test web service (docker/curl not available)", "WARNING")
        print_status("Assuming web service is working if container is running", "INFO")
        return True

def check_memory_profiling():
    """Check if memory profiling is configured."""
    print_status("Checking memory profiling configuration...")

    endpoints = [
        ('Web container metrics', 'http://localhost/metrics'),
        ('Reports container metrics', 'http://localhost/report-metrics')
    ]

    all_working = True

    for name, url in endpoints:
        try:
            result = subprocess.run([
                'curl', '-s', '-u', 'devuser:devpass', url
            ], capture_output=True, text=True, timeout=10)

            if result.returncode == 0:
                content = result.stdout
                if 'django_memory_usage_bytes' in content:
                    print_status(f"{name}: Memory profiling active", "SUCCESS")
                else:
                    print_status(f"{name}: Memory profiling metrics not found", "WARNING")
                    all_working = False
            else:
                print_status(f"{name}: Cannot access endpoint", "WARNING")
                all_working = False

        except (subprocess.TimeoutExpired, FileNotFoundError):
            print_status(f"{name}: Cannot test (curl not available)", "WARNING")
            all_working = False

    if all_working:
        print_status("All memory profiling endpoints are working", "SUCCESS")

    return all_working

def main():
    """Run all validation checks."""
    print("=" * 60)
    print("🔍 Memory Leak Testing Environment Validation")
    print("=" * 60)

    checks = [
        ("Python Packages", check_python_packages()),
        ("Docker Services", check_docker_services()),
        ("Test Files", check_test_files()),
        ("Web Service", check_web_service()),
        ("Memory Profiling", check_memory_profiling())
    ]

    print("\n" + "=" * 60)
    print("📋 VALIDATION SUMMARY")
    print("=" * 60)

    passed = 0
    for name, result in checks:
        if result:
            print_status(f"{name}: PASSED", "SUCCESS")
            passed += 1
        else:
            print_status(f"{name}: FAILED", "ERROR")

    print(f"\nPassed: {passed}/{len(checks)} checks")

    if passed == len(checks):
        print_status("Environment is ready for memory leak testing! 🎉", "SUCCESS")
        print("\nNext steps:")
        print("1. Load test data: cd scripts/data && ./make-and-restore-production-dump.sh")
        print("2. Run quick test: python3 memory_leak_tester.py --duration 5")
        print("3. Full test cycle: ./run_memory_leak_test.sh full")
        return 0
    elif passed >= 3:
        print_status("Environment mostly ready with some warnings", "WARNING")
        print("You can proceed but some features may not work perfectly.")
        return 0
    else:
        print_status("Environment not ready - fix the failed checks above", "ERROR")
        return 1

if __name__ == "__main__":
    sys.exit(main())