import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Input, Divider, Upload, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import classNames from 'classnames'
import ShowMoreText from 'react-show-more-text'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import RTE from '../../utils/rte'
import FinalField from '../../utils/final-field'
import api from '../../utils/api'

const { Panel } = Collapse
const { Item } = Form

const Enumerator = ({ results, id }) => {
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    const indicators = []
    results.forEach(result => {
      result.indicators.forEach(indicator => {
        const periods = indicator.periods.filter(it => it.locked === false && it.canAddUpdate)
        if(periods.length > 0){
          const {id, title, type, ascending, description, measure} = indicator
          indicators.push({
            id, title, type, periods, ascending, description, measure
          })
        }
      })
    })
    setIndicators(indicators)
    if(indicators.length > 0){
      setSelected(indicators[0])
    }
  }, [])
  const handleSelectIndicator = (indicator) => {
    setSelected(indicator)
  }
  return (
    <div className="enumerator-view">
      <ul>
        {indicators.map(indicator =>
          <li className={(selected === indicator) && 'selected'} onClick={() => handleSelectIndicator(indicator)}>
            <div className="check-holder">
              <div className="check" />
            </div>
            <h5>{indicator.title}</h5>
          </li>
        )}
      </ul>
      <div className="content">
        {selected && [
          selected.description &&
          <p className="desc">
            {selected.description}
          </p>,
          <Collapse destroyInactivePanel accordion>
            {selected.periods.map(period =>
              <AddUpdate period={period} indicator={selected} />
            )}
          </Collapse>
        ]}
      </div>
    </div>
  )
}

