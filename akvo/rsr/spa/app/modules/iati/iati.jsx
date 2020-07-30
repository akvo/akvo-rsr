/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import SUOrgSelect from '../users/su-org-select'
import api from '../../utils/api'
import './styles.scss'

const IATI = ({ userRdr }) => {
  const [currentOrg, setCurrentOrg] = useState(null)
  const [exports, setExports] = useState([])
  const _setCurrentOrg = (orgId) => {
    setCurrentOrg(orgId)
    api.get(`/iati_export/?reporting_organisation=${orgId}&limit=1000`)
    .then(({data}) => {
      setExports(data.results)
    })
  }
  useEffect(() => {
    if (userRdr && userRdr.organisations) {
      const firstOrg = userRdr.organisations.filter(it => it.canEditUsers)[0]
      if (!firstOrg) window.location.href = '/my-rsr/projects'
      else _setCurrentOrg(firstOrg.id)
    }
  }, [userRdr])
  const orgs = userRdr && userRdr.userManagementOrganisations ? userRdr.userManagementOrganisations.filter(it => it.canEditUsers) : []
  return (
  <div className="iati-view">
    <div className="topbar-row">
      <div className="left-side">
        {!(userRdr && userRdr.isSuperuser) && orgs.length > 1 && (
          <Select showSearch filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0} dropdownMatchSelectWidth={false} value={currentOrg} onChange={_setCurrentOrg}>
            {orgs.map(org => <Select.Option value={org.id} data={org.name}>{org.name}</Select.Option>)}
          </Select>
        )}
        {(userRdr && userRdr.isSuperuser && currentOrg !== null) && <SUOrgSelect value={currentOrg} onChange={_setCurrentOrg} />}
      </div>
    </div>
  </div>)
}

export default connect(({ userRdr }) => ({ userRdr }))(IATI)
