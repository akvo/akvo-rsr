import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

export const MapWcaro = ({ setup, features, ...props }) => {
  const mapRef = useRef(null)
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({ ...setup })
    mapRef.current.on('load', () => {
      mapRef.current.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        }
      })
      // Add a circle layer
      mapRef.current.addLayer({
        'id': 'circle',
        'type': 'circle',
        'source': 'points',
        'paint': {
          'circle-color': '#92DCEB',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#5E4D93'
        }
      })

      // Center the map on the coordinates of any clicked circle from the 'circle' layer.
      mapRef.current.on('click', 'circle', (e) => {
        mapRef.current.flyTo({
          center: e.features[0].geometry.coordinates
        })
      })

      // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
      mapRef.current.on('mouseenter', 'circle', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      mapRef.current.on('mouseleave', 'circle', () => {
        mapRef.current.getCanvas().style.cursor = ''
      })
    })
  }, [])
  return <div id={setup.container || 'map-wcaro'} {...props} />
}
