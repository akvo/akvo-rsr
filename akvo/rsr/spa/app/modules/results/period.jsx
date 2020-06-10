import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { Collapse, Button, Checkbox, Tooltip } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'
import pendingSvg from '../../images/status-pending.svg'
import Timeline from './timeline'
import Update from './update'
import EditUpdate from './edit-update'
import DsgOverview from './dsg-overview'

const { Panel } = Collapse
const Aux = node => node.children

const Period = ({ period, measure, baseline, userRdr, editPeriod, index: periodIndex, indicatorId, toggleSelectedPeriod, selectedPeriods, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('-1') // '0'
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [sending, setSending] = useState(false)
  const updatesListRef = useRef()
  useEffect(() => {
    if(period.id){
      // api.get(`/indicator_period_data_framework/${period.id}/`)
    }
  }, [])
  useEffect(() => {
    console.log(period)
    setUpdates(period.updates.filter(it => it.status && it.status.code !== 'R').sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }).sort((a, b) => {
      if (a.status.code === 'A' && b.status.code !== 'A') return -1
      return 0
    }))
  }, [period])
  const handleAccordionChange = (key) => {
    setPinned(key)
  }
  const addUpdate = () => {
    setUpdates([...updates, {
      isNew: true,
      status: { code: 'D' },
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
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
  }
  const handleUpdateEdit = updated => {
    setUpdates([...updates.slice(0, editing), updated, ...updates.slice(editing + 1)])
  }
  const handleValueSubmit = () => {
    setSending(true)
    const { text, value } = updates[editing]
    api.post('/indicator_period_data_framework/', {
      period: period.id,
      user: userRdr.id,
      value,
      disaggregations: updates[editing].disaggregations.filter(it => it.value).map(it => ({ ...it, dimensionValue: it.typeId })),
      text,
      status: 'A'
    })
      .then(() => {
        setUpdates([...updates.slice(0, editing), { ...updates[editing], isNew: false, status: { code: 'A' } }, ...updates.slice(editing + 1)])
        setEditing(-1)
        setSending(false)
      })
  }
  const handleLockClick = (e) => {
    e.stopPropagation()
    editPeriod({ ...period, locked: !period.locked }, periodIndex)
  }
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    toggleSelectedPeriod(period, indicatorId)
  }
  const handleUpdateStatus = (update, status) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    const index = updates.findIndex(it => it.id === update.id)
    setUpdates([...updates.slice(0, index), { ...update, status: { code: status } }, ...updates.slice(index + 1)])
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status
    })
  }
  // const disaggregations = [...period.disaggregations, ...updates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status.code }))], [])]
  const disaggregations = period.disaggregations
  const canAddUpdate = measure === '2' /* 2 == percentage */ ? updates.length === 0 : true
  return (
    <Panel
      {...props}
      header={
        <div>
          <Checkbox onClick={handleCheckboxClick} checked={selectedPeriods.findIndex(it => it.id === period.id) !== -1} />
          {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
          <Button shape="round" className={period.locked ? 'locked' : 'unlocked'} icon={period.locked ? 'lock' : 'unlock'} onClick={handleLockClick} />
          {!(updates.length > 0 && updates[updates.length - 1].isNew) && (canAddUpdate && !period.locked) && <Button shape="round" icon="plus" type="primary" onClick={handleHeaderAddUpdate}>Add an update</Button>}
          {!canAddUpdate && <Button disabled shape="round" icon="check">Already reported</Button>}
        </div>
      }
    >
      <div className="graph">
        <div className="sticky">
          {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
          {disaggregations.length === 0 && <Timeline {...{ updates, period, pinned, updatesListRef, setHover }} />}
          {baseline.value &&
            <div className="baseline-values">
              <div className="baseline-value value">
                <div className="label">baseline value</div>
                <div className="value">{baseline.value}</div>
              </div>
              <div className="baseline-value year">
                <div className="label">baseline year</div>
                <div className="value">{baseline.year}</div>
              </div>
            </div>
          }
        </div>
      </div>
      <div className="updates" ref={(ref) => { updatesListRef.current = ref }}>
        <Collapse accordion activeKey={pinned} defaultActiveKey="0" onChange={handleAccordionChange} className="updates-list">
          {updates.map((update, index) =>
            <Panel
              key={index}
              className={update.isNew && 'new-update'}
              header={
                <Aux>
                  {editing !== index && <div className={classNames('value', { hovered: hover === index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  {pinned === String(index) && [
                    <div className="label">{update.userDetails && update.userDetails.name}</div>
                  ]}
                  {update.status.code === 'A' && (
                    <div className="status approved">
                      <SVGInline svg={approvedSvg} />
                      <div className="text">
                        Approved
                        {pinned === String(index) && [
                          <Aux><br />{update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}</Aux>
                        ]}
                      </div>
                    </div>
                  )}
                  {update.status.code === 'P' && [
                    <div className="status pending">
                      <SVGInline svg={pendingSvg} />
                      {pinned !== String(index) && <div className="text">Pending</div>}
                    </div>,
                    pinned === String(index) &&
                    <div className="btns">
                      <Button type="primary" size="small" onClick={handleUpdateStatus(update, 'A')}>Approve</Button>
                      <Tooltip title="Return for revision">
                        <Button type="link" size="small" onClick={handleUpdateStatus(update, 'R')}>Decline</Button>
                      </Tooltip>
                    </div>
                  ]}
                  {(update.isNew && editing === index) && (
                    <div className="btns">
                      <Button type="primary" size="small" loading={sending} onClick={handleValueSubmit}>Submit</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>Cancel</Button>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index &&
                <Update {...{ update, period }} />
              }
              {editing === index && (
                <EditUpdate update={updates[editing]} {...{ handleUpdateEdit, period }} />
              )}
            </Panel>
          )}
        </Collapse>
        {!(updates.length > 0 && updates[updates.length - 1].isNew) && (canAddUpdate && !period.locked) && <Button type="dashed" icon="plus" block size="large" onClick={addUpdate}>Add an update</Button>}
      </div>
    </Panel>
  )
}

export default Period
