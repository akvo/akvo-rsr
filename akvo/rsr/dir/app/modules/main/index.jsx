import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Row,
  Col,
  Divider,
  Typography
} from 'antd'
import humps from 'humps'
import chunk from 'lodash/chunk'
import orderBy from 'lodash/orderBy'

import '../../styles/home-page.scss'
import jsonWorks from '../../json/how-it-works.json'
import jsonFeatures from '../../json/features.json'
import jsonPartners from '../../json/partners.json'
import api from '../../utils/api'

import { queryAllOrganisations, queryAllSectors, queryGeoJson } from './queries'
import { footerUrl, images } from '../../utils/config'
import { RsrLayout } from '../components/layout'
import { queryUser } from '../project-page/queries'
import { Sections } from './sections'
import RsrButton from '../components/RsrButton'
import Section from '../components/Section'
import ProjectFilter from './components/ProjectFilter'

const { Title } = Typography

const Main = () => {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    visible: false,
    apply: false
  })
  const [search, setSearch] = useState({
    organisation: [],
    sector: [],
    query: null,
    results: null
  })
  const [projects, setProjects] = useState(null)
  const [directories, setDirectories] = useState([])
  const [processing, setProcessing] = useState(true)

  const { data: dataOrganisation } = queryAllOrganisations()
  const { data: sectors } = queryAllSectors()
  const { data: user } = queryUser()
  const { results: organisations } = dataOrganisation || {}
  const { data: featureData, error: apiError } = queryGeoJson()

  const slider = useRef()

  const handleOnFetchProjects = (ids = [], isReplaced = false, fields = ['title', 'image', 'countries']) => {
    api
      .get(`/projects_by_id?ids=${ids.join(',')}&fields=${fields.join(',')}&format=json`)
      .then((res) => {
        const data = humps.camelizeKeys(res.data)
        const existing = projects || []
        if (isReplaced) {
          setProjects(data)
        } else {
          setProjects([
            ...existing,
            ...data
          ])
        }
        setProcessing(false)
        setLoading(false)
      })
      .catch(() => {
        setProjects([])
        setProcessing(false)
        setLoading(false)
      })
  }

  const handleOnResetProjects = () => {
    if (filter.apply) {
      setFilter({ apply: false, visible: false })
    }
    if (directories.length) {
      setProcessing(true)
      const chunking = chunk(directories, 10)
      const ids = chunking[0] ? chunking[0].map((ap) => ap.properties.id) : []
      handleOnFetchProjects(ids, true)
    }
  }

  const handleOnSearch = (value) => {
    setSearch({ ...search, query: value, results: null })
    if (!value && filter.apply) {
      handleOnResetProjects()
    }
  }

  const handleOnClearFilter = () => {
    setSearch({
      sector: [],
      organisation: [],
      query: null,
      results: null
    })
    handleOnResetProjects()
  }

  const handleOnApplyFilter = () => {
    setLoading(true)
    setFilter({ apply: true, visible: false })
    setProcessing(true)
    const orgs = search.organisation.map((o) => o.key).join(',')
    api
      .get(`/project_published_search?query=${search.query || ''}&sectors=${search.sector.join(',')}&orgs=${orgs}&format=json`)
      .then((res) => {
        const { results } = res.data
        setSearch({ ...search, results })
        if (results.length) {
          handleOnFetchProjects(results, true)
        } else {
          setProjects([])
          setProcessing(false)
          setLoading(false)
        }
      })
      .catch(() => {
        setProcessing(false)
        setLoading(false)
      })
  }

  const prevPartner = () => {
    slider.current.prev()
  }

  const nextPartner = () => {
    slider.current.next()
  }

  useEffect(() => {
    if ((loading && dataOrganisation) && !filter.apply) {
      setLoading(false)
    }
    if (processing && !projects && featureData) {
      const { features } = featureData
      const sorting = orderBy(features, [(item) => item.properties.activeness], ['desc'])
      setDirectories(sorting)
      const chunking = chunk(sorting, 10)
      const ids = chunking[0] ? chunking[0].map((ap) => ap.properties.id) : []
      handleOnFetchProjects(ids)
    }
    if (apiError && processing) {
      setProcessing(false)
    }
  }, [loading, dataOrganisation, filter, processing, featureData, projects, apiError])
  return (
    <RsrLayout.Main id="rsr-home-page">
      <RsrLayout.Header.WithLogo style={{ height: 'auto' }} left={[4, 4, 4, 8, 8]} right={[20, 20, 16, 12, 12]}>
        <Row type="flex" align="middle" justify="end">
          {user && <Col span={6}><Button type="link" href="/my-rsr">My Projects</Button></Col>}
          {!(user) && (
            <>
              <Col lg={2} md={4} xs={4}>
                <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">
                  <b>Sign in</b>
                </Button>
              </Col>
              <Col lg={4} md={10} xs={12}>
                <RsrButton.External block>
                  <b>Schedule Demo</b>
                </RsrButton.External>
              </Col>
            </>
          )}
        </Row>
      </RsrLayout.Header.WithLogo>
      <Section className="rsr-hero">
        <Sections.JumboTron images={images} />
      </Section>
      <Section>
        <Sections.Works
          works={jsonWorks}
          features={jsonFeatures}
          images={images}
        />
      </Section>
      <Row className="rsr-row" id="rsr-active-projects">
        <Col className="active-projects-header">
          <ProjectFilter
            sectors={sectors}
            amount={projects ? projects.length : 0}
            onClear={handleOnClearFilter}
            onSearch={handleOnSearch}
            onApply={handleOnApplyFilter}
            {...{
              search,
              filter,
              organisations,
              loading,
              setSearch,
              setFilter
            }}
          />
        </Col>
        <Col>
          <Divider />
          <Sections.Project
            {...{
              filter,
              search,
              processing,
              projects,
              featureData,
              directories,
              setProjects,
              setProcessing,
              setDirectories,
              handleOnFetchProjects
            }}
          />
          <Sections.ContactForm />
        </Col>
      </Row>
      <Section id="rsr-case-studies">
        <Sections.Blog />
      </Section>
      <Section id="rsr-partners">
        <Row
          type="flex"
          justify="center"
          style={{
            marginTop: '-110px',
            marginBottom: '2em'
          }}
        >
          <Col lg={8} md={11} sm={22}>
            <Title level={2}>Trusted Partners</Title>
          </Col>
          <Col lg={14} md={13} sm={2} />
        </Row>
        <Sections.Partner
          slider={slider}
          partners={jsonPartners}
          onPrev={prevPartner}
          onNext={nextPartner}
        />
      </Section>
      <Section id="rsr-footer-home">
        <Sections.Footer {...{ images, footerUrl }} />
      </Section>
    </RsrLayout.Main>
  )
}

export default Main
