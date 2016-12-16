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

var IndicatorPeriods = function (_React$Component) {
    _inherits(IndicatorPeriods, _React$Component);

    function IndicatorPeriods() {
        _classCallCheck(this, IndicatorPeriods);

        return _possibleConstructorReturn(this, (IndicatorPeriods.__proto__ || Object.getPrototypeOf(IndicatorPeriods)).apply(this, arguments));
    }

    _createClass(IndicatorPeriods, [{
        key: 'render',
        value: function render() {
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
                return React.createElement(
                    Panel,
                    { header: "Period: " + periodDate, key: i },
                    React.createElement(
                        'div',
                        { className: 'period-td' },
                        periodDate
                    )
                );
            }
            var periods = this.props.periods;
            if (periods !== undefined && periods.length > 0) {
                return React.createElement(
                    Collapse,
                    null,
                    periods.map(function (period, i) {
                        return renderPanel(period, i);
                    })
                );
            } else {
                return React.createElement(
                    'p',
                    null,
                    'No periods'
                );
            }
        }
    }]);

    return IndicatorPeriods;
}(React.Component);

var Indicators = function (_React$Component2) {
    _inherits(Indicators, _React$Component2);

    function Indicators() {
        _classCallCheck(this, Indicators);

        return _possibleConstructorReturn(this, (Indicators.__proto__ || Object.getPrototypeOf(Indicators)).apply(this, arguments));
    }

    _createClass(Indicators, [{
        key: 'render',
        value: function render() {
            var periods = function (indicator) {
                return this.props.periods.filter(function (period) {
                    return period.indicator === indicator.id;
                });
            }.bind(this);

            function renderPanel(indicator, i) {
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
                    React.createElement(IndicatorPeriods, { periods: indicator.periods })
                );
            }
            var indicators = this.props.indicators;
            if (indicators !== undefined && indicators.length > 0) {
                return React.createElement(
                    Collapse,
                    null,
                    indicators.map(function (indicator, i) {
                        return renderPanel(indicator, i);
                    })
                );
            } else {
                return React.createElement(
                    'p',
                    null,
                    'No indicators'
                );
            }
        }
    }]);

    return Indicators;
}(React.Component);

var Results = function (_React$Component3) {
    _inherits(Results, _React$Component3);

    function Results(props) {
        _classCallCheck(this, Results);

        var _this3 = _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).call(this, props));

        _this3.state = {
            results: []
        };
        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
        _this3._apiData = {};
        return _this3;
    }

    _createClass(Results, [{
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
            data objects in the field updates.
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
            if (results.length > 0) {
                return React.createElement(
                    Collapse,
                    null,
                    results.map(function (result, i) {
                        return React.createElement(
                            Panel,
                            { header: "Result: " + result.title, key: i },
                            React.createElement(Indicators, { indicators: result.indicators })
                        );
                    })
                );
            } else {
                return React.createElement(
                    'span',
                    null,
                    'Loading...'
                );
            }
        }
    }]);

    return Results;
}(React.Component);

