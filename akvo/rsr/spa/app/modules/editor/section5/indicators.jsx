import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Collapse, Divider, Col, Row, Radio, Popconfirm, Select, Tooltip } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import InputLabel from '../../../utils/input-label'
import Accordion from '../../../utils/accordion'
import Condition from '../../../utils/condition'
import AutoSave from '../../../utils/auto-save'
import { addSetItem, removeSetItem } from '../actions'
import Periods from './periods/periods'
import Disaggregations from './disaggregations/disaggregations'
import IndicatorNavMenu, { fieldNameToId } from './indicator-nav-menu'
import api from '../../../utils/api'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children


const indicatorTypes = [
  { value: 1, label: 'quantitative'},
  { value: 2, label: 'qualitative'}
]

const Indicators = connect(null, {addSetItem, removeSetItem})(
  ({ fieldName, formPush, addSetItem, removeSetItem, resultId, resultIndex, primaryOrganisation, projectId, allowIndicatorLabels, indicatorLabelOptions }) => { // eslint-disable-line
  const { t } = useTranslation()
  const add = (key) => {
    const newItem = { type: key, periods: [] }
    if(key === 1) newItem.dimensionNames = []
    if(resultId) newItem.result = resultId
    formPush(`${fieldName}.indicators`, newItem)
    addSetItem(5, `${fieldName}.indicators`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.indicators`, index)
  }
  const moveIndicator = (from, to, fields, itemId) => {
    fields.move(from, to)
    api.post(`/project/${projectId}/reorder_items/`, `item_type=indicator&item_id=${itemId}&item_direction=${from > to ? 'up' : 'down'}`)
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
          renderPanel={(name, index, activeKey) => (
            <Panel
              key={index}
              header={(
              <span>
                <Field
                  name={`${name}.type`}
                  render={({input}) => {
                    const type = indicatorTypes.find(it => it.value === input.value)
                    return (
                      <span className="collapse-header-content">
                        <span className="capitalized">{type && type.label}</span>
                        &nbsp;{t('Indicator')} {index + 1}
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
              </span>)}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { activeKey.indexOf(String(index)) !== -1 && e.stopPropagation() }} style={{ display: 'flex' }}>
                  <IndicatorNavMenu fieldName={name} isActive={activeKey.indexOf(String(index)) !== -1} index={index} itemsLength={fields.length} />
                  <div className="delete-btn-holder" onClick={(e) => e.stopPropagation()}>{/* eslint-disable-line */}
                    <Field
                      name={`${name}.id`}
                      render={({input}) => (
                        <Button.Group>
                          <Tooltip title={t('Move up')}>
                            <Button icon="up" size="small" onClick={() => moveIndicator(index, index - 1, fields, input.value)} />
                          </Tooltip>
                          <Tooltip title={t('Move down')}>
                            <Button icon="down" size="small" onClick={() => moveIndicator(index, index + 1, fields, input.value)} />
                          </Tooltip>
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
              <Item label={<InputLabel optional tooltip={t('Within each result indicators can be defined. Indicators should be items that can be counted and evaluated as the project continues and is completed.')}>{t('Title')}</InputLabel>}>
                <FinalField
                  name={`${name}.title`}
                  control="textarea"
                  autosize
                />
              </Item>
              <Condition when={`${name}.type`} is={1}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel tooltip={t('Choose how the indicator will be measured (in percentage or units).')}>{t('Measure')}</InputLabel>}>
                      <FinalField
                        name={`${name}.measure`}
                        render={({input}) => (
                          <Radio.Group {...input}>
                            <Radio.Button value="1">{t('Unit')}</Radio.Button>
                            <Radio.Button value="2">{t('Percentage')}</Radio.Button>
                          </Radio.Group>
                        )}
                      />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item
                      label={
                      <InputLabel tooltip={t('Choose ascending if the target value of the indicator is higher than the baseline value (eg. people with access to sanitation). Choose descending if the target value of the indicator is lower than the baseline value (eg. people with diarrhea).')}>
                      {t('Order')}
                      </InputLabel>
                    }>
                      <FinalField
                        name={`${name}.ascending`}
                        render={({input}) => (
                          <Radio.Group {...input}>
                            <Radio.Button value>{t('Ascending')}</Radio.Button>
                            <Radio.Button value={false}>{t('Descending')}</Radio.Button>
                          </Radio.Group>
                        )}
                      />
                    </Item>
                  </Col>
                </Row>
              </Condition>
              <Item label={<InputLabel optional tooltip={t('You can provide further information of the indicator here.')}>{t('Description')}</InputLabel>}>
                <FinalField name={`${name}.description`} render={({input}) => <RTE {...input} />} />
              </Item>
              <Condition when={`${name}.type`} isNot={1}>
                {allowIndicatorLabels && <ThematicLabels fieldName={name} indicatorLabelOptions={indicatorLabelOptions} />}
              </Condition>
              <Divider />
              <div id={`${fieldNameToId(name)}-disaggregations`} />
              <Condition when={`${name}.type`} is={1}>
                <Aux>
                  <Field name={`${name}.id`} render={({ input: {value} }) => <Disaggregations formPush={formPush} fieldName={name} indicatorId={value} />} />
                  <Divider />
                </Aux>
              </Condition>
              <div id={`${fieldNameToId(name)}-baseline`} />
              <Row gutter={15}>
                <Col span={12}>
                  <Item label={<InputLabel optional>{t('Baseline year')}</InputLabel>}>
                    <FinalField name={`${name}.baselineYear`} />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional>{t('Baseline value')}</InputLabel>}>
                  <FinalField name={`${name}.baselineValue`} />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>{t('Baseline comment')}</InputLabel>}>
                <FinalField name={`${name}.baselineComment`} render={({input}) => <RTE {...input} />} />
              </Item>
              <Divider />
              <div id={`${fieldNameToId(name)}-periods`} />
              <Field name={`${name}.id`} render={({ input }) => <Periods formPush={formPush} fieldName={name} indicatorId={input.value} resultIndex={resultIndex} indicatorIndex={index} primaryOrganisation={primaryOrganisation} />} />
            </Panel>
          )}
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
            </Menu>
          )}
          trigger={['click']}
        >
          <Button icon="plus" block type="dashed">{t('Add indicator')}</Button>
        </Dropdown>
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
