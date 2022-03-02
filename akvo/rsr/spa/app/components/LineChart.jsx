import React from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'

const LineChart = ({
  height = 400
}) => {
  const option = {
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      name: 'Updates'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        markLine: {
          label: 'TARGET VALUE',
          data: [
            {
              name: 'TARGET VALUE',
              yAxis: 1200,
              lineStyle: {
                normal: {
                  type: 'solid',
                  color: '#D57549'
                }
              }
            }
          ],
        },
        type: 'line',
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
    ]
  };
  return (
    <>
      <ReactECharts
        option={option}
        style={{ height: height - 50, width: '100%' }}
      />
    </>
  )
}

export default LineChart
