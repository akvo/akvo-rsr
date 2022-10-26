import React from 'react'
import { Row, Col } from 'react-awesome-styled-grid'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'
import styled from 'styled-components'
import { MAX_TEXT_LENGTH } from '../../../../utils/config'
import { shortenText } from '../../../../utils/string'
import { Button, Icon, Paragraph, Space, Text } from '../../../components'

const Wrapper = styled.div`
  padding-top: 20px;
  p {
    color: ${props => props.theme.color.primary['900']};
  }
`

const HomeSummary = ({ project, sectors, match: { params } }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  const { data: updates } = useSelector((state) => state.projectUpdates)

  return (
    <Wrapper>
      <Row>
        <Col xs={4}>
          <Text as="h6" size="xl">Project Summary</Text>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Text as="strong" type="bold">SECTORS :</Text>
          <Text as="p">{sectors ? sectors.map((sc) => sc.codeLabel.split('-')[1]).join(',') : null}</Text>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Paragraph align="justify" size="sm">{mdOutput(parse(shortenText(project.projectPlanSummary, MAX_TEXT_LENGTH)))}</Paragraph>
        </Col>
      </Row>
      <Row>
        <Col xs={4} align="start">
          {(updates.length > 0) && (
            <Space y={{ lg: '24px', md: '24px' }}>
              <Button type="link" href={`/dir/project/${params.projectId}/updates`} antd>
                Find Out More<Icon type="arrow.right" />
              </Button>
            </Space>
          )}
        </Col>
      </Row>
    </Wrapper>
  )
}

export default withRouter(HomeSummary)
