import types from './action-types'
import genericReducer from '../../../../utils/generic-reducer'

const model = { code: '', description: '', percentage: '' }

const initialState = []

export default genericReducer(initialState, model, types)
