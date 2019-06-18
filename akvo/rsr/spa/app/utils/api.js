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

export default {
  get: (url, params) => axios({url, ...{...config, params}}),
  post: (url, data) => axios({ url, method: 'POST', data, ...config}),
  patch: (url, data) => axios({ url, method: 'PATCH', data, ...config}),
  delete: (url) => axios({ url, method: 'DELETE', ...config })
}
