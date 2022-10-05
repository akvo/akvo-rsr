import React, { useEffect, useState } from 'react'
import {
  Typography,
  Col,
  Row,
  Button,
  Tag,
  Icon,
} from 'antd'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import FilterForm from './FilterForm'
import { getFirstLetter } from '../../utils/misc'

const { Text } = Typography

const FilterItems = ({
  data = [],
  picked = [],
  title = '',
  isGrouped = false,
  onSetItems,
  onApply
}) => {
  const pickedItems = picked?.map((p) => p?.id)

  const [selected, setSelected] = useState(pickedItems)
  const [search, setSearch] = useState(null)

  const handleOnSelect = (id) => {
    const modified =
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    onSetItems(modified)
  }
  const handleOnSelectAll = (e) => {
    if (e.target.checked) {
      const items = data?.map((d) => d?.id)
      onSetItems(items)
    } else {
      onSetItems([])
    }
  }
  const options = isGrouped
    ? groupBy(
      data
        ?.filter((d) => search ? d?.value?.toLowerCase()?.includes(search.toLowerCase()) : d)
        ?.map((d) => ({ ...d, alfabet: getFirstLetter(d.value)?.toUpperCase() }))
        ?.sort((a, b) => a?.alfabet?.localeCompare(b.alfabet)),
      'alfabet'
    )
    : data

  useEffect(() => {
    if (pickedItems.length !== selected.length) {
      setSelected(pickedItems)
    }
  }, [pickedItems, selected])
  return (
    <FilterForm
      search={search}
      title={title}
      onCancel={() => {
        onSetItems([])
      }}
      onApply={onApply}
      onUndo={() => setSelected([])}
      onSelectAll={handleOnSelectAll}
      onSearch={setSearch}
    >
      <div className={classNames({ 'row-selected': (picked?.length > 0) })}>
        {picked?.map((it, dx) => (
          <Tag key={dx} onClick={() => handleOnSelect(it?.id)}>
            {`${it?.value} `}<Icon type="close" />
          </Tag>
        ))}
      </div>
      <div className="row-items">
        {
          isGrouped
            ? Object.keys(options)?.map((key) => (
              <Row type="flex" align="top" justify="start" key={key}>
                <Col lg={2} md={2} sm={24} xs={24} className="alfabet">
                  <Text strong>{key}</Text>
                </Col>
                <Col lg={22} md={22} sm={24} xs={24}>
                  <ul className="filter-options">
                    {options[key]?.map((option, vx) => (
                      <li key={vx} className={classNames({ selected: selected.includes(option.id) })}>
                        <Button type="link" onClick={() => handleOnSelect(option.id)} block>{option?.value}</Button>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            ))
            : (
              <Row>
                <Col>
                  <ul className="filter-options">
                    {options.map((option, vx) => (
                      <li key={vx} className={classNames({ selected: selected.includes(option.id) })}>
                        <Button type="link" onClick={() => handleOnSelect(option.id)} block>{option?.value}</Button>
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            )
        }
      </div>
    </FilterForm>
  )
}

export default FilterItems
