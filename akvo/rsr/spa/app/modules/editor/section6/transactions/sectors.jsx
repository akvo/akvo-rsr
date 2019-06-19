import React from 'react'
import { Form, Input } from 'antd'

import ItemArrayTabs from '../../../../utils/item-array-tabs'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './options/vocabulary.json'

const { Item } = Form

const Sectors = ({push, parentName, transactionId}) => {
  return (
    <div>
      <ItemArrayTabs
        name={`${parentName}.sectors`}
        tabName="Sector"
        sectionIndex={6}
        push={push}
        newItem={{ transaction: transactionId }}
        pane={name => (
          <div>
          <FinalField
            name={`${name}.transactionUnicode`}
            render={({ input }) => (
              <Item label={<InputLabel optional>Name</InputLabel>}>
                <Input {...input} />
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
            name={`${name}.vocabularyUri`}
          />
          </Item>
          <Item label={<InputLabel optional>Description</InputLabel>}>
          <FinalField
            name={`${name}.text`}
          />
          </Item>
          </div>
        )}
      />
    </div>
  )
}


export default Sectors
