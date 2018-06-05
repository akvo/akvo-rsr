/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { takeLatest, call, put, select } from "redux-saga/effects";
import axios from "axios";

import * as c from "./const";
import { getCookie } from "../my-results/utils";

function fetchData(userId) {
    return axios({
        method: "get",
        url: `/rest/v1/user_projects_access/${userId}/`
    });
}

function putData(userId, is_restricted, user_projects) {
    return axios({
        method: "put",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        url: `/rest/v1/user_projects_access/${userId}/`,
        data: {
            user_projects: {
                is_restricted,
                projects: user_projects
            }
        }
    });
}

function* getSaga(action) {
    const { userId } = action.data;
    try {
        const response = yield call(fetchData, userId);
        const data = response.data;
        yield put({ type: c.API_GET_SUCCESS, data });
    } catch (error) {
        yield put({ type: c.API_GET_FAILURE, error });
    }
}

const getUserId = state => state.userId;
const getUserProjects = state => state.user_projects;
const getIsRestricted = state => state.is_restricted;

function* putSaga(action) {
    try {
        yield put({ type: c.API_PUT_INIT });
        const userId = yield select(getUserId);
        const is_restricted = yield select(getIsRestricted);
        const user_projects = yield select(getUserProjects);
        const response = yield call(putData, userId, is_restricted, user_projects);
        const data = response.data;
        yield put({ type: c.API_PUT_SUCCESS, data });
    } catch (error) {
        yield put({ type: c.API_PUT_FAILURE, error });
    }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
    yield takeLatest(c.API_GET_INIT, getSaga);
    yield takeLatest(c.UPDATE_PROJECT_SELECTION, putSaga);
    yield takeLatest(c.UPDATE_SELECT_ALL_PROJECTS, putSaga);
    yield takeLatest(c.UPDATE_IS_RESTRICTED, putSaga);
}
