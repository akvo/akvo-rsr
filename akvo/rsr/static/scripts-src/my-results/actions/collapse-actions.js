/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import * as c from '../const';
import store from "../store"


//TODO: decide if actions should dispatch in all cases
export function collapseChange(collapseId, activeKey) {
    store.dispatch({
        type: c.KEY_SET_ACTIVE,
        payload: {collapseId, activeKey}
    });
}


export function openPanel(collapseId, object) {
    store.dispatch({
        type: c.KEY_ADD_TO_ACTIVE,
        payload: {collapseId, object}
    });
}


export function resetKeys() {
    store.dispatch({type: c.KEYS_RESET});
}