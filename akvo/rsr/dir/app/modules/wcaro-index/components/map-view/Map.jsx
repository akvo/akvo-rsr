import React, { useState, useEffect, useMemo } from 'react'
import ReactMapGL, { Source, Layer, WebMercatorViewport, LinearInterpolator } from 'react-map-gl'
import bbox from '@turf/bbox'
import moment from 'moment'
import {range} from 'lodash'
import {scaleQuantize} from 'd3-scale'
import {schemeBlues} from 'd3-scale-chromatic'
import {queryGeoData} from './queries'
import ColorLegend from './ColorLegend'
import countryNames from '../../../../utils/countries.json'

const positronStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const calculatePercentile = scaleQuantize([0, 100], range(8))

const calculateUnitPeriods = periods => {
  const {target, value} = periods.reduce(
    (acc, period) => ({target: acc.target + period.periodTarget, value: (acc.value + period.value)}),
    {target: 0, value: 0}
  )
  return target ? (value / target) * 100 : 0
}

const calculatePercentagePeriods = periods => {
  const {numerator, denominator} = periods.reduce(
    (acc, period) => ({numerator: acc.numerator + period.numerator, denominator: acc.denominator + period.denominator}),
    {numerator: 0, denominator: 0}
  )
  return denominator ? (numerator / denominator) * 100 : 0
}

const splitStartEndPeriod = (text) => {
  if (!text) return [null, null]
  const [start, end] = text.split(' - ')
  return [
    moment(start, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    moment(end, 'DD/MM/YYYY').format('YYYY-MM-DD')
  ]
}

const filterData = (data, indicator, countries = [], period = null) => {
  const selectedCountries = countries.length ? data.features.filter(f => countries.includes(f.properties.isoCode)) : data.features
  const [periodStart, periodEnd] = splitStartEndPeriod(period)
  const features = selectedCountries.filter(f => indicator.id in f.properties.indicators).map(f => {
    const {isoCode, indicators} = f.properties
    const countryName = countryNames.find(c => c.code === isoCode)
    const name = countryName ? countryName.name : ''
    const selectedIndicator = indicators[indicator.id]
    const selectedPeriods = periodStart && periodEnd ?
      selectedIndicator.periods.filter(p => p.periodStart === periodStart && p.periodEnd === periodEnd) :
      selectedIndicator.periods
    const value = selectedIndicator.isPercentage ? calculatePercentagePeriods(selectedPeriods) : calculateUnitPeriods(selectedPeriods)
    const percentile = calculatePercentile(value)
    const properties = {isoCode, name, percentile, value}
    return {...f, properties, indicator: selectedIndicator}
  })
  return {type: 'FeatureCollection', features}
}

const FeatureInfo = ({feature, x, y}) => {
  return (
    <div className="wcaro-map-tooltip" style={{left: x, top: y}}>
      <div>{feature.name}</div>
      <div><strong>{feature.value.toFixed(2)}%</strong></div>
    </div>
  )
}

const Map = ({indicator, countries = [], period = null, latitude = 0.0, longitude = 0.0, zoom = 2, ...props}) => {
  const [viewport, setViewport] = useState({latitude, longitude, zoom})
  const [canFitBounds, setCanFitBounds] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState()
  const {data, error} = queryGeoData()
  const filteredData = useMemo(() => data && indicator && filterData(data, indicator, countries, period), [data, indicator, countries, period])
  const handleOnHover = ({features, srcEvent: { offsetX: x, offsetY: y}}) => {
    const feature = features && features.find((f) => f.layer.id === 'data')
    setHoveredFeature(feature ? { feature: feature.properties, x, y } : null)
  }

  useEffect(() => {
    if (!data || !canFitBounds) {
      return
    }
    const [minLng, minLat, maxLng, maxLat] = bbox(data)
    const vp = new WebMercatorViewport(viewport)
    const newViewport = vp.fitBounds(
      [[minLng, minLat], [maxLng, maxLat]],
      {padding: {top: 40, right: 40, bottom: 40, left: 500}}
    )
    setViewport({
      ...viewport,
      ...newViewport,
      transitionInterpolator: new LinearInterpolator(),
      transitionDuration: 1000
    })
  }, [data, canFitBounds])

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <ReactMapGL
        width="100%"
        height="100%"
        {...props}
        {...viewport}
        onHover={handleOnHover}
        onViewportChange={(v) => {
          setViewport(v)
          setCanFitBounds(true)
        }}
        mapStyle={positronStyle}
        mapboxApiAccessToken="pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ"
      >
        {error && (
          <div style={{position: 'absolute', top: 0, left: 0, padding: '5px' }}>
            <div style={{ color: 'red' }}>Failed to load data!</div>
          </div>
        )}
        {!filteredData ? (
          <div style={{ position: 'absolute', top: 0, left: 0, padding: '5px' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <Source type="geojson" data={filteredData}>
              <Layer
                id="data"
                type="fill"
                paint={{
                  'fill-opacity': 0.7,
                  'fill-outline-color': '#666',
                  'fill-color': {
                    property: 'percentile',
                    stops: schemeBlues[8].map((color, idx) => [idx, color]),
                  }
                }}
              />
            </Source>
            {hoveredFeature && <FeatureInfo {...hoveredFeature} />}
          </>
        )}
      </ReactMapGL>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '10px 10px 0 0',
        }}
      >
        <ColorLegend scale={scaleQuantize([0, 100], schemeBlues[8])} />
      </div>
    </div>
  )
}

export default Map
