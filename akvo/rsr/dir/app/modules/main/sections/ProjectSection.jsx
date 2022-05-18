import React, { useEffect, useRef, useState } from 'react'
import {
  Row,
  Col,
  Spin,
  Icon,
  List,
  Skeleton,
  Divider,
  Typography
} from 'antd'
import classNames from 'classnames'
import humps from 'humps'
import orderBy from 'lodash/orderBy'
import lookup from 'country-code-lookup'
import { useTranslation } from 'react-i18next'

import api from '../../../utils/api'
import ProjectFilter from '../components/ProjectFilter'
import projectJson from '../../../json/dummy-projects.json'
import { prefixUrl } from '../../../utils/config'
import { MapView } from '../components/MapView'
import { queryAllOrganisations, queryAllSectors, queryGeoJson } from '../queries'
import { getMultiItems } from '../../../utils/misc'

const { Title, Text } = Typography

const ProjectSection = () => {
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
  const [showProjects, setShowProjects] = useState(true)

  const { data: dataOrganisation } = queryAllOrganisations()
  const { data: sectors } = queryAllSectors()
  const { results: organisations } = dataOrganisation || {}
  const { data: featureData, error: apiError } = queryGeoJson()
  const { t } = useTranslation()
  let tmid
  let tmc = 0
  const tmi = 20
  const mapRef = useRef(null)

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
      const ids = getMultiItems(directories)
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
    const scs = search.sector.map((s) => s.key).join(',')
    api
      .get(`/project_published_search?query=${search.query || ''}&sectors=${scs}&orgs=${orgs}&format=json`)
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
  const handleOnShowProjects = (to) => {
    setShowProjects(to)
    if (mapRef.current) {
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if (tmc > 700) clearInterval(tmid) }, tmi)
    }
  }

  useEffect(() => {
    if ((loading && dataOrganisation) && !filter.apply) {
      setLoading(false)
    }
    if (processing && !projects && featureData) {
      const { features } = featureData
      const sorting = orderBy(features, [(item) => item.properties.activeness], ['desc'])
      setDirectories(sorting)
      const ids = getMultiItems(sorting)
      handleOnFetchProjects(ids)
    }
    if (apiError && processing) {
      setProcessing(false)
    }
    if (apiError && loading) {
      setLoading(false)
    }
  }, [loading, dataOrganisation, filter, processing, featureData, projects, apiError])
  return (
    <>
      <Col className="active-projects-header">
        <ProjectFilter
          sectors={sectors}
          amount={search.results ? search.results.length : 0}
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
        <Row>
          <Col lg={showProjects ? 8 : 1} className={classNames('projects', { on: showProjects })}>
            <Row type="flex" justify="end" align="top">
              <Col lg={20} sm={{ span: 22, offset: 2 }} className="project-list-items w-full">
                <List
                  itemLayout="horizontal"
                  dataSource={projects || projectJson}
                  renderItem={project => (
                    <Skeleton avatar={{ size: 'large', shape: 'square' }} paragraph={{ rows: 2 }} loading={processing} active>
                      <List.Item>
                        <a href={`/dir/project/${project.id}/`} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Row gutter={[{ sm: 32, lg: 16 }, 8]} className="w-full">
                            <Col span={10}>
                              <img src={`${prefixUrl}${project.image}`} alt={project.title} className="item-image" />
                            </Col>
                            <Col span={14} className="item-info">
                              <Title level={4}>{project.title}</Title>
                              <Text className="locations">
                                {
                                  project.countries
                                    ? project.countries.map(it => {
                                      const found = lookup.byIso(it)
                                      if (found) return t(found.country)
                                      return it
                                    }).join(', ')
                                    : ''
                                }
                              </Text>
                            </Col>
                          </Row>
                        </a>
                      </List.Item>
                    </Skeleton>
                  )}
                />
              </Col>
            </Row>
          </Col>
          <Col lg={showProjects ? 16 : 24} id="map-view">
            <div className={classNames('expander', { on: showProjects })} role="button" tabIndex={-1} onClick={() => handleOnShowProjects(!showProjects)}>
              <Icon type="caret-right" />
            </div>
            <Spin spinning={processing || !organisations}>
              <MapView
                style={{ width: '100%', height: 600 }}
                {...{
                  mapRef,
                  filter,
                  search,
                  featureData,
                  directories,
                  organisations,
                  processing,
                  setProcessing,
                  setDirectories,
                  handleOnFetchProjects
                }}
              />
            </Spin>
          </Col>
        </Row>
      </Col>
    </>
  )
}

export default ProjectSection
