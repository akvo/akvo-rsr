import React, { useReducer, useEffect, useState } from 'react'
import { Form, Checkbox, Icon, Select, Tooltip, Spin } from 'antd'
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import AutoSave from '../../../../utils/auto-save'

const { Item } = Form
const { Option } = Select
let intid

const ProjectPicker = ({ fieldName, loading, projects, savedData, formPush, projectId }) => {
  const { t } = useTranslation()
  const defaultIsExternal = savedData && savedData.relatedIatiId
  const [isExternal, setExternal] = useState(defaultIsExternal)
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { options: [], loading: false, searchStr: '' }
  )
  const filterOptions = value => {
    clearTimeout(intid)
    if (value.length > 1) {
      setState({
        options: [],
        loading: true,
        searchStr: value
      })
      intid = setTimeout(() => {
        const options = projects
          .filter(it => it.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 || it.subtitle.toLowerCase().indexOf(value.toLowerCase()) !== -1)
          .map(({ id, title }) => ({ value: id, label: title }))
        setState({
          options,
          loading: false
        })
      }, 300)
    }
  }
  useEffect(() => {
    if(!savedData){
      formPush('relatedProjects', { relation: '1', project: projectId })
    }
  }, [])
  return (
    <Item label={(<InputLabel optional>{t('Parent project')}</InputLabel>)}>
      <AutoSave sectionIndex={1} setName="relatedProjects" itemIndex={0} />
      {isExternal && (
        <FinalField
          placeholder={t('IATI Identifier')}
          name={`${fieldName}.relatedIatiId`}
          control="input"
        />
      )}
      {!isExternal && (
        <Field
          name={`${fieldName}.relatedProjectName`}
          render={(nameProps) => {
            return (
              <FinalField
                name={`${fieldName}.relatedProject`}
                render={({ input }) => {
                  const $options =
                    projects && projects.length > 0
                      ? ((input.value && state.searchStr.length === 0) ? [projects.find(it => it.id === input.value)].map(({ id, title }) => ({ value: id, label: title })) : state.options)
                      : [{ value: input.value, label: nameProps.input.value }]
                  return (
                    <Select
                      {...input}
                      loading={loading}
                      showSearch
                      onSearch={filterOptions}
                      notFoundContent={state.loading ? <Spin size="small" /> : (state.searchStr.length === 0 ? <span>{t('Start typing...')}</span> : <span>{t('No results')}</span>)}
                      filterOption={false}
                    >
                      {$options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
                    </Select>
                  )
                }}
              />
            )
          }}
        />
      )}
      <Checkbox checked={isExternal} onChange={(ev) => { console.log(ev.target.checked); setExternal(ev.target.checked) }} className="related-project-checkbox"><span>{t('Related project is not present in RSR')} <Tooltip trigger="click" title={t('Related project tooltip')}><Icon type="info-circle" /></Tooltip></span></Checkbox>
    </Item>
  )
}

export default ProjectPicker
