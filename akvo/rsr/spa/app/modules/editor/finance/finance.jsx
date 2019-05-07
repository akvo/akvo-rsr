import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Col, Row, Select } from 'antd'

import _Field from '../../../utils/field'
import { Aux, validationType } from '../../../utils/misc'
import BudgetItems from './budget-items/budget-items'
import CountryBudgetItems from './country-budget-items/country-budget-items'
import Transactions from './transactions/transactions'
import Disbursements from './disbursements/disbursements'
import * as actions from './actions'
import './styles.scss'

// const { Panel } = Collapse
const { Option } = Select
const { Item } = Form
const Field = connect(({financeRdr}) => ({ rdr: financeRdr }), actions)(_Field)

class Finance extends React.Component{
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    const isDGIS = this.props.validations.indexOf(validationType.DGIS) !== -1
    return (
      <div className="finance view">
        <Form layout="vertical">
        <Field
          name="donateUrl"
          render={props => (
            <Item label="Donate URL">
              <Input {...props} placeholder="http://..." />
            </Item>
          )}
        />
        <BudgetItems />
        {isIATI && (
          <Row>
            <Col span={12}>
            <Field
              name="capitalSpendPercentage"
              render={props => (
                <Item label="Capital spend percentage">
                  <Input {...props} suffix={<span>%</span>} className="capital-percentage" />
                </Item>
              )}
            />
            </Col>
          </Row>
        )}
        {isIATI && (
          <Aux>
            <h3>Country budget items</h3>
            <Field
              name="countryBudgetVocabulary"
              render={props => (
                <Item label="Country budget vocabulary">
                  <Select {...props}>
                    <Option value="">&nbsp;</Option>
                    <Option value="1">1 - IATI</Option>
                    <Option value="2">2 - Country Chart of Accounts</Option>
                    <Option value="3">3 - Other Country System</Option>
                    <Option value="4">4 - Reporting Organisation</Option>
                    <Option value="5">5 - Other</Option>
                  </Select>
                </Item>
              )}
            />
            <CountryBudgetItems />
          </Aux>
        )}
        {(isIATI || isDGIS) && (
          <Aux>
            <h3>Transactions</h3>
            <Transactions />
            <h3>Planned disbursements</h3>
            <Disbursements />
          </Aux>
        )}
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ infoRdr }) => ({ validations: infoRdr.validations })
)(Finance)
