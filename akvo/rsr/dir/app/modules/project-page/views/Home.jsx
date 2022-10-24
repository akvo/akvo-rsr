import React from 'react'
import { Skeleton } from 'antd'
import { Col, Container, Row } from 'react-awesome-styled-grid'
import isEmpty from 'lodash/isEmpty'

import { queryProjectSectors } from '../queries'
import { Section } from '../../components'

import HomeOverview from '../components/Home/Overview'
import HomeSummary from '../components/Home/Summary'
import ProjectSummary from '../components/Home/ProjectSummary'
import Finance from '../components/Home/Finance'
import Partner from '../components/Home/Partner'
import Highlight from '../components/Home/Highlight'

const Home = ({ project, projectId, projectError }) => {
  const { data: dataSectors } = queryProjectSectors(projectId)
  const { results: sectors } = dataSectors || {}
  const loading = (!project && !projectError)
  return (
    <>
      <Section primary id="rsr-project-overview">
        <Container>
          <Row justify="space-between">
            <Col lg={6} md={6} sm={8} xs={4}>
              <Skeleton paragraph={{ rows: 7 }} loading={loading} active>
                {project && <HomeOverview project={project} />}
              </Skeleton>
            </Col>
            <Col lg={5} md={6} sm={8} xs={4} align="center">
              <Skeleton paragraph={{ rows: 7 }} loading={loading} active>
                {project && (
                  <HomeSummary
                    {...{
                      project,
                      sectors
                    }}
                  />
                )}
              </Skeleton>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Highlight />
        </Container>
      </Section>
      <Section primary>
        <Container>
          <Skeleton paragraph={{ rows: 7 }} loading={loading} active>
            {project && <Finance {...project} projectId={projectId} />}
          </Skeleton>
        </Container>
      </Section>
      <Section>
        <Container>
          <Partner projectId={projectId} />
        </Container>
      </Section>
      {
        (project && (
          !(isEmpty(project.goalsOverview)) ||
          !(isEmpty(project.background)) ||
          !(isEmpty(project.currentStatus)) ||
          !(isEmpty(project.targetGroup)) ||
          !(isEmpty(project.projectPlan)) ||
          !(isEmpty(project.sustainability))
        )) && (
          <Section primary>
            <Container>
              <ProjectSummary project={project} />
            </Container>
          </Section>
        )
      }
    </>
  )
}

export default Home
