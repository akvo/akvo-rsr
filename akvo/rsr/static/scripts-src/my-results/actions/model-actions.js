/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import store from "../store"
import {
    FETCH_MODEL_START, FETCH_MODEL_FULFILLED, FETCH_MODEL_REJECTED, DELETE_FROM_MODEL,
    UPDATE_MODEL_DELETE_FULFILLED, UPDATE_MODEL_START, UPDATE_MODEL_FULFILLED, UPDATE_MODEL_REJECTED
} from "../reducers/modelsReducer"
import { getCookie, endpoints } from "../utils"
import { API_LIMIT, SELECTED_PERIODS, OBJECTS_PERIODS, OBJECTS_UPDATES} from "../const"

import { selectablePeriods } from "./ui-actions"

//TODO: refactor backend-calling functions, currently lots of overlap functionality that can be extracted

const range = (start, end) => (
    Array.from(Array(end - start + 1).keys()).map(i => i + start)
);


function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}


function executeCallback(callbacks, callbackName) {
    if (typeof callbacks === 'object') {
        if (callbacks && callbacks[callbackName]) {
            callbacks[callbackName]();
        }
    } else {
        if (callbacks) {
            callbacks();
        }
    }
}


function wrappedFetch(url, method='GET', data) {
    // Wrap fetch with standard options and return parsed JSON
    const options = {
        credentials: 'same-origin',
        method: method,
        headers: {'Content-Type': 'application/json'},
    };
    if (method != 'GET' && method != 'DELETE') {
        options.headers['X-CSRFToken'] = getCookie('csrftoken');
        options.body = JSON.stringify(data)
    }
    const req = new Request(url, options);
    return fetch(req)
        .then((response) => {
            if (response.status != 204) {
                return response.json();
            } else {
                return response;
            }
        });
}


function fetchFromAPI(baseUrl) {
    // Fetch data from the backend, supports multiple pages of data
    let result;
    return wrappedFetch(baseUrl)
        .then((data) => {
            // Single objects have no results attribute, e.g. /rest/v1/user/<id>
            result = data.results || data;
            // if data.next then we have more data than fits in one go
            if (data.next) {
                // calculate how many pages we need to get and consturct URLs
                const pageNumbers = range(2, Math.ceil(data.count / API_LIMIT));
                const urls = pageNumbers.map((n) => `${baseUrl}&page=${n}`);
                // NOTE: we need to bind url to wrappedFetch or the array index will leak as a
                // second param into the call. Nasty!
                return Promise.all(urls.map((url) => {return wrappedFetch.bind(null, url)()}));
            }
        })
        .then((pages) => {
            // pages are the resolved request promises
            if (pages) {
                // accumulate the data from the pages
                result = pages.reduce((res, data) => res.concat(data.results), result);
            }
            return result;
        })
}


export function fetchModel(model, id, callbacks, dataPrepCallback) {
    return store.dispatch((dispatch) => {
        dispatch({type: FETCH_MODEL_START, payload: {model: model}});
        const url = endpoints[model](id);
        fetchFromAPI(url)
            .then((results) => {
                if (dataPrepCallback) {
                    results = dataPrepCallback(results);
                }
                dispatch({type: FETCH_MODEL_FULFILLED, payload: {model: model, data: results}});
            })
            .then(() => {
                if (callbacks) {
                    // More than one callback?
                    if (callbacks instanceof Array) {
                        callbacks.map((callback) => callback());
                    } else {
                        callbacks();
                    }
                }
            })
            .catch((error) => {
                dispatch({type: FETCH_MODEL_REJECTED, payload: {model: model, error: error}});
            });
    });
}


