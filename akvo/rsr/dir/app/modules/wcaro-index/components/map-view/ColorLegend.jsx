import React, {useRef, useEffect} from 'react'
import {scaleLinear} from 'd3-scale'
import {axisBottom} from 'd3-axis'
import {select} from 'd3-selection'

const ColorLegend = ({scale, width = 200, height = 50, margin = 20}) => {
  const elRef = useRef()

  useEffect(() => {
    const steps = scale.range().length
    const stepWidth = (width - 2 * margin) / steps
    const numbers = scaleLinear()
      .domain(scale.domain())
      .range([0, width - 2 * margin])
    const axis = axisBottom(numbers)
      .tickSize((height / 2) + 2)
      .tickValues(scale.domain())
    const svg = select(elRef.current)
      .append('svg')
      .attr('id', 'legend')
      .attr('width', width)
      .attr('height', height)
    const g = svg.append('g')
      .attr('transform', `translate(${margin}, 5)`)
    g.selectAll('rect')
      .data(scale.range())
      .enter()
      .append('rect')
      .attr('fill', (d) => d)
      .attr('x', (_, i) => stepWidth * i)
      .attr('width', stepWidth)
      .attr('height', (height / 2))
    g.append('g')
      .call(axis)
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
    g.select('.domain').remove()
  }, [])

  return (
    <div className="wcaro-color-legend">
      <div ref={elRef} />
    </div>
  )
}

export default ColorLegend
