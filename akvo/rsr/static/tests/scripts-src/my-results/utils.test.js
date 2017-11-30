/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import chai from 'chai'
import React from 'react'
import * as utils from '../../../scripts-src/my-results/utils'
import * as c from '../../../scripts-src/my-results/const'
import {shallow} from 'enzyme'

let expect = chai.expect;

describe("function distinct", () => {
    it('expect to return an array with unique values', () => {
        const arrayWithDuplicates = [1,2,3,4,4],
            uniqueArray = [1,2,3,4];
        expect(utils.distinct(arrayWithDuplicates)).to.deep.equal(uniqueArray);
    });
});

describe("function identicalArrays", () => {
    it('returns true if two arrays are identical', () => {
        const arr1 = [1,2,3],
            arr2 = [1,2,3];
        expect(utils.identicalArrays(arr1, arr2)).to.equal(true);
    });
});

describe("function isEmpty", () => {
    it('expect to return true if empty', () => {
        const object = {},
            string = '',
            array = [];
        expect(utils.isEmpty(object)).to.be.true;
        expect(utils.isEmpty(string)).to.be.true;
        expect(utils.isEmpty(array)).to.be.true;
    });
    it('expect to return false if not empty', () =>{
        const stringWithValue = 'value';
        expect(utils.isEmpty(stringWithValue)).to.be.false;
    });
});

describe("function isNumeric", () => {
    it('expect to return true if value is numeric', () => {
        const number = 55;
        expect(utils.isNumeric(number)).to.be.true;
    });
    it('expect to return false if values not numeric', () => {
        const string = 'noNumeric';
        expect(utils.isNumeric(string)).to.be.false;
    });
});

describe("function getCookie", () => {
    it('returns the value of a named cookie', () => {
        const document = global.document;
            global.document = {
                cookie: 'name=value; otherName=otherValue'
            };
        let name = 'name',
            otherName = 'otherName';
        const value = 'value',
            otherValue = 'otherValue';
         expect(utils.getCookie(name)).to.equal(value);
         expect(utils.getCookie(otherName)).to.equal(otherValue);
         expect(utils.getCookie(name)).to.not.equal(otherValue);
         global.document = document;
     });
});

describe("function idsToActiveKey", () => {
    it('expect to return IDs as an array of strings', () => {
        const ids = [1, 2, 3, 4];
        expect(utils.idsToActiveKey(ids)).to.satisfy(function(array) {
            return array.every(function(item) {
                return typeof item === 'string';
            })
        });
    });
});

describe("arrowFunction isNewUpdate", () => {
    it('expect to return true if the update is new', () => {
        const newUpdate = {id: 'new-', name: 'update'};
        expect(utils.isNewUpdate(newUpdate)).to.be.true;
    });
    it('expect to return true if we pas a string starting with "new-"', () => {
        const newString = "new-17";
        expect(utils.isNewUpdate(newString)).to.be.true;
    });
    it('expect to return false if the update is not new', () => {
        const notNewUpdate = {id: '4', name: 'update'};
        expect(utils.isNewUpdate(notNewUpdate)).to.be.false;
    });
});

describe("function collapseId", () => {
    it('expect to create an collapsedId from the model name and parent object id', () => {
        const model = 'model2',
            id = 200;
        expect(utils.collapseId(model, id)).to.equal('model2-200');
    });
});

describe("function childModelName", () => {
    it('expect to return child model name', () => {
        const model = c.OBJECTS_RESULTS,
            child = c.OBJECTS_INDICATORS;
        expect(utils.childModelName(model)).to.equal(child);
    });
});

describe("function parentModelName", () => {
    it('expect to return parent model name', () => {
        const model = c.OBJECTS_INDICATORS,
            parent = c.OBJECTS_RESULTS;
        expect(utils.parentModelName(model)).to.equal(parent);
    });
});

describe("function levelAbove", () => {
    it('expect to compare index of array to decide that level is above', () => {
        const model = c.OBJECTS_PERIODS,
            compare = c.OBJECTS_UPDATES;
        expect(utils.levelAbove(model, compare)).to.equal(model < compare);
    });
});

describe("function levelBelow", () => {
    it('expect to compare index of array to decide that level is below', () => {
        const model = c.OBJECTS_UPDATES,
            compare = c.OBJECTS_PERIODS;
        expect(utils.levelBelow(model, compare)).to.equal(model > compare);
    });
});

// TODO: update test so we test the full functionality of fullUpdateVisibility()
describe("function fullUpdateVisibility", () => {
    it('expect to return false if an update have filters and should not be full visible', () => {
        const filter = c.FILTER_NEED_REPORTING,
            visible = [c.UPDATE_STATUS_NEW, c.UPDATE_STATUS_DRAFT, c.UPDATE_STATUS_REVISION],
            update = visible[1];
        expect(utils.fullUpdateVisibility(update, filter)).to.be.false;
    });
    it('expect to be true if an update have no filters and should be fully visible', () => {
        let noFilter,
            updateFullyVisible;
        expect(utils.fullUpdateVisibility(updateFullyVisible, noFilter)).to.be.true;
    });
});

describe("function flatten", () => {
    it('expect to return an flatten array of a nested original', () => {
        const arrayOfArrays = [[1, 2], [3, 4], [5, 6]],
            flatArray= [1, 2, 3, 4, 5, 6];
        expect(utils.flatten(arrayOfArrays)).to.deep.equal(flatArray);
    });
});

describe("function fieldValueOrSpinner", () => {
    it('expect to return an object with a key "value" from object, if objects defined', () => {
        const object = {a: 1, b: 2},
            field = 'b';
        expect(utils.fieldValueOrSpinner(object, field)).to.have.key('value');
        expect(utils.fieldValueOrSpinner(object, field)).to.deep.equal({value: 2});
    });
    it('expect to return an object with a key "icon", if objects not defined', () => {
        let object,
            field;
        expect(utils.fieldValueOrSpinner(object, field)).to.have.key('icon');
    });
});

describe("function setHash", () => {
    it('expect to set hash if hash is defined', () => {
        const window = global.window;
            global.window = {
                location: {}
            };
        const hash = 'setHash';
        utils.setHash(hash);
        expect(JSON.stringify(global.window)).to.equal('{"location":{"hash":"#setHash"}}');
        global.window = window;
    });
    it('expect to set an empty string if hash is undefined', () => {
        const window = global.window;
            global.window = {
                location: {}
            };
        let hash;
        utils.setHash(hash);
        expect(JSON.stringify(global.window)).to.equal('{"location":{"hash":""}}');
        global.window = window;
    });
});

describe("function computePercentage", () => {
    it('computes the percentage of integer numbers', () => {
        const numerator = 20,
            denominator = 20;
        expect(utils.computePercentage(numerator, denominator)).to.equal(100);
    });
    it('computes the percentage of decimal numbers', () => {
        const numerator = 88.7,
            denominator = 8.87;
        expect(utils.computePercentage(numerator, denominator)).to.equal(1000);
    });
    it('computes the percentage of decimal and integer numbers', () => {
        const numerator = 47.79,
            denominator = 531;
        expect(utils.computePercentage(numerator, denominator)).to.equal(9);
    });
    it('expect to return 0 if the denominator is 0', () => {
        const numerator = 88,
            denominator = 0;
        expect(utils.computePercentage(numerator, denominator)).to.equal(0);
    });
});
