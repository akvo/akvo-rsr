/* eslint-disable react/no-danger */
/* eslint-disable no-shadow */
/* global window, FormData, document */
import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Divider, Upload, Modal, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import classNames from 'classnames'
import ShowMoreText from 'react-show-more-text'
import { useSpring, animated } from 'react-spring'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import SVGInline from 'react-svg-inline'
import axios from 'axios'
import humps from 'humps'
import SimpleMarkdown from 'simple-markdown'
import RTE from '../../utils/rte'
import { useFetch } from '../../utils/hooks'
import FinalField from '../../utils/final-field'
import api, { config } from '../../utils/api'
import { nicenum, dateTransform } from '../../utils/misc'
import statusPending from '../../images/status-pending.svg'
import statusApproved from '../../images/status-approved.svg'
import statusRevision from '../../images/status-revision.svg'
import ScoreCheckboxes from './score-checkboxes'
import DsgOverview from './dsg-overview'
import Timeline from './timeline'
import { isPeriodNeedsReporting } from './filters'

const { Panel } = Collapse
const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const Enumerator = ({ results, jwtView, title, mneView, needsReportingTimeoutDays, setResults }) => {
  const { t } = useTranslation()
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)
  const [activeKey, setActiveKey] = useState(null)
  const [recentIndicators, setRecentIndicators] = useState([]) // used to preserve the just-completed indicators visible
  const prevSelected = useRef()

  useEffect(() => {
    const initIndicators = results.flatMap(result => {
      return result.indicators?.map(indicator => {
        return {
          ...indicator,
          resultId: result?.id,
          periods: indicator.periods.filter(it => it.locked === false)
        }
      }).filter(indicator => indicator.periods.length > 0)
    })
    setIndicators(initIndicators)
  }, indicators)

  useEffect(() => {
    if (prevSelected.current?.id === selected?.id) return
    prevSelected.current = selected
    if (selected?.periods.length === 1) {
      setActiveKey(selected.periods[0].id)
    } else {
      setActiveKey(null)
    }
  }, [selected])

  useEffect(() => {
    if (indicators.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const isIndicatorPreview = (urlParams.get('rt') === 'preview' && urlParams.get('indicators'))
      const ids = isIndicatorPreview ? urlParams.get('indicators').split(',') : []
      setIsPreview(isIndicatorPreview)
      const filterIndicators = isIndicatorPreview
        ? indicators.filter(it => ids.indexOf(String(it.id)) !== -1)
        : indicators.filter(indicator => {
          const checkPeriods = indicator?.periods?.filter(period => {
            return isPeriodNeedsReporting(period, needsReportingTimeoutDays)
          })
          return checkPeriods.length > 0
        })
      setIndicators(filterIndicators)
      setSelected(filterIndicators[0])
    }
  }, selected)

  const handleSelectIndicator = (indicator) => {
    setSelected(indicator)
    setMobilePage(1)
  }
  const addUpdateToPeriod = (update, period, indicator) => {
    const indIndex = indicators.findIndex(it => it.id === indicator.id)
    const prdIndex = indicators[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(indicators)
    updated[indIndex].periods[prdIndex].updates = [update, ...updated[indIndex].periods[prdIndex].updates]
    setIndicators(updated)
    setSelected(updated[indIndex])
    // update root data
    const _results = cloneDeep(results)
    const _period = _results.find(it => it.id === indicator.resultId)
      ?.indicators.find(it => it.id === indicator.id)
      ?.periods.find(it => it.id === period.id)
    if (_period) {
      _period.updates = [update, ..._period.updates]
      setResults(_results)
    }
    setRecentIndicators([...recentIndicators, indicator.id])
  }
  const patchUpdateInPeriod = (update, period, indicator) => {
    const indIndex = indicators.findIndex(it => it.id === indicator.id)
    const prdIndex = indicators[indIndex].periods.findIndex(it => it.id === period.id)
    const updIndex = indicators[indIndex].periods[prdIndex].updates.findIndex(it => it.id === update.id)
    const updated = cloneDeep(indicators)
    updated[indIndex].periods[prdIndex].updates = [...updated[indIndex].periods[prdIndex].updates.slice(0, updIndex), update, ...updated[indIndex].periods[prdIndex].updates.slice(updIndex + 1)]
    setIndicators(updated)
    setSelected(updated[indIndex])
    // update root data
    const _results = cloneDeep(results)
    const _update = _results.find(it => it.id === indicator.resultId)
      ?.indicators.find(it => it.id === indicator.id)
      ?.periods.find(it => it.id === period.id)
      ?.updates.find(it => it.id === update.id)
    if (_update) {
      Object.keys(update).forEach(prop => {
        _update[prop] = update[prop]
      })
      setResults(_results)
    }
    setRecentIndicators([...recentIndicators, indicator.id])
  }
  const editPeriod = (period, indicator) => {
    const indIndex = indicators.findIndex(it => it.id === indicator.id)
    const prdIndex = indicators[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(indicators)
    updated[indIndex].periods[prdIndex] = period
    setIndicators(updated)
    setSelected(updated[indIndex])
  }
  const mobileGoBack = () => {
    setMobilePage(0)
  }

  if (indicators.length === 0 && (!selected || selected === undefined)) return <div className="empty">{t('No submission due')}</div>
  const periodsNeedSubmission = indicators.reduce((acc, val) => [...acc, ...val.periods.filter(period => isPeriodNeedsReporting(period, needsReportingTimeoutDays))], [])
  const showUpdatesToSubmit = !mneView && periodsNeedSubmission.length > 3
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  return (
    <div className={classNames('enumerator-view', { mneView, showUpdatesToSubmit, jwtView })}>
      {showUpdatesToSubmit && <div className="updates-to-submit">{periodsNeedSubmission.length} updates to submit</div>}
      <MobileSlider page={mobilePage}>
        <div>
          <header className="mobile-only">
            <h1>{title}</h1>
          </header>
          <ul className="indicators">
            {indicators.map((indicator, indexKey) => {
              const checkedPeriods = indicator.periods.filter(period => {
                return (!isPeriodNeedsReporting(period, needsReportingTimeoutDays) && !isPreview)
              })
              const containsDeclined = indicator.periods.filter(period => period.updates.filter(update => update.status === 'R').length > 0).length > 0
              const checked = checkedPeriods.length === indicator.periods.length
              if (checked && recentIndicators.indexOf(indicator.id) === -1) return null
              return (
                <li key={indexKey} className={classNames({ selected: selected === indicator, declined: containsDeclined })} onClick={() => handleSelectIndicator(indicator)}>
                  <div className="check-holder">
                    <div className={classNames('check', { checked })}>
                      {checked && <Icon type="check" />}
                    </div>
                  </div>
                  <h5>{indicator.title}</h5>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="content">
          {selected && [
            <header className="mobile-only">
              <Button icon="left" type="link" size="large" onClick={mobileGoBack} />
              <div>
                <h2>{selected.title}</h2>
                <p className="desc">
                  {mdOutput(mdParse(selected?.description))}
                </p>
              </div>
            </header>,
            <details open>
              <summary>{t('Description')}</summary>
              <p className="desc hide-for-mobile">{mdOutput(mdParse(selected?.description))}</p>
            </details>,
            <Collapse activeKey={activeKey} onChange={ev => setActiveKey(ev)} destroyInactivePanel className={classNames({ webform: jwtView, mneView })}>
              {selected.periods.map(period =>
                <AddUpdate period={period} key={period.id} indicator={selected} {...{ addUpdateToPeriod, patchUpdateInPeriod, editPeriod, period, isPreview, mneView }} />
              )}
            </Collapse>
          ]}
        </div>
      </MobileSlider>
    </div>
  )
}

const AddUpdate = ({ period, indicator, addUpdateToPeriod, patchUpdateInPeriod, editPeriod, isPreview, mneView, ...props }) => {
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
  const updateForRevision = period.updates[0]?.status === 'R' ? period.updates[0] : null

  const handleSubmit = (values) => {
    if (values.value === '') delete values.value
    const payload = {
      ...values,
      // status: mneView ? 'A' : 'P',
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
    setSubmitting(true)
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
  const disableInputs = submittedUpdate != null && draftUpdate == null
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={
        fullDraftUpdate ?
          { ...fullDraftUpdate, note: fullDraftUpdate?.comments[0]?.comment }
          :
          fullPendingUpdate ?
            { ...fullPendingUpdate, note: fullPendingUpdate.reviewNote === '' ? fullPendingUpdate?.comments[0]?.comment : fullPendingUpdate.reviewNote }
            :
            initialValues.current
      }
      render={({ form }) => {
        return [
          <Panel {...props} header={[
            <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
            (submittedUpdate && !draftUpdate) ? <div className="submitted"><Icon type="check" /> {t('Submitted')}</div> :
              <FormSpy subscription={{ values: true }}>
                {({ values }) => {
                  let disabled = true
                  if (indicator.type === 1) {
                    if (values.value !== '' && String(Number(values.value)) !== 'NaN') disabled = false
                  } else {
                    if (values.narrative != null && values.narrative.length > 3) disabled = false
                  }
                  return [
                    <div className="rightside">
                      {submitting && <Spin indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />} />}
                      <Button type="ghost" disabled={disabled || submitting || (submittedUpdate != null && draftUpdate == null) || isPreview} onClick={handleSubmitClick('D')}>Save draft</Button>
                      <Button type="primary" disabled={disabled || submitting || (submittedUpdate != null && draftUpdate == null) || isPreview} onClick={handleSubmitClick(mneView ? 'A' : 'P')}>{t('Submit')}</Button>
                    </div>
                  ]
                }}
              </FormSpy>
          ]}
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
              {draftUpdate ? [
                <div className="submitted draft">
                  <b>{t('Draft from')}</b><span>{moment(draftUpdate.createdAt).format('DD/MM/YYYY')}</span>
                </div>
              ] :
                (recentUpdate) ? [
                  <div className="submitted">
                    <b>{t('Submitted')}</b><span>{moment(recentUpdate.lastModifiedAt).format('DD/MM/YYYY')}</span>
                  </div>
                ] : (pendingUpdate && pendingUpdate.status === 'P') && [
                  <div className="submitted">
                    <b>{t('Submitted')}</b><span>{moment(pendingUpdate.lastModifiedAt).format('DD/MM/YYYY')}</span><i>{t('Pending approval')}</i>
                  </div>
                ]}
              {updateForRevision && <DeclinedStatus {...{ updateForRevision, t }} />}
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
                          return (
                            <FinalField
                              name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].value`}
                              control="input-number"
                              withLabel
                              dict={{ label: dsg.value }}
                              min={-Infinity}
                              step={1}
                              disabled={disableInputs}
                            />
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
                            if (item.value) {
                              if (!dsgGroups[item.category]) dsgGroups[item.category] = 0
                              dsgGroups[item.category] += item.value
                            }
                          })
                          if (Object.keys(dsgGroups).length > 0) {
                            const calcTotal = Object.keys(dsgGroups).reduce((acc, key) => dsgGroups[key] > acc ? dsgGroups[key] : acc, 0)
                            const fieldName = indicator.measure === '1' ? 'value' : 'numerator'
                            if (calcTotal > 0) {
                              form.change(fieldName, calcTotal)
                            }
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
                          render={({ input }) => <ScoreCheckboxes scores={indicator.scores} {...input} />}
                        />
                      ),
                      <h5>{t('Your new update')}</h5>,
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


const DeclinedStatus = ({ updateForRevision, t }) => {
  const [update, loading] = useFetch(`/indicator_period_data_framework/${updateForRevision.id}/`)
  return [
    <div className="declined">
      <div>
        <b className="status">{t('Declined')}</b><span>{moment(updateForRevision.lastModifiedAt).format('DD/MM/YYYY')}</span><i>{t('Returned for revision')}</i>
      </div>
      {loading && <div><Spin indicator={<Icon type="loading" style={{ fontSize: 21 }} spin />} /></div>}
      {update && update.reviewNote && [
        <div>
          <b>{t('Reason')}</b>
          <p>{update.reviewNote}</p>
        </div>
      ]}
    </div>
  ]
}

const PrevUpdate = ({ update, period, indicator }) => {
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const { t } = useTranslation()
  if (!update) return null
  const dsgGroups = {}
  update.disaggregations.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
    if (period.disaggregationTargets.length > 0) {
      const target = period.disaggregationTargets.find(it => it.typeId === item.typeId)
      if (target != null) dsgGroups[item.category][dsgGroups[item.category].length - 1].targetValue = target.value
    }
  })
  const dsgKeys = Object.keys(dsgGroups)
  return (
    <div className="prev-value-holder">
      <div className="prev-value">
        <h5>{t('previous value update')}</h5>
        {update.status === 'A' && <div className="status approved"><SVGInline svg={statusApproved} /> Approved</div>}
        {update.status === 'R' && <div className="status returned">Returned for revision</div>}
        {update.status === 'P' && <div className="status pending"><SVGInline svg={statusPending} /> Pending</div>}
        <div className="date">{moment(update.createdAt).format('DD MMM YYYY')}</div>
        <div className="author">{update.userDetails.firstName} {update.userDetails.lastName}</div>
        {indicator.type === 2 ? [
          <div className="narrative">
            <ShowMoreText lines={7}>
              <p dangerouslySetInnerHTML={{ __html: update.narrative.replace(/\n/g, '<br />') }} />
            </ShowMoreText>
          </div>
        ] : [
          <div>
            {indicator.measure === '1' &&
              <div>
                <div className="value">
                  {nicenum(update.value)}
                </div>
                {(period.targetValue && dsgKeys.length === 0) ? [
                  <div className="target-cap">{(Math.round(((period.updates.reduce((acc, val) => acc + val.value, 0)) / period.targetValue) * 100 * 10) / 10)}% of target reached</div>
                ] : null}
                {dsgKeys.map(dsgKey => [
                  <div className="dsg-group">
                    <div className="h-holder">
                      <h5>{dsgKey}</h5>
                    </div>
                    <ul>
                      {dsgGroups[dsgKey].map((dsg) => [
                        <li>
                          <div className="label">{dsg.type}</div>
                          <div>
                            <b>{nicenum(dsg.value)}</b>
                            {dsg.targetValue && <b> ({Math.round(((dsg.value / dsg.targetValue) * 100 * 10) / 10)}%)</b>}
                          </div>
                        </li>
                      ])}
                    </ul>
                  </div>
                ])}
              </div>
            }
            {indicator.measure === '2' &&
              [
                <div className="value-holder">
                  <div>
                    <div className="value">
                      {(Math.round((update.numerator / update.denominator) * 100 * 10) / 10)}%
                    </div>
                    <div className="target-cap">{(Math.round((update.value / period.targetValue) * 100 * 10) / 10)}% of target</div>
                  </div>
                  <div className="breakdown">
                    <div className="cap">{t('Numerator')}</div>
                    <b>{update.numerator}</b>
                    <div className="cap num">{t('Denominator')}</div>
                    <b>{update.denominator}</b>
                  </div>
                </div>,
              ]
            }
          </div>
        ]}
      </div>
      {period.updates.length > 1 &&
        <div className="all-submissions-btn-container">
          <Button type="link" onClick={() => setShowSubmissionsModal(true)}>See all submissions</Button>
        </div>
      }
      <AllSubmissionsModal period={period} visible={showSubmissionsModal} onCancel={() => setShowSubmissionsModal(false)} />
    </div>
  )
}

const AllSubmissionsModal = ({ visible, onCancel, period }) => {
  let width = 460
  if (period.disaggregations) {
    width += period.disaggregations.length * 100
  }
  if (width > document.body.clientWidth - 100) {
    width = document.body.clientWidth - 100
  }
  return (
    <Modal {...{ visible, onCancel, width }} title="Period latest submissions" footer={null} className="all-submissions-modal">
      <table>
        {period.updates.map(update => {
          const dsgGroups = {}
          update.disaggregations.forEach(item => {
            if (!dsgGroups[item.category]) dsgGroups[item.category] = []
            dsgGroups[item.category].push(item)
            if (period.disaggregationTargets.length > 0) {
              const target = period.disaggregationTargets.find(it => it.typeId === item.typeId)
              if (target != null) dsgGroups[item.category][dsgGroups[item.category].length - 1].targetValue = target.value
            }
          })
          const dsgKeys = Object.keys(dsgGroups)
          return (
            <tr>
              <td>
                <div className="svg-text">
                  <SVGInline svg={update.status === 'A' ? statusApproved : update.status === 'P' ? statusPending : statusRevision} />
                  <div className="text">
                    {update.userDetails.firstName} {update.userDetails.lastName}
                    <span className="date">{moment(update.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </td>
              <td className="spacer">&nbsp;</td>
              {dsgKeys.map(dsgKey => [
                <td>
                  <div className="dsg-group">
                    <div className="h-holder">
                      <h5>{dsgKey}</h5>
                    </div>
                    <ul>
                      {dsgGroups[dsgKey].map((dsg) => [
                        <li>
                          <div className="label">{dsg.type}</div>
                          <div>
                            <b>{nicenum(dsg.value)}</b>
                            {dsg.targetValue && <b> ({Math.round(((dsg.value / dsg.targetValue) * 100 * 10) / 10)}%)</b>}
                          </div>
                        </li>
                      ])}
                    </ul>
                  </div>
                </td>
              ])}
              <td>
                <div className="value">{nicenum(update.value)}</div>
              </td>
            </tr>
          )
        }
        )}
      </table>
    </Modal>
  )
}

const MobileSlider = ({ children, page }) => {
  if (document.body.clientWidth > 768) {
    return children
  }
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(0px)' }))
  useEffect(() => {
    xset({ transform: `translateX(${page * -document.body.clientWidth}px)`, config: { tension: 240, friction: 29 } })
  }, [page])
  return [
    <animated.div style={xprops} className="slider-container">
      {children}
    </animated.div>
  ]
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Enumerator)
