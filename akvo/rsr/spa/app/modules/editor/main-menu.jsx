import React from 'react'
import { connect } from 'react-redux'
import {Route, Link} from 'react-router-dom'
import { Icon } from 'antd'
import { validationType } from '../../utils/validation-utils'
import sections from './sections'

const dict = {
  info: 'General Information',
  contacts: 'Contact Information',
  partners: 'Partners',
  descriptions: 'Descriptions',
  'results-n-indicators': 'Results & Indicators',
  finance: 'Finance',
  locations: 'Locations',
  focus: 'Focus',
  'links-n-docs': 'Links & Documents',
  'comments-n-keywords': 'Comments & Keywords',
  reporting: 'CRS++ & FSS reporting'
}


const filterSection11 = validations => (item) => {
  if(item.key === 'reporting' && (validations.indexOf(validationType.IATI) === -1 && validations.indexOf(validationType.DFID) === -1)) return false
  return true
}

const Check = ({ checked }) => (
  <div className="check">
    <Icon type="check-circle" theme="filled" className={checked ? 'checked' : ''} />
  </div>
)

const MenuItem = (props) => {
  const { to, checked, hideCheck } = props
  return (
    <Route
      path={to}
      exact
      children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to}>
            <span>{props.children}</span>
            {!hideCheck &&
              <Check checked={checked} />
            }
          </Link>
        </li>
      )}
    />
  )
}

const MainMenu = ({ rdr, params }) => {
  return (
    <aside className="main-menu">
      <ul>
        <MenuItem hideCheck to={`/projects/${params.id}/settings`}>Settings</MenuItem>
        {sections.filter(filterSection11(rdr.validations)).map((section, index) =>
        <MenuItem key={section.key} to={`/projects/${params.id}/${section.key}`} checked={rdr[`section${index + 1}`].isValid && rdr[`section${index + 1}`].isTouched}>{index + 1}. {dict[section.key]}</MenuItem>
        )}
      </ul>
    </aside>
  )
}

export default connect(
  ({ editorRdr }) => ({ rdr: editorRdr })
)(MainMenu)
