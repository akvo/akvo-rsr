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
  const mapRef = useRef()
  const centerRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const _setShowProjects = (to) => {
    setShowProjects(to)
    if(mapRef.current){
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if(tmc > 700) clearInterval(tmid) }, tmi)
    }
  }
  const onPan = () => {
    setBounds(mapRef.current.getBounds())
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
        <Projects {...{loading}} projects={data && filteredProjects} show={showProjects} setShow={_setShowProjects} />
        <Map
          data={data}
          getRef={ref => { mapRef.current = ref }}
          getCenter={center => { centerRef.current = center }}
          handlePan={onPan}
        />
      </div>
    </div>
  )
}

export default View
