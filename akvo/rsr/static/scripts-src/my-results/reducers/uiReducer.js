/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

export const
    UPDATE_FORM_TOGGLE = "UPDATE_FORM_TOGGLE",
    UPDATE_FORM_OPEN = "UPDATE_FORM_OPEN",
    UPDATE_FORM_CLOSE = "UPDATE_FORM_CLOSE";


export default function uiReducer(state={}, action) {
    switch(action.type) {

        case UPDATE_FORM_TOGGLE: {
            const {id} = action.payload;
            const complement = !(state[id] || false);
            state = {...state, [id]: complement};
            break;
        }

        case UPDATE_FORM_OPEN: {
            const {id} = action.payload;
            state = {...state, [id]: true};
            break;
        }

        case UPDATE_FORM_CLOSE: {
            const {id} = action.payload;
            state = {...state, [id]: false};
            break;
        }
    }
    return state;
}
