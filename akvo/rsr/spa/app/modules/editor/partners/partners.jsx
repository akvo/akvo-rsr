import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Select, InputNumber, Radio } from 'antd'

import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import _Field from '../../../utils/field'
import InputLabel from '../../../utils/input-label'
import { validationType, isFieldValid } from '../../../utils/misc'
import { getValidationSets } from './validations'
import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ partnersRdr }) => ({ rdr: partnersRdr }),
  { editField: actions.editPartnerField }
)(_Field)

const roles = [
  { value: 2, label: 'Accountable partner'},
  { value: 3, label: 'Extending partner'},
  { value: 1, label: 'Funding partner'},
  { value: 4, label: 'Implementing partner'},
  { value: 101, label: 'Reporting organization'},
  { value: 100, label: 'Sponsor partner'}
]

class Partners extends React.Component{
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
    if(nextProps.rdr.length !== this.props.rdr.length){
      return true
    }
    for(let i = 0; i < nextProps.rdr.length; i += 1){
      if(nextProps.rdr[i] !== this.props.rdr[i]){
        return true
      }
    }
    return nextState !== this.state
  }
  add = () => {
    this.setState({
      activeKey: `p${this.props.rdr.length}`
    })
    this.props.addPartner()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removePartner(index)
  }
  render(){
    const currencySymbol = getSymbolFromCurrency(this.props.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    const validationSets = getValidationSets(this.props.validations)
    const isValid = isFieldValid(validationSets)
    return (
      <div className="partners view">
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((partner, index) =>
            <Panel
              header={`${roles.find(it => it.value === partner.role).label}: ${partner.name}`}
              extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
              key={`p${index}`}
            >
              <Form layout="vertical">
                <Field
                  name="role"
                  index={index}
                  render={props => (
                    <Item label="Role">
                      <Select {...props}>
                        {roles.map(role =>
                          <Option key={role.value} value={role.value}>{role.label}</Option>
                        )}
                      </Select>
                    </Item>
                  )}
                />
                <Field
                  name="name"
                  index={index}
                  render={props => (
                    <Item
                      hasFeedback
                      validateStatus={isValid(props.name, props.value) && props.value ? 'success' : ''}
                      label="Organisation"
                    >
                      <Input {...props} />
                    </Item>
                  )}
                />
                {partner.role === 101 &&
                <Field
                  name="secondaryReporter"
                  index={index}
                  render={props => (
                    <Item label="Secondary reporter">
                      <Radio.Group {...props}>
                        <Radio.Button value>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                      </Radio.Group>
                    </Item>
                  )}
                />
                }
                {partner.role === 1 &&
                <Field
                  name="fundingAmount"
                  index={index}
                  render={props => (
                    <Item label="Funding amount">
                      <InputNumber
                        {...props}
                        formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(currencyRegExp, '')}
                        style={{ width: 200 }}
                        step={1000}
                      />
                    </Item>
                  )}
                />
                }
                {(this.props.validations.indexOf(validationType.IATI) !== -1 || this.props.validations.indexOf(validationType.DGIS) !== -1) && (
                  <Field
                    name="iatiActivityId"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>IATI Activity ID</InputLabel>}>
                        <Input {...props} />
                      </Item>
                    )}
                  />
                )}
              </Form>
            </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.add}>Add a partner</Button>
      </div>
    )
  }
}

export default connect(
  ({ partnersRdr, infoRdr }) => ({ rdr: partnersRdr, currency: infoRdr.currency, validations: infoRdr.validations }),
  actions
)(Partners)
