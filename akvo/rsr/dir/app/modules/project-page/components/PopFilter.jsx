import React, { useEffect, useState } from 'react'
import {
  Typography,
  Input,
  Icon,
  Row,
  Col,
  Collapse,
  List,
  Checkbox,
} from 'antd'
import groupBy from 'lodash/groupBy'
import classNames from 'classnames'

const { Title, Text } = Typography
const { Search } = Input

const PopFilter = ({
  filter,
  writers,
  authors,
  setAuthors
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
    if (isExist) {
      setAuthors(authors.filter((a) => a.id !== value.id))
    } else {
      setAuthors([...authors, value])
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
  useEffect(() => {
    if (!filter.visible && !filter.apply) {
      if (isChecked) {
        setIsChecked(false)
      }
      if (authors.length > 0) {
        setAuthors([])
      }
    }
  }, [filter, isChecked, authors])
  return (
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
              <Col lg={18} md={18} sm={24} xs={24} className="mb-1">
                <Text strong>Select Contributing Writers</Text>
              </Col>
              <Col lg={6} md={6} sm={24} xs={24} className="mb-1 text-right">
                <div style={{ display: 'flex', gap: 10 }}>
                  <span>Select all</span>
                  <span><Checkbox onChange={handleOnSelectAll} checked={isChecked} /></span>
                </div>
              </Col>
              <Col span={24}>
                <Search
                  placeholder="Search for"
                  className="w-full"
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
                  <Row gutter={[{ lg: 16, md: 8, sm: 8, xs: 8 }, 8]} type="flex" justify="start" align="top">
                    <Col span={2}>
                      <Title level={4}>{item}</Title>
                    </Col>
                    <Col span={22}>
                      <List
                        className="filter-writers"
                        dataSource={groups[item]}
                        renderItem={v => (
                          <List.Item
                            className={classNames({
                              'selected': (authors.filter((at) => at.id === v.id).length > 0)
                            })}
                            onClick={() => handleOnClick(v)}
                          >
                            {v.firstName} {v.lastName}
                          </List.Item>
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default PopFilter
