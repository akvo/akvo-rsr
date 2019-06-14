import { useState, useEffect } from 'react'
import api from '../../utils/api'

function useFetch(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  async function fetchUrl() {
    const response = await api.get(url)
    setData(response.data)
    setLoading(false)
  }
  useEffect(() => {
    fetchUrl()
  }, [])
  return [data, loading]
}
export { useFetch }
