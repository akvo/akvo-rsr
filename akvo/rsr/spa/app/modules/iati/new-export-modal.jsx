import React, { useEffect, useState, useRef } from 'react'
import { Modal, Collapse, Icon, Pagination, Checkbox, Button, Spin, Alert, Input, Select, DatePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import api from '../../utils/api'

const { Option } = Select

const pageSize = 30
const eutfAfrica = 3394
let tmid

const isProjectExportable = (project, currentOrg) => (project.publishingStatus === 'published' && (currentOrg === eutfAfrica || project.checksErrors.length === 0)) // EUTF Africa can export with errors
const getExportableProjects = (projects, currentOrg) => projects.filter(it => isProjectExportable(it, currentOrg))

const ProblematicItems = ({type, project, items}) => {
  const { t } = useTranslation()
  return (
    <>
      <h5>{t(type)}</h5>
      <ul>
        {items.map(error => {
          let ret
          try {
            const err = JSON.parse(error)
            if (err.model === 'budget') {
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/finance#/budget/${err.id}`}>{t('Edit')}</a>]
            } else if (err.model === 'transaction') {
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/finance#/transaction/${err.id}`}>{t('Edit')}</a>]
            } else if (err.model === 'result') {
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/results-n-indicators#/result/${err.id}`}>{t('Edit')}</a>]
            }
            else if (err.model === 'indicator') {
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.id}`}>{t('Edit')}</a>]
            }
            else if (err.model === 'indicator_period') {
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.indicator_id}/period/${err.id}`}>{t('Edit')}</a>]
            }
            else if (err.model === 'indicator_reference'){
              ret = [err.message, <br />, <a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${project.id}/results-n-indicators#/result/${err.result_id}/indicator/${err.indicator_id}`}>{t('Edit')}</a>]
            }
          } catch (e) {
            ret = error
          }
          return <li>{ret}</li>
        })}
      </ul>
    </>
  )
}

const DateRange = ({startPlaceholder, endPlaceholder, onStartChange, onEndChange}) => {
  const [startValue, setStartValue] = useState()
  const [endValue, setEndValue] = useState()

  const disableStartDate = (date) => {
    if (!date || !endValue) {
      return false
    }
    return date.valueOf() > endValue.valueOf()
  }
  const disableEndDate = (date) => {
    if (!date || !startValue) {
      return false
    }
    return date.valueOf() <= startValue.valueOf()
  }

  return (
    <div className="daterange">
      <DatePicker
        placeholder={startPlaceholder}
        format="DD/MM/YYYY"
        value={startValue}
        onChange={date => {
          setStartValue(date)
          onStartChange(date)
        }}
        disabledDate={disableStartDate}
      />
      <DatePicker
        placeholder={endPlaceholder}
        format="DD/MM/YYYY"
        value={endValue}
        onChange={date => {
          setEndValue(date)
          onEndChange(date)
        }}
        disabledDate={disableEndDate}
      />
    </div>
  )
}

