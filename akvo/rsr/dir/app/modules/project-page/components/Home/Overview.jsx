import React from 'react'
import { Progress, Tooltip } from 'antd'
import { Row, Col } from 'react-awesome-styled-grid'
import moment from 'moment'
import styled from 'styled-components'

import {
  Title,
  Button,
  Flex,
  Text,
} from '../../../components'
import { dateText } from '../../../../utils/misc'

const Wrapper = styled.div`
  h1, div {
    color: ${props => props.theme.color.primary['900']};
  }
  h2, strong {
    color: ${props => props.theme.color.gray['900']};
  }
  strong {
    width: 50px;
  }
  .ant-progress {
    margin: 8px 0;
    .ant-progress-bg, .ant-progress-inner {
      height: 16px !important;
    }
    .ant-progress-inner {
      background-color: ${props => props.theme.color.white};
    }
  }
  .ant-progress-success-bg, .ant-progress-bg {
    background: ${props => props.theme.color.primary['900']};
  }
  @media (max-width: 1024px) {
    h1 {
      font-size: ${props => props.theme.font.heading.sm};
    }
    h2 {
      font-size: ${props => props.theme.font.size.lg};
    }
    button {
      font-size: ${props => props.theme.font.size.xs};
    }
  }
  @media (min-width: 320px) and (max-width: 576px) {
    margin-bottom: 90px;
  }
  @media (max-width: 320px) {
    margin-bottom: 90px;
  }
`

const HomeOverview = ({ project }) => {
  const startDate = (project && project.dateStartActual) ? moment(project.dateStartActual, 'YYYY-MM-DD') : null
  const finishDate = (project && project.dateEndPlanned) ? moment(project.dateEndPlanned, 'YYYY-MM-DD') : null
  const progress = (startDate && finishDate) ? moment().diff(startDate) / finishDate.diff(startDate) * 100 : 0
  const endDate = project ? project.dateEndActual || project.dateEndPlanned : null
  return (
    <Wrapper>
      <Title as="h1" type="bold">{project.title}</Title>
      <Title as="h2" size="xs" thin>{project.subtitle}</Title>
      <Flex direction="column" gap="12px">
        <Flex>
          <Text as="strong" type="bold">STATUS</Text>
          <Text>{`: ${project.statusLabel}`}</Text>
        </Flex>
        <Flex>
          <Text as="strong" type="bold">IATI ID</Text>
          <Text>{`: ${project.iatiActivityId || '-'}`}</Text>
        </Flex>
        <Tooltip title={`${progress > 100 ? 100 : progress.toFixed(2)} %`}>
          <Progress percent={progress} showInfo={false} />
        </Tooltip>
      </Flex>
      <Flex direction="column">
        <Flex justify="space-between">
          <div>
            <Text as="strong" type="bold">START DATE :</Text>
            <Text>
              {dateText(project.dateStartActual || project.dateStartPlanned)}
            </Text>
          </div>
          <div>
            <Text as="strong" type="bold">END DATE:</Text>
            <Text>
              {endDate ? dateText(endDate) : '-'}
            </Text>
          </div>
        </Flex>
        <Row>
          <Col lg={5} md={8} sm={4} xs={4}>
            <Button href={`/py-reports/project/${project.id}/overview-report/`} blank block>
              Download Full Report
            </Button>
          </Col>
        </Row>
      </Flex>
    </Wrapper>
  )
}

export default HomeOverview
