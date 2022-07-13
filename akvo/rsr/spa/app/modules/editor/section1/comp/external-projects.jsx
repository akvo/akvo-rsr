import React, { useState } from 'react'
import { Button, Modal, Input, Popconfirm } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import api from '../../../../utils/api'

const ExternalProjects = ({ projectId }) => {
  const { t } = useTranslation()
  const [isModalShown, showModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [projects, setProjects] = useState([])
  return (
    <div className="external-projects">
      {projects.length > 0 && (
        <div className="ant-row ant-form-item projects-list">
          <div className="ant-col ant-form-item-label"><label>{t('External child projects')}</label></div>
          {projects.map((project) =>
            <div className="project-row">
              <span>{project.relatedIatiId}</span>
              <Popconfirm
                title={t('Are you sure to delete this?')}
                onConfirm={() => console.log('Removing related project...')}
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
        onOk={() => console.log('Adding project...')}
        okText={t('Add')}
        okButtonProps={{ disabled: inputValue.length === 0 }}
        onCancel={() => { showModal(false); setInputValue('') }}
        confirmLoading={adding}
      >
        <Input disabled={adding} placeholder="IATI Activity ID" value={inputValue} onChange={({target: {value}}) => setInputValue(value)} />
      </Modal>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}
export default connect(null, mapDispatchToProps)(ExternalProjects)
