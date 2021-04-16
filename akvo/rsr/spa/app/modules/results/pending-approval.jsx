/* global window */
import { Button, Icon, notification, Tag } from 'antd'
import React, { useState } from 'react'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import ShowMoreText from 'react-show-more-text'
import { useTranslation } from 'react-i18next'
import './pending-approval.scss'
import { nicenum } from '../../utils/misc'
import api from '../../utils/api'
import { DeclinePopup } from './period'

const PendingApproval = ({ results, setResults, projectId }) => {
  const { t } = useTranslation()
  const [updating, setUpdating] = useState([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const pendingUpdates = []
  results.forEach(result => {
    result.indicators.forEach(indicator => {
      indicator.periods.forEach(period => {
        period.updates.forEach(update => {
          if (update.status === 'P') {
            pendingUpdates.push({
              ...update,
              indicator: { id: indicator.id, title: indicator.title, type: indicator.type },
              period: { id: period.id, periodStart: period.periodStart, periodEnd: period.periodEnd },
              result: { id: result.id, title: result.title },
            })
          }
        })
      })
    })
  })
  const handleUpdateStatus = (update, status, reviewNote) => {
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
      if(_update){
        _update.status = status
        setResults(_results)
        setUpdating((updating) => {
          return updating.filter(it => it.id !== update.id)
        })
      }
    })
  }
  const handleBulkUpdateStatus = (status) => () => {
    setBulkUpdating(true)
    api.post(`/set-updates-status/${projectId}/`, {
      updates: pendingUpdates.map(it => it.id),
      status
    })
    .then(() => {
      setBulkUpdating(false)
      setResults((results) => {
        const _results = cloneDeep(results)
        pendingUpdates.forEach(update => {
          const _update = _results.find(it => it.id === update.result.id)
            ?.indicators.find(it => it.id === update.indicator.id)
            ?.periods.find(it => it.id === update.period.id)
            ?.updates.find(it => it.id === update.id)
          if (_update) {
            _update.status = status
          }
        })
        return _results
      })
      notification.open({ message: status === 'A' ? t('All updates approved') : t('All updates returned for revision') })
      window.scroll({ top: 0, behavior: 'smooth' })
    })
    .catch(() => {
      setBulkUpdating(false)
    })
  }
  return (
    <div className="pending-approval-grid">
      {pendingUpdates.map((update, index) => {
        const isUpdating = updating.indexOf(update.id) !== -1
        return [
          (index > 0 && pendingUpdates[index - 1].indicator.id === update.indicator.id) ? '' : (
            <ul>
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
          ),
          (index > 0 && pendingUpdates[index - 1].period.id === update.period.id) ? '' : (
            <div className="period-caption">{moment(update.period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(update.period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>
          ),
          <div className="row">
            <ul>
              {update.indicator.type === 1 &&
                <li>
                  <div className="label">{t('value')}</div>
                  <strong className="value">{nicenum(update.value)}</strong>
                </li>
              }
              <Disaggregations values={update.disaggregations} />
              {update.indicator.type === 2 &&
                <li>
                  <div className="label">{t('update')}</div>
                  <div className="qualitative-value">
                    <ShowMoreText lines={7}>{update.narrative}</ShowMoreText>
                  </div>
                </li>
              }
              <CondWrap wrap={update.indicator.type === 2}>
                <li>
                  <div className="label">{t('submitted')}</div>
                  <div className="value">{moment(update.createdAt).fromNow()} by {update.userDetails.firstName} {update.userDetails.lastName}</div>
                </li>
                {update.text &&
                <li>
                  <div className="label">{t('comment')}</div>
                  <div className="qualitative-value">
                    <ShowMoreText lines={2}>{update.text}</ShowMoreText>
                  </div>
                </li>
                }
                {update.fileSet?.length > 0 &&
                  <li className="attachments">
                    <div className="label">{t('attachments')}</div>
                    {update.fileSet.map(file => {
                      const parts = file.file.split('/')
                      const filename = parts[parts.length - 1]
                      const nameParts = filename.split('.')
                      return <a href={file.file}><Tag>{nameParts[nameParts.length - 1]}</Tag>{filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}</a>
                    })}
                  </li>
                }
              </CondWrap>
            </ul>
            <div className="btns">
              <Button type="primary" loading={isUpdating} disabled={isUpdating} onClick={() => handleUpdateStatus(update, 'A')}>{t('Approve')}</Button>
              <DeclinePopup onConfirm={(reviewNote) => handleUpdateStatus(update, 'R', reviewNote)}>
                <Button type="link" disabled={isUpdating}>{t('Decline')}</Button>
              </DeclinePopup>
            </div>
          </div>
        ]
      })}
      {pendingUpdates.length > 1 &&
      <div className="bulk-btns">
        <Button type="primary" size="large" loading={bulkUpdating} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('A')}>{t('Approve all')}</Button>
        <Button type="link" size="large" disabled={bulkUpdating} onClick={handleBulkUpdateStatus('R')}>{t('Decline all')}</Button>
      </div>
      }
    </div>
  )
}

const CondWrap = ({ wrap, children }) => {
  if(wrap){
    return <li><ul>{children}</ul></li>
  }
  return children
}

const Disaggregations = ({ values }) => {
  if(!values || values?.length === 0) return null
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
