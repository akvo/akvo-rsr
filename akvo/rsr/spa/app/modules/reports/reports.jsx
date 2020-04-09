/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Spin, Icon, Card, Select } from 'antd'
import {useFetch} from '../../utils/hooks'
import SUOrgSelect from '../users/su-org-select'
import './styles.scss'

const Reports = ({programId, userRdr}) => {
  const [currentOrg, setCurrentOrg] = useState(null)
  const [{ results: reports = [] }, loading] = useFetch(programId ? `/program_reports/${programId}` : '/organisation_reports/')
  useEffect(() => {
    if (userRdr && userRdr.organisations) {
      setCurrentOrg(userRdr.organisations[0].id)
    }
  }, [userRdr])
  const orgs = userRdr && userRdr.organisations ? userRdr.organisations : []
  const employment = currentOrg && !userRdr.isSuperuser && userRdr.approvedEmployments.find(it => it.organisation === currentOrg)
  const isEnumerator = employment && employment.group === 16
  return (
    <div className="reports">
      {!programId && (
        <div className="header">
          {/* <span>Organisation:</span> */}
          {!(userRdr && userRdr.isSuperuser) && orgs.length > 1 && (
            <Select dropdownMatchSelectWidth={false} value={currentOrg} onChange={setCurrentOrg}>
              {orgs.map(org => <Select.Option value={org.id}>{org.name}</Select.Option>)}
            </Select>
          )}
          {(userRdr && userRdr.isSuperuser && currentOrg !== null) && <SUOrgSelect value={currentOrg} onChange={setCurrentOrg} />}
        </div>
      )}
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div className="cards">
        {!loading && reports.map((report) =>
          <Report {...{ report, currentOrg, isEnumerator}} key={report.id} />
        )}
      </div>
    </div>
  )
}

const Report = ({ report, currentOrg, isEnumerator }) => {
  const buildDownloadHandler = (format) => {
    const downloadUrl = report.url.replace('{format}', format).replace('{organisation}', currentOrg)

    return (e) => {
      e.stopPropagation()
      window.location.assign(downloadUrl);
    }
  }

  return (
    <div className="card-container">
    <Card hoverable className="report">
      <h3>{report.title}</h3>
      <div className="description">{report.description}</div>
      <div className="options">
        {report.formats.map((format) =>
          <Button size="large" onClick={buildDownloadHandler(format.name)} icon={`file-${format.name}`} key={format.name} disabled={isEnumerator}>
            {`Download ${format.displayName}`}
          </Button>
        )}
      </div>
    </Card>
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Reports)
