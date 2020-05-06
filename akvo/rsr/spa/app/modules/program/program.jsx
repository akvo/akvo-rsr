/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Spin, Tabs, Select } from 'antd'
import classNames from 'classnames'
import { Route, Link, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import Result from './result'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import countriesDict from '../../utils/countries-dict'

const { Panel } = Collapse
const { TabPane } = Tabs
const { Option } = Select

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({ match: {params}, ...props }) => {
  const { t } = useTranslation()
  const [results, setResults] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [countryOpts, setCountryOpts] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  useEffect(() => {
    if (params.projectId !== 'new'){
      api.get(`/project/${params.projectId}/results`)
      .then(({data}) => {
        setResults(data.results)
        setTitle(data.title)
        setLoading(false)
        // collect country opts
        const opts = []
        data.results.forEach(result => {
          result.countries.forEach(opt => { if(opts.indexOf(opt) === -1) opts.push(opt) })
        })
        setCountryOpts(opts)
      })
    } else {
      setLoading(false)
    }
  }, [])
  const handleResultChange = (index) => {
    if(index != null){
      window.scroll({ top: 142 + index * 88, behavior: 'smooth'})
    }
  }
  const handleCountryFilter = (value) => {
    setCountryFilter(value)
  }
  const filterCountry = (filterValue) => (item) => {
    if(filterValue.length === 0) return true
    let index = 0
    let found = false
    while(filterValue.length > index){
      if(item.countries.indexOf(filterValue[index]) !== -1) {
        found = true; break
      }
      index += 1
    }
    return found
  }
  let _title = props.title
  if(!_title && title) _title = title
  else if(!_title) _title = t('Untitled program')
  return (
    <div className="program-view">
      <Route path="/programs/:id/:view?" render={({ match }) => {
        const view = match.params.view ? match.params.view : ''
        return (
          <header className={classNames('main-header', { editor: match.params.view === 'editor' })}>
            <h1>{!loading && _title}</h1>
            <Tabs size="large" activeKey={view}>
              {(results.length > 0 || !match.params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />}
              <TabPane tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" />
              <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
              <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
            </Tabs>
          </header>
        )
      }} />
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Route path="/programs/:projectId" exact render={() => {
        if(!loading && results.length > 0) { return [
          <Select allowClear value={countryFilter} onChange={handleCountryFilter} mode="multiple" placeholder="All countries" className="country-filter" dropdownMatchSelectWidth={false}>
            {countryOpts.map(opt => <Option value={opt}>{countriesDict[opt]}</Option>)}
          </Select>,
          <Collapse defaultActiveKey="0" onChange={handleResultChange} accordion bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
            {results.filter(filterCountry(countryFilter)).map((result, index) =>
              <Panel key={index} header={<div><h1>{result.title}</h1><div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div></div>}>
                <Result programId={params.projectId} id={result.id} {...{ countryFilter }} />
              </Panel>
            )}
          </Collapse>
          ]
        }
        if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
        return null
      }} />
      <Route path="/programs/:programId/hierarchy/:projectId?" render={(_props) =>
        <Hierarchy {..._props} program />
      } />
      <Route path="/programs/:projectId/reports" render={() =>
        <Reports programId={params.projectId} />
      } />
      <Route path="/programs/:id/editor" render={(_params) =>
        <Editor {..._params} program />
      } />
      {/* <div id="chartjs-tooltip" /> */}
      <div id="bar-tooltip" />
      <div id="disagg-bar-tooltip" />
    </div>
  )
}

export default connect(
  ({ editorRdr: {section1: {fields: {title}}} }) => ({ title })
)(Program)
