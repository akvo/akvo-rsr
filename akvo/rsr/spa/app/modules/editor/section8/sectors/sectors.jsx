import React from 'react'
import { Form, Button } from 'antd'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import { doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import { getValidationSets } from './validations'
import CODE_OPTIONS from '../codes.json'
import VOCABULARY_OPTIONS from '../vocab.json'

const { Item } = Form

class Sectors extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    const isOptional = isFieldOptional(validationSets)
    return (
      <div>
        <h3>Sectors</h3>
        <ItemArray
          setName="sectors"
          sectionIndex={8}
          header={(index, vocabulary) => {
            return (
              <span>Sector {index + 1}: {vocabulary !== '' && VOCABULARY_OPTIONS.find(it => it.value === vocabulary).label}</span>
            )
          }}
          headerField="vocabulary"
          formPush={this.props.formPush}
          panel={name => (
          <div>
            <Item label={<InputLabel tooltip="...">Vocabulary</InputLabel>}>
              <FinalField
                control="select"
                options={VOCABULARY_OPTIONS}
                name={`${name}.vocabulary`}
              />
            </Item>
            {fieldExists('vocabularyUri') && (
              <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                <FinalField
                  control="input"
                  name={`${name}.vocabularyUri`}
                />
              </Item>
            )}
            <Item label={<InputLabel optional={isOptional('code')} tooltip="...">Additional info</InputLabel>}>
              <FinalField
                control="select"
                options={CODE_OPTIONS}
                name={`${name}.code`}
                showSearch
                optionFilterProp="children"
              />
            </Item>
            {fieldExists('percentage') && (
              <div>
                <div className="percentage-row">
                  <Item label={<InputLabel>Percentage</InputLabel>}>
                    <FinalField
                      control="input"
                      name={`${name}.percentage`}
                      suffix={<span>%</span>}
                      className="percentage-input"
                    />
                  </Item>
                  {fieldExists('description') && (
                    <Item label={<InputLabel optional>Description</InputLabel>}>
                      <FinalField
                        control="textarea"
                        rows={2}
                        name={`${name}.description`}
                      />
                    </Item>
                  )}
                </div>
              </div>
            )}
          </div>
          )}
          modal={{
            buttonText: 'Add sector',
            className: 'add-sector-modal',
            component: ({ onClick }) => (
              <div>
                {VOCABULARY_OPTIONS.map(item => (
                  <div className="desc-block">
                    <Button block icon="plus" onClick={() => onClick({ vocabulary: item.value })}>{item.label}</Button>
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

export default Sectors
