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

        var isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
        var strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
        var months = JSON.parse(document.getElementById('i18nMonths').innerHTML);
        var projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

        _this.state = {
            models: {
                results: undefined,
                indicators: undefined,
                periods: undefined,
                updates: undefined,
                comments: undefined
            },
            resultsDataTree: [],
            project: { id: projectIds.project_id },
            i18n: { strings: strings, months: months }
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
                (0, _utils.APICall)('GET', _utils.endpoints[model](this.state.project.id), '', success);
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

            function annotateUpdates(periods) {
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
            var annotated_periods = annotateUpdates(periods);

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
                return _react2.default.createElement(_Results2.default, {
                    items: tree,
                    callbacks: callbacks,
                    i18n: this.state.i18n });
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


Comments.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object
};

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
            var strings = this.props.i18n.strings;
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
                        strings.baseline_year,
                        ': ',
                        indicator.baseline_year
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'baseline-value' },
                        strings.baseline_value,
                        ': ',
                        indicator.baseline_value
                    )
                ),
                _react2.default.createElement(_Periods2.default, {
                    items: indicator.periods,
                    callbacks: this.props.callbacks,
                    i18n: this.props.i18n })
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


Indicators.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired,
    i18n: _react.PropTypes.object.isRequired
};

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
            if (!items) {
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require("rc-collapse");

var _Level2 = require("./Level.jsx");

var _Level3 = _interopRequireDefault(_Level2);

var _Updates = require("./Updates.jsx");

var _utils = require("./utils.js");

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
        key: "basePeriodSave",
        value: function basePeriodSave(periodId, data, callback) {
            // Base function for saving a period with a data Object.
            var url = _utils.endpoints.period(periodId);
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
        key: "lockingToggle",
        value: function lockingToggle(locking) {
            this.setState({ locking: locking });
        }
    }, {
        key: "notLocking",
        value: function notLocking() {
            this.lockingToggle(false);
        }
    }, {
        key: "lockToggle",
        value: function lockToggle(e) {
            if (!this.state.locking) {
                this.lockingToggle(true);
                this.basePeriodSave(this.props.period.id, { locked: !this.props.period.locked }, this.notLocking.bind(this));
            }
            e.stopPropagation();
        }
    }, {
        key: "render",
        value: function render() {
            var icon = void 0,
                label = void 0;
            if (this.state.locking) {
                icon = _react2.default.createElement("i", { className: "fa fa-spin fa-spinner" });
                label = "Loading";
            } else if (this.props.period.locked) {
                icon = _react2.default.createElement("i", { className: 'fa fa-lock' });
                label = "Unlock period";
            } else {
                icon = _react2.default.createElement("i", { className: "fa fa-unlock-alt" });
                label = "Lock period";
            }
            return _react2.default.createElement(
                "a",
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

PeriodLockToggle.propTypes = {
    period: _react.PropTypes.object,
    callbacks: _react.PropTypes.object
};

var periodActualValue = function periodActualValue(period) {
    return period.updates && period.updates.length > 0 ? period.updates[period.updates.length - 1].actual_value : "";
};

var Periods = function (_Level) {
    _inherits(Periods, _Level);

    function Periods(props) {
        _classCallCheck(this, Periods);

        var _this2 = _possibleConstructorReturn(this, (Periods.__proto__ || Object.getPrototypeOf(Periods)).call(this, props));

        _this2.state = { model: "periods" };
        return _this2;
    }

    _createClass(Periods, [{
        key: "renderPanel",
        value: function renderPanel(period, i) {
            var months = this.props.i18n.months;
            var periodStart = (0, _utils.displayDate)(period.period_start, months);
            var periodEnd = (0, _utils.displayDate)(period.period_end, months);
            var periodDate = periodStart + " - " + periodEnd;
            var header = _react2.default.createElement(
                "span",
                null,
                _react2.default.createElement(
                    "span",
                    null,
                    "Period: ",
                    periodDate,
                    " | Target value: ",
                    period.target_value,
                    " | Actual value: ",
                    periodActualValue(period)
                ),
                _react2.default.createElement(PeriodLockToggle, { period: period, callbacks: this.props.callbacks })
            );
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: header, key: i },
                _react2.default.createElement(_Updates.NewUpdateForm, {
                    i18n: this.props.i18n,
                    callbacks: this.props.callbacks,
                    period: period }),
                _react2.default.createElement(_Updates.Updates, {
                    i18n: this.props.i18n,
                    callbacks: this.props.callbacks,
                    period: period,
                    items: period.updates })
            );
        }
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            this.props.callbacks.loadModel('updates');
        }
    }]);

    return Periods;
}(_Level3.default);

exports.default = Periods;


Periods.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired,
    i18n: _react.PropTypes.object.isRequired
};

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
                    callbacks: this.props.callbacks,
                    i18n: this.props.i18n })
            );
        }
    }]);

    return Results;
}(_Level3.default);

exports.default = Results;


