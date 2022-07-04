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

import Filter from '../../../components/filter'
import PanelHeader from './PanelHeader'

const { Panel } = Collapse
const { Text, Title } = Typography

export const FilterBar = ({
  contributors,
  partners,
  periods,
  countries,
  loading,
  searchReff
}) => {
  const [activeFilter, setActiveFilter] = useState([])
  const [toggle, setToggle] = useState(false)
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
    const fields = { countries, partners, contributors, periods }
    const data = items.map(it => Object.values(fields[fieldName]).find((d) => d.id === it))
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
  const totalItems = sum(Object.values(filtering).map((v) => v.items.length))
  const totalFilter = Object.values(filtering).filter(({ apply }) => (apply)).length
  const totalMatches = 0
  return (
    <Filter className="ui container">
      <Filter.Input
        placeholder="Search title"
        visible={toggle}
        loading={loading}
        count={totalItems}
        onPopOver={() => setToggle(!toggle)}
        ref={searchReff}
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
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.periods.items.length} text="Reporting Period" />} key="2">
                <Filter.Items
                  data={periods}
                  picked={filtering.periods.items}
                  title="Select project period(s)"
                  onCancel={() => handleOnCancel('2')}
                  onApply={() => handleOnApply('periods', '2')}
                  onSetItems={(items) => handleOnSetItems('periods', items)}
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.contributors.items.length} text="Contribution Projects" />} key="3">
                <Filter.Items
                  data={contributors}
                  picked={filtering.contributors.items}
                  title="Select project contributor(s)"
                  onCancel={() => handleOnCancel('3')}
                  onApply={() => handleOnApply('contributors', '3')}
                  onSetItems={(items) => handleOnSetItems('contributors', items)}
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.partners.items.length} text="Partners" />} key="4">
                <Filter.Items
                  data={partners}
                  picked={filtering.partners.items}
                  title="Select partner(s)"
                  onCancel={() => handleOnCancel('4')}
                  onApply={() => handleOnApply('partners', '4')}
                  onSetItems={(items) => handleOnSetItems('partners', items)}
                  isGrouped
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Filter.Input>
      {(totalFilter > 0) && (
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
