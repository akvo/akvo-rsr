import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Spin, Icon, Button, Card as AntCard, Typography } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import './styles.scss'
import api from '../../utils/api'
import Column from './column'
import Card from './card'
import FilterCountry from '../projects/filter-country'
import { getFlatten, getProjectUuids, makeATree } from '../../utils/misc'

const { Text } = Typography

const Hierarchy = ({ match: { params }, program, userRdr, asProjectTab }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState(true)
  const [countryFilter, setCountryFilter] = useState(null)
  const [programs, setPrograms] = useState([])
  const [projects, setProjects] = useState(null)
  const history = useHistory()
  const projectId = params.projectId || params.programId
  const programId = selected.map((s) => s.id).slice(0, 1).pop()
  const canCreateProjects = (
    userRdr.programs &&
    userRdr
      .programs
      .findIndex(it => (it.id === Number(projectId) || it.id === Number(programId)) && it.canCreateProjects) !== -1
  )
  const isOldVersion = false
  const toggleSelect = (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    }
    if(canCreateProjects) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
    if (item?.id && !item?.fetched && item?.childrenCount) {
      setLoading(true)
      api
        .get(`/project/${item.id}/children/?format=json`)
        .then(({ data }) => {
          const { results } = data || {}
          const children = results?.map((r) => ({...r, children: []}))
          const _selected = [
            ...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected),
            {
              ...item,
              fetched: true,
              children
            }
          ]
          setSelected(_selected)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }
  const selectProgram = (item) => {
    if(item.id !== Number(projectId)){
      setLoading(true)
      setSelected([])
      history.push(`/programs/${item.id}`)
    }
    if (item?.id && !item?.fetched) {
      setLoading(true)
      api
        .get(`/project/${item.id}/children/?format=json`)
        .then(({ data }) => {
          const { results } = data || {}
          const children = results?.map((r) => ({ ...r, children: [] }))
          const _selected = programs.slice(0, 1).map((p) => ({ ...p, fetched: true, children }))
          setSelected(_selected)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  const handleOnSetProjects = () => {
    api
      .get(`/project/${projectId}?format=json`)
      .then(({ data }) => {
        let _uuid = getProjectUuids(data?.path)
        _uuid = _uuid.slice(0, _uuid.length - 1)
        const endpoints = _uuid?.map((uuid) => api.get(`/project/?uuid=${uuid}&format=json`))
        Promise
          .all(endpoints)
          .then((res) => {
            const _projects = res?.flatMap(({ data: resData }) => resData?.results)
            setProjects(_projects)
          })
          .catch(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleOnReverseHierarchy = (_projects) => {
    const apis = _projects
      ?.flatMap((p, px) => {
        return px === 0
          ? [api.get(`/program/${p?.id}?format=json`), api.get(`/project/${p?.id}/children/?format=json`)]
          : [api.get(`/project/${p?.id}/children/?format=json`)]
      })
    Promise
      .all(apis)
      .then((res) => {
        const items = res
          ?.flatMap(({ data: resData }) => resData?.results || [resData])
          ?.map((d) => ({ ...d, fetched: false, children: [] }))
        const programTree = makeATree(items)
        setPrograms(programTree)
        let _selected = getFlatten(programTree)
        _selected = _selected
          ?.filter((s) => projects?.map((p) => p.id)?.includes(s.id))
          ?.map((s) => ({...s, fetched: (s?.children?.length) }))
        setSelected(_selected)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (projectId && !projects && preload) {
      setPreload(false)
      api.get(`/program/${projectId}?format=json`)
        .then(({ data }) => {
          setLoading(false)
          setPrograms([{ ...data, children: [] }])
        })
        .catch((err) => {
          if (err.response.status === 404) {
            handleOnSetProjects(projectId)
          } else {
            setLoading(false)
          }
        })
    }
    if (projects && !preload) {
      setPreload(false)
      handleOnReverseHierarchy(projects)
    }
  }, [preload, projects])
  const filterCountry = (item) => countryFilter == null ? true : (item.locations.findIndex(it => it.isoCode === countryFilter) !== -1 || item.recipientCountries.findIndex(it => it.country.toLowerCase() === countryFilter) !== -1)
  const countries = []
  return (
    <div className={classNames('hierarchy', {noHeader: program, asProjectTab })}>
      {(!program && !asProjectTab) &&
      <div className="topbar-row">
        <h2>{t('Projects hierarchy')}</h2>
        {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />}
      </div>
      }
      {(program || asProjectTab) && loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div id="react-no-print">
      <div className="board">
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} {...{loading, selected, countryFilter}} index={-1} extra={!loading && <FilterCountry size="small" onChange={setCountryFilter} items={countries} />}>
          {programs.map(parent => <Card {...{countryFilter, filterCountry, isOldVersion }} isProgram onClick={() => selectProgram(parent)} project={parent} selected={(selected[0] && selected[0].id === parent.id) || Number(projectId) === parent.id} />)}
        </Column>
        }
        {selected.map((col, index) => {
          if (col.children.length && countryFilter && (!col.children.filter(filterCountry).length)) {
            return (
              <Column isLast={false} loading={false} {...{ selected, index, countryFilter }} isReff isEmpty>
                <li>
                  <AntCard
                    className="card"
                    style={{
                      height: '140px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text type="secondary">No results found</Text>
                  </AntCard>
                </li>
              </Column>
            )
          }
          return (
            <Column isLast={index === selected.length - 1} loading={loading} selected={selected} index={index} countryFilter={countryFilter}>
              {(canCreateProjects && (!selected[0].isMasterProgram || index > 0)) && (
                <li className="card create">
                  <Link to={`/projects/new/settings?parent=${selected[index].id}&program=${selected[0].id}`}>
                    <Button icon="plus">
                      {t('New Contributing Project')}
                    </Button>
                  </Link>
                </li>
              )}
              {program && canCreateProjects && (selected[0].isMasterProgram && index === 0) && <div className="card create"><Link to={`/programs/new/editor/settings?parent=${selected[index].id}&program=${selected[0].id}`}><Button icon="plus">{t('New Program')}</Button></Link></div>}
              {col.children.filter(filterCountry).map(item => {
                let isReff = item.referenced
                const childs = selected.flatMap(s => s?.children?.map(c => c.id))
                if (item.referenced) {
                  if(
                    !(childs.includes(item?.parent?.id)) &&
                    !(selected.map(s => s.id).includes(item.id))
                  ){
                    isReff = false
                  }
                }
                const selectedCard = (selected[index + 1])
                  ? selected[index + 1] === item
                  : selected.slice(0, 1).pop().children.length
                    ? (`${item.id}` === projectId && (selected.slice(0, 1).pop().children.map((c) => c.id === item.id).length))
                    : false
                return (
                  <Card
                    project={item}
                    onClick={() => toggleSelect(item, index)}
                    isProgram={selected[0].isMasterProgram && index === 0}
                    selected={selectedCard}
                    isReff={isReff}
                    {...{
                      filterCountry,
                      program,
                      countryFilter,
                      canCreateProjects,
                      isOldVersion
                    }}
                  />
                )
              })}
            </Column>
          )
        })}
        <ColPlaceholder {...{selected}} />
      </div>
      </div>
    </div>
  )
}

const ColPlaceholder = ({ selected }) => {
  const { t } = useTranslation()
  const hasNextLevel = selected.length > 0 && selected[selected.length - 1]?.children?.filter(it => it?.children?.length > 0)?.length > 0
  if(!hasNextLevel) return null
  return [
    <div className="col placeholder">
      <h3>{t('Level {{level}} projects', { level: selected.length + (selected[0].isMasterProgram ? 0 : 1) })}</h3>
      <div className="bg">
        {(selected[0].isMasterProgram && selected.length === 1) ? t('Select a programme') : t('Select a level {{level}} project with children', { level: selected.length - 1 + (selected[0].isMasterProgram ? 0 : 1) })}
      </div>
    </div>
  ]
}

export default connect(({ userRdr }) => ({ userRdr }))(Hierarchy)
