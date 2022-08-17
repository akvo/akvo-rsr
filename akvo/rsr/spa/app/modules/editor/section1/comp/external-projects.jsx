import React, { useState, useEffect } from 'react'
import { Button, Modal, Input, Popconfirm, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import api from '../../../../utils/api'
import * as actions from '../../actions'

const ExternalProjects = ({ externalProjects, addExternalProject, removeExternalProject, setExternalProjects, match: { params } }) => {
  const { t } = useTranslation()
  const [isModalShown, showModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [adding, setAdding] = useState(false)
  useEffect(() => {
    api.get(`/project/${params.id}/external_project/`).then(({ data }) => {
      setExternalProjects(data)
    })
  }, [])
  const handleAdd = () => {
    setAdding(true)
    api.post(`/project/${params?.id}/external_project/`, {
      iatiId: inputValue,
    }).then(({ data }) => {
      setAdding(false)
      showModal(false)
      setInputValue('')
      addExternalProject(data)
    }).catch(() => {
      setAdding(false)
    })
  }
  const handleDelete = (project) => {
    api.delete(`/project/${params?.id}/external_project/${project.id}/`)
      .then(() => removeExternalProject(project))
      .catch(() => message.error('Failed to remove external project'))
  }
  return (
    <div className="external-projects">
      {externalProjects?.length > 0 && (
        <div className="ant-row ant-form-item projects-list">
          <div className="ant-col ant-form-item-label"><label>{t('External child projects')}</label></div>
          {externalProjects?.map((project) =>
            <div className="project-row">
              <span>{project.iatiId}</span>
              <Popconfirm
                title={t('Are you sure to delete this?')}
                onConfirm={() => handleDelete(project)}
                okText={t('Yes')}
                cancelText={t('No')}
              >
                <Button icon="delete" type="link" />
              </Popconfirm>
            </div>
          )}
        </div>
      )}
      <Button className="add-btn" type="link" icon="plus" onClick={() => showModal(true)}>{t('Add external contributing project')}</Button>
      <Modal
        title={t('Add external contributing project')}
        visible={isModalShown}
        onOk={handleAdd}
        okText={t('Add')}
        okButtonProps={{ disabled: inputValue.length === 0 }}
        onCancel={() => { showModal(false); setInputValue('') }}
        confirmLoading={adding}
      >
        <Input disabled={adding} placeholder="IATI Activity ID" value={inputValue} onChange={({ target: { value } }) => setInputValue(value)} />
      </Modal>
    </div>
  )
}

export default connect(
  (({ editorRdr: { externalProjects } }) => ({ externalProjects })), actions
)(withRouter(ExternalProjects))
