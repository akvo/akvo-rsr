import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, InputNumber, Modal } from 'antd'

import InputLabel from '../../../utils/input-label'
import { budgetItemTypes } from '../../../utils/constants'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'

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
  budgetAdded = (budgetType) => {
    let ret = false
    for(let i = 0; i < this.props.rdr.length; i += 1){
      if(this.props.rdr[i].type === budgetType){
        ret = true
        break
      }
    }
    return ret
  }
  render(){
    const currencySymbol = getSymbolFromCurrency(this.props.infoRdr.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    return (
      <div className="finance view">
        <p className="total">Total budget:<span className="amount"><b>{String(`${currencySymbol}${this.total()}`).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></span></p>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((budgetItem, index) =>
            <Panel
              header={`${budgetItemTypes.find(it => it.value === budgetItem.type).label}`}
              extra={<span><span className="amount">{currencySymbol}{String(budgetItem.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span><Icon type="delete" onClick={event => this.remove(event, index)} /></span>}
              key={`p${index}`}
            >
              <Form layout="vertical">
                <Item label={<InputLabel tooltip="...">Amount</InputLabel>}>
                  <InputNumber
                    formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(currencyRegExp, '')}
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
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={() => this.setState({ modalVisible: true })}>Add budget item</Button>

        <Modal
          title="Add Budget"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
          className="add-budget-item-modal"
        >
          {budgetItemTypes.filter(it => !this.budgetAdded(it.value)).map(type => (
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
  ({ budgetItemsRdr, infoRdr }) => ({ rdr: budgetItemsRdr, infoRdr }),
  actions
)(Finance)
