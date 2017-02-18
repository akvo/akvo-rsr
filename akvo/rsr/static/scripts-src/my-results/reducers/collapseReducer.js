/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import update from "immutability-helper"
import { UPDATE_MODEL_FULFILLED, DELETE_FROM_MODEL } from "../reducers/modelsReducer"


export const
    KEY_SET_ACTIVE = "KEY_SET_ACTIVE",
    KEY_CLOSE = "KEY_CLOSE";

const levelsOrder = ["results", "indicators", "periods", "updates", "comments"];

export default function collapseReducer(keys={}, action) {
    // Reducer for managing the Collapse.activeKey states
    switch(action.type) {

        case KEY_SET_ACTIVE: {
            // Set the model to current activeKey list
            const {collapseId, activeKey} = action.payload;
            keys = {...keys, [collapseId]: activeKey};
            break;
        }

        case KEY_CLOSE: {
            const model = action.payload.model;
            keys = {...keys, [model]: []};
            break;
        }

        case UPDATE_MODEL_FULFILLED: {
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

        case DELETE_FROM_MODEL: {
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
