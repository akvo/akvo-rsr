/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import {
    INITIALIZE_ALERT,
    CREATE_ALERT,
    DISMISS_ALERT,
    DESTROY_ALERT,
    DISMISS_ALL_ALERTS,
    DESTROY_ALL_ALERTS,
} from '../const';

export const initializeAlert = alertName => {
  return { type: INITIALIZE_ALERT, alertName }
};

export const createAlert = (alertName, alertMessage) => {
  return { type: CREATE_ALERT, alertName, alertMessage }
};

export const dismissAlert = alertName => {
  return { type: DISMISS_ALERT, alertName }
};

export const destroyAlert = alertName => {
  return { type: DESTROY_ALERT, alertName }
};

export const dismissAllAlerts = () => {
 return { type: DISMISS_ALL_ALERTS };
};

export const destroyAllAlerts = () => {
  return { type: DESTROY_ALL_ALERTS };
};
