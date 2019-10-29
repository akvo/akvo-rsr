/* global window, document, navigator */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Radio, Popconfirm, Input, Modal, Divider, Alert, notification, Tooltip } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { diff } from 'deep-object-diff'
import { Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import Accordion from '../../../utils/accordion'
import Indicators from './indicators'
import AutoSave from '../../../utils/auto-save'
import { useForceUpdate } from '../../../utils/hooks'
import {addSetItem, removeSetItem, fetchSetItems} from '../actions'
import api from '../../../utils/api'
import InputLabel from '../../../utils/input-label';

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

const AddResultButton = connect(null, {addSetItem})(({ push, addSetItem, projectId, ...props }) => { // eslint-disable-line
  const { t } = useTranslation()
  const addResult = ({ key }) => {
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
      </Menu>
    }
    trigger={['click']}>
      <Button icon="plus" className="add-result" size="large" {...props}>{t('Add result')}</Button>
    </Dropdown>
  )
})

const Summary = React.memo(({ values: { results }, fetchSetItems, hasParent, push, projectId, onJumpToItem }) => { // eslint-disable-line
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
              <Route path="/projects/:projectId" component={({ match: { params } }) => <AddResultButton disabled={copying || importing} push={push} size="default" type="primary" {...params} />} />
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
    fields.remove(index)
    props.removeSetItem(5, 'results', index)
  }
  const [indicatorLabelOptions, setIndicatorLabelOptions] = useState([])
  useEffect(() => {
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
    navigator.clipboard.writeText(window.location.href)
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
  return (
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
                  {({ values }) => <Summary onJumpToItem={() => { handleHash(); forceUpdate(); setTimeout(handleHashScroll, 600) }} values={values} push={push} hasParent={hasParent} fetchSetItems={props.fetchSetItems} projectId={props.projectId} />}
                </FormSpy>
                <FieldArray name="results" subscription={{}}>
                  {({ fields }) => (
                    <Aux>
                      <Accordion
                        className="results-list"
                        finalFormFields={fields}
                        activeKey={selectedResultIndex}
                        ref={ref => { accordionCompRef.current = ref }}
                        setName="results"
                        multiple
                        destroyInactivePanel
                        renderPanel={(name, index) => (
                          <Panel
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
                              <Item label={<InputLabel tooltip={t('The aim of the project in one sentence. This doesn’t need to be something that can be directly counted, but it should describe an overall goal of the project. There can be multiple results for one project.')}>{t('Title')}</InputLabel>} style={{ flex: 1 }}>
                                <FinalField
                                  name={`${name}.title`}
                                  control="textarea"
                                  autosize
                                />
                              </Item>
                              <div style={{ display: 'flex' }}>
                                <Item label={<InputLabel optional tooltip={t('You can provide further information of the result here.')}>{t('Description')}</InputLabel>} style={{ flex: 1 }}>
                                  <RTE />
                                </Item>
                                <Item label={t('Enable aggregation')} style={{ marginLeft: 16 }}>
                                  <Radio.Group value>
                                    <Radio.Button value>{t('Yes')}</Radio.Button>
                                    <Radio.Button>{t('No')}</Radio.Button>
                                  </Radio.Group>
                                </Item>
                              </div>
                              <div className="ant-form-item-label">{t('Indicators')}:</div>
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
                                  indicatorLabelOptions={indicatorLabelOptions}
                                  selectedIndicatorIndex={selectedIndicatorIndex}
                                  selectedPeriodIndex={selectedPeriodIndex}
                                />
                              )}
                            />
                          </Panel>
                        )}
                      />
                      <FormSpy subscription={{ values: true }}>
                        {({ values: { results } }) =>
                          <UpdateIfLengthChanged items={results}>
                            {results.length > 0 &&
                              <Route path="/projects/:projectId" component={({ match: { params } }) => <AddResultButton push={push} {...params} />} />
                            }
                          </UpdateIfLengthChanged>}
                      </FormSpy>
                    </Aux>
                  )}
                </FieldArray>
              </Aux>
            )}
        />
      </Form>
    </div>
  )
}
export default connect(
  ({ editorRdr: { projectId, section5: { fields }, section1: { fields: { relatedProjects, primaryOrganisation, allowIndicatorLabels } } } }) => ({ fields, relatedProjects, primaryOrganisation, projectId, allowIndicatorLabels }),
  { removeSetItem, fetchSetItems }
)(React.memo(Section5, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1
  return !shouldUpdate
}))
// export default connect(
//   ({ editorRdr: { section5: { fields }, section1: { fields: { relatedProjects, primaryOrganisation } }}}) => ({ fields, relatedProjects, primaryOrganisation }),
//   { removeSetItem, fetchSetItems }
// )(Section5)
