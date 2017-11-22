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

describe("function distinct", () => {
  it('expect to return an array with unique values', () => {
    const uniqueArray = [...new Set(uniqueArray)],
          otherArray = [...new Set(otherArray)];
    expect(utils.distinct(uniqueArray)).to.not.equal(otherArray);
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

describe("function levelAbove", () => {
  it('expect to compare index of array to decide that level is above', () => {
    const models = [1, 2],
          model = models[1],
          compare = models[0];
    expect(utils.levelAbove(model, compare)).to.equal(model < compare);
  });
});

describe("function levelBelow", () => {
  it('expect to compare index of array to decide that level is below', () => {
    const models = [1, 2];
    const model = models[0];
    const compare = models[1];
    expect(utils.levelBelow(model, compare)).to.equal(model > compare);
  });
});

// requires that the function tested is changed to an exported function
describe("function flatten", () => {
  it('expect to return an flatten array of arrays', () => {
    const arrayOfArrays = [[1, 2], [3, 4], [5, 6]],
          arrayFlatten = [1, 2, 3, 4, 5, 6];
      expect(utils.flatten(arrayOfArrays)).to.deep.equal(arrayFlatten);
  });
});

describe("function fieldValueOrSpinner", () => {
  it('expect to return key value from object, if objects defined', () => {
    const object = {a: 1, b: 2};
    let field;
    expect(utils.fieldValueOrSpinner(object, field)).to.have.key('value');
  });
  it('expect to return key icon, if objects not defined', () => {
    let object,
        field;
    expect(utils.fieldValueOrSpinner(object, field)).to.have.key('icon');
   });
});

describe("function setHash", () => {
  it('expect to set hash if hash is defined', () => {
    global.window = {
            location: {
              }
            }
    const hash = 'setHash';
    // console.log('hash to set = ' + hash);
    // console.log('hash before set: ' + global.window.location.hash);
    expect(utils.setHash(hash)).to.satisfy(function(returnSetHash) {
      return global.window.location.hash;
    });
    // console.log('hash after set: ' + global.window.location.hash);
    // console.log('hash set = ' + hash);
    global.window = window;
  });
  it('expect to set an empty hash if hash is undefined', () => {
    global.window = {
            location: {
              }
            }
    let hash;
    // console.log('hash to set = ' + hash);
    // console.log('hash before set: ' + global.window.location.hash);
    expect(utils.setHash(hash)).to.satisfy(function(returnSetHash) {
      return global.window = { location: { hash : ''}};
    });
    // nconsole.log('hash after set: ' + global.window.location.hash);
    // console.log('hash set = ' + hash);
    global.window = window;
  });
});

describe("function computePercentage", () => {
  it('computes the percentage of numbers', () => {
  const numerator = 20;
  const denominator = 20;
  expect(utils.computePercentage(numerator, denominator)).to.equal(100);
  expect(utils.computePercentage(numerator, denominator)).not.to.equal(10);
  });
});
