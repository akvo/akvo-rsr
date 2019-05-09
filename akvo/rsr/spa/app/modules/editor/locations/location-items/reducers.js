import types from './action-types'
import genericReducer from '../../../../utils/generic-reducer'
import {yupModel} from '../../../../utils/misc'
import { IATI } from './validations'

const model = yupModel(IATI)

const initialState = []

export default genericReducer(initialState, model, types)
