import { useEffect } from 'react'
import { connect } from 'react-redux'
import api from '../../utils/api'
import { endpoints, getTransform } from './endpoints'
import * as actions from './actions'
import sections from './sections'

const insertRouteParams = (route, params) => {
  Object.keys(params).forEach(param => {
    route = route.replace(`:${param}`, params[param])
  })
  return route
}
let prevParams
let sectionIndexPipeline = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

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
    fetchSection(sectionIndexPipeline[nextSectionIndex])
    .then(() => {
      props.setSectionFetched(sectionIndexPipeline[nextSectionIndex])
      if (nextSectionIndex < 10) {
        nextSectionIndex += 1
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
      if(params.section != null){
        const index = sections.findIndex(it => it.key === params.section)
        if(index > 0){
          sectionIndexPipeline = [1, sectionIndexPipeline[index], ...sectionIndexPipeline.slice(1).filter((it, itIndex) => index !== itIndex)]
        }
      }
      fetchNextSection()
    } else {
      props.resetProject()
    }
  }, [])
  return null
})

export default ProjectInitHandler
