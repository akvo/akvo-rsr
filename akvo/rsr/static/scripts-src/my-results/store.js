/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import reducer from "./reducers";

//TODO: investigate using promises or redux-saga
const middleware = applyMiddleware(/*promise(),*/ thunk, logger());

// This setup allows us to mock the store in tests
// See: https://railsware.com/blog/2017/01/10/mocking-es6-module-import-without-dependency-injection/
let store;
const realStore = createStore(reducer, middleware);
store = realStore;

export function mock(mockStore) {
    // helper function used when mocking the Redux store in tests
    store = mockStore || realStore;
}

export { store as default };
