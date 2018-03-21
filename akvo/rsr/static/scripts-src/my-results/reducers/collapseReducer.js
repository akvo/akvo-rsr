/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import update from "immutability-helper";

import * as c from "../const";
import { distinct } from "../utils";

export default function collapseReducer(keys = {}, action) {
    // Reducer for managing the Collapse.activeKey states
    switch (action.type) {
        case c.KEY_SET_ACTIVE: {
            // Set the model to current activeKey list
            const { collapseId, activeKey } = action.payload;
            return { ...keys, [collapseId]: activeKey };
        }

        case c.KEYS_RESET: {
            // Reset the tree
            return {};
        }

        case c.UPDATE_MODEL_FULFILLED:
        case c.KEY_ADD_TO_ACTIVE: {
            const { collapseId, object } = action.payload;
            // if collapseId isn't supplied we don't have to update keys
            if (collapseId) {
                const key = object.id.toString();
                if (keys[collapseId]) {
                    const newKeys = distinct(update(keys[collapseId], { $push: [key] }));
                    return { ...keys, [collapseId]: newKeys };
                } else {
                    return { ...keys, [collapseId]: [key] };
                }
            }
            return keys;
        }

        case c.DELETE_FROM_MODEL: {
            const { collapseId, object } = action.payload;
            const keyToRemove = object.id.toString();
            return {
                ...keys,
                // in the two pane view the updates collapse is probably closed as this is the
                // default view, so we need to check if keys[collapseId] exists before changing it
                [collapseId]: keys[collapseId]
                    ? keys[collapseId].filter(key => key !== keyToRemove)
                    : []
            };
        }
    }
    return keys;
}
