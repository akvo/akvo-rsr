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
        _this5.state = { locking: false };
        return _this5;
    }

    _createClass(PeriodLockToggle, [{
        key: 'basePeriodSave',
        value: function basePeriodSave(periodId, data, callback) {
            // Base function for saving a period with a data Object.
            var url = endpointURL(periodId).period_framework;
            var success = function (response) {
                this.props.callbacks.updateModel("periods", response);

                // Call the callback, if not undefined.
                if (callback !== undefined) {
                    callback();
                }
            }.bind(this);
            apiCall('PATCH', url, JSON.stringify(data), success);
        }
    }, {
        key: 'lockingToggle',
        value: function lockingToggle(locking) {
            this.setState({ locking: locking });
        }
    }, {
        key: 'notLocking',
        value: function notLocking() {
            this.lockingToggle(false);
        }
    }, {
        key: 'lockToggle',
        value: function lockToggle(e) {
            if (!this.state.locking) {
                this.lockingToggle(true);
                this.basePeriodSave(this.props.period.id, { locked: !this.props.period.locked }, this.notLocking.bind(this));
            }
            e.stopPropagation();
        }
    }, {
        key: 'render',
        value: function render() {
            var icon = void 0,
                label = void 0;
            if (this.state.locking) {
                icon = React.createElement('i', { className: 'fa fa-spin fa-spinner' });
                label = "Loading";
            } else if (this.props.period.locked) {
                icon = React.createElement('i', { className: 'fa fa-lock' });
                label = "Unlock period";
            } else {
                icon = React.createElement('i', { className: 'fa fa-unlock-alt' });
                label = "Lock period";
            }
            return React.createElement(
                'a',
                { onClick: this.lockToggle,
                    className: 'btn btn-sm btn-default',
                    style: { float: 'right', margin: '0.3em 0.5em' } },
                icon,
                label
            );
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
                React.createElement(PeriodLockToggle, { period: period, callbacks: this.props.callbacks })
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
        }
    }, {
        key: 'loadModel',
        value: function loadModel(model) {
            // Load a model from the API
            if (this.state.models[model] === undefined) {
                var success = function (response) {
                    this.setState({ models: update(this.state.models, { $merge: _defineProperty({}, model, this.indexModel(response.results)) }) }, function () {
                        this.setState({ resultsDataTree: this.assembleDataTree() });
                    });
                }.bind(this);
                apiCall('GET', endpointURL(this.state.projectId)[model], '', success);
            }
        }
    }, {
        key: 'updateModel',
        value: function updateModel(model, data) {
            var id = data.id;
            this.setState({ models: update(this.state.models, { $merge: _defineProperty({}, model, _defineProperty({}, id, data)) }) }, function () {
                this.setState({ resultsDataTree: this.assembleDataTree() });
            });
        }
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
            var updates = filterChildren(deIndex(models.updates), { parent: "data", children: "comments" }, deIndex(models.comments));
            var periods = filterChildren(deIndex(models.periods), { parent: "period", children: "updates" }, updates);
            var indicators = filterChildren(deIndex(models.indicators), { parent: "indicator", children: "periods" }, periods);
            var results = filterChildren(deIndex(models.results), { parent: "result", children: "indicators" }, indicators);
            return results;
        }
    }, {
        key: 'render',
        value: function render() {
            var tree = this.state.resultsDataTree;
            var callbacks = {
                loadModel: this.loadModel.bind(this),
                updateModel: this.updateModel.bind(this)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLElBQU0sUUFBUSxRQUFRLE9BQVIsQ0FBZDtBQUNBLElBQU0sV0FBVyxRQUFRLFdBQVIsQ0FBakI7QUFDQSxJQUFNLFNBQVMsUUFBUSxxQkFBUixDQUFmO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sUUFBUSxTQUFTLEtBQXZCOztBQUVBLElBQUksa0JBQUo7QUFBQSxJQUNJLG9CQURKO0FBQUEsSUFFSSxpQkFGSjtBQUFBLElBR0kscUJBSEo7QUFBQSxJQUlJLG9CQUpKO0FBQUEsSUFLSSxtQkFMSjtBQUFBLElBTUksbUJBTko7QUFBQSxJQU9JLGFBUEo7O0FBU0E7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsT0FBTyxNQUFQLElBQWtCO0FBQUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLENBQXFCO0FBQUEsZUFBTyxJQUFJLEdBQUosQ0FBUDtBQUFBLEtBQXJCLENBQVA7QUFBQSxDQUFsQzs7QUFFQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDbEIsUUFBSSxRQUFRLFNBQVosRUFBdUI7QUFDbkIsZUFBTyxPQUFPLE1BQVAsQ0FBYyxHQUFkLENBQVA7QUFDSDtBQUNELFdBQU8sU0FBUDtBQUNIOztBQUVEO0FBQ0EsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3JCLFFBQUksY0FBYyxJQUFsQjtBQUNBLFFBQUksU0FBUyxNQUFULElBQW1CLFNBQVMsTUFBVCxLQUFvQixFQUEzQyxFQUErQztBQUMzQyxZQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxh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QUFXLE1BQVgsQ0FBa0IsT0FBbEIsS0FBOEIsU0FBbEMsRUFBNkM7QUFDekMsdUJBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFESjtBQUdILGFBSkQsTUFJTyxJQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ3hCLHVCQUNJLG9CQUFDLE9BQUQsSUFBUyxPQUFPLElBQWhCLEVBQXNCLFdBQVcsU0FBakMsRUFBNEMsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUEvRCxHQURKO0FBR0gsYUFKTSxNQUlBO0FBQ0gsdUJBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFESjtBQUdIO0FBQ0o7Ozs7RUFuS2EsTUFBTSxTOztBQXlLeEIsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBVztBQUNyRDtBQUNBLGVBQVcsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQS9DLEVBQTBELE1BQXJFO0FBQ0Esa0JBQWMsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLG1CQUF4QixFQUE2QyxTQUF4RCxDQUFkO0FBQ0EsaUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLFNBQWpELENBQWI7QUFDQSxpQkFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBbEQsQ0FBYjs7QUFFQSxhQUFTLE1BQVQsQ0FBZ0Isb0JBQUMsR0FBRCxPQUFoQixFQUF3QixTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuLy8gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbi8vIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuLy8gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cblxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuY29uc3QgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbmNvbnN0IHVwZGF0ZSA9IHJlcXVpcmUoJ2ltbXV0YWJpbGl0eS1oZWxwZXInKTtcbmNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgncmMtY29sbGFwc2UnKTtcbmNvbnN0IFBhbmVsID0gQ29sbGFwc2UuUGFuZWw7XG5cbmxldCBjc3JmdG9rZW4sXG4gICAgaTE4blJlc3VsdHMsXG4gICAgaXNQdWJsaWMsXG4gICAgZW5kcG9pbnREYXRhLFxuICAgIGVuZHBvaW50VVJMLFxuICAgIGkxOG5Nb250aHMsXG4gICAgcHJvamVjdElkcyxcbiAgICB1c2VyO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cbmZ1bmN0aW9uIGRlSW5kZXgob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qIENTUkYgVE9LRU4gKHRoaXMgc2hvdWxkIHJlYWxseSBiZSBhZGRlZCBpbiBiYXNlLmh0bWwsIHdlIHVzZSBpdCBldmVyeXdoZXJlKSAqL1xuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBjb29raWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT0gKG5hbWUgKyAnPScpKSB7XG4gICAgICAgICAgICAgICAgY29va2llVmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQoY29va2llLnN1YnN0cmluZyhuYW1lLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29va2llVmFsdWU7XG59XG5jc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuXG4vLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBhIHByb3BlciBsaWJyYXJ5IGZvciBiYWNrZW5kIGNhbGxzXG5mdW5jdGlvbiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICB2YXIgeG1sSHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBtYXhSZXRyaWVzID0gNTtcblxuICAgIHhtbEh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4bWxIdHRwLnJlYWR5U3RhdGUgPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geG1sSHR0cC5yZXNwb25zZVRleHQgIT09ICcnID8gSlNPTi5wYXJzZSh4bWxIdHRwLnJlc3BvbnNlVGV4dCkgOiAnJztcbiAgICAgICAgICAgIGlmICh4bWxIdHRwLnN0YXR1cyA+PSAyMDAgJiYgeG1sSHR0cC5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSAnR0VUJyAmJiByZXNwb25zZS5uZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm5leHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24obmV3UmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkUmVzdWx0cyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0cyA9IG9sZFJlc3VsdHMuY29uY2F0KG5ld1Jlc3BvbnNlLnJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUNhbGwobWV0aG9kLCByZXNwb25zZS5uZXh0LCBkYXRhLCBzdWNjZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGkxOG5SZXN1bHRzLmdlbmVyYWxfZXJyb3IgKyAnOiAnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gcmVzcG9uc2Vba2V5XSArICcuICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvd0dlbmVyYWxFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeG1sSHR0cC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAocmV0cmllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBpQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCAyKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXRyaWVzIDw9IG1heFJldHJpZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIHJldHJpZXMgKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNob3dHZW5lcmFsRXJyb3IoaTE4blJlc3VsdHMuY29ubmVjdGlvbl9lcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeG1sSHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICB4bWxIdHRwLnNldFJlcXVlc3RIZWFkZXIoXCJYLUNTUkZUb2tlblwiLCBjc3JmdG9rZW4pO1xuICAgIHhtbEh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiKTtcbiAgICB4bWxIdHRwLnNlbmQoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJEYXRhKGlkKSB7XG4gICAgLy8gR2V0IHRoZSB1c2VyIGRhdGEgZnJvbSB0aGUgQVBJIGFuZCBzdG9yZXMgaXQgaW4gdGhlIGdsb2JhbCB1c2VyIHZhcmlhYmxlXG4gICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB1c2VyID0gcmVzcG9uc2U7XG4gICAgICAgIC8vIHVzZXJJc0FkbWluKCk7XG4gICAgfTtcbiAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludFVSTChpZCkudXNlciwgJycsIHN1Y2Nlc3MpO1xufVxuXG5mdW5jdGlvbiB0aXRsZUNhc2Uocykge1xuICAgIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbn1cblxuY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tb2RlbHNbdGhpcy5zdGF0ZS5tb2RlbF0gPT09IHVuZGVmaW5lZCB8fCBpdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8ZGl2Pnt1cGRhdGUuZGF0YX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBQZXJpb2RMb2NrVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmxvY2tUb2dnbGUgPSB0aGlzLmxvY2tUb2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtsb2NraW5nOiBmYWxzZX07XG4gICAgfVxuXG4gICAgYmFzZVBlcmlvZFNhdmUocGVyaW9kSWQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEJhc2UgZnVuY3Rpb24gZm9yIHNhdmluZyBhIHBlcmlvZCB3aXRoIGEgZGF0YSBPYmplY3QuXG4gICAgICAgIGNvbnN0IHVybCA9IGVuZHBvaW50VVJMKHBlcmlvZElkKS5wZXJpb2RfZnJhbWV3b3JrO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwicGVyaW9kc1wiLCByZXNwb25zZSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGFwaUNhbGwoJ1BBVENIJywgdXJsLCBKU09OLnN0cmluZ2lmeShkYXRhKSwgc3VjY2Vzcyk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicGVyaW9kc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChwZXJpb2QsIGkpIHtcbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgICAgICAgICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICAgICAgICAgIGlmIChkYXRlU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgZGF0ZVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZy5zcGxpdChcIi5cIilbMF0ucmVwbGFjZShcIi9cIiwgLy0vZykpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTE4blJlc3VsdHMudW5rbm93bl9kYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQpICsgJyAtICcgKyBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCk7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPlBlcmlvZDoge3BlcmlvZERhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXMgaXRlbXM9e3BlcmlvZC51cGRhdGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV92YWx1ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJyZXN1bHRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHJlc3VsdCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJSZXN1bHQ6IFwiICsgcmVzdWx0LnRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkcy5wcm9qZWN0X2lkXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIHNldCB1cCBjYWxsYmFjayBVUkwgdGVtcGxhdGVzXG4gICAgICAgIGVuZHBvaW50RGF0YSA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZHBvaW50LWRhdGEnKS5pbm5lckhUTUwpO1xuICAgICAgICBlbmRwb2ludFVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGNhbGxiYWNrIFVSTHMsIGluY2x1ZGluZyBvcHRpb25hbCBJRFxuICAgICAgICAgICAgLy8gVXNhZ2U6IGVuZHBvaW50VVJMKDE3KS5yZXN1bHQgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG4gICAgICAgICAgICBjb25zdCBob3N0ID0gXCJodHRwOi8vXCIgKyBlbmRwb2ludERhdGEuaG9zdDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInJlc3VsdHNcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiaW5kaWNhdG9yc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvci8/Zm9ybWF0PWpzb24mcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImNvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2NvbW1lbnQvP2Zvcm1hdD1qc29uJmRhdGFfX3BlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwicGVyaW9kX2ZyYW1ld29ya1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1c2VyXCI6IGAke2hvc3R9L3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwicGFydG5lcnNoaXBzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiZmlsZV91cGxvYWRcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNQdWJsaWMpIHtcbiAgICAgICAgICAgIGdldFVzZXJEYXRhKGVuZHBvaW50RGF0YS51c2VySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbCgncmVzdWx0cycpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnaW5kaWNhdG9ycycpO1xuICAgIH1cblxuICAgIGxvYWRNb2RlbChtb2RlbCkge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGFwaUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHRoaXMuc3RhdGUucHJvamVjdElkKVttb2RlbF0sICcnLCBzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKG1vZGVsLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXToge1tpZF06IGRhdGF9fX1cbiAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFjYywgb2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBvYmpbJ2lkJ107XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ZWRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICBpbmRleGVkT2JqW2lkXSA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIGluZGV4ZWRPYmopXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge31cbiAgICAgICAgKVxuICAgIH1cblxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYSBsaXN0IG9mIGluZGljYXRvciBwZXJpb2RcbiAgICAgICAgZGF0YSBvYmplY3RzIGluIHRoZSBmaWVsZCBcInVwZGF0ZXNcIi5cbiAgICAgICAgTm90ZSB0aGF0IHRoZSBcImxvd2VzdFwiIGxldmVsIGluIHRoZSBjYWxsIGNoYWluLCBsb2FkVXBkYXRlc0FuZENvbW1lbnRzKCksIHJldHJpZXZlcyBib3RoXG4gICAgICAgIGluZGljYXRvciBwZXJpb2QgZGF0YSAoXCJ1cGRhdGVzXCIpIGFuZCBjb21tZW50cyBuaWNlbHkgc2ltaWxhcmx5IHRvIHRoZSByZXN0IG9mIHRoZSBkYXRhLlxuICAgICAgICBBbGwgcmVsYXRpb25zIGJhc2VkIG9uIHRoZSByZWxldmFudCBmb3JlaWduIGtleXMgbGlua2luZyB0aGUgbW9kZWwgb2JqZWN0cy5cbiAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGRfbmFtZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMubWFwKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZF9uYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkX25hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuc3RhdGUubW9kZWxzO1xuICAgICAgICBjb25zdCB1cGRhdGVzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy51cGRhdGVzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiZGF0YVwiLCBjaGlsZHJlbjogXCJjb21tZW50c1wifSxcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmNvbW1lbnRzKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwZXJpb2RzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5wZXJpb2RzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicGVyaW9kXCIsIGNoaWxkcmVuOiBcInVwZGF0ZXNcIn0sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LFxuICAgICAgICAgICAgcGVyaW9kc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBcImluZGljYXRvcnNcIn0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMuc3RhdGUucmVzdWx0c0RhdGFUcmVlO1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBsb2FkTW9kZWw6IHRoaXMubG9hZE1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICB1cGRhdGVNb2RlbDogdGhpcy51cGRhdGVNb2RlbC5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGVscy5yZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzIGl0ZW1zPXt0cmVlfSBjYWxsYmFja3M9e2NhbGxiYWNrc30gbW9kZWxzPXt0aGlzLnN0YXRlLm1vZGVsc30vPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gUmV0cmlldmUgZGF0YSBlbmRwb2ludHMsIHRyYW5zbGF0aW9ucyBhbmQgcHJvamVjdCBJRHNcbiAgICBpc1B1YmxpYyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzJykuaW5uZXJIVE1MKS5wdWJsaWM7XG4gICAgaTE4blJlc3VsdHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgaTE4bk1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoPEFwcC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJlc3VsdHMtZnJhbWV3b3JrJykpO1xuXG4gICAgLy8gQ2hlY2sgaWYgUmVhY3QgaXMgbG9hZGVkXG4gICAgLy8gaWYgKHR5cGVvZiBSZWFjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFJlYWN0RE9NICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc21vb3RoU2Nyb2xsICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vICAgICBzbW9vdGhTY3JvbGwuaW5pdCh7dXBkYXRlVVJMOiBmYWxzZX0pO1xuICAgIC8vICAgICBpbml0UmVhY3QoKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICBsb2FkQW5kUmVuZGVyUmVhY3QoKTtcbiAgICAvLyB9XG59KTsiXX0=
