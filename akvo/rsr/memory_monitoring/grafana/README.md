# RSR Memory Monitoring Grafana Configuration

This directory contains Grafana dashboards and alerting configurations for RSR memory monitoring.

## Overview

The RSR memory monitoring Grafana setup provides:

- **Comprehensive Dashboards**: Visual monitoring of memory usage, leak detection, and performance metrics
- **Intelligent Alerting**: Multi-level alerts for memory issues with appropriate escalation
- **Real-time Monitoring**: Live dashboards with configurable refresh intervals
- **Historical Analysis**: Trend analysis and prediction capabilities

## Directory Structure

```
grafana/
├── dashboards/
│   ├── rsr-memory-monitoring.json     # Main memory monitoring dashboard
│   └── rsr-leak-detection.json        # Dedicated leak detection dashboard
├── alerts/
│   ├── memory-alerts.yml              # Prometheus alert rules
│   └── notification-channels.json     # Grafana notification configuration
└── README.md                          # This file
```

## Dashboards

### 1. RSR Memory Monitoring Dashboard

**File**: `dashboards/rsr-memory-monitoring.json`

**Purpose**: Comprehensive overview of RSR memory usage and performance

**Key Panels**:
- Memory Usage Overview (current usage, growth rate, leak indicators)
- Memory Usage Timeline (RSS and peak memory trends)
- Request Memory Distribution (percentile analysis)
- Django Model Instance Counts
- Cache Operations and Hit Rates
- Memory Leak Detection Events
- Deletion Tracker Operations
- Project Hierarchy Metrics

**Template Variables**:
- `$instance`: Filter by specific RSR instances
- `$job`: Filter by job type

**Refresh**: 30 seconds (configurable)

### 2. RSR Leak Detection Dashboard

**File**: `dashboards/rsr-leak-detection.json`

**Purpose**: Focused monitoring of memory leak detection and analysis

**Key Panels**:
- Memory Leak Summary (24h totals, critical leaks)
- Memory Growth Trend with Predictions
- Django Model Instance Growth Analysis
- Object Type Growth Analysis
- Leak Detection Timeline (table view)
- Memory Threshold Violations

**Template Variables**:
- `$instance`: Filter by specific RSR instances
- `$severity`: Filter by leak severity (high, medium, low)

**Refresh**: 1 minute

## Alerting

### Alert Rules

**File**: `alerts/memory-alerts.yml`

**Groups**:
1. **rsr_memory_monitoring**: Core memory alerts
2. **rsr_memory_aggregation**: Recording rules for performance

**Key Alerts**:

| Alert | Severity | Condition | Description |
|-------|----------|-----------|-------------|
| RSRHighMemoryUsage | Critical | >500MB for 2min | High memory usage alert |
| RSRMemoryGrowthRate | Warning | >50MB/10min for 5min | Rapid memory growth |
| RSRMemoryLeakDetected | Warning | Any leak detected | Memory leak notification |
| RSRCriticalMemoryLeak | Critical | High severity leak | Critical leak immediate alert |
| RSRMemoryMonitorDown | Critical | Monitor down for 1min | Monitoring system failure |
| RSRLowCacheHitRate | Warning | <70% for 10min | Cache performance issue |
| RSRModelInstanceGrowth | Warning | >100 instances/10min | Database object growth |
| RSRDeletionTrackerOverload | Warning | >10k entries for 5min | Cleanup system overload |

### Notification Channels

**File**: `alerts/notification-channels.json`

**Channels**:
- **Slack**: Real-time notifications to #rsr-alerts channel
- **Email**: Detailed email notifications to operations team
- **Webhook**: Integration with external systems
- **PagerDuty**: Critical alert escalation

**Policies**:
- **Warning**: Group alerts, 1h repeat interval
- **Critical**: Immediate notification, 30min repeat interval

## Setup Instructions

### Prerequisites

1. **Prometheus**: Configured to scrape RSR memory metrics
2. **Grafana**: Version 8.0+ with Prometheus datasource
3. **Alertmanager**: For alert routing and notification

### 1. Deploy Dashboards

#### Option A: Grafana UI Import

1. Login to Grafana
2. Go to **+** → **Import**
3. Upload the JSON files from `dashboards/`
4. Configure datasource (Prometheus)
5. Save dashboards

#### Option B: Provisioning (Recommended)

Create `grafana/provisioning/dashboards/rsr-memory.yml`:

