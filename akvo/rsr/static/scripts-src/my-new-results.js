(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _rcCollapse = require('rc-collapse');

var _rcCollapse2 = _interopRequireDefault(_rcCollapse);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


// const React = require('react');
// const ReactDOM = require('react-dom');
// const update = require('immutability-helper');
// const Collapse = require('rc-collapse');
// const Panel = Collapse.Panel;

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

function APICall(method, url, data, callback, retries) {
    function modify(method, url, data) {
        return (0, _isomorphicFetch2.default)(url, {
            credentials: 'same-origin',
            method: method,
            headers: { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken },
            body: JSON.stringify(data)
        });
    }

    function call() {
        switch (method) {
            case "GET":
                return function () {
                    return (0, _isomorphicFetch2.default)(url, {
                        credentials: 'same-origin',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                };

            case "POST":
                return function () {
                    return modify('POST', url, data);
                };

            case "PUT":
                return function () {
                    return modify('PUT', url, data);
                };

            case "PATCH":
                return function () {
                    return modify('PATCH', url, data);
                };

            case "DELETE":
                return function () {
                    return (0, _isomorphicFetch2.default)(url, {
                        credentials: 'same-origin',
                        method: 'DELETE'
                    });
                };
        }
    }
    call()().then(function (response) {
        return response.json();
    }).then(callback);
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
                return _react2.default.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            } else if (items.length > 0) {
                return _react2.default.createElement(
                    _rcCollapse2.default,
                    null,
                    items.map(function (item, i) {
                        return _this2.renderPanel(item, i);
                    })
                );
            } else {
                return _react2.default.createElement(
                    'p',
                    null,
                    'No items'
                );
            }
        }
    }]);

    return Level;
}(_react2.default.Component);

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
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: comment.comment, key: i },
                _react2.default.createElement(
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
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: headerText, key: i },
                _react2.default.createElement(
                    'div',
                    null,
                    update.data
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(Comments, {
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
            function success(data) {
                this.props.callbacks.updateModel("periods", data);

                // Call the callback, if not undefined.
                if (callback !== undefined) {
                    callback();
                }
            };
            APICall('PATCH', url, data, success.bind(this));
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
                icon = _react2.default.createElement('i', { className: 'fa fa-spin fa-spinner' });
                label = "Loading";
            } else if (this.props.period.locked) {
                icon = _react2.default.createElement('i', { className: 'fa fa-lock' });
                label = "Unlock period";
            } else {
                icon = _react2.default.createElement('i', { className: 'fa fa-unlock-alt' });
                label = "Lock period";
            }
            return _react2.default.createElement(
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
}(_react2.default.Component);

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
            var header = _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement(
                    'span',
                    null,
                    'Period: ',
                    periodDate
                ),
                _react2.default.createElement(PeriodLockToggle, { period: period, callbacks: this.props.callbacks })
            );
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: header, key: i },
                _react2.default.createElement(Updates, { items: period.updates,
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
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Indicator: " + title, key: i },
                title,
                _react2.default.createElement(
                    'div',
                    { className: 'baseline' },
                    _react2.default.createElement(
                        'div',
                        { className: 'baseline-year' },
                        i18nResults.baseline_year,
                        _react2.default.createElement(
                            'span',
                            null,
                            indicator.baseline_year
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'baseline-value' },
                        i18nResults.baseline_value,
                        _react2.default.createElement(
                            'span',
                            null,
                            indicator.baseline_value
                        )
                    )
                ),
                _react2.default.createElement(Periods, { items: indicator.periods,
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
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Result: " + result.title, key: i },
                _react2.default.createElement(Indicators, {
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
                    this.setState({ models: (0, _immutabilityHelper2.default)(this.state.models, { $merge: _defineProperty({}, model, this.indexModel(response.results)) }) }, function () {
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
            this.setState({ models: (0, _immutabilityHelper2.default)(this.state.models, { $merge: _defineProperty({}, model, _defineProperty({}, id, data)) }) }, function () {
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
                return _react2.default.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            } else if (tree.length > 0) {
                return _react2.default.createElement(Results, { items: tree, callbacks: callbacks, models: this.state.models });
            } else {
                return _react2.default.createElement(
                    'p',
                    null,
                    'No items'
                );
            }
        }
    }]);

    return App;
}(_react2.default.Component);

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data endpoints, translations and project IDs
    isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
    i18nResults = JSON.parse(document.getElementById('translation-texts').innerHTML);
    i18nMonths = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    _reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('new-results-framework'));

    // Check if React is loaded
    // if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof smoothScroll !== 'undefined') {
    //     smoothScroll.init({updateURL: false});
    //     initReact();
    // } else {
    //     loadAndRenderReact();
    // }
});

},{"immutability-helper":"immutability-helper","isomorphic-fetch":"isomorphic-fetch","rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1lBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFoQkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBUUEsSUFBSSxrQkFBSjtBQUFBLElBQ0ksb0JBREo7QUFBQSxJQUVJLGlCQUZKO0FBQUEsSUFHSSxxQkFISjtBQUFBLElBSUksb0JBSko7QUFBQSxJQUtJLG1CQUxKO0FBQUEsSUFNSSxtQkFOSjtBQUFBLElBT0ksYUFQSjs7QUFTQTtBQUNBLE9BQU8sTUFBUCxHQUFnQixPQUFPLE1BQVAsSUFBa0I7QUFBQSxXQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUI7QUFBQSxlQUFPLElBQUksR0FBSixDQUFQO0FBQUEsS0FBckIsQ0FBUDtBQUFBLENBQWxDOztBQUVBLFNBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNsQixRQUFJLFFBQVEsU0FBWixFQUF1QjtBQUNuQixlQUFPLE9BQU8sTUFBUCxDQUFjLEdBQWQsQ0FBUDtBQUNIO0FBQ0QsV0FBTyxTQUFQO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDckIsUUFBSSxjQUFjLElBQWxCO0FBQ0EsUUFBSSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxNQUFULEtBQW9CLEVBQTNDLEVBQStDO0FBQzNDLFlBQUksVUFBVSxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBZDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGdCQUFJLFNBQVMsUUFBUSxDQUFSLEVBQVcsSUFBWCxFQUFiO0FBQ0EsZ0JBQUksT0FBTyxTQUFQLENBQWlCLENBQWpCLEVBQW9CLEtBQUssTUFBTCxHQUFjLENBQWxDLEtBQXlDLE9BQU8sR0FBcEQsRUFBMEQ7QUFDdEQsOEJBQWMsbUJBQW1CLE9BQU8sU0FBUCxDQUFpQixLQUFLLE1BQUwsR0FBYyxDQUEvQixDQUFuQixDQUFkO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRCxXQUFPLFdBQVA7QUFDSDtBQUNELFlBQVksVUFBVSxXQUFWLENBQVo7O0FBRUE7QUFDQSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEIsSUFBOUIsRUFBb0MsZUFBcEMsRUFBcUQsT0FBckQsRUFBOEQ7QUFDMUQsUUFBSSxVQUFVLElBQUksY0FBSixFQUFkO0FBQ0EsUUFBSSxhQUFhLENBQWpCOztBQUVBLFlBQVEsa0JBQVIsR0FBNkIsWUFBVztBQUNwQyxZQUFJLFFBQVEsVUFBUixJQUFzQixlQUFlLElBQXpDLEVBQStDO0FBQzNDLGdCQUFJLFdBQVcsUUFBUSxZQUFSLEtBQXlCLEVBQXpCLEdBQThCLEtBQUssS0FBTCxDQUFXLFFBQVEsWUFBbkIsQ0FBOUIsR0FBaUUsRUFBaEY7QUFDQSxnQkFBSSxRQUFRLE1BQVIsSUFBa0IsR0FBbEIsSUFBeUIsUUFBUSxNQUFSLEdBQWlCLEdBQTlDLEVBQW1EO0FBQy9DLG9CQUFJLFdBQVcsS0FBWCxJQUFvQixTQUFTLElBQVQsS0FBa0IsU0FBMUMsRUFBcUQ7QUFDakQsd0JBQUksU0FBUyxJQUFULEtBQWtCLElBQXRCLEVBQTRCO0FBQ3hCLDRCQUFJLFVBQVUsU0FBVixPQUFVLENBQVMsV0FBVCxFQUFzQjtBQUNoQyxnQ0FBSSxhQUFhLFNBQVMsT0FBMUI7QUFDQSxxQ0FBUyxPQUFULEdBQW1CLFdBQVcsTUFBWCxDQUFrQixZQUFZLE9BQTlCLENBQW5CO0FBQ0EsbUNBQU8sZ0JBQWdCLFFBQWhCLENBQVA7QUFDSCx5QkFKRDtBQUtBLGdDQUFRLE1BQVIsRUFBZ0IsU0FBUyxJQUF6QixFQUErQixJQUEvQixFQUFxQyxPQUFyQztBQUNILHFCQVBELE1BT087QUFDSCwrQkFBTyxnQkFBZ0IsUUFBaEIsQ0FBUDtBQUNIO0FBQ0osaUJBWEQsTUFXTztBQUNILDJCQUFPLGdCQUFnQixRQUFoQixDQUFQO0FBQ0g7QUFDSixhQWZELE1BZU87QUFDSCxvQkFBSSxVQUFVLFlBQVksYUFBWixHQUE0QixJQUExQztBQUNBLHFCQUFLLElBQUksR0FBVCxJQUFnQixRQUFoQixFQUEwQjtBQUN0Qix3QkFBSSxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsQ0FBSixFQUFrQztBQUM3QixtQ0FBVyxTQUFTLEdBQVQsSUFBZ0IsSUFBM0I7QUFDSjtBQUNKO0FBQ0QsaUNBQWlCLE9BQWpCO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDSixLQTdCRDs7QUErQkEsWUFBUSxPQUFSLEdBQWtCLFlBQVk7QUFDMUIsWUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3ZCLG1CQUFPLFFBQVEsTUFBUixFQUFnQixHQUFoQixFQUFxQixJQUFyQixFQUEyQixlQUEzQixFQUE0QyxDQUE1QyxDQUFQO0FBQ0gsU0FGRCxNQUVPLElBQUksV0FBVyxVQUFmLEVBQTJCO0FBQzlCLG1CQUFPLFFBQVEsTUFBUixFQUFnQixHQUFoQixFQUFxQixJQUFyQixFQUEyQixlQUEzQixFQUE0QyxVQUFVLENBQXRELENBQVA7QUFDSCxTQUZNLE1BRUE7QUFDSCw2QkFBaUIsWUFBWSxnQkFBN0I7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7QUFDSixLQVREOztBQVdBLFlBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsR0FBckIsRUFBMEIsSUFBMUI7QUFDQSxZQUFRLGdCQUFSLENBQXlCLGFBQXpCLEVBQXdDLFNBQXhDO0FBQ0EsWUFBUSxnQkFBUixDQUF5QixjQUF6QixFQUF5QyxnQ0FBekM7QUFDQSxZQUFRLElBQVIsQ0FBYSxJQUFiO0FBQ0g7O0FBR0QsU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLEVBQThCLElBQTlCLEVBQW9DLFFBQXBDLEVBQThDLE9BQTlDLEVBQXVEO0FBQ25ELGFBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixHQUF4QixFQUE2QixJQUE3QixFQUFrQztBQUM5QixlQUFPLCtCQUFNLEdBQU4sRUFBVztBQUNkLHlCQUFhLGFBREM7QUFFZCxvQkFBUSxNQUZNO0FBR2QscUJBQVMsRUFBQyxnQkFBZ0Isa0JBQWpCLEVBQXFDLGVBQWUsU0FBcEQsRUFISztBQUlkLGtCQUFNLEtBQUssU0FBTCxDQUFlLElBQWY7QUFKUSxTQUFYLENBQVA7QUFNSDs7QUFFRCxhQUFTLElBQVQsR0FBZ0I7QUFDWixnQkFBUSxNQUFSO0FBQ0ksaUJBQUssS0FBTDtBQUNJLHVCQUFPO0FBQUEsMkJBQU0sK0JBQU0sR0FBTixFQUFXO0FBQ3BCLHFDQUFhLGFBRE87QUFFcEIsZ0NBQVEsS0FGWTtBQUdwQixpQ0FBUyxFQUFDLGdCQUFnQixrQkFBakI7QUFIVyxxQkFBWCxDQUFOO0FBQUEsaUJBQVA7O0FBTUosaUJBQUssTUFBTDtBQUNJLHVCQUFPO0FBQUEsMkJBQU0sT0FBTyxNQUFQLEVBQWUsR0FBZixFQUFvQixJQUFwQixDQUFOO0FBQUEsaUJBQVA7O0FBRUosaUJBQUssS0FBTDtBQUNJLHVCQUFPO0FBQUEsMkJBQU0sT0FBTyxLQUFQLEVBQWMsR0FBZCxFQUFtQixJQUFuQixDQUFOO0FBQUEsaUJBQVA7O0FBRUosaUJBQUssT0FBTDtBQUNJLHVCQUFPO0FBQUEsMkJBQU0sT0FBTyxPQUFQLEVBQWdCLEdBQWhCLEVBQXFCLElBQXJCLENBQU47QUFBQSxpQkFBUDs7QUFFSixpQkFBSyxRQUFMO0FBQ0ksdUJBQU87QUFBQSwyQkFBTSwrQkFBTSxHQUFOLEVBQVc7QUFDcEIscUNBQWEsYUFETztBQUVwQixnQ0FBUTtBQUZZLHFCQUFYLENBQU47QUFBQSxpQkFBUDtBQWxCUjtBQXVCSDtBQUNELGFBQVMsSUFBVCxDQUFjLFVBQUMsUUFBRDtBQUFBLGVBQWMsU0FBUyxJQUFULEVBQWQ7QUFBQSxLQUFkLEVBQTZDLElBQTdDLENBQWtELFFBQWxEO0FBQ0g7O0FBRUQsU0FBUyxXQUFULENBQXFCLEVBQXJCLEVBQXlCO0FBQ3JCO0FBQ0EsYUFBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCO0FBQ3ZCLGVBQU8sUUFBUDtBQUNIO0FBQ0QsWUFBUSxLQUFSLEVBQWUsWUFBWSxFQUFaLEVBQWdCLElBQS9CLEVBQXFDLEVBQXJDLEVBQXlDLE9BQXpDO0FBQ0g7O0FBRUQsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCO0FBQ2xCLFdBQU8sRUFBRSxNQUFGLENBQVMsQ0FBVCxFQUFZLFdBQVosS0FBNEIsRUFBRSxLQUFGLENBQVEsQ0FBUixDQUFuQztBQUNIOztJQUVLLEs7Ozs7Ozs7Ozs7O2lDQUNPO0FBQUE7O0FBQ0wsZ0JBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUF6QjtBQUNBLGdCQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBSyxLQUFMLENBQVcsS0FBN0IsTUFBd0MsU0FBeEMsSUFBcUQsVUFBVSxTQUFuRSxFQUE4RTtBQUMxRSx3QkFBUSxHQUFSLENBQVksS0FBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLEdBQXhCLEdBQThCLEtBQUssc0JBQUwsQ0FBNEIsUUFBMUQsR0FBcUUsYUFBakY7QUFDQSx1QkFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURKO0FBR0gsYUFMRCxNQUtPLElBQUksTUFBTSxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDekIsdUJBQ0k7QUFBQTtBQUFBO0FBQ0ssMEJBQU0sR0FBTixDQUFVLFVBQUMsSUFBRCxFQUFPLENBQVA7QUFBQSwrQkFBYSxPQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBdkIsQ0FBYjtBQUFBLHFCQUFWO0FBREwsaUJBREo7QUFLSCxhQU5NLE1BTUE7QUFDSCx1QkFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURKO0FBR0g7QUFDSjs7OztFQW5CZSxnQkFBTSxTOztJQXVCcEIsUTs7O0FBQ0Ysc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHlIQUNULEtBRFM7O0FBRWYsZUFBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFVBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLE8sRUFBUyxDLEVBQUc7QUFDcEIsbUJBQ0k7QUFBQTtBQUFBLGtCQUFPLFFBQVEsUUFBUSxPQUF2QixFQUFnQyxLQUFLLENBQXJDO0FBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBVSw0QkFBUSxZQUFSLENBQXFCO0FBQS9CO0FBREosYUFESjtBQUtIOzs7O0VBWmtCLEs7O0lBZ0JqQixPOzs7QUFDRixxQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUhBQ1QsS0FEUzs7QUFFZixlQUFLLEtBQUwsR0FBYSxFQUFDLE9BQU8sU0FBUixFQUFiO0FBRmU7QUFHbEI7Ozs7NkNBRW9CO0FBQ2pCLGlCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFNBQXJCLENBQStCLFVBQS9CO0FBQ0g7OztvQ0FFVyxNLEVBQVEsQyxFQUFHO0FBQ25CLGdCQUFNLGVBQWUsT0FBTyxZQUFQLENBQW9CLHNCQUFwQixDQUEyQyxDQUEzQyxFQUE4QyxJQUFuRTtBQUNBLGdCQUFNLFdBQVcsT0FBTyxZQUFQLENBQW9CLFVBQXBCLEdBQWdDLEdBQWhDLEdBQXFDLE9BQU8sWUFBUCxDQUFvQixTQUExRTtBQUNBLGdCQUFNLE9BQU8sT0FBTyxJQUFwQjtBQUNBLGdCQUFNLDBCQUF3QixRQUF4QixZQUF1QyxZQUF2QyxnQkFBOEQsSUFBcEU7QUFDQSxtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxVQUFmLEVBQTJCLEtBQUssQ0FBaEM7QUFDSTtBQUFBO0FBQUE7QUFBTSwyQkFBTztBQUFiLGlCQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0ksa0RBQUMsUUFBRDtBQUNJLCtCQUFPLE9BQU8sUUFEbEI7QUFFSSxnQ0FBUSxLQUFLLEtBQUwsQ0FBVyxNQUZ2QjtBQUdJLG1DQUFXLEtBQUssS0FBTCxDQUFXLFNBSDFCO0FBREo7QUFGSixhQURKO0FBV0g7Ozs7RUExQmlCLEs7O0lBOEJoQixnQjs7O0FBQ0YsOEJBQWEsS0FBYixFQUFvQjtBQUFBOztBQUFBLHlJQUNWLEtBRFU7O0FBRWhCLGVBQUssVUFBTCxHQUFrQixPQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsUUFBbEI7QUFDQSxlQUFLLEtBQUwsR0FBYSxFQUFDLFNBQVMsS0FBVixFQUFiO0FBSGdCO0FBSW5COzs7O3VDQUVjLFEsRUFBVSxJLEVBQU0sUSxFQUFVO0FBQ3JDO0FBQ0EsZ0JBQU0sTUFBTSxZQUFZLFFBQVosRUFBc0IsZ0JBQWxDO0FBQ0EscUJBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNuQixxQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixXQUFyQixDQUFpQyxTQUFqQyxFQUE0QyxJQUE1Qzs7QUFFQTtBQUNBLG9CQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDeEI7QUFDSDtBQUNKO0FBQ0Qsb0JBQVEsT0FBUixFQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixRQUFRLElBQVIsQ0FBYSxJQUFiLENBQTVCO0FBQ0g7OztzQ0FFYSxPLEVBQVM7QUFDbkIsaUJBQUssUUFBTCxDQUFjLEVBQUMsU0FBUyxPQUFWLEVBQWQ7QUFDSDs7O3FDQUVZO0FBQ1QsaUJBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNIOzs7bUNBRVUsQyxFQUFHO0FBQ1YsZ0JBQUksQ0FBQyxLQUFLLEtBQUwsQ0FBVyxPQUFoQixFQUF5QjtBQUNyQixxQkFBSyxhQUFMLENBQW1CLElBQW5CO0FBQ0EscUJBQUssY0FBTCxDQUFvQixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQXRDLEVBQTBDLEVBQUMsUUFBUSxDQUFDLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBNUIsRUFBMUMsRUFBK0UsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQS9FO0FBQ0g7QUFDRCxjQUFFLGVBQUY7QUFDSDs7O2lDQUVRO0FBQ0wsZ0JBQUksYUFBSjtBQUFBLGdCQUFVLGNBQVY7QUFDQSxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFmLEVBQXdCO0FBQ3BCLHVCQUFPLHFDQUFHLFdBQVUsdUJBQWIsR0FBUDtBQUNBLHdCQUFRLFNBQVI7QUFDSCxhQUhELE1BR08sSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQXRCLEVBQThCO0FBQ2pDLHVCQUFPLHFDQUFHLFdBQVcsWUFBZCxHQUFQO0FBQ0Esd0JBQVEsZUFBUjtBQUNILGFBSE0sTUFHQTtBQUNILHVCQUFPLHFDQUFHLFdBQVUsa0JBQWIsR0FBUDtBQUNBLHdCQUFRLGFBQVI7QUFDSDtBQUNELG1CQUNJO0FBQUE7QUFBQSxrQkFBRyxTQUFTLEtBQUssVUFBakI7QUFDRywrQkFBVyx3QkFEZDtBQUVHLDJCQUFPLEVBQUMsT0FBTyxPQUFSLEVBQWlCLFFBQVEsYUFBekIsRUFGVjtBQUdLLG9CQUhMO0FBSUs7QUFKTCxhQURKO0FBUUg7Ozs7RUF6RDBCLGdCQUFNLFM7O0lBNkQvQixPOzs7QUFDRixxQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUhBQ1QsS0FEUzs7QUFFZixlQUFLLEtBQUwsR0FBYSxFQUFDLE9BQU8sU0FBUixFQUFiO0FBRmU7QUFHbEI7Ozs7b0NBRVcsTSxFQUFRLEMsRUFBRztBQUNuQixxQkFBUyxXQUFULENBQXFCLFVBQXJCLEVBQWlDO0FBQzdCO0FBQ0Esb0JBQUksZUFBZSxTQUFmLElBQTRCLGVBQWUsSUFBL0MsRUFBcUQ7QUFDakQsd0JBQU0sU0FBUyxPQUFmO0FBQ0Esd0JBQU0sT0FBTyxJQUFJLElBQUosQ0FBUyxXQUFXLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsQ0FBdEIsRUFBeUIsT0FBekIsQ0FBaUMsR0FBakMsRUFBc0MsSUFBdEMsQ0FBVCxDQUFiO0FBQ0Esd0JBQU0sTUFBTSxLQUFLLFVBQUwsRUFBWjtBQUNBLHdCQUFNLFFBQVEsV0FBVyxLQUFLLFdBQUwsRUFBWCxDQUFkO0FBQ0Esd0JBQU0sT0FBTyxLQUFLLGNBQUwsRUFBYjtBQUNBLDJCQUFPLE1BQU0sR0FBTixHQUFZLEtBQVosR0FBb0IsR0FBcEIsR0FBMEIsSUFBakM7QUFDSDtBQUNELHVCQUFPLFlBQVksWUFBbkI7QUFDSDs7QUFFRCxnQkFBTSxhQUFhLFlBQVksT0FBTyxZQUFuQixJQUFtQyxLQUFuQyxHQUEyQyxZQUFZLE9BQU8sVUFBbkIsQ0FBOUQ7QUFDQSxnQkFBTSxTQUNGO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQWU7QUFBZixpQkFESjtBQUVJLDhDQUFDLGdCQUFELElBQWtCLFFBQVEsTUFBMUIsRUFBa0MsV0FBVyxLQUFLLEtBQUwsQ0FBVyxTQUF4RDtBQUZKLGFBREo7QUFNQSxtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxNQUFmLEVBQXVCLEtBQUssQ0FBNUI7QUFDSSw4Q0FBQyxPQUFELElBQVMsT0FBTyxPQUFPLE9BQXZCO0FBQ1MsNEJBQVEsS0FBSyxLQUFMLENBQVcsTUFENUI7QUFFUywrQkFBVyxLQUFLLEtBQUwsQ0FBVyxTQUYvQjtBQURKLGFBREo7QUFPSDs7OzZDQUNvQjtBQUNqQixpQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixTQUFyQixDQUErQixTQUEvQjtBQUNIOzs7O0VBckNpQixLOztJQXlDaEIsVTs7O0FBQ0Ysd0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDZIQUNULEtBRFM7O0FBRWYsZUFBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFlBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLFMsRUFBVyxDLEVBQUc7QUFDdEIsZ0JBQU0sUUFBUSxVQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsQ0FBekIsR0FBNkIsVUFBVSxLQUF2QyxHQUErQyxvQkFBN0Q7QUFDQSxtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxnQkFBZ0IsS0FBL0IsRUFBc0MsS0FBSyxDQUEzQztBQUNLLHFCQURMO0FBRUk7QUFBQTtBQUFBLHNCQUFLLFdBQVUsVUFBZjtBQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLGVBQWY7QUFDSyxvQ0FBWSxhQURqQjtBQUVJO0FBQUE7QUFBQTtBQUFPLHNDQUFVO0FBQWpCO0FBRkoscUJBREo7QUFLSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxnQkFBZjtBQUNLLG9DQUFZLGNBRGpCO0FBRUk7QUFBQTtBQUFBO0FBQU8sc0NBQVU7QUFBakI7QUFGSjtBQUxKLGlCQUZKO0FBWUksOENBQUMsT0FBRCxJQUFTLE9BQU8sVUFBVSxPQUExQjtBQUNTLDRCQUFRLEtBQUssS0FBTCxDQUFXLE1BRDVCO0FBRVMsK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FGL0I7QUFaSixhQURKO0FBa0JIOzs7NkNBRW9CO0FBQ2pCLGlCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFNBQXJCLENBQStCLFNBQS9CO0FBQ0g7Ozs7RUE5Qm9CLEs7O0lBa0NuQixPOzs7QUFDRixxQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUhBQ1QsS0FEUzs7QUFFZixlQUFLLEtBQUwsR0FBYSxFQUFDLE9BQU8sU0FBUixFQUFiO0FBRmU7QUFHbEI7Ozs7b0NBRVcsTSxFQUFRLEMsRUFBRztBQUNuQixtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxhQUFhLE9BQU8sS0FBbkMsRUFBMEMsS0FBSyxDQUEvQztBQUNJLDhDQUFDLFVBQUQ7QUFDSSwyQkFBTyxPQUFPLFVBRGxCO0FBRUksNEJBQVEsS0FBSyxLQUFMLENBQVcsTUFGdkI7QUFHSSwrQkFBVyxLQUFLLEtBQUwsQ0FBVyxTQUgxQjtBQURKLGFBREo7QUFRSDs7OztFQWZpQixLOztJQW1CaEIsRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLCtHQUNULEtBRFM7O0FBRWYscUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQWxELENBQWI7QUFDQSxlQUFLLEtBQUwsR0FBYTtBQUNULG9CQUFRO0FBQ0oseUJBQVMsU0FETDtBQUVKLDRCQUFZLFNBRlI7QUFHSix5QkFBUyxTQUhMO0FBSUoseUJBQVMsU0FKTDtBQUtKLDBCQUFVO0FBTE4sYUFEQztBQVFULDZCQUFpQixFQVJSO0FBU1QsdUJBQVcsV0FBVztBQVRiLFNBQWI7QUFIZTtBQWNsQjs7Ozs0Q0FFbUI7QUFDaEI7QUFDQSwyQkFBZSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBcEQsQ0FBZjtBQUNBLDBCQUFjLHFCQUFVLEVBQVYsRUFBYztBQUN4QjtBQUNBO0FBQ0Esb0JBQU0sT0FBTyxZQUFZLGFBQWEsSUFBdEM7QUFDQSx1QkFBTztBQUNILDhCQUFhLElBQWIsd0JBQW9DLEVBQXBDLGtCQURHO0FBRUgsK0JBQWMsSUFBZCw2Q0FBMEQsRUFGdkQ7QUFHSCxrQ0FBaUIsSUFBakIsd0RBQXdFLEVBSHJFO0FBSUgsK0JBQWMsSUFBZCwwRUFBdUYsRUFKcEY7QUFLSCwrQkFBYyxJQUFkLHVGQUFvRyxFQUxqRztBQU1ILGdDQUFlLElBQWYscUdBQW1ILEVBTmhIO0FBT0gsd0NBQXVCLElBQXZCLDRDQUFrRSxFQUFsRSxrQkFQRztBQVFILDJDQUEwQixJQUExQixpREFBMEUsRUFBMUUsa0JBUkc7QUFTSCw0Q0FBMkIsSUFBM0IsMERBVEc7QUFVSCw0QkFBVyxJQUFYLHNCQUFnQyxFQUFoQyxrQkFWRztBQVdILG9DQUFtQixJQUFuQixrREFBb0UsRUFYakU7QUFZSCxtQ0FBa0IsSUFBbEIsdUNBQXdELEVBQXhEO0FBWkcsaUJBQVA7QUFjSCxhQWxCRDs7QUFvQkEsZ0JBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCw0QkFBWSxhQUFhLE1BQXpCO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxTQUFmO0FBQ0EsaUJBQUssU0FBTCxDQUFlLFlBQWY7QUFDSDs7O2tDQUVTLEssRUFBTztBQUNiO0FBQ0EsZ0JBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixNQUE2QixTQUFqQyxFQUE0QztBQUN4QyxvQkFBSSxVQUFVLFVBQVMsUUFBVCxFQUFtQjtBQUM3Qix5QkFBSyxRQUFMLENBQ0ksRUFBQyxRQUFRLGtDQUNMLEtBQUssS0FBTCxDQUFXLE1BRE4sRUFFTCxFQUFDLDRCQUFVLEtBQVYsRUFBa0IsS0FBSyxVQUFMLENBQWdCLFNBQVMsT0FBekIsQ0FBbEIsQ0FBRCxFQUZLLENBQVQsRUFESixFQUtJLFlBQVc7QUFDUCw2QkFBSyxRQUFMLENBQWMsRUFBQyxpQkFBaUIsS0FBSyxnQkFBTCxFQUFsQixFQUFkO0FBQ0gscUJBUEw7QUFTSCxpQkFWYSxDQVVaLElBVlksQ0FVUCxJQVZPLENBQWQ7QUFXQSx3QkFBUSxLQUFSLEVBQWUsWUFBWSxLQUFLLEtBQUwsQ0FBVyxTQUF2QixFQUFrQyxLQUFsQyxDQUFmLEVBQXlELEVBQXpELEVBQTZELE9BQTdEO0FBQ0g7QUFDSjs7O29DQUVXLEssRUFBTyxJLEVBQU07QUFDckIsZ0JBQU0sS0FBSyxLQUFLLEVBQWhCO0FBQ0EsaUJBQUssUUFBTCxDQUNJLEVBQUMsUUFBUSxrQ0FDTCxLQUFLLEtBQUwsQ0FBVyxNQUROLEVBRUwsRUFBQyw0QkFBVSxLQUFWLHNCQUFvQixFQUFwQixFQUF5QixJQUF6QixFQUFELEVBRkssQ0FBVCxFQURKLEVBS0ksWUFBVztBQUNQLHFCQUFLLFFBQUwsQ0FBYyxFQUFDLGlCQUFpQixLQUFLLGdCQUFMLEVBQWxCLEVBQWQ7QUFDSCxhQVBMO0FBU0g7OzttQ0FFVSxJLEVBQU07QUFDYixtQkFBTyxLQUFLLE1BQUwsQ0FDSCxVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CO0FBQ2Ysb0JBQU0sS0FBSyxJQUFJLElBQUosQ0FBWDtBQUNBLG9CQUFJLGFBQWEsRUFBakI7QUFDQSwyQkFBVyxFQUFYLElBQWlCLEdBQWpCO0FBQ0EsdUJBQU8sT0FBTyxNQUFQLENBQWMsR0FBZCxFQUFtQixVQUFuQixDQUFQO0FBQ0gsYUFORSxFQU9ILEVBUEcsQ0FBUDtBQVNIOzs7MkNBR2tCO0FBQ2Y7Ozs7Ozs7OztBQVNBLHFCQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUMsV0FBakMsRUFBOEMsUUFBOUMsRUFBd0Q7QUFDcEQsb0JBQUksWUFBWSxTQUFoQixFQUEyQjtBQUN2QiwyQkFBTyxRQUFRLEdBQVIsQ0FDSCxVQUFVLE1BQVYsRUFBa0I7QUFDZCw0QkFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQ3hCLG1DQUFPLFlBQVksUUFBbkIsSUFBK0IsU0FBUyxNQUFULENBQzNCO0FBQUEsdUNBQVMsTUFBTSxZQUFZLE1BQWxCLE1BQThCLE9BQU8sRUFBOUM7QUFBQSw2QkFEMkIsQ0FBL0I7QUFHSDtBQUNELCtCQUFPLE1BQVA7QUFDSCxxQkFSRSxDQUFQO0FBVUgsaUJBWEQsTUFXTztBQUNILDJCQUFPLFNBQVA7QUFDSDtBQUNKOztBQUVELGdCQUFNLFNBQVMsS0FBSyxLQUFMLENBQVcsTUFBMUI7QUFDQSxnQkFBTSxVQUFVLGVBQ1osUUFBUSxPQUFPLE9BQWYsQ0FEWSxFQUVaLEVBQUMsUUFBUSxNQUFULEVBQWlCLFVBQVUsVUFBM0IsRUFGWSxFQUdaLFFBQVEsT0FBTyxRQUFmLENBSFksQ0FBaEI7QUFLQSxnQkFBTSxVQUFVLGVBQ1osUUFBUSxPQUFPLE9BQWYsQ0FEWSxFQUVaLEVBQUMsUUFBUSxRQUFULEVBQW1CLFVBQVUsU0FBN0IsRUFGWSxFQUdaLE9BSFksQ0FBaEI7QUFJQSxnQkFBTSxhQUFhLGVBQ2YsUUFBUSxPQUFPLFVBQWYsQ0FEZSxFQUVmLEVBQUMsUUFBUSxXQUFULEVBQXNCLFVBQVUsU0FBaEMsRUFGZSxFQUdmLE9BSGUsQ0FBbkI7QUFLQSxnQkFBTSxVQUFVLGVBQ1osUUFBUSxPQUFPLE9BQWYsQ0FEWSxFQUVaLEVBQUMsUUFBUSxRQUFULEVBQW1CLFVBQVUsWUFBN0IsRUFGWSxFQUdaLFVBSFksQ0FBaEI7QUFLQSxtQkFBTyxPQUFQO0FBQ0g7OztpQ0FFUTtBQUNMLGdCQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsZUFBeEI7QUFDQSxnQkFBTSxZQUFZO0FBQ2QsMkJBQVcsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQURHO0FBRWQsNkJBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCO0FBRkMsYUFBbEI7QUFJQSxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE9BQWxCLEtBQThCLFNBQWxDLEVBQTZDO0FBQ3pDLHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSCxhQUpELE1BSU8sSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUN4Qix1QkFDSSw4QkFBQyxPQUFELElBQVMsT0FBTyxJQUFoQixFQUFzQixXQUFXLFNBQWpDLEVBQTRDLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBL0QsR0FESjtBQUdILGFBSk0sTUFJQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBbkthLGdCQUFNLFM7O0FBeUt4QixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JEO0FBQ0EsZUFBVyxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBL0MsRUFBMEQsTUFBckU7QUFDQSxrQkFBYyxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDLFNBQXhELENBQWQ7QUFDQSxpQkFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBakQsQ0FBYjtBQUNBLGlCQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUFsRCxDQUFiOztBQUVBLHVCQUFTLE1BQVQsQ0FBZ0IsOEJBQUMsR0FBRCxPQUFoQixFQUF3QixTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuLy8gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbi8vIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuLy8gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cblxuLy8gY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuLy8gY29uc3QgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbi8vIGNvbnN0IHVwZGF0ZSA9IHJlcXVpcmUoJ2ltbXV0YWJpbGl0eS1oZWxwZXInKTtcbi8vIGNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgncmMtY29sbGFwc2UnKTtcbi8vIGNvbnN0IFBhbmVsID0gQ29sbGFwc2UuUGFuZWw7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcblxubGV0IGNzcmZ0b2tlbixcbiAgICBpMThuUmVzdWx0cyxcbiAgICBpc1B1YmxpYyxcbiAgICBlbmRwb2ludERhdGEsXG4gICAgZW5kcG9pbnRVUkwsXG4gICAgaTE4bk1vbnRocyxcbiAgICBwcm9qZWN0SWRzLFxuICAgIHVzZXI7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyogQ1NSRiBUT0tFTiAodGhpcyBzaG91bGQgcmVhbGx5IGJlIGFkZGVkIGluIGJhc2UuaHRtbCwgd2UgdXNlIGl0IGV2ZXJ5d2hlcmUpICovXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cbmNzcmZ0b2tlbiA9IGdldENvb2tpZSgnY3NyZnRva2VuJyk7XG5cbi8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIGEgcHJvcGVyIGxpYnJhcnkgZm9yIGJhY2tlbmQgY2FsbHNcbmZ1bmN0aW9uIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgcmV0cmllcykge1xuICAgIHZhciB4bWxIdHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIG1heFJldHJpZXMgPSA1O1xuXG4gICAgeG1sSHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhtbEh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4bWxIdHRwLnJlc3BvbnNlVGV4dCAhPT0gJycgPyBKU09OLnBhcnNlKHhtbEh0dHAucmVzcG9uc2VUZXh0KSA6ICcnO1xuICAgICAgICAgICAgaWYgKHhtbEh0dHAuc3RhdHVzID49IDIwMCAmJiB4bWxIdHRwLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdHRVQnICYmIHJlc3BvbnNlLm5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubmV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbihuZXdSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRSZXN1bHRzID0gcmVzcG9uc2UucmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHRzID0gb2xkUmVzdWx0cy5jb25jYXQobmV3UmVzcG9uc2UucmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpQ2FsbChtZXRob2QsIHJlc3BvbnNlLm5leHQsIGRhdGEsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gaTE4blJlc3VsdHMuZ2VuZXJhbF9lcnJvciArICc6ICc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSArPSByZXNwb25zZVtrZXldICsgJy4gJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG93R2VuZXJhbEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxIdHRwLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChyZXRyaWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhcGlDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIDIpO1xuICAgICAgICB9IGVsc2UgaWYgKHJldHJpZXMgPD0gbWF4UmV0cmllcykge1xuICAgICAgICAgICAgcmV0dXJuIGFwaUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgcmV0cmllcyArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd0dlbmVyYWxFcnJvcihpMThuUmVzdWx0cy5jb25uZWN0aW9uX2Vycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxIdHRwLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgIHhtbEh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIlgtQ1NSRlRva2VuXCIsIGNzcmZ0b2tlbik7XG4gICAgeG1sSHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIHhtbEh0dHAuc2VuZChkYXRhKTtcbn1cblxuXG5mdW5jdGlvbiBBUElDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaywgcmV0cmllcykge1xuICAgIGZ1bmN0aW9uIG1vZGlmeShtZXRob2QsIHVybCwgZGF0YSl7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgXCJYLUNTUkZUb2tlblwiOiBjc3JmdG9rZW59LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbCgpIHtcbiAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJQT1NUXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJQVVRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuXG4gICAgICAgICAgICBjYXNlIFwiUEFUQ0hcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJERUxFVEVcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2FsbCgpKCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSkudGhlbihjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJEYXRhKGlkKSB7XG4gICAgLy8gR2V0IHRoZSB1c2VyIGRhdGEgZnJvbSB0aGUgQVBJIGFuZCBzdG9yZXMgaXQgaW4gdGhlIGdsb2JhbCB1c2VyIHZhcmlhYmxlXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICB1c2VyID0gcmVzcG9uc2U7XG4gICAgfTtcbiAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludFVSTChpZCkudXNlciwgJycsIHN1Y2Nlc3MpO1xufVxuXG5mdW5jdGlvbiB0aXRsZUNhc2Uocykge1xuICAgIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbn1cblxuY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tb2RlbHNbdGhpcy5zdGF0ZS5tb2RlbF0gPT09IHVuZGVmaW5lZCB8fCBpdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8ZGl2Pnt1cGRhdGUuZGF0YX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBQZXJpb2RMb2NrVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmxvY2tUb2dnbGUgPSB0aGlzLmxvY2tUb2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtsb2NraW5nOiBmYWxzZX07XG4gICAgfVxuXG4gICAgYmFzZVBlcmlvZFNhdmUocGVyaW9kSWQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEJhc2UgZnVuY3Rpb24gZm9yIHNhdmluZyBhIHBlcmlvZCB3aXRoIGEgZGF0YSBPYmplY3QuXG4gICAgICAgIGNvbnN0IHVybCA9IGVuZHBvaW50VVJMKHBlcmlvZElkKS5wZXJpb2RfZnJhbWV3b3JrO1xuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwicGVyaW9kc1wiLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2ssIGlmIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInBlcmlvZHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kLCBpKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAgICAgICAgIC8vIERpc3BsYXkgYSBkYXRlU3RyaW5nIGxpa2UgXCIyNSBKYW4gMjAxNlwiXG4gICAgICAgICAgICBpZiAoZGF0ZVN0cmluZyAhPT0gdW5kZWZpbmVkICYmIGRhdGVTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXkgPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtb250aCA9IGkxOG5Nb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXkgKyBcIiBcIiArIG1vbnRoICsgXCIgXCIgKyB5ZWFyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGkxOG5SZXN1bHRzLnVua25vd25fZGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0KSArICcgLSAnICsgZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQpO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5QZXJpb2Q6IHtwZXJpb2REYXRlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IsIGkpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV95ZWFyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kcyBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgUmVzdWx0cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9XG4gICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZHMucHJvamVjdF9pZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBzZXQgdXAgY2FsbGJhY2sgVVJMIHRlbXBsYXRlc1xuICAgICAgICBlbmRwb2ludERhdGEgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKTtcbiAgICAgICAgZW5kcG9pbnRVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIC8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBjYWxsYmFjayBVUkxzLCBpbmNsdWRpbmcgb3B0aW9uYWwgSURcbiAgICAgICAgICAgIC8vIFVzYWdlOiBlbmRwb2ludFVSTCgxNykucmVzdWx0IC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuICAgICAgICAgICAgY29uc3QgaG9zdCA9IFwiaHR0cDovL1wiICsgZW5kcG9pbnREYXRhLmhvc3Q7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0Lz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImluZGljYXRvcnNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJwZXJpb2RzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8/Zm9ybWF0PWpzb24mcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJjb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZF9mcmFtZXdvcmtcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlX2FuZF9jb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXNlclwiOiBgJHtob3N0fS9yZXN0L3YxL3VzZXIvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiBgJHtob3N0fS9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImZpbGVfdXBsb2FkXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUHVibGljKSB7XG4gICAgICAgICAgICBnZXRVc2VyRGF0YShlbmRwb2ludERhdGEudXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWVyZ2U6IHtbbW9kZWxdOiB0aGlzLmluZGV4TW9kZWwocmVzcG9uc2UucmVzdWx0cyl9fVxuICAgICAgICAgICAgICAgICAgICApfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBhcGlDYWxsKCdHRVQnLCBlbmRwb2ludFVSTCh0aGlzLnN0YXRlLnByb2plY3RJZClbbW9kZWxdLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHtbaWRdOiBkYXRhfX19XG4gICAgICAgICAgICApfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cblxuICAgIGFzc2VtYmxlRGF0YVRyZWUoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIGxpc3Qgb2YgcmVzdWx0IG9iamVjdHMgYmFzZWQgb24gdGhlIEFQSSBjYWxsIGZvciBSZXN1bHQsIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYVxuICAgICAgICBsaXN0IG9mIGl0cyBhc3NvY2lhdGVkIGluZGljYXRvcnMgaW4gdGhlIGZpZWxkIFwiaW5kaWNhdG9yc1wiLCBlYWNoIG9mIHdoaWNoIGhvbGQgYSBsaXN0IG9mXG4gICAgICAgIGluZGljYXRvciBwZXJpb2RzIGluIHRoZSBmaWVsZCBcInBlcmlvZHNcIiBlYWNoIG9mIHdoaWNoIGhvbGRzIGEgbGlzdCBvZiBpbmRpY2F0b3IgcGVyaW9kXG4gICAgICAgIGRhdGEgb2JqZWN0cyBpbiB0aGUgZmllbGQgXCJ1cGRhdGVzXCIuXG4gICAgICAgIE5vdGUgdGhhdCB0aGUgXCJsb3dlc3RcIiBsZXZlbCBpbiB0aGUgY2FsbCBjaGFpbiwgbG9hZFVwZGF0ZXNBbmRDb21tZW50cygpLCByZXRyaWV2ZXMgYm90aFxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kIGRhdGEgKFwidXBkYXRlc1wiKSBhbmQgY29tbWVudHMgbmljZWx5IHNpbWlsYXJseSB0byB0aGUgcmVzdCBvZiB0aGUgZGF0YS5cbiAgICAgICAgQWxsIHJlbGF0aW9ucyBiYXNlZCBvbiB0aGUgcmVsZXZhbnQgZm9yZWlnbiBrZXlzIGxpbmtpbmcgdGhlIG1vZGVsIG9iamVjdHMuXG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckNoaWxkcmVuKHBhcmVudHMsIGZpZWxkX25hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKHBhcmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRbZmllbGRfbmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9PiBjaGlsZFtmaWVsZF9uYW1lcy5wYXJlbnRdID09PSBwYXJlbnQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IFwiY29tbWVudHNcIn0sXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5jb21tZW50cylcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LFxuICAgICAgICAgICAgdXBkYXRlcyk7XG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmluZGljYXRvcnMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJpbmRpY2F0b3JcIiwgY2hpbGRyZW46IFwicGVyaW9kc1wifSxcbiAgICAgICAgICAgIHBlcmlvZHNcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogXCJpbmRpY2F0b3JzXCJ9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKVxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHRyZWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8UmVzdWx0cyBpdGVtcz17dHJlZX0gY2FsbGJhY2tzPXtjYWxsYmFja3N9IG1vZGVscz17dGhpcy5zdGF0ZS5tb2RlbHN9Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFJldHJpZXZlIGRhdGEgZW5kcG9pbnRzLCB0cmFuc2xhdGlvbnMgYW5kIHByb2plY3QgSURzXG4gICAgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgIGkxOG5SZXN1bHRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgIGkxOG5Nb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcblxuICAgIC8vIENoZWNrIGlmIFJlYWN0IGlzIGxvYWRlZFxuICAgIC8vIGlmICh0eXBlb2YgUmVhY3QgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBSZWFjdERPTSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHNtb290aFNjcm9sbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyAgICAgc21vb3RoU2Nyb2xsLmluaXQoe3VwZGF0ZVVSTDogZmFsc2V9KTtcbiAgICAvLyAgICAgaW5pdFJlYWN0KCk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgbG9hZEFuZFJlbmRlclJlYWN0KCk7XG4gICAgLy8gfVxufSk7Il19
