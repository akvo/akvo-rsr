import React from 'react'
import ChartAxis from './ChartAxis'

const YAxis = ({ padding, height }) => <ChartAxis points={`${padding},${padding} ${padding},${height - padding}`} />

export default YAxis
