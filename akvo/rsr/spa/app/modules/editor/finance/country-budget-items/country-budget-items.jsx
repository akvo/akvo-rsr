import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber, Modal, Radio, Col, Row, DatePicker } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import * as actions from './actions'
import { budgetItemTypes } from '../../../../utils/constants'
import options from './options.json'

const { Item } = Form
const { Panel } = Collapse
const { Option } = Select
const Field = connect(
  ({ countryBudgetItemsRdr }) => ({ rdr: countryBudgetItemsRdr }),
  actions
)(_Field)


class CountryBudgetItems extends React.Component{
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
    this.props.add()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.remove(index)
  }
  render(){
    return (
      <div>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((budgetItem, index) => {
          return (
            <Panel
              header={budgetItem.code ? options.find(it => it.value === budgetItem.code).label : 'Country budget item'}
              extra={<span><Icon type="delete" onClick={event => this.remove(event, index)} /></span>}
              key={`p${index}`}
            >
              <UpdateHalter>
                <Form layout="vertical">
                  <Field
                    name="code"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional tooltip="...">Item code</InputLabel>}>
                        <Select {...props}>
                          {options.map(option => (
                            <Option value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      </Item>
                    )}
                  />
                  <div className="percentage-row">
                    <Field
                      name="percentage"
                      index={index}
                      render={props => (
                        <Item label="Percentage">
                          <Input {...props} suffix={<span>%</span>} className="capital-percentage" />
                        </Item>
                      )}
                    />
                    <Field
                      name="description"
                      index={index}
                      render={props => (
                        <Item label="Description">
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </div>
                </Form>
              </UpdateHalter>
            </Panel>
          )
        })}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add budget item</Button>

      </div>
    )
  }
}

export default connect(
  ({ countryBudgetItemsRdr }) => ({ rdr: countryBudgetItemsRdr }),
  actions
)(CountryBudgetItems)
