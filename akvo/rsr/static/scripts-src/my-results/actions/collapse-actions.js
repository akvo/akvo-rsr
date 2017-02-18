/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { KEY_SET_ACTIVE, KEY_ADD_NEW } from "../reducers/collapseReducer"


export function onChange(collapseId, activeKey) {
    return {
        type: KEY_SET_ACTIVE,
        payload: {collapseId, activeKey}
    }
}


export function addKey(collapseId, key) {
    return {
        type: KEY_ADD_NEW,
        payload: {collapseId, key}
    }
}
