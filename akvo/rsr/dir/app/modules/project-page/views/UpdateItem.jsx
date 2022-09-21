import React from 'react'
import {
  Typography,
  Skeleton,
  Col,
} from 'antd'
import { Link } from 'react-router-dom'

import { TrimText } from '../../../utils/string'
import Author from '../components/Author'
import Thumbnail from '../components/Thumbnail'
import { MAX_TEXT_LENGTH } from '../../../utils/config'

const { Paragraph, Title } = Typography

const UpdateItem = ({
  id,
  photo,
  title,
  text,
  createdAt,
  projectId,
  userDetails,
  loading = false,
  ...props
}) => (
  <Col lg={8} md={12} className="update-item">
    <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}>
      <Thumbnail
        width="100%"
        height={256}
        className="mb-3"
        {...{
          ...props,
          photo,
          title
        }}
      />
    </Link>
    <Skeleton loading={loading} paragraph={{ rows: 5 }} active>
      <ul>
        <li className="mb-1">
          <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}><Title level={4}>{title}</Title></Link>
        </li>
        <li className="mb-5">
          <Paragraph>
            <TrimText url={`/dir/project/${projectId}/update?id=${id}`} text={text} max={MAX_TEXT_LENGTH - 350} isMarkdown />
          </Paragraph>
        </li>
        <li className="author">
          <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}><Author {...{ userDetails, createdAt }} /></Link>
        </li>
      </ul>
    </Skeleton>
  </Col>
)

export default UpdateItem
