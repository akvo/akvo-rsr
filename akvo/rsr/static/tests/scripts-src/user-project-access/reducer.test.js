/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import chai from "chai";
let expect = chai.expect;

import reducer from "../../../scripts-src/user-projects-access/reducer";
import * as c from "../../../scripts-src/user-projects-access/const";

const initialState = {
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

describe("store/topics/reducer", () => {
    it("should have initial state", () => {
        // eql() is chai's deep equal test
        expect(reducer()).to.eql(initialState);
    });

    it("should not affect state to use a non-existent action", () => {
        const action = { type: "FAKE_ACTION" };

        expect(reducer(undefined, action)).to.eql(initialState);
    });

    it("action c.SET_STORE should add any key in the store", () => {
        const strings = { access: "Access" },
            action = { type: c.SET_STORE, data: { strings } },
            state = reducer(undefined, action);

        expect(state.strings).to.equal(strings);
    });

    it("action c.SET_STORE should update any key in the store", () => {
        const userId = 42,
            action = { type: c.SET_STORE, data: { userId } },
            state = reducer(undefined, action);

        expect(state.userId).to.equal(42);
    });

    it("action c.API_GET_INIT should set fetching to true and error to null", () => {
        const action = { type: c.API_GET_INIT },
            state = reducer(undefined, action);

        expect(state.fetching).to.equal(true);
        expect(state.error).to.equal(null);
    });

    it("action c.API_GET_SUCCESS should modify isRestricted and groupedProjects", () => {
        const action = {
                type: c.API_GET_SUCCESS,
                data: { user_projects: { is_restricted: true }, organisation_groups: [{}] }
            },
            state = reducer(undefined, action);

        expect(state.isRestricted).to.equal(true);
        expect(state.groupedProjects).to.eql([{}]);
    });

    it(
        "action c.API_GET_FAILURE should set fetching to false, " +
            "error to error text and groupedProjects to []",
        () => {
            const action = {
                    type: c.API_GET_FAILURE,
                    error: "An error occured"
                },
                expectedState = {
                    selectAll: true,
                    fetching: false,
                    projectsLoaded: false,
                    error: "An error occured",
                    userId: undefined,
                    groupedProjects: [],
                    isRestricted: undefined,
                    originalIsRestricted: undefined,
                    originalGroupedProjects: undefined,
                    originalSelectAll: undefined
                },
                state = reducer(undefined, action);

            expect(state).to.eql(expectedState);
        }
    );

    it("action c.API_PUT_INIT should set fetching to true and error to null", () => {
        const action = { type: c.API_PUT_INIT },
            state = reducer(undefined, action);
        expect(state.fetching).to.equal(true);
        expect(state.error).to.equal(null);
    });

    it(
        "action c.API_PUT_SUCCESS should modify isRestricted and groupedProjects " +
            "and set the originalNNN keys to null",
        () => {
            const action = {
                    type: c.API_GET_SUCCESS,
                    data: { user_projects: { is_restricted: true }, organisation_groups: [{}] }
                },
                expectedState = {
                    selectAll: true,
                    fetching: false,
                    projectsLoaded: false,
                    error: null,
                    userId: undefined,
                    groupedProjects: [{}],
                    isRestricted: true,
                    originalIsRestricted: null,
                    originalGroupedProjects: null,
                    originalSelectAll: null
                },
                state = reducer(undefined, action);

            expect(state.isRestricted).to.equal(true);
            expect(state.groupedProjects).to.eql([{}]);
        }
    );

    it(
        "action c.API_PUT_FAILURE should set fetching to false, error to error text, use any of " +
            "the originalNNN keys to set the corresponding key and set the originalNNN keys to null",
        () => {
            const action = {
                    type: c.API_PUT_FAILURE,
                    error: "An error occured"
                },
                currentState = {
                    selectAll: true,
                    fetching: true,
                    projectsLoaded: true,
                    error: null,
                    userId: undefined,
                    groupedProjects: [{}],
                    isRestricted: false,
                    originalIsRestricted: true,
                    originalGroupedProjects: [],
                    originalSelectAll: false
                },
                expectedState = {
                    selectAll: false,
                    fetching: false,
                    projectsLoaded: true,
                    error: "An error occured",
                    userId: undefined,
                    groupedProjects: [],
                    isRestricted: true,
                    originalIsRestricted: null,
                    originalGroupedProjects: null,
                    originalSelectAll: null
                },
                state = reducer(currentState, action);

            expect(state).to.eql(expectedState);
        }
    );

    it("action c.UPDATE_IS_RESTRICTED should set isRestricted to the value in data", () => {
        const isRestricted = true,
            action = { type: c.UPDATE_IS_RESTRICTED, data: { isRestricted } },
            currentState = {
                selectAll: true,
                fetching: true,
                projectsLoaded: true,
                error: null,
                userId: undefined,
                groupedProjects: [],
                isRestricted: false,
                originalIsRestricted: null,
                originalGroupedProjects: null,
                originalSelectAll: null
            },
            state = reducer(currentState, action);
        expect(state.isRestricted).to.equal(true);
    });

    it(
        "action c.UPDATE_PROJECT_SELECTION should change access for the selected projectId " +
            "and store the the original groupedProjects object in originalGroupedProjects",
        () => {
            const projectId = 42,
                action = {
                    type: c.UPDATE_PROJECT_SELECTION,
                    data: { projectId }
                },
                currentState = {
                    selectAll: true,
                    fetching: true,
                    projectsLoaded: true,
                    error: null,
                    userId: undefined,
                    groupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    isRestricted: false,
                    originalIsRestricted: true,
                    originalGroupedProjects: [],
                    originalSelectAll: false
                },
                expectedState = {
                    selectAll: true,
                    fetching: true,
                    projectsLoaded: true,
                    error: null,
                    userId: undefined,
                    groupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: false,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    isRestricted: false,
                    originalIsRestricted: true,
                    originalGroupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    originalSelectAll: false
                },
                state = reducer(currentState, action);
            expect(state).to.eql(expectedState);
        }
    );

    it(
        "action c.UPDATE_SELECT_ALL_PROJECTS should change access for all projects in " +
            "groupedProjects and store the the original groupedProjects object in " +
            "originalGroupedProjects. It should also flip selectAll and store the original in " +
            "originalSelectAll",
        () => {
            const projectId = 42,
                action = {
                    type: c.UPDATE_SELECT_ALL_PROJECTS
                },
                currentState = {
                    selectAll: true,
                    fetching: true,
                    projectsLoaded: true,
                    error: null,
                    userId: undefined,
                    groupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                },
                                {
                                    access: false,
                                    subtitle: "A project",
                                    id: 43,
                                    title: ""
                                }
                            ]
                        },
                        {
                            organisations: "SNV",
                            projects: [
                                {
                                    access: false,
                                    subtitle: "A project",
                                    id: 44,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    isRestricted: false,
                    originalIsRestricted: true,
                    originalGroupedProjects: [],
                    originalSelectAll: false
                },
                expectedState = {
                    selectAll: false,
                    fetching: true,
                    projectsLoaded: true,
                    error: null,
                    userId: undefined,
                    groupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                },
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 43,
                                    title: ""
                                }
                            ]
                        },
                        {
                            organisations: "SNV",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 44,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    isRestricted: false,
                    originalIsRestricted: true,
                    originalGroupedProjects: [
                        {
                            organisations: "Akvo",
                            projects: [
                                {
                                    access: true,
                                    subtitle: "A project",
                                    id: 42,
                                    title: ""
                                },
                                {
                                    access: false,
                                    subtitle: "A project",
                                    id: 43,
                                    title: ""
                                }
                            ]
                        },
                        {
                            organisations: "SNV",
                            projects: [
                                {
                                    access: false,
                                    subtitle: "A project",
                                    id: 44,
                                    title: ""
                                }
                            ]
                        }
                    ],
                    originalSelectAll: true
                },
                state = reducer(currentState, action);
            expect(state).to.eql(expectedState);
        }
    );
});
