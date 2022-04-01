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
import { shouldShowFlag, flagOrgs } from '../../utils/feat-flags'

const Hierarchy = ({ match: { params }, program, userRdr, asProjectTab }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState(null)
  const history = useHistory()
  const projectId = params.projectId || params.programId
  const canCreateProjects = userRdr.programs && userRdr.programs.findIndex(it => it.id === Number(projectId) && it.canCreateProjects) !== -1
  const isOldVersion = userRdr?.organisations ? shouldShowFlag(userRdr.organisations, flagOrgs.NUFFIC) : false
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    } else if((item.children && item.children.length > 0) || (program && canCreateProjects)) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
  }
  const selectProgram = (item) => {
    if(item.id !== Number(projectId)){
      setLoading(true)
      setSelected([])
      history.push(`/programs/${item.id}`)
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
                // exception: do not show entire program tree if the child project is a program
                if(child.isProgram){
                  _selected[0] = child
                } else {
                  child.referenced = true
                }
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
            setPrograms([_selected[0]])
            setLoading(false)
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
  return (
    <div className={classNames('hierarchy', {noHeader: program, asProjectTab })}>
      {(!program && !asProjectTab) &&
      <div className="topbar-row">
        <h2>{t('Projects hierarchy')}</h2>
        {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />}
      </div>
      }
      {(program || asProjectTab) && loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div id="react-no-print">
      <div className="board">
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} {...{loading, selected, countryFilter}} index={-1} extra={!loading && <FilterCountry size="small" onChange={handleFilter} items={selected && selected.length > 0 && selected[0].children.map(it => [...it.locations.map(i => i.isoCode), ...it.recipientCountries.map(i => i.country.toLowerCase())].filter((value, index, self) => self.indexOf(value) === index))} />}>
          {programs.map(parent => <Card {...{countryFilter, filterCountry, isOldVersion }} isProgram onClick={() => selectProgram(parent)} project={parent} selected={(selected[0] && selected[0].id === parent.id) || Number(projectId) === parent.id} />)}
        </Column>
        }
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} loading={loading} selected={selected} index={index} countryFilter={countryFilter}>
              {program && canCreateProjects && (!selected[0].isMasterProgram || index > 0) && <div className="card create"><Link to={`/projects/new/settings?parent=${selected[index].id}&program=${selected[0].id}`}><Button icon="plus">{t('New Contributing Project')}</Button></Link></div>}
              {program && canCreateProjects && (selected[0].isMasterProgram && index === 0) && <div className="card create"><Link to={`/programs/new/editor/settings?parent=${selected[index].id}&program=${selected[0].id}`}><Button icon="plus">{t('New Program')}</Button></Link></div>}
              {col.children.filter(filterCountry).map(item => {
                let isReff = item.referenced
                const childs = selected.flatMap(s => s.children.map(c => c.id))
                if (item.referenced) {
                  if(
                    !(childs.includes(item?.parent?.id)) &&
                    !(selected.map(s => s.id).includes(item.id))
                  ){
                    isReff = false
                  }
                }
                return (
                  <Card
                    project={item}
                    onClick={() => toggleSelect(item, index)}
                    isProgram={selected[0].isMasterProgram && index === 0}
                    selected={selected[index + 1] === item}
                    isReff={isReff}
                    {...{
                      filterCountry,
                      program,
                      countryFilter,
                      canCreateProjects,
                      isOldVersion
                    }}
                  />
                )
              })}
            </Column>
          )
        })}
        {(programs.lengths > 0 && selected.length < 2) && [

        ]}
        <ColPlaceholder {...{selected}} />
      </div>
      </div>
    </div>
  )
}

const ColPlaceholder = ({ selected }) => {
  const { t } = useTranslation()
  const hasNextLevel = selected.length > 0 && selected[selected.length - 1]?.children.filter(it => it.children.length > 0).length > 0
  if(!hasNextLevel) return null
  return [
    <div className="col placeholder">
      <h3>{t('Level {{level}} projects', { level: selected.length + (selected[0].isMasterProgram ? 0 : 1) })}</h3>
      <div className="bg">
        {(selected[0].isMasterProgram && selected.length === 1) ? t('Select a programme') : t('Select a level {{level}} project with children', { level: selected.length - 1 + (selected[0].isMasterProgram ? 0 : 1) })}
      </div>
    </div>
  ]
}

export default connect(({ userRdr }) => ({ userRdr }))(Hierarchy)
