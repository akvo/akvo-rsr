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
            // Chain loading of all models
            // TODO: error handling
            this.loadModel(_const.OBJECTS_RESULTS, this.loadModel.bind(this, _const.OBJECTS_INDICATORS, this.loadModel.bind(this, _const.OBJECTS_PERIODS, this.loadModel.bind(this, _const.OBJECTS_UPDATES, this.loadModel.bind(this, _const.OBJECTS_COMMENTS)))));
        }
    }, {
        key: 'loadModel',
        value: function loadModel(model, callback) {
            // Load a model from the API. After loading rebuild the data tree.
            if (!this.state.models[model]) {
                var success = function (response) {
                    this.setState({ models: (0, _immutabilityHelper2.default)(this.state.models, { $merge: _defineProperty({}, model, this.indexModel(response.results)) }) }, function () {
                        this.setState({ resultsDataTree: this.assembleDataTree() });
                        if (callback) {
                            callback();
                        }
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level = require('./Level.jsx');

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

var CommentHeader = function CommentHeader(_ref) {
    var comment = _ref.item;

    return _react2.default.createElement(
        'span',
        null,
        "Comment: " + comment.comment
    );
};

var Comment = function (_React$Component) {
    _inherits(Comment, _React$Component);

    function Comment(props) {
        _classCallCheck(this, Comment);

        var _this = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

        _this.state = { model: _const.OBJECTS_COMMENTS };
        return _this;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Comments.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    _createClass(Comment, [{
        key: 'render',
        value: function render() {
            var comment = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                'By: ',
                comment.user_details.first_name
            );
        }
    }]);

    return Comment;
}(_react2.default.Component);

Comment.propTypes = {
    items: _react.PropTypes.array
};

exports.default = (0, _Level.level)(CommentHeader, Comment);

},{"./Level.jsx":4,"./const.js":8,"./utils.js":9,"rc-collapse":"rc-collapse","react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Level = require('./Level.jsx');

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

var IndicatorHeader = function IndicatorHeader(_ref) {
    var indicator = _ref.item;

    var title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return _react2.default.createElement(
        'span',
        null,
        "Indicator: " + title
    );
};

IndicatorHeader.propTypes = {
    item: _react.PropTypes.object
};

var IndicatorContent = function IndicatorContent(_ref2) {
    var indicator = _ref2.indicator;

    var title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return _react2.default.createElement(
        'div',
        null,
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
        )
    );
};

IndicatorContent.propTypes = {
    indicator: _react.PropTypes.object
};

var Indicator = function (_React$Component) {
    _inherits(Indicator, _React$Component);

    function Indicator(props) {
        _classCallCheck(this, Indicator);

        var _this = _possibleConstructorReturn(this, (Indicator.__proto__ || Object.getPrototypeOf(Indicator)).call(this, props));

        _this.state = { model: _const.OBJECTS_INDICATORS };
        return _this;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Indicator.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    _createClass(Indicator, [{
        key: 'render',
        value: function render() {
            var indicator = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(IndicatorContent, { indicator: indicator }),
                _react2.default.createElement(_Periods2.default, {
                    items: indicator.periods,
                    callbacks: this.props.callbacks,
                    propagate: this.props.propagate })
            );
        }
    }]);

    return Indicator;
}(_react2.default.Component);

Indicator.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

exports.default = (0, _Level.level)(IndicatorHeader, Indicator);

},{"./Level.jsx":4,"./Periods.jsx":5,"./const.js":8,"./utils":9,"rc-collapse":"rc-collapse","react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.level = level;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _rcCollapse2 = _interopRequireDefault(_rcCollapse);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

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

var ToggleButton = function ToggleButton(_ref) {
    var onClick = _ref.onClick,
        label = _ref.label;

    return _react2.default.createElement(
        'a',
        { onClick: onClick,
            className: 'btn btn-sm btn-default',
            style: { margin: '0.3em 0.5em' } },
        label
    );
};

ToggleButton.propTypes = {
    onClick: _react.PropTypes.func.isRequired,
    label: _react.PropTypes.string.isRequired
};

var PROPAGATE_NO = false,
    PROPAGATE_OPEN = 'open',
    PROPAGATE_CLOSE = 'close';

function level(Header, Content) {

    function itemIDsArray(items) {
        // Return an array with item IDs as as stings, the same format as Collapse.activeKey
        if (items) return items.map(function (item) {
            return item.id.toString();
        });
        return [];
    }

    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            var activeKey = [];
            if (props.propagate == PROPAGATE_OPEN && _this.props.items) {
                activeKey = itemIDsArray(_this.props.items);
            }
            _this.state = { activeKey: activeKey, propagate: props.propagate || PROPAGATE_NO };

            _this.onChange = _this.onChange.bind(_this);
            _this.openAll = _this.openAll.bind(_this);
            _this.closeAll = _this.closeAll.bind(_this);
            // this.togglePanels = this.togglePanels;
            _this.toggleAll = _this.toggleAll.bind(_this);
            return _this;
        }

        // componentWillReceiveProps(nextProps) {
        //     console.log("Level.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
        // }

        _createClass(_class, [{
            key: 'onChange',
            value: function onChange(activeKey) {
                // Keep track of open panels
                this.setState({ activeKey: activeKey });
            }
        }, {
            key: 'openAll',
            value: function openAll() {
                var setPropagate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                var items = this.props.items;
                var nextState = { activeKey: itemIDsArray(items) };
                if (setPropagate) {
                    nextState.propagate = PROPAGATE_OPEN;
                }
                this.setState(nextState);
            }
        }, {
            key: 'closeAll',
            value: function closeAll() {
                var setPropagate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                var nextState = { activeKey: [] };
                if (setPropagate) {
                    nextState.propagate = PROPAGATE_CLOSE;
                }
                this.setState(nextState);
            }
        }, {
            key: 'togglePanels',
            value: function togglePanels(setPropagate) {
                // If activeKey holds all items' IDs then all Panels are open and we should
                // close them, otherwise we open all Panels
                var activeKey = this.state.activeKey;
                var items = this.props.items;
                if ((0, _utils.identicalArrays)(activeKey, itemIDsArray(items))) {
                    this.closeAll(setPropagate);
                } else {
                    this.openAll(setPropagate);
                }
            }
        }, {
            key: 'toggleAll',
            value: function toggleAll() {
                this.togglePanels(true);
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                // Combine activeKey with props.newKeys to create a new activeKey
                // Currently used in Period to open a new update form when it's created
                if (nextProps.newKeys) {
                    this.setState({ activeKey: (0, _immutabilityHelper2.default)(this.state.activeKey, { $push: nextProps.newKeys }) });
                }
                if (nextProps.propagate) {
                    if (nextProps.propagate == PROPAGATE_OPEN) {
                        this.openAll();
                    } else if (nextProps.propagate == PROPAGATE_CLOSE) {
                        this.closeAll();
                    }
                }
            }
        }, {
            key: 'renderPanels',
            value: function renderPanels(items, propagate, props) {
                return items.map(function (item) {
                    // Note: I've tried to have the Panel in the respective Content components
                    // and render <Content /> here, but it seems Panel doesn't like being
                    // separated from Collapse by any component between them so I gave up
                    return _react2.default.createElement(
                        _rcCollapse.Panel,
                        { header: _react2.default.createElement(Header, _extends({ item: item }, props)), key: item.id },
                        _react2.default.createElement(Content, { key: item.id, item: item, propagate: propagate, callbacks: props.callbacks })
                    );
                });
            }
        }, {
            key: 'render',
            value: function render() {
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
                        'div',
                        null,
                        _react2.default.createElement(ToggleButton, { onClick: this.togglePanels.bind(this, false), label: '+' }),
                        _react2.default.createElement(ToggleButton, { onClick: this.toggleAll, label: '++' }),
                        _react2.default.createElement(
                            _rcCollapse2.default,
                            { activeKey: this.state.activeKey, onChange: this.onChange },
                            this.renderPanels(items, this.state.propagate || this.props.propagate, this.props)
                        )
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

        return _class;
    }(_react2.default.Component);
}

},{"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Period = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require("rc-collapse");

var _immutabilityHelper = require("immutability-helper");

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _Level = require("./Level.jsx");

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

var PeriodHeader = function PeriodHeader(_ref) {
    var period = _ref.item,
        callbacks = _ref.callbacks;

    var periodStart = (0, _utils.displayDate)(period.period_start);
    var periodEnd = (0, _utils.displayDate)(period.period_end);
    var periodDate = periodStart + " - " + periodEnd;
    return _react2.default.createElement(
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
        _react2.default.createElement(PeriodLockToggle, { period: period, callbacks: callbacks })
    );
};

PeriodHeader.propTypes = {
    item: _react.PropTypes.object,
    callbacks: _react.PropTypes.object.isRequired
};

var Period = exports.Period = function (_React$Component2) {
    _inherits(Period, _React$Component2);

    function Period(props) {
        _classCallCheck(this, Period);

        var _this2 = _possibleConstructorReturn(this, (Period.__proto__ || Object.getPrototypeOf(Period)).call(this, props));

        _this2.state = {
            model: _const.OBJECTS_PERIODS,
            newKeys: [] // Keep track of keys for new updates, used to open the UpdateForm
        };
        _this2.openNewForm = _this2.openNewForm.bind(_this2);
        return _this2;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Periods.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    _createClass(Period, [{
        key: "openNewForm",
        value: function openNewForm(newKey, data) {
            // Add the key for a new update to the list of open panels
            this.setState({ newKeys: (0, _immutabilityHelper2.default)(this.state.newKeys, { $push: [newKey] }) },
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel(_const.OBJECTS_UPDATES, data));
        }
    }, {
        key: "render",
        value: function render() {
            var period = this.props.item;
            var updateCallbacks = (0, _immutabilityHelper2.default)(this.props.callbacks, { $merge: { onChange: this.onChange } });
            var buttonCallbacks = (0, _immutabilityHelper2.default)(this.props.callbacks, { $merge: { openNewForm: this.openNewForm } });
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_Updates.Updates, {
                    items: period.updates,
                    callbacks: updateCallbacks,
                    newKeys: this.state.newKeys,
                    propagate: this.props.propagate }),
                _react2.default.createElement(_Updates.NewUpdateButton, {
                    callbacks: buttonCallbacks,
                    period: period })
            );
        }
    }]);

    return Period;
}(_react2.default.Component);

Period.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

exports.default = (0, _Level.level)(PeriodHeader, Period);

},{"./Level.jsx":4,"./Updates.jsx":7,"./const.js":8,"./utils.js":9,"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _Indicators = require('./Indicators.jsx');

var _Indicators2 = _interopRequireDefault(_Indicators);

var _Level = require('./Level.jsx');

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

var ResultHeader = function ResultHeader(_ref) {
    var result = _ref.item;

    return _react2.default.createElement(
        'span',
        null,
        "Result: " + result.title
    );
};

ResultHeader.propTypes = {
    item: _react.PropTypes.object
};

var Result = function (_React$Component) {
    _inherits(Result, _React$Component);

    function Result(props) {
        _classCallCheck(this, Result);

        var _this = _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).call(this, props));

        _this.state = { model: _const.OBJECTS_RESULTS };
        return _this;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Result.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    _createClass(Result, [{
        key: 'render',
        value: function render() {
            var result = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_Indicators2.default, {
                    items: result.indicators,
                    callbacks: this.props.callbacks,
                    propagate: this.props.propagate })
            );
        }
    }]);

    return Result;
}(_react2.default.Component);

Result.propTypes = {
    items: _react.PropTypes.array,
    callbacks: _react.PropTypes.object.isRequired
};

exports.default = (0, _Level.level)(ResultHeader, Result);

},{"./Indicators.jsx":3,"./Level.jsx":4,"./const.js":8,"rc-collapse":"rc-collapse","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewUpdateButton = exports.Updates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcCollapse = require('rc-collapse');

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _Level = require('./Level.jsx');

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

var UpdateHeader = function UpdateHeader(_ref2) {
    var update = _ref2.item;

    var organisation = update.user_details.approved_organisations[0].name;
    var userName = update.user_details.first_name + " " + update.user_details.last_name;
    return _react2.default.createElement(
        'span',
        null,
        'Update: ',
        userName,
        ' at ',
        organisation,
        ', Data: ',
        update.data,
        ' Status: ',
        (0, _utils._)('update_statuses')[update.status]
    );
};

UpdateHeader.propTypes = {
    item: _react.PropTypes.object
};

var UpdatesBase = function (_React$Component2) {
    _inherits(UpdatesBase, _React$Component2);

    function UpdatesBase(props) {
        _classCallCheck(this, UpdatesBase);

        var _this2 = _possibleConstructorReturn(this, (UpdatesBase.__proto__ || Object.getPrototypeOf(UpdatesBase)).call(this, props));

        _this2.state = { model: _const.OBJECTS_UPDATES };
        return _this2;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Updates.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    _createClass(UpdatesBase, [{
        key: 'render',
        value: function render() {
            var update = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(Update, {
                    update: update,
                    callbacks: this.props.callbacks }),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Comments2.default, {
                        items: update.comments,
                        propagate: this.props.propagate })
                )
            );
        }
    }]);

    return UpdatesBase;
}(_react2.default.Component);

UpdatesBase.propTypes = {
    callbacks: _react.PropTypes.object.isRequired,
    items: _react.PropTypes.array
};

var Updates = exports.Updates = (0, _Level.level)(UpdateHeader, UpdatesBase);

var Header = function Header(_ref3) {
    var update = _ref3.update;

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

var ActualValueInput = function ActualValueInput(_ref4) {
    var update = _ref4.update,
        updatedActualValue = _ref4.updatedActualValue,
        onChange = _ref4.onChange;

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

var ActualValueDescription = function ActualValueDescription(_ref5) {
    var update = _ref5.update,
        onChange = _ref5.onChange;

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

var UpdateFormButtons = function UpdateFormButtons(_ref6) {
    var update = _ref6.update,
        callbacks = _ref6.callbacks;

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

exports.identicalArrays = identicalArrays;
exports.displayDate = displayDate;
exports.getCookie = getCookie;
exports.APICall = APICall;
exports.displayNumber = displayNumber;
exports._ = _;
exports.levelToggle = levelToggle;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

function identicalArrays(array1, array2) {
    // Compare two arrays and return true if they are identical, otherwise false
    return array1.length == array2.length && array1.every(function (element, index) {
        return element === array2[index];
    });
}

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

var ToggleButton = function ToggleButton(_ref) {
    var onClick = _ref.onClick,
        label = _ref.label;

    return _react2.default.createElement(
        'a',
        { onClick: onClick,
            className: 'btn btn-sm btn-default',
            style: { margin: '0.3em 0.5em' } },
        label
    );
};

ToggleButton.propTypes = {
    onClick: _react.PropTypes.func.isRequired,
    label: _react.PropTypes.string.isRequired
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
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(ToggleButton, { onClick: this.toggleLevel, label: '+' }),
                    _react2.default.createElement(WrappedComponent, _extends({
                        activeKey: this.state.activeKey,
                        onChange: this.onChange
                    }, this.props))
                );
            }
        }]);

        return _class;
    }(_react2.default.Component);
}

},{"isomorphic-fetch":"isomorphic-fetch","react":"react"}]},{},[1,2,3,4,5,6,7,9,8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9jb25zdC5qcyIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7K2VBaEJBOzs7Ozs7O0FBb0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxX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LFdBQTVCLEVBQXlDLE9BQU0sR0FBL0MsR0FESjtBQUVJLGtEQUFDLGdCQUFEO0FBQ0ksbUNBQVcsS0FBSyxLQUFMLENBQVcsU0FEMUI7QUFFSSxrQ0FBVSxLQUFLO0FBRm5CLHVCQUdRLEtBQUssS0FIYjtBQUZKLGlCQURKO0FBU0g7QUFuQ0w7O0FBQUE7QUFBQSxNQUFxQixnQkFBTSxTQUEzQjtBQXFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vUmVzdWx0cy5qc3gnO1xuXG5pbXBvcnQge0FQSUNhbGwsIGVuZHBvaW50c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge1xuICAgIE9CSkVDVFNfUkVTVUxUUywgT0JKRUNUU19JTkRJQ0FUT1JTLCBPQkpFQ1RTX1BFUklPRFMsIE9CSkVDVFNfVVBEQVRFUywgT0JKRUNUU19DT01NRU5UU1xufSBmcm9tICcuL2NvbnN0LmpzJztcblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczMDY2NjkvXG5PYmplY3QudmFsdWVzID0gT2JqZWN0LnZhbHVlcyB8fCAob2JqID0+IE9iamVjdC5rZXlzKG9iaikubWFwKGtleSA9PiBvYmpba2V5XSkpO1xuXG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICBjb25zdCBpc1B1YmxpYyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzJykuaW5uZXJIVE1MKS5wdWJsaWM7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgICAgIGNvbnN0IHVzZXJJRCA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZHBvaW50LWRhdGEnKS5pbm5lckhUTUwpLnVzZXJJRDtcbiAgICAgICAgY29uc3QgcHJvamVjdElkcyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtaWRzJykuaW5uZXJIVE1MKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGVyaW9kczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21tZW50czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVzZXI6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3VsdHNEYXRhVHJlZTogW10sXG4gICAgICAgICAgICBwcm9qZWN0OiB7aWQ6IHByb2plY3RJZHMucHJvamVjdF9pZH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIG1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBleGlzdGluZyB1cGRhdGVzIEpTT05cbiAgICAgICAgICAgIGRhdGEuYXBwcm92ZWRfb3JnYW5pc2F0aW9ucyA9IFtkYXRhLm9yZ2FuaXNhdGlvbl07XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttb2RlbHM6IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywgeyRtZXJnZToge3VzZXI6IGRhdGF9fSl9KTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gR2V0IGluZm8gb24gdGhlIGN1cnJlbnQgdXNlci4gVXNlZCB3aGVuIHBvc3RpbmcgZGF0YSwgZS5nLiB1cGRhdGVzXG4gICAgICAgIC8vIFRPRE86IFRoaXMgbWlnaHQgbm90IGJlIHRoZSBiZXN0IHBsYWNlIHRvIGxvYWQgdXNlciBkYXRhXG4gICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50cy51c2VyKHVzZXJJRCksICcnLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBDaGFpbiBsb2FkaW5nIG9mIGFsbCBtb2RlbHNcbiAgICAgICAgLy8gVE9ETzogZXJyb3IgaGFuZGxpbmdcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoXG4gICAgICAgICAgICBPQkpFQ1RTX1JFU1VMVFMsXG4gICAgICAgICAgICB0aGlzLmxvYWRNb2RlbC5iaW5kKFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgT0JKRUNUU19JTkRJQ0FUT1JTLFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE1vZGVsLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIE9CSkVDVFNfUEVSSU9EUyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTW9kZWwuYmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBPQkpFQ1RTX1VQREFURVMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRNb2RlbC5iaW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT0JKRUNUU19DT01NRU5UU1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgfVxuXG4gICAgbG9hZE1vZGVsKG1vZGVsLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJLiBBZnRlciBsb2FkaW5nIHJlYnVpbGQgdGhlIGRhdGEgdHJlZS5cbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgICAgICAgICAge21vZGVsczogdXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXTogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfX1cbiAgICAgICAgICAgICAgICAgICAgKX0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIEFQSUNhbGwoJ0dFVCcsIGVuZHBvaW50c1ttb2RlbF0odGhpcy5zdGF0ZS5wcm9qZWN0LmlkKSwgJycsIHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTW9kZWwobW9kZWwsIGRhdGEpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgY29uc3QgaWQgPSBkYXRhLmlkO1xuICAgICAgICBuZXdTdGF0ZSA9IHVwZGF0ZSh0aGlzLnN0YXRlLm1vZGVscywge1ttb2RlbF06IHskbWVyZ2U6IHtbaWRdOiBkYXRhfX19KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgIHttb2RlbHM6IG5ld1N0YXRlfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdHNEYXRhVHJlZTogdGhpcy5hc3NlbWJsZURhdGFUcmVlKCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkZWxldGVGcm9tTW9kZWwobW9kZWwsIGlkKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSBhIG1vZGVsIGluc3RhbmNlLiBVc2VzIHRoZSBpbmRleGVkIG1vZGVsIG9iamVjdHMgYW5kIHRoZSBpbW11dGFiaWxpdHktaGVscGVyIHVwZGF0ZVxuICAgICAgICAgZnVuY3Rpb24gKGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdXBkYXRlLmh0bWwpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbmV3U3RhdGU7XG4gICAgICAgIC8vIFNpbmNlIHdlIHNob3VsZG4ndCBlZGl0IHRoZSBzdGF0ZSBvYmplY3QgZGlyZWN0bHkgd2UgaGF2ZSB0byBtYWtlIGEgKHNoYWxsb3cpIGNvcHlcbiAgICAgICAgLy8gYW5kIGRlbGV0ZSBmcm9tIHRoZSBjb3B5LiBUT0RPOiB0aGluayBoYXJkIGlmIHRoaXMgY2FuIGxlYWQgdG8gdHJvdWJsZS4uLlxuICAgICAgICBjb25zdCBuZXdNb2RlbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUubW9kZWxzW21vZGVsXSk7XG4gICAgICAgIGRlbGV0ZSBuZXdNb2RlbFtpZF07XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRzZXQ6IG5ld01vZGVsfX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGluZGV4TW9kZWwoZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBDcmVhdGUgYW4gaW5kZXhlZCB2ZXJzaW9uIG9mIGEgbW9kZWwgYnkgY3JlYXRpbmcgYSBsaXN0IG9mIG9iamVjdHMsIG9uZSBmb3IgZWFjaCBtb2RlbFxuICAgICAgICBpbnN0YW5jZSB3aGVyZSB0aGUgb2JqZWN0IGtleSBpcyB0aGUgaWQgb2YgdGhlIGluc3RhbmNlIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGZ1bGwgaW5zdGFuY2UuXG4gICAgICAgIFRoaXMgY29uc3RydWN0IGlzIHVzZWQgdG8gYmUgYWJsZSB0byBlYXNpbHkgdXBkYXRlIGluZGl2aWR1YWwgaW5zdGFuY2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgZnVuY3Rpb24oYWNjLCBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IG9ialsnaWQnXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXhlZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGluZGV4ZWRPYmpbaWRdID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgaW5kZXhlZE9iailcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgfVxuXG4gICAgY3VycmVudFVzZXIoKSB7XG4gICAgICAgIC8vVE9ETzogaWYgbG9hZGluZyBvZiB1c2VyIGRhdGEgZmFpbHMgd2UgaGF2ZSBhIHByb2JsZW0uLi5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWxzLnVzZXI7XG4gICAgfVxuXG4gICAgYXNzZW1ibGVEYXRhVHJlZSgpIHtcbiAgICAgICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbGlzdCBvZiByZXN1bHQgb2JqZWN0cyBiYXNlZCBvbiB0aGUgQVBJIGNhbGwgZm9yIFJlc3VsdCwgZWFjaCBvZiB3aGljaCBob2xkcyBhXG4gICAgICAgIGxpc3Qgb2YgaXRzIGFzc29jaWF0ZWQgaW5kaWNhdG9ycyBpbiB0aGUgZmllbGQgXCJpbmRpY2F0b3JzXCIsIGVhY2ggb2Ygd2hpY2ggaG9sZCBhIGxpc3Qgb2ZcbiAgICAgICAgaW5kaWNhdG9yIHBlcmlvZHMgaW4gdGhlIGZpZWxkIFwicGVyaW9kc1wiIGFuZCBvbiBkb3duIHZpYSBcInVwZGF0ZXNcIiBhbmQgXCJjb21tZW50c1wiLlxuICAgICAgICBUaGlzIGRhdGEgc3RydWN0dXJlIGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHdob2xlIHRyZWUgb2YgY29tcG9uZW50cyBlYWNoIGxldmVsIHBhc3NpbmcgdGhlXG4gICAgICAgIGNoaWxkIGxpc3QgYXMgdGhlIHByb3AgXCJpdGVtc1wiXG4gICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyQ2hpbGRyZW4ocGFyZW50cywgZmllbGROYW1lcywgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBIZWxwZXIgZnVuY3Rpb24gdGhhdCBsaW5rcyB0d28gbGV2ZWxzIGluIHRoZSBkYXRhIHRyZWUuIFRoZSBsaW5raW5nIGlzIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgZm9yZWlnbiBrZXkgZmllbGQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY2hpbGQgYmVpbmcgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcGFyZW50IG9iamVjdFxuICAgICAgICAgICAgUGFyYW1zOlxuICAgICAgICAgICAgICAgIHBhcmVudHM6IGxpc3Qgb2YgcGFyZW50IG9iamVjdHMuIEVhY2ggcGFyZW50IG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyBmaWVsZCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgaG9sZHMgdGhlIGxpc3Qgb2YgYXNzb2NpYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXM6IG9iamVjdCB3aXRoIHR3byBmaWVsZHMsIFwicGFyZW50XCIgYW5kIFwiY2hpbGRyZW5cIiB0aGF0IGhvbGQgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICB0aGUgZmllbGRzIGxpbmtpbmcgdGhlIHR3byBsZXZlbHMgb2Ygb2JqZWN0cy5cbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbGlzdCBvZiBhbGwgY2hpbGQgb2JqZWN0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMgJiYgcGFyZW50cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFtmaWVsZE5hbWVzLmNoaWxkcmVuXSA9IGNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9PiBjaGlsZFtmaWVsZE5hbWVzLnBhcmVudF0gPT09IHBhcmVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEFkZCB0aGUgZmllbGQgXCJhY3R1YWxfdmFsdWVcIiB0byBlYWNoIHBlcmlvZCB1cGRhdGUsIHdoaWNoIGlzIHRoZSBzdW0gb2YgYWxsIHVwZGF0ZVxuICAgICAgICAgICAgdmFsdWVzIHVwIHRvIHRoaXMgcG9pbnQgaW4gdGltZS4gTm90ZSB0aGF0IHRoaXMgZmllbGQgZXhpc3RzIGluIHRoZSBkYXRhc2V0IGFzXG4gICAgICAgICAgICB1cGRhdGUucGVyaW9kX2FjdHVhbF92YWx1ZSBidXQgd2UgY2FuJ3QgdXNlIHRoYXQgc2luY2Ugd2Ugd2FudCB0byBiZSBhYmxlIHRvXG4gICAgICAgICAgICAocmUpLWNhbGN1bGF0ZSBvbiBkYXRhIGNoYW5nZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwZXJpb2RzICYmIHBlcmlvZHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVyaW9kLnVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxfdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyaW9kLnVwZGF0ZXMgPSBwZXJpb2QudXBkYXRlcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVsnYWN0dWFsX3ZhbHVlJ10gPSBwYXJzZUludCh1cGRhdGUuZGF0YSkgKyBhY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbF92YWx1ZSA9IHVwZGF0ZS5hY3R1YWxfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVJbmRleChvYmopIHtcbiAgICAgICAgICAgIC8vIFR1cm4gdGhlIGluZGV4ZWQgbW9kZWwgYmFjayB0byBhIGxpc3Qgb2YgbW9kZWwgb2JqZWN0XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG9mIG1vZGVscyBmcm9tIHRoZSBsb3dlc3QgbGV2ZWwgKENvbW1lbnQpIGFuZCB1cCB0byBSZXN1bHRcbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5zdGF0ZS5tb2RlbHM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnVwZGF0ZXMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJkYXRhXCIsIGNoaWxkcmVuOiBPQkpFQ1RTX0NPTU1FTlRTfSxcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLmNvbW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBlcmlvZHMgPSBmaWx0ZXJDaGlsZHJlbihcbiAgICAgICAgICAgIGRlSW5kZXgobW9kZWxzLnBlcmlvZHMpLFxuICAgICAgICAgICAge3BhcmVudDogXCJwZXJpb2RcIiwgY2hpbGRyZW46IE9CSkVDVFNfVVBEQVRFU30sXG4gICAgICAgICAgICB1cGRhdGVzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGVkX3BlcmlvZHMgPSBhbm5vdGF0ZVVwZGF0ZXMocGVyaW9kcyk7XG5cbiAgICAgICAgY29uc3QgaW5kaWNhdG9ycyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuaW5kaWNhdG9ycyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImluZGljYXRvclwiLCBjaGlsZHJlbjogT0JKRUNUU19QRVJJT0RTfSxcbiAgICAgICAgICAgIGFubm90YXRlZF9wZXJpb2RzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucmVzdWx0cyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInJlc3VsdFwiLCBjaGlsZHJlbjogT0JKRUNUU19JTkRJQ0FUT1JTfSxcbiAgICAgICAgICAgIGluZGljYXRvcnNcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5zdGF0ZS5yZXN1bHRzRGF0YVRyZWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIGxvYWRNb2RlbDogdGhpcy5sb2FkTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHVwZGF0ZU1vZGVsOiB0aGlzLnVwZGF0ZU1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICBkZWxldGVGcm9tTW9kZWw6IHRoaXMuZGVsZXRlRnJvbU1vZGVsLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjdXJyZW50VXNlcjogdGhpcy5jdXJyZW50VXNlci5iaW5kKHRoaXMpXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIHRoaXMuc3RhdGUubW9kZWxzLnJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZXN1bHRzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt0cmVlfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e2NhbGxiYWNrc30vPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHA+Tm8gaXRlbXM8L3A+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoPEFwcC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJlc3VsdHMtZnJhbWV3b3JrJykpO1xufSk7IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQge2xldmVsfSBmcm9tICcuL0xldmVsLmpzeCdcblxuaW1wb3J0IHtsZXZlbFRvZ2dsZX0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge09CSkVDVFNfQ09NTUVOVFN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5jb25zdCBDb21tZW50SGVhZGVyID0gKHtpdGVtOiBjb21tZW50fSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAge1wiQ29tbWVudDogXCIgKyBjb21tZW50LmNvbW1lbnR9XG4gICAgICAgIDwvc3Bhbj5cbiAgICApXG59O1xuXG5cbmNsYXNzIENvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogT0JKRUNUU19DT01NRU5UU307XG4gICAgfVxuXG4gICAgLy8gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJDb21tZW50cy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBuZXh0UHJvcHMucHJvcGFnYXRlOiBcIiArIEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5wcm9wYWdhdGUpKTtcbiAgICAvLyB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PkJ5OiB7Y29tbWVudC51c2VyX2RldGFpbHMuZmlyc3RfbmFtZX08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkNvbW1lbnQucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxldmVsKENvbW1lbnRIZWFkZXIsIENvbW1lbnQpO1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQge2xldmVsfSBmcm9tICcuL0xldmVsLmpzeCc7XG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4JztcblxuaW1wb3J0IHtffWZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtPQkpFQ1RTX0lORElDQVRPUlN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5cbmNvbnN0IEluZGljYXRvckhlYWRlciA9ICh7aXRlbTogaW5kaWNhdG9yfSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAge1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfVxuICAgICAgICA8L3NwYW4+XG4gICAgKVxufTtcblxuSW5kaWNhdG9ySGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmNvbnN0IEluZGljYXRvckNvbnRlbnQgPSAoe2luZGljYXRvcn0pID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICB7XygnYmFzZWxpbmVfeWVhcicpfToge2luZGljYXRvci5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAge18oJ2Jhc2VsaW5lX3ZhbHVlJyl9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkluZGljYXRvckNvbnRlbnQucHJvcFR5cGVzID0ge1xuICAgIGluZGljYXRvcjogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuXG5jbGFzcyBJbmRpY2F0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogT0JKRUNUU19JTkRJQ0FUT1JTfTtcbiAgICB9XG5cbiAgICAvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkluZGljYXRvci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBuZXh0UHJvcHMucHJvcGFnYXRlOiBcIiArIEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5wcm9wYWdhdGUpKTtcbiAgICAvLyB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGluZGljYXRvciA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPEluZGljYXRvckNvbnRlbnQgaW5kaWNhdG9yPXtpbmRpY2F0b3J9Lz5cbiAgICAgICAgICAgICAgICA8UGVyaW9kc1xuICAgICAgICAgICAgICAgICAgICBpdGVtcz17aW5kaWNhdG9yLnBlcmlvZHN9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9XG4gICAgICAgICAgICAgICAgICAgIHByb3BhZ2F0ZT17dGhpcy5wcm9wcy5wcm9wYWdhdGV9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuSW5kaWNhdG9yLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbGV2ZWwoSW5kaWNhdG9ySGVhZGVyLCBJbmRpY2F0b3IpOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb2xsYXBzZSwge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IHtpZGVudGljYWxBcnJheXN9IGZyb20gJy4vdXRpbHMuanMnXG5cbmNvbnN0IFRvZ2dsZUJ1dHRvbiA9ICh7b25DbGljaywgbGFiZWx9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGEgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgPC9hPlxuICAgIClcbn07XG5cblRvZ2dsZUJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBQUk9QQUdBVEVfTk8gPSBmYWxzZSxcbiAgICAgIFBST1BBR0FURV9PUEVOID0gJ29wZW4nLFxuICAgICAgUFJPUEFHQVRFX0NMT1NFID0gJ2Nsb3NlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxldmVsKEhlYWRlciwgQ29udGVudCkge1xuXG4gICAgZnVuY3Rpb24gaXRlbUlEc0FycmF5KGl0ZW1zKSB7XG4gICAgICAgIC8vIFJldHVybiBhbiBhcnJheSB3aXRoIGl0ZW0gSURzIGFzIGFzIHN0aW5ncywgdGhlIHNhbWUgZm9ybWF0IGFzIENvbGxhcHNlLmFjdGl2ZUtleVxuICAgICAgICBpZiAoaXRlbXMpXG4gICAgICAgICAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtKSA9PiBpdGVtLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgIGxldCBhY3RpdmVLZXkgPSBbXTtcbiAgICAgICAgICAgIGlmIChwcm9wcy5wcm9wYWdhdGUgPT0gUFJPUEFHQVRFX09QRU4gJiYgdGhpcy5wcm9wcy5pdGVtcykge1xuICAgICAgICAgICAgICAgIGFjdGl2ZUtleSA9IGl0ZW1JRHNBcnJheSh0aGlzLnByb3BzLml0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7YWN0aXZlS2V5OiBhY3RpdmVLZXksIHByb3BhZ2F0ZTogcHJvcHMucHJvcGFnYXRlIHx8IFBST1BBR0FURV9OT307XG5cbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLm9wZW5BbGwgPSB0aGlzLm9wZW5BbGwuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VBbGwgPSB0aGlzLmNsb3NlQWxsLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAvLyB0aGlzLnRvZ2dsZVBhbmVscyA9IHRoaXMudG9nZ2xlUGFuZWxzO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVBbGwgPSB0aGlzLnRvZ2dsZUFsbC5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiTGV2ZWwuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogbmV4dFByb3BzLnByb3BhZ2F0ZTogXCIgKyBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMucHJvcGFnYXRlKSk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBvbkNoYW5nZShhY3RpdmVLZXkpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2Ygb3BlbiBwYW5lbHNcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3BlbkFsbChzZXRQcm9wYWdhdGU9ZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcztcbiAgICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHthY3RpdmVLZXk6IGl0ZW1JRHNBcnJheShpdGVtcyl9O1xuICAgICAgICAgICAgaWYgKHNldFByb3BhZ2F0ZSkge1xuICAgICAgICAgICAgICAgIG5leHRTdGF0ZS5wcm9wYWdhdGUgPSBQUk9QQUdBVEVfT1BFTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VBbGwoc2V0UHJvcGFnYXRlPWZhbHNlKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0U3RhdGUgPSB7YWN0aXZlS2V5OiBbXX07XG4gICAgICAgICAgICBpZiAoc2V0UHJvcGFnYXRlKSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlLnByb3BhZ2F0ZSA9IFBST1BBR0FURV9DTE9TRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV4dFN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZVBhbmVscyhzZXRQcm9wYWdhdGUpIHtcbiAgICAgICAgICAgIC8vIElmIGFjdGl2ZUtleSBob2xkcyBhbGwgaXRlbXMnIElEcyB0aGVuIGFsbCBQYW5lbHMgYXJlIG9wZW4gYW5kIHdlIHNob3VsZFxuICAgICAgICAgICAgLy8gY2xvc2UgdGhlbSwgb3RoZXJ3aXNlIHdlIG9wZW4gYWxsIFBhbmVsc1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlS2V5ID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXk7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgICAgICBpZiAoaWRlbnRpY2FsQXJyYXlzKGFjdGl2ZUtleSwgaXRlbUlEc0FycmF5KGl0ZW1zKSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQWxsKHNldFByb3BhZ2F0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkFsbChzZXRQcm9wYWdhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlQWxsKCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQYW5lbHModHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgLy8gQ29tYmluZSBhY3RpdmVLZXkgd2l0aCBwcm9wcy5uZXdLZXlzIHRvIGNyZWF0ZSBhIG5ldyBhY3RpdmVLZXlcbiAgICAgICAgICAgIC8vIEN1cnJlbnRseSB1c2VkIGluIFBlcmlvZCB0byBvcGVuIGEgbmV3IHVwZGF0ZSBmb3JtIHdoZW4gaXQncyBjcmVhdGVkXG4gICAgICAgICAgICBpZiAobmV4dFByb3BzLm5ld0tleXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXk6IHVwZGF0ZSh0aGlzLnN0YXRlLmFjdGl2ZUtleSwgeyRwdXNoOiBuZXh0UHJvcHMubmV3S2V5c30pfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXh0UHJvcHMucHJvcGFnYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wcy5wcm9wYWdhdGUgPT0gUFJPUEFHQVRFX09QRU4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuQWxsKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXh0UHJvcHMucHJvcGFnYXRlID09IFBST1BBR0FURV9DTE9TRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyUGFuZWxzKGl0ZW1zLCBwcm9wYWdhdGUsIHByb3BzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGl0ZW1zLm1hcChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZTogSSd2ZSB0cmllZCB0byBoYXZlIHRoZSBQYW5lbCBpbiB0aGUgcmVzcGVjdGl2ZSBDb250ZW50IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCByZW5kZXIgPENvbnRlbnQgLz4gaGVyZSwgYnV0IGl0IHNlZW1zIFBhbmVsIGRvZXNuJ3QgbGlrZSBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VwYXJhdGVkIGZyb20gQ29sbGFwc2UgYnkgYW55IGNvbXBvbmVudCBiZXR3ZWVuIHRoZW0gc28gSSBnYXZlIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9ezxIZWFkZXIgaXRlbT17aXRlbX0gey4uLnByb3BzfS8+fSBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udGVudCBrZXk9e2l0ZW0uaWR9IGl0ZW09e2l0ZW19IHByb3BhZ2F0ZT17cHJvcGFnYXRlfSBjYWxsYmFja3M9e3Byb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9nZ2xlQnV0dG9uIG9uQ2xpY2s9e3RoaXMudG9nZ2xlUGFuZWxzLmJpbmQodGhpcywgZmFsc2UpfSBsYWJlbD1cIitcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9nZ2xlQnV0dG9uIG9uQ2xpY2s9e3RoaXMudG9nZ2xlQWxsfSBsYWJlbD1cIisrXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbGxhcHNlIGFjdGl2ZUtleT17dGhpcy5zdGF0ZS5hY3RpdmVLZXl9IG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJQYW5lbHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnByb3BhZ2F0ZSB8fCB0aGlzLnByb3BzLnByb3BhZ2F0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJyYy1jb2xsYXBzZVwiO1xuaW1wb3J0IHVwZGF0ZSAgZnJvbSAnaW1tdXRhYmlsaXR5LWhlbHBlcic7XG5cbmltcG9ydCB7bGV2ZWx9IGZyb20gXCIuL0xldmVsLmpzeFwiO1xuaW1wb3J0IHtVcGRhdGVzLCBOZXdVcGRhdGVCdXR0b259IGZyb20gXCIuL1VwZGF0ZXMuanN4XCI7XG5cbmltcG9ydCB7ZGlzcGxheURhdGUsIEFQSUNhbGwsIGVuZHBvaW50c30gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCB7T0JKRUNUU19QRVJJT0RTLCBPQkpFQ1RTX1VQREFURVN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5cbmNsYXNzIFBlcmlvZExvY2tUb2dnbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubG9ja1RvZ2dsZSA9IHRoaXMubG9ja1RvZ2dsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge2xvY2tpbmc6IGZhbHNlfTtcbiAgICB9XG5cbiAgICBiYXNlUGVyaW9kU2F2ZShwZXJpb2RJZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQmFzZSBmdW5jdGlvbiBmb3Igc2F2aW5nIGEgcGVyaW9kIHdpdGggYSBkYXRhIE9iamVjdC5cbiAgICAgICAgY29uc3QgdXJsID0gZW5kcG9pbnRzLnBlcmlvZChwZXJpb2RJZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19QRVJJT0RTLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2ssIGlmIG5vdCB1bmRlZmluZWQuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFQSUNhbGwoJ1BBVENIJywgdXJsLCBkYXRhLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGxvY2tpbmdUb2dnbGUobG9ja2luZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtsb2NraW5nOiBsb2NraW5nfSk7XG4gICAgfVxuXG4gICAgbm90TG9ja2luZygpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBsb2NrVG9nZ2xlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja2luZ1RvZ2dsZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVBlcmlvZFNhdmUodGhpcy5wcm9wcy5wZXJpb2QuaWQsIHtsb2NrZWQ6ICF0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWR9LCB0aGlzLm5vdExvY2tpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBpY29uLCBsYWJlbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtc3Bpbm5lclwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvYWRpbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnBlcmlvZC5sb2NrZWQpIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9eydmYSBmYS1sb2NrJ30vPjtcbiAgICAgICAgICAgIGxhYmVsID0gXCJVbmxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtdW5sb2NrLWFsdFwiIC8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIkxvY2sgcGVyaW9kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMubG9ja1RvZ2dsZX1cbiAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3tmbG9hdDogJ3JpZ2h0JywgbWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAge2ljb259XG4gICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICApXG4gICAgfVxufVxuXG5QZXJpb2RMb2NrVG9nZ2xlLnByb3BUeXBlcyA9IHtcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmNvbnN0IHBlcmlvZEFjdHVhbFZhbHVlID0gKHBlcmlvZCkgPT4ge1xuICAgIHJldHVybiBwZXJpb2QudXBkYXRlcyAmJiBwZXJpb2QudXBkYXRlcy5sZW5ndGggPiAwID9cbiAgICAgICAgcGVyaW9kLnVwZGF0ZXNbcGVyaW9kLnVwZGF0ZXMubGVuZ3RoLTFdLmFjdHVhbF92YWx1ZVxuICAgIDpcbiAgICAgICAgXCJcIjtcbn07XG5cbmNvbnN0IFBlcmlvZEhlYWRlciA9ICh7aXRlbTogcGVyaW9kLCBjYWxsYmFja3N9KSA9PiB7XG4gICAgY29uc3QgcGVyaW9kU3RhcnQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX3N0YXJ0KTtcbiAgICBjb25zdCBwZXJpb2RFbmQgPSBkaXNwbGF5RGF0ZShwZXJpb2QucGVyaW9kX2VuZCk7XG4gICAgY29uc3QgcGVyaW9kRGF0ZSA9IGAke3BlcmlvZFN0YXJ0fSAtICR7cGVyaW9kRW5kfWA7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICBQZXJpb2Q6IHtwZXJpb2REYXRlfSB8XG4gICAgICAgICAgICAgICAgVGFyZ2V0IHZhbHVlOiB7cGVyaW9kLnRhcmdldF92YWx1ZX0gfFxuICAgICAgICAgICAgICAgIEFjdHVhbCB2YWx1ZToge3BlcmlvZEFjdHVhbFZhbHVlKHBlcmlvZCl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8UGVyaW9kTG9ja1RvZ2dsZSBwZXJpb2Q9e3BlcmlvZH0gY2FsbGJhY2tzPXtjYWxsYmFja3N9Lz5cbiAgICAgICAgPC9zcGFuPlxuICAgIClcbn07XG5cblBlcmlvZEhlYWRlci5wcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cblxuZXhwb3J0IGNsYXNzIFBlcmlvZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbW9kZWw6IE9CSkVDVFNfUEVSSU9EUyxcbiAgICAgICAgICAgIG5ld0tleXM6IFtdIC8vIEtlZXAgdHJhY2sgb2Yga2V5cyBmb3IgbmV3IHVwZGF0ZXMsIHVzZWQgdG8gb3BlbiB0aGUgVXBkYXRlRm9ybVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wZW5OZXdGb3JtID0gdGhpcy5vcGVuTmV3Rm9ybS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiUGVyaW9kcy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBuZXh0UHJvcHMucHJvcGFnYXRlOiBcIiArIEpTT04uc3RyaW5naWZ5KG5leHRQcm9wcy5wcm9wYWdhdGUpKTtcbiAgICAvLyB9XG5cbiAgICBvcGVuTmV3Rm9ybShuZXdLZXksIGRhdGEpIHtcbiAgICAgICAgLy8gQWRkIHRoZSBrZXkgZm9yIGEgbmV3IHVwZGF0ZSB0byB0aGUgbGlzdCBvZiBvcGVuIHBhbmVsc1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge25ld0tleXM6IHVwZGF0ZSh0aGlzLnN0YXRlLm5ld0tleXMsIHskcHVzaDogW25ld0tleV19KX0sXG4gICAgICAgICAgICAvLyBPbmx5IHdoZW4gdGhlIGFjdGl2ZUtleSBzdGF0ZSBpcyBjb21taXR0ZWQgZG8gd2UgdXBkYXRlIHRoZSB1cGRhdGVzIG1vZGVsXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBwZXJpb2QgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIGNvbnN0IHVwZGF0ZUNhbGxiYWNrcyA9IHVwZGF0ZSh0aGlzLnByb3BzLmNhbGxiYWNrcywgeyRtZXJnZToge29uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlfX0pO1xuICAgICAgICBjb25zdCBidXR0b25DYWxsYmFja3MgPSB1cGRhdGUodGhpcy5wcm9wcy5jYWxsYmFja3MsIHskbWVyZ2U6IHtvcGVuTmV3Rm9ybTogdGhpcy5vcGVuTmV3Rm9ybX19KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3BlcmlvZC51cGRhdGVzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3VwZGF0ZUNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgbmV3S2V5cz17dGhpcy5zdGF0ZS5uZXdLZXlzfVxuICAgICAgICAgICAgICAgICAgICBwcm9wYWdhdGU9e3RoaXMucHJvcHMucHJvcGFnYXRlfS8+XG4gICAgICAgICAgICAgICAgPE5ld1VwZGF0ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e2J1dHRvbkNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUGVyaW9kLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbGV2ZWwoUGVyaW9kSGVhZGVyLCBQZXJpb2QpOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCc7XG5cbmltcG9ydCB7bGV2ZWx9IGZyb20gJy4vTGV2ZWwuanN4JztcbmltcG9ydCB7T0JKRUNUU19SRVNVTFRTfSBmcm9tICcuL2NvbnN0LmpzJztcblxuXG5jb25zdCBSZXN1bHRIZWFkZXIgPSAoe2l0ZW06IHJlc3VsdH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIHtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9XG4gICAgICAgIDwvc3Bhbj5cbiAgICApXG59O1xuXG5SZXN1bHRIZWFkZXIucHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cblxuY2xhc3MgUmVzdWx0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IE9CSkVDVFNfUkVTVUxUU307XG4gICAgfVxuXG4gICAgLy8gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJSZXN1bHQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogbmV4dFByb3BzLnByb3BhZ2F0ZTogXCIgKyBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMucHJvcGFnYXRlKSk7XG4gICAgLy8gfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgcHJvcGFnYXRlPXt0aGlzLnByb3BzLnByb3BhZ2F0ZX0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZXN1bHQucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbChSZXN1bHRIZWFkZXIsIFJlc3VsdCk7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IHtsZXZlbH0gZnJvbSBcIi4vTGV2ZWwuanN4XCI7XG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9Db21tZW50cy5qc3gnO1xuXG5pbXBvcnQge1xuICAgIEFQSUNhbGwsIGVuZHBvaW50cywgZGlzcGxheURhdGUsIGRpc3BsYXlOdW1iZXIsIF8sIGN1cnJlbnRVc2VyLCBpc05ld1VwZGF0ZX0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge1xuICAgIFNUQVRVU19EUkFGVF9DT0RFLCBTVEFUVVNfQVBQUk9WRURfQ09ERSwgT0JKRUNUU19VUERBVEVTLCBPQkpFQ1RTX0NPTU1FTlRTfSBmcm9tICcuL2NvbnN0LmpzJztcblxuXG5jb25zdCBVcGRhdGVEaXNwbGF5ID0gKHt1cGRhdGV9KSA9PiB7XG4gICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgKyBcIiBcIiArIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICBXaGVuOiB7ZGlzcGxheURhdGUodXBkYXRlLmNyZWF0ZWRfYXQpfSB8XG4gICAgICAgICAgICBCeToge3VzZXJOYW1lfSB8XG4gICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgU3RhdHVzOiB7XygndXBkYXRlX3N0YXR1c2VzJylbdXBkYXRlLnN0YXR1c119IDxici8+XG4gICAgICAgICAgICBVcGRhdGUgdmFsdWU6IHt1cGRhdGUuZGF0YX0gfCB7LypcbiAgICAgICAgIE5PVEU6IHdlIHVzZSB1cGRhdGUuYWN0dWFsX3ZhbHVlLCBhIHZhbHVlIGNhbGN1bGF0ZWQgaW4gQXBwLmFubm90YXRlVXBkYXRlcygpLFxuICAgICAgICAgbm90IHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgICAgICovfVxuICAgICAgICAgICAgQWN0dWFsIHRvdGFsIGZvciB0aGlzIHBlcmlvZCAoaW5jbHVkaW5nIHRoaXMgdXBkYXRlKToge3VwZGF0ZS5hY3R1YWxfdmFsdWV9XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZURpc3BsYXkucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGlzTmV3VXBkYXRlKHByb3BzLnVwZGF0ZSl9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmZvcm1Ub2dnbGV9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge18oJ2VkaXRfdXBkYXRlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mb3JtT3BlbiA/XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU9e3RoaXMuZm9ybVRvZ2dsZX0vPlxuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZURpc3BsYXkgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGUucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IFVwZGF0ZUhlYWRlciA9ICh7aXRlbTogdXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICBVcGRhdGU6IHt1c2VyTmFtZX0gYXQge29yZ2FuaXNhdGlvbn0sXG4gICAgICAgICAgICBEYXRhOiB7dXBkYXRlLmRhdGF9IFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfVxuICAgICAgICA8L3NwYW4+XG4gICAgKVxufTtcblxuVXBkYXRlSGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmNsYXNzIFVwZGF0ZXNCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IE9CSkVDVFNfVVBEQVRFU31cbiAgICB9XG5cbiAgICAvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogbmV4dFByb3BzLnByb3BhZ2F0ZTogXCIgKyBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMucHJvcGFnYXRlKSk7XG4gICAgLy8gfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt1cGRhdGV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17dGhpcy5wcm9wcy5jYWxsYmFja3N9Lz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXt1cGRhdGUuY29tbWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wYWdhdGU9e3RoaXMucHJvcHMucHJvcGFnYXRlfS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblVwZGF0ZXNCYXNlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxufTtcblxuZXhwb3J0IGNvbnN0IFVwZGF0ZXMgPSBsZXZlbChVcGRhdGVIZWFkZXIsIFVwZGF0ZXNCYXNlKTtcblxuXG5jb25zdCBIZWFkZXIgPSAoe3VwZGF0ZX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICBTdGF0dXM6IHtfKCd1cGRhdGVfc3RhdHVzZXMnKVt1cGRhdGUuc3RhdHVzXX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlSW5wdXQgPSAoe3VwZGF0ZSwgdXBkYXRlZEFjdHVhbFZhbHVlLCBvbkNoYW5nZX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYWN0dWFsVmFsdWVcIj57XygnYWRkX3RvX2FjdHVhbF92YWx1ZScpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZGF0YVwiXG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1cGRhdGUuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17XygnaW5wdXRfcGxhY2Vob2xkZXInKX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBBY3R1YWxWYWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XygndG90YWxfdmFsdWVfYWZ0ZXJfdXBkYXRlJyl9OlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtZGF0YVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3VwZGF0ZWRBY3R1YWxWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuQWN0dWFsVmFsdWVJbnB1dC5wcm9wVHlwZXMgPSB7XG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZURlc2NyaXB0aW9uID0gKHt1cGRhdGUsIG9uQ2hhbmdlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy05IHVwZGF0ZS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZGVzY3JpcHRpb25cIj57XygnYWN0dWFsX3ZhbHVlX2NvbW1lbnQnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dXBkYXRlLnRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17XygnY29tbWVudF9wbGFjZWhvbGRlcicpfT5cbiAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZURlc2NyaXB0aW9uLnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQXR0YWNobWVudHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW1hZ2VVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jYW1lcmFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkFkZCBpbWFnZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWxlVXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1wYXBlcmNsaXBcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkF0dGFjaCBmaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgVXBkYXRlRm9ybUJ1dHRvbnMgPSAoe3VwZGF0ZSwgY2FsbGJhY2tzfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudUFjdGlvblwiPlxuICAgICAgICB7IWlzTmV3VXBkYXRlKHVwZGF0ZSkgP1xuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwicmVtb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmRlbGV0ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdkZWxldGUnKX08L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgOiAnJ31cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYtcGlsbHMgYm90dG9tUm93IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiY2FuY2VsVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5vbkNhbmNlbH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGJ0bi14c1wiPntfKCdjYW5jZWwnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cInNhdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJzYXZlXCIgb25DbGljaz17Y2FsbGJhY2tzLnNhdmVVcGRhdGV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57Xygnc2F2ZScpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiYXBwcm92ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBpZD1cImFwcHJvdmVcIiBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdhcHByb3ZlJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuVXBkYXRlRm9ybUJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IHBydW5lRm9yUEFUQ0ggPSAodXBkYXRlKSA9PiB7XG4gICAgLy8gT25seSBpbmNsdWRlIHRoZSBsaXN0ZWQgZmllbGRzIHdoZW4gUEFUQ0hpbmcgYW4gdXBkYXRlXG4gICAgLy8gY3VycmVudGx5IHRoZSBsaXN0IG1pbWljcyB0aGUgb2xkIE15UmVzdWx0cyBkYXRhXG4gICAgY29uc3QgZmllbGRzID0gWydkYXRhJywgJ3RleHQnLCAncmVsYXRpdmVfZGF0YScsICdzdGF0dXMnXTtcbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYWNjLCBmKSA9PiB7cmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCB7W2ZdOiB1cGRhdGVbZl19KX0sIHt9KTtcbn07XG5cbmNvbnN0IHBydW5lRm9yUE9TVCA9ICh1cGRhdGUpID0+IHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGxpc3RlZCBmaWVsZHMgd2hlbiBQT1NUaW5nIGFuIHVwZGF0ZVxuICAgIGxldCB1cGRhdGVGb3JQT1NUID0gT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlKTtcbiAgICBkZWxldGUgdXBkYXRlRm9yUE9TVFsndXNlcl9kZXRhaWxzJ107XG4gICAgcmV0dXJuIHVwZGF0ZUZvclBPU1Q7XG59O1xuXG5jbGFzcyBVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgLy8gU2F2ZSBvcmlnaW5hbCB1cGRhdGVcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtvcmlnaW5hbFVwZGF0ZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy51cGRhdGUpfTtcbiAgICAgICAgdGhpcy5zYXZlVXBkYXRlID0gdGhpcy5zYXZlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVsZXRlVXBkYXRlID0gdGhpcy5kZWxldGVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNhbmNlbCA9IHRoaXMub25DYW5jZWwuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBvbkNoYW5nZShlKSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIGZvcm0gZmllbGQgd2lkZ2V0cyBjaGFuZ2UsIG1vZGlmeSB0aGUgbW9kZWwgZGF0YSBpbiBBcHAuc3RhdGVbbW9kZWxdXG4gICAgICAgIGNvbnN0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFxuICAgICAgICAgICAgT0JKRUNUU19VUERBVEVTLCB1cGRhdGUodGhpcy5wcm9wcy51cGRhdGUsIHskbWVyZ2U6IHtbZmllbGRdOiBlLnRhcmdldC52YWx1ZX19KSk7XG4gICAgfVxuXG4gICAgb25DYW5jZWwoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnN0YXRlLm9yaWdpbmFsVXBkYXRlO1xuICAgICAgICBpZiAoaXNOZXdVcGRhdGUodXBkYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MuZGVsZXRlRnJvbU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlLmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoZSkge1xuICAgICAgICBsZXQgdXBkYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy51cGRhdGUpO1xuICAgICAgICAvLyBBbGwgY2hhbmdlcyB0byBhbiB1cGRhdGUgcmV2ZXJ0IGl0IHRvIGRyYWZ0IHVubGVzcyBpdCBpcyBleHBsaWNpdGx5IGFwcHJvdmVkIHdoaWxlIHNhdmluZ1xuICAgICAgICBpZiAoZS50YXJnZXQuaWQgPT0gJ2FwcHJvdmUnKSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0FQUFJPVkVEX0NPREU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0RSQUZUX0NPREU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIC8vIEFsd2F5cyBzYXZlIHRoZSBpbnN0YW5jZSB1c2luZyBkYXRhIGNvbWluZyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAgICAvLyBUT0RPOiBsb29rIGF0IGhhdmluZyBhIHJlcGxhY2VNb2RlbCBtZXRob2Q/XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5kZWxldGVGcm9tTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUuaWQpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlzTmV3VXBkYXRlKHVwZGF0ZSkpIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BPU1QnLCBlbmRwb2ludHMudXBkYXRlc19hbmRfY29tbWVudHMoKSxcbiAgICAgICAgICAgICAgICAgICAgcHJ1bmVGb3JQT1NUKHVwZGF0ZSksIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQQVRDSCcsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKHVwZGF0ZS5pZCksXG4gICAgICAgICAgICAgICAgICAgIHBydW5lRm9yUEFUQ0godXBkYXRlKSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZVVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtpZDogdGhpcy5wcm9wcy51cGRhdGUuaWR9O1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEsIHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIEFQSUNhbGwoJ0RFTEVURScsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKGRhdGEuaWQpLCBudWxsLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHByZXZpb3VzQWN0dWFsVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBkYXRlLmFjdHVhbF92YWx1ZSAtIHRoaXMucHJvcHMudXBkYXRlLmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5wcm9wcy5wZXJpb2QudXBkYXRlcztcbiAgICAgICAgICAgIGlmICh1cGRhdGVzICYmIHVwZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdCA9IHVwZGF0ZXNbdXBkYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF0ZXN0LmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHBhcnNlRmxvYXQodGhpcy5wcm9wcy51cGRhdGUuZGF0YSA/IHRoaXMucHJvcHMudXBkYXRlLmRhdGEgOiAwKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFjdHVhbFZhbHVlID0gZGlzcGxheU51bWJlcih0aGlzLnByZXZpb3VzQWN0dWFsVmFsdWUoKSArIHVwZGF0ZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXIgZWRpdC1pbi1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZT17dXBkYXRlZEFjdHVhbFZhbHVlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZURlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEF0dGFjaG1lbnRzLz5cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1CdXR0b25zXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVVwZGF0ZTogdGhpcy5zYXZlVXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVVwZGF0ZTogdGhpcy5kZWxldGVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMub25DYW5jZWx9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmxldCBuZXdVcGRhdGVJRCA9IDE7XG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubmV3VXBkYXRlID0gdGhpcy5uZXdVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBuZXdVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLnByb3BzLmNhbGxiYWNrcy5jdXJyZW50VXNlcigpO1xuICAgICAgICBjb25zdCBpZCA9IGBuZXctJHtuZXdVcGRhdGVJRH1gO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgcGVyaW9kOiB0aGlzLnByb3BzLnBlcmlvZC5pZCxcbiAgICAgICAgICAgIHVzZXJfZGV0YWlsczogdXNlcixcbiAgICAgICAgICAgIHVzZXI6IHVzZXIuaWQsXG4gICAgICAgICAgICBkYXRhOiAwLFxuICAgICAgICAgICAgdGV4dDogJycsXG4gICAgICAgICAgICByZWxhdGl2ZV9kYXRhOiB0cnVlLFxuICAgICAgICAgICAgc3RhdHVzOiBTVEFUVVNfRFJBRlRfQ09ERVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5vcGVuTmV3Rm9ybShpZCwgZGF0YSk7XG4gICAgICAgIG5ld1VwZGF0ZUlEICs9IDE7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLm5ld1VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXBsdXMnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnbmV3X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlQnV0dG9uLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmV4cG9ydCBjb25zdFxuICAgIC8vIEZyb20gcnNyLm1vZGVscy5pbmRpY2F0b3IuSW5kaWNhdG9yUGVyaW9kRGF0YVxuICAgIFNUQVRVU19ORVdfQ09ERSA9ICdOJyxcbiAgICBTVEFUVVNfRFJBRlRfQ09ERSA9ICdEJyxcbiAgICBTVEFUVVNfUEVORElOR19DT0RFID0gJ1AnLFxuICAgIFNUQVRVU19SRVZJU0lPTl9DT0RFID0gJ1InLFxuICAgIFNUQVRVU19BUFBST1ZFRF9DT0RFID0gJ0EnLFxuXG5cbiAgICBPQkpFQ1RTX1JFU1VMVFMgPSAncmVzdWx0cycsXG4gICAgT0JKRUNUU19JTkRJQ0FUT1JTID0gJ2luZGljYXRvcnMnLFxuICAgIE9CSkVDVFNfUEVSSU9EUyA9ICdwZXJpb2RzJyxcbiAgICBPQkpFQ1RTX1VQREFURVMgPSAndXBkYXRlcycsXG4gICAgT0JKRUNUU19DT01NRU5UUyA9ICdjb21tZW50cycsXG4gICAgT0JKRUNUU19VU0VSUyA9ICd1c2Vycyc7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxubGV0IG1vbnRocztcblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aWNhbEFycmF5cyhhcnJheTEsIGFycmF5Mikge1xuICAgIC8vIENvbXBhcmUgdHdvIGFycmF5cyBhbmQgcmV0dXJuIHRydWUgaWYgdGhleSBhcmUgaWRlbnRpY2FsLCBvdGhlcndpc2UgZmFsc2VcbiAgICByZXR1cm4gKFxuICAgICAgICAoYXJyYXkxLmxlbmd0aCA9PSBhcnJheTIubGVuZ3RoKSAmJlxuICAgICAgICBhcnJheTEuZXZlcnkoKGVsZW1lbnQsIGluZGV4KSA9PiAoZWxlbWVudCA9PT0gYXJyYXkyW2luZGV4XSkpXG4gICAgKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RGF0ZShkYXRlU3RyaW5nKSB7XG4gICAgLy8gRGlzcGxheSBhIGRhdGVTdHJpbmcgbGlrZSBcIjI1IEphbiAyMDE2XCJcbiAgICBpZiAoIW1vbnRocykge1xuICAgICAgICBtb250aHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpMThuTW9udGhzJykuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgaWYgKGRhdGVTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbG9jYWxlID0gXCJlbi1nYlwiO1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVN0cmluZy5zcGxpdChcIi5cIilbMF0ucmVwbGFjZShcIi9cIiwgLy0vZykpO1xuICAgICAgICBjb25zdCBkYXkgPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBtb250aHNbZGF0ZS5nZXRVVENNb250aCgpXTtcbiAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgICAgcmV0dXJuIGRheSArIFwiIFwiICsgbW9udGggKyBcIiBcIiArIHllYXI7XG4gICAgfVxuICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIHZhciBjb29raWVWYWx1ZSA9IG51bGw7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZSAmJiBkb2N1bWVudC5jb29raWUgIT09ICcnKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggKyAxKSA9PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFQSUNhbGwobWV0aG9kLCB1cmwsIGRhdGEsIGNhbGxiYWNrLCByZXRyaWVzKSB7XG4gICAgZnVuY3Rpb24gbW9kaWZ5KG1ldGhvZCwgdXJsLCBkYXRhKXtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBoYW5kbGVyO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBPU1RcIjpcbiAgICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiBtb2RpZnkoJ1BPU1QnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBVVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUFVUJywgdXJsLCBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJQQVRDSFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUEFUQ0gnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIkRFTEVURVwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZSgnY3NyZnRva2VuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBoYW5kbGVyKClcbiAgICAgICAgLy9UT0RPOiBlcnJvciBoYW5kbGluZz8gU2VlIGh0dHBzOi8vd3d3LnRqdmFudG9sbC5jb20vMjAxNS8wOS8xMy9mZXRjaC1hbmQtZXJyb3JzL1xuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xufVxuXG5cbi8vIE9iamVjdCBob2xkcyBjYWxsYmFjayBVUkwgZnVuY3Rpb25zIGFzIHZhbHVlcywgbW9zdCBvZiB0aGVtIGNhbGxlZCB3aXRoIGFuIGlkIHBhcmFtZXRlclxuLy8gVXNhZ2U6IGVuZHBvaW50cy5yZXN1bHQoMTcpIC0+IFwiaHR0cDovL3Jzci5ha3ZvLm9yZy9yZXN0L3YxL3Jlc3VsdC8xNy8/Zm9ybWF0PWpzb25cIlxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICAgICAgXCJyZXN1bHRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvcmVzdWx0LyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicmVzdWx0c1wiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvP2Zvcm1hdD1qc29uJnByb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImluZGljYXRvcnNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yLz9mb3JtYXQ9anNvbiZyZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInBlcmlvZHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8/Zm9ybWF0PWpzb24maW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcInVwZGF0ZXNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLz9mb3JtYXQ9anNvbiZwZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJjb21tZW50c1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfY29tbWVudC8/Zm9ybWF0PWpzb24mZGF0YV9fcGVyaW9kX19pbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2QvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVfYW5kX2NvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9mcmFtZXdvcmsvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJ1cGRhdGVzX2FuZF9jb21tZW50c1wiOiAoKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVzZXJcIjogKGlkKSA9PiBgL3Jlc3QvdjEvdXNlci8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInBhcnRuZXJzaGlwc1wiOiAoaWQpID0+IGAvcmVzdC92MS9wYXJ0bmVyc2hpcC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiZmlsZV91cGxvYWRcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhLyR7aWR9L3VwbG9hZF9maWxlLz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5TnVtYmVyKG51bWJlclN0cmluZykge1xuICAgIC8vIEFkZCBjb21tYXMgdG8gbnVtYmVycyBvZiAxMDAwIG9yIGhpZ2hlci5cbiAgICBpZiAobnVtYmVyU3RyaW5nICE9PSB1bmRlZmluZWQgJiYgbnVtYmVyU3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIHZhciBmbG9hdCA9IHBhcnNlRmxvYXQobnVtYmVyU3RyaW5nKTtcbiAgICAgICAgaWYgKCFpc05hTihmbG9hdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmbG9hdC50b0xvY2FsZVN0cmluZyhsb2NhbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxubGV0IHN0cmluZ3M7XG5cbi8vIFRyYW5zbGF0aW9uIGEgbGEgcHl0aG9uLiBMZXQncyBob3BlIHdlIG5ldmVyIG5lZWQgbG9kYXNoLi4uXG5leHBvcnQgZnVuY3Rpb24gXyhzKSB7XG4gICAgaWYgKCFzdHJpbmdzKSB7XG4gICAgICAgIHN0cmluZ3MgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2xhdGlvbi10ZXh0cycpLmlubmVySFRNTCk7XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmdzW3NdO1xufVxuXG5leHBvcnQgY29uc3QgaXNOZXdVcGRhdGUgPSAodXBkYXRlKSA9PiB7cmV0dXJuIHVwZGF0ZS5pZC50b1N0cmluZygpLnN1YnN0cigwLCA0KSA9PT0gJ25ldy0nfTtcblxuXG5jb25zdCBUb2dnbGVCdXR0b24gPSAoe29uQ2xpY2ssIGxhYmVsfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxhIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICBjbGFzc05hbWU9eydidG4gYnRuLXNtIGJ0bi1kZWZhdWx0J31cbiAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgIDwvYT5cbiAgICApXG59O1xuXG5Ub2dnbGVCdXR0b24ucHJvcFR5cGVzID0ge1xuICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufTtcblxuXG5leHBvcnQgZnVuY3Rpb24gbGV2ZWxUb2dnbGUoV3JhcHBlZENvbXBvbmVudCkge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7YWN0aXZlS2V5OiBbXSwgaXNPcGVuOiBmYWxzZX07XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVMZXZlbCA9IHRoaXMudG9nZ2xlTGV2ZWwuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQ2hhbmdlKGFjdGl2ZUtleSkge1xuICAgICAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBvcGVuIHBhbmVsc1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5fSk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVMZXZlbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuc3RhdGUuaXNPcGVuO1xuICAgICAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleTogW10sIGlzT3BlbjogIWlzT3Blbn0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5OiB0aGlzLnByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5pZC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiAhaXNPcGVuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxUb2dnbGVCdXR0b24gb25DbGljaz17dGhpcy50b2dnbGVMZXZlbH0gbGFiZWw9XCIrXCIvPlxuICAgICAgICAgICAgICAgICAgICA8V3JhcHBlZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlS2V5PXt0aGlzLnN0YXRlLmFjdGl2ZUtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
