import React from 'react'
import { Form, Button } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form
const save = props => console.log(props)

const Links = () => (
  <div className="links view">
    <FinalForm
      onSubmit={save}
      subscription={{ pristine: true }}
      mutators={{ ...arrayMutators }}
      render={({
        form: {
          mutators: { push }
        },
        values
      }) => {
        return (
          <Form layout="vertical">
          <h3>Links</h3>
          <ItemArray
            values={values}
            name="links"
            header="Link $index: $caption"
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
          />
          <Button
            className="bottom-btn"
            icon="plus"
            type="dashed"
            block
            onClick={() => push('links', undefined)}
          >
            Add another link
          </Button>
          </Form>
        )
      }}
    />

  </div>
)


export default Links
