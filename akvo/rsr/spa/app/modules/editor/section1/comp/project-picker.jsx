import React, { useReducer, useState, useEffect } from 'react'
import { Form, Checkbox, Icon, Select, Tooltip, Spin, Button, Alert, Skeleton } from 'antd'
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import AutoSave from '../../../../utils/auto-save'
import * as actions from '../../actions'
import api from '../../../../utils/api'

const { Item } = Form
const { Option } = Select
let intid

const ProjectPicker = ({
  loading,
  projects,
  fields,
  parentUuid,
  match: { params },
  setParentProject
}) => {
  const { externalParentIatiActivityId, contributesToProject, hasImportedResults, id: projectId } = fields
  const { t } = useTranslation()
  const [isExternal, setExternal] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { options: [], loading: false, searchStr: '' }
  )
  useEffect(() => {
    if ((parseInt(params?.id, 10) === projectId) && !fetched) {
      setFetched(true)
      api
        .get(`project_by_uuid/${parentUuid}/?format=json`)
        .then(({ data }) => setParentProject(data))
        .catch(() => setParentProject({}))
    }
    const hasExternal = (externalParentIatiActivityId && !contributesToProject)
    if ((hasExternal !== isExternal) && !projects) {
      setExternal(hasExternal)
    }
    if (hasImportedResults !== disabled) {
      setDisabled(hasImportedResults)
    }
  }, [
    params,
    parentUuid,
    projects,
    externalParentIatiActivityId,
    contributesToProject,
    hasImportedResults,
    isExternal,
    disabled,
    projectId,
  ])
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
          .filter(it => (
            it.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            it.subtitle.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            it.id === Number(value)
          ))
          .map(({ id, title }) => ({ value: id, label: `[${id}] ${title}` }))
        setState({
          options,
          loading: false
        })
      }, 300)
    }
  }
  return (
    <Skeleton loading={!(projects)} paragraph={{ rows: 2 }} active>
      <Item label={(<InputLabel optional>{t('Contributes to')}</InputLabel>)}>
        <AutoSave sectionIndex={1} />
        {isExternal && (
          <Field
            name="externalParentIatiActivityId"
            render={({ input }) => (
              <FinalField
                {...input}
                placeholder={t('IATI Identifier')}
                name="externalParentIatiActivityId"
                control="input"
              />
            )}
          />
        )}
        {!isExternal && (
          <Field
            name="contributesToProject"
            render={({ input }) => {
              const $options =
                projects && projects.length > 0
                  ? ((input.value && state.searchStr.length === 0)
                      ? [projects.find(it => it.id === input.value)]
                        .filter(it => it != null)
                        .map(({ id, title }) => ({
                          value: id,
                          label: `[${id}] ${title ? title : t('Untitled project')}`
                        }))
                      : state.options
                    )
                  : [{ value: input.value, label: '' }]
              return (
                <Select
                  {...input}
                  value={input.value}
                  loading={loading}
                  showSearch
                  onSearch={filterOptions}
                  notFoundContent={state.loading
                    ? <Spin size="small" />
                    : (state.searchStr.length === 0
                      ? <span>{t('Start typing...')}</span>
                      : <span>{t('No results')}</span>)}
                  filterOption={false}
                  disabled={disabled}
                >
                  {$options?.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
                </Select>
              )
            }}
          />
        )}
        <div style={{ display: 'flex' }}>
          <Checkbox checked={isExternal} disabled={disabled} onChange={(ev) => { setExternal(ev.target.checked) }} className="related-project-checkbox">
            <span>
              {t('Project not in RSR')}
              <Tooltip trigger="click" title={t('Related project tooltip')}>
                <Icon type="info-circle" />
              </Tooltip>
            </span>
          </Checkbox>
          <Field
            name="contributesToProject"
            render={({ input }) => {
              if (input.value) {
                return <Button disabled={disabled} type="link" icon="delete" onClick={() => input.onChange(null)} style={{ marginLeft: 'auto', marginTop: 10 }}>{t('Remove contribution')}</Button>
              }
              return null
            }}
          />
        </div>
      </Item>
      {disabled && <Alert type="info" message="The Results Framework has been inherited from the Lead project and cannot be modified." style={{ marginTop: -20, marginBottom: 20 }} />}
    </Skeleton>
  )
}

export default connect(
  null, actions
)(withRouter(ProjectPicker))
