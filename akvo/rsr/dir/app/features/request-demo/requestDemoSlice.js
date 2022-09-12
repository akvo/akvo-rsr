import { createSlice } from '@reduxjs/toolkit'

export const requestDemoSlice = createSlice({
  name: 'request-demo',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    akvoHub: '',
    message: ''
  },
  reducers: {
    setValues: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  }
})

export const { setValues } = requestDemoSlice.actions

export default requestDemoSlice.reducer
