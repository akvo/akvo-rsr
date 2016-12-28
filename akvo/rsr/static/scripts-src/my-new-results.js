(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


var React = require('react');
var ReactDOM = require('react-dom');
var update = require('immutability-helper');
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

// from http://stackoverflow.com/questions/7306669/
Object.values = Object.values || function (obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
};

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == name + '=') {
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
        // userIsAdmin();
    };
    apiCall('GET', endpointURL(id).user, '', success);
}

function titleCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
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
            if (this.props.models[this.state.model] === undefined || items === undefined) {
                console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
                return React.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            } else if (items.length > 0) {
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

    function Comments(props) {
        _classCallCheck(this, Comments);

        var _this3 = _possibleConstructorReturn(this, (Comments.__proto__ || Object.getPrototypeOf(Comments)).call(this, props));

        _this3.state = { model: "comments" };
        return _this3;
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

    function Updates(props) {
        _classCallCheck(this, Updates);

        var _this4 = _possibleConstructorReturn(this, (Updates.__proto__ || Object.getPrototypeOf(Updates)).call(this, props));

        _this4.state = { model: "updates" };
        return _this4;
    }

    _createClass(Updates, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('comments');
        }
    }, {
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
                    React.createElement(Comments, {
                        items: update.comments,
                        models: this.props.models,
                        callbacks: this.props.callbacks })
                )
            );
        }
    }]);

    return Updates;
}(Level);

var PeriodLockToggle = function (_React$Component2) {
    _inherits(PeriodLockToggle, _React$Component2);

    function PeriodLockToggle(props) {
        _classCallCheck(this, PeriodLockToggle);

        var _this5 = _possibleConstructorReturn(this, (PeriodLockToggle.__proto__ || Object.getPrototypeOf(PeriodLockToggle)).call(this, props));

        _this5.lockToggle = _this5.lockToggle.bind(_this5);
        return _this5;
    }

    _createClass(PeriodLockToggle, [{
        key: 'lockToggle',
        value: function lockToggle(e) {
            PeriodLockToggle.basePeriodSave(this.props.period.id, { locked: !this.props.period.locked });
            e.stopPropagation();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'a',
                {
                    onClick: this.lockToggle,
                    className: 'btn btn-sm btn-default',
                    style: { float: 'right', margin: '0.3em 0.5em' } },
                React.createElement('i', { className: 'fa fa-lock' }),
                this.props.period.locked ? 'Unlock period' : 'Lock period'
            );
        }
    }], [{
        key: 'basePeriodSave',
        value: function basePeriodSave(periodId, data, callback) {
            // Base function for saving a period with a data Object.
            var url = endpointURL(periodId).period_framework;
            var success = function (response) {
                var period = response;
                var indicatorId = period.indicator;
                this.props.savePeriodToIndicator(period, indicatorId);

                // Call the callback, if not undefined.
                if (callback !== undefined) {
                    callback();
                }
            }.bind(this);
            apiCall('PATCH', url, JSON.stringify(data), success);
        }
    }]);

    return PeriodLockToggle;
}(React.Component);

var Periods = function (_Level3) {
    _inherits(Periods, _Level3);

    function Periods(props) {
        _classCallCheck(this, Periods);

        var _this6 = _possibleConstructorReturn(this, (Periods.__proto__ || Object.getPrototypeOf(Periods)).call(this, props));

        _this6.state = { model: "periods" };
        return _this6;
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
            var header = React.createElement(
                'span',
                null,
                React.createElement(
                    'span',
                    null,
                    'Period: ',
                    periodDate
                ),
                React.createElement(PeriodLockToggle, { period: period })
            );
            return React.createElement(
                Panel,
                { header: header, key: i },
                React.createElement(Updates, { items: period.updates,
                    models: this.props.models,
                    callbacks: this.props.callbacks })
            );
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('updates');
        }
    }]);

    return Periods;
}(Level);

