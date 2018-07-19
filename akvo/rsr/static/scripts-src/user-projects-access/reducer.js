/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import * as c from "./const";
import pull from "lodash/pull";
import { inArray } from "./utils";

// initial state
let initialState = {
    selectAll: true,
    fetching: false,
    error: null,
    userId: null,
    is_restricted: false,
    all_projects: [],
    user_projects: [],
    original_is_restricted: null,
    original_user_projects: null
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case c.SET_STORE: {
            const data = action.data;
            return { ...state, ...data };
        }

        case c.API_GET_INIT: {
            return { ...state, fetching: true, error: null };
        }

        case c.API_GET_SUCCESS: {
            const { all_projects, user_projects } = action.data;
            return {
                ...state,
                fetching: false,
                all_projects,
                // NOTE: we're "unwrapping" the UserProjects data
                user_projects: (user_projects && user_projects.projects) || [],
                is_restricted: (user_projects && user_projects.is_restricted) || false
            };
        }

        case c.API_GET_FAILURE: {
            return {
                ...state,
                fetching: false,
                all_projects: [],
                user_projects: [],
                error: action.error
            };
        }

        case c.API_PUT_INIT: {
            return {
                ...state,
                fetching: true,
                error: null
            };
        }

        case c.API_PUT_SUCCESS: {
            const { user_projects } = action.data;
            return {
                ...state,
                fetching: false,
                // NOTE: we're "unwrapping" the list of projects here, to simplify the store
                is_restricted: user_projects.is_restricted,
                original_is_restricted: null,
                user_projects: user_projects.projects,
                original_user_projects: null
            };
        }

        case c.API_PUT_FAILURE: {
            const newState = {
                ...state,
                fetching: false,
                original_is_restricted: null,
                original_user_projects: null,
                error: action.error
            };
            // Overwrite if we have an original value
            if (state.original_is_restricted !== null) {
                newState.is_restricted = state.original_is_restricted;
            }
            if (state.original_user_projects !== null) {
                newState.user_projects = state.original_user_projects;
            }
            return newState;
        }

        case c.UPDATE_PROJECT_SELECTION: {
            const { projectId } = action.data;
            const original_projects = state.user_projects && [...state.user_projects];
            const user_projects = state.user_projects && [...state.user_projects];

            inArray(projectId, user_projects)
                ? pull(user_projects, projectId)
                : user_projects.push(projectId);
            return { ...state, original_projects: original_user_projects, user_projects };
        }

        case c.UPDATE_IS_RESTRICTED: {
            const { is_restricted } = action.data;
            return { ...state, is_restricted, original_is_restricted: state.is_restricted };
        }

        case c.UPDATE_SELECT_ALL_PROJECTS: {
            const original_projects = state.user_projects && [...state.user_projects];
            let user_projects,
                { selectAll } = { ...state };
            if (selectAll) {
                user_projects = state.all_projects.map(project => project.id);
            } else {
                user_projects = [];
            }
            selectAll = !selectAll;
            return {
                ...state,
                selectAll,
                original_projects: original_user_projects,
                user_projects
            };
        }

        default: {
            return state;
        }
    }
}
