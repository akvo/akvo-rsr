import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Col, Row } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries.json'
import { Aux } from '../../../../utils/misc'
import { getValidationSets, doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import TYPE_OPTIONS from './options/type-options.json'
import CHANNEL_OPTIONS from './options/channels.json'
import FINANCE_TYPE_OPTIONS from '../../section1/options/finance-types.json'
import FLOW_TYPE_OPTIONS from '../../section1/options/flow-types.json'
import TIED_STATUS_OPTIONS from '../../section1/options/tied-statuses.json'
import AID_TYPE_OPTIONS from '../../section1/options/aid-types.json'
import AID_TYPE_VOCABULARY_OPTIONS from '../../section1/options/aid-type-vocabulary.json'
import REGION_OPTIONS from './options/regions.json'
import Sectors from './sectors'
import validationDefs from './validations'
import OrganizationSelect from '../../../../utils/organization-select';
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'

const { Item } = Form

const TypeField = ({ name, isOptional }) => {
  const { t } = useTranslation()
  return (
    <FinalField
      name={`${name}.transactionType`}
      control="select"
      options={TYPE_OPTIONS}
      withEmptyOption
      withLabel
      optional={isOptional}
      dict={{ label: t('type'), tooltip: t('Select the type of the transaction (e.g. commitment, disbursement, expenditure).') }}
    />
  )
}

const Transactions = ({ validations, formPush, orgs, loadingOrgs, currency = 'EUR', showRequired, errors }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const currencySymbol = getSymbolFromCurrency(currency)
  const isOptional = isFieldOptional(validationSets)
  return (
    <div>
      <div className="min-required-wrapper">
        <h3>{t('Transactions')}</h3>
        {showRequired && errors.findIndex(it => it.type === 'min' && it.path === 'transactions') !== -1 && (
          <span className="min-required">{t('Minimum one required')}</span>
        )}
      </div>
      <ItemArray
        setName="transactions"
        sectionIndex={6}
        header={(index, receiverOrganisation) => {
          return (
            <Field name={`transactions[${index}].transactionType`} subscription={{ value: true }}>
              {({ input }) =>
              <span>
                {!input.value && `${t('Transaction')} ${index + 1}: `}
                {input.value && TYPE_OPTIONS.find(it => it.value === input.value).label}
                {input.value === '3' && (receiverOrganisation && orgs) && `: ${orgs.find(it => it.id === receiverOrganisation).name}`}
              </span>
              }
            </Field>
          )
        }}
        headerField="receiverOrganisation"
        headerMore={(index, amount) => {
          if (!fieldExists('currency')) {
            return <span className="amount">{currencySymbol}{amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
          }
          return (
            <span className="amount">{currencySymbol}{amount ? String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
          )
        }}
        headerMoreField="value"
        formPush={formPush}
        newItem={{ sectors: [{}]}}
        panel={name => (
          <div>
            <Row gutter={16}>
              {fieldExists('currency') &&
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
              }
              {(!fieldExists('humanitarian') && fieldExists('transactionType')) &&
              <Col span={12}>
                <TypeField name={name} isOptional={isOptional} />
              </Col>
              }
              <Col span={12}>
                <FinalField
                  name={`${name}.value`}
                  control="input-number"
                  withLabel
                  optional={isOptional}
                  dict={{ label: t('value'), tooltip: t('Enter the transaction amount. Use a period to denote decimals.') }}
                />
              </Col>
            </Row>
            {fieldExists('humanitarian') && (
            <Row gutter={16}>
              <Col span={12}>
                <TypeField name={name} isOptional={isOptional} />
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('Determines whether this transaction relates entirely or partially to humanitarian aid.')}>{t('humanitarian transaction')}</InputLabel>}>
                <FinalField
                  name={`${name}.humanitarian`}
                  render={({ input }) => (
                      <Radio.Group {...input}>
                        <Radio.Button value>{t('Yes')}</Radio.Button>
                        <Radio.Button value={false}>{t('No')}</Radio.Button>
                      </Radio.Group>
                  )}
                />
                </Item>
              </Col>
            </Row>
            )}
            {fieldExists('transactionDate') &&
            <Row gutter={16}>
              <Col span={12}>
                <FinalField
                  name={`${name}.transactionDate`}
                  control="datepicker"
                  withLabel
                  optional={isOptional}
                  dict={{ label: t('date'), tooltip: t('Enter the financial reporting date that the transaction was/will be undertaken.') }}
                />
              </Col>
              <Col span={12}>
                <FinalField
                  name={`${name}.valueDate`}
                  control="datepicker"
                  withLabel
                  optional={isOptional}
                  dict={{ label: t('value date'), tooltip: t('The date to be used for determining the exchange rate for currency conversions of the transaction.') }}
                />
              </Col>
            </Row>
            }
            {fieldExists('providerOrganisation') &&
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
                      label: t('organisation'), tooltip: t('For incoming funds, this is the organisation from which the funds originated. It will default to the reporting organisation.')
                    }}
                    orgs={orgs}
                    loading={loadingOrgs}
                    optional
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
            }
            {fieldExists('receiverOrganisation') &&
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
                      label: t('organisation'), tooltip: t('The organisation that receives the incoming funds.')
                    }}
                    orgs={orgs}
                    loading={loadingOrgs}
                    optional
                  />
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional tooltip={t('The internal identifier used by the receiver organisation for its activity that receives the funds from this transaction (not to be confused with the IATI identifier for the target activity).')}>{t('Activity ID')}</InputLabel>}>
                  <FinalField
                    name={`${name}.receiverOrganisationActivity`}
                  />
                  </Item>
                </Col>
              </Row>
            </section>
            }
            <FinalField
              name={`${name}.description`}
              control="input"
              withLabel
              dict={{
                label: t('description'), tooltip: t('Enter additional information for the transaction, if necessary.')
              }}
              optional
              fieldExists={fieldExists}
            />
            <FinalField
              name={`${name}.reference`}
              control="input"
              fieldExists={fieldExists}
              withLabel
              dict={{
                label: t('transaction reference'), tooltip: t('Enter a reference for the transaction (eg. transaction number).')
              }}
              optional
            />
            <FinalField
              name={`${name}.aidTypeVocabulary`}
              control="select"
              options={AID_TYPE_VOCABULARY_OPTIONS}
              withEmptyOption
              withLabel
              dict={{
                label: t('Transaction aid type vocabulary'), tooltip: t('Enter the type of vocabulary being used to describe the aid type For reference, please visit: <a href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target="_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.')
              }}
              optional
              fieldExists={fieldExists}
            />
            {fieldExists('aidType') &&
            <Aux>
              <Item label={<InputLabel optional tooltip={t('Enter the type of aid being supplied. For reference, please visit: <a href="http://iatistandard.org/202/codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/AidType/</a>')}>{t('aid type')}</InputLabel>}>
              <FinalField
                name={`${name}.aidType`}
                control="select"
                options={AID_TYPE_OPTIONS}
                withEmptyOption
              />
              </Item>
              <Item label={<InputLabel optional tooltip={t('Enter the channel through which the funds will flow for this transaction, from an IATI codelist. For reference, please visit: <a href="http://iatistandard.org/202/codelists/DisbursementChannel/" target="_blank">http://iatistandard.org/202/codelists/DisbursementChannel/</a>')}>{t('Disbursement channel')}</InputLabel>}>
              <FinalField
                name={`${name}.disbursementChannel`}
                control="select"
                options={CHANNEL_OPTIONS}
                withEmptyOption
              />
              </Item>
              <Item label={<InputLabel optional tooltip={t('For reference, please visit: <a href="http://iatistandard.org/202/codelists/FinanceType/" target="_blank">http://iatistandard.org/202/codelists/FinanceType/</a>.')}>{t('Finance type')}</InputLabel>}>
              <FinalField
                name={`${name}.financeType`}
                control="select"
                options={FINANCE_TYPE_OPTIONS}
                withEmptyOption
              />
              </Item>
              <Item label={<InputLabel optional tooltip={t('For reference, please visit: <a href="http://iatistandard.org/202/codelists/FlowType/" target="_blank">http://iatistandard.org/202/codelists/FlowType/</a>.')}>{t('Flow type')}</InputLabel>}>
              <FinalField
                name={`${name}.flowType`}
                control="select"
                options={FLOW_TYPE_OPTIONS}
                withEmptyOption
              />
              </Item>
              <Item label={<InputLabel optional tooltip={t('Whether the aid is untied, tied, or partially tied. For reference visit <a href="http://iatistandard.org/202/codelists/TiedStatus/" target="_blank">http://iatistandard.org/202/codelists/TiedStatus/</a>.')}>{t('Tied status')}</InputLabel>}>
              <FinalField
                name={`${name}.tiedStatus`}
                control="select"
                options={TIED_STATUS_OPTIONS}
                withEmptyOption
              />
              </Item>
              <section>
                <div className="h-holder">
                  <h5>{t('Recipient')}</h5>
                </div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional label={t('Enter the country that will benefit from this transaction. It can only be one country per transaction. For reference, please visit: <a href="http://iatistandard.org/202/codelists/Country/" target="_blank">http://iatistandard.org/202/codelists/Country/</a>.')}>{t('country')}</InputLabel>}>
                    <FinalField
                      name={`${name}.recipientCountry`}
                      control="select"
                      optionFilterProp="children"
                      showSearch
                      filterOption={(input, option) => {
                        const { children } = option.props
                        return (typeof children === 'string' ? children : children.join('')).toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      options={countries.map(item => ({ value: item.code, label: item.name }))}
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional tooltip={t('Enter the supranational geopolitical region (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) that will benefit from this transaction. For reference, please visit: <a href="http://iatistandard.org/202/codelists/Region/" target="_blank">http://iatistandard.org/202/codelists/Region/</a>.')}>{t('region')}</InputLabel>}>
                    <FinalField
                      name={`${name}.recipientRegion`}
                      control="select"
                      options={REGION_OPTIONS}
                    />
                    </Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional>{t('region vocabulary')}</InputLabel>}>
                    <FinalField
                      name={`${name}.recipientRegionVocabulary`}
                      control="select"
                      options={[
                        {value: '1', label: 'OECD DAC'},
                        {value: '2', label: 'UN'},
                        {value: '99', label: 'Reporting Organisation'}
                      ]}
                      withEmptyOption
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional tooltip={t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')}>{t('Region vocabulary uri')}</InputLabel>}>
                    <FinalField
                      name={`${name}.recipientRegionVocabularyUri`}
                    />
                    </Item>
                  </Col>
                </Row>
              </section>
              <h5>{t('Transaction sectors')}</h5>
              <Field
                name={`${name}.id`}
                render={({input}) => <Sectors push={formPush} parentName={name} transactionId={input.value} />}
              />
            </Aux>
            }
          </div>
        )}
        addButton={({onClick}) => (
          <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add another transaction')}</Button>
        )}
      />
    </div>
  )
}

export default connect(
  ({ editorRdr: { showRequired, section6: { errors } } }) => ({ showRequired, errors }),
)(Transactions)
