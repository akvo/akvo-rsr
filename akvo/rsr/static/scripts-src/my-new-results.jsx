// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


const Collapse = require('../../../../scripts/devhelpers/node_modules/rc-collapse');
const Panel = Collapse.Panel;
const React = require('../../../../scripts/devhelpers/node_modules/react');
const ReactDOM = require('../../../../scripts/devhelpers/node_modules/react-dom');

let csrftoken,
    endpoints,
    i18nResults,
    isPublic,
    months,
    projectIds,
    user;

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


class IndicatorPeriods extends React.Component {

    render() {
        function getDateDescription(month) {
            switch (month) {
                case 0:
                    return months.january;
                case 1:
                    return months.february;
                case 2:
                    return months.march;
                case 3:
                    return months.april;
                case 4:
                    return months.may;
                case 5:
                    return months.june;
                case 6:
                    return months.july;
                case 7:
                    return months.august;
                case 8:
                    return months.september;
                case 9:
                    return months.october;
                case 10:
                    return months.november;
                case 11:
                    return months.december;
            }
        }

        function displayDate(dateString) {
            // Display a dateString like "25 Jan 2016"
            if (dateString !== undefined && dateString !== null) {
                var locale = "en-gb";
                var date = new Date(dateString.split(".")[0].replace("/", /-/g));
                var day = date.getUTCDate();
                var month = getDateDescription(date.getUTCMonth());
                //var month = date.toLocaleString(locale, { month: "short" });
                var year = date.getUTCFullYear();
                return day + " " + month + " " + year;
            }
            return i18nResults.unknown_date;
        }

        function renderPanel(period, i) {
            var periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
            return (
                <Panel header={"Period: " + periodDate} key={i}>
                    <div className="period-td">
                        {periodDate}
                    </div>
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
                    <IndicatorPeriods periods={indicator.periods}/>
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
        // Load the results through the API, and update the state
        var success = function(response) {
            // NOTE the coincidence that the "container field" in the API is named results :-p
            this._apiData.results = response.results;
            // this.setState({
            //     'results': response.results
            // });
            this.loadIndicators(projectId);
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.results_of_project.replace('{project}',
                projectId), '', success);
    }

    loadIndicators(projectId) {
        // Load the indicators through the API, and update the state
        var success = function(response) {
            this._apiData.indicators = response.results;
            // this.setState({
            //     indicators: response.results
            // });
            this.loadPeriods(projectId);
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.indicators_of_project.replace('{project}',
                projectId), '', success);
    }

    loadPeriods(projectId) {
        // Load the periods through the API, and update the state
        var thisApp = this;
        var success = function(response) {
            this._apiData.periods = response.results;
            this.setState({
                results: this.assembleData()
            });
        }.bind(this);
        apiCall('GET', endpoints.base_url + endpoints.periods_of_project.replace('{project}',
                projectId), '', success);
    }

    assembleData() {
        /*
        Construct a list of result objects based on the API call for Result, each of which holds a
        list of its associated indicators in the field "indicators", each of which hold a list of
        indicator periods in the field "periods".
        All relations based on the relevant foreign keys linking the model objects.
        TODO: this can be extended "downwards" with period updates and comments
        */
        // for each result
        return this._apiData.results.map(
            // add field "results"
            function(result) {
                result.indicators = this._apiData.indicators
                    // for each indicator
                    .map(
                        function(indicator) {
                            // filter periods based on indicator ID
                            indicator.periods = this._apiData.periods
                                .filter(period => period.indicator === indicator.id);
                            return indicator;
                        }.bind(this))
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
    months = JSON.parse(document.getElementById('months').innerHTML);
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