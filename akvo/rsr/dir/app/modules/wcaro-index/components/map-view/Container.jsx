import React, {useState} from 'react'
import {Row} from 'antd'
import Map from './Map'
import ResultsPanel from './ResultsPanel'

const Container = ({countries, period}) => {
  const [indicator, setIndicator] = useState()

  return <>
    <Row style={{height: 'calc(100vh - 230px)', flex: 1, position: 'relative', marginBottom: '-230px'}}>
      <Map indicator={indicator} countries={countries} period={period} />
    </Row>
    <Row style={{ position: 'absolute', left: '20px', top: '250px', width: '400px', height: '75vh', overflowY: 'scroll'}}>
      <ResultsPanel indicator={indicator} setIndicator={setIndicator} />
    </Row>
  </>
}

export default Container
