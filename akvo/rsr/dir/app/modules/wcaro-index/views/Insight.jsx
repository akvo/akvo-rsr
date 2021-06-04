import React from 'react'
import { Typography, Row, Col, Card, Icon } from 'antd'
import { Link } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'
import { InsightItem, Slider, Stories } from '../components'

const { Text } = Typography

const Insight = ({
  title,
  items,
  slides,
  results,
  stories,
  setMenuKey,
}) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <>
      <Slider items={slides} {...{ setMenuKey }} />
      <div style={{ padding: '1.5em' }}>
        <Card title={(<Link to="/"><Icon type="left" />&nbsp;Back to Overview</Link>)}>
          <Text strong>DATA INSIGHT</Text><br />
          <Text strong>
            <h3>{title || ''}</h3>
          </Text>
          <Row gutter={[16, 16]}>
            {items.map(item => {
              return (
                <Col span={12} key={item.id}>
                  <Card style={{ height: '300px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Text>{mdOutput(parse(item.header))}</Text>
                    </div>
                    <div style={{ paddingTop: '1em' }}>
                      <InsightItem {...{ ...item }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text>{mdOutput(parse(item.footer))}</Text>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Card>
      </div>
      <Stories {...{ results, stories }} />
    </>
  )
}

export default Insight
