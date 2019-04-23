import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Switch, Icon, Tooltip, DatePicker, Select, Upload
} from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../utils/input-label'
import * as actions from './actions'

import './styles.scss'

const { Item } = Form
const { RangePicker } = DatePicker
const { Option } = Select

const statuses = [
  'Identification', 'Implementation', 'Completion', 'Post-completion'// , 'Canceled', 'Suspended'
]
const marks = {}
statuses.forEach((status, index) => { marks[index + 1] = { style: { fontSize: 11, marginTop: 6, whiteSpace: 'nowrap' }, label: status } })

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

class _Field extends React.Component{
  shouldComponentUpdate(nextProps){
    if(nextProps.rdr[this.props.name] !== this.props.rdr[this.props.name]) return true
    return false
  }
  render(){
    return this.props.render({
      value: this.props.rdr[this.props.name],
      onChange: (...args) => {
        let value
        if(typeof args[0] === 'object' && args[0].hasOwnProperty('target')){
          value = args[0].target.value
        } else {
          value = args[0]
        }
        this.props.editField(this.props.name, value)
      }
    })
  }
}

const Field = connect(
  ({ infoRdr }) => ({ rdr: infoRdr }),
  actions
)(_Field)

const Info = () => (
  <div className="info view">
    <Form layout="vertical">
      <Field
        name="title"
        render={({value, onChange}) => (
          <Item label="Project title" validateStatus={value.length > 5 ? 'success' : ''} hasFeedback>
            <Input value={value} onChange={onChange} />
          </Item>
        )}
      />
      <Field
        name="iatiActivityId"
        render={props => (
          <Item label={(
            <InputLabel
              tooltip={<IatiTooltip />}
              optional
              more={(
                <div className="more-switches">
                  <Switch size="small" />
                  <span>External project <Tooltip title="Not in RSR"><Icon type="info-circle" /></Tooltip></span>
                </div>
              )}
            >Parent project
            </InputLabel>
          )}>
            <Input {...props} placeholder="IATI identifier" />
          </Item>
        )}
      />
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
      <Field
        name="plannedDuration"
        render={props => (
          <Item label={(<span>Planned duration</span>)}>
            <RangePicker format="DD/MM/YYYY" {...props} />
          </Item>
        )}
      />
      <Field
        name="actualDuration"
        render={props => (
          <Item label={(<span>Actual duration</span>)}>
            <RangePicker format="DD/MM/YYYY" {...props} />
          </Item>
        )}
      />
      <Field
        name="currency"
        render={props => (
          <Item label={<InputLabel optional tooltip="The default currency for this project. Used in all financial aspects of the project.">Currency</InputLabel>}>
            <Select {...props} showSearch>
              {currencies.map(({ code, currency }) => <Option value={`${code} - ${currency}`}>{code} - {currency}</Option>)}
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
      <Item label={<InputLabel tooltip="Add your project photo here. You can only add one photo. If you have more, you can add them via RSR updates when your project is published. A photo album will feature on the project page. The photo should not be larger than 2 MB in size, and should preferably be in JPG format.">Photo</InputLabel>}>
        <Upload.Dragger name="files" listType="picture" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <Icon type="picture" theme="twoTone" />
          </p>
          <p className="ant-upload-text">Drag file here</p>
          <p className="ant-upload-hint">or click to browse from computer</p>
        </Upload.Dragger>
      </Item>

      <Field
        name="currentImageCaption"
        render={props => (
          <Item label={<InputLabel optional tooltip="Enter who took the photo.">Photo credit</InputLabel>}>
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
    </Form>
  </div>
)

export default connect(
  null,
  actions
)(Info)

// export default Info
