import types from './action-types'
import genericReducer from '../../../../utils/generic-reducer'
import { IATI } from './validations'
import { yupModel } from '../../../../utils/validation-utils'

const model = yupModel(IATI)

const initialState = []

export default genericReducer(initialState, model, types)
