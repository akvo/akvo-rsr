/* eslint-disable no-shadow */
/* global FormData */
import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { Collapse, Button, Checkbox, Icon, Popconfirm, Row, Col, Divider, Alert } from 'antd'
import classNames from 'classnames'
import { cloneDeep, orderBy } from 'lodash'
import axios from 'axios'
import humps from 'humps'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import api, { config } from '../../utils/api'
import { dateTransform } from '../../utils/misc'
import Update from './update'
import EditUpdate from './edit-update'
import DsgOverview from './dsg-overview'
import { StatusPeriod } from '../../components/StatusPeriod'
import LineChart from '../../components/LineChart'

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

const Period = ({ setResults, period, measure, treeFilter, statusFilter, increaseCounter, pushUpdate, updateUpdate, deleteUpdate, baseline, userRdr, editPeriod, index: periodIndex, activeKey, indicatorId, indicator, resultId, projectId, toggleSelectedPeriod, selectedPeriods, targetsAt, showResultAdmin, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('-1') // '0'
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState({
    publish: false,
    draft: false
  })
  const [error, setError] = useState(null)
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
    setUpdates(updates.slice(1, updates.length))
    setPinned(-1)
    setEditing(-1)
    setLoading({
      draft: false,
      publish: false
    })
  }
  const cancelUpdateUpdate = () => {
    setPinned(-1)
    setEditing(-1)
  }
  const handleUpdateEdit = updated => {
    setUpdates([...updates.slice(0, editing), updated, ...updates.slice(editing + 1)])
  }
  const handleDeleteUpdate = (index) => () => {
    api.delete(`/indicator_period_data_framework/${sortedUpdates[index].id}/`)
    deleteUpdate(sortedUpdates[index], period.id, indicatorId, resultId)
    setPinned(-1)
    setEditing(-1)
  }
  const handleValueSubmit = ({ edit = false, status = 'A', loadingType = 'publish' }) => {
    if (loadingType === 'draft') {
      setLoading({
        publish: false,
        draft: true
      })
    }

    if (loadingType === 'publish') {
      setLoading({
        draft: false,
        publish: true
      })
    }

    const { text, narrative, value, reviewNote, fileSet, scoreIndices } = sortedUpdates[editing]
    const payload = {
      period: period.id,
      user: userRdr.id,
      value,
      disaggregations: sortedUpdates[editing].disaggregations.filter(it => it.value || it.numerator || it.denominator).map(it => ({ ...it, dimensionValue: it.typeId })),
      text,
      narrative,
      reviewNote,
      status
    }
    payload.scoreIndices = scoreIndices
    if (indicator.measure === '2') {
      payload.numerator = sortedUpdates[editing].numerator
      payload.denominator = sortedUpdates[editing].denominator
    }
    const handler = ({ data }) => {
      setEditing(-1)
      const comments = []
      const doUpdate = (fileSet = []) => {
        const update = { ...data, comments, fileSet }
        const updated = [...sortedUpdates.slice(0, editing), update, ...sortedUpdates.slice(editing + 1)]
        setUpdates(updated)
        if (loadingType === 'draft') {
          setLoading({
            publish: false,
            draft: false
          })
        }

        if (loadingType === 'publish') {
          setLoading({
            draft: false,
            publish: false
          })
        }
        if (status === 'A') {
          setTimeout(() => {
            setPinned('0')
          }, 300)
        }
        if (!edit) pushUpdate(update, period.id, indicatorId, resultId)
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

    const indicatorPeriodApi = edit
      ? api.patch(`/indicator_period_data_framework/${sortedUpdates[editing].id}/`, payload)
      : api.post('/indicator_period_data_framework/', payload)

    indicatorPeriodApi.then(handler)
      .catch(({ response }) => {
        const { data: messages } = response
        setLoading({
          publish: false,
          draft: false
        })
        const errorMessage = messages?.value || []
        setError(errorMessage.join('<br/>'))
      })
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
  const handleUpdateStatus = (update, status, reviewNote, e) => {
    e?.stopPropagation()
    e?.preventDefault()
    const index = updates.findIndex(it => it.id === update.id)
    setUpdates([...updates.slice(0, index), { ...update, status }, ...updates.slice(index + 1)])
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status, reviewNote
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
  const canAddUpdate = measure === '2' ? updates.filter(it => !it.isNew).length === 0 : true
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  let data = updates
  ?.filter((u) => u?.status === 'A')
  ?.map(u => ({
    label: u.createdAt ? moment(u.createdAt, 'YYYY-MM-DD').format('DD-MM-YYYY') : null,
    unix: u.createdAt ? moment(u.createdAt, 'YYYY-MM-DD').unix() : null,
    y: u.value
  }))
  data = orderBy(data, ['unix'], ['asc']).map((u, index) => ({ ...u, x: index }))
  return (
    <Panel
      {...props}
      header={
        <div style={{ display: 'flex' }}>
          <Checkbox onClick={handleCheckboxClick} checked={selectedPeriods.findIndex(it => it.id === period.id) !== -1} />
          {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
          <Icon type={period.locked ? 'lock' : 'unlock'} className={`iconbtn ${period.locked ? 'locked' : 'unlocked'}`} onClick={handleLockClick} />
          {(!showResultAdmin && canAddUpdate && !period.locked) &&
            <Button
              shape="round"
              icon="plus"
              type={String(period.id) === activeKey ? 'primary' : 'link'}
              disabled={updates.length > 0 && updates[updates.length - 1].isNew}
              onClick={handleHeaderAddUpdate}
            >
              {t('Report a value')}
            </Button>
          }
          {period.updates.filter(it => it.status === 'P').length > 0 && <div className="pending-updates">{period.updates.filter(it => it.status === 'P').length} pending approval</div>}
        </div>
      }
    >
      {pinned === '0' && indicator?.description?.length > 0 && (
        <Row>
          <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
            <details open>
              <summary>{t('Description')}</summary>
              <p>{mdOutput(mdParse(indicator?.description))}</p>
            </details>
            <Divider />
          </Col>
        </Row>
      )}
      <div style={{ display: 'flex', gap: 16 }}>
        {targetsAt === 'period' && indicator.type === 1 &&
          <div className="graph">
            <div className="sticky">
              {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
              {disaggregations.length === 0 && (
                <LineChart
                  width={480}
                  height={300}
                  data={data}
                  horizontalGuides={5}
                  precision={2}
                  verticalGuides={1}
                  {...period}
                />
              )}
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
                className={classNames({
                  hidden: editing !== -1 && editing !== index,
                  'new-update': update.isNew,
                  'pending-update': update.status === 'P',
                  'draft-update': update?.id && update.status === 'D'
                })}
                header={
                  <Aux>
                    <div className="label">
                      <p style={{ lineHeight: '14px' }}>
                        <small>created at</small><br />
                        <strong>{moment(update.createdAt).format('DD MMM YYYY')}</strong>
                      </p>
                    </div>
                    {update.statusDisplay && (
                      <div className="label">
                        {update.status === 'D' && <span>( {update.statusDisplay} )&nbsp;</span>}
                        {update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}
                      </div>
                    )}
                    <div className="value-container">
                      {
                        indicator.type === 1 && editing !== index &&
                        <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>
                          {String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {indicator.measure === '2' && <small>%</small>}
                        </div>
                      }
                    </div>
                    {!showResultAdmin && editing !== index && [
                      <Button type="link" onClick={handleEditClick(index)}>Edit</Button>,
                      <StatusPeriod {...{ update, pinned, index, handleUpdateStatus, t }} />
                    ]}
                    {(update.isNew && editing === index) && (
                      <div className="btns" onClick={(e) => e.stopPropagation()}>
                        <Button type="primary" size="small" loading={loading.publish} onClick={() => handleValueSubmit({})}>{t('Submit')}</Button>
                        <Button type="ghost" size="small" loading={loading.draft} className="save-draft" onClick={() => handleValueSubmit({ status: 'D', loadingType: 'draft' })}>{t('Save draft')}</Button>
                        <Button type="link" size="small" onClick={cancelNewUpdate}>{t('Cancel')}</Button>
                      </div>
                    )}
                    {(!update.isNew && editing === index) && (
                      <div className="btns" onClick={(e) => e.stopPropagation()}>
                        {update.status === 'A' && <Button type="primary" size="small" loading={loading.publish} onClick={() => handleValueSubmit({ edit: true })}>{t('Update')}</Button>}
                        {update.status === 'D' && [<Button loading={loading.publish} type="primary" size="small" onClick={() => handleValueSubmit({ edit: true })}>{t('Submit')}</Button>, <Button size="small" type="ghost" className="save-draft" loading={loading.draft} onClick={() => handleValueSubmit({ edit: true, status: 'D', loadingType: 'draft' })}>{t('Update draft')}</Button>]}
                        <Button type="link" size="small" onClick={cancelUpdateUpdate}>{t('Cancel')}</Button>
                        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={handleDeleteUpdate(index)}>
                          <Button icon="delete" type="danger" ghost size="small" />
                        </Popconfirm>
                      </div>
                    )}
                  </Aux>
                }
              >
                {error && (
                  <Alert
                    message="Error"
                    // eslint-disable-next-line react/no-danger
                    description={(<span dangerouslySetInnerHTML={{ __html: error }} />)}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                  />
                )}
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
      </div>
    </Panel>
  )
}

export default Period
