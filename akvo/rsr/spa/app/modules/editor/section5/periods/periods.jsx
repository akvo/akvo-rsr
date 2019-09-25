import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm, Divider, Input } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { useTranslation } from 'react-i18next'
import { isEqual, get } from 'lodash'
import moment from 'moment'

import RTE from '../../../../utils/rte'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import Accordion from '../../../../utils/accordion'
import AutoSave from '../../../../utils/auto-save'
import { addSetItem, removeSetItem } from '../../actions'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

class _DimensionTargets extends React.Component{
  shouldComponentUpdate(prevProps){
    const { resultIndex, indicatorIndex } = this.props
    const path = `results[${resultIndex}].indicators[${indicatorIndex}].dimensionNames`
    return !isEqual(get(prevProps, path), get(this.props, path)) || prevProps.periodId !== this.props.periodId
  }
  render(){
    const { resultIndex, indicatorIndex, indicatorId, periodIndex, periodId, fieldName, formPush } = this.props
    const path = `results[${resultIndex}].indicators[${indicatorIndex}]`
    const indicator = get(this.props, path)
    if(!indicator){
      return null
    }
    const { dimensionNames } = indicator
    let period = indicator.periods[periodIndex]
    if(period === undefined){
      period = { indicator: indicatorId }
    }
    if(!period.disaggregationTargets) period.disaggregationTargets = []
    if (dimensionNames.length === 0) return null
    let newIndex = period.disaggregationTargets.length - 1
    console.log('render', new Date())
    return (
      <div className="disaggregation-targets">
        {dimensionNames.map(dimension => (
          <div className="disaggregation-target">
            <div className="ant-col ant-form-item-label target-name">Target value: <b>{dimension.name}</b></div>
            {dimension.values.map(value => {
              let targetIndex = period.disaggregationTargets.findIndex(it => it.dimensionValue === value.id)
              if (targetIndex === -1 && periodId) {
                newIndex += 1
                targetIndex = newIndex
              }
              // reducer updates values and overrides FinalForm's values. Next few lines prevent this
              setTimeout(() => {
                const targetIndex1 = period.disaggregationTargets.findIndex(it => it.dimensionValue === value.id)
                if (targetIndex1 === -1 && periodId) {
                  formPush(`${fieldName}.disaggregationTargets`, { period: periodId, dimensionValue: value.id })
                }
              }, 100)
              return (
                <div className="value-row">
                  <AutoSave sectionIndex={5} setName={`${fieldName}.disaggregationTargets`} itemIndex={targetIndex} />
                  <div className="ant-col ant-form-item-label">{value.value}</div>
                  <FinalField disabled={!periodId} name={`${fieldName}.disaggregationTargets[${targetIndex}].value`} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
}
const DimensionTargets = connect(({ editorRdr: { section5: { fields: {results} } } }) => ({ results }))(_DimensionTargets)

const Periods = connect(null, { addSetItem, removeSetItem })(({ fieldName, formPush, addSetItem, removeSetItem, indicatorId, resultId, primaryOrganisation, resultIndex, indicatorIndex }) => { // eslint-disable-line
  const { t } = useTranslation()
  const add = () => {
    const newItem = { indicator: indicatorId, disaggregationTargets: [] }
    formPush(`${fieldName}.periods`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.periods`, index)
  }
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
          setName={`${fieldName}.periods`}
          renderPanel={(name, index) => (
            <Panel
              header={(
                <span>
                  {t('Period')} {index + 1}:&nbsp;
                  <Field
                    name={`${name}.periodStart`}
                    render={({input}) => input.value}
                  />
                  &nbsp;-&nbsp;
                  <Field
                    name={`${name}.periodEnd`}
                    render={({input}) => input.value}
                  />
                </span>
              )}
              key={index}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                <div className="delete-btn-holder">
                <Popconfirm
                  title={t('Are you sure to delete this period?')}
                  onConfirm={() => remove(index, fields)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                >
                  <Button size="small" icon="delete" className="delete-panel" />
                </Popconfirm>
                </div>
                </div>
              )}
            >
              <AutoSave sectionIndex={5} setName={`${fieldName}.periods`} itemIndex={index} />
              <Row gutter={16}>
                <Col span={12}>
                  <Item label="Start">
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
                      />
                      )}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label="End">
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
                      />
                      )}
                    />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>{t('Target value')}</InputLabel>}>
                <FinalField name={`${name}.targetValue`} />
              </Item>
              <Field name={`${name}.id`} render={({ input }) => <DimensionTargets formPush={formPush} fieldName={`${fieldName}.periods[${index}]`} periodId={input.value} periodIndex={index} indicatorId={indicatorId} indicatorIndex={indicatorIndex} resultId={resultId} resultIndex={resultIndex} />} />
              <Item label={<InputLabel optional>{t('Comment')}</InputLabel>}>
                <FinalField name={`${name}.targetComment`} render={({input}) => <RTE {...input} />} />
              </Item>
            </Panel>
          )}
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