Results.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired,
    i18n: _react.PropTypes.object.isRequired
};

},{"./Indicators.jsx":3,"./Level.jsx":4,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewUpdateForm = exports.Updates = undefined;

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var UpdateDisplay = function UpdateDisplay(_ref) {
    var i18n = _ref.i18n,
        update = _ref.update;

    var userName = update.user_details.first_name + " " + update.user_details.last_name;
    return _react2.default.createElement(
        'div',
        null,
        'When: ',
        (0, _utils.displayDate)(update.created_at, i18n.months),
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
    );
};

UpdateDisplay.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    update: _react.PropTypes.object.isRequired
};

var Update = function (_React$Component) {
    _inherits(Update, _React$Component);

    function Update(props) {
        _classCallCheck(this, Update);

        var _this = _possibleConstructorReturn(this, (Update.__proto__ || Object.getPrototypeOf(Update)).call(this, props));

        _this.formToggle = _this.formToggle.bind(_this);
        _this.state = { formOpen: false };
        return _this;
    }

    _createClass(Update, [{
        key: 'formToggle',
        value: function formToggle() {
            this.setState({ formOpen: !this.state.formOpen });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'a',
                        { onClick: this.formToggle,
                            className: 'btn btn-sm btn-default',
                            style: { margin: '0.3em 0.5em' } },
                        this.props.i18n.strings.edit_update
                    )
                ),
                this.state.formOpen ? _react2.default.createElement(UpdateForm, {
                    i18n: this.props.i18n,
                    callbacks: this.props.callbacks,
                    update: this.props.update,
                    formToggle: this.formToggle }) : _react2.default.createElement(UpdateDisplay, { i18n: this.props.i18n, update: this.props.update })
            );
        }
    }]);

    return Update;
}(_react2.default.Component);

Update.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    callbacks: _react.PropTypes.object.isRequired,
    period: _react.PropTypes.object.isRequired,
    update: _react.PropTypes.object.isRequired
};

var Updates = exports.Updates = function (_Level) {
    _inherits(Updates, _Level);

    function Updates(props) {
        _classCallCheck(this, Updates);

        var _this2 = _possibleConstructorReturn(this, (Updates.__proto__ || Object.getPrototypeOf(Updates)).call(this, props));

        _this2.state = { model: "updates" };
        return _this2;
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
                _react2.default.createElement(Update, { i18n: this.props.i18n,
                    callbacks: this.props.callbacks,
                    period: this.props.period,
                    update: update }),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Comments2.default, {
                        items: update.comments,
                        callbacks: this.props.callbacks })
                )
            );
        }
    }]);

    return Updates;
}(_Level3.default);

Updates.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    callbacks: _react.PropTypes.object.isRequired,
    period: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.array
};

var Header = function Header() {
    return _react2.default.createElement(
        'div',
        { className: 'col-xs-12' },
        _react2.default.createElement(
            'div',
            { className: 'row update-entry-container-header' },
            'Header'
        )
    );
};

var ActualValueInput = function ActualValueInput(_ref2) {
    var i18n = _ref2.i18n,
        formData = _ref2.formData,
        updatedActualValue = _ref2.updatedActualValue,
        setUpdateData = _ref2.setUpdateData;

    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-xs-6' },
            _react2.default.createElement(
                'label',
                { htmlFor: 'actualValue' },
                i18n.add_to_actual_value
            ),
            _react2.default.createElement('input', { className: 'form-control',
                id: 'data',
                value: formData.data,
                onChange: setUpdateData,
                placeholder: i18n.input_placeholder })
        ),
        _react2.default.createElement(
            'div',
            { className: 'col-xs-6' },
            _react2.default.createElement(
                'div',
                { className: 'upActualValue' },
                _react2.default.createElement(
                    'label',
                    null,
                    _react2.default.createElement(
                        'span',
                        { className: 'update-actual-value-text' },
                        i18n.total_value_after_update,
                        ':'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'update-actual-value-data' },
                    updatedActualValue
                )
            )
        )
    );
};

ActualValueInput.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    updatedActualValue: _react.PropTypes.string,
    setUpdateData: _react.PropTypes.func.isRequired
};

var ActualValueDescription = function ActualValueDescription(_ref3) {
    var i18n = _ref3.i18n,
        formData = _ref3.formData,
        setUpdateData = _ref3.setUpdateData;

    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-xs-9 update-description' },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'label',
                    { htmlFor: 'description' },
                    i18n.actual_value_comment
                ),
                _react2.default.createElement('textarea', { className: 'form-control',
                    id: 'text',
                    value: formData.text,
                    onChange: setUpdateData,
                    placeholder: i18n.comment_placeholder })
            )
        )
    );
};

ActualValueDescription.propTypes = {
    i18n: _react.PropTypes.object.isRequired
};

var Attachments = function Attachments() {
    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-xs-6' },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'label',
                    { className: 'imageUpload' },
                    _react2.default.createElement('input', { type: 'file', accept: 'image/*' }),
                    _react2.default.createElement(
                        'a',
                        null,
                        _react2.default.createElement('i', { className: 'fa fa-camera' }),
                        _react2.default.createElement('span', null),
                        _react2.default.createElement(
                            'span',
                            null,
                            'Add image'
                        )
                    )
                )
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'col-xs-6' },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'label',
                    { className: 'fileUpload' },
                    _react2.default.createElement('input', { type: 'file' }),
                    _react2.default.createElement(
                        'a',
                        null,
                        _react2.default.createElement('i', { className: 'fa fa-paperclip' }),
                        _react2.default.createElement('span', null),
                        _react2.default.createElement(
                            'span',
                            null,
                            'Attach file'
                        )
                    )
                )
            )
        )
    );
};

