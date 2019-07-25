import React, { useReducer, useEffect } from 'react'
import { Button, Divider, Table } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import api from '../../utils/api'

const Projects = () => {
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
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { data: {}, loading: false, pagination: { pageSize: 30 } }
  )
  const fetch = (params = {}) => {
    setState({ loading: true })
    api.get('/editable_project/', params)
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
  }
  return (
    <div>
      <h1>My projects</h1>
      <Link to="/projects/new"><Button type="primary" icon="plus">Create new project</Button></Link>
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
