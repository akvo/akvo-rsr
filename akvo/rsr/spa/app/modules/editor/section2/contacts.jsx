import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import ItemArray from '../../../utils/item-array'
import InputLabel from '../../../utils/input-label'
import { isFieldOptional, isFieldValid, getValidationSets } from '../../../utils/validation-utils'
import validationDefs from './contacts/validations'
import SectionContext from '../section-context'

import './styles.scss'

const { Item } = Form

const Contacts = ({ validations, fields, showRequired, errors }) => {
  const { t } = useTranslation()
  const CONTACT_TYPE_OPTIONS = [
    { value: '1', label: t('General Inquiries') },
    { value: '2', label: t('Project Management') },
    { value: '3', label: t('Financial Management') },
    { value: '4', label: t('Communications') }
  ]
  const validationSets = getValidationSets(validations, validationDefs)
  const isOptional = isFieldOptional(validationSets)
  const isValid = isFieldValid(validationSets)
  console.log(showRequired, errors)
  return (
    <div className="contacts view">
      <div className="min-required-wrapper">
        <h3>{t('Project contacts')}</h3>
        {showRequired && errors.findIndex(it => it.type === 'min' && it.path === 'contacts') !== -1 && (
          <span className="min-required">{t('Minimum one required')}</span>
        )}
      </div>
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
                    <Item label={<InputLabel optional>{t('section2::department::label')}</InputLabel>}>
                    <FinalField
                      name={`${name}.department`}
                    />
                    </Item>
                  </Col>
                </Row>
                <FinalField
                  name={`${name}.email`}
                  withLabel
                  withoutTooltip
                  dict={{
                    label: t('section2::email::label')
                  }}
                  optional={isOptional}
                  control="input"
                />
                <FinalField
                  name={`${name}.mailingAddress`}
                  withLabel
                  dict={{
                    label: t('section2::address::label'),
                    tooltip: t('section2::address::tooltip')
                  }}
                  optional={isOptional}
                  control="input"
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
  ({ editorRdr: { showRequired, section2: { fields, errors }, validations } }) => ({ fields, validations, showRequired, errors}),
)(React.memo(Contacts, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1 || prevProps.showRequired !== nextProps.showRequired
  return !shouldUpdate
}))
