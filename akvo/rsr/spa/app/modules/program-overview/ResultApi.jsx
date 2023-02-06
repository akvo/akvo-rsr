import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { updateProgrammePerResult } from '../program/store/actions'
import api from '../../utils/api'

const ResultApi = ({
  fetched,
  programId,
  index,
  id,
  updateProgrammePerResult
}) => {
  const [preload, setPreload] = useState(true)
  useEffect(() => {
    if (!fetched && preload) {
      api
        ?.get(`/project/${programId}/result/${id}/`)
        ?.then(({ data }) => {
          setPreload(false)
          if (index > -1) {
            updateProgrammePerResult(index, { ...data, fetched: true })
          }
        })
        ?.catch(() => {
          setPreload(false)
          updateProgrammePerResult(index, { fetched: true })
        })
    }
  }, [fetched, preload])
  return null
}

export default connect(
  null, updateProgrammePerResult
)(ResultApi)
