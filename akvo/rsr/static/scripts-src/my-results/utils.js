/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';

import store from "./store"
import { MODELS_LIST, PARENT_FIELD } from "./const"


let months;

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

export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
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

export function APICall(method, url, data, callback, retries) {
    function modify(method, url, data){
        return fetch(url, {
            credentials: 'same-origin',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        })
    }

    let handler;
    switch (method) {
        case "GET":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            break;

        case "POST":
            handler = () => modify('POST', url, data);
            break;

        case "PUT":
            handler = () => modify('PUT', url, data);
            break;

        case "PATCH":
            handler = () => modify('PATCH', url, data);
            break;

        case "DELETE":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')
                }
            });
            break;
    }
    return handler;
    handler()
        //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        .then(function(response) {
            if (response.status != 204)
                return response.json();
            else
                return response;
        }).then(callback);
}


// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpoints.result(17) -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
export const endpoints = {
        "result": (id) => `/rest/v1/result/${id}/?format=json`,
        "results": (id) => `/rest/v1/result/?format=json&project=${id}`,
        "indicators": (id) => `/rest/v1/indicator/?format=json&result__project=${id}`,
        "periods": (id) => `/rest/v1/indicator_period/?format=json&indicator__result__project=${id}`,
        "updates": (id) => `/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=${id}`,
        "comments": (id) => `/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=${id}`,
        "period": (id) => `/rest/v1/indicator_period/${id}/?format=json`,
        "update_and_comments": (id) => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
        "updates_and_comments": () => `/rest/v1/indicator_period_data_framework/?format=json`,
        "user": (id) => `/rest/v1/user/${id}/?format=json`,
        "partnerships": (id) => `/rest/v1/partnership/?format=json&project=${id}`,
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
    if (!strings) {
        strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
    }
    return strings[s];
}

export const isNewUpdate = (update) => {return update.id.toString().substr(0, 4) === 'new-'};


const ToggleButton = ({onClick, label}) => {
    return (
        <a onClick={onClick}
            className={'btn btn-sm btn-default'}
            style={{margin: '0.3em 0.5em'}}>
            {label}
        </a>
    )
};

ToggleButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};


export const findChildren = (parentId, childModel, parentField) => {
    // Filter childModel based on equality of FK field (parentField) with parent id (props.parentId)
    // Return object with array of filtered ids and array of corresponding filtered objects
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


export const userId = (props) => {
    // Assumes props.user exists and holds only one user
    return props.user.ids[0];
};


export function idsToActiveKey(ids) {
    return ids.map(id => id.toString());
}


export function createToggleKey(ids, activeKey) {
    // Create an activeKey array for a Collapse element with either all panels open or none
    // uses the IDs of the panels derived from the relevant model IDs
    const allOpen = (ids.length > 0) && idsToActiveKey(ids);
    // If allOpen is identical to activeKey, all panels are already open and we close them
    return identicalArrays(activeKey, allOpen) ? [] : allOpen;
}


export function collapseId(model, id) {
    // The collapseId is created from the model name and the ID of the parent object of the Collapse
    return `${model}-${id}`;
}


function childModelName(model) {
    try {
        return MODELS_LIST[MODELS_LIST.indexOf(model) +1];
    } catch(e) {
        return undefined;
    }
}


function tree(model, parentId) {
    // Construct a tree representation of the subtree of data with object model[parentId] as root
    const ids = findChildren(parentId, model, PARENT_FIELD[model]).ids;
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
    return arr.reduce(
        (acc, val) => acc.concat(
            Array.isArray(val) ? flatten(val) : val),
        []
    );
}


function keysList(node, close) {
    // "disassemble" the tree representation of the data from tree() and return a list of objects
    const key = {
        collapseId: collapseId(node.model, node.id),
        activeKey: close ? [] : idsToActiveKey(node.children.map(child => child.id.toString()))
    };
    const children = node.children.filter((child) =>
        child.model !== undefined
    );
    const childKeys = children.map((node) =>
        keysList(node, close)
    );
    return flatten([key].concat(childKeys));

}


export function toggleTree(model, id, close) {
    const fullTree = tree(model, id);
    return keysList(fullTree, close);
}


export function createToggleKeys(parentId, model, activeKey) {
    const childIds = findChildren(
        parentId, model, PARENT_FIELD[model]).ids;
    const fullyOpenKey = idsToActiveKey(childIds);
    const close = identicalArrays(fullyOpenKey, activeKey);
    return toggleTree(model, parentId, close);
}
