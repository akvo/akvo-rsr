/* global FormData */
import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { Collapse, Button, Checkbox, Tooltip, Icon, Modal, Input, Popconfirm } from 'antd'
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

const Period = ({ setResults, period, measure, treeFilter, statusFilter, increaseCounter, pushUpdate, updateUpdate, deleteUpdate, baseline, userRdr, editPeriod, index: periodIndex, activeKey, indicatorId, indicator, resultId, projectId, toggleSelectedPeriod, selectedPeriods, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('-1') // '0'
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [sending, setSending] = useState(false)
  const updatesListRef = useRef()
  const { t } = useTranslation()
  const sortedUpdates = updates.sort((a, b) => b.id - a.id)
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
    const disaggregations = []
    indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id })
      })
    })
    setUpdates([{
      isNew: true,
      status: 'D',
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
      fileSet: [],
      disaggregations
    }, ...updates])
    setPinned(String(0))
    setEditing(0)
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
  const cancelUpdateUpdate = () => {
    setPinned(-1)
    setEditing(-1)
  }
  const handleUpdateEdit = updated => {
    setUpdates([...updates.slice(0, editing), updated, ...updates.slice(editing + 1)])
  }
  const handleDeleteUpdate = (index) => (e) => {
    api.delete(`/indicator_period_data_framework/${sortedUpdates[index].id}/`)
    deleteUpdate(sortedUpdates[index], period.id, indicatorId, resultId)
    setPinned(-1)
    setEditing(-1)
  }
  const handleValueSubmit = ({ edit = false, status = 'A' }) => {
    setSending(true)
    const { text, narrative, value, reviewNote, fileSet, scoreIndices } = sortedUpdates[editing]
    const payload = {
      period: period.id,
      user: userRdr.id,
      value,
      disaggregations: sortedUpdates[editing].disaggregations.filter(it => it.value).map(it => ({ ...it, dimensionValue: it.typeId })),
      text,
      narrative,
      reviewNote,
      status
    }
    payload.scoreIndices = scoreIndices
    if(indicator.measure === '2'){
      payload.numerator = sortedUpdates[editing].numerator
      payload.denominator = sortedUpdates[editing].denominator
    }
    const handler = ({ data }) => {
      const comments = []
      const doUpdate = (fileSet = []) => {
        const update = { ...data, comments, fileSet }
        const updated = [...sortedUpdates.slice(0, editing), update, ...sortedUpdates.slice(editing + 1)]
        setUpdates(updated)
        setSending(false)
        if(status === 'A') {
          setTimeout(() => {
            setPinned('0')
          }, 300)
          setEditing(-1)
        }
        if(!edit) pushUpdate(update, period.id, indicatorId, resultId)
        else updateUpdate(update, period.id, indicatorId, resultId)
      }
      const resolveUploads = () => {
        if (fileSet.length > 0) {
          const formData = new FormData()
          fileSet.forEach(file => {
            formData.append('files', file)
          })
          axios.post(`${config.baseURL}/indicator_period_data/${data.id}/files/`, formData, axiosConfig)
            .then(({ data }) => {
              doUpdate(data)
            })
            .catch(() => doUpdate())
        }
        else {
          doUpdate()
        }
      }
      if (text) {
        comments.push({ comment: text, createdAt: data.createdAt, userDetails: data.userDetails })
      }
      resolveUploads()
    }
    if(!edit){
      api.post('/indicator_period_data_framework/', payload).then(handler)
    } else {
      api.patch(`/indicator_period_data_framework/${sortedUpdates[editing].id}/`, payload).then(handler)
    }
  }
  const handleLockClick = (e) => {
    e.stopPropagation()
    editPeriod({ ...period, locked: !period.locked })
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
  const handleEditClick = (index) => (e) => {
    e.stopPropagation()
    setEditing(index)
    setPinned(String(index))
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
          {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
          {disaggregations.length === 0 && <Timeline {...{ updates, indicator, period, pinned, updatesListRef, setHover, editPeriod }} />}
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
          {sortedUpdates.map((update, index) =>
            <Panel
              key={index}
              className={classNames({ 'new-update': update.isNew, hidden: editing !== -1 && editing !== index, 'pending-update': update.status === 'P' })}
              header={
                <Aux>
                  <div className="value-container">
                    {indicator.type === 1 && editing !== index && <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{indicator.measure === '2' && <small>%</small>}</div>}
                  </div>
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  <div className="label">{update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}</div>
                  {editing !== index && [
                    <Button type="link" onClick={handleEditClick(index)}>Edit</Button>,
                    <Status {...{ update, pinned, index, handleUpdateStatus, t }} />
                  ]}
                  {(update.isNew && editing === index) && (
                    <div className="btns" onClick={(e) => e.stopPropagation()}>
                      <Button type="primary" size="small" loading={sending} onClick={() => handleValueSubmit({})}>{t('Submit')}</Button>
                      <Button type="ghost" size="small" className="save-draft" onClick={() => handleValueSubmit({ status: 'D' })}>{t('Save draft')}</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>{t('Cancel')}</Button>
                    </div>
                  )}
                  {(!update.isNew && editing === index) && (
                    <div className="btns" onClick={(e) => e.stopPropagation()}>
                      {update.status === 'A' && <Button type="primary" size="small" loading={sending} onClick={() => handleValueSubmit({ edit: true })}>{t('Update')}</Button>}
                      {update.status === 'D' && [<Button loading={sending} type="primary" size="small" onClick={() => handleValueSubmit({ edit: true })}>Submit</Button>, <Button size="small" type="ghost" className="save-draft" onClick={() => handleValueSubmit({ edit: true, status: 'D' })}>Update draft</Button>]}
                      <Button type="link" size="small" onClick={cancelUpdateUpdate}>{t('Cancel')}</Button>
                      <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={handleDeleteUpdate(index)}>
                        <Button icon="delete" type="danger" ghost size="small" />
                      </Popconfirm>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index &&
                <Update {...{ update, period, indicator }} />
              }
              {editing === index && (
                <EditUpdate update={sortedUpdates[editing]} {...{ handleUpdateEdit, period, indicator }} />
              )}
            </Panel>
          )}
        </Collapse>
      </div>
    </Panel>
  )
}

const Status = ({ update, pinned, index, handleUpdateStatus, t }) => {
  if (update.status === 'A') {
    return (
      <div className="status approved">
        <SVGInline svg={approvedSvg} />
        <div className="text">
          {t('Approved')}
          {pinned === String(index) && [
            <Aux><br />{update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}</Aux>
          ]}
        </div>
      </div>
    )
  }
  if(update.status === 'P'){
    return [
      <div className="status pending">
        <SVGInline svg={pendingSvg} />
        <div className="text">{t('Pending')}</div>
      </div>,
      String(pinned) === String(index) &&
      <div className="btns">
        <Button type="primary" size="small" onClick={handleUpdateStatus(update, 'A')}>{t('Approve')}</Button>
        <DeclinePopup update={update} onConfirm={handleUpdateStatus(update, 'R')}>
          <Button type="link" size="small">{t('Decline')}</Button>
        </DeclinePopup>
      </div>
    ]
  }
  if(update.status === 'R') {
    return (
      <div className="status returned">
        <SVGInline svg={revisionSvg} />
        <div className="text">{t('Returned for revision')}</div>
      </div>
    )
  }
  return null
}

const DeclinePopup = ({ children, update, onConfirm }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const handleClick = (e) => {
    e.stopPropagation()
    setComment('')
    setModalVisible(true)
  }
  const handleConfirm = (e) => {
    const finishConfirm = () => {
      onConfirm(e)
      setModalVisible(false)
    }
    if(comment.length > 0){
      setSending(true)
      api.post('/indicator_period_data_comment/', {
        comment,
        data: update.id
      })
      .then(({ data }) => {
        setSending(false)
        finishConfirm()
      })
    } else {
      finishConfirm()
    }
  }
  return [
    <span onClick={e => e.stopPropagation()}>
      <span onClick={handleClick}>{children}</span>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} okText="Return for revision" okType="danger" closable={false} okButtonProps={{ loading: sending }} onOk={handleConfirm}>
        <Input.TextArea placeholder="Optional comment" value={comment} onChange={ev => setComment(ev.target.value)} />
      </Modal>
    </span>
  ]
}

export default Period
