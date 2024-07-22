/* global window */
import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { Form, Button, Dropdown, Menu, Collapse, Divider, Col, Row, Radio, Popconfirm, Select, Tooltip, notification, Icon, Modal, Alert } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'
import * as clipboard from 'clipboard-polyfill'
import Delay from 'react-delay'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import InputLabel from '../../../utils/input-label'
import Accordion from '../../../utils/accordion'
import Condition from '../../../utils/condition'
import AutoSave from '../../../utils/auto-save'
import { addSetItem, removeSetItem, moveSetItem } from '../actions'
import Periods from './periods/periods'
import Disaggregations from './disaggregations/disaggregations'
import IndicatorNavMenu, { fieldNameToId } from './indicator-nav-menu'
import api from '../../../utils/api'
import { isFieldOptional, getValidationSets, getValidations } from '../../../utils/validation-utils'
import validationDefs from './results/validations'
import RequiredHint from '../../../utils/required-hint'
import Scores from './scores'
import { IndicatorCustomFields } from '../custom-fields'
import Targets from './periods/targets'
import References from './references/references'
import SectionContext from '../section-context'
import { useDefaultPeriodsState } from './periods/defaults-context'
import { CumulativeToggle } from './cumulative'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children


const indicatorTypes = [
  { value: 1, label: 'quantitative' },
  { value: 2, label: 'qualitative' }
]

