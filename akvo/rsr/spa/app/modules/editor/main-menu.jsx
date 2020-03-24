import React from 'react'
import { connect } from 'react-redux'
import {Route, Link} from 'react-router-dom'
import { Icon } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { validationType } from '../../utils/validation-utils'
import sections from './sections'

const keyDict = {
  settings: 'Validation set',
  info: 'General information',
  contacts: 'Project Contacts',
  partners: 'Partners',
  descriptions: 'Descriptions',
  'results-n-indicators': 'Results and indicators',
  finance: 'Finance',
  locations: 'Locations',
  focus: 'Project focus',
  'links-n-docs': 'Links and documents',
  'comments-n-keywords': 'Comments and keywords',
  reporting: 'CRS++ and FSS reporting'
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
  const { to, checked, hideCheck, disabled, loading } = props
  return (
    <Route
      path={to}
      exact
      children={({ match }) => (
        <li className={classNames({active: match, disabled, checked })}>
          <Link to={to} disabled={disabled}>
            <span>{props.children}</span>
            {(!hideCheck && !loading) &&
              <Check checked={checked} />
            }
            {loading &&
              <div className="loading" />
            }
          </Link>
        </li>
      )}
    />
  )
}

export const findIfReportingOrgIsEUTF = partners => {
  return partners.findIndex(partner => {
    return partner.iatiOrganisationRole === 101 && partner.organisation === 3394
  }) !== -1
}

const MainMenu = ({ rdr, userRdr, params, urlPrefixId, program }) => {
  const { t } = useTranslation()
  const isNewProject = params.id === 'new'
  const isReportingOrgEUTF = findIfReportingOrgIsEUTF(rdr.section3.fields.partners)
  const getLabel = (key) => {
    if (key === 'partners' && userRdr.organisations && userRdr.organisations.findIndex(it => it.id === 42) !== -1) return 'Partners & User Access'
    if (program && key === 'focus') return 'Program focus'
    if (program && key === 'contacts') return 'Program Contacts'
    return keyDict[key]
  }
  return (
    <aside className="main-menu">
      <ul>
        <MenuItem hideCheck to={`${urlPrefixId}/settings`}>{t('settings')}</MenuItem>
        {sections.filter(filterSection11(rdr.validations)).map((section, index) =>
        <MenuItem
          disabled={isNewProject || (isReportingOrgEUTF && index === 1)}
          key={section.key}
          to={`${urlPrefixId}/${section.key}`}
          checked={rdr[`section${index + 1}`].errors.filter(it => it.type === 'required' || it.type === 'min').length === 0 && (rdr[`section${index + 1}`].isTouched || rdr[`section${index + 1}`].isFetched)}
          loading={!isNewProject && !rdr[`section${index + 1}`].isFetched && !rdr[`section${index + 1}`].isExplicitlyEnabled}
        >
          {index + 1}. {t(getLabel(section.key))}
        </MenuItem>
        )}
      </ul>
    </aside>
  )
}

export default connect(
  ({ editorRdr, userRdr }) => ({ rdr: editorRdr, userRdr })
)(MainMenu)
