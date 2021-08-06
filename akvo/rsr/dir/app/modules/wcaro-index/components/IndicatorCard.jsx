import React from 'react'
import { Card, Collapse, Row, Col, Typography, Icon, Progress } from 'antd'
import { ListPeriods } from './ListPeriods'

const { Panel } = Collapse
const { Text } = Typography

const IndicatorLabel = ({ onClick, indicator }) => {
  const props = onClick ? { onClick, strong: true } : { strong: true }
  return (
    <>
      <div style={{ float: 'left' }}>
        <Icon type="global" className="wcaro-small-text" />&nbsp;
        {indicator.countries.length > 0 &&
          (
            <Text type="secondary">
              {indicator.countries.length > 1 ? `${indicator.countries.length} Countries` : '1 Country'}
            </Text>
          )
        }
      </div>
      <div style={{ cursor: 'pointer', float: 'right' }}>
        <Text {...props}>
          <Icon type="dashboard" theme="filled" />&nbsp;
          {indicator.indicators ? `${indicator.indicators.length} indicators` : ''}
        </Text>
      </div>
      <div style={{ clear: 'both' }} />
    </>
  )
}

export const IndicatorCard = ({
  indicator,
  onShow,
  ...props
}) => {
  return (
    <Card
      key={indicator.id}
      title={<Text strong>{indicator.title}</Text>}
      extra={(
        <Icon
          type="share-alt"
          style={{
            WebkitTransform: 'rotate(90deg)',
            msTransform: 'rotate(90deg)',
            transform: 'rotate(90deg)'
          }}
        />
      )}
      className="indicator-card"
      {...props}
    >
      {onShow
        ? (
          <div style={{ padding: '1em' }}>
            <IndicatorLabel onClick={() => onShow(indicator.id)} {...{ indicator }} />
          </div>
        )
        : (
          <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }}>
            <Panel
              header={<IndicatorLabel {...{ indicator }} />}
            >
              <ListPeriods result={indicator} />
            </Panel>
          </Collapse>
        )}
      <Row>
        <Col span={18} />
        <Col span={6} style={{ textAlign: 'right' }}>
          <Text style={{ color: '#03AD8C' }} strong>PROGRESS</Text>
        </Col>
      </Row>
      <Progress
        strokeColor={{
          '0%': '#7ED7D0',
          '100%': '#03AD8C',
        }}
        percent={50}
      />
    </Card>
  )
}
