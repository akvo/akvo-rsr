/* global FormData */
import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { Collapse, Button, Checkbox, Tooltip, Icon } from 'antd'
import classNames from 'classnames'
import {cloneDeep} from 'lodash'
import axios from 'axios'
import humps from 'humps'
import { useTranslation } from 'react-i18next'
import api, { config } from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'
import pendingSvg from '../../images/status-pending.svg'
import revisionSvg from '../../images/status-revision.svg'
import Timeline from './timeline'
import { dateTransform } from '../../utils/misc'
import Update from './update'
import EditUpdate from './edit-update'
import DsgOverview from './dsg-overview'

const { Panel } = Collapse
const Aux = node => node.children
const axiosConfig = {
  headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ]
}

const Period = ({ setResults, period, measure, treeFilter, statusFilter, increaseCounter, pushUpdate, baseline, userRdr, editPeriod, index: periodIndex, activeKey, indicatorId, indicator, resultId, projectId, toggleSelectedPeriod, selectedPeriods, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('-1') // '0'
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [sending, setSending] = useState(false)
  const updatesListRef = useRef()
  const { t } = useTranslation()
  useEffect(() => {
    const _updates = period.updates
    .filter(it => statusFilter !== 'approved' ? it.status !== 'R' : it.status === 'A')
    .sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }).sort((a, b) => {
      if (a.status.code === 'A' && b.status.code !== 'A') return -1
      return 0
    })
    setUpdates(_updates)
    if (treeFilter.updateIds.length > 0) {
      const updateIndex = _updates.findIndex(it => treeFilter.updateIds.indexOf(it.id) !== -1)
      if (updateIndex !== -1) {
        setPinned(updateIndex)
      }
    }
  }, [period, treeFilter])
  const handleAccordionChange = (key) => {
    setPinned(key)
  }
  const addUpdate = () => {
    setUpdates([...updates, {
      isNew: true,
      status: 'D',
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
      fileSet: [],
      disaggregations: period.disaggregationTargets.map(({ category, type, typeId }) => ({ category, type, typeId }))
    }])
    setPinned(String(updates.length))
    setEditing(updates.length)
  }
  const handleHeaderAddUpdate = (e) => {
    if (props.isActive) { e.stopPropagation() }
    addUpdate()
  }
  const cancelNewUpdate = () => {
    setUpdates(updates.slice(0, updates.length - 1))
    setPinned(-1)
    setEditing(-1)
  }
  const handleUpdateEdit = updated => {
    setUpdates([...updates.slice(0, editing), updated, ...updates.slice(editing + 1)])
  }
  const handleValueSubmit = () => {
    setSending(true)
    const { text, value, note, fileSet } = updates[editing]
    const payload = {
      period: period.id,
      user: userRdr.id,
      value,
      disaggregations: updates[editing].disaggregations.filter(it => it.value).map(it => ({ ...it, dimensionValue: it.typeId })),
      text,
      status: 'A'
    }
    if(indicator.measure === '2'){
      payload.numerator = updates[editing].numerator
      payload.denominator = updates[editing].denominator
    }
    api.post('/indicator_period_data_framework/', payload)
      .then(({ data }) => {
        const comments = []
        const update = (fileSet = []) => {
          const newUpdate = { ...data, comments, fileSet }
          setUpdates([...updates.slice(0, editing), newUpdate, ...updates.slice(editing + 1)])
          setEditing(-1)
          setSending(false)
          setTimeout(() => {
            setPinned(0)
          }, 300)
          pushUpdate(newUpdate, period.id, indicatorId, resultId)
        }
        const resolveUploads = () => {
          if (fileSet.length > 0) {
            const formData = new FormData()
            fileSet.forEach(file => {
              formData.append('files', file)
            })
            axios.post(`${config.baseURL}/indicator_period_data/${data.id}/files/`, formData, axiosConfig)
              .then(({ data }) => {
                update(data)
              })
              .catch(() => {
                setSending(false)
                setEditing(-1)
                update()
              })
          }
          else {
            update()
          }
        }
        if (text) {
          comments.push({ comment: text, createdAt: data.createdAt, userDetails: data.userDetails })
        }
        if (note !== '' && note != null) {
          api.post('/indicator_period_data_comment/', {
            data: data.id,
            comment: note
          }).then(d => {
            comments.push(d.data)
            resolveUploads()
          })
        } else {
          resolveUploads()
        }
      })
  }
  const handleLockClick = (e) => {
    e.stopPropagation()
    editPeriod({ ...period, locked: !period.locked }, periodIndex)
    api.post(`/set-periods-locked/${projectId}/`, {
      periods: [period.id],
      locked: !period.locked
    })
  }
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    toggleSelectedPeriod(period, indicatorId)
  }
  const handleUpdateStatus = (update, status) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    const index = updates.findIndex(it => it.id === update.id)
    setUpdates([...updates.slice(0, index), { ...update, status }, ...updates.slice(index + 1)])
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status
    })
    setResults((results) => {
      const _results = cloneDeep(results)
      _results.find(it => it.id === resultId)
        .indicators.find(it => it.id === indicatorId)
        .periods.find(it => it.id === period.id)
        .updates.find(it => it.id === update.id).status = status
      return _results
    })
  }
  const disaggregations = [...updates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
  const canAddUpdate = measure === '2' /* 2 == percentage */ ? updates.filter(it => !it.isNew).length === 0 : true
  return (
    <Panel
      {...props}
      header={
        <div style={{ display: 'flex' }}>
          <Checkbox onClick={handleCheckboxClick} checked={selectedPeriods.findIndex(it => it.id === period.id) !== -1} />
          {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
          <Icon type={period.locked ? 'lock' : 'unlock'} className={`iconbtn ${period.locked ? 'locked' : 'unlocked'}`} onClick={handleLockClick} />
          {(canAddUpdate && !period.locked) && <Button shape="round" icon="plus" type={String(period.id) === activeKey ? 'primary' : 'link'} disabled={updates.length > 0 && updates[updates.length - 1].isNew} onClick={handleHeaderAddUpdate}>{t('Report a value')}</Button>}
          {!canAddUpdate && <Button disabled shape="round" icon="check">{t('Already reported')}</Button>}
          {period.updates.filter(it => it.status === 'P').length > 0 && <div className="pending-updates">{period.updates.filter(it => it.status === 'P').length} pending approval</div>}
        </div>
      }
    >
      {indicator.type === 1 &&
      <div className="graph">
        <div className="sticky">
          {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, periodIndex, editPeriod, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
          {disaggregations.length === 0 && <Timeline {...{ updates, indicator, period, pinned, updatesListRef, setHover, editPeriod, periodIndex }} />}
          {baseline.value &&
            <div className="baseline-values">
              <div className="baseline-value value">
                <div className="label">{t('baseline value')}</div>
                <div className="value">{baseline.value}{indicator.measure === '2' && <small>%</small>}</div>
              </div>
              <div className="baseline-value year">
                <div className="label">{t('baseline year')}</div>
                <div className="value">{baseline.year}</div>
              </div>
            </div>
          }
        </div>
      </div>
      }
      <div className={classNames('updates', { qualitative: indicator.type === 2 })} ref={(ref) => { updatesListRef.current = ref }}>
        <Collapse accordion activeKey={pinned} defaultActiveKey="0" onChange={handleAccordionChange} className="updates-list">
          {[...updates].sort((a, b) => b.id - a.id).map((update, index) =>
            <Panel
              key={index}
              className={classNames({ 'new-update': update.isNew, hidden: editing !== -1 && editing !== index })}
              header={
                <Aux>
                  <div className="value-container">
                    {indicator.type === 1 && editing !== index && <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{indicator.measure === '2' && <small>%</small>}</div>}
                  </div>
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  <div className="label">{update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}</div>
                  {update.status === 'A' && (
                    <div className="status approved">
                      <SVGInline svg={approvedSvg} />
                      <div className="text">
                        {t('Approved')}
                        {pinned === String(index) && [
                          <Aux><br />{update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}</Aux>
                        ]}
                      </div>
                    </div>
                  )}
                  {update.status === 'P' && [
                    <div className="status pending">
                      <SVGInline svg={pendingSvg} />
                      <div className="text">{t('Pending')}</div>
                    </div>,
                    String(pinned) === String(index) &&
                    <div className="btns">
                      <Button type="primary" size="small" onClick={handleUpdateStatus(update, 'A')}>{t('Approve')}</Button>
                      <Tooltip title="Return for revision">
                        <Button type="link" size="small" onClick={handleUpdateStatus(update, 'R')}>{t('Decline')}</Button>
                      </Tooltip>
                    </div>
                  ]}
                  {update.status === 'R' && [
                    <div className="status returned">
                      <SVGInline svg={revisionSvg} />
                      <div className="text">{t('Returned for revision')}</div>
                    </div>
                  ]}
                  {(update.isNew && editing === index) && (
                    <div className="btns">
                      <Button type="primary" size="small" loading={sending} onClick={handleValueSubmit}>{t('Submit')}</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>{t('Cancel')}</Button>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index &&
                <Update {...{ update, period, indicator }} />
              }
              {editing === index && (
                <EditUpdate update={updates[editing]} {...{ handleUpdateEdit, period, indicator }} />
              )}
            </Panel>
          )}
        </Collapse>
      </div>
    </Panel>
  )
}

export default Period
