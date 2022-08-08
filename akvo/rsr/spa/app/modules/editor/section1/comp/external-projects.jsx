import React, { useState, useEffect } from 'react'
import { Button, Modal, Input, Popconfirm } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import api from '../../../../utils/api'
import actionTypes from '../../action-types'

const ExternalProjects = ({ projectId, dispatch }) => {
  const { t } = useTranslation()
  const [isModalShown, showModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [projects, setProjects] = useState([])
  useEffect(() => {
    api.get(`/project/${projectId}/external_project/`).then((response) => {
      const results = response.data;
      dispatch({
        type: actionTypes.EDIT_SET_ITEM,
        sectionIndex: 1,
        setName: 'relatedProjects',
        itemIndex: 0,
        fields: {
          project: results[0]?.relatedProject,
          relation: 2
        }
      })
      dispatch({
        type: actionTypes.BACKEND_SYNC,
        lastSaved: null
      })
      setProjects([...results])
    })
  }, [])
  const handleAdd = () => {
    setAdding(true)
    api.post(`/project/${projectId}/external_project/`, {
      iatiId: inputValue,
    }).then(({data}) => {
      setAdding(false)
      showModal(false)
      setInputValue('')
      setProjects([...projects, data])
    }).catch((e) => {
      console.log(e)
      setAdding(false)
    })
  }
  const handleDelete = (project) => {
    api.delete(`/project/${projectId}/external_project/${project.id}/`)
    setProjects(projects.filter(it => it.id !== project.id))
  }
  return (
    <div className="external-projects">
      {projects.length > 0 && (
        <div className="ant-row ant-form-item projects-list">
          <div className="ant-col ant-form-item-label"><label>{t('External child projects')}</label></div>
          {projects.map((project) =>
            <div className="project-row">
              <span>{project.iatiId}</span>
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
