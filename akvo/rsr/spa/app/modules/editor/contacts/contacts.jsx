import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, Col, Row } from 'antd'

import InputLabel from '../../../utils/input-label'
import { isFieldOptional, isFieldValid } from '../../../utils/validation-utils'
import { getValidationSets } from './validations'
import _Field from '../../../utils/field'

import * as actions from './actions'
import './styles.scss'
import UpdateHalter from '../../../utils/update-halter';

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ contactsRdr }) => ({ rdr: contactsRdr }),
  { editField: actions.editContactField }
)(_Field)

const contactTypes = [
  { value: 1, label: 'General Inquiries'},
  { value: 2, label: 'Project Management'},
  { value: 3, label: 'Financial Management'},
  { value: 4, label: 'Communications'}
]

class Contacts extends React.Component{
  state = {
    activeKey: ''
  }
  constructor(props){
    super(props)
    if(props.rdr.length > 0){
      this.state = {
        activeKey: `${props.rdr.length - 1}`
      }
    }
  }
  add = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.addContact()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeContact(index)
  }
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const isOptional = isFieldOptional(validationSets)
    const isValid = isFieldValid(validationSets)
    return (
      <div className="partners view">
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((contact, index) =>
          <Panel
            header={`Contact: ${contact.name}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                  <Field
                    name="type"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional tooltip="What types of enquiries this contact person is best-placed to handle.">Type</InputLabel>}>
                        <Select {...props}>
                          <Option value="">&nbsp;</Option>
                          {contactTypes.map(type =>
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                          )}
                        </Select>
                      </Item>
                    )}
                  />
                  </Col>
                  <Col span={12}>
                  <Field
                    name="jobTitle"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>Job title</InputLabel>}>
                        <Input {...props} />
                      </Item>
                    )}
                  />
                  </Col>
                </Row>
                <Field
                  name="name"
                  index={index}
                  render={props => (
                    <Item label={<InputLabel optional tooltip="Please enter the name of the contact person for this project.">Name</InputLabel>}>
                      <Input {...props} />
                    </Item>
                  )}
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name="organisation"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional tooltip="The organisation that the contact person works for.">Organisation</InputLabel>}>
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="department"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Department</InputLabel>}>
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Field
                  name="email"
                  index={index}
                  render={props => (
                    <Item
                      hasFeedback
                      validateStatus={isValid(props.name, props.value) && props.value ? 'success' : ''}
                      label={(
                      <InputLabel optional={isOptional(props.name)}>
                        Email
                      </InputLabel>
                      )}
                    >
                      <Input {...props} />
                    </Item>
                  )}
                />
                <Field
                  name="address"
                  index={index}
                  render={props => (
                    <Item
                      hasFeedback
                      validateStatus={isValid(props.name, props.value) && props.value ? 'success' : ''}
                      label={<InputLabel optional={isOptional(props.name)}>Address</InputLabel>}
                    >
                      <Input {...props} />
                    </Item>
                  )}
                />
                <Field
                  name="website"
                  index={index}
                  render={props => (
                    <Item label={<InputLabel optional>Website</InputLabel>}>
                      <Input {...props} />
                    </Item>
                  )}
                />
              </Form>
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add a contact</Button>
      </div>
    )
  }
}

export default connect(
  ({ contactsRdr, infoRdr }) => ({ rdr: contactsRdr, validations: infoRdr.validations }),
  actions
)(Contacts)
