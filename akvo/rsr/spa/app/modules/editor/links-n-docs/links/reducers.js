import types from './action-types'
import genericReducer from '../../../../utils/generic-reducer'

const model = {
  url: '',
  caption: ''
}

export default genericReducer([], model, types)
