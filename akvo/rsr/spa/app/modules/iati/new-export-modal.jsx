import React, { useEffect, useState, useRef } from 'react'
import { Modal, Collapse, Icon, Pagination, Checkbox, Button, Spin, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'

const pageSize = 30

const NewExportModal = ({ visible, setVisible, currentOrg, userId, addExport }) => {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [allSelected, setAllSelected] = useState(false)
  const [includedInLatest, setIncludedInLatest] = useState([])
  const prevOrg = useRef()
  const unfilteredProjects = useRef()
  const [filter, setFilter] = useState([])
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
  const handleChangeFilter = (value) => {
    const _filter = filter.indexOf(value) === -1 ? [...filter, value] : filter.filter(it => it !== value)
    setFilter(_filter)
    let filteredProjects = unfilteredProjects.current
    if (_filter.indexOf('without-errors') !== -1) {
      filteredProjects = unfilteredProjects.current.filter(it => it.checksErrors.length === 0)
    }
    if (_filter.indexOf('in-last-export') !== -1) {
      filteredProjects = filteredProjects.filter(it => includedInLatest.indexOf(it.id) !== -1)
    }
    if (_filter.indexOf('published') !== -1) {
      filteredProjects = filteredProjects.filter(it => it.publishingStatus === 'published')
    }
    setAllProjects(filteredProjects)
    setProjects(filteredProjects.slice(0, pageSize))
    setSelected([])
    setAllSelected(false)
  }
  const toggleSelectAll = () => {
    if(!allSelected){
      setSelected(allProjects.map(it => it.id))
      setAllSelected(true)
    } else {
      setSelected([])
      setAllSelected(false)
    }
  }
  const handleSelectItem = (id) => (e) => {
    e.stopPropagation()
    if(selected.indexOf(id) !== -1) {
      setSelected(selected.filter(it => it !== id))
      if(allSelected) setAllSelected(false)
    }
    else {
      setSelected([...selected, id])
      if(selected.length + 1 === allProjects.length) setAllSelected(true)
    }
  }
  const handleClickExport = () => {
    setSending(true)
    api.post('/iati_export/', {
      projects: selected,
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
  const handleClose = () => {
    setVisible(false)
    setSelected([])
  }
  return (
    <Modal
      visible={visible} onCancel={handleClose} footer={null} className="new-export-modal"
      width={800}
      title={t('New IATI Export')}
    >
      <header>
        <Checkbox checked={allSelected} onClick={toggleSelectAll} />
        <Button.Group>
          <Button onClick={() => handleChangeFilter('without-errors')} icon={filter.indexOf('without-errors') !== -1 && 'check'}>{t('Without errors')}</Button>
          <Button onClick={() => handleChangeFilter('in-last-export')} icon={filter.indexOf('in-last-export') !== -1 && 'check'}>{t('Included in last export')}</Button>
          <Button onClick={() => handleChangeFilter('published')} icon={filter.indexOf('published') !== -1 && 'check'}>{t('Published')}</Button>
        </Button.Group>
        {/* <Radio.Group size="small" value={filter} onChange={handleChangeFilter}>
          <Radio.Button value="all">{t('All projects')}</Radio.Button>
          <Radio.Button value="without-errors">{t('Without errors')}</Radio.Button>
          <Radio.Button value="in-last-export">{t('Included in last export')}</Radio.Button>
          <Radio.Button value="published">{t('Published')}</Radio.Button>
        </Radio.Group> */}
        <Button type="primary" loading={sending} onClick={handleClickExport} disabled={selected.length === 0}>{selected.length > 0 && 'Export '}{selected.length} selected</Button>
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Collapse destroyInactivePanel accordion>
        {projects.map((item, ind) =>
        <Collapse.Panel
          header={[
            <Checkbox checked={selected.indexOf(item.id) !== -1} onClick={handleSelectItem(item.id)} />,
            <div className="titles">
              <div className="meta">
                <span><Icon type="global" /> {item.publishingStatus} {item.isPublic && '& public' }</span>
                {includedInLatest.indexOf(item.id) !== -1 && <span className="included"><Icon type="check" /> {t('in last export')}</span>}
              </div>
              <div>[{item.id}] {item.title}</div>
            </div>,
            <div className="rightside">
              <div className="errors">
              {item.checksErrors.length > 0 && <span>{item.checksErrors.length} {t('errors')}</span>}
              {item.checksWarnings.length > 0 && <span>{item.checksWarnings.length} {t('warnings')}</span>}
              </div>
            </div>
          ]}
        >
          {item.checksErrors.length > 0 && [
            <h5>{t('errors')}</h5>,
            <ul>
              {item.checksErrors.map(error => {
                let ret
                try{
                  const err = JSON.parse(error)
                  if(err.model === 'result'){
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.id}`}>{t('Edit')}</a>]
                  }
                  else if (err.model === 'indicator') {
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.id}`}>{t('Edit')}</a>]
                  }
                  else if (err.model === 'indicator_period'){
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.indicator_id}/period/${err.id}`}>{t('Edit')}</a>]
                  }
                } catch(e){
                  ret = error
                }
                return <li>{ret}</li>
              })}
            </ul>
          ]}
          {item.checksWarnings.length > 0 && [
            <h5>{t('warnings')}</h5>,
            <ul>
              {item.checksWarnings.map(error => {
                let ret
                try {
                  const err = JSON.parse(error)
                  if (err.model === 'result') {
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.id}`}>{t('Edit')}</a>]
                  }
                  else if (err.model === 'indicator') {
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.id}`}>{t('Edit')}</a>]
                  }
                  else if (err.model === 'indicator_period') {
                    ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.indicator_id}/period/${err.id}`}>{t('Edit')}</a>]
                  }
                } catch (e) {
                  ret = error
                }
                return <li>{ret}</li>
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
