/*
  Akvo RSR is covered by the GNU Affero General Public License.
  See more details in the license.txt file located at the root folder of the
  Akvo RSR module. For additional details on the GNU license please see
  < http://www.gnu.org/licenses/agpl.html >.
*/

// Our polyfill functions to get various advanced js functions working with IE

// Polyfill from MDN to add Object.assign
// Required by code in the project-directory.jsx file
(function() {
    if (typeof Object.assign != "function") {
        Object.assign = function(target, varArgs) {
            // .length of function is 2
            "use strict";
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError("Cannot convert undefined or null to object");
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
})();
