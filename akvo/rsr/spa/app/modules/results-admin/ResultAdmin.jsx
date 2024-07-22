import React, { useState, useEffect } from 'react'
import { Tabs, Badge, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import { FilterBar } from '../results-overview/components'
import { isPeriodNeedsReportingForAdmin } from '../results/filters'
import TobeReported from './TobeReported'
import PendingApproval from './PendingApproval'
import api from '../../utils/api'
import '../results/enumerator.scss'
import { measureType } from '../../utils/constants'

const { TabPane } = Tabs
const { Text } = Typography

const BadgeTabs = ({ ...props }) => <Badge {...props} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset', marginLeft: '1em', fontWeight: 'bold' }} />

const ResultAdmin = ({
  userRdr,
  periods,
  resultRdr,
  params,
  needsReportingTimeoutDays,
  project
}) => {
  const { t } = useTranslation()
  const [tobeReported, setTobeReported] = useState([])
  const [pendingApproval, setPendingApproval] = useState([])
  const [tobeReportedItems, setTobeReportedItems] = useState([])
  const [activeTab, setActiveTab] = useState('need-reporting')
  const [pendingAmount, setPendingAmount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [editing, setEditing] = useState(null)
  const [keyword, setKeyword] = useState(null)
  const [period, setPeriod] = useState('')

  const calculatePendingAmount = (items) => {
    const nPending = items
      .flatMap(item => item.indicators)
      .flatMap(item => item.periods)
      .flatMap(item => item.updates)
      .filter(item => item.status === 'P').length
    setPendingAmount(nPending)
  }

  const handlePendingApproval = (items) => {
    let listPending = items.filter(item => {
      return item.indicators.filter(indicator => {
        return indicator.periods.filter(p => p.updates.filter(update => update.status === 'P').length > 0).length > 0
      }).length > 0
    })
    listPending = [
      ...listPending.map(item => {
        return {
          ...item,
          indicators: item.indicators.filter(indicator => {
            return indicator.periods.filter(p => p.updates.filter(update => update.status === 'P').length > 0).length > 0
          })
            .map(indicator => {
              return {
                ...indicator,
                periods: indicator.periods.filter(p => p.updates.filter(update => update.status === 'P').length > 0)
              }
            })
        }
      })
    ]
    calculatePendingAmount(listPending)
    setPendingApproval(listPending)
  }

  const handleTobeReported = (selectedPeriod = null) => {
    const items = resultRdr.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => ({
        ...i,
        result: {
          id: r.id,
          title: r.title,
          type: r.type
        },
        periods: i.periods
          ?.filter((p) => (isPeriodNeedsReportingForAdmin(p, needsReportingTimeoutDays)))
          ?.filter((p) => {
            if (selectedPeriod) {
              return (p.periodStart === selectedPeriod.periodStart && p.periodEnd === selectedPeriod.periodEnd)
            }
            return p
          })
      }))
    }))
    setTobeReportedItems(items?.flatMap((i) => i.indicators))
    setTobeReported(items)
  }

  const handleOnFiltering = (items, value) => {
    return items
      .flatMap(item => item.indicators)
      .filter(item => item.title.toLowerCase().includes(value?.trim()?.toLowerCase()))
  }

  const handleOnSearch = (value) => {
    setKeyword(value)
    if (value) {
      const pendingItems = handleOnFiltering(pendingApproval, value)
      const pendingFiltered = [
        ...pendingApproval.map(pending => {
          return {
            ...pending,
            indicators: pending.indicators.filter(item => pendingItems.filter(indicator => indicator.id === item.id).length > 0)
          }
        })
      ]
      calculatePendingAmount(pendingFiltered)
      setPendingApproval(pendingFiltered)
    } else {
      handlePendingApproval(resultRdr)
    }
  }

  const handleOnSelectPeriod = (value) => {
    setPeriod(value)
    const allPeriods = value.trim().split('-')
    const periodStart = allPeriods[0].trim()
    const periodEnd = allPeriods[1]
    const selectedPeriod = periodEnd === undefined ? null : { periodStart, periodEnd: periodEnd.trim() }
    handleTobeReported(selectedPeriod)
  }

  const editPeriod = (p, indicator) => {
    const indIndex = tobeReportedItems.findIndex(it => it.id === indicator.id)
    const prdIndex = tobeReportedItems[indIndex].periods.findIndex(it => it.id === p.id)
    const updated = cloneDeep(tobeReportedItems)
    updated[indIndex].periods[prdIndex] = p
    setTobeReportedItems(updated)
  }

  const handleOnSetEditing = (indicators, item) => {
    const indicator = indicators?.find((i) => i.id === item.indicator.id)
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
          setEditing({
            ...item,
            ...data,
            indicator,
            note: data?.comments[0]?.comment || '',
            period: indicator?.periods?.find((p) => p.id === item.period.id)
          })
        })
    }
  }

  const handleOnEdit = (item) => {
    const indicators = pendingApproval?.flatMap((p) => p.indicators)
    handleOnSetEditing(indicators, item)
  }

  const tobeReportedUpdates = tobeReportedItems
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
            dimensionNames: i?.dimensionNames,
            measure: i?.measure
          }
        }))
    })
    ?.filter((p) => {
      const myDrafts = p?.updates?.filter((u) => (u?.userDetails?.id === userRdr.id && u.status === 'D'))
      return (
        (isPeriodNeedsReportingForAdmin(p, needsReportingTimeoutDays)) &&
        (
          p?.canAddUpdate ||
          (!p?.canAddUpdate && p?.updates.length && p?.indicator?.measure !== '2') ||
          (p?.indicator?.measure === measureType.PERCENTAGE && myDrafts?.length)
        )
      )
    })
    ?.filter((p) => {
      if (keyword) {
        return p?.indicator?.title?.toLowerCase()?.includes(keyword.toLowerCase())
      }
      return p
    })
    ?.flatMap((p) => {
      if (p.updates.length) {
        if (p.updates.length === p.updates.filter((u) => u.status === 'A').length) {
          return [
            {
              id: null,
              status: null,
              statusDisplay: 'No Update Status',
              comments: [],
              indicator: p.indicator,
              result: p.indicator.result,
              value: null,
              period: p
            }
          ]
        }
        return p.updates
          .filter((u) => !(['A', 'P'].includes(u.status)))
          .map((u) => ({
            ...u,
            indicator: p.indicator,
            result: p.indicator.result,
            period: p
          }))
      }
      return [
        {
          id: null,
          status: null,
          statusDisplay: 'No Update Status',
          comments: [],
          indicator: p.indicator,
          result: p.indicator.result,
          value: null,
          period: p
        }
      ]
    })
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
  const tobeReportedProps = {
    results: tobeReported,
    updates: tobeReportedUpdates,
    needsReportingTimeoutDays,
    isPreview,
    project,
    keyword,
    editing,
    editPeriod,
    setTobeReportedItems,
    setTobeReported,
    handleOnEdit: (item) => {
      handleOnSetEditing(tobeReportedItems, item)
    }
  }

  useEffect(() => {
    if (params.get('rt') && params.get('rt') === 'preview') setIsPreview(true)
    handlePendingApproval(resultRdr)
    handleTobeReported()
  }, [])

  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible">
        <div className="filter-bar">
          <FilterBar {...{ periods, period, handleOnSearch, handleOnSelectPeriod }} />
        </div>
        <Tabs type="card" style={{ marginTop: '1em' }} onChange={key => setActiveTab(key)}>
          <TabPane
            tab={
              <>
                <Text>{t('To be Reported')}</Text>
                <BadgeTabs count={tobeReportedUpdates?.length} />
              </>
            }
            key="need-reporting"
          />
          <TabPane
            tab={
              <>
                <Text>{t('Pending Approval')}</Text>
                <BadgeTabs count={pendingAmount} />
              </>
            }
            key="pending"
          />
        </Tabs>
        {
          activeTab === 'need-reporting'
            ? <TobeReported {...tobeReportedProps} />
            : (
              <PendingApproval
                {...{
                  results: pendingApproval,
                  project,
                  keyword,
                  editing,
                  editPeriod,
                  handleOnEdit,
                  setPendingApproval,
                  calculatePendingAmount,
                  handlePendingApproval
                }}
              />
            )
        }
      </div>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr, resultRdr }) => ({ userRdr, resultRdr, needsReportingTimeoutDays })
)(ResultAdmin)
