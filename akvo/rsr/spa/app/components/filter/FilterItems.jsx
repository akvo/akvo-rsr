import React, { useEffect, useState } from 'react'
import {
  Typography,
  Col,
  Row,
  Button,
  Tag,
} from 'antd'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import FilterForm from './FilterForm'
import { getFirstLetter } from '../../utils/misc'

const { Text } = Typography

const FilterItems = ({
  data = [],
  picked = null,
  title = '',
  isGrouped = false,
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
  const options = isGrouped
    ? groupBy(
      data
        ?.filter((d) => search ? d?.value?.toLowerCase()?.includes(search.toLowerCase()) : d)
        ?.map((d) => ({ ...d, alfabet: getFirstLetter(d.value)?.toUpperCase() }))
        ?.sort((a, b) => a.alfabet.localeCompare(b.alfabet)),
      'alfabet'
    )
    : data

  useEffect(() => {
    if (picked && (picked.length < selected.length && (picked.length !== selected.length))) {
      setSelected([])
    }
  }, [picked, selected])
  return (
    <FilterForm
      search={search}
      title={title}
      onCancel={() => {
        onSetItems([])
        onCancel()
      }}
      onApply={onApply}
      onUndo={() => setSelected([])}
      onSelectAll={handleOnSelectAll}
      onSearch={setSearch}
    >
      {(selected.length > 0) && (
        <div className="row-selected">
          {selected.map((s, sx) => {
            const findValue = picked.find((p) => p.id === s)
            return findValue && <Tag key={sx} style={{ maxWidth: '200px', textOverflow: 'ellipsis' }}>{findValue.value}</Tag>
          })}
        </div>
      )}
      <div className="row-items">
        {
          isGrouped
            ? Object.keys(options)?.map((key) => (
              <Row type="flex" align="top" justify="start" key={key}>
                <Col lg={2} className="alfabet">
                  <Text strong>{key}</Text>
                </Col>
                <Col lg={22}>
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
