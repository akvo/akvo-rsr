import useSWR from 'swr'
import humps from 'humps'
import api from '../../utils/api'

export const queryAllSectors = () =>
  useSWR('/sector_codes?format=json', (url) =>
    api.get(url).then((res) => humps.camelizeKeys(res.data))
  )

export const queryAllOrganisations = () =>
  useSWR('/typeaheads/organisations?format=json', (url) =>
    api.get(url).then((res) => humps.camelizeKeys(res.data))
  )

export const queryGeoJson = (fields = null) =>
  useSWR(`${`/project_location_geojson?format=json${fields ? `&fields=${fields}` : ''}`}`, (url) =>
    api.get(url).then((res) => humps.camelizeKeys(res.data))
  )
