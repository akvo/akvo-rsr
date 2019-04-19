import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, DatePicker, Divider, InputNumber } from 'antd'
import currencies from 'currency-codes/data'
import currencySymbolMap from 'currency-symbol-map/map'

import InputLabel from '../../../../utils/input-label'
import * as actions from '../actions'
import channelCodes from '../channel-codes.json'
import FlagsStack from './flags-stack'
import ForecastsStack from './forecasts-stack'
import LegaciesStack from './legacies-stack'
import '../styles.scss'

const { Item } = Form
const { Option } = Select


function getSymbolFromCurrency(currencyCode) {
  if (typeof currencyCode !== 'string') return ''
  if (!currencySymbolMap.hasOwnProperty(currencyCode)) return currencyCode
  return currencySymbolMap[currencyCode]
}

class LoanTerms extends React.Component{
  shouldComponentUpdate(nextProps){
    const fields = ['repaymentType', 'repaymentPlan', 'commitmentDate', 'firstRepaymentDate', 'lastRepaymentDate', 'rate1', 'rate2']
    let diff = false
    fields.forEach((field) => {
      if(nextProps.rdr[field] !== this.props.rdr[field]){
        diff = true
      }
    })
    return diff
  }
  render(){
    const { rdr } = this.props
    return (
      <section>
        <div className="h-holder">
          <h4>Loan terms</h4>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Repayment type</InputLabel>}>
              <Select value={rdr.repaymentType} onChange={value => this.props.editField('repaymentType', value)}>
                <Option value="">None</Option>
                <Option value="1">1 - Equal Principal Payments (EPP)</Option>
                <Option value="2">2 - Annuity</Option>
                <Option value="3">3 - Lump sum</Option>
                <Option value="5">5 - Other</Option>
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Repayment plan</InputLabel>}>
              <Select value={rdr.repaymentPlan} onChange={value => this.props.editField('repaymentPlan', value)}>
                <Option value="">None</Option>
                <Option value="1">1 - Annual</Option>
                <Option value="2">2 - Semi-annual</Option>
                <Option value="4">4 - Quarterly</Option>
                <Option value="12">12 - Monthly</Option>
              </Select>
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Commitment date</InputLabel>}>
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                value={rdr.commitmentDate}
                onChange={value => this.props.editField('commitmentDate', value)}
              />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">First repayment date</InputLabel>}>
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                value={rdr.firstRepaymentDate}
                onChange={value => this.props.editField('firstRepaymentDate', value)}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Last repayment date</InputLabel>}>
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                value={rdr.lastRepaymentDate}
                onChange={value => this.props.editField('lastRepaymentDate', value)}
              />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Rate 1</InputLabel>}>
              <Input
                value={rdr.rate1}
                onChange={ev => this.props.editField('rate1', ev.target.value)}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Rate 2</InputLabel>}>
              <Input value={rdr.rate2} onChange={ev => this.props.editField('rate2', ev.target.value)} suffix={<span>%</span>} />
            </Item>
          </Col>
        </Row>
      </section>
    )
  }
}

class LoanStatus extends React.Component{
  shouldComponentUpdate(nextProps){
    const fields = ['year', 'currency', 'valueDate', 'interestReceived', 'principalOutstanding', 'principalArrears', 'interestArreas']
    let diff = false
    fields.forEach((field) => {
      if(nextProps.rdr[field] !== this.props.rdr[field]){
        diff = true
      }
    })
    return diff
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
            <Item label={<InputLabel optional tooltip="...">Year</InputLabel>}>
              <Input value={rdr.year} onChange={ev => this.props.editField('year', ev.target.value)} />
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
              <Select showSearch optionFilterProp="children" value={rdr.currency} onChange={value => this.props.editField('currency', value)}>
                {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
              </Select>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Value Date</InputLabel>}>
              <DatePicker value={rdr.valueDate} onChange={value => this.props.editField('valueDate', value)} placeholder="DD/MM/YYYY" format="DD/MM/YYYY" />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Interest received</InputLabel>}>
              <InputNumber
                formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(currencyRegExp, '')}
                step={1000}
                value={rdr.interestReceived}
                onChange={value => this.props.editField('interestReceived', value)}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Principal outstanding</InputLabel>}>
              <InputNumber
                formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(currencyRegExp, '')}
                step={1000}
                value={rdr.principalOutstanding}
                onChange={value => this.props.editField('principalOutstanding', value)}
              />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Principal arrears</InputLabel>}>
              <InputNumber
                formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(currencyRegExp, '')}
                step={1000}
                value={rdr.principalArrears}
                onChange={value => this.props.editField('principalArrears', value)}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label={<InputLabel optional tooltip="...">Interest arrears</InputLabel>}>
              <InputNumber
                formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(currencyRegExp, '')}
                step={1000}
                value={rdr.interestArrears}
                onChange={value => this.props.editField('interestArrears', value)}
              />
            </Item>
          </Col>
        </Row>
      </section>
    )
  }
}

const Reporting = ({ rdr, ...props }) => {
  return (
    <div className="reporting view">
      <h3>CRS++</h3>
      <Form layout="vertical">
        <LoanTerms {...props} rdr={rdr} />
        <LoanStatus {...props} rdr={rdr} />

        <Item className="channel-code-item" label={<InputLabel optional tooltip="...">Channel code</InputLabel>}>
          <Select
            showSearch
            optionFilterProp="children"
            value={rdr.channelCode}
            onChange={value => props.editField('channelCode', value)}
          >
            {channelCodes.map(code =>
            <Option value={code.value}>{code.label}</Option>
            )}
          </Select>
        </Item>
        <FlagsStack />

        <Divider />
        <h3>FSS</h3>
        <Item label={<InputLabel tooltip="...">Extraction date</InputLabel>}>
          <DatePicker value={rdr.extractionDate} onChange={value => props.editField('extractionDate', value)} format="DD/MM/YYYY" style={{ display: 'block' }} />
        </Item>
        <Item label={<InputLabel optional tooltip="...">Phaseout year</InputLabel>}>
          <InputNumber value={rdr.phaseoutYear} onChange={value => props.editField('phaseoutYear', value)} className="phaseout-year-input" />
        </Item>
        <Item label={<InputLabel optional tooltip="...">Priority</InputLabel>}>
          <Select value={rdr.priority} onChange={value => props.editField('priority', value)}>
            <Option value="">&nbsp;</Option>
            <Option value={1}>Yes</Option>
            <Option value={0}>No</Option>
          </Select>
        </Item>

        <ForecastsStack />
        <LegaciesStack />
      </Form>
    </div>
  )
}


export default connect(
  ({ reportingRdr }) => ({ rdr: reportingRdr }),
  actions
)(Reporting)
