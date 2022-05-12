import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import chunk from 'lodash/chunk'
import orderBy from 'lodash/orderBy'
import difference from 'lodash/difference'
import humps from 'humps'
import api from '../../../utils/api'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

export const MapView = ({
  filter,
  search,
  featureData,
  directories,
  processing,
  setProcessing,
  setDirectories,
  handleOnFetchProjects,
  ...mapProps
}) => {
  const [data, setData] = useState(featureData)
  const [filtered, setFiltered] = useState(false)
  const [preload, setPreload] = useState(true)
  const [bounds, setBounds] = useState({})

  const mapRef = useRef(null)
  const boundsRef = useRef(null)

  const getADiffDir = (values) => {
    const a = directories.map((d) => d.properties.id)
    const b = values.map((v) => v.properties.id)
    return (difference(a, b).length)
  }

  const geoFilterProjects = ({ _sw, _ne }) => ({ geometry: { coordinates } }) => {
    const [lng, lat] = coordinates
    let inBounds = true
    if (_sw) inBounds = lng > _sw.lng && lng < _ne.lng && lat > _sw.lat && lat < _ne.lat
    return inBounds
  }
  const _setBounds = (_bounds) => {
    setBounds(_bounds)
    boundsRef.current = _bounds
  }

  const handleOnMoveEnd = () => {
    _setBounds(mapRef.current.getBounds())
  }
  const handleOnSetFeatures = () => {
    mapRef.current.addSource('projects', {
      data: data || {},
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })
    mapRef.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'projects',
      filter: ['has', 'point_count'],
      paint: {
        // stroke: 909981, fill: BAC7A7
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#F0CF85',
          10,
          '#BAC7A7',
          15,
          '#889E81'
        ],
        'circle-stroke-color': [
          'step',
          ['get', 'point_count'],
          '#CCAE72',
          10,
          '#909981',
          15,
          '#4F594A'
        ],
        'circle-stroke-width': 1,
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          10,
          30,
          15,
          40
        ]
      }
    })
    mapRef.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'projects',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    })
    mapRef.current.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'projects',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#0FABBC',
        'circle-radius': 7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#0A6666'
      }
    })
  }
  const handleOnFilterBounds = (values) => {
    const geoFilteredProjects = featureData.features.filter(geoFilterProjects(values))
    const sorting = orderBy(geoFilteredProjects, [(item) => item.properties.activeness], ['desc'])
    if (getADiffDir(sorting)) {
      setDirectories(sorting)
    }
    const chunking = chunk(sorting, 10)
    const ids = chunking[0] ? chunking[0].map((c) => c.properties.id) : []
    handleOnFetchProjects(ids, true)
  }

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map-view',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 3
    })
    const nav = new mapboxgl.NavigationControl()
    mapRef.current.addControl(nav, 'top-right')
    mapRef.current.on('load', () => { })
    mapRef.current.on('moveend', handleOnMoveEnd)
  }, [])

  useEffect(() => {
    if (data) {
      if (preload) {
        setPreload(false)
        handleOnSetFeatures()
      } else {
        const geojsonSource = mapRef.current.getSource('projects')
        if (geojsonSource && data) {
          // Update the data after the GeoJSON source was created
          geojsonSource.setData(data)
        }
      }
    }
  }, [data])

  useEffect(() => {
    if (!data && featureData) {
      setData(featureData)
    }
    if (!filtered && filter.apply && (search.results && search.results.length) && featureData) {
      const dataFeatures = featureData.features.filter((f) => (search.results.includes(f.properties.id)))
      const coordinates = dataFeatures
        .map((df) => df.geometry.coordinates)
        .filter((df) => {
          const [lat, lang] = df
          return (lat && lang)
        })
      if (coordinates.length) {
        if (coordinates.length === 1) {
          mapRef.current.flyTo({ center: coordinates[0] })
        } else {
          // mapRef.current.fitBounds(coordinates, { padding: 30})
        }
      }
      setData({
        ...data,
        features: dataFeatures
      })
      setFiltered(true)
    }

    if (!search.results && filtered && featureData) {
      setFiltered(false)
      setData(featureData)
    }

    if (bounds && featureData && !processing && !filter.apply && !search.query) {
      handleOnFilterBounds(bounds)
    }
  }, [featureData, filtered, search, filter, data, directories, bounds, processing])
  return <div id="map-view" {...mapProps} />
}
