import React, { useEffect, useRef, useState } from 'react'
import {
  Row,
  Col,
  Spin,
  Icon,
  List,
  Skeleton,
  Typography,
  Button
} from 'antd'
import classNames from 'classnames'
import humps from 'humps'
import uniq from 'lodash/uniq'
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
    query: null
  })
  const [projects, setProjects] = useState(null)
  const [directories, setDirectories] = useState([])
  const [processing, setProcessing] = useState(true)
  const [showProjects, setShowProjects] = useState(true)
  const [preload, setPreload] = useState(true)
  const [searchResult, setSearchResult] = useState(null)
  const [showItems, setShowItems] = useState(4)

  const { data: dataOrganisation } = queryAllOrganisations()
  const { data: sectors } = queryAllSectors()
  const { results: organisations } = dataOrganisation || {}
  const { data: featureData, error: apiError } = queryGeoJson('activeness')
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
        const sorting = ids.map((d) => data.find((it) => it.id === d)).filter((d) => (d))
        const existing = projects || []
        if (isReplaced) {
          setProjects(sorting)
        } else {
          setProjects([
            ...existing,
            ...sorting
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
    setSearch({ ...search, query: value })
    setSearchResult(null)
    if (!value && filter.apply) {
      handleOnResetProjects()
    }
  }
  const handleOnClearFilter = () => {
    setShowItems(4)
    setSearch({
      sector: [],
      organisation: [],
      query: null
    })
    setSearchResult(null)
    handleOnResetProjects()
  }
  const handleOnApplyFilter = (modified = {}) => {
    setShowItems(4)
    setLoading(true)
    setFilter({ apply: true, visible: false })
    setProcessing(true)
    const modifiedSearch = { ...search, ...modified }
    setSearch(modifiedSearch)
    const { organisation, sector } = modifiedSearch
    const orgs = organisation.map((o) => o.key).join(',')
    const scs = sector.map((s) => s.key).join(',')
    api
      .get(`/project_published_search?query=${search.query || ''}&sectors=${scs}&orgs=${orgs}&format=json`)
      .then((res) => {
        const { results } = res.data
        if (results.length) {
          const ids = uniq(results).sort((a, b) => b - a)
          setSearchResult(ids)
          handleOnFetchProjects(ids, true)
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
    if (preload && processing && !projects && featureData) {
      setPreload(false)
      const { features } = featureData
      setDirectories(features)
      const ids = getMultiItems(features)
      handleOnFetchProjects(ids)
    }
    if (apiError && processing) {
      setProcessing(false)
    }
    if (apiError && loading) {
      setLoading(false)
    }
  }, [loading, dataOrganisation, filter, processing, featureData, projects, apiError, preload])
  return (
    <>
      <Col className="active-projects-header mb-1">
        <ProjectFilter
          sectors={sectors}
          amount={searchResult ? searchResult.length : 0}
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
      <Col className="active-projects-content">
        <Row type="flex" justify="center" align="top">
          <Col lg={showProjects ? 7 : 1} md={showProjects ? 10 : 1} sm={24} xs={24} className={classNames('projects', { on: showProjects })}>
            <List
              className="project-list-items"
              itemLayout="horizontal"
              footer={(
                <>
                  {((!searchResult && showItems <= 63) || (searchResult && showItems <= searchResult.length - 1)) && (
                    <Button
                      type="ghost"
                      icon="arrow-down"
                      className="btn-load-more"
                      onClick={() => setShowItems(showItems + 4)}
                      block
                    >
                      Load more
                    </Button>
                  )}
                </>
              )}
              dataSource={projects || projectJson}
              renderItem={(project, px) => (
                <Skeleton avatar={{ size: 'large', shape: 'square' }} paragraph={{ rows: 2 }} loading={processing} active>
                  <List.Item className={classNames({ 'd-none': (px >= showItems) })}>
                    <a href={`/dir/project/${project.id}/`} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Row gutter={[16, 8]} className="w-full">
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
          <Col lg={showProjects ? 15 : 24} md={showProjects ? 14 : 24} sm={24} xs={24} id="map-view">
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
                  searchResult,
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
