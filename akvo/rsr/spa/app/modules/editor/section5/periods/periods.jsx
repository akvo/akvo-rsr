/* global window, navigator */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm, Tooltip, notification, Icon } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import * as clipboard from 'clipboard-polyfill'

import RTE from '../../../../utils/rte'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import Accordion from '../../../../utils/accordion'
import AutoSave from '../../../../utils/auto-save'
import { addSetItem, removeSetItem } from '../../actions'
import Targets from './targets'
import { getValidations } from '../../../../utils/validation-utils'
import RequiredHint from '../../../../utils/required-hint'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Periods = connect(null, { addSetItem, removeSetItem })(({ fieldName, formPush, addSetItem, removeSetItem, indicatorId, resultId, primaryOrganisation, resultIndex, indicatorIndex, selectedPeriodIndex, validations }) => { // eslint-disable-line
  const { t } = useTranslation()
  const add = () => {
    const newItem = { indicator: indicatorId, disaggregationTargets: [] }
    formPush(`${fieldName}.periods`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.periods`, index)
  }
  const getLink = (periodId) => {
    window.location.hash = `#/result/${resultId}/indicator/${indicatorId}/period/${periodId}`
    clipboard.writeText(window.location.href)
    notification.open({
      message: t('Link copied!'),
      icon: <Icon type="link" style={{ color: '#108ee9' }} />,
    })
  }
  const { isDGIS } = getValidations(validations) // going around complicated yup check for deep structure
  return (
    <Aux>
    <FieldArray name={`${fieldName}.periods`} subscription={{}}>
      {({ fields }) => (
        <Aux>
        <div className="ant-col ant-form-item-label">
          <InputLabel>{t('Periods')}</InputLabel>
        </div>
        {fields.length > 0 &&
        <Accordion
          className="periods-list"
          finalFormFields={fields}
          autoScrollToActive
          activeKey={selectedPeriodIndex}
          setName={`${fieldName}.periods`}
          renderPanel={(name, index) => {
            return (
              <Panel
                header={(
                  <span>
                    {t('Period')} {index + 1}:&nbsp;
                    <Field
                      name={`${name}.periodStart`}
                      render={({ input }) => input.value}
                    />
                    &nbsp;-&nbsp;
                    <Field
                      name={`${name}.periodEnd`}
                      render={({ input }) => input.value}
                    />
                    <RequiredHint section="section5" name={name} />
                  </span>
                )}
                key={index}
                extra={(
                  /* eslint-disable-next-line */
                  <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                    <div className="delete-btn-holder">
                      <Button.Group>
                        <Field name={`${name}.id`} render={({ input }) =>
                        <Tooltip title={t('Get a link to this period')}>
                          <Button size="small" icon="link" onClick={() => getLink(input.value)} />
                        </Tooltip>
                        } />
                        <Popconfirm
                          title={t('Are you sure to delete this period?')}
                          onConfirm={() => remove(index, fields)}
                          okText={t('Yes')}
                          cancelText={t('No')}
                        >
                          <Button size="small" icon="delete" className="delete-panel" />
                        </Popconfirm>
                      </Button.Group>
                    </div>
                  </div>
                )}
              >
                <AutoSave sectionIndex={5} setName={`${fieldName}.periods`} itemIndex={index} />
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name={`${name}.periodEnd`}
                      render={({ input }) => (
                        <FinalField
                          name={`${name}.periodStart`}
                          control="datepicker"
                          disabled={primaryOrganisation === 3394}
                          disabledDate={(date) => {
                            const endDate = moment(input.value, 'DD/MM/YYYY')
                            if (!endDate.isValid()) return false
                            return date.valueOf() > endDate.valueOf()
                          }}
                          withLabel
                          dict={{ label: t('Start') }}
                        />
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name={`${name}.periodStart`}
                      render={({ input }) => (
                        <FinalField
                          name={`${name}.periodEnd`}
                          control="datepicker"
                          disabled={primaryOrganisation === 3394}
                          disabledDate={(date) => {
                            const startDate = moment(input.value, 'DD/MM/YYYY')
                            if (!startDate.isValid()) return false
                            return date.valueOf() < startDate.valueOf()
                          }}
                          withLabel
                          dict={{ label: t('End')}}
                        />
                      )}
                    />
                  </Col>
                </Row>
                <FinalField
                  name={`${name}.targetValue`}
                  control="input"
                  withLabel
                  optional={!isDGIS}
                  dict={{ label: t('Target value') }}
                />
                <Field name={`${name}.id`} render={({ input }) => <Targets formPush={formPush} fieldName={`${fieldName}.periods[${index}]`} periodId={input.value} periodIndex={index} indicatorId={indicatorId} indicatorIndex={indicatorIndex} resultId={resultId} resultIndex={resultIndex} />} />
                <Item label={<InputLabel optional>{t('Comment')}</InputLabel>}>
                  <FinalField name={`${name}.targetComment`} render={({ input }) => <RTE {...input} />} />
                </Item>
              </Panel>
            )
          }}
        />
        }
        <Button icon="plus" block type="dashed" disabled={!indicatorId} onClick={add}>{t('Add period')}</Button>
        </Aux>
      )}
    </FieldArray>
    </Aux>
  )
})

export default Periods
