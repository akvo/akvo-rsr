import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFullUpdate } from '../../../features/results/resultSlice'

import { getFullUpdateByID } from '../queries'

const UpdateApi = ({ id, fetched }) => {
  const [loading, setLoading] = useState(!fetched)

  const dispatch = useDispatch()
  const { data } = getFullUpdateByID(id)

  useEffect(() => {
    if (loading && data) {
      dispatch(setFullUpdate({ id, data }))
      setLoading(false)
    }
  }, [data, loading])
  return null
}

export default UpdateApi
