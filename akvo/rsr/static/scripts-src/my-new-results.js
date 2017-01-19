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
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Level3.default, { items: this.props.items, renderPanel: this.renderPanel.bind(this) });
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

var Indicators = function (_React$Component) {
    _inherits(Indicators, _React$Component);

    function Indicators(props) {
        _classCallCheck(this, Indicators);

        var _this = _possibleConstructorReturn(this, (Indicators.__proto__ || Object.getPrototypeOf(Indicators)).call(this, props));

        _this.state = { model: "indicators" };
        return _this;
    }

    _createClass(Indicators, [{
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
            return _react2.default.createElement(_Level2.default, { items: this.props.items, renderPanel: this.renderPanel.bind(this) });
        }
    }]);

    return Indicators;
}(_react2.default.Component);

exports.default = Indicators;


Indicators.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

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
                    null,
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
    renderPanel: _react.PropTypes.func.isRequired
};

},{"rc-collapse":"rc-collapse","react":"react"}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var Periods = function (_React$Component2) {
    _inherits(Periods, _React$Component2);

    function Periods(props) {
        _classCallCheck(this, Periods);

        var _this2 = _possibleConstructorReturn(this, (Periods.__proto__ || Object.getPrototypeOf(Periods)).call(this, props));

        _this2.state = {
            model: "periods",
            activeKey: [] // Keep track of open update panels
        };
        _this2.onChange = _this2.onChange.bind(_this2);
        _this2.openNewForm = _this2.openNewForm.bind(_this2);
        return _this2;
    }

    _createClass(Periods, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.props.callbacks.loadModel('updates');
        }
    }, {
        key: "onChange",
        value: function onChange(activeKey) {
            // Keep track of open panels
            this.setState({ activeKey: activeKey });
        }
    }, {
        key: "openNewForm",
        value: function openNewForm(newKey, data) {
            // Add the key for a new update to the list of open panels
            this.setState({ activeKey: (0, _immutabilityHelper2.default)(this.state.activeKey, { $push: [newKey] }) },
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
                    callbacks: updateCallbacks,
                    items: period.updates,
                    activeKey: this.state.activeKey }),
                _react2.default.createElement(_Updates.NewUpdateButton, {
                    callbacks: buttonCallbacks,
                    period: period })
            );
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Level2.default, { items: this.props.items, renderPanel: this.renderPanel.bind(this) });
        }
    }]);

    return Periods;
}(_react2.default.Component);

exports.default = Periods;


Periods.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

},{"./Level.jsx":4,"./Updates.jsx":7,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level = require('./Level.jsx');

var _Level2 = _interopRequireDefault(_Level);

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

var Results = function (_React$Component) {
    _inherits(Results, _React$Component);

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
                    callbacks: this.props.callbacks })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_Level2.default, { items: this.props.items, renderPanel: this.renderPanel.bind(this) });
        }
    }]);

    return Results;
}(_react2.default.Component);

exports.default = Results;


