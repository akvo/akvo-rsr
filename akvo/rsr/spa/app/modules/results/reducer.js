import moment from 'moment'
import { getUserFullName, setNumberFormat } from '../../utils/misc'
import actionTypes from './action-types'

const initialState = [
  {
    id: null,
    indicators: [
      {
        id: null,
        periods: [
          {
            id: null,
            updates: []
          }
        ]
      }
    ]
  },
]

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_RESULTS:
      const _results = action.payload
        ?.map((r) => ({
          ...r,
          indicators: r?.indicators?.map((i) => ({
            ...i,
            periods: i?.periods?.map((p) => {
              const tables = p.updates.map((u) => {
                const { value, createdAt, userDetails } = u
                const _logItem = {}
                const _dsg = u?.disaggregations?.map((d) => ({ [d.type]: d.value }))
                for (let x = 0; x < _dsg.length; x += 1) {
                  Object.assign(_logItem, _dsg[x])
                }
                return {
                  ..._logItem,
                  value: setNumberFormat(value),
                  date: moment(createdAt).format('DD MMM YYYY HH:mm'),
                  user: getUserFullName(userDetails),
                }
              })
              return ({
                ...p,
                tables,
                columns: tables[0] || [],
              })
            })
          }))
        }))
      return _results
    case actionTypes.UPDATE_RESULT:
      return state.map((s) => {
        if (s.id === action?.payload?.id) {
          return action.payload
        }
        return s
      })
    case actionTypes.UPDATE_INDICATOR:
      return state.map((s) => ({
        ...s,
        indicators: s?.indicators?.map((i) => {
          if (i.id === action?.payload?.id) {
            return action.payload
          }
          return i
        })
      }))
    case actionTypes.UPDATE_PERIOD:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => {
            if (p.id === action?.payload?.id) {
              return action.payload
            }
            return p
          })
        }))
      }))
    case actionTypes.UPDATE_ITEM:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i.periods.map((p) => ({
            ...p,
            updates: p?.updates?.map((u) => {
              if (u.id === action?.payload?.id) {
                return action.payload
              }
              return u
            })
          }))
        }))
      }))
    case actionTypes.DELETE_ITEM:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => {
            const findUpdate = p?.updates?.find((u) => u.id === action?.payload?.id)
            if (findUpdate) {
              const modifiedUpdates = p?.updates?.filter((u) => u?.id !== findUpdate.id)
              return ({
                ...p,
                updates: modifiedUpdates
              })
            }
            return p
          })
        }))
      }))
    case actionTypes.TOGGLE_LOCK_PERIOD:
      return state.map(r => ({
        ...r,
        indicators: r.indicators.map((i) => ({
          ...i,
          periods: i.periods.map((p) => {
            const selected = action.payload.map((it) => it.id)
            if (selected.includes(p.id)) {
              return ({ ...p, locked: action.locked })
            }
            return p
          })
        }))
      }))
    case actionTypes.BULK_UPDATE_STATUS:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => {
            const modifiedUpdates = p?.updates?.map((u) => {
              const selected = action.payload?.map((it) => it.id)
              if (selected.includes(u.id)) {
                return ({
                  ...u,
                  status: action.status
                })
              }
              return u
            })
            return ({
              ...p,
              updates: modifiedUpdates
            })
          })
        }))
      }))
    default:
      return state
  }
}
