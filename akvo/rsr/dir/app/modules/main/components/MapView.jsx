/* global document */
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import difference from 'lodash/difference'
import api from '../../../utils/api'
import { getMultiItems } from '../../../utils/misc'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWt2byIsImEiOiJzUFVwR3pJIn0.8dLa4fHG19fBwwBUJMDOSQ'

export const MapView = ({
  mapRef,
  filter,
  search,
  searchResult,
  featureData,
  directories,
  organisations,
  processing,
  setProcessing,
  setDirectories,
  handleOnFetchProjects,
  ...mapProps
}) => {
  const [data, setData] = useState(featureData)
  const [filtered, setFiltered] = useState(false)
  const [preload, setPreload] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [bounds, setBounds] = useState({})
  const [moved, setMoved] = useState(false)

  const boundsRef = useRef(null)

  const getADiffDir = (values) => {
    const a = directories.map((d) => d.properties.id)
    const b = values.map((v) => v.properties.id)
    return (difference(a, b).length)
  }
  const getPartners = (items = []) => {
    return organisations ? organisations.filter((o) => items.includes(o.id)) : []
  }
  const getEmptyPopUp = (message = 'Loading...') => `<div class="popup"><div class="popup-project">${message}</div></div>`
  const getContentPopUp = (props) => {
    const summary = props.projectPlanSummary.length > 180
      ? `<div class="excerpt-hidden">${props.projectPlanSummary}</div><button type="button" class="toggle-excerpt ant-btn ant-btn-link">show</button>`
      : `<div>${props.projectPlanSummary}</div>`
    const partners = getPartners(props.partners)
    return `
        <div class="popup">
          <div class="title">${props.title}</div>
          <div class="subtitle">${props.subtitle}</div>
          <div class="summary">
            <div><strong>Summary</strong></div>
            ${summary}
          </div>
          <div class="partners">
            <div><strong>Partners</strong></div>
            <ul>${partners.map((p) => `<li>${p.longName}</li>`).join('')}</ul>
          </div>
        </div>`
  }
  const getMultiContentPopUp = (props) => {
    const partners = getPartners(props.partners)
    return `
      <div class="popup-project">
      <div class="excerpt-hidden">
        <div class="title">${props.title}</div>
        <div class="subtitle">${props.subtitle}</div>
        <div class="summary"><div><strong>Summary</strong></div>${props.projectPlanSummary}</div>
        <div class="partners">
          <div><strong>Partners</strong></div>
          <ul>${partners.map((p) => `<li>${p.longName}</li>`).join('')}</ul>
        </div>
      </div>
      <button type="button" class="toggle-excerpt ant-btn ant-btn-link">show</button>
    </div>
    `
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
  const handleOnSinglePopUp = (coor, features) => {
    const { properties } = features
    if (properties && properties.id) {
      api
        .get(`/projects_by_id?ids=${properties.id}&fields=title,subtitle,project_plan_summary,partners&format=json`)
        .then((res) => {
          const content = getContentPopUp(res.data[0])
          new mapboxgl
            .Popup({ maxWidth: '470px', closeOnClick: false })
            .setLngLat(coor)
            .setHTML(content)
            .addTo(mapRef.current)
        })
        .catch(() => {
          new mapboxgl
            .Popup({ maxWidth: '470px', closeOnClick: false })
            .setLngLat(coor)
            .setHTML(getEmptyPopUp('No data'))
            .addTo(mapRef.current)
        })
    }
  }
  const handleOnMultiPopUp = (coor, values) => {
    const ids = values.map((f) => f.properties.id)
    if (ids.length) {
      const popUp = new mapboxgl
        .Popup({ maxWidth: '470px', closeOnClick: false })
        .setLngLat(coor)
        .setHTML(getEmptyPopUp('Loading...'))
        .addTo(mapRef.current)
      api
        .get(`/projects_by_id?ids=${ids.join(',')}&fields=title,subtitle,project_plan_summary,partners&format=json`)
        .then((res) => {
          const results = res.data
          if (results.length) {
            const content = results.map((r) => getMultiContentPopUp(r)).join('')
            popUp.setHTML(`<div class="popup">${content}</div>`)
          }
        })
        .catch(() => {
          popUp.setHTML('Sorry, data not found.')
        })
    }
  }
  const handleOnSetFeatures = () => {
    mapRef.current.addSource('projects', {
      data,
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
          '#57c1e8',
          15,
          '#34748b'
        ],
        'circle-stroke-color': [
          'step',
          ['get', 'point_count'],
          '#CCAE72',
          10,
          '#7CBEFD',
          15,
          '#2c6174'
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
        'circle-color': '#4DB1D5',
        'circle-radius': 7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#114F66'
      }
    })
    mapRef.current.on('click', 'clusters', (e) => {
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      })
      const clusterId = features[0].properties.cluster_id
      const pointCount = features[0].properties.point_count;
      const center = features[0].geometry.coordinates;
      const clusterSource = mapRef.current.getSource('projects');
      clusterSource.getClusterExpansionZoom(clusterId, (err, zoom) => { // eslint-disable-line
        if (err) return
        if (zoom > 11) zoom = 11 // prevent maximum zoom on cluster of points on the exact same location
        mapRef.current.easeTo({ center, zoom })
        if (zoom === 11) {
          setTimeout(() => {
            clusterSource.getClusterLeaves(clusterId, pointCount, 0, (error, values) => {
              if (error) return
              handleOnMultiPopUp(center, values)
            })
          }, 200)
        }
      }
      )
    })
    mapRef.current.on('click', 'unclustered-point', (e) => {
      const feature = e.features[0]
      const coordinates = feature.geometry.coordinates.slice()
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }
      handleOnSinglePopUp(coordinates, feature)
    })
  }
  const handleOnFilterBounds = (values) => {
    const geoFilteredProjects = featureData.features.filter(geoFilterProjects(values))
    if (getADiffDir(geoFilteredProjects)) {
      setDirectories(geoFilteredProjects)
    }
    const ids = getMultiItems(geoFilteredProjects)
    handleOnFetchProjects(ids, true)
  }
  const handleOnToggleExcerpt = (e) => {
    const element = e.target
    const sibling = element.previousElementSibling
    const action = element.textContent.toLowerCase()
    if (action === 'show') {
      element.textContent = 'hide'
      sibling.classList.remove('excerpt-hidden')
      sibling.classList.add('excerpt-visible')
    } else {
      element.textContent = 'show'
      sibling.classList.remove('excerpt-visible')
      sibling.classList.add('excerpt-hidden')
    }
  }
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 1
    })
    const nav = new mapboxgl.NavigationControl()
    mapRef.current.addControl(nav, 'top-right')
    mapRef.current.on('load', () => setLoaded(true))
    mapRef.current.on('moveend', handleOnMoveEnd)
    mapRef.current.on('movestart', () => setMoved(true))
    // disable map zoom when using scroll
    mapRef.current.scrollZoom.disable()

    // handle popup show full summary text
    document.addEventListener('click', (e) => {
      for (let target = e.target; target && target !== this; target = target.parentNode) {
        if (target.matches('.toggle-excerpt')) {
          handleOnToggleExcerpt(e)
          break
        }
      }
    }, false)
  }, [])

  useEffect(() => {
    if (data && mapRef.current && organisations) {
      if (loaded && preload) {
        setPreload(false)
        handleOnSetFeatures()
      }
      if (!preload) {
        const geojsonSource = mapRef.current.getSource('projects')
        if (geojsonSource && data) {
          // Update the data after the GeoJSON source was created
          geojsonSource.setData(data)
        }
        mapRef.current.on('load', handleOnSetFeatures)
      }
    }
  }, [data, organisations, loaded, preload, mapRef])

  useEffect(() => {
    if (!data && featureData) {
      setData(featureData)
    }
    if (!filtered && filter.apply && (searchResult && searchResult.length >= 0) && featureData) {
      const dataFeatures = featureData.features.filter((f) => (searchResult.includes(f.properties.id)))
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
          const coords = [coordinates[0], coordinates[coordinates.length - 1]]
          mapRef.current.fitBounds(coords, { padding: 10 })
        }
      }
      setData({
        ...data,
        features: dataFeatures
      })
      setFiltered(true)
    }

    if (!searchResult && filtered && featureData) {
      setFiltered(false)
      setData(featureData)
    }

    if (Object.keys(bounds).length && featureData && moved) {
      setMoved(false)
      if (!filter.apply) {
        handleOnFilterBounds(bounds)
      }
    }
  }, [featureData, search, searchResult, filter, moved, filtered, data, bounds])
  return <div id="map" {...mapProps} />
}
