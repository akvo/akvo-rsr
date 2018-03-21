/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

/*
    Use "reselect" to create memoized data transformations
 */

import { createSelector } from "reselect";

import * as c from "./const";

import { computePercentage, idsToActiveKey, isEmpty } from "./utils";

// Input selectors for models
const getResultIds = store => store.models.results.ids;
const getResultObjects = store => store.models.results.objects;
const getIndicatorIds = store => store.models.indicators.ids;
const getIndicatorObjects = store => store.models.indicators.objects;
const getDimensionIds = store => store.models.dimensions.ids;
const getDimensionObjects = store => store.models.dimensions.objects;
const getPeriodIds = store => store.models.periods.ids;
const getPeriodObjects = store => store.models.periods.objects;
const getUpdateIds = store => store.models.updates.ids;
const getUpdateObjects = store => store.models.updates.objects;
const getDisaggregationIds = store => store.models.disaggregations.ids;
const getDisaggregationObjects = store => store.models.disaggregations.objects;
const getCommentIds = store => store.models.comments.ids;
const getCommentObjects = store => store.models.comments.objects;
const getUser = store => store.models.user;

const getChildrenFactory = model => {
    const modelSelectors = {
        // {childModelName: [parentIds, parentSelector, childrenIds, childrenSelector]}
        [c.OBJECTS_INDICATORS]: [
            getResultIds,
            getResultObjects,
            getIndicatorIds,
            getIndicatorObjects
        ],
        [c.OBJECTS_DIMENSIONS]: [
            getIndicatorIds,
            getIndicatorObjects,
            getDimensionIds,
            getDimensionObjects
        ],
        [c.OBJECTS_PERIODS]: [getIndicatorIds, getIndicatorObjects, getPeriodIds, getPeriodObjects],
        [c.OBJECTS_UPDATES]: [getPeriodIds, getPeriodObjects, getUpdateIds, getUpdateObjects],
        [c.OBJECTS_DISAGGREGATIONS]: [
            getUpdateIds,
            getUpdateObjects,
            getDisaggregationIds,
            getDisaggregationObjects
        ],
        [c.OBJECTS_COMMENTS]: [getUpdateIds, getUpdateObjects, getCommentIds, getCommentObjects]
    };
    return createSelector(
        [
            modelSelectors[model][0],
            modelSelectors[model][1],
            modelSelectors[model][2],
            modelSelectors[model][3]
        ],
        (parentIds, parentObjects, childIds, childObjects) => {
            if (parentIds && parentObjects && childIds && childObjects) {
                return (
                    parentIds &&
                    parentObjects &&
                    parentIds.reduce((acc, parentId) => {
                        return {
                            ...acc,
                            [parentId]:
                                childIds &&
                                childObjects &&
                                childIds.filter(
                                    id => childObjects[id][c.PARENT_FIELD[model]] === parentId
                                )
                        };
                    }, {})
                );
            } else {
                return {};
            }
        }
    );
};

export const getResultsChildrenIds = createSelector(
    /*
        Return an object with the structure
         {
             [resultId1]: [childIndicatorId1, childIndicatorId2, ...],
             [resultId2]: [childIndicatorId3, childIndicatorId3, ...],
             ...
         }
        Used to find all children indicators to a result object
     */
    getChildrenFactory(c.OBJECTS_INDICATORS),
    children => children
);

export const getIndicatorsChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for indicators and period children
    getChildrenFactory(c.OBJECTS_PERIODS),
    children => children
);

