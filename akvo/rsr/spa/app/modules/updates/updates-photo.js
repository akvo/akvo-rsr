/* eslint-disable no-unused-vars */
/* globals File */
import React, { useState, useEffect } from 'react'
import { Upload, message, Button, Modal } from 'antd'
import { getBase64 } from '../../utils/misc'


const UpdatesPhoto = ({
  handleOnDeletePhoto,
  onChange,
  value,
  fields,
  index,
  uid = null
}) => {
  const [fileList, setFileList] = useState([
    {
      uid,
      url: value,
    }
  ])
  const [preview, setPreview] = useState({
    visible: false,
    image: null
  })
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj, (res) => res)
    }
    setPreview({
      visible: true,
      image: file.url || file.preview
    })
  }
  const handleBeforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt10M = file.size / 1000000 < 10
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!')
    }
    if (isJpgOrPng && isLt10M) {
      onChange(file)
      getBase64(file, (res) => {
        setFileList([
          {
            ...fileList[0],
            url: res
          }
        ])
      })
    }
    return false
  }
  useEffect(() => {
    const isFile = value instanceof File
    if (!isFile) {
      setFileList([
        {
          ...fileList[0],
          uid,
          url: value
        }
      ])
    }
  }, [value])
  return (
    <>
      <Upload
        listType="picture"
        beforeUpload={handleBeforeUpload}
        fileList={fileList}
        onRemove={({ uid: photoID }) => handleOnDeletePhoto(photoID, fields, index)}
        onPreview={handlePreview}
      >
        <Button icon="upload">Upload</Button>
      </Upload>
      <Modal
        visible={preview.visible}
        footer={null}
        onCancel={() => {
          setPreview({
            image: null,
            visible: false
          })
        }}
      >
        <img src={preview.image} style={{ width: '100%' }} alt="preview" />
      </Modal>
    </>
  )
}

export default UpdatesPhoto