const AddUpdate = ({period, indicator, ...props}) => {
  const { t } = useTranslation()
  const formRef = useRef()
  const dsgGroups = {}
  period.disaggregationTargets.forEach((item, index) => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
    dsgGroups[item.category][dsgGroups[item.category].length - 1].itemIndex = index
  })
  const dsgKeys = Object.keys(dsgGroups)
  const handleSubmit = (values) => {
    api.post('/indicator_period_data_framework/', {
      ...values,
      period: period.id,
      // user: user
    })
  }
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={{ value: '', disaggregations: period.disaggregationTargets.map(it => ({ ...it, value: undefined })) }}
      render={({ form }) => {
        return [
          <Panel {...props} header={[
            <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
            <FormSpy subscription={{ values: true }}>
              {({ values }) => {
                console.log(values)
                let disabled = true
                if(indicator.type === 1){
                  if(values.value !== '' && String(Number(values.value)) !== 'NaN') disabled = false
                  // if(Number(indicator.measure) === 2 && value){}
                }
                return <Button type="primary" disabled={disabled} onClick={() => formRef.current.form.submit()}>Submit</Button>
              }}
            </FormSpy>
          ]}>
            <div className="add-update">
              <header>
                {indicator.type === 2 ? <b>Qualitative</b> :
                  indicator.ascending ? [
                    <Icon type="rise" />, <b>Ascending</b>
                  ] : [
                      <Icon type="fall" />, <b>Descending</b>
                    ]
                }
              </header>
              <Form aria-orientation="vertical">
                <div className={classNames('inputs-container', { qualitative: indicator.type === 2 })}>
                  <div className="inputs">
                    {/* <h5>Value percentage</h5> */}
                    {dsgKeys.map(dsgKey =>
                      <div className="dsg-group">
                        <div className="h-holder">
                          <h5>{dsgKey}</h5>
                        </div>
                        {dsgGroups[dsgKey].map(dsg => {
                          return (
                            <FinalField
                              name={`disaggregations[${dsg.itemIndex}].value`}
                              control="input-number"
                              withLabel
                              dict={{ label: dsg.type }}
                              min={-Infinity}
                              step={1}
                            />
                          )
                        }
                        )}
                      </div>
                    )}
                    {indicator.type === 1 ? [
                      <Field
                        name="disaggregations"
                        render={({ input }) => {
                          const dsgGroups = {}
                          console.log(input.value)
                          input.value.forEach(item => {
                            if (item.value) {
                              if (!dsgGroups[item.category]) dsgGroups[item.category] = 0
                              dsgGroups[item.category] += item.value
                            }
                          })
                          if (Object.keys(dsgGroups).length > 0){
                            form.change('value', Object.keys(dsgGroups).reduce((acc, key) => dsgGroups[key] > acc ? dsgGroups[key] : acc, 0))
                          }
                          return null
                        }}
                      />,
                      indicator.measure === '1' ?
                      <FinalField
                        withLabel
                        dict={{ label: period?.disaggregationTargets.length > 0 ? 'Total value' : 'Value' }}
                        name="value"
                        control="input-number"
                        min={-Infinity}
                        step={1}
                      /> :
                      <FinalField
                        withLabel
                        dict={{ label: 'Numerator' }}
                        name="numerator"
                        control="input-number"
                        min={-Infinity}
                        step={1}
                      />,
                      (indicator.measure === '1' && period.updates.length > 0) && [
                        <div className="updated-actual">
                          <div className="cap">Updated actual value</div>
                          <Field
                            name="value"
                            render={({ input }) => [
                              <div className="value">
                                <b>{period.updates.reduce((acc, val) => acc + val.value, 0) + (input.value > 0 ? input.value : 0)}</b>
                                {period.targetValue > 0 && <small>{(Math.round(((period.updates.reduce((acc, val) => acc + val.value, 0) + (input.value > 0 ? input.value : 0)) / period.targetValue) * 100 * 10) / 10)}% of target</small>}
                              </div>
                            ]}
                          />
                        </div>
                      ],
                      indicator.measure === '2' && [
                        <FinalField
                          withLabel
                          dict={{ label: 'Denominator' }}
                          name="denominator"
                          control="input-number"
                        />,
                        <div className="perc">
                          <FormSpy subscription={{ values: true }}>
                            {({ values }) => {
                              if (values.numerator !== '' && values.denominator !== '') {
                                const value = Math.round((values.numerator / values.denominator) * 100 * 10) / 10
                                form.change('value', value)
                                return `${value}%`
                              }
                              return null
                            }}
                          </FormSpy>
                        </div>
                      ]
                    ] : [ // qualitative indicator
                        <h5>Your new update</h5>,
                        <RTE />
                      ]}
                  </div>
                  {period.updates.length > 0 &&
                    ((update) => {
                      const dsgGroups = {}
                      update.disaggregations.forEach(item => {
                        if (!dsgGroups[item.category]) dsgGroups[item.category] = []
                        dsgGroups[item.category].push(item)
                        if (period.disaggregationTargets.length > 0) {
                          const target = period.disaggregationTargets.find(it => it.typeId === item.typeId)
                          if (target != null) dsgGroups[item.category][dsgGroups[item.category].length - 1].targetValue = target.value
                        }
                      })
                      const dsgKeys = Object.keys(dsgGroups)
                      // console.log(dsgGroups, period.disaggregationTargets)
                      return (
                        <div className="prev-value-holder">
                          <div className="prev-value">
                            <h5>previous value update</h5>
                            <div className="date">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                            <div className="author">{update.userDetails.firstName} {update.userDetails.lastName}</div>
                            {indicator.type === 2 ? [
                              <div className="narrative">
                                <ShowMoreText lines={7}>
                                  <p dangerouslySetInnerHTML={{ __html: update.narrative.replace(/\n/g, '<br />') }} />
                                </ShowMoreText>
                              </div>
                            ] : [
                                <div>
                                  {indicator.measure === '1' &&
                                    <div>
                                      <div className="value">
                                        {update.value}
                                      </div>
                                      {(period.targetValue && dsgKeys.length === 0) ? [
                                        <div className="target-cap">{(Math.round(((period.updates.reduce((acc, val) => acc + val.value, 0)) / period.targetValue) * 100 * 10) / 10)}% of target reached</div>
                                      ] : null}
                                      {dsgKeys.map(dsgKey => [
                                        <div className="dsg-group">
                                          <div className="h-holder">
                                            <h5>{dsgKey}</h5>
                                          </div>
                                          <ul>
                                            {dsgGroups[dsgKey].map((dsg) => [
                                              <li>
                                                <div className="label">{dsg.type}</div>
                                                <div>
                                                  <b>{dsg.value}</b>
                                                  {dsg.targetValue && <b> ({Math.round(((dsg.value / dsg.targetValue) * 100 * 10) / 10)}%)</b>}
                                                </div>
                                              </li>
                                            ])}
                                          </ul>
                                        </div>
                                      ])}
                                    </div>
                                  }
                                  {indicator.measure === '2' &&
                                    [
                                      <div className="value-holder">
                                        <div>
                                          <div className="value">
                                            {(Math.round((update.numerator / update.denominator) * 100 * 10) / 10)}%
                                          </div>
                                          <div className="target-cap">{(Math.round((update.value / period.targetValue) * 100 * 10) / 10)}% of target</div>
                                        </div>
                                        <div className="breakdown">
                                          <div className="cap">Numerator</div>
                                          <b>{update.numerator}</b>
                                          <div className="cap num">Denominator</div>
                                          <b>{update.denominator}</b>
                                        </div>
                                      </div>,
                                    ]
                                  }
                                </div>
                              ]}
                          </div>
                        </div>
                      )
                    })(period.updates.sort((a, b) => a.id - b.id)[period.updates.length - 1])
                  }
                </div>
                <Divider />
                <div className="notes">
                  <FinalField
                    name="valueComment"
                    control="textarea"
                    withLabel
                    dict={{ label: 'Value comment' }}
                  />
                  <FinalField
                    name="notes"
                    control="textarea"
                    withLabel
                    dict={{ label: 'Internal private note' }}
                  />
                </div>
              </Form>
              <div className="upload">
                <Upload.Dragger
                  name="document"
                  listType="picture"
                  method="PATCH"
                  withCredentials
                  // fileList={fileList}
                  beforeUpload={file => {
                    // setFileList([file])
                    return false
                  }}
                  onSuccess={(item) => {
                  }}
                  onRemove={file => {
                    // setFileList(state => {
                    //   const index = fileList.indexOf(file)
                    //   const newFileList = state.slice()
                    //   newFileList.splice(index, 1)
                    //   return newFileList
                    // });
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="picture" theme="twoTone" />
                  </p>
                  <p className="ant-upload-text">{t('Drag file here')}</p>
                  <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
                  <p><small>Max: 10MB</small></p>
                </Upload.Dragger>
              </div>
            </div>
          </Panel>
        ]
      }}
    />
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Enumerator)
