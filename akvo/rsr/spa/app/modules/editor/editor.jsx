import React from 'react'
import { connect } from 'react-redux'
import {Route, Link, Redirect} from 'react-router-dom'
import { Icon, Button, Spin, Tabs, Tooltip, Skeleton } from 'antd'
import TimeAgo from 'react-time-ago'

import sections from './sections'
import MainMenu from './main-menu'
import Settings from './settings/settings'
import * as actions from './actions'
import './styles.scss'
import ProjectInitHandler from './project-init-handler'

const { TabPane } = Tabs

class _Section extends React.Component{
  componentDidMount(){
    setTimeout(() => this.props.touchSection(this.props.sectionIndex), 100)
  }
  shouldComponentUpdate(nextProps){
    if(this.props.params.id === 'new') return false
    const sectionKey = `section${this.props.sectionIndex}`
    return nextProps.editorRdr[sectionKey].isFetched !== this.props.editorRdr[sectionKey].isFetched
  }
  render(){
    const sectionKey = `section${this.props.sectionIndex}`
    if(this.props.params.id !== 'new' && this.props.editorRdr[sectionKey].isFetched === false){
      return <div className="view"><Skeleton active paragraph={{ rows: 7 }} /></div>
    }
    return this.props.children
  }
}
const Section = connect(({ editorRdr }) => ({ editorRdr }), actions)(_Section)


const SavingStatus = connect(
  ({ editorRdr: { saving, lastSaved, backendError } }) => ({ saving, lastSaved, backendError })
)(({ saving, lastSaved, backendError }) => (
  <aside className="saving-status">
    {saving && (
      <div>
        <Spin />
        <span>Saving...</span>
      </div>
    )}
    {(!saving && lastSaved !== null && backendError === null) && (
      <div>
        <Icon type="check" />
        <span>Saved <TimeAgo date={lastSaved} formatter={{ unit: 'minute' }} /></span>
      </div>
    )}
    {(!saving && backendError !== null) && (
      <div className="error">
        <Tooltip title={<span>{backendError.message}<br />{JSON.stringify(backendError.response)}</span>}><Icon type="warning" /><span>Something went wrong</span></Tooltip>
      </div>
    )}
  </aside>
))

const PublishingBar = connect(({ editorRdr: { section1: {fields: {publishingStatus}}}}) => ({ publishingStatus }))(({ publishingStatus }) => {
  if(publishingStatus === 'unpublished') {
    return (
      <div className="content">
        <Button type="primary" disabled>Publish</Button>
        <i>The project is unpublished</i>
      </div>
    )
  }
  return (
    <div className="content">
      <Button type="danger">Unpublish</Button>
      <i>The project is published</i>
    </div>
  )
})

const _Header = ({title}) => (
  <header className="main-header">
    <Link to="/projects"><Icon type="left" /></Link>
    <h1>{title ? title : 'Untitled project'}</h1>
    <Tabs size="large" defaultActiveKey="4">
      <TabPane tab="Results" key="1" />
      <TabPane tab="Updates" key="2" />
      <TabPane tab="Reports" key="3" />
      <TabPane tab="Editor" key="4" />
    </Tabs>
  </header>
)
const Header = connect(({ editorRdr: { section1: { fields: { title } }} }) => ({ title }))(_Header)


const Editor = ({ match: { params } }) => (
  <div>
    <Header />
    <div className="editor">
      <div className="status-bar">
        <SavingStatus />
        <MainMenu params={params} />
        <PublishingBar />
      </div>
      <div className="main-content">
        <Route path="/projects/:id" component={ProjectInitHandler} />
        <Route path="/projects/:id" exact render={() => <Redirect to={`/projects/${params.id}/settings`} />} />
        <Route path="/projects/:id/settings" exact component={Settings} />
        {sections.map((section, index) =>
          <Route
            path={`/projects/:id/${section.key}`}
            exact
            render={(props) => {
              const Comp = section.component
              return <Section {...props} params={params} sectionIndex={index + 1}><Comp /></Section>
            }}
          />)
        }
      </div>
      <div className="alerts" />
    </div>
  </div>
)

export default Editor
