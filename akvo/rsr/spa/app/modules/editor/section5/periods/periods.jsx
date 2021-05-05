/* global window */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm, Tooltip, notification, Icon, Select } from 'antd'
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
import DefaultsModal from './defaults-modal'
import PeriodLabelsModal from './period-labels-modal'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Periods = connect(null, { addSetItem, removeSetItem })(({ fieldName, program, formPush, addSetItem, removeSetItem, indicatorId, resultId, projectId, primaryOrganisation, resultIndex, indicatorIndex, selectedPeriodIndex, validations, defaultPeriods, setDefaultPeriods, periodLabels, setPeriodLabels, imported, resultImported, targetsAt }) => { // eslint-disable-line
  const [modalVisible, setModalVisible] = useState(false)
  const [labelsModalVisible, setLabelsModalVisible] = useState(false)
  const canChangeLabels = Number(program?.id) === Number(projectId)
  const { t } = useTranslation()
  const add = () => {
    const newItem = { indicator: indicatorId }
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
  const copyDefaults = () => {
    defaultPeriods.forEach((period, index) => {
      formPush(`${fieldName}.periods`, { ...period, indicator: indicatorId })
      addSetItem(5, `results[${resultIndex}].indicators[${indicatorIndex}].periods`, { ...period, indicator: indicatorId })
    })
  }
  return (
    <Aux>
    <FieldArray name={`${fieldName}.periods`} subscription={{}}>
      {({ fields }) => (
        <Aux>
        <div className="ant-col ant-form-item-label periods-label">
          <InputLabel>{t('Periods')}</InputLabel>
          {!resultImported &&
          <div className="defaults">
            {(!defaultPeriods || (Array.isArray(defaultPeriods) && defaultPeriods.length === 0)) && ([
              <Button type="link" onClick={() => setModalVisible(true)}>{t('Setup defaults')}</Button>,
              <Tooltip title="If you setup default periods, they will automatically be added to new indicators"><Icon type="info-circle" /></Tooltip>
            ])
            }
            {!(!defaultPeriods || (Array.isArray(defaultPeriods) && defaultPeriods.length === 0)) && ([
              <Button type="link" onClick={() => setModalVisible(true)}>{t('View defaults')}</Button>,
              fields.length === 0 ? [<span> | </span>, <Button type="link" onClick={copyDefaults}>{t('Copy defaults')}</Button>] : null
            ])}
           {canChangeLabels && <Button type="link" onClick={() => setLabelsModalVisible(true)}>{t('View period labels')}</Button>}
          </div>
          }
        </div>
        {fields.length > 0 &&
        <Accordion
          className="periods-list"
          finalFormFields={fields}
          autoScrollToActive
          activeKey={selectedPeriodIndex === -1 ? '' : selectedPeriodIndex}
          setName={`${fieldName}.periods`}
          destroyInactivePanel
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
                        {!imported &&
                        <Popconfirm
                          title={t('Are you sure to delete this period?')}
                          onConfirm={() => remove(index, fields)}
                          okText={t('Yes')}
                          cancelText={t('No')}
                        >
                          <Button size="small" icon="delete" className="delete-panel" />
                        </Popconfirm>
                        }
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
                          disabled={primaryOrganisation === 3394 || imported}
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
                          disabled={primaryOrganisation === 3394 || imported}
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
                {(targetsAt !== 'indicator') && [
                  <Field name={`results[${resultIndex}].indicators[${indicatorIndex}].type`} render={({input: {value: indicatorType}}) => {
                    if(indicatorType === 1) {
                      return <FinalField
                        name={`${name}.targetValue`}
                        control="input"
                        withLabel
                        optional={!isDGIS}
                        dict={{ label: t('Target value') }}
                      />
                    }
                    return null
                  }} />,
                  <Field name={`${name}.id`} render={({ input }) => <Targets fieldName={`${fieldName}.periods[${index}]`} periodId={input.value} periodIndex={index} {...{ indicatorId, indicatorIndex, resultId, resultIndex, formPush }} />} />
                ]
                }
                <Item label={<InputLabel optional>{t('Target Comment')}</InputLabel>}>
                  <FinalField name={`${name}.targetComment`} render={({ input }) => <RTE {...input} />} />
                </Item>
                <Item label={<InputLabel optional>{t('Period Label')}</InputLabel>}>
                  <FinalField name={`${name}.label`} render={({ input }) => (
                    <Select
                      placeholder={t('Please select...')}
                      {...input}
                      >
                      {periodLabels?.map(option => <Select.Option value={option.id}>{option.label}</Select.Option>)}
                    </Select>
                  )} />
                </Item>
              </Panel>
            )
          }}
        />
        }
          <Button icon="plus" block type="dashed" disabled={!indicatorId || imported} onClick={add}>{t('Add period')}</Button>
          <DefaultsModal visible={modalVisible} setVisible={setModalVisible} projectId={projectId} setDefaultPeriods={setDefaultPeriods} defaultPeriods={defaultPeriods} periodFields={fields} copyDefaults={copyDefaults} />
          {canChangeLabels && <PeriodLabelsModal visible={labelsModalVisible} setVisible={setLabelsModalVisible} projectId={projectId} periodLabels={periodLabels} setPeriodLabels={setPeriodLabels} />}
        </Aux>
      )}
    </FieldArray>
    </Aux>
  )
})

export default Periods
