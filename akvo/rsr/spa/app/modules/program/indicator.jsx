/* eslint-disable react/no-danger */
/* global window, document */
import React, { useRef, useState, useEffect } from 'react'
import { Collapse, Icon, Select, Tooltip, Row, Col } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Color from 'color'
import ShowMoreText from 'react-show-more-text'
import countriesDict from '../../utils/countries-dict'
import {setNumberFormat} from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const { Option } = Select

const Comments = ({ project }) => {
  const items = project.updates.filter(it => it.status && it.status.code === 'A')
  return (
    <div className={classNames('comments', { 'no-comments': items.length === 0 })}>
      {items.length === 0 &&
        <p>No comments for this period</p>
      }
      {items.length > 0 &&
        <ul>
          {items.map((item, key) =>
            <li key={key}>
              <b>{item.user.name}</b> <span className="date">{moment(item.createdAt).format('HH:mm, DD MMM YYYY')}</span>
              <ShowMoreText lines={7}>
                <p dangerouslySetInnerHTML={{ __html: item.narrative.replace(/\n/g, '<br />') }} />
              </ShowMoreText>
            </li>
          )}
        </ul>
      }
    </div>
  )
}
const Updates = ({ project }) => {
  const items = project.updates.filter(it => it.status && it.status.code === 'A')
  if (items.length === 0) return null
  return (
    <ul className="updates">
      {items.map(item => (
        <li>
          <div className="leftside">
            <i>{moment(item.createdAt).format('HH:mm, DD MMM YYYY')}</i>
            <i>{item.user.name}</i>
          </div>
          <div className="text">
            <ShowMoreText lines={7}>
              <p dangerouslySetInnerHTML={{ __html: item.narrative.replace(/\n/g, '<br />') }} />
            </ShowMoreText>
          </div>
          {item.scoreIndex != null && (
            <div className={`score-box score-${item.scoreIndex}`}>score {item.scoreIndex + 1}</div>
          )}
        </li>
      ))}
    </ul>
  )
}

const fnum = num => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const dsgColors = ['#19204b', '#1d2964', '#23347c', '#2c498b', '#35619b', '#3e78ab', '#4891bb', '#52aacb', '#6abdd0', '#8ecccc', '#b4dbcb', '#dceac9']
const dsgColorsPlus = []; dsgColors.forEach(clr => { dsgColorsPlus.push(clr); dsgColorsPlus.push(Color(clr).lighten(1.5).hex()) })

const hasDisaggregations = period => !(period.disaggregationTargets.filter(it => it.value).length <= 1 && period.disaggregationContributions.filter(it => it.value).length <= 1)

let scrollingTransition
let tmid
const stickyHeaderHeight = 162 + 80

