/* globals window */
import React, { useState, useEffect, useRef } from 'react'
import {
  Row,
  Col,
  Button,
  List,
  Card,
  Collapse,
  Modal,
  Icon,
  PageHeader,
  Typography,
  Tooltip
} from 'antd'
import { useTranslation } from 'react-i18next'
import { cloneDeep, split, orderBy, isEmpty } from 'lodash'
import { connect } from 'react-redux'

import SimpleMarkdown from 'simple-markdown'
import classNames from 'classnames'
import moment from 'moment'

import './enumerator.scss'
import Highlighted from '../../components/Highlighted'
import api from '../../utils/api'
import { FilterBar } from '../results-overview/components'
import ReportedEdit from '../results-admin/components/ReportedEdit'
import StatusIndicator from '../../components/StatusIndicator'
import * as actions from './actions'
import { measureType } from '../../utils/constants'
import EnumeratorSubmissionsModal from './EnumeratorSubmissionsModal'

const { Text } = Typography

const EnumeratorPage = ({
  id,
  jwtView,
  project,
  periods,
  userRdr,
  resultRdr,
  setResultState
}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(null)
  const [keyword, setKeyword] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const [fileSet, setFileSet] = useState([])
  const [period, setPeriod] = useState(null)
  const [assign, setAssign] = useState(null)
  const [hideSubmitted, setHideSubmitted] = useState(false)
  const [submissions, setSubmissions] = useState({
    scores: [],
    updates: [],
    item: null,
    visible: false
  })

  const formRef = useRef()
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const params = new URLSearchParams(window.location.search)
  const indicators = params.get('indicators') ? params.get('indicators').split(',').map((i) => parseInt(i, 10)) : []
  const isPreview = (params.get('rt') && params.get('rt') === 'preview')
  const isNuffic = [4531, 5255, 5722]

  const disaggregations = []
  if (editing?.indicator?.dimensionNames?.length) {
    editing.indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dimen => {
        disaggregations.push({ category: group.name, type: dimen.value, typeId: dimen.id, groupId: group.id })
      })
    })
  }

  const updates = resultRdr
    ?.flatMap((r) => r.indicators)
    ?.filter((i) => {
      if (jwtView) {
        return indicators.length ? indicators.includes(i.id) : i
      }
      if (!jwtView && assign) {
        return assign?.includes(i.id)
      }
      return false
    })
    ?.filter((i) => keyword ? i?.title?.toLowerCase()?.includes(keyword.toLowerCase()) : i)
    ?.flatMap((i) => {
      return i.periods
        ?.filter((p) => (!p.locked))
        ?.map((p) => ({
          ...p,
          indicator: {
            id: i.id,
            title: i.title,
            type: i.type,
            result: i.result,
            description: i.description,
            dimensionNames: i?.dimensionNames,
            measure: i?.measure,
            scores: i?.scores,
          }
        }))
    })
    ?.filter((p) => {
      const myUpdates = p.updates.filter((u) => u?.userDetails?.id === userRdr.id)
      return (
        (p?.canAddUpdate && p.indicator.measure !== '2') ||
        (p.indicator.measure === measureType.PERCENTAGE && (p?.canAddUpdate || myUpdates.length))
      )
    })
    ?.filter((p) => {
      if (period) {
        const [periodStart, periodEnd] = split(period, '-')
        return ((periodStart?.trim() === p?.periodStart) && (periodEnd?.trim() === p?.periodEnd))
      }
      return p
    })
    ?.flatMap((p) => {
      const myUpdates = orderBy(p.updates.filter((u) => u?.userDetails?.id === userRdr.id).filter((u) => u.status !== 'D'), ['lastModifiedAt'], ['desc'])
      const lastSubmissionAt = myUpdates.length ? moment(myUpdates[0].lastModifiedAt).format('DD MMM YYYY') : null
      const pu = p
        ?.updates
        ?.filter((u) => {
          return (
            (u?.userDetails?.id === userRdr.id) ||
            (isNuffic.includes(project?.primaryOrganisation) && (u?.userDetails?.id !== userRdr.id && u.status === 'D')) ||
            (!userRdr.id && params.get('rt'))
          ) && u.status !== 'A'
        })
        ?.map((u) => ({
          ...u,
          lastSubmissionAt,
          indicator: p.indicator,
          result: p.indicator.result,
          period: {
            id: p.id,
            periodStart: p.periodStart,
            periodEnd: p.periodEnd,
            canAddUpdate: p.canAddUpdate
          }
        }))
      const nApproved = pu.filter((u) => (u.status === 'A' && u?.period?.canAddUpdate)).length
      if ((pu.length === nApproved) || !(pu.length)) {
        return [
          {
            id: null,
            status: null,
            statusDisplay: 'No Update Status',
            comments: [],
            lastSubmissionAt,
            indicator: p.indicator,
            result: p.indicator.result,
            period: {
              id: p.id,
              periodStart: p.periodStart,
              periodEnd: p.periodEnd
            }
          },
          ...pu
        ]
      }
      return orderBy(pu, ['lastModifiedAt'], ['desc'])
    })
    ?.filter((u) => !(hideSubmitted && !u.status && u.lastSubmissionAt))
    ?.map((u) => {
      const dsgItems = []
      if (u.indicator?.dimensionNames?.length) {
        u.indicator.dimensionNames.forEach(dn => {
          dn.dimensionValues.forEach(dv => {
            const findValue = u?.disaggregations?.find((du) => (du?.categoryId === dn.id && du?.typeId === dv.id))
            dsgItems.push({
              ...findValue,
              category: dn.name,
              dimensionName: dn.id,
              dimension_value: dv.id,
              id: findValue?.id || `new-${dv.id}`,
              update: u?.id || `new-${dn.id}`,
              value: (findValue?.value === undefined || findValue?.value === null) ? null : findValue?.value
            })
          })
        })
      }
      return {
        ...u,
        disaggregations: dsgItems
      }
    })

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
    const _results = resultRdr.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => {
        if (i?.id === update?.indicator?.id) {
          return ({
            ...i,
            periods: i.periods
              ?.map((p) => {
                if (p?.id === update?.period) {
                  const isExist = p?.updates?.find((u) => u?.id === update.id)
                  return ({
                    ...p,
                    updates: isExist
                      ? p?.updates?.map((u) => u.id === update.id ? update : u)
                      : [update, ...p?.updates]
                  })
                }
                return p
              })
          })
        }
        return i
      })
    }))
    setResultState(_results)
  }

  const handleCancel = () => {
    setActiveKey(null)
    setDeletion([])
    setErrors([])
    formRef.current.form.setConfig('keepDirtyOnReinitialize', false)
    formRef.current.form.reset()
    formRef.current.form.setConfig('keepDirtyOnReinitialize', true)
  }

  const handleOnEdit = (item) => {
    const indicator = resultRdr
      ?.flatMap((r) => r.indicators)
      ?.find((i) => i.id === item.indicator.id)
    setEditing({
      ...item,
      indicator,
      note: item?.comments[0]?.comment || '',
      period: indicator?.periods?.find((p) => p.id === item.period.id)
    })
    if (item.id) {
      api
        .get(`/indicator_period_data_framework/${item.id}/`)
        .then(({ data }) => {
          // eslint-disable-next-line no-shadow
          const { disaggregations, ...props } = data
          setEditing({
            ...item,
            ...props,
            indicator,
            note: data?.comments[0]?.comment || '',
            period: indicator?.periods?.find((p) => p.id === item.period.id)
          })
        })
    }
  }

  const handleOnSearch = (value) => {
    setKeyword(value)
  }

  const handleOnSelectPeriod = (value) => {
    setPeriod(value)
  }

  const editPeriod = (p, indicator) => {
    const items = resultRdr?.flatMap((r) => r?.indicators)
    const indIndex = items.findIndex(it => it.id === indicator.id)
    const prdIndex = items[indIndex].periods.findIndex(it => it.id === p.id)
    const updated = cloneDeep(items)
    updated[indIndex].periods[prdIndex] = p
    setResultState(updated)
  }

  const deleteFile = (file) => {
    setDeletion([
      ...deletion,
      file?.uid
    ])
  }

  const deleteOnUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update when you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        const _results = resultRdr.map((pa) => ({
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
        setResultState(_results)
      }
    })
  }

  const handleHideSubmitted = () => setHideSubmitted(!hideSubmitted)

  const handleOnShowSubmissions = item => {
    setSubmissions({
      ...submissions,
      item: { ...item, fetched: false },
      visible: !submissions.visible
    })
    api.get(`/indicator_period_data_framework/?period=${item?.period?.id}&format=json`)
      .then(({ data }) => {
        const { results } = data
        const userUpdates = results?.filter((u) => u.userDetails?.id === userRdr.id)
        setSubmissions({
          scores: item?.indicator.scores,
          updates: userUpdates,
          item: {
            ...item,
            fetched: true
          },
          visible: !submissions.visible
        })
      })
      .catch(() => console.error('Something went wrong'))
  }
  const handleOnCloseSubmissions = () => {
    setSubmissions({
      scores: [],
      updates: [],
      item: null,
      visible: false
    })
  }

  useEffect(() => {
    if ((activeKey && editing?.fileSet?.length) && (!deletion.length && !fileSet.length)) {
      setFileSet(editing.fileSet)
    }
    if (!activeKey && fileSet.length) {
      setFileSet([])
    }
    if (assign === null && !jwtView) {
      api
        .get(`/project/${id}/enumerators/?format=json`)
        .then(({ data }) => {
          const assigments = data
            ?.filter((d) => userRdr ? d.email === userRdr.email : d)
            ?.map((d) => d?.indicators)
            ?.flatMap((d) => d)
          setAssign(assigments)
        })
        .catch(() => {
          setAssign([])
        })
    }
  }, [editing, activeKey, fileSet, disaggregations, assign, jwtView, userRdr])

  return (
    <div className="enum-ui">
      <PageHeader>
        <FilterBar {...{ periods, period, handleOnSearch, handleOnSelectPeriod, hideSubmitted, handleHideSubmitted }} disabled={(assign && assign.length === 0)} />
      </PageHeader>
      <EnumeratorSubmissionsModal {...submissions} enumerator={userRdr} onClose={handleOnCloseSubmissions} />
      <List
        grid={{ column: 1 }}
        itemLayout="vertical"
        dataSource={updates}
        renderItem={(item, ix) => {
          const iKey = item?.id || `${item?.indicator?.id}0${ix}`
          const updateClass = item?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
          const canDelete = (editing?.id && editing?.status === 'D') && (userRdr.id && (editing?.userDetails?.id === userRdr.id))
          const disableInputs = (
            (editing?.userDetails && ['P', 'A'].includes(editing?.status)) ||
            ((userRdr.id && editing && editing.userDetails) && (editing.userDetails.id !== userRdr.id && editing.status === 'R')) ||
            isPreview
          )
          const allSubmissions = resultRdr
            ?.filter((r) => r.id === item.result)
            ?.flatMap((r) => r.indicators)
            ?.filter((i) => i.id === item.indicator?.id)
            ?.flatMap((i) => i.periods)
            ?.filter((p) => p.id === item.period?.id && p.updates.length)
            ?.flatMap((p) => p.updates)
            ?.filter((u) => u.userDetails.id === userRdr.id)

          return (
            <List.Item className="enum-ui-item">
              <Card className={classNames(updateClass, { active: (activeKey === iKey) })}>
                <Row type="flex" justify="space-between" align="middle" gutter={[{sm: 8, xs: 8}, {sm: 16, xs: 16}]}>
                  <Col xl={22} lg={22} md={22} sm={24} xs={24}>
                    {isEmpty(period) && (
                      <div className="period-caption">
                        {moment(item?.period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(item?.period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                      </div>
                    )}
                    <StatusIndicator status={item?.status} />
                    <Row className="last-submission">
                      <Col style={{ display: 'flex', gap: 10 }} className={classNames({'no-submissions': !item?.lastSubmissionAt})}>
                        <Text strong>Last submission date : </Text>
                        <Text>{item?.lastSubmissionAt || '-'}</Text>
                      </Col>
                    </Row>
                    <Text strong>Title : </Text>
                    <Highlighted text={item?.indicator?.title} highlight={keyword} />
                    {(item?.indicator?.description?.trim()?.length > 0) && (
                      <details>
                        <summary>{t('Description')}</summary>
                        {mdOutput(mdParse(item.indicator.description))}
                      </details>
                    )}
                  </Col>
                  <Col lg={2} md={2} sm={24} xs={24} className="enum-action">
                    {
                      (activeKey === iKey)
                        ? (
                          <div className="action-close">
                            <Button onClick={handleCancel}>
                              <Icon type="close" />
                              <span className="action-text">Close</span>
                            </Button>
                          </div>
                        ) : (
                          <>
                            {(allSubmissions.length > 0) && (
                              <Tooltip placement="top" title="Submissions">
                                <Button style={{ borderColor: 'transparent', fontSize: '22px' }} onClick={() => handleOnShowSubmissions(item)}>
                                  <Icon type="solution" />
                                  <span className="action-text">Submissions</span>
                                </Button>
                              </Tooltip>
                            )}
                            <Tooltip
                              placement="top"
                              title={(['P', 'A'].includes(item?.status) || isPreview) ? 'View update' : 'Edit update'}
                            >
                              <Button
                                style={{ borderColor: 'transparent', fontSize: '22px' }}
                                className={updateClass}
                                onClick={() => {
                                  handleOnEdit(item)
                                  setActiveKey(iKey)
                                }}
                                block
                              >
                                {(['P', 'A'].includes(item?.status) || isPreview)
                                  ? (
                                    <>
                                      <Icon type="eye" className="edit-button" />
                                      <span className="action-text">View Update</span>
                                    </>
                                  )
                                  : (
                                    <>
                                      <Icon type="form" />
                                      <span className="action-text">Edit Update</span>
                                    </>
                                  )
                                }
                              </Button>
                            </Tooltip>

                          </>
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
                        canDelete,
                        disableInputs,
                        errors,
                        jwtView,
                        setErrors,
                        setActiveKey,
                        handleOnUpdate,
                        deletePendingUpdate: (update) => {
                          deleteOnUpdate(update)
                        },
                        description: mdOutput(mdParse(editing?.indicator?.description))
                      }}
                    />
                  </Collapse.Panel>
                </Collapse>
              )}
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default connect(
  ({ userRdr, resultRdr }) => ({ userRdr, resultRdr }), actions
)(EnumeratorPage)
