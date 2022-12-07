/* global document */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { getStatusFiltering } from './utils/filters'
import { getFlatten, getShrink, setNumberFormat } from '../../utils/misc'
import DisaggregationsBar from './DisaggregationsBar'
import TargetCharts from '../../utils/target-charts'
import * as actions from './store/actions'
import { getAllActualValues } from './utils/services'

const PeriodHeader = ({
  id: periodID,
  filtering,
  listRef,
  pinned,
  tooltipRef,
  targetsAt,
  periodStart,
  periodEnd,
  countries,
  contributors,
  indicatorType,
  fetched,
  targetValue,
  actualValue,
  disaggregations,
  dsgItems,
  disaggTooltipRef,
  match: { params },
  updateReportingPeriod,
  programRdr,
}) => {
  const [preload, setPreload] = useState(true)
  const { t } = useTranslation()
  const { hasPeriod, hasCountry, hasContrib, hasAnyFilters } = getStatusFiltering(filtering)

  const mouseEnterBar = (index, value, ev) => {
    if (pinned === index || !listRef.current) return
    if (listRef.current.children[0].children[index]) {
      listRef.current.children[0].children[index].classList.add('active')
    }
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div>${value}</div>`
      tooltipRef.current.style.opacity = 1
      const rect = ev.target.getBoundingClientRect()
      const bodyRect = document.body.getBoundingClientRect()
      tooltipRef.current.style.top = `${(rect.top - bodyRect.top) - 40}px`
      tooltipRef.current.style.left = `${rect.left + (rect.right - rect.left) / 2}px`
    }
  }

  const mouseLeaveBar = (index) => {
    if (!listRef.current) return
    if (listRef.current.children[0].children[index]) {
      listRef.current.children[0].children[index].classList.remove('active')
    }
    tooltipRef.current.style.opacity = 0
  }

  const clickBar = (index, e) => {
    e.stopPropagation()
    if (listRef.current.children[0].children[index]) {
      if (listRef.current.children[0].children[index].classList.contains('ant-collapse-item-active') === false) {
        listRef.current.children[0].children[index].children[0].click()
      }
    }
  }
  useEffect(() => {
    if (preload && fetched === undefined) {
      setPreload(false)
      const allContributors = getFlatten(contributors)
      const idPeriods = allContributors?.map((cb) => cb?.id)
      const dataIDs = [periodID, ...idPeriods]?.join(',')
      getAllActualValues(params.projectId, dataIDs, (data) => {
        const [_period, ..._contribs] = data
        const _allContribs = _contribs
          ?.map(cb => {
            const findContrib = allContributors?.find((it) => it?.id === cb?.id)
            if (findContrib) {
              return ({ ...findContrib, ...cb })
            }
            return cb
          })
        const _contributors = getShrink(_allContribs)
        updateReportingPeriod(_period, _contributors)
      })
    }

    if (preload && fetched) {
      setPreload(false)
    }
  }, [preload, fetched, programRdr])
  return (
    <>
      <div>
        <h5 className={classNames({ 'color-periods': (hasPeriod) })}>
          {`${moment(periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - ${moment(periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}`}
        </h5>
        <ul className="small-stats">
          {((contributors?.length > 0 && !hasAnyFilters) || (hasAnyFilters && contributors?.flatMap((c) => c?.contributors)?.length === 0)) && (
            <li className={classNames({ 'color-contributors': (hasContrib) })}>
              <b className={classNames({ 'color-contributors': (hasContrib) })}>
                {contributors?.length}
              </b>{' '}
              {t('contributor_s', { count: contributors?.length })}
            </li>
          )}
          {(countries.length > 1) && (
            <li className={classNames({ 'color-countries': (hasCountry) })}>
              <b className={classNames({ 'color-countries': (hasCountry) })}>
                {countries.length}
              </b>
              {` ${t('country_s', { count: countries.length })}`}
            </li>
          )}
        </ul>
      </div>
      {
        (
          (indicatorType === 'quantitative' && fetched) ||
          (hasAnyFilters && actualValue > 0)
        ) && (
          <>
            <div className={classNames('stats', { extended: targetValue > 0 })}>
              {/* start dsg */}
              {(disaggregations.length > 0) && <DisaggregationsBar dsgItems={dsgItems} tooltipRef={disaggTooltipRef} />}
              {/* end dsg */}
              <div className="stat value">
                <div className="label">aggregated actual</div>
                <b>{setNumberFormat(Number(actualValue))}</b>
                {targetsAt && targetsAt === 'period' && targetValue > 0 && (
                  <span>
                    of <b>{setNumberFormat(targetValue)}</b> target
                  </span>
                )}
              </div>
              {targetsAt && targetsAt === 'period' && targetValue > 0 && <TargetCharts actualValue={actualValue} targetValue={targetValue} />}
            </div>
            <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
              {contributors.sort((a, b) => b.actualValue - a.actualValue).map((it, _index) =>
                <li
                  key={_index}
                  className={classNames({ pinned: pinned === _index })}
                  style={{ flex: it.actualValue }}
                  onClick={(e) => clickBar(_index, e)}
                  onMouseEnter={(e) => mouseEnterBar(_index, setNumberFormat(it.actualValue), e)}
                  onMouseLeave={(e) => mouseLeaveBar(_index, it.actualValue, e)}
                />
              )}
            </ul>
          </>
        )
      }
    </>
  )
}

export default connect(
  ({ programRdr }) => ({ programRdr }), actions
)(withRouter(PeriodHeader))
