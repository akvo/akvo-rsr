/* global window, document */
import React, { useEffect, useState, useRef } from 'react'
import { Collapse, Row, Col, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import classNames from 'classnames'

import StickyClass from '../program/sticky-class'
import ExpandIcon from '../program/ExpandIcon'
import Highlighted from '../../components/Highlighted'
import { sizes } from '../program/config'
import { setNumberFormat } from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'
import ProgramContributor from './ProgramContributor'
import DisaggregationsBar from './DisaggregationsBar'
import { handleOnFiltering } from './query'

const { Panel } = Collapse

const ProgramView = ({
  dataId,
  targetsAt,
  search,
  results,
  filtering,
  setResults
}) => {
  const { t } = useTranslation()

  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const tooltipRef = useRef(null)
  const disaggTooltipRef = useRef(null)
  let scrollingTransition
  let tmid

  const dataResults = handleOnFiltering(results, filtering)

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
    tooltipRef.current = document.getElementById('bar-tooltip')
    disaggTooltipRef.current = document.getElementById('disagg-bar-tooltip')
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={results.map((r) => r.id)}
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
    >
      {dataResults.map(result => (
        <Panel
          key={result.id}
          header={(
            <StickyClass offset={20}>
              <h1><Highlighted text={result.title} highlight={search} /></h1>
              <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicators.length })}</span></div>
            </StickyClass>
          )}
        >
          <Collapse
            defaultActiveKey={result.indicators.map((i) => i.id)}
            expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          >
            {result.indicators.map((i) => {
              const sumActualValue = i
                .periods
                .reduce((total, currentValue) => total + currentValue.actualValue, 0)
              return (
                <Panel
                  key={i.id}
                  header={(
                    <StickyClass top={40}>
                      <h3><Highlighted text={i.title} highlight={search} /></h3>
                      <div><span className="type">{i.type}</span> <span className="periods">{t('nperiods', { count: i.periods.length })}</span></div>
                    </StickyClass>
                  )}
                >
                  <div className="indicator">
                    {((targetsAt && targetsAt === 'indicator') && (i?.targetValue)) && (
                      <Row type="flex" justify="end" align="middle">
                        <Col span={4} className="stats-indicator text-right">
                          <div className="stat value">
                            <div className="label">aggregated actual value</div>
                            <b>{setNumberFormat(sumActualValue)}</b><br />
                            <span>
                              of <b>{i?.targetValue}</b> target
                            </span>
                          </div>
                        </Col>
                        <Col span={4}>
                          <TargetCharts targetValue={i?.targetValue} actualValue={sumActualValue} />
                        </Col>
                      </Row>
                    )}
                    <Collapse
                      destroyInactivePanel
                      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                    >
                      {i?.periods?.map((p) => (
                        <Panel
                          key={p.id}
                          className={classNames(i.type, { single: p.single })}
                          header={(
                            <>
                              <div>
                                <h5>{moment(p.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(p.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</h5>
                                <ul className="small-stats">
                                  <li><b>{p?.contributors?.length}</b> {t('contributor_s', { count: p?.contributors?.length })}</li>
                                  <li><b>{0}</b> {t('country_s', { count: 0 })}</li>
                                </ul>
                              </div>
                              {
                                (i.type === 'quantitative' && p?.fetched) && (
                                  <>
                                    <div className={classNames('stats', { extended: p?.targetValue > 0 })}>
                                      {/* start dsg */}
                                      {(p.disaggregations.length > 0) && <DisaggregationsBar dsgItems={p.dsgItems} tooltipRef={disaggTooltipRef} />}
                                      {/* end dsg */}
                                      <div className="stat value">
                                        <div className="label">aggregated actual value</div>
                                        <b>{setNumberFormat(p.actualValue)}</b>
                                        {targetsAt && targetsAt === 'period' && p?.targetValue > 0 && (
                                          <span>
                                            of <b>{setNumberFormat(p?.targetValue)}</b> target
                                          </span>
                                        )}
                                      </div>
                                      {targetsAt && targetsAt === 'period' && p?.targetValue > 0 && <TargetCharts actualValue={p.actualValue} targetValue={p?.targetValue} />}
                                    </div>
                                    <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
                                      {p.contributors.sort((a, b) => b.total - a.total).map((it, _index) =>
                                        <li
                                          key={_index}
                                          className={classNames({ pinned: pinned === _index })}
                                          style={{ flex: it.total }}
                                          onClick={(e) => clickBar(_index, e)}
                                          onMouseEnter={(e) => mouseEnterBar(_index, setNumberFormat(it.total), e)}
                                          onMouseLeave={(e) => mouseLeaveBar(_index, it.total, e)}
                                        />
                                      )}
                                    </ul>
                                  </>
                                )
                              }
                            </>
                          )}
                        >
                          <div ref={ref => { listRef.current = ref }}>
                            {
                              p.contributors.length === 0
                                ? <Empty />
                                : (
                                  <ProgramContributor
                                    type={i.type}
                                    scoreOptions={i.scoreOptions}
                                    actualValue={p.actualValue}
                                    onChange={handleAccordionChange}
                                    {...p}
                                    {...{
                                      dataId,
                                      pinned,
                                      openedItem,
                                      results,
                                      setResults,
                                    }}
                                  />
                                )
                            }
                          </div>
                        </Panel>
                      ))}
                    </Collapse>
                  </div>
                </Panel>
              )
            })}
          </Collapse>
        </Panel>
      ))}
    </Collapse>
  )
}

export default ProgramView
