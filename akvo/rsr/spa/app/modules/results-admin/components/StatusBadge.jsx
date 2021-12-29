import React from 'react'
import { Badge } from 'antd'

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'D':
      return (
        <Badge
          color="#fadb14"
          text={(
            <small style={{ fontWeight: 'bold', color: '#ccb30a' }}>
              DRAFT
            </small>
          )}
        />
      )
    case 'P':
      return (
        <Badge
          color="#1890ff"
          text={(
            <small style={{ fontWeight: 'bold', color: '#1890ff' }}>
              SUBMITTED
            </small>
          )}
        />
      )
    case 'R':
      return (
        <Badge
          color="#f5222d"
          text={(
            <small style={{ fontWeight: 'bold', color: '#f5222d' }}>
              DECLINED
            </small>
          )}
        />
      )
    case 'A':
      return (
        <Badge
          color="#52c41a"
          text={(
            <small style={{ fontWeight: 'bold', color: '#52c41a' }}>
              APPROVED
            </small>
          )}
        />
      )
    default:
      return (
        <Badge
          color="#d9d9d9"
          text={(
            <small style={{ fontWeight: 'bold', color: '#a7a5a5' }}>
              NO STATUS YET
            </small>
          )}
        />
      )
  }
}

export default StatusBadge
