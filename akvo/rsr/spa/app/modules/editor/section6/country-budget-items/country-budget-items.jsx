import React from 'react'
import { Form, Button } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import CODE_OPTIONS from './options.json'

const { Item } = Form

const CountryBudgetItems = ({ formPush }) => {
  return (
    <ItemArray
      setName="countryBudgetItems"
      sectionIndex={6}
      header={(index, code) => {
        return <span>{code ? CODE_OPTIONS.find(it => it.value === code).label : `Country budget item ${index + 1}`}</span>
      }}
      headerField="code"
      formPush={formPush}
      panel={name => (
        <div>
        <Item label={<InputLabel optional tooltip="...">Item code</InputLabel>}>
        <FinalField
          name={`${name}.code`}
          control="select"
          options={CODE_OPTIONS}
        />
        </Item>
        <div className="percentage-row">
          <Item label="Percentage">
          <FinalField
            name={`${name}.percentage`}
            suffix={<span>%</span>}
            className="capital-percentage"
          />
          </Item>
          <Item label={<InputLabel optional>Description</InputLabel>}>
          <FinalField
            name={`${name}.description`}
          />
          </Item>
        </div>
        </div>
      )}
      addButton={({onClick}) => (
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add country budget item</Button>
      )}
    />
  )
}

export default CountryBudgetItems
