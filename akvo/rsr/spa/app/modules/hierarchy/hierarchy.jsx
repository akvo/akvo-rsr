import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Spin, Icon, Button } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import './styles.scss'
import api from '../../utils/api'
import Column from './column'
import Card from './card'
import FilterCountry from '../projects/filter-country'

const Hierarchy = ({ match: { params }, program, userRdr }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState(null)
  const history = useHistory()
  const { isAdmin } = userRdr
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    } else if((item.children && item.children.length > 0) || (program && isAdmin)) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
  }
  const projectId = params.projectId || params.programId
  const selectProgram = (item) => {
    if(item.id !== Number(projectId)){
      setLoading(true)
      setSelected([])
      history.push(`/hierarchy/${item.id}`)
    }
  }
  const [programs, setPrograms] = useState([])
  useEffect(() => {
    if (projectId) {
      api.get(`/project_hierarchy/${projectId}`)
        .then(({ data }) => {
          const _selected = [data]
          if(projectId !== data.id){
            // find and select the child project
            data.children.forEach(child => {
              if(child.id === Number(projectId)){
                child.referenced = true
              } else if(child.children) {
                child.children.forEach(grandchild => {
                  if(grandchild.id === Number(projectId)){
                    _selected.push(child)
                    child.referenced = true
                    grandchild.referenced = true
                  } else if(grandchild.children){
                    grandchild.children.forEach(ggrandchild => {
                      if (ggrandchild.id === Number(projectId)) {
                        _selected.push(child)
                        _selected.push(grandchild)
                        child.referenced = true
                        grandchild.referenced = true
                        ggrandchild.referenced = true
                      }
                    })
                  }
                })
              }
            })
          }
          setSelected(_selected)
          if(programs.length === 0){
            setPrograms([data])
            if(program){
              setLoading(false)
            } else {
              api.get('/project_hierarchy/?limit=50')
              .then(({ data: { results } }) => {
                setPrograms([data, ...results.filter((it) => it.id !== data.id)])
                setLoading(false)
              })
            }
          } else {
            // replace program to allow filtering children in card
            const index = programs.findIndex(it => it.id === data.id)
            if(index !== -1){
              setPrograms([...programs.slice(0, index), data, ...programs.slice(index + 1)])
            }
            setLoading(false)
          }
        })
    }
  }, [projectId])
  const filterCountry = (item) => countryFilter == null ? true : (item.locations.findIndex(it => it.isoCode === countryFilter) !== -1 || item.recipientCountries.findIndex(it => it.country.toLowerCase() === countryFilter) !== -1)
  const handleFilter = (country) => {
    setCountryFilter(country)
    // clear selection which falls out of filter
    if(country != null){
      for (let i = 1; i < selected.length; i += 1){
        if(selected[i].locations.findIndex(it => it.isoCode === country) === -1 || selected[i].recipientCountries.findIndex(it => it.country.toLowerCase() === country) !== -1){
          setSelected(selected.slice(0, i))
          break
        }
      }
    }
  }
  const hasSecondLevel = selected.length > 0 && selected[0].children.filter(it => it.children.length > 0).length > 0
  const showNewFeature = userRdr && userRdr.organisations && userRdr.organisations.findIndex(it => it.id === 42) !== -1
  return (
    <div className={classNames('hierarchy', {noHeader: program})}>
      {!program &&
      <div className="topbar-row">
        <h2>{t('Projects hierarchy')}</h2>
        {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />}
      </div>
      }
      {program && loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div id="react-no-print">
      <div className="board">
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} loading={loading} selected={selected} index={-1} countryFilter={countryFilter} extra={!loading && <FilterCountry size="small" onChange={handleFilter} items={selected && selected.length > 0 && selected[0].children.map(it => [...it.locations.map(i => i.isoCode), ...it.recipientCountries.map(i => i.country.toLowerCase())].filter((value, index, self) => self.indexOf(value) === index))} />}>
          {programs.map(parent => <Card countryFilter={countryFilter} onClick={() => selectProgram(parent)} project={parent} selected={(selected[0] && selected[0].id === parent.id) || Number(projectId) === parent.id} filterCountry={filterCountry} />)}
        </Column>
        }
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} loading={loading} selected={selected} index={index} countryFilter={countryFilter}>
              {col.children.filter(filterCountry).map(item =>
                <Card project={item} onClick={() => toggleSelect(item, index)} selected={selected[index + 1] === item} {...{ filterCountry, program, countryFilter, isAdmin }} />
              )}
              {program && isAdmin && showNewFeature && <div className="card create"><Link to={`/projects/new/settings?parent=${selected[index].id}&program=${selected[0].id}`}><Button icon="plus">{t('New Contributing Project')}</Button></Link></div>}
            </Column>
          )
        })}
        {(programs.length > 0 && selected.length < 2 && hasSecondLevel) &&
        <div className="col">
          <h3>{t('Level {{level}} projects', { level: selected.length + 1})}</h3>
          <div className="bg">
            {t('Select a level {{level}} project with children', { level: selected.length})}
          </div>
        </div>
        }
      </div>
      </div>
      {/* <div id="print-mount">
        {selected[0] &&
        <PrintTemplate>
          <Branch item={selected[0]} level={0} />
        </PrintTemplate>
        }
      </div> */}
    </div>
  )
}

export default connect(({ userRdr }) => ({ userRdr }))(Hierarchy)
