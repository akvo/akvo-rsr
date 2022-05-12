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
    <Col lg={16}>
      <Spin spinning={(!featureData)}>
        <MapView
          style={{ width: '100%', height: 550 }}
          {...{
            filter,
            search,
            featureData,
            directories,
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
