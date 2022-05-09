import React from 'react'
import {
  Col,
  Row,
  Icon,
  Button,
  Divider,
  Collapse,
  Typography,
  Select
} from 'antd'
import uniqBy from 'lodash/uniqBy'
import SelectDebounce from '../../components/SelectDebounce'

const { Text } = Typography
const { Option } = Select

const PopDirectory = ({
  organisations,
  sectors,
  search,
  setSearch,
  onCancel,
  onApply
}) => {
  const handleOnCreateOption = (data, fieldName, fieldId) => {
    return (data && data.length > 0)
      ? uniqBy(data, fieldName)
        .map((d) => (
          <Option value={`${d[fieldId]}`} key={d[fieldId]}>
            {d[fieldName]}
          </Option>
        ))
      : null
  }

  const handleOnChange = (values, modelName) => {
    setSearch({
      ...search,
      [modelName]: values
    })
  }
  const sectorOptions = sectors ? handleOnCreateOption(sectors, 'name', 'id') : []
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
            <Select
              name="sector"
              className="w-full"
              mode="multiple"
              placeholder="Search Sector"
              suffix={<Icon type="search" />}
              onChange={(values) => handleOnChange(values, 'sector')}
              value={search.sector}
              allowClear
            >
              {sectorOptions}
            </Select>
          </Collapse.Panel>
          <Collapse.Panel header={<Text strong>Organisation</Text>} key="organisation">
            {organisations && (
              <SelectDebounce
                name="longName"
                placeholder="Search Organisation"
                options={organisations}
                onChange={(values) => handleOnChange(values, 'organisation')}
                value={search.organisation}
                allowClear
              />
            )}
          </Collapse.Panel>
        </Collapse>
      </Col>
      <Col style={{ paddingTop: 16 }}>
        <Row type="flex" justify="end">
          <Col span={4}>
            {onCancel && (
              <Button
                size="small"
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
  )
}

export default PopDirectory
