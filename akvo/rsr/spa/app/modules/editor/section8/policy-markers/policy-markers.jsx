import React from 'react'
import { Form, Button } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import MARKER_OPTIONS from './markers.json'
import SIGNIFICANCE_OPTIONS from './significances.json'

const { Item } = Form

class PolicyMarker extends React.Component{
  render(){
    const validationSets = getValidationSets(this.props.validations, validationDefs)
    const fieldExists = doesFieldExist(validationSets)
    return (
      <div>
        <h3>Policy markers</h3>
        <ItemArray
          setName="policyMarkers"
          sectionIndex={8}
          header={(index, value) => {
            return (
              <span>Policy marker {index + 1}: {value !== '' && MARKER_OPTIONS.find(it => it.value === value).label}</span>
            )
          }}
          headerField="policyMarker"
          formPush={this.props.formPush}
          panel={name => (
            <div>
              <Item label={<InputLabel tooltip="...">Policy Marker</InputLabel>}>
                <FinalField
                  control="select"
                  options={MARKER_OPTIONS}
                  name={`${name}.policyMarker`}
                />
              </Item>
              <Item label={<InputLabel tooltip="...">Significance</InputLabel>}>
                <FinalField
                  control="select"
                  options={SIGNIFICANCE_OPTIONS}
                  name={`${name}.significance`}
                />
              </Item>
              {fieldExists('description') && (
                <Item label={<InputLabel optional>Description</InputLabel>}>
                  <FinalField
                    control="input"
                    name={`${name}.description`}
                  />
                </Item>
              )}
              {fieldExists('vocabulary') && (
                <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
                  <FinalField
                    control="select"
                    options={[{value: '1', label: '1 - OECD DAC CRS'}, {value: '99', label: '99 - Reporting Organisation'}]}
                    name={`${name}.vocabulary`}
                  />
                </Item>
              )}
              {fieldExists('vocabularyUri') && (
                <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                  <FinalField
                    control="input"
                    name={`${name}.vocabularyUri`}
                  />
                </Item>
              )}
            </div>
          )}
          modal={{
            buttonText: 'Add Policy Marker',
            className: 'add-sector-modal',
            component: ({ onClick }) => (
              <div>
                {MARKER_OPTIONS.map(item => (
                  <div className="desc-block">
                    <Button block icon="plus" onClick={() => onClick({ policyMarker: item.value })}>{item.label}</Button>
                  </div>
                ))}
              </div>
            )
          }}
        />
      </div>
    )
  }
}

export default PolicyMarker
