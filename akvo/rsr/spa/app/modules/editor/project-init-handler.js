import { useEffect } from 'react'
import { connect } from 'react-redux'
import api from '../../utils/api'
import { endpoints } from './endpoints'
import * as actions from './actions'

const insertRouteParams = (route, params) => {
  Object.keys(params).forEach(param => {
    route = route.replace(`:${param}`, params[param])
  })
  return route
}
const ProjectInitHandler = connect(null, actions)(({ match: {params}, ...props}) => {
  const fetchSection = (sectionIndex) => new Promise((resolve, reject) => {
    const _endpoints = endpoints[`section${sectionIndex}`]
    // fetch root
    if(_endpoints.hasOwnProperty('root')){
      api.get(insertRouteParams(_endpoints.root, { projectId: params.id }))
        .then(({data}) => props.fetchFields(sectionIndex, data))
    }
    // fetch sets
    const setEndpoints = Object.keys(_endpoints).filter(it => it !== 'root').map(it => ({ setName: it, endpoint: _endpoints[it]}))
    if(setEndpoints.length > 0) {
      const fetchSet = (index) => {
        const { endpoint, setName } = setEndpoints[index]
        api.get(endpoint, { project: params.id })
          .then(({ data: { results } }) => {
            props.fetchSetItems(sectionIndex, setName, results)
            if(index < setEndpoints.length - 1) fetchSet(index + 1)
            else resolve()
          })
      }
      fetchSet(0)
    }
    else resolve()
  })
  useEffect(() => {
    if(params.id !== 'new'){
      props.setProjectId(params.id)
      fetchSection(1).then(() => fetchSection(2).then(() => fetchSection(3)))
    }
  }, [])
  return null
})

export default ProjectInitHandler
