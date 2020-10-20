import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Input, Divider, Upload, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {cloneDeep} from 'lodash'
import classNames from 'classnames'
import ShowMoreText from 'react-show-more-text'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import RTE from '../../utils/rte'
import FinalField from '../../utils/final-field'
import api from '../../utils/api'
import { nicenum } from '../../utils/misc'

const { Panel } = Collapse

const Enumerator = ({ results, id }) => {
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    const indicators = []
    results.forEach(result => {
      result.indicators.forEach(indicator => {
        const periods = indicator.periods.filter(it => it.locked === false) // && (it.canAddUpdate || (it.updates[0]?.status === 'P'))
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
  const addUpdateToPeriod = (update, period, indicator) => {
    const indIndex = indicators.findIndex(it => it.id === indicator.id)
    const prdIndex = indicators[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(indicators)
    updated[indIndex].periods[prdIndex].updates = [update, ...updated[indIndex].periods[prdIndex].updates]
    setIndicators(updated)
    setSelected(updated[indIndex])
  }
  if (indicators.length === 0) return <div className="empty">Nothing due submission</div>
  return (
    <div className="enumerator-view">
      {indicators.length === 0 && <div className="empty">Nothing due submission</div>}
      <div>
      <ul className="indicators">
        {indicators.map(indicator => {
          const checked = indicator.periods.filter(period => (period.updates.length > 0 && period.updates[0].status === 'P')).length === indicator.periods.length
          return [
          <li className={(selected === indicator) && 'selected'} onClick={() => handleSelectIndicator(indicator)}>
            <div className="check-holder">
              <div className={classNames('check', { checked })}>
                {checked && <Icon type="check" />}
              </div>
            </div>
            <h5>{indicator.title}</h5>
          </li>
          ]
        })}
      </ul>
      </div>
      <div className="content">
        {selected && [
          selected.description &&
          <p className="desc">
            {selected.description}
          </p>,
          <Collapse destroyInactivePanel>
            {selected.periods.map(period =>
              <AddUpdate period={period} indicator={selected} {...{ addUpdateToPeriod, period}} />
            )}
          </Collapse>
        ]}
      </div>
    </div>
  )
}

const AddUpdate = ({ period, indicator, addUpdateToPeriod, ...props}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [fullPendingUpdate, setFullPendingUpdate] = useState(null)
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
      status: 'P',
      period: period.id
    }).then(({ data: update }) => {
      setSubmitting(false)
      if(values.note !== '' && values.note != null){
        api.post('/indicator_period_data_comment/', {
          data: update.id,
          comment: values.note
        })
      }
      addUpdateToPeriod(update, period, indicator)
    }).catch(() => {
      setSubmitting(false)
    })
  }
  const handleSubmitClick = (e) => {
    e.stopPropagation()
    formRef.current.form.submit()
    setSubmitting(true)
  }
  const pendingUpdate = (period.updates[0]?.status === 'P' || indicator.measure === '2'/* trick % measure update to show as "pending update" */) ? period.updates[0] : null
  useEffect(() => {
    if(pendingUpdate){
      setFullPendingUpdate(pendingUpdate)
      api.get(`/indicator_period_data_framework/${pendingUpdate.id}/`).then(({data}) => {
        setFullPendingUpdate(data)
      })
    } else {
      setFullPendingUpdate(null)
    }
  }, [period.updates])
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={fullPendingUpdate ? { ...fullPendingUpdate, note: fullPendingUpdate.comments?.length > 0 ? fullPendingUpdate.comments[0].comment : ''} : { value: '', disaggregations: period.disaggregationTargets.map(it => ({ ...it, value: undefined })) }}
      render={({ form }) => {
        return [
          <Panel {...props} header={[
            <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
            pendingUpdate ? <div className="submitted"><Icon type="check" /> Submitted</div> :
            <FormSpy subscription={{ values: true }}>
              {({ values }) => {
                let disabled = true
                if(indicator.type === 1){
                  if(values.value !== '' && String(Number(values.value)) !== 'NaN') disabled = false
                  // if(Number(indicator.measure) === 2 && value){}
                }
                return <Button type="primary" disabled={disabled || pendingUpdate != null} loading={submitting} onClick={handleSubmitClick}>Submit</Button>
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
              {(pendingUpdate && pendingUpdate.status === 'P') && <h3>Submitted {moment(pendingUpdate.createdAt).format('DD/MM/YYYY')} - Awaiting approval</h3>}
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
                              disabled={pendingUpdate != null}
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
                        disabled={pendingUpdate != null}
                      /> :
                      <FinalField
                        withLabel
                        dict={{ label: 'Numerator' }}
                        name="numerator"
                        control="input-number"
                        min={-Infinity}
                        step={1}
                        disabled={pendingUpdate != null}
                      />,
                      (indicator.measure === '1' && period.updates.length > 0) && [
                        <div className="updated-actual">
                          <div className="cap">Updated actual value</div>
                          <Field
                            name="value"
                            render={({ input }) => [
                              <div className="value">
                                <b>{nicenum(period.updates.reduce((acc, val) => acc + val.value, 0) + (input.value > 0 ? input.value : 0))}</b>
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
                          step={1}
                          min={-Infinity}
                          disabled={pendingUpdate != null}
                        />,
                        <div className="perc">
                          <FormSpy subscription={{ values: true }}>
                            {({ values }) => {
                              if (values.numerator !== '' && values.numerator != null && values.denominator !== '' && values.denominator != null) {
                                const value = Math.round((values.numerator / values.denominator) * 100 * 10) / 10
                                if(value !== values.value){
                                  form.change('value', value)
                                }
                                return `${value}%`
                              }
                              return null
                            }}
                          </FormSpy>
                        </div>
                      ]
                    ] : [ // qualitative indicator
                        <h5>Your new update</h5>,
                        <RTE disabled={pendingUpdate != null} />
                      ]}
                  </div>
                  {!(indicator.measure === '2' && period.updates.length > 0) &&
                    <PrevUpdate update={period.updates.filter(it => it.status === 'A')[0]} {...{ period, indicator }} />
                  }
                </div>
                <Divider />
                <div className="notes">
                  <FinalField
                    name="text"
                    control="textarea"
                    withLabel
                    dict={{ label: 'Value comment' }}
                    disabled={pendingUpdate != null}
                  />
                  <FinalField
                    name="note"
                    control="textarea"
                    withLabel
                    dict={{ label: 'Internal private note' }}
                    disabled={pendingUpdate != null}
                  />
                </div>
              </Form>
              <div className="upload">
                <Upload.Dragger
                  name="document"
                  listType="picture"
                  method="PATCH"
                  withCredentials
                  disabled={pendingUpdate != null}
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

const PrevUpdate = ({update, period, indicator}) => {
  if(!update) return null
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
                    {nicenum(update.value)}
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
                              <b>{nicenum(dsg.value)}</b>
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
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Enumerator)
