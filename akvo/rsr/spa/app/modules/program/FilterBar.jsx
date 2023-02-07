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
} from 'antd'
import moment from 'moment'
import uniq from 'lodash/uniq'
import sum from 'lodash/sum'
import classNames from 'classnames'
import { connect } from 'react-redux'

import Filter from '../../components/filter'
import countriesDict from '../../utils/countries-dict'
import { setNumberFormat } from '../../utils/misc'
import { getStatusFiltering } from './utils/filters'
import { handleOnCountFiltering, handleOnFiltering } from './utils/query'
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
  programmeRdr,
  source,
  loading,
  ...actionProps
}) => {
  const {
    applyFilter,
    setFilterItems,
    removeFilterItem,
    clearFilter,
  } = actionProps

  const [countryOpts, setCountryOpts] = useState([])
  const [contributors, setContributors] = useState([])
  const [periods, setPeriods] = useState([])
  const [partners, setPartners] = useState([])
  const [toggle, setToggle] = useState(false)
  const [preload, setPreload] = useState(true)
  const [search, setSearch] = useState(null)
  const itemPeriods = periods?.map((p, px) => ({ id: px, value: p }))
  const countries = countryOpts?.map((c) => ({ id: c, value: countriesDict[c] }))

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
  const handleOnSetItems = (fieldName, items = []) => {
    const fields = { countries, partners, contributors, periods: itemPeriods }
    const data = items.map(it => Object.values(fields[fieldName]).find((d) => d.id === it))
    setFilterItems({ fieldName, data })
  }
  const handleOnClear = () => {
    if (search) {
      setSearch(null)
    }
    clearFilter()
  }
  const handleOnCloseTag = (fieldName, id) => removeFilterItem({ fieldName, id })

  const { allFilters } = getStatusFiltering(filtering)
  const resultItems = []
  // handleOnFiltering(programmeRdr, filtering, search)
  const totalItems = sum(allFilters.map((v) => v.items.length))
  const totalMatches = handleOnCountFiltering(resultItems, filtering, search)
  console.log('filtering', filtering);

  useEffect(() => {
    if (preload) {
      /**
       * run only once
       */
      setPreload(false)
      clearFilter()
    }
    if (source && !countryOpts.length && !contributors.length && !partners.length && !periods.length) {
      const opts = []
      source.forEach(result => {
        result.countries.forEach(opt => { if (opts.indexOf(opt) === -1) opts.push(opt) })
      })
      setCountryOpts(opts)
      setContributors(handleOnUnique(source, 'contributors'))
      setPartners(handleOnUnique(source, 'partners'))
      const pds = uniq(source
        ?.flatMap((r) => r.periods)
        ?.filter((p) => (p[0] && p[1]))
        ?.map((p) => `${moment(p[0], 'YYYY-MM-DD').format('DD/MM/YYYY')} - ${moment(p[1], 'YYYY-MM-DD').format('DD/MM/YYYY')}`))
        ?.sort((a, b) => {
          const xb = b.split(' - ')
          const xa = a.split(' - ')
          return moment(xa[1], 'DD/MM/YYYY').format('YYYY') - moment(xb[1], 'DD/MM/YYYY').format('YYYY')
        })
      setPeriods(pds)
    }
    if (totalItems === 0 && allFilters.length) {
      handleOnClear()
    }
  }, [
    source,
    preload,
    countryOpts,
    contributors,
    periods,
    partners
  ])

  return (
    <>
      <Filter>
        <Filter.Input
          placeholder="Search title"
          visible={toggle}
          loading={loading}
          count={totalItems}
          onPopOver={() => setToggle(!toggle)}
          value={search}
          onChange={e => setSearch(e.target.value)}
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
            <Title level={4}>{totalItems}</Title>
            <Button type="link" onClick={handleOnClear}><Icon type="close-circle" /></Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24} className="collapse-filter">
            <Collapse accordion bordered={false} expandIconPosition="right">
              <Panel header={<PanelHeader count={filtering.countries.items.length} text="Location" />} key="1">
                <Filter.Items
                  data={countries}
                  picked={filtering.countries.items}
                  title="Select project Location(s)"
                  onApply={() => handleOnApply('countries')}
                  onSetItems={(items) => handleOnSetItems('countries', items)}
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.periods.items.length} text="Reporting Period" />} key="2">
                <Filter.Items
                  data={periods}
                  picked={filtering.periods.items}
                  title="Select project period(s)"
                  onApply={() => handleOnApply('periods')}
                  onSetItems={(items) => handleOnSetItems('periods', items)}
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.contributors.items.length} text="Contribution Projects" />} key="3">
                <Filter.Items
                  data={contributors}
                  picked={filtering.contributors.items}
                  title="Select contributing project(s)"
                  onApply={() => handleOnApply('contributors')}
                  onSetItems={(items) => handleOnSetItems('contributors', items)}
                  isGrouped
                />
              </Panel>
              <Panel header={<PanelHeader count={filtering.partners.items.length} text="Partners" />} key="4">
                <Filter.Items
                  data={partners}
                  picked={filtering.partners.items}
                  title="Select partner(s)"
                  onApply={() => handleOnApply('partners')}
                  onSetItems={(items) => handleOnSetItems('partners', items)}
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
  ({ programmeRdr, filterRdr }) => ({ programmeRdr, filterRdr }), actions
)(FilterBar)
