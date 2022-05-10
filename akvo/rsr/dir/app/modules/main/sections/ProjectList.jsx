import React, { useState } from 'react'
import lookup from 'country-code-lookup'
import {
  Row,
  Col,
  List,
  Typography,
  Skeleton,
  Spin
} from 'antd'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroller'
import humps from 'humps'
import chunk from 'lodash/chunk'

import projectJson from '../../../json/dummy-projects.json'
import { prefixUrl } from '../../../utils/config'
import api from '../../../utils/api'

const { Title, Text } = Typography

const ProjectList = ({
  filter,
  projects,
  processing,
  directories,
  setProjects
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const pages = chunk(directories, 10)
  const totalPages = pages.length
  const handleInfiniteOnLoad = () => {
    setLoading(true)
    if (page > totalPages || filter.apply) {
      setHasMore(false)
      setLoading(false)
    } else {
      setPage(page + 1)
      const ids = pages[page] ? pages[page].map((d) => d.properties.id) : pages[0]
      if (ids.length) {
        api
          .get(`/projects_by_id?ids=${ids.join(',')}&fields=title,image,countries&format=json`)
          .then((res) => {
            const data = humps.camelizeKeys(res.data)
            const existing = projects || []
            setProjects([
              ...existing,
              ...data
            ])
            setLoading(false)
          })
          .catch(() => {
            setProjects([])
            setLoading(false)
          })
      }
    }
  }

  return (
    <Row type="flex" justify="end" align="top">
      <Col span={21} className="project-list-items">
        <InfiniteScroll
          initialLoad={false}
          pageStart={1}
          loadMore={handleInfiniteOnLoad}
          hasMore={(!loading && hasMore)}
          useWindow={false}
        >
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
          >
            {(loading && hasMore) && (
              <div>
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </Col>
    </Row>
  )
}

export default ProjectList
