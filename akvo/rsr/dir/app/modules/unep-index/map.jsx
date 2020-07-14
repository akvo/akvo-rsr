import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

export const projectsToFeatureData = (projects) => {
  return {
    type: 'FeatureCollection',
      features: projects.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude]
        },
        properties: {
          id: item.id,
          title: item.title
        }
      }))
  }
}
const Map = ({ data, getRef, handlePan }) => {
  const mapRef = useRef(null)
  const mapLoaded = useRef(false)
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 3
    })
    const nav = new mapboxgl.NavigationControl()
    mapRef.current.addControl(nav, 'top-right')
    mapRef.current.on('load', () => {
      mapLoaded.current = true
      mapRef.current.addLayer({
        'id': 'countries',
        'source': {
          'type': 'vector',
          'url': 'mapbox://akvo.cx9b0u13'
        },
        'source-layer': 'ne_10m_admin_0_countries-2tez61',
        'type': 'fill',
        'paint': {
          'fill-opacity': 0.5,
          'fill-color': '#52489C',
          'fill-outline-color': '#52489C'
        }
      });
      mapRef.current.setFilter('countries', ['in', 'ADM0_A3_IS'].concat(['USA', 'AUS', 'NGA']))
    })
    if(getRef) getRef(mapRef.current)
    mapRef.current.on('moveend', handlePan)
    // mapRef.current.on('zoomend', updateProjects)
  }, [])
  useEffect(() => {
    if(data && data.projects){
      // if(mapLoaded.current) addLayer()
      // else mapRef.current.on('load', addLayer)
    }
  }, [data])
  return (
    <div id="map" />
  )
}

export default Map
