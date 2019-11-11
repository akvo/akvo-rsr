/* global window */
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

const topMargin = 6

const Column = ({ children, index, isLast, selected }) => {
  const connectorRef = useRef(null)
  const ulRef = useRef(null)
  const selectedCardRef = useRef(null)
  const nextScrollviewRef = useRef(null)
  const nextColCardsRef = useRef(null)
  const drawConnector = () => {
    if (isLast === false) {
      if (connectorRef.current) {
        const y1 = selectedCardRef.current.offsetTop + selectedCardRef.current.clientHeight / 2 - ulRef.current.parentNode.scrollTop
        const y2a = - nextScrollviewRef.current.scrollTop + nextColCardsRef.current[0].clientHeight / 2
        const y2b = - nextScrollviewRef.current.scrollTop + nextColCardsRef.current[nextColCardsRef.current.length - 1].offsetTop + nextColCardsRef.current[nextColCardsRef.current.length - 1].clientHeight / 2
        const A = (y1 < y2a ? y1 : y2a) + topMargin
        const B = (y1 > y2b ? y1 : y2b) + topMargin
        const colHeight = window.innerHeight - 177
        const top = A < 0 ? 0 : A
        const height = B - top > colHeight ? colHeight : B - top
        connectorRef.current.style.top = `${top}px`
        connectorRef.current.style.height = `${height}px`
      }
    }
  }
  const handleScroll = ({ target }) => {
    if (target.scrollTop > 10 && !target.parentNode.previousSibling.previousSibling.classList.contains('on')) {
      target.parentNode.previousSibling.previousSibling.classList.add('on')
    } else if (target.scrollTop < 10 && target.parentNode.previousSibling.previousSibling.classList.contains('on')) {
      target.parentNode.previousSibling.previousSibling.classList.remove('on')
    }
    if(!isLast) drawConnector()
  }
  useEffect(() => {
    if(isLast === false){
      if(connectorRef.current){
        selectedCardRef.current = ulRef.current.getElementsByClassName('selected')[0]
        if (ulRef.current.parentNode.parentNode.parentNode.nextSibling){
          nextScrollviewRef.current = ulRef.current.parentNode.parentNode.parentNode.nextSibling.getElementsByClassName('scrollview')[0]
          nextColCardsRef.current = nextScrollviewRef.current.getElementsByClassName('card')
          drawConnector()
          nextScrollviewRef.current.removeEventListener('scroll', drawConnector)
          nextScrollviewRef.current.addEventListener('scroll', drawConnector)
        }
      }
    }
  }, [isLast, selected])
  return (
    <div className="col" style={{ zIndex: 999 - index }}>
      <div className="shade" />
      <h3>Level {index + 1} projects</h3>
      <div className="inner">
        <div className="scrollview" onScroll={handleScroll}>
          <ul ref={ulRef}>
          {children}
          </ul>
        </div>
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
        {/* {programs.length > 0 &&
        <div className="col">
          <h3>Programs</h3>
          <div className="scrollview">
            <ul>
              {programs.map(parent => <Card project={parent} selected={selected[0] && selected[0].id === parent.id} />)}
            </ul>
          </div>
        </div>
        } */}
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} selected={selected} index={-1}>
          {programs.map(parent => <Card project={parent} selected={selected[0] && selected[0].id === parent.id} />)}
        </Column>
        }
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} selected={selected} index={index}>
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
