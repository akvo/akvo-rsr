import React, { useState, useRef } from 'react'
import {
  List,
  Card,
  Button,
  Collapse,
  Typography,
  Row,
  Col,
  Modal,
  message
} from 'antd'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import classNames from 'classnames'
import moment from 'moment'
import { isEmpty, kebabCase } from 'lodash'
import { connect } from 'react-redux'

import './TobeReported.scss'
import api from '../../utils/api'
import ReportedEdit from './components/ReportedEdit'
import { isPeriodNeedsReportingForAdmin } from '../results/filters'
import Highlighted from '../../components/Highlighted'
import StatusIndicator from '../../components/StatusIndicator'
import ResultType from '../../components/ResultType'
import * as actions from '../results/actions'
import { ACTIVE_PERIOD } from '../../utils/constants'
import { Icon } from '../../components'
import AuditTrailModal from './components/AuditTrailModal'

const { Text, Title } = Typography

const TobeReported = ({
  resultRdr,
  keyword,
  results,
  updates,
  editing,
  project,
  period,
  editPeriod,
  needsReportingTimeoutDays,
  setTobeReportedItems,
  setTobeReported,
  handleOnEdit,
  updatePeriod,
  deleteItemState
}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const [openHistory, setOpenHistory] = useState({
    scores: [],
    results: [],
    fetched: false,
    visible: false
  })
  const formRef = useRef()

  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const deleteOnUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update when you click OK',
      onOk() {
        api
          .delete(`/indicator_period_data_framework/${update.id}/`)
          .then(() => {
            const _results = results.map((pa) => ({
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
            deleteItemState(update)
            const items = _results?.flatMap((r) => r?.indicators)
            setTobeReported(_results)
            setTobeReportedItems(items)
            setActiveKey(null)
            message.success('Update has been deleted!')
          })
          .catch(() => {
            setActiveKey(null)
            message.error('Something went wrong')
          })
      }
    })
  }
  const deleteFile = (file) => {
    setDeletion([
      ...deletion,
      file?.uid
    ])
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
    const _results = results.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => {
        if (i?.id === update?.indicator?.id) {
          return ({
            ...i,
            periods: i.periods
              ?.map((p) => {
                if (p?.id === update?.period) {
                  const modifiedPeriod = {
                    ...p,
                    updates: (p?.updates?.find((u) => u.id === update.id))
                      ? p?.updates?.map((u) => u.id === update.id ? update : u)
                      : [update, ...p.updates]
                  }
                  updatePeriod(modifiedPeriod)
                  return modifiedPeriod
                }
                return p
              })
              ?.filter((p) => isPeriodNeedsReportingForAdmin(p, needsReportingTimeoutDays))
          })
        }
        return i
      })
    }))
    const items = _results?.flatMap((r) => r?.indicators)
    setTobeReported(_results)
    setTobeReportedItems(items)
  }
  const handleCancel = () => {
    setActiveKey(null)
    setDeletion([])
    setErrors([])
    formRef.current.form.setConfig('keepDirtyOnReinitialize', false)
    formRef.current.form.reset()
    formRef.current.form.setConfig('keepDirtyOnReinitialize', true)
  }

  const handleOnShowHistory = item => {
    setOpenHistory({
      ...openHistory,
      fetched: false,
      visible: !openHistory.visible
    })
    api
      .get(`/indicator_period_data_framework/?period=${item?.period?.id}&format=json`)
      .then(({ data }) => {
        const { results: dataResults } = data
        setOpenHistory({
          scores: item?.indicator?.scores,
          results: dataResults,
          fetched: true,
          visible: !openHistory.visible
        })
      })
      .catch(() => message.error('Something went wrong'))
  }

  const handleOnCloseModal = () => {
    setOpenHistory({
      scores: [],
      results: [],
      fetched: false,
      visible: false
    })
  }

  return (
    <>
      <AuditTrailModal {...openHistory} onClose={handleOnCloseModal} />
      <List
        grid={{ column: 1 }}
        itemLayout="vertical"
        className="tobe-reported"
        dataSource={updates}
        renderItem={(item, ix) => {
          const iKey = item?.id || `${item?.indicator?.id}0${ix}`
          const allSubmissions = resultRdr
            ?.filter((r) => r.id === item.result?.id)
            ?.flatMap((r) => r.indicators)
            ?.filter((i) => i.id === item.indicator?.id)
            ?.flatMap((i) => i.periods)
            ?.filter((p) => (
              p.id === item.period?.id &&
              p.updates.length &&
              !p.locked
            ))
            ?.flatMap((p) => p.updates)
          const updateClass = (!item.status && allSubmissions.length) ? ACTIVE_PERIOD : kebabCase(item?.statusDisplay)
          return (
            <List.Item className="tobe-reported-item">
              <Card className={classNames(updateClass, { active: (activeKey === iKey) })}>
                <Row type="flex" justify="space-between" align="top">
                  <Col lg={22} md={22} sm={24} xs={24}>
                    {isEmpty(period) && (
                      <div className="period-caption">
                        {moment(item?.period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(item?.period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                      </div>
                    )}
                    <StatusIndicator status={item?.status} updateClass={updateClass} />
                    <ResultType {...item?.indicator?.result} />
                    <br />
                    <Text strong>Title : </Text>
                    <Highlighted text={item?.indicator?.title} highlight={keyword} />
                    <br />
                    {((!isEmpty(item?.indicator?.description.trim())) && item?.indicator?.description?.trim().length > 5) && (
                      <details>
                        <summary>{t('Description')}</summary>
                        <span className="desc">{mdOutput(mdParse(item?.indicator?.description))}</span>
                      </details>
                    )}
                  </Col>
                  <Col lg={2} md={2} sm={24} xs={24} className="action">
                    {(activeKey === iKey) && (
                      <div className="action-close">
                        <Button onClick={handleCancel}>
                          <Icon type="close" />
                          <span className="action-text">Close</span>
                        </Button>
                      </div>
                    )}
                    {(activeKey !== iKey) && (
                      <>
                        {(allSubmissions.length > 0) && (
                          <Button type="link" onClick={() => handleOnShowHistory(item)}>
                            <Icon type="clock.history" />
                            <span className="action-text">Audit Trail</span>
                          </Button>
                        )}
                        <Button
                          type="link"
                          onClick={() => {
                            if (errors.length) {
                              setErrors([])
                            }
                            handleOnEdit(item)
                            setActiveKey(iKey)
                          }}
                        >
                          <Icon type="edit.pencil" />
                          <span className="action-text">Edit Value</span>
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </Card>
              {(editing && activeKey) && (
                <Collapse activeKey={activeKey} bordered={false} accordion>
                  <Collapse.Panel key={iKey} showArrow={false}>
                    <ReportedEdit
                      {...{
                        activeKey,
                        formRef,
                        project,
                        editing,
                        editPeriod,
                        deleteFile,
                        deletion,
                        errors,
                        setErrors,
                        setActiveKey,
                        handleOnUpdate,
                        mneView: true,
                        deletePendingUpdate: deleteOnUpdate
                      }}
                    />
                  </Collapse.Panel>
                </Collapse>
              )}
            </List.Item>
          )
        }}
      />
    </>
  )
}

export default connect(
  (({ resultRdr }) => ({ resultRdr })), actions
)(TobeReported)
