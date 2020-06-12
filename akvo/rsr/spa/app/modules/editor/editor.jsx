/* global window, document */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {Route, Link, Redirect, Switch} from 'react-router-dom'
import { Icon, Button, Spin, Tabs, Tooltip, Skeleton, Dropdown, Menu } from 'antd'
import TimeAgo from 'react-time-ago'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import momentTz from 'moment-timezone' // eslint-disable-line
import { diff } from 'deep-object-diff'

import sections from './sections'
import MainMenu from './main-menu'
import Settings from './settings/settings'
import * as actions from './actions'
import './styles.scss'
import ProjectInitHandler from './project-init-handler'
import ValidationBar from './validation-bar'
import { validationType } from '../../utils/validation-utils'
import CustomFields from './custom-fields'
import api from '../../utils/api'
import Reports from '../reports/reports'

const { TabPane } = Tabs

class _Section extends React.Component{
  componentDidMount(){
    setTimeout(() => this.props.touchSection(this.props.sectionIndex), 100)
  }
  shouldComponentUpdate(nextProps){
    if(this.props.params.id === 'new') return false
    const sectionKey = `section${this.props.sectionIndex}`
    return (nextProps.editorRdr[sectionKey].isFetched !== this.props.editorRdr[sectionKey].isFetched || nextProps.editorRdr[sectionKey].isExplicitlyEnabled !== this.props.editorRdr[sectionKey].isExplicitlyEnabled)
  }
  render(){
    const sectionKey = `section${this.props.sectionIndex}`
    if (this.props.editorRdr[sectionKey].isFetched === false && this.props.editorRdr[sectionKey].isExplicitlyEnabled === false){
      return <div className="view"><Skeleton active paragraph={{ rows: 7 }} /></div>
    }
    setTimeout(() => {
      window.scroll({ top: 0, behavior: 'smooth' })
    }, 100)
    return this.props.children
  }
}
const Section = connect(({ editorRdr }) => ({ editorRdr }), actions)(_Section)

const LastUpdateTime = ({ date }) => {
  const { t } = useTranslation()
  const now = new Date()
  const minutesAgo = (now.getTime() - date.getTime()) / (1000 * 60)
  const time = minutesAgo < 70
    ? <TimeAgo date={date} formatter={{ unit: 'minute' }} />
    : (
    <span>{moment(date).calendar(null, {
      sameDay: '[at] h:mma',
      lastDay: '[yesterday at] h:mma',
      lastWeek: '[last] dddd',
      sameElse: `[on] D MMM${now.getFullYear() !== date.getFullYear() ? ' YYYY' : ''}`
    })}
    </span>)
  return (
    <span>{t('Updated')} {time}</span>
  )
}

const SavingStatus = connect(
  ({ editorRdr: { saving, lastSaved, backendError, section1: { fields: { lastModifiedAt, lastModifiedBy } } } }) => ({ saving, lastSaved, backendError, lastModifiedAt, lastModifiedBy })
)(({ saving, lastSaved, backendError, lastModifiedAt, lastModifiedBy }) => {
  const { t } = useTranslation()
  // normalize Europe/Helsinki time
  const lastModifiedNormalized = new Date(moment.tz(lastModifiedAt, 'Europe/Stockholm').format())
  return (
    <aside className="saving-status">
      {(lastSaved === null && !saving && lastModifiedAt && backendError === null) && (
        <div className="last-updated">
          <LastUpdateTime date={lastModifiedNormalized} /> {t('by')} <Tooltip title={lastModifiedBy}>{lastModifiedBy}</Tooltip>
        </div>
      )}
      {saving && (
        <div>
          <Spin />
          <span>{t('Saving...')}</span>
        </div>
      )}
      {(!saving && lastSaved !== null && backendError === null) && (
        <div>
          <Icon type="check" />
          <LastUpdateTime date={lastSaved} />
        </div>
      )}
      {(!saving && backendError !== null) && (
        <div className="error">
          <Tooltip
            title={
              <span>
                {backendError.message && <span>{backendError.message}<br /></span>}
                {backendError.response && Array.isArray(backendError.response) && Object.keys(backendError.response).map(key => <span>{key}: {backendError.response[key]}<br /></span>)}
                {backendError.response && typeof backendError.response === 'string' && <span>{backendError.response}<br /></span>}
              </span>
            }>
            <Icon type="warning" /><span>{t('Something went wrong')}</span>
          </Tooltip>
        </div>
      )}
    </aside>
  )
})

const Aux = node => node.children

