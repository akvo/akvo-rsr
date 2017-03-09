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
import { API_LIMIT } from "../const"

//TODO: refactor backend-calling functions, currently lots of overlap functionality that can be extracted

const range = (start, end) => (
    Array.from(Array(end - start + 1).keys()).map(i => i + start)
);


function wrappedFetch(url) {
    // Wrap fetch with standard options and return parsed JSON
    const options = {
        credentials: 'same-origin',
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    const req = new Request(url, options);
    return fetch(req)
        .then((response) => response.json())
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
                // return promises for all requests
                return Promise.all(urls.map(wrappedFetch));
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


export function fetchModel(model, id, callback, dataPrepCallback) {
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
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                dispatch({type: FETCH_MODEL_REJECTED, payload: {model: model, error: error}});
            });
    });
}


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


function wrappedFetchForUpdates({url, request}) {
    // Wrap fetch with standard options and return parsed JSON
    const req = new Request(url, request);
    return fetch(req)
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
    // Set or delete the relevant attachment field on  the update
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

function sendUpdateToBackend(url, method, data, collapseId, callback) {
    return store.dispatch((dispatch) => {
        // newUpdate store new or updated instance from server response
        let newUpdate;
        dispatch({type: UPDATE_MODEL_START, payload: {model: 'updates'}});
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
                        payload: {model: 'updates', object: data, collapseId}
                    });
                }
                // and replace it with the data from the server
                dispatch({
                    type: UPDATE_MODEL_FULFILLED,
                    payload: {model: 'updates', object: newUpdate, collapseId}
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
    return sendUpdateToBackend(url, 'POST', data, collapseId, callback)
}


export function updateUpdateToBackend(url, data, collapseId, callback) {
    return sendUpdateToBackend(url, 'PATCH', data, collapseId, callback)
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