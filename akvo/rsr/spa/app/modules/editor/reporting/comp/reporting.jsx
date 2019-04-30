import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, DatePicker, Divider, InputNumber } from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import * as actions from '../actions'
import channelCodes from '../channel-codes.json'
import FlagsStack from './flags-stack'
import ForecastsStack from './forecasts-stack'
import LegaciesStack from './legacies-stack'
import '../styles.scss'

const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ reportingRdr }) => ({ rdr: reportingRdr }),
  actions
)(_Field)


const LoanTerms = () => (
  <section>
    <div className="h-holder">
      <h4>Loan terms</h4>
    </div>
    <Row gutter={16}>
      <Col span={12}>
        <Field
          name="repaymentType"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">Repayment type</InputLabel>}>
              <Select {...props}>
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
        <Field
          name="repaymentPlan"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">Repayment plan</InputLabel>}>
              <Select {...props}>
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
        <Field
        render={props => (
          <Item label={<InputLabel optional tooltip="...">Commitment date</InputLabel>}>
            <DatePicker
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
              {...props}
            />
          </Item>
        )}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Field
          name="firstRepaymentDate"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">First repayment date</InputLabel>}>
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                {...props}
              />
            </Item>
          )}
        />
      </Col>
      <Col span={12}>
        <Field
          name="lastRepaymentDate"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">Last repayment date</InputLabel>}>
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                {...props}
              />
            </Item>
          )}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Field
          name="rate1"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">Rate 1</InputLabel>}>
              <Input {...props} suffix={<span>%</span>} />
            </Item>
          )}
        />
      </Col>
      <Col span={12}>
        <Field
          name="rate2"
          render={props => (
            <Item label={<InputLabel optional tooltip="...">Rate 2</InputLabel>}>
              <Input {...props} suffix={<span>%</span>} />
            </Item>
          )}
        />
      </Col>
    </Row>
  </section>
)

class _LoanStatus extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.rdr.currency !== this.props.rdr.currency
  }
  render(){
    const { rdr } = this.props
    const currencySymbol = getSymbolFromCurrency(rdr.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    return (
      <section>
        <div className="h-holder">
          <h4>Loan Status</h4>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Field
              name="year"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Year</InputLabel>}>
                  <Input {...fieldProps} />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="currency"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
                  <Select showSearch optionFilterProp="children" {...fieldProps}>
                    {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
                  </Select>
                </Item>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Field
              name="valueDate"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Value Date</InputLabel>}>
                  <DatePicker {...fieldProps} placeholder="DD/MM/YYYY" format="DD/MM/YYYY" />
                </Item>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Field
              additionalWatchProp="currency"
              name="interestReceived"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Interest received</InputLabel>}>
                  <InputNumber
                    formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(currencyRegExp, '')}
                    step={1000}
                    {...fieldProps}
                  />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="principalOutstanding"
              additionalWatchProp="currency"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Principal outstanding</InputLabel>}>
                  <InputNumber
                    formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(currencyRegExp, '')}
                    step={1000}
                    {...fieldProps}
                  />
                </Item>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Field
              name="principalArrears"
              additionalWatchProp="currency"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Principal arrears</InputLabel>}>
                  <InputNumber
                    formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(currencyRegExp, '')}
                    step={1000}
                    {...fieldProps}
                  />
                </Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Field
              name="interestArrears"
              additionalWatchProp="currency"
              render={fieldProps => (
                <Item label={<InputLabel optional tooltip="...">Interest arrears</InputLabel>}>
                  <InputNumber
                    formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(currencyRegExp, '')}
                    step={1000}
                    {...fieldProps}
                  />
                </Item>
              )}
            />
          </Col>
        </Row>
      </section>
    )
  }
}

const LoanStatus = connect(({ reportingRdr }) => ({rdr: reportingRdr }), actions)(_LoanStatus)

const Reporting = () => (
  <div className="reporting view">
    <h3>CRS++</h3>
    <Form layout="vertical">
      <LoanTerms />
      <LoanStatus />

      <Field
        name="channelCode"
        render={fieldProps => (
          <Item className="channel-code-item" label={<InputLabel optional tooltip="...">Channel code</InputLabel>}>
            <Select
              showSearch
              optionFilterProp="children"
              {...fieldProps}
            >
              {channelCodes.map(code =>
              <Option value={code.value}>{code.label}</Option>
              )}
            </Select>
          </Item>
        )}
      />
      <FlagsStack />

      <Divider />
      <h3>FSS</h3>
      <Field
        name="extractionDate"
        render={fieldProps => (
          <Item label={<InputLabel tooltip="...">Extraction date</InputLabel>}>
            <DatePicker {...fieldProps} format="DD/MM/YYYY" style={{ display: 'block' }} />
          </Item>
        )}
      />
      <Field
        name="phaseoutYear"
        render={fieldProps => (
          <Item label={<InputLabel optional tooltip="...">Phaseout year</InputLabel>}>
            <InputNumber {...fieldProps} className="phaseout-year-input" />
          </Item>
        )}
      />
      <Field
        name="priority"
        render={fieldProps => (
          <Item label={<InputLabel optional tooltip="...">Priority</InputLabel>}>
            <Select {...fieldProps}>
              <Option value="">&nbsp;</Option>
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Item>
        )}
      />

      <ForecastsStack />
      <LegaciesStack />
    </Form>
  </div>
)


export default Reporting
