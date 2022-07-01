import React from 'react'
import { Button, Menu, Typography } from 'antd'
import { useLocation } from 'react-router-dom'

import jsonLinks from './help-links.json'

const { Text } = Typography

const HelpLinks = ({ userRole }) => {
  const location = useLocation()
  const links = jsonLinks
    .filter((li) => {
      return li
        .routes
        .filter((r) => {
          return (
            (location.pathname.split('/').pop() === r && (!userRole || (userRole && userRole !== 'enumerator'))) ||
            (location.pathname === '/' && r === '/') ||
            (userRole && userRole === 'enumerator' && location.pathname.includes('results') && r === 'results-admin')
          )
        })
        .length > 0
    })
  return (
    <ul className="help-links">
      <li>
        <ul>
          {
            links.length
              ? links.map((l, lx) => (
                <li key={lx}>
                  <Button type="link" href={l.url} target="blank"><u>{l.text}</u></Button>
                </li>
              ))
              : (
                <li>
                  <Button type="link" href="https://rsrsupport.akvo.org/article/show/152434-user-guides" target="_blank"><u>Framework Guide</u></Button>
                </li>
              )
          }
        </ul>
      </li>
    </ul>
  )
}

export default HelpLinks
