import React from 'react'
import { Form, Button, Radio, Col, Row } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { validationType } from '../../../../utils/validation-utils'
import OrganizationSelect from '../../../../utils/organization-select';

const { Item } = Form
const isEmpty = value => value === null || value === '' || value === undefined

const ValueDateField = ({ name }) => (
  <Item label={(
    <Field name={`${name}.value`}>
      {({ input }) => <InputLabel optional={isEmpty(input.value)}>Value date</InputLabel>}
    </Field>
  )}>
  <FinalField
    name={`${name}.valueDate`}
    control="datepicker"
  />
  </Item>
)

const PlannedDisbursements = ({ formPush, validations }) => {
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  return (
    <ItemArray
      setName="plannedDisbursements"
      sectionIndex={6}
      header="Planned disbursement $index"
      formPush={formPush}
      panel={name => (
        <div>
          <Row gutter={16}>
            {isIATI && (
              <Col span={12}>
                <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
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
              <Item label={<InputLabel optional tooltip="...">Disbursement value</InputLabel>}>
              <FinalField
                name={`${name}.value`}
                control="input-number"
              />
              </Item>
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
              <Item label={<InputLabel optional>Disbursement type</InputLabel>}>
              <FinalField
                name={`${name}.type`}
                render={({ input }) => (
                    <Radio.Group {...input}>
                      <Radio.Button value="1">Original</Radio.Button>
                      <Radio.Button value="2">Revised</Radio.Button>
                    </Radio.Group>
                )}
              />
              </Item>
            </Col>
          </Row>
          }
          <Row gutter={16}>
            <Col span={12}>
              <Item label={(
                <Field name={`${name}.value`}>
                  {({ input }) => <InputLabel optional={isEmpty(input.value)}>Period start</InputLabel>}
                </Field>
              )}>
              <FinalField
                name={`${name}.periodStart`}
                control="datepicker"
              />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={(
                <Field name={`${name}.value`}>
                  {({ input }) => <InputLabel optional={isEmpty(input.value)}>Period end</InputLabel>}
                </Field>
              )}>
              <FinalField
                name={`${name}.periodEnd`}
                control="datepicker"
              />
              </Item>
            </Col>
          </Row>
          <section>
            <div className="h-holder">
              <h5>Provider organisation</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional>Name</InputLabel>}>
                <OrganizationSelect
                  name={`${name}.providerOrganisation`}
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Activity ID</InputLabel>}>
                <FinalField
                  name={`${name}.providerOrganisationActivity`}
                />
                </Item>
              </Col>
            </Row>
          </section>
          <section>
            <div className="h-holder">
              <h5>Recipient organisation</h5>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional>Name</InputLabel>}>
                <OrganizationSelect
                  name={`${name}.receiverOrganisation`}
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Activity ID</InputLabel>}>
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
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add planned disbursement</Button>
      )}
    />
  )
}

export default PlannedDisbursements
