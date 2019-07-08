import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Divider } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import api from '../../../../utils/api';

const { Item } = Form
const Aux = node => node.children
let formRef

const handleSubmit = () => {
  if (formRef) {
    formRef.form.submit()
  }
}

const TaxonomyModal = ({ visible, handleCancel, handleAdd, projectId, dimensions }) => {
  const [loading, setLoading] = useState(false)
  return (
    <Modal
      title="Add New Disaggregation"
      visible={visible}
      onCancel={handleCancel}
      className="taxonomy-modal"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Add
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <FinalForm
          ref={(ref) => { formRef = ref }}
          onSubmit={(values) => {
            setLoading(true)
            api.post('/dimension_name/', {
              ...values,
              project: projectId
            })
            // handleAdd(values, true)
          }}
          subscription={{}}
          initialValues={{ name: '', values: [{}, {}] }}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push, pop }
            }
          }) => (
              <div>
                {dimensions && dimensions.length > 0 && (
                  <Aux>
                    <h4>Choose existing</h4>
                    {dimensions.filter(it => it.id).map(dimension => (
                      <div className="dimension-box">
                        <div>
                        <h5>{dimension.name}</h5>
                        <ul>
                          {dimension.values.map(value => <li>{value.value}</li>)}
                        </ul>
                        </div>
                        <Button type="primary" onClick={() => handleAdd(dimension, false)}>Add</Button>
                      </div>
                    ))}
                    <Divider />
                    <h4>Create new</h4>
                  </Aux>
                )}
                <Item label={<InputLabel>Disaggregation name</InputLabel>}>
                  <FinalField name="name" placeholder="Ex: Age" />
                </Item>
                <FieldArray name="values" subscription={{}}>
                  {({ fields }) => (
                    <div>
                      {fields.map((name, index) => (
                        <Item label={<InputLabel>Label {index + 1}</InputLabel>}>
                          <FinalField name={`${name}.value`} placeholder={index === 0 ? 'Ex: Under 18' : (index === 1 ? 'Ex: Above 18' : '')} />
                        </Item>
                      ))}
                      <div>
                        <Button type="link" icon="plus" onClick={() => push('values', {})}>Add label</Button>
                        {fields.length > 2 && (
                          <Button type="link" icon="minus" onClick={() => pop('values')}>Remove label</Button>
                        )}
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
            )}
        />
      </Form>
    </Modal>
  )
}

export default connect(({ editorRdr: { projectId } }) => ({ projectId }))(TaxonomyModal)