export function modifyModelToBackend(model, method, url, data, fulfilledDispatchData, callbacks) {
    return store.dispatch((dispatch) => {
        dispatch({type: UPDATE_MODEL_START, payload: {model: model}});
        const options = {
            credentials: 'same-origin',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        };
        if (method != 'DELETE') {
            options.body = JSON.stringify(data);
        }
        fetch(url, options)
            .then(handleErrors)
            .then((response) => {
                if (response.status != 204) {
                    return response.json();
                } else {
                    return response;
                }
            })
            .then((data) => {
                // update with data from backend
                if (method != 'DELETE') {
                    fulfilledDispatchData.payload.object = data;
                }
                dispatch(fulfilledDispatchData);
            })
            .then(() => {
                executeCallback(callbacks, UPDATE_MODEL_FULFILLED);
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: model, error: error}});
                throw error;
            })
            .catch(() => {
                executeCallback(callbacks, UPDATE_MODEL_REJECTED);
            });
    });
}


export function saveModelToBackend(model, url, data, collapseId, callbacks) {
    const dispatchData = {
        type: UPDATE_MODEL_FULFILLED,
        payload: {model: model, object: data, collapseId}
    };
    modifyModelToBackend(model, 'POST', url, data, dispatchData, callbacks);
}

export function updateModelToBackend(model, url, data, collapseId, callbacks) {
    const dispatchData = {
        type: UPDATE_MODEL_FULFILLED,
        payload: {model: model, object: data, collapseId}
    };
    modifyModelToBackend(model, 'PATCH', url, data, dispatchData, callbacks);
}


export function deleteUpdateFromBackend(url, data, collapseId, callbacks) {
    const dispatchData = {
        type: UPDATE_MODEL_DELETE_FULFILLED,
        payload: {model: OBJECTS_UPDATES, id: data.id, collapseId}
    };
    modifyModelToBackend(OBJECTS_UPDATES, 'DELETE', url, data, dispatchData, callbacks);
}


function wrappedFetchForUpdates({url, request}) {
    // Wrap fetch with standard options and return parsed JSON
    const req = new Request(url, request);
    return fetch(req)
        .then(handleErrors)
        .then((response) => {
            if (response.status != 204) {
                return response.json();
            } else {
                return response;
            }});
}

const options = (method, body, contentType) => {
    let opts =  {
        credentials: 'same-origin',
        method: method,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: body,
    };
    if (contentType) {
        opts.headers["Content-Type"] = contentType;
    }
    return opts;
};

const setupAttachmentRequests = (url, data) => {
    // Prepare parameters for calls to wrappedFetchForUpdates that upload or delete attachments
    let uploads = [];
    if (data._file) {
        if (data._file == 'delete') {
            uploads.push(
                {url, request: options('DELETE', JSON.stringify({type: 'file'}), 'application/json')}
            );
        } else {
            const fileForm = new FormData();
            fileForm.append("file", data._file);
            fileForm.append("type", 'file');
            uploads.push({url, request: options('POST', fileForm)});
        }
    }
    if (data._photo) {
        if (data._photo == 'delete') {
            uploads.push(
                {url, request: options('DELETE', JSON.stringify({type: 'photo'}), 'application/json')}
            );
        } else {
            const photoForm = new FormData();
            photoForm.append("file", data._photo.file);
            photoForm.append("type", 'photo');
            uploads.push({url, request: options('POST', photoForm)});
        }
    }
    return uploads;
};

const assignAttachmentURLs = (responses, update, newUpdate) => {
    // Set or delete the relevant attachment field on the update
    if (responses && responses.length == 2) {
        if (update._file == 'delete') {
            newUpdate.file_url = newUpdate.file = '';
        } else {
            newUpdate.file_url = responses[0].file;
        }
        if (update._photo == 'delete') {
            newUpdate.photo_url = newUpdate.photo = '';
        } else {
            newUpdate.photo_url = responses[1].photo;
        }
    }
    // if we only have one attachment we need to figure out if it's a photo or a file
    if (responses && responses.length == 1) {
        if (update._file == 'delete') {
            newUpdate.file_url = newUpdate.file = '';
        } else if (update._photo == 'delete') {
            newUpdate.photo_url = newUpdate.photo = '';
        } else {
            if (responses[0].photo) {
                newUpdate.photo_url = responses[0].photo;
            } else {
                newUpdate.file_url = responses[0].file;
            }
        }
    }
    return newUpdate;
};

