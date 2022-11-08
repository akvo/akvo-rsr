export const colors = {
  disaggregations: [
    '#19204b',
    '#1d2964',
    '#23347c',
    '#2c498b',
    '#35619b',
    '#3e78ab',
    '#4891bb',
    '#52aacb',
    '#6abdd0',
    '#8ecccc',
    '#b4dbcb',
    '#dceac9'
  ]
}

export const sizes = {
  stickyHeader: {
    width: '100%',
    height: 162 + 80
  }
}

export const jobStatus = {
  scheduled: 'SCHEDULED',
  running: 'RUNNING',
  finished: 'FINISHED',
  failed: 'FAILED',
  maxxed: 'MAXXED',
}

export const aggregatedIcons = {
  SCHEDULED: 'rsr.clock',
  RUNNING: 'rsr.loader',
  FINISHED: 'rsr.circle.check',
  FAILED: 'rsr.circle.alert',
  MAXXED: 'rsr.circle.alert',
}

export const actualValueIcons = {
  SCHEDULED: 'rsr.clock',
  RUNNING: 'rsr.loader',
  FINISHED: 'rsr.circle.check',
  FAILED: 'rsr.circle.alert',
  MAXXED: 'rsr.repeat',
}

export const jobStatusColor = {
  SCHEDULED: '#667085',
  RUNNING: 'gold',
  FINISHED: 'blue',
  FAILED: 'magenta',
  MAXXED: 'red',
}

export const popOver = {
  SCHEDULED: {
    title: 'Cron Job Scheduled',
    description: 'Aggregation is scheduled',
  },
  RUNNING: {
    title: 'Cron Job Running',
    description: 'Aggregation in progress',
  },
  FINISHED: {
    title: 'Cron Job Finished',
    description: 'Aggregated value is valid',
  },
  FAILED: {
    title: 'Cron Job Failed',
    description: '**:value:** out of **:total:** failed to update',
    action: 'view all'
  },
  MAXXED: {
    title: 'Max attempts reached',
    description: '**:value:** out of **:total:** max attempts reached',
    action: 'view all'
  },
}

export const toolTips = {
  SCHEDULED: popOver.SCHEDULED.title,
  RUNNING: popOver.RUNNING.title,
  FINISHED: popOver.FINISHED.title,
  FAILED: popOver.FAILED.title,
  MAXXED: 'Restart the job',
}

export const callToAction = [
  jobStatus.maxxed,
]
