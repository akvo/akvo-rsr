import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import editorRdr from '../modules/editor/reducer'
import userRdr from './user-reducer'
import resultRdr from '../modules/results/reducer'
import programmeRdr from '../modules/program/store/reducer'
import filterRdr from './filter/reducer'

const userPersistConfig = {
  key: 'userRdr',
  storage,
  whitelist: [
    'id',
    'lang',
    'programs',
    'firstName',
    'lastName',
    'canManageUsers',
    'seenAnnouncements'
  ]
}

const editorPersistConfig = {
  key: 'editorRdr',
  storage,
  whitelist: ['projectId']
}

const rootReducer = combineReducers({
  editorRdr: persistReducer(editorPersistConfig, editorRdr),
  userRdr: persistReducer(userPersistConfig, userRdr),
  resultRdr,
  programmeRdr,
  filterRdr,
})

export default rootReducer
