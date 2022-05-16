import React from 'react'
import { Row, Col, Spin } from 'antd'

import { MapView } from '../components/MapView'
import ProjectList from './ProjectList'

const ProjectSection = ({
  filter,
  search,
  processing,
  projects,
  featureData,
  directories,
  organisations,
  setProjects,
  setProcessing,
  setDirectories,
  handleOnFetchProjects
}) => (
  <Row>
    <Col lg={8}>
      <ProjectList
        {...{
          filter,
          projects,
          processing,
          directories,
          setProjects
        }}
      />
    </Col>
    <Col lg={16} id="map-view">
      <Spin spinning={(!featureData)}>
        <MapView
          style={{ width: '100%', height: 550 }}
          {...{
            filter,
            search,
            featureData,
            directories,
            organisations,
            processing,
            setProcessing,
            setDirectories,
            handleOnFetchProjects
          }}
        />
      </Spin>
    </Col>
  </Row>
)

export default ProjectSection
