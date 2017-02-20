/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import store from "../store"

import { UPDATE_FORM_TOGGLE, UPDATE_FORM_OPEN, UPDATE_FORM_CLOSE } from "../reducers/uiReducer"


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
