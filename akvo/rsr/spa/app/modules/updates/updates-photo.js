/* eslint-disable no-unused-vars */
/* globals File */
import React, { useState, useEffect } from 'react'
import { Upload, Icon, message } from 'antd'
import { getBase64 } from '../../utils/misc'


const UploadButton = () => (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
)

const UpdatesPhoto = ({handleSetPhotos, onChange, value}) => {
  const [imageUrl, setImageUrl] = useState('')
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
      handleSetPhotos(file)
      onChange(file)
      getBase64(file, setImageUrl)
    }
    return false
  }
  useEffect(() => {
    const isFile = value instanceof File
    if (!isFile) {
      setImageUrl(value)
    }
  }, [value])
  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={handleBeforeUpload}
    >
      {imageUrl ? <img src={imageUrl} alt="updates preview" style={{ width: '100%' }} /> : <UploadButton />}
    </Upload>
  )
}

export default UpdatesPhoto
