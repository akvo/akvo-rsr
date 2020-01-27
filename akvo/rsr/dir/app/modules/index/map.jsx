import React, { useEffect, useRef } from 'react'
import mapboxgl, {LngLat, LngLatBounds} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluY2hyaXN0b3YiLCJhIjoiTXFhSVJTMCJ9.dsByYqa5jm2OU7KwrfV3vA'

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
const Map = ({ data, getRef, handlePan, getCenter }) => {
  const mapRef = useRef(null)
  const mapLoaded = useRef(false)
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 3
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
      const featureData = {
        type: 'FeatureCollection',
        features: data.projects.map(item => ({
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
      const setFeatures = () => {
        mapRef.current.addSource('projects', {
          type: 'geojson',
          data: featureData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        })
        mapRef.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'projects',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              10,
              '#de8750',
              15,
              '#ca4159'
            ],
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
            'circle-color': '#11b4da',
            'circle-radius': 7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        })
        mapRef.current.on('click', 'clusters', (e) => {
          const features = mapRef.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          })
          const clusterId = features[0].properties.cluster_id
          mapRef.current.getSource('projects').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return
              if(zoom > 11) zoom = 11 // prevent maximum zoom on cluster of points on the exact same location
              mapRef.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom
              })
            }
          )
        })
        const lngLatBounds = getBounds(data.projects)
        getCenter(lngLatBounds.getCenter())
        mapRef.current.easeTo({
          center: lngLatBounds.getCenter(),
          zoom: 4
        })
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
