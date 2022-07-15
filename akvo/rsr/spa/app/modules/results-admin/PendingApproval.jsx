import React, { useState, useRef } from 'react'
import {
  Row,
  Col,
  Card,
  Typography,
  Icon,
  Button,
  Modal,
  Affix,
  Collapse,
  notification
} from 'antd'
import SVGInline from 'react-svg-inline'
import ShowMoreText from 'react-show-more-text'
import { useTranslation } from 'react-i18next'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import { DeclinePopup } from '../../components'
import ReportedEdit from './components/ReportedEdit'
import { nicenum } from '../../utils/misc'
import { Disaggregations } from './components'
import editButton from '../../images/edit-button.svg'
import api from '../../utils/api'
import './PendingApproval.scss'
import Highlighted from '../../components/Highlighted'

const { Text } = Typography

const CardTitle = ({
  keyword,
  result,
  indicator,
  period
}) => (
  <Row type="flex" justify="start" align="middle" className="card-title">
    <Col span={24}>
      <div className="title-container">
        <div>
          <Text className="label">RESULT</Text>
          <h4>{result?.title}</h4>
        </div>
        <div>
          <Text className="label">INDICATOR</Text>
          <h4>&#187;&nbsp;<Highlighted text={indicator?.title} highlight={keyword} /></h4>
        </div>
      </div>
    </Col>
    <Col span={24}>
      <div className="period-caption">
        {moment(period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
      </div>
    </Col>
  </Row>
)

const CardActions = ({
  t,
  update,
  loading,
  activeKey,
  isUpdating,
  handleCancel,
  handleOnEdit,
  handleUpdateStatus
}) => (
  <div style={{ display: 'flex', gap: 10, justifyContent: 'end', alignItems: 'center' }}>
    {
      activeKey === update?.id
        ? (
          <div style={{ paddingRight: 10 }}>
            <Button onClick={handleCancel} icon="close" />
          </div>
        )
        : (
          <>
            <Button loading={loading === `${update?.id}-A`} disabled={isUpdating} onClick={() => handleUpdateStatus(update, 'A')}>
              {t('Approve')}
            </Button>
            <DeclinePopup onConfirm={(reviewNote) => handleUpdateStatus(update, 'R', reviewNote)}>
              <Button loading={loading === `${update?.id}-R`} disabled={isUpdating}>
                {t('Decline')}
              </Button>
            </DeclinePopup>
            <Button
              type="link"
              onClick={() => handleOnEdit(update)}
            >
              <SVGInline svg={editButton} className="edit-button" />
            </Button>
          </>
        )
    }
  </div>
)

const PendingApproval = ({
  project,
  keyword,
  results,
  editing,
  editPeriod,
  handleOnEdit,
  setPendingApproval,
  calculatePendingAmount,
  handlePendingApproval
}) => {
  const { t } = useTranslation()
  const [updating, setUpdating] = useState([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeKey, setActiveKey] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const formRef = useRef()

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
    ?.filter(item => item.status === 'P')

  const handleUpdateStatus = (update, status, reviewNote) => {
    setLoading(`${update.id}-${status}`)
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
        handlePendingApproval(_results)
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
        setLoading(`${status}all`)
        setBulkUpdating(true)
        api.post(`/set-updates-status/${project.id}/`, {
          updates: updates.map(it => it?.id),
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
            handlePendingApproval(_results)
            if (data?.success) {
              notification.open({ message: status === 'A' ? t('All updates approved') : t('All updates returned for revision') })
            }
            setBulkUpdating(false)
            setLoading(null)
          })
          .catch(() => {
            setBulkUpdating(false)
            setLoading(null)
          })
      }
    })
  }

  const handleOnUpdate = (update) => {
    if (deletion.length) {
      update = {
        ...update,
        fileSet: update.fileSet.filter((f) => !deletion?.includes(f.id))
      }
      deletion.forEach((uid) => {
        api.delete(`/indicator_period_data/${update?.id}/files/${uid}/`)
      })
      setDeletion([])
    }
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
    setPendingApproval(items)
  }

  const deletePendingUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update when you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        const items = results.map((pa) => ({
          ...pa,
          indicators: pa.indicators
            ?.map((i) => ({
              ...i,
              periods: i?.periods
                ?.map((p) => ({
                  ...p,
                  updates: p?.updates?.filter((u) => u.id !== update.id)
                }))
            }))
        }))
        calculatePendingAmount(items)
        setPendingApproval(items)
        setActiveKey(null)
      }
    })
  }
  const deleteFile = (file) => {
    setDeletion([
      ...deletion,
      file?.uid
    ])
  }
  const handleCancel = () => {
    setActiveKey(null)
    setDeletion([])
    formRef.current.form.setConfig('keepDirtyOnReinitialize', false)
    formRef.current.form.reset()
    formRef.current.form.setConfig('keepDirtyOnReinitialize', true)
  }

  return (
    <div className="pending-approval">
      {updates?.length > 0 && (
        <Affix offsetTop={{ top: 10, bottom: 10 }} className="approval-all-container">
          <Row type="flex" justify="space-between" align="middle" gutter={[8, 16]}>
            <Col lg={8} md={10} sm={24} xs={24}>
              <Text>{updates?.length} UPDATES PENDING APPROVAL</Text>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <div className="bulk-btns">
                <Button type="primary" size="default" loading={loading === 'Aall'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('A')}>{t('Approve all')}</Button>
                <Button type="link" size="default" loading={loading === 'Rall'} disabled={bulkUpdating} onClick={handleBulkUpdateStatus('R')}>{t('Decline all')}</Button>
              </div>
            </Col>
          </Row>
        </Affix>
      )}
      <Row gutter={[16, 16]}>
        {updates?.map((update, ix) => (
          <Col span={24} key={ix}>
            <Card
              title={(
                <Row type="flex" justify="space-between" align="middle" gutter={[8, 16]}>
                  <Col lg={18} md={24} sm={24} xs={24}>
                    <CardTitle {...update} keyword={keyword} />
                  </Col>
                  <Col lg={6} md={24} sm={24} xs={24}>
                    <CardActions
                      {...{
                        t,
                        update,
                        loading,
                        activeKey,
                        setActiveKey,
                        handleCancel,
                        handleUpdateStatus,
                        isUpdating: updating.indexOf(update.id) !== -1,
                        handleOnEdit: (item) => {
                          if (errors.length) {
                            setErrors([])
                          }
                          handleOnEdit(item)
                          setActiveKey(item.id)
                        }
                      }}
                    />
                  </Col>
                </Row>
              )}
              className={classNames({
                overlay: activeKey === update?.id
              })}
            >
              <div className="update-row">
                {update?.indicator?.type === 1 && (
                  <div className="update-col text-center">
                    <div className="label">
                      {t('value')}
                    </div>
                    <h2 className="value">
                      {nicenum(update.value)}
                    </h2>
                  </div>
                )}
                {update?.disaggregations?.length > 0 && (
                  <div className="update-col disaggregations">
                    <Disaggregations values={update.disaggregations} />
                  </div>
                )}
                {update.indicator.type === 2 && (
                  <div lg={(update?.narrative?.length > 255) ? 24 : 12} md={24} sm={24} xs={24}>
                    <div className="label">{t('update')}</div>
                    <div className="qualitative-value">
                      {update.narrative}
                    </div>
                  </div>
                )}
                <div className="update-col">
                  <div className="label">{t('submitted')}</div>
                  <div className="value">
                    {moment(update.lastModifiedAt).fromNow()}<br />
                    <small>by</small>&nbsp;<Text type="secondary">{update.userDetails.firstName} {update.userDetails.lastName}</Text>
                  </div>
                </div>
                {update.text &&
                  <div className="update-col">
                    <div className="label">{t('comment')}</div>
                    <div className="qualitative-value">
                      <ShowMoreText lines={2}>{update.text}</ShowMoreText>
                    </div>
                  </div>
                }
                {update.fileSet?.length > 0 && (
                  <div className="update-col">
                    <div className="label">{t('attachments')}</div>
                    <ul>
                      {update.fileSet.map((file, fx) => {
                        const parts = file.file.split('/')
                        const filename = parts[parts.length - 1]
                        return (
                          <li key={fx}>
                            <a href={file.file} target="_blank" rel="noopener noreferrer">
                              <Icon type="paper-clip" />&nbsp;
                              {filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                <div className="update-col">
                  <div className="label">{t('internal notes')}</div>
                  <div className="value">{update?.comments[0]?.comment}</div>
                </div>
              </div>
            </Card>
            <Collapse activeKey={activeKey} bordered={false} accordion>
              <Collapse.Panel key={update.id} showArrow={false}>
                <ReportedEdit
                  {...{
                    activeKey,
                    formRef,
                    editing,
                    editPeriod,
                    deletePendingUpdate,
                    deleteFile,
                    deletion,
                    errors,
                    setErrors,
                    setActiveKey,
                    handleOnUpdate,
                    mneView: true,
                    project
                  }}
                />
              </Collapse.Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
      {updates.length === 0 && (
        <div className="empty">
          {t('No updates pending approval')}
        </div>
      )}
    </div>
  )
}

export default PendingApproval
