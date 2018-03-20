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

export default createStore(reducer, middleware);
