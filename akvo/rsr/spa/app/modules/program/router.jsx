/* global document */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import classNames from 'classnames'
import { Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles.scss'

import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import * as actions from '../editor/actions'
import Approvals from '../approvals/approvals'
import Overview from './overview'

const { TabPane } = Tabs

const Router = ({ match: { params }, userRdr, ...props }) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [results, setResults] = useState([])
  const [periods, setPeriods] = useState({})
  useEffect(() => {
    if (params.projectId !== 'new') {
      // setRF(null)
      api.get(`/title-and-status/${params.projectId}`)
        .then(({ data: { title } }) => {
          setTitle(title)
          props.setProjectTitle(title)
          document.title = `${title} | Akvo RSR`
        })
    }
  }, [params.projectId])
  const canEdit = userRdr.programs && userRdr.programs.find(it => it.id === params.projectId && it.canEditProgram) !== -1
  let _title = props.title
  if (!_title && title) _title = title
  else if (!_title) _title = t('Untitled program')
  return (
    <div className="program-view">
      <Route path="/programs/:id/:view?" render={({ match }) => {
        const view = match.params.view ? match.params.view : ''
        return [
          <header className={classNames('main-header', { editor: match.params.view === 'editor' })}>
            <h1>{_title}</h1>
          </header>,
          <Tabs size="large" activeKey={view}>
            <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />
            <TabPane tab={<Link to={`/programs/${params.projectId}/approvals`}>Approvals</Link>} key="approvals" />
            <TabPane disabled={!canEdit} tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" />
            <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
            <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
          </Tabs>
        ]
      }} />
      {/* {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>} */}
      <Route path="/programs/:projectId" exact render={(_props) => <Overview {...{..._props, results, setResults}} />} />
      <Route path="/programs/:programId/hierarchy/:projectId?" render={(_props) =>
        <Hierarchy {..._props} canEdit={canEdit} program />
      } />
      <Route path="/programs/:projectId/reports" render={() =>
        <Reports programId={params.projectId} />
      } />
      <Route path="/programs/:id/editor" render={({ match: { params } }) =>
        <Editor {...{ params }} program />
      } />
      <Route path="/programs/:id/approvals" render={({ match: { params } }) => <Approvals {...{ params, periods, setPeriods }} />} />
      {/* <div id="chartjs-tooltip" /> */}
      <div id="bar-tooltip" />
      <div id="disagg-bar-tooltip" />
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { title } } }, userRdr }) => ({ title, userRdr }), actions
)(Router)
