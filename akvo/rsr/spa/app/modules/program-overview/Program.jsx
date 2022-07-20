import React, { useState, useEffect } from 'react'
import {
  Icon,
  Spin,
  Collapse,
  Typography,
  Badge,
  Row,
  Col,
  Button,
  Popover,
  List
} from 'antd'
import { Redirect } from 'react-router-dom'
import useSWR from 'swr'
import { sum, uniq } from 'lodash'
import moment from 'moment'

import api from '../../utils/api'
import countriesDict from '../../utils/countries-dict'
import InitialView from './InitialView'
import ProgramView from './ProgramView'
import Filter from '../../components/filter'
import { getStatusFiltering, handleOnCountFiltering, handleOnFiltering } from './query'
import { setNumberFormat } from '../../utils/misc'

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

const Program = ({ loading, initial, params }) => {
  const [countryOpts, setCountryOpts] = useState([])
  const [contributors, setContributors] = useState([])
  const [periods, setPeriods] = useState([])
  const [partners, setPartners] = useState([])
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
  const [search, setSearch] = useState(null)
  const [results, setResults] = useState(null)
  const { data: apiData, error: apiError } = useSWR(`/program/${params.projectId}/results/?format=json`, url => api.get(url).then(res => res.data))
  const { results: dataResults, targetsAt, id: dataId } = apiData || {}
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
    const fields = { countries, partners, contributors, periods: itemPeriods }
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
  const { allFilters } = getStatusFiltering(filtering)
  const resultItems = handleOnFiltering(results, filtering, search)
  const totalItems = sum(allFilters.map((v) => v.items.length))
  const totalMatches = handleOnCountFiltering(resultItems, filtering, search)

  useEffect(() => {
    if (initial && !countryOpts.length && !contributors.length && !partners.length && !periods.length) {
      const opts = []
      initial.forEach(result => {
        result.countries.forEach(opt => { if (opts.indexOf(opt) === -1) opts.push(opt) })
      })
      setCountryOpts(opts)
      setContributors(handleOnUnique(initial, 'contributors'))
      setPartners(handleOnUnique(initial, 'partners'))
      const pds = uniq(initial
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

    const originContributorsLength = dataResults
      ?.flatMap((r) => r?.indicators)
      ?.flatMap((i) => i?.periods)
      ?.flatMap((p) => p?.contributors)
      ?.length
    const currentContribtorsLength = results
      ?.flatMap((r) => r?.indicators)
      ?.flatMap((i) => i?.periods)
      ?.flatMap((p) => p?.contributors)
      ?.length

    if ((dataResults && !results) || (results && (totalItems === 0 && (originContributorsLength !== currentContribtorsLength)))) {
      setResults(dataResults)
    }
  }, [initial, results, dataResults, countryOpts, contributors, periods, partners, filtering])
  return (
    <>
      <div id="program-filter-bar">
        <Filter className="ui container">
          <Filter.Input
            placeholder="Search title"
            visible={toggle}
            loading={loading}
            count={totalItems}
            onPopOver={() => setToggle(!toggle)}
            value={search}
            onChange={e => setSearch(e.target.value)}
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
                      data={itemPeriods}
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
      </div>
      <div className="ui container">
        <div className="program-view">
          {(apiError || (results && !results.length)) && <Redirect to={`/programs/${params.projectId}/editor`} />}
          {(!initial && loading) && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
          {(initial && !results) && <InitialView results={initial} filtering={filtering} search={search} />}
          {(initial && results) && <ProgramView {...{ results, dataId, filtering, resultItems, search, targetsAt, setResults }} />}
        </div>
      </div>
    </>
  )
}

export default Program
