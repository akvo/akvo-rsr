import React from 'react'
import { Badge } from 'antd'

export const PanelBadge = ({ ...props }) => {
  return <Badge style={{ backgroundColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} {...props} />
}
