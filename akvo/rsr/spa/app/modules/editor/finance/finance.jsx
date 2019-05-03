import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Col, Row } from 'antd'

import _Field from '../../../utils/field'
import { Aux, validationType } from '../../../utils/misc'
import BudgetItems from './budget-items/budget-items'
import * as actions from './actions'
import './styles.scss'

// const { Panel } = Collapse
const { Item } = Form
const Field = connect(({financeRdr}) => ({ rdr: financeRdr }), actions)(_Field)

class Finance extends React.Component{
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <div className="finance view">
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
                  <Input {...props} />
                </Item>
              )}
            />
          </Aux>
        )}
      </div>
    )
  }
}

export default connect(
  ({ infoRdr }) => ({ validations: infoRdr.validations })
)(Finance)
