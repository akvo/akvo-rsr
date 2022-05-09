import React, { useState, useEffect } from 'react'
import {
  Typography,
  Row,
  Col
} from 'antd'
import uniqBy from 'lodash/uniqBy'
import orderBy from 'lodash/orderBy'
import chunk from 'lodash/chunk'

import UpdateItem from './UpdateItem'
import UpdateFeatured from './UpdateFeatured'
import UpdatePages from './UpdatePages'
import PopFilter from '../components/PopFilter'
import { queryAllUpdates } from '../queries'
import Section from '../../components/Section'
import Filter from '../../components/Filter'

const { Title, Paragraph, Text } = Typography

const Updates = ({ projectId, project }) => {
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(null)
  const [writers, setWriters] = useState([])
  const [allUpdates, setAllUpdates] = useState([])
  const [featured, setFeatured] = useState([])
  const [authors, setAuthors] = useState([])
  const [filter, setFilter] = useState({
    visible: false,
    apply: false
  })

  const { data, size, setSize } = queryAllUpdates(projectId, 1, 100)
  let items = allUpdates.length > 15 ? allUpdates.filter((u) => !(featured.includes(u.id))) : allUpdates
  items = items.filter((u) => {
    if (search) {
      return (
        u.title.toLowerCase().includes(search.toLowerCase()) ||
        u.text.toLowerCase().includes(search.toLowerCase())
      )
    }
    return u
  })
    .filter((u) => {
      if (authors.length && filter.apply) {
        return authors.map((a) => a.id).includes(u.userDetails.id)
      }
      return u
    })
  const chunks = chunk(items, 9)
  const results = items.length >= 9 ? chunks[page] || [] : items
  const total = items.length

  const handleOnClose = (author) => {
    const filtered = authors.filter((a) => a.id !== author.id)
    setAuthors(filtered)
  }

  useEffect(() => {
    if (loading && data) {
      const lastData = data.slice(-1)[0]
      const { next } = lastData || {}
      setSize(size + 1)
      if (!next) {
        const updates = data.flatMap((d) => d.results)
        setAllUpdates(updates)
        let users = uniqBy(updates.map((r) => r.userDetails), 'id').map((u) => ({
          ...u,
          firstLetter: u.firstName[0]
        }))
        users = orderBy(users, ['firstLetter'], ['asc'])
        setWriters(users)
        setLoading(false)
      }
    }
  }, [data, loading])
  return (
    <>
      <Section>
        <Title className="text-dark bold">Project Updates</Title>
        <Paragraph className="hero">
          {project ? `Stay updated on the latest developments relevant to ${project.title} from activities, impact on the ground, news, events and much more` : 'Loading...'}
        </Paragraph>
      </Section>
      <Section>
        <UpdateFeatured {...{ projectId, setFeatured }} />
      </Section>
      <Section>
        <Filter>
          <Filter.Title>FIND UPDATES</Filter.Title>
          <Filter.Input
            visible={filter.visible}
            loading={loading}
            onChange={setSearch}
            onPopOver={() => {
              setFilter({ apply: false, visible: true })
            }}
          >
            <PopFilter
              {...{
                writers,
                authors,
                setAuthors,
                setFilter
              }}
            />
          </Filter.Input>
          <Filter.Info
            isFiltering={(authors.length > 0 && filter.apply)}
            amount={items.length}
            loading={loading}
            onClear={() => setAuthors([])}
          >
            <Row gutter={[8, 8]}>
              <Col>
                {(authors.length > 0) && <Text type="secondary">WRITERS</Text>}
              </Col>
              <Col>
                {(authors.length > 0) && authors.map((author, ax) => (
                  <Filter.Tag
                    key={ax}
                    onClose={(e) => {
                      e.preventDefault()
                      handleOnClose(author)
                    }}
                  >
                    {author.firstName} {author.lastName}
                  </Filter.Tag>
                ))}
              </Col>
            </Row>
          </Filter.Info>
        </Filter>
      </Section>
      <Section>
        {loading && (
          <Row gutter={[32, 8]}>
            {[1, 2, 3].map((item) => <UpdateItem key={item} loading={loading} />)}
          </Row>
        )}
        <UpdatePages
          {...{
            projectId,
            page,
            total,
            results,
            loading,
            setPage
          }}
        />
      </Section>
    </>
  )
}

export default Updates
