/* global document */
import React, { useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Switch } from 'react-router-dom'
import { Icon, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { diff } from 'deep-object-diff'

import api from '../../utils/api'
import sections from '../editor/sections'
import { flagOrgs, shouldShowFlag, isRSRTeamMember } from '../../utils/feat-flags'
import Editor from '../editor/editor'
import ResultsRouter from '../results/router'
import Enumerators from '../enumerators/enumerators'
import Reports from '../reports/reports'
import Updates from '../updates/updates'
import * as actions from '../editor/actions'

const { TabPane } = Tabs

const _Header = ({ title, projectId, publishingStatus, hasParent, program, userRdr, jwtView }) => {
  useEffect(() => {
    document.title = `${title} | Akvo RSR`
  }, [title])
  const { t } = useTranslation()
  const showNewResults = shouldShowFlag(userRdr.organisations, flagOrgs.RESULTS)
  const showEnumerators = isRSRTeamMember(userRdr)
  const disableResults = publishingStatus !== 'published'

  return [
    <header className="main-header">
      {!jwtView && <Link to="/projects"><Icon type="left" /></Link>}
      <h1>{title ? title : t('Untitled project')}</h1>
    </header>,
    !jwtView &&
    <Route path="/projects/:id/:view?" render={({ match: { params: { view } } }) => {
      const _view = sections.findIndex(it => it.key === view) !== -1 ? 'editor' : view
      return (
        <Tabs size="large" activeKey={_view}>
          <TabPane
            disabled={disableResults}
            tab={disableResults ? t('Results') : (showNewResults ? <Link to={`/projects/${projectId}/results`}>{t('Results')}</Link> : <a href={`/${userRdr.lang}/myrsr/my_project/${projectId}/`}>{t('Results')}</a>)}
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
            disabled={hasParent !== true}
            tab={hasParent !== true ? t('Hierarchy') : [
              <Link to={!program ? `/projects/${projectId}/hierarchy` : `/programs/${program.id}/hierarchy/${projectId}`}>{t('hierarchy')}</Link>
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
  editorRdr: { section1: { fields: { title, program, publishingStatus, hasParent } } },
  userRdr
}) => ({ title, program, userRdr, publishingStatus, hasParent }))(
  React.memo(_Header, (prevProps, nextProps) => Object.keys(diff(prevProps, nextProps)).length === 0)
)

const ProjectView = ({ match: { params }, program, jwtView, ..._props }) => {
  const [rf, setRF] = useReducer((state, newState) => ({ ...state, ...newState }), null)
  useEffect(() => {
    if (params.id !== 'new') {
      api.get(`/title-and-status/${params.id}`)
        .then(({ data: { title, publishingStatus, hasParent } }) => {
          _props.setProjectTitle(title)
          _props.setProjectStatus(publishingStatus, hasParent)
        })
    }
  }, [])
  const urlPrefix = program ? '/programs/:id/editor' : '/projects/:id'

  return [
    !program && <Header projectId={params.id} {...{ jwtView }} />,
    <Switch>
      <Route path={`${urlPrefix}/results`} render={props => <ResultsRouter {...{ ...props, rf, setRF, jwtView }} />} />
      <Route path={`${urlPrefix}/enumerators`} render={props => <Enumerators {...{ ...props, rf, setRF }} />} />
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
