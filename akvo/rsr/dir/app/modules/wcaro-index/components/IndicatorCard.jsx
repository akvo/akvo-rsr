import React from 'react'
import { Card, Collapse, List, Row, Col, Typography, Icon, Progress, Badge } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import allCountries from '../../../utils/countries.json'
import { setNumberFormat } from '../../../utils/misc'

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
  const firstActualValue = data && data.periods.length > 0 ? data.periods[0].actualValue : 0
  const firstTargetValue = data && data.periods.length > 0 ? data.periods[0].targetValue : 0
  data.periods.shift()
  return (
    <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }} className="wcaro-collapsable">
      <Panel
        header={(
          <TwoColumns
            left={
              (
                <>
                  <Text className="wcaro-small-text small-secondary">ACTUAL VALUE</Text><br />
                  <Text className="wcaro-small-text small-secondary" strong>{setNumberFormat(firstActualValue)}</Text>
                </>
              )
            }
            right={
              (
                <>
                  <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                  <Text className="wcaro-small-text" strong>{setNumberFormat(firstTargetValue)}</Text>
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
                      <Text className="wcaro-small-text small-secondary" strong>{setNumberFormat(item.actualValue)}</Text>
                    </>
                  )}
                  right={(
                    <>
                      <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                      <Text className="wcaro-small-text" strong>{setNumberFormat(item.targetValue)}</Text>
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

export const IndicatorCard = ({ indicator, ...props }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  const selectedCountries = allCountries
    .filter(item => indicator.countries.includes(item.code.toLowerCase()))
    .map(item => item.name)
    .join(', ')
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
      <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }}>
        <Panel
          header={(
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
                  description={mdOutput(parse(item.description))}
                />
                <TwoColumns
                  paddingLeft="1em"
                  left={<Text className="wcaro-small-text small-primary" strong>QUANTITATIVE</Text>}
                  right={<IconText type="global" text={selectedCountries} />}
                />
                <ListPeriods data={item} />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
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
