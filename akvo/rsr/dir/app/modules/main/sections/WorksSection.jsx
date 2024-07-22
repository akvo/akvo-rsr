import React from 'react'
import { Collapse } from 'antd'

import {
  Container,
  Row,
  Col,
  Visible,
  Hidden,
} from 'react-awesome-styled-grid'
import classNames from 'classnames'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

import {
  Space,
  Button,
  Card,
  Icon,
  Title,
  Paragraph,
} from '../../components'
import { scheduleDemoUrl } from '../../../utils/config'
import { homePage } from '../../../utils/ui-text'

import jsonWorks from '../../../json/how-it-works.json'
import jsonFeatures from '../../../json/features.json'


const WorksSection = () => (
  <Container>
    <Row>
      <Col align="center" sm={8}>
        <Title as="h1" type="bold">{homePage.howItWorks}</Title>
      </Col>
    </Row>
    <Space y={{ lg: '32px', md: '16px', sm: '8px' }}>
      <Hidden md sm>
        <Row>
          {jsonWorks.map(work => (
            <Col lg={3} md={6} sm={4} xs={8} key={work.id}>
              <Card>
                <Icon type={`hwork.${work.image}`} width="64px" />
                <h2 className="title">{work.title}</h2>
                <p className="description">{work.description}</p>
                <Hidden xs>
                  {work.id < 4 && (
                    <Card.Arrow>
                      <Icon type="chevron.small.right" />
                    </Card.Arrow>
                  )}
                </Hidden>
                <Visible xs>
                  {work.id < 4 && (
                    <Card.Arrow className="bottom">
                      <Icon type="chevron.small.right" />
                    </Card.Arrow>
                  )}
                </Visible>
              </Card>
            </Col>
          ))}
        </Row>
      </Hidden>
      <Visible md sm>
        <Row>
          {jsonWorks.slice(0, 2).map(work => (
            <Col md={6} sm={4} key={work.id} justify="center" align="center">
              <Card>
                <Icon type={`hwork.${work.image}`} width="56px" />
                <h2 className="title">{work.title}</h2>
                <p className="description">{work.description}</p>
                <Card.Arrow className={classNames({ bottom: work.id === 2 })}>
                  <Icon type="chevron.small.right" />
                </Card.Arrow>
              </Card>
            </Col>
          ))}
        </Row>
        <Row reverse>
          {jsonWorks.slice(2).map(work => (
            <Col md={6} sm={4} key={work.id}>
              <Card>
                <Icon type={`hwork.${work.image}`} width="56px" />
                <h2 className="title">{work.title}</h2>
                <p className="description">{work.description}</p>
                {work.id === 4 && (
                  <Card.Arrow>
                    <Icon type="chevron.small.left" />
                  </Card.Arrow>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Visible>
    </Space>
    <Row justify="center">
      <Col xl={7} lg={7} md={7}>
        <Title as="h1" type="bold">{homePage.monitorTheImpact.title}</Title>
        <Space y={{ lg: '16px', md: '16px', sm: '16px' }}>
          <Paragraph>{homePage.monitorTheImpact.description}</Paragraph>
        </Space>
        <Row>
          <Col xl={4} lg={4} md={6} sm={4} xs={3}>
            <Button type="button" href={scheduleDemoUrl} block>
              {homePage.scheduleDemo}
            </Button>
          </Col>
        </Row>
      </Col>
      <Col xl={4} lg={4} md={5} align="flex-start">
        <Hidden sm xs>
          <Icon type="home.rsr" width="295px" height="342px" />
        </Hidden>
      </Col>
    </Row>
    <Row justify="space-around">
      <Col xl={5} lg={5} md={6}>
        <Space y={{ lg: '0', sm: '64px', xs: '64px' }}>
          <Title as="h1" type="bold" className="features">{homePage.features}</Title>
          <ul className="disc">
            {homePage.featureItems.map((feature, vx) => (
              <li key={vx}>{feature}</li>
            ))}
          </ul>
        </Space>
      </Col>
      <Col xl={5} lg={5} md={6} align="flex-start">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => isActive ? <MinusOutlined /> : <PlusOutlined />}
          className="feature-collapsible"
          expandIconPosition="right"
        >
          {jsonFeatures.map((item) => (
            <Collapse.Panel header={item.title} key={item.id}>
              {item.description}
            </Collapse.Panel>
          ))}
        </Collapse>
      </Col>
    </Row>
  </Container>
)

export default WorksSection
