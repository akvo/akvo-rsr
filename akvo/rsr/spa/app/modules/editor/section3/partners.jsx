import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Popconfirm } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'
import { withTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import Condition from '../../../utils/condition'
import ItemArray, { PanelHeaderMore } from '../../../utils/item-array'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import InputLabel from '../../../utils/input-label'
import './styles.scss'
import api from '../../../utils/api'
import OrganizationSelect from '../../../utils/organization-select'
import { removeSetItem } from '../actions'
import SectionContext from '../section-context'

const { Item } = Form


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
  removeItem = (index, fields) => {
    this.props.removeSetItem(3, 'partners', index)
    fields.remove(index)
  }
  render(){
    const { t } = this.props
    const currencySymbol = getSymbolFromCurrency(this.props.currency)
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    const ROLE_OPTIONS = [
      { value: 2, label: t('Accountable partner') },
      { value: 3, label: t('Extending partner') },
      { value: 1, label: t('Funding partner') },
      { value: 4, label: t('Implementing partner') },
      { value: 101, label: t('Reporting organisation') },
      { value: 100, label: t('Sponsor partner') },
    ]
    return (
      <div className="partners view">
        <SectionContext.Provider value="section3">
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
                  <Field name={`partners[${index}].organisationName`} subscription={{ value: true }}>
                    {({input}) => {
                      return (
                        <span>{role ? `${ROLE_OPTIONS.find(it => it.value === role).label}: ${input.value}` : `Partner ${index + 1}`}</span>
                      )
                    }}
                  </Field>
                )
              }}
              renderExtra={(name, index, fields) => {
                return (
                  <Field
                    name={`${name}.iatiOrganisationRole`}
                    render={(roleProps) => {
                      const disabled = roleProps.input.value === 101 && this.props.primaryOrganisation === 3394
                      if(!disabled){
                        return (
                          <span onClick={event => event.stopPropagation()}>{/* eslint-disable-line */}
                            {this.props.headerMore && <PanelHeaderMore render={this.props.headerMore} field={this.props.headerMoreField} name={name} index={index} />}
                            <Popconfirm
                              title="Are you sure to delete this?"
                              onConfirm={() => this.removeItem(index, fields)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button size="small" icon="delete" className="delete-panel" />
                            </Popconfirm>
                          </span>
                        )
                      }
                      return null
                    }}
                  />
                )
              }}
              headerField="iatiOrganisationRole"
              formPush={push}
              panel={name => (
                <div>
                  <Field
                    name={`${name}.iatiOrganisationRole`}
                    render={roleProps => {
                      const disabled = roleProps.input.value === 101 && this.props.primaryOrganisation === 3394
                      return (
                        <div>
                        <FinalField
                          name={`${name}.iatiOrganisationRole`}
                          control="select"
                          options={ROLE_OPTIONS}
                          disabled={disabled}
                          withLabel
                        />
                        <OrganizationSelect
                          name={name}
                          orgs={this.state.orgs}
                          loading={this.state.loading}
                          disabled={disabled}
                          dict={{
                            label: 'project partner',
                            tooltip: 'Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href=\'mailto: support@akvo.org\'>support@akvo.org</a> to request to add it to the database.'
                          }}
                        />
                        <Condition when={`${name}.iatiOrganisationRole`} is={101}>
                          <Item label={<InputLabel tooltip={t('section3.secondaryReporter.tooltip')} optional>{t('section3.secondaryReporter.label')}</InputLabel>}>
                          <FinalField
                            name={`${name}.isSecondaryReporter`}
                            render={({ input }) => (
                                <Radio.Group {...input} disabled={disabled}>
                                  <Radio.Button value>{t('Yes')}</Radio.Button>
                                  <Radio.Button value={false}>{t('No')}</Radio.Button>
                                </Radio.Group>
                            )}
                          />
                          </Item>
                        </Condition>
                        <Condition when={`${name}.iatiOrganisationRole`} is={1}>
                          <FinalField
                            name={`${name}.fundingAmount`}
                            control="input-number"
                            formatter={value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(currencyRegExp, '')}
                            style={{ width: 200 }}
                            withLabel
                          />
                        </Condition>
                        <FinalField
                          name={`${name}.iatiActivityId`}
                          disabled={disabled}
                          withLabel
                          optional
                          control="input"
                        />
                        </div>
                      )
                    }}
                  />
                </div>
              )}
              addButton={({onClick}) => (
                <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add another participating organisation')}</Button>
              )}
            />
          )}
        />
        </Form>
        </SectionContext.Provider>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { validations, section3: { fields }, section1: { fields: { currency, primaryOrganisation } }} }) => ({ validations, currency, fields, primaryOrganisation }),
  { removeSetItem }
)(withTranslation()(Partners))
