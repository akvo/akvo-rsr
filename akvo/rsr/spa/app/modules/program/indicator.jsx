/* global window, document */
import React, { useRef, useState, useEffect } from 'react'
import { Collapse, Icon, Button, Select, Input } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import Chart from 'chart.js'
import { useFetch } from '../../utils/hooks'
import countriesDict from '../../utils/countries-dict'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const { Option } = Select

const Comments = () => {
  const [mode, setMode] = useState('list')
  return (
    <div className="comments no-comments">
      {mode === 'list' && [
        <Button type="link" icon="plus" size="small" onClick={() => setMode('add')}>Add a comment</Button>,
        <p>No comments for this period</p>
      ]}
      {mode === 'add' && (
        <div className="add-comment">
          <Input.TextArea />
          <div className="btns">
            <Button type="primary">Submit</Button>
            <Button type="link" onClick={() => setMode('list')}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}

const Charts = ({ period }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const percent = (period.actualValue / period.targetValue) * 100
    const _chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: ['#5a978f', '#e1eded'],
          hoverBorderWidth: 0,
        },
        // {
        //   data: [20, 40, 55, 31],
        //   backgroundColor: ['#32407B', '#515585', '#46B5D1', '#E9EA77', '#FFD369'],
        //   weight: 1.75,
        //   hoverBorderWidth: 0,
        //   // pointBorderWidth: 5,/
        //   // label: 'disagg',
        //   // labels: ['Fill', 'DISS']
        // }, {
        //   data: []
        // }
        ],
      },
      options: {
        cutoutPercentage: 60,
        circumference: Math.PI,
        rotation: -Math.PI,
        tooltips: {
          enabled: false,
          custom: (tooltip) => {
            console.log(tooltip, tooltip.body)
          }
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
      <div className="percent-label">{Math.round((period.actualValue / period.targetValue) * 100 * 10) / 10}%</div>
    </div>
  )
}

let scrollingTransition
let tmid

const Indicator = ({ programId, id }) => {
  const [pinned, setPinned] = useState(-1)
  const [countriesFilter, setCountriesFilter] = useState([])
  const [periods, loading] = useFetch(`/program/${programId}/indicator/${id}/`)
  const listRef = useRef(null)
  const pinnedRef = useRef(-1)
  const mouseEnterBar = (index) => {
    if (pinned === index) return
    listRef.current.children[0].children[index].classList.add('active')
  }
  const mouseLeaveBar = (index) => {
    listRef.current.children[0].children[index].classList.remove('active')
  }
  const _setPinned = (to) => {
    setPinned(to)
    pinnedRef.current = to
  }
  const clickBar = (index, e, period) => {
    e.stopPropagation()
    if (listRef.current.children[0].children[index].classList.contains('ant-collapse-item-active') === false){
      listRef.current.children[0].children[index].children[0].click()
    }
  }
  const handleCountryFilter = (countries) => {
    setCountriesFilter(countries)
  }
  const handleScroll = () => {
    if (pinnedRef.current !== -1 && !scrollingTransition) {
      const diff = (window.scrollY + 103) - (listRef.current.children[0].children[pinnedRef.current].offsetParent.offsetTop + 63 + (pinnedRef.current * 75))
      if (diff < -20 || diff > listRef.current.children[0].children[pinnedRef.current].clientHeight){
        _setPinned(-1)
      }
    }
  }
  const handleAccordionChange = (period) => (index) => {
    const offset = 63 + (index * 75) + listRef.current.children[0].children[index].offsetParent.offsetTop
    const stickyHeaderHeight = period.targetValue > 0 ? 119 : 103
    clearTimeout(tmid)
    scrollingTransition = true
    window.scroll({ top: offset - stickyHeaderHeight, behavior: 'smooth' })
    _setPinned(Number(index))
    tmid = setTimeout(() => { scrollingTransition = false }, 1000)
  }
  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="indicator">
      <Collapse destroyInactivePanel defaultActiveKey={['0']} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {periods.map((period, index) => {
        const sumTotal = period.contributors.reduce((val, project) => val + project.value, 0)
        return (
          <Panel
            key={index}
            header={[
              <h5>{moment(period.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(period.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}</h5>,
              <div className={classNames('stats', {extended: period.targetValue > 0})} onClick={e => e.stopPropagation()}>{/* eslint-disable-line */}
              <div className="stat">
                <div className="label">contributing projects</div>
                <b>{period.contributors.length}</b>
              </div>
              <div className="stat">
                <div className="label">countries</div>
                <b>{period.countries.length}</b>
              </div>
              <div className="stat value">
                <div className="label">aggregated actual value</div>
                <b>{String(period.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                {period.targetValue > 0 && <span>of <b>{period.targetValue}</b> target</span>}
              </div>
              {period.targetValue > 0 &&
                <Charts period={period} />
              }
              </div>,
              <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
                {period.contributors.sort((a, b) => b.value - a.value).map((it, _index) =>
                  <li className={pinned === _index ? 'pinned' : null} style={{ flex: it.value }} onClick={(e) => clickBar(_index, e, period)} onMouseEnter={() => mouseEnterBar(_index)} onMouseLeave={() => mouseLeaveBar(_index)} /> // eslint-disable-line
                )}
              </ul>
            ]}
          >
            {/* <div className="sticky-header">
            <header className={classNames('charts-header', {narrow: period.targetValue === 0})}>
              {period.targetValue > 0 &&
              <div className="chart">
                <Chart
                  options={donutChartConfig}
                  series={[30, 70]}
                  type="donut"
                  width="100%"
                  height="100%"
                />
                <div className="overlay">
                  <header>
                    <div>20.5%</div>
                    <small>disaggregations</small>
                  </header>
                  <div className="disaggregations">
                    <Chart
                      type="bar"
                      width="100%"
                      height="110px"
                      series={[{
                        data: [400, 430, 448]
                      }]}
                      options={barChartConfig}
                    />
                  </div>
                </div>
              </div>
              }
            </header>
            </div> */}
            <div className="filters">
              <Select
                className="country-filter"
                mode="multiple"
                allowClear
                placeholder={<span><Icon type="filter" /> Filter countries</span>}
                onChange={handleCountryFilter}
              >
                {period.countries.map(it => <Option value={it.isoCode}>{countriesDict[it.isoCode]}</Option>)}
              </Select>
              {countriesFilter.length > 0 && (<span className="filtered-project-count">{period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).length} projects</span>)}
            </div>
            <div ref={ref => { listRef.current = ref }}>
            <Collapse onChange={handleAccordionChange(period)} accordion className="contributors-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
              {period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).sort((a, b) => b.value - a.value).map((project, _index) =>
              <Panel
                className={pinned === _index ? 'pinned' : null}
                header={[
                  <div className="title">
                    <h4>{project.title}</h4>
                    <p>
                      {project.country && <span>{countriesDict[project.country.isoCode]}</span>}
                      &nbsp;
                      {project.contributors.length > 0 && <b>{project.contributors.length} sub-contributors</b>}
                    </p>
                  </div>,
                  <div className="value">
                    <b>{String(project.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                    <small>{Math.round((project.value / sumTotal) * 100 * 10) / 10}% of total</small>
                  </div>
                ]}
              >
                <ul className="sub-contributors">
                {project.contributors.map(subproject => (
                  <li>
                    <div>
                      <h5>{subproject.title}</h5>
                      <p>{project.country && <span>{countriesDict[project.country.isoCode]}</span>}</p>
                    </div>
                    <div className="value">
                      <b>{String(subproject.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                      <small>{Math.round((subproject.value / project.value) * 100 * 10) / 10}%</small>
                    </div>
                  </li>
                ))}
                </ul>
                <Comments />
              </Panel>
              )}
            </Collapse>
            </div>
          </Panel>
        )
      })}
      </Collapse>
    </div>
  )
}

export default Indicator
