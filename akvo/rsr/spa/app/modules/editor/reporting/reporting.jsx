import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Button, Row, Col, DatePicker, Divider, InputNumber, Collapse, Radio, Icon } from 'antd'
import currencies from 'currency-codes/data'
import currencySymbolMap from 'currency-symbol-map/map'

import InputLabel from '../../../utils/input-label'
import * as actions from './actions'
import channelCodes from './channel-codes.json'
import './styles.scss'

const { Item } = Form
const { Option } = Select
const { Panel } = Collapse

const flagCodeOptions = [
  { value: 1, label: 'Free standing technical cooperation'},
  { value: 2, label: 'Programme-based approach'},
  { value: 3, label: 'Investment project'},
  { value: 4, label: 'Associated financing'}
]

function getSymbolFromCurrency(currencyCode) {
  if (typeof currencyCode !== 'string') return ''
  if (!currencySymbolMap.hasOwnProperty(currencyCode)) return currencyCode
  return currencySymbolMap[currencyCode]
}

class Reporting extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeFlagsKey: props.rdr.flags.length > 0 ? `flag${props.rdr.flags.length - 1}` : 0,
      activeForecastsKey: props.rdr.forecasts.length > 0 ? `forecast${props.rdr.forecasts.length - 1}` : 0,
      activeLegacyDatasKey: props.rdr.legacyDatas.length > 0 ? `legacyData${props.rdr.legacyDatas.length - 1}` : 0
    }
  }
  removeArrayItem = (event, array, index) => {
    event.stopPropagation()
    this.props.removeArrayItem(array, index)
  }
  addFlag = () => {
    this.setState({
      activeFlagsKey: `flag${this.props.rdr.flags.length}`
    })
    this.props.addArrayItem('flags')
  }
  addForecast = () => {
    this.setState({
      activeForecastsKey: `forecast${this.props.rdr.forecasts.length}`
    })
    this.props.addArrayItem('forecasts')
  }
  addLegacyData = () => {
    this.setState({
      activeLegacyDatasKey: `legacyData${this.props.rdr.legacyDatas.length}`
    })
    this.props.addArrayItem('legacyDatas')
  }
  render(){
    const { rdr } = this.props
    const currencySymbol = getSymbolFromCurrency(rdr.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    return (
      <div className="reporting view">
        <h3>CRS++</h3>
        <Form layout="vertical">
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
                    onChange={(ev) => {
                    this.props.editField('rate1', ev.target.value)
                  }}
                  suffix={<span>%</span>}
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

          <Item className="channel-code-item" label={<InputLabel optional tooltip="...">Channel code</InputLabel>}>
            <Select
              showSearch
              optionFilterProp="children"
              value={rdr.channelCode}
              onChange={value => this.props.editField('channelCode', value)}
            >
              {channelCodes.map(code =>
              <Option value={code.value}>{code.label}</Option>
              )}
            </Select>
          </Item>
          <Collapse
            accordion
            activeKey={this.state.activeFlagsKey}
            onChange={(key) => { this.setState({ activeFlagsKey: key }) }}
          >
            {this.props.rdr.flags.map((flag, index) =>
            <Panel key={`flag${index}`} header={`CRS++ other flag: ${flag.code && `${flag.code} - ${flagCodeOptions.find(it => it.value === flag.code).label}`}`} extra={<Icon type="delete" onClick={event => this.removeArrayItem(event, 'flags', index)} />}>
              <div className="channel-code-inputs">
              <Item label={<InputLabel tooltip="...">Code</InputLabel>}>
                <Select value={flag.code} onChange={value => this.props.editArrayField('flags', index, 'code', value)}>
                  {flagCodeOptions.map(option =>
                    <Option value={option.value}>{option.value} - {option.label}</Option>
                  )}
                </Select>
              </Item>
              <Item label={<InputLabel tooltip="...">Significance</InputLabel>}>
                <Radio.Group value={flag.significance} onChange={ev => this.props.editArrayField('flags', index, 'significance', ev.target.value)}>
                  <Radio.Button value={1}>Yes</Radio.Button>
                  <Radio.Button value={0}>No</Radio.Button>
                </Radio.Group>
              </Item>
              </div>
            </Panel>
            )}
          </Collapse>
          <Button onClick={this.addFlag} className="bottom-btn" block icon="plus" type="dashed">Add CRS++ other flag</Button>

          <Divider />
          <h3>FSS</h3>
          <Item label={<InputLabel tooltip="...">Extraction date</InputLabel>}>
            <DatePicker value={rdr.extractionDate} onChange={value => this.props.editField('extractionDate', value)} format="DD/MM/YYYY" style={{ display: 'block' }} />
          </Item>
          <Item label={<InputLabel optional tooltip="...">Phaseout year</InputLabel>}>
            <InputNumber value={rdr.phaseoutYear} onChange={value => this.props.editField('phaseoutYear', value)} className="phaseout-year-input" />
          </Item>
          <Item label={<InputLabel optional tooltip="...">Priority</InputLabel>}>
            <Select value={rdr.priority} onChange={value => this.props.editField('priority', value)}>
              <Option value="">&nbsp;</Option>
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Item>


          <Collapse
            accordion
            activeKey={this.state.activeForecastsKey}
            onChange={(key) => { this.setState({ activeForecastsKey: key }) }}
          >
            {this.props.rdr.forecasts.map((forecast, index) =>
            <Panel className="forecast-panel" key={`forecast${index}`} header={`CRS++ other forecast: ${forecast.currency} ${String(forecast.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} extra={<Icon type="delete" onClick={event => this.removeArrayItem(event, 'forecasts', index)} />}>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel tooltip="...">Currency</InputLabel>}>
                    <Select showSearch optionFilterProp="children" value={forecast.currency} onChange={value => this.props.editArrayField('forecasts', index, 'currency', value)}>
                      {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
                    </Select>
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel tooltip="..." optional>Value</InputLabel>}>
                    <InputNumber
                      formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/(,*)/g, '')}
                      step={1000}
                      style={{ width: '100%'}}
                      value={forecast.value}
                      onChange={value => this.props.editArrayField('forecasts', index, 'value', value)}
                    />
                  </Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel optional>Year</InputLabel>}>
                    <InputNumber
                      style={{ width: '100%'}}
                      value={forecast.year}
                      onChange={value => this.props.editArrayField('forecasts', index, 'year', value)}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional>Value Date</InputLabel>}>
                    <DatePicker value={forecast.date} onChange={value => this.props.editArrayField('forecasts', index, 'date', value)} placeholder="DD/MM/YYYY" format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Item>
                </Col>
              </Row>
            </Panel>
            )}
          </Collapse>
          <Button onClick={this.addForecast} className="bottom-btn" block icon="plus" type="dashed">Add CRS++ other flag</Button>

          <Collapse
            accordion
            activeKey={this.state.activeLegacyDatasKey}
            onChange={(key) => { this.setState({ activeLegacyDatasKey: key }) }}
          >
          {this.props.rdr.legacyDatas.map((legacyData, index) =>
            <Panel key={`legacyData${index}`} header={`Legacy data: ${legacyData.name ? legacyData.name : 'New'}`} extra={<Icon type="delete" onClick={event => this.removeArrayItem(event, 'legacyDatas', index)} />}>
              <Item label={<InputLabel optional tooltip="...">Name</InputLabel>}>
                <Input value={legacyData.name} onChange={ev => this.props.editArrayField('legacyDatas', index, 'name', ev.target.value)} />
              </Item>
              <Item label={<InputLabel optional tooltip="...">Value</InputLabel>}>
                <Input value={legacyData.value} onChange={ev => this.props.editArrayField('legacyDatas', index, 'value', ev.target.value)} />
              </Item>
              <Item label={<InputLabel optional tooltip="...">IATI equivalent</InputLabel>}>
                <Input value={legacyData.iatiEquivalent} onChange={ev => this.props.editArrayField('legacyDatas', index, 'iatiEquivalent', ev.target.value)} />
              </Item>
            </Panel>
          )}
          </Collapse>
          <Button onClick={this.addLegacyData} className="bottom-btn" block icon="plus" type="dashed">Add another legacy data</Button>
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ reportingRdr }) => ({ rdr: reportingRdr }),
  actions
)(Reporting)
