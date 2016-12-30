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
                APICall('GET', endpointURL(this.state.projectId)[model], '', success);
            }
        }
    }, {
        key: 'updateModel',
        value: function updateModel(model, data) {
            var id = data.id;
            var newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $merge: _defineProperty({}, id, data) }));
            this.setState({ models: newState }, function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktbmV3LXJlc3VsdHMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1lBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFoQkE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBUUEsSUFBSSxrQkFBSjtBQUFBLElBQ0ksb0JBREo7QUFBQSxJQUVJLGlCQUZKO0FBQUEsSUFHSSxxQkFISjtBQUFBLElBSUksb0JBSko7QUFBQSxJQUtJLG1CQUxKO0FBQUEsSUFNSSxtQkFOSjtBQUFBLElBT0ksYUFQSjs7QUFTQTtBQUNBLE9BQU8sTUFBUCxHQUFnQixPQUFPLE1BQVAsSUFBa0I7QUFBQSxXQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUI7QUFBQSxlQUFPLElBQUksR0FBSixDQUFQO0FBQUEsS0FBckIsQ0FBUDtBQUFBLENBQWxDOztBQUVBLFNBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNsQixRQUFJLFFBQVEsU0FBWixFQUF1QjtBQUNuQixlQUFPLE9BQU8sTUFBUCxDQUFjLEdBQWQsQ0FBUDtBQUNIO0FBQ0QsV0FBTyxTQUFQO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDckIsUUFBSSxjQUFjLElBQWxCO0FBQ0EsUUFBSSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxNQUFULEtBQW9CLEVBQTNDLEVBQStDO0FBQzNDLFlBQUksVUFBVSxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBZDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGdCQUFJLFNBQVMsUUFBUSxD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LENBQXdCLHVCQUF4QixDQUF4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbi8vIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4vLyBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbi8vIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXG5cbi8vIGNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbi8vIGNvbnN0IFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG4vLyBjb25zdCB1cGRhdGUgPSByZXF1aXJlKCdpbW11dGFiaWxpdHktaGVscGVyJyk7XG4vLyBjb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJ3JjLWNvbGxhcHNlJyk7XG4vLyBjb25zdCBQYW5lbCA9IENvbGxhcHNlLlBhbmVsO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cbmxldCBjc3JmdG9rZW4sXG4gICAgaTE4blJlc3VsdHMsXG4gICAgaXNQdWJsaWMsXG4gICAgZW5kcG9pbnREYXRhLFxuICAgIGVuZHBvaW50VVJMLFxuICAgIGkxOG5Nb250aHMsXG4gICAgcHJvamVjdElkcyxcbiAgICB1c2VyO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cbmZ1bmN0aW9uIGRlSW5kZXgob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qIENTUkYgVE9LRU4gKHRoaXMgc2hvdWxkIHJlYWxseSBiZSBhZGRlZCBpbiBiYXNlLmh0bWwsIHdlIHVzZSBpdCBldmVyeXdoZXJlKSAqL1xuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBjb29raWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT0gKG5hbWUgKyAnPScpKSB7XG4gICAgICAgICAgICAgICAgY29va2llVmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQoY29va2llLnN1YnN0cmluZyhuYW1lLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29va2llVmFsdWU7XG59XG5jc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuXG5cbmZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCBcIlgtQ1NSRlRva2VuXCI6IGNzcmZ0b2tlbn0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcjtcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICBjYXNlIFwiR0VUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQT1NUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQT1NUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQVVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BVVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUEFUQ0hcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BBVENIJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJERUxFVEVcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRGF0YShpZCkge1xuICAgIC8vIEdldCB0aGUgdXNlciBkYXRhIGZyb20gdGhlIEFQSSBhbmQgc3RvcmVzIGl0IGluIHRoZSBnbG9iYWwgdXNlciB2YXJpYWJsZVxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlO1xuICAgIH07XG4gICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRVUkwoaWQpLnVzZXIsICcnLCBzdWNjZXNzKTtcbn1cblxuZnVuY3Rpb24gdGl0bGVDYXNlKHMpIHtcbiAgICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG59XG5cbmNsYXNzIExldmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubW9kZWxzW3RoaXMuc3RhdGUubW9kZWxdID09PSB1bmRlZmluZWQgfHwgaXRlbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtLCBpKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5jbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5jbGFzcyBVcGRhdGVzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJ1cGRhdGVzXCJ9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdjb21tZW50cycpO1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHVwZGF0ZSwgaSkge1xuICAgICAgICBjb25zdCBvcmdhbmlzYXRpb24gPSB1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZTtcbiAgICAgICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgK1wiIFwiKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHVwZGF0ZS5kYXRhO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBkYXRhOiAke2RhdGF9YDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlclRleHR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj57dXBkYXRlLmRhdGF9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludFVSTChwZXJpb2RJZCkucGVyaW9kX2ZyYW1ld29yaztcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5cbmNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInBlcmlvZHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kLCBpKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAgICAgICAgIC8vIERpc3BsYXkgYSBkYXRlU3RyaW5nIGxpa2UgXCIyNSBKYW4gMjAxNlwiXG4gICAgICAgICAgICBpZiAoZGF0ZVN0cmluZyAhPT0gdW5kZWZpbmVkICYmIGRhdGVTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXkgPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtb250aCA9IGkxOG5Nb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXkgKyBcIiBcIiArIG1vbnRoICsgXCIgXCIgKyB5ZWFyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGkxOG5SZXN1bHRzLnVua25vd25fZGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0KSArICcgLSAnICsgZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQpO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5QZXJpb2Q6IHtwZXJpb2REYXRlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IsIGkpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGljYXRvci5iYXNlbGluZV95ZWFyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuUmVzdWx0cy5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kcyBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxzPXt0aGlzLnByb3BzLm1vZGVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG59XG5cblxuY2xhc3MgUmVzdWx0cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9XG4gICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZHMucHJvamVjdF9pZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBzZXQgdXAgY2FsbGJhY2sgVVJMIHRlbXBsYXRlc1xuICAgICAgICBlbmRwb2ludERhdGEgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKTtcbiAgICAgICAgZW5kcG9pbnRVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIC8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBjYWxsYmFjayBVUkxzLCBpbmNsdWRpbmcgb3B0aW9uYWwgSURcbiAgICAgICAgICAgIC8vIFVzYWdlOiBlbmRwb2ludFVSTCgxNykucmVzdWx0IC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuICAgICAgICAgICAgY29uc3QgaG9zdCA9IFwiaHR0cDovL1wiICsgZW5kcG9pbnREYXRhLmhvc3Q7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvcmVzdWx0Lz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImluZGljYXRvcnNcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJwZXJpb2RzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlc1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8/Zm9ybWF0PWpzb24mcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgICAgICAgICAgXCJjb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcInBlcmlvZF9mcmFtZXdvcmtcIjogYCR7aG9zdH0vcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlX2FuZF9jb21tZW50c1wiOiBgJHtob3N0fS9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICAgICAgICAgIFwidXNlclwiOiBgJHtob3N0fS9yZXN0L3YxL3VzZXIvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiBgJHtob3N0fS9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgICAgICAgICBcImZpbGVfdXBsb2FkXCI6IGAke2hvc3R9L3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUHVibGljKSB7XG4gICAgICAgICAgICBnZXRVc2VyRGF0YShlbmRwb2ludERhdGEudXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWVyZ2U6IHtbbW9kZWxdOiB0aGlzLmluZGV4TW9kZWwocmVzcG9uc2UucmVzdWx0cyl9fVxuICAgICAgICAgICAgICAgICAgICApfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludFVSTCh0aGlzLnN0YXRlLnByb2plY3RJZClbbW9kZWxdLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gdXBkYXRlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpbmRleE1vZGVsKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgZnVuY3Rpb24oYWNjLCBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IG9ialsnaWQnXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXhlZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGluZGV4ZWRPYmpbaWRdID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgaW5kZXhlZE9iailcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgfVxuXG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgZWFjaCBvZiB3aGljaCBob2xkcyBhIGxpc3Qgb2YgaW5kaWNhdG9yIHBlcmlvZFxuICAgICAgICBkYXRhIG9iamVjdHMgaW4gdGhlIGZpZWxkIFwidXBkYXRlc1wiLlxuICAgICAgICBOb3RlIHRoYXQgdGhlIFwibG93ZXN0XCIgbGV2ZWwgaW4gdGhlIGNhbGwgY2hhaW4sIGxvYWRVcGRhdGVzQW5kQ29tbWVudHMoKSwgcmV0cmlldmVzIGJvdGhcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZCBkYXRhIChcInVwZGF0ZXNcIikgYW5kIGNvbW1lbnRzIG5pY2VseSBzaW1pbGFybHkgdG8gdGhlIHJlc3Qgb2YgdGhlIGRhdGEuXG4gICAgICAgIEFsbCByZWxhdGlvbnMgYmFzZWQgb24gdGhlIHJlbGV2YW50IGZvcmVpZ24ga2V5cyBsaW5raW5nIHRoZSBtb2RlbCBvYmplY3RzLlxuICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZF9uYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50cy5tYXAoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkX25hbWVzLmNoaWxkcmVuXSA9IGNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPT4gY2hpbGRbZmllbGRfbmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBcImNvbW1lbnRzXCJ9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnBlcmlvZHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJwZXJpb2RcIiwgY2hpbGRyZW46IFwidXBkYXRlc1wifSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBcInBlcmlvZHNcIn0sXG4gICAgICAgICAgICBwZXJpb2RzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnJlc3VsdHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFwiaW5kaWNhdG9yc1wifSxcbiAgICAgICAgICAgIGluZGljYXRvcnNcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5zdGF0ZS5yZXN1bHRzRGF0YVRyZWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIGxvYWRNb2RlbDogdGhpcy5sb2FkTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHVwZGF0ZU1vZGVsOiB0aGlzLnVwZGF0ZU1vZGVsLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHMgaXRlbXM9e3RyZWV9IGNhbGxiYWNrcz17Y2FsbGJhY2tzfSBtb2RlbHM9e3RoaXMuc3RhdGUubW9kZWxzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXRyaWV2ZSBkYXRhIGVuZHBvaW50cywgdHJhbnNsYXRpb25zIGFuZCBwcm9qZWN0IElEc1xuICAgIGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICBpMThuUmVzdWx0cyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICBpMThuTW9udGhzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaTE4bk1vbnRocycpLmlubmVySFRNTCk7XG4gICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcblxuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG5cbiAgICAvLyBDaGVjayBpZiBSZWFjdCBpcyBsb2FkZWRcbiAgICAvLyBpZiAodHlwZW9mIFJlYWN0ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgUmVhY3RET00gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzbW9vdGhTY3JvbGwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gICAgIHNtb290aFNjcm9sbC5pbml0KHt1cGRhdGVVUkw6IGZhbHNlfSk7XG4gICAgLy8gICAgIGluaXRSZWFjdCgpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIGxvYWRBbmRSZW5kZXJSZWFjdCgpO1xuICAgIC8vIH1cbn0pOyJdfQ==
