import React, { useState, useRef } from 'react'
import { Input, Select } from 'antd'
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
  return (
    <div id="map-view">
      <header>
        <Input placeholder="Find a project..." />
        <div className="filters">
          <span className="project-count">{data && data.projects.filter(filterProjects(bounds)).length} projects in this area</span>
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
        <Projects {...{loading}} projects={data && data.projects.filter(filterProjects(bounds))} show={showProjects} setShow={_setShowProjects} />
        <Map
          data={data}
          getRef={ref => { mapRef.current = ref }}
          handlePan={onPan}
        />
      </div>
    </div>
  )
}

export default View
