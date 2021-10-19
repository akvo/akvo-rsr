/* global window */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm, Tooltip, notification, Icon, Select } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import * as clipboard from 'clipboard-polyfill'
import axios from 'axios'
import RTE from '../../../../utils/rte'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import Accordion from '../../../../utils/accordion'
import AutoSave from '../../../../utils/auto-save'
import Targets from './targets'
import { getValidations } from '../../../../utils/validation-utils'
import RequiredHint from '../../../../utils/required-hint'
import { useDefaultPeriodsState } from './defaults-context'
import DefaultsModal from './defaults-modal'
import PeriodLabelsModal from './period-labels-modal'
import api, { config } from '../../../../utils/api'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Periods = ({
  fieldName,
  program,
  formPush,
  indicatorId,
  resultId,
  projectId,
  primaryOrganisation,
  resultIndex,
  indicatorIndex,
  selectedPeriodIndex,
  validations,
  periodLabels,
  setPeriodLabels,
  imported,
  resultImported,
  targetsAt,
  scoreOptions,
  dispatch,
  results
  }) => { // eslint-disable-line
  const [modalVisible, setModalVisible] = useState(false)
  const [labelsModalVisible, setLabelsModalVisible] = useState(false)
  const canChangeLabels = Number(program?.id) === Number(projectId)
  const { t } = useTranslation()
  const { items: defaultPeriods, added: addedPeriods, removed: removedPeriods, status: statusPeriods } = useDefaultPeriodsState()
  const [lastAdded, setLastAdded] = useState(null)
  const [lastRemoved, setLastRemoved] = useState(null)
  const add = () => {
    const newItem = { indicator: indicatorId }
    formPush(`${fieldName}.periods`, newItem)
  }
  const remove = (index, fields, periodId) => {
    fields.remove(index)
    api.delete(`/indicator_period/${periodId}`, true)
      .catch(() => {
        notification.open({
          message: t('Error'),
          description: t('Failed to delete period'),
          duration: 0,
          icon: <Icon type="exclamation" style={{ color: '#f5222d' }} />
        })
      })
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
    const axiosItems = []
    defaultPeriods.forEach(period => {
      formPush(`${fieldName}.periods`, { ...period, indicator: indicatorId })
      axiosItems.push(
        axios.post(
          `${config.baseURL}/indicator_period/`,
          {
            ...period,
            period_start: moment(period.periodStart, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            period_end: moment(period.periodEnd, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            indicator: indicatorId
          },
          {
            headers: {
              ...config.headers,
              'Content-Type': 'application/json'
            }
          }
        )
      )
    })
    if (axiosItems.length > 0) {
      axios.all([...axiosItems])
        .catch(() => {
          notification.open({
            message: t('Error'),
            description: t('Failed to mass update periods'),
            duration: 0,
            icon: <Icon type="exclamation" style={{ color: '#f5222d' }} />
          })
        })
    }
  }

  if((addedPeriods?.length > 0 && !lastAdded) || (lastAdded && addedPeriods.length !== lastAdded.length)){
    setLastAdded(addedPeriods)
  }

  if(statusPeriods === 'added' && lastAdded?.length > 0){
    dispatch({
      type: 'PE_FETCH_SECTION',
      sectionIndex: 5,
      fields: {
        results: [
          ...results?.map(result => {
            return {
              ...result,
              indicators: [
                ...result?.indicators?.map(indicator => ({
                  ...indicator,
                  periods: [
                    ...indicator?.periods,
                    ...defaultPeriods?.filter(period => !(indicator?.periods?.find(item => item?.periodStart === period?.periodStart && item?.periodEnd === period?.periodEnd)))
                  ].sort((a, b) => moment(a?.periodStart, 'DD/MM/YYYY') - moment(b?.periodStart, 'DD/MM/YYYY'))
                }))
              ]
            }
          })
        ]
      }
    })
    setLastAdded(null)
  }

  if ((removedPeriods?.length > 0 && !lastRemoved) || (lastRemoved && removedPeriods.length !== lastRemoved.length)) {
    setLastRemoved(removedPeriods)
  }

  if(statusPeriods === 'removed' && lastRemoved?.length > 0){
    dispatch({
      type: 'PE_FETCH_SECTION',
      sectionIndex: 5,
      fields: {
        results: [
          ...results?.map(result => {
            return {
              ...result,
              indicators: [
                ...result?.indicators?.map(indicator => ({
                  ...indicator,
                  periods: indicator?.periods?.filter(period => !(lastRemoved?.find(removed => removed?.periodStart === period?.periodStart && removed.periodEnd === period?.periodEnd)))
                }))
              ]
            }
          })
        ]
      }
    })
    setLastRemoved(null)
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
                          (
                            <Tooltip title={t('Get a link to this period')}>
                              <Button size="small" icon="link" onClick={() => getLink(input.value)} />
                            </Tooltip>
                          )}
                        />
                        {!imported &&
                          <Field name={`${name}.id`} render={({ input }) =>
                            (
                              <Popconfirm
                                title={t('Are you sure to delete this period?')}
                                onConfirm={() => remove(index, fields, input.value)}
                                okText={t('Yes')}
                                cancelText={t('No')}
                              >
                                <Button size="small" icon="delete" className="delete-panel" />
                              </Popconfirm>
                            )}
                          />
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
                  <Field name={`results[${resultIndex}].indicators[${indicatorIndex}].type`} render={({input: {value: indicatorType}}) => {
                    if(indicatorType === 2) {
                      return (
                        <Item label={<InputLabel>Target score</InputLabel>}>
                          <FinalField
                            name={`${name}.targetScore`}
                            render={({ input }) => (
                              <Select allowClear {...input}>
                                {scoreOptions.map(option => <Select.Option value={option.value}>{option.label}</Select.Option>)}
                              </Select>
                            )}
                          />
                        </Item>
                      )
                    }
                    return null
                  }} />,
                  <Field name={`${name}.id`} render={({ input }) => <Targets fieldName={`${fieldName}.periods[${index}]`} periodId={input.value} periodIndex={index} {...{ indicatorId, indicatorIndex, resultId, resultIndex, targetsAt }} />} />
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
          <DefaultsModal visible={modalVisible} setVisible={setModalVisible} />
          {canChangeLabels && <PeriodLabelsModal visible={labelsModalVisible} setVisible={setLabelsModalVisible} projectId={projectId} periodLabels={periodLabels} setPeriodLabels={setPeriodLabels} />}
        </Aux>
      )}
    </FieldArray>
    </Aux>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapStateToProps = state => {
  const { editorRdr } = state
  const { section5 } = editorRdr || {}
  const { fields } = section5 || {}
  return {
    results: fields?.results
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Periods)