var UpdateFormButtons = function UpdateFormButtons(_ref4) {
    var i18n = _ref4.i18n,
        callbacks = _ref4.callbacks;

    i18n = i18n.strings;
    return _react2.default.createElement(
        'div',
        { className: 'menuAction' },
        _react2.default.createElement(
            'div',
            { role: 'presentation', className: 'removeUpdate' },
            _react2.default.createElement(
                'a',
                { className: 'btn btn-default btn-xs' },
                i18n.delete
            )
        ),
        _react2.default.createElement(
            'ul',
            { className: 'nav-pills bottomRow navbar-right' },
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: 'cancelUpdate' },
                _react2.default.createElement(
                    'a',
                    { onClick: callbacks.formToggle, className: 'btn btn-link btn-xs' },
                    i18n.cancel
                )
            ),
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: 'saveUpdate' },
                _react2.default.createElement(
                    'a',
                    { onClick: callbacks.saveUpdate, className: 'btn btn-default btn-xs' },
                    i18n.save
                )
            ),
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: 'approveUpdate' },
                _react2.default.createElement(
                    'a',
                    { className: 'btn btn-default btn-xs' },
                    i18n.approve
                )
            ),
            _react2.default.createElement('span', null)
        )
    );
};

UpdateFormButtons.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    callbacks: _react.PropTypes.object.isRequired
};

var UpdateForm = function (_React$Component2) {
    _inherits(UpdateForm, _React$Component2);

    function UpdateForm(props) {
        _classCallCheck(this, UpdateForm);

        var _this3 = _possibleConstructorReturn(this, (UpdateForm.__proto__ || Object.getPrototypeOf(UpdateForm)).call(this, props));

        var update = _this3.props.update;
        if (update) {
            // create state from existing update, NOTE: "new" denotes if this is a new update or not
            _this3.state = { new: false, text: update.text, data: update.data, period: update.period };
        } else {
            _this3.state = { new: true, text: "", data: 0, period: _this3.props.period.id };
        }
        _this3.saveUpdate = _this3.saveUpdate.bind(_this3);
        return _this3;
    }

    _createClass(UpdateForm, [{
        key: 'setUpdateData',
        value: function setUpdateData(e) {
            var field = e.target.id;
            this.setState(_defineProperty({}, field, e.target.value));
        }
    }, {
        key: 'saveUpdate',
        value: function saveUpdate() {

            //NOTE: period_actual_value is needed for server side calculations to be correct
            var update = {
                'period': this.state.period,
                'period_actual_value': this.previousActualValue(),
                'user': 1,
                'text': this.state.text.trim(),
                'data': this.state.data.trim()
            };
            var success = function success(data) {
                this.props.formToggle();
                this.props.callbacks.updateModel("updates", data);
            };
            if (this.state.new) {
                (0, _utils.APICall)('POST', _utils.endpoints.updates_and_comments(), update, success.bind(this));
            } else {
                (0, _utils.APICall)('PATCH', _utils.endpoints.update_and_comments(this.props.update.id), update, success.bind(this));
                //    "{"text":"More stuff!","data":"5","relative_data":true,"status":"A"}"
                //http://rsr.localdev.akvo.org/rest/v1/indicator_period_data_framework/528/?format=json
            }
        }
    }, {
        key: 'previousActualValue',
        value: function previousActualValue() {
            if (this.props.update) {
                return this.props.update.actual_value - this.props.update.data;
            } else {
                var updates = this.props.period.updates;
                if (updates && updates.length > 0) {
                    var latest = updates[updates.length - 1];
                    return latest.actual_value;
                }
                return 0;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var i18n = this.props.i18n.strings;
            var updateValue = parseFloat(this.state.data ? this.state.data : 0);
            var updatedActualValue = (0, _utils.displayNumber)(this.previousActualValue() + updateValue);
            return _react2.default.createElement(
                'div',
                { className: 'update-container' },
                _react2.default.createElement(
                    'div',
                    { className: 'row update-entry-container edit-in-progress' },
                    _react2.default.createElement(Header, null),
                    _react2.default.createElement(ActualValueInput, {
                        i18n: i18n,
                        setUpdateData: this.setUpdateData.bind(this),
                        formData: this.state,
                        updatedActualValue: updatedActualValue }),
                    _react2.default.createElement(ActualValueDescription, {
                        i18n: i18n,
                        setUpdateData: this.setUpdateData.bind(this),
                        formData: this.state }),
                    _react2.default.createElement(Attachments, null),
                    _react2.default.createElement(UpdateFormButtons, {
                        i18n: this.props.i18n,
                        callbacks: { formToggle: this.props.formToggle, saveUpdate: this.saveUpdate } })
                )
            );
        }
    }]);

    return UpdateForm;
}(_react2.default.Component);

UpdateForm.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    callbacks: _react.PropTypes.object.isRequired,
    formToggle: _react.PropTypes.func.isRequired,
    period: _react.PropTypes.object,
    update: _react.PropTypes.object
};

