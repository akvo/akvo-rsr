/* global window */
import React, { useRef } from 'react'
import { Collapse, Icon } from 'antd'
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
  const [periods, loading] = useFetch(`/program/${programId}/indicator/${id}/`)
  const listRef = useRef(null)
  const mouseEnterBar = (index) => {
    listRef.current.children[0].children[index].classList.add('active')
    // scroll if needed
    const offset = listRef.current.children[0].children[index].offsetTop + listRef.current.children[0].children[index].offsetParent.offsetTop
    if(offset - window.scrollY > window.innerHeight - 100){
      window.scroll({ top: offset - (window.innerHeight - 100), behavior: 'smooth' })
    }
    else if (offset - 120 < window.scrollY){
      window.scroll({ top: offset - 120, behavior: 'smooth' })
    }
  }
  const mouseLeaveBar = (index) => {
    listRef.current.children[0].children[index].classList.remove('active')
  }
  const mouseEnterItem = (index) => {

  }
  const mouseLeaveItem = (index) => {

  }
  const clickBar = (index) => {
    listRef.current.children[0].children[index].children[0].click()
    listRef.current.children[0].children[index].classList.add('active-pinned')
  }
  return (
    <div className="indicator">
      <Collapse destroyInactivePanel defaultActiveKey={['0']} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {periods.map((period, index) => {
        const sumTotal = period.contributors.reduce((val, project) => val + project.value, 0)
        return (
          <Panel
            key={index}
            header={(
              <div>
                <h5>{moment(period.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(period.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}</h5>
              </div>
            )}
          >
            <div className="sticky-header">
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
              <div className="stats">
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
                {period.disaggregations.length > 0 &&
                <ul className="disaggregations">
                  <li>
                    <div className="label">men</div>
                    <b>819 (20.6%)</b>
                  </li>
                  <li>
                    <div className="label">women</div>
                    <b>432 (16.6%)</b>
                  </li>
                  <li>
                    <div className="label">children</div>
                    <b>432 (16.6%)</b>
                  </li>
                </ul>
                }
              </div>
            </header>
            <ul className="bar">
              {period.contributors.sort((a, b) => b.value - a.value).map((it, _index) =>
                <li style={{ flex: it.value }} onClick={() => clickBar(_index)} onMouseEnter={() => mouseEnterBar(_index)} onMouseLeave={() => mouseLeaveBar(_index)} /> // eslint-disable-line
              )}
            </ul>
            </div>
            <div ref={ref => { listRef.current = ref }}>
            <Collapse className="contributors-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
              {period.contributors.sort((a, b) => b.value - a.value).map((project, _index) =>
                <Panel
                  onMouseEnter={() => mouseEnterItem(_index)}
                  onMouseLeave={() => mouseLeaveItem(_index)}
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
