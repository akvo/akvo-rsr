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
  Icon
} from 'antd'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import moment from 'moment'
import { isEmpty } from 'lodash'

import './TobeReported.scss'
import editButton from '../../images/edit-button.svg'
import api from '../../utils/api'
import ReportedEdit from './components/ReportedEdit'
import { isPeriodNeedsReportingForAdmin } from '../results/filters'
import Highlighted from '../../components/Highlighted'
import StatusIndicator from '../../components/StatusIndicator'
import ResultType from '../../components/ResultType'

const { Text } = Typography

const TobeReported = ({
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
  handleOnEdit
}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const formRef = useRef()

  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const deleteOnUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update when you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
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
        const items = _results?.flatMap((r) => r?.indicators)
        setTobeReported(_results)
        setTobeReportedItems(items)
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
                  return ({
                    ...p,
                    updates: (p?.updates?.find((u) => u.id === update.id))
                      ? p?.updates?.map((u) => u.id === update.id ? update : u)
                      : [update, ...p.updates]
                  })
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

  return (
    <List
      grid={{ column: 1 }}
      itemLayout="vertical"
      className="tobe-reported"
      dataSource={updates}
      renderItem={(item, ix) => {
        const iKey = item?.id || `${item?.indicator?.id}0${ix}`
        const updateClass = item?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
        return (
          <List.Item className="tobe-reported-item">
            <Card className={classNames(updateClass, { active: (activeKey === iKey) })}>
              <Row type="flex" justify="space-between" align="middle">
                <Col lg={22} md={22} sm={24} xs={24}>
                  {isEmpty(period) && (
                    <div className="period-caption">
                      {moment(item?.period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(item?.period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                    </div>
                  )}
                  <StatusIndicator status={item?.status} />
                  <ResultType {...item?.indicator?.result} />
                  <br />
                  <Text strong>Title : </Text>
                  <Highlighted text={item?.indicator?.title} highlight={keyword} />
                  <br />
                  {((!isEmpty(item?.indicator?.description.trim())) && item?.indicator?.description?.trim().length > 5) && (
                    <details>
                      <summary>{t('Description')}</summary>
                      <p className="desc hide-for-mobile">{mdOutput(mdParse(item?.indicator?.description))}</p>
                    </details>
                  )}
                </Col>
                <Col lg={2} md={2} sm={24} xs={24} className="action">
                  {
                    (activeKey === iKey)
                      ? (
                        <div className="action-close">
                          <Button onClick={handleCancel}>
                            <Icon type="close" />
                            <span className="action-text">Close</span>
                          </Button>
                        </div>
                      )
                      : (
                        <Button
                          type="link"
                          onClick={() => {
                            if (errors.length) {
                              setErrors([])
                            }
                            handleOnEdit(item)
                            setActiveKey(iKey)
                          }}
                          block
                        >
                          <SVGInline svg={editButton} className="edit-button" />
                          <span className="action-text">Edit Value</span>
                        </Button>
                      )
                  }
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
  )
}

export default TobeReported
