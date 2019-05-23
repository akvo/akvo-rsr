import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, Row, Col, Divider } from 'antd'
import { Field, Form as FinalForm } from 'react-final-form'
import currencies from 'currency-codes/data'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import InputLabel from '../../../utils/input-label'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import CHANNEL_CODES from './channel-codes.json'
import FlagsStack from './comp/flags-stack'
import ForecastsStack from './comp/forecasts-stack'
import LegaciesStack from './comp/legacies-stack'
import './styles.scss'

const { Item } = Form
const { Option } = Select

const LoanTerms = () => (
  <section>
    <div className="h-holder">
      <h4>Loan terms</h4>
    </div>
    <Row gutter={16}>
      <Col span={12}>
        <FinalField
          name="repaymentType"
          render={({ input }) => (
            <Item label={<InputLabel optional tooltip="...">Repayment type</InputLabel>}>
              <Select {...input}>
                <Option value="">None</Option>
                <Option value="1">1 - Equal Principal Payments (EPP)</Option>
                <Option value="2">2 - Annuity</Option>
                <Option value="3">3 - Lump sum</Option>
                <Option value="5">5 - Other</Option>
              </Select>
            </Item>
          )}
        />
      </Col>
      <Col span={12}>
        <FinalField
          name="repaymentPlan"
          render={({ input }) => (
            <Item label={<InputLabel optional tooltip="...">Repayment plan</InputLabel>}>
              <Select {...input}>
                <Option value="">None</Option>
                <Option value="1">1 - Annual</Option>
                <Option value="2">2 - Semi-annual</Option>
                <Option value="4">4 - Quarterly</Option>
                <Option value="12">12 - Monthly</Option>
              </Select>
            </Item>
          )}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Item label={<InputLabel optional tooltip="...">Commitment date</InputLabel>}>
        <FinalField
          control="datepicker"
          name="commitmentDate"
        />
        </Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Item label={<InputLabel optional tooltip="...">First repayment date</InputLabel>}>
        <FinalField
          name="firstRepaymentDate"
          control="datepicker"
        />
        </Item>
      </Col>
      <Col span={12}>
        <Item label={<InputLabel optional tooltip="...">Last repayment date</InputLabel>}>
        <FinalField
          name="lastRepaymentDate"
          control="datepicker"
        />
        </Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Item label={<InputLabel optional tooltip="...">Rate 1</InputLabel>}>
        <FinalField
          name="rate1"
          suffix={<span>%</span>}
        />
        </Item>
      </Col>
      <Col span={12}>
        <Item label={<InputLabel optional tooltip="...">Rate 2</InputLabel>}>
        <FinalField
          name="rate2"
          suffix={<span>%</span>}
        />
        </Item>
      </Col>
    </Row>
  </section>
)

const LoanStatus = ({ currency }) => {
  const currencySymbol = getSymbolFromCurrency(currency)
  return (
    <section>
      <div className="h-holder">
        <h4>Loan Status</h4>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Year</InputLabel>}>
          <FinalField
            name="year"
          />
          </Item>
        </Col>
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
      </Row>
      <Row>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Value Date</InputLabel>}>
          <FinalField
            name="valueDate"
            control="datepicker"
          />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Interest received</InputLabel>}>
          <FinalField
            name="interestReceived"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Principal outstanding</InputLabel>}>
          <FinalField
            name="principalOutstanding"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Principal arrears</InputLabel>}>
          <FinalField
            name="principalArrears"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
        <Col span={12}>
          <Item label={<InputLabel optional tooltip="...">Interest arrears</InputLabel>}>
          <FinalField
            name="interestArrears"
            control="input-number"
            currencySymbol={currencySymbol}
          />
          </Item>
        </Col>
      </Row>
    </section>
  )
}


class Reporting extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    return (
      <div className="reporting view">
        <h3>CRS++</h3>
        <Form layout="vertical">
        <FinalForm
          onSubmit={() => {}}
          initialValues={this.props.fields}
          subscription={{}}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push }
            }
          }) => (
            <div>
              <AutoSave sectionIndex={11} />
              <LoanTerms />
              <Field
                name="currency"
                render={({ input }) => <LoanStatus currency={input.value} />}
              />
              <Item className="channel-code-item" label={<InputLabel optional tooltip="...">Channel code</InputLabel>}>
                <FinalField
                  name="channelCode"
                  showSearch
                  optionFilterProp="children"
                  options={CHANNEL_CODES}
                  control="select"
                />
              </Item>
              <FlagsStack formPush={push} />
              <Divider />
              <h3>FSS</h3>
              <Item label={<InputLabel tooltip="...">Extraction date</InputLabel>}>
              <FinalField
                name="extractionDate"
                style={{ display: 'block' }}
                control="datepicker"
              />
              </Item>
              <Item label={<InputLabel optional tooltip="...">Phaseout year</InputLabel>}>
              <FinalField
                name="phaseoutYear"
                control="input-number"
                className="phaseout-year-input"
              />
              </Item>
              <Item label={<InputLabel optional tooltip="...">Priority</InputLabel>}>
              <FinalField
                name="priority"
                control="select"
                options={[{ value: 1, label: 'Yes'}, { value: 0, label: 'No'}]}
                withEmptyOption
              />
              </Item>
              <h3>FSS forecasts</h3>
              <ForecastsStack formPush={push} />
              <h3>Legacy data</h3>
              <LegaciesStack formPush={push} />
            </div>
          )}
        />
        </Form>
      </div>
    )
  }
}


export default connect(
  ({ editorRdr: { section11: { fields } }}) => ({ fields })
)(Reporting)
