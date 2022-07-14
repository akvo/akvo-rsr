/* global document */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Link, useRouteMatch, useLocation } from 'react-router-dom'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import useSWR from 'swr'

import './styles.scss'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import Reports from '../reports/reports'
import * as actions from '../editor/actions'
import api from '../../utils/api'
import Program from './Program'

const { TabPane } = Tabs

const ProgramOverview = ({ userRdr }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const { path, url, params: rootParams } = useRouteMatch()
  const location = useLocation()
  const currentView = location?.pathname?.split('/')

  const { data: apiData, error: apiError } = useSWR(`/project/${rootParams.projectId}/results`, url => api.get(url).then(res => res.data))
  const { results, title } = apiData || {}
  const canEdit = userRdr.programs && userRdr.programs.find(program => program.id === parseInt(rootParams.projectId, 10))?.canEditProgram

  useEffect(() => {
    if (loading && (title || apiError)) {
      document.title = `${title} | Akvo RSR`
      setLoading(false)
    }
  }, [title, loading])

  return (
    <div className="program-view">
      <div className="ui container">
        <header className={classNames('main-header', { editor: rootParams.view === 'editor' })}>
          <h1>{title || t('Untitled program')}</h1>
        </header>
        <Tabs size="large" activeKey={currentView[3] || 'overview'}>
          {(results && results.length > 0) && <TabPane tab={<Link to={url}>Overview</Link>} key="overview" />}
          {canEdit && <TabPane tab={<Link to={`${url}/editor`}>Editor</Link>} key="editor" />}
          <TabPane tab={<Link to={`${url}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
          <TabPane tab={<Link to={`${url}/reports`}>Reports</Link>} key="reports" />
        </Tabs>
      </div>
      <Route
        exact
        path={path}
        render={() => (
          <Program
            initial={results}
            params={rootParams}
            loading={loading}
          />
        )}
      />
      <Route path={`${path}/hierarchy`} render={(_props) =>
        <div className="ui container mt-30">
          <Hierarchy {..._props} canEdit={canEdit} program />
        </div>
      }
      />
      <Route path={`${path}/reports`} render={() =>
        <div className="ui container mt-30">
          <Reports programId={rootParams.projectId} />
        </div>
      }
      />
      <Route path="/programs/:id/editor" render={({ match: { params } }) =>
        <div className="ui container">
          <Editor {...{ params }} program />
        </div>
      }
      />
      <div id="bar-tooltip" />
      <div id="disagg-bar-tooltip" />
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { title } } }, userRdr }) => ({ title, userRdr }), actions
)(ProgramOverview)
