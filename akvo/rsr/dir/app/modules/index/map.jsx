import React, { useEffect, useRef } from 'react'
import mapboxgl, {LngLat, LngLatBounds} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

const getBounds = (projects) => {
  let n
  let s
  let w
  let e
  projects.forEach(({ longitude: lng, latitude: lat }) => {
    if(lat > s || !s) s = lat
    if(lat < n || !n) n = lat
    if(lng > e || !e) e = lng
    if(lng < w || !w) w = lng
  })
  const sw = new LngLat(w, s)
  const ne = new LngLat(e, n)
  return new LngLatBounds(sw, ne)
}
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
const Map = ({ data, getRef, handlePan, getCenter, getMarkerBounds, onHoverProject, onHoverOutProject }) => {
  const mapRef = useRef(null)
  const mapLoaded = useRef(false)
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 2
    })
    const nav = new mapboxgl.NavigationControl();
    mapRef.current.addControl(nav, 'top-right')
    mapRef.current.on('load', () => { mapLoaded.current = true })
    if(getRef) getRef(mapRef.current)
    mapRef.current.on('moveend', handlePan)
    // mapRef.current.on('zoomend', updateProjects)
  }, [])
  useEffect(() => {
    if(data && data.projects){
      const projectsWithCoords = data.projects.filter(it => it.latitude !== null)
      const setFeatures = () => {
        const featureData = projectsToFeatureData(projectsWithCoords)
        mapRef.current.addSource('projects', {
          type: 'geojson',
          data: featureData,
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
        mapRef.current.on('click', 'clusters', (e) => {
          const features = mapRef.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          })
          const clusterId = features[0].properties.cluster_id
          mapRef.current.getSource('projects').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => { // eslint-disable-line
              if (err) return
              if(zoom > 11) zoom = 11 // prevent maximum zoom on cluster of points on the exact same location
              mapRef.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom
              })
            }
          )
        })
        mapRef.current.on('mouseenter', 'clusters', () => {
          mapRef.current.getCanvas().style.cursor = 'pointer'
        })
        mapRef.current.on('mouseleave', 'clusters', () => {
          mapRef.current.getCanvas().style.cursor = ''
        })
        mapRef.current.on('mouseenter', 'unclustered-point', (ev) => {
          mapRef.current.getCanvas().style.cursor = 'pointer'
          if(ev.features && ev.features.length > 0){
            onHoverProject(ev.features[0].properties.id)
          }
        })
        mapRef.current.on('mouseleave', 'unclustered-point', () => {
          mapRef.current.getCanvas().style.cursor = ''
          onHoverOutProject()
        })
        const lngLatBounds = getBounds(projectsWithCoords.filter(it => it.lat !== null))
        getMarkerBounds(lngLatBounds)
        getCenter(lngLatBounds.getCenter())
        mapRef.current.fitBounds(lngLatBounds, { padding: 30})
      }
      if(mapLoaded.current) setFeatures()
      else mapRef.current.on('load', setFeatures)
    }
  }, [data])
  return (
    <div id="map" />
  )
}

export default Map
