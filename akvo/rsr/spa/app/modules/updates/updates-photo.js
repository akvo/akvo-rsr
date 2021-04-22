/* eslint-disable no-unused-vars */
import React from 'react'
import { Upload, Icon, message } from 'antd'
import { previewImage } from 'antd/lib/upload/utils'
import { getBase64 } from '../../utils/misc'

class UpdatesPhoto extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.value
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      this.props.handleSetPhotos([...this.props.photos, info.file.originFileObj])
      getBase64(info.file.originFileObj, imageUrl => {
        this.props.onChange(imageUrl)
        this.setState({
          imageUrl,
          loading: false,
        })
      })
    }
  }

  handleBeforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt10M = file.size / 1000000 < 10
    if (!isLt10M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt10M
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.imageUrl !== this.props.value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        imageUrl: this.props.value
      })
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const { imageUrl } = this.state
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleChange}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess('ok')
          }, 0)
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="updates preview" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    )
  }
}

export default UpdatesPhoto
