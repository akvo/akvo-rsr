import React from 'react'
import { Empty, Row, Col, Pagination } from 'antd'
import UpdateItem from './UpdateItem'

const UpdatePages = ({
  projectId,
  page,
  total,
  results,
  loading,
  setPage
}) => {
  return results.length
    ? (
      <>
        <Row type="flex" justify="start" gutter={[32, 48]} className="project-updates">
          {results.map((item) => <UpdateItem {...{ ...item, projectId }} key={item.id} />)}
        </Row>
        <Row>
          <Col>
            <Pagination
              current={page + 1}
              total={total}
              pageSize={9}
              onChange={(pg) => {
                setPage(pg - 1)
              }}
            />
          </Col>
        </Row>
      </>
    )
    : (
      <>
        {!loading && <Empty />}
      </>
    )
}

export default UpdatePages
