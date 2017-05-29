/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

/*
    Use "reselect" to create memoized data transformations
 */

import { createSelector } from "reselect"

import * as c from "./const";
import { idsToActiveKey } from "./utils";


// Input selectors for models
const getResultIds = (store) => store.models.results.ids;
const getResultObjects = (store) => store.models.results.objects;
const getIndicatorIds = (store) => store.models.indicators.ids;
const getIndicatorObjects = (store) => store.models.indicators.objects;
const getPeriodIds = (store) => store.models.periods.ids;
const getPeriodObjects = (store) => store.models.periods.objects;
const getUpdateIds = (store) => store.models.updates.ids;
const getUpdateObjects = (store) => store.models.updates.objects;
const getCommentIds = (store) => store.models.comments.ids;
const getCommentObjects = (store) => store.models.comments.objects;
const getUser = (store) => store.models.user;


const getChildrenFactory = model => {
    const modelSelectors = {
        // {childModelName: [parentSelector, childrenSelector}
        [c.OBJECTS_INDICATORS]: [getResultIds, getResultObjects, getIndicatorIds, getIndicatorObjects],
        [c.OBJECTS_PERIODS]: [getIndicatorIds, getIndicatorObjects, getPeriodIds, getPeriodObjects],
        [c.OBJECTS_UPDATES]: [getPeriodIds, getPeriodObjects, getUpdateIds, getUpdateObjects],
        [c.OBJECTS_COMMENTS]: [getUpdateIds, getUpdateObjects, getCommentIds, getCommentObjects],
    };
    return createSelector(
        [
            modelSelectors[model][0], modelSelectors[model][1], modelSelectors[model][2],
            modelSelectors[model][3]
        ],
        (parentIds, parentObjects, childIds, childObjects) => {
            if (parentIds && parentObjects && childIds && childObjects) {
                return parentIds && parentObjects && parentIds.reduce(
                    (acc, parentId) => {
                        return {...acc,
                            [parentId]: childIds && childObjects && childIds.filter(
                                id =>  childObjects[id][c.PARENT_FIELD[model]] === parentId
                            )
                        }
                    }, {}
                )
            } else {
                return {};
            }
        }
    );
};


export const getResultsChildrenIds = createSelector(
    // Return an object with the structure
    //  {
    //      [resultId1]: [childIndicatorId1, childIndicatorId2, ...],
    //      [resultId2]: [childIndicatorId3, childIndicatorId3, ...],
    //      ...
    //  }
    // Used to find all children indicators to a result object
    getChildrenFactory(c.OBJECTS_INDICATORS),
    children => children
);


export const getIndicatorsChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for indicators and period children
    getChildrenFactory(c.OBJECTS_PERIODS),
    children => children
);


export const getPeriodsChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for periods and update children
    getChildrenFactory(c.OBJECTS_UPDATES),
    children => children
);


export const getUpdatesChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for updates and comment children
    getChildrenFactory(c.OBJECTS_COMMENTS),
    children => children
);


export const getPeriodsActualValue = createSelector(
    /*
        Return an object on the form:
        {periodId1: <actualValue1>, periodId2: <actualValue2>,...}
     */
    [getPeriodIds, getUpdateObjects, getPeriodsChildrenIds],
    (periodIds, updateObjects, childUpdateIds) => {
        return periodIds.reduce((acc, periodId) => {
            const actualValue = childUpdateIds[periodId].filter(
                (updateId) => updateObjects[updateId].status == c.UPDATE_STATUS_APPROVED
            ).reduce(
                // Actual value is calculated by adding all approved updates with numerical data
                (acc, updateId) => {
                    const data = parseInt(updateObjects[updateId].data);
                    // If data is NaN then data !== data returns true!
                    if (!(data !== data)) {
                        return acc + data;
                    }
                    return acc;
                }, 0
            );
            return {...acc, [periodId]: actualValue}
        }, {})
    }
);


