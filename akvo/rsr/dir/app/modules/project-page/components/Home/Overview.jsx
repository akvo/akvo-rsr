import React from 'react'
import { Progress, Tooltip } from 'antd'
import { Row, Col } from 'react-awesome-styled-grid'
import moment from 'moment'
import styled from 'styled-components'

import {
  Title,
  Button,
  Text,
  Label,
  Space,
} from '../../../components'
import { dateText } from '../../../../utils/misc'

const Wrapper = styled.div`
  h1, span {
    color: ${props => props.theme.color.primary['900']};
  }
  h2, strong {
    color: ${props => props.theme.color.gray['900']};
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
  @media (max-width: 576px) {
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
      <Row>
        <Col xs={4}>
          <Label>
            <Text as="strong" type="bold">STATUS : </Text>
            <Text as="span">{project.statusLabel}</Text>
          </Label>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Label>
            <Text as="strong" type="bold">IATI ID : </Text>
            <Text as="span">{project.iatiActivityId || '-'}</Text>
          </Label>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Tooltip title={`${progress > 100 ? 100 : progress.toFixed(2)} %`}>
            <Progress percent={progress} showInfo={false} />
          </Tooltip>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col xs={2}>
          <Text as="strong" type="bold">START DATE :</Text>
          <Text as="span">
            {dateText(project.dateStartActual || project.dateStartPlanned)}
          </Text>
        </Col>
        <Col xs={2} align="end">
          <Text as="strong" type="bold">END DATE :</Text>
          <Text as="span">
            {endDate ? dateText(endDate) : '-'}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Space y={{ lg: '24px', md: '24px' }}>
            <Button href={`/py-reports/project/${project.id}/overview-report/`} blank>
              Download Full Report
            </Button>
          </Space>
        </Col>
      </Row>
    </Wrapper>
  )
}

export default HomeOverview
