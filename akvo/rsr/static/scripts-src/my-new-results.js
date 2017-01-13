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
        value: function renderPanel(comment) {
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: comment.comment, key: comment.id },
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
        value: function renderPanel(indicator) {
            var title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
            var strings = this.props.i18n.strings;
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Indicator: " + title, key: indicator.id },
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
                    items.map(function (item) {
                        return _this2.renderPanel(item);
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
        value: function renderPanel(period) {
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
                { header: header, key: period.id },
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
        value: function renderPanel(result) {
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Result: " + result.title, key: result.id },
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
        value: function renderPanel(update) {
            var organisation = update.user_details.approved_organisations[0].name;
            var userName = update.user_details.first_name + " " + update.user_details.last_name;
            var data = update.data;
            var headerText = 'Update: ' + userName + ' at ' + organisation + ', data: ' + data;
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: headerText, key: update.id },
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
            // Update the form field widgets
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEz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QUFqQixJQUE4QixpQkFBaUIsSUFBbkQsRUFBeUQ7QUFDckQsWUFBSSxTQUFTLE9BQWI7QUFDQSxZQUFJLFFBQVEsV0FBVyxZQUFYLENBQVo7QUFDQSxZQUFJLENBQUMsTUFBTSxLQUFOLENBQUwsRUFBbUI7QUFDZixtQkFBTyxNQUFNLGNBQU4sQ0FBcUIsTUFBckIsQ0FBUDtBQUNIO0FBQ0o7QUFDRCxXQUFPLFlBQVA7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vUmVzdWx0cy5qc3gnO1xuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIGNvbnN0IGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgY29uc3QgbW9udGhzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaTE4bk1vbnRocycpLmlubmVySFRNTCk7XG4gICAgICAgIGNvbnN0IHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3Q6IHtpZDogcHJvamVjdElkcy5wcm9qZWN0X2lkfSxcbiAgICAgICAgICAgIGkxOG46IHtzdHJpbmdzOiBzdHJpbmdzLCBtb250aHM6IG1vbnRoc31cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbCgncmVzdWx0cycpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnaW5kaWNhdG9ycycpO1xuICAgIH1cblxuICAgIGxvYWRNb2RlbChtb2RlbCkge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJLiBBZnRlciBsb2FkaW5nIHJlYnVpbGQgdGhlIGRhdGEgdHJlZS5cbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgICAgICAgICAge21vZGVsczogdXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXTogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfX1cbiAgICAgICAgICAgICAgICAgICAgKX0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzW21vZGVsXSh0aGlzLnN0YXRlLnByb2plY3QuaWQpLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSwgZGVsPWZhbHNlKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbmV3U3RhdGU7XG4gICAgICAgIGNvbnN0IGlkID0gZGF0YS5pZDtcbiAgICAgICAgaWYgKGRlbCkge1xuICAgICAgICAgICAgLy8gU2luY2Ugd2Ugc2hvdWxkbid0IGVkaXQgdGhlIHN0YXRlIG9iamVjdCBkaXJlY3RseSB3ZSBoYXZlIHRvIG1ha2UgYSAoc2hhbGxvdykgY29weVxuICAgICAgICAgICAgLy8gYW5kIGRlbGV0ZSBmcm9tIHRoZSBjb3B5LiBUT0RPOiB0aGluayBoYXJkIGlmIHRoaXMgY2FuIGxlYWQgdG8gdHJvdWJsZS4uLlxuICAgICAgICAgICAgY29uc3QgbmV3TW9kZWwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0pO1xuICAgICAgICAgICAgZGVsZXRlIG5ld01vZGVsW2lkXTtcbiAgICAgICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRzZXQ6IG5ld01vZGVsfX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U3RhdGUgPSB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHtbbW9kZWxdOiB7JG1lcmdlOiB7W2lkXTogZGF0YX19fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpbmRleE1vZGVsKGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ3JlYXRlIGFuIGluZGV4ZWQgdmVyc2lvbiBvZiBhIG1vZGVsIGJ5IGNyZWF0aW5nIGEgbGlzdCBvZiBvYmplY3RzLCBvbmUgZm9yIGVhY2ggbW9kZWxcbiAgICAgICAgaW5zdGFuY2Ugd2hlcmUgdGhlIG9iamVjdCBrZXkgaXMgdGhlIGlkIG9mIHRoZSBpbnN0YW5jZSBhbmQgdGhlIHZhbHVlIGlzIHRoZSBmdWxsIGluc3RhbmNlLlxuICAgICAgICBUaGlzIGNvbnN0cnVjdCBpcyB1c2VkIHRvIGJlIGFibGUgdG8gZWFzaWx5IHVwZGF0ZSBpbmRpdmlkdWFsIGluc3RhbmNlcy5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFjYywgb2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBvYmpbJ2lkJ107XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ZWRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICBpbmRleGVkT2JqW2lkXSA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIGluZGV4ZWRPYmopXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge31cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGFzc2VtYmxlRGF0YVRyZWUoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIGxpc3Qgb2YgcmVzdWx0IG9iamVjdHMgYmFzZWQgb24gdGhlIEFQSSBjYWxsIGZvciBSZXN1bHQsIGVhY2ggb2Ygd2hpY2ggaG9sZHMgYVxuICAgICAgICBsaXN0IG9mIGl0cyBhc3NvY2lhdGVkIGluZGljYXRvcnMgaW4gdGhlIGZpZWxkIFwiaW5kaWNhdG9yc1wiLCBlYWNoIG9mIHdoaWNoIGhvbGQgYSBsaXN0IG9mXG4gICAgICAgIGluZGljYXRvciBwZXJpb2RzIGluIHRoZSBmaWVsZCBcInBlcmlvZHNcIiBhbmQgb24gZG93biB2aWEgXCJ1cGRhdGVzXCIgYW5kIFwiY29tbWVudHNcIi5cbiAgICAgICAgVGhpcyBkYXRhIHN0cnVjdHVyZSBpcyB1c2VkIHRvIHBvcHVsYXRlIHRoZSB3aG9sZSB0cmVlIG9mIGNvbXBvbmVudHMgZWFjaCBsZXZlbCBwYXNzaW5nIHRoZVxuICAgICAgICBjaGlsZCBsaXN0IGFzIHRoZSBwcm9wIFwiaXRlbXNcIlxuICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckNoaWxkcmVuKHBhcmVudHMsIGZpZWxkTmFtZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgSGVscGVyIGZ1bmN0aW9uIHRoYXQgbGlua3MgdHdvIGxldmVscyBpbiB0aGUgZGF0YSB0cmVlLiBUaGUgbGlua2luZyBpcyBiYXNlZCBvbiB0aGVcbiAgICAgICAgICAgIGZvcmVpZ24ga2V5IGZpZWxkIHRvIHRoZSBwYXJlbnQgb2YgdGhlIGNoaWxkIGJlaW5nIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IHBhcmVudCBvYmplY3RcbiAgICAgICAgICAgIFBhcmFtczpcbiAgICAgICAgICAgICAgICBwYXJlbnRzOiBsaXN0IG9mIHBhcmVudCBvYmplY3RzLiBFYWNoIHBhcmVudCBvYmplY3QgaXMgYXNzaWduZWQgYSBuZXcgZmllbGQgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgIGhvbGRzIHRoZSBsaXN0IG9mIGFzc29jaWF0ZWQgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzOiBvYmplY3Qgd2l0aCB0d28gZmllbGRzLCBcInBhcmVudFwiIGFuZCBcImNoaWxkcmVuXCIgdGhhdCBob2xkIHRoZSBuYW1lIG9mXG4gICAgICAgICAgICAgICAgdGhlIGZpZWxkcyBsaW5raW5nIHRoZSB0d28gbGV2ZWxzIG9mIG9iamVjdHMuXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGxpc3Qgb2YgYWxsIGNoaWxkIG9iamVjdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRzICYmIHBhcmVudHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRbZmllbGROYW1lcy5jaGlsZHJlbl0gPSBjaGlsZHJlbi5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPT4gY2hpbGRbZmllbGROYW1lcy5wYXJlbnRdID09PSBwYXJlbnQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYW5ub3RhdGVVcGRhdGVzKHBlcmlvZHMpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBZGQgdGhlIGZpZWxkIFwiYWN0dWFsX3ZhbHVlXCIgdG8gZWFjaCBwZXJpb2QgdXBkYXRlLCB3aGljaCBpcyB0aGUgc3VtIG9mIGFsbCB1cGRhdGVcbiAgICAgICAgICAgIHZhbHVlcyB1cCB0byB0aGlzIHBvaW50IGluIHRpbWUuIE5vdGUgdGhhdCB0aGlzIGZpZWxkIGV4aXN0cyBpbiB0aGUgZGF0YXNldCBhc1xuICAgICAgICAgICAgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgYnV0IHdlIGNhbid0IHVzZSB0aGF0IHNpbmNlIHdlIHdhbnQgdG8gYmUgYWJsZSB0b1xuICAgICAgICAgICAgKHJlKS1jYWxjdWxhdGUgb24gZGF0YSBjaGFuZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kcyAmJiBwZXJpb2RzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmlvZC51cGRhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWN0dWFsX3ZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZC51cGRhdGVzID0gcGVyaW9kLnVwZGF0ZXMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVbJ2FjdHVhbF92YWx1ZSddID0gcGFyc2VJbnQodXBkYXRlLmRhdGEpICsgYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxfdmFsdWUgPSB1cGRhdGUuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVyaW9kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlSW5kZXgob2JqKSB7XG4gICAgICAgICAgICAvLyBUdXJuIHRoZSBpbmRleGVkIG1vZGVsIGJhY2sgdG8gYSBsaXN0IG9mIG1vZGVsIG9iamVjdFxuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCdWlsZCB0aGUgdHJlZSBvZiBtb2RlbHMgZnJvbSB0aGUgbG93ZXN0IGxldmVsIChDb21tZW50KSBhbmQgdXAgdG8gUmVzdWx0XG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuc3RhdGUubW9kZWxzO1xuICAgICAgICBjb25zdCB1cGRhdGVzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy51cGRhdGVzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiZGF0YVwiLCBjaGlsZHJlbjogXCJjb21tZW50c1wifSxcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmNvbW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnBlcmlvZHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJwZXJpb2RcIiwgY2hpbGRyZW46IFwidXBkYXRlc1wifSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0ZWRfcGVyaW9kcyA9IGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBcInBlcmlvZHNcIn0sXG4gICAgICAgICAgICBhbm5vdGF0ZWRfcGVyaW9kc1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnJlc3VsdHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFwiaW5kaWNhdG9yc1wifSxcbiAgICAgICAgICAgIGluZGljYXRvcnNcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5zdGF0ZS5yZXN1bHRzRGF0YVRyZWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIGxvYWRNb2RlbDogdGhpcy5sb2FkTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHVwZGF0ZU1vZGVsOiB0aGlzLnVwZGF0ZU1vZGVsLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnN0YXRlLmkxOG59Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcbn0pOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17Y29tbWVudC5pZH0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5Db21tZW50cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBQZXJpb2RzIGZyb20gJy4vUGVyaW9kcy5qc3gnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWNhdG9ycyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLnByb3BzLmkxOG4uc3RyaW5ncztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2luZGljYXRvci5pZH0+XG4gICAgICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS15ZWFyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c3RyaW5ncy5iYXNlbGluZV95ZWFyfToge2luZGljYXRvci5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3N0cmluZ3MuYmFzZWxpbmVfdmFsdWV9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn0vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdwZXJpb2RzJyk7XG4gICAgfVxufVxuXG5JbmRpY2F0b3JzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgaWYgKCEgaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgdGhpcy5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9kZWJ1Z0lEICsgXCIgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2U+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IHRoaXMucmVuZGVyUGFuZWwoaXRlbSkpfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKlxuIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSBcInJjLWNvbGxhcHNlXCI7XG5pbXBvcnQgTGV2ZWwgZnJvbSBcIi4vTGV2ZWwuanN4XCI7XG5pbXBvcnQge1VwZGF0ZXMsIE5ld1VwZGF0ZUZvcm19IGZyb20gXCIuL1VwZGF0ZXMuanN4XCI7XG5pbXBvcnQge2Rpc3BsYXlEYXRlLCBBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludHMucGVyaW9kKHBlcmlvZElkKTtcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBBUElDYWxsKCdQQVRDSCcsIHVybCwgZGF0YSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBsb2NraW5nVG9nZ2xlKGxvY2tpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bG9ja2luZzogbG9ja2luZ30pO1xuICAgIH1cblxuICAgIG5vdExvY2tpbmcoKSB7XG4gICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZShmYWxzZSk7XG4gICAgfVxuXG4gICAgbG9ja1RvZ2dsZShlKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmJhc2VQZXJpb2RTYXZlKHRoaXMucHJvcHMucGVyaW9kLmlkLCB7bG9ja2VkOiAhdGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkfSwgdGhpcy5ub3RMb2NraW5nLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgaWNvbiwgbGFiZWw7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2FkaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPXsnZmEgZmEtbG9jayd9Lz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiVW5sb2NrIHBlcmlvZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXVubG9jay1hbHRcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2NrIHBlcmlvZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmxvY2tUb2dnbGV9XG4gICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgIHN0eWxlPXt7ZmxvYXQ6ICdyaWdodCcsIG1hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgIHtpY29ufVxuICAgICAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuUGVyaW9kTG9ja1RvZ2dsZS5wcm9wVHlwZXMgPSB7XG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuY29uc3QgcGVyaW9kQWN0dWFsVmFsdWUgPSAocGVyaW9kKSA9PiB7XG4gICAgcmV0dXJuIHBlcmlvZC51cGRhdGVzICYmIHBlcmlvZC51cGRhdGVzLmxlbmd0aCA+IDAgP1xuICAgICAgICBwZXJpb2QudXBkYXRlc1twZXJpb2QudXBkYXRlcy5sZW5ndGgtMV0uYWN0dWFsX3ZhbHVlXG4gICAgOlxuICAgICAgICBcIlwiO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVyaW9kcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicGVyaW9kc1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChwZXJpb2QpIHtcbiAgICAgICAgY29uc3QgbW9udGhzID0gdGhpcy5wcm9wcy5pMThuLm1vbnRocztcbiAgICAgICAgY29uc3QgcGVyaW9kU3RhcnQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0LCBtb250aHMpO1xuICAgICAgICBjb25zdCBwZXJpb2RFbmQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCwgbW9udGhzKTtcbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGAke3BlcmlvZFN0YXJ0fSAtICR7cGVyaW9kRW5kfWA7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICBQZXJpb2Q6IHtwZXJpb2REYXRlfSB8XG4gICAgICAgICAgICAgICAgICAgIFRhcmdldCB2YWx1ZToge3BlcmlvZC50YXJnZXRfdmFsdWV9IHxcbiAgICAgICAgICAgICAgICAgICAgQWN0dWFsIHZhbHVlOiB7cGVyaW9kQWN0dWFsVmFsdWUocGVyaW9kKX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFBlcmlvZExvY2tUb2dnbGUgcGVyaW9kPXtwZXJpb2R9IGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlcn0ga2V5PXtwZXJpb2QuaWR9PlxuICAgICAgICAgICAgICAgIDxOZXdVcGRhdGVGb3JtXG4gICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9Lz5cbiAgICAgICAgICAgICAgICA8VXBkYXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtwZXJpb2QudXBkYXRlc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCd1cGRhdGVzJyk7XG4gICAgfVxufVxuXG5QZXJpb2RzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJyZXN1bHRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJSZXN1bHQ6IFwiICsgcmVzdWx0LnRpdGxlfSBrZXk9e3Jlc3VsdC5pZH0+XG4gICAgICAgICAgICAgICAgPEluZGljYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3Jlc3VsdC5pbmRpY2F0b3JzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cblJlc3VsdHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9Db21tZW50cy5qc3gnXG5cbmltcG9ydCB7QVBJQ2FsbCwgZW5kcG9pbnRzLCBkaXNwbGF5RGF0ZSwgZGlzcGxheU51bWJlcn0gZnJvbSAnLi91dGlscy5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7aTE4biwgdXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0LCBpMThuLm1vbnRocyl9IHxcbiAgICAgICAgICAgIEJ5OiB7dXNlck5hbWV9IHxcbiAgICAgICAgICAgIE9yZzoge3VwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lfSB8XG4gICAgICAgICAgICBTdGF0dXM6IHt1cGRhdGUuc3RhdHVzfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY2xhc3MgVXBkYXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmZvcm1Ub2dnbGUgPSB0aGlzLmZvcm1Ub2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtmb3JtT3BlbjogZmFsc2V9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmZvcm1Ub2dnbGV9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaTE4bi5zdHJpbmdzLmVkaXRfdXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IGkxOG49e3RoaXMucHJvcHMuaTE4bn0gdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGUucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5leHBvcnQgY2xhc3MgVXBkYXRlcyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwidXBkYXRlc1wifTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgnY29tbWVudHMnKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbCh1cGRhdGUpIHtcbiAgICAgICAgY29uc3Qgb3JnYW5pc2F0aW9uID0gdXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWU7XG4gICAgICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB1cGRhdGUuZGF0YTtcbiAgICAgICAgY29uc3QgaGVhZGVyVGV4dCA9IGBVcGRhdGU6ICR7dXNlck5hbWV9IGF0ICR7b3JnYW5pc2F0aW9ufSwgZGF0YTogJHtkYXRhfWA7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJUZXh0fSBrZXk9e3VwZGF0ZS5pZH0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZSBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXt0aGlzLnByb3BzLnBlcmlvZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlcy5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG59O1xuXG5cbmNvbnN0IEhlYWRlciA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICBIZWFkZXJcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlSW5wdXQgPSAoe2kxOG4sIGZvcm1EYXRhLCB1cGRhdGVkQWN0dWFsVmFsdWUsIHNldFVwZGF0ZURhdGF9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFjdHVhbFZhbHVlXCI+e2kxOG4uYWRkX3RvX2FjdHVhbF92YWx1ZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICBpZD1cImRhdGFcIlxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFVwZGF0ZURhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuLmlucHV0X3BsYWNlaG9sZGVyfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cEFjdHVhbFZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuLnRvdGFsX3ZhbHVlX2FmdGVyX3VwZGF0ZX06XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dXBkYXRlZEFjdHVhbFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlZEFjdHVhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNldFVwZGF0ZURhdGE6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVEZXNjcmlwdGlvbiA9ICh7aTE4biwgZm9ybURhdGEsIHNldFVwZGF0ZURhdGF9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTkgdXBkYXRlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPntpMThuLmFjdHVhbF92YWx1ZV9jb21tZW50fTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50ZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFVwZGF0ZURhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bi5jb21tZW50X3BsYWNlaG9sZGVyfT5cbiAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZURlc2NyaXB0aW9uLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQXR0YWNobWVudHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW1hZ2VVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jYW1lcmFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkFkZCBpbWFnZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWxlVXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1wYXBlcmNsaXBcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkF0dGFjaCBmaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgVXBkYXRlRm9ybUJ1dHRvbnMgPSAoe2kxOG4sIGNhbGxiYWNrc30pID0+IHtcbiAgICBpMThuID0gaTE4bi5zdHJpbmdzO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudUFjdGlvblwiPlxuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwicmVtb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmRlbGV0ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLmRlbGV0ZX08L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYtcGlsbHMgYm90dG9tUm93IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiY2FuY2VsVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5mb3JtVG9nZ2xlfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e2kxOG4uY2FuY2VsfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuXG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJzYXZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5zYXZlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e2kxOG4uc2F2ZX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cImFwcHJvdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLmFwcHJvdmV9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuVXBkYXRlRm9ybUJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0gdGhpcy5wcm9wcy51cGRhdGU7XG4gICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzdGF0ZSBmcm9tIGV4aXN0aW5nIHVwZGF0ZSwgTk9URTogXCJuZXdcIiBkZW5vdGVzIGlmIHRoaXMgaXMgYSBuZXcgdXBkYXRlIG9yIG5vdFxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtuZXc6IGZhbHNlLCB0ZXh0OiB1cGRhdGUudGV4dCwgZGF0YTogdXBkYXRlLmRhdGEsIHBlcmlvZDogdXBkYXRlLnBlcmlvZH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge25ldzogdHJ1ZSwgdGV4dDogXCJcIiwgZGF0YTogMCwgcGVyaW9kOiB0aGlzLnByb3BzLnBlcmlvZC5pZH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zYXZlVXBkYXRlID0gdGhpcy5zYXZlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVsZXRlVXBkYXRlID0gdGhpcy5kZWxldGVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzZXRVcGRhdGVEYXRhKGUpIHtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBmb3JtIGZpZWxkIHdpZGdldHNcbiAgICAgICAgY29uc3QgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2ZpZWxkXTogZS50YXJnZXQudmFsdWV9KTtcbiAgICB9XG5cbiAgICBzYXZlVXBkYXRlKCkge1xuICAgICAgICAvL05PVEU6IHBlcmlvZF9hY3R1YWxfdmFsdWUgaXMgbmVlZGVkIGZvciBzZXJ2ZXIgc2lkZSBjYWxjdWxhdGlvbnMgdG8gYmUgY29ycmVjdFxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICAncGVyaW9kJzogdGhpcy5zdGF0ZS5wZXJpb2QsXG4gICAgICAgICAgICAncGVyaW9kX2FjdHVhbF92YWx1ZSc6IHRoaXMucHJldmlvdXNBY3R1YWxWYWx1ZSgpLFxuICAgICAgICAgICAgJ3VzZXInOiAxLFxuICAgICAgICAgICAgJ3RleHQnOiB0aGlzLnN0YXRlLnRleHQudHJpbSgpLFxuICAgICAgICAgICAgJ2RhdGEnOiB0aGlzLnN0YXRlLmRhdGEudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInVwZGF0ZXNcIiwgZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLm5ldykge1xuICAgICAgICAgICAgQVBJQ2FsbCgnUE9TVCcsIGVuZHBvaW50cy51cGRhdGVzX2FuZF9jb21tZW50cygpLCB1cGRhdGUsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQQVRDSCcsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKHRoaXMucHJvcHMudXBkYXRlLmlkKSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlVXBkYXRlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge2lkOiB0aGlzLnByb3BzLnVwZGF0ZS5pZH07XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwidXBkYXRlc1wiLCBkYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBBUElDYWxsKCdERUxFVEUnLCBlbmRwb2ludHMudXBkYXRlX2FuZF9jb21tZW50cyhkYXRhLmlkKSwgbnVsbCwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcmV2aW91c0FjdHVhbFZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy51cGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwZGF0ZS5hY3R1YWxfdmFsdWUgLSB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5wcm9wcy5wZXJpb2QudXBkYXRlcztcbiAgICAgICAgICAgIGlmICh1cGRhdGVzICYmIHVwZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdCA9IHVwZGF0ZXNbdXBkYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF0ZXN0LmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpMThuID0gdGhpcy5wcm9wcy5pMThuLnN0cmluZ3M7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLnN0YXRlLmRhdGEgPyB0aGlzLnN0YXRlLmRhdGEgOiAwKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFjdHVhbFZhbHVlID0gZGlzcGxheU51bWJlcih0aGlzLnByZXZpb3VzQWN0dWFsVmFsdWUoKSArIHVwZGF0ZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXIgZWRpdC1pbi1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyLz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRVcGRhdGVEYXRhPXt0aGlzLnNldFVwZGF0ZURhdGEuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhPXt0aGlzLnN0YXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEFjdHVhbFZhbHVlPXt1cGRhdGVkQWN0dWFsVmFsdWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRVcGRhdGVEYXRhPXt0aGlzLnNldFVwZGF0ZURhdGEuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhPXt0aGlzLnN0YXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBdHRhY2htZW50cy8+XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtQnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU6IHRoaXMucHJvcHMuZm9ybVRvZ2dsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVVwZGF0ZTogdGhpcy5zYXZlVXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVVcGRhdGU6IHRoaXMuZGVsZXRlVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGZvcm1Ub2dnbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuXG5leHBvcnQgY2xhc3MgTmV3VXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGZhbHNlfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBmb3JtO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtT3Blbikge1xuICAgICAgICAgICAgLy9UT0RPOiBjYW4gZm9ybVRvZ2dsZSBiZSBtZXJnZWQgaW50byBjYWxsYmFja3M/XG4gICAgICAgICAgICBmb3JtID0gPFVwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICBwZXJpb2Q9e3RoaXMucHJvcHMucGVyaW9kfVxuICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU9e3RoaXMuZm9ybVRvZ2dsZX0vPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuZm9ybVRvZ2dsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXBsdXMnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnN0cmluZ3MubmV3X3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtmb3JtfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbk5ld1VwZGF0ZUZvcm0ucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RGF0ZShkYXRlU3RyaW5nLCBpMThuTW9udGhzKSB7XG4gICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICBpZiAoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IGkxOG5Nb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgfVxuICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBoYW5kbGVyO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBPU1RcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BPU1QnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBVVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUFVUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQQVRDSFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUEFUQ0gnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIkRFTEVURVwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZSgnY3NyZnRva2VuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xufVxuXG5cbi8vIE9iamVjdCBob2xkcyBjYWxsYmFjayBVUkwgZnVuY3Rpb25zIGFzIHZhbHVlcywgbW9zdCBvZiB0aGVtIGNhbGxlZCB3aXRoIGFuIGlkIHBhcmFtZXRlclxuLy8gVXNhZ2U6IGVuZHBvaW50cy5yZXN1bHQoMTcpIC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICAgICAgXCJyZXN1bHRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicmVzdWx0c1wiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImluZGljYXRvcnNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInVwZGF0ZXNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJjb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfY29tbWVudC8/Zm9ybWF0PWpzb24mZGF0YV9fcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVzX2FuZF9jb21tZW50c1wiOiAoKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVzZXJcIjogKGlkKSA9PiBgL3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiAoaWQpID0+IGAvcmVzdC92MS9wYXJ0bmVyc2hpcC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiZmlsZV91cGxvYWRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5TnVtYmVyKG51bWJlclN0cmluZykge1xuICAgIC8vIEFkZCBjb21tYXMgdG8gbnVtYmVycyBvZiAxMDAwIG9yIGhpZ2hlci5cbiAgICBpZiAobnVtYmVyU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgbnVtYmVyU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIHZhciBmbG9hdCA9IHBhcnNlRmxvYXQobnVtYmVyU3RyaW5nKTtcbiAgICAgICAgaWYgKCFpc05hTihmbG9hdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmbG9hdC50b0xvY2FsZVN0cmluZyhsb2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudW1iZXJTdHJpbmc7XG59Il19
