/* global document */
import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import uniq from 'lodash/uniq'
import { useTranslation } from 'react-i18next'

import { getStatusFiltering } from '../program/utils/filters'
import { getAllContributors, setNumberFormat } from '../../utils/misc'
import DisaggregationsBar from './DisaggregationsBar'
import TargetCharts from '../../utils/target-charts'
import AggregatedActual from '../program/AggregatedActual'

const PeriodHeader = ({
  id: periodId,
  jobs,
  filtering,
  listRef,
  pinned,
  tooltipRef,
  targetsAt,
  periodStart,
  periodEnd,
  contributors,
  indicatorType,
  fetched,
  targetValue,
  actualValue,
  disaggregations,
  disaggregationTargets,
  disaggTooltipRef,
  callback
}) => {
  const { t } = useTranslation()
  const { hasPeriod, hasAnyFilters } = getStatusFiltering(filtering)
  const countries = uniq(
    getAllContributors(contributors)
      .filter((cb) => (cb?.country))
      .map((cb) => cb.country.isoCode)
  )

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
  return (
    <>
      <div data-id={periodId}>
        <h5 className={classNames({ 'color-periods': (hasPeriod) })}>
          {`${moment(periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - ${moment(periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}`}
        </h5>
        <ul className="small-stats">
          {((contributors?.length > 0 && !hasAnyFilters) || (hasAnyFilters && contributors?.flatMap((c) => c?.contributors)?.length === 0)) && (
            <li>
              <b>
                {contributors?.length}
              </b>{' '}
              {t('contributor_s', { count: contributors?.length })}
            </li>
          )}
          {(countries?.length > 1 && !hasAnyFilters) && (
            <li>
              <b>
                {countries?.length}
              </b>
              {` ${t('country_s', { count: countries?.length })}`}
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
              {(disaggregations.length > 0) && <DisaggregationsBar {...{ disaggregations, disaggregationTargets }} tooltipRef={disaggTooltipRef} />}
              {/* end dsg */}
              <div className="stat value">
                <div className="label">aggregated actual</div>
                <AggregatedActual
                  {...{
                    periodStart,
                    periodEnd,
                    periodId,
                    jobs,
                  }}
                  value={actualValue}
                  total={contributors?.length}
                  callback={callback}
                />
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

export default PeriodHeader
