import React from 'react'
import moment from 'moment'
import {
  Row,
  Col,
  List,
  Typography,
  Avatar
} from 'antd'
import SimpleMarkdown from 'simple-markdown'

const { Text } = Typography

const Qualitative = ({ periods }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  const data = periods.map((p) => ({
    id: p.id,
    period: `${moment(p.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - ${moment(p.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}`,
    updates: p.updates
  }))
  return (
    <Row gutter={[8, 16]}>
      {data.filter((d) => (d.updates.length)).map((d) => (
        <Col className="allPeriods" key={d.id}>
          <List
            header={<div>{d.period}</div>}
            bordered
            dataSource={d.updates}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{`${item.userDetails.firstName[0]} ${item.userDetails.lastName[0]}`}</Avatar>}
                  title={<Text strong>{`${item.userDetails.firstName} ${item.userDetails.lastName}`}</Text>}
                  description={(
                    <>
                      <Text type="secondary">{mdOutput(parse(item.narrative))}</Text>
                      <div style={{ display: 'flex', gap: 32 }}>
                        <Text strong>Created on</Text>
                        <Text>: {moment(item.createdAt, 'YYYY-MM-DD').format('D MMM YYYY')}</Text>
                      </div>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <Text strong>Approved on</Text>
                        <Text>: {moment(item.lastModifiedAt, 'YYYY-MM-DD').format('D MMM YYYY')}</Text>
                      </div>
                    </>
                  )}
                />
              </List.Item>
            )}
          />
        </Col>
      ))}
    </Row>
  )
}

export default Qualitative
