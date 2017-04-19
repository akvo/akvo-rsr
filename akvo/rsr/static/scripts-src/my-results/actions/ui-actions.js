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
import { openNodes, displayDate} from "../utils"

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
    const ids = store.getState().models[OBJECTS_PERIODS].ids;
    if (ids) {
        const periodObjects = store.getState().models[OBJECTS_PERIODS].objects;
        return ids.filter((id) => periodObjects[id].locked == locked);
    }
    return [];
}

function selectLockedPeriods() {
    checkAndShowPeriods(filterPeriodsByLock(true));
}

function selectUnlockedPeriods() {
    checkAndShowPeriods(filterPeriodsByLock(false));
}

export function periodsThatNeedReporting() {
    // Returns ids of periods that are unlocked and have no updates
    const periods = store.getState().models[OBJECTS_PERIODS];
    const unlockedPeriods = filterPeriodsByLock(false);
    return unlockedPeriods.filter((id) => periods.objects[id]._meta && periods.objects[id]._meta.children.ids.length == 0);
}

export function selectPeriodsThatNeedReporting() {
    const needReporting = periodsThatNeedReporting();
    periodSelectReset();
    openNodes(OBJECTS_PERIODS, needReporting, true);
}

function selectPeriodByDates(periodStart, periodEnd) {
    const periods = store.getState().models[OBJECTS_PERIODS];
    const filteredIds = periods.ids.filter((id) => (
        periods.objects[id].period_start === periodStart &&
        periods.objects[id].period_end === periodEnd
    ));
    checkAndShowPeriods(filteredIds);
    openNodes(OBJECTS_PERIODS, filteredIds, true);
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
        // Construct the final data structure with a label for display in the select, and a value
        // that's selectPeriodByDates function with bound params, called when the select is used
        // periodDates = [
        //     {label: "1 May 2016 - 31 Dec 2016 (4)", value: selectPeriodByDates.bind(null, "2016-05-01", "2016-12-31")},
        //     {label: "1 Jan 2017 - 20 Jun 2017 (3)", value: selectPeriodByDates.bind(null, "2017-01-01", "2017-06-30")},
        //     ...
        // ]
        const periodDates = [...datesSet].map((datePair) => {
            const [periodStart, periodEnd] = datePair.split(':');
            const periodStartDisplay = displayDate(periodStart);
            const periodEndDisplay = displayDate(periodEnd);
            const dateCount = dateMap[datePair];
            return {
                value: selectPeriodByDates.bind(null, periodStart, periodEnd),
                label: `${periodStartDisplay} - ${periodEndDisplay} (${dateCount})`
            };
        });
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
        // store.dispatch({
        //     type: SET_PERIOD_DATES,
        //     payload: periodSelectOptions.concat(periodDates),
        // });
        return periodSelectOptions.concat(periodDates)
    }
    return  [
        {label: <strong style={optionStyle}>{'Select by status'}</strong>, value: null, disabled: true},
        {label: <strong style={optionStyle}>{'Select by period date'}</strong>, value: null, disabled: true},
    ];
}
