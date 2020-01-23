import React from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'
import logoPng from '../../images/logo3.png'

const Projects = ({ projects = [], show, setShow }) => {
  return [
    <div className={classNames('projects', { on: show })}>
      <div className="expander" role="button" tabIndex={-1} onClick={() => setShow(!show)}>
        <Icon type="caret-right" />
      </div>
      <ul>
        {projects && projects.map(project =>
          <li>
            <div className="img" style={{ backgroundImage: `url(${project.image})` }} />
            <h3>{project.title}</h3>
            <div className="locations">
              {project.countries.join(', ')}
            </div>
          </li>
        )}
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
