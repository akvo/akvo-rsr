(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


var React = require('react');
var ReactDOM = require('react-dom');
var Collapse = require('rc-collapse');
var Panel = Collapse.Panel;

var csrftoken = void 0,
    i18nResults = void 0,
    isPublic = void 0,
    endpointData = void 0,
    endpointURL = void 0,
    i18nMonths = void 0,
    projectIds = void 0,
    user = void 0;

// TODO: replace this with a proper library for backend calls
function apiCall(method, url, data, successCallback, retries) {
    var xmlHttp = new XMLHttpRequest();
    var maxRetries = 5;

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            var response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
            if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                if (method === 'GET' && response.next !== undefined) {
                    if (response.next !== null) {
                        var success = function success(newResponse) {
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
    var success = function success(response) {
        user = response;
        userIsAdmin();
    };
    apiCall('GET', endpointURL(id).user, '', success);
}

var Level = function (_React$Component) {
    _inherits(Level, _React$Component);

    function Level() {
        _classCallCheck(this, Level);

        return _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).apply(this, arguments));
    }

    _createClass(Level, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var items = this.props.items;
            if (items !== undefined && items.length > 0) {
                return React.createElement(
                    Collapse,
                    null,
                    items.map(function (item, i) {
                        return _this2.renderPanel(item, i);
                    })
                );
            } else {
                return React.createElement(
                    'p',
                    null,
                    'No items'
                );
            }
        }
    }]);

    return Level;
}(React.Component);

var Comments = function (_Level) {
    _inherits(Comments, _Level);

    function Comments() {
        _classCallCheck(this, Comments);

        return _possibleConstructorReturn(this, (Comments.__proto__ || Object.getPrototypeOf(Comments)).apply(this, arguments));
    }

    _createClass(Comments, [{
        key: 'renderPanel',
        value: function renderPanel(comment, i) {
            return React.createElement(
                Panel,
                { header: comment.comment, key: i },
                React.createElement(
                    'div',
                    null,
                    'By: ',
                    comment.user_details.first_name
                )
            );
        }
    }]);

    return Comments;
}(Level);

var Updates = function (_Level2) {
    _inherits(Updates, _Level2);

    function Updates() {
        _classCallCheck(this, Updates);

        return _possibleConstructorReturn(this, (Updates.__proto__ || Object.getPrototypeOf(Updates)).apply(this, arguments));
    }

    _createClass(Updates, [{
        key: 'renderPanel',
        value: function renderPanel(update, i) {
            var organisation = update.user_details.approved_organisations[0].name;
            var userName = update.user_details.first_name + " " + update.user_details.last_name;
            var data = update.data;
            var headerText = 'Update: ' + userName + ' at ' + organisation + ', data: ' + data;
            return React.createElement(
                Panel,
                { header: headerText, key: i },
                React.createElement(
                    'div',
                    null,
                    update.data
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(Comments, { items: update.comments })
                )
            );
        }
    }]);

    return Updates;
}(Level);

var Periods = function (_Level3) {
    _inherits(Periods, _Level3);

    function Periods() {
        _classCallCheck(this, Periods);

        return _possibleConstructorReturn(this, (Periods.__proto__ || Object.getPrototypeOf(Periods)).apply(this, arguments));
    }

    _createClass(Periods, [{
        key: 'renderPanel',
        value: function renderPanel(period, i) {
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

            var periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
            return React.createElement(
                Panel,
                { header: "Period: " + periodDate, key: i },
                React.createElement(Updates, { items: period.updates })
            );
        }
    }]);

    return Periods;
}(Level);

var Indicators = function (_Level4) {
    _inherits(Indicators, _Level4);

    function Indicators() {
        _classCallCheck(this, Indicators);

        return _possibleConstructorReturn(this, (Indicators.__proto__ || Object.getPrototypeOf(Indicators)).apply(this, arguments));
    }

    _createClass(Indicators, [{
        key: 'renderPanel',
        value: function renderPanel(indicator, i) {
            var title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
            return React.createElement(
                Panel,
                { header: "Indicator: " + title, key: i },
                title,
                React.createElement(
                    'div',
                    { className: 'baseline' },
                    React.createElement(
                        'div',
                        { className: 'baseline-year' },
                        i18nResults.baseline_year,
                        React.createElement(
                            'span',
                            null,
                            indicator.baseline_year
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'baseline-value' },
                        i18nResults.baseline_value,
                        React.createElement(
                            'span',
                            null,
                            indicator.baseline_value
                        )
                    )
                ),
                React.createElement(Periods, { items: indicator.periods })
            );
        }
    }]);

    return Indicators;
}(Level);

