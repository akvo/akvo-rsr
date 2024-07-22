/* eslint-disable no-shadow */
/* globals window, FormData, File */
import React, { useState, useRef, useEffect } from 'react'
import {
  Typography,
  Button,
  Modal,
  Icon,
  Row,
  Col,
  Spin,
  message
} from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import humps from 'humps'
import { connect } from 'react-redux'

import UpdateItems from './UpdateItems'
import ReportedForm from '../../results-admin/components/ReportedForm'
import api, { config } from '../../../utils/api'
import { dateTransform } from '../../../utils/misc'
import * as actions from '../../results/actions'

const { Text } = Typography

const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const UpdatePeriod = ({
  role,
  project,
  period,
  indicator,
  updates,
  baseline,
  targetsAt,
  editPeriod,
  resultRdr,
  setResultState
}) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(null)
  const [fileSet, setFileSet] = useState([])
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [deletion, setDeletion] = useState([])
  const [deleting, setDeleting] = useState(false)
  const formRef = useRef()

  const disaggregations = (editing && indicator?.dimensionNames)
    ? indicator.dimensionNames.map(group => group
      ?.dimensionValues
      ?.map(dsg => ({
        category: group.name,
        type: dsg.value,
        typeId: dsg.id,
        groupId: group.id
      })))
      ?.flatMap((dsg) => dsg)
    : []

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

  const deleteFile = (file) => {
    setDeletion([
      ...deletion,
      file?.uid
    ])
  }

  const handleOnDelete = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update when you click OK',
      onOk() {
        setDeleting(true)
        api
          .delete(`/indicator_period_data_framework/${update.id}/`)
          .then(() => {
            const _results = resultRdr.map((r) => ({
              ...r,
              indicators: r.indicators
                ?.map((i) => ({
                  ...i,
                  periods: i?.periods
                    ?.map((p) => ({
                      ...p,
                      updates: p?.updates?.filter((u) => u.id !== update.id)
                    }))
                }))
            }))
            message.success('Update has been deleted!')
            setDeleting(false)
            setResultState(_results)
            setEditing(null)
          })
          .catch(() => {
            setEditing(null)
          })
      }
    })
  }

  const handleOnUpdate = (update) => {
    if (deletion.length) {
      update = {
        ...update,
        fileSet: update.fileSet.filter((f) => !deletion?.includes(f.id))
      }
      deletion.forEach((uid) => {
        api.delete(`/indicator_period_data/${update?.id}/files/${uid}/`)
      })
      setDeletion([])
    }
    const _results = resultRdr.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => ({
        ...i,
        periods: i.periods
          ?.map((p) => ({
            ...p,
            updates: p.updates.map((u) => (u.id === update.id) ? update : u)
          }))
      }))
    }))
    setResultState(_results)
  }

  const handleCancel = () => {
    setEditing(null)
    setDeletion([])
    setErrors([])
    formRef.current.form.setConfig('keepDirtyOnReinitialize', false)
    formRef.current.form.reset()
    formRef.current.form.setConfig('keepDirtyOnReinitialize', true)
  }

  const handleSubmit = (values) => {
    const { periodActualValue, file, fileUrl, photo, ...inputs } = values
    const payload = {
      ...inputs,
      period: period.id,
      disaggregations: values
        ?.disaggregations
        ?.map((it, ix) => ({
          ...it,
          dimensionValue: disaggregations[ix]?.typeId
        }))
    }
    api
      .patch(`/indicator_period_data_framework/${editing.id}/`, payload)
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
                  update = { ...update, fileSet: data }
                  handleOnUpdate(update)
                  setFileSet([])
                  setSubmitting(false)
                  setEditing(null)
                })
                .catch(() => {
                  setSubmitting(false)
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
        const newUploads = fileSet?.filter((f) => (f instanceof File)).length
        if (!newUploads) {
          setTimeout(() => {
            setSubmitting(false)
            setEditing(null)
          }, 500)
        }
      })
      .catch(({ response: { data } }) => {
        setSubmitting(false)
        setErrors(data)
      })
  }

  const handleOnClickSubmit = (status) => (e) => {
    e.stopPropagation()
    if (formRef.current) {
      formRef.current.form.change('status', status)
      formRef.current.form.submit()
      setSubmitting(status)
    }
  }

  useEffect(() => {
    if ((editing && editing?.fileSet?.length) && (!deletion.length && !fileSet.length)) {
      setFileSet(editing.fileSet)
    }
    if (!editing && fileSet.length) {
      setFileSet([])
    }
    if (!editing && errors.length) {
      setErrors([])
    }
  }, [editing, errors, fileSet])
  return editing
    ? (
      <div>
        <Spin tip={t('Deletion in progress...')} size="large" spinning={deleting}>
          <Row style={{ margin: 10 }} type="flex" justify="end" align="top">
            <Col span={12} className="text-right">
              <Button onClick={handleCancel} icon="close" disabled={(submitting)}>
                {t('Cancel')}
              </Button>
              <Button
                loading={submitting}
                onClick={handleOnClickSubmit(editing?.status)}
                style={{ margin: 10 }}
                disabled={(submitting)}
              >
                {t('Submit')}
              </Button>
            </Col>
          </Row>
          <Row id="rsr-form-container">
            <Col>
              <FinalForm
                ref={(ref) => { formRef.current = ref }}
                onSubmit={handleSubmit}
                subscription={{ values: true }}
                initialValues={editing}
                render={({ form }) => (
                  <ReportedForm
                    {...{
                      form,
                      errors,
                      project,
                      period,
                      indicator,
                      editPeriod,
                      setFileSet,
                      disaggregations,
                      mneView: true,
                      disableInputs: (submitting),
                      fileSet: files,
                      init: editing,
                      deleteFile
                    }}
                  />
                )}
              />
            </Col>
          </Row>
          <div style={{ padding: 15 }}>
            <Button onClick={() => handleOnDelete(editing)} disabled={(submitting)}>
              <Text type="danger" strong>{t('Delete')}</Text>
            </Button>
          </div>
        </Spin>
      </div>
    )
    : (
      <UpdateItems
        {...{
          role,
          period,
          indicator,
          updates,
          baseline,
          targetsAt,
          editPeriod,
          disaggregations,
          setEditing
        }}
      />
    )
}

export default connect(
  (({ resultRdr }) => ({ resultRdr })), actions
)(UpdatePeriod)
