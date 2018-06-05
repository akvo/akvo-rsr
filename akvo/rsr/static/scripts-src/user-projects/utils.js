/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

export const endpoints = {
    user_projects_access: id => `/rest/v1/user_projects_access/${id}/?format=json`
};

export const inArray = (obj, arr) => arr && arr.indexOf(obj) !== -1;

export const dataFromElement = elementName => {
    return JSON.parse(document.getElementById(elementName).innerHTML);
};