var Results = function (_Level5) {
    _inherits(Results, _Level5);

    function Results() {
        _classCallCheck(this, Results);

        return _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).apply(this, arguments));
    }

    _createClass(Results, [{
        key: 'renderPanel',
        value: function renderPanel(result, i) {
            return React.createElement(
                Panel,
                { header: "Result: " + result.title, key: i },
                React.createElement(Indicators, { items: result.indicators })
            );
        }
    }]);

    return Results;
}(Level);

var App = function (_React$Component2) {
    _inherits(App, _React$Component2);

    function App(props) {
        _classCallCheck(this, App);

        var _this8 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this8.state = {
            results: []
        };
        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        _this8._apiData = {};
        return _this8;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // set up callback URL templates
            endpointData = JSON.parse(document.getElementById('endpoint-data').innerHTML);
            endpointURL = function endpointURL(id) {
                // Function that returns an object with callback URLs, including optional ID
                // Usage: endpointURL(17).result -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
                var host = "http://" + endpointData.host;
                return {
                    "result": host + '/rest/v1/result/' + id + '/?format=json',
                    "results_of_project": host + '/rest/v1/result/?format=json&project=' + id,
                    "indicators_of_project": host + '/rest/v1/indicator/?format=json&result__project=' + id,
                    "periods_of_project": host + '/rest/v1/indicator_period/?format=json&indicator__result__project=' + id,
                    "updates_and_comments_of_project": host + '/rest/v1/indicator_period_data_framework/?format=json&period__indicator__result__project=' + id,
                    "period_framework": host + '/rest/v1/indicator_period_framework/' + id + '/?format=json',
                    "update_and_comments": host + '/rest/v1/indicator_period_data_framework/' + id + '/?format=json',
                    "updates_and_comments": host + '/rest/v1/indicator_period_data_framework/?format=json',
                    "comments": host + '/rest/v1/indicator_period_data_comment/?format=json',
                    "user": host + '/rest/v1/user/' + id + '/?format=json',
                    "partnerships": host + '/rest/v1/partnership/?format=json&project=' + id,
                    "file_upload": host + '/rest/v1/indicator_period_data/' + id + '/upload_file/?format=json'
                };
            };

            if (!isPublic) {
                getUserData(endpointData.userId);
            }

            // Once the component is mounted, load the results through the API
            //TODO: this "chained" way of loading the API data kinda terrible and should be replaced
            var projectId = projectIds.project_id;
            this.loadResults(projectId);
        }
    }, {
        key: 'loadResults',
        value: function loadResults(projectId) {
            // Load the results through the API
            var success = function (response) {
                // NOTE the coincidence that the "container field" in the API is named results :-p
                this._apiData.results = response.results;
                this.loadIndicators(projectId);
            }.bind(this);
            apiCall('GET', endpointURL(projectId).results_of_project, '', success);
        }
    }, {
        key: 'loadIndicators',
        value: function loadIndicators(projectId) {
            // Load the indicators through the API
            var success = function (response) {
                this._apiData.indicators = response.results;
                this.loadPeriods(projectId);
            }.bind(this);
            apiCall('GET', endpointURL(projectId).indicators_of_project, '', success);
        }
    }, {
        key: 'loadPeriods',
        value: function loadPeriods(projectId) {
            // Load the periods through the API
            var success = function (response) {
                this._apiData.periods = response.results;
                this.loadUpdatesAndComments(projectId);
            }.bind(this);
            apiCall('GET', endpointURL(projectId).periods_of_project, '', success);
        }
    }, {
        key: 'loadUpdatesAndComments',
        value: function loadUpdatesAndComments(projectId) {
            // Load the period data and comment
            var success = function (response) {
                this._apiData.updatesAndComments = response.results;
                this.setState({
                    results: this.assembleData()
                });
            }.bind(this);
            apiCall('GET', endpointURL(projectId).updates_and_comments_of_project, '', success);
        }
    }, {
        key: 'assembleData',
        value: function assembleData() {
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
            function (result) {
                result.indicators = this._apiData.indicators
                // for each indicator
                .map(function (indicator) {
                    // add field "periods"
                    indicator.periods = this._apiData.periods
                    // for each period
                    .map(function (period) {
                        // add field "updates"
                        period.updates = this._apiData.updatesAndComments
                        // populate period.updates filtered on period ID
                        .filter(function (update) {
                            return update.period === period.id;
                        });
                        return period;
                    }.bind(this))
                    // populate indicator.periods filtered on indicator ID
                    .filter(function (period) {
                        return period.indicator === indicator.id;
                    });
                    return indicator;
                }.bind(this))
                // populate result.indicators filtered on result ID
                .filter(function (indicator) {
                    return indicator.result === result.id;
                });
                return result;
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var results = this.state.results;
            if (results !== undefined && results.length > 0) {
                return React.createElement(
                    Collapse,
                    null,
                    React.createElement(Results, { items: this.state.results })
                );
            } else {
                return React.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            }
        }
    }]);

    return App;
}(React.Component);

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data endpoints, translations and project IDs
    isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
    i18nResults = JSON.parse(document.getElementById('translation-texts').innerHTML);
    i18nMonths = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    ReactDOM.render(React.createElement(App, null), document.getElementById('new-results-framework'));

    // Check if React is loaded
    // if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof smoothScroll !== 'undefined') {
    //     smoothScroll.init({updateURL: false});
    //     initReact();
    // } else {
    //     loadAndRenderReact();
    // }
});

},{"rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNLFdBQVcsUUFBUSxXQUFSLENBQWpCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sUUFBUSxTQUFTLEtBQXZCOztBQUVBLElBQUksa0JBQUo7QUFBQSxJQUNJLG9CQURKO0FBQUEsSUFFSSxpQkFGSjtBQUFBLElBR0kscUJBSEo7QUFBQSxJQUlJLG9CQUpKO0FBQUEsSUFLSSxtQkFMSjtBQUFBLElBTUksbUJBTko7QUFBQSxJQU9JLGFBUEo7O0FBU0E7QUFDQSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEIsSUFBOUIsRUFBb0MsZUFBcEMsRUFBcUQsT0FBckQsRUFBOEQ7QUFDMUQsUUFBSSxVQUFVLElBQUksY0FBSixFQUFkO0FBQ0EsUUFBSSxhQUFhLENBQWpCOztBQUVBLFlBQVEsa0JBQVIsR0FBNkIsWUFBVztBQUNwQyxZQUFJLFFBQVEsVUFBUixJQUFzQixlQUFlLElBQXpDLEVBQStDO0FBQzNDLGdCQUFJLFdBQVcsUUFBUSxZQUFSLEtBQXlCLEVBQXpCLEdBQThCLEtBQUssS0FBTCxDQUFXLFFBQVEsWUFBbkIsQ0FBOUIsR0FBaUUsRUFBaEY7QUFDQSxnQkFBSSxRQUFRLE1BQVIsSUFBa0IsR0FBbEIsSUFBeUIsUUFBUSxNQUFSLEdBQWlCLEdBQTlDLEVBQW1EO0FBQy9DLG9CQUFJLFdBQVcsS0FBWCxJQUFvQixTQUFTLElBQVQsS0FBa0IsU0FBMUMsRUFBcUQ7QUFDakQsd0JBQUksU0FBUyxJQUFULEtBQWtCLElBQXRCLEVBQTRCO0FBQ3hCLDRCQUFJ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SDtBQUNKOzs7O0VBdklhLE1BQU0sUzs7QUE2SXhCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7QUFDckQ7QUFDQSxlQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUFyRTtBQUNBLGtCQUFjLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkMsU0FBeEQsQ0FBZDtBQUNBLGlCQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixZQUF4QixFQUFzQyxTQUFqRCxDQUFiO0FBQ0EsaUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQWxELENBQWI7O0FBRUEsYUFBUyxNQUFULENBQWdCLG9CQUFDLEdBQUQsT0FBaEIsRUFBd0IsU0FBUyxjQUFULENBQXdCLHVCQUF4QixDQUF4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbi8vIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4vLyBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbi8vIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbmNvbnN0IFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5jb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJ3JjLWNvbGxhcHNlJyk7XG5jb25zdCBQYW5lbCA9IENvbGxhcHNlLlBhbmVsO1xuXG5sZXQgY3NyZnRva2VuLFxuICAgIGkxOG5SZXN1bHRzLFxuICAgIGlzUHVibGljLFxuICAgIGVuZHBvaW50RGF0YSxcbiAgICBlbmRwb2ludFVSTCxcbiAgICBpMThuTW9udGhzLFxuICAgIHByb2plY3RJZHMsXG4gICAgdXNlcjtcblxuLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggYSBwcm9wZXIgbGlicmFyeSBmb3IgYmFja2VuZCBjYWxsc1xuZnVuY3Rpb24gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgdmFyIHhtbEh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbWF4UmV0cmllcyA9IDU7XG5cbiAgICB4bWxIdHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeG1sSHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhtbEh0dHAucmVzcG9uc2VUZXh0ICE9PSAnJyA/IEpTT04ucGFyc2UoeG1sSHR0cC5yZXNwb25zZVRleHQpIDogJyc7XG4gICAgICAgICAgICBpZiAoeG1sSHR0cC5zdGF0dXMgPj0gMjAwICYmIHhtbEh0dHAuc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ0dFVCcgJiYgcmVzcG9uc2UubmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5uZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uKG5ld1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFJlc3VsdHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdHMgPSBvbGRSZXN1bHRzLmNvbmNhdChuZXdSZXNwb25zZS5yZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlDYWxsKG1ldGhvZCwgcmVzcG9uc2UubmV4dCwgZGF0YSwgc3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBpMThuUmVzdWx0cy5nZW5lcmFsX2Vycm9yICsgJzogJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlICs9IHJlc3BvbnNlW2tleV0gKyAnLiAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3dHZW5lcmFsRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhtbEh0dHAub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHJldHJpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgMik7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0cmllcyA8PSBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCByZXRyaWVzICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaG93R2VuZXJhbEVycm9yKGkxOG5SZXN1bHRzLmNvbm5lY3Rpb25fZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhtbEh0dHAub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgeG1sSHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1DU1JGVG9rZW5cIiwgY3NyZnRva2VuKTtcbiAgICB4bWxIdHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgeG1sSHR0cC5zZW5kKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRGF0YShpZCkge1xuICAgIC8vIEdldCB0aGUgdXNlciBkYXRhIGZyb20gdGhlIEFQSSBhbmQgc3RvcmVzIGl0IGluIHRoZSBnbG9iYWwgdXNlciB2YXJpYWJsZVxuICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlO1xuICAgICAgICB1c2VySXNBZG1pbigpO1xuICAgIH07XG4gICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwoaWQpLnVzZXIsICcnLCBzdWNjZXNzKTtcbn1cblxuXG5jbGFzcyBMZXZlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmIChpdGVtcyAhPT0gdW5kZWZpbmVkICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBVcGRhdGVzIGV4dGVuZHMgTGV2ZWwge1xuICAgIHJlbmRlclBhbmVsKHVwZGF0ZSwgaSkge1xuICAgICAgICBjb25zdCBvcmdhbmlzYXRpb24gPSB1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZTtcbiAgICAgICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgK1wiIFwiKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHVwZGF0ZS5kYXRhO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBkYXRhOiAke2RhdGF9YDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlclRleHR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj57dXBkYXRlLmRhdGF9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kcyBleHRlbmRzIExldmVsIHtcbiAgICByZW5kZXJQYW5lbChwZXJpb2QsIGkpIHtcbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgICAgICAgICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICAgICAgICAgIGlmIChkYXRlU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgZGF0ZVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZy5zcGxpdChcIi5cIilbMF0ucmVwbGFjZShcIi9cIiwgLy0vZykpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTE4blJlc3VsdHMudW5rbm93bl9kYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQpICsgJyAtICcgKyBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIlBlcmlvZDogXCIgKyBwZXJpb2REYXRlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzIGl0ZW1zPXtwZXJpb2QudXBkYXRlc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV92YWx1ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuXG4gICAgcmVuZGVyUGFuZWwocmVzdWx0LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPEluZGljYXRvcnMgaXRlbXM9e3Jlc3VsdC5pbmRpY2F0b3JzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcmVzdWx0czogW11cbiAgICAgICAgfTtcbiAgICAgICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5fYXBpRGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBzZXQgdXAgY2FsbGJhY2sgVVJMIHRlbXBsYXRlc1xuICAgICAgICBlbmRwb2ludERhdGEgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKTtcbiAgICAgICAgZW5kcG9pbnRVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIC8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBjYWxsYmFjayBVUkxzLCBpbmNsdWRpbmcgb3B0aW9uYWwgSURcbiAgICAgICAgICAgIC8vIFVzYWdlOiBlbmRwb2ludFVSTCgxNykucmVzdWx0IC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuICAgICAgICAgICAgY29uc3QgaG9zdCA9IFwiaHR0cDovL1wiICsgZW5kcG9pbnREYXRhLmhvc3Q7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRzX29mX3Byb2plY3RcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiaW5kaWNhdG9yc19vZl9wcm9qZWN0XCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwicGVyaW9kc19vZl9wcm9qZWN0XCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNfb2ZfcHJvamVjdFwiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwicGVyaW9kX2ZyYW1ld29ya1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJjb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1c2VyXCI6IGAke2hvc3R9L3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwicGFydG5lcnNoaXBzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiZmlsZV91cGxvYWRcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNQdWJsaWMpIHtcbiAgICAgICAgICAgIGdldFVzZXJEYXRhKGVuZHBvaW50RGF0YS51c2VySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICBjb25zdCBwcm9qZWN0SWQgPSBwcm9qZWN0SWRzLnByb2plY3RfaWQ7XG4gICAgICAgIHRoaXMubG9hZFJlc3VsdHMocHJvamVjdElkKTtcbiAgICB9XG5cbiAgICBsb2FkUmVzdWx0cyhwcm9qZWN0SWQpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gTk9URSB0aGUgY29pbmNpZGVuY2UgdGhhdCB0aGUgXCJjb250YWluZXIgZmllbGRcIiBpbiB0aGUgQVBJIGlzIG5hbWVkIHJlc3VsdHMgOi1wXG4gICAgICAgICAgICB0aGlzLl9hcGlEYXRhLnJlc3VsdHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5kaWNhdG9ycyhwcm9qZWN0SWQpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHByb2plY3RJZCkucmVzdWx0c19vZl9wcm9qZWN0LCAnJywgc3VjY2Vzcyk7XG4gICAgfVxuXG4gICAgbG9hZEluZGljYXRvcnMocHJvamVjdElkKSB7XG4gICAgICAgIC8vIExvYWQgdGhlIGluZGljYXRvcnMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwaURhdGEuaW5kaWNhdG9ycyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLmxvYWRQZXJpb2RzKHByb2plY3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwocHJvamVjdElkKS5pbmRpY2F0b3JzX29mX3Byb2plY3QsICcnLCBzdWNjZXNzKTtcbiAgICB9XG5cbiAgICBsb2FkUGVyaW9kcyhwcm9qZWN0SWQpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcGVyaW9kcyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5fYXBpRGF0YS5wZXJpb2RzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMubG9hZFVwZGF0ZXNBbmRDb21tZW50cyhwcm9qZWN0SWQpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHByb2plY3RJZCkucGVyaW9kc19vZl9wcm9qZWN0LCAnJywgc3VjY2Vzcyk7XG4gICAgfVxuXG4gICAgbG9hZFVwZGF0ZXNBbmRDb21tZW50cyhwcm9qZWN0SWQpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcGVyaW9kIGRhdGEgYW5kIGNvbW1lbnRcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5fYXBpRGF0YS51cGRhdGVzQW5kQ29tbWVudHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcmVzdWx0czogdGhpcy5hc3NlbWJsZURhdGEoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwocHJvamVjdElkKS51cGRhdGVzX2FuZF9jb21tZW50c19vZl9wcm9qZWN0LCAnJywgc3VjY2Vzcyk7XG4gICAgfVxuXG4gICAgYXNzZW1ibGVEYXRhKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgZWFjaCBvZiB3aGljaCBob2xkcyBhIGxpc3Qgb2YgaW5kaWNhdG9yIHBlcmlvZFxuICAgICAgICBkYXRhIG9iamVjdHMgaW4gdGhlIGZpZWxkIFwidXBkYXRlc1wiLlxuICAgICAgICBOb3RlIHRoYXQgdGhlIFwibG93ZXN0XCIgbGV2ZWwgaW4gdGhlIGNhbGwgY2hhaW4sIGxvYWRVcGRhdGVzQW5kQ29tbWVudHMoKSwgcmV0cmlldmVzIGJvdGhcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZCBkYXRhIChcInVwZGF0ZXNcIikgYW5kIGNvbW1lbnRzIG5pY2VseSBzaW1pbGFybHkgdG8gdGhlIHJlc3Qgb2YgdGhlIGRhdGEuXG4gICAgICAgIEFsbCByZWxhdGlvbnMgYmFzZWQgb24gdGhlIHJlbGV2YW50IGZvcmVpZ24ga2V5cyBsaW5raW5nIHRoZSBtb2RlbCBvYmplY3RzLlxuICAgICAgICAqL1xuICAgICAgICAvLyBmb3IgZWFjaCByZXN1bHRcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwaURhdGEucmVzdWx0cy5tYXAoXG4gICAgICAgICAgICAvLyBhZGQgZmllbGQgXCJpbmRpY2F0b3JzXCJcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5pbmRpY2F0b3JzID0gdGhpcy5fYXBpRGF0YS5pbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBlYWNoIGluZGljYXRvclxuICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oaW5kaWNhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwicGVyaW9kc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yLnBlcmlvZHMgPSB0aGlzLl9hcGlEYXRhLnBlcmlvZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggcGVyaW9kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgZmllbGQgXCJ1cGRhdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHRoaXMuX2FwaURhdGEudXBkYXRlc0FuZENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBvcHVsYXRlIHBlcmlvZC51cGRhdGVzIGZpbHRlcmVkIG9uIHBlcmlvZCBJRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHVwZGF0ZSA9PiB1cGRhdGUucGVyaW9kID09PSBwZXJpb2QuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBvcHVsYXRlIGluZGljYXRvci5wZXJpb2RzIGZpbHRlcmVkIG9uIGluZGljYXRvciBJRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHBlcmlvZCA9PiBwZXJpb2QuaW5kaWNhdG9yID09PSBpbmRpY2F0b3IuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmRpY2F0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgICAgIC8vIHBvcHVsYXRlIHJlc3VsdC5pbmRpY2F0b3JzIGZpbHRlcmVkIG9uIHJlc3VsdCBJRFxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGluZGljYXRvciA9PiBpbmRpY2F0b3IucmVzdWx0ID09PSByZXN1bHQuaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLnN0YXRlLnJlc3VsdHM7XG4gICAgICAgIGlmIChyZXN1bHRzICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAgPFJlc3VsdHMgaXRlbXM9e3RoaXMuc3RhdGUucmVzdWx0c30vPlxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFJldHJpZXZlIGRhdGEgZW5kcG9pbnRzLCB0cmFuc2xhdGlvbnMgYW5kIHByb2plY3QgSURzXG4gICAgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgIGkxOG5SZXN1bHRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgIGkxOG5Nb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcblxuICAgIC8vIENoZWNrIGlmIFJlYWN0IGlzIGxvYWRlZFxuICAgIC8vIGlmICh0eXBlb2YgUmVhY3QgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBSZWFjdERPTSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHNtb290aFNjcm9sbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyAgICAgc21vb3RoU2Nyb2xsLmluaXQoe3VwZGF0ZVVSTDogZmFsc2V9KTtcbiAgICAvLyAgICAgaW5pdFJlYWN0KCk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgbG9hZEFuZFJlbmRlclJlYWN0KCk7XG4gICAgLy8gfVxufSk7Il19
