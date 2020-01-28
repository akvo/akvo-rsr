import React, { useState, useRef, useReducer } from 'react'
import { Input, Select, Button } from 'antd'
import { useFetch } from '../../utils/hooks'
import Projects from './projects'
import Map, { projectsToFeatureData } from './map'
import Search from './search'

const { Option } = Select

let tmid
let tmc = 0
const tmi = 20

const View = () => {
  const [data, loading] = useFetch('/project_directory?limit=100')
  const [bounds, setBounds] = useState({})
  const boundsRef = useRef(null)
  const filtersRef = useRef(null)
  const mapRef = useRef()
  const centerRef = useRef(null)
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { name: '', sectors: [], organisations: [] }
  )
  const _setShowProjects = (to) => {
    setShowProjects(to)
    if(mapRef.current){
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if(tmc > 700) clearInterval(tmid) }, tmi)
    }
  }
  const _setBounds = (_bounds) => {
    setBounds(_bounds)
    boundsRef.current = _bounds
  }
  const _setFilters = to => {
    setFilters(to)
    const _filters = ({ ...filters, ...to })
    filtersRef.current = _filters
    const projects = data.projects.filter(({title, subtitle}) => {
      let inName = true
      if (_filters.name) inName = title.toLowerCase().indexOf(_filters.name) !== -1 || subtitle.toLowerCase().indexOf(_filters.name) !== -1
      return inName
    })
    mapRef.current.getSource('projects').setData(projectsToFeatureData(projects))
  }
  const onPan = () => {
    _setBounds(mapRef.current.getBounds())
  }
  const geoFilterProjects = ({ _sw, _ne }) => ({ longitude: lng, latitude: lat }) => {
    let inBounds = true
    if (_sw) inBounds = lng > _sw.lng && lng < _ne.lng && lat > _sw.lat && lat < _ne.lat
    return inBounds
  }
  const filterProjects = (_filters) => ({ title, subtitle }) => {
    let inName = true
    if(_filters.name) inName = title.toLowerCase().indexOf(_filters.name) !== -1 || subtitle.toLowerCase().indexOf(_filters.name) !== -1
    return inName
  }
  const resetZoomAndPan = () => {
    mapRef.current.easeTo({
      center: centerRef.current,
      zoom: 4
    })
  }
  const geoFilteredProjects = data ? data.projects.filter(geoFilterProjects(bounds)) : []
  const filteredProjects = data ? geoFilteredProjects.filter(filterProjects(filters)) : []
  const handleHoverProject = (id) => {
    if(ulRef.current){
      const _geoFilteredProjects = data ? data.projects.filter(geoFilterProjects(bounds)) : []
      const _filteredProjects = data ? _geoFilteredProjects.filter(filterProjects(filtersRef.current)) : []
      const pi = _filteredProjects.findIndex(it => it.id === id)
      if(pi !== -1){
        const top = ulRef.current.children[pi].offsetTop - 60
        ulRef.current.children[pi].classList.add('hover')
        if(top > ulRef.current.scrollTop + ulRef.current.clientHeight - 120 || top < ulRef.current.scrollTop){
          ulRef.current.scroll({ top, behavior: 'smooth' })
        }
      }
    }
  }
  const handleHoverOutProject = () => {
    if (ulRef.current) {
      const el = ulRef.current.getElementsByClassName('hover')
      if(el.length > 0){
        el[0].classList.remove('hover')
      }
    }
  }
  const handleSearch = (name) => {
    _setFilters({ name })
  }
  const handleSearchClear = () => {
    _setFilters({ name: '' })
  }
  return (
    <div id="map-view">
      <header>
        <img src="https://eutf-syria.akvoapp.org/media/db/partner_sites/eu-trustfund-syria-region/logo/ec.png" />
        <Search onChange={handleSearch} onClear={handleSearchClear} />
        <div className="filters">
          <span className="project-count">{data && filteredProjects.length} projects {data && geoFilteredProjects.length !== data.projects.length ? 'in this area' : 'globally' }</span>
          {data && geoFilteredProjects.length !== data.projects.length && <Button type="link" icon="fullscreen" className="show-all" onClick={resetZoomAndPan}>View All</Button>}
          <Select value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All sectors</Option>
            {data && data.sector.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
          <Select value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All organisations</Option>
            {data && data.organisation.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </div>
      </header>
      <div className="content">
        <Projects {...{loading, ulRef}} projects={data ? filteredProjects : []} show={showProjects} setShow={_setShowProjects} />
        <Map
          data={data}
          getRef={ref => { mapRef.current = ref }}
          getCenter={center => { centerRef.current = center }}
          handlePan={onPan}
          onHoverProject={handleHoverProject}
          onHoverOutProject={handleHoverOutProject}
        />
      </div>
    </div>
  )
}

export default View
