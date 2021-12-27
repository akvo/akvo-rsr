/* eslint-disable no-shadow */
/* globals window, FormData, File */
import React, { useState, useEffect } from 'react'
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
  activeKey,
  formRef,
  editing,
  editPeriod,
  deletePendingUpdate,
  deleteFile,
  deletion,
  errors,
  setErrors,
  setActiveKey,
  handleOnUpdate
}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [fileSet, setFileSet] = useState([])
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  const submitStatus = editing?.status === 'P' ? 'P' : 'A'

  const disaggregations = []
  if (editing?.indicator) {
    editing?.indicator.dimensionNames && editing?.indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }

  const files = fileSet
    ?.filter((f) => (f?.file || f instanceof File))
    ?.filter((f) => deletion.length ? !deletion.includes(f?.id) : f)
    ?.map((f) => ({
      ...f,
      uid: f?.uid || f?.id,
      name: f?.name || f?.file?.split('/')?.filter((val, index, arr) => index === arr.length - 1)[0],
      url: f?.file,
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
        ?.map((it, ix) => ({
          ...it,
          dimensionValue: disaggregations[ix]?.typeId
        }))
    }
    const requestApi = editing?.id
      ? api.patch(`/indicator_period_data_framework/${editing.id}/`, payload)
      : api.post('/indicator_period_data_framework/', payload)
    requestApi
      .then(({ data }) => {
        let update = { ...editing, ...data }
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
            if (!formData.entries().next().done) {
              axios
                .post(`${config.baseURL}/indicator_period_data/${update.id}/files/?rt=${urlParams.get('rt')}`, formData, axiosConfig)
                .then(({ data }) => {
                  setFileSet([])
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
      }).catch(({ response: { data } }) => {
        setSubmitting(false)
        setErrors(data)
      })
  }

  const handleSubmitClick = (status) => (e) => {
    e.stopPropagation()
    formRef.current.form.change('status', status)
    formRef.current.form.submit()
    setSubmitting(status)
  }
  useEffect(() => {
    if ((activeKey && editing?.fileSet?.length) && (!deletion.length && !fileSet.length)) {
      setFileSet(editing.fileSet)
    }
    if (!activeKey && fileSet.length) {
      setFileSet([])
    }
  }, [editing, activeKey, fileSet])
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
            <div style={{ display: 'flex', justifyContent: 'end', gap: 8 }}>
              {editing?.status !== 'P' && (
                <Button loading={submitting === 'D'} onClick={handleSubmitClick('D')}>
                  <Text type="secondary">{t('Save draft')}</Text>
                </Button>
              )}
              <Button loading={['P', 'A'].includes(submitting)} onClick={handleSubmitClick(submitStatus)}>
                <Text type="secondary">{t('Submit')}</Text>
              </Button>
            </div>
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
                  errors,
                  editPeriod,
                  setFileSet,
                  disaggregations,
                  fileSet: files,
                  period: editing?.period,
                  indicator: editing?.indicator,
                  disableInputs: false,
                  mneView: true,
                  init: editing,
                  deleteFile
                }}
              />
            )
          }}
        />
        {editing?.id && (
          <div style={{ paddingTop: 15 }}>
            <Button onClick={() => deletePendingUpdate(editing)}>
              <Text type="danger" strong>{t('Delete')}</Text>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportedEdit
