import React from 'react'
import { Form, Button, Row, Col, Checkbox, Icon, Select, Tooltip } from 'antd'
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form
const { Option } = Select

const ProjectPicker = ({ fieldName, projects, loading }) => {
  const { t } = useTranslation()
  return (
    <Item label={(
      <InputLabel
        tooltip="Check this box if you would like to indicate a related project that is not present in RSR. Instead, you will be able to fill in the IATI activity ID of the project."
        optional
      >{t('Project')}
      </InputLabel>
    )}>
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
                render={({input}) => {
                  const options =
                    projects && projects.length > 0
                    ? projects.map(({id, title}) => ({ value: id, label: title }))
                    : [{ value: input.value, label: nameProps.input.value }]
                  return (
                    <Select
                      {...input}
                      loading={loading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(val, option) => option.props.children.toLowerCase().indexOf(val.toLowerCase()) >= 0}
                    >
                      {options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
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
      header="Related project $index"
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
        addButton={({ onClick }) => <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add a related project')}</Button>}
    />
    </div>
  )
}

export default RelatedProjects