export const getIndicatorsDimensionIds = createSelector(
    // Same structure as getResultsChildrenIds but for indicators and dimension children
    getChildrenFactory(c.OBJECTS_DIMENSIONS),
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

export const getUpdatesDisaggregationIds = createSelector(
    // Same structure as getResultsChildrenIds but for updates and disaggregation children
    getChildrenFactory(c.OBJECTS_DISAGGREGATIONS),
    children => children
);

export const getUpdatesDisaggregationObjects = createSelector(
    // Same structure as getResultsChildrenIds but for updates and disaggregation children
    [getUpdatesDisaggregationIds, getDisaggregationObjects],
    (updateDisaggregationIds, disaggregationObjects) => {
        return Object.entries(updateDisaggregationIds).reduce(
            (acc, [update_id, disaggregationIds]) => {
                return {
                    ...acc,
                    [update_id]: disaggregationIds.map(id => disaggregationObjects[id])
                };
            },
            {}
        );
    }
);

export const getApprovedUpdateIds = createSelector(
    [getUpdateIds, getUpdateObjects],
    (updateIds, updates) => updateIds.filter(id => updates[id].status === c.UPDATE_STATUS_APPROVED)
);

export const getPeriodsApprovedDisaggregationIds = createSelector(
    /*
        Return an object with the structure
        {
            [periodId1]: [disaggregationId1, disaggregationId2, ...],
            [periodId2]: [disaggregationId3, disaggregationId4, ...],
            ...
        }
        Used to find all disaggregations for approved updates for a period
     */
    [
        getPeriodsChildrenIds,
        getUpdatesDisaggregationIds,
        getApprovedUpdateIds,
        getUpdateObjects,
        getDisaggregationObjects
    ],
    (periodsChildrenIds, updateDisaggregationIds, approvedUpdateIds, updates, disaggregations) => {
        return (
            periodsChildrenIds &&
            Object.keys(periodsChildrenIds).reduce(
                (obj, periodId) =>
                    (obj = {
                        ...obj,
                        [periodId]: periodsChildrenIds[periodId]
                            .reduce(
                                (arr, updateId) =>
                                    (arr = arr.concat(
                                        updateDisaggregationIds[updateId].filter(
                                            disaggId =>
                                                disaggregations[disaggId].update === updateId &&
                                                approvedUpdateIds.indexOf(updateId) > -1
                                        )
                                        // sort on dimension to keep the order of dimensions defined in the project editor
                                    )),
                                []
                            )
                            .sort(
                                (a, b) =>
                                    disaggregations[a].dimension - disaggregations[b].dimension
                            )
                    }),
                {}
            )
        );
    }
);

export const getPeriodsActualValue = createSelector(
    /*
        Return an object on the form:
        {periodId1: <actualValue1>, periodId2: <actualValue2>,...}
     */
    [getPeriodIds, getPeriodObjects, getUpdateObjects, getPeriodsChildrenIds],
    (periodIds, periodObjects, updateObjects, childUpdateIds) => {
        return (
            periodIds &&
            updateObjects &&
            !isEmpty(childUpdateIds) &&
            periodIds.reduce((acc, periodId) => {
                const actualValue = childUpdateIds[periodId]
                    .filter(updateId => updateObjects[updateId].status == c.UPDATE_STATUS_APPROVED)
                    .reduce(
                        // Actual value is calculated by adding all approved updates with numerical data
                        (acc, updateId) => {
                            const value = parseInt(updateObjects[updateId].value);
                            // If value is NaN then value !== value returns true!
                            if (!(value !== value)) {
                                return acc + value;
                            }
                            return acc;
                        },
                        0
                    );
                // We allow users to set an actual value on periods directly from the
                // project editor. When there are no updates, over which we can
                // aggregate, this value should be used as the actual value. Also, the
                // UI only allows actual values to be numbers, so we try and convert
                // it to a number.
                const periodActualValue = parseFloat(periodObjects[periodId].actual_value) || 0;
                return {
                    ...acc,
                    [periodId]:
                        childUpdateIds[periodId].length > 0 ? actualValue : periodActualValue
                };
            }, {})
        );
    }
);

export const getIndicatorsAggregateActualValue = createSelector(
    /*
        Return an object on the form:
        {
            indicatorId1: <aggregateActualValue1>,
            indicatorId2: <aggregateActualValue2>,...
        }
     */
    [
        getIndicatorIds,
        getIndicatorObjects,
        getIndicatorsChildrenIds,
        getPeriodObjects,
        getPeriodsActualValue
    ],
    (indicatorIDs, indicatorObjects, childPeriodIds, periodObjects, actualValue) => {
        return (
            indicatorIDs &&
            indicatorObjects &&
            childPeriodIds &&
            !isEmpty(actualValue) &&
            indicatorIDs.reduce((acc, indicatorId) => {
                let aggregateValue;
                if (indicatorObjects[indicatorId].measure === c.MEASURE_PERCENTAGE) {
                    // Computed aggregate percentage -> (sum of all numerators) * 100 / (last/latest denominator)
                    const numerator = childPeriodIds[indicatorId].reduce((sum, periodId) => {
                        return sum + (parseFloat(periodObjects[periodId].numerator) || 0);
                    }, 0);
                    const childPeriods = childPeriodIds[indicatorId].map(id => {
                        return periodObjects[id];
                    });
                    const latestPeriod = periods => {
                        periods.sort((period1, period2) => {
                            return period1.period_end < period2.period_end ? 1 : -1;
                        });
                        return periods[0];
                    };
                    const denominator =
                        childPeriods.length == 0
                            ? 0
                            : childPeriods.length == 1
                              ? childPeriods[0].denominator
                              : latestPeriod(childPeriods).denominator;
                    aggregateValue = computePercentage(numerator, denominator);
                } else {
                    aggregateValue = childPeriodIds[indicatorId].reduce((sum, periodId) => {
                        return sum + actualValue[periodId];
                    }, 0);
                }
                return { ...acc, [indicatorId]: aggregateValue };
            }, {})
        );
    }
);

export const getIndicatorsAggregateTargetValue = createSelector(
    /*
        Return an object on the form:
        {
            indicatorId1: <aggregateTargetValue1>,
            indicatorId2: <aggregateTargetValue2>,...
        }
    */
    [getIndicatorIds, getIndicatorsChildrenIds, getPeriodObjects],
    (indicatorIDs, childPeriodIds, periodObjects) => {
        return (
            indicatorIDs &&
            childPeriodIds &&
            periodObjects &&
            indicatorIDs.reduce((acc, indicatorId) => {
                const aggregateValue = childPeriodIds[indicatorId].reduce((acc, periodId) => {
                    const target_value = parseInt(periodObjects[periodId].target_value);
                    // If target_value is NaN then target_value !== target_value returns true!
                    if (!(target_value !== target_value)) {
                        return acc + target_value;
                    } else {
                        return acc;
                    }
                }, 0);
                return { ...acc, [indicatorId]: aggregateValue };
            }, {})
        );
    }
);

export const getIndicatorsAggregateCompletionPercentage = createSelector(
    /*
      Return an object on the form:
        {
            indicatorId1: <aggregateCompletionPercentage1>,
            indicatorId2: <aggregateCompletionPercentage2>,...
        }
    */
    [getIndicatorIds, getIndicatorsAggregateTargetValue, getIndicatorsAggregateActualValue],
    (indicatorIDs, targetValue, actualValue) => {
        return indicatorIDs.reduce((acc, indicatorId) => {
            const target = targetValue[indicatorId],
                actual = actualValue[indicatorId],
                completion =
                    target != undefined && target > 0 ? Math.round(actual * 100 / target) : NaN;
            return { ...acc, [indicatorId]: completion };
        }, {});
    }
);

export const getPendingUpdates = createSelector(
    /*
        Return an array with IDs of updates with status == c.UPDATE_STATUS_PENDING
     */
    [getUpdateIds, getPeriodObjects, getUpdateObjects],
    (updateIds, periodObjects, updateObjects) => {
        return (
            updateIds &&
            periodObjects &&
            updateObjects &&
            updateIds.filter(
                id =>
                    updateObjects[id].status === c.UPDATE_STATUS_PENDING &&
                    periodObjects[updateObjects[id].period].locked == false
            )
        );
    }
);

export const getApprovedUpdates = createSelector(
    /*
        Return an array with IDs of updates with status == c.UPDATE_STATUS_APPROVED
     */
    [getUpdateIds, getPeriodObjects, getUpdateObjects],
    (updateIds, periodObjects, updateObjects) => {
        return (
            updateIds &&
            periodObjects &&
            updateObjects &&
            updateIds.filter(
                id =>
                    updateObjects[id].status === c.UPDATE_STATUS_APPROVED &&
                    periodObjects[updateObjects[id].period].locked == false
            )
        );
    }
);

export const getLockedPeriods = createSelector(
    [getPeriodIds, getPeriodObjects],
    (periodIds, periodObjects) =>
        periodIds && periodObjects && periodIds.filter(id => periodObjects[id].locked === true)
);

export const getUnlockedPeriods = createSelector(
    [getPeriodIds, getPeriodObjects],
    (periodIds, periodObjects) =>
        periodIds && periodObjects && periodIds.filter(id => periodObjects[id].locked === false)
);

export const getApprovedPeriods = createSelector(
    /*
        return an array of periodIds for periods with at least on update with UPDATE_STATUS_APPROVED
        status
     */
    [getPeriodObjects, getUnlockedPeriods, getPeriodsChildrenIds, getUpdateObjects],
    (periodObjects, unlockedPeriods, periodChildren, updateObjects) =>
        unlockedPeriods &&
        updateObjects &&
        unlockedPeriods.filter(
            id =>
                periodChildren[id].filter(
                    updateId => updateObjects[updateId].status === c.UPDATE_STATUS_APPROVED
                ).length > 0
        )
);

export const getUpdatesForApprovedPeriods = createSelector(
    /*
        Return an array with IDs of updates that are children of periods returned from
        getApprovedPeriods
     */
    [getUpdateIds, getUpdateObjects, getApprovedPeriods],
    (updateIds, updateObjects, periodIds) =>
        updateIds &&
        updateObjects &&
        periodIds &&
        updateIds.filter(updateId => periodIds.indexOf(updateObjects[updateId].period) !== -1)
);

export const getNeedReportingPeriods = createSelector(
    /*
        return an array of periodIds for periods with no updates or at least one "needs reporting"
        status update
     */
    [getPeriodObjects, getUnlockedPeriods, getPeriodsChildrenIds, getUpdateObjects],
    (periodObjects, unlockedPeriods, periodChildren, updateObjects) =>
        unlockedPeriods &&
        updateObjects &&
        unlockedPeriods.filter(
            id =>
                isEmpty(periodChildren[id]) ||
                periodChildren[id].filter(
                    updateId =>
                        updateObjects[updateId].status === c.UPDATE_STATUS_DRAFT ||
                        updateObjects[updateId].status === c.UPDATE_STATUS_NEW ||
                        updateObjects[updateId].status === c.UPDATE_STATUS_REVISION
                ).length > 0
        )
);

export const getUpdatesForNeedReportingPeriods = createSelector(
    /*
        Return an array with IDs of updates that are children of periods returned from
        getNeedReportingPeriods
     */
    [getUpdateIds, getUpdateObjects, getNeedReportingPeriods],
    (updateIds, updateObjects, periodIds) =>
        updateIds &&
        updateObjects &&
        periodIds &&
        updateIds.filter(updateId => periodIds.indexOf(updateObjects[updateId].period) !== -1)
);

export const getPendingApprovalPeriods = createSelector(
    /*
        return an array of periodIds for periods with at least on update with UPDATE_STATUS_PENDING
        status
     */
    [getPeriodObjects, getUnlockedPeriods, getPeriodsChildrenIds, getUpdateObjects],
    (periodObjects, unlockedPeriods, periodChildren, updateObjects) =>
        unlockedPeriods &&
        updateObjects &&
        unlockedPeriods.filter(
            id =>
                periodChildren[id].filter(
                    updateId => updateObjects[updateId].status === c.UPDATE_STATUS_PENDING
                ).length > 0
        )
);

export const getUpdatesForPendingApprovalPeriods = createSelector(
    /*
        Return an array with IDs of updates that are children of periods returned from
        getPendingApprovalPeriods
     */
    [getUpdateIds, getUpdateObjects, getPendingApprovalPeriods],
    (updateIds, updateObjects, periodIds) =>
        updateIds &&
        updateObjects &&
        periodIds &&
        updateIds.filter(updateId => periodIds.indexOf(updateObjects[updateId].period) !== -1)
);

export const getResultsDefaultKeys = createSelector(
    /*
        Just an array of IDs as string, used to set the top collapse (for Results) to all open
     */
    [getResultIds],
    resultIds => idsToActiveKey(resultIds)
);
