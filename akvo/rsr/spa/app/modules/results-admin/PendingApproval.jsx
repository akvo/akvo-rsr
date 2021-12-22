import React, { useState } from 'react'
import { Row, Col, Card, Typography, Icon, Button, Tag, Modal, Affix, notification } from 'antd'
import SVGInline from 'react-svg-inline'
import ShowMoreText from 'react-show-more-text'
import { useTranslation } from 'react-i18next'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { nicenum } from '../../utils/misc'
import { Disaggregations } from './components'
import api from '../../utils/api'
import editButton from '../../images/edit-button.svg'
import './PendingApproval.scss'

const { Text } = Typography

const CardTitle = ({
  result,
  indicator,
  period
}) => (
  <Row type="flex" justify="start" align="middle" className="card-title">
    <Col lg={8}>
      <Text className="label">RESULT</Text>
      <h4>{result?.title}</h4>
    </Col>
    <Col lg={1}>
      <Icon type="right" />
    </Col>
    <Col lg={13}>
      <Text className="label">INDICATOR</Text>
      <h4>{indicator?.title}</h4>
    </Col>
    <Col span={24}>
      <div className="period-caption">
        {moment(period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
      </div>
    </Col>
  </Row>
)

const CardActions = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Button>Approve</Button>
    <Button>Decline</Button>
    <SVGInline svg={editButton} className="edit-button" />
  </div>
)

const PendingApproval = ({
  projectId,
  results,
  setResults,
  filtering,
  setFiltering,
  handlePendingApproval
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
        if (typeof handlePendingApproval === 'function') {
          handlePendingApproval(_results)
        }
      }
      setLoading(null)
    })
  }

  const handleBulkUpdateStatus = (status) => () => {
    Modal.confirm({
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

  const updates = results
    ?.flatMap((r) => {
      return r?.indicators.map((i) => ({
        ...i,
        result: {
          id: r.id,
          title: r.title
        }
      }))
    })
    ?.flatMap((i) => {
      return i.periods?.map((p) => ({
        ...p,
        indicator: {
          id: i.id,
          title: i.title,
          type: i.type,
          result: i.result
        }
      }))
    })
    ?.flatMap((p) => {
      return p.updates?.map((u) => ({
        ...u,
        indicator: p.indicator,
        result: p.indicator.result,
        period: {
          id: p.id,
          periodStart: p.periodStart,
          periodEnd: p.periodEnd
        }
      }))
    })

  return (
    <>
      <Affix offsetTop={{ top: 10, bottom: 10 }} className="approval-all-container">
        <Row type="flex" justify="space-between" align="middle">
          <Col span={8}>
            <Text>{updates?.length} UPDATES PENDING APPROVAL</Text>
          </Col>
          <Col span={8}>
            <div className="bulk-btns">
              <Button type="primary" size="default" loading={loading === 'A'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('A')}>{t('Approve all')}</Button>
              <Button type="link" size="default" loading={loading === 'R'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('R')}>{t('Decline all')}</Button>
            </div>
          </Col>
        </Row>
      </Affix>
      <Row gutter={[16, 16]}>
        {updates?.map((update, ix) => (
          <Col span={24} key={ix}>
            <Card
              title={<CardTitle {...update} />}
              extra={<CardActions />}
            >
              <Row type="flex" justify="start" gutter={[16, 16]}>
                <Col lg={2} xs={12} className="update-col text-center">
                  <div className="label">
                    {t('value')}
                  </div>
                  <strong className="value">
                    {nicenum(update.value)}
                  </strong>
                </Col>
                <Col lg={8} md={12} xs={12} className="update-col disaggregations">
                  <Disaggregations values={update.disaggregations} />
                </Col>
                {update.indicator.type === 2 && (
                  <Col lg={3} xs={12}>
                    <div className="label">{t('update')}</div>
                    <div className="qualitative-value">
                      <ShowMoreText lines={7}>
                        {update.narrative}
                      </ShowMoreText>
                    </div>
                  </Col>
                )}
                <Col lg={3} md={6} xs={12} className="update-col">
                  <div className="label">{t('submitted')}</div>
                  <div className="value">
                    {moment(update.lastModifiedAt).fromNow()} by<br />
                    {update.userDetails.firstName} {update.userDetails.lastName}
                  </div>
                </Col>
                {update.text &&
                  <Col lg={3} md={6} xs={12} className="update-col">
                    <div className="label">{t('comment')}</div>
                    <div className="qualitative-value">
                      <ShowMoreText lines={2}>{update.text}</ShowMoreText>
                    </div>
                  </Col>
                }
                {update.fileSet?.length > 0 && (
                  <Col lg={2} md={6} xs={12} className="update-col">
                    <div className="label">{t('attachments')}</div>
                    {update.fileSet.map(file => {
                      const parts = file.file.split('/')
                      const filename = parts[parts.length - 1]
                      const nameParts = filename.split('.')
                      return (
                        <a href={file.file}>
                          <Tag>{nameParts[nameParts.length - 1]}</Tag>
                          {filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}
                        </a>
                      )
                    })}
                  </Col>
                )}
                <Col lg={4} md={6} xs={12} className="update-col">
                  <div className="label">{t('internal notes')}</div>
                  <div className="value">{update?.comments[0]?.comment}</div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default PendingApproval
