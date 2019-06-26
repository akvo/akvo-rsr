import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'

import FinalField from '../../../utils/final-field'
import ItemArray from '../../../utils/item-array'
import InputLabel from '../../../utils/input-label'
import { isFieldOptional, isFieldValid, getValidationSets } from '../../../utils/validation-utils'
import validationDefs from './contacts/validations'

import './styles.scss'

const { Item } = Form

const CONTACT_TYPE_OPTIONS = [
  { value: '1', label: 'General Inquiries'},
  { value: '2', label: 'Project Management'},
  { value: '3', label: 'Financial Management'},
  { value: '4', label: 'Communications'}
]

const Contacts = ({ validations, fields }) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const isValid = isFieldValid(validationSets)
  return (
    <div className="contacts view">
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
          <ItemArray
            setName="contacts"
            sectionIndex={2}
            header="Contact $index: $personName"
            formPush={push}
            panel={name => (
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                  <Item label={<InputLabel optional tooltip="What types of enquiries this contact person is best-placed to handle.">Type</InputLabel>}>
                    <FinalField
                      name={`${name}.type`}
                      control="select"
                      options={CONTACT_TYPE_OPTIONS}
                      withEmptyOption
                    />
                  </Item>
                  </Col>
                  <Col span={12}>
                  <Item label={<InputLabel optional>Job title</InputLabel>}>
                    <FinalField
                      name={`${name}.jobTitle`}
                    />
                  </Item>
                  </Col>
                </Row>
                <Item label={<InputLabel optional tooltip="Please enter the name of the contact person for this project.">Name</InputLabel>}>
                  <FinalField
                    name={`${name}.personName`}
                  />
                </Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional tooltip="The organisation that the contact person works for.">Organisation</InputLabel>}>
                    <FinalField
                      name={`${name}.organisation`}
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Department</InputLabel>}>
                    <FinalField
                      name={`${name}.department`}
                    />
                    </Item>
                  </Col>
                </Row>
                <FinalField
                  name={`${name}.email`}
                  render={({ input }) => (
                    <Item
                      hasFeedback
                      validateStatus={isValid('email', input.value) && input.value ? 'success' : ''}
                      label={(
                      <InputLabel optional={isOptional('email')}>
                        Email
                      </InputLabel>
                      )}
                    >
                      <Input {...input} />
                    </Item>
                  )}
                />
                <FinalField
                  name={`${name}.mailingAddress`}
                  render={({ input }) => (
                    <Item
                      hasFeedback
                      validateStatus={isValid('mailingAddress', input.value) && input.value ? 'success' : ''}
                      label={<InputLabel optional={isOptional('mailingAddress')}>Address</InputLabel>}
                    >
                      <Input {...input} />
                    </Item>
                  )}
                />
                <Item label={<InputLabel optional>Phone</InputLabel>}>
                <FinalField
                  name={`${name}.telephone`}
                />
                </Item>
                <Item label={<InputLabel optional>Website</InputLabel>}>
                <FinalField
                  name={`${name}.website`}
                />
                </Item>
              </div>
            )}
            addButton={({onClick}) => <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add a contact</Button>}
          />
        )}
      />
      </Form>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section2: { fields }, validations}}) => ({ fields, validations}),
)(React.memo(Contacts, (prevProps, nextProps) => {
  return isEqual(prevProps.fields, nextProps.fields)
}))
