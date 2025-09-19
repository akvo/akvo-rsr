#!/usr/bin/env python3
"""
Database verification helper for memory leak testing.
Verifies that production data is correctly loaded and target organizations exist.
"""
import os
import sys
import subprocess
import json

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

def run_django_shell_command(command):
    """Run a Django shell command via docker compose."""
    try:
        full_command = [
            'docker', 'compose', 'exec', '-T', 'web',
            'python', 'manage.py', 'shell', '-c', command
        ]

        result = subprocess.run(
            full_command,
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            return result.stdout.strip(), None
        else:
            return None, result.stderr.strip()

    except subprocess.TimeoutExpired:
        return None, "Command timed out"
    except Exception as e:
        return None, str(e)

def verify_database_connection():
    """Test basic database connectivity."""
    print_status("Testing database connection...")

    command = """
try:
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    print("Database connection successful")
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)
"""

    output, error = run_django_shell_command(command)
    if error:
        print_status(f"Database connection failed: {error}", "ERROR")
        return False
    else:
        print_status("Database connection successful", "SUCCESS")
        return True

def get_database_statistics():
    """Get basic database statistics."""
    print_status("Gathering database statistics...")

    command = """
from akvo.rsr.models import Organisation, Project
from django.db.models import Count
import json

stats = {
    'total_organisations': Organisation.objects.count(),
    'total_projects': Project.objects.count(),
    'large_orgs_count': Organisation.objects.annotate(project_count=Count('projects')).filter(project_count__gt=10).count(),
    'very_large_orgs_count': Organisation.objects.annotate(project_count=Count('projects')).filter(project_count__gt=100).count()
}

print(json.dumps(stats))
"""

    output, error = run_django_shell_command(command)
    if error:
        print_status(f"Failed to get database statistics: {error}", "ERROR")
        return None

    try:
        stats = json.loads(output)
        print_status(f"Total organisations: {stats['total_organisations']}", "INFO")
        print_status(f"Total projects: {stats['total_projects']}", "INFO")
        print_status(f"Large orgs (>10 projects): {stats['large_orgs_count']}", "INFO")
        print_status(f"Very large orgs (>100 projects): {stats['very_large_orgs_count']}", "INFO")
        return stats
    except json.JSONDecodeError:
        print_status(f"Unexpected output: {output}", "ERROR")
        return None

def verify_target_organizations():
    """Verify that target test organizations exist in the database."""
    print_status("Verifying target test organizations...")

    # These are the organizations used in the memory leak analysis
    target_orgs = [6195, 3257, 4144, 13, 4645, 5844, 6313, 6375, 4651, 4143]

    command = f"""
from akvo.rsr.models import Organisation
import json

target_orgs = {target_orgs}
results = {{}}

for org_id in target_orgs:
    try:
        org = Organisation.objects.get(pk=org_id)
        project_count = org.projects.count()
        results[org_id] = {{
            'exists': True,
            'name': org.name[:50],  # Truncate long names
            'project_count': project_count
        }}
    except Organisation.DoesNotExist:
        results[org_id] = {{'exists': False}}

print(json.dumps(results))
"""

    output, error = run_django_shell_command(command)
    if error:
        print_status(f"Failed to verify organizations: {error}", "ERROR")
        return False

    try:
        results = json.loads(output)
        available_orgs = []
        missing_orgs = []

        for org_id, data in results.items():
            if data['exists']:
                available_orgs.append(org_id)
                print_status(f"Org {org_id}: {data['name']} ({data['project_count']} projects)", "SUCCESS")
            else:
                missing_orgs.append(org_id)
                print_status(f"Org {org_id}: NOT FOUND", "ERROR")

        print_status(f"Available target orgs: {len(available_orgs)}/{len(target_orgs)}", "INFO")

        if len(available_orgs) >= 8:
            print_status("Sufficient test organizations available", "SUCCESS")
            return True
        elif len(available_orgs) >= 5:
            print_status("Minimum test organizations available", "WARNING")
            print_status("Testing will work but may not fully replicate production patterns", "WARNING")
            return True
        else:
            print_status("Insufficient test organizations available", "ERROR")
            print_status("Need at least 5 target organizations for meaningful testing", "ERROR")
            return False

    except json.JSONDecodeError:
        print_status(f"Unexpected output: {output}", "ERROR")
        return False

def suggest_data_loading():
    """Suggest how to load production data if needed."""
    print_status("Database appears to be empty or missing production data", "WARNING")
    print("\nTo load production data:")
    print("1. cd scripts/data")
    print("2. ./make-and-restore-production-dump.sh")
    print("3. Wait for data loading to complete")
    print("4. Run this verification script again")

def main():
    """Run database verification."""
    print("=" * 60)
    print("🗄️  Database Verification for Memory Leak Testing")
    print("=" * 60)

    # Check if we're in the right directory
    if not os.path.exists('scripts/data/make-and-restore-production-dump.sh'):
        print_status("Must run from akvo-rsr root directory", "ERROR")
        return 1

    checks = []

    # Test database connection
    db_connected = verify_database_connection()
    checks.append(("Database Connection", db_connected))

    if not db_connected:
        return 1

    # Get database statistics
    stats = get_database_statistics()
    if stats is None:
        return 1

    # Check if database seems empty
    if stats['total_organisations'] < 100 or stats['total_projects'] < 100:
        suggest_data_loading()
        return 1

    # Verify target organizations
    orgs_verified = verify_target_organizations()
    checks.append(("Target Organizations", orgs_verified))

    print("\n" + "=" * 60)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in checks if result)

    for name, result in checks:
        if result:
            print_status(f"{name}: PASSED", "SUCCESS")
        else:
            print_status(f"{name}: FAILED", "ERROR")

    if passed == len(checks):
        print_status("Database is ready for memory leak testing! 🎉", "SUCCESS")
        print("\nYou can now run memory leak tests:")
        print("• Quick test: python3 memory_leak_tester.py --duration 5")
        print("• IATI scenario: python3 memory_leak_tester.py --scenario iati --duration 30")
        print("• Full test cycle: ./run_memory_leak_test.sh full")
        return 0
    else:
        print_status("Database verification failed", "ERROR")
        if stats and stats['total_organisations'] < 100:
            suggest_data_loading()
        return 1

if __name__ == "__main__":
    sys.exit(main())