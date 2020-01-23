import Cookies from 'js-cookie'
import axios from 'axios'
import humps from 'humps'
// import { dateTransform } from './misc'

export const config = {
  baseURL: '/rest/v1',
  headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
  params: { format: 'json' },
  transformResponse: [
    ...axios.defaults.transformResponse,
    // data => dateTransform.response(data),
    data => humps.camelizeKeys(data)
  ],
  transformRequest: [
    data => humps.decamelizeKeys(data),
    // data => dateTransform.request(data),
    ...axios.defaults.transformRequest
  ]
}


export default {
  get: (url, params, cancelToken) => axios({ url, ...{ ...config, params }, cancelToken }),
  post: (url, data, cancelToken) => axios({ url, method: 'POST', data, ...config, cancelToken }),
  patch: (url, data, cancelToken) => axios({ url, method: 'PATCH', data, ...config, cancelToken }),
  delete: (url) => axios({ url, method: 'DELETE', ...config })
}
