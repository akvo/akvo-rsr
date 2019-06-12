import Cookies from 'js-cookie'
/* global fetch */
const apiUrl = '/rest/v1'
const headers = { 'Content-Type': 'application/json' }

export default {
  get: (path) => fetch(`${apiUrl}${path}`).then(d => d.json()),
  post: (path, body) => fetch(`${apiUrl}${path}/?format=json`, { method: 'POST', body: JSON.stringify(body), headers: {...headers, 'X-CSRFToken': Cookies.get('csrftoken')}}).then(d => d.json()),
  patch: (path, body) => fetch(`${apiUrl}${path}/?format=json`, { method: 'PATCH', body: JSON.stringify(body), headers: {...headers, 'X-CSRFToken': Cookies.get('csrftoken')}}).then(d => d.json())
}
