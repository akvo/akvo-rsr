/* global window */
import React, { useReducer, useEffect } from 'react'
import { Button, Divider, Table, Input, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import moment from 'moment'
import api from '../../utils/api'
import './styles.scss'

let tmid
const pageSize = 15

const Projects = () => {
  const { t } = useTranslation()
  const columns = [
    {
      title: 'Projects',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/projects/${record.id}`}>
          {text !== '' ? text : 'Untitled project'}
          {record.subtitle !== '' && <small><br />{record.subtitle}</small>}
        </Link>
      )
    },
    {
      title: 'Location',
      dataIndex: 'primaryLocation.countryLabel',
      key: 'location',
      width: 170,
      render: (text, record) => {
        const listOfUniqueCountries = record.locations.map(it => it.country).reduce((acc, val) => { if (acc.indexOf(val) === -1) return [...acc, val]; return acc }, []).join(', ')
        return (<span>{listOfUniqueCountries}</span>)
      }
    },
    {
      title: 'Date End (Planned)',
      dataIndex: 'dateEndPlanned',
      key: 'dateEndPlanned',
      width: 160,
      render: (text) => {
        return (<span>{text ? moment(text, 'YYYY-MM-DD').format('DD MMM YYYY') : '-'}</span>)
      }
    }
  ]
  const [state, setState] = useReducer(
    (state, newState) => { console.log({ ...state, ...newState }); return ({ ...state, ...newState })}, // eslint-disable-line
    { data: {}, loading: false, pagination: { pageSize }, searchStr: '' }
  )
  const fetch = (params = {}) => {
    setState({ loading: true })
    if(state.searchStr !== ''){
      params = {
        ...params,
        q_filter1: `{ 'title__icontains': '${state.searchStr}' }`,
        q_filter2: `{ 'subtitle__icontains': '${state.searchStr}' }`
      }
    }
    api.get('/editable_project/', {...params, limit: pageSize})
      .then(({data}) => {
        const pagination = { ...state.pagination }
        pagination.total = data.count
        setState({
          results: data.results,
          pagination,
          loading: false
        })
      })
  }
  useEffect(fetch, [])
  const handleTableChange = (pagination) => {
    const pager = { ...state.pagination }
    pager.current = pagination.current
    setState({
      pagination: pager
    })
    fetch({ page: pagination.current })
    window.scroll({ top: 150, left: 0, behavior: 'smooth' })
  }
  const handleSearch = ({ target: {value}}) => {
    clearTimeout(tmid)
    setState({ searchStr: value })
    tmid = setTimeout(() => {
      setState({
        loading: true,
        pagination: {...state.pagination, current: 1}
      })
      fetch({ page: 1 })
    }, 200)
  }
  const clearSearch = () => {
    setState({ searchStr: '', pagination: {...state.pagination, current: 1 }})
    fetch({ page: 1 })
  }
  return (
    <div>
      <div style={{ display: 'flex'}}>
        <h1>{t('My projects')}</h1>
        <Input value={state.searchStr} suffix={state.searchStr === '' ? <Icon type="search" /> : <Icon onClick={clearSearch} type="close" />} placeholder={t('Find a project...')} onChange={handleSearch} />
        <Link className="add-project-btn" to="/projects/new"><Button type="primary" icon="plus">{t('Create new project')}</Button></Link>
      </div>
      <Divider />
      <Table
        dataSource={state.results}
        columns={columns}
        loading={state.loading}
        pagination={state.pagination}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default Projects
