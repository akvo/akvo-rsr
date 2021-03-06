/* global window, FormData, document */
import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Input, Divider, Upload, InputNumber, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {cloneDeep} from 'lodash'
import classNames from 'classnames'
import ShowMoreText from 'react-show-more-text'
import { useSpring, animated } from 'react-spring'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import SVGInline from 'react-svg-inline'
import axios from 'axios'
import humps from 'humps'
import RTE from '../../utils/rte'
import { useFetch } from '../../utils/hooks'
import FinalField from '../../utils/final-field'
import api, { config } from '../../utils/api'
import { nicenum, dateTransform } from '../../utils/misc'
import statusPending from '../../images/status-pending.svg'
import statusApproved from '../../images/status-approved.svg'
import statusRevision from '../../images/status-revision.svg'

const { Panel } = Collapse
const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const Enumerator = ({ results, jwtView, title }) => {
  const { t } = useTranslation()
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)
  useEffect(() => {
    let indicators = []
    results.forEach(result => {
      result.indicators.forEach(indicator => {
        const periods = indicator.periods.filter(it => it.locked === false) // && (it.canAddUpdate || (it.updates[0]?.status === 'P'))
        if(periods.length > 0){
          const {id, title, type, ascending, description, measure, dimensionNames} = indicator
          indicators.push({
            id, title, type, periods, ascending, description, measure, dimensionNames
          })
        }
      })
    })
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('rt') === 'preview') {
      setIsPreview(true)
      const ids = urlParams.get('indicators').split(',')
      indicators = indicators.filter(it => ids.indexOf(String(it.id)) !== -1)
    }
    setIndicators(indicators)
    if(indicators.length > 0 && document.body.clientWidth > 768){
      setSelected(indicators[0])
    }
  }, [])
  const handleSelectIndicator = (indicator) => {
    setSelected(indicator)
    setMobilePage(1)
  }
  const addUpdateToPeriod = (update, period, indicator) => {
    const indIndex = indicators.findIndex(it => it.id === indicator.id)
    const prdIndex = indicators[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(indicators)
    updated[indIndex].periods[prdIndex].updates = [update, ...updated[indIndex].periods[prdIndex].updates]
    setIndicators(updated)
    setSelected(updated[indIndex])
  }
  const mobileGoBack = () => {
    setMobilePage(0)
  }
  if (indicators.length === 0) return <div className="empty">{t('Nothing due submission')}</div>
  return (
    <div className="enumerator-view">
      {indicators.length === 0 && <div className="empty">{t('Nothing due submission')}</div>}
      <MobileSlider page={mobilePage}>
        <div>
          <header className="mobile-only">
            <h1>{title}</h1>
          </header>
          <ul className="indicators">
            {indicators.map(indicator => {
              const checked = indicator.periods.filter(period => (indicator.measure === '2' && period.updates.length > 0) || (period.updates.length > 0 && period.updates[0].status === 'P')).length === indicator.periods.length
              return [
              <li className={(selected === indicator) ? 'selected' : undefined} onClick={() => handleSelectIndicator(indicator)}>
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
            <header className="mobile-only">
              <Button icon="left" type="link" size="large" onClick={mobileGoBack} />
              <div>
                <h2>{selected.title}</h2>
                <p className="desc">
                  {selected.description}
                </p>
              </div>
            </header>,
            selected.description &&
            <p className="desc hide-for-mobile">
              {selected.description}
            </p>,
            <Collapse destroyInactivePanel className={jwtView ? 'webform' : ''}>
              {selected.periods.map(period =>
                <AddUpdate period={period} key={period.id} indicator={selected} {...{ addUpdateToPeriod, period, isPreview}} />
              )}
            </Collapse>
          ]}
        </div>
      </MobileSlider>
    </div>
  )
}

const AddUpdate = ({ period, indicator, addUpdateToPeriod, isPreview, ...props}) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [fullPendingUpdate, setFullPendingUpdate] = useState(null)
  const [fileSet, setFileSet] = useState([])
  const formRef = useRef()
  const disaggregations = []
  console.log(indicator)
  if(indicator) {
    indicator.dimensionNames && indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }
  const initialValues = useRef({ value: '', disaggregations })
  useEffect(() => {
    initialValues.current = { value: '', disaggregations }
    setFileSet([])
  }, [period])
  const handleSubmit = (values) => {
    if(values.value === '') delete values.value
    api.post('/indicator_period_data_framework/', {
      ...values,
      status: 'P',
      period: period.id
    }).then(({ data: update }) => {
      setSubmitting(false)
      const resolveUploads = () => {
        if (fileSet.length > 0) {
          const urlParams = new URLSearchParams(window.location.search)
          const formData = new FormData()
          fileSet.forEach(file => {
            formData.append('files', file)
          })
          axios.post(`${config.baseURL}/indicator_period_data/${update.id}/files/?rt=${urlParams.get('rt')}`, formData, axiosConfig)
            .then(({ data }) => {
              addUpdateToPeriod({...update, fileSet: data }, period, indicator)
            })
            .catch(() => {
              addUpdateToPeriod(update, period, indicator)
            })
        }
        else {
          addUpdateToPeriod(update, period, indicator)
        }
      }
      if (values.note !== '' && values.note != null) {
        api.post('/indicator_period_data_comment/', {
          data: update.id,
          comment: values.note
        }).then(d => {
          resolveUploads()
        })
      } else {
        resolveUploads()
      }
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
  const updateForRevision = period.updates[0]?.status === 'R' ? period.updates[0] : null
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
  const currentActualValue = indicator.type === 1 ? period.updates.filter(it => it.status === 'A').reduce((acc, val) => acc + val.value, 0) : null
  return (
    <FinalForm
      ref={(ref) => { formRef.current = ref }}
      onSubmit={handleSubmit}
      subscription={{}}
      initialValues={
        fullPendingUpdate ?
          { ...fullPendingUpdate, note: fullPendingUpdate.comments?.length > 0 ? fullPendingUpdate.comments[0].comment : ''}
          :
          initialValues.current
      }
      render={({ form }) => {
        return [
          <Panel {...props} header={[
            <div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>,
            pendingUpdate ? <div className="submitted"><Icon type="check" /> {t('Submitted')}</div> :
            <FormSpy subscription={{ values: true }}>
              {({ values }) => {
                let disabled = true
                if(indicator.type === 1){
                  if(values.value !== '' && String(Number(values.value)) !== 'NaN') disabled = false
                } else {
                  if(values.text != null && values.text.length > 3) disabled = false
                }
                return <Button type="primary" disabled={disabled || pendingUpdate != null || isPreview} loading={submitting} onClick={handleSubmitClick}>{t('Submit')}</Button>
              }}
            </FormSpy>
          ]}>
            <div className="add-update">
              <header>
                {indicator.type === 2 ? <b>{t('Qualitative')}</b> :
                  indicator.ascending ? [
                    <Icon type="rise" />, <b>{t('Ascending')}</b>
                  ] : [
                      <Icon type="fall" />, <b>{t('Descending')}</b>
                    ]
                }
              </header>
              {(pendingUpdate && pendingUpdate.status === 'P') && [
                <div className="submitted">
                  <b>{t('Submitted')}</b><span>{moment(pendingUpdate.createdAt).format('DD/MM/YYYY')}</span><i>{t('Pending approval')}</i>
                </div>
              ]}
              {updateForRevision && <DeclinedStatus {...{ updateForRevision, t }} />}
              <Form aria-orientation="vertical">
                <div className={classNames('inputs-container', { qualitative: indicator.type === 2, 'no-prev': period.updates.filter(it => it.status === 'A').length === 0 })}>
                  <div className="inputs">
                    {indicator.dimensionNames.map(group =>
                      <div className="dsg-group" key={group.name}>
                        <div className="h-holder">
                          <h5>{group.name}</h5>
                        </div>
                        {group.dimensionValues.map(dsg => {
                          return (
                            <FinalField
                              name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].value`}
                              control="input-number"
                              withLabel
                              dict={{ label: dsg.value }}
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
                        dict={{ label: period?.disaggregationTargets.length > 0 ? t('Total value') : t('Value') }}
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
                          <div className="cap">{t('Updated actual value')}</div>
                          <Field
                            name="value"
                            render={({ input }) => [
                              <div className="value">
                                <b>{nicenum(currentActualValue + (input.value > 0 ? input.value : 0))}</b>
                                {period.targetValue > 0 && <small>{(Math.round(((currentActualValue + (input.value > 0 ? input.value : 0)) / period.targetValue) * 100 * 10) / 10)}% of target</small>}
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
                        <h5>{t('Your new update')}</h5>,
                        <Field
                          name="text"
                          render={({input}) => [
                            <RTE {...input} disabled={pendingUpdate != null} />
                          ]}
                        />
                      ]}
                  </div>
                  {!(indicator.measure === '2' && period.updates.length > 0) &&
                    <PrevUpdate update={period.updates.filter(it => it.status === 'A' || it.status === 'R')[0]} {...{ period, indicator }} />
                  }
                </div>
                <Divider />
                <div className="notes">
                  {indicator.type === 1 &&
                  <FinalField
                    name="text"
                    control="textarea"
                    withLabel
                    dict={{ label: t('Value comment') }}
                    disabled={pendingUpdate != null}
                  />
                  }
                  <FinalField
                    name="note"
                    control="textarea"
                    withLabel
                    dict={{ label: t('Internal private note') }}
                    disabled={pendingUpdate != null}
                  />
                </div>
              </Form>
              <div className="upload">
                <Upload.Dragger
                  multiple
                  disabled={pendingUpdate != null}
                  fileList={fileSet}
                  beforeUpload={(file, files) => {
                    setFileSet([...fileSet, ...files])
                    return false
                  }}
                  onSuccess={(item) => {
                  }}
                  onRemove={file => {
                    setFileSet(fileSet.filter(_file => _file !== file))
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

const DeclinedStatus = ({ updateForRevision, t }) => {
  const [update, loading] = useFetch(`/indicator_period_data_framework/${updateForRevision.id}/`)
  return [
    <div className="declined">
      <div>
        <b className="status">{t('Declined')}</b><span>{moment(updateForRevision.createdAt).format('DD/MM/YYYY')}</span><i>{t('Returned for revision')}</i>
      </div>
      {update && update.comments?.length > 0 && [
      <div>
        <b>{t('Reason')}</b>
        <p>{update.comments[0].comment}</p>
      </div>
      ]}
    </div>
  ]
}

const PrevUpdate = ({update, period, indicator}) => {
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const { t } = useTranslation()
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
  return (
    <div className="prev-value-holder">
      <div className="prev-value">
        <h5>{t('previous value update')}</h5>
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
                      <div className="cap">{t('Numerator')}</div>
                      <b>{update.numerator}</b>
                      <div className="cap num">{t('Denominator')}</div>
                      <b>{update.denominator}</b>
                    </div>
                  </div>,
                ]
              }
            </div>
          ]}
      </div>
      {period.updates.length > 1 &&
      <div className="all-submissions-btn-container">
        <Button type="link" onClick={() => setShowSubmissionsModal(true)}>See all submissions</Button>
      </div>
      }
      <AllSubmissionsModal period={period} visible={showSubmissionsModal} onCancel={() => setShowSubmissionsModal(false)} />
    </div>
  )
}

const AllSubmissionsModal = ({ visible, onCancel, period }) => {
  let width = 460
  if(period.disaggregations){
    width += period.disaggregations.length * 100
  }
  if(width > document.body.clientWidth - 100){
    width = document.body.clientWidth - 100
  }
  return (
    <Modal {...{ visible, onCancel, width }} title="Period latest submissions" footer={null} className="all-submissions-modal">
      <table>
        {period.updates.map(update => {
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
          return (
            <tr>
              <td>
                <div className="svg-text">
                  <SVGInline svg={update.status === 'A' ? statusApproved : update.status === 'P' ? statusPending : statusRevision} />
                  <div className="text">
                    {update.userDetails.firstName} {update.userDetails.lastName}
                    <span className="date">{moment(update.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </td>
              <td className="spacer">&nbsp;</td>
              {dsgKeys.map(dsgKey => [
              <td>
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
              </td>
              ])}
              <td>
                <div className="value">{nicenum(update.value)}</div>
              </td>
            </tr>
          )
        }
        )}
      </table>
    </Modal>
  )
}

const MobileSlider = ({ children, page }) => {
  if(document.body.clientWidth > 768){
    return children
  }
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(0px)' }))
  useEffect(() => {
    xset({ transform: `translateX(${page * -document.body.clientWidth}px)`, config: { tension: 240, friction: 29 } })
  }, [page])
  return [
    <animated.div style={xprops} className="slider-container">
      {children}
    </animated.div>
  ]
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Enumerator)
