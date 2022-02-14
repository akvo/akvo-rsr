/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react'
import Chart from 'chart.js'

const TargetCharts = ({ actualValue, targetValue }) => {
  const [preload, setPreload] = useState(true)
  const canvasRef = useRef(null)
  let percent = (actualValue / targetValue) * 100
  if (percent > 100) percent = 100
  const datasets = [
    {
      data: [percent, 100 - percent],
      backgroundColor: ['#389a90', '#e1eded'],
      hoverBorderWidth: 3,
      hoverBorderColor: '#fff',
      hoverBackgroundColor: ['#389a90', '#e1eded']
    }
  ]
  const labels = []
  useEffect(() => {
    if (canvasRef && preload) {
      setPreload(false)
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
    }
  })
  return (
    <div className="charts">
      <canvas width={150} height={68} ref={ref => { canvasRef.current = ref }} />
      <div className="percent-label">{Math.round((actualValue / targetValue) * 100)}%</div>
    </div>
  )
}

export default TargetCharts
