import types from './action-types'
import {yupModel} from '../../../../utils/validation-utils'
import { IATI } from './validations'
import genericReducer from '../../../../utils/generic-reducer'

const initialState = []

const model = yupModel(IATI)

export default genericReducer(initialState, model, types)
