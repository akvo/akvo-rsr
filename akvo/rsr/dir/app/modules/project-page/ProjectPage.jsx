/* global document */
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container } from 'react-awesome-styled-grid'

import '../../styles/project-page.scss'
import { queryIndicatorPeriod, queryProject, queryUser } from './queries'
import { appendPeriods } from '../../features/periods/periodSlice'

import Home from './views/Home'
import ResultOverview from './views/ResultOverview'
import Updates from './views/Updates'
import FooterLink from './components/FooterLink'
import UpdatePage from './views/UpdatePage'
import {
  MobileDrawer,
  Header,
  Section,
  Space,
} from '../components'
import { FooterSection } from '../main/sections'
import FooterAkvo from './components/FooterAkvo'
import {
  HOME_KEY,
  RESULTS_KEY,
  UPDATES_KEY,
  projectPath,
} from '../../utils/config'


const ProjectPage = ({ match: { params }, location }) => {
  const [menu, setMenu] = useState('home')
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState({
    project: true,
    periods: true,
    indicators: true,
    updates: true
  })
  const [drawer, setDrawer] = useState(false)

  const history = useHistory()
  const dispatch = useDispatch()

  const { data: dataPeriods, size: sizePds, setSize: setSizePds } = queryIndicatorPeriod(params.projectId)
  const { data: project, error: projectError } = queryProject(params.projectId)
  const { data: user, error: apiError } = queryUser()
  const currentPath = location.pathname.split('/').pop()

  const toggleDrawer = () => setDrawer(!drawer)
  const handleOnMenu = (key) => {
    setMenu(key)
    switch (key) {
      case RESULTS_KEY:
        history.push(`/dir/project/${params.projectId}/results`)
        break
      case UPDATES_KEY:
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
    if ((loading && (apiError || projectError)) || (loading && user && !apiError)) {
      setLoading(false)
    }
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(currentPath) && menu !== HOME_KEY) {
      setMenu(HOME_KEY)
    }
    if (projectPath[RESULTS_KEY].includes(currentPath) && menu !== RESULTS_KEY) {
      setMenu(RESULTS_KEY)
    }
    if (projectPath[UPDATES_KEY].includes(currentPath) && menu !== UPDATES_KEY) {
      setMenu(UPDATES_KEY)
    }
  }, [preload, project, loading, dataPeriods, user, apiError, projectError, menu, currentPath])
  return (
    <div id="rsr-project-page">
      <Section>
        <Container>
          <Space y={{ lg: '24px', md: '16px', sm: '8px' }}>
            <Header
              {...{
                user,
                loading,
                apiError,
                toggleDrawer,
              }}
            />
          </Space>
        </Container>
      </Section>
      <Container>
        <Menu mode="horizontal" selectedKeys={menu} onClick={(e) => handleOnMenu(e.key)}>
          <Menu.Item key={HOME_KEY}>
            Project Overview
          </Menu.Item>
          <Menu.Item key={RESULTS_KEY}>
            Results Overview
          </Menu.Item>
          <Menu.Item key={UPDATES_KEY}>
            Updates
          </Menu.Item>
        </Menu>
      </Container>
      <Switch>
        <Route exact path="/dir/project/:projectId">
          <Home
            {...{
              project,
              user,
              projectError,
              projectId: params.projectId,
            }}
          />
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
              project,
            }}
          />
        </Route>
        <Route exact path="/dir/project/:projectId/update">
          <UpdatePage {...params} />
        </Route>
      </Switch>
      <FooterLink projectId={params.projectId} />
      <Section gray id="rsr-footer-home">
        <Container>
          <FooterSection />
        </Container>
      </Section>
      <Container>
        <FooterAkvo />
      </Container>
      <MobileDrawer
        {...{
          apiError,
          loading,
          user
        }}
        visible={drawer}
        onClose={toggleDrawer}
      />
    </div>
  )
}

export default ProjectPage
