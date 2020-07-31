import React, { useEffect, useState } from 'react'
import { Modal, Collapse, Icon, Pagination, Checkbox, Button, Spin } from 'antd'
import api from '../../utils/api'

const pageSize = 30

const NewExportModal = ({ visible, setVisible, currentOrg }) => {
  const [projects, setProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState([])

  useEffect(() => {
    if(visible){
      setLoading(true)
      api.get('/project_iati_export/', {reporting_org: currentOrg, limit: 6000 })
      .then(({data: {results}}) => {
        setAllProjects(results)
        setProjects(results.slice(0, pageSize))
        setLoading(false)
      })
    }
  }, [currentOrg, visible])
  const handlPageChange = (page) => {
    setProjects(allProjects.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize))
    setCurrentPage(page)
  }
  return (
    <Modal
      visible={visible} onCancel={() => setVisible(false)} footer={null} className="new-export-modal"
      width={800}
      title="New IATI Export"
    >
      <header>
        <ul>
          <li><Checkbox /> <span>Without errors</span></li>
          <li><Checkbox /> <span>Included in last export</span></li>
          <li><Checkbox /> <span>Published</span></li>
        </ul>
        <Button disabled>0 selected</Button>
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Collapse destroyInactivePanel accordion>
        {projects.map(item =>
        <Collapse.Panel
          header={[
            <Checkbox onClick={(e) => { e.stopPropagation() }} />,
            <div className="titles">
              <div className="meta">
                <span><Icon type="global" /> {item.publishingStatus}</span>
                {item.isPublic && <span className="included"><Icon type="check" /> in last export</span>}
              </div>
              <div>[{item.id}] {item.title}</div>
            </div>,
            <div className="rightside">
              <div className="errors">
              {item.checksErrors.length > 0 && <span>{item.checksErrors.length} errors</span>}
              {item.checksWarnings.length > 0 && <span>{item.checksWarnings.length} warnings</span>}
              </div>
            </div>
          ]}
        >
          {item.checksErrors.length > 0 && [
            <h5>Errors</h5>,
            <ul>
              {item.checksErrors.map(error => {
                return <li>{error}</li>
              })}
            </ul>
          ]}
          {item.checksWarnings.length > 0 && [
            <h5>Warnings</h5>,
            <ul>
              {item.checksWarnings.map(error => {
                return <li>{error}</li>
              })}
            </ul>
          ]}
        </Collapse.Panel>
        )}
      </Collapse>
      <Pagination current={currentPage} onChange={handlPageChange} total={allProjects.length} pageSize={pageSize} />
    </Modal>
  )
}

export default NewExportModal
