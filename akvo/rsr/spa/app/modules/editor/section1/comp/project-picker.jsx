import React, { useReducer, useEffect, useState } from 'react'
import { Form, Checkbox, Icon, Select, Tooltip, Spin, Button } from 'antd'
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { FieldArray } from 'react-final-form-arrays';

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import AutoSave from '../../../../utils/auto-save'
import { removeSetItem } from '../../actions'

const { Item } = Form
const { Option } = Select
let intid

const ProjectPicker = ({ loading, projects, savedData, formPush, formPop, projectId, removeSetItem }) => { // eslint-disable-line
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
        const options = projects && projects
          .filter(it => it.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 || it.subtitle.toLowerCase().indexOf(value.toLowerCase()) !== -1 || it.id === Number(value))
          .map(({ id, title }) => ({ value: id, label: `[${id}] ${title}` }))
        setState({
          options,
          loading: false
        })
      }, 300)
    }
  }
  const removeItem = (input, fields) => {
    removeSetItem(1, 'relatedProjects', 0)
    fields.remove(0)
    formPush('relatedProjects', { relation: '1', project: projectId })
  }
  useEffect(() => {
    if(!savedData){
      formPush('relatedProjects', { relation: '1', project: projectId })
    }
  }, [])
  return (
    <FieldArray name="relatedProjects" subscription={{}}>
      {({ fields }) => (
    <Item label={(<InputLabel optional>{t('Contributes to')}</InputLabel>)}>
      <AutoSave sectionIndex={1} setName="relatedProjects" itemIndex={0} />
      {isExternal && (
        <FinalField
          placeholder={t('IATI Identifier')}
          name="relatedProjects[0].relatedIatiId"
          control="input"
        />
      )}
      {!isExternal && (
        <Field
          name="relatedProjects[0].relatedProjectName"
          render={(nameProps) => {
            return (
              <FinalField
                name="relatedProjects[0].relatedProject"
                render={({ input }) => {
                  const $options =
                    projects && projects.length > 0
                      ? ((input.value && state.searchStr.length === 0) ? [projects.find(it => it.id === input.value)].filter(it => it != null).map(({ id, title }) => ({ value: id, label: `[${id}] ${title ? title : t('Untitled project')}` })) : state.options)
                      : [{ value: input.value, label: input.value ? `[${input.value}] ${nameProps.input.value}` ? nameProps.input.value : `[${input.value}] ${t('Untitled project')}` : '' }]
                  return (
                    <Select
                      {...input}
                      value={input.value}
                      onChange={(value) => { if(value != null) input.onChange(value); else removeItem(input, fields) }}
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
      <div style={{ display: 'flex' }}>
        <Checkbox checked={isExternal} onChange={(ev) => { setExternal(ev.target.checked) }} className="related-project-checkbox"><span>{t('Project not in RSR')} <Tooltip trigger="click" title={t('Related project tooltip')}><Icon type="info-circle" /></Tooltip></span></Checkbox>
        <FinalField
          name="relatedProjects[0].relatedProject"
          render={({ input }) => {
            if(input.value){
              return <Button type="link" icon="delete" onClick={() => input.onChange(null)} style={{ marginLeft: 'auto', marginTop: 10 }}>{t('Remove contribution')}</Button>
            }
            return null
          }}
        />
      </div>
    </Item>
    )}
    </FieldArray>
  )
}

export default connect(null, { removeSetItem })(ProjectPicker)
