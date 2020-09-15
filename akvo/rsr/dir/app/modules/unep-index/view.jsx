/* global window, document */
import React, { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '@rehooks/local-storage'
import { Dropdown, Menu, Tag } from 'antd'
import {cloneDeep} from 'lodash'
import { useTranslation } from 'react-i18next'
import Projects from '../index/projects'
import Map from './map'
import Search from '../index/search'
import FilterBar from '../index/filter-bar'
import api from '../../utils/api'

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

const containsOneOf = (items, inList) => {
  // containsOneOf(['uk', 'us'], ['in', 'bg', 'nl', 'uk']) // -> true
  let ret = false
  let ind = 0
  while(ind < items.length && !ret){
    ret = inList.indexOf(items[ind]) !== -1
    ind += 1
  }
  return ret
}

const langs = ['en', 'es', 'fr']
const flags = {}
langs.forEach(lang => {
  flags[lang] = require(`../../images/${lang}.png`) // eslint-disable-line
})

const langMenu = ({lang, setLang}) => {
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
      {langs.filter(it => it !== lang).map((_lang, index) => (
        <Menu.Item key={index} onClick={() => _setLang(_lang)}><img src={flags[_lang]} /></Menu.Item>
      ))}
    </Menu>
  )
}

const View = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useLocalStorage('lang', 'en')
  const [data, setData] = useState()
  const filtersRef = useRef({ sectors: [], orgs: [] })
  const mapRef = useRef()
  const ulRef = useRef(null)
  const [showProjects, setShowProjects] = useState(true)
  const [filters, setFilters] = useState([])
  const [src, setSrc] = useState('')
  const [countryFilter, setCountryFilter] = useState([])
  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
    api.get('/project-directory')
      .then(d => {
        setData(d.data)
        setLoading(false)
        if (d.data.customFields.length > 0){
          setFilters(d.data.customFields.map(({ id, name, dropdownOptions: {options} }) => ({ id, name, selected: [], options: addSelected(options) })))
        } else {
          const defaults = [
            { id: 'sectors', name: 'Sectors', selected: [], options: d.data.sector},
            { id: 'orgs', name: 'Organisations', selected: [], options: d.data.organisation }
          ]
          setFilters(defaults)
        }
      })
  }, [])
  const _setShowProjects = (to) => {
    setShowProjects(to)
    if(mapRef.current){
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if(tmc > 700) clearInterval(tmid) }, tmi)
    }
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
  const filterProjects = (_filters, _countryFilter) => ({ title, subtitle, countries, sectors, organisations: orgs, dropdownCustomFields }) => {
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
      let inCountries = true
      if(_countryFilter.length > 0){
        inCountries = containsOneOf(_countryFilter, countries)
      }
      return inName && pass && inCountries
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
  const filteredProjects = data ? data.projects.filter(filterProjects(filters, countryFilter)).sort((a, b) => b.orderScore - a.orderScore) : []
  const updateFilters = _filters => {
    setFilters(_filters)
    filtersRef.current = _filters
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
  const handleCountryClick = (code) => {
    setCountryFilter(state => {
      if(state.findIndex(it => it === code) !== -1){
        return state.filter(it => it !== code)
      }
      return [...state, code]
    })
  }
  // console.log(countryFilter)
  const clearCountryFilter = () => {
    setCountryFilter([])
  }
  return (
    <div id="map-view">
      <header>
        <img src="/logo" />
        <Search onChange={handleSearch} onClear={handleSearchClear} />
        <div className="filters">
          {filters.length > 0 && <FilterBar {...{filters, geoFilteredProjects: data.projects}} onSetFilter={handleSetFilter} />}
          {filters.filter(it => it.selected.length > 0).map(filter => <Tag closable visible onClose={() => removeFilter(filter)}>{filter.name} ({filter.selected.length})</Tag>)}
          {countryFilter.length > 0 && <Tag closable visible onClose={clearCountryFilter}>{t('Countries')} ({countryFilter.length})</Tag>}
          {data && <span>{t('{{projects}} projects', { projects: filteredProjects.length })}</span>}
        </div>
      </header>
      <div className="content">
        <Projects
          {...{ loading, ulRef }}
          // if zoom is top (all projects visible) show additional locationless projects
          projects={data ? filteredProjects : []}
          show={showProjects} setShow={_setShowProjects} />
        <Map
          {...{ data, handleCountryClick, countryFilter}}
          getRef={ref => { mapRef.current = ref }}
        />
      </div>
    </div>
  )
}


export default View
