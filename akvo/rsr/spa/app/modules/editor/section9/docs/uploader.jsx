import React, { useState, useEffect } from 'react'
import { Upload, Icon, Alert } from 'antd'
import { isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'
import { config } from '../../../../utils/api'
import { filteroutFns } from '../../../../utils/misc'

const Uploader = ({ document, documentId, onDocumentUpdated, onRemoveDocument }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [fileList, setFileList] = useState([])
  const beforeUpload = (file) => {
    const isLt10M = file.size / 1000000 < 10
    if (!isLt10M) {
      setError(t('The uploaded file is too big'))
    } else {
      setError('')
    }
    return isLt10M
  }
  useEffect(() => {
    if (document && document !== true) {
      setFileList([
        {
          uid: '-1',
          thumbUrl: document,
          url: document,
          status: 'done',
          name: document.split('/').reduce((acc, value) => value)
        }
      ])
    }
  }, [])
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
        fileList={fileList}
        beforeUpload={beforeUpload}
        onSuccess={(item) => {
          setFileList([
            {
              uid: item.id,
              thumbUrl: item.document,
              url: item.document,
              status: 'done',
              name: item.document.split('/').reduce((acc, val) => val)
            }
          ])
          if (onDocumentUpdated) onDocumentUpdated(item.document)
        }}
        onRemove={() => {
          setFileList([])
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

export default React.memo(Uploader, (prevProps, nextProps) => {
  return isEqual(filteroutFns(prevProps), filteroutFns(nextProps))
})
