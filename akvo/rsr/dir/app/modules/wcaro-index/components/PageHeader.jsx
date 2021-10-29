import React from 'react'
import { Row, Col, Typography, Progress, Tooltip } from 'antd'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export const PageHeader = ({
  user,
  title,
  dateStartActual,
  dateEndPlanned
}) => {
  const { t } = useTranslation()
  const startDate = dateStartActual ? moment(dateStartActual, 'YYYY-MM-DD') : null
  const finishDate = dateEndPlanned ? moment(dateEndPlanned, 'YYYY-MM-DD') : null
  const progress = (startDate && finishDate) ? moment().diff(startDate) / finishDate.diff(startDate) * 100 : 0
  return (
    <Row>
      <Col span={24}>
        <small>{t('PROGRAMME')}</small>
        <Title level={4} style={{ color: '#1cabe2' }}>{user.status ? title : 'Loading...'}</Title>
      </Col>
      <Col span={24}>
        <div style={{ float: 'left' }}>
          <small><strong>Start Date :</strong> {user.status ? startDate.format('DD MMM YYYY') : 'Loading...'}</small>
        </div>
        <div style={{ float: 'right' }}>
          <small><strong>End Date :</strong> {user.status ? finishDate.format('DD MMM YYYY') : 'Loading...'}</small>
        </div>
        <div style={{ clear: 'both' }} />
        <Tooltip placement="top" title={`Today Status: ${progress < 100 ? 'Ongoing' : 'Done'}`}>
          <Progress
            style={{
              height: 10
            }}
            strokeColor={{
              '0%': '#9D94F7',
              '100%': '#0E01A8',
            }}
            percent={user.status ? parseInt(progress, 10) : 100}
            showInfo={false}
            strokeLinecap="square"
            status={user.status ? 'normal' : 'active'}
          />
        </Tooltip>
      </Col>
    </Row>
  )
}
