/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import { getCookie, endpoints } from "../utils"
import store from "../store"
import {
    FETCH_MODEL_START, FETCH_MODEL_FULFILLED, FETCH_MODEL_REJECTED, DELETE_FROM_MODEL,
    UPDATE_MODEL_DELETE_FULFILLED
} from "../reducers/modelsReducer"

//TODO: refactor backend-calling functions, currently lots of overlap functionality that can be extracted

export function fetchModel(model, id, callback) {
    return store.dispatch((dispatch) => {
        dispatch({type: FETCH_MODEL_START, payload: {model: model}});
        const url = endpoints[model](id);
        const options = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        fetch(url, options)
            .then(response => response.json())
            .then((data) => {
                dispatch({type: FETCH_MODEL_FULFILLED, payload: {model: model, data: data.results}});
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: FETCH_MODEL_REJECTED, payload: {model: model, error: error}});
            })
    });
}


export function fetchUser(id) {
    const model = 'user';
    return store.dispatch((dispatch) => {
        dispatch({type: FETCH_MODEL_START, payload: {model: model}});
        const url = endpoints[model](id);
        const options = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        fetch(url, options)
            .then(response => response.json())
            .then((data) => {
                // maintain compatibility with existing updates JSON
                data.approved_organisations = [data.organisation];
                // transform to common JSON data shape so normalize works in modelsReducer
                data = {results: data};
                dispatch({type: FETCH_MODEL_FULFILLED, payload: {model: model, data: data}});
            })
            .catch((error) => {
                dispatch({type: FETCH_MODEL_REJECTED, payload: {model: model, error: error}});
            })
    });
}


const UPDATE_MODEL_START = "UPDATE_MODEL_START",
    UPDATE_MODEL_FULFILLED = "UPDATE_MODEL_FULFILLED",
    UPDATE_MODEL_REJECTED = "UPDATE_MODEL_REJECTED";

export function updateModelToBackend(model, url, data, collapseId, callback) {
    return store.dispatch((dispatch) => {
        dispatch({type: UPDATE_MODEL_START, payload: {model: model}});
        const options = {
            credentials: 'same-origin',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        };
        fetch(url, options)
            .then(response => response.json())
            .then((data) => {
                dispatch({
                    type: UPDATE_MODEL_FULFILLED,
                    payload: {model: model, object: data, collapseId}
                });
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: 'updates', error: error}});
            })
    });
}


export function saveUpdateToBackend(url, data, collapseId, callback) {
    return store.dispatch((dispatch) => {
        dispatch({type: UPDATE_MODEL_START, payload: {model: 'updates'}});
        const options = {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        };
        fetch(url, options)
            .then(response => response.json())
            .then((newData) => {
                dispatch({
                    type: DELETE_FROM_MODEL,
                    payload: {model: 'updates', object: data, collapseId}
                });
                dispatch({
                    type: UPDATE_MODEL_FULFILLED,
                    payload: {model: 'updates', object: newData, collapseId}
                });
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: 'updates', error: error}});
            })
    });
}


export function updateUpdateToBackend(url, data, collapseId, callback) {
    return store.dispatch((dispatch) => {
        dispatch({type: UPDATE_MODEL_START, payload: {model: 'updates'}});
        const options = {
            credentials: 'same-origin',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        };
        fetch(url, options)
            .then(response => response.json())
            .then((data) => {
                dispatch({
                    type: UPDATE_MODEL_FULFILLED,
                    payload: {model: 'updates', object: data, collapseId}
                });
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: 'updates', error: error}});
            })
    });
}


export function deleteUpdateFromBackend(url, data, collapseId, callback) {
    return store.dispatch((dispatch) => {
        dispatch({type: UPDATE_MODEL_START, payload: {model: 'updates'}});
        const options = {
            credentials: 'same-origin',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        };
        fetch(url, options)
            // .then(response => response.json())
            .then((response) => {
                dispatch({
                    type: UPDATE_MODEL_DELETE_FULFILLED,
                    payload: {model: 'updates', id:data.id, collapseId}
                });
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: 'updates', error: error}});
            })
    });
}


// TODO: maybe extract into an actions file of their own since they trigger both the collapse and
// the models reducers
export function updateModel(model, object, collapseId) {
    store.dispatch({type: UPDATE_MODEL_FULFILLED, payload: {model, object, collapseId}});
}

export function deleteFromModel(model, object, collapseId) {
    store.dispatch({type: DELETE_FROM_MODEL, payload: {model, object, collapseId}});
}