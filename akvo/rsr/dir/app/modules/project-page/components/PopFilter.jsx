import React, { useState } from 'react'
import {
  Typography,
  Input,
  Button,
  Icon,
  Row,
  Col,
  Divider,
  Collapse,
  List,
  Checkbox,
} from 'antd'
import groupBy from 'lodash/groupBy'

const { Title, Text } = Typography
const { Search } = Input

const PopFilter = ({
  writers,
  authors,
  setAuthors,
  setFilter
}) => {
  const [search, setSearch] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  writers = writers.filter((w) => {
    if (search) {
      return `${w.firstName.toLowerCase()} ${w.lastName.toLowerCase()}`.includes(search.toLowerCase())
    }
    return w
  })
  const groups = groupBy(writers, 'firstLetter')

  const handleOnClick = (value) => {
    const isExist = authors.find((a) => a.id === value.id)
    if (!isExist) {
      setAuthors([
        ...authors,
        value
      ])
    }
  }

  const handleOnSelectAll = e => {
    setIsChecked(e.target.checked)
    if (e.target.checked) {
      setAuthors(writers)
    } else {
      setAuthors([])
    }
  }

  const handleOnCancel = () => {
    if (isChecked) {
      setIsChecked(false)
    }
    setAuthors([])
    setFilter({
      visible: false,
      apply: false
    })
  }

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Text strong>Applied Filter Results</Text>
      </Col>
      <Col>
        <Divider />
      </Col>
      <Col>
        <Collapse
          bordered={false}
          defaultActiveKey={['0']}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          expandIconPosition="right"
        >
          <Collapse.Panel header={<Text strong>Contributing Writers</Text>} key="0">
            <Row gutter={[8, 16]}>
              <Col>
                <Row>
                  <Col span={18} className="mb-1">
                    <Text strong>Select Contributing Writers</Text>
                  </Col>
                  <Col span={6} className="mb-1" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span>Select all</span>
                      <span><Checkbox onChange={handleOnSelectAll} checked={isChecked} /></span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <Search
                      placeholder="Search for"
                      style={{ width: '100%' }}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col style={{ height: 200, overflowY: 'scroll' }}>
                <Row>
                  {Object.keys(groups).map((item, key) => (
                    <Col key={key}>
                      <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ paddingTop: 12 }}>
                          <Title level={4}>{item}</Title>
                        </div>
                        <div style={{ width: '100%' }}>
                          <List
                            dataSource={groups[item]}
                            renderItem={v => (
                              <List.Item style={{ cursor: 'pointer' }} onClick={() => handleOnClick(v)}>
                                {v.firstName} {v.lastName}
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Row type="flex" justify="end">
                  <Col span={4}>
                    <Button size="small" type="link" onClick={handleOnCancel}>
                      Cancel
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        setFilter({
                          visible: false,
                          apply: true
                        })
                      }}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default PopFilter
