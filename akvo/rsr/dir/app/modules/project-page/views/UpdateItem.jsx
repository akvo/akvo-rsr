import React from 'react'
import {
  Typography,
  Skeleton,
  Col,
} from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import classNames from 'classnames'

import { TrimText } from '../../../utils/string'
import Author from '../components/Author'
import Thumbnail from '../components/Thumbnail'
import { MAX_TEXT_LENGTH } from '../../../utils/config'

const { Paragraph, Title } = Typography

const Wrapper = styled.div`
  min-height: 350px;
  .content.ant-typography {
    margin-bottom: 3em;
  }
  .author {
    bottom: 0;
    margin-bottom: 24px;
    &.empty {
      position: absolute;
    }
  }
`

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
        height={300}
        className="mb-3"
        {...{
          ...props,
          photo,
          title
        }}
      />
    </Link>
    <Skeleton loading={loading} paragraph={{ rows: 5 }} active>
      <Wrapper>
        <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}>
          <Title level={4}>{title}</Title>
        </Link>
        <Paragraph className="content">
          <TrimText url={`/dir/project/${projectId}/update?id=${id}`} text={text} max={MAX_TEXT_LENGTH - 350} isMarkdown />
        </Paragraph>
        <div className={classNames('author', { empty: ((text && text.length < MAX_TEXT_LENGTH - 350) || !text) })}>
          <Link to={id ? `/dir/project/${projectId}/update?id=${id}` : '#'}><Author {...{ userDetails, createdAt }} /></Link>
        </div>
      </Wrapper>
    </Skeleton>
  </Col>
)

export default UpdateItem
