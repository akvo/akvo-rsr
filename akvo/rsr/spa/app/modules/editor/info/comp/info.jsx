/* global fetch */
import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Switch, DatePicker, Select, Row, Col
} from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import { datePickerConfig, havePropsChanged } from '../../../../utils/misc'
import * as actions from '../actions'
import ProjectPhoto from './project-photo'

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
  componentShouldUpdate(nextProps){
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
  const isIATI = validations.indexOf(2) !== -1
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
                <Item label={<InputLabel>Actual Start Date</InputLabel>}>
                  <DatePicker format="DD/MM/YYYY" {...{...props, ...datePickerConfig}} />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="actualEndDate"
              render={props => (
                <Item label={<InputLabel>Actual End Date</InputLabel>}>
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
          name="languages"
          render={props => (
            <Item label={<InputLabel optional tooltip="Enter the language used when entering the details for this project.">Language</InputLabel>}>
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
        {isIATI && (
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
                    <Option value="1">1 - OECD DAC</Option>
                    <Option value="2">2 - Earmarking Category</Option>
                    <Option value="3">3 - Earmarking Modality</Option>
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultAidType"
              render={props => (
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This is the IATI identifier for the type of aid being supplied or activity being undertaken. This element specifies a default for all the project’s financial transactions. This can be overridden at the individual transaction level. For reference, please visit:  <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/AidType/">http://iatistandard.org/202/codelists/AidType/</a></span>}
                  >
                  Default aid type
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    <Option value="D02">D02 - Other technical assistance</Option><Option value="D01">D01 - Donor country personnel</Option><Option value="A02">A02 - Sector budget support</Option><Option value="H02">H02 - Refugees in donor countries</Option><Option value="H01">H01 - Development awareness</Option><Option value="A01">A01 - General budget support</Option><Option value="E02">E02 - Imputed student costs</Option><Option value="E01">E01 - Scholarships/training in donor country</Option><Option value="B01">B01 - Core support to NGOs, other private bodies, PPPs and research institutes</Option><Option value="B03">B03 - Contributions to specific-purpose programmes and funds managed by international organisations (multilateral, INGO)</Option><Option value="B02">B02 - Core contributions to multilateral institutions</Option><Option value="F01">F01 - Debt relief</Option><Option value="B04">B04 - Basket funds/pooled funding</Option><Option value="C01">C01 - Project-type interventions</Option><Option value="G01">G01 - Administrative costs not included elsewhere</Option>
                  </Select>
                </Item>
              )}
            />
            <Field
              name="defaultTiedStatus"
              render={props => (
                <Item label={
                  <InputLabel
                    optional
                    tooltip={<span>This element specifies a default for all the activity’s financial transactions; it can be overridden at the individual transaction level. For reference, please visit: <a target="_blank" rel="noopener noreferrer" href="http://iatistandard.org/202/codelists/TiedStatus/">http://iatistandard.org/202/codelists/TiedStatus/</a></span>}
                  >
                  Default tied status
                  </InputLabel>}
                >
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    <Option value="3">3 - Partially tied</Option>
                    <Option value="4">4 - Tied</Option>
                    <Option value="5">5 - Untied</Option>
                  </Select>
                </Item>
              )}
            />
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
                    <Option value="110">110 - Standard grant</Option>
                    <Option value="111">111 - Subsidies to national private investors</Option>
                    <Option value="210">210 - Interest subsidy</Option>
                    <Option value="211">211 - Interest subsidy to national private exporters</Option>
                    <Option value="310">310 - Capital subscription on deposit basis</Option>
                    <Option value="311">311 - Capital subscription on encashment basis</Option>
                    <Option value="410">410 - Aid loan excluding debt reorganisation</Option>
                    <Option value="411">411 - Investment-related loan to developing countries</Option>
                    <Option value="412">412 - Loan in a joint venture with the recipient</Option>
                    <Option value="413">413 - Loan to national private investor</Option>
                    <Option value="414">414 - Loan to national private exporter</Option>
                    <Option value="421">421 - Standard loan</Option>
                    <Option value="422">422 - Reimbursable grant</Option>
                    <Option value="423">423 - Bonds</Option>
                    <Option value="424">424 - Asset-backed securities</Option>
                    <Option value="425">425 - Other debt securities</Option>
                    <Option value="431">431 - Subordinated loan</Option>
                    <Option value="432">432 - Preferred equity</Option>
                    <Option value="433">433 - Other hybrid instruments</Option>
                    <Option value="451">451 - Non-banks guaranteed export credits</Option>
                    <Option value="452">452 - Non-banks non-guaranteed portions of guaranteed export credits</Option>
                    <Option value="453">453 - Bank export credits</Option>
                    <Option value="510">510 - Common equity</Option>
                    <Option value="511">511 - Acquisition of equity not part of joint venture in developing countries</Option>
                    <Option value="512">512 - Other acquisition of equity</Option>
                    <Option value="520">520 - Shares in collective investment vehicles</Option>
                    <Option value="530">530 - Reinvested earnings</Option>
                    <Option value="610">610 - Debt forgiveness/conversion: ODA claims (P)</Option>
                    <Option value="611">611 - Debt forgiveness/conversion: ODA claims (I)</Option>
                    <Option value="612">612 - Debt forgiveness/conversion: OOF claims (P)</Option>
                    <Option value="613">613 - Debt forgiveness/conversion: OOF claims (I)</Option>
                    <Option value="614">614 - Debt forgiveness/conversion: Private claims (P)</Option>
                    <Option value="615">615 - Debt forgiveness/conversion: Private claims (I)</Option>
                    <Option value="616">616 - Debt forgiveness: OOF claims (DSR)</Option>
                    <Option value="617">617 - Debt forgiveness: Private claims (DSR)</Option>
                    <Option value="618">618 - Debt forgiveness: Other</Option>
                    <Option value="620">620 - Debt rescheduling: ODA claims (P)</Option>
                    <Option value="621">621 - Debt rescheduling: ODA claims (I)</Option>
                    <Option value="622">622 - Debt rescheduling: OOF claims (P)</Option>
                    <Option value="623">623 - Debt rescheduling: OOF claims (I)</Option>
                    <Option value="624">624 - Debt rescheduling: Private claims (P)</Option>
                    <Option value="625">625 - Debt rescheduling: Private claims (I)</Option>
                    <Option value="626">626 - Debt rescheduling: OOF claims (DSR)</Option>
                    <Option value="627">627 - Debt rescheduling: Private claims (DSR)</Option>
                    <Option value="630">630 - Debt rescheduling: OOF claim (DSR – original loan principal)</Option>
                    <Option value="631">631 - Debt rescheduling: OOF claim (DSR – original loan interest)</Option>
                    <Option value="632">632 - Debt rescheduling: Private claim (DSR – original loan principal)</Option>
                    <Option value="633">633 - Debt forgiveness/conversion: export credit claims (P)</Option>
                    <Option value="634">634 - Debt forgiveness/conversion: export credit claims (I)</Option>
                    <Option value="635">635 - Debt forgiveness: export credit claims (DSR)</Option>
                    <Option value="636">636 - Debt rescheduling: export credit claims (P)</Option>
                    <Option value="637">637 - Debt rescheduling: export credit claims (I)</Option>
                    <Option value="638">638 - Debt rescheduling: export credit claims (DSR)</Option>
                    <Option value="639">639 - Debt rescheduling: export credit claim (DSR – original loan principal)</Option>
                    <Option value="710">710 - Foreign direct investment</Option>
                    <Option value="711">711 - Other foreign direct investment, including reinvested earnings</Option>
                    <Option value="810">810 - Bank bonds</Option>
                    <Option value="811">811 - Non-bank bonds</Option>
                    <Option value="910">910 - Other bank securities/claims</Option>
                    <Option value="911">911 - Other non-bank securities/claims</Option>
                    <Option value="912">912 - Securities and other instruments issued by multilateral agencies</Option>
                  </Select>
                </Item>
              )}
            />
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
