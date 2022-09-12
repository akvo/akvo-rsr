import React from 'react'
import { Row, Col } from 'react-awesome-styled-grid'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'
import styled from 'styled-components'
import { shortenText } from '../../../../utils/string'
import { Button, Flex, Icon, Paragraph, Text } from '../../../components'

const Wrapper = styled.div`
  p {
    color: ${props => props.theme.color.primary['900']};
  }
  button {
    text-align: left;
  }
`

const HomeSummary = ({ project, sectors, match: { params } }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  const { data: updates } = useSelector((state) => state.projectUpdates)

  return (
    <Wrapper>
      <Flex direction="column" gap="16px">
        <Text as="h6" size="xl">Project Summary</Text>
        <div>
          <Text as="strong" type="bold">SECTORS :</Text>
          <Text as="p">{sectors ? sectors.map((sc) => sc.codeLabel.split('-')[1]).join(',') : null}</Text>
        </div>
      </Flex>
      <Flex direction="column" gap="24px">
        <Paragraph align="justify" size="sm">{mdOutput(parse(shortenText(project.projectPlanSummary, 800)))}</Paragraph>
        <Row>
          <Col lg={5} md={8} sm={8} xs={4}>
            {(updates.length > 0) && (
              <Button
                href={`/dir/project/${params.projectId}/updates`}
                border="none"
                padding="0"
              >
                Find Out More
                <Icon type="arrow.right" />
              </Button>
            )}
          </Col>
        </Row>
      </Flex>
    </Wrapper>
  )
}

export default withRouter(HomeSummary)
