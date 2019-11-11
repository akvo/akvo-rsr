import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { Icon, Spin } from 'antd'

import './styles.scss'
import api from '../../utils/api'

const Card = ({ project, selected, onClick }) => {
  const childrenCount = project.childrenCount ? project.childrenCount : (project.children ? project.children.length : -1)
  const { locations, title, subtitle } = project
  return (
    <li className={classNames('card', { selected })} onClick={onClick}>{/* eslint-disable-line */}
      <h4>{title ? title : 'Untitled project'}</h4>
      {subtitle && <p>{subtitle}</p>}
      <div className="footer">
        {locations && <div className="countries"><div className="inner"><Icon type="environment" /><span>{locations.filter((item, index) => locations.findIndex(it => it.country === item.country) === index && item).map(it => it.country).join(', ')}</span></div></div>}
        {childrenCount > 0 && <div className="children"><div className="inner"><b>{childrenCount}</b> <span>child projects</span></div></div>}
      </div>
    </li>
  )
}

const Column = ({ children, index, isLast }) => {
  const connectorRef = useRef(null)
  const ulRef = useRef(null)
  const handleScroll = ({ target }) => {
    if (target.scrollTop > 10 && !target.previousSibling.previousSibling.classList.contains('on')) {
      target.previousSibling.previousSibling.classList.add('on')
    } else if (target.scrollTop < 10 && target.previousSibling.previousSibling.classList.contains('on')) {
      target.previousSibling.previousSibling.classList.remove('on')
    }
  }
  useEffect(() => {
    console.log('col', index, isLast)
    if(isLast === false){
      if(connectorRef.current){
        // console.log(ulRef.current)
        const $selected = ulRef.current.getElementsByClassName('selected')
        // console.log($selected)
        if($selected.length > 0){
          const height = 100
          const offsetTop = $selected[0].offsetTop + 70 + 5
          connectorRef.current.style.height = `${height}px`
          connectorRef.current.style.top = `${offsetTop - height}px`
        }
        // connectorRef.current.style.top =
      }
    }
  }, [isLast])
  return (
    <div className="col" style={{ zIndex: 999 - index }}>
      <div className="shade" />
      <h3>Level {index + 1} projects</h3>
      <div className="scrollview" onScroll={handleScroll}>
        <ul ref={ulRef}>
        {children}
        </ul>
        <div className="connector" ref={connectorRef} />
      </div>
    </div>
  )
}

const Hierarchy = ({ match: { params } }) => {
  const [selected, setSelected] = useState([])
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    } else if(item.children && item.children.length > 0) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
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
          setPrograms([rootProgram])
          api.get('/project_hierarchy/?limit=50')
            .then(({ data: { results } }) => {
              setPrograms([rootProgram, ...results])
            })
        })
    }
  }, [])
  return (
    <div className="hierarchy">
      <h2>Projects hierarchy</h2>
      <div className="board">
        {programs.length === 0 && <Spin size="large" />}
        {programs.length > 0 &&
        <div className="col">
          <h3>Programs</h3>
          <div className="scrollview">
            <ul>
              {programs.map(parent => <Card project={parent} selected={selected[0] && selected[0].id === parent.id} />)}
            </ul>
          </div>
        </div>
        }
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} index={index}>
              {col.children.map(item =>
                <Card project={item} onClick={() => toggleSelect(item, index)} selected={selected[index + 1] === item} />
              )}
            </Column>
          )
        })}
        {programs.length > 0 &&
        <div className="col">
          <h3>Level {selected.length + 1} projects</h3>
          <div className="bg">
            Select a level {selected.length} project with children
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Hierarchy
