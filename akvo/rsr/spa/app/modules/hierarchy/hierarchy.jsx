import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Spin, Icon, Button, Card as AntCard, Typography } from 'antd'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import uniqBy from 'lodash/uniqBy'

import './styles.scss'
import Column from './column'
import Card from './card'
import FilterCountry from '../projects/filter-country'
import { getFlatten, makeATree } from '../../utils/misc'
import {
  getChildrenApi,
  getProgramApi,
  getProjectsApi,
} from './services'

const { Text } = Typography

const Hierarchy = ({ match: { params }, program, userRdr, asProjectTab }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState({
    fetched: true,
    created: true,
    build: true,
  })
  const [countryFilter, setCountryFilter] = useState(null)
  const [programs, setPrograms] = useState([])
  const [projects, setProjects] = useState(null)
  const [children, setChildren] = useState([])
  const projectId = params.projectId || params.programId
  const programId = selected.map((s) => s.id).slice(0, 1).pop()
  const canCreateProjects = (
    userRdr.programs &&
    userRdr
      .programs
      .findIndex(it => (it.id === Number(projectId) || it.id === Number(programId)) && it.canCreateProjects) !== -1
  )
  const isOldVersion = false
  const handleOnChildren = async (_items, callback = undefined) => {
    let values = await Promise.all(_items)
    values = values?.flatMap((v) => v)
    const _childs = uniqBy([...children, ...values], 'id')
    const _programs = makeATree([...programs, ..._childs])

    if (callback) callback(_programs)

    setChildren(_childs)
  }

  const toggleSelect = async (item, colIndex) => {
    const itemIndex = selected.findIndex(it => it === item)
    if(itemIndex !== -1){
      setSelected(selected.slice(0, colIndex + 1))
    }
    if(canCreateProjects) {
      setSelected([...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected), item])
    }
    if (item?.children === undefined && item?.childrenCount) {
      setLoading(true)
      const _children = getChildrenApi(item.id)
      handleOnChildren([_children], (data) => {
        setPrograms(data)
        const flatten = getFlatten(data)
        const _existing = flatten?.filter((f) => selected[colIndex] && colIndex === 0
          ? selected[colIndex]?.id === f?.id
          : selected?.map((s) => s?.id)?.includes(f?.id)
        )
        let _project = flatten?.find((f) => f?.id === item.id)
        _project = { ..._project, children: _project?.children || [] }
        const lastItem = _existing[_existing?.length - 1]
        const _selected = (
            lastItem?.parent?.id === item?.parent?.id
          ) // Check if the current item is on the same level as the last item that existed
          ? [
            ..._existing?.slice(0, -1),
            _project
          ]
          : [
            ..._existing,
            _project
          ]
        setSelected(_selected)
        setLoading(false)
      })
    }
  }
  const selectProgram = (item) => {
    setLoading(true)
    const _children = getChildrenApi(item.id)
    handleOnChildren([_children], (data) => {
      setSelected(data)
      setLoading(false)
    })
  }

  const handleOnFetchProgram = _projectID => {
    getProgramApi(
      _projectID,
      (data) => {
        if (!projects) {
          setLoading(false)
        }
        setPrograms(data)
      },
      (err) => {
        if (err.response.status === 404) {
          getProjectsApi(
            _projectID,
            (data) => setProjects(data),
            () => setLoading(false)
          )
        } else {
          setLoading(false)
        }
      },
    )
  }

  useEffect(() => {
    if (projectId && !projects && preload.fetched) {
      /**
       * Get a master programme
       */
      handleOnFetchProgram(projectId)
      setPreload({
        ...preload,
        fetched: false,
      })
    }
    if (projects && !preload.fetched && preload.created) {
      setPreload({
        ...preload,
        created: false,
      })
      const _children = projects.map((project, px) => {
        if (px === 0) {
          /**
           * Get a master programme
           */
          handleOnFetchProgram(project.id)
        }
        return getChildrenApi(project.id)
      })
      handleOnChildren(_children)
    }

    if (
      projects
      && programs?.length
      && children?.length
      && !preload.fetched && !preload.created && preload.build
    ) {
      setPreload({
        ...preload,
        build: false,
      })
      /**
       * get all parent projects by starting them from the 2nd item.
       * becuase the 1st item is a programme.
       */
      const _programs = makeATree([...programs, ...children])
      const _flatten = getFlatten(_programs)
      const projectIDs = projects?.slice(1).map((p) => p?.id)
      const _selected = _flatten?.filter((f) => projectIDs?.includes(f?.id))
      setSelected([
        ..._programs,
        ..._selected,
      ])
      setLoading(false)
    }
    if (loading && projects && programs?.length === 0 && children?.length === 0) {
      setPrograms(projects)
      setLoading(false)
    }
  }, [preload, programs, children, projects, selected])

  const filterCountry = (item) => countryFilter
  ? (
    item.locations.findIndex(it => it.isoCode === countryFilter) !== -1 ||
    item.recipientCountries.findIndex(it => it.country.toLowerCase() === countryFilter) !== -1
  )
  : true

  const countries = Array.from({ length: selected?.length || 0 })
    ?.map((_, sx) => {
      return selected[sx]
        ?.children
        ?.map(it => [
          ...it?.locations?.map(i => i?.isoCode),
          ...it?.recipientCountries?.map(i => i?.country?.toLowerCase())
        ]
        ?.filter((value, index, self) => self.indexOf(value) === index))
    })
    ?.flatMap((s) => s)
    ?.filter((v) => v?.length)
  return (
    <div className={classNames('hierarchy', {noHeader: program, asProjectTab })}>
      {(!program && !asProjectTab) &&
      <div className="topbar-row">
        <h2>{t('Projects hierarchy')}</h2>
      </div>
      }
      {((selected?.length <= 2) && loading) && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div id="react-no-print">
      <div className="board">
        {programs.length > 0 &&
        <Column isLast={selected.length === 0} {...{loading, selected, countryFilter}} index={-1} extra={!loading && <FilterCountry size="small" onChange={setCountryFilter} items={countries} />}>
          {programs.map(parent => (
            <Card
              {...{
                countryFilter,
                filterCountry,
                isOldVersion
              }}
              isProgram
              project={parent}
              onClick={() => selectProgram(parent)}
              selected={(selected[0] && selected[0].id === parent.id) || Number(projectId) === parent.id}
            />
          ))}
        </Column>
        }
        {selected.map((col, index) => {
          if (col?.children?.length && countryFilter && (!col?.children?.filter(filterCountry)?.length)) {
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
              {(canCreateProjects && (!selected[0]?.isMasterProgram || index > 0)) && (
                <li className="card create">
                  <Link to={`/projects/new/settings?parent=${selected[index].id}&program=${selected[0].id}`}>
                    <Button icon="plus">
                      {t('New Contributing Project')}
                    </Button>
                  </Link>
                </li>
              )}
              {program && canCreateProjects && (selected[0]?.isMasterProgram && index === 0) && <div className="card create"><Link to={`/programs/new/editor/settings?parent=${selected[index].id}&program=${selected[0].id}`}><Button icon="plus">{t('New Program')}</Button></Link></div>}
              {col?.children?.filter(filterCountry)?.map(item => {
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
                const selectedCard = (
                  [...selected?.map((s) => s?.id)]?.includes(item?.id) ||
                  (`${item.id}` === projectId && (selected.slice(0, 1).pop().children.map((c) => c.id === item.id).length))
                )
                return (
                  <Card
                    project={item}
                    onClick={() => toggleSelect(item, index)}
                    isProgram={selected[0]?.isMasterProgram && index === 0}
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
