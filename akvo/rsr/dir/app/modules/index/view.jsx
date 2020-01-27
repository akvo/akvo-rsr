import React, { useState, useRef } from 'react'
import { Input, Select, Button } from 'antd'
import { useFetch } from '../../utils/hooks'
import Projects from './projects'
import Map from './map'

const { Option } = Select

let tmid
let tmc = 0
const tmi = 20

const View = () => {
  const [data, loading] = useFetch('/project_directory?limit=100')
  const [bounds, setBounds] = useState({})
  const boundsRef = useRef(null)
  const mapRef = useRef()
  const centerRef = useRef(null)
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
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
  const filterProjects = ({ _sw, _ne }) => ({ longitude: lng, latitude: lat}) => {
    if(!_sw) return true
    return lng > _sw.lng && lng < _ne.lng && lat > _sw.lat && lat < _ne.lat
  }
  const resetZoomAndPan = () => {
    mapRef.current.easeTo({
      center: centerRef.current,
      zoom: 4
    })
  }
  const filteredProjects = data ? data.projects.filter(filterProjects(bounds)) : []
  const handleHoverProject = (id) => {
    if(ulRef.current){
      const _filteredProjects = data ? data.projects.filter(filterProjects(boundsRef.current)) : []
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
  return (
    <div id="map-view">
      <header>
        <Input placeholder="Find a project..." />
        <div className="filters">
          <span className="project-count">{data && filteredProjects.length} projects {data && filteredProjects.length !== data.projects.length ? 'in this area' : 'globally' }</span>
          {data && filteredProjects.length !== data.projects.length && <Button type="link" icon="fullscreen" className="show-all" onClick={resetZoomAndPan}>View All</Button>}
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
        <Projects {...{loading, ulRef}} projects={data && filteredProjects} show={showProjects} setShow={_setShowProjects} />
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
