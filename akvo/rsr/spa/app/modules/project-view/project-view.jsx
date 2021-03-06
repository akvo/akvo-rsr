/* global document, window */
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Switch, withRouter } from 'react-router-dom'
import { Icon, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { diff } from 'deep-object-diff'
import { useLastLocation } from 'react-router-last-location'

import api from '../../utils/api'
import sections from '../editor/sections'
import { flagOrgs, shouldShowFlag, isRSRTeamMember } from '../../utils/feat-flags'
import Editor from '../editor/editor'
import ResultsRouter from '../results/router'
import Enumerators from '../enumerators/enumerators'
import Reports from '../reports/reports'
import Updates from '../updates/updates'
import * as actions from '../editor/actions'
import Hierarchy from '../hierarchy/hierarchy'

const { TabPane } = Tabs

const _Header = ({ title, projectId, publishingStatus, hasHierarchy, userRdr, jwtView, prevPathName }) => {
  useEffect(() => {
    document.title = `${title} | Akvo RSR`
  }, [title])
  const { t } = useTranslation()
  const showEnumerators = isRSRTeamMember(userRdr) || shouldShowFlag(userRdr.organisations, flagOrgs.ENUMERATORS)
  const disableResults = publishingStatus !== 'published'

  return [
    <header className="main-header">
      {(!jwtView && prevPathName != null) && <Link to={prevPathName}><Icon type="left" /></Link>}
      <h1>{title ? title : t('Untitled project')}</h1>
    </header>,
    !jwtView &&
    <Route path="/projects/:id/:view?" render={({ match: { params: { view } } }) => {
      const _view = sections.findIndex(it => it.key === view) !== -1 ? 'editor' : view
      return (
        <Tabs size="large" activeKey={_view} className="project-tabs">
          <TabPane
            disabled={disableResults}
            tab={disableResults ? t('Results') : <Link to={`/projects/${projectId}/results`}>{t('Results')}</Link>}
            key="results"
          />
          {showEnumerators &&
          <TabPane
            tab={!showEnumerators ? t('Enumerators') : [
              <Link to={`/projects/${projectId}/enumerators`}>{t('Enumerators')}</Link>
            ]}
            key="enumerators"
          />
          }
          <TabPane
            disabled={hasHierarchy !== true}
            tab={hasHierarchy !== true ? t('Hierarchy') : [
              <Link to={`/projects/${projectId}/hierarchy`}>{t('hierarchy')}</Link>
            ]}
            key="hierarchy"
          />
          <TabPane tab={<Link to={`/projects/${projectId}/updates`}>{t('Updates')}</Link>} key="updates" />
          <TabPane tab={<Link to={`/projects/${projectId}/reports`}>{t('Reports')}</Link>} key="reports" />
          <TabPane tab={<Link to={`/projects/${projectId}/info`}>{t('Editor')}</Link>} key="editor" />
        </Tabs>
      )
    }}
    />
  ]
}
const Header = connect(({
  editorRdr: { section1: { fields: { title, program, publishingStatus, hasHierarchy } } },
  userRdr
}) => ({ title, program, userRdr, publishingStatus, hasHierarchy }))(
  React.memo(_Header, (prevProps, nextProps) => Object.keys(diff(prevProps, nextProps)).length === 0)
)

const ProjectView = ({ match: { params }, program, jwtView, ..._props }) => {
  const [rf, setRF] = useReducer((state, newState) => ({ ...state, ...newState }), null)
  const location = useLastLocation()
  const [prevPathName, setPrevPathName] = useState()
  useEffect(() => {
    if (params.id !== 'new') {
      api.get(`/title-and-status/${params.id}`)
        .then(({ data: { title, publishingStatus, hasHierarchy } }) => {
          _props.setProjectTitle(title)
          _props.setProjectStatus(publishingStatus, hasHierarchy)
        })
    }
    if (location != null) setPrevPathName(location.pathname)
  }, [])
  const urlPrefix = program ? '/programs/:id/editor' : '/projects/:id'

  return [
    !program && <Header projectId={params.id} {...{ jwtView, prevPathName }} />,
    <Switch>
      <Route path={`${urlPrefix}/results`} render={props => <ResultsRouter {...{ ...props, rf, setRF, jwtView }} />} />
      <Route path={`${urlPrefix}/enumerators`} render={props => <Enumerators {...{ ...props, rf, setRF }} />} />
      <Route path={`${urlPrefix}/hierarchy`} render={props => <Hierarchy match={{ params: { projectId: props.match.params.id }}} asProjectTab />} />
      <Route path={`${urlPrefix}/reports`} render={() => <Reports projectId={params.id} />} />
      <Route path={`${urlPrefix}/updates`} render={() => <Updates projectId={params.id} />} />
      <Route>
        <Editor {...{params, program}} />
      </Route>
    </Switch>
  ]
}

export default React.memo(connect(null, actions)(ProjectView), (prevProps, nextProps) => {
  const _diff = diff(prevProps, nextProps)
  return Object.keys(_diff).length === 0
})
