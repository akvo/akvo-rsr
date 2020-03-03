/* global window, document */
import React, { useState, useRef, useReducer, useEffect } from 'react'
import { Select, Button, Icon, Input } from 'antd'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import { useSpring, animated } from 'react-spring'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useFetch } from '../../utils/hooks'
import Projects from './projects'
import Map, { projectsToFeatureData } from './map'
import Search from './search'
import filterSvg from '../../images/filter.svg'

const { Option } = Select

let tmid
let tmc = 0
const tmi = 20

const View = () => {
  const [data, loading] = useFetch('/project_directory?limit=100')
  const [bounds, setBounds] = useState({})
  const boundsRef = useRef(null)
  const filtersRef = useRef({ sectors: [], orgs: [] })
  const mapRef = useRef()
  const centerRef = useRef(null)
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const projectsWithCoords = data && data.projects && data.projects.filter(it => it.latitude !== null)
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { name: '', sectors: [], orgs: [] }
  )
  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
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
  const filterProjects = (_filters) => ({ title, subtitle, sectors, organisations: orgs }) => {
    let inName = true
    let inSectors = true
    let inOrgs = true
    if(_filters.name) inName = title.toLowerCase().indexOf(_filters.name) !== -1 || subtitle.toLowerCase().indexOf(_filters.name) !== -1
    if(_filters.sectors.length > 0) inSectors = _filters.sectors.map(id => sectors.indexOf(id) !== -1).indexOf(true) !== -1
    if(_filters.orgs.length > 0) inOrgs = _filters.orgs.map(id => orgs.indexOf(id) !== -1).indexOf(true) !== -1
    return inName && inSectors && inOrgs
  }
  const _setFilters = to => {
    setFilters(to)
    const _filters = ({ ...filters, ...to })
    filtersRef.current = _filters
    const projects = projectsWithCoords.filter(filterProjects(_filters))
    mapRef.current.getSource('projects').setData(projectsToFeatureData(projects))
  }
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
    _setFilters({ name })
  }
  const handleSearchClear = () => {
    _setFilters({ name: '' })
  }
  // const selectConfig = {
  //   mode: 'multiple',
  //   allowClear: true,
  //   size: 'small',
  //   maxTagTextLength: 12,
  //   dropdownMatchSelectWidth: false,
  //   dropdownAlign: {
  //     points: ['tr', 'br']
  //   }
  // }
  return (
    <div id="map-view">
      <header>
        <img src="/logo" />
        <Search onChange={handleSearch} onClear={handleSearchClear} />
        <div className="filters">
          {data && <FilterBar customFields={data.customFields} onSetFilters={_setFilters} />}

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

const FilterBar = ({ customFields = [], onSetFilters }) => {
  const [open, setOpen] = useState(false)
  const [sub, setSub] = useState(null)
  const [step, setStep] = useState(0)
  const subRef = useRef()
  const [height, setHeight] = useState(customFields.length * 42)
  const props = useSpring({ marginLeft: step * -360, height })
  // const hProps = useSpring({ height })
  const initialFilterState = {}
  customFields.forEach(it => { initialFilterState[it.id] = [] })
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialFilterState
  )
  const setFilter = (opt) => {
    const mod = {}
    const ind = filters[sub.id].indexOf(opt)
    mod[sub.id] = ind === -1 ? [...filters[sub.id], opt] : [...filters[sub.id].slice(0, ind), ...filters[sub.id].slice(ind + 1)]
    setFilters({...filters, ...mod})
    onSetFilters({ ...filters, ...mod })
  }
  const _setSub = (_sub) => {
    setSub(_sub)
    setStep(1)
    setTimeout(() => {
      if(subRef.current) setHeight(subRef.current.clientHeight + 40)
    }, 50)
  }
  const back = () => {
    setStep(0)
    setHeight(customFields.length * 42)
    setTimeout(() => setSub(null), 300)
  }
  return [
    <div className={classNames('filters-btn', { open })} onClick={() => setOpen(!open)} role="button" tabIndex="-1">
      <SVGInline svg={filterSvg} /> Filter projects
    </div>,
    <TransitionGroup component={null}>
    {open &&
    <CSSTransition
      key="prj"
      timeout={500}
      classNames="dropdown"
    >
    <div className="filters-dropdown">
      <div className="hider">
      <animated.div className="holder" style={props}>
        <div>
          <ul>
            {customFields.map(field => <li onClick={() => _setSub(field)}>{field.name} <div>{filters[field.id].length > 0 && <div className="selected">{filters[field.id].length} selected</div>} <Icon type="right" /></div></li>)}
          </ul>
        </div>
        {sub &&
          <div className="sub">
            <div className="top">
              <Button type="link" icon="left" onClick={back}>Back</Button>
              {filters[sub.id].length > 0 &&
              <div className="selected">
                {filters[sub.id].length} selected
              </div>
              }
            </div>
            <ul ref={(ref) => { subRef.current = ref }}>
              {sub.dropdownOptions.options.map(opt => <li className={filters[sub.id].indexOf(opt) !== -1 && 'active'} onClick={() => setFilter(opt)}>{opt.name}</li>)}
            </ul>
          </div>
        }
      </animated.div>
      </div>
    </div>
    </CSSTransition>
    }
    </TransitionGroup>
  ]
}

export default View
