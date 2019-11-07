import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'

import './styles.scss'

const parents = [
  {
    title: 'Parent program',
    subtitle: 'Something long for a subtitle goes here and on two lines at least maybe three',
    id: 12,
    childrenCount: 5
  }
]
const data = [
  {
    title: 'parent program',
    id: 12,
    children: [
      {
        title: 'some title',
        id: 4
      },
      {
        title: 'some title',
        id: 412
      },
      {
        title: 'blah',
        id: 5,
        children: [
          {
            id: 101,
            title: 'Something',
            countries: ['UK'],
            children: [
              {
                id: 111,
                title: 'Knight\'s tale'
              }
            ]
          },
          {
            id: 102,
            title: 'Something',
            countries: ['UK']
          }
        ]
      },
      {
        title: 'trih',
        id: 6
      },
      {
        title: 'svetih',
        id: 7
      },
      {
        id: 2,
        title: 'Project title',
        subtitle: 'project subtitle',
        countries: ['India', 'Indonesia'],
        children: [
          {
            id: 3,
            title: 'Project title',
            subtitle: 'project subtitle',
            countries: ['Netherlands'],
          },
          {
            id: 31,
            title: 'Project title',
            subtitle: 'project subtitle',
            countries: ['Netherlands'],
          },
          {
            id: 32,
            title: 'Project title 2',
            subtitle: 'project subtitle',
            countries: ['Netherlands'],
          },
          {
            id: 33,
            title: 'Project title 3',
            subtitle: 'project subtitle',
            countries: ['Netherlands'],
          },
          {
            id: 34,
            title: 'Project title 3',
            subtitle: 'project subtitle',
            countries: ['Netherlands'],
          }
        ]
      },
      {
        title: 'svetih 2',
        id: 712
      }
    ]
  }
]

const Card = ({ project, selected, onClick }) => {
  const childrenCount = project.childrenCount ? project.childrenCount : (project.children ? project.children.length : -1)
  return (
    <li className={classNames('card', { selected })} onClick={onClick}>{/* eslint-disable-line */}
      <h4>{project.title}</h4>
      {project.subtitle && <p>{project.subtitle}</p>}
      {project.countries && <div className="countries"><Icon type="environment" /><span>{project.countries.join(', ')}</span></div>}
      {childrenCount !== -1 && <div className="children"><b>{childrenCount}</b> <span>child projects</span></div>}
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

const Hierarchy = () => {
  const [selected, setSelected] = useState([data[0], data[0].children[5]])
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    } else if(item.children) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
  }
  return (
    <div className="hierarchy">
      <h2>Projects hierarchy</h2>
      <div className="board">
        <div className="col">
          <h3>Programs</h3>
          <div className="scrollview">
            <ul>
              {parents.map(parent => <Card project={parent} selected={selected[0].id === parent.id} />)}
            </ul>
          </div>
        </div>
        {selected.map((col, index) => {
          return (
            <Column isLast={index === selected.length - 1} index={index}>
              {col.children.map(item =>
                <Card project={item} onClick={() => toggleSelect(item, index)} selected={selected[index + 1] === item} />
              )}
            </Column>
          )
        })}
        <div className="col">
          <h3>Level {selected.length + 1} projects</h3>
          <div className="bg">
            Select a level {selected.length} project with children
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hierarchy
