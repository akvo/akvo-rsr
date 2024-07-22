/* global window, document */
import React, { useState, useRef, useEffect } from 'react'
import { Button, Tag, Menu, Dropdown } from 'antd'
import { useLocalStorage } from '@rehooks/local-storage'
import {cloneDeep} from 'lodash'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import classNames from 'classnames'
import Projects from './projects'
import Map, { projectsToFeatureData } from './map'
import Search from './search'
import FilterBar from './filter-bar'
import api from '../../utils/api'
import { isPartnerSites } from '../../utils/misc'

const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1
const urlPrefix = isLocal ? 'http://rsr.akvo.org' : ''

let tmid
let tmc = 0
const tmi = 20
const pickFromArray = (arr, indexes) => {
  return arr.filter((it, ind) => indexes.indexOf(ind) !== -1)
}

const addSelected = (options) => {
  return options.map(it => {
    if(it.options) return {...it, selected: [], options: addSelected(it.options)}
    return it
  })
}

const langNames = { en: 'English', fr: 'Français', es: 'Español'}

const langMenu = ({ lang, setLang }) => {
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [])
  const _setLang = (_lang) => {
    setLang(_lang)
    i18n.changeLanguage(_lang)
  }
  return (
    <Menu className="lang-menu">
      {Object.keys(langNames).filter(it => it !== lang).map((_lang, index) => (
        <Menu.Item key={index} onClick={() => _setLang(_lang)}>
          <span>{langNames[_lang]}</span>
        </Menu.Item>
      ))}
    </Menu>
  )
}

