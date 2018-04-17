/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import * as c from "./const";

// initial state
let initialState = {
    fetching: false,
    error: null,
    user: null,
    projects: {ids: [], objects: {}}
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case c.API_CALL_REQUEST:
            return { ...state, fetching: true, error: null };

        case c.API_CALL_SUCCESS:
            return {
                ...state,
                fetching: false,
                user: action.data.user,
                projects: action.data.projects
            };

        case c.API_CALL_FAILURE:
            return { ...state, fetching: false, user: null, projects: [], error: action.error };

        default:
            return state;
    }
}
