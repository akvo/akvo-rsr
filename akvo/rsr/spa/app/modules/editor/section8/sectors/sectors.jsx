import React from 'react'
import { Form, Button } from 'antd'
import { Field } from 'react-final-form'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import { doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import CODE_OPTIONS from '../codes.json'
import VOCABULARY_OPTIONS from '../vocab.json'
import EUTF_SECTOR_OPTIONS from './eutf-sector-options.json'

const { Item } = Form

const Sectors = ({ validations, formPush, primaryOrganisation }) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isOptional = isFieldOptional(validationSets)
  const isDFID = validations.indexOf(6) !== -1 // explicit check for DFID is required to set conditional "optional" flag
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
        formPush={formPush}
        panel={name => (
        <div>
          <Item label={<InputLabel optional={isOptional('vocabulary')} tooltip="...">Vocabulary</InputLabel>}>
            <FinalField
              control="select"
              options={VOCABULARY_OPTIONS}
              name={`${name}.vocabulary`}
              withEmptyOption
              withValuePrefix
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
          <Field
            name={`${name}.vocabulary`}
            render={
              ({input}) => (
                <Item label={<InputLabel optional={isDFID ? (input.value === undefined || input.value === '') : isOptional('sectorCode')} tooltip="...">Sector code</InputLabel>}>
                  <FinalField
                    control="select"
                    options={(primaryOrganisation === 3394 && input.value === '99') ? EUTF_SECTOR_OPTIONS : CODE_OPTIONS}
                    name={`${name}.sectorCode`}
                    showSearch
                    optionFilterProp="children"
                    withEmptyOption
                    withValuePrefix
                  />
                </Item>
              )
            }
          />
          {fieldExists('percentage') && (
            <div>
              <div className="percentage-row">
                <Item label={<InputLabel optional={isOptional('percentage')}>Percentage</InputLabel>}>
                  <FinalField
                    control="input"
                    name={`${name}.percentage`}
                    suffix={<span>%</span>}
                    className="percentage-input"
                  />
                </Item>
                {fieldExists('text') && (
                  <Item label={<InputLabel optional={isOptional('text')}>Description</InputLabel>}>
                    <FinalField
                      control="textarea"
                      rows={2}
                      name={`${name}.text`}
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

export default Sectors
