import React from 'react'
import { Form, Input } from 'antd'

import ItemArrayTabs from '../../../../utils/item-array-tabs'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './options/vocabulary.json'

const { Item } = Form

const Sectors = ({push, parentName}) => {
  return (
    <div>
      <ItemArrayTabs
        name={`${parentName}.sectors`}
        tabName="Sector"
        push={push}
        pane={name => (
          <div>
          <FinalField
            name={`${name}.name`}
            render={props => (
              <Item label={<InputLabel optional>Name</InputLabel>}>
                <Input {...props} />
              </Item>
            )}
          />
          <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
          <FinalField
            name={`${name}.vocabulary`}
            control="select"
            options={VOCABULARY_OPTIONS}
            withEmptyOption
          />
          </Item>
          <Item label={<InputLabel optional>URI</InputLabel>}>
          <FinalField
            name={`${name}.uri`}
          />
          </Item>
          <Item label={<InputLabel optional>Description</InputLabel>}>
          <FinalField
            name={`${name}.description`}
          />
          </Item>
          </div>
        )}
      />
    </div>
  )
}


export default Sectors
