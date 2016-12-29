// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


const React = require('react');
const ReactDOM = require('react-dom');
const update = require('immutability-helper');
const Collapse = require('rc-collapse');
const Panel = Collapse.Panel;

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

function deIndex(obj) {
    if (obj !== undefined) {
        return Object.values(obj);
    }
    return undefined;
}

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

// TODO: replace this with a proper library for backend calls
function apiCall(method, url, data, successCallback, retries) {
    var xmlHttp = new XMLHttpRequest();
    var maxRetries = 5;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            var response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
            if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                if (method === 'GET' && response.next !== undefined) {
                    if (response.next !== null) {
                        var success = function(newResponse) {
                            var oldResults = response.results;
                            response.results = oldResults.concat(newResponse.results);
                            return successCallback(response);
                        };
                        apiCall(method, response.next, data, success);
                    } else {
                        return successCallback(response);
                    }
                } else {
                    return successCallback(response);
                }
            } else {
                var message = i18nResults.general_error + ': ';
                for (var key in response) {
                    if (response.hasOwnProperty(key)) {
                         message += response[key] + '. ';
                    }
                }
                showGeneralError(message);
                return false;
            }
        }
    };

    xmlHttp.onerror = function () {
        if (retries === undefined) {
            return apiCall(method, url, data, successCallback, 2);
        } else if (retries <= maxRetries) {
            return apiCall(method, url, data, successCallback, retries + 1);
        } else {
            showGeneralError(i18nResults.connection_error);
            return false;
        }
    };

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(data);
}

function getUserData(id) {
    // Get the user data from the API and stores it in the global user variable
    var success = function(response) {
        user = response;
        // userIsAdmin();
    };
    apiCall('GET', endpointURL(id).user, '', success);
}

function titleCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

class Level extends React.Component {
    render() {
        const items = this.props.items;
        if (this.props.models[this.state.model] === undefined || items === undefined) {
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
                <div>{update.data}</div>
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
        const success = function(response) {
            this.props.callbacks.updateModel("periods", response);

            // Call the callback, if not undefined.
            if (callback !== undefined) {
                callback();
            }
        }.bind(this);
        apiCall('PATCH', url, JSON.stringify(data), success);
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
        function displayDate(dateString) {
            // Display a dateString like "25 Jan 2016"
            if (dateString !== undefined && dateString !== null) {
                const locale = "en-gb";
                const date = new Date(dateString.split(".")[0].replace("/", /-/g));
                const day = date.getUTCDate();
                const month = i18nMonths[date.getUTCMonth()];
                const year = date.getUTCFullYear();
                return day + " " + month + " " + year;
            }
            return i18nResults.unknown_date;
        }

        const periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
        const header = (
            <span>
                <span>Period: {periodDate}</span>
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
        }

        if (!isPublic) {
            getUserData(endpointData.userId);
        }

        // Once the component is mounted, load the results through the API
        //TODO: this "chained" way of loading the API data kinda terrible and should be replaced
        this.loadModel('results');
        this.loadModel('indicators');
    }

    loadModel(model) {
        // Load a model from the API
        if (this.state.models[model] === undefined) {
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
            apiCall('GET', endpointURL(this.state.projectId)[model], '', success);
        }
    }

    updateModel(model, data) {
        const id = data.id;
        this.setState(
            {models: update(
                this.state.models,
                {$merge: {[model]: {[id]: data}}}
            )},
            function() {
                this.setState({resultsDataTree: this.assembleDataTree()});
            }
        )
    }

    indexModel(data) {
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
        indicator periods in the field "periods" each of which holds a list of indicator period
        data objects in the field "updates".
        Note that the "lowest" level in the call chain, loadUpdatesAndComments(), retrieves both
        indicator period data ("updates") and comments nicely similarly to the rest of the data.
        All relations based on the relevant foreign keys linking the model objects.
        */
        function filterChildren(parents, field_names, children) {
            if (parents !== undefined) {
                return parents.map(
                    function (parent) {
                        if (children !== undefined) {
                            parent[field_names.children] = children.filter(
                                child => child[field_names.parent] === parent.id
                            );
                        }
                        return parent;
                    }
                );
            } else {
                return undefined;
            }
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
        const indicators = filterChildren(
            deIndex(models.indicators),
            {parent: "indicator", children: "periods"},
            periods
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