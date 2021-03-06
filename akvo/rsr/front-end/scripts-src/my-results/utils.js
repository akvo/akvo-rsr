/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";

import * as c from "./const";
import store from "./store";

import { collapseChange, collapseRecordState, resetKeys } from "./actions/collapse-actions";

import { updateModel } from "./actions/model-actions";
import keyBy from "lodash/keyBy";
import update from "immutability-helper";

// Note: this function used to be a method of the App class, but the the transpiling messes something
// up the result being the the update function from immuatbility-helper can't be found/called
export function createNewDisaggregations(update_id, dimensionsNameAndValueIds, disaggregations) {
    const dimension_disaggregations = keyBy(disaggregations, 'dimension_value');
    let changedDisaggregations = disaggregations;
    dimensionsNameAndValueIds.forEach(({dimensionNameId, dimensionValueIds}) => {
        dimensionValueIds.forEach(dimensionValueId => {
            if (dimension_disaggregations[dimensionValueId] === undefined) {
                const disaggregation = {
                    update: update_id,
                    dimension_name: dimensionNameId,
                    dimension_value: dimensionValueId,
                    // TODO: Are the IDs sure to be unique?
                    id: "new-" + dimensionValueId,
                    value: "",
                    numerator: "",
                    denominator: "",
                    narrative: "",
                };
                changedDisaggregations = update(changedDisaggregations, {$push: [disaggregation]});
                updateModel('disaggregations', disaggregation);
            }
        })
    });
    return changedDisaggregations;
}

export function distinct(arr) {
    //return an array of uniques values
    return [...new Set(arr)];
}

export function identicalArrays(array1, array2) {
    // Compare two arrays and return true if they are identical, otherwise false
    try {
        return (
            array1.length == array2.length &&
            array1.every((element, index) => element === array2[index])
        );
    } catch (e) {
        return false;
    }
}

// From https://stackoverflow.com/questions/4994201/is-object-empty
var hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

// From https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// global holding the month's translation strings
let months;

export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    // read from the DOM once
    if (!months) {
        months = JSON.parse(document.getElementById("i18nMonths").innerHTML);
    }
    if (dateString) {
        const locale = "en-gb";
        const date = new Date(dateString.split(".")[0].replace("/", /-/g));
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return "Unknown date";
}

