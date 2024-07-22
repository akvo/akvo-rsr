import React from 'react'
import { Form, Button, Radio, Col, Row } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { validationType } from '../../../../utils/validation-utils'
import OrganizationSelect from '../../../../utils/organization-select'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'

const { Item } = Form

const ValueDateField = ({ name }) => {
  const { t } = useTranslation()
  return (
    <FinalField
      name={`${name}.valueDate`}
      control="datepicker"
      withLabel
      dict={{ label: t('value date'), tooltip: t('Enter the specific date (DD/MM/YYYY) for the planned disbursement value.')}}
    />
  )
}

const PlannedDisbursements = ({ formPush, validations, orgs, loadingOrgs, currency = 'EUR' }) => {
  const { t } = useTranslation()
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  const currencySymbol = getSymbolFromCurrency(currency)
  return (
    <ItemArray
      setName="plannedDisbursements"
      sectionIndex={6}
      header={(index, receiverOrganisation) => {
        return <span>{t('Disbursement')} {index + 1}{(receiverOrganisation && orgs) && `: ${orgs.find(it => it.id === receiverOrganisation).name}`}</span>
      }}
      headerField="receiverOrganisation"
      headerMore={(index, amount) => <span className="amount">{currencySymbol}{amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>}
      headerMoreField="value"
      formPush={formPush}
      panel={name => (
        <div>
          <Row gutter={16}>
            {isIATI && (
              <Col span={12}>
                <Item label={<InputLabel optional>{t('currency')}</InputLabel>}>
                <FinalField
                  name={`${name}.currency`}
                  control="select"
                  showSearch
                  optionFilterProp="children"
                  options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
                />
                </Item>
              </Col>
            )}
            <Col span={12}>
              <FinalField
                name={`${name}.value`}
                control="input-number"
                withLabel
                dict={{ label: t('value'), tooltip: t('This should only be used to report specific planned cash transfers. Use a period to denote decimals.') }}
              />
            </Col>
            {!isIATI && (
              <Col span={12}>
                <ValueDateField name={name} />
              </Col>
            )}
          </Row>
          {isIATI &&
          <Row gutter={16}>
            <Col span={12}>
              <ValueDateField name={name} />
            </Col>
            <Col span={12}>
              <Item label={<InputLabel optional>{t('type')}</InputLabel>}>
              <FinalField
                name={`${name}.type`}
                render={({ input }) => (
                    <Radio.Group {...input}>
                      <Radio.Button value="1">{t('Original')}</Radio.Button>
                      <Radio.Button value="2">{t('Revised')}</Radio.Button>
                    </Radio.Group>
                )}
              />
              </Item>
            </Col>
          </Row>
          }
          <Row gutter={16}>
            <Col span={12}>
              <Field
                name={`${name}.periodEnd`}
                render={({input}) => (
                  <FinalField
                    name={`${name}.periodStart`}
                    control="datepicker"
                    withLabel
                    dict={{ label: t('period start'), tooltip: t('The exact date of the planned disbursement OR the starting date for the disbursement period (DD/MM/YYYY).')}}
                    disabledDate={(date) => {
                      const endDate = moment(input.value, 'DD/MM/YYYY')
                      if (!endDate.isValid()) return false
                      return date.valueOf() > endDate.valueOf()
                    }}
                  />
                )}
              />
            </Col>
            <Col span={12}>
              <Field
                name={`${name}.periodStart`}
                render={({ input }) => (
                  <FinalField
                    name={`${name}.periodEnd`}
                    control="datepicker"
                    withLabel
                    dict={{ label: t('period end'), tooltip: t('Enter the end date (DD/MM/YYYY) for the disbursement period.') }}
                    disabledDate={(date) => {
                      const startDate = moment(input.value, 'DD/MM/YYYY')
                      if (!startDate.isValid()) return false
                      return date.valueOf() < startDate.valueOf()
                    }}
                  />
                )}
              />
            </Col>
          </Row>
          <section>
            <div className="h-holder">
              <h5>{t('provider organisation')}</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <OrganizationSelect
                  name={name}
                  fieldName="providerOrganisation"
                  dict={{
                    label: t('Provider organisation'),
                    tooltip: t('For incoming funds, this is the organisation from which the funds originated. It will default to the reporting organisation.')
                  }}
                  orgs={orgs}
                  loading={loadingOrgs}
                />
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('If incoming funds are being provided from the budget of another activity that is reported to IATI, it is STRONGLY RECOMMENDED that this should record the provider’s unique IATI activity identifier for that activity.')}>{t('Activity ID')}</InputLabel>}>
                <FinalField
                  name={`${name}.providerOrganisationActivity`}
                />
                </Item>
              </Col>
            </Row>
          </section>
          <section>
            <div className="h-holder">
              <h5>{t('recipient organisation')}</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <OrganizationSelect
                  name={name}
                  fieldName="receiverOrganisation"
                  dict={{
                    label: t('recipient organisation'), tooltip: t('The organisation that receives the incoming funds.')
                  }}
                  orgs={orgs}
                  loading={loadingOrgs}
                />
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('The internal identifier used by the receiver organisation for its activity that receives the funds from this disbursement (not to be confused with the IATI identifier for the target activity).')}>{t('Activity ID')}</InputLabel>}>
                <FinalField
                  name={`${name}.receiverOrganisationActivity`}
                />
                </Item>
              </Col>
            </Row>
          </section>
        </div>
      )}
      addButton={({onClick}) => (
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add planned disbursement')}</Button>
      )}
    />
  )
}

export default PlannedDisbursements
