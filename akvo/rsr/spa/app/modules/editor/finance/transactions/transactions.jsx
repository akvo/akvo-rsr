import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber, Radio, Col, Row, DatePicker } from 'antd'
import currencies from 'currency-codes/data'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import countries from '../../../../utils/countries'
import UpdateHalter from '../../../../utils/update-halter'
import { inputNumberAmountFormatting, datePickerConfig, Aux } from '../../../../utils/misc'
import { validationType } from '../../../../utils/validation-utils'
import * as actions from './actions'
import typeOptions from './options/type-options.json'
import channelOptions from './options/channels.json'
import financeTypeOptions from '../../info/options/finance-types.json'
import flowTypeOptions from '../../info/options/flow-types.json'
import tiedStatusOptions from '../../info/options/tied-statuses.json'
import aidTypeOptions from '../../info/options/aid-types.json'
import aidTypeVocabularyOptions from '../../info/options/aid-type-vocabulary.json'
import regionOptions from './regions.json'
import Sectors from './sectors'

const { Item } = Form
const { Panel } = Collapse
const { Option } = Select
const Field = connect(
  ({ transactionsRdr }) => ({ rdr: transactionsRdr }),
  actions
)(_Field)

const TypeField = ({index}) => (
  <Field
    name="type"
    index={index}
    render={props => (
      <Item label={<InputLabel optional>Type</InputLabel>}>
        <Select {...props}>
          {typeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
        </Select>
      </Item>
    )}
  />
)


class Transactions extends React.Component{
  state = {
    activeKey: ''
  }
  constructor(props){
    super(props)
    if(props.rdr.length > 0){
      this.state = {
        activeKey: `p${props.rdr.length - 1}`
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.rdr.length !== nextProps.rdr.length){
      return true
    }
    return nextState !== this.state
  }
  add = () => {
    this.setState({
      activeKey: `p${this.props.rdr.length}`
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
        {this.props.rdr.map((budgetItem, index) => {
          return (
            <Panel
              header={`Transaction item ${index + 1}`}
              extra={<span><Icon type="delete" onClick={event => this.remove(event, index)} /></span>}
              key={`p${index}`}
            >
              <UpdateHalter>
                  <Row gutter={16}>
                    {isIATI &&
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
                    }
                    {!isIATI &&
                    <Col span={12}>
                      <TypeField index={index} />
                    </Col>
                    }
                    <Col span={12}>
                      <Field
                        name="value"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel tooltip="...">Value</InputLabel>}>
                            <InputNumber
                              {...{...props, ...inputNumberAmountFormatting}}
                              step={1000}
                            />
                          </Item>
                        )}
                      />
                    </Col>
                  </Row>
                  {isIATI && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <TypeField index={index} />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="humanitarianTransaction"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Humanitarian transaction</InputLabel>}>
                            <Radio.Group {...props}>
                              <Radio.Button value>Yes</Radio.Button>
                              <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                          </Item>
                        )}
                      />
                    </Col>
                  </Row>
                  )}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Field
                        name="date"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Date</InputLabel>}>
                            <DatePicker {...{...props, ...datePickerConfig}} />
                          </Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="valueDate"
                        index={index}
                        render={props => (
                          <Item label={<InputLabel optional>Value Date</InputLabel>}>
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
                  <Field
                    name="description"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>Description</InputLabel>}>
                        <Input {...props} />
                      </Item>
                    )}
                  />
                  {isIATI &&
                  <Field
                    name="reference"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>Reference</InputLabel>}>
                        <Input {...props} />
                      </Item>
                    )}
                  />
                  }
                  <Field
                    name="aidTypeVocabulary"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>Aid Type Vocabulary</InputLabel>}>
                        <Select {...props}>
                          {aidTypeVocabularyOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                        </Select>
                      </Item>
                    )}
                  />
                  {isIATI &&
                  <Aux>
                    <Field
                      name="aidType"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Aid Type</InputLabel>}>
                          <Select {...props}>
                            {aidTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                    <Field
                      name="disbursementChannel"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Disbursement Channel</InputLabel>}>
                          <Select {...props}>
                            {channelOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                    <Field
                      name="financeType"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Finance type</InputLabel>}>
                          <Select {...props}>
                            {financeTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                    <Field
                      name="flowType"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Flow type</InputLabel>}>
                          <Select {...props}>
                            {flowTypeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                    <Field
                      name="tiedStatus"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Tied status</InputLabel>}>
                          <Select {...props}>
                            {tiedStatusOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                    <section>
                      <div className="h-holder">
                        <h5>Recipient</h5>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Field
                            name="recipientCountry"
                            index={index}
                            render={props => (
                              <Item label={<InputLabel optional>Country</InputLabel>}>
                                <Select
                                  {...props}
                                  optionFilterProp="children"
                                  showSearch
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                  {countries.map(country =>
                                  <Option value={country.code}>{country.name}</Option>
                                  )}
                                </Select>
                              </Item>
                            )}
                          />
                        </Col>
                        <Col span={12}>
                          <Field
                            name="recipientRegion"
                            index={index}
                            render={props => (
                              <Item label={<InputLabel optional>Region</InputLabel>}>
                                <Select {...props}>
                                  {regionOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                                </Select>
                              </Item>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Field
                            name="recipientRegionVocabulary"
                            index={index}
                            render={props => (
                              <Item label={<InputLabel optional>Region vocabulary</InputLabel>}>
                                <Select {...props}>
                                  <Option value="">&nbsp;</Option>
                                  <Option value="1">1 - OECD DAC</Option>
                                  <Option value="2">2 - UN</Option>
                                  <Option value="99">99 - Reporting Organisation</Option>
                                </Select>
                              </Item>
                            )}
                          />
                        </Col>
                        <Col span={12}>
                          <Field
                            name="recipientRegionVocabularyUri"
                            index={index}
                            render={props => (
                              <Item label={<InputLabel optional>Region vocabulary uri</InputLabel>}>
                                <Input {...props} />
                              </Item>
                            )}
                          />
                        </Col>
                      </Row>
                    </section>
                    <section>
                      <div className="h-holder">
                        <h5>Transaction sectors</h5>
                      </div>
                      <Sectors transactionIndex={index} />
                    </section>
                  </Aux>
                  }
              </UpdateHalter>
            </Panel>
          )
        })}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add transaction</Button>

      </div>
    )
  }
}

export default connect(
  ({ transactionsRdr, infoRdr }) => ({ rdr: transactionsRdr, validations: infoRdr.validations }),
  actions
)(Transactions)
