import React from 'react'
import { Form, Button } from 'antd'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form

const Links = ({ formPush }) => (
  <div>
    <h3>Links</h3>
    <ItemArray
      formPush={formPush}
      header="Link $index: $caption"
      sectionIndex={9}
      setName="links"
      panel={name => (
        <div>
          <Item label={<InputLabel tooltip="...">URL</InputLabel>}>
            <FinalField
              name={`${name}.url`}
              control="input"
            />
          </Item>
          <Item label={<InputLabel optional tooltip="...">Caption</InputLabel>}>
            <FinalField
              name={`${name}.caption`}
              control="input"
            />
          </Item>
        </div>
      )}
      addButton={props => (
        <Button
          className="bottom-btn"
          icon="plus"
          type="dashed"
          block
          {...props}
        >
          Add another link
        </Button>
      )}
    />
  </div>
)


export default Links
