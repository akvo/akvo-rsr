import React, { useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'antd'
import { Form as FinalForm, FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import api from '../../../../utils/api'

const { Item } = Form
let tmid

const handleUpdate = (props) => {
  useEffect(() => {
    clearTimeout(tmid)
    const { periods } = props.values
    if (periods.filter(it => (it.periodStart == null || it.periodEnd == null)).length === 0){
      tmid = setTimeout(() => api.post(`/project/${props.projectId}/default_periods/`, { periods }), 500)
    }
    props.setDefaultPeriods(periods)
  }, [props.values.periods])
  return null
}


const DefaultsModal = ({ visible, setVisible, projectId, setDefaultPeriods, defaultPeriods, periodFields, copyDefaults }) => {
  const { t } = useTranslation()
  const addToIndicator = () => {
    copyDefaults()
    setVisible(false)
  }
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        subscription={{}}
        initialValues={{ periods: defaultPeriods }}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push, pop }
          }
        }) => (
          <div>
            <FieldArray name="periods" subscription={{}}>
              {({ fields }) => (
                <div>
                  {fields.length === 0 && (
                    <div>
                      <h5>No default periods set yet.</h5>
                      <p>If you setup default periods, they will automatically be added to new indicators</p>
                    </div>
                  )}
                  {fields.map((name, index) => (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Item label={<InputLabel>{t('Period')} {index + 1} {t('from')}</InputLabel>}>
                          <Field
                            name={`${name}.periodEnd`}
                            render={({ input }) => (
                              <FinalField
                                name={`${name}.periodStart`}
                                control="datepicker"
                                disabledDate={(date) => {
                                  const endDate = moment(input.value, 'DD/MM/YYYY')
                                  if (!endDate.isValid()) return false
                                  return date.valueOf() > endDate.valueOf()
                                }}
                              />
                            )}
                          />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label={<InputLabel>{t('to')}</InputLabel>}>
                          <Field
                            name={`${name}.periodStart`}
                            render={({ input }) => (
                              <FinalField
                                name={`${name}.periodEnd`}
                                control="datepicker"
                                disabledDate={(date) => {
                                  const startDate = moment(input.value, 'DD/MM/YYYY')
                                  if (!startDate.isValid()) return false
                                  return date.valueOf() < startDate.valueOf()
                                }}
                              />
                            )}
                          />
                        </Item>
                      </Col>
                    </Row>
                  ))}
                  <div style={{ display: 'flex' }}>
                    <Button type="link" icon="plus" onClick={() => push('periods', {})}>{t('Add period')}</Button>
                    {fields.length > 0 && (
                      <Button type="link" icon="minus" onClick={() => pop('periods')}>{t('Remove period')}</Button>
                    )}
                    {(periodFields.length === 0 && fields.length > 0) && (
                      <Button type="primary" style={{ marginLeft: 'auto' }} icon="check" onClick={addToIndicator}>Add to indicator</Button>
                    )}
                  </div>
                </div>
              )}
            </FieldArray>
            <FormSpy
              subscription={{ values: true }}
              component={handleUpdate}
              projectId={projectId}
              setDefaultPeriods={setDefaultPeriods}
            />
          </div>
        )}
      />
      </Form>
    </Modal>
  )
}

export default DefaultsModal
