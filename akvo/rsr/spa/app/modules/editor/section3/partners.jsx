import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'

import FinalField from '../../../utils/final-field'
import Condition from '../../../utils/condition'
import ItemArray from '../../../utils/item-array'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import InputLabel from '../../../utils/input-label'
import './styles.scss'
import api from '../../../utils/api';

const { Item } = Form

const ROLE_OPTIONS = [
  { value: 2, label: 'Accountable partner'},
  { value: 3, label: 'Extending partner'},
  { value: 1, label: 'Funding partner'},
  { value: 4, label: 'Implementing partner'},
  { value: 101, label: 'Reporting organization'},
  { value: 100, label: 'Sponsor partner'}
]

// /typeaheads/organisations

class Partners extends React.Component{
  state = {
    orgs: []
  }
  componentDidMount(){
    api.get('/typeaheads/organisations')
    .then(({ data: {results}}) => {
      this.setState({
        orgs: results.map(it => ({ value: it.id, label: it.name }))
      })
    })
  }
  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(nextProps.fields, this.props.fields) || nextState !== this.state
  }
  render(){
    const currencySymbol = getSymbolFromCurrency(this.props.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    return (
      <div className="partners view">
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
            <ItemArray
              setName="partners"
              sectionIndex={3}
              header={(index, role) => {
                return (
                  <Field name={`partners[${index}].organisation`} subscription={{ value: true }}>
                    {({input}) => {
                      const org = this.state.orgs.find(it => it.value === input.value)
                      const orgName = org ? org.label : ''
                      return (
                        <span>{role ? `${ROLE_OPTIONS.find(it => it.value === role).label}: ${orgName}` : `Partner ${index + 1}`}</span>
                      )
                    }}
                  </Field>
                )
              }}
              headerField="iatiOrganisationRole"
              formPush={push}
              panel={name => (
                <div>
                  <Item label="Role">
                  <FinalField
                    name={`${name}.iatiOrganisationRole`}
                    control="select"
                    options={ROLE_OPTIONS}
                  />
                  </Item>
                  <Item label="Organisation">
                  <FinalField
                    name={`${name}.organisation`}
                    control="select"
                    options={this.state.orgs}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  />
                  </Item>
                  <Condition when={`${name}.iatiOrganisationRole`} is={101}>
                    <Item label={<InputLabel optional>Secondary reporter</InputLabel>}>
                    <FinalField
                      name={`${name}.isSecondaryReporter`}
                      render={({ input }) => (
                          <Radio.Group {...input}>
                            <Radio.Button value>Yes</Radio.Button>
                            <Radio.Button value={false}>No</Radio.Button>
                          </Radio.Group>
                      )}
                    />
                    </Item>
                  </Condition>
                  <Condition when={`${name}.iatiOrganisationRole`} is={1}>
                    <Item label="Funding amount">
                    <FinalField
                      name={`${name}.fundingAmount`}
                      control="input-number"
                      formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(currencyRegExp, '')}
                      style={{ width: 200 }}
                    />
                    </Item>
                  </Condition>
                  <Item label={<InputLabel optional>IATI Activity ID</InputLabel>}>
                  <FinalField
                    name={`${name}.iatiActivityId`}
                  />
                  </Item>
                </div>
              )}
              addButton={({onClick}) => (
                <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add a partner</Button>
              )}
            />
          )}
        />
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { validations, section3: { fields }, section1: { fields: { currency } }} }) => ({ validations, currency, fields }),
)(Partners)
