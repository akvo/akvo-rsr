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

var _Results = require('./Results.jsx');

var _Results2 = _interopRequireDefault(_Results);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var i18nResults = void 0,
    isPublic = void 0,
    endpointData = void 0,
    i18nMonths = void 0,
    projectIds = void 0;

// from http://stackoverflow.com/questions/7306669/
Object.values = Object.values || function (obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
};

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        _this.state = {
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
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
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
                (0, _utils.APICall)('GET', _utils.endpoints[model](this.state.projectId), '', success);
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
                    if (period.updates) {
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
                return obj && Object.values(obj);
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
            if (!this.state.models.results) {
                return _react2.default.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            } else if (tree.length > 0) {
                return _react2.default.createElement(_Results2.default, { items: tree, callbacks: callbacks, models: this.state.models });
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
});

},{"./Results.jsx":6,"./utils.js":8,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Comments = function (_Level) {
    _inherits(Comments, _Level);

    function Comments(props) {
        _classCallCheck(this, Comments);

        var _this = _possibleConstructorReturn(this, (Comments.__proto__ || Object.getPrototypeOf(Comments)).call(this, props));

        _this.state = { model: "comments" };
        return _this;
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
}(_Level3.default);

exports.default = Comments;

},{"./Level.jsx":4,"rc-collapse":"rc-collapse","react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

var _Periods = require('./Periods.jsx');

var _Periods2 = _interopRequireDefault(_Periods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Indicators = function (_Level) {
    _inherits(Indicators, _Level);

    function Indicators(props) {
        _classCallCheck(this, Indicators);

        var _this = _possibleConstructorReturn(this, (Indicators.__proto__ || Object.getPrototypeOf(Indicators)).call(this, props));

        _this.state = { model: "indicators" };
        return _this;
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
                        'Baseline year: ',
                        indicator.baseline_year
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'baseline-value' },
                        'Baseline value: ',
                        indicator.baseline_value
                    )
                ),
                _react2.default.createElement(_Periods2.default, { items: indicator.periods,
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
}(_Level3.default);

exports.default = Indicators;

},{"./Level.jsx":4,"./Periods.jsx":5,"rc-collapse":"rc-collapse","react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _rcCollapse2 = _interopRequireDefault(_rcCollapse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

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

exports.default = Level;

},{"rc-collapse":"rc-collapse","react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

var _Updates = require('./Updates.jsx');

var _Updates2 = _interopRequireDefault(_Updates);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PeriodLockToggle = function (_React$Component) {
    _inherits(PeriodLockToggle, _React$Component);

    function PeriodLockToggle(props) {
        _classCallCheck(this, PeriodLockToggle);

        var _this = _possibleConstructorReturn(this, (PeriodLockToggle.__proto__ || Object.getPrototypeOf(PeriodLockToggle)).call(this, props));

        _this.lockToggle = _this.lockToggle.bind(_this);
        _this.state = { locking: false };
        return _this;
    }

    _createClass(PeriodLockToggle, [{
        key: 'basePeriodSave',
        value: function basePeriodSave(periodId, data, callback) {
            // Base function for saving a period with a data Object.
            var url = _utils.endpoints.period_framework(periodId);
            function success(data) {
                this.props.callbacks.updateModel("periods", data);

                // Call the callback, if not undefined.
                if (callback) {
                    callback();
                }
            }
            (0, _utils.APICall)('PATCH', url, data, success.bind(this));
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

var Periods = function (_Level) {
    _inherits(Periods, _Level);

    function Periods(props) {
        _classCallCheck(this, Periods);

        var _this2 = _possibleConstructorReturn(this, (Periods.__proto__ || Object.getPrototypeOf(Periods)).call(this, props));

        _this2.state = { model: "periods" };
        return _this2;
    }

    _createClass(Periods, [{
        key: 'renderPanel',
        value: function renderPanel(period, i) {
            var periodDate = (0, _utils.displayDate)(period.period_start) + ' - ' + (0, _utils.displayDate)(period.period_end);
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
                _react2.default.createElement(_Updates2.default, { items: period.updates,
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
}(_Level3.default);

exports.default = Periods;

},{"./Level.jsx":4,"./Updates.jsx":7,"./utils.js":8,"rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

var _Indicators = require('./Indicators.jsx');

var _Indicators2 = _interopRequireDefault(_Indicators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Results = function (_Level) {
    _inherits(Results, _Level);

    function Results(props) {
        _classCallCheck(this, Results);

        var _this = _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).call(this, props));

        _this.state = { model: "results" };
        return _this;
    }

    _createClass(Results, [{
        key: 'renderPanel',
        value: function renderPanel(result, i) {
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Result: " + result.title, key: i },
                _react2.default.createElement(_Indicators2.default, {
                    items: result.indicators,
                    models: this.props.models,
                    callbacks: this.props.callbacks })
            );
        }
    }]);

    return Results;
}(_Level3.default);

exports.default = Results;

},{"./Indicators.jsx":3,"./Level.jsx":4,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

var _Comments = require('./Comments.jsx');

var _Comments2 = _interopRequireDefault(_Comments);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Updates = function (_Level) {
    _inherits(Updates, _Level);

    function Updates(props) {
        _classCallCheck(this, Updates);

        var _this = _possibleConstructorReturn(this, (Updates.__proto__ || Object.getPrototypeOf(Updates)).call(this, props));

        _this.state = { model: "updates" };
        return _this;
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
                    (0, _utils.displayDate)(update.created_at),
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
                    _react2.default.createElement(_Comments2.default, {
                        items: update.comments,
                        models: this.props.models,
                        callbacks: this.props.callbacks })
                )
            );
        }
    }]);

    return Updates;
}(_Level3.default);

exports.default = Updates;

},{"./Comments.jsx":2,"./Level.jsx":4,"./utils.js":8,"rc-collapse":"rc-collapse","react":"react"}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.endpoints = undefined;
exports.displayDate = displayDate;
exports.getCookie = getCookie;
exports.APICall = APICall;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return "Unknown date";
} /*
      Akvo RSR is covered by the GNU Affero General Public License.
      See more details in the license.txt file located at the root folder of the
      Akvo RSR module. For additional details on the GNU license please see
      < http://www.gnu.org/licenses/agpl.html >.
   */

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

function APICall(method, url, data, callback, retries) {
    function modify(method, url, data) {
        return (0, _isomorphicFetch2.default)(url, {
            credentials: 'same-origin',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            },
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

// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpointURL(17).result -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
var endpoints = exports.endpoints = {
    "result": function result(id) {
        return "/rest/v1/result/" + id + "/?format=json";
    },
    "results": function results(id) {
        return "/rest/v1/result/?format=json&project=" + id;
    },
    "indicators": function indicators(id) {
        return "/rest/v1/indicator/?format=json&result__project=" + id;
    },
    "periods": function periods(id) {
        return "/rest/v1/indicator_period/?format=json&indicator__result__project=" + id;
    },
    "updates": function updates(id) {
        return "/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=" + id;
    },
    "comments": function comments(id) {
        return "/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=" + id;
    },
    "period_framework": function period_framework(id) {
        return "/rest/v1/indicator_period_framework/" + id + "/?format=json";
    },
    "update_and_comments": function update_and_comments(id) {
        return "/rest/v1/indicator_period_data_framework/" + id + "/?format=json";
    },
    "updates_and_comments": function updates_and_comments() {
        return "/rest/v1/indicator_period_data_framework/?format=json";
    },
    "user": function user(id) {
        return "/rest/v1/user/" + id + "/?format=json";
    },
    "partnerships": function partnerships(id) {
        return "/rest/v1/partnership/?format=json&project=" + id;
    },
    "file_upload": function file_upload(id) {
        return "/rest/v1/indicator_period_data/" + id + "/upload_file/?format=json";
    }
};

},{"isomorphic-fetch":"isomorphic-fetch"}]},{},[1,4,2,7,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBLElBQUksb0JBQUo7QUFBQSxJQUNJLGlCQURKO0FBQUEsSUFFSSxxQkFGSjtBQUFBLElBR0ksbUJBSEo7QUFBQSxJQUlJLG1CQUpKOztBQU1BO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNU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O0FBWkUsQ0FBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMuanN4JztcbmltcG9ydCB7QVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IGkxOG5SZXN1bHRzLFxuICAgIGlzUHVibGljLFxuICAgIGVuZHBvaW50RGF0YSxcbiAgICBpMThuTW9udGhzLFxuICAgIHByb2plY3RJZHM7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkcy5wcm9qZWN0X2lkXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0SWQpLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHVwZGF0ZShcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlUGVyaW9kcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IFwiY29tbWVudHNcIn0sXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5jb21tZW50cylcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwZXJpb2RzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5wZXJpb2RzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicGVyaW9kXCIsIGNoaWxkcmVuOiBcInVwZGF0ZXNcIn0sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGVkX3BlcmlvZHMgPSBhbm5vdGF0ZVBlcmlvZHMocGVyaW9kcyk7XG5cbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBcImluZGljYXRvcnNcIn0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMuc3RhdGUucmVzdWx0c0RhdGFUcmVlO1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBsb2FkTW9kZWw6IHRoaXMubG9hZE1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICB1cGRhdGVNb2RlbDogdGhpcy51cGRhdGVNb2RlbC5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzIGl0ZW1zPXt0cmVlfSBjYWxsYmFja3M9e2NhbGxiYWNrc30gbW9kZWxzPXt0aGlzLnN0YXRlLm1vZGVsc30vPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXRyaWV2ZSBkYXRhIGVuZHBvaW50cywgdHJhbnNsYXRpb25zIGFuZCBwcm9qZWN0IElEc1xuICAgIGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICBpMThuUmVzdWx0cyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICBpMThuTW9udGhzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaTE4bk1vbnRocycpLmlubmVySFRNTCk7XG4gICAgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcblxuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IFBlcmlvZHMgZnJvbSAnLi9QZXJpb2RzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvciwgaSkge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZWxpbmUgeWVhcjoge2luZGljYXRvci5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZWxpbmUgdmFsdWU6IHtpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgaWYgKCEgdGhpcy5wcm9wcy5tb2RlbHNbdGhpcy5zdGF0ZS5tb2RlbF0gfHwgISBpdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtLCBpKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IFVwZGF0ZXMgZnJvbSAnLi9VcGRhdGVzLmpzeCdcblxuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tICcuL3V0aWxzLmpzJztcblxuXG5jbGFzcyBQZXJpb2RMb2NrVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmxvY2tUb2dnbGUgPSB0aGlzLmxvY2tUb2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtsb2NraW5nOiBmYWxzZX07XG4gICAgfVxuXG4gICAgYmFzZVBlcmlvZFNhdmUocGVyaW9kSWQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEJhc2UgZnVuY3Rpb24gZm9yIHNhdmluZyBhIHBlcmlvZCB3aXRoIGEgZGF0YSBPYmplY3QuXG4gICAgICAgIGNvbnN0IHVybCA9IGVuZHBvaW50cy5wZXJpb2RfZnJhbWV3b3JrKHBlcmlvZElkKTtcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBBUElDYWxsKCdQQVRDSCcsIHVybCwgZGF0YSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBsb2NraW5nVG9nZ2xlKGxvY2tpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bG9ja2luZzogbG9ja2luZ30pO1xuICAgIH1cblxuICAgIG5vdExvY2tpbmcoKSB7XG4gICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZShmYWxzZSk7XG4gICAgfVxuXG4gICAgbG9ja1RvZ2dsZShlKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmJhc2VQZXJpb2RTYXZlKHRoaXMucHJvcHMucGVyaW9kLmlkLCB7bG9ja2VkOiAhdGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkfSwgdGhpcy5ub3RMb2NraW5nLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgaWNvbiwgbGFiZWw7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2FkaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPXsnZmEgZmEtbG9jayd9Lz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiVW5sb2NrIHBlcmlvZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXVubG9jay1hbHRcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2NrIHBlcmlvZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmxvY2tUb2dnbGV9XG4gICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgIHN0eWxlPXt7ZmxvYXQ6ICdyaWdodCcsIG1hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgIHtpY29ufVxuICAgICAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJpb2RzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJwZXJpb2RzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHBlcmlvZCwgaSkge1xuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCkgKyAnIC0gJyArIGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdmFsdWU6IHtwZXJpb2QuYWN0dWFsX3ZhbHVlfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBJbmRpY2F0b3JzIGZyb20gJy4vSW5kaWNhdG9ycy5qc3gnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9XG4gICAgICAgICAgICAgICAgICAgIG1vZGVscz17dGhpcy5wcm9wcy5tb2RlbHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBDb21tZW50cyBmcm9tICcuL0NvbW1lbnRzLmpzeCdcblxuaW1wb3J0IHtkaXNwbGF5RGF0ZX0gZnJvbSAnLi91dGlscy5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBkYXRlcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwidXBkYXRlc1wifTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgnY29tbWVudHMnKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbCh1cGRhdGUsIGkpIHtcbiAgICAgICAgY29uc3Qgb3JnYW5pc2F0aW9uID0gdXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWU7XG4gICAgICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB1cGRhdGUuZGF0YTtcbiAgICAgICAgY29uc3QgaGVhZGVyVGV4dCA9IGBVcGRhdGU6ICR7dXNlck5hbWV9IGF0ICR7b3JnYW5pc2F0aW9ufSwgZGF0YTogJHtkYXRhfWA7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJUZXh0fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0KX0gfFxuICAgICAgICAgICAgICAgICAgICBCeToge3VzZXJOYW1lfSB8XG4gICAgICAgICAgICAgICAgICAgIE9yZzoge3VwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lfSB8XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1czoge3VwZGF0ZS5zdGF0dXN9IDxici8+XG4gICAgICAgICAgICAgICAgICAgIFVwZGF0ZSB2YWx1ZToge3VwZGF0ZS5kYXRhfSB8IHsvKlxuICAgICAgICAgICAgICAgICAgICAgICAgTk9URTogd2UgdXNlIHVwZGF0ZS5hY3R1YWxfdmFsdWUsIGEgdmFsdWUgY2FsY3VsYXRlZCBpbiBBcHAuYW5ub3RhdGUoKSwgbm90XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAgICAgICAgICAgICovfVxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdG90YWwgZm9yIHRoaXMgcGVyaW9kIChpbmNsdWRpbmcgdGhpcyB1cGRhdGUpOiB7dXBkYXRlLmFjdHVhbF92YWx1ZX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM9e3RoaXMucHJvcHMubW9kZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaGFuZGxlcigpXG4gICAgICAgIC8vVE9ETzogZXJyb3IgaGFuZGxpbmc/IFNlZSBodHRwczovL3d3dy50anZhbnRvbGwuY29tLzIwMTUvMDkvMTMvZmV0Y2gtYW5kLWVycm9ycy9cbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrKTtcbn1cblxuXG4vLyBPYmplY3QgaG9sZHMgY2FsbGJhY2sgVVJMIGZ1bmN0aW9ucyBhcyB2YWx1ZXMsIG1vc3Qgb2YgdGhlbSBjYWxsZWQgd2l0aCBhbiBpZCBwYXJhbWV0ZXJcbi8vIFVzYWdlOiBlbmRwb2ludFVSTCgxNykucmVzdWx0IC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICAgICAgXCJyZXN1bHRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicmVzdWx0c1wiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImluZGljYXRvcnNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInVwZGF0ZXNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJjb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfY29tbWVudC8/Zm9ybWF0PWpzb24mZGF0YV9fcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kX2ZyYW1ld29ya1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuIl19
