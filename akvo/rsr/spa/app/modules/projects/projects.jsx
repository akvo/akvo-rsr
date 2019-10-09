/* global window */
import React from 'react'
import { Button, Divider, Input, Icon, Radio } from 'antd'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import './styles.scss'
import TableView from './table-view'
import CardsView from './cards-view'
// import CardsView from './cards-view'

let tmid
const pageSize = 16

class Projects extends React.Component{
  state = {
    results: [], loading: false, pagination: { pageSize }, searchStr: '', viewMode: 'table'
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
    return (
      <div id="projects-view">
        <div className="topbar-row">
          {/* <h2>{t('My projects')}</h2> */}
          <Radio.Group value={this.state.viewMode} onChange={({ target: {value}}) => this.setState({ viewMode: value })}>
            <Radio.Button value="table"><Icon type="unordered-list" /></Radio.Button>
            <Radio.Button value="cards"><Icon type="appstore" /></Radio.Button>
          </Radio.Group>
          <Input value={this.state.searchStr} suffix={this.state.searchStr === '' ? <Icon type="search" /> : <Icon onClick={this.clearSearch} type="close" />} placeholder={t('Find a project...')} onChange={this.handleSearch} />
          <Link className="add-project-btn" to="/projects/new"><Button type="primary" icon="plus">{t('Create new project')}</Button></Link>
        </div>
        <Divider />
        {this.state.viewMode === 'table' &&
        <TableView
          dataSource={this.state.results}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        }
        {this.state.viewMode === 'cards' &&
        <CardsView
          dataSource={this.state.results}
          loading={this.state.loading}
        />
        }
      </div>
    )
  }
}

export default withTranslation()(Projects)
