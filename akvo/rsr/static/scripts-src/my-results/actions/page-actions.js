
/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
*/


// import { PAGE_SET_DATA } from "../reducers/pageReducer"
import * as c from "../const"


export function setPageData(data) {
    return {
        type: c.PAGE_SET_DATA,
        payload: {data}
    }
}