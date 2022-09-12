import React from 'react'
import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { scheduleDemoUrl } from '../../../utils/config'
import { homePage } from '../../../utils/ui-text'

const NavItem = styled.span`
  display: flex;
  text-transform: uppercase;
  line-height: 42px;
  align-items: center;
  transition: all .3s ease-out;
  font-weight: ${props => props.theme.font.weight.medium};
  color: ${props => props.theme.color.gray['500']};
  &:hover {
    color: ${props => props.theme.color.primary['700']};
  }
`

const MobileDrawer = ({ apiError, loading, user, visible, onClose }) => {
  const { t } = useTranslation()
  return (
    <Drawer title="Menu" placement="right" visible={visible} onClose={onClose} closable>
      {(!loading && apiError) && (
        <ul>
          <li>
            <Link to={scheduleDemoUrl}>
              <NavItem>
                {homePage.scheduleDemo}
              </NavItem>
            </Link>
          </li>
          <li>
            <a href="/my-rsr/" target="_blank" rel="noopener noreferrer">
              <NavItem>
                {homePage.signIn}
              </NavItem>
            </a>
          </li>
        </ul>
      )}
      {(user && !loading && !apiError) && (
        <ul>
          <li>
            <a href="/my-rsr/my-details/">
              <NavItem>
                {t('My details')}
              </NavItem>
            </a>
          </li>
          <li>
            <a href="/en/sign_out">
              <NavItem>
                {t('Sign out')}
              </NavItem>
            </a>
          </li>
        </ul>
      )}
    </Drawer>
  )
}

export default MobileDrawer
