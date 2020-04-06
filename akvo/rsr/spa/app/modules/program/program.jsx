/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import classNames from 'classnames'
import { Route, Link, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import Result from './result'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'

const { Panel } = Collapse
const { TabPane } = Tabs

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
  useEffect(() => {
    if (params.projectId !== 'new'){
      api.get(`/project/${params.projectId}/results`)
      .then(({data}) => {
        setResults(data.results)
        setTitle(data.title)
        setLoading(false)
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
              <TabPane tab="Reports" disabled key="3" />
            </Tabs>
          </header>
        )
      }} />
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Route path="/programs/:projectId" exact render={() => {
        if(!loading && results.length > 0) { return (
          <Collapse defaultActiveKey="0" onChange={handleResultChange} accordion bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
            {results.map((result, index) =>
              <Panel key={index} header={<div><h1>{result.title}</h1><div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div></div>}>
                <Result programId={params.projectId} id={result.id} />
              </Panel>
            )}
          </Collapse>
        )
        }
        if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
        return null
      }} />
      <Route path="/programs/:programId/hierarchy/:projectId?" render={(_props) =>
        <Hierarchy {..._props} program />
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
