import React, { useState } from 'react'
import {
  Typography,
  Layout,
  Input,
  Icon,
  Row,
  Col,
  Pagination
} from 'antd'
import SVGInline from 'react-svg-inline'

import filterSvg from '../../../images/icFilter.svg'
import UpdateItem from './UpdateItem'
import UpdateFeatured from './UpdateFeatured'
import { queryAllUpdates } from '../queries'
import { createPaginate } from '../../../utils/misc'

const { Content } = Layout
const { Title, Paragraph } = Typography

const Updates = ({
  setAllstories,
  allStories,
  projectId
}) => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { data, size, setSize } = queryAllUpdates(projectId, 2, 6)

  const lastData = data ? data.pop() : null
  if (loading && lastData && lastData.next) {
    const stories = [...allStories, ...lastData.results].flatMap((ds) => ds)
    setAllstories(stories)
    setSize(size + 1)
  }
  if (loading && lastData && !lastData.next) {
    setLoading(false)
  }
  const total = allStories.length
  const paginates = createPaginate(allStories, page, 6)
  return (
    <>
      <Row className="project-row">
        <Col>
          <Content>
            <Title className="text-dark bold">Project Updates</Title>
            <Paragraph className="hero">
              Stay Updated on the latest developments relevant to HortImpact from funding, impact on the ground, actionable ideas, news trends and so much more.
            </Paragraph>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <UpdateFeatured projectId={projectId} />
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            <Row>
              <Col className="mb-3">
                <Title level={2} className="text-dark bold">FIND UPDATES</Title>
                <span className="bottom-line" />
              </Col>
              <Col className="filter-search">
                <Input
                  prefix={<Icon type="search" />}
                  size="large"
                  addonAfter={<SVGInline svg={filterSvg} />}
                />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
      <Row className="project-row">
        <Col>
          <Content>
            {
              loading
                ? (
                  <Row gutter={[32, 8]}>
                    {[1, 2, 3].map((item) => <UpdateItem key={item} loading={loading} />)}
                  </Row>
                )
                : (
                  <>
                    <Row type="flex" justify="start" gutter={[32, 16]}>
                      {paginates.map((item) => <UpdateItem {...item} key={item.id} />)}
                    </Row>
                    <Row>
                      <Col>
                        <Pagination current={page} total={total} onChange={setPage} />
                      </Col>
                    </Row>
                  </>
                )}
          </Content>
        </Col>
      </Row>
    </>
  )
}

export default Updates
