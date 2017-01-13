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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEz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REFBMEMsRUFBMUM7QUFBQTtBQVpFLENBQWxCOztBQWVBLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUN4QztBQUNBLFFBQUksaUJBQWlCLFNBQWpCLElBQThCLGlCQUFpQixJQUFuRCxFQUF5RDtBQUNyRCxZQUFJLFNBQVMsT0FBYjtBQUNBLFlBQUksUUFBUSxXQUFXLFlBQVgsQ0FBWjtBQUNBLFlBQUksQ0FBQyxNQUFNLEtBQU4sQ0FBTCxFQUFtQjtBQUNmLG1CQUFPLE1BQU0sY0FBTixDQUFxQixNQUFyQixDQUFQO0FBQ0g7QUFDSjtBQUNELFdBQU8sWUFBUDtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IFJlc3VsdHMgZnJvbSAnLi9SZXN1bHRzLmpzeCc7XG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50c30gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCBtb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgY29uc3QgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWxzOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwZXJpb2RzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXBkYXRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHRzRGF0YVRyZWU6IFtdLFxuICAgICAgICAgICAgcHJvamVjdDoge2lkOiBwcm9qZWN0SWRzLnByb2plY3RfaWR9LFxuICAgICAgICAgICAgaTE4bjoge3N0cmluZ3M6IHN0cmluZ3MsIG1vbnRoczogbW9udGhzfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBPbmNlIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZCwgbG9hZCB0aGUgcmVzdWx0cyB0aHJvdWdoIHRoZSBBUElcbiAgICAgICAgLy9UT0RPOiB0aGlzIFwiY2hhaW5lZFwiIHdheSBvZiBsb2FkaW5nIHRoZSBBUEkgZGF0YSBraW5kYSB0ZXJyaWJsZSBhbmQgc2hvdWxkIGJlIHJlcGxhY2VkXG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdyZXN1bHRzJyk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdpbmRpY2F0b3JzJyk7XG4gICAgfVxuXG4gICAgbG9hZE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIC8vIExvYWQgYSBtb2RlbCBmcm9tIHRoZSBBUEkuIEFmdGVyIGxvYWRpbmcgcmVidWlsZCB0aGUgZGF0YSB0cmVlLlxuICAgICAgICBpZiAoISB0aGlzLnN0YXRlLm1vZGVsc1ttb2RlbF0pIHtcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICB7bW9kZWxzOiB1cGRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLm1vZGVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWVyZ2U6IHtbbW9kZWxdOiB0aGlzLmluZGV4TW9kZWwocmVzcG9uc2UucmVzdWx0cyl9fVxuICAgICAgICAgICAgICAgICAgICApfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludHNbbW9kZWxdKHRoaXMuc3RhdGUucHJvamVjdC5pZCksICcnLCBzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKG1vZGVsLCBkYXRhLCBkZWw9ZmFsc2UpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBpZiAoZGVsKSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB3ZSBzaG91bGRuJ3QgZWRpdCB0aGUgc3RhdGUgb2JqZWN0IGRpcmVjdGx5IHdlIGhhdmUgdG8gbWFrZSBhIChzaGFsbG93KSBjb3B5XG4gICAgICAgICAgICAvLyBhbmQgZGVsZXRlIGZyb20gdGhlIGNvcHkuIFRPRE86IHRoaW5rIGhhcmQgaWYgdGhpcyBjYW4gbGVhZCB0byB0cm91YmxlLi4uXG4gICAgICAgICAgICBjb25zdCBuZXdNb2RlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSk7XG4gICAgICAgICAgICBkZWxldGUgbmV3TW9kZWxbaWRdO1xuICAgICAgICAgICAgbmV3U3RhdGUgPSB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHtbbW9kZWxdOiB7JHNldDogbmV3TW9kZWx9fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBDcmVhdGUgYW4gaW5kZXhlZCB2ZXJzaW9uIG9mIGEgbW9kZWwgYnkgY3JlYXRpbmcgYSBsaXN0IG9mIG9iamVjdHMsIG9uZSBmb3IgZWFjaCBtb2RlbFxuICAgICAgICBpbnN0YW5jZSB3aGVyZSB0aGUgb2JqZWN0IGtleSBpcyB0aGUgaWQgb2YgdGhlIGluc3RhbmNlIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGZ1bGwgaW5zdGFuY2UuXG4gICAgICAgIFRoaXMgY29uc3RydWN0IGlzIHVzZWQgdG8gYmUgYWJsZSB0byBlYXNpbHkgdXBkYXRlIGluZGl2aWR1YWwgaW5zdGFuY2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgZnVuY3Rpb24oYWNjLCBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IG9ialsnaWQnXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXhlZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGluZGV4ZWRPYmpbaWRdID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgaW5kZXhlZE9iailcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgfVxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGFuZCBvbiBkb3duIHZpYSBcInVwZGF0ZXNcIiBhbmQgXCJjb21tZW50c1wiLlxuICAgICAgICBUaGlzIGRhdGEgc3RydWN0dXJlIGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHdob2xlIHRyZWUgb2YgY29tcG9uZW50cyBlYWNoIGxldmVsIHBhc3NpbmcgdGhlXG4gICAgICAgIGNoaWxkIGxpc3QgYXMgdGhlIHByb3AgXCJpdGVtc1wiXG4gICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGROYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBIZWxwZXIgZnVuY3Rpb24gdGhhdCBsaW5rcyB0d28gbGV2ZWxzIGluIHRoZSBkYXRhIHRyZWUuIFRoZSBsaW5raW5nIGlzIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgZm9yZWlnbiBrZXkgZmllbGQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY2hpbGQgYmVpbmcgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcGFyZW50IG9iamVjdFxuICAgICAgICAgICAgUGFyYW1zOlxuICAgICAgICAgICAgICAgIHBhcmVudHM6IGxpc3Qgb2YgcGFyZW50IG9iamVjdHMuIEVhY2ggcGFyZW50IG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyBmaWVsZCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgaG9sZHMgdGhlIGxpc3Qgb2YgYXNzb2NpYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXM6IG9iamVjdCB3aXRoIHR3byBmaWVsZHMsIFwicGFyZW50XCIgYW5kIFwiY2hpbGRyZW5cIiB0aGF0IGhvbGQgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICB0aGUgZmllbGRzIGxpbmtpbmcgdGhlIHR3byBsZXZlbHMgb2Ygb2JqZWN0cy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbGlzdCBvZiBhbGwgY2hpbGQgb2JqZWN0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMgJiYgcGFyZW50cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZE5hbWVzLmNoaWxkcmVuXSA9IGNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9PiBjaGlsZFtmaWVsZE5hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEFkZCB0aGUgZmllbGQgXCJhY3R1YWxfdmFsdWVcIiB0byBlYWNoIHBlcmlvZCB1cGRhdGUsIHdoaWNoIGlzIHRoZSBzdW0gb2YgYWxsIHVwZGF0ZVxuICAgICAgICAgICAgdmFsdWVzIHVwIHRvIHRoaXMgcG9pbnQgaW4gdGltZS4gTm90ZSB0aGF0IHRoaXMgZmllbGQgZXhpc3RzIGluIHRoZSBkYXRhc2V0IGFzXG4gICAgICAgICAgICB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBidXQgd2UgY2FuJ3QgdXNlIHRoYXQgc2luY2Ugd2Ugd2FudCB0byBiZSBhYmxlIHRvXG4gICAgICAgICAgICAocmUpLWNhbGN1bGF0ZSBvbiBkYXRhIGNoYW5nZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RzICYmIHBlcmlvZHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVyaW9kLnVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxfdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVsnYWN0dWFsX3ZhbHVlJ10gPSBwYXJzZUludCh1cGRhdGUuZGF0YSkgKyBhY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICAgICAgICAgIC8vIFR1cm4gdGhlIGluZGV4ZWQgbW9kZWwgYmFjayB0byBhIGxpc3Qgb2YgbW9kZWwgb2JqZWN0XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG9mIG1vZGVscyBmcm9tIHRoZSBsb3dlc3QgbGV2ZWwgKENvbW1lbnQpIGFuZCB1cCB0byBSZXN1bHRcbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBcImNvbW1lbnRzXCJ9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LFxuICAgICAgICAgICAgdXBkYXRlcyk7XG4gICAgICAgIGNvbnN0IGFubm90YXRlZF9wZXJpb2RzID0gYW5ub3RhdGVVcGRhdGVzKHBlcmlvZHMpO1xuXG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmluZGljYXRvcnMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJpbmRpY2F0b3JcIiwgY2hpbGRyZW46IFwicGVyaW9kc1wifSxcbiAgICAgICAgICAgIGFubm90YXRlZF9wZXJpb2RzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogXCJpbmRpY2F0b3JzXCJ9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoISB0aGlzLnN0YXRlLm1vZGVscy5yZXN1bHRzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHRyZWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8UmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17dHJlZX1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtjYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMuc3RhdGUuaTE4bn0vPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoPEFwcC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJlc3VsdHMtZnJhbWV3b3JrJykpO1xufSk7IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWVudHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcImNvbW1lbnRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGNvbW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2NvbW1lbnQuY29tbWVudH0ga2V5PXtjb21tZW50LmlkfT5cbiAgICAgICAgICAgICAgICA8ZGl2PkJ5OiB7Y29tbWVudC51c2VyX2RldGFpbHMuZmlyc3RfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG59XG5cbkNvbW1lbnRzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IFBlcmlvZHMgZnJvbSAnLi9QZXJpb2RzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvcikge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMucHJvcHMuaTE4bi5zdHJpbmdzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJJbmRpY2F0b3I6IFwiICsgdGl0bGV9IGtleT17aW5kaWNhdG9yLmlkfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzdHJpbmdzLmJhc2VsaW5lX3llYXJ9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c3RyaW5ncy5iYXNlbGluZV92YWx1ZX06IHtpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG59XG5cbkluZGljYXRvcnMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAoISBpdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1BhbmVsfSBmcm9tIFwicmMtY29sbGFwc2VcIjtcbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9MZXZlbC5qc3hcIjtcbmltcG9ydCB7VXBkYXRlcywgTmV3VXBkYXRlRm9ybX0gZnJvbSBcIi4vVXBkYXRlcy5qc3hcIjtcbmltcG9ydCB7ZGlzcGxheURhdGUsIEFQSUNhbGwsIGVuZHBvaW50c30gZnJvbSBcIi4vdXRpbHMuanNcIjtcblxuXG5jbGFzcyBQZXJpb2RMb2NrVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmxvY2tUb2dnbGUgPSB0aGlzLmxvY2tUb2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtsb2NraW5nOiBmYWxzZX07XG4gICAgfVxuXG4gICAgYmFzZVBlcmlvZFNhdmUocGVyaW9kSWQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIEJhc2UgZnVuY3Rpb24gZm9yIHNhdmluZyBhIHBlcmlvZCB3aXRoIGEgZGF0YSBPYmplY3QuXG4gICAgICAgIGNvbnN0IHVybCA9IGVuZHBvaW50cy5wZXJpb2QocGVyaW9kSWQpO1xuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwicGVyaW9kc1wiLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2ssIGlmIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5QZXJpb2RMb2NrVG9nZ2xlLnByb3BUeXBlcyA9IHtcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5jb25zdCBwZXJpb2RBY3R1YWxWYWx1ZSA9IChwZXJpb2QpID0+IHtcbiAgICByZXR1cm4gcGVyaW9kLnVwZGF0ZXMgJiYgcGVyaW9kLnVwZGF0ZXMubGVuZ3RoID4gMCA/XG4gICAgICAgIHBlcmlvZC51cGRhdGVzW3BlcmlvZC51cGRhdGVzLmxlbmd0aC0xXS5hY3R1YWxfdmFsdWVcbiAgICA6XG4gICAgICAgIFwiXCI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJpb2RzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJwZXJpb2RzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHBlcmlvZCkge1xuICAgICAgICBjb25zdCBtb250aHMgPSB0aGlzLnByb3BzLmkxOG4ubW9udGhzO1xuICAgICAgICBjb25zdCBwZXJpb2RTdGFydCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQsIG1vbnRocyk7XG4gICAgICAgIGNvbnN0IHBlcmlvZEVuZCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kLCBtb250aHMpO1xuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gYCR7cGVyaW9kU3RhcnR9IC0gJHtwZXJpb2RFbmR9YDtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdmFsdWU6IHtwZXJpb2RBY3R1YWxWYWx1ZShwZXJpb2QpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e3BlcmlvZC5pZH0+XG4gICAgICAgICAgICAgICAgPE5ld1VwZGF0ZUZvcm1cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q9e3BlcmlvZH0vPlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17dGhpcy5wcm9wcy5pMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3BlcmlvZC51cGRhdGVzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3VwZGF0ZXMnKTtcbiAgICB9XG59XG5cblBlcmlvZHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnXG5pbXBvcnQgSW5kaWNhdG9ycyBmcm9tICcuL0luZGljYXRvcnMuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInJlc3VsdHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9IGtleT17cmVzdWx0LmlkfT5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cmVzdWx0LmluZGljYXRvcnN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn0vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuUmVzdWx0cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcbmltcG9ydCBDb21tZW50cyBmcm9tICcuL0NvbW1lbnRzLmpzeCdcblxuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHMsIGRpc3BsYXlEYXRlLCBkaXNwbGF5TnVtYmVyfSBmcm9tICcuL3V0aWxzLmpzJztcblxuXG5jb25zdCBVcGRhdGVEaXNwbGF5ID0gKHtpMThuLCB1cGRhdGV9KSA9PiB7XG4gICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgKyBcIiBcIiArIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICBXaGVuOiB7ZGlzcGxheURhdGUodXBkYXRlLmNyZWF0ZWRfYXQsIGkxOG4ubW9udGhzKX0gfFxuICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgT3JnOiB7dXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWV9IHxcbiAgICAgICAgICAgIFN0YXR1czoge3VwZGF0ZS5zdGF0dXN9IDxici8+XG4gICAgICAgICAgICBVcGRhdGUgdmFsdWU6IHt1cGRhdGUuZGF0YX0gfCB7LypcbiAgICAgICAgIE5PVEU6IHdlIHVzZSB1cGRhdGUuYWN0dWFsX3ZhbHVlLCBhIHZhbHVlIGNhbGN1bGF0ZWQgaW4gQXBwLmFubm90YXRlVXBkYXRlcygpLFxuICAgICAgICAgbm90IHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgICAgICovfVxuICAgICAgICAgICAgQWN0dWFsIHRvdGFsIGZvciB0aGlzIHBlcmlvZCAoaW5jbHVkaW5nIHRoaXMgdXBkYXRlKToge3VwZGF0ZS5hY3R1YWxfdmFsdWV9XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZURpc3BsYXkucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuZm9ybVRvZ2dsZSA9IHRoaXMuZm9ybVRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2Zvcm1PcGVuOiBmYWxzZX07XG4gICAgfVxuXG4gICAgZm9ybVRvZ2dsZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Zm9ybU9wZW46ICF0aGlzLnN0YXRlLmZvcm1PcGVufSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuZm9ybVRvZ2dsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5pMThuLnN0cmluZ3MuZWRpdF91cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mb3JtT3BlbiA/XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXt0aGlzLnByb3BzLmkxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU9e3RoaXMuZm9ybVRvZ2dsZX0vPlxuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZURpc3BsYXkgaTE4bj17dGhpcy5wcm9wcy5pMThufSB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfS8+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cblVwZGF0ZS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJ1cGRhdGVzXCJ9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdjb21tZW50cycpO1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHVwZGF0ZSkge1xuICAgICAgICBjb25zdCBvcmdhbmlzYXRpb24gPSB1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZTtcbiAgICAgICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgK1wiIFwiKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHVwZGF0ZS5kYXRhO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBkYXRhOiAke2RhdGF9YDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlclRleHR9IGtleT17dXBkYXRlLmlkfT5cbiAgICAgICAgICAgICAgICA8VXBkYXRlIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2Q9e3RoaXMucHJvcHMucGVyaW9kfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVzLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbn07XG5cblxuY29uc3QgSGVhZGVyID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIEhlYWRlclxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVJbnB1dCA9ICh7aTE4biwgZm9ybURhdGEsIHVwZGF0ZWRBY3R1YWxWYWx1ZSwgc2V0VXBkYXRlRGF0YX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYWN0dWFsVmFsdWVcIj57aTE4bi5hZGRfdG9fYWN0dWFsX3ZhbHVlfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZGF0YVwiXG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VXBkYXRlRGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4uaW5wdXRfcGxhY2Vob2xkZXJ9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwQWN0dWFsVmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2kxOG4udG90YWxfdmFsdWVfYWZ0ZXJfdXBkYXRlfTpcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLWRhdGFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt1cGRhdGVkQWN0dWFsVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlSW5wdXQucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVkQWN0dWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2V0VXBkYXRlRGF0YTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZURlc2NyaXB0aW9uID0gKHtpMThuLCBmb3JtRGF0YSwgc2V0VXBkYXRlRGF0YX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtOSB1cGRhdGUtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImRlc2NyaXB0aW9uXCI+e2kxOG4uYWN0dWFsX3ZhbHVlX2NvbW1lbnR9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VXBkYXRlRGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuLmNvbW1lbnRfcGxhY2Vob2xkZXJ9PlxuICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlRGVzY3JpcHRpb24ucHJvcFR5cGVzID0ge1xuICAgIGkxOG46IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7aTE4biwgY2FsbGJhY2tzLCBuZXdVcGRhdGV9KSA9PiB7XG4gICAgaTE4biA9IGkxOG4uc3RyaW5ncztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVBY3Rpb25cIj5cbiAgICAgICAgeyFuZXdVcGRhdGUgP1xuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwicmVtb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmRlbGV0ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLmRlbGV0ZX08L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgOiAnJ31cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYtcGlsbHMgYm90dG9tUm93IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiY2FuY2VsVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5mb3JtVG9nZ2xlfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e2kxOG4uY2FuY2VsfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntpMThuLnNhdmV9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57aTE4bi5hcHByb3ZlfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZUZvcm1CdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY2xhc3MgVXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMucHJvcHMudXBkYXRlO1xuICAgICAgICBpZiAodXBkYXRlKSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgc3RhdGUgZnJvbSBleGlzdGluZyB1cGRhdGUsIE5PVEU6IFwibmV3XCIgZGVub3RlcyBpZiB0aGlzIGlzIGEgbmV3IHVwZGF0ZSBvciBub3RcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7bmV3OiBmYWxzZSwgdGV4dDogdXBkYXRlLnRleHQsIGRhdGE6IHVwZGF0ZS5kYXRhLCBwZXJpb2Q6IHVwZGF0ZS5wZXJpb2R9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtuZXc6IHRydWUsIHRleHQ6IFwiXCIsIGRhdGE6IDAsIHBlcmlvZDogdGhpcy5wcm9wcy5wZXJpb2QuaWR9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZVVwZGF0ZSA9IHRoaXMuc2F2ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlbGV0ZVVwZGF0ZSA9IHRoaXMuZGVsZXRlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc2V0VXBkYXRlRGF0YShlKSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCB3aWRnZXRzXG4gICAgICAgIGNvbnN0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1tmaWVsZF06IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgfVxuXG4gICAgc2F2ZVVwZGF0ZSgpIHtcbiAgICAgICAgLy9OT1RFOiBwZXJpb2RfYWN0dWFsX3ZhbHVlIGlzIG5lZWRlZCBmb3Igc2VydmVyIHNpZGUgY2FsY3VsYXRpb25zIHRvIGJlIGNvcnJlY3RcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgJ3BlcmlvZCc6IHRoaXMuc3RhdGUucGVyaW9kLFxuICAgICAgICAgICAgJ3BlcmlvZF9hY3R1YWxfdmFsdWUnOiB0aGlzLnByZXZpb3VzQWN0dWFsVmFsdWUoKSxcbiAgICAgICAgICAgICd1c2VyJzogMSxcbiAgICAgICAgICAgICd0ZXh0JzogdGhpcy5zdGF0ZS50ZXh0LnRyaW0oKSxcbiAgICAgICAgICAgICdkYXRhJzogdGhpcy5zdGF0ZS5kYXRhLnRyaW0oKVxuICAgICAgICB9O1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJ1cGRhdGVzXCIsIGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5uZXcpIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BPU1QnLCBlbmRwb2ludHMudXBkYXRlc19hbmRfY29tbWVudHMoKSwgdXBkYXRlLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCBlbmRwb2ludHMudXBkYXRlX2FuZF9jb21tZW50cyh0aGlzLnByb3BzLnVwZGF0ZS5pZCksXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZVVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtpZDogdGhpcy5wcm9wcy51cGRhdGUuaWR9O1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInVwZGF0ZXNcIiwgZGF0YSwgdHJ1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgQVBJQ2FsbCgnREVMRVRFJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHMoZGF0YS5pZCksIG51bGwsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNBY3R1YWxWYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudXBkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy51cGRhdGUuYWN0dWFsX3ZhbHVlIC0gdGhpcy5wcm9wcy51cGRhdGUuZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlcyA9IHRoaXMucHJvcHMucGVyaW9kLnVwZGF0ZXM7XG4gICAgICAgICAgICBpZiAodXBkYXRlcyAmJiB1cGRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3QgPSB1cGRhdGVzW3VwZGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhdGVzdC5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaTE4biA9IHRoaXMucHJvcHMuaTE4bi5zdHJpbmdzO1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHBhcnNlRmxvYXQodGhpcy5zdGF0ZS5kYXRhID8gdGhpcy5zdGF0ZS5kYXRhIDogMCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRBY3R1YWxWYWx1ZSA9IGRpc3BsYXlOdW1iZXIodGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCkgKyB1cGRhdGVWYWx1ZSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyIGVkaXQtaW4tcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPEhlYWRlci8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZUlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VXBkYXRlRGF0YT17dGhpcy5zZXRVcGRhdGVEYXRhLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YT17dGhpcy5zdGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZT17dXBkYXRlZEFjdHVhbFZhbHVlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZURlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VXBkYXRlRGF0YT17dGhpcy5zZXRVcGRhdGVEYXRhLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YT17dGhpcy5zdGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QXR0YWNobWVudHMvPlxuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybUJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1VwZGF0ZT17dGhpcy5zdGF0ZS5uZXd9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVRvZ2dsZTogdGhpcy5wcm9wcy5mb3JtVG9nZ2xlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVVwZGF0ZTogdGhpcy5kZWxldGVVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVGb3JtLnByb3BUeXBlcyA9IHtcbiAgICBpMThuOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmZvcm1Ub2dnbGUgPSB0aGlzLmZvcm1Ub2dnbGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtmb3JtT3BlbjogZmFsc2V9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGZvcm07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1PcGVuKSB7XG4gICAgICAgICAgICAvL1RPRE86IGNhbiBmb3JtVG9nZ2xlIGJlIG1lcmdlZCBpbnRvIGNhbGxiYWNrcz9cbiAgICAgICAgICAgIGZvcm0gPSA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgIGkxOG49e3RoaXMucHJvcHMuaTE4bn1cbiAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgIHBlcmlvZD17dGhpcy5wcm9wcy5wZXJpb2R9XG4gICAgICAgICAgICAgICAgZm9ybVRvZ2dsZT17dGhpcy5mb3JtVG9nZ2xlfS8+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtcGx1cycgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmkxOG4uc3RyaW5ncy5uZXdfdXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2Zvcm19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgaTE4bjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcsIGkxOG5Nb250aHMpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gaTE4bk1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwNClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG59XG5cblxuLy8gT2JqZWN0IGhvbGRzIGNhbGxiYWNrIFVSTCBmdW5jdGlvbnMgYXMgdmFsdWVzLCBtb3N0IG9mIHRoZW0gY2FsbGVkIHdpdGggYW4gaWQgcGFyYW1ldGVyXG4vLyBVc2FnZTogZW5kcG9pbnRzLnJlc3VsdCgxNykgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgICAgICBcInJlc3VsdFwiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJyZXN1bHRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiaW5kaWNhdG9yc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwidXBkYXRlc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImNvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOdW1iZXIobnVtYmVyU3RyaW5nKSB7XG4gICAgLy8gQWRkIGNvbW1hcyB0byBudW1iZXJzIG9mIDEwMDAgb3IgaGlnaGVyLlxuICAgIGlmIChudW1iZXJTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBudW1iZXJTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgdmFyIGZsb2F0ID0gcGFyc2VGbG9hdChudW1iZXJTdHJpbmcpO1xuICAgICAgICBpZiAoIWlzTmFOKGZsb2F0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsb2F0LnRvTG9jYWxlU3RyaW5nKGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bWJlclN0cmluZztcbn0iXX0=
