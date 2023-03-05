/* eslint-disable no-restricted-globals */
/* global window, document */
import React, { useEffect, useState, useRef } from 'react'
import {
  Collapse,
  Row,
  Col,
  Spin,
  Icon
} from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { connect } from 'react-redux'
import moment from 'moment'
import isNaN from 'lodash/isNaN'

import StickyClass from '../program/sticky-class'
import ExpandIcon from '../../components/ExpandIcon'
import Highlighted from '../../components/Highlighted'
import PeriodHeader from './PeriodHeader'
import { sizes } from '../program/config'
import { setNumberFormat } from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'
import ProgramContributor from './ProgramContributor'
import { getStatusFiltering } from '../program/utils/filters'
import ActualValueApi from './ActualValueApi'
import AggregationModal from '../program/AggregationModal'

const { Panel } = Collapse

const ProgramView = ({
  targetsAt,
  search,
  programmeRdr: results,
  filterRdr: filtering,
}) => {
  const { t } = useTranslation()
  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const [indicatorKeys, setIndicatorKeys] = useState(['0'])
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
  const { hasPeriod, allFilters } = getStatusFiltering(filtering)
  const hasAnyFilters = (allFilters.length > 0)

  const _setPinned = (to) => {
    setPinned(to)
    pinnedRef.current = to
  }

  const handleAccordionChange = (index) => {
    setOpenedItem(index)
    _setPinned(Number(index))
    if (index != null) {
      // const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
      clearTimeout(tmid)
      scrollingTransition = true
      // window.scroll({ top: offset - sizes.stickyHeader.height, behavior: 'smooth' })
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

  const clickOnViewAll = (period) => {
    setActivePeriod({
      period,
      popUp: !activePeriod?.popUp
    })
  }

  useEffect(() => {
    tooltipRef.current = document.getElementById('bar-tooltip')
    disaggTooltipRef.current = document.getElementById('disagg-bar-tooltip')
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Collapse
        bordered={false}
        defaultActiveKey={['0']}
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      >
        {results.map((result, rx) => (
          <Panel
            key={rx}
            header={(
              <StickyClass offset={20}>
                <h1><Highlighted text={result.title} highlight={search} /></h1>
                <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicators.length })}</span></div>
              </StickyClass>
            )}
          >
            <Collapse
              activeKey={indicatorKeys}
              onChange={setIndicatorKeys}
              expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
            >
              {
                result
                  .indicators
                  .sort((a, b) => a?.title?.localeCompare(b.title))
                  .map((i, index) => {
                    const pKeys = i?.periods.map((_, px) => `${px}`)
                    const defaultPeriodKey = (targetsAt === 'indicator') ? pKeys : []
                    const hasAChart = (
                      (targetsAt && targetsAt === 'indicator') && (i?.targetValue) &&
                (indicatorKeys.includes(`${index}`))
                    )
                    const colTitle = hasAChart
                      ? { xl: 18, lg: 14, md: 12, sm: 24, xs: 24 }
                      : { span: 24 }
                    const indicatorActualValue = i?.periods
                ?.filter((p) => i?.cumulative
                  ? (moment().isBetween(moment(p?.periodStart, 'DD/MM/YYYY'), moment(p?.periodEnd, 'DD/MM/YYYY')))
                  : p
                )
                ?.reduce((total, currentValue) => parseFloat(total) + parseFloat(currentValue.actualValue), 0)
                    return (
                      <Panel
                        key={index}
                        className={classNames({ hasAnyFilters })}
                        header={(
                          <StickyClass top={40}>
                            <Row gutter={[8, { sm: 32, xs: 32 }]}>
                              <Col {...colTitle}>
                                <h3><Highlighted text={i.title} highlight={search} /></h3>
                                <div>
                                  <span className="type">{i.type}</span>
                                  <span className={classNames('periods', { 'color-periods': (hasPeriod) })}>{t('nperiods', { count: i.periods.length })}</span>
                                </div>
                              </Col>
                              {(hasAChart) && (
                                <Col xl={6} lg={10} md={12} sm={24} xs={24}>
                                  <Row type="flex" justify="end">
                                    <Col span={10} className="stats-indicator text-right">
                                      <div className="stat value">
                                        <div className="label">Aggregate Actual</div>
                                        <b>
                                          {
                                            isNaN(indicatorActualValue)
                                              ? '...'
                                              : setNumberFormat(indicatorActualValue)
                                          }
                                        </b><br />
                                        <span>
                                          of <b>{setNumberFormat(i?.targetValue)}</b> target
                                        </span>
                                      </div>
                                    </Col>
                                    <Col span={14}>
                                      {
                                        (isNaN(indicatorActualValue))
                                          ? <div className="program-loading"><Icon type="loading" spin /></div>
                                          : <TargetCharts targetValue={i?.targetValue} actualValue={indicatorActualValue} />
                                      }
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                            </Row>
                          </StickyClass>
                        )}
                      >
                        <div className="indicator">
                          <Collapse
                            defaultActiveKey={defaultPeriodKey}
                            expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                          >
                            {i
                          ?.periods
                          ?.sort((a, b) => moment(a.periodEnd, 'DD/MM/YYYY').format('YYYY') - moment(b.periodEnd, 'DD/MM/YYYY').format('YYYY'))
                          ?.map((p, px) => {
                            return (
                              <Panel
                                key={px}
                                className={classNames(i.type, {
                                  single: p.single,
                                  emptyBar: !p?.actualValue,
                                  hasAChart,
                                  hasAnyFilters
                                })}
                                header={(
                                  <PeriodHeader
                                    indicatorType={i?.type}
                                    {...p}
                                    {...{
                                      filtering,
                                      listRef,
                                      pinned,
                                      targetsAt,
                                      tooltipRef,
                                      disaggTooltipRef,
                                    }}
                                    callback={() => clickOnViewAll(p)}
                                  />
                                )}
                              >
                                <Spin spinning={false} indicator={<Icon type="loading" style={{ fontSize: 36 }} />}>
                                  <div ref={ref => { listRef.current = ref }}>
                                    <ActualValueApi periodID={p?.id} contributors={p?.contributors} />
                                    <ProgramContributor
                                      type={i.type}
                                      scoreOptions={i.scoreOptions}
                                      actualValue={p.actualValue}
                                      onChange={handleAccordionChange}
                                      {...p}
                                      {...{
                                        pinned,
                                        openedItem,
                                        filtering,
                                      }}
                                    />
                                  </div>
                                </Spin>
                              </Panel>
                            )
                          })}
                          </Collapse>
                        </div>
                      </Panel>
                    )
                  })
              }
            </Collapse>
          </Panel>
        ))}
      </Collapse>
      <AggregationModal
        {...activePeriod?.period}
        popUp={activePeriod?.popUp}
        handleOnOk={() => setActivePeriod({
          ...activePeriod,
          popUp: !activePeriod?.popUp
        })}
      />
    </>
  )
}

export default connect(
  ({ programmeRdr, filterRdr }) => ({ programmeRdr, filterRdr }), null
)(ProgramView)
