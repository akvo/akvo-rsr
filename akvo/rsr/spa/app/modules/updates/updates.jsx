/* global window */
import React, { useEffect, useState, useRef } from 'react'
import { Input, Form, Button, Select, DatePicker, Icon, Upload, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCurrentPosition } from 'react-use-geolocation'
import moment from 'moment'
import axios from 'axios'
import humps from 'humps'
import { diff } from 'deep-object-diff'
import { Form as FinalForm, Field } from 'react-final-form'
import InfiniteScroll from 'react-infinite-scroller'
import api, { config } from '../../utils/api'
import { dateTransform } from '../../utils/misc'
import './styles.scss'
import RTE from '../../utils/rte'

// urlPrefix is used to show locally the images from production
const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1
const urlPrefix = isLocal ? 'http://rsr.akvo.org' : ''
const {Item} = Form
const {Option} = Select
const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const Updates = ({projectId}) => {
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(-1)
  const [render, setRender] = useState(true)
  const formRef = useRef()
  const newUpdateRef = useRef()
  const { t } = useTranslation()
  const [updates, setUpdates] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [position, posError] = useCurrentPosition()
  const [validationErrors, setValidationErrors] = useState([])
  useEffect(() => {
    api.get(`/project_update/?project=${projectId}`)
    .then(({data}) => {
      setUpdates(data.results)
      setHasMore(data.results.length < data.count)
      setLoading(false)
    })
  }, [])
  const handleUpdate = (values) => {
    const _values = {...values}
    if(_values.eventDate){
      _values.eventDate = _values.eventDate.format('DD/MM/YYYY')
    }
    const updatedValues = diff(updates[editing], _values)
    if(Object.keys(updatedValues).length > 0 || fileList.length > 0){
      const payload = humps.decamelizeKeys(updatedValues)
      if (updatedValues.eventDate != null) payload.event_date = values.eventDate.format('YYYY-MM-DD')
      const formData = new FormData() // eslint-disable-line
      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key])
      })
      if (fileList.length > 0) formData.append('photo', fileList[0])
      axios.patch(`${config.baseURL}/project_update/${updates[editing].id}/`, formData, axiosConfig)
        .then(({ data }) => {
          setSending(false)
          setUpdates((state) => {
            return [...state.slice(0, editing), data, ...state.slice(editing + 1)]
          })
          setEditing(-1)
          setFileList([])
          formRef.current.form.reset()
        })
        .catch((e) => {
          setSending(false)
          console.log(e.response)
          setError(true)
        })
    }
  }
  const handleSubmit = (values) => {
    if (editing !== -1) {
      handleUpdate(values)
      return
    }
    setSending(true)
    setValidationErrors([])
    const payload = humps.decamelizeKeys({ ...values, project: projectId })
    if (values.eventDate != null) payload.event_date = values.eventDate.format('YYYY-MM-DD')
    const formData = new FormData() // eslint-disable-line
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key])
    })
    if (position) {
      formData.append('latitude', position.coords.latitude)
      formData.append('longitude', position.coords.longitude)
    }
    if (fileList.length > 0) formData.append('photo', fileList[0])
    axios.post(`${config.baseURL}/project_update/`, formData, axiosConfig)
    .then(({ data }) => {
      setSending(false)
      setUpdates((state) => {
        return [data, ...state]
      })
      setFileList([])
      formRef.current.form.reset()
    })
    .catch((err) => {
      setSending(false)
      setError(true)
      const errors = []
      Object.keys(err.response.data).forEach(key => {
        errors.push({
          path: key,
          messages: err.response.data[key]
        })
      })
      setValidationErrors(errors)
      errors.forEach(error => {
        if(error.path === 'title'){
          newUpdateRef.current.scroll({ top: 0, behavior: 'smooth' })
        }
      })
    })
  }
  const handleDelete = (id, index) => () => {
    api.delete(`/project_update/${id}/`)
    setUpdates([...updates.slice(0, index), ...updates.slice(index + 1)])
  }
  let initialValues = { title: '', text: '', language: 'en' }
  if(editing !== -1){
    initialValues = { ...updates[editing] }
    if(updates[editing].eventDate){
      initialValues.eventDate = moment(updates[editing].eventDate, 'DD/MM/YYYY')
    }
  }
  const handleEdit = (index) => () => {
    setRender(false)
    setTimeout(() => {
      setEditing(index)
      setRender(true)
      setValidationErrors([])
    }, 50)
  }
  const handleCancel = () => {
    setEditing(-1)
    formRef.current.form.reset()
  }
  const showMore = (page) => {
    api.get('/project_update/', {
      project: projectId,
      page
    })
      .then(({ data }) => {
        setUpdates(state => {
          setHasMore(state.length + data.results.length < data.count)
          return [...state, ...data.results]
        })
      })
  }
  const getValidateStatus = (fieldName) => {
    if (!validationErrors) return {}
    const err = validationErrors.find(it => it.path === fieldName)
    const ret = {}
    if (err) {
      ret.validateStatus = 'error'
      if (err.messages) {
        ret.help = err.messages.map(msg => <div>{msg}</div>)
      }
    }
    return ret
  }
  return (
    <div className="updates-view">
      <ul className="updates">
        {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} /></div>}
        {!loading && updates.length === 0 && <h4 className="no-updates">No updates yet</h4>}
        <InfiniteScroll
          pageStart={1}
          loadMore={showMore}
          threshold={250}
          hasMore={hasMore}
          loader={<div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} /></div>}
        >
        {updates.map((update, index) =>
          <li>
            {update.photo && <img src={`${urlPrefix}${update.photo}`} />}
            <h5>{update.title}</h5>
            {update.eventDate && <span className="date">{moment(update.eventDate, 'DD/MM/YYYY').format('DD MMM YYYY')}</span>}
            <Exerpt text={update.text} max={400} />
            <div className="btns">
              <a href={update.absoluteUrl}><Button type="link">View</Button></a>
              {update.editable && ['  |  ', <Button type="link" disabled={editing === index} onClick={handleEdit(index)}>Edit</Button>]}
              {update.deletable && ['  |  ', <Button type="link" onClick={handleDelete(update.id, index)}>Delete</Button>]}
            </div>
          </li>
        )}
        </InfiniteScroll>
      </ul>
      <div className="new-update-container">
      {render &&
      <div className="new-update" ref={ref => { newUpdateRef.current = ref }}>
        {editing === -1 && <h2>Add an update</h2>}
        {editing !== -1 && <h2>Edit update</h2>}
        <FinalForm
          ref={(ref) => { formRef.current = ref }}
          onSubmit={handleSubmit}
          subscription={{}}
          initialValues={initialValues}
          render={() => (
          <Form layout="vertical">
            <Item {...getValidateStatus('title')} className="title-item">
              <Field name="title" component={({ input }) => <Input placeholder="Title" {...input} />} />
            </Item>
            <Item {...getValidateStatus('text')}>
              <Field name="text" component={({ input }) => <RTE placeholder="Description" {...input} />} />
            </Item>
            <Item label="Language">
              <Field name="language" component={({ input }) =>
              <Select {...input}>
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
              </Select>
              } />
            </Item>
            <Item label="Date" {...getValidateStatus('eventDate')}>
              <Field name="eventDate" component={({ input }) => <DatePicker {...input} format="DD/MM/YYYY" />} />
            </Item>
            <Item label="Photo">
              <Field name="photo" render={({ input }) => {
                if(input.value !== ''){
                  return (
                    <div className="uploaded-photo">
                      <img src={input.value} />
                      <Button type="link" onClick={() => { input.onChange('') }}>Change photo</Button>
                    </div>
                  )
                }
                return (
                  <Upload.Dragger
                    name="document"
                    listType="picture"
                    method="PATCH"
                    withCredentials
                    fileList={fileList}
                    beforeUpload={file => {
                      setFileList([file])
                      return false
                    }}
                    onSuccess={(item) => {
                    }}
                    onRemove={file => {
                      setFileList(state => {
                        const index = fileList.indexOf(file)
                        const newFileList = state.slice()
                        newFileList.splice(index, 1)
                        return newFileList
                      });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="picture" theme="twoTone" />
                    </p>
                    <p className="ant-upload-text">{t('Drag file here')}</p>
                    <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
                    <p><small>Max: 10MB</small></p>
                  </Upload.Dragger>
                )
              }} />
              <Field name="photoCaption" component={({ input }) => <Input placeholder="Photo caption" {...input} />} />
              <Field name="photoCredit" component={({ input }) => <Input placeholder="Photo credit" {...input} />} />
            </Item>
            <Item className="title-item" label="Video" {...getValidateStatus('video')}>
              <Field name="video" component={({ input }) => <Input placeholder="Video URL" {...input} />} />
            </Item>
            <Item className="title-item" {...getValidateStatus('videoCaption')}>
              <Field name="videoCaption" component={({ input }) => <Input placeholder="Video caption" {...input} />} />
            </Item>
            <Item {...getValidateStatus('videoCredit')}>
              <Field name="videoCredit" component={({ input }) => <Input placeholder="Video Credit" {...input} />} />
            </Item>
            <Button loading={sending} type="primary" size="large" onClick={() => formRef.current.form.submit()}>
              {editing === -1 ? 'Add an update' : 'Update'}
            </Button>
            {editing !== -1 && <Button type="link" onClick={handleCancel}>Cancel</Button>}
          </Form>
          )}
        />
      </div>
      }
      </div>
    </div>
  )
}

const Exerpt = ({text, max}) => {
  if(!text) return ''
  if(text.length <= max){
    return text
  }
  return `${text.substr(0, max)}...`
}

export default Updates