const Period = ({ period, periodIndex, targetsAt, indicatorType, scoreOptions, topCountryFilter, ...props }) => {
  const { t } = useTranslation()
  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const [countriesFilter, setCountriesFilter] = useState([])
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const tooltipRef = useRef(null)
  const disaggTooltipRef = useRef(null)
  const dsgContrib = useRef([])
  const dsgTargets = useRef([])
  const mouseEnterBar = (index, value, ev) => {
    if (pinned === index || !listRef.current) return
    listRef.current.children[0].children[index].classList.add('active')
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
    listRef.current.children[0].children[index].classList.remove('active')
    tooltipRef.current.style.opacity = 0
  }
  const _setPinned = (to) => {
    setPinned(to)
    pinnedRef.current = to
  }
  const clickBar = (index, e) => {
    e.stopPropagation()
    if (listRef.current.children[0].children[index].classList.contains('ant-collapse-item-active') === false) {
      listRef.current.children[0].children[index].children[0].click()
    }
  }
  const handleCountryFilter = (countries) => {
    setCountriesFilter(countries)
  }
  const filterProjects = it => {
    if (countriesFilter.length === 0 && topCountryFilter.length === 0) return true
    if (topCountryFilter && topCountryFilter.length > 0) {
      return topCountryFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1
    }
    return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1
  }
  const handleScroll = () => {
    if (pinnedRef.current !== -1 && !scrollingTransition && listRef.current.children[0].children[pinnedRef.current]) {
      const diff = (window.scrollY + stickyHeaderHeight) - (listRef.current.children[0].children[pinnedRef.current].offsetParent.offsetTop + 63 + (pinnedRef.current * 75))
      if (diff < -20 || diff > listRef.current.children[0].children[pinnedRef.current].clientHeight) {
        _setPinned(-1)
      }
    }
  }
  const handleAccordionChange = (index) => {
    setOpenedItem(index)
    _setPinned(Number(index))
    if (index != null) {
      const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
      clearTimeout(tmid)
      scrollingTransition = true
      window.scroll({ top: offset - stickyHeaderHeight, behavior: 'smooth' })
      tmid = setTimeout(() => { scrollingTransition = false }, 1000)
    }
  }
  const filteredContributors = period.contributors.filter(filterProjects)
  const filteredCountries = topCountryFilter.length > 0 ? topCountryFilter : period.countries
  const aggFilteredTotal = filteredContributors.reduce((prev, value) => prev + value.actualValue, 0)
  const aggFilteredTotalTarget = filteredContributors.reduce((prev, value) => prev + (value.targetValue ? value.targetValue : 0), 0)
  const actualValue = topCountryFilter.length > 0 ? aggFilteredTotal : period.actualValue
  const targetValue = topCountryFilter.length > 0 ? aggFilteredTotalTarget : period.targetValue
  useEffect(() => {
    tooltipRef.current = document.getElementById('bar-tooltip')
    disaggTooltipRef.current = document.getElementById('disagg-bar-tooltip')
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    let disaggregationTargets = []
    let disaggregationContributions = []
    disaggregationTargets = filteredContributors.reduce((acc, val) => [...acc, ...val.disaggregationTargets], [])
    disaggregationTargets.forEach((item, index) => {
      const firstIndex = disaggregationTargets.findIndex(it => it.category === item.category && it.type === item.type)
      if (firstIndex < index) disaggregationTargets[firstIndex].value += item.value
    })
    disaggregationTargets = disaggregationTargets.filter((item, index) => { const firstIndex = disaggregationTargets.findIndex(it => it.category === item.category && it.type === item.type); return firstIndex === index })
    dsgTargets.current = disaggregationTargets
    disaggregationContributions = filteredContributors.reduce((acc, val) => {
      return [...acc, ...val.disaggregationContributions, ...val.updates.reduce((ac, upd) => [...ac, ...upd.disaggregations], [])]
    }, [])
    disaggregationContributions.forEach((item, index) => {
      const firstIndex = disaggregationContributions.findIndex(it => it.category === item.category && it.type === item.type)
      if (firstIndex < index) disaggregationContributions[firstIndex].value += item.value
    })
    disaggregationContributions = disaggregationContributions.filter((item, index) => { const firstIndex = disaggregationContributions.findIndex(it => it.category === item.category && it.type === item.type); return firstIndex === index })
    dsgContrib.current = disaggregationContributions
  }, [period])
  return (
    <Panel
      {...props}
      key={periodIndex}
      className={classNames(indicatorType, { single: filteredContributors.length === 1 || filteredContributors.filter(it => it.actualValue > 0).length === 0 })}
      header={[
        <div>
          <h5>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</h5>
          <ul className="small-stats">
            <li><b>{filteredContributors.length}</b> {t('contributor_s', { count: filteredContributors.length })}</li>
            <li><b>{filteredCountries.length}</b> {t('country_s', { count: filteredCountries.length })}</li>
          </ul>
        </div>,
        indicatorType === 'quantitative' &&
        <div className={classNames('stats', { extended: period.targetValue > 0 })}>{/* eslint-disable-line */}
          {hasDisaggregations(period) && (
            <Disaggregations {...{ disaggTooltipRef, disaggregationContributions: dsgContrib.current, disaggregationTargets: dsgTargets.current }} />
          )}
          <div className="stat value">
            <div className="label">aggregated actual value</div>
            <b>{String(actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            {targetsAt && targetsAt === 'period' && targetValue > 0 && (
              <span>
                of <b>{fnum(topCountryFilter.length > 0 ? aggFilteredTotalTarget : period.targetValue)}</b> target
              </span>
            )}
          </div>
          {targetsAt && targetsAt === 'period' && targetValue > 0 && <TargetCharts {...{ actualValue, targetValue }} />}
        </div>,
        indicatorType === 'quantitative' && filteredContributors.filter(it => it.actualValue > 0).length > 1 &&
        <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
          {filteredContributors.sort((a, b) => b.actualValue - a.actualValue).map((it, _index) =>
            <li className={pinned === _index ? 'pinned' : undefined} style={{ flex: it.actualValue }} onClick={(e) => clickBar(_index, e)} onMouseEnter={(e) => mouseEnterBar(_index, String(it.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ','), e)} onMouseLeave={(e) => mouseLeaveBar(_index, it.actualValue, e)} /> // eslint-disable-line
          )}
        </ul>
      ]}
    >
      {(period.contributors.length > 1 && !topCountryFilter) &&
        <div className="filters">
          <Select
            className="country-filter"
            mode="multiple"
            allowClear
            placeholder={<span><Icon type="filter" /> Filter countries</span>}
            onChange={handleCountryFilter}
            value={countriesFilter}
          >
            {period.countries.map(it => <Option value={it.isoCode}>{countriesDict[it.isoCode]} ({period.contributors.filter(_it => _it.country && _it.country.isoCode === it.isoCode).length})</Option>)}
          </Select>
          {countriesFilter.length > 0 && [
            <span className="filtered-project-count label">{period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).length} projects</span>,
            <div className="total">
              <span className="label">Filtered {Math.round((aggFilteredTotal / period.actualValue) * 100 * 10) / 10}% of total</span>
              <b>{String(aggFilteredTotal).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            </div>
          ]}
        </div>
      }
      <div ref={ref => { listRef.current = ref }}>
        {period.contributors.length === 0 &&
          <span>No data</span>
        }
        <Collapse onChange={handleAccordionChange} defaultActiveKey={period.contributors.length === 1 ? '0' : null} accordion className="contributors-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
          {filteredContributors.sort((a, b) => b.actualValue - a.actualValue).map((project, _index) => {
            const getAggregatedUpdatesLength = (_project) => {
              let total = 0
              total += _project.updates.filter(it => it.status && it.status.code === 'A').length
              _project.contributors.forEach(contrib => {
                total += getAggregatedUpdatesLength(contrib)
              })
              return total
            }
            let ProjectSummary = []
            if (indicatorType === 'quantitative') {
              ProjectSummary = [
                <div className="total">
                  <i>total</i>
                  <div>
                    <b>{String(project.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b><br />
                  </div>
                </div>,
                openedItem === _index ?
                  <div className="value">
                    <b>{String(project.updatesValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                    {project.actualValue > 0 && <small>{Math.round(((project.updatesValue) / project.actualValue) * 100 * 10) / 10}%</small>}
                    {project.updates.length > 0 &&
                      <div className="updates-popup">
                        <header>{project.updates.length} approved updates</header>
                        <ul>
                          {project.updates.map(update => <li><span>{moment(update.createdAt).format('DD MMM YYYY')}</span><span>{update.user.name}</span><b>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></li>)}
                        </ul>
                      </div>
                    }
                  </div> :
                  <div className="value">
                    <b>{String(project.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                    {aggFilteredTotal > 0 && <small>{Math.round((project.actualValue / aggFilteredTotal) * 100 * 10) / 10}%</small>}
                  </div>
              ]
            }
            else if (project.contributors.length === 0 && project.scoreIndex != null) {
              ProjectSummary = (
                <div className={`project-summary single-score score-${project.scoreIndex}`}>Score {project.scoreIndex + 1}</div>
              )
            }
            else if (project.contributors.length > 0 && scoreOptions != null) {
              const scores = {}
              project.contributors.forEach(contrib => {
                if (contrib.scoreIndex != null) {
                  if (!scores[contrib.scoreIndex]) scores[contrib.scoreIndex] = 0
                  scores[contrib.scoreIndex] += 1
                }
              })
              ProjectSummary = (
                <ul className="project-summary score-aggregate">
                  {Object.keys(scores).map(ind =>
                    <Tooltip title={scoreOptions[Number(ind)]}>
                      <li className={`score-${Number(ind) + 1}`}>
                        <div className="cap">score {Number(ind) + 1}</div>
                        <div>{scores[ind]} <small>projects</small></div>
                      </li>
                    </Tooltip>
                  )}
                </ul>
              )
            }
            else {
              ProjectSummary = [
                <div className="updates">
                  <Icon type="align-left" /> {getAggregatedUpdatesLength(project)} Updates
                </div>
              ]
            }
            return (
              <Panel
                className={classNames(indicatorType, { pinned: pinned === _index })}
                key={_index}
                header={[
                  <div className="title">
                    <h4>{project.projectTitle}</h4>
                    <p>
                      {project.projectSubtitle && <span>{project.projectSubtitle}</span>}
                      {project.country && <span><Icon type="environment" /> {countriesDict[project.country.isoCode]}</span>}
                    &nbsp;
                      {project.contributors.length > 0 && <b>{t('nsubcontributors', { count: project.contributors.length })}</b>}
                      <b>&nbsp;</b>
                    </p>
                  </div>,
                  ProjectSummary
                ]}
              >
                {(indicatorType === 'qualitative' && scoreOptions == null) && <Updates project={project} />}
                <ul className="sub-contributors">
                  {project.contributors.map(subproject => (
                    <li>
                      <div>
                        <h5>{subproject.projectTitle}</h5>
                        <p>
                          {subproject.projectSubtitle && <span>{subproject.projectSubtitle}</span>}
                          {subproject.country && <span><Icon type="environment" /> {countriesDict[subproject.country.isoCode]}</span>}
                        </p>
                      </div>
                      <div className={classNames('value', `score-${subproject.scoreIndex + 1}`, { score: indicatorType === 'qualitative' && scoreOptions != null })}>
                        {indicatorType === 'quantitative' && [
                          <b>{String(subproject.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>,
                          <small>{Math.round((subproject.actualValue / project.actualValue) * 100 * 10) / 10}%</small>
                        ]}
                        {(indicatorType === 'qualitative' && scoreOptions != null) && (
                          <div className="score-box">Score {subproject.scoreIndex + 1}</div>
                        )}
                        {subproject.updates.length > 0 &&
                          <div className="updates-popup">
                            <header>{subproject.updates.length} approved updates</header>
                            <ul>
                              {subproject.updates.map(update => (
                                <li>
                                  <span>{moment(update.createdAt).format('DD MMM YYYY')}</span>
                                  <span>{update.user.name}</span>
                                  {update.value && <b>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>}
                                  {update.scoreIndex != null && <b><small>Score {update.scoreIndex + 1}</small></b>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        }
                      </div>
                      {(indicatorType === 'qualitative' && scoreOptions == null) && <Updates project={subproject} />}
                    </li>
                  ))}
                </ul>
                {(indicatorType === 'quantitative' || scoreOptions != null) && <Comments project={project} />}
              </Panel>
            )
          }
          )}
        </Collapse>
      </div>
    </Panel>
  )
}


const Disaggregations = ({ disaggTooltipRef: tooltipRef, disaggregationContributions, disaggregationTargets }) => {
  const { t } = useTranslation()
  const barRef = useRef(null)
  const mouseEnterBar = (disagg, ev) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div><b>${disagg.type}</b><br />${String(disagg.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${(disagg.target > 0) ? t(' of {{target}}', { target: String(disagg.target).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }) : ''}</div>`
      tooltipRef.current.style.opacity = 1
      const rect = ev.target.getBoundingClientRect()
      const barRect = barRef.current.getBoundingClientRect()
      const bodyRect = document.body.getBoundingClientRect()
      tooltipRef.current.style.top = `${(barRect.top - bodyRect.top) + 50}px`
      tooltipRef.current.style.left = `${rect.left + (rect.right - rect.left) / 2 - 2}px`
    }
  }
  const mouseLeaveBar = () => {
    tooltipRef.current.style.opacity = 0
  }
  const dsgGroups = {}
  disaggregationContributions.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = disaggregationTargets.find(it => it.category === item.category && it.type === item.type)
    dsgGroups[item.category].push({ ...item, target: target ? target.value : null })
  })
  return (
    <div className="disaggregation-groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value; if (it.target > maxValue) maxValue = it.target })
        return (
          <div className="stat">
            <div className="label">{dsgKey}</div>
            <div className="disaggregations-bar" ref={(ref) => { barRef.current = ref }}>
              {dsgGroups[dsgKey].map(item => (
                <div className="dsg-item" onMouseEnter={(ev) => mouseEnterBar(item, ev)} onMouseLeave={mouseLeaveBar}>
                  <div className="color" style={{ height: (item.value / maxValue) * 40 }} />
                  {(item.target !== null) && <div className="target color" style={{ height: (item.target / maxValue) * 40 }} />}
                </div>))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Indicator = ({ periods, indicatorType, countryFilter, scoreOptions, targetsAt, indicator }) => {
  const initActualValue = 0
  const sumActualValue = periods.reduce((total, currentValue) => total + currentValue.actualValue, initActualValue)
  return (
    <div className="indicator">
      {targetsAt && targetsAt === 'indicator' && (
        <Row>
          <Col span={16} />
          <Col span={4} className="stats-indicator">
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
        {periods.map((period, index) => <Period {...{ period, index, targetsAt, indicatorType, scoreOptions, topCountryFilter: countryFilter }} />)}
      </Collapse>
    </div>
  )
}

export default Indicator
