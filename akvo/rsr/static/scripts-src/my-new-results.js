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
        var userID = JSON.parse(document.getElementById('endpoint-data').innerHTML).userID;
        var projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);
        _this.state = {
            models: {
                results: undefined,
                indicators: undefined,
                periods: undefined,
                updates: undefined,
                comments: undefined,
                user: undefined
            },
            resultsDataTree: [],
            project: { id: projectIds.project_id }
        };
        var success = function success(data) {
            // maintain compatibility with existing updates JSON
            data.approved_organisations = [data.organisation];
            this.setState({ models: (0, _immutabilityHelper2.default)(this.state.models, { $merge: { user: data } }) });
        };
        // Get info on the current user. Used when posting data, e.g. updates
        // TODO: This might not be the best place to load user data
        (0, _utils.APICall)('GET', _utils.endpoints.user(userID), '', success.bind(_this));
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
            var newState = void 0;
            var id = data.id;
            newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $merge: _defineProperty({}, id, data) }));
            this.setState({ models: newState }, function () {
                this.setState({ resultsDataTree: this.assembleDataTree() });
            });
        }
    }, {
        key: 'deleteFromModel',
        value: function deleteFromModel(model, id) {
            /*
            Update a model instance. Uses the indexed model objects and the immutability-helper update
             function (https://facebook.github.io/react/docs/update.html)
             */
            var newState = void 0;
            // Since we shouldn't edit the state object directly we have to make a (shallow) copy
            // and delete from the copy. TODO: think hard if this can lead to trouble...
            var newModel = Object.assign({}, this.state.models[model]);
            delete newModel[id];
            newState = (0, _immutabilityHelper2.default)(this.state.models, _defineProperty({}, model, { $set: newModel }));
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
        key: 'currentUser',
        value: function currentUser() {
            //TODO: if loading of user data fails we have a problem...
            return this.state.models.user;
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
                updateModel: this.updateModel.bind(this),
                deleteFromModel: this.deleteFromModel.bind(this),
                currentUser: this.currentUser.bind(this)
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
                    callbacks: callbacks });
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

},{"./Results.jsx":6,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CommentsBase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level2 = require('./Level.jsx');

var _Level3 = _interopRequireDefault(_Level2);

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

var CommentsBase = exports.CommentsBase = function (_Level) {
    _inherits(CommentsBase, _Level);

    function CommentsBase(props) {
        _classCallCheck(this, CommentsBase);

        var _this = _possibleConstructorReturn(this, (CommentsBase.__proto__ || Object.getPrototypeOf(CommentsBase)).call(this, props));

        _this.state = { model: "comments" };
        return _this;
    }

    _createClass(CommentsBase, [{
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
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Level3.default, _extends({ renderPanel: this.renderPanel.bind(this) }, this.props));
        }
    }]);

    return CommentsBase;
}(_Level3.default);

CommentsBase.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object
};

exports.default = (0, _utils.levelToggle)(CommentsBase);

},{"./Level.jsx":4,"./utils.js":9,"rc-collapse":"rc-collapse","react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IndicatorsBase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level = require('./Level.jsx');

var _Level2 = _interopRequireDefault(_Level);

var _Periods = require('./Periods.jsx');

var _Periods2 = _interopRequireDefault(_Periods);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var IndicatorsBase = exports.IndicatorsBase = function (_React$Component) {
    _inherits(IndicatorsBase, _React$Component);

    function IndicatorsBase(props) {
        _classCallCheck(this, IndicatorsBase);

        var _this = _possibleConstructorReturn(this, (IndicatorsBase.__proto__ || Object.getPrototypeOf(IndicatorsBase)).call(this, props));

        _this.state = { model: "indicators" };
        return _this;
    }

    _createClass(IndicatorsBase, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('periods');
        }
    }, {
        key: 'renderPanel',
        value: function renderPanel(indicator) {
            var title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
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
                        (0, _utils._)('baseline_year'),
                        ': ',
                        indicator.baseline_year
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'baseline-value' },
                        (0, _utils._)('baseline_value'),
                        ': ',
                        indicator.baseline_value
                    )
                ),
                _react2.default.createElement(_Periods2.default, {
                    items: indicator.periods,
                    callbacks: this.props.callbacks })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Level2.default, _extends({ renderPanel: this.renderPanel.bind(this) }, this.props));
        }
    }]);

    return IndicatorsBase;
}(_react2.default.Component);

IndicatorsBase.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

exports.default = (0, _utils.levelToggle)(IndicatorsBase);

},{"./Level.jsx":4,"./Periods.jsx":5,"./utils":9,"rc-collapse":"rc-collapse","react":"react"}],4:[function(require,module,exports){
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
                    { activeKey: this.props.activeKey, onChange: this.props.onChange },
                    items.map(function (item) {
                        return _this2.props.renderPanel(item);
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


Level.propTypes = {
    items: _react.PropTypes.array,
    renderPanel: _react.PropTypes.func.isRequired,
    callbacks: _react.PropTypes.object,
    activeKey: _react.PropTypes.array,
    onChange: _react.PropTypes.func
};

},{"rc-collapse":"rc-collapse","react":"react"}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PeriodsBase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require("rc-collapse");

var _immutabilityHelper = require("immutability-helper");

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _Level = require("./Level.jsx");

var _Level2 = _interopRequireDefault(_Level);

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

var PeriodsBase = exports.PeriodsBase = function (_React$Component2) {
    _inherits(PeriodsBase, _React$Component2);

    function PeriodsBase(props) {
        _classCallCheck(this, PeriodsBase);

        var _this2 = _possibleConstructorReturn(this, (PeriodsBase.__proto__ || Object.getPrototypeOf(PeriodsBase)).call(this, props));

        _this2.state = {
            model: "periods",
            newKeys: [] // Keep track of keys for new updates, used to open the UpdateForm
        };
        _this2.openNewForm = _this2.openNewForm.bind(_this2);
        return _this2;
    }

    _createClass(PeriodsBase, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.props.callbacks.loadModel('updates');
        }
    }, {
        key: "openNewForm",
        value: function openNewForm(newKey, data) {
            // Add the key for a new update to the list of open panels
            this.setState({ newKeys: (0, _immutabilityHelper2.default)(this.state.newKeys, { $push: [newKey] }) },
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel('updates', data));
        }
    }, {
        key: "renderPanel",
        value: function renderPanel(period) {
            var periodStart = (0, _utils.displayDate)(period.period_start);
            var periodEnd = (0, _utils.displayDate)(period.period_end);
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
            var updateCallbacks = (0, _immutabilityHelper2.default)(this.props.callbacks, { $merge: { onChange: this.onChange } });
            var buttonCallbacks = (0, _immutabilityHelper2.default)(this.props.callbacks, { $merge: { openNewForm: this.openNewForm } });
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: header, key: period.id },
                _react2.default.createElement(_Updates.Updates, {
                    items: period.updates,
                    callbacks: updateCallbacks,
                    newKeys: this.state.newKeys }),
                _react2.default.createElement(_Updates.NewUpdateButton, {
                    callbacks: buttonCallbacks,
                    period: period })
            );
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Level2.default, _extends({ renderPanel: this.renderPanel.bind(this) }, this.props));
        }
    }]);

    return PeriodsBase;
}(_react2.default.Component);

PeriodsBase.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

exports.default = (0, _utils.levelToggle)(PeriodsBase);

},{"./Level.jsx":4,"./Updates.jsx":7,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level = require('./Level.jsx');

var _Level2 = _interopRequireDefault(_Level);

var _Indicators = require('./Indicators.jsx');

var _Indicators2 = _interopRequireDefault(_Indicators);

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

var ResultsBase = function (_React$Component) {
    _inherits(ResultsBase, _React$Component);

    function ResultsBase(props) {
        _classCallCheck(this, ResultsBase);

        var _this = _possibleConstructorReturn(this, (ResultsBase.__proto__ || Object.getPrototypeOf(ResultsBase)).call(this, props));

        _this.state = { model: "results" };
        return _this;
    }

    _createClass(ResultsBase, [{
        key: 'renderPanel',
        value: function renderPanel(result) {
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: "Result: " + result.title, key: result.id },
                _react2.default.createElement(_Indicators2.default, {
                    items: result.indicators,
                    callbacks: this.props.callbacks })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Level2.default, _extends({ renderPanel: this.renderPanel.bind(this) }, this.props));
        }
    }]);

    return ResultsBase;
}(_react2.default.Component);

