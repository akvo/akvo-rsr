import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import ItemArray from '../../../utils/item-array'
import InputLabel from '../../../utils/input-label'
import { isFieldOptional, isFieldValid, getValidationSets } from '../../../utils/validation-utils'
import validationDefs from './contacts/validations'
import SectionContext from '../section-context'

import './styles.scss'

const { Item } = Form

const CONTACT_TYPE_OPTIONS = [
  { value: '1', label: 'General Inquiries'},
  { value: '2', label: 'Project Management'},
  { value: '3', label: 'Financial Management'},
  { value: '4', label: 'Communications'}
]

const Contacts = ({ validations, fields }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const isValid = isFieldValid(validationSets)
  return (
    <div className="contacts view">
      <SectionContext.Provider value="section2">
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
            header={`${t('Contact')} $index: $personName`}
            formPush={push}
            panel={name => (
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <FinalField
                      name={`${name}.type`}
                      control="select"
                      options={CONTACT_TYPE_OPTIONS}
                      withEmptyOption
                      withLabel
                      optional
                    />
                  </Col>
                  <Col span={12}>
                    <FinalField
                      name={`${name}.jobTitle`}
                      withLabel
                      optional
                      control="input"
                    />
                  </Col>
                </Row>
                <FinalField
                  name={`${name}.personName`}
                  withLabel
                  optional
                  control="input"
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <FinalField
                      name={`${name}.organisation`}
                      withLabel
                      optional
                      control="input"
                    />
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>{t('section2.department.label')}</InputLabel>}>
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
                        {t('section2.email.label')}
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
                      label={<InputLabel tooltip={t('section2.address.tooltip')} optional={isOptional('mailingAddress')}>{t('section2.address.label')}</InputLabel>}
                    >
                      <Input {...input} />
                    </Item>
                  )}
                />
                <FinalField
                  name={`${name}.telephone`}
                  control="input"
                  withLabel
                  optional
                />
                <FinalField
                  name={`${name}.website`}
                  control="input"
                  withLabel
                  optional
                />
              </div>
            )}
            addButton={({ onClick }) => <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add another contact')}</Button>}
          />
        )}
      />
      </Form>
      </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section2: { fields }, validations}}) => ({ fields, validations}),
)(React.memo(Contacts, (prevProps, nextProps) => {
  return isEqual(prevProps.fields, nextProps.fields)
}))
