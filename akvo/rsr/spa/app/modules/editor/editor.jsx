import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {Route, Link, Redirect} from 'react-router-dom'
import { Icon, Button, Spin, Tabs } from 'antd'
import TimeAgo from 'react-time-ago'

import sections from './sections'
import MainMenu from './main-menu'
import Settings from './settings/settings'
import {touchSection, setProjectId} from './actions'
import './styles.scss'

const { TabPane } = Tabs

class _Section extends React.Component{
  componentWillMount(){
    this.props.touchSection(this.props.sectionIndex)
  }
  render(){
    return this.props.children
  }
}
const Section = connect(null, {touchSection})(_Section)


const SavingStatus = connect(
  ({ editorRdr: { saving, lastSaved } }) => ({ saving, lastSaved })
)(({ saving, lastSaved }) => (
  <aside className="saving-status">
    {saving && (
      <div>
        <Spin />
        <span>Saving...</span>
      </div>
    )}
    {(!saving && lastSaved !== null) && (
      <div>
        <Icon type="check" />
        <span>Saved <TimeAgo date={lastSaved} formatter={{ unit: 'minute' }} /></span>
      </div>
    )}
  </aside>
))


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

const ProjectInitHandler = connect(null, {setProjectId})(({ match: {params}, ...props}) => {
  useEffect(() => {
    if(params.id !== 'new'){
      props.setProjectId(params.id)
      // fetch sections
    }
  }, [])
  return null
})

const Editor = ({ match: { params } }) => (
  <div>
    <Header />
    <div className="editor">
      <div className="status-bar">
        <SavingStatus />
        <MainMenu params={params} />
        <div className="content">
          <Button type="primary" disabled>Publish</Button>
          <i>The project is unpublished</i>
        </div>
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
              return <Section {...props} sectionIndex={index + 1}><Comp /></Section>
            }}
          />)
        }
      </div>
      <div className="alerts" />
    </div>
  </div>
)

export default Editor
