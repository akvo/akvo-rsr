import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Col, Row } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { budgetItemTypes } from '../../../../utils/constants'
import { Aux } from '../../../../utils/misc'
import { validationType, isFieldOptional } from '../../../../utils/validation-utils'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import { getValidationSets } from './validations'

const { Item } = Form

const totalBudgetReducer = (acc, budgetItem) => {
  if(Number(budgetItem.amount) > 0){
    return acc + Number(budgetItem.amount)
  }
  return acc
}

const BudgetItems = ({ formPush, validations, currency }) => {
  const currencySymbol = getSymbolFromCurrency(currency)
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  const validationSets = getValidationSets(validations)
  const isOptional = isFieldOptional(validationSets)
  return (
    <div>
      <div className="total">
        Total budget:
        <span className="amount">
          <Field name="budgetItems" subscription={{ value: true }}>
            {({ input }) => {
              if(!isIATI){
                const total = input.value.reduce(totalBudgetReducer, 0)
                return <b>{String(`${currencySymbol}${total}`).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
              }
              const mixedCurrencies = input.value.reduce((acc, budgetItem) => {
                if(acc.indexOf(budgetItem.currency) === -1){
                    return [...acc, budgetItem.currency]
                  }
                  return acc
              }, [])
              if(!mixedCurrencies) return null
              const lis = mixedCurrencies.map(curr => {
                const total = input.value.filter(it => it.currency === curr).reduce(totalBudgetReducer, 0)
                return <li><b>{getSymbolFromCurrency(curr)}{String(`${total}`).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></li>
              })
              return <ul>{lis}</ul>
            }}
          </Field>
        </span>
      </div>
      <ItemArray
        setName="budgetItems"
        sectionIndex={6}
        header={(index, type) => {
          return <span>{budgetItemTypes.find(it => it.value === type).label}</span>
        }}
        headerField="type"
        headerMore={(index, amount) => {
          if(!isIATI){
            return <span className="amount">{currencySymbol}{amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
          }
          return (
            <Field name={`budgetItems[${index}].currency`} subscription={{ value: true }}>
              {({ input }) => (<span className="amount">{input.value ? getSymbolFromCurrency(input.value) : currencySymbol}{amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>)}
            </Field>
          )
        }}
        headerMoreField="amount"
        formPush={formPush}
        newItem={{ currency: 'EUR', administratives: [{}]}}
        panel={name => {
          return (
            <div>
              <Row gutter={16}>
                {isIATI && (
                  <Col span={12}>
                    <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
                    <FinalField
                      name={`${name}.currency`}
                      defaultValue={currency}
                      control="select"
                      options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
                      showSearch
                      optionFilterProp="children"
                    />
                    </Item>
                  </Col>
                )}
                <Col span={12}>
                  <Item label={<InputLabel tooltip="...">Amount</InputLabel>}>
                  <FinalField
                    name={`${name}.amount`}
                    control="input-number"
                  />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional tooltip="...">Additional info</InputLabel>}>
              <FinalField
                name={`${name}.label`}
              />
              </Item>
              {isIATI && (
                <Aux>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Item label={<InputLabel optional>Budget type</InputLabel>}>
                      <FinalField
                        name={`${name}.budgetType`}
                        render={({ input }) => (
                            <Radio.Group {...input}>
                              <Radio.Button value={1}>Original</Radio.Button>
                              <Radio.Button value={2}>Revised</Radio.Button>
                            </Radio.Group>
                        )}
                      />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label={<InputLabel optional>Status</InputLabel>}>
                      <FinalField
                        name={`${name}.status`}
                        render={({ input }) => (
                            <Radio.Group {...input}>
                              <Radio.Button value={1}>Indicative</Radio.Button>
                              <Radio.Button value={2}>Committed</Radio.Button>
                            </Radio.Group>
                        )}
                      />
                      </Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Item label="Period start">
                      <FinalField
                        name={`${name}.periodStart`}
                        control="datepicker"
                      />
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item label="Period end">
                      <FinalField
                        name={`${name}.periodEnd`}
                        control="datepicker"
                      />
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item label={<InputLabel optional={isOptional('valueDate')}>Value date</InputLabel>}>
                      <FinalField
                        name={`${name}.valueDate`}
                        control="datepicker"
                      />
                      </Item>
                    </Col>
                  </Row>
                </Aux>
              )}
            </div>
          )
        }}
        modal={{
          buttonText: 'Add Budget Item',
          className: 'add-budget-item-modal',
          component: ({ onClick }) => (
            <div>
              {budgetItemTypes.map(type => (
                <div className="desc-block">
                  <Button block icon="plus" onClick={() => onClick({ type: type.value })}>{type.label}</Button>
                </div>
              ))}
            </div>
          )
        }}
      />
    </div>
  )
}


export default connect(
  ({ editorRdr: { section1: { fields: { currency } }}}) => ({ currency }),
)(BudgetItems)
