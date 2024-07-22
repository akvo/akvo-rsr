import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Row, Col, Select
} from 'antd'
import currencies from 'currency-codes/data'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import FinalField from '../../../utils/final-field'
import AutoSaveFS from '../../../utils/auto-save'
import { isFieldOptional, doesFieldExist, getValidationSets } from '../../../utils/validation-utils'
import ProjectPhoto from './comp/project-photo'
import validationDefs from './validations'
import AID_TYPES from './options/aid-types.json'
import AID_TYPE_VOCABULARY from './options/aid-type-vocabulary.json'
import FLOW_TYPES from './options/flow-types.json'
import FINANCE_TYPES from './options/finance-types.json'
import tiedStatusOptions from './options/tied-statuses.json'
import SectionContext from '../section-context'
import './styles.scss'
import InputLabel from '../../../utils/input-label'
import { useFetch } from '../../../utils/hooks'
import ProjectPicker from './comp/project-picker'
import ExternalProjects from './comp/external-projects'
import { getParentUuid } from '../../../utils/misc'

const { Item } = Form
const { Option } = Select
const Aux = node => node.children

const languages = [{ label: 'English', code: 'en'}, { label: 'German', code: 'de' }, { label: 'Spanish', code: 'es' }, { label: 'French', code: 'fr' }, { label: 'Dutch', code: 'nl' }, { label: 'Russian', code: 'ru' }]

