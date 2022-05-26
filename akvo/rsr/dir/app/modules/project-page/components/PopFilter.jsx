import React from 'react'
import {
  Typography,
  Input,
  Icon,
  Row,
  Col,
  Collapse,
  Form,
} from 'antd'
import SelectDebounce from '../../components/SelectDebounce'

const { Text } = Typography

const PopFilter = ({
  writers,
  authors,
  setAuthors
}) => (
  <Collapse
    bordered={false}
    defaultActiveKey={['0']}
    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    expandIconPosition="right"
  >
    <Collapse.Panel header={<Text strong>Contributing Writers</Text>} key="0">
      <Row>
        <Col>
          <Form>
            <Form.Item label={<Text strong>Select Contributing Writers</Text>}>
              <SelectDebounce
                name="fullName"
                placeholder="Search Writer"
                options={writers}
                onChange={(values) => setAuthors(values)}
                value={authors}
                max={writers.length}
                allowClear
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Collapse.Panel>
  </Collapse>
)

export default PopFilter
