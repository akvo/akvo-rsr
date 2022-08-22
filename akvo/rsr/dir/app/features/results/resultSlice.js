import { createSlice } from '@reduxjs/toolkit'

export const resultSlice = createSlice({
  name: 'results',
  initialState: [],
  reducers: {
    appendResults: (state, action) => {
      state = action.payload.map((p) => ({
        ...p,
        indicators: [],
        fetched: false
      }))
      return state
    },
    setIndicators: (state, action) => {
      state = [
        ...state.map((s) => s.id === action.payload.id
          ? ({
            ...s,
            indicators: action.payload.items.map((p) => ({
              ...p,
              periods: [],
              fetched: false
            })),
            fetched: true
          })
          : s
        )
      ]
      return state
    },
    setPeriods: (state, action) => {
      state = [
        ...state.map((s) => ({
          ...s,
          indicators: s.indicators.map((i) => i.id === action.payload.id
            ? ({
              ...i,
              periods: action.payload.items.map((p) => ({
                ...p,
                updates: [],
                fetched: false
              })),
              fetched: true
            })
            : i
          )
        }))
      ]
      return state
    },
    setUpdates: (state, action) => {
      state = [
        ...state.map((s) => ({
          ...s,
          indicators: s.indicators.map((i) => ({
            ...i,
            periods: i.periods.map((p) => p.id === action.payload.id
              ? ({
                ...p,
                updates: action.payload.items.map((u) => ({
                  ...u,
                  disaggregations: [],
                  fetched: false
                })),
                fetched: true
              })
              : p
            )
          }))
        }))
      ]
      return state
    },
    setFullUpdate: (state, action) => {
      state = [
        ...state.map((s) => ({
          ...s,
          indicators: s.indicators.map((i) => ({
            ...i,
            periods: i.periods.map((p) => ({
              ...p,
              updates: p.updates.map((u) => u.id === action.payload.id
                ? ({
                  ...action.payload.data,
                  fetched: true
                })
                : u)
            }))
          }))
        }))
      ]
      return state
    }
  }
})

export const {
  appendResults,
  setIndicators,
  setPeriods,
  setUpdates,
  setFullUpdate,
} = resultSlice.actions

export default resultSlice.reducer