const Info = ({ validations, fields, projectId, errors, showRequired, program, dispatch }) => {
  const { t } = useTranslation()
  const [{results}, loading] = useFetch('/typeaheads/projects')
  const initRef = useRef(false)
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const fieldExists = doesFieldExist(validationSets)
  const STATUS_OPTIONS = [
    { value: '1', label: t('Identification') },
    { value: '2', label: t('Implementation') },
    { value: '3', label: t('Completion') },
    { value: '4', label: t('Post-completion') },
    { value: '5', label: t('Canceled') },
    { value: '6', label: t('Suspended') }
  ]
  const COLLABORATION_TYPES = [
    { value: '1', label: t('Bilateral') },
    { value: '2', label: t('Multilateral (inflows)') },
    { value: '3', label: t('Bilateral, core contributions to NGOs and other private bodies / PPPs') },
    { value: '4', label: t('Multilateral outflows') },
    { value: '6', label: t('Private sector outflows') },
    { value: '7', label: t('Bilateral, ex-post reporting on NGOs\' activities funded through core contributions') },
    { value: '8', label: t('bilateral, triangular co-operation: activities where one or more bilateral providers of development co-operation or international organisations support South-South co-operation, joining forces with developing countries to facilitate a sharing of knowledge and experience among all partners involved.'), }
  ]
  let subtitleValidateStatus = ''
  if (showRequired && errors.findIndex(it => it.path === 'subtitle') !== -1) {
    subtitleValidateStatus = 'error'
  }
  const parentUuid = getParentUuid(fields?.path)
  useEffect(() => {
    if(!initRef.current){
      initRef.current = true
    } else {
      dispatch({ type: 'EDIT_PROGRAM_NAME', projectId, projectName: fields.title })
    }
  }, [fields.title])
  const disableMWCFields = fields?.program?.id === 9062
  const projects = results?.filter(it => it.id !== Number(projectId))
  return (
    <div className="info view">
      <SectionContext.Provider value="section1">
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={() => (
          <div>
          <AutoSaveFS sectionIndex={1} />
          <FinalField
            name="title"
            withLabel
            dict={{ label: t('Title')}}
            withoutTooltip
            control="textarea"
            autosize
          />
          <Field
            name="subtitle"
            render={(subProps) => (
            <Field
              name="primaryOrganisation"
              render={(poProps) => (
                <Field
                  name="iatiActivityId"
                  render={({ input }) => (
                <Aux>
                <Item validateStatus={subtitleValidateStatus} label={<InputLabel optional={isOptional('subtitle')}>{t('Subtitle')}</InputLabel>}>
                {poProps.input.value !== 3394 && (
                  <Input.TextArea {...{ ...subProps.input, ...{ autosize: true } }} />
                )}
                {poProps.input.value === 3394 && (
                  <Input.TextArea autosize value={subProps.input.value} onChange={({ target: { value } }) => { subProps.input.onChange(value); input.onChange(`${input.value.substr(0, input.value.indexOf('_', 11) + 1)}${value}`) }} />
                )}
                </Item>
                {poProps.input.value === 3394 && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Item label={<InputLabel>IATI identifier (prefix)</InputLabel>}>
                        <Select value={input.value.substr(0, input.value.indexOf('_', 11) + 1)} onChange={(val) => input.onChange(`${val}${subProps.input.value}`)}>
                          <Option value="XI-IATI-EC_NEAR_">XI-IATI-EC_NEAR_</Option>
                          <Option value="XI-IATI-EC_DEVCO_">XI-IATI-EC_DEVCO_</Option>
                        </Select>
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label={<InputLabel>IATI identifier (suffix)</InputLabel>}>
                        <Input disabled value={subProps.input.value} />
                      </Item>
                    </Col>
                  </Row>
                )}
                <FinalField
                  name="iatiActivityId"
                  control="input"
                  withLabel
                  fieldExists={fieldExists}
                  disabled={poProps.input.value === 3394 || disableMWCFields}
                />
                </Aux>
                  )}
                />
              )}
            />
            )}
          />
            {!program && (
              <ProjectPicker
                projects={projects}
                {...{
                  fields,
                  loading,
                  parentUuid
                }}
              />
            )}
          {!fields.hasImportedResults && <ExternalProjects />}
          <FinalField
            name="hierarchy"
            control="select"
            withLabel
            fieldExists={fieldExists}
            options={[
              {value: 1, label: t('Core Activity') },
              {value: 2, label: t('Sub Activity') },
              {value: 3, label: t('Lower Sub Activity') },
            ]}
            withEmptyOption
          />
          <FinalField
            name="iatiStatus"
            control="select"
            options={STATUS_OPTIONS}
            withLabel
          />
          <Row gutter={16}>
            <Col span={12}>
              <Field
                name="dateEndPlanned"
                render={({input}) => (
                  <FinalField
                    name="dateStartPlanned"
                    control="datepicker"
                    optional={isOptional}
                    withLabel
                    disabledDate={(date) => {
                      const endDate = moment(input.value, 'DD/MM/YYYY')
                      if(!endDate.isValid()) return false
                      return date.valueOf() > endDate.valueOf()
                    }}
                  />
                )}
              />
            </Col>
            <Col span={12}>
              <Field
                name="dateStartPlanned"
                render={({ input }) => (
                <FinalField
                  name="dateEndPlanned"
                  control="datepicker"
                  optional={isOptional}
                  withLabel
                  disabledDate={(date) => {
                    const startDate = moment(input.value, 'DD/MM/YYYY')
                    if (!startDate.isValid()) return false
                    return date.valueOf() < startDate.valueOf()
                  }}
                />
                )}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Field
                name="dateEndActual"
                render={({ input }) => (
                <FinalField
                  name="dateStartActual"
                  control="datepicker"
                  optional={isOptional}
                  withLabel
                  disabledDate={(date) => {
                    const endDate = moment(input.value, 'DD/MM/YYYY')
                    if (!endDate.isValid()) return false
                    return date.valueOf() > endDate.valueOf()
                  }}
                />
                )}
              />
            </Col>
            <Col span={12}>
              <Field
                name="dateStartActual"
                render={({ input }) => (
                <FinalField
                  name="dateEndActual"
                  control="datepicker"
                  withLabel
                  optional={isOptional}
                  disabledDate={(date) => {
                    const startDate = moment(input.value, 'DD/MM/YYYY')
                    if (!startDate.isValid()) return false
                    return date.valueOf() < startDate.valueOf()
                  }}
                />
                )}
              />
            </Col>
          </Row>
          <FinalField
            name="currency"
            showSearch
            optionFilterProp="children"
            options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
            control="select"
            withLabel
            optional
          />
          <FinalField
            name="language"
            control="select"
            options={languages.map(({code, label}) => ({ value: code, label }))}
            withLabel
            optional={isOptional}
          />
          <hr />
          <h3>{t('Photo')}</h3>
          <FinalField
            name="currentImage"
            render={({ input, validateStatus }) => <ProjectPhoto projectId={projectId} {...input} validateStatus={validateStatus} />}
          />
          <FinalField
            name="currentImageCaption"
            withLabel
            optional
            control="input"
          />

          <FinalField
            name="currentImageCredit"
            withLabel
            optional
            control="input"
          />

          <hr />

          <FinalField
            name="defaultAidTypeVocabulary"
            control="select"
            options={AID_TYPE_VOCABULARY}
            withEmptyOption
            optional={isOptional}
            withLabel
            fieldExists={fieldExists}
          />
          <FinalField
            name="defaultAidType"
            options={AID_TYPES}
            control="select"
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
            disabled={disableMWCFields}
          />
          <FinalField
            name="defaultFlowType"
            control="select"
            options={FLOW_TYPES}
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
            disabled={disableMWCFields}
          />
          <FinalField
            name="defaultTiedStatus"
            control="select"
            options={tiedStatusOptions}
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
            disabled={disableMWCFields}
          />
          <FinalField
            name="collaborationType"
            withEmptyOption
            control="select"
            options={COLLABORATION_TYPES}
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
          />
          <FinalField
            name="defaultFinanceType"
            control="select"
            options={FINANCE_TYPES}
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
            disabled={disableMWCFields}
          />

          </div>
        )}
      />
      </Form>
      </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({
    editorRdr: {
      projectId,
      showRequired,
      section1: { fields, errors },
      validations
    }
  }) => ({ fields, validations, projectId, errors, showRequired }),
)(Info)
