/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */


import * as c from "../const";


export const initializeAlert = alertName => {
    return {type: c.INITIALIZE_ALERT, alertName}
};


export const createAlert = (alertName, alertMessage) => {
    return {type: c.CREATE_ALERT, alertName, alertMessage}
};


export const dismissAlert = alertName => {
    return {type: c.DISMISS_ALERT, alertName}
};


export const destroyAlert = alertName => {
    return {type: c.DESTROY_ALERT, alertName}
};


export const dismissAllAlerts = () => {
    return {type: c.DISMISS_ALL_ALERTS};
};


export const destroyAllAlerts = () => {
    return {type: c.DESTROY_ALL_ALERTS};
};
