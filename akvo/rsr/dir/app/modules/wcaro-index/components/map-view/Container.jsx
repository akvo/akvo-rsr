import React, { useState } from 'react'
import { Row, Col } from 'antd'
import { queryGeoData } from './queries'
import Map from './Map'
import ResultsPanel from './ResultsPanel'

const Container = ({ countries, period, search, loading, setLoading }) => {
  const [indicator, setIndicator] = useState()
  const { data, error } = queryGeoData()
  return <>
    <Row>
      <Col span={24} style={{ height: '74vh' }}>
        <Map indicator={indicator} {...{ countries, period, data, error }} />
      </Col>
    </Row>
    <Row>
      <Col span={7} className="wcaro-map-sidebar sidebar-container">
        <ResultsPanel
          {...{
            geo: data,
            loading,
            search,
            error,
            indicator,
            countries,
            period,
            setIndicator,
            setLoading
          }}
        />
      </Col>
    </Row>
  </>
}

export default Container
