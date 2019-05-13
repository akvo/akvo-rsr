import types from './action-types'
import genericReducer from '../../../../utils/generic-reducer'
import {yupModel} from '../../../../utils/validation-utils'
import { IATI } from './validations'

const initialState = []

const model = yupModel(IATI)

export default genericReducer(initialState, model, types)
