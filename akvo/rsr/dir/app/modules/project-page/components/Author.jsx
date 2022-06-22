import React from 'react'
import moment from 'moment'
import { Typography } from 'antd'

const { Text } = Typography

const Author = ({
  userDetails,
  createdAt
}) => (
  <>
    <Text strong>{userDetails ? userDetails.firstName : ''} {userDetails ? userDetails.lastName : ''}</Text>
    <br />
    {userDetails && <Text>{userDetails.approvedOrganisations[0] ? userDetails.approvedOrganisations[0].name : ''}</Text>}
    <br />
    <Text>{moment(createdAt, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
  </>
)

export default Author
