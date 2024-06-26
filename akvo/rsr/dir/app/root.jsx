/* global window */
import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Index from './modules/index/view'
import UnepIndex from './modules/unep-index/view'
// eslint-disable-next-line no-unused-vars
import WcaroRouter from './modules/wcaro-index/router'
import ProjectPage from './modules/project-page/ProjectPage'
import scheduleDemo from './modules/schedule-demo'
import { Home } from './modules/home'
import { isPartnerSites } from './utils/misc'

export default () => {
    const isUNEP = window.location.href.indexOf('//unep.') !== -1
    // eslint-disable-next-line no-unused-vars
    const isWcaro = window.location.href.indexOf('//wcaro.') !== -1
    const isPartner = isPartnerSites()
    return (
        <Router basename="/">
            <Route path="/" exact component={isUNEP ? UnepIndex : isPartner ? Index : Home} />
            <Route path="/project-directory">
                {/* Added to avoid breaking URLs in browser history */}
                <Redirect to="/" />
            </Route>
            <Route path="/dir/project/:projectId" component={ProjectPage} />
            <Route path="/dir/schedule-demo" component={scheduleDemo} />
        </Router>
    )
}
