import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import uniq from 'lodash/uniq'

export const filterSlice = createSlice({
  name: 'filterByYear',
  initialState: {
    options: {},
    apply: {}
  },
  reducers: {
    append: (state, action) => {
      const options = uniq(action
        .payload
        .items
        .filter((i) => i.periodEnd)
        .map((i) => moment(i.periodEnd, 'YYYY-MM-DD').format('YYYY'))
      )
      state = {
        options: {
          ...state.options,
          [action.payload.id]: options
        },
        apply: {
          ...state.apply,
          [action.payload.id]: '0'
        }
      }
      return state
    },
    setApply: (state, action) => {
      state = {
        ...state,
        apply: {
          ...state.apply,
          [action.payload.id]: action.payload.value
        }
      }
      return state
    },
  }
})

export const { append, setApply } = filterSlice.actions

export default filterSlice.reducer
