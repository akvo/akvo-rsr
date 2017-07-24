/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import * as c from "../const"
import store from "../store"
import {
    closeNodes,
    displayDate,
    distinct,
    openNodes,
    setHash,
} from "../utils"


export function periodSelectReset() {
    store.dispatch({
        type: c.UI_ID_RESET,
        payload: {element: c.SELECTED_PERIODS}
    })
}


export function periodSelectToggle(id) {
    store.dispatch({
        type: c.UI_ID_TOGGLE,
        payload: {element: c.SELECTED_PERIODS, id: id}
    })
}


export function periodSelectCheck(id) {
    store.dispatch({
        type: UI_ID_TRUE,
        payload: {element: c.SELECTED_PERIODS, id: id}
    })
}


export function updateFormToggle(id) {
    store.dispatch({
        type: c.UI_FLAG_TOGGLE,
        payload: {element: c.UPDATE_FORM_DISPLAY, id}
    })
}


export function updateFormOpen(id) {
    store.dispatch({
        type: c.UI_FLAG_TRUE,
        payload: {element: c.UPDATE_FORM_DISPLAY, id}
    })
}


export function updateFormClose() {
    store.dispatch({
        type: c.UI_FLAG_FALSE,
        payload: {element: c.UPDATE_FORM_DISPLAY}
    });
}


export function activateToggleAll() {
    // Have we fetched all models? Include current user info too.
    const allFetched = c.MODELS_LIST.concat([c.OBJECTS_USER]).every(
        (model) => store.getState().models[model].fetched
    );
    if (allFetched) {
        store.dispatch({
            type: c.ALL_MODELS_FETCHED,
            payload: true
        });
    }
}


function checkSelected(element, ids) {
    ids.map((id) => {
        store.dispatch({
            type: c.UI_ID_TRUE,
            payload: {element, id}
        })
    })
}


function uiHideMode(mode) {
    store.dispatch({
        type: c.UI_HIDE,
        payload: {mode}
    })
}


export function activateFilterCSS(button) {
    store.dispatch({
        type: c.UI_FILTER_BUTTON_ACTIVE,
        payload: {button}
    })
}


export function deactivateFilter() {
    store.dispatch({
        type: c.UI_FILTER_BUTTON_ACTIVE,
        payload: {button: undefined}
    })
}


export function noHide() {
    uiHideMode(false);
    deactivateFilter();
}


export function showUpdates(updateIds,openForm=false,collapse=false) {
    periodSelectReset();
    uiHideMode(c.OBJECTS_PERIODS);
    updateFormClose();
    if (openForm) {
        updateIds.map((id) => updateFormOpen(id));
    }
    openNodes(c.OBJECTS_UPDATES, updateIds, true);
    if (collapse) {
        closeNodes(c.OBJECTS_UPDATES, updateIds);
    }
}


function checkAndShowPeriods(ids) {
    periodSelectReset();
    checkSelected(c.SELECTED_PERIODS, ids);
    uiHideMode(c.OBJECTS_PERIODS);
    activateFilterCSS(c.FILTER_BULK_SELECT);
    openNodes(c.OBJECTS_PERIODS, ids, true);
}


export function filterPeriods(periodIds) {
    periodSelectReset();
    uiHideMode(c.OBJECTS_PERIODS);
    openNodes(c.OBJECTS_PERIODS, periodIds, true);
}


export function selectPeriodByDates(periodStart, periodEnd) {
    const periods = store.getState().models[c.OBJECTS_PERIODS];
    const filteredIds = periods.ids.filter((id) => (
        periods.objects[id].period_start === periodStart &&
        periods.objects[id].period_end === periodEnd
    ));
    checkAndShowPeriods(filteredIds);
    setHash(c.SELECTED_PERIODS + ':' + periodStart + ':' + periodEnd);
}


export function selectablePeriods(periodIds) {
    // Create an array with the set of Period start and end dates. Used to select all periods with
    // common dates
    // const periodIds = store.getState().models[OBJECTS_PERIODS].ids;
    // Create a list of start/end dates as strings to be able to apply Set to the list.
    // dates = ["2016-05-01:2016-12-31", "2017-01-01:2017-06-30",...]
    const optionStyle = {color: 'black'};
    if (periodIds && periodIds.length > 0) {
        const dates = periodIds.map((id) => {
            const period = store.getState().models[c.OBJECTS_PERIODS].objects[id];
            const periodStart = period.period_start;
            const periodEnd = period.period_end;
            return `${periodStart}:${periodEnd}`;
        });
        // Calculate how many we have of each date pair.
        // dateMap = {2016-05-01:2016-12-31: 4, 2017-01-01:2017-06-30: 3, ...}
        let dateMap = dates.reduce(function(acc, date) {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        // Construct the final data structure with a label for display in the select, and a value
        // that's selectPeriodByDates function with bound params, called when the select is used
        // periodDates = [
        //     {label: "1 May 2016 - 31 Dec 2016 (4)", value: selectPeriodByDates.bind(null, "2016-05-01", "2016-12-31")},
        //     {label: "1 Jan 2017 - 20 Jun 2017 (3)", value: selectPeriodByDates.bind(null, "2017-01-01", "2017-06-30")},
        //     ...
        // ]
        const periodDates = distinct(dates).map((datePair) => {
            const [periodStart, periodEnd] = datePair.split(':');
            const periodStartDisplay = displayDate(periodStart);
            const periodEndDisplay = displayDate(periodEnd);
            const dateCount = dateMap[datePair];
            return {
                value: selectPeriodByDates.bind(null, periodStart, periodEnd),
                label: `${periodStartDisplay} - ${periodEndDisplay} (${dateCount})`
            };
        });
        // Label for the options
        return periodDates;
    }
    return  [];
}
