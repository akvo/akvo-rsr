/* global window, document */
import React, { useRef, useState, useEffect } from 'react'
import { Collapse, Icon, Select } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Chart from 'chart.js'
import Color from 'color'
import ShowMoreText from 'react-show-more-text'
import countriesDict from '../../utils/countries-dict'

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
    <div className={classNames('comments', {'no-comments': items.length === 0})}>
      {items.length === 0 &&
      <p>No comments for this period</p>
      }
      {items.length > 0 &&
      <ul>
        {items.map(item =>
          <li>
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
  if(items.length === 0) return null
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
        </li>
      ))}
    </ul>
  )
}

const fnum = num => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const dsgColors = ['#19204b', '#1d2964', '#23347c', '#2c498b', '#35619b', '#3e78ab', '#4891bb', '#52aacb', '#6abdd0', '#8ecccc', '#b4dbcb', '#dceac9']
const dsgColorsPlus = []; dsgColors.forEach(clr => { dsgColorsPlus.push(clr); dsgColorsPlus.push(Color(clr).lighten(1.5).hex()) })

const hasDisaggregations = period => !(period.disaggregationTargets.filter(it => it.value).length <= 1 && period.disaggregationContributions.filter(it => it.value).length <= 1)

const Charts = ({ period }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    let percent = (period.actualValue / period.targetValue) * 100
    if(percent > 100) percent = 100
    const datasets = [
      {
        data: [percent, 100 - percent],
        backgroundColor: ['#389a90', '#e1eded'],
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff',
        hoverBackgroundColor: ['#389a90', '#e1eded'],
        borderWidth: 3
      }
    ]
    const labels = []
    const _chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: { datasets, labels },
      options: {
        cutoutPercentage: 37,
        circumference: Math.PI,
        rotation: -Math.PI,
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        }
      }
    })
  }, [])
  return (
    <div className="charts">
      <canvas width={150} height={68} ref={ref => { canvasRef.current = ref }} />
      <div className="percent-label">{Math.round((period.actualValue / period.targetValue) * 100)}%</div>
    </div>
  )
}