ReactDOM.render(React.createElement(Results, null), document.getElementById('new-results-framework'));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNLFdBQVcsUUFBUSxXQUFSLENBQWpCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sUUFBUSxTQUFTLEtBQXZCOztBQUVBLElBQUksa0JBQUo7QUFBQSxJQUNJLGtCQURKO0FBQUEsSUFFSSxvQkFGSjtBQUFBLElBR0ksaUJBSEo7QUFBQSxJQUlJLG1CQUpKO0FBQUEsSUFLSSxtQkFMSjtBQUFBLElBTUksYUFOSjs7QUFRQTtBQUNBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QixJQUE5QixFQUFvQyxlQUFwQyxFQUFxRCxPQUFyRCxFQUE4RDtBQUMxRCxRQUFJLFVBQVUsSUFBSSxjQUFKLEVBQWQ7QUFDQSxRQUFJLGFBQWEsQ0FBakI7O0FBRUEsWUFBUSxrQkFBUixHQUE2QixZQUFXO0FBQ3BDLFlBQUksUUFBUSxVQUFSLElBQXNCLGVBQWUsSUFBekMsRUFBK0M7QUFDM0MsZ0JBQUksV0FBVyxRQUFRLFlBQVIsS0FBeUIsRUFBekIsR0FBOEIsS0FBSyxLQUFMLENBQVcsUUFBUSxZQUFuQixDQUE5QixHQUFpRSxFQUFoRjtBQUNBLGdCQUFJLFFBQVEsTUFBUixJQUFrQixHQUFsQixJQUF5QixRQUFRLE1BQVIsR0FBaUIsR0FBOUMsRUFBbUQ7QUFDL0Msb0JBQUksV0FBVyxLQUFYLElBQW9CLFNBQVMsSUFBVCxLQUFrQixTQUExQyxFQUFxRDtBQUNqRCx3QkFBSSxTQUFTLElBQVQsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsNEJBQUksVUFBVSxTQUFWLE9BQVUs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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuLy8gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbi8vIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuLy8gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cblxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuY29uc3QgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbmNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgncmMtY29sbGFwc2UnKTtcbmNvbnN0IFBhbmVsID0gQ29sbGFwc2UuUGFuZWw7XG5cbmxldCBjc3JmdG9rZW4sXG4gICAgZW5kcG9pbnRzLFxuICAgIGkxOG5SZXN1bHRzLFxuICAgIGlzUHVibGljLFxuICAgIGkxOG5Nb250aHMsXG4gICAgcHJvamVjdElkcyxcbiAgICB1c2VyO1xuXG4vLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBhIHByb3BlciBsaWJyYXJ5IGZvciBiYWNrZW5kIGNhbGxzXG5mdW5jdGlvbiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICB2YXIgeG1sSHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBtYXhSZXRyaWVzID0gNTtcblxuICAgIHhtbEh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4bWxIdHRwLnJlYWR5U3RhdGUgPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geG1sSHR0cC5yZXNwb25zZVRleHQgIT09ICcnID8gSlNPTi5wYXJzZSh4bWxIdHRwLnJlc3BvbnNlVGV4dCkgOiAnJztcbiAgICAgICAgICAgIGlmICh4bWxIdHRwLnN0YXR1cyA+PSAyMDAgJiYgeG1sSHR0cC5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSAnR0VUJyAmJiByZXNwb25zZS5uZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm5leHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24obmV3UmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkUmVzdWx0cyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0cyA9IG9sZFJlc3VsdHMuY29uY2F0KG5ld1Jlc3BvbnNlLnJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUNhbGwobWV0aG9kLCByZXNwb25zZS5uZXh0LCBkYXRhLCBzdWNjZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGkxOG5SZXN1bHRzLmdlbmVyYWxfZXJyb3IgKyAnOiAnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gcmVzcG9uc2Vba2V5XSArICcuICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvd0dlbmVyYWxFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeG1sSHR0cC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAocmV0cmllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCAyKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXRyaWVzIDw9IG1heFJldHJpZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIHJldHJpZXMgKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNob3dHZW5lcmFsRXJyb3IoaTE4blJlc3VsdHMuY29ubmVjdGlvbl9lcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeG1sSHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICB4bWxIdHRwLnNldFJlcXVlc3RIZWFkZXIoXCJYLUNTUkZUb2tlblwiLCBjc3JmdG9rZW4pO1xuICAgIHhtbEh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiKTtcbiAgICB4bWxIdHRwLnNlbmQoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJEYXRhKCkge1xuICAgIC8vIEdldCB0aGUgdXNlciBkYXRhIGZyb20gdGhlIEFQSSBhbmQgc3RvcmVzIGl0IGluIHRoZSBnbG9iYWwgdXNlciB2YXJpYWJsZVxuICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlO1xuICAgICAgICB1c2VySXNBZG1pbigpO1xuICAgIH07XG4gICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLnVzZXIsICcnLCBzdWNjZXNzKTtcbn1cblxuXG5jbGFzcyBJbmRpY2F0b3JQZXJpb2RzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgICAgICAgICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICAgICAgICAgIGlmIChkYXRlU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgZGF0ZVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBtb250aCA9IGkxOG5Nb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpMThuUmVzdWx0cy51bmtub3duX2RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJQYW5lbChwZXJpb2QsIGkpIHtcbiAgICAgICAgICAgIHZhciBwZXJpb2REYXRlID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCkgKyAnIC0gJyArIGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJQZXJpb2Q6IFwiICsgcGVyaW9kRGF0ZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJpb2QtdGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwZXJpb2REYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSB0aGlzLnByb3BzLnBlcmlvZHM7XG4gICAgICAgIGlmIChwZXJpb2RzICE9PSB1bmRlZmluZWQgJiYgcGVyaW9kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge3BlcmlvZHMubWFwKChwZXJpb2QsIGkpID0+IHJlbmRlclBhbmVsKHBlcmlvZCwgaSkpfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBwZXJpb2RzPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgcGVyaW9kcyA9IGZ1bmN0aW9uIChpbmRpY2F0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnBlcmlvZHMuZmlsdGVyKHBlcmlvZCA9PiBwZXJpb2QuaW5kaWNhdG9yID09PSBpbmRpY2F0b3IuaWQpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyUGFuZWwoaW5kaWNhdG9yLCBpKSB7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJJbmRpY2F0b3I6IFwiICsgdGl0bGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS15ZWFyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV95ZWFyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPEluZGljYXRvclBlcmlvZHMgcGVyaW9kcz17aW5kaWNhdG9yLnBlcmlvZHN9Lz5cbiAgICAgICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSB0aGlzLnByb3BzLmluZGljYXRvcnM7XG4gICAgICAgIGlmIChpbmRpY2F0b3JzICE9PSB1bmRlZmluZWQgJiYgaW5kaWNhdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2luZGljYXRvcnMubWFwKChpbmRpY2F0b3IsIGkpID0+IHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkpfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpbmRpY2F0b3JzPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5jbGFzcyBSZXN1bHRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICByZXN1bHRzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXRhLWVuZHBvaW50cycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuX2FwaURhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIGNvbnN0IHByb2plY3RfaWQgPSBwcm9qZWN0SWRzLnByb2plY3RfaWQ7XG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRSZXN1bHRzKHByb2plY3RfaWQpO1xuICAgIH1cblxuICAgIGxvYWRSZXN1bHRzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vIE5PVEUgdGhlIGNvaW5jaWRlbmNlIHRoYXQgdGhlIFwiY29udGFpbmVyIGZpZWxkXCIgaW4gdGhlIEFQSSBpcyBuYW1lZCByZXN1bHRzIDotcFxuICAgICAgICAgICAgdGhpcy5fYXBpRGF0YS5yZXN1bHRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMubG9hZEluZGljYXRvcnMocHJvamVjdElkKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludHMuYmFzZV91cmwgKyBlbmRwb2ludHMucmVzdWx0c19vZl9wcm9qZWN0LnJlcGxhY2UoJ3twcm9qZWN0fScsXG4gICAgICAgICAgICAgICAgcHJvamVjdElkKSwgJycsIHN1Y2Nlc3MpO1xuICAgIH1cblxuICAgIGxvYWRJbmRpY2F0b3JzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSBpbmRpY2F0b3JzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwaURhdGEuaW5kaWNhdG9ycyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLmxvYWRQZXJpb2RzKHByb2plY3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLmluZGljYXRvcnNfb2ZfcHJvamVjdC5yZXBsYWNlKCd7cHJvamVjdH0nLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZCksICcnLCBzdWNjZXNzKTtcbiAgICB9XG5cbiAgICBsb2FkUGVyaW9kcyhwcm9qZWN0SWQpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcGVyaW9kcyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9hcGlEYXRhLnBlcmlvZHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5sb2FkVXBkYXRlc0FuZENvbW1lbnRzKHByb2plY3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLnBlcmlvZHNfb2ZfcHJvamVjdC5yZXBsYWNlKCd7cHJvamVjdH0nLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZCksICcnLCBzdWNjZXNzKTtcbiAgICB9XG5cbiAgICBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKHByb2plY3RJZCkge1xuICAgICAgICAvLyBMb2FkIHRoZSBwZXJpb2QgZGF0YSBhbmQgY29tbWVudFxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwaURhdGEudXBkYXRlc0FuZENvbW1lbnRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHRoaXMuYXNzZW1ibGVEYXRhKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoXG4gICAgICAgICAgICAnR0VUJywgZW5kcG9pbnRzLmJhc2VfdXJsICsgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzX29mX3Byb2plY3QucmVwbGFjZShcbiAgICAgICAgICAgICAgICAne3Byb2plY3R9JywgcHJvamVjdElkXG4gICAgICAgICAgICApLCAnJywgc3VjY2Vzc1xuICAgICAgICApO1xuICAgIH1cblxuXG5cbiAgICBhc3NlbWJsZURhdGEoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIGxpc3Qgb2YgcmVzdWx0IG9iamVjdHMgYmFzZWQgb24gdGhlIEFQSSBjYWxsIGZvciBSZXN1bHQsIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYVxuICAgICAgICBsaXN0IG9mIGl0cyBhc3NvY2lhdGVkIGluZGljYXRvcnMgaW4gdGhlIGZpZWxkIFwiaW5kaWNhdG9yc1wiLCBlYWNoIG9mIHdoaWNoIGhvbGQgYSBsaXN0IG9mXG4gICAgICAgIGluZGljYXRvciBwZXJpb2RzIGluIHRoZSBmaWVsZCBcInBlcmlvZHNcIiBlYWNoIG9mIHdoaWNoIGhvbGRzIGEgbGlzdCBvZiBpbmRpY2F0b3IgcGVyaW9kXG4gICAgICAgIGRhdGEgb2JqZWN0cyBpbiB0aGUgZmllbGQgdXBkYXRlcy5cbiAgICAgICAgTm90ZSB0aGF0IHRoZSBcImxvd2VzdFwiIGxldmVsIGluIHRoZSBjYWxsIGNoYWluLCBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKCksIHJldHJpZXZlcyBib3RoXG4gICAgICAgIGluZGljYXRvciBwZXJpb2QgZGF0YSAoXCJ1cGRhdGVzXCIpIGFuZCBjb21tZW50cyBuaWNlbHkgc2ltaWxhcmx5IHRvIHRoZSByZXN0IG9mIHRoZSBkYXRhLlxuICAgICAgICBBbGwgcmVsYXRpb25zIGJhc2VkIG9uIHRoZSByZWxldmFudCBmb3JlaWduIGtleXMgbGlua2luZyB0aGUgbW9kZWwgb2JqZWN0cy5cbiAgICAgICAgKi9cbiAgICAgICAgLy8gZm9yIGVhY2ggcmVzdWx0XG4gICAgICAgIHJldHVybiB0aGlzLl9hcGlEYXRhLnJlc3VsdHMubWFwKFxuICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwiaW5kaWNhdG9yc1wiXG4gICAgICAgICAgICBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuaW5kaWNhdG9ycyA9IHRoaXMuX2FwaURhdGEuaW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBpbmRpY2F0b3JcbiAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGluZGljYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBmaWVsZCBcInBlcmlvZHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGljYXRvci5wZXJpb2RzID0gdGhpcy5fYXBpRGF0YS5wZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBlYWNoIHBlcmlvZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwidXBkYXRlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSB0aGlzLl9hcGlEYXRhLnVwZGF0ZXNBbmRDb21tZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSBwZXJpb2QudXBkYXRlcyBmaWx0ZXJlZCBvbiBwZXJpb2QgSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih1cGRhdGUgPT4gdXBkYXRlLnBlcmlvZCA9PT0gcGVyaW9kLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVyaW9kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSBpbmRpY2F0b3IucGVyaW9kcyBmaWx0ZXJlZCBvbiBpbmRpY2F0b3IgSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihwZXJpb2QgPT4gcGVyaW9kLmluZGljYXRvciA9PT0gaW5kaWNhdG9yLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kaWNhdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSByZXN1bHQuaW5kaWNhdG9ycyBmaWx0ZXJlZCBvbiByZXN1bHQgSURcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpbmRpY2F0b3IgPT4gaW5kaWNhdG9yLnJlc3VsdCA9PT0gcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gdGhpcy5zdGF0ZS5yZXN1bHRzO1xuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge3Jlc3VsdHMubWFwKChyZXN1bHQsIGkpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEluZGljYXRvcnMgaW5kaWNhdG9ycz17cmVzdWx0LmluZGljYXRvcnN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWw+KX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHNwYW4+TG9hZGluZy4uLjwvc3Bhbj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuUmVhY3RET00ucmVuZGVyKDxSZXN1bHRzLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXRyaWV2ZSBkYXRhIGVuZHBvaW50cywgdHJhbnNsYXRpb25zIGFuZCBwcm9qZWN0IElEc1xuICAgIGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXRhLWVuZHBvaW50cycpLmlubmVySFRNTCk7XG4gICAgaTE4blJlc3VsdHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgaTE4bk1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG5cbiAgICBpZiAoIWlzUHVibGljKSB7XG4gICAgICAgIGdldFVzZXJEYXRhKCk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgUmVhY3QgaXMgbG9hZGVkXG4gICAgLy8gaWYgKHR5cGVvZiBSZWFjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFJlYWN0RE9NICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc21vb3RoU2Nyb2xsICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vICAgICBzbW9vdGhTY3JvbGwuaW5pdCh7dXBkYXRlVVJMOiBmYWxzZX0pO1xuICAgIC8vICAgICBpbml0UmVhY3QoKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICBsb2FkQW5kUmVuZGVyUmVhY3QoKTtcbiAgICAvLyB9XG59KTsiXX0=
