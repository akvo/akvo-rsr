/* global window */
import React, { useState, useEffect } from 'react'
import { Tabs, Badge, Typography, Button, Icon, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import { FilterBar } from '../results-overview/components'
import Portal from '../../utils/portal'
import { isPeriodNeedsReporting } from '../results/filters'
import { TobeReported } from './components'
import PendingApproval from '../results/pending-approval'
import ReportedEdit from './components/ReportedEdit'
import api from '../../utils/api'
import '../results/enumerator.scss'

const { TabPane } = Tabs
const { Text } = Typography

const BadgeTabs = ({ ...props }) => <Badge {...props} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset', marginLeft: '1em', fontWeight: 'bold' }} />

const Routes = ({
  id,
  activeTab,
  editing,
  filtering,
  setFiltering,
  editPeriod,
  updatePendingUpdate,
  pendingApproval,
  onEditRedirect,
  handleOnEdit,
  handlePendingApproval,
  deletePendingUpdate,
  deleteFile,
  ...props
}) => {
  switch (activeTab) {
    case 'editing':
      return (
        <ReportedEdit
          {...{
            editing,
            editPeriod,
            onEditRedirect,
            deletePendingUpdate,
            deleteFile,
            updatePendingUpdate
          }}
        />
      )
    case 'pending':
      return (
        <PendingApproval
          projectId={id}
          results={pendingApproval}
          setResults={handlePendingApproval}
          {...{
            filtering,
            setFiltering,
            onEdit: handleOnEdit
          }}
        />
      )
    default:
      return <TobeReported {...props} />
  }
}

const ResultAdmin = ({
  id,
  userRdr,
  periods,
  results,
  setResults,
  needsReportingTimeoutDays,
  jwtView
}) => {
  const { t } = useTranslation()
  const [tobeReported, setTobeReported] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [pendingApproval, setPendingApproval] = useState([])
  const [mobilePage, setMobilePage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [tobeReportedItems, setTobeReportedItems] = useState([])
  const [recentIndicators, setRecentIndicators] = useState([]) // used to preserve the just-completed indicators visible
  const [activeTab, setActiveTab] = useState('need-reporting')
  const [pendingAmount, setPendingAmount] = useState(0)
  const [periodsAmount, setPeriodsAmount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [filtering, setFiltering] = useState(false)
  const [editing, setEditing] = useState(null)

  const updatePeriodsAmount = (indicators) => {
    /**
     * recalculate amount of periods
     */
    const filtered = indicators.map(indicator => {
      return {
        ...indicator,
        periods: indicator.periods.filter(period => {
          return isPeriodNeedsReporting(period, needsReportingTimeoutDays)
        })
      }
    })
    setPeriodsAmount(filtered.flatMap(item => item.periods).length)
  }

  const calculatePendingAmount = (items) => {
    return items
      .flatMap(item => item.indicators)
      .flatMap(item => item.periods)
      .flatMap(item => item.updates)
      .filter(item => item.status === 'P').length
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
    const nPending = calculatePendingAmount(listPending)
    setPendingAmount(nPending)
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
    if(selectedPeriod) {
      indicators = indicators.filter(indicator => {
        return indicator.periods.filter(period => period.periodStart === selectedPeriod.periodStart && period.periodEnd === selectedPeriod.periodEnd).length > 0
      })
      .map(indicator => ({
        ...indicator,
        periods: indicator.periods.filter(period => period.periodStart === selectedPeriod.periodStart && period.periodEnd === selectedPeriod.periodEnd)
      }))
    }
    setPeriodsAmount(indicators.flatMap(indicator => indicator.periods).length)
    setTobeReportedItems(indicators)
    setSelected(indicators[0])
    setTobeReported(listTobeReported)
  }

  const handleOnFiltering = (items, value) => {
    return items
        .flatMap(item => item.indicators)
        .filter(item => item.title.toLowerCase().includes(value.toLowerCase()))
  }

  const handleOnSearch = (value) => {
    const needReportingItems = handleOnFiltering(tobeReported, value)
    setPeriodsAmount(needReportingItems.flatMap(indicator => indicator.periods).length)
    setTobeReportedItems(needReportingItems)
    if(value){
      const pendingItems = handleOnFiltering(pendingApproval, value)
      const pendingFiltered = [
        ...pendingApproval.map(pending => {
          return {
            ...pending,
            indicators: pending.indicators.filter(item => pendingItems.filter(indicator => indicator.id === item.id).length > 0)
          }
        })
      ]
      const nPending = calculatePendingAmount(pendingFiltered)
      setPendingAmount(nPending)
      setPendingApproval(pendingFiltered)
    }else{
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

  const mobileGoBack = () => {
    setMobilePage(0)
  }

  const setActiveIndicator = (indicator) => {
    setSelected(indicator)
    setMobilePage(1)
  }

  const addUpdateToPeriod = (update, period, indicator) => {
    const pendingReports = tobeReported.map((tb) => ({
      ...tb,
      indicators: tb.indicators.map((i) => ({
        ...i,
        periods: i.periods.map((p) => {
          if (p.id === period.id) {
            return ({
              ...p,
              updates: [
                update,
                ...p.updates
              ]
            })
          }
          return p
        })
      }))
    }))
    setTobeReported(pendingReports)
    const pendings = tobeReportedItems.map((i) => {
      if (i.id === indicator.id) {
        return ({
          ...i,
          periods: i.periods.map((p) => {
            if (p.id === period.id) {
              return ({
                ...p,
                updates: [
                  update,
                  ...p.updates
                ]
              })
            }
            return p
          })
        })
      }
      return i
    })
    setTobeReportedItems(pendings)
    setSelected(pendings.find((ps) => ps.id === indicator.id))
  }

  const patchUpdateInPeriod = (update, period, indicator) => {
    const indIndex = tobeReportedItems.findIndex(it => it.id === indicator.id)
    const prdIndex = tobeReportedItems[indIndex].periods.findIndex(it => it.id === period.id)
    const updIndex = tobeReportedItems[indIndex].periods[prdIndex].updates.findIndex(it => it.id === update.id)
    const updated = cloneDeep(tobeReportedItems)
    updated[indIndex].periods[prdIndex].updates = [...updated[indIndex].periods[prdIndex].updates.slice(0, updIndex), update, ...updated[indIndex].periods[prdIndex].updates.slice(updIndex + 1)]
    updatePeriodsAmount(updated)

    setTobeReportedItems(updated)
    setSelected(updated[indIndex])
    // update root data
    const _results = cloneDeep(results)
    const _update = _results.find(it => it.id === indicator.resultId)
      ?.indicators.find(it => it.id === indicator.id)
      ?.periods.find(it => it.id === period.id)
      ?.updates.find(it => it.id === update.id)
    if (_update) {
      Object.keys(update).forEach(prop => {
        _update[prop] = update[prop]
      })
      setResults(_results)
    }
    setRecentIndicators([...recentIndicators, indicator.id])
  }

  const editPeriod = (period, indicator) => {
    const indIndex = tobeReportedItems.findIndex(it => it.id === indicator.id)
    const prdIndex = tobeReportedItems[indIndex].periods.findIndex(it => it.id === period.id)
    const updated = cloneDeep(tobeReportedItems)
    updated[indIndex].periods[prdIndex] = period
    setPeriodsAmount(updated?.flatMap(item => item.periods).length)
    setTobeReportedItems(updated)
    setSelected(updated[indIndex])
  }

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  const onEditRedirect = () => {
    setActiveTab('pending')
    setEditing(null)
  }

  const deleteUpdate = (update, periodId, indicatorId, resultId) => {
    const _results = cloneDeep(tobeReported)
    const _period = _results.find(it => it.id === resultId)
      ?.indicators.find(it => it.id === indicatorId)
      ?.periods.find(it => it.id === periodId)
    if (!_period) return
    _period.updates.splice(_period.updates.findIndex(it => it.id === update.id), 1)
    const needReportingItems = _results
      ?.flatMap(r => r.indicators)
      ?.map((i) => {
        if (i.id === _period.indicator) {
          return ({
            ...i,
            periods: i.periods.map((p) => p.id === _period.id ? _period : p)
          })
        }
        return i
      })
    setTobeReported(_results)
    setPeriodsAmount(needReportingItems.length)
    setTobeReportedItems(needReportingItems)
    setSelected(needReportingItems.find((i) => i.id === _period.indicator))
  }

  const deletePendingUpdate = (update) => {
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#f5222d' }} />,
      title: 'Do you want to delete this update?',
      content: 'You’ll lose this update if you click OK',
      onOk() {
        api.delete(`/indicator_period_data_framework/${update.id}/`)
        const pendings = pendingApproval.map((pa) => ({
          ...pa,
          indicators: pa.indicators.map((pi) => ({
            ...pi,
            periods: pi.periods.map((pd) => ({
              ...pd,
              updates: pd.updates.filter((u) => u.id !== update.id)
            }))
          }))
        }))
        setPendingApproval(pendings)
        const nPending = calculatePendingAmount(pendings)
        setPendingAmount(nPending)
        onEditRedirect()
      }
    })
  }
  const updatePendingUpdate = (update) => {
    const pendings = pendingApproval.map((pa) => ({
      ...pa,
      indicators: pa.indicators.map((pi) => ({
        ...pi,
        periods: pi.periods.map((pd) => ({
          ...pd,
          updates: pd.updates.map((u) => u.id === update.id ? update : u)
        }))
      }))
    }))
    setPendingApproval(pendings)
    const nPending = calculatePendingAmount(pendings)
    setPendingAmount(nPending)
  }
  const handleOnEdit = (item) => {
    const indicators = pendingApproval?.flatMap((p) => p.indicators)
    const indicator = indicators?.find((i) => i.id === item.indicator.id)
    setEditing({
      ...item,
      indicator,
      note: item?.comments[0]?.comment || '',
      period: indicator?.periods?.find((p) => p.id === item.period.id)
    })
    setActiveTab('editing')
  }

  const deleteFile = (file) => {
    Modal.confirm({
      title: 'Are you sure to delete this photo?',
      content: 'After this action you can\'t put it back',
      onOk() {
        api
          .delete(`/indicator_period_data/${file.updateId}/files/${file.uid}/`)
          .then(() => {
            if (editing) {
              setEditing({
                ...editing,
                fileSet: editing?.fileSet?.filter((fs) => fs.id !== file.uid)
              })
            }
          })
      }
    })
  }

  const tobeReportedProps = {
    indicators: tobeReportedItems,
    mneView: true,
    userRdr,
    scrollPosition,
    selected,
    mobilePage,
    mobileGoBack,
    addUpdateToPeriod,
    patchUpdateInPeriod,
    editPeriod,
    isPreview,
    jwtView,
    setActiveIndicator,
    deleteUpdate
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
        <Tabs type="card" style={{ marginTop: '1em' }} onChange={key => setActiveTab(key)} activeKey={activeTab}>
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
          {editing && <TabPane tab="Edit Update" key="editing" />}
        </Tabs>
        <Routes
          {...{
            id,
            activeTab,
            editing,
            filtering,
            setFiltering,
            editPeriod,
            updatePendingUpdate,
            pendingApproval,
            onEditRedirect,
            handleOnEdit,
            handlePendingApproval,
            deletePendingUpdate,
            deleteFile,
            ...tobeReportedProps
          }}
        />
      </div>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { needsReportingTimeoutDays } } }, userRdr }) => ({ userRdr, needsReportingTimeoutDays })
)(ResultAdmin)
