import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import { groupBy, uniq } from 'lodash'

import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { aggregatedIcons } from './config'
import { getAllJobByRootPeriod, getAllPeriods, getProjectByPeriodID, getSummaryStatus } from './services'
import * as actions from './store/actions'

const AggregatedActual = ({
  value,
  total,
  periodId,
  jobs,
  callback,
  programmeRdr,
  setRootPeriodJobStatus,
}) => {
  const [items, setItems] = useState([])
  const [preload, setPreload] = useState({
    fetched: (jobs === undefined),
    created: (jobs === undefined),
  })

  useEffect(() => {
    if (items.length === 0 && preload.fetched && preload.created) {
      setPreload({
        ...preload,
        fetched: false,
      })
      getAllJobByRootPeriod(periodId)
        .then((res) => {
          if (res.length === 0) {
            setPreload({
              created: false,
              fetched: false,
            })
          }
          setItems(res)
        })
        .catch(() => {
          setPreload({
            created: false,
            fetched: false,
          })
        })
    }
    if (items.length && !preload.fetched && preload.created) {
      setPreload({
        ...preload,
        created: false,
      })
      setRootPeriodJobStatus(periodId, items)
    }
  }, [items, preload])

  const _periods = getAllPeriods(programmeRdr)
  const _projects = jobs?.length ? jobs?.map((j) => getProjectByPeriodID(_periods, j?.period)) : []
  const _projectGrouped = groupBy(_projects, 'projectId')
  const _latestJobs = Object.values(_projectGrouped)?.map((p) => p?.shift())?.map((p) => p?.job)
  const groupedStatus = groupBy(_latestJobs, 'status')
  const allStatus = uniq(Object.keys(groupedStatus))
  const job = getSummaryStatus(allStatus)
  const jobAmount = groupedStatus[job?.status]?.length || 0
  const iconType = aggregatedIcons[job?.status] || null
  return (
    <Aggregation onClick={e => e.stopPropagation()}>
      <Aggregation.Col icon>
        {iconType && (
          <Aggregation.Popover status={job?.status} amount={jobAmount} total={total} callback={callback}>
            <Icon type={iconType} className={job?.status} width="20px" height="20px" />
          </Aggregation.Popover>
        )}
        {(preload.fetched || preload.created) && <Spin indicator={<Icon type="loading" />} spinning />}
      </Aggregation.Col>
      <Aggregation.Col>
        <Aggregation.Value>
          {value}
        </Aggregation.Value>
      </Aggregation.Col>
    </Aggregation>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(AggregatedActual)
