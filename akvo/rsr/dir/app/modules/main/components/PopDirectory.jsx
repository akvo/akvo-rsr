import React from 'react'
import {
  Icon,
  Collapse,
  Typography
} from 'antd'
import SelectDebounce from '../../components/SelectDebounce'

const { Text } = Typography

const PopDirectory = ({
  organisations,
  sectors,
  search,
  setSearch
}) => {
  const handleOnChange = (values, modelName) => {
    setSearch({
      ...search,
      [modelName]: values
    })
  }
  return (
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
  )
}

export default PopDirectory
