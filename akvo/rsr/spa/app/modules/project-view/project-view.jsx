/* global document, window */
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import { Icon, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { diff } from 'deep-object-diff'
import { useLastLocation } from 'react-router-last-location'

import api from '../../utils/api'
import { flagOrgs, shouldShowFlag, isRSRTeamMember, isAnAdmin } from '../../utils/feat-flags'
import Editor from '../editor/editor'
import ResultsRouter from '../results/router'
import Enumerators from '../enumerators/enumerators'
import Reports from '../reports/reports'
import Updates from '../updates/updates'
import * as actions from '../editor/actions'
import Hierarchy from '../hierarchy/hierarchy'

const { TabPane } = Tabs
const ResultsTabPane = ({
  t,
  projectId,
  disableResults,
  labelResultView,
  isOldVersion
}) => disableResults
    ? t(labelResultView)
    : (
      <>
        {isOldVersion
          ? <a href={`/en/myrsr/my_project/${projectId}/`}>{t(labelResultView)}</a>
          : <Link to={`/projects/${projectId}/results`}>{t(labelResultView)}</Link>
        }
      </>
    )

const _Header = ({ title, project, publishingStatus, hasHierarchy, userRdr, showResultAdmin, jwtView, prevPathName, role, canEditProject, isRestricted, isOldVersion }) => {
  const { t } = useTranslation()
  const isAllowed = !(['user', 'enumerator'].includes(role))
  const showEnumerators = (
    isAllowed &&
    userRdr?.organisations &&
    (
      isAnAdmin(userRdr) ||
      isRSRTeamMember(userRdr) ||
      shouldShowFlag(userRdr.organisations, flagOrgs.ENUMERATORS)
    )
  )
  const disableResults = publishingStatus !== 'published'
  const labelResultView = showResultAdmin && isAllowed ? 'Results Overview' : 'Results'
  const projectId = project.id
  const pageTitle = title || project?.title || t('Untitled project')
  const params = new URLSearchParams(window.location.search)
  useEffect(() => {
    document.title = `${pageTitle} | Akvo RSR`
  }, [title])
  return [
    <header className="main-header" key="index-main">
      {!(params.get('rt')) && <Link to={prevPathName || '/'}><Icon type="left" /></Link>}
      <h1>{pageTitle}</h1>
    </header>,
    !jwtView &&
    <Route key="index-router" path="/projects/:id/:view?" render={({ match: { params: { view } } }) => {
      const activeKey = ['results', 'results-admin', 'enumerators', 'hierarchy', 'updates', 'reports', 'editor'].includes(view) ? view : 'editor'
      return (
        <Tabs size="large" defaultActiveKey="editor" activeKey={activeKey} className="project-tabs">
          {!(isRestricted) && (
            <TabPane
              disabled={disableResults}
              tab={<ResultsTabPane {...{ t, disableResults, labelResultView, projectId, userRdr, isOldVersion }} />}
              key="results"
            />
          )}
          {showResultAdmin && isAllowed &&
            <TabPane
              disabled={disableResults}
              tab={disableResults ? t('Results Admin') : <Link to={`/projects/${projectId}/results-admin`}>{t('Results Admin')}</Link>}
              key="results-admin"
            />
          }
          {showEnumerators &&
            <TabPane
              tab={!showEnumerators ? t('Enumerators') : [
                <Link to={`/projects/${projectId}/enumerators`}>{t('Enumerators')}</Link>
              ]}
              key="enumerators"
            />
          }
          {((role && isAllowed) || hasHierarchy) &&
            <TabPane
              tab={<Link to={`/projects/${projectId}/hierarchy`}>{t('hierarchy')}</Link>}
              key="hierarchy"
            />
          }
          <TabPane tab={<Link to={`/projects/${projectId}/updates`}>{t('Updates')}</Link>} key="updates" />
          <TabPane tab={<Link to={`/projects/${projectId}/reports`}>{t('Reports')}</Link>} key="reports" />
          {((role && isAllowed) || canEditProject) &&
            <TabPane
              tab={<Link to={`/projects/${projectId}/info`}>{t('Editor')}</Link>}
              key="editor"
            />
          }
        </Tabs>
      )
    }}
    />
  ]
}
const Header = connect(({
  editorRdr: { section1: { fields: { title, program, publishingStatus, hasHierarchy, canEditProject } } }
}) => ({ title, program, publishingStatus, hasHierarchy, canEditProject }))(
  React.memo(_Header, (prevProps, nextProps) => Object.keys(diff(prevProps, nextProps)).length === 0)
)

const ProjectView = ({ match: { params }, program, jwtView, userRdr, ..._props }) => {
  const [rf, setRF] = useReducer((state, newState) => {
    return newState !== null ? ({ ...state, ...newState }) : null
  }, null)
  const location = useLastLocation()
  const [prevPathName, setPrevPathName] = useState()
  const [role, setRole] = useState(null)
  const [targetsAt, setTargetsAt] = useState(null)
  useEffect(() => {
    if (params.id !== 'new') {
      setRF(null)
      api.get(`/title-and-status/${params.id}`)
        .then(({ data: { title, publishingStatus, hasHierarchy, needsReportingTimeoutDays, view: userRole, targetsAt: dataTargetsAt, canEditProject } }) => {
          setRole(userRole)
          setTargetsAt(dataTargetsAt)
          _props.setProjectTitle(title)
          _props.setProjectStatus(publishingStatus, hasHierarchy, needsReportingTimeoutDays, false, canEditProject)
          _props.setUser({ ...userRdr, userRole })
        })
    }
    if (location != null) setPrevPathName(location.pathname)
  }, [params.id])
  const urlPrefix = program ? '/programs/:id/editor' : '/projects/:id'
  const project = { id: params.id, title: rf?.title, primaryOrganisation: rf?.primaryOrganisation }
  const showResultAdmin = true
  const resultsProps = { rf, setRF, jwtView, targetsAt, showResultAdmin, role }
  const isRestricted = (role === 'user')
  const isOldVersion = false

  return [
    !program && <Header key="index-header" {...{ userRdr, showResultAdmin, jwtView, prevPathName, role, project, isRestricted, isOldVersion }} />,
    <Switch key="index-switch">
      <Route
        path={`${urlPrefix}/results`}
        render={props => {
          if (userRdr?.organisations && isOldVersion && !program) {
            window.location.href = `/en/myrsr/my_project/${params.id}/`
            return null
          }
          if (isRestricted) {
            return <Redirect to={`/projects/${params.id}/updates`} />
          }
          return <ResultsRouter {...{ ...props, ...resultsProps }} />
        }}
      />
      <Route path={`${urlPrefix}/results-admin`} render={props => <ResultsRouter {...{ ...props, ...resultsProps }} />} />
      <Route path={`${urlPrefix}/enumerators`} render={props => <Enumerators {...{ ...props, rf, setRF }} />} />
      <Route path={`${urlPrefix}/hierarchy`} render={props => <Hierarchy match={{ params: { projectId: props.match.params.id } }} asProjectTab />} />
      <Route path={`${urlPrefix}/reports`} render={() => <Reports projectId={params.id} />} />
      <Route path={`${urlPrefix}/updates`} render={() => <Updates projectId={params.id} />} />
      <Route>
        <Editor {...{ params, program }} />
      </Route>
    </Switch>
  ]
}

const mapStatesToProps = state => {
  return {
    userRdr: state.userRdr
  }
}

export default React.memo(connect(mapStatesToProps, actions)(ProjectView), (prevProps, nextProps) => {
  const _diff = diff(prevProps, nextProps)
  return Object.keys(_diff).length === 0
})
