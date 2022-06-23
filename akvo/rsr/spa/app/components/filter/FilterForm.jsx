import React, { useState } from 'react'
import {
  Typography,
  Input,
  Card,
  Icon,
  Col,
  Row,
  Button,
  Checkbox,
  Tooltip
} from 'antd'

const { Text } = Typography
const { Search } = Input

const FilterForm = ({
  title,
  search,
  children,
  onCancel,
  onApply,
  onUndo,
  onSearch,
  onSelectAll
}) => {
  const [toggle, setToggle] = useState(false)

  return (
    <Card id="rsr-filter-items-card">
      <Row type="flex" justify="space-between" align="middle" className="row-header">
        <Col lg={14}>{title && <Text strong>{title}</Text>}</Col>
        <Col lg={2}>
          <Button shape="circle" icon="search" size="small" onClick={() => setToggle(!toggle)} />
        </Col>
        <Col lg={7}>Select All <Checkbox name="selectAll" onClick={onSelectAll} /></Col>
      </Row>
      {toggle && (
        <Row className="row-search-bar">
          <Col>
            <Search placeholder="Search for..." value={search} onChange={(e) => onSearch(e.target.value)} allowClear />
          </Col>
        </Row>
      )}
      {children}
      <Row type="flex" justify="end" align="middle" className="row-footer" gutter={[8, 8]}>
        <Col lg={6}>
          <Button type="link" size="small" onClick={onCancel} block>Cancel</Button>
        </Col>
        <Col lg={6}>
          <Button size="small" type="primary" onClick={onApply} block>Apply</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default FilterForm
