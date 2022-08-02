import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './root-reducer'
import asyncDispatchMiddleware from './async-dispatch'

export default (initialState) => {
  const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: ['userRdr', 'editorRdr']
  }
  const persistedReducer = persistReducer(rootPersistConfig, rootReducer)
  const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk, asyncDispatchMiddleware)),
    // composeWithDevTools(applyMiddleware(thunk)),
  )

  if (module.hot) {
    module.hot.accept(
      './root-reducer',
      () => store.replaceReducer(require('./root-reducer').default)
    )
  }
  const persistor = persistStore(store)
  return { store, persistor }
}
