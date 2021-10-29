import useSWR from 'swr'
import humps from 'humps'
import api from '../../../utils/api'
import config from '../config'
import program from './program.json'

export const queryProgram = () => useSWR(`/project/${config.PROGRAM_ID}/?format=json`, url => api.get(url).then(res => res.data), { fallbackData: humps.camelizeKeys(program), revalidateOnMount: true })
export const queryUser = () => useSWR('/me/', url => api.get(url).then(res => res.data))
export const queryCountries = () => useSWR(`/program/${config.PROGRAM_ID}/countries/`, url => api.get(url).then(res => res.data))
export const queryFramework = () => useSWR(`/project/${config.PROGRAM_ID}/results_framework/`, url => api.get(url).then(res => res.data.results))
export const queryResults = () => useSWR(`/project/${config.PROGRAM_ID}/results/`, url => api.get(url).then(res => res.data.results))
export const queryStories = (page = 1) => useSWR(`/program/${config.PROGRAM_ID}/updates/?image_thumb_name=big&limit=4&page=${page}`, url => api.get(url).then(res => res.data))
