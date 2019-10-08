/* global window */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Divider, Table, Input, Icon, Tag } from 'antd'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import VOCAB_1_CODES from '../editor/section8/vocab-1-codes.json'
import VOCAB_2_CODES from '../editor/section8/vocab-2-codes.json'
import api from '../../utils/api'
import './styles.scss'

let tmid
const pageSize = 15

const ConditionalLink = connect(({ userRdr: {lang}}) => ({ lang }))(({ record, children, lang }) => {
  if(record.status === 'unpublished' && record.editable){
    return(
      <Link to={`/projects/${record.id}`}>
      {children}
      </Link>
    )
  }
  return (
    <a href={`/${lang}/myrsr/my_project/${record.id}/`}>{children}</a>
  )
})

class Projects extends React.Component{
  state = {
    results: [], loading: false, pagination: { pageSize }, searchStr: ''
  }
  componentDidMount(){
    this.fetch()
  }
  fetch = (params = {}) => {
    this.setState({ loading: true })
    if (this.state.searchStr !== '') {
      params = {
        ...params,
        q_filter1: { title__icontains: this.state.searchStr },
        q_filter2: { subtitle__icontains: this.state.searchStr },
      }
      if(!Number.isNaN(Number(this.state.searchStr))){
        params.q_filter3 = { id: this.state.searchStr }
      }
    }
    api.get('/my_projects/', { ...params, limit: pageSize })
      .then(({ data }) => {
        const pagination = { ...this.state.pagination }
        pagination.total = data.count
        this.setState({
          results: data.results,
          pagination,
          loading: false
        })
      })
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({ page: pagination.current })
    window.scroll({ top: 150, left: 0, behavior: 'smooth' })
  }
  handleSearch = ({ target: { value } }) => {
    clearTimeout(tmid)
    this.setState({ searchStr: value })
    tmid = setTimeout(() => {
      this.setState({
        loading: true,
        pagination: { ...this.state.pagination, current: 1 }
      })
      this.fetch({ page: 1 })
    }, 200)
  }
  clearSearch = () => {
    this.setState({ searchStr: '', pagination: { ...this.state.pagination, current: 1 } })
    setTimeout(() => this.fetch({ page: 1 }), 100)
  }
  render(){
    const { t } = this.props
    const columns = [
      {
        title: t('Privacy'),
        dataIndex: 'isPublic',
        key: 'isPublic',
        width: 75,
        render: (value) => {
          return <Icon type={value ? 'eye' : 'eye-invisible'} />
        }
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value) => (<span>{value}</span>)
      },
      {
        title: t('Project'),
        dataIndex: 'title',
        key: 'title',
        className: 'project-title',
        render: (text, record) => (
          <div>
            <ConditionalLink record={record}>
              {text !== '' ? text : t('Untitled project')}
            </ConditionalLink>
            {record.parent !== null && (<span className="parent-tag">Part of: <a href="#">{record.parent.title}</a></span>)/* eslint-disable-line */} 
            { record.subtitle !== '' && <small><br />{record.subtitle}</small> }
          </div>
        )
      },
      {
        title: t('Sector'),
        dataIndex: 'sectors',
        key: 'sectors',
        render: (sectors) => {
          return (<small>{sectors.map(sector => sector.codeLabel).join(', ')}</small>)
        }
      },
      {
        title: t('Location'),
        dataIndex: 'primaryLocation.countryLabel',
        key: 'location',
        width: 170,
        render: (text, record) => {
          const listOfUniqueCountries = record.locations.map(it => it.country).reduce((acc, val) => { if (acc.indexOf(val) === -1) return [...acc, val]; return acc }, []).join(', ')
          return (<span>{listOfUniqueCountries}</span>)
        }
      }
    ]
    return (
      <div id="projects-view">
        <div style={{ display: 'flex' }}>
          <h2>{t('My projects')}</h2>
          <Input value={this.state.searchStr} suffix={this.state.searchStr === '' ? <Icon type="search" /> : <Icon onClick={this.clearSearch} type="close" />} placeholder={t('Find a project...')} onChange={this.handleSearch} />
          <Link className="add-project-btn" to="/projects/new"><Button type="primary" icon="plus">{t('Create new project')}</Button></Link>
        </div>
        <Divider />
        <Table
          dataSource={this.state.results}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default withTranslation()(Projects)