const Indicators = connect(null, { addSetItem, removeSetItem, moveSetItem })(
  ({ fieldName, formPush, addSetItem: _addSetItem, removeSetItem: _removeSetItem, moveSetItem: _moveSetItem, resultId, resultIndex, primaryOrganisation, projectId, program, allowIndicatorLabels, indicatorLabelOptions, selectedIndicatorIndex, selectedPeriodIndex, validations, periodLabels, setPeriodLabels, result, resultImported, parentRF, fetchFields, customFields, targetsAt, disableReordering }) => {
    const { t } = useTranslation()
    const accordionCompRef = useRef()
    const [showImport, setShowImport] = useState(false)
    const { items: defaultPeriods } = useDefaultPeriodsState()
    const add = (key) => {
      if (key === 3) {
        setShowImport(true)
        return
      }
      const newItem = { type: key, periods: [], measure: '1', ascending: true, exportToIati: true, customValues: [] }
      if (key === 1) newItem.dimensionNames = []
      if (resultId) newItem.result = resultId
      // TODO: move this logic to backend?
      if (defaultPeriods) newItem.periods = defaultPeriods
      formPush(`${fieldName}.indicators`, newItem)
      _addSetItem(5, `${fieldName}.indicators`, newItem)
    }
    const remove = (index, fields) => {
      fields.remove(index)
      _removeSetItem(5, `${fieldName}.indicators`, index)
    }
    const moveIndicator = (from, to, fields, itemId) => {
      const doMove = () => {
        fields.move(from, to)
        api.post(`/project/${projectId}/reorder_items/`, `item_type=indicator&item_id=${itemId}&item_direction=${from > to ? 'up' : 'down'}`)
        _moveSetItem(5, `${fieldName}.indicators`, from, to)
      }
      if (accordionCompRef.current.state.activeKey.length === 0) {
        doMove()
      } else {
        accordionCompRef.current.handleChange([])
        setTimeout(doMove, 500)
      }
    }
    const getLink = (indicatorId) => {
      window.location.hash = `#/result/${resultId}/indicator/${indicatorId}`
      clipboard.writeText(window.location.href)
      notification.open({
        message: t('Link copied!'),
        icon: <Icon type="link" style={{ color: '#108ee9' }} />,
      })
    }
    const validationSets = getValidationSets(validations, validationDefs)
    const isOptional = isFieldOptional(validationSets)
    const { isDGIS } = getValidations(validations) // going around complicated yup check for deep structure
    const isImported = (index) => {
      return result && result.indicators[index] && result.indicators[index].parentIndicator != null
    }
    let deletedIndicators = []
    if (parentRF && result) {
      const parentResult = parentRF.find(it => it.id === result.parentResult)
      if (parentResult) {
        deletedIndicators = parentResult.indicators.filter(indicator => result.indicators.findIndex(it => it.parentIndicator === indicator.id) === -1)
      }
    }
    const importIndicator = (indicator) => {
      api.post(`/project/${projectId}/import_indicator/${indicator.id}/`)
        .then(() => {
          api.get(`/results_framework_lite/?project=${projectId}`)
            .then(d => {
              fetchFields(5, d.data)
              setShowImport(false)
            })
        })
    }
    const showIndexNumbers = !(program && program.id === 9062)
    const getScoreOptions = (index) => {
      return result && result.indicators[index] && result.indicators[index].scores && result.indicators[index].scores.map((label, idx) => ({ value: idx + 1, label })
      )
    }
    return (
      <FieldArray name={`${fieldName}.indicators`} subscription={{}}>
        {({ fields }) => (
          <Aux>
            <Accordion
              multiple
              className="indicators-list"
              finalFormFields={fields}
              setName={`${fieldName}.indicators`}
              activeKey={selectedIndicatorIndex}
              destroyInactivePanel
              ref={ref => { accordionCompRef.current = ref }}
              renderPanel={(name, index, activeKey) => {
                return (
                  <Panel
                    key={index}
                    header={(
                      <span>
                        <Field
                          name={`${name}.type`}
                          render={({ input }) => {
                            const type = indicatorTypes.find(it => it.value === input.value)
                            return (
                              <span className="collapse-header-content">
                                <span className="capitalized">{type && type.label}</span>
                                &nbsp;{t('Indicator')} {showIndexNumbers && (index + 1)}
                                {activeKey.indexOf(String(index)) === -1 && (
                                  <Field
                                    name={`${name}.title`}
                                    render={(titleProp) => <span>&nbsp;- {titleProp.input.value}</span>}
                                  />
                                )}
                              </span>
                            )
                          }}
                        />
                        <RequiredHint section="section5" name={name} />
                      </span>)}
                    extra={(
                      /* eslint-disable-next-line */
                      <div onClick={(e) => { activeKey.indexOf(String(index)) !== -1 && e.stopPropagation() }} style={{ display: 'flex' }}>
                        <IndicatorNavMenu fieldName={name} imported={isImported(index)} isActive={activeKey.indexOf(String(index)) !== -1} index={index} itemsLength={fields.length} />
                        <div className="delete-btn-holder" onClick={(e) => e.stopPropagation()}>{/* eslint-disable-line */}
                          <Field
                            name={`${name}.id`}
                            render={({ input }) => (
                              <Button.Group>
                                <Tooltip title={t('Get a link to this indicator')}>
                                  <Button size="small" icon="link" onClick={() => getLink(input.value)} />
                                </Tooltip>
                                {!disableReordering && index > 0 &&
                                  <Tooltip title={t('Move up')}>
                                    <Button icon="up" size="small" onClick={() => moveIndicator(index, index - 1, fields, input.value)} />
                                  </Tooltip>
                                }
                                {!disableReordering && index < fields.length - 1 &&
                                  <Tooltip title={t('Move down')}>
                                    <Button icon="down" size="small" onClick={() => moveIndicator(index, index + 1, fields, input.value)} />
                                  </Tooltip>
                                }
                                <Popconfirm
                                  title={t('Are you sure to delete this indicator?')}
                                  onConfirm={() => remove(index, fields)}
                                  okText={t('Yes')}
                                  cancelText={t('No')}
                                >
                                  <Button size="small" icon="delete" className="delete-panel" />
                                </Popconfirm>
                              </Button.Group>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  >
                    <AutoSave sectionIndex={5} setName={`${fieldName}.indicators`} itemIndex={index} />
                    <div id={`${fieldNameToId(name)}-info`} />
                    <FinalField
                      name={`${name}.title`}
                      control="textarea"
                      autosize
                      withLabel
                      optional={isOptional}
                      dict={{ label: t('Title'), tooltip: t('Within each result indicators can be defined. Indicators should be items that can be counted and evaluated as the project continues and is completed.') }}
                      disabled={isImported(index)}
                    />
                    {result != null && result.parentResult && result.indicators[index] && result.indicators[index].parentIndicator == null && <Alert className="not-inherited" message="This indicator does not contribute to the lead project" type="warning" showIcon />}
                    <Condition when={`${name}.type`} is={1}>
                      <Row gutter={16}>
                        <Col lg={9} md={14} sm={24} xs={24}>
                          <Item label={<InputLabel tooltip={t('Choose how the indicator will be measured (in percentage or units).')}>{t('Measure')}</InputLabel>}>
                            <FinalField
                              name={`${name}.measure`}
                              render={({ input, validateStatus }) => (
                                <Radio.Group {...input} className={validateStatus === 'error' ? 'required' : undefined} disabled={isImported(index)}>
                                  <Radio.Button value="1">{t('Unit')}</Radio.Button>
                                  <Radio.Button value="2">{t('Percentage')}</Radio.Button>
                                </Radio.Group>
                              )}
                            />
                          </Item>
                        </Col>
                        <Col lg={6} md={10} sm={24} xs={24}>
                          <Field
                            name={`${name}.id`}
                            render={({ input }) => <CumulativeToggle id={input.value} name={name} />}
                          />
                        </Col>
                        <Col lg={9} md={24} sm={24} xs={24}>
                          <Item
                            label={
                              <InputLabel tooltip={t('Choose ascending if the target value of the indicator is higher than the baseline value (eg. people with access to sanitation). Choose descending if the target value of the indicator is lower than the baseline value (eg. people with diarrhea).')}>
                                {t('Order')}
                              </InputLabel>
                            }
                          >
                            <FinalField
                              name={`${name}.ascending`}
                              render={({ input }) => (
                                <Radio.Group {...input} disabled={isImported(index)}>
                                  <Radio.Button value>{t('Ascending')}</Radio.Button>
                                  <Radio.Button value={false}>{t('Descending')}</Radio.Button>
                                </Radio.Group>
                              )}
                            />
                          </Item>
                        </Col>
                      </Row>
                    </Condition>
                    <div style={{ display: 'flex' }}>
                      <Item label={<InputLabel optional tooltip={t('You can provide further information of the indicator here.')}>{t('Description')}</InputLabel>} style={{ flex: 1 }}>
                        <FinalField name={`${name}.description`} render={({ input }) => <RTE {...input} disabled={isImported(index)} />} />
                      </Item>
                      <Item label={t('Include in IATI export')} style={{ marginLeft: 16 }}>
                        <FinalField
                          name={`${name}.exportToIati`}
                          render={({ input }) => (
                            <Radio.Group {...input} disabled={isImported(index)}>
                              <Radio.Button value={true}>{t('Yes')}</Radio.Button>
                              <Radio.Button value={false}>{t('No')}</Radio.Button>
                            </Radio.Group>
                          )}
                        />
                      </Item>
                    </div>
                    <Condition when={`${name}.type`} is={2}>
                      <Divider className="scores-divider" />
                      <Item label={<InputLabel optional>Score options</InputLabel>}>
                        <FinalField
                          name={`${name}.scores`}
                          render={({ input }) => (
                            <Scores {...{ input }} />
                          )}
                        />
                      </Item>
                    </Condition>
                    {allowIndicatorLabels && (
                      <Condition when={`${name}.type`} isNot={1}>
                        <ThematicLabels fieldName={name} indicatorLabelOptions={indicatorLabelOptions} />
                      </Condition>
                    )}
                    <Divider />
                    <div id={`${fieldNameToId(name)}-disaggregations`} />
                    {!isImported(index) &&
                      <Condition when={`${name}.type`} is={1}>
                        <Aux>
                          <Field name={`${name}.id`} render={({ input: { value } }) => <Disaggregations formPush={formPush} fieldName={name} indicatorId={value} />} />
                          <Divider />
                        </Aux>
                      </Condition>
                    }
                    <div id={`${fieldNameToId(name)}-baseline`} />
                    <Row gutter={15}>
                      <Col span={12}>
                        <FinalField
                          name={`${name}.baselineYear`}
                          control="input"
                          withLabel
                          optional={!isDGIS}
                          dict={{ label: t('Baseline year') }}
                        />
                      </Col>
                      <Condition when={`${name}.type`} is={1}>
                        <Col span={12}>
                          <FinalField
                            name={`${name}.baselineValue`}
                            control="input"
                            withLabel
                            optional={!isDGIS}
                            dict={{ label: t('Baseline value') }}
                          />
                        </Col>
                      </Condition>
                      <Condition when={`${name}.type`} is={2}>
                        <Col span={12}>
                          <Item label={<InputLabel optional>Baseline score</InputLabel>}>
                            <FinalField
                              name={`${name}.baselineScore`}
                              render={({ input }) => (
                                <Select allowClear {...input}>
                                  {
                                    getScoreOptions(index)
                                      ? getScoreOptions(index).map((option, key) => <Select.Option key={key} value={option.value}>{option.label}</Select.Option>)
                                      : <Select.Option value="">No option</Select.Option>
                                  }
                                </Select>
                              )}
                            />
                          </Item>
                        </Col>
                      </Condition>
                    </Row>
                    <Item label={<InputLabel optional>{t('Baseline comment')}</InputLabel>}>
                      <FinalField name={`${name}.baselineComment`} render={({ input }) => <RTE {...input} disabled={isImported(index)} />} />
                    </Item>
                    {(targetsAt === 'indicator') && [
                      <Condition when={`${name}.type`} is={1}>
                        <FinalField name={`${name}.targetValue`} withLabel dict={{ label: t('Target value') }} control="input" />
                      </Condition>,
                      <Condition when={`${name}.type`} is={2}>
                        <Item label={<InputLabel>Target score</InputLabel>}>
                          <FinalField
                            name={`${name}.targetScore`}
                            render={({ input }) => (
                              <Select allowClear {...input}>
                                {getScoreOptions(index)?.map(option => <Select.Option value={option.value}>{option.label}</Select.Option>)}
                              </Select>
                            )}
                          />
                        </Item>
                      </Condition>,
                      <Field name={`${name}.id`} render={({ input }) => <Targets atIndicator indicatorId={input.value} indicatorIndex={index} fieldName={`${fieldName}.indicators[${index}]`} {...{ resultId, resultIndex, formPush, targetsAt }} />} />
                    ]
                    }
                    <Form layout="vertical">
                      <References validations={validations} formPush={formPush} fieldName={name} indicatorId={result?.indicators?.[index]?.id} />
                    </Form>
                    {customFields && <IndicatorCustomFields name={name} fields={customFields} values={result?.indicators?.[index]?.customValues} indicator={result?.indicators?.[index]?.id} />}
                    <Divider />
                    <div id={`${fieldNameToId(name)}-periods`} />
                    <Delay wait={250}>
                      <Field name={`${name}.id`} render={({ input }) => <Periods imported={isImported(index)} fieldName={name} indicatorId={input.value} indicatorIndex={index} scoreOptions={getScoreOptions(index)} {...{ formPush, program, resultImported, resultIndex, resultId, primaryOrganisation, selectedPeriodIndex, validations, projectId, periodLabels, setPeriodLabels, targetsAt }} />} />
                    </Delay>
                  </Panel>
                )
              }}
            />
            <Dropdown
              overlay={(
                <Menu style={{ textAlign: 'center' }} onClick={(e) => add(Number(e.key))}>
                  <Menu.Item key={1}>
                    {t('Quantitative')}
                  </Menu.Item>
                  <Menu.Item key={2}>
                    {t('Qualitative')}
                  </Menu.Item>
                  {deletedIndicators.length > 0 &&
                    <Menu.Item key={3}>
                      {t('Import')}
                    </Menu.Item>
                  }
                </Menu>
              )}
              trigger={['click']}
            >
              <Button icon="plus" block type="dashed">{t('Add indicator')}</Button>
            </Dropdown>
            <Modal className="import-indicator" visible={showImport} footer={null} onCancel={() => setShowImport(false)} title="Import a deleted indicator">
              {deletedIndicators.map(item =>
                <div className="deleted-indicator">
                  <div className="name">{item.title}</div>
                  <Button type="primary" onClick={() => importIndicator(item)}>Import</Button>
                </div>
              )}
            </Modal>
          </Aux>
        )}
      </FieldArray>
    )
  })

const ThematicLabels = ({ fieldName, indicatorLabelOptions }) => {
  const { t } = useTranslation()
  return (
    <Aux>
      <Divider />
      <Item label={<InputLabel>{t('Thematic labels for indicators')}</InputLabel>}>
        <FinalField
          name={`${fieldName}.labels`}
          render={({ input }) => (
            <Select
              mode="multiple"
              optionFilterProp="children"
              placeholder={t('Please select...')}
              {...input}
            >
              {indicatorLabelOptions.map(option => <Select.Option value={option.id}>{option.label}</Select.Option>)}
            </Select>
          )}
        />
      </Item>
    </Aux>
  )
}

export default Indicators