ResultsBase.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired,
    activeKey: _react.PropTypes.array,
    onChange: _react.PropTypes.func
};

exports.default = (0, _utils.levelToggle)(ResultsBase);

},{"./Indicators.jsx":3,"./Level.jsx":4,"./utils.js":9,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewUpdateButton = exports.Updates = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _Level = require('./Level.jsx');

var _Level2 = _interopRequireDefault(_Level);

var _Comments = require('./Comments.jsx');

var _Comments2 = _interopRequireDefault(_Comments);

var _utils = require('./utils.js');

var _const = require('./const.js');

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
    var update = _ref.update;

    var userName = update.user_details.first_name + " " + update.user_details.last_name;
    return _react2.default.createElement(
        'div',
        null,
        'When: ',
        (0, _utils.displayDate)(update.created_at),
        ' | By: ',
        userName,
        ' | Org: ',
        update.user_details.approved_organisations[0].name,
        ' | Status: ',
        (0, _utils._)('update_statuses')[update.status],
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
    update: _react.PropTypes.object.isRequired
};

var Update = function (_React$Component) {
    _inherits(Update, _React$Component);

    function Update(props) {
        _classCallCheck(this, Update);

        var _this = _possibleConstructorReturn(this, (Update.__proto__ || Object.getPrototypeOf(Update)).call(this, props));

        _this.formToggle = _this.formToggle.bind(_this);
        _this.state = { formOpen: (0, _utils.isNewUpdate)(props.update) };
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
                        (0, _utils._)('edit_update')
                    )
                ),
                this.state.formOpen ? _react2.default.createElement(UpdateForm, {
                    callbacks: this.props.callbacks,
                    update: this.props.update,
                    formToggle: this.formToggle }) : _react2.default.createElement(UpdateDisplay, { update: this.props.update })
            );
        }
    }]);

    return Update;
}(_react2.default.Component);

Update.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    update: _react.PropTypes.object.isRequired
};

var UpdatesBase = function (_React$Component2) {
    _inherits(UpdatesBase, _React$Component2);

    function UpdatesBase(props) {
        _classCallCheck(this, UpdatesBase);

        var _this2 = _possibleConstructorReturn(this, (UpdatesBase.__proto__ || Object.getPrototypeOf(UpdatesBase)).call(this, props));

        _this2.state = { model: "updates" };
        return _this2;
    }

    _createClass(UpdatesBase, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('comments');
        }
    }, {
        key: 'renderPanel',
        value: function renderPanel(update) {
            var organisation = update.user_details.approved_organisations[0].name;
            var userName = update.user_details.first_name + " " + update.user_details.last_name;
            var headerText = 'Update: ' + userName + ' at ' + organisation + ', Data: ' + update.data + '\n                            Status: ' + (0, _utils._)('update_statuses')[update.status];
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: headerText, key: update.id },
                _react2.default.createElement(Update, {
                    update: update,
                    callbacks: this.props.callbacks }),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Comments2.default, {
                        items: update.comments,
                        callbacks: this.props.callbacks })
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            // Combine activeKey with state.newKeys to create a new activeKey
            // Note that the order of the props in the call to Level is important as the local activeKey
            // overwrites props.activeKey
            var activeKey = (0, _immutabilityHelper2.default)(this.props.activeKey, { $push: this.props.newKeys });
            return _react2.default.createElement(_Level2.default, _extends({}, this.props, {
                renderPanel: this.renderPanel.bind(this),
                activeKey: activeKey }));
        }
    }]);

    return UpdatesBase;
}(_react2.default.Component);

UpdatesBase.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.array
};

var Updates = exports.Updates = (0, _utils.levelToggle)(UpdatesBase);

var Header = function Header(_ref2) {
    var update = _ref2.update;

    return _react2.default.createElement(
        'div',
        { className: 'col-xs-12' },
        _react2.default.createElement(
            'div',
            { className: 'row update-entry-container-header' },
            'Status: ',
            (0, _utils._)('update_statuses')[update.status]
        )
    );
};

var ActualValueInput = function ActualValueInput(_ref3) {
    var update = _ref3.update,
        updatedActualValue = _ref3.updatedActualValue,
        onChange = _ref3.onChange;

    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-xs-6' },
            _react2.default.createElement(
                'label',
                { htmlFor: 'actualValue' },
                (0, _utils._)('add_to_actual_value')
            ),
            _react2.default.createElement('input', { className: 'form-control',
                id: 'data',
                value: update.data,
                onChange: onChange,
                placeholder: (0, _utils._)('input_placeholder') })
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
                        (0, _utils._)('total_value_after_update'),
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
    update: _react.PropTypes.object,
    updatedActualValue: _react.PropTypes.string,
    onChange: _react.PropTypes.func.isRequired
};

var ActualValueDescription = function ActualValueDescription(_ref4) {
    var update = _ref4.update,
        onChange = _ref4.onChange;

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
                    (0, _utils._)('actual_value_comment')
                ),
                _react2.default.createElement('textarea', { className: 'form-control',
                    id: 'text',
                    value: update.text,
                    onChange: onChange,
                    placeholder: (0, _utils._)('comment_placeholder') })
            )
        )
    );
};

ActualValueDescription.propTypes = {
    update: _react.PropTypes.object,
    onChange: _react.PropTypes.func.isRequired
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

var UpdateFormButtons = function UpdateFormButtons(_ref5) {
    var update = _ref5.update,
        callbacks = _ref5.callbacks;

    return _react2.default.createElement(
        'div',
        { className: 'menuAction' },
        !(0, _utils.isNewUpdate)(update) ? _react2.default.createElement(
            'div',
            { role: 'presentation', className: 'removeUpdate' },
            _react2.default.createElement(
                'a',
                { onClick: callbacks.deleteUpdate, className: 'btn btn-default btn-xs' },
                (0, _utils._)('delete')
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
                    { onClick: callbacks.onCancel, className: 'btn btn-link btn-xs' },
                    (0, _utils._)('cancel')
                )
            ),
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: 'saveUpdate' },
                _react2.default.createElement(
                    'a',
                    { id: 'save', onClick: callbacks.saveUpdate, className: 'btn btn-default btn-xs' },
                    (0, _utils._)('save')
                )
            ),
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: 'approveUpdate' },
                _react2.default.createElement(
                    'a',
                    { id: 'approve', onClick: callbacks.saveUpdate, className: 'btn btn-default btn-xs' },
                    (0, _utils._)('approve')
                )
            ),
            _react2.default.createElement('span', null)
        )
    );
};

UpdateFormButtons.propTypes = {
    callbacks: _react.PropTypes.object.isRequired
};

var pruneForPATCH = function pruneForPATCH(update) {
    // Only include the listed fields when PATCHing an update
    // currently the list mimics the old MyResults data
    var fields = ['data', 'text', 'relative_data', 'status'];
    return fields.reduce(function (acc, f) {
        return Object.assign(acc, _defineProperty({}, f, update[f]));
    }, {});
};

var pruneForPOST = function pruneForPOST(update) {
    // Only include the listed fields when POSTing an update
    var updateForPOST = Object.assign({}, update);
    delete updateForPOST['user_details'];
    return updateForPOST;
};