var NewUpdateForm = exports.NewUpdateForm = function (_React$Component3) {
    _inherits(NewUpdateForm, _React$Component3);

    function NewUpdateForm(props) {
        _classCallCheck(this, NewUpdateForm);

        var _this4 = _possibleConstructorReturn(this, (NewUpdateForm.__proto__ || Object.getPrototypeOf(NewUpdateForm)).call(this, props));

        _this4.formToggle = _this4.formToggle.bind(_this4);
        _this4.state = { formOpen: false };
        return _this4;
    }

    _createClass(NewUpdateForm, [{
        key: 'formToggle',
        value: function formToggle() {
            this.setState({ formOpen: !this.state.formOpen });
        }
    }, {
        key: 'render',
        value: function render() {
            var form = void 0;
            if (this.state.formOpen) {
                //TODO: can formToggle be merged into callbacks?
                form = _react2.default.createElement(UpdateForm, {
                    i18n: this.props.i18n,
                    callbacks: this.props.callbacks,
                    period: this.props.period,
                    formToggle: this.formToggle });
            } else {
                form = "";
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'a',
                        { onClick: this.formToggle,
                            className: 'btn btn-sm btn-default',
                            style: { margin: '0.3em 0.5em' } },
                        _react2.default.createElement('i', { className: 'fa fa-plus' }),
                        this.props.i18n.strings.new_update
                    )
                ),
                form
            );
        }
    }]);

    return NewUpdateForm;
}(_react2.default.Component);