export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpoints.result(17) -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
export const endpoints = {
    result: id => `/rest/v1/result/${id}/?format=json`,
    results: id => `/rest/v2/result/?format=json&limit=${c.API_LIMIT}&project=${id}`,
    indicators: id => `/rest/v1/indicator/?format=json&limit=${c.API_LIMIT}&result__project=${id}`,
    dimension_names: (id) =>
        `/rest/v1/dimension_name/?format=json&limit=${c.API_LIMIT}&project=${id}`,
    dimension_values: (id) =>
        `/rest/v1/dimension_value/?format=json&limit=${c.API_LIMIT}&name__project=${id}`,
    periods: id =>
        `/rest/v1/indicator_period/?format=json&limit=${
            c.API_LIMIT
        }&indicator__result__project=${id}`,
    updates: id =>
        `/rest/v1/indicator_period_data/?format=json&limit=${
            c.API_LIMIT
        }&period__indicator__result__project=${id}`,
    disaggregations: id =>
        `/rest/v1/disaggregation/?format=json&limit=${
            c.API_LIMIT
        }&update__period__indicator__result__project=${id}`,
    comments: id =>
        `/rest/v1/indicator_period_data_comment/?format=json&limit=${
            c.API_LIMIT
        }&data__period__indicator__result__project=${id}`,
    narrative_reports: id =>
        `/rest/v1/narrative_report/?format=json&limit=${c.API_LIMIT}&project=${id}`,
    update_narrative_report: id => `/rest/v1/narrative_report/${id}/?format=json`,
    save_narrative_report: id => `/rest/v1/narrative_report/?format=json`,
    categories: id =>
        `/rest/v1/organisation_indicator_label/?format=json&limit=${
            c.API_LIMIT
        }&filter={'organisation__in':[${id}]}`,
    reports: id => `/rest/v1/project/${id}/reports/?format=json`,
    post_comment: () => "/rest/v1/indicator_period_data_comment/?format=json",
    period: id => `/rest/v1/indicator_period/${id}/?format=json`,
    update_and_comments: id => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
    updates_and_comments: () =>
        `/rest/v1/indicator_period_data_framework/?format=json&limit=${c.API_LIMIT}`,
    user: () => `/rest/v1/me/?format=json`,
    partnerships: id => `/rest/v1/partnership/?format=json&limit=${c.API_LIMIT}&project=${id}`,
    file_upload: id => `/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
};

// Translation a la python. Let's hope we never need lodash...
export function _(s) {
    const strings = store.getState().page.strings;
    return strings && strings[s];
}

export const findChildrenFromCurrentState = (modelsState, parentId, childModel) => {
    // Filter childModel based on equality of FK field (parentField) with parent id (props.parentId)
    // Return object with array of filtered ids and array of corresponding filtered objects
    const parentField = c.PARENT_FIELD[childModel];
    const model = modelsState[childModel];
    if (model && model.ids) {
        const { ids, objects } = model;
        const filteredIds = ids.filter(
            // if parentField is undefined return all ids (This applies to Result)
            id => (parentField ? objects[id][parentField] === parentId : true)
        );
        const filteredObjects = filteredIds.reduce((acc, id) => {
            acc[id] = objects[id];
            return acc;
        }, {});
        return { ids: filteredIds, objects: filteredObjects };
    }
    return { ids: [], objects: undefined };
};

export function idsToActiveKey(ids) {
    // Return the IDs as an array of strings, used as activeKey
    return distinct(ids).map(id => id.toString());
}

export function createToggleKey(ids, activeKey) {
    // Create an activeKey array for a Collapse element with either all panels open or none
    // uses the IDs of the panels derived from the relevant model IDs
    const allOpen = ids && ids.length > 0 && idsToActiveKey(ids);
    // If allOpen is identical to activeKey, all panels are already open and we close them
    return identicalArrays(activeKey, allOpen) ? [] : allOpen;
}

// Newly created updates get the id 'new-<N>' where N is an int starting at 1
export const isNewUpdate = updateOrId => {
    if (typeof updateOrId === "object") {
        return updateOrId.id.toString().substr(0, 4) === "new-";
    }
    return updateOrId.toString().substr(0, 4) === "new-";
};

export function collapseId(model, id) {
    // The collapseId is created from the model name and the ID of the parent object of the Collapse
    return `${model}-${id}`;
}

export function childModelName(model) {
    try {
        return c.RESULTS_MODELS_LIST[c.RESULTS_MODELS_LIST.indexOf(model) + 1];
    } catch (e) {
        return undefined;
    }
}

export function parentModelName(model) {
    try {
        return c.RESULTS_MODELS_LIST[c.RESULTS_MODELS_LIST.indexOf(model) - 1];
    } catch (e) {
        return undefined;
    }
}

export function levelAbove(model, compare) {
    return c.MODEL_INDEX[model] < c.MODEL_INDEX[compare];
}

export function levelBelow(model, compare) {
    return c.MODEL_INDEX[model] > c.MODEL_INDEX[compare];
}

export function hideMe(model, parentId, objectId) {
    /*
    determine if I (objectId) should be hidden
     */
    const ui = store.getState().ui;
    if (ui.hide && ui.visibleKeys) {
        // first check if I'm below the ui.hide level, if so I should be visible
        if (levelBelow(model, ui.hide)) {
            return false;
        }
        // otherwise, find the parent collapse, check that it's in ui.visibleKeys
        const parentCollapse = ui.visibleKeys[collapseId(model, parentId)];
        // if we have a parent, check if I'm one of the open panels
        const mePresent = parentCollapse && parentCollapse.find(id => id === String(objectId));
        // hide me if I'm not present and this.props.ui.hide is not false
        return !mePresent;
    }
    return false;
}

export function fullUpdateVisibility(update, activeFilter) {
    // determine if an update should be "dimmed" indicating it is shown in a filter where it's not
    // to be interacted with
    // returns true if the update should be fully visible
    let visible;
    switch (activeFilter) {
        case c.FILTER_NEED_REPORTING: {
            visible = [c.UPDATE_STATUS_NEW, c.UPDATE_STATUS_DRAFT, c.UPDATE_STATUS_REVISION];
            break;
        }
        case c.FILTER_SHOW_PENDING: {
            visible = [c.UPDATE_STATUS_PENDING];
            break;
        }
        case c.FILTER_SHOW_APPROVED: {
            visible = [c.UPDATE_STATUS_APPROVED];
            break;
        }
        default: {
            // full visibility to all updates if no filter is active
            return true;
        }
    }
    return visible.indexOf(update.status) > -1;
}

export function flatten(arr) {
    // Flatten an array of arrays
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

export function toggleTree(open) {
    const models = c.RESULTS_MODELS_LIST.slice(1);
    const fullTree = models.map(model => {
        const parentModel = parentModelName(model);
        const ids = store.getState().models[parentModel].ids;
        return ids
            .filter(id => {
                const instance = store.getState().models[parentModel].objects[id];
                return instance._meta && instance._meta.children.ids.length > 0;
            })
            .map(id => {
                const keys = store.getState().models[parentModel].objects[id]._meta.children.ids;
                return {
                    activeKey: open ? idsToActiveKey(keys) : [],
                    collapseId: collapseId(model, id)
                };
            });
    });
    return flatten(fullTree);
}

function lineage(model, id) {
    // return the model and ID of me and my ancestors all the way up to results
    const parentModel = parentModelName(model);
    if (parentModel) {
        const storeModel = store.getState().models[model];
        if (storeModel.objects) {
            const parentId = storeModel.objects[id][c.PARENT_FIELD[model]];
            return [{ model, id }].concat(lineage(parentModel, parentId));
        }
    }
    return [{ model, id }];
}

export function getAncestor(model, id, ancestorModel) {
    // return the specified ancestor object for an object given the ancestorModel
    while (model && model != ancestorModel) {
        const parentModel = parentModelName(model);
        const storeModel = store.getState().models[model];
        if (storeModel.objects) {
            const parentId = storeModel.objects[id][c.PARENT_FIELD[model]];
            return getAncestor(parentModel, parentId, ancestorModel);
        }
    }
    return store.getState().models[model].objects[id];
}

function lineageKeys(model, id) {
    // construct collapse activeKey keys for me and all my ancestors so I will be visible
    const reversedLineage = lineage(model, id).reverse();
    let parentId = c.OBJECTS_RESULTS;
    return reversedLineage.reduce((keys, obj) => {
        const key = keys.concat({
            [collapseId(obj.model, parentId)]: [obj.id]
        });
        parentId = obj.id;
        return key;
    }, []);
}

export function closeNodes(model, ids) {
    // Closes nodes with the given ids

    // NOTE: This code assumes that all the nodes at a particular level are
    // closed, i.e., if a node's id is present in the list of ids, all it's
    // siblings' ids are also present in the list of ids.

    const storeModel = store.getState().models[model];
    // Construct a list of collapse keys, based on ids
    const collapseIds = ids.map(id => {
        const parent_id = parentModelName(model)
            ? storeModel.objects[id][c.PARENT_FIELD[model]]
            : model;
        return collapseId(model, parent_id);
    });
    // Collapse/close all children of the collected collapse keys
    distinct(collapseIds).map(id => collapseChange(id, []));
}

export function openNodes(model, ids) {
    // construct collapse keys that represent the open state of all nodes in ids list of type model
    // and all required parents. If the reset boolean is true then first reset the whole tree.

    // get lineages of all objects based on model and ids
    const lineages = ids.map(id => lineageKeys(model, id));
    // flatten to get an array of objects: [{collapseId: id}, ...]
    const individualKeys = flatten(lineages);

    const mergedKeys = individualKeys.reduce((keys, key) => {
        const keyName = Object.keys(key)[0];
        return Object.assign(keys, {
            [keyName]: (keys[keyName] || []).concat(key[keyName])
        });
    }, {});
    resetKeys();
    Object.keys(mergedKeys).map(key => {
        collapseChange(key, idsToActiveKey(mergedKeys[key]));
    });
    collapseRecordState();
}

export function fieldValueOrSpinner(obj, field) {
    /*
        If obj is defined return obj[field] otherwise return the spinner icon
     */
    if (obj) {
        return { value: obj[field] };
    } else {
        return { icon: <i className="fa fa-spin fa-spinner" /> };
    }
}

export function setHash(hash) {
    if (hash) {
        window.location.hash = `#${hash}`;
    } else {
        window.location.hash = "";
    }
}

