/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import chai from 'chai'
import React from 'react'
import * as utils from '../../../scripts-src/my-results/utils'
import {shallow} from 'enzyme'

let expect = chai.expect;

describe("function identicalArrays", () => {
    it('returns true if two arrays are identical', () => {
        const arr1 = [1,2,3],
            arr2 = [1,2,3];
        expect(utils.identicalArrays(arr1, arr2)).to.equal(true);
    });
});