NewUpdateForm.propTypes = {
    i18n: _react.PropTypes.object.isRequired,
    callbacks: _react.PropTypes.object.isRequired,
    period: _react.PropTypes.object
};

},{"./Comments.jsx":2,"./Level.jsx":4,"./utils.js":8,"rc-collapse":"rc-collapse","react":"react"}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.endpoints = undefined;
exports.displayDate = displayDate;
exports.getCookie = getCookie;
exports.APICall = APICall;
exports.displayNumber = displayNumber;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function displayDate(dateString, i18nMonths) {
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
// Usage: endpoints.result(17) -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
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
    "period": function period(id) {
        return "/rest/v1/indicator_period/" + id + "/?format=json";
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

function displayNumber(numberString) {
    // Add commas to numbers of 1000 or higher.
    if (numberString !== undefined && numberString !== null) {
        var locale = "en-gb";
        var float = parseFloat(numberString);
        if (!isNaN(float)) {
            return float.toLocaleString(locale);
        }
    }
    return numberString;
}

},{"isomorphic-fetch":"isomorphic-fetch"}]},{},[1,2,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEz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QUFDLEVBQUQ7QUFBQSxtREFBMEMsRUFBMUM7QUFBQTtBQVpFLENBQWxCOztBQWVBLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUN4QztBQUNBLFFBQUksaUJBQWlCLFNBQWpCLElBQThCLGlCQUFpQixJQUFuRCxFQUF5RDtBQUNyRCxZQUFJLFNBQVMsT0FBYjtBQUNBLFlBQUksUUFBUSxXQUFXLFlBQVgsQ0FBWjtBQUNBLFlBQUksQ0FBQyxNQUFNLEtBQU4sQ0FBTCxFQUFtQjtBQUNmLG1CQUFPLE1BQU0sY0FBTixDQUFxQixNQUFyQixDQUFQO0FBQ0g7QUFDSjtBQUNELFdBQU8sWUFBUDtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IFJlc3VsdHMgZnJvbSAnLi9SZXN1bHRzLmpzeCc7XG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50c30gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCBtb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgY29uc3QgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWxzOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwZXJpb2RzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXBkYXRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHRzRGF0YVRyZWU6IFtdLFxuICAgICAgICAgICAgcHJvamVjdDoge2lkOiBwcm9qZWN0SWRzLnByb2plY3RfaWR9LFxuICAgICAgICAgICAgaTE4bjoge3N0cmluZ3M6IHN0cmluZ3MsIG1vbnRoczogbW9udGhzfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBPbmNlIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZCwgbG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgLy9UT0RPOiB0aGlzIFwiY2hhaW5lZFwiIHdheSBvZiBsb2FkaW5nIHRoZSBBUEkgZGF0YSBraW5kYSB0ZXJyaWJsZSBhbmQgc2hvdWxkIGJlIHJlcGxhY2VkXG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdyZXN1bHRzJyk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdpbmRpY2F0b3JzJyk7XG4gICAgfVxuXG4gICAgbG9hZE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIC8vIExvYWQgYSBtb2RlbCBmcm9tIHRoZSBBUEkuIEFmdGVyIGxvYWRpbmcgcmVidWlsZCB0aGUgZGF0YSB0cmVlLlxuICAgICAgICBpZiAoISB0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0pIHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWVyZ2U6IHtbbW9kZWxdOiB0aGlzLmluZGV4TW9kZWwocmVzcG9uc2UucmVzdWx0cyl9fVxuICAgICAgICAgICAgICAgICAgICApfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludHNbbW9kZWxdKHRoaXMuc3RhdGUucHJvamVjdC5pZCksICcnLCBzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKG1vZGVsLCBkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gdXBkYXRlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpbmRleE1vZGVsKGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ3JlYXRlIGFuIGluZGV4ZWQgdmVyc2lvbiBvZiBhIG1vZGVsIGJ5IGNyZWF0aW5nIGEgbGlzdCBvZiBvYmplY3RzLCBvbmUgZm9yIGVhY2ggbW9kZWxcbiAgICAgICAgaW5zdGFuY2Ugd2hlcmUgdGhlIG9iamVjdCBrZXkgaXMgdGhlIGlkIG9mIHRoZSBpbnN0YW5jZSBhbmQgdGhlIHZhbHVlIGlzIHRoZSBmdWxsIGluc3RhbmNlLlxuICAgICAgICBUaGlzIGNvbnN0cnVjdCBpcyB1c2VkIHRvIGJlIGFibGUgdG8gZWFzaWx5IHVwZGF0ZSBpbmRpdmlkdWFsIGluc3RhbmNlcy5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFjYywgb2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBvYmpbJ2lkJ107XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ZWRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICBpbmRleGVkT2JqW2lkXSA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIGluZGV4ZWRPYmopXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge31cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGFzc2VtYmxlRGF0YVRyZWUoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIGxpc3Qgb2YgcmVzdWx0IG9iamVjdHMgYmFzZWQgb24gdGhlIEFQSSBjYWxsIGZvciBSZXN1bHQsIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYVxuICAgICAgICBsaXN0IG9mIGl0cyBhc3NvY2lhdGVkIGluZGljYXRvcnMgaW4gdGhlIGZpZWxkIFwiaW5kaWNhdG9yc1wiLCBlYWNoIG9mIHdoaWNoIGhvbGQgYSBsaXN0IG9mXG4gICAgICAgIGluZGljYXRvciBwZXJpb2RzIGluIHRoZSBmaWVsZCBcInBlcmlvZHNcIiBhbmQgb24gZG93biB2aWEgXCJ1cGRhdGVzXCIgYW5kIFwiY29tbWVudHNcIi5cbiAgICAgICAgVGhpcyBkYXRhIHN0cnVjdHVyZSBpcyB1c2VkIHRvIHBvcHVsYXRlIHRoZSB3aG9sZSB0cmVlIG9mIGNvbXBvbmVudHMgZWFjaCBsZXZlbCBwYXNzaW5nIHRoZVxuICAgICAgICBjaGlsZCBsaXN0IGFzIHRoZSBwcm9wIFwiaXRlbXNcIlxuICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckNoaWxkcmVuKHBhcmVudHMsIGZpZWxkTmFtZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgSGVscGVyIGZ1bmN0aW9uIHRoYXQgbGlua3MgdHdvIGxldmVscyBpbiB0aGUgZGF0YSB0cmVlLiBUaGUgbGlua2luZyBpcyBiYXNlZCBvbiB0aGVcbiAgICAgICAgICAgIGZvcmVpZ24ga2V5IGZpZWxkIHRvIHRoZSBwYXJlbnQgb2YgdGhlIGNoaWxkIGJlaW5nIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IHBhcmVudCBvYmplY3RcbiAgICAgICAgICAgIFBhcmFtczpcbiAgICAgICAgICAgICAgICBwYXJlbnRzOiBsaXN0IG9mIHBhcmVudCBvYmplY3RzLiBFYWNoIHBhcmVudCBvYmplY3QgaXMgYXNzaWduZWQgYSBuZXcgZmllbGQgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRzIHRoZSBsaXN0IG9mIGFzc29jaWF0ZWQgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzOiBvYmplY3Qgd2l0aCB0d28gZmllbGRzLCBcInBhcmVudFwiIGFuZCBcImNoaWxkcmVuXCIgdGhhdCBob2xkIHRoZSBuYW1lIG9mXG4gICAgICAgICAgICAgICAgdGhlIGZpZWxkcyBsaW5raW5nIHRoZSB0d28gbGV2ZWxzIG9mIG9iamVjdHMuXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGxpc3Qgb2YgYWxsIGNoaWxkIG9iamVjdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRzICYmIHBhcmVudHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRbZmllbGROYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPT4gY2hpbGRbZmllbGROYW1lcy5wYXJlbnRdID09PSBwYXJlbnQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYW5ub3RhdGVVcGRhdGVzKHBlcmlvZHMpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBZGQgdGhlIGZpZWxkIFwiYWN0dWFsX3ZhbHVlXCIgdG8gZWFjaCBwZXJpb2QgdXBkYXRlLCB3aGljaCBpcyB0aGUgc3VtIG9mIGFsbCB1cGRhdGVcbiAgICAgICAgICAgIHZhbHVlcyB1cCB0byB0aGlzIHBvaW50IGluIHRpbWUuIE5vdGUgdGhhdCB0aGlzIGZpZWxkIGV4aXN0cyBpbiB0aGUgZGF0YXNldCBhc1xuICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgYnV0IHdlIGNhbid0IHVzZSB0aGF0IHNpbmNlIHdlIHdhbnQgdG8gYmUgYWJsZSB0b1xuICAgICAgICAgICAgKHJlKS1jYWxjdWxhdGUgb24gZGF0YSBjaGFuZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kcyAmJiBwZXJpb2RzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmlvZC51cGRhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0dWFsX3ZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZC51cGRhdGVzID0gcGVyaW9kLnVwZGF0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVbJ2FjdHVhbF92YWx1ZSddID0gcGFyc2VJbnQodXBkYXRlLmRhdGEpICsgYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxfdmFsdWUgPSB1cGRhdGUuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVyaW9kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlSW5kZXgob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuc3RhdGUubW9kZWxzO1xuICAgICAgICBjb25zdCB1cGRhdGVzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy51cGRhdGVzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiZGF0YVwiLCBjaGlsZHJlbjogXCJjb21tZW50c1wifSxcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmNvbW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnBlcmlvZHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJwZXJpb2RcIiwgY2hpbGRyZW46IFwidXBkYXRlc1wifSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0ZWRfcGVyaW9kcyA9IGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBcInBlcmlvZHNcIn0sXG4gICAgICAgICAgICBhbm5vdGF0ZWRfcGVyaW9kc1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnJlc3VsdHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFwiaW5kaWNhdG9yc1wifSxcbiAgICAgICAgICAgIGluZGljYXRvcnNcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5zdGF0ZS5yZXN1bHRzRGF0YVRyZWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIGxvYWRNb2RlbDogdGhpcy5sb2FkTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHVwZGF0ZU1vZGVsOiB0aGlzLnVwZGF0ZU1vZGVsLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnN0YXRlLmkxOG59Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcbn0pOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5Db21tZW50cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBQZXJpb2RzIGZyb20gJy4vUGVyaW9kcy5qc3gnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IsIGkpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLnByb3BzLmkxOG4uc3RyaW5ncztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3N0cmluZ3MuYmFzZWxpbmVfeWVhcn06IHtpbmRpY2F0b3IuYmFzZWxpbmVfeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzdHJpbmdzLmJhc2VsaW5lX3ZhbHVlfToge2luZGljYXRvci5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPFBlcmlvZHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e2luZGljYXRvci5wZXJpb2RzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cblxuSW5kaWNhdG9ycy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29sbGFwc2UsIHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghIGl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0sIGkpKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IExldmVsIGZyb20gXCIuL0xldmVsLmpzeFwiO1xuaW1wb3J0IHtVcGRhdGVzLCBOZXdVcGRhdGVGb3JtfSBmcm9tIFwiLi9VcGRhdGVzLmpzeFwiO1xuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5cbmNsYXNzIFBlcmlvZExvY2tUb2dnbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubG9ja1RvZ2dsZSA9IHRoaXMubG9ja1RvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2xvY2tpbmc6IGZhbHNlfTtcbiAgICB9XG5cbiAgICBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRzLnBlcmlvZChwZXJpb2RJZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJwZXJpb2RzXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInBlcmlvZHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kLCBpKSB7XG4gICAgICAgIGNvbnN0IG1vbnRocyA9IHRoaXMucHJvcHMuaTE4bi5tb250aHM7XG4gICAgICAgIGNvbnN0IHBlcmlvZFN0YXJ0ID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCwgbW9udGhzKTtcbiAgICAgICAgY29uc3QgcGVyaW9kRW5kID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQsIG1vbnRocyk7XG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBgJHtwZXJpb2RTdGFydH0gLSAke3BlcmlvZEVuZH1gO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgUGVyaW9kOiB7cGVyaW9kRGF0ZX0gfFxuICAgICAgICAgICAgICAgICAgICBUYXJnZXQgdmFsdWU6IHtwZXJpb2QudGFyZ2V0X3ZhbHVlfSB8XG4gICAgICAgICAgICAgICAgICAgIEFjdHVhbCB2YWx1ZToge3BlcmlvZEFjdHVhbFZhbHVlKHBlcmlvZCl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPE5ld1VwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q9e3BlcmlvZH0vPlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3BlcmlvZC51cGRhdGVzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG5cblBlcmlvZHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgSW5kaWNhdG9ycyBmcm9tICcuL0luZGljYXRvcnMuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInJlc3VsdHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocmVzdWx0LCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9IGtleT17aX0+XG4gICAgICAgICAgICAgICAgPEluZGljYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3Jlc3VsdC5pbmRpY2F0b3JzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblJlc3VsdHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9Db21tZW50cy5qc3gnXG5cbmltcG9ydCB7QVBJQ2FsbCwgZW5kcG9pbnRzLCBkaXNwbGF5RGF0ZSwgZGlzcGxheU51bWJlcn0gZnJvbSAnLi91dGlscy5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7aTE4biwgdXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0LCBpMThuLm1vbnRocyl9IHxcbiAgICAgICAgICAgIEJ5OiB7dXNlck5hbWV9IHxcbiAgICAgICAgICAgIE9yZzoge3VwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lfSB8XG4gICAgICAgICAgICBTdGF0dXM6IHt1cGRhdGUuc3RhdHVzfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY2xhc3MgVXBkYXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmZvcm1Ub2dnbGUgPSB0aGlzLmZvcm1Ub2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtmb3JtT3BlbjogZmFsc2V9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmZvcm1Ub2dnbGV9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi5zdHJpbmdzLmVkaXRfdXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IGkxOG49e3RoaXMucHJvcHMuaTE4bn0gdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGUucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5leHBvcnQgY2xhc3MgVXBkYXRlcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwidXBkYXRlc1wifTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgnY29tbWVudHMnKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbCh1cGRhdGUsIGkpIHtcbiAgICAgICAgY29uc3Qgb3JnYW5pc2F0aW9uID0gdXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWU7XG4gICAgICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB1cGRhdGUuZGF0YTtcbiAgICAgICAgY29uc3QgaGVhZGVyVGV4dCA9IGBVcGRhdGU6ICR7dXNlck5hbWV9IGF0ICR7b3JnYW5pc2F0aW9ufSwgZGF0YTogJHtkYXRhfWA7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJUZXh0fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGUgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZD17dGhpcy5wcm9wcy5wZXJpb2R9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3VwZGF0ZX0vPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3VwZGF0ZS5jb21tZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblVwZGF0ZXMucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxufTtcblxuXG5jb25zdCBIZWFkZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgSGVhZGVyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZUlucHV0ID0gKHtpMThuLCBmb3JtRGF0YSwgdXBkYXRlZEFjdHVhbFZhbHVlLCBzZXRVcGRhdGVEYXRhfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhY3R1YWxWYWx1ZVwiPntpMThuLmFkZF90b19hY3R1YWxfdmFsdWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJkYXRhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRVcGRhdGVEYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bi5pbnB1dF9wbGFjZWhvbGRlcn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBBY3R1YWxWYWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aTE4bi50b3RhbF92YWx1ZV9hZnRlcl91cGRhdGV9OlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtZGF0YVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3VwZGF0ZWRBY3R1YWxWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuQWN0dWFsVmFsdWVJbnB1dC5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzZXRVcGRhdGVEYXRhOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlRGVzY3JpcHRpb24gPSAoe2kxOG4sIGZvcm1EYXRhLCBzZXRVcGRhdGVEYXRhfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy05IHVwZGF0ZS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZGVzY3JpcHRpb25cIj57aTE4bi5hY3R1YWxfdmFsdWVfY29tbWVudH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRVcGRhdGVEYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4uY29tbWVudF9wbGFjZWhvbGRlcn0+XG4gICAgICAgICAgICAgICAgICAgIDwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuQWN0dWFsVmFsdWVEZXNjcmlwdGlvbi5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEF0dGFjaG1lbnRzID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImltYWdlVXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY2FtZXJhXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BZGQgaW1hZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmlsZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtcGFwZXJjbGlwXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BdHRhY2ggZmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IFVwZGF0ZUZvcm1CdXR0b25zID0gKHtpMThuLCBjYWxsYmFja3N9KSA9PiB7XG4gICAgaTE4biA9IGkxOG4uc3RyaW5ncztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVBY3Rpb25cIj5cbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cInJlbW92ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57aTE4bi5kZWxldGV9PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2LXBpbGxzIGJvdHRvbVJvdyBuYXZiYXItcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cImNhbmNlbFVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3MuZm9ybVRvZ2dsZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGJ0bi14c1wiPntpMThuLmNhbmNlbH08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cblxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLnNhdmV9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57aTE4bi5hcHByb3ZlfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZUZvcm1CdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY2xhc3MgVXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMucHJvcHMudXBkYXRlO1xuICAgICAgICBpZiAodXBkYXRlKSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgc3RhdGUgZnJvbSBleGlzdGluZyB1cGRhdGUsIE5PVEU6IFwibmV3XCIgZGVub3RlcyBpZiB0aGlzIGlzIGEgbmV3IHVwZGF0ZSBvciBub3RcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7bmV3OiBmYWxzZSwgdGV4dDogdXBkYXRlLnRleHQsIGRhdGE6IHVwZGF0ZS5kYXRhLCBwZXJpb2Q6IHVwZGF0ZS5wZXJpb2R9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtuZXc6IHRydWUsIHRleHQ6IFwiXCIsIGRhdGE6IDAsIHBlcmlvZDogdGhpcy5wcm9wcy5wZXJpb2QuaWR9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZVVwZGF0ZSA9IHRoaXMuc2F2ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHNldFVwZGF0ZURhdGEoZSkge1xuICAgICAgICBjb25zdCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtbZmllbGRdOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoKSB7XG5cblxuXG4gICAgICAgIC8vTk9URTogcGVyaW9kX2FjdHVhbF92YWx1ZSBpcyBuZWVkZWQgZm9yIHNlcnZlciBzaWRlIGNhbGN1bGF0aW9ucyB0byBiZSBjb3JyZWN0XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgICdwZXJpb2QnOiB0aGlzLnN0YXRlLnBlcmlvZCxcbiAgICAgICAgICAgICdwZXJpb2RfYWN0dWFsX3ZhbHVlJzogdGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCksXG4gICAgICAgICAgICAndXNlcic6IDEsXG4gICAgICAgICAgICAndGV4dCc6IHRoaXMuc3RhdGUudGV4dC50cmltKCksXG4gICAgICAgICAgICAnZGF0YSc6IHRoaXMuc3RhdGUuZGF0YS50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwidXBkYXRlc1wiLCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubmV3KSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQT1NUJywgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzKCksIHVwZGF0ZSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModGhpcy5wcm9wcy51cGRhdGUuaWQpLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vICAgIFwie1widGV4dFwiOlwiTW9yZSBzdHVmZiFcIixcImRhdGFcIjpcIjVcIixcInJlbGF0aXZlX2RhdGFcIjp0cnVlLFwic3RhdHVzXCI6XCJBXCJ9XCJcbiAgICAgICAgLy9odHRwOi8vcnNyLmxvY2FsZGV2LmFrdm8ub3JnL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay81MjgvP2Zvcm1hdD1qc29uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmV2aW91c0FjdHVhbFZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy51cGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwZGF0ZS5hY3R1YWxfdmFsdWUgLSB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5wcm9wcy5wZXJpb2QudXBkYXRlcztcbiAgICAgICAgICAgIGlmICh1cGRhdGVzICYmIHVwZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdCA9IHVwZGF0ZXNbdXBkYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF0ZXN0LmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpMThuID0gdGhpcy5wcm9wcy5pMThuLnN0cmluZ3M7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLnN0YXRlLmRhdGEgPyB0aGlzLnN0YXRlLmRhdGEgOiAwKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFjdHVhbFZhbHVlID0gZGlzcGxheU51bWJlcih0aGlzLnByZXZpb3VzQWN0dWFsVmFsdWUoKSArIHVwZGF0ZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXIgZWRpdC1pbi1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyLz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRVcGRhdGVEYXRhPXt0aGlzLnNldFVwZGF0ZURhdGEuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhPXt0aGlzLnN0YXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEFjdHVhbFZhbHVlPXt1cGRhdGVkQWN0dWFsVmFsdWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRVcGRhdGVEYXRhPXt0aGlzLnNldFVwZGF0ZURhdGEuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhPXt0aGlzLnN0YXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBdHRhY2htZW50cy8+XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtQnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybVRvZ2dsZTogdGhpcy5wcm9wcy5mb3JtVG9nZ2xlLCBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVGb3JtLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmZvcm1Ub2dnbGUgPSB0aGlzLmZvcm1Ub2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtmb3JtT3BlbjogZmFsc2V9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGZvcm07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1PcGVuKSB7XG4gICAgICAgICAgICAvL1RPRE86IGNhbiBmb3JtVG9nZ2xlIGJlIG1lcmdlZCBpbnRvIGNhbGxiYWNrcz9cbiAgICAgICAgICAgIGZvcm0gPSA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgIHBlcmlvZD17dGhpcy5wcm9wcy5wZXJpb2R9XG4gICAgICAgICAgICAgICAgZm9ybVRvZ2dsZT17dGhpcy5mb3JtVG9nZ2xlfS8+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtcGx1cycgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4uc3RyaW5ncy5uZXdfdXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2Zvcm19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcsIGkxOG5Nb250aHMpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaGFuZGxlcigpXG4gICAgICAgIC8vVE9ETzogZXJyb3IgaGFuZGxpbmc/IFNlZSBodHRwczovL3d3dy50anZhbnRvbGwuY29tLzIwMTUvMDkvMTMvZmV0Y2gtYW5kLWVycm9ycy9cbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrKTtcbn1cblxuXG4vLyBPYmplY3QgaG9sZHMgY2FsbGJhY2sgVVJMIGZ1bmN0aW9ucyBhcyB2YWx1ZXMsIG1vc3Qgb2YgdGhlbSBjYWxsZWQgd2l0aCBhbiBpZCBwYXJhbWV0ZXJcbi8vIFVzYWdlOiBlbmRwb2ludHMucmVzdWx0KDE3KSAtPiBcImh0dHA6Ly9yc3IuYWt2by5vcmcvcmVzdC92MS9yZXN1bHQvMTcvP2Zvcm1hdD1qc29uXCJcbmV4cG9ydCBjb25zdCBlbmRwb2ludHMgPSB7XG4gICAgICAgIFwicmVzdWx0XCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInJlc3VsdHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0Lz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJpbmRpY2F0b3JzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvci8/Zm9ybWF0PWpzb24mcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvP2Zvcm1hdD1qc29uJmluZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJ1cGRhdGVzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8/Zm9ybWF0PWpzb24mcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2NvbW1lbnQvP2Zvcm1hdD1qc29uJmRhdGFfX3BlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXBkYXRlX2FuZF9jb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogKCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1c2VyXCI6IChpZCkgPT4gYC9yZXN0L3YxL3VzZXIvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJwYXJ0bmVyc2hpcHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImZpbGVfdXBsb2FkXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8ke2lkfS91cGxvYWRfZmlsZS8/Zm9ybWF0PWpzb25gXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheU51bWJlcihudW1iZXJTdHJpbmcpIHtcbiAgICAvLyBBZGQgY29tbWFzIHRvIG51bWJlcnMgb2YgMTAwMCBvciBoaWdoZXIuXG4gICAgaWYgKG51bWJlclN0cmluZyAhPT0gdW5kZWZpbmVkICYmIG51bWJlclN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gXCJlbi1nYlwiO1xuICAgICAgICB2YXIgZmxvYXQgPSBwYXJzZUZsb2F0KG51bWJlclN0cmluZyk7XG4gICAgICAgIGlmICghaXNOYU4oZmxvYXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmxvYXQudG9Mb2NhbGVTdHJpbmcobG9jYWxlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVtYmVyU3RyaW5nO1xufSJdfQ==
