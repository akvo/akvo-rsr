/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// Note: this is currently not used and is far from ready.
// It's another way of managing cascading Collapse state

const initialLevels = {
    results: false,
    indicators: false,
    periods: false,
    updates: false,
    comments: false
};
export const levelsReducer = (state = initialLevels, action) => {
    // Changes levels state that in turn controls the full opening and closing of collapse levels
    switch (action.type) {
        case CASCADE_OPEN: {
            const openLevels = getLevelsBelow(action.payload.model);
            state = { ...state, levels: openLevels };
            break;
        }
        case CASCADE_CLOSE: {
            break;
        }
        case OPEN_LEVEL: {
            break;
        }
        case CLOSE_LEVEL: {
            break;
        }
    }
    return state;
};
