#!/usr/bin/env python3
"""
IATI XML Integrity Validation Script

This script validates that IATI XML documents remain semantically identical
before and after memory leak fixes. It performs deep XML comparison while
ignoring formatting differences and expected variations like timestamps.

Usage:
    uv run --project memory-leak-testing python memory-leak-testing/scripts/validate_iati_integrity.py --org-id 6313
    uv run --project memory-leak-testing python memory-leak-testing/scripts/validate_iati_integrity.py --validate-all

Requirements:
    - Baseline IATI XML files captured using capture_iati_baseline.py
    - lxml library for XML parsing and comparison
    - Current IATI endpoints accessible for comparison
"""

import os
import sys
import json
import hashlib
import argparse
import requests
from datetime import datetime
from pathlib import Path
from lxml import etree
from typing import Dict, List, Tuple, Optional

class XMLIntegrityError(Exception):
    """Raised when XML content integrity validation fails."""
    pass

class IATIIntegrityValidator:
    """Validates IATI XML document integrity during memory leak fixes."""

    def __init__(self, baselines_dir: Path = None, base_url: str = "http://localhost"):
        self.baselines_dir = baselines_dir or Path(__file__).parent.parent / "baselines"
        self.base_url = base_url
        self.validation_results = []

    def load_baseline_xml(self, org_id: int, endpoint_type: str = 'iati-org') -> str:
        """Load baseline XML content for an organization."""

        baseline_file = self.baselines_dir / f"baseline_org_{org_id}_{endpoint_type}.xml"

        if not baseline_file.exists():
            raise FileNotFoundError(f"Baseline file not found: {baseline_file}")

        with open(baseline_file, 'r', encoding='utf-8') as f:
            return f.read()

    def load_baseline_metadata(self, org_id: int, endpoint_type: str = 'iati-org') -> Dict:
        """Load baseline metadata for an organization."""

        metadata_file = self.baselines_dir / f"baseline_org_{org_id}_{endpoint_type}.json"

        if not metadata_file.exists():
            raise FileNotFoundError(f"Baseline metadata not found: {metadata_file}")

        with open(metadata_file, 'r') as f:
            return json.load(f)

    def fetch_current_xml(self, org_id: int, endpoint_type: str = 'iati-org') -> str:
        """Fetch current IATI XML from the live endpoint."""

        if endpoint_type == 'iati-org':
            url = f"{self.base_url}/organisation/{org_id}/iati-org/.xml"
        elif endpoint_type == 'iati-activity':
            url = f"{self.base_url}/organisation/{org_id}/iati/"
        else:
            raise ValueError(f"Unknown endpoint type: {endpoint_type}")

        response = requests.get(url, timeout=60)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch current XML: HTTP {response.status_code}")

        return response.text

    def normalize_xml_for_comparison(self, xml_content: str) -> etree.Element:
        """
        Normalize XML content for semantic comparison.

        This removes or normalizes elements that are expected to differ:
        - generated-datetime attributes (always different)
        - XML formatting (whitespace, indentation)
        - Attribute ordering
        - Comment nodes
        """

        try:
            # Parse XML
            parser = etree.XMLParser(remove_blank_text=True, remove_comments=True)
            root = etree.fromstring(xml_content.encode('utf-8'), parser)

            # Remove or normalize expected differences
            self._normalize_timestamps(root)
            self._normalize_attributes(root)
            self._sort_elements(root)

            return root

        except etree.XMLSyntaxError as e:
            raise XMLIntegrityError(f"Invalid XML content: {e}")

    def _normalize_timestamps(self, element: etree.Element):
        """Remove or normalize timestamp attributes that are expected to differ."""

        # Remove generated-datetime attributes (always different)
        if 'generated-datetime' in element.attrib:
            del element.attrib['generated-datetime']

        # Recursively process child elements
        for child in element:
            self._normalize_timestamps(child)

    def _normalize_attributes(self, element: etree.Element):
        """Normalize attribute ordering for consistent comparison."""

        # Sort attributes by key for consistent ordering
        if element.attrib:
            sorted_attrib = dict(sorted(element.attrib.items()))
            element.attrib.clear()
            element.attrib.update(sorted_attrib)

        # Recursively process child elements
        for child in element:
            self._normalize_attributes(child)

    def _sort_elements(self, element: etree.Element):
        """Sort child elements for consistent comparison where order doesn't matter."""

        # For certain elements, child order might not be semantically significant
        # This is a conservative approach - only sort where we're certain it's safe

        sortable_parents = {
            'iati-organisations',
            'iati-activities',
            'participating-org-list',  # If these exist
        }

        if element.tag in sortable_parents:
            # Sort children by tag name, then by key attributes
            children = list(element)
            element.clear()

            def sort_key(elem):
                # Sort by tag name first, then by 'ref' or 'id' attributes if present
                primary = elem.tag
                secondary = elem.get('ref', elem.get('id', ''))
                return (primary, secondary)

            sorted_children = sorted(children, key=sort_key)
            element.extend(sorted_children)

        # Recursively process child elements
        for child in element:
            self._sort_elements(child)

    def compare_xml_semantically(self, baseline_xml: str, current_xml: str) -> List[str]:
        """
        Compare two XML documents semantically and return list of differences.

        Returns empty list if documents are semantically identical.
        Returns list of difference descriptions if they differ.
        """

        try:
            # Normalize both XML documents
            baseline_normalized = self.normalize_xml_for_comparison(baseline_xml)
            current_normalized = self.normalize_xml_for_comparison(current_xml)

            # Convert to strings for comparison
            baseline_str = etree.tostring(baseline_normalized, encoding='unicode', pretty_print=True)
            current_str = etree.tostring(current_normalized, encoding='unicode', pretty_print=True)

            # If normalized strings are identical, documents are semantically equal
            if baseline_str == current_str:
                return []

            # If they differ, provide detailed differences
            differences = self._analyze_xml_differences(baseline_normalized, current_normalized)
            return differences

        except Exception as e:
            return [f"XML comparison error: {str(e)}"]

    def _analyze_xml_differences(self, baseline: etree.Element, current: etree.Element) -> List[str]:
        """Analyze and describe specific differences between XML documents."""

        differences = []

        # Compare root element
        if baseline.tag != current.tag:
            differences.append(f"Root element differs: {baseline.tag} vs {current.tag}")

        # Compare attributes
        baseline_attrs = set(baseline.attrib.items())
        current_attrs = set(current.attrib.items())

        if baseline_attrs != current_attrs:
            missing_attrs = baseline_attrs - current_attrs
            extra_attrs = current_attrs - baseline_attrs

            if missing_attrs:
                differences.append(f"Missing attributes in current: {missing_attrs}")
            if extra_attrs:
                differences.append(f"Extra attributes in current: {extra_attrs}")

        # Compare text content
        baseline_text = (baseline.text or "").strip()
        current_text = (current.text or "").strip()

        if baseline_text != current_text:
            differences.append(f"Text content differs: '{baseline_text}' vs '{current_text}'")

        # Compare child elements
        baseline_children = list(baseline)
        current_children = list(current)

        if len(baseline_children) != len(current_children):
            differences.append(f"Child count differs: {len(baseline_children)} vs {len(current_children)}")

        # Recursively compare children
        for i, (baseline_child, current_child) in enumerate(zip(baseline_children, current_children)):
            child_differences = self._analyze_xml_differences(baseline_child, current_child)
            for diff in child_differences:
                differences.append(f"Child {i}: {diff}")

        return differences

    def validate_organization_integrity(self, org_id: int, endpoint_types: List[str] = None) -> Dict:
        """
        Validate XML integrity for a specific organization.

        Returns validation result with status and details.
        """

        if endpoint_types is None:
            endpoint_types = ['iati-org', 'iati-activity']

        validation_result = {
            'org_id': org_id,
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'success',
            'endpoints': {}
        }

        for endpoint_type in endpoint_types:
            endpoint_result = {
                'endpoint_type': endpoint_type,
                'status': 'success',
                'differences': [],
                'error': None
            }

            try:
                print(f"  Validating {endpoint_type} for organization {org_id}...")

                # Load baseline
                try:
                    baseline_xml = self.load_baseline_xml(org_id, endpoint_type)
                    baseline_metadata = self.load_baseline_metadata(org_id, endpoint_type)
                except FileNotFoundError:
                    endpoint_result['status'] = 'skipped'
                    endpoint_result['error'] = f"No baseline found for {endpoint_type}"
                    print(f"    ◦ Skipped (no baseline)")
                    validation_result['endpoints'][endpoint_type] = endpoint_result
                    continue

                # Fetch current XML
                try:
                    current_xml = self.fetch_current_xml(org_id, endpoint_type)
                except Exception as e:
                    endpoint_result['status'] = 'error'
                    endpoint_result['error'] = f"Failed to fetch current XML: {str(e)}"
                    print(f"    ✗ Error fetching current XML: {e}")
                    validation_result['overall_status'] = 'error'
                    validation_result['endpoints'][endpoint_type] = endpoint_result
                    continue

                # Compare semantically
                differences = self.compare_xml_semantically(baseline_xml, current_xml)

                if differences:
                    endpoint_result['status'] = 'failed'
                    endpoint_result['differences'] = differences
                    validation_result['overall_status'] = 'failed'
                    print(f"    ✗ XML content differs ({len(differences)} differences)")
                    for diff in differences[:3]:  # Show first 3 differences
                        print(f"      - {diff}")
                    if len(differences) > 3:
                        print(f"      ... and {len(differences) - 3} more")
                else:
                    endpoint_result['status'] = 'success'
                    print(f"    ✓ XML content identical")

                # Add size comparison for reference
                baseline_size = len(baseline_xml.encode('utf-8'))
                current_size = len(current_xml.encode('utf-8'))
                endpoint_result['baseline_size'] = baseline_size
                endpoint_result['current_size'] = current_size

                if abs(baseline_size - current_size) > baseline_size * 0.1:  # >10% size difference
                    print(f"    ⚠ Size difference: {baseline_size} -> {current_size} bytes")

            except Exception as e:
                endpoint_result['status'] = 'error'
                endpoint_result['error'] = str(e)
                validation_result['overall_status'] = 'error'
                print(f"    ✗ Validation error: {e}")

            validation_result['endpoints'][endpoint_type] = endpoint_result

        return validation_result

    def validate_all_organizations(self) -> Dict:
        """Validate XML integrity for all organizations with baselines."""

        print("=== IATI XML Integrity Validation ===")
        print(f"Baseline directory: {self.baselines_dir}")
        print(f"Target URL: {self.base_url}")

        # Find all organizations with baselines
        baseline_files = list(self.baselines_dir.glob("baseline_org_*_*.json"))
        org_ids = set()

        for file in baseline_files:
            # Extract org_id from filename: baseline_org_6313_iati-org.json
            parts = file.stem.split('_')
            if len(parts) >= 3:
                try:
                    org_id = int(parts[2])
                    org_ids.add(org_id)
                except ValueError:
                    continue

        if not org_ids:
            raise Exception(f"No baseline files found in {self.baselines_dir}")

        print(f"Found baselines for {len(org_ids)} organizations: {sorted(org_ids)}")

        # Validate each organization
        overall_results = {
            'validation_timestamp': datetime.now().isoformat(),
            'total_organizations': len(org_ids),
            'successful_validations': 0,
            'failed_validations': 0,
            'error_validations': 0,
            'organizations': {}
        }

        for org_id in sorted(org_ids):
            print(f"\n--- Validating Organization {org_id} ---")

            try:
                result = self.validate_organization_integrity(org_id)
                overall_results['organizations'][org_id] = result

                if result['overall_status'] == 'success':
                    overall_results['successful_validations'] += 1
                elif result['overall_status'] == 'failed':
                    overall_results['failed_validations'] += 1
                else:
                    overall_results['error_validations'] += 1

            except Exception as e:
                print(f"  ✗ Validation failed with exception: {e}")
                overall_results['organizations'][org_id] = {
                    'org_id': org_id,
                    'overall_status': 'error',
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }
                overall_results['error_validations'] += 1

        # Save validation results
        results_file = self.baselines_dir / f"validation_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(overall_results, f, indent=2)

        print(f"\n=== Validation Summary ===")
        print(f"Total organizations: {overall_results['total_organizations']}")
        print(f"Successful validations: {overall_results['successful_validations']}")
        print(f"Failed validations: {overall_results['failed_validations']}")
        print(f"Error validations: {overall_results['error_validations']}")
        print(f"Results saved to: {results_file}")

        return overall_results

