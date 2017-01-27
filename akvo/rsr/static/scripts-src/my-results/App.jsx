/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import update  from 'immutability-helper';
import {Panel} from 'rc-collapse';

import Results from './Results.jsx';

import {APICall, endpoints} from './utils.js';
import {
    OBJECTS_RESULTS, OBJECTS_INDICATORS, OBJECTS_PERIODS, OBJECTS_UPDATES, OBJECTS_COMMENTS
} from './const.js';

// from http://stackoverflow.com/questions/7306669/
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));


class App extends React.Component {
    constructor(props) {
        super(props);
        const isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
        const strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
        const userID = JSON.parse(document.getElementById('endpoint-data').innerHTML).userID;
        const projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        this.state = {
            models: {
                results: undefined,
                indicators: undefined,
                periods: undefined,
                updates: undefined,
                comments: undefined,
                user: undefined
            },
            resultsDataTree: [],
            project: {id: projectIds.project_id}
        };
        const success = function(data) {
            // maintain compatibility with existing updates JSON
            data.approved_organisations = [data.organisation];
            this.setState({models: update(this.state.models, {$merge: {user: data}})});
        };
        // Get info on the current user. Used when posting data, e.g. updates
        // TODO: This might not be the best place to load user data
        APICall('GET', endpoints.user(userID), '', success.bind(this));
    }

    componentDidMount() {
        // Chain loading of all models
        // TODO: error handling
        this.loadModel(
            OBJECTS_RESULTS,
            this.loadModel.bind(
                this,
                OBJECTS_INDICATORS,
                this.loadModel.bind(
                    this,
                    OBJECTS_PERIODS,
                    this.loadModel.bind(
                        this,
                        OBJECTS_UPDATES,
                        this.loadModel.bind(
                            this,
                            OBJECTS_COMMENTS
                        )
                    )
                )
            )
        )
    }

    loadModel(model, callback) {
        // Load a model from the API. After loading rebuild the data tree.
        if (! this.state.models[model]) {
            let success = function(response) {
                this.setState(
                    {models: update(
                        this.state.models,
                        {$merge: {[model]: this.indexModel(response.results)}}
                    )},
                    function() {
                        this.setState({resultsDataTree: this.assembleDataTree()});
                        if (callback) {
                            callback();
                        }
                    }
                )
            }.bind(this);
            APICall('GET', endpoints[model](this.state.project.id), '', success);
        }
    }

    updateModel(model, data) {
        /*
        Update a model instance. Uses the indexed model objects and the immutability-helper update
         function (https://facebook.github.io/react/docs/update.html)
         */
        let newState;
        const id = data.id;
        newState = update(this.state.models, {[model]: {$merge: {[id]: data}}});
        this.setState(
            {models: newState},
            function() {
                this.setState({resultsDataTree: this.assembleDataTree()});
            }
        );
    }

    deleteFromModel(model, id) {
        /*
        Update a model instance. Uses the indexed model objects and the immutability-helper update
         function (https://facebook.github.io/react/docs/update.html)
         */
        let newState;
        // Since we shouldn't edit the state object directly we have to make a (shallow) copy
        // and delete from the copy. TODO: think hard if this can lead to trouble...
        const newModel = Object.assign({}, this.state.models[model]);
        delete newModel[id];
        newState = update(this.state.models, {[model]: {$set: newModel}});
        this.setState(
            {models: newState},
            function() {
                this.setState({resultsDataTree: this.assembleDataTree()});
            }
        );
    }

    indexModel(data) {
        /*
        Create an indexed version of a model by creating a list of objects, one for each model
        instance where the object key is the id of the instance and the value is the full instance.
        This construct is used to be able to easily update individual instances.
         */
        return data.reduce(
            function(acc, obj) {
                const id = obj['id'];
                let indexedObj = {};
                indexedObj[id] = obj;
                return Object.assign(acc, indexedObj)
            },
            {}
        )
    }

    currentUser() {
        //TODO: if loading of user data fails we have a problem...
        return this.state.models.user;
    }

    assembleDataTree() {
        /*
        Construct a list of result objects based on the API call for Result, each of which holds a
        list of its associated indicators in the field "indicators", each of which hold a list of
        indicator periods in the field "periods" and on down via "updates" and "comments".
        This data structure is used to populate the whole tree of components each level passing the
        child list as the prop "items"
        */

        function filterChildren(parents, fieldNames, children) {
            /*
            Helper function that links two levels in the data tree. The linking is based on the
            foreign key field to the parent of the child being the same as the current parent object
            Params:
                parents: list of parent objects. Each parent object is assigned a new field that
                         holds the list of associated children
                fieldNames: object with two fields, "parent" and "children" that hold the name of
                the fields linking the two levels of objects.
                children: list of all child objects.
             */
            return parents && parents.map(
                function (parent) {
                    if (children) {
                        parent[fieldNames.children] = children.filter(
                            child => child[fieldNames.parent] === parent.id
                        );
                    }
                    return parent;
                }
            );
        }

        function annotateUpdates(periods) {
            /*
            Add the field "actual_value" to each period update, which is the sum of all update
            values up to this point in time. Note that this field exists in the dataset as
            update.period_actual_value but we can't use that since we want to be able to
            (re)-calculate on data changes.
             */
            return periods && periods.map(
                function(period) {
                    if (period.updates) {
                        let actual_value = 0;
                        period.updates = period.updates.map(
                            function(update) {
                                update['actual_value'] = parseInt(update.data) + actual_value;
                                actual_value = update.actual_value;
                                return update;
                            }
                        )
                    }
                    return period;
                }
            )
        }

        function deIndex(obj) {
            // Turn the indexed model back to a list of model object
            return obj && Object.values(obj);
        }

        // Build the tree of models from the lowest level (Comment) and up to Result
        const models = this.state.models;
        const updates = filterChildren(
            deIndex(models.updates),
            {parent: "data", children: OBJECTS_COMMENTS},
            deIndex(models.comments)
        );

        const periods = filterChildren(
            deIndex(models.periods),
            {parent: "period", children: OBJECTS_UPDATES},
            updates);
        const annotated_periods = annotateUpdates(periods);

        const indicators = filterChildren(
            deIndex(models.indicators),
            {parent: "indicator", children: OBJECTS_PERIODS},
            annotated_periods
        );

        const results = filterChildren(
            deIndex(models.results),
            {parent: "result", children: OBJECTS_INDICATORS},
            indicators
        );
        return results;
    }

    render() {
        const tree = this.state.resultsDataTree;
        const callbacks = {
            loadModel: this.loadModel.bind(this),
            updateModel: this.updateModel.bind(this),
            deleteFromModel: this.deleteFromModel.bind(this),
            currentUser: this.currentUser.bind(this)
        };
        if (! this.state.models.results) {
            return (
                <p>Loading...</p>
            );
        } else if (tree.length > 0) {
            return (
                <Results
                    items={tree}
                    callbacks={callbacks}/>
            );
        } else {
            return (
                <p>No items</p>
            );
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<App/>, document.getElementById('new-results-framework'));
});