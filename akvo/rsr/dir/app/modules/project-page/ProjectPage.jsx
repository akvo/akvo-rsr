/* global document */
import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Layout,
  Button,
  Typography,
  Menu,
} from 'antd'
import { Switch, Route, useHistory } from 'react-router-dom'
import uniq from 'lodash/uniq'
import moment from 'moment'

import '../../styles/project-page.scss'
import { RsrLayout } from '../components/layout'
import { queryIndicatorPeriod, queryProject, queryUser } from './queries'

import akvoLogo from '../../images/akvo.png'
import Home from './views/Home'
import ResultOverview from './views/ResultOverview'
import Updates from './views/Updates'
import FooterLink from './components/FooterLink'
import UpdatePage from './views/UpdatePage'

const { Footer } = Layout
const { Text } = Typography

const ProjectPage = ({ match: { params }, location }) => {
  let initMenu = 'home'
  if (location && params) {
    initMenu = location.pathname.includes('update') ? 'updates' : 'home'
    initMenu = location.pathname.includes('results') ? 'results-overview' : initMenu
  }
  const [menu, setMenu] = useState(initMenu)
  const [results, setResults] = useState(null)
  const [allStories, setAllstories] = useState([])
  const [preload, setPreload] = useState({ project: true, periods: true })
  const [periods, setPeriods] = useState([])
  const [optionPeriods, setOptionPeriods] = useState([])

  const history = useHistory()

  const { data: dataPeriods, size: sizePds, setSize: setSizePds } = queryIndicatorPeriod(params.projectId)
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
  useEffect(() => {
    if (preload.project && project) {
      setPreload({ ...preload, project: false })
      document.title = `${project.title} | Akvo RSR`
    }
    if (dataPeriods && preload.periods) {
      const lastPeriod = dataPeriods.slice(-1)[0]
      const { next } = lastPeriod || {}
      setSizePds(sizePds + 1)
      if (!next) {
        const opds = dataPeriods.flatMap((dp) => dp.results)
        const op = opds.map((o) => {
          const periodStart = moment(o.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')
          const periodEnd = moment(o.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')
          return `${periodStart} - ${periodEnd}`
        })
        setOptionPeriods(uniq(op))
        setPeriods(opds)
        setPreload({
          ...preload,
          periods: false
        })
      }
    }
  }, [preload, project, dataPeriods])
  return (
    <RsrLayout.Main id="rsr-project-page">
      <RsrLayout.Header.WithLogo style={{ height: 'auto' }} left={[3, 4, 4, 8, 8]} right={[21, 20, 16, 16, 16]}>
        <Row type="flex" align="middle" justify="end">
          {user && <Col span={12} className="text-right"><Button type="link" href="/my-rsr">My Projects</Button></Col>}
          {!(user) && (
            <Col lg={12} md={12} sm={24} xs={24} className="text-right">
              <Button type="link" href="/en/register/" target="_blank" rel="noopener noreferrer">Register</Button>
              <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">Sign in</Button>
            </Col>
          )}
        </Row>
      </RsrLayout.Header.WithLogo>
      <RsrLayout.Header auto>
        <RsrLayout.Header.Col>
          <Menu mode="horizontal" selectedKeys={menu} onClick={(e) => handleOnMenu(e.key)}>
            <Menu.Item key="home">
              <span className="lg">Project Overview</span>
              <span className="sm">Project</span>
            </Menu.Item>
            <Menu.Item key="results-overview">
              <span className="lg">Results Overview</span>
              <span className="sm">Results</span>
            </Menu.Item>
            <Menu.Item key="updates">
              Updates
            </Menu.Item>
          </Menu>
        </RsrLayout.Header.Col>
      </RsrLayout.Header>
      <Switch>
        <Route exact path="/dir/project/:projectId">
          <Home {...{ project, user, projectId: params.projectId, handleOnMenu }} />
        </Route>
        <Route path="/dir/project/:projectId/results">
          <ResultOverview
            {...{
              projectId: params.projectId,
              items: results,
              setItems: setResults,
              optionPeriods,
              periods,
              project,
              user
            }}
          />
        </Route>
        <Route path="/dir/project/:projectId/updates">
          <Updates
            {...{
              projectId: params.projectId,
              setAllstories,
              allStories,
              project,
              user,
            }}
          />
        </Route>
        <Route exact path="/dir/project/:projectId/update">
          <UpdatePage {...params} />
        </Route>
      </Switch>
      <FooterLink projectId={params.projectId} />
      <Footer>
        <Row type="flex" justify="start" align="middle">
          <Col lg={2} md={4} sm={6} xs={8}>
            <Text className="text-dark" style={{ fontFamily: 'Futura' }}>Powered by</Text>
          </Col>
          <Col lg={1} md={4} sm={4} xs={6}>
            <a href="//akvo.org" target="_blank" rel="noopener noreferrer"><img alt="Akvo Logo" src={akvoLogo} className="w-full" /></a>
          </Col>
        </Row>
      </Footer>
    </RsrLayout.Main>
  )
}

export default ProjectPage
