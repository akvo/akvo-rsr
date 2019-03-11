/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import * as c from "./const";
import cloneDeep from "lodash/cloneDeep";

let initialState = {
    selectAll: true,
    fetching: false,
    projectsLoaded: false,
    error: undefined,
    userId: undefined,
    groupedProjects: [],
    isRestricted: undefined,
    originalIsRestricted: undefined,
    originalGroupedProjects: undefined,
    originalSelectAll: undefined
};

const updateProjectAccess = (projectId, groupedProjects) => {
    // Find the correct project and toggle the the access field
    return (
        groupedProjects &&
        groupedProjects.map(group => ({
            ...group,
            projects: group.projects.map(project => ({
                ...project,
                access:
                    project.id === projectId ? (project.access = !project.access) : project.access
            }))
        }))
    );
};

const updateAllProjectsAccess = (access, groupedProjects) => {
    // Find the correct project and toggle the the access field
    return (
        groupedProjects &&
        groupedProjects.map(group => ({
            ...group,
            projects: group.projects.map(project => ({
                ...project,
                access
            }))
        }))
    );
};

const cloneState = obj => obj && cloneDeep(obj);

export default function reducer(state = initialState, action) {
    const reducerActions = {
        [c.SET_STORE]: (state, action) => {
            const { data } = action;
            return { ...state, ...data };
        },

        [c.API_GET_INIT]: (state, action) => {
            return { ...state, fetching: true, error: null };
        },

        [c.API_GET_SUCCESS]: (state, action) => {
            const {
                user_projects: { is_restricted: isRestricted, may_unrestrict: mayUnrestrict },
                organisation_groups: groupedProjects
            } = action.data;
            return {
                ...state,
                fetching: false,
                projectsLoaded: true,
                groupedProjects,
                isRestricted,
                mayUnrestrict
            };
        },

        [c.API_GET_FAILURE]: (state, action) => {
            return {
                ...state,
                fetching: false,
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
            const {
                user_projects: { is_restricted: isRestricted },
                organisation_groups: groupedProjects
            } = action.data;
            return {
                ...state,
                fetching: false,
                isRestricted,
                originalIsRestricted: null,
                groupedProjects,
                originalGroupedProjects: null,
                originalSelectAll: null
            };
        },

        [c.API_PUT_FAILURE]: (state, action) => {
            const newState = {
                ...state,
                fetching: false,
                originalIsRestricted: null,
                originalGroupedProjects: null,
                originalSelectAll: null,
                error: action.error
            };
            // Overwrite if we have an original value
            if (state.originalIsRestricted !== null) {
                newState.isRestricted = state.originalIsRestricted;
            }
            if (state.originalGroupedProjects !== null) {
                newState.groupedProjects = state.originalGroupedProjects;
            }
            if (state.originalSelectAll !== null) {
                newState.selectAll = state.originalSelectAll;
            }
            return newState;
        },

        [c.UPDATE_IS_RESTRICTED]: (state, action) => {
            const { isRestricted } = action.data;
            return {
                ...state,
                isRestricted,
                originalIsRestricted: state.isRestricted
            };
        },

        [c.UPDATE_PROJECT_SELECTION]: (state, action) => {
            const { projectId } = action.data;
            const groupedProjects = updateProjectAccess(
                projectId,
                cloneState(state.groupedProjects)
            );
            return {
                ...state,
                originalGroupedProjects: cloneState(state.groupedProjects),
                groupedProjects
            };
        },

        [c.UPDATE_SELECT_ALL_PROJECTS]: (state, action) => {
            const groupedProjects = updateAllProjectsAccess(state.selectAll, state.groupedProjects);
            let { selectAll } = { ...state };
            selectAll = !selectAll;
            return {
                ...state,
                originalGroupedProjects: cloneState(state.groupedProjects),
                originalSelectAll: state.selectAll,
                groupedProjects,
                selectAll
            };
        }
    };
    if (action && reducerActions.hasOwnProperty(action.type)) {
        return reducerActions[action.type](state, action);
    } else {
        return state;
    }
}
