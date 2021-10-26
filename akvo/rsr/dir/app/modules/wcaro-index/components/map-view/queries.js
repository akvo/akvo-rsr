import { useQuery } from 'react-query'
import api from '../../../../utils/api'
import config from '../../config'

const staleTime = 60 * 60 * 1000
const cacheTime = 60 * 60 * 1000
const queryOpts = {staleTime, cacheTime}

const getGeoData = () => api.get(`/rest/v1/project/${config.PROGRAM_ID}/results_geo/`).then(res => res.data)
const getResults = () => api.get(`/rest/v1/project/${config.PROGRAM_ID}/results/`).then(res => res.data.results)
const getResult = resultId => api.get(`/rest/v1/project/${config.PROGRAM_ID}/result/${resultId}/`).then(res => res.data.indicators)

export const queryGeoData = () => useQuery('geo-countries', getGeoData, queryOpts)
export const queryResults = () => useQuery('results', getResults, queryOpts)
export const queryResult = resultId => useQuery(['results', resultId], () => getResult(resultId), queryOpts)
