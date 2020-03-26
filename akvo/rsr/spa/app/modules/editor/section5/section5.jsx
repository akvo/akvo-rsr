/* global window, document */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Radio, Popconfirm, Input, Modal, Divider, Alert, notification, Tooltip } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'
import * as clipboard from 'clipboard-polyfill'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import Accordion from '../../../utils/accordion'
import Indicators from './indicators'
import AutoSave from '../../../utils/auto-save'
import { useForceUpdate } from '../../../utils/hooks'
import { addSetItem, removeSetItem, fetchSetItems, fetchFields} from '../actions'
import api from '../../../utils/api'
import InputLabel from '../../../utils/input-label';
import SectionContext from '../section-context'
import { shouldUpdateSectionRoot } from '../../../utils/misc'
import RequiredHint from '../../../utils/required-hint'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children
// const resultTypes = ['input', 'activity', 'output', 'outcome', 'impact']
const resultTypes = [
  {label: 'output', value: '1'},
  {label: 'outcome', value: '2'},
  {label: 'impact', value: '3'},
  {label: 'other', value: '9'}
]

export const parseHashComponents = (hash) => {
  const ret = { resultId: null, indicatorId: null, periodId: null}
  const comps = hash.substr(2).split('/')
  if(comps.length > 1){
    if (comps[0] === 'result' && !Number.isNaN(Number(comps[1]))){
      ret.resultId = comps[1]
    }
    if(comps.length > 3){
      if (comps[2] === 'indicator' && !Number.isNaN(Number(comps[3]))){
        ret.indicatorId = comps[3]
      }
      if (comps.length > 5 && comps[4] === 'period' && !Number.isNaN(Number(comps[5]))){
        ret.periodId = comps[5]
      }
    }
  }
  return ret
}

const AddResultButton = connect(({ editorRdr: { projectId }}) => ({ projectId }), { addSetItem })(({ push, addSetItem, projectId, deletedResults, showImport, ...props }) => { // eslint-disable-line
  const { t } = useTranslation()
  const addResult = ({ key }) => {
    if(key === 'import'){
      showImport()
      return
    }
    const newItem = { type: key, indicators: [], project: projectId }
    push('results', newItem)
    addSetItem(5, 'results', newItem)
  }
  return (
    <Dropdown overlay={
      <Menu onClick={addResult}>
        {resultTypes.map(type =>
          <Menu.Item key={type.value}><Icon type="plus" />{t(type.label)}</Menu.Item>
        )}
        {deletedResults && deletedResults.length > 0 && [<Menu.Divider />, <Menu.Item key="import" className="import-result-menu-item"><Icon type="plus" /><i>{t('Import from parent')}</i></Menu.Item>]}
      </Menu>
    }
    trigger={['click']}>
      <Button icon="plus" className="add-result" size="large" {...props}>{t('Add result')}</Button>
    </Dropdown>
  )
})

const Summary = React.memo(({ values: { results }, fetchSetItems, hasParent, push, projectId, onJumpToItem, showRequired, errors, deletedResults }) => { // eslint-disable-line
  const { t } = useTranslation()
  const [importing, setImporting] = useState(false)
  const [copying, setCopying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [copyId, setCopyId] = useState('')
  const [importError, setImportError] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const importPermissionError = t('You have insufficient permissions to import results from the selected parent project. Please choose a different parent project.')
  const copyPermissionError = t('You have insufficient permissions to copy results from the selected project. Please choose a different project.')

  const doImport = () => {
    setImporting(true)
    api.post(`/project/${projectId}/import_results/`)
      .then(() => {
        api.get('/results_framework/', { project: projectId })
        .then(({ data }) => {
            setImporting(false)
            fetchSetItems(5, 'results', data.results)
          })
      })
      .catch((error) => {
        if (error.request.status === 403) {
          setImporting(false)
          setImportError(true)
        }
      })
  }
  const doCopy = () => {
    setCopying(true)
    api.post(`/project/${projectId}/copy_results/${copyId}/`)
      .then(() => {
        api.get('/results_framework/', { project: projectId })
        .then(({ data }) => {
            setCopying(false)
            fetchSetItems(5, 'results', data.results)
          })
      })
      .catch(() => {
        setCopyId('')
        setCopying(false)
        setCopyError(true)
      })
  }
  if (results.length === 0) {
    return (
      <div className="no-results">
        <h3>{t('No results')}</h3>
        {showRequired && errors.findIndex(it => it.type === 'min' && it.path === 'results') !== -1 && (
          <span className="min-required results-min-required">{t('Minimum one required')}</span>
        )}
        <Divider />
        <ul>
          {hasParent &&
            <li>
              <span>
                {t('Import the results framework from parent project')}
              </span>
              <div>
                <Button type="primary" loading={importing} onClick={doImport} disabled={copying || importing || importError}>{t('Import results set')}</Button>
              </div>
            </li>
          }
          <li className="copy-framework">
            <span>{t('Copy the results framework from an existing project')}</span>
            <div>
              <Input placeholder="Project ID" value={copyId} onChange={(ev) => setCopyId(ev.target.value)} />
              <Button type="primary" loading={copying} onClick={doCopy} disabled={copying || importing || (copyId.length === 0 || Number.isNaN(Number(copyId)))}>{t('Copy results')}</Button>
            </div>
          </li>
          <li>
            <span>{t('Create a new results framework')}</span>
            <div className="button-container">
              <AddResultButton disabled={copying || importing} size="default" type="primary" {...{ deletedResults, push }} />
            </div>
          </li>
        </ul>
        {importError && <Alert type="error" message={importPermissionError} style={{ marginTop: 15 }} />}
        {copyError && <Alert type="error" message={copyPermissionError} style={{ marginTop: 15 }} />}
      </div>
    )
  }
  const groupedResults = {}
  resultTypes.forEach(type => {
    groupedResults[type.value] = results.filter(it => it.type === type.value)
  })
  const jumpTo = (hash) => {
    window.location.hash = hash
    setShowModal(false)
    setTimeout(onJumpToItem, 300)
  }
  return (
    <div className="summary">
      <ul>
        {resultTypes.map(type =>
          <li>{t(type.label)}<strong>{groupedResults[type.value].length}</strong></li>
        )}
      </ul>
      <Button type="link" icon="eye" onClick={() => setShowModal(true)}>{t('Full preview')}</Button>
      <Modal
        title={t('Results framework preview')}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        className="full-preview-modal"
        width={640}
      >
        <Collapse bordered={false}>
          {Object.keys(groupedResults).map(groupKey =>
            <Panel header={<span className="group-title">{t(resultTypes.find(it => it.value === groupKey).label)}<b> ({groupedResults[groupKey].length})</b></span>}>
              <Collapse bordered={false}>
                {groupedResults[groupKey].map((result, resultIndex) =>
                  <Panel header={<span><b>{resultIndex + 1}. </b>{result.title} <Button size="small" type="link" onClick={(e) => { e.stopPropagation(); jumpTo(`#/result/${result.id}/`) }}>{t('Open')}</Button></span>}>
                    <ul>
                      {result.indicators.map((indicator, index) =>
                        <li>{t('Indicator')} <b>{index + 1}</b>:<br /><span className="inset">{indicator.title}</span> <Button size="small" type="link" onClick={() => jumpTo(`#/result/${result.id}/indicator/${indicator.id}/`)}>{t('Open')}</Button></li>
                      )}
                    </ul>
                  </Panel>
                )}
              </Collapse>
            </Panel>
          )}
        </Collapse>
      </Modal>
    </div>
  )
}, (prevProps, nextProps) => {
  return isEqual(nextProps.values.results, prevProps.values.results)
  // return nextProps.values.results.length === prevProps.values.results.length
})

class UpdateIfLengthChanged extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.items.length !== this.props.items.length
  }
  render(){
    return this.props.children
  }
}

const headerOffset = 127 /* header */ - 105 /* sticky header */

const Section5 = (props) => {
  const { t } = useTranslation()
  const forceUpdate = useForceUpdate()
  const accordionCompRef = useRef()
  const removeSection = (fields, index) => {
    // fields.remove(index)
    props.removeSetItem(5, 'results', index)
  }
  const [indicatorLabelOptions, setIndicatorLabelOptions] = useState([])
  const [defaultPeriods, setDefaultPeriods] = useState()
  const [parentRF, setParentRF] = useState(null)
  const [showImport, setShowImport] = useState(false)
  useEffect(() => {
    api.get(`/project/${props.projectId}/default_periods/`)
      .then(({data: {periods}}) => {
        setDefaultPeriods(periods)
      })
    if (props.allowIndicatorLabels) {
      api.get(`/organisation_indicator_label/?filter={'organisation__projects__in':[${props.projectId}]}&limit=100`)
        .then(({ data: {results} }) => {
          setIndicatorLabelOptions(results)
        })
    }
  }, [])
  const hasParent = props.relatedProjects && props.relatedProjects.filter(it => it.relation === '1').length > 0
  let selectedResultIndex = -1
  let selectedIndicatorIndex = -1
  let selectedPeriodIndex = -1
  let hashComps
  const handleHash = () => {
    hashComps = parseHashComponents(window.location.hash)
    if (hashComps.resultId) {
      selectedResultIndex = props.fields.results.findIndex(it => it.id === Number(hashComps.resultId))
      if (hashComps.indicatorId) {
        selectedIndicatorIndex = props.fields.results[selectedResultIndex].indicators.findIndex(it => it.id === Number(hashComps.indicatorId))
        if (hashComps.periodId) {
          selectedPeriodIndex = props.fields.results[selectedResultIndex].indicators[selectedIndicatorIndex].periods.findIndex(it => it.id === Number(hashComps.periodId))
        }
      }
    }
  }
  const handleHashScroll = () => {
    let ypos = 0
    if (hashComps.resultId) {
      const $resultList = document.getElementsByClassName('results-list')[0]
      const $result = $resultList.children[selectedResultIndex]
      const resultListOffset = $resultList.offsetTop
      ypos = $result.offsetParent.offsetTop + selectedResultIndex * 81 + headerOffset
      if (hashComps.indicatorId) {
        const $indicator = $result.getElementsByClassName('indicators-list')[0].children[selectedIndicatorIndex]
        ypos = $indicator.offsetParent.offsetTop + selectedIndicatorIndex * 71 + resultListOffset + headerOffset - 81 /* sticky header of result */
        if (hashComps.periodId) {
          const $period = $indicator.getElementsByClassName('periods-list')[0].children[selectedPeriodIndex]
          ypos = $period.offsetParent.offsetTop + selectedPeriodIndex * 62 + $indicator.offsetParent.offsetTop + resultListOffset + headerOffset + 3 - 81 /* sticky header of result */ - 72 /* sticky header of indicator */
        }
      }
    }
    window.scroll({ top: ypos, left: 0, behavior: 'smooth' })
  }
  handleHash()
  useEffect(() => {
    setTimeout(handleHashScroll, 200)
  }, [])

  const getLink = (resultId) => {
    window.location.hash = `#/result/${resultId}`
    clipboard.writeText(window.location.href)
    notification.open({
      message: t('Link copied!'),
      icon: <Icon type="link" style={{ color: '#108ee9' }} />,
    })
  }

  const moveResult = (from, to, fields, itemId) => {
    const doMove = () => {
      fields.move(from, to)
      api.post(`/project/${props.projectId}/reorder_items/`, `item_type=result&item_id=${itemId}&item_direction=${from > to ? 'up' : 'down'}`)
    }
    if (accordionCompRef.current.state.activeKey.length === 0) {
      doMove()
    } else {
      accordionCompRef.current.handleChange([])
      setTimeout(doMove, 500)
    }
  }
  let parent = null
  let parentId = null
  if(props.fields && props.fields.results.length > 0){
    for(let i = 0; i <= props.fields.results.length; i += 1){
      const result = props.fields.results[i]
      if (result && result.parentProject && Object.keys(result.parentProject).length > 0) {
        parent = result.parentProject[Object.keys(result.parentProject)[0]]
        parentId = Object.keys(result.parentProject)[0]
        break
      }
    }
  }
  useEffect(() => {
    if(parent){
      // has a parent AND it has imported results framework
      api.get(`/results_framework_lite/?project=${parentId}`)
        .then(d => {
          setParentRF(d.data.results)
        })
    }
  }, [])
  const isImported = (index) => {
    return props.fields.results[index] && props.fields.results[index].parentResult != null
  }
  let deletedResults = []
  if (parentRF) {
    deletedResults = parentRF.filter(result => props.fields.results.findIndex(it => it.parentResult === result.id) === -1)
  }
  const importResult = (result) => {
    api.post(`/project/${props.projectId}/import_result/${result.id}/`)
      .then(() => {
        api.get(`/results_framework_lite/?project=${props.projectId}`)
          .then(d => {
            props.fetchFields(5, d.data)
            setShowImport(false)
          })
      })
  }
  return (
    <SectionContext.Provider value="section5">
    <div className="view section5">
      <Form layout="vertical">
        <FinalForm
          onSubmit={() => { }}
          initialValues={props.fields}
          subscription={{}}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push }
            }
          }) => (
              <Aux>
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => <Summary onJumpToItem={() => { handleHash(); forceUpdate(); setTimeout(handleHashScroll, 600) }} {...{values, push, deletedResults, hasParent}} fetchSetItems={props.fetchSetItems} projectId={props.projectId} showRequired={props.showRequired} errors={props.errors} />}
                </FormSpy>
                <FieldArray name="results" subscription={{}}>
                  {({ fields }) => (
                    <Aux>
                      {parent && <Alert message={`This results framework is inherited and contributes to ${parent}`} type="info" showIcon />}
                      <Accordion
                        className="results-list"
                        finalFormFields={fields}
                        activeKey={selectedResultIndex}
                        ref={ref => { accordionCompRef.current = ref }}
                        setName="results"
                        multiple
                        destroyInactivePanel
                        renderPanel={(name, index) => (
                          <Field name={`${name}.removing`} render={({ input: { value: removing }, ...pprops }) =>
                          <Panel
                            {...pprops}
                            className={removing && 'removing'}
                            key={`${index}`}
                            header={
                              <span>
                                <Field
                                  name={`${name}.type`}
                                  render={({ input }) => <span className="capitalized">{input.value && resultTypes.find(it => it.value === input.value).label}</span>}
                                />
                                &nbsp;Result {index + 1}
                                <Field
                                  name={`${name}.title`}
                                  render={({ input }) => input.value ? `: ${input.value}` : ''}
                                />
                                <RequiredHint section="section5" name={name} />
                              </span>}
                            extra={
                              // eslint-disable-next-line
                              <div onClick={e => e.stopPropagation()}>
                                <div className="delete-btn-holder">
                                  <Button.Group>
                                    <Field name={`${name}.id`} render={({ input }) =>
                                    <Aux>
                                    <Tooltip title={t('Get a link to this result')}>
                                      <Button size="small" icon="link" onClick={() => getLink(input.value)} />
                                    </Tooltip>
                                    {index > 0 &&
                                    <Tooltip title={t('Move up')}>
                                      <Button icon="up" size="small" onClick={() => moveResult(index, index - 1, fields, input.value)} />
                                    </Tooltip>
                                    }
                                    {index < fields.length - 1 &&
                                    <Tooltip title={t('Move down')}>
                                      <Button icon="down" size="small" onClick={() => moveResult(index, index + 1, fields, input.value)} />
                                    </Tooltip>
                                    }
                                    </Aux>
                                    } />
                                    <Popconfirm
                                      title={t('Are you sure to delete this result?')}
                                      onConfirm={() => removeSection(fields, index)}
                                      okText={t('Yes')}
                                      cancelText={t('No')}
                                    >
                                      <Button size="small" icon="delete" className="delete-panel" />
                                    </Popconfirm>
                                  </Button.Group>
                                </div>
                              </div>
                            }
                          >
                            <AutoSave sectionIndex={5} setName="results" itemIndex={index} />
                            <div className="main-form">
                              <FinalField
                                name={`${name}.title`}
                                control="textarea"
                                autosize
                                withLabel
                                dict={{ label: t('Title'), tooltip: t('The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.')}}
                                disabled={isImported(index)}
                              />
                              {parent != null && props.fields.results[index] && (!props.fields.results[index].parentProject || Object.keys(props.fields.results[index].parentProject).length === 0) && <Alert className="not-inherited" message="This result does not contribute to the lead project" type="warning" showIcon />}
                              <div style={{ display: 'flex' }}>
                                <Item label={<InputLabel optional tooltip={t('You can provide further information of the result here.')}>{t('Description')}</InputLabel>} style={{ flex: 1 }}>
                                    <FinalField name={`${name}.description`} render={({ input }) => <RTE {...input} disabled={isImported(index)} />} />
                                </Item>
                                <Item label={t('Enable aggregation')} style={{ marginLeft: 16 }}>
                                  <Field
                                    name={`${name}.aggregationStatus`}
                                    render={({input}) => (
                                      <Radio.Group {...input} disabled={isImported(index)}>
                                        <Radio.Button value={true}>{t('Yes')}</Radio.Button>
                                        <Radio.Button value={false}>{t('No')}</Radio.Button>
                                      </Radio.Group>
                                    )}
                                  />
                                </Item>
                              </div>
                              <div className="ant-form-item-label">
                                {t('Indicators')}:
                                {props.showRequired && props.errors.findIndex(it => it.type === 'min' && it.path === `results[${index}].indicators`) !== -1 && (
                                  <span className="min-required indicator-min-required">{t('Minimum one required')}</span>
                                )}
                              </div>
                            </div>
                            <Field
                              name={`${name}.id`}
                              render={({ input }) => (
                                <Indicators
                                  fieldName={name}
                                  formPush={push}
                                  resultId={input.value}
                                  resultIndex={index}
                                  primaryOrganisation={props.primaryOrganisation}
                                  projectId={props.projectId}
                                  allowIndicatorLabels={props.allowIndicatorLabels}
                                  validations={props.validations}
                                  fetchFields={props.fetchFields}
                                  result={props.fields && props.fields.results[index] && props.fields.results[index]}
                                  resultImported={isImported(index)}
                                  {...{ parentRF, indicatorLabelOptions, selectedIndicatorIndex, selectedPeriodIndex, defaultPeriods, setDefaultPeriods}}
                                />
                              )}
                            />
                          </Panel>
                          } />
                        )}
                      />
                      {props.fields.results.length > 0 && <Route path="/projects/:projectId" component={({ match: { params } }) => <AddResultButton push={push} deletedResults={deletedResults} showImport={() => setShowImport(true)} {...params} />} />}
                    </Aux>
                  )}
                </FieldArray>
              </Aux>
            )}
        />
      </Form>
      <Modal className="import-indicator" visible={showImport} footer={null} onCancel={() => setShowImport(false)} title="Import a deleted result">
        {deletedResults.map(item =>
          <div className="deleted-indicator">
            <div className="name">{item.title}</div>
            <Button type="primary" onClick={() => importResult(item)}>Import</Button>
          </div>
        )}
      </Modal>
    </div>
    </SectionContext.Provider>
  )
}
export default connect(
  ({ editorRdr: { projectId, validations, showRequired, section5: { fields, errors }, section1: { fields: { relatedProjects, primaryOrganisation, allowIndicatorLabels } } } }) => ({ fields, relatedProjects, primaryOrganisation, projectId, allowIndicatorLabels, validations, errors, showRequired }),
  { removeSetItem, fetchSetItems, fetchFields }
)(React.memo(Section5, shouldUpdateSectionRoot))
