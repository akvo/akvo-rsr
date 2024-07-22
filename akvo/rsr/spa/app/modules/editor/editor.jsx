/* global window */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { Icon, Button, Spin, Tooltip, Skeleton, Dropdown, Menu } from 'antd'
import TimeAgo from 'react-time-ago'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import momentTz from 'moment-timezone' // eslint-disable-line
import { range, uniq } from 'lodash'

import sections from './sections'
import MainMenu from './main-menu'
import Settings from './settings/settings'
import * as actions from './actions'
import './styles.scss'
import ProjectInitHandler from './project-init-handler'
import ValidationBar from './validation-bar'
import { validationType } from '../../utils/validation-utils'
import { CustomFields } from './custom-fields'
import api from '../../utils/api'


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
  const errors = (backendError?.response && Object?.keys(backendError.response).includes('disaggregationTargets'))
    ? [
      'Disaggregations',
      ...Object.keys(backendError.response)
        ?.filter(key => key === 'disaggregationTargets')
        ?.map(key => {
          return Object.values(backendError.response[key])
            ?.flatMap((val) => val)
            ?.flatMap((it) => it?.value)
        })
        ?.flatMap((it) => it)
        ?.filter((it) => it)
    ]
    : backendError?.response
      ? Object.keys(backendError.response)
        ?.filter(key => key !== 'disaggregationTargets')
        ?.map(key => [key, ...Object.values(backendError.response[key])])
        ?.flatMap((val) => val)
      : []
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
                {backendError.response && typeof backendError.response === 'object' && (
                  <span>
                    {`${errors[0]} : ${uniq(errors?.filter((er, ix) => ix !== 0))?.join(', ')}`}
                  </span>
                )}
                {backendError.response && typeof backendError.response === 'string' && <span>{backendError.response}<br /></span>}
              </span>
            }
          >
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
    ret.absoluteUrl = `/dir/project/${editorRdr.projectId}/`
    ret.publishingStatus = editorRdr.section1.fields.publishingStatus
    ret.canPublish = editorRdr.section1.fields.canPublish
    ret.allValid = false
    ret.publishingStatusId = editorRdr.section1.fields?.publishingStatusId
    let sectionLength = 10
    if (!(editorRdr.validations.indexOf(validationType.IATI) === -1 && editorRdr.validations.indexOf(validationType.DFID) === -1)){
      sectionLength = 11
    }
    const allFetched = range(1, sectionLength + 1).reduce((fetched, i) => fetched ? editorRdr[`section${i}`].isFetched : fetched, true)
    const isSectionValid = (i) => editorRdr[`section${i}`].errors.filter(it => it.type === 'required' || it.type === 'min').length === 0
    if (allFetched) {
      ret.allValid = range(1, sectionLength + 1).reduce((valid, i) => valid ? isSectionValid(i) : valid, true)
    }
    return ret
  },
  actions
)(({ publishingStatus, allValid, setStatus, absoluteUrl, canPublish, program, publishingStatusId }) => {
  const { t } = useTranslation()
  const isDisabled = canPublish === undefined || !allValid || !canPublish
  if(program) return null
  return (
    <div className="content">
      {publishingStatus !== 'published' && (
        <Aux>
          <div>
            <Button type="primary" disabled={isDisabled} onClick={() => setStatus('published')}>{publishingStatusId === undefined ? t('Loading...') : t('Publish')}</Button>
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

const Editor = ({ params, program }) => {
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
  )
}

export default Editor
