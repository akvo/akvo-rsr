import React from 'react'
import { connect } from 'react-redux'
import { Form, Select } from 'antd'

import LocationsItems from './location-items/location-items'
import Countries from './recipient-countries/recipient-countries'
import InputLabel from '../../../utils/input-label'
import _Field from '../../../utils/field'
import Regions from './recipient-regions/recipient-regions'
import { Aux } from '../../../utils/misc'
import { validationType } from '../../../utils/validation-utils'
import * as actions from './actions'
import scopeOptions from './scope-options.json'

const { Item } = Form
const { Option } = Select
const Field = connect(
  ({ locationsRdr }) => ({rdr: locationsRdr }),
  actions
)(_Field)

class LocationsView extends React.Component{
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    const isDGIS = this.props.validations.indexOf(validationType.DGIS) !== -1
    return (
      <div className="locations view">
        <Form layout="vertical">
          {isIATI &&
          <Field
            name="projectScope"
            render={props => (
              <Item label={<InputLabel optional>Project scope</InputLabel>}>
                <Select {...props}>
                  <Option value="">&nbsp;</Option>
                  {scopeOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                </Select>
              </Item>
            )}
          />
          }
          <LocationsItems />
          <hr />
          <Countries />
          {(isIATI || isDGIS) && (
            <Aux>
              <hr />
              <Regions />
            </Aux>
          )}
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ infoRdr }) => ({ validations: infoRdr.validations })
)(LocationsView)
