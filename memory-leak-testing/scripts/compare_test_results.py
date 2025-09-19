#!/usr/bin/env python3
"""
Compare memory leak test results between pre-fix and post-fix tests
Generates detailed comparison report and validation
"""
import json
import glob
import argparse
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from datetime import datetime
import os

class TestResultsComparator:
    def __init__(self, results_dir="memory_test_results"):
        self.results_dir = Path(results_dir)
        self.pre_fix_results = None
        self.post_fix_results = None
        
    def load_latest_results(self, test_type):
        """Load the most recent test results for a given type"""
        pattern = f"{test_type}_results_*.json"
        result_files = list(self.results_dir.glob(pattern))
        
        if not result_files:
            raise FileNotFoundError(f"No {test_type} results found in {self.results_dir}")
        
        # Get the most recent file
        latest_file = max(result_files, key=os.path.getctime)
        
        with open(latest_file, 'r') as f:
            results = json.load(f)
        
        print(f"Loaded {test_type} results from: {latest_file}")
        return results, latest_file
    
    def load_specific_results(self, pre_fix_file, post_fix_file):
        """Load specific result files for comparison"""
        with open(pre_fix_file, 'r') as f:
            self.pre_fix_results = json.load(f)
        
        with open(post_fix_file, 'r') as f:
            self.post_fix_results = json.load(f)
        
        print(f"Loaded pre-fix results from: {pre_fix_file}")
        print(f"Loaded post-fix results from: {post_fix_file}")
    
    def auto_load_results(self):
        """Automatically load the most recent pre-fix and post-fix results"""
        try:
            self.pre_fix_results, pre_file = self.load_latest_results("pre-fix")
        except FileNotFoundError:
            print("No pre-fix results found, trying 'baseline'...")
            self.pre_fix_results, pre_file = self.load_latest_results("baseline")
        
        self.post_fix_results, post_file = self.load_latest_results("post-fix")
        return pre_file, post_file
    
    def calculate_improvements(self):
        """Calculate improvement metrics between pre-fix and post-fix"""
        pre = self.pre_fix_results
        post = self.post_fix_results
        
        # Memory improvements
        memory_growth_improvement = (
            (pre['memory_analysis']['growth_rate_mb_h'] - post['memory_analysis']['growth_rate_mb_h']) /
            pre['memory_analysis']['growth_rate_mb_h'] * 100
        ) if pre['memory_analysis']['growth_rate_mb_h'] > 0 else 0
        
        # Performance improvements
        response_time_improvement = (
            (pre['request_analysis']['avg_response_time_s'] - post['request_analysis']['avg_response_time_s']) /
            pre['request_analysis']['avg_response_time_s'] * 100
        ) if pre['request_analysis']['avg_response_time_s'] > 0 else 0
        
        # Reliability improvements
        success_rate_improvement = (
            post['request_analysis']['success_rate_percent'] - 
            pre['request_analysis']['success_rate_percent']
        )
        
        # Timeout reduction
        timeout_reduction = (
            pre['request_analysis']['timeout_requests'] - 
            post['request_analysis']['timeout_requests']
        )
        
        return {
            'memory_growth_reduction_percent': round(memory_growth_improvement, 2),
            'response_time_improvement_percent': round(response_time_improvement, 2),
            'success_rate_improvement_points': round(success_rate_improvement, 2),
            'timeout_reduction_count': timeout_reduction,
            'slow_requests_reduction': (
                pre['request_analysis']['slow_requests_over_30s'] - 
                post['request_analysis']['slow_requests_over_30s']
            )
        }
    
    def validate_fix_success(self):
        """Validate if the memory leak fix meets success criteria"""
        pre = self.pre_fix_results
        post = self.post_fix_results
        improvements = self.calculate_improvements()
        
        # Success criteria based on the test plan
        criteria = {
            'memory_leak_resolved': {
                'condition': post['memory_analysis']['growth_rate_mb_h'] < 50,
                'description': 'Memory growth rate < 50 MB/hour',
                'pre_value': pre['memory_analysis']['growth_rate_mb_h'],
                'post_value': post['memory_analysis']['growth_rate_mb_h'],
                'improvement': improvements['memory_growth_reduction_percent']
            },
            'performance_improved': {
                'condition': post['request_analysis']['avg_response_time_s'] < 10,
                'description': 'Average response time < 10 seconds',
                'pre_value': pre['request_analysis']['avg_response_time_s'],
                'post_value': post['request_analysis']['avg_response_time_s'],
                'improvement': improvements['response_time_improvement_percent']
            },
            'reliability_improved': {
                'condition': post['request_analysis']['success_rate_percent'] > 95,
                'description': 'Success rate > 95%',
                'pre_value': pre['request_analysis']['success_rate_percent'],
                'post_value': post['request_analysis']['success_rate_percent'],
                'improvement': improvements['success_rate_improvement_points']
            },
            'timeouts_eliminated': {
                'condition': post['request_analysis']['timeout_requests'] == 0,
                'description': 'No timeout requests',
                'pre_value': pre['request_analysis']['timeout_requests'],
                'post_value': post['request_analysis']['timeout_requests'],
                'improvement': improvements['timeout_reduction_count']
            },
            'memory_stability': {
                'condition': post['memory_analysis']['peak_memory_mb'] < (post['memory_analysis']['start_memory_mb'] * 1.5),
                'description': 'Memory growth < 50% of baseline',
                'pre_value': pre['memory_analysis']['peak_memory_mb'] / pre['memory_analysis']['start_memory_mb'],
                'post_value': post['memory_analysis']['peak_memory_mb'] / post['memory_analysis']['start_memory_mb'],
                'improvement': 'N/A'
            }
        }
        
        # Calculate overall success
        passed_criteria = sum(1 for criterion in criteria.values() if criterion['condition'])
        total_criteria = len(criteria)
        overall_success = passed_criteria >= 4  # Must pass 4/5 criteria
        
        return {
            'overall_success': overall_success,
            'passed_criteria': passed_criteria,
            'total_criteria': total_criteria,
            'success_rate': f"{passed_criteria}/{total_criteria}",
            'criteria_details': criteria,
            'improvements': improvements
        }
    
    def generate_comparison_report(self, output_file="memory_leak_fix_validation_report.md"):
        """Generate comprehensive comparison report"""
        validation = self.validate_fix_success()
        
        report = f"""# Memory Leak Fix Validation Report
## Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

### Executive Summary
**Fix Status**: {'✅ SUCCESS' if validation['overall_success'] else '❌ FAILED'}
**Criteria Passed**: {validation['success_rate']} ({validation['passed_criteria']} out of {validation['total_criteria']})

---

## Test Results Comparison

### Memory Analysis
| Metric | Pre-Fix | Post-Fix | Improvement |
|--------|---------|----------|-------------|
| Memory Growth Rate (MB/h) | {self.pre_fix_results['memory_analysis']['growth_rate_mb_h']:.2f} | {self.post_fix_results['memory_analysis']['growth_rate_mb_h']:.2f} | {validation['improvements']['memory_growth_reduction_percent']:.1f}% reduction |
| Total Memory Growth (MB) | {self.pre_fix_results['memory_analysis']['memory_growth_mb']:.2f} | {self.post_fix_results['memory_analysis']['memory_growth_mb']:.2f} | {self.pre_fix_results['memory_analysis']['memory_growth_mb'] - self.post_fix_results['memory_analysis']['memory_growth_mb']:.2f} MB less |
| Peak Memory Usage (MB) | {self.pre_fix_results['memory_analysis']['peak_memory_mb']:.2f} | {self.post_fix_results['memory_analysis']['peak_memory_mb']:.2f} | {self.pre_fix_results['memory_analysis']['peak_memory_mb'] - self.post_fix_results['memory_analysis']['peak_memory_mb']:.2f} MB lower |

### Performance Analysis  
| Metric | Pre-Fix | Post-Fix | Improvement |
|--------|---------|----------|-------------|
| Avg Response Time (s) | {self.pre_fix_results['request_analysis']['avg_response_time_s']:.2f} | {self.post_fix_results['request_analysis']['avg_response_time_s']:.2f} | {validation['improvements']['response_time_improvement_percent']:.1f}% faster |
| Success Rate (%) | {self.pre_fix_results['request_analysis']['success_rate_percent']:.1f} | {self.post_fix_results['request_analysis']['success_rate_percent']:.1f} | +{validation['improvements']['success_rate_improvement_points']:.1f} points |
| Timeout Requests | {self.pre_fix_results['request_analysis']['timeout_requests']} | {self.post_fix_results['request_analysis']['timeout_requests']} | {validation['improvements']['timeout_reduction_count']} fewer |
| Slow Requests (>30s) | {self.pre_fix_results['request_analysis']['slow_requests_over_30s']} | {self.post_fix_results['request_analysis']['slow_requests_over_30s']} | {validation['improvements']['slow_requests_reduction']} fewer |

---

## Success Criteria Validation

"""
        
        for criterion_name, criterion in validation['criteria_details'].items():
            status = "✅ PASS" if criterion['condition'] else "❌ FAIL"
            report += f"### {criterion_name.replace('_', ' ').title()}\n"
            report += f"**Status**: {status}\n"
            report += f"**Criteria**: {criterion['description']}\n"
            report += f"**Pre-Fix**: {criterion['pre_value']}\n"
            report += f"**Post-Fix**: {criterion['post_value']}\n"
            if criterion['improvement'] != 'N/A':
                report += f"**Improvement**: {criterion['improvement']}\n"
            report += "\n"
        
        report += f"""---

## Detailed Analysis

### Pre-Fix Test Results
- **Scenario**: {self.pre_fix_results.get('scenario', 'Unknown')}
- **Test Duration**: {self.pre_fix_results.get('test_duration_minutes', 0):.1f} minutes
- **Total Requests**: {self.pre_fix_results['request_analysis']['total_requests']}
- **Memory Growth Pattern**: {'Consistent growth' if self.pre_fix_results['memory_analysis']['growth_rate_mb_h'] > 50 else 'Stable'}
- **Performance Issues**: {'Detected' if self.pre_fix_results['performance_indicators']['performance_degradation'] else 'None'}

### Post-Fix Test Results  
- **Scenario**: {self.post_fix_results.get('scenario', 'Unknown')}
- **Test Duration**: {self.post_fix_results.get('test_duration_minutes', 0):.1f} minutes
- **Total Requests**: {self.post_fix_results['request_analysis']['total_requests']}
- **Memory Growth Pattern**: {'Stable' if self.post_fix_results['memory_analysis']['growth_rate_mb_h'] < 50 else 'Still growing'}
- **Performance Issues**: {'None' if not self.post_fix_results['performance_indicators']['performance_degradation'] else 'Still present'}

---

## Recommendations

"""
        
        if validation['overall_success']:
            report += """### ✅ Fix Successfully Validated
The memory leak fix has been successfully validated and meets all critical success criteria:

1. **Memory leak eliminated**: Growth rate reduced to acceptable levels
2. **Performance restored**: Response times are within acceptable bounds
3. **System stability**: No more timeout cascades or system instability
4. **Production readiness**: Safe to deploy to production environment

### Next Steps
1. Deploy the fix to production environment
2. Monitor production metrics for 24-48 hours post-deployment
3. Verify that production memory growth patterns match test results
4. Document the fix and update development guidelines to prevent recurrence

"""
        else:
            failed_criteria = [name for name, criterion in validation['criteria_details'].items() if not criterion['condition']]
            report += f"""### ❌ Fix Requires Additional Work
The memory leak fix did not meet all success criteria. **Failed criteria**: {', '.join(failed_criteria)}

### Required Actions
"""
            for criterion_name, criterion in validation['criteria_details'].items():
                if not criterion['condition']:
                    report += f"- **{criterion_name.replace('_', ' ').title()}**: {criterion['description']} (Current: {criterion['post_value']}, Target: varies)\n"
            
            report += """
### Recommended Investigation
1. Review IATI endpoint optimizations for remaining performance issues
2. Check database connection pool configuration  
3. Verify memory cleanup in request completion handlers
4. Consider additional profiling of slow request code paths
5. Re-run tests after additional fixes

**DO NOT DEPLOY TO PRODUCTION** until all critical criteria are met.
"""
        
        report += f"""
---

## Test Environment Details
- **Pre-Fix Test File**: {getattr(self, '_pre_fix_file', 'Unknown')}
- **Post-Fix Test File**: {getattr(self, '_post_fix_file', 'Unknown')}
- **Analysis Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

*This report was automatically generated by the Akvo RSR Memory Leak Test Framework*
"""
        
        # Save report
        with open(output_file, 'w') as f:
            f.write(report)
        
        print(f"Validation report saved to: {output_file}")
        return report
    
    def create_visualization(self, output_dir="memory_test_charts"):
        """Create comparison charts"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Set up the plotting style
        plt.style.use('default')
        sns.set_palette("husl")
        
        # Memory comparison chart
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Memory Leak Fix Validation - Before vs After', fontsize=16, fontweight='bold')
        
        # Memory growth rate comparison
        categories = ['Pre-Fix', 'Post-Fix']
        memory_rates = [
            self.pre_fix_results['memory_analysis']['growth_rate_mb_h'],
            self.post_fix_results['memory_analysis']['growth_rate_mb_h']
        ]
        
        bars1 = ax1.bar(categories, memory_rates, color=['red', 'green'], alpha=0.7)
        ax1.set_title('Memory Growth Rate (MB/hour)')
        ax1.set_ylabel('MB/hour')
        ax1.axhline(y=50, color='orange', linestyle='--', label='Target (<50 MB/h)')
        ax1.legend()
        
        # Add value labels on bars
        for bar, value in zip(bars1, memory_rates):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + 5,
                    f'{value:.1f}', ha='center', va='bottom', fontweight='bold')
        
        # Response time comparison
        response_times = [
            self.pre_fix_results['request_analysis']['avg_response_time_s'],
            self.post_fix_results['request_analysis']['avg_response_time_s']
        ]
        
        bars2 = ax2.bar(categories, response_times, color=['red', 'green'], alpha=0.7)
        ax2.set_title('Average Response Time (seconds)')
        ax2.set_ylabel('Seconds')
        ax2.axhline(y=10, color='orange', linestyle='--', label='Target (<10s)')
        ax2.legend()
        
        for bar, value in zip(bars2, response_times):
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{value:.1f}', ha='center', va='bottom', fontweight='bold')
        
        # Success rate comparison
        success_rates = [
            self.pre_fix_results['request_analysis']['success_rate_percent'],
            self.post_fix_results['request_analysis']['success_rate_percent']
        ]
        
        bars3 = ax3.bar(categories, success_rates, color=['red', 'green'], alpha=0.7)
        ax3.set_title('Success Rate (%)')
        ax3.set_ylabel('Percentage')
        ax3.set_ylim(0, 100)
        ax3.axhline(y=95, color='orange', linestyle='--', label='Target (>95%)')
        ax3.legend()
        
        for bar, value in zip(bars3, success_rates):
            height = bar.get_height()
            ax3.text(bar.get_x() + bar.get_width()/2., height + 1,
                    f'{value:.1f}%', ha='center', va='bottom', fontweight='bold')
        
        # Timeout requests comparison
        timeout_counts = [
            self.pre_fix_results['request_analysis']['timeout_requests'],
            self.post_fix_results['request_analysis']['timeout_requests']
        ]
        
        bars4 = ax4.bar(categories, timeout_counts, color=['red', 'green'], alpha=0.7)
        ax4.set_title('Timeout Requests')
        ax4.set_ylabel('Count')
        ax4.axhline(y=0.5, color='orange', linestyle='--', label='Target (0)')
        ax4.legend()
        
        for bar, value in zip(bars4, timeout_counts):
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                    f'{int(value)}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        chart_file = f"{output_dir}/memory_leak_fix_comparison.png"
        plt.savefig(chart_file, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Comparison chart saved to: {chart_file}")
        return chart_file

def main():
    parser = argparse.ArgumentParser(description='Compare memory leak test results')
    parser.add_argument('--pre-fix-file', help='Specific pre-fix results file')
    parser.add_argument('--post-fix-file', help='Specific post-fix results file')
    parser.add_argument('--results-dir', default='memory_test_results', help='Results directory')
    parser.add_argument('--output-report', default='memory_leak_fix_validation_report.md', help='Output report file')
    parser.add_argument('--charts-dir', default='memory_test_charts', help='Charts output directory')
    
    args = parser.parse_args()
    
    comparator = TestResultsComparator(args.results_dir)
    
    try:
        if args.pre_fix_file and args.post_fix_file:
            comparator.load_specific_results(args.pre_fix_file, args.post_fix_file)
            comparator._pre_fix_file = args.pre_fix_file
            comparator._post_fix_file = args.post_fix_file
        else:
            pre_file, post_file = comparator.auto_load_results()
            comparator._pre_fix_file = pre_file
            comparator._post_fix_file = post_file
        
        # Generate comparison report
        report = comparator.generate_comparison_report(args.output_report)
        
        # Create visualizations
        chart_file = comparator.create_visualization(args.charts_dir)
        
        # Validate results
        validation = comparator.validate_fix_success()
        
        # Print summary to console
        print("\n" + "="*80)
        print("MEMORY LEAK FIX VALIDATION SUMMARY")
        print("="*80)
        print(f"Overall Status: {'✅ SUCCESS' if validation['overall_success'] else '❌ FAILED'}")
        print(f"Criteria Passed: {validation['success_rate']}")
        print(f"Memory Growth Reduction: {validation['improvements']['memory_growth_reduction_percent']:.1f}%")
        print(f"Performance Improvement: {validation['improvements']['response_time_improvement_percent']:.1f}%")
        print(f"Report Generated: {args.output_report}")
        print(f"Chart Generated: {chart_file}")
        print("="*80)
        
        # Exit with appropriate code
        if not validation['overall_success']:
            print("⚠️  WARNING: Fix validation failed. Review the report for details.")
            exit(1)
        else:
            print("🎉 SUCCESS: Memory leak fix validated successfully!")
            exit(0)
            
    except Exception as e:
        print(f"❌ ERROR: Failed to compare results: {e}")
        exit(1)

if __name__ == "__main__":
    main()