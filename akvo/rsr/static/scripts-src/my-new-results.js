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
            this.loadModel(_const.OBJECTS_RESULTS);
            this.loadModel(_const.OBJECTS_INDICATORS);
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
            var updates = filterChildren(deIndex(models.updates), { parent: "data", children: _const.OBJECTS_COMMENTS }, deIndex(models.comments));

            var periods = filterChildren(deIndex(models.periods), { parent: "period", children: _const.OBJECTS_UPDATES }, updates);
            var annotated_periods = annotateUpdates(periods);

            var indicators = filterChildren(deIndex(models.indicators), { parent: "indicator", children: _const.OBJECTS_PERIODS }, annotated_periods);

            var results = filterChildren(deIndex(models.results), { parent: "result", children: _const.OBJECTS_INDICATORS }, indicators);
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

},{"./Results.jsx":6,"./const.js":8,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
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

var _const = require('./const.js');

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

        _this.state = { model: _const.OBJECTS_COMMENTS };
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

},{"./Level.jsx":4,"./const.js":8,"./utils.js":9,"rc-collapse":"rc-collapse","react":"react"}],3:[function(require,module,exports){
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

var _const = require('./const.js');

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

        _this.state = { model: _const.OBJECTS_INDICATORS };
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

},{"./Level.jsx":4,"./Periods.jsx":5,"./const.js":8,"./utils":9,"rc-collapse":"rc-collapse","react":"react"}],4:[function(require,module,exports){
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

var _const = require("./const.js");

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
                this.props.callbacks.updateModel(_const.OBJECTS_PERIODS, data);

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
            model: _const.OBJECTS_PERIODS,
            newKeys: [] // Keep track of keys for new updates, used to open the UpdateForm
        };
        _this2.openNewForm = _this2.openNewForm.bind(_this2);
        return _this2;
    }

    _createClass(PeriodsBase, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.props.callbacks.loadModel(_const.OBJECTS_UPDATES);
        }
    }, {
        key: "openNewForm",
        value: function openNewForm(newKey, data) {
            // Add the key for a new update to the list of open panels
            this.setState({ newKeys: (0, _immutabilityHelper2.default)(this.state.newKeys, { $push: [newKey] }) },
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, data));
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

},{"./Level.jsx":4,"./Updates.jsx":7,"./const.js":8,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
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

var _const = require('./const.js');

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

        _this.state = { model: _const.OBJECTS_RESULTS };
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

},{"./Indicators.jsx":3,"./Level.jsx":4,"./const.js":8,"./utils.js":9,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
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

        _this2.state = { model: _const.OBJECTS_UPDATES };
        return _this2;
    }

    _createClass(UpdatesBase, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel(_const.OBJECTS_COMMENTS);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9jb25zdC5qcyIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7K2VBaEJBOzs7Ozs7O0FBb0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxX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V0FBakI7QUFDSSx1Q0FBVyx3QkFEZjtBQUVJLG1DQUFPLEVBQUMsUUFBUSxhQUFULEVBRlg7QUFBQTtBQUFBLHFCQURKO0FBTUksd0NBQUMsZ0JBQUQ7QUFDSSxtQ0FBVyxLQUFLLEtBQUwsQ0FBVyxTQUQxQjtBQUVJLGtDQUFVLEtBQUs7QUFGbkIsdUJBR1EsS0FBSyxLQUhiO0FBTkosaUJBREo7QUFhSDtBQXZDTDs7QUFBQTtBQUFBLE1BQXFCLE1BQU0sU0FBM0I7QUF5Q0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMuanN4JztcblxuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgICBPQkpFQ1RTX1JFU1VMVFMsIE9CSkVDVFNfSU5ESUNBVE9SUywgT0JKRUNUU19QRVJJT0RTLCBPQkpFQ1RTX1VQREFURVMsIE9CSkVDVFNfQ09NTUVOVFNcbn0gZnJvbSAnLi9jb25zdC5qcyc7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCB1c2VySUQgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKS51c2VySUQ7XG4gICAgICAgIGNvbnN0IHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHRzRGF0YVRyZWU6IFtdLFxuICAgICAgICAgICAgcHJvamVjdDoge2lkOiBwcm9qZWN0SWRzLnByb2plY3RfaWR9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgdXBkYXRlcyBKU09OXG4gICAgICAgICAgICBkYXRhLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnMgPSBbZGF0YS5vcmdhbmlzYXRpb25dO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWxzOiB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHskbWVyZ2U6IHt1c2VyOiBkYXRhfX0pfSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEdldCBpbmZvIG9uIHRoZSBjdXJyZW50IHVzZXIuIFVzZWQgd2hlbiBwb3N0aW5nIGRhdGEsIGUuZy4gdXBkYXRlc1xuICAgICAgICAvLyBUT0RPOiBUaGlzIG1pZ2h0IG5vdCBiZSB0aGUgYmVzdCBwbGFjZSB0byBsb2FkIHVzZXIgZGF0YVxuICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludHMudXNlcih1c2VySUQpLCAnJywgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbChPQkpFQ1RTX1JFU1VMVFMpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbChPQkpFQ1RTX0lORElDQVRPUlMpO1xuICAgIH1cblxuICAgIGxvYWRNb2RlbChtb2RlbCkge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJLiBBZnRlciBsb2FkaW5nIHJlYnVpbGQgdGhlIGRhdGEgdHJlZS5cbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgICAgICAgICAge21vZGVsczogdXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXTogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfX1cbiAgICAgICAgICAgICAgICAgICAgKX0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzW21vZGVsXSh0aGlzLnN0YXRlLnByb2plY3QuaWQpLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG5ld1N0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRlbGV0ZUZyb21Nb2RlbChtb2RlbCwgaWQpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgLy8gU2luY2Ugd2Ugc2hvdWxkbid0IGVkaXQgdGhlIHN0YXRlIG9iamVjdCBkaXJlY3RseSB3ZSBoYXZlIHRvIG1ha2UgYSAoc2hhbGxvdykgY29weVxuICAgICAgICAvLyBhbmQgZGVsZXRlIGZyb20gdGhlIGNvcHkuIFRPRE86IHRoaW5rIGhhcmQgaWYgdGhpcyBjYW4gbGVhZCB0byB0cm91YmxlLi4uXG4gICAgICAgIGNvbnN0IG5ld01vZGVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKTtcbiAgICAgICAgZGVsZXRlIG5ld01vZGVsW2lkXTtcbiAgICAgICAgbmV3U3RhdGUgPSB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHtbbW9kZWxdOiB7JHNldDogbmV3TW9kZWx9fSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjdXJyZW50VXNlcigpIHtcbiAgICAgICAgLy9UT0RPOiBpZiBsb2FkaW5nIG9mIHVzZXIgZGF0YSBmYWlscyB3ZSBoYXZlIGEgcHJvYmxlbS4uLlxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbHMudXNlcjtcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgLy8gVHVybiB0aGUgaW5kZXhlZCBtb2RlbCBiYWNrIHRvIGEgbGlzdCBvZiBtb2RlbCBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIHRyZWUgb2YgbW9kZWxzIGZyb20gdGhlIGxvd2VzdCBsZXZlbCAoQ29tbWVudCkgYW5kIHVwIHRvIFJlc3VsdFxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IE9CSkVDVFNfQ09NTUVOVFN9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogT0JKRUNUU19VUERBVEVTfSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0ZWRfcGVyaW9kcyA9IGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBPQkpFQ1RTX1BFUklPRFN9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBPQkpFQ1RTX0lORElDQVRPUlN9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Nb2RlbDogdGhpcy5kZWxldGVGcm9tTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLmN1cnJlbnRVc2VyLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuaW1wb3J0IHtsZXZlbFRvZ2dsZX0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge09CSkVDVFNfQ09NTUVOVFN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5leHBvcnQgY2xhc3MgQ29tbWVudHNCYXNlIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogT0JKRUNUU19DT01NRU5UU307XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2NvbW1lbnQuaWR9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuQ29tbWVudHNCYXNlLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbGV2ZWxUb2dnbGUoQ29tbWVudHNCYXNlKTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4JztcbmltcG9ydCBQZXJpb2RzIGZyb20gJy4vUGVyaW9kcy5qc3gnO1xuXG5pbXBvcnQge18sIGxldmVsVG9nZ2xlfWZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtPQkpFQ1RTX0lORElDQVRPUlN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5cblxuZXhwb3J0IGNsYXNzIEluZGljYXRvcnNCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IE9CSkVDVFNfSU5ESUNBVE9SU307XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ3BlcmlvZHMnKTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChpbmRpY2F0b3IpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBpbmRpY2F0b3IudGl0bGUubGVuZ3RoID4gMCA/IGluZGljYXRvci50aXRsZSA6IFwiTmFtZWxlc3MgaW5kaWNhdG9yXCI7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtcIkluZGljYXRvcjogXCIgKyB0aXRsZX0ga2V5PXtpbmRpY2F0b3IuaWR9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge18oJ2Jhc2VsaW5lX3llYXInKX06IHtpbmRpY2F0b3IuYmFzZWxpbmVfeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdiYXNlbGluZV92YWx1ZScpfToge2luZGljYXRvci5iYXNlbGluZV92YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPFBlcmlvZHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e2luZGljYXRvci5wZXJpb2RzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPExldmVsIHJlbmRlclBhbmVsPXt0aGlzLnJlbmRlclBhbmVsLmJpbmQodGhpcyl9IHsuLi50aGlzLnByb3BzfS8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5JbmRpY2F0b3JzQmFzZS5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxldmVsVG9nZ2xlKEluZGljYXRvcnNCYXNlKTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29sbGFwc2UsIHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgdGhpcy5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9kZWJ1Z0lEICsgXCIgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2UgYWN0aXZlS2V5PXt0aGlzLnByb3BzLmFjdGl2ZUtleX0gb25DaGFuZ2U9e3RoaXMucHJvcHMub25DaGFuZ2V9PlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiB0aGlzLnByb3BzLnJlbmRlclBhbmVsKGl0ZW0pKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5MZXZlbC5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICByZW5kZXJQYW5lbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgYWN0aXZlS2V5OiBQcm9wVHlwZXMuYXJyYXksXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5cbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9MZXZlbC5qc3hcIjtcbmltcG9ydCB7VXBkYXRlcywgTmV3VXBkYXRlQnV0dG9ufSBmcm9tIFwiLi9VcGRhdGVzLmpzeFwiO1xuXG5pbXBvcnQge2Rpc3BsYXlEYXRlLCBBUElDYWxsLCBlbmRwb2ludHMsIGxldmVsVG9nZ2xlfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHtPQkpFQ1RTX1BFUklPRFMsIE9CSkVDVFNfVVBEQVRFU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludHMucGVyaW9kKHBlcmlvZElkKTtcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1BFUklPRFMsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmV4cG9ydCBjbGFzcyBQZXJpb2RzQmFzZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWw6IE9CSkVDVFNfUEVSSU9EUyxcbiAgICAgICAgICAgIG5ld0tleXM6IFtdIC8vIEtlZXAgdHJhY2sgb2Yga2V5cyBmb3IgbmV3IHVwZGF0ZXMsIHVzZWQgdG8gb3BlbiB0aGUgVXBkYXRlRm9ybVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wZW5OZXdGb3JtID0gdGhpcy5vcGVuTmV3Rm9ybS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKE9CSkVDVFNfVVBEQVRFUyk7XG4gICAgfVxuXG4gICAgb3Blbk5ld0Zvcm0obmV3S2V5LCBkYXRhKSB7XG4gICAgICAgIC8vIEFkZCB0aGUga2V5IGZvciBhIG5ldyB1cGRhdGUgdG8gdGhlIGxpc3Qgb2Ygb3BlbiBwYW5lbHNcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHtuZXdLZXlzOiB1cGRhdGUodGhpcy5zdGF0ZS5uZXdLZXlzLCB7JHB1c2g6IFtuZXdLZXldfSl9LFxuICAgICAgICAgICAgLy8gT25seSB3aGVuIHRoZSBhY3RpdmVLZXkgc3RhdGUgaXMgY29tbWl0dGVkIGRvIHdlIHVwZGF0ZSB0aGUgdXBkYXRlcyBtb2RlbFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCBkYXRhKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKHBlcmlvZCkge1xuICAgICAgICBjb25zdCBwZXJpb2RTdGFydCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQpO1xuICAgICAgICBjb25zdCBwZXJpb2RFbmQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCk7XG4gICAgICAgIGNvbnN0IHBlcmlvZERhdGUgPSBgJHtwZXJpb2RTdGFydH0gLSAke3BlcmlvZEVuZH1gO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgUGVyaW9kOiB7cGVyaW9kRGF0ZX0gfFxuICAgICAgICAgICAgICAgICAgICBUYXJnZXQgdmFsdWU6IHtwZXJpb2QudGFyZ2V0X3ZhbHVlfSB8XG4gICAgICAgICAgICAgICAgICAgIEFjdHVhbCB2YWx1ZToge3BlcmlvZEFjdHVhbFZhbHVlKHBlcmlvZCl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZUNhbGxiYWNrcyA9IHVwZGF0ZSh0aGlzLnByb3BzLmNhbGxiYWNrcywgeyRtZXJnZToge29uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlfX0pO1xuICAgICAgICBjb25zdCBidXR0b25DYWxsYmFja3MgPSB1cGRhdGUodGhpcy5wcm9wcy5jYWxsYmFja3MsIHskbWVyZ2U6IHtvcGVuTmV3Rm9ybTogdGhpcy5vcGVuTmV3Rm9ybX19KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2hlYWRlcn0ga2V5PXtwZXJpb2QuaWR9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt1cGRhdGVDYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIG5ld0tleXM9e3RoaXMuc3RhdGUubmV3S2V5c30vPlxuICAgICAgICAgICAgICAgIDxOZXdVcGRhdGVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtidXR0b25DYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPExldmVsIHJlbmRlclBhbmVsPXt0aGlzLnJlbmRlclBhbmVsLmJpbmQodGhpcyl9IHsuLi50aGlzLnByb3BzfS8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5QZXJpb2RzQmFzZS5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxldmVsVG9nZ2xlKFBlcmlvZHNCYXNlKTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCc7XG5pbXBvcnQgSW5kaWNhdG9ycyBmcm9tICcuL0luZGljYXRvcnMuanN4JztcblxuaW1wb3J0IHtsZXZlbFRvZ2dsZX0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge09CSkVDVFNfUkVTVUxUU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY2xhc3MgUmVzdWx0c0Jhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogT0JKRUNUU19SRVNVTFRTfTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtyZXN1bHQuaWR9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfSB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVzdWx0c0Jhc2UucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgYWN0aXZlS2V5OiBQcm9wVHlwZXMuYXJyYXksXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbFRvZ2dsZShSZXN1bHRzQmFzZSk7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IExldmVsIGZyb20gXCIuL0xldmVsLmpzeFwiO1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4JztcblxuaW1wb3J0IHtcbiAgICBBUElDYWxsLCBlbmRwb2ludHMsIGRpc3BsYXlEYXRlLCBkaXNwbGF5TnVtYmVyLCBfLCBjdXJyZW50VXNlciwgaXNOZXdVcGRhdGUsIGxldmVsVG9nZ2xlXG59IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtTVEFUVVNfRFJBRlRfQ09ERSwgU1RBVFVTX0FQUFJPVkVEX0NPREUsIE9CSkVDVFNfVVBEQVRFUywgT0JKRUNUU19DT01NRU5UU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0KX0gfFxuICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgT3JnOiB7dXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWV9IHxcbiAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuZm9ybVRvZ2dsZSA9IHRoaXMuZm9ybVRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2Zvcm1PcGVuOiBpc05ld1VwZGF0ZShwcm9wcy51cGRhdGUpfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdlZGl0X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGVzQmFzZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBPQkpFQ1RTX1VQREFURVN9XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoT0JKRUNUU19DT01NRU5UUyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBEYXRhOiAke3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtfKCd1cGRhdGVfc3RhdHVzZXMnKVt1cGRhdGUuc3RhdHVzXX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXt1cGRhdGUuaWR9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBDb21iaW5lIGFjdGl2ZUtleSB3aXRoIHN0YXRlLm5ld0tleXMgdG8gY3JlYXRlIGEgbmV3IGFjdGl2ZUtleVxuICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBwcm9wcyBpbiB0aGUgY2FsbCB0byBMZXZlbCBpcyBpbXBvcnRhbnQgYXMgdGhlIGxvY2FsIGFjdGl2ZUtleVxuICAgICAgICAvLyBvdmVyd3JpdGVzIHByb3BzLmFjdGl2ZUtleVxuICAgICAgICBjb25zdCBhY3RpdmVLZXkgPSB1cGRhdGUodGhpcy5wcm9wcy5hY3RpdmVLZXksIHskcHVzaDogdGhpcy5wcm9wcy5uZXdLZXlzfSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TGV2ZWxcbiAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgIGFjdGl2ZUtleT17YWN0aXZlS2V5fS8+XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cblVwZGF0ZXNCYXNlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxufTtcblxuZXhwb3J0IGNvbnN0IFVwZGF0ZXMgPSBsZXZlbFRvZ2dsZShVcGRhdGVzQmFzZSk7XG5cbmNvbnN0IEhlYWRlciA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVJbnB1dCA9ICh7dXBkYXRlLCB1cGRhdGVkQWN0dWFsVmFsdWUsIG9uQ2hhbmdlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhY3R1YWxWYWx1ZVwiPntfKCdhZGRfdG9fYWN0dWFsX3ZhbHVlJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJkYXRhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdpbnB1dF9wbGFjZWhvbGRlcicpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cEFjdHVhbFZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtfKCd0b3RhbF92YWx1ZV9hZnRlcl91cGRhdGUnKX06XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dXBkYXRlZEFjdHVhbFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlZEFjdHVhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlRGVzY3JpcHRpb24gPSAoe3VwZGF0ZSwgb25DaGFuZ2V9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTkgdXBkYXRlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPntfKCdhY3R1YWxfdmFsdWVfY29tbWVudCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1cGRhdGUudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdjb21tZW50X3BsYWNlaG9sZGVyJyl9PlxuICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlRGVzY3JpcHRpb24ucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7dXBkYXRlLCBjYWxsYmFja3N9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51QWN0aW9uXCI+XG4gICAgICAgIHshaXNOZXdVcGRhdGUodXBkYXRlKSA/XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJyZW1vdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3MuZGVsZXRlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2RlbGV0ZScpfTwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA6ICcnfVxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdi1waWxscyBib3R0b21Sb3cgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJjYW5jZWxVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLm9uQ2FuY2VsfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e18oJ2NhbmNlbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNhdmVcIiBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdzYXZlJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGlkPVwiYXBwcm92ZVwiIG9uQ2xpY2s9e2NhbGxiYWNrcy5zYXZlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2FwcHJvdmUnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVGb3JtQnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgcHJ1bmVGb3JQQVRDSCA9ICh1cGRhdGUpID0+IHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGxpc3RlZCBmaWVsZHMgd2hlbiBQQVRDSGluZyBhbiB1cGRhdGVcbiAgICAvLyBjdXJyZW50bHkgdGhlIGxpc3QgbWltaWNzIHRoZSBvbGQgTXlSZXN1bHRzIGRhdGFcbiAgICBjb25zdCBmaWVsZHMgPSBbJ2RhdGEnLCAndGV4dCcsICdyZWxhdGl2ZV9kYXRhJywgJ3N0YXR1cyddO1xuICAgIHJldHVybiBmaWVsZHMucmVkdWNlKChhY2MsIGYpID0+IHtyZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtbZl06IHVwZGF0ZVtmXX0pfSwge30pO1xufTtcblxuY29uc3QgcHJ1bmVGb3JQT1NUID0gKHVwZGF0ZSkgPT4ge1xuICAgIC8vIE9ubHkgaW5jbHVkZSB0aGUgbGlzdGVkIGZpZWxkcyB3aGVuIFBPU1RpbmcgYW4gdXBkYXRlXG4gICAgbGV0IHVwZGF0ZUZvclBPU1QgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGUpO1xuICAgIGRlbGV0ZSB1cGRhdGVGb3JQT1NUWyd1c2VyX2RldGFpbHMnXTtcbiAgICByZXR1cm4gdXBkYXRlRm9yUE9TVDtcbn07XG5cbmNsYXNzIFVwZGF0ZUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAvLyBTYXZlIG9yaWdpbmFsIHVwZGF0ZVxuICAgICAgICB0aGlzLnN0YXRlID0ge29yaWdpbmFsVXBkYXRlOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnVwZGF0ZSl9O1xuICAgICAgICB0aGlzLnNhdmVVcGRhdGUgPSB0aGlzLnNhdmVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGVVcGRhdGUgPSB0aGlzLmRlbGV0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgZm9ybSBmaWVsZCB3aWRnZXRzIGNoYW5nZSwgbW9kaWZ5IHRoZSBtb2RlbCBkYXRhIGluIEFwcC5zdGF0ZVttb2RlbF1cbiAgICAgICAgY29uc3QgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXG4gICAgICAgICAgICBPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZSh0aGlzLnByb3BzLnVwZGF0ZSwgeyRtZXJnZToge1tmaWVsZF06IGUudGFyZ2V0LnZhbHVlfX0pKTtcbiAgICB9XG5cbiAgICBvbkNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuc3RhdGUub3JpZ2luYWxVcGRhdGU7XG4gICAgICAgIGlmIChpc05ld1VwZGF0ZSh1cGRhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5kZWxldGVGcm9tTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUuaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZVVwZGF0ZShlKSB7XG4gICAgICAgIGxldCB1cGRhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnVwZGF0ZSk7XG4gICAgICAgIC8vIEFsbCBjaGFuZ2VzIHRvIGFuIHVwZGF0ZSByZXZlcnQgaXQgdG8gZHJhZnQgdW5sZXNzIGl0IGlzIGV4cGxpY2l0bHkgYXBwcm92ZWQgd2hpbGUgc2F2aW5nXG4gICAgICAgIGlmIChlLnRhcmdldC5pZCA9PSAnYXBwcm92ZScpIHtcbiAgICAgICAgICAgIHVwZGF0ZS5zdGF0dXMgPSBTVEFUVVNfQVBQUk9WRURfQ09ERTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZS5zdGF0dXMgPSBTVEFUVVNfRFJBRlRfQ09ERTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgLy8gQWx3YXlzIHNhdmUgdGhlIGluc3RhbmNlIHVzaW5nIGRhdGEgY29taW5nIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgICAgICAgIC8vIFRPRE86IGxvb2sgYXQgaGF2aW5nIGEgcmVwbGFjZU1vZGVsIG1ldGhvZD9cbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmRlbGV0ZUZyb21Nb2RlbChPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZS5pZCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoaXNOZXdVcGRhdGUodXBkYXRlKSkge1xuICAgICAgICAgICAgQVBJQ2FsbCgnUE9TVCcsIGVuZHBvaW50cy51cGRhdGVzX2FuZF9jb21tZW50cygpLFxuICAgICAgICAgICAgICAgICAgICBwcnVuZUZvclBPU1QodXBkYXRlKSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModXBkYXRlLmlkKSxcbiAgICAgICAgICAgICAgICAgICAgcHJ1bmVGb3JQQVRDSCh1cGRhdGUpLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlVXBkYXRlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge2lkOiB0aGlzLnByb3BzLnVwZGF0ZS5pZH07XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgZGF0YSwgdHJ1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgQVBJQ2FsbCgnREVMRVRFJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHMoZGF0YS5pZCksIG51bGwsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNBY3R1YWxWYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudXBkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy51cGRhdGUuYWN0dWFsX3ZhbHVlIC0gdGhpcy5wcm9wcy51cGRhdGUuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLnByb3BzLnBlcmlvZC51cGRhdGVzO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZXMgJiYgdXBkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXBkYXRlc1t1cGRhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXRlc3QuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLnByb3BzLnVwZGF0ZS5kYXRhID8gdGhpcy5wcm9wcy51cGRhdGUuZGF0YSA6IDApO1xuICAgICAgICBjb25zdCB1cGRhdGVkQWN0dWFsVmFsdWUgPSBkaXNwbGF5TnVtYmVyKHRoaXMucHJldmlvdXNBY3R1YWxWYWx1ZSgpICsgdXBkYXRlVmFsdWUpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lciBlZGl0LWluLXByb2dyZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXIgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEFjdHVhbFZhbHVlPXt1cGRhdGVkQWN0dWFsVmFsdWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QXR0YWNobWVudHMvPlxuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybUJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlVXBkYXRlOiB0aGlzLmRlbGV0ZVVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5vbkNhbmNlbH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVGb3JtLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBmb3JtVG9nZ2xlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcblxubGV0IG5ld1VwZGF0ZUlEID0gMTtcblxuZXhwb3J0IGNsYXNzIE5ld1VwZGF0ZUJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5uZXdVcGRhdGUgPSB0aGlzLm5ld1VwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG5ld1VwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMucHJvcHMuY2FsbGJhY2tzLmN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGNvbnN0IGlkID0gYG5ldy0ke25ld1VwZGF0ZUlEfWA7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBwZXJpb2Q6IHRoaXMucHJvcHMucGVyaW9kLmlkLFxuICAgICAgICAgICAgdXNlcl9kZXRhaWxzOiB1c2VyLFxuICAgICAgICAgICAgdXNlcjogdXNlci5pZCxcbiAgICAgICAgICAgIGRhdGE6IDAsXG4gICAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgICAgIHJlbGF0aXZlX2RhdGE6IHRydWUsXG4gICAgICAgICAgICBzdGF0dXM6IFNUQVRVU19EUkFGVF9DT0RFXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLm9wZW5OZXdGb3JtKGlkLCBkYXRhKTtcbiAgICAgICAgbmV3VXBkYXRlSUQgKz0gMTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubmV3VXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtcGx1cycgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCduZXdfdXBkYXRlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5OZXdVcGRhdGVCdXR0b24ucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuZXhwb3J0IGNvbnN0XG4gICAgLy8gRnJvbSByc3IubW9kZWxzLmluZGljYXRvci5JbmRpY2F0b3JQZXJpb2REYXRhXG4gICAgU1RBVFVTX05FV19DT0RFID0gJ04nLFxuICAgIFNUQVRVU19EUkFGVF9DT0RFID0gJ0QnLFxuICAgIFNUQVRVU19QRU5ESU5HX0NPREUgPSAnUCcsXG4gICAgU1RBVFVTX1JFVklTSU9OX0NPREUgPSAnUicsXG4gICAgU1RBVFVTX0FQUFJPVkVEX0NPREUgPSAnQScsXG5cblxuICAgIE9CSkVDVFNfUkVTVUxUUyA9ICdyZXN1bHRzJyxcbiAgICBPQkpFQ1RTX0lORElDQVRPUlMgPSAnaW5kaWNhdG9ycycsXG4gICAgT0JKRUNUU19QRVJJT0RTID0gJ3BlcmlvZHMnLFxuICAgIE9CSkVDVFNfVVBEQVRFUyA9ICd1cGRhdGVzJyxcbiAgICBPQkpFQ1RTX0NPTU1FTlRTID0gJ2NvbW1lbnRzJyxcbiAgICBPQkpFQ1RTX1VTRVJTID0gJ3VzZXJzJztcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxubGV0IG1vbnRocztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmICghbW9udGhzKSB7XG4gICAgICAgIG1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIH1cbiAgICBpZiAoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IG1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwNClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG59XG5cblxuLy8gT2JqZWN0IGhvbGRzIGNhbGxiYWNrIFVSTCBmdW5jdGlvbnMgYXMgdmFsdWVzLCBtb3N0IG9mIHRoZW0gY2FsbGVkIHdpdGggYW4gaWQgcGFyYW1ldGVyXG4vLyBVc2FnZTogZW5kcG9pbnRzLnJlc3VsdCgxNykgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgICAgICBcInJlc3VsdFwiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJyZXN1bHRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiaW5kaWNhdG9yc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwidXBkYXRlc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImNvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOdW1iZXIobnVtYmVyU3RyaW5nKSB7XG4gICAgLy8gQWRkIGNvbW1hcyB0byBudW1iZXJzIG9mIDEwMDAgb3IgaGlnaGVyLlxuICAgIGlmIChudW1iZXJTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBudW1iZXJTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgdmFyIGZsb2F0ID0gcGFyc2VGbG9hdChudW1iZXJTdHJpbmcpO1xuICAgICAgICBpZiAoIWlzTmFOKGZsb2F0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsb2F0LnRvTG9jYWxlU3RyaW5nKGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG5sZXQgc3RyaW5ncztcblxuLy8gVHJhbnNsYXRpb24gYSBsYSBweXRob24uIExldCdzIGhvcGUgd2UgbmV2ZXIgbmVlZCBsb2Rhc2guLi5cbmV4cG9ydCBmdW5jdGlvbiBfKHMpIHtcbiAgICBpZiAoIXN0cmluZ3MpIHtcbiAgICAgICAgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ3Nbc107XG59XG5cbmV4cG9ydCBjb25zdCBpc05ld1VwZGF0ZSA9ICh1cGRhdGUpID0+IHtyZXR1cm4gdXBkYXRlLmlkLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDQpID09PSAnbmV3LSd9O1xuXG5leHBvcnQgZnVuY3Rpb24gbGV2ZWxUb2dnbGUoV3JhcHBlZENvbXBvbmVudCkge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7YWN0aXZlS2V5OiBbXSwgaXNPcGVuOiBmYWxzZX07XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVMZXZlbCA9IHRoaXMudG9nZ2xlTGV2ZWwuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQ2hhbmdlKGFjdGl2ZUtleSkge1xuICAgICAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBvcGVuIHBhbmVsc1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5fSk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVMZXZlbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuc3RhdGUuaXNPcGVuO1xuICAgICAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleTogW10sIGlzT3BlbjogIWlzT3Blbn0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5OiB0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5pZC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiAhaXNPcGVuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMudG9nZ2xlTGV2ZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICArXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPFdyYXBwZWRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUtleT17dGhpcy5zdGF0ZS5hY3RpdmVLZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
