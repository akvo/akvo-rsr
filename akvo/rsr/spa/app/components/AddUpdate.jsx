/* eslint-disable no-shadow */
/* global window, FormData */
import React, { useState, useEffect, useRef } from 'react'
import { Collapse, Button, Icon, Form, Divider, Upload, Typography } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import humps from 'humps'
import moment from 'moment'
import classNames from 'classnames'
import SimpleMarkdown from 'simple-markdown'
import api, { config } from '../utils/api'
import { nicenum, dateTransform } from '../utils/misc'
import FinalField from '../utils/final-field'
import RTE from '../utils/rte'
import DsgOverview from '../modules/results/dsg-overview'
import Timeline from '../modules/results/timeline'
import { DeclinedStatus } from './DeclinedStatus'
import { PrevUpdate } from './PrevUpdate'
import ScoringField from './ScoringField'
import { StatusUpdate } from './StatusUpdate'

const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const { Panel } = Collapse
const { Text } = Typography


export const AddUpdate = ({
  period,
  indicator,
  addUpdateToPeriod,
  patchUpdateInPeriod,
  editPeriod,
  isPreview,
  mneView,
  ...props
}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [fullPendingUpdate, setFullPendingUpdate] = useState(null)
  const [fullDraftUpdate, setFullDraftUpdate] = useState(null)
  const [fileSet, setFileSet] = useState([])
  const formRef = useRef()
  const disaggregations = []
  if (indicator) {
    indicator.dimensionNames && indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }
  const initialValues = useRef({ value: '', disaggregations })
  useEffect(() => {
    initialValues.current = { value: '', disaggregations }
    setFileSet([])
  }, [period])
  const draftUpdate = period.updates.find(it => it.status === 'D')
  const pendingUpdate = (period.updates[0]?.status === 'P' || (indicator.measure === '2' && period.updates[0]?.status !== 'R')/* trick % measure update to show as "pending update" */) ? period.updates[0] : null
  const recentUpdate = /* in the last 12 hours AND NOT returned for revision */ period.updates.filter(it => it.status !== 'R').find(it => { const minDiff = (new Date().getTime() - new Date(it.lastModifiedAt).getTime()) / 60000; return minDiff < 720 })
  // the above is used for the M&E view bc their value updates skip the "pending" status
  const submittedUpdate = pendingUpdate || recentUpdate
  const updateForRevision = period.updates.find(update => update.status === 'R')

  const handleSubmit = (values) => {
    if (values.value === '') delete values.value
    const payload = {
      ...values,
      period: period.id
    }
    let updateFunc = addUpdateToPeriod
    const draftOrRevUpdate = draftUpdate || updateForRevision
    if (draftOrRevUpdate != null) {
      updateFunc = patchUpdateInPeriod
      delete payload.file
      delete payload.fileUrl
      delete payload.periodActualValue
      delete payload.photo
    }
    (draftOrRevUpdate != null ?
      api.patch(`/indicator_period_data_framework/${draftOrRevUpdate.id}/`, payload)
      :
      api.post('/indicator_period_data_framework/', payload)
    ).then(({ data: update }) => {
      setSubmitting(false)
      const resolveUploads = () => {
        if (fileSet.length > 0) {
          const urlParams = new URLSearchParams(window.location.search)
          const formData = new FormData()
          fileSet.forEach(file => {
            formData.append('files', file)
          })
          axios.post(`${config.baseURL}/indicator_period_data/${update.id}/files/?rt=${urlParams.get('rt')}`, formData, axiosConfig)
            .then(({ data }) => {
              updateFunc({ ...update, fileSet: data }, period, indicator)
            })
            .catch(() => {
              updateFunc(update, period, indicator)
            })
        }
        else {
          updateFunc(update, period, indicator)
        }
      }
      if (values.note !== '' && values.note != null) {
        api.post('/indicator_period_data_comment/', {
          data: update.id,
          comment: values.note
        }).then(() => {
          resolveUploads()
        })
      } else {
        resolveUploads()
      }
    }).catch(() => {
      setSubmitting(false)
    })
  }

  const handleSubmitClick = (status) => (e) => {
    e.stopPropagation()
    formRef.current.form.change('status', status)
    formRef.current.form.submit()
    setSubmitting(status)
  }
  useEffect(() => {
    if (draftUpdate || updateForRevision) {
      const update = draftUpdate || updateForRevision
      setFullDraftUpdate(update)
      setFullPendingUpdate(null)
      api.get(`/indicator_period_data_framework/${update.id}/`).then(({ data }) => {
        setFullDraftUpdate(data)
      })
    }
    else if (submittedUpdate) {
      setFullPendingUpdate(submittedUpdate)
      api.get(`/indicator_period_data_framework/${submittedUpdate.id}/`).then(({ data }) => {
        setFullPendingUpdate(data)
      })
    } else {
      setFullPendingUpdate(null)
      setFullDraftUpdate(null)
    }
  }, [period.updates])
  const currentActualValue = indicator.type === 1 ? period.updates.filter(it => it.status === 'A').reduce((acc, val) => acc + val.value, 0) : null
  const disableInputs = ((submittedUpdate && !draftUpdate) || isPreview)
  let init = fullDraftUpdate || fullPendingUpdate || initialValues.current
  init = init.hasOwnProperty('comments') ? { ...init, note: init?.comments[0]?.comment } : init
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={init}
      render={({ form }) => {
        const isExpanded = Array.isArray(props?.activeKey) ? props?.activeKey.includes(props?.panelKey?.toString()) : (parseInt(props?.activeKey, 10) === parseInt(props?.panelKey, 10))
        const updateLabel = draftUpdate
          ? draftUpdate : recentUpdate
            ? ({ ...recentUpdate, status: recentUpdate.status === 'A' ? 'A' : 'SR' }) : (pendingUpdate && pendingUpdate.status === 'P')
              ? pendingUpdate : null
        const updateClass = updateLabel?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
        return [
          <Panel
            {...props}
            header={[
              <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
              <>
                {isExpanded &&
                  (
                    <>
                      {disableInputs
                        ? (
                          <div className={`right-corner ${updateClass}`}>
                            <span><Icon type="check" /></span>
                            <span>{updateLabel?.status === 'A' ? t('Approved') : t('Submitted')}</span>
                          </div>
                        )
                        : (
                          <FormSpy subscription={{ values: true, pristine: true }}>
                            {({ values, pristine }) => {
                              let disabled = pristine
                              if (indicator.type === 1) {
                                if (values.value !== '' && String(Number(values.value)) !== 'NaN') disabled = false
                              } else {
                                if (values.narrative != null && values.narrative.length > 3) disabled = false
                              }
                              const { disaggregations: dgsField, ...otherFields } = values
                              const isDisabled = disabled || submitting || (submittedUpdate != null && draftUpdate == null) || isPreview || !(Object.keys(otherFields).length)
                              return [
                                <div className="rightside">
                                  <Button
                                    loading={submitting === 'D'}
                                    type="ghost"
                                    disabled={isDisabled} onClick={handleSubmitClick('D')}
                                  >
                                    {t('Save draft')}
                                  </Button>
                                  <Button
                                    loading={['A', 'P'].includes(submitting)}
                                    type="primary"
                                    disabled={isDisabled}
                                    onClick={handleSubmitClick(mneView ? 'A' : 'P')}
                                  >
                                    {t('Submit')}
                                  </Button>
                                </div>
                              ]
                            }}
                          </FormSpy>
                        )}
                    </>
                  )}
              </>
            ]}
            className={updateClass}
          >
            <div className="add-update">
              <header>
                {indicator.type === 2 ? <b>{t('Qualitative')}</b> :
                  indicator.ascending ? [
                    <Icon type="rise" />, <b>{t('Ascending')}</b>
                  ] : [
                    <Icon type="fall" />, <b>{t('Descending')}</b>
                  ]
                }
              </header>
              <StatusUpdate {...updateLabel} />
              {(updateForRevision && !updateLabel) && <DeclinedStatus update={updateForRevision} />}
              <Form aria-orientation="vertical">
                <div className={classNames('inputs-container', { qualitative: indicator.type === 2, 'no-prev': period.updates.filter(it => it.status === 'A').length === 0 })}>
                  <div className="inputs">
                    {mneView && indicator.type === 1 && <h4>Add a value update</h4>}
                    {indicator.dimensionNames.map(group =>
                      <div className="dsg-group" key={group.name}>
                        <div className="h-holder">
                          <h5>{group.name}</h5>
                        </div>
                        {group.dimensionValues.map(dsg => {
                          return indicator.measure === '1' ? (
                            <FinalField
                              name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].value`}
                              control="input-number"
                              withLabel
                              dict={{ label: dsg.value }}
                              min={-Infinity}
                              step={1}
                              disabled={disableInputs}
                            />
                          ) : (
                            <div>
                              <div style={{ paddingLeft: '1em' }}>{dsg.value}</div>
                              <FinalField
                                name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].numerator`}
                                control="input-number"
                                withLabel
                                dict={{ label: 'Enumerator' }}
                                min={-Infinity}
                                step={1}
                                disabled={disableInputs}
                              />
                              <FinalField
                                name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].denominator`}
                                control="input-number"
                                withLabel
                                dict={{ label: 'Denominator' }}
                                min={-Infinity}
                                step={1}
                                disabled={disableInputs}
                              />
                            </div>
                          )
                        }
                        )}
                      </div>
                    )}
                    {indicator.type === 1 ? [
                      <Field
                        name="disaggregations"
                        render={({ input }) => {
                          const dsgGroups = {}
                          input.value.forEach(item => {
                            if (!dsgGroups[item.category]) dsgGroups[item.category] = { value: 0, numerator: 0, denominator: 0 }
                            if (item.value) dsgGroups[item.category].value += item.value
                            if (item.numerator) dsgGroups[item.category].numerator += item.numerator
                            if (item.denominator) dsgGroups[item.category].denominator += item.denominator
                          })
                          const categories = Object.keys(dsgGroups)
                          if (categories.length > 0 && indicator.measure === '1') {
                            const value = categories.reduce((acc, key) => dsgGroups[key].value > acc ? dsgGroups[key].value : acc, 0)
                            if (value > 0) form.change('value', value)
                          }
                          if (categories.length > 0 && indicator.measure === '2') {
                            const [numerator, denominator] = categories.reduce(([numerator, denominator], key) => [
                              dsgGroups[key].numerator > numerator ? dsgGroups[key].numerator : numerator,
                              dsgGroups[key].denominator > denominator ? dsgGroups[key].denominator : denominator
                            ], [0, 0])
                            if (numerator > 0) form.change('numerator', numerator)
                            if (denominator > 0) form.change('denominator', denominator)
                          }
                          return null
                        }}
                      />,
                      indicator.measure === '1' ?
                        <FinalField
                          withLabel
                          dict={{ label: period?.disaggregationTargets.length > 0 ? t('Total value') : t('Value') }}
                          name="value"
                          control="input-number"
                          min={-Infinity}
                          step={1}
                          disabled={disableInputs}
                        /> :
                        <FinalField
                          withLabel
                          dict={{ label: 'Numerator' }}
                          name="numerator"
                          control="input-number"
                          min={-Infinity}
                          step={1}
                          disabled={disableInputs}
                        />,
                      (indicator.measure === '1' && period.updates.length > 0) && [
                        <div className="updated-actual">
                          <div className="cap">{t('Updated actual value')}</div>
                          <Field
                            name="value"
                            render={({ input }) => {
                              const updatedTotal = currentActualValue + (disableInputs ? 0 : (input.value > 0 ? input.value : 0))
                              return (
                                <div className="value">
                                  <b>{nicenum(updatedTotal)}</b>
                                  {period.targetValue > 0 && <small>{(Math.round((updatedTotal / period.targetValue) * 100 * 10) / 10)}% of target</small>}
                                </div>
                              )
                            }}
                          />
                        </div>
                      ],
                      indicator.measure === '2' && [
                        <FinalField
                          withLabel
                          dict={{ label: 'Denominator' }}
                          name="denominator"
                          control="input-number"
                          step={1}
                          min={-Infinity}
                          disabled={disableInputs}
                        />,
                        <div className="perc">
                          <FormSpy subscription={{ values: true }}>
                            {({ values }) => {
                              if (values.numerator !== '' && values.numerator != null && values.denominator !== '' && values.denominator != null) {
                                const value = Math.round((values.numerator / values.denominator) * 100 * 10) / 10
                                if (value !== values.value) {
                                  form.change('value', value)
                                }
                                return `${value}%`
                              }
                              return null
                            }}
                          </FormSpy>
                        </div>
                      ]
                    ] : [ // qualitative indicator
                      indicator.scores?.length > 0 && (
                        <Field
                          name="scoreIndices"
                          render={({ input }) => <ScoringField scores={indicator.scores} disabled={disableInputs} id={init?.id} {...input} />}
                        />
                      ),
                      <h5>{t('New update')}</h5>,
                      <Field
                        name="narrative"
                        render={({ input }) => {
                          if (disableInputs) {
                            const parse = SimpleMarkdown.defaultBlockParse
                            const mdOutput = SimpleMarkdown.defaultOutput
                            return <div className="md-output">{mdOutput(parse(input.value))}</div>
                          }
                          return [
                            <RTE {...input} />
                          ]
                        }}
                      />
                    ]}
                  </div>
                  {!mneView && !(indicator.measure === '2' && period.updates.length > 0) &&
                    <PrevUpdate update={period.updates.filter(it => it.status === 'A' || it.status === 'R')[0]} {...{ period, indicator }} />
                  }
                  {(mneView && indicator.type === 1) && (
                    disaggregations.length > 0 ?
                      (
                        <FormSpy subscription={{ values: true }}>
                          {({ values }) => {
                            const periodUpdates = [...period.updates, { ...values, status: 'D' }]
                            const disaggregations = [...periodUpdates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
                            const valueUpdates = periodUpdates.map(it => ({ value: it.value, status: it.status }))
                            return <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod: (props) => { editPeriod(props, indicator) }, values: valueUpdates }} />
                          }}
                        </FormSpy>
                      ) :
                      <div className="timeline-outer">
                        <FormSpy subscription={{ values: true }}>
                          {({ values }) => {
                            return <Timeline {...{ updates: [...period.updates, submittedUpdate == null ? { ...values, status: 'D' } : null].filter(it => it !== null), indicator, period, editPeriod }} />
                          }}
                        </FormSpy>
                      </div>
                  )}
                </div>
                <Divider />
                <div className="notes">
                  {indicator.type === 1 &&
                    <FinalField
                      name="text"
                      control="textarea"
                      withLabel
                      dict={{ label: t('Value comment') }}
                      disabled={disableInputs}
                    />
                  }
                  <FinalField
                    name="note"
                    control="textarea"
                    withLabel
                    dict={{ label: t('Internal private note') }}
                    disabled={disableInputs}
                  />
                </div>
              </Form>
              <div className="upload">
                <Upload.Dragger
                  multiple
                  disabled={disableInputs}
                  fileList={fileSet}
                  beforeUpload={(file, files) => {
                    setFileSet([...fileSet, ...files])
                    return false
                  }}
                  onRemove={file => {
                    setFileSet(fileSet.filter(_file => _file !== file))
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="picture" theme="twoTone" />
                  </p>
                  <p className="ant-upload-text">{t('Drag file here')}</p>
                  <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
                  <p><small>Max: 10MB</small></p>
                </Upload.Dragger>
              </div>
            </div>
          </Panel>
        ]
      }}
    />
  )
}
