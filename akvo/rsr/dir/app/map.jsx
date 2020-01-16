import React from 'react'
import ReactMapboxGl, { Layer, Cluster, Marker } from 'react-mapbox-gl'
import SVGInline from 'react-svg-inline'
import pinSvg from './images/pin.svg'
import data from './data.json'

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
  return (
    <div>
      <Map
        style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        center={[34.28564, 34.1726833]} zoom={[6]}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          {/* <Feature coordinates={[34.28564, 34.1726833]} /> */}
        </Layer>
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
  )
}

export default View
