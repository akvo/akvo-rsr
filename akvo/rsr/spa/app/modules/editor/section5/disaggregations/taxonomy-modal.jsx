import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Divider } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import api from '../../../../utils/api'
import DimensionBox from './dimension-box'

const { Item } = Form
const Aux = node => node.children
let formRef

const handleSubmit = () => {
  if (formRef) {
    formRef.form.submit()
  }
}


const TaxonomyModal = ({ visible, handleCancel, handleAdd, projectId, dimensions, fetchDimensions }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  return (
    <Modal
      title={t('Add New Disaggregation')}
      visible={visible}
      onCancel={handleCancel}
      className="taxonomy-modal"
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {t('Add')}
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
            }).then(({ data }) => {
              setLoading(false)
              handleAdd(data, true)
            })
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
                      <DimensionBox dimension={dimension} handleAdd={handleAdd} fetchDimensions={fetchDimensions} />
                    ))}
                    <Divider />
                    <h4>{t('Create new')}</h4>
                  </Aux>
                )}
                <Item label={<InputLabel>{t('Disaggregation category')}</InputLabel>}>
                  <FinalField name="name" placeholder={t('Ex: Age')} />
                </Item>
                <FieldArray name="values" subscription={{}}>
                  {({ fields }) => (
                    <div>
                      {fields.map((name, index) => (
                        <Item label={<InputLabel>{t('Label')} {index + 1}</InputLabel>}>
                          <FinalField name={`${name}.value`} placeholder={index === 0 ? t('Ex: Under 18') : (index === 1 ? t('Ex: Above 18') : '')} />
                        </Item>
                      ))}
                      <div>
                        <Button type="link" icon="plus" onClick={() => push('values', {})}>{t('Add label')}</Button>
                        {fields.length > 2 && (
                          <Button type="link" icon="minus" onClick={() => pop('values')}>{t('Remove label')}</Button>
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
