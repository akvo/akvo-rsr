import React, { useState } from 'react'
import {
  Collapse,
  Typography,
  Icon,
  Row,
  Col,
  Button
} from 'antd'
import sum from 'lodash/sum'

import countriesDict from '../../../utils/countries-dict'
import Filter from '../../../components/filter'
import PanelHeader from './PanelHeader'

const { Panel } = Collapse
const { Text, Title } = Typography

export const FilterBar = ({
  loading,
  countryOpts
}) => {
  const [activeFilter, setActiveFilter] = useState([])
  const [toggle, setToggle] = useState(false)
  const [search, setSearch] = useState(null)
  const [filtering, setFiltering] = useState({
    countries: {
      items: [],
      apply: false
    },
    contributors: {
      items: [],
      apply: false
    },
    periods: {
      items: [],
      apply: false
    },
    partners: {
      items: [],
      apply: false
    }
  })

  const handleOnCancel = (key) => {
    setActiveFilter(activeFilter.filter((af) => af !== key))
  }
  const handleOnApply = (fieldName, key) => {
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        apply: true
      }
    })
    handleOnCancel(key)
    setToggle(false)
  }
  const handleOnSetItems = (fieldName, items = []) => {
    const fields = { countries: countriesDict }
    const data = items.map((it, ix) => {
      const find = fieldName === 'periods' ? null : Object.values(fields[fieldName]).find((d) => d.id === it)
      return find || {
        id: fieldName === 'periods' ? ix + 1 : it,
        value: fieldName === 'periods'
          ? it
          : fields[fieldName] ? fields[fieldName][it] || it : it
      }
    })
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        key: fieldName,
        items: data
      }
    })
  }
  const handleOnClear = () => {
    if (search) {
      setSearch(null)
    }
    setFiltering({
      countries: {
        items: [],
        apply: false
      },
      contributors: {
        items: [],
        apply: false
      },
      periods: {
        items: [],
        apply: false
      },
      partners: {
        items: [],
        apply: false
      }
    })
  }
  const handleOnCloseTag = (fieldName, id) => {
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        items: filtering[fieldName]?.items?.filter((d) => d.id !== id)
      }
    })
  }
  const countries = countryOpts?.map((c) => ({ id: c, value: countriesDict[c] }))
  const totalItems = sum(Object.values(filtering).map((v) => v.items.length))
  const totalFilter = Object.values(filtering).filter(({ apply }) => (apply)).length
  const totalMatches = 0
  return (
    <Filter className="ui container">
      <Filter.Input
        value={search}
        placeholder="Search title"
        visible={toggle}
        loading={loading}
        count={totalItems}
        onChange={setSearch}
        onPopOver={() => setToggle(!toggle)}
      >
        <Row gutter={[8, 8]} style={{ width: 400 }}>
          <Col lg={16} className="title-filter">
            <Text strong>Applied Filter Results</Text>
          </Col>
          <Col lg={8} className="total-filter">
            <Title level={4}>{totalItems}</Title>
            <Button type="link" onClick={handleOnClear}><Icon type="close-circle" /></Button>
          </Col>
          <Col span={24} className="collapse-filter">
            <Collapse activeKey={activeFilter} onChange={setActiveFilter} bordered={false} expandIconPosition="right">
              <Panel header={<PanelHeader count={filtering.countries.items.length} text="Location" />} key="1">
                <Filter.Items
                  data={countries}
                  picked={filtering.countries.items}
                  title="Select project Location(s)"
                  onCancel={() => handleOnCancel('1')}
                  onApply={() => handleOnApply('countries', '1')}
                  onSetItems={(items) => handleOnSetItems('countries', items)}
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Filter.Input>
      {(search || totalFilter > 0) && (
        <div className="filter-selected-bar flex-between">
          <div className="filter-selected-bar">
            <div className="bar-column">
              <div className="info">
                <h2>{totalMatches}</h2>
                <Text strong>Matches</Text>
              </div>
            </div>
            {Object.values(filtering)
              .filter(({ apply, items }) => (apply && items.length))
              .map(({ items, key }, ix) => (
                <div className="bar-column" key={ix}>
                  <Row>
                    <Col className="title">
                      <strong>{key?.toUpperCase()}</strong>
                    </Col>
                    <Col>
                      {items?.map(it => (
                        <Filter.Tag className={`color-${key}`} key={it.id} onClose={() => handleOnCloseTag(key, it.id)}>
                          {it?.value}
                        </Filter.Tag>
                      ))}
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
          <div className="bar-column">
            <Button type="link" icon="close-circle" onClick={handleOnClear}>Clear all</Button>
          </div>
        </div>
      )}
    </Filter>
  )
}
