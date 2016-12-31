// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


// const React = require('react');
// const ReactDOM = require('react-dom');
// const update = require('immutability-helper');
// const Collapse = require('rc-collapse');
// const Panel = Collapse.Panel;

import React from 'react';
import ReactDOM from 'react-dom';
import update  from 'immutability-helper';
import Collapse, {Panel} from 'rc-collapse';
import fetch from 'isomorphic-fetch';

let csrftoken,
    i18nResults,
    isPublic,
    endpointData,
    endpointURL,
    i18nMonths,
    projectIds,
    user;

// from http://stackoverflow.com/questions/7306669/
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
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
csrftoken = getCookie('csrftoken');


function APICall(method, url, data, callback, retries) {
    function modify(method, url, data){
        return fetch(url, {
            credentials: 'same-origin',
            method: method,
            headers: {'Content-Type': 'application/json', "X-CSRFToken": csrftoken},
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
                method: 'DELETE'
            });
            break;
    }
    handler()
        //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        .then((response) => response.json())
        .then(callback);
}

function getUserData(id) {
    // Get the user data from the API and stores it in the global user variable
    function success(response) {
        user = response;
    };
    APICall('GET', endpointURL(id).user, '', success);
}

function titleCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString) {
        const locale = "en-gb";
        const date = new Date(dateString.split(".")[0].replace("/", /-/g));
        const day = date.getUTCDate();
        const month = i18nMonths[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return i18nResults.unknown_date;
}

class Level extends React.Component {
    render() {
        const items = this.props.items;
        if (! this.props.models[this.state.model] || ! items) {
            console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
            return (
                <p>Loading...</p>
            );
        } else if (items.length > 0) {
            return (
                <Collapse>
                    {items.map((item, i) => this.renderPanel(item, i))}
                </Collapse>
            );
        } else {
            return (
                <p>No items</p>
            );
        }
    }
}


class Comments extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "comments"};
    }

    renderPanel(comment, i) {
        return (
            <Panel header={comment.comment} key={i}>
                <div>By: {comment.user_details.first_name}</div>
            </Panel>
        )
    }
}


class Updates extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "updates"};
    }

    componentWillMount() {
        this.props.callbacks.loadModel('comments');
    }

    renderPanel(update, i) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const data = update.data;
        const headerText = `Update: ${userName} at ${organisation}, data: ${data}`;
        return (
            <Panel header={headerText} key={i}>
                <div>

                    When: {displayDate(update.created_at)} |
                    By: {userName} |
                    Org: {update.user_details.approved_organisations[0].name} |
                    Status: {update.status} <br/>
                    Update value: {update.data} | {/*
                        NOTE: we use update.actual_value, a value calculated in App.annotate(), not
                        update.period_actual_value from the backend
                    */}
                    Actual total for this period (including this update): {update.actual_value}
                </div>
                <div>
                    <Comments
                        items={update.comments}
                        models={this.props.models}
                        callbacks={this.props.callbacks}/>
                </div>
            </Panel>
        )
    }
}


class PeriodLockToggle extends React.Component {
    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.state = {locking: false};
    }

    basePeriodSave(periodId, data, callback) {
        // Base function for saving a period with a data Object.
        const url = endpointURL(periodId).period_framework;
        function success(data) {
            this.props.callbacks.updateModel("periods", data);

            // Call the callback, if not undefined.
            if (callback) {
                callback();
            }
        }
        APICall('PATCH', url, data, success.bind(this));
    }

    lockingToggle(locking) {
        this.setState({locking: locking});
    }

    notLocking() {
        this.lockingToggle(false);
    }

    lockToggle(e) {
        if (!this.state.locking) {
            this.lockingToggle(true);
            this.basePeriodSave(this.props.period.id, {locked: !this.props.period.locked}, this.notLocking.bind(this));
        }
        e.stopPropagation();
    }

    render() {
        let icon, label;
        if (this.state.locking) {
            icon = <i className="fa fa-spin fa-spinner" />;
            label = "Loading";
        } else if (this.props.period.locked) {
            icon = <i className={'fa fa-lock'}/>;
            label = "Unlock period";
        } else {
            icon = <i className="fa fa-unlock-alt" />;
            label = "Lock period";
        }
        return (
            <a onClick={this.lockToggle}
               className={'btn btn-sm btn-default'}
               style={{float: 'right', margin: '0.3em 0.5em'}}>
                {icon}
                {label}
            </a>
        )
    }
}