var UpdateForm = function (_React$Component3) {
    _inherits(UpdateForm, _React$Component3);

    function UpdateForm(props) {
        _classCallCheck(this, UpdateForm);

        // Save original update
        var _this3 = _possibleConstructorReturn(this, (UpdateForm.__proto__ || Object.getPrototypeOf(UpdateForm)).call(this, props));

        _this3.state = { originalUpdate: Object.assign({}, _this3.props.update) };
        _this3.saveUpdate = _this3.saveUpdate.bind(_this3);
        _this3.deleteUpdate = _this3.deleteUpdate.bind(_this3);
        _this3.onChange = _this3.onChange.bind(_this3);
        _this3.onCancel = _this3.onCancel.bind(_this3);
        return _this3;
    }

    _createClass(UpdateForm, [{
        key: 'onChange',
        value: function onChange(e) {
            // When the form field widgets change, modify the model data in App.state[model]
            var field = e.target.id;
            this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, (0, _immutabilityHelper2.default)(this.props.update, { $merge: _defineProperty({}, field, e.target.value) }));
        }
    }, {
        key: 'onCancel',
        value: function onCancel() {
            this.props.formToggle();
            var update = this.state.originalUpdate;
            if ((0, _utils.isNewUpdate)(update)) {
                this.props.callbacks.deleteFromModel(_const.OBJECTS_UPDATES, update.id);
            } else {
                this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, update);
            }
        }
    }, {
        key: 'saveUpdate',
        value: function saveUpdate(e) {
            var update = Object.assign({}, this.props.update);
            // All changes to an update revert it to draft unless it is explicitly approved while saving
            if (e.target.id == 'approve') {
                update.status = _const.STATUS_APPROVED_CODE;
            } else {
                update.status = _const.STATUS_DRAFT_CODE;
            }
            var success = function success(data) {
                this.props.formToggle();
                // Always save the instance using data coming from the backend
                // TODO: look at having a replaceModel method?
                this.props.callbacks.deleteFromModel(_const.OBJECTS_UPDATES, update.id);
                this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, data);
            };
            if ((0, _utils.isNewUpdate)(update)) {
                (0, _utils.APICall)('POST', _utils.endpoints.updates_and_comments(), pruneForPOST(update), success.bind(this));
            } else {
                (0, _utils.APICall)('PATCH', _utils.endpoints.update_and_comments(update.id), pruneForPATCH(update), success.bind(this));
            }
        }
    }, {
        key: 'deleteUpdate',
        value: function deleteUpdate() {
            var data = { id: this.props.update.id };
            var success = function success() {
                this.props.formToggle();
                this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, data, true);
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
            var updateValue = parseFloat(this.props.update.data ? this.props.update.data : 0);
            var updatedActualValue = (0, _utils.displayNumber)(this.previousActualValue() + updateValue);
            return _react2.default.createElement(
                'div',
                { className: 'update-container' },
                _react2.default.createElement(
                    'div',
                    { className: 'row update-entry-container edit-in-progress' },
                    _react2.default.createElement(Header, { update: this.props.update }),
                    _react2.default.createElement(ActualValueInput, {
                        onChange: this.onChange,
                        update: this.props.update,
                        updatedActualValue: updatedActualValue }),
                    _react2.default.createElement(ActualValueDescription, {
                        onChange: this.onChange,
                        update: this.props.update }),
                    _react2.default.createElement(Attachments, null),
                    _react2.default.createElement(UpdateFormButtons, {
                        update: this.props.update,
                        callbacks: {
                            saveUpdate: this.saveUpdate,
                            deleteUpdate: this.deleteUpdate,
                            onCancel: this.onCancel } })
                )
            );
        }
    }]);

    return UpdateForm;
}(_react2.default.Component);

UpdateForm.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    formToggle: _react.PropTypes.func.isRequired,
    update: _react.PropTypes.object.isRequired,
    period: _react.PropTypes.object
};

var newUpdateID = 1;

var NewUpdateButton = exports.NewUpdateButton = function (_React$Component4) {
    _inherits(NewUpdateButton, _React$Component4);

    function NewUpdateButton(props) {
        _classCallCheck(this, NewUpdateButton);

        var _this4 = _possibleConstructorReturn(this, (NewUpdateButton.__proto__ || Object.getPrototypeOf(NewUpdateButton)).call(this, props));

        _this4.newUpdate = _this4.newUpdate.bind(_this4);
        return _this4;
    }

    _createClass(NewUpdateButton, [{
        key: 'newUpdate',
        value: function newUpdate() {
            var user = this.props.callbacks.currentUser();
            var id = 'new-' + newUpdateID;
            var data = {
                id: id,
                period: this.props.period.id,
                user_details: user,
                user: user.id,
                data: 0,
                text: '',
                relative_data: true,
                status: _const.STATUS_DRAFT_CODE
            };
            this.props.callbacks.openNewForm(id, data);
            newUpdateID += 1;
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
                        { onClick: this.newUpdate,
                            className: 'btn btn-sm btn-default',
                            style: { margin: '0.3em 0.5em' } },
                        _react2.default.createElement('i', { className: 'fa fa-plus' }),
                        (0, _utils._)('new_update')
                    )
                )
            );
        }
    }]);

    return NewUpdateButton;
}(_react2.default.Component);

NewUpdateButton.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    period: _react.PropTypes.object
};

},{"./Comments.jsx":2,"./Level.jsx":4,"./const.js":8,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

var
// From rsr.models.indicator.IndicatorPeriodData
STATUS_NEW_CODE = exports.STATUS_NEW_CODE = 'N',
    STATUS_DRAFT_CODE = exports.STATUS_DRAFT_CODE = 'D',
    STATUS_PENDING_CODE = exports.STATUS_PENDING_CODE = 'P',
    STATUS_REVISION_CODE = exports.STATUS_REVISION_CODE = 'R',
    STATUS_APPROVED_CODE = exports.STATUS_APPROVED_CODE = 'A',
    OBJECTS_RESULTS = exports.OBJECTS_RESULTS = 'results',
    OBJECTS_INDICATORS = exports.OBJECTS_INDICATORS = 'indicators',
    OBJECTS_PERIODS = exports.OBJECTS_PERIODS = 'periods',
    OBJECTS_UPDATES = exports.OBJECTS_UPDATES = 'updates',
    OBJECTS_COMMENTS = exports.OBJECTS_COMMENTS = 'comments',
    OBJECTS_USERS = exports.OBJECTS_USERS = 'users';

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNewUpdate = exports.endpoints = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.displayDate = displayDate;
exports.getCookie = getCookie;
exports.APICall = APICall;
exports.displayNumber = displayNumber;
exports._ = _;
exports.levelToggle = levelToggle;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR is covered by the GNU Affero General Public License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   See more details in the license.txt file located at the root folder of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Akvo RSR module. For additional details on the GNU license please see
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   < http://www.gnu.org/licenses/agpl.html >.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var months = void 0;

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (!months) {
        months = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    }
    if (dateString) {
        var locale = "en-gb";
        var date = new Date(dateString.split(".")[0].replace("/", /-/g));
        var day = date.getUTCDate();
        var month = months[date.getUTCMonth()];
        var year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return "Unknown date";
}

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
        return '/rest/v1/result/' + id + '/?format=json';
    },
    "results": function results(id) {
        return '/rest/v1/result/?format=json&project=' + id;
    },
    "indicators": function indicators(id) {
        return '/rest/v1/indicator/?format=json&result__project=' + id;
    },
    "periods": function periods(id) {
        return '/rest/v1/indicator_period/?format=json&indicator__result__project=' + id;
    },
    "updates": function updates(id) {
        return '/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=' + id;
    },
    "comments": function comments(id) {
        return '/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=' + id;
    },
    "period": function period(id) {
        return '/rest/v1/indicator_period/' + id + '/?format=json';
    },
    "update_and_comments": function update_and_comments(id) {
        return '/rest/v1/indicator_period_data_framework/' + id + '/?format=json';
    },
    "updates_and_comments": function updates_and_comments() {
        return '/rest/v1/indicator_period_data_framework/?format=json';
    },
    "user": function user(id) {
        return '/rest/v1/user/' + id + '/?format=json';
    },
    "partnerships": function partnerships(id) {
        return '/rest/v1/partnership/?format=json&project=' + id;
    },
    "file_upload": function file_upload(id) {
        return '/rest/v1/indicator_period_data/' + id + '/upload_file/?format=json';
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
    return '';
}