def main():
    """Main script execution."""

    parser = argparse.ArgumentParser(description='Validate IATI XML integrity')
    parser.add_argument('--org-id', type=int, help='Validate specific organization ID')
    parser.add_argument('--validate-all', action='store_true', help='Validate all organizations with baselines')
    parser.add_argument('--base-url', default='http://localhost', help='Base URL for IATI endpoints')
    parser.add_argument('--baselines-dir', type=Path, help='Directory containing baseline files')

    args = parser.parse_args()

    if not (args.org_id or args.validate_all):
        parser.error("Must specify either --org-id or --validate-all")

    # Initialize validator
    validator = IATIIntegrityValidator(baselines_dir=args.baselines_dir, base_url=args.base_url)

    try:
        if args.org_id:
            # Validate specific organization
            print(f"Validating IATI XML integrity for organization {args.org_id}...")
            result = validator.validate_organization_integrity(args.org_id)

            if result['overall_status'] == 'success':
                print(f"\n✓ Validation passed! IATI XML content is identical to baseline.")
                sys.exit(0)
            elif result['overall_status'] == 'failed':
                print(f"\n✗ Validation failed! IATI XML content has changed.")
                for endpoint_type, endpoint_result in result['endpoints'].items():
                    if endpoint_result['status'] == 'failed':
                        print(f"  {endpoint_type}: {len(endpoint_result['differences'])} differences")
                sys.exit(1)
            else:
                print(f"\n⚠ Validation error occurred.")
                sys.exit(1)

        elif args.validate_all:
            # Validate all organizations
            results = validator.validate_all_organizations()

            if results['failed_validations'] == 0 and results['error_validations'] == 0:
                print(f"\n✓ All validations passed! IATI XML integrity maintained.")
                sys.exit(0)
            else:
                print(f"\n✗ Some validations failed. IATI XML integrity compromised.")
                sys.exit(1)

    except KeyboardInterrupt:
        print("\n\nValidation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error during validation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()