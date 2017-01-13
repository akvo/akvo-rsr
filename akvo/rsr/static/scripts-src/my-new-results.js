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
            var del = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            /*
            Update a model instance. Uses the indexed model objects and the immutability-helper update
             function (https://facebook.github.io/react/docs/update.html)
             */
            var newState = void 0;
            var id = data.id;
            if (del) {
                // Since we shouldn't edit the state object directly we have to make a (shallow) copy
                // and delete from the copy. TODO: think hard if this can lead to trouble...
                var newModel = Object.assign({}, this.state.models[model]);
                delete newModel[id];
                newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $set: newModel }));
            } else {
                newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $merge: _defineProperty({}, id, data) }));
            }
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
                // Turn the indexed model back to a list of model object
                return obj && Object.values(obj);
            }

            // Build the tree of models from the lowest level (Comment) and up to Result
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
                { onClick: callbacks.deleteUpdate, className: 'btn btn-default btn-xs' },
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
        _this3.deleteUpdate = _this3.deleteUpdate.bind(_this3);
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
        key: 'deleteUpdate',
        value: function deleteUpdate() {
            var data = { id: this.props.update.id };
            var success = function success() {
                this.props.formToggle();
                this.props.callbacks.updateModel("updates", data, true);
            };

            (0, _utils.APICall)('DELETE', _utils.endpoints.update_and_comments(data.id), null, success.bind(this));
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
                        callbacks: {
                            formToggle: this.props.formToggle,
                            saveUpdate: this.saveUpdate,
                            deleteUpdate: this.deleteUpdate
                        } })
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
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": getCookie('csrftoken')
                    }
                });
            };
            break;
    }
    handler()
    //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
    .then(function (response) {
        if (response.status != 204) return response.json();else return response;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEz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LFlBQXZCLEVBQXFDO0FBQ3hDO0FBQ0EsUUFBSSxpQkFBaUIsU0FBakIsSUFBOEIsaUJBQWlCLElBQW5ELEVBQXlEO0FBQ3JELFlBQUksU0FBUyxPQUFiO0FBQ0EsWUFBSSxRQUFRLFdBQVcsWUFBWCxDQUFaO0FBQ0EsWUFBSSxDQUFDLE1BQU0sS0FBTixDQUFMLEVBQW1CO0FBQ2YsbUJBQU8sTUFBTSxjQUFOLENBQXFCLE1BQXJCLENBQVA7QUFDSDtBQUNKO0FBQ0QsV0FBTyxZQUFQO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMuanN4JztcbmltcG9ydCB7QVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczMDY2NjkvXG5PYmplY3QudmFsdWVzID0gT2JqZWN0LnZhbHVlcyB8fCAob2JqID0+IE9iamVjdC5rZXlzKG9iaikubWFwKGtleSA9PiBvYmpba2V5XSkpO1xuXG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICBjb25zdCBpc1B1YmxpYyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzJykuaW5uZXJIVE1MKS5wdWJsaWM7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgICAgIGNvbnN0IG1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0OiB7aWQ6IHByb2plY3RJZHMucHJvamVjdF9pZH0sXG4gICAgICAgICAgICBpMThuOiB7c3RyaW5nczogc3RyaW5ncywgbW9udGhzOiBtb250aHN9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0LmlkKSwgJycsIHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTW9kZWwobW9kZWwsIGRhdGEsIGRlbD1mYWxzZSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG5ld1N0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIGlmIChkZWwpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIHdlIHNob3VsZG4ndCBlZGl0IHRoZSBzdGF0ZSBvYmplY3QgZGlyZWN0bHkgd2UgaGF2ZSB0byBtYWtlIGEgKHNoYWxsb3cpIGNvcHlcbiAgICAgICAgICAgIC8vIGFuZCBkZWxldGUgZnJvbSB0aGUgY29weS4gVE9ETzogdGhpbmsgaGFyZCBpZiB0aGlzIGNhbiBsZWFkIHRvIHRyb3VibGUuLi5cbiAgICAgICAgICAgIGNvbnN0IG5ld01vZGVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKTtcbiAgICAgICAgICAgIGRlbGV0ZSBuZXdNb2RlbFtpZF07XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskc2V0OiBuZXdNb2RlbH19KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgLy8gVHVybiB0aGUgaW5kZXhlZCBtb2RlbCBiYWNrIHRvIGEgbGlzdCBvZiBtb2RlbCBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIHRyZWUgb2YgbW9kZWxzIGZyb20gdGhlIGxvd2VzdCBsZXZlbCAoQ29tbWVudCkgYW5kIHVwIHRvIFJlc3VsdFxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IFwiY29tbWVudHNcIn0sXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5jb21tZW50cylcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwZXJpb2RzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5wZXJpb2RzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicGVyaW9kXCIsIGNoaWxkcmVuOiBcInVwZGF0ZXNcIn0sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGVkX3BlcmlvZHMgPSBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcyk7XG5cbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBcImluZGljYXRvcnNcIn0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMuc3RhdGUucmVzdWx0c0RhdGFUcmVlO1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBsb2FkTW9kZWw6IHRoaXMubG9hZE1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICB1cGRhdGVNb2RlbDogdGhpcy51cGRhdGVNb2RlbC5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt0cmVlfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e2NhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5zdGF0ZS5pMThufS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuQ29tbWVudHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGljYXRvcnMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcImluZGljYXRvcnNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoaW5kaWNhdG9yLCBpKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5wcm9wcy5pMThuLnN0cmluZ3M7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzdHJpbmdzLmJhc2VsaW5lX3llYXJ9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c3RyaW5ncy5iYXNlbGluZV92YWx1ZX06IHtpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG59XG5cbkluZGljYXRvcnMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAoISBpdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtLCBpKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1BhbmVsfSBmcm9tIFwicmMtY29sbGFwc2VcIjtcbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9MZXZlbC5qc3hcIjtcbmltcG9ydCB7VXBkYXRlcywgTmV3VXBkYXRlRm9ybX0gZnJvbSBcIi4vVXBkYXRlcy5qc3hcIjtcbmltcG9ydCB7ZGlzcGxheURhdGUsIEFQSUNhbGwsIGVuZHBvaW50c30gZnJvbSBcIi4vdXRpbHMuanNcIjtcblxuXG5jbGFzcyBQZXJpb2RMb2NrVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmxvY2tUb2dnbGUgPSB0aGlzLmxvY2tUb2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtsb2NraW5nOiBmYWxzZX07XG4gICAgfVxuXG4gICAgYmFzZVBlcmlvZFNhdmUocGVyaW9kSWQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEJhc2UgZnVuY3Rpb24gZm9yIHNhdmluZyBhIHBlcmlvZCB3aXRoIGEgZGF0YSBPYmplY3QuXG4gICAgICAgIGNvbnN0IHVybCA9IGVuZHBvaW50cy5wZXJpb2QocGVyaW9kSWQpO1xuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwicGVyaW9kc1wiLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2ssIGlmIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5QZXJpb2RMb2NrVG9nZ2xlLnByb3BUeXBlcyA9IHtcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5jb25zdCBwZXJpb2RBY3R1YWxWYWx1ZSA9IChwZXJpb2QpID0+IHtcbiAgICByZXR1cm4gcGVyaW9kLnVwZGF0ZXMgJiYgcGVyaW9kLnVwZGF0ZXMubGVuZ3RoID4gMCA/XG4gICAgICAgIHBlcmlvZC51cGRhdGVzW3BlcmlvZC51cGRhdGVzLmxlbmd0aC0xXS5hY3R1YWxfdmFsdWVcbiAgICA6XG4gICAgICAgIFwiXCI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJpb2RzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJwZXJpb2RzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHBlcmlvZCwgaSkge1xuICAgICAgICBjb25zdCBtb250aHMgPSB0aGlzLnByb3BzLmkxOG4ubW9udGhzO1xuICAgICAgICBjb25zdCBwZXJpb2RTdGFydCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQsIG1vbnRocyk7XG4gICAgICAgIGNvbnN0IHBlcmlvZEVuZCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kLCBtb250aHMpO1xuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gYCR7cGVyaW9kU3RhcnR9IC0gJHtwZXJpb2RFbmR9YDtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdmFsdWU6IHtwZXJpb2RBY3R1YWxWYWx1ZShwZXJpb2QpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxOZXdVcGRhdGVGb3JtXG4gICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9Lz5cbiAgICAgICAgICAgICAgICA8VXBkYXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtwZXJpb2QudXBkYXRlc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCd1cGRhdGVzJyk7XG4gICAgfVxufVxuXG5QZXJpb2RzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJyZXN1bHRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHJlc3VsdCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJSZXN1bHQ6IFwiICsgcmVzdWx0LnRpdGxlfSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5SZXN1bHRzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4J1xuXG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50cywgZGlzcGxheURhdGUsIGRpc3BsYXlOdW1iZXJ9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5cbmNvbnN0IFVwZGF0ZURpc3BsYXkgPSAoe2kxOG4sIHVwZGF0ZX0pID0+IHtcbiAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArIFwiIFwiICsgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIFdoZW46IHtkaXNwbGF5RGF0ZSh1cGRhdGUuY3JlYXRlZF9hdCwgaTE4bi5tb250aHMpfSB8XG4gICAgICAgICAgICBCeToge3VzZXJOYW1lfSB8XG4gICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgU3RhdHVzOiB7dXBkYXRlLnN0YXR1c30gPGJyLz5cbiAgICAgICAgICAgIFVwZGF0ZSB2YWx1ZToge3VwZGF0ZS5kYXRhfSB8IHsvKlxuICAgICAgICAgTk9URTogd2UgdXNlIHVwZGF0ZS5hY3R1YWxfdmFsdWUsIGEgdmFsdWUgY2FsY3VsYXRlZCBpbiBBcHAuYW5ub3RhdGVVcGRhdGVzKCksXG4gICAgICAgICBub3QgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgZnJvbSB0aGUgYmFja2VuZFxuICAgICAgICAgKi99XG4gICAgICAgICAgICBBY3R1YWwgdG90YWwgZm9yIHRoaXMgcGVyaW9kIChpbmNsdWRpbmcgdGhpcyB1cGRhdGUpOiB7dXBkYXRlLmFjdHVhbF92YWx1ZX1cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuVXBkYXRlRGlzcGxheS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGZhbHNlfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4uc3RyaW5ncy5lZGl0X3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZvcm1PcGVuID9cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVRvZ2dsZT17dGhpcy5mb3JtVG9nZ2xlfS8+XG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRGlzcGxheSBpMThuPXt0aGlzLnByb3BzLmkxOG59IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuZXhwb3J0IGNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlLCBpKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICA8VXBkYXRlIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q9e3RoaXMucHJvcHMucGVyaW9kfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVzLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbn07XG5cblxuY29uc3QgSGVhZGVyID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIEhlYWRlclxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVJbnB1dCA9ICh7aTE4biwgZm9ybURhdGEsIHVwZGF0ZWRBY3R1YWxWYWx1ZSwgc2V0VXBkYXRlRGF0YX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYWN0dWFsVmFsdWVcIj57aTE4bi5hZGRfdG9fYWN0dWFsX3ZhbHVlfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZGF0YVwiXG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VXBkYXRlRGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4uaW5wdXRfcGxhY2Vob2xkZXJ9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwQWN0dWFsVmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2kxOG4udG90YWxfdmFsdWVfYWZ0ZXJfdXBkYXRlfTpcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLWRhdGFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt1cGRhdGVkQWN0dWFsVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlSW5wdXQucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVkQWN0dWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2V0VXBkYXRlRGF0YTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZURlc2NyaXB0aW9uID0gKHtpMThuLCBmb3JtRGF0YSwgc2V0VXBkYXRlRGF0YX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtOSB1cGRhdGUtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImRlc2NyaXB0aW9uXCI+e2kxOG4uYWN0dWFsX3ZhbHVlX2NvbW1lbnR9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VXBkYXRlRGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuLmNvbW1lbnRfcGxhY2Vob2xkZXJ9PlxuICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlRGVzY3JpcHRpb24ucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7aTE4biwgY2FsbGJhY2tzfSkgPT4ge1xuICAgIGkxOG4gPSBpMThuLnN0cmluZ3M7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51QWN0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJyZW1vdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3MuZGVsZXRlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e2kxOG4uZGVsZXRlfTwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdi1waWxscyBib3R0b21Sb3cgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJjYW5jZWxVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmZvcm1Ub2dnbGV9IGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBidG4teHNcIj57aTE4bi5jYW5jZWx9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cInNhdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLnNhdmVVcGRhdGV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57aTE4bi5zYXZlfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiYXBwcm92ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e2kxOG4uYXBwcm92ZX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVGb3JtQnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnByb3BzLnVwZGF0ZTtcbiAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgLy8gY3JlYXRlIHN0YXRlIGZyb20gZXhpc3RpbmcgdXBkYXRlLCBOT1RFOiBcIm5ld1wiIGRlbm90ZXMgaWYgdGhpcyBpcyBhIG5ldyB1cGRhdGUgb3Igbm90XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge25ldzogZmFsc2UsIHRleHQ6IHVwZGF0ZS50ZXh0LCBkYXRhOiB1cGRhdGUuZGF0YSwgcGVyaW9kOiB1cGRhdGUucGVyaW9kfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7bmV3OiB0cnVlLCB0ZXh0OiBcIlwiLCBkYXRhOiAwLCBwZXJpb2Q6IHRoaXMucHJvcHMucGVyaW9kLmlkfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNhdmVVcGRhdGUgPSB0aGlzLnNhdmVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGVVcGRhdGUgPSB0aGlzLmRlbGV0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHNldFVwZGF0ZURhdGEoZSkge1xuICAgICAgICBjb25zdCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtbZmllbGRdOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoKSB7XG4gICAgICAgIC8vTk9URTogcGVyaW9kX2FjdHVhbF92YWx1ZSBpcyBuZWVkZWQgZm9yIHNlcnZlciBzaWRlIGNhbGN1bGF0aW9ucyB0byBiZSBjb3JyZWN0XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgICdwZXJpb2QnOiB0aGlzLnN0YXRlLnBlcmlvZCxcbiAgICAgICAgICAgICdwZXJpb2RfYWN0dWFsX3ZhbHVlJzogdGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCksXG4gICAgICAgICAgICAndXNlcic6IDEsXG4gICAgICAgICAgICAndGV4dCc6IHRoaXMuc3RhdGUudGV4dC50cmltKCksXG4gICAgICAgICAgICAnZGF0YSc6IHRoaXMuc3RhdGUuZGF0YS50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwidXBkYXRlc1wiLCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubmV3KSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQT1NUJywgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzKCksIHVwZGF0ZSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModGhpcy5wcm9wcy51cGRhdGUuaWQpLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vICAgIFwie1widGV4dFwiOlwiTW9yZSBzdHVmZiFcIixcImRhdGFcIjpcIjVcIixcInJlbGF0aXZlX2RhdGFcIjp0cnVlLFwic3RhdHVzXCI6XCJBXCJ9XCJcbiAgICAgICAgLy9odHRwOi8vcnNyLmxvY2FsZGV2LmFrdm8ub3JnL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay81MjgvP2Zvcm1hdD1qc29uXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7aWQ6IHRoaXMucHJvcHMudXBkYXRlLmlkfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJ1cGRhdGVzXCIsIGRhdGEsIHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIEFQSUNhbGwoJ0RFTEVURScsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKGRhdGEuaWQpLCBudWxsLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHByZXZpb3VzQWN0dWFsVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBkYXRlLmFjdHVhbF92YWx1ZSAtIHRoaXMucHJvcHMudXBkYXRlLmRhdGFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLnByb3BzLnBlcmlvZC51cGRhdGVzO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZXMgJiYgdXBkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXBkYXRlc1t1cGRhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXRlc3QuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGkxOG4gPSB0aGlzLnByb3BzLmkxOG4uc3RyaW5ncztcbiAgICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMuc3RhdGUuZGF0YSA/IHRoaXMuc3RhdGUuZGF0YSA6IDApO1xuICAgICAgICBjb25zdCB1cGRhdGVkQWN0dWFsVmFsdWUgPSBkaXNwbGF5TnVtYmVyKHRoaXMucHJldmlvdXNBY3R1YWxWYWx1ZSgpICsgdXBkYXRlVmFsdWUpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lciBlZGl0LWluLXByb2dyZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXIvPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFVwZGF0ZURhdGE9e3RoaXMuc2V0VXBkYXRlRGF0YS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGE9e3RoaXMuc3RhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQWN0dWFsVmFsdWU9e3VwZGF0ZWRBY3R1YWxWYWx1ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFVwZGF0ZURhdGE9e3RoaXMuc2V0VXBkYXRlRGF0YS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGE9e3RoaXMuc3RhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEF0dGFjaG1lbnRzLz5cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1CdXR0b25zXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVRvZ2dsZTogdGhpcy5wcm9wcy5mb3JtVG9nZ2xlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVVwZGF0ZTogdGhpcy5kZWxldGVVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVGb3JtLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmZvcm1Ub2dnbGUgPSB0aGlzLmZvcm1Ub2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtmb3JtT3BlbjogZmFsc2V9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGZvcm07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1PcGVuKSB7XG4gICAgICAgICAgICAvL1RPRE86IGNhbiBmb3JtVG9nZ2xlIGJlIG1lcmdlZCBpbnRvIGNhbGxiYWNrcz9cbiAgICAgICAgICAgIGZvcm0gPSA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgIHBlcmlvZD17dGhpcy5wcm9wcy5wZXJpb2R9XG4gICAgICAgICAgICAgICAgZm9ybVRvZ2dsZT17dGhpcy5mb3JtVG9nZ2xlfS8+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtcGx1cycgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4uc3RyaW5ncy5uZXdfdXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2Zvcm19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcsIGkxOG5Nb250aHMpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwNClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG59XG5cblxuLy8gT2JqZWN0IGhvbGRzIGNhbGxiYWNrIFVSTCBmdW5jdGlvbnMgYXMgdmFsdWVzLCBtb3N0IG9mIHRoZW0gY2FsbGVkIHdpdGggYW4gaWQgcGFyYW1ldGVyXG4vLyBVc2FnZTogZW5kcG9pbnRzLnJlc3VsdCgxNykgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgICAgICBcInJlc3VsdFwiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJyZXN1bHRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiaW5kaWNhdG9yc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwidXBkYXRlc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImNvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOdW1iZXIobnVtYmVyU3RyaW5nKSB7XG4gICAgLy8gQWRkIGNvbW1hcyB0byBudW1iZXJzIG9mIDEwMDAgb3IgaGlnaGVyLlxuICAgIGlmIChudW1iZXJTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBudW1iZXJTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgdmFyIGZsb2F0ID0gcGFyc2VGbG9hdChudW1iZXJTdHJpbmcpO1xuICAgICAgICBpZiAoIWlzTmFOKGZsb2F0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsb2F0LnRvTG9jYWxlU3RyaW5nKGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bWJlclN0cmluZztcbn0iXX0=
