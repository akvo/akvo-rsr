/* eslint-disable no-shadow */
/* global window, FormData */
import React, { useState, useEffect, useRef } from 'react'
import { Collapse, Button, Icon, Row, Col, Modal } from 'antd'
import { Form as FinalForm, FormSpy } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import humps from 'humps'
import moment from 'moment'

import api, { config } from '../../../utils/api'
import { dateTransform } from '../../../utils/misc'

import ReportedForm from './ReportedForm'
import ReportedView from './ReportedView'

const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const { Panel } = Collapse

const SaveButton = ({
  t,
  isPreview,
  indicator,
  submitting,
  draftUpdate,
  submittedUpdate,
  handleSubmitClick
}) => (
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
      return (
        <Button
          loading={submitting === 'D'}
          type="primary"
          disabled={isDisabled} onClick={handleSubmitClick('D')}
          block
        >
          {t('SAVE')}
        </Button>
      )
    }}
  </FormSpy>
)

const Reported = ({
  edit,
  setEdit,
  period,
  indicator,
  addUpdateToPeriod,
  patchUpdateInPeriod,
  editPeriod,
  isPreview,
  mneView,
  deleteUpdate,
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
      setEdit(null)
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
      setEdit(null)
    })
  }

  const handleSubmitClick = (status) => (e) => {
    e.stopPropagation()
    formRef.current.form.change('status', status)
    formRef.current.form.submit()
    setSubmitting(status)
  }

  const handleOnDeleteUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update if you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        deleteUpdate(update, period.id, period?.indicator, indicator?.result)
        setEdit(null)
      }
    })
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

  const dsgGroups = {}
  init?.disaggregations?.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = { value: 0, numerator: 0, denominator: 0 }
    if (item.value) dsgGroups[item.category].value += item.value
    if (item.numerator) dsgGroups[item.category].numerator += item.numerator
    if (item.denominator) dsgGroups[item.category].denominator += item.denominator
  })
  const categories = Object.keys(dsgGroups)
  let amountValue = null
  if (categories.length > 0 && indicator.measure === '1') {
    amountValue = categories.reduce((acc, key) => dsgGroups[key].value > acc ? dsgGroups[key].value : acc, 0)
  }
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={init}
      render={({ form }) => {
        const updateLabel = draftUpdate
          ? draftUpdate : recentUpdate
            ? ({ ...recentUpdate, status: recentUpdate.status === 'A' ? 'A' : 'SR' }) : (pendingUpdate && pendingUpdate.status === 'P')
              ? pendingUpdate : null
        const updateClass = updateLabel?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
        return [
          <Panel
            {...props}
            header={(
              <>
                <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
                <>
                  {(props?.isActive && disableInputs) &&
                    (
                      <div className={`right-corner ${updateClass}`}>
                        <span><Icon type="check" /></span>
                        <span>{updateLabel?.status === 'A' ? t('Approved') : t('Submitted')}</span>
                      </div>
                    )}
                </>
              </>
            )}
            className={updateClass}
          >
            {init?.status && (
              <Row style={{ marginBottom: 10 }} type="flex" justify="end" align="top" gutter={[8, 8]}>
                <Col span={3}>
                  {edit && <Button className="text-uppercase" onClick={() => setEdit(null)} block>{t('Cancel')}</Button>}
                </Col>
                <Col span={3}>
                  {edit && (
                    <SaveButton
                      {...{
                        t,
                        isPreview,
                        indicator,
                        submitting,
                        draftUpdate,
                        submittedUpdate,
                        handleSubmitClick
                      }}
                    />
                  )}
                </Col>
                <Col md={{ span: 3, offset: 2 }} xs={6}>
                  {(!disableInputs && !edit) && <Button type="primary" className="text-uppercase" onClick={() => setEdit(period.id)} block>{t('Edit')}</Button>}
                  {(!disableInputs && edit) && <Button type="danger" className="text-uppercase" onClick={() => handleOnDeleteUpdate(init)} block>{t('Delete')}</Button>}
                </Col>
              </Row>
            )}
            {
              edit
                ? (
                  <ReportedForm
                    {...{
                      init,
                      form,
                      period,
                      indicator,
                      updateLabel,
                      disaggregations,
                      submittedUpdate,
                      updateForRevision,
                      currentActualValue,
                      disableInputs,
                      editPeriod,
                      setFileSet,
                      mneView,
                      fileSet,
                    }}
                  />
                ) : (
                  <ReportedView
                    {...{
                      init,
                      period,
                      indicator,
                      updateLabel,
                      disaggregations,
                      submittedUpdate,
                      updateForRevision,
                      amountValue,
                      editPeriod,
                      mneView
                    }}
                  />
                )
            }
          </Panel>
        ]
      }}
    />
  )
}

export default Reported
