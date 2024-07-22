/* global document, window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Tooltip, Icon, Divider, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { debounce} from 'lodash'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useTransition, animated } from 'react-spring'

import './styles.scss'
import * as actions from '../actions'
import api from '../../../utils/api'


export const sets = [
  { value: 1, label: 'Standard (RSR)' },
  { value: 4, label: 'NLR'},
  { value: 7, label: 'Gietrenk SPC'},
  { value: 2, label: 'IATI'},
  { value: 8, label: 'IATI Basic'},
  { value: 5, label: 'EUTF'},
  { value: 3, label: 'DGIS IATI'},
  { value: 6, label: 'DFID'},
  { value: 9, label: 'DGIS IATI Modified'},
]

const getParams = (url) => {
  const params = {}
  const parser = document.createElement('a')
  parser.href = url
  const query = parser.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=')
    params[pair[0]] = decodeURIComponent(pair[1])
  }
  return params
}

const RightSidebar = connect(({ editorRdr: { section1: { fields: { createdAt } } } }) => ({ createdAt }))(({ createdAt }) => {
  const { t } = useTranslation()
  return (
    <div className="right-sidebar">
      <span>{t('Date created')}</span><br /><b>{moment.tz(createdAt, 'Europe/Stockholm').format('DD MMM YYYY, HH:mm')}</b>
    </div>
  )
})

const Settings = ({ isPublic, canEditSettings, validations, match: { params }, history, program, ...props }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  sets[0].tooltip = t('The default RSR validation set which indicates the mandatory fields to publish a project in RSR and hides all advanced IATI fields.')
  sets[1].tooltip = t('A validation set with specific requirements for the Netherlands Leprosy Relief.')
  sets[2].tooltip = t('To be used by all Gietrenk projects')
  sets[3].tooltip = t('The validation set for publishing to IATI v2.02. The mandatory fields in this validation set are the minimum requirements to publish a valid IATI v2.02 file.')
  sets[4].tooltip = t('Only the the mandatory fields, i.e. the minimum requirements, to publish a valid IATI v2.02 file.')
  sets[5].tooltip = t('Validation set for The EU Emergency Trust Fund for Africa.')
  sets[6].tooltip = t('The validation set for publishing to IATI according to the guidelines of the Dutch Ministry of Foreign Affairs. These guidelines can be found <a href="https://www.government.nl/binaries/government/documents/publications/2015/12/01/open-data-and-development-cooperation/how-to-use-the-iati-standard-1.pdf" target="_blank" rel="noopener">here</a>.')
  sets[7].tooltip = t('DFID minimum IATI requirements based on <a href="https://www.gov.uk/government/publications/2010-to-2015-government-policy-overseas-aid-transparency/2010-to-2015-government-policy-overseas-aid-transparency" target="_blank" rel="noopener">the following government policy</a>. Please note that contact and document are also mandatory.')
  sets[8].tooltip = t('Validation set based on DGIS IATI with target value on indicator level.')
  const createProject = () => {
    setLoading(true)
    const urlParams = getParams(window.location.href)
    const handleResponse = ({ data }) => {
      setLoading(false)
      if (!program) {
        history.push(`/projects/${data.id}/settings`)
      } else {
        history.push(`/programs/${data.id}/editor/settings`)
        api.post('/raw_project_hierarchy/', { rootProject: data.id, maxDepth: 2 })
        .then(() => {
          api.get('/me')
          .then(({data: user}) => {
            props.setUser(user)
          })
        })
        props.addProgram({ id: data.id, name: t('Untitled program')})
      }
      props.setNewProject(data.id)
      props.fetchFields(1, data)
    }
    if(urlParams.program){
      const data = urlParams.program !== urlParams.parent ? { parent: urlParams.parent } : {}
      api.post(`/program/${urlParams.program}/add-project/`, data).then(handleResponse)
    } else {
      api.post('/project/', { validations }).then(handleResponse)
    }
  }
  useEffect(() => {
    if(params.id === 'new'){
      createProject()
    }
  }, [])
  const checkValidation = (value, checked) => {
    props.checkValidation(value, checked)
    if(params.id !== 'new'){
      const _validations = [...validations]
      if(checked && validations.indexOf(value) === -1){
        _validations.push(value)
      } else if(!checked && validations.indexOf(value) !== -1){
        _validations.splice(validations.indexOf(value), 1)
      }
      debounce(() => {
        api.patch(`/project/${params.id}/`, { validations: _validations })
      }, 1000)()
    }
  }
  const transitions = useTransition(loading, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  return (
    <div>
    <div className="settings view">
      {transitions.map(({item, key, props: _props}) =>
        item &&
        <animated.div className="loading-overlay" key={key} style={_props}>
          <div>{program ? t('Setting up your new program') : t('Setting up your new project')}</div>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
        </animated.div>
      )}
      <p>
        <Switch disabled={loading || !canEditSettings} checked={!isPublic} onChange={checked => props.saveFields({ isPublic: !checked }, 1)} />
        <span className="switch-label">{t('Private')}</span>
        <Tooltip title={t('Indicate whether this is a private project. Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project.')}><Icon type="info-circle" /></Tooltip>
      </p>
      <Divider />
      <strong>{t('Validation sets')}</strong>
      <br />
      <small>
        {t('It is possible to add or remove validation sets to your project. This determines which fields will be mandatory and which fields will be hidden. Only admins of partners with an RSR contract are able to edit this.')}
      </small>
      <ul>
        {sets.map(({ value, label, tooltip }, index) =>
        <li key={value}>
          <Switch disabled={index === 0 || loading || !canEditSettings} checked={validations.indexOf(value) !== -1} onChange={checked => checkValidation(value, checked)} />
          <span className="switch-label">{label}</span>
          <Tooltip title={<span dangerouslySetInnerHTML={{ __html: tooltip }} />}><Icon type="info-circle" /></Tooltip>
        </li>
        )}
      </ul>
    </div>
    <RightSidebar />
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations, section1: { fields: { isPublic, canEditSettings } } } }) => ({ validations, isPublic, canEditSettings }),
  actions
)(withRouter(Settings))
