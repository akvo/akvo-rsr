import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Row, Col, Select
} from 'antd'
import currencies from 'currency-codes/data'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'
import { Route } from 'react-router-dom'

import FinalField from '../../../../utils/final-field'
import AutoSave from '../../../../utils/auto-save'
import { isFieldOptional, doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import ProjectPhoto from './project-photo'
import validationDefs from '../validations'
import AID_TYPES from '../options/aid-types.json'
import AID_TYPE_VOCABULARY from '../options/aid-type-vocabulary.json'
import FLOW_TYPES from '../options/flow-types.json'
import FINANCE_TYPES from '../options/finance-types.json'
import tiedStatusOptions from '../options/tied-statuses.json'
import RelatedProjects from './related-projects'
import SectionContext from '../../section-context'
import '../styles.scss'
import InputLabel from '../../../../utils/input-label'
import { useFetch } from '../../../../utils/hooks'

const { Item } = Form
const { Option } = Select
const Aux = node => node.children

const STATUS_OPTIONS = [
  { value: '1', label: 'Identification'},
  { value: '2', label: 'Implementation'},
  { value: '3', label: 'Completion'},
  { value: '4', label: 'Post-completion'},
  { value: '5', label: 'Canceled'},
  { value: '6', label: 'Suspended'}
]
const COLLABORATION_TYPES = [
  {value: '1', label: 'Bilateral'},
  {value: '2', label: 'Multilateral (inflows)'},
  {value: '3', label: 'Bilateral, core contributions to NGOs and other private bodies / PPPs'},
  {value: '4', label: 'Multilateral outflows'},
  {value: '6', label: 'Private sector outflows'},
  {value: '7', label: 'Bilateral, ex-post reporting on NGOs’ activities funded through core contributions'},
  {value: '8', label: 'bilateral, triangular co-operation: activities where one or more bilateral providers of development co-operation or international organisations support South-South co-operation, joining forces with developing countries to facilitate a sharing of knowledge and experience among all partners involved.'}
]

const languages = [{ label: 'English', code: 'en'}, { label: 'German', code: 'de' }, { label: 'Spanish', code: 'es' }, { label: 'French', code: 'fr' }, { label: 'Dutch', code: 'nl' }, { label: 'Russian', code: 'ru' }]

const Info = ({ validations, fields }) => {
  const [{results}, loading] = useFetch('/typeaheads/projects')
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div className="info view">
      <SectionContext.Provider value="section1">
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
          <div>
          <AutoSave sectionIndex={1} />
          <FinalField
            name="title"
            render={({input}) => (
              <Item label={<InputLabel tooltip="...">Project title</InputLabel>} validateStatus={input.value && input.value.length > 5 ? 'success' : ''} hasFeedback>
                <Input.TextArea {...input} autosize />
              </Item>
            )}
          />
          <FinalField
            name="subtitle"
            render={({input}) => (
              <Item label={<InputLabel tooltip="...">Project subtitle</InputLabel>} validateStatus={input.value && input.value.length > 5 ? 'success' : ''} hasFeedback>
                <Input {...input} />
              </Item>
            )}
          />
          <Field
            name="primaryOrganisation"
            render={(poProps) => (
              <Aux>
              {poProps.input.value === 3394 && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel>IATI identifier (prefix)</InputLabel>}>
                    <FinalField
                      name="iatiActivityId"
                      render={({input}) => (
                        <Select value={input.value.substr(0, input.value.indexOf('_') + 1)} onChange={(val) => input.onChange(`${val}T05-EUTF-SAH-REG-08`)}>
                          <Option value="XI-IATI-EC_NEAR_">XI-IATI-EC_NEAR_</Option>
                          <Option value="XI-IATI-EC_DEVCO_">XI-IATI-EC_DEVCO_</Option>
                        </Select>
                      )}
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel>IATI identifier (prefix)</InputLabel>}>
                      <Input disabled value="T05-EUTF-SAH-REG-08" />
                    </Item>
                  </Col>
                </Row>
              )}
              <FinalField
                name="iatiActivityId"
                control="input"
                withLabel
                fieldExists={fieldExists}
                disabled={poProps.input.value === 3394}
              />
              </Aux>
            )}
          />
          <RelatedProjects formPush={push} projects={results} loading={loading} />
          <FinalField
            name="hierarchy"
            control="select"
            withLabel
            fieldExists={fieldExists}
            options={[
              {value: 1, label: 'Core Activity'},
              {value: 2, label: 'Sub Activity'},
              {value: 3, label: 'Lower Sub Activity'}
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
              <FinalField
                name="dateStartPlanned"
                control="datepicker"
                withLabel
              />
            </Col>
            <Col span={12}>
              <FinalField
                name="dateEndPlanned"
                control="datepicker"
                withLabel
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FinalField
                name="dateStartActual"
                control="datepicker"
                optional={isOptional}
                withLabel
              />
            </Col>
            <Col span={12}>
              <FinalField
                name="dateEndActual"
                control="datepicker"
                withLabel
                optional={isOptional}
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
          <h3>Project photo</h3>
          <Route
            path="/projects/:id"
            component={({ match: {params} }) => (
              <FinalField
                name="currentImage"
                render={({input}) => <ProjectPhoto projectId={params.id} {...input} />}
              />
            )}
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
            optional
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
          />
          <FinalField
            name="defaultFlowType"
            control="select"
            options={FLOW_TYPES}
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
          />
          <FinalField
            name="defaultTiedStatus"
            control="select"
            options={tiedStatusOptions}
            withEmptyOption
            withLabel
            optional={isOptional}
            fieldExists={fieldExists}
          />
          <FinalField
            name="collaborationType"
            withEmptyOption
            control="select"
            options={COLLABORATION_TYPES}
            withLabel
            optional
            fieldExists={fieldExists}
          />
          <FinalField
            name="defaultFinanceType"
            control="select"
            options={FINANCE_TYPES}
            withEmptyOption
            withLabel
            optional
            fieldExists={fieldExists}
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
  ({ editorRdr: { section1: { fields }, validations}}) => ({ fields, validations}),
)(React.memo(Info, (prevProps, nextProps) => {
  return isEqual(prevProps.fields, nextProps.fields)
}))
