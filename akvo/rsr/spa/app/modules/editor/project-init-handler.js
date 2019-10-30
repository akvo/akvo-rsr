import { useEffect } from 'react'
import { connect } from 'react-redux'
import api from '../../utils/api'
import { endpoints, getTransform } from './endpoints'
import * as actions from './actions'

const insertRouteParams = (route, params) => {
  Object.keys(params).forEach(param => {
    route = route.replace(`:${param}`, params[param])
  })
  return route
}
let prevParams

const ProjectInitHandler = connect(null, actions)(({ match: {params}, ...props}) => {
  const fetchSection = (sectionIndex) => new Promise(async (resolve, reject) => {
    if(sectionIndex === 4 || sectionIndex === 6 || sectionIndex === 7 || sectionIndex === 8 || sectionIndex === 10){
      props.fetchSectionRoot(sectionIndex)
    }
    if(sectionIndex === 4){
      resolve()
      return
    }
    const _endpoints = endpoints[`section${sectionIndex}`]
    // fetch root
    if(_endpoints.hasOwnProperty('root')){
      await api.get(insertRouteParams(_endpoints.root, { projectId: params.id }))
        .then(({data}) => props.fetchFields(sectionIndex, data))
    }
    // fetch sets
    const setEndpoints = Object
      .keys(_endpoints)
      .filter(it => it !== 'root' && it.indexOf('.') === -1)
      .map(it => ({ setName: it, endpoint: _endpoints[it]}))
    if(setEndpoints.length > 0) {
      const fetchSet = (index) => {
        const { endpoint, setName } = setEndpoints[index]
        const _params = endpoint === '/project_location/' ? {location_target: params.id} : {project: params.id}
        const _endpoint = endpoint === '/related_project/' ? `${endpoint}?relation=1` : endpoint
        _params.limit = 300
        api.get(_endpoint, _params, getTransform(sectionIndex, setName, 'response'))
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
  let nextSectionIndex = 0
  const fetchNextSection = () => {
    nextSectionIndex += 1
    fetchSection(nextSectionIndex)
    .then(() => {
      props.setSectionFetched(nextSectionIndex)
      if(nextSectionIndex < 11){
        fetchNextSection()
      }
    })
  }
  useEffect(() => {
    if (prevParams && prevParams.id !== params.id && params.id !== 'new'){
      fetchSection(3)
    }
  }, [params.id])
  useEffect(() => {
    prevParams = params
  })
  useEffect(() => {
    if (params.id !== 'new') {
      props.setProjectId(params.id)
      fetchNextSection()
    } else {
      props.resetProject()
    }
  }, [])
  return null
})

export default ProjectInitHandler
