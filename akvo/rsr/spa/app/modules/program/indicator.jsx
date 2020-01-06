/* global window */
import React, { useRef, useState } from 'react'
import { Collapse, Icon, Button, Select } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
// import { Doughnut } from 'react-chartjs-2'
import Chart from 'react-apexcharts'
import { useFetch } from '../../utils/hooks'
import countriesDict from '../../utils/countries-dict'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const { Option } = Select

const donutChartConfig = {
  chart: {
    id: 'apexchart-example',
    type: 'donut'
  },
  selection: {
    enabled: false
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    pie: {
      size: 97,
      offsetY: 20,
      offsetX: 0,
      donut: {
        size: '65%'
      },
      expandOnClick: false
    }
  },
  colors: ['#43998f', '#e1edec'],
  store: {
    show: false,
    width: 0
  },
  tooltip: {
    enabled: false
  },
  states: {
    hover: {
      filter: {
        type: 'none',
        value: 0
      }
    },
    active: null
  }
}
const barChartConfig = {
  chart: {
    height: '110px',
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  grid: {
    show: false
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: false
    }
  },
  colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'],
  dataLabels: {
    enabled: false,
    // formatter: (val, opt) => {
    //   return opt.w.globals.labels[opt.dataPointIndex]
    // }
  },
  stroke: {
    show: false
  },
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => {
          return ''
        }
      }
    }
  }
}

const Indicator = ({ programId, id }) => {
  const [pinned, setPinned] = useState(-1)
  const [countriesFilter, setCountriesFilter] = useState([])
  const [periods, loading] = useFetch(`/program/${programId}/indicator/${id}/`)
  const listRef = useRef(null)
  const mouseEnterBar = (index) => {
    if (pinned === index) return
    if(pinned !== -1 && pinned !== index){
      setPinned(-1)
    }
    listRef.current.children[0].children[index].classList.add('active')
  }
  const mouseLeaveBar = (index) => {
    listRef.current.children[0].children[index].classList.remove('active')
  }
  const clickBar = (index, e) => {
    e.stopPropagation()
    if (listRef.current.children[0].children[index].classList.contains('ant-collapse-item-active') === false){
      listRef.current.children[0].children[index].children[0].click()
    }
    setPinned(index)
    const offset = listRef.current.children[0].children[index].offsetTop + listRef.current.children[0].children[index].offsetParent.offsetTop
    window.scroll({ top: offset - 103, behavior: 'smooth' })
  }
  const handleCountryFilter = (countries) => {
    setCountriesFilter(countries)
  }
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
              <div className="stats" onClick={e => e.stopPropagation()}>{/* eslint-disable-line */}
              <div className="stat">
                <div className="label">contributing projects</div>
                <b>{period.contributors.length}</b>
              </div>
              <div className="stat">
                <div className="label">countries</div>
                <div>
                  <b>{period.countries.length}</b>
                  {/* <Button size="small" className="filter">filter <Icon type="down" /></Button> */}
                </div>
              </div>
              <div className="stat value">
                <div className="label">aggregated actual value</div>
                <b>{String(period.actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
              </div>
              {period.targetValue > 0 &&
                <div className="stat">
                  <div className="label">aggregated target</div>
                  <b>{period.targetValue}</b>
                </div>
              }
              </div>,
              <ul className={classNames('bar', { 'contains-pinned': pinned !== -1 })}>
                {period.contributors.sort((a, b) => b.value - a.value).map((it, _index) =>
                  <li className={pinned === _index ? 'pinned' : null} style={{ flex: it.value }} onClick={(e) => clickBar(_index, e)} onMouseEnter={() => mouseEnterBar(_index)} onMouseLeave={() => mouseLeaveBar(_index)} /> // eslint-disable-line
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
                {period.countries.map(it => <Option value={it.isoCode}>{it.name}</Option>)}
              </Select>
              {countriesFilter.length > 0 && (<span className="filtered-project-count">{period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).length} projects</span>)}
            </div>
            <div ref={ref => { listRef.current = ref }}>
            <Collapse className="contributors-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
              {period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).sort((a, b) => b.value - a.value).map((project, _index) =>
              <Panel
                className={pinned === _index ? 'pinned' : null}
                header={[
                  <div className="title">
                    <h4>{project.title}</h4>
                    <p>{project.country && countriesDict[project.country.isoCode]}</p>
                  </div>,
                  <div className="value">
                    <b>{String(project.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                    <small>{Math.round((project.value / sumTotal) * 100 * 10) / 10}% of total</small>
                  </div>
                ]}
              >
                test inside
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
