/* global window */
import React from 'react'
import { Empty, Button, Icon, Spin } from 'antd'

const EmptyPage = ({ error }) => error !== undefined
  ? (
    <>
      <Empty description="You need to SIGN IN to view this data" style={{ marginBottom: 20 }} />
      <Button type="primary" href={`/en/sign_in/?next=${window.location.href}`}>
        SIGN IN&nbsp;
        <Icon type="arrow-right" />
      </Button>
    </>
  )
  : <Spin />

export default EmptyPage
