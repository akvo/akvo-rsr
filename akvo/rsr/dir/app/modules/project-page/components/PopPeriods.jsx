import React, { useState } from 'react'
import {
  Typography,
  Icon,
  Row,
  Col,
  Collapse,
  Select,
} from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { selectPeriod } from '../../../features/periods/periodSlice'

const { Text } = Typography
const { Option } = Select

const PopPeriods = () => {
  const [open, setOpen] = useState(false)

  const { options, fetched } = useSelector((state) => state.periods)
  const dispatch = useDispatch()

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['0']}
      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      expandIconPosition="right"
    >
      <Collapse.Panel header={<Text strong>Reporting Periods</Text>} key="0">
        <Row gutter={[8, 16]}>
          <Col>
            <Select
              open={(open && fetched)}
              onChange={(value) => dispatch(selectPeriod(value))}
              onMouseEnter={() => setOpen(!open)}
              onSelect={() => setOpen(false)}
              loading={!fetched}
              disabled={!fetched}
              mode="multiple"
              className="w-full"
              placeholder="Select Period"
              allowClear
            >
              {options.map((op, ox) => <Option value={op} key={ox}>{op}</Option>)}
            </Select>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default PopPeriods
