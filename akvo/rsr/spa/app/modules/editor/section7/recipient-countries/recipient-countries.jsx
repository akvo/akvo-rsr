import React from 'react'
import { Button, Form } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'

const { Item } = Form

const COUNTRY_OPTIONS = countries.map(({ code, name }) => ({ value: code, label: name }))

const RecipientCountries = ({ validations, formPush }) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <h3>Recipient country</h3>
      <ItemArray
        setName="recipientCountries"
        sectionIndex={7}
        header={(index, countryCode) => (
          <span>Recipient country {index + 1}: {countryCode && countries.find(it => it.code === countryCode).name}</span>
        )}
        headerField="country"
        formPush={formPush}
        panel={name => (
          <div>
            <Item label={<InputLabel tooltip="...">Country</InputLabel>}>
              <FinalField
                name={`${name}.country`}
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                control="select"
                options={COUNTRY_OPTIONS}
              />
            </Item>
            <span className="percentage-row">
              {fieldExists('percentage') && (
                <Item label="Percentage">
                <FinalField
                  name={`${name}.percentage`}
                  control="input"
                  suffix={<span>%</span>}
                  className="percentage-input"
                />
                </Item>
              )}
              {fieldExists('text') && (
                <Item label={<InputLabel optional>Description</InputLabel>}>
                <FinalField
                  name={`${name}.text`}
                  control="textarea"
                  rows={2}
                />
                </Item>
              )}
            </span>
          </div>
        )}
        addButton={({ onClick }) => (
          <Button onClick={onClick} icon="plus" type="dashed" block>
            Add recipient country
          </Button>
        )}
      />
    </div>
  )
}

export default RecipientCountries
