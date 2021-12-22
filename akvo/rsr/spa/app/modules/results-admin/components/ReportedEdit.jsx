/* eslint-disable no-shadow */
/* globals window, FormData, File */
import React, { useState } from 'react'
import { Row, Col, Button, Typography, Icon } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import axios from 'axios'
import humps from 'humps'
import moment from 'moment'

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
  formRef,
  editing,
  editPeriod,
  deletePendingUpdate,
  deleteFile,
  fileSet,
  setFileSet,
  setActiveKey,
  handleOnUpdate
}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const disaggregations = []
  if (editing?.indicator) {
    editing?.indicator.dimensionNames && editing?.indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }

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
              const isFile = file instanceof File
              if (isFile) {
                formData.append('files', file)
              }
            })
            if (formData.entries.length) {
              axios
                .post(`${config.baseURL}/indicator_period_data/${update.id}/files/?rt=${urlParams.get('rt')}`, formData, axiosConfig)
                .then(({ data }) => {
                  update = { ...update, fileSet: data }
                  handleOnUpdate(update)
                })
            } else {
              handleOnUpdate(update)
            }
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
      <div className="content">
        <Row style={{ marginBottom: 10 }} type="flex" justify="space-between" align="top" gutter={[8, 8]}>
          <Col span={18}>
            <div className="period-caption">
              {moment(editing?.period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(editing?.period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
            </div>
          </Col>
          <Col span={6} className="text-right">
            <Button loading={submitting} onClick={handleSubmitClick('P')}>
              <Text type="secondary">{t('Save')}</Text>
            </Button>
          </Col>
          <Col span={24}>
            <details open>
              <summary>{t('Description')}</summary>
              <p className="desc hide-for-mobile">{mdOutput(mdParse(editing?.indicator?.description))}</p>
            </details>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle" className="indicator-type">
          <Col span={24}>
            {
              editing?.indicator?.type === 2
                ? <b>{t('Qualitative')}</b>
                : editing?.indicator?.ascending ? <><Icon type="rise" /> <b>{t('Ascending')}</b></> : <><Icon type="fall" /> <b>{t('Descending')}</b></>
            }
          </Col>
        </Row>
        <FinalForm
          ref={(ref) => { formRef.current = ref }}
          onSubmit={handleSubmit}
          subscription={{ values: true }}
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
                  deleteFile
                }}
              />
            )
          }}
        />
        <div style={{ paddingTop: 15 }}>
          <Button onClick={() => deletePendingUpdate(editing)}>
            <Text type="danger" strong>{t('Delete')}</Text>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReportedEdit
