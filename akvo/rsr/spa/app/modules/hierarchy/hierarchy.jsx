import React, { useState, useEffect } from 'react'
import { Spin, Icon } from 'antd'
import { useHistory } from 'react-router-dom'
import PrintTemplate from 'react-print'

import './styles.scss'
import api from '../../utils/api'
import Column from './column'
import Branch from './branch'
import Card from './card'
import FilterCountry from '../projects/filter-country'

const Hierarchy = ({ match: { params } }) => {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState(null)
  const history = useHistory()
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    } else if(item.children && item.children.length > 0) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
  }
  const selectProgram = (item) => {
    if(item.id !== Number(params.projectId)){
      setLoading(true)
      setSelected([])
      history.push(`/hierarchy/${item.id}`)
    }
  }
  const [programs, setPrograms] = useState([])
  useEffect(() => {
    if (params.projectId) {
      api.get(`/project_hierarchy/${params.projectId}`)
        .then(({ data }) => {
          const _selected = [data]
          if(params.projectId !== data.id){
            // find and select the child project
            data.children.forEach(child => {
              if(child.id === Number(params.projectId)){
                child.referenced = true
              } else if(child.children) {
                child.children.forEach(grandchild => {
                  if(grandchild.id === Number(params.projectId)){
                    _selected.push(child)
                    child.referenced = true
                    grandchild.referenced = true
                  }
                })
              }
            })
          }
          setSelected(_selected)
          if(programs.length === 0){
            setPrograms([data])
            api.get('/project_hierarchy/?limit=50')
            .then(({ data: { results } }) => {
              setPrograms([data, ...results.filter((it) => it.id !== data.id)])
              setLoading(false)
            })
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
  }, [params.projectId])
  const filterCountry = (item) => countryFilter == null ? true : (item.locations.findIndex(it => it.isoCode === countryFilter) !== -1)
  const handleFilter = (country) => {
    setCountryFilter(country)
    // clear selection which falls out of filter
    if(country != null){
      for (let i = 1; i < selected.length; i += 1){
        if(selected[i].locations.findIndex(it => it.isoCode === country) === -1){
          setSelected(selected.slice(0, i))
          break
        }
      }
    }
  }
  return (
    <div className="hierarchy">
      <div className="topbar-row">
        <h2>Projects hierarchy</h2>
        {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />}
        <div className="filters">
          <span>Filter:</span>
          <FilterCountry onChange={handleFilter} />
        </div>
      </div>
      <div id="react-no-print">
      <div className="board">
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} loading={loading} selected={selected} index={-1} countryFilter={countryFilter}>
          {programs.map(parent => <Card countryFilter={countryFilter} onClick={() => selectProgram(parent)} project={parent} selected={(selected[0] && selected[0].id === parent.id) || Number(params.projectId) === parent.id} filterCountry={filterCountry} />)}
        </Column>
        }
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} loading={loading} selected={selected} index={index} countryFilter={countryFilter}>
              {col.children.filter(filterCountry).map(item =>
                <Card countryFilter={countryFilter} project={item} onClick={() => toggleSelect(item, index)} selected={selected[index + 1] === item} filterCountry={filterCountry} />
              )}
            </Column>
          )
        })}
        {(programs.length > 0 && selected.length < 2) &&
        <div className="col">
          <h3>Level {selected.length + 1} projects</h3>
          <div className="bg">
            Select a level {selected.length} project with children
          </div>
        </div>
        }
      </div>
      </div>
      <div id="print-mount">
        {selected[0] &&
        <PrintTemplate>
          <Branch item={selected[0]} level={0} />
        </PrintTemplate>
        }
      </div>
    </div>
  )
}

export default Hierarchy
