import React, { useEffect, useState } from 'react'
import {
  Typography,
  Col,
  Row,
  Input,
  Button,
} from 'antd'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import FilterForm from './FilterForm'

const { Text } = Typography
const { Search } = Input

const FilterItems = ({
  data = [],
  picked = null,
  title = '',
  onSetItems,
  onCancel,
  onApply
}) => {
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState(null)

  const handleOnSelect = (id) => {
    const modified =
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    onSetItems(modified)
    setSelected(modified)
  }
  const handleOnSelectAll = (e) => {
    if (e.target.checked) {
      const items = data?.map((d) => d?.id)
      onSetItems(items)
      setSelected(items)
    } else {
      onSetItems([])
      setSelected([])
    }
  }
  const options = groupBy(
    data
      ?.sort((a, b) => a.value.localeCompare(b.value))
      ?.filter((d) => search ? d?.value?.toLowerCase()?.includes(search.toLowerCase()) : d)
      ?.map((d) => ({ ...d, alfabet: d?.value[0]?.toUpperCase() })),
    'alfabet'
  )

  useEffect(() => {
    if (picked && picked.length !== selected.length) {
      setSelected([])
    }
  }, [picked, selected])
  return (
    <FilterForm
      title={title}
      onCancel={() => {
        onSetItems([])
        onCancel()
      }}
      onApply={onApply}
      onUndo={() => setSelected([])}
      onSelectAll={handleOnSelectAll}
    >
      <Row className="row-search-bar">
        <Col>
          <Search placeholder="Search for..." onChange={(e) => setSearch(e.target.value)} allowClear />
        </Col>
      </Row>
      <div className="row-items">
        {Object.keys(options)?.map((key) => (
          <Row type="flex" align="top" justify="start" key={key}>
            <Col lg={2} className="alfabet">
              <Text strong>{key}</Text>
            </Col>
            <Col lg={22}>
              <ul className="filter-options">
                {options[key]?.map((option, vx) => (
                  <li key={vx} className={classNames({ selected: selected.includes(option.id) })} onClick={() => handleOnSelect(option.id)}>
                    <Button type="link">{option?.value}</Button>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        ))}
      </div>
    </FilterForm>
  )
}

export default FilterItems
