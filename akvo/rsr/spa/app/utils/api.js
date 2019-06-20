import Cookies from 'js-cookie'
import axios from 'axios'
import humps from 'humps'
import { dateTransform } from './misc'

const config = {
  baseURL: '/rest/v1',
  headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') },
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
  get: (url, params, transform) => axios({url, ...{...getConfigWithTransform(transform), params}}),
  post: (url, data, transform) => axios({ url, method: 'POST', data, ...getConfigWithTransform(transform)}),
  patch: (url, data, transform) => axios({ url, method: 'PATCH', data, ...getConfigWithTransform(transform)}),
  delete: (url) => axios({ url, method: 'DELETE', ...config })
}
