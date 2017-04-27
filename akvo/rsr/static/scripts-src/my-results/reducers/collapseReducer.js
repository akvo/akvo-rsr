/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import update from "immutability-helper"

import * as c from "../const"


export default function collapseReducer(keys={}, action) {
    // Reducer for managing the Collapse.activeKey states
    switch(action.type) {

        case c.KEY_SET_ACTIVE: {
            // Set the model to current activeKey list
            const {collapseId, activeKey} = action.payload;
            keys = {...keys, [collapseId]: activeKey};
            break;
        }

        case c.KEYS_RESET: {
            // Reset the tree
            keys = {};
            break;
        }

        case c.UPDATE_MODEL_FULFILLED: {
            const {collapseId, object} = action.payload;
            // if collapseId isn't supplied we don't have to update keys
            if (collapseId) {
                const key = object.id.toString();
                if (keys[collapseId]) {
                    keys = {...keys, [collapseId]: update(keys[collapseId], {$push: [key]})};
                } else {
                    keys = {...keys, [collapseId]: [key]};
                }
            }
            break;
        }

        case c.DELETE_FROM_MODEL: {
            const {collapseId, object} = action.payload;
            const keyToRemove = object.id.toString();
            keys = {
                ...keys,
                [collapseId]: keys[collapseId].filter((key) => key !== keyToRemove)
            };
            break;
        }
    }
    return keys;
};
