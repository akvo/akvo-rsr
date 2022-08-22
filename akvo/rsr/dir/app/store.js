import { configureStore } from '@reduxjs/toolkit'
import resultReducer from './features/results/resultSlice'
import periodReducer from './features/periods/periodSlice'
import filterPeriodReducer from './features/periods/filterSlice'

export const store = configureStore({
  reducer: {
    results: resultReducer,
    periods: periodReducer,
    filterPeriods: filterPeriodReducer
  },
})
