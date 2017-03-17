/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { normalize, schema } from 'normalizr';
import update  from 'immutability-helper';

export const
    FETCH_MODEL_START = "FETCH_MODEL_START",
    FETCH_MODEL_FULFILLED = "FETCH_MODEL_FULFILLED",
    FETCH_MODEL_REJECTED = "FETCH_MODEL_REJECTED",

    UPDATE_MODEL_START = "UPDATE_MODEL_START",
    UPDATE_MODEL_FULFILLED = "UPDATE_MODEL_FULFILLED",
    UPDATE_MODEL_REJECTED = "UPDATE_MODEL_REJECTED",

    DELETE_FROM_MODEL = "DELETE_FROM_MODEL",
    UPDATE_MODEL_DELETE_FULFILLED = "UPDATE_MODEL_DELETE_FULFILLED";

const itemSchema = new schema.Entity('items');
const itemArraySchema = new schema.Array(itemSchema);

const normalizedObjects = (data) => {
    return normalize(data, itemArraySchema);
};

const set = (arr) => {
    // return an array with unique values
    let seen = {},
        result=[];

	for(let i = 0; i < arr.length; i++) {
		if (!seen[arr[i]]) {
			seen[arr[i]] = true;
			result.push(arr[i]);
		}
	}
	return result;
};

const initialModels = {
    results: {fetched: false},
    indicators: {fetched: false},
    periods: {fetched: false},
    updates: {fetched: false},
    comments: {fetched: false},
    user: {fetched: false}
};

export default function modelsReducer(state=initialModels, action) {
    switch(action.type) {

        // FETCH_ actions fetch data from the backend and do the initial population of the data
        case FETCH_MODEL_START: {
            const model = action.payload.model;
            state = {
                ...state,
                [model]: {fetched: false, changing: true, changed: false, objects: {}, ids: null}
            };
            break;
        }

        case FETCH_MODEL_FULFILLED: {
            const model = action.payload.model;
            const normalized = normalizedObjects(action.payload.data);
            state = {...state, [model]: {
                fetched: true,
                changing: false,
                changed: true,
                objects: normalized.entities.items || {},
                ids: normalized.result
            }};
            break;
        }

        case FETCH_MODEL_REJECTED: {
            const model = action.payload.model;
            state = {...state, [model]: {
                fetched: false,
                changing: false,
                changed: false,
                objects: null,
                ids: null,
                error: action.payload.error
            }};
            break;
        }

        // UPDATE_ actions both modify existing and add new objects to the models, while keeping the
        // ids array in sync. Also note that some of those actions are acted on in collapseReducer
        case UPDATE_MODEL_START: {
            const model = action.payload.model;
            const modelState = state[model];
            const updatedState = update(modelState, {changing: {$set: true}, changed: {$set: true}});
            state = {...state, [model]: updatedState};
            break;
        }

        case UPDATE_MODEL_FULFILLED: {
            const { model, object } = action.payload;
            const merged = update(state[model], {
                changing: {$set: false},
                changed: {$set: true},
                objects: {$merge: {[object.id]: object}},
                ids: {$push: [object.id]}
            });
            // remove duplicate ids
            merged.ids = [...new Set(merged.ids)];
            state = {...state, [model]: merged};
            break;
        }

        case UPDATE_MODEL_REJECTED: {
            const model = action.payload.model;
            state = {...state, [model]: {changing: false, changed: false, data: null, error: action.payload.error}};
            break;
        }

        case DELETE_FROM_MODEL: {
            const { model, object } = action.payload;
            const newModel = Object.assign({}, state[model]);
            delete newModel.objects[object.id];
            newModel.ids = newModel.ids.filter(id => id !== object.id);
            state = {...state, [model]: newModel};
            break;
        }

        case UPDATE_MODEL_DELETE_FULFILLED: {
            const { model, id } = action.payload;
            const newModel = update(state[model], {
                changing: {$set: false},
                changed: {$set: true},
                ids: {$set: state[model].ids.filter(i => i !== id)}
            });
            delete newModel.objects[id];
            state = {...state, [model]: newModel};
            break;
        }

    }
    return state;
};

