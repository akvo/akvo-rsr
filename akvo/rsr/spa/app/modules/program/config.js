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

export const statusIcons = {
  RETRY: 'rsr.repeat',
  SCHEDULED: 'rsr.clock',
  RUNNING: 'rsr.loader',
  FINISHED: 'rsr.circle.check',
  FAILED: 'rsr.circle.alert',
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
    description: 'Aggregated actual is valid',
  },
  FAILED: {
    title: 'Cron Job Failed',
    description: '**:value:** out of **:total:** failed to update',
    action: 'view all'
  }
}
