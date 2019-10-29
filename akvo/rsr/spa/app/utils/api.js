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

const getConfigWithTransform = (transform) => {
  if(transform){
    const ret = {
      ...config
    }
    if(transform.response){
      ret.transformResponse = [...config.transformResponse, transform.response]
    }
    if(transform.request){
      ret.transformRequest = [transform.request, ...config.transformRequest]
    }
    return ret
  }
  return config
}

export default {
  get: (url, params, transform, cancelToken) => axios({url, ...{...getConfigWithTransform(transform), params}, cancelToken}),
  post: (url, data, transform, cancelToken) => axios({ url, method: 'POST', data, ...getConfigWithTransform(transform), cancelToken}),
  patch: (url, data, transform, cancelToken) => axios({ url, method: 'PATCH', data, ...getConfigWithTransform(transform), cancelToken}),
  delete: (url) => axios({ url, method: 'DELETE', ...config })
}
