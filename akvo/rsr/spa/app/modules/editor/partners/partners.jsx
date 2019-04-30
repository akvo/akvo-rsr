import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber } from 'antd'

import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select

const roles = [
  { value: 2, label: 'Accountable partner'},
  { value: 3, label: 'Extending partner'},
  { value: 1, label: 'Funding partner'},
  { value: 4, label: 'Implementing partner'},
  { value: 101, label: 'Reporting organization'},
  { value: 100, label: 'Sponsor partner'}
]

class Partners extends React.Component{
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
    this.props.addPartner()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removePartner(index)
  }
  render(){
    return (
      <div className="partners view">
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((partner, index) =>
            <Panel
              header={`${roles.find(it => it.value === partner.role).label}: ${partner.name}`}
              extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
              key={`p${index}`}
            >
              <Form layout="vertical">
                <Item label="Role">
                  <Select value={partner.role} onChange={value => this.props.editPartnerField(index, 'role', value)}>
                    {roles.map(role =>
                      <Option key={role.value} value={role.value}>{role.label}</Option>
                    )}
                  </Select>
                </Item>
                <Item label="Organisation">
                  <Input value={partner.name} onChange={event => this.props.editPartnerField(index, 'name', event.target.value)} />
                </Item>
                {partner.role === 101 &&
                <Item label="Secondary reporter">
                  {/* <Switch /> */}
                  <Button.Group>
                    <Button disabled={partner.secondaryReporter}>Yes</Button>
                    <Button disabled={!partner.secondaryReporter}>No</Button>
                  </Button.Group>
                </Item>
                }
                {partner.role === 1 &&
                <Item label="Funding amount">
                  <InputNumber
                    formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/€\s?|(,*)/g, '')}
                    value={partner.fundingAmount}
                    onChange={value => this.props.editPartnerField(index, 'fundingAmount', value)}
                    style={{ width: 200 }}
                    step={1000}
                  />
                </Item>
                }
              </Form>
            </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add a partner</Button>
      </div>
    )
  }
}

export default connect(
  ({ partnersRdr }) => ({ rdr: partnersRdr }),
  actions
)(Partners)
