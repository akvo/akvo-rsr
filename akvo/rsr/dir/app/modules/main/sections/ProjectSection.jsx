import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  Spin,
  Icon,
  List,
  Skeleton,
  Button
} from 'antd'
import classNames from 'classnames'
import humps from 'humps'
import uniq from 'lodash/uniq'
import lookup from 'country-code-lookup'
import { useTranslation } from 'react-i18next'
import { Row, Col, Hidden } from 'react-awesome-styled-grid'
import styled from 'styled-components'

import api from '../../../utils/api'
import ProjectFilter from '../components/ProjectFilter'
import projectJson from '../../../json/dummy-projects.json'
import { prefixUrl, images } from '../../../utils/config'
import { MapView } from '../components/MapView'
import { queryAllOrganisations, queryAllSectors, queryGeoJson } from '../queries'
import { getMultiItems } from '../../../utils/misc'
import { VStack } from '../../components/rsr'

const Wrapper = styled.div`
  position: relative;
  min-height: 125px;
  overflow-y: auto;
  & > h4 {
    font-weight: ${props => props.theme.font.weight.bold};
    font-size: ${props => props.theme.font.size.lg};
    color: ${props => props.theme.color.primary['700']};
    line-height: 24px;
    margin-bottom: 32px;
  }

  & > .locations {
    color: ${props => props.theme.color.primary['900']};
    position: absolute;
    bottom: 0;
    &.overload {
      position: relative;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    & > h4 {
      font-size: ${props => props.theme.font.size.sm};
    }
  }
`

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
    <Fragment>
      <Row>
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
      </Row>
      <Row justify="center" align="start" className="active-projects-content">
        <Col lg={showProjects ? 4 : 1} md={showProjects ? 4 : 1} sm={8} className={classNames('projects', { on: showProjects })}>
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
                  <VStack align="flex-start" style={{ width: '100%' }}>
                    <VStack.Col width={40}>
                      <a href={`/dir/project/${project.id}/`} target="_blank" rel="noopener noreferrer">
                        <img src={project.image ? `${prefixUrl}${project.image}` : images.default} alt={project.title} style={{ width: '100%' }} />
                      </a>
                    </VStack.Col>
                    <VStack.Col width={60}>
                      <a href={`/dir/project/${project.id}/`} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Wrapper>
                          <h4>{project.title}</h4>
                          <div className={classNames('locations', { overload: project.countries.length > 2 })}>
                            {
                              project.countries
                                ? project.countries.map(it => {
                                  const found = lookup.byIso(it)
                                  if (found) return t(found.country)
                                  return it
                                }).join(', ')
                                : ''
                            }
                          </div>
                        </Wrapper>
                      </a>
                    </VStack.Col>
                  </VStack>
                </List.Item>
              </Skeleton>
            )}
          />
        </Col>
        <Col lg={showProjects ? 8 : 11} md={showProjects ? 8 : 11} sm={8} id="map-view">
          <Hidden xs>
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
          </Hidden>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ProjectSection
