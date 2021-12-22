/* eslint-disable no-shadow */
/* global window, FormData */
import React, { useState, useRef } from 'react'
import { Row, Col, Button, Typography } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import humps from 'humps'

import api, { config } from '../../../utils/api'
import { dateTransform } from '../../../utils/misc'

import ReportedForm from './ReportedForm'

const { Text } = Typography

const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}
const ReportedEdit = ({
  submitRef,
  editing,
  editPeriod,
  deletePendingUpdate,
  deleteFile,
  setActiveKey,
  setSubmitting,
  handleOnUpdate
}) => {
  const { t } = useTranslation()
  const [fileSet, setFileSet] = useState([])
  const formRef = useRef()

  const disaggregations = []
  if (editing?.indicator) {
    editing?.indicator.dimensionNames && editing?.indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }
  const defaultFileList = editing
    ?.fileSet
    ?.map((a) => ({
      uid: a?.id,
      name: a?.file.split('/')?.filter((val, index, arr) => index === arr.length - 1)[0],
      status: 'done',
      url: a?.file,
      updateId: editing?.id
    }))

  const handleSubmit = (values) => {
    const { periodActualValue, file, fileUrl, photo, ...inputs } = values
    const payload = {
      ...inputs,
      period: values?.period.id,
      disaggregations: values
        ?.disaggregations
        ?.filter(it => it.value || it.numerator || it.denominator)
        ?.map(it => ({ ...it, dimensionValue: it.typeId }))
    }
    api
      .patch(`/indicator_period_data_framework/${editing.id}/`, payload)
      .then(({ data: update }) => {
        const resolveUploads = (comment = null) => {
          if (comment) {
            update = { ...update, comments: [comment, ...update.comments] }
          }
          if (fileSet.length) {
            const urlParams = new URLSearchParams(window.location.search)
            const formData = new FormData()
            fileSet.forEach(file => {
              formData.append('files', file)
            })
            axios
              .post(`${config.baseURL}/indicator_period_data/${update.id}/files/?rt=${urlParams.get('rt')}`, formData, axiosConfig)
              .then(({ data }) => {
                update = { ...update, fileSet: data }
                handleOnUpdate(update)
              })
          } else {
            handleOnUpdate(update)
          }
        }
        if (values.note && values?.note?.trim().length) {
          api.post('/indicator_period_data_comment/', {
            data: update.id,
            comment: values.note
          }).then(({ data: comment }) => {
            resolveUploads(comment)
          })
        } else {
          resolveUploads()
        }
        setTimeout(() => {
          setSubmitting(false)
          setActiveKey(null)
        }, 500)
      }).catch(() => {
        setSubmitting(false)
        setActiveKey(null)
      })
  }

  const handleSubmitClick = (status) => (e) => {
    e.stopPropagation()
    formRef.current.form.change('status', status)
    formRef.current.form.submit()
    setSubmitting(true)
  }
  return (
    <div className="enumerator-view mneView">
      <div className="content pending-approval">
        <Row style={{ marginBottom: 10 }} type="flex" justify="end" align="top" gutter={[8, 8]}>
          <Col span={2}>
            <Button type="link" onClick={() => setActiveKey(null)} block>
              <Text type="secondary">{t('Cancel')}</Text>
            </Button>
            <button type="button" onClick={handleSubmitClick('P')} ref={submitRef} style={{ opacity: 0 }} />
          </Col>
          <Col span={2}>
            <Button type="link" onClick={() => deletePendingUpdate(editing)} block>
              <Text type="danger" strong>{t('Delete')}</Text>
            </Button>
          </Col>
        </Row>
        <FinalForm
          ref={(ref) => { formRef.current = ref }}
          onSubmit={handleSubmit}
          subscription={{}}
          initialValues={editing}
          render={({ form }) => {
            return (
              <ReportedForm
                {...{
                  form,
                  fileSet,
                  editPeriod,
                  setFileSet,
                  disaggregations,
                  period: editing?.period,
                  indicator: editing?.indicator,
                  submittedUpdate: null,
                  updateForRevision: null,
                  currentActualValue: null,
                  disableInputs: false,
                  updateLabel: null,
                  mneView: true,
                  init: editing,
                  deleteFile,
                  defaultFileList
                }}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default ReportedEdit
