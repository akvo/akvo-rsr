/* eslint-disable no-unused-vars */
/* global window */
import React, { useEffect, useState } from 'react'
import { SteppedLineTo } from 'react-lineto'

import FrameworkOverview from './FrameworkOverview'
import api from '../../../utils/api'
import './Framework.scss'
import config from '../config'
import IndicatorDrawer from '../components/IndicatorDrawer'
import { queryResults } from '../data/queries'
import { setGrouped, setPaginate, splitStartEndPeriod } from '../../../utils/misc'
import EmptyPage from '../components/EmptyPage'
import relationship from '../data/relationship.json'

const Framework = ({
  id: projectID,
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
}) => {
  const [filtering, setFiltering] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [result, setResult] = useState(null)
  const [results, setResults] = useState(null)
  const [cluster, setCluster] = useState(null)
  const [connected, setConnected] = useState({ from: null, to: [] })
  const [pages, setPages] = useState([
    { id: 9, name: 'Impact', page: 0, total: 0, data: [[1, 2, 3]] },
    { id: 2, name: 'Outcome', page: 0, total: 0, data: [[1, 2, 3]] },
    { id: 1, name: 'Output', page: 0, total: 0, data: [[1, 2, 3]] }
  ])

  const { data, error } = queryResults()

  const handleOnShowDrawer = (resultID, progress) => {
    setOpen([resultID])
    setDrawerVisible(true)
    const resultItem = Object.values(results)
      .flatMap(item => item)
      .find(item => item.id === resultID)
    setResult(resultItem)
    const pid = projectID || config.PROGRAM_ID
    api
      .get(`/project/${pid}/result/${resultID}/`)
      .then(({ data: item }) => {
        setResult({
          ...resultItem,
          ...item,
          progress
        })
      })
  }

  const handleOnConnect = (id) => {
    if (cluster) {
      const findItem = relationship.find((rl) => rl.from === id)
      let toItems = []
      if (findItem) {
        toItems = [
          ...findItem.to.filter((fi) => (fi.from)).map((fi) => fi.from),
          ...findItem.to.filter((fi) => (fi.to)).map((fi) => fi.to),
        ]
      }
      const oldID = open ? open[0] : null
      const isDiff = (id !== oldID)
      setConnected({
        from: isDiff ? id : null,
        to: findItem.to
      })
      setOpen(isDiff ? [id, ...toItems] : null)
    }
  }

  const handleOnPage = (name = 'Outcome', type = 'next') => {
    const fpage = pages.find((p) => p.name.toLowerCase() === name.toLowerCase())
    let p = parseInt(type === 'next' ? fpage.page + 1 : fpage.page - 1, 10)
    p = p < 0 ? 0 : p
    const np = pages.map((pg) => {
      return pg.name.toLowerCase() === name.toLowerCase()
        ? ({ ...pg, page: p }) : pg
    })
    if (connected.from) {
      setOpen(null)
      setConnected({ from: null, to: [] })
    }
    setPages(np)
  }

  const handleOnCreatePages = (items) => {
    return Object.keys(items).map((p, px) => {
      const paginates = setPaginate(items[p], 3)
      return {
        id: px,
        name: p,
        page: 0,
        total: paginates.length,
        data: paginates
      }
    })
  }

  useEffect(() => {
    if (
      (loading && !selectedPeriod && data && framework && results) ||
      (!results && data && framework)
    ) {
      const rs = framework.map((fx, ix) => ({ ...fx, ...data[ix] }))
      setResults(rs)

      const cls = setGrouped(rs)
      if (cls && cls.Other) delete cls.Other
      setCluster(cls)

      const ps = handleOnCreatePages(cls)
      setPages(ps)

      setLoading(false)
    }

    if (selectedPeriod && loading && results) {
      setFiltering(true)
      const filtered = results
        .map((r) => ({
          ...r,
          indicators: r.indicators.filter((i) => {
            const [periodStart, periodEnd] = splitStartEndPeriod(selectedPeriod)
            return i.periods.filter(p => {
              return (
                (p.periodStart === periodStart && p.periodEnd === periodEnd) &&
                p.actualValue > 0
              )
            }).length
          })
        }))
        .filter((r) => r.indicators.length)
        .sort((a, b) => a.type.localeCompare(b.type))

      const cls = setGrouped(filtered)
      if (cls && cls.Other) delete cls.Other
      setCluster(cls)

      const ps = handleOnCreatePages(cls)
      setPages(ps)
      setLoading(false)
      setTimeout(() => {
        setFiltering(false)
      }, 1000)
    }

    if (search && loading && cluster) {
      setFiltering(true)
      const filtered = {}
      Object.keys(cluster).forEach((rx) => {
        filtered[rx] = cluster[rx].filter((it) => {
          return (
            it.title.toLowerCase().includes(search.toLowerCase()) ||
            it.indicatorTitles.filter((tl) => tl.toLowerCase().includes(search.toLowerCase())).length
          )
        })
      })
      const ps = handleOnCreatePages(filtered)
      setPages(ps)
      setLoading(false)
      setTimeout(() => {
        setFiltering(false)
      }, 1000)
    }
  }, [filtering, results, cluster, search, loading, data, framework, selectedPeriod])
  return (user.status === 'success' && !error && cluster)
    ? (
      <div className="fw-container">
        <IndicatorDrawer
          visible={drawerVisible}
          onClose={() => {
            setOpen(null)
            setDrawerVisible(false)
          }}
          {...{
            result,
            periods,
            countries,
            selectedPeriod,
            selectedCountries,
            setSelectedPeriod,
            setLoading
          }}
        />
        <FrameworkOverview
          {...{
            selectedPeriod,
            selectedCountries,
            connected,
            open,
            loading,
            filtering,
            pages,
            onShow: handleOnShowDrawer,
            onConnect: handleOnConnect,
            onPage: handleOnPage
          }}
        />
        {connected.from
          ? connected.to.map((co, ix) => (
            <div key={ix}>
              {co.to && (
                <SteppedLineTo
                  from={`wo-card${co.from}`}
                  to={`wo-card${co.to}`}
                  fromAnchor="bottom"
                  toAnchor="top"
                  borderColor="#A8C0C9"
                  borderWidth={3}
                />
              )}
              <SteppedLineTo
                from={`wo-card${connected.from}`}
                to={`wo-card${co.from}`}
                fromAnchor="bottom"
                toAnchor="top"
                borderColor="#A8C0C9"
                borderWidth={3}
              />
            </div>
          ))
          : null
        }
      </div>
    )
    : (
      <div style={{ height: 'calc(100vh - 190px)', display: 'flex' }}>
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <EmptyPage error={error} />
        </div>
      </div>
    )
}

export default Framework
