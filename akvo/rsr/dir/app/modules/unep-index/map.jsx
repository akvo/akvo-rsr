import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import lookup from 'country-code-lookup'

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
const Map = ({ data, getRef }) => {
  const mapRef = useRef(null)
  const mapLoaded = useRef(false)
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/akvo/ckclwj1z712lw1ipfvfuqq12i',
      zoom: 1
    })
    const nav = new mapboxgl.NavigationControl()
    mapRef.current.addControl(nav, 'top-right')
    mapRef.current.on('load', () => {
      mapLoaded.current = true
    })
    if(getRef) getRef(mapRef.current)
  }, [])
  const addLayers = () => {
    mapRef.current.addSource('countries', {
      'type': 'vector',
      'url': 'mapbox://akvo.cx9b0u13'
    });
    const cgroups = [
      { series: 10, color: '#fbf759', items: [] },
      { series: 20, color: '#b2cc78', items: [] },
      { series: 30, color: '#85b49a', items: [] },
      { series: 40, color: '#66a2b4', items: [] },
      { series: 50, color: '#497df6', items: [] }
    ]
    cgroups.forEach(it => {
      mapRef.current.addLayer({
        'id': `countries-${it.series}`,
        'source': 'countries',
        'source-layer': 'ne_10m_admin_0_countries-2tez61',
        'type': 'fill',
        'paint': {
          'fill-opacity': 0.75,
          'fill-color': it.color,
          'fill-outline-color': '#444'
        },
        'filter': ['in', 'ADM0_A3_IS', '']
      }, 'country-label', 'settlement-major-label')
    })
    const countries = {}
    data.projects.forEach(project => {
      project.countries.forEach(country => {
        if(countries[country]){
          countries[country] += 1
        } else {
          countries[country] = 1
        }
      })
    })
    let maxItems = 0
    Object.keys(countries).forEach(countryCode => {
      if(countries[countryCode] > maxItems) maxItems = countries[countryCode]
    })
    Object.keys(countries).forEach(countryCode => {
      const ind = countries[countryCode] / maxItems
      const ctitem = lookup.byInternet(countryCode)
      if(!ctitem) return
      if(ind < 0.2){
        cgroups[0].items.push(ctitem.iso3)
      } else if(ind < 0.4){
        cgroups[1].items.push(ctitem.iso3)
      } else if(ind < 0.6){
        cgroups[2].items.push(ctitem.iso3)
      } else if(ind < 0.8){
        cgroups[3].items.push(ctitem.iso3)
      } else { // 0.8-1
        cgroups[4].items.push(ctitem.iso3)
      }
    })
    cgroups.forEach(cgroup => {
      mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(cgroup.items))
      mapRef.current.on('mouseenter', `countries-${cgroup.series}`, (mapElement) => {
        mapRef.current.getCanvas().style.cursor = 'pointer'
        // const countryCode = mapElement.features[0].properties.ADM0_A3_IS; // Grab the country code from the map properties.
      })
      mapRef.current.on('mouseleave', `countries-${cgroup.series}`, () => {
        mapRef.current.getCanvas().style.cursor = 'default'
      })
    })
  }
  useEffect(() => {
    if(data && data.projects){
      if(mapLoaded.current) addLayers()
      else mapRef.current.on('load', addLayers)
    }
  }, [data])
  return (
    <div id="map" />
  )
}

export default Map
