import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form
const save = props => console.log(props)

class Links extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    return (
      <div className="links view">
        <FinalForm
          onSubmit={save}
          subscription={{ pristine: true }}
          initialValues={this.props.fields}
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
                  formPush={push}
                  values={values}
                  name="links"
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
              </Form>
            )
          }}
        />
      </div>
    )
  }
}


export default connect(
  ({ editorRdr: { section9: {fields} }}) => ({ fields })
)(Links)
