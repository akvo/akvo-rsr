import React, { useState, useRef } from 'react'
import {
  List,
  Card,
  Button,
  Collapse,
  Row,
  Col,
  Modal,
  Icon
} from 'antd'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'

import './TobeReported.scss'
import editButton from '../../images/edit-button.svg'
import api from '../../utils/api'
import ReportedEdit from './components/ReportedEdit'
import StatusBadge from './components/StatusBadge'
import { isPeriodNeedsReporting } from '../results/filters'
import Highlighted from '../../components/Highlighted'

const TobeReported = ({
  keyword,
  results,
  indicators,
  editing,
  editPeriod,
  setTobeReportedItems,
  setTobeReported,
  setPeriodsAmount,
  handleOnEdit
}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const formRef = useRef()

  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const updates = indicators
    ?.flatMap((i) => {
      return i.periods
        ?.map((p) => ({
          ...p,
          indicator: {
            id: i.id,
            title: i.title,
            type: i.type,
            result: i.result,
            description: i.description,
            dimensionNames: i?.dimensionNames
          }
        }))
    })
    ?.filter((p) => isPeriodNeedsReporting(p))
    ?.flatMap((p) => {
      return p.updates.length
        ? [
          {
            ...p.updates[0],
            indicator: p.indicator,
            result: p.indicator.result,
            period: {
              id: p.id,
              periodStart: p.periodStart,
              periodEnd: p.periodEnd
            }
          }
        ]
        : [
          {
            id: null,
            status: null,
            statusDisplay: 'No Update Status',
            comments: [],
            disaggregations: [],
            indicator: p.indicator,
            result: p.indicator.result,
            period: {
              id: p.id,
              periodStart: p.periodStart,
              periodEnd: p.periodEnd
            }
          }
        ]
    })

  const deleteOnUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update if you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        const _results = results.map((pa) => ({
          ...pa,
          indicators: pa.indicators
            ?.filter((i) => i.id !== update?.indicator?.id)
            ?.map((i) => ({
              ...i,
              periods: i?.periods
                ?.filter((p) => p.id !== update?.period?.id)
                ?.map((p) => ({
                  ...p,
                  updates: p?.updates?.filter((u) => u.id !== update.id)
                }))
            }))
        }))
        const items = _results?.flatMap((r) => r?.indicators)
        const pAmount = items
          ?.flatMap((i) => i?.periods)
          ?.flatMap((p) => p?.updates?.length ? p.updates : [{ ...p }])
          ?.length
        setTobeReported(_results)
        setTobeReportedItems(items)
        setPeriodsAmount(pAmount)
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
                    updates: p?.updates?.length
                      ? p?.updates?.map((u) => u.id === update.id ? update : u)
                      : [update]
                  })
                }
                return p
              })
              ?.filter((p) => isPeriodNeedsReporting(p))
          })
        }
        return i
      })
    }))
    const items = _results?.flatMap((r) => r?.indicators)
    const pAmount = items
          ?.flatMap((i) => i?.periods)
          ?.flatMap((p) => p?.updates?.length ? p.updates : [{ ...p }])
          ?.length
    setTobeReported(_results)
    setTobeReportedItems(items)
    setPeriodsAmount(pAmount)
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
                <Col span={22}>
                  <StatusBadge status={item?.status} />
                  <br />
                  <Highlighted text={item?.indicator?.title} highlight={keyword} />
                  <br />
                  {(item?.indicator?.description?.trim()?.length > 1) && (
                    <details open>
                      <summary>{t('Description')}</summary>
                      <p className="desc">{mdOutput(mdParse(item?.indicator?.description))}</p>
                    </details>
                  )}
                </Col>
                <Col span={2}>
                  {
                    (activeKey === iKey)
                      ? <Button onClick={handleCancel} icon="close" />
                      : (
                        <Button
                          type="link"
                          onClick={() => {
                            handleOnEdit(item)
                            setActiveKey(iKey)
                          }}
                        >
                          <SVGInline svg={editButton} className="edit-button" />
                        </Button>
                      )
                  }
                </Col>
              </Row>
            </Card>
            <Collapse activeKey={activeKey} bordered={false} accordion>
              <Collapse.Panel key={iKey} showArrow={false}>
                <ReportedEdit
                  {...{
                    activeKey,
                    formRef,
                    editing,
                    editPeriod,
                    deleteFile,
                    deletion,
                    errors,
                    setErrors,
                    setActiveKey,
                    handleOnUpdate,
                    deletePendingUpdate: deleteOnUpdate
                  }}
                />
              </Collapse.Panel>
            </Collapse>
          </List.Item>
        )
      }}
    />
  )
}

export default TobeReported
