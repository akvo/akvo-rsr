/* global window */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
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
          setSelected([data])
          const { status, title, subtitle, id, isPublic, absoluteUrl } = data
          const rootProgram = { status, title, subtitle, id, isPublic, absoluteUrl }
          if(programs.length === 0){
            setPrograms([rootProgram])
            api.get('/project_hierarchy/?limit=50')
            .then(({ data: { results } }) => {
              setPrograms([rootProgram, ...results.filter((it) => it.id !== rootProgram.id)])
              setLoading(false)
            })
          } else {
            setLoading(false)
          }
        })
    }
  }, [params.projectId])
  const handleFilter = (country) => {
    console.log(country)
  }
  return (
    <div className="hierarchy">
      <div className="topbar-row">
        <h2>Projects hierarchy</h2>
        <div className="filters">
          <span>Filter:</span>
          <FilterCountry onChange={handleFilter} />
        </div>
      </div>
      <div id="react-no-print">
      <div className="board">
        {loading && <Spin size="large" />}
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} loading={loading} selected={selected} index={-1}>
          {programs.map(parent => <Card onClick={() => selectProgram(parent)} project={parent} selected={selected[0] && selected[0].id === parent.id} />)}
        </Column>
        }
        {!loading && selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} loading={loading} selected={selected} index={index}>
              {col.children.map(item =>
                <Card project={item} onClick={() => toggleSelect(item, index)} selected={selected[index + 1] === item} />
              )}
            </Column>
          )
        })}
        {(programs.length && !loading) > 0 &&
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
