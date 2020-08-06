import React, { useEffect, useState, useRef } from 'react'
import { Modal, Collapse, Icon, Pagination, Checkbox, Button, Spin, Radio } from 'antd'
import api from '../../utils/api'

const pageSize = 30

const NewExportModal = ({ visible, setVisible, currentOrg, userId, addExport }) => {
  const [projects, setProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [allSelected, setAllSelected] = useState(false)
  const [includedInLatest, setIncludedInLatest] = useState([])
  const prevOrg = useRef()
  const unfilteredProjects = useRef()
  const [filter, setFilter] = useState('all')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if(visible){
      if(prevOrg.current !== currentOrg){
        setLoading(true)
        setAllProjects([])
        setProjects([])
        api.get('/project_iati_export/', {reporting_org: currentOrg, limit: 6000 })
        .then(({data: {results}}) => {
          setAllProjects(results)
          unfilteredProjects.current = results
          setProjects(results.slice(0, pageSize))
          setLoading(false)
        })
        api.get(`/iati_export/?reporting_organisation=${currentOrg}&ordering=-id&limit=1`)
        .then(({data: {results}}) => {
          if(results && results.length > 0){
            setIncludedInLatest(results[0].projects)
            console.log(results[0].projects)
          } else {
            // no latest file
          }
        })
      }
      prevOrg.current = currentOrg
    }
  }, [currentOrg, visible])
  const handlPageChange = (page) => {
    setProjects(allProjects.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize))
    setCurrentPage(page)
  }
  const handleChangeFilter = ({target: {value}}) => {
    setFilter(value)
    let filteredProjects = []
    if(value === 'all'){
      filteredProjects = unfilteredProjects.current
    }
    else if(value === 'without-errors'){
      filteredProjects = unfilteredProjects.current.filter(it => it.checksErrors.length === 0)
    }
    else if(value === 'in-last-export'){
      filteredProjects = unfilteredProjects.current.filter(it => includedInLatest.indexOf(it.id) !== -1)
    }
    else if(value === 'published'){
      filteredProjects = unfilteredProjects.current.filter(it => it.publishingStatus === 'published')
    }
    setAllProjects(filteredProjects)
    setProjects(filteredProjects.slice(0, pageSize))
    setSelected([])
    setAllSelected(false)
  }
  const toggleSelectAll = () => {
    if(!allSelected){
      setSelected(allProjects.map((it, i) => i))
      setAllSelected(true)
    } else {
      setSelected([])
      setAllSelected(false)
    }
  }
  const handleSelectItem = (ind) => (e) => {
    e.stopPropagation()
    if(selected.indexOf(ind) !== -1) {
      setSelected(selected.filter(it => it !== ind))
      if(allSelected) setAllSelected(false)
    }
    else {
      setSelected([...selected, ind])
      if(selected.length + 1 === allProjects.length) setAllSelected(true)
    }
  }
  const handleClickExport = () => {
    setSending(true)
    api.post('/iati_export/', {
      projects: selected.map(it => allProjects[it].id),
      reportingOrganisation: currentOrg,
      user: userId
    })
    .then(({data}) => {
      setSending(false)
      addExport(data)
      setVisible(false)
    })
    .catch(() => {
      setSending(false)
    })
  }
  return (
    <Modal
      visible={visible} onCancel={() => setVisible(false)} footer={null} className="new-export-modal"
      width={800}
      title="New IATI Export"
    >
      <header>
        <Checkbox checked={allSelected} onClick={toggleSelectAll} />
        <Radio.Group size="small" value={filter} onChange={handleChangeFilter}>
          <Radio.Button value="all">All projects</Radio.Button>
          <Radio.Button value="without-errors">Without errors</Radio.Button>
          <Radio.Button value="in-last-export">Included in last export</Radio.Button>
          <Radio.Button value="published">Published</Radio.Button>
        </Radio.Group>
        <Button type="primary" loading={sending} onClick={handleClickExport} disabled={selected.length === 0}>{selected.length > 0 && 'Export '}{selected.length} selected</Button>
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Collapse destroyInactivePanel accordion>
        {projects.map((item, ind) =>
        <Collapse.Panel
          header={[
            <Checkbox checked={selected.indexOf(ind) !== -1} onClick={handleSelectItem(ind)} />,
            <div className="titles">
              <div className="meta">
                <span><Icon type="global" /> {item.publishingStatus} {item.isPublic && '& public' }</span>
                {includedInLatest.indexOf(item.id) !== -1 && <span className="included"><Icon type="check" /> in last export</span>}
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
