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
  repeat: 'rsr.repeat',
  finished: 'rsr.circle.checked',
  failed: 'rsr.circle.alert',
}

export const popOver = {
  failed: {
    title: 'Cron Job Failed',
    description: '**:value:** out of **:total:** failed to update',
    action: 'view all',
  },
}
