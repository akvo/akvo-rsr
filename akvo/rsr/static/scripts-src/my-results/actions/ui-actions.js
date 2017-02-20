/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import store from "../store"

import {
    UPDATE_FORM_TOGGLE, UPDATE_FORM_OPEN, UPDATE_FORM_CLOSE, ALL_MODELS_FETCHED
} from "../reducers/uiReducer"

import { MODELS_LIST } from "../const"

export function updateFormToggle(id) {
    store.dispatch({
        type: UPDATE_FORM_TOGGLE,
        payload: {id: `updateForm-${id}`}
    })
}

export function updateFormOpen(id) {
    store.dispatch({
        type: UPDATE_FORM_OPEN,
        payload: {id: `updateForm-${id}`}
    });
}

export function updateFormClose(id) {
    store.dispatch({
        type: UPDATE_FORM_CLOSE,
        payload: {id: `updateForm-${id}`}
    });
}

export function activateToggleAll() {
    // Have we fetched all models?
    const allFetched = MODELS_LIST.every((model) => store.getState().models[model].fetched);
    if (allFetched) {
        store.dispatch({
            type: ALL_MODELS_FETCHED,
            payload: true
        });
    }
}
