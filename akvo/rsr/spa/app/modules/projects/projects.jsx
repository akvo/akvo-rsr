/* global window, document */
import React from 'react'
import { Button, Divider, Icon, Radio, Dropdown, Menu, Modal, Card, Checkbox, Switch } from 'antd'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { CancelToken } from 'axios'
import api from '../../utils/api'
import './styles.scss'
import TableView from './table-view'
import CardsView from './cards-view'
import Search from './search'
import FilterSector from './filter-sector'
import FilterCountry from './filter-country'
import { shouldShowFlag, flagOrgs } from '../../utils/feat-flags'

const pageSize = 16
const pageSizeCards = 32
let tmid
let source
const Aux = node => node.children

class Projects extends React.Component{
  state = {
    results: [], loading: false, pagination: { pageSize }, viewMode: 'table', hasMore: true, params: {}, filterProgram: null
  }
  componentDidMount(){
    this.fetch()
    document.title = `${this.props.t('Projects')} | Akvo RSR`
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
      params.show_restricted = 1;
      delete params.src
    }
    Object.keys(params).forEach(key => {
      if(params[key] === '') delete params[key]
    })
    params.page = this.state.viewMode === 'table' ? this.state.pagination.current : page
    if(this.state.filterProgram !== null){
      params.filter_program = this.state.filterProgram
    }
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
  handleNewProjectChoice = ({key}) => {
    if(key === 'standalone'){
      this.props.history.push('/projects/new')
    } else if(key === 'contributing'){
      if (this.props.userRdr.programs.length === 1){
        this.props.history.push(`/programs/${this.props.userRdr.programs[0].id}/hierarchy`)
      } else {
        this.setState({ showProgramSelectModal: true })
      }
    }
  }
  handleNewProgramProject = () => {
    if (this.props.userRdr.programs.length === 1) {
      this.props.history.push(`/programs/${this.props.userRdr.programs[0].id}/hierarchy`)
    } else {
      this.setState({ showProgramSelectModal: true })
    }
  }
  handleProgramFilter = (programId) => async (on) => {
    if (on && this.state.filterProgram !== programId){
      await this.setState({ filterProgram: programId })
      this.fetch()
    }
    else if (!on && this.state.filterProgram === programId){
      await this.setState({ filterProgram: null })
      this.fetch()
    }
  }
  render(){
    const { t, userRdr } = this.props
    // only for selected org users
    const showNewFeature = !shouldShowFlag(userRdr.organisations, flagOrgs.DISABLE_FAC)
    const canCreateProjects = userRdr.organisations && userRdr.organisations.findIndex(it => it.canCreateProjects) !== -1
    const hasPrograms = userRdr && userRdr.programs && userRdr.programs.filter(it => it.canCreateProjects).length > 0
    const enforceProgramProjects = userRdr && userRdr.organisations && userRdr.organisations.length > 0 && userRdr.organisations.reduce((acc, val) => val.enforceProgramProjects && acc, true)
    return (
      <div id="projects-view">
        {userRdr.programs.length > 0 &&
        <header>
          <div>
            <span>My programs</span>
            <Link to="/programs/new/editor">+ Add program</Link>
          </div>
          <div className="scrollview">
            <div className={classNames('carousel', { filtered: this.state.filterProgram !== null})}>
            {userRdr.programs.map(program =>
            <Card className={classNames({selected: this.state.filterProgram === program.id})}>
              <Link to={`/programs/${program.id}`}>{program.name}</Link>
              <span>{program.projectCount} projects</span>
              <div className="bottom">
                <Switch checked={this.state.filterProgram === program.id} size="small" onChange={this.handleProgramFilter(program.id)} />
                only show related projects below
              </div>
            </Card>
            )}
            <Card className={classNames('standalone', { selected: this.state.filterProgram === -1 })}>
              Standalone projects
              <div className="bottom">
                <Switch checked={this.state.filterProgram === -1} size="small" onChange={this.handleProgramFilter(-1)} />
                only show standalone projects below
              </div>
            </Card>
            </div>
          </div>
        </header>
        }
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
            {canCreateProjects &&
              <Aux>
                {!hasPrograms && <Link className="add-project-btn" to="/projects/new"><Button type="primary" icon="plus">{t('Create new project')}</Button></Link>}
                {(hasPrograms && !enforceProgramProjects) &&
                  <Dropdown overlay={
                    <Menu onClick={this.handleNewProjectChoice}>
                      <Menu.Item key="standalone"><Icon type="plus" />Standalone project</Menu.Item>
                      <Menu.Divider />
                      {userRdr.programs.length >= 1 &&
                        <Menu.Item key="contributing"><Icon type="apartment" />Contributing project</Menu.Item>
                      }
                    </Menu>
                  }
                    trigger={['click']}>
                    <Button type="primary" icon="plus">{t('Create new project')}</Button>
                  </Dropdown>
                }
                {hasPrograms && enforceProgramProjects &&
                  <Button type="primary" icon="plus" onClick={this.handleNewProgramProject}>{t('Create new project')}</Button>
                }
              </Aux>
            }
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
          {...{ showNewFeature }}
        />
        }
        <Modal
          visible={this.state.showProgramSelectModal}
          onCancel={() => this.setState({ showProgramSelectModal: false })}
          title="Which program do you want to add the project to"
          footer={null}
          className="select-program-modal"
        >
          <ul>
            {userRdr && userRdr.programs && userRdr.programs.map(it => <li key={it.id}><Link to={`/programs/${it.id}/hierarchy`}>{it.name}</Link></li>)}
          </ul>
        </Modal>
      </div>
    )
  }
}

export default withRouter(withTranslation()(connect(({ userRdr }) => ({ userRdr }))(Projects)))