const View = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useLocalStorage('lang', 'en')
  const [data, setData] = useState()
  const [bounds, setBounds] = useState({})
  const boundsRef = useRef(null)
  const filtersRef = useRef({ sectors: [], orgs: [] })
  const mapRef = useRef()
  const centerRef = useRef(null)
  const latLngBoundsRef = useRef(null)
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const projectsWithCoords = data && data.projects && data.projects.filter(it => it.latitude !== null)
  const locationlessProjects = data && data.projects && data.projects.filter(it => it.latitude == null)
  const [filters, setFilters] = useState([])
  const [src, setSrc] = useState('')
  const {data: apiData, error: apiError} = useSWR('/project-directory', url => api.get(url).then(res => res.data))
  useEffect(() => {
    if (apiData) {
      setData(apiData)
      setLoading(false)
      if (apiData.customFields.length > 0){
        setFilters(apiData.customFields.map(({ id, name, dropdownOptions: {options} }) => ({ id, name, selected: [], options: addSelected(options) })))
      } else {
        const defaults = [
          { id: 'sectors', name: 'Sectors', selected: [], options: apiData.sector},
          { id: 'orgs', name: 'Organisations', selected: [], options: apiData.organisation }
        ]
        setFilters(defaults)
      }
    }
    if ((apiError && apiError.response && apiError.response.status === 403) && isPartnerSites()) {
      window.location.href = '/en/lockpass/?next='
    }
  }, [apiData, apiError])
  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
  }, [])
  const _setShowProjects = (to) => {
    setShowProjects(to)
    if(mapRef.current){
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if(tmc > 700) clearInterval(tmid) }, tmi)
    }
  }
  const _setBounds = (_bounds) => {
    setBounds(_bounds)
    boundsRef.current = _bounds
  }
  const onPan = () => {
    _setBounds(mapRef.current.getBounds())
  }
  const geoFilterProjects = ({ _sw, _ne }) => ({ longitude: lng, latitude: lat }) => {
    let inBounds = true
    if (_sw) inBounds = lng > _sw.lng && lng < _ne.lng && lat > _sw.lat && lat < _ne.lat
    return inBounds
  }
  const doesLevelPass = (options, selected) => {
    // recursive filter validation
    const ret = []
    selected.forEach(sfilter => {
      const cind = options.findIndex(it => it.name === sfilter.name)
      if (cind > -1) {
        if (options[cind].options){
          ret.push(doesLevelPass(options[cind].options, pickFromArray(sfilter.options, sfilter.selected)))
        } else {
          ret.push(true)
        }
      } else {
        ret.push(false)
      }
    })
    return ret.indexOf(true) !== -1 // this makes filters inclusive. aka if any of the filters is true
    // return ret.reduce((acc, val) => acc && val, true) // this makes filters exlcusive
  }
  const filterProjects = (_filters) => ({ title, subtitle, sectors, organisations: orgs, dropdownCustomFields }) => {
    let inName = true
    if(src) inName = title.toLowerCase().indexOf(src.toLowerCase()) !== -1 || subtitle.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if(data.customFields.length > 0){
      const cfilters = _filters.filter(it => it.selected.length > 0)
      let pass = cfilters.length === 0
      if(!pass){
        const passes = []
        cfilters.forEach(cfilter => {
          const cfield = dropdownCustomFields.find(it => it.id === cfilter.id)
          if(!cfield) passes.push(false)
          else {
            let thisPass = false
            thisPass = doesLevelPass(cfield.dropdownSelection, pickFromArray(cfilter.options, cfilter.selected))
            passes.push(thisPass)
          }
          if(passes.length === 0) passes.push(false)
        })
        pass = passes.reduce((acc, val) => acc && val, true)
      }
      return inName && pass
    }
    // defaults
    let inSectors = true
    let inOrgs = true
    const orgFilter = _filters.find(it => it.id === 'orgs')
    const sectorFilter = _filters.find(it => it.id === 'sectors')
    if (sectorFilter && sectorFilter.selected.length > 0) inSectors = sectorFilter.selected.map(ind => sectors.indexOf(sectorFilter.options[ind].id) !== -1).indexOf(true) !== -1
    if (orgFilter && orgFilter.selected.length > 0) inOrgs = orgFilter.selected.map(ind => orgs.indexOf(orgFilter.options[ind].id) !== -1).indexOf(true) !== -1
    return inName && inSectors && inOrgs
  }
  const resetZoomAndPan = () => {
    mapRef.current.fitBounds(latLngBoundsRef.current, { padding: 30 })
  }
  const geoFilteredProjects = data ? projectsWithCoords.filter(geoFilterProjects(bounds)) : []
  const filteredProjects = data ? geoFilteredProjects.filter(filterProjects(filters)).sort((a, b) => b.orderScore - a.orderScore) : []
  const handleHoverProject = (id) => {
    if(ulRef.current){
      const _geoFilteredProjects = data ? projectsWithCoords.filter(geoFilterProjects(boundsRef.current)) : []
      const _filteredProjects = data ? _geoFilteredProjects.filter(filterProjects(filtersRef.current)) : []
      const pi = _filteredProjects.findIndex(it => it.id === id)
      if(pi !== -1){
        const top = ulRef.current.children[pi].offsetTop - 60
        ulRef.current.children[pi].classList.add('hover')
        if(top > ulRef.current.scrollTop + ulRef.current.clientHeight - 120 || top < ulRef.current.scrollTop){
          ulRef.current.scroll({ top, behavior: 'smooth' })
        }
      }
    }
  }
  const handleHoverOutProject = () => {
    if (ulRef.current) {
      const el = ulRef.current.getElementsByClassName('hover')
      if(el.length > 0){
        el[0].classList.remove('hover')
      }
    }
  }
  const updateFilters = _filters => {
    setFilters(_filters)
    filtersRef.current = _filters
    const projects = projectsWithCoords.filter(filterProjects(_filters))
    const organisations = (data && data.organisation) || []
    mapRef.current.getSource('projects').setData(projectsToFeatureData(projects, organisations))
  }
  const handleSearch = (_src) => {
    setSrc(_src)
    updateFilters(filters)
  }
  const handleSearchClear = () => {
    setSrc('')
    updateFilters(filters)
  }
  const handleSetFilter = (subIndex, itemIndex) => {
    let inIndex = subIndex.length - 1
    const _filters = cloneDeep(filters)
    while(inIndex >= 0){
      let subOptions = _filters
      let sub
      let ixIndex = 0
      while(ixIndex <= inIndex){
        sub = subOptions[subIndex[ixIndex]]
        subOptions = subOptions[subIndex[ixIndex]].options
        ixIndex += 1
      }
      if(inIndex === subIndex.length - 1){
        const ssIndex = sub.selected.indexOf(itemIndex)
        if (ssIndex === -1) sub.selected.push(itemIndex)
        else sub.selected.splice(ssIndex, 1)
      } else {
        const _selected = [...sub.selected]
        sub.options.forEach((opt, optInd) => {
          if(opt.selected && opt.selected.length === 0 && _selected.indexOf(optInd) !== -1){
            _selected.splice(_selected.indexOf(optInd), 1)
          }
        })
        if (sub.selected) {
          sub.options.forEach((it, _in) => {
            if (it.selected && it.selected.length > 0 && _selected.indexOf(_in) === -1) { _selected.push(_in) }
          })
          sub.selected = _selected
        }
      }
      inIndex -= 1
    }
    updateFilters(_filters)
  }
  const removeFilter = (filter) => {
    const _filters = cloneDeep(filters)
    const index = filters.findIndex(it => it.id === filter.id)
    const emptyFilters = (item) => { if(item.selected) item.selected = []; if(item.options){ item.options.forEach(it => emptyFilters(it)) } }
    emptyFilters(_filters[index])
    updateFilters(_filters)
  }
  const isNlEmKenya = window.location.href.indexOf('//nlembassyofkenya.') !== -1
  return (
    <div id="map-view">
      <header>
        <img src={`${urlPrefix}/logo`} width="120" height="60" alt="Akvo RSR" className={classNames({ cover: isNlEmKenya })} />
        <Search onChange={handleSearch} onClear={handleSearchClear} />
        <div className="filters">
          {filters.length > 0 && <FilterBar {...{filters, geoFilteredProjects}} onSetFilter={handleSetFilter} />}
          {filters.filter(it => it.selected.length > 0).map(filter => <Tag closable visible onClose={() => removeFilter(filter)}>{filter.name} ({filter.selected.length})</Tag>)}
          {data && geoFilteredProjects.length !== projectsWithCoords.length && <span>{t('{{projects}} projects in this area', { projects: filteredProjects.length })}</span>}
          {data && geoFilteredProjects.length === projectsWithCoords.length && <span>{t('{{projects}} projects globally', { projects: data.projects.filter(filterProjects(filters)).length })}</span>}
          {data && geoFilteredProjects.length !== projectsWithCoords.length && <Button type="link" icon="fullscreen" className="show-all" onClick={resetZoomAndPan}>{t('View All')}</Button>}
        </div>
        <div className="right-side">
          <a className="login" href="/my-rsr/" target="_blank">{t('Login')}</a>
          <a className="login" href="/en/register/" target="_blank">{t('Register')}</a>
          <Dropdown overlay={langMenu({ lang, setLang })} trigger={['click']}>
            <span className="lang"><b>{lang}</b></span>
          </Dropdown>
        </div>
      </header>
      <div className="content">
        <Projects
          {...{ loading, ulRef }}
          // if zoom is top (all projects visible) show additional locationless projects
          projects={data ? [...filteredProjects, ...(geoFilteredProjects.length === projectsWithCoords.length ? locationlessProjects.filter(filterProjects(filters)) : [])] : []}
          show={showProjects} setShow={_setShowProjects}
        />
        <Map
          {...{data}}
          getRef={ref => { mapRef.current = ref }}
          getCenter={center => { centerRef.current = center }}
          getMarkerBounds={latLngBounds => { latLngBoundsRef.current = latLngBounds }}
          handlePan={onPan}
          onHoverProject={handleHoverProject}
          onHoverOutProject={handleHoverOutProject}
        />
      </div>
    </div>
  )
}


export default View
