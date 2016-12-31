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

function APICall(method, url, data, callback, retries) {
    function modify(method, url, data) {
        return (0, _isomorphicFetch2.default)(url, {
            credentials: 'same-origin',
            method: method,
            headers: { 'Content-Type': 'application/json', "X-CSRFToken": csrftoken },
            body: JSON.stringify(data)
        });
    }

    var handler = void 0;
    switch (method) {
        case "GET":
            handler = function handler() {
                return (0, _isomorphicFetch2.default)(url, {
                    credentials: 'same-origin',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            };
            break;

        case "POST":
            handler = function handler() {
                return modify('POST', url, data);
            };
            break;

        case "PUT":
            handler = function handler() {
                return modify('PUT', url, data);
            };
            break;

        case "PATCH":
            handler = function handler() {
                return modify('PATCH', url, data);
            };
            break;

        case "DELETE":
            handler = function handler() {
                return (0, _isomorphicFetch2.default)(url, {
                    credentials: 'same-origin',
                    method: 'DELETE'
                });
            };
            break;
    }
    handler()
    //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
    .then(function (response) {
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

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString) {
        var locale = "en-gb";
        var date = new Date(dateString.split(".")[0].replace("/", /-/g));
        var day = date.getUTCDate();
        var month = i18nMonths[date.getUTCMonth()];
        var year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return i18nResults.unknown_date;
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
            if (!this.props.models[this.state.model] || !items) {
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
                    'When: ',
                    displayDate(update.created_at),
                    ' | By: ',
                    userName,
                    ' | Org: ',
                    update.user_details.approved_organisations[0].name,
                    ' | Status: ',
                    update.status,
                    ' ',
                    _react2.default.createElement('br', null),
                    'Update value: ',
                    update.data,
                    ' | ',
                    'Actual total for this period (including this update): ',
                    update.actual_value
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
                if (callback) {
                    callback();
                }
            }
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
            var periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
            var header = _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement(
                    'span',
                    null,
                    'Period: ',
                    periodDate,
                    ' | Target value: ',
                    period.target_value,
                    ' | Actual value: ',
                    period.actual_value
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
            // Load a model from the API. After loading rebuild the data tree.
            if (!this.state.models[model]) {
                var success = function (response) {
                    this.setState({ models: (0, _immutabilityHelper2.default)(this.state.models, { $merge: _defineProperty({}, model, this.indexModel(response.results)) }) }, function () {
                        this.setState({ resultsDataTree: this.assembleDataTree() });
                    });
                }.bind(this);
                APICall('GET', endpointURL(this.state.projectId)[model], '', success);
            }
        }
    }, {
        key: 'updateModel',
        value: function updateModel(model, data) {
            /*
            Update a model instance. Uses the indexed model objects and the immutability-helper update
             function (https://facebook.github.io/react/docs/update.html)
             */
            var id = data.id;
            var newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $merge: _defineProperty({}, id, data) }));
            this.setState({ models: newState }, function () {
                this.setState({ resultsDataTree: this.assembleDataTree() });
            });
        }
    }, {
        key: 'indexModel',
        value: function indexModel(data) {
            /*
            Create an indexed version of a model by creating a list of objects, one for each model
            instance where the object key is the id of the instance and the value is the full instance.
            This construct is used to be able to easily update individual instances.
             */
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
            indicator periods in the field "periods" and on down via "updates" and "comments".
            This data structure is used to populate the whole tree of components each level passing the
            child list as the prop "items"
            */

            function filterChildren(parents, fieldNames, children) {
                /*
                Helper function that links two levels in the data tree. The linking is based on the
                foreign key field to the parent of the child being the same as the current parent object
                Params:
                    parents: list of parent objects. Each parent object is assigned a new field that
                             holds the list of associated children
                    fieldNames: object with two fields, "parent" and "children" that hold the name of
                    the fields linking the two levels of objects.
                    children: list of all child objects.
                 */
                return parents && parents.map(function (parent) {
                    if (children) {
                        parent[fieldNames.children] = children.filter(function (child) {
                            return child[fieldNames.parent] === parent.id;
                        });
                    }
                    return parent;
                });
            }

            function annotatePeriods(periods) {
                /*
                Add the field "actual_value" to each period update, which is the sum of all update
                values up to this point in time. Note that this field exists in the dataset as
                update.period_actual_value but we can't use that since we want to be able to
                (re)-calculate on data changes.
                 */
                return periods && periods.map(function (period) {
                    if (period.updates !== undefined) {
                        (function () {
                            var actual_value = 0;
                            period.updates = period.updates.map(function (update) {
                                update['actual_value'] = parseInt(update.data) + actual_value;
                                actual_value = update.actual_value;
                                return update;
                            });
                        })();
                    }
                    return period;
                });
            }

            function deIndex(obj) {
                if (obj !== undefined) {
                    return Object.values(obj);
                }
                return undefined;
            }

            var models = this.state.models;
            var updates = filterChildren(deIndex(models.updates), { parent: "data", children: "comments" }, deIndex(models.comments));

            var periods = filterChildren(deIndex(models.periods), { parent: "period", children: "updates" }, updates);
            var annotated_periods = annotatePeriods(periods);

            var indicators = filterChildren(deIndex(models.indicators), { parent: "indicator", children: "periods" }, annotated_periods);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1lBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFoQkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBUUEsSUFBSSxrQkFBSjtBQUFBLElBQ0ksb0JBREo7QUFBQSxJQUVJLGlCQUZKO0FBQUEsSUFHSSxxQkFISjtBQUFBLElBSUksb0JBSko7QUFBQSxJQUtJLG1CQUxKO0FBQUEsSUFNSSxtQkFOSjtBQUFBLElBT0ksYUFQSjs7QUFTQTtBQUNBLE9BQU8sTUFBUCxHQUFnQixPQUFPLE1BQVAsSUFBa0I7QUFBQSxXQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUI7QUFBQSxlQUFPLElBQUksR0FBSixDQUFQO0FBQUEsS0FBckIsQ0FBUDtBQUFBLENBQWxDOztBQUVBO0FBQ0EsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3JCLFFBQUksY0FBYyxJQUFsQjtBQUNBLFFBQUksU0FBUyxNQUFULElBQW1CLFNBQVMsTUFBVCxLQUFvQixFQUEzQyxFQUErQztBQUMzQyxZQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUNyQyxnQkFBSSxTQUFTLFFBQVEsQ0FBUixFQUFXLElBQVgsRUFBYjtBQUNBLGdCQUFJLE9BQU8sU0FBUCxDQUFpQixDQUFqQixFQUFvQixLQUFLLE1BQUwsR0FBYyxDQUFsQyxLQUF5QyxPQUFPLEdBQXBELEVBQTBEO0FBQ3RELDhCQUFjLG1CQUFtQixP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S0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDeEIsdUJBQ0ksOEJBQUMsT0FBRCxJQUFTLE9BQU8sSUFBaEIsRUFBc0IsV0FBVyxTQUFqQyxFQUE0QyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQS9ELEdBREo7QUFHSCxhQUpNLE1BSUE7QUFDSCx1QkFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURKO0FBR0g7QUFDSjs7OztFQXJOYSxnQkFBTSxTOztBQTJOeEIsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBVztBQUNyRDtBQUNBLGVBQVcsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQS9DLEVBQTBELE1BQXJFO0FBQ0Esa0JBQWMsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLG1CQUF4QixFQUE2QyxTQUF4RCxDQUFkO0FBQ0EsaUJBQWEsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLFNBQWpELENBQWI7QUFDQSxpQkFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBbEQsQ0FBYjs7QUFFQSx1QkFBUyxNQUFULENBQWdCLDhCQUFDLEdBQUQsT0FBaEIsRUFBd0IsU0FBUyxjQUFULENBQXdCLHVCQUF4QixDQUF4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbi8vIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4vLyBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbi8vIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXG5cbi8vIGNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbi8vIGNvbnN0IFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG4vLyBjb25zdCB1cGRhdGUgPSByZXF1aXJlKCdpbW11dGFiaWxpdHktaGVscGVyJyk7XG4vLyBjb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJ3JjLWNvbGxhcHNlJyk7XG4vLyBjb25zdCBQYW5lbCA9IENvbGxhcHNlLlBhbmVsO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cbmxldCBjc3JmdG9rZW4sXG4gICAgaTE4blJlc3VsdHMsXG4gICAgaXNQdWJsaWMsXG4gICAgZW5kcG9pbnREYXRhLFxuICAgIGVuZHBvaW50VVJMLFxuICAgIGkxOG5Nb250aHMsXG4gICAgcHJvamVjdElkcyxcbiAgICB1c2VyO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cbi8qIENTUkYgVE9LRU4gKHRoaXMgc2hvdWxkIHJlYWxseSBiZSBhZGRlZCBpbiBiYXNlLmh0bWwsIHdlIHVzZSBpdCBldmVyeXdoZXJlKSAqL1xuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBjb29raWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT0gKG5hbWUgKyAnPScpKSB7XG4gICAgICAgICAgICAgICAgY29va2llVmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQoY29va2llLnN1YnN0cmluZyhuYW1lLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29va2llVmFsdWU7XG59XG5jc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuXG5cbmZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCBcIlgtQ1NSRlRva2VuXCI6IGNzcmZ0b2tlbn0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcjtcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICBjYXNlIFwiR0VUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQT1NUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQT1NUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQVVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BVVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUEFUQ0hcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BBVENIJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJERUxFVEVcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRGF0YShpZCkge1xuICAgIC8vIEdldCB0aGUgdXNlciBkYXRhIGZyb20gdGhlIEFQSSBhbmQgc3RvcmVzIGl0IGluIHRoZSBnbG9iYWwgdXNlciB2YXJpYWJsZVxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlO1xuICAgIH07XG4gICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwoaWQpLnVzZXIsICcnLCBzdWNjZXNzKTtcbn1cblxuZnVuY3Rpb24gdGl0bGVDYXNlKHMpIHtcbiAgICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIGkxOG5SZXN1bHRzLnVua25vd25fZGF0ZTtcbn1cblxuY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAoISB0aGlzLnByb3BzLm1vZGVsc1t0aGlzLnN0YXRlLm1vZGVsXSB8fCAhIGl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIFdoZW46IHtkaXNwbGF5RGF0ZSh1cGRhdGUuY3JlYXRlZF9hdCl9IHxcbiAgICAgICAgICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgICAgICAgICBTdGF0dXM6IHt1cGRhdGUuc3RhdHVzfSA8YnIvPlxuICAgICAgICAgICAgICAgICAgICBVcGRhdGUgdmFsdWU6IHt1cGRhdGUuZGF0YX0gfCB7LypcbiAgICAgICAgICAgICAgICAgICAgICAgIE5PVEU6IHdlIHVzZSB1cGRhdGUuYWN0dWFsX3ZhbHVlLCBhIHZhbHVlIGNhbGN1bGF0ZWQgaW4gQXBwLmFubm90YXRlKCksIG5vdFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgZnJvbSB0aGUgYmFja2VuZFxuICAgICAgICAgICAgICAgICAgICAqL31cbiAgICAgICAgICAgICAgICAgICAgQWN0dWFsIHRvdGFsIGZvciB0aGlzIHBlcmlvZCAoaW5jbHVkaW5nIHRoaXMgdXBkYXRlKToge3VwZGF0ZS5hY3R1YWxfdmFsdWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludFVSTChwZXJpb2RJZCkucGVyaW9kX2ZyYW1ld29yaztcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBBUElDYWxsKCdQQVRDSCcsIHVybCwgZGF0YSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBsb2NraW5nVG9nZ2xlKGxvY2tpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bG9ja2luZzogbG9ja2luZ30pO1xuICAgIH1cblxuICAgIG5vdExvY2tpbmcoKSB7XG4gICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZShmYWxzZSk7XG4gICAgfVxuXG4gICAgbG9ja1RvZ2dsZShlKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmJhc2VQZXJpb2RTYXZlKHRoaXMucHJvcHMucGVyaW9kLmlkLCB7bG9ja2VkOiAhdGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkfSwgdGhpcy5ub3RMb2NraW5nLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgaWNvbiwgbGFiZWw7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2FkaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPXsnZmEgZmEtbG9jayd9Lz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiVW5sb2NrIHBlcmlvZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXVubG9jay1hbHRcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2NrIHBlcmlvZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmxvY2tUb2dnbGV9XG4gICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgIHN0eWxlPXt7ZmxvYXQ6ICdyaWdodCcsIG1hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgIHtpY29ufVxuICAgICAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBQZXJpb2RzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJwZXJpb2RzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHBlcmlvZCwgaSkge1xuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCkgKyAnIC0gJyArIGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdmFsdWU6IHtwZXJpb2QuYWN0dWFsX3ZhbHVlfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IsIGkpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV95ZWFyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kcyBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgUmVzdWx0cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9XG4gICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZHMucHJvamVjdF9pZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBzZXQgdXAgY2FsbGJhY2sgVVJMIHRlbXBsYXRlc1xuICAgICAgICBlbmRwb2ludERhdGEgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKTtcbiAgICAgICAgZW5kcG9pbnRVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIC8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBjYWxsYmFjayBVUkxzLCBpbmNsdWRpbmcgb3B0aW9uYWwgSURcbiAgICAgICAgICAgIC8vIFVzYWdlOiBlbmRwb2ludFVSTCgxNykucmVzdWx0IC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuICAgICAgICAgICAgY29uc3QgaG9zdCA9IFwiaHR0cDovL1wiICsgZW5kcG9pbnREYXRhLmhvc3Q7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0Lz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImluZGljYXRvcnNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJwZXJpb2RzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8/Zm9ybWF0PWpzb24mcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJjb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZF9mcmFtZXdvcmtcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlX2FuZF9jb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXNlclwiOiBgJHtob3N0fS9yZXN0L3YxL3VzZXIvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiBgJHtob3N0fS9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImZpbGVfdXBsb2FkXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFpc1B1YmxpYykge1xuICAgICAgICAgICAgZ2V0VXNlckRhdGEoZW5kcG9pbnREYXRhLnVzZXJJZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbmNlIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZCwgbG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgLy9UT0RPOiB0aGlzIFwiY2hhaW5lZFwiIHdheSBvZiBsb2FkaW5nIHRoZSBBUEkgZGF0YSBraW5kYSB0ZXJyaWJsZSBhbmQgc2hvdWxkIGJlIHJlcGxhY2VkXG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdyZXN1bHRzJyk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdpbmRpY2F0b3JzJyk7XG4gICAgfVxuXG4gICAgbG9hZE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIC8vIExvYWQgYSBtb2RlbCBmcm9tIHRoZSBBUEkuIEFmdGVyIGxvYWRpbmcgcmVidWlsZCB0aGUgZGF0YSB0cmVlLlxuICAgICAgICBpZiAoISB0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0pIHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWVyZ2U6IHtbbW9kZWxdOiB0aGlzLmluZGV4TW9kZWwocmVzcG9uc2UucmVzdWx0cyl9fVxuICAgICAgICAgICAgICAgICAgICApfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludFVSTCh0aGlzLnN0YXRlLnByb2plY3RJZClbbW9kZWxdLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHVwZGF0ZShcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cblxuICAgIGFzc2VtYmxlRGF0YVRyZWUoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIGxpc3Qgb2YgcmVzdWx0IG9iamVjdHMgYmFzZWQgb24gdGhlIEFQSSBjYWxsIGZvciBSZXN1bHQsIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYVxuICAgICAgICBsaXN0IG9mIGl0cyBhc3NvY2lhdGVkIGluZGljYXRvcnMgaW4gdGhlIGZpZWxkIFwiaW5kaWNhdG9yc1wiLCBlYWNoIG9mIHdoaWNoIGhvbGQgYSBsaXN0IG9mXG4gICAgICAgIGluZGljYXRvciBwZXJpb2RzIGluIHRoZSBmaWVsZCBcInBlcmlvZHNcIiBhbmQgb24gZG93biB2aWEgXCJ1cGRhdGVzXCIgYW5kIFwiY29tbWVudHNcIi5cbiAgICAgICAgVGhpcyBkYXRhIHN0cnVjdHVyZSBpcyB1c2VkIHRvIHBvcHVsYXRlIHRoZSB3aG9sZSB0cmVlIG9mIGNvbXBvbmVudHMgZWFjaCBsZXZlbCBwYXNzaW5nIHRoZVxuICAgICAgICBjaGlsZCBsaXN0IGFzIHRoZSBwcm9wIFwiaXRlbXNcIlxuICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckNoaWxkcmVuKHBhcmVudHMsIGZpZWxkTmFtZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgSGVscGVyIGZ1bmN0aW9uIHRoYXQgbGlua3MgdHdvIGxldmVscyBpbiB0aGUgZGF0YSB0cmVlLiBUaGUgbGlua2luZyBpcyBiYXNlZCBvbiB0aGVcbiAgICAgICAgICAgIGZvcmVpZ24ga2V5IGZpZWxkIHRvIHRoZSBwYXJlbnQgb2YgdGhlIGNoaWxkIGJlaW5nIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IHBhcmVudCBvYmplY3RcbiAgICAgICAgICAgIFBhcmFtczpcbiAgICAgICAgICAgICAgICBwYXJlbnRzOiBsaXN0IG9mIHBhcmVudCBvYmplY3RzLiBFYWNoIHBhcmVudCBvYmplY3QgaXMgYXNzaWduZWQgYSBuZXcgZmllbGQgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRzIHRoZSBsaXN0IG9mIGFzc29jaWF0ZWQgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzOiBvYmplY3Qgd2l0aCB0d28gZmllbGRzLCBcInBhcmVudFwiIGFuZCBcImNoaWxkcmVuXCIgdGhhdCBob2xkIHRoZSBuYW1lIG9mXG4gICAgICAgICAgICAgICAgdGhlIGZpZWxkcyBsaW5raW5nIHRoZSB0d28gbGV2ZWxzIG9mIG9iamVjdHMuXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGxpc3Qgb2YgYWxsIGNoaWxkIG9iamVjdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRzICYmIHBhcmVudHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRbZmllbGROYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPT4gY2hpbGRbZmllbGROYW1lcy5wYXJlbnRdID09PSBwYXJlbnQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYW5ub3RhdGVQZXJpb2RzKHBlcmlvZHMpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBZGQgdGhlIGZpZWxkIFwiYWN0dWFsX3ZhbHVlXCIgdG8gZWFjaCBwZXJpb2QgdXBkYXRlLCB3aGljaCBpcyB0aGUgc3VtIG9mIGFsbCB1cGRhdGVcbiAgICAgICAgICAgIHZhbHVlcyB1cCB0byB0aGlzIHBvaW50IGluIHRpbWUuIE5vdGUgdGhhdCB0aGlzIGZpZWxkIGV4aXN0cyBpbiB0aGUgZGF0YXNldCBhc1xuICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgYnV0IHdlIGNhbid0IHVzZSB0aGF0IHNpbmNlIHdlIHdhbnQgdG8gYmUgYWJsZSB0b1xuICAgICAgICAgICAgKHJlKS1jYWxjdWxhdGUgb24gZGF0YSBjaGFuZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kcyAmJiBwZXJpb2RzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmlvZC51cGRhdGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxfdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVsnYWN0dWFsX3ZhbHVlJ10gPSBwYXJzZUludCh1cGRhdGUuZGF0YSkgKyBhY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBcImNvbW1lbnRzXCJ9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LFxuICAgICAgICAgICAgdXBkYXRlcyk7XG4gICAgICAgIGNvbnN0IGFubm90YXRlZF9wZXJpb2RzID0gYW5ub3RhdGVQZXJpb2RzKHBlcmlvZHMpO1xuXG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmluZGljYXRvcnMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJpbmRpY2F0b3JcIiwgY2hpbGRyZW46IFwicGVyaW9kc1wifSxcbiAgICAgICAgICAgIGFubm90YXRlZF9wZXJpb2RzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogXCJpbmRpY2F0b3JzXCJ9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKVxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHRyZWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8UmVzdWx0cyBpdGVtcz17dHJlZX0gY2FsbGJhY2tzPXtjYWxsYmFja3N9IG1vZGVscz17dGhpcy5zdGF0ZS5tb2RlbHN9Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFJldHJpZXZlIGRhdGEgZW5kcG9pbnRzLCB0cmFuc2xhdGlvbnMgYW5kIHByb2plY3QgSURzXG4gICAgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgIGkxOG5SZXN1bHRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgIGkxOG5Nb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcblxuICAgIC8vIENoZWNrIGlmIFJlYWN0IGlzIGxvYWRlZFxuICAgIC8vIGlmICh0eXBlb2YgUmVhY3QgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBSZWFjdERPTSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHNtb290aFNjcm9sbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyAgICAgc21vb3RoU2Nyb2xsLmluaXQoe3VwZGF0ZVVSTDogZmFsc2V9KTtcbiAgICAvLyAgICAgaW5pdFJlYWN0KCk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgbG9hZEFuZFJlbmRlclJlYWN0KCk7XG4gICAgLy8gfVxufSk7Il19
