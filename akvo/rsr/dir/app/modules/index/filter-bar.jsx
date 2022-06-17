/* global window */
import React, { useState, useRef, useEffect} from 'react'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import { useSpring, animated } from 'react-spring'
import { Button, Icon, Input } from 'antd'
// import InfiniteScroll from 'react-infinite-scroller'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import filterSvg from '../../images/filter.svg'
import tr from '../../images/tr.svg'

const pageSize = 50
const { Search } = Input
let tmid

const FilterBar = ({ onSetFilter, filters, geoFilteredProjects }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [subIndex, setSubIndex] = useState([])
  const [step, setStep] = useState(0)
  const subRef = useRef([])
  const hiderRef = useRef()
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
  const setFilter = (opt, optIndex, sub) => {
    if(opt.options) {
      // sub-sub menu
      _setSubIndex(optIndex)
    } else {
      const _optIndex = sub.options.findIndex(it => (it.id != null && it.id === opt.id) || it.name === opt.name) // find the right index; this necessary when name filtering might alter indices
      onSetFilter(subIndex, _optIndex)
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
      <SVGInline svg={filterSvg} /> {t('Filter projects')}
    </div>,
    <TransitionGroup component={null}>
      {open &&
        <CSSTransition
          key="prj"
          timeout={500}
          classNames="dropdown"
        >
          <div className="filters-dropdown">
            <div className="hider" id="hider-scrollview" ref={ref => { hiderRef.current = ref }}>
              <animated.div className="holder" style={props}>
                <div>
                  <ul>
                    {filters.map((filter, index) => <li onClick={() => _setSubIndex(index)}>{t(filter.name)} <div>{filter.selected.length > 0 && <div className="selected">{t('{{projects}} projects', { projects: filter.selected.length})}</div>} <Icon type="right" /></div></li>)}
                  </ul>
                </div>
                {subIndex.map((index, inIndex) => {
                  return <OptionList {...{ subIndex, inIndex, goto, back, subRef, handleSubRef, geoFilteredProjects, filters, setFilter, hiderRef}} />
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

const OptionList = ({ subIndex, inIndex, goto, back, handleSubRef, geoFilteredProjects, filters, setFilter, hiderRef }) => {
  const { t } = useTranslation()
  const [hasMore, setHasMore] = useState(false)
  const [dataLength, setDataLength] = useState(pageSize)
  const [visibleItems, setVisibleItems] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selected, setSelected] = useState([])
  const showScrollTopRef = useRef(false)
  const scrollRef = useRef()
  const page = useRef(0)
  const allowShowMore = useRef(true)
  let options = filters[subIndex[0]].options
  let sub = filters[subIndex[0]]
  for (let i = 1; i <= inIndex; i += 1) {
    sub = options[subIndex[i]]
    options = options[subIndex[i]].options
  }
  useEffect(() => {
    setVisibleItems(options)
    setHasMore(options.length > pageSize)
  }, [])
  const showMore = () => {
    const filteredOpts = nameFilter.length > 0 ? options.filter(opt => opt.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) : options
    if (allowShowMore.current) {
      page.current += 1
      const updatedVisible = [...visibleItems, ...filteredOpts.slice(page.current * pageSize, page.current * pageSize + pageSize)]
      setVisibleItems(updatedVisible)
      setDataLength(updatedVisible.length)
      setHasMore(filteredOpts.length > page.current * pageSize + pageSize)
      allowShowMore.current = false
      setTimeout(() => { allowShowMore.current = true }, 1000)
    } else {
      if(dataLength < filteredOpts.length - 1){
        setTimeout(() => { setDataLength(dataLength + 1) }, 1000)
      }
    }
  }
  const handleNameSearch = ({target: {value}}) => {
    clearTimeout(tmid)
    tmid = setTimeout(() => {
      setNameFilter(value)
      const filteredOpts = options.filter(opt => opt.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      setVisibleItems(filteredOpts.slice(0, pageSize))
      setHasMore(filteredOpts.length > pageSize)
      page.current = 0
    }, 300)
  }
  const handleScroll = () => {
    if(hiderRef.current.scrollTop > 500 && !showScrollTopRef.current){
      showScrollTopRef.current = true
      setShowScrollTop(true)
    }
    else if(hiderRef.current.scrollTop < 500 && showScrollTopRef.current){
      showScrollTopRef.current = false
      setShowScrollTop(false)
    }
  }
  const handleScrollTop = () => {
    hiderRef.current.scroll({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className="sub" ref={(ref) => { if (ref) { scrollRef.current = ref.parentNode.parentNode } }}>
      {inIndex < 1 &&
        <div className="top">
          <Button type="link" icon="left" onClick={back}>{t('Filters')}</Button>
          {sub.selected && sub.selected.length > 0 &&
            <div className="selected">
              {t('{{items}} selected', { items: sub.selected.length})}
            </div>
          }
        </div>
      }
      {sub.id === 'orgs' && (
        <div className="search-bar">
          <Search
            size="small"
            placeholder={t('Find an organisation...')}
            onChange={handleNameSearch}
            allowClear
          />
        </div>
      )}
      {inIndex >= 1 &&
        <div className="top breadcrumbs">
          <div className="step" onClick={() => goto(0)}><div className="text">{t('Filters')}</div></div>
          {subIndex.map((_index, _inIndex) => {
            let _options = filters[subIndex[0]].options
            let _sub = filters[subIndex[0]]
            for (let i = 1; i <= _inIndex; i += 1) {
              _sub = _options[subIndex[i]]
              _options = _options[subIndex[i]].options
            }
            return <div className="step" onClick={_inIndex < subIndex.length - 1 ? () => goto(_inIndex + 1) : null}><SVGInline svg={tr} /><div className="text">{t(_sub.name)}</div></div>
          })}
        </div>
      }
      <ul ref={handleSubRef(inIndex)}>
        <InfiniteScroll
          dataLength={dataLength}
          next={showMore}
          hasMore={hasMore}
          scrollableTarget="hider-scrollview"
          onScroll={handleScroll}
        >
        {visibleItems && visibleItems.map((opt, optIndex) => {
          let items = -1
          if (sub.id === 'sectors') items = geoFilteredProjects.filter(item => filters[1].selected.length === 0 ? true : filters[1].selected.map(ind => item.organisations.indexOf(filters[1].options[ind].id) !== -1).indexOf(true) !== -1).filter(item => item.sectors.indexOf(opt.id) !== -1).length
          if (sub.id === 'orgs') items = geoFilteredProjects.filter(item => filters[0].selected.length === 0 ? true : filters[0].selected.map(ind => item.sectors.indexOf(filters[0].options[ind].id) !== -1).indexOf(true) !== -1).filter(item => item.organisations.indexOf(opt.id) !== -1).length
          return (
            <li
              className={classNames({ selected: selected.includes(optIndex), hidden: items === 0 })}
              onClick={() => {
                setFilter(opt, optIndex, sub)
                const selectedItems = selected.includes(optIndex)
                  ? selected.filter((s) => s !== optIndex)
                  : [...selected, optIndex]
                setSelected(selectedItems)
              }}
            >
              {t(opt.name)}
              {items > 0 && <span>&nbsp;({items})</span>}
              {opt.options && <div><Icon type="right" /></div>}
            </li>
          )
        })}
        </InfiniteScroll>
      </ul>
      {showScrollTop && <Button id="scroll-top-btn" icon="up" shape="circle" type="primary" onClick={handleScrollTop} />}
    </div>
  )
}

export default FilterBar
