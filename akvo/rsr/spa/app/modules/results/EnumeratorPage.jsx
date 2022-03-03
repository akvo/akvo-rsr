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
  Typography
} from 'antd'
import { useTranslation } from 'react-i18next'
import { cloneDeep, split, orderBy, isEmpty } from 'lodash'
import { connect } from 'react-redux'

import SVGInline from 'react-svg-inline'
import SimpleMarkdown from 'simple-markdown'
import classNames from 'classnames'
import moment from 'moment'

import './enumerator.scss'
import Highlighted from '../../components/Highlighted'
import editButton from '../../images/edit-button.svg'
import api from '../../utils/api'
import { FilterBar } from '../results-overview/components'
import ReportedEdit from '../results-admin/components/ReportedEdit'
import StatusIndicator from '../../components/StatusIndicator'

const { Text } = Typography

const EnumeratorPage = ({
  project,
  periods,
  userRdr,
  results,
  setResults
}) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(null)
  const [keyword, setKeyword] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deletion, setDeletion] = useState([])
  const [errors, setErrors] = useState([])
  const [fileSet, setFileSet] = useState([])
  const [period, setPeriod] = useState(null)

  const formRef = useRef()
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput

  const params = new URLSearchParams(window.location.search)
  const indicators = params.get('indicators') ? params.get('indicators').split(',').map((i) => parseInt(i, 10)) : []
  const isPreview = (params.get('rt') && params.get('rt') === 'preview')
  const isNuffic = [4531, 5255, 5722]

  const disaggregations = []
  if (editing?.indicator?.dimensionNames?.length) {
    editing?.indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dimen => {
        disaggregations.push({ category: group.name, type: dimen.value, typeId: dimen.id, groupId: group.id })
      })
    })
  }

  const updates = results
    ?.flatMap((r) => r.indicators)
    ?.filter((i) => indicators.length ? indicators.includes(i.id) : i)
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
            measure: i?.measure
          }
        }))
    })
    ?.filter((p) => {
      const myUpdates = p.updates.filter((u) => u?.userDetails?.id === userRdr.id)
      return (
        (p?.canAddUpdate && p.indicator.measure !== '2') ||
        (p.indicator.measure === '2' && (p?.canAddUpdate || myUpdates.length))
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
      const pu = p.updates.filter((u) => {
        return (
          (u?.userDetails?.id === userRdr.id) ||
          (isNuffic.includes(project?.primaryOrganisation) && (u?.userDetails?.id !== userRdr.id && u.status === 'D')) ||
          (!userRdr.id && params.get('rt'))
        )
      })
      return pu.length
        ? orderBy(
          pu.map((u) => ({
            ...u,
            indicator: p.indicator,
            result: p.indicator.result,
            period: {
              id: p.id,
              periodStart: p.periodStart,
              periodEnd: p.periodEnd
            }
          })),
          ['lastModifiedAt'],
          ['desc']
        )
        : [{
          id: null,
          status: null,
          statusDisplay: 'No Update Status',
          comments: [],
          indicator: p.indicator,
          result: p.indicator.result,
          period: {
            id: p.id,
            periodStart: p.periodStart,
            periodEnd: p.periodEnd
          }
        }]
    })
    ?.map((u) => {
      const dsgItems = []
      if (u.indicator?.dimensionNames?.length) {
        u.indicator?.dimensionNames?.forEach(dn => {
          dn?.dimensionValues?.forEach(dv => {
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
    const _results = results.map((r) => ({
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
                      : [update]
                  })
                }
                return p
              })
          })
        }
        return i
      })
    }))
    setResults(_results)
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
    const indicator = results
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

  const editPeriod = (period, indicator) => {
    const items = results?.flatMap((r) => r?.indicators)
    const indIndex = items.findIndex(it => it.id === indicator.id)
    const prdIndex = items[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(items)
    updated[indIndex].periods[prdIndex] = period
    setResults(updated)
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
        setResults(_results)
      }
    })
  }

  useEffect(() => {
    if ((activeKey && editing?.fileSet?.length) && (!deletion.length && !fileSet.length)) {
      setFileSet(editing.fileSet)
    }
    if (!activeKey && fileSet.length) {
      setFileSet([])
    }
  }, [editing, activeKey, fileSet, disaggregations])

  return (
    <div className="enum-ui">
      <PageHeader>
        <FilterBar {...{ periods, period, handleOnSearch, handleOnSelectPeriod }} />
      </PageHeader>
      <List
        grid={{ column: 1 }}
        itemLayout="vertical"
        dataSource={updates}
        renderItem={(item, ix) => {
          const iKey = item?.id || `${item?.indicator?.id}0${ix}`
          const updateClass = item?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
          const canDelete = (editing?.id && editing?.status === 'D') && editing?.userDetails?.id === userRdr?.id
          const disableInputs = ((editing?.userDetails && ['P', 'A'].includes(editing?.status)) || (editing?.userDetails?.id !== userRdr?.id && editing?.status === 'R') || isPreview)
          return (
            <List.Item className="enum-ui-item">
              <Card className={classNames(updateClass, { active: (activeKey === iKey) })}>
                <Row type="flex" justify="space-between" align="middle">
                  <Col span={22}>
                    {isEmpty(period) && (
                      <div className="period-caption">
                        {moment(item?.period?.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(item?.period?.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
                      </div>
                    )}
                    <StatusIndicator status={item?.status} />
                    <Text strong>Title : </Text>
                    <Highlighted text={item?.indicator?.title} highlight={keyword} />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    {
                      (activeKey === iKey)
                        ? (
                          <div style={{ paddingLeft: 10 }}>
                            <Button onClick={handleCancel} icon="close" />
                          </div>
                        )
                        : (
                          <Button
                            type="link"
                            onClick={() => {
                              handleOnEdit(item)
                              setActiveKey(iKey)
                            }}
                          >
                            {(['P', 'A'].includes(item?.status) || isPreview) ? <Icon type="eye" className="edit-button" /> : <SVGInline svg={editButton} className="edit-button" />}
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
                        editing,
                        editPeriod,
                        deleteFile,
                        deletion,
                        canDelete,
                        disableInputs,
                        errors,
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
  ({ userRdr }) => ({ userRdr })
)(EnumeratorPage)
