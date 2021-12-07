/* eslint-disable no-shadow */
/* global window, FormData */
import React, { useState, useRef } from 'react'
import { Row, Col, Button, Divider } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import axios from 'axios'
import humps from 'humps'

import api, { config } from '../../../utils/api'
import { dateTransform } from '../../../utils/misc'

import ReportedForm from './ReportedForm'

const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}
const ReportedEdit = ({
  editing,
  editPeriod,
  onEditRedirect,
  deletePendingUpdate,
  updatePendingUpdate
}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
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

  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

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
          if (comment) update = { ...update, comments: [comment, ...update.comments] }
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
                updatePendingUpdate(update)
              })
          } else {
            updatePendingUpdate(update)
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
          onEditRedirect()
        }, 1000)
      }).catch(() => {
        setSubmitting(false)
        onEditRedirect()
      })
  }

  const handleSubmitClick = (status) => (e) => {
    e.stopPropagation()
    formRef.current.form.change('status', status)
    formRef.current.form.submit()
    setSubmitting(status)
  }
  return (
    <Row>
      <Col span={6} />
      <Col span={18}>
        <div className="enumerator-view mneView">
          <div className="content">
            <header>
              <div>
                <h4>{editing?.indicator?.title}</h4>
                <span className="desc">
                  {editing?.indicator?.description?.length > 0 && (
                    <details open>
                      <summary>{t('Description')}</summary>
                      <p className="desc hide-for-mobile">
                        {mdOutput(mdParse(editing.indicator?.description))}
                      </p>
                    </details>
                  )}
                </span>
              </div>
            </header>
            <Divider />
            <Row style={{ marginBottom: 10 }} type="flex" justify="end" align="top" gutter={[8, 8]}>
              <Col span={3}>
                <Button
                  className="text-uppercase"
                  onClick={() => onEditRedirect()}
                  block
                >
                  {t('Cancel')}
                </Button>
              </Col>
              <Col span={3}>
                <Button
                  loading={submitting === 'P'}
                  type="primary"
                  className="text-uppercase"
                  onClick={handleSubmitClick('P')}
                  block
                >
                  {t('Save')}
                </Button>
              </Col>
              <Col md={{ span: 3, offset: 2 }} xs={6}>
                <Button type="danger" className="text-uppercase" onClick={() => deletePendingUpdate(editing)} block>{t('Delete')}</Button>
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
                      init: editing
                    }}
                  />
                )
              }}
            />
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default ReportedEdit
