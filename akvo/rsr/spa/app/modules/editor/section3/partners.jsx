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
import api from '../../../utils/api'
import OrganizationSelect from '../../../utils/organization-select'
import { useFetch } from '../../../utils/hooks'

const { Item } = Form

const ROLE_OPTIONS = [
  { value: 2, label: 'Accountable partner'},
  { value: 3, label: 'Extending partner'},
  { value: 1, label: 'Funding partner'},
  { value: 4, label: 'Implementing partner'},
  { value: 101, label: 'Reporting organization'},
  { value: 100, label: 'Sponsor partner'}
]

class Partners extends React.Component{
  state = {
    orgs: [],
    loading: true
  }
  componentDidMount(){
    api.get('/typeaheads/organisations')
      .then(({data: {results}}) => this.setState({ orgs: results, loading: false }))
  }
  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(nextProps.fields, this.props.fields) || !isEqual(nextState, this.state)
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
                    <OrganizationSelect
                      name={name}
                      orgs={this.state.orgs}
                      loading={this.state.loading}
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
// const Partners = ({ currency, fields }) => {
//   const [{results}, loading] = useFetch('/typeaheads/organisations')
// }

export default connect(
  ({ editorRdr: { validations, section3: { fields }, section1: { fields: { currency } }} }) => ({ validations, currency, fields }),
)(Partners)

// export default connect(
//   ({ editorRdr: { section3: { fields }, validations}}) => ({ fields, validations}),
// )(React.memo(Partners, (prevProps, nextProps) => {
//   return isEqual(prevProps.fields, nextProps.fields)
// }))
