import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import rootReducer from './root-reducer'

export default (initialState) => {
	const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
	)

	if(module.hot){
		module.hot.accept(
			'./root-reducer',
			() => store.replaceReducer(require('./root-reducer').default)
		)
	}

	return store
}
