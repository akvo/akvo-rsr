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
import { validationType, isFieldOptional, getValidationSets, doesFieldExist } from '../../../../utils/validation-utils'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import validationDefs from './validations'
import Condition from '../../../../utils/condition';

const { Item } = Form

const totalBudgetReducer = (acc, budgetItem) => {
  if(Number(budgetItem.amount) > 0){
    return acc + Number(budgetItem.amount)
  }
  return acc
}

const BudgetItems = ({ formPush, validations, currency = 'EUR' }) => {
  const currencySymbol = getSymbolFromCurrency(currency)
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const fieldExists = doesFieldExist(validationSets)
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
        header={(index, label) => {
          if(!label) return null
          return <span>Budget item {index + 1}: {budgetItemTypes.find(it => it.value === String(label)).label}</span>
        }}
        headerField="label"
        headerMore={(index, amount) => {
          if(!fieldExists('currency')){
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
                {fieldExists('currency') && (
                  <Col span={12}>
                    <FinalField
                      name={`${name}.currency`}
                      defaultValue={currency}
                      control="select"
                      options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
                      showSearch
                      optionFilterProp="children"
                      withLabel
                      optional
                    />
                  </Col>
                )}
                <Col span={12}>
                  <FinalField
                    name={`${name}.amount`}
                    control="input-number"
                    withLabel
                    fieldExists={fieldExists}
                  />
                </Col>
              </Row>
              <Condition when={`${name}.label`} is="38">
              <FinalField
                name={`${name}.otherExtra`}
                control="input"
                withLabel
                optional
                fieldExists={fieldExists}
              />
              </Condition>

              <Row gutter={16}>
                {fieldExists('budgetType') &&
                <Col span={12}>
                  <Item label={<InputLabel optional>Budget type</InputLabel>}>
                  <FinalField
                    name={`${name}.type`}
                    render={({ input }) => (
                        <Radio.Group {...input}>
                          <Radio.Button value={1}>Original</Radio.Button>
                          <Radio.Button value={2}>Revised</Radio.Button>
                        </Radio.Group>
                    )}
                  />
                  </Item>
                </Col>
                }
                {fieldExists('status') &&
                <Col span={12}>
                  <Item label={<InputLabel optional={isOptional('status')}>Status</InputLabel>}>
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
                }
              </Row>

              {fieldExists('periodStart') &&
              <Row gutter={16}>
                <Col span={8}>
                  <FinalField
                    name={`${name}.periodStart`}
                    control="datepicker"
                    withLabel
                    optional={isOptional}
                  />
                </Col>
                <Col span={8}>
                  <FinalField
                    name={`${name}.periodEnd`}
                    control="datepicker"
                    withLabel
                    optional={isOptional}
                  />
                </Col>
                <Col span={8}>
                  <FinalField
                    name={`${name}.valueDate`}
                    control="datepicker"
                    withLabel
                    optional={isOptional}
                  />
                </Col>
              </Row>
              }
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
                  <Button block icon="plus" onClick={() => onClick({ label: type.value })}>{type.label}</Button>
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