var Indicators = function (_Level4) {
    _inherits(Indicators, _Level4);

    function Indicators(props) {
        _classCallCheck(this, Indicators);

        var _this7 = _possibleConstructorReturn(this, (Indicators.__proto__ || Object.getPrototypeOf(Indicators)).call(this, props));

        _this7.state = { model: "indicators" };
        return _this7;
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
                React.createElement(Periods, { items: indicator.periods,
                    models: this.props.models,
                    callbacks: this.props.callbacks })
            );
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('periods');
        }
    }]);

    return Indicators;
}(Level);

var Results = function (_Level5) {
    _inherits(Results, _Level5);

    function Results(props) {
        _classCallCheck(this, Results);

        var _this8 = _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).call(this, props));

        _this8.state = { model: "results" };
        return _this8;
    }

    _createClass(Results, [{
        key: 'renderPanel',
        value: function renderPanel(result, i) {
            return React.createElement(
                Panel,
                { header: "Result: " + result.title, key: i },
                React.createElement(Indicators, {
                    items: result.indicators,
                    models: this.props.models,
                    callbacks: this.props.callbacks })
            );
        }
    }]);

    return Results;
}(Level);

var App = function (_React$Component3) {
    _inherits(App, _React$Component3);

    function App(props) {
        _classCallCheck(this, App);

        var _this9 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        _this9.state = {
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
        return _this9;
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
                    "results": host + '/rest/v1/result/?format=json&project=' + id,
                    "indicators": host + '/rest/v1/indicator/?format=json&result__project=' + id,
                    "periods": host + '/rest/v1/indicator_period/?format=json&indicator__result__project=' + id,
                    "updates": host + '/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=' + id,
                    "comments": host + '/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=' + id,
                    "period_framework": host + '/rest/v1/indicator_period_framework/' + id + '/?format=json',
                    "update_and_comments": host + '/rest/v1/indicator_period_data_framework/' + id + '/?format=json',
                    "updates_and_comments": host + '/rest/v1/indicator_period_data_framework/?format=json',
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
            this.loadModel('results');
            this.loadModel('indicators');
            // this.loadResults();
            // this.loadIndicators();
            // this.loadPeriods(projectId);
            // this.loadUpdatesAndComments(projectId);
        }
    }, {
        key: 'loadModel',
        value: function loadModel(model) {
            // Load the results through the API
            if (this.state.models[model] === undefined) {
                var success = function (response) {
                    var indexedModel = 'indexed' + titleCase(model);
                    this.setState(
                    // NOTE the coincidence that the "container field" in the API is named results :-p
                    _defineProperty({
                        models: update(this.state.models, { $merge: _defineProperty({}, model, response.results) })
                    }, indexedModel, this.indexModel(response.results)), function () {
                        this.setState({ resultsDataTree: this.assembleDataTree() });
                    });
                }.bind(this);
                apiCall('GET', endpointURL(this.state.projectId)[model], '', success);
            }
        }
    }, {
        key: 'updateModel',
        value: function updateModel(model, data) {}

        // loadResults() {
        //     // Load the results through the API
        //     if (Object.keys(this.state.results).length === 0) {
        //         let success = function(response) {
        //             // NOTE the coincidence that the "container field" in the API is named results :-p
        //             this.setState(
        //                 {results: this.indexModel(response.results)},
        //                 function() {
        //                     this.setState({resultsDataTree: this.assembleDataTree()});
        //                 })}.bind(this);
        //         apiCall('GET', endpointURL(this.state.projectId).results_of_project, '', success);
        //     }
        // }
        //
        // loadIndicators() {
        //     // Load the indicators through the API
        //     if (Object.keys(this.state.indicators).length === 0) {
        //         let success = function(response) {
        //             this.setState(
        //                 {indicators: this.indexModel(response.results)},
        //                 function() {
        //                     this.setState({resultsDataTree: this.assembleDataTree()});
        //                 }
        //             )
        //         }.bind(this);
        //         apiCall('GET', endpointURL(this.state.projectId).indicators_of_project, '', success);
        //     }
        // }
        //
        // loadPeriods() {
        //     // Load the periods through the API
        //     if (Object.keys(this.state.periods).length === 0) {
        //         let success = function(response) {
        //             this.setState(
        //                 {periods: this.indexModel(response.results)},
        //                 function() {
        //                     this.setState({resultsDataTree: this.assembleDataTree()});
        //                 }
        //             )
        //         }.bind(this);
        //         apiCall('GET', endpointURL(this.state.projectId).periods_of_project, '', success);
        //     }
        // }
        //
        // loadUpdatesAndComments() {
        //     // Load the period data and comment
        //     if (Object.keys(this.state.updates).length === 0) {
        //         let success = function(response) {
        //             this.setState(
        //                 {updates: this.indexModel(response.results)},
        //                 function() {
        //                     this.setState({resultsDataTree: this.assembleDataTree()});
        //                 }
        //             );
        //         }.bind(this);
        //         apiCall(
        //             'GET', endpointURL(this.state.projectId).updates_and_comments_of_project, '', success
        //         );
        //     }
        // }

    }, {
        key: 'indexModel',
        value: function indexModel(data) {
            return data.reduce(function (acc, obj) {
                var id = obj['id'];
                var indexedObj = {};
                indexedObj[id] = obj;
                return Object.assign(acc, indexedObj);
            }, {});
        }
    }, {
        key: 'assembleDataTree',
        value: function assembleDataTree() {
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
                    return parents.map(function (parent) {
                        if (children !== undefined) {
                            parent[field_names.children] = children.filter(function (child) {
                                return child[field_names.parent] === parent.id;
                            });
                        }
                        return parent;
                    });
                } else {
                    return undefined;
                }
            }

            var models = this.state.models;
            var updates = filterChildren(models.updates, { parent: "data", children: "comments" }, models.comments);
            var periods = filterChildren(models.periods, { parent: "period", children: "updates" }, updates);
            var indicators = filterChildren(models.indicators, { parent: "indicator", children: "periods" }, periods);
            var results = filterChildren(models.results, { parent: "result", children: "indicators" }, indicators);
            return results;

            // if (models.results !== undefined) {
            //     return models.results.map(
            //         // add field "indicators"
            //         function(result) {
            //             if (models.indicators !== undefined) {
            //                 result.indicators = models.indicators
            //                 // for each indicator
            //                     .map(
            //                         function (indicator) {
            //                            if (models.periods !== undefined) {
            //                                // add field "periods"
            //                                indicator.periods = models.periods
            //                                // for each period
            //                                    .map(
            //                                        function (period) {
            //                                            // add field "updates"
            //                                            if (models.updates !== undefined) {
            //                                                period.updates = models.updates
            //                                                // populate period.updates filtered on period ID
            //                                                    .filter(update => update.period === period.id);
            //                                                return period;
            //                                            }
            //                                        }.bind(this))
            //                                    // populate indicator.periods filtered on indicator ID
            //                                    .filter(period => period.indicator === indicator.id);
            //                                return indicator;
            //                            }
            //                         }.bind(this))
            //                     // populate result.indicators filtered on result ID
            //                     .filter(indicator => indicator.result === result.id);
            //                 return result;
            //             }
            //         }.bind(this)
            //     );
            // }
        }
    }, {
        key: 'render',
        value: function render() {
            var tree = this.state.resultsDataTree;
            var callbacks = {
                loadModel: this.loadModel.bind(this)
            };
            if (this.state.models.results === undefined) {
                return React.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            } else if (tree.length > 0) {
                return React.createElement(Results, { items: tree, callbacks: callbacks, models: this.state.models });
            } else {
                return React.createElement(
                    'p',
                    null,
                    'No items'
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

},{"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLElBQU0sUUFBUSxRQUFRLE9BQVIsQ0FBZDtBQUNBLElBQU0sV0FBVyxRQUFRLFdBQVIsQ0FBakI7QUFDQSxJQUFNLFNBQVMsUUFBUSxxQkFBUixDQUFmO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sUUFBUSxTQUFTLEtBQXZCOztBQUVBLElBQUksa0JBQUo7QUFBQSxJQUNJLG9CQURKO0FBQUEsSUFFSSxpQkFGSjtBQUFBLElBR0kscUJBSEo7QUFBQSxJQUlJLG9CQUpKO0FBQUEsSUFLSSxtQkFMSjtBQUFBLElBTUksbUJBTko7QUFBQSxJQU9JLGFBUEo7O0FBU0E7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsT0FBTyxNQUFQLElBQWtCO0FBQUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLENBQXFCO0FBQUEsZUFBTyxJQUFJLEdBQUosQ0FBUDtBQUFBLEtBQXJCLENBQVA7QUFBQSxDQUFsQzs7QUFFQTtBQUNBLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUNyQixRQUFJLGNBQWMsSUFBbEI7QUFDQSxRQUFJLFNBQVMsTUFBVCxJQUFtQixTQUFTLE1BQVQsS0FBb0IsRUFBM0MsRUFBK0M7QUFDM0MsWUFBSSxVQUFVLFNBQVMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUFkO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsTUFBNUIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDckMsZ0JBQUksU0FBUyxRQUFRLENBQVIsRUFBVyxJQUFYLEVBQWI7QUFDQSxnQkFBSSxPQUFPLFNBQVAs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QSxlQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUFyRTtBQUNBLGtCQUFjLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkMsU0FBeEQsQ0FBZDtBQUNBLGlCQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixZQUF4QixFQUFzQyxTQUFqRCxDQUFiO0FBQ0EsaUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQWxELENBQWI7O0FBRUEsYUFBUyxNQUFULENBQWdCLG9CQUFDLEdBQUQsT0FBaEIsRUFBd0IsU0FBUyxjQUFULENBQXdCLHVCQUF4QixDQUF4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbi8vIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4vLyBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbi8vIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbmNvbnN0IFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5jb25zdCB1cGRhdGUgPSByZXF1aXJlKCdpbW11dGFiaWxpdHktaGVscGVyJyk7XG5jb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJ3JjLWNvbGxhcHNlJyk7XG5jb25zdCBQYW5lbCA9IENvbGxhcHNlLlBhbmVsO1xuXG5sZXQgY3NyZnRva2VuLFxuICAgIGkxOG5SZXN1bHRzLFxuICAgIGlzUHVibGljLFxuICAgIGVuZHBvaW50RGF0YSxcbiAgICBlbmRwb2ludFVSTCxcbiAgICBpMThuTW9udGhzLFxuICAgIHByb2plY3RJZHMsXG4gICAgdXNlcjtcblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczMDY2NjkvXG5PYmplY3QudmFsdWVzID0gT2JqZWN0LnZhbHVlcyB8fCAob2JqID0+IE9iamVjdC5rZXlzKG9iaikubWFwKGtleSA9PiBvYmpba2V5XSkpO1xuXG4vKiBDU1JGIFRPS0VOICh0aGlzIHNob3VsZCByZWFsbHkgYmUgYWRkZWQgaW4gYmFzZS5odG1sLCB3ZSB1c2UgaXQgZXZlcnl3aGVyZSkgKi9cbmZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuY3NyZnRva2VuID0gZ2V0Q29va2llKCdjc3JmdG9rZW4nKTtcblxuLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggYSBwcm9wZXIgbGlicmFyeSBmb3IgYmFja2VuZCBjYWxsc1xuZnVuY3Rpb24gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgdmFyIHhtbEh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbWF4UmV0cmllcyA9IDU7XG5cbiAgICB4bWxIdHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeG1sSHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhtbEh0dHAucmVzcG9uc2VUZXh0ICE9PSAnJyA/IEpTT04ucGFyc2UoeG1sSHR0cC5yZXNwb25zZVRleHQpIDogJyc7XG4gICAgICAgICAgICBpZiAoeG1sSHR0cC5zdGF0dXMgPj0gMjAwICYmIHhtbEh0dHAuc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ0dFVCcgJiYgcmVzcG9uc2UubmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5uZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uKG5ld1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFJlc3VsdHMgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdHMgPSBvbGRSZXN1bHRzLmNvbmNhdChuZXdSZXNwb25zZS5yZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlDYWxsKG1ldGhvZCwgcmVzcG9uc2UubmV4dCwgZGF0YSwgc3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBpMThuUmVzdWx0cy5nZW5lcmFsX2Vycm9yICsgJzogJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlICs9IHJlc3BvbnNlW2tleV0gKyAnLiAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3dHZW5lcmFsRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhtbEh0dHAub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHJldHJpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgMik7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0cmllcyA8PSBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCByZXRyaWVzICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaG93R2VuZXJhbEVycm9yKGkxOG5SZXN1bHRzLmNvbm5lY3Rpb25fZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhtbEh0dHAub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgeG1sSHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1DU1JGVG9rZW5cIiwgY3NyZnRva2VuKTtcbiAgICB4bWxIdHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgeG1sSHR0cC5zZW5kKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRGF0YShpZCkge1xuICAgIC8vIEdldCB0aGUgdXNlciBkYXRhIGZyb20gdGhlIEFQSSBhbmQgc3RvcmVzIGl0IGluIHRoZSBnbG9iYWwgdXNlciB2YXJpYWJsZVxuICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlO1xuICAgICAgICAvLyB1c2VySXNBZG1pbigpO1xuICAgIH07XG4gICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwoaWQpLnVzZXIsICcnLCBzdWNjZXNzKTtcbn1cblxuZnVuY3Rpb24gdGl0bGVDYXNlKHMpIHtcbiAgICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG59XG5cbmNsYXNzIExldmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubW9kZWxzW3RoaXMuc3RhdGUubW9kZWxdID09PSB1bmRlZmluZWQgfHwgaXRlbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtLCBpKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5jbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBVcGRhdGVzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJ1cGRhdGVzXCJ9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdjb21tZW50cycpO1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHVwZGF0ZSwgaSkge1xuICAgICAgICBjb25zdCBvcmdhbmlzYXRpb24gPSB1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZTtcbiAgICAgICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgK1wiIFwiKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHVwZGF0ZS5kYXRhO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBkYXRhOiAke2RhdGF9YDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlclRleHR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj57dXBkYXRlLmRhdGF9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRVUkwocGVyaW9kSWQpLnBlcmlvZF9mcmFtZXdvcms7XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmlvZCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgY29uc3QgaW5kaWNhdG9ySWQgPSBwZXJpb2QuaW5kaWNhdG9yO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zYXZlUGVyaW9kVG9JbmRpY2F0b3IocGVyaW9kLCBpbmRpY2F0b3JJZCk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoJ1BBVENIJywgdXJsLCBKU09OLnN0cmluZ2lmeShkYXRhKSwgc3VjY2Vzcyk7XG4gICAgfVxuXG4gICAgbG9ja1RvZ2dsZShlKSB7XG4gICAgICAgIFBlcmlvZExvY2tUb2dnbGUuYmFzZVBlcmlvZFNhdmUoXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9KTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPXsnZmEgZmEtbG9jayd9Lz5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMucGVyaW9kLmxvY2tlZCA/ICdVbmxvY2sgcGVyaW9kJyA6ICdMb2NrIHBlcmlvZCd9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicGVyaW9kc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChwZXJpb2QsIGkpIHtcbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgICAgICAgICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICAgICAgICAgIGlmIChkYXRlU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgZGF0ZVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZy5zcGxpdChcIi5cIilbMF0ucmVwbGFjZShcIi9cIiwgLy0vZykpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTE4blJlc3VsdHMudW5rbm93bl9kYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQpICsgJyAtICcgKyBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCk7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPlBlcmlvZDoge3BlcmlvZERhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXMgaXRlbXM9e3BlcmlvZC51cGRhdGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV92YWx1ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJyZXN1bHRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHJlc3VsdCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJSZXN1bHQ6IFwiICsgcmVzdWx0LnRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkcy5wcm9qZWN0X2lkXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIHNldCB1cCBjYWxsYmFjayBVUkwgdGVtcGxhdGVzXG4gICAgICAgIGVuZHBvaW50RGF0YSA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZHBvaW50LWRhdGEnKS5pbm5lckhUTUwpO1xuICAgICAgICBlbmRwb2ludFVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGNhbGxiYWNrIFVSTHMsIGluY2x1ZGluZyBvcHRpb25hbCBJRFxuICAgICAgICAgICAgLy8gVXNhZ2U6IGVuZHBvaW50VVJMKDE3KS5yZXN1bHQgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG4gICAgICAgICAgICBjb25zdCBob3N0ID0gXCJodHRwOi8vXCIgKyBlbmRwb2ludERhdGEuaG9zdDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInJlc3VsdHNcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiaW5kaWNhdG9yc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvci8/Zm9ybWF0PWpzb24mcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImNvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2NvbW1lbnQvP2Zvcm1hdD1qc29uJmRhdGFfX3BlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwicGVyaW9kX2ZyYW1ld29ya1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1c2VyXCI6IGAke2hvc3R9L3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwicGFydG5lcnNoaXBzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiZmlsZV91cGxvYWRcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNQdWJsaWMpIHtcbiAgICAgICAgICAgIGdldFVzZXJEYXRhKGVuZHBvaW50RGF0YS51c2VySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbCgncmVzdWx0cycpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnaW5kaWNhdG9ycycpO1xuICAgICAgICAvLyB0aGlzLmxvYWRSZXN1bHRzKCk7XG4gICAgICAgIC8vIHRoaXMubG9hZEluZGljYXRvcnMoKTtcbiAgICAgICAgLy8gdGhpcy5sb2FkUGVyaW9kcyhwcm9qZWN0SWQpO1xuICAgICAgICAvLyB0aGlzLmxvYWRVcGRhdGVzQW5kQ29tbWVudHMocHJvamVjdElkKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXhlZE1vZGVsID0gYGluZGV4ZWQke3RpdGxlQ2FzZShtb2RlbCl9YDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFIHRoZSBjb2luY2lkZW5jZSB0aGF0IHRoZSBcImNvbnRhaW5lciBmaWVsZFwiIGluIHRoZSBBUEkgaXMgbmFtZWQgcmVzdWx0cyA6LXBcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzOiB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHskbWVyZ2U6IHtbbW9kZWxdOiByZXNwb25zZS5yZXN1bHRzfX0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgW2luZGV4ZWRNb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGFwaUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHRoaXMuc3RhdGUucHJvamVjdElkKVttb2RlbF0sICcnLCBzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKG1vZGVsLCBkYXRhKSB7XG5cbiAgICB9XG5cbiAgICAvLyBsb2FkUmVzdWx0cygpIHtcbiAgICAvLyAgICAgLy8gTG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAvLyAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGUucmVzdWx0cykubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICAgICAgLy8gTk9URSB0aGUgY29pbmNpZGVuY2UgdGhhdCB0aGUgXCJjb250YWluZXIgZmllbGRcIiBpbiB0aGUgQVBJIGlzIG5hbWVkIHJlc3VsdHMgOi1wXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAvLyAgICAgICAgICAgICAgICAge3Jlc3VsdHM6IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgIC8vICAgICAgICAgICAgICAgICB9KX0uYmluZCh0aGlzKTtcbiAgICAvLyAgICAgICAgIGFwaUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHRoaXMuc3RhdGUucHJvamVjdElkKS5yZXN1bHRzX29mX3Byb2plY3QsICcnLCBzdWNjZXNzKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIGxvYWRJbmRpY2F0b3JzKCkge1xuICAgIC8vICAgICAvLyBMb2FkIHRoZSBpbmRpY2F0b3JzIHRocm91Z2ggdGhlIEFQSVxuICAgIC8vICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zdGF0ZS5pbmRpY2F0b3JzKS5sZW5ndGggPT09IDApIHtcbiAgICAvLyAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgIC8vICAgICAgICAgICAgICAgICB7aW5kaWNhdG9yczogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfSxcbiAgICAvLyAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICApXG4gICAgLy8gICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgLy8gICAgICAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludFVSTCh0aGlzLnN0YXRlLnByb2plY3RJZCkuaW5kaWNhdG9yc19vZl9wcm9qZWN0LCAnJywgc3VjY2Vzcyk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBsb2FkUGVyaW9kcygpIHtcbiAgICAvLyAgICAgLy8gTG9hZCB0aGUgcGVyaW9kcyB0aHJvdWdoIHRoZSBBUElcbiAgICAvLyAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGUucGVyaW9kcykubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAvLyAgICAgICAgICAgICAgICAge3BlcmlvZHM6IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgKVxuICAgIC8vICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIC8vICAgICAgICAgYXBpQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwodGhpcy5zdGF0ZS5wcm9qZWN0SWQpLnBlcmlvZHNfb2ZfcHJvamVjdCwgJycsIHN1Y2Nlc3MpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gbG9hZFVwZGF0ZXNBbmRDb21tZW50cygpIHtcbiAgICAvLyAgICAgLy8gTG9hZCB0aGUgcGVyaW9kIGRhdGEgYW5kIGNvbW1lbnRcbiAgICAvLyAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGUudXBkYXRlcykubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAvLyAgICAgICAgICAgICAgICAge3VwZGF0ZXM6IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAvLyAgICAgICAgIGFwaUNhbGwoXG4gICAgLy8gICAgICAgICAgICAgJ0dFVCcsIGVuZHBvaW50VVJMKHRoaXMuc3RhdGUucHJvamVjdElkKS51cGRhdGVzX2FuZF9jb21tZW50c19vZl9wcm9qZWN0LCAnJywgc3VjY2Vzc1xuICAgIC8vICAgICAgICAgKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cblxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYSBsaXN0IG9mIGluZGljYXRvciBwZXJpb2RcbiAgICAgICAgZGF0YSBvYmplY3RzIGluIHRoZSBmaWVsZCBcInVwZGF0ZXNcIi5cbiAgICAgICAgTm90ZSB0aGF0IHRoZSBcImxvd2VzdFwiIGxldmVsIGluIHRoZSBjYWxsIGNoYWluLCBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKCksIHJldHJpZXZlcyBib3RoXG4gICAgICAgIGluZGljYXRvciBwZXJpb2QgZGF0YSAoXCJ1cGRhdGVzXCIpIGFuZCBjb21tZW50cyBuaWNlbHkgc2ltaWxhcmx5IHRvIHRoZSByZXN0IG9mIHRoZSBkYXRhLlxuICAgICAgICBBbGwgcmVsYXRpb25zIGJhc2VkIG9uIHRoZSByZWxldmFudCBmb3JlaWduIGtleXMgbGlua2luZyB0aGUgbW9kZWwgb2JqZWN0cy5cbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGRfbmFtZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMubWFwKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZF9uYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkX25hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuc3RhdGUubW9kZWxzO1xuICAgICAgICBjb25zdCB1cGRhdGVzID0gZmlsdGVyQ2hpbGRyZW4obW9kZWxzLnVwZGF0ZXMsIHtwYXJlbnQ6IFwiZGF0YVwiLCBjaGlsZHJlbjogXCJjb21tZW50c1wifSwgbW9kZWxzLmNvbW1lbnRzKTtcbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKG1vZGVscy5wZXJpb2RzLCB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LCB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKG1vZGVscy5pbmRpY2F0b3JzLCB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LCAgcGVyaW9kcyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBmaWx0ZXJDaGlsZHJlbihtb2RlbHMucmVzdWx0cywge3BhcmVudDogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFwiaW5kaWNhdG9yc1wifSwgaW5kaWNhdG9ycyk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuXG4gICAgICAgIC8vIGlmIChtb2RlbHMucmVzdWx0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gbW9kZWxzLnJlc3VsdHMubWFwKFxuICAgICAgICAvLyAgICAgICAgIC8vIGFkZCBmaWVsZCBcImluZGljYXRvcnNcIlxuICAgICAgICAvLyAgICAgICAgIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAvLyAgICAgICAgICAgICBpZiAobW9kZWxzLmluZGljYXRvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmVzdWx0LmluZGljYXRvcnMgPSBtb2RlbHMuaW5kaWNhdG9yc1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggaW5kaWNhdG9yXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGluZGljYXRvcikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWxzLnBlcmlvZHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGZpZWxkIFwicGVyaW9kc1wiXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2F0b3IucGVyaW9kcyA9IG1vZGVscy5wZXJpb2RzXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBwZXJpb2RcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGVyaW9kKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgZmllbGQgXCJ1cGRhdGVzXCJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbHMudXBkYXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBtb2RlbHMudXBkYXRlc1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBvcHVsYXRlIHBlcmlvZC51cGRhdGVzIGZpbHRlcmVkIG9uIHBlcmlvZCBJRFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHVwZGF0ZSA9PiB1cGRhdGUucGVyaW9kID09PSBwZXJpb2QuaWQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb3B1bGF0ZSBpbmRpY2F0b3IucGVyaW9kcyBmaWx0ZXJlZCBvbiBpbmRpY2F0b3IgSURcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHBlcmlvZCA9PiBwZXJpb2QuaW5kaWNhdG9yID09PSBpbmRpY2F0b3IuaWQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluZGljYXRvcjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gcG9wdWxhdGUgcmVzdWx0LmluZGljYXRvcnMgZmlsdGVyZWQgb24gcmVzdWx0IElEXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpbmRpY2F0b3IgPT4gaW5kaWNhdG9yLnJlc3VsdCA9PT0gcmVzdWx0LmlkKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgLy8gICAgICk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGVscy5yZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzIGl0ZW1zPXt0cmVlfSBjYWxsYmFja3M9e2NhbGxiYWNrc30gbW9kZWxzPXt0aGlzLnN0YXRlLm1vZGVsc30vPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gUmV0cmlldmUgZGF0YSBlbmRwb2ludHMsIHRyYW5zbGF0aW9ucyBhbmQgcHJvamVjdCBJRHNcbiAgICBpc1B1YmxpYyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzJykuaW5uZXJIVE1MKS5wdWJsaWM7XG4gICAgaTE4blJlc3VsdHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgaTE4bk1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoPEFwcC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJlc3VsdHMtZnJhbWV3b3JrJykpO1xuXG4gICAgLy8gQ2hlY2sgaWYgUmVhY3QgaXMgbG9hZGVkXG4gICAgLy8gaWYgKHR5cGVvZiBSZWFjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFJlYWN0RE9NICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc21vb3RoU2Nyb2xsICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vICAgICBzbW9vdGhTY3JvbGwuaW5pdCh7dXBkYXRlVVJMOiBmYWxzZX0pO1xuICAgIC8vICAgICBpbml0UmVhY3QoKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICBsb2FkQW5kUmVuZGVyUmVhY3QoKTtcbiAgICAvLyB9XG59KTsiXX0=
