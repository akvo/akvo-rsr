/* global window */
import React from 'react'
import { Button, Spin, Icon, Card } from 'antd'
import {useFetch} from '../../utils/hooks'

import './styles.scss'

const Reports = ({programId}) => {
  const [{ reports, organisation }, loading] = useFetch(`/program_reports/${programId}`)
  return (
    <div className="program-reports">
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div className="cards">
        {organisation && reports.map((report) =>
          <Report organisation={organisation} report={report} key={report.id} />
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
    <div className="card-container">
    <Card hoverable className="report">
      <h3>{report.title}</h3>
      <div className="description">{report.description}</div>
      <div className="options">
        {report.formats.map((format) =>
          <Button size="large" onClick={buildDownloadHandler(format.name)} icon={`file-${format.name}`} key={format.name}>
            {`Download ${format.displayName}`}
          </Button>
        )}
      </div>
    </Card>
    </div>
  )
}

export default Reports
