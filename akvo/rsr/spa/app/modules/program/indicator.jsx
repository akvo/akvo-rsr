/* global window, document */
import React, { useRef, useState, useEffect } from 'react'
import { Collapse, Icon, Select } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import Chart from 'chart.js'
import Color from 'color'
import countriesDict from '../../utils/countries-dict'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const { Option } = Select

const Comments = ({ project }) => {
  const items = project.updates.filter(it => it.text)
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
            <p>{item.text}</p>
          </li>
        )}
      </ul>
      }
    </div>
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
            <div onMouseEnter={(ev) => mouseEnterBar(item, ev)} onMouseLeave={mouseLeaveBar}>
              <div style={{ height: (item.value / maxValue) * 40 }} />
              {(item.target !== null) && <div className="target" style={{ height: (item.target / maxValue) * 40 }} />}
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

const Period = ({ period, periodIndex, ...props }) => {
  const [pinned, setPinned] = useState(-1)
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
    if (pinnedRef.current !== -1 && !scrollingTransition) {
      const diff = (window.scrollY + 103) - (listRef.current.children[0].children[pinnedRef.current].offsetParent.offsetTop + 63 + (pinnedRef.current * 75))
      if (diff < -20 || diff > listRef.current.children[0].children[pinnedRef.current].clientHeight) {
        _setPinned(-1)
      }
    }
  }
  const handleAccordionChange = (index) => {
    const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
    const stickyHeaderHeight = period.targetValue > 0 ? 119 : 103
    clearTimeout(tmid)
    scrollingTransition = true
    window.scroll({ top: offset - stickyHeaderHeight, behavior: 'smooth' })
    _setPinned(Number(index))
    tmid = setTimeout(() => { scrollingTransition = false }, 1000)
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
      className={period.contributors.length === 0 ? 'empty' : (period.contributors.length === 1 ? 'single' : null)}
      header={[
        <div>
          <h5>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</h5>
          <ul className="small-stats">
            <li><b>{period.contributors.length}</b> Contributors</li>
            <li><b>{period.countries.length}</b> Countries</li>
          </ul>
        </div>,
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
        period.contributors.length > 1 &&
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
          {filteredContributors.sort((a, b) => b.aggregatedValue - a.aggregatedValue).map((project, _index) =>
            <Panel
              className={pinned === _index ? 'pinned' : null}
              key={_index}
              header={[
                <div className="title">
                  <h4>{project.projectTitle}</h4>
                  <p>
                    {project.country && <span>{countriesDict[project.country.isoCode]}</span>}
                    &nbsp;
                      {project.contributors.length > 0 && <b>{project.contributors.length} sub-contributors</b>}
                    <b>&nbsp;</b>
                  </p>
                </div>,
                <div className="value">
                  <b>{String(project.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                  <small>{Math.round((project.actualValue / aggFilteredTotal) * 100 * 10) / 10}%<br /><small>{countriesFilter.length > 0 ? 'of filtered total' : 'of total'}</small></small>
                </div>
              ]}
            >
              <ul className="sub-contributors">
                {project.contributors.map(subproject => (
                  <li>
                    <div>
                      <h5>{subproject.projectTitle}</h5>
                      <p>{project.country && <span>{countriesDict[project.country.isoCode]}</span>}</p>
                    </div>
                    <div className="value">
                      <b>{String(subproject.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                      <small>{Math.round((subproject.actualValue / project.aggregatedValue) * 100 * 10) / 10}%</small>
                    </div>
                  </li>
                ))}
              </ul>
              <Comments project={project} />
            </Panel>
          )}
        </Collapse>
      </div>
    </Panel>
  )
}

const Indicator = ({ periods }) => {
  return (
    <div className="indicator">
      <Collapse destroyInactivePanel expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {periods.map((period, index) => <Period {...{period, index}} />)}
      </Collapse>
    </div>
  )
}

export default Indicator
