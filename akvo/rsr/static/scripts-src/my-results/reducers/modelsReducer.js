/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import { normalize, schema } from 'normalizr';
import update  from 'immutability-helper';
import * as c from "../const";
// import { c.CHILD_OBJECTS, c.MODELS_LIST, c.MODEL_INDEX, c.OBJECTS_RESULTS} from "../const";
// import { c.ALL_MODELS_FETCHED } from "./uiReducer";
import { findChildren, parentModelName, findChildrenFromCurrentState} from "../utils";

// export const
//     FETCH_MODEL_START = "FETCH_MODEL_START",
//     FETCH_MODEL_FULFILLED = "FETCH_MODEL_FULFILLED",
//     FETCH_MODEL_REJECTED = "FETCH_MODEL_REJECTED",
//
//     UPDATE_MODEL_START = "UPDATE_MODEL_START",
//     UPDATE_MODEL_FULFILLED = "UPDATE_MODEL_FULFILLED",
//     UPDATE_MODEL_REJECTED = "UPDATE_MODEL_REJECTED",
//
//     DELETE_FROM_MODEL = "DELETE_FROM_MODEL",
//     UPDATE_MODEL_DELETE_FULFILLED = "UPDATE_MODEL_DELETE_FULFILLED";

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
    results: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined},
    indicators: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined},
    periods: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined},
    updates: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined},
    comments: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined},
    user: {fetched: false, changing: false, changed: false, objects: undefined, ids: undefined}
};

const assignChildren = (state, model) => {
     // For model and it's children...
    return c.MODELS_LIST.slice(c.MODEL_INDEX[model]).reduce(
        (acc, model) => {
            return {...acc,
                // ...update all objects in models[model].objects...
                [model]: {...state[model],
                    objects: state[model].ids.reduce(
                        (acc, id) => {
                            // ...with the result from findChildren, added as _meta.children
                            const children = findChildrenFromCurrentState(
                                state, id, c.CHILD_OBJECTS[model]
                            );
                            return {...acc,
                                [id]: {...state[model].objects[id],
                                    _meta: {children: children}
                                }
                            };
                        }, {...state[model].objects}
                    )
                }
            }
        }, {...state}
    );
};

export default function modelsReducer(state=initialModels, action) {
    switch(action.type) {

        // FETCH_ actions fetch data from the backend and do the initial population of the data
        case c.FETCH_MODEL_START: {
            const model = action.payload.model;
            return {
                ...state,
                [model]: {fetched: false, changing: true, changed: false, objects: undefined, ids: undefined}
            };
        }

        case c.FETCH_MODEL_FULFILLED: {
            const model = action.payload.model;
            const normalized = normalizedObjects(action.payload.data);
            return {...state, [model]: {
                fetched: true,
                changing: false,
                changed: true,
                objects: normalized.entities.items || {},
                ids: normalized.result
            }};
        }

        case c.FETCH_MODEL_REJECTED: {
            const model = action.payload.model;
            return {...state, [model]: {
                fetched: false,
                changing: false,
                changed: false,
                objects: {},
                ids: [],
                error: action.payload.error
            }};
        }

        // UPDATE_ actions both modify existing and add new objects to the models, while keeping the
        // ids array in sync. Also note that some of those actions are acted on in collapseReducer
        case c.UPDATE_MODEL_START: {
            const model = action.payload.model;
            const modelState = state[model];
            const updatedState = update(modelState, {changing: {$set: true}, changed: {$set: true}});
            return {...state, [model]: updatedState};
        }

        case c.UPDATE_MODEL_FULFILLED: {
            const { model, object } = action.payload;
            const merged = update(state[model], {
                changing: {$set: false},
                changed: {$set: true},
                objects: {$merge: {[object.id]: object}},
                ids: {$push: [object.id]}
            });
            // remove duplicate ids
            merged.ids = [...new Set(merged.ids)];
            return {...state, [model]: merged};
        }

        case c.UPDATE_MODEL_REJECTED: {
            const model = action.payload.model;
            const errorState = update(state[model], {
                changing: {$set: false},
                changed: {$set: false},
                error: {$set: action.payload.error}
            });
            return {...state, [model]: errorState};
            // return {...state, [model]: {changing: false, changed: false, data: null, error: action.payload.error}};
        }

        case c.DELETE_FROM_MODEL: {
            const { model, object } = action.payload;
            const newModel = Object.assign({}, state[model]);
            delete newModel.objects[object.id];
            newModel.ids = newModel.ids.filter(id => id !== object.id);
            const deletedState = {...state, [model]: newModel};
            return assignChildren(deletedState, parentModelName(model));
        }

        case c.UPDATE_MODEL_DELETE_FULFILLED: {
            const { model, id } = action.payload;
            const newModel = update(state[model], {
                changing: {$set: false},
                changed: {$set: true},
                ids: {$set: state[model].ids.filter(i => i !== id)}
            });
            delete newModel.objects[id];
            const deletedState = {...state, [model]: newModel};
            return assignChildren(deletedState, parentModelName(model));
        }

        // "Link" all models to their children by adding the result of findChildren to
        // _meta.children of each object
        case c.ALL_MODELS_FETCHED: {
            // For each model...
            return assignChildren(state, c.OBJECTS_RESULTS);
            // return c.MODELS_LIST.reduce(
            //     (acc, model) => {
            //         return {...acc,
            //             // ...update all objects in models[model].objects...
            //             [model]: {...state[model],
            //                 objects: state[model].ids.reduce(
            //                     (acc, id) => {
            //                         // ...with the result from findChildren, added as _meta.children
            //                         const children = findChildren(id, c.CHILD_OBJECTS[model]);
            //                         return {...acc,
            //                             [id]: {...state[model].objects[id],
            //                                 _meta: {children: children[c.CHILD_OBJECTS[model]]}
            //                             }
            //                         };
            //                     }, {...state[model].objects}
            //                 )
            //             }
            //         }
            //     }, {...state}
            // );
        }
    }
    return state;
};

