webpackJsonp([ 1 ], {
    0: function(module, exports, __webpack_require__) {
        "use strict";
        var _react = __webpack_require__(1);
        var _react2 = _interopRequireDefault(_react);
        var _reactDom = __webpack_require__(37);
        var _reactDom2 = _interopRequireDefault(_reactDom);
        var _App = __webpack_require__(735);
        var _App2 = _interopRequireDefault(_App);
        var _redux = __webpack_require__(197);
        var _reduxSaga = __webpack_require__(739);
        var _reduxSaga2 = _interopRequireDefault(_reduxSaga);
        var _reactRedux = __webpack_require__(184);
        var _reducer = __webpack_require__(755);
        var _sagas = __webpack_require__(772);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var sagaMiddleware = (0, _reduxSaga2.default)();
        var reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
        var store = void 0;
        if (reduxDevTools) {
            store = (0, _redux.createStore)(_reducer.reducer, (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware), reduxDevTools));
        } else {
            store = (0, _redux.createStore)(_reducer.reducer, (0, _redux.applyMiddleware)(sagaMiddleware));
        }
        sagaMiddleware.run(_sagas.watcherSaga);
        document.addEventListener("DOMContentLoaded", function() {
            _reactDom2.default.render(_react2.default.createElement(_reactRedux.Provider, {
                store: store
            }, _react2.default.createElement(_App2.default, null)), document.getElementById("userProjects"));
        });
    },
    735: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _react = __webpack_require__(1);
        var _react2 = _interopRequireDefault(_react);
        var _reactRedux = __webpack_require__(184);
        var _utils = __webpack_require__(736);
        var _const = __webpack_require__(737);
        var c = _interopRequireWildcard(_const);
        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }
        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }
        var IsRestricted = function IsRestricted(_ref) {
            var _ = _ref._, isRestricted = _ref.isRestricted, onChangeIsRestricted = _ref.onChangeIsRestricted;
            return _react2.default.createElement("span", null, _react2.default.createElement("label", null, _react2.default.createElement("input", {
                id: "isRestricted",
                type: "checkbox",
                checked: isRestricted,
                onChange: onChangeIsRestricted
            }), _react2.default.createElement("span", {
                dangerouslySetInnerHTML: {
                    __html: isRestricted ? _("user_access_restricted") : _("user_access_unrestricted")
                }
            })), isRestricted ? _react2.default.createElement("div", {
                className: "restrictedInfo",
                dangerouslySetInnerHTML: {
                    __html: _("restricted_info")
                }
            }) : _react2.default.createElement("div", null));
        };
        var Project = function Project(_ref2) {
            var _ = _ref2._, project = _ref2.project, isRestricted = _ref2.isRestricted, onChangeProjectSelected = _ref2.onChangeProjectSelected, includeOrgCell = _ref2.includeOrgCell, rowSpan = _ref2.rowSpan, orgs = _ref2.orgs;
            var uiSettings = function uiSettings(project, isRestricted) {
                var checked = project.access, disabled = isRestricted ? "" : "disabled", projectSelected = checked ? " projectSelected" : "", trClassName = disabled + projectSelected, idClassName = disabled + " id";
                return {
                    checked: checked,
                    trClassName: trClassName,
                    idClassName: idClassName
                };
            };
            var _uiSettings = uiSettings(project, isRestricted), checked = _uiSettings.checked, trClassName = _uiSettings.trClassName, idClassName = _uiSettings.idClassName;
            return _react2.default.createElement("tr", {
                key: project.id,
                id: project.id,
                onClick: onChangeProjectSelected,
                className: trClassName
            }, _react2.default.createElement("td", null, _react2.default.createElement("input", {
                id: project.id,
                type: "checkbox",
                checked: checked,
                disabled: !isRestricted,
                readOnly: true
            })), _react2.default.createElement("td", {
                className: idClassName
            }, project.id), _react2.default.createElement("td", null, project.title || _("no_title")), _react2.default.createElement("td", null, project.subtitle), includeOrgCell ? _react2.default.createElement("td", {
                className: "border",
                rowSpan: rowSpan
            }, orgs) : null);
        };
        var SelectAll = function SelectAll(_ref3) {
            var _ = _ref3._, selectAll = _ref3.selectAll, onChangeProjectSelectAll = _ref3.onChangeProjectSelectAll, isRestricted = _ref3.isRestricted;
            var uiSettings = function uiSettings(isRestricted) {
                var buttonClass = "selectAllProjects" + (isRestricted ? "" : " disabled"), disabled = !isRestricted, divClass = isRestricted ? "" : "disabled";
                return {
                    buttonClass: buttonClass,
                    disabled: disabled,
                    divClass: divClass
                };
            };
            var _uiSettings2 = uiSettings(isRestricted), divClass = _uiSettings2.divClass, disabled = _uiSettings2.disabled, buttonClass = _uiSettings2.buttonClass;
            return _react2.default.createElement("div", {
                className: divClass
            }, _react2.default.createElement("button", {
                onClick: onChangeProjectSelectAll,
                disabled: disabled,
                className: buttonClass
            }, selectAll ? _("check_all_projects") : _("uncheck_all_projects")));
        };
        var Error = function Error(_ref4) {
            var _ = _ref4._, error = _ref4.error;
            return error ? _react2.default.createElement("div", {
                className: "error"
            }, _("an_error_occured") + error.message) : null;
        };
        var Projects = function Projects(_ref5) {
            var _ = _ref5._, error = _ref5.error, groupedProjects = _ref5.groupedProjects, isRestricted = _ref5.isRestricted, selectAll = _ref5.selectAll, onChangeIsRestricted = _ref5.onChangeIsRestricted, onChangeProjectSelectAll = _ref5.onChangeProjectSelectAll, onChangeProjectSelected = _ref5.onChangeProjectSelected;
            var className = isRestricted ? "" : "disabled";
            return _react2.default.createElement("span", null, _react2.default.createElement(Error, {
                _: _,
                error: error
            }), _react2.default.createElement(IsRestricted, {
                _: _,
                isRestricted: isRestricted,
                onChangeIsRestricted: onChangeIsRestricted
            }), _react2.default.createElement(SelectAll, {
                _: _,
                selectAll: selectAll,
                onChangeProjectSelectAll: onChangeProjectSelectAll,
                isRestricted: isRestricted
            }), _react2.default.createElement("table", null, _react2.default.createElement("thead", null, _react2.default.createElement("tr", null, _react2.default.createElement("th", {
                className: className
            }, _("access")), _react2.default.createElement("th", {
                className: className
            }, _("project_id")), _react2.default.createElement("th", {
                className: className
            }, _("project_title")), _react2.default.createElement("th", {
                className: className
            }, "Project subtitle"), _react2.default.createElement("th", {
                className: className
            }, "Managing organisations"))), _react2.default.createElement("tbody", null, groupedProjects.map(function(group) {
                var rowSpan = group.projects.length;
                var first = true;
                var foo = group.projects.map(function(project) {
                    var includeOrgCell = first;
                    first = false;
                    return _react2.default.createElement(Project, {
                        _: _,
                        key: project.id,
                        project: project,
                        isRestricted: isRestricted,
                        onChangeProjectSelected: onChangeProjectSelected,
                        includeOrgCell: includeOrgCell,
                        rowSpan: rowSpan,
                        orgs: group.organisations
                    });
                });
                return foo;
            }))));
        };
        var App = function(_React$Component) {
            _inherits(App, _React$Component);
            function App(props) {
                _classCallCheck(this, App);
                var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
                _this.toggleProjectSelected = _this.toggleProjectSelected.bind(_this);
                _this.toggleIsRestricted = _this.toggleIsRestricted.bind(_this);
                _this.toggleProjectSelectAll = _this.toggleProjectSelectAll.bind(_this);
                _this._ = _this._.bind(_this);
                return _this;
            }
            _createClass(App, [ {
                key: "_",
                value: function _(s) {
                    return this.props.strings && this.props.strings[s];
                }
            }, {
                key: "toggleIsRestricted",
                value: function toggleIsRestricted(e) {
                    e.stopPropagation();
                    this.props.onUpdateIsRestricted(e.target.checked);
                }
            }, {
                key: "toggleProjectSelectAll",
                value: function toggleProjectSelectAll(e) {
                    e.stopPropagation();
                    this.props.onUpdateSelectAll();
                }
            }, {
                key: "toggleProjectSelected",
                value: function toggleProjectSelected(e) {
                    e.stopPropagation();
                    var target = e.currentTarget;
                    if (!target.classList.contains("disabled")) {
                        var id = parseInt(target.getAttribute("id"));
                        this.props.onUpdateProjectSelection(id);
                    }
                }
            }, {
                key: "componentDidMount",
                value: function componentDidMount() {
                    var userId = (0, _utils.dataFromElement)("user-to-restrict").id;
                    this.props.setStore({
                        userId: userId
                    });
                    var strings = (0, _utils.dataFromElement)("user-projects-text");
                    this.props.setStore({
                        strings: strings
                    });
                    this.props.onFetchUserProjects(userId);
                }
            }, {
                key: "render",
                value: function render() {
                    var _props = this.props, selectAll = _props.selectAll, groupedProjects = _props.groupedProjects, isRestricted = _props.isRestricted, error = _props.error;
                    return groupedProjects ? _react2.default.createElement(Projects, {
                        _: this._,
                        error: error,
                        isRestricted: isRestricted,
                        selectAll: selectAll,
                        groupedProjects: groupedProjects,
                        onChangeIsRestricted: this.toggleIsRestricted,
                        onChangeProjectSelectAll: this.toggleProjectSelectAll,
                        onChangeProjectSelected: this.toggleProjectSelected
                    }) : _react2.default.createElement("div", null, (0, _utils._)("loading"));
                }
            } ]);
            return App;
        }(_react2.default.Component);
        var mapStateToProps = function mapStateToProps(state) {
            var fetching = state.fetching, error = state.error, groupedProjects = state.groupedProjects, isRestricted = state.isRestricted, selectAll = state.selectAll, strings = state.strings;
            return {
                fetching: fetching,
                error: error,
                groupedProjects: groupedProjects,
                isRestricted: isRestricted,
                selectAll: selectAll,
                strings: strings
            };
        };
        var mapDispatchToProps = function mapDispatchToProps(dispatch) {
            return {
                onFetchUserProjects: function onFetchUserProjects(userId) {
                    return dispatch({
                        type: c.API_GET_INIT,
                        data: {
                            userId: userId
                        }
                    });
                },
                setStore: function setStore(data) {
                    return dispatch({
                        type: c.SET_STORE,
                        data: data
                    });
                },
                onUpdateProjectSelection: function onUpdateProjectSelection(projectId) {
                    return dispatch({
                        type: c.UPDATE_PROJECT_SELECTION,
                        data: {
                            projectId: projectId
                        }
                    });
                },
                onUpdateIsRestricted: function onUpdateIsRestricted(isRestricted) {
                    return dispatch({
                        type: c.UPDATE_IS_RESTRICTED,
                        data: {
                            isRestricted: isRestricted
                        }
                    });
                },
                onUpdateSelectAll: function onUpdateSelectAll() {
                    return dispatch({
                        type: c.UPDATE_SELECT_ALL_PROJECTS
                    });
                }
            };
        };
        exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);
    },
    736: function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var endpoints = exports.endpoints = {
            user_projects_access: function user_projects_access(id) {
                return "/rest/v1/user_projects_access/" + id + "/?format=json";
            }
        };
        var inArray = exports.inArray = function inArray(obj, arr) {
            return arr && arr.indexOf(obj) !== -1;
        };
        var dataFromElement = exports.dataFromElement = function dataFromElement(elementName) {
            return JSON.parse(document.getElementById(elementName).innerHTML);
        };
    },
    737: function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var SET_STORE = exports.SET_STORE = "SET_STORE", API_GET_INIT = exports.API_GET_INIT = "API_GET_INIT", API_GET_SUCCESS = exports.API_GET_SUCCESS = "API_GET_SUCCESS", API_GET_FAILURE = exports.API_GET_FAILURE = "API_GET_FAILURE", API_PUT_INIT = exports.API_PUT_INIT = "API_PUT_INIT", API_PUT_SUCCESS = exports.API_PUT_SUCCESS = "API_PUT_SUCCESS", API_PUT_FAILURE = exports.API_PUT_FAILURE = "API_PUT_FAILURE", UPDATE_PROJECT_SELECTION = exports.UPDATE_PROJECT_SELECTION = "UPDATE_PROJECT_SELECTION", UPDATE_IS_RESTRICTED = exports.UPDATE_IS_RESTRICTED = "UPDATE_IS_RESTRICTED", UPDATE_SELECT_ALL_PROJECTS = exports.UPDATE_SELECT_ALL_PROJECTS = "UPDATE_SELECT_ALL_PROJECTS";
    },
    739: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.utils = exports.effects = exports.detach = exports.CANCEL = exports.delay = exports.throttle = exports.takeLatest = exports.takeEvery = exports.buffers = exports.channel = exports.eventChannel = exports.END = exports.runSaga = undefined;
        var _runSaga = __webpack_require__(740);
        Object.defineProperty(exports, "runSaga", {
            enumerable: true,
            get: function get() {
                return _runSaga.runSaga;
            }
        });
        var _channel = __webpack_require__(748);
        Object.defineProperty(exports, "END", {
            enumerable: true,
            get: function get() {
                return _channel.END;
            }
        });
        Object.defineProperty(exports, "eventChannel", {
            enumerable: true,
            get: function get() {
                return _channel.eventChannel;
            }
        });
        Object.defineProperty(exports, "channel", {
            enumerable: true,
            get: function get() {
                return _channel.channel;
            }
        });
        var _buffers = __webpack_require__(749);
        Object.defineProperty(exports, "buffers", {
            enumerable: true,
            get: function get() {
                return _buffers.buffers;
            }
        });
        var _sagaHelpers = __webpack_require__(745);
        Object.defineProperty(exports, "takeEvery", {
            enumerable: true,
            get: function get() {
                return _sagaHelpers.takeEvery;
            }
        });
        Object.defineProperty(exports, "takeLatest", {
            enumerable: true,
            get: function get() {
                return _sagaHelpers.takeLatest;
            }
        });
        Object.defineProperty(exports, "throttle", {
            enumerable: true,
            get: function get() {
                return _sagaHelpers.throttle;
            }
        });
        var _utils = __webpack_require__(741);
        Object.defineProperty(exports, "delay", {
            enumerable: true,
            get: function get() {
                return _utils.delay;
            }
        });
        Object.defineProperty(exports, "CANCEL", {
            enumerable: true,
            get: function get() {
                return _utils.CANCEL;
            }
        });
        var _io = __webpack_require__(744);
        Object.defineProperty(exports, "detach", {
            enumerable: true,
            get: function get() {
                return _io.detach;
            }
        });
        var _middleware = __webpack_require__(752);
        var _middleware2 = _interopRequireDefault(_middleware);
        var _effects = __webpack_require__(753);
        var effects = _interopRequireWildcard(_effects);
        var _utils2 = __webpack_require__(754);
        var utils = _interopRequireWildcard(_utils2);
        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        exports.default = _middleware2.default;
        exports.effects = effects;
        exports.utils = utils;
    },
    740: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.runSaga = runSaga;
            var _utils = __webpack_require__(741);
            var _proc = __webpack_require__(742);
            var _proc2 = _interopRequireDefault(_proc);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
            var RUN_SAGA_SIGNATURE = "runSaga(storeInterface, saga, ...args)";
            var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ": saga argument must be a Generator function!";
            function runSaga(storeInterface, saga) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }
                var iterator = void 0;
                if (_utils.is.iterator(storeInterface)) {
                    if (process.env.NODE_ENV === "development") {
                        (0, _utils.log)("warn", "runSaga(iterator, storeInterface) has been deprecated in favor of " + RUN_SAGA_SIGNATURE);
                    }
                    iterator = storeInterface;
                    storeInterface = saga;
                } else {
                    (0, _utils.check)(saga, _utils.is.func, NON_GENERATOR_ERR);
                    iterator = saga.apply(undefined, args);
                    (0, _utils.check)(iterator, _utils.is.iterator, NON_GENERATOR_ERR);
                }
                var _storeInterface = storeInterface, subscribe = _storeInterface.subscribe, dispatch = _storeInterface.dispatch, getState = _storeInterface.getState, context = _storeInterface.context, sagaMonitor = _storeInterface.sagaMonitor, logger = _storeInterface.logger, onError = _storeInterface.onError;
                var effectId = (0, _utils.uid)();
                if (sagaMonitor) {
                    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || _utils.noop;
                    sagaMonitor.effectResolved = sagaMonitor.effectResolved || _utils.noop;
                    sagaMonitor.effectRejected = sagaMonitor.effectRejected || _utils.noop;
                    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || _utils.noop;
                    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || _utils.noop;
                    sagaMonitor.effectTriggered({
                        effectId: effectId,
                        root: true,
                        parentEffectId: 0,
                        effect: {
                            root: true,
                            saga: saga,
                            args: args
                        }
                    });
                }
                var task = (0, _proc2.default)(iterator, subscribe, (0, _utils.wrapSagaDispatch)(dispatch), getState, context, {
                    sagaMonitor: sagaMonitor,
                    logger: logger,
                    onError: onError
                }, effectId, saga.name);
                if (sagaMonitor) {
                    sagaMonitor.effectResolved(effectId, task);
                }
                return task;
            }
        }).call(exports, __webpack_require__(3));
    },
    741: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            };
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.check = check;
            exports.hasOwn = hasOwn;
            exports.remove = remove;
            exports.deferred = deferred;
            exports.arrayOfDeffered = arrayOfDeffered;
            exports.delay = delay;
            exports.createMockTask = createMockTask;
            exports.autoInc = autoInc;
            exports.makeIterator = makeIterator;
            exports.log = log;
            exports.deprecate = deprecate;
            var sym = exports.sym = function sym(id) {
                return "@@redux-saga/" + id;
            };
            var TASK = exports.TASK = sym("TASK");
            var HELPER = exports.HELPER = sym("HELPER");
            var MATCH = exports.MATCH = sym("MATCH");
            var CANCEL = exports.CANCEL = sym("CANCEL_PROMISE");
            var SAGA_ACTION = exports.SAGA_ACTION = sym("SAGA_ACTION");
            var SELF_CANCELLATION = exports.SELF_CANCELLATION = sym("SELF_CANCELLATION");
            var konst = exports.konst = function konst(v) {
                return function() {
                    return v;
                };
            };
            var kTrue = exports.kTrue = konst(true);
            var kFalse = exports.kFalse = konst(false);
            var noop = exports.noop = function noop() {};
            var ident = exports.ident = function ident(v) {
                return v;
            };
            function check(value, predicate, error) {
                if (!predicate(value)) {
                    log("error", "uncaught at check", error);
                    throw new Error(error);
                }
            }
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            function hasOwn(object, property) {
                return is.notUndef(object) && hasOwnProperty.call(object, property);
            }
            var is = exports.is = {
                undef: function undef(v) {
                    return v === null || v === undefined;
                },
                notUndef: function notUndef(v) {
                    return v !== null && v !== undefined;
                },
                func: function func(f) {
                    return typeof f === "function";
                },
                number: function number(n) {
                    return typeof n === "number";
                },
                string: function string(s) {
                    return typeof s === "string";
                },
                array: Array.isArray,
                object: function object(obj) {
                    return obj && !is.array(obj) && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
                },
                promise: function promise(p) {
                    return p && is.func(p.then);
                },
                iterator: function iterator(it) {
                    return it && is.func(it.next) && is.func(it.throw);
                },
                iterable: function iterable(it) {
                    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
                },
                task: function task(t) {
                    return t && t[TASK];
                },
                observable: function observable(ob) {
                    return ob && is.func(ob.subscribe);
                },
                buffer: function buffer(buf) {
                    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
                },
                pattern: function pattern(pat) {
                    return pat && (is.string(pat) || (typeof pat === "undefined" ? "undefined" : _typeof(pat)) === "symbol" || is.func(pat) || is.array(pat));
                },
                channel: function channel(ch) {
                    return ch && is.func(ch.take) && is.func(ch.close);
                },
                helper: function helper(it) {
                    return it && it[HELPER];
                },
                stringableFunc: function stringableFunc(f) {
                    return is.func(f) && hasOwn(f, "toString");
                }
            };
            var object = exports.object = {
                assign: function assign(target, source) {
                    for (var i in source) {
                        if (hasOwn(source, i)) {
                            target[i] = source[i];
                        }
                    }
                }
            };
            function remove(array, item) {
                var index = array.indexOf(item);
                if (index >= 0) {
                    array.splice(index, 1);
                }
            }
            var array = exports.array = {
                from: function from(obj) {
                    var arr = Array(obj.length);
                    for (var i in obj) {
                        if (hasOwn(obj, i)) {
                            arr[i] = obj[i];
                        }
                    }
                    return arr;
                }
            };
            function deferred() {
                var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var def = _extends({}, props);
                var promise = new Promise(function(resolve, reject) {
                    def.resolve = resolve;
                    def.reject = reject;
                });
                def.promise = promise;
                return def;
            }
            function arrayOfDeffered(length) {
                var arr = [];
                for (var i = 0; i < length; i++) {
                    arr.push(deferred());
                }
                return arr;
            }
            function delay(ms) {
                var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                var timeoutId = void 0;
                var promise = new Promise(function(resolve) {
                    timeoutId = setTimeout(function() {
                        return resolve(val);
                    }, ms);
                });
                promise[CANCEL] = function() {
                    return clearTimeout(timeoutId);
                };
                return promise;
            }
            function createMockTask() {
                var _ref;
                var running = true;
                var _result = void 0, _error = void 0;
                return _ref = {}, _ref[TASK] = true, _ref.isRunning = function isRunning() {
                    return running;
                }, _ref.result = function result() {
                    return _result;
                }, _ref.error = function error() {
                    return _error;
                }, _ref.setRunning = function setRunning(b) {
                    return running = b;
                }, _ref.setResult = function setResult(r) {
                    return _result = r;
                }, _ref.setError = function setError(e) {
                    return _error = e;
                }, _ref;
            }
            function autoInc() {
                var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                return function() {
                    return ++seed;
                };
            }
            var uid = exports.uid = autoInc();
            var kThrow = function kThrow(err) {
                throw err;
            };
            var kReturn = function kReturn(value) {
                return {
                    value: value,
                    done: true
                };
            };
            function makeIterator(next) {
                var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
                var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
                var isHelper = arguments[3];
                var iterator = {
                    name: name,
                    next: next,
                    throw: thro,
                    return: kReturn
                };
                if (isHelper) {
                    iterator[HELPER] = true;
                }
                if (typeof Symbol !== "undefined") {
                    iterator[Symbol.iterator] = function() {
                        return iterator;
                    };
                }
                return iterator;
            }
            function log(level, message) {
                var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
                if (typeof window === "undefined") {
                    console.log("redux-saga " + level + ": " + message + "\n" + (error && error.stack || error));
                } else {
                    console[level](message, error);
                }
            }
            function deprecate(fn, deprecationWarning) {
                return function() {
                    if (process.env.NODE_ENV === "development") log("warn", deprecationWarning);
                    return fn.apply(undefined, arguments);
                };
            }
            var updateIncentive = exports.updateIncentive = function updateIncentive(deprecated, preferred) {
                return deprecated + " has been deprecated in favor of " + preferred + ", please update your code";
            };
            var internalErr = exports.internalErr = function internalErr(err) {
                return new Error("\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: " + err + "\n");
            };
            var createSetContextWarning = exports.createSetContextWarning = function createSetContextWarning(ctx, props) {
                return (ctx ? ctx + "." : "") + "setContext(props): argument " + props + " is not a plain object";
            };
            var wrapSagaDispatch = exports.wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
                return function(action) {
                    return dispatch(Object.defineProperty(action, SAGA_ACTION, {
                        value: true
                    }));
                };
            };
            var cloneableGenerator = exports.cloneableGenerator = function cloneableGenerator(generatorFunc) {
                return function() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }
                    var history = [];
                    var gen = generatorFunc.apply(undefined, args);
                    return {
                        next: function next(arg) {
                            history.push(arg);
                            return gen.next(arg);
                        },
                        clone: function clone() {
                            var clonedGen = cloneableGenerator(generatorFunc).apply(undefined, args);
                            history.forEach(function(arg) {
                                return clonedGen.next(arg);
                            });
                            return clonedGen;
                        },
                        return: function _return(value) {
                            return gen.return(value);
                        },
                        throw: function _throw(exception) {
                            return gen.throw(exception);
                        }
                    };
                };
            };
        }).call(exports, __webpack_require__(3));
    },
    742: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.TASK_CANCEL = exports.CHANNEL_END = exports.NOT_ITERATOR_ERROR = undefined;
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        exports.default = proc;
        var _utils = __webpack_require__(741);
        var _scheduler = __webpack_require__(743);
        var _io = __webpack_require__(744);
        var _channel = __webpack_require__(748);
        var _buffers = __webpack_require__(749);
        function _defineEnumerableProperties(obj, descs) {
            for (var key in descs) {
                var desc = descs[key];
                desc.configurable = desc.enumerable = true;
                if ("value" in desc) desc.writable = true;
                Object.defineProperty(obj, key, desc);
            }
            return obj;
        }
        var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = "proc first argument (Saga function result) must be an iterator";
        var CHANNEL_END = exports.CHANNEL_END = {
            toString: function toString() {
                return "@@redux-saga/CHANNEL_END";
            }
        };
        var TASK_CANCEL = exports.TASK_CANCEL = {
            toString: function toString() {
                return "@@redux-saga/TASK_CANCEL";
            }
        };
        var matchers = {
            wildcard: function wildcard() {
                return _utils.kTrue;
            },
            default: function _default(pattern) {
                return (typeof pattern === "undefined" ? "undefined" : _typeof(pattern)) === "symbol" ? function(input) {
                    return input.type === pattern;
                } : function(input) {
                    return input.type === String(pattern);
                };
            },
            array: function array(patterns) {
                return function(input) {
                    return patterns.some(function(p) {
                        return matcher(p)(input);
                    });
                };
            },
            predicate: function predicate(_predicate) {
                return function(input) {
                    return _predicate(input);
                };
            }
        };
        function matcher(pattern) {
            return (pattern === "*" ? matchers.wildcard : _utils.is.array(pattern) ? matchers.array : _utils.is.stringableFunc(pattern) ? matchers.default : _utils.is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
        }
        function forkQueue(name, mainTask, cb) {
            var tasks = [], result = void 0, completed = false;
            addTask(mainTask);
            function abort(err) {
                cancelAll();
                cb(err, true);
            }
            function addTask(task) {
                tasks.push(task);
                task.cont = function(res, isErr) {
                    if (completed) {
                        return;
                    }
                    (0, _utils.remove)(tasks, task);
                    task.cont = _utils.noop;
                    if (isErr) {
                        abort(res);
                    } else {
                        if (task === mainTask) {
                            result = res;
                        }
                        if (!tasks.length) {
                            completed = true;
                            cb(result);
                        }
                    }
                };
            }
            function cancelAll() {
                if (completed) {
                    return;
                }
                completed = true;
                tasks.forEach(function(t) {
                    t.cont = _utils.noop;
                    t.cancel();
                });
                tasks = [];
            }
            return {
                addTask: addTask,
                cancelAll: cancelAll,
                abort: abort,
                getTasks: function getTasks() {
                    return tasks;
                },
                taskNames: function taskNames() {
                    return tasks.map(function(t) {
                        return t.name;
                    });
                }
            };
        }
        function createTaskIterator(_ref) {
            var context = _ref.context, fn = _ref.fn, args = _ref.args;
            if (_utils.is.iterator(fn)) {
                return fn;
            }
            var result = void 0, error = void 0;
            try {
                result = fn.apply(context, args);
            } catch (err) {
                error = err;
            }
            if (_utils.is.iterator(result)) {
                return result;
            }
            return error ? (0, _utils.makeIterator)(function() {
                throw error;
            }) : (0, _utils.makeIterator)(function() {
                var pc = void 0;
                var eff = {
                    done: false,
                    value: result
                };
                var ret = function ret(value) {
                    return {
                        done: true,
                        value: value
                    };
                };
                return function(arg) {
                    if (!pc) {
                        pc = true;
                        return eff;
                    } else {
                        return ret(arg);
                    }
                };
            }());
        }
        var wrapHelper = function wrapHelper(helper) {
            return {
                fn: helper
            };
        };
        function proc(iterator) {
            var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function() {
                return _utils.noop;
            };
            var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.noop;
            var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _utils.noop;
            var parentContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
            var parentEffectId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var name = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "anonymous";
            var cont = arguments[8];
            (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);
            var effectsString = "[...effects]";
            var runParallelEffect = (0, _utils.deprecate)(runAllEffect, (0, _utils.updateIncentive)(effectsString, "all(" + effectsString + ")"));
            var sagaMonitor = options.sagaMonitor, logger = options.logger, onError = options.onError;
            var log = logger || _utils.log;
            var logError = function logError(err) {
                var message = err.sagaStack;
                if (!message && err.stack) {
                    message = err.stack.split("\n")[0].indexOf(err.message) !== -1 ? err.stack : "Error: " + err.message + "\n" + err.stack;
                }
                log("error", "uncaught at " + name, message || err.message || err);
            };
            var stdChannel = (0, _channel.stdChannel)(subscribe);
            var taskContext = Object.create(parentContext);
            next.cancel = _utils.noop;
            var task = newTask(parentEffectId, name, iterator, cont);
            var mainTask = {
                name: name,
                cancel: cancelMain,
                isRunning: true
            };
            var taskQueue = forkQueue(name, mainTask, end);
            function cancelMain() {
                if (mainTask.isRunning && !mainTask.isCancelled) {
                    mainTask.isCancelled = true;
                    next(TASK_CANCEL);
                }
            }
            function cancel() {
                if (iterator._isRunning && !iterator._isCancelled) {
                    iterator._isCancelled = true;
                    taskQueue.cancelAll();
                    end(TASK_CANCEL);
                }
            }
            cont && (cont.cancel = cancel);
            iterator._isRunning = true;
            next();
            return task;
            function next(arg, isErr) {
                if (!mainTask.isRunning) {
                    throw new Error("Trying to resume an already finished generator");
                }
                try {
                    var result = void 0;
                    if (isErr) {
                        result = iterator.throw(arg);
                    } else if (arg === TASK_CANCEL) {
                        mainTask.isCancelled = true;
                        next.cancel();
                        result = _utils.is.func(iterator.return) ? iterator.return(TASK_CANCEL) : {
                            done: true,
                            value: TASK_CANCEL
                        };
                    } else if (arg === CHANNEL_END) {
                        result = _utils.is.func(iterator.return) ? iterator.return() : {
                            done: true
                        };
                    } else {
                        result = iterator.next(arg);
                    }
                    if (!result.done) {
                        runEffect(result.value, parentEffectId, "", next);
                    } else {
                        mainTask.isMainRunning = false;
                        mainTask.cont && mainTask.cont(result.value);
                    }
                } catch (error) {
                    if (mainTask.isCancelled) {
                        logError(error);
                    }
                    mainTask.isMainRunning = false;
                    mainTask.cont(error, true);
                }
            }
            function end(result, isErr) {
                iterator._isRunning = false;
                stdChannel.close();
                if (!isErr) {
                    iterator._result = result;
                    iterator._deferredEnd && iterator._deferredEnd.resolve(result);
                } else {
                    if (result instanceof Error) {
                        Object.defineProperty(result, "sagaStack", {
                            value: "at " + name + " \n " + (result.sagaStack || result.stack),
                            configurable: true
                        });
                    }
                    if (!task.cont) {
                        if (result instanceof Error && onError) {
                            onError(result);
                        } else {
                            logError(result);
                        }
                    }
                    iterator._error = result;
                    iterator._isAborted = true;
                    iterator._deferredEnd && iterator._deferredEnd.reject(result);
                }
                task.cont && task.cont(result, isErr);
                task.joiners.forEach(function(j) {
                    return j.cb(result, isErr);
                });
                task.joiners = null;
            }
            function runEffect(effect, parentEffectId) {
                var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
                var cb = arguments[3];
                var effectId = (0, _utils.uid)();
                sagaMonitor && sagaMonitor.effectTriggered({
                    effectId: effectId,
                    parentEffectId: parentEffectId,
                    label: label,
                    effect: effect
                });
                var effectSettled = void 0;
                function currCb(res, isErr) {
                    if (effectSettled) {
                        return;
                    }
                    effectSettled = true;
                    cb.cancel = _utils.noop;
                    if (sagaMonitor) {
                        isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
                    }
                    cb(res, isErr);
                }
                currCb.cancel = _utils.noop;
                cb.cancel = function() {
                    if (effectSettled) {
                        return;
                    }
                    effectSettled = true;
                    try {
                        currCb.cancel();
                    } catch (err) {
                        logError(err);
                    }
                    currCb.cancel = _utils.noop;
                    sagaMonitor && sagaMonitor.effectCancelled(effectId);
                };
                var data = void 0;
                return _utils.is.promise(effect) ? resolvePromise(effect, currCb) : _utils.is.helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : _utils.is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb) : _utils.is.array(effect) ? runParallelEffect(effect, effectId, currCb) : (data = _io.asEffect.take(effect)) ? runTakeEffect(data, currCb) : (data = _io.asEffect.put(effect)) ? runPutEffect(data, currCb) : (data = _io.asEffect.all(effect)) ? runAllEffect(data, effectId, currCb) : (data = _io.asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = _io.asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : (data = _io.asEffect.cps(effect)) ? runCPSEffect(data, currCb) : (data = _io.asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = _io.asEffect.join(effect)) ? runJoinEffect(data, currCb) : (data = _io.asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : (data = _io.asEffect.select(effect)) ? runSelectEffect(data, currCb) : (data = _io.asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = _io.asEffect.flush(effect)) ? runFlushEffect(data, currCb) : (data = _io.asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = _io.asEffect.getContext(effect)) ? runGetContextEffect(data, currCb) : (data = _io.asEffect.setContext(effect)) ? runSetContextEffect(data, currCb) : currCb(effect);
            }
            function resolvePromise(promise, cb) {
                var cancelPromise = promise[_utils.CANCEL];
                if (_utils.is.func(cancelPromise)) {
                    cb.cancel = cancelPromise;
                } else if (_utils.is.func(promise.abort)) {
                    cb.cancel = function() {
                        return promise.abort();
                    };
                }
                promise.then(cb, function(error) {
                    return cb(error, true);
                });
            }
            function resolveIterator(iterator, effectId, name, cb) {
                proc(iterator, subscribe, dispatch, getState, taskContext, options, effectId, name, cb);
            }
            function runTakeEffect(_ref2, cb) {
                var channel = _ref2.channel, pattern = _ref2.pattern, maybe = _ref2.maybe;
                channel = channel || stdChannel;
                var takeCb = function takeCb(inp) {
                    return inp instanceof Error ? cb(inp, true) : (0, _channel.isEnd)(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
                };
                try {
                    channel.take(takeCb, matcher(pattern));
                } catch (err) {
                    return cb(err, true);
                }
                cb.cancel = takeCb.cancel;
            }
            function runPutEffect(_ref3, cb) {
                var channel = _ref3.channel, action = _ref3.action, resolve = _ref3.resolve;
                (0, _scheduler.asap)(function() {
                    var result = void 0;
                    try {
                        result = (channel ? channel.put : dispatch)(action);
                    } catch (error) {
                        if (channel || resolve) return cb(error, true);
                        logError(error);
                    }
                    if (resolve && _utils.is.promise(result)) {
                        resolvePromise(result, cb);
                    } else {
                        return cb(result);
                    }
                });
            }
            function runCallEffect(_ref4, effectId, cb) {
                var context = _ref4.context, fn = _ref4.fn, args = _ref4.args;
                var result = void 0;
                try {
                    result = fn.apply(context, args);
                } catch (error) {
                    return cb(error, true);
                }
                return _utils.is.promise(result) ? resolvePromise(result, cb) : _utils.is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
            }
            function runCPSEffect(_ref5, cb) {
                var context = _ref5.context, fn = _ref5.fn, args = _ref5.args;
                try {
                    var cpsCb = function cpsCb(err, res) {
                        return _utils.is.undef(err) ? cb(res) : cb(err, true);
                    };
                    fn.apply(context, args.concat(cpsCb));
                    if (cpsCb.cancel) {
                        cb.cancel = function() {
                            return cpsCb.cancel();
                        };
                    }
                } catch (error) {
                    return cb(error, true);
                }
            }
            function runForkEffect(_ref6, effectId, cb) {
                var context = _ref6.context, fn = _ref6.fn, args = _ref6.args, detached = _ref6.detached;
                var taskIterator = createTaskIterator({
                    context: context,
                    fn: fn,
                    args: args
                });
                try {
                    (0, _scheduler.suspend)();
                    var _task = proc(taskIterator, subscribe, dispatch, getState, taskContext, options, effectId, fn.name, detached ? null : _utils.noop);
                    if (detached) {
                        cb(_task);
                    } else {
                        if (taskIterator._isRunning) {
                            taskQueue.addTask(_task);
                            cb(_task);
                        } else if (taskIterator._error) {
                            taskQueue.abort(taskIterator._error);
                        } else {
                            cb(_task);
                        }
                    }
                } finally {
                    (0, _scheduler.flush)();
                }
            }
            function runJoinEffect(t, cb) {
                if (t.isRunning()) {
                    var joiner = {
                        task: task,
                        cb: cb
                    };
                    cb.cancel = function() {
                        return (0, _utils.remove)(t.joiners, joiner);
                    };
                    t.joiners.push(joiner);
                } else {
                    t.isAborted() ? cb(t.error(), true) : cb(t.result());
                }
            }
            function runCancelEffect(taskToCancel, cb) {
                if (taskToCancel === _utils.SELF_CANCELLATION) {
                    taskToCancel = task;
                }
                if (taskToCancel.isRunning()) {
                    taskToCancel.cancel();
                }
                cb();
            }
            function runAllEffect(effects, effectId, cb) {
                var keys = Object.keys(effects);
                if (!keys.length) {
                    return cb(_utils.is.array(effects) ? [] : {});
                }
                var completedCount = 0;
                var completed = void 0;
                var results = {};
                var childCbs = {};
                function checkEffectEnd() {
                    if (completedCount === keys.length) {
                        completed = true;
                        cb(_utils.is.array(effects) ? _utils.array.from(_extends({}, results, {
                            length: keys.length
                        })) : results);
                    }
                }
                keys.forEach(function(key) {
                    var chCbAtKey = function chCbAtKey(res, isErr) {
                        if (completed) {
                            return;
                        }
                        if (isErr || (0, _channel.isEnd)(res) || res === CHANNEL_END || res === TASK_CANCEL) {
                            cb.cancel();
                            cb(res, isErr);
                        } else {
                            results[key] = res;
                            completedCount++;
                            checkEffectEnd();
                        }
                    };
                    chCbAtKey.cancel = _utils.noop;
                    childCbs[key] = chCbAtKey;
                });
                cb.cancel = function() {
                    if (!completed) {
                        completed = true;
                        keys.forEach(function(key) {
                            return childCbs[key].cancel();
                        });
                    }
                };
                keys.forEach(function(key) {
                    return runEffect(effects[key], effectId, key, childCbs[key]);
                });
            }
            function runRaceEffect(effects, effectId, cb) {
                var completed = void 0;
                var keys = Object.keys(effects);
                var childCbs = {};
                keys.forEach(function(key) {
                    var chCbAtKey = function chCbAtKey(res, isErr) {
                        if (completed) {
                            return;
                        }
                        if (isErr) {
                            cb.cancel();
                            cb(res, true);
                        } else if (!(0, _channel.isEnd)(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
                            var _response;
                            cb.cancel();
                            completed = true;
                            var response = (_response = {}, _response[key] = res, _response);
                            cb(_utils.is.array(effects) ? [].slice.call(_extends({}, response, {
                                length: keys.length
                            })) : response);
                        }
                    };
                    chCbAtKey.cancel = _utils.noop;
                    childCbs[key] = chCbAtKey;
                });
                cb.cancel = function() {
                    if (!completed) {
                        completed = true;
                        keys.forEach(function(key) {
                            return childCbs[key].cancel();
                        });
                    }
                };
                keys.forEach(function(key) {
                    if (completed) {
                        return;
                    }
                    runEffect(effects[key], effectId, key, childCbs[key]);
                });
            }
            function runSelectEffect(_ref7, cb) {
                var selector = _ref7.selector, args = _ref7.args;
                try {
                    var state = selector.apply(undefined, [ getState() ].concat(args));
                    cb(state);
                } catch (error) {
                    cb(error, true);
                }
            }
            function runChannelEffect(_ref8, cb) {
                var pattern = _ref8.pattern, buffer = _ref8.buffer;
                var match = matcher(pattern);
                match.pattern = pattern;
                cb((0, _channel.eventChannel)(subscribe, buffer || _buffers.buffers.fixed(), match));
            }
            function runCancelledEffect(data, cb) {
                cb(!!mainTask.isCancelled);
            }
            function runFlushEffect(channel, cb) {
                channel.flush(cb);
            }
            function runGetContextEffect(prop, cb) {
                cb(taskContext[prop]);
            }
            function runSetContextEffect(props, cb) {
                _utils.object.assign(taskContext, props);
                cb();
            }
            function newTask(id, name, iterator, cont) {
                var _done, _ref9, _mutatorMap;
                iterator._deferredEnd = null;
                return _ref9 = {}, _ref9[_utils.TASK] = true, _ref9.id = id, _ref9.name = name, 
                _done = "done", _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, 
                _mutatorMap[_done].get = function() {
                    if (iterator._deferredEnd) {
                        return iterator._deferredEnd.promise;
                    } else {
                        var def = (0, _utils.deferred)();
                        iterator._deferredEnd = def;
                        if (!iterator._isRunning) {
                            iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
                        }
                        return def.promise;
                    }
                }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
                    return iterator._isRunning;
                }, _ref9.isCancelled = function isCancelled() {
                    return iterator._isCancelled;
                }, _ref9.isAborted = function isAborted() {
                    return iterator._isAborted;
                }, _ref9.result = function result() {
                    return iterator._result;
                }, _ref9.error = function error() {
                    return iterator._error;
                }, _ref9.setContext = function setContext(props) {
                    (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)("task", props));
                    _utils.object.assign(taskContext, props);
                }, _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
            }
        }
    },
    743: function(module, exports) {
        "use strict";
        exports.__esModule = true;
        exports.asap = asap;
        exports.suspend = suspend;
        exports.flush = flush;
        var queue = [];
        var semaphore = 0;
        function exec(task) {
            try {
                suspend();
                task();
            } finally {
                release();
            }
        }
        function asap(task) {
            queue.push(task);
            if (!semaphore) {
                suspend();
                flush();
            }
        }
        function suspend() {
            semaphore++;
        }
        function release() {
            semaphore--;
        }
        function flush() {
            release();
            var task = void 0;
            while (!semaphore && (task = queue.shift()) !== undefined) {
                exec(task);
            }
        }
    },
    744: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.asEffect = exports.takem = exports.detach = undefined;
        exports.take = take;
        exports.put = put;
        exports.all = all;
        exports.race = race;
        exports.call = call;
        exports.apply = apply;
        exports.cps = cps;
        exports.fork = fork;
        exports.spawn = spawn;
        exports.join = join;
        exports.cancel = cancel;
        exports.select = select;
        exports.actionChannel = actionChannel;
        exports.cancelled = cancelled;
        exports.flush = flush;
        exports.getContext = getContext;
        exports.setContext = setContext;
        exports.takeEvery = takeEvery;
        exports.takeLatest = takeLatest;
        exports.throttle = throttle;
        var _utils = __webpack_require__(741);
        var _sagaHelpers = __webpack_require__(745);
        var IO = (0, _utils.sym)("IO");
        var TAKE = "TAKE";
        var PUT = "PUT";
        var ALL = "ALL";
        var RACE = "RACE";
        var CALL = "CALL";
        var CPS = "CPS";
        var FORK = "FORK";
        var JOIN = "JOIN";
        var CANCEL = "CANCEL";
        var SELECT = "SELECT";
        var ACTION_CHANNEL = "ACTION_CHANNEL";
        var CANCELLED = "CANCELLED";
        var FLUSH = "FLUSH";
        var GET_CONTEXT = "GET_CONTEXT";
        var SET_CONTEXT = "SET_CONTEXT";
        var TEST_HINT = "\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)";
        var effect = function effect(type, payload) {
            var _ref;
            return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
        };
        var detach = exports.detach = function detach(eff) {
            (0, _utils.check)(asEffect.fork(eff), _utils.is.object, "detach(eff): argument must be a fork effect");
            eff[FORK].detached = true;
            return eff;
        };
        function take() {
            var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";
            if (arguments.length) {
                (0, _utils.check)(arguments[0], _utils.is.notUndef, "take(patternOrChannel): patternOrChannel is undefined");
            }
            if (_utils.is.pattern(patternOrChannel)) {
                return effect(TAKE, {
                    pattern: patternOrChannel
                });
            }
            if (_utils.is.channel(patternOrChannel)) {
                return effect(TAKE, {
                    channel: patternOrChannel
                });
            }
            throw new Error("take(patternOrChannel): argument " + String(patternOrChannel) + " is not valid channel or a valid pattern");
        }
        take.maybe = function() {
            var eff = take.apply(undefined, arguments);
            eff[TAKE].maybe = true;
            return eff;
        };
        var takem = exports.takem = (0, _utils.deprecate)(take.maybe, (0, _utils.updateIncentive)("takem", "take.maybe"));
        function put(channel, action) {
            if (arguments.length > 1) {
                (0, _utils.check)(channel, _utils.is.notUndef, "put(channel, action): argument channel is undefined");
                (0, _utils.check)(channel, _utils.is.channel, "put(channel, action): argument " + channel + " is not a valid channel");
                (0, _utils.check)(action, _utils.is.notUndef, "put(channel, action): argument action is undefined");
            } else {
                (0, _utils.check)(channel, _utils.is.notUndef, "put(action): argument action is undefined");
                action = channel;
                channel = null;
            }
            return effect(PUT, {
                channel: channel,
                action: action
            });
        }
        put.resolve = function() {
            var eff = put.apply(undefined, arguments);
            eff[PUT].resolve = true;
            return eff;
        };
        put.sync = (0, _utils.deprecate)(put.resolve, (0, _utils.updateIncentive)("put.sync", "put.resolve"));
        function all(effects) {
            return effect(ALL, effects);
        }
        function race(effects) {
            return effect(RACE, effects);
        }
        function getFnCallDesc(meth, fn, args) {
            (0, _utils.check)(fn, _utils.is.notUndef, meth + ": argument fn is undefined");
            var context = null;
            if (_utils.is.array(fn)) {
                var _fn = fn;
                context = _fn[0];
                fn = _fn[1];
            } else if (fn.fn) {
                var _fn2 = fn;
                context = _fn2.context;
                fn = _fn2.fn;
            }
            if (context && _utils.is.string(fn) && _utils.is.func(context[fn])) {
                fn = context[fn];
            }
            (0, _utils.check)(fn, _utils.is.func, meth + ": argument " + fn + " is not a function");
            return {
                context: context,
                fn: fn,
                args: args
            };
        }
        function call(fn) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }
            return effect(CALL, getFnCallDesc("call", fn, args));
        }
        function apply(context, fn) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            return effect(CALL, getFnCallDesc("apply", {
                context: context,
                fn: fn
            }, args));
        }
        function cps(fn) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }
            return effect(CPS, getFnCallDesc("cps", fn, args));
        }
        function fork(fn) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }
            return effect(FORK, getFnCallDesc("fork", fn, args));
        }
        function spawn(fn) {
            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }
            return detach(fork.apply(undefined, [ fn ].concat(args)));
        }
        function join() {
            for (var _len5 = arguments.length, tasks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                tasks[_key5] = arguments[_key5];
            }
            if (tasks.length > 1) {
                return all(tasks.map(function(t) {
                    return join(t);
                }));
            }
            var task = tasks[0];
            (0, _utils.check)(task, _utils.is.notUndef, "join(task): argument task is undefined");
            (0, _utils.check)(task, _utils.is.task, "join(task): argument " + task + " is not a valid Task object " + TEST_HINT);
            return effect(JOIN, task);
        }
        function cancel() {
            for (var _len6 = arguments.length, tasks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                tasks[_key6] = arguments[_key6];
            }
            if (tasks.length > 1) {
                return all(tasks.map(function(t) {
                    return cancel(t);
                }));
            }
            var task = tasks[0];
            if (tasks.length === 1) {
                (0, _utils.check)(task, _utils.is.notUndef, "cancel(task): argument task is undefined");
                (0, _utils.check)(task, _utils.is.task, "cancel(task): argument " + task + " is not a valid Task object " + TEST_HINT);
            }
            return effect(CANCEL, task || _utils.SELF_CANCELLATION);
        }
        function select(selector) {
            for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                args[_key7 - 1] = arguments[_key7];
            }
            if (arguments.length === 0) {
                selector = _utils.ident;
            } else {
                (0, _utils.check)(selector, _utils.is.notUndef, "select(selector,[...]): argument selector is undefined");
                (0, _utils.check)(selector, _utils.is.func, "select(selector,[...]): argument " + selector + " is not a function");
            }
            return effect(SELECT, {
                selector: selector,
                args: args
            });
        }
        function actionChannel(pattern, buffer) {
            (0, _utils.check)(pattern, _utils.is.notUndef, "actionChannel(pattern,...): argument pattern is undefined");
            if (arguments.length > 1) {
                (0, _utils.check)(buffer, _utils.is.notUndef, "actionChannel(pattern, buffer): argument buffer is undefined");
                (0, _utils.check)(buffer, _utils.is.buffer, "actionChannel(pattern, buffer): argument " + buffer + " is not a valid buffer");
            }
            return effect(ACTION_CHANNEL, {
                pattern: pattern,
                buffer: buffer
            });
        }
        function cancelled() {
            return effect(CANCELLED, {});
        }
        function flush(channel) {
            (0, _utils.check)(channel, _utils.is.channel, "flush(channel): argument " + channel + " is not valid channel");
            return effect(FLUSH, channel);
        }
        function getContext(prop) {
            (0, _utils.check)(prop, _utils.is.string, "getContext(prop): argument " + prop + " is not a string");
            return effect(GET_CONTEXT, prop);
        }
        function setContext(props) {
            (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)(null, props));
            return effect(SET_CONTEXT, props);
        }
        function takeEvery(patternOrChannel, worker) {
            for (var _len8 = arguments.length, args = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                args[_key8 - 2] = arguments[_key8];
            }
            return fork.apply(undefined, [ _sagaHelpers.takeEveryHelper, patternOrChannel, worker ].concat(args));
        }
        function takeLatest(patternOrChannel, worker) {
            for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
                args[_key9 - 2] = arguments[_key9];
            }
            return fork.apply(undefined, [ _sagaHelpers.takeLatestHelper, patternOrChannel, worker ].concat(args));
        }
        function throttle(ms, pattern, worker) {
            for (var _len10 = arguments.length, args = Array(_len10 > 3 ? _len10 - 3 : 0), _key10 = 3; _key10 < _len10; _key10++) {
                args[_key10 - 3] = arguments[_key10];
            }
            return fork.apply(undefined, [ _sagaHelpers.throttleHelper, ms, pattern, worker ].concat(args));
        }
        var createAsEffectType = function createAsEffectType(type) {
            return function(effect) {
                return effect && effect[IO] && effect[type];
            };
        };
        var asEffect = exports.asEffect = {
            take: createAsEffectType(TAKE),
            put: createAsEffectType(PUT),
            all: createAsEffectType(ALL),
            race: createAsEffectType(RACE),
            call: createAsEffectType(CALL),
            cps: createAsEffectType(CPS),
            fork: createAsEffectType(FORK),
            join: createAsEffectType(JOIN),
            cancel: createAsEffectType(CANCEL),
            select: createAsEffectType(SELECT),
            actionChannel: createAsEffectType(ACTION_CHANNEL),
            cancelled: createAsEffectType(CANCELLED),
            flush: createAsEffectType(FLUSH),
            getContext: createAsEffectType(GET_CONTEXT),
            setContext: createAsEffectType(SET_CONTEXT)
        };
    },
    745: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.throttleHelper = exports.takeLatestHelper = exports.takeEveryHelper = exports.throttle = exports.takeLatest = exports.takeEvery = undefined;
        var _takeEvery = __webpack_require__(746);
        var _takeEvery2 = _interopRequireDefault(_takeEvery);
        var _takeLatest = __webpack_require__(750);
        var _takeLatest2 = _interopRequireDefault(_takeLatest);
        var _throttle = __webpack_require__(751);
        var _throttle2 = _interopRequireDefault(_throttle);
        var _utils = __webpack_require__(741);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var deprecationWarning = function deprecationWarning(helperName) {
            return "import { " + helperName + " } from 'redux-saga' has been deprecated in favor of import { " + helperName + " } from 'redux-saga/effects'.\nThe latter will not work with yield*, as helper effects are wrapped automatically for you in fork effect.\nTherefore yield " + helperName + " will return task descriptor to your saga and execute next lines of code.";
        };
        var takeEvery = (0, _utils.deprecate)(_takeEvery2.default, deprecationWarning("takeEvery"));
        var takeLatest = (0, _utils.deprecate)(_takeLatest2.default, deprecationWarning("takeLatest"));
        var throttle = (0, _utils.deprecate)(_throttle2.default, deprecationWarning("throttle"));
        exports.takeEvery = takeEvery;
        exports.takeLatest = takeLatest;
        exports.throttle = throttle;
        exports.takeEveryHelper = _takeEvery2.default;
        exports.takeLatestHelper = _takeLatest2.default;
        exports.throttleHelper = _throttle2.default;
    },
    746: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeEvery;
        var _fsmIterator = __webpack_require__(747);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(744);
        var _channel = __webpack_require__(748);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function takeEvery(patternOrChannel, worker) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }
            var yTake = {
                done: false,
                value: (0, _io.take)(patternOrChannel)
            };
            var yFork = function yFork(ac) {
                return {
                    done: false,
                    value: _io.fork.apply(undefined, [ worker ].concat(args, [ ac ]))
                };
            };
            var action = void 0, setAction = function setAction(ac) {
                return action = ac;
            };
            return (0, _fsmIterator2.default)({
                q1: function q1() {
                    return [ "q2", yTake, setAction ];
                },
                q2: function q2() {
                    return action === _channel.END ? [ _fsmIterator.qEnd ] : [ "q1", yFork(action) ];
                }
            }, "q1", "takeEvery(" + (0, _fsmIterator.safeName)(patternOrChannel) + ", " + worker.name + ")");
        }
    },
    747: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.qEnd = undefined;
        exports.safeName = safeName;
        exports.default = fsmIterator;
        var _utils = __webpack_require__(741);
        var done = {
            done: true,
            value: undefined
        };
        var qEnd = exports.qEnd = {};
        function safeName(patternOrChannel) {
            if (_utils.is.channel(patternOrChannel)) {
                return "channel";
            } else if (Array.isArray(patternOrChannel)) {
                return String(patternOrChannel.map(function(entry) {
                    return String(entry);
                }));
            } else {
                return String(patternOrChannel);
            }
        }
        function fsmIterator(fsm, q0) {
            var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "iterator";
            var updateState = void 0, qNext = q0;
            function next(arg, error) {
                if (qNext === qEnd) {
                    return done;
                }
                if (error) {
                    qNext = qEnd;
                    throw error;
                } else {
                    updateState && updateState(arg);
                    var _fsm$qNext = fsm[qNext](), q = _fsm$qNext[0], output = _fsm$qNext[1], _updateState = _fsm$qNext[2];
                    qNext = q;
                    updateState = _updateState;
                    return qNext === qEnd ? done : output;
                }
            }
            return (0, _utils.makeIterator)(next, function(error) {
                return next(null, error);
            }, name, true);
        }
    },
    748: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.UNDEFINED_INPUT_ERROR = exports.INVALID_BUFFER = exports.isEnd = exports.END = undefined;
            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            };
            exports.emitter = emitter;
            exports.channel = channel;
            exports.eventChannel = eventChannel;
            exports.stdChannel = stdChannel;
            var _utils = __webpack_require__(741);
            var _buffers = __webpack_require__(749);
            var _scheduler = __webpack_require__(743);
            var CHANNEL_END_TYPE = "@@redux-saga/CHANNEL_END";
            var END = exports.END = {
                type: CHANNEL_END_TYPE
            };
            var isEnd = exports.isEnd = function isEnd(a) {
                return a && a.type === CHANNEL_END_TYPE;
            };
            function emitter() {
                var subscribers = [];
                function subscribe(sub) {
                    subscribers.push(sub);
                    return function() {
                        return (0, _utils.remove)(subscribers, sub);
                    };
                }
                function emit(item) {
                    var arr = subscribers.slice();
                    for (var i = 0, len = arr.length; i < len; i++) {
                        arr[i](item);
                    }
                }
                return {
                    subscribe: subscribe,
                    emit: emit
                };
            }
            var INVALID_BUFFER = exports.INVALID_BUFFER = "invalid buffer passed to channel factory function";
            var UNDEFINED_INPUT_ERROR = exports.UNDEFINED_INPUT_ERROR = "Saga was provided with an undefined action";
            if (process.env.NODE_ENV !== "production") {
                exports.UNDEFINED_INPUT_ERROR = UNDEFINED_INPUT_ERROR += "\nHints:\n    - check that your Action Creator returns a non-undefined value\n    - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n  ";
            }
            function channel() {
                var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _buffers.buffers.fixed();
                var closed = false;
                var takers = [];
                (0, _utils.check)(buffer, _utils.is.buffer, INVALID_BUFFER);
                function checkForbiddenStates() {
                    if (closed && takers.length) {
                        throw (0, _utils.internalErr)("Cannot have a closed channel with pending takers");
                    }
                    if (takers.length && !buffer.isEmpty()) {
                        throw (0, _utils.internalErr)("Cannot have pending takers with non empty buffer");
                    }
                }
                function put(input) {
                    checkForbiddenStates();
                    (0, _utils.check)(input, _utils.is.notUndef, UNDEFINED_INPUT_ERROR);
                    if (closed) {
                        return;
                    }
                    if (!takers.length) {
                        return buffer.put(input);
                    }
                    for (var i = 0; i < takers.length; i++) {
                        var cb = takers[i];
                        if (!cb[_utils.MATCH] || cb[_utils.MATCH](input)) {
                            takers.splice(i, 1);
                            return cb(input);
                        }
                    }
                }
                function take(cb) {
                    checkForbiddenStates();
                    (0, _utils.check)(cb, _utils.is.func, "channel.take's callback must be a function");
                    if (closed && buffer.isEmpty()) {
                        cb(END);
                    } else if (!buffer.isEmpty()) {
                        cb(buffer.take());
                    } else {
                        takers.push(cb);
                        cb.cancel = function() {
                            return (0, _utils.remove)(takers, cb);
                        };
                    }
                }
                function flush(cb) {
                    checkForbiddenStates();
                    (0, _utils.check)(cb, _utils.is.func, "channel.flush' callback must be a function");
                    if (closed && buffer.isEmpty()) {
                        cb(END);
                        return;
                    }
                    cb(buffer.flush());
                }
                function close() {
                    checkForbiddenStates();
                    if (!closed) {
                        closed = true;
                        if (takers.length) {
                            var arr = takers;
                            takers = [];
                            for (var i = 0, len = arr.length; i < len; i++) {
                                arr[i](END);
                            }
                        }
                    }
                }
                return {
                    take: take,
                    put: put,
                    flush: flush,
                    close: close,
                    get __takers__() {
                        return takers;
                    },
                    get __closed__() {
                        return closed;
                    }
                };
            }
            function eventChannel(subscribe) {
                var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _buffers.buffers.none();
                var matcher = arguments[2];
                if (arguments.length > 2) {
                    (0, _utils.check)(matcher, _utils.is.func, "Invalid match function passed to eventChannel");
                }
                var chan = channel(buffer);
                var close = function close() {
                    if (!chan.__closed__) {
                        if (unsubscribe) {
                            unsubscribe();
                        }
                        chan.close();
                    }
                };
                var unsubscribe = subscribe(function(input) {
                    if (isEnd(input)) {
                        close();
                        return;
                    }
                    if (matcher && !matcher(input)) {
                        return;
                    }
                    chan.put(input);
                });
                if (chan.__closed__) {
                    unsubscribe();
                }
                if (!_utils.is.func(unsubscribe)) {
                    throw new Error("in eventChannel: subscribe should return a function to unsubscribe");
                }
                return {
                    take: chan.take,
                    flush: chan.flush,
                    close: close
                };
            }
            function stdChannel(subscribe) {
                var chan = eventChannel(function(cb) {
                    return subscribe(function(input) {
                        if (input[_utils.SAGA_ACTION]) {
                            cb(input);
                            return;
                        }
                        (0, _scheduler.asap)(function() {
                            return cb(input);
                        });
                    });
                });
                return _extends({}, chan, {
                    take: function take(cb, matcher) {
                        if (arguments.length > 1) {
                            (0, _utils.check)(matcher, _utils.is.func, "channel.take's matcher argument must be a function");
                            cb[_utils.MATCH] = matcher;
                        }
                        chan.take(cb);
                    }
                });
            }
        }).call(exports, __webpack_require__(3));
    },
    749: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.buffers = exports.BUFFER_OVERFLOW = undefined;
        var _utils = __webpack_require__(741);
        var BUFFER_OVERFLOW = exports.BUFFER_OVERFLOW = "Channel's Buffer overflow!";
        var ON_OVERFLOW_THROW = 1;
        var ON_OVERFLOW_DROP = 2;
        var ON_OVERFLOW_SLIDE = 3;
        var ON_OVERFLOW_EXPAND = 4;
        var zeroBuffer = {
            isEmpty: _utils.kTrue,
            put: _utils.noop,
            take: _utils.noop
        };
        function ringBuffer() {
            var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
            var overflowAction = arguments[1];
            var arr = new Array(limit);
            var length = 0;
            var pushIndex = 0;
            var popIndex = 0;
            var push = function push(it) {
                arr[pushIndex] = it;
                pushIndex = (pushIndex + 1) % limit;
                length++;
            };
            var take = function take() {
                if (length != 0) {
                    var it = arr[popIndex];
                    arr[popIndex] = null;
                    length--;
                    popIndex = (popIndex + 1) % limit;
                    return it;
                }
            };
            var flush = function flush() {
                var items = [];
                while (length) {
                    items.push(take());
                }
                return items;
            };
            return {
                isEmpty: function isEmpty() {
                    return length == 0;
                },
                put: function put(it) {
                    if (length < limit) {
                        push(it);
                    } else {
                        var doubledLimit = void 0;
                        switch (overflowAction) {
                          case ON_OVERFLOW_THROW:
                            throw new Error(BUFFER_OVERFLOW);

                          case ON_OVERFLOW_SLIDE:
                            arr[pushIndex] = it;
                            pushIndex = (pushIndex + 1) % limit;
                            popIndex = pushIndex;
                            break;

                          case ON_OVERFLOW_EXPAND:
                            doubledLimit = 2 * limit;
                            arr = flush();
                            length = arr.length;
                            pushIndex = arr.length;
                            popIndex = 0;
                            arr.length = doubledLimit;
                            limit = doubledLimit;
                            push(it);
                            break;

                          default:                        }
                    }
                },
                take: take,
                flush: flush
            };
        }
        var buffers = exports.buffers = {
            none: function none() {
                return zeroBuffer;
            },
            fixed: function fixed(limit) {
                return ringBuffer(limit, ON_OVERFLOW_THROW);
            },
            dropping: function dropping(limit) {
                return ringBuffer(limit, ON_OVERFLOW_DROP);
            },
            sliding: function sliding(limit) {
                return ringBuffer(limit, ON_OVERFLOW_SLIDE);
            },
            expanding: function expanding(initialSize) {
                return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
            }
        };
    },
    750: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeLatest;
        var _fsmIterator = __webpack_require__(747);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(744);
        var _channel = __webpack_require__(748);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function takeLatest(patternOrChannel, worker) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }
            var yTake = {
                done: false,
                value: (0, _io.take)(patternOrChannel)
            };
            var yFork = function yFork(ac) {
                return {
                    done: false,
                    value: _io.fork.apply(undefined, [ worker ].concat(args, [ ac ]))
                };
            };
            var yCancel = function yCancel(task) {
                return {
                    done: false,
                    value: (0, _io.cancel)(task)
                };
            };
            var task = void 0, action = void 0;
            var setTask = function setTask(t) {
                return task = t;
            };
            var setAction = function setAction(ac) {
                return action = ac;
            };
            return (0, _fsmIterator2.default)({
                q1: function q1() {
                    return [ "q2", yTake, setAction ];
                },
                q2: function q2() {
                    return action === _channel.END ? [ _fsmIterator.qEnd ] : task ? [ "q3", yCancel(task) ] : [ "q1", yFork(action), setTask ];
                },
                q3: function q3() {
                    return [ "q1", yFork(action), setTask ];
                }
            }, "q1", "takeLatest(" + (0, _fsmIterator.safeName)(patternOrChannel) + ", " + worker.name + ")");
        }
    },
    751: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = throttle;
        var _fsmIterator = __webpack_require__(747);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(744);
        var _channel = __webpack_require__(748);
        var _buffers = __webpack_require__(749);
        var _utils = __webpack_require__(741);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function throttle(delayLength, pattern, worker) {
            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }
            var action = void 0, channel = void 0;
            var yActionChannel = {
                done: false,
                value: (0, _io.actionChannel)(pattern, _buffers.buffers.sliding(1))
            };
            var yTake = function yTake() {
                return {
                    done: false,
                    value: (0, _io.take)(channel)
                };
            };
            var yFork = function yFork(ac) {
                return {
                    done: false,
                    value: _io.fork.apply(undefined, [ worker ].concat(args, [ ac ]))
                };
            };
            var yDelay = {
                done: false,
                value: (0, _io.call)(_utils.delay, delayLength)
            };
            var setAction = function setAction(ac) {
                return action = ac;
            };
            var setChannel = function setChannel(ch) {
                return channel = ch;
            };
            return (0, _fsmIterator2.default)({
                q1: function q1() {
                    return [ "q2", yActionChannel, setChannel ];
                },
                q2: function q2() {
                    return [ "q3", yTake(), setAction ];
                },
                q3: function q3() {
                    return action === _channel.END ? [ _fsmIterator.qEnd ] : [ "q4", yFork(action) ];
                },
                q4: function q4() {
                    return [ "q2", yDelay ];
                }
            }, "q1", "throttle(" + (0, _fsmIterator.safeName)(pattern) + ", " + worker.name + ")");
        }
    },
    752: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.default = sagaMiddlewareFactory;
            var _utils = __webpack_require__(741);
            var _channel = __webpack_require__(748);
            var _runSaga = __webpack_require__(740);
            function _objectWithoutProperties(obj, keys) {
                var target = {};
                for (var i in obj) {
                    if (keys.indexOf(i) >= 0) continue;
                    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
                    target[i] = obj[i];
                }
                return target;
            }
            function sagaMiddlewareFactory() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var _ref$context = _ref.context, context = _ref$context === undefined ? {} : _ref$context, options = _objectWithoutProperties(_ref, [ "context" ]);
                var sagaMonitor = options.sagaMonitor, logger = options.logger, onError = options.onError;
                if (_utils.is.func(options)) {
                    if (process.env.NODE_ENV === "production") {
                        throw new Error("Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead");
                    } else {
                        throw new Error("You passed a function to the Saga middleware. You are likely trying to start a        Saga by directly passing it to the middleware. This is no longer possible starting from 0.10.0.        To run a Saga, you must do it dynamically AFTER mounting the middleware into the store.\n        Example:\n          import createSagaMiddleware from 'redux-saga'\n          ... other imports\n\n          const sagaMiddleware = createSagaMiddleware()\n          const store = createStore(reducer, applyMiddleware(sagaMiddleware))\n          sagaMiddleware.run(saga, ...args)\n      ");
                    }
                }
                if (logger && !_utils.is.func(logger)) {
                    throw new Error("`options.logger` passed to the Saga middleware is not a function!");
                }
                if (process.env.NODE_ENV === "development" && options.onerror) {
                    throw new Error("`options.onerror` was removed. Use `options.onError` instead.");
                }
                if (onError && !_utils.is.func(onError)) {
                    throw new Error("`options.onError` passed to the Saga middleware is not a function!");
                }
                if (options.emitter && !_utils.is.func(options.emitter)) {
                    throw new Error("`options.emitter` passed to the Saga middleware is not a function!");
                }
                function sagaMiddleware(_ref2) {
                    var getState = _ref2.getState, dispatch = _ref2.dispatch;
                    var sagaEmitter = (0, _channel.emitter)();
                    sagaEmitter.emit = (options.emitter || _utils.ident)(sagaEmitter.emit);
                    sagaMiddleware.run = _runSaga.runSaga.bind(null, {
                        context: context,
                        subscribe: sagaEmitter.subscribe,
                        dispatch: dispatch,
                        getState: getState,
                        sagaMonitor: sagaMonitor,
                        logger: logger,
                        onError: onError
                    });
                    return function(next) {
                        return function(action) {
                            if (sagaMonitor && sagaMonitor.actionDispatched) {
                                sagaMonitor.actionDispatched(action);
                            }
                            var result = next(action);
                            sagaEmitter.emit(action);
                            return result;
                        };
                    };
                }
                sagaMiddleware.run = function() {
                    throw new Error("Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware");
                };
                sagaMiddleware.setContext = function(props) {
                    (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)("sagaMiddleware", props));
                    _utils.object.assign(context, props);
                };
                return sagaMiddleware;
            }
        }).call(exports, __webpack_require__(3));
    },
    753: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _io = __webpack_require__(744);
        Object.defineProperty(exports, "take", {
            enumerable: true,
            get: function get() {
                return _io.take;
            }
        });
        Object.defineProperty(exports, "takem", {
            enumerable: true,
            get: function get() {
                return _io.takem;
            }
        });
        Object.defineProperty(exports, "put", {
            enumerable: true,
            get: function get() {
                return _io.put;
            }
        });
        Object.defineProperty(exports, "all", {
            enumerable: true,
            get: function get() {
                return _io.all;
            }
        });
        Object.defineProperty(exports, "race", {
            enumerable: true,
            get: function get() {
                return _io.race;
            }
        });
        Object.defineProperty(exports, "call", {
            enumerable: true,
            get: function get() {
                return _io.call;
            }
        });
        Object.defineProperty(exports, "apply", {
            enumerable: true,
            get: function get() {
                return _io.apply;
            }
        });
        Object.defineProperty(exports, "cps", {
            enumerable: true,
            get: function get() {
                return _io.cps;
            }
        });
        Object.defineProperty(exports, "fork", {
            enumerable: true,
            get: function get() {
                return _io.fork;
            }
        });
        Object.defineProperty(exports, "spawn", {
            enumerable: true,
            get: function get() {
                return _io.spawn;
            }
        });
        Object.defineProperty(exports, "join", {
            enumerable: true,
            get: function get() {
                return _io.join;
            }
        });
        Object.defineProperty(exports, "cancel", {
            enumerable: true,
            get: function get() {
                return _io.cancel;
            }
        });
        Object.defineProperty(exports, "select", {
            enumerable: true,
            get: function get() {
                return _io.select;
            }
        });
        Object.defineProperty(exports, "actionChannel", {
            enumerable: true,
            get: function get() {
                return _io.actionChannel;
            }
        });
        Object.defineProperty(exports, "cancelled", {
            enumerable: true,
            get: function get() {
                return _io.cancelled;
            }
        });
        Object.defineProperty(exports, "flush", {
            enumerable: true,
            get: function get() {
                return _io.flush;
            }
        });
        Object.defineProperty(exports, "getContext", {
            enumerable: true,
            get: function get() {
                return _io.getContext;
            }
        });
        Object.defineProperty(exports, "setContext", {
            enumerable: true,
            get: function get() {
                return _io.setContext;
            }
        });
        Object.defineProperty(exports, "takeEvery", {
            enumerable: true,
            get: function get() {
                return _io.takeEvery;
            }
        });
        Object.defineProperty(exports, "takeLatest", {
            enumerable: true,
            get: function get() {
                return _io.takeLatest;
            }
        });
        Object.defineProperty(exports, "throttle", {
            enumerable: true,
            get: function get() {
                return _io.throttle;
            }
        });
    },
    754: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _utils = __webpack_require__(741);
        Object.defineProperty(exports, "TASK", {
            enumerable: true,
            get: function get() {
                return _utils.TASK;
            }
        });
        Object.defineProperty(exports, "SAGA_ACTION", {
            enumerable: true,
            get: function get() {
                return _utils.SAGA_ACTION;
            }
        });
        Object.defineProperty(exports, "noop", {
            enumerable: true,
            get: function get() {
                return _utils.noop;
            }
        });
        Object.defineProperty(exports, "is", {
            enumerable: true,
            get: function get() {
                return _utils.is;
            }
        });
        Object.defineProperty(exports, "deferred", {
            enumerable: true,
            get: function get() {
                return _utils.deferred;
            }
        });
        Object.defineProperty(exports, "arrayOfDeffered", {
            enumerable: true,
            get: function get() {
                return _utils.arrayOfDeffered;
            }
        });
        Object.defineProperty(exports, "createMockTask", {
            enumerable: true,
            get: function get() {
                return _utils.createMockTask;
            }
        });
        Object.defineProperty(exports, "cloneableGenerator", {
            enumerable: true,
            get: function get() {
                return _utils.cloneableGenerator;
            }
        });
        var _io = __webpack_require__(744);
        Object.defineProperty(exports, "asEffect", {
            enumerable: true,
            get: function get() {
                return _io.asEffect;
            }
        });
        var _proc = __webpack_require__(742);
        Object.defineProperty(exports, "CHANNEL_END", {
            enumerable: true,
            get: function get() {
                return _proc.CHANNEL_END;
            }
        });
    },
    755: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
        exports.reducer = reducer;
        var _const = __webpack_require__(737);
        var c = _interopRequireWildcard(_const);
        var _pull = __webpack_require__(756);
        var _pull2 = _interopRequireDefault(_pull);
        var _utils = __webpack_require__(736);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            } else {
                return Array.from(arr);
            }
        }
        var initialState = {
            selectAll: true,
            fetching: false,
            error: null,
            userId: null,
            groupedProjects: [],
            isRestricted: null,
            originalIsRestricted: null,
            originalGroupedProjects: null
        };
        var updateProjectAccess = function updateProjectAccess(projectId, groupedProjects) {
            groupedProjects.map(function(group) {
                group.projects.map(function(project) {
                    project.id === projectId ? project.access = !project.access : null;
                });
            });
            return groupedProjects;
        };
        var updateAllProjectsAccess = function updateAllProjectsAccess(access, groupedProjects) {
            groupedProjects.map(function(group) {
                group.projects.map(function(project) {
                    project.access = access;
                });
            });
            return groupedProjects;
        };
        function reducer() {
            var _reducerActions;
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
            var action = arguments[1];
            var reducerActions = (_reducerActions = {}, _defineProperty(_reducerActions, c.SET_STORE, function(state, action) {
                var data = action.data;
                return _extends({}, state, data);
            }), _defineProperty(_reducerActions, c.API_GET_INIT, function(state, action) {
                return _extends({}, state, {
                    fetching: true,
                    error: null
                });
            }), _defineProperty(_reducerActions, c.API_GET_SUCCESS, function(state, action) {
                var _action$data = action.data, isRestricted = _action$data.user_projects.is_restricted, groupedProjects = _action$data.organisation_groups;
                return _extends({}, state, {
                    fetching: false,
                    groupedProjects: groupedProjects,
                    isRestricted: isRestricted
                });
            }), _defineProperty(_reducerActions, c.API_GET_FAILURE, function(state, action) {
                return _extends({}, state, {
                    fetching: false,
                    all_projects: [],
                    groupedProjects: [],
                    error: action.error
                });
            }), _defineProperty(_reducerActions, c.API_PUT_INIT, function(state, action) {
                return _extends({}, state, {
                    fetching: true,
                    error: null
                });
            }), _defineProperty(_reducerActions, c.API_PUT_SUCCESS, function(state, action) {
                var groupedProjects = action.data.grouped_projects;
                return _extends({}, state, {
                    fetching: false,
                    isRestricted: user_projects.isRestricted,
                    originalIsRestricted: null,
                    groupedProjects: groupedProjects,
                    originalGroupedProjects: null
                });
            }), _defineProperty(_reducerActions, c.API_PUT_FAILURE, function(state, action) {
                var newState = _extends({}, state, {
                    fetching: false,
                    originalIsRestricted: null,
                    originalGroupedProjects: null,
                    error: action.error
                });
                if (state.originalIsRestricted !== null) {
                    newState.isRestricted = state.originalIsRestricted;
                }
                if (state.originalGroupedProjects !== null) {
                    newState.groupedProjects = state.originalGroupedProjects;
                }
                return newState;
            }), _defineProperty(_reducerActions, c.UPDATE_PROJECT_SELECTION, function(state, action) {
                var projectId = action.data.projectId;
                var originalGroupedProjects = state.groupedProjects && [].concat(_toConsumableArray(state.groupedProjects));
                var groupedProjects = state.groupedProjects && [].concat(_toConsumableArray(state.groupedProjects));
                groupedProjects = updateProjectAccess(projectId, groupedProjects);
                return _extends({}, state, {
                    originalGroupedProjects: originalGroupedProjects,
                    groupedProjects: groupedProjects
                });
            }), _defineProperty(_reducerActions, c.UPDATE_IS_RESTRICTED, function(state, action) {
                var isRestricted = action.data.isRestricted;
                return _extends({}, state, {
                    isRestricted: isRestricted,
                    originalIsRestricted: state.isRestricted
                });
            }), _defineProperty(_reducerActions, c.UPDATE_SELECT_ALL_PROJECTS, function(state, action) {
                var originalGroupedProjects = state.groupedProjects && [].concat(_toConsumableArray(state.groupedProjects));
                var groupedProjects = state.groupedProjects && [].concat(_toConsumableArray(state.groupedProjects)), _state = _extends({}, state), selectAll = _state.selectAll;
                groupedProjects = updateAllProjectsAccess(selectAll, groupedProjects);
                selectAll = !selectAll;
                return _extends({}, state, {
                    selectAll: selectAll,
                    originalGroupedProjects: originalGroupedProjects,
                    groupedProjects: groupedProjects
                });
            }), _reducerActions);
            if (reducerActions.hasOwnProperty(action.type)) {
                return reducerActions[action.type](state, action);
            } else {
                return state;
            }
        }
    },
    756: function(module, exports, __webpack_require__) {
        var baseRest = __webpack_require__(757), pullAll = __webpack_require__(764);
        var pull = baseRest(pullAll);
        module.exports = pull;
    },
    757: function(module, exports, __webpack_require__) {
        var identity = __webpack_require__(439), overRest = __webpack_require__(758), setToString = __webpack_require__(760);
        function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + "");
        }
        module.exports = baseRest;
    },
    758: function(module, exports, __webpack_require__) {
        var apply = __webpack_require__(759);
        var nativeMax = Math.max;
        function overRest(func, start, transform) {
            start = nativeMax(start === undefined ? func.length - 1 : start, 0);
            return function() {
                var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
                while (++index < length) {
                    array[index] = args[start + index];
                }
                index = -1;
                var otherArgs = Array(start + 1);
                while (++index < start) {
                    otherArgs[index] = args[index];
                }
                otherArgs[start] = transform(array);
                return apply(func, this, otherArgs);
            };
        }
        module.exports = overRest;
    },
    759: function(module, exports) {
        function apply(func, thisArg, args) {
            switch (args.length) {
              case 0:
                return func.call(thisArg);

              case 1:
                return func.call(thisArg, args[0]);

              case 2:
                return func.call(thisArg, args[0], args[1]);

              case 3:
                return func.call(thisArg, args[0], args[1], args[2]);
            }
            return func.apply(thisArg, args);
        }
        module.exports = apply;
    },
    760: function(module, exports, __webpack_require__) {
        var baseSetToString = __webpack_require__(761), shortOut = __webpack_require__(763);
        var setToString = shortOut(baseSetToString);
        module.exports = setToString;
    },
    761: function(module, exports, __webpack_require__) {
        var constant = __webpack_require__(762), defineProperty = __webpack_require__(328), identity = __webpack_require__(439);
        var baseSetToString = !defineProperty ? identity : function(func, string) {
            return defineProperty(func, "toString", {
                configurable: true,
                enumerable: false,
                value: constant(string),
                writable: true
            });
        };
        module.exports = baseSetToString;
    },
    762: function(module, exports) {
        function constant(value) {
            return function() {
                return value;
            };
        }
        module.exports = constant;
    },
    763: function(module, exports) {
        var HOT_COUNT = 800, HOT_SPAN = 16;
        var nativeNow = Date.now;
        function shortOut(func) {
            var count = 0, lastCalled = 0;
            return function() {
                var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
                lastCalled = stamp;
                if (remaining > 0) {
                    if (++count >= HOT_COUNT) {
                        return arguments[0];
                    }
                } else {
                    count = 0;
                }
                return func.apply(undefined, arguments);
            };
        }
        module.exports = shortOut;
    },
    764: function(module, exports, __webpack_require__) {
        var basePullAll = __webpack_require__(765);
        function pullAll(array, values) {
            return array && array.length && values && values.length ? basePullAll(array, values) : array;
        }
        module.exports = pullAll;
    },
    765: function(module, exports, __webpack_require__) {
        var arrayMap = __webpack_require__(434), baseIndexOf = __webpack_require__(766), baseIndexOfWith = __webpack_require__(770), baseUnary = __webpack_require__(356), copyArray = __webpack_require__(771);
        var arrayProto = Array.prototype;
        var splice = arrayProto.splice;
        function basePullAll(array, values, iteratee, comparator) {
            var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
            if (array === values) {
                values = copyArray(values);
            }
            if (iteratee) {
                seen = arrayMap(array, baseUnary(iteratee));
            }
            while (++index < length) {
                var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
                while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
                    if (seen !== array) {
                        splice.call(seen, fromIndex, 1);
                    }
                    splice.call(array, fromIndex, 1);
                }
            }
            return array;
        }
        module.exports = basePullAll;
    },
    766: function(module, exports, __webpack_require__) {
        var baseFindIndex = __webpack_require__(767), baseIsNaN = __webpack_require__(768), strictIndexOf = __webpack_require__(769);
        function baseIndexOf(array, value, fromIndex) {
            return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        module.exports = baseIndexOf;
    },
    767: function(module, exports) {
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
            var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
            while (fromRight ? index-- : ++index < length) {
                if (predicate(array[index], index, array)) {
                    return index;
                }
            }
            return -1;
        }
        module.exports = baseFindIndex;
    },
    768: function(module, exports) {
        function baseIsNaN(value) {
            return value !== value;
        }
        module.exports = baseIsNaN;
    },
    769: function(module, exports) {
        function strictIndexOf(array, value, fromIndex) {
            var index = fromIndex - 1, length = array.length;
            while (++index < length) {
                if (array[index] === value) {
                    return index;
                }
            }
            return -1;
        }
        module.exports = strictIndexOf;
    },
    770: function(module, exports) {
        function baseIndexOfWith(array, value, fromIndex, comparator) {
            var index = fromIndex - 1, length = array.length;
            while (++index < length) {
                if (comparator(array[index], value)) {
                    return index;
                }
            }
            return -1;
        }
        module.exports = baseIndexOfWith;
    },
    771: function(module, exports) {
        function copyArray(source, array) {
            var index = -1, length = source.length;
            array || (array = Array(length));
            while (++index < length) {
                array[index] = source[index];
            }
            return array;
        }
        module.exports = copyArray;
    },
    772: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getIsRestricted = exports.getUserId = undefined;
        exports.fetchData = fetchData;
        exports.putData = putData;
        exports.getSaga = getSaga;
        exports.putSaga = putSaga;
        exports.watcherSaga = watcherSaga;
        __webpack_require__(773);
        var _effects = __webpack_require__(753);
        var _axios = __webpack_require__(774);
        var _axios2 = _interopRequireDefault(_axios);
        var _const = __webpack_require__(737);
        var c = _interopRequireWildcard(_const);
        var _utils = __webpack_require__(324);
        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var _marked = regeneratorRuntime.mark(getSaga), _marked2 = regeneratorRuntime.mark(putSaga), _marked3 = regeneratorRuntime.mark(watcherSaga);
        function callAxios(config) {
            return (0, _axios2.default)(config).then(function(response) {
                return {
                    response: response
                };
            }).catch(function(error) {
                return {
                    error: error
                };
            });
        }
        function fetchData(userId) {
            var config = {
                method: "get",
                url: "/rest/v1/user_projects_access/" + userId + "/"
            };
            return callAxios(config);
        }
        function putData(userId, isRestricted, projectsWithAccess) {
            var config = {
                method: "patch",
                headers: {
                    "X-CSRFToken": (0, _utils.getCookie)("csrftoken")
                },
                url: "/rest/v1/user_projects_access/" + userId + "/",
                data: {
                    user_projects: {
                        is_restricted: isRestricted,
                        projects: projectsWithAccess
                    }
                }
            };
            return callAxios(config);
        }
        function getSaga(action) {
            var userId, _ref, response, error;
            return regeneratorRuntime.wrap(function getSaga$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        userId = action.data.userId;
                        _context.next = 3;
                        return (0, _effects.call)(fetchData, userId);

                      case 3:
                        _ref = _context.sent;
                        response = _ref.response;
                        error = _ref.error;
                        if (!response) {
                            _context.next = 11;
                            break;
                        }
                        _context.next = 9;
                        return (0, _effects.put)({
                            type: c.API_GET_SUCCESS,
                            data: response.data
                        });

                      case 9:
                        _context.next = 13;
                        break;

                      case 11:
                        _context.next = 13;
                        return (0, _effects.put)({
                            type: c.API_GET_FAILURE,
                            error: error
                        });

                      case 13:
                      case "end":
                        return _context.stop();
                    }
                }
            }, _marked, this);
        }
        var filterProjects = function filterProjects(state) {
            return state.groupedProjects.reduce(function(acc, group) {
                return acc.concat(group.projects.filter(function(project) {
                    return project.access;
                }).map(function(project) {
                    return project.id;
                }));
            }, []);
        };
        var getUserId = exports.getUserId = function getUserId(state) {
            return state.userId;
        };
        var getIsRestricted = exports.getIsRestricted = function getIsRestricted(state) {
            return state.isRestricted;
        };
        function putSaga(action) {
            var userId, isRestricted, projectsWithAccess, _ref2, response, error;
            return regeneratorRuntime.wrap(function putSaga$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _effects.put)({
                            type: c.API_PUT_INIT
                        });

                      case 2:
                        _context2.next = 4;
                        return (0, _effects.select)(getUserId);

                      case 4:
                        userId = _context2.sent;
                        _context2.next = 7;
                        return (0, _effects.select)(getIsRestricted);

                      case 7:
                        isRestricted = _context2.sent;
                        _context2.next = 10;
                        return (0, _effects.select)(filterProjects);

                      case 10:
                        projectsWithAccess = _context2.sent;
                        _context2.next = 13;
                        return (0, _effects.call)(putData, userId, isRestricted, projectsWithAccess);

                      case 13:
                        _ref2 = _context2.sent;
                        response = _ref2.response;
                        error = _ref2.error;
                        if (!response) {
                            _context2.next = 21;
                            break;
                        }
                        _context2.next = 19;
                        return (0, _effects.put)({
                            type: c.API_PUT_SUCCESS,
                            data: response.data
                        });

                      case 19:
                        _context2.next = 23;
                        break;

                      case 21:
                        _context2.next = 23;
                        return (0, _effects.put)({
                            type: c.API_PUT_FAILURE,
                            error: error
                        });

                      case 23:
                      case "end":
                        return _context2.stop();
                    }
                }
            }, _marked2, this);
        }
        function watcherSaga() {
            return regeneratorRuntime.wrap(function watcherSaga$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _effects.takeLatest)(c.API_GET_INIT, getSaga);

                      case 2:
                        _context3.next = 4;
                        return (0, _effects.takeLatest)(c.UPDATE_PROJECT_SELECTION, putSaga);

                      case 4:
                        _context3.next = 6;
                        return (0, _effects.takeLatest)(c.UPDATE_SELECT_ALL_PROJECTS, putSaga);

                      case 6:
                        _context3.next = 8;
                        return (0, _effects.takeLatest)(c.UPDATE_IS_RESTRICTED, putSaga);

                      case 8:
                      case "end":
                        return _context3.stop();
                    }
                }
            }, _marked3, this);
        }
    },
    773: function(module, exports) {
        !function(global) {
            "use strict";
            var Op = Object.prototype;
            var hasOwn = Op.hasOwnProperty;
            var undefined;
            var $Symbol = typeof Symbol === "function" ? Symbol : {};
            var iteratorSymbol = $Symbol.iterator || "@@iterator";
            var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
            var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
            var inModule = typeof module === "object";
            var runtime = global.regeneratorRuntime;
            if (runtime) {
                if (inModule) {
                    module.exports = runtime;
                }
                return;
            }
            runtime = global.regeneratorRuntime = inModule ? module.exports : {};
            function wrap(innerFn, outerFn, self, tryLocsList) {
                var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                var generator = Object.create(protoGenerator.prototype);
                var context = new Context(tryLocsList || []);
                generator._invoke = makeInvokeMethod(innerFn, self, context);
                return generator;
            }
            runtime.wrap = wrap;
            function tryCatch(fn, obj, arg) {
                try {
                    return {
                        type: "normal",
                        arg: fn.call(obj, arg)
                    };
                } catch (err) {
                    return {
                        type: "throw",
                        arg: err
                    };
                }
            }
            var GenStateSuspendedStart = "suspendedStart";
            var GenStateSuspendedYield = "suspendedYield";
            var GenStateExecuting = "executing";
            var GenStateCompleted = "completed";
            var ContinueSentinel = {};
            function Generator() {}
            function GeneratorFunction() {}
            function GeneratorFunctionPrototype() {}
            var IteratorPrototype = {};
            IteratorPrototype[iteratorSymbol] = function() {
                return this;
            };
            var getProto = Object.getPrototypeOf;
            var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
            if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
                IteratorPrototype = NativeIteratorPrototype;
            }
            var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
            GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
            GeneratorFunctionPrototype.constructor = GeneratorFunction;
            GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
            function defineIteratorMethods(prototype) {
                [ "next", "throw", "return" ].forEach(function(method) {
                    prototype[method] = function(arg) {
                        return this._invoke(method, arg);
                    };
                });
            }
            runtime.isGeneratorFunction = function(genFun) {
                var ctor = typeof genFun === "function" && genFun.constructor;
                return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
            };
            runtime.mark = function(genFun) {
                if (Object.setPrototypeOf) {
                    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                } else {
                    genFun.__proto__ = GeneratorFunctionPrototype;
                    if (!(toStringTagSymbol in genFun)) {
                        genFun[toStringTagSymbol] = "GeneratorFunction";
                    }
                }
                genFun.prototype = Object.create(Gp);
                return genFun;
            };
            runtime.awrap = function(arg) {
                return {
                    __await: arg
                };
            };
            function AsyncIterator(generator) {
                function invoke(method, arg, resolve, reject) {
                    var record = tryCatch(generator[method], generator, arg);
                    if (record.type === "throw") {
                        reject(record.arg);
                    } else {
                        var result = record.arg;
                        var value = result.value;
                        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
                            return Promise.resolve(value.__await).then(function(value) {
                                invoke("next", value, resolve, reject);
                            }, function(err) {
                                invoke("throw", err, resolve, reject);
                            });
                        }
                        return Promise.resolve(value).then(function(unwrapped) {
                            result.value = unwrapped;
                            resolve(result);
                        }, reject);
                    }
                }
                var previousPromise;
                function enqueue(method, arg) {
                    function callInvokeWithMethodAndArg() {
                        return new Promise(function(resolve, reject) {
                            invoke(method, arg, resolve, reject);
                        });
                    }
                    return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                }
                this._invoke = enqueue;
            }
            defineIteratorMethods(AsyncIterator.prototype);
            AsyncIterator.prototype[asyncIteratorSymbol] = function() {
                return this;
            };
            runtime.AsyncIterator = AsyncIterator;
            runtime.async = function(innerFn, outerFn, self, tryLocsList) {
                var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
                return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
                    return result.done ? result.value : iter.next();
                });
            };
            function makeInvokeMethod(innerFn, self, context) {
                var state = GenStateSuspendedStart;
                return function invoke(method, arg) {
                    if (state === GenStateExecuting) {
                        throw new Error("Generator is already running");
                    }
                    if (state === GenStateCompleted) {
                        if (method === "throw") {
                            throw arg;
                        }
                        return doneResult();
                    }
                    context.method = method;
                    context.arg = arg;
                    while (true) {
                        var delegate = context.delegate;
                        if (delegate) {
                            var delegateResult = maybeInvokeDelegate(delegate, context);
                            if (delegateResult) {
                                if (delegateResult === ContinueSentinel) continue;
                                return delegateResult;
                            }
                        }
                        if (context.method === "next") {
                            context.sent = context._sent = context.arg;
                        } else if (context.method === "throw") {
                            if (state === GenStateSuspendedStart) {
                                state = GenStateCompleted;
                                throw context.arg;
                            }
                            context.dispatchException(context.arg);
                        } else if (context.method === "return") {
                            context.abrupt("return", context.arg);
                        }
                        state = GenStateExecuting;
                        var record = tryCatch(innerFn, self, context);
                        if (record.type === "normal") {
                            state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                            if (record.arg === ContinueSentinel) {
                                continue;
                            }
                            return {
                                value: record.arg,
                                done: context.done
                            };
                        } else if (record.type === "throw") {
                            state = GenStateCompleted;
                            context.method = "throw";
                            context.arg = record.arg;
                        }
                    }
                };
            }
            function maybeInvokeDelegate(delegate, context) {
                var method = delegate.iterator[context.method];
                if (method === undefined) {
                    context.delegate = null;
                    if (context.method === "throw") {
                        if (delegate.iterator.return) {
                            context.method = "return";
                            context.arg = undefined;
                            maybeInvokeDelegate(delegate, context);
                            if (context.method === "throw") {
                                return ContinueSentinel;
                            }
                        }
                        context.method = "throw";
                        context.arg = new TypeError("The iterator does not provide a 'throw' method");
                    }
                    return ContinueSentinel;
                }
                var record = tryCatch(method, delegate.iterator, context.arg);
                if (record.type === "throw") {
                    context.method = "throw";
                    context.arg = record.arg;
                    context.delegate = null;
                    return ContinueSentinel;
                }
                var info = record.arg;
                if (!info) {
                    context.method = "throw";
                    context.arg = new TypeError("iterator result is not an object");
                    context.delegate = null;
                    return ContinueSentinel;
                }
                if (info.done) {
                    context[delegate.resultName] = info.value;
                    context.next = delegate.nextLoc;
                    if (context.method !== "return") {
                        context.method = "next";
                        context.arg = undefined;
                    }
                } else {
                    return info;
                }
                context.delegate = null;
                return ContinueSentinel;
            }
            defineIteratorMethods(Gp);
            Gp[toStringTagSymbol] = "Generator";
            Gp[iteratorSymbol] = function() {
                return this;
            };
            Gp.toString = function() {
                return "[object Generator]";
            };
            function pushTryEntry(locs) {
                var entry = {
                    tryLoc: locs[0]
                };
                if (1 in locs) {
                    entry.catchLoc = locs[1];
                }
                if (2 in locs) {
                    entry.finallyLoc = locs[2];
                    entry.afterLoc = locs[3];
                }
                this.tryEntries.push(entry);
            }
            function resetTryEntry(entry) {
                var record = entry.completion || {};
                record.type = "normal";
                delete record.arg;
                entry.completion = record;
            }
            function Context(tryLocsList) {
                this.tryEntries = [ {
                    tryLoc: "root"
                } ];
                tryLocsList.forEach(pushTryEntry, this);
                this.reset(true);
            }
            runtime.keys = function(object) {
                var keys = [];
                for (var key in object) {
                    keys.push(key);
                }
                keys.reverse();
                return function next() {
                    while (keys.length) {
                        var key = keys.pop();
                        if (key in object) {
                            next.value = key;
                            next.done = false;
                            return next;
                        }
                    }
                    next.done = true;
                    return next;
                };
            };
            function values(iterable) {
                if (iterable) {
                    var iteratorMethod = iterable[iteratorSymbol];
                    if (iteratorMethod) {
                        return iteratorMethod.call(iterable);
                    }
                    if (typeof iterable.next === "function") {
                        return iterable;
                    }
                    if (!isNaN(iterable.length)) {
                        var i = -1, next = function next() {
                            while (++i < iterable.length) {
                                if (hasOwn.call(iterable, i)) {
                                    next.value = iterable[i];
                                    next.done = false;
                                    return next;
                                }
                            }
                            next.value = undefined;
                            next.done = true;
                            return next;
                        };
                        return next.next = next;
                    }
                }
                return {
                    next: doneResult
                };
            }
            runtime.values = values;
            function doneResult() {
                return {
                    value: undefined,
                    done: true
                };
            }
            Context.prototype = {
                constructor: Context,
                reset: function(skipTempReset) {
                    this.prev = 0;
                    this.next = 0;
                    this.sent = this._sent = undefined;
                    this.done = false;
                    this.delegate = null;
                    this.method = "next";
                    this.arg = undefined;
                    this.tryEntries.forEach(resetTryEntry);
                    if (!skipTempReset) {
                        for (var name in this) {
                            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                                this[name] = undefined;
                            }
                        }
                    }
                },
                stop: function() {
                    this.done = true;
                    var rootEntry = this.tryEntries[0];
                    var rootRecord = rootEntry.completion;
                    if (rootRecord.type === "throw") {
                        throw rootRecord.arg;
                    }
                    return this.rval;
                },
                dispatchException: function(exception) {
                    if (this.done) {
                        throw exception;
                    }
                    var context = this;
                    function handle(loc, caught) {
                        record.type = "throw";
                        record.arg = exception;
                        context.next = loc;
                        if (caught) {
                            context.method = "next";
                            context.arg = undefined;
                        }
                        return !!caught;
                    }
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        var record = entry.completion;
                        if (entry.tryLoc === "root") {
                            return handle("end");
                        }
                        if (entry.tryLoc <= this.prev) {
                            var hasCatch = hasOwn.call(entry, "catchLoc");
                            var hasFinally = hasOwn.call(entry, "finallyLoc");
                            if (hasCatch && hasFinally) {
                                if (this.prev < entry.catchLoc) {
                                    return handle(entry.catchLoc, true);
                                } else if (this.prev < entry.finallyLoc) {
                                    return handle(entry.finallyLoc);
                                }
                            } else if (hasCatch) {
                                if (this.prev < entry.catchLoc) {
                                    return handle(entry.catchLoc, true);
                                }
                            } else if (hasFinally) {
                                if (this.prev < entry.finallyLoc) {
                                    return handle(entry.finallyLoc);
                                }
                            } else {
                                throw new Error("try statement without catch or finally");
                            }
                        }
                    }
                },
                abrupt: function(type, arg) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                            var finallyEntry = entry;
                            break;
                        }
                    }
                    if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                        finallyEntry = null;
                    }
                    var record = finallyEntry ? finallyEntry.completion : {};
                    record.type = type;
                    record.arg = arg;
                    if (finallyEntry) {
                        this.method = "next";
                        this.next = finallyEntry.finallyLoc;
                        return ContinueSentinel;
                    }
                    return this.complete(record);
                },
                complete: function(record, afterLoc) {
                    if (record.type === "throw") {
                        throw record.arg;
                    }
                    if (record.type === "break" || record.type === "continue") {
                        this.next = record.arg;
                    } else if (record.type === "return") {
                        this.rval = this.arg = record.arg;
                        this.method = "return";
                        this.next = "end";
                    } else if (record.type === "normal" && afterLoc) {
                        this.next = afterLoc;
                    }
                    return ContinueSentinel;
                },
                finish: function(finallyLoc) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.finallyLoc === finallyLoc) {
                            this.complete(entry.completion, entry.afterLoc);
                            resetTryEntry(entry);
                            return ContinueSentinel;
                        }
                    }
                },
                catch: function(tryLoc) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.tryLoc === tryLoc) {
                            var record = entry.completion;
                            if (record.type === "throw") {
                                var thrown = record.arg;
                                resetTryEntry(entry);
                            }
                            return thrown;
                        }
                    }
                    throw new Error("illegal catch attempt");
                },
                delegateYield: function(iterable, resultName, nextLoc) {
                    this.delegate = {
                        iterator: values(iterable),
                        resultName: resultName,
                        nextLoc: nextLoc
                    };
                    if (this.method === "next") {
                        this.arg = undefined;
                    }
                    return ContinueSentinel;
                }
            };
        }(function() {
            return this;
        }() || Function("return this")());
    },
    774: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(775);
    },
    775: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        var bind = __webpack_require__(777);
        var Axios = __webpack_require__(779);
        var defaults = __webpack_require__(780);
        function createInstance(defaultConfig) {
            var context = new Axios(defaultConfig);
            var instance = bind(Axios.prototype.request, context);
            utils.extend(instance, Axios.prototype, context);
            utils.extend(instance, context);
            return instance;
        }
        var axios = createInstance(defaults);
        axios.Axios = Axios;
        axios.create = function create(instanceConfig) {
            return createInstance(utils.merge(defaults, instanceConfig));
        };
        axios.Cancel = __webpack_require__(797);
        axios.CancelToken = __webpack_require__(798);
        axios.isCancel = __webpack_require__(794);
        axios.all = function all(promises) {
            return Promise.all(promises);
        };
        axios.spread = __webpack_require__(799);
        module.exports = axios;
        module.exports.default = axios;
    },
    776: function(module, exports, __webpack_require__) {
        "use strict";
        var bind = __webpack_require__(777);
        var isBuffer = __webpack_require__(778);
        var toString = Object.prototype.toString;
        function isArray(val) {
            return toString.call(val) === "[object Array]";
        }
        function isArrayBuffer(val) {
            return toString.call(val) === "[object ArrayBuffer]";
        }
        function isFormData(val) {
            return typeof FormData !== "undefined" && val instanceof FormData;
        }
        function isArrayBufferView(val) {
            var result;
            if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
                result = ArrayBuffer.isView(val);
            } else {
                result = val && val.buffer && val.buffer instanceof ArrayBuffer;
            }
            return result;
        }
        function isString(val) {
            return typeof val === "string";
        }
        function isNumber(val) {
            return typeof val === "number";
        }
        function isUndefined(val) {
            return typeof val === "undefined";
        }
        function isObject(val) {
            return val !== null && typeof val === "object";
        }
        function isDate(val) {
            return toString.call(val) === "[object Date]";
        }
        function isFile(val) {
            return toString.call(val) === "[object File]";
        }
        function isBlob(val) {
            return toString.call(val) === "[object Blob]";
        }
        function isFunction(val) {
            return toString.call(val) === "[object Function]";
        }
        function isStream(val) {
            return isObject(val) && isFunction(val.pipe);
        }
        function isURLSearchParams(val) {
            return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
        }
        function trim(str) {
            return str.replace(/^\s*/, "").replace(/\s*$/, "");
        }
        function isStandardBrowserEnv() {
            if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
                return false;
            }
            return typeof window !== "undefined" && typeof document !== "undefined";
        }
        function forEach(obj, fn) {
            if (obj === null || typeof obj === "undefined") {
                return;
            }
            if (typeof obj !== "object") {
                obj = [ obj ];
            }
            if (isArray(obj)) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    fn.call(null, obj[i], i, obj);
                }
            } else {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        fn.call(null, obj[key], key, obj);
                    }
                }
            }
        }
        function merge() {
            var result = {};
            function assignValue(val, key) {
                if (typeof result[key] === "object" && typeof val === "object") {
                    result[key] = merge(result[key], val);
                } else {
                    result[key] = val;
                }
            }
            for (var i = 0, l = arguments.length; i < l; i++) {
                forEach(arguments[i], assignValue);
            }
            return result;
        }
        function extend(a, b, thisArg) {
            forEach(b, function assignValue(val, key) {
                if (thisArg && typeof val === "function") {
                    a[key] = bind(val, thisArg);
                } else {
                    a[key] = val;
                }
            });
            return a;
        }
        module.exports = {
            isArray: isArray,
            isArrayBuffer: isArrayBuffer,
            isBuffer: isBuffer,
            isFormData: isFormData,
            isArrayBufferView: isArrayBufferView,
            isString: isString,
            isNumber: isNumber,
            isObject: isObject,
            isUndefined: isUndefined,
            isDate: isDate,
            isFile: isFile,
            isBlob: isBlob,
            isFunction: isFunction,
            isStream: isStream,
            isURLSearchParams: isURLSearchParams,
            isStandardBrowserEnv: isStandardBrowserEnv,
            forEach: forEach,
            merge: merge,
            extend: extend,
            trim: trim
        };
    },
    777: function(module, exports) {
        "use strict";
        module.exports = function bind(fn, thisArg) {
            return function wrap() {
                var args = new Array(arguments.length);
                for (var i = 0; i < args.length; i++) {
                    args[i] = arguments[i];
                }
                return fn.apply(thisArg, args);
            };
        };
    },
    778: function(module, exports) {
        module.exports = function(obj) {
            return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
        };
        function isBuffer(obj) {
            return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
        }
        function isSlowBuffer(obj) {
            return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
        }
    },
    779: function(module, exports, __webpack_require__) {
        "use strict";
        var defaults = __webpack_require__(780);
        var utils = __webpack_require__(776);
        var InterceptorManager = __webpack_require__(791);
        var dispatchRequest = __webpack_require__(792);
        function Axios(instanceConfig) {
            this.defaults = instanceConfig;
            this.interceptors = {
                request: new InterceptorManager(),
                response: new InterceptorManager()
            };
        }
        Axios.prototype.request = function request(config) {
            if (typeof config === "string") {
                config = utils.merge({
                    url: arguments[0]
                }, arguments[1]);
            }
            config = utils.merge(defaults, {
                method: "get"
            }, this.defaults, config);
            config.method = config.method.toLowerCase();
            var chain = [ dispatchRequest, undefined ];
            var promise = Promise.resolve(config);
            this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        };
        utils.forEach([ "delete", "get", "head", "options" ], function forEachMethodNoData(method) {
            Axios.prototype[method] = function(url, config) {
                return this.request(utils.merge(config || {}, {
                    method: method,
                    url: url
                }));
            };
        });
        utils.forEach([ "post", "put", "patch" ], function forEachMethodWithData(method) {
            Axios.prototype[method] = function(url, data, config) {
                return this.request(utils.merge(config || {}, {
                    method: method,
                    url: url,
                    data: data
                }));
            };
        });
        module.exports = Axios;
    },
    780: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(776);
            var normalizeHeaderName = __webpack_require__(781);
            var DEFAULT_CONTENT_TYPE = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            function setContentTypeIfUnset(headers, value) {
                if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
                    headers["Content-Type"] = value;
                }
            }
            function getDefaultAdapter() {
                var adapter;
                if (typeof XMLHttpRequest !== "undefined") {
                    adapter = __webpack_require__(782);
                } else if (typeof process !== "undefined") {
                    adapter = __webpack_require__(782);
                }
                return adapter;
            }
            var defaults = {
                adapter: getDefaultAdapter(),
                transformRequest: [ function transformRequest(data, headers) {
                    normalizeHeaderName(headers, "Content-Type");
                    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
                        return data;
                    }
                    if (utils.isArrayBufferView(data)) {
                        return data.buffer;
                    }
                    if (utils.isURLSearchParams(data)) {
                        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
                        return data.toString();
                    }
                    if (utils.isObject(data)) {
                        setContentTypeIfUnset(headers, "application/json;charset=utf-8");
                        return JSON.stringify(data);
                    }
                    return data;
                } ],
                transformResponse: [ function transformResponse(data) {
                    if (typeof data === "string") {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {}
                    }
                    return data;
                } ],
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                validateStatus: function validateStatus(status) {
                    return status >= 200 && status < 300;
                }
            };
            defaults.headers = {
                common: {
                    Accept: "application/json, text/plain, */*"
                }
            };
            utils.forEach([ "delete", "get", "head" ], function forEachMethodNoData(method) {
                defaults.headers[method] = {};
            });
            utils.forEach([ "post", "put", "patch" ], function forEachMethodWithData(method) {
                defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
            });
            module.exports = defaults;
        }).call(exports, __webpack_require__(3));
    },
    781: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        module.exports = function normalizeHeaderName(headers, normalizedName) {
            utils.forEach(headers, function processHeader(value, name) {
                if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                    headers[normalizedName] = value;
                    delete headers[name];
                }
            });
        };
    },
    782: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(776);
            var settle = __webpack_require__(783);
            var buildURL = __webpack_require__(786);
            var parseHeaders = __webpack_require__(787);
            var isURLSameOrigin = __webpack_require__(788);
            var createError = __webpack_require__(784);
            var btoa = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || __webpack_require__(789);
            module.exports = function xhrAdapter(config) {
                return new Promise(function dispatchXhrRequest(resolve, reject) {
                    var requestData = config.data;
                    var requestHeaders = config.headers;
                    if (utils.isFormData(requestData)) {
                        delete requestHeaders["Content-Type"];
                    }
                    var request = new XMLHttpRequest();
                    var loadEvent = "onreadystatechange";
                    var xDomain = false;
                    if (process.env.NODE_ENV !== "test" && typeof window !== "undefined" && window.XDomainRequest && !("withCredentials" in request) && !isURLSameOrigin(config.url)) {
                        request = new window.XDomainRequest();
                        loadEvent = "onload";
                        xDomain = true;
                        request.onprogress = function handleProgress() {};
                        request.ontimeout = function handleTimeout() {};
                    }
                    if (config.auth) {
                        var username = config.auth.username || "";
                        var password = config.auth.password || "";
                        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
                    }
                    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
                    request.timeout = config.timeout;
                    request[loadEvent] = function handleLoad() {
                        if (!request || request.readyState !== 4 && !xDomain) {
                            return;
                        }
                        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                            return;
                        }
                        var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                        var responseData = !config.responseType || config.responseType === "text" ? request.responseText : request.response;
                        var response = {
                            data: responseData,
                            status: request.status === 1223 ? 204 : request.status,
                            statusText: request.status === 1223 ? "No Content" : request.statusText,
                            headers: responseHeaders,
                            config: config,
                            request: request
                        };
                        settle(resolve, reject, response);
                        request = null;
                    };
                    request.onerror = function handleError() {
                        reject(createError("Network Error", config, null, request));
                        request = null;
                    };
                    request.ontimeout = function handleTimeout() {
                        reject(createError("timeout of " + config.timeout + "ms exceeded", config, "ECONNABORTED", request));
                        request = null;
                    };
                    if (utils.isStandardBrowserEnv()) {
                        var cookies = __webpack_require__(790);
                        var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;
                        if (xsrfValue) {
                            requestHeaders[config.xsrfHeaderName] = xsrfValue;
                        }
                    }
                    if ("setRequestHeader" in request) {
                        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
                                delete requestHeaders[key];
                            } else {
                                request.setRequestHeader(key, val);
                            }
                        });
                    }
                    if (config.withCredentials) {
                        request.withCredentials = true;
                    }
                    if (config.responseType) {
                        try {
                            request.responseType = config.responseType;
                        } catch (e) {
                            if (config.responseType !== "json") {
                                throw e;
                            }
                        }
                    }
                    if (typeof config.onDownloadProgress === "function") {
                        request.addEventListener("progress", config.onDownloadProgress);
                    }
                    if (typeof config.onUploadProgress === "function" && request.upload) {
                        request.upload.addEventListener("progress", config.onUploadProgress);
                    }
                    if (config.cancelToken) {
                        config.cancelToken.promise.then(function onCanceled(cancel) {
                            if (!request) {
                                return;
                            }
                            request.abort();
                            reject(cancel);
                            request = null;
                        });
                    }
                    if (requestData === undefined) {
                        requestData = null;
                    }
                    request.send(requestData);
                });
            };
        }).call(exports, __webpack_require__(3));
    },
    783: function(module, exports, __webpack_require__) {
        "use strict";
        var createError = __webpack_require__(784);
        module.exports = function settle(resolve, reject, response) {
            var validateStatus = response.config.validateStatus;
            if (!response.status || !validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
            }
        };
    },
    784: function(module, exports, __webpack_require__) {
        "use strict";
        var enhanceError = __webpack_require__(785);
        module.exports = function createError(message, config, code, request, response) {
            var error = new Error(message);
            return enhanceError(error, config, code, request, response);
        };
    },
    785: function(module, exports) {
        "use strict";
        module.exports = function enhanceError(error, config, code, request, response) {
            error.config = config;
            if (code) {
                error.code = code;
            }
            error.request = request;
            error.response = response;
            return error;
        };
    },
    786: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        function encode(val) {
            return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
        }
        module.exports = function buildURL(url, params, paramsSerializer) {
            if (!params) {
                return url;
            }
            var serializedParams;
            if (paramsSerializer) {
                serializedParams = paramsSerializer(params);
            } else if (utils.isURLSearchParams(params)) {
                serializedParams = params.toString();
            } else {
                var parts = [];
                utils.forEach(params, function serialize(val, key) {
                    if (val === null || typeof val === "undefined") {
                        return;
                    }
                    if (utils.isArray(val)) {
                        key = key + "[]";
                    } else {
                        val = [ val ];
                    }
                    utils.forEach(val, function parseValue(v) {
                        if (utils.isDate(v)) {
                            v = v.toISOString();
                        } else if (utils.isObject(v)) {
                            v = JSON.stringify(v);
                        }
                        parts.push(encode(key) + "=" + encode(v));
                    });
                });
                serializedParams = parts.join("&");
            }
            if (serializedParams) {
                url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
            }
            return url;
        };
    },
    787: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        var ignoreDuplicateOf = [ "age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent" ];
        module.exports = function parseHeaders(headers) {
            var parsed = {};
            var key;
            var val;
            var i;
            if (!headers) {
                return parsed;
            }
            utils.forEach(headers.split("\n"), function parser(line) {
                i = line.indexOf(":");
                key = utils.trim(line.substr(0, i)).toLowerCase();
                val = utils.trim(line.substr(i + 1));
                if (key) {
                    if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                        return;
                    }
                    if (key === "set-cookie") {
                        parsed[key] = (parsed[key] ? parsed[key] : []).concat([ val ]);
                    } else {
                        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
                    }
                }
            });
            return parsed;
        };
    },
    788: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
            var msie = /(msie|trident)/i.test(navigator.userAgent);
            var urlParsingNode = document.createElement("a");
            var originURL;
            function resolveURL(url) {
                var href = url;
                if (msie) {
                    urlParsingNode.setAttribute("href", href);
                    href = urlParsingNode.href;
                }
                urlParsingNode.setAttribute("href", href);
                return {
                    href: urlParsingNode.href,
                    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
                    host: urlParsingNode.host,
                    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
                    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
                    hostname: urlParsingNode.hostname,
                    port: urlParsingNode.port,
                    pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
                };
            }
            originURL = resolveURL(window.location.href);
            return function isURLSameOrigin(requestURL) {
                var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
                return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
            };
        }() : function nonStandardBrowserEnv() {
            return function isURLSameOrigin() {
                return true;
            };
        }();
    },
    789: function(module, exports) {
        "use strict";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        function E() {
            this.message = "String contains an invalid character";
        }
        E.prototype = new Error();
        E.prototype.code = 5;
        E.prototype.name = "InvalidCharacterError";
        function btoa(input) {
            var str = String(input);
            var output = "";
            for (var block, charCode, idx = 0, map = chars; str.charAt(idx | 0) || (map = "=", 
            idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
                charCode = str.charCodeAt(idx += 3 / 4);
                if (charCode > 255) {
                    throw new E();
                }
                block = block << 8 | charCode;
            }
            return output;
        }
        module.exports = btoa;
    },
    790: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
            return {
                write: function write(name, value, expires, path, domain, secure) {
                    var cookie = [];
                    cookie.push(name + "=" + encodeURIComponent(value));
                    if (utils.isNumber(expires)) {
                        cookie.push("expires=" + new Date(expires).toGMTString());
                    }
                    if (utils.isString(path)) {
                        cookie.push("path=" + path);
                    }
                    if (utils.isString(domain)) {
                        cookie.push("domain=" + domain);
                    }
                    if (secure === true) {
                        cookie.push("secure");
                    }
                    document.cookie = cookie.join("; ");
                },
                read: function read(name) {
                    var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
                    return match ? decodeURIComponent(match[3]) : null;
                },
                remove: function remove(name) {
                    this.write(name, "", Date.now() - 864e5);
                }
            };
        }() : function nonStandardBrowserEnv() {
            return {
                write: function write() {},
                read: function read() {
                    return null;
                },
                remove: function remove() {}
            };
        }();
    },
    791: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        function InterceptorManager() {
            this.handlers = [];
        }
        InterceptorManager.prototype.use = function use(fulfilled, rejected) {
            this.handlers.push({
                fulfilled: fulfilled,
                rejected: rejected
            });
            return this.handlers.length - 1;
        };
        InterceptorManager.prototype.eject = function eject(id) {
            if (this.handlers[id]) {
                this.handlers[id] = null;
            }
        };
        InterceptorManager.prototype.forEach = function forEach(fn) {
            utils.forEach(this.handlers, function forEachHandler(h) {
                if (h !== null) {
                    fn(h);
                }
            });
        };
        module.exports = InterceptorManager;
    },
    792: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        var transformData = __webpack_require__(793);
        var isCancel = __webpack_require__(794);
        var defaults = __webpack_require__(780);
        var isAbsoluteURL = __webpack_require__(795);
        var combineURLs = __webpack_require__(796);
        function throwIfCancellationRequested(config) {
            if (config.cancelToken) {
                config.cancelToken.throwIfRequested();
            }
        }
        module.exports = function dispatchRequest(config) {
            throwIfCancellationRequested(config);
            if (config.baseURL && !isAbsoluteURL(config.url)) {
                config.url = combineURLs(config.baseURL, config.url);
            }
            config.headers = config.headers || {};
            config.data = transformData(config.data, config.headers, config.transformRequest);
            config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
            utils.forEach([ "delete", "get", "head", "post", "put", "patch", "common" ], function cleanHeaderConfig(method) {
                delete config.headers[method];
            });
            var adapter = config.adapter || defaults.adapter;
            return adapter(config).then(function onAdapterResolution(response) {
                throwIfCancellationRequested(config);
                response.data = transformData(response.data, response.headers, config.transformResponse);
                return response;
            }, function onAdapterRejection(reason) {
                if (!isCancel(reason)) {
                    throwIfCancellationRequested(config);
                    if (reason && reason.response) {
                        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
                    }
                }
                return Promise.reject(reason);
            });
        };
    },
    793: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(776);
        module.exports = function transformData(data, headers, fns) {
            utils.forEach(fns, function transform(fn) {
                data = fn(data, headers);
            });
            return data;
        };
    },
    794: function(module, exports) {
        "use strict";
        module.exports = function isCancel(value) {
            return !!(value && value.__CANCEL__);
        };
    },
    795: function(module, exports) {
        "use strict";
        module.exports = function isAbsoluteURL(url) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
        };
    },
    796: function(module, exports) {
        "use strict";
        module.exports = function combineURLs(baseURL, relativeURL) {
            return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
        };
    },
    797: function(module, exports) {
        "use strict";
        function Cancel(message) {
            this.message = message;
        }
        Cancel.prototype.toString = function toString() {
            return "Cancel" + (this.message ? ": " + this.message : "");
        };
        Cancel.prototype.__CANCEL__ = true;
        module.exports = Cancel;
    },
    798: function(module, exports, __webpack_require__) {
        "use strict";
        var Cancel = __webpack_require__(797);
        function CancelToken(executor) {
            if (typeof executor !== "function") {
                throw new TypeError("executor must be a function.");
            }
            var resolvePromise;
            this.promise = new Promise(function promiseExecutor(resolve) {
                resolvePromise = resolve;
            });
            var token = this;
            executor(function cancel(message) {
                if (token.reason) {
                    return;
                }
                token.reason = new Cancel(message);
                resolvePromise(token.reason);
            });
        }
        CancelToken.prototype.throwIfRequested = function throwIfRequested() {
            if (this.reason) {
                throw this.reason;
            }
        };
        CancelToken.source = function source() {
            var cancel;
            var token = new CancelToken(function executor(c) {
                cancel = c;
            });
            return {
                token: token,
                cancel: cancel
            };
        };
        module.exports = CancelToken;
    },
    799: function(module, exports) {
        "use strict";
        module.exports = function spread(callback) {
            return function wrap(arr) {
                return callback.apply(null, arr);
            };
        };
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHVjZXIiLCJfc2FnYXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNhZ2FNaWRkbGV3YXJlIiwicmVkdXhEZXZUb29scyIsIndpbmRvdyIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJzdG9yZSIsImNyZWF0ZVN0b3JlIiwicmVkdWNlciIsImNvbXBvc2UiLCJhcHBseU1pZGRsZXdhcmUiLCJydW4iLCJ3YXRjaGVyU2FnYSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCI3MzUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJrZXkiLCJDb25zdHJ1Y3RvciIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIl91dGlscyIsIl9jb25zdCIsImMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ld09iaiIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiSXNSZXN0cmljdGVkIiwiX3JlZiIsIl8iLCJpc1Jlc3RyaWN0ZWQiLCJvbkNoYW5nZUlzUmVzdHJpY3RlZCIsImlkIiwidHlwZSIsImNoZWNrZWQiLCJvbkNoYW5nZSIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiY2xhc3NOYW1lIiwiUHJvamVjdCIsIl9yZWYyIiwicHJvamVjdCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkIiwiaW5jbHVkZU9yZ0NlbGwiLCJyb3dTcGFuIiwib3JncyIsInVpU2V0dGluZ3MiLCJhY2Nlc3MiLCJkaXNhYmxlZCIsInByb2plY3RTZWxlY3RlZCIsInRyQ2xhc3NOYW1lIiwiaWRDbGFzc05hbWUiLCJfdWlTZXR0aW5ncyIsIm9uQ2xpY2siLCJyZWFkT25seSIsInRpdGxlIiwic3VidGl0bGUiLCJTZWxlY3RBbGwiLCJfcmVmMyIsInNlbGVjdEFsbCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCIsImJ1dHRvbkNsYXNzIiwiZGl2Q2xhc3MiLCJfdWlTZXR0aW5nczIiLCJFcnJvciIsIl9yZWY0IiwiZXJyb3IiLCJtZXNzYWdlIiwiUHJvamVjdHMiLCJfcmVmNSIsImdyb3VwZWRQcm9qZWN0cyIsIm1hcCIsImdyb3VwIiwicHJvamVjdHMiLCJmaXJzdCIsImZvbyIsIm9yZ2FuaXNhdGlvbnMiLCJBcHAiLCJfUmVhY3QkQ29tcG9uZW50IiwidGhpcyIsIl90aGlzIiwiZ2V0UHJvdG90eXBlT2YiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0ZWQiLCJiaW5kIiwidG9nZ2xlSXNSZXN0cmljdGVkIiwidG9nZ2xlUHJvamVjdFNlbGVjdEFsbCIsInMiLCJzdHJpbmdzIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm9uVXBkYXRlSXNSZXN0cmljdGVkIiwib25VcGRhdGVTZWxlY3RBbGwiLCJjdXJyZW50VGFyZ2V0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsIm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbiIsImNvbXBvbmVudERpZE1vdW50IiwidXNlcklkIiwiZGF0YUZyb21FbGVtZW50Iiwic2V0U3RvcmUiLCJvbkZldGNoVXNlclByb2plY3RzIiwiX3Byb3BzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsImZldGNoaW5nIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJBUElfR0VUX0lOSVQiLCJkYXRhIiwiU0VUX1NUT1JFIiwicHJvamVjdElkIiwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OIiwiVVBEQVRFX0lTX1JFU1RSSUNURUQiLCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyIsImNvbm5lY3QiLCI3MzYiLCJlbmRwb2ludHMiLCJ1c2VyX3Byb2plY3RzX2FjY2VzcyIsImluQXJyYXkiLCJhcnIiLCJpbmRleE9mIiwiZWxlbWVudE5hbWUiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCI3MzciLCJBUElfR0VUX1NVQ0NFU1MiLCJBUElfR0VUX0ZBSUxVUkUiLCJBUElfUFVUX0lOSVQiLCJBUElfUFVUX1NVQ0NFU1MiLCJBUElfUFVUX0ZBSUxVUkUiLCI3MzkiLCJ1dGlscyIsImVmZmVjdHMiLCJkZXRhY2giLCJDQU5DRUwiLCJkZWxheSIsInRocm90dGxlIiwidGFrZUxhdGVzdCIsInRha2VFdmVyeSIsImJ1ZmZlcnMiLCJjaGFubmVsIiwiZXZlbnRDaGFubmVsIiwiRU5EIiwicnVuU2FnYSIsInVuZGVmaW5lZCIsIl9ydW5TYWdhIiwiZ2V0IiwiX2NoYW5uZWwiLCJfYnVmZmVycyIsIl9zYWdhSGVscGVycyIsIl9pbyIsIl9taWRkbGV3YXJlIiwiX21pZGRsZXdhcmUyIiwiX2VmZmVjdHMiLCJfdXRpbHMyIiwiNzQwIiwicHJvY2VzcyIsIl9wcm9jIiwiX3Byb2MyIiwiUlVOX1NBR0FfU0lHTkFUVVJFIiwiTk9OX0dFTkVSQVRPUl9FUlIiLCJzdG9yZUludGVyZmFjZSIsInNhZ2EiLCJfbGVuIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwiX2tleSIsIml0ZXJhdG9yIiwiaXMiLCJlbnYiLCJOT0RFX0VOViIsImxvZyIsImNoZWNrIiwiZnVuYyIsImFwcGx5IiwiX3N0b3JlSW50ZXJmYWNlIiwic3Vic2NyaWJlIiwiZ2V0U3RhdGUiLCJjb250ZXh0Iiwic2FnYU1vbml0b3IiLCJsb2dnZXIiLCJvbkVycm9yIiwiZWZmZWN0SWQiLCJ1aWQiLCJlZmZlY3RUcmlnZ2VyZWQiLCJub29wIiwiZWZmZWN0UmVzb2x2ZWQiLCJlZmZlY3RSZWplY3RlZCIsImVmZmVjdENhbmNlbGxlZCIsImFjdGlvbkRpc3BhdGNoZWQiLCJyb290IiwicGFyZW50RWZmZWN0SWQiLCJlZmZlY3QiLCJ0YXNrIiwid3JhcFNhZ2FEaXNwYXRjaCIsIm5hbWUiLCI3NDEiLCJfZXh0ZW5kcyIsImFzc2lnbiIsInNvdXJjZSIsIl90eXBlb2YiLCJTeW1ib2wiLCJoYXNPd24iLCJyZW1vdmUiLCJkZWZlcnJlZCIsImFycmF5T2ZEZWZmZXJlZCIsImNyZWF0ZU1vY2tUYXNrIiwiYXV0b0luYyIsIm1ha2VJdGVyYXRvciIsImRlcHJlY2F0ZSIsInN5bSIsIlRBU0siLCJIRUxQRVIiLCJNQVRDSCIsIlNBR0FfQUNUSU9OIiwiU0VMRl9DQU5DRUxMQVRJT04iLCJrb25zdCIsInYiLCJrVHJ1ZSIsImtGYWxzZSIsImlkZW50IiwicHJlZGljYXRlIiwib2JqZWN0IiwicHJvcGVydHkiLCJub3RVbmRlZiIsInVuZGVmIiwiZiIsIm51bWJlciIsIm4iLCJzdHJpbmciLCJhcnJheSIsImlzQXJyYXkiLCJwcm9taXNlIiwicCIsInRoZW4iLCJpdCIsIm5leHQiLCJ0aHJvdyIsIml0ZXJhYmxlIiwidCIsIm9ic2VydmFibGUiLCJvYiIsImJ1ZmZlciIsImJ1ZiIsImlzRW1wdHkiLCJ0YWtlIiwicHV0IiwicGF0dGVybiIsInBhdCIsImNoIiwiY2xvc2UiLCJoZWxwZXIiLCJzdHJpbmdhYmxlRnVuYyIsIml0ZW0iLCJpbmRleCIsInNwbGljZSIsImZyb20iLCJkZWYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInB1c2giLCJtcyIsInZhbCIsInRpbWVvdXRJZCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5uaW5nIiwiX3Jlc3VsdCIsIl9lcnJvciIsImlzUnVubmluZyIsInJlc3VsdCIsInNldFJ1bm5pbmciLCJiIiwic2V0UmVzdWx0IiwiciIsInNldEVycm9yIiwic2VlZCIsImtUaHJvdyIsImVyciIsImtSZXR1cm4iLCJkb25lIiwidGhybyIsImlzSGVscGVyIiwicmV0dXJuIiwibGV2ZWwiLCJjb25zb2xlIiwic3RhY2siLCJmbiIsImRlcHJlY2F0aW9uV2FybmluZyIsInVwZGF0ZUluY2VudGl2ZSIsImRlcHJlY2F0ZWQiLCJwcmVmZXJyZWQiLCJpbnRlcm5hbEVyciIsImNyZWF0ZVNldENvbnRleHRXYXJuaW5nIiwiY3R4IiwiYWN0aW9uIiwiY2xvbmVhYmxlR2VuZXJhdG9yIiwiZ2VuZXJhdG9yRnVuYyIsImhpc3RvcnkiLCJnZW4iLCJhcmciLCJjbG9uZSIsImNsb25lZEdlbiIsImZvckVhY2giLCJfcmV0dXJuIiwiX3Rocm93IiwiZXhjZXB0aW9uIiwiNzQyIiwiVEFTS19DQU5DRUwiLCJDSEFOTkVMX0VORCIsIk5PVF9JVEVSQVRPUl9FUlJPUiIsInByb2MiLCJfc2NoZWR1bGVyIiwiX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzIiwiZGVzY3MiLCJkZXNjIiwidG9TdHJpbmciLCJtYXRjaGVycyIsIndpbGRjYXJkIiwiX2RlZmF1bHQiLCJpbnB1dCIsIlN0cmluZyIsInBhdHRlcm5zIiwic29tZSIsIm1hdGNoZXIiLCJfcHJlZGljYXRlIiwiZm9ya1F1ZXVlIiwibWFpblRhc2siLCJjYiIsInRhc2tzIiwiY29tcGxldGVkIiwiYWRkVGFzayIsImFib3J0IiwiY2FuY2VsQWxsIiwiY29udCIsInJlcyIsImlzRXJyIiwiY2FuY2VsIiwiZ2V0VGFza3MiLCJ0YXNrTmFtZXMiLCJjcmVhdGVUYXNrSXRlcmF0b3IiLCJwYyIsImVmZiIsInJldCIsIndyYXBIZWxwZXIiLCJwYXJlbnRDb250ZXh0Iiwib3B0aW9ucyIsImVmZmVjdHNTdHJpbmciLCJydW5QYXJhbGxlbEVmZmVjdCIsInJ1bkFsbEVmZmVjdCIsImxvZ0Vycm9yIiwic2FnYVN0YWNrIiwic3BsaXQiLCJzdGRDaGFubmVsIiwidGFza0NvbnRleHQiLCJuZXdUYXNrIiwiY2FuY2VsTWFpbiIsInRhc2tRdWV1ZSIsImVuZCIsImlzQ2FuY2VsbGVkIiwiX2lzUnVubmluZyIsIl9pc0NhbmNlbGxlZCIsInJ1bkVmZmVjdCIsImlzTWFpblJ1bm5pbmciLCJfZGVmZXJyZWRFbmQiLCJfaXNBYm9ydGVkIiwiam9pbmVycyIsImoiLCJsYWJlbCIsImVmZmVjdFNldHRsZWQiLCJjdXJyQ2IiLCJyZXNvbHZlUHJvbWlzZSIsInJ1bkZvcmtFZmZlY3QiLCJyZXNvbHZlSXRlcmF0b3IiLCJhc0VmZmVjdCIsInJ1blRha2VFZmZlY3QiLCJydW5QdXRFZmZlY3QiLCJhbGwiLCJyYWNlIiwicnVuUmFjZUVmZmVjdCIsInJ1bkNhbGxFZmZlY3QiLCJjcHMiLCJydW5DUFNFZmZlY3QiLCJmb3JrIiwiam9pbiIsInJ1bkpvaW5FZmZlY3QiLCJydW5DYW5jZWxFZmZlY3QiLCJzZWxlY3QiLCJydW5TZWxlY3RFZmZlY3QiLCJhY3Rpb25DaGFubmVsIiwicnVuQ2hhbm5lbEVmZmVjdCIsImZsdXNoIiwicnVuRmx1c2hFZmZlY3QiLCJjYW5jZWxsZWQiLCJydW5DYW5jZWxsZWRFZmZlY3QiLCJnZXRDb250ZXh0IiwicnVuR2V0Q29udGV4dEVmZmVjdCIsInNldENvbnRleHQiLCJydW5TZXRDb250ZXh0RWZmZWN0IiwiY2FuY2VsUHJvbWlzZSIsIm1heWJlIiwidGFrZUNiIiwiaW5wIiwiaXNFbmQiLCJhc2FwIiwiY3BzQ2IiLCJjb25jYXQiLCJfcmVmNiIsImRldGFjaGVkIiwidGFza0l0ZXJhdG9yIiwic3VzcGVuZCIsIl90YXNrIiwiam9pbmVyIiwiaXNBYm9ydGVkIiwidGFza1RvQ2FuY2VsIiwia2V5cyIsImNvbXBsZXRlZENvdW50IiwicmVzdWx0cyIsImNoaWxkQ2JzIiwiY2hlY2tFZmZlY3RFbmQiLCJjaENiQXRLZXkiLCJfcmVzcG9uc2UiLCJyZXNwb25zZSIsInNsaWNlIiwiX3JlZjciLCJzZWxlY3RvciIsIl9yZWY4IiwibWF0Y2giLCJmaXhlZCIsInByb3AiLCJfZG9uZSIsIl9yZWY5IiwiX211dGF0b3JNYXAiLCI3NDMiLCJxdWV1ZSIsInNlbWFwaG9yZSIsImV4ZWMiLCJyZWxlYXNlIiwic2hpZnQiLCI3NDQiLCJ0YWtlbSIsInNwYXduIiwiSU8iLCJUQUtFIiwiUFVUIiwiQUxMIiwiUkFDRSIsIkNBTEwiLCJDUFMiLCJGT1JLIiwiSk9JTiIsIlNFTEVDVCIsIkFDVElPTl9DSEFOTkVMIiwiQ0FOQ0VMTEVEIiwiRkxVU0giLCJHRVRfQ09OVEVYVCIsIlNFVF9DT05URVhUIiwiVEVTVF9ISU5UIiwicGF5bG9hZCIsInBhdHRlcm5PckNoYW5uZWwiLCJzeW5jIiwiZ2V0Rm5DYWxsRGVzYyIsIm1ldGgiLCJfZm4iLCJfZm4yIiwiX2xlbjIiLCJfa2V5MiIsIl9sZW4zIiwiX2tleTMiLCJfbGVuNCIsIl9rZXk0IiwiX2xlbjUiLCJfa2V5NSIsIl9sZW42IiwiX2tleTYiLCJfbGVuNyIsIl9rZXk3Iiwid29ya2VyIiwiX2xlbjgiLCJfa2V5OCIsInRha2VFdmVyeUhlbHBlciIsIl9sZW45IiwiX2tleTkiLCJ0YWtlTGF0ZXN0SGVscGVyIiwiX2xlbjEwIiwiX2tleTEwIiwidGhyb3R0bGVIZWxwZXIiLCJjcmVhdGVBc0VmZmVjdFR5cGUiLCI3NDUiLCJfdGFrZUV2ZXJ5IiwiX3Rha2VFdmVyeTIiLCJfdGFrZUxhdGVzdCIsIl90YWtlTGF0ZXN0MiIsIl90aHJvdHRsZSIsIl90aHJvdHRsZTIiLCJoZWxwZXJOYW1lIiwiNzQ2IiwiX2ZzbUl0ZXJhdG9yIiwiX2ZzbUl0ZXJhdG9yMiIsInlUYWtlIiwieUZvcmsiLCJhYyIsInNldEFjdGlvbiIsInExIiwicTIiLCJxRW5kIiwic2FmZU5hbWUiLCI3NDciLCJmc21JdGVyYXRvciIsImVudHJ5IiwiZnNtIiwicTAiLCJ1cGRhdGVTdGF0ZSIsInFOZXh0IiwiX2ZzbSRxTmV4dCIsInEiLCJvdXRwdXQiLCJfdXBkYXRlU3RhdGUiLCI3NDgiLCJVTkRFRklORURfSU5QVVRfRVJST1IiLCJJTlZBTElEX0JVRkZFUiIsImVtaXR0ZXIiLCJDSEFOTkVMX0VORF9UWVBFIiwiYSIsInN1YnNjcmliZXJzIiwic3ViIiwiZW1pdCIsImxlbiIsImNsb3NlZCIsInRha2VycyIsImNoZWNrRm9yYmlkZGVuU3RhdGVzIiwiX190YWtlcnNfXyIsIl9fY2xvc2VkX18iLCJub25lIiwiY2hhbiIsInVuc3Vic2NyaWJlIiwiNzQ5IiwiQlVGRkVSX09WRVJGTE9XIiwiT05fT1ZFUkZMT1dfVEhST1ciLCJPTl9PVkVSRkxPV19EUk9QIiwiT05fT1ZFUkZMT1dfU0xJREUiLCJPTl9PVkVSRkxPV19FWFBBTkQiLCJ6ZXJvQnVmZmVyIiwicmluZ0J1ZmZlciIsImxpbWl0Iiwib3ZlcmZsb3dBY3Rpb24iLCJwdXNoSW5kZXgiLCJwb3BJbmRleCIsIml0ZW1zIiwiZG91YmxlZExpbWl0IiwiZHJvcHBpbmciLCJzbGlkaW5nIiwiZXhwYW5kaW5nIiwiaW5pdGlhbFNpemUiLCI3NTAiLCJ5Q2FuY2VsIiwic2V0VGFzayIsInEzIiwiNzUxIiwiZGVsYXlMZW5ndGgiLCJ5QWN0aW9uQ2hhbm5lbCIsInlEZWxheSIsInNldENoYW5uZWwiLCJxNCIsIjc1MiIsInNhZ2FNaWRkbGV3YXJlRmFjdG9yeSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9yZWYkY29udGV4dCIsIm9uZXJyb3IiLCJzYWdhRW1pdHRlciIsIjc1MyIsIjc1NCIsIjc1NSIsIl9wdWxsIiwiX3B1bGwyIiwiX2RlZmluZVByb3BlcnR5IiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiYXJyMiIsImluaXRpYWxTdGF0ZSIsIm9yaWdpbmFsSXNSZXN0cmljdGVkIiwib3JpZ2luYWxHcm91cGVkUHJvamVjdHMiLCJ1cGRhdGVQcm9qZWN0QWNjZXNzIiwidXBkYXRlQWxsUHJvamVjdHNBY2Nlc3MiLCJfcmVkdWNlckFjdGlvbnMiLCJyZWR1Y2VyQWN0aW9ucyIsIl9hY3Rpb24kZGF0YSIsInVzZXJfcHJvamVjdHMiLCJpc19yZXN0cmljdGVkIiwib3JnYW5pc2F0aW9uX2dyb3VwcyIsImFsbF9wcm9qZWN0cyIsImdyb3VwZWRfcHJvamVjdHMiLCJuZXdTdGF0ZSIsIl9zdGF0ZSIsIjc1NiIsImJhc2VSZXN0IiwicHVsbEFsbCIsInB1bGwiLCI3NTciLCJpZGVudGl0eSIsIm92ZXJSZXN0Iiwic2V0VG9TdHJpbmciLCJzdGFydCIsIjc1OCIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJ0cmFuc2Zvcm0iLCJvdGhlckFyZ3MiLCI3NTkiLCJ0aGlzQXJnIiwiNzYwIiwiYmFzZVNldFRvU3RyaW5nIiwic2hvcnRPdXQiLCI3NjEiLCJjb25zdGFudCIsIjc2MiIsIjc2MyIsIkhPVF9DT1VOVCIsIkhPVF9TUEFOIiwibmF0aXZlTm93IiwiRGF0ZSIsIm5vdyIsImNvdW50IiwibGFzdENhbGxlZCIsInN0YW1wIiwicmVtYWluaW5nIiwiNzY0IiwiYmFzZVB1bGxBbGwiLCJ2YWx1ZXMiLCI3NjUiLCJhcnJheU1hcCIsImJhc2VJbmRleE9mIiwiYmFzZUluZGV4T2ZXaXRoIiwiYmFzZVVuYXJ5IiwiY29weUFycmF5IiwiYXJyYXlQcm90byIsIml0ZXJhdGVlIiwiY29tcGFyYXRvciIsInNlZW4iLCJmcm9tSW5kZXgiLCJjb21wdXRlZCIsIjc2NiIsImJhc2VGaW5kSW5kZXgiLCJiYXNlSXNOYU4iLCJzdHJpY3RJbmRleE9mIiwiNzY3IiwiZnJvbVJpZ2h0IiwiNzY4IiwiNzY5IiwiNzcwIiwiNzcxIiwiNzcyIiwiZ2V0SXNSZXN0cmljdGVkIiwiZ2V0VXNlcklkIiwiZmV0Y2hEYXRhIiwicHV0RGF0YSIsImdldFNhZ2EiLCJwdXRTYWdhIiwiX2F4aW9zIiwiX2F4aW9zMiIsIl9tYXJrZWQiLCJyZWdlbmVyYXRvclJ1bnRpbWUiLCJtYXJrIiwiX21hcmtlZDIiLCJfbWFya2VkMyIsImNhbGxBeGlvcyIsImNvbmZpZyIsImNhdGNoIiwibWV0aG9kIiwidXJsIiwicHJvamVjdHNXaXRoQWNjZXNzIiwiaGVhZGVycyIsIlgtQ1NSRlRva2VuIiwiZ2V0Q29va2llIiwid3JhcCIsImdldFNhZ2EkIiwiX2NvbnRleHQiLCJwcmV2Iiwic2VudCIsInN0b3AiLCJmaWx0ZXJQcm9qZWN0cyIsInJlZHVjZSIsImFjYyIsImZpbHRlciIsInB1dFNhZ2EkIiwiX2NvbnRleHQyIiwid2F0Y2hlclNhZ2EkIiwiX2NvbnRleHQzIiwiNzczIiwiZ2xvYmFsIiwiT3AiLCIkU3ltYm9sIiwiaXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJpbk1vZHVsZSIsInJ1bnRpbWUiLCJpbm5lckZuIiwib3V0ZXJGbiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsIkdlblN0YXRlU3VzcGVuZGVkU3RhcnQiLCJHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkIiwiR2VuU3RhdGVFeGVjdXRpbmciLCJHZW5TdGF0ZUNvbXBsZXRlZCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwiR3AiLCJkaXNwbGF5TmFtZSIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiYXdyYXAiLCJfX2F3YWl0IiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsInJlY29yZCIsInVud3JhcHBlZCIsInByZXZpb3VzUHJvbWlzZSIsImVucXVldWUiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsImFzeW5jIiwiaXRlciIsImRvbmVSZXN1bHQiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHRMb2MiLCJwdXNoVHJ5RW50cnkiLCJsb2NzIiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsInJldmVyc2UiLCJwb3AiLCJpdGVyYXRvck1ldGhvZCIsImlzTmFOIiwic2tpcFRlbXBSZXNldCIsImNoYXJBdCIsInJvb3RFbnRyeSIsInJvb3RSZWNvcmQiLCJydmFsIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwiRnVuY3Rpb24iLCI3NzQiLCI3NzUiLCJBeGlvcyIsImRlZmF1bHRzIiwiY3JlYXRlSW5zdGFuY2UiLCJkZWZhdWx0Q29uZmlnIiwicmVxdWVzdCIsImV4dGVuZCIsImF4aW9zIiwiaW5zdGFuY2VDb25maWciLCJtZXJnZSIsIkNhbmNlbCIsIkNhbmNlbFRva2VuIiwiaXNDYW5jZWwiLCJwcm9taXNlcyIsInNwcmVhZCIsIjc3NiIsImlzQnVmZmVyIiwiaXNBcnJheUJ1ZmZlciIsImlzRm9ybURhdGEiLCJGb3JtRGF0YSIsImlzQXJyYXlCdWZmZXJWaWV3IiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNVbmRlZmluZWQiLCJpc09iamVjdCIsImlzRGF0ZSIsImlzRmlsZSIsImlzQmxvYiIsImlzRnVuY3Rpb24iLCJpc1N0cmVhbSIsInBpcGUiLCJpc1VSTFNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInRyaW0iLCJzdHIiLCJyZXBsYWNlIiwiaXNTdGFuZGFyZEJyb3dzZXJFbnYiLCJuYXZpZ2F0b3IiLCJwcm9kdWN0IiwibCIsImFzc2lnblZhbHVlIiwiNzc3IiwiNzc4IiwiaXNTbG93QnVmZmVyIiwiX2lzQnVmZmVyIiwicmVhZEZsb2F0TEUiLCI3NzkiLCJJbnRlcmNlcHRvck1hbmFnZXIiLCJkaXNwYXRjaFJlcXVlc3QiLCJpbnRlcmNlcHRvcnMiLCJ0b0xvd2VyQ2FzZSIsImNoYWluIiwidW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMiLCJpbnRlcmNlcHRvciIsInVuc2hpZnQiLCJmdWxmaWxsZWQiLCJyZWplY3RlZCIsInB1c2hSZXNwb25zZUludGVyY2VwdG9ycyIsImZvckVhY2hNZXRob2ROb0RhdGEiLCJmb3JFYWNoTWV0aG9kV2l0aERhdGEiLCI3ODAiLCJub3JtYWxpemVIZWFkZXJOYW1lIiwiREVGQVVMVF9DT05URU5UX1RZUEUiLCJDb250ZW50LVR5cGUiLCJzZXRDb250ZW50VHlwZUlmVW5zZXQiLCJnZXREZWZhdWx0QWRhcHRlciIsImFkYXB0ZXIiLCJYTUxIdHRwUmVxdWVzdCIsInRyYW5zZm9ybVJlcXVlc3QiLCJzdHJpbmdpZnkiLCJ0cmFuc2Zvcm1SZXNwb25zZSIsInRpbWVvdXQiLCJ4c3JmQ29va2llTmFtZSIsInhzcmZIZWFkZXJOYW1lIiwibWF4Q29udGVudExlbmd0aCIsInZhbGlkYXRlU3RhdHVzIiwic3RhdHVzIiwiY29tbW9uIiwiQWNjZXB0IiwiNzgxIiwibm9ybWFsaXplZE5hbWUiLCJwcm9jZXNzSGVhZGVyIiwidG9VcHBlckNhc2UiLCI3ODIiLCJzZXR0bGUiLCJidWlsZFVSTCIsInBhcnNlSGVhZGVycyIsImlzVVJMU2FtZU9yaWdpbiIsImNyZWF0ZUVycm9yIiwiYnRvYSIsInhockFkYXB0ZXIiLCJkaXNwYXRjaFhoclJlcXVlc3QiLCJyZXF1ZXN0RGF0YSIsInJlcXVlc3RIZWFkZXJzIiwibG9hZEV2ZW50IiwieERvbWFpbiIsIlhEb21haW5SZXF1ZXN0Iiwib25wcm9ncmVzcyIsImhhbmRsZVByb2dyZXNzIiwib250aW1lb3V0IiwiaGFuZGxlVGltZW91dCIsImF1dGgiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiQXV0aG9yaXphdGlvbiIsIm9wZW4iLCJwYXJhbXMiLCJwYXJhbXNTZXJpYWxpemVyIiwiaGFuZGxlTG9hZCIsInJlYWR5U3RhdGUiLCJyZXNwb25zZVVSTCIsInJlc3BvbnNlSGVhZGVycyIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlVHlwZSIsInJlc3BvbnNlVGV4dCIsInN0YXR1c1RleHQiLCJoYW5kbGVFcnJvciIsImNvb2tpZXMiLCJ4c3JmVmFsdWUiLCJ3aXRoQ3JlZGVudGlhbHMiLCJyZWFkIiwic2V0UmVxdWVzdEhlYWRlciIsIm9uRG93bmxvYWRQcm9ncmVzcyIsIm9uVXBsb2FkUHJvZ3Jlc3MiLCJ1cGxvYWQiLCJjYW5jZWxUb2tlbiIsIm9uQ2FuY2VsZWQiLCJzZW5kIiwiNzgzIiwiNzg0IiwiZW5oYW5jZUVycm9yIiwiY29kZSIsIjc4NSIsIjc4NiIsImVuY29kZSIsImVuY29kZVVSSUNvbXBvbmVudCIsInNlcmlhbGl6ZWRQYXJhbXMiLCJwYXJ0cyIsInNlcmlhbGl6ZSIsInBhcnNlVmFsdWUiLCJ0b0lTT1N0cmluZyIsIjc4NyIsImlnbm9yZUR1cGxpY2F0ZU9mIiwicGFyc2VkIiwicGFyc2VyIiwibGluZSIsInN1YnN0ciIsIjc4OCIsInN0YW5kYXJkQnJvd3NlckVudiIsIm1zaWUiLCJ0ZXN0IiwidXNlckFnZW50IiwidXJsUGFyc2luZ05vZGUiLCJvcmlnaW5VUkwiLCJyZXNvbHZlVVJMIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInByb3RvY29sIiwiaG9zdCIsInNlYXJjaCIsImhhc2giLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsImxvY2F0aW9uIiwicmVxdWVzdFVSTCIsIm5vblN0YW5kYXJkQnJvd3NlckVudiIsIjc4OSIsImNoYXJzIiwiRSIsImJsb2NrIiwiY2hhckNvZGUiLCJpZHgiLCJjaGFyQ29kZUF0IiwiNzkwIiwid3JpdGUiLCJleHBpcmVzIiwicGF0aCIsImRvbWFpbiIsInNlY3VyZSIsImNvb2tpZSIsInRvR01UU3RyaW5nIiwiUmVnRXhwIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiNzkxIiwiaGFuZGxlcnMiLCJ1c2UiLCJlamVjdCIsImZvckVhY2hIYW5kbGVyIiwiaCIsIjc5MiIsInRyYW5zZm9ybURhdGEiLCJpc0Fic29sdXRlVVJMIiwiY29tYmluZVVSTHMiLCJ0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkIiwidGhyb3dJZlJlcXVlc3RlZCIsImJhc2VVUkwiLCJjbGVhbkhlYWRlckNvbmZpZyIsIm9uQWRhcHRlclJlc29sdXRpb24iLCJvbkFkYXB0ZXJSZWplY3Rpb24iLCJyZWFzb24iLCI3OTMiLCJmbnMiLCI3OTQiLCJfX0NBTkNFTF9fIiwiNzk1IiwiNzk2IiwicmVsYXRpdmVVUkwiLCI3OTciLCI3OTgiLCJleGVjdXRvciIsInByb21pc2VFeGVjdXRvciIsInRva2VuIiwiNzk5IiwiY2FsbGJhY2siXSwibWFwcGluZ3MiOiJBQUFBQSxlQUFjO0lBRVJDLEdBQ0EsU0FBVUMsUUFBUUMsU0FBU0M7UUFFaEM7UUNFRCxJQUFBQyxTQUFBRCxvQkFBQTtRREVDLElBQUlFLFVBQVVDLHVCQUF1QkY7UUNEdEMsSUFBQUcsWUFBQUosb0JBQUE7UURLQyxJQUFJSyxhQUFhRix1QkFBdUJDO1FDSHpDLElBQUFFLE9BQUFOLG9CQUFBO1FET0MsSUFBSU8sUUFBUUosdUJBQXVCRztRQ0xwQyxJQUFBRSxTQUFBUixvQkFBQTtRQUNBLElBQUFTLGFBQUFULG9CQUFBO1FEVUMsSUFBSVUsY0FBY1AsdUJBQXVCTTtRQ1QxQyxJQUFBRSxjQUFBWCxvQkFBQTtRQUVBLElBQUFZLFdBQUFaLG9CQUFBO1FBQ0EsSUFBQWEsU0FBQWIsb0JBQUE7UURjQyxTQUFTRyx1QkFBdUJXO1lBQU8sT0FBT0EsT0FBT0EsSUFBSUMsYUFBYUQ7Z0JBQVFFLFNBQVNGOzs7UUNYeEYsSUFBTUcsa0JBQWlCLEdBQUFQLFlBQUFNO1FBR3ZCLElBQU1FLGdCQUFnQkMsT0FBT0MsZ0NBQWdDRCxPQUFPQztRQUVwRSxJQUFJQztRQUNKLElBQUlILGVBQWU7WUFDZkcsU0FBUSxHQUFBYixPQUFBYyxhQUFZQyxtQkFBUyxHQUFBZixPQUFBZ0IsVUFBUSxHQUFBaEIsT0FBQWlCLGlCQUFnQlIsaUJBQWlCQztlQUNuRTtZQUNIRyxTQUFRLEdBQUFiLE9BQUFjLGFBQVlDLG1CQUFTLEdBQUFmLE9BQUFpQixpQkFBZ0JSOztRQUdqREEsZUFBZVMsSUFBSUM7UUFFbkJDLFNBQVNDLGlCQUFpQixvQkFBb0I7WUFDMUNDLG1CQUFTQyxPQUNMN0IsUUFBQWMsUUFBQWdCLGNBQUNyQixZQUFBc0I7Z0JBQVNaLE9BQU9BO2VBQ2JuQixRQUFBYyxRQUFBZ0Is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QVFDO1FpRTduTXhCO1FBc0JBRCxPQUFBQyxVQUFBLFNBQUE4MEIsT0FBQTJNO1lBQ0EsZ0JBQUFoVSxLQUFBOWlCO2dCQUNBLE9BQUE4MkIsU0FBQXJ6QixNQUFBLE1BQUF6RCIsImZpbGUiOiJ1c2VyUHJvamVjdHMtYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2VicGFja0pzb25wKFsxXSx7XG5cbi8qKiovIDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHR2YXIgX3JlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0XG5cdHZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXHRcblx0dmFyIF9yZWFjdERvbSA9IF9fd2VicGFja19yZXF1aXJlX18oMzcpO1xuXHRcblx0dmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cdFxuXHR2YXIgX0FwcCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM1KTtcblx0XG5cdHZhciBfQXBwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FwcCk7XG5cdFxuXHR2YXIgX3JlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOTcpO1xuXHRcblx0dmFyIF9yZWR1eFNhZ2EgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eFNhZ2EpO1xuXHRcblx0dmFyIF9yZWFjdFJlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxODQpO1xuXHRcblx0dmFyIF9yZWR1Y2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTUpO1xuXHRcblx0dmFyIF9zYWdhcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzcyKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHQvLyBjcmVhdGUgdGhlIHNhZ2EgbWlkZGxld2FyZVxuXHQvKlxuXHQgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0IEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0dmFyIHNhZ2FNaWRkbGV3YXJlID0gKDAsIF9yZWR1eFNhZ2EyLmRlZmF1bHQpKCk7XG5cdFxuXHQvLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuXHR2YXIgcmVkdXhEZXZUb29scyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCk7XG5cdFxuXHR2YXIgc3RvcmUgPSB2b2lkIDA7XG5cdGlmIChyZWR1eERldlRvb2xzKSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguY29tcG9zZSkoKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKHNhZ2FNaWRkbGV3YXJlKSwgcmVkdXhEZXZUb29scykpO1xuXHR9IGVsc2Uge1xuXHQgICAgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShfcmVkdWNlci5yZWR1Y2VyLCAoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpKTtcblx0fVxuXHRcblx0c2FnYU1pZGRsZXdhcmUucnVuKF9zYWdhcy53YXRjaGVyU2FnYSk7XG5cdFxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICBfcmVhY3REb20yLmRlZmF1bHQucmVuZGVyKF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIF9yZWFjdFJlZHV4LlByb3ZpZGVyLFxuXHQgICAgICAgIHsgc3RvcmU6IHN0b3JlIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0FwcDIuZGVmYXVsdCwgbnVsbClcblx0ICAgICksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclByb2plY3RzXCIpKTtcblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0dmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzYpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXHRcblx0ZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XG5cdHZhciBJc1Jlc3RyaWN0ZWQgPSBmdW5jdGlvbiBJc1Jlc3RyaWN0ZWQoX3JlZikge1xuXHQgICAgdmFyIF8gPSBfcmVmLl8sXG5cdCAgICAgICAgaXNSZXN0cmljdGVkID0gX3JlZi5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmLm9uQ2hhbmdlSXNSZXN0cmljdGVkO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcImxhYmVsXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHQgICAgICAgICAgICAgICAgaWQ6IFwiaXNSZXN0cmljdGVkXCIsXG5cdCAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXG5cdCAgICAgICAgICAgICAgICBjaGVja2VkOiBpc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZTogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICAgICAgfSksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XG5cdCAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuXHQgICAgICAgICAgICAgICAgICAgIF9faHRtbDogaXNSZXN0cmljdGVkID8gXyhcInVzZXJfYWNjZXNzX3Jlc3RyaWN0ZWRcIikgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG5cdCAgICAgICAgICAgIGNsYXNzTmFtZTogXCJyZXN0cmljdGVkSW5mb1wiLFxuXHQgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6IF8oXCJyZXN0cmljdGVkX2luZm9cIikgfVxuXHQgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdCA9IGZ1bmN0aW9uIFByb2plY3QoX3JlZjIpIHtcblx0ICAgIHZhciBfID0gX3JlZjIuXyxcblx0ICAgICAgICBwcm9qZWN0ID0gX3JlZjIucHJvamVjdCxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfcmVmMi5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmMi5vbkNoYW5nZVByb2plY3RTZWxlY3RlZCxcblx0ICAgICAgICBpbmNsdWRlT3JnQ2VsbCA9IF9yZWYyLmluY2x1ZGVPcmdDZWxsLFxuXHQgICAgICAgIHJvd1NwYW4gPSBfcmVmMi5yb3dTcGFuLFxuXHQgICAgICAgIG9yZ3MgPSBfcmVmMi5vcmdzO1xuXHRcblx0ICAgIC8vIE5PVEU6IHRoZSBjaGVja2VkIHZhbHVlIGlzIHNldCB0byB0cnVlIGlmIGlzUmVzdHJpY3RlZCBpcyBmYWxzZS4gVGhpcyBpcyBzbyB0aGF0IHRoZSBsaXN0IG9mXG5cdCAgICAvLyBwcm9qZWN0cyBsb29rcyBsaWtlIGFsbCBwcm9qZWN0cyBhcmUgc2VsZWN0ZWQgd2hlbiByZXN0cmljdGlvbnMgYXJlIG5vdCBpbiBmb3JjZS5cblx0ICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cblx0ICAgIHZhciB1aVNldHRpbmdzID0gZnVuY3Rpb24gdWlTZXR0aW5ncyhwcm9qZWN0LCBpc1Jlc3RyaWN0ZWQpIHtcblx0ICAgICAgICB2YXIgY2hlY2tlZCA9IHByb2plY3QuYWNjZXNzLFxuXHQgICAgICAgICAgICBkaXNhYmxlZCA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG5cdCAgICAgICAgICAgIHByb2plY3RTZWxlY3RlZCA9IGNoZWNrZWQgPyBcIiBwcm9qZWN0U2VsZWN0ZWRcIiA6IFwiXCIsXG5cdCAgICAgICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG5cdCAgICAgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuXHQgICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IGNoZWNrZWQsIHRyQ2xhc3NOYW1lOiB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWU6IGlkQ2xhc3NOYW1lIH07XG5cdCAgICB9O1xuXHRcblx0ICAgIHZhciBfdWlTZXR0aW5ncyA9IHVpU2V0dGluZ3MocHJvamVjdCwgaXNSZXN0cmljdGVkKSxcblx0ICAgICAgICBjaGVja2VkID0gX3VpU2V0dGluZ3MuY2hlY2tlZCxcblx0ICAgICAgICB0ckNsYXNzTmFtZSA9IF91aVNldHRpbmdzLnRyQ2xhc3NOYW1lLFxuXHQgICAgICAgIGlkQ2xhc3NOYW1lID0gX3VpU2V0dGluZ3MuaWRDbGFzc05hbWU7XG5cdFxuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwidHJcIixcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IHRyQ2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZCxcblx0ICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgcmVhZE9ubHk6IHRydWVcblx0ICAgICAgICAgICAgfSlcblx0ICAgICAgICApLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRkXCIsXG5cdCAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBpZENsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICBwcm9qZWN0LmlkXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBwcm9qZWN0LnRpdGxlIHx8IF8oXCJub190aXRsZVwiKVxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC5zdWJ0aXRsZVxuXHQgICAgICAgICksXG5cdCAgICAgICAgaW5jbHVkZU9yZ0NlbGwgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJib3JkZXJcIiwgcm93U3Bhbjogcm93U3BhbiB9LFxuXHQgICAgICAgICAgICBvcmdzXG5cdCAgICAgICAgKSA6IG51bGxcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgU2VsZWN0QWxsID0gZnVuY3Rpb24gU2VsZWN0QWxsKF9yZWYzKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYzLl8sXG5cdCAgICAgICAgc2VsZWN0QWxsID0gX3JlZjMuc2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCA9IF9yZWYzLm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfcmVmMy5pc1Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgdmFyIHVpU2V0dGluZ3MgPSBmdW5jdGlvbiB1aVNldHRpbmdzKGlzUmVzdHJpY3RlZCkge1xuXHQgICAgICAgIHZhciBidXR0b25DbGFzcyA9IFwic2VsZWN0QWxsUHJvamVjdHNcIiArIChpc1Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIiksXG5cdCAgICAgICAgICAgIGRpc2FibGVkID0gIWlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgZGl2Q2xhc3MgPSBpc1Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xuXHQgICAgICAgIHJldHVybiB7IGJ1dHRvbkNsYXNzOiBidXR0b25DbGFzcywgZGlzYWJsZWQ6IGRpc2FibGVkLCBkaXZDbGFzczogZGl2Q2xhc3MgfTtcblx0ICAgIH07XG5cdFxuXHQgICAgdmFyIF91aVNldHRpbmdzMiA9IHVpU2V0dGluZ3MoaXNSZXN0cmljdGVkKSxcblx0ICAgICAgICBkaXZDbGFzcyA9IF91aVNldHRpbmdzMi5kaXZDbGFzcyxcblx0ICAgICAgICBkaXNhYmxlZCA9IF91aVNldHRpbmdzMi5kaXNhYmxlZCxcblx0ICAgICAgICBidXR0b25DbGFzcyA9IF91aVNldHRpbmdzMi5idXR0b25DbGFzcztcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJkaXZcIixcblx0ICAgICAgICB7IGNsYXNzTmFtZTogZGl2Q2xhc3MgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJidXR0b25cIixcblx0ICAgICAgICAgICAgeyBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGRpc2FibGVkOiBkaXNhYmxlZCwgY2xhc3NOYW1lOiBidXR0b25DbGFzcyB9LFxuXHQgICAgICAgICAgICBzZWxlY3RBbGwgPyBfKFwiY2hlY2tfYWxsX3Byb2plY3RzXCIpIDogXyhcInVuY2hlY2tfYWxsX3Byb2plY3RzXCIpXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBFcnJvciA9IGZ1bmN0aW9uIEVycm9yKF9yZWY0KSB7XG5cdCAgICB2YXIgXyA9IF9yZWY0Ll8sXG5cdCAgICAgICAgZXJyb3IgPSBfcmVmNC5lcnJvcjtcblx0XG5cdCAgICByZXR1cm4gZXJyb3IgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBcImVycm9yXCIgfSxcblx0ICAgICAgICBfKFwiYW5fZXJyb3Jfb2NjdXJlZFwiKSArIGVycm9yLm1lc3NhZ2Vcblx0ICAgICkgOiBudWxsO1xuXHR9O1xuXHRcblx0dmFyIFByb2plY3RzID0gZnVuY3Rpb24gUHJvamVjdHMoX3JlZjUpIHtcblx0ICAgIHZhciBfID0gX3JlZjUuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY1LmVycm9yLFxuXHQgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IF9yZWY1Lmdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfcmVmNS5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gX3JlZjUuc2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZjUub25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChFcnJvciwgeyBfOiBfLCBlcnJvcjogZXJyb3IgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoSXNSZXN0cmljdGVkLCB7XG5cdCAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZDogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChTZWxlY3RBbGwsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRhYmxlXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0aGVhZFwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgIFwidHJcIixcblx0ICAgICAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcImFjY2Vzc1wiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF9pZFwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF90aXRsZVwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcIlByb2plY3Qgc3VidGl0bGVcIlxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcIk1hbmFnaW5nIG9yZ2FuaXNhdGlvbnNcIlxuXHQgICAgICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRib2R5XCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzLm1hcChmdW5jdGlvbiAoZ3JvdXApIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcm93U3BhbiA9IGdyb3VwLnByb2plY3RzLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmb28gPSBncm91cC5wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY2x1ZGVPcmdDZWxsID0gZmlyc3Q7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9qZWN0LCB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU9yZ0NlbGw6IGluY2x1ZGVPcmdDZWxsLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3Bhbjogcm93U3Bhbixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ3M6IGdyb3VwLm9yZ2FuaXNhdGlvbnNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvbztcblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgICAgIClcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEFwcCA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG5cdCAgICBfaW5oZXJpdHMoQXBwLCBfUmVhY3QkQ29tcG9uZW50KTtcblx0XG5cdCAgICBmdW5jdGlvbiBBcHAocHJvcHMpIHtcblx0ICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXBwKTtcblx0XG5cdCAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEFwcC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEFwcCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblx0XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkID0gX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCA9IF90aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsID0gX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy5fID0gX3RoaXMuXy5iaW5kKF90aGlzKTtcblx0ICAgICAgICByZXR1cm4gX3RoaXM7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gVHJhbnNsYXRpb24gaGFuZGxpbmdcblx0XG5cdFxuXHQgICAgX2NyZWF0ZUNsYXNzKEFwcCwgW3tcblx0ICAgICAgICBrZXk6IFwiX1wiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfKHMpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc3RyaW5ncyAmJiB0aGlzLnByb3BzLnN0cmluZ3Nbc107XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVJc1Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlSXNSZXN0cmljdGVkKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZUlzUmVzdHJpY3RlZChlLnRhcmdldC5jaGVja2VkKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZVByb2plY3RTZWxlY3RBbGxcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUHJvamVjdFNlbGVjdEFsbChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVTZWxlY3RBbGwoKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZVByb2plY3RTZWxlY3RlZFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVQcm9qZWN0U2VsZWN0ZWQoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuXHQgICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwiY29tcG9uZW50RGlkTW91bnRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdCAgICAgICAgICAgIHZhciB1c2VySWQgPSAoMCwgX3V0aWxzLmRhdGFGcm9tRWxlbWVudCkoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkOiB1c2VySWQgfSk7XG5cdFxuXHQgICAgICAgICAgICB2YXIgc3RyaW5ncyA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItcHJvamVjdHMtdGV4dFwiKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHN0cmluZ3M6IHN0cmluZ3MgfSk7XG5cdFxuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInJlbmRlclwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdCAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gX3Byb3BzLnNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IF9wcm9wcy5ncm91cGVkUHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfcHJvcHMuaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgZXJyb3IgPSBfcHJvcHMuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICByZXR1cm4gZ3JvdXBlZFByb2plY3RzID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdHMsIHtcblx0ICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcblx0ICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcblx0ICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgICAgICBncm91cGVkUHJvamVjdHM6IGdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICgwLCBfdXRpbHMuXykoXCJsb2FkaW5nXCIpXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXHQgICAgfV0pO1xuXHRcblx0ICAgIHJldHVybiBBcHA7XG5cdH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cdFxuXHR2YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdCAgICB2YXIgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IHN0YXRlLmdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBzdGF0ZS5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gc3RhdGUuc2VsZWN0QWxsLFxuXHQgICAgICAgIHN0cmluZ3MgPSBzdGF0ZS5zdHJpbmdzO1xuXHRcblx0ICAgIHJldHVybiB7IGZldGNoaW5nOiBmZXRjaGluZywgZXJyb3I6IGVycm9yLCBncm91cGVkUHJvamVjdHM6IGdyb3VwZWRQcm9qZWN0cywgaXNSZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQsIHNlbGVjdEFsbDogc2VsZWN0QWxsLCBzdHJpbmdzOiBzdHJpbmdzIH07XG5cdH07XG5cdFxuXHR2YXIgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIG9uRmV0Y2hVc2VyUHJvamVjdHM6IGZ1bmN0aW9uIG9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLkFQSV9HRVRfSU5JVCxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcklkOiB1c2VySWQgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHNldFN0b3JlOiBmdW5jdGlvbiBzZXRTdG9yZShkYXRhKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb246IGZ1bmN0aW9uIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihwcm9qZWN0SWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyBwcm9qZWN0SWQ6IHByb2plY3RJZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVJc1Jlc3RyaWN0ZWQ6IGZ1bmN0aW9uIG9uVXBkYXRlSXNSZXN0cmljdGVkKGlzUmVzdHJpY3RlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgaXNSZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlU2VsZWN0QWxsOiBmdW5jdGlvbiBvblVwZGF0ZVNlbGVjdEFsbCgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShBcHApO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0Lypcblx0ICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgKi9cblx0XG5cdHZhciBlbmRwb2ludHMgPSBleHBvcnRzLmVuZHBvaW50cyA9IHtcblx0ICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBmdW5jdGlvbiB1c2VyX3Byb2plY3RzX2FjY2VzcyhpZCkge1xuXHQgICAgICAgIHJldHVybiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgaWQgKyBcIi8/Zm9ybWF0PWpzb25cIjtcblx0ICAgIH1cblx0fTtcblx0XG5cdHZhciBpbkFycmF5ID0gZXhwb3J0cy5pbkFycmF5ID0gZnVuY3Rpb24gaW5BcnJheShvYmosIGFycikge1xuXHQgICAgcmV0dXJuIGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblx0fTtcblx0XG5cdHZhciBkYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGRhdGFGcm9tRWxlbWVudChlbGVtZW50TmFtZSkge1xuXHQgICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0Ly8gYWN0aW9uIHR5cGVzXG5cdHZhciAvL1xuXHRTRVRfU1RPUkUgPSBleHBvcnRzLlNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG5cdFxuXHQvL1xuXHRBUElfR0VUX0lOSVQgPSBleHBvcnRzLkFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG5cdCAgICBBUElfR0VUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfR0VUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRBUElfUFVUX0lOSVQgPSBleHBvcnRzLkFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG5cdCAgICBBUElfUFVUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfUFVUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBleHBvcnRzLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG5cdCAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IGV4cG9ydHMuVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG5cdCAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IGV4cG9ydHMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ5KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDUpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWxheTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZGV0YWNoO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Myk7XG5cdFxuXHR2YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cdFxuXHR2YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1NCk7XG5cdFxuXHR2YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuXHRleHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuXHRleHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDIpO1xuXHRcblx0dmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcblx0dmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cdFxuXHRmdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHQgICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG5cdCAgICB9XG5cdCAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuXHQgICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgfVxuXHRcblx0ICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG5cdCAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcblx0ICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuXHQgICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXHRcblx0XG5cdCAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXHRcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG5cdCAgfVxuXHRcblx0ICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHRhc2s7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmNoZWNrID0gY2hlY2s7XG5cdGV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuXHRleHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcblx0ZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuXHRleHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcblx0ZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuXHRleHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5cdGV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5cdGV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG5cdHZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuXHQgIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcblx0fTtcblx0XG5cdHZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xuXHR2YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcblx0dmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG5cdHZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG5cdHZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xuXHR2YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcblx0dmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHY7XG5cdCAgfTtcblx0fTtcblx0dmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcblx0dmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcblx0dmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cdHZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG5cdCAgcmV0dXJuIHY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuXHQgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcblx0ICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdH1cblx0XG5cdHZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG5cdCAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9LFxuXHQgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcblx0ICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG5cdCAgfSxcblx0ICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuXHQgIH0sXG5cdCAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG5cdCAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG5cdCAgfSxcblx0ICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcblx0ICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcblx0ICB9LFxuXHQgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG5cdCAgfSxcblx0ICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuXHQgIH0sXG5cdCAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG5cdCAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuXHQgIH0sXG5cdCAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuXHQgICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcblx0ICB9LFxuXHQgIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuXHQgICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuXHQgIH0sXG5cdCAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcblx0ICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuXHQgIH0sXG5cdCAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG5cdCAgfSxcblx0ICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG5cdCAgfSxcblx0ICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuXHQgICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcblx0ICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuXHQgICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG5cdCAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG5cdCAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblx0ICBpZiAoaW5kZXggPj0gMCkge1xuXHQgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG5cdCAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcblx0ICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuXHQgICAgICAgIGFycltpXSA9IG9ialtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycjtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBkZWZlcnJlZCgpIHtcblx0ICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcblx0ICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG5cdCAgfSk7XG5cdCAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuXHQgIHJldHVybiBkZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcblx0ICB2YXIgYXJyID0gW107XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHQgICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG5cdCAgfVxuXHQgIHJldHVybiBhcnI7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlbGF5KG1zKSB7XG5cdCAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblx0XG5cdCAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdCAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcblx0ICAgIH0sIG1zKTtcblx0ICB9KTtcblx0XG5cdCAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuXHQgIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgIHJldHVybiBydW5uaW5nO1xuXHQgIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQ7XG5cdCAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgcmV0dXJuIF9lcnJvcjtcblx0ICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcblx0ICAgIHJldHVybiBydW5uaW5nID0gYjtcblx0ICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG5cdCAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcblx0ICAgIHJldHVybiBfZXJyb3IgPSBlO1xuXHQgIH0sIF9yZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGF1dG9JbmMoKSB7XG5cdCAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gKytzZWVkO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cdFxuXHR2YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuXHQgIHRocm93IGVycjtcblx0fTtcblx0dmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG5cdH07XG5cdGZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG5cdCAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblx0XG5cdCAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3I7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gaXRlcmF0b3I7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG5cdCAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuXHQgKiovXG5cdGZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuXHQgIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdFxuXHQgIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG5cdCAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcblx0ICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuXHQgIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG5cdH07XG5cdFxuXHR2YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG5cdCAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcblx0fTtcblx0XG5cdHZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG5cdCAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcblx0fTtcblx0XG5cdHZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBoaXN0b3J5ID0gW107XG5cdCAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcblx0ICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcblx0ICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcblx0ICAgICAgfSxcblx0ICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuXHQgICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcblx0ICAgICAgfSxcblx0ICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuXHQgICAgICB9LFxuXHQgICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuXHQgICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9O1xuXHR9O1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0ZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0ICB9XG5cdH07XG5cdHZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBtYXRjaGVycyA9IHtcblx0ICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuXHQgIH0sXG5cdCAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuXHQgICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcblx0ICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcblx0ICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuXHQgICAgfTtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcblx0ICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcblx0fVxuXHRcblx0LyoqXG5cdCAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3Ncblx0ICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcblx0ICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuXHQgIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcblx0ICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuXHQgIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG5cdCAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cdFxuXHQgIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuXHQgIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcblx0ICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG5cdCAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuXHQgIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuXHQqKi9cblx0ZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuXHQgIHZhciB0YXNrcyA9IFtdLFxuXHQgICAgICByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuXHQgIGFkZFRhc2sobWFpblRhc2spO1xuXHRcblx0ICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcblx0ICAgIGNhbmNlbEFsbCgpO1xuXHQgICAgY2IoZXJyLCB0cnVlKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuXHQgICAgdGFza3MucHVzaCh0YXNrKTtcblx0ICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG5cdCAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICBhYm9ydChyZXMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIGNiKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICB0LmNhbmNlbCgpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrcyA9IFtdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGFkZFRhc2s6IGFkZFRhc2ssXG5cdCAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcblx0ICAgIGFib3J0OiBhYm9ydCxcblx0ICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzO1xuXHQgICAgfSxcblx0ICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgICAgcmV0dXJuIHQubmFtZTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcblx0ICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgZm4gPSBfcmVmLmZuLFxuXHQgICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuXHQgICAgcmV0dXJuIGZuO1xuXHQgIH1cblx0XG5cdCAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgZXJyb3IgPSB2b2lkIDA7XG5cdCAgdHJ5IHtcblx0ICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgZXJyb3IgPSBlcnI7XG5cdCAgfVxuXHRcblx0ICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3Jcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuXHQgIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IGVycm9yO1xuXHQgIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYyA9IHZvaWQgMDtcblx0ICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG5cdCAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgIGlmICghcGMpIHtcblx0ICAgICAgICBwYyA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIGVmZjtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSgpKTtcblx0fVxuXHRcblx0dmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuXHQgIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcblx0ICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfTtcblx0ICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcblx0ICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuXHQgIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXHRcblx0ICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuXHQgIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0ICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG5cdCAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG5cdCAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cdFxuXHQgICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuXHQgICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuXHQgICAgfVxuXHRcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcblx0ICB9O1xuXHQgIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG5cdCAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcblx0ICAvKipcblx0ICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG5cdCAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuXHQgICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuXHQgICoqL1xuXHQgIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgIC8qKlxuXHQgICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuXHQgICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG5cdCAgKiovXG5cdCAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG5cdCAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuXHQgIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cdFxuXHQgIC8qKlxuXHQgICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcblx0ICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG5cdCAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cblx0ICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuXHQgICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG5cdCAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgLyoqXG5cdCAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG5cdCAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcblx0ICAgICoqL1xuXHQgICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuXHQgICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcblx0ICAgICAgKiovXG5cdCAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuXHQgICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cblx0ICAqKi9cblx0ICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cdFxuXHQgIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcblx0ICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblx0XG5cdCAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuXHQgIG5leHQoKTtcblx0XG5cdCAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG5cdCAgcmV0dXJuIHRhc2s7XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuXHQgICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG5cdCAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG5cdCAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3Jvbmdcblx0ICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuXHQgICAgfVxuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuXHQgICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcblx0ICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG5cdCAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbmV4dC5jYW5jZWwoKTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcblx0ICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcblx0ICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcblx0ICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0ICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG5cdCAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG5cdCAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG5cdCAgICBpZiAoIWlzRXJyKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcblx0ICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcblx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGFzay5jb250KSB7XG5cdCAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcblx0ICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcblx0ICAgIH1cblx0ICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG5cdCAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuXHQgICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcblx0ICAgIH0pO1xuXHQgICAgdGFzay5qb2luZXJzID0gbnVsbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG5cdCAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHQgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG5cdCAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG5cdCAgICAqKi9cblx0ICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXHRcblx0ICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG5cdCAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHQgICAgICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG5cdCAgICAgIH1cblx0ICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICB9XG5cdCAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcblx0ICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG5cdCAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuXHQgICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG5cdCAgICAgICoqL1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyKTtcblx0ICAgICAgfVxuXHQgICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdFxuXHQgICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuXHQgICAgfTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuXHQgICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cblx0ICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cblx0ICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuXHQgICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG5cdCAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuXHQgICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG5cdCAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG5cdCAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcblx0ICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3Rcblx0ICAgICoqL1xuXHQgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cdCAgICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3Rcblx0ICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblx0XG5cdCAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcblx0ICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcblx0ICAgICk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuXHQgICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuXHQgICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuXHQgICAgICB9O1xuXHQgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG5cdCAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuXHQgICAgfVxuXHQgICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcblx0ICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG5cdCAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG5cdCAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblx0XG5cdCAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuXHQgICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcblx0ICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuXHQgICAgfTtcblx0ICAgIHRyeSB7XG5cdCAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcblx0ICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG5cdCAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG5cdCAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcblx0ICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG5cdCAgICAqKi9cblx0ICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG5cdCAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG5cdCAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcblx0ICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNC5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblx0XG5cdCAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY1LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXHRcblx0ICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuXHQgICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cdFxuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuXHQgICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuXHQgICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG5cdCAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY2LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuXHQgICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cdFxuXHQgICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuXHQgICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXHRcblx0ICAgICAgaWYgKGRldGFjaGVkKSB7XG5cdCAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IGZpbmFsbHkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcblx0ICAgIH1cblx0ICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuXHQgICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcblx0ICAgICAgfTtcblx0ICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuXHQgICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG5cdCAgICB9XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcblx0ICAgIH1cblx0ICAgIGNiKCk7XG5cdCAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0XG5cdCAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciByZXN1bHRzID0ge307XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcblx0ICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG5cdCAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgdmFyIF9yZXNwb25zZTtcblx0XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuXHQgICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuXHQgICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG5cdCAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcblx0ICAgICAgY2Ioc3RhdGUpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcblx0ICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcblx0ICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcblx0ICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuXHQgICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG5cdCAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG5cdCAgICBjaGFubmVsLmZsdXNoKGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcblx0ICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgY2IoKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG5cdCAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblx0XG5cdCAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuXHQgICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuXHQgICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcblx0ICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG5cdCAgICAgIH1cblx0ICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcblx0ICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG5cdCAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuXHQgICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcblx0ICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG5cdCAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuXHQgICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc2FwID0gYXNhcDtcblx0ZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHR2YXIgcXVldWUgPSBbXTtcblx0LyoqXG5cdCAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuXHQgIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3Rcblx0ICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuXHQgIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG5cdCAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuXHQqKi9cblx0dmFyIHNlbWFwaG9yZSA9IDA7XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG5cdCAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG5cdCAgc3RhdGUpLlxuXHQqKi9cblx0ZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG5cdCAgdHJ5IHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIHRhc2soKTtcblx0ICB9IGZpbmFsbHkge1xuXHQgICAgcmVsZWFzZSgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG5cdCoqL1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICBxdWV1ZS5wdXNoKHRhc2spO1xuXHRcblx0ICBpZiAoIXNlbWFwaG9yZSkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgZmx1c2goKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG5cdCAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuXHQqKi9cblx0ZnVuY3Rpb24gc3VzcGVuZCgpIHtcblx0ICBzZW1hcGhvcmUrKztcblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG5cdCAgc2VtYXBob3JlLS07XG5cdH1cblx0XG5cdC8qKlxuXHQgIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICByZWxlYXNlKCk7XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwO1xuXHQgIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgZXhlYyh0YXNrKTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnRha2UgPSB0YWtlO1xuXHRleHBvcnRzLnB1dCA9IHB1dDtcblx0ZXhwb3J0cy5hbGwgPSBhbGw7XG5cdGV4cG9ydHMucmFjZSA9IHJhY2U7XG5cdGV4cG9ydHMuY2FsbCA9IGNhbGw7XG5cdGV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblx0ZXhwb3J0cy5jcHMgPSBjcHM7XG5cdGV4cG9ydHMuZm9yayA9IGZvcms7XG5cdGV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcblx0ZXhwb3J0cy5qb2luID0gam9pbjtcblx0ZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5cdGV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuXHRleHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuXHRleHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHRleHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuXHRleHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ1KTtcblx0XG5cdHZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG5cdHZhciBUQUtFID0gJ1RBS0UnO1xuXHR2YXIgUFVUID0gJ1BVVCc7XG5cdHZhciBBTEwgPSAnQUxMJztcblx0dmFyIFJBQ0UgPSAnUkFDRSc7XG5cdHZhciBDQUxMID0gJ0NBTEwnO1xuXHR2YXIgQ1BTID0gJ0NQUyc7XG5cdHZhciBGT1JLID0gJ0ZPUksnO1xuXHR2YXIgSk9JTiA9ICdKT0lOJztcblx0dmFyIENBTkNFTCA9ICdDQU5DRUwnO1xuXHR2YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG5cdHZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG5cdHZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcblx0dmFyIEZMVVNIID0gJ0ZMVVNIJztcblx0dmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcblx0dmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblx0XG5cdHZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cdFxuXHR2YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcblx0fTtcblx0XG5cdHZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG5cdCAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gdGFrZSgpIHtcblx0ICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xuXHR9XG5cdFxuXHR0YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHR2YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXHRcblx0ZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgYWN0aW9uID0gY2hhbm5lbDtcblx0ICAgIGNoYW5uZWwgPSBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcblx0fVxuXHRcblx0cHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblx0XG5cdCAgdmFyIGNvbnRleHQgPSBudWxsO1xuXHQgIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG5cdCAgICB2YXIgX2ZuID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuWzBdO1xuXHQgICAgZm4gPSBfZm5bMV07XG5cdCAgfSBlbHNlIGlmIChmbi5mbikge1xuXHQgICAgdmFyIF9mbjIgPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG5cdCAgICBmbiA9IF9mbjIuZm47XG5cdCAgfVxuXHQgIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuXHQgICAgZm4gPSBjb250ZXh0W2ZuXTtcblx0ICB9XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHRcblx0ICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FsbChmbikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuXHQgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3BzKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHQgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmb3JrKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHQgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNwYXduKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuXHQgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGpvaW4oKSB7XG5cdCAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG5cdCAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBqb2luKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuXHQgICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gY2FuY2VsKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuXHQgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcblx0ICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG5cdCAgfVxuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcblx0KiovXG5cdGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcblx0ICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcblx0ICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuXHQgIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcblx0ICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuXHQgICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuXHQgICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHR2YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuXHQgICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcblx0ICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuXHQgIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuXHQgIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuXHQgIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG5cdCAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcblx0ICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcblx0ICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuXHQgIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG5cdCAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG5cdCAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG5cdCAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG5cdCAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG5cdCAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuXHQgIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuXHQgIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTApO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblx0XG5cdHZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTEpO1xuXHRcblx0dmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG5cdCAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG5cdH07XG5cdFxuXHR2YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG5cdHZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcblx0dmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXHRcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0ZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXHR2YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuICdjaGFubmVsJztcblx0ICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdCAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuXHQgICAgfSkpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXHRcblx0ICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG5cdCAgICAgIHFOZXh0ID0gcTA7XG5cdFxuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuXHQgICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG5cdCAgICAgIHJldHVybiBkb25lO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChlcnJvcikge1xuXHQgICAgICBxTmV4dCA9IHFFbmQ7XG5cdCAgICAgIHRocm93IGVycm9yO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblx0XG5cdCAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuXHQgICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG5cdCAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuXHQgICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblx0XG5cdCAgICAgIHFOZXh0ID0gcTtcblx0ICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG5cdCAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuXHQgIH0sIG5hbWUsIHRydWUpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0ZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcblx0ZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcblx0ZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5cdGV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OSk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHR2YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcblx0dmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcblx0ICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBlbWl0dGVyKCkge1xuXHQgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXHRcblx0ICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG5cdCAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuXHQgICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGFycltpXShpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0ICAgIGVtaXQ6IGVtaXRcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xuXHR2YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblx0XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2hhbm5lbCgpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cdFxuXHQgIHZhciBjbG9zZWQgPSBmYWxzZTtcblx0ICB2YXIgdGFrZXJzID0gW107XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXHRcblx0ICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcblx0ICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuXHQgICAgaWYgKGNsb3NlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuXHQgICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcblx0ICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHRha2UoY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihidWZmZXIudGFrZSgpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRha2Vycy5wdXNoKGNiKTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBmbHVzaChjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgaWYgKCFjbG9zZWQpIHtcblx0ICAgICAgY2xvc2VkID0gdHJ1ZTtcblx0ICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuXHQgICAgICAgIHRha2VycyA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICAgIGFycltpXShFTkQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBwdXQ6IHB1dCxcblx0ICAgIGZsdXNoOiBmbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZSxcblx0ICAgIGdldCBfX3Rha2Vyc19fKCkge1xuXHQgICAgICByZXR1cm4gdGFrZXJzO1xuXHQgICAgfSxcblx0ICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuXHQgICAgICByZXR1cm4gY2xvc2VkO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcblx0ICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblx0XG5cdCAgLyoqXG5cdCAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cblx0ICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuXHQgICoqL1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcblx0ICB9XG5cdFxuXHQgIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuXHQgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG5cdCAgICAgICAgdW5zdWJzY3JpYmUoKTtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLmNsb3NlKCk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG5cdCAgICAgIGNsb3NlKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjaGFuLnB1dChpbnB1dCk7XG5cdCAgfSk7XG5cdCAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgdW5zdWJzY3JpYmUoKTtcblx0ICB9XG5cdFxuXHQgIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IGNoYW4udGFrZSxcblx0ICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlXG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcblx0ICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG5cdCAgICAgICAgY2IoaW5wdXQpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG5cdCAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG5cdCAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4udGFrZShjYik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdHZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblx0XG5cdHZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG5cdHZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcblx0dmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcblx0dmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cdFxuXHR2YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXHRcblx0ZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcblx0ICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuXHQgIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG5cdCAgdmFyIGxlbmd0aCA9IDA7XG5cdCAgdmFyIHB1c2hJbmRleCA9IDA7XG5cdCAgdmFyIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG5cdCAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICBsZW5ndGgrKztcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgICBpZiAobGVuZ3RoICE9IDApIHtcblx0ICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcblx0ICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG5cdCAgICAgIGxlbmd0aC0tO1xuXHQgICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgIHJldHVybiBpdDtcblx0ICAgIH1cblx0ICB9O1xuXHRcblx0ICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHZhciBpdGVtcyA9IFtdO1xuXHQgICAgd2hpbGUgKGxlbmd0aCkge1xuXHQgICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlbXM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcblx0ICAgIH0sXG5cdCAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuXHQgICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcblx0ICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuXHQgICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcblx0ICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuXHQgICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXHRcblx0ICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXHRcblx0ICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcblx0ICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgLy8gRFJPUFxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBmbHVzaDogZmx1c2hcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcblx0ICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuXHQgICAgcmV0dXJuIHplcm9CdWZmZXI7XG5cdCAgfSxcblx0ICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG5cdCAgfSxcblx0ICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcblx0ICB9LFxuXHQgIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG5cdCAgfSxcblx0ICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDAsXG5cdCAgICAgIGFjdGlvbiA9IHZvaWQgMDtcblx0ICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuXHQgICAgcmV0dXJuIHRhc2sgPSB0O1xuXHQgIH07XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBjaGFubmVsID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG5cdCAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcblx0ICB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cdFxuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHQgIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9LFxuXHQgICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cdFxuXHRmdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG5cdCAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcblx0ICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0XG5cdCAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuXHQgICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG5cdCAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblx0XG5cdCAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcblx0ICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cdFxuXHQgICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcblx0ICAgICAgY29udGV4dDogY29udGV4dCxcblx0ICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuXHQgICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuXHQgICAgICBvbkVycm9yOiBvbkVycm9yXG5cdCAgICB9KTtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuXHQgICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcblx0ICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG5cdCAgfTtcblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VtO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnB1dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnJhY2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hcHBseTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jcHM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZvcms7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zcGF3bjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uam9pbjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2VsZWN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZsdXNoO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0ZXhwb3J0cy5yZWR1Y2VyID0gcmVkdWNlcjtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3B1bGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1Nik7XG5cdFxuXHR2YXIgX3B1bGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHVsbCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzYpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHQvLyBpbml0aWFsIHN0YXRlXG5cdHZhciBpbml0aWFsU3RhdGUgPSB7XG5cdCAgICBzZWxlY3RBbGw6IHRydWUsXG5cdCAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICBlcnJvcjogbnVsbCxcblx0ICAgIHVzZXJJZDogbnVsbCxcblx0ICAgIGdyb3VwZWRQcm9qZWN0czogW10sXG5cdCAgICBpc1Jlc3RyaWN0ZWQ6IG51bGwsXG5cdFxuXHQgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0czogbnVsbFxuXHR9O1xuXHRcblx0dmFyIHVwZGF0ZVByb2plY3RBY2Nlc3MgPSBmdW5jdGlvbiB1cGRhdGVQcm9qZWN0QWNjZXNzKHByb2plY3RJZCwgZ3JvdXBlZFByb2plY3RzKSB7XG5cdCAgICAvLyBGaW5kIHRoZSBjb3JyZWN0IHByb2plY3QgYW5kIHRvZ2dsZSB0aGUgdGhlIGFjY2VzcyBmaWVsZFxuXHQgICAgZ3JvdXBlZFByb2plY3RzLm1hcChmdW5jdGlvbiAoZ3JvdXApIHtcblx0ICAgICAgICBncm91cC5wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgcHJvamVjdC5pZCA9PT0gcHJvamVjdElkID8gcHJvamVjdC5hY2Nlc3MgPSAhcHJvamVjdC5hY2Nlc3MgOiBudWxsO1xuXHQgICAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gZ3JvdXBlZFByb2plY3RzO1xuXHR9O1xuXHRcblx0dmFyIHVwZGF0ZUFsbFByb2plY3RzQWNjZXNzID0gZnVuY3Rpb24gdXBkYXRlQWxsUHJvamVjdHNBY2Nlc3MoYWNjZXNzLCBncm91cGVkUHJvamVjdHMpIHtcblx0ICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgcHJvamVjdCBhbmQgdG9nZ2xlIHRoZSB0aGUgYWNjZXNzIGZpZWxkXG5cdCAgICBncm91cGVkUHJvamVjdHMubWFwKGZ1bmN0aW9uIChncm91cCkge1xuXHQgICAgICAgIGdyb3VwLnByb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICBwcm9qZWN0LmFjY2VzcyA9IGFjY2Vzcztcblx0ICAgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIGdyb3VwZWRQcm9qZWN0cztcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHJlZHVjZXIoKSB7XG5cdCAgICB2YXIgX3JlZHVjZXJBY3Rpb25zO1xuXHRcblx0ICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuXHQgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICB2YXIgcmVkdWNlckFjdGlvbnMgPSAoX3JlZHVjZXJBY3Rpb25zID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuU0VUX1NUT1JFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBkYXRhID0gYWN0aW9uLmRhdGE7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgZGF0YSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfR0VUX0lOSVQsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgeyBmZXRjaGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfR0VUX1NVQ0NFU1MsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIF9hY3Rpb24kZGF0YSA9IGFjdGlvbi5kYXRhLFxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfYWN0aW9uJGRhdGEudXNlcl9wcm9qZWN0cy5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBncm91cGVkUHJvamVjdHMgPSBfYWN0aW9uJGRhdGEub3JnYW5pc2F0aW9uX2dyb3Vwcztcblx0XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0czogZ3JvdXBlZFByb2plY3RzLFxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZFxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX0dFVF9GQUlMVVJFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICBncm91cGVkUHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfUFVUX0lOSVQsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcblx0ICAgICAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9QVVRfU1VDQ0VTUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgZ3JvdXBlZFByb2plY3RzID0gYWN0aW9uLmRhdGEuZ3JvdXBlZF9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBvcmlnaW5hbElzUmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzOiBncm91cGVkUHJvamVjdHMsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfUFVUX0ZBSUxVUkUsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIG5ld1N0YXRlID0gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcblx0ICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxJc1Jlc3RyaWN0ZWQgIT09IG51bGwpIHtcblx0ICAgICAgICAgICAgbmV3U3RhdGUuaXNSZXN0cmljdGVkID0gc3RhdGUub3JpZ2luYWxJc1Jlc3RyaWN0ZWQ7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbEdyb3VwZWRQcm9qZWN0cyAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICBuZXdTdGF0ZS5ncm91cGVkUHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbEdyb3VwZWRQcm9qZWN0cztcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBwcm9qZWN0SWQgPSBhY3Rpb24uZGF0YS5wcm9qZWN0SWQ7XG5cdFxuXHQgICAgICAgIHZhciBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0cyA9IHN0YXRlLmdyb3VwZWRQcm9qZWN0cyAmJiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHN0YXRlLmdyb3VwZWRQcm9qZWN0cykpO1xuXHQgICAgICAgIHZhciBncm91cGVkUHJvamVjdHMgPSBzdGF0ZS5ncm91cGVkUHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS5ncm91cGVkUHJvamVjdHMpKTtcblx0ICAgICAgICBncm91cGVkUHJvamVjdHMgPSB1cGRhdGVQcm9qZWN0QWNjZXNzKHByb2plY3RJZCwgZ3JvdXBlZFByb2plY3RzKTtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0cywgZ3JvdXBlZFByb2plY3RzOiBncm91cGVkUHJvamVjdHMgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgaXNSZXN0cmljdGVkID0gYWN0aW9uLmRhdGEuaXNSZXN0cmljdGVkO1xuXHRcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBvcmlnaW5hbElzUmVzdHJpY3RlZDogc3RhdGUuaXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgb3JpZ2luYWxHcm91cGVkUHJvamVjdHMgPSBzdGF0ZS5ncm91cGVkUHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS5ncm91cGVkUHJvamVjdHMpKTtcblx0ICAgICAgICB2YXIgZ3JvdXBlZFByb2plY3RzID0gc3RhdGUuZ3JvdXBlZFByb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUuZ3JvdXBlZFByb2plY3RzKSksXG5cdCAgICAgICAgICAgIF9zdGF0ZSA9IF9leHRlbmRzKHt9LCBzdGF0ZSksXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9zdGF0ZS5zZWxlY3RBbGw7XG5cdFxuXHQgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IHVwZGF0ZUFsbFByb2plY3RzQWNjZXNzKHNlbGVjdEFsbCwgZ3JvdXBlZFByb2plY3RzKTtcblx0ICAgICAgICBzZWxlY3RBbGwgPSAhc2VsZWN0QWxsO1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzOiBncm91cGVkUHJvamVjdHNcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfcmVkdWNlckFjdGlvbnMpO1xuXHQgICAgaWYgKHJlZHVjZXJBY3Rpb25zLmhhc093blByb3BlcnR5KGFjdGlvbi50eXBlKSkge1xuXHQgICAgICAgIHJldHVybiByZWR1Y2VyQWN0aW9uc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBzdGF0ZTtcblx0ICAgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlUmVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU3KSxcblx0ICAgIHB1bGxBbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NCk7XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgZ2l2ZW4gdmFsdWVzIGZyb20gYGFycmF5YCB1c2luZ1xuXHQgKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuXHQgKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG5cdCAqXG5cdCAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcblx0ICogdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gYW4gYXJyYXkgYnkgcHJlZGljYXRlLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjAuMFxuXHQgKiBAY2F0ZWdvcnkgQXJyYXlcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHsuLi4qfSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcblx0ICpcblx0ICogXy5wdWxsKGFycmF5LCAnYScsICdjJyk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0dmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gcHVsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KSxcblx0ICAgIG92ZXJSZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTgpLFxuXHQgICAgc2V0VG9TdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MCk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcblx0ICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBhcHBseSA9IF9fd2VicGFja19yZXF1aXJlX18oNzU5KTtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXHRcblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG5cdCAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuXHQgICAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuXHQgICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblx0XG5cdCAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuXHQgICAgfVxuXHQgICAgaW5kZXggPSAtMTtcblx0ICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuXHQgICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuXHQgICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG5cdCAgICB9XG5cdCAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcblx0ICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuXHQgKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG5cdCAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuXHQgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cblx0ICovXG5cdGZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcblx0ICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG5cdCAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG5cdCAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG5cdCAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG5cdCAgfVxuXHQgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VTZXRUb1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzYxKSxcblx0ICAgIHNob3J0T3V0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjMpO1xuXHRcblx0LyoqXG5cdCAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGNvbnN0YW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjIpLFxuXHQgICAgZGVmaW5lUHJvcGVydHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyOCksXG5cdCAgICBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuXHQgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG5cdCAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcblx0ICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG5cdCAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuXHQgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjQuMFxuXHQgKiBAY2F0ZWdvcnkgVXRpbFxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuXHQgKlxuXHQgKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcblx0ICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG5cdCAqXG5cdCAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuXHQgKiAvLyA9PiB0cnVlXG5cdCAqL1xuXHRmdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB2YWx1ZTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xuXHR2YXIgSE9UX0NPVU5UID0gODAwLFxuXHQgICAgSE9UX1NQQU4gPSAxNjtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuXHQgKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcblx0ICogbWlsbGlzZWNvbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuXHQgIHZhciBjb3VudCA9IDAsXG5cdCAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcblx0ICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXHRcblx0ICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcblx0ICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG5cdCAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuXHQgICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNvdW50ID0gMDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VQdWxsQWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjUpO1xuXHRcblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKlxuXHQgKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDQuMC4wXG5cdCAqIEBjYXRlZ29yeSBBcnJheVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG5cdCAqXG5cdCAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0ZnVuY3Rpb24gcHVsbEFsbChhcnJheSwgdmFsdWVzKSB7XG5cdCAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG5cdCAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG5cdCAgICA6IGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXJyYXlNYXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzNCksXG5cdCAgICBiYXNlSW5kZXhPZiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY2KSxcblx0ICAgIGJhc2VJbmRleE9mV2l0aCA9IF9fd2VicGFja19yZXF1aXJlX18oNzcwKSxcblx0ICAgIGJhc2VVbmFyeSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU2KSxcblx0ICAgIGNvcHlBcnJheSA9IF9fd2VicGFja19yZXF1aXJlX18oNzcxKTtcblx0XG5cdC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cblx0dmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cdFxuXHQvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cblx0dmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBbGxCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuXHQgKiBzaG9ydGhhbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG5cdCAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG5cdCAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG5cdCAgICAgIHNlZW4gPSBhcnJheTtcblx0XG5cdCAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcblx0ICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuXHQgIH1cblx0ICBpZiAoaXRlcmF0ZWUpIHtcblx0ICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG5cdCAgfVxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICB2YXIgZnJvbUluZGV4ID0gMCxcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF0sXG5cdCAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXHRcblx0ICAgIHdoaWxlICgoZnJvbUluZGV4ID0gaW5kZXhPZihzZWVuLCBjb21wdXRlZCwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSkgPiAtMSkge1xuXHQgICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcblx0ICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgICB9XG5cdCAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZUZpbmRJbmRleCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY3KSxcblx0ICAgIGJhc2VJc05hTiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY4KSxcblx0ICAgIHN0cmljdEluZGV4T2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OSk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuXHQgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcblx0ICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcblx0ICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcblx0ICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG5cdCAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcblx0ICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblx0XG5cdCAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcblx0ICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuXHQgKiBjb21wYXJpc29ucyBvZiB2YWx1ZXMsIGkuZS4gYD09PWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcblx0ICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuXHQgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuXHQgIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG5cdCAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGlmIChjb21wYXJhdG9yKGFycmF5W2luZGV4XSwgdmFsdWUpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG5cdCAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG5cdCAgdmFyIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cdFxuXHQgIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmdldElzUmVzdHJpY3RlZCA9IGV4cG9ydHMuZ2V0VXNlcklkID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLmZldGNoRGF0YSA9IGZldGNoRGF0YTtcblx0ZXhwb3J0cy5wdXREYXRhID0gcHV0RGF0YTtcblx0ZXhwb3J0cy5nZXRTYWdhID0gZ2V0U2FnYTtcblx0ZXhwb3J0cy5wdXRTYWdhID0gcHV0U2FnYTtcblx0ZXhwb3J0cy53YXRjaGVyU2FnYSA9IHdhdGNoZXJTYWdhO1xuXHRcblx0X193ZWJwYWNrX3JlcXVpcmVfXyg3NzMpO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTMpO1xuXHRcblx0dmFyIF9heGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc0KTtcblx0XG5cdHZhciBfYXhpb3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXhpb3MpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyNCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBfbWFya2VkID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKGdldFNhZ2EpLFxuXHQgICAgX21hcmtlZDIgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsocHV0U2FnYSksXG5cdCAgICBfbWFya2VkMyA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayh3YXRjaGVyU2FnYSk7IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHQvLyBUaGlzIGltcG9ydCBpcyBuZWNlc3NhcnkgdG8gYmUgYWJsZSB0byB0ZXN0IHNhZ2FzLlxuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4LXNhZ2EvcmVkdXgtc2FnYS9pc3N1ZXMvMjgwI2lzc3VlY29tbWVudC0yOTExMzMwMjNcblx0XG5cdFxuXHRmdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG5cdCAgICByZXR1cm4gKDAsIF9heGlvczIuZGVmYXVsdCkoY29uZmlnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHQgICAgICAgIHJldHVybiB7IHJlc3BvbnNlOiByZXNwb25zZSB9O1xuXHQgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yIH07XG5cdCAgICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG5cdCAgICAgICAgdXJsOiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgdXNlcklkICsgXCIvXCJcblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc1Jlc3RyaWN0ZWQsIHByb2plY3RzV2l0aEFjY2Vzcykge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwicGF0Y2hcIixcblx0ICAgICAgICBoZWFkZXJzOiB7XG5cdCAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogKDAsIF91dGlscy5nZXRDb29raWUpKFwiY3NyZnRva2VuXCIpXG5cdCAgICAgICAgfSxcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIixcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHByb2plY3RzOiBwcm9qZWN0c1dpdGhBY2Nlc3Ncblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBfcmVmLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGdldFNhZ2EkKF9jb250ZXh0KSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IGFjdGlvbi5kYXRhLnVzZXJJZDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKGZldGNoRGF0YSwgdXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9jb250ZXh0LnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xuXHR9XG5cdFxuXHR2YXIgZmlsdGVyUHJvamVjdHMgPSBmdW5jdGlvbiBmaWx0ZXJQcm9qZWN0cyhzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLmdyb3VwZWRQcm9qZWN0cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZ3JvdXApIHtcblx0ICAgICAgICByZXR1cm4gYWNjLmNvbmNhdChncm91cC5wcm9qZWN0cy5maWx0ZXIoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuYWNjZXNzO1xuXHQgICAgICAgIH0pLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICByZXR1cm4gcHJvamVjdC5pZDtcblx0ICAgICAgICB9KSk7XG5cdCAgICB9LCBbXSk7XG5cdH07XG5cdFxuXHR2YXIgZ2V0VXNlcklkID0gZXhwb3J0cy5nZXRVc2VySWQgPSBmdW5jdGlvbiBnZXRVc2VySWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VySWQ7XG5cdH07XG5cdHZhciBnZXRJc1Jlc3RyaWN0ZWQgPSBleHBvcnRzLmdldElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIGdldElzUmVzdHJpY3RlZChzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLmlzUmVzdHJpY3RlZDtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHB1dFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBpc1Jlc3RyaWN0ZWQsIHByb2plY3RzV2l0aEFjY2VzcywgX3JlZjIsIHJlc3BvbnNlLCBlcnJvcjtcblx0XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gcHV0U2FnYSQoX2NvbnRleHQyKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0SXNSZXN0cmljdGVkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgaXNSZXN0cmljdGVkID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZmlsdGVyUHJvamVjdHMpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgcHJvamVjdHNXaXRoQWNjZXNzID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKHB1dERhdGEsIHVzZXJJZCwgaXNSZXN0cmljdGVkLCBwcm9qZWN0c1dpdGhBY2Nlc3MpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZjIgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9yZWYyLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZjIuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDE5O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTk6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIxOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yOiBlcnJvciB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDIsIHRoaXMpO1xuXHR9XG5cdFxuXHQvLyB3YXRjaGVyIHNhZ2E6IHdhdGNoZXMgZm9yIGFjdGlvbnMgZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmUsIHN0YXJ0cyB3b3JrZXIgc2FnYVxuXHRmdW5jdGlvbiB3YXRjaGVyU2FnYSgpIHtcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiB3YXRjaGVyU2FnYSQoX2NvbnRleHQzKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDMucHJldiA9IF9jb250ZXh0My5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5BUElfR0VUX0lOSVQsIGdldFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMsIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDg7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9JU19SRVNUUklDVEVELCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkMywgdGhpcyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuXHQgKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXHQgKlxuXHQgKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcblx0ICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuXHQgKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cblx0ICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuXHQgKi9cblx0XG5cdCEoZnVuY3Rpb24oZ2xvYmFsKSB7XG5cdCAgXCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHQgIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG5cdCAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuXHQgIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuXHQgIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG5cdCAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcblx0ICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuXHQgIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cdFxuXHQgIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG5cdCAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuXHQgIGlmIChydW50aW1lKSB7XG5cdCAgICBpZiAoaW5Nb2R1bGUpIHtcblx0ICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuXHQgICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuXHQgICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG5cdCAgICB9XG5cdCAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG5cdCAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHRcblx0ICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcblx0ICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG5cdCAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cdFxuXHQgIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcblx0ICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuXHQgICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG5cdCAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuXHQgICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cdFxuXHQgICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuXHQgICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuXHQgICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXHRcblx0ICAgIHJldHVybiBnZW5lcmF0b3I7XG5cdCAgfVxuXHQgIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cdFxuXHQgIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuXHQgIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuXHQgIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuXHQgIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2Vcblx0ICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG5cdCAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuXHQgIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG5cdCAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG5cdCAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuXHQgIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cblx0ICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcblx0ICAgIHRyeSB7XG5cdCAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcblx0ICAgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcblx0ICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcblx0ICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuXHQgIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cdFxuXHQgIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcblx0ICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG5cdCAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblx0XG5cdCAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG5cdCAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG5cdCAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcblx0ICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblx0XG5cdCAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuXHQgIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG5cdCAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cdCAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0XG5cdCAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuXHQgIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcblx0ICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcblx0ICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG5cdCAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcblx0ICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG5cdCAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG5cdCAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuXHQgIH1cblx0XG5cdCAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cblx0ICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcblx0ICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cblx0ICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXHRcblx0ICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuXHQgIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG5cdCAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuXHQgICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG5cdCAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG5cdCAgICAgIH07XG5cdCAgICB9KTtcblx0ICB9XG5cdFxuXHQgIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuXHQgICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuXHQgICAgcmV0dXJuIGN0b3Jcblx0ICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuXHQgICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cblx0ICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG5cdCAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG5cdCAgICAgIDogZmFsc2U7XG5cdCAgfTtcblx0XG5cdCAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG5cdCAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG5cdCAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcblx0ICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuXHQgICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcblx0ICAgIHJldHVybiBnZW5GdW47XG5cdCAgfTtcblx0XG5cdCAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG5cdCAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3Rcblx0ICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG5cdCAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cblx0ICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG5cdCAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuXHQgICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcblx0ICAgICAgICBpZiAodmFsdWUgJiZcblx0ICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG5cdCAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcblx0ICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cdCAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcblx0ICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG5cdCAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcblx0ICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG5cdCAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuXHQgICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3Rcblx0ICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2Vcblx0ICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cblx0ICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuXHQgICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG5cdCAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuXHQgICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG5cdCAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG5cdCAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG5cdCAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcblx0ICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuXHQgICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuXHQgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgICAgIH0sIHJlamVjdCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXHRcblx0ICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcblx0ICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cblx0ICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG5cdCAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG5cdCAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuXHQgICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG5cdCAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG5cdCAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cblx0ICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG5cdCAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcblx0ICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuXHQgICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG5cdCAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcblx0ICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG5cdCAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG5cdCAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcblx0ICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG5cdCAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG5cdCAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuXHQgICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG5cdCAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cblx0ICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG5cdCAgfVxuXHRcblx0ICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuXHQgIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0ICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXHRcblx0ICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG5cdCAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG5cdCAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG5cdCAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG5cdCAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuXHQgICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuXHQgICAgKTtcblx0XG5cdCAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG5cdCAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG5cdCAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0ICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuXHQgICAgICAgIH0pO1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuXHQgICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG5cdCAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG5cdCAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICB0aHJvdyBhcmc7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuXHQgICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcblx0ICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcblx0ICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cdFxuXHQgICAgICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG5cdCAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG5cdCAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblx0ICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuXHQgICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuXHQgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG5cdCAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3Ncblx0ICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG5cdCAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG5cdCAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cdCAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXHRcblx0ICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cdCAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG5cdCAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG5cdCAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG5cdCAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuXHQgICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG5cdCAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblx0XG5cdCAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuXHQgICAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICByZXR1cm4ge1xuXHQgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcblx0ICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG5cdCAgICAgICAgICB9O1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cdCAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG5cdCAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH1cblx0XG5cdCAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG5cdCAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuXHQgIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuXHQgIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuXHQgIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcblx0ICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG5cdCAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG5cdCAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHRcblx0ICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG5cdCAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG5cdCAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXHRcblx0ICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG5cdCAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuXHQgICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcblx0ICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblx0XG5cdCAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXHRcblx0ICAgIGlmICghIGluZm8pIHtcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGluZm8uZG9uZSkge1xuXHQgICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuXHQgICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuXHQgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblx0XG5cdCAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cblx0ICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblx0XG5cdCAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuXHQgICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG5cdCAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG5cdCAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuXHQgICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuXHQgICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG5cdCAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG5cdCAgICAgIHJldHVybiBpbmZvO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG5cdCAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuXHQgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICB9XG5cdFxuXHQgIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG5cdCAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuXHQgIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cdFxuXHQgIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cdFxuXHQgIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG5cdCAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcblx0ICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuXHQgIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuXHQgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0XG5cdCAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG5cdCAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXHRcblx0ICAgIGlmICgxIGluIGxvY3MpIHtcblx0ICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmICgyIGluIGxvY3MpIHtcblx0ICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG5cdCAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcblx0ICAgIH1cblx0XG5cdCAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG5cdCAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcblx0ICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcblx0ICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuXHQgICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcblx0ICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuXHQgICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuXHQgICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuXHQgICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcblx0ICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcblx0ICAgIHRoaXMucmVzZXQodHJ1ZSk7XG5cdCAgfVxuXHRcblx0ICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcblx0ICAgIHZhciBrZXlzID0gW107XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgIGtleXMucHVzaChrZXkpO1xuXHQgICAgfVxuXHQgICAga2V5cy5yZXZlcnNlKCk7XG5cdFxuXHQgICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcblx0ICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG5cdCAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG5cdCAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG5cdCAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG5cdCAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG5cdCAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuXHQgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbmV4dDtcblx0ICAgIH07XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG5cdCAgICBpZiAoaXRlcmFibGUpIHtcblx0ICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuXHQgICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcblx0ICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuXHQgICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcblx0ICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXHRcblx0ICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgIH07XG5cdFxuXHQgICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuXHQgICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuXHQgIH1cblx0ICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblx0XG5cdCAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcblx0ICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcblx0ICB9XG5cdFxuXHQgIENvbnRleHQucHJvdG90eXBlID0ge1xuXHQgICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cdFxuXHQgICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcblx0ICAgICAgdGhpcy5wcmV2ID0gMDtcblx0ICAgICAgdGhpcy5uZXh0ID0gMDtcblx0ICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3Ncblx0ICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cblx0ICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcblx0ICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG5cdCAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXHRcblx0ICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblx0XG5cdCAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuXHQgICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuXHQgICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcblx0ICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcblx0ICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuXHQgICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcblx0ICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgc3RvcDogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cdFxuXHQgICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuXHQgICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuXHQgICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHRoaXMucnZhbDtcblx0ICAgIH0sXG5cdFxuXHQgICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuXHQgICAgICBpZiAodGhpcy5kb25lKSB7XG5cdCAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG5cdCAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuXHQgICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG5cdCAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXHRcblx0ICAgICAgICBpZiAoY2F1Z2h0KSB7XG5cdCAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuXHQgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cdFxuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG5cdCAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuXHQgICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG5cdCAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuXHQgICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG5cdCAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcblx0ICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblx0XG5cdCAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcblx0ICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcblx0ICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuXHQgICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcblx0ICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcblx0ICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG5cdCAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuXHQgICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuXHQgICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cblx0ICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcblx0ICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuXHQgICAgICByZWNvcmQuYXJnID0gYXJnO1xuXHRcblx0ICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuXHQgICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG5cdCAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG5cdCAgICB9LFxuXHRcblx0ICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcblx0ICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcblx0ICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuXHQgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcblx0ICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuXHQgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfSxcblx0XG5cdCAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuXHQgICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG5cdCAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcblx0ICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuXHQgICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cdCAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcblx0ICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICByZXR1cm4gdGhyb3duO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG5cdCAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuXHQgICAgfSxcblx0XG5cdCAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuXHQgICAgICB0aGlzLmRlbGVnYXRlID0ge1xuXHQgICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuXHQgICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG5cdCAgICAgICAgbmV4dExvYzogbmV4dExvY1xuXHQgICAgICB9O1xuXHRcblx0ICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuXHQgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG5cdCAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuXHQgICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0ICB9O1xuXHR9KShcblx0ICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuXHQgIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cblx0ICAvLyBvZiBpbmRpcmVjdCBldmFsIHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LlxuXHQgIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nyk7XG5cdHZhciBBeGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcblx0ICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcblx0ICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2Vcblx0ICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cdFxuXHQgIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cdFxuXHQgIHJldHVybiBpbnN0YW5jZTtcblx0fVxuXHRcblx0Ly8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5cdHZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblx0XG5cdC8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuXHRheGlvcy5BeGlvcyA9IEF4aW9zO1xuXHRcblx0Ly8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuXHRheGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcblx0ICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG5cdH07XG5cdFxuXHQvLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cblx0YXhpb3MuQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRheGlvcy5DYW5jZWxUb2tlbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzk4KTtcblx0YXhpb3MuaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NCk7XG5cdFxuXHQvLyBFeHBvc2UgYWxsL3NwcmVhZFxuXHRheGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcblx0ICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHR9O1xuXHRheGlvcy5zcHJlYWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXHRcblx0Ly8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5cdG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBiaW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzcpO1xuXHR2YXIgaXNCdWZmZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OCk7XG5cdFxuXHQvKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblx0XG5cdC8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cdFxuXHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcblx0ICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG5cdCAgdmFyIHJlc3VsdDtcblx0ICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG5cdCAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuXHQgIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuXHQgIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuXHQgKi9cblx0ZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0ICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG5cdCAqXG5cdCAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG5cdCAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cblx0ICpcblx0ICogd2ViIHdvcmtlcnM6XG5cdCAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuXHQgKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuXHQgKlxuXHQgKiByZWFjdC1uYXRpdmU6XG5cdCAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgcmV0dXJuIChcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG5cdCAgKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuXHQgKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0ICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcblx0ICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHRcblx0ICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcblx0ICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgb2JqID0gW29ial07XG5cdCAgfVxuXHRcblx0ICBpZiAoaXNBcnJheShvYmopKSB7XG5cdCAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuXHQgICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cblx0ICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG5cdCAqXG5cdCAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG5cdCAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cblx0ICpcblx0ICogRXhhbXBsZTpcblx0ICpcblx0ICogYGBganNcblx0ICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuXHQgKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcblx0ICovXG5cdGZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuXHQgIHZhciByZXN1bHQgPSB7fTtcblx0ICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcblx0ICovXG5cdGZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG5cdCAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBhW2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfSk7XG5cdCAgcmV0dXJuIGE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgIGlzQXJyYXk6IGlzQXJyYXksXG5cdCAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcblx0ICBpc0J1ZmZlcjogaXNCdWZmZXIsXG5cdCAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcblx0ICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG5cdCAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuXHQgIGlzTnVtYmVyOiBpc051bWJlcixcblx0ICBpc09iamVjdDogaXNPYmplY3QsXG5cdCAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuXHQgIGlzRGF0ZTogaXNEYXRlLFxuXHQgIGlzRmlsZTogaXNGaWxlLFxuXHQgIGlzQmxvYjogaXNCbG9iLFxuXHQgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG5cdCAgaXNTdHJlYW06IGlzU3RyZWFtLFxuXHQgIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcblx0ICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG5cdCAgZm9yRWFjaDogZm9yRWFjaCxcblx0ICBtZXJnZTogbWVyZ2UsXG5cdCAgZXh0ZW5kOiBleHRlbmQsXG5cdCAgdHJpbTogdHJpbVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG5cdCAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHQgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiFcblx0ICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuXHQgKlxuXHQgKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuXHQgKiBAbGljZW5zZSAgTUlUXG5cdCAqL1xuXHRcblx0Ly8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuXHQvLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcblx0ICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxuXHR9XG5cdFxuXHQvLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuXHRmdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxuXHR9XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MCk7XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0dmFyIEludGVyY2VwdG9yTWFuYWdlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzkxKTtcblx0dmFyIGRpc3BhdGNoUmVxdWVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkyKTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRmdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuXHQgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcblx0ICB0aGlzLmludGVyY2VwdG9ycyA9IHtcblx0ICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcblx0ICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcblx0ICB9O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuXHQgKi9cblx0QXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcblx0ICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcblx0ICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcblx0ICAgICAgdXJsOiBhcmd1bWVudHNbMF1cblx0ICAgIH0sIGFyZ3VtZW50c1sxXSk7XG5cdCAgfVxuXHRcblx0ICBjb25maWcgPSB1dGlscy5tZXJnZShkZWZhdWx0cywge21ldGhvZDogJ2dldCd9LCB0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXHQgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHQgIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcblx0ICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXHQgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cdFxuXHQgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcblx0ICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG5cdCAgfSk7XG5cdFxuXHQgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcblx0ICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblx0XG5cdC8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybFxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybCxcblx0ICAgICAgZGF0YTogZGF0YVxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHR2YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0XG5cdHZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcblx0ICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuXHQgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG5cdCAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG5cdCAgdmFyIGFkYXB0ZXI7XG5cdCAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Mik7XG5cdCAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Mik7XG5cdCAgfVxuXHQgIHJldHVybiBhZGFwdGVyO1xuXHR9XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdCAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblx0XG5cdCAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuXHQgICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcblx0ICAgICkge1xuXHQgICAgICByZXR1cm4gZGF0YTtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuXHQgICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuXHQgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG5cdCAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHQgICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZGF0YTtcblx0ICB9XSxcblx0XG5cdCAgLyoqXG5cdCAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG5cdCAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cblx0ICAgKi9cblx0ICB0aW1lb3V0OiAwLFxuXHRcblx0ICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuXHQgIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblx0XG5cdCAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cdFxuXHQgIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcblx0ICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcblx0ICB9XG5cdH07XG5cdFxuXHRkZWZhdWx0cy5oZWFkZXJzID0ge1xuXHQgIGNvbW1vbjoge1xuXHQgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG5cdCAgfVxuXHR9O1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xuXHR9KTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xuXHR9KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cdFxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG5cdCAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG5cdCAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG5cdCAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG5cdCAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBzZXR0bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdHZhciBidWlsZFVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzg2KTtcblx0dmFyIHBhcnNlSGVhZGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg3KTtcblx0dmFyIGlzVVJMU2FtZU9yaWdpbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0dmFyIGNyZWF0ZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODQpO1xuXHR2YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IF9fd2VicGFja19yZXF1aXJlX18oNzg5KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcblx0ICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG5cdCAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblx0XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcblx0ICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuXHQgICAgfVxuXHRcblx0ICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdCAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG5cdCAgICB2YXIgeERvbWFpbiA9IGZhbHNlO1xuXHRcblx0ICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG5cdCAgICAvLyBPbmx5IHN1cHBvcnRzIFBPU1QgYW5kIEdFVCBjYWxscyBhbmQgZG9lc24ndCByZXR1cm5zIHRoZSByZXNwb25zZSBoZWFkZXJzLlxuXHQgICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuXHQgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcblx0ICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG5cdCAgICAgIHJlcXVlc3QgPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cdCAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuXHQgICAgICB4RG9tYWluID0gdHJ1ZTtcblx0ICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7fTtcblx0ICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuXHQgICAgaWYgKGNvbmZpZy5hdXRoKSB7XG5cdCAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuXHQgICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcblx0ICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcblx0ICAgIH1cblx0XG5cdCAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXHRcblx0ICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG5cdCAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblx0XG5cdCAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG5cdCAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuXHQgICAgICBpZiAoIXJlcXVlc3QgfHwgKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCAmJiAheERvbWFpbikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuXHQgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuXHQgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuXHQgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG5cdCAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2Vcblx0ICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuXHQgICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHQgICAgICB2YXIgcmVzcG9uc2UgPSB7XG5cdCAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuXHQgICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuXHQgICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiByZXF1ZXN0LnN0YXR1cyxcblx0ICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcblx0ICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG5cdCAgICAgICAgY29uZmlnOiBjb25maWcsXG5cdCAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuXHQgICAgICB9O1xuXHRcblx0ICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuXHQgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG5cdCAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuXHQgICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3Jcblx0ICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgdGltZW91dFxuXHQgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcblx0ICAgICAgICByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuXHQgICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblx0ICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG5cdCAgICAgIHZhciBjb29raWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTApO1xuXHRcblx0ICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG5cdCAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG5cdCAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG5cdCAgICAgICAgICB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICBpZiAoeHNyZlZhbHVlKSB7XG5cdCAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG5cdCAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcblx0ICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuXHQgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuXHQgICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuXHQgICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG5cdCAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpIHtcblx0ICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblx0ICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuXHQgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuXHQgICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG5cdCAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuXHQgICAgICAgICAgdGhyb3cgZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG5cdCAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuXHQgICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG5cdCAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG5cdCAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG5cdCAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuXHQgICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcblx0ICB9KTtcblx0fTtcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NCk7XG5cdFxuXHQvKipcblx0ICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG5cdCAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG5cdCAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcblx0ICAgIHJlc29sdmUocmVzcG9uc2UpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWplY3QoY3JlYXRlRXJyb3IoXG5cdCAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG5cdCAgICAgIHJlc3BvbnNlLmNvbmZpZyxcblx0ICAgICAgbnVsbCxcblx0ICAgICAgcmVzcG9uc2UucmVxdWVzdCxcblx0ICAgICAgcmVzcG9uc2Vcblx0ICAgICkpO1xuXHQgIH1cblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBlbmhhbmNlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdCAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cblx0ICpcblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICBlcnJvci5jb25maWcgPSBjb25maWc7XG5cdCAgaWYgKGNvZGUpIHtcblx0ICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuXHQgIH1cblx0ICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcblx0ICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuXHQgIHJldHVybiBlcnJvcjtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0XG5cdGZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcblx0ICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG5cdCAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG5cdCAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG5cdCAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cblx0ICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cblx0ICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuXHQgICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuXHQgICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIGlmICghcGFyYW1zKSB7XG5cdCAgICByZXR1cm4gdXJsO1xuXHQgIH1cblx0XG5cdCAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG5cdCAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHZhciBwYXJ0cyA9IFtdO1xuXHRcblx0ICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcblx0ICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuXHQgICAgICAgIGtleSA9IGtleSArICdbXSc7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFsID0gW3ZhbF07XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcblx0ICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG5cdCAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcblx0ICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdFxuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG5cdCAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gdXJsO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHRcblx0Ly8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcblx0Ly8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xuXHR2YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG5cdCAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcblx0ICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG5cdCAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuXHQgICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5cdF07XG5cdFxuXHQvKipcblx0ICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuXHQgKlxuXHQgKiBgYGBcblx0ICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcblx0ICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG5cdCAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcblx0ICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcblx0ICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3Rcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICB2YXIgcGFyc2VkID0ge307XG5cdCAgdmFyIGtleTtcblx0ICB2YXIgdmFsO1xuXHQgIHZhciBpO1xuXHRcblx0ICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXHRcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuXHQgICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuXHQgICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcblx0ICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblx0XG5cdCAgICBpZiAoa2V5KSB7XG5cdCAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gcGFyc2VkO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuXHQgIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdCAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdCAgICB2YXIgb3JpZ2luVVJMO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuXHQgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgKi9cblx0ICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG5cdCAgICAgIHZhciBocmVmID0gdXJsO1xuXHRcblx0ICAgICAgaWYgKG1zaWUpIHtcblx0ICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG5cdCAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdCAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHRcblx0ICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuXHQgICAgICByZXR1cm4ge1xuXHQgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG5cdCAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcblx0ICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuXHQgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcblx0ICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcblx0ICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuXHQgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cblx0ICAgICAgICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuXHQgICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHRcblx0ICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3Rcblx0ICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuXHQgICAgKi9cblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuXHQgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuXHQgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG5cdCAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG5cdCAgICB9O1xuXHQgIH0pKCkgOlxuXHRcblx0ICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0Ly8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cdFxuXHR2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXHRcblx0ZnVuY3Rpb24gRSgpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcblx0fVxuXHRFLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcblx0RS5wcm90b3R5cGUuY29kZSA9IDU7XG5cdEUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblx0XG5cdGZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcblx0ICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcblx0ICB2YXIgb3V0cHV0ID0gJyc7XG5cdCAgZm9yIChcblx0ICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG5cdCAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycztcblx0ICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcblx0ICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG5cdCAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG5cdCAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuXHQgICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcblx0ICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuXHQgICkge1xuXHQgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuXHQgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuXHQgICAgICB0aHJvdyBuZXcgRSgpO1xuXHQgICAgfVxuXHQgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG5cdCAgfVxuXHQgIHJldHVybiBvdXRwdXQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gKFxuXHQgIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXHRcblx0ICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcblx0ICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuXHQgICAgICAgIHZhciBjb29raWUgPSBbXTtcblx0ICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG5cdCAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcblx0ICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuXHQgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cblx0ICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG5cdCAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG5cdCAgICB9O1xuXHQgIH0pKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0XG5cdGZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcblx0ICB0aGlzLmhhbmRsZXJzID0gW107XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcblx0ICpcblx0ICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuXHQgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG5cdCAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcblx0ICAgIHJlamVjdGVkOiByZWplY3RlZFxuXHQgIH0pO1xuXHQgIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG5cdH07XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuXHQgIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuXHQgICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuXHQgKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuXHQgKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3Jcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcblx0ICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcblx0ICAgIGlmIChoICE9PSBudWxsKSB7XG5cdCAgICAgIGZuKGgpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciB0cmFuc2Zvcm1EYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTMpO1xuXHR2YXIgaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NCk7XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzgwKTtcblx0dmFyIGlzQWJzb2x1dGVVUkwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NSk7XG5cdHZhciBjb21iaW5lVVJMcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzk2KTtcblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcblx0ICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG5cdCAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuXHQgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuXHQgIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuXHQgICAgY29uZmlnLnVybCA9IGNvbWJpbmVVUkxzKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcblx0ICB9XG5cdFxuXHQgIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG5cdCAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblx0XG5cdCAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuXHQgIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgIGNvbmZpZy5kYXRhLFxuXHQgICAgY29uZmlnLmhlYWRlcnMsXG5cdCAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuXHQgICk7XG5cdFxuXHQgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuXHQgIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG5cdCAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG5cdCAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG5cdCAgKTtcblx0XG5cdCAgdXRpbHMuZm9yRWFjaChcblx0ICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuXHQgICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG5cdCAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuXHQgICAgfVxuXHQgICk7XG5cdFxuXHQgIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblx0XG5cdCAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcblx0ICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXHQgICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgIHJlc3BvbnNlLmRhdGEsXG5cdCAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG5cdCAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgKTtcblx0XG5cdCAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuXHQgICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG5cdCAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG5cdCAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgICAgICk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcblx0ICB9KTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0XG5cdC8qKlxuXHQgKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuXHQgKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuXHQgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG5cdCAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBkYXRhO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuXHQgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuXHQgIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cblx0ICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcblx0ICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cblx0ICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcblx0ICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuXHQgIHJldHVybiByZWxhdGl2ZVVSTFxuXHQgICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcblx0ICAgIDogYmFzZVVSTDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cblx0ICpcblx0ICogQGNsYXNzXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG5cdCAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xuXHR9O1xuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIENhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk3KTtcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcblx0ICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG5cdCAgfVxuXHRcblx0ICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cdCAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcblx0ICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcblx0ICB9KTtcblx0XG5cdCAgdmFyIHRva2VuID0gdGhpcztcblx0ICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuXHQgICAgaWYgKHRva2VuLnJlYXNvbikge1xuXHQgICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHRcblx0ICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG5cdCAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cblx0ICovXG5cdENhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcblx0ICBpZiAodGhpcy5yZWFzb24pIHtcblx0ICAgIHRocm93IHRoaXMucmVhc29uO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG5cdCAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG5cdCAqL1xuXHRDYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG5cdCAgdmFyIGNhbmNlbDtcblx0ICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuXHQgICAgY2FuY2VsID0gYztcblx0ICB9KTtcblx0ICByZXR1cm4ge1xuXHQgICAgdG9rZW46IHRva2VuLFxuXHQgICAgY2FuY2VsOiBjYW5jZWxcblx0ICB9O1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cblx0ICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuXHQgKiAgZi5hcHBseShudWxsLCBhcmdzKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cblx0ICpcblx0ICogIGBgYGpzXG5cdCAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG5cdCAqICBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcblx0ICogQHJldHVybnMge0Z1bmN0aW9ufVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcblx0ICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSlcblxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCIvKlxuIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XG5cbmltcG9ydCBBcHAgZnJvbSBcIi4vY29tcG9uZW50cy9BcHBcIjtcblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSB9IGZyb20gXCJyZWR1eFwiO1xuaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXCJyZWR1eC1zYWdhXCI7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuXG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSBcIi4vcmVkdWNlclwiO1xuaW1wb3J0IHsgd2F0Y2hlclNhZ2EgfSBmcm9tIFwiLi9zYWdhc1wiO1xuXG4vLyBjcmVhdGUgdGhlIHNhZ2EgbWlkZGxld2FyZVxuY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpO1xuXG4vLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuY29uc3QgcmVkdXhEZXZUb29scyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCk7XG5cbmxldCBzdG9yZTtcbmlmIChyZWR1eERldlRvb2xzKSB7XG4gICAgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBjb21wb3NlKGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSksIHJlZHV4RGV2VG9vbHMpKTtcbn0gZWxzZSB7XG4gICAgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKTtcbn1cblxuc2FnYU1pZGRsZXdhcmUucnVuKHdhdGNoZXJTYWdhKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgICAgIDxBcHAgLz5cbiAgICAgICAgPC9Qcm92aWRlcj4sXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclByb2plY3RzXCIpXG4gICAgKTtcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvYXBwLmpzIiwiLypcbiAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IF8sIGRhdGFGcm9tRWxlbWVudCwgaW5BcnJheSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuLi9jb25zdFwiO1xuXG5jb25zdCBJc1Jlc3RyaWN0ZWQgPSAoeyBfLCBpc1Jlc3RyaWN0ZWQsIG9uQ2hhbmdlSXNSZXN0cmljdGVkIH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJpc1Jlc3RyaWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIHsvKiBUaGUgc3RyaW5ncyBpbmNsdWRlIDxzdHJvbmc+IHRhZ3Mgd2hpY2ggcmVxdWlyZXMgdGhlIHVzZSBvZlxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTCAqL31cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgX19odG1sOiBpc1Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB7aXNSZXN0cmljdGVkID8gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVzdHJpY3RlZEluZm9cIlxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IF8oXCJyZXN0cmljdGVkX2luZm9cIikgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn07XG5cbmNvbnN0IFByb2plY3QgPSAoe1xuICAgIF8sXG4gICAgcHJvamVjdCxcbiAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQsXG4gICAgaW5jbHVkZU9yZ0NlbGwsXG4gICAgcm93U3BhbixcbiAgICBvcmdzXG59KSA9PiB7XG4gICAgLy8gTk9URTogdGhlIGNoZWNrZWQgdmFsdWUgaXMgc2V0IHRvIHRydWUgaWYgaXNSZXN0cmljdGVkIGlzIGZhbHNlLiBUaGlzIGlzIHNvIHRoYXQgdGhlIGxpc3Qgb2ZcbiAgICAvLyBwcm9qZWN0cyBsb29rcyBsaWtlIGFsbCBwcm9qZWN0cyBhcmUgc2VsZWN0ZWQgd2hlbiByZXN0cmljdGlvbnMgYXJlIG5vdCBpbiBmb3JjZS5cbiAgICAvLyBUaGlzIGlzIF9ub3RfIHJlZmxlY3RlZCBpbiB0aGUgc3RvcmUuXG4gICAgY29uc3QgdWlTZXR0aW5ncyA9IChwcm9qZWN0LCBpc1Jlc3RyaWN0ZWQpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IHByb2plY3QuYWNjZXNzLFxuICAgICAgICAgICAgZGlzYWJsZWQgPSBpc1Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG4gICAgICAgICAgICBpZENsYXNzTmFtZSA9IGRpc2FibGVkICsgXCIgaWRcIjtcbiAgICAgICAgcmV0dXJuIHsgY2hlY2tlZCwgdHJDbGFzc05hbWUsIGlkQ2xhc3NOYW1lIH07XG4gICAgfTtcbiAgICBjb25zdCB7IGNoZWNrZWQsIHRyQ2xhc3NOYW1lLCBpZENsYXNzTmFtZSB9ID0gdWlTZXR0aW5ncyhwcm9qZWN0LCBpc1Jlc3RyaWN0ZWQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0clxuICAgICAgICAgICAga2V5PXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17dHJDbGFzc05hbWV9XG4gICAgICAgID5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgICAgICByZWFkT25seT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2lkQ2xhc3NOYW1lfT57cHJvamVjdC5pZH08L3RkPlxuICAgICAgICAgICAgPHRkPntwcm9qZWN0LnRpdGxlIHx8IF8oXCJub190aXRsZVwiKX08L3RkPlxuICAgICAgICAgICAgPHRkPntwcm9qZWN0LnN1YnRpdGxlfTwvdGQ+XG4gICAgICAgICAgICB7aW5jbHVkZU9yZ0NlbGwgPyAoXG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImJvcmRlclwiIHJvd1NwYW49e3Jvd1NwYW59PlxuICAgICAgICAgICAgICAgICAgICB7b3Jnc31cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvdHI+XG4gICAgKTtcbn07XG5cbmNvbnN0IFNlbGVjdEFsbCA9ICh7IF8sIHNlbGVjdEFsbCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLCBpc1Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IHVpU2V0dGluZ3MgPSBpc1Jlc3RyaWN0ZWQgPT4ge1xuICAgICAgICBjb25zdCBidXR0b25DbGFzcyA9IFwic2VsZWN0QWxsUHJvamVjdHNcIiArIChpc1Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIiksXG4gICAgICAgICAgICBkaXNhYmxlZCA9ICFpc1Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICBkaXZDbGFzcyA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgICAgIHJldHVybiB7IGJ1dHRvbkNsYXNzLCBkaXNhYmxlZCwgZGl2Q2xhc3MgfTtcbiAgICB9O1xuICAgIGNvbnN0IHsgZGl2Q2xhc3MsIGRpc2FibGVkLCBidXR0b25DbGFzcyB9ID0gdWlTZXR0aW5ncyhpc1Jlc3RyaWN0ZWQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbH0gZGlzYWJsZWQ9e2Rpc2FibGVkfSBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfT5cbiAgICAgICAgICAgICAgICB7c2VsZWN0QWxsID8gXyhcImNoZWNrX2FsbF9wcm9qZWN0c1wiKSA6IF8oXCJ1bmNoZWNrX2FsbF9wcm9qZWN0c1wiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuY29uc3QgRXJyb3IgPSAoeyBfLCBlcnJvciB9KSA9PiB7XG4gICAgcmV0dXJuIGVycm9yID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvclwiPntfKFwiYW5fZXJyb3Jfb2NjdXJlZFwiKSArIGVycm9yLm1lc3NhZ2V9PC9kaXY+IDogbnVsbDtcbn07XG5cbmNvbnN0IFByb2plY3RzID0gKHtcbiAgICBfLFxuICAgIGVycm9yLFxuICAgIGdyb3VwZWRQcm9qZWN0cyxcbiAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgc2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcbiAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxufSkgPT4ge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8RXJyb3IgXz17X30gZXJyb3I9e2Vycm9yfSAvPlxuICAgICAgICAgICAgPElzUmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgaXNSZXN0cmljdGVkPXtpc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTZWxlY3RBbGxcbiAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZD17aXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJhY2Nlc3NcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJwcm9qZWN0X2lkXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwicHJvamVjdF90aXRsZVwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5Qcm9qZWN0IHN1YnRpdGxlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+TWFuYWdpbmcgb3JnYW5pc2F0aW9uczwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtncm91cGVkUHJvamVjdHMubWFwKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd1NwYW4gPSBncm91cC5wcm9qZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9vID0gZ3JvdXAucHJvamVjdHMubWFwKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluY2x1ZGVPcmdDZWxsID0gZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UHJvamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3Byb2plY3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ9e2lzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVPcmdDZWxsPXtpbmNsdWRlT3JnQ2VsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1NwYW49e3Jvd1NwYW59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdzPXtncm91cC5vcmdhbmlzYXRpb25zfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb287XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn07XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZCA9IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlSXNSZXN0cmljdGVkID0gdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsID0gdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuXyA9IHRoaXMuXy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0aW9uIGhhbmRsaW5nXG4gICAgXyhzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnN0cmluZ3MgJiYgdGhpcy5wcm9wcy5zdHJpbmdzW3NdO1xuICAgIH1cblxuICAgIHRvZ2dsZUlzUmVzdHJpY3RlZChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJc1Jlc3RyaWN0ZWQoZS50YXJnZXQuY2hlY2tlZCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJvamVjdFNlbGVjdEFsbChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVTZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcm9qZWN0U2VsZWN0ZWQoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gZGF0YUZyb21FbGVtZW50KFwidXNlci10by1yZXN0cmljdFwiKS5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHVzZXJJZCB9KTtcblxuICAgICAgICBjb25zdCBzdHJpbmdzID0gZGF0YUZyb21FbGVtZW50KFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5ncyB9KTtcblxuICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgc2VsZWN0QWxsLCBncm91cGVkUHJvamVjdHMsIGlzUmVzdHJpY3RlZCwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBncm91cGVkUHJvamVjdHMgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZD17aXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cz17Z3JvdXBlZFByb2plY3RzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkPXt0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17dGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdj57XyhcImxvYWRpbmdcIil9PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdGF0ZSA9PiB7XG4gICAgY29uc3QgeyBmZXRjaGluZywgZXJyb3IsIGdyb3VwZWRQcm9qZWN0cywgaXNSZXN0cmljdGVkLCBzZWxlY3RBbGwsIHN0cmluZ3MgfSA9IHN0YXRlO1xuICAgIHJldHVybiB7IGZldGNoaW5nLCBlcnJvciwgZ3JvdXBlZFByb2plY3RzLCBpc1Jlc3RyaWN0ZWQsIHNlbGVjdEFsbCwgc3RyaW5ncyB9O1xufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIG9uRmV0Y2hVc2VyUHJvamVjdHM6IHVzZXJJZCA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcklkIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBzZXRTdG9yZTogZGF0YSA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuU0VUX1NUT1JFLFxuICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb246IHByb2plY3RJZCA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzUmVzdHJpY3RlZCB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KVxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICAgIG1hcFN0YXRlVG9Qcm9wcyxcbiAgICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoQXBwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbXBvbmVudHMvQXBwLmpzeCIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICB1c2VyX3Byb2plY3RzX2FjY2VzczogaWQgPT4gYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7aWR9Lz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBjb25zdCBpbkFycmF5ID0gKG9iaiwgYXJyKSA9PiBhcnIgJiYgYXJyLmluZGV4T2Yob2JqKSAhPT0gLTE7XG5cbmV4cG9ydCBjb25zdCBkYXRhRnJvbUVsZW1lbnQgPSBlbGVtZW50TmFtZSA9PiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvdXRpbHMuanMiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIGFjdGlvbiB0eXBlc1xuZXhwb3J0IGNvbnN0IC8vXG4gICAgU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcbiAgICAvL1xuICAgIEFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG4gICAgQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcbiAgICBBUElfR0VUX0ZBSUxVUkUgPSBcIkFQSV9HRVRfRkFJTFVSRVwiLFxuICAgIC8vXG4gICAgQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcbiAgICBBUElfUFVUX1NVQ0NFU1MgPSBcIkFQSV9QVVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBcIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTlwiLFxuICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gXCJVUERBVEVfSVNfUkVTVFJJQ1RFRFwiLFxuICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gXCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU1wiO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29uc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXG52YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9ydW5TYWdhJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG4gIH1cbn0pO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9jaGFubmVsJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuRU5EO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZXZlbnRDaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuZXZlbnRDaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLmNoYW5uZWw7XG4gIH1cbn0pO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9idWZmZXJzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG4gIH1cbn0pO1xuXG52YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvc2FnYUhlbHBlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG4gIH1cbn0pO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5kZWxheTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG4gIH1cbn0pO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZGV0YWNoO1xuICB9XG59KTtcblxudmFyIF9taWRkbGV3YXJlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvbWlkZGxld2FyZScpO1xuXG52YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXG52YXIgX2VmZmVjdHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9lZmZlY3RzJyk7XG5cbnZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblxudmFyIF91dGlsczIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuZXhwb3J0cy5lZmZlY3RzID0gZWZmZWN0cztcbmV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDczOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcHJvYycpO1xuXG52YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcbnZhciBOT05fR0VORVJBVE9SX0VSUiA9IFJVTl9TQUdBX1NJR05BVFVSRSArICc6IHNhZ2EgYXJndW1lbnQgbXVzdCBiZSBhIEdlbmVyYXRvciBmdW5jdGlvbiEnO1xuXG5mdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3Ioc3RvcmVJbnRlcmZhY2UpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG4gICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG4gICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9OX0dFTkVSQVRPUl9FUlIpO1xuICB9XG5cbiAgdmFyIF9zdG9yZUludGVyZmFjZSA9IHN0b3JlSW50ZXJmYWNlLFxuICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuICAgICAgZ2V0U3RhdGUgPSBfc3RvcmVJbnRlcmZhY2UuZ2V0U3RhdGUsXG4gICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG4gICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IF9zdG9yZUludGVyZmFjZS5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cblxuICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkID0gc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCB8fCBfdXRpbHMubm9vcDtcblxuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG4gIH1cblxuICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cbiAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuICB9XG5cbiAgcmV0dXJuIHRhc2s7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3J1blNhZ2EuanNcbi8vIG1vZHVsZSBpZCA9IDc0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xuZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbmV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcbmV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuZXhwb3J0cy5jcmVhdGVNb2NrVGFzayA9IGNyZWF0ZU1vY2tUYXNrO1xuZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcbmV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcbnZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuICByZXR1cm4gJ0BAcmVkdXgtc2FnYS8nICsgaWQ7XG59O1xuXG52YXIgVEFTSyA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlRBU0sgPSBzeW0oJ1RBU0snKTtcbnZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xudmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG52YXIgQ0FOQ0VMID0gLyojX19QVVJFX18qL2V4cG9ydHMuQ0FOQ0VMID0gc3ltKCdDQU5DRUxfUFJPTUlTRScpO1xudmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG52YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcbnZhciBrb25zdCA9IGV4cG9ydHMua29uc3QgPSBmdW5jdGlvbiBrb25zdCh2KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xudmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcbnZhciBrRmFsc2UgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rRmFsc2UgPSBrb25zdChmYWxzZSk7XG52YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcbnZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG4gIHJldHVybiB2O1xufTtcblxuZnVuY3Rpb24gY2hlY2sodmFsdWUsIHByZWRpY2F0ZSwgZXJyb3IpIHtcbiAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gaXMubm90VW5kZWYob2JqZWN0KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG52YXIgaXMgPSBleHBvcnRzLmlzID0ge1xuICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcbiAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG4gIH0sXG4gIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG4gIH0sXG4gIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuICB9LFxuICBhcnJheTogQXJyYXkuaXNBcnJheSxcbiAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiAhaXMuYXJyYXkob2JqKSAmJiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKSkgPT09ICdvYmplY3QnO1xuICB9LFxuICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcbiAgICByZXR1cm4gcCAmJiBpcy5mdW5jKHAudGhlbik7XG4gIH0sXG4gIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKGl0Lm5leHQpICYmIGlzLmZ1bmMoaXQudGhyb3cpO1xuICB9LFxuICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhTeW1ib2wpID8gaXMuZnVuYyhpdFtTeW1ib2wuaXRlcmF0b3JdKSA6IGlzLmFycmF5KGl0KTtcbiAgfSxcbiAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG4gICAgcmV0dXJuIHQgJiYgdFtUQVNLXTtcbiAgfSxcbiAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuICAgIHJldHVybiBvYiAmJiBpcy5mdW5jKG9iLnN1YnNjcmliZSk7XG4gIH0sXG4gIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuICAgIHJldHVybiBidWYgJiYgaXMuZnVuYyhidWYuaXNFbXB0eSkgJiYgaXMuZnVuYyhidWYudGFrZSkgJiYgaXMuZnVuYyhidWYucHV0KTtcbiAgfSxcbiAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcbiAgICByZXR1cm4gcGF0ICYmIChpcy5zdHJpbmcocGF0KSB8fCAodHlwZW9mIHBhdCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0KSkgPT09ICdzeW1ib2wnIHx8IGlzLmZ1bmMocGF0KSB8fCBpcy5hcnJheShwYXQpKTtcbiAgfSxcbiAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaCAmJiBpcy5mdW5jKGNoLnRha2UpICYmIGlzLmZ1bmMoY2guY2xvc2UpO1xuICB9LFxuICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpdFtIRUxQRVJdO1xuICB9LFxuICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuICAgIHJldHVybiBpcy5mdW5jKGYpICYmIGhhc093bihmLCAndG9TdHJpbmcnKTtcbiAgfVxufTtcblxudmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufVxuXG52YXIgYXJyYXkgPSBleHBvcnRzLmFycmF5ID0ge1xuICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG4gICAgICAgIGFycltpXSA9IG9ialtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG4gIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIGRlZiA9IF9leHRlbmRzKHt9LCBwcm9wcyk7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBkZWYucmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbiAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBhcnJheU9mRGVmZmVyZWQobGVuZ3RoKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGRlZmVycmVkKCkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gIHZhciB2YWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cbiAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcbiAgICB9LCBtcyk7XG4gIH0pO1xuXG4gIHByb21pc2VbQ0FOQ0VMXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gIH07XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuICB2YXIgX3JlZjtcblxuICB2YXIgcnVubmluZyA9IHRydWU7XG4gIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgX2Vycm9yID0gdm9pZCAwO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICByZXR1cm4gcnVubmluZztcbiAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG4gICAgcmV0dXJuIF9yZXN1bHQ7XG4gIH0sIF9yZWYuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICByZXR1cm4gX2Vycm9yO1xuICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcbiAgICByZXR1cm4gcnVubmluZyA9IGI7XG4gIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcbiAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG4gIH0sIF9yZWYuc2V0RXJyb3IgPSBmdW5jdGlvbiBzZXRFcnJvcihlKSB7XG4gICAgcmV0dXJuIF9lcnJvciA9IGU7XG4gIH0sIF9yZWY7XG59XG5cbmZ1bmN0aW9uIGF1dG9JbmMoKSB7XG4gIHZhciBzZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICsrc2VlZDtcbiAgfTtcbn1cblxudmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblxudmFyIGtUaHJvdyA9IGZ1bmN0aW9uIGtUaHJvdyhlcnIpIHtcbiAgdGhyb3cgZXJyO1xufTtcbnZhciBrUmV0dXJuID0gZnVuY3Rpb24ga1JldHVybih2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcbn07XG5mdW5jdGlvbiBtYWtlSXRlcmF0b3IobmV4dCkge1xuICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gIHZhciBpc0hlbHBlciA9IGFyZ3VtZW50c1szXTtcblxuICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblxuICBpZiAoaXNIZWxwZXIpIHtcbiAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG4vKipcbiAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG4gICh0ZXh0LW9ubHkgbG9nIG91dHB1dClcbiAqKi9cbmZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlW2xldmVsXShtZXNzYWdlLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGxvZygnd2FybicsIGRlcHJlY2F0aW9uV2FybmluZyk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuICByZXR1cm4gZGVwcmVjYXRlZCArICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgcHJlZmVycmVkICsgJywgcGxlYXNlIHVwZGF0ZSB5b3VyIGNvZGUnO1xufTtcblxudmFyIGludGVybmFsRXJyID0gZXhwb3J0cy5pbnRlcm5hbEVyciA9IGZ1bmN0aW9uIGludGVybmFsRXJyKGVycikge1xuICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xufTtcblxudmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcbiAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcbn07XG5cbnZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG4gIH07XG59O1xuXG52YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBoaXN0b3J5ID0gW107XG4gICAgdmFyIGdlbiA9IGdlbmVyYXRvckZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcbiAgICAgICAgaGlzdG9yeS5wdXNoKGFyZyk7XG4gICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuICAgICAgfSxcbiAgICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHJldHVybiBjbG9uZWRHZW4ubmV4dChhcmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcbiAgICAgIH0sXG4gICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9idWZmZXJzJyk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhvYmosIGRlc2NzKSB7IGZvciAodmFyIGtleSBpbiBkZXNjcykgeyB2YXIgZGVzYyA9IGRlc2NzW2tleV07IGRlc2MuY29uZmlndXJhYmxlID0gZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBkZXNjKTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cbnZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG4gIH1cbn07XG52YXIgVEFTS19DQU5DRUwgPSBleHBvcnRzLlRBU0tfQ0FOQ0VMID0ge1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuICB9XG59O1xuXG52YXIgbWF0Y2hlcnMgPSB7XG4gIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuICB9LFxuICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IHBhdHRlcm47XG4gICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcbiAgICB9O1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICBwcmVkaWNhdGU6IGZ1bmN0aW9uIHByZWRpY2F0ZShfcHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgcmV0dXJuIChwYXR0ZXJuID09PSAnKicgPyBtYXRjaGVycy53aWxkY2FyZCA6IF91dGlscy5pcy5hcnJheShwYXR0ZXJuKSA/IG1hdGNoZXJzLmFycmF5IDogX3V0aWxzLmlzLnN0cmluZ2FibGVGdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMuZGVmYXVsdCA6IF91dGlscy5pcy5mdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMucHJlZGljYXRlIDogbWF0Y2hlcnMuZGVmYXVsdCkocGF0dGVybik7XG59XG5cbi8qKlxuICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcbiAgV2UgbW9kZWwgdGhpcyB1c2luZyB0aGUgY29uY2VwdCBvZiBQYXJlbnQgdGFzayAmJiBtYWluIFRhc2tcbiAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuICBUaHVzIHRoZSB3aG9sZSBtb2RlbCByZXByZXNlbnRzIGFuIGV4ZWN1dGlvbiB0cmVlIHdpdGggbXVsdGlwbGUgYnJhbmNoZXMgKHZzIHRoZVxuICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblxuICBBIHBhcmVudCB0YXNrcyBoYXMgdGhlIGZvbGxvd2luZyBzZW1hbnRpY3NcbiAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG4gIC0gSXQgYWJvcnRzIGlmIGFueSB1bmNhdWdodCBlcnJvciBidWJibGVzIHVwIGZyb20gZm9ya3NcbiAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG4qKi9cbmZ1bmN0aW9uIGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgY2IpIHtcbiAgdmFyIHRhc2tzID0gW10sXG4gICAgICByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgYWRkVGFzayhtYWluVGFzayk7XG5cbiAgZnVuY3Rpb24gYWJvcnQoZXJyKSB7XG4gICAgY2FuY2VsQWxsKCk7XG4gICAgY2IoZXJyLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuICAgIHRhc2tzLnB1c2godGFzayk7XG4gICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAoMCwgX3V0aWxzLnJlbW92ZSkodGFza3MsIHRhc2spO1xuICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgYWJvcnQocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuICAgICAgICAgIHJlc3VsdCA9IHJlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG4gICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuICAgICAgdC5jYW5jZWwoKTtcbiAgICB9KTtcbiAgICB0YXNrcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRUYXNrOiBhZGRUYXNrLFxuICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuICAgIGFib3J0OiBhYm9ydCxcbiAgICBnZXRUYXNrczogZnVuY3Rpb24gZ2V0VGFza3MoKSB7XG4gICAgICByZXR1cm4gdGFza3M7XG4gICAgfSxcbiAgICB0YXNrTmFtZXM6IGZ1bmN0aW9uIHRhc2tOYW1lcygpIHtcbiAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQubmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcbiAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBmbiA9IF9yZWYuZm4sXG4gICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG4gIHZhciByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBlcnJvciA9IHZvaWQgMDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IgPSBlcnI7XG4gIH1cblxuICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3JcbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG4gIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG4gIHJldHVybiBlcnJvciA/ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGMgPSB2b2lkIDA7XG4gICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcbiAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICBpZiAoIXBjKSB7XG4gICAgICAgIHBjID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXQoYXJnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KCkpO1xufVxuXG52YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG4gIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcbn07XG5cbmZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcbiAgdmFyIHN1YnNjcmliZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfTtcbiAgdmFyIGRpc3BhdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBfdXRpbHMubm9vcDtcbiAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcbiAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDoge307XG4gIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuICB2YXIgY29udCA9IGFyZ3VtZW50c1s4XTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXG4gIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG4gIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cbiAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblxuICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG4gIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKGVycikge1xuICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblxuICAgIGlmICghbWVzc2FnZSAmJiBlcnIuc3RhY2spIHtcbiAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuICB9O1xuICB2YXIgc3RkQ2hhbm5lbCA9ICgwLCBfY2hhbm5lbC5zdGRDaGFubmVsKShzdWJzY3JpYmUpO1xuICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuICAvKipcbiAgICBUcmFja3MgdGhlIGN1cnJlbnQgZWZmZWN0IGNhbmNlbGxhdGlvblxuICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG4gICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuICAqKi9cbiAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAvKipcbiAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG4gICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG4gICoqL1xuICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcbiAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuICB2YXIgdGFza1F1ZXVlID0gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBlbmQpO1xuXG4gIC8qKlxuICAgIGNhbmNlbGxhdGlvbiBvZiB0aGUgbWFpbiB0YXNrLiBXZSdsbCBzaW1wbHkgcmVzdW1lIHRoZSBHZW5lcmF0b3Igd2l0aCBhIENhbmNlbFxuICAqKi9cbiAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcbiAgICBpZiAobWFpblRhc2suaXNSdW5uaW5nICYmICFtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cbiAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgQ2FuY2VsbGF0aW9uIHByb3BhZ2F0ZXMgZG93biB0byB0aGUgd2hvbGUgZXhlY3V0aW9uIHRyZWUgaG9sZGVkIGJ5IHRoaXMgUGFyZW50IHRhc2tcbiAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcbiAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgLyoqXG4gICAgICBXZSBuZWVkIHRvIGNoZWNrIGJvdGggUnVubmluZyBhbmQgQ2FuY2VsbGVkIHN0YXR1c1xuICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuICAgICoqL1xuICAgIGlmIChpdGVyYXRvci5faXNSdW5uaW5nICYmICFpdGVyYXRvci5faXNDYW5jZWxsZWQpIHtcbiAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG4gICAgICAvKipcbiAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuICAgICAgKiovXG4gICAgICBlbmQoVEFTS19DQU5DRUwpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG4gICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cbiAgKiovXG4gIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblxuICAvLyB0cmFja3MgdGhlIHJ1bm5pbmcgc3RhdHVzXG4gIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXG4gIC8vIGtpY2tzIHVwIHRoZSBnZW5lcmF0b3JcbiAgbmV4dCgpO1xuXG4gIC8vIHRoZW4gcmV0dXJuIHRoZSB0YXNrIGRlc2NyaXB0b3IgdG8gdGhlIGNhbGxlclxuICByZXR1cm4gdGFzaztcblxuICAvKipcbiAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG4gICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG4gICAgdW50aWwgdGhlIGdlbmVyYXRvciB0ZXJtaW5hdGVzIG9yIHRocm93c1xuICAqKi9cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG4gICAgLy8gUHJldmVudGl2ZSBtZWFzdXJlLiBJZiB3ZSBlbmQgdXAgaGVyZSwgdGhlbiB0aGVyZSBpcyByZWFsbHkgc29tZXRoaW5nIHdyb25nXG4gICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuICAgICAgICAgIFdlIGNhbiBnZXQgdGhpcyB2YWx1ZSBoZXJlXG4gICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcbiAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICBDYW5jZWxzIHRoZSBjdXJyZW50IGVmZmVjdDsgdGhpcyB3aWxsIHByb3BhZ2F0ZSB0aGUgY2FuY2VsbGF0aW9uIGRvd24gdG8gYW55IGNhbGxlZCB0YXNrc1xuICAgICAgICAqKi9cbiAgICAgICAgbmV4dC5jYW5jZWwoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICoqL1xuICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcbiAgICAgICAgLy8gV2UgZ2V0IENIQU5ORUxfRU5EIGJ5IHRha2luZyBmcm9tIGEgY2hhbm5lbCB0aGF0IGVuZGVkIHVzaW5nIGB0YWtlYCAoYW5kIG5vdCBgdGFrZW1gIHVzZWQgdG8gdHJhcCBFbmQgb2YgY2hhbm5lbHMpXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dChhcmcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcbiAgICAgICAgKiovXG4gICAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG4gICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmQocmVzdWx0LCBpc0Vycikge1xuICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG4gICAgaWYgKCFpc0Vycikge1xuICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcbiAgICAgICAgICB2YWx1ZTogJ2F0ICcgKyBuYW1lICsgJyBcXG4gJyArIChyZXN1bHQuc2FnYVN0YWNrIHx8IHJlc3VsdC5zdGFjayksXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2lzQWJvcnRlZCA9IHRydWU7XG4gICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuICAgIH1cbiAgICB0YXNrLmNvbnQgJiYgdGFzay5jb250KHJlc3VsdCwgaXNFcnIpO1xuICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcbiAgICB9KTtcbiAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcbiAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuICAgIHZhciBjYiA9IGFyZ3VtZW50c1szXTtcblxuICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcGFyZW50RWZmZWN0SWQ6IHBhcmVudEVmZmVjdElkLCBsYWJlbDogbGFiZWwsIGVmZmVjdDogZWZmZWN0IH0pO1xuXG4gICAgLyoqXG4gICAgICBjb21wbGV0aW9uIGNhbGxiYWNrIGFuZCBjYW5jZWwgY2FsbGJhY2sgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG4gICAgKiovXG4gICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cbiAgICAvLyBDb21wbGV0aW9uIGNhbGxiYWNrIHBhc3NlZCB0byB0aGUgYXBwcm9wcmlhdGUgZWZmZWN0IHJ1bm5lclxuICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG4gICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG4gICAgICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAgICAgaXNFcnIgPyBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZChlZmZlY3RJZCwgcmVzKSA6IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCByZXMpO1xuICAgICAgfVxuICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgfVxuICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcHJldmVudHMgY2FuY2VsbGluZyBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3RcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICAvKipcbiAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcbiAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuICAgICAgICBjYWxsYmFjaywgbG9nIGVycm9ycyByYWlzZWQgZHVyaW5nIGNhbmNlbGxhdGlvbnMgaW50byB0aGUgY29uc29sZVxuICAgICAgKiovXG4gICAgICB0cnkge1xuICAgICAgICBjdXJyQ2IuY2FuY2VsKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblxuICAgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkKGVmZmVjdElkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cbiAgICAgICBBVFRFTlRJT04hIGVmZmVjdCBydW5uZXJzIG11c3Qgc2V0dXAgdGhlIGNhbmNlbCBsb2dpYyBieSBzZXR0aW5nIGNiLmNhbmNlbCA9IFtjYW5jZWxNZXRob2RdXG4gICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG4gICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG4gICAgICBmb3IgY29tcGxldGluZyB0aGUgZmxvdyBieSBjYWxsaW5nIHRoZSBwcm92aWRlZCBjb250aW51YXRpb247IHdoaWxlIGNhbGxlciBmdW5jdGlvbnNcbiAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cbiAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG4gICAgICBwcm9taXNlW0NBTkNFTF0gbWV0aG9kIGluIHRoZWlyIHJldHVybmVkIHByb21pc2VzXG4gICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuICAgICoqL1xuICAgIHZhciBkYXRhID0gdm9pZCAwO1xuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiAoXG4gICAgICAvLyBOb24gZGVjbGFyYXRpdmUgZWZmZWN0XG4gICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXG4gICAgICAvLyBkZWNsYXJhdGl2ZSBlZmZlY3RzXG4gICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuICAgIHZhciBjYW5jZWxQcm9taXNlID0gcHJvbWlzZVtfdXRpbHMuQ0FOQ0VMXTtcbiAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcbiAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG4gICAgfSBlbHNlIGlmIChfdXRpbHMuaXMuZnVuYyhwcm9taXNlLmFib3J0KSkge1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cbiAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuICAgIH1cbiAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJdGVyYXRvcihpdGVyYXRvciwgZWZmZWN0SWQsIG5hbWUsIGNiKSB7XG4gICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG4gICAgICAgIHBhdHRlcm4gPSBfcmVmMi5wYXR0ZXJuLFxuICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXG4gICAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgc3RkQ2hhbm5lbDtcbiAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG4gICAgfVxuICAgIGNiLmNhbmNlbCA9IHRha2VDYi5jYW5jZWw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5QdXRFZmZlY3QoX3JlZjMsIGNiKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlO1xuXG4gICAgLyoqXG4gICAgICBTY2hlZHVsZSB0aGUgcHV0IGluIGNhc2UgYW5vdGhlciBzYWdhIGlzIGhvbGRpbmcgYSBsb2NrLlxuICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG4gICAgKiovXG4gICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBjaGFubmVsIG9yIGBwdXQucmVzb2x2ZWAgd2FzIHVzZWQgdGhlbiBidWJibGUgdXAgdGhlIGVycm9yLlxuICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNC5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY0LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblxuICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY1LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjUuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXG4gICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG4gICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgdmFyIGNwc0NiID0gZnVuY3Rpb24gY3BzQ2IoZXJyLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG4gICAgICB9O1xuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoY3BzQ2IpKTtcbiAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcbiAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjcHNDYi5jYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY2LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjYuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuICAgICAgICBkZXRhY2hlZCA9IF9yZWY2LmRldGFjaGVkO1xuXG4gICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblxuICAgIHRyeSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuICAgICAgdmFyIF90YXNrID0gcHJvYyh0YXNrSXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIGZuLm5hbWUsIGRldGFjaGVkID8gbnVsbCA6IF91dGlscy5ub29wKTtcblxuICAgICAgaWYgKGRldGFjaGVkKSB7XG4gICAgICAgIGNiKF90YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hZGRUYXNrKF90YXNrKTtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hYm9ydCh0YXNrSXRlcmF0b3IuX2Vycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgKDAsIF9zY2hlZHVsZXIuZmx1c2gpKCk7XG4gICAgfVxuICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuICAgIGlmICh0LmlzUnVubmluZygpKSB7XG4gICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0LmpvaW5lcnMsIGpvaW5lcik7XG4gICAgICB9O1xuICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuICAgIGlmICh0YXNrVG9DYW5jZWwgPT09IF91dGlscy5TRUxGX0NBTkNFTExBVElPTikge1xuICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcbiAgICB9XG4gICAgaWYgKHRhc2tUb0NhbmNlbC5pc1J1bm5pbmcoKSkge1xuICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuICAgIH1cbiAgICBjYigpO1xuICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblxuICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgaXNFcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcbiAgICAgICAgICBjb21wbGV0ZWRDb3VudCsrO1xuICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG4gICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuICAgIH0pO1xuXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Vycikge1xuICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjYihyZXMsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgdmFyIF9yZXNwb25zZTtcblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gKF9yZXNwb25zZSA9IHt9LCBfcmVzcG9uc2Vba2V5XSA9IHJlcywgX3Jlc3BvbnNlKTtcbiAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyB1bm5lY2Vzc2FyeSBjYW5jZWxsYXRpb25cbiAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG4gICAgICAgIGFyZ3MgPSBfcmVmNy5hcmdzO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdGF0ZSA9IHNlbGVjdG9yLmFwcGx5KHVuZGVmaW5lZCwgW2dldFN0YXRlKCldLmNvbmNhdChhcmdzKSk7XG4gICAgICBjYihzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcbiAgICAgICAgYnVmZmVyID0gX3JlZjguYnVmZmVyO1xuXG4gICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcbiAgICBtYXRjaC5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcbiAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG4gICAgY2hhbm5lbC5mbHVzaChjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5HZXRDb250ZXh0RWZmZWN0KHByb3AsIGNiKSB7XG4gICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcbiAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIGNiKCk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdUYXNrKGlkLCBuYW1lLCBpdGVyYXRvciwgY29udCkge1xuICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXG4gICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gbnVsbDtcbiAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuICAgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBkZWY7XG4gICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9LCBfcmVmOS5jb250ID0gY29udCwgX3JlZjkuam9pbmVycyA9IFtdLCBfcmVmOS5jYW5jZWwgPSBjYW5jZWwsIF9yZWY5LmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQ2FuY2VsbGVkO1xuICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuICAgIH0sIF9yZWY5LnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2Vycm9yO1xuICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG4gICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuICAgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcbiAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcHJvYy5qc1xuLy8gbW9kdWxlIGlkID0gNzQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc2FwID0gYXNhcDtcbmV4cG9ydHMuc3VzcGVuZCA9IHN1c3BlbmQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG52YXIgcXVldWUgPSBbXTtcbi8qKlxuICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG4gIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3RcbiAgICBhbHJlYWR5IHN1c3BlbmRlZClcbiAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcbiAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuKiovXG52YXIgc2VtYXBob3JlID0gMDtcblxuLyoqXG4gIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcbiAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG4gIHN0YXRlKS5cbioqL1xuZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG4gIHRyeSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIHRhc2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gIEV4ZWN1dGVzIG9yIHF1ZXVlcyBhIHRhc2sgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiB0aGUgc2NoZWR1bGVyIChgc3VzcGVuZGVkYCBvciBgcmVsZWFzZWRgKVxuKiovXG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgcXVldWUucHVzaCh0YXNrKTtcblxuICBpZiAoIXNlbWFwaG9yZSkge1xuICAgIHN1c3BlbmQoKTtcbiAgICBmbHVzaCgpO1xuICB9XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZS4gU2NoZWR1bGVkIHRhc2tzIHdpbGwgYmUgcXVldWVkIHVudGlsIHRoZVxuICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG4qKi9cbmZ1bmN0aW9uIHN1c3BlbmQoKSB7XG4gIHNlbWFwaG9yZSsrO1xufVxuXG4vKipcbiAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cbioqL1xuZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgc2VtYXBob3JlLS07XG59XG5cbi8qKlxuICBSZWxlYXNlcyB0aGUgY3VycmVudCBsb2NrLiBFeGVjdXRlcyBhbGwgcXVldWVkIHRhc2tzIGlmIHRoZSBzY2hlZHVsZXIgaXMgaW4gdGhlIHJlbGVhc2VkIHN0YXRlLlxuKiovXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgcmVsZWFzZSgpO1xuXG4gIHZhciB0YXNrID0gdm9pZCAwO1xuICB3aGlsZSAoIXNlbWFwaG9yZSAmJiAodGFzayA9IHF1ZXVlLnNoaWZ0KCkpICE9PSB1bmRlZmluZWQpIHtcbiAgICBleGVjKHRhc2spO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NjaGVkdWxlci5qc1xuLy8gbW9kdWxlIGlkID0gNzQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5leHBvcnRzLnRha2UgPSB0YWtlO1xuZXhwb3J0cy5wdXQgPSBwdXQ7XG5leHBvcnRzLmFsbCA9IGFsbDtcbmV4cG9ydHMucmFjZSA9IHJhY2U7XG5leHBvcnRzLmNhbGwgPSBjYWxsO1xuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuZXhwb3J0cy5jcHMgPSBjcHM7XG5leHBvcnRzLmZvcmsgPSBmb3JrO1xuZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuZXhwb3J0cy5qb2luID0gam9pbjtcbmV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5leHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuZXhwb3J0cy5jYW5jZWxsZWQgPSBjYW5jZWxsZWQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG5leHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuZXhwb3J0cy5zZXRDb250ZXh0ID0gc2V0Q29udGV4dDtcbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zYWdhSGVscGVycycpO1xuXG52YXIgSU8gPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5zeW0pKCdJTycpO1xudmFyIFRBS0UgPSAnVEFLRSc7XG52YXIgUFVUID0gJ1BVVCc7XG52YXIgQUxMID0gJ0FMTCc7XG52YXIgUkFDRSA9ICdSQUNFJztcbnZhciBDQUxMID0gJ0NBTEwnO1xudmFyIENQUyA9ICdDUFMnO1xudmFyIEZPUksgPSAnRk9SSyc7XG52YXIgSk9JTiA9ICdKT0lOJztcbnZhciBDQU5DRUwgPSAnQ0FOQ0VMJztcbnZhciBTRUxFQ1QgPSAnU0VMRUNUJztcbnZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG52YXIgQ0FOQ0VMTEVEID0gJ0NBTkNFTExFRCc7XG52YXIgRkxVU0ggPSAnRkxVU0gnO1xudmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcbnZhciBTRVRfQ09OVEVYVCA9ICdTRVRfQ09OVEVYVCc7XG5cbnZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cbnZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xufTtcblxudmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG4gIGVmZltGT1JLXS5kZXRhY2hlZCA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5mdW5jdGlvbiB0YWtlKCkge1xuICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICB9XG4gIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG59XG5cbnRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbnZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cbmZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCBhIHZhbGlkIGNoYW5uZWwnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgICBhY3Rpb24gPSBjaGFubmVsO1xuICAgIGNoYW5uZWwgPSBudWxsO1xuICB9XG4gIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xufVxuXG5wdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIGVmZltQVVRdLnJlc29sdmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxucHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblxuZnVuY3Rpb24gYWxsKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuICBpZiAoX3V0aWxzLmlzLmFycmF5KGZuKSkge1xuICAgIHZhciBfZm4gPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuWzBdO1xuICAgIGZuID0gX2ZuWzFdO1xuICB9IGVsc2UgaWYgKGZuLmZuKSB7XG4gICAgdmFyIF9mbjIgPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuMi5jb250ZXh0O1xuICAgIGZuID0gX2ZuMi5mbjtcbiAgfVxuICBpZiAoY29udGV4dCAmJiBfdXRpbHMuaXMuc3RyaW5nKGZuKSAmJiBfdXRpbHMuaXMuZnVuYyhjb250ZXh0W2ZuXSkpIHtcbiAgICBmbiA9IGNvbnRleHRbZm5dO1xuICB9XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblxuICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcbn1cblxuZnVuY3Rpb24gY2FsbChmbikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBjcHMoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gZm9yayhmbikge1xuICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHNwYXduKGZuKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcbn1cblxuZnVuY3Rpb24gam9pbigpIHtcbiAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgdGFza3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgfVxuXG4gIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBqb2luKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdqb2luKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcbiAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGNhbmNlbCh0KTtcbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRhc2sgPSB0YXNrc1swXTtcbiAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNyA+IDEgPyBfbGVuNyAtIDEgOiAwKSwgX2tleTcgPSAxOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG59XG5cbi8qKlxuICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcbioqL1xuZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG59XG5cbmZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdmbHVzaChjaGFubmVsKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsJyk7XG4gIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIGVmZmVjdChHRVRfQ09OVEVYVCwgcHJvcCk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG4gIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcbn1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDIgPyBfbGVuOCAtIDIgOiAwKSwgX2tleTggPSAyOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuICAgIGFyZ3NbX2tleTkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5OV07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUxhdGVzdEhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShtcywgcGF0dGVybiwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG52YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuICB9O1xufTtcblxudmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcbiAgdGFrZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShUQUtFKSxcbiAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG4gIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuICByYWNlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFJBQ0UpLFxuICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcbiAgZm9yazogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGT1JLKSxcbiAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcbiAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG4gIHNlbGVjdDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRUxFQ1QpLFxuICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcbiAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG4gIGZsdXNoOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZMVVNIKSxcbiAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG4gIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9pby5qc1xuLy8gbW9kdWxlIGlkID0gNzQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IHVuZGVmaW5lZDtcblxudmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90YWtlRXZlcnknKTtcblxudmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cbnZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VMYXRlc3QnKTtcblxudmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblxudmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcbiAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG59O1xuXG52YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG52YXIgdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VMYXRlc3QyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VMYXRlc3QnKSk7XG52YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcbmV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gX3Rha2VFdmVyeTIuZGVmYXVsdDtcbmV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc0NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG4gICAgfVxuICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qc1xuLy8gbW9kdWxlIGlkID0gNzQ2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucUVuZCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG52YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXG5mdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiAnY2hhbm5lbCc7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGVudHJ5KTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXG4gIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcbiAgICAgIHFOZXh0ID0gcTA7XG5cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG4gICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG4gICAgICByZXR1cm4gZG9uZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHFOZXh0ID0gcUVuZDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXG4gICAgICB2YXIgX2ZzbSRxTmV4dCA9IGZzbVtxTmV4dF0oKSxcbiAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcbiAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuICAgICAgICAgIF91cGRhdGVTdGF0ZSA9IF9mc20kcU5leHRbMl07XG5cbiAgICAgIHFOZXh0ID0gcTtcbiAgICAgIHVwZGF0ZVN0YXRlID0gX3VwZGF0ZVN0YXRlO1xuICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBuZXh0KG51bGwsIGVycm9yKTtcbiAgfSwgbmFtZSwgdHJ1ZSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5pc0VuZCA9IGV4cG9ydHMuRU5EID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcbmV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXZlbnRDaGFubmVsO1xuZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxudmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIENIQU5ORUxfRU5EX1RZUEUgPSAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbnZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xudmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcbiAgcmV0dXJuIGEgJiYgYS50eXBlID09PSBDSEFOTkVMX0VORF9UWVBFO1xufTtcblxuZnVuY3Rpb24gZW1pdHRlcigpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKHN1Yikge1xuICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKShzdWJzY3JpYmVycywgc3ViKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG4gICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJyW2ldKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgZW1pdDogZW1pdFxuICB9O1xufVxuXG52YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xudmFyIFVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gJ1NhZ2Egd2FzIHByb3ZpZGVkIHdpdGggYW4gdW5kZWZpbmVkIGFjdGlvbic7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gVU5ERUZJTkVEX0lOUFVUX0VSUk9SICs9ICdcXG5IaW50czpcXG4gICAgLSBjaGVjayB0aGF0IHlvdXIgQWN0aW9uIENyZWF0b3IgcmV0dXJucyBhIG5vbi11bmRlZmluZWQgdmFsdWVcXG4gICAgLSBpZiB0aGUgU2FnYSB3YXMgc3RhcnRlZCB1c2luZyBydW5TYWdhLCBjaGVjayB0aGF0IHlvdXIgc3Vic2NyaWJlIHNvdXJjZSBwcm92aWRlcyB0aGUgYWN0aW9uIHRvIGl0cyBsaXN0ZW5lcnNcXG4gICc7XG59XG5cbmZ1bmN0aW9uIGNoYW5uZWwoKSB7XG4gIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblxuICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gIHZhciB0YWtlcnMgPSBbXTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsIElOVkFMSURfQlVGRkVSKTtcblxuICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcbiAgICBpZiAoY2xvc2VkICYmIHRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcbiAgICB9XG4gICAgaWYgKHRha2Vycy5sZW5ndGggJiYgIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBidWZmZXIucHV0KGlucHV0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjYiA9IHRha2Vyc1tpXTtcbiAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRha2UoY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoYnVmZmVyLnRha2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRha2Vycy5wdXNoKGNiKTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihFTkQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYihidWZmZXIuZmx1c2goKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgIGlmICghY2xvc2VkKSB7XG4gICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IHRha2VycztcbiAgICAgICAgdGFrZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBhcnJbaV0oRU5EKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFrZTogdGFrZSxcbiAgICBwdXQ6IHB1dCxcbiAgICBmbHVzaDogZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGdldCBfX3Rha2Vyc19fKCkge1xuICAgICAgcmV0dXJuIHRha2VycztcbiAgICB9LFxuICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuICAgICAgcmV0dXJuIGNsb3NlZDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX2J1ZmZlcnMuYnVmZmVycy5ub25lKCk7XG4gIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXG4gIC8qKlxuICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuICAqKi9cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcbiAgfVxuXG4gIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBjaGFuLmNsb3NlKCk7XG4gICAgfVxuICB9O1xuICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlzRW5kKGlucHV0KSkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW4ucHV0KGlucHV0KTtcbiAgfSk7XG4gIGlmIChjaGFuLl9fY2xvc2VkX18pIHtcbiAgICB1bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiBjaGFuLnRha2UsXG4gICAgZmx1c2g6IGNoYW4uZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0ZENoYW5uZWwoc3Vic2NyaWJlKSB7XG4gIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoaW5wdXRbX3V0aWxzLlNBR0FfQUNUSU9OXSkge1xuICAgICAgICBjYihpbnB1dCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcbiAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuICAgICAgfVxuICAgICAgY2hhbi50YWtlKGNiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9jaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKFwiLi91dGlsc1wiKTtcblxudmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXG52YXIgT05fT1ZFUkZMT1dfVEhST1cgPSAxO1xudmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xudmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcbnZhciBPTl9PVkVSRkxPV19FWFBBTkQgPSA0O1xuXG52YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXG5mdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuICB2YXIgb3ZlcmZsb3dBY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG4gIHZhciBsZW5ndGggPSAwO1xuICB2YXIgcHVzaEluZGV4ID0gMDtcbiAgdmFyIHBvcEluZGV4ID0gMDtcblxuICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcbiAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgIGxlbmd0aCsrO1xuICB9O1xuXG4gIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcbiAgICBpZiAobGVuZ3RoICE9IDApIHtcbiAgICAgIHZhciBpdCA9IGFycltwb3BJbmRleF07XG4gICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcbiAgICAgIGxlbmd0aC0tO1xuICAgICAgcG9wSW5kZXggPSAocG9wSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtcztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoID09IDA7XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuICAgICAgaWYgKGxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgIHB1c2goaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRvdWJsZWRMaW1pdCA9IHZvaWQgMDtcbiAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX09WRVJGTE9XKTtcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX0VYUEFORDpcbiAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblxuICAgICAgICAgICAgYXJyID0gZmx1c2goKTtcblxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGFyci5sZW5ndGggPSBkb3VibGVkTGltaXQ7XG4gICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblxuICAgICAgICAgICAgcHVzaChpdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIERST1BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGFrZTogdGFrZSxcbiAgICBmbHVzaDogZmx1c2hcbiAgfTtcbn1cblxudmFyIGJ1ZmZlcnMgPSBleHBvcnRzLmJ1ZmZlcnMgPSB7XG4gIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG4gICAgcmV0dXJuIHplcm9CdWZmZXI7XG4gIH0sXG4gIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG4gIH0sXG4gIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcbiAgfSxcbiAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG4gIH0sXG4gIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlTGF0ZXN0O1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG4gIH07XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDAsXG4gICAgICBhY3Rpb24gPSB2b2lkIDA7XG4gIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG4gICAgcmV0dXJuIHRhc2sgPSB0O1xuICB9O1xuICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlTGF0ZXN0KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VMYXRlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vYnVmZmVycycpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRocm90dGxlKGRlbGF5TGVuZ3RoLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgY2hhbm5lbCA9IHZvaWQgMDtcblxuICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG4gIHZhciB5VGFrZSA9IGZ1bmN0aW9uIHlUYWtlKCkge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuICB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5RGVsYXkgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYWxsKShfdXRpbHMuZGVsYXksIGRlbGF5TGVuZ3RoKSB9O1xuXG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG4gIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaGFubmVsID0gY2g7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG4gICAgfSxcbiAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG4gICAgfVxuICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBzYWdhTWlkZGxld2FyZUZhY3Rvcnk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3J1blNhZ2EnKTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgY29udGV4dCA9IF9yZWYkY29udGV4dCA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNvbnRleHQsXG4gICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG5cbiAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBhIGZ1bmN0aW9uIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUuIFlvdSBhcmUgbGlrZWx5IHRyeWluZyB0byBzdGFydCBhICAgICAgICBTYWdhIGJ5IGRpcmVjdGx5IHBhc3NpbmcgaXQgdG8gdGhlIG1pZGRsZXdhcmUuIFRoaXMgaXMgbm8gbG9uZ2VyIHBvc3NpYmxlIHN0YXJ0aW5nIGZyb20gMC4xMC4wLiAgICAgICAgVG8gcnVuIGEgU2FnYSwgeW91IG11c3QgZG8gaXQgZHluYW1pY2FsbHkgQUZURVIgbW91bnRpbmcgdGhlIG1pZGRsZXdhcmUgaW50byB0aGUgc3RvcmUuXFxuICAgICAgICBFeGFtcGxlOlxcbiAgICAgICAgICBpbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcXCdyZWR1eC1zYWdhXFwnXFxuICAgICAgICAgIC4uLiBvdGhlciBpbXBvcnRzXFxuXFxuICAgICAgICAgIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKVxcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpXFxuICAgICAgICAgIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhLCAuLi5hcmdzKVxcbiAgICAgICcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbmVycm9yYCB3YXMgcmVtb3ZlZC4gVXNlIGBvcHRpb25zLm9uRXJyb3JgIGluc3RlYWQuJyk7XG4gIH1cblxuICBpZiAob25FcnJvciAmJiAhX3V0aWxzLmlzLmZ1bmMob25FcnJvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYyLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXG4gICAgdmFyIHNhZ2FFbWl0dGVyID0gKDAsIF9jaGFubmVsLmVtaXR0ZXIpKCk7XG4gICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblxuICAgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IF9ydW5TYWdhLnJ1blNhZ2EuYmluZChudWxsLCB7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG4gICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXI6IGxvZ2dlcixcbiAgICAgIG9uRXJyb3I6IG9uRXJyb3JcbiAgICB9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgaWYgKHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQpIHtcbiAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IG5leHQoYWN0aW9uKTsgLy8gaGl0IHJlZHVjZXJzXG4gICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG4gIH07XG5cbiAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgnc2FnYU1pZGRsZXdhcmUnLCBwcm9wcykpO1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcbiAgfTtcblxuICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL21pZGRsZXdhcmUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VtO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnB1dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnJhY2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hcHBseTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jcHM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZvcms7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zcGF3bjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uam9pbjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYW5jZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc2VsZWN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZsdXNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3V0aWxzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVEFTSycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5UQVNLO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU0FHQV9BQ1RJT04nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuU0FHQV9BQ1RJT047XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdub29wJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5pcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlZmVycmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlZmVycmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXJyYXlPZkRlZmZlcmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmFycmF5T2ZEZWZmZXJlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZU1vY2tUYXNrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNyZWF0ZU1vY2tUYXNrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2xvbmVhYmxlR2VuZXJhdG9yJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNsb25lYWJsZUdlbmVyYXRvcjtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FzRWZmZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFzRWZmZWN0O1xuICB9XG59KTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvcHJvYycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHB1bGwgZnJvbSBcImxvZGFzaC9wdWxsXCI7XG5pbXBvcnQgeyBpbkFycmF5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gaW5pdGlhbCBzdGF0ZVxubGV0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBzZWxlY3RBbGw6IHRydWUsXG4gICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICAgIHVzZXJJZDogbnVsbCxcbiAgICBncm91cGVkUHJvamVjdHM6IFtdLFxuICAgIGlzUmVzdHJpY3RlZDogbnVsbCxcblxuICAgIG9yaWdpbmFsSXNSZXN0cmljdGVkOiBudWxsLFxuICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsXG59O1xuXG5jb25zdCB1cGRhdGVQcm9qZWN0QWNjZXNzID0gKHByb2plY3RJZCwgZ3JvdXBlZFByb2plY3RzKSA9PiB7XG4gICAgLy8gRmluZCB0aGUgY29ycmVjdCBwcm9qZWN0IGFuZCB0b2dnbGUgdGhlIHRoZSBhY2Nlc3MgZmllbGRcbiAgICBncm91cGVkUHJvamVjdHMubWFwKGdyb3VwID0+IHtcbiAgICAgICAgZ3JvdXAucHJvamVjdHMubWFwKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcHJvamVjdC5pZCA9PT0gcHJvamVjdElkID8gKHByb2plY3QuYWNjZXNzID0gIXByb2plY3QuYWNjZXNzKSA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBncm91cGVkUHJvamVjdHM7XG59O1xuXG5jb25zdCB1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyA9IChhY2Nlc3MsIGdyb3VwZWRQcm9qZWN0cykgPT4ge1xuICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgcHJvamVjdCBhbmQgdG9nZ2xlIHRoZSB0aGUgYWNjZXNzIGZpZWxkXG4gICAgZ3JvdXBlZFByb2plY3RzLm1hcChncm91cCA9PiB7XG4gICAgICAgIGdyb3VwLnByb2plY3RzLm1hcChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHByb2plY3QuYWNjZXNzID0gYWNjZXNzO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBlZFByb2plY3RzO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuICAgIGNvbnN0IHJlZHVjZXJBY3Rpb25zID0ge1xuICAgICAgICBbYy5TRVRfU1RPUkVdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIC4uLmRhdGEgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5BUElfR0VUX0lOSVRdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLkFQSV9HRVRfU1VDQ0VTU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogeyBpc19yZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQgfSxcbiAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25fZ3JvdXBzOiBncm91cGVkUHJvamVjdHNcbiAgICAgICAgICAgIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cyxcbiAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgW2MuQVBJX0dFVF9GQUlMVVJFXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogW10sXG4gICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLkFQSV9QVVRfSU5JVF06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLkFQSV9QVVRfU1VDQ0VTU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGdyb3VwZWRfcHJvamVjdHM6IGdyb3VwZWRQcm9qZWN0cyB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgbGlzdCBvZiBwcm9qZWN0cyBoZXJlLCB0byBzaW1wbGlmeSB0aGUgc3RvcmVcbiAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNSZXN0cmljdGVkLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsSXNSZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0czogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5BUElfUFVUX0ZBSUxVUkVdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsSXNSZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBPdmVyd3JpdGUgaWYgd2UgaGF2ZSBhbiBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsSXNSZXN0cmljdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGUuaXNSZXN0cmljdGVkID0gc3RhdGUub3JpZ2luYWxJc1Jlc3RyaWN0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxHcm91cGVkUHJvamVjdHMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0ZS5ncm91cGVkUHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbEdyb3VwZWRQcm9qZWN0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT05dOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBwcm9qZWN0SWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxHcm91cGVkUHJvamVjdHMgPSBzdGF0ZS5ncm91cGVkUHJvamVjdHMgJiYgWy4uLnN0YXRlLmdyb3VwZWRQcm9qZWN0c107XG4gICAgICAgICAgICBsZXQgZ3JvdXBlZFByb2plY3RzID0gc3RhdGUuZ3JvdXBlZFByb2plY3RzICYmIFsuLi5zdGF0ZS5ncm91cGVkUHJvamVjdHNdO1xuICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzID0gdXBkYXRlUHJvamVjdEFjY2Vzcyhwcm9qZWN0SWQsIGdyb3VwZWRQcm9qZWN0cyk7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgb3JpZ2luYWxHcm91cGVkUHJvamVjdHMsIGdyb3VwZWRQcm9qZWN0cyB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLlVQREFURV9JU19SRVNUUklDVEVEXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNSZXN0cmljdGVkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgaXNSZXN0cmljdGVkLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsSXNSZXN0cmljdGVkOiBzdGF0ZS5pc1Jlc3RyaWN0ZWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgW2MuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFNdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxHcm91cGVkUHJvamVjdHMgPSBzdGF0ZS5ncm91cGVkUHJvamVjdHMgJiYgWy4uLnN0YXRlLmdyb3VwZWRQcm9qZWN0c107XG4gICAgICAgICAgICBsZXQgZ3JvdXBlZFByb2plY3RzID0gc3RhdGUuZ3JvdXBlZFByb2plY3RzICYmIFsuLi5zdGF0ZS5ncm91cGVkUHJvamVjdHNdLFxuICAgICAgICAgICAgICAgIHsgc2VsZWN0QWxsIH0gPSB7IC4uLnN0YXRlIH07XG4gICAgICAgICAgICBncm91cGVkUHJvamVjdHMgPSB1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyhzZWxlY3RBbGwsIGdyb3VwZWRQcm9qZWN0cyk7XG4gICAgICAgICAgICBzZWxlY3RBbGwgPSAhc2VsZWN0QWxsO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHcm91cGVkUHJvamVjdHMsXG4gICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVkdWNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoYWN0aW9uLnR5cGUpKSB7XG4gICAgICAgIHJldHVybiByZWR1Y2VyQWN0aW9uc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ2YXIgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIHB1bGxBbGwgPSByZXF1aXJlKCcuL3B1bGxBbGwnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcbiAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xudmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fb3ZlclJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hcHBseS5qc1xuLy8gbW9kdWxlIGlkID0gNzU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9jb25zdGFudC5qc1xuLy8gbW9kdWxlIGlkID0gNzYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3Nob3J0T3V0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VQdWxsQWxsID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBbGwnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG5mdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG4gICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvcHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpLFxuICAgIGJhc2VJbmRleE9mV2l0aCA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mV2l0aCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBzZWVuID0gYXJyYXk7XG5cbiAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcbiAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcbiAgfVxuICBpZiAoaXRlcmF0ZWUpIHtcbiAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGZyb21JbmRleCA9IDAsXG4gICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG4gICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcbiAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Njdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNOYU4uanNcbi8vIG1vZHVsZSBpZCA9IDc2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanNcbi8vIG1vZHVsZSBpZCA9IDc2OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qc1xuLy8gbW9kdWxlIGlkID0gNzcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gVGhpcyBpbXBvcnQgaXMgbmVjZXNzYXJ5IHRvIGJlIGFibGUgdG8gdGVzdCBzYWdhcy5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkdXgtc2FnYS9yZWR1eC1zYWdhL2lzc3Vlcy8yODAjaXNzdWVjb21tZW50LTI5MTEzMzAyM1xuaW1wb3J0IFwicmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lXCI7XG5cbmltcG9ydCB7IHRha2VMYXRlc3QsIGNhbGwsIHB1dCwgc2VsZWN0IH0gZnJvbSBcInJlZHV4LXNhZ2EvZWZmZWN0c1wiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuL2NvbnN0XCI7XG5pbXBvcnQgeyBnZXRDb29raWUgfSBmcm9tIFwiLi4vbXktcmVzdWx0cy91dGlsc1wiO1xuXG5mdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG4gICAgcmV0dXJuIGF4aW9zKGNvbmZpZylcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gKHsgcmVzcG9uc2UgfSkpXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiAoeyBlcnJvciB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaERhdGEodXNlcklkKSB7XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gXG4gICAgfTtcbiAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXREYXRhKHVzZXJJZCwgaXNSZXN0cmljdGVkLCBwcm9qZWN0c1dpdGhBY2Nlc3MpIHtcbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIG1ldGhvZDogXCJwYXRjaFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZShcImNzcmZ0b2tlblwiKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBwcm9qZWN0czogcHJvamVjdHNXaXRoQWNjZXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBjYWxsQXhpb3MoY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBnZXRTYWdhKGFjdGlvbikge1xuICAgIGNvbnN0IHsgdXNlcklkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICBjb25zdCB7IHJlc3BvbnNlLCBlcnJvciB9ID0geWllbGQgY2FsbChmZXRjaERhdGEsIHVzZXJJZCk7XG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbmNvbnN0IGZpbHRlclByb2plY3RzID0gc3RhdGUgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5ncm91cGVkUHJvamVjdHMucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MuY29uY2F0KFxuICAgICAgICAgICAgZ3JvdXAucHJvamVjdHMuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdC5hY2Nlc3MpLm1hcChwcm9qZWN0ID0+IHByb2plY3QuaWQpXG4gICAgICAgICk7XG4gICAgfSwgW10pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJJZCA9IHN0YXRlID0+IHN0YXRlLnVzZXJJZDtcbmV4cG9ydCBjb25zdCBnZXRJc1Jlc3RyaWN0ZWQgPSBzdGF0ZSA9PiBzdGF0ZS5pc1Jlc3RyaWN0ZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiogcHV0U2FnYShhY3Rpb24pIHtcbiAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcbiAgICBjb25zdCB1c2VySWQgPSB5aWVsZCBzZWxlY3QoZ2V0VXNlcklkKTtcbiAgICBjb25zdCBpc1Jlc3RyaWN0ZWQgPSB5aWVsZCBzZWxlY3QoZ2V0SXNSZXN0cmljdGVkKTtcbiAgICBjb25zdCBwcm9qZWN0c1dpdGhBY2Nlc3MgPSB5aWVsZCBzZWxlY3QoZmlsdGVyUHJvamVjdHMpO1xuXG4gICAgY29uc3QgeyByZXNwb25zZSwgZXJyb3IgfSA9IHlpZWxkIGNhbGwocHV0RGF0YSwgdXNlcklkLCBpc1Jlc3RyaWN0ZWQsIHByb2plY3RzV2l0aEFjY2Vzcyk7XG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbi8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5leHBvcnQgZnVuY3Rpb24qIHdhdGNoZXJTYWdhKCkge1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5BUElfR0VUX0lOSVQsIGdldFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9JU19SRVNUUklDVEVELCBwdXRTYWdhKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG4gIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG4gIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2F4aW9zLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc3NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qc1xuLy8gbW9kdWxlIGlkID0gNzc3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2lzLWJ1ZmZlci9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzc4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcbiAgICAgIHVybDogYXJndW1lbnRzWzBdXG4gICAgfSwgYXJndW1lbnRzWzFdKTtcbiAgfVxuXG4gIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvZGVmYXVsdHMuanNcbi8vIG1vZHVsZSBpZCA9IDc4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qc1xuLy8gbW9kdWxlIGlkID0gNzgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanNcbi8vIG1vZHVsZSBpZCA9IDc4MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gNzg0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIHJldHVybiBlcnJvcjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzg2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanNcbi8vIG1vZHVsZSBpZCA9IDc4OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qc1xuLy8gbW9kdWxlIGlkID0gNzg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgfSxcblxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiB7XG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH0pKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qc1xuLy8gbW9kdWxlIGlkID0gNzkwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3OTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDc5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qc1xuLy8gbW9kdWxlIGlkID0gNzk2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzXG4vLyBtb2R1bGUgaWQgPSA3OThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qc1xuLy8gbW9kdWxlIGlkID0gNzk5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=