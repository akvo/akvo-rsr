import React from 'react'
import ReactMapboxGl, { Cluster, Marker } from 'react-mapbox-gl'
import { Input, Select } from 'antd'
import SVGInline from 'react-svg-inline'
import pinSvg from './images/pin.svg'
import { useFetch } from './utils/hooks'
import Projects from './projects'

const { Option } = Select
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFydGluY2hyaXN0b3YiLCJhIjoiTXFhSVJTMCJ9.dsByYqa5jm2OU7KwrfV3vA'
})

const colors = ['#19204b', '#1d2964', '#23347c', '#2c498b', '#35619b', '#3e78ab', '#4891bb', '#52aacb', '#6abdd0', '#8ecccc', '#b4dbcb', '#dceac9']

const ClusterMarker = (coordinates, count) => {
  let backgroundColor
  if(count > 20) backgroundColor = colors[0]
  else backgroundColor = colors[10 - ~~(count / 2)]
  const width = 30 + count * 2
  return (
    <Marker coordinates={coordinates} className="cluster-marker" style={{ backgroundColor, width, height: width }}>
      {count}
    </Marker>
  )
}

// mapbox://styles/mapbox/streets-v9

const View = () => {
  const [data, loading] = useFetch('/project_directory?limit=100')
  return (
    <div id="map-view">
      <header>
        <Input placeholder="Find a project..." />
        <div className="filters">
          <span className="project-count">{data && data.projects.length} projects in this area</span>
          <Select placeholder="All sectors" value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All sectors</Option>
            {data && data.sector.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
          <Select placeholder="All organisations" value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All organisations</Option>
            {data && data.organisation.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </div>
      </header>
      <div className="content">
        <Projects data={data} />
        <Map
          style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
          containerStyle={{
            height: 'calc(100vh - 85px)',
            flex: 1
          }}
          center={[34.28564, 34.1726833]} zoom={[6]}
        >
          <Cluster ClusterMarkerFactory={ClusterMarker}>
          {data && data.projects.map(project =>
          <Marker coordinates={[project.longitude, project.latitude]} style={{ width: 30, height: 40}} anchor="bottom">
            <div className="svg-marker">
              <SVGInline svg={pinSvg} />
            </div>
          </Marker>
          )}
          </Cluster>
        </Map>
      </div>
    </div>
  )
}

export default View
