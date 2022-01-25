import React from 'react'
import {
  Typography,
  Col,
} from 'antd'

import Image from '../components/Image'
import { queryStories } from '../queries'
import { TrimText } from '../../../utils/string'

import defaultImage from '../../../images/default-image.png'

const { Paragraph, Text, Title } = Typography

const UpdateItem = ({ projectId, page = 1 }) => {
  const { data } = queryStories(projectId, page)
  const { results } = data || {}
  return results
    ? results.map((r, rx) => (
      <Col span={8} key={rx}>
        <Image
          width="100%"
          height={256}
          src={r.photo ? r.photo.original : defaultImage}
          className="mb-3"
        />
        <ul>
          <li className="mb-1">
            <Title level={4}>{r.title}</Title>
          </li>
          <li className="mb-4">
            <Paragraph><TrimText text={r.text} max={500} /></Paragraph>
          </li>
          <li>
            <Text strong>Elizabeth Kyengo</Text>
          </li>
          <li>
            <Text>Netherlands Development Organisation</Text>
          </li>
          <li>
            <Text>24-Dec-2017</Text>
          </li>
        </ul>
      </Col>
    ))
    : null
}

export default UpdateItem
