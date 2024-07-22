import React from 'react'
import { Button, Spin } from 'antd'
import { Row, Col, Visible, Hidden } from 'react-awesome-styled-grid'
import { Link } from 'react-router-dom'
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons'

import { Button as ButtonRsr } from './Button'
import { Icon } from '../Icon'
import { homePage } from '../../../utils/ui-text'
import { scheduleDemoUrl } from '../../../utils/config'

const Header = ({
  user,
  loading,
  apiError,
  toggleDrawer,
}) => {
  return (
    <Row>
      <Col sm={2} md={2} align="flex-start">
        <Link to="/">
          <Icon type="logo.rsr" width="120px" height="26px" />
        </Link>
      </Col>
      <Col sm={2} md={2} lg={1} offset={{ sm: 1, md: 4, lg: 7 }} justify="center">
        <Hidden xs>
          {(!loading && apiError) && (
            <Button href="/my-rsr/" target="_blank" rel="noopener noreferrer" type="link">{homePage.signIn}</Button>
          )}
        </Hidden>
      </Col>
      <Col sm={3} md={4} lg={2} justify="center" align="flex-end">
        {loading && <Spin indicator={<LoadingOutlined />} spinning />}
        <Visible xs>
          <Button type="link" onClick={toggleDrawer}>
            <MenuOutlined />
          </Button>
        </Visible>
        <Hidden xs>
          {(!loading && apiError) && (
            <ButtonRsr type="button" href={scheduleDemoUrl} block>
              {homePage.scheduleDemo}
            </ButtonRsr>
          )}
          {(user && !loading && !apiError) && (
            <ButtonRsr type="button" href="/my-rsr/" blank block>
              {homePage.myProject}
            </ButtonRsr>
          )}
        </Hidden>
      </Col>
    </Row>
  )
}

export default Header
