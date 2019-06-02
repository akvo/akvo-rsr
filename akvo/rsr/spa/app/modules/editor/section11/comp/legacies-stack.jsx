import React from 'react'
import { Button, Form } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const LegaciesStack = ({ formPush }) => {
  return (
    <ItemArray
      setName="legacies"
      sectionIndex={11}
      header="Legacy data $index: $name"
      formPush={formPush}
      panel={name => (
        <div>
          <Item label={<InputLabel optional tooltip="...">Name</InputLabel>}>
            <FinalField name={`${name}.name`} />
          </Item>
          <Item label={<InputLabel optional tooltip="...">Value</InputLabel>}>
          <FinalField name={`${name}.value`} />
          </Item>
          <Item label={<InputLabel optional tooltip="...">IATI equivalent</InputLabel>}>
          <FinalField name={`${name}.iatiEquivalent`} />
          </Item>
        </div>
      )}
      addButton={({onClick}) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed">Add another legacy data</Button>}
    />
  )
}

export default LegaciesStack
