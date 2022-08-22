import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import uniq from 'lodash/uniq'

export const periodSlice = createSlice({
  name: 'periods',
  initialState: {
    options: [],
    selected: [],
    fetched: false,
    applyFilter: false,
  },
  reducers: {
    appendPeriods: (state, action) => {
      const items = action.payload.map((p) => {
        const periodStart = moment(p.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')
        const periodEnd = moment(p.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')
        return `${periodStart} - ${periodEnd}`
      })
      const options = uniq(items)
      state = {
        ...state,
        fetched: true,
        options
      }
      return state
    },
    selectPeriod: (state, action) => {
      state = {
        ...state,
        selected: action.payload
      }
      return state
    },
    removeSelectedPeriod: (state, action) => {
      const selected = state.selected.filter((s) => s !== action.payload)
      state = {
        ...state,
        selected
      }
      return state
    },
    submitFilter: (state, action) => {
      state = {
        ...state,
        applyFilter: action.payload
      }
      return state
    }
  }
})

export const {
  appendPeriods,
  selectPeriod,
  removeSelectedPeriod,
  submitFilter,
} = periodSlice.actions

export default periodSlice.reducer
