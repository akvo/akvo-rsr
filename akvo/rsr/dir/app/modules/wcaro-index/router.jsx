import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom'
import { Layout } from 'antd'
import { uniq } from 'lodash'
import moment from 'moment'

import Home from './views/Home'
import Framework from './views/Framework'
import MapView from './components/map-view'
import { HeaderFilter, Navbar, PageHeader } from './components'
import './view.scss'
import { queryCountries, queryFramework, queryProgram, queryUser } from './data/queries'

const { Content } = Layout

const WcaroRouter = () => {
  const [lang, setLang] = useState('en')
  const [search, setSearch] = useState(null)
  const [periods, setPeriods] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedCountries, setSelectedCountries] = useState([])
  const [user, setUser] = useState({ status: null, data: {} })
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const initMenu = location.pathname === '/' ? 'info' : location.pathname === '/dir/map' ? 'global' : 'dashboard'
  const [menuKey, setMenuKey] = useState(initMenu)
  const [open, setOpen] = useState(null)

  const { data: program } = queryProgram()
  const { data: account, error } = queryUser()
  const { data: countries } = queryCountries()
  const { data: framework } = queryFramework()

  const addSelected = (options) => {
    return options.map(item => {
      if (item.options) return { ...item, selected: [], options: addSelected(item.options) }
      return item
    })
  }

  const handleOnReset = () => {
    setSearch(null)
    setSelectedCountries([])
    setSelectedPeriod(null)
    setLoading(true)
    setOpen(null)
  }
  const handleOnSearch = (value) => {
    setLoading(true)
    setSearch(value.length ? value.toLowerCase() : null)
  }
  const handleOnSelectCountry = (code, isChecked) => {
    setLoading(true)
    if (isChecked) {
      setSelectedCountries([
        ...selectedCountries,
        code
      ])
    } else {
      setSelectedCountries([
        ...selectedCountries.filter((s) => s !== code.toLowerCase())
      ])
    }
  }
  const handleOnSelectPeriod = (value) => {
    const val = value === 'All Periods' ? null : value
    setSelectedPeriod(val)
    setLoading(true)
  }
  useEffect(() => {
    if (framework && !periods.length) {
      const ds = framework.flatMap(f => {
        return f.indicators.flatMap(indicator => {
          return indicator.periods
            .filter(period => period.periodStart && period.periodEnd)
            .map(period => {
              const start = moment(period.periodStart).format('DD/MM/YYYY')
              const finish = moment(period.periodEnd).format('DD/MM/YYYY')
              return `${start} - ${finish}`
            })
        })
      })
      const allPeriods = uniq(ds, true).sort((a, b) => moment(a.split(' - ')[0]).unix() - moment(b.split(' - ')[0]).unix())
      setPeriods(allPeriods)
    }
    if (error && !user.status) setUser({ ...user, status: 'fail' })
    if (account && !Object.keys(user.data).length) setUser({ status: 'success', data: account })
  }, [program, user, account, framework, periods, error, loading])
  const projects = framework ? uniq(framework.flatMap((f) => Object.keys(f.childProjects))) : null
  const indicators = framework ? uniq(framework.flatMap((f) => f.indicators).map((f) => f.id)) : null
  return (
    <Router>
      <Layout className="wcaro">
        <div className="wcaro-page-header-container">
          <Navbar
            {...{
              ...program,
              lang,
              user,
              setLang,
              menuKey,
              setMenuKey
            }}
          />
          <div className="wcaro-page-header">
            <PageHeader {...{ ...program, user }} />
            <Switch>
              <Route exact path="/dir/map">
                <HeaderFilter
                  {...{
                    error,
                    search,
                    countries,
                    periods,
                    selectedCountries,
                    selectedPeriod,
                    onReset: handleOnReset,
                    onPeriod: handleOnSelectPeriod,
                    onSearch: handleOnSearch,
                    onCountry: handleOnSelectCountry
                  }}
                />
              </Route>
              <Route path="/dir/framework">
                <HeaderFilter
                  {...{
                    error,
                    search,
                    countries,
                    periods,
                    selectedCountries,
                    selectedPeriod,
                    onReset: handleOnReset,
                    onPeriod: handleOnSelectPeriod,
                    onSearch: handleOnSearch,
                    onCountry: handleOnSelectCountry
                  }}
                />
              </Route>
            </Switch>
          </div>
        </div>
        <Content>
          <Switch>
            <Route exact path="/">
              <Home
                {...{
                  ...program,
                  setMenuKey,
                  projects,
                  indicators,
                  countries,
                  user,
                }}
              />
            </Route>
            <Route path="/dir/framework">
              <div className="with-filter">
                <Framework
                  {...{
                    ...program,
                    periods,
                    search,
                    loading,
                    user,
                    open,
                    framework,
                    countries,
                    setOpen,
                    setLoading,
                    setSelectedPeriod,
                    selectedPeriod,
                    selectedCountries
                  }}
                />
              </div>
            </Route>
            <Route path="/dir/map">
              <div className="with-filter">
                <MapView countries={selectedCountries} period={selectedPeriod} {...{ search, loading, setLoading }} />
              </div>
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Router>
  )
}

export default WcaroRouter
