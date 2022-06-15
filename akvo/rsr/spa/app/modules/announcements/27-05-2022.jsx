/* global window */
import React, { useEffect, useState } from 'react'
import { Button, Divider } from 'antd'
import api from '../../utils/api'

export default ({ close }) => {
  const [project, setProject] = useState(null)
  useEffect(() => {
    api.get('my_projects/?limit=1&filter={"publishingstatus__status":"published"}')
      .then((d) => {
        if (d?.data?.results.length > 0) {
          setProject(d.data.results[0])
        }
      })
  }, [])
  return (
    <div>
      <h3>Better Results Overview</h3>
      <p>A simpler, more visual way to keep track of your indicator performance for individual projects.</p>
      {project != null &&
        <Button
          type="primary"
          onClick={() => {
            window.location.href = `/my-rsr/projects/${project.id}/results?o=announcement`
            close()
          }}
        >
          Check it out
        </Button>
      }
      <Divider />
      <h3>Indicator reporting via Enumerator webforms</h3>
      <p>{'Now M\&E managers can select specific indicators to assign to their team using simple webforms.'}</p>
      {project != null &&
        <Button
          type="primary"
          onClick={() => {
            window.location.href = `/my-rsr/projects/${project.id}/enumerators`
            close()
          }}
        >
          Check it out
        </Button>
      }
      <Divider />
      <h3>New landing page for RSR</h3>
      <p>{'We\'ve done a better job at sharing the potential of Akvo RSR.'}</p>
      {project != null &&
        <Button
          type="primary"
          onClick={() => {
            close()
            window.open('/', '_blank')
          }}
        >
          Check it out
        </Button>
      }
    </div>
  )
}
