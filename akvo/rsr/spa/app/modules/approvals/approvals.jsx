import { Button, Icon, Spin, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import ShowMoreText from 'react-show-more-text'
import InfiniteScroll from 'react-infinite-scroller'
import api, { config } from '../../utils/api'
import PeriodModal from './period-modal'
import './styles.scss'
import { nicenum } from '../../utils/misc'
import { Disaggregations, CondWrap } from '../results/pending-approval'

const pageSize = 20

const Approvals = ({ params, periods, setPeriods, pendingUpdates, setPendingUpdates }) => {
  const [openPeriod, setOpenPeriod] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState([true, true])
  const [updating, setUpdating] = useState([])
  const [shownUpdates, setShownUpdates] = useState([])
  // const [results, setResults]
  const { t } = useTranslation()
  useEffect(() => {
    if(Object.keys(periods).length === 0){
      const _config = cloneDeep(config)
      delete _config.transformResponse
      axios({ url: `/program/${params.id}/approvals/periods/`, ..._config })
        .then(({ data }) => {
          setPeriods(data)
          setLoading([false, true])
          api.get(`/program/${params.id}/approvals/pending-updates/`)
          .then(({ data }) => {
            setLoading([false, false])
            setPendingUpdates(data)
            setShownUpdates(data.slice(0, pageSize))
          })
      })
    }
  }, [])
  const openModal = (period) => {
    setOpenPeriod(period)
    setModalVisible(true)
  }
  const updatePeriods = (locked, $periods, periodKey) => {
    const updated = cloneDeep(periods)
    $periods.forEach(period => {
      updated[periodKey][period.projectId].periods[period.id].locked = locked
    })
    setPeriods(updated)
    // update selected period
    const projects = Object.keys(updated[periodKey]).map(projectId => updated[periodKey][projectId])
    const projectsLocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked === false).length === 0)
    const projectsUnlocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked).length === 0)
    setOpenPeriod({ dates: periodKey.split('-'), projects: updated[periodKey], projectsLocked, projectsUnlocked })

    api.post('/set-periods-locked/', {
      periods: $periods.map(it => it.id),
      locked
    })
  }
  const handleUpdateStatus = (update, status) => () => {
    setUpdating((updating) => {
      return [...updating, update.id]
    })
    api.patch(`/indicator_period_data_framework/${update.id}/`, {
      status
    }).then(() => {
      // const _results = cloneDeep(results)
      // const _update = _results.find(it => it.id === update.result.id)
      //   ?.indicators.find(it => it.id === update.indicator.id)
      //   ?.periods.find(it => it.id === update.period.id)
      //   ?.updates.find(it => it.id === update.id)
      // if (_update) {
      //   _update.status = status
      //   setResults(_results)
      //   setUpdating((updating) => {
      //     return updating.filter(it => it.id !== update.id)
      //   })
      // }
    })
  }
  return (
    <div className="approvals">
      <h4>Period locking</h4>
      <div className="periods">
        {loading[0] &&
        <div className="spin-container">
          <Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} />
        </div>
        }
        <ul>
          {Object.keys(periods).map(periodKey => {
            const dates = periodKey.split('-')
            if(dates[0] === '' || dates[1] === '') return null
            const projects = Object.keys(periods[periodKey]).map(projectId => periods[periodKey][projectId])
            const projectsLocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked === false).length === 0)
            const projectsUnlocked = projects.filter(it => Object.keys(it.periods).filter(periodId => it.periods[periodId].locked).length === 0)
            return (
              <li onClick={() => openModal({ dates, projects: periods[periodKey], projectsLocked, projectsUnlocked })}>
                <div className="label">period</div>
                <b>{moment(dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</b>
                {projectsUnlocked.length === 0 ? (
                  <div className="status locked">
                    <Icon type="lock" />
                    locked for {projectsLocked.length} projects
                  </div>
                ) : projectsLocked.length === 0 ? (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for all {Object.keys(periods[periodKey]).length} projects
                  </div>
                ) : (
                  <div className="status unlocked">
                    <Icon type="unlock" />
                    unlocked for {projectsUnlocked.length} <span>of {projects.length} projects</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <PeriodModal visible={modalVisible} onCancel={() => setModalVisible(false)} period={openPeriod} periods={periods} updatePeriods={updatePeriods} />
      <div className="pending">
        <header>
          <h4>{!loading[1] && <b>{pendingUpdates.length}</b>} Updates pending approval</h4>
          <div className="filters">
            Author, Project name, project location
          </div>
        </header>
        {loading[1] &&
          <div className="spin-container">
            <Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} />
          </div>
        }
        <InfiniteScroll
          pageStart={1}
          loadMore={(page) => { setShownUpdates([...shownUpdates, ...pendingUpdates.slice(page * pageSize, pageSize)]) }}
          threshold={250}
          hasMore={shownUpdates.length < pendingUpdates.length}
          loader={<div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} /></div>}
        >
        {shownUpdates.map((update, index) => {
          const isUpdating = updating.indexOf(update.id) !== -1
          return [
            (index > 0 && pendingUpdates[index - 1].indicator.id === update.indicator.id) ? '' : (
              <ul>
                <li>
                  <div className="label">project</div>
                  <h5>{update.project.title}</h5>
                </li>
                <Icon type="right" />
                <li>
                  <div className="label">result</div>
                  <h5>{update.result.title}</h5>
                </li>
                <Icon type="right" />
                <li>
                  <div className="label">indicator</div>
                  <h5>{update.indicator.title}</h5>
                </li>
              </ul>
            ),
            (index > 0 && pendingUpdates[index - 1].period.id === update.period.id) ? '' : (
              <div className="period-caption">{moment(update.period.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(update.period.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}</div>
            ),
            <div className="row">
              <ul>
                {update.indicator.type === 1 &&
                  <li>
                    <div className="label">{t('value')}</div>
                    <strong className="value">{nicenum(update.value)}</strong>
                  </li>
                }
                <Disaggregations values={update.disaggregations} />
                {update.indicator.type === 2 &&
                  <li>
                    <div className="label">{t('update')}</div>
                    <div className="qualitative-value">
                      <ShowMoreText lines={7}>{update.narrative}</ShowMoreText>
                    </div>
                  </li>
                }
                <CondWrap wrap={update.indicator.type === 2}>
                  <li>
                    <div className="label">{t('submitted')}</div>
                    <div className="value">{moment(update.createdAt).fromNow()} by {update.userDetails.firstName} {update.userDetails.lastName}</div>
                  </li>
                  {update.fileSet?.length > 0 &&
                    <li className="attachments">
                      <div className="label">{t('attachments')}</div>
                      {update.fileSet.map(file => {
                        const parts = file.file.split('/')
                        const filename = parts[parts.length - 1]
                        const nameParts = filename.split('.')
                        return <a href={file.file}><Tag>{nameParts[nameParts.length - 1]}</Tag>{filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}</a>
                      })}
                    </li>
                  }
                </CondWrap>
              </ul>
              <div className="btns">
                <Button type="primary" loading={isUpdating} disabled={isUpdating} onClick={handleUpdateStatus(update, 'A')}>Approve</Button>
                <Button type="link" disabled={isUpdating} onClick={handleUpdateStatus(update, 'R')}>Decline</Button>
              </div>
            </div>
          ]
        })}
        </InfiniteScroll>
      </div>
    </div>
  )
}


export default Approvals
