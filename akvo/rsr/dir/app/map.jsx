import React, { useState } from 'react'
import ReactMapboxGl, { Layer, Cluster, Marker } from 'react-mapbox-gl'
import { Input, Select, Icon } from 'antd'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import pinSvg from './images/pin.svg'
import data from './data.json'
// import

const { Option } = Select
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFydGluY2hyaXN0b3YiLCJhIjoiTXFhSVJTMCJ9.dsByYqa5jm2OU7KwrfV3vA'
});

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
  const [showProjects, setShowProjects] = useState(true)
  // const toggleProjects = () => {}
  return (
    <div id="map-view">
      <header>
        <Input placeholder="Find a project..." />
        <div className="filters">
          <span className="project-count">54 projects in this area</span>
          <Select placeholder="All sectors" value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All sectors</Option>
            {data.sector.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
          <Select placeholder="All organisations" value={null} dropdownMatchSelectWidth={false}>
            <Option value={null}>All organisations</Option>
            {data.organisation.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </div>
      </header>
      <div className="content">
        <div className={classNames('projects', {on: showProjects})}>
          <div className="expander" role="button" tabIndex={-1} onClick={() => setShowProjects(!showProjects)}>
            <Icon type="caret-right" />
          </div>
          <ul>
            {data.projects.map(project =>
              <li>
                <h3>{project.title}</h3>
                <div className="locations">
                  {project.countries.join(', ')}
                </div>
              </li>
            )}
          </ul>
        </div>
        <Map
          style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
          containerStyle={{
            height: 'calc(100vh - 85px)',
            // width: '100vw'
            flex: 1
          }}
          center={[34.28564, 34.1726833]} zoom={[6]}
        >
          <Cluster ClusterMarkerFactory={ClusterMarker}>
          {data.projects.map(project =>
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
