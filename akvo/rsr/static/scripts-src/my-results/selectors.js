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
import {
    OBJECTS_RESULTS,
    OBJECTS_INDICATORS,
    OBJECTS_PERIODS,
    OBJECTS_UPDATES,
    OBJECTS_COMMENTS,
    PARENT_FIELD, UPDATE_STATUS_APPROVED
} from "./const";


// Input selectors for models
const getResults = (store) => store.models.results;
const getIndicators = (store) => store.models.indicators;
const getPeriods = (store) => store.models.periods;
const getUpdates = (store) => store.models.updates;
const getComments = (store) => store.models.comments;
const getUser = (store) => store.models.user;



const getChildrenFactory = model => {
    const selectorPairs = {
        // {childModelName: [parentSelector, childrenSelector}
        [OBJECTS_INDICATORS]: [getResults, getIndicators],
        [OBJECTS_PERIODS]: [getIndicators, getPeriods],
        [OBJECTS_UPDATES]: [getPeriods, getUpdates],
        [OBJECTS_COMMENTS]: [getUpdates, getComments],
    };
    return createSelector(
        [selectorPairs[model][0], selectorPairs[model][1]],
        (parent, children) => {
            if (parent.ids && parent.objects && children.ids && children.objects) {
                return parent.ids && parent.objects && parent.ids.reduce(
                    (acc, parentId) => {
                        return {...acc,
                            [parentId]: children.ids && children.objects && children.ids.filter(
                                id =>  children.objects[id][PARENT_FIELD[model]] === parentId
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
    getChildrenFactory(OBJECTS_INDICATORS),
    children => children
);


export const getIndicatorsChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for indicators and period children
    getChildrenFactory(OBJECTS_PERIODS),
    children => children
);


export const getPeriodsChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for periods and update children
    getChildrenFactory(OBJECTS_UPDATES),
    children => children
);


export const getUpdatesChildrenIds = createSelector(
    // Same structure as getResultsChildrenIds but for updates and comment children
    getChildrenFactory(OBJECTS_COMMENTS),
    children => children
);


export const getPeriodsActualValue = createSelector(
    /*
        Return an object on the form:
        {periodId1: <actualValue1>, periodId2: <actualValue2>,...}
     */
    [getPeriods, getUpdates, getPeriodsChildrenIds],
    (periods, updates, childUpdateIds) => {
        return periods.ids.reduce((acc, periodId) => {
            const actualValue = childUpdateIds[periodId].filter(
                (updateId) => updates.objects[updateId].status == UPDATE_STATUS_APPROVED
            ).reduce(
                // Actual value is calculated by adding all approved updates with numerical data
                (acc, updateId) => {
                    const data = parseInt(updates.objects[updateId].data);
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
    [getIndicators, getIndicatorsChildrenIds, getPeriodsActualValue],
    (indicators, childPeriodIds, actualValue) => {
        return indicators.ids.reduce((acc, indicatorId) => {
            const aggregateValue = childPeriodIds[indicatorId].reduce((acc, periodId) => {
                return acc + actualValue[periodId];
            }, 0);
            return {...acc, [indicatorId]: aggregateValue}
        }, {});
    }
);
