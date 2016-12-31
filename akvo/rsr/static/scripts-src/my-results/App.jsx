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

let i18nResults,
    isPublic,
    endpointData,
    i18nMonths,
    projectIds;

// from http://stackoverflow.com/questions/7306669/
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));


class App extends React.Component {
    constructor(props) {
        super(props);
        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        this.state = {
            models: {
                results: undefined,
                indicators: undefined,
                periods: undefined,
                updates: undefined,
                comments: undefined
            },
            resultsDataTree: [],
            projectId: projectIds.project_id
        };
    }

    componentDidMount() {
        // Once the component is mounted, load the results through the API
        //TODO: this "chained" way of loading the API data kinda terrible and should be replaced
        this.loadModel('results');
        this.loadModel('indicators');
    }

    loadModel(model) {
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
                    }
                )
            }.bind(this);
            APICall('GET', endpoints[model](this.state.projectId), '', success);
        }
    }

    updateModel(model, data) {
        /*
        Update a model instance. Uses the indexed model objects and the immutability-helper update
         function (https://facebook.github.io/react/docs/update.html)
         */
        const id = data.id;
        const newState = update(
            this.state.models,
            {[model]: {$merge: {[id]: data}}}
        );
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

        function annotatePeriods(periods) {
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
            return obj && Object.values(obj);
        }

        const models = this.state.models;
        const updates = filterChildren(
            deIndex(models.updates),
            {parent: "data", children: "comments"},
            deIndex(models.comments)
        );

        const periods = filterChildren(
            deIndex(models.periods),
            {parent: "period", children: "updates"},
            updates);
        const annotated_periods = annotatePeriods(periods);

        const indicators = filterChildren(
            deIndex(models.indicators),
            {parent: "indicator", children: "periods"},
            annotated_periods
        );

        const results = filterChildren(
            deIndex(models.results),
            {parent: "result", children: "indicators"},
            indicators
        );
        return results;
    }

    render() {
        const tree = this.state.resultsDataTree;
        const callbacks = {
            loadModel: this.loadModel.bind(this),
            updateModel: this.updateModel.bind(this)
        };
        if (! this.state.models.results) {
            return (
                <p>Loading...</p>
            );
        } else if (tree.length > 0) {
            return (
                <Results items={tree} callbacks={callbacks} models={this.state.models}/>
            );
        } else {
            return (
                <p>No items</p>
            );
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and project IDs
    isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
    i18nResults = JSON.parse(document.getElementById('translation-texts').innerHTML);
    i18nMonths = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    ReactDOM.render(<App/>, document.getElementById('new-results-framework'));
});