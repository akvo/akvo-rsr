import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber, Modal, Radio, Col, Row, DatePicker } from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import { Aux, validationType, inputNumberAmountFormatting, datePickerConfig } from '../../../../utils/misc'
import UpdateHalter from '../../../../utils/update-halter'
import * as actions from './actions'

const { Item } = Form
const { Panel } = Collapse
const { Option } = Select
const Field = connect(
  ({ disbursementsRdr }) => ({ rdr: disbursementsRdr }),
  actions
)(_Field)

const ValueDateField = ({ index, optional }) => (
  <Field
    name="valueDate"
    index={index}
    additionalWatchProp="value"
    render={props => (
      <Item label={<InputLabel optional={optional}>Value date</InputLabel>}>
        <DatePicker {...{...props, ...datePickerConfig}} />
      </Item>
    )}
  />
)

class Disbursements extends React.Component{
  state = {
    activeKey: ''
  }
  constructor(props){
    super(props)
    if(props.rdr.length > 0){
      this.state = {
        activeKey: `${props.rdr.length - 1}`
      }
    }
  }
  add = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.remove(index)
  }
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <div>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((item, index) => {
          return (
            <Panel
              header={`Disbursement ${index + 1}`}
              extra={<span><Icon type="delete" onClick={event => this.remove(event, index)} /></span>}
              key={`${index}`}
            >
              <UpdateHalter except={['value']} item={item}>
                <Row gutter={16}>
                  {isIATI && (
                    <Col span={12}>
                      <Field
                        name="currency"
                        index={index}
                        render={fieldProps => (
                          <Item label={<InputLabel optional tooltip="...">Currency</InputLabel>}>
                            <Select showSearch optionFilterProp="children" {...fieldProps}>
                              {currencies.map(({ code, currency }) => <Option value={code}>{code} - {currency}</Option>)}
                            </Select>
                          </Item>
                        )}
                      />
                    </Col>
                  )}
                  <Col span={12}>
                    <Field
                      name="value"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional tooltip="...">Amount</InputLabel>}>
                          <InputNumber
                            {...{...props, ...inputNumberAmountFormatting}}
                            step={1000}
                          />
                        </Item>
                      )}
                    />
                  </Col>
                  {!isIATI && (
                    <Col span={12}>
                      <ValueDateField index={index} optional={item.value === null} />
                    </Col>
                  )}
                </Row>
                {isIATI &&
                <Row gutter={16}>
                  <Col span={12}>
                    <ValueDateField index={index} optional={item.value === null || item.value === ''} />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="type"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Type</InputLabel>}>
                          <Radio.Group {...props}>
                            <Radio.Button value="1">Original</Radio.Button>
                            <Radio.Button value="2">Revised</Radio.Button>
                          </Radio.Group>
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                }
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name="periodStart"
                      additionalWatchProp="value"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional={item.value === null || item.value === ''}>Period start</InputLabel>}>
                          <DatePicker {...{...props, ...datePickerConfig}} />
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="periodEnd"
                      additionalWatchProp="value"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional={item.value === null || item.value === ''}>Period end</InputLabel>}>
                          <DatePicker {...{...props, ...datePickerConfig}} />
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <section>
                  <div className="h-holder">
                    <h5>Provider organisation</h5>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Field
                        name="providerOrganisation"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Name</InputLabel>}>
                            <Input {...props} />
                          </Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="providerOrganisationActivityId"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Activity ID</InputLabel>}>
                            <Input {...props} />
                          </Item>
                        )}
                      />
                    </Col>
                  </Row>
                </section>
                <section>
                  <div className="h-holder">
                    <h5>Recipient organisation</h5>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Field
                        name="recipientOrganisation"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Name</InputLabel>}>
                            <Input {...props} />
                          </Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="recipientOrganisationActivityId"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Activity ID</InputLabel>}>
                            <Input {...props} />
                          </Item>
                        )}
                      />
                    </Col>
                  </Row>
                </section>
              </UpdateHalter>
            </Panel>
          )
        })}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add planned disbursement</Button>

      </div>
    )
  }
}

export default connect(
  ({ disbursementsRdr, infoRdr }) => ({ rdr: disbursementsRdr, validations: infoRdr.validations }),
  actions
)(Disbursements)
