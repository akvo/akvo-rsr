import { createSlice } from '@reduxjs/toolkit'

export const collapseSlice = createSlice({
  name: 'collapse',
  initialState: {
    results: [],
    indicators: []
  },
  reducers: {
    setActiveKeys: (state, action) => {
      state = {
        ...state,
        [action.payload.key]: action.payload.values
      }
      return state
    }
  }
})

export const { setActiveKeys } = collapseSlice.actions

export default collapseSlice.reducer
