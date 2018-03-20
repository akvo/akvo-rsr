/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
*/

import * as c from "../const";

export default function pageReducer(state = {}, action) {
    switch (action.type) {
        case c.PAGE_SET_DATA: {
            return action.payload.data;
        }
    }
    return state;
}
