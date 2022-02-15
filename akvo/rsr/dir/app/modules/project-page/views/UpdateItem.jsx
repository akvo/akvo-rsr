import React from 'react'
import {
  Typography,
  Skeleton,
  Col,
} from 'antd'
import moment from 'moment'

import Image from '../components/Image'
import { TrimText } from '../../../utils/string'
import defaultImage from '../../../images/default-image.png'

const { Paragraph, Text, Title } = Typography

const UpdateItem = ({
  photo,
  title,
  text,
  createdAt,
  userDetails,
  loading = false
}) => (
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
        <li className="mb-5">
          <Paragraph><TrimText text={text} max={500} /></Paragraph>
        </li>
        <li style={{ position: 'absolute', bottom: 0 }}>
          <Text strong>{userDetails ? userDetails.firstName : ''} {userDetails ? userDetails.lastName : ''}</Text>
          <br />
          {userDetails && <Text>{userDetails.approvedOrganisations[0].name || ''}</Text>}
          <br />
          <Text>{moment(createdAt, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
        </li>
      </ul>
    </Skeleton>
  </Col>
)

export default UpdateItem
