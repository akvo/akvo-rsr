/* global window */
import React, { useState, useEffect } from 'react'
import { Tabs, Badge, Typography, Button, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import { FilterBar } from '../results-overview/components'
import Portal from '../../utils/portal'
import { isPeriodNeedsReporting } from '../results/filters'
// import { TobeReported } from './components'
import TobeReported from './TobeReported'
import PendingApproval from './PendingApproval'
import api from '../../utils/api'
import '../results/enumerator.scss'

const { TabPane } = Tabs
const { Text } = Typography

const BadgeTabs = ({ ...props }) => <Badge {...props} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset', marginLeft: '1em', fontWeight: 'bold' }} />

const ResultAdmin = ({
  id,
  userRdr,
  periods,
  results,
  needsReportingTimeoutDays
}) => {
  const { t } = useTranslation()
  const [tobeReported, setTobeReported] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [pendingApproval, setPendingApproval] = useState([])
  const [selected, setSelected] = useState(null)
  const [tobeReportedItems, setTobeReportedItems] = useState([])
  const [activeTab, setActiveTab] = useState('need-reporting')
  const [pendingAmount, setPendingAmount] = useState(0)
  const [periodsAmount, setPeriodsAmount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [filtering, setFiltering] = useState(false)
  const [editing, setEditing] = useState(null)
  const [keyword, setKeyword] = useState(null)

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
        return indicator.periods.filter(period => period.updates.filter(update => update.status === 'P').length > 0).length > 0
      }).length > 0
    })
    listPending = [
      ...listPending.map(item => {
        return {
          ...item,
          indicators: item.indicators.filter(indicator => {
            return indicator.periods.filter(period => period.updates.filter(update => update.status === 'P').length > 0).length > 0
          })
            .map(indicator => {
              return {
                ...indicator,
                periods: indicator.periods.filter(period => period.updates.filter(update => update.status === 'P').length > 0)
              }
            })
        }
      })
    ]
    calculatePendingAmount(listPending)
    setPendingApproval(listPending)
  }

  const handleTobeReported = (selectedPeriod = null) => {
    let listTobeReported = results.filter(result => {
      return result.indicators.filter(indicator => {
        return indicator.periods.filter(period => isPeriodNeedsReporting(period, needsReportingTimeoutDays)).length > 0
      }).length > 0
    })
    listTobeReported = [
      ...listTobeReported.map(item => {
        return {
          ...item,
          indicators: item.indicators.filter(indicator => {
            return indicator.periods.filter(period => isPeriodNeedsReporting(period, needsReportingTimeoutDays)).length > 0
          })
            .map(indicator => {
              return {
                ...indicator,
                periods: indicator.periods.filter(period => {
                  return isPeriodNeedsReporting(period, needsReportingTimeoutDays)
                })
              }
            })
        }
      })
    ]
    let indicators = listTobeReported.flatMap(item => item.indicators)
    if (selectedPeriod) {
      indicators = indicators.filter(indicator => {
        return indicator.periods.filter(period => period.periodStart === selectedPeriod.periodStart && period.periodEnd === selectedPeriod.periodEnd).length > 0
      })
        .map(indicator => ({
          ...indicator,
          periods: indicator.periods.filter(period => period.periodStart === selectedPeriod.periodStart && period.periodEnd === selectedPeriod.periodEnd)
        }))
    }
    const pAmount = indicators
          ?.flatMap((i) => i?.periods)
          ?.flatMap((p) => p?.updates?.length ? p.updates : [{ ...p }])
          ?.length
    setPeriodsAmount(pAmount)
    setTobeReportedItems(indicators)
    setSelected(indicators[0])
    setTobeReported(listTobeReported)
  }

  const handleOnFiltering = (items, value) => {
    return items
      .flatMap(item => item.indicators)
      .filter(item => item.title.toLowerCase().includes(value?.trim()?.toLowerCase()))
  }

  const handleOnSearch = (value) => {
    setKeyword(value)
    const needReportingItems = handleOnFiltering(tobeReported, value)
    const pAmount = needReportingItems
          ?.flatMap((i) => i?.periods)
          ?.flatMap((p) => p?.updates?.length ? p.updates : [{ ...p }])
          ?.length
    setPeriodsAmount(pAmount)
    setTobeReportedItems(needReportingItems)
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
      handlePendingApproval(results)
    }
    setFiltering(true)
  }

  const handleOnSelectPeriod = (value) => {
    const allPeriods = value.trim().split('-')
    const periodStart = allPeriods[0].trim()
    const periodEnd = allPeriods[1]
    const selectedPeriod = periodEnd === undefined ? null : { periodStart, periodEnd: periodEnd.trim() }
    handleTobeReported(selectedPeriod)
    setFiltering(true)
  }

  const editPeriod = (period, indicator) => {
    const indIndex = tobeReportedItems.findIndex(it => it.id === indicator.id)
    const prdIndex = tobeReportedItems[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(tobeReportedItems)
    updated[indIndex].periods[prdIndex] = period
    const pAmount = updated
          ?.flatMap((i) => i?.periods)
          ?.flatMap((p) => p?.updates?.length ? p.updates : [{ ...p }])
          ?.length
    setPeriodsAmount(pAmount)
    setTobeReportedItems(updated)
    setSelected(updated[indIndex])
  }

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
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

  const tobeReportedProps = {
    results: tobeReported,
    indicators: tobeReportedItems,
    keyword,
    editing,
    editPeriod,
    setTobeReportedItems,
    setTobeReported,
    setPeriodsAmount,
    handleOnEdit: (item) => {
      handleOnSetEditing(tobeReportedItems, item)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('rt') && params.get('rt') === 'preview') setIsPreview(true)
    handlePendingApproval(results)
    handleTobeReported()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="mne-view">
      <div className="main-content filterBarVisible">
        <div className="filter-bar">
          <FilterBar {...{ periods, handleOnSearch, handleOnSelectPeriod }} />
          <Portal>
            <div className="beta">
              <div className="label">
                <Icon type="experiment" />
                {t('New view (beta)')}
              </div>
              <Button type="danger" href={`/${userRdr?.lang}/myrsr/my_project/${id}/`}>{t('Older version')}</Button>
            </div>
          </Portal>
        </div>
        <Tabs type="card" style={{ marginTop: '1em' }} onChange={key => setActiveTab(key)}>
          <TabPane
            tab={
              <>
                <Text>{t('To be Reported')}</Text>
                <BadgeTabs count={periodsAmount} />
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
                  projectId: id,
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
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr }) => ({ userRdr, needsReportingTimeoutDays })
)(ResultAdmin)
