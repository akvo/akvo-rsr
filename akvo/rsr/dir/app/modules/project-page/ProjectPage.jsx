/* global document */
import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Layout,
  Button,
  Typography,
  Menu,
  Spin,
  Icon
} from 'antd'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import '../../styles/project-page.scss'
import { RsrLayout } from '../components/layout'
import { queryIndicatorPeriod, queryProject, queryUser } from './queries'
import { appendPeriods } from '../../features/periods/periodSlice'

import akvoLogo from '../../images/akvo.png'
import Home from './views/Home'
import ResultOverview from './views/ResultOverview'
import Updates from './views/Updates'
import FooterLink from './components/FooterLink'
import UpdatePage from './views/UpdatePage'
import RsrButton from '../components/RsrButton'

const { Footer } = Layout
const { Text } = Typography

const ProjectPage = ({ match: { params }, location }) => {
  let initMenu = 'home'
  if (location && params) {
    initMenu = location.pathname.includes('update') ? 'updates' : 'home'
    initMenu = location.pathname.includes('results') ? 'results-overview' : initMenu
  }
  const [menu, setMenu] = useState(initMenu)
  const [allStories, setAllstories] = useState([])
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState({
    project: true,
    periods: true,
    indicators: true,
    updates: true
  })

  const history = useHistory()
  const dispatch = useDispatch()

  const { data: dataPeriods, size: sizePds, setSize: setSizePds } = queryIndicatorPeriod(params.projectId)
  const { data: project } = queryProject(params.projectId)
  const { data: user, error: apiError } = queryUser()

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
        dispatch(appendPeriods(opds))
        setPreload({
          ...preload,
          periods: false
        })
      }
    }
    if ((loading && apiError) || (loading && user && !apiError)) {
      setLoading(false)
    }
  }, [preload, project, loading, dataPeriods, user, apiError])
  return (
    <RsrLayout.Main id="rsr-project-page">
      <RsrLayout.Header.WithLogo style={{ height: 'auto' }} left={[3, 3, 6, 8, 8]} right={[21, 21, 18, 16, 16]}>
        <Row type="flex" align="middle" justify="end">
          {(user && !loading && !apiError) && <Col lg={4} md={6} sm={18} xs={18} className="text-right"><RsrButton.External href="/my-rsr" style={{ lineHeight: '40px' }} blank block>My Projects</RsrButton.External></Col>}
          {(!loading && apiError) && (
            <Col lg={12} md={12} sm={24} xs={24} className="text-right">
              <Button type="link" href="/en/register/" target="_blank" rel="noopener noreferrer">Register</Button>
              <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">Sign in</Button>
            </Col>
          )}
          {loading && <Col lg={2} md={4} sm={8} xs={8}><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning /></Col>}
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
        <div className="footer-credits">
          <Text className="text-dark" strong>Powered by</Text>
          <span><a href="//akvo.org" target="_blank" rel="noopener noreferrer"><img alt="Akvo Logo" src={akvoLogo} className="w-full" /></a></span>
        </div>
      </Footer>
    </RsrLayout.Main>
  )
}

export default ProjectPage
