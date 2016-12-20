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
    endpoints = void 0,
    i18nResults = void 0,
    isPublic = void 0,
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

function getUserData() {
    // Get the user data from the API and stores it in the global user variable
    var success = function success(response) {
        user = response;
        userIsAdmin();
    };
    apiCall('GET', endpoints.base_url + endpoints.user, '', success);
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
        endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
        _this8._apiData = {};
        return _this8;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // Once the component is mounted, load the results through the API
            var project_id = projectIds.project_id;
            //TODO: this "chained" way of loading the API data kinda terrible and should be replaced
            this.loadResults(project_id);
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
            apiCall('GET', endpoints.base_url + endpoints.results_of_project.replace('{project}', projectId), '', success);
        }
    }, {
        key: 'loadIndicators',
        value: function loadIndicators(projectId) {
            // Load the indicators through the API
            var success = function (response) {
                this._apiData.indicators = response.results;
                this.loadPeriods(projectId);
            }.bind(this);
            apiCall('GET', endpoints.base_url + endpoints.indicators_of_project.replace('{project}', projectId), '', success);
        }
    }, {
        key: 'loadPeriods',
        value: function loadPeriods(projectId) {
            // Load the periods through the API
            var success = function (response) {
                this._apiData.periods = response.results;
                this.loadUpdatesAndComments(projectId);
            }.bind(this);
            apiCall('GET', endpoints.base_url + endpoints.periods_of_project.replace('{project}', projectId), '', success);
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
            apiCall('GET', endpoints.base_url + endpoints.updates_and_comments_of_project.replace('{project}', projectId), '', success);
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

ReactDOM.render(React.createElement(App, null), document.getElementById('new-results-framework'));

document.addEventListener('DOMContentLoaded', function () {
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

},{"rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNLFdBQVcsUUFBUSxXQUFSLENBQWpCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sUUFBUSxTQUFTLEtBQXZCOztBQUVBLElBQUksa0JBQUo7QUFBQSxJQUNJLGtCQURKO0FBQUEsSUFFSSxvQkFGSjtBQUFBLElBR0ksaUJBSEo7QUFBQSxJQUlJLG1CQUpKO0FBQUEsSUFLSSxtQkFMSjtBQUFBLElBTUksYUFOSjs7QUFRQTtBQUNBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QixJQUE5QixFQUFvQyxlQUFwQyxFQUFxRCxPQUFyRCxFQUE4RDtBQUMxRCxRQUFJLFVBQVUsSUFBSSxjQUFKLEVBQWQ7QUFDQSxRQUFJLGFBQWEsQ0FBakI7O0FBRUEsWUFBUSxrQkFBUixHQUE2QixZQUFXO0FBQ3BDLFlBQUksUUFBUSxVQUFSLElBQXNCLGVBQWUsSUFBekMsRUFBK0M7QUFDM0MsZ0JBQUksV0FBVyxRQUFRLFlBQVIsS0FBeUIsRUFBekIsR0FBOEIsS0FBSyxLQUFMLENBQVcsUUFBUSxZQUFuQixDQUE5QixHQUFpRSxFQUFoRjtBQUNBLGdCQUFJLFFBQVEsTUFBUixJQUFrQixHQUFsQixJQUF5QixRQUFRLE1BQVIsR0FBaUIsR0FBOUMsRUFBbUQ7QUFDL0Msb0JBQUksV0FBVyxLQUFYLElBQW9CLFNBQVMsSUFBVCxLQUFrQixTQUExQyxFQUFxRDtBQUNqRCx3QkFBSSxTQUFTLElBQVQsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsNEJBQUksVUFBVSxTQUFWLE9BQVUs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Y0FBVCxDQUF3QixZQUF4QixFQUFzQyxTQUFqRCxDQUFiO0FBQ0EsaUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQWxELENBQWI7O0FBRUEsUUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxDQW5CRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4vLyBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuLy8gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4vLyA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblxuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5jb25zdCBSZWFjdERPTSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuY29uc3QgQ29sbGFwc2UgPSByZXF1aXJlKCdyYy1jb2xsYXBzZScpO1xuY29uc3QgUGFuZWwgPSBDb2xsYXBzZS5QYW5lbDtcblxubGV0IGNzcmZ0b2tlbixcbiAgICBlbmRwb2ludHMsXG4gICAgaTE4blJlc3VsdHMsXG4gICAgaXNQdWJsaWMsXG4gICAgaTE4bk1vbnRocyxcbiAgICBwcm9qZWN0SWRzLFxuICAgIHVzZXI7XG5cbi8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGEgcHJvcGVyIGxpYnJhcnkgZm9yIGJhY2tlbmQgY2FsbHNcbmZ1bmN0aW9uIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgcmV0cmllcykge1xuICAgIHZhciB4bWxIdHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIG1heFJldHJpZXMgPSA1O1xuXG4gICAgeG1sSHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhtbEh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4bWxIdHRwLnJlc3BvbnNlVGV4dCAhPT0gJycgPyBKU09OLnBhcnNlKHhtbEh0dHAucmVzcG9uc2VUZXh0KSA6ICcnO1xuICAgICAgICAgICAgaWYgKHhtbEh0dHAuc3RhdHVzID49IDIwMCAmJiB4bWxIdHRwLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdHRVQnICYmIHJlc3BvbnNlLm5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubmV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbihuZXdSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRSZXN1bHRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHRzID0gb2xkUmVzdWx0cy5jb25jYXQobmV3UmVzcG9uc2UucmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpQ2FsbChtZXRob2QsIHJlc3BvbnNlLm5leHQsIGRhdGEsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gaTE4blJlc3VsdHMuZ2VuZXJhbF9lcnJvciArICc6ICc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSArPSByZXNwb25zZVtrZXldICsgJy4gJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG93R2VuZXJhbEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxIdHRwLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChyZXRyaWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIDIpO1xuICAgICAgICB9IGVsc2UgaWYgKHJldHJpZXMgPD0gbWF4UmV0cmllcykge1xuICAgICAgICAgICAgcmV0dXJuIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgcmV0cmllcyArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd0dlbmVyYWxFcnJvcihpMThuUmVzdWx0cy5jb25uZWN0aW9uX2Vycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxIdHRwLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgIHhtbEh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIlgtQ1NSRlRva2VuXCIsIGNzcmZ0b2tlbik7XG4gICAgeG1sSHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIHhtbEh0dHAuc2VuZChkYXRhKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlckRhdGEoKSB7XG4gICAgLy8gR2V0IHRoZSB1c2VyIGRhdGEgZnJvbSB0aGUgQVBJIGFuZCBzdG9yZXMgaXQgaW4gdGhlIGdsb2JhbCB1c2VyIHZhcmlhYmxlXG4gICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB1c2VyID0gcmVzcG9uc2U7XG4gICAgICAgIHVzZXJJc0FkbWluKCk7XG4gICAgfTtcbiAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludHMuYmFzZV91cmwgKyBlbmRwb2ludHMudXNlciwgJycsIHN1Y2Nlc3MpO1xufVxuXG5cbmNsYXNzIExldmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgaWYgKGl0ZW1zICE9PSB1bmRlZmluZWQgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2U+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGkpID0+IHRoaXMucmVuZGVyUGFuZWwoaXRlbSwgaSkpfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuY2xhc3MgQ29tbWVudHMgZXh0ZW5kcyBMZXZlbCB7XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8ZGl2Pnt1cGRhdGUuZGF0YX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHMgaXRlbXM9e3VwZGF0ZS5jb21tZW50c30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBQZXJpb2RzIGV4dGVuZHMgTGV2ZWwge1xuICAgIHJlbmRlclBhbmVsKHBlcmlvZCwgaSkge1xuICAgICAgICBmdW5jdGlvbiBkaXNwbGF5RGF0ZShkYXRlU3RyaW5nKSB7XG4gICAgICAgICAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgICAgICAgICAgaWYgKGRhdGVTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBkYXRlU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWxlID0gXCJlbi1nYlwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBpMThuTW9udGhzW2RhdGUuZ2V0VVRDTW9udGgoKV07XG4gICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpMThuUmVzdWx0cy51bmtub3duX2RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCkgKyAnIC0gJyArIGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUGVyaW9kOiBcIiArIHBlcmlvZERhdGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXMgaXRlbXM9e3BlcmlvZC51cGRhdGVzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIEluZGljYXRvcnMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgcmVuZGVyUGFuZWwoaW5kaWNhdG9yLCBpKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJJbmRpY2F0b3I6IFwiICsgdGl0bGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS15ZWFyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aTE4blJlc3VsdHMuYmFzZWxpbmVfeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntpbmRpY2F0b3IuYmFzZWxpbmVfeWVhcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aTE4blJlc3VsdHMuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPFBlcmlvZHMgaXRlbXM9e2luZGljYXRvci5wZXJpb2RzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBMZXZlbCB7XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9ycyBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICByZXN1bHRzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXRhLWVuZHBvaW50cycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuX2FwaURhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIGNvbnN0IHByb2plY3RfaWQgPSBwcm9qZWN0SWRzLnByb2plY3RfaWQ7XG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRSZXN1bHRzKHByb2plY3RfaWQpO1xuICAgIH1cblxuICAgIGxvYWRSZXN1bHRzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vIE5PVEUgdGhlIGNvaW5jaWRlbmNlIHRoYXQgdGhlIFwiY29udGFpbmVyIGZpZWxkXCIgaW4gdGhlIEFQSSBpcyBuYW1lZCByZXN1bHRzIDotcFxuICAgICAgICAgICAgdGhpcy5fYXBpRGF0YS5yZXN1bHRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMubG9hZEluZGljYXRvcnMocHJvamVjdElkKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludHMuYmFzZV91cmwgKyBlbmRwb2ludHMucmVzdWx0c19vZl9wcm9qZWN0LnJlcGxhY2UoJ3twcm9qZWN0fScsXG4gICAgICAgICAgICAgICAgcHJvamVjdElkKSwgJycsIHN1Y2Nlc3MpO1xuICAgIH1cblxuICAgIGxvYWRJbmRpY2F0b3JzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSBpbmRpY2F0b3JzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwaURhdGEuaW5kaWNhdG9ycyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLmxvYWRQZXJpb2RzKHByb2plY3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLmluZGljYXRvcnNfb2ZfcHJvamVjdC5yZXBsYWNlKCd7cHJvamVjdH0nLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZCksICcnLCBzdWNjZXNzKTtcbiAgICB9XG5cbiAgICBsb2FkUGVyaW9kcyhwcm9qZWN0SWQpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcGVyaW9kcyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9hcGlEYXRhLnBlcmlvZHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5sb2FkVXBkYXRlc0FuZENvbW1lbnRzKHByb2plY3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLnBlcmlvZHNfb2ZfcHJvamVjdC5yZXBsYWNlKCd7cHJvamVjdH0nLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZCksICcnLCBzdWNjZXNzKTtcbiAgICB9XG5cbiAgICBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSBwZXJpb2QgZGF0YSBhbmQgY29tbWVudFxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwaURhdGEudXBkYXRlc0FuZENvbW1lbnRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHRoaXMuYXNzZW1ibGVEYXRhKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoXG4gICAgICAgICAgICAnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzX29mX3Byb2plY3QucmVwbGFjZShcbiAgICAgICAgICAgICAgICAne3Byb2plY3R9JywgcHJvamVjdElkXG4gICAgICAgICAgICApLCAnJywgc3VjY2Vzc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzc2VtYmxlRGF0YSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYSBsaXN0IG9mIGluZGljYXRvciBwZXJpb2RcbiAgICAgICAgZGF0YSBvYmplY3RzIGluIHRoZSBmaWVsZCBcInVwZGF0ZXNcIi5cbiAgICAgICAgTm90ZSB0aGF0IHRoZSBcImxvd2VzdFwiIGxldmVsIGluIHRoZSBjYWxsIGNoYWluLCBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKCksIHJldHJpZXZlcyBib3RoXG4gICAgICAgIGluZGljYXRvciBwZXJpb2QgZGF0YSAoXCJ1cGRhdGVzXCIpIGFuZCBjb21tZW50cyBuaWNlbHkgc2ltaWxhcmx5IHRvIHRoZSByZXN0IG9mIHRoZSBkYXRhLlxuICAgICAgICBBbGwgcmVsYXRpb25zIGJhc2VkIG9uIHRoZSByZWxldmFudCBmb3JlaWduIGtleXMgbGlua2luZyB0aGUgbW9kZWwgb2JqZWN0cy5cbiAgICAgICAgKi9cbiAgICAgICAgLy8gZm9yIGVhY2ggcmVzdWx0XG4gICAgICAgIHJldHVybiB0aGlzLl9hcGlEYXRhLnJlc3VsdHMubWFwKFxuICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwiaW5kaWNhdG9yc1wiXG4gICAgICAgICAgICBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuaW5kaWNhdG9ycyA9IHRoaXMuX2FwaURhdGEuaW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBpbmRpY2F0b3JcbiAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGluZGljYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBmaWVsZCBcInBlcmlvZHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGljYXRvci5wZXJpb2RzID0gdGhpcy5fYXBpRGF0YS5wZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBlYWNoIHBlcmlvZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwidXBkYXRlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSB0aGlzLl9hcGlEYXRhLnVwZGF0ZXNBbmRDb21tZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSBwZXJpb2QudXBkYXRlcyBmaWx0ZXJlZCBvbiBwZXJpb2QgSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih1cGRhdGUgPT4gdXBkYXRlLnBlcmlvZCA9PT0gcGVyaW9kLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVyaW9kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSBpbmRpY2F0b3IucGVyaW9kcyBmaWx0ZXJlZCBvbiBpbmRpY2F0b3IgSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihwZXJpb2QgPT4gcGVyaW9kLmluZGljYXRvciA9PT0gaW5kaWNhdG9yLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSByZXN1bHQuaW5kaWNhdG9ycyBmaWx0ZXJlZCBvbiByZXN1bHQgSURcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpbmRpY2F0b3IgPT4gaW5kaWNhdG9yLnJlc3VsdCA9PT0gcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gdGhpcy5zdGF0ZS5yZXN1bHRzO1xuICAgICAgICBpZiAocmVzdWx0cyAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2U+XG4gICAgICAgICAgICAgICAgICAgIDxSZXN1bHRzIGl0ZW1zPXt0aGlzLnN0YXRlLnJlc3VsdHN9Lz5cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXRyaWV2ZSBkYXRhIGVuZHBvaW50cywgdHJhbnNsYXRpb25zIGFuZCBwcm9qZWN0IElEc1xuICAgIGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXRhLWVuZHBvaW50cycpLmlubmVySFRNTCk7XG4gICAgaTE4blJlc3VsdHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgaTE4bk1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG5cbiAgICBpZiAoIWlzUHVibGljKSB7XG4gICAgICAgIGdldFVzZXJEYXRhKCk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgUmVhY3QgaXMgbG9hZGVkXG4gICAgLy8gaWYgKHR5cGVvZiBSZWFjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFJlYWN0RE9NICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc21vb3RoU2Nyb2xsICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vICAgICBzbW9vdGhTY3JvbGwuaW5pdCh7dXBkYXRlVVJMOiBmYWxzZX0pO1xuICAgIC8vICAgICBpbml0UmVhY3QoKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICBsb2FkQW5kUmVuZGVyUmVhY3QoKTtcbiAgICAvLyB9XG59KTsiXX0=
