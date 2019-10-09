/* global window */
import React from 'react'
import { Button, Divider, Icon, Radio } from 'antd'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import './styles.scss'
import TableView from './table-view'
import CardsView from './cards-view'
import Search from './search'

const pageSize = 16
const pageSizeCards = 32

class Projects extends React.Component{
  state = {
    results: [], loading: false, pagination: { pageSize }, viewMode: 'cards', hasMore: true
  }
  componentDidMount(){
    this.fetch()
  }
  fetch = (params = {}, mode = 'paginate') => {
    this.setState({ loading: true })
    const { viewMode } = this.state
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
    api.get('/my_projects/', { ...params, limit: viewMode === 'table' ? pageSize : pageSizeCards })
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
  showMore = (page) => {
    this.fetch({ page }, 'showmore')
  }
  handleSearch = (src) => {
    this.setState({
      loading: true,
      pagination: { ...this.state.pagination, current: 1 }
    })
    this.fetch({ page: 1, src })
    if (this.cardsViewRef) this.cardsViewRef.resetPage()
  }
  clearSearch = () => {
    this.setState({ pagination: { ...this.state.pagination, current: 1 } })
    setTimeout(() => this.fetch({ page: 1 }), 100)
  }
  render(){
    const { t } = this.props
    return (
      <div id="projects-view">
        <div className="topbar-row">
          <Radio.Group value={this.state.viewMode} onChange={({ target: {value}}) => this.setState({ viewMode: value })}>
            <Radio.Button value="table"><Icon type="unordered-list" /></Radio.Button>
            <Radio.Button value="cards"><Icon type="appstore" /></Radio.Button>
          </Radio.Group>
          <Search
            onChange={this.handleSearch}
            onClear={this.clearSearch}
            loading={this.state.loading}
          />
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
          onShowMore={this.showMore}
          hasMore={this.state.hasMore}
          setRef={ref => { this.cardsViewRef = ref }}
        />
        }
      </div>
    )
  }
}

export default withTranslation()(Projects)
