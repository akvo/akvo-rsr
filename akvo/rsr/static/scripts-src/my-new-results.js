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
                if (callback !== undefined) {
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
            if (this.state.models[model] === undefined) {
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
                if (parents !== undefined) {
                    return parents.map(function (parent) {
                        if (children !== undefined) {
                            parent[fieldNames.children] = children.filter(function (child) {
                                return child[fieldNames.parent] === parent.id;
                            });
                        }
                        return parent;
                    });
                } else {
                    return undefined;
                }
            }

            function annotatePeriods(periods) {
                /*
                Add the field "actual_value" to each period update, which is the sum of all update
                values up to this point in time. Note that this field exists in the dataset as
                update.period_actual_value but we can't use that since we want to be able to
                (re)-calculate on data changes.
                 */
                if (periods !== undefined) {
                    return periods.map(function (period) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1lBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFoQkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBUUEsSUFBSSxrQkFBSjtBQUFBLElBQ0ksb0JBREo7QUFBQSxJQUVJLGlCQUZKO0FBQUEsSUFHSSxxQkFISjtBQUFBLElBSUksb0JBSko7QUFBQSxJQUtJLG1CQUxKO0FBQUEsSUFNSSxtQkFOSjtBQUFBLElBT0ksYUFQSjs7QUFTQTtBQUNBLE9BQU8sTUFBUCxHQUFnQixPQUFPLE1BQVAsSUFBa0I7QUFBQSxXQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUI7QUFBQSxlQUFPLElBQUksR0FBSixDQUFQO0FBQUEsS0FBckIsQ0FBUDtBQUFBLENBQWxDOztBQUVBO0FBQ0EsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3JCLFFBQUksY0FBYyxJQUFsQjtBQUNBLFFBQUksU0FBUyxNQUFULElBQW1CLFNBQVMsTUFBVCxLQUFvQixFQUEzQyxFQUErQztBQUMzQyxZQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUNyQyxnQkFBSSxTQUFTLFFBQVEsQ0FBUixFQUFXLElBQVgsRUFBYjtBQUNBLGdCQUFJLE9BQU8sU0FBUCxDQUFpQixDQUFqQixFQUFvQixLQUFLLE1BQUwsR0FBYyxDQUFsQyxLQUF5QyxPQUFPLEdBQXBELEVBQTBEO0FBQ3RELDhCQUFjLG1CQUFtQixP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O0FBRkMsYUFBbEI7QUFJQSxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE9BQWxCLEtBQThCLFNBQWxDLEVBQTZDO0FBQ3pDLHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSCxhQUpELE1BSU8sSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUN4Qix1QkFDSSw4QkFBQyxPQUFELElBQVMsT0FBTyxJQUFoQixFQUFzQixXQUFXLFNBQWpDLEVBQTRDLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBL0QsR0FESjtBQUdILGFBSk0sTUFJQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBM05hLGdCQUFNLFM7O0FBaU94QixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JEO0FBQ0EsZUFBVyxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBL0MsRUFBMEQsTUFBckU7QUFDQSxrQkFBYyxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDLFNBQXhELENBQWQ7QUFDQSxpQkFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBakQsQ0FBYjtBQUNBLGlCQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUFsRCxDQUFiOztBQUVBLHVCQUFTLE1BQVQsQ0FBZ0IsOEJBQUMsR0FBRCxPQUFoQixFQUF3QixTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuLy8gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbi8vIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuLy8gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cblxuLy8gY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuLy8gY29uc3QgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbi8vIGNvbnN0IHVwZGF0ZSA9IHJlcXVpcmUoJ2ltbXV0YWJpbGl0eS1oZWxwZXInKTtcbi8vIGNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgncmMtY29sbGFwc2UnKTtcbi8vIGNvbnN0IFBhbmVsID0gQ29sbGFwc2UuUGFuZWw7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcblxubGV0IGNzcmZ0b2tlbixcbiAgICBpMThuUmVzdWx0cyxcbiAgICBpc1B1YmxpYyxcbiAgICBlbmRwb2ludERhdGEsXG4gICAgZW5kcG9pbnRVUkwsXG4gICAgaTE4bk1vbnRocyxcbiAgICBwcm9qZWN0SWRzLFxuICAgIHVzZXI7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuLyogQ1NSRiBUT0tFTiAodGhpcyBzaG91bGQgcmVhbGx5IGJlIGFkZGVkIGluIGJhc2UuaHRtbCwgd2UgdXNlIGl0IGV2ZXJ5d2hlcmUpICovXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cbmNzcmZ0b2tlbiA9IGdldENvb2tpZSgnY3NyZnRva2VuJyk7XG5cblxuZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsIFwiWC1DU1JGVG9rZW5cIjogY3NyZnRva2VufSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBoYW5kbGVyO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBPU1RcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BPU1QnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBVVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUFVUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQQVRDSFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUEFUQ0gnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIkRFTEVURVwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAudGhlbihjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJEYXRhKGlkKSB7XG4gICAgLy8gR2V0IHRoZSB1c2VyIGRhdGEgZnJvbSB0aGUgQVBJIGFuZCBzdG9yZXMgaXQgaW4gdGhlIGdsb2JhbCB1c2VyIHZhcmlhYmxlXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICB1c2VyID0gcmVzcG9uc2U7XG4gICAgfTtcbiAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludFVSTChpZCkudXNlciwgJycsIHN1Y2Nlc3MpO1xufVxuXG5mdW5jdGlvbiB0aXRsZUNhc2Uocykge1xuICAgIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgIC8vIERpc3BsYXkgYSBkYXRlU3RyaW5nIGxpa2UgXCIyNSBKYW4gMjAxNlwiXG4gICAgaWYgKGRhdGVTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBkYXRlU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIGkxOG5SZXN1bHRzLnVua25vd25fZGF0ZTtcbn1cblxuY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tb2RlbHNbdGhpcy5zdGF0ZS5tb2RlbF0gPT09IHVuZGVmaW5lZCB8fCBpdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIFdoZW46IHtkaXNwbGF5RGF0ZSh1cGRhdGUuY3JlYXRlZF9hdCl9IHxcbiAgICAgICAgICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgICAgICAgICBTdGF0dXM6IHt1cGRhdGUuc3RhdHVzfSA8YnIvPlxuICAgICAgICAgICAgICAgICAgICBVcGRhdGUgdmFsdWU6IHt1cGRhdGUuZGF0YX0gfCB7LypcbiAgICAgICAgICAgICAgICAgICAgICAgIE5PVEU6IHdlIHVzZSB1cGRhdGUuYWN0dWFsX3ZhbHVlLCBhIHZhbHVlIGNhbGN1bGF0ZWQgaW4gQXBwLmFubm90YXRlKCksIG5vdFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgZnJvbSB0aGUgYmFja2VuZFxuICAgICAgICAgICAgICAgICAgICAqL31cbiAgICAgICAgICAgICAgICAgICAgQWN0dWFsIHRvdGFsIGZvciB0aGlzIHBlcmlvZCAoaW5jbHVkaW5nIHRoaXMgdXBkYXRlKToge3VwZGF0ZS5hY3R1YWxfdmFsdWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludFVSTChwZXJpb2RJZCkucGVyaW9kX2ZyYW1ld29yaztcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInBlcmlvZHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kLCBpKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0KSArICcgLSAnICsgZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQpO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgUGVyaW9kOiB7cGVyaW9kRGF0ZX0gfFxuICAgICAgICAgICAgICAgICAgICBUYXJnZXQgdmFsdWU6IHtwZXJpb2QudGFyZ2V0X3ZhbHVlfSB8XG4gICAgICAgICAgICAgICAgICAgIEFjdHVhbCB2YWx1ZToge3BlcmlvZC5hY3R1YWxfdmFsdWV9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXMgaXRlbXM9e3BlcmlvZC51cGRhdGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2kxOG5SZXN1bHRzLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV92YWx1ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cblxuXG5jbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJyZXN1bHRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHJlc3VsdCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJSZXN1bHQ6IFwiICsgcmVzdWx0LnRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkcy5wcm9qZWN0X2lkXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIHNldCB1cCBjYWxsYmFjayBVUkwgdGVtcGxhdGVzXG4gICAgICAgIGVuZHBvaW50RGF0YSA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZHBvaW50LWRhdGEnKS5pbm5lckhUTUwpO1xuICAgICAgICBlbmRwb2ludFVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGNhbGxiYWNrIFVSTHMsIGluY2x1ZGluZyBvcHRpb25hbCBJRFxuICAgICAgICAgICAgLy8gVXNhZ2U6IGVuZHBvaW50VVJMKDE3KS5yZXN1bHQgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG4gICAgICAgICAgICBjb25zdCBob3N0ID0gXCJodHRwOi8vXCIgKyBlbmRwb2ludERhdGEuaG9zdDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInJlc3VsdHNcIjogYCR7aG9zdH0vcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiaW5kaWNhdG9yc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvci8/Zm9ybWF0PWpzb24mcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImNvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2NvbW1lbnQvP2Zvcm1hdD1qc29uJmRhdGFfX3BlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwicGVyaW9kX2ZyYW1ld29ya1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJ1c2VyXCI6IGAke2hvc3R9L3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwicGFydG5lcnNoaXBzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwiZmlsZV91cGxvYWRcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWlzUHVibGljKSB7XG4gICAgICAgICAgICBnZXRVc2VyRGF0YShlbmRwb2ludERhdGEudXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50VVJMKHRoaXMuc3RhdGUucHJvamVjdElkKVttb2RlbF0sICcnLCBzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKG1vZGVsLCBkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gdXBkYXRlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpbmRleE1vZGVsKGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ3JlYXRlIGFuIGluZGV4ZWQgdmVyc2lvbiBvZiBhIG1vZGVsIGJ5IGNyZWF0aW5nIGEgbGlzdCBvZiBvYmplY3RzLCBvbmUgZm9yIGVhY2ggbW9kZWxcbiAgICAgICAgaW5zdGFuY2Ugd2hlcmUgdGhlIG9iamVjdCBrZXkgaXMgdGhlIGlkIG9mIHRoZSBpbnN0YW5jZSBhbmQgdGhlIHZhbHVlIGlzIHRoZSBmdWxsIGluc3RhbmNlLlxuICAgICAgICBUaGlzIGNvbnN0cnVjdCBpcyB1c2VkIHRvIGJlIGFibGUgdG8gZWFzaWx5IHVwZGF0ZSBpbmRpdmlkdWFsIGluc3RhbmNlcy5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFjYywgb2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBvYmpbJ2lkJ107XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ZWRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICBpbmRleGVkT2JqW2lkXSA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIGluZGV4ZWRPYmopXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge31cbiAgICAgICAgKVxuICAgIH1cblxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGFuZCBvbiBkb3duIHZpYSBcInVwZGF0ZXNcIiBhbmQgXCJjb21tZW50c1wiLlxuICAgICAgICBUaGlzIGRhdGEgc3RydWN0dXJlIGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHdob2xlIHRyZWUgb2YgY29tcG9uZW50cyBlYWNoIGxldmVsIHBhc3NpbmcgdGhlXG4gICAgICAgIGNoaWxkIGxpc3QgYXMgdGhlIHByb3AgXCJpdGVtc1wiXG4gICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGROYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBIZWxwZXIgZnVuY3Rpb24gdGhhdCBsaW5rcyB0d28gbGV2ZWxzIGluIHRoZSBkYXRhIHRyZWUuIFRoZSBsaW5raW5nIGlzIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgZm9yZWlnbiBrZXkgZmllbGQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY2hpbGQgYmVpbmcgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcGFyZW50IG9iamVjdFxuICAgICAgICAgICAgUGFyYW1zOlxuICAgICAgICAgICAgICAgIHBhcmVudHM6IGxpc3Qgb2YgcGFyZW50IG9iamVjdHMuIEVhY2ggcGFyZW50IG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyBmaWVsZCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgaG9sZHMgdGhlIGxpc3Qgb2YgYXNzb2NpYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXM6IG9iamVjdCB3aXRoIHR3byBmaWVsZHMsIFwicGFyZW50XCIgYW5kIFwiY2hpbGRyZW5cIiB0aGF0IGhvbGQgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICB0aGUgZmllbGRzIGxpbmtpbmcgdGhlIHR3byBsZXZlbHMgb2Ygb2JqZWN0cy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbGlzdCBvZiBhbGwgY2hpbGQgb2JqZWN0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHBhcmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRbZmllbGROYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYW5ub3RhdGVQZXJpb2RzKHBlcmlvZHMpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBZGQgdGhlIGZpZWxkIFwiYWN0dWFsX3ZhbHVlXCIgdG8gZWFjaCBwZXJpb2QgdXBkYXRlLCB3aGljaCBpcyB0aGUgc3VtIG9mIGFsbCB1cGRhdGVcbiAgICAgICAgICAgIHZhbHVlcyB1cCB0byB0aGlzIHBvaW50IGluIHRpbWUuIE5vdGUgdGhhdCB0aGlzIGZpZWxkIGV4aXN0cyBpbiB0aGUgZGF0YXNldCBhc1xuICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgYnV0IHdlIGNhbid0IHVzZSB0aGF0IHNpbmNlIHdlIHdhbnQgdG8gYmUgYWJsZSB0b1xuICAgICAgICAgICAgKHJlKS1jYWxjdWxhdGUgb24gZGF0YSBjaGFuZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAocGVyaW9kcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMubWFwKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlSW5kZXgob2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuc3RhdGUubW9kZWxzO1xuICAgICAgICBjb25zdCB1cGRhdGVzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy51cGRhdGVzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiZGF0YVwiLCBjaGlsZHJlbjogXCJjb21tZW50c1wifSxcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmNvbW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnBlcmlvZHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJwZXJpb2RcIiwgY2hpbGRyZW46IFwidXBkYXRlc1wifSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0ZWRfcGVyaW9kcyA9IGFubm90YXRlUGVyaW9kcyhwZXJpb2RzKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBcInBlcmlvZHNcIn0sXG4gICAgICAgICAgICBhbm5vdGF0ZWRfcGVyaW9kc1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnJlc3VsdHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFwiaW5kaWNhdG9yc1wifSxcbiAgICAgICAgICAgIGluZGljYXRvcnNcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5zdGF0ZS5yZXN1bHRzRGF0YVRyZWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIGxvYWRNb2RlbDogdGhpcy5sb2FkTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHVwZGF0ZU1vZGVsOiB0aGlzLnVwZGF0ZU1vZGVsLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHMgaXRlbXM9e3RyZWV9IGNhbGxiYWNrcz17Y2FsbGJhY2tzfSBtb2RlbHM9e3RoaXMuc3RhdGUubW9kZWxzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXRyaWV2ZSBkYXRhIGVuZHBvaW50cywgdHJhbnNsYXRpb25zIGFuZCBwcm9qZWN0IElEc1xuICAgIGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICBpMThuUmVzdWx0cyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICBpMThuTW9udGhzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaTE4bk1vbnRocycpLmlubmVySFRNTCk7XG4gICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcblxuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG5cbiAgICAvLyBDaGVjayBpZiBSZWFjdCBpcyBsb2FkZWRcbiAgICAvLyBpZiAodHlwZW9mIFJlYWN0ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgUmVhY3RET00gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzbW9vdGhTY3JvbGwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gICAgIHNtb290aFNjcm9sbC5pbml0KHt1cGRhdGVVUkw6IGZhbHNlfSk7XG4gICAgLy8gICAgIGluaXRSZWFjdCgpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIGxvYWRBbmRSZW5kZXJSZWFjdCgpO1xuICAgIC8vIH1cbn0pOyJdfQ==
