import React, { useEffect, useState } from 'react'
import SemiCircle from '../components/SemiCircle'

const TargetCharts = ({ actualValue, targetValue }) => {
  const [actual, setActual] = useState(0)

  const handleOnSetPercentage = (numerator, denumerator) => {
    let percent = (numerator / denumerator) * 100
    if (percent > 100) percent = 100
    return percent
  }

  useEffect(() => {
    if (actual !== actualValue) {
      setActual(actualValue)
    }
  }, [actual, actualValue])

  const percent = handleOnSetPercentage(actualValue, targetValue)
  return (
    <div className="charts">
      <SemiCircle percent={percent} />
      <div className="percent-label">{Math.round((actualValue / targetValue) * 100)}%</div>
    </div>
  )
}

export default TargetCharts
