import { useState, useEffect } from 'react'
import api from './api'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  async function fetchUrl() {
    let response
    try {
      response = await api.get(url)
      setData(response.data)
      setLoading(false)
    } catch (err) {
      if (err.message.indexOf('code 403') !== -1) {
        setData(403)
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    fetchUrl()
  }, [])
  return [data, loading]
}

export { useFetch }
