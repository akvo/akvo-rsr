/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import { combineReducers } from "redux";

import modelsReducer from "./modelsReducer"
import collapseReducer from "./collapseReducer"
import pageReducer from "./pageReducer"
import uiReducer from "./uiReducer"


const reducer = combineReducers({
    models: modelsReducer,
    keys: collapseReducer,
    page: pageReducer,
    ui: uiReducer,
});

export default reducer;
