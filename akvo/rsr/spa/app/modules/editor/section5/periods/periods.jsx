/* global window, navigator */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm, Tooltip, notification, Icon, Alert } from 'antd'
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
import Fields from '../../../../utils/fields'
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
    if (!dimensionNames || dimensionNames.length === 0) return null
    let newIndex = period.disaggregationTargets.length - 1
    return (
      <div className="disaggregation-targets">
        {dimensionNames.map(dimension => {
          const fieldNamesList = dimension.values.map((value) => {
            let targetIndex = period.disaggregationTargets.findIndex(it => it.dimensionValue === value.id)
            if (targetIndex === -1 && periodId) {
              newIndex += 1
              targetIndex = newIndex
            }
            return `${fieldName}.disaggregationTargets[${targetIndex}].value`
          })
          console.log(fieldNamesList)
          return (
            <div className="disaggregation-target" key={dimension.id}>
              <div className="ant-col ant-form-item-label target-name">Target value: <b>{dimension.name}</b></div>
              {dimension.values.map((value) => {
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
                const placeholderProp = { placeholder: '' }
                // const valueIds = dimension.values.map(it => it.id)
                // const emptyVals = period.disaggregationTargets.filter(it => valueIds.indexOf(it.dimensionValue) !== -1 && !it.value)
                // if (emptyVals.length === 1 && emptyVals[0].dimensionValue === value.id){
                //   const diff = Number(period.targetValue) - period.disaggregationTargets.filter(it => valueIds.indexOf(it.dimensionValue) !== -1 && it.value).reduce((acc, val) => acc + Number(val.value), 0)
                //   placeholderProp.placeholder = `${diff}?`
                // }
                return (
                  <Aux>
                    <AutoSave sectionIndex={5} setName={`${fieldName}.disaggregationTargets`} itemIndex={targetIndex} />
                    <Fields names={[`${fieldName}.targetValue`, ...fieldNamesList]} subscription={{ value: true }}>
                      {fieldsState => {
                        const targetValue = fieldsState[`${fieldName}.targetValue`].input.value
                        const emptyValKeys = Object.keys(fieldsState).slice(1).filter(key => !fieldsState[key].input.value)
                        if (targetValue > 0 && emptyValKeys.length === 1 && emptyValKeys[0] === `${fieldName}.disaggregationTargets[${targetIndex}].value`){
                          const total = Object.keys(fieldsState).slice(1).filter(key => fieldsState[key].input.value).reduce((acc, key) => acc + Number(fieldsState[key].input.value), 0)
                          placeholderProp.placeholder = `${targetValue - total}?`
                        }
                        return (
                          <div className="value-row" key={value.id}>
                            <div className="ant-col ant-form-item-label">{value.value}</div>
                            <FinalField
                              {...placeholderProp}
                              disabled={!periodId}
                              name={`${fieldName}.disaggregationTargets[${targetIndex}].value`}
                            />
                          </div>
                        )
                      }}
                    </Fields>
                  </Aux>
                )
              })}
              <Fields names={[`${fieldName}.targetValue`, ...fieldNamesList]} subscription={{ value: true }}>
                {fieldsState => {
                  const targetValue = fieldsState[`${fieldName}.targetValue`].input.value
                  const total = Object.keys(fieldsState).slice(1).filter(key => fieldsState[key].input.value).reduce((acc, key) => acc + Number(fieldsState[key].input.value), 0)
                  if (targetValue - total < 0) {
                    return <Alert type="error" message="Total sum greater than target value" style={{ marginTop: 10 }} />
                  }
                  return null
                }}
              </Fields>
            </div>
            )
        })}
      </div>
    )
  }
}
const DimensionTargets = connect(({ editorRdr: { section5: { fields: {results} } } }) => ({ results }))(_DimensionTargets)

const Periods = connect(null, { addSetItem, removeSetItem })(({ fieldName, formPush, addSetItem, removeSetItem, indicatorId, resultId, primaryOrganisation, resultIndex, indicatorIndex, selectedPeriodIndex }) => { // eslint-disable-line
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
    navigator.clipboard.writeText(window.location.href)
    notification.open({
      message: t('Link copied!'),
      icon: <Icon type="link" style={{ color: '#108ee9' }} />,
    })
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
                    <Item label={t('Start')}>
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
                    <Item label={t('End')}>
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
