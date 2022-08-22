import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setUpdates } from '../../../features/results/resultSlice'
import { getUpdatesByID } from '../queries'

const PeriodApi = ({ id: periodID, fetched }) => {
  const [loading, setLoading] = useState(!fetched)

  const dispatch = useDispatch()
  const { data, size, setSize } = getUpdatesByID(periodID)

  useEffect(() => {
    if (data && loading) {
      const { next } = data.slice(-1)[0] || {}
      setSize(size + 1)
      if (!next && loading) {
        setLoading(false)
        const items = data.flatMap((d) => d.results)
        dispatch(setUpdates({ id: periodID, items }))
      }
    }
  }, [loading, data, size])
  return null
}

export default PeriodApi
