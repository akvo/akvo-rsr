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
    groupedProjects: [],
    isRestricted: null,

    originalIsRestricted: null,
    originalGroupedProjects: null
};

const updateProjectAccess = (projectId, groupedProjects) => {
    // Find the correct project and toggle the the access field
    groupedProjects.map(group => {
        group.projects.map(project => {
            project.id === projectId ? (project.access = !project.access) : null;
        });
    });
    return groupedProjects;
};

const updateAllProjectsAccess = (access, groupedProjects) => {
    // Find the correct project and toggle the the access field
    groupedProjects.map(group => {
        group.projects.map(project => {
            project.access = access;
        });
    });
    return groupedProjects;
};

export function reducer(state = initialState, action) {
    const reducerActions = {
        [c.SET_STORE]: (state, action) => {
            const data = action.data;
            return { ...state, ...data };
        },

        [c.API_GET_INIT]: (state, action) => {
            return { ...state, fetching: true, error: null };
        },

        [c.API_GET_SUCCESS]: (state, action) => {
            const {
                user_projects: { is_restricted: isRestricted },
                organisation_groups: groupedProjects
            } = action.data;
            return {
                ...state,
                fetching: false,
                groupedProjects,
                isRestricted
            };
        },

        [c.API_GET_FAILURE]: (state, action) => {
            return {
                ...state,
                fetching: false,
                all_projects: [],
                groupedProjects: [],
                error: action.error
            };
        },

        [c.API_PUT_INIT]: (state, action) => {
            return {
                ...state,
                fetching: true,
                error: null
            };
        },

        [c.API_PUT_SUCCESS]: (state, action) => {
            const { grouped_projects: groupedProjects } = action.data;
            return {
                ...state,
                fetching: false,
                // NOTE: we're "unwrapping" the list of projects here, to simplify the store
                isRestricted: user_projects.isRestricted,
                originalIsRestricted: null,
                groupedProjects,
                originalGroupedProjects: null
            };
        },

        [c.API_PUT_FAILURE]: (state, action) => {
            const newState = {
                ...state,
                fetching: false,
                originalIsRestricted: null,
                originalGroupedProjects: null,
                error: action.error
            };
            // Overwrite if we have an original value
            if (state.originalIsRestricted !== null) {
                newState.isRestricted = state.originalIsRestricted;
            }
            if (state.originalGroupedProjects !== null) {
                newState.groupedProjects = state.originalGroupedProjects;
            }
            return newState;
        },

        [c.UPDATE_PROJECT_SELECTION]: (state, action) => {
            const { projectId } = action.data;
            const originalGroupedProjects = state.groupedProjects && [...state.groupedProjects];
            let groupedProjects = state.groupedProjects && [...state.groupedProjects];
            groupedProjects = updateProjectAccess(projectId, groupedProjects);
            return { ...state, originalGroupedProjects, groupedProjects };
        },

        [c.UPDATE_IS_RESTRICTED]: (state, action) => {
            const { isRestricted } = action.data;
            return {
                ...state,
                isRestricted,
                originalIsRestricted: state.isRestricted
            };
        },

        [c.UPDATE_SELECT_ALL_PROJECTS]: (state, action) => {
            const originalGroupedProjects = state.groupedProjects && [...state.groupedProjects];
            let groupedProjects = state.groupedProjects && [...state.groupedProjects],
                { selectAll } = { ...state };
            groupedProjects = updateAllProjectsAccess(selectAll, groupedProjects);
            selectAll = !selectAll;
            return {
                ...state,
                selectAll,
                originalGroupedProjects,
                groupedProjects
            };
        }
    };
    if (reducerActions.hasOwnProperty(action.type)) {
        return reducerActions[action.type](state, action);
    } else {
        return state;
    }
}
