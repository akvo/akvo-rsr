import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Popconfirm } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'
import { withTranslation, useTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import Condition from '../../../utils/condition'
import { doesFieldExist, getValidationSets } from '../../../utils/validation-utils'
import ItemArray, { PanelHeaderMore } from '../../../utils/item-array'
import getSymbolFromCurrency from '../../../utils/get-symbol-from-currency'
import InputLabel from '../../../utils/input-label'
import './styles.scss'
import OrganizationSelect from '../../../utils/organization-select'
import { removeSetItem } from '../actions'
import SectionContext from '../section-context'
import { useFetch } from '../../../utils/hooks'
import validationDefs from './partners/validations'

const { Item } = Form

const Partners = ({ removeSetItem, fields, headerMore, currency, headerMoreField, primaryOrganisation, validations }) => { // eslint-disable-line
  const [{ results }, loading] = useFetch('/typeaheads/organisations')
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const removeItem = (index, fields) => { // eslint-disable-line
    removeSetItem(3, 'partners', index)
    fields.remove(index)
  }
  const currencySymbol = getSymbolFromCurrency(currency)
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
            onSubmit={() => { }}
            initialValues={fields}
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
                        {({ input }) => {
                          return (
                            <span>{role ? `${ROLE_OPTIONS.find(it => it.value === role).label}: ${input.value}` : `Partner ${index + 1}`}</span>
                          )
                        }}
                      </Field>
                    )
                  }}
                  renderExtra={(name, index, fields) => { // eslint-disable-line
                    return (
                      <Field
                        name={`${name}.iatiOrganisationRole`}
                        render={(roleProps) => {
                          const disabled = roleProps.input.value === 101 && primaryOrganisation === 3394
                          if (!disabled) {
                            return (
                              <span onClick={event => event.stopPropagation()}>{/* eslint-disable-line */}
                                {headerMore && <PanelHeaderMore render={headerMore} field={headerMoreField} name={name} index={index} />}
                                <Popconfirm
                                  title={t('Are you sure to delete this?')}
                                  onConfirm={() => removeItem(index, fields)}
                                  okText={t('Yes')}
                                  cancelText={t('No')}
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
                          const disabled = roleProps.input.value === 101 && primaryOrganisation === 3394
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
                                orgs={results}
                                loading={loading}
                                disabled={disabled}
                                dict={{
                                  label: t('project partner'),
                                  tooltip: t('Select an organisation that is playing a role in the project. If an organisation is not currently featured in RSR, please contact <a href=\'mailto: support@akvo.org\'>support@akvo.org</a> to request to add it to the database.')
                                }}
                              />
                              <Condition when={`${name}.iatiOrganisationRole`} is={101}>
                                <Item label={<InputLabel tooltip={t('section3::secondaryReporter::tooltip')} optional>{t('section3::secondaryReporter::label')}</InputLabel>}>
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
                                fieldExists={fieldExists}
                                control="input"
                              />
                            </div>
                          )
                        }}
                      />
                    </div>
                  )}
                  addButton={({ onClick }) => (
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

export default connect(
  ({ editorRdr: { validations, section3: { fields }, section1: { fields: { currency, primaryOrganisation } }} }) => ({ validations, currency, fields, primaryOrganisation }),
  { removeSetItem }
)(withTranslation()(React.memo(Partners, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1
  return !shouldUpdate
})))
