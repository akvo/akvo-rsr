/* global window, document */
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
import StickyClass from './sticky-class'
import { setProjectTitle } from '../editor/actions'
import * as programmeActions from './store/actions'

const { Panel } = Collapse
const { TabPane } = Tabs
const { Option } = Select

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({
  match: { params },
  userRdr,
  editable,
  programmeRdr: results,
  ...props
}) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [countryOpts, setCountryOpts] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [targetsAt, setTargetsAt] = useState(null)
  const initiate = () => {
    setLoading(true)
    if (params.projectId !== 'new') {
      api.get(`/project/${params.projectId}/results`)
        .then(({ data }) => {
          const _results = data.results.map(it => ({ ...it, indicators: [], fetched: false }))
          props.setProgrammeResults(_results)
          setTitle(data.title)
          props.setProjectTitle(data.title)
          document.title = `${data.title} | Akvo RSR`
          setLoading(false)
          setTargetsAt(data.targetsAt)
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
  useEffect(initiate, [params.projectId])
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
  const canEdit = (editable || (userRdr.programs && userRdr.programs.find(program => program.id === parseInt(params.projectId, 10))?.canEditProgram))
  const _title = (!props?.title && title) ? title : props?.title ? props.title : t('Untitled program')
  return (
    <div className="program-view">
      <Route path="/programs/:id/:view?" render={({ match }) => {
        const view = match.params.view ? match.params.view : ''
        return [
          <header className={classNames('main-header', { editor: match.params.view === 'editor' })}>
            <h1>{!loading && _title}</h1>
          </header>,
          <Tabs size="large" activeKey={view}>
            {(results.length > 0 || !match.params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />}
            {canEdit && <TabPane tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" /> }
            <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
            <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
          </Tabs>
        ]
      }}
      />
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Route path="/programs/:projectId" exact render={() => {
        if(!loading && results.length > 0) { return [
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
                <Result programId={params.projectId} {...{ ...result, countryFilter, targetsAt }} />
              </Panel>
            )}
          </Collapse>
          ]
        }
        if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
        return null
      }}
      />
      <Route path="/programs/:programId/hierarchy/:projectId?" render={(_props) =>
        <Hierarchy {..._props} canEdit={canEdit} program />
      }
      />
      <Route path="/programs/:projectId/reports" render={() =>
        <Reports programId={params.projectId} />
      }
      />
      <Route path="/programs/:id/editor" render={({ match: {params: args}}) =>
        <Editor {...{ params: args }} program />
      }
      />
      <div id="bar-tooltip" />
      <div id="disagg-bar-tooltip" />
    </div>
  )
}

export default connect(
    ({
         editorRdr: {
             section1: {
                 fields: {
                     title,
                     editable,
                 }
             }
         },
         userRdr,
         programmeRdr
     }) => ({
        title,
        editable,
        userRdr,
        programmeRdr
    }), ({...programmeActions, setProjectTitle})
)(Program)
