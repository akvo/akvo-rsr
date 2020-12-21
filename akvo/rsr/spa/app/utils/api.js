/* global window */
import Cookies from 'js-cookie'
import axios from 'axios'
import humps from 'humps'
import { dateTransform } from './misc'

export const config = {
  baseURL: '/rest/v1',
  headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
  params: { format: 'json'},
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ],
  transformRequest: [
    data => humps.decamelizeKeys(data),
    data => dateTransform.request(data),
    ...axios.defaults.transformRequest
  ]
}

const query = new URLSearchParams(window.location.search)
const rt = query.get('rt')

const getConfigWithTransform = (transform, params) => {
  const ret = {
    ...config,
    params
  }
  if (rt) {
    ret.params = { ...params, rt }
  }
  if(transform){
    if(transform.response){
      ret.transformResponse = [...config.transformResponse, transform.response]
    }
    if(transform.request){
      ret.transformRequest = [transform.request, ...config.transformRequest]
    }
    return ret
  }
  return ret
}

export default {
  get: (url, params, transform, cancelToken) => axios({url, ...{...getConfigWithTransform(transform, params)}, cancelToken}),
  post: (url, data, transform, cancelToken) => axios({ url, method: 'POST', data: typeof data === 'object' ? data : data, ...getConfigWithTransform(transform), cancelToken}),
  patch: (url, data, transform, cancelToken) => axios({ url, method: 'PATCH', data, ...getConfigWithTransform(transform), cancelToken}),
  delete: (url) => axios({ url, method: 'DELETE', ...config })
}
