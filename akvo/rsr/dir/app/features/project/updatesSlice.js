import { createSlice } from '@reduxjs/toolkit'

export const updatesSlice = createSlice({
  name: 'project-updates',
  initialState: {
    fetched: false,
    data: [],
  },
  reducers: {
    append: (state, action) => {
      return {
        ...state,
        fetched: true,
        data: action.payload
      }
    },
  }
})

export const { append } = updatesSlice.actions

export default updatesSlice.reducer
