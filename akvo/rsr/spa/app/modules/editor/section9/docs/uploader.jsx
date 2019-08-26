import React, { useState } from 'react'
import { Upload, Icon, Alert } from 'antd'
import { Route } from 'react-router-dom'
import {isEqual} from 'lodash'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'
import { config } from '../../../../utils/api'

const Uploader = ({ document, documentId, onNewDocumentUploading, onNewDocumentUploaded, onDocumentUpdated }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const beforeUpload = (file) => {
    const isLt10M = file.size / 1000000 < 10
    if (!isLt10M) {
      setError(t('The uploaded file is too big'))
    } else {
      setError('')
    }
    return isLt10M
  }
  return (
    <Route
    path="/projects/:id"
    component={({ match: {params} }) => {
        let uploadStarted = false
        const data = documentId
          ? {field_id: `rsr_projectdocument.document.${documentId}`}
          : {field_id: `rsr_projectdocument.document.${params.id}_new-0`}
        return (
          <div>
          {error && <Alert type="error" message={error} style={{ marginBottom: 15 }} />}
          <Upload.Dragger
            name="file"
            listType="picture"
            action={`/rest/v1/project/${params.id}/upload_file/?format=json`}
            withCredentials
            headers={config.headers}
            data={data}
            defaultFileList={(document && document !== true) ? [{ uid: '-1', thumbUrl: document, url: document, status: 'done', name: document.split('/').reduce((acc, value) => value) }] : []}
            beforeUpload={beforeUpload}
            onChange={({ file }) => {
              if(file.status === 'uploading' && !documentId && !uploadStarted){
                uploadStarted = true
                if(onNewDocumentUploading) onNewDocumentUploading()
              }
            }}
            onSuccess={(e) => {
              if(!documentId){
                if(e.rel_objects && e.rel_objects[0] && e.rel_objects[0].new_id){
                  if(onNewDocumentUploaded) onNewDocumentUploaded(e.rel_objects[0].new_id, e.changes[0][1])
                }
              } else {
                if(e.rel_objects && e.rel_objects[0] && e.rel_objects[0].new_id){
                  if(onDocumentUpdated) onDocumentUpdated(e.changes[0][1])
                }
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="picture" theme="twoTone" />
            </p>
            <p className="ant-upload-text">{t('Drag file here')}</p>
            <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
            <p><small>Max: 10MB</small></p>
          </Upload.Dragger>
          </div>
        )
      }
    }
    />
  )
}

export default React.memo(Uploader, (prevProps, nextProps) => {
  let _isEqual = isEqual(prevProps, nextProps)
  if(!_isEqual){
    const _diff = diff(prevProps, nextProps)
    if(Object.keys(_diff).length === 1 && Object.keys(_diff)[0] === 'onDocumentUpdated'){
      _isEqual = true
    }
  }
  return _isEqual
})
