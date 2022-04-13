/* global window, document */
import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Collapse } from 'antd'
import { setNumberFormat } from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'
import ExpandIcon from './ExpandIcon'
import ProgramPeriod from './ProgramPeriod'
import { sizes } from './config'

const Indicator = ({
  periods,
  indicatorType,
  countryFilter,
  scoreOptions,
  targetsAt,
  indicator
}) => {
  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const [countriesFilter, setCountriesFilter] = useState([])
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const tooltipRef = useRef(null)
  const disaggTooltipRef = useRef(null)

  const initActualValue = 0
  const sumActualValue = periods.reduce((total, currentValue) => total + currentValue.actualValue, initActualValue)
  let scrollingTransition
  let tmid

  const filterProjects = it => {
    if (countriesFilter.length === 0 && countryFilter.length === 0) return true
    if (countryFilter && countryFilter.length > 0) {
      return countryFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1
    }
    return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1
  }
  const _setPinned = (to) => {
    setPinned(to)
    pinnedRef.current = to
  }

  const handleAccordionChange = (index) => {
    setOpenedItem(index)
    _setPinned(Number(index))
    if (index != null) {
      const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
      clearTimeout(tmid)
      scrollingTransition = true
      window.scroll({ top: offset - sizes.stickyHeader.height, behavior: 'smooth' })
      tmid = setTimeout(() => {
        scrollingTransition = false
      }, 1000)
    }
  }

  const handleScroll = () => {
    if (pinnedRef.current !== -1 && !scrollingTransition && listRef.current.children[0].children[pinnedRef.current]) {
      const diff = (window.scrollY + sizes.stickyHeader.height) - (listRef.current.children[0].children[pinnedRef.current].offsetParent.offsetTop + 63 + (pinnedRef.current * 75))
      if (diff < -20 || diff > listRef.current.children[0].children[pinnedRef.current].clientHeight) {
        _setPinned(-1)
      }
    }
  }
  useEffect(() => {
    tooltipRef.current = document.getElementById('bar-tooltip')
    disaggTooltipRef.current = document.getElementById('disagg-bar-tooltip')
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="indicator">
      {((targetsAt && targetsAt === 'indicator') && (indicator?.targetValue)) && (
        <Row type="flex" justify="end" align="middle">
          <Col span={4} className="stats-indicator text-right">
            <div className="stat value">
              <div className="label">aggregated actual value</div>
              <b>{setNumberFormat(sumActualValue)}</b><br />
              <span>
                of <b>{indicator?.targetValue}</b> target
              </span>
            </div>
          </Col>
          <Col span={4}>
            <TargetCharts targetValue={indicator?.targetValue} actualValue={sumActualValue} />
          </Col>
        </Row>
      )}
      <Collapse destroyInactivePanel expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {periods.map((period, index) => {
          const filteredContributors = period.contributors.filter(filterProjects)
          const filteredCountries = countryFilter.length > 0 ? countryFilter : period.countries
          const aggFilteredTotal = filteredContributors.reduce((prev, value) => prev + value.actualValue, 0)
          const aggFilteredTotalTarget = filteredContributors.reduce((prev, value) => prev + (value.targetValue ? value.targetValue : 0), 0)
          const actualValue = countryFilter.length > 0 ? aggFilteredTotal : period.actualValue
          const targetValue = countryFilter.length > 0 ? aggFilteredTotalTarget : period.targetValue
          return (
            <ProgramPeriod
              key={index}
              {...{
                listRef,
                tooltipRef,
                disaggTooltipRef,
                period,
                targetsAt,
                indicatorType,
                scoreOptions,
                countryFilter,
                filteredContributors,
                filteredCountries,
                actualValue,
                targetValue,
                aggFilteredTotalTarget,
                aggFilteredTotal,
                pinned,
                countriesFilter,
                openedItem,
                periodIndex: index,
                handleCountryFilter: setCountriesFilter,
                handleAccordionChange
              }}
            />
          )
        })}
      </Collapse>
    </div>
  )
}

export default Indicator
