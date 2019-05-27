import React from 'react'
import { connect } from 'react-redux'
import { Form, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

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

class Finance extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    const validationSets = getValidationSets(this.props.validations, validationDefs)
    const fieldExists = doesFieldExist(validationSets)
    return (
      <div className="finance view">
        <SectionContext.Provider value="section6">
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
          <Form layout="vertical">
            <Item label="Donate URL">
            <FinalField
              name="donateUrl"
              placeholder="http://..."
              control="input"
            />
            </Item>
            <BudgetItems formPush={push} validations={this.props.validations} />
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
                <Transactions formPush={push} validations={this.props.validations} />
              </Aux>
            )}
            {fieldExists('plannedDisbursements') && (
              <Aux>
                <h3>Planned disbursements</h3>
                <PlannedDisbursements formPush={push} validations={this.props.validations} />
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
}

export default connect(
  ({ editorRdr: { validations, section6: { fields }} }) => ({ validations, fields })
)(Finance)
