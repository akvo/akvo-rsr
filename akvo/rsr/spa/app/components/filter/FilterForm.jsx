import React from 'react'
import {
  Typography,
  Input,
  Card,
  Col,
  Row,
  Button,
  Checkbox,
} from 'antd'

const { Text } = Typography
const { Search } = Input

const FilterForm = ({
  title,
  search,
  children,
  onCancel,
  onApply,
  onSearch,
  onSelectAll
}) => {
  return (
    <Card id="rsr-filter-items-card">
      <Row type="flex" justify="space-between" align="middle" className="row-header" gutter={[8, 24]}>
        <Col lg={16} md={24} sm={16} xs={16}>{title && <Text strong>{title}</Text>}</Col>
        <Col lg={8} md={16} sm={8} xs={8} className="text-right">
          Select All <Checkbox name="selectAll" onClick={onSelectAll} />
        </Col>
      </Row>
      <Row className="row-search-bar">
        <Col>
          <Search placeholder="Search for..." value={search} onChange={(e) => onSearch(e.target.value)} allowClear />
        </Col>
      </Row>
      {children}
      <Row type="flex" justify="end" align="middle" className="row-footer" gutter={[8, 8]}>
        <Col span={6}>
          <Button type="link" size="small" onClick={onCancel} block>Cancel</Button>
        </Col>
        <Col span={6}>
          <Button size="small" type="primary" onClick={onApply} block>Apply</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default FilterForm
