import React from 'react'
import { Collapse, Icon, Form, Input, Button, Select } from 'antd'

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select

const roles = [
  { value: 1, label: 'Funding partner'},
  { value: 2, label: 'Accountable partner'},
  { value: 3, label: 'Extending partner'},
  { value: 4, label: 'Implementing partner'},
  { value: 100, label: 'Sponsor partner'},
  { value: 101, label: 'Reporting organization'}
]
const newPartner = {
  name: '', role: 0, reporter: ''
}

class Partners extends React.Component{
  state = {
    partners: [Object.assign({}, newPartner)],
    activeKey: ''
  }
  add = () => {
    this.setState({
      partners: [...this.state.partners, Object.assign({}, newPartner)],
      activeKey: `p${this.state.partners.length}`
    })
  }
  remove = (event) => {
    event.stopPropagation()
  }
  render(){
    return (
      <div className="partners view">
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.state.partners.map((partner, index) =>
            <Panel
              header={`${roles[partner.role].label}: ${partner.name}`}
              extra={<Icon type="delete" onClick={this.remove} />}
              key={`p${index}`}
            >
              <Form layout="vertical">
                <Item label="Organisation">
                  <Input />
                </Item>
                <Item label="Role">
                  <Select defaultValue={1}>
                    {roles.map(role =>
                      <Option value={role.value}>{role.label}</Option>
                    )}
                  </Select>
                </Item>
                <Item label="Secondary reporter">
                  <Input />
                </Item>
              </Form>
            </Panel>
        )}
        </Collapse>
        <Button icon="plus" type="dashed" block onClick={this.add}>Add a partner</Button>
      </div>
    )
  }
}

export default Partners
