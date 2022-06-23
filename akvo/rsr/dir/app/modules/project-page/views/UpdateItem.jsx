import React from 'react'
import {
  Typography,
  Skeleton,
  Col,
} from 'antd'
import { Link } from 'react-router-dom'

import Image from '../components/Image'
import { TrimText } from '../../../utils/string'
import defaultImage from '../../../images/default-image.png'
import Author from '../components/Author'
import { prefixUrl } from '../../../utils/config'

const { Paragraph, Title } = Typography

const UpdateItem = ({
  id,
  photo,
  title,
  text,
  createdAt,
  projectId,
  userDetails,
  loading = false
}) => (
  <Col lg={8} md={12} className="update-item">
    <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}>
      <Image
        width="100%"
        height={256}
        src={photo ? `${prefixUrl}${photo.original}` : defaultImage}
        className="mb-3"
      />
    </Link>
    <Skeleton loading={loading} paragraph={{ rows: 5 }} active>
      <ul>
        <li className="mb-1">
          <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}><Title level={4}>{title}</Title></Link>
        </li>
        <li className="mb-5">
          <Paragraph><TrimText text={text} max={400} isMarkdown /></Paragraph>
        </li>
        <li className="author">
          <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}><Author {...{ userDetails, createdAt }} /></Link>
        </li>
      </ul>
    </Skeleton>
  </Col>
)

export default UpdateItem