```yaml
apiVersion: 1

providers:
  - name: 'RSR Memory Monitoring'
    orgId: 1
    folder: 'RSR Monitoring'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards/rsr
```

Copy dashboard files to the configured path.

### 2. Configure Prometheus Alerts

1. Copy `alerts/memory-alerts.yml` to Prometheus rules directory
2. Update `prometheus.yml`:

```yaml
rule_files:
  - "memory-alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

3. Reload Prometheus configuration:
```bash
curl -X POST http://prometheus:9090/-/reload
```

### 3. Setup Notification Channels

#### Environment Variables

Set these environment variables for notification configuration:

```bash
# Slack
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Email
export ALERT_EMAIL_ADDRESSES="ops-team@akvo.org,monitoring@akvo.org"

# Webhook
export WEBHOOK_URL="https://your-webhook-endpoint.com/alerts"

# PagerDuty
export PAGERDUTY_INTEGRATION_KEY="your-pagerduty-integration-key"
```

#### Grafana Configuration

1. Go to **Alerting** → **Notification channels**
2. Import configuration from `alerts/notification-channels.json`
3. Test notification channels
4. Configure alert rules to use appropriate channels

### 4. Alertmanager Configuration

Create or update `alertmanager.yml`:

```yaml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@akvo.org'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'rsr-memory-alerts'

receivers:
  - name: 'rsr-memory-alerts'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#rsr-alerts'
        text: "{{ range .Alerts }}{{ .Annotations.description }}{{ end }}"
```

## Customization

### Dashboard Modifications

1. **Time Ranges**: Adjust default time ranges in dashboard JSON
2. **Thresholds**: Modify panel thresholds based on your environment
3. **Variables**: Add custom template variables for filtering
4. **Panels**: Add/remove panels based on monitoring needs

### Alert Tuning

1. **Thresholds**: Adjust alert thresholds in `memory-alerts.yml`
2. **Timing**: Modify `for` durations based on your requirements
3. **Labels**: Add custom labels for better organization
4. **Runbooks**: Update runbook URLs to your documentation

### Notification Customization

1. **Message Formats**: Customize alert message templates
2. **Routing**: Modify routing rules based on severity/component
3. **Channels**: Add/remove notification channels as needed
4. **Escalation**: Configure escalation policies for critical alerts

## Troubleshooting

### Common Issues

1. **No Data in Dashboards**
   - Verify Prometheus is scraping RSR metrics
   - Check datasource configuration in Grafana
   - Confirm metric names match dashboard queries

2. **Alerts Not Firing**
   - Verify Prometheus rules are loaded: `http://prometheus:9090/rules`
   - Check alert evaluation: `http://prometheus:9090/alerts`
   - Verify Alertmanager connectivity

3. **Notifications Not Working**
   - Test notification channels in Grafana
   - Check Alertmanager logs for delivery errors
   - Verify webhook URLs and authentication

### Monitoring Health

Check these endpoints regularly:

- **Grafana**: `http://grafana:3000/api/health`
- **Prometheus**: `http://prometheus:9090/-/healthy`
- **Alertmanager**: `http://alertmanager:9093/-/healthy`

## Best Practices

### Dashboard Management

1. **Version Control**: Keep dashboard JSON files in git
2. **Provisioning**: Use Grafana provisioning for automated deployment
3. **Naming**: Use consistent naming conventions
4. **Documentation**: Add panel descriptions and links

### Alert Management

1. **Alert Fatigue**: Tune alerts to reduce false positives
2. **Escalation**: Implement proper escalation for critical alerts
3. **Runbooks**: Maintain up-to-date troubleshooting documentation
4. **Testing**: Regularly test alert delivery and escalation

### Performance Optimization

1. **Recording Rules**: Use recording rules for expensive queries
2. **Query Optimization**: Optimize PromQL queries for performance
3. **Retention**: Configure appropriate metric retention policies
4. **Aggregation**: Use appropriate aggregation functions

## Support

For issues with RSR memory monitoring:

1. Check the [Memory Monitoring Documentation](../../doc/components/memory/)
2. Review logs from memory monitoring components
3. Consult the [Troubleshooting Guide](../../doc/components/memory/troubleshooting.md)
4. Contact the RSR operations team

## Contributing

When adding new dashboards or alerts:

1. Follow existing naming conventions
2. Test thoroughly in development environment
3. Update this README with new components
4. Submit changes via pull request