const ContentBar = connect(
  ({ editorRdr }) => {
    const ret = {}
    ret.absoluteUrl = editorRdr.section1.fields.absoluteUrl
    ret.publishingStatus = editorRdr.section1.fields.publishingStatus
    ret.canPublish = editorRdr.section1.fields.canPublish
    ret.allValid = true
    let sectionLength = 10
    if (!(editorRdr.validations.indexOf(validationType.IATI) === -1 && editorRdr.validations.indexOf(validationType.DFID) === -1)){
      sectionLength = 11
    }
    for(let i = 1; i <= sectionLength; i += 1){
      if (editorRdr[`section${i}`].errors.filter(it => it.type === 'required' || it.type === 'min').length > 0) ret.allValid = false
    }
    return ret
  },
  actions
)(({ publishingStatus, allValid, setStatus, absoluteUrl, canPublish, program }) => {
  const { t } = useTranslation()
  if(program) return null
  return (
    <div className="content">
      {publishingStatus !== 'published' && (
        <Aux>
          <div>
            <Button type="primary" disabled={!allValid && canPublish} onClick={() => setStatus('published')}>{t('Publish')}</Button>
            <Button className="preview-btn" href={absoluteUrl} target="_blank">{t('Preview')}</Button>
          </div>
          <i>{t('The project is unpublished')}</i>
        </Aux>
      )}
      {publishingStatus === 'published' && (
        <Aux>
          <Dropdown.Button
            onClick={() => window.open(absoluteUrl)}
            trigger="click"
            overlay={
              <Menu>
                <Menu.Item onClick={() => setStatus('unpublished')}><Icon type="stop" />{t('Unpublish')}</Menu.Item>
              </Menu>
            }
          >
            {t('View Project Page')}
          </Dropdown.Button>
          <i>{t('The project is published')}</i>
        </Aux>
      )}
      <ValidationBar />
    </div>
  )
})

const _Header = ({ title, publishingStatus, lang, relatedProjects, program }) => {
  useEffect(() => {
    document.title = `${title} | Akvo RSR`
  }, [title])
  const { t } = useTranslation()
  const parent = relatedProjects && relatedProjects[0]
  return (
    <header className="main-header">
      <Link to="/projects"><Icon type="left" /></Link>
      <h1>{title ? title : t('Untitled project')}</h1>
      <Route path="/projects/:id/:view?" render={({ match: { params: { view, id } } }) => {
        const _view = sections.findIndex(it => it.key === view) !== -1 ? 'editor' : view
        return (
          <Tabs size="large" activeKey={_view}>
            {(publishingStatus !== 'published') && <TabPane disabled tab={t('Results')} key="1" />}
            {(publishingStatus === 'published') && <TabPane tab={<a href={`/${lang}/myrsr/my_project/${id}/`}>{t('Results')}</a>} key="1" />}
            {parent && <TabPane tab={<Link to={!program ? `/hierarchy/${id}` : `/programs/${program.id}/hierarchy/${id}`}>Hierarchy</Link>} />}
            <TabPane tab="Updates" disabled key="2" />
            <TabPane tab={<Link to={`/projects/${id}/reports`}>Reports</Link>} key="reports" />
            <TabPane tab={<Link to={`/projects/${id}/info`}>Editor</Link>} key="editor" />
          </Tabs>
        )
      }} />
    </header>
  )
}
const Header = connect(({ userRdr: { lang }, editorRdr: { projectId, section1: { fields: { title, publishingStatus, relatedProjects, program } } } }) => ({ lang, title, projectId, publishingStatus, relatedProjects, program }))(
  React.memo(_Header, (prevProps, nextProps) => Object.keys(diff(prevProps, nextProps)).length === 0)
)

const Editor = ({ match: { params }, program }) => {
  const [customFields, setCustomFields] = useState(null)
  const triggerRef = useRef()
  useEffect(() => {
    if(params.id !== 'new' && !triggerRef.current){
      triggerRef.current = true
      api.get(`/project_custom_field/?project=${params.id}`)
        .then(({ data: {results}}) => {
          setCustomFields(results)
        })
    }
  })
  const CustomFieldsCond = ({ sectionIndex }) => {
    if(customFields === null) return null
    const sectionCustomFields = customFields.filter(it => it.section === sectionIndex)
    if(sectionCustomFields.length === 0) return null
    return <CustomFields fields={sectionCustomFields} />
  }
  const urlPrefix = program ? '/programs/:id/editor' : '/projects/:id'
  const urlPrefixId = program ? `/programs/${params.id}/editor` : `/projects/${params.id}`
  const redirect = program ? `/programs/${params.id}/editor/settings` : `/projects/${params.id}/settings`
  return (
    <div className="project-view">
      {!program && <Header />}
      <Switch>
        <Route path={`${urlPrefix}/reports`} render={() => <Reports projectId={params.id} />} />
        <Route>
        <div className="editor">
          <div className="status-bar">
            <SavingStatus />
            <MainMenu {...{ params, urlPrefixId, program}} />
            <ContentBar {...{program}} />
          </div>
          <div className="main-content">
            <Route path={`${urlPrefix}/:section?`} component={ProjectInitHandler} />
            <Route path={urlPrefix} exact render={() => <Redirect to={redirect} />} />
            <Route path={`${urlPrefix}/settings`} exact render={(props) => <Settings {...{...props, program}} />} />
            {sections.map((section, index) =>
              <Route
                path={`${urlPrefix}/${section.key}`}
                exact
                render={(props) => {
                  const Comp = section.component
                  return <Section {...props} params={params} sectionIndex={index + 1}><Comp {...{program}} /><CustomFieldsCond sectionIndex={index + 1} /></Section>
                }}
              />)
            }
          </div>
        </div>
        </Route>
      </Switch>
    </div>
  )
}

export default Editor
