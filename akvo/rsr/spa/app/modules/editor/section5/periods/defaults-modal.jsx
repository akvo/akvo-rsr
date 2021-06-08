import React, { useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Alert, Icon } from 'antd'
import { Form as FinalForm, FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import { useDefaultPeriodsState, useDefaultPeriodsCommands } from './defaults-context'

const { Item } = Form
const { confirm } = Modal
const DefaultPeriodsAutoSave = ({ values: {periods} }) => {
  const { updateItems } = useDefaultPeriodsCommands()
  useEffect(() => {
    if (periods.filter(it => (it.periodStart == null || it.periodEnd == null)).length !== 0) {
      return undefined
    }
    const timerId = setTimeout(() => updateItems(periods), 500)
    return () => clearTimeout(timerId)
  }, [periods])
  return <></>
}

export const DefaultsModal = ({ visible, setVisible, periodFields, copyDefaults }) => {
  const { t } = useTranslation()
  const defaultPeriods = useDefaultPeriodsState()
  const { applyAdded, resetAdded, applyRemoved, resetRemoved } = useDefaultPeriodsCommands()
  const addToIndicator = () => {
    copyDefaults()
    setVisible(false)
  }
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <FinalForm
        onSubmit={() => {}}
        subscription={{}}
        initialValues={{ periods: defaultPeriods.items }}
        mutators={{ ...arrayMutators }}
        render={({form: {mutators: { push }}}) => (
          <Form layout="vertical">
            <div>
              <FormSpy
                subscription={{ values: true }}
                component={DefaultPeriodsAutoSave}
              />
              <FieldArray name="periods" subscription={{}}>
                {({fields}) => (
                  <div>
                    {fields.length === 0 && (
                      <div>
                        <h5>No default periods set yet.</h5>
                        <p>If you setup default periods, they will automatically be added to new indicators</p>
                      </div>
                    )}
                    {fields.map((name, index) => (
                      <Row gutter={16}>
                        <Col span={11}>
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
                        <Col span={11}>
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
                        <Col span={2} style={{ paddingTop: '2em' }}>
                          <a onClick={() => {
                            confirm({
                              content: 'Are you sure remove this period?',
                              onOk: () => {
                                  fields.remove(index)
                                }
                              })
                            }}
                          >
                            <Icon type="delete" />
                          </a>
                        </Col>
                      </Row>
                    ))}
                    <div style={{ display: 'flex' }}>
                      <Button type="link" icon="plus" onClick={() => push('periods', {})}>{t('Add period')}</Button>
                      {(defaultPeriods.removed.length === 0 || defaultPeriods.added.length === 0 || fields?.length === 0) && (
                        <Button type="primary" style={{ marginLeft: 'auto' }} icon="check" onClick={addToIndicator}>Add to indicator</Button>
                      )}
                    </div>
                    <div>
                      {(periodFields.length > 0 && defaultPeriods.added.length > 0) && (
                        <Alert
                          type="info"
                          message={
                            <div style={{alignItems: 'center', display: 'flex'}}>
                              <div style={{flex: 1}}>Apply recently added defaults to all indicators?</div>
                              <div style={{alignItems: 'center', display: 'inline-flex'}}>
                                <Button
                                  size="small"
                                  type="default"
                                  style={{marginRight: '8px'}}
                                  onClick={() => {
                                    applyAdded()
                                    setVisible(false)
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  size="small"
                                  type="ghost"
                                  onClick={resetAdded}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          }
                        />
                      )}
                      {(periodFields.length > 0 && defaultPeriods.removed.length > 0) && (
                        <Alert
                          type="warning"
                          message={
                            <div style={{alignItems: 'center', display: 'flex'}}>
                              <div style={{flex: 1}}>Apply recently removed defaults to all indicators if applicable?</div>
                              <div style={{alignItems: 'center', display: 'inline-flex'}}>
                                <Button
                                  size="small"
                                  type="default"
                                  style={{marginRight: '8px'}}
                                  onClick={() => {
                                    applyRemoved()
                                    setVisible(false)
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  size="small"
                                  type="ghost"
                                  onClick={resetRemoved}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>
          </Form>
        )}
      />
    </Modal>
  )
}

export default DefaultsModal
