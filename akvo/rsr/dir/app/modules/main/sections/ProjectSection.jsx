import React, { useState } from 'react'
import { Row, Col } from 'antd'
import ProjectList from './ProjectList'
import { MapView } from '../components/MapView'

const ProjectSection = ({ features, projects }) => {
  const [processing, setProcessing] = useState(false)
  return (
    <Row>
      <Col lg={8}>
        <ProjectList
          {...{
            projects,
            processing
          }}
        />
      </Col>
      <Col lg={16}>
        <MapView
          style={{ width: '100%', height: 550 }}
          featureData={features}
          {...{
            processing,
            setProcessing
          }}
        />
      </Col>
    </Row>
  )
}

export default ProjectSection
