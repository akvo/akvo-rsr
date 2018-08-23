/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// This import is necessary to be able to test sagas.
// See https://github.com/redux-saga/redux-saga/issues/280#issuecomment-291133023
import "regenerator-runtime/runtime";

import { takeLatest, call, put, select } from "redux-saga/effects";
import axios from "axios";

import * as c from "./const";
import { getCookie } from "../my-results/utils";

function callAxios(config) {
    return axios(config)
        .then(response => ({ response }))
        .catch(error => ({ error }));
}

export function fetchData(userId) {
    const config = {
        method: "get",
        url: `/rest/v1/user_projects_access/${userId}/`
    };
    return callAxios(config);
}

export function putData(userId, isRestricted, projectsWithAccess) {
    const config = {
        method: "patch",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        url: `/rest/v1/user_projects_access/${userId}/`,
        data: {
            user_projects: {
                is_restricted: isRestricted,
                projects: projectsWithAccess
            }
        }
    };
    return callAxios(config);
}

export function* getSaga(action) {
    const { userId } = action.data;
    const { response, error } = yield call(fetchData, userId);
    if (response) {
        yield put({ type: c.API_GET_SUCCESS, data: response.data });
    } else {
        yield put({ type: c.API_GET_FAILURE, error });
    }
}

const filterProjects = state => {
    return state.groupedProjects.reduce((acc, group) => {
        return acc.concat(
            group.projects.filter(project => project.access).map(project => project.id)
        );
    }, []);
};

export const getUserId = state => state.userId;
export const getIsRestricted = state => state.isRestricted;

export function* putSaga(action) {
    yield put({ type: c.API_PUT_INIT });
    const userId = yield select(getUserId);
    const isRestricted = yield select(getIsRestricted);
    const projectsWithAccess = yield select(filterProjects);

    const { response, error } = yield call(putData, userId, isRestricted, projectsWithAccess);
    if (response) {
        yield put({ type: c.API_PUT_SUCCESS, data: response.data });
    } else {
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
