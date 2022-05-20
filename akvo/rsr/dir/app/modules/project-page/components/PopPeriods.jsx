import React from 'react'
import {
  Typography,
  Icon,
  Row,
  Col,
  Collapse,
  Select,
} from 'antd'

const { Text } = Typography
const { Option } = Select

const PopPeriods = ({ periods, onChange }) => (
  <Collapse
    bordered={false}
    defaultActiveKey={['0']}
    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    expandIconPosition="right"
  >
    <Collapse.Panel header={<Text strong>Reporting Periods</Text>} key="0">
      <Row gutter={[8, 16]}>
        <Col>
          <Select onChange={onChange} className="w-full" placeholder="Select Period" allowClear>
            {periods.map((op, ox) => <Option value={op} key={ox}>{op}</Option>)}
          </Select>
        </Col>
      </Row>
    </Collapse.Panel>
  </Collapse>
)

export default PopPeriods
