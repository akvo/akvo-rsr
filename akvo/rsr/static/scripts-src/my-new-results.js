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
    formData: _react.PropTypes.object,
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
    i18n: _react.PropTypes.object.isRequired,
    formData: _react.PropTypes.object,
    setUpdateData: _react.PropTypes.func.isRequired
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
        callbacks = _ref4.callbacks,
        newUpdate = _ref4.newUpdate;

    i18n = i18n.strings;
    return _react2.default.createElement(
        'div',
        { className: 'menuAction' },
        !newUpdate ? _react2.default.createElement(
            'div',
            { role: 'presentation', className: 'removeUpdate' },
            _react2.default.createElement(
                'a',
                { onClick: callbacks.deleteUpdate, className: 'btn btn-default btn-xs' },
                i18n.delete
            )
        ) : '',
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
    callbacks: _react.PropTypes.object.isRequired,
    newUpdate: _react.PropTypes.bool.isRequired
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
                        newUpdate: this.state.new,
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
    // TODO: one of period and update has to be supplied. This is a clunky way of indicating a new
    // or exisitng udpdate. A better way should be found.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEzRTtBQUNBLFlBQU0sVUFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDLFNBQXhELENBQWhCO0FBQ0EsWUFBTSxTQUFTLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixZQUF4QixFQUFzQyxTQUFqRCxDQUFmO0FBQ0EsWUFBTSxhQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUFsRCxDQUFuQjs7QUFFQSxjQUFLLEtBQUwsR0FBYTtBQUNULG9CQUFRO0FBQ0oseUJBQVMsU0FETDtBQUVKLDRCQUFZLFNBRlI7QUFHSix5QkFBUyxTQUhMO0FBSUoseUJBQVMsU0FKTDtBQUtKLDBCQUFVO0FBTE4sYUFEQztBQVFULDZCQUFpQixFQVJSO0FBU1QscUJBQVMsRUFBQyxJQUFJLFdBQVcsVUFBaEIsRUFUQTtBQVVULGtCQUFNLEVBQUMsU0FBUyxPQUFWLEVBQW1CLFFBQVEsTUFBM0I7QUFWRyxTQUFiO0FBUGU7QUFtQmxCOzs7OzRDQUVtQjtBQUNoQjtBQUNBO0FBQ0EsaUJBQUssU0FBTCxDQUFlLFNBQWY7QUFDQSxpQkFBSyxTQUFMLENBQWUsWUFBZjtBQUNIOzs7a0NBRVMsSyxFQUFPO0FBQ2I7QUFDQSxnQkFBSSxDQUFFLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBTixFQUFnQztBQUM1QixvQkFBSSxVQUFVLFVBQVMsUUFBVCxFQUFtQjtBQUM3Qix5QkFBSyxRQUFMLENBQ0ksRUFBQyxRQUFRLGtDQUNMLEtBQUssS0FBTCxDQUFXLE1BRE4sRUFFTCxFQUFDLDRCQUFVLEtBQVYsRUFBa0IsS0FBSyxVQUFMLENBQWdCLFNBQVMsT0FBekIsQ0FBbEIsQ0FBRCxFQUZLLENBQVQsRUFESixFQUtJLFlBQVc7QUFDUCw2QkFBSyxRQUFMLENBQWMsRUFBQyxpQkFBaUIsS0FBSyxnQkFBTCxFQUFsQixFQUFkO0FBQ0gscUJBUEw7QUFTSCxpQkFWYSxDQVVaLElBVlksQ0FVUCxJQVZPLENBQWQ7QUFXQSxvQ0FBUSxLQUFSLEVBQWUsaUJBQVUsS0FBVixFQUFpQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEVBQXBDLENBQWYsRUFBd0QsRUFBeEQsRUFBNEQsT0FBNUQ7QUFDSDtBQUNKOzs7b0NBRVcsSyxFQUFPLEksRUFBaUI7QUFBQSxnQkFBWCxHQUFXLHVFQUFQLEtBQU87O0FBQ2hDOzs7O0FBSUEsZ0JBQUksaUJBQUo7QUFDQSxnQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxnQkFBSSxHQUFKLEVBQVM7QUFDTDtBQUNBO0FBQ0Esb0JBQU0sV0FBVyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBbEIsQ0FBakI7QUFDQSx1QkFBTyxTQUFTLEVBQVQsQ0FBUDtBQUNBLDJCQUFXLGtDQUFPLEtBQUssS0FBTCxDQUFXLE1BQWxCLHNCQUE0QixLQUE1QixFQUFvQyxFQUFDLE1BQU0sUUFBUCxFQUFwQyxFQUFYO0FBQ0gsYUFORCxNQU1PO0FBQ0gsMkJBQVcsa0NBQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsc0JBQTRCLEtBQTVCLEVBQW9DLEVBQUMsNEJBQVUsRUFBVixFQUFlLElBQWYsQ0FBRCxFQUFwQyxFQUFYO0FBQ0g7QUFDRCxpQkFBSyxRQUFMLENBQ0ksRUFBQyxRQUFRLFFBQVQsRUFESixFQUVJLFlBQVc7QUFDUCxxQkFBSyxRQUFMLENBQWMsRUFBQyxpQkFBaUIsS0FBSyxnQkFBTCxFQUFsQixFQUFkO0FBQ0gsYUFKTDtBQU1IOzs7bUNBRVUsSSxFQUFNO0FBQ2I7Ozs7O0FBS0EsbUJBQU8sS0FBSyxNQUFMLENBQ0gsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQjtBQUNmLG9CQUFNLEtBQUssSUFBSSxJQUFKLENBQVg7QUFDQSxvQkFBSSxhQUFhLEVBQWpCO0FBQ0EsMkJBQVcsRUFBWCxJQUFpQixHQUFqQjtBQUNBLHVCQUFPLE9BQU8sTUFBUCxDQUFjLEdBQWQsRUFBbUIsVUFBbkIsQ0FBUDtBQUNILGFBTkUsRUFPSCxFQVBHLENBQVA7QUFTSDs7OzJDQUVrQjtBQUNmOzs7Ozs7OztBQVFBLHFCQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsRUFBNkMsUUFBN0MsRUFBdUQ7QUFDbkQ7Ozs7Ozs7Ozs7QUFVQSx1QkFBTyxXQUFXLFFBQVEsR0FBUixDQUNkLFVBQVUsTUFBVixFQUFrQjtBQUNkLHdCQUFJLFFBQUosRUFBYztBQUNWLCtCQUFPLFdBQVcsUUFBbEIsSUFBOEIsU0FBUyxNQUFULENBQzFCO0FBQUEsbUNBQVMsTUFBTSxXQUFXLE1BQWpCLE1BQTZCLE9BQU8sRUFBN0M7QUFBQSx5QkFEMEIsQ0FBOUI7QUFHSDtBQUNELDJCQUFPLE1BQVA7QUFDSCxpQkFSYSxDQUFsQjtBQVVIOztBQUVELHFCQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDOUI7Ozs7OztBQU1BLHVCQUFPLFdBQVcsUUFBUSxHQUFSLENBQ2QsVUFBUyxNQUFULEVBQWlCO0FBQ2Isd0JBQUksT0FBTyxPQUFYLEVBQW9CO0FBQUE7QUFDaEIsZ0NBQUksZUFBZSxDQUFuQjtBQUNBLG1DQUFPLE9BQVAsR0FBaUIsT0FBTyxPQUFQLENBQWUsR0FBZixDQUNiLFVBQVMsTUFBVCxFQUFpQjtBQUNiLHVDQUFPLGNBQVAsSUFBeUIsU0FBUyxPQUFPLElBQWhCLElBQXdCLFlBQWpEO0FBQ0EsK0NBQWUsT0FBTyxZQUF0QjtBQUNBLHVDQUFPLE1BQVA7QUFDSCw2QkFMWSxDQUFqQjtBQUZnQjtBQVNuQjtBQUNELDJCQUFPLE1BQVA7QUFDSCxpQkFiYSxDQUFsQjtBQWVIOztBQUVELHFCQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDbEI7QUFDQSx1QkFBTyxPQUFPLE9BQU8sTUFBUCxDQUFjLEdBQWQsQ0FBZDtBQUNIOztBQUVEO0FBQ0EsZ0JBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxNQUExQjtBQUNBLGdCQUFNLFVBQVUsZUFDWixRQUFRLE9BQU8sT0FBZixDQURZLEVBRVosRUFBQyxRQUFRLE1BQVQsRUFBaUIsVUFBVSxVQUEzQixFQUZZLEVBR1osUUFBUSxPQUFPLFFBQWYsQ0FIWSxDQUFoQjs7QUFNQSxnQkFBTSxVQUFVLGVBQ1osUUFBUSxPQUFPLE9BQWYsQ0FEWSxFQUVaLEVBQUMsUUFBUSxRQUFULEVBQW1CLFVBQVUsU0FBN0IsRUFGWSxFQUdaLE9BSFksQ0FBaEI7QUFJQSxnQkFBTSxvQkFBb0IsZ0JBQWdCLE9BQWhCLENBQTFCOztBQUVBLGdCQUFNLGFBQWEsZUFDZixRQUFRLE9BQU8sVUFBZixDQURlLEVBRWYsRUFBQyxRQUFRLFdBQVQsRUFBc0IsVUFBVSxTQUFoQyxFQUZlLEVBR2YsaUJBSGUsQ0FBbkI7O0FBTUEsZ0JBQU0sVUFBVSxlQUNaLFFBQVEsT0FBTyxPQUFmLENBRFksRUFFWixFQUFDLFFBQVEsUUFBVCxFQUFtQixVQUFVLFlBQTdCLEVBRlksRUFHWixVQUhZLENBQWhCO0FBS0EsbUJBQU8sT0FBUDtBQUNIOzs7aUNBRVE7QUFDTCxnQkFBTSxPQUFPLEtBQUssS0FBTCxDQUFXLGVBQXhCO0FBQ0EsZ0JBQU0sWUFBWTtBQUNkLDJCQUFXLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FERztBQUVkLDZCQUFhLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QjtBQUZDLGFBQWxCO0FBSUEsZ0JBQUksQ0FBRSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE9BQXhCLEVBQWlDO0FBQzdCLHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSCxhQUpELE1BSU8sSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUN4Qix1QkFDSTtBQUNJLDJCQUFPLElBRFg7QUFFSSwrQkFBVyxTQUZmO0FBR0ksMEJBQU0sS0FBSyxLQUFMLENBQVcsSUFIckIsR0FESjtBQU1ILGFBUE0sTUFPQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBdk1hLGdCQUFNLFM7O0FBMk14QixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JELHVCQUFTLE1BQVQsQ0FBZ0IsOEJBQUMsR0FBRCxPQUFoQixFQUF3QixTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBQXhCO0FBQ0gsQ0FGRDs7Ozs7Ozs7Ozs7QUN4TkE7Ozs7QUFDQTs7QUFFQTs7Ozs7Ozs7OzsrZUFWQTs7Ozs7OztJQWFxQixROzs7QUFDakIsc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdIQUNULEtBRFM7O0FBRWYsY0FBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFVBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLE8sRUFBUztBQUNqQixtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxRQUFRLE9BQXZCLEVBQWdDLEtBQUssUUFBUSxFQUE3QztBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQVUsNEJBQVEsWUFBUixDQUFxQjtBQUEvQjtBQURKLGFBREo7QUFLSDs7Ozs7O2tCQVpnQixROzs7QUFlckIsU0FBUyxTQUFULEdBQXFCO0FBQ2pCLFdBQU8saUJBQVUsS0FEQTtBQUVqQixlQUFXLGlCQUFVO0FBRkosQ0FBckI7Ozs7Ozs7Ozs7O0FDckJBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFYQTs7Ozs7OztJQWNxQixVOzs7QUFDakIsd0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDRIQUNULEtBRFM7O0FBRWYsY0FBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFlBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLFMsRUFBVztBQUNuQixnQkFBTSxRQUFRLFVBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixDQUF6QixHQUE2QixVQUFVLEtBQXZDLEdBQStDLG9CQUE3RDtBQUNBLGdCQUFNLFVBQVUsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixPQUFoQztBQUNBLG1CQUNJO0FBQUE7QUFBQSxrQkFBTyxRQUFRLGdCQUFnQixLQUEvQixFQUFzQyxLQUFLLFVBQVUsRUFBckQ7QUFDSyxxQkFETDtBQUVJO0FBQUE7QUFBQSxzQkFBSyxXQUFVLFVBQWY7QUFDSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxlQUFmO0FBQ0ssZ0NBQVEsYUFEYjtBQUFBO0FBQzhCLGtDQUFVO0FBRHhDLHFCQURKO0FBSUk7QUFBQTtBQUFBLDBCQUFLLFdBQVUsZ0JBQWY7QUFDSyxnQ0FBUSxjQURiO0FBQUE7QUFDK0Isa0NBQVU7QUFEekM7QUFKSixpQkFGSjtBQVVJO0FBQ0ksMkJBQU8sVUFBVSxPQURyQjtBQUVJLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRjFCO0FBR0ksMEJBQU0sS0FBSyxLQUFMLENBQVcsSUFIckI7QUFWSixhQURKO0FBaUJIOzs7NkNBRW9CO0FBQ2pCLGlCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFNBQXJCLENBQStCLFNBQS9CO0FBQ0g7Ozs7OztrQkE5QmdCLFU7OztBQWlDckIsV0FBVyxTQUFYLEdBQXVCO0FBQ25CLFdBQU8saUJBQVUsS0FERTtBQUVuQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFGVDtBQUduQixVQUFNLGlCQUFVLE1BQVYsQ0FBaUI7QUFISixDQUF2Qjs7Ozs7Ozs7Ozs7QUN4Q0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFSQTs7Ozs7OztJQVVxQixLOzs7Ozs7Ozs7OztpQ0FDUjtBQUFBOztBQUNMLGdCQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBekI7QUFDQSxnQkFBSSxDQUFFLEtBQU4sRUFBYTtBQUNULHdCQUFRLEdBQVIsQ0FBWSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsR0FBd0IsR0FBeEIsR0FBOEIsS0FBSyxzQkFBTCxDQUE0QixRQUExRCxHQUFxRSxhQUFqRjtBQUNBLHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSCxhQUxELE1BS08sSUFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUN6Qix1QkFDSTtBQUFBO0FBQUE7QUFDSywwQkFBTSxHQUFOLENBQVUsVUFBQyxJQUFEO0FBQUEsK0JBQVUsT0FBSyxXQUFMLENBQWlCLElBQWpCLENBQVY7QUFBQSxxQkFBVjtBQURMLGlCQURKO0FBS0gsYUFOTSxNQU1BO0FBQ0gsdUJBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFESjtBQUdIO0FBQ0o7Ozs7RUFuQjhCLGdCQUFNLFM7O2tCQUFwQixLOzs7Ozs7Ozs7OztBQ0pyQjs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVZBOzs7Ozs7OztJQWFNLGdCOzs7QUFDRiw4QkFBYSxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsd0lBQ1YsS0FEVTs7QUFFaEIsY0FBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLGNBQUssS0FBTCxHQUFhLEVBQUMsU0FBUyxLQUFWLEVBQWI7QUFIZ0I7QUFJbkI7Ozs7dUNBRWMsUSxFQUFVLEksRUFBTSxRLEVBQVU7QUFDckM7QUFDQSxnQkFBTSxNQUFNLGlCQUFVLE1BQVYsQ0FBaUIsUUFBakIsQ0FBWjtBQUNBLHFCQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDbkIscUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsV0FBckIsQ0FBaUMsU0FBakMsRUFBNEMsSUFBNUM7O0FBRUE7QUFDQSxvQkFBSSxRQUFKLEVBQWM7QUFDVjtBQUNIO0FBQ0o7QUFDRCxnQ0FBUSxPQUFSLEVBQWlCLEdBQWpCLEVBQXNCLElBQXRCLEVBQTRCLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBNUI7QUFDSDs7O3NDQUVhLE8sRUFBUztBQUNuQixpQkFBSyxRQUFMLENBQWMsRUFBQyxTQUFTLE9BQVYsRUFBZDtBQUNIOzs7cUNBRVk7QUFDVCxpQkFBSyxhQUFMLENBQW1CLEtBQW5CO0FBQ0g7OzttQ0FFVSxDLEVBQUc7QUFDVixnQkFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLE9BQWhCLEVBQXlCO0FBQ3JCLHFCQUFLLGFBQUwsQ0FBbUIsSUFBbkI7QUFDQSxxQkFBSyxjQUFMLENBQW9CLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsRUFBdEMsRUFBMEMsRUFBQyxRQUFRLENBQUMsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUE1QixFQUExQyxFQUErRSxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBL0U7QUFDSDtBQUNELGNBQUUsZUFBRjtBQUNIOzs7aUNBRVE7QUFDTCxnQkFBSSxhQUFKO0FBQUEsZ0JBQVUsY0FBVjtBQUNBLGdCQUFJLEtBQUssS0FBTCxDQUFXLE9BQWYsRUFBd0I7QUFDcEIsdUJBQU8scUNBQUcsV0FBVSx1QkFBYixHQUFQO0FBQ0Esd0JBQVEsU0FBUjtBQUNILGFBSEQsTUFHTyxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBdEIsRUFBOEI7QUFDakMsdUJBQU8scUNBQUcsV0FBVyxZQUFkLEdBQVA7QUFDQSx3QkFBUSxlQUFSO0FBQ0gsYUFITSxNQUdBO0FBQ0gsdUJBQU8scUNBQUcsV0FBVSxrQkFBYixHQUFQO0FBQ0Esd0JBQVEsYUFBUjtBQUNIO0FBQ0QsbUJBQ0k7QUFBQTtBQUFBLGtCQUFHLFNBQVMsS0FBSyxVQUFqQjtBQUNHLCtCQUFXLHdCQURkO0FBRUcsMkJBQU8sRUFBQyxPQUFPLE9BQVIsRUFBaUIsUUFBUSxhQUF6QixFQUZWO0FBR0ssb0JBSEw7QUFJSztBQUpMLGFBREo7QUFRSDs7OztFQXpEMEIsZ0JBQU0sUzs7QUE0RHJDLGlCQUFpQixTQUFqQixHQUE2QjtBQUN6QixZQUFRLGlCQUFVLE1BRE87QUFFekIsZUFBVyxpQkFBVTtBQUZJLENBQTdCOztBQUtBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBWTtBQUNsQyxXQUFPLE9BQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBZSxNQUFmLEdBQXdCLENBQTFDLEdBQ0gsT0FBTyxPQUFQLENBQWUsT0FBTyxPQUFQLENBQWUsTUFBZixHQUFzQixDQUFyQyxFQUF3QyxZQURyQyxHQUdILEVBSEo7QUFJSCxDQUxEOztJQU9xQixPOzs7QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVIQUNULEtBRFM7O0FBRWYsZUFBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFNBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLE0sRUFBUTtBQUNoQixnQkFBTSxTQUFTLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsTUFBL0I7QUFDQSxnQkFBTSxjQUFjLHdCQUFZLE9BQU8sWUFBbkIsRUFBaUMsTUFBakMsQ0FBcEI7QUFDQSxnQkFBTSxZQUFZLHdCQUFZLE9BQU8sVUFBbkIsRUFBK0IsTUFBL0IsQ0FBbEI7QUFDQSxnQkFBTSxhQUFnQixXQUFoQixXQUFpQyxTQUF2QztBQUNBLGdCQUFNLFNBQ0Y7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBO0FBQUE7QUFDYSw4QkFEYjtBQUFBO0FBRW1CLDJCQUFPLFlBRjFCO0FBQUE7QUFHbUIsc0NBQWtCLE1BQWxCO0FBSG5CLGlCQURKO0FBTUksOENBQUMsZ0JBQUQsSUFBa0IsUUFBUSxNQUExQixFQUFrQyxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQXhEO0FBTkosYUFESjtBQVVBLG1CQUNJO0FBQUE7QUFBQSxrQkFBTyxRQUFRLE1BQWYsRUFBdUIsS0FBSyxPQUFPLEVBQW5DO0FBQ0k7QUFDSSwwQkFBTSxLQUFLLEtBQUwsQ0FBVyxJQURyQjtBQUVJLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRjFCO0FBR0ksNEJBQVEsTUFIWixHQURKO0FBS0k7QUFDUywwQkFBTSxLQUFLLEtBQUwsQ0FBVyxJQUQxQjtBQUVTLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRi9CO0FBR1MsMkJBQU8sT0FBTyxPQUh2QjtBQUxKLGFBREo7QUFZSDs7OzZDQUVvQjtBQUNqQixpQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixTQUFyQixDQUErQixTQUEvQjtBQUNIOzs7Ozs7a0JBckNnQixPOzs7QUF3Q3JCLFFBQVEsU0FBUixHQUFvQjtBQUNoQixXQUFPLGlCQUFVLEtBREQ7QUFFaEIsZUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBRlo7QUFHaEIsVUFBTSxpQkFBVSxNQUFWLENBQWlCO0FBSFAsQ0FBcEI7Ozs7Ozs7Ozs7O0FDdEhBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFYQTs7Ozs7OztJQWNxQixPOzs7QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHNIQUNULEtBRFM7O0FBRWYsY0FBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFNBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLE0sRUFBUTtBQUNoQixtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxhQUFhLE9BQU8sS0FBbkMsRUFBMEMsS0FBSyxPQUFPLEVBQXREO0FBQ0k7QUFDSSwyQkFBTyxPQUFPLFVBRGxCO0FBRUksK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FGMUI7QUFHSSwwQkFBTSxLQUFLLEtBQUwsQ0FBVyxJQUhyQjtBQURKLGFBREo7QUFRSDs7Ozs7O2tCQWZnQixPOzs7QUFrQnJCLFFBQVEsU0FBUixHQUFvQjtBQUNoQixXQUFPLGlCQUFVLEtBREQ7QUFFaEIsZUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBRlo7QUFHaEIsVUFBTSxpQkFBVSxNQUFWLENBQWlCO0FBSFAsQ0FBcEI7Ozs7Ozs7Ozs7OztBQ3pCQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7OzsrZUFiQTs7Ozs7OztBQWdCQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixPQUFvQjtBQUFBLFFBQWxCLElBQWtCLFFBQWxCLElBQWtCO0FBQUEsUUFBWixNQUFZLFFBQVosTUFBWTs7QUFDdEMsUUFBTSxXQUFXLE9BQU8sWUFBUCxDQUFvQixVQUFwQixHQUFpQyxHQUFqQyxHQUF1QyxPQUFPLFlBQVAsQ0FBb0IsU0FBNUU7QUFDQSxXQUNJO0FBQUE7QUFBQTtBQUFBO0FBQ1csZ0NBQVksT0FBTyxVQUFuQixFQUErQixLQUFLLE1BQXBDLENBRFg7QUFBQTtBQUVTLGdCQUZUO0FBQUE7QUFHVSxlQUFPLFlBQVAsQ0FBb0Isc0JBQXBCLENBQTJDLENBQTNDLEVBQThDLElBSHhEO0FBQUE7QUFJYSxlQUFPLE1BSnBCO0FBQUE7QUFJNEIsaURBSjVCO0FBQUE7QUFLbUIsZUFBTyxJQUwxQjtBQUFBO0FBQUE7QUFTMkQsZUFBTztBQVRsRSxLQURKO0FBYUgsQ0FmRDs7QUFpQkEsY0FBYyxTQUFkLEdBQTBCO0FBQ3RCLFVBQU0saUJBQVUsTUFBVixDQUFpQixVQUREO0FBRXRCLFlBQVEsaUJBQVUsTUFBVixDQUFpQjtBQUZILENBQTFCOztJQU1NLE07OztBQUNGLG9CQUFhLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxvSEFDVixLQURVOztBQUVoQixjQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCO0FBQ0EsY0FBSyxLQUFMLEdBQWEsRUFBQyxVQUFVLEtBQVgsRUFBYjtBQUhnQjtBQUluQjs7OztxQ0FFWTtBQUNULGlCQUFLLFFBQUwsQ0FBYyxFQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUF2QixFQUFkO0FBQ0g7OztpQ0FFUTtBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSwwQkFBRyxTQUFTLEtBQUssVUFBakI7QUFDRyx1Q0FBVyx3QkFEZDtBQUVHLG1DQUFPLEVBQUMsUUFBUSxhQUFULEVBRlY7QUFHSyw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixPQUFoQixDQUF3QjtBQUg3QjtBQURKLGlCQURKO0FBUUsscUJBQUssS0FBTCxDQUFXLFFBQVgsR0FDRyw4QkFBQyxVQUFEO0FBQ0ksMEJBQU0sS0FBSyxLQUFMLENBQVcsSUFEckI7QUFFSSwrQkFBVyxLQUFLLEtBQUwsQ0FBVyxTQUYxQjtBQUdJLDRCQUFRLEtBQUssS0FBTCxDQUFXLE1BSHZCO0FBSUksZ0NBQVksS0FBSyxVQUpyQixHQURILEdBT0csOEJBQUMsYUFBRCxJQUFlLE1BQU0sS0FBSyxLQUFMLENBQVcsSUFBaEMsRUFBc0MsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUF6RDtBQWZSLGFBREo7QUFtQkg7Ozs7RUEvQmdCLGdCQUFNLFM7O0FBa0MzQixPQUFPLFNBQVAsR0FBbUI7QUFDZixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUjtBQUVmLGVBQVcsaUJBQVUsTUFBVixDQUFpQixVQUZiO0FBR2YsWUFBUSxpQkFBVSxNQUFWLENBQWlCO0FBSFYsQ0FBbkI7O0lBT2EsTyxXQUFBLE87OztBQUNULHFCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx1SEFDVCxLQURTOztBQUVmLGVBQUssS0FBTCxHQUFhLEVBQUMsT0FBTyxTQUFSLEVBQWI7QUFGZTtBQUdsQjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsU0FBckIsQ0FBK0IsVUFBL0I7QUFDSDs7O29DQUVXLE0sRUFBUTtBQUNoQixnQkFBTSxlQUFlLE9BQU8sWUFBUCxDQUFvQixzQkFBcEIsQ0FBMkMsQ0FBM0MsRUFBOEMsSUFBbkU7QUFDQSxnQkFBTSxXQUFXLE9BQU8sWUFBUCxDQUFvQixVQUFwQixHQUFnQyxHQUFoQyxHQUFxQyxPQUFPLFlBQVAsQ0FBb0IsU0FBMUU7QUFDQSxnQkFBTSxPQUFPLE9BQU8sSUFBcEI7QUFDQSxnQkFBTSwwQkFBd0IsUUFBeEIsWUFBdUMsWUFBdkMsZ0JBQThELElBQXBFO0FBQ0EsbUJBQ0k7QUFBQTtBQUFBLGtCQUFPLFFBQVEsVUFBZixFQUEyQixLQUFLLE9BQU8sRUFBdkM7QUFDSSw4Q0FBQyxNQUFELElBQVEsTUFBTSxLQUFLLEtBQUwsQ0FBVyxJQUF6QjtBQUNRLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRDlCO0FBRVEsNEJBQVEsTUFGaEIsR0FESjtBQUlJO0FBQUE7QUFBQTtBQUNJO0FBQ0ksK0JBQU8sT0FBTyxRQURsQjtBQUVJLG1DQUFXLEtBQUssS0FBTCxDQUFXLFNBRjFCO0FBREo7QUFKSixhQURKO0FBWUg7Ozs7OztBQUdMLFFBQVEsU0FBUixHQUFvQjtBQUNoQixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUDtBQUVoQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFGWjtBQUdoQixXQUFPLGlCQUFVO0FBSEQsQ0FBcEI7O0FBT0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxHQUFNO0FBQ2pCLFdBQ0k7QUFBQTtBQUFBLFVBQUssV0FBVSxXQUFmO0FBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSxtQ0FBZjtBQUFBO0FBQUE7QUFESixLQURKO0FBT0gsQ0FSRDs7QUFXQSxJQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsUUFBeUQ7QUFBQSxRQUF2RCxJQUF1RCxTQUF2RCxJQUF1RDtBQUFBLFFBQWpELFFBQWlELFNBQWpELFFBQWlEO0FBQUEsUUFBdkMsa0JBQXVDLFNBQXZDLGtCQUF1QztBQUFBLFFBQW5CLGFBQW1CLFNBQW5CLGFBQW1COztBQUM5RSxXQUNJO0FBQUE7QUFBQSxVQUFLLFdBQVUsS0FBZjtBQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsVUFBZjtBQUNJO0FBQUE7QUFBQSxrQkFBTyxTQUFRLGFBQWY7QUFBOEIscUJBQUs7QUFBbkMsYUFESjtBQUVJLHFEQUFPLFdBQVUsY0FBakI7QUFDTyxvQkFBRyxNQURWO0FBRU8sdUJBQU8sU0FBUyxJQUZ2QjtBQUdPLDBCQUFVLGFBSGpCO0FBSU8sNkJBQWEsS0FBSyxpQkFKekI7QUFGSixTQURKO0FBU0k7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBLGtCQUFLLFdBQVUsZUFBZjtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSwwQkFBTSxXQUFVLDBCQUFoQjtBQUNLLDZCQUFLLHdCQURWO0FBQUE7QUFBQTtBQURKLGlCQURKO0FBTUk7QUFBQTtBQUFBLHNCQUFLLFdBQVUsMEJBQWY7QUFDSztBQURMO0FBTko7QUFESjtBQVRKLEtBREo7QUF3QkgsQ0F6QkQ7O0FBMkJBLGlCQUFpQixTQUFqQixHQUE2QjtBQUN6QixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFERTtBQUV6QixjQUFVLGlCQUFVLE1BRks7QUFHekIsd0JBQW9CLGlCQUFVLE1BSEw7QUFJekIsbUJBQWUsaUJBQVUsSUFBVixDQUFlO0FBSkwsQ0FBN0I7O0FBUUEsSUFBTSx5QkFBeUIsU0FBekIsc0JBQXlCLFFBQXFDO0FBQUEsUUFBbkMsSUFBbUMsU0FBbkMsSUFBbUM7QUFBQSxRQUE3QixRQUE2QixTQUE3QixRQUE2QjtBQUFBLFFBQW5CLGFBQW1CLFNBQW5CLGFBQW1COztBQUNoRSxXQUNJO0FBQUE7QUFBQSxVQUFLLFdBQVUsS0FBZjtBQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsNkJBQWY7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsc0JBQU8sU0FBUSxhQUFmO0FBQThCLHlCQUFLO0FBQW5DLGlCQURKO0FBRUksNERBQVUsV0FBVSxjQUFwQjtBQUNVLHdCQUFHLE1BRGI7QUFFVSwyQkFBTyxTQUFTLElBRjFCO0FBR1UsOEJBQVUsYUFIcEI7QUFJVSxpQ0FBYSxLQUFLLG1CQUo1QjtBQUZKO0FBREo7QUFESixLQURKO0FBZUgsQ0FoQkQ7O0FBa0JBLHVCQUF1QixTQUF2QixHQUFtQztBQUMvQixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUTtBQUUvQixjQUFVLGlCQUFVLE1BRlc7QUFHL0IsbUJBQWUsaUJBQVUsSUFBVixDQUFlO0FBSEMsQ0FBbkM7O0FBT0EsSUFBTSxjQUFjLFNBQWQsV0FBYyxHQUFNO0FBQ3RCLFdBQ0k7QUFBQTtBQUFBLFVBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsYUFBakI7QUFDSSw2REFBTyxNQUFLLE1BQVosRUFBbUIsUUFBTyxTQUExQixHQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0ksNkRBQUcsV0FBVSxjQUFiLEdBREo7QUFFSSxtRUFGSjtBQUdJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFISjtBQUZKO0FBREo7QUFESixTQURKO0FBYUk7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsWUFBakI7QUFDSSw2REFBTyxNQUFLLE1BQVosR0FESjtBQUVJO0FBQUE7QUFBQTtBQUNJLDZEQUFHLFdBQVUsaUJBQWIsR0FESjtBQUVJLG1FQUZKO0FBR0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhKO0FBRko7QUFESjtBQURKO0FBYkosS0FESjtBQTRCSCxDQTdCRDs7QUFnQ0EsSUFBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLFFBQWtDO0FBQUEsUUFBaEMsSUFBZ0MsU0FBaEMsSUFBZ0M7QUFBQSxRQUExQixTQUEwQixTQUExQixTQUEwQjtBQUFBLFFBQWYsU0FBZSxTQUFmLFNBQWU7O0FBQ3hELFdBQU8sS0FBSyxPQUFaO0FBQ0EsV0FDSTtBQUFBO0FBQUEsVUFBSyxXQUFVLFlBQWY7QUFDQyxTQUFDLFNBQUQsR0FDRztBQUFBO0FBQUEsY0FBSyxNQUFLLGNBQVYsRUFBeUIsV0FBVSxjQUFuQztBQUNJO0FBQUE7QUFBQSxrQkFBRyxTQUFTLFVBQVUsWUFBdEIsRUFBb0MsV0FBVSx3QkFBOUM7QUFBd0UscUJBQUs7QUFBN0U7QUFESixTQURILEdBSUMsRUFMRjtBQU1JO0FBQUE7QUFBQSxjQUFJLFdBQVUsa0NBQWQ7QUFDSTtBQUFBO0FBQUEsa0JBQUksTUFBSyxjQUFULEVBQXdCLFdBQVUsY0FBbEM7QUFDSTtBQUFBO0FBQUEsc0JBQUcsU0FBUyxVQUFVLFVBQXRCLEVBQWtDLFdBQVUscUJBQTVDO0FBQW1FLHlCQUFLO0FBQXhFO0FBREosYUFESjtBQUlJO0FBQUE7QUFBQSxrQkFBSSxNQUFLLGNBQVQsRUFBd0IsV0FBVSxZQUFsQztBQUNJO0FBQUE7QUFBQSxzQkFBRyxTQUFTLFVBQVUsVUFBdEIsRUFBa0MsV0FBVSx3QkFBNUM7QUFBc0UseUJBQUs7QUFBM0U7QUFESixhQUpKO0FBT0k7QUFBQTtBQUFBLGtCQUFJLE1BQUssY0FBVCxFQUF3QixXQUFVLGVBQWxDO0FBQ0k7QUFBQTtBQUFBLHNCQUFHLFdBQVUsd0JBQWI7QUFBdUMseUJBQUs7QUFBNUM7QUFESixhQVBKO0FBVUk7QUFWSjtBQU5KLEtBREo7QUFxQkgsQ0F2QkQ7O0FBeUJBLGtCQUFrQixTQUFsQixHQUE4QjtBQUMxQixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFERztBQUUxQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFGRjtBQUcxQixlQUFXLGlCQUFVLElBQVYsQ0FBZTtBQUhBLENBQTlCOztJQU9NLFU7OztBQUVGLHdCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw2SEFDVCxLQURTOztBQUVmLFlBQU0sU0FBUyxPQUFLLEtBQUwsQ0FBVyxNQUExQjtBQUNBLFlBQUksTUFBSixFQUFZO0FBQ1I7QUFDQSxtQkFBSyxLQUFMLEdBQWEsRUFBQyxLQUFLLEtBQU4sRUFBYSxNQUFNLE9BQU8sSUFBMUIsRUFBZ0MsTUFBTSxPQUFPLElBQTdDLEVBQW1ELFFBQVEsT0FBTyxNQUFsRSxFQUFiO0FBQ0gsU0FIRCxNQUdPO0FBQ0gsbUJBQUssS0FBTCxHQUFhLEVBQUMsS0FBSyxJQUFOLEVBQVksTUFBTSxFQUFsQixFQUFzQixNQUFNLENBQTVCLEVBQStCLFFBQVEsT0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUF6RCxFQUFiO0FBQ0g7QUFDRCxlQUFLLFVBQUwsR0FBa0IsT0FBSyxVQUFMLENBQWdCLElBQWhCLFFBQWxCO0FBQ0EsZUFBSyxZQUFMLEdBQW9CLE9BQUssWUFBTCxDQUFrQixJQUFsQixRQUFwQjtBQVZlO0FBV2xCOzs7O3NDQUVhLEMsRUFBRztBQUNiO0FBQ0EsZ0JBQU0sUUFBUSxFQUFFLE1BQUYsQ0FBUyxFQUF2QjtBQUNBLGlCQUFLLFFBQUwscUJBQWdCLEtBQWhCLEVBQXdCLEVBQUUsTUFBRixDQUFTLEtBQWpDO0FBQ0g7OztxQ0FFWTtBQUNUO0FBQ0EsZ0JBQU0sU0FBUztBQUNYLDBCQUFVLEtBQUssS0FBTCxDQUFXLE1BRFY7QUFFWCx1Q0FBdUIsS0FBSyxtQkFBTCxFQUZaO0FBR1gsd0JBQVEsQ0FIRztBQUlYLHdCQUFRLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsRUFKRztBQUtYLHdCQUFRLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFMRyxhQUFmO0FBT0EsZ0JBQUksVUFBVSxTQUFWLE9BQVUsQ0FBUyxJQUFULEVBQWU7QUFDekIscUJBQUssS0FBTCxDQUFXLFVBQVg7QUFDQSxxQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixXQUFyQixDQUFpQyxTQUFqQyxFQUE0QyxJQUE1QztBQUNILGFBSEQ7QUFJQSxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxHQUFmLEVBQW9CO0FBQ2hCLG9DQUFRLE1BQVIsRUFBZ0IsaUJBQVUsb0JBQVYsRUFBaEIsRUFBa0QsTUFBbEQsRUFBMEQsUUFBUSxJQUFSLENBQWEsSUFBYixDQUExRDtBQUNILGFBRkQsTUFFTztBQUNILG9DQUFRLE9BQVIsRUFBaUIsaUJBQVUsbUJBQVYsQ0FBOEIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUFoRCxDQUFqQixFQUNRLE1BRFIsRUFDZ0IsUUFBUSxJQUFSLENBQWEsSUFBYixDQURoQjtBQUVIO0FBQ0o7Ozt1Q0FFYztBQUNYLGdCQUFNLE9BQU8sRUFBQyxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsRUFBdkIsRUFBYjtBQUNBLGdCQUFJLFVBQVUsU0FBVixPQUFVLEdBQVc7QUFDckIscUJBQUssS0FBTCxDQUFXLFVBQVg7QUFDQSxxQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixXQUFyQixDQUFpQyxTQUFqQyxFQUE0QyxJQUE1QyxFQUFrRCxJQUFsRDtBQUNILGFBSEQ7O0FBS0EsZ0NBQVEsUUFBUixFQUFrQixpQkFBVSxtQkFBVixDQUE4QixLQUFLLEVBQW5DLENBQWxCLEVBQTBELElBQTFELEVBQWdFLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBaEU7QUFDSDs7OzhDQUVxQjtBQUNsQixnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFmLEVBQXVCO0FBQ25CLHVCQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsWUFBbEIsR0FBaUMsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUExRDtBQUNILGFBRkQsTUFFTztBQUNILG9CQUFNLFVBQVUsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixPQUFsQztBQUNBLG9CQUFJLFdBQVcsUUFBUSxNQUFSLEdBQWlCLENBQWhDLEVBQW1DO0FBQy9CLHdCQUFNLFNBQVMsUUFBUSxRQUFRLE1BQVIsR0FBaUIsQ0FBekIsQ0FBZjtBQUNBLDJCQUFPLE9BQU8sWUFBZDtBQUNIO0FBQ0QsdUJBQU8sQ0FBUDtBQUNIO0FBQ0o7OztpQ0FFUTtBQUNMLGdCQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixPQUE3QjtBQUNBLGdCQUFNLGNBQWMsV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLEtBQUssS0FBTCxDQUFXLElBQTdCLEdBQW9DLENBQS9DLENBQXBCO0FBQ0EsZ0JBQU0scUJBQXFCLDBCQUFjLEtBQUssbUJBQUwsS0FBNkIsV0FBM0MsQ0FBM0I7QUFDQSxtQkFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVSxrQkFBZjtBQUNJO0FBQUE7QUFBQSxzQkFBSyxXQUFVLDZDQUFmO0FBQ0ksa0RBQUMsTUFBRCxPQURKO0FBRUksa0RBQUMsZ0JBQUQ7QUFDSSw4QkFBTSxJQURWO0FBRUksdUNBQWUsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBRm5CO0FBR0ksa0NBQVUsS0FBSyxLQUhuQjtBQUlJLDRDQUFvQixrQkFKeEIsR0FGSjtBQU9JLGtEQUFDLHNCQUFEO0FBQ0ksOEJBQU0sSUFEVjtBQUVJLHVDQUFlLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUZuQjtBQUdJLGtDQUFVLEtBQUssS0FIbkIsR0FQSjtBQVdJLGtEQUFDLFdBQUQsT0FYSjtBQVlJLGtEQUFDLGlCQUFEO0FBQ0ksOEJBQU0sS0FBSyxLQUFMLENBQVcsSUFEckI7QUFFSSxtQ0FBVyxLQUFLLEtBQUwsQ0FBVyxHQUYxQjtBQUdJLG1DQUNJO0FBQ0ksd0NBQVksS0FBSyxLQUFMLENBQVcsVUFEM0I7QUFFSSx3Q0FBWSxLQUFLLFVBRnJCO0FBR0ksMENBQWMsS0FBSztBQUh2Qix5QkFKUjtBQVpKO0FBREosYUFESjtBQTJCSDs7OztFQWhHb0IsZ0JBQU0sUzs7QUFtRy9CLFdBQVcsU0FBWCxHQUF1QjtBQUNuQixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFESjtBQUVuQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFGVDtBQUduQixnQkFBWSxpQkFBVSxJQUFWLENBQWUsVUFIUjtBQUluQjtBQUNBO0FBQ0EsWUFBUSxpQkFBVSxNQU5DO0FBT25CLFlBQVEsaUJBQVU7QUFQQyxDQUF2Qjs7SUFXYSxhLFdBQUEsYTs7O0FBQ1QsMkJBQWEsS0FBYixFQUFvQjtBQUFBOztBQUFBLG1JQUNWLEtBRFU7O0FBRWhCLGVBQUssVUFBTCxHQUFrQixPQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsUUFBbEI7QUFDQSxlQUFLLEtBQUwsR0FBYSxFQUFDLFVBQVUsS0FBWCxFQUFiO0FBSGdCO0FBSW5COzs7O3FDQUVZO0FBQ1QsaUJBQUssUUFBTCxDQUFjLEVBQUMsVUFBVSxDQUFDLEtBQUssS0FBTCxDQUFXLFFBQXZCLEVBQWQ7QUFDSDs7O2lDQUVRO0FBQ0wsZ0JBQUksYUFBSjtBQUNBLGdCQUFJLEtBQUssS0FBTCxDQUFXLFFBQWYsRUFBeUI7QUFDckI7QUFDQSx1QkFBTyw4QkFBQyxVQUFEO0FBQ0gsMEJBQU0sS0FBSyxLQUFMLENBQVcsSUFEZDtBQUVILCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRm5CO0FBR0gsNEJBQVEsS0FBSyxLQUFMLENBQVcsTUFIaEI7QUFJSCxnQ0FBWSxLQUFLLFVBSmQsR0FBUDtBQUtILGFBUEQsTUFPTztBQUNILHVCQUFPLEVBQVA7QUFDSDtBQUNELG1CQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSwwQkFBRyxTQUFTLEtBQUssVUFBakI7QUFDRyx1Q0FBVyx3QkFEZDtBQUVHLG1DQUFPLEVBQUMsUUFBUSxhQUFULEVBRlY7QUFHSSw2REFBRyxXQUFVLFlBQWIsR0FISjtBQUlLLDZCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQXdCO0FBSjdCO0FBREosaUJBREo7QUFTSztBQVRMLGFBREo7QUFhSDs7OztFQXBDOEIsZ0JBQU0sUzs7QUF1Q3pDLGNBQWMsU0FBZCxHQUEwQjtBQUN0QixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFERDtBQUV0QixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFGTjtBQUd0QixZQUFRLGlCQUFVO0FBSEksQ0FBMUI7Ozs7Ozs7OztRQ3RZZ0IsVyxHQUFBLFc7UUFjQSxTLEdBQUEsUztRQWVBLE8sR0FBQSxPO1FBMEVBLGEsR0FBQSxhOztBQTFHaEI7Ozs7OztBQUdPLFNBQVMsV0FBVCxDQUFxQixVQUFyQixFQUFpQyxVQUFqQyxFQUE2QztBQUNoRDtBQUNBLFFBQUksVUFBSixFQUFnQjtBQUNaLFlBQU0sU0FBUyxPQUFmO0FBQ0EsWUFBTSxPQUFPLElBQUksSUFBSixDQUFTLFdBQVcsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixFQUF5QixPQUF6QixDQUFpQyxHQUFqQyxFQUFzQyxJQUF0QyxDQUFULENBQWI7QUFDQSxZQUFNLE1BQU0sS0FBSyxVQUFMLEVBQVo7QUFDQSxZQUFNLFFBQVEsV0FBVyxLQUFLLFdBQUwsRUFBWCxDQUFkO0FBQ0EsWUFBTSxPQUFPLEtBQUssY0FBTCxFQUFiO0FBQ0EsZUFBTyxNQUFNLEdBQU4sR0FBWSxLQUFaLEdBQW9CLEdBQXBCLEdBQTBCLElBQWpDO0FBQ0g7QUFDRCxXQUFPLGNBQVA7QUFDSCxDLENBdEJEOzs7Ozs7O0FBeUJPLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUM1QixRQUFJLGNBQWMsSUFBbEI7QUFDQSxRQUFJLFNBQVMsTUFBVCxJQUFtQixTQUFTLE1BQVQsS0FBb0IsRUFBM0MsRUFBK0M7QUFDM0MsWUFBSSxVQUFVLFNBQVMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUFkO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsTUFBNUIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDckMsZ0JBQUksU0FBUyxRQUFRLENBQVIsRUFBVyxJQUFYLEVBQWI7QUFDQSxnQkFBSSxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsRUFBb0IsS0FBSyxNQUFMLEdBQWMsQ0FBbEMsS0FBeUMsT0FBTyxHQUFwRCxFQUEwRDtBQUN0RCw4QkFBYyxtQkFBbUIsT0FBTyxTQUFQLENBQWlCLEtBQUssTUFBTCxHQUFjLENBQS9CLENBQW5CLENBQWQ7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNELFdBQU8sV0FBUDtBQUNIOztBQUVNLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QixJQUE5QixFQUFvQyxRQUFwQyxFQUE4QyxPQUE5QyxFQUF1RDtBQUMxRCxhQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsR0FBeEIsRUFBNkIsSUFBN0IsRUFBa0M7QUFDOUIsZUFBTywrQkFBTSxHQUFOLEVBQVc7QUFDZCx5QkFBYSxhQURDO0FBRWQsb0JBQVEsTUFGTTtBQUdkLHFCQUFTO0FBQ0wsZ0NBQWdCLGtCQURYO0FBRUwsK0JBQWUsVUFBVSxXQUFWO0FBRlYsYUFISztBQU9kLGtCQUFNLEtBQUssU0FBTCxDQUFlLElBQWY7QUFQUSxTQUFYLENBQVA7QUFTSDs7QUFFRCxRQUFJLGdCQUFKO0FBQ0EsWUFBUSxNQUFSO0FBQ0ksYUFBSyxLQUFMO0FBQ0ksc0JBQVU7QUFBQSx1QkFBTSwrQkFBTSxHQUFOLEVBQVc7QUFDdkIsaUNBQWEsYUFEVTtBQUV2Qiw0QkFBUSxLQUZlO0FBR3ZCLDZCQUFTLEVBQUMsZ0JBQWdCLGtCQUFqQjtBQUhjLGlCQUFYLENBQU47QUFBQSxhQUFWO0FBS0E7O0FBRUosYUFBSyxNQUFMO0FBQ0ksc0JBQVU7QUFBQSx1QkFBTSxPQUFPLE1BQVAsRUFBZSxHQUFmLEVBQW9CLElBQXBCLENBQU47QUFBQSxhQUFWO0FBQ0E7O0FBRUosYUFBSyxLQUFMO0FBQ0ksc0JBQVU7QUFBQSx1QkFBTSxPQUFPLEtBQVAsRUFBYyxHQUFkLEVBQW1CLElBQW5CLENBQU47QUFBQSxhQUFWO0FBQ0E7O0FBRUosYUFBSyxPQUFMO0FBQ0ksc0JBQVU7QUFBQSx1QkFBTSxPQUFPLE9BQVAsRUFBZ0IsR0FBaEIsRUFBcUIsSUFBckIsQ0FBTjtBQUFBLGFBQVY7QUFDQTs7QUFFSixhQUFLLFFBQUw7QUFDSSxzQkFBVTtBQUFBLHVCQUFNLCtCQUFNLEdBQU4sRUFBVztBQUN2QixpQ0FBYSxhQURVO0FBRXZCLDRCQUFRLFFBRmU7QUFHdkIsNkJBQVM7QUFDTCx3Q0FBZ0Isa0JBRFg7QUFFTCx1Q0FBZSxVQUFVLFdBQVY7QUFGVjtBQUhjLGlCQUFYLENBQU47QUFBQSxhQUFWO0FBUUE7QUE5QlI7QUFnQ0E7QUFDSTtBQURKLEtBRUssSUFGTCxDQUVVLFVBQVMsUUFBVCxFQUFtQjtBQUNyQixZQUFJLFNBQVMsTUFBVCxJQUFtQixHQUF2QixFQUNJLE9BQU8sU0FBUyxJQUFULEVBQVAsQ0FESixLQUdJLE9BQU8sUUFBUDtBQUNQLEtBUEwsRUFPTyxJQVBQLENBT1ksUUFQWjtBQVFIOztBQUdEO0FBQ0E7QUFDTyxJQUFNLGdDQUFZO0FBQ2pCLGNBQVUsZ0JBQUMsRUFBRDtBQUFBLG9DQUEyQixFQUEzQjtBQUFBLEtBRE87QUFFakIsZUFBVyxpQkFBQyxFQUFEO0FBQUEseURBQWdELEVBQWhEO0FBQUEsS0FGTTtBQUdqQixrQkFBYyxvQkFBQyxFQUFEO0FBQUEsb0VBQTJELEVBQTNEO0FBQUEsS0FIRztBQUlqQixlQUFXLGlCQUFDLEVBQUQ7QUFBQSxzRkFBNkUsRUFBN0U7QUFBQSxLQUpNO0FBS2pCLGVBQVcsaUJBQUMsRUFBRDtBQUFBLG1HQUEwRixFQUExRjtBQUFBLEtBTE07QUFNakIsZ0JBQVksa0JBQUMsRUFBRDtBQUFBLGlIQUF3RyxFQUF4RztBQUFBLEtBTks7QUFPakIsY0FBVSxnQkFBQyxFQUFEO0FBQUEsOENBQXFDLEVBQXJDO0FBQUEsS0FQTztBQVFqQiwyQkFBdUIsNkJBQUMsRUFBRDtBQUFBLDZEQUFvRCxFQUFwRDtBQUFBLEtBUk47QUFTakIsNEJBQXdCO0FBQUE7QUFBQSxLQVRQO0FBVWpCLFlBQVEsY0FBQyxFQUFEO0FBQUEsa0NBQXlCLEVBQXpCO0FBQUEsS0FWUztBQVdqQixvQkFBZ0Isc0JBQUMsRUFBRDtBQUFBLDhEQUFxRCxFQUFyRDtBQUFBLEtBWEM7QUFZakIsbUJBQWUscUJBQUMsRUFBRDtBQUFBLG1EQUEwQyxFQUExQztBQUFBO0FBWkUsQ0FBbEI7O0FBZUEsU0FBUyxhQUFULENBQXVCLFlBQXZCLEVBQXFDO0FBQ3hDO0FBQ0EsUUFBSSxpQkFBaUIsU0FBakIsSUFBOEIsaUJBQWlCLElBQW5ELEVBQXlEO0FBQ3JELFlBQUksU0FBUyxPQUFiO0FBQ0EsWUFBSSxRQUFRLFdBQVcsWUFBWCxDQUFaO0FBQ0EsWUFBSSxDQUFDLE1BQU0sS0FBTixDQUFMLEVBQW1CO0FBQ2YsbUJBQU8sTUFBTSxjQUFOLENBQXFCLE1BQXJCLENBQVA7QUFDSDtBQUNKO0FBQ0QsV0FBTyxZQUFQO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMuanN4JztcbmltcG9ydCB7QVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczMDY2NjkvXG5PYmplY3QudmFsdWVzID0gT2JqZWN0LnZhbHVlcyB8fCAob2JqID0+IE9iamVjdC5rZXlzKG9iaikubWFwKGtleSA9PiBvYmpba2V5XSkpO1xuXG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICBjb25zdCBpc1B1YmxpYyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzJykuaW5uZXJIVE1MKS5wdWJsaWM7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgICAgIGNvbnN0IG1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0OiB7aWQ6IHByb2plY3RJZHMucHJvamVjdF9pZH0sXG4gICAgICAgICAgICBpMThuOiB7c3RyaW5nczogc3RyaW5ncywgbW9udGhzOiBtb250aHN9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0LmlkKSwgJycsIHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTW9kZWwobW9kZWwsIGRhdGEsIGRlbD1mYWxzZSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG5ld1N0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIGlmIChkZWwpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIHdlIHNob3VsZG4ndCBlZGl0IHRoZSBzdGF0ZSBvYmplY3QgZGlyZWN0bHkgd2UgaGF2ZSB0byBtYWtlIGEgKHNoYWxsb3cpIGNvcHlcbiAgICAgICAgICAgIC8vIGFuZCBkZWxldGUgZnJvbSB0aGUgY29weS4gVE9ETzogdGhpbmsgaGFyZCBpZiB0aGlzIGNhbiBsZWFkIHRvIHRyb3VibGUuLi5cbiAgICAgICAgICAgIGNvbnN0IG5ld01vZGVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKTtcbiAgICAgICAgICAgIGRlbGV0ZSBuZXdNb2RlbFtpZF07XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskc2V0OiBuZXdNb2RlbH19KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgLy8gVHVybiB0aGUgaW5kZXhlZCBtb2RlbCBiYWNrIHRvIGEgbGlzdCBvZiBtb2RlbCBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIHRyZWUgb2YgbW9kZWxzIGZyb20gdGhlIGxvd2VzdCBsZXZlbCAoQ29tbWVudCkgYW5kIHVwIHRvIFJlc3VsdFxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IFwiY29tbWVudHNcIn0sXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5jb21tZW50cylcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwZXJpb2RzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5wZXJpb2RzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicGVyaW9kXCIsIGNoaWxkcmVuOiBcInVwZGF0ZXNcIn0sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGVkX3BlcmlvZHMgPSBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcyk7XG5cbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBcImluZGljYXRvcnNcIn0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMuc3RhdGUucmVzdWx0c0RhdGFUcmVlO1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBsb2FkTW9kZWw6IHRoaXMubG9hZE1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICB1cGRhdGVNb2RlbDogdGhpcy51cGRhdGVNb2RlbC5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt0cmVlfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e2NhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5zdGF0ZS5pMThufS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2NvbW1lbnQuaWR9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuQ29tbWVudHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGljYXRvcnMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcImluZGljYXRvcnNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoaW5kaWNhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5wcm9wcy5pMThuLnN0cmluZ3M7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpbmRpY2F0b3IuaWR9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3N0cmluZ3MuYmFzZWxpbmVfeWVhcn06IHtpbmRpY2F0b3IuYmFzZWxpbmVfeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzdHJpbmdzLmJhc2VsaW5lX3ZhbHVlfToge2luZGljYXRvci5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPFBlcmlvZHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e2luZGljYXRvci5wZXJpb2RzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cbn1cblxuSW5kaWNhdG9ycy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29sbGFwc2UsIHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghIGl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiB0aGlzLnJlbmRlclBhbmVsKGl0ZW0pKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IExldmVsIGZyb20gXCIuL0xldmVsLmpzeFwiO1xuaW1wb3J0IHtVcGRhdGVzLCBOZXdVcGRhdGVGb3JtfSBmcm9tIFwiLi9VcGRhdGVzLmpzeFwiO1xuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5cbmNsYXNzIFBlcmlvZExvY2tUb2dnbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubG9ja1RvZ2dsZSA9IHRoaXMubG9ja1RvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2xvY2tpbmc6IGZhbHNlfTtcbiAgICB9XG5cbiAgICBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRzLnBlcmlvZChwZXJpb2RJZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJwZXJpb2RzXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInBlcmlvZHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kKSB7XG4gICAgICAgIGNvbnN0IG1vbnRocyA9IHRoaXMucHJvcHMuaTE4bi5tb250aHM7XG4gICAgICAgIGNvbnN0IHBlcmlvZFN0YXJ0ID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCwgbW9udGhzKTtcbiAgICAgICAgY29uc3QgcGVyaW9kRW5kID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQsIG1vbnRocyk7XG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBgJHtwZXJpb2RTdGFydH0gLSAke3BlcmlvZEVuZH1gO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgUGVyaW9kOiB7cGVyaW9kRGF0ZX0gfFxuICAgICAgICAgICAgICAgICAgICBUYXJnZXQgdmFsdWU6IHtwZXJpb2QudGFyZ2V0X3ZhbHVlfSB8XG4gICAgICAgICAgICAgICAgICAgIEFjdHVhbCB2YWx1ZToge3BlcmlvZEFjdHVhbFZhbHVlKHBlcmlvZCl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17cGVyaW9kLmlkfT5cbiAgICAgICAgICAgICAgICA8TmV3VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfS8+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17cGVyaW9kLnVwZGF0ZXN9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cbn1cblxuUGVyaW9kcy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBJbmRpY2F0b3JzIGZyb20gJy4vSW5kaWNhdG9ycy5qc3gnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtyZXN1bHQuaWR9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5SZXN1bHRzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4J1xuXG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50cywgZGlzcGxheURhdGUsIGRpc3BsYXlOdW1iZXJ9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5cbmNvbnN0IFVwZGF0ZURpc3BsYXkgPSAoe2kxOG4sIHVwZGF0ZX0pID0+IHtcbiAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArIFwiIFwiICsgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIFdoZW46IHtkaXNwbGF5RGF0ZSh1cGRhdGUuY3JlYXRlZF9hdCwgaTE4bi5tb250aHMpfSB8XG4gICAgICAgICAgICBCeToge3VzZXJOYW1lfSB8XG4gICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgU3RhdHVzOiB7dXBkYXRlLnN0YXR1c30gPGJyLz5cbiAgICAgICAgICAgIFVwZGF0ZSB2YWx1ZToge3VwZGF0ZS5kYXRhfSB8IHsvKlxuICAgICAgICAgTk9URTogd2UgdXNlIHVwZGF0ZS5hY3R1YWxfdmFsdWUsIGEgdmFsdWUgY2FsY3VsYXRlZCBpbiBBcHAuYW5ub3RhdGVVcGRhdGVzKCksXG4gICAgICAgICBub3QgdXBkYXRlLnBlcmlvZF9hY3R1YWxfdmFsdWUgZnJvbSB0aGUgYmFja2VuZFxuICAgICAgICAgKi99XG4gICAgICAgICAgICBBY3R1YWwgdG90YWwgZm9yIHRoaXMgcGVyaW9kIChpbmNsdWRpbmcgdGhpcyB1cGRhdGUpOiB7dXBkYXRlLmFjdHVhbF92YWx1ZX1cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuVXBkYXRlRGlzcGxheS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGZhbHNlfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4uc3RyaW5ncy5lZGl0X3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZvcm1PcGVuID9cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVRvZ2dsZT17dGhpcy5mb3JtVG9nZ2xlfS8+XG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRGlzcGxheSBpMThuPXt0aGlzLnByb3BzLmkxOG59IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuZXhwb3J0IGNsYXNzIFVwZGF0ZXMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn07XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBkYXRhID0gdXBkYXRlLmRhdGE7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIGRhdGE6ICR7ZGF0YX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXt1cGRhdGUuaWR9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGUgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17dXBkYXRlLmNvbW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlcy5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG59O1xuXG5cbmNvbnN0IEhlYWRlciA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICBIZWFkZXJcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlSW5wdXQgPSAoe2kxOG4sIGZvcm1EYXRhLCB1cGRhdGVkQWN0dWFsVmFsdWUsIHNldFVwZGF0ZURhdGF9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFjdHVhbFZhbHVlXCI+e2kxOG4uYWRkX3RvX2FjdHVhbF92YWx1ZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICBpZD1cImRhdGFcIlxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFVwZGF0ZURhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuLmlucHV0X3BsYWNlaG9sZGVyfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cEFjdHVhbFZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpMThuLnRvdGFsX3ZhbHVlX2FmdGVyX3VwZGF0ZX06XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dXBkYXRlZEFjdHVhbFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybURhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlZEFjdHVhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNldFVwZGF0ZURhdGE6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVEZXNjcmlwdGlvbiA9ICh7aTE4biwgZm9ybURhdGEsIHNldFVwZGF0ZURhdGF9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTkgdXBkYXRlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPntpMThuLmFjdHVhbF92YWx1ZV9jb21tZW50fTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50ZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFVwZGF0ZURhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bi5jb21tZW50X3BsYWNlaG9sZGVyfT5cbiAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZURlc2NyaXB0aW9uLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybURhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc2V0VXBkYXRlRGF0YTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7aTE4biwgY2FsbGJhY2tzLCBuZXdVcGRhdGV9KSA9PiB7XG4gICAgaTE4biA9IGkxOG4uc3RyaW5ncztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVBY3Rpb25cIj5cbiAgICAgICAgeyFuZXdVcGRhdGUgP1xuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwicmVtb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmRlbGV0ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLmRlbGV0ZX08L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgOiAnJ31cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYtcGlsbHMgYm90dG9tUm93IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiY2FuY2VsVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5mb3JtVG9nZ2xlfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e2kxOG4uY2FuY2VsfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLnNhdmV9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57aTE4bi5hcHByb3ZlfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZUZvcm1CdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbmV3VXBkYXRlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnByb3BzLnVwZGF0ZTtcbiAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgLy8gY3JlYXRlIHN0YXRlIGZyb20gZXhpc3RpbmcgdXBkYXRlLCBOT1RFOiBcIm5ld1wiIGRlbm90ZXMgaWYgdGhpcyBpcyBhIG5ldyB1cGRhdGUgb3Igbm90XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge25ldzogZmFsc2UsIHRleHQ6IHVwZGF0ZS50ZXh0LCBkYXRhOiB1cGRhdGUuZGF0YSwgcGVyaW9kOiB1cGRhdGUucGVyaW9kfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7bmV3OiB0cnVlLCB0ZXh0OiBcIlwiLCBkYXRhOiAwLCBwZXJpb2Q6IHRoaXMucHJvcHMucGVyaW9kLmlkfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNhdmVVcGRhdGUgPSB0aGlzLnNhdmVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGVVcGRhdGUgPSB0aGlzLmRlbGV0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHNldFVwZGF0ZURhdGEoZSkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIGZvcm0gZmllbGQgd2lkZ2V0c1xuICAgICAgICBjb25zdCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtbZmllbGRdOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoKSB7XG4gICAgICAgIC8vTk9URTogcGVyaW9kX2FjdHVhbF92YWx1ZSBpcyBuZWVkZWQgZm9yIHNlcnZlciBzaWRlIGNhbGN1bGF0aW9ucyB0byBiZSBjb3JyZWN0XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgICdwZXJpb2QnOiB0aGlzLnN0YXRlLnBlcmlvZCxcbiAgICAgICAgICAgICdwZXJpb2RfYWN0dWFsX3ZhbHVlJzogdGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCksXG4gICAgICAgICAgICAndXNlcic6IDEsXG4gICAgICAgICAgICAndGV4dCc6IHRoaXMuc3RhdGUudGV4dC50cmltKCksXG4gICAgICAgICAgICAnZGF0YSc6IHRoaXMuc3RhdGUuZGF0YS50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwidXBkYXRlc1wiLCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubmV3KSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQT1NUJywgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzKCksIHVwZGF0ZSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModGhpcy5wcm9wcy51cGRhdGUuaWQpLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7aWQ6IHRoaXMucHJvcHMudXBkYXRlLmlkfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJ1cGRhdGVzXCIsIGRhdGEsIHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIEFQSUNhbGwoJ0RFTEVURScsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKGRhdGEuaWQpLCBudWxsLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHByZXZpb3VzQWN0dWFsVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBkYXRlLmFjdHVhbF92YWx1ZSAtIHRoaXMucHJvcHMudXBkYXRlLmRhdGFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLnByb3BzLnBlcmlvZC51cGRhdGVzO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZXMgJiYgdXBkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXBkYXRlc1t1cGRhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXRlc3QuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGkxOG4gPSB0aGlzLnByb3BzLmkxOG4uc3RyaW5ncztcbiAgICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMuc3RhdGUuZGF0YSA/IHRoaXMuc3RhdGUuZGF0YSA6IDApO1xuICAgICAgICBjb25zdCB1cGRhdGVkQWN0dWFsVmFsdWUgPSBkaXNwbGF5TnVtYmVyKHRoaXMucHJldmlvdXNBY3R1YWxWYWx1ZSgpICsgdXBkYXRlVmFsdWUpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lciBlZGl0LWluLXByb2dyZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXIvPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFVwZGF0ZURhdGE9e3RoaXMuc2V0VXBkYXRlRGF0YS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGE9e3RoaXMuc3RhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQWN0dWFsVmFsdWU9e3VwZGF0ZWRBY3R1YWxWYWx1ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFVwZGF0ZURhdGE9e3RoaXMuc2V0VXBkYXRlRGF0YS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGE9e3RoaXMuc3RhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEF0dGFjaG1lbnRzLz5cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1CdXR0b25zXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdVcGRhdGU9e3RoaXMuc3RhdGUubmV3fVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU6IHRoaXMucHJvcHMuZm9ybVRvZ2dsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVVwZGF0ZTogdGhpcy5zYXZlVXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVVcGRhdGU6IHRoaXMuZGVsZXRlVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGZvcm1Ub2dnbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgLy8gVE9ETzogb25lIG9mIHBlcmlvZCBhbmQgdXBkYXRlIGhhcyB0byBiZSBzdXBwbGllZC4gVGhpcyBpcyBhIGNsdW5reSB3YXkgb2YgaW5kaWNhdGluZyBhIG5ld1xuICAgIC8vIG9yIGV4aXNpdG5nIHVkcGRhdGUuIEEgYmV0dGVyIHdheSBzaG91bGQgYmUgZm91bmQuXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuXG5leHBvcnQgY2xhc3MgTmV3VXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGZhbHNlfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBmb3JtO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtT3Blbikge1xuICAgICAgICAgICAgLy9UT0RPOiBjYW4gZm9ybVRvZ2dsZSBiZSBtZXJnZWQgaW50byBjYWxsYmFja3M/XG4gICAgICAgICAgICBmb3JtID0gPFVwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICBwZXJpb2Q9e3RoaXMucHJvcHMucGVyaW9kfVxuICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU9e3RoaXMuZm9ybVRvZ2dsZX0vPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuZm9ybVRvZ2dsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXBsdXMnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnN0cmluZ3MubmV3X3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtmb3JtfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbk5ld1VwZGF0ZUZvcm0ucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RGF0ZShkYXRlU3RyaW5nLCBpMThuTW9udGhzKSB7XG4gICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICBpZiAoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IGkxOG5Nb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgfVxuICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBoYW5kbGVyO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBPU1RcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BPU1QnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBVVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUFVUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQQVRDSFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUEFUQ0gnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIkRFTEVURVwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZSgnY3NyZnRva2VuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xufVxuXG5cbi8vIE9iamVjdCBob2xkcyBjYWxsYmFjayBVUkwgZnVuY3Rpb25zIGFzIHZhbHVlcywgbW9zdCBvZiB0aGVtIGNhbGxlZCB3aXRoIGFuIGlkIHBhcmFtZXRlclxuLy8gVXNhZ2U6IGVuZHBvaW50cy5yZXN1bHQoMTcpIC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICAgICAgXCJyZXN1bHRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicmVzdWx0c1wiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImluZGljYXRvcnNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInVwZGF0ZXNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJjb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfY29tbWVudC8/Zm9ybWF0PWpzb24mZGF0YV9fcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVzX2FuZF9jb21tZW50c1wiOiAoKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVzZXJcIjogKGlkKSA9PiBgL3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiAoaWQpID0+IGAvcmVzdC92MS9wYXJ0bmVyc2hpcC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiZmlsZV91cGxvYWRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5TnVtYmVyKG51bWJlclN0cmluZykge1xuICAgIC8vIEFkZCBjb21tYXMgdG8gbnVtYmVycyBvZiAxMDAwIG9yIGhpZ2hlci5cbiAgICBpZiAobnVtYmVyU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgbnVtYmVyU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIHZhciBmbG9hdCA9IHBhcnNlRmxvYXQobnVtYmVyU3RyaW5nKTtcbiAgICAgICAgaWYgKCFpc05hTihmbG9hdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmbG9hdC50b0xvY2FsZVN0cmluZyhsb2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudW1iZXJTdHJpbmc7XG59Il19
