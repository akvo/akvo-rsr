/* global window */
import React, { useState, useEffect } from 'react'
import { Collapse, Icon, Select, Spin } from 'antd'
import classNames from 'classnames'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import countriesDict from '../../utils/countries-dict'
import StickyClass from './sticky-class'
import Result from './result'
import api from '../../utils/api'

const { Panel } = Collapse
const { Option } = Select

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Overview = ({ match: {params}, results, setResults }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [countryOpts, setCountryOpts] = useState([])
  const [countryFilter, setCountryFilter] = useState([])

  const handleCountryFilter = (value) => {
    setCountryFilter(value)
  }
  const filterCountry = (filterValue) => (item) => {
    if (filterValue.length === 0) return true
    let index = 0
    let found = false
    while (filterValue.length > index) {
      if (item.countries.indexOf(filterValue[index]) !== -1) {
        found = true; break
      }
      index += 1
    }
    return found
  }
  const initiate = () => {
    setLoading(true)
    if (params.projectId !== 'new' && results.length === 0) {
      api.get(`/project/${params.projectId}/results`)
        .then(({ data }) => {
          setResults(data.results.map(it => ({ ...it, indicators: [] })))
          setLoading(false)
          // collect country opts
          const opts = []
          data.results.forEach(result => {
            result.countries.forEach(opt => { if (opts.indexOf(opt) === -1) opts.push(opt) })
          })
          setCountryOpts(opts)
        })
    } else {
      setLoading(false)
    }
  }
  const handleResultChange = (index) => {
    if (index != null) {
      window.scroll({ top: 142 + index * 88, behavior: 'smooth' })
    }
  }
  useEffect(initiate, [params.projectId])
  if (!loading && results.length > 0) {
    return [
      <Select allowClear optionFilterProp="children" value={countryFilter} onChange={handleCountryFilter} mode="multiple" placeholder="All countries" className="country-filter" dropdownMatchSelectWidth={false}>
        {countryOpts.map(opt => <Option value={opt}>{countriesDict[opt]}</Option>)}
      </Select>,
      <Collapse defaultActiveKey="0" destroyInactivePanel onChange={handleResultChange} accordion bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {results.filter(filterCountry(countryFilter)).map((result, index) =>
          <Panel
            key={index}
            header={(
              <StickyClass offset={20}>
                <h1>{result.title}</h1>
                <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div>
              </StickyClass>
            )}
          >
            <Result programId={params.projectId} id={result.id} {...{ countryFilter, results, setResults }} />
          </Panel>
        )}
      </Collapse>
    ]
  }
  if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
  return <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>
}

export default Overview
