/* eslint-disable no-unused-vars */
/* global window, document */
import {
  Button,
  Row,
  Col,
  Dropdown,
  Icon,
  Layout,
  Menu,
  Switch,
  Typography,
  Carousel,
  Card,
  Spin,
  Progress,
  Collapse,
  Badge
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'
import logo from '../../images/unicef-logo.svg'
import api from '../../utils/api'
import Map from '../index/map'
import './view.scss'
import Search from '../index/search'
import Projects from '../index/projects'
import {
  HeaderFilter,
  PanelBadge,
  ImageCarousel,
  Navbar,
  PageHeader,
  Summarize,
  Stories,
  Indicator,
  Slider
} from './components'

const { Header, Content, Footer } = Layout
const { Text, Title } = Typography
const { Meta } = Card
const { Panel } = Collapse

const View = () => {
  const [lang, setLang] = useState('en')
  const [countries, setCountries] = useState([])
  const [stories, setStories] = useState(null)
  const [programID, setProgramID] = useState(8810)
  const [isMapView, setIsMapView] = useState(false)
  const [directories, setDirectories] = useState()
  const [showProjects, setShowProjects] = useState(true)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState([])
  const [src, setSrc] = useState('')
  const [summary, setSummary] = useState([
    {
      id: 1,
      icon: 'global',
      amount: 0,
      label: 'Countries',
      lg: 4,
      sm: 24
    },
    {
      id: 2,
      icon: 'team',
      amount: 26000000,
      label: 'People<br/>Impacted',
      lg: 6,
      sm: 24
    },
    {
      id: 3,
      icon: 'coffee',
      amount: 16000000,
      label: 'Have access<br/>to safe dringking water',
      lg: 6,
      sm: 12
    },
    {
      id: 4,
      icon: 'heart',
      amount: 4200000,
      label: 'Improved<br />sanitartion infrastructure',
      lg: 5,
      sm: 12
    }
  ])
  const [project, setProject] = useState({
    title: 'Loading...',
    results: []
  })
  const [indicators, setIndicators] = useState([])

  const [bounds, setBounds] = useState({})
  const [preload, setPreload] = useState({
    country: true,
    story: true,
    project: true
  })
  const [slides, setSlides] = useState([
    'https://www.unicef.org/eap/sites/unicef.org.eap/files/styles/hero_desktop/public/IMG_3908.jpg?itok=TbeSxOa0',
    'https://www.unicef.org/eap/sites/unicef.org.eap/files/styles/media_large_image/public/UNI193997.jpg?itok=Bkf1lXL0'
  ])

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

  useEffect(() => {
    if (preload.country) {
      setPreload({
        ...preload,
        country: false
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
    }

    if (preload.story) {
      setPreload({
        ...preload,
        story: false
      })
      api.get(`/rest/v1/program/${programID}/updates/`)
        .then(({ data }) => {
          setStories(data)
        })
    }

    if (preload.project) {
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
          setPreload({
            ...preload,
            project: false
          })
        })
    }
  }, [])

  useEffect(() => {
    document.getElementById('root').classList.add(window.location.host.split('.')[0])
    api.get('/project-directory')
      .then(d => {
        setDirectories(d.data)
        setLoading(false)
      })
  }, [])

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
    // return ret.reduce((acc, val) => acc && val, true) // this makes filters exlcusive
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

  const geoFilteredProjects = directories ? projectsWithCoords.filter(geoFilterProjects(bounds)) : []
  const filteredProjects = directories ? geoFilteredProjects.filter(filterProjects(filters)).sort((a, b) => b.orderScore - a.orderScore) : []
  const sections = [{ id: 1, name: 'OUTPUT' }, { id: 2, name: 'OUTCOME' }, { id: 9, name: 'IMPACT' }]
  return (
    <Layout className="wcaro">
      <Header style={{ position: 'fixed', zIndex: 3, width: '100%', paddingLeft: '2rem' }} className="wcaro-header">
        <Navbar {...{ logo, lang, setLang }} />
      </Header>
      <PageHeader {...{ title: project.title, isMapView, onChange: handleOnSwitchMap }}>
        <hr />
        <HeaderFilter {...{ countries }} />
      </PageHeader>
      <Content className="wcaro-main">
        {isMapView
          ? (
            <div id="map-view">
              <div className="content">
                <div className="projects on" style={{ overflow: 'auto' }}>
                  <Indicator {...{ sections, indicators }} />
                </div>
                <Map
                  {...{ data: directories }}
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
          : (
            <>
              <Slider items={slides} />
              <Summarize items={summary} />
              <Stories {...{ results, stories }} />
            </>
          )}
      </Content>
      <Footer style={{ marginBottom: '2em' }} />
    </Layout>
  )
}

export default View
