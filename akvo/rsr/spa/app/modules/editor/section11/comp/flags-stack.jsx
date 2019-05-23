import React from 'react'
import { Button, Radio, Form } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const FLAG_CODES = [
  { value: 1, label: 'Free standing technical cooperation'},
  { value: 2, label: 'Programme-based approach'},
  { value: 3, label: 'Investment project'},
  { value: 4, label: 'Associated financing'}
]

const FlagsStack = ({ formPush }) => {
  return (
    <ItemArray
      setName="flags"
      sectionIndex={11}
      header={(index, code) => {
        return <span>CRS++ other flag: {code && FLAG_CODES.find(it => it.value === code).label}</span>
      }}
      headerField="code"
      formPush={formPush}
      panel={name => (
        <div className="channel-code-inputs">
          <Item label={<InputLabel tooltip="...">Code</InputLabel>}>
            <FinalField
              name={`${name}.code`}
              control="select"
              options={FLAG_CODES}
            />
          </Item>
          <Item label={<InputLabel tooltip="...">Significance</InputLabel>}>
            <FinalField
              name={`${name}.significance`}
              render={({input}) => (
                <Radio.Group {...input}>
                  <Radio.Button value={1}>Yes</Radio.Button>
                  <Radio.Button value={0}>No</Radio.Button>
                </Radio.Group>
              )}
            />
          </Item>
        </div>
      )}
      addButton={({ onClick }) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed">Add CRS++ other flag</Button>}
    />
  )
}

export default FlagsStack
