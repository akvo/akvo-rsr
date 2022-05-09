import React from 'react'
import {
  Typography,
  Button,
  Icon,
  Row,
  Col,
  Divider,
  Collapse,
  Select,
} from 'antd'

const { Text } = Typography

const PopPeriods = ({ periods, onChange, onCancel, onApply }) => {
  const { Option } = Select
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
          <Collapse.Panel header={<Text strong>Reporting Periods</Text>} key="0">
            <Row gutter={[8, 16]}>
              <Col>
                <Select onChange={onChange} className="w-full" placeholder="Select Period" allowClear>
                  {periods.map((op, ox) => <Option value={op} key={ox}>{op}</Option>)}
                </Select>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Row type="flex" justify="end">
                  <Col span={4}>
                    {onCancel && (
                      <Button size="small" type="link" onClick={onCancel}>
                        Cancel
                      </Button>
                    )}
                  </Col>
                  <Col span={4}>
                    {onApply && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={onApply}
                      >
                        Apply
                      </Button>
                    )}
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

export default PopPeriods
