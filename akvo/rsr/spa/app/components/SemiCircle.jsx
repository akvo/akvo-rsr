import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js'

const SemiCircle = ({ percent }) => {
  const canvasRef = useRef(null)

  const handleOnSetData = amount => [amount, 100 - amount]

  useEffect(() => {
    const _chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: handleOnSetData(percent),
            backgroundColor: ['#389a90', '#e1eded'],
            hoverBorderWidth: 3,
            hoverBorderColor: '#fff',
            hoverBackgroundColor: ['#389a90', '#e1eded']
          }
        ],
        labels: []
      },
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
    return () => _chart.destroy()
  })
  return <canvas width={150} height={68} ref={ref => { canvasRef.current = ref }} />
}

export default SemiCircle
