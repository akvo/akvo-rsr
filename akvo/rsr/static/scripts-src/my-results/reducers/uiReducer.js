/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// import { SELECTED_PERIODS, UPDATE_FORMS } from "../const"

/*
    The uiState keeps track of state of the UI that's not directly dependent on the model's current
    data.
    Currently we keep track of
        * if all models have loaded from the server, at which point we enable a number of buttons
        * open/closed state of update forms
        * periods selected for bulk (un)locking
 */

// export const
//     c.UI_ID_RESET = "c.UI_ID_RESET",
//     c.UI_ID_TOGGLE = "c.UI_ID_TOGGLE",
//     UI_ID_TRUE = "UI_ID_TRUE",
//     UI_ID_FALSE = "UI_ID_FALSE",
//     ALL_MODELS_FETCHED = "ALL_MODELS_FETCHED",
//     SET_PERIOD_DATES = "SET_PERIOD_DATES"
// ;
import * as c from "../const"
/*
    uiState top nodes:
        allFetched: boolean that is false until all models have loaded from the backend
            TODO: allFetched is only used to disable the "global" buttons at page loading, but could
            be used when data is updated too for the same purpose
        selectedPeriods: array of Period IDs that are currently selected via checkbox
        updateForms: array of Update IDs that have open forms
 */
const uiState = {
    allFetched: false, selectedOption: undefined, [c.SELECTED_PERIODS]: [], [c.UPDATE_FORMS]: [],
};

export default function uiReducer(state=uiState, action) {
    switch(action.type) {


        case c.UI_ID_RESET: {
            const {element} = action.payload;
            state = {...state, [element]: []};
            break;
        }

        case c.UI_ID_TOGGLE: {
            const {element, id} = action.payload;
            // Make a set of the state[element] array
            let newState = new Set(state[element]);
            if (newState.has(id)) {
                newState.delete(id)
            } else {
                newState.add(id)
            }
            // Put back the values as an array.
            state = {...state, [element]: [...newState]};
            break;
        }

        case c.UI_ID_TRUE: {
            const {element, id} = action.payload;
            state = {...state, [element]: [...new Set(state[element]).add(id)]};
            break;
        }

        case c.UI_ID_FALSE: {
            const {element, id} = action.payload;
            state = {...state, [element]: [...new Set(state[element]).delete(id)]};
            break;
        }

        case c.ALL_MODELS_FETCHED: {
            state = {...state, allFetched: true};
            break;
        }

        case c.SET_PERIOD_DATES: {
            state = {...state, periodDates: action.payload};
            break;
        }
    }
    return state;
}
