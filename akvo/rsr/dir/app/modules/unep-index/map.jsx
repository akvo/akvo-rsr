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

const Map = ({ data, getRef, handleCountryClick, countryFilter }) => {
  const mapRef = useRef(null)
  const mapLoaded = useRef(false)
  const cgroupsRef = useRef([
    { series: 10, color: '#00b4d8', items: [] },
    { series: 20, color: '#0096c7', items: [] },
    { series: 30, color: '#0077b6', items: [] },
    { series: 40, color: '#023e8a', items: [] },
    { series: 50, color: '#03045e', items: [] }
  ])
  const countryFilterRef = useRef()
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
  const countryClick = (mapElement) => {
    const countryCode = mapElement.features[0].properties.ADM0_A3_IS
    handleCountryClick(lookup.byIso(countryCode).iso2)
  }
  const addLayers = () => {
    mapRef.current.addSource('countries', {
      'type': 'vector',
      'url': 'mapbox://akvo.cx9b0u13'
    })
    cgroupsRef.current.forEach(it => {
      mapRef.current.addLayer({
        'id': `countries-${it.series}-a`,
        'source': 'countries',
        'source-layer': 'ne_10m_admin_0_countries-2tez61',
        'type': 'fill',
        'paint': {
          'fill-opacity': 0.15,
          'fill-color': it.color,
          'fill-outline-color': '#444'
        },
        'filter': ['in', 'ADM0_A3_IS', '']
      }, 'country-label', 'settlement-major-label')
      mapRef.current.addLayer({
        'id': `countries-${it.series}`,
        'source': 'countries',
        'source-layer': 'ne_10m_admin_0_countries-2tez61',
        'type': 'fill',
        'paint': {
          'fill-opacity': 0.55,
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
        cgroupsRef.current[0].items.push(ctitem.iso3)
      } else if(ind < 0.4){
        cgroupsRef.current[1].items.push(ctitem.iso3)
      } else if(ind < 0.6){
        cgroupsRef.current[2].items.push(ctitem.iso3)
      } else if(ind < 0.8){
        cgroupsRef.current[3].items.push(ctitem.iso3)
      } else { // 0.8-1
        cgroupsRef.current[4].items.push(ctitem.iso3)
      }
    })
    cgroupsRef.current.forEach(cgroup => {
      mapRef.current.setFilter(`countries-${cgroup.series}-a`, ['in', 'ADM0_A3_IS'].concat(cgroup.items))
      mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(cgroup.items))
      mapRef.current.on('mousemove', `countries-${cgroup.series}`, () => {
        mapRef.current.getCanvas().style.cursor = 'pointer'
      })
      mapRef.current.on('mouseleave', `countries-${cgroup.series}`, () => {
        mapRef.current.getCanvas().style.cursor = 'default'
        if (countryFilterRef.current.length > 0) {
          const _countries = []
          countryFilterRef.current.forEach(it => {
            const iso3 = lookup.byInternet(it).iso3
            if (cgroup.items.indexOf(iso3) !== -1) _countries.push(iso3)
          })
          mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(_countries))
        }
      })
      mapRef.current.on('mousemove', `countries-${cgroup.series}-a`, () => {
        mapRef.current.getCanvas().style.cursor = 'pointer'
      })
      mapRef.current.on('mouseenter', `countries-${cgroup.series}-a`, (mapElement) => {
        mapRef.current.getCanvas().style.cursor = 'pointer'
        if (countryFilterRef.current.length > 0) {
          const _countries = []
          countryFilterRef.current.forEach(it => {
            const iso3 = lookup.byInternet(it).iso3
            if (cgroup.items.indexOf(iso3) !== -1) _countries.push(iso3)
          })
          if (_countries.indexOf(mapElement.features[0].properties.ADM0_A3_IS) === -1) {
            _countries.push(mapElement.features[0].properties.ADM0_A3_IS)
          }
          mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(_countries))
        }
      })
      mapRef.current.on('click', `countries-${cgroup.series}-a`, countryClick)
    })
  }
  useEffect(() => {
    if(data && data.projects){
      if(mapLoaded.current) addLayers()
      else mapRef.current.on('load', addLayers)
    }
  }, [data])
  useEffect(() => {
    countryFilterRef.current = countryFilter
    if (mapLoaded.current){
      if(countryFilter.length > 0){
        cgroupsRef.current.forEach(cgroup => {
          const countries = []
          countryFilter.forEach(it => {
            const iso3 = lookup.byInternet(it).iso3
            if(cgroup.items.indexOf(iso3) !== -1) countries.push(iso3)
          })
          mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(countries))
        })
      } else {
        cgroupsRef.current.forEach(cgroup => {
          mapRef.current.setFilter(`countries-${cgroup.series}`, ['in', 'ADM0_A3_IS'].concat(cgroup.items))
        })
      }
    }
  }, [countryFilter])
  return (
    <div id="map" />
  )
}

export default Map
