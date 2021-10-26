/* eslint-disable no-unused-vars */
/* global window, document */
import React, { useEffect, useRef, useState } from 'react'
import {
  Layout,
  Typography,
  Card,
  Collapse,
  Row,
  Col
} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
  useLocation
} from 'react-router-dom'
import { uniq } from 'lodash'
import moment from 'moment'
import logo from '../../images/unicef-logo.svg'
import api from '../../utils/api'
import './view.scss'
import {
  HeaderFilter,
  Navbar,
  PageHeader,
  Indicator
} from './components'
import Home from './views/Home'
import Insight from './views/Insight'
import Framework from './views/Framework'
import Map from '../index/map'
import Summaries from './dummy/summaries.json'
import SlideImages from './dummy/slide-images.json'
import { insight } from './dummy'
import MapView from './components/map-view'

const { Header, Content, Footer } = Layout

const WcaroRouter = () => {
  const [lang, setLang] = useState('en')
  const [countries, setCountries] = useState([])
  const [stories, setStories] = useState(null)
  const [programID, setProgramID] = useState(8810)
  const [isMapView, setIsMapView] = useState(false)
  const [directories, setDirectories] = useState()
  const [showProjects, setShowProjects] = useState(true)
  const [loading, setLoading] = useState(true)
  const [periods, setPeriods] = useState(null)
  const [src, setSrc] = useState('')
  const [filters, setFilters] = useState([
    { id: 'sectors', name: 'Sectors', selected: [], options: [] },
    { id: 'orgs', name: 'Organisations', selected: [], options: [] },
    { id: 'country', name: 'Countries', selected: [], options: [] }
  ])
  const [summary, setSummary] = useState(Summaries)
  const [project, setProject] = useState({
    title: 'Loading...',
    results: []
  })
  const [indicators, setIndicators] = useState(null)
  const [groupedItems, setGroupedItems] = useState(null)
  const [preload, setPreload] = useState({
    indicators: true,
    groupedItems: true
  })

  const [bounds, setBounds] = useState({})
  const [slides, setSlides] = useState(SlideImages)
  const [searchResult, setSearchResult] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedCountries, setSelectedCountries] = useState([])

  const location = useLocation()
  const initMenuKey = location.pathname === '/' ? 'info' : 'dashboard'
  const [menuKey, setMenuKey] = useState(initMenuKey)
  const [user, setUser] = useState(null)

  const mapRef = useRef()
  const centerRef = useRef(null)
  const latLngBoundsRef = useRef(null)
  const boundsRef = useRef(null)
  const ulRef = useRef(null)
  const filtersRef = useRef({ sectors: [], orgs: [] })

  let tmid
  let tmc = 0
  const tmi = 20

  const { results } = stories || { results: null }
  const projectsWithCoords = directories && directories.projects && directories.projects.filter(it => it.latitude !== null)
  const locationlessProjects = directories && directories.projects && directories.projects.filter(it => it.latitude == null)


  const _setShowProjects = (to) => {
    setShowProjects(to)
    if (mapRef.current) {
      tmc = 0
      clearInterval(tmid)
      tmid = setInterval(() => { mapRef.current.resize(); tmc += tmi; if (tmc > 700) clearInterval(tmid) }, tmi)
    }
  }

  const _setBounds = (_bounds) => {
    setBounds(_bounds)
    boundsRef.current = _bounds
  }
  const onPan = () => {
    _setBounds(mapRef.current.getBounds())
  }

  const addSelected = (options) => {
    return options.map(item => {
      if (item.options) return { ...item, selected: [], options: addSelected(item.options) }
      return item
    })
  }

  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
    api.get('rest/v1/me/')
      .then(res => {
        const { data, status } = res
        if (status === 200) {
          setUser(data)
        }
      })

    api.get(`/rest/v1/program/${programID}/countries/`)
      .then(({ data }) => {
        setCountries(data)
        const newSummarize = summary.map(item => item.id === 1 ?
          { ...item, amount: data.length, label: data.length > 1 ? 'Countries' : 'Country' }
          : item
        )
        setSummary(newSummarize)
      })

    api.get(`/rest/v1/program/${programID}/updates/`)
      .then(({ data }) => {
        setStories(data)
      })

    api.get(`/rest/v1/project/${programID}/results_framework/`)
      .then(({ data }) => {
        setProject(data)
        const { results: dataSource } = data || {}
        const grouped = dataSource.reduce((r, a) => {
          r[a.type] = r[a.type] || []
          r[a.type].push(a)
          return r
        }, Object.create(null))
        setIndicators(grouped)
        const allPeriods = uniq(dataSource.flatMap(result => {
          return result.indicators.flatMap(indicator => {
            return indicator.periods
              .filter(period => period.periodStart && period.periodEnd)
              .map(period => {
                const start = moment(period.periodStart).format('DD/MM/YYYY')
                const finish = moment(period.periodEnd).format('DD/MM/YYYY')
                return `${start} - ${finish}`
              })
          })
        }), true)
        setPeriods(allPeriods)
      })

    api.get('/project-directory')
      .then(d => {
        setDirectories(d.data)
        setLoading(false)
        if (d.data.customFields.length > 0) {
          setFilters(d.data.customFields.map(({ id, name, dropdownOptions: { options } }) => ({ id, name, selected: [], options: addSelected(options) })))
        } else {
          setFilters([
            ...filters.map(filter => {
              return filter.id === 'orgs'
                ? { ...filter, options: d.data.organisation }
                : filter.id === 'sectors'
                  ? ({ ...filter, options: d.data.sector })
                  : filter
            })
          ])
        }
      })
  }, [])

  useEffect(() => {
    if (user && preload.groupedItems) {
      setPreload({
        indicators: true,
        groupedItems: false
      })
      api.get(`/rest/v1/project/${programID}/results/`)
        .then(({ data }) => {
          const { results: resultsItem } = data || {}
          const grouped = resultsItem.reduce((r, a) => {
            r[a.type] = r[a.type] || []
            r[a.type].push(a)
            return r
          }, Object.create(null))
          if (grouped.Other) delete grouped.Other
          setGroupedItems(grouped)
        })
    }
    if (groupedItems && indicators && preload.indicators) {
      setPreload({
        indicators: false,
        groupedItems: false
      })
      const combined = {
        Outcome: [
          ...groupedItems.Outcome.map(item => {
            const findIndicators = indicators[2].find(indicator => indicator.id === item.id)
            return {
              ...item,
              indicators: findIndicators ? findIndicators.indicators || [] : []
            }
          })
        ],
        Output: [
          ...groupedItems.Output.map(item => {
            const findIndicators = indicators[1].find(indicator => indicator.id === item.id)
            return {
              ...item,
              indicators: findIndicators ? findIndicators.indicators || [] : []
            }
          })
        ]
      }
      setGroupedItems(combined)
    }
  })

  const pickFromArray = (arr, indexes) => {
    return arr.filter((it, ind) => indexes.indexOf(ind) !== -1)
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
        if (options[cind].options) {
          ret.push(doesLevelPass(options[cind].options, pickFromArray(sfilter.options, sfilter.selected)))
        } else {
          ret.push(true)
        }
      } else {
        ret.push(false)
      }
    })
    return ret.indexOf(true) !== -1 // this makes filters inclusive. aka if any of the filters is true
  }

  const filterProjects = (_filters) => ({ title, subtitle, sectors, organisations: orgs, dropdownCustomFields }) => {
    let inName = true
    if (src) inName = title.toLowerCase().indexOf(src.toLowerCase()) !== -1 || subtitle.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if (directories.customFields.length > 0) {
      const cfilters = _filters.filter(it => it.selected.length > 0)
      let pass = cfilters.length === 0
      if (!pass) {
        const passes = []
        cfilters.forEach(cfilter => {
          const cfield = dropdownCustomFields.find(it => it.id === cfilter.id)
          if (!cfield) passes.push(false)
          else {
            let thisPass = false
            thisPass = doesLevelPass(cfield.dropdownSelection, pickFromArray(cfilter.options, cfilter.selected))
            passes.push(thisPass)
          }
          if (passes.length === 0) passes.push(false)
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

  const handleHoverOutProject = () => {
    if (ulRef.current) {
      const el = ulRef.current.getElementsByClassName('hover')
      if (el.length > 0) {
        el[0].classList.remove('hover')
      }
    }
  }

  const handleHoverProject = (id) => {
    if (ulRef.current) {
      const _geoFilteredProjects = directories ? projectsWithCoords.filter(geoFilterProjects(boundsRef.current)) : []
      const _filteredProjects = directories ? _geoFilteredProjects.filter(filterProjects(filtersRef.current)) : []
      const pi = _filteredProjects.findIndex(it => it.id === id)
      if (pi !== -1) {
        const top = ulRef.current.children[pi].offsetTop - 60
        ulRef.current.children[pi].classList.add('hover')
        if (top > ulRef.current.scrollTop + ulRef.current.clientHeight - 120 || top < ulRef.current.scrollTop) {
          ulRef.current.scroll({ top, behavior: 'smooth' })
        }
      }
    }
  }

  const handleOnSwitchMap = (checked) => {
    setIsMapView(checked)
    if (document) {
      document.body.style.height = checked ? '100%' : 'auto'
      document.body.style.overflowY = checked ? 'hidden' : 'scroll'
    }
  }

  const handleProjectSearch = (keyword, codes = null) => {
    if (!codes) setSrc(keyword)
    const countryCodes = codes || selectedCountries
    const { projects } = directories || {}
    const filtered = keyword.trim().length > 0 && projects
      ? projects.filter(item => {
        const resultSearch = item
          .title
          .toLowerCase()
          .includes(keyword.trim().toLowerCase())
        const resultCountry = countryCodes.length > 0 ? countryCodes.includes(item.countries[0] || '') : true
        return resultSearch && resultCountry
      })
      : []
    setSearchResult(filtered)
  }

  const handleSelectCountry = (code, isChecked) => {
    let selected = filters.find(filter => filter.id === 'country').selected
    selected = isChecked ? [...selected, code] : selected.filter(item => item !== code)
    setSelectedCountries(selected)
    setFilters([
      ...filters.map(filter => filter.id === 'country'
        ? ({ ...filter, selected })
        : filter
      )
    ])
    if (src.trim().length > 0) {
      handleProjectSearch(src, selected)
    }
  }

  const handleSelectPeriod = (value) => {
    setSelectedPeriod(value)
  }

  const geoFilteredProjects = directories ? projectsWithCoords.filter(geoFilterProjects(bounds)) : []
  const filteredProjects = directories ? geoFilteredProjects.filter(filterProjects(filters)).sort((a, b) => b.orderScore - a.orderScore) : []
  const sections = [{ id: 9, name: 'Impact' }, { id: 2, name: 'Outcome' }, { id: 1, name: 'Output' }]

  return (
    <Router>
      <Layout className="wcaro">
        <Header style={{ position: 'fixed', zIndex: 3, width: '100%', paddingLeft: '2rem' }} className="wcaro-header">
          <Navbar {...{ logo, lang, user, setLang, menuKey, setMenuKey }} />
        </Header>
        <PageHeader {...{ title: project.title, user, isMapView, onChange: handleOnSwitchMap }}>
          <hr />
          <HeaderFilter
            {...{
              countries,
              periods,
              selectedCountries,
              selectedPeriod,
              items: searchResult,
              onSearch: handleProjectSearch,
              onPeriod: handleSelectPeriod,
              onCountry: handleSelectCountry,
            }}
          />
        </PageHeader>
        <Content className="wcaro-main">
          {isMapView
            ? (
              <MapView countries={selectedCountries} period={selectedPeriod} />
            )
            : (
              <Switch>
                <Route exact path="/">
                  <Home {...{ user, slides, summary, results, stories, setMenuKey }} />
                </Route>
                <Route path="/dir/insight/:id">
                  <Insight {...{ ...insight, slides, results, stories, setMenuKey }} />
                </Route>
                <Route path="/dir/framework">
                  <Framework {...{ sections, indicators: groupedItems }} />
                </Route>
              </Switch>
            )}
        </Content>
        <Footer style={{ marginBottom: '2em' }} />
      </Layout>
    </Router>
  )
}

export default WcaroRouter
