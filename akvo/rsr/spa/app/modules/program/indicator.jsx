/* global window, document */
import React, { useState, useRef, useEffect } from 'react'
import { Collapse } from 'antd'
import moment from 'moment'

import ExpandIcon from './ExpandIcon'
import ProgramPeriod from './ProgramPeriod'
import { sizes } from './config'
import AggregationModal from './AggregationModal'

const Indicator = ({
  periods,
  indicatorType,
  scoreOptions,
  targetsAt,
  fetched,
}) => {
  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const [countriesFilter, setCountriesFilter] = useState([])
  const [activePeriod, setActivePeriod] = useState({
    popUp: false,
    period: null,
  })
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const tooltipRef = useRef(null)
  const disaggTooltipRef = useRef(null)

  let scrollingTransition
  let tmid

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
      <Collapse defaultActiveKey={[0]} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {
          periods
            ?.sort((a, b) => moment(a.periodEnd, 'DD/MM/YYYY').format('YYYY') - moment(b.periodEnd, 'DD/MM/YYYY').format('YYYY'))
            ?.map((period, index) => {
              const filteredContributors = period?.filteredContributors || period.contributors
              const aggFilteredTotal = filteredContributors.reduce((prev, value) => prev + value.actualValue, 0)
              const aggFilteredTotalTarget = filteredContributors.reduce((prev, value) => prev + (value.targetValue ? value.targetValue : 0), 0)
              const actualValue = period.actualValue
              const targetValue = period.targetValue
              return (
                <ProgramPeriod
                  key={index}
                  {...{
                    fetched,
                    listRef,
                    tooltipRef,
                    disaggTooltipRef,
                    period,
                    targetsAt,
                    indicatorType,
                    scoreOptions,
                    filteredContributors,
                    actualValue,
                    targetValue,
                    aggFilteredTotalTarget,
                    aggFilteredTotal,
                    pinned,
                    countriesFilter,
                    openedItem,
                    periodIndex: index,
                    activePeriod,
                    setActivePeriod,
                    handleCountryFilter: setCountriesFilter,
                    handleAccordionChange
                  }}
                />
              )
            })
        }
      </Collapse>
      {activePeriod?.period && (
        <AggregationModal
          {...activePeriod?.period}
          popUp={activePeriod?.popUp}
          handleOnOk={() => setActivePeriod({
            ...activePeriod,
            popUp: !activePeriod?.popUp
          })}
        />
      )
      }
    </div>
  )
}

export default Indicator
