import React, { useState, useEffect } from 'react'
import {
  Icon,
  Badge,
  Row,
  Col,
  Button,
  Popover,
  Collapse,
  List,
  Card,
  Typography,
  Tooltip,
} from 'antd'
import moment from 'moment'
import sum from 'lodash/sum'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import classNames from 'classnames'
import { connect } from 'react-redux'

import Filter from '../../components/filter'
import countriesDict from '../../utils/countries-dict'
import { setNumberFormat } from '../../utils/misc'
import { getStatusFiltering } from '../program/utils/filters'
import * as actions from '../../store/filter/actions'

const { Panel } = Collapse
const { Text, Title } = Typography

const PanelHeader = ({ count, text }) => (
  <div className="header-panel-filter">
    <div>
      <Text strong>{text}</Text>
    </div>
    <div>
      <Badge count={count} className="badge-filter" />
    </div>
  </div>
)

const FilterBar = ({
  filterRdr: filtering,
  programID,
  totalMatches,
  search,
  setSearch,
  handleOnSearch,
  ...actionProps
}) => {
  const [toggle, setToggle] = useState(false)
  const {
    applyFilter,
    setFilterItems,
    removeFilterItem,
    clearFilter,
  } = actionProps

  const handleOnUnique = (data, field) => {
    const ds = data
      ?.map((d) => (
        Object.keys(d[field]).map((r) => ({
          id: parseInt(r, 10),
          value: d[field][r]
        }))
      ))
      ?.flatMap((d) => d)
    return uniq(data.flatMap((r) => Object.keys(r[field])))
      ?.map((k) => ds.find((d) => d.id === parseInt(k, 10)))
      ?.sort((a, b) => a?.value?.localeCompare(b?.value))
      ?.filter((v) => v)
  }
  const handleOnApply = (fieldName) => {
    applyFilter({ fieldName })
    setToggle(false)
  }
  const handleOnSetItems = (dataSource, fieldName, items = []) => {
    const data = items.map(it => Object.values(dataSource).find((d) => d.id === it))
    setFilterItems({ fieldName, data })
  }
  const handleOnClear = () => {
    if (search) {
      setSearch(null)
    }
    clearFilter()
  }
  const handleOnCloseTag = (fieldName, id) => removeFilterItem({ fieldName, id })

  const { data: dataFilter } = filtering || {}
  const { allFilters } = getStatusFiltering(filtering)
  const totalFilters = sum(allFilters.map((v) => v.items.length))
  const contributors = handleOnUnique(dataFilter, 'contributors')
  const partners = handleOnUnique(dataFilter, 'partners')
  const countryOpts = uniq(dataFilter?.flatMap((s) => s?.countries))
    ?.map((c) => ({
      id: c,
      value: countriesDict[c]
    }))
  const pds = dataFilter
    ?.flatMap((r) => r.periods)
    ?.filter((p) => {
      const { 0: periodStart, 1: periodEnd } = p
      return (periodStart && periodEnd)
    })
    ?.sort((a, b) => {
      const { 1: periodEndA } = a
      const { 1: periondEndB } = b
      return moment(periodEndA, 'YYYY-MM-DD').format('YYYY') - moment(periondEndB, 'YYYY-MM-DD').format('YYYY')
    })
    ?.map((p, px) => {
      const { 0: periodStart, 1: periodEnd } = p
      const _period = `${moment(periodStart, 'YYYY-MM-DD').format('DD/MM/YYYY')} - ${moment(periodEnd, 'YYYY-MM-DD').format('DD/MM/YYYY')}`
      return {
        id: px,
        value: _period
      }
    })
  const periods = uniqBy(pds, 'value')

  useEffect(() => {
    if (totalFilters === 0 && allFilters.length) {
      handleOnClear()
    }
  }, [totalFilters, allFilters, filtering])

  return (
    <>
      <Filter>
        <Filter.Input
          placeholder="Search title"
          visible={toggle}
          count={totalFilters}
          onPopOver={() => setToggle(!toggle)}
          onChange={e => handleOnSearch(e.target.value)}
        />
        {((allFilters.length > 0) || search) && (
          <div className="filter-selected-bar flex-between">
            <div className="filter-selected-bar">
              <div className="bar-column">
                <div className="info">
                  <h2>{setNumberFormat(totalMatches)}</h2>
                  <Text strong>Matches</Text>
                </div>
              </div>
              {Object.values(filtering)
                .filter(({ apply, items }) => (apply && items.length))
                .map(({ items, key }, ix) => {
                  const firstItems = items?.slice(0, 5)
                  const leftItems = items?.slice(5)
                  return (
                    <div className="bar-column" key={ix}>
                      <Row>
                        <Col>
                          <strong>{key?.toUpperCase()}</strong>
                        </Col>
                      </Row>
                      <Row type="flex" align="middle" justify="start">
                        <Col>
                          {firstItems?.map(item => (
                            <Filter.Tag className={`color-${key}`} key={item.id} onClose={() => handleOnCloseTag(key, item.id)}>
                              {item.value}
                            </Filter.Tag>
                          ))}
                          {(leftItems?.length > 0) && (
                            <Popover
                              trigger="click"
                              title={key?.toUpperCase()}
                              overlayClassName="filter-more"
                              content={(
                                <List
                                  dataSource={leftItems}
                                  className="filter-more-items"
                                  renderItem={item => (
                                    <List.Item>
                                      <Row type="flex" justify="space-between" align="middle" className="filter-more-item">
                                        <Col lg={20} className="value">{item.value}</Col>
                                        <Col lg={4}>
                                          <Button type="link" onClick={() => handleOnCloseTag(key, item.id)}>
                                            <Icon type="close" />
                                          </Button>
                                        </Col>
                                      </Row>
                                    </List.Item>
                                  )}
                                />
                              )}
                              placement="bottom"
                            >
                              <Button shape="circle" className={`color-${key}`}>{leftItems.length > 99 ? '99+' : `+${leftItems.length}`}</Button>
                            </Popover>
                          )}
                        </Col>
                      </Row>
                    </div>
                  )
                })}
            </div>
            <div className="bar-column">
              <Button type="link" icon="close-circle" onClick={handleOnClear}>Clear all</Button>
            </div>
          </div>
        )}
      </Filter>
      <Card className={classNames('rsr-card-filter-container', { show: toggle })}>
        <Row gutter={[8, 8]} className="header-filter">
          <Col span={16} className="title-filter">
            <Text strong>Applied Filter Results</Text>
          </Col>
          <Col span={8} className="total-filter">
            <Title level={4}>{totalFilters}</Title>
            <div tabIndex="0" role="button" aria-pressed="false" style={{ cursor: 'pointer' }} onClick={handleOnClear}>
              <Tooltip title="Clear all filters">
                <Icon type="close-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24} className="collapse-filter">
            <Collapse accordion bordered={false} expandIconPosition="right">
              <Panel header={<PanelHeader count={filtering.countries.items.length} text="Location" />} key="1">
                <Filter.Items
                  data={countryOpts}
                  picked={filtering.countries.items}
                  title="Select project Location(s)"
                  onApply={() => handleOnApply('countries')}
                  onSetItems={(items) => handleOnSetItems(countryOpts, 'countries', items)}
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.periods.items.length} text="Reporting Period" />} key="2">
                <Filter.Items
                  data={periods}
                  picked={filtering.periods.items}
                  title="Select project period(s)"
                  onApply={() => handleOnApply('periods')}
                  onSetItems={(items) => handleOnSetItems(periods, 'periods', items)}
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.contributors.items.length} text="Contribution Projects" />} key="3">
                <Filter.Items
                  data={contributors}
                  picked={filtering.contributors.items}
                  title="Select contributing project(s)"
                  onApply={() => handleOnApply('contributors')}
                  onSetItems={(items) => handleOnSetItems(contributors, 'contributors', items)}
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.partners.items.length} text="Partners" />} key="4">
                <Filter.Items
                  data={partners}
                  picked={filtering.partners.items}
                  title="Select partner(s)"
                  onApply={() => handleOnApply('partners')}
                  onSetItems={(items) => handleOnSetItems(partners, 'partners', items)}
                  isGrouped
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default connect(
  ({ filterRdr }) => ({ filterRdr }), actions
)(FilterBar)
