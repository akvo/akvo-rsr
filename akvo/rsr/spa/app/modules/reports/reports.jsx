import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import api from '../../utils/api'

import './styles.scss'

const Reports = ({programId}) => {
  const [reports, setReports] = useState([])
  const [organisation, setOrganisation] = useState(null)
  useEffect(() => {
    api.get(`/program_reports/${programId}`)
      .then(({ data }) => {
        if (data.reports) {
          setReports(data.reports)
          setOrganisation(data.organisation)
        }
      })
  }, [programId])

  return (
    <div className="program-reports">
      <div className="cards">
        {organisation && reports.map((report) =>
          <div className="card">
            <Report organisation={organisation} report={report} key={report.id} />
          </div>
        )}
      </div>
    </div>
  )
}

const Report = ({organisation, report}) => {
  const buildDownloadHandler = (format) => {
    const downloadUrl = report.url.replace('{format}', format).replace('{organisation}', organisation.id)

    return (e) => {
      e.stopPropagation()
      window.location.assign(downloadUrl);
    }
  }

  return (
    <div className="report">
      <h3>{report.title}</h3>
      <div className="description">{report.description}</div>
      <div className="options">
        {report.formats.map((format) =>
          <Button onClick={buildDownloadHandler(format.name)} icon={`file-${format.name}`} key={format.name}>
            {`Download ${format.displayName}`}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Reports
