import React from 'react'
import { Button, Menu, Typography } from 'antd'
import { useLocation } from 'react-router-dom'

import jsonLinks from './help-links.json'

const { Text } = Typography

const setIDAsVariable = (pathname) => pathname
  .split('/')
  .map((p) => /\d/.test(p) ? ':id' : p)
  .join('/')

const HelpLinks = ({ userRole }) => {
  const location = useLocation()
  const links = jsonLinks
    .filter((li) => {
      return li
        .routes
        .filter((r) => {
          let pathname = setIDAsVariable(location.pathname)
          /**
           * Add enumerator prefix to provide help links for enumerators only.
           */
          pathname = userRole === 'enumerator' ? `/enumerator${pathname}` : pathname
          return pathname === r
        })
        .length > 0
    })
  return (
    <ul className="help-links">
      <li>
        <h5 className="help"><Text strong>Help</Text></h5>
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
