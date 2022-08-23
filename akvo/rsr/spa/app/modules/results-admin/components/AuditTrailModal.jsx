import React from 'react'
import {
  Row,
  Col,
  Collapse,
  Modal,
  Skeleton,
  Typography,
  Descriptions,
} from 'antd'
import moment from 'moment'
import { Icon } from '../../../components'
import { AuditTrail } from '../../../components/AuditTrail'
import { setNumberFormat } from '../../../utils/misc'
import { StatusPeriod } from '../../../components/StatusPeriod'

const { Title, Text } = Typography
const { Panel } = Collapse

const AuditTrailModal = ({
  scores = [],
  results = [],
  item,
  visible,
  onClose,
}) => {
  const { fetched, period, indicator } = item || {}
  const defaultActiveKey = results.map((r) => r.id).slice(0, 1)
  return (
    <Modal
      centered
      closable
      visible={visible}
      width={710}
      onCancel={onClose}
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
      <div className="period-caption">
        {`${moment(period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - ${moment(period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}`}
      </div>
      <Descriptions>
        <Descriptions.Item label={<Text strong>Title</Text>}>
          <p>{indicator?.title}</p>
        </Descriptions.Item>
      </Descriptions>
      <Skeleton paragraph={{ rows: 3 }} loading={(!fetched)} active>
        <Collapse defaultActiveKey={defaultActiveKey}>
          {results.map((update, index) => {
            const { auditTrail: audits, narrative: textReport, ...props } = update
            const author = (update?.userDetails?.firstName?.length || update?.userDetails?.lastName?.length)
              ? `${update?.userDetails?.firstName} ${update?.userDetails?.lastName}`
              : update?.userDetails?.email
            return (
              <Panel
                header={(
                  <Row type="flex" justify="space-between" align="middle">
                    <Col lg={6} md={6} sm={12} className="label">
                      <p style={{ lineHeight: '14px' }}>
                        <small>created at</small><br />
                        <strong>{moment(update.createdAt).format('DD MMM YYYY')}</strong>
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="label author">
                      {author}
                    </Col>
                    <Col lg={4} md={4} sm={24} className="value-container">
                      <div className="value">
                        {update.value && setNumberFormat(update.value)}
                      </div>
                    </Col>
                    <Col lg={8} md={8} sm={12} className="label">
                      <StatusPeriod {...{ update, index }} />
                    </Col>
                  </Row>
                )}
                key={update.id}
              >
                <AuditTrail {...{ audits, scores, ...props }} />
              </Panel>
            )
          })}
        </Collapse>
      </Skeleton>
    </Modal>
  )
}

export default AuditTrailModal
