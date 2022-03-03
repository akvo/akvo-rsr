import React from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import moment from 'moment'

const LineChart = ({
  height = 400,
  targetValue,
  updates
}) => {
  const approves = updates?.filter((u) => u.status === 'A')
  const values = approves.map((u) => u.value)
  const dates = approves.map((u) => moment(u.lastModifiedAt, 'YYYY-MM-DD').format('DD-MM-YYYY'))

  let seriesProps = {
    data: values,
    type: 'line',
    connectNulls: true,
    itemStyle: {
      color: '#43998F'
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(67,153,143,0.8)'
        },
        {
          offset: 1,
          color: 'rgba(67,153,143,0.3)'
        }
      ])
    }
  }

  if (targetValue) {
    seriesProps = {
      ...seriesProps,
      markLine: {
        label: 'TARGET VALUE',
        data: [
          {
            name: 'TARGET VALUE',
            yAxis: targetValue,
            lineStyle: {
              normal: {
                type: 'solid',
                color: '#D57549'
              }
            },
            label: {
              color: '#D57549'
            },
            symbol: 'circle'
          }
        ],
      },
    }
  }
  const option = values.length
    ? {
      grid: {
        left: '15%',
        right: '12%',
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: 'Time',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          rotate: -90,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Updates'
      },
      series: [seriesProps]
    }
    : {
      title: {
        subtext: '',
        left: 'center',
        top: '20px',
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  return (
    <ReactECharts
      option={option}
      style={{ height: height - 50, width: '100%' }}
    />
  )
}

export default LineChart
