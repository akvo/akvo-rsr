/* eslint-disable no-unused-vars */
/* global window, FormData, File */
import React, { useEffect, useState, useRef } from 'react'
import { Input, Form, Button, Select, DatePicker, Icon, Spin, Modal } from 'antd'
import { useCurrentPosition } from 'react-use-geolocation'
import moment from 'moment'
import axios from 'axios'
import humps from 'humps'
import { diff } from 'deep-object-diff'
import { isEmpty, findIndex } from 'lodash'
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
const emptyFormValues = {
  language: 'en',
  eventDate: moment(),
  photos: []
}
const makeFormData = (payload) => {
  const formData = new FormData()
  Object.keys(payload).forEach(key => {
    formData.append(key, payload[key] || '')
  })
  return formData
}
const makePostPhotoRequest = (item, photo) => {
  const photoForm = makeFormData(photo)
  return axios.post(`${config.baseURL}/project_update/${item.id}/photos/`, photoForm, axiosConfig)
}
const makePatchPhotoRequest = (photo) => {
  const {id, update, ...payload} = photo
  const photoForm = makeFormData(payload)
  return axios.patch(`${config.baseURL}/project_update/${update}/photos/${id}/`, photoForm, axiosConfig)
}

const Updates = ({ projectId }) => {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(-1)
  const [render, setRender] = useState(true)
  const newUpdateRef = useRef()
  const formRef = useRef()
  const [updates, setUpdates] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [position, posError] = useCurrentPosition()
  const [validationErrors, setValidationErrors] = useState([])
  const [initialValues, setInitialValues] = useState(emptyFormValues)
  const [preload, setPreload] = useState(true)

  const handleFormReset = () => {
    formRef.current.form.reset()
    setValidationErrors([])
    setEditing(-1)
    setInitialValues(emptyFormValues)
  }

  const handleFormErrors = (err) => {
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
  }

  const handleEditItem = async (input, initial) => {
    const {photos: inputPhotos, ...inputValues} = input
    const {photos: initialPhotos, ...initialValues} = initial
    const {photo: diffPhoto, ...diffValues} = diff(initialValues, {...inputValues, eventDate: inputValues.eventDate.format('DD/MM/YYYY')})
    const currentPhotos = inputPhotos.filter(photo => photo.hasOwnProperty('id'))
    const diffCurrentPhotos = currentPhotos.map(photo => {
      const initialPhoto = initialPhotos.find(it => it.id === photo.id)
      const diffProps = diff(initialPhoto, photo)
      return isEmpty(diffProps) ? {} : {id: initialPhoto.id, update: initialPhoto.update, ...diffProps}
    }).filter(it => !isEmpty(it))
    const additionalPhotos = inputPhotos.filter(it => !it.hasOwnProperty('id') && it.photo && it.photo instanceof File)
    let result = {...initial}
    try {
      if (!isEmpty(diffValues) || (diffPhoto instanceof File)) {
        const payload = humps.decamelizeKeys({
          ...diffValues,
          project: projectId,
          eventDate: inputValues.eventDate?.format('YYYY-MM-DD')
        })
        const formData = makeFormData(payload)
        if (diffPhoto instanceof File) {
          formData.append('photo', diffPhoto)
        }
        const {data} = await axios.patch(`${config.baseURL}/project_update/${result.id}/`, formData, axiosConfig)
        result = {...result, ...data}
      }
      let bulkRequest = []
      if (diffCurrentPhotos.length > 0) {
        bulkRequest = [...bulkRequest, ...diffCurrentPhotos.map(makePatchPhotoRequest)]
      }
      if (additionalPhotos.length > 0) {
        bulkRequest = [...bulkRequest, ...additionalPhotos.map(photo => makePostPhotoRequest(result, photo))]
      }
      if (bulkRequest.length > 0) {
        const responses = await Promise.all(bulkRequest)
        const updatedPhotos = responses.map(({data}) => data).reduce(
          (all, current) => {
            const index = findIndex(all, { id: current.id })
            return index === -1 ? [...all, current] : [...all.slice(0, index), current, ...all.slice(index + 1)]
          },
          initialPhotos
        )
        result = {...result, photos: updatedPhotos}
      }
    } catch (err) {
      handleFormErrors(err)
      result = null
    }
    return result
  }

  const handleCreateItem = async (values) => {
    const { photos, photo, ...inputValues } = values
    const payload = humps.decamelizeKeys({
      ...inputValues,
      project: projectId,
      eventDate: inputValues.eventDate?.format('YYYY-MM-DD')
    })
    const inputPhotos = photos.filter(it => !isEmpty(it) && it.photo && it.photo instanceof File)
    const formData = makeFormData(payload)
    if (photo instanceof File) {
      formData.append('photo', photo)
    }
    if (position) {
      formData.append('latitude', position.coords.latitude)
      formData.append('longitude', position.coords.longitude)
    }
    let result = null
    try {
      const {data} = await axios.post(`${config.baseURL}/project_update/`, formData, axiosConfig)
      if (inputPhotos.length > 0) {
        const massUploads = inputPhotos.map(photo => makePostPhotoRequest(data, photo))
        const responses = await Promise.all(massUploads)
        data.photos = responses.map(({data}) => data)
      }
      result = data
    } catch (err) {
      handleFormErrors(err)
      result = null
    }
    return result
  }

  const handleOnSubmit = async (values) => {
    if (editing !== -1) {
      const item = await handleEditItem(values, updates[editing])
      if (item) {
        setUpdates((state) => [...state.slice(0, editing), item, ...state.slice(editing + 1)])
        handleFormReset()
      }
    } else {
      const item = await handleCreateItem(values)
      if (item) {
        setUpdates(state => [item, ...state])
        handleFormReset()
      }
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
              {update.photo && <img src={`${update.photo}`} />}
              <h5>{update.title}</h5>
              {update.eventDate && <span className="date">{moment(update.eventDate, 'DD/MM/YYYY').format('DD MMM YYYY')}</span>}
              <Exerpt text={update.text} max={400} />
              <div className="btns">
                <a href={update.absoluteUrl} target="_blank" rel="noopener noreferrer"><Button type="link">View</Button></a>
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
              ref={ref => { formRef.current = ref }}
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
                  <Item {...getValidateStatus('title')} className="title-item" label={(
                    <>
                      Title <small style={{ fontStyle: 'italic', color: 'red' }}>(required)</small>
                    </>
                  )}
                  >
                    <Field name="title" render={({ input }) => <Input placeholder="Title" {...input} />} />
                  </Item>
                  <Item {...getValidateStatus('text')} label="Description">
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
                  <Item className="title-item" label="Main photo" {...getValidateStatus('photo')}>
                    <Field name="photo" render={({ input }) => <UpdatesPhoto {...input} />} />
                  </Item>
                  <Item className="title-item">
                    <Field name="photoCaption" placeholder="Main photo caption" component="input" className="ant-input" />
                  </Item>
                  <Item className="title-item">
                    <Field name="photoCredit" placeholder="Main photo credit" component="input" className="ant-input" />
                  </Item>
                  <Item label="Additional photos" {...getValidateStatus('photos')}>
                    <FieldArray name="photos">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name}>
                            <div style={{ float: 'left' }}>
                              <Field
                                name={`${name}.photo`}
                                render={({ input }) => <UpdatesPhoto {...input} />}
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
                  {editing !== -1 && <Button htmlType="button" type="link" onClick={handleFormReset}>Cancel</Button>}
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
