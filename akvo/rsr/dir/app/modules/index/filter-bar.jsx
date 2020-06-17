/* global window */
import React, { useState, useRef, useEffect} from 'react'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import { useSpring, animated } from 'react-spring'
import { Button, Icon } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import filterSvg from '../../images/filter.svg'
import tr from '../../images/tr.svg'

const pageSize = 50

const FilterBar = ({ onSetFilter, filters, geoFilteredProjects }) => {
  const [open, setOpen] = useState(false)
  const [subIndex, setSubIndex] = useState([])
  const [step, setStep] = useState(0)
  const subRef = useRef([])
  const [height, setHeight] = useState(filters.length * 42)
  const props = useSpring({ marginLeft: step * -360, height })
  const _setSubIndex = (index) => {
    setSubIndex([...subIndex, index])
    setStep(step + 1)
    setTimeout(() => {
      if (subRef.current.length > 0){
        let _height = subRef.current[subRef.current.length - 1].clientHeight + 45
        if(_height > window.innerHeight - 100) { _height = window.innerHeight - 100 }
        setHeight(_height)
      }
    }, 50)
  }
  const setFilter = (opt, optIndex) => {
    if(opt.options) {
      // sub-sub menu
      _setSubIndex(optIndex)
    } else {
      onSetFilter(subIndex, optIndex)
    }
  }
  const back = () => {
    setStep(step - 1)
    subRef.current.pop()
    if (subRef.current.length > 0) setHeight(subRef.current[subRef.current.length - 1].clientHeight + 45)
    else setHeight(filters.length * 42)
    setTimeout(() => setSubIndex(subIndex.slice(0, subIndex.length - 1)), 300)
  }
  const goto = (index) => {
    const stepsDiff = step - index
    for(let i = 0; i < stepsDiff; i += 1){
      subRef.current.pop()
    }
    if (step - stepsDiff > 0) {
      setHeight(subRef.current[index - 1].clientHeight + 45)
      setTimeout(() => setSubIndex(subIndex.slice(0, index)), 300)
    }
    else {
      setHeight(filters.length * 42)
      setTimeout(() => setSubIndex([]), 300)
    }
    setStep(index)
  }
  const close = () => {
    setOpen(false)
    subRef.current = []
    setTimeout(() => {
      setStep(0)
      setSubIndex([])
      setHeight(filters.length * 42)
    }, 300)
  }
  const toggle = () => {
    if(!open) setOpen(true)
    else close()
  }
  const handleSubRef = (index) => (ref) => { if (ref && index < step) subRef.current[index] = ref }
  return [
    <div className={classNames('filters-btn', { open })} onClick={toggle} role="button" tabIndex="-1">
      <SVGInline svg={filterSvg} /> Filter projects
    </div>,
    <TransitionGroup component={null}>
      {open &&
        <CSSTransition
          key="prj"
          timeout={500}
          classNames="dropdown"
        >
          <div className="filters-dropdown">
            <div className="hider">
              <animated.div className="holder" style={props}>
                <div>
                  <ul>
                  {filters.map((filter, index) => <li onClick={() => _setSubIndex(index)}>{filter.name} <div>{filter.selected.length > 0 && <div className="selected">{filter.selected.length} selected</div>} <Icon type="right" /></div></li>)}
                  </ul>
                </div>
                {subIndex.map((index, inIndex) => {
                  return <OptionList {...{ subIndex, inIndex, goto, back, subRef, handleSubRef, geoFilteredProjects, filters, setFilter}} />
                })}
              </animated.div>
            </div>
          </div>
        </CSSTransition>
      }
    </TransitionGroup>,
    open && <div className="filters-dropdown-bg" onClick={close} />
  ]
}

const OptionList = ({ subIndex, inIndex, goto, back, handleSubRef, geoFilteredProjects, filters, setFilter }) => {
  const [hasMore, setHasMore] = useState(false)
  const [trickie, setTrickie] = useState(0)
  const [visibleItems, setVisibleItems] = useState([])
  const scrollRef = useRef()
  const allowShowMore = useRef(true)
  let options = filters[subIndex[0]].options
  let sub = filters[subIndex[0]]
  for (let i = 1; i <= inIndex; i += 1) {
    sub = options[subIndex[i]]
    options = options[subIndex[i]].options
  }
  useEffect(() => {
    setVisibleItems(options.slice(0, pageSize))
    setHasMore(options.length > pageSize)
  }, [])
  const showMore = (page) => {
    if (allowShowMore.current) {
      setVisibleItems([...visibleItems, ...options.slice(page * pageSize, page * pageSize + pageSize)])
      setHasMore(options.length > page * pageSize + pageSize)
      allowShowMore.current = false
      setTimeout(() => { allowShowMore.current = true; setTrickie(trickie + 1) }, 1000)
    }
  }
  return (
    <div className="sub" ref={(ref) => { if (ref) { scrollRef.current = ref.parentNode.parentNode } }}>
      {inIndex < 1 &&
        <div className="top">
          <Button type="link" icon="left" onClick={back}>Filters</Button>
          {sub.selected && sub.selected.length > 0 &&
            <div className="selected">
              {sub.selected.length} selected
            </div>
          }
        </div>
      }
      {inIndex >= 1 &&
        <div className="top breadcrumbs">
          <div className="step" onClick={() => goto(0)}><div className="text">Filters</div></div>
          {subIndex.map((_index, _inIndex) => {
            let _options = filters[subIndex[0]].options
            let _sub = filters[subIndex[0]]
            for (let i = 1; i <= _inIndex; i += 1) {
              _sub = _options[subIndex[i]]
              _options = _options[subIndex[i]].options
            }
            return <div className="step" onClick={_inIndex < subIndex.length - 1 ? () => goto(_inIndex + 1) : null}><SVGInline svg={tr} /><div className="text">{_sub.name}</div></div>
          })}
        </div>
      }
      <ul ref={handleSubRef(inIndex)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={showMore}
          threshold={250}
          hasMore={hasMore}
          loader={null}
          useWindow={false}
          getScrollParent={() => scrollRef.current}
          trickie={trickie} // tricking this comp that there's been an update
        >
        {visibleItems && visibleItems.map((opt, optIndex) => {
          let items = -1
          if (sub.id === 'sectors') items = geoFilteredProjects.filter(item => filters[1].selected.length === 0 ? true : filters[1].selected.map(ind => item.organisations.indexOf(filters[1].options[ind].id) !== -1).indexOf(true) !== -1).filter(item => item.sectors.indexOf(opt.id) !== -1).length
          if (sub.id === 'orgs') items = geoFilteredProjects.filter(item => filters[0].selected.length === 0 ? true : filters[0].selected.map(ind => item.sectors.indexOf(filters[0].options[ind].id) !== -1).indexOf(true) !== -1).filter(item => item.organisations.indexOf(opt.id) !== -1).length
          return (
            <li className={classNames({ selected: sub.selected.indexOf(optIndex) !== -1, hidden: items === 0 })} onClick={() => setFilter(opt, optIndex)}>
              {opt.name}
              {items > 0 && <span>&nbsp;({items})</span>}
              {opt.options && <div><Icon type="right" /></div>}
            </li>
          )
        })}
        </InfiniteScroll>
      </ul>
    </div>
  )
}

export default FilterBar
