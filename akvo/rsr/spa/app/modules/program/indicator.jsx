import React from 'react'
import { Spin, Collapse, Icon } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
// import { Doughnut } from 'react-chartjs-2'
import Chart from 'react-apexcharts'
import { useFetch } from '../../utils/hooks'

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
  return (
    <div className="indicator">
      <Collapse destroyInactivePanel defaultActiveKey={['0']} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {periods.map((period, index) => (
        <Panel
          key={index}
          header={(
            <div>
              <h5>{moment(period.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(period.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}</h5>
            </div>
          )}
        >
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
          <div className="stats">
            <div className="stat value">
              <div className="label">aggregated actual value</div>
              <b>202,122</b>
            </div>
            <div className="stat">
              <div className="label">aggregated target</div>
              <b>300,000</b>
            </div>
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
          </div>
        </Panel>
      ))}
      </Collapse>
    </div>
  )
}

export default Indicator
