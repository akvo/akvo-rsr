/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import chai from "chai";

import { call, put, select } from "redux-saga/effects";
import { cloneableGenerator } from "redux-saga/utils";

let expect = chai.expect;

import {
    getSaga,
    fetchData,
    putSaga,
    putData,
    getUserId,
    getIsRestricted,
    getUserProjects
} from "../../../scripts-src/user-projects-access/sagas";
import * as c from "../../../scripts-src/user-projects-access/const";

describe("function* getSaga", () => {
    const iterator = cloneableGenerator(getSaga)({ data: { userId: 1 } });

    it("expect to call fetchData", () => {
        const userId = 1;
        const value = iterator.next().value;
        expect(value).to.deep.equal(call(fetchData, userId));
    });

    it("expect response to be c.API_GET_SUCCESS", () => {
        const response = { response: { data: undefined } };
        const clone = iterator.clone();
        const value = clone.next(response).value;
        expect(value).to.deep.equal(put({ type: c.API_GET_SUCCESS, data: response.data }));
    });

    it("expect error to be c.API_GET_FAILURE", () => {
        const error = {};
        const clone = iterator.clone();
        const value = clone.next({ error }).value;
        expect(value).to.deep.equal(put({ type: c.API_GET_FAILURE, error }));
    });
});

describe("function* putSaga", () => {
    const iterator = cloneableGenerator(putSaga)();

    it("expect to put c.API_PUT_INIT", () => {
        expect(iterator.next().value).to.deep.equal(put({ type: c.API_PUT_INIT }));
    });

    it("expect to select three values from store", () => {
        expect(iterator.next().value).to.deep.equal(select(getUserId));
        expect(iterator.next().value).to.deep.equal(select(getIsRestricted));
        expect(iterator.next().value).to.deep.equal(select(getUserProjects));
    });

    it("expect to call putData", () => {
        const userId = undefined,
            is_restricted = undefined,
            user_projects = undefined;
        const value = iterator.next().value;
        expect(value).to.deep.equal(call(putData, userId, is_restricted, user_projects));
    });

    it("expect to put c.API_PUT_SUCCESS", () => {
        const response = { response: { data: undefined } },
            clone = iterator.clone();
        const value = clone.next(response).value;
        expect(value).to.deep.equal(put({ type: c.API_PUT_SUCCESS, data: response.data }));
    });

    it("expect error to be c.API_PUT_FAILURE", () => {
        const error = {},
            clone = iterator.clone();
        const value = clone.next({ error }).value;
        expect(value).to.deep.equal(put({ type: c.API_PUT_FAILURE, error }));
    });
});
