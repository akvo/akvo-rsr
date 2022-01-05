/* global document */
import React, { Component } from 'react'
import * as d3 from 'd3'
import './HalfDonutChart.scss'

const HEIGHT = 350
// const WIDTH = 565
let WIDTH = 0

const OFFSET_TOP = 30
const OFFSET_BOTTOM = 30
// const OFFSET_LEFT = 30
// const OFFSET_RIGHT = 30

let RADIUS = 0
// const RADIUS = Math.min(WIDTH, HEIGHT) / 2
const COLOR_RANGE = ['#F79B03', '#FCB745', '#FDCF83', '#FEDBA2', '#FEE7C1', '#FFF3E0']

class HalfDonutChart extends Component {
  constructor(props) {
    super()
    this.props = props
  }

  componentDidMount() {
    const colors = d3.scaleOrdinal().range(COLOR_RANGE)
    const canvas = this.setCanvas()
    const arc = this.setArc()
    const pie = this.setPie()
    this.setArcs(canvas, arc, pie, colors)
    if (this.props.showLegend) {
      this.setLegend(canvas, this.props.data)
    }
  }

  setArc() {
    return d3
      .arc() // this will create <path> elements for us using arc data
      .innerRadius(50)
      .outerRadius(RADIUS)
  }

  setArcs(canvas, arc, pie, colors) {
    function getTextWidth(text, font) {
      const cv = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
      const context = cv.getContext('2d')
      context.font = font
      const metrics = context.measureText(text)
      return metrics.width
    }

    const arcs = canvas
      .selectAll('g.slice') // this selects all <g> elements with class slice (there aren't any yet)
      .data(pie) // associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter() // this will create <g> elements for every 'extra' data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append('svg:g') // create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr('class', 'slice') // allow us to style things in the slices (like text)

    arcs.append('svg:path')
      .attr('fill', (d, i) => {
        return colors(i)
      }) // set the color for each slice to be chosen from the color function defined above
      .attr('d', arc)

    // We center the text inside the arc
    arcs.append('svg:text')
      .attr('transform', (d) => {
        const textWidth = getTextWidth((`${d.value.toFixed(2)}%`).toString(), 'Roboto')
        const x = arc.centroid(d)[0] - textWidth / 2
        const y = arc.centroid(d)[1]
        return `translate(${x},${y})`
      })
      .attr('class', 'label-half-donut')
      .attr('dy', '.35em')
      .attr('text-anchor', (d) => {
        //  are we past the center?
        return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start'
      })
      .text((d) => {
        return `${d.value.toFixed(2)}%`
      })
  }

  setCanvas() {
    WIDTH = parseFloat(d3.select(`#${this.props.idChart}`).style('width'))
    RADIUS = Math.min(WIDTH, HEIGHT) / 2
    const svg = d3
      .select(`#${this.props.idChart}`)
      .append('svg')
      .style('color', '#FFFFFF') // With this we've got the color of the axis too
      .data([this.props.data]) // associate our data with the document
      .attr('width', WIDTH) // set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr('height', HEIGHT)
      .append('svg:g') // make a group to hold our pie chart
      .attr(
        'transform',
        `translate(${WIDTH / 2},${(HEIGHT + OFFSET_TOP + OFFSET_BOTTOM + 50) / 2})`
      )

    svg.append('g')
      .append('text')
      .attr('transform', 'translate(0, 25)')
      .style('text-anchor', 'middle')
      .text(this.props.title || '')
      .attr('class', 'title')

    return svg
  }

  /**
   * We draw with this function to create a legend dymamically on the right of
   * the graphic
   * @param {*} canvas
   * @param {*} data
   */
  setLegend(canvas, data) {
    const colors = d3.scaleOrdinal().domain(COLOR_RANGE).range(COLOR_RANGE)

    const svg = canvas.append('g').attr('transform', 'translate(185, -100)')

    svg.selectAll('squares')
      .data(COLOR_RANGE)
      .enter()
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('x', 0)
      .attr('y', (d, i) => {
        return i * 20
      })
      .style('fill', (d) => {
        return colors(d)
      })

    svg.selectAll('labels')
      .data(data)
      .enter()
      .append('text')
      .attr('x', 20)
      .attr('y', (d, i) => {
        return (i + 0.55) * 20
      })
      .text((d) => {
        return `${d.label}%`
      })
      .attr('class', 'label-half-donut')
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'bottom')
  }

  setPie() {
    return d3
      .pie() // this will create arc data for us given a list of values
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0.02) //  some space between slices
      .sort(null) // No! we don't want to order it by size
      .value((d) => {
        return d.value
      })
  }

  render() {
    return (
      <div className="donat-chart">
        <div id={this.props.idChart} />
      </div>
    )
  }
}

export default HalfDonutChart