function sendUpdateToBackend(url, method, data, collapseId, callbacks) {
    return store.dispatch((dispatch) => {
        // newUpdate store new or updated instance from server response
        let newUpdate;
        dispatch({type: UPDATE_MODEL_START, payload: {model: OBJECTS_UPDATES}});
        const request = options(method, JSON.stringify(data), 'application/json');
        wrappedFetchForUpdates({url, request})
            // Find attachments and create promises to post them
            .then((responseJSON) => {
                // remember response for later
                newUpdate = responseJSON;
                const url = endpoints.file_upload(responseJSON.id);
                const uploads = setupAttachmentRequests(url, data);
                if (uploads.length > 0) {
                    return Promise.all(uploads.map(wrappedFetchForUpdates)) || [];
                }
            })
            // process the promises response array
            .then((responses) => {
                newUpdate = assignAttachmentURLs(responses, data, newUpdate);
                // Delete existing record of the update in the store
                if (method == 'POST') {
                    dispatch({
                        type: DELETE_FROM_MODEL,
                        payload: {model: OBJECTS_UPDATES, object: data, collapseId}
                    });
                }
                // and replace it with the data from the server
                dispatch({
                    type: UPDATE_MODEL_FULFILLED,
                    payload: {model: OBJECTS_UPDATES, object: newUpdate, collapseId}
                });
            })
            .then(() => {
                executeCallback(callbacks, UPDATE_MODEL_FULFILLED);
            })
            .catch((error) => {
                dispatch({type: UPDATE_MODEL_REJECTED, payload: {model: 'updates', error: error}});
                throw error;
            })
            .catch(() => {
                executeCallback(callbacks, UPDATE_MODEL_REJECTED);
            });

    });
}


export function saveUpdateToBackend(url, data, collapseId, callbacks) {
    return sendUpdateToBackend(url, 'POST', data, collapseId, callbacks)
}


export function updateUpdateToBackend(url, data, collapseId, callbacks) {
    return sendUpdateToBackend(url, 'PATCH', data, collapseId, callbacks)
}


function patchMultiple(model, params, callback) {
    /*
        Perform a series of PATCHes, used for bulk updating of e.g. Period.locked field
        params should be an array of objects, each object having the following members:
            url: the URL to use for this PATCH request
            data: object that will be the request's body
     */
    return store.dispatch((dispatch) => {

        // Bind the params to wrappedFetch calls
        const fetches = params.map(
            (param) => {return wrappedFetch.bind(null, param.url, 'PATCH', param.data)()}
        );
        // Execute all fetches
        Promise.all(fetches)
            .then((responses) => {
                // Update each object with backend data
                responses.map((object) => {
                    dispatch({
                        type: UPDATE_MODEL_FULFILLED,
                        payload: {model, object}
                    })
                })
            })
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            // TODO: better error handling
            .catch((error) => {
                dispatch({
                    type: FETCH_MODEL_REJECTED,
                    payload: {model: model, error: error}
                })
            })

    })
}


function periodLockingParams(locked) {
    const selectedPeriods = store.getState().ui[SELECTED_PERIODS];
    const data = selectedPeriods.map((id) => {
        return {url: endpoints.period(id), data: {locked: locked}}
    });
    // Update selected periods locked field, then call selectablePeriods to rebuild the period
    // select component
    // patchMultiple(OBJECTS_PERIODS, data, selectablePeriods);
    patchMultiple(OBJECTS_PERIODS, data);
}


export function lockSelectedPeriods() {
    periodLockingParams(true)
}


export function unlockSelectedPeriods() {
    periodLockingParams(false)
}


// TODO: maybe extract into an actions file of their own since they trigger both the collapse and
// the models reducers
export function updateModel(model, object, collapseId) {
    store.dispatch({type: UPDATE_MODEL_FULFILLED, payload: {model, object, collapseId}});
}


export function deleteFromModel(model, object, collapseId) {
    store.dispatch({type: DELETE_FROM_MODEL, payload: {model, object, collapseId}});
}