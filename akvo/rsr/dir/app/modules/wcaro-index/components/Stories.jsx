import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Typography, Pagination, Skeleton, Icon } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import moment from 'moment'
import defaultimage from '../../../images/default-image.png'
import { shorten } from '../../../utils/misc'
import { queryStories } from '../data/queries'

const { Title, Text } = Typography

const StoryCard = ({ id, photo, title, eventDate }) => (
  <Card
    hoverable={id}
    style={{ width: '100%', minHeight: 284 }}
    cover={(
      <div
        style={{
          height: 200,
          backgroundImage: `url("${photo}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%'
        }}
      >
        <div style={{ padding: '20px 15px' }}>
          {id && <span className="badge success">RSR UPDATE</span>}
        </div>
      </div>
    )}
  >
    <Card.Meta title={title || ''} description={eventDate ? moment(eventDate, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''} />
  </Card>
)

const Pages = ({ paginate, setPaginate }) => {
  const { data } = queryStories(paginate.current)
  const { results, count } = data || {}
  const a = (results && results[0]) ? results[0] : {}
  const b = (results && results[1]) ? results[1] : {}
  const c = (results && results[2]) ? results[2] : {}
  const d = (results && results[3]) ? results[3] : {}
  useEffect(() => {
    if (count && !paginate.total) {
      setPaginate({
        ...paginate,
        total: count
      })
    }
  }, [count, paginate])

  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <>
      <Skeleton paragraph={{ rows: 4 }} loading={!results} active>
        <Row className="card">
          <Col lg={6} sm={12}>
            <div
              style={{
                width: '100%',
                boxShadow: 'none',
                minHeight: 250,
                backgroundImage: `url("${a.photo ? a.photo.original : defaultimage}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100%',
                backgroundPosition: 'center',
                paddingTop: 20
              }}
            >
              <div className="img-badges">
                {a.id ? <span className="badge success">RSR UPDATE</span> : null}
              </div>
            </div>
          </Col>
          <Col lg={18} sm={12} className="content">
            <Card
              bordered={false}
              actions={[
                <div key="ellipsis">
                  {a.absoluteUrl
                    ? <Button type="link" href={a.absoluteUrl} target="_blank">Read more</Button>
                    : <Icon icon="ellipsis" />
                  }
                </div>
              ]}
              style={{ minHeight: 220 }}
            >
              {a.title
                ? (
                  <Card.Meta
                    title={a.title}
                    description={a.eventDate ? moment(a.eventDate, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}
                    style={{ marginBottom: 5 }}
                  />
                )
                : null
              }
              <Text style={{ textAlign: 'justify' }}>{mdOutput(parse(a.text ? shorten(a.text, 500) : ''))}</Text>
            </Card>
          </Col>
        </Row>
      </Skeleton>
      <Row gutter={[8, 8]}>
        <Col lg={12} sm={24}>
          <Skeleton paragraph={{ rows: 4 }} loading={!results} active>
            <Row style={{ backgroundColor: '#fff' }}>
              <Col
                span={12}
                style={{
                  width: '50%',
                  minHeight: 268,
                  backgroundImage: `url("${b.photo ? b.photo.original : defaultimage}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '95%',
                  backgroundPosition: 'center',
                  padding: '35px 15px'
                }}
              >
                {b.id && <span className="badge success">RSR UPDATE</span>}
              </Col>
              <Col span={12}>
                <Card
                  bordered={false}
                  actions={[
                    <div key="ellipsis">
                      {b.absoluteUrl
                        ? <Button type="link" href={b.absoluteUrl} target="_blank">Read more</Button>
                        : <Icon icon="ellipsis" />
                      }
                    </div>
                  ]}
                  style={{ minHeight: 282 }}
                >
                  {b.title
                    ? (
                      <Card.Meta
                        title={b.title}
                        description={b.eventDate ? moment(b.eventDate, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}
                        style={{ marginBottom: 15 }}
                      />
                    )
                    : null
                  }
                  <Text style={{ textAlign: 'justify' }}>{mdOutput(parse(b.text ? shorten(b.text, 180) : ''))}</Text>
                </Card>
              </Col>
            </Row>
          </Skeleton>
        </Col>
        <Col lg={6} sm={12}>
          <Skeleton paragraph={{ rows: 4 }} loading={!results} active>
            {c.absoluteUrl ?
              (
                <a href={c.absoluteUrl} target="_blank" rel="noopener noreferrer">
                  <StoryCard {...{ ...c, photo: c.photo ? c.photo.original : defaultimage }} />
                </a>
              )
              : <StoryCard {...{ ...c, photo: c.photo ? c.photo.original : defaultimage }} />
            }
          </Skeleton>
        </Col>
        <Col lg={6} sm={12}>
          <Skeleton paragraph={{ rows: 4 }} loading={!results} active>
            {d.absoluteUrl ?
              (
                <a href={c.absoluteUrl} target="_blank" rel="noopener noreferrer">
                  <StoryCard {...{ ...d, photo: d.photo ? d.photo.original : defaultimage }} />
                </a>
              )
              : <StoryCard {...{ ...d, photo: d.photo ? d.photo.original : defaultimage }} />
            }
          </Skeleton>
        </Col>
      </Row>
    </>
  )
}

export const Stories = () => {
  const [paginate, setPaginate] = useState({
    total: null,
    pageSize: 4,
    current: 1
  })

  const handleOnChange = page => {
    setPaginate({
      ...paginate,
      current: page
    })
  }
  return (
    <div id="stories">
      <Row>
        <Col md={18} sm={24}>
          <Title level={3}>RSR Stories</Title>
        </Col>
        <Col md={6} sm={24} className="text-right" style={{ padding: '10px 0', textAlign: 'right' }}>
          {paginate.total ? <Pagination size="small" onChange={handleOnChange} {...paginate} /> : 'Loading...'}
        </Col>
      </Row>
      <Pages {...{ paginate, setPaginate }} />
    </div>
  )
}