var strings = void 0;

// Translation a la python. Let's hope we never need lodash...
function _(s) {
    if (!strings) {
        strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
    }
    return strings[s];
}

var isNewUpdate = exports.isNewUpdate = function isNewUpdate(update) {
    return update.id.toString().substr(0, 4) === 'new-';
};

function levelToggle(WrappedComponent) {

    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.state = { activeKey: [], isOpen: false };
            _this.onChange = _this.onChange.bind(_this);
            _this.toggleLevel = _this.toggleLevel.bind(_this);
            return _this;
        }

        _createClass(_class, [{
            key: 'onChange',
            value: function onChange(activeKey) {
                // Keep track of open panels
                this.setState({ activeKey: activeKey });
            }
        }, {
            key: 'toggleLevel',
            value: function toggleLevel() {
                var isOpen = this.state.isOpen;
                if (isOpen) {
                    this.setState({ activeKey: [], isOpen: !isOpen });
                } else {
                    this.setState({
                        activeKey: this.props.items.map(function (item) {
                            return item.id.toString();
                        }),
                        isOpen: !isOpen
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { onClick: this.toggleLevel,
                            className: 'btn btn-sm btn-default',
                            style: { margin: '0.3em 0.5em' } },
                        '+'
                    ),
                    React.createElement(WrappedComponent, _extends({
                        activeKey: this.state.activeKey,
                        onChange: this.onChange
                    }, this.props))
                );
            }
        }]);

        return _class;
    }(React.Component);
}

},{"isomorphic-fetch":"isomorphic-fetch"}]},{},[1,2,3,4,5,6,7,9,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9jb25zdC5qcyIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBZEE7Ozs7Ozs7QUFnQkE7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsT0FBTyxNQUFQLElBQWtCO0FBQUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLENBQXFCO0FBQUEsZUFBTyxJQUFJLEdBQUosQ0FBUDtBQUFBLEtBQXJCLENBQVA7QUFBQSxDQUFsQzs7SUFHTSxHOzs7QUFDRixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEdBQ1QsS0FEUzs7QUFFZixZQUFNLFdBQVcsS0FB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TDtBQUFBO0FBQUEscUNBeUJhO0FBQ0wsdUJBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDBCQUFHLFNBQVMsS0FBSyxXQUFqQjtBQUNJLHVDQUFXLHdCQURmO0FBRUksbUNBQU8sRUFBQyxRQUFRLGFBQVQsRUFGWDtBQUFBO0FBQUEscUJBREo7QUFNSSx3Q0FBQyxnQkFBRDtBQUNJLG1DQUFXLEtBQUssS0FBTCxDQUFXLFNBRDFCO0FBRUksa0NBQVUsS0FBSztBQUZuQix1QkFHUSxLQUFLLEtBSGI7QUFOSixpQkFESjtBQWFIO0FBdkNMOztBQUFBO0FBQUEsTUFBcUIsTUFBTSxTQUEzQjtBQXlDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vUmVzdWx0cy5qc3gnO1xuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIGNvbnN0IGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgY29uc3QgdXNlcklEID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5kcG9pbnQtZGF0YScpLmlubmVySFRNTCkudXNlcklEO1xuICAgICAgICBjb25zdCBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWxzOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwZXJpb2RzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXBkYXRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXNlcjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3Q6IHtpZDogcHJvamVjdElkcy5wcm9qZWN0X2lkfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8gbWFpbnRhaW4gY29tcGF0aWJpbGl0eSB3aXRoIGV4aXN0aW5nIHVwZGF0ZXMgSlNPTlxuICAgICAgICAgICAgZGF0YS5hcHByb3ZlZF9vcmdhbmlzYXRpb25zID0gW2RhdGEub3JnYW5pc2F0aW9uXTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsczogdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7JG1lcmdlOiB7dXNlcjogZGF0YX19KX0pO1xuICAgICAgICB9O1xuICAgICAgICAvLyBHZXQgaW5mbyBvbiB0aGUgY3VycmVudCB1c2VyLiBVc2VkIHdoZW4gcG9zdGluZyBkYXRhLCBlLmcuIHVwZGF0ZXNcbiAgICAgICAgLy8gVE9ETzogVGhpcyBtaWdodCBub3QgYmUgdGhlIGJlc3QgcGxhY2UgdG8gbG9hZCB1c2VyIGRhdGFcbiAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzLnVzZXIodXNlcklEKSwgJycsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0LmlkKSwgJycsIHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTW9kZWwobW9kZWwsIGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkZWxldGVGcm9tTW9kZWwobW9kZWwsIGlkKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbmV3U3RhdGU7XG4gICAgICAgIC8vIFNpbmNlIHdlIHNob3VsZG4ndCBlZGl0IHRoZSBzdGF0ZSBvYmplY3QgZGlyZWN0bHkgd2UgaGF2ZSB0byBtYWtlIGEgKHNoYWxsb3cpIGNvcHlcbiAgICAgICAgLy8gYW5kIGRlbGV0ZSBmcm9tIHRoZSBjb3B5LiBUT0RPOiB0aGluayBoYXJkIGlmIHRoaXMgY2FuIGxlYWQgdG8gdHJvdWJsZS4uLlxuICAgICAgICBjb25zdCBuZXdNb2RlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSk7XG4gICAgICAgIGRlbGV0ZSBuZXdNb2RlbFtpZF07XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRzZXQ6IG5ld01vZGVsfX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBDcmVhdGUgYW4gaW5kZXhlZCB2ZXJzaW9uIG9mIGEgbW9kZWwgYnkgY3JlYXRpbmcgYSBsaXN0IG9mIG9iamVjdHMsIG9uZSBmb3IgZWFjaCBtb2RlbFxuICAgICAgICBpbnN0YW5jZSB3aGVyZSB0aGUgb2JqZWN0IGtleSBpcyB0aGUgaWQgb2YgdGhlIGluc3RhbmNlIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGZ1bGwgaW5zdGFuY2UuXG4gICAgICAgIFRoaXMgY29uc3RydWN0IGlzIHVzZWQgdG8gYmUgYWJsZSB0byBlYXNpbHkgdXBkYXRlIGluZGl2aWR1YWwgaW5zdGFuY2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgZnVuY3Rpb24oYWNjLCBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IG9ialsnaWQnXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXhlZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGluZGV4ZWRPYmpbaWRdID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgaW5kZXhlZE9iailcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgfVxuXG4gICAgY3VycmVudFVzZXIoKSB7XG4gICAgICAgIC8vVE9ETzogaWYgbG9hZGluZyBvZiB1c2VyIGRhdGEgZmFpbHMgd2UgaGF2ZSBhIHByb2JsZW0uLi5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWxzLnVzZXI7XG4gICAgfVxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGFuZCBvbiBkb3duIHZpYSBcInVwZGF0ZXNcIiBhbmQgXCJjb21tZW50c1wiLlxuICAgICAgICBUaGlzIGRhdGEgc3RydWN0dXJlIGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHdob2xlIHRyZWUgb2YgY29tcG9uZW50cyBlYWNoIGxldmVsIHBhc3NpbmcgdGhlXG4gICAgICAgIGNoaWxkIGxpc3QgYXMgdGhlIHByb3AgXCJpdGVtc1wiXG4gICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGROYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBIZWxwZXIgZnVuY3Rpb24gdGhhdCBsaW5rcyB0d28gbGV2ZWxzIGluIHRoZSBkYXRhIHRyZWUuIFRoZSBsaW5raW5nIGlzIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgZm9yZWlnbiBrZXkgZmllbGQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY2hpbGQgYmVpbmcgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcGFyZW50IG9iamVjdFxuICAgICAgICAgICAgUGFyYW1zOlxuICAgICAgICAgICAgICAgIHBhcmVudHM6IGxpc3Qgb2YgcGFyZW50IG9iamVjdHMuIEVhY2ggcGFyZW50IG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyBmaWVsZCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgaG9sZHMgdGhlIGxpc3Qgb2YgYXNzb2NpYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXM6IG9iamVjdCB3aXRoIHR3byBmaWVsZHMsIFwicGFyZW50XCIgYW5kIFwiY2hpbGRyZW5cIiB0aGF0IGhvbGQgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICB0aGUgZmllbGRzIGxpbmtpbmcgdGhlIHR3byBsZXZlbHMgb2Ygb2JqZWN0cy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbGlzdCBvZiBhbGwgY2hpbGQgb2JqZWN0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMgJiYgcGFyZW50cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZE5hbWVzLmNoaWxkcmVuXSA9IGNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9PiBjaGlsZFtmaWVsZE5hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEFkZCB0aGUgZmllbGQgXCJhY3R1YWxfdmFsdWVcIiB0byBlYWNoIHBlcmlvZCB1cGRhdGUsIHdoaWNoIGlzIHRoZSBzdW0gb2YgYWxsIHVwZGF0ZVxuICAgICAgICAgICAgdmFsdWVzIHVwIHRvIHRoaXMgcG9pbnQgaW4gdGltZS4gTm90ZSB0aGF0IHRoaXMgZmllbGQgZXhpc3RzIGluIHRoZSBkYXRhc2V0IGFzXG4gICAgICAgICAgICB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBidXQgd2UgY2FuJ3QgdXNlIHRoYXQgc2luY2Ugd2Ugd2FudCB0byBiZSBhYmxlIHRvXG4gICAgICAgICAgICAocmUpLWNhbGN1bGF0ZSBvbiBkYXRhIGNoYW5nZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RzICYmIHBlcmlvZHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVyaW9kLnVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxfdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVsnYWN0dWFsX3ZhbHVlJ10gPSBwYXJzZUludCh1cGRhdGUuZGF0YSkgKyBhY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICAgICAgICAgIC8vIFR1cm4gdGhlIGluZGV4ZWQgbW9kZWwgYmFjayB0byBhIGxpc3Qgb2YgbW9kZWwgb2JqZWN0XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG9mIG1vZGVscyBmcm9tIHRoZSBsb3dlc3QgbGV2ZWwgKENvbW1lbnQpIGFuZCB1cCB0byBSZXN1bHRcbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBcImNvbW1lbnRzXCJ9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LFxuICAgICAgICAgICAgdXBkYXRlcyk7XG4gICAgICAgIGNvbnN0IGFubm90YXRlZF9wZXJpb2RzID0gYW5ub3RhdGVVcGRhdGVzKHBlcmlvZHMpO1xuXG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmluZGljYXRvcnMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJpbmRpY2F0b3JcIiwgY2hpbGRyZW46IFwicGVyaW9kc1wifSxcbiAgICAgICAgICAgIGFubm90YXRlZF9wZXJpb2RzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogXCJpbmRpY2F0b3JzXCJ9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Nb2RlbDogdGhpcy5kZWxldGVGcm9tTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLmN1cnJlbnRVc2VyLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuaW1wb3J0IHtsZXZlbFRvZ2dsZX0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50c0Jhc2UgZXh0ZW5kcyBMZXZlbCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcImNvbW1lbnRzXCJ9O1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGNvbW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2NvbW1lbnQuY29tbWVudH0ga2V5PXtjb21tZW50LmlkfT5cbiAgICAgICAgICAgICAgICA8ZGl2PkJ5OiB7Y29tbWVudC51c2VyX2RldGFpbHMuZmlyc3RfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TGV2ZWwgcmVuZGVyUGFuZWw9e3RoaXMucmVuZGVyUGFuZWwuYmluZCh0aGlzKX0gey4uLnRoaXMucHJvcHN9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkNvbW1lbnRzQmFzZS5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxldmVsVG9nZ2xlKENvbW1lbnRzQmFzZSk7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCc7XG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4JztcblxuaW1wb3J0IHtfLCBsZXZlbFRvZ2dsZX1mcm9tICcuL3V0aWxzJztcblxuXG5leHBvcnQgY2xhc3MgSW5kaWNhdG9yc0Jhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdwZXJpb2RzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoaW5kaWNhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJJbmRpY2F0b3I6IFwiICsgdGl0bGV9IGtleT17aW5kaWNhdG9yLmlkfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdiYXNlbGluZV95ZWFyJyl9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnYmFzZWxpbmVfdmFsdWUnKX06IHtpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuSW5kaWNhdG9yc0Jhc2UucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbFRvZ2dsZShJbmRpY2F0b3JzQmFzZSk7IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlIGFjdGl2ZUtleT17dGhpcy5wcm9wcy5hY3RpdmVLZXl9IG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uQ2hhbmdlfT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5wcm9wcy5yZW5kZXJQYW5lbChpdGVtKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuTGV2ZWwucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgcmVuZGVyUGFuZWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGFjdGl2ZUtleTogUHJvcFR5cGVzLmFycmF5LFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcbiIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1BhbmVsfSBmcm9tIFwicmMtY29sbGFwc2VcIjtcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSBcIi4vTGV2ZWwuanN4XCI7XG5pbXBvcnQge1VwZGF0ZXMsIE5ld1VwZGF0ZUJ1dHRvbn0gZnJvbSBcIi4vVXBkYXRlcy5qc3hcIjtcbmltcG9ydCB7ZGlzcGxheURhdGUsIEFQSUNhbGwsIGVuZHBvaW50cywgbGV2ZWxUb2dnbGV9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludHMucGVyaW9kKHBlcmlvZElkKTtcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInBlcmlvZHNcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrLCBpZiBub3QgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBBUElDYWxsKCdQQVRDSCcsIHVybCwgZGF0YSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBsb2NraW5nVG9nZ2xlKGxvY2tpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bG9ja2luZzogbG9ja2luZ30pO1xuICAgIH1cblxuICAgIG5vdExvY2tpbmcoKSB7XG4gICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZShmYWxzZSk7XG4gICAgfVxuXG4gICAgbG9ja1RvZ2dsZShlKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmJhc2VQZXJpb2RTYXZlKHRoaXMucHJvcHMucGVyaW9kLmlkLCB7bG9ja2VkOiAhdGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkfSwgdGhpcy5ub3RMb2NraW5nLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgaWNvbiwgbGFiZWw7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2FkaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5wZXJpb2QubG9ja2VkKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPXsnZmEgZmEtbG9jayd9Lz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiVW5sb2NrIHBlcmlvZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXVubG9jay1hbHRcIiAvPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJMb2NrIHBlcmlvZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmxvY2tUb2dnbGV9XG4gICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgIHN0eWxlPXt7ZmxvYXQ6ICdyaWdodCcsIG1hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgIHtpY29ufVxuICAgICAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuUGVyaW9kTG9ja1RvZ2dsZS5wcm9wVHlwZXMgPSB7XG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuY29uc3QgcGVyaW9kQWN0dWFsVmFsdWUgPSAocGVyaW9kKSA9PiB7XG4gICAgcmV0dXJuIHBlcmlvZC51cGRhdGVzICYmIHBlcmlvZC51cGRhdGVzLmxlbmd0aCA+IDAgP1xuICAgICAgICBwZXJpb2QudXBkYXRlc1twZXJpb2QudXBkYXRlcy5sZW5ndGgtMV0uYWN0dWFsX3ZhbHVlXG4gICAgOlxuICAgICAgICBcIlwiO1xufTtcblxuZXhwb3J0IGNsYXNzIFBlcmlvZHNCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbDogXCJwZXJpb2RzXCIsXG4gICAgICAgICAgICBuZXdLZXlzOiBbXSAvLyBLZWVwIHRyYWNrIG9mIGtleXMgZm9yIG5ldyB1cGRhdGVzLCB1c2VkIHRvIG9wZW4gdGhlIFVwZGF0ZUZvcm1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcGVuTmV3Rm9ybSA9IHRoaXMub3Blbk5ld0Zvcm0uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cblxuICAgIG9wZW5OZXdGb3JtKG5ld0tleSwgZGF0YSkge1xuICAgICAgICAvLyBBZGQgdGhlIGtleSBmb3IgYSBuZXcgdXBkYXRlIHRvIHRoZSBsaXN0IG9mIG9wZW4gcGFuZWxzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bmV3S2V5czogdXBkYXRlKHRoaXMuc3RhdGUubmV3S2V5cywgeyRwdXNoOiBbbmV3S2V5XX0pfSxcbiAgICAgICAgICAgIC8vIE9ubHkgd2hlbiB0aGUgYWN0aXZlS2V5IHN0YXRlIGlzIGNvbW1pdHRlZCBkbyB3ZSB1cGRhdGUgdGhlIHVwZGF0ZXMgbW9kZWxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKCd1cGRhdGVzJywgZGF0YSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChwZXJpb2QpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kU3RhcnQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0KTtcbiAgICAgICAgY29uc3QgcGVyaW9kRW5kID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9lbmQpO1xuICAgICAgICBjb25zdCBwZXJpb2REYXRlID0gYCR7cGVyaW9kU3RhcnR9IC0gJHtwZXJpb2RFbmR9YDtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gKFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgICAgICBBY3R1YWwgdmFsdWU6IHtwZXJpb2RBY3R1YWxWYWx1ZShwZXJpb2QpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICApO1xuICAgICAgICBjb25zdCB1cGRhdGVDYWxsYmFja3MgPSB1cGRhdGUodGhpcy5wcm9wcy5jYWxsYmFja3MsIHskbWVyZ2U6IHtvbkNoYW5nZTogdGhpcy5vbkNoYW5nZX19KTtcbiAgICAgICAgY29uc3QgYnV0dG9uQ2FsbGJhY2tzID0gdXBkYXRlKHRoaXMucHJvcHMuY2FsbGJhY2tzLCB7JG1lcmdlOiB7b3Blbk5ld0Zvcm06IHRoaXMub3Blbk5ld0Zvcm19fSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJ9IGtleT17cGVyaW9kLmlkfT5cbiAgICAgICAgICAgICAgICA8VXBkYXRlc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17cGVyaW9kLnVwZGF0ZXN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dXBkYXRlQ2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBuZXdLZXlzPXt0aGlzLnN0YXRlLm5ld0tleXN9Lz5cbiAgICAgICAgICAgICAgICA8TmV3VXBkYXRlQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17YnV0dG9uQ2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICBwZXJpb2Q9e3BlcmlvZH0vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUGVyaW9kc0Jhc2UucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbFRvZ2dsZShQZXJpb2RzQmFzZSk7IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnO1xuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCc7XG5cbmltcG9ydCB7bGV2ZWxUb2dnbGV9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5cbmNsYXNzIFJlc3VsdHNCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtyZXN1bHQuaWR9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVzdWx0c0Jhc2UucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgYWN0aXZlS2V5OiBQcm9wVHlwZXMuYXJyYXksXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbFRvZ2dsZShSZXN1bHRzQmFzZSk7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IExldmVsIGZyb20gXCIuL0xldmVsLmpzeFwiO1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4JztcblxuaW1wb3J0IHtcbiAgICBBUElDYWxsLCBlbmRwb2ludHMsIGRpc3BsYXlEYXRlLCBkaXNwbGF5TnVtYmVyLCBfLCBjdXJyZW50VXNlciwgaXNOZXdVcGRhdGUsIGxldmVsVG9nZ2xlXG59IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtTVEFUVVNfRFJBRlRfQ09ERSwgU1RBVFVTX0FQUFJPVkVEX0NPREUsIE9CSkVDVFNfVVBEQVRFU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0KX0gfFxuICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgT3JnOiB7dXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWV9IHxcbiAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuZm9ybVRvZ2dsZSA9IHRoaXMuZm9ybVRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2Zvcm1PcGVuOiBpc05ld1VwZGF0ZShwcm9wcy51cGRhdGUpfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdlZGl0X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGVzQmFzZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBcInVwZGF0ZXNcIn1cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgnY29tbWVudHMnKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbCh1cGRhdGUpIHtcbiAgICAgICAgY29uc3Qgb3JnYW5pc2F0aW9uID0gdXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWU7XG4gICAgICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBgVXBkYXRlOiAke3VzZXJOYW1lfSBhdCAke29yZ2FuaXNhdGlvbn0sIERhdGE6ICR7dXBkYXRlLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfWA7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtoZWFkZXJUZXh0fSBrZXk9e3VwZGF0ZS5pZH0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3VwZGF0ZS5jb21tZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIENvbWJpbmUgYWN0aXZlS2V5IHdpdGggc3RhdGUubmV3S2V5cyB0byBjcmVhdGUgYSBuZXcgYWN0aXZlS2V5XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIHByb3BzIGluIHRoZSBjYWxsIHRvIExldmVsIGlzIGltcG9ydGFudCBhcyB0aGUgbG9jYWwgYWN0aXZlS2V5XG4gICAgICAgIC8vIG92ZXJ3cml0ZXMgcHJvcHMuYWN0aXZlS2V5XG4gICAgICAgIGNvbnN0IGFjdGl2ZUtleSA9IHVwZGF0ZSh0aGlzLnByb3BzLmFjdGl2ZUtleSwgeyRwdXNoOiB0aGlzLnByb3BzLm5ld0tleXN9KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbFxuICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgICAgICAgIHJlbmRlclBhbmVsPXt0aGlzLnJlbmRlclBhbmVsLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgYWN0aXZlS2V5PXthY3RpdmVLZXl9Lz5cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cblxuVXBkYXRlc0Jhc2UucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG59O1xuXG5leHBvcnQgY29uc3QgVXBkYXRlcyA9IGxldmVsVG9nZ2xlKFVwZGF0ZXNCYXNlKTtcblxuY29uc3QgSGVhZGVyID0gKHt1cGRhdGV9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgU3RhdHVzOiB7XygndXBkYXRlX3N0YXR1c2VzJylbdXBkYXRlLnN0YXR1c119XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZUlucHV0ID0gKHt1cGRhdGUsIHVwZGF0ZWRBY3R1YWxWYWx1ZSwgb25DaGFuZ2V9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFjdHVhbFZhbHVlXCI+e18oJ2FkZF90b19hY3R1YWxfdmFsdWUnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICBpZD1cImRhdGFcIlxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dXBkYXRlLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e18oJ2lucHV0X3BsYWNlaG9sZGVyJyl9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwQWN0dWFsVmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge18oJ3RvdGFsX3ZhbHVlX2FmdGVyX3VwZGF0ZScpfTpcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLWRhdGFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt1cGRhdGVkQWN0dWFsVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlSW5wdXQucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICB1cGRhdGVkQWN0dWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVEZXNjcmlwdGlvbiA9ICh7dXBkYXRlLCBvbkNoYW5nZX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtOSB1cGRhdGUtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImRlc2NyaXB0aW9uXCI+e18oJ2FjdHVhbF92YWx1ZV9jb21tZW50Jyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3VwZGF0ZS50ZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e18oJ2NvbW1lbnRfcGxhY2Vob2xkZXInKX0+XG4gICAgICAgICAgICAgICAgICAgIDwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuQWN0dWFsVmFsdWVEZXNjcmlwdGlvbi5wcm9wVHlwZXMgPSB7XG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEF0dGFjaG1lbnRzID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImltYWdlVXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY2FtZXJhXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BZGQgaW1hZ2U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmlsZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtcGFwZXJjbGlwXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BdHRhY2ggZmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IFVwZGF0ZUZvcm1CdXR0b25zID0gKHt1cGRhdGUsIGNhbGxiYWNrc30pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVBY3Rpb25cIj5cbiAgICAgICAgeyFpc05ld1VwZGF0ZSh1cGRhdGUpID9cbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cInJlbW92ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5kZWxldGVVcGRhdGV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57XygnZGVsZXRlJyl9PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDogJyd9XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2LXBpbGxzIGJvdHRvbVJvdyBuYXZiYXItcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cImNhbmNlbFVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3Mub25DYW5jZWx9IGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBidG4teHNcIj57XygnY2FuY2VsJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJzYXZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGlkPVwic2F2ZVwiIG9uQ2xpY2s9e2NhbGxiYWNrcy5zYXZlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ3NhdmUnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cImFwcHJvdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJhcHByb3ZlXCIgb25DbGljaz17Y2FsbGJhY2tzLnNhdmVVcGRhdGV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57XygnYXBwcm92ZScpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZUZvcm1CdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBwcnVuZUZvclBBVENIID0gKHVwZGF0ZSkgPT4ge1xuICAgIC8vIE9ubHkgaW5jbHVkZSB0aGUgbGlzdGVkIGZpZWxkcyB3aGVuIFBBVENIaW5nIGFuIHVwZGF0ZVxuICAgIC8vIGN1cnJlbnRseSB0aGUgbGlzdCBtaW1pY3MgdGhlIG9sZCBNeVJlc3VsdHMgZGF0YVxuICAgIGNvbnN0IGZpZWxkcyA9IFsnZGF0YScsICd0ZXh0JywgJ3JlbGF0aXZlX2RhdGEnLCAnc3RhdHVzJ107XG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGFjYywgZikgPT4ge3JldHVybiBPYmplY3QuYXNzaWduKGFjYywge1tmXTogdXBkYXRlW2ZdfSl9LCB7fSk7XG59O1xuXG5jb25zdCBwcnVuZUZvclBPU1QgPSAodXBkYXRlKSA9PiB7XG4gICAgLy8gT25seSBpbmNsdWRlIHRoZSBsaXN0ZWQgZmllbGRzIHdoZW4gUE9TVGluZyBhbiB1cGRhdGVcbiAgICBsZXQgdXBkYXRlRm9yUE9TVCA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZSk7XG4gICAgZGVsZXRlIHVwZGF0ZUZvclBPU1RbJ3VzZXJfZGV0YWlscyddO1xuICAgIHJldHVybiB1cGRhdGVGb3JQT1NUO1xufTtcblxuY2xhc3MgVXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgdXBkYXRlXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7b3JpZ2luYWxVcGRhdGU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudXBkYXRlKX07XG4gICAgICAgIHRoaXMuc2F2ZVVwZGF0ZSA9IHRoaXMuc2F2ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlbGV0ZVVwZGF0ZSA9IHRoaXMuZGVsZXRlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25DYW5jZWwgPSB0aGlzLm9uQ2FuY2VsLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoZSkge1xuICAgICAgICAvLyBXaGVuIHRoZSBmb3JtIGZpZWxkIHdpZGdldHMgY2hhbmdlLCBtb2RpZnkgdGhlIG1vZGVsIGRhdGEgaW4gQXBwLnN0YXRlW21vZGVsXVxuICAgICAgICBjb25zdCBmaWVsZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcbiAgICAgICAgICAgIE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlKHRoaXMucHJvcHMudXBkYXRlLCB7JG1lcmdlOiB7W2ZpZWxkXTogZS50YXJnZXQudmFsdWV9fSkpO1xuICAgIH1cblxuICAgIG9uQ2FuY2VsKCkge1xuICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0gdGhpcy5zdGF0ZS5vcmlnaW5hbFVwZGF0ZTtcbiAgICAgICAgaWYgKGlzTmV3VXBkYXRlKHVwZGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmRlbGV0ZUZyb21Nb2RlbChPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZS5pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlVXBkYXRlKGUpIHtcbiAgICAgICAgbGV0IHVwZGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudXBkYXRlKTtcbiAgICAgICAgLy8gQWxsIGNoYW5nZXMgdG8gYW4gdXBkYXRlIHJldmVydCBpdCB0byBkcmFmdCB1bmxlc3MgaXQgaXMgZXhwbGljaXRseSBhcHByb3ZlZCB3aGlsZSBzYXZpbmdcbiAgICAgICAgaWYgKGUudGFyZ2V0LmlkID09ICdhcHByb3ZlJykge1xuICAgICAgICAgICAgdXBkYXRlLnN0YXR1cyA9IFNUQVRVU19BUFBST1ZFRF9DT0RFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlLnN0YXR1cyA9IFNUQVRVU19EUkFGVF9DT0RFO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgICAgICAvLyBBbHdheXMgc2F2ZSB0aGUgaW5zdGFuY2UgdXNpbmcgZGF0YSBjb21pbmcgZnJvbSB0aGUgYmFja2VuZFxuICAgICAgICAgICAgLy8gVE9ETzogbG9vayBhdCBoYXZpbmcgYSByZXBsYWNlTW9kZWwgbWV0aG9kP1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MuZGVsZXRlRnJvbU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlLmlkKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChpc05ld1VwZGF0ZSh1cGRhdGUpKSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQT1NUJywgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzKCksXG4gICAgICAgICAgICAgICAgICAgIHBydW5lRm9yUE9TVCh1cGRhdGUpLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCBlbmRwb2ludHMudXBkYXRlX2FuZF9jb21tZW50cyh1cGRhdGUuaWQpLFxuICAgICAgICAgICAgICAgICAgICBwcnVuZUZvclBBVENIKHVwZGF0ZSksIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7aWQ6IHRoaXMucHJvcHMudXBkYXRlLmlkfTtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCBkYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBBUElDYWxsKCdERUxFVEUnLCBlbmRwb2ludHMudXBkYXRlX2FuZF9jb21tZW50cyhkYXRhLmlkKSwgbnVsbCwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcmV2aW91c0FjdHVhbFZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy51cGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwZGF0ZS5hY3R1YWxfdmFsdWUgLSB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlcyA9IHRoaXMucHJvcHMucGVyaW9kLnVwZGF0ZXM7XG4gICAgICAgICAgICBpZiAodXBkYXRlcyAmJiB1cGRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3QgPSB1cGRhdGVzW3VwZGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhdGVzdC5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMucHJvcHMudXBkYXRlLmRhdGEgPyB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhIDogMCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRBY3R1YWxWYWx1ZSA9IGRpc3BsYXlOdW1iZXIodGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCkgKyB1cGRhdGVWYWx1ZSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyIGVkaXQtaW4tcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPEhlYWRlciB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZUlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQWN0dWFsVmFsdWU9e3VwZGF0ZWRBY3R1YWxWYWx1ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBdHRhY2htZW50cy8+XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtQnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVVcGRhdGU6IHRoaXMuc2F2ZVVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVVcGRhdGU6IHRoaXMuZGVsZXRlVXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsOiB0aGlzLm9uQ2FuY2VsfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cblVwZGF0ZUZvcm0ucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGZvcm1Ub2dnbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5sZXQgbmV3VXBkYXRlSUQgPSAxO1xuXG5leHBvcnQgY2xhc3MgTmV3VXBkYXRlQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLm5ld1VwZGF0ZSA9IHRoaXMubmV3VXBkYXRlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgbmV3VXBkYXRlKCkge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5wcm9wcy5jYWxsYmFja3MuY3VycmVudFVzZXIoKTtcbiAgICAgICAgY29uc3QgaWQgPSBgbmV3LSR7bmV3VXBkYXRlSUR9YDtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIHBlcmlvZDogdGhpcy5wcm9wcy5wZXJpb2QuaWQsXG4gICAgICAgICAgICB1c2VyX2RldGFpbHM6IHVzZXIsXG4gICAgICAgICAgICB1c2VyOiB1c2VyLmlkLFxuICAgICAgICAgICAgZGF0YTogMCxcbiAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgcmVsYXRpdmVfZGF0YTogdHJ1ZSxcbiAgICAgICAgICAgIHN0YXR1czogU1RBVFVTX0RSQUZUX0NPREVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3Mub3Blbk5ld0Zvcm0oaWQsIGRhdGEpO1xuICAgICAgICBuZXdVcGRhdGVJRCArPSAxO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5uZXdVcGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPSdmYSBmYS1wbHVzJyAvPlxuICAgICAgICAgICAgICAgICAgICAgICAge18oJ25ld191cGRhdGUnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbk5ld1VwZGF0ZUJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcGVyaW9kOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5leHBvcnQgY29uc3RcbiAgICAvLyBGcm9tIHJzci5tb2RlbHMuaW5kaWNhdG9yLkluZGljYXRvclBlcmlvZERhdGFcbiAgICBTVEFUVVNfTkVXX0NPREUgPSAnTicsXG4gICAgU1RBVFVTX0RSQUZUX0NPREUgPSAnRCcsXG4gICAgU1RBVFVTX1BFTkRJTkdfQ09ERSA9ICdQJyxcbiAgICBTVEFUVVNfUkVWSVNJT05fQ09ERSA9ICdSJyxcbiAgICBTVEFUVVNfQVBQUk9WRURfQ09ERSA9ICdBJyxcblxuXG4gICAgT0JKRUNUU19SRVNVTFRTID0gJ3Jlc3VsdHMnLFxuICAgIE9CSkVDVFNfSU5ESUNBVE9SUyA9ICdpbmRpY2F0b3JzJyxcbiAgICBPQkpFQ1RTX1BFUklPRFMgPSAncGVyaW9kcycsXG4gICAgT0JKRUNUU19VUERBVEVTID0gJ3VwZGF0ZXMnLFxuICAgIE9CSkVDVFNfQ09NTUVOVFMgPSAnY29tbWVudHMnLFxuICAgIE9CSkVDVFNfVVNFUlMgPSAndXNlcnMnO1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcblxuXG5sZXQgbW9udGhzO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZVN0cmluZykge1xuICAgIC8vIERpc3BsYXkgYSBkYXRlU3RyaW5nIGxpa2UgXCIyNSBKYW4gMjAxNlwiXG4gICAgaWYgKCFtb250aHMpIHtcbiAgICAgICAgbW9udGhzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaTE4bk1vbnRocycpLmlubmVySFRNTCk7XG4gICAgfVxuICAgIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcuc3BsaXQoXCIuXCIpWzBdLnJlcGxhY2UoXCIvXCIsIC8tL2cpKTtcbiAgICAgICAgY29uc3QgZGF5ID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0VVRDTW9udGgoKV07XG4gICAgICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgICAgIHJldHVybiBkYXkgKyBcIiBcIiArIG1vbnRoICsgXCIgXCIgKyB5ZWFyO1xuICAgIH1cbiAgICByZXR1cm4gXCJVbmtub3duIGRhdGVcIjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBjb29raWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT0gKG5hbWUgKyAnPScpKSB7XG4gICAgICAgICAgICAgICAgY29va2llVmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQoY29va2llLnN1YnN0cmluZyhuYW1lLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29va2llVmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBUElDYWxsKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaywgcmV0cmllcykge1xuICAgIGZ1bmN0aW9uIG1vZGlmeShtZXRob2QsIHVybCwgZGF0YSl7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZSgnY3NyZnRva2VuJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcjtcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICBjYXNlIFwiR0VUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQT1NUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQT1NUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQVVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BVVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUEFUQ0hcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BBVENIJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJERUxFVEVcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaGFuZGxlcigpXG4gICAgICAgIC8vVE9ETzogZXJyb3IgaGFuZGxpbmc/IFNlZSBodHRwczovL3d3dy50anZhbnRvbGwuY29tLzIwMTUvMDkvMTMvZmV0Y2gtYW5kLWVycm9ycy9cbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjA0KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbn1cblxuXG4vLyBPYmplY3QgaG9sZHMgY2FsbGJhY2sgVVJMIGZ1bmN0aW9ucyBhcyB2YWx1ZXMsIG1vc3Qgb2YgdGhlbSBjYWxsZWQgd2l0aCBhbiBpZCBwYXJhbWV0ZXJcbi8vIFVzYWdlOiBlbmRwb2ludHMucmVzdWx0KDE3KSAtPiBcImh0dHA6Ly9yc3IuYWt2by5vcmcvcmVzdC92MS9yZXN1bHQvMTcvP2Zvcm1hdD1qc29uXCJcbmV4cG9ydCBjb25zdCBlbmRwb2ludHMgPSB7XG4gICAgICAgIFwicmVzdWx0XCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInJlc3VsdHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0Lz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJpbmRpY2F0b3JzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvci8/Zm9ybWF0PWpzb24mcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvP2Zvcm1hdD1qc29uJmluZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJ1cGRhdGVzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8/Zm9ybWF0PWpzb24mcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2NvbW1lbnQvP2Zvcm1hdD1qc29uJmRhdGFfX3BlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXBkYXRlX2FuZF9jb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXBkYXRlc19hbmRfY29tbWVudHNcIjogKCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1c2VyXCI6IChpZCkgPT4gYC9yZXN0L3YxL3VzZXIvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJwYXJ0bmVyc2hpcHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcGFydG5lcnNoaXAvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImZpbGVfdXBsb2FkXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YS8ke2lkfS91cGxvYWRfZmlsZS8/Zm9ybWF0PWpzb25gXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheU51bWJlcihudW1iZXJTdHJpbmcpIHtcbiAgICAvLyBBZGQgY29tbWFzIHRvIG51bWJlcnMgb2YgMTAwMCBvciBoaWdoZXIuXG4gICAgaWYgKG51bWJlclN0cmluZyAhPT0gdW5kZWZpbmVkICYmIG51bWJlclN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gXCJlbi1nYlwiO1xuICAgICAgICB2YXIgZmxvYXQgPSBwYXJzZUZsb2F0KG51bWJlclN0cmluZyk7XG4gICAgICAgIGlmICghaXNOYU4oZmxvYXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmxvYXQudG9Mb2NhbGVTdHJpbmcobG9jYWxlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5cbmxldCBzdHJpbmdzO1xuXG4vLyBUcmFuc2xhdGlvbiBhIGxhIHB5dGhvbi4gTGV0J3MgaG9wZSB3ZSBuZXZlciBuZWVkIGxvZGFzaC4uLlxuZXhwb3J0IGZ1bmN0aW9uIF8ocykge1xuICAgIGlmICghc3RyaW5ncykge1xuICAgICAgICBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nc1tzXTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzTmV3VXBkYXRlID0gKHVwZGF0ZSkgPT4ge3JldHVybiB1cGRhdGUuaWQudG9TdHJpbmcoKS5zdWJzdHIoMCwgNCkgPT09ICduZXctJ307XG5cbmV4cG9ydCBmdW5jdGlvbiBsZXZlbFRvZ2dsZShXcmFwcGVkQ29tcG9uZW50KSB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHthY3RpdmVLZXk6IFtdLCBpc09wZW46IGZhbHNlfTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUxldmVsID0gdGhpcy50b2dnbGVMZXZlbC5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25DaGFuZ2UoYWN0aXZlS2V5KSB7XG4gICAgICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIG9wZW4gcGFuZWxzXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUxldmVsKCkge1xuICAgICAgICAgICAgY29uc3QgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW47XG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5OiBbXSwgaXNPcGVuOiAhaXNPcGVufSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVLZXk6IHRoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiBpdGVtLmlkLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBpc09wZW46ICFpc09wZW5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy50b2dnbGVMZXZlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICtcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8V3JhcHBlZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5PXt0aGlzLnN0YXRlLmFjdGl2ZUtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
