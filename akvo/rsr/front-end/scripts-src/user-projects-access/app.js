/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";

import reducer from "./reducer";
import { watcherSaga } from "./sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// dev tools middleware
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let store;
if (reduxDevTools) {
    store = createStore(
        reducer,
        compose(
            applyMiddleware(sagaMiddleware),
            reduxDevTools
        )
    );
} else {
    store = createStore(reducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(watcherSaga);

document.addEventListener("DOMContentLoaded", function() {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("userProjects")
    );
});
