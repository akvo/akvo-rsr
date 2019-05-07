import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber, Modal, Radio, Col, Row, DatePicker } from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import * as actions from './actions'
import { budgetItemTypes } from '../../../../utils/constants'
import { validationType, datePickerConfig, Aux, inputNumberAmountFormatting } from '../../../../utils/misc'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'

const { Item } = Form
const { Panel } = Collapse
const { Option } = Select
const Field = connect(
  ({ budgetItemsRdr }) => ({ rdr: budgetItemsRdr }),
  { editField: actions.editBudgetField }
)(_Field)


class BudgetItems extends React.Component{
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
    let currencySymbol = getSymbolFromCurrency(this.props.currency)
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <div>
        <p className="total">
          Total budget:
          <span className="amount"><b>{String(`${currencySymbol}${this.total()}`).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></span>
        </p>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((budgetItem, index) => {
          if(isIATI && budgetItem.currency){
            currencySymbol = getSymbolFromCurrency(budgetItem.currency)
          }
          return (
            <Panel
              header={`${budgetItemTypes.find(it => it.value === budgetItem.type).label}`}
              extra={<span><span className="amount">{currencySymbol}{String(budgetItem.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span><Icon type="delete" onClick={event => this.remove(event, index)} /></span>}
              key={`p${index}`}
            >
              <UpdateHalter>
                <Row gutter={16}>
                  {isIATI && (
                    <Col span={12}>
                      <Field
                        name="currency"
                        index={index}
                        render={fieldProps => (
                          <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
                            <Select showSearch optionFilterProp="children" {...fieldProps}>
                              {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
                            </Select>
                          </Item>
                        )}
                      />
                    </Col>
                  )}
                  <Col span={12}>
                    <Field
                      name="amount"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel tooltip="...">Amount</InputLabel>}>
                          <InputNumber
                            {...{...props, ...inputNumberAmountFormatting}}
                            step={1000}
                          />
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Field
                  name="label"
                  index={index}
                  render={props => (
                    <Item label={<InputLabel optional tooltip="...">Additional info</InputLabel>}>
                      <Input {...props} />
                    </Item>
                  )}
                />
                {isIATI && (
                  <Aux>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Field
                          name="budgetType"
                          index={index}
                          render={props => (
                            <Item label="Budget type">
                              <Radio.Group {...props}>
                                <Radio.Button value={1}>Original</Radio.Button>
                                <Radio.Button value={2}>Revised</Radio.Button>
                              </Radio.Group>
                            </Item>
                          )}
                        />
                      </Col>
                      <Col span={12}>
                        <Field
                          name="status"
                          index={index}
                          render={props => (
                            <Item label="Status">
                              <Radio.Group {...props}>
                                <Radio.Button value={1}>Indicative</Radio.Button>
                                <Radio.Button value={2}>Committed</Radio.Button>
                              </Radio.Group>
                            </Item>
                          )}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Field
                          name="periodStart"
                          index={index}
                          render={props => (
                            <Item label="Period start">
                              <DatePicker {...{...props, ...datePickerConfig}} />
                            </Item>
                          )}
                        />
                      </Col>
                      <Col span={8}>
                        <Field
                          name="periodEnd"
                          index={index}
                          render={props => (
                            <Item label="Period end">
                              <DatePicker {...{...props, ...datePickerConfig}} />
                            </Item>
                          )}
                        />
                      </Col>
                      <Col span={8}>
                        <Field
                          name="valueDate"
                          index={index}
                          render={props => (
                            <Item label="Exchange rate date">
                              <DatePicker {...{...props, ...datePickerConfig}} />
                            </Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </Aux>
                )}
              </UpdateHalter>
            </Panel>
          )
        })}
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
  ({ budgetItemsRdr, infoRdr }) => ({ rdr: budgetItemsRdr, currency: infoRdr.currency, validations: infoRdr.validations }),
  actions
)(BudgetItems)
