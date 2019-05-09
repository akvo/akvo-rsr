import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Select, Icon, Input, Row, Col } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import countries from '../../../../utils/countries'
import { doesFieldExist } from '../../../../utils/validation-utils'
import UpdateHalter from '../../../../utils/update-halter'
import { getValidationSets } from './validations'
import * as actions from './actions'
import regionOptions from './regions.json'
import '../styles.scss'

const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ recipientRegionsRdr }) => ({ rdr: recipientRegionsRdr }),
  actions
)(_Field)


class RecipientRegion extends React.Component{
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    // const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <div>
          <h3>Recipient region</h3>
          {this.props.rdr.map((country, index) =>
          <UpdateHalter>
          <div className="location-item">
            <Field
              name="region"
              index={index}
              render={props => (
                <Item label={<InputLabel tooltip="..." more={<Icon type="delete" onClick={() => this.props.remove(index)} />}>Region</InputLabel>}>
                  <Select
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    {...props}
                  >
                    <Option value="">&nbsp;</Option>
                    {regionOptions.map(item =>
                    <Option value={item.value}>{item.label}</Option>
                    )}
                  </Select>
                </Item>
              )}
            />
            {fieldExists('vocabulary') && (
              <Row gutter={16}>
                <Col span={12}>
                <Field
                  name="vocabulary"
                  index={index}
                  render={props => (
                    <Item label={<InputLabel optional tooltip="...">Vocabulary</InputLabel>}>
                      <Select
                        {...props}
                      >
                        <Option value="">&nbsp;</Option>
                        <Option value="1">1 - OECD DAC</Option>
                        <Option value="2">2 - UN</Option>
                        <Option value="99">99 - Reporting Organisation</Option>
                      </Select>
                    </Item>
                  )}
                />
                </Col>
                <Col span={12}>
                  <Field
                    name="vocabularyUri"
                    index={index}
                    render={props => (
                      <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                        <Input {...props} />
                      </Item>
                    )}
                  />
                </Col>
              </Row>
            )}
            <div className="percentage-row">
              {fieldExists('percentage') && (
                <Field
                  name="percentage"
                  index={index}
                  render={props => (
                    <Item label="Percentage">
                      <Input {...props} suffix={<span>%</span>} className="percentage-input" />
                    </Item>
                  )}
                />
              )}
              {fieldExists('description') && (
                <Field
                  name="description"
                  index={index}
                  render={props => (
                    <Item label={<InputLabel optional>Description</InputLabel>}>
                      <Input.TextArea rows={2} {...props} />
                    </Item>
                  )}
                />
              )}
            </div>
          </div>
          </UpdateHalter>
          )}
          <Button onClick={() => this.props.add()} icon="plus" type="dashed" block>
            Add recipient region
          </Button>
      </div>
    )
  }
}

export default connect(
  ({ recipientRegionsRdr, infoRdr }) => ({ rdr: recipientRegionsRdr, validations: infoRdr.validations }),
  actions
)(RecipientRegion)
