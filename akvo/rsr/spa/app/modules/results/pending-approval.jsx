/* eslint-disable no-shadow */
import { Affix, Button, Icon, notification, Tag, Typography, Modal, Collapse } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import ShowMoreText from 'react-show-more-text'
import { useTranslation } from 'react-i18next'
import './pending-approval.scss'
import { nicenum } from '../../utils/misc'
import api from '../../utils/api'
import { DeclinePopup } from '../../components/DeclinePopup'
import ReportedEdit from '../results-admin/components/ReportedEdit'

const { Paragraph } = Typography
const { confirm } = Modal

const PendingApproval = ({
  editing,
  results,
  setResults,
  projectId,
  filtering,
  setFiltering,
  editPeriod,
  deleteFile,
  handleOnEdit,
  setPendingApproval,
  calculatePendingAmount,
  ...props
}) => {
  const { t } = useTranslation()
  const [updating, setUpdating] = useState([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingUpdates, setPendingUpdates] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const handleUpdateStatus = (update, status, reviewNote) => {
    setLoading(status)
    setUpdating((updating) => {
      return [...updating, update.id]
    })
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status, reviewNote
    }).then(() => {
      const _results = cloneDeep(results)
      const _update = _results.find(it => it.id === update.result.id)
        ?.indicators.find(it => it.id === update.indicator.id)
        ?.periods.find(it => it.id === update.period.id)
        ?.updates.find(it => it.id === update.id)
      if (_update) {
        _update.status = status
        setResults(_results)
        setUpdating(updating => {
          return updating.filter(it => it.id !== update.id)
        })
        if (typeof props?.handlePendingApproval === 'function') {
          props.handlePendingApproval(_results)
        }
      }
      setLoading(null)
    })
  }
  const handleBulkUpdateStatus = (status) => () => {
    confirm({
      title: status === 'A' ? 'Are you sure to approve all updates?' : 'Are you sure to decline all updates?',
      content: 'When the OK button is clicked, the changes cannot be reversed',
      onOk() {
        setLoading(status)
        setBulkUpdating(true)
        api.post(`/set-updates-status/${projectId}/`, {
          updates: pendingUpdates.map(it => it.id),
          status
        })
          .then(({ data }) => {
            const _results = results.map((r) => {
              return ({
                ...r,
                indicators: r.indicators.map((i) => {
                  return ({
                    ...i,
                    periods: i.periods.map((p) => {
                      return ({
                        ...p,
                        updates: p.updates.map((u) => ({ ...u, status }))
                      })
                    })
                  })
                })
              })
            })
            setResults(_results)
            if (data?.success) {
              notification.open({ message: status === 'A' ? t('All updates approved') : t('All updates returned for revision') })
            }
            setBulkUpdating(false)
            setLoading(null)
          })
          .catch(() => {
            setPendingUpdates([])
            setBulkUpdating(false)
            setLoading(null)
          })
      }
    })
  }
  const handleSetPendingUpdates = (items) => {
    const pu = items
      ?.map((r) => ({
        ...r,
        indicators: r.indicators.map((i) => ({ ...i, result: r }))
      }))
      ?.flatMap((r) => r.indicators)
      ?.map((i) => ({
        ...i,
        periods: i.periods.map((p) => ({ ...p, indicator: i }))
      }))
      ?.flatMap((i) => i.periods)
      ?.map((p) => ({
        ...p,
        updates: p.updates.map((u) => ({
          ...u,
          indicator: p.indicator,
          period: p,
          result: p.indicator.result
        }))
      }))
      ?.flatMap((p) => p.updates)
      ?.filter((u) => u.status === 'P')
    setPendingUpdates(pu)
  }
  const handleOnUpdate = (update) => {
    const items = results.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => ({
        ...i,
        periods: i.periods.map((p) => ({
          ...p,
          updates: p.updates.map((u) => u.id === update.id ? update : u)
        }))
      }))
    }))
    handleSetPendingUpdates(items)
    setPendingApproval(items)
  }
  const deletePendingUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update if you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        const items = results.map((pa) => ({
          ...pa,
          indicators: pa.indicators.map((pi) => ({
            ...pi,
            periods: pi.periods.map((pd) => ({
              ...pd,
              updates: pd.updates.filter((u) => u.id !== update.id)
            }))
          }))
        }))
        calculatePendingAmount(items)
        handleSetPendingUpdates(items)
        setPendingApproval(items)
        setActiveKey(null)
      }
    })
  }
  useEffect(() => {
    if ((loading && !bulkUpdating) || (!loading && filtering)) {
      handleSetPendingUpdates(results)
      if (updating.length === 0) setLoading(null)
      if (filtering) setFiltering(false)
    }
  }, [results, loading, bulkUpdating, filtering])
  return (
    <div className="pending-approval-grid">
      {pendingUpdates.length > 0 && (
        <Affix offsetTop={{ top: 10, bottom: 10 }} className="approval-all-container">
          <div style={{ display: 'flex' }}>
            <Paragraph>{pendingUpdates?.length} UPDATES PENDING APPROVAL</Paragraph>
            <div className="bulk-btns">
              <Button type="primary" size="default" loading={loading === 'A'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('A')}>{t('Approve all')}</Button>
              <Button type="link" size="default" loading={loading === 'R'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('R')}>{t('Decline all')}</Button>
            </div>
          </div>
        </Affix>
      )}
      {pendingUpdates?.map((update, index) => {
        const isUpdating = updating.indexOf(update.id) !== -1
        return (
          <div key={index} style={{ marginBottom: 10 }}>
            {
              (index > 0 && pendingUpdates[index - 1].indicator.id === update.indicator.id) && (
                <ul className="item">
                  <li>
                    <div className="label">result</div>
                    <h4>{update.result.title}</h4>
                  </li>
                  <Icon type="right" />
                  <li>
                    <div className="label">indicator</div>
                    <h4>{update.indicator.title}</h4>
                  </li>
                </ul>
              )
            }
            {
              (index > 0 && pendingUpdates[index - 1].period.id === update.period.id) && (
                <div className="period-caption">{moment(update.period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(update.period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>
              )
            }
            <div className="row">
              <ul className="item">
                {
                  update.indicator.type === 1 && (
                    <li>
                      <div className="label">{t('value')}</div>
                      <strong className="value">{nicenum(update.value)}</strong>
                    </li>
                  )
                }
                <Disaggregations values={update.disaggregations} />
                {
                  update.indicator.type === 2 && (
                    <li>
                      <div className="label">{t('update')}</div>
                      <div className="qualitative-value">
                        <ShowMoreText lines={7}>{update.narrative}</ShowMoreText>
                      </div>
                    </li>
                  )
                }
                <CondWrap wrap={update.indicator.type === 2}>
                  <li>
                    <div className="label">{t('submitted')}</div>
                    <div className="value">{moment(update.lastModifiedAt).fromNow()} by {update.userDetails.firstName} {update.userDetails.lastName}</div>
                  </li>
                  {update.text &&
                    <li>
                      <div className="label">{t('comment')}</div>
                      <div className="qualitative-value">
                        <ShowMoreText lines={2}>{update.text}</ShowMoreText>
                      </div>
                    </li>
                  }
                  {
                    update.fileSet?.length > 0 && (
                      <li className="attachments">
                        <div className="label">{t('attachments')}</div>
                        {update.fileSet.map(file => {
                          const parts = file.file.split('/')
                          const filename = parts[parts.length - 1]
                          const nameParts = filename.split('.')
                          return <a href={file.file}><Tag>{nameParts[nameParts.length - 1]}</Tag>{filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}</a>
                        })}
                      </li>
                    )
                  }
                </CondWrap>
                <CondWrap wrap>
                  <div className="label">{t('internal notes')}</div>
                  <div className="value">{update?.comments[0]?.comment}</div>
                </CondWrap>
              </ul>
              {!activeKey && (
                <div className="btns">
                  <Button type="primary" loading={loading === 'A'} disabled={isUpdating} onClick={() => handleUpdateStatus(update, 'A')}>{t('Approve')}</Button>
                  <DeclinePopup onConfirm={(reviewNote) => handleUpdateStatus(update, 'R', reviewNote)}>
                    <Button type="link" loading={loading === 'R'} disabled={isUpdating}>{t('Decline')}</Button>
                  </DeclinePopup>
                  {
                    handleOnEdit && (
                      <Button
                        type="ghost"
                        onClick={() => {
                          handleOnEdit(update)
                          setActiveKey(update.id)
                        }}
                      >
                        {t('Edit')}
                      </Button>
                    )
                  }
                </div>
              )}
            </div>
            <Collapse activeKey={activeKey} bordered={false} accordion>
              <Collapse.Panel key={update.id} showArrow={false}>
                <ReportedEdit
                  {...{
                    editing,
                    editPeriod,
                    deletePendingUpdate,
                    deleteFile,
                    setActiveKey,
                    handleOnUpdate
                  }}
                />
              </Collapse.Panel>
            </Collapse>
          </div>
        )
      })}
      {pendingUpdates.length === 0 && (
        <div className="empty">
          {t('No updates pending approval')}
        </div>
      )}
    </div>
  )
}

const CondWrap = ({ wrap, children }) => {
  if (wrap) {
    return <li><ul className="item">{children}</ul></li>
  }
  return children
}

const Disaggregations = ({ values }) => {
  if (!values || values?.length === 0) return null
  const dsgGroups = {}
  values.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
  })
  return Object.keys(dsgGroups).map(dsgKey => {
    let maxValue = 0
    dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value; if (it.target > maxValue) maxValue = it.target })
    return (
      <li>
        <div className="label">{dsgKey}</div>
        <div className="dsg-bar">
          {dsgGroups[dsgKey].map(item => (
            <div className="dsg-item color" style={{ flex: item.value }} />
          ))}
        </div>
        <div className="legend">
          {dsgGroups[dsgKey].filter(it => it.value > 0).map(item => (
            <div className="item">
              <b>{nicenum(item.value)}</b> <span>{item.type}</span>
            </div>
          ))}
        </div>
      </li>
    )
  })
}

export default PendingApproval
