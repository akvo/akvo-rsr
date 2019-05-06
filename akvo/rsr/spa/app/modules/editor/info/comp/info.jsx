/* global fetch */
import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Switch, DatePicker, Select, Row, Col
} from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import { datePickerConfig, havePropsChanged, validationType, isFieldOptional } from '../../../../utils/misc'
import * as actions from '../actions'
import ProjectPhoto from './project-photo'
import { getValidationSets } from '../validations'
import aidTypeOptions from '../options/aid-types.json'
import aidTypeVocabularyOptions from '../options/aid-type-vocabulary.json'
import flowTypeOptions from '../options/flow-types.json'
import financeTypeOptions from '../options/finance-types.json'
import tiedStatusOptions from '../options/tied-statuses.json'

import '../styles.scss'

const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ infoRdr }) => ({ rdr: infoRdr }),
  actions
)(_Field)

const statusOptions = [
  { value: 1, label: 'Identification'},
  { value: 2, label: 'Implementation'},
  { value: 3, label: 'Completion'},
  { value: 4, label: 'Post-completion'},
  { value: 5, label: 'Canceled'},
  { value: 6, label: 'Suspended'}
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

class _ParentPicker extends React.Component{
  state = {
    projects: []
  }
  componentWillMount(){
    fetch('/rest/v1/typeaheads/projects?format=json')
      .then(d => d.json())
      .then(({ results }) => {
        this.setState({
          projects: results
        })
      })
  }
  shouldComponentUpdate(nextProps){
    return havePropsChanged(['parentId', 'isParentExternal'], nextProps.rdr, this.props.rdr)
  }
  render() {
    return (
      <Item label={(
        <InputLabel
          tooltip="Check this box if you would like to indicate a related project that is not present in RSR. Instead, you will be able to fill in the IATI activity ID of the project."
          optional
          more={(
            <div className="more-switches">
              <Switch size="small" value={this.props.rdr.isParentExternal} onChange={value => this.props.editField('isParentExternal', value)} />
              <span>External project</span>
            </div>
          )}
        >Parent
        </InputLabel>
      )}>
        {this.props.rdr.isParentExternal &&
        <Input placeholder="IATI Identifier" value={this.props.rdr.parentId} onChange={ev => this.props.editField('parentId', ev.target.value)} />
        }
        {!this.props.rdr.isParentExternal &&
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {this.state.projects.map(project =>
            <Option value={project.id}>{project.title}</Option>
          )}
        </Select>
        }
      </Item>
    )
  }
}

const ParentPicker = connect(
  ({ infoRdr }) => ({ rdr: infoRdr }),
  actions
)(_ParentPicker)


const Info = ({ validations }) => {
  const validationSets = getValidationSets(validations)
  const isOptional = isFieldOptional(validationSets)
  return (
    <div className="info view">
      <Form layout="vertical">
        <Field
          name="title"
          render={props => (
            <Item label="Project title" validateStatus={props.value.length > 5 ? 'success' : ''} hasFeedback>
              <Input {...props} />
            </Item>
          )}
        />
        <Field
          name="subtitle"
          render={props => (
            <Item label="Project subtitle" validateStatus={props.value.length > 5 ? 'success' : ''} hasFeedback>
              <Input {...props} />
            </Item>
          )}
        />
        <Field
          name="iatiActivityId"
          render={props => (
            <Item label={(
              <InputLabel
                tooltip={<IatiTooltip />}
              >IATI Identifier
              </InputLabel>
            )}>
              <Input {...props} />
            </Item>
          )}
        />
        <ParentPicker />
        <Field
          name="iatiStatus"
          render={props => (
            <Item label={<InputLabel tooltip={<StatusTooltip />}>Status</InputLabel>}>
              <Select {...props}>
                {statusOptions.map(option => (
                  <Option value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Item>
          )}
        />
        <Row gutter={16}>
          <Col span={12}>
            <Field
              name="plannedStartDate"
              render={props => (
                <Item label={<InputLabel>Planned Start Date</InputLabel>}>
                  <DatePicker format="DD/MM/YYYY" {...{...props, ...datePickerConfig}} />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="plannedEndDate"
              render={props => (
                <Item label={<InputLabel>Planned End Date</InputLabel>}>
                  <DatePicker format="DD/MM/YYYY" {...{...props, ...datePickerConfig}} />
                </Item>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Field
              name="actualStartDate"
              render={props => (
                <Item label={<InputLabel optional={isOptional(props.name)}>Actual Start Date</InputLabel>}>
                  <DatePicker format="DD/MM/YYYY" {...{...props, ...datePickerConfig}} />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="actualEndDate"
              render={props => (
                <Item label={<InputLabel optional={isOptional(props.name)}>Actual End Date</InputLabel>}>
                  <DatePicker format="DD/MM/YYYY" {...{...props, ...datePickerConfig}} />
                </Item>
              )}
            />
          </Col>
        </Row>
        <Field
          name="currency"
          render={props => (
            <Item label={<InputLabel optional tooltip="The default currency for this project. Used in all financial aspects of the project.">Currency</InputLabel>}>
              <Select {...props} showSearch optionFilterProp="children">
                {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
              </Select>
            </Item>
          )}
        />
        <Field
          name="language"
          render={props => (
            <Item label={<InputLabel optional={isOptional(props.name)} tooltip="Enter the language used when entering the details for this project.">Language</InputLabel>}>
              <Select {...props}>
                {languages.map(({ code, label }) => <Option value={code}>{label}</Option>)}
              </Select>
            </Item>
          )}
        />
        <hr />
        <h3>Project photo</h3>
        <ProjectPhoto projectId={2} />
        <Field
          name="currentImageCaption"
          render={props => (
            <Item label={<InputLabel optional tooltip="Enter the name of the person who took the photo">Photo credit</InputLabel>}>
              <Input {...props} />
            </Item>
          )}
        />

        <Field
          name="currentImageCredit"
          render={props => (
            <Item label={<InputLabel optional tooltip="Briefly describe who or what you see in the photo.">Photo caption</InputLabel>}>
              <Input {...props} />
            </Item>
          )}
        />
        {(validations.indexOf(validationType.IATI) !== -1 || validations.indexOf(validationType.DGIS) !== -1) && (
          <div>
            <hr />
            <Field
              name="defaultAidTypeVocabulary"
              render={props => (
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of vocabulary being used for describing the type of the aid being supplied or activity being undertaken. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/203/codelists/AidTypeVocabulary/">http://iatistandard.org/203/codelists/AidTypeVocabulary/</a></span>}
                  >
                  Default aid type vocabulary
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    {aidTypeVocabularyOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultAidType"
              render={props => (
                <Item label={
                  <InputLabel
                    optional={isOptional(props.name)}
                    tooltip={<span>This is the IATI identifier for the type of aid being supplied or activity being undertaken. This element specifies a default for all the project’s financial transactions. This can be overridden at the individual transaction level. For reference, please visit:  <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/AidType/">http://iatistandard.org/202/codelists/AidType/</a></span>}
                  >
                  Default aid type
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    {aidTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultFlowType"
              render={props => (
                <Item label={
                  <InputLabel
                    optional={isOptional(props.name)}
                    tooltip={<span>This is the IATI identifier for how the activity (project) is funded. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/FlowType/">http://iatistandard.org/202/codelists/FlowType/</a></span>}
                  >
                  Default flow type
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    {flowTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultTiedStatus"
              render={props => (
                <Item label={
                  <InputLabel
                    optional={isOptional(props.name)}
                    tooltip={<span>This element specifies a default for all the activity’s financial transactions; it can be overridden at the individual transaction level. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/TiedStatus/">http://iatistandard.org/202/codelists/TiedStatus/</a></span>}
                  >
                  Default tied status
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    {tiedStatusOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                  </Select>
                </Item>
              )}
            />
            {validations.indexOf(validationType.IATI) !== -1 &&
            <div>
            <Field
              name="collaborationType"
              render={props => (
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of collaboration involved. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/CollaborationType/">http://iatistandard.org/202/codelists/CollaborationType/</a></span>}
                  >
                  Collaboration type
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    <Option value="1">1 - Bilateral</Option>
                    <Option value="2">2 - Multilateral (inflows)</Option>
                    <Option value="3">3 - Bilateral, core contributions to NGOs and other private bodies / PPPs</Option>
                    <Option value="4">4 - Multilateral outflows</Option>
                    <Option value="6">6 - Private sector outflows</Option>
                    <Option value="7">7 - Bilateral, ex-post reporting on NGOs’ activities funded through core contributions</Option>
                    <Option value="8">8 - bilateral, triangular co-operation: activities where one or more bilateral providers of development co-operation or international organisations support South-South co-operation, joining forces with developing countries to facilitate a sharing of knowledge and experience among all partners involved.</Option>
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultFinanceType"
              render={props => (
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of finance. This element specifies a default for all the transactions in the project’s activity report; it can be overridden at the individual transaction level. For reference visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/FinanceType/">http://iatistandard.org/202/codelists/FinanceType/</a></span>}
                  >
                  Default finance type
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    {financeTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                  </Select>
                </Item>
              )}
            />
            </div>
            }
          </div>
        )}
      </Form>
    </div>
  )
}

export default connect(
  ({ infoRdr }) => ({ validations: infoRdr.validations }),
  actions
)(Info)

// export default Info
