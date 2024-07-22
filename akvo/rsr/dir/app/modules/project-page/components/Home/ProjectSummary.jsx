import React from 'react'
import { Collapse } from 'antd'
import styled from 'styled-components'
import SimpleMarkdown from 'simple-markdown'
import isEmpty from 'lodash/isEmpty'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import { Title, Flex, Line } from '../../../components'

const Wrapper = styled.div`
  .ant-collapse-borderless {
    background: transparent;
  }
  @media (max-width: 576px) {
    .ant-collapse-header h3 {
      font-size: ${props => props.theme.font.heading.xs};
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`
const { Panel } = Collapse

const ProjectSummary = ({ project }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  return (
    <Flex direction="column">
      <Title as="h2" type="bold" size="sm" align="center">
        PROJECT SUMMARY
        <Line center />
      </Title>
      <Wrapper>
        <Collapse
          bordered={false}
          className="project-summary"
          expandIconPosition="right"
          expandIcon={({ isActive }) => isActive ? <MinusOutlined /> : <PlusOutlined />}
          accordion
        >
          {(project && !(isEmpty(project.goalsOverview))) && (
            <Panel header={<Title as="h3" size="xs">Goals Overview</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.goalsOverview))}
              </div>
            </Panel>
          )}
          {(project && !(isEmpty(project.background))) && (
            <Panel header={<Title as="h3" size="xs">Background</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.background))}
              </div>
            </Panel>
          )}
          {(project && !(isEmpty(project.currentStatus))) && (
            <Panel header={<Title as="h3" size="xs">Situation at start of project</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.currentStatus))}
              </div>
            </Panel>
          )}
          {(project && !(isEmpty(project.targetGroup))) && (
            <Panel header={<Title as="h3" size="xs">Target group</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.targetGroup))}
              </div>
            </Panel>
          )}
          {(project && !(isEmpty(project.projectPlan))) && (
            <Panel header={<Title as="h3" size="xs">Project plan</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.projectPlan))}
              </div>
            </Panel>
          )}
          {(project && !(isEmpty(project.sustainability))) && (
            <Panel header={<Title as="h3" size="xs">Sustainability</Title>}>
              <div className="paragraph">
                {mdOutput(parse(project.sustainability))}
              </div>
            </Panel>
          )}
        </Collapse>
      </Wrapper>
    </Flex>
  )
}

export default ProjectSummary
