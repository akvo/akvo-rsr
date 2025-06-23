"""
Management command for automated RSR memory health reports.
"""

import json
import logging
from datetime import datetime
from django.core.management.base import BaseCommand

from akvo.rsr.memory_monitoring.leak_detection import get_leak_detector
from akvo.rsr.memory_monitoring.profiling import get_memory_profiler
from akvo.rsr.memory_monitoring.middleware import get_current_memory_usage

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Management command for automated memory health reports.

    Provides utilities for:
    - Generating comprehensive memory health reports
    - Daily/weekly automated reporting
    - Memory trend analysis
    - Performance correlation analysis
    - Alert condition checking
    """

    help = 'Generate comprehensive RSR memory health reports'

    def add_arguments(self, parser):
        parser.add_argument(
            '--report-type',
            choices=['quick', 'detailed', 'full'],
            default='detailed',
            help='Type of report to generate',
        )
        parser.add_argument(
            '--output-format',
            choices=['text', 'json', 'html'],
            default='text',
            help='Output format for the report',
        )
        parser.add_argument(
            '--output-file',
            type=str,
            help='Save report to specified file',
        )
        parser.add_argument(
            '--include-profiling',
            action='store_true',
            help='Include profiling statistics in report',
        )
        parser.add_argument(
            '--include-trends',
            action='store_true',
            help='Include memory trend analysis',
        )
        parser.add_argument(
            '--check-alerts',
            action='store_true',
            help='Check for alert conditions and highlight issues',
        )
        parser.add_argument(
            '--days-back',
            type=int,
            default=7,
            help='Number of days to look back for trend analysis',
        )

    def handle(self, *args, **options):
        """Generate the requested memory health report."""

        try:
            report_data = self.generate_memory_report(options)

            if options['output_format'] == 'json':
                output = json.dumps(report_data, indent=2, default=str)
            elif options['output_format'] == 'html':
                output = self.format_html_report(report_data)
            else:
                output = self.format_text_report(report_data, options)

            # Output to file or stdout
            if options['output_file']:
                with open(options['output_file'], 'w') as f:
                    f.write(output)
                self.stdout.write(
                    self.style.SUCCESS(f"Report saved to: {options['output_file']}")
                )
            else:
                self.stdout.write(output)

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error generating memory report: {e}")
            )
            logger.exception("Error in memory report generation")

    def generate_memory_report(self, options) -> dict:
        """Generate comprehensive memory report data."""

        report_type = options['report_type']

        # Basic report structure
        report = {
            'generated_at': datetime.now().isoformat(),
            'report_type': report_type,
            'system': {},
            'leak_detection': {},
            'profiling': {},
            'alerts': [],
            'recommendations': []
        }

        try:
            # System memory information
            report['system'] = self.get_system_memory_info()

            # Leak detection analysis
            if report_type in ['detailed', 'full']:
                report['leak_detection'] = self.get_leak_detection_info()

            # Profiling statistics
            if options['include_profiling'] or report_type == 'full':
                report['profiling'] = self.get_profiling_info()

            # Trend analysis
            if options['include_trends'] or report_type == 'full':
                report['trends'] = self.get_trend_analysis(options['days_back'])

            # Alert checking
            if options['check_alerts'] or report_type == 'full':
                report['alerts'] = self.check_alert_conditions(report)

            # Generate recommendations
            report['recommendations'] = self.generate_recommendations(report)

        except Exception as e:
            logger.error(f"Error generating report sections: {e}")
            report['error'] = str(e)

        return report

    def get_system_memory_info(self) -> dict:
        """Get current system memory information."""
        try:
            memory_usage = get_current_memory_usage()

            return {
                'current_usage': memory_usage,
                'timestamp': datetime.now().isoformat(),
                'status': 'healthy' if memory_usage.get('system_used_percent', 0) < 80 else 'warning'
            }
        except Exception as e:
            logger.error(f"Error getting system memory info: {e}")
            return {'error': str(e)}

    def get_leak_detection_info(self) -> dict:
        """Get leak detection analysis results."""
        try:
            leak_detector = get_leak_detector()

            # Run leak detection
            leak_results = leak_detector.check_for_leaks()

            # Get memory summary
            memory_summary = leak_detector.get_memory_summary()

            return {
                'leak_results': leak_results,
                'memory_summary': memory_summary,
                'detector_enabled': leak_detector.enabled
            }
        except Exception as e:
            logger.error(f"Error getting leak detection info: {e}")
            return {'error': str(e)}

    def get_profiling_info(self) -> dict:
        """Get memory profiling statistics."""
        try:
            profiler = get_memory_profiler()

            return {
                'stats': profiler.get_profile_stats(),
                'active_profilers': profiler.list_active_profilers(),
                'enabled': profiler.enabled,
                'memray_available': profiler.is_memray_available()
            }
        except Exception as e:
            logger.error(f"Error getting profiling info: {e}")
            return {'error': str(e)}

    def get_trend_analysis(self, days_back: int) -> dict:
        """Analyze memory trends over specified period."""
        try:
            # This would integrate with time-series data if available
            # For now, return basic trend information

            return {
                'period_days': days_back,
                'analysis_note': 'Trend analysis requires historical data collection',
                'recommendation': 'Enable historical metrics collection in Prometheus/Grafana'
            }
        except Exception as e:
            logger.error(f"Error getting trend analysis: {e}")
            return {'error': str(e)}

    def check_alert_conditions(self, report_data: dict) -> list:
        """Check for alert conditions based on report data."""
        alerts = []

        try:
            # Check system memory
            system_info = report_data.get('system', {})
            current_usage = system_info.get('current_usage', {})
            system_percent = current_usage.get('system_used_percent', 0)

            if system_percent > 90:
                alerts.append({
                    'level': 'critical',
                    'type': 'high_system_memory',
                    'message': f'System memory usage at {system_percent:.1f}%',
                    'threshold': '90%'
                })
            elif system_percent > 80:
                alerts.append({
                    'level': 'warning',
                    'type': 'elevated_system_memory',
                    'message': f'System memory usage at {system_percent:.1f}%',
                    'threshold': '80%'
                })

            # Check process memory
            process_mb = current_usage.get('process_rss_mb', 0)
            if process_mb > 1000:  # 1GB
                alerts.append({
                    'level': 'warning',
                    'type': 'high_process_memory',
                    'message': f'Process memory usage at {process_mb:.1f}MB',
                    'threshold': '1000MB'
                })

            # Check leak detection results
            leak_info = report_data.get('leak_detection', {})
            leak_results = leak_info.get('leak_results', {})
            leak_indicators = leak_results.get('leak_indicators', [])

            for indicator in leak_indicators:
                alerts.append({
                    'level': indicator.get('severity', 'medium'),
                    'type': 'memory_leak_detected',
                    'message': indicator.get('description', 'Memory leak detected'),
                    'details': indicator
                })

        except Exception as e:
            logger.error(f"Error checking alert conditions: {e}")
            alerts.append({
                'level': 'error',
                'type': 'alert_check_failed',
                'message': f'Failed to check alert conditions: {e}'
            })

        return alerts

    def generate_recommendations(self, report_data: dict) -> list:
        """Generate recommendations based on report analysis."""
        recommendations = []

        try:
            # System memory recommendations
            system_info = report_data.get('system', {})
            current_usage = system_info.get('current_usage', {})
            system_percent = current_usage.get('system_used_percent', 0)

            if system_percent > 80:
                recommendations.append({
                    'priority': 'high',
                    'category': 'system_memory',
                    'action': 'Consider increasing system memory or optimizing memory usage',
                    'reason': f'System memory usage at {system_percent:.1f}%'
                })

            # Leak detection recommendations
            leak_info = report_data.get('leak_detection', {})
            leak_results = leak_info.get('leak_results', {})

            if leak_results.get('recommendations'):
                for rec in leak_results['recommendations']:
                    recommendations.append({
                        'priority': 'medium',
                        'category': 'memory_leaks',
                        'action': rec,
                        'reason': 'Memory leak detection analysis'
                    })

            # Profiling recommendations
            profiling_info = report_data.get('profiling', {})
            if not profiling_info.get('enabled', False):
                recommendations.append({
                    'priority': 'low',
                    'category': 'profiling',
                    'action': 'Enable memory profiling for detailed analysis',
                    'reason': 'Profiling is currently disabled'
                })

            # Alert-based recommendations
            alerts = report_data.get('alerts', [])
            critical_alerts = [a for a in alerts if a.get('level') == 'critical']

            if critical_alerts:
                recommendations.append({
                    'priority': 'critical',
                    'category': 'immediate_action',
                    'action': 'Address critical memory issues immediately',
                    'reason': f'{len(critical_alerts)} critical alerts detected'
                })

        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            recommendations.append({
                'priority': 'error',
                'category': 'system',
                'action': 'Review memory monitoring system',
                'reason': f'Error in recommendation generation: {e}'
            })

        return recommendations

    def format_text_report(self, report_data: dict, options: dict) -> str:
        """Format report data as human-readable text."""

        lines = []

        # Header
        lines.append("=" * 60)
        lines.append("RSR MEMORY HEALTH REPORT")
        lines.append("=" * 60)
        lines.append(f"Generated: {report_data['generated_at']}")
        lines.append(f"Report Type: {report_data['report_type']}")
        lines.append("")

        # System Memory
        lines.append("📊 SYSTEM MEMORY STATUS")
        lines.append("-" * 30)
        system_info = report_data.get('system', {})
        current_usage = system_info.get('current_usage', {})

        if current_usage:
            lines.append(f"Process Memory: {current_usage.get('process_rss_mb', 0):.1f} MB")
            lines.append(f"System Usage: {current_usage.get('system_used_percent', 0):.1f}%")
            lines.append(f"Available: {current_usage.get('system_available_mb', 0):.1f} MB")
            lines.append(f"Objects: {current_usage.get('objects_count', 0):,}")

        lines.append("")

        # Alerts
        alerts = report_data.get('alerts', [])
        if alerts:
            lines.append("🚨 ALERTS")
            lines.append("-" * 30)

            for alert in alerts:
                level_icon = {
                    'critical': '🔴',
                    'warning': '🟡',
                    'error': '⚠️'
                }.get(alert['level'], '🔵')

                lines.append(f"{level_icon} {alert['level'].upper()}: {alert['message']}")

            lines.append("")

        # Leak Detection
        leak_info = report_data.get('leak_detection', {})
        if leak_info and 'error' not in leak_info:
            lines.append("🔍 LEAK DETECTION")
            lines.append("-" * 30)

            leak_results = leak_info.get('leak_results', {})
            leak_indicators = leak_results.get('leak_indicators', [])

            if leak_indicators:
                lines.append(f"Leak Indicators: {len(leak_indicators)}")
                for indicator in leak_indicators[:3]:  # Show top 3
                    lines.append(f"  • {indicator.get('description', 'Unknown')}")
            else:
                lines.append("✅ No memory leak indicators detected")

            lines.append("")

        # Profiling
        profiling_info = report_data.get('profiling', {})
        if profiling_info and options.get('include_profiling'):
            lines.append("📈 PROFILING STATUS")
            lines.append("-" * 30)

            stats = profiling_info.get('stats', {})
            lines.append(f"Profile Files: {stats.get('total_files', 0)}")
            lines.append(f"Storage Used: {stats.get('total_size_mb', 0):.1f} MB")
            lines.append(f"Active Profilers: {len(profiling_info.get('active_profilers', []))}")

            lines.append("")

        # Recommendations
        recommendations = report_data.get('recommendations', [])
        if recommendations:
            lines.append("💡 RECOMMENDATIONS")
            lines.append("-" * 30)

            for i, rec in enumerate(recommendations[:5], 1):  # Show top 5
                priority_icon = {
                    'critical': '🔴',
                    'high': '🟠',
                    'medium': '🟡',
                    'low': '🟢'
                }.get(rec['priority'], '🔵')

                lines.append(f"{i}. {priority_icon} {rec['action']}")
                lines.append(f"   Reason: {rec['reason']}")

            lines.append("")

        # Footer
        lines.append("=" * 60)
        lines.append("End of Report")
        lines.append("=" * 60)

        return "\n".join(lines)

    def format_html_report(self, report_data: dict) -> str:
        """Format report data as HTML."""

        # Basic HTML template
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>RSR Memory Health Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1, h2 {{ color: #333; }}
                .alert-critical {{ color: #d32f2f; }}
                .alert-warning {{ color: #f57c00; }}
                .status-good {{ color: #388e3c; }}
                .metric {{ margin: 10px 0; }}
                .recommendation {{ margin: 10px 0; padding: 10px; background: #f5f5f5; }}
            </style>
        </head>
        <body>
            <h1>RSR Memory Health Report</h1>
            <p>Generated: {report_data['generated_at']}</p>
            <p>Report Type: {report_data['report_type']}</p>

            <h2>System Memory Status</h2>
            <!-- Add system memory details -->

            <h2>Alerts</h2>
            <!-- Add alerts -->

            <h2>Recommendations</h2>
            <!-- Add recommendations -->

            <p><em>Generated by RSR Memory Monitoring System</em></p>
        </body>
        </html>
        """

        return html
