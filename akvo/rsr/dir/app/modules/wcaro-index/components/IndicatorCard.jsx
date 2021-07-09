import React from 'react'
import { Card, Collapse, List, Row, Col, Typography, Icon, Progress, Badge } from 'antd'

const { Panel } = Collapse
const { Text } = Typography

const IconText = ({ type, text }) => (
  <span className="wcaro-small-text small-primary">
    <Icon style={{ marginRight: 8 }} type={type} />
    {text}
  </span>
)

const TwoColumns = ({ left, right, ...props }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ textAlign: 'left', marginRight: '3em', ...props }}>
        {left}
      </div>
      <div style={{ textAlign: 'left' }}>
        {right}
      </div>
    </div>
  )
}


const ListPeriods = ({ data }) => {
  return (
    <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }} className="wcaro-collapsable">
      <Panel
        header={(
          <TwoColumns
            left={
              (
                <>
                  <Text className="wcaro-small-text small-secondary">ACTUAL VALUE</Text><br />
                  <Text className="wcaro-small-text small-secondary" strong>768 (153%)</Text>
                </>
              )
            }
            right={
              (
                <>
                  <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                  <Text className="wcaro-small-text" strong>500</Text>
                </>
              )
            }
          />
        )}
      >
        {data.periods &&
          <List
            bordered={false}
            dataSource={data.periods}
            renderItem={item => (
              <List.Item key={item.id}>
                <TwoColumns
                  left={(
                    <>
                      <Text className="wcaro-small-text small-secondary">ACTUAL VALUE</Text><br />
                      <Text className="wcaro-small-text small-secondary" strong>{item.actualValue}</Text>
                    </>
                  )}
                  right={(
                    <>
                      <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                      <Text className="wcaro-small-text" strong>{item.targetValue}</Text>
                    </>
                  )}
                />
              </List.Item>
            )}
          />
        }
      </Panel>
    </Collapse>
  )
}

export const IndicatorCard = ({ indicator }) => {
  return (
    <Card
      key={indicator.id}
      style={{ marginBottom: '5px' }}
      title={<Text strong>{indicator.title}</Text>}
      extra={<Icon type="share-alt" />}
      className="indicator-card"
    >
      <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }}>
        <Panel
          header={(
            <>
              <div style={{ float: 'left' }}>
                <Icon type="global" className="wcaro-small-text" />&nbsp;
                <Text type="secondary">2 Countries</Text>
              </div>
              <div style={{ float: 'right' }}>
                <Text strong>
                  <Icon type="dashboard" theme="filled" />&nbsp;
                  {indicator.indicators ? `${indicator.indicators.length} indicators` : ''}
                </Text>
              </div>
              <div style={{ clear: 'both' }} />
            </>
          )}
        >
          <List
            itemLayout="vertical"
            size="large"
            dataSource={indicator.indicators}
            renderItem={item => (
              <List.Item
                key={item.title}
              >
                <List.Item.Meta
                  title={<a href={item.href}><Badge status="success" />&nbsp;{item.title}</a>}
                  description={item.description}
                />
                <TwoColumns
                  paddingLeft="1em"
                  left={<Text className="wcaro-small-text small-primary" strong>QUANTITATIVE</Text>}
                  right={<IconText type="global" text="Mali, Cameroun, Nihgeria" />}
                />
                <ListPeriods data={item} />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
      <Row>
        <Col span={20} />
        <Col span={4} style={{ textAlign: 'right' }}>
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
