/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import store from "../store"

import {
    UI_ID_RESET, UI_ID_TOGGLE, UI_ID_TRUE, UI_ID_FALSE, ALL_MODELS_FETCHED, SET_PERIOD_DATES
} from "../reducers/uiReducer"

import { MODELS_LIST, OBJECTS_USER, SELECTED_PERIODS, UPDATE_FORMS, OBJECTS_PERIODS} from "../const"
import { openNodes } from "../utils"

export function periodSelectReset() {
    store.dispatch({
        type: UI_ID_RESET,
        payload: {element: SELECTED_PERIODS}
    })
}


export function periodSelectToggle(id) {
    store.dispatch({
        type: UI_ID_TOGGLE,
        payload: {element: SELECTED_PERIODS, id: id}
    })
}


export function periodSelectCheck(id) {
    store.dispatch({
        type: UI_ID_TRUE,
        payload: {element: SELECTED_PERIODS, id: id}
    })
}


export function updateFormToggle(id) {
    store.dispatch({
        type: UI_ID_TOGGLE,
        payload: {element: UPDATE_FORMS, id: id}
    })
}


export function updateFormOpen(id) {
    store.dispatch({
        type: UI_ID_TRUE,
        payload: {element: UPDATE_FORMS, id: id}
    })
}


export function updateFormClose(id) {
    store.dispatch({
        type: UI_ID_FALSE,
        payload: {element: UPDATE_FORMS, id: id}
    });
}


export function activateToggleAll() {
    // Have we fetched all models? Include current user info too.
    const allFetched = MODELS_LIST.concat([OBJECTS_USER]).every(
        (model) => store.getState().models[model].fetched
    );
    if (allFetched) {
        store.dispatch({
            type: ALL_MODELS_FETCHED,
            payload: true
        });
    }
}

function checkSelected(element, ids) {
    ids.map((id) => {
        store.dispatch({
            type: UI_ID_TRUE,
            payload: {element, id}
        })
    })
}

function checkAndShowPeriods(ids) {
    periodSelectReset();
    checkSelected(SELECTED_PERIODS, ids);
    openNodes(OBJECTS_PERIODS, ids, true);
}

function filterPeriodsByLock(locked) {
    const periods = store.getState().models[OBJECTS_PERIODS];
    return periods.ids.filter((id) => periods.objects[id].locked == locked);
}

function selectLockedPeriods() {
    checkAndShowPeriods(filterPeriodsByLock(true));
}

function selectUnlockedPeriods() {
    checkAndShowPeriods(filterPeriodsByLock(false));
}

function selectPeriodByDates(periodStart, periodEnd) {
    const periods = store.getState().models[OBJECTS_PERIODS];
    const filteredIds = periods.ids.filter((id) => (
        periods.objects[id].period_start === periodStart &&
        periods.objects[id].period_end === periodEnd
    ));
    checkAndShowPeriods(filteredIds);
}


export function selectablePeriods() {
    // Create an array with the set of Period start and end dates. Used to select all periods with
    // common dates
    const periodIds = store.getState().models[OBJECTS_PERIODS].ids;
    // Create a list of start/end dates as strings to be able to apply Set to the list.
    // dates = ["2016-05-01:2016-12-31", "2017-01-01:2017-06-30",...]
    const dates = periodIds.map((id) => {
        const period = store.getState().models[OBJECTS_PERIODS].objects[id];
        const periodStart = period.period_start;
        const periodEnd = period.period_end;
        return `${periodStart}:${periodEnd}`;
    });
    // Calculate how many we have of each date pair.
    // dateMap = {2016-05-01:2016-12-31: 4, 2017-01-01:2017-06-30: 3, ...}
    var dateMap = dates.reduce(function(acc, date) {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const datesSet = new Set(dates);
    // Construct the final store data structure with a label for display in the select, and a value
    // that's selectPeriodByDates with bound params, called when the select is used
    // periodDates = [
    //     {label: "2016-05-01 - 2016-12-31 (4)", value: selectPeriodByDates.bind(null, "2016-05-01", "2016-12-31")},
    //     {label: "2017-01-01 - 2017-06-30 (3)", value: selectPeriodByDates.bind(null, "2017-01-01", "2017-06-30")},
    //     ...
    // ]
    const periodDates = [...datesSet].map((datePair) => {
        const [periodStart, periodEnd] = datePair.split(':');
        const dateCount = dateMap[datePair];
        return {
            value: selectPeriodByDates.bind(null, periodStart, periodEnd),
            label: `${periodStart} - ${periodEnd} (${dateCount})`
        };
    });
    const optionStyle = {color: 'black'};
    const lockedCount = filterPeriodsByLock(true).length;
    const unlockedCount = filterPeriodsByLock(false).length;
    // Construct labels and values for selecting all locked or unlocked periods similarly to above,
    // as well as "header" labels that aren't selectable
    const periodSelectOptions = [
        {label: <strong style={optionStyle}>{'Select by status'}</strong>, value: null, disabled: true},
        {label: `Locked periods (${lockedCount})`, value: selectLockedPeriods},
        {label: `Unlocked periods (${unlockedCount})`, value: selectUnlockedPeriods},
        {label: <strong style={optionStyle}>{'Select by period date'}</strong>, value: null, disabled: true},
    ];
    // Dispatch the concatenation of periodSelectOptions and periodDates to the ui store
    store.dispatch({
        type: SET_PERIOD_DATES,
        payload: periodSelectOptions.concat(periodDates),
    });
}
