import React, { useState } from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'

const Projects = ({ data }) => {
  const [showProjects, setShowProjects] = useState(true)
  return (
    <div className={classNames('projects', { on: showProjects })}>
      <div className="expander" role="button" tabIndex={-1} onClick={() => setShowProjects(!showProjects)}>
        <Icon type="caret-right" />
      </div>
      <ul>
        {data && data.projects.map(project =>
          <li>
            <div className="img" style={{ backgroundImage: `url(${project.image})` }} />
            <h3>{project.title}</h3>
            <div className="locations">
              {project.countries.join(', ')}
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Projects