const NewExportModal = ({ visible, setVisible, currentOrg, userId, addExport }) => {
  const { t } = useTranslation()
  const STATUS_OPTIONS = [
    { value: '1', label: t('Identification') },
    { value: '2', label: t('Implementation') },
    { value: '3', label: t('Completion') },
    { value: '4', label: t('Post-completion') },
    { value: '5', label: t('Canceled') },
    { value: '6', label: t('Suspended') }
  ]
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
  const [src, setSrc] = useState('')
  const [status, setStatus] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const handlPageChange = (page) => {
    setProjects(allProjects.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize))
    setCurrentPage(page)
  }
  const updateFilters = (_filter, _src, _status, _startDate, _endDate) => {
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
    if(_src !== ''){
      filteredProjects = filteredProjects.filter(it => {
        return String(it.id) === _src || it.title.toLowerCase().indexOf(_src.toLowerCase()) !== -1
      })
    }
    if (_status) {
      filteredProjects = filteredProjects.filter(it => it.iatiStatus === _status)
    }
    if (_startDate) {
      filteredProjects = filteredProjects.filter(it => {
        if (!it.startDate) {
          return false
        }
        return it.startDate.diff(_startDate) >= 0
      })
    }
    if (_endDate) {
      filteredProjects = filteredProjects.filter(it => {
        if (!it.endDate) {
          return false
        }
        return it.endDate.diff(_endDate) <= 0
      })
    }
    setAllProjects(filteredProjects)
    setProjects(filteredProjects.slice(0, pageSize))
    setAllSelected(false)
  }
  const handleChangeFilter = (value) => {
    const _filter = filter.indexOf(value) === -1 ? [...filter, value] : filter.filter(it => it !== value)
    setFilter(_filter)
    updateFilters(_filter, src, status, startDate, endDate)
  }
  const handleSrcChange = ({target: {value}}) => {
    setSrc(value)
    clearTimeout(tmid)
    tmid = setTimeout(() => {
      updateFilters(filter, value, status, startDate, endDate)
    }, 300)
  }
  const handleStatusChange = (value) => {
    setStatus(value)
    updateFilters(filter, src, value, startDate, endDate)
  }
  const handleStartDateChange = (value) => {
    setStartDate(value)
    updateFilters(filter, src, status, value, endDate)
  }
  const handleEndDateChange = (value) => {
    setEndDate(value)
    updateFilters(filter, src, status, startDate, value)
  }
  const toggleSelectAll = () => {
    if(!allSelected){
      setSelected(getExportableProjects(allProjects, currentOrg).map(it => it.id))
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
  const warnMessage = currentOrg === eutfAfrica ? t('Only published projects can be exported') : t('Only published projects without errors can be exported')

  useEffect(() => {
    if (visible) {
      setLoading(true)
      setAllProjects([])
      setProjects([])
      // get latest org first
      api.get(`/iati_export/?reporting_organisation=${currentOrg}&ordering=-id&latest=True`)
        .then(({ data: { results } }) => {
          let _includedInLatest = includedInLatest
          if (results?.length > 0) {
            _includedInLatest = results[0].projects
            setIncludedInLatest(_includedInLatest)
          } else {
            // no latest file
          }
          // proceed with fetching all projects
          api.get('/project_iati_export/', { reporting_org: currentOrg, limit: 6000 })
            .then(({ data: { results: exports } }) => {
              unfilteredProjects.current = exports.map(it => {
                it.startDate = it.dateStartActual ? moment(it.dateStartActual, 'DD/MM/YYYY') : null
                it.endDate = it.dateEndActual ? moment(it.dateEndActual, 'DD/MM/YYYY') : null
                return it
              })
              updateFilters(filter, src, status, startDate, endDate)
              setLoading(false)
            })
        })
      prevOrg.current = currentOrg
    }
  }, [currentOrg, visible])

  return (
    <Modal
      visible={visible} onCancel={handleClose} footer={null} className="new-export-modal"
      width={960}
      title={t('New IATI Export')}
    >
      <div>
        <div className="filters">
          <div>
            <Input.Search value={src} onChange={handleSrcChange} placeholder={t('Find a project...')} allowClear />
            <Button.Group>
              <Button onClick={() => handleChangeFilter('without-errors')} icon={filter.indexOf('without-errors') !== -1 && 'check'}>{t('Without errors')}</Button>
              <Button onClick={() => handleChangeFilter('published')} icon={filter.indexOf('published') !== -1 && 'check'}>{t('Published')}</Button>
              <Button onClick={() => handleChangeFilter('in-last-export')} icon={filter.indexOf('in-last-export') !== -1 && 'check'}>{t('Included in last export')}</Button>
            </Button.Group>
          </div>
          <div>
            <Select
              showSearch
              allowClear
              placeholder={t('Project status')}
              onChange={handleStatusChange}
            >
              {STATUS_OPTIONS.map(it => <Option key={it.value} value={it.value}>{t(it.label)}</Option>)}
            </Select>
            <DateRange
              startPlaceholder={t('Project start date')}
              endPlaceholder={t('Project end date')}
              onStartChange={handleStartDateChange}
              onEndChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      <p />
      {((currentOrg !== eutfAfrica && filter.indexOf('without-errors') === -1) || filter.indexOf('published') === -1) &&
        <><Alert message={warnMessage} type="info" showIcon /><p /></>
      }
      <header>
        <Checkbox checked={allSelected} onClick={toggleSelectAll} />
        <Button type="primary" loading={sending} onClick={handleClickExport} disabled={selected.length === 0}>{selected.length > 0 ? t('Export {{N}} selected', { N: selected.length}) : t('0 selected')}</Button>
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Collapse destroyInactivePanel accordion>
        {projects.map((item, ind) =>
        <Collapse.Panel
          header={[
            <Checkbox disabled={!isProjectExportable(item, currentOrg)} checked={selected.indexOf(item.id) !== -1} onClick={handleSelectItem(item.id)} />,
            <div className="titles">
              <div className="meta">
                <span><Icon type="global" />&nbsp;
                  {!item.isPublic && t(item.publishingStatus)}
                  {(item.publishingStatus === 'published' && item.isPublic) && t('published & public')}
                  {(item.publishingStatus === 'unpublished' && item.isPublic) && t('unpublished & public')}
                </span>
                {includedInLatest.indexOf(item.id) !== -1 && <span className="included"><Icon type="check" /> {t('in last export')}</span>}
              </div>
              <div>[<a target="_blank" rel="noopener noreferrer" href={`/my-rsr/projects/${item.id}`}>{item.id}</a>] {item.title}</div>
            </div>,
            <div className="rightside">
              <div className="errors">
              {item.checksErrors.length > 0 && <span className="error">{item.checksErrors.length} {t('errors')}</span>}
              {item.checksWarnings.length > 0 && <span className="warning">{item.checksWarnings.length} {t('warnings')}</span>}
              </div>
            </div>
          ]}
        >
          {item.checksErrors.length > 0 && <ProblematicItems type="errors" project={item} items={item.checksErrors} />}
          {item.checksWarnings.length > 0 && <ProblematicItems type="warnings" project={item} items={item.checksWarnings} />}
        </Collapse.Panel>
        )}
      </Collapse>
      <Pagination current={currentPage} onChange={handlPageChange} total={allProjects.length} pageSize={pageSize} />
    </Modal>
  )
}

export default NewExportModal
