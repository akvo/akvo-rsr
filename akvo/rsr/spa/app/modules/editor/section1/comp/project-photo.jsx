/* globals FileReader */
import React from 'react'
import {
  Icon, Upload, Form, Button, Alert, Progress
} from 'antd'
import Cookies from 'js-cookie'
import { withTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'

const { Item } = Form

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

class ProjectPhoto extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      error: '',
      uploadingError: false,
      imageUrl: props.value,
      percent: 0
    }
  }
  handleChange = (info) => {
    console.log(info)
    if(info.hasOwnProperty('event')){
      this.setState({
        percent: info.event.percent
      })
    }
    if (info.file.status === 'uploading') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: true,
        })
      })
      return
    }
    if(info.file.status === 'error'){
      console.log(info)
      this.setState({
        uploadingError: true,
        loading: false
      })
    }
  }

  handleSuccess = (e) => {
    this.props.onChange(e.changes[0][1])
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 1000)
  }

  beforeUpload = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1000000 < 1.9
    if (!isImage) {
      this.setState({
        error: 'Please upload an image',
        loading: false
      })
    } else if(!isLt2M) {
      this.setState({
        error: 'The uploaded image is too big',
        loading: false
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
      imageUrl: '',
      uploadingError: '',
      loading: false
    })
  }

  render() {
    const { t } = this.props
    return (
      <Item
        validateStatus={this.props.validateStatus}
        label={
        <InputLabel
          tooltip={t('Project photo tooltip')}
        >{t('Photo')}
        </InputLabel>}
      >
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
            <div>
              <Button onClick={this.resetImage}>{t('Upload New Image')}</Button>
            </div>
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
          onSuccess={this.handleSuccess}
          beforeUpload={this.beforeUpload}
          headers={{ 'X-CSRFToken': Cookies.get('csrftoken') }}
        >
          {this.state.loading && (
          <div>
            <p className="ant-upload-drag-icon">
              <Icon type="loading" />
            </p>
            <p className="ant-upload-text">{t('Uploading')}...</p>
          </div>
          )}
          {!this.state.loading && (
          <div>
            <p className="ant-upload-drag-icon">
              <Icon type="picture" theme="twoTone" />
            </p>
            <p className="ant-upload-text">{t('Drag file here')}</p>
            <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
          </div>
          )}
        </Upload.Dragger>
        </div>
      </Item>
    )
  }
}

export default withTranslation()(ProjectPhoto)
