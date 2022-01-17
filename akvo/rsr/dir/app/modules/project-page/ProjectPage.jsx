import React, { useState } from 'react'
import {
  Row,
  Col,
  Layout,
  Typography,
  Button,
  Menu,
} from 'antd'
import { Switch, Route, useHistory } from 'react-router-dom'
import SVGInline from 'react-svg-inline'

import './ProjectPage.scss'
import rsrLogo from '../../images/rsrLogo.svg'
import akvoLogo from '../../images/akvo.png'
import { queryProject, queryUser } from './queries'
import Home from './views/Home'
import ResultOverview from './views/ResultOverview'
import Updates from './views/Updates'
import FooterLink from './components/FooterLink'

const { Header, Footer } = Layout
const { Text } = Typography

const ProjectPage = ({ match: { params }, location }) => {
  let initMenu = 'home'
  if (location && params) {
    initMenu = location.pathname === `/dir/project/${params.projectId}/updates`
      ? 'updates'
      : location.pathname === `/dir/project/${params.projectId}/results` ? 'results-overview' : 'home'
  }
  const [menu, setMenu] = useState(initMenu)

  const history = useHistory()
  const { data: project } = queryProject(params.projectId)
  const { data: user } = queryUser()
  const handleOnMenu = (key) => {
    setMenu(key)
    switch (key) {
      case 'results-overview':
        history.push(`/dir/project/${params.projectId}/results`)
        break
      case 'updates':
        history.push(`/dir/project/${params.projectId}/updates`)
        break
      default:
        history.push(`/dir/project/${params.projectId}`)
        break
    }
  }
  return (
    <Layout className="project-layout">
      <Header>
        <Row type="flex" justify="space-between">
          <Col span={4}>
            <Button type="link" href="/">
              <SVGInline svg={rsrLogo} />
            </Button>
          </Col>
          <Col span={4} className="text-right">
            {
              user
                ? <Button type="link" href="/my-rsr">My Projects</Button>
                : (
                  <>
                    <Button type="link" href="/en/register/" target="_blank" rel="noopener noreferrer">Register</Button>
                    <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">Sign in</Button>
                  </>
                )
            }
          </Col>
        </Row>
      </Header>
      <Header style={{ height: 48 }}>
        <Row>
          <Col>
            <Menu mode="horizontal" selectedKeys={menu} onClick={(e) => handleOnMenu(e.key)}>
              <Menu.Item key="home">
                Project Overview
              </Menu.Item>
              <Menu.Item key="results-overview">
                Results Overview
              </Menu.Item>
              <Menu.Item key="updates">
                Updates
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Switch>
        <Route exact path="/dir/project/:projectId">
          <Home {...{ project, user, projectId: params.projectId }} />
        </Route>
        <Route path="/dir/project/:projectId/results">
          <ResultOverview {...{ project, user, projectId: params.projectId }} />
        </Route>
        <Route path="/dir/project/:projectId/updates">
          <Updates {...{ project, user, projectId: params.projectId }} />
        </Route>
      </Switch>
      <FooterLink />
      <Footer>
        <Row type="flex" justify="start">
          <Col lg={2} sm={4}>
            <Text className="text-dark font-futura">Powered by</Text>
          </Col>
          <Col lg={1} sm={2}>
            <a href="//akvo.org"><img src={akvoLogo} className="w-full ml-min-50" alt="Akvo Logo" /></a>
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default ProjectPage
