import React, { useEffect, useState } from 'react'
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

const SECTION_RESULTS_INDICATORS = 4;

let sectionIndexPipeline = [1, 2, 3, SECTION_RESULTS_INDICATORS, 5, 6, 7, 8, 9, 10, 11];
const SECTION_COUNT = sectionIndexPipeline.length;

const ProjectInitHandler = connect(({editorRdr}) => ({ editorRdr }), actions)(React.memo(({ match: {params}, ...props}) => {
  const [nextSectionIndex, setNextSectionIndex] = useState(0)

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
        let _params = endpoint === '/project_location/' ? {location_target: params.id} : {project: params.id}
        _params = endpoint?.includes('related_project') ? { ..._params, relation: 1 } : _params
        if (sectionIndex !== 6) _params.limit = 300
        api.get(endpoint, _params, getTransform(sectionIndex, setName, 'response'))
          .then(({ data: { results, count } }) => {
            if (sectionIndex === 7 && setName === 'locationItems') {
              props.fetchSetItems(sectionIndex, 'projectId', params.id, count)
            }
            props.fetchSetItems(sectionIndex, setName, results, count)
            if(index < setEndpoints.length - 1) fetchSet(index + 1)
            else resolve()
          })
          .catch(() => {
            resolve()
          })
      }
      fetchSet(0)
    }
    else resolve()
  })

  useEffect(() => {
    if (!props?.editorRdr[`section${nextSectionIndex + 1}`]?.isFetched) {
      fetchSection(sectionIndexPipeline[nextSectionIndex])
        .then(() => {
          if(nextSectionIndex >= SECTION_COUNT){
            return
          }
          if (nextSectionIndex === SECTION_RESULTS_INDICATORS) {
            /**
             * Results and indicator need 10s delay to avoid fields component errors.
             * I've created an issue related to this case
             */
            // TODO: [#5075] Bug: Access Results and Indicators section directly
            setTimeout(() => {
              props.setSectionFetched(sectionIndexPipeline[nextSectionIndex])
            }, 10000)
          }
          if (nextSectionIndex !== SECTION_RESULTS_INDICATORS) {
            props.setSectionFetched(sectionIndexPipeline[nextSectionIndex])
          }
        })
    }
    const next = nextSectionIndex + 1
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(params?.id) && (next < SECTION_COUNT)) {
      setNextSectionIndex(next)
    }
  }, [params.id, nextSectionIndex])
  useEffect(() => {
    if (params.id !== 'new') {
      if(params.id === props.editorRdr.projectId) return
      props.setProjectId(params.id)
      if(params.section != null){
        const index = sections.findIndex(it => it.key === params.section)
        if(index > 0){
          sectionIndexPipeline = [1, sectionIndexPipeline[index], ...sectionIndexPipeline.filter((it, itIndex) => index !== itIndex).slice(1)]
        }
      }
    } else {
      props.resetProject()
    }
  }, [])
  return null
}, (prevProps, nextProps) => { return prevProps.editorRdr.projectId === nextProps.editorRdr.projectId }))

export default ProjectInitHandler
