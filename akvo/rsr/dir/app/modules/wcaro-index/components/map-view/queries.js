import useSWR from 'swr'
import api from '../../../../utils/api'
import config from '../../config'

export const queryGeoData = () => useSWR(`/rest/v1/project/${config.PROGRAM_ID}/results_geo/`, url => api.get(url).then(res => res.data))
export const queryResults = () => useSWR(`/rest/v1/project/${config.PROGRAM_ID}/results/`, url => api.get(url).then(res => res.data.results))
export const queryResult = resultId => useSWR(`/rest/v1/project/${config.PROGRAM_ID}/result/${resultId}/`, url => api.get(url).then(res => res.data.indicators))
