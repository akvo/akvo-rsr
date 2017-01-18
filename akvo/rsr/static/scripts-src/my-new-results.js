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

},{"./Level.jsx":4,"./Periods.jsx":5,"./utils":8,"rc-collapse":"rc-collapse","react":"react"}],4:[function(require,module,exports){
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


Results.propTypes = {
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

},{"./Level.jsx":4,"./Updates.jsx":7,"./utils.js":8,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
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

// From rsr.models.indicator.IndicatorPeriodData
var STATUS_NEW_CODE = 'N',
    STATUS_DRAFT_CODE = 'D',
    STATUS_PENDING_CODE = 'P',
    STATUS_REVISION_CODE = 'R',
    STATUS_APPROVED_CODE = 'A';

var pruneForPATCH = function pruneForPATCH(update) {
    // Only include the listed fields when PATCHing an update
    // currently the list mimics the old MyResults data
    var fields = ['data', 'text', 'relative_data', 'status'];
    return fields.reduce(function (acc, f) {
        return Object.assign(acc, _defineProperty({}, f, update[f]));
    }, {});
};

var UpdateForm = function (_React$Component3) {
    _inherits(UpdateForm, _React$Component3);

    function UpdateForm(props) {
        _classCallCheck(this, UpdateForm);

        // Save original update
        var _this4 = _possibleConstructorReturn(this, (UpdateForm.__proto__ || Object.getPrototypeOf(UpdateForm)).call(this, props));

        _this4.state = { update: Object.assign({}, _this4.props.update) };
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
            this.props.callbacks.updateModel('updates', (0, _immutabilityHelper2.default)(this.props.update, { $merge: _defineProperty({}, field, e.target.value) }));
        }
    }, {
        key: 'onCancel',
        value: function onCancel() {
            this.props.formToggle();
            this.props.callbacks.updateModel('updates', this.state.update);
        }
    }, {
        key: 'saveUpdate',
        value: function saveUpdate(e) {
            var update = Object.assign({}, this.props.update);
            if (e.target.id == 'approve') {
                update.status = STATUS_APPROVED_CODE;
            } else {
                update.status = STATUS_DRAFT_CODE;
            }
            var success = function success(data) {
                this.props.formToggle();
                // Always save the instance using data coming from the backend
                // TODO: look at having a replaceModel method?
                this.props.callbacks.deleteFromModel("updates", update.id);
                this.props.callbacks.updateModel("updates", data);
            };
            if ((0, _utils.isNewUpdate)(update)) {
                (0, _utils.APICall)('POST', _utils.endpoints.updates_and_comments(), update, success.bind(this));
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
                            onCancel: this.onCancel
                        } })
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
                status: STATUS_DRAFT_CODE
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

},{"./Comments.jsx":2,"./utils.js":8,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],8:[function(require,module,exports){
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

},{"isomorphic-fetch":"isomorphic-fetch"}]},{},[1,2,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNRQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQWRBOzs7Ozs7O0FBZ0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUEvQyxFQUEwRCxNQUEz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O0FBQUEsNkRBQW9ELEVBQXBEO0FBQUEsS0FSTjtBQVNqQiw0QkFBd0I7QUFBQTtBQUFBLEtBVFA7QUFVakIsWUFBUSxjQUFDLEVBQUQ7QUFBQSxrQ0FBeUIsRUFBekI7QUFBQSxLQVZTO0FBV2pCLG9CQUFnQixzQkFBQyxFQUFEO0FBQUEsOERBQXFELEVBQXJEO0FBQUEsS0FYQztBQVlqQixtQkFBZSxxQkFBQyxFQUFEO0FBQUEsbURBQTBDLEVBQTFDO0FBQUE7QUFaRSxDQUFsQjs7QUFlQSxTQUFTLGFBQVQsQ0FBdUIsWUFBdkIsRUFBcUM7QUFDeEM7QUFDQSxRQUFJLGlCQUFpQixTQUFqQixJQUE4QixpQkFBaUIsSUFBbkQsRUFBeUQ7QUFDckQsWUFBSSxTQUFTLE9BQWI7QUFDQSxZQUFJLFFBQVEsV0FBVyxZQUFYLENBQVo7QUFDQSxZQUFJLENBQUMsTUFBTSxLQUFOLENBQUwsRUFBbUI7QUFDZixtQkFBTyxNQUFNLGNBQU4sQ0FBcUIsTUFBckIsQ0FBUDtBQUNIO0FBQ0o7QUFDRCxXQUFPLEVBQVA7QUFDSDs7QUFFRCxJQUFJLGdCQUFKOztBQUVBO0FBQ08sU0FBUyxDQUFULENBQVcsQ0FBWCxFQUFjO0FBQ2pCLFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDVixrQkFBVSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDLFNBQXhELENBQVY7QUFDSDtBQUNELFdBQU8sUUFBUSxDQUFSLENBQVA7QUFDSDs7QUFFTSxJQUFNLG9DQUFjLFNBQWQsV0FBYyxDQUFDLE1BQUQsRUFBWTtBQUFDLFdBQU8sT0FBTyxFQUFQLENBQVUsUUFBVixHQUFxQixNQUFyQixDQUE0QixDQUE1QixFQUErQixDQUEvQixNQUFzQyxNQUE3QztBQUFvRCxDQUFyRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vUmVzdWx0cy5qc3gnO1xuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzMwNjY2OS9cbk9iamVjdC52YWx1ZXMgPSBPYmplY3QudmFsdWVzIHx8IChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKSk7XG5cblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIGNvbnN0IGlzUHVibGljID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MnKS5pbm5lckhUTUwpLnB1YmxpYztcbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgY29uc3QgdXNlcklEID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5kcG9pbnQtZGF0YScpLmlubmVySFRNTCkudXNlcklEO1xuICAgICAgICBjb25zdCBwcm9qZWN0SWRzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdC1pZHMnKS5pbm5lckhUTUwpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWxzOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwZXJpb2RzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXBkYXRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdXNlcjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0c0RhdGFUcmVlOiBbXSxcbiAgICAgICAgICAgIHByb2plY3Q6IHtpZDogcHJvamVjdElkcy5wcm9qZWN0X2lkfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8gbWFpbnRhaW4gY29tcGF0aWJpbGl0eSB3aXRoIGV4aXN0aW5nIHVwZGF0ZXMgSlNPTlxuICAgICAgICAgICAgZGF0YS5hcHByb3ZlZF9vcmdhbmlzYXRpb25zID0gW2RhdGEub3JnYW5pc2F0aW9uXTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsczogdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7JG1lcmdlOiB7dXNlcjogZGF0YX19KX0pO1xuICAgICAgICB9O1xuICAgICAgICAvLyBHZXQgaW5mbyBvbiB0aGUgY3VycmVudCB1c2VyLiBVc2VkIHdoZW4gcG9zdGluZyBkYXRhLCBlLmcuIHVwZGF0ZXNcbiAgICAgICAgLy8gVE9ETzogVGhpcyBtaWdodCBub3QgYmUgdGhlIGJlc3QgcGxhY2UgdG8gbG9hZCB1c2VyIGRhdGFcbiAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzLnVzZXIodXNlcklEKSwgJycsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLCBsb2FkIHRoZSByZXN1bHRzIHRocm91Z2ggdGhlIEFQSVxuICAgICAgICAvL1RPRE86IHRoaXMgXCJjaGFpbmVkXCIgd2F5IG9mIGxvYWRpbmcgdGhlIEFQSSBkYXRhIGtpbmRhIHRlcnJpYmxlIGFuZCBzaG91bGQgYmUgcmVwbGFjZWRcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2luZGljYXRvcnMnKTtcbiAgICB9XG5cbiAgICBsb2FkTW9kZWwobW9kZWwpIHtcbiAgICAgICAgLy8gTG9hZCBhIG1vZGVsIGZyb20gdGhlIEFQSS4gQWZ0ZXIgbG9hZGluZyByZWJ1aWxkIHRoZSBkYXRhIHRyZWUuXG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSkge1xuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHttb2RlbHM6IHVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyRtZXJnZToge1ttb2RlbF06IHRoaXMuaW5kZXhNb2RlbChyZXNwb25zZS5yZXN1bHRzKX19XG4gICAgICAgICAgICAgICAgICAgICl9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0LmlkKSwgJycsIHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTW9kZWwobW9kZWwsIGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkZWxldGVGcm9tTW9kZWwobW9kZWwsIGlkKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbmV3U3RhdGU7XG4gICAgICAgIC8vIFNpbmNlIHdlIHNob3VsZG4ndCBlZGl0IHRoZSBzdGF0ZSBvYmplY3QgZGlyZWN0bHkgd2UgaGF2ZSB0byBtYWtlIGEgKHNoYWxsb3cpIGNvcHlcbiAgICAgICAgLy8gYW5kIGRlbGV0ZSBmcm9tIHRoZSBjb3B5LiBUT0RPOiB0aGluayBoYXJkIGlmIHRoaXMgY2FuIGxlYWQgdG8gdHJvdWJsZS4uLlxuICAgICAgICBjb25zdCBuZXdNb2RlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSk7XG4gICAgICAgIGRlbGV0ZSBuZXdNb2RlbFtpZF07XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRzZXQ6IG5ld01vZGVsfX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBDcmVhdGUgYW4gaW5kZXhlZCB2ZXJzaW9uIG9mIGEgbW9kZWwgYnkgY3JlYXRpbmcgYSBsaXN0IG9mIG9iamVjdHMsIG9uZSBmb3IgZWFjaCBtb2RlbFxuICAgICAgICBpbnN0YW5jZSB3aGVyZSB0aGUgb2JqZWN0IGtleSBpcyB0aGUgaWQgb2YgdGhlIGluc3RhbmNlIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGZ1bGwgaW5zdGFuY2UuXG4gICAgICAgIFRoaXMgY29uc3RydWN0IGlzIHVzZWQgdG8gYmUgYWJsZSB0byBlYXNpbHkgdXBkYXRlIGluZGl2aWR1YWwgaW5zdGFuY2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgZnVuY3Rpb24oYWNjLCBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IG9ialsnaWQnXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXhlZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGluZGV4ZWRPYmpbaWRdID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgaW5kZXhlZE9iailcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgfVxuXG4gICAgY3VycmVudFVzZXIoKSB7XG4gICAgICAgIC8vVE9ETzogaWYgbG9hZGluZyBvZiB1c2VyIGRhdGEgZmFpbHMgd2UgaGF2ZSBhIHByb2JsZW0uLi5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWxzLnVzZXI7XG4gICAgfVxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGFuZCBvbiBkb3duIHZpYSBcInVwZGF0ZXNcIiBhbmQgXCJjb21tZW50c1wiLlxuICAgICAgICBUaGlzIGRhdGEgc3RydWN0dXJlIGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHdob2xlIHRyZWUgb2YgY29tcG9uZW50cyBlYWNoIGxldmVsIHBhc3NpbmcgdGhlXG4gICAgICAgIGNoaWxkIGxpc3QgYXMgdGhlIHByb3AgXCJpdGVtc1wiXG4gICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGROYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBIZWxwZXIgZnVuY3Rpb24gdGhhdCBsaW5rcyB0d28gbGV2ZWxzIGluIHRoZSBkYXRhIHRyZWUuIFRoZSBsaW5raW5nIGlzIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgZm9yZWlnbiBrZXkgZmllbGQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY2hpbGQgYmVpbmcgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcGFyZW50IG9iamVjdFxuICAgICAgICAgICAgUGFyYW1zOlxuICAgICAgICAgICAgICAgIHBhcmVudHM6IGxpc3Qgb2YgcGFyZW50IG9iamVjdHMuIEVhY2ggcGFyZW50IG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyBmaWVsZCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgaG9sZHMgdGhlIGxpc3Qgb2YgYXNzb2NpYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXM6IG9iamVjdCB3aXRoIHR3byBmaWVsZHMsIFwicGFyZW50XCIgYW5kIFwiY2hpbGRyZW5cIiB0aGF0IGhvbGQgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICB0aGUgZmllbGRzIGxpbmtpbmcgdGhlIHR3byBsZXZlbHMgb2Ygb2JqZWN0cy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbGlzdCBvZiBhbGwgY2hpbGQgb2JqZWN0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMgJiYgcGFyZW50cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZE5hbWVzLmNoaWxkcmVuXSA9IGNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9PiBjaGlsZFtmaWVsZE5hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEFkZCB0aGUgZmllbGQgXCJhY3R1YWxfdmFsdWVcIiB0byBlYWNoIHBlcmlvZCB1cGRhdGUsIHdoaWNoIGlzIHRoZSBzdW0gb2YgYWxsIHVwZGF0ZVxuICAgICAgICAgICAgdmFsdWVzIHVwIHRvIHRoaXMgcG9pbnQgaW4gdGltZS4gTm90ZSB0aGF0IHRoaXMgZmllbGQgZXhpc3RzIGluIHRoZSBkYXRhc2V0IGFzXG4gICAgICAgICAgICB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBidXQgd2UgY2FuJ3QgdXNlIHRoYXQgc2luY2Ugd2Ugd2FudCB0byBiZSBhYmxlIHRvXG4gICAgICAgICAgICAocmUpLWNhbGN1bGF0ZSBvbiBkYXRhIGNoYW5nZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RzICYmIHBlcmlvZHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVyaW9kLnVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxfdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVsnYWN0dWFsX3ZhbHVlJ10gPSBwYXJzZUludCh1cGRhdGUuZGF0YSkgKyBhY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICAgICAgICAgIC8vIFR1cm4gdGhlIGluZGV4ZWQgbW9kZWwgYmFjayB0byBhIGxpc3Qgb2YgbW9kZWwgb2JqZWN0XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG9mIG1vZGVscyBmcm9tIHRoZSBsb3dlc3QgbGV2ZWwgKENvbW1lbnQpIGFuZCB1cCB0byBSZXN1bHRcbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBcImNvbW1lbnRzXCJ9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogXCJ1cGRhdGVzXCJ9LFxuICAgICAgICAgICAgdXBkYXRlcyk7XG4gICAgICAgIGNvbnN0IGFubm90YXRlZF9wZXJpb2RzID0gYW5ub3RhdGVVcGRhdGVzKHBlcmlvZHMpO1xuXG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmluZGljYXRvcnMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJpbmRpY2F0b3JcIiwgY2hpbGRyZW46IFwicGVyaW9kc1wifSxcbiAgICAgICAgICAgIGFubm90YXRlZF9wZXJpb2RzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogXCJpbmRpY2F0b3JzXCJ9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Nb2RlbDogdGhpcy5kZWxldGVGcm9tTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLmN1cnJlbnRVc2VyLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBMZXZlbCBmcm9tICcuL0xldmVsLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50cyBleHRlbmRzIExldmVsIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiY29tbWVudHNcIn07XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwoY29tbWVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17Y29tbWVudC5jb21tZW50fSBrZXk9e2NvbW1lbnQuaWR9PlxuICAgICAgICAgICAgICAgIDxkaXY+Qnk6IHtjb21tZW50LnVzZXJfZGV0YWlscy5maXJzdF9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCBpdGVtcz17dGhpcy5wcm9wcy5pdGVtc30gcmVuZGVyUGFuZWw9e3RoaXMucmVuZGVyUGFuZWwuYmluZCh0aGlzKX0vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuQ29tbWVudHMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgTGV2ZWwgZnJvbSAnLi9MZXZlbC5qc3gnO1xuaW1wb3J0IFBlcmlvZHMgZnJvbSAnLi9QZXJpb2RzLmpzeCc7XG5cbmltcG9ydCB7X31mcm9tICcuL3V0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpY2F0b3JzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwiaW5kaWNhdG9yc1wifTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cblxuICAgIHJlbmRlclBhbmVsKGluZGljYXRvcikge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfSBrZXk9e2luZGljYXRvci5pZH0+XG4gICAgICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS15ZWFyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnYmFzZWxpbmVfeWVhcicpfToge2luZGljYXRvci5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge18oJ2Jhc2VsaW5lX3ZhbHVlJyl9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8UGVyaW9kc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgIClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TGV2ZWwgaXRlbXM9e3RoaXMucHJvcHMuaXRlbXN9IHJlbmRlclBhbmVsPXt0aGlzLnJlbmRlclBhbmVsLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkluZGljYXRvcnMucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zO1xuICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiArIHRoaXMuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fZGVidWdJRCArIFwiIGxvYWRpbmcuLi5cIik7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPENvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiB0aGlzLnByb3BzLnJlbmRlclBhbmVsKGl0ZW0pKX1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5SZXN1bHRzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIHJlbmRlclBhbmVsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5cbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9MZXZlbC5qc3hcIjtcbmltcG9ydCB7VXBkYXRlcywgTmV3VXBkYXRlQnV0dG9ufSBmcm9tIFwiLi9VcGRhdGVzLmpzeFwiO1xuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5cbmNsYXNzIFBlcmlvZExvY2tUb2dnbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubG9ja1RvZ2dsZSA9IHRoaXMubG9ja1RvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2xvY2tpbmc6IGZhbHNlfTtcbiAgICB9XG5cbiAgICBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRzLnBlcmlvZChwZXJpb2RJZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXCJwZXJpb2RzXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmlvZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsOiBcInBlcmlvZHNcIixcbiAgICAgICAgICAgIGFjdGl2ZUtleTogW10gLy8gS2VlcCB0cmFjayBvZiBvcGVuIHVwZGF0ZSBwYW5lbHNcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vcGVuTmV3Rm9ybSA9IHRoaXMub3Blbk5ld0Zvcm0uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgndXBkYXRlcycpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGFjdGl2ZUtleSkge1xuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIG9wZW4gcGFuZWxzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleX0pO1xuICAgIH1cblxuICAgIG9wZW5OZXdGb3JtKG5ld0tleSwgZGF0YSkge1xuICAgICAgICAvLyBBZGQgdGhlIGtleSBmb3IgYSBuZXcgdXBkYXRlIHRvIHRoZSBsaXN0IG9mIG9wZW4gcGFuZWxzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7YWN0aXZlS2V5OiB1cGRhdGUodGhpcy5zdGF0ZS5hY3RpdmVLZXksIHskcHVzaDogW25ld0tleV19KX0sXG4gICAgICAgICAgICAvLyBPbmx5IHdoZW4gdGhlIGFjdGl2ZUtleSBzdGF0ZSBpcyBjb21taXR0ZWQgZG8gd2UgdXBkYXRlIHRoZSB1cGRhdGVzIG1vZGVsXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbCgndXBkYXRlcycsIGRhdGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwocGVyaW9kKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZFN0YXJ0ID0gZGlzcGxheURhdGUocGVyaW9kLnBlcmlvZF9zdGFydCk7XG4gICAgICAgIGNvbnN0IHBlcmlvZEVuZCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICAgICAgY29uc3QgcGVyaW9kRGF0ZSA9IGAke3BlcmlvZFN0YXJ0fSAtICR7cGVyaW9kRW5kfWA7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICBQZXJpb2Q6IHtwZXJpb2REYXRlfSB8XG4gICAgICAgICAgICAgICAgICAgIFRhcmdldCB2YWx1ZToge3BlcmlvZC50YXJnZXRfdmFsdWV9IHxcbiAgICAgICAgICAgICAgICAgICAgQWN0dWFsIHZhbHVlOiB7cGVyaW9kQWN0dWFsVmFsdWUocGVyaW9kKX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFBlcmlvZExvY2tUb2dnbGUgcGVyaW9kPXtwZXJpb2R9IGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdXBkYXRlQ2FsbGJhY2tzID0gdXBkYXRlKHRoaXMucHJvcHMuY2FsbGJhY2tzLCB7JG1lcmdlOiB7b25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9fSk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNhbGxiYWNrcyA9IHVwZGF0ZSh0aGlzLnByb3BzLmNhbGxiYWNrcywgeyRtZXJnZToge29wZW5OZXdGb3JtOiB0aGlzLm9wZW5OZXdGb3JtfX0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyfSBrZXk9e3BlcmlvZC5pZH0+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt1cGRhdGVDYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtwZXJpb2QudXBkYXRlc31cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5PXt0aGlzLnN0YXRlLmFjdGl2ZUtleX0vPlxuICAgICAgICAgICAgICAgIDxOZXdVcGRhdGVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXtidXR0b25DYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIHBlcmlvZD17cGVyaW9kfS8+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPExldmVsIGl0ZW1zPXt0aGlzLnByb3BzLml0ZW1zfSByZW5kZXJQYW5lbD17dGhpcy5yZW5kZXJQYW5lbC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5QZXJpb2RzLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IExldmVsIGZyb20gJy4vTGV2ZWwuanN4J1xuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCdcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IFwicmVzdWx0c1wifTtcbiAgICB9XG5cbiAgICByZW5kZXJQYW5lbChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1wiUmVzdWx0OiBcIiArIHJlc3VsdC50aXRsZX0ga2V5PXtyZXN1bHQuaWR9PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9QYW5lbD5cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMZXZlbCBpdGVtcz17dGhpcy5wcm9wcy5pdGVtc30gcmVuZGVyUGFuZWw9e3RoaXMucmVuZGVyUGFuZWwuYmluZCh0aGlzKX0vPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVzdWx0cy5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcbiIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vQ29tbWVudHMuanN4J1xuXG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50cywgZGlzcGxheURhdGUsIGRpc3BsYXlOdW1iZXIsIF8sIGN1cnJlbnRVc2VyLCBpc05ld1VwZGF0ZX0gZnJvbSAnLi91dGlscy5qcyc7XG5cblxuY29uc3QgVXBkYXRlRGlzcGxheSA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICsgXCIgXCIgKyB1cGRhdGUudXNlcl9kZXRhaWxzLmxhc3RfbmFtZTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2hlbjoge2Rpc3BsYXlEYXRlKHVwZGF0ZS5jcmVhdGVkX2F0KX0gfFxuICAgICAgICAgICAgQnk6IHt1c2VyTmFtZX0gfFxuICAgICAgICAgICAgT3JnOiB7dXBkYXRlLnVzZXJfZGV0YWlscy5hcHByb3ZlZF9vcmdhbmlzYXRpb25zWzBdLm5hbWV9IHxcbiAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfSA8YnIvPlxuICAgICAgICAgICAgVXBkYXRlIHZhbHVlOiB7dXBkYXRlLmRhdGF9IHwgey8qXG4gICAgICAgICBOT1RFOiB3ZSB1c2UgdXBkYXRlLmFjdHVhbF92YWx1ZSwgYSB2YWx1ZSBjYWxjdWxhdGVkIGluIEFwcC5hbm5vdGF0ZVVwZGF0ZXMoKSxcbiAgICAgICAgIG5vdCB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAqL31cbiAgICAgICAgICAgIEFjdHVhbCB0b3RhbCBmb3IgdGhpcyBwZXJpb2QgKGluY2x1ZGluZyB0aGlzIHVwZGF0ZSk6IHt1cGRhdGUuYWN0dWFsX3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVEaXNwbGF5LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5jbGFzcyBVcGRhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuZm9ybVRvZ2dsZSA9IHRoaXMuZm9ybVRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2Zvcm1PcGVuOiBpc05ld1VwZGF0ZShwcm9wcy51cGRhdGUpfTtcbiAgICB9XG5cbiAgICBmb3JtVG9nZ2xlKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtmb3JtT3BlbjogIXRoaXMuc3RhdGUuZm9ybU9wZW59KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybihcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5mb3JtVG9nZ2xlfVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtfKCdlZGl0X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZm9ybU9wZW4gP1xuICAgICAgICAgICAgICAgICAgICA8VXBkYXRlRm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtVG9nZ2xlPXt0aGlzLmZvcm1Ub2dnbGV9Lz5cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVEaXNwbGF5IHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuXG5leHBvcnQgY2xhc3MgVXBkYXRlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoJ2NvbW1lbnRzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyUGFuZWwodXBkYXRlKSB7XG4gICAgICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IHVwZGF0ZS51c2VyX2RldGFpbHMuZmlyc3RfbmFtZSArXCIgXCIrIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gYFVwZGF0ZTogJHt1c2VyTmFtZX0gYXQgJHtvcmdhbmlzYXRpb259LCBEYXRhOiAke3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1czogJHtfKCd1cGRhdGVfc3RhdHVzZXMnKVt1cGRhdGUuc3RhdHVzXX1gO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17aGVhZGVyVGV4dH0ga2V5PXt1cGRhdGUuaWR9PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1BhbmVsPlxuICAgICAgICApXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgIGlmICghaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgdGhpcy5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9kZWJ1Z0lEICsgXCIgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q29sbGFwc2Ugb25DaGFuZ2U9e3RoaXMucHJvcHMuY2FsbGJhY2tzLm9uQ2hhbmdlfSBhY3RpdmVLZXk9e3RoaXMucHJvcHMuYWN0aXZlS2V5fT5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5yZW5kZXJQYW5lbChpdGVtKSl9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblVwZGF0ZXMucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG59O1xuXG5cbmNvbnN0IEhlYWRlciA9ICh7dXBkYXRlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgQWN0dWFsVmFsdWVJbnB1dCA9ICh7dXBkYXRlLCB1cGRhdGVkQWN0dWFsVmFsdWUsIG9uQ2hhbmdlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhY3R1YWxWYWx1ZVwiPntfKCdhZGRfdG9fYWN0dWFsX3ZhbHVlJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJkYXRhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3VwZGF0ZS5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdpbnB1dF9wbGFjZWhvbGRlcicpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cEFjdHVhbFZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtfKCd0b3RhbF92YWx1ZV9hZnRlcl91cGRhdGUnKX06XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWFjdHVhbC12YWx1ZS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dXBkYXRlZEFjdHVhbFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZUlucHV0LnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdXBkYXRlZEFjdHVhbFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlRGVzY3JpcHRpb24gPSAoe3VwZGF0ZSwgb25DaGFuZ2V9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTkgdXBkYXRlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPntfKCdhY3R1YWxfdmFsdWVfY29tbWVudCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1cGRhdGUudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtfKCdjb21tZW50X3BsYWNlaG9sZGVyJyl9PlxuICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkFjdHVhbFZhbHVlRGVzY3JpcHRpb24ucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBdHRhY2htZW50cyA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbWFnZVVwbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhbWVyYVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QWRkIGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBhcGVyY2xpcFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+QXR0YWNoIGZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuXG5jb25zdCBVcGRhdGVGb3JtQnV0dG9ucyA9ICh7dXBkYXRlLCBjYWxsYmFja3N9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51QWN0aW9uXCI+XG4gICAgICAgIHshaXNOZXdVcGRhdGUodXBkYXRlKSA/XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJyZW1vdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtjYWxsYmFja3MuZGVsZXRlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2RlbGV0ZScpfTwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA6ICcnfVxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdi1waWxscyBib3R0b21Sb3cgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJjYW5jZWxVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLm9uQ2FuY2VsfSBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLXhzXCI+e18oJ2NhbmNlbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwic2F2ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNhdmVcIiBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdzYXZlJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9XCJhcHByb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGlkPVwiYXBwcm92ZVwiIG9uQ2xpY2s9e2NhbGxiYWNrcy5zYXZlVXBkYXRlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzXCI+e18oJ2FwcHJvdmUnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5VcGRhdGVGb3JtQnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cbi8vIEZyb20gcnNyLm1vZGVscy5pbmRpY2F0b3IuSW5kaWNhdG9yUGVyaW9kRGF0YVxuY29uc3QgU1RBVFVTX05FV19DT0RFID0gJ04nLFxuICAgICAgU1RBVFVTX0RSQUZUX0NPREUgPSAnRCcsXG4gICAgICBTVEFUVVNfUEVORElOR19DT0RFID0gJ1AnLFxuICAgICAgU1RBVFVTX1JFVklTSU9OX0NPREUgPSAnUicsXG4gICAgICBTVEFUVVNfQVBQUk9WRURfQ09ERSA9ICdBJztcblxuY29uc3QgcHJ1bmVGb3JQQVRDSCA9ICh1cGRhdGUpID0+IHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGxpc3RlZCBmaWVsZHMgd2hlbiBQQVRDSGluZyBhbiB1cGRhdGVcbiAgICAvLyBjdXJyZW50bHkgdGhlIGxpc3QgbWltaWNzIHRoZSBvbGQgTXlSZXN1bHRzIGRhdGFcbiAgICBjb25zdCBmaWVsZHMgPSBbJ2RhdGEnLCAndGV4dCcsICdyZWxhdGl2ZV9kYXRhJywgJ3N0YXR1cyddO1xuICAgIHJldHVybiBmaWVsZHMucmVkdWNlKChhY2MsIGYpID0+IHtyZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtbZl06IHVwZGF0ZVtmXX0pfSwge30pO1xufTtcblxuY2xhc3MgVXBkYXRlRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgdXBkYXRlXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7dXBkYXRlOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnVwZGF0ZSl9O1xuICAgICAgICB0aGlzLnNhdmVVcGRhdGUgPSB0aGlzLnNhdmVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGVVcGRhdGUgPSB0aGlzLmRlbGV0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uQ2FuY2VsID0gdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgZm9ybSBmaWVsZCB3aWRnZXRzIGNoYW5nZSwgbW9kaWZ5IHRoZSBtb2RlbCBkYXRhIGluIEFwcC5zdGF0ZVttb2RlbF1cbiAgICAgICAgY29uc3QgZmllbGQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoXG4gICAgICAgICAgICAndXBkYXRlcycsIHVwZGF0ZSh0aGlzLnByb3BzLnVwZGF0ZSwgeyRtZXJnZToge1tmaWVsZF06IGUudGFyZ2V0LnZhbHVlfX0pKTtcbiAgICB9XG5cbiAgICBvbkNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKCd1cGRhdGVzJywgdGhpcy5zdGF0ZS51cGRhdGUpO1xuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoZSkge1xuICAgICAgICBsZXQgdXBkYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy51cGRhdGUpO1xuICAgICAgICBpZiAoZS50YXJnZXQuaWQgPT0gJ2FwcHJvdmUnKSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0FQUFJPVkVEX0NPREU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0RSQUZUX0NPREU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIC8vIEFsd2F5cyBzYXZlIHRoZSBpbnN0YW5jZSB1c2luZyBkYXRhIGNvbWluZyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAgICAvLyBUT0RPOiBsb29rIGF0IGhhdmluZyBhIHJlcGxhY2VNb2RlbCBtZXRob2Q/XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5kZWxldGVGcm9tTW9kZWwoXCJ1cGRhdGVzXCIsIHVwZGF0ZS5pZCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChcInVwZGF0ZXNcIiwgZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChpc05ld1VwZGF0ZSh1cGRhdGUpKSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQT1NUJywgZW5kcG9pbnRzLnVwZGF0ZXNfYW5kX2NvbW1lbnRzKCksIHVwZGF0ZSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BBVENIJywgZW5kcG9pbnRzLnVwZGF0ZV9hbmRfY29tbWVudHModXBkYXRlLmlkKSxcbiAgICAgICAgICAgICAgICAgICAgcHJ1bmVGb3JQQVRDSCh1cGRhdGUpLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlVXBkYXRlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge2lkOiB0aGlzLnByb3BzLnVwZGF0ZS5pZH07XG4gICAgICAgIGxldCBzdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFwidXBkYXRlc1wiLCBkYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBBUElDYWxsKCdERUxFVEUnLCBlbmRwb2ludHMudXBkYXRlX2FuZF9jb21tZW50cyhkYXRhLmlkKSwgbnVsbCwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcmV2aW91c0FjdHVhbFZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy51cGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwZGF0ZS5hY3R1YWxfdmFsdWUgLSB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlcyA9IHRoaXMucHJvcHMucGVyaW9kLnVwZGF0ZXM7XG4gICAgICAgICAgICBpZiAodXBkYXRlcyAmJiB1cGRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3QgPSB1cGRhdGVzW3VwZGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhdGVzdC5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMucHJvcHMudXBkYXRlLmRhdGEgPyB0aGlzLnByb3BzLnVwZGF0ZS5kYXRhIDogMCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRBY3R1YWxWYWx1ZSA9IGRpc3BsYXlOdW1iZXIodGhpcy5wcmV2aW91c0FjdHVhbFZhbHVlKCkgKyB1cGRhdGVWYWx1ZSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB1cGRhdGUtZW50cnktY29udGFpbmVyIGVkaXQtaW4tcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPEhlYWRlciB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZUlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQWN0dWFsVmFsdWU9e3VwZGF0ZWRBY3R1YWxWYWx1ZX0vPlxuICAgICAgICAgICAgICAgICAgICA8QWN0dWFsVmFsdWVEZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBdHRhY2htZW50cy8+XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtQnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVXBkYXRlOiB0aGlzLnNhdmVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVVwZGF0ZTogdGhpcy5kZWxldGVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsOiB0aGlzLm9uQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmxldCBuZXdVcGRhdGVJRCA9IDE7XG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubmV3VXBkYXRlID0gdGhpcy5uZXdVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBuZXdVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLnByb3BzLmNhbGxiYWNrcy5jdXJyZW50VXNlcigpO1xuICAgICAgICBjb25zdCBpZCA9IGBuZXctJHtuZXdVcGRhdGVJRH1gO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgcGVyaW9kOiB0aGlzLnByb3BzLnBlcmlvZC5pZCxcbiAgICAgICAgICAgIHVzZXJfZGV0YWlsczogdXNlcixcbiAgICAgICAgICAgIHVzZXI6IHVzZXIuaWQsXG4gICAgICAgICAgICBkYXRhOiAwLFxuICAgICAgICAgICAgdGV4dDogJycsXG4gICAgICAgICAgICByZWxhdGl2ZV9kYXRhOiB0cnVlLFxuICAgICAgICAgICAgc3RhdHVzOiBTVEFUVVNfRFJBRlRfQ09ERVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5vcGVuTmV3Rm9ybShpZCwgZGF0YSk7XG4gICAgICAgIG5ld1VwZGF0ZUlEICs9IDE7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLm5ld1VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXBsdXMnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnbmV3X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlQnV0dG9uLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xuXG5cbmxldCBtb250aHM7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RGF0ZShkYXRlU3RyaW5nKSB7XG4gICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICBpZiAoIW1vbnRocykge1xuICAgICAgICBtb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgaWYgKGRhdGVTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbG9jYWxlID0gXCJlbi1nYlwiO1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZy5zcGxpdChcIi5cIilbMF0ucmVwbGFjZShcIi9cIiwgLy0vZykpO1xuICAgICAgICBjb25zdCBkYXkgPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBtb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgfVxuICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBoYW5kbGVyO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBPU1RcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BPU1QnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBVVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUFVUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQQVRDSFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUEFUQ0gnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIkRFTEVURVwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZSgnY3NyZnRva2VuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xufVxuXG5cbi8vIE9iamVjdCBob2xkcyBjYWxsYmFjayBVUkwgZnVuY3Rpb25zIGFzIHZhbHVlcywgbW9zdCBvZiB0aGVtIGNhbGxlZCB3aXRoIGFuIGlkIHBhcmFtZXRlclxuLy8gVXNhZ2U6IGVuZHBvaW50cy5yZXN1bHQoMTcpIC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICAgICAgXCJyZXN1bHRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicmVzdWx0c1wiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImluZGljYXRvcnNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInVwZGF0ZXNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJjb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfY29tbWVudC8/Zm9ybWF0PWpzb24mZGF0YV9fcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVzX2FuZF9jb21tZW50c1wiOiAoKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVzZXJcIjogKGlkKSA9PiBgL3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiAoaWQpID0+IGAvcmVzdC92MS9wYXJ0bmVyc2hpcC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiZmlsZV91cGxvYWRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5TnVtYmVyKG51bWJlclN0cmluZykge1xuICAgIC8vIEFkZCBjb21tYXMgdG8gbnVtYmVycyBvZiAxMDAwIG9yIGhpZ2hlci5cbiAgICBpZiAobnVtYmVyU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgbnVtYmVyU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIHZhciBmbG9hdCA9IHBhcnNlRmxvYXQobnVtYmVyU3RyaW5nKTtcbiAgICAgICAgaWYgKCFpc05hTihmbG9hdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmbG9hdC50b0xvY2FsZVN0cmluZyhsb2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxubGV0IHN0cmluZ3M7XG5cbi8vIFRyYW5zbGF0aW9uIGEgbGEgcHl0aG9uLiBMZXQncyBob3BlIHdlIG5ldmVyIG5lZWQgbG9kYXNoLi4uXG5leHBvcnQgZnVuY3Rpb24gXyhzKSB7XG4gICAgaWYgKCFzdHJpbmdzKSB7XG4gICAgICAgIHN0cmluZ3MgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmdzW3NdO1xufVxuXG5leHBvcnQgY29uc3QgaXNOZXdVcGRhdGUgPSAodXBkYXRlKSA9PiB7cmV0dXJuIHVwZGF0ZS5pZC50b1N0cmluZygpLnN1YnN0cigwLCA0KSA9PT0gJ25ldy0nfTtcbiJdfQ==
