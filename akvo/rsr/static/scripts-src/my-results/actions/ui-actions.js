/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import store from "../store"

import {
    UI_ID_TOGGLE, UI_ID_TRUE, UI_ID_FALSE, ALL_MODELS_FETCHED
} from "../reducers/uiReducer"

import { MODELS_LIST, OBJECTS_USER, SELECTED_PERIODS, UPDATE_FORMS } from "../const"


export function periodSelectToggle(id) {
    store.dispatch({
        type: UI_ID_TOGGLE,
        payload: {element: SELECTED_PERIODS, id: id}
    })
}


export function updateFormToggle(id) {
    store.dispatch({
        type: UI_ID_TOGGLE,
        payload: {element: UPDATE_FORMS, id: id}
    })
}


export function updateFormOpen(id) {
    store.dispatch({
        type: UI_ID_TRUE,
        payload: {element: UPDATE_FORMS, id: id}
    })
}


export function updateFormClose(id) {
    store.dispatch({
        type: UI_ID_FALSE,
        payload: {element: UPDATE_FORMS, id: id}
    });
}


export function activateToggleAll() {
    // Have we fetched all models? Include current user info too.
    const allFetched = MODELS_LIST.concat([OBJECTS_USER]).every(
        (model) => store.getState().models[model].fetched
    );
    if (allFetched) {
        store.dispatch({
            type: ALL_MODELS_FETCHED,
            payload: true
        });
    }
}
