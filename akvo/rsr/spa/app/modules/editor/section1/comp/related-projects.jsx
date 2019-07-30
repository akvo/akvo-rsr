import React, { useReducer } from 'react'
import { Form, Button, Row, Col, Checkbox, Icon, Select, Tooltip, Spin } from 'antd'
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form
const { Option } = Select

let intid

const ProjectPicker = ({ fieldName, loading, projects }) => {
  const { t } = useTranslation()
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
  return (
    <Item label={(<InputLabel optional>{t('Project')}</InputLabel>)}>
      <Condition when={`${fieldName}.isParentExternal`} is={true}>
        <FinalField
          placeholder={t('IATI Identifier')}
          name={`${fieldName}.iatiId`}
        />
      </Condition>
      <Condition when={`${fieldName}.isParentExternal`} isNot={true}>
        <Field
          name={`${fieldName}.relatedProjectName`}
          render={(nameProps) => {
            return (
              <FinalField
                name={`${fieldName}.relatedProject`}
                render={({ input }) => {
                  const $options =
                    projects && projects.length > 0
                      ? state.options
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
      </Condition>
      <FinalField
        name={`${fieldName}.isParentExternal`}
        render={({ input }) => <Checkbox {...input} className="related-project-checkbox"><span>{t('Related project is not present in RSR')} <Tooltip trigger="click" title={t('Related project tooltip')}><Icon type="info-circle" /></Tooltip></span></Checkbox>}
      />
    </Item>
  )
}

const RelatedProjects = ({ formPush, ...props }) => {
  const { t } = useTranslation()
  return (
    <div>
    <div className="ant-col ant-form-item-label related-projects-label">
      <InputLabel optional>{t('Related projects')}</InputLabel>
    </div>
    <ItemArray
      setName="relatedProjects"
      sectionIndex={1}
      header={`${t('Related project')} $index`}
      formPush={formPush}
      panel={name => (
        <Row gutter={16}>
          <Col span={16}>
            <ProjectPicker fieldName={name} {...props} />
          </Col>
          <Col span={8}>
            <Item
              label={<InputLabel>{t('relation')}</InputLabel>}
            >
              <FinalField
                control="select"
                name={`${name}.relation`}
                options={[
                  { value: '1', label: t('Parent')},
                  { value: '2', label: t('Child')},
                  { value: '3', label: t('Sibling')},
                  { value: '4', label: t('Co-founded')},
                  { value: '5', label: t('Third-party')}
                ]}
              />
            </Item>
          </Col>
        </Row>
      )}
      addButton={({ onClick }) => <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add another related project')}</Button>}
    />
    </div>
  )
}

export default RelatedProjects
