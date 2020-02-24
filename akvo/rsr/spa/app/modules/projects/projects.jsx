/* global window */
import React from 'react'
import { Button, Divider, Icon, Radio } from 'antd'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CancelToken } from 'axios'
import api from '../../utils/api'
import './styles.scss'
import TableView from './table-view'
import CardsView from './cards-view'
import Search from './search'
import FilterSector from './filter-sector'
import FilterCountry from './filter-country'

const pageSize = 16
const pageSizeCards = 32
let tmid
let source

class Projects extends React.Component{
  state = {
    results: [], loading: false, pagination: { pageSize }, viewMode: 'table', hasMore: true, params: {}
  }
  componentDidMount(){
    this.fetch()
  }
  fetch = (mode = 'paginate', page = 1) => {
    this.setState({ loading: true })
    const { viewMode } = this.state
    let params = {...this.state.params}
    if (params.src) {
      params = {
        ...params,
        q_filter1: { title__icontains: params.src },
        q_filter2: { subtitle__icontains: params.src },
      }
      if(!Number.isNaN(Number(params.src))){
        params.q_filter3 = { id: params.src }
      }
      delete params.src
    }
    Object.keys(params).forEach(key => {
      if(params[key] === '') delete params[key]
    })
    params.page = this.state.viewMode === 'table' ? this.state.pagination.current : page
    source = CancelToken.source()
    api.get('/my_projects/', { ...params, limit: viewMode === 'table' ? pageSize : pageSizeCards }, undefined, source.token)
      .then(({ data }) => {
        const pagination = { ...this.state.pagination }
        pagination.total = data.count
        this.setState({
          results: mode === 'paginate' ? data.results : [...this.state.results, ...data.results],
          pagination,
          loading: false,
          hasMore: data.count > (this.state.results.length + data.results.length)
        })
      })
    // console.log(req, Object.keys(req))
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    setTimeout(this.fetch)
    window.scroll({ top: 150, left: 0, behavior: 'smooth' })
  }
  showMore = (page) => {
    this.fetch('loadMore', page)
  }
  handleSearch = (src) => {
    this.setState({
      loading: true,
      pagination: { ...this.state.pagination, current: 1 },
      params: {...this.state.params, src}
    })
    clearTimeout(tmid)
    tmid = setTimeout(this.fetch, 500)
    source.cancel('Canceled by typing')
    if (this.cardsViewRef) this.cardsViewRef.resetPage()
  }
  clearSearch = () => {
    this.setState({ pagination: { ...this.state.pagination, current: 1 }, params: {...this.state.params, src: ''} })
    setTimeout(this.fetch, 100)
  }
  handleFilter = (param) => {
    this.setState({
      loading: true,
      pagination: { ...this.state.pagination, current: 1 },
      params: { ...this.state.params, ...param },
      results: []
    })
    setTimeout(this.fetch)
    if (this.cardsViewRef) this.cardsViewRef.resetPage()
  }
  handleModeChange = viewMode => {
    this.setState({ viewMode, results: [], loading: true })
    setTimeout(this.fetch)
  }
  render(){
    const { t, userRdr } = this.props
    const showNewFeature = userRdr.organisations && userRdr.organisations.findIndex(it => it.id === 42) !== -1
    return (
      <div id="projects-view">
        <div className="topbar-row">
          <Radio.Group value={this.state.viewMode} onChange={({ target: {value}}) => this.handleModeChange(value)}>
            <Radio.Button value="table"><Icon type="unordered-list" /></Radio.Button>
            <Radio.Button value="cards"><Icon type="appstore" /></Radio.Button>
          </Radio.Group>
          <Search
            onChange={this.handleSearch}
            onClear={this.clearSearch}
            loading={this.state.loading}
          />
          <div className="right-side">
            <span className="label">{t('Filter:')}</span>
            <FilterSector onChange={sector => this.handleFilter({ sector })} />
            <FilterCountry onChange={country => this.handleFilter({ country })} />
            <Link className="add-project-btn" to="/projects/new"><Button type="primary" icon="plus">{t('Create new project')}</Button></Link>
          </div>
        </div>
        <Divider />
        {this.state.viewMode === 'table' &&
        <TableView
          dataSource={this.state.results}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          {...{showNewFeature}}
        />
        }
        {this.state.viewMode === 'cards' &&
        <CardsView
          dataSource={this.state.results}
          loading={this.state.loading}
          onShowMore={this.showMore}
          hasMore={this.state.hasMore}
          setRef={ref => { this.cardsViewRef = ref }}
        />
        }
      </div>
    )
  }
}

export default withTranslation()(connect(({ userRdr }) => ({ userRdr }))(Projects))
