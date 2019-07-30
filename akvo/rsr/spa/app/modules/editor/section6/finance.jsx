import React from 'react'
import { connect } from 'react-redux'
import { Form, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import { diff } from 'deep-object-diff'

import { Aux } from '../../../utils/misc'
import InputLabel from '../../../utils/input-label'
import { getValidationSets, doesFieldExist } from '../../../utils/validation-utils'
import BudgetItems from './budget-items/budget-items'
import CountryBudgetItems from './country-budget-items/country-budget-items'
import Transactions from './transactions/transactions'
import PlannedDisbursements from './planned-disbursements/disbursements'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import SectionContext from '../section-context'
import validationDefs from './validations'
import './styles.scss'

const { Item } = Form

const Finance = ({ validations, fields }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div className="finance view">
      <SectionContext.Provider value="section6">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
        <Form layout="vertical">
          <Item label={<InputLabel optional tooltip={t('Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR.')}>{t('Donate URL')}</InputLabel>}>
          <FinalField
            name="donateUrl"
            placeholder="http://..."
            control="input"
          />
          </Item>
          {fieldExists('capitalSpendPercentage') && (
            <Row>
              <Col span={12}>
              <Item label={<InputLabel optional tooltip={t('The percentage of the total commitment allocated to or planned for capital expenditure. Content must be a positive decimal number between 0 and 100, with no percentage sign. Use a period to denote decimals.')}>{t('Capital spend percentage')}</InputLabel>}>
              <FinalField
                name="capitalSpendPercentage"
                suffix={<span>%</span>}
                className="capital-percentage"
                control="input"
              />
              </Item>
              </Col>
            </Row>
          )}
          <BudgetItems formPush={push} validations={validations} />
          {fieldExists('countryBudgetItems') && (
            <Aux>
              <h3>{t('Country budget items')}</h3>
              <Item label={<InputLabel optional tooltip={t('Enter an IATI code for the common functional classification or country system (this allows for common codes, country-specific codes, or any other classification agreed between countries and donors) see: <a href="http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/" target="_blank">http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/</a>.')}>{t('Vocabulary')}</InputLabel>}>
              <FinalField
                name="countryBudgetVocabulary"
                control="select"
                options={[
                  { value: '1', label: 'IATI'},
                  { value: '2', label: t('Country Chart of Accounts')},
                  { value: '3', label: t('Other Country System')},
                  { value: '4', label: t('Reporting Organisation')},
                  { value: '5', label: t('Other')}
                ]}
                withEmptyOption
              />
              </Item>
              <CountryBudgetItems formPush={push} />
            </Aux>
          )}
          {fieldExists('transactions') && (
            <Aux>
              <h3>{t('Transactions')}</h3>
              <Transactions formPush={push} validations={validations} />
            </Aux>
          )}
          {fieldExists('plannedDisbursements') && (
            <Aux>
              <h3>{t('Planned disbursements')}</h3>
              <PlannedDisbursements formPush={push} validations={validations} />
            </Aux>
          )}
          <AutoSave sectionIndex={6} />
        </Form>
        )
        }
      />
      </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section6: { fields }, validations}}) => ({ fields, validations}),
)(React.memo(Finance, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1
  return !shouldUpdate
}))
