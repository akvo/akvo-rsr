import React from 'react'
import { connect } from 'react-redux'
import { Select, Button, Collapse, Row, Col, Icon, Form, InputNumber, DatePicker } from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import * as actions from '../actions'

const { Item } = Form
const { Option } = Select
const { Panel } = Collapse

class ForecastsStack extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.rdr.length > 0 ? `forecast${props.rdr.length - 1}` : 0
    }
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeForecast(index)
  }
  add = () => {
    this.setState({
      activeKey: `forecast${this.props.rdr.length}`
    })
    this.props.addForecast()
  }
  render(){
    return (
      <div>
        <Collapse
          accordion
          activeKey={this.state.activeKey}
          onChange={(key) => { this.setState({ activeKey: key }) }}
        >
          {this.props.rdr.map((forecast, index) =>
          <Panel className="forecast-panel" key={`forecast${index}`} header={`CRS++ other forecast: ${forecast.currency} ${String(forecast.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel tooltip="...">Currency</InputLabel>}>
                  <Select showSearch optionFilterProp="children" value={forecast.currency} onChange={value => this.props.editForecastField(index, 'currency', value)}>
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
                    onChange={value => this.props.editForecastField(index, 'value', value)}
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
                    onChange={value => this.props.editForecastField(index, 'year', value)}
                  />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Value Date</InputLabel>}>
                  <DatePicker value={forecast.date} onChange={value => this.props.editForecastField(index, 'date', value)} placeholder="DD/MM/YYYY" format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Item>
              </Col>
            </Row>
          </Panel>
          )}
        </Collapse>
        <Button onClick={this.add} className="bottom-btn" block icon="plus" type="dashed">Add CRS++ other flag</Button>
      </div>
    )
  }
}

export default connect(({ forecastsRdr }) => ({ rdr: forecastsRdr }), actions)(ForecastsStack)
