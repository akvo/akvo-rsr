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
import alertReducer from "./alertReducer"

/*
    The store has four top level keys, each managed by one reducer.

    models: holds the data of the RSR models one key for each model under "models":
        comments, indicators, periods, results updates and user
    The first five are the data populating the accordion representation of the projects results, the
    user holds information on the logged in user

    keys: holds data representing the state of the accordions. Each Collapse component with the
    activeKey attribute != undefined is kept here under the key <modelname>-<parentId> where
    modelname is the name of the model objects contained in the Collapse and parentId is the ID of
    the parent model object. Note that the top Collapse wrapping the results is always called
    "results-results" since it has no parent. The value of each object the Collapse's current
    activeKey

    page: holds data on the current project and the translation strings

    ui: ** Experimental ** Holds data on UI state that's needed globally, currently only the
    open/closed state of update forms is held here

    alerts: holds the state of alerts and error messages
 */

const reducer = combineReducers({
    models: modelsReducer,
    keys: collapseReducer,
    page: pageReducer,
    ui: uiReducer,
    alerts: alertReducer,
});

export default reducer;
