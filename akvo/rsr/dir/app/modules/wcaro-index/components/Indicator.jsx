import React from 'react'
import { Row, Col, Card, Typography, Collapse, Icon, Progress, List } from 'antd'
import { PanelBadge } from './PanelBadge'

const { Text } = Typography
const { Panel } = Collapse

export const Indicator = ({ sections, indicators }) => {
  return (
    <Collapse>
      {sections.map(section => (
        <Panel key={section.id} header={section.name} extra={(<PanelBadge count={indicators[section.id].length || 0} />)}>
          {indicators[section.id] && (
            <>
              {indicators[section.id].map(indicator => (
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
                            <Icon type="global" style={{ fontSize: '12px' }} />&nbsp;
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
                        itemLayout="horizontal"
                        dataSource={indicator.indicators}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.title}
                            />
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
              ))}
            </>
          )}
        </Panel>
      ))}
    </Collapse>
  )
}
