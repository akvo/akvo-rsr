import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import editorRdr from '../modules/editor/reducer'
import userRdr from './user-reducer'
import resultRdr from '../modules/results/reducer'

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
  blacklist: ['section1', 'lastSaved']
}

const rootReducer = combineReducers({
  editorRdr: persistReducer(editorPersistConfig, editorRdr),
  userRdr: persistReducer(userPersistConfig, userRdr),
  resultRdr
})

export default rootReducer
