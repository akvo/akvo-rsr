/* global document */
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import { Icon, Skeleton, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { diff } from 'deep-object-diff'
import { useLastLocation } from 'react-router-last-location'

import api from '../../utils/api'
import { flagOrgs, shouldShowFlag, isRSRTeamMember } from '../../utils/feat-flags'
import Editor from '../editor/editor'
import ResultsRouter from '../results/router'
import Enumerators from '../enumerators/enumerators'
import Reports from '../reports/reports'
import Updates from '../updates/updates'
import * as actions from '../editor/actions'
import Hierarchy from '../hierarchy/hierarchy'
import { getSubdomainName } from '../../utils/misc'

const { TabPane } = Tabs
const ResultsTabPane = ({ t, disableResults, labelResultView, projectId, userRdr }) => {
  return disableResults
    ? t(labelResultView)
    : (
      <>
        {userRdr?.organisations && shouldShowFlag(userRdr.organisations, flagOrgs.NUFFIC) && getSubdomainName() !== 'rsr4'
          ? <a href={`/en/myrsr/my_project/${projectId}/`}>{t(labelResultView)}</a>
          : <Link to={`/projects/${projectId}/results`}>{t(labelResultView)}</Link>
        }
      </>
    )
}

const _Header = ({ title, project, publishingStatus, hasHierarchy, userRdr, showResultAdmin, jwtView, prevPathName, role, canEditProject, isRestricted }) => {
  const { t } = useTranslation()
  const showEnumerators = role !== 'enumerator' && (isRSRTeamMember(userRdr) || (userRdr?.organisations && shouldShowFlag(userRdr.organisations, flagOrgs.ENUMERATORS)))
  const disableResults = publishingStatus !== 'published'
  const labelResultView = showResultAdmin && role !== 'enumerator' ? 'Results Overview' : 'Results'
  const projectId = project.id
  const pageTitle = title || project?.title || t('Untitled project')
  useEffect(() => {
    document.title = `${pageTitle} | Akvo RSR`
  }, [title])
  let showResults = true
  if ((userRdr?.approvedEmployments !== undefined) && isRestricted) {
    showResults = false
  }
  return [
    <header className="main-header" key="index-main">
      {(!jwtView && prevPathName != null) && <Link to={prevPathName}><Icon type="left" /></Link>}
      <h1>{pageTitle}</h1>
    </header>,
    !jwtView &&
    <Route key="index-router" path="/projects/:id/:view?" render={({ match: { params: { view } } }) => {
      const activeKey = ['results', 'results-admin', 'enumerators', 'hierarchy', 'updates', 'reports', 'editor'].includes(view) ? view : 'editor'
      return (
        <Tabs size="large" defaultActiveKey="editor" activeKey={activeKey} className="project-tabs">
          {showResults && (
            <TabPane
              disabled={disableResults}
              tab={<ResultsTabPane {...{ t, disableResults, labelResultView, projectId, userRdr }} />}
              key="results"
            />
          )}
          {showResultAdmin && role !== 'enumerator' &&
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
          {((role && role !== 'enumerator') || hasHierarchy) &&
            <TabPane
              tab={<Link to={`/projects/${projectId}/hierarchy`}>{t('hierarchy')}</Link>}
              key="hierarchy"
            />
          }
          <TabPane tab={<Link to={`/projects/${projectId}/updates`}>{t('Updates')}</Link>} key="updates" />
          <TabPane tab={<Link to={`/projects/${projectId}/reports`}>{t('Reports')}</Link>} key="reports" />
          {((role && role !== 'enumerator') || canEditProject) &&
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
        })
    }
    if (location != null) setPrevPathName(location.pathname)
  }, [params.id])
  const urlPrefix = program ? '/programs/:id/editor' : '/projects/:id'
  const project = { id: params.id, title: rf?.title }
  const showResultAdmin = (!userRdr?.organisations || shouldShowFlag(userRdr?.organisations, flagOrgs.NUFFIC) || (getSubdomainName() === 'rsr4')) ? false : true
  const resultsProps = { rf, setRF, jwtView, targetsAt, showResultAdmin, role }
  const isRestricted = (
    (rf?.useProjectRoles !== undefined && userRdr?.approvedEmployments !== undefined) &&
    (
      rf.useProjectRoles === false &&
      userRdr.approvedEmployments
        .filter((e) => rf.partners.includes(e.organisation))
        .filter((e) => ['Users', 'User Managers'].includes(e.groupName))
        .length
    )
  )
  return [
    !program && <Header key="index-header" {...{ userRdr, showResultAdmin, jwtView, prevPathName, role, project, isRestricted }} />,
    <Switch key="index-switch">
      <Route path={`${urlPrefix}/results`} render={props => {
        if (isRestricted) {
          return <Redirect to={`/projects/${params.id}/updates`} />
        }
        return <ResultsRouter {...{ ...props, ...resultsProps }} />
      }} />
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
