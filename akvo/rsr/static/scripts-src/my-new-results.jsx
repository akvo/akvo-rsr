// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


const React = require('react');
const ReactDOM = require('react-dom');
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
        userIsAdmin();
    };
    apiCall('GET', endpointURL(id).user, '', success);
}


class Level extends React.Component {
    render() {
        const items = this.props.items;
        if (items !== undefined && items.length > 0) {
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

    renderPanel(comment, i) {
        return (
            <Panel header={comment.comment} key={i}>
                <div>By: {comment.user_details.first_name}</div>
            </Panel>
        )
    }
}


class Updates extends Level {
    renderPanel(update, i) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const data = update.data;
        const headerText = `Update: ${userName} at ${organisation}, data: ${data}`;
        return (
            <Panel header={headerText} key={i}>
                <div>{update.data}</div>
                <div>
                    <Comments items={update.comments}/>
                </div>
            </Panel>
        )
    }
}


class Periods extends Level {
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
        return (
            <Panel header={"Period: " + periodDate} key={i}>
                <Updates items={period.updates}/>
            </Panel>
        )
    }
}


class Indicators extends Level {
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
                <Periods items={indicator.periods}/>
            </Panel>
        )
    }
}


class Results extends Level {

    renderPanel(result, i) {
        return (
            <Panel header={"Result: " + result.title} key={i}>
                <Indicators items={result.indicators}/>
            </Panel>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        this._apiData = {};
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
                "results_of_project": `${host}/rest/v1/result/?format=json&project=${id}`,
                "indicators_of_project": `${host}/rest/v1/indicator/?format=json&result__project=${id}`,
                "periods_of_project": `${host}/rest/v1/indicator_period/?format=json&indicator__result__project=${id}`,
                "updates_and_comments_of_project": `${host}/rest/v1/indicator_period_data_framework/?format=json&period__indicator__result__project=${id}`,
                "period_framework": `${host}/rest/v1/indicator_period_framework/${id}/?format=json`,
                "update_and_comments": `${host}/rest/v1/indicator_period_data_framework/${id}/?format=json`,
                "updates_and_comments": `${host}/rest/v1/indicator_period_data_framework/?format=json`,
                "comments": `${host}/rest/v1/indicator_period_data_comment/?format=json`,
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
        const projectId = projectIds.project_id;
        this.loadResults(projectId);
    }

    loadResults(projectId) {
        // Load the results through the API
        let success = function(response) {
            // NOTE the coincidence that the "container field" in the API is named results :-p
            this._apiData.results = response.results;
            this.loadIndicators(projectId);
        }.bind(this);
        apiCall('GET', endpointURL(projectId).results_of_project, '', success);
    }

    loadIndicators(projectId) {
        // Load the indicators through the API
        let success = function(response) {
            this._apiData.indicators = response.results;
            this.loadPeriods(projectId);
        }.bind(this);
        apiCall('GET', endpointURL(projectId).indicators_of_project, '', success);
    }

    loadPeriods(projectId) {
        // Load the periods through the API
        let success = function(response) {
            this._apiData.periods = response.results;
            this.loadUpdatesAndComments(projectId);
        }.bind(this);
        apiCall('GET', endpointURL(projectId).periods_of_project, '', success);
    }

    loadUpdatesAndComments(projectId) {
        // Load the period data and comment
        let success = function(response) {
            this._apiData.updatesAndComments = response.results;
            this.setState({
                results: this.assembleData()
            });
        }.bind(this);
        apiCall('GET', endpointURL(projectId).updates_and_comments_of_project, '', success);
    }

    assembleData() {
        /*
        Construct a list of result objects based on the API call for Result, each of which holds a
        list of its associated indicators in the field "indicators", each of which hold a list of
        indicator periods in the field "periods" each of which holds a list of indicator period
        data objects in the field "updates".
        Note that the "lowest" level in the call chain, loadUpdatesAndComments(), retrieves both
        indicator period data ("updates") and comments nicely similarly to the rest of the data.
        All relations based on the relevant foreign keys linking the model objects.
        */
        // for each result
        return this._apiData.results.map(
            // add field "indicators"
            function(result) {
                result.indicators = this._apiData.indicators
                    // for each indicator
                    .map(
                        function(indicator) {
                            // add field "periods"
                            indicator.periods = this._apiData.periods
                                // for each period
                                .map(
                                    function(period) {
                                        // add field "updates"
                                        period.updates = this._apiData.updatesAndComments
                                            // populate period.updates filtered on period ID
                                            .filter(update => update.period === period.id);
                                        return period;
                                    }.bind(this))
                                // populate indicator.periods filtered on indicator ID
                                .filter(period => period.indicator === indicator.id);
                            return indicator;
                        }.bind(this))
                    // populate result.indicators filtered on result ID
                    .filter(indicator => indicator.result === result.id);
                return result;
            }.bind(this)
        );
    }

    render() {
        const results = this.state.results;
        if (results !== undefined && results.length > 0) {
            return (
                <Collapse>
                    <Results items={this.state.results}/>
                </Collapse>
            );
        } else {
            return (
                <p>Loading...</p>
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