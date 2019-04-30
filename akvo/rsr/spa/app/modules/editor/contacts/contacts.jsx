import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, Switch, Tooltip } from 'antd'

import InputLabel from '../../../utils/input-label'

import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select

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
        activeKey: `p${props.rdr.length - 1}`
      }
    }
  }
  add = () => {
    this.setState({
      activeKey: `p${this.props.rdr.length}`
    })
    this.props.addContact()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeContact(index)
  }
  render(){
    return (
      <div className="partners view">
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((contact, index) =>
            <Panel
              header={`Contact: ${contact.name}`}
              extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
              key={`p${index}`}
            >
              <Form layout="vertical">
                <Item label={<InputLabel optional tooltip="What types of enquiries this contact person is best-placed to handle.">Contact type</InputLabel>}>
                  <Select value={contact.type} onChange={value => this.props.editContactField(index, 'type', value)}>
                    {contactTypes.map(type =>
                      <Option key={type.value} value={type.value}>{type.label}</Option>
                    )}
                  </Select>
                </Item>
                <Item label={<InputLabel optional tooltip="Please enter the name of the contact person for this project.">Contact name</InputLabel>}>
                  <Input value={contact.name} onChange={event => this.props.editContactField(index, 'name', event.target.value)} />
                </Item>
                <Item label={<InputLabel optional tooltip="The organisation that the contact person works for.">Contact organisation</InputLabel>}>
                  <Input value={contact.organisation} onChange={event => this.props.editContactField(index, 'organisation', event.target.value)} />
                </Item>
                <Item label={(
                <InputLabel optional>
                  Email
                </InputLabel>
                )}
                >
                  <Input value={contact.email} onChange={event => this.props.editContactField(index, 'email', event.target.value)} />
                </Item>
              </Form>
            </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add a contact</Button>
      </div>
    )
  }
}

export default connect(
  ({ contactsRdr }) => ({ rdr: contactsRdr }),
  actions
)(Contacts)
