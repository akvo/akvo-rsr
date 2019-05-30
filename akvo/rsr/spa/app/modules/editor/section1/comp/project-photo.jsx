/* globals FileReader */
import React from 'react'
import { connect } from 'react-redux'
import {
  Icon, Upload, Form, Button, Alert, Progress
} from 'antd'
import Cookies from 'js-cookie'

import InputLabel from '../../../../utils/input-label'

const { Item } = Form

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

class ProjectPhoto extends React.Component {
  state = {
    loading: false,
    error: '',
    uploadingError: false,
    imageUrl: '',
    percent: 0
  };

  handleChange = (info) => {
    console.log('change', info)
    if(info.hasOwnProperty('event')){
      this.setState({
        percent: info.event.percent
      })
    }
    if (info.file.status === 'uploading') {
      // this.setState({ loading: true })
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: true,
        })
        // this.props.editField('currentImage', imageUrl)
      })
      return
    }
    if(info.file.status === 'error'){
      this.setState({
        uploadingError: true
      })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 1000)
      // getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   // imageUrl,
      //   loading: false,
      // }))
    }
  }

  beforeUpload = (file) => {
    console.log('before upload', file)
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isImage) {
      this.setState({
        error: 'images-only'
      })
    } else if(!isLt2M) {
      this.setState({
        error: 'too-big'
      })
    } else {
      this.setState({
        error: ''
      })
    }
    return isImage && isLt2M
  }

  resetImage = () => {
    this.setState({
      imageUrl: ''
    })
  }

  render() {
    return (
      <Item label={<InputLabel tooltip="Add your project photo here. You can only add one photo. If you have more, you can add them via RSR updates when your project is published. A photo album will feature on the project page. The photo should not be larger than 2 MB in size, and should preferably be in JPG format.">Photo</InputLabel>}>
        {this.state.error &&
        <Alert type="error" message={this.state.error} style={{ marginBottom: 15 }} />
        }
        {this.state.imageUrl && (
          <div>
            <div className="uploaded-image">
              <img src={this.state.imageUrl} alt="" />
              {(this.state.loading || this.state.uploadingError) &&
              <div className="progress-overlay">
                <Progress type="circle" percent={this.state.percent} {...Object.assign({}, this.state.uploadingError ? { status: 'exception' } : {})} />
              </div>
              }
            </div>
            <Button onClick={this.resetImage}>Upload New Image</Button>
          </div>
        )}
        <div style={{ display: this.state.imageUrl === '' ? 'block' : 'none'}}>
        <Upload.Dragger
          showUploadList={false}
          name="file"
          listType="picture"
          action={`/rest/v1/project/${this.props.projectId}/upload_file/?format=json`}
          data={{field_id: `rsr_project.current_image.${this.props.projectId}`}}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          headers={{ 'X-CSRFToken': Cookies.get('csrftoken') }}
        >
          {this.state.loading && (
          <div>
            <p className="ant-upload-drag-icon">
              <Icon type="loading" />
            </p>
            <p className="ant-upload-text">Uploading...</p>
          </div>
          )}
          {!this.state.loading && (
          <div>
            <p className="ant-upload-drag-icon">
              <Icon type="picture" theme="twoTone" />
            </p>
            <p className="ant-upload-text">Drag file here</p>
            <p className="ant-upload-hint">or click to browse from computer</p>
          </div>
          )}
        </Upload.Dragger>
        </div>
      </Item>
    )
  }
}

export default ProjectPhoto
