import React, { useEffect, useState } from 'react'
import { Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

export default ({ close }) => {
  const [project, setProject] = useState(null)
  useEffect(() => {
    api.get('my_projects/?limit=1&filter={"publishingstatus__status":"published"}')
    .then((d) => {
      if(d?.data?.results.length > 0) {
        setProject(d.data.results[0])
      }
    })
  }, [])
  return (
    <div>
      <h3>Improved Results tab</h3>
      <p>An easier way to manage your results data and report on your indicators in now available!</p>
      {project != null &&
        <Link to={`/projects/${project.id}/results`}><Button type="primary" onClick={close}>Check it out</Button></Link>
      }
    </div>
  )
}
