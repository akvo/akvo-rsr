/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

/*
    The uiState keeps track of state of the UI that's not directly dependent on the model's current
    data.
    Currently we keep track of
        * if all models have loaded from the server, at which point we enable a number of buttons
        * open/closed state of update forms
        * periods selected for bulk (un)locking

    uiState top nodes:
        allFetched: boolean that is false until all models have loaded from the backend
            TODO: allFetched is only used to disable the "global" buttons at page loading, but could
            be used when data is updated too for the same purpose
        selectedPeriods: array of Period IDs that are currently selected via checkbox
        updateForms: array of Update IDs that have open forms
 */

import update  from 'immutability-helper';

import * as c from "../const"


const uiState = {
    allFetched: false, // allFetched becomes true when all models have been fetched from the backend
    selectedOption: undefined, // not used?
    hide: false, // hide is set to a model, indicating that the node is to be hidden unless it is
    // part of the currently open collapse keys
    activeFilter: undefined, //indicates if a filter is currently in force
    visibleKeys: undefined,
    [c.SELECTED_PERIODS]: [], //list if periods that are currently checked, used for bulk actions
    [c.UPDATE_FORMS]: [], //list of currently open indicator update forms
};

export default function uiReducer(state=uiState, action) {
    switch(action.type) {

        case c.UI_ID_RESET: {
            const {element} = action.payload;
            return {...state, [element]: []};
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
            return {...state, [element]: [...newState]};
        }

        case c.UI_ID_TRUE: {
            const {element, id} = action.payload;
            return {...state, [element]: [...new Set(state[element]).add(id)]};
        }

        case c.UI_ID_FALSE: {
            const {element, id} = action.payload;
            //Set.delete() doesn't return the modified set, se we have to create the set and only
            // then call delete(). BAH!
            const elementSet = new Set(state[element]);
            elementSet.delete(id);
            return {...state, [element]: [...elementSet]};
        }

        case c.UI_HIDE: {
            const {mode} = action.payload;
            return {...state, hide: mode};
        }

        case c.ALL_MODELS_FETCHED: {
            return {...state, allFetched: true};
        }

        case c.SET_PERIOD_DATES: {
            return {...state, periodDates: action.payload};
        }

        case c.UI_FILTER_BUTTON_ACTIVE: {
            const {button} = action.payload;
            return {...state, activeFilter: button};
        }

        case c.KEYS_COPY_TO_VISIBLE: {
            const {keys} = action.payload;
            return {...state, visibleKeys: keys};
        }

        case c.UPDATE_MODEL_FULFILLED: {
            const {collapseId, object} = action.payload;
            // if collapseId isn't supplied we don't have to update keys
            const visibleKeys = state.visibleKeys;
            if (collapseId && visibleKeys) {
                const key = object.id.toString();
                if (visibleKeys[collapseId]) {
                    const newVisibleKeys = update(visibleKeys[collapseId], {$push: [key]});
                    const deduped = [...new Set(newVisibleKeys)];
                    return update(state, {visibleKeys: {$merge: {[collapseId]: deduped}}});
                } else {
                    return update(state, {visibleKeys: {$merge: {[collapseId]: [key]}}});
                }
            }
        }

    }
    return state;
}
