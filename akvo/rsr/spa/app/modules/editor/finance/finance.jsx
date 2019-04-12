import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, InputNumber, Modal } from 'antd'

import InputLabel from '../../../utils/input-label'
import { budgetItemTypes } from '../../../utils/constants'

import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form

class Finance extends React.Component{
  state = {
    activeKey: '',
    modalVisible: false
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
    this.props.addBudget()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeBudget(index)
  }
  addType = (type) => {
    this.setState({
      modalVisible: false,
      activeKey: `p${this.props.rdr.length}`
    })
    this.props.addBudget(type)
  }
  total = () => this.props.rdr.reduce((acc, budgetItem) => {
    if(Number(budgetItem.amount) > 0){
      return acc + Number(budgetItem.amount)
    }
    return acc
  }, 0)
  render(){
    return (
      <div className="finance view">
        <p className="total">The total value of all budget items is <b>{String(this.total()).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> EUR</p>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((budgetItem, index) =>
            <Panel
              header={`Budget item: ${budgetItemTypes.find(it => it.value === budgetItem.type).label}`}
              extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
              key={`p${index}`}
            >
              <Form layout="vertical">
                {/* <Item label={<InputLabel optional tooltip="...">Contact type</InputLabel>}>
                  <Select value={budgetItem.type} onChange={value => this.props.editBudgetField(index, 'type', value)}>
                    {budgetItemTypes.map(type =>
                      <Option key={type.value} value={type.value}>{type.label}</Option>
                    )}
                  </Select>
                </Item> */}
                <Item label={<InputLabel tooltip="...">Amount</InputLabel>}>
                  <InputNumber
                    formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/€\s?|(,*)/g, '')}
                    value={budgetItem.amount}
                    onChange={value => this.props.editBudgetField(index, 'amount', value)}
                    style={{ width: 200 }}
                    step={1000}
                  />
                </Item>
                <Item label={<InputLabel optional tooltip="...">Additional info</InputLabel>}>
                  <Input value={budgetItem.label} onChange={event => this.props.editBudgetField(index, 'label', event.target.value)} />
                </Item>
              </Form>
            </Panel>
        )}
        </Collapse>
        <Button className="add-budget" icon="plus" type="dashed" block onClick={() => this.setState({ modalVisible: true })}>Add another budget item</Button>

        <Modal
          title="Add Budget"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
          className="add-budget-item-modal"
        >
          {budgetItemTypes.map(type => (
            <div className="desc-block">
              <Button block icon="plus" onClick={() => this.addType(type.value)}>{type.label}</Button>
            </div>
          ))}
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ budgetItemsRdr }) => ({ rdr: budgetItemsRdr }),
  actions
)(Finance)
