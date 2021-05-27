/* global document */
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
  if ((s - n) < 6) {
    const latCenter = s - ((s - n) / 2)
    s = latCenter + 3
    n = latCenter - 3
  }
  if ((e - w) < 6) {
    const lngCenter = e - ((e - w) / 2)
    e = lngCenter + 3
    w = lngCenter - 3
  }
  const sw = new LngLat(w, s)
  const ne = new LngLat(e, n)
  return new LngLatBounds(sw, ne)
}
const mapOrgIdToName = (organisations) => {
  const dict = {}
  organisations.forEach((org) => {
    dict[org.id] = org.longName
  })
  return dict
}
const getPartners = (project, orgMap) => {
  const partners = []
  project.organisations.forEach((org) => {
    if (org in orgMap) {
      partners.push(orgMap[org])
    }
  })
  return partners
}
export const projectsToFeatureData = (projects, organisations = []) => {
  const orgMap = mapOrgIdToName(organisations)
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
        title: item.title,
        subtitle: item.subtitle,
        url: item.url,
        summary: item.summary,
        partners: getPartners(item, orgMap)
      }
    }))
  }
}
function onClickPopupShowSummary(e) {
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

    // handle popup show full summary text
    document.addEventListener('click', function (e) {
      for (let target = e.target; target && target !== this; target = target.parentNode) {
        if (target.matches('.popup-show-summary')) {
          onClickPopupShowSummary(e)
          break;
        }
      }
    }, false);
  }, [])
  useEffect(() => {
    if(data && data.projects){
      const projectsWithCoords = data.projects.filter(it => it.latitude !== null)
      const setFeatures = () => {
        const featureData = projectsToFeatureData(projectsWithCoords, data.organisation)
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
        mapRef.current.on('click', 'unclustered-point', (e) => {
          const feature = e.features[0]
          const coordinates = feature.geometry.coordinates.slice()
          const props = feature.properties
          const partners = JSON.parse(props.partners)
          const summary = props.summary.length > 180 ?
            `<div class="excerpt-hidden">${props.summary}</div><a class="popup-show-summary" href="#">show</a>` :
            `<div>${props.summary}</div>`
          const partnerList = `<ul>${partners.map((p) => `<li>${p}</li>`).join('')}</ul>`
          const content = `
            <div class="popup">
              <div class="title">${props.title}</div>
              <div class="subtitle">${props.subtitle}</div>
              <div class="summary"><div><strong>Summary</strong></div>${summary}</div>
              <div class="partners"><div><strong>Partners</strong>${partnerList}</div>
            </div>`

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup({maxWidth: '470px'})
            .setLngLat(coordinates)
            .setHTML(content)
            .addTo(mapRef.current);
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
