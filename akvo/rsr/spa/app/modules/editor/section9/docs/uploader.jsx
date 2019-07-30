import React from 'react'
import { Upload, Icon } from 'antd'
import { Route } from 'react-router-dom'
import {isEqual} from 'lodash'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'
import { config } from '../../../../utils/api'

const Uploader = ({ document, documentId, onNewDocumentUploading, onNewDocumentUploaded, onDocumentUpdated }) => {
  const { t } = useTranslation()
  return (
    <Route
    path="/projects/:id"
    component={({ match: {params} }) => {
        let uploadStarted = false
        const data = documentId
          ? {field_id: `rsr_projectdocument.document.${documentId}`}
          : {field_id: `rsr_projectdocument.document.${params.id}_new-0`}
        return (
          <Upload.Dragger
            name="file"
            listType="picture"
            action={`/rest/v1/project/${params.id}/upload_file/?format=json`}
            withCredentials
            headers={config.headers}
            data={data}
            defaultFileList={(document && document !== true) ? [{ uid: '-1', thumbUrl: document, url: document, status: 'done', name: document.split('/').reduce((acc, value) => value) }] : []}
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
            <p><small>{t('Max: 5MB')}</small></p>
          </Upload.Dragger>
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
