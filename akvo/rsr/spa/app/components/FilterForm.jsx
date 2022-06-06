import React from 'react'
import {
  Typography,
  Card,
  Icon,
  Col,
  Row,
  Button,
  Checkbox,
  Tooltip
} from 'antd'

const { Text } = Typography

const FilterForm = ({
  title,
  children,
  onCancel,
  onApply,
  onUndo,
  onSelectAll
}) => (
  <Card id="rsr-filter-items-card">
    <Row type="flex" justify="space-around" align="middle" className="row-header">
      <Col lg={14}>{title && <Text strong>{title}</Text>}</Col>
      <Col lg={3}>
        <Tooltip placement="top" title="Undo"><Button type="link" onClick={onUndo}><Icon type="undo" /></Button></Tooltip>
      </Col>
      <Col lg={7}>Select All <Checkbox name="selectAll" onClick={onSelectAll} /></Col>
    </Row>
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

export default FilterForm
