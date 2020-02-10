import React, { useState } from 'react'
import { Upload, Icon, Alert } from 'antd'
import { Route } from 'react-router-dom'
import {isEqual} from 'lodash'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'
import { config } from '../../../../utils/api'

const Uploader = ({ document, documentId, onDocumentUpdated, onRemoveDocument }) => {
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
    component={() => {
        return (
          <div>
          {error && <Alert type="error" message={error} style={{ marginBottom: 15 }} />}
          <Upload.Dragger
            name="document"
            listType="picture"
            method="PATCH"
            action={`/rest/v1/project_document/${documentId}/?format=json`}
            withCredentials
            headers={config.headers}
            defaultFileList={(document && document !== true) ? [{ uid: '-1', thumbUrl: document, url: document, status: 'done', name: document.split('/').reduce((acc, value) => value) }] : []}
            beforeUpload={beforeUpload}
            onSuccess={(item) => {
              if (onDocumentUpdated) onDocumentUpdated(item.document)
            }}
            onRemove={() => {
              onRemoveDocument()
              return true
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
