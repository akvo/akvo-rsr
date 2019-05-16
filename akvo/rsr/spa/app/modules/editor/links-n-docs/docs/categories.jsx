import React from 'react'
import { Form } from 'antd'

import InputLabel from '../../../../utils/input-label'
import ItemArrayTabs from '../../../../utils/item-array-tabs'
import FinalField from '../../../../utils/final-field'
import CATEGORY_OPTIONS from './categories.json'

const { Item } = Form

const Categories = ({ push, parentName }) => (
  <div>
    <ItemArrayTabs
      name={`${parentName}.categories`}
      tabName="Category"
      push={push}
      pane={name => (
        <Item label={<InputLabel optional>Category</InputLabel>}>
          <FinalField
            name={`${name}.category`}
            control="select"
            options={CATEGORY_OPTIONS}
          />
        </Item>
      )}
    />
  </div>
)

export default Categories
