import React, { useState } from 'react'
import classNames from 'classnames'

import './styles.scss'

const parents = [
  {
    title: 'Parent program',
    id: 12
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
          }
        ]
      }
    ]
  }
]

const Hierarchy = () => {
  const [selected, setSelected] = useState([data[0], data[0].children[4]])
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
      // setSelected([...selected.slice(0, colIndex), selected[colIndex].filter((it, index) => index !== itemIndex), ...selected.slice(colIndex + 1)])
    } else if(item.children) {
      // if(selected[colIndex]) _selected = selected.slice(0, colIndex + 1)
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
              {parents.map(parent =>
              <li className={classNames('card', {selected: selected[0].id === parent.id})}>
                <h4>{parent.title}</h4>
                <div className="children">{data.length} child projects</div>
              </li>
              )}
            </ul>
          </div>
        </div>
        {selected.map((col, index) => {
          return (
            <div className={classNames('col', {rightBorder: index < selected.length - 1})} style={{ zIndex: 999 - index }}>
              <h3>Level {index + 1} projects</h3>
              <div className="scrollview">
                <ul>
                  {col.children.map(item =>
                    <li onClick={() => toggleSelect(item, index)} className={classNames('card', { selected: selected[index + 1] === item })}>{/* eslint-disable-line */}
                      <h4>{item.title}</h4>
                      <div className="countries">Guinea</div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
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
