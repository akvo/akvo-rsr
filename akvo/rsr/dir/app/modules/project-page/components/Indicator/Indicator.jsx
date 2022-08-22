import React, { useState, useEffect } from 'react'
import { Empty, Skeleton } from 'antd'
import { useDispatch } from 'react-redux'

import Quantitative from './Quantitative'
import Qualitative from './Qualitative'
import PeriodApi from '../PeriodApi'

import { getPeriodsByID } from '../../queries'
import { setPeriods } from '../../../../features/results/resultSlice'
import { append as appendFilter } from '../../../../features/periods/filterSlice'

const Indicator = ({
  id,
  dimensionNames,
  periods,
  fetched,
  type
}) => {
  const [dsgOpen, setDsgOpen] = useState(false)
  const [loading, setLoading] = useState(!fetched)

  const dispatch = useDispatch()
  const { data, size, setSize } = getPeriodsByID(id)

  const isFetched = ((periods.filter((p) => (p.fetched)).length) || (fetched && periods.length === 0))

  useEffect(() => {
    if (data && loading) {
      const { next } = data.slice(-1)[0] || {}
      setSize(size + 1)
      if (!next && loading) {
        setLoading(false)
        const items = data.flatMap((d) => d.results)
        dispatch(setPeriods({ id, items }))
        dispatch(appendFilter({ id, items }))
      }
    }
  }, [loading, data, size])
  return (
    <>
      {periods.map((p, px) => <PeriodApi {...p} key={px} />)}
      <Skeleton loading={!isFetched} paragraph={{ rows: 5 }} active>
        {type === 1 && (
          <Quantitative
            {...{
              id,
              dimensionNames,
              periods,
              dsgOpen,
              setDsgOpen
            }}
          />
        )}
        {type === 2 && <Qualitative {...{ periods }} />}
        {periods.length === 0 && <Empty />}
      </Skeleton>
    </>
  )
}

export default Indicator