export function userIsMEManager(user) {
    return user.fetched ? user.objects[user.ids[0]].isMEManager : false;
}

export function computePercentage(numerator, denominator) {
    numerator = parseFloat(numerator) || 0;
    denominator = parseFloat(denominator) || 0;
    if (denominator != 0) {
        return Math.round10((numerator * 100) / denominator, -2);
    } else {
        return 0;
    }
}

export const filterUpdatesByStatus = (updates, ids, status) => {
    return ids.filter(id => status.indexOf(updates[id].status) > -1);
};

export const isResultsKey = key => {
    return c.RESULTS_MODELS_LIST.some(model => key.startsWith(model));
};

export const disaggregationsToDisplayData = (
    disaggregationIds, disaggregations, dimensionNames, dimensionValues
) => {
    /*  maps a number of disaggregations to the following format:
            {
                Flavor: {
                    Vanilla: 5,
                    Chocolate: 7,
                },
                Color: {
                    Red: 3,
                    Black: 7,
                    Blue: 6
                },
            }
        which is used as input to components/common/DisaggregationsDisplay
        see https://github.com/kolodny/immutability-helper#autovivification for some insight
        into the use of update() below
    */
    return (
        disaggregationIds &&
        disaggregationIds.reduce((acc, id) => {
            const disaggregation = disaggregations[id];
            const dimensionValue = dimensionValues[disaggregation.dimension_value];
            const dimensionName = dimensionNames[dimensionValue.name];
            return update(acc, {
                [dimensionName.name]: {
                    $apply: value =>
                        update(value || {}, {
                            [dimensionValue.value]: {
                                $apply: disagg => (disagg || 0) + parseInt(disaggregation.value)
                            }
                        })
                }
            });
        }, {})
    );
};

export const modifyPeriods = singlePeriodProject => {
    return data => {
        /*  Add field period.is_locked that used in lieu of period.locked.
            This is so that single period hierarchy projects can ignore locking, the periods
            are always treated as unlocked
        */
        const periods = data.map(period => {
            period.is_locked = singlePeriodProject ? false : period.locked;
            return period;
        });
        return periods;
    };
};

// Decimal rounding function (from MDN)
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function() {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === "undefined" || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
            return NaN;
        }
        // If the value is negative...
        if (value < 0) {
            return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split("e");
        value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
        // Shift back
        value = value.toString().split("e");
        return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust("round", value, exp);
        };
    }
})();
