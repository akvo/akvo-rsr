import React, { useState, useEffect } from 'react'
import { Col, Row, Select } from 'antd'
import FilterForm from './FilterForm'

const { Option } = Select

const FilterDropdown = ({
  data = [],
  picked = [],
  mode = 'multiple',
  title,
  onSetItems,
  onCancel,
  onApply
}) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState([])

  const handleOnSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data)
      onSetItems(data)
    } else {
      setSelected([])
      onSetItems([])
    }
  }

  useEffect(() => {
    if (picked && picked.length !== selected.length) {
      setSelected([])
    }
  }, [picked, selected])
  return (
    <FilterForm
      title={title}
      onCancel={onCancel}
      onApply={onApply}
      onUndo={() => {
        onSetItems([])
        setSelected([])
      }}
      onSelectAll={handleOnSelectAll}
    >
      <Row>
        <Col>
          <Select
            mode={mode}
            value={selected}
            onChange={(values) => {
              setSelected(values)
              onSetItems(values)
            }}
            style={{
              width: '100%'
            }}
          >
            {data?.map(d => <Option key={d} value={d}>{d}</Option>)}
          </Select>
        </Col>
      </Row>
    </FilterForm>
  )
}

export default FilterDropdown