export const getIndicatorsAggregateActualValue = createSelector(
    /*
        Return an object on the form:
        {indicatorId1: <aggregateActualValue1>, indicatorId2: <aggregateActualValue2>,...}
     */
    [getIndicatorIds, getIndicatorsChildrenIds, getPeriodsActualValue],
    (indicatorIDs, childPeriodIds, actualValue) => {
        return indicatorIDs.reduce((acc, indicatorId) => {
            const aggregateValue = childPeriodIds[indicatorId].reduce((acc, periodId) => {
                return acc + actualValue[periodId];
            }, 0);
            return {...acc, [indicatorId]: aggregateValue}
        }, {});
    }
);


export const getDraftUpdates = createSelector(
    /*
        Return an array with IDs of updates with status == c.UPDATE_STATUS_DRAFT
     */
    [getUpdateIds, getPeriodObjects, getUpdateObjects],
    (updateIds, periodObjects, updateObjects) => {
        return updateIds && periodObjects && updateObjects && updateIds.filter((id) =>
            updateObjects[id].status === c.UPDATE_STATUS_DRAFT &&
            periodObjects[updateObjects[id].period].locked == false
        );
    }
);


export const getApprovedUpdates = createSelector(
    /*
        Return an array with IDs of updates with status == c.UPDATE_STATUS_APPROVED
     */
    [getUpdateIds, getPeriodObjects, getUpdateObjects],
    (updateIds, periodObjects, updateObjects) => {
        return updateIds && periodObjects && updateObjects && updateIds.filter((id) =>
            updateObjects[id].status === c.UPDATE_STATUS_APPROVED &&
            periodObjects[updateObjects[id].period].locked == false
        );
    }
);


export const getApprovedPeriods = createSelector(
    /*
        Return an array with IDs of periods with at least one update where all updates have
        status == c.UPDATE_STATUS_APPROVED
     */
    [getPeriodIds, getPeriodObjects, getPeriodsChildrenIds, getUpdateObjects],
    (periodIds, periodObjects, childUpdateIds, updateObjects) => periodIds && childUpdateIds && updateObjects && periodIds.filter(
        (periodId) =>
            periodObjects[periodId].locked === false &&
            childUpdateIds[periodId].length > 0 &&
            childUpdateIds[periodId].every(
                (updateId) => updateObjects[updateId].status === c.UPDATE_STATUS_APPROVED
            )
    )
);

export const getUpdatesForApprovedPeriods = createSelector(
    /*
        Return an array with IDs of updates that are children of periods returned from
        getApprovedPeriods
     */
    [getUpdateIds, getUpdateObjects, getApprovedPeriods],
    (updateIds, updateObjects, periodIds) =>
        updateIds && updateObjects && periodIds && updateIds.filter(
            updateId => periodIds.indexOf(updateObjects[updateId].period) !== -1
        )
);


export const getLockedPeriods = createSelector(
    [getPeriodIds, getPeriodObjects],
    (periodIds, periodObjects) =>
        periodIds && periodObjects && periodIds.filter((id) => periodObjects[id].locked === true)
);


export const getUnlockedPeriods = createSelector(
    [getPeriodIds, getPeriodObjects],
    (periodIds, periodObjects) =>
        periodIds && periodObjects && periodIds.filter((id) => periodObjects[id].locked === false)
);


export const getNeedReportingPeriods = createSelector(
    [getPeriodObjects, getUnlockedPeriods, getPeriodsChildrenIds],
    (periodObjects, unlockedPeriods, periodChildren) =>
        unlockedPeriods && unlockedPeriods.filter(
            // Only filter if periodChildren !== {}
            id => Object.keys(periodChildren).length !== 0 && periodChildren[id].length === 0
    )
);


export const getMEManagerDefaultKeys = createSelector(
    /*
        Just an array of IDs as string, used to set the top collapse (for Results) to all open
     */
    [getResultIds],
    resultIds => idsToActiveKey(resultIds)
);