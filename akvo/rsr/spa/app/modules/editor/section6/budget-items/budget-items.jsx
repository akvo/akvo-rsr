import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Col, Row, Pagination, Input, Icon } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { budgetItemTypes } from '../../../../utils/constants'
import { validationType, isFieldOptional, getValidationSets, doesFieldExist } from '../../../../utils/validation-utils'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import validationDefs from './validations'
import Condition from '../../../../utils/condition'
import MinRequired from '../../../../utils/min-required'
import { setNumberFormat } from '../../../../utils/misc'

const { Item } = Form

const BudgetType = ({ name, t }) => {
  return (
    <Col span={12}>
      <Item label={<InputLabel optional>{t('budget type')}</InputLabel>}>
        <FinalField
          name={`${name}.type`}
          render={({ input }) => (
            <Radio.Group {...input}>
              <Radio.Button value={1}>{t('Original')}</Radio.Button>
              <Radio.Button value={2}>{t('Revised')}</Radio.Button>
            </Radio.Group>
          )}
        />
      </Item>
    </Col>
  )
}

const Aux = node => node.children

const BudgetItems = ({
  currency = 'EUR',
  activeKey = '0',
  currentPage = 1,
  mixedCurrencies,
  totalDiffBudget,
  totalBudget,
  formPush,
  validations,
  total,
  onSearch,
  onPage
}) => {
  const { t } = useTranslation()
  const currencySymbol = getSymbolFromCurrency(currency)
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  const isDGIS = validations.indexOf(validationType.DGIS) !== -1
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <div className="min-required-wrapper">
        <h3>{t('Budget items')}</h3>
        <MinRequired section="section6" setName="budgetItems" />
      </div>
      <div className="total">
        {t('Total budget')}:
        <span className="amount">
          <Field name="budgetItems" subscription={{ value: true }}>
            {({ input }) => {
              if (!isIATI) {
                return <b>{`${currencySymbol} ${setNumberFormat(totalBudget(input.value))}`}</b>
              }
              if (!mixedCurrencies) return null
              const lis = mixedCurrencies.map((curr, cx) => {
                const totalAmount = totalDiffBudget(input.value, curr)
                return (
                  <li key={cx}>
                    <b>{`${getSymbolFromCurrency(curr)} ${setNumberFormat(totalAmount)}`}</b>
                  </li>
                )
              })
              return <ul>{lis}</ul>
            }}
          </Field>
        </span>
      </div>
      <Row style={{ marginBottom: 10 }}>
        <Col lg={14} sm={24}>
          <Pagination
            total={total}
            current={currentPage}
            onChange={(page) => onPage(page, 'budgetItems')}
            pageSize={30}
            size="small"
          />
        </Col>
        <Col lg={10} sm={24}>
          <Input
            prefix={<Icon type="search" />}
            onChange={(e) => onSearch(e.target.value, 'budgetItems')}
            placeholder="Find the budget amount"
            name="budget_keyword"
            allowClear
          />
        </Col>
      </Row>
      <ItemArray
        activeKey={activeKey}
        setName="budgetItems"
        sectionIndex={6}
        header={(index, label) => {
          if (!label) return null
          return (
            <span>
              <Field name={`budgetItems[${index}].otherExtra`} render={({ input }) => {
                let title = budgetItemTypes.find(it => it.value === label).label
                if (label === 38 && input.value) {
                  title = input.value
                }
                return (
                  <Aux>
                    {t('Budget item')} {index + 1}: {title}
                  </Aux>
                )
              }}
              />
            </span>
          )
        }}
        headerField="label"
        headerMore={(index, amount) => {
          if (!fieldExists('currency')) {
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
        newItem={{ currency: 'EUR', administratives: [{}] }}
        panel={name => {
          return (
            <div>
              <Row gutter={16}>
                {fieldExists('currency') && (
                  <Col span={12}>
                    <FinalField
                      name={`${name}.currency`}
                      control="select"
                      options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}` }))}
                      showSearch
                      optionFilterProp="children"
                      withLabel
                      dict={{
                        label: t('currency')
                      }}
                      optional
                    />
                  </Col>
                )}
                <Col span={12}>
                  <FinalField
                    name={`${name}.amount`}
                    control="input-number"
                    withLabel
                    dict={{
                      label: t('Amount'), tooltip: t('Enter the amount of budget that is set aside for this specific budget item. Use a period to denote decimals.')
                    }}
                    fieldExists={fieldExists}
                  />
                </Col>
                {isDGIS && fieldExists('budgetType') &&
                  <BudgetType name={name} t={t} />
                }
              </Row>
              <Condition when={`${name}.label`} is={38}>
                <FinalField
                  name={`${name}.otherExtra`}
                  control="input"
                  withLabel
                  dict={{ label: t('Custom title') }}
                  optional
                  placeholder="Other"
                  fieldExists={fieldExists}
                />
              </Condition>

              <Row gutter={16}>
                {!isDGIS && fieldExists('budgetType') &&
                  <BudgetType name={name} t={t} />
                }
                {fieldExists('status') &&
                  <Col span={12}>
                    <Item label={<InputLabel optional={isOptional('status')} tooltip={t('The status explains whether the budget being reported is indicative or has been formally committed.')}>{t('Status')}</InputLabel>}>
                      <FinalField
                        name={`${name}.status`}
                        render={({ input }) => (
                          <Radio.Group {...input}>
                            <Radio.Button value={1}>{t('Indicative')}</Radio.Button>
                            <Radio.Button value={2}>{t('Committed')}</Radio.Button>
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
                    <Field
                      name={`${name}.periodEnd`}
                      render={({ input }) => (
                        <FinalField
                          name={`${name}.periodStart`}
                          control="datepicker"
                          withLabel
                          dict={{
                            label: t('period start'), tooltip: t('Enter the start date (DD/MM/YYYY) for the budget period.')
                          }}
                          optional={isOptional}
                          disabledDate={(date) => {
                            const endDate = moment(input.value, 'DD/MM/YYYY')
                            if (!endDate.isValid()) return false
                            return date.valueOf() > endDate.valueOf()
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Field
                      name={`${name}.periodStart`}
                      render={({ input }) => (
                        <FinalField
                          name={`${name}.periodEnd`}
                          control="datepicker"
                          withLabel
                          dict={{
                            label: t('period end'), tooltip: t('Enter the end date (DD/MM/YYYY) for the budget period.')
                          }}
                          optional={isOptional}
                          disabledDate={(date) => {
                            const startDate = moment(input.value, 'DD/MM/YYYY')
                            if (!startDate.isValid()) return false
                            return date.valueOf() < startDate.valueOf()
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <FinalField
                      name={`${name}.valueDate`}
                      control="datepicker"
                      withLabel
                      dict={{
                        label: t('value date'), tooltip: t('Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for currency conversions.')
                      }}
                      optional={isOptional}
                    />
                  </Col>
                </Row>
              }
            </div>
          )
        }}
        modal={{
          buttonText: t('Add Budget Item'),
          className: 'add-budget-item-modal',
          component: ({ onClick }) => (
            <div>
              <p><small>{t('Select the budget item(s) to indicate how the project budget is divided. Use the ‘Other’ fields to add custom budget items.')}<br /><br /></small></p>
              {budgetItemTypes.map(type => (
                <div className="desc-block" key={type.value}>
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
  ({ editorRdr: { section1: { fields: { currency } } } }) => ({ currency }),
)(BudgetItems)
