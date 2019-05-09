import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Select, Icon, Input } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import countries from '../../../../utils/countries'
import { Aux, validationType, doesFieldExist } from '../../../../utils/misc'
import UpdateHalter from '../../../../utils/update-halter'
import { getValidationSets } from './validations'
import * as actions from './actions'
import '../styles.scss'

const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ recipientCountriesRdr }) => ({ rdr: recipientCountriesRdr }),
  actions
)(_Field)


// const RecipientCountries = ({ rdr, ...props }) =>

class RecipientCountries extends React.Component{
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    // const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <div>
          <h3>Recipient country</h3>
          {this.props.rdr.map((country, index) =>
          <UpdateHalter>
          <div className="location-item">
            <Field
              name="country"
              index={index}
              render={props => (
                <Item label={<InputLabel tooltip="..." more={<Icon type="delete" onClick={() => this.props.remove(index)} />}>Country</InputLabel>}>
                  <Select
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    {...props}
                  >
                    {countries.map(item =>
                    <Option value={item.code}>{item.name}</Option>
                    )}
                  </Select>
                </Item>
              )}
            />
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
            Add recipient country
          </Button>
      </div>
    )
  }
}

export default connect(
  ({ recipientCountriesRdr, infoRdr }) => ({ rdr: recipientCountriesRdr, validations: infoRdr.validations }),
  actions
)(RecipientCountries)
