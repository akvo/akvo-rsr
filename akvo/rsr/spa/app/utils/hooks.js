import { useState, useEffect } from 'react'
import api from './api'

function useFetch(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  async function fetchUrl() {
    let response
    try{
      response = await api.get(url)
      setData(response.data)
      setLoading(false)
    } catch(err){
      setLoading(false)
      if (err.message.indexOf('code 403') !== -1){
        setData(403)
      }
    }
  }
  useEffect(() => {
    fetchUrl()
  }, [])
  return [data, loading]
}

function useForceUpdate() {
  // eslint-disable-next-line no-unused-vars
  const [value, set] = useState(true) // boolean state
  return () => set(_value => !_value) // toggle the state to force render
}

export { useFetch, useForceUpdate }
