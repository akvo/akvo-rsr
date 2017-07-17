/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from 'react';

import * as c from "./const"
import store from "./store"

import {
    collapseChange,
    collapseRecordState,
    resetKeys
} from "./actions/collapse-actions";


export function identicalArrays(array1, array2) {
    // Compare two arrays and return true if they are identical, otherwise false
    try {
        return (
            (array1.length == array2.length) &&
            array1.every((element, index) => (element === array2[index]))
        )
    } catch(e) {
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
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

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


// global holding the month's translation strings
let months;
export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    // read from the DOM once
    if (!months) {
        months = JSON.parse(document.getElementById('i18nMonths').innerHTML);
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
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
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
        "result": (id) => `/rest/v1/result/${id}/?format=json`,
        "results": (id) => `/rest/v1/result/?format=json&limit=${c.API_LIMIT}&project=${id}`,
        "indicators": (id) =>
            `/rest/v1/indicator/?format=json&limit=${c.API_LIMIT}&result__project=${id}`,
        "periods": (id) =>
            `/rest/v1/indicator_period/?format=json&limit=${c.API_LIMIT}&indicator__result__project=${id}`,
        "updates": (id) =>
            `/rest/v1/indicator_period_data/?format=json&limit=${c.API_LIMIT}&period__indicator__result__project=${id}`,
        "comments": (id) =>
            `/rest/v1/indicator_period_data_comment/?format=json&limit=${c.API_LIMIT}&data__period__indicator__result__project=${id}`,
        "post_comment": () =>
            "/rest/v1/indicator_period_data_comment/?format=json",
        "period": (id) => `/rest/v1/indicator_period/${id}/?format=json`,
        "update_and_comments": (id) => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
        "updates_and_comments": () =>
            `/rest/v1/indicator_period_data_framework/?format=json&limit=${c.API_LIMIT}`,
        "user": (id) => `/rest/v1/user/${id}/?format=json`,
        "partnerships": (id) => `/rest/v1/partnership/?format=json&limit=${c.API_LIMIT}&project=${id}`,
        "file_upload": (id) => `/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
};


export function displayNumber(numberString) {
    // Add commas to numbers of 1000 or higher.
    if (numberString !== undefined && numberString !== null) {
        var locale = "en-gb";
        var float = parseFloat(numberString);
        if (!isNaN(float)) {
            return float.toLocaleString(locale);
        }
    }
    return '';
}


// Translation a la python. Let's hope we never need lodash...
let strings;
export function _(s) {
    // load once from the DOM
    if (!strings) {
        strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
    }
    return strings[s];
}


export const findChildren = (parentId, childModel) => {
    //TODO: remove when _meta.children is fully used
    // Filter childModel based on equality of FK field (parentField) with parent id (props.parentId)
    // Return object with array of filtered ids and array of corresponding filtered objects
    const parentField = c.PARENT_FIELD[childModel];
    const model = store.getState().models[childModel];
    if (model && model.ids) {
        const { ids, objects } = model;
        const filteredIds = ids.filter(
            // if parentField is undefined return all ids (This applies to Result)
            id => parentField ? objects[id][parentField] === parentId : true
        );
        const filteredObjects = filteredIds.map(id => objects[id]);
        return {ids: filteredIds, [childModel]: filteredObjects}
    }
    return {ids: [], [childModel]: undefined};
};


export const findChildrenFromCurrentState = (modelsState, parentId, childModel) => {
    // Filter childModel based on equality of FK field (parentField) with parent id (props.parentId)
    // Return object with array of filtered ids and array of corresponding filtered objects
    const parentField = c.PARENT_FIELD[childModel];
    const model = modelsState[childModel];
    if (model && model.ids) {
        const { ids, objects } = model;
        const filteredIds = ids.filter(
            // if parentField is undefined return all ids (This applies to Result)
            id => parentField ? objects[id][parentField] === parentId : true
        );
        const filteredObjects = filteredIds.reduce(
            (acc, id) => {
                acc[id] = objects[id];
                return acc;
            }, {}
        );
        return {ids: filteredIds, objects: filteredObjects}
    }
    return {ids: [], objects: undefined};
};


export function idsToActiveKey(ids) {
    // Return the IDs as an array of strings, used as activeKey
    const unique = new Set(ids);
    return [...unique].map(id => id.toString());
}


export function createToggleKey(ids, activeKey) {
    // Create an activeKey array for a Collapse element with either all panels open or none
    // uses the IDs of the panels derived from the relevant model IDs
    const allOpen = (ids && ids.length > 0) && idsToActiveKey(ids);
    // If allOpen is identical to activeKey, all panels are already open and we close them
    return identicalArrays(activeKey, allOpen) ? [] : allOpen;
}


// Newly created updates get the id 'new-<N>' where N is an int starting at 1
export const isNewUpdate = updateOrId => {
    if (typeof updateOrId === 'object') {
        return updateOrId.id.toString().substr(0, 4) === 'new-';
    }
    return updateOrId.toString().substr(0, 4) === 'new-';
};


export function collapseId(model, id) {
    // The collapseId is created from the model name and the ID of the parent object of the Collapse
    return `${model}-${id}`;
}


function childModelName(model) {
    try {
        return c.MODELS_LIST[c.MODELS_LIST.indexOf(model) + 1];
    } catch(e) {
        return undefined;
    }
}


export function parentModelName(model) {
    try {
        return c.MODELS_LIST[c.MODELS_LIST.indexOf(model) - 1];
    } catch(e) {
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
        const mePresent = parentCollapse && parentCollapse.find((id)=> id === String(objectId));
        // hide me if I'm not present and this.props.ui.hide is not false
        return !mePresent;
    }
    return false;
}


function tree(model, parentId) {
    // Construct a tree representation of the subtree of data with object model[parentId] as root
    //TODO: refactor, we shouldn't need findChildren here
    const ids = findChildren(parentId, model).ids;
    const childModel = childModelName(model);
    const children = ids.map((cId) => {
        return tree(childModel, cId)
    });
    if (children.length > 0) {
        return {id: parentId, model: model, children: children}
    } else {
        return {id: parentId}
    }
}


function flatten(arr) {
    // Flatten an array of arrays
    return arr.reduce(
        (acc, val) => acc.concat(
            Array.isArray(val) ? flatten(val) : val),
            []
    );
}


function keysList(node, open, MEManagerKeys) {
    // "Disassemble" the tree representation of the data from tree() and return a list of objects.
    // Each object holds the collapseID of the corresponding Collapse and its activeKey
    const key = {
        collapseId: collapseId(node.model, node.id),
        activeKey: open ?
            idsToActiveKey(node.children.map(child => child.id.toString()))
        :
            MEManagerKeys || [],
    };
    const children = node.children.filter((child) =>
        child.model !== undefined
    );
    const childKeys = children.map((node) =>
        keysList(node, open)
    );
    return flatten([key].concat(childKeys));
}


export function toggleTree(model, id, open, MEManagerKeys) {
    const fullTree = tree(model, id);
    return keysList(fullTree, open, MEManagerKeys);
}


export function openResults(activeKey, isMEManager) {
    if (isMEManager) {
        return isMEManagerDefaultKeys(activeKey)
    } else {
        return activeKey == undefined || activeKey.length == 0;
    }
}

export function createToggleKeys(parentId, model, activeKey) {
    // get all child nodes
    //TODO: refactor, we shouldn't need findChildren here
    // const childIds = findChildren(parentId, model).ids;
    // determine if we should open or close
    const fullyOpenKey = idsToActiveKey(childIds);
    const open = openResults(activeKey);
    // construct the array of Collapse activeKeys for the sub-tree
    return toggleTree(model, parentId, open);
}


function lineage(model, id) {
    // return the model and ID of me and my ancestors all the way up to results
    const parentModel = parentModelName(model);
    if (parentModel) {
        const storeModel = store.getState().models[model];
        if (storeModel.objects) {
            const parentId = storeModel.objects[id][c.PARENT_FIELD[model]];
            return [{model, id}].concat(lineage(parentModel, parentId));
        }
    }
    return [{model, id}];
}


function lineageKeys(model, id) {
    // construct collapse activeKey keys for me and all my ancestors so I will be visible
    const reversedLineage = lineage(model, id).reverse();
    let parentId = c.OBJECTS_RESULTS;
    return reversedLineage.reduce(
        (keys, obj) => {
            const key = keys.concat({[collapseId(obj.model, parentId)]: [obj.id]});
            parentId = obj.id;
            return key;
        },
        []
    )
}

export function closeNodes(model, ids) {
    // Closes nodes with the given ids

    // NOTE: This code assumes that all the nodes at a particular level are
    // closed, i.e., if a node's id is present in the list of ids, all it's
    // siblings' ids are also present in the list of ids.

    const storeModel = store.getState().models[model];
    // Construct a list of collapse keys, based on ids
    const collapse_ids = ids.map((id) => {
        const parent_id = parentModelName(model)?storeModel.objects[id][c.PARENT_FIELD[model]]:model;
        return collapseId(model, parent_id);
    });
    const unique_collapse_ids = new Set(collapse_ids);
    // Collapse/close all children of the collected collapse keys
    [...unique_collapse_ids].map((id) => collapseChange(id, []));
}

export function openNodes(model, ids) {
    // construct collapse keys that represent the open state of all nodes in ids list of type model
    // and all required parents. If the reset boolean is true then first reset the whole tree.

    // get lineages of all objects based on model and ids
    const lineages = ids.map((id) => lineageKeys(model, id));
    // flatten to get an array of objects: [{collapseId: id}, ...]
    const individualKeys = flatten(lineages);

    const mergedKeys = individualKeys.reduce(
        (keys, key) => {
            const keyName = Object.keys(key)[0];
            return Object.assign(keys, {[keyName]: (keys[keyName] || []).concat(key[keyName])});
        },
        {}
    );
    resetKeys();
    Object.keys(mergedKeys).map((key) => {
        collapseChange(key, idsToActiveKey(mergedKeys[key]));
    });
    collapseRecordState();
}


export function fieldValueOrSpinner(obj, field) {
    /*
        If obj is defined return obj[field] otherwise return the spinner icon
     */
    if (obj) {
        return {value: obj[field]};
    } else {
        return {icon: <i className="fa fa-spin fa-spinner" />};
    }
}


export function setHash(hash) {
    if (hash) {
        window.location.hash = `#${hash}`;
    } else {
        window.location.hash = '';
    }
}
