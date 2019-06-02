import React from 'react'
import { Form, Button, Radio, Col, Row } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries'
import { Aux } from '../../../../utils/misc'
import { getValidationSets, doesFieldExist } from '../../../../utils/validation-utils'
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

const { Item } = Form
const isEmpty = value => value === null || value === '' || value === undefined

const TypeField = ({ name }) => (
  <Item label={(
    <Field name={`${name}.value`}>
      {({ input }) => <InputLabel optional={isEmpty(input.value)}>Type</InputLabel>}
    </Field>
  )}>
  <FinalField
    name={`${name}.type`}
    control="select"
    options={TYPE_OPTIONS}
    withEmptyOption
  />
  </Item>
)

const Transactions = ({ validations, formPush }) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <ItemArray
      setName="transactions"
      sectionIndex={6}
      header="Transaction item $index"
      formPush={formPush}
      newItem={{ sectors: [{}]}}
      panel={name => (
        <div>
          <Row gutter={16}>
            {fieldExists('currency') &&
            <Col span={12}>
              <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
              <FinalField
                name="currency"
                control="select"
                showSearch
                optionFilterProp="children"
                options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
              />
              </Item>
            </Col>
            }
            {(!fieldExists('humanitarianTransaction') && fieldExists('type')) &&
            <Col span={12}>
              <TypeField name={name} />
            </Col>
            }
            <Col span={12}>
              <Item label={<InputLabel tooltip="..." optional>Value</InputLabel>}>
              <FinalField
                name={`${name}.value`}
                control="input-number"
              />
              </Item>
            </Col>
          </Row>
          {fieldExists('humanitarianTransaction') && (
          <Row gutter={16}>
            <Col span={12}>
              <TypeField name={name} />
            </Col>
            <Col span={12}>
              <Item label={<InputLabel optional>Humanitarian transaction</InputLabel>}>
              <FinalField
                name="humanitarianTransaction"
                render={({ input }) => (
                    <Radio.Group {...input}>
                      <Radio.Button value>Yes</Radio.Button>
                      <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                )}
              />
              </Item>
            </Col>
          </Row>
          )}
          {fieldExists('date') &&
          <Row gutter={16}>
            <Col span={12}>
              <Item label={(
                <Field name={`${name}.value`}>
                  {({ input }) => <InputLabel optional={isEmpty(input.value)}>Date</InputLabel>}
                </Field>
              )}>
              <FinalField
                name={`${name}.date`}
                control="datepicker"
              />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={(
                <Field name={`${name}.value`}>
                  {({ input }) => <InputLabel optional={isEmpty(input.value)}>Value Date</InputLabel>}
                </Field>
              )}>
              <FinalField
                name={`${name}.valueDate`}
                control="datepicker"
              />
              </Item>
            </Col>
          </Row>
          }
          {fieldExists('providerOrganisation') &&
          <section>
            <div className="h-holder">
              <h5>Provider organisation</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional>Name</InputLabel>}>
                <FinalField
                  name={`${name}.providerOrganisation`}
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Activity ID</InputLabel>}>
                <FinalField
                  name={`${name}.providerOrganisationActivityId`}
                />
                </Item>
              </Col>
            </Row>
          </section>
          }
          {fieldExists('recipientOrganisation') &&
          <section>
            <div className="h-holder">
              <h5>Recipient organisation</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional>Name</InputLabel>}>
                <FinalField
                  name={`${name}.recipientOrganisation`}
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Activity ID</InputLabel>}>
                <FinalField
                  name={`${name}.recipientOrganisationActivityId`}
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
            optional
            fieldExists={fieldExists}
          />
          <FinalField
            name={`${name}.reference`}
            control="input"
            fieldExists={fieldExists}
            withLabel
            optional
          />
          <FinalField
            name={`${name}.aidTypeVocabulary`}
            control="select"
            options={AID_TYPE_VOCABULARY_OPTIONS}
            withEmptyOption
            withLabel
            optional
            fieldExists={fieldExists}
          />
          {fieldExists('aidType') &&
          <Aux>
            <Item label={<InputLabel optional>Aid Type</InputLabel>}>
            <FinalField
              name={`${name}.aidType`}
              control="select"
              options={AID_TYPE_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional>Disbursement Channel</InputLabel>}>
            <FinalField
              name={`${name}.disbursementChannel`}
              control="select"
              options={CHANNEL_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional>Finance type</InputLabel>}>
            <FinalField
              name={`${name}.financeType`}
              control="select"
              options={FINANCE_TYPE_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional>Flow type</InputLabel>}>
            <FinalField
              name={`${name}.flowType`}
              control="select"
              options={FLOW_TYPE_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional>Tied status</InputLabel>}>
            <FinalField
              name={`${name}.tiedStatus`}
              control="select"
              options={TIED_STATUS_OPTIONS}
              withEmptyOption
            />
            </Item>
            <section>
              <div className="h-holder">
                <h5>Recipient</h5>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel optional>Country</InputLabel>}>
                  <FinalField
                    name={`${name}.recipientCountry`}
                    control="select"
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    options={countries.map(item => ({ value: item.code, label: item.name }))}
                  />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional>Region</InputLabel>}>
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
                  <Item label={<InputLabel optional>Region vocabulary</InputLabel>}>
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
                  <Item label={<InputLabel optional>Region vocabulary uri</InputLabel>}>
                  <FinalField
                    name={`${name}.recipientRegionVocabularyUri`}
                  />
                  </Item>
                </Col>
              </Row>
            </section>
            <section>
              <div className="h-holder">
                <h5>Transaction sectors</h5>
              </div>
              <Sectors push={formPush} parentName={name} />
            </section>
          </Aux>
          }
        </div>
      )}
      addButton={({onClick}) => (
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add transaction</Button>
      )}
    />
  )
}

export default Transactions
