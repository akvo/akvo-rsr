import React from 'react'
import {
  Col,
  Row,
  Icon,
  Button,
  Divider,
  Collapse,
  Typography
} from 'antd'
import SelectDebounce from '../../components/SelectDebounce'

const { Text } = Typography

const PopDirectory = ({
  organisations,
  sectors,
  search,
  setSearch,
  onCancel,
  onApply
}) => {
  const handleOnChange = (values, modelName) => {
    setSearch({
      ...search,
      [modelName]: values
    })
  }
  return (
    <Row>
      <Col>
        <Text strong>Applied Filter Results</Text>
      </Col>
      <Col>
        <Divider />
      </Col>
      <Col>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          expandIconPosition="right"
        >
          <Collapse.Panel header={<Text strong>Sectors</Text>} key="sector">
            <SelectDebounce
              name="name"
              placeholder="Search Sector"
              options={sectors}
              onChange={(values) => handleOnChange(values, 'sector')}
              value={search.sector}
              allowClear
            />
          </Collapse.Panel>
          {organisations && (
            <Collapse.Panel header={<Text strong>Organisation</Text>} key="organisation">
              <SelectDebounce
                name="name"
                placeholder="Search Organisation"
                options={organisations}
                onChange={(values) => handleOnChange(values, 'organisation')}
                value={search.organisation}
                allowClear
              />
            </Collapse.Panel>
          )}
        </Collapse>
      </Col>
      <Col style={{ paddingTop: 16 }}>
        <Row type="flex" justify="end">
          <Col span={6}>
            {onCancel && (
              <Button
                type="link"
                onClick={() => {
                  setSearch({
                    sector: [],
                    organisation: []
                  })
                  onCancel()
                }}
              >
                Cancel
              </Button>
            )}
          </Col>
          <Col span={4}>
            {onApply && (
              <Button
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
  )
}

export default PopDirectory
