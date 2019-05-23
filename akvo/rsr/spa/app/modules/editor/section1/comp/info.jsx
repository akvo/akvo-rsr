import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Row, Col
} from 'antd'
import currencies from 'currency-codes/data'
import { Form as FinalForm } from 'react-final-form'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import AutoSave from '../../../../utils/auto-save'
import { validationType, isFieldOptional, doesFieldExist } from '../../../../utils/validation-utils'
import ProjectPhoto from './project-photo'
import { getValidationSets } from '../validations'
import AID_TYPES from '../options/aid-types.json'
import AID_TYPE_VOCABULARY from '../options/aid-type-vocabulary.json'
import FLOW_TYPES from '../options/flow-types.json'
import FINANCE_TYPES from '../options/finance-types.json'
import tiedStatusOptions from '../options/tied-statuses.json'
import ParentPicker from './parent-picker'
import '../styles.scss'

const { Item } = Form

const STATUS_OPTIONS = [
  { value: 1, label: 'Identification'},
  { value: 2, label: 'Implementation'},
  { value: 3, label: 'Completion'},
  { value: 4, label: 'Post-completion'},
  { value: 5, label: 'Canceled'},
  { value: 6, label: 'Suspended'}
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

const IatiTooltip = () => (<span>This is a globally unique identifier for this activity. It is a requirement to be compliant with the IATI standard. This code consists of:<br />[country code]-[Chamber of Commerce number]-[organisation’s internal project code].<br />For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more information <a href="http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/iati-identifier/#definition" target="_blank" rel="noopener noreferrer">click here</a></span>)
const StatusTooltip = () => (
<span>There are six different project statuses:
  <ol>
    <li>Pipeline/identification: the project is being scoped or planned</li>
    <li>Implementation: the project is currently being implemented</li>
    <li>Completion: the project is complete or the final disbursement has been made</li>
    <li>Post-completion: the project is complete or the final disbursement has been made, but the project remains open pending financial sign off or M&E</li>
    <li>Cancelled: the project has been cancelled</li>
    <li>Suspended: the project has been temporarily suspended or the reporting partner no longer uses RSR.</li>
  </ol>
</span>)

class Info extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const isOptional = isFieldOptional(validationSets)
    const fieldExists = doesFieldExist(validationSets)
    return (
      <div className="info view">
        <Form layout="vertical">
        <FinalForm
          onSubmit={() => {}}
          initialValues={this.props.fields}
          subscription={{}}
          render={() => (
            <div>
            <AutoSave sectionIndex={1} />
            <FinalField
              name="title"
              render={({input}) => (
                <Item label="Project title" validateStatus={input.value && input.value.length > 5 ? 'success' : ''} hasFeedback>
                  <Input {...input} />
                </Item>
              )}
            />
            <FinalField
              name="subtitle"
              render={({input}) => (
                <Item label="Project subtitle" validateStatus={input.value && input.value.length > 5 ? 'success' : ''} hasFeedback>
                  <Input {...input} />
                </Item>
              )}
            />
            <Item label={(
              <InputLabel
                tooltip={<IatiTooltip />}
              >IATI Identifier
              </InputLabel>
            )}>
            <FinalField
              name="iatiActivityId"
            />
            </Item>
            <ParentPicker />
            <Item label={<InputLabel tooltip={<StatusTooltip />}>Status</InputLabel>}>
            <FinalField
              name="iatiStatus"
              control="select"
              options={STATUS_OPTIONS}
            />
            </Item>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel>Planned Start Date</InputLabel>}>
                <FinalField
                  name="plannedStartDate"
                  control="datepicker"
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel>Planned End Date</InputLabel>}>
                <FinalField
                  name="plannedEndDate"
                  control="datepicker"
                />
                </Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional={isOptional('actualStartDate')}>Actual Start Date</InputLabel>}>
                <FinalField
                  name="actualStartDate"
                  control="datepicker"
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional={isOptional('actualEndDate')}>Actual End Date</InputLabel>}>
                <FinalField
                  name="actualEndDate"
                  control="datepicker"
                />
                </Item>
              </Col>
            </Row>
            <Item label={<InputLabel optional tooltip="The default currency for this project. Used in all financial aspects of the project.">Currency</InputLabel>}>
            <FinalField
              name="currency"
              showSearch
              optionFilterProp="children"
              options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
              control="select"
            />
            </Item>
            <Item label={<InputLabel optional={isOptional('language')} tooltip="Enter the language used when entering the details for this project.">Language</InputLabel>}>
            <FinalField
              name="language"
              control="select"
              options={languages.map(({code, label}) => ({ value: code, label }))}
            />
            </Item>
            <hr />
            <h3>Project photo</h3>
            <ProjectPhoto projectId={2} />
            <Item label={<InputLabel optional tooltip="Enter the name of the person who took the photo">Photo credit</InputLabel>}>
            <FinalField
              name="currentImageCaption"
            />
            </Item>

            <Item label={<InputLabel optional tooltip="Briefly describe who or what you see in the photo.">Photo caption</InputLabel>}>
            <FinalField
              name="currentImageCredit"
            />
            </Item>
            {(this.props.validations.indexOf(validationType.IATI) !== -1 || this.props.validations.indexOf(validationType.DGIS) !== -1) && (
              <div>
                <hr />
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of vocabulary being used for describing the type of the aid being supplied or activity being undertaken. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/203/codelists/AidTypeVocabulary/">http://iatistandard.org/203/codelists/AidTypeVocabulary/</a></span>}
                  >
                  Default aid type vocabulary
                  </InputLabel>}
                >
                <FinalField
                  name="defaultAidTypeVocabulary"
                  control="select"
                  options={AID_TYPE_VOCABULARY}
                  withEmptyOption
                />
                </Item>
                <Item label={
                  <InputLabel
                    optional={isOptional('defaultAidType')}
                    tooltip={<span>This is the IATI identifier for the type of aid being supplied or activity being undertaken. This element specifies a default for all the project’s financial transactions. This can be overridden at the individual transaction level. For reference, please visit:  <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/AidType/">http://iatistandard.org/202/codelists/AidType/</a></span>}
                  >
                  Default aid type
                  </InputLabel>}
                >
                <FinalField
                  name="defaultAidType"
                  options={AID_TYPES}
                  control="select"
                  withEmptyOption
                />
                </Item>
                <Item label={
                  <InputLabel
                    optional={isOptional('defaultFlowType')}
                    tooltip={<span>This is the IATI identifier for how the activity (project) is funded. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/FlowType/">http://iatistandard.org/202/codelists/FlowType/</a></span>}
                  >
                  Default flow type
                  </InputLabel>}
                >
                <FinalField
                  name="defaultFlowType"
                  control="select"
                  options={FLOW_TYPES}
                  withEmptyOption
                />
                </Item>
                <Item label={
                  <InputLabel
                    optional={isOptional('defaultTiedStatus')}
                    tooltip={<span>This element specifies a default for all the activity’s financial transactions; it can be overridden at the individual transaction level. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/TiedStatus/">http://iatistandard.org/202/codelists/TiedStatus/</a></span>}
                  >
                  Default tied status
                  </InputLabel>}
                >
                <FinalField
                  name="defaultTiedStatus"
                  control="select"
                  options={tiedStatusOptions}
                  withEmptyOption
                />
                </Item>
                {fieldExists('collaborationType') &&
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of collaboration involved. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/CollaborationType/">http://iatistandard.org/202/codelists/CollaborationType/</a></span>}
                  >
                  Collaboration type
                  </InputLabel>}
                >
                <FinalField
                  name="collaborationType"
                  withEmptyOption
                  control="select"
                  options={COLLABORATION_TYPES}
                />
                </Item>
                }
                {fieldExists('defaultFinanceType') &&
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of finance. This element specifies a default for all the transactions in the project’s activity report; it can be overridden at the individual transaction level. For reference visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/FinanceType/">http://iatistandard.org/202/codelists/FinanceType/</a></span>}
                  >
                  Default finance type
                  </InputLabel>}
                >
                <FinalField
                  name="defaultFinanceType"
                  control="select"
                  options={FINANCE_TYPES}
                  withEmptyOption
                />
                </Item>
                }
              </div>
            )}
            </div>
          )}
        />
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { section1: { fields }, validations}}) => ({ fields, validations}),
)(Info)
