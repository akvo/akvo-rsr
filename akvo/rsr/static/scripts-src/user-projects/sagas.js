/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

const fixture = {
    projects: {
        ids: [1, 2, 3, 4, 5],
        objects: {
            1: {
                id: 1,
                title: "Project 1",
                checked: false
            },
            2: {
                id: 2,
                title: "Project 2",
                checked: false
            },
            3: {
                id: 3,
                title: "Project 3",
                checked: true
            },
            4: {
                id: 4,
                title: "Project 4",
                checked: false
            },
            5: {
                id: 5,
                title: "Project 5",
                checked: false
            }
        }
    },
    user: {
        id: 4711,
        projects: [1, 2, 3]
    }
};

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
    yield takeLatest("API_CALL_REQUEST", workerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchData() {
    // return axios({
    //   method: "get",
    //   url: "https://dog.ceo/api/breeds/image/random"
    // });
    return { data: { message: fixture } };
}

// worker saga: makes the api call when watcher saga sees the action
function* workerSaga() {
    try {
        const response = yield call(fetchData);
        const data = response.data.message;

        // dispatch a success action to the store with the new dog
        yield put({ type: "API_CALL_SUCCESS", data });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: "API_CALL_FAILURE", error });
    }
}
