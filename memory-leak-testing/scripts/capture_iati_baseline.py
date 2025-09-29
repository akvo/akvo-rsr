#!/usr/bin/env python3
"""
IATI XML Baseline Capture Script

This script captures baseline IATI XML documents for integrity validation
during memory leak fixes. It targets the organizations identified in the
production memory leak analysis.

Usage:
    uv run --project memory-leak-testing python memory-leak-testing/scripts/capture_iati_baseline.py

Requirements:
    - Django development server running
    - Target organizations available in database
    - Write access to memory-leak-testing/baselines/ directory
"""

import os
import sys
import json
import hashlib
import requests
from datetime import datetime
from pathlib import Path

# Add the project root to Python path for Django imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../'))

def setup_django():
    """Initialize Django environment for database access."""
    import django
    from django.conf import settings

    if not settings.configured:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'akvo.settings')
        django.setup()

def capture_iati_baseline():
    """Capture baseline IATI XML documents for target organizations."""

    # Target organizations from production memory leak analysis
    target_orgs = [6313, 6375, 6195, 3257]

    # Base URL for IATI endpoints (adjust if needed)
    base_url = "http://localhost"

    # Create baselines directory
    baselines_dir = Path(__file__).parent.parent / "baselines"
    baselines_dir.mkdir(exist_ok=True)

    print(f"Capturing IATI baselines for {len(target_orgs)} organizations...")
    print(f"Baseline files will be saved to: {baselines_dir}")

    captured_baselines = []

    for org_id in target_orgs:
        print(f"\n--- Processing Organization {org_id} ---")

        try:
            # Capture IATI organization XML
            org_result = capture_iati_org_xml(base_url, org_id, baselines_dir)
            captured_baselines.append(org_result)

            # Capture IATI activity XML if organization has projects
            activity_result = capture_iati_activity_xml(base_url, org_id, baselines_dir)
            if activity_result:
                captured_baselines.append(activity_result)

        except Exception as e:
            print(f"ERROR: Failed to capture baseline for org {org_id}: {e}")
            captured_baselines.append({
                'org_id': org_id,
                'status': 'failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })

    # Save summary metadata
    summary_file = baselines_dir / "baseline_capture_summary.json"
    summary = {
        'capture_timestamp': datetime.now().isoformat(),
        'total_organizations': len(target_orgs),
        'successful_captures': len([r for r in captured_baselines if r.get('status') == 'success']),
        'failed_captures': len([r for r in captured_baselines if r.get('status') == 'failed']),
        'baselines': captured_baselines
    }

    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n=== Baseline Capture Summary ===")
    print(f"Total organizations: {summary['total_organizations']}")
    print(f"Successful captures: {summary['successful_captures']}")
    print(f"Failed captures: {summary['failed_captures']}")
    print(f"Summary saved to: {summary_file}")

    return summary

def capture_iati_org_xml(base_url, org_id, baselines_dir):
    """Capture IATI organization XML for a specific organization."""

    print(f"  Fetching IATI org XML for organization {org_id}...")

    try:
        # Fetch IATI organization XML
        url = f"{base_url}/organisation/{org_id}/iati-org/.xml"
        response = requests.get(url, timeout=60)

        if response.status_code == 200:
            xml_content = response.text

            # Generate metadata
            metadata = {
                'org_id': org_id,
                'endpoint_type': 'iati-org',
                'url': url,
                'timestamp': datetime.now().isoformat(),
                'xml_size_bytes': len(xml_content.encode('utf-8')),
                'xml_hash': hashlib.sha256(xml_content.encode('utf-8')).hexdigest(),
                'status_code': response.status_code,
                'status': 'success'
            }

            # Save XML file
            xml_filename = f"baseline_org_{org_id}_iati-org.xml"
            xml_file = baselines_dir / xml_filename
            with open(xml_file, 'w', encoding='utf-8') as f:
                f.write(xml_content)

            # Save metadata
            metadata_filename = f"baseline_org_{org_id}_iati-org.json"
            metadata_file = baselines_dir / metadata_filename
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)

            print(f"    ✓ Successfully captured IATI org XML ({metadata['xml_size_bytes']} bytes)")
            print(f"    ✓ Files saved: {xml_filename}, {metadata_filename}")

            return metadata

        else:
            error_msg = f"HTTP {response.status_code}: {response.text[:200]}"
            print(f"    ✗ Failed to fetch IATI org XML: {error_msg}")
            return {
                'org_id': org_id,
                'endpoint_type': 'iati-org',
                'url': url,
                'status': 'failed',
                'error': error_msg,
                'status_code': response.status_code,
                'timestamp': datetime.now().isoformat()
            }

    except Exception as e:
        error_msg = f"Request failed: {str(e)}"
        print(f"    ✗ Exception during IATI org XML capture: {error_msg}")
        return {
            'org_id': org_id,
            'endpoint_type': 'iati-org',
            'status': 'failed',
            'error': error_msg,
            'timestamp': datetime.now().isoformat()
        }

def capture_iati_activity_xml(base_url, org_id, baselines_dir):
    """Capture IATI activity XML for a specific organization (if available)."""

    print(f"  Checking for IATI activity XML for organization {org_id}...")

    try:
        # Try to fetch IATI activity XML
        url = f"{base_url}/organisation/{org_id}/iati/"
        response = requests.get(url, timeout=60)

        if response.status_code == 200:
            xml_content = response.text

            # Only save if it's actually XML content (not empty or error page)
            if xml_content.strip().startswith('<?xml') or xml_content.strip().startswith('<'):
                # Generate metadata
                metadata = {
                    'org_id': org_id,
                    'endpoint_type': 'iati-activity',
                    'url': url,
                    'timestamp': datetime.now().isoformat(),
                    'xml_size_bytes': len(xml_content.encode('utf-8')),
                    'xml_hash': hashlib.sha256(xml_content.encode('utf-8')).hexdigest(),
                    'status_code': response.status_code,
                    'status': 'success'
                }

                # Save XML file
                xml_filename = f"baseline_org_{org_id}_iati-activity.xml"
                xml_file = baselines_dir / xml_filename
                with open(xml_file, 'w', encoding='utf-8') as f:
                    f.write(xml_content)

                # Save metadata
                metadata_filename = f"baseline_org_{org_id}_iati-activity.json"
                metadata_file = baselines_dir / metadata_filename
                with open(metadata_file, 'w') as f:
                    json.dump(metadata, f, indent=2)

                print(f"    ✓ Successfully captured IATI activity XML ({metadata['xml_size_bytes']} bytes)")
                print(f"    ✓ Files saved: {xml_filename}, {metadata_filename}")

                return metadata
            else:
                print(f"    ◦ No valid IATI activity XML found (non-XML response)")
                return None

        elif response.status_code == 404:
            print(f"    ◦ No IATI activity XML available (404)")
            return None
        else:
            print(f"    ◦ IATI activity XML not available (HTTP {response.status_code})")
            return None

    except Exception as e:
        print(f"    ◦ Could not check IATI activity XML: {str(e)}")
        return None

def verify_django_setup():
    """Verify that Django is properly configured and organizations exist."""

    try:
        setup_django()
        from akvo.rsr.models import Organisation

        target_orgs = [6313, 6375, 6195, 3257]
        existing_orgs = []

        for org_id in target_orgs:
            try:
                org = Organisation.objects.get(pk=org_id)
                existing_orgs.append((org_id, org.name))
            except Organisation.DoesNotExist:
                print(f"WARNING: Organization {org_id} not found in database")

        print(f"Found {len(existing_orgs)} target organizations in database:")
        for org_id, name in existing_orgs:
            print(f"  - {org_id}: {name}")

        return len(existing_orgs) > 0

    except Exception as e:
        print(f"WARNING: Could not verify Django setup: {e}")
        print("Proceeding with HTTP requests anyway...")
        return True

def check_server_availability():
    """Check if the development server is running and accessible."""

    base_url = "http://localhost"

    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"✓ Development server is accessible at {base_url}")
        return True
    except Exception as e:
        print(f"✗ Development server not accessible at {base_url}: {e}")
        print("Please ensure the development server is running:")
        print("  docker compose up -d")
        return False

def main():
    """Main script execution."""

    print("=== IATI XML Baseline Capture ===")
    print("This script captures baseline IATI XML documents for memory leak testing.")
    print()

    # Check server availability
    if not check_server_availability():
        sys.exit(1)

    # Verify Django setup (optional, will proceed anyway)
    verify_django_setup()

    print("\nStarting baseline capture...")

    try:
        summary = capture_iati_baseline()

        if summary['successful_captures'] > 0:
            print(f"\n✓ Baseline capture completed successfully!")
            print(f"  Captured {summary['successful_captures']} baseline documents")
            print(f"  Ready for memory leak fix implementation with XML integrity validation")
            sys.exit(0)
        else:
            print(f"\n✗ Baseline capture failed!")
            print(f"  No baselines were successfully captured")
            print(f"  Please check server availability and organization data")
            sys.exit(1)

    except KeyboardInterrupt:
        print("\n\nBaseline capture interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error during baseline capture: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()