Results.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

},{"./Indicators.jsx":3,"./Level.jsx":4,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewUpdateButton = exports.Updates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _rcCollapse2 = _interopRequireDefault(_rcCollapse);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

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

var Updates = exports.Updates = function (_React$Component2) {
    _inherits(Updates, _React$Component2);

    function Updates() {
        _classCallCheck(this, Updates);

        return _possibleConstructorReturn(this, (Updates.__proto__ || Object.getPrototypeOf(Updates)).apply(this, arguments));
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
            var headerText = 'Update: ' + userName + ' at ' + organisation + ', Data: ' + update.data + '\n                            Status: ' + (0, _utils._)('update_statuses')[update.status];
            return _react2.default.createElement(
                _rcCollapse.Panel,
                { header: headerText, key: update.id },
                _react2.default.createElement(Update, {
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
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

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
                    { onChange: this.props.callbacks.onChange, activeKey: this.props.activeKey },
                    items.map(function (item) {
                        return _this3.renderPanel(item);
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

    return Updates;
}(_react2.default.Component);

Updates.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.array
};

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
        var _this4 = _possibleConstructorReturn(this, (UpdateForm.__proto__ || Object.getPrototypeOf(UpdateForm)).call(this, props));

        _this4.state = { originalUpdate: Object.assign({}, _this4.props.update) };
        _this4.saveUpdate = _this4.saveUpdate.bind(_this4);
        _this4.deleteUpdate = _this4.deleteUpdate.bind(_this4);
        _this4.onChange = _this4.onChange.bind(_this4);
        _this4.onCancel = _this4.onCancel.bind(_this4);
        return _this4;
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

        var _this5 = _possibleConstructorReturn(this, (NewUpdateButton.__proto__ || Object.getPrototypeOf(NewUpdateButton)).call(this, props));

        _this5.newUpdate = _this5.newUpdate.bind(_this5);
        return _this5;
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

},{"./Comments.jsx":2,"./const.js":8,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],8:[function(require,module,exports){
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
exports.displayDate = displayDate;
exports.getCookie = getCookie;
exports.APICall = APICall;
exports.displayNumber = displayNumber;
exports._ = _;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var months = void 0; /*
                         Akvo RSR is covered by the GNU Affero General Public License.
                         See more details in the license.txt file located at the root folder of the
                         Akvo RSR module. For additional details on the GNU license please see
                         < http://www.gnu.org/licenses/agpl.html >.
                      */

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

},{"isomorphic-fetch":"isomorphic-fetch"}]},{},[1,2,3,4,5,6,7,9,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9jb25zdC5qcyIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBZEE7Ozs7Ozs7QUFnQkE7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsT0FBTyxNQUFQLElBQWtCO0FBQUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLENBQXFCO0FBQUEsZUFBTyxJQUFJLEdBQUosQ0FBUDtBQUFBLEtBQXJCLENBQVA7QUFBQSxDQUFsQzs7SUFHTSxHOzs7QUFDRixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEdBQ1QsS0FEUzs7QUFFZixZQUFNLFdBQVcsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQS9DLEVBQTBELE1BQTNFO0FBQ0EsWUFBTSxVQUFVLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkMsU0FBeEQsQ0FBaEI7QUFDQSxZQUFNLFNBQVMsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLFNBQXBELEVBQStELE1BQTlFO0FBQ0EsWUFBTSxhQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUFsRCxDQUFuQjtBQUNBLGNBQUssS0FBTCxHQUFhO0FBQ1Qsb0JBQVE7QUFDSix5QkFBUyxTQURMO0FBRUosNEJBQVksU0FGUjtBQUdKLHlCQUFTLFNBSEw7QUFJSix5QkFBUyxTQUpMO0FBS0osMEJBQVUsU0FMTjtBQU1KLHNCQUFNO0FBTkYsYUFEQztBQVNULDZCQUFpQixFQVRSO0FBVVQscUJBQVMsRUFBQyxJQUFJLFdBQVcsVUFBaEI7QUFWQSxTQUFiO0FBWUEsWUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFTLElBQVQsRUFBZTtBQUMzQjtBQUNBLGlCQUFLLHNCQUFMLEdBQThCLENBQUMsS0FBSyxZQUFOLENBQTlCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLEVBQUMsUUFBUSxrQ0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixFQUEwQixFQUFDLFFBQVEsRUFBQyxNQUFNLElBQVAsRUFBVCxFQUExQixDQUFULEVBQWQ7QUFDSCxTQUpEO0FBS0E7QUFDQTtBQUNBLDRCQUFRLEtBQVIsRUFBZSxpQkFBVSxJQUFWLENBQWUsTUFBZixDQUFmLEVBQXVDLEVBQXZDLEVBQTJDLFFBQVEsSUFBUixPQUEzQztBQXpCZTtBQTBCbEI7Ozs7NENBRW1CO0FBQ2hCO0FBQ0E7QUFDQSxpQkFBSyxTQUFMLENBQWUsU0FBZjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxZQUFmO0FBQ0g7OztrQ0FFUyxLLEVBQU87QUFDYjtBQUNBLGdCQUFJLENBQUUsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixDQUFOLEVBQWdDO0FBQzVCLG9CQUFJLFVBQVUsVUFBUyxRQUFULEVBQW1CO0FBQzdCLHlCQUFLLFFBQUwsQ0FDSSxFQUFDLFFBQVEsa0NBQ0wsS0FBSyxLQUFMLENBQVcsTUFETixFQUVMLEVBQUMsNEJBQVUsS0FBVixFQUFrQixLQUFLLFVBQUwsQ0FBZ0IsU0FBUyxPQUF6QixDQUFsQixDQUFELEVBRkssQ0FBVCxFQURKLEVBS0ksWUFBVztBQUNQLDZCQUFLLFFBQUwsQ0FBYyxFQUFDLGlCQUFpQixLQUFLLGdCQUFMLEVBQWxCLEVBQWQ7QUFDSCxxQkFQTDtBQVNILGlCQVZhLENBVVosSUFWWSxDQVVQLElBVk8sQ0FBZDtBQVdBLG9DQUFRLEtBQVIsRUFBZSxpQkFBVSxLQUFWLEVBQWlCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsRUFBcEMsQ0FBZixFQUF3RCxFQUF4RCxFQUE0RCxPQUE1RDtBQUNIO0FBQ0o7OztvQ0FFVyxLLEVBQU8sSSxFQUFNO0FBQ3JCOzs7O0FBSUEsZ0JBQUksaUJBQUo7QUFDQSxnQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSx1QkFBVyxrQ0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixzQkFBNEIsS0FBNUIsRUFBb0MsRUFBQyw0QkFBVSxFQUFWLEVBQWUsSUFBZixDQUFELEVBQXBDLEVBQVg7QUFDQSxpQkFBSyxRQUFMLENBQ0ksRUFBQyxRQUFRLFFBQVQsRUFESixFQUVJLFlBQVc7QUFDUCxxQkFBSyxRQUFMLENBQWMsRUFBQyxpQkFBaUIsS0FBSyxnQkFBTCxFQUFsQixFQUFkO0FBQ0gsYUFKTDtBQU1IOzs7d0NBRWUsSyxFQUFPLEUsRUFBSTtBQUN2Qjs7OztBQUlBLGdCQUFJLGlCQUFKO0FBQ0E7QUFDQTtBQUNBLGdCQUFNLFdBQVcsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCLENBQWxCLENBQWpCO0FBQ0EsbUJBQU8sU0FBUyxFQUFULENBQVA7QUFDQSx1QkFBVyxrQ0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixzQkFBNEIsS0FBNUIsRUFBb0MsRUFBQyxNQUFNLFFBQVAsRUFBcEMsRUFBWDtBQUNBLGlCQUFLLFFBQUwsQ0FDSSxFQUFDLFFBQVEsUUFBVCxFQURKLEVBRUksWUFBVztBQUNQLHFCQUFLLFFBQUwsQ0FBYyxFQUFDLGlCQUFpQixLQUFLLGdCQUFMLEVBQWxCLEVBQWQ7QUFDSCxhQUpMO0FBTUg7OzttQ0FFVSxJLEVBQU07QUFDYjs7Ozs7QUFLQSxtQkFBTyxLQUFLLE1BQUwsQ0FDSCxVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CO0FBQ2Ysb0JBQU0sS0FBSyxJQUFJLElBQUosQ0FBWDtBQUNBLG9CQUFJLGFBQWEsRUFBakI7QUFDQSwyQkFBVyxFQUFYLElBQWlCLEdBQWpCO0FBQ0EsdUJBQU8sT0FBTyxNQUFQLENBQWMsR0FBZCxFQUFtQixVQUFuQixDQUFQO0FBQ0gsYUFORSxFQU9ILEVBUEcsQ0FBUDtBQVNIOzs7c0NBRWE7QUFDVjtBQUNBLG1CQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsSUFBekI7QUFDSDs7OzJDQUVrQjtBQUNmOzs7Ozs7OztBQVFBLHFCQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsRUFBNkMsUUFBN0MsRUFBdUQ7QUFDbkQ7Ozs7Ozs7Ozs7QUFVQSx1QkFBTyxXQUFXLFFBQVEsR0FBUixDQUNkLFVBQVUsTUFBVixFQUFrQjtBQUNkLHdCQUFJLFFBQUosRUFBYztBQUNWLCtCQUFPLFdBQVcsUUFBbEIsSUFBOEIsU0FBUyxNQUFULENBQzFCO0FBQUEsbUNBQVMsTUFBTSxXQUFXLE1BQWpCLE1BQTZCLE9BQU8sRUFBN0M7QUFBQSx5QkFEMEIsQ0FBOUI7QUFHSDtBQUNELDJCQUFPLE1BQVA7QUFDSCxpQkFSYSxDQUFsQjtBQVVIOztBQUVELHFCQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDOUI7Ozs7OztBQU1BLHVCQUFPLFdBQVcsUUFBUSxHQUFSLENBQ2QsVUFBUyxNQUFULEVBQWlCO0FBQ2Isd0JBQUksT0FBTyxPQUFYLEVBQW9CO0FBQUE7QUFDaEIsZ0NBQUksZUFBZSxDQUFuQjtBQUNBLG1DQUFPLE9BQVAsR0FBaUIsT0FBTyxPQUFQLENBQWUsR0FBZixDQUNiLFVBQVMsTUFBVCxFQUFpQjtBQUNiLHVDQUFPLGNBQVAsSUFBeUIsU0FBUyxPQUFPLElBQWhCLElBQXdCLFlBQWpEO0FBQ0EsK0NBQWUsT0FBTyxZQUF0QjtBQUNBLHVDQUFPLE1BQVA7QUFDSCw2QkFMWSxDQUFqQjtBQUZnQjtBQVNuQjtBQUNELDJCQUFPLE1BQVA7QUFDSCxpQkFiYSxDQUFsQjtBQWVIOztBQUVELHFCQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDbEI7QUFDQSx1QkFBTyxPQUFPLE9BQU8sTUFBUCxDQUFjLEdBQWQsQ0FBZDtBQUNIOztBQUVEO0FBQ0EsZ0JBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxNQUExQjtBQUNBLGdCQUFNLFVBQVUsZUFDWixRQUFRLE9BQU8sT0FBZixDQURZLEVBRVosRUFBQyxRQUFRLE1BQVQsRUFBaUIsVUFBVSxVQUEzQixFQUZZLEVBR1osUUFBUSxPQUFPLFFBQWYsQ0FIWSxDQUFoQjs7QUFNQSxnQkFBTSxVQUFVLGVBQ1osUUFBUSxPQUFPLE9BQWYsQ0FEWSxFQUVaLEVBQUMsUUFBUSxRQUFULEVBQW1CLFVBQVUsU0FBN0IsRUFGWSxFQUdaLE9BSFksQ0FBaEI7QUFJQSxnQkFBTSxvQkFBb0IsZ0JBQWdCLE9BQWhCLENBQTFCOztBQUVBLGdCQUFNLGFBQWEsZUFDZixRQUFRLE9BQU8sVUFBZixDQURlLEVBRWYsRUFBQyxRQUFRLFdBQVQsRUFBc0IsVUFBVSxTQUFoQyxFQUZlLEVBR2YsaUJBSGUsQ0FBbkI7O0FBTUEsZ0JBQU0sVUFBVSxlQUNaLFFBQVEsT0FBTyxPQUFmLENBRFksRUFFWixFQUFDLFFBQVEsUUFBVCxFQUFtQixVQUFVLFlBQTdCLEVBRlksRUFHWixVQUhZLENBQWhCO0FBS0EsbUJBQU8sT0FBUDtBQUNIOzs7aUNBRVE7QUFDTCxnQkFBTSxPQUFPLEtBQUssS0FBTCxDQUFXLGVBQXhCO0FBQ0EsZ0JBQU0sWUFBWTtBQUNkLDJCQUFXLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FERztBQUVkLDZCQUFhLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUZDO0FBR2QsaUNBQWlCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUhIO0FBSWQsNkJBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCO0FBSkMsYUFBbEI7QUFNQSxnQkFBSSxDQUFFLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsT0FBeEIsRUFBaUM7QUFDN0IsdUJBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFESjtBQUdILGFBSkQsTUFJTyxJQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ3hCLHVCQUNJO0FBQ0ksMkJBQU8sSUFEWDtBQUVJLCtCQUFXLFNBRmYsR0FESjtBQUtILGFBTk0sTUFNQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBL05hLGdCQUFNLFM7O0FBbU94QixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JELHVCQUFTLE1BQVQsQ0FBZ0IsOEJBQUMsR0FBRCxPQUFoQixFQUF3QixTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBQXhCO0FBQ0gsQ0FGRDs7Ozs7Ozs7Ozs7QUNoUEE7Ozs7QUFDQTs7QUFFQTs7Ozs7Ozs7OzsrZUFWQTs7Ozs7OztJQWFxQixROzs7QUFDakIsc0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdIQUNULEtBRFM7O0FBRWYsY0FBSyxLQUFMLEdBQWEsRUFBQyxPQUFPLFVBQVIsRUFBYjtBQUZlO0FBR2xCOzs7O29DQUVXLE8sRUFBUztBQUNqQixtQkFDSTtBQUFBO0FBQUEsa0JBQU8sUUFBUSxRQUFRLE9BQXZCLEVBQWdDLEtBQUssUUFBUSxFQUE3QztBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQVUsNEJBQVEsWUFBUixDQUFxQjtBQUEvQjtBQURKLGFBREo7QUFLSDs7O2lDQUVRO0FBQ0wsbUJBQ0ksaURBQU8sT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF6QixFQUFnQyxhQUFhLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUE3QyxHQURKO0FBR0g7Ozs7OztrQkFsQmdCLFE7OztBQXFCckIsU0FBUyxTQUFULEdBQXFCO0FBQ2pCLFdBQU8saUJBQVUsS0FEQTtBQUVqQixlQUFXLGlCQUFVO0FBRkosQ0FBckI7Ozs7Ozs7Ozs7O0FDM0JBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7OzsrZUFiQTs7Ozs7OztJQWdCcUIsVTs7O0FBQ2pCLHdCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SEFDVCxLQURTOztBQUVmLGNBQUssS0FBTCxHQUFhLEVBQUMsT0FBTyxZQUFSLEVBQWI7QUFGZTtBQUdsQjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsU0FBckIsQ0FBK0IsU0FBL0I7QUFDSDs7O29DQUVXLFMsRUFBVztBQUNuQixnQkFBTSxRQUFRLFVBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixDQUF6QixHQUE2QixVQUFVLEtBQXZDLEdBQStDLG9CQUE3RDtBQUNBLG1CQUNJO0FBQUE7QUFBQSxrQkFBTyxRQUFRLGdCQUFnQixLQUEvQixFQUFzQyxLQUFLLFVBQVUsRUFBckQ7QUFDSyxxQkFETDtBQUVJO0FBQUE7QUFBQSxzQkFBSyxXQUFVLFVBQWY7QUFDSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxlQUFmO0FBQ0ssc0NBQUUsZUFBRixDQURMO0FBQUE7QUFDMkIsa0NBQVU7QUFEckMscUJBREo7QUFJSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxnQkFBZjtBQUNLLHNDQUFFLGdCQUFGLENBREw7QUFBQTtBQUM0QixrQ0FBVTtBQUR0QztBQUpKLGlCQUZKO0FBVUk7QUFDSSwyQkFBTyxVQUFVLE9BRHJCO0FBRUksK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FGMUI7QUFWSixhQURKO0FBZ0JIOzs7aUNBRVE7QUFDTCxtQkFDSSxpREFBTyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXpCLEVBQWdDLGFBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQTdDLEdBREo7QUFHSDs7OztFQWxDbUMsZ0JBQU0sUzs7a0JBQXpCLFU7OztBQXFDckIsV0FBVyxTQUFYLEdBQXVCO0FBQ25CLFdBQU8saUJBQVUsS0FERTtBQUVuQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUI7QUFGVCxDQUF2Qjs7Ozs7Ozs7Ozs7QUM5Q0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFSQTs7Ozs7OztJQVVxQixLOzs7Ozs7Ozs7OztpQ0FDUjtBQUFBOztBQUNMLGdCQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBekI7QUFDQSxnQkFBSSxDQUFDLEtBQUwsRUFBWTtBQUNSLHdCQUFRLEdBQVIsQ0FBWSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsR0FBd0IsR0FBeEIsR0FBOEIsS0FBSyxzQkFBTCxDQUE0QixRQUExRCxHQUFxRSxhQUFqRjtBQUNBLHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSCxhQUxELE1BS08sSUFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUN6Qix1QkFDSTtBQUFBO0FBQUE7QUFDSywwQkFBTSxHQUFOLENBQVUsVUFBQyxJQUFEO0FBQUEsK0JBQVUsT0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixJQUF2QixDQUFWO0FBQUEscUJBQVY7QUFETCxpQkFESjtBQUtILGFBTk0sTUFNQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBbkI4QixnQkFBTSxTOztrQkFBcEIsSzs7O0FBc0JyQixNQUFNLFNBQU4sR0FBa0I7QUFDZCxXQUFPLGlCQUFVLEtBREg7QUFFZCxpQkFBYSxpQkFBVSxJQUFWLENBQWU7QUFGZCxDQUFsQjs7Ozs7Ozs7Ozs7QUMxQkE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVpBOzs7Ozs7OztJQWVNLGdCOzs7QUFDRiw4QkFBYSxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsd0lBQ1YsS0FEVTs7QUFFaEIsY0FBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLGNBQUssS0FBTCxHQUFhLEVBQUMsU0FBUyxLQUFWLEVBQWI7QUFIZ0I7QUFJbkI7Ozs7dUNBRWMsUSxFQUFVLEksRUFBTSxRLEVBQVU7QUFDckM7QUFDQSxnQkFBTSxNQUFNLGlCQUFVLE1BQVYsQ0FBaUIsUUFBakIsQ0FBWjtBQUNBLHFCQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDbkIscUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsV0FBckIsQ0FBaUMsU0FBakMsRUFBNEMsSUFBNUM7O0FBRUE7QUFDQSxvQkFBSSxRQUFKLEVBQWM7QUFDVjtBQUNIO0FBQ0o7QUFDRCxnQ0FBUSxPQUFSLEVBQWlCLEdBQWpCLEVBQXNCLElBQXRCLEVBQTRCLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBNUI7QUFDSDs7O3NDQUVhLE8sRUFBUztBQUNuQixpQkFBSyxRQUFMLENBQWMsRUFBQyxTQUFTLE9BQVYsRUFBZDtBQUNIOzs7cUNBRVk7QUFDVCxpQkFBSyxhQUFMLENBQW1CLEtBQW5CO0FBQ0g7OzttQ0FFVSxDLEVBQUc7QUFDVixnQkFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLE9BQWhCLEVBQXlCO0FBQ3JCLHFCQUFLLGFBQUwsQ0FBbUIsSUFBbkI7QUFDQSxxQkFBSyxjQUFMLENBQW9CLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsRUFBdEMsRUFBMEMsRUFBQyxRQUFRLENBQUMsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUE1QixFQUExQyxFQUErRSxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBL0U7QUFDSDtBQUNELGNBQUUsZUFBRjtBQUNIOzs7aUNBRVE7QUFDTCxnQkFBSSxhQUFKO0FBQUEsZ0JBQVUsY0FBVjtBQUNBLGdCQUFJLEtBQUssS0FBTCxDQUFXLE9BQWYsRUFBd0I7QUFDcEIsdUJBQU8scUNBQUcsV0FBVSx1QkFBYixHQUFQO0FBQ0Esd0JBQVEsU0FBUjtBQUNILGFBSEQsTUFHTyxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBdEIsRUFBOEI7QUFDakMsdUJBQU8scUNBQUcsV0FBVyxZQUFkLEdBQVA7QUFDQSx3QkFBUSxlQUFSO0FBQ0gsYUFITSxNQUdBO0FBQ0gsdUJBQU8scUNBQUcsV0FBVSxrQkFBYixHQUFQO0FBQ0Esd0JBQVEsYUFBUjtBQUNIO0FBQ0QsbUJBQ0k7QUFBQTtBQUFBLGtCQUFHLFNBQVMsS0FBSyxVQUFqQjtBQUNHLCtCQUFXLHdCQURkO0FBRUcsMkJBQU8sRUFBQyxPQUFPLE9BQVIsRUFBaUIsUUFBUSxhQUF6QixFQUZWO0FBR0ssb0JBSEw7QUFJSztBQUpMLGFBREo7QUFRSDs7OztFQXpEMEIsZ0JBQU0sUzs7QUE0RHJDLGlCQUFpQixTQUFqQixHQUE2QjtBQUN6QixZQUFRLGlCQUFVLE1BRE87QUFFekIsZUFBVyxpQkFBVTtBQUZJLENBQTdCOztBQUtBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBWTtBQUNsQyxXQUFPLE9BQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBZSxNQUFmLEdBQXdCLENBQTFDLEdBQ0gsT0FBTyxPQUFQLENBQWUsT0FBTyxPQUFQLENBQWUsTUFBZixHQUFzQixDQUFyQyxFQUF3QyxZQURyQyxHQUdILEVBSEo7QUFJSCxDQUxEOztJQU9xQixPOzs7QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVIQUNULEtBRFM7O0FBRWYsZUFBSyxLQUFMLEdBQWE7QUFDVCxtQkFBTyxTQURFO0FBRVQsdUJBQVcsRUFGRixDQUVLO0FBRkwsU0FBYjtBQUlBLGVBQUssUUFBTCxHQUFnQixPQUFLLFFBQUwsQ0FBYyxJQUFkLFFBQWhCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLE9BQUssV0FBTCxDQUFpQixJQUFqQixRQUFuQjtBQVBlO0FBUWxCOzs7OzZDQUVvQjtBQUNqQixpQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixTQUFyQixDQUErQixTQUEvQjtBQUNIOzs7aUNBRVEsUyxFQUFXO0FBQ2hCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLEVBQUMsb0JBQUQsRUFBZDtBQUNIOzs7b0NBRVcsTSxFQUFRLEksRUFBTTtBQUN0QjtBQUNBLGlCQUFLLFFBQUwsQ0FDSSxFQUFDLFdBQVcsa0NBQU8sS0FBSyxLQUFMLENBQVcsU0FBbEIsRUFBNkIsRUFBQyxPQUFPLENBQUMsTUFBRCxDQUFSLEVBQTdCLENBQVosRUFESjtBQUVJO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsV0FBckIsQ0FBaUMsU0FBakMsRUFBNEMsSUFBNUMsQ0FISjtBQUtIOzs7b0NBRVcsTSxFQUFRO0FBQ2hCLGdCQUFNLGNBQWMsd0JBQVksT0FBTyxZQUFuQixDQUFwQjtBQUNBLGdCQUFNLFlBQVksd0JBQVksT0FBTyxVQUFuQixDQUFsQjtBQUNBLGdCQUFNLGFBQWdCLFdBQWhCLFdBQWlDLFNBQXZDO0FBQ0EsZ0JBQU0sU0FDRjtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUNhLDhCQURiO0FBQUE7QUFFbUIsMkJBQU8sWUFGMUI7QUFBQTtBQUdtQixzQ0FBa0IsTUFBbEI7QUFIbkIsaUJBREo7QUFNSSw4Q0FBQyxnQkFBRCxJQUFrQixRQUFRLE1BQTFCLEVBQWtDLFdBQVcsS0FBSyxLQUFMLENBQVcsU0FBeEQ7QUFOSixhQURKO0FBVUEsZ0JBQU0sa0JBQWtCLGtDQUFPLEtBQUssS0FBTCxDQUFXLFNBQWxCLEVBQTZCLEVBQUMsUUFBUSxFQUFDLFVBQVUsS0FBSyxRQUFoQixFQUFULEVBQTdCLENBQXhCO0FBQ0EsZ0JBQU0sa0JBQWtCLGtDQUFPLEtBQUssS0FBTCxDQUFXLFNBQWxCLEVBQTZCLEVBQUMsUUFBUSxFQUFDLGFBQWEsS0FBSyxXQUFuQixFQUFULEVBQTdCLENBQXhCO0FBQ0EsbUJBQ0k7QUFBQTtBQUFBLGtCQUFPLFFBQVEsTUFBZixFQUF1QixLQUFLLE9BQU8sRUFBbkM7QUFDSTtBQUNJLCtCQUFXLGVBRGY7QUFFSSwyQkFBTyxPQUFPLE9BRmxCO0FBR0ksK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FIMUIsR0FESjtBQUtJO0FBQ0ksK0JBQVcsZUFEZjtBQUVJLDRCQUFRLE1BRlo7QUFMSixhQURKO0FBV0g7OztpQ0FFUTtBQUNMLG1CQUNJLGlEQUFPLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBekIsRUFBZ0MsYUFBYSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBN0MsR0FESjtBQUdIOzs7O0VBOURnQyxnQkFBTSxTOztrQkFBdEIsTzs7O0FBaUVyQixRQUFRLFNBQVIsR0FBb0I7QUFDaEIsV0FBTyxpQkFBVSxLQUREO0FBRWhCLGVBQVcsaUJBQVUsTUFBVixDQUFpQjtBQUZaLENBQXBCOzs7Ozs7Ozs7OztBQ2pKQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBWEE7Ozs7Ozs7SUFjcUIsTzs7O0FBQ2pCLHFCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSEFDVCxLQURTOztBQUVmLGNBQUssS0FBTCxHQUFhLEVBQUMsT0FBTyxTQUFSLEVBQWI7QUFGZTtBQUdsQjs7OztvQ0FFVyxNLEVBQVE7QUFDaEIsbUJBQ0k7QUFBQTtBQUFBLGtCQUFPLFFBQVEsYUFBYSxPQUFPLEtBQW5DLEVBQTBDLEtBQUssT0FBTyxFQUF0RDtBQUNJO0FBQ0ksMkJBQU8sT0FBTyxVQURsQjtBQUVJLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRjFCO0FBREosYUFESjtBQU9IOzs7aUNBRVE7QUFDTCxtQkFDSSxpREFBTyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXpCLEVBQWdDLGFBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQTdDLEdBREo7QUFHSDs7OztFQXBCZ0MsZ0JBQU0sUzs7a0JBQXRCLE87OztBQXVCckIsUUFBUSxTQUFSLEdBQW9CO0FBQ2hCLFdBQU8saUJBQVUsS0FERDtBQUVoQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUI7QUFGWixDQUFwQjs7Ozs7Ozs7Ozs7O0FDOUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7K2VBZEE7Ozs7Ozs7QUFpQkEsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsT0FBYztBQUFBLFFBQVosTUFBWSxRQUFaLE1BQVk7O0FBQ2hDLFFBQU0sV0FBVyxPQUFPLFlBQVAsQ0FBb0IsVUFBcEIsR0FBaUMsR0FBakMsR0FBdUMsT0FBTyxZQUFQLENBQW9CLFNBQTVFO0FBQ0EsV0FDSTtBQUFBO0FBQUE7QUFBQTtBQUNXLGdDQUFZLE9BQU8sVUFBbkIsQ0FEWDtBQUFBO0FBRVMsZ0JBRlQ7QUFBQTtBQUdVLGVBQU8sWUFBUCxDQUFvQixzQkFBcEIsQ0FBMkMsQ0FBM0MsRUFBOEMsSUFIeEQ7QUFBQTtBQUlhLHNCQUFFLGlCQUFGLEVBQXFCLE9BQU8sTUFBNUIsQ0FKYjtBQUFBO0FBSWtELGlEQUpsRDtBQUFBO0FBS21CLGVBQU8sSUFMMUI7QUFBQTtBQUFBO0FBUzJELGVBQU87QUFUbEUsS0FESjtBQWFILENBZkQ7O0FBaUJBLGNBQWMsU0FBZCxHQUEwQjtBQUN0QixZQUFRLGlCQUFVLE1BQVYsQ0FBaUI7QUFESCxDQUExQjs7SUFLTSxNOzs7QUFDRixvQkFBYSxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsb0hBQ1YsS0FEVTs7QUFFaEIsY0FBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLGNBQUssS0FBTCxHQUFhLEVBQUMsVUFBVSx3QkFBWSxNQUFNLE1BQWxCLENBQVgsRUFBYjtBQUhnQjtBQUluQjs7OztxQ0FFWTtBQUNULGlCQUFLLFFBQUwsQ0FBYyxFQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUF2QixFQUFkO0FBQ0g7OztpQ0FFUTtBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSwwQkFBRyxTQUFTLEtBQUssVUFBakI7QUFDRyx1Q0FBVyx3QkFEZDtBQUVHLG1DQUFPLEVBQUMsUUFBUSxhQUFULEVBRlY7QUFHSyxzQ0FBRSxhQUFGO0FBSEw7QUFESixpQkFESjtBQVFLLHFCQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQ0csOEJBQUMsVUFBRDtBQUNJLCtCQUFXLEtBQUssS0FBTCxDQUFXLFNBRDFCO0FBRUksNEJBQVEsS0FBSyxLQUFMLENBQVcsTUFGdkI7QUFHSSxnQ0FBWSxLQUFLLFVBSHJCLEdBREgsR0FNRyw4QkFBQyxhQUFELElBQWUsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFsQztBQWRSLGFBREo7QUFrQkg7Ozs7RUE5QmdCLGdCQUFNLFM7O0FBaUMzQixPQUFPLFNBQVAsR0FBbUI7QUFDZixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFEYjtBQUVmLFlBQVEsaUJBQVUsTUFBVixDQUFpQjtBQUZWLENBQW5COztJQU1hLE8sV0FBQSxPOzs7Ozs7Ozs7Ozs2Q0FDWTtBQUNqQixpQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixTQUFyQixDQUErQixVQUEvQjtBQUNIOzs7b0NBRVcsTSxFQUFRO0FBQ2hCLGdCQUFNLGVBQWUsT0FBTyxZQUFQLENBQW9CLHNCQUFwQixDQUEyQyxDQUEzQyxFQUE4QyxJQUFuRTtBQUNBLGdCQUFNLFdBQVcsT0FBTyxZQUFQLENBQW9CLFVBQXBCLEdBQWdDLEdBQWhDLEdBQXFDLE9BQU8sWUFBUCxDQUFvQixTQUExRTtBQUNBLGdCQUFNLDBCQUF3QixRQUF4QixZQUF1QyxZQUF2QyxnQkFBOEQsT0FBTyxJQUFyRSw4Q0FDd0IsY0FBRSxpQkFBRixFQUFxQixPQUFPLE1BQTVCLENBRDlCO0FBRUEsbUJBQ0k7QUFBQTtBQUFBLGtCQUFPLFFBQVEsVUFBZixFQUEyQixLQUFLLE9BQU8sRUFBdkM7QUFDSSw4Q0FBQyxNQUFEO0FBQ0ksK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FEMUI7QUFFSSw0QkFBUSxNQUZaLEdBREo7QUFJSTtBQUFBO0FBQUE7QUFDSTtBQUNJLCtCQUFPLE9BQU8sUUFEbEI7QUFFSSxtQ0FBVyxLQUFLLEtBQUwsQ0FBVyxTQUYxQjtBQURKO0FBSkosYUFESjtBQVlIOzs7aUNBRVE7QUFBQTs7QUFDTCxnQkFBTSxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQXpCO0FBQ0EsZ0JBQUksQ0FBQyxLQUFMLEVBQVk7QUFDUix3QkFBUSxHQUFSLENBQVksS0FBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLEdBQXhCLEdBQThCLEtBQUssc0JBQUwsQ0FBNEIsUUFBMUQsR0FBcUUsYUFBakY7QUFDQSx1QkFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURKO0FBR0gsYUFMRCxNQUtPLElBQUksTUFBTSxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDekIsdUJBQ0k7QUFBQTtBQUFBLHNCQUFVLFVBQVUsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixRQUF6QyxFQUFtRCxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQXpFO0FBQ0ssMEJBQU0sR0FBTixDQUFVLFVBQUMsSUFBRDtBQUFBLCtCQUFVLE9BQUssV0FBTCxDQUFpQixJQUFqQixDQUFWO0FBQUEscUJBQVY7QUFETCxpQkFESjtBQUtILGFBTk0sTUFNQTtBQUNILHVCQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREo7QUFHSDtBQUNKOzs7O0VBMUN3QixnQkFBTSxTOztBQThDbkMsUUFBUSxTQUFSLEdBQW9CO0FBQ2hCLGVBQVcsaUJBQVUsTUFBVixDQUFpQixVQURaO0FBRWhCLFdBQU8saUJBQVU7QUFGRCxDQUFwQjs7QUFNQSxJQUFNLFNBQVMsU0FBVCxNQUFTLFFBQWM7QUFBQSxRQUFaLE1BQVksU0FBWixNQUFZOztBQUN6QixXQUNJO0FBQUE7QUFBQSxVQUFLLFdBQVUsV0FBZjtBQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsbUNBQWY7QUFBQTtBQUNhLDBCQUFFLGlCQUFGLEVBQXFCLE9BQU8sTUFBNUI7QUFEYjtBQURKLEtBREo7QUFPSCxDQVJEOztBQVdBLElBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixRQUE0QztBQUFBLFFBQTFDLE1BQTBDLFNBQTFDLE1BQTBDO0FBQUEsUUFBbEMsa0JBQWtDLFNBQWxDLGtCQUFrQztBQUFBLFFBQWQsUUFBYyxTQUFkLFFBQWM7O0FBQ2pFLFdBQ0k7QUFBQTtBQUFBLFVBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBLGtCQUFPLFNBQVEsYUFBZjtBQUE4Qiw4QkFBRSxxQkFBRjtBQUE5QixhQURKO0FBRUkscURBQU8sV0FBVSxjQUFqQjtBQUNPLG9CQUFHLE1BRFY7QUFFTyx1QkFBTyxPQUFPLElBRnJCO0FBR08sMEJBQVUsUUFIakI7QUFJTyw2QkFBYSxjQUFFLG1CQUFGLENBSnBCO0FBRkosU0FESjtBQVNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsVUFBZjtBQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGVBQWY7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsMEJBQU0sV0FBVSwwQkFBaEI7QUFDSyxzQ0FBRSwwQkFBRixDQURMO0FBQUE7QUFBQTtBQURKLGlCQURKO0FBTUk7QUFBQTtBQUFBLHNCQUFLLFdBQVUsMEJBQWY7QUFDSztBQURMO0FBTko7QUFESjtBQVRKLEtBREo7QUF3QkgsQ0F6QkQ7O0FBMkJBLGlCQUFpQixTQUFqQixHQUE2QjtBQUN6QixZQUFRLGlCQUFVLE1BRE87QUFFekIsd0JBQW9CLGlCQUFVLE1BRkw7QUFHekIsY0FBVSxpQkFBVSxJQUFWLENBQWU7QUFIQSxDQUE3Qjs7QUFPQSxJQUFNLHlCQUF5QixTQUF6QixzQkFBeUIsUUFBd0I7QUFBQSxRQUF0QixNQUFzQixTQUF0QixNQUFzQjtBQUFBLFFBQWQsUUFBYyxTQUFkLFFBQWM7O0FBQ25ELFdBQ0k7QUFBQTtBQUFBLFVBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSw2QkFBZjtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSxzQkFBTyxTQUFRLGFBQWY7QUFBOEIsa0NBQUUsc0JBQUY7QUFBOUIsaUJBREo7QUFFSSw0REFBVSxXQUFVLGNBQXBCO0FBQ1Usd0JBQUcsTUFEYjtBQUVVLDJCQUFPLE9BQU8sSUFGeEI7QUFHVSw4QkFBVSxRQUhwQjtBQUlVLGlDQUFhLGNBQUUscUJBQUYsQ0FKdkI7QUFGSjtBQURKO0FBREosS0FESjtBQWVILENBaEJEOztBQWtCQSx1QkFBdUIsU0FBdkIsR0FBbUM7QUFDL0IsWUFBUSxpQkFBVSxNQURhO0FBRS9CLGNBQVUsaUJBQVUsSUFBVixDQUFlO0FBRk0sQ0FBbkM7O0FBTUEsSUFBTSxjQUFjLFNBQWQsV0FBYyxHQUFNO0FBQ3RCLFdBQ0k7QUFBQTtBQUFBLFVBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsYUFBakI7QUFDSSw2REFBTyxNQUFLLE1BQVosRUFBbUIsUUFBTyxTQUExQixHQURKO0FBRUk7QUFBQTtBQUFBO0FBQ0ksNkRBQUcsV0FBVSxjQUFiLEdBREo7QUFFSSxtRUFGSjtBQUdJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFISjtBQUZKO0FBREo7QUFESixTQURKO0FBYUk7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsWUFBakI7QUFDSSw2REFBTyxNQUFLLE1BQVosR0FESjtBQUVJO0FBQUE7QUFBQTtBQUNJLDZEQUFHLFdBQVUsaUJBQWIsR0FESjtBQUVJLG1FQUZKO0FBR0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhKO0FBRko7QUFESjtBQURKO0FBYkosS0FESjtBQTRCSCxDQTdCRDs7QUFnQ0EsSUFBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLFFBQXlCO0FBQUEsUUFBdkIsTUFBdUIsU0FBdkIsTUFBdUI7QUFBQSxRQUFmLFNBQWUsU0FBZixTQUFlOztBQUMvQyxXQUNJO0FBQUE7QUFBQSxVQUFLLFdBQVUsWUFBZjtBQUNDLFNBQUMsd0JBQVksTUFBWixDQUFELEdBQ0c7QUFBQTtBQUFBLGNBQUssTUFBSyxjQUFWLEVBQXlCLFdBQVUsY0FBbkM7QUFDSTtBQUFBO0FBQUEsa0JBQUcsU0FBUyxVQUFVLFlBQXRCLEVBQW9DLFdBQVUsd0JBQTlDO0FBQXdFLDhCQUFFLFFBQUY7QUFBeEU7QUFESixTQURILEdBSUMsRUFMRjtBQU1JO0FBQUE7QUFBQSxjQUFJLFdBQVUsa0NBQWQ7QUFDSTtBQUFBO0FBQUEsa0JBQUksTUFBSyxjQUFULEVBQXdCLFdBQVUsY0FBbEM7QUFDSTtBQUFBO0FBQUEsc0JBQUcsU0FBUyxVQUFVLFFBQXRCLEVBQWdDLFdBQVUscUJBQTFDO0FBQWlFLGtDQUFFLFFBQUY7QUFBakU7QUFESixhQURKO0FBSUk7QUFBQTtBQUFBLGtCQUFJLE1BQUssY0FBVCxFQUF3QixXQUFVLFlBQWxDO0FBQ0k7QUFBQTtBQUFBLHNCQUFHLElBQUcsTUFBTixFQUFhLFNBQVMsVUFBVSxVQUFoQyxFQUE0QyxXQUFVLHdCQUF0RDtBQUFnRixrQ0FBRSxNQUFGO0FBQWhGO0FBREosYUFKSjtBQU9JO0FBQUE7QUFBQSxrQkFBSSxNQUFLLGNBQVQsRUFBd0IsV0FBVSxlQUFsQztBQUNJO0FBQUE7QUFBQSxzQkFBRyxJQUFHLFNBQU4sRUFBZ0IsU0FBUyxVQUFVLFVBQW5DLEVBQStDLFdBQVUsd0JBQXpEO0FBQW1GLGtDQUFFLFNBQUY7QUFBbkY7QUFESixhQVBKO0FBVUk7QUFWSjtBQU5KLEtBREo7QUFxQkgsQ0F0QkQ7O0FBd0JBLGtCQUFrQixTQUFsQixHQUE4QjtBQUMxQixlQUFXLGlCQUFVLE1BQVYsQ0FBaUI7QUFERixDQUE5Qjs7QUFLQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFDLE1BQUQsRUFBWTtBQUM5QjtBQUNBO0FBQ0EsUUFBTSxTQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsZUFBakIsRUFBa0MsUUFBbEMsQ0FBZjtBQUNBLFdBQU8sT0FBTyxNQUFQLENBQWMsVUFBQyxHQUFELEVBQU0sQ0FBTixFQUFZO0FBQUMsZUFBTyxPQUFPLE1BQVAsQ0FBYyxHQUFkLHNCQUFxQixDQUFyQixFQUF5QixPQUFPLENBQVAsQ0FBekIsRUFBUDtBQUE0QyxLQUF2RSxFQUF5RSxFQUF6RSxDQUFQO0FBQ0gsQ0FMRDs7QUFPQSxJQUFNLGVBQWUsU0FBZixZQUFlLENBQUMsTUFBRCxFQUFZO0FBQzdCO0FBQ0EsUUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixNQUFsQixDQUFwQjtBQUNBLFdBQU8sY0FBYyxjQUFkLENBQVA7QUFDQSxXQUFPLGFBQVA7QUFDSCxDQUxEOztJQU9NLFU7OztBQUVGLHdCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFFZjtBQUZlLDZIQUNULEtBRFM7O0FBR2YsZUFBSyxLQUFMLEdBQWEsRUFBQyxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixPQUFLLEtBQUwsQ0FBVyxNQUE3QixDQUFqQixFQUFiO0FBQ0EsZUFBSyxVQUFMLEdBQWtCLE9BQUssVUFBTCxDQUFnQixJQUFoQixRQUFsQjtBQUNBLGVBQUssWUFBTCxHQUFvQixPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsUUFBcEI7QUFDQSxlQUFLLFFBQUwsR0FBZ0IsT0FBSyxRQUFMLENBQWMsSUFBZCxRQUFoQjtBQUNBLGVBQUssUUFBTCxHQUFnQixPQUFLLFFBQUwsQ0FBYyxJQUFkLFFBQWhCO0FBUGU7QUFRbEI7Ozs7aUNBRVEsQyxFQUFHO0FBQ1I7QUFDQSxnQkFBTSxRQUFRLEVBQUUsTUFBRixDQUFTLEVBQXZCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsV0FBckIseUJBQ3FCLGtDQUFPLEtBQUssS0FBTCxDQUFXLE1BQWxCLEVBQTBCLEVBQUMsNEJBQVUsS0FBVixFQUFrQixFQUFFLE1BQUYsQ0FBUyxLQUEzQixDQUFELEVBQTFCLENBRHJCO0FBRUg7OzttQ0FFVTtBQUNQLGlCQUFLLEtBQUwsQ0FBVyxVQUFYO0FBQ0EsZ0JBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxjQUExQjtBQUNBLGdCQUFJLHdCQUFZLE1BQVosQ0FBSixFQUF5QjtBQUNyQixxQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixlQUFyQix5QkFBc0QsT0FBTyxFQUE3RDtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFdBQXJCLHlCQUFrRCxNQUFsRDtBQUNIO0FBQ0o7OzttQ0FFVSxDLEVBQUc7QUFDVixnQkFBSSxTQUFTLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBSyxLQUFMLENBQVcsTUFBN0IsQ0FBYjtBQUNBO0FBQ0EsZ0JBQUksRUFBRSxNQUFGLENBQVMsRUFBVCxJQUFlLFNBQW5CLEVBQThCO0FBQzFCLHVCQUFPLE1BQVA7QUFDSCxhQUZELE1BRU87QUFDSCx1QkFBTyxNQUFQO0FBQ0g7QUFDRCxnQkFBSSxVQUFVLFNBQVYsT0FBVSxDQUFTLElBQVQsRUFBZTtBQUN6QixxQkFBSyxLQUFMLENBQVcsVUFBWDtBQUNBO0FBQ0E7QUFDQSxxQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixlQUFyQix5QkFBc0QsT0FBTyxFQUE3RDtBQUNBLHFCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFdBQXJCLHlCQUFrRCxJQUFsRDtBQUNILGFBTkQ7QUFPQSxnQkFBSSx3QkFBWSxNQUFaLENBQUosRUFBeUI7QUFDckIsb0NBQVEsTUFBUixFQUFnQixpQkFBVSxvQkFBVixFQUFoQixFQUNRLGFBQWEsTUFBYixDQURSLEVBQzhCLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FEOUI7QUFFSCxhQUhELE1BR087QUFDSCxvQ0FBUSxPQUFSLEVBQWlCLGlCQUFVLG1CQUFWLENBQThCLE9BQU8sRUFBckMsQ0FBakIsRUFDUSxjQUFjLE1BQWQsQ0FEUixFQUMrQixRQUFRLElBQVIsQ0FBYSxJQUFiLENBRC9CO0FBRUg7QUFDSjs7O3VDQUVjO0FBQ1gsZ0JBQU0sT0FBTyxFQUFDLElBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUF2QixFQUFiO0FBQ0EsZ0JBQUksVUFBVSxTQUFWLE9BQVUsR0FBVztBQUNyQixxQkFBSyxLQUFMLENBQVcsVUFBWDtBQUNBLHFCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFdBQXJCLHlCQUFrRCxJQUFsRCxFQUF3RCxJQUF4RDtBQUNILGFBSEQ7O0FBS0EsZ0NBQVEsUUFBUixFQUFrQixpQkFBVSxtQkFBVixDQUE4QixLQUFLLEVBQW5DLENBQWxCLEVBQTBELElBQTFELEVBQWdFLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBaEU7QUFDSDs7OzhDQUVxQjtBQUNsQixnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFmLEVBQXVCO0FBQ25CLHVCQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsWUFBbEIsR0FBaUMsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUExRDtBQUNILGFBRkQsTUFFTztBQUNILG9CQUFNLFVBQVUsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixPQUFsQztBQUNBLG9CQUFJLFdBQVcsUUFBUSxNQUFSLEdBQWlCLENBQWhDLEVBQW1DO0FBQy9CLHdCQUFNLFNBQVMsUUFBUSxRQUFRLE1BQVIsR0FBaUIsQ0FBekIsQ0FBZjtBQUNBLDJCQUFPLE9BQU8sWUFBZDtBQUNIO0FBQ0QsdUJBQU8sQ0FBUDtBQUNIO0FBQ0o7OztpQ0FFUTtBQUNMLGdCQUFNLGNBQWMsV0FBVyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLElBQWxCLEdBQXlCLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsSUFBM0MsR0FBa0QsQ0FBN0QsQ0FBcEI7QUFDQSxnQkFBTSxxQkFBcUIsMEJBQWMsS0FBSyxtQkFBTCxLQUE2QixXQUEzQyxDQUEzQjtBQUNBLG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGtCQUFmO0FBQ0k7QUFBQTtBQUFBLHNCQUFLLFdBQVUsNkNBQWY7QUFDSSxrREFBQyxNQUFELElBQVEsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUEzQixHQURKO0FBRUksa0RBQUMsZ0JBQUQ7QUFDSSxrQ0FBVSxLQUFLLFFBRG5CO0FBRUksZ0NBQVEsS0FBSyxLQUFMLENBQVcsTUFGdkI7QUFHSSw0Q0FBb0Isa0JBSHhCLEdBRko7QUFNSSxrREFBQyxzQkFBRDtBQUNJLGtDQUFVLEtBQUssUUFEbkI7QUFFSSxnQ0FBUSxLQUFLLEtBQUwsQ0FBVyxNQUZ2QixHQU5KO0FBU0ksa0RBQUMsV0FBRCxPQVRKO0FBVUksa0RBQUMsaUJBQUQ7QUFDSSxnQ0FBUSxLQUFLLEtBQUwsQ0FBVyxNQUR2QjtBQUVJLG1DQUFXO0FBQ1Asd0NBQVksS0FBSyxVQURWO0FBRVAsMENBQWMsS0FBSyxZQUZaO0FBR1Asc0NBQVUsS0FBSyxRQUhSLEVBRmY7QUFWSjtBQURKLGFBREo7QUFxQkg7Ozs7RUFwR29CLGdCQUFNLFM7O0FBdUcvQixXQUFXLFNBQVgsR0FBdUI7QUFDbkIsZUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBRFQ7QUFFbkIsZ0JBQVksaUJBQVUsSUFBVixDQUFlLFVBRlI7QUFHbkIsWUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBSE47QUFJbkIsWUFBUSxpQkFBVTtBQUpDLENBQXZCOztBQU9BLElBQUksY0FBYyxDQUFsQjs7SUFFYSxlLFdBQUEsZTs7O0FBQ1QsNkJBQWEsS0FBYixFQUFvQjtBQUFBOztBQUFBLHVJQUNWLEtBRFU7O0FBRWhCLGVBQUssU0FBTCxHQUFpQixPQUFLLFNBQUwsQ0FBZSxJQUFmLFFBQWpCO0FBRmdCO0FBR25COzs7O29DQUVXO0FBQ1IsZ0JBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFdBQXJCLEVBQWI7QUFDQSxnQkFBTSxjQUFZLFdBQWxCO0FBQ0EsZ0JBQU0sT0FBTztBQUNULG9CQUFJLEVBREs7QUFFVCx3QkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBRmpCO0FBR1QsOEJBQWMsSUFITDtBQUlULHNCQUFNLEtBQUssRUFKRjtBQUtULHNCQUFNLENBTEc7QUFNVCxzQkFBTSxFQU5HO0FBT1QsK0JBQWUsSUFQTjtBQVFUO0FBUlMsYUFBYjtBQVVBLGlCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFdBQXJCLENBQWlDLEVBQWpDLEVBQXFDLElBQXJDO0FBQ0EsMkJBQWUsQ0FBZjtBQUNIOzs7aUNBRVE7QUFDTCxtQkFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsMEJBQUcsU0FBUyxLQUFLLFNBQWpCO0FBQ0csdUNBQVcsd0JBRGQ7QUFFRyxtQ0FBTyxFQUFDLFFBQVEsYUFBVCxFQUZWO0FBR0ksNkRBQUcsV0FBVSxZQUFiLEdBSEo7QUFJSyxzQ0FBRSxZQUFGO0FBSkw7QUFESjtBQURKLGFBREo7QUFZSDs7OztFQXBDZ0MsZ0JBQU0sUzs7QUF1QzNDLGdCQUFnQixTQUFoQixHQUE0QjtBQUN4QixlQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFESjtBQUV4QixZQUFRLGlCQUFVO0FBRk0sQ0FBNUI7Ozs7Ozs7O0FDemFBOzs7Ozs7O0FBT087QUFDSDtBQUNBLDRDQUFrQixHQUZmO0FBQUEsSUFHSCxnREFBb0IsR0FIakI7QUFBQSxJQUlILG9EQUFzQixHQUpuQjtBQUFBLElBS0gsc0RBQXVCLEdBTHBCO0FBQUEsSUFNSCxzREFBdUIsR0FOcEI7QUFBQSxJQVNILDRDQUFrQixTQVRmO0FBQUEsSUFVSCxrREFBcUIsWUFWbEI7QUFBQSxJQVdILDRDQUFrQixTQVhmO0FBQUEsSUFZSCw0Q0FBa0IsU0FaZjtBQUFBLElBYUgsOENBQW1CLFVBYmhCO0FBQUEsSUFjSCx3Q0FBZ0IsT0FkYjs7Ozs7Ozs7O1FDTVMsVyxHQUFBLFc7UUFpQkEsUyxHQUFBLFM7UUFlQSxPLEdBQUEsTztRQTBFQSxhLEdBQUEsYTtRQWVBLEMsR0FBQSxDOztBQTlIaEI7Ozs7OztBQUdBLElBQUksZUFBSixDLENBWEE7Ozs7Ozs7QUFhTyxTQUFTLFdBQVQsQ0FBcUIsVUFBckIsRUFBaUM7QUFDcEM7QUFDQSxRQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1QsaUJBQVMsS0FBSyxLQUFMLENBQVcsU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLFNBQWpELENBQVQ7QUFDSDtBQUNELFFBQUksVUFBSixFQUFnQjtBQUNaLFlBQU0sU0FBUyxPQUFmO0FBQ0EsWUFBTSxPQUFPLElBQUksSUFBSixDQUFTLFdBQVcsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixFQUF5QixPQUF6QixDQUFpQyxHQUFqQyxFQUFzQyxJQUF0QyxDQUFULENBQWI7QUFDQSxZQUFNLE1BQU0sS0FBSyxVQUFMLEVBQVo7QUFDQSxZQUFNLFFBQVEsT0FBTyxLQUFLLFdBQUwsRUFBUCxDQUFkO0FBQ0EsWUFBTSxPQUFPLEtBQUssY0FBTCxFQUFiO0FBQ0EsZUFBTyxNQUFNLEdBQU4sR0FBWSxLQUFaLEdBQW9CLEdBQXBCLEdBQTBCLElBQWpDO0FBQ0g7QUFDRCxXQUFPLGNBQVA7QUFDSDs7QUFHTSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDNUIsUUFBSSxjQUFjLElBQWxCO0FBQ0EsUUFBSSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxNQUFULEtBQW9CLEVBQTNDLEVBQStDO0FBQzNDLFlBQUksVUFBVSxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBZDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGdCQUFJLFNBQVMsUUFBUSxDQUFSLEVBQVcsSUFBWCxFQUFiO0FBQ0EsZ0JBQUksT0FBTyxTQUFQLENBQWlCLENBQWpCLEVBQW9CLEtBQUssTUFBTCxHQUFjLENBQWxDLEtBQXlDLE9BQU8sR0FBcEQsRUFBMEQ7QUFDdEQsOEJBQWMsbUJBQW1CLE9BQU8sU0FBUCxDQUFpQixLQUFLLE1BQUwsR0FBYyxDQUEvQixDQUFuQixDQUFkO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRCxXQUFPLFdBQVA7QUFDSDs7QUFFTSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEIsSUFBOUIsRUFBb0MsUUFBcEMsRUFBOEMsT0FBOUMsRUFBdUQ7QUFDMUQsYUFBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLEdBQXhCLEVBQTZCLElBQTdCLEVBQWtDO0FBQzlCLGVBQU8sK0JBQU0sR0FBTixFQUFXO0FBQ2QseUJBQWEsYUFEQztBQUVkLG9CQUFRLE1BRk07QUFHZCxxQkFBUztBQUNMLGdDQUFnQixrQkFEWDtBQUVMLCtCQUFlLFVBQVUsV0FBVjtBQUZWLGFBSEs7QUFPZCxrQkFBTSxLQUFLLFNBQUwsQ0FBZSxJQUFmO0FBUFEsU0FBWCxDQUFQO0FBU0g7O0FBRUQsUUFBSSxnQkFBSjtBQUNBLFlBQVEsTUFBUjtBQUNJLGFBQUssS0FBTDtBQUNJLHNCQUFVO0FBQUEsdUJBQU0sK0JBQU0sR0FBTixFQUFXO0FBQ3ZCLGlDQUFhLGFBRFU7QUFFdkIsNEJBQVEsS0FGZTtBQUd2Qiw2QkFBUyxFQUFDLGdCQUFnQixrQkFBakI7QUFIYyxpQkFBWCxDQUFOO0FBQUEsYUFBVjtBQUtBOztBQUVKLGFBQUssTUFBTDtBQUNJLHNCQUFVO0FBQUEsdUJBQU0sT0FBTyxNQUFQLEVBQWUsR0FBZixFQUFvQixJQUFwQixDQUFOO0FBQUEsYUFBVjtBQUNBOztBQUVKLGFBQUssS0FBTDtBQUNJLHNCQUFVO0FBQUEsdUJBQU0sT0FBTyxLQUFQLEVBQWMsR0FBZCxFQUFtQixJQUFuQixDQUFOO0FBQUEsYUFBVjtBQUNBOztBQUVKLGFBQUssT0FBTDtBQUNJLHNCQUFVO0FBQUEsdUJBQU0sT0FBTyxPQUFQLEVBQWdCLEdBQWhCLEVBQXFCLElBQXJCLENBQU47QUFBQSxhQUFWO0FBQ0E7O0FBRUosYUFBSyxRQUFMO0FBQ0ksc0JBQVU7QUFBQSx1QkFBTSwrQkFBTSxHQUFOLEVBQVc7QUFDdkIsaUNBQWEsYUFEVTtBQUV2Qiw0QkFBUSxRQUZlO0FBR3ZCLDZCQUFTO0FBQ0wsd0NBQWdCLGtCQURYO0FBRUwsdUNBQWUsVUFBVSxXQUFWO0FBRlY7QUFIYyxpQkFBWCxDQUFOO0FBQUEsYUFBVjtBQVFBO0FBOUJSO0FBZ0NBO0FBQ0k7QUFESixLQUVLLElBRkwsQ0FFVSxVQUFTLFFBQVQsRUFBbUI7QUFDckIsWUFBSSxTQUFTLE1BQVQsSUFBbUIsR0FBdkIsRUFDSSxPQUFPLFNBQVMsSUFBVCxFQUFQLENBREosS0FHSSxPQUFPLFFBQVA7QUFDUCxLQVBMLEVBT08sSUFQUCxDQU9ZLFFBUFo7QUFRSDs7QUFHRDtBQUNBO0FBQ08sSUFBTSxnQ0FBWTtBQUNqQixjQUFVLGdCQUFDLEVBQUQ7QUFBQSxvQ0FBMkIsRUFBM0I7QUFBQSxLQURPO0FBRWpCLGVBQVcsaUJBQUMsRUFBRDtBQUFBLHlEQUFnRCxFQUFoRDtBQUFBLEtBRk07QUFHakIsa0JBQWMsb0JBQUMsRUFBRDtBQUFBLG9FQUEyRCxFQUEzRDtBQUFBLEtBSEc7QUFJakIsZUFBVyxpQkFBQyxFQUFEO0FBQUEsc0ZBQTZFLEVBQTdFO0FBQUEsS0FKTTtBQUtqQixlQUFXLGlCQUFDLEVBQUQ7QUFBQSxtR0FBMEYsRUFBMUY7QUFBQSxLQUxNO0FBTWpCLGdCQUFZLGtCQUFDLEVBQUQ7QUFBQSxpSEFBd0csRUFBeEc7QUFBQSxLQU5LO0FBT2pCLGNBQVUsZ0JBQUMsRUFBRDtBQUFBLDhDQUFxQyxFQUFyQztBQUFBLEtBUE87QUFRakIsMkJBQXVCLDZCQUFDLEVBQUQ7QUFBQSw2REFBb0QsRUFBcEQ7QUFBQSxLQVJOO0FBU2pCLDRCQUF3QjtBQUFBO0FBQUEsS0FUUDtBQVVqQixZQUFRLGNBQUMsRUFBRDtBQUFBLGtDQUF5QixFQUF6QjtBQUFBLEtBVlM7QUFXakIsb0JBQWdCLHNCQUFDLEVBQUQ7QUFBQSw4REFBcUQsRUFBckQ7QUFBQSxLQVhDO0FBWWpCLG1CQUFlLHFCQUFDLEVBQUQ7QUFBQSxtREFBMEMsRUFBMUM7QUFBQTtBQVpFLENBQWxCOztBQWVBLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUN4QztBQUNBLFFBQUksaUJBQWlCLFNBQWpCLElBQThCLGlCQUFpQixJQUFuRCxFQUF5RDtBQUNyRCxZQUFJLFNBQVMsT0FBYjtBQUNBLFlBQUksUUFBUSxXQUFXLFlBQVgsQ0FBWjtBQUNBLFlBQUksQ0FBQyxNQUFNLEtBQU4sQ0FBTCxFQUFtQjtBQUNmLG1CQUFPLE1BQU0sY0FBTixDQUFxQixNQUFyQixDQUFQO0FBQ0g7QUFDSjtBQUNELFdBQU8sRUFBUDtBQUNIOztBQUVELElBQUksZ0JBQUo7O0FBRUE7QUFDTyxTQUFTLENBQVQsQ0FBVyxDQUFYLEVBQWM7QUFDakIsUUFBSSxDQUFDLE9BQUwsRUFBYztBQUNWLGtCQUFVLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkMsU0FBeEQsQ0FBVjtBQUNIO0FBQ0QsV0FBTyxRQUFRLENBQVIsQ0FBUDtBQUNIOztBQUVNLElBQU0sb0NBQWMsU0FBZCxXQUFjLENBQUMsTUFBRCxFQUFZO0FBQUMsV0FBTyxPQUFPLEVBQVAsQ0FBVSxRQUFWLEdBQXFCLE1BQXJCLENBQTRCLENBQTVCLEVBQStCLENBQS9CLE1BQXNDLE1BQTdDO0FBQW9ELENBQXJGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IFJlc3VsdHMgZnJvbSAnLi9SZXN1bHRzLmpzeCc7XG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50c30gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCB1c2VySUQgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKS51c2VySUQ7XG4gICAgICAgIGNvbnN0IHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHRzRGF0YVRyZWU6IFtdLFxuICAgICAgICAgICAgcHJvamVjdDoge2lkOiBwcm9qZWN0SWRzLnByb2plY3RfaWR9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgdXBkYXRlcyBKU09OXG4gICAgICAgICAgICBkYXRhLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnMgPSBbZGF0YS5vcmdhbmlzYXRpb25dO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWxzOiB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHskbWVyZ2U6IHt1c2VyOiBkYXRhfX0pfSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEdldCBpbmZvIG9uIHRoZSBjdXJyZW50IHVzZXIuIFVzZWQgd2hlbiBwb3N0aW5nIGRhdGEsIGUuZy4gdXBkYXRlc1xuICAgICAgICAvLyBUT0RPOiBUaGlzIG1pZ2h0IG5vdCBiZSB0aGUgYmVzdCBwbGFjZSB0byBsb2FkIHVzZXIgZGF0YVxuICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludHMudXNlcih1c2VySUQpLCAnJywgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbCgncmVzdWx0cycpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnaW5kaWNhdG9ycycpO1xuICAgIH1cblxuICAgIGxvYWRNb2RlbChtb2RlbCkge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJLiBBZnRlciBsb2FkaW5nIHJlYnVpbGQgdGhlIGRhdGEgdHJlZS5cbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgICAgICAgICAge21vZGVsczogdXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXTogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfX1cbiAgICAgICAgICAgICAgICAgICAgKX0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzW21vZGVsXSh0aGlzLnN0YXRlLnByb2plY3QuaWQpLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG5ld1N0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRlbGV0ZUZyb21Nb2RlbChtb2RlbCwgaWQpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgLy8gU2luY2Ugd2Ugc2hvdWxkbid0IGVkaXQgdGhlIHN0YXRlIG9iamVjdCBkaXJlY3RseSB3ZSBoYXZlIHRvIG1ha2UgYSAoc2hhbGxvdykgY29weVxuICAgICAgICAvLyBhbmQgZGVsZXRlIGZyb20gdGhlIGNvcHkuIFRPRE86IHRoaW5rIGhhcmQgaWYgdGhpcyBjYW4gbGVhZCB0byB0cm91YmxlLi4uXG4gICAgICAgIGNvbnN0IG5ld01vZGVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKTtcbiAgICAgICAgZGVsZXRlIG5ld01vZGVsW2lkXTtcbiAgICAgICAgbmV3U3RhdGUgPSB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHtbbW9kZWxdOiB7JHNldDogbmV3TW9kZWx9fSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjdXJyZW50VXNlcigpIHtcbiAgICAgICAgLy9UT0RPOiBpZiBsb2FkaW5nIG9mIHVzZXIgZGF0YSBmYWlscyB3ZSBoYXZlIGEgcHJvYmxlbS4uLlxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbHMudXNlcjtcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgLy8gVHVybiB0aGUgaW5kZXhlZCBtb2RlbCBiYWNrIHRvIGEgbGlzdCBvZiBtb2RlbCBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIHRyZWUgb2YgbW9kZWxzIGZyb20gdGhlIGxvd2VzdCBsZXZlbCAoQ29tbWVudCkgYW5kIHVwIHRvIFJlc3VsdFxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IFwiY29tbWVudHNcIn0sXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5jb21tZW50cylcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwZXJpb2RzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5wZXJpb2RzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicGVyaW9kXCIsIGNoaWxkcmVuOiBcInVwZGF0ZXNcIn0sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGVkX3BlcmlvZHMgPSBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcyk7XG5cbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogXCJwZXJpb2RzXCJ9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBcImluZGljYXRvcnNcIn0sXG4gICAgICAgICAgICBpbmRpY2F0b3JzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMuc3RhdGUucmVzdWx0c0RhdGFUcmVlO1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBsb2FkTW9kZWw6IHRoaXMubG9hZE1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICB1cGRhdGVNb2RlbDogdGhpcy51cGRhdGVNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZGVsZXRlRnJvbU1vZGVsOiB0aGlzLmRlbGV0ZUZyb21Nb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY3VycmVudFVzZXI6IHRoaXMuY3VycmVudFVzZXIuYmluZCh0aGlzKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoISB0aGlzLnN0YXRlLm1vZGVscy5yZXN1bHRzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHRyZWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8UmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17dHJlZX1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtjYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN1bHRzLWZyYW1ld29yaycpKTtcbn0pOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnRzIGV4dGVuZHMgTGV2ZWwge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJjb21tZW50c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChjb21tZW50KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXtjb21tZW50LmNvbW1lbnR9IGtleT17Y29tbWVudC5pZH0+XG4gICAgICAgICAgICAgICAgPGRpdj5CeToge2NvbW1lbnQudXNlcl9kZXRhaWxzLmZpcnN0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPExldmVsIGl0ZW1zPXt0aGlzLnByb3BzLml0ZW1zfSByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5Db21tZW50cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCc7XG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4JztcblxuaW1wb3J0IHtffWZyb20gJy4vdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGljYXRvcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogXCJpbmRpY2F0b3JzXCJ9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MubG9hZE1vZGVsKCdwZXJpb2RzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoaW5kaWNhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17XCJJbmRpY2F0b3I6IFwiICsgdGl0bGV9IGtleT17aW5kaWNhdG9yLmlkfT5cbiAgICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXllYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdiYXNlbGluZV95ZWFyJyl9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3llYXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhc2VsaW5lLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnYmFzZWxpbmVfdmFsdWUnKX06IHtpbmRpY2F0b3IuYmFzZWxpbmVfdmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCBpdGVtcz17dGhpcy5wcm9wcy5pdGVtc30gcmVuZGVyUGFuZWw9e3RoaXMucmVuZGVyUGFuZWwuYmluZCh0aGlzKX0vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuSW5kaWNhdG9ycy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29sbGFwc2UsIHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgdGhpcy5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9kZWJ1Z0lEICsgXCIgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2U+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IHRoaXMucHJvcHMucmVuZGVyUGFuZWwoaXRlbSkpfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkxldmVsLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIHJlbmRlclBhbmVsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5cbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9MZXZlbC5qc3hcIjtcbmltcG9ydCB7VXBkYXRlcywgTmV3VXBkYXRlQnV0dG9ufSBmcm9tIFwiLi9VcGRhdGVzLmpzeFwiO1xuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5cbmNsYXNzIFBlcmlvZExvY2tUb2dnbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubG9ja1RvZ2dsZSA9IHRoaXMubG9ja1RvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2xvY2tpbmc6IGZhbHNlfTtcbiAgICB9XG5cbiAgICBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRzLnBlcmlvZChwZXJpb2RJZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJwZXJpb2RzXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsOiBcInBlcmlvZHNcIixcbiAgICAgICAgICAgIGFjdGl2ZUtleTogW10gLy8gS2VlcCB0cmFjayBvZiBvcGVuIHVwZGF0ZSBwYW5lbHNcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vcGVuTmV3Rm9ybSA9IHRoaXMub3Blbk5ld0Zvcm0uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGFjdGl2ZUtleSkge1xuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIG9wZW4gcGFuZWxzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleX0pO1xuICAgIH1cblxuICAgIG9wZW5OZXdGb3JtKG5ld0tleSwgZGF0YSkge1xuICAgICAgICAvLyBBZGQgdGhlIGtleSBmb3IgYSBuZXcgdXBkYXRlIHRvIHRoZSBsaXN0IG9mIG9wZW4gcGFuZWxzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7YWN0aXZlS2V5OiB1cGRhdGUodGhpcy5zdGF0ZS5hY3RpdmVLZXksIHskcHVzaDogW25ld0tleV19KX0sXG4gICAgICAgICAgICAvLyBPbmx5IHdoZW4gdGhlIGFjdGl2ZUtleSBzdGF0ZSBpcyBjb21taXR0ZWQgZG8gd2UgdXBkYXRlIHRoZSB1cGRhdGVzIG1vZGVsXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbCgndXBkYXRlcycsIGRhdGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZFN0YXJ0ID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCk7XG4gICAgICAgIGNvbnN0IHBlcmlvZEVuZCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGAke3BlcmlvZFN0YXJ0fSAtICR7cGVyaW9kRW5kfWA7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICBQZXJpb2Q6IHtwZXJpb2REYXRlfSB8XG4gICAgICAgICAgICAgICAgICAgIFRhcmdldCB2YWx1ZToge3BlcmlvZC50YXJnZXRfdmFsdWV9IHxcbiAgICAgICAgICAgICAgICAgICAgQWN0dWFsIHZhbHVlOiB7cGVyaW9kQWN0dWFsVmFsdWUocGVyaW9kKX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFBlcmlvZExvY2tUb2dnbGUgcGVyaW9kPXtwZXJpb2R9IGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdXBkYXRlQ2FsbGJhY2tzID0gdXBkYXRlKHRoaXMucHJvcHMuY2FsbGJhY2tzLCB7JG1lcmdlOiB7b25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9fSk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNhbGxiYWNrcyA9IHVwZGF0ZSh0aGlzLnByb3BzLmNhbGxiYWNrcywgeyRtZXJnZToge29wZW5OZXdGb3JtOiB0aGlzLm9wZW5OZXdGb3JtfX0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e3BlcmlvZC5pZH0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt1cGRhdGVDYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5PXt0aGlzLnN0YXRlLmFjdGl2ZUtleX0vPlxuICAgICAgICAgICAgICAgIDxOZXdVcGRhdGVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtidXR0b25DYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPExldmVsIGl0ZW1zPXt0aGlzLnByb3BzLml0ZW1zfSByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5QZXJpb2RzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtyZXN1bHQuaWR9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCBpdGVtcz17dGhpcy5wcm9wcy5pdGVtc30gcmVuZGVyUGFuZWw9e3RoaXMucmVuZGVyUGFuZWwuYmluZCh0aGlzKX0vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVzdWx0cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4JztcblxuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHMsIGRpc3BsYXlEYXRlLCBkaXNwbGF5TnVtYmVyLCBfLCBjdXJyZW50VXNlciwgaXNOZXdVcGRhdGV9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtTVEFUVVNfRFJBRlRfQ09ERSwgU1RBVFVTX0FQUFJPVkVEX0NPREUsIE9CSkVDVFNfVVBEQVRFU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0KX0gfFxuICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgT3JnOiB7dXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWV9IHxcbiAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuZm9ybVRvZ2dsZSA9IHRoaXMuZm9ybVRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2Zvcm1PcGVuOiBpc05ld1VwZGF0ZShwcm9wcy51cGRhdGUpfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdlZGl0X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5leHBvcnQgY2xhc3MgVXBkYXRlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBEYXRhOiAke3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtfKCd1cGRhdGVfc3RhdHVzZXMnKVt1cGRhdGUuc3RhdHVzXX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXt1cGRhdGUuaWR9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgdGhpcy5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9kZWJ1Z0lEICsgXCIgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2Ugb25DaGFuZ2U9e3RoaXMucHJvcHMuY2FsbGJhY2tzLm9uQ2hhbmdlfSBhY3RpdmVLZXk9e3RoaXMucHJvcHMuYWN0aXZlS2V5fT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblVwZGF0ZXMucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG59O1xuXG5cbmNvbnN0IEhlYWRlciA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVJbnB1dCA9ICh7dXBkYXRlLCB1cGRhdGVkQWN0dWFsVmFsdWUsIG9uQ2hhbmdlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhY3R1YWxWYWx1ZVwiPntfKCdhZGRfdG9fYWN0dWFsX3ZhbHVlJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJkYXRhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdpbnB1dF9wbGFjZWhvbGRlcicpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cEFjdHVhbFZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtfKCd0b3RhbF92YWx1ZV9hZnRlcl91cGRhdGUnKX06XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dXBkYXRlZEFjdHVhbFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlZEFjdHVhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlRGVzY3JpcHRpb24gPSAoe3VwZGF0ZSwgb25DaGFuZ2V9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTkgdXBkYXRlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPntfKCdhY3R1YWxfdmFsdWVfY29tbWVudCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1cGRhdGUudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdjb21tZW50X3BsYWNlaG9sZGVyJyl9PlxuICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlRGVzY3JpcHRpb24ucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7dXBkYXRlLCBjYWxsYmFja3N9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51QWN0aW9uXCI+XG4gICAgICAgIHshaXNOZXdVcGRhdGUodXBkYXRlKSA/XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJyZW1vdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3MuZGVsZXRlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2RlbGV0ZScpfTwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA6ICcnfVxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdi1waWxscyBib3R0b21Sb3cgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJjYW5jZWxVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLm9uQ2FuY2VsfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e18oJ2NhbmNlbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNhdmVcIiBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdzYXZlJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGlkPVwiYXBwcm92ZVwiIG9uQ2xpY2s9e2NhbGxiYWNrcy5zYXZlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2FwcHJvdmUnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVGb3JtQnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgcHJ1bmVGb3JQQVRDSCA9ICh1cGRhdGUpID0+IHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGxpc3RlZCBmaWVsZHMgd2hlbiBQQVRDSGluZyBhbiB1cGRhdGVcbiAgICAvLyBjdXJyZW50bHkgdGhlIGxpc3QgbWltaWNzIHRoZSBvbGQgTXlSZXN1bHRzIGRhdGFcbiAgICBjb25zdCBmaWVsZHMgPSBbJ2RhdGEnLCAndGV4dCcsICdyZWxhdGl2ZV9kYXRhJywgJ3N0YXR1cyddO1xuICAgIHJldHVybiBmaWVsZHMucmVkdWNlKChhY2MsIGYpID0+IHtyZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtbZl06IHVwZGF0ZVtmXX0pfSwge30pO1xufTtcblxuY29uc3QgcHJ1bmVGb3JQT1NUID0gKHVwZGF0ZSkgPT4ge1xuICAgIC8vIE9ubHkgaW5jbHVkZSB0aGUgbGlzdGVkIGZpZWxkcyB3aGVuIFBPU1RpbmcgYW4gdXBkYXRlXG4gICAgbGV0IHVwZGF0ZUZvclBPU1QgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGUpO1xuICAgIGRlbGV0ZSB1cGRhdGVGb3JQT1NUWyd1c2VyX2RldGFpbHMnXTtcbiAgICByZXR1cm4gdXBkYXRlRm9yUE9TVDtcbn07XG5cbmNsYXNzIFVwZGF0ZUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAvLyBTYXZlIG9yaWdpbmFsIHVwZGF0ZVxuICAgICAgICB0aGlzLnN0YXRlID0ge29yaWdpbmFsVXBkYXRlOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnVwZGF0ZSl9O1xuICAgICAgICB0aGlzLnNhdmVVcGRhdGUgPSB0aGlzLnNhdmVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGVVcGRhdGUgPSB0aGlzLmRlbGV0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgZm9ybSBmaWVsZCB3aWRnZXRzIGNoYW5nZSwgbW9kaWZ5IHRoZSBtb2RlbCBkYXRhIGluIEFwcC5zdGF0ZVttb2RlbF1cbiAgICAgICAgY29uc3QgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXG4gICAgICAgICAgICBPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZSh0aGlzLnByb3BzLnVwZGF0ZSwgeyRtZXJnZToge1tmaWVsZF06IGUudGFyZ2V0LnZhbHVlfX0pKTtcbiAgICB9XG5cbiAgICBvbkNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuc3RhdGUub3JpZ2luYWxVcGRhdGU7XG4gICAgICAgIGlmIChpc05ld1VwZGF0ZSh1cGRhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5kZWxldGVGcm9tTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUuaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZVVwZGF0ZShlKSB7XG4gICAgICAgIGxldCB1cGRhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnVwZGF0ZSk7XG4gICAgICAgIC8vIEFsbCBjaGFuZ2VzIHRvIGFuIHVwZGF0ZSByZXZlcnQgaXQgdG8gZHJhZnQgdW5sZXNzIGl0IGlzIGV4cGxpY2l0bHkgYXBwcm92ZWQgd2hpbGUgc2F2aW5nXG4gICAgICAgIGlmIChlLnRhcmdldC5pZCA9PSAnYXBwcm92ZScpIHtcbiAgICAgICAgICAgIHVwZGF0ZS5zdGF0dXMgPSBTVEFUVVNfQVBQUk9WRURfQ09ERTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZS5zdGF0dXMgPSBTVEFUVVNfRFJBRlRfQ09ERTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICAgICAgLy8gQWx3YXlzIHNhdmUgdGhlIGluc3RhbmNlIHVzaW5nIGRhdGEgY29taW5nIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgICAgICAgIC8vIFRPRE86IGxvb2sgYXQgaGF2aW5nIGEgcmVwbGFjZU1vZGVsIG1ldGhvZD9cbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmRlbGV0ZUZyb21Nb2RlbChPQkpFQ1RTX1VQREFURVMsIHVwZGF0ZS5pZCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoaXNOZXdVcGRhdGUodXBkYXRlKSkge1xuICAgICAgICAgICAgQVBJQ2FsbCgnUE9TVCcsIGVuZHBvaW50cy51cGRhdGVzX2FuZF9jb21tZW50cygpLFxuICAgICAgICAgICAgICAgICAgICBwcnVuZUZvclBPU1QodXBkYXRlKSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModXBkYXRlLmlkKSxcbiAgICAgICAgICAgICAgICAgICAgcHJ1bmVGb3JQQVRDSCh1cGRhdGUpLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlVXBkYXRlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge2lkOiB0aGlzLnByb3BzLnVwZGF0ZS5pZH07XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgZGF0YSwgdHJ1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgQVBJQ2FsbCgnREVMRVRFJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHMoZGF0YS5pZCksIG51bGwsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNBY3R1YWxWYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudXBkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy51cGRhdGUuYWN0dWFsX3ZhbHVlIC0gdGhpcy5wcm9wcy51cGRhdGUuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLnByb3BzLnBlcmlvZC51cGRhdGVzO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZXMgJiYgdXBkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXBkYXRlc1t1cGRhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXRlc3QuYWN0dWFsX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLnByb3BzLnVwZGF0ZS5kYXRhID8gdGhpcy5wcm9wcy51cGRhdGUuZGF0YSA6IDApO1xuICAgICAgICBjb25zdCB1cGRhdGVkQWN0dWFsVmFsdWUgPSBkaXNwbGF5TnVtYmVyKHRoaXMucHJldmlvdXNBY3R1YWxWYWx1ZSgpICsgdXBkYXRlVmFsdWUpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lciBlZGl0LWluLXByb2dyZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXIgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEFjdHVhbFZhbHVlPXt1cGRhdGVkQWN0dWFsVmFsdWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QXR0YWNobWVudHMvPlxuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybUJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlVXBkYXRlOiB0aGlzLmRlbGV0ZVVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5vbkNhbmNlbH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGVGb3JtLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBmb3JtVG9nZ2xlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcblxubGV0IG5ld1VwZGF0ZUlEID0gMTtcblxuZXhwb3J0IGNsYXNzIE5ld1VwZGF0ZUJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5uZXdVcGRhdGUgPSB0aGlzLm5ld1VwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG5ld1VwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMucHJvcHMuY2FsbGJhY2tzLmN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGNvbnN0IGlkID0gYG5ldy0ke25ld1VwZGF0ZUlEfWA7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBwZXJpb2Q6IHRoaXMucHJvcHMucGVyaW9kLmlkLFxuICAgICAgICAgICAgdXNlcl9kZXRhaWxzOiB1c2VyLFxuICAgICAgICAgICAgdXNlcjogdXNlci5pZCxcbiAgICAgICAgICAgIGRhdGE6IDAsXG4gICAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgICAgIHJlbGF0aXZlX2RhdGE6IHRydWUsXG4gICAgICAgICAgICBzdGF0dXM6IFNUQVRVU19EUkFGVF9DT0RFXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLm9wZW5OZXdGb3JtKGlkLCBkYXRhKTtcbiAgICAgICAgbmV3VXBkYXRlSUQgKz0gMTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubmV3VXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtcGx1cycgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCduZXdfdXBkYXRlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5OZXdVcGRhdGVCdXR0b24ucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuZXhwb3J0IGNvbnN0XG4gICAgLy8gRnJvbSByc3IubW9kZWxzLmluZGljYXRvci5JbmRpY2F0b3JQZXJpb2REYXRhXG4gICAgU1RBVFVTX05FV19DT0RFID0gJ04nLFxuICAgIFNUQVRVU19EUkFGVF9DT0RFID0gJ0QnLFxuICAgIFNUQVRVU19QRU5ESU5HX0NPREUgPSAnUCcsXG4gICAgU1RBVFVTX1JFVklTSU9OX0NPREUgPSAnUicsXG4gICAgU1RBVFVTX0FQUFJPVkVEX0NPREUgPSAnQScsXG5cblxuICAgIE9CSkVDVFNfUkVTVUxUUyA9ICdyZXN1bHRzJyxcbiAgICBPQkpFQ1RTX0lORElDQVRPUlMgPSAnaW5kaWNhdG9ycycsXG4gICAgT0JKRUNUU19QRVJJT0RTID0gJ3BlcmlvZHMnLFxuICAgIE9CSkVDVFNfVVBEQVRFUyA9ICd1cGRhdGVzJyxcbiAgICBPQkpFQ1RTX0NPTU1FTlRTID0gJ2NvbW1lbnRzJyxcbiAgICBPQkpFQ1RTX1VTRVJTID0gJ3VzZXJzJztcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxubGV0IG1vbnRocztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmICghbW9udGhzKSB7XG4gICAgICAgIG1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIH1cbiAgICBpZiAoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IG1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwNClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG59XG5cblxuLy8gT2JqZWN0IGhvbGRzIGNhbGxiYWNrIFVSTCBmdW5jdGlvbnMgYXMgdmFsdWVzLCBtb3N0IG9mIHRoZW0gY2FsbGVkIHdpdGggYW4gaWQgcGFyYW1ldGVyXG4vLyBVc2FnZTogZW5kcG9pbnRzLnJlc3VsdCgxNykgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgICAgICBcInJlc3VsdFwiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJyZXN1bHRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiaW5kaWNhdG9yc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwidXBkYXRlc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImNvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOdW1iZXIobnVtYmVyU3RyaW5nKSB7XG4gICAgLy8gQWRkIGNvbW1hcyB0byBudW1iZXJzIG9mIDEwMDAgb3IgaGlnaGVyLlxuICAgIGlmIChudW1iZXJTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBudW1iZXJTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgdmFyIGZsb2F0ID0gcGFyc2VGbG9hdChudW1iZXJTdHJpbmcpO1xuICAgICAgICBpZiAoIWlzTmFOKGZsb2F0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsb2F0LnRvTG9jYWxlU3RyaW5nKGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG5sZXQgc3RyaW5ncztcblxuLy8gVHJhbnNsYXRpb24gYSBsYSBweXRob24uIExldCdzIGhvcGUgd2UgbmV2ZXIgbmVlZCBsb2Rhc2guLi5cbmV4cG9ydCBmdW5jdGlvbiBfKHMpIHtcbiAgICBpZiAoIXN0cmluZ3MpIHtcbiAgICAgICAgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ3Nbc107XG59XG5cbmV4cG9ydCBjb25zdCBpc05ld1VwZGF0ZSA9ICh1cGRhdGUpID0+IHtyZXR1cm4gdXBkYXRlLmlkLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDQpID09PSAnbmV3LSd9O1xuIl19
