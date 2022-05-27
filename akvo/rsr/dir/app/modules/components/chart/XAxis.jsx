import React from 'react'
import ChartAxis from './ChartAxis'

const XAxis = ({ padding, width, height }) => <ChartAxis points={`${padding},${height - padding} ${width - padding},${height - padding}`} />

export default XAxis
