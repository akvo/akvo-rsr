/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import { assert } from 'assert'

// var assert = require('assert');
var add = require('./add');

describe('Demo', () => {
  it('should add correctly', () => {
    assert.equal(add(1, 1), 2);
  });
});

