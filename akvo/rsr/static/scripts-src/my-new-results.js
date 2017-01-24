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

    _createClass(Indicator, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel('periods');
        }
    }, {
        key: 'render',
        value: function render() {
            var indicator = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(IndicatorContent, { indicator: indicator }),
                _react2.default.createElement(_Periods2.default, {
                    items: indicator.periods,
                    callbacks: this.props.callbacks })
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

function level(Header, Content) {

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
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(newProps) {
                // Combine activeKey with props.newKeys to create a new activeKey
                // Currently used in Period to open a new update form when it's created
                if (newProps.newKeys) {
                    this.setState({ activeKey: (0, _immutabilityHelper2.default)(this.state.activeKey, { $push: newProps.newKeys }) });
                }
            }
        }, {
            key: 'renderPanels',
            value: function renderPanels(items, props) {
                return items.map(function (item) {
                    // Note: I've tried to have the Panel in the respective Content components
                    // and render <Content /> here, but it seems Panel doesn't like being
                    // separated from Collapse by any component between them so I gave up
                    return _react2.default.createElement(
                        _rcCollapse.Panel,
                        { header: _react2.default.createElement(Header, _extends({ item: item }, props)), key: item.id },
                        _react2.default.createElement(Content, _extends({ key: item.id, item: item }, props))
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
                        _react2.default.createElement(ToggleButton, { onClick: this.toggleLevel, label: '+' }),
                        _react2.default.createElement(
                            _rcCollapse2.default,
                            { activeKey: this.state.activeKey, onChange: this.onChange },
                            this.renderPanels(items, this.props)
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

},{"immutability-helper":"immutability-helper","rc-collapse":"rc-collapse","react":"react"}],5:[function(require,module,exports){
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

    _createClass(Period, [{
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
                    newKeys: this.state.newKeys }),
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

    _createClass(Result, [{
        key: 'render',
        value: function render() {
            var result = this.props.item;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_Indicators2.default, {
                    items: result.indicators,
                    callbacks: this.props.callbacks })
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

    _createClass(UpdatesBase, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.callbacks.loadModel(_const.OBJECTS_COMMENTS);
        }
    }, {
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
                        items: update.comments })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9BcHAuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvQ29tbWVudHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvSW5kaWNhdG9ycy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9MZXZlbC5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9QZXJpb2RzLmpzeCIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL1Jlc3VsdHMuanN4IiwiLi4vLi4vYWt2by9yc3Ivc3RhdGljL3NjcmlwdHMtc3JjL215LXJlc3VsdHMvVXBkYXRlcy5qc3giLCIuLi8uLi9ha3ZvL3Jzci9zdGF0aWMvc2NyaXB0cy1zcmMvbXktcmVzdWx0cy9jb25zdC5qcyIsIi4uLy4uL2Frdm8vcnNyL3N0YXRpYy9zY3JpcHRzLXNyYy9teS1yZXN1bHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ1FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7K2VBaEJBOzs7Ozs7O0FBb0JBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFrQjtBQUFBLFdBQU8sT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFxQjtBQUFBLGVBQU8sSUFBSSxHQUFKLENBQVA7QUFBQSxLQUFyQixDQUFQO0FBQUEsQ0FBbEM7O0lBR00sRzs7O0FBQ0YsaUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNULEtBRFM7O0FBRWYsWUFBTSxX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RUFBVjtBQUFBLHlCQUFyQixDQUREO0FBRVYsZ0NBQVEsQ0FBQztBQUZDLHFCQUFkO0FBSUg7QUFDSjtBQXZCTDtBQUFBO0FBQUEscUNBeUJhO0FBQ0wsdUJBQ0k7QUFBQTtBQUFBO0FBQ0ksa0RBQUMsWUFBRCxJQUFjLFNBQVMsS0FBSyxXQUE1QixFQUF5QyxPQUFNLEdBQS9DLEdBREo7QUFFSSxrREFBQyxnQkFBRDtBQUNJLG1DQUFXLEtBQUssS0FBTCxDQUFXLFNBRDFCO0FBRUksa0NBQVUsS0FBSztBQUZuQix1QkFHUSxLQUFLLEtBSGI7QUFGSixpQkFESjtBQVNIO0FBbkNMOztBQUFBO0FBQUEsTUFBcUIsZ0JBQU0sU0FBM0I7QUFxQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMuanN4JztcblxuaW1wb3J0IHtBUElDYWxsLCBlbmRwb2ludHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgICBPQkpFQ1RTX1JFU1VMVFMsIE9CSkVDVFNfSU5ESUNBVE9SUywgT0JKRUNUU19QRVJJT0RTLCBPQkpFQ1RTX1VQREFURVMsIE9CSkVDVFNfQ09NTUVOVFNcbn0gZnJvbSAnLi9jb25zdC5qcyc7XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzA2NjY5L1xuT2JqZWN0LnZhbHVlcyA9IE9iamVjdC52YWx1ZXMgfHwgKG9iaiA9PiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gb2JqW2tleV0pKTtcblxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgY29uc3QgaXNQdWJsaWMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR0aW5ncycpLmlubmVySFRNTCkucHVibGljO1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNsYXRpb24tdGV4dHMnKS5pbm5lckhUTUwpO1xuICAgICAgICBjb25zdCB1c2VySUQgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmRwb2ludC1kYXRhJykuaW5uZXJIVE1MKS51c2VySUQ7XG4gICAgICAgIGNvbnN0IHByb2plY3RJZHMgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LWlkcycpLmlubmVySFRNTCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbHM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBlcmlvZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1cGRhdGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tbWVudHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHRzRGF0YVRyZWU6IFtdLFxuICAgICAgICAgICAgcHJvamVjdDoge2lkOiBwcm9qZWN0SWRzLnByb2plY3RfaWR9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgdXBkYXRlcyBKU09OXG4gICAgICAgICAgICBkYXRhLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnMgPSBbZGF0YS5vcmdhbmlzYXRpb25dO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWxzOiB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHskbWVyZ2U6IHt1c2VyOiBkYXRhfX0pfSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEdldCBpbmZvIG9uIHRoZSBjdXJyZW50IHVzZXIuIFVzZWQgd2hlbiBwb3N0aW5nIGRhdGEsIGUuZy4gdXBkYXRlc1xuICAgICAgICAvLyBUT0RPOiBUaGlzIG1pZ2h0IG5vdCBiZSB0aGUgYmVzdCBwbGFjZSB0byBsb2FkIHVzZXIgZGF0YVxuICAgICAgICBBUElDYWxsKCdHRVQnLCBlbmRwb2ludHMudXNlcih1c2VySUQpLCAnJywgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQsIGxvYWQgdGhlIHJlc3VsdHMgdGhyb3VnaCB0aGUgQVBJXG4gICAgICAgIC8vVE9ETzogdGhpcyBcImNoYWluZWRcIiB3YXkgb2YgbG9hZGluZyB0aGUgQVBJIGRhdGEga2luZGEgdGVycmlibGUgYW5kIHNob3VsZCBiZSByZXBsYWNlZFxuICAgICAgICB0aGlzLmxvYWRNb2RlbChPQkpFQ1RTX1JFU1VMVFMpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbChPQkpFQ1RTX0lORElDQVRPUlMpO1xuICAgIH1cblxuICAgIGxvYWRNb2RlbChtb2RlbCkge1xuICAgICAgICAvLyBMb2FkIGEgbW9kZWwgZnJvbSB0aGUgQVBJLiBBZnRlciBsb2FkaW5nIHJlYnVpbGQgdGhlIGRhdGEgdHJlZS5cbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKSB7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgICAgICAgICAgICAge21vZGVsczogdXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7JG1lcmdlOiB7W21vZGVsXTogdGhpcy5pbmRleE1vZGVsKHJlc3BvbnNlLnJlc3VsdHMpfX1cbiAgICAgICAgICAgICAgICAgICAgKX0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgQVBJQ2FsbCgnR0VUJywgZW5kcG9pbnRzW21vZGVsXSh0aGlzLnN0YXRlLnByb2plY3QuaWQpLCAnJywgc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChtb2RlbCwgZGF0YSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgYSBtb2RlbCBpbnN0YW5jZS4gVXNlcyB0aGUgaW5kZXhlZCBtb2RlbCBvYmplY3RzIGFuZCB0aGUgaW1tdXRhYmlsaXR5LWhlbHBlciB1cGRhdGVcbiAgICAgICAgIGZ1bmN0aW9uIChodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3VwZGF0ZS5odG1sKVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG5ld1N0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgIG5ld1N0YXRlID0gdXBkYXRlKHRoaXMuc3RhdGUubW9kZWxzLCB7W21vZGVsXTogeyRtZXJnZToge1tpZF06IGRhdGF9fX0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge21vZGVsczogbmV3U3RhdGV9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0c0RhdGFUcmVlOiB0aGlzLmFzc2VtYmxlRGF0YVRyZWUoKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRlbGV0ZUZyb21Nb2RlbChtb2RlbCwgaWQpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIGEgbW9kZWwgaW5zdGFuY2UuIFVzZXMgdGhlIGluZGV4ZWQgbW9kZWwgb2JqZWN0cyBhbmQgdGhlIGltbXV0YWJpbGl0eS1oZWxwZXIgdXBkYXRlXG4gICAgICAgICBmdW5jdGlvbiAoaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy91cGRhdGUuaHRtbClcbiAgICAgICAgICovXG4gICAgICAgIGxldCBuZXdTdGF0ZTtcbiAgICAgICAgLy8gU2luY2Ugd2Ugc2hvdWxkbid0IGVkaXQgdGhlIHN0YXRlIG9iamVjdCBkaXJlY3RseSB3ZSBoYXZlIHRvIG1ha2UgYSAoc2hhbGxvdykgY29weVxuICAgICAgICAvLyBhbmQgZGVsZXRlIGZyb20gdGhlIGNvcHkuIFRPRE86IHRoaW5rIGhhcmQgaWYgdGhpcyBjYW4gbGVhZCB0byB0cm91YmxlLi4uXG4gICAgICAgIGNvbnN0IG5ld01vZGVsID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5tb2RlbHNbbW9kZWxdKTtcbiAgICAgICAgZGVsZXRlIG5ld01vZGVsW2lkXTtcbiAgICAgICAgbmV3U3RhdGUgPSB1cGRhdGUodGhpcy5zdGF0ZS5tb2RlbHMsIHtbbW9kZWxdOiB7JHNldDogbmV3TW9kZWx9fSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7bW9kZWxzOiBuZXdTdGF0ZX0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHRzRGF0YVRyZWU6IHRoaXMuYXNzZW1ibGVEYXRhVHJlZSgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaW5kZXhNb2RlbChkYXRhKSB7XG4gICAgICAgIC8qXG4gICAgICAgIENyZWF0ZSBhbiBpbmRleGVkIHZlcnNpb24gb2YgYSBtb2RlbCBieSBjcmVhdGluZyBhIGxpc3Qgb2Ygb2JqZWN0cywgb25lIGZvciBlYWNoIG1vZGVsXG4gICAgICAgIGluc3RhbmNlIHdoZXJlIHRoZSBvYmplY3Qga2V5IGlzIHRoZSBpZCBvZiB0aGUgaW5zdGFuY2UgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBpbnN0YW5jZS5cbiAgICAgICAgVGhpcyBjb25zdHJ1Y3QgaXMgdXNlZCB0byBiZSBhYmxlIHRvIGVhc2lseSB1cGRhdGUgaW5kaXZpZHVhbCBpbnN0YW5jZXMuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICBmdW5jdGlvbihhY2MsIG9iaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gb2JqWydpZCddO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleGVkT2JqID0ge307XG4gICAgICAgICAgICAgICAgaW5kZXhlZE9ialtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCBpbmRleGVkT2JqKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBjdXJyZW50VXNlcigpIHtcbiAgICAgICAgLy9UT0RPOiBpZiBsb2FkaW5nIG9mIHVzZXIgZGF0YSBmYWlscyB3ZSBoYXZlIGEgcHJvYmxlbS4uLlxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbHMudXNlcjtcbiAgICB9XG5cbiAgICBhc3NlbWJsZURhdGFUcmVlKCkge1xuICAgICAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBsaXN0IG9mIHJlc3VsdCBvYmplY3RzIGJhc2VkIG9uIHRoZSBBUEkgY2FsbCBmb3IgUmVzdWx0LCBlYWNoIG9mIHdoaWNoIGhvbGRzIGFcbiAgICAgICAgbGlzdCBvZiBpdHMgYXNzb2NpYXRlZCBpbmRpY2F0b3JzIGluIHRoZSBmaWVsZCBcImluZGljYXRvcnNcIiwgZWFjaCBvZiB3aGljaCBob2xkIGEgbGlzdCBvZlxuICAgICAgICBpbmRpY2F0b3IgcGVyaW9kcyBpbiB0aGUgZmllbGQgXCJwZXJpb2RzXCIgYW5kIG9uIGRvd24gdmlhIFwidXBkYXRlc1wiIGFuZCBcImNvbW1lbnRzXCIuXG4gICAgICAgIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgd2hvbGUgdHJlZSBvZiBjb21wb25lbnRzIGVhY2ggbGV2ZWwgcGFzc2luZyB0aGVcbiAgICAgICAgY2hpbGQgbGlzdCBhcyB0aGUgcHJvcCBcIml0ZW1zXCJcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbihwYXJlbnRzLCBmaWVsZE5hbWVzLCBjaGlsZHJlbikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxpbmtzIHR3byBsZXZlbHMgaW4gdGhlIGRhdGEgdHJlZS4gVGhlIGxpbmtpbmcgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgICAgICBmb3JlaWduIGtleSBmaWVsZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjaGlsZCBiZWluZyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBQYXJhbXM6XG4gICAgICAgICAgICAgICAgcGFyZW50czogbGlzdCBvZiBwYXJlbnQgb2JqZWN0cy4gRWFjaCBwYXJlbnQgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IGZpZWxkIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBob2xkcyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZmllbGROYW1lczogb2JqZWN0IHdpdGggdHdvIGZpZWxkcywgXCJwYXJlbnRcIiBhbmQgXCJjaGlsZHJlblwiIHRoYXQgaG9sZCB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgIHRoZSBmaWVsZHMgbGlua2luZyB0aGUgdHdvIGxldmVscyBvZiBvYmplY3RzLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBsaXN0IG9mIGFsbCBjaGlsZCBvYmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cyAmJiBwYXJlbnRzLm1hcChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50W2ZpZWxkTmFtZXMuY2hpbGRyZW5dID0gY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0+IGNoaWxkW2ZpZWxkTmFtZXMucGFyZW50XSA9PT0gcGFyZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgQWRkIHRoZSBmaWVsZCBcImFjdHVhbF92YWx1ZVwiIHRvIGVhY2ggcGVyaW9kIHVwZGF0ZSwgd2hpY2ggaXMgdGhlIHN1bSBvZiBhbGwgdXBkYXRlXG4gICAgICAgICAgICB2YWx1ZXMgdXAgdG8gdGhpcyBwb2ludCBpbiB0aW1lLiBOb3RlIHRoYXQgdGhpcyBmaWVsZCBleGlzdHMgaW4gdGhlIGRhdGFzZXQgYXNcbiAgICAgICAgICAgIHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGJ1dCB3ZSBjYW4ndCB1c2UgdGhhdCBzaW5jZSB3ZSB3YW50IHRvIGJlIGFibGUgdG9cbiAgICAgICAgICAgIChyZSktY2FsY3VsYXRlIG9uIGRhdGEgY2hhbmdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHBlcmlvZHMgJiYgcGVyaW9kcy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJpb2QudXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbF92YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJpb2QudXBkYXRlcyA9IHBlcmlvZC51cGRhdGVzLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlWydhY3R1YWxfdmFsdWUnXSA9IHBhcnNlSW50KHVwZGF0ZS5kYXRhKSArIGFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsX3ZhbHVlID0gdXBkYXRlLmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmlvZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZUluZGV4KG9iaikge1xuICAgICAgICAgICAgLy8gVHVybiB0aGUgaW5kZXhlZCBtb2RlbCBiYWNrIHRvIGEgbGlzdCBvZiBtb2RlbCBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIHRyZWUgb2YgbW9kZWxzIGZyb20gdGhlIGxvd2VzdCBsZXZlbCAoQ29tbWVudCkgYW5kIHVwIHRvIFJlc3VsdFxuICAgICAgICBjb25zdCBtb2RlbHMgPSB0aGlzLnN0YXRlLm1vZGVscztcbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMudXBkYXRlcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcImRhdGFcIiwgY2hpbGRyZW46IE9CSkVDVFNfQ09NTUVOVFN9LFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMuY29tbWVudHMpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcGVyaW9kcyA9IGZpbHRlckNoaWxkcmVuKFxuICAgICAgICAgICAgZGVJbmRleChtb2RlbHMucGVyaW9kcyksXG4gICAgICAgICAgICB7cGFyZW50OiBcInBlcmlvZFwiLCBjaGlsZHJlbjogT0JKRUNUU19VUERBVEVTfSxcbiAgICAgICAgICAgIHVwZGF0ZXMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0ZWRfcGVyaW9kcyA9IGFubm90YXRlVXBkYXRlcyhwZXJpb2RzKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5pbmRpY2F0b3JzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwiaW5kaWNhdG9yXCIsIGNoaWxkcmVuOiBPQkpFQ1RTX1BFUklPRFN9LFxuICAgICAgICAgICAgYW5ub3RhdGVkX3BlcmlvZHNcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyQ2hpbGRyZW4oXG4gICAgICAgICAgICBkZUluZGV4KG1vZGVscy5yZXN1bHRzKSxcbiAgICAgICAgICAgIHtwYXJlbnQ6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBPQkpFQ1RTX0lORElDQVRPUlN9LFxuICAgICAgICAgICAgaW5kaWNhdG9yc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLnN0YXRlLnJlc3VsdHNEYXRhVHJlZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgbG9hZE1vZGVsOiB0aGlzLmxvYWRNb2RlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdXBkYXRlTW9kZWw6IHRoaXMudXBkYXRlTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Nb2RlbDogdGhpcy5kZWxldGVGcm9tTW9kZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLmN1cnJlbnRVc2VyLmJpbmQodGhpcylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5tb2RlbHMucmVzdWx0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5Mb2FkaW5nLi4uPC9wPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RyZWV9XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcz17Y2FsbGJhY2tzfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8cD5ObyBpdGVtczwvcD5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdWx0cy1mcmFtZXdvcmsnKSk7XG59KTsiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5cbmltcG9ydCB7bGV2ZWx9IGZyb20gJy4vTGV2ZWwuanN4J1xuXG5pbXBvcnQge2xldmVsVG9nZ2xlfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7T0JKRUNUU19DT01NRU5UU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cbmNvbnN0IENvbW1lbnRIZWFkZXIgPSAoe2l0ZW06IGNvbW1lbnR9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICB7XCJDb21tZW50OiBcIiArIGNvbW1lbnQuY29tbWVudH1cbiAgICAgICAgPC9zcGFuPlxuICAgIClcbn07XG5cblxuY2xhc3MgQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge21vZGVsOiBPQkpFQ1RTX0NPTU1FTlRTfTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PkJ5OiB7Y29tbWVudC51c2VyX2RldGFpbHMuZmlyc3RfbmFtZX08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkNvbW1lbnQucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxldmVsKENvbW1lbnRIZWFkZXIsIENvbW1lbnQpO1xuIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSAncmMtY29sbGFwc2UnO1xuXG5pbXBvcnQge2xldmVsfSBmcm9tICcuL0xldmVsLmpzeCc7XG5pbXBvcnQgUGVyaW9kcyBmcm9tICcuL1BlcmlvZHMuanN4JztcblxuaW1wb3J0IHtffWZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtPQkpFQ1RTX0lORElDQVRPUlN9IGZyb20gJy4vY29uc3QuanMnO1xuXG5cbmNvbnN0IEluZGljYXRvckhlYWRlciA9ICh7aXRlbTogaW5kaWNhdG9yfSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gaW5kaWNhdG9yLnRpdGxlLmxlbmd0aCA+IDAgPyBpbmRpY2F0b3IudGl0bGUgOiBcIk5hbWVsZXNzIGluZGljYXRvclwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAge1wiSW5kaWNhdG9yOiBcIiArIHRpdGxlfVxuICAgICAgICA8L3NwYW4+XG4gICAgKVxufTtcblxuSW5kaWNhdG9ySGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmNvbnN0IEluZGljYXRvckNvbnRlbnQgPSAoe2luZGljYXRvcn0pID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGluZGljYXRvci50aXRsZS5sZW5ndGggPiAwID8gaW5kaWNhdG9yLnRpdGxlIDogXCJOYW1lbGVzcyBpbmRpY2F0b3JcIjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYXNlbGluZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUteWVhclwiPlxuICAgICAgICAgICAgICAgICAgICB7XygnYmFzZWxpbmVfeWVhcicpfToge2luZGljYXRvci5iYXNlbGluZV95ZWFyfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFzZWxpbmUtdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAge18oJ2Jhc2VsaW5lX3ZhbHVlJyl9OiB7aW5kaWNhdG9yLmJhc2VsaW5lX3ZhbHVlfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cbkluZGljYXRvckNvbnRlbnQucHJvcFR5cGVzID0ge1xuICAgIGluZGljYXRvcjogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuXG5jbGFzcyBJbmRpY2F0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHttb2RlbDogT0JKRUNUU19JTkRJQ0FUT1JTfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbCgncGVyaW9kcycpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgaW5kaWNhdG9yID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8SW5kaWNhdG9yQ29udGVudCBpbmRpY2F0b3I9e2luZGljYXRvcn0vPlxuICAgICAgICAgICAgICAgIDxQZXJpb2RzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpbmRpY2F0b3IucGVyaW9kc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5JbmRpY2F0b3IucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbChJbmRpY2F0b3JIZWFkZXIsIEluZGljYXRvcik7IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbGxhcHNlLCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcbmltcG9ydCB1cGRhdGUgIGZyb20gJ2ltbXV0YWJpbGl0eS1oZWxwZXInO1xuXG5cbmNvbnN0IFRvZ2dsZUJ1dHRvbiA9ICh7b25DbGljaywgbGFiZWx9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGEgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgPC9hPlxuICAgIClcbn07XG5cblRvZ2dsZUJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBsZXZlbChIZWFkZXIsIENvbnRlbnQpIHtcblxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge2FjdGl2ZUtleTogW10sIGlzT3BlbjogZmFsc2V9O1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTGV2ZWwgPSB0aGlzLnRvZ2dsZUxldmVsLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkNoYW5nZShhY3RpdmVLZXkpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2Ygb3BlbiBwYW5lbHNcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlTGV2ZWwoKSB7XG4gICAgICAgICAgICBjb25zdCBpc09wZW4gPSB0aGlzLnN0YXRlLmlzT3BlbjtcbiAgICAgICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXk6IFtdLCBpc09wZW46ICFpc09wZW59KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUtleTogdGhpcy5wcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQudG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbjogIWlzT3BlblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgICAgICAgICAgLy8gQ29tYmluZSBhY3RpdmVLZXkgd2l0aCBwcm9wcy5uZXdLZXlzIHRvIGNyZWF0ZSBhIG5ldyBhY3RpdmVLZXlcbiAgICAgICAgICAgIC8vIEN1cnJlbnRseSB1c2VkIGluIFBlcmlvZCB0byBvcGVuIGEgbmV3IHVwZGF0ZSBmb3JtIHdoZW4gaXQncyBjcmVhdGVkXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMubmV3S2V5cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleTogdXBkYXRlKHRoaXMuc3RhdGUuYWN0aXZlS2V5LCB7JHB1c2g6IG5ld1Byb3BzLm5ld0tleXN9KX0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJQYW5lbHMoaXRlbXMsIHByb3BzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGl0ZW1zLm1hcChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZTogSSd2ZSB0cmllZCB0byBoYXZlIHRoZSBQYW5lbCBpbiB0aGUgcmVzcGVjdGl2ZSBDb250ZW50IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCByZW5kZXIgPENvbnRlbnQgLz4gaGVyZSwgYnV0IGl0IHNlZW1zIFBhbmVsIGRvZXNuJ3QgbGlrZSBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VwYXJhdGVkIGZyb20gQ29sbGFwc2UgYnkgYW55IGNvbXBvbmVudCBiZXR3ZWVuIHRoZW0gc28gSSBnYXZlIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9ezxIZWFkZXIgaXRlbT17aXRlbX0gey4uLnByb3BzfS8+fSBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udGVudCBrZXk9e2l0ZW0uaWR9IGl0ZW09e2l0ZW19IHsuLi5wcm9wc30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXM7XG4gICAgICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgXCIgKyB0aGlzLl9yZWFjdEludGVybmFsSW5zdGFuY2UuX2RlYnVnSUQgKyBcIiBsb2FkaW5nLi4uXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxwPkxvYWRpbmcuLi48L3A+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9nZ2xlQnV0dG9uIG9uQ2xpY2s9e3RoaXMudG9nZ2xlTGV2ZWx9IGxhYmVsPVwiK1wiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2xsYXBzZSBhY3RpdmVLZXk9e3RoaXMuc3RhdGUuYWN0aXZlS2V5fSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyUGFuZWxzKGl0ZW1zLCB0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxwPk5vIGl0ZW1zPC9wPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKlxuIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSBcInJjLWNvbGxhcHNlXCI7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IHtsZXZlbH0gZnJvbSBcIi4vTGV2ZWwuanN4XCI7XG5pbXBvcnQge1VwZGF0ZXMsIE5ld1VwZGF0ZUJ1dHRvbn0gZnJvbSBcIi4vVXBkYXRlcy5qc3hcIjtcblxuaW1wb3J0IHtkaXNwbGF5RGF0ZSwgQVBJQ2FsbCwgZW5kcG9pbnRzfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHtPQkpFQ1RTX1BFUklPRFMsIE9CSkVDVFNfVVBEQVRFU30gZnJvbSAnLi9jb25zdC5qcyc7XG5cblxuY2xhc3MgUGVyaW9kTG9ja1RvZ2dsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5sb2NrVG9nZ2xlID0gdGhpcy5sb2NrVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bG9ja2luZzogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQZXJpb2RTYXZlKHBlcmlvZElkLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBCYXNlIGZ1bmN0aW9uIGZvciBzYXZpbmcgYSBwZXJpb2Qgd2l0aCBhIGRhdGEgT2JqZWN0LlxuICAgICAgICBjb25zdCB1cmwgPSBlbmRwb2ludHMucGVyaW9kKHBlcmlvZElkKTtcbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1BFUklPRFMsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjaywgaWYgbm90IHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQVBJQ2FsbCgnUEFUQ0gnLCB1cmwsIGRhdGEsIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9ja2luZ1RvZ2dsZShsb2NraW5nKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvY2tpbmc6IGxvY2tpbmd9KTtcbiAgICB9XG5cbiAgICBub3RMb2NraW5nKCkge1xuICAgICAgICB0aGlzLmxvY2tpbmdUb2dnbGUoZmFsc2UpO1xuICAgIH1cblxuICAgIGxvY2tUb2dnbGUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9ja2luZykge1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nVG9nZ2xlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5iYXNlUGVyaW9kU2F2ZSh0aGlzLnByb3BzLnBlcmlvZC5pZCwge2xvY2tlZDogIXRoaXMucHJvcHMucGVyaW9kLmxvY2tlZH0sIHRoaXMubm90TG9ja2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGljb24sIGxhYmVsO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sb2NraW5nKSB7XG4gICAgICAgICAgICBpY29uID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3BpbiBmYS1zcGlubmVyXCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9hZGluZ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGVyaW9kLmxvY2tlZCkge1xuICAgICAgICAgICAgaWNvbiA9IDxpIGNsYXNzTmFtZT17J2ZhIGZhLWxvY2snfS8+O1xuICAgICAgICAgICAgbGFiZWwgPSBcIlVubG9jayBwZXJpb2RcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSA8aSBjbGFzc05hbWU9XCJmYSBmYS11bmxvY2stYWx0XCIgLz47XG4gICAgICAgICAgICBsYWJlbCA9IFwiTG9jayBwZXJpb2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5sb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICBzdHlsZT17e2Zsb2F0OiAncmlnaHQnLCBtYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG5cblBlcmlvZExvY2tUb2dnbGUucHJvcFR5cGVzID0ge1xuICAgIHBlcmlvZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cblxuY29uc3QgcGVyaW9kQWN0dWFsVmFsdWUgPSAocGVyaW9kKSA9PiB7XG4gICAgcmV0dXJuIHBlcmlvZC51cGRhdGVzICYmIHBlcmlvZC51cGRhdGVzLmxlbmd0aCA+IDAgP1xuICAgICAgICBwZXJpb2QudXBkYXRlc1twZXJpb2QudXBkYXRlcy5sZW5ndGgtMV0uYWN0dWFsX3ZhbHVlXG4gICAgOlxuICAgICAgICBcIlwiO1xufTtcblxuY29uc3QgUGVyaW9kSGVhZGVyID0gKHtpdGVtOiBwZXJpb2QsIGNhbGxiYWNrc30pID0+IHtcbiAgICBjb25zdCBwZXJpb2RTdGFydCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2Rfc3RhcnQpO1xuICAgIGNvbnN0IHBlcmlvZEVuZCA9IGRpc3BsYXlEYXRlKHBlcmlvZC5wZXJpb2RfZW5kKTtcbiAgICBjb25zdCBwZXJpb2REYXRlID0gYCR7cGVyaW9kU3RhcnR9IC0gJHtwZXJpb2RFbmR9YDtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIFBlcmlvZDoge3BlcmlvZERhdGV9IHxcbiAgICAgICAgICAgICAgICBUYXJnZXQgdmFsdWU6IHtwZXJpb2QudGFyZ2V0X3ZhbHVlfSB8XG4gICAgICAgICAgICAgICAgQWN0dWFsIHZhbHVlOiB7cGVyaW9kQWN0dWFsVmFsdWUocGVyaW9kKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxQZXJpb2RMb2NrVG9nZ2xlIHBlcmlvZD17cGVyaW9kfSBjYWxsYmFja3M9e2NhbGxiYWNrc30vPlxuICAgICAgICA8L3NwYW4+XG4gICAgKVxufTtcblxuUGVyaW9kSGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuXG5leHBvcnQgY2xhc3MgUGVyaW9kIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtb2RlbDogT0JKRUNUU19QRVJJT0RTLFxuICAgICAgICAgICAgbmV3S2V5czogW10gLy8gS2VlcCB0cmFjayBvZiBrZXlzIGZvciBuZXcgdXBkYXRlcywgdXNlZCB0byBvcGVuIHRoZSBVcGRhdGVGb3JtXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3Blbk5ld0Zvcm0gPSB0aGlzLm9wZW5OZXdGb3JtLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5sb2FkTW9kZWwoT0JKRUNUU19VUERBVEVTKTtcbiAgICB9XG5cbiAgICBvcGVuTmV3Rm9ybShuZXdLZXksIGRhdGEpIHtcbiAgICAgICAgLy8gQWRkIHRoZSBrZXkgZm9yIGEgbmV3IHVwZGF0ZSB0byB0aGUgbGlzdCBvZiBvcGVuIHBhbmVsc1xuICAgICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICAgICAge25ld0tleXM6IHVwZGF0ZSh0aGlzLnN0YXRlLm5ld0tleXMsIHskcHVzaDogW25ld0tleV19KX0sXG4gICAgICAgICAgICAvLyBPbmx5IHdoZW4gdGhlIGFjdGl2ZUtleSBzdGF0ZSBpcyBjb21taXR0ZWQgZG8gd2UgdXBkYXRlIHRoZSB1cGRhdGVzIG1vZGVsXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBwZXJpb2QgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIGNvbnN0IHVwZGF0ZUNhbGxiYWNrcyA9IHVwZGF0ZSh0aGlzLnByb3BzLmNhbGxiYWNrcywgeyRtZXJnZToge29uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlfX0pO1xuICAgICAgICBjb25zdCBidXR0b25DYWxsYmFja3MgPSB1cGRhdGUodGhpcy5wcm9wcy5jYWxsYmFja3MsIHskbWVyZ2U6IHtvcGVuTmV3Rm9ybTogdGhpcy5vcGVuTmV3Rm9ybX19KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3BlcmlvZC51cGRhdGVzfVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3VwZGF0ZUNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgbmV3S2V5cz17dGhpcy5zdGF0ZS5uZXdLZXlzfS8+XG4gICAgICAgICAgICAgICAgPE5ld1VwZGF0ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e2J1dHRvbkNhbGxiYWNrc31cbiAgICAgICAgICAgICAgICAgICAgcGVyaW9kPXtwZXJpb2R9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUGVyaW9kLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbGV2ZWwoUGVyaW9kSGVhZGVyLCBQZXJpb2QpOyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UGFuZWx9IGZyb20gJ3JjLWNvbGxhcHNlJztcblxuaW1wb3J0IEluZGljYXRvcnMgZnJvbSAnLi9JbmRpY2F0b3JzLmpzeCc7XG5cbmltcG9ydCB7bGV2ZWx9IGZyb20gJy4vTGV2ZWwuanN4JztcbmltcG9ydCB7T0JKRUNUU19SRVNVTFRTfSBmcm9tICcuL2NvbnN0LmpzJztcblxuXG5jb25zdCBSZXN1bHRIZWFkZXIgPSAoe2l0ZW06IHJlc3VsdH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIHtcIlJlc3VsdDogXCIgKyByZXN1bHQudGl0bGV9XG4gICAgICAgIDwvc3Bhbj5cbiAgICApXG59O1xuXG5SZXN1bHRIZWFkZXIucHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cblxuY2xhc3MgUmVzdWx0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IE9CSkVDVFNfUkVTVUxUU307XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxJbmRpY2F0b3JzXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtyZXN1bHQuaW5kaWNhdG9yc31cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5SZXN1bHQucHJvcFR5cGVzID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbChSZXN1bHRIZWFkZXIsIFJlc3VsdCk7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1BhbmVsfSBmcm9tICdyYy1jb2xsYXBzZSc7XG5pbXBvcnQgdXBkYXRlICBmcm9tICdpbW11dGFiaWxpdHktaGVscGVyJztcblxuaW1wb3J0IHtsZXZlbH0gZnJvbSBcIi4vTGV2ZWwuanN4XCI7XG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9Db21tZW50cy5qc3gnO1xuXG5pbXBvcnQge1xuICAgIEFQSUNhbGwsIGVuZHBvaW50cywgZGlzcGxheURhdGUsIGRpc3BsYXlOdW1iZXIsIF8sIGN1cnJlbnRVc2VyLCBpc05ld1VwZGF0ZX0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge1xuICAgIFNUQVRVU19EUkFGVF9DT0RFLCBTVEFUVVNfQVBQUk9WRURfQ09ERSwgT0JKRUNUU19VUERBVEVTLCBPQkpFQ1RTX0NPTU1FTlRTfSBmcm9tICcuL2NvbnN0LmpzJztcblxuXG5jb25zdCBVcGRhdGVEaXNwbGF5ID0gKHt1cGRhdGV9KSA9PiB7XG4gICAgY29uc3QgdXNlck5hbWUgPSB1cGRhdGUudXNlcl9kZXRhaWxzLmZpcnN0X25hbWUgKyBcIiBcIiArIHVwZGF0ZS51c2VyX2RldGFpbHMubGFzdF9uYW1lO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICBXaGVuOiB7ZGlzcGxheURhdGUodXBkYXRlLmNyZWF0ZWRfYXQpfSB8XG4gICAgICAgICAgICBCeToge3VzZXJOYW1lfSB8XG4gICAgICAgICAgICBPcmc6IHt1cGRhdGUudXNlcl9kZXRhaWxzLmFwcHJvdmVkX29yZ2FuaXNhdGlvbnNbMF0ubmFtZX0gfFxuICAgICAgICAgICAgU3RhdHVzOiB7XygndXBkYXRlX3N0YXR1c2VzJylbdXBkYXRlLnN0YXR1c119IDxici8+XG4gICAgICAgICAgICBVcGRhdGUgdmFsdWU6IHt1cGRhdGUuZGF0YX0gfCB7LypcbiAgICAgICAgIE5PVEU6IHdlIHVzZSB1cGRhdGUuYWN0dWFsX3ZhbHVlLCBhIHZhbHVlIGNhbGN1bGF0ZWQgaW4gQXBwLmFubm90YXRlVXBkYXRlcygpLFxuICAgICAgICAgbm90IHVwZGF0ZS5wZXJpb2RfYWN0dWFsX3ZhbHVlIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgICAgICovfVxuICAgICAgICAgICAgQWN0dWFsIHRvdGFsIGZvciB0aGlzIHBlcmlvZCAoaW5jbHVkaW5nIHRoaXMgdXBkYXRlKToge3VwZGF0ZS5hY3R1YWxfdmFsdWV9XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblVwZGF0ZURpc3BsYXkucHJvcFR5cGVzID0ge1xuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNsYXNzIFVwZGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5mb3JtVG9nZ2xlID0gdGhpcy5mb3JtVG9nZ2xlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7Zm9ybU9wZW46IGlzTmV3VXBkYXRlKHByb3BzLnVwZGF0ZSl9O1xuICAgIH1cblxuICAgIGZvcm1Ub2dnbGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Zvcm1PcGVuOiAhdGhpcy5zdGF0ZS5mb3JtT3Blbn0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmZvcm1Ub2dnbGV9XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzAuM2VtIDAuNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge18oJ2VkaXRfdXBkYXRlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mb3JtT3BlbiA/XG4gICAgICAgICAgICAgICAgICAgIDxVcGRhdGVGb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M9e3RoaXMucHJvcHMuY2FsbGJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1Ub2dnbGU9e3RoaXMuZm9ybVRvZ2dsZX0vPlxuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZURpc3BsYXkgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0vPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5VcGRhdGUucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IFVwZGF0ZUhlYWRlciA9ICh7aXRlbTogdXBkYXRlfSkgPT4ge1xuICAgIGNvbnN0IG9yZ2FuaXNhdGlvbiA9IHVwZGF0ZS51c2VyX2RldGFpbHMuYXBwcm92ZWRfb3JnYW5pc2F0aW9uc1swXS5uYW1lO1xuICAgIGNvbnN0IHVzZXJOYW1lID0gdXBkYXRlLnVzZXJfZGV0YWlscy5maXJzdF9uYW1lICtcIiBcIisgdXBkYXRlLnVzZXJfZGV0YWlscy5sYXN0X25hbWU7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICBVcGRhdGU6IHt1c2VyTmFtZX0gYXQge29yZ2FuaXNhdGlvbn0sXG4gICAgICAgICAgICBEYXRhOiB7dXBkYXRlLmRhdGF9IFN0YXR1czoge18oJ3VwZGF0ZV9zdGF0dXNlcycpW3VwZGF0ZS5zdGF0dXNdfVxuICAgICAgICA8L3NwYW4+XG4gICAgKVxufTtcblxuVXBkYXRlSGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5cbmNsYXNzIFVwZGF0ZXNCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7bW9kZWw6IE9CSkVDVFNfVVBEQVRFU31cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLmxvYWRNb2RlbChPQkpFQ1RTX0NPTU1FTlRTKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt0aGlzLnByb3BzLmNhbGxiYWNrc30vPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3VwZGF0ZS5jb21tZW50c30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cblVwZGF0ZXNCYXNlLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxufTtcblxuZXhwb3J0IGNvbnN0IFVwZGF0ZXMgPSBsZXZlbChVcGRhdGVIZWFkZXIsIFVwZGF0ZXNCYXNlKTtcblxuXG5jb25zdCBIZWFkZXIgPSAoe3VwZGF0ZX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdXBkYXRlLWVudHJ5LWNvbnRhaW5lci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICBTdGF0dXM6IHtfKCd1cGRhdGVfc3RhdHVzZXMnKVt1cGRhdGUuc3RhdHVzXX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5cbmNvbnN0IEFjdHVhbFZhbHVlSW5wdXQgPSAoe3VwZGF0ZSwgdXBkYXRlZEFjdHVhbFZhbHVlLCBvbkNoYW5nZX0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYWN0dWFsVmFsdWVcIj57XygnYWRkX3RvX2FjdHVhbF92YWx1ZScpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZGF0YVwiXG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt1cGRhdGUuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17XygnaW5wdXRfcGxhY2Vob2xkZXInKX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBBY3R1YWxWYWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1cGRhdGUtYWN0dWFsLXZhbHVlLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XygndG90YWxfdmFsdWVfYWZ0ZXJfdXBkYXRlJyl9OlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZS1hY3R1YWwtdmFsdWUtZGF0YVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3VwZGF0ZWRBY3R1YWxWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuQWN0dWFsVmFsdWVJbnB1dC5wcm9wVHlwZXMgPSB7XG4gICAgdXBkYXRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuXG5jb25zdCBBY3R1YWxWYWx1ZURlc2NyaXB0aW9uID0gKHt1cGRhdGUsIG9uQ2hhbmdlfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy05IHVwZGF0ZS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZGVzY3JpcHRpb25cIj57XygnYWN0dWFsX3ZhbHVlX2NvbW1lbnQnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dXBkYXRlLnRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17XygnY29tbWVudF9wbGFjZWhvbGRlcicpfT5cbiAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59O1xuXG5BY3R1YWxWYWx1ZURlc2NyaXB0aW9uLnByb3BUeXBlcyA9IHtcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuY29uc3QgQXR0YWNobWVudHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW1hZ2VVcGxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jYW1lcmFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkFkZCBpbWFnZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWxlVXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1wYXBlcmNsaXBcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkF0dGFjaCBmaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIClcbn07XG5cblxuY29uc3QgVXBkYXRlRm9ybUJ1dHRvbnMgPSAoe3VwZGF0ZSwgY2FsbGJhY2tzfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudUFjdGlvblwiPlxuICAgICAgICB7IWlzTmV3VXBkYXRlKHVwZGF0ZSkgP1xuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwicmVtb3ZlVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17Y2FsbGJhY2tzLmRlbGV0ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdkZWxldGUnKX08L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgOiAnJ31cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYtcGlsbHMgYm90dG9tUm93IG5hdmJhci1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiY2FuY2VsVXBkYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2NhbGxiYWNrcy5vbkNhbmNlbH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGJ0bi14c1wiPntfKCdjYW5jZWwnKX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT1cInNhdmVVcGRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJzYXZlXCIgb25DbGljaz17Y2FsbGJhY2tzLnNhdmVVcGRhdGV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIj57Xygnc2F2ZScpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3NOYW1lPVwiYXBwcm92ZVVwZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBpZD1cImFwcHJvdmVcIiBvbkNsaWNrPXtjYWxsYmFja3Muc2F2ZVVwZGF0ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14c1wiPntfKCdhcHByb3ZlJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgKVxufTtcblxuVXBkYXRlRm9ybUJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICAgIGNhbGxiYWNrczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5cbmNvbnN0IHBydW5lRm9yUEFUQ0ggPSAodXBkYXRlKSA9PiB7XG4gICAgLy8gT25seSBpbmNsdWRlIHRoZSBsaXN0ZWQgZmllbGRzIHdoZW4gUEFUQ0hpbmcgYW4gdXBkYXRlXG4gICAgLy8gY3VycmVudGx5IHRoZSBsaXN0IG1pbWljcyB0aGUgb2xkIE15UmVzdWx0cyBkYXRhXG4gICAgY29uc3QgZmllbGRzID0gWydkYXRhJywgJ3RleHQnLCAncmVsYXRpdmVfZGF0YScsICdzdGF0dXMnXTtcbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYWNjLCBmKSA9PiB7cmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCB7W2ZdOiB1cGRhdGVbZl19KX0sIHt9KTtcbn07XG5cbmNvbnN0IHBydW5lRm9yUE9TVCA9ICh1cGRhdGUpID0+IHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgdGhlIGxpc3RlZCBmaWVsZHMgd2hlbiBQT1NUaW5nIGFuIHVwZGF0ZVxuICAgIGxldCB1cGRhdGVGb3JQT1NUID0gT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlKTtcbiAgICBkZWxldGUgdXBkYXRlRm9yUE9TVFsndXNlcl9kZXRhaWxzJ107XG4gICAgcmV0dXJuIHVwZGF0ZUZvclBPU1Q7XG59O1xuXG5jbGFzcyBVcGRhdGVGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgLy8gU2F2ZSBvcmlnaW5hbCB1cGRhdGVcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtvcmlnaW5hbFVwZGF0ZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy51cGRhdGUpfTtcbiAgICAgICAgdGhpcy5zYXZlVXBkYXRlID0gdGhpcy5zYXZlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVsZXRlVXBkYXRlID0gdGhpcy5kZWxldGVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNhbmNlbCA9IHRoaXMub25DYW5jZWwuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBvbkNoYW5nZShlKSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIGZvcm0gZmllbGQgd2lkZ2V0cyBjaGFuZ2UsIG1vZGlmeSB0aGUgbW9kZWwgZGF0YSBpbiBBcHAuc3RhdGVbbW9kZWxdXG4gICAgICAgIGNvbnN0IGZpZWxkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKFxuICAgICAgICAgICAgT0JKRUNUU19VUERBVEVTLCB1cGRhdGUodGhpcy5wcm9wcy51cGRhdGUsIHskbWVyZ2U6IHtbZmllbGRdOiBlLnRhcmdldC52YWx1ZX19KSk7XG4gICAgfVxuXG4gICAgb25DYW5jZWwoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuZm9ybVRvZ2dsZSgpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnN0YXRlLm9yaWdpbmFsVXBkYXRlO1xuICAgICAgICBpZiAoaXNOZXdVcGRhdGUodXBkYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MuZGVsZXRlRnJvbU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlLmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FsbGJhY2tzLnVwZGF0ZU1vZGVsKE9CSkVDVFNfVVBEQVRFUywgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVVcGRhdGUoZSkge1xuICAgICAgICBsZXQgdXBkYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy51cGRhdGUpO1xuICAgICAgICAvLyBBbGwgY2hhbmdlcyB0byBhbiB1cGRhdGUgcmV2ZXJ0IGl0IHRvIGRyYWZ0IHVubGVzcyBpdCBpcyBleHBsaWNpdGx5IGFwcHJvdmVkIHdoaWxlIHNhdmluZ1xuICAgICAgICBpZiAoZS50YXJnZXQuaWQgPT0gJ2FwcHJvdmUnKSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0FQUFJPVkVEX0NPREU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGUuc3RhdHVzID0gU1RBVFVTX0RSQUZUX0NPREU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZvcm1Ub2dnbGUoKTtcbiAgICAgICAgICAgIC8vIEFsd2F5cyBzYXZlIHRoZSBpbnN0YW5jZSB1c2luZyBkYXRhIGNvbWluZyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICAgICAgICAvLyBUT0RPOiBsb29rIGF0IGhhdmluZyBhIHJlcGxhY2VNb2RlbCBtZXRob2Q/XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5kZWxldGVGcm9tTW9kZWwoT0JKRUNUU19VUERBVEVTLCB1cGRhdGUuaWQpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYWxsYmFja3MudXBkYXRlTW9kZWwoT0JKRUNUU19VUERBVEVTLCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlzTmV3VXBkYXRlKHVwZGF0ZSkpIHtcbiAgICAgICAgICAgIEFQSUNhbGwoJ1BPU1QnLCBlbmRwb2ludHMudXBkYXRlc19hbmRfY29tbWVudHMoKSxcbiAgICAgICAgICAgICAgICAgICAgcHJ1bmVGb3JQT1NUKHVwZGF0ZSksIHN1Y2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBUElDYWxsKCdQQVRDSCcsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKHVwZGF0ZS5pZCksXG4gICAgICAgICAgICAgICAgICAgIHBydW5lRm9yUEFUQ0godXBkYXRlKSwgc3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZVVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtpZDogdGhpcy5wcm9wcy51cGRhdGUuaWR9O1xuICAgICAgICBsZXQgc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5mb3JtVG9nZ2xlKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy51cGRhdGVNb2RlbChPQkpFQ1RTX1VQREFURVMsIGRhdGEsIHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIEFQSUNhbGwoJ0RFTEVURScsIGVuZHBvaW50cy51cGRhdGVfYW5kX2NvbW1lbnRzKGRhdGEuaWQpLCBudWxsLCBzdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHByZXZpb3VzQWN0dWFsVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBkYXRlLmFjdHVhbF92YWx1ZSAtIHRoaXMucHJvcHMudXBkYXRlLmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5wcm9wcy5wZXJpb2QudXBkYXRlcztcbiAgICAgICAgICAgIGlmICh1cGRhdGVzICYmIHVwZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdCA9IHVwZGF0ZXNbdXBkYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF0ZXN0LmFjdHVhbF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHBhcnNlRmxvYXQodGhpcy5wcm9wcy51cGRhdGUuZGF0YSA/IHRoaXMucHJvcHMudXBkYXRlLmRhdGEgOiAwKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFjdHVhbFZhbHVlID0gZGlzcGxheU51bWJlcih0aGlzLnByZXZpb3VzQWN0dWFsVmFsdWUoKSArIHVwZGF0ZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHVwZGF0ZS1lbnRyeS1jb250YWluZXIgZWRpdC1pbi1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEFjdHVhbFZhbHVlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBY3R1YWxWYWx1ZT17dXBkYXRlZEFjdHVhbFZhbHVlfS8+XG4gICAgICAgICAgICAgICAgICAgIDxBY3R1YWxWYWx1ZURlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZT17dGhpcy5wcm9wcy51cGRhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgPEF0dGFjaG1lbnRzLz5cbiAgICAgICAgICAgICAgICAgICAgPFVwZGF0ZUZvcm1CdXR0b25zXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVVwZGF0ZTogdGhpcy5zYXZlVXBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVVwZGF0ZTogdGhpcy5kZWxldGVVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMub25DYW5jZWx9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuVXBkYXRlRm9ybS5wcm9wVHlwZXMgPSB7XG4gICAgY2FsbGJhY2tzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZm9ybVRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmxldCBuZXdVcGRhdGVJRCA9IDE7XG5cbmV4cG9ydCBjbGFzcyBOZXdVcGRhdGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMubmV3VXBkYXRlID0gdGhpcy5uZXdVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBuZXdVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLnByb3BzLmNhbGxiYWNrcy5jdXJyZW50VXNlcigpO1xuICAgICAgICBjb25zdCBpZCA9IGBuZXctJHtuZXdVcGRhdGVJRH1gO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgcGVyaW9kOiB0aGlzLnByb3BzLnBlcmlvZC5pZCxcbiAgICAgICAgICAgIHVzZXJfZGV0YWlsczogdXNlcixcbiAgICAgICAgICAgIHVzZXI6IHVzZXIuaWQsXG4gICAgICAgICAgICBkYXRhOiAwLFxuICAgICAgICAgICAgdGV4dDogJycsXG4gICAgICAgICAgICByZWxhdGl2ZV9kYXRhOiB0cnVlLFxuICAgICAgICAgICAgc3RhdHVzOiBTVEFUVVNfRFJBRlRfQ09ERVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrcy5vcGVuTmV3Rm9ybShpZCwgZGF0YSk7XG4gICAgICAgIG5ld1VwZGF0ZUlEICs9IDE7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLm5ld1VwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCd9XG4gICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnMC4zZW0gMC41ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9J2ZhIGZhLXBsdXMnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XygnbmV3X3VwZGF0ZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuTmV3VXBkYXRlQnV0dG9uLnByb3BUeXBlcyA9IHtcbiAgICBjYWxsYmFja3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwZXJpb2Q6IFByb3BUeXBlcy5vYmplY3Rcbn07XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmV4cG9ydCBjb25zdFxuICAgIC8vIEZyb20gcnNyLm1vZGVscy5pbmRpY2F0b3IuSW5kaWNhdG9yUGVyaW9kRGF0YVxuICAgIFNUQVRVU19ORVdfQ09ERSA9ICdOJyxcbiAgICBTVEFUVVNfRFJBRlRfQ09ERSA9ICdEJyxcbiAgICBTVEFUVVNfUEVORElOR19DT0RFID0gJ1AnLFxuICAgIFNUQVRVU19SRVZJU0lPTl9DT0RFID0gJ1InLFxuICAgIFNUQVRVU19BUFBST1ZFRF9DT0RFID0gJ0EnLFxuXG5cbiAgICBPQkpFQ1RTX1JFU1VMVFMgPSAncmVzdWx0cycsXG4gICAgT0JKRUNUU19JTkRJQ0FUT1JTID0gJ2luZGljYXRvcnMnLFxuICAgIE9CSkVDVFNfUEVSSU9EUyA9ICdwZXJpb2RzJyxcbiAgICBPQkpFQ1RTX1VQREFURVMgPSAndXBkYXRlcycsXG4gICAgT0JKRUNUU19DT01NRU5UUyA9ICdjb21tZW50cycsXG4gICAgT0JKRUNUU19VU0VSUyA9ICd1c2Vycyc7XG4iLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5cblxubGV0IG1vbnRocztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlEYXRlKGRhdGVTdHJpbmcpIHtcbiAgICAvLyBEaXNwbGF5IGEgZGF0ZVN0cmluZyBsaWtlIFwiMjUgSmFuIDIwMTZcIlxuICAgIGlmICghbW9udGhzKSB7XG4gICAgICAgIG1vbnRocyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2kxOG5Nb250aHMnKS5pbm5lckhUTUwpO1xuICAgIH1cbiAgICBpZiAoZGF0ZVN0cmluZykge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSBcImVuLWdiXCI7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nLnNwbGl0KFwiLlwiKVswXS5yZXBsYWNlKFwiL1wiLCAvLS9nKSk7XG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICBjb25zdCBtb250aCA9IG1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldO1xuICAgICAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gZGF5ICsgXCIgXCIgKyBtb250aCArIFwiIFwiICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQVBJQ2FsbChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIHJldHJpZXMpIHtcbiAgICBmdW5jdGlvbiBtb2RpZnkobWV0aG9kLCB1cmwsIGRhdGEpe1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoJ2NzcmZ0b2tlbicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXI7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUE9TVFwiOlxuICAgICAgICAgICAgaGFuZGxlciA9ICgpID0+IG1vZGlmeSgnUE9TVCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiUFVUXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQVVQnLCB1cmwsIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIlBBVENIXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gbW9kaWZ5KCdQQVRDSCcsIHVybCwgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiREVMRVRFXCI6XG4gICAgICAgICAgICBoYW5kbGVyID0gKCkgPT4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKCdjc3JmdG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGhhbmRsZXIoKVxuICAgICAgICAvL1RPRE86IGVycm9yIGhhbmRsaW5nPyBTZWUgaHR0cHM6Ly93d3cudGp2YW50b2xsLmNvbS8yMDE1LzA5LzEzL2ZldGNoLWFuZC1lcnJvcnMvXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwNClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG59XG5cblxuLy8gT2JqZWN0IGhvbGRzIGNhbGxiYWNrIFVSTCBmdW5jdGlvbnMgYXMgdmFsdWVzLCBtb3N0IG9mIHRoZW0gY2FsbGVkIHdpdGggYW4gaWQgcGFyYW1ldGVyXG4vLyBVc2FnZTogZW5kcG9pbnRzLnJlc3VsdCgxNykgLT4gXCJodHRwOi8vcnNyLmFrdm8ub3JnL3Jlc3QvdjEvcmVzdWx0LzE3Lz9mb3JtYXQ9anNvblwiXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgICAgICBcInJlc3VsdFwiOiAoaWQpID0+IGAvcmVzdC92MS9yZXN1bHQvJHtpZH0vP2Zvcm1hdD1qc29uYCxcbiAgICAgICAgXCJyZXN1bHRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3Jlc3VsdC8/Zm9ybWF0PWpzb24mcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwiaW5kaWNhdG9yc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3IvP2Zvcm1hdD1qc29uJnJlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwicGVyaW9kc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kLz9mb3JtYXQ9anNvbiZpbmRpY2F0b3JfX3Jlc3VsdF9fcHJvamVjdD0ke2lkfWAsXG4gICAgICAgIFwidXBkYXRlc1wiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvP2Zvcm1hdD1qc29uJnBlcmlvZF9faW5kaWNhdG9yX19yZXN1bHRfX3Byb2plY3Q9JHtpZH1gLFxuICAgICAgICBcImNvbW1lbnRzXCI6IChpZCkgPT4gYC9yZXN0L3YxL2luZGljYXRvcl9wZXJpb2RfZGF0YV9jb21tZW50Lz9mb3JtYXQ9anNvbiZkYXRhX19wZXJpb2RfX2luZGljYXRvcl9fcmVzdWx0X19wcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJwZXJpb2RcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZC8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZV9hbmRfY29tbWVudHNcIjogKGlkKSA9PiBgL3Jlc3QvdjEvaW5kaWNhdG9yX3BlcmlvZF9kYXRhX2ZyYW1ld29yay8ke2lkfS8/Zm9ybWF0PWpzb25gLFxuICAgICAgICBcInVwZGF0ZXNfYW5kX2NvbW1lbnRzXCI6ICgpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGFfZnJhbWV3b3JrLz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwidXNlclwiOiAoaWQpID0+IGAvcmVzdC92MS91c2VyLyR7aWR9Lz9mb3JtYXQ9anNvbmAsXG4gICAgICAgIFwicGFydG5lcnNoaXBzXCI6IChpZCkgPT4gYC9yZXN0L3YxL3BhcnRuZXJzaGlwLz9mb3JtYXQ9anNvbiZwcm9qZWN0PSR7aWR9YCxcbiAgICAgICAgXCJmaWxlX3VwbG9hZFwiOiAoaWQpID0+IGAvcmVzdC92MS9pbmRpY2F0b3JfcGVyaW9kX2RhdGEvJHtpZH0vdXBsb2FkX2ZpbGUvP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOdW1iZXIobnVtYmVyU3RyaW5nKSB7XG4gICAgLy8gQWRkIGNvbW1hcyB0byBudW1iZXJzIG9mIDEwMDAgb3IgaGlnaGVyLlxuICAgIGlmIChudW1iZXJTdHJpbmcgIT09IHVuZGVmaW5lZCAmJiBudW1iZXJTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IFwiZW4tZ2JcIjtcbiAgICAgICAgdmFyIGZsb2F0ID0gcGFyc2VGbG9hdChudW1iZXJTdHJpbmcpO1xuICAgICAgICBpZiAoIWlzTmFOKGZsb2F0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsb2F0LnRvTG9jYWxlU3RyaW5nKGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG5sZXQgc3RyaW5ncztcblxuLy8gVHJhbnNsYXRpb24gYSBsYSBweXRob24uIExldCdzIGhvcGUgd2UgbmV2ZXIgbmVlZCBsb2Rhc2guLi5cbmV4cG9ydCBmdW5jdGlvbiBfKHMpIHtcbiAgICBpZiAoIXN0cmluZ3MpIHtcbiAgICAgICAgc3RyaW5ncyA9IEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zbGF0aW9uLXRleHRzJykuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ3Nbc107XG59XG5cbmV4cG9ydCBjb25zdCBpc05ld1VwZGF0ZSA9ICh1cGRhdGUpID0+IHtyZXR1cm4gdXBkYXRlLmlkLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDQpID09PSAnbmV3LSd9O1xuXG5cbmNvbnN0IFRvZ2dsZUJ1dHRvbiA9ICh7b25DbGljaywgbGFiZWx9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGEgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17J2J0biBidG4tc20gYnRuLWRlZmF1bHQnfVxuICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICcwLjNlbSAwLjVlbSd9fT5cbiAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgPC9hPlxuICAgIClcbn07XG5cblRvZ2dsZUJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBsZXZlbFRvZ2dsZShXcmFwcGVkQ29tcG9uZW50KSB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHthY3RpdmVLZXk6IFtdLCBpc09wZW46IGZhbHNlfTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUxldmVsID0gdGhpcy50b2dnbGVMZXZlbC5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25DaGFuZ2UoYWN0aXZlS2V5KSB7XG4gICAgICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIG9wZW4gcGFuZWxzXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUxldmVsKCkge1xuICAgICAgICAgICAgY29uc3QgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW47XG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5OiBbXSwgaXNPcGVuOiAhaXNPcGVufSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVLZXk6IHRoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiBpdGVtLmlkLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBpc09wZW46ICFpc09wZW5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPFRvZ2dsZUJ1dHRvbiBvbkNsaWNrPXt0aGlzLnRvZ2dsZUxldmVsfSBsYWJlbD1cIitcIi8+XG4gICAgICAgICAgICAgICAgICAgIDxXcmFwcGVkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVLZXk9e3RoaXMuc3RhdGUuYWN0aXZlS2V5fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc30vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxufVxuIl19
