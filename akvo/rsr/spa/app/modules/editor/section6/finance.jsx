import React from 'react'
import { connect } from 'react-redux'
import { Form, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'

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
          <Item label="Donate URL">
          <FinalField
            name="donateUrl"
            placeholder="http://..."
            control="input"
          />
          </Item>
          {fieldExists('capitalSpendPercentage') && (
            <Row>
              <Col span={12}>
              <Item label="Capital spend percentage">
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
              <h3>Country budget items</h3>
              <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
              <FinalField
                name="countryBudgetVocabulary"
                control="select"
                options={[
                  { value: '1', label: 'IATI'},
                  { value: '2', label: 'Country Chart of Accounts'},
                  { value: '3', label: 'Other Country System'},
                  { value: '4', label: 'Reporting Organisation'},
                  { value: '5', label: 'Other'}
                ]}
                withEmptyOption
              />
              </Item>
              <CountryBudgetItems formPush={push} />
            </Aux>
          )}
          {fieldExists('transactions') && (
            <Aux>
              <h3>Transactions</h3>
              <Transactions formPush={push} validations={validations} />
            </Aux>
          )}
          {fieldExists('plannedDisbursements') && (
            <Aux>
              <h3>Planned disbursements</h3>
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
  return isEqual(prevProps.fields, nextProps.fields)
}))
