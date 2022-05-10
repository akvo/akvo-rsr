import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

export const MapView = ({
  filter,
  search,
  featureData,
  processing,
  setProcessing,
  handleOnFetchProjects,
  ...mapProps
}) => {
  const [data, setData] = useState(featureData)
  const [filtered, setFiltered] = useState(false)
  const [preload, setPreload] = useState(true)
  const mapRef = useRef(null)

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

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map-view',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 3
    })
    mapRef.current.on('load', () => { })
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
  }, [featureData, filtered, search, filter, data])
  return <div id="map-view" {...mapProps} />
}
