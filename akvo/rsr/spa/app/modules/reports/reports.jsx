/* global window */
import React from 'react'
import { Button, Spin, Icon, Card } from 'antd'
import {useFetch} from '../../utils/hooks'

import './styles.scss'

const Reports = ({programId}) => {
  const [{ results: reports = [] }, loading] = useFetch(programId ? `/program_reports/${programId}` : '/reports/')
  return (
    <div className="reports">
      {!programId && (
        <div>&nbsp;</div>
      )}
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div className="cards">
        {!loading && reports.map((report) =>
          <Report report={report} key={report.id} />
        )}
      </div>
    </div>
  )
}

const Report = ({report}) => {
  const buildDownloadHandler = (format) => {
    const downloadUrl = report.url.replace('{format}', format).replace('{organisation}', report.organisations[0])

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
          <Button size="large" onClick={buildDownloadHandler(format.name)} icon={`file-${format.name}`} key={format.name} disabled={report.organisations.length === 0}>
            {`Download ${format.displayName}`}
          </Button>
        )}
      </div>
    </Card>
    </div>
  )
}

export default Reports
