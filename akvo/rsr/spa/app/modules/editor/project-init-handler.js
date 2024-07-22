/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react'
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

const SECTION_INFO = 1
const SECTION_CONTACT = 2
const SECTION_USER_ACCESS = 3
const SECTION_DESCRIPTION = 4
const SECTION_RESULTS_INDICATORS = 5
const SECTION_FINANCE = 6
const SECTION_LOCATION = 7
const SECTION_FOCUS = 8
const SECTION_LINK_N_DOC = 9
const SECTION_COMMENT = 10
const SECTION_CRS = 11
const SECTION_COUNT = 11

const sectionInstanceToRoot = [
  SECTION_DESCRIPTION,
  SECTION_FINANCE,
  SECTION_LOCATION,
  SECTION_FOCUS,
  SECTION_COMMENT
]
const sectionHasEndpoint = [
  SECTION_INFO,
  SECTION_CONTACT,
  SECTION_USER_ACCESS,
  SECTION_RESULTS_INDICATORS,
  SECTION_FINANCE,
  SECTION_LOCATION,
  SECTION_FOCUS,
  SECTION_LINK_N_DOC,
  SECTION_CRS,
]

const ProjectInitHandler = ({ match: { params }, editorRdr, ...props }) => {
  const [preload, setPreload] = useState(true)
  const [sectionIndex, setNextSectionIndex] = useState(1)

  const fetchSectionOne = endpoint => api
    .get(insertRouteParams(endpoint, { projectId: params.id }))
    .then(({ data }) => {
      props.fetchFields(SECTION_INFO, data)
      props.setSectionFetched(SECTION_INFO)
    })
    .catch(() => {
      /**
       * in order to stop the loading indicator,
       * we need to set the ID by sending the params id
       */
      props.setFirstSectionID(params.id)
    })

  const fetchNextSection = index => {
    const _endpoints = endpoints[`section${index}`] || endpoints.section1
    const sectionEndPoints = Object
      .keys(_endpoints)
      .filter(it => it !== 'root' && it.indexOf('.') === -1)
      .map(it => ({ setName: it, endpoint: _endpoints[it] }))

    sectionEndPoints.forEach(item => {
      const { endpoint, setName } = item
      let _params = endpoint === '/project_location/' ? { location_target: params.id } : { project: params.id }
      _params = endpoint?.includes('related_project') ? { ..._params, relation: 1 } : _params

      api
        .get(endpoint, _params, getTransform(index, setName, 'response'))
        .then(({ data: { results, count } }) => {
          props.fetchSetItems(index, setName, results, count)
          setTimeout(() => {
            props.setSectionFetched(index)
          }, 1000)
        })
    })
  }

  useEffect(() => {
    if (preload) {
      /**
       * those command only execute once
       */
      setPreload(false)
      if (params.id !== editorRdr.projectId || !editorRdr.section1.isFetched) {
        /**
         * if the previous ID is not the same as the current ID
         * or
         * section1 hasn't been fetched
         * then
         * Reset all states and set old ID with current ID
         */
        props.resetProject()
        props.setProjectId(params.id)
        fetchSectionOne(endpoints.section1.root)
      }
    }

    /**
     * As long as ID is numeric &&
     * sectionIndex is less then number of sections
     * it will increment to move to the next section
     */
    if (
      !isNaN(params?.id) &&
      (sectionIndex <= SECTION_COUNT)
    ) {
      if (sectionHasEndpoint.includes(sectionIndex)) {
        fetchNextSection(sectionIndex)
      }
      const next = sectionIndex + 1
      setNextSectionIndex(next)
    }
    /**
     * ============================================
     * editorRdr?.section1?.fields?.id is a blocker
     * to ensure all required fields are available
     */
    if (editorRdr?.section1?.fields?.id) {
      sectionInstanceToRoot.forEach((index) => {
        if (!editorRdr[`section${index}`]?.isFetched) {
          props.fetchSectionRoot(index)
          props.setSectionFetched(index)
        }
      })
    }
  }, [preload, sectionIndex, editorRdr]) // those variables are subscribers and React JS will always pay attention to their value
  useEffect(() => {
    if (params.section === 'info') {
      api.get(`/project/${params.id}/external_project/`).then(({ data }) => {
        props.setExternalProjects(data)
      })
    }
  }, [])
  return null
}

export default connect(
  ({ editorRdr }) => ({ editorRdr }), actions
)(ProjectInitHandler)