class Periods extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "periods"};
    }

    renderPanel(period, i) {
        const periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
        const header = (
            <span>
                <span>
                    Period: {periodDate} |
                    Target value: {period.target_value} |
                    Actual value: {period.actual_value}
                </span>
                <PeriodLockToggle period={period} callbacks={this.props.callbacks}/>
            </span>
        );
        return (
            <Panel header={header} key={i}>
                <Updates items={period.updates}
                         models={this.props.models}
                         callbacks={this.props.callbacks}/>
            </Panel>
        )
    }
    componentWillMount() {
        this.props.callbacks.loadModel('updates');
    }
}


class Indicators extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "indicators"};
    }

    renderPanel(indicator, i) {
        const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
        return (
            <Panel header={"Indicator: " + title} key={i}>
                {title}
                <div className="baseline">
                    <div className="baseline-year">
                        {i18nResults.baseline_year}
                        <span>{indicator.baseline_year}</span>
                    </div>
                    <div className="baseline-value">
                        {i18nResults.baseline_value}
                        <span>{indicator.baseline_value}</span>
                    </div>
                </div>
                <Periods items={indicator.periods}
                         models={this.props.models}
                         callbacks={this.props.callbacks}/>
            </Panel>
        )
    }

    componentWillMount() {
        this.props.callbacks.loadModel('periods');
    }
}


class Results extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "results"};
    }

    renderPanel(result, i) {
        return (
            <Panel header={"Result: " + result.title} key={i}>
                <Indicators
                    items={result.indicators}
                    models={this.props.models}
                    callbacks={this.props.callbacks}/>
            </Panel>
        )
    }
}


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
        // set up callback URL templates
        endpointData = JSON.parse(document.getElementById('endpoint-data').innerHTML);
        endpointURL = function (id) {
            // Function that returns an object with callback URLs, including optional ID
            // Usage: endpointURL(17).result -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
            const host = "http://" + endpointData.host;
            return {
                "result": `${host}/rest/v1/result/${id}/?format=json`,
                "results": `${host}/rest/v1/result/?format=json&project=${id}`,
                "indicators": `${host}/rest/v1/indicator/?format=json&result__project=${id}`,
                "periods": `${host}/rest/v1/indicator_period/?format=json&indicator__result__project=${id}`,
                "updates": `${host}/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=${id}`,
                "comments": `${host}/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=${id}`,
                "period_framework": `${host}/rest/v1/indicator_period_framework/${id}/?format=json`,
                "update_and_comments": `${host}/rest/v1/indicator_period_data_framework/${id}/?format=json`,
                "updates_and_comments": `${host}/rest/v1/indicator_period_data_framework/?format=json`,
                "user": `${host}/rest/v1/user/${id}/?format=json`,
                "partnerships": `${host}/rest/v1/partnership/?format=json&project=${id}`,
                "file_upload": `${host}/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
            };
        };

        if (!isPublic) {
            getUserData(endpointData.userId);
        }

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
            APICall('GET', endpointURL(this.state.projectId)[model], '', success);
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
                    if (period.updates !== undefined) {
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
            if (obj !== undefined) {
                return Object.values(obj);
            }
            return undefined;
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
        if (this.state.models.results === undefined) {
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

    // Check if React is loaded
    // if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof smoothScroll !== 'undefined') {
    //     smoothScroll.init({updateURL: false});
    //     initReact();
    // } else {
    //     loadAndRenderReact();
    // }
});