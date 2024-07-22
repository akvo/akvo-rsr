/* global window, document */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Radio, Popconfirm, Input, Modal, Divider, Alert, notification, Tooltip } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'
import * as clipboard from 'clipboard-polyfill'
import { diff } from 'deep-object-diff'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import Accordion from '../../../utils/accordion'
import Indicators from './indicators'
import AutoSaveFS from '../../../utils/auto-save'
import { useForceUpdate } from '../../../utils/hooks'
import { addSetItem, removeSetItem, fetchSetItems, fetchFields, saveFields, moveSetItem} from '../actions'
import api from '../../../utils/api'
import InputLabel from '../../../utils/input-label'
import SectionContext from '../section-context'
import { check4deleted, getProjectUuids } from '../../../utils/misc'
import { resultTypes } from '../../../utils/constants'
import RequiredHint from '../../../utils/required-hint'
import { DefaultPeriodsProvider } from './periods/defaults-context'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

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

const AddResultButton = connect(({ editorRdr: { projectId }}) => ({ projectId }), { addSetItem })(({ push, addSetItem: addSetItem_, projectId, deletedResults, showImport, ...props }) => {
  const { t } = useTranslation()
  const addResult = ({ key }) => {
    if(key === 'import'){
      showImport()
      return
    }
    const newItem = { type: key, indicators: [], project: projectId }
    push('results', newItem)
    addSetItem_(5, 'results', newItem)
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
    trigger={['click']}
    >
      <Button icon="plus" className="add-result" size="large" {...props}>{t('Add result')}</Button>
    </Dropdown>
  )
})

const Summary = React.memo(({ values: { results }, fetchSetItems: fetchSetItems_, hasParent, push, projectId, onJumpToItem, showRequired, errors, deletedResults }) => {
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
            fetchSetItems_(5, 'results', data.results)
          })
      })
      .catch((error) => {
        setImporting(false)
        if (error.request.status === 403) {
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
            fetchSetItems_(5, 'results', data.results)
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
})

const headerOffset = 127 /* header */ - 105 /* sticky header */

const Section5 = (props) => {
  const { t } = useTranslation()
  const forceUpdate = useForceUpdate()
  const accordionCompRef = useRef()
  const removeSection = (fields, index) => {
    props.removeSetItem(5, 'results', index)
  }
  const [indicatorLabelOptions, setIndicatorLabelOptions] = useState([])
  const [periodLabels, setPeriodLabels] = useState()
  const [customFields, setCustomFields] = useState([])
  const [parentRF, setParentRF] = useState(null)
  const [showImport, setShowImport] = useState(false)
  useEffect(() => {
    api.get(`/project/${props.projectId}/period-labels/`)
      .then(({data: {periodLabels: labels}}) => {
        setPeriodLabels(labels)
      })
    api.get(`/indicator_custom_field/?project=${props.projectId}`)
      .then(({data: {results}}) => {
        setCustomFields(results)
      })
    if (props.allowIndicatorLabels) {
      api.get(`/organisation_indicator_label/?filter={'organisation__projects__in':[${props.projectId}]}&limit=100`)
        .then(({ data: {results} }) => {
          setIndicatorLabelOptions(results)
        })
    }
  }, [])
  const hasParent = (getProjectUuids(props.path)?.length > 1)
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
      if (!$resultList) return
      const $result = $resultList.children[selectedResultIndex]
      const resultListOffset = $resultList.offsetTop
      ypos = $result.offsetParent.offsetTop + selectedResultIndex * 81 + headerOffset
      if (hashComps.indicatorId) {
        const $indicator = $result.getElementsByClassName('indicators-list')[0]?.children[selectedIndicatorIndex]
        if($indicator){
          ypos = $indicator.offsetParent.offsetTop + selectedIndicatorIndex * 71 + resultListOffset + headerOffset - 81 /* sticky header of result */
          if (hashComps.periodId) {
            const $period = $indicator.getElementsByClassName('periods-list')[0].children[selectedPeriodIndex]
            ypos = $period.offsetParent.offsetTop + selectedPeriodIndex * 62 + $indicator.offsetParent.offsetTop + resultListOffset + headerOffset + 3 - 81 /* sticky header of result */ - 72 /* sticky header of indicator */
          }
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
      props.moveSetItem(5, 'results', from, to)
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
  const showIndexNumbers = !(props.program && props.program.id === 9062)
  return (
    <SectionContext.Provider value="section5">
    <DefaultPeriodsProvider projectId={props.projectId}>
    <div className="view section5">
      <Form layout="vertical">
        <FinalForm
          onSubmit={() => { }}
          initialValues={props.fields}
          subscription={{}}
          mutators={{ ...arrayMutators }}
          render={(renderProps) => {
            const {
              form: {
                mutators: { push }
              }
            } = renderProps
            return (
              <Aux>
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => <Summary onJumpToItem={() => { handleHash(); forceUpdate(); setTimeout(handleHashScroll, 600) }} {...{ values, push, deletedResults, hasParent }} fetchSetItems={props.fetchSetItems} projectId={props.projectId} showRequired={props.showRequired} errors={props.errors} />}
                </FormSpy>
                <TargetsAtSetting {...props} />
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
                                    name={`${name}.id`}
                                    render={(idProp) =>
                                      <Field
                                        name={`${name}.type`}
                                        render={({ input }) => {
                                          const { values } = renderProps.form.getState()
                                          const ind = values.results.filter(it => it.type === input.value).findIndex(it => it.id === idProp.input.value)
                                          return (
                                            <span>
                                              <span className="capitalized">{input.value && resultTypes.find(it => it.value === input.value).label}</span>
                                                &nbsp;Result {showIndexNumbers && (ind > -1 && ind + 1)}
                                            </span>
                                          )
                                        }}
                                      />
                                    }
                                  />
                                  <Field
                                    name={`${name}.title`}
                                    render={({ input }) => input.value ? `: ${input.value}` : ''}
                                  />
                                  <RequiredHint section="section5" name={name} />
                                </span>}
                              extra={
                                <div onClick={e => e.stopPropagation()}>
                                  <div className="delete-btn-holder">
                                    <Button.Group>
                                      <Field name={`${name}.id`} render={({ input }) =>
                                        <Aux>
                                          <Tooltip title={t('Get a link to this result')}>
                                            <Button size="small" icon="link" onClick={() => getLink(input.value)} />
                                          </Tooltip>
                                          {!parent && index > 0 &&
                                            <Tooltip title={t('Move up')}>
                                              <Button icon="up" size="small" onClick={() => moveResult(index, index - 1, fields, input.value)} />
                                            </Tooltip>
                                          }
                                          {!parent && index < fields.length - 1 &&
                                            <Tooltip title={t('Move down')}>
                                              <Button icon="down" size="small" onClick={() => moveResult(index, index + 1, fields, input.value)} />
                                            </Tooltip>
                                          }
                                          <Popconfirm
                                            title={t('Are you sure to delete this result?')}
                                            onConfirm={() => removeSection(fields, index)}
                                            okText={t('Yes')}
                                            cancelText={t('No')}
                                          >
                                            <Button size="small" icon="delete" className="delete-panel" />
                                          </Popconfirm>
                                        </Aux>
                                      }
                                      />
                                    </Button.Group>
                                  </div>
                                </div>
                              }
                            >
                              <AutoSaveFS sectionIndex={5} setName="results" itemIndex={index} />
                              <div className="main-form">
                                <FinalField
                                  name={`${name}.title`}
                                  control="textarea"
                                  autosize
                                  withLabel
                                  dict={{ label: t('Title'), tooltip: t('The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.') }}
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
                                      render={({ input }) => (
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
                                    program={props.program}
                                    targetsAt={props.targetsAt}
                                    disableReordering={!!parent}
                                    {...{ parentRF, indicatorLabelOptions, selectedIndicatorIndex, selectedPeriodIndex, customFields, periodLabels, setPeriodLabels }}
                                  />
                                )}
                              />
                            </Panel>
                          }
                          />
                        )}
                      />
                      {props.fields.results.length > 0 && <AddResultButton {...{push, deletedResults}} showImport={() => setShowImport(true)} />}
                    </Aux>
                    )}
                </FieldArray>
              </Aux>
              )
          }}
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
    </DefaultPeriodsProvider>
    </SectionContext.Provider>
  )
}

const TargetsAtSetting = (props) => {
  const { t } = useTranslation()
  const targetsAt = props.targetsAt || 'period'
  const handleMenuSelect = ({ key }) => {
    props.saveFields({ targetsAt: key }, 1)
  }
  if (props.program && props.program.id === parseInt(props.projectId, 10)){
    return [
      <div className="targets-setting">
        <div>
          <Icon type="setting" />
          {t('Set targets at')}
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={handleMenuSelect}>
                {['period', 'indicator'].filter(it => it !== targetsAt).map(it => [
                <Menu.Item key={it}>
                  {t(it)} level
                </Menu.Item>
                ])}
              </Menu>
            }
          >
            <Button type="link">{t(targetsAt)} {t('level')} <Icon type="caret-down" /></Button>
          </Dropdown>
        </div>
      </div>
    ]
  }
  return null
}

export const customShouldUpdateSectionRoot = (prevProps, nextProps) => {
  // this checks all connected props from reducer, also makes an additional "targetsAt" check in diff
  const difference = diff(prevProps, nextProps)
  // update if item removed
  const keys = Object.keys(difference)
  if (
    (keys.length) &&
    (difference && difference[keys[0]]) &&
    (Object.keys(difference[keys[0]]).length === 1) &&
    (difference[keys[0]][Object.keys(difference[keys[0]])[0]] === undefined)
  ) {
    return false
  }
  // update if some props diff
  const strDiff = JSON.stringify(difference)
  const shouldUpdate = strDiff.indexOf('"id"') !== -1 || strDiff.indexOf('"removing"') !== -1 || check4deleted(difference) || strDiff.indexOf('"targetsAt"')
  return !shouldUpdate
}

export default connect(
  ({
    editorRdr: {
      projectId,
      validations,
      showRequired,
      section5: {
        fields,
        errors
      },
      section1: {
        fields: {
          path,
          primaryOrganisation,
          allowIndicatorLabels,
          program,
          targetsAt
        }
      }
    }
  }) => ({
    fields,
    path,
    primaryOrganisation,
    projectId,
    allowIndicatorLabels,
    validations,
    errors,
    showRequired,
    program,
    targetsAt
  }),
  { removeSetItem, moveSetItem, fetchSetItems, fetchFields, saveFields }
)(React.memo(Section5, customShouldUpdateSectionRoot))
