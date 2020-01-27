import React from 'react'
import classNames from 'classnames'
import { Icon, Spin } from 'antd'
import { useTransition, animated } from 'react-spring'
import logoPng from '../../images/logo3.png'

const Projects = ({ projects = [], loading, show, setShow, ulRef }) => {
  const transitions = useTransition(
    projects, // eslint-disable-line
    d => d.id,
    {
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: { opacity: 1, height: 135 }
    }
  )
  return [
    <div className={classNames('projects', { on: show })}>
      <div className="expander" role="button" tabIndex={-1} onClick={() => setShow(!show)}>
        <Icon type="caret-right" />
      </div>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} /></div>}
      <ul ref={ulRef}>
        {projects && transitions.map(({ props, item: project }) =>
          <animated.li style={props}>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
            <div className="img" style={{ backgroundImage: `url(${project.image})` }} />
            <h3>{project.title}</h3>
            <div className="locations">
              {project.countries.join(', ')}
            </div>
            </a>
          </animated.li>
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
