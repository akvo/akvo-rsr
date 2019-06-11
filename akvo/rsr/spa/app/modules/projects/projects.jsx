import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

const Projects = () => (
  <div>
    <h1>My projects</h1>
    <Link to="/projects/new"><Button>Create new project</Button></Link>
  </div>
)

export default Projects
