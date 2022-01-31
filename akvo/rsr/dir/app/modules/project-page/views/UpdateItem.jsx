import React from 'react'
import {
  Typography,
  Skeleton,
  Col,
} from 'antd'

import Image from '../components/Image'
import { TrimText } from '../../../utils/string'

import defaultImage from '../../../images/default-image.png'

const { Paragraph, Text, Title } = Typography

const UpdateItem = ({ photo, title, text, loading = false }) => (
  <Col span={8}>
    <Image
      width="100%"
      height={256}
      src={photo ? photo.original : defaultImage}
      className="mb-3"
    />
    <Skeleton loading={loading} paragraph={{ rows: 5 }} active>
      <ul>
        <li className="mb-1">
          <Title level={4}>{title}</Title>
        </li>
        <li className="mb-4">
          <Paragraph><TrimText text={text} max={500} /></Paragraph>
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
    </Skeleton>
  </Col>
)

export default UpdateItem
