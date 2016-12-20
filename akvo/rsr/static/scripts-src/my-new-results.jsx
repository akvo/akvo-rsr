// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


const React = require('react');
const ReactDOM = require('react-dom');
const Collapse = require('rc-collapse');
const Panel = Collapse.Panel;

let csrftoken,
    endpoints,
    i18nResults,
    isPublic,
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

function getUserData() {
    // Get the user data from the API and stores it in the global user variable
    var success = function(response) {
        user = response;
        userIsAdmin();
    };
    apiCall('GET', endpoints.base_url + endpoints.user, '', success);
}

class Updates extends React.Component {

    render() {
        function renderPanel(update, i) {
            const organisation = update.user_details.approved_organisations[0].name;
            const userName = update.user_details.first_name +" "+ update.user_details.last_name;
            const data = update.data;
            const headerText = `Update: ${userName} at ${organisation}, data: ${data}`;
            return (
                <Panel header={headerText} key={i}>
                    <div>
                        {update.data}
                    </div>
                </Panel>
            )
        }
        const updates = this.props.updates;
        if (updates !== undefined && updates.length > 0) {
            return (
                <Collapse>
                    {updates.map((update, i) => renderPanel(update, i))}
                </Collapse>
            );
        } else {
            return (
                <p>No updates</p>
            );
        }
    }
}

class Periods extends React.Component {

    render() {
        function displayDate(dateString) {
            // Display a dateString like "25 Jan 2016"
            if (dateString !== undefined && dateString !== null) {
                var locale = "en-gb";
                var date = new Date(dateString.split(".")[0].replace("/", /-/g));
                var day = date.getUTCDate();
                var month = i18nMonths[date.getUTCMonth()];
                var year = date.getUTCFullYear();
                return day + " " + month + " " + year;
            }
            return i18nResults.unknown_date;
        }

        function renderPanel(period, i) {
            var periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
            return (
                <Panel header={"Period: " + periodDate} key={i}>
                    <Updates updates={period.updates}/>
                </Panel>
            )
        }
        const periods = this.props.periods;
        if (periods !== undefined && periods.length > 0) {
            return (
                <Collapse>
                    {periods.map((period, i) => renderPanel(period, i))}
                </Collapse>
            );
        } else {
            return (
                <p>No periods</p>
            );
        }
    }
}

class Indicators extends React.Component {
    render() {
        let periods = function (indicator) {
            return this.props.periods.filter(period => period.indicator === indicator.id);
        }.bind(this);

        function renderPanel(indicator, i) {
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
                    <Periods periods={indicator.periods}/>
                </Panel>
            )
        }
        const indicators = this.props.indicators;
        if (indicators !== undefined && indicators.length > 0) {
            return (
                <Collapse>
                    {indicators.map((indicator, i) => renderPanel(indicator, i))}
                </Collapse>
            );
        } else {
            return (
                <p>No indicators</p>
            );
        }
    }
}


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
        this._apiData = {};
    }

    componentDidMount() {
        // Once the component is mounted, load the results through the API
        const project_id = projectIds.project_id;
        //TODO: this "chained" way of loading the API data kinda terrible and should be replaced
        this.loadResults(project_id);
    }

    loadResults(projectId) {
        // Load the results through the API
        const success = function(response) {
            // NOTE the coincidence that the "container field" in the API is named results :-p
            this._apiData.results = response.results;
            this.loadIndicators(projectId);
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.results_of_project.replace('{project}',
                projectId), '', success);
    }

    loadIndicators(projectId) {
        // Load the indicators through the API
        const success = function(response) {
            this._apiData.indicators = response.results;
            this.loadPeriods(projectId);
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.indicators_of_project.replace('{project}',
                projectId), '', success);
    }

    loadPeriods(projectId) {
        // Load the periods through the API
        const success = function(response) {
            this._apiData.periods = response.results;
            this.loadUpdatesAndComments(projectId);
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.periods_of_project.replace('{project}',
                projectId), '', success);
    }

    loadUpdatesAndComments(projectId) {
        // Load the period data and comment
        const success = function(response) {
            this._apiData.updatesAndComments = response.results;
            this.setState({
                results: this.assembleData()
            });
        }.bind(this);
        apiCall(
            'GET', endpoints.base_url + endpoints.updates_and_comments_of_project.replace(
                '{project}', projectId
            ), '', success
        );
    }



    assembleData() {
        /*
        Construct a list of result objects based on the API call for Result, each of which holds a
        list of its associated indicators in the field "indicators", each of which hold a list of
        indicator periods in the field "periods" each of which holds a list of indicator period
        data objects in the field updates.
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
        if (results.length > 0) {
            return (
                <Collapse>
                    {results.map((result, i) =>
                        <Panel header={"Result: " + result.title} key={i}>
                            <Indicators indicators={result.indicators}/>
                        </Panel>)}
                </Collapse>
            );
        } else {
            return (
                <span>Loading...</span>
            );
        }
    }
}


ReactDOM.render(<Results/>, document.getElementById('new-results-framework'));

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and project IDs
    isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18nResults = JSON.parse(document.getElementById('translation-texts').innerHTML);
    i18nMonths = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    if (!isPublic) {
        getUserData();
    }

    // Check if React is loaded
    // if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof smoothScroll !== 'undefined') {
    //     smoothScroll.init({updateURL: false});
    //     initReact();
    // } else {
    //     loadAndRenderReact();
    // }
});