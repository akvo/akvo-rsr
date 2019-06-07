import React from 'react'
import { connect } from 'react-redux'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import { Icon, Button, Spin } from 'antd'
import moment from 'moment'
import TimeAgo from 'react-time-ago'

import sections from './sections'
import MainMenu from './main-menu'
import Settings from './settings/settings'
import {touchSection} from './actions'
import './styles.scss'


class _Section extends React.Component{
  componentWillMount(){
    this.props.touchSection(this.props.sectionIndex)
  }
  render(){
    return this.props.children
  }
}
const Section = connect(null, {touchSection})(_Section)

const basePath = process.env.DETACHED_FE ? '/' : '/my-rsr'

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

const Editor = () => (
  <Router basename={basePath}>
    <div className="editor">
      <div className="status-bar">
        <SavingStatus />
        <MainMenu />
        <div className="content">
          <Button type="primary" disabled>Publish</Button>
          <i>The project is unpublished</i>
        </div>
      </div>
      <div className="main-content">
        <Route path="/" exact component={Settings} />
        {sections.map((section, index) =>
          <Route
            path={`/${section.key}`}
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
  </Router>
)

export default Editor
