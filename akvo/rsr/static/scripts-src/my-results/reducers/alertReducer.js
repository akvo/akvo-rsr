/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */


// import {
//     c.CREATE_ALERT,
//     c.DESTROY_ALERT,
//     c.DISMISS_ALERT,
//     c.DISMISS_ALL_ALERTS,
//     c.INITIALIZE_ALERT
// } from "../const";
import * as c from "../const"

const initialState = {isVisible: false, message: ''};

const behaviors = {
    [c.CREATE_ALERT](state, action) {
        const {alertMessage} = action;
        return {isVisible: true, message: alertMessage};
    },
    [c.DISMISS_ALERT](state, action) {
        return initialState;
    }
};

const reducer = (state, action) => {
    const behavior = behaviors[action.type];
    return behavior ? behavior(state, action) : state;
};

const alertReducer = (state = {}, action = {}) => {
    const {type, alertName} = action;
    if (state === undefined) return state;
    if (type === c.INITIALIZE_ALERT) {
        return {
            ...state,
            [alertName]: initialState
        };
    }
    if (type === c.DISMISS_ALL_ALERTS) {
        return Object.keys(state).reduce((acc, alert) =>
                Object.assign({}, acc, {[alert]: initialState}),
            {});
    }

    if (state[alertName] === undefined) return state;
    if (type === c.DESTROY_ALERT) {
        return Object.keys(state).reduce((acc, alert) =>
                alert === alertName ? acc : {...acc, [alert]: state[alert]},
            {});
    }
    return Object.assign({}, state, {
        [alertName]: reducer(state[alertName], action)
    });
};

export default alertReducer;