/* eslint-disable no-unused-vars */
/* global window, FormData */
import React, { useEffect, useState, useRef } from 'react'
import { Input, Form, Button, Select, DatePicker, Icon, Upload, Spin, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCurrentPosition } from 'react-use-geolocation'
import moment from 'moment'
import axios from 'axios'
import humps from 'humps'
import { diff } from 'deep-object-diff'
import { Form as FinalForm, Field } from 'react-final-form'
import InfiniteScroll from 'react-infinite-scroller'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import api, { config } from '../../utils/api'
import { dateTransform } from '../../utils/misc'
import './styles.scss'
import RTE from '../../utils/rte'
import UpdatesPhoto from './updates-photo'
import updatesSchema from './updates-validator'
import { validateFormValues } from '../../utils/validation-utils'

const { confirm } = Modal

// urlPrefix is used to show locally the images from production
const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1
const urlPrefix = isLocal ? 'http://rsr.akvo.org' : ''
const { Item } = Form
const { Option } = Select
const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const Updates = ({ projectId }) => {
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(-1)
  const [render, setRender] = useState(true)
  const newUpdateRef = useRef()
  const [updates, setUpdates] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [position, posError] = useCurrentPosition()
  const [validationErrors, setValidationErrors] = useState([])
  const [initialValues, setInitialValues] = useState({
    title: '',
    text: '',
    language: 'en',
    eventDate: moment(),
    video: '',
    video_caption: '',
    video_credit: '',
    photos: [
      {
        photo: '',
        caption: '',
        credit: ''
      }
    ]
  })
  const [preload, setPreload] = useState(true)

  useEffect(() => {
    if (preload && updates.length === 0) {
      setPreload(false)
      api.get(`/project_update/?project=${projectId}`)
        .then(({ data }) => {
          setUpdates(data.results)
          setHasMore(data.results.length < data.count)
          setLoading(false)
        })
    }
  })

  const handleCancel = () => {
    setValidationErrors([])
    setEditing(-1)
    setFileList([])
    setInitialValues({
      title: '',
      text: '',
      language: 'en',
      eventDate: moment(),
      video: '',
      video_caption: '',
      video_credit: '',
      photos: [
        {
          photo: '',
          caption: '',
          credit: ''
        }
      ]
    })
  }

  const handleUploadPhotos = async (latestItem, photos, isEditable = false) => {
    if (fileList.length > 0) {
      const axiosItems = []
      const filterPhotos = photos?.filter(item => item?.photo.indexOf('data:image/') >= 0)
      filterPhotos?.forEach((item, index) => {
        const photoForm = new FormData()
        photoForm.append('photo', fileList[index])
        photoForm.append('caption', item?.caption)
        photoForm.append('credit', item?.credit)
        axiosItems.push(axios.post(`${config.baseURL}/project_update/${latestItem.id}/photos/`, photoForm, axiosConfig))
      })
      await axios.all([...axiosItems])
        .then(axios.spread((...response) => {
          const dataPhotos = updates?.find(item => item.id === latestItem?.id)?.photos || []
          response.forEach(res => {
            dataPhotos.push(res?.data)
          })
          if (isEditable) {
            const updateItems = updates?.map(item => item?.id === latestItem?.id ? ({ ...latestItem, photos: dataPhotos }) : item)
            setUpdates(updateItems)
          } else {
            setUpdates([
              {
                ...latestItem,
                photos: dataPhotos
              },
              ...updates
            ])
          }
        }))
        .finally(() => {
          handleCancel()
        })
    } else {
      if (isEditable) {
        setUpdates((state) => {
          return [...state.slice(0, editing), latestItem, ...state.slice(editing + 1)]
        })
      }
      handleCancel()
    }
  }

  const handleUpdateExistingPhotos = async (latestItem, photos) => {
    const photoItems = []
    photos?.forEach(item => {
      if (item?.id > 0) {
        const captionForm = new FormData()
        captionForm.append('caption', item?.caption)
        captionForm.append('credit', item?.credit)
        photoItems.push(axios({
          url: `${config.baseURL}/project_update/${latestItem?.id}/photos/${item?.id}/`,
          method: 'PUT',
          data: captionForm,
          ...axiosConfig
        }))
      }
    })
    await axios.all([...photoItems])
      .then(axios.spread((...response) => {
        // TODO: update captions, credit each photo
      }))
  }

  const handleOnUpdateItem = async (formData, photos) => {
    await axios.patch(`${config.baseURL}/project_update/${updates[editing]?.id}/`, formData, axiosConfig)
      .then(({ data }) => {
        handleUpdateExistingPhotos(data, photos)
        /**
         * mass uploads
         */
        handleUploadPhotos(data, photos, true)
      })
      .catch((err) => {
        const errors = []
        Object.keys(err.response.data).forEach(key => {
          errors.push({
            path: key,
            messages: err.response.data[key]
          })
        })
        setValidationErrors(errors)
        errors.forEach(e => {
          if (e.path === 'title') {
            newUpdateRef.current.scroll({ top: 0, behavior: 'smooth' })
          }
        })
      })
  }

  const handleOnStoreItem = async (formData, photos) => {
    await axios.post(`${config.baseURL}/project_update/`, formData, axiosConfig)
      .then(({ data }) => {
        setUpdates((state) => {
          return [data, ...state]
        })
        /**
         * mass uploads
         */
        handleUploadPhotos(data, photos)
      })
      .catch((err) => {
        const errors = []
        Object.keys(err.response.data).forEach(key => {
          errors.push({
            path: key,
            messages: err.response.data[key]
          })
        })
        setValidationErrors(errors)
        errors.forEach(e => {
          if (e.path === 'title') {
            newUpdateRef.current.scroll({ top: 0, behavior: 'smooth' })
          }
        })
      })
  }

  const handleOnSubmit = async (values) => {
    const { photos, ...inputValues } = values
    const filterValues = editing !== -1 ? diff(updates[editing], inputValues) : inputValues
    const inputPhotos = photos.map(photo => photo?.credit ? photo : values?.id === undefined ? ({ ...photo, credit: '', caption: '' }) : ({ ...photo, credit: '', caption: '', update: values?.id }))
    const payload = humps.decamelizeKeys({ ...filterValues, project: projectId, eventDate: filterValues.eventDate ? filterValues.eventDate.format('YYYY-MM-DD') : filterValues.eventDate })
    const formData = new FormData()
    Object.keys(payload).forEach(key => {
      if (payload[key]) {
        formData.append(key, payload[key])
      }
    })
    if (fileList.length > 0) formData.append('photo', fileList[0])
    if (position) {
      formData.append('latitude', position.coords.latitude)
      formData.append('longitude', position.coords.longitude)
    }
    if (inputPhotos?.length > 0) {
      formData.append('photo_caption', inputPhotos[0]?.caption)
      formData.append('photo_credit', inputPhotos[0]?.credit)
    }
    if (editing !== -1) {
      await handleOnUpdateItem(formData, inputPhotos)
    } else {
      await handleOnStoreItem(formData, inputPhotos)
    }
  }

  const handleDelete = (id, index) => () => {
    api.delete(`/project_update/${id}/`)
    setUpdates([...updates.slice(0, index), ...updates.slice(index + 1)])
  }

  const handleEdit = (index) => () => {
    setRender(false)
    setInitialValues({
      ...updates[index],
      eventDate: updates[index]?.eventDate ? moment(updates[index].eventDate, 'DD/MM/YYYY') : moment(),
      photos: updates[index]?.photos?.length > 0
        ? updates[index]?.photos :
        [{
          photo: updates[index]?.photo,
          caption: updates[index]?.photoCaption,
          credit: updates[index]?.photoCredit,
        }]
    })
    setTimeout(() => {
      setEditing(index)
      setRender(true)
      setValidationErrors([])
    }, 50)
  }

  const handleOnDeletePhoto = (photoID, fields, index) => {
    confirm({
      title: 'Are you sure to delete this photo?',
      content: 'After this action you can\'t put it back',
      onOk() {
        if (photoID) {
          axios({
            url: `${config.baseURL}/project_update/${updates[editing]?.id}/photos/${photoID}/`,
            method: 'DELETE',
            ...axiosConfig
          })
          setUpdates((state) => {
            return [
              ...state.slice(0, editing),
              {
                ...updates[editing],
                photos: updates[editing]?.photos?.filter(photo => photo?.id !== photoID)
              },
              ...state.slice(editing + 1)
            ]
          })
        }
        fields.remove(index)
      }
    })
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
              onSubmit={handleOnSubmit}
              validate={validateFormValues(updatesSchema)}
              initialValues={initialValues}
              mutators={{ ...arrayMutators }}
              render={({
                handleSubmit,
                form: {
                  mutators: { push }
                },
                submitting, pristine, invalid
              }) => (
                <Form layout="vertical" onSubmit={handleSubmit}>
                  <Item {...getValidateStatus('title')} className="title-item">
                    <Field name="title" render={({ input }) => <Input placeholder="Title" {...input} />} />
                  </Item>
                  <Item {...getValidateStatus('text')}>
                    <Field
                      name="text"
                      render={({ input }) => <RTE placeholder="Description" {...input} />}
                    />
                  </Item>
                  <Item label="Language">
                    <Field name="language" component={({ input }) =>
                      <Select {...input}>
                        <Option value="en">English</Option>
                        <Option value="es">Spanish</Option>
                        <Option value="fr">French</Option>
                      </Select>
                    }
                    />
                  </Item>
                  <Item label="Date" {...getValidateStatus('eventDate')}>
                    <Field name="eventDate" render={({ input }) => <DatePicker {...input} format="DD/MM/YYYY" />} />
                  </Item>
                  <Item label="Photos" {...getValidateStatus('photo')}>
                    <FieldArray name="photos">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name}>
                            <div style={{ float: 'left' }}>
                              <Field
                                name={`${name}.photo`}
                                render={({ input }) => <UpdatesPhoto {...input} photos={fileList} handleSetPhotos={setFileList} />}
                              />
                              <Field
                                name={`${name}.caption`}
                                placeholder="Photo caption"
                                component="input"
                                className="ant-input"
                              />
                              <Field
                                name={`${name}.credit`}
                                placeholder="Photo credit"
                                component="input"
                                className="ant-input"
                              />
                            </div>
                            <div style={{ float: 'left', paddingLeft: 10 }}>
                              <Field
                                name={`${name}.id`}
                                render={({ input }) => <a onClick={() => handleOnDeletePhoto(input?.value, fields, index)}><Icon type="delete" /></a>}
                              />
                            </div>
                          </div>
                        ))
                      }
                    </FieldArray>
                    <div style={{ clear: 'both', textAlign: 'right', padding: 5 }}>
                      <Button onClick={() => push('photos', undefined)} shape="round" icon="plus" type="link">Add Photo</Button>
                    </div>
                  </Item>

                  <Item className="title-item" label="Video" {...getValidateStatus('video')}>
                    <Field name="video" render={({ input }) => <Input placeholder="Video URL" {...input} />} />
                  </Item>
                  <Item className="title-item" {...getValidateStatus('videoCaption')}>
                    <Field name="videoCaption" render={({ input }) => <Input placeholder="Video caption" {...input} />} />
                  </Item>
                  <Item {...getValidateStatus('videoCredit')}>
                    <Field name="videoCredit" render={({ input }) => <Input placeholder="Video Credit" {...input} />} />
                  </Item>
                  <Button
                    htmlType="submit"
                    loading={submitting}
                    type="primary"
                    size="large"
                    disabled={submitting || pristine || invalid}
                  >
                    {editing === -1 ? 'Add an update' : 'Update'}
                  </Button>
                  {editing !== -1 && <Button htmlType="button" type="link" onClick={handleCancel}>Cancel</Button>}
                </Form>
              )}
            />
          </div>
        }
      </div>
    </div>
  )
}

const Exerpt = ({ text, max }) => {
  if (!text) return ''
  if (text.length <= max) {
    return text
  }
  return `${text.substr(0, max)}...`
}

export default Updates
