/* global window */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Icon, Spin } from 'antd'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import InfiniteScroll from 'react-infinite-scroller'
import logoPng from '../../images/logo3.png'

const pageSize = 20
let allowShowMore = true
const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1
const urlPrefix = isLocal ? 'http://rsr.akvo.org' : ''
const isRSR = window.location.host.split('.')[0] === 'rsr'

const Projects = ({ projects = [], loading, show, setShow, ulRef }) => {
  const [visibleProjects, setVisibleProjects] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [trickie, setTrickie] = useState(0)
  useEffect(() => {
    // console.log(projects.length, projects)
    setVisibleProjects(projects.slice(0, pageSize))
    setHasMore(projects.length > pageSize)
    ulRef.current.scroll({top: 0})
  }, [projects])
  const showMore = (page) => {
    if(allowShowMore){
      allowShowMore = false
      console.log('slice', page * pageSize, page * pageSize + pageSize)
      setVisibleProjects([...visibleProjects, ...projects.slice(page * pageSize, page * pageSize + pageSize)])
      setHasMore(projects.length > page * pageSize + pageSize)
      setTimeout(() => { allowShowMore = true; setTrickie(trickie + 1) }, 1000)
    }
  }
  return [
    <div className={classNames('projects', { on: show })}>
      <div className="expander" role="button" tabIndex={-1} onClick={() => setShow(!show)}>
        <Icon type="caret-right" />
      </div>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} /></div>}
      <ul ref={ulRef}>
        <InfiniteScroll
          pageStart={0}
          loadMore={showMore}
          threshold={250}
          hasMore={hasMore}
          loader={null}
          useWindow={false}
          getScrollParent={() => ulRef.current}
          trickie={trickie} // tricking this comp that there's been an update
        >
        <div className="sort-label">Most active projects {isRSR && 'in RSR'}</div>
        {projects.length > 0 &&
        <TransitionGroup component={null}>
        {visibleProjects.map((project) =>
          <CSSTransition
            key={project.id}
            timeout={500}
            classNames="project"
          >
          <li>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <div className="img">
                <img src={`${project.image}`} />
              </div>
            <h3>{project.title}</h3>
            <div className="locations">
              {project.countries.join(', ')}
            </div>
            </a>
          </li>
          </CSSTransition>
        )}
        </TransitionGroup>
        }
        </InfiniteScroll>
      </ul>
      <footer>
        <a href="//akvo.org"><img src={logoPng} /></a>
        <ul>
          <li><a href="http://akvo.org/products/rsr/">About</a></li>
          <li><a href="http://akvo.org/help/akvo-policies-and-terms-2/akvo-rsr-terms-of-use/">Terms</a></li>
          <li><a href="https://github.com/akvo/akvo-rsr/wiki/RSR_Partner-API">API</a></li>
          <li><a href="http://rsrsupport.akvo.org/">Support</a></li>
          <li><a href="https://github.com/akvo/akvo-rsr">Source &nbsp;<Icon type="github" /></a></li>
        </ul>
      </footer>
    </div>,
    <div className={classNames('projects-placeholder', {on: show})} />
  ]
}

export default Projects
