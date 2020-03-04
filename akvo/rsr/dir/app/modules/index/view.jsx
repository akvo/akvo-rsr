/* global window, document */
import React, { useState, useRef, useEffect } from 'react'
import { Button, Tag } from 'antd'
import {cloneDeep} from 'lodash'
import { useFetch } from '../../utils/hooks'
import Projects from './projects'
import Map, { projectsToFeatureData } from './map'
import Search from './search'
import FilterBar from './filter-bar'
import api from '../../utils/api'

let tmid
let tmc = 0
const tmi = 20

const addSelected = (options) => {
  return options.map(it => {
    if(it.options) return {...it, selected: [], options: addSelected(it.options)}
    return it
  })
}

const View = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  // const [data, loading] = useFetch('/project_directory?limit=100')
  const [bounds, setBounds] = useState({})
  const boundsRef = useRef(null)
  const filtersRef = useRef({ sectors: [], orgs: [] })
  const mapRef = useRef()
  const centerRef = useRef(null)
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const projectsWithCoords = data && data.projects && data.projects.filter(it => it.latitude !== null)
  const [filters, setFilters] = useState([])
  // const [filters, setFilters] = useReducer(
  //   (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
  //   { name: '', sectors: [], orgs: [] }
  // )
  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
    api.get('/project_directory?limit=100')
      .then(d => {
        setData(d.data)
        setFilters(d.data.customFields.map(({ id, name, dropdownOptions: {options} }) => ({ id, name, selected: [], options: addSelected(options) })))
      })
  }, [])
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
  const onPan = () => {
    _setBounds(mapRef.current.getBounds())
  }
  const geoFilterProjects = ({ _sw, _ne }) => ({ longitude: lng, latitude: lat }) => {
    let inBounds = true
    if (_sw) inBounds = lng > _sw.lng && lng < _ne.lng && lat > _sw.lat && lat < _ne.lat
    return inBounds
  }
  // console.log(filters)
  // const appliedFilters = Object.keys(filters).filter(it => it !== 'name').map(it => filters[it])
  // console.log(appliedFilters)
  const filterProjects = (_filters) => ({ title, subtitle, sectors, organisations: orgs }) => {
    let inName = true
    let inSectors = true
    let inOrgs = true
    if(_filters.name) inName = title.toLowerCase().indexOf(_filters.name) !== -1 || subtitle.toLowerCase().indexOf(_filters.name) !== -1
    if(data.customFields.length > 0){
      return inName
    }
    if (_filters.sectors.length > 0) inSectors = _filters.sectors.map(id => sectors.indexOf(id) !== -1).indexOf(true) !== -1
    if (_filters.orgs.length > 0) inOrgs = _filters.orgs.map(id => orgs.indexOf(id) !== -1).indexOf(true) !== -1
    return inName && inSectors && inOrgs
  }
  // const _setFilters = to => {
  //   setFilters(to)
  //   const _filters = ({ ...filters, ...to })
  //   filtersRef.current = _filters
  //   const projects = projectsWithCoords.filter(filterProjects(_filters))
  //   mapRef.current.getSource('projects').setData(projectsToFeatureData(projects))
  // }
  const resetZoomAndPan = () => {
    mapRef.current.easeTo({
      center: centerRef.current,
      zoom: 4
    })
  }
  const geoFilteredProjects = data ? projectsWithCoords.filter(geoFilterProjects(bounds)) : []
  const filteredProjects = data ? geoFilteredProjects.filter(filterProjects(filters)).sort((a, b) => a.id - b.id) : []
  const handleHoverProject = (id) => {
    if(ulRef.current){
      const _geoFilteredProjects = data ? projectsWithCoords.filter(geoFilterProjects(boundsRef.current)) : []
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
    // _setFilters({ name })
  }
  const handleSearchClear = () => {
    // _setFilters({ name: '' })
  }
  const handleSetFilter = (subIndex, itemIndex) => {
    let inIndex = subIndex.length - 1
    const _filters = cloneDeep(filters)
    while(inIndex >= 0){
      let subOptions = _filters
      let sub
      let ixIndex = 0
      while(ixIndex <= inIndex){
        sub = subOptions[subIndex[ixIndex]]
        subOptions = subOptions[subIndex[ixIndex]].options
        ixIndex += 1
      }
      if(inIndex === subIndex.length - 1){
        const ssIndex = sub.selected.indexOf(itemIndex)
        if (ssIndex === -1) sub.selected.push(itemIndex)
        else sub.selected.splice(ssIndex, 1)
      } else {
        const _selected = []
        if (sub.selected) {
          sub.options.forEach((it, _in) => {
            if (it.selected && it.selected.length > 0) { _selected.push(_in) }
          })
          sub.selected = _selected
        }
      }
      inIndex -= 1
    }
    setFilters(_filters)
  }
  const removeFilter = (filter) => {
    const _filters = cloneDeep(filters)
    const index = filters.findIndex(it => it.id === filter.id)
    const emptyFilters = (item) => { if(item.selected) item.selected = []; if(item.options){ item.options.forEach(it => emptyFilters(it)) } }
    emptyFilters(_filters[index])
    setFilters(_filters)
  }
  return (
    <div id="map-view">
      <header>
        <img src="/logo" />
        <Search onChange={handleSearch} onClear={handleSearchClear} />
        <div className="filters">
          {filters.length > 0 && <FilterBar {...{filters}} onSetFilter={handleSetFilter} />}
          {filters.filter(it => it.selected.length > 0).map(filter => <Tag closable visible onClose={() => removeFilter(filter)}>{filter.name} ({filter.selected.length})</Tag>)}
          <span className="project-count">{data && filteredProjects.length} projects {data && geoFilteredProjects.length !== projectsWithCoords.length ? 'in this area' : 'globally' }</span>
          {data && geoFilteredProjects.length !== projectsWithCoords.length && <Button type="link" icon="fullscreen" className="show-all" onClick={resetZoomAndPan}>View All</Button>}
          {/* <Select {...selectConfig} placeholder={<span><Icon type="filter" theme="filled" /> All sectors</span>} value={filters.sectors} onChange={sectors => _setFilters({ sectors })}>
            {data && data.sector.map(it => <Option value={it.id}>{`${it.name} (${geoFilteredProjects.filter(item => filters.orgs.length === 0 ? true : filters.orgs.map(id => item.organisations.indexOf(id) !== -1).indexOf(true) !== -1).filter(item => item.sectors.indexOf(it.id) !== -1).length})`}</Option>)}
          </Select>
          <Select {...selectConfig} placeholder={<span><Icon type="filter" theme="filled" /> All organizations</span>} value={filters.orgs} onChange={orgs => _setFilters({ orgs })}>
            {data && data.organisation.map(it => <Option value={it.id}>{`${it.name} (${geoFilteredProjects.filter(item => filters.sectors.length === 0 ? true : filters.sectors.map(id => item.sectors.indexOf(id) !== -1).indexOf(true) !== -1).filter(item => item.organisations.indexOf(it.id) !== -1).length})`}</Option>)}
          </Select> */}
        </div>
        <div className="right-side">
          <a className="login" href="/my-rsr/projects" target="_blank">Login</a>
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
