import React from 'react'
import {
  Modal,
  Skeleton,
  Typography,
  Descriptions,
} from 'antd'

import { Icon } from '../../../components'
import { AuditTrail } from '../../../components/AuditTrail'
import PeriodTitle from './PeriodTitle'

const { Title, Text } = Typography

const AuditTrailModal = ({
  scores = [],
  results = [],
  item,
  visible,
  onClose,
}) => {
  const { fetched, period, indicator } = item || {}
  const audits = results
    ?.map((r) => {
      const { userDetails, auditTrail, ...data } = r
      const actionFlag = auditTrail.length
        ? auditTrail?.map((a) => a.actionFlag).slice(0, 1)
        : 'ADDITION'
      return {
        data,
        actionFlag,
        actionTime: r?.createdAt,
        user: userDetails
      }
    })
  const disaggregations = results?.flatMap((r) => r?.disaggregations)
  return (
    <Modal
      centered
      closable
      visible={visible}
      width={710}
      onCancel={onClose}
      okButtonProps={{
        style: {
          display: 'none'
        }
      }}
      cancelText="Close"
      title={(
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}
        >
          <Icon type="clock.history" />
          <Title level={4} strong>Audit trail</Title>
        </div>
      )}
    >
      <PeriodTitle {...period} />
      <Descriptions>
        <Descriptions.Item label={<Text strong>Title</Text>}>
          <p>{indicator?.title}</p>
        </Descriptions.Item>
      </Descriptions>
      <Skeleton paragraph={{ rows: 3 }} loading={(!fetched)} active>
        <AuditTrail {...{ audits, scores, disaggregations }} />
      </Skeleton>
    </Modal>
  )
}

export default AuditTrailModal