const Disaggregations = ({ period, disaggTooltipRef: tooltipRef }) => {
  const barRef = useRef(null)
  const mouseEnterBar = (disagg, ev) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div><b>${disagg.type}</b><br />${String(disagg.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${(disagg.target !== null) ? ` of ${String(disagg.target).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : ''}</div>`
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
  period.disaggregationContributions.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = period.disaggregationTargets.find(it => it.category === item.category && it.type === item.type)
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

let scrollingTransition
let tmid

const Period = ({ period, periodIndex, indicatorType, ...props }) => {
  const { t } = useTranslation()
  const [pinned, setPinned] = useState(-1)
  const [openedItem, setOpenedItem] = useState(null)
  const [countriesFilter, setCountriesFilter] = useState([])
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const tooltipRef = useRef(null)
  const disaggTooltipRef = useRef(null)
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
  const filterProjects = it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }
  const handleScroll = () => {
    if (pinnedRef.current !== -1 && !scrollingTransition && listRef.current.children[0].children[pinnedRef.current]) {
      const diff = (window.scrollY + 103) - (listRef.current.children[0].children[pinnedRef.current].offsetParent.offsetTop + 63 + (pinnedRef.current * 75))
      if (diff < -20 || diff > listRef.current.children[0].children[pinnedRef.current].clientHeight) {
        _setPinned(-1)
      }
    }
  }
  const handleAccordionChange = (index) => {
    setOpenedItem(index)
    _setPinned(Number(index))
    if(index != null){
      const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
      const stickyHeaderHeight = 115
      clearTimeout(tmid)
      scrollingTransition = true
      window.scroll({ top: offset - stickyHeaderHeight, behavior: 'smooth' })
      tmid = setTimeout(() => { scrollingTransition = false }, 1000)
    }
  }
  useEffect(() => {
    tooltipRef.current = document.getElementById('bar-tooltip')
    disaggTooltipRef.current = document.getElementById('disagg-bar-tooltip')
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])
  const filteredContributors = period.contributors.filter(filterProjects)
  const aggFilteredTotal = filteredContributors.reduce((prev, value) => prev + value.actualValue, 0)
  return (
    <Panel
      {...props}
      key={periodIndex}
      className={classNames(indicatorType, { empty: period.contributors.length === 0, single: period.contributors.length === 1 || period.contributors.filter(it => it.actualValue > 0).length === 0 })}
      header={[
        <div>
          <h5>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</h5>
          <ul className="small-stats">
            <li><b>{period.contributors.length}</b> {t('contributor_s', { count: period.contributors.length })}</li>
            <li><b>{period.countries.length}</b> {t('country_s', { count: period.countries.length })}</li>
          </ul>
        </div>,
        indicatorType === 'quantitative' &&
        <div className={classNames('stats', { extended: period.targetValue > 0 })}>{/* eslint-disable-line */}
          {hasDisaggregations(period) && (
            <Disaggregations {...{ period, disaggTooltipRef }} />
          )}
          <div className="stat value">
            <div className="label">aggregated actual value</div>
            <b>{String(period.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            {period.targetValue > 0 && (
              <span>
                of <b>{fnum(period.targetValue)}</b> target
              </span>
            )}
          </div>
          {period.targetValue > 0 &&
            <Charts period={period} />
          }
        </div>,
        indicatorType === 'quantitative' && period.contributors.filter(it => it.actualValue > 0).length > 1 &&
        <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
          {period.contributors.filter(filterProjects).sort((a, b) => b.actualValue - a.actualValue).map((it, _index) =>
            <li className={pinned === _index ? 'pinned' : null} style={{ flex: it.actualValue }} onClick={(e) => clickBar(_index, e)} onMouseEnter={(e) => mouseEnterBar(_index, String(it.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ','), e)} onMouseLeave={(e) => mouseLeaveBar(_index, it.actualValue, e)} /> // eslint-disable-line
          )}
        </ul>
      ]}
    >
      {period.contributors.length > 1 &&
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
                  indicatorType === 'quantitative' &&
                  [
                    <div className="total">
                      <i>total</i>
                      <div>
                        <b>{String(project.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b><br />
                      </div>
                    </div>,
                    Number(openedItem) === _index ?
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
                  ],
                  indicatorType === 'qualitative' &&
                  [
                    <div className="updates">
                      <Icon type="align-left" /> {getAggregatedUpdatesLength(project)} Updates
                    </div>
                  ]
                ]}
              >
                {indicatorType === 'qualitative' && <Updates project={project} />}
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
                      <div className="value">
                        {indicatorType === 'quantitative' && [
                          <b>{String(subproject.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>,
                          <small>{Math.round((subproject.actualValue / project.actualValue) * 100 * 10) / 10}%</small>
                        ]}
                        {subproject.updates.length > 0 &&
                          <div className="updates-popup">
                            <header>{subproject.updates.length} approved updates</header>
                            <ul>
                              {subproject.updates.map(update => <li><span>{moment(update.createdAt).format('DD MMM YYYY')}</span><span>{update.user.name}</span><b>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></li>)}
                            </ul>
                          </div>
                        }
                      </div>
                      {indicatorType === 'qualitative' && <Updates project={subproject} />}
                    </li>
                  ))}
                </ul>
                {indicatorType === 'quantitative' && <Comments project={project} />}
              </Panel>
            )
          }
          )}
        </Collapse>
      </div>
    </Panel>
  )
}

const Indicator = ({ periods, indicatorType }) => {
  return (
    <div className="indicator">
      <Collapse destroyInactivePanel expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {periods.map((period, index) => <Period {...{ period, index, indicatorType}} />)}
      </Collapse>
    </div>
  )
}

export default Indicator
