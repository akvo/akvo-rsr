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
        var _reduxSaga = __webpack_require__(738);
        var _reduxSaga2 = _interopRequireDefault(_reduxSaga);
        var _reactRedux = __webpack_require__(184);
        var _reducer = __webpack_require__(754);
        var _sagas = __webpack_require__(771);
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
        var _mockData = __webpack_require__(1126);
        var _mockData2 = _interopRequireDefault(_mockData);
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
            var _ = _ref._, is_restricted = _ref.is_restricted, onChangeIsRestricted = _ref.onChangeIsRestricted;
            return _react2.default.createElement("span", null, _react2.default.createElement("label", null, _react2.default.createElement("input", {
                id: "is_restricted",
                type: "checkbox",
                checked: is_restricted,
                onChange: onChangeIsRestricted
            }), _react2.default.createElement("span", {
                dangerouslySetInnerHTML: {
                    __html: is_restricted ? _("user_access_restricted") : _("user_access_unrestricted")
                }
            })), is_restricted ? _react2.default.createElement("div", {
                className: "restrictedInfo",
                dangerouslySetInnerHTML: {
                    __html: _("restricted_info")
                }
            }) : _react2.default.createElement("div", null));
        };
        var Project = function Project(_ref2) {
            var _ = _ref2._, project = _ref2.project, user_projects = _ref2.user_projects, is_restricted = _ref2.is_restricted, onChangeProjectSelected = _ref2.onChangeProjectSelected;
            var uiSettings = function uiSettings(project, user_projects, is_restricted) {
                var checked = !is_restricted || user_projects && (0, _utils.inArray)(project.id, user_projects), disabled = is_restricted ? "" : "disabled", projectSelected = checked ? " projectSelected" : "", trClassName = disabled + projectSelected, idClassName = disabled + " id";
                return {
                    checked: checked,
                    trClassName: trClassName,
                    idClassName: idClassName
                };
            };
            var _uiSettings = uiSettings(project, user_projects, is_restricted), checked = _uiSettings.checked, trClassName = _uiSettings.trClassName, idClassName = _uiSettings.idClassName;
            return _react2.default.createElement("tr", {
                key: project.id,
                id: project.id,
                onClick: onChangeProjectSelected,
                className: trClassName
            }, _react2.default.createElement("td", null, _react2.default.createElement("input", {
                id: project.id,
                type: "checkbox",
                checked: checked,
                disabled: !is_restricted,
                readOnly: true
            })), _react2.default.createElement("td", {
                className: idClassName
            }, project.id), _react2.default.createElement("td", null, project.title || _("no_title")));
        };
        var SelectAll = function SelectAll(_ref3) {
            var _ = _ref3._, selectAll = _ref3.selectAll, onChangeProjectSelectAll = _ref3.onChangeProjectSelectAll, is_restricted = _ref3.is_restricted;
            var uiSettings = function uiSettings(is_restricted) {
                var buttonClass = "selectAllProjects" + (is_restricted ? "" : " disabled"), disabled = !is_restricted, divClass = is_restricted ? "" : "disabled";
                return {
                    buttonClass: buttonClass,
                    disabled: disabled,
                    divClass: divClass
                };
            };
            var _uiSettings2 = uiSettings(is_restricted), divClass = _uiSettings2.divClass, disabled = _uiSettings2.disabled, buttonClass = _uiSettings2.buttonClass;
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
            var _ = _ref5._, error = _ref5.error, projects = _ref5.projects, selectAll = _ref5.selectAll, onChangeProjectSelectAll = _ref5.onChangeProjectSelectAll, onChangeProjectSelected = _ref5.onChangeProjectSelected;
            var className = is_restricted ? "" : "disabled";
            return _react2.default.createElement("span", null, _react2.default.createElement(Error, {
                _: _,
                error: error
            }), _react2.default.createElement(SelectAll, {
                _: _,
                selectAll: selectAll,
                onChangeProjectSelectAll: onChangeProjectSelectAll,
                is_restricted: is_restricted
            }), _react2.default.createElement("table", null, _react2.default.createElement("thead", null, _react2.default.createElement("tr", null, _react2.default.createElement("th", {
                className: className
            }, _("access")), _react2.default.createElement("th", {
                className: className
            }, _("project_id")), _react2.default.createElement("th", {
                className: className
            }, _("project_title")))), _react2.default.createElement("tbody", null, all_projects.map(function(project) {
                return _react2.default.createElement(Project, {
                    _: _,
                    key: project.id,
                    project: project,
                    user_projects: user_projects,
                    is_restricted: is_restricted,
                    onChangeProjectSelected: onChangeProjectSelected
                });
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
                    this.props.setStore({
                        projects: _mockData2.default
                    });
                }
            }, {
                key: "render",
                value: function render() {
                    var _props = this.props, is_restricted = _props.is_restricted, selectAll = _props.selectAll, all_projects = _props.all_projects, user_projects = _props.user_projects, error = _props.error;
                    return all_projects ? _react2.default.createElement(Projects, {
                        _: this._,
                        error: error,
                        selectAll: selectAll,
                        projects: all_projects,
                        onChangeProjectSelectAll: this.toggleProjectSelectAll,
                        onChangeProjectSelected: this.toggleProjectSelected
                    }) : _react2.default.createElement("div", null, (0, _utils._)("loading"));
                }
            } ]);
            return App;
        }(_react2.default.Component);
        var mapStateToProps = function mapStateToProps(state) {
            var fetching = state.fetching, error = state.error, all_projects = state.all_projects, is_restricted = state.is_restricted, selectAll = state.selectAll, user_projects = state.user_projects, strings = state.strings;
            return {
                fetching: fetching,
                error: error,
                all_projects: all_projects,
                is_restricted: is_restricted,
                selectAll: selectAll,
                user_projects: user_projects,
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
                onUpdateIsRestricted: function onUpdateIsRestricted(is_restricted) {
                    return dispatch({
                        type: c.UPDATE_IS_RESTRICTED,
                        data: {
                            is_restricted: is_restricted
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
    736: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.dataFromElement = exports.inArray = exports.endpoints = undefined;
        var _store = __webpack_require__(304);
        var _store2 = _interopRequireDefault(_store);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
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
    738: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.utils = exports.effects = exports.detach = exports.CANCEL = exports.delay = exports.throttle = exports.takeLatest = exports.takeEvery = exports.buffers = exports.channel = exports.eventChannel = exports.END = exports.runSaga = undefined;
        var _runSaga = __webpack_require__(739);
        Object.defineProperty(exports, "runSaga", {
            enumerable: true,
            get: function get() {
                return _runSaga.runSaga;
            }
        });
        var _channel = __webpack_require__(747);
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
        var _buffers = __webpack_require__(748);
        Object.defineProperty(exports, "buffers", {
            enumerable: true,
            get: function get() {
                return _buffers.buffers;
            }
        });
        var _sagaHelpers = __webpack_require__(744);
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
        var _utils = __webpack_require__(740);
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
        var _io = __webpack_require__(743);
        Object.defineProperty(exports, "detach", {
            enumerable: true,
            get: function get() {
                return _io.detach;
            }
        });
        var _middleware = __webpack_require__(751);
        var _middleware2 = _interopRequireDefault(_middleware);
        var _effects = __webpack_require__(752);
        var effects = _interopRequireWildcard(_effects);
        var _utils2 = __webpack_require__(753);
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
    739: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.runSaga = runSaga;
            var _utils = __webpack_require__(740);
            var _proc = __webpack_require__(741);
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
    740: function(module, exports, __webpack_require__) {
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
    741: function(module, exports, __webpack_require__) {
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
        var _utils = __webpack_require__(740);
        var _scheduler = __webpack_require__(742);
        var _io = __webpack_require__(743);
        var _channel = __webpack_require__(747);
        var _buffers = __webpack_require__(748);
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
    742: function(module, exports) {
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
    743: function(module, exports, __webpack_require__) {
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
        var _utils = __webpack_require__(740);
        var _sagaHelpers = __webpack_require__(744);
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
    744: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.throttleHelper = exports.takeLatestHelper = exports.takeEveryHelper = exports.throttle = exports.takeLatest = exports.takeEvery = undefined;
        var _takeEvery = __webpack_require__(745);
        var _takeEvery2 = _interopRequireDefault(_takeEvery);
        var _takeLatest = __webpack_require__(749);
        var _takeLatest2 = _interopRequireDefault(_takeLatest);
        var _throttle = __webpack_require__(750);
        var _throttle2 = _interopRequireDefault(_throttle);
        var _utils = __webpack_require__(740);
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
    745: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeEvery;
        var _fsmIterator = __webpack_require__(746);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(743);
        var _channel = __webpack_require__(747);
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
    746: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.qEnd = undefined;
        exports.safeName = safeName;
        exports.default = fsmIterator;
        var _utils = __webpack_require__(740);
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
    747: function(module, exports, __webpack_require__) {
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
            var _utils = __webpack_require__(740);
            var _buffers = __webpack_require__(748);
            var _scheduler = __webpack_require__(742);
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
    748: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.buffers = exports.BUFFER_OVERFLOW = undefined;
        var _utils = __webpack_require__(740);
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
    749: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeLatest;
        var _fsmIterator = __webpack_require__(746);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(743);
        var _channel = __webpack_require__(747);
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
    750: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = throttle;
        var _fsmIterator = __webpack_require__(746);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(743);
        var _channel = __webpack_require__(747);
        var _buffers = __webpack_require__(748);
        var _utils = __webpack_require__(740);
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
    751: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.default = sagaMiddlewareFactory;
            var _utils = __webpack_require__(740);
            var _channel = __webpack_require__(747);
            var _runSaga = __webpack_require__(739);
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
    752: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _io = __webpack_require__(743);
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
    753: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _utils = __webpack_require__(740);
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
        var _io = __webpack_require__(743);
        Object.defineProperty(exports, "asEffect", {
            enumerable: true,
            get: function get() {
                return _io.asEffect;
            }
        });
        var _proc = __webpack_require__(741);
        Object.defineProperty(exports, "CHANNEL_END", {
            enumerable: true,
            get: function get() {
                return _proc.CHANNEL_END;
            }
        });
    },
    754: function(module, exports, __webpack_require__) {
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
        var _pull = __webpack_require__(755);
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
            is_restricted: false,
            all_projects: [],
            user_projects: [],
            original_is_restricted: null,
            original_user_projects: null
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
                var _action$data = action.data, all_projects = _action$data.all_projects, user_projects = _action$data.user_projects;
                return _extends({}, state, {
                    fetching: false,
                    all_projects: all_projects,
                    user_projects: user_projects && user_projects.projects || [],
                    is_restricted: user_projects && user_projects.is_restricted || false
                });
            }), _defineProperty(_reducerActions, c.API_GET_FAILURE, function(state, action) {
                return _extends({}, state, {
                    fetching: false,
                    all_projects: [],
                    user_projects: [],
                    error: action.error
                });
            }), _defineProperty(_reducerActions, c.API_PUT_INIT, function(state, action) {
                return _extends({}, state, {
                    fetching: true,
                    error: null
                });
            }), _defineProperty(_reducerActions, c.API_PUT_SUCCESS, function(state, action) {
                var user_projects = action.data.user_projects;
                return _extends({}, state, {
                    fetching: false,
                    is_restricted: user_projects.is_restricted,
                    original_is_restricted: null,
                    user_projects: user_projects.projects,
                    original_user_projects: null
                });
            }), _defineProperty(_reducerActions, c.API_PUT_FAILURE, function(state, action) {
                var newState = _extends({}, state, {
                    fetching: false,
                    original_is_restricted: null,
                    original_user_projects: null,
                    error: action.error
                });
                if (state.original_is_restricted !== null) {
                    newState.is_restricted = state.original_is_restricted;
                }
                if (state.original_user_projects !== null) {
                    newState.user_projects = state.original_user_projects;
                }
                return newState;
            }), _defineProperty(_reducerActions, c.UPDATE_PROJECT_SELECTION, function(state, action) {
                var projectId = action.data.projectId;
                var original_user_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                var user_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                (0, _utils.inArray)(projectId, user_projects) ? (0, _pull2.default)(user_projects, projectId) : user_projects.push(projectId);
                return _extends({}, state, {
                    original_user_projects: original_user_projects,
                    user_projects: user_projects
                });
            }), _defineProperty(_reducerActions, c.UPDATE_IS_RESTRICTED, function(state, action) {
                var is_restricted = action.data.is_restricted;
                return _extends({}, state, {
                    is_restricted: is_restricted,
                    original_is_restricted: state.is_restricted
                });
            }), _defineProperty(_reducerActions, c.UPDATE_SELECT_ALL_PROJECTS, function(state, action) {
                var original_user_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                var user_projects = void 0, _state = _extends({}, state), selectAll = _state.selectAll;
                if (selectAll) {
                    user_projects = state.all_projects.map(function(project) {
                        return project.id;
                    });
                } else {
                    user_projects = [];
                }
                selectAll = !selectAll;
                return _extends({}, state, {
                    selectAll: selectAll,
                    original_user_projects: original_user_projects,
                    user_projects: user_projects
                });
            }), _reducerActions);
            if (reducerActions.hasOwnProperty(action.type)) {
                return reducerActions[action.type](state, action);
            } else {
                return state;
            }
        }
    },
    755: function(module, exports, __webpack_require__) {
        var baseRest = __webpack_require__(756), pullAll = __webpack_require__(763);
        var pull = baseRest(pullAll);
        module.exports = pull;
    },
    756: function(module, exports, __webpack_require__) {
        var identity = __webpack_require__(439), overRest = __webpack_require__(757), setToString = __webpack_require__(759);
        function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + "");
        }
        module.exports = baseRest;
    },
    757: function(module, exports, __webpack_require__) {
        var apply = __webpack_require__(758);
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
    758: function(module, exports) {
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
    759: function(module, exports, __webpack_require__) {
        var baseSetToString = __webpack_require__(760), shortOut = __webpack_require__(762);
        var setToString = shortOut(baseSetToString);
        module.exports = setToString;
    },
    760: function(module, exports, __webpack_require__) {
        var constant = __webpack_require__(761), defineProperty = __webpack_require__(328), identity = __webpack_require__(439);
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
    761: function(module, exports) {
        function constant(value) {
            return function() {
                return value;
            };
        }
        module.exports = constant;
    },
    762: function(module, exports) {
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
    763: function(module, exports, __webpack_require__) {
        var basePullAll = __webpack_require__(764);
        function pullAll(array, values) {
            return array && array.length && values && values.length ? basePullAll(array, values) : array;
        }
        module.exports = pullAll;
    },
    764: function(module, exports, __webpack_require__) {
        var arrayMap = __webpack_require__(434), baseIndexOf = __webpack_require__(765), baseIndexOfWith = __webpack_require__(769), baseUnary = __webpack_require__(356), copyArray = __webpack_require__(770);
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
    765: function(module, exports, __webpack_require__) {
        var baseFindIndex = __webpack_require__(766), baseIsNaN = __webpack_require__(767), strictIndexOf = __webpack_require__(768);
        function baseIndexOf(array, value, fromIndex) {
            return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        module.exports = baseIndexOf;
    },
    766: function(module, exports) {
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
    767: function(module, exports) {
        function baseIsNaN(value) {
            return value !== value;
        }
        module.exports = baseIsNaN;
    },
    768: function(module, exports) {
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
    769: function(module, exports) {
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
    770: function(module, exports) {
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
    771: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getIsRestricted = exports.getUserProjects = exports.getUserId = undefined;
        exports.fetchData = fetchData;
        exports.putData = putData;
        exports.getSaga = getSaga;
        exports.putSaga = putSaga;
        exports.watcherSaga = watcherSaga;
        __webpack_require__(772);
        var _effects = __webpack_require__(752);
        var _axios = __webpack_require__(773);
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
        function putData(userId, is_restricted, user_projects) {
            var config = {
                method: "put",
                headers: {
                    "X-CSRFToken": (0, _utils.getCookie)("csrftoken")
                },
                url: "/rest/v1/user_projects_access/" + userId + "/",
                data: {
                    user_projects: {
                        is_restricted: is_restricted,
                        projects: user_projects
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
        var getUserId = exports.getUserId = function getUserId(state) {
            return state.userId;
        };
        var getUserProjects = exports.getUserProjects = function getUserProjects(state) {
            return state.user_projects;
        };
        var getIsRestricted = exports.getIsRestricted = function getIsRestricted(state) {
            return state.is_restricted;
        };
        function putSaga(action) {
            var userId, is_restricted, user_projects, _ref2, response, error;
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
                        is_restricted = _context2.sent;
                        _context2.next = 10;
                        return (0, _effects.select)(getUserProjects);

                      case 10:
                        user_projects = _context2.sent;
                        _context2.next = 13;
                        return (0, _effects.call)(putData, userId, is_restricted, user_projects);

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
    772: function(module, exports) {
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
    773: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(774);
    },
    774: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
        var bind = __webpack_require__(776);
        var Axios = __webpack_require__(778);
        var defaults = __webpack_require__(779);
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
        axios.Cancel = __webpack_require__(796);
        axios.CancelToken = __webpack_require__(797);
        axios.isCancel = __webpack_require__(793);
        axios.all = function all(promises) {
            return Promise.all(promises);
        };
        axios.spread = __webpack_require__(798);
        module.exports = axios;
        module.exports.default = axios;
    },
    775: function(module, exports, __webpack_require__) {
        "use strict";
        var bind = __webpack_require__(776);
        var isBuffer = __webpack_require__(777);
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
    776: function(module, exports) {
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
    777: function(module, exports) {
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
    778: function(module, exports, __webpack_require__) {
        "use strict";
        var defaults = __webpack_require__(779);
        var utils = __webpack_require__(775);
        var InterceptorManager = __webpack_require__(790);
        var dispatchRequest = __webpack_require__(791);
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
    779: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(775);
            var normalizeHeaderName = __webpack_require__(780);
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
                    adapter = __webpack_require__(781);
                } else if (typeof process !== "undefined") {
                    adapter = __webpack_require__(781);
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
    780: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
        module.exports = function normalizeHeaderName(headers, normalizedName) {
            utils.forEach(headers, function processHeader(value, name) {
                if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                    headers[normalizedName] = value;
                    delete headers[name];
                }
            });
        };
    },
    781: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(775);
            var settle = __webpack_require__(782);
            var buildURL = __webpack_require__(785);
            var parseHeaders = __webpack_require__(786);
            var isURLSameOrigin = __webpack_require__(787);
            var createError = __webpack_require__(783);
            var btoa = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || __webpack_require__(788);
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
                        var cookies = __webpack_require__(789);
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
    782: function(module, exports, __webpack_require__) {
        "use strict";
        var createError = __webpack_require__(783);
        module.exports = function settle(resolve, reject, response) {
            var validateStatus = response.config.validateStatus;
            if (!response.status || !validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
            }
        };
    },
    783: function(module, exports, __webpack_require__) {
        "use strict";
        var enhanceError = __webpack_require__(784);
        module.exports = function createError(message, config, code, request, response) {
            var error = new Error(message);
            return enhanceError(error, config, code, request, response);
        };
    },
    784: function(module, exports) {
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
    785: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
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
    786: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
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
    787: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
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
    788: function(module, exports) {
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
    789: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
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
    790: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
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
    791: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
        var transformData = __webpack_require__(792);
        var isCancel = __webpack_require__(793);
        var defaults = __webpack_require__(779);
        var isAbsoluteURL = __webpack_require__(794);
        var combineURLs = __webpack_require__(795);
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
    792: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(775);
        module.exports = function transformData(data, headers, fns) {
            utils.forEach(fns, function transform(fn) {
                data = fn(data, headers);
            });
            return data;
        };
    },
    793: function(module, exports) {
        "use strict";
        module.exports = function isCancel(value) {
            return !!(value && value.__CANCEL__);
        };
    },
    794: function(module, exports) {
        "use strict";
        module.exports = function isAbsoluteURL(url) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
        };
    },
    795: function(module, exports) {
        "use strict";
        module.exports = function combineURLs(baseURL, relativeURL) {
            return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
        };
    },
    796: function(module, exports) {
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
    797: function(module, exports, __webpack_require__) {
        "use strict";
        var Cancel = __webpack_require__(796);
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
    798: function(module, exports) {
        "use strict";
        module.exports = function spread(callback) {
            return function wrap(arr) {
                return callback.apply(null, arr);
            };
        };
    },
    1126: function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = restrictedUserProjectsByOrg = [ {
            organisations: "EUTF, SNV",
            projects: [ {
                id: 1,
                title: "Project 1",
                subtitle: "Project 1 subtitle",
                access: true
            }, {
                id: 2,
                title: "Project 2",
                subtitle: "Project 2 subtitle",
                access: true
            }, {
                id: 3,
                title: "Project 3",
                subtitle: "Project 3 subtitle",
                access: true
            } ]
        }, {
            organisations: "EUTF, GIZ",
            projects: [ {
                id: 4,
                title: "Project 4",
                subtitle: "Project 4 subtitle",
                access: true
            }, {
                id: 5,
                title: "Project 5",
                subtitle: "Project 5 subtitle",
                access: true
            } ]
        }, {
            organisations: "EUTF",
            projects: [ {
                id: 6,
                title: "Project 6",
                subtitle: "Project 6 subtitle",
                access: true
            }, {
                id: 7,
                title: "Project 7",
                subtitle: "Project 7 subtitle",
                access: true
            } ]
        } ];
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL21vY2stZGF0YS5qcyJdLCJuYW1lcyI6WyJ3ZWJwYWNrSnNvbnAiLCIwIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJfcmVhY3QiLCJfcmVhY3QyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdERvbSIsIl9yZWFjdERvbTIiLCJfQXBwIiwiX0FwcDIiLCJfcmVkdXgiLCJfcmVkdXhTYWdhIiwiX3JlZHV4U2FnYTIiLCJfcmVhY3RSZWR1eCIsIl9yZWR1Y2VyIiwiX3NhZ2FzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJzYWdhTWlkZGxld2FyZSIsInJlZHV4RGV2VG9vbHMiLCJ3aW5kb3ciLCJfX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fIiwic3RvcmUiLCJjcmVhdGVTdG9yZSIsInJlZHVjZXIiLCJjb21wb3NlIiwiYXBwbHlNaWRkbGV3YXJlIiwicnVuIiwid2F0Y2hlclNhZ2EiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJSZWFjdERPTSIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJQcm92aWRlciIsImdldEVsZW1lbnRCeUlkIiwiNzM1IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl9jcmVhdGVDbGFzcyIsImRlZmluZVByb3BlcnRpZXMiLCJ0YXJnZXQiLCJwcm9wcyIsImkiLCJsZW5ndGgiLCJkZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwia2V5IiwiQ29uc3RydWN0b3IiLCJwcm90b1Byb3BzIiwic3RhdGljUHJvcHMiLCJwcm90b3R5cGUiLCJfdXRpbHMiLCJfY29uc3QiLCJjIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfbW9ja0RhdGEiLCJfbW9ja0RhdGEyIiwibmV3T2JqIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJUeXBlRXJyb3IiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsInNlbGYiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJJc1Jlc3RyaWN0ZWQiLCJfcmVmIiwiXyIsImlzX3Jlc3RyaWN0ZWQiLCJvbkNoYW5nZUlzUmVzdHJpY3RlZCIsImlkIiwidHlwZSIsImNoZWNrZWQiLCJvbkNoYW5nZSIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiY2xhc3NOYW1lIiwiUHJvamVjdCIsIl9yZWYyIiwicHJvamVjdCIsInVzZXJfcHJvamVjdHMiLCJvbkNoYW5nZVByb2plY3RTZWxlY3RlZCIsInVpU2V0dGluZ3MiLCJpbkFycmF5IiwiZGlzYWJsZWQiLCJwcm9qZWN0U2VsZWN0ZWQiLCJ0ckNsYXNzTmFtZSIsImlkQ2xhc3NOYW1lIiwiX3VpU2V0dGluZ3MiLCJvbkNsaWNrIiwicmVhZE9ubHkiLCJ0aXRsZSIsIlNlbGVjdEFsbCIsIl9yZWYzIiwic2VsZWN0QWxsIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsIiwiYnV0dG9uQ2xhc3MiLCJkaXZDbGFzcyIsIl91aVNldHRpbmdzMiIsIkVycm9yIiwiX3JlZjQiLCJlcnJvciIsIm1lc3NhZ2UiLCJQcm9qZWN0cyIsIl9yZWY1IiwicHJvamVjdHMiLCJhbGxfcHJvamVjdHMiLCJtYXAiLCJBcHAiLCJfUmVhY3QkQ29tcG9uZW50IiwidGhpcyIsIl90aGlzIiwiZ2V0UHJvdG90eXBlT2YiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0ZWQiLCJiaW5kIiwidG9nZ2xlSXNSZXN0cmljdGVkIiwidG9nZ2xlUHJvamVjdFNlbGVjdEFsbCIsInMiLCJzdHJpbmdzIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm9uVXBkYXRlSXNSZXN0cmljdGVkIiwib25VcGRhdGVTZWxlY3RBbGwiLCJjdXJyZW50VGFyZ2V0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsIm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbiIsImNvbXBvbmVudERpZE1vdW50IiwidXNlcklkIiwiZGF0YUZyb21FbGVtZW50Iiwic2V0U3RvcmUiLCJfcHJvcHMiLCJSZWFjdCIsIkNvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZmV0Y2hpbmciLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsIm9uRmV0Y2hVc2VyUHJvamVjdHMiLCJBUElfR0VUX0lOSVQiLCJkYXRhIiwiU0VUX1NUT1JFIiwicHJvamVjdElkIiwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OIiwiVVBEQVRFX0lTX1JFU1RSSUNURUQiLCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyIsImNvbm5lY3QiLCI3MzYiLCJlbmRwb2ludHMiLCJ1bmRlZmluZWQiLCJfc3RvcmUiLCJfc3RvcmUyIiwidXNlcl9wcm9qZWN0c19hY2Nlc3MiLCJhcnIiLCJpbmRleE9mIiwiZWxlbWVudE5hbWUiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCI3MzciLCJBUElfR0VUX1NVQ0NFU1MiLCJBUElfR0VUX0ZBSUxVUkUiLCJBUElfUFVUX0lOSVQiLCJBUElfUFVUX1NVQ0NFU1MiLCJBUElfUFVUX0ZBSUxVUkUiLCI3MzgiLCJ1dGlscyIsImVmZmVjdHMiLCJkZXRhY2giLCJDQU5DRUwiLCJkZWxheSIsInRocm90dGxlIiwidGFrZUxhdGVzdCIsInRha2VFdmVyeSIsImJ1ZmZlcnMiLCJjaGFubmVsIiwiZXZlbnRDaGFubmVsIiwiRU5EIiwicnVuU2FnYSIsIl9ydW5TYWdhIiwiZ2V0IiwiX2NoYW5uZWwiLCJfYnVmZmVycyIsIl9zYWdhSGVscGVycyIsIl9pbyIsIl9taWRkbGV3YXJlIiwiX21pZGRsZXdhcmUyIiwiX2VmZmVjdHMiLCJfdXRpbHMyIiwiNzM5IiwicHJvY2VzcyIsIl9wcm9jIiwiX3Byb2MyIiwiUlVOX1NBR0FfU0lHTkFUVVJFIiwiTk9OX0dFTkVSQVRPUl9FUlIiLCJzdG9yZUludGVyZmFjZSIsInNhZ2EiLCJfbGVuIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwiX2tleSIsIml0ZXJhdG9yIiwiaXMiLCJlbnYiLCJOT0RFX0VOViIsImxvZyIsImNoZWNrIiwiZnVuYyIsImFwcGx5IiwiX3N0b3JlSW50ZXJmYWNlIiwic3Vic2NyaWJlIiwiZ2V0U3RhdGUiLCJjb250ZXh0Iiwic2FnYU1vbml0b3IiLCJsb2dnZXIiLCJvbkVycm9yIiwiZWZmZWN0SWQiLCJ1aWQiLCJlZmZlY3RUcmlnZ2VyZWQiLCJub29wIiwiZWZmZWN0UmVzb2x2ZWQiLCJlZmZlY3RSZWplY3RlZCIsImVmZmVjdENhbmNlbGxlZCIsImFjdGlvbkRpc3BhdGNoZWQiLCJyb290IiwicGFyZW50RWZmZWN0SWQiLCJlZmZlY3QiLCJ0YXNrIiwid3JhcFNhZ2FEaXNwYXRjaCIsIm5hbWUiLCI3NDAiLCJfZXh0ZW5kcyIsImFzc2lnbiIsInNvdXJjZSIsIl90eXBlb2YiLCJTeW1ib2wiLCJoYXNPd24iLCJyZW1vdmUiLCJkZWZlcnJlZCIsImFycmF5T2ZEZWZmZXJlZCIsImNyZWF0ZU1vY2tUYXNrIiwiYXV0b0luYyIsIm1ha2VJdGVyYXRvciIsImRlcHJlY2F0ZSIsInN5bSIsIlRBU0siLCJIRUxQRVIiLCJNQVRDSCIsIlNBR0FfQUNUSU9OIiwiU0VMRl9DQU5DRUxMQVRJT04iLCJrb25zdCIsInYiLCJrVHJ1ZSIsImtGYWxzZSIsImlkZW50IiwicHJlZGljYXRlIiwib2JqZWN0IiwicHJvcGVydHkiLCJub3RVbmRlZiIsInVuZGVmIiwiZiIsIm51bWJlciIsIm4iLCJzdHJpbmciLCJhcnJheSIsImlzQXJyYXkiLCJwcm9taXNlIiwicCIsInRoZW4iLCJpdCIsIm5leHQiLCJ0aHJvdyIsIml0ZXJhYmxlIiwidCIsIm9ic2VydmFibGUiLCJvYiIsImJ1ZmZlciIsImJ1ZiIsImlzRW1wdHkiLCJ0YWtlIiwicHV0IiwicGF0dGVybiIsInBhdCIsImNoIiwiY2xvc2UiLCJoZWxwZXIiLCJzdHJpbmdhYmxlRnVuYyIsIml0ZW0iLCJpbmRleCIsInNwbGljZSIsImZyb20iLCJkZWYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInB1c2giLCJtcyIsInZhbCIsInRpbWVvdXRJZCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5uaW5nIiwiX3Jlc3VsdCIsIl9lcnJvciIsImlzUnVubmluZyIsInJlc3VsdCIsInNldFJ1bm5pbmciLCJiIiwic2V0UmVzdWx0IiwiciIsInNldEVycm9yIiwic2VlZCIsImtUaHJvdyIsImVyciIsImtSZXR1cm4iLCJkb25lIiwidGhybyIsImlzSGVscGVyIiwicmV0dXJuIiwibGV2ZWwiLCJjb25zb2xlIiwic3RhY2siLCJmbiIsImRlcHJlY2F0aW9uV2FybmluZyIsInVwZGF0ZUluY2VudGl2ZSIsImRlcHJlY2F0ZWQiLCJwcmVmZXJyZWQiLCJpbnRlcm5hbEVyciIsImNyZWF0ZVNldENvbnRleHRXYXJuaW5nIiwiY3R4IiwiYWN0aW9uIiwiY2xvbmVhYmxlR2VuZXJhdG9yIiwiZ2VuZXJhdG9yRnVuYyIsImhpc3RvcnkiLCJnZW4iLCJhcmciLCJjbG9uZSIsImNsb25lZEdlbiIsImZvckVhY2giLCJfcmV0dXJuIiwiX3Rocm93IiwiZXhjZXB0aW9uIiwiNzQxIiwiVEFTS19DQU5DRUwiLCJDSEFOTkVMX0VORCIsIk5PVF9JVEVSQVRPUl9FUlJPUiIsInByb2MiLCJfc2NoZWR1bGVyIiwiX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzIiwiZGVzY3MiLCJkZXNjIiwidG9TdHJpbmciLCJtYXRjaGVycyIsIndpbGRjYXJkIiwiX2RlZmF1bHQiLCJpbnB1dCIsIlN0cmluZyIsInBhdHRlcm5zIiwic29tZSIsIm1hdGNoZXIiLCJfcHJlZGljYXRlIiwiZm9ya1F1ZXVlIiwibWFpblRhc2siLCJjYiIsInRhc2tzIiwiY29tcGxldGVkIiwiYWRkVGFzayIsImFib3J0IiwiY2FuY2VsQWxsIiwiY29udCIsInJlcyIsImlzRXJyIiwiY2FuY2VsIiwiZ2V0VGFza3MiLCJ0YXNrTmFtZXMiLCJjcmVhdGVUYXNrSXRlcmF0b3IiLCJwYyIsImVmZiIsInJldCIsIndyYXBIZWxwZXIiLCJwYXJlbnRDb250ZXh0Iiwib3B0aW9ucyIsImVmZmVjdHNTdHJpbmciLCJydW5QYXJhbGxlbEVmZmVjdCIsInJ1bkFsbEVmZmVjdCIsImxvZ0Vycm9yIiwic2FnYVN0YWNrIiwic3BsaXQiLCJzdGRDaGFubmVsIiwidGFza0NvbnRleHQiLCJuZXdUYXNrIiwiY2FuY2VsTWFpbiIsInRhc2tRdWV1ZSIsImVuZCIsImlzQ2FuY2VsbGVkIiwiX2lzUnVubmluZyIsIl9pc0NhbmNlbGxlZCIsInJ1bkVmZmVjdCIsImlzTWFpblJ1bm5pbmciLCJfZGVmZXJyZWRFbmQiLCJfaXNBYm9ydGVkIiwiam9pbmVycyIsImoiLCJsYWJlbCIsImVmZmVjdFNldHRsZWQiLCJjdXJyQ2IiLCJyZXNvbHZlUHJvbWlzZSIsInJ1bkZvcmtFZmZlY3QiLCJyZXNvbHZlSXRlcmF0b3IiLCJhc0VmZmVjdCIsInJ1blRha2VFZmZlY3QiLCJydW5QdXRFZmZlY3QiLCJhbGwiLCJyYWNlIiwicnVuUmFjZUVmZmVjdCIsInJ1bkNhbGxFZmZlY3QiLCJjcHMiLCJydW5DUFNFZmZlY3QiLCJmb3JrIiwiam9pbiIsInJ1bkpvaW5FZmZlY3QiLCJydW5DYW5jZWxFZmZlY3QiLCJzZWxlY3QiLCJydW5TZWxlY3RFZmZlY3QiLCJhY3Rpb25DaGFubmVsIiwicnVuQ2hhbm5lbEVmZmVjdCIsImZsdXNoIiwicnVuRmx1c2hFZmZlY3QiLCJjYW5jZWxsZWQiLCJydW5DYW5jZWxsZWRFZmZlY3QiLCJnZXRDb250ZXh0IiwicnVuR2V0Q29udGV4dEVmZmVjdCIsInNldENvbnRleHQiLCJydW5TZXRDb250ZXh0RWZmZWN0IiwiY2FuY2VsUHJvbWlzZSIsIm1heWJlIiwidGFrZUNiIiwiaW5wIiwiaXNFbmQiLCJhc2FwIiwiY3BzQ2IiLCJjb25jYXQiLCJfcmVmNiIsImRldGFjaGVkIiwidGFza0l0ZXJhdG9yIiwic3VzcGVuZCIsIl90YXNrIiwiam9pbmVyIiwiaXNBYm9ydGVkIiwidGFza1RvQ2FuY2VsIiwia2V5cyIsImNvbXBsZXRlZENvdW50IiwicmVzdWx0cyIsImNoaWxkQ2JzIiwiY2hlY2tFZmZlY3RFbmQiLCJjaENiQXRLZXkiLCJfcmVzcG9uc2UiLCJyZXNwb25zZSIsInNsaWNlIiwiX3JlZjciLCJzZWxlY3RvciIsIl9yZWY4IiwibWF0Y2giLCJmaXhlZCIsInByb3AiLCJfZG9uZSIsIl9yZWY5IiwiX211dGF0b3JNYXAiLCI3NDIiLCJxdWV1ZSIsInNlbWFwaG9yZSIsImV4ZWMiLCJyZWxlYXNlIiwic2hpZnQiLCI3NDMiLCJ0YWtlbSIsInNwYXduIiwiSU8iLCJUQUtFIiwiUFVUIiwiQUxMIiwiUkFDRSIsIkNBTEwiLCJDUFMiLCJGT1JLIiwiSk9JTiIsIlNFTEVDVCIsIkFDVElPTl9DSEFOTkVMIiwiQ0FOQ0VMTEVEIiwiRkxVU0giLCJHRVRfQ09OVEVYVCIsIlNFVF9DT05URVhUIiwiVEVTVF9ISU5UIiwicGF5bG9hZCIsInBhdHRlcm5PckNoYW5uZWwiLCJzeW5jIiwiZ2V0Rm5DYWxsRGVzYyIsIm1ldGgiLCJfZm4iLCJfZm4yIiwiX2xlbjIiLCJfa2V5MiIsIl9sZW4zIiwiX2tleTMiLCJfbGVuNCIsIl9rZXk0IiwiX2xlbjUiLCJfa2V5NSIsIl9sZW42IiwiX2tleTYiLCJfbGVuNyIsIl9rZXk3Iiwid29ya2VyIiwiX2xlbjgiLCJfa2V5OCIsInRha2VFdmVyeUhlbHBlciIsIl9sZW45IiwiX2tleTkiLCJ0YWtlTGF0ZXN0SGVscGVyIiwiX2xlbjEwIiwiX2tleTEwIiwidGhyb3R0bGVIZWxwZXIiLCJjcmVhdGVBc0VmZmVjdFR5cGUiLCI3NDQiLCJfdGFrZUV2ZXJ5IiwiX3Rha2VFdmVyeTIiLCJfdGFrZUxhdGVzdCIsIl90YWtlTGF0ZXN0MiIsIl90aHJvdHRsZSIsIl90aHJvdHRsZTIiLCJoZWxwZXJOYW1lIiwiNzQ1IiwiX2ZzbUl0ZXJhdG9yIiwiX2ZzbUl0ZXJhdG9yMiIsInlUYWtlIiwieUZvcmsiLCJhYyIsInNldEFjdGlvbiIsInExIiwicTIiLCJxRW5kIiwic2FmZU5hbWUiLCI3NDYiLCJmc21JdGVyYXRvciIsImVudHJ5IiwiZnNtIiwicTAiLCJ1cGRhdGVTdGF0ZSIsInFOZXh0IiwiX2ZzbSRxTmV4dCIsInEiLCJvdXRwdXQiLCJfdXBkYXRlU3RhdGUiLCI3NDciLCJVTkRFRklORURfSU5QVVRfRVJST1IiLCJJTlZBTElEX0JVRkZFUiIsImVtaXR0ZXIiLCJDSEFOTkVMX0VORF9UWVBFIiwiYSIsInN1YnNjcmliZXJzIiwic3ViIiwiZW1pdCIsImxlbiIsImNsb3NlZCIsInRha2VycyIsImNoZWNrRm9yYmlkZGVuU3RhdGVzIiwiX190YWtlcnNfXyIsIl9fY2xvc2VkX18iLCJub25lIiwiY2hhbiIsInVuc3Vic2NyaWJlIiwiNzQ4IiwiQlVGRkVSX09WRVJGTE9XIiwiT05fT1ZFUkZMT1dfVEhST1ciLCJPTl9PVkVSRkxPV19EUk9QIiwiT05fT1ZFUkZMT1dfU0xJREUiLCJPTl9PVkVSRkxPV19FWFBBTkQiLCJ6ZXJvQnVmZmVyIiwicmluZ0J1ZmZlciIsImxpbWl0Iiwib3ZlcmZsb3dBY3Rpb24iLCJwdXNoSW5kZXgiLCJwb3BJbmRleCIsIml0ZW1zIiwiZG91YmxlZExpbWl0IiwiZHJvcHBpbmciLCJzbGlkaW5nIiwiZXhwYW5kaW5nIiwiaW5pdGlhbFNpemUiLCI3NDkiLCJ5Q2FuY2VsIiwic2V0VGFzayIsInEzIiwiNzUwIiwiZGVsYXlMZW5ndGgiLCJ5QWN0aW9uQ2hhbm5lbCIsInlEZWxheSIsInNldENoYW5uZWwiLCJxNCIsIjc1MSIsInNhZ2FNaWRkbGV3YXJlRmFjdG9yeSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9yZWYkY29udGV4dCIsIm9uZXJyb3IiLCJzYWdhRW1pdHRlciIsIjc1MiIsIjc1MyIsIjc1NCIsIl9wdWxsIiwiX3B1bGwyIiwiX2RlZmluZVByb3BlcnR5IiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiYXJyMiIsImluaXRpYWxTdGF0ZSIsIm9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQiLCJvcmlnaW5hbF91c2VyX3Byb2plY3RzIiwiX3JlZHVjZXJBY3Rpb25zIiwicmVkdWNlckFjdGlvbnMiLCJfYWN0aW9uJGRhdGEiLCJuZXdTdGF0ZSIsIl9zdGF0ZSIsIjc1NSIsImJhc2VSZXN0IiwicHVsbEFsbCIsInB1bGwiLCI3NTYiLCJpZGVudGl0eSIsIm92ZXJSZXN0Iiwic2V0VG9TdHJpbmciLCJzdGFydCIsIjc1NyIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJ0cmFuc2Zvcm0iLCJvdGhlckFyZ3MiLCI3NTgiLCJ0aGlzQXJnIiwiNzU5IiwiYmFzZVNldFRvU3RyaW5nIiwic2hvcnRPdXQiLCI3NjAiLCJjb25zdGFudCIsIjc2MSIsIjc2MiIsIkhPVF9DT1VOVCIsIkhPVF9TUEFOIiwibmF0aXZlTm93IiwiRGF0ZSIsIm5vdyIsImNvdW50IiwibGFzdENhbGxlZCIsInN0YW1wIiwicmVtYWluaW5nIiwiNzYzIiwiYmFzZVB1bGxBbGwiLCJ2YWx1ZXMiLCI3NjQiLCJhcnJheU1hcCIsImJhc2VJbmRleE9mIiwiYmFzZUluZGV4T2ZXaXRoIiwiYmFzZVVuYXJ5IiwiY29weUFycmF5IiwiYXJyYXlQcm90byIsIml0ZXJhdGVlIiwiY29tcGFyYXRvciIsInNlZW4iLCJmcm9tSW5kZXgiLCJjb21wdXRlZCIsIjc2NSIsImJhc2VGaW5kSW5kZXgiLCJiYXNlSXNOYU4iLCJzdHJpY3RJbmRleE9mIiwiNzY2IiwiZnJvbVJpZ2h0IiwiNzY3IiwiNzY4IiwiNzY5IiwiNzcwIiwiNzcxIiwiZ2V0SXNSZXN0cmljdGVkIiwiZ2V0VXNlclByb2plY3RzIiwiZ2V0VXNlcklkIiwiZmV0Y2hEYXRhIiwicHV0RGF0YSIsImdldFNhZ2EiLCJwdXRTYWdhIiwiX2F4aW9zIiwiX2F4aW9zMiIsIl9tYXJrZWQiLCJyZWdlbmVyYXRvclJ1bnRpbWUiLCJtYXJrIiwiX21hcmtlZDIiLCJfbWFya2VkMyIsImNhbGxBeGlvcyIsImNvbmZpZyIsImNhdGNoIiwibWV0aG9kIiwidXJsIiwiaGVhZGVycyIsIlgtQ1NSRlRva2VuIiwiZ2V0Q29va2llIiwid3JhcCIsImdldFNhZ2EkIiwiX2NvbnRleHQiLCJwcmV2Iiwic2VudCIsInN0b3AiLCJwdXRTYWdhJCIsIl9jb250ZXh0MiIsIndhdGNoZXJTYWdhJCIsIl9jb250ZXh0MyIsIjc3MiIsImdsb2JhbCIsIk9wIiwiJFN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiaW5Nb2R1bGUiLCJydW50aW1lIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJ0cnlMb2NzTGlzdCIsInByb3RvR2VuZXJhdG9yIiwiR2VuZXJhdG9yIiwiZ2VuZXJhdG9yIiwiQ29udGV4dCIsIl9pbnZva2UiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0IiwiR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCIsIkdlblN0YXRlRXhlY3V0aW5nIiwiR2VuU3RhdGVDb21wbGV0ZWQiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJOYXRpdmVJdGVyYXRvclByb3RvdHlwZSIsIkdwIiwiZGlzcGxheU5hbWUiLCJkZWZpbmVJdGVyYXRvck1ldGhvZHMiLCJpc0dlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuRnVuIiwiY3RvciIsImF3cmFwIiwiX19hd2FpdCIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJyZWNvcmQiLCJ1bndyYXBwZWQiLCJwcmV2aW91c1Byb21pc2UiLCJlbnF1ZXVlIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJhc3luYyIsIml0ZXIiLCJkb25lUmVzdWx0IiwiZGVsZWdhdGUiLCJkZWxlZ2F0ZVJlc3VsdCIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwibG9jcyIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJyZXZlcnNlIiwicG9wIiwiaXRlcmF0b3JNZXRob2QiLCJpc05hTiIsInNraXBUZW1wUmVzZXQiLCJjaGFyQXQiLCJyb290RW50cnkiLCJyb290UmVjb3JkIiwicnZhbCIsImhhbmRsZSIsImxvYyIsImNhdWdodCIsImhhc0NhdGNoIiwiaGFzRmluYWxseSIsImZpbmFsbHlFbnRyeSIsImNvbXBsZXRlIiwiZmluaXNoIiwidGhyb3duIiwiZGVsZWdhdGVZaWVsZCIsIkZ1bmN0aW9uIiwiNzczIiwiNzc0IiwiQXhpb3MiLCJkZWZhdWx0cyIsImNyZWF0ZUluc3RhbmNlIiwiZGVmYXVsdENvbmZpZyIsInJlcXVlc3QiLCJleHRlbmQiLCJheGlvcyIsImluc3RhbmNlQ29uZmlnIiwibWVyZ2UiLCJDYW5jZWwiLCJDYW5jZWxUb2tlbiIsImlzQ2FuY2VsIiwicHJvbWlzZXMiLCJzcHJlYWQiLCI3NzUiLCJpc0J1ZmZlciIsImlzQXJyYXlCdWZmZXIiLCJpc0Zvcm1EYXRhIiwiRm9ybURhdGEiLCJpc0FycmF5QnVmZmVyVmlldyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzVW5kZWZpbmVkIiwiaXNPYmplY3QiLCJpc0RhdGUiLCJpc0ZpbGUiLCJpc0Jsb2IiLCJpc0Z1bmN0aW9uIiwiaXNTdHJlYW0iLCJwaXBlIiwiaXNVUkxTZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0cmltIiwic3RyIiwicmVwbGFjZSIsImlzU3RhbmRhcmRCcm93c2VyRW52IiwibmF2aWdhdG9yIiwicHJvZHVjdCIsImwiLCJhc3NpZ25WYWx1ZSIsIjc3NiIsIjc3NyIsImlzU2xvd0J1ZmZlciIsIl9pc0J1ZmZlciIsInJlYWRGbG9hdExFIiwiNzc4IiwiSW50ZXJjZXB0b3JNYW5hZ2VyIiwiZGlzcGF0Y2hSZXF1ZXN0IiwiaW50ZXJjZXB0b3JzIiwidG9Mb3dlckNhc2UiLCJjaGFpbiIsInVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzIiwiaW50ZXJjZXB0b3IiLCJ1bnNoaWZ0IiwiZnVsZmlsbGVkIiwicmVqZWN0ZWQiLCJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCJmb3JFYWNoTWV0aG9kTm9EYXRhIiwiZm9yRWFjaE1ldGhvZFdpdGhEYXRhIiwiNzc5Iiwibm9ybWFsaXplSGVhZGVyTmFtZSIsIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwiQ29udGVudC1UeXBlIiwic2V0Q29udGVudFR5cGVJZlVuc2V0IiwiZ2V0RGVmYXVsdEFkYXB0ZXIiLCJhZGFwdGVyIiwiWE1MSHR0cFJlcXVlc3QiLCJ0cmFuc2Zvcm1SZXF1ZXN0Iiwic3RyaW5naWZ5IiwidHJhbnNmb3JtUmVzcG9uc2UiLCJ0aW1lb3V0IiwieHNyZkNvb2tpZU5hbWUiLCJ4c3JmSGVhZGVyTmFtZSIsIm1heENvbnRlbnRMZW5ndGgiLCJ2YWxpZGF0ZVN0YXR1cyIsInN0YXR1cyIsImNvbW1vbiIsIkFjY2VwdCIsIjc4MCIsIm5vcm1hbGl6ZWROYW1lIiwicHJvY2Vzc0hlYWRlciIsInRvVXBwZXJDYXNlIiwiNzgxIiwic2V0dGxlIiwiYnVpbGRVUkwiLCJwYXJzZUhlYWRlcnMiLCJpc1VSTFNhbWVPcmlnaW4iLCJjcmVhdGVFcnJvciIsImJ0b2EiLCJ4aHJBZGFwdGVyIiwiZGlzcGF0Y2hYaHJSZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImxvYWRFdmVudCIsInhEb21haW4iLCJYRG9tYWluUmVxdWVzdCIsIm9ucHJvZ3Jlc3MiLCJoYW5kbGVQcm9ncmVzcyIsIm9udGltZW91dCIsImhhbmRsZVRpbWVvdXQiLCJhdXRoIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIkF1dGhvcml6YXRpb24iLCJvcGVuIiwicGFyYW1zIiwicGFyYW1zU2VyaWFsaXplciIsImhhbmRsZUxvYWQiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VVUkwiLCJyZXNwb25zZUhlYWRlcnMiLCJnZXRBbGxSZXNwb25zZUhlYWRlcnMiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVRleHQiLCJzdGF0dXNUZXh0IiwiaGFuZGxlRXJyb3IiLCJjb29raWVzIiwieHNyZlZhbHVlIiwid2l0aENyZWRlbnRpYWxzIiwicmVhZCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbkRvd25sb2FkUHJvZ3Jlc3MiLCJvblVwbG9hZFByb2dyZXNzIiwidXBsb2FkIiwiY2FuY2VsVG9rZW4iLCJvbkNhbmNlbGVkIiwic2VuZCIsIjc4MiIsIjc4MyIsImVuaGFuY2VFcnJvciIsImNvZGUiLCI3ODQiLCI3ODUiLCJlbmNvZGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzZXJpYWxpemVkUGFyYW1zIiwicGFydHMiLCJzZXJpYWxpemUiLCJwYXJzZVZhbHVlIiwidG9JU09TdHJpbmciLCI3ODYiLCJpZ25vcmVEdXBsaWNhdGVPZiIsInBhcnNlZCIsInBhcnNlciIsImxpbmUiLCJzdWJzdHIiLCI3ODciLCJzdGFuZGFyZEJyb3dzZXJFbnYiLCJtc2llIiwidGVzdCIsInVzZXJBZ2VudCIsInVybFBhcnNpbmdOb2RlIiwib3JpZ2luVVJMIiwicmVzb2x2ZVVSTCIsImhyZWYiLCJzZXRBdHRyaWJ1dGUiLCJwcm90b2NvbCIsImhvc3QiLCJzZWFyY2giLCJoYXNoIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJsb2NhdGlvbiIsInJlcXVlc3RVUkwiLCJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCI3ODgiLCJjaGFycyIsIkUiLCJibG9jayIsImNoYXJDb2RlIiwiaWR4IiwiY2hhckNvZGVBdCIsIjc4OSIsIndyaXRlIiwiZXhwaXJlcyIsInBhdGgiLCJkb21haW4iLCJzZWN1cmUiLCJjb29raWUiLCJ0b0dNVFN0cmluZyIsIlJlZ0V4cCIsImRlY29kZVVSSUNvbXBvbmVudCIsIjc5MCIsImhhbmRsZXJzIiwidXNlIiwiZWplY3QiLCJmb3JFYWNoSGFuZGxlciIsImgiLCI3OTEiLCJ0cmFuc2Zvcm1EYXRhIiwiaXNBYnNvbHV0ZVVSTCIsImNvbWJpbmVVUkxzIiwidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsInRocm93SWZSZXF1ZXN0ZWQiLCJiYXNlVVJMIiwiY2xlYW5IZWFkZXJDb25maWciLCJvbkFkYXB0ZXJSZXNvbHV0aW9uIiwib25BZGFwdGVyUmVqZWN0aW9uIiwicmVhc29uIiwiNzkyIiwiZm5zIiwiNzkzIiwiX19DQU5DRUxfXyIsIjc5NCIsIjc5NSIsInJlbGF0aXZlVVJMIiwiNzk2IiwiNzk3IiwiZXhlY3V0b3IiLCJwcm9taXNlRXhlY3V0b3IiLCJ0b2tlbiIsIjc5OCIsImNhbGxiYWNrIiwiMTEyNiIsInJlc3RyaWN0ZWRVc2VyUHJvamVjdHNCeU9y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QkFDSnFCLE9BQU87Z0JBQ1B1NkIsVUFBVTtnQkFDVkMsUUFBUSIsImZpbGUiOiJ1c2VyUHJvamVjdHMtYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2VicGFja0pzb25wKFsxXSx7XG5cbi8qKiovIDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHR2YXIgX3JlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0XG5cdHZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXHRcblx0dmFyIF9yZWFjdERvbSA9IF9fd2VicGFja19yZXF1aXJlX18oMzcpO1xuXHRcblx0dmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cdFxuXHR2YXIgX0FwcCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM1KTtcblx0XG5cdHZhciBfQXBwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FwcCk7XG5cdFxuXHR2YXIgX3JlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOTcpO1xuXHRcblx0dmFyIF9yZWR1eFNhZ2EgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczOCk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eFNhZ2EpO1xuXHRcblx0dmFyIF9yZWFjdFJlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxODQpO1xuXHRcblx0dmFyIF9yZWR1Y2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTQpO1xuXHRcblx0dmFyIF9zYWdhcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzcxKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHQvLyBjcmVhdGUgdGhlIHNhZ2EgbWlkZGxld2FyZVxuXHQvKlxuXHQgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0IEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0dmFyIHNhZ2FNaWRkbGV3YXJlID0gKDAsIF9yZWR1eFNhZ2EyLmRlZmF1bHQpKCk7XG5cdFxuXHQvLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuXHR2YXIgcmVkdXhEZXZUb29scyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCk7XG5cdFxuXHR2YXIgc3RvcmUgPSB2b2lkIDA7XG5cdGlmIChyZWR1eERldlRvb2xzKSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguY29tcG9zZSkoKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKHNhZ2FNaWRkbGV3YXJlKSwgcmVkdXhEZXZUb29scykpO1xuXHR9IGVsc2Uge1xuXHQgICAgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShfcmVkdWNlci5yZWR1Y2VyLCAoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpKTtcblx0fVxuXHRcblx0c2FnYU1pZGRsZXdhcmUucnVuKF9zYWdhcy53YXRjaGVyU2FnYSk7XG5cdFxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICBfcmVhY3REb20yLmRlZmF1bHQucmVuZGVyKF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIF9yZWFjdFJlZHV4LlByb3ZpZGVyLFxuXHQgICAgICAgIHsgc3RvcmU6IHN0b3JlIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0FwcDIuZGVmYXVsdCwgbnVsbClcblx0ICAgICksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclByb2plY3RzXCIpKTtcblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0dmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzYpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfbW9ja0RhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExMjYpO1xuXHRcblx0dmFyIF9tb2NrRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2NrRGF0YSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblx0XG5cdGZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfSAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHR2YXIgSXNSZXN0cmljdGVkID0gZnVuY3Rpb24gSXNSZXN0cmljdGVkKF9yZWYpIHtcblx0ICAgIHZhciBfID0gX3JlZi5fLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmLm9uQ2hhbmdlSXNSZXN0cmljdGVkO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcImxhYmVsXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHQgICAgICAgICAgICAgICAgaWQ6IFwiaXNfcmVzdHJpY3RlZFwiLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBvbkNoYW5nZUlzUmVzdHJpY3RlZFxuXHQgICAgICAgICAgICB9KSxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtcblx0ICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgX19odG1sOiBpc19yZXN0cmljdGVkID8gXyhcInVzZXJfYWNjZXNzX3Jlc3RyaWN0ZWRcIikgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHQgICAgICAgICAgICBjbGFzc05hbWU6IFwicmVzdHJpY3RlZEluZm9cIixcblx0ICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBfKFwicmVzdHJpY3RlZF9pbmZvXCIpIH1cblx0ICAgICAgICB9KSA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwpXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFByb2plY3QgPSBmdW5jdGlvbiBQcm9qZWN0KF9yZWYyKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYyLl8sXG5cdCAgICAgICAgcHJvamVjdCA9IF9yZWYyLnByb2plY3QsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9yZWYyLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYyLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmMi5vbkNoYW5nZVByb2plY3RTZWxlY3RlZDtcblx0XG5cdCAgICAvLyBOT1RFOiB0aGUgY2hlY2tlZCB2YWx1ZSBpcyBzZXQgdG8gdHJ1ZSBpZiBpc19yZXN0cmljdGVkIGlzIGZhbHNlLiBUaGlzIGlzIHNvIHRoYXQgdGhlIGxpc3Qgb2Zcblx0ICAgIC8vIHByb2plY3RzIGxvb2tzIGxpa2UgYWxsIHByb2plY3RzIGFyZSBzZWxlY3RlZCB3aGVuIHJlc3RyaWN0aW9ucyBhcmUgbm90IGluIGZvcmNlLlxuXHQgICAgLy8gVGhpcyBpcyBfbm90XyByZWZsZWN0ZWQgaW4gdGhlIHN0b3JlLlxuXHQgICAgdmFyIHVpU2V0dGluZ3MgPSBmdW5jdGlvbiB1aVNldHRpbmdzKHByb2plY3QsIHVzZXJfcHJvamVjdHMsIGlzX3Jlc3RyaWN0ZWQpIHtcblx0ICAgICAgICB2YXIgY2hlY2tlZCA9ICFpc19yZXN0cmljdGVkIHx8IHVzZXJfcHJvamVjdHMgJiYgKDAsIF91dGlscy5pbkFycmF5KShwcm9qZWN0LmlkLCB1c2VyX3Byb2plY3RzKSxcblx0ICAgICAgICAgICAgZGlzYWJsZWQgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIixcblx0ICAgICAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcblx0ICAgICAgICAgICAgdHJDbGFzc05hbWUgPSBkaXNhYmxlZCArIHByb2plY3RTZWxlY3RlZCxcblx0ICAgICAgICAgICAgaWRDbGFzc05hbWUgPSBkaXNhYmxlZCArIFwiIGlkXCI7XG5cdCAgICAgICAgcmV0dXJuIHsgY2hlY2tlZDogY2hlY2tlZCwgdHJDbGFzc05hbWU6IHRyQ2xhc3NOYW1lLCBpZENsYXNzTmFtZTogaWRDbGFzc05hbWUgfTtcblx0ICAgIH07XG5cdFxuXHQgICAgdmFyIF91aVNldHRpbmdzID0gdWlTZXR0aW5ncyhwcm9qZWN0LCB1c2VyX3Byb2plY3RzLCBpc19yZXN0cmljdGVkKSxcblx0ICAgICAgICBjaGVja2VkID0gX3VpU2V0dGluZ3MuY2hlY2tlZCxcblx0ICAgICAgICB0ckNsYXNzTmFtZSA9IF91aVNldHRpbmdzLnRyQ2xhc3NOYW1lLFxuXHQgICAgICAgIGlkQ2xhc3NOYW1lID0gX3VpU2V0dGluZ3MuaWRDbGFzc05hbWU7XG5cdFxuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwidHJcIixcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IHRyQ2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZCxcblx0ICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICB7IGNsYXNzTmFtZTogaWRDbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgcHJvamVjdC5pZFxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFNlbGVjdEFsbCA9IGZ1bmN0aW9uIFNlbGVjdEFsbChfcmVmMykge1xuXHQgICAgdmFyIF8gPSBfcmVmMy5fLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWYzLnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmMy5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYzLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgdmFyIHVpU2V0dGluZ3MgPSBmdW5jdGlvbiB1aVNldHRpbmdzKGlzX3Jlc3RyaWN0ZWQpIHtcblx0ICAgICAgICB2YXIgYnV0dG9uQ2xhc3MgPSBcInNlbGVjdEFsbFByb2plY3RzXCIgKyAoaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcIiBkaXNhYmxlZFwiKSxcblx0ICAgICAgICAgICAgZGlzYWJsZWQgPSAhaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgZGl2Q2xhc3MgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIjtcblx0ICAgICAgICByZXR1cm4geyBidXR0b25DbGFzczogYnV0dG9uQ2xhc3MsIGRpc2FibGVkOiBkaXNhYmxlZCwgZGl2Q2xhc3M6IGRpdkNsYXNzIH07XG5cdCAgICB9O1xuXHRcblx0ICAgIHZhciBfdWlTZXR0aW5nczIgPSB1aVNldHRpbmdzKGlzX3Jlc3RyaWN0ZWQpLFxuXHQgICAgICAgIGRpdkNsYXNzID0gX3VpU2V0dGluZ3MyLmRpdkNsYXNzLFxuXHQgICAgICAgIGRpc2FibGVkID0gX3VpU2V0dGluZ3MyLmRpc2FibGVkLFxuXHQgICAgICAgIGJ1dHRvbkNsYXNzID0gX3VpU2V0dGluZ3MyLmJ1dHRvbkNsYXNzO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBkaXZDbGFzcyB9LFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcImJ1dHRvblwiLFxuXHQgICAgICAgICAgICB7IG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCwgZGlzYWJsZWQ6IGRpc2FibGVkLCBjbGFzc05hbWU6IGJ1dHRvbkNsYXNzIH0sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA/IF8oXCJjaGVja19hbGxfcHJvamVjdHNcIikgOiBfKFwidW5jaGVja19hbGxfcHJvamVjdHNcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEVycm9yID0gZnVuY3Rpb24gRXJyb3IoX3JlZjQpIHtcblx0ICAgIHZhciBfID0gX3JlZjQuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY0LmVycm9yO1xuXHRcblx0ICAgIHJldHVybiBlcnJvciA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IFwiZXJyb3JcIiB9LFxuXHQgICAgICAgIF8oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZVxuXHQgICAgKSA6IG51bGw7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdHMgPSBmdW5jdGlvbiBQcm9qZWN0cyhfcmVmNSkge1xuXHQgICAgdmFyIF8gPSBfcmVmNS5fLFxuXHQgICAgICAgIGVycm9yID0gX3JlZjUuZXJyb3IsXG5cdCAgICAgICAgcHJvamVjdHMgPSBfcmVmNS5wcm9qZWN0cyxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmNS5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwic3BhblwiLFxuXHQgICAgICAgIG51bGwsXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoRXJyb3IsIHsgXzogXywgZXJyb3I6IGVycm9yIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFNlbGVjdEFsbCwge1xuXHQgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWRcblx0ICAgICAgICB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0YWJsZVwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgIFwidGhlYWRcIixcblx0ICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICBcInRyXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJhY2Nlc3NcIilcblx0ICAgICAgICAgICAgICAgICAgICApLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcInByb2plY3RfaWRcIilcblx0ICAgICAgICAgICAgICAgICAgICApLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcInByb2plY3RfdGl0bGVcIilcblx0ICAgICAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0Ym9keVwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdCwge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3QsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgQXBwID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcblx0ICAgIF9pbmhlcml0cyhBcHAsIF9SZWFjdCRDb21wb25lbnQpO1xuXHRcblx0ICAgIGZ1bmN0aW9uIEFwcChwcm9wcykge1xuXHQgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBcHApO1xuXHRcblx0ICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQXBwLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQXBwKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXHRcblx0ICAgICAgICBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkID0gX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLl8gPSBfdGhpcy5fLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIHJldHVybiBfdGhpcztcblx0ICAgIH1cblx0XG5cdCAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuXHRcblx0XG5cdCAgICBfY3JlYXRlQ2xhc3MoQXBwLCBbe1xuXHQgICAgICAgIGtleTogXCJfXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF8ocykge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZUlzUmVzdHJpY3RlZFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdEFsbFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdCAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVByb2plY3RTZWxlY3Rpb24oaWQpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0ICAgICAgICAgICAgdmFyIHVzZXJJZCA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItdG8tcmVzdHJpY3RcIikuaWQ7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyB1c2VySWQ6IHVzZXJJZCB9KTtcblx0XG5cdCAgICAgICAgICAgIHZhciBzdHJpbmdzID0gKDAsIF91dGlscy5kYXRhRnJvbUVsZW1lbnQpKFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5nczogc3RyaW5ncyB9KTtcblx0XG5cdCAgICAgICAgICAgIC8vIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgcHJvamVjdHM6IF9tb2NrRGF0YTIuZGVmYXVsdCB9KTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInJlbmRlclwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdCAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzLFxuXHQgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9wcm9wcy5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gX3Byb3BzLnNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cyA9IF9wcm9wcy5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX3Byb3BzLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICBlcnJvciA9IF9wcm9wcy5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgIHJldHVybiBhbGxfcHJvamVjdHMgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9qZWN0cywge1xuXHQgICAgICAgICAgICAgICAgXzogdGhpcy5fLFxuXHQgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG5cdCAgICAgICAgICAgICAgICAvLyBpc19yZXN0cmljdGVkPXtpc19yZXN0cmljdGVkfVxuXHQgICAgICAgICAgICAgICAgLCBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIHByb2plY3RzOiBhbGxfcHJvamVjdHNcblx0ICAgICAgICAgICAgICAgIC8vIHVzZXJfcHJvamVjdHM9e3VzZXJfcHJvamVjdHN9XG5cdCAgICAgICAgICAgICAgICAvLyBvbkNoYW5nZUlzUmVzdHJpY3RlZD17dGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWR9XG5cdCAgICAgICAgICAgICAgICAsIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICgwLCBfdXRpbHMuXykoXCJsb2FkaW5nXCIpXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXHQgICAgfV0pO1xuXHRcblx0ICAgIHJldHVybiBBcHA7XG5cdH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cdFxuXHR2YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdCAgICB2YXIgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gc3RhdGUuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBzdGF0ZS5zZWxlY3RBbGwsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgc3RyaW5ncyA9IHN0YXRlLnN0cmluZ3M7XG5cdFxuXHQgICAgcmV0dXJuIHsgZmV0Y2hpbmc6IGZldGNoaW5nLCBlcnJvcjogZXJyb3IsIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGw6IHNlbGVjdEFsbCwgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cywgc3RyaW5nczogc3RyaW5ncyB9O1xuXHR9O1xuXHRcblx0dmFyIG1hcERpc3BhdGNoVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBvbkZldGNoVXNlclByb2plY3RzOiBmdW5jdGlvbiBvbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5BUElfR0VUX0lOSVQsXG5cdCAgICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJJZDogdXNlcklkIH1cblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBzZXRTdG9yZTogZnVuY3Rpb24gc2V0U3RvcmUoZGF0YSkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5TRVRfU1RPUkUsXG5cdCAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBmdW5jdGlvbiBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24ocHJvamVjdElkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTixcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkOiBwcm9qZWN0SWQgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlSXNSZXN0cmljdGVkOiBmdW5jdGlvbiBvblVwZGF0ZUlzUmVzdHJpY3RlZChpc19yZXN0cmljdGVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9JU19SRVNUUklDVEVELFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkIH1cblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZVNlbGVjdEFsbDogZnVuY3Rpb24gb25VcGRhdGVTZWxlY3RBbGwoKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQXBwKTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdGV4cG9ydHMuZGF0YUZyb21FbGVtZW50ID0gZXhwb3J0cy5pbkFycmF5ID0gZXhwb3J0cy5lbmRwb2ludHMgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3N0b3JlID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMDQpO1xuXHRcblx0dmFyIF9zdG9yZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdG9yZSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGVuZHBvaW50cyA9IGV4cG9ydHMuZW5kcG9pbnRzID0ge1xuXHQgICAgdXNlcl9wcm9qZWN0c19hY2Nlc3M6IGZ1bmN0aW9uIHVzZXJfcHJvamVjdHNfYWNjZXNzKGlkKSB7XG5cdCAgICAgICAgcmV0dXJuIFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyBpZCArIFwiLz9mb3JtYXQ9anNvblwiO1xuXHQgICAgfVxuXHR9OyAvKlxuXHQgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAqL1xuXHRcblx0dmFyIGluQXJyYXkgPSBleHBvcnRzLmluQXJyYXkgPSBmdW5jdGlvbiBpbkFycmF5KG9iaiwgYXJyKSB7XG5cdCAgICByZXR1cm4gYXJyICYmIGFyci5pbmRleE9mKG9iaikgIT09IC0xO1xuXHR9O1xuXHRcblx0dmFyIGRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuZGF0YUZyb21FbGVtZW50ID0gZnVuY3Rpb24gZGF0YUZyb21FbGVtZW50KGVsZW1lbnROYW1lKSB7XG5cdCAgICByZXR1cm4gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkuaW5uZXJIVE1MKTtcblx0fTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdC8qXG5cdCAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICovXG5cdFxuXHQvLyBhY3Rpb24gdHlwZXNcblx0dmFyIC8vXG5cdFNFVF9TVE9SRSA9IGV4cG9ydHMuU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcblx0XG5cdC8vXG5cdEFQSV9HRVRfSU5JVCA9IGV4cG9ydHMuQVBJX0dFVF9JTklUID0gXCJBUElfR0VUX0lOSVRcIixcblx0ICAgIEFQSV9HRVRfU1VDQ0VTUyA9IGV4cG9ydHMuQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcblx0ICAgIEFQSV9HRVRfRkFJTFVSRSA9IGV4cG9ydHMuQVBJX0dFVF9GQUlMVVJFID0gXCJBUElfR0VUX0ZBSUxVUkVcIixcblx0XG5cdC8vXG5cdEFQSV9QVVRfSU5JVCA9IGV4cG9ydHMuQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcblx0ICAgIEFQSV9QVVRfU1VDQ0VTUyA9IGV4cG9ydHMuQVBJX1BVVF9TVUNDRVNTID0gXCJBUElfUFVUX1NVQ0NFU1NcIixcblx0ICAgIEFQSV9QVVRfRkFJTFVSRSA9IGV4cG9ydHMuQVBJX1BVVF9GQUlMVVJFID0gXCJBUElfUFVUX0ZBSUxVUkVcIixcblx0XG5cdC8vXG5cdFVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IGV4cG9ydHMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OID0gXCJVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT05cIixcblx0ICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gZXhwb3J0cy5VUERBVEVfSVNfUkVTVFJJQ1RFRCA9IFwiVVBEQVRFX0lTX1JFU1RSSUNURURcIixcblx0ICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gZXhwb3J0cy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IFwiVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFNcIjtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzM5KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0VORCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9jaGFubmVsLkVORDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2V2ZW50Q2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9jaGFubmVsLmV2ZW50Q2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5jaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdidWZmZXJzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2J1ZmZlcnMuYnVmZmVycztcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlRXZlcnk7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3Q7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50aHJvdHRsZTtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlbGF5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmRlbGF5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0FOQ0VMJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLkNBTkNFTDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RldGFjaCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5kZXRhY2g7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfbWlkZGxld2FyZSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUyKTtcblx0XG5cdHZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblx0XG5cdHZhciBfdXRpbHMyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUzKTtcblx0XG5cdHZhciB1dGlscyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMyKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gX21pZGRsZXdhcmUyLmRlZmF1bHQ7XG5cdGV4cG9ydHMuZWZmZWN0cyA9IGVmZmVjdHM7XG5cdGV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuLyoqKi8gfSksXG5cbi8qKiovIDczOTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucnVuU2FnYSA9IHJ1blNhZ2E7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBSVU5fU0FHQV9TSUdOQVRVUkUgPSAncnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSwgLi4uYXJncyknO1xuXHR2YXIgTk9OX0dFTkVSQVRPUl9FUlIgPSBSVU5fU0FHQV9TSUdOQVRVUkUgKyAnOiBzYWdhIGFyZ3VtZW50IG11c3QgYmUgYSBHZW5lcmF0b3IgZnVuY3Rpb24hJztcblx0XG5cdGZ1bmN0aW9uIHJ1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHN0b3JlSW50ZXJmYWNlKSkge1xuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG5cdCAgICAgICgwLCBfdXRpbHMubG9nKSgnd2FybicsICdydW5TYWdhKGl0ZXJhdG9yLCBzdG9yZUludGVyZmFjZSkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgUlVOX1NBR0FfU0lHTkFUVVJFKTtcblx0ICAgIH1cblx0ICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG5cdCAgICBzdG9yZUludGVyZmFjZSA9IHNhZ2E7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgICBpdGVyYXRvciA9IHNhZ2EuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PTl9HRU5FUkFUT1JfRVJSKTtcblx0ICB9XG5cdFxuXHQgIHZhciBfc3RvcmVJbnRlcmZhY2UgPSBzdG9yZUludGVyZmFjZSxcblx0ICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcblx0ICAgICAgZGlzcGF0Y2ggPSBfc3RvcmVJbnRlcmZhY2UuZGlzcGF0Y2gsXG5cdCAgICAgIGdldFN0YXRlID0gX3N0b3JlSW50ZXJmYWNlLmdldFN0YXRlLFxuXHQgICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG5cdCAgICAgIHNhZ2FNb25pdG9yID0gX3N0b3JlSW50ZXJmYWNlLnNhZ2FNb25pdG9yLFxuXHQgICAgICBsb2dnZXIgPSBfc3RvcmVJbnRlcmZhY2UubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cdFxuXHRcblx0ICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblx0XG5cdCAgaWYgKHNhZ2FNb25pdG9yKSB7XG5cdCAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkID0gc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCA9IHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgfHwgX3V0aWxzLm5vb3A7XG5cdFxuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCByb290OiB0cnVlLCBwYXJlbnRFZmZlY3RJZDogMCwgZWZmZWN0OiB7IHJvb3Q6IHRydWUsIHNhZ2E6IHNhZ2EsIGFyZ3M6IGFyZ3MgfSB9KTtcblx0ICB9XG5cdFxuXHQgIHZhciB0YXNrID0gKDAsIF9wcm9jMi5kZWZhdWx0KShpdGVyYXRvciwgc3Vic2NyaWJlLCAoMCwgX3V0aWxzLndyYXBTYWdhRGlzcGF0Y2gpKGRpc3BhdGNoKSwgZ2V0U3RhdGUsIGNvbnRleHQsIHsgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLCBsb2dnZXI6IGxvZ2dlciwgb25FcnJvcjogb25FcnJvciB9LCBlZmZlY3RJZCwgc2FnYS5uYW1lKTtcblx0XG5cdCAgaWYgKHNhZ2FNb25pdG9yKSB7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgdGFzayk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gdGFzaztcblx0fVxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdGV4cG9ydHMuY2hlY2sgPSBjaGVjaztcblx0ZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5cdGV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuXHRleHBvcnRzLmRlZmVycmVkID0gZGVmZXJyZWQ7XG5cdGV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuXHRleHBvcnRzLmRlbGF5ID0gZGVsYXk7XG5cdGV4cG9ydHMuY3JlYXRlTW9ja1Rhc2sgPSBjcmVhdGVNb2NrVGFzaztcblx0ZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcblx0ZXhwb3J0cy5tYWtlSXRlcmF0b3IgPSBtYWtlSXRlcmF0b3I7XG5cdGV4cG9ydHMubG9nID0gbG9nO1xuXHRleHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcblx0dmFyIHN5bSA9IGV4cG9ydHMuc3ltID0gZnVuY3Rpb24gc3ltKGlkKSB7XG5cdCAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvJyArIGlkO1xuXHR9O1xuXHRcblx0dmFyIFRBU0sgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5UQVNLID0gc3ltKCdUQVNLJyk7XG5cdHZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xuXHR2YXIgTUFUQ0ggPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5NQVRDSCA9IHN5bSgnTUFUQ0gnKTtcblx0dmFyIENBTkNFTCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkNBTkNFTCA9IHN5bSgnQ0FOQ0VMX1BST01JU0UnKTtcblx0dmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG5cdHZhciBTRUxGX0NBTkNFTExBVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNFTEZfQ0FOQ0VMTEFUSU9OID0gc3ltKCdTRUxGX0NBTkNFTExBVElPTicpO1xuXHR2YXIga29uc3QgPSBleHBvcnRzLmtvbnN0ID0gZnVuY3Rpb24ga29uc3Qodikge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdjtcblx0ICB9O1xuXHR9O1xuXHR2YXIga1RydWUgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rVHJ1ZSA9IGtvbnN0KHRydWUpO1xuXHR2YXIga0ZhbHNlID0gLyojX19QVVJFX18qL2V4cG9ydHMua0ZhbHNlID0ga29uc3QoZmFsc2UpO1xuXHR2YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblx0dmFyIGlkZW50ID0gZXhwb3J0cy5pZGVudCA9IGZ1bmN0aW9uIGlkZW50KHYpIHtcblx0ICByZXR1cm4gdjtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIGNoZWNrKHZhbHVlLCBwcmVkaWNhdGUsIGVycm9yKSB7XG5cdCAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG5cdCAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0IGNoZWNrJywgZXJyb3IpO1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cdGZ1bmN0aW9uIGhhc093bihvYmplY3QsIHByb3BlcnR5KSB7XG5cdCAgcmV0dXJuIGlzLm5vdFVuZGVmKG9iamVjdCkgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcblx0fVxuXHRcblx0dmFyIGlzID0gZXhwb3J0cy5pcyA9IHtcblx0ICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuXHQgICAgcmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkO1xuXHQgIH0sXG5cdCAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuXHQgICAgcmV0dXJuIHR5cGVvZiBmID09PSAnZnVuY3Rpb24nO1xuXHQgIH0sXG5cdCAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuXHQgICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJztcblx0ICB9LFxuXHQgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZyc7XG5cdCAgfSxcblx0ICBhcnJheTogQXJyYXkuaXNBcnJheSxcblx0ICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdChvYmopIHtcblx0ICAgIHJldHVybiBvYmogJiYgIWlzLmFycmF5KG9iaikgJiYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG9iaikpID09PSAnb2JqZWN0Jztcblx0ICB9LFxuXHQgIHByb21pc2U6IGZ1bmN0aW9uIHByb21pc2UocCkge1xuXHQgICAgcmV0dXJuIHAgJiYgaXMuZnVuYyhwLnRoZW4pO1xuXHQgIH0sXG5cdCAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGl0KSB7XG5cdCAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhpdC5uZXh0KSAmJiBpcy5mdW5jKGl0LnRocm93KTtcblx0ICB9LFxuXHQgIGl0ZXJhYmxlOiBmdW5jdGlvbiBpdGVyYWJsZShpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoU3ltYm9sKSA/IGlzLmZ1bmMoaXRbU3ltYm9sLml0ZXJhdG9yXSkgOiBpcy5hcnJheShpdCk7XG5cdCAgfSxcblx0ICB0YXNrOiBmdW5jdGlvbiB0YXNrKHQpIHtcblx0ICAgIHJldHVybiB0ICYmIHRbVEFTS107XG5cdCAgfSxcblx0ICBvYnNlcnZhYmxlOiBmdW5jdGlvbiBvYnNlcnZhYmxlKG9iKSB7XG5cdCAgICByZXR1cm4gb2IgJiYgaXMuZnVuYyhvYi5zdWJzY3JpYmUpO1xuXHQgIH0sXG5cdCAgYnVmZmVyOiBmdW5jdGlvbiBidWZmZXIoYnVmKSB7XG5cdCAgICByZXR1cm4gYnVmICYmIGlzLmZ1bmMoYnVmLmlzRW1wdHkpICYmIGlzLmZ1bmMoYnVmLnRha2UpICYmIGlzLmZ1bmMoYnVmLnB1dCk7XG5cdCAgfSxcblx0ICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKHBhdCkge1xuXHQgICAgcmV0dXJuIHBhdCAmJiAoaXMuc3RyaW5nKHBhdCkgfHwgKHR5cGVvZiBwYXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhdCkpID09PSAnc3ltYm9sJyB8fCBpcy5mdW5jKHBhdCkgfHwgaXMuYXJyYXkocGF0KSk7XG5cdCAgfSxcblx0ICBjaGFubmVsOiBmdW5jdGlvbiBjaGFubmVsKGNoKSB7XG5cdCAgICByZXR1cm4gY2ggJiYgaXMuZnVuYyhjaC50YWtlKSAmJiBpcy5mdW5jKGNoLmNsb3NlKTtcblx0ICB9LFxuXHQgIGhlbHBlcjogZnVuY3Rpb24gaGVscGVyKGl0KSB7XG5cdCAgICByZXR1cm4gaXQgJiYgaXRbSEVMUEVSXTtcblx0ICB9LFxuXHQgIHN0cmluZ2FibGVGdW5jOiBmdW5jdGlvbiBzdHJpbmdhYmxlRnVuYyhmKSB7XG5cdCAgICByZXR1cm4gaXMuZnVuYyhmKSAmJiBoYXNPd24oZiwgJ3RvU3RyaW5nJyk7XG5cdCAgfVxuXHR9O1xuXHRcblx0dmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuXHQgIGFzc2lnbjogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG5cdCAgICBmb3IgKHZhciBpIGluIHNvdXJjZSkge1xuXHQgICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcblx0ICAgICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcblx0ICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXHQgIGlmIChpbmRleCA+PSAwKSB7XG5cdCAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgIH1cblx0fVxuXHRcblx0dmFyIGFycmF5ID0gZXhwb3J0cy5hcnJheSA9IHtcblx0ICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuXHQgICAgdmFyIGFyciA9IEFycmF5KG9iai5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSBpbiBvYmopIHtcblx0ICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG5cdCAgICAgICAgYXJyW2ldID0gb2JqW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gYXJyO1xuXHQgIH1cblx0fTtcblx0XG5cdGZ1bmN0aW9uIGRlZmVycmVkKCkge1xuXHQgIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cdFxuXHQgIHZhciBkZWYgPSBfZXh0ZW5kcyh7fSwgcHJvcHMpO1xuXHQgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgZGVmLnJlc29sdmUgPSByZXNvbHZlO1xuXHQgICAgZGVmLnJlamVjdCA9IHJlamVjdDtcblx0ICB9KTtcblx0ICBkZWYucHJvbWlzZSA9IHByb21pc2U7XG5cdCAgcmV0dXJuIGRlZjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gYXJyYXlPZkRlZmZlcmVkKGxlbmd0aCkge1xuXHQgIHZhciBhcnIgPSBbXTtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdCAgICBhcnIucHVzaChkZWZlcnJlZCgpKTtcblx0ICB9XG5cdCAgcmV0dXJuIGFycjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZGVsYXkobXMpIHtcblx0ICB2YXIgdmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXHRcblx0ICB2YXIgdGltZW91dElkID0gdm9pZCAwO1xuXHQgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0ICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gcmVzb2x2ZSh2YWwpO1xuXHQgICAgfSwgbXMpO1xuXHQgIH0pO1xuXHRcblx0ICBwcm9taXNlW0NBTkNFTF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHByb21pc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuXHQgIHZhciBfcmVmO1xuXHRcblx0ICB2YXIgcnVubmluZyA9IHRydWU7XG5cdCAgdmFyIF9yZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIF9lcnJvciA9IHZvaWQgMDtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltUQVNLXSA9IHRydWUsIF9yZWYuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgcmV0dXJuIHJ1bm5pbmc7XG5cdCAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdDtcblx0ICB9LCBfcmVmLmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICByZXR1cm4gX2Vycm9yO1xuXHQgIH0sIF9yZWYuc2V0UnVubmluZyA9IGZ1bmN0aW9uIHNldFJ1bm5pbmcoYikge1xuXHQgICAgcmV0dXJuIHJ1bm5pbmcgPSBiO1xuXHQgIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcblx0ICAgIHJldHVybiBfcmVzdWx0ID0gcjtcblx0ICB9LCBfcmVmLnNldEVycm9yID0gZnVuY3Rpb24gc2V0RXJyb3IoZSkge1xuXHQgICAgcmV0dXJuIF9lcnJvciA9IGU7XG5cdCAgfSwgX3JlZjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gYXV0b0luYygpIHtcblx0ICB2YXIgc2VlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiArK3NlZWQ7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblx0XG5cdHZhciBrVGhyb3cgPSBmdW5jdGlvbiBrVGhyb3coZXJyKSB7XG5cdCAgdGhyb3cgZXJyO1xuXHR9O1xuXHR2YXIga1JldHVybiA9IGZ1bmN0aW9uIGtSZXR1cm4odmFsdWUpIHtcblx0ICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcblx0fTtcblx0ZnVuY3Rpb24gbWFrZUl0ZXJhdG9yKG5leHQpIHtcblx0ICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblx0ICB2YXIgaXNIZWxwZXIgPSBhcmd1bWVudHNbM107XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHsgbmFtZTogbmFtZSwgbmV4dDogbmV4dCwgdGhyb3c6IHRocm8sIHJldHVybjoga1JldHVybiB9O1xuXHRcblx0ICBpZiAoaXNIZWxwZXIpIHtcblx0ICAgIGl0ZXJhdG9yW0hFTFBFUl0gPSB0cnVlO1xuXHQgIH1cblx0ICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvcjtcblx0ICAgIH07XG5cdCAgfVxuXHQgIHJldHVybiBpdGVyYXRvcjtcblx0fVxuXHRcblx0LyoqXG5cdCAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG5cdCAgKHdpdGggZXhwYW5kYWJsZSBlcnJvciBzdGFjayB0cmFjZXMpLCBvciBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnRcblx0ICAodGV4dC1vbmx5IGxvZyBvdXRwdXQpXG5cdCAqKi9cblx0ZnVuY3Rpb24gbG9nKGxldmVsLCBtZXNzYWdlKSB7XG5cdCAgdmFyIGVycm9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblx0XG5cdCAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cblx0ICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgY29uc29sZVtsZXZlbF0obWVzc2FnZSwgZXJyb3IpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSBsb2coJ3dhcm4nLCBkZXByZWNhdGlvbldhcm5pbmcpO1xuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgdXBkYXRlSW5jZW50aXZlID0gZXhwb3J0cy51cGRhdGVJbmNlbnRpdmUgPSBmdW5jdGlvbiB1cGRhdGVJbmNlbnRpdmUoZGVwcmVjYXRlZCwgcHJlZmVycmVkKSB7XG5cdCAgcmV0dXJuIGRlcHJlY2F0ZWQgKyAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIHByZWZlcnJlZCArICcsIHBsZWFzZSB1cGRhdGUgeW91ciBjb2RlJztcblx0fTtcblx0XG5cdHZhciBpbnRlcm5hbEVyciA9IGV4cG9ydHMuaW50ZXJuYWxFcnIgPSBmdW5jdGlvbiBpbnRlcm5hbEVycihlcnIpIHtcblx0ICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xuXHR9O1xuXHRcblx0dmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcblx0ICByZXR1cm4gKGN0eCA/IGN0eCArICcuJyA6ICcnKSArICdzZXRDb250ZXh0KHByb3BzKTogYXJndW1lbnQgJyArIHByb3BzICsgJyBpcyBub3QgYSBwbGFpbiBvYmplY3QnO1xuXHR9O1xuXHRcblx0dmFyIHdyYXBTYWdhRGlzcGF0Y2ggPSBleHBvcnRzLndyYXBTYWdhRGlzcGF0Y2ggPSBmdW5jdGlvbiB3cmFwU2FnYURpc3BhdGNoKGRpc3BhdGNoKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG5cdCAgfTtcblx0fTtcblx0XG5cdHZhciBjbG9uZWFibGVHZW5lcmF0b3IgPSBleHBvcnRzLmNsb25lYWJsZUdlbmVyYXRvciA9IGZ1bmN0aW9uIGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGhpc3RvcnkgPSBbXTtcblx0ICAgIHZhciBnZW4gPSBnZW5lcmF0b3JGdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuXHQgICAgICAgIGhpc3RvcnkucHVzaChhcmcpO1xuXHQgICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuXHQgICAgICB9LFxuXHQgICAgICBjbG9uZTogZnVuY3Rpb24gY2xvbmUoKSB7XG5cdCAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgICAgIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgICAgICByZXR1cm4gY2xvbmVkR2VuLm5leHQoYXJnKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgICByZXR1cm4gY2xvbmVkR2VuO1xuXHQgICAgICB9LFxuXHQgICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcblx0ICAgICAgICByZXR1cm4gZ2VuLnJldHVybih2YWx1ZSk7XG5cdCAgICAgIH0sXG5cdCAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi50aHJvdyhleGNlcHRpb24pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH07XG5cdH07XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQyKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHRmdW5jdGlvbiBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMob2JqLCBkZXNjcykgeyBmb3IgKHZhciBrZXkgaW4gZGVzY3MpIHsgdmFyIGRlc2MgPSBkZXNjc1trZXldOyBkZXNjLmNvbmZpZ3VyYWJsZSA9IGRlc2MuZW51bWVyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzYykgZGVzYy53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgZGVzYyk7IH0gcmV0dXJuIG9iajsgfVxuXHRcblx0dmFyIE5PVF9JVEVSQVRPUl9FUlJPUiA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gJ3Byb2MgZmlyc3QgYXJndW1lbnQgKFNhZ2EgZnVuY3Rpb24gcmVzdWx0KSBtdXN0IGJlIGFuIGl0ZXJhdG9yJztcblx0XG5cdHZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHQgIH1cblx0fTtcblx0dmFyIFRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5UQVNLX0NBTkNFTCA9IHtcblx0ICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9UQVNLX0NBTkNFTCc7XG5cdCAgfVxuXHR9O1xuXHRcblx0dmFyIG1hdGNoZXJzID0ge1xuXHQgIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMua1RydWU7XG5cdCAgfSxcblx0ICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG5cdCAgICByZXR1cm4gKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXR0ZXJuKSkgPT09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIHJldHVybiBpbnB1dC50eXBlID09PSBwYXR0ZXJuO1xuXHQgICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gU3RyaW5nKHBhdHRlcm4pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIGFycmF5OiBmdW5jdGlvbiBhcnJheShwYXR0ZXJucykge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuXHQgICAgICAgIHJldHVybiBtYXRjaGVyKHApKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgcHJlZGljYXRlOiBmdW5jdGlvbiBwcmVkaWNhdGUoX3ByZWRpY2F0ZSkge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gX3ByZWRpY2F0ZShpbnB1dCk7XG5cdCAgICB9O1xuXHQgIH1cblx0fTtcblx0XG5cdGZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuXHQgIC8vIHByZXR0aWVyLWlnbm9yZVxuXHQgIHJldHVybiAocGF0dGVybiA9PT0gJyonID8gbWF0Y2hlcnMud2lsZGNhcmQgOiBfdXRpbHMuaXMuYXJyYXkocGF0dGVybikgPyBtYXRjaGVycy5hcnJheSA6IF91dGlscy5pcy5zdHJpbmdhYmxlRnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLmRlZmF1bHQgOiBfdXRpbHMuaXMuZnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLnByZWRpY2F0ZSA6IG1hdGNoZXJzLmRlZmF1bHQpKHBhdHRlcm4pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuXHQgIEluIHRoZSBuZXcgZm9yayBtb2RlbCwgZm9ya2VkIHRhc2tzIGFyZSBhdHRhY2hlZCBieSBkZWZhdWx0IHRvIHRoZWlyIHBhcmVudFxuXHQgIFdlIG1vZGVsIHRoaXMgdXNpbmcgdGhlIGNvbmNlcHQgb2YgUGFyZW50IHRhc2sgJiYgbWFpbiBUYXNrXG5cdCAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuXHQgIGFnZ3JlZ2F0aW9uIG9mIHRoZSBtYWluIHRhc2tzICsgYWxsIGl0cyBmb3JrZWQgdGFza3MuXG5cdCAgVGh1cyB0aGUgd2hvbGUgbW9kZWwgcmVwcmVzZW50cyBhbiBleGVjdXRpb24gdHJlZSB3aXRoIG11bHRpcGxlIGJyYW5jaGVzICh2cyB0aGVcblx0ICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblx0XG5cdCAgQSBwYXJlbnQgdGFza3MgaGFzIHRoZSBmb2xsb3dpbmcgc2VtYW50aWNzXG5cdCAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuXHQgIC0gSWYgaXQncyBjYW5jZWxsZWQsIGFsbCBmb3JrcyBhcmUgY2FuY2VsbGVkIGFzIHdlbGxcblx0ICAtIEl0IGFib3J0cyBpZiBhbnkgdW5jYXVnaHQgZXJyb3IgYnViYmxlcyB1cCBmcm9tIGZvcmtzXG5cdCAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG5cdCoqL1xuXHRmdW5jdGlvbiBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGNiKSB7XG5cdCAgdmFyIHRhc2tzID0gW10sXG5cdCAgICAgIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgY29tcGxldGVkID0gZmFsc2U7XG5cdCAgYWRkVGFzayhtYWluVGFzayk7XG5cdFxuXHQgIGZ1bmN0aW9uIGFib3J0KGVycikge1xuXHQgICAgY2FuY2VsQWxsKCk7XG5cdCAgICBjYihlcnIsIHRydWUpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gYWRkVGFzayh0YXNrKSB7XG5cdCAgICB0YXNrcy5wdXNoKHRhc2spO1xuXHQgICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgKDAsIF91dGlscy5yZW1vdmUpKHRhc2tzLCB0YXNrKTtcblx0ICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIGFib3J0KHJlcyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgaWYgKHRhc2sgPT09IG1haW5UYXNrKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG5cdCAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgICAgY2IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICAvLyB0YXNrLmNvbnQuY2FuY2VsID0gdGFzay5jYW5jZWxcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcblx0ICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgdC5jb250ID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIHQuY2FuY2VsKCk7XG5cdCAgICB9KTtcblx0ICAgIHRhc2tzID0gW107XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgYWRkVGFzazogYWRkVGFzayxcblx0ICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuXHQgICAgYWJvcnQ6IGFib3J0LFxuXHQgICAgZ2V0VGFza3M6IGZ1bmN0aW9uIGdldFRhc2tzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3M7XG5cdCAgICB9LFxuXHQgICAgdGFza05hbWVzOiBmdW5jdGlvbiB0YXNrTmFtZXMoKSB7XG5cdCAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgICByZXR1cm4gdC5uYW1lO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVUYXNrSXRlcmF0b3IoX3JlZikge1xuXHQgIHZhciBjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBmbiA9IF9yZWYuZm4sXG5cdCAgICAgIGFyZ3MgPSBfcmVmLmFyZ3M7XG5cdFxuXHQgIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG5cdCAgICByZXR1cm4gZm47XG5cdCAgfVxuXHRcblx0ICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTIgYW5kICM0NDFcblx0ICB2YXIgcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBlcnJvciA9IHZvaWQgMDtcblx0ICB0cnkge1xuXHQgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdCAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICBlcnJvciA9IGVycjtcblx0ICB9XG5cdFxuXHQgIC8vIGkuZS4gYSBnZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJucyBhbiBpdGVyYXRvclxuXHQgIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSkge1xuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9XG5cdFxuXHQgIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG5cdCAgLy8gaW5zdGVhZCBjcmVhdGUgYSBmYWlsZWQgdGFzay4gU2VlICMxNTIgYW5kICM0NDFcblx0ICByZXR1cm4gZXJyb3IgPyAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuXHQgICAgdGhyb3cgZXJyb3I7XG5cdCAgfSkgOiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIHBjID0gdm9pZCAwO1xuXHQgICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcblx0ICAgIHZhciByZXQgPSBmdW5jdGlvbiByZXQodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH07XG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcblx0ICAgICAgaWYgKCFwYykge1xuXHQgICAgICAgIHBjID0gdHJ1ZTtcblx0ICAgICAgICByZXR1cm4gZWZmO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiByZXQoYXJnKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9KCkpO1xuXHR9XG5cdFxuXHR2YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG5cdCAgcmV0dXJuIHsgZm46IGhlbHBlciB9O1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcHJvYyhpdGVyYXRvcikge1xuXHQgIHZhciBzdWJzY3JpYmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9O1xuXHQgIHZhciBkaXNwYXRjaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcblx0ICB2YXIgcGFyZW50Q29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XG5cdCAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IHt9O1xuXHQgIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogJ2Fub255bW91cyc7XG5cdCAgdmFyIGNvbnQgPSBhcmd1bWVudHNbOF07XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PVF9JVEVSQVRPUl9FUlJPUik7XG5cdFxuXHQgIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG5cdCAgdmFyIHJ1blBhcmFsbGVsRWZmZWN0ID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHJ1bkFsbEVmZmVjdCwgKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKGVmZmVjdHNTdHJpbmcsICdhbGwoJyArIGVmZmVjdHNTdHJpbmcgKyAnKScpKTtcblx0XG5cdCAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG5cdCAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cdFxuXHQgIHZhciBsb2cgPSBsb2dnZXIgfHwgX3V0aWxzLmxvZztcblx0ICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbiBsb2dFcnJvcihlcnIpIHtcblx0ICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblx0XG5cdCAgICBpZiAoIW1lc3NhZ2UgJiYgZXJyLnN0YWNrKSB7XG5cdCAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG5cdCAgICB9XG5cdFxuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuXHQgIH07XG5cdCAgdmFyIHN0ZENoYW5uZWwgPSAoMCwgX2NoYW5uZWwuc3RkQ2hhbm5lbCkoc3Vic2NyaWJlKTtcblx0ICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuXHQgIC8qKlxuXHQgICAgVHJhY2tzIHRoZSBjdXJyZW50IGVmZmVjdCBjYW5jZWxsYXRpb25cblx0ICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG5cdCAgICBvbiBpdC4gSXQgYWxsb3dzIHByb3BhZ2F0aW5nIGNhbmNlbGxhdGlvbiB0byBjaGlsZCBlZmZlY3RzXG5cdCAgKiovXG5cdCAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgLyoqXG5cdCAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG5cdCAgICB0byB0cmFjayB0aGUgbWFpbiBmbG93IChiZXNpZGVzIG90aGVyIGZvcmtlZCB0YXNrcylcblx0ICAqKi9cblx0ICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcblx0ICB2YXIgbWFpblRhc2sgPSB7IG5hbWU6IG5hbWUsIGNhbmNlbDogY2FuY2VsTWFpbiwgaXNSdW5uaW5nOiB0cnVlIH07XG5cdCAgdmFyIHRhc2tRdWV1ZSA9IGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgZW5kKTtcblx0XG5cdCAgLyoqXG5cdCAgICBjYW5jZWxsYXRpb24gb2YgdGhlIG1haW4gdGFzay4gV2UnbGwgc2ltcGx5IHJlc3VtZSB0aGUgR2VuZXJhdG9yIHdpdGggYSBDYW5jZWxcblx0ICAqKi9cblx0ICBmdW5jdGlvbiBjYW5jZWxNYWluKCkge1xuXHQgICAgaWYgKG1haW5UYXNrLmlzUnVubmluZyAmJiAhbWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICBuZXh0KFRBU0tfQ0FOQ0VMKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cblx0ICAgIGNhbmNlbCBhbGwgcGVuZGluZyB0YXNrcyAoaW5jbHVkaW5nIHRoZSBtYWluIHRhc2spLCB0aGVuIGVuZCB0aGUgY3VycmVudCB0YXNrLlxuXHQgICAgIENhbmNlbGxhdGlvbiBwcm9wYWdhdGVzIGRvd24gdG8gdGhlIHdob2xlIGV4ZWN1dGlvbiB0cmVlIGhvbGRlZCBieSB0aGlzIFBhcmVudCB0YXNrXG5cdCAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcblx0ICAgICBDYW5jZWxsYXRpb24gaXMgbm9vcCBmb3IgdGVybWluYXRlZC9DYW5jZWxsZWQgdGFza3MgdGFza3Ncblx0ICAqKi9cblx0ICBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgICAvKipcblx0ICAgICAgV2UgbmVlZCB0byBjaGVjayBib3RoIFJ1bm5pbmcgYW5kIENhbmNlbGxlZCBzdGF0dXNcblx0ICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuXHQgICAgKiovXG5cdCAgICBpZiAoaXRlcmF0b3IuX2lzUnVubmluZyAmJiAhaXRlcmF0b3IuX2lzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG5cdCAgICAgIHRhc2tRdWV1ZS5jYW5jZWxBbGwoKTtcblx0ICAgICAgLyoqXG5cdCAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuXHQgICAgICAqKi9cblx0ICAgICAgZW5kKFRBU0tfQ0FOQ0VMKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG5cdCAgICB0aGlzIHdpbGwgcGVybWl0IGNhbmNlbGxhdGlvbiB0byBwcm9wYWdhdGUgZG93biB0aGUgY2FsbCBjaGFpblxuXHQgICoqL1xuXHQgIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblx0XG5cdCAgLy8gdHJhY2tzIHRoZSBydW5uaW5nIHN0YXR1c1xuXHQgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXHRcblx0ICAvLyBraWNrcyB1cCB0aGUgZ2VuZXJhdG9yXG5cdCAgbmV4dCgpO1xuXHRcblx0ICAvLyB0aGVuIHJldHVybiB0aGUgdGFzayBkZXNjcmlwdG9yIHRvIHRoZSBjYWxsZXJcblx0ICByZXR1cm4gdGFzaztcblx0XG5cdCAgLyoqXG5cdCAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG5cdCAgICBJdCdzIGEgcmVjdXJzaXZlIGFzeW5jL2NvbnRpbnVhdGlvbiBmdW5jdGlvbiB3aGljaCBjYWxscyBpdHNlbGZcblx0ICAgIHVudGlsIHRoZSBnZW5lcmF0b3IgdGVybWluYXRlcyBvciB0aHJvd3Ncblx0ICAqKi9cblx0ICBmdW5jdGlvbiBuZXh0KGFyZywgaXNFcnIpIHtcblx0ICAgIC8vIFByZXZlbnRpdmUgbWVhc3VyZS4gSWYgd2UgZW5kIHVwIGhlcmUsIHRoZW4gdGhlcmUgaXMgcmVhbGx5IHNvbWV0aGluZyB3cm9uZ1xuXHQgICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gcmVzdW1lIGFuIGFscmVhZHkgZmluaXNoZWQgZ2VuZXJhdG9yJyk7XG5cdCAgICB9XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IudGhyb3coYXJnKTtcblx0ICAgICAgfSBlbHNlIGlmIChhcmcgPT09IFRBU0tfQ0FOQ0VMKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBnZXR0aW5nIFRBU0tfQ0FOQ0VMIGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgbWFpbiB0YXNrXG5cdCAgICAgICAgICBXZSBjYW4gZ2V0IHRoaXMgdmFsdWUgaGVyZVxuXHQgICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcblx0ICAgICAgICAgIC0gQnkgam9pbmluZyBhIENhbmNlbGxlZCB0YXNrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgQ2FuY2VscyB0aGUgY3VycmVudCBlZmZlY3Q7IHRoaXMgd2lsbCBwcm9wYWdhdGUgdGhlIGNhbmNlbGxhdGlvbiBkb3duIHRvIGFueSBjYWxsZWQgdGFza3Ncblx0ICAgICAgICAqKi9cblx0ICAgICAgICBuZXh0LmNhbmNlbCgpO1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuXHQgICAgICAgICAgVGhpcyB3aWxsIGp1bXAgdG8gdGhlIGZpbmFsbHkgYmxvY2tcblx0ICAgICAgICAqKi9cblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBDSEFOTkVMX0VORCkge1xuXHQgICAgICAgIC8vIFdlIGdldCBDSEFOTkVMX0VORCBieSB0YWtpbmcgZnJvbSBhIGNoYW5uZWwgdGhhdCBlbmRlZCB1c2luZyBgdGFrZWAgKGFuZCBub3QgYHRha2VtYCB1c2VkIHRvIHRyYXAgRW5kIG9mIGNoYW5uZWxzKVxuXHQgICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoYXJnKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKCFyZXN1bHQuZG9uZSkge1xuXHQgICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcblx0ICAgICAgICAqKi9cblx0ICAgICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG5cdCAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuXHQgICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcblx0ICAgICAgfVxuXHQgICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG5cdCAgICAgIG1haW5UYXNrLmNvbnQoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gZW5kKHJlc3VsdCwgaXNFcnIpIHtcblx0ICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcblx0ICAgIHN0ZENoYW5uZWwuY2xvc2UoKTtcblx0ICAgIGlmICghaXNFcnIpIHtcblx0ICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZXNvbHZlKHJlc3VsdCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCAnc2FnYVN0YWNrJywge1xuXHQgICAgICAgICAgdmFsdWU6ICdhdCAnICsgbmFtZSArICcgXFxuICcgKyAocmVzdWx0LnNhZ2FTdGFjayB8fCByZXN1bHQuc3RhY2spLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcblx0ICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgJiYgb25FcnJvcikge1xuXHQgICAgICAgICAgb25FcnJvcihyZXN1bHQpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBsb2dFcnJvcihyZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBpdGVyYXRvci5fZXJyb3IgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9pc0Fib3J0ZWQgPSB0cnVlO1xuXHQgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuXHQgICAgfVxuXHQgICAgdGFzay5jb250ICYmIHRhc2suY29udChyZXN1bHQsIGlzRXJyKTtcblx0ICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG5cdCAgICAgIHJldHVybiBqLmNiKHJlc3VsdCwgaXNFcnIpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcblx0ICAgIHZhciBsYWJlbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgICB2YXIgY2IgPSBhcmd1bWVudHNbM107XG5cdFxuXHQgICAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdCAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQoeyBlZmZlY3RJZDogZWZmZWN0SWQsIHBhcmVudEVmZmVjdElkOiBwYXJlbnRFZmZlY3RJZCwgbGFiZWw6IGxhYmVsLCBlZmZlY3Q6IGVmZmVjdCB9KTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgY29tcGxldGlvbiBjYWxsYmFjayBhbmQgY2FuY2VsIGNhbGxiYWNrIGFyZSBtdXR1YWxseSBleGNsdXNpdmVcblx0ICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBBbmQgV2UgY2FuJ3QgY29tcGxldGUgYW4gYWxyZWFkeSBjYW5jZWxsZWQgZWZmZWN0SWRcblx0ICAgICoqL1xuXHQgICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cdFxuXHQgICAgLy8gQ29tcGxldGlvbiBjYWxsYmFjayBwYXNzZWQgdG8gdGhlIGFwcHJvcHJpYXRlIGVmZmVjdCBydW5uZXJcblx0ICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcblx0ICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdCAgICAgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgICAgIGlzRXJyID8gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQoZWZmZWN0SWQsIHJlcykgOiBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgcmVzKTtcblx0ICAgICAgfVxuXHQgICAgICBjYihyZXMsIGlzRXJyKTtcblx0ICAgIH1cblx0ICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuXHQgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHRcblx0ICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIGNhbmNlbGxpbmcgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG5cdCAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcblx0ICAgICAgLyoqXG5cdCAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcblx0ICAgICAgICBjYXRjaCB1bmNhdWdodCBjYW5jZWxsYXRpb25zIGVycm9yczsgc2luY2Ugd2UgY2FuIG5vIGxvbmdlciBjYWxsIHRoZSBjb21wbGV0aW9uXG5cdCAgICAgICAgY2FsbGJhY2ssIGxvZyBlcnJvcnMgcmFpc2VkIGR1cmluZyBjYW5jZWxsYXRpb25zIGludG8gdGhlIGNvbnNvbGVcblx0ICAgICAgKiovXG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgY3VyckNiLmNhbmNlbCgpO1xuXHQgICAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnIpO1xuXHQgICAgICB9XG5cdCAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblx0XG5cdCAgICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZChlZmZlY3RJZCk7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8qKlxuXHQgICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG5cdCAgICAgIGl0IGFsbG93cyB0aGlzIGdlbmVyYXRvciB0byBwcm9wYWdhdGUgY2FuY2VsbGF0aW9uIGRvd253YXJkLlxuXHQgICAgICAgQVRURU5USU9OISBlZmZlY3QgcnVubmVycyBtdXN0IHNldHVwIHRoZSBjYW5jZWwgbG9naWMgYnkgc2V0dGluZyBjYi5jYW5jZWwgPSBbY2FuY2VsTWV0aG9kXVxuXHQgICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG5cdCAgICAgICBUaGlzIGlzIGEgc29ydCBvZiBpbnZlcnNpb24gb2YgY29udHJvbDogY2FsbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgcmVzcG9uc2libGVcblx0ICAgICAgZm9yIGNvbXBsZXRpbmcgdGhlIGZsb3cgYnkgY2FsbGluZyB0aGUgcHJvdmlkZWQgY29udGludWF0aW9uOyB3aGlsZSBjYWxsZXIgZnVuY3Rpb25zXG5cdCAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cblx0ICAgICAgIExpYnJhcnkgdXNlcnMgY2FuIGF0dGFjaCB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHByb21pc2VzIGJ5IGRlZmluaW5nIGFcblx0ICAgICAgcHJvbWlzZVtDQU5DRUxdIG1ldGhvZCBpbiB0aGVpciByZXR1cm5lZCBwcm9taXNlc1xuXHQgICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuXHQgICAgKiovXG5cdCAgICB2YXIgZGF0YSA9IHZvaWQgMDtcblx0ICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgLy8gTm9uIGRlY2xhcmF0aXZlIGVmZmVjdFxuXHQgICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXHRcblx0ICAgICAgLy8gZGVjbGFyYXRpdmUgZWZmZWN0c1xuXHQgICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuXHQgICAgKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGNiKSB7XG5cdCAgICB2YXIgY2FuY2VsUHJvbWlzZSA9IHByb21pc2VbX3V0aWxzLkNBTkNFTF07XG5cdCAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcblx0ICAgICAgY2IuY2FuY2VsID0gY2FuY2VsUHJvbWlzZTtcblx0ICAgIH0gZWxzZSBpZiAoX3V0aWxzLmlzLmZ1bmMocHJvbWlzZS5hYm9ydCkpIHtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiBwcm9taXNlLmFib3J0KCk7XG5cdCAgICAgIH07XG5cdCAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cblx0ICAgICAgLy8gYWRkaW5nIGNhbmNlbCBzdXBwb3J0XG5cdCAgICB9XG5cdCAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlSXRlcmF0b3IoaXRlcmF0b3IsIGVmZmVjdElkLCBuYW1lLCBjYikge1xuXHQgICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjIuY2hhbm5lbCxcblx0ICAgICAgICBwYXR0ZXJuID0gX3JlZjIucGF0dGVybixcblx0ICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXHRcblx0ICAgIGNoYW5uZWwgPSBjaGFubmVsIHx8IHN0ZENoYW5uZWw7XG5cdCAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuXHQgICAgICByZXR1cm4gaW5wIGluc3RhbmNlb2YgRXJyb3IgPyBjYihpbnAsIHRydWUpIDogKDAsIF9jaGFubmVsLmlzRW5kKShpbnApICYmICFtYXliZSA/IGNiKENIQU5ORUxfRU5EKSA6IGNiKGlucCk7XG5cdCAgICB9O1xuXHQgICAgdHJ5IHtcblx0ICAgICAgY2hhbm5lbC50YWtlKHRha2VDYiwgbWF0Y2hlcihwYXR0ZXJuKSk7XG5cdCAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICBjYi5jYW5jZWwgPSB0YWtlQ2IuY2FuY2VsO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUHV0RWZmZWN0KF9yZWYzLCBjYikge1xuXHQgICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuXHQgICAgICAgIGFjdGlvbiA9IF9yZWYzLmFjdGlvbixcblx0ICAgICAgICByZXNvbHZlID0gX3JlZjMucmVzb2x2ZTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgU2NoZWR1bGUgdGhlIHB1dCBpbiBjYXNlIGFub3RoZXIgc2FnYSBpcyBob2xkaW5nIGEgbG9jay5cblx0ICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuXHQgICAgICB0aGlzIHB1dCBoYXMgdGVybWluYXRlZC5cblx0ICAgICoqL1xuXHQgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuXHQgICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgY2hhbm5lbCBvciBgcHV0LnJlc29sdmVgIHdhcyB1c2VkIHRoZW4gYnViYmxlIHVwIHRoZSBlcnJvci5cblx0ICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHJlc29sdmUgJiYgX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSkge1xuXHQgICAgICAgIHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBjYihyZXN1bHQpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIC8vIFB1dCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYWxsRWZmZWN0KF9yZWY0LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjQuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY0LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNC5hcmdzO1xuXHRcblx0ICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcblx0ICAgIHRyeSB7XG5cdCAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpID8gcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSA/IHJlc29sdmVJdGVyYXRvcihyZXN1bHQsIGVmZmVjdElkLCBmbi5uYW1lLCBjYikgOiBjYihyZXN1bHQpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ1BTRWZmZWN0KF9yZWY1LCBjYikge1xuXHQgICAgdmFyIGNvbnRleHQgPSBfcmVmNS5jb250ZXh0LFxuXHQgICAgICAgIGZuID0gX3JlZjUuZm4sXG5cdCAgICAgICAgYXJncyA9IF9yZWY1LmFyZ3M7XG5cdFxuXHQgICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG5cdCAgICAvLyBieSBzZXR0aW5nIGNhbmNlbCBmaWVsZCBvbiB0aGUgY2Jcblx0XG5cdCAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciBjcHNDYiA9IGZ1bmN0aW9uIGNwc0NiKGVyciwgcmVzKSB7XG5cdCAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG5cdCAgICAgIH07XG5cdCAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KGNwc0NiKSk7XG5cdCAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcblx0ICAgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICByZXR1cm4gY3BzQ2IuY2FuY2VsKCk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZvcmtFZmZlY3QoX3JlZjYsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGNvbnRleHQgPSBfcmVmNi5jb250ZXh0LFxuXHQgICAgICAgIGZuID0gX3JlZjYuZm4sXG5cdCAgICAgICAgYXJncyA9IF9yZWY2LmFyZ3MsXG5cdCAgICAgICAgZGV0YWNoZWQgPSBfcmVmNi5kZXRhY2hlZDtcblx0XG5cdCAgICB2YXIgdGFza0l0ZXJhdG9yID0gY3JlYXRlVGFza0l0ZXJhdG9yKHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH0pO1xuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLnN1c3BlbmQpKCk7XG5cdCAgICAgIHZhciBfdGFzayA9IHByb2ModGFza0l0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBmbi5uYW1lLCBkZXRhY2hlZCA/IG51bGwgOiBfdXRpbHMubm9vcCk7XG5cdFxuXHQgICAgICBpZiAoZGV0YWNoZWQpIHtcblx0ICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgaWYgKHRhc2tJdGVyYXRvci5faXNSdW5uaW5nKSB7XG5cdCAgICAgICAgICB0YXNrUXVldWUuYWRkVGFzayhfdGFzayk7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfSBlbHNlIGlmICh0YXNrSXRlcmF0b3IuX2Vycm9yKSB7XG5cdCAgICAgICAgICB0YXNrUXVldWUuYWJvcnQodGFza0l0ZXJhdG9yLl9lcnJvcik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGNiKF90YXNrKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0gZmluYWxseSB7XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLmZsdXNoKSgpO1xuXHQgICAgfVxuXHQgICAgLy8gRm9yayBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Kb2luRWZmZWN0KHQsIGNiKSB7XG5cdCAgICBpZiAodC5pc1J1bm5pbmcoKSkge1xuXHQgICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodC5qb2luZXJzLCBqb2luZXIpO1xuXHQgICAgICB9O1xuXHQgICAgICB0LmpvaW5lcnMucHVzaChqb2luZXIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNhbmNlbEVmZmVjdCh0YXNrVG9DYW5jZWwsIGNiKSB7XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsID09PSBfdXRpbHMuU0VMRl9DQU5DRUxMQVRJT04pIHtcblx0ICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcblx0ICAgIH1cblx0ICAgIGlmICh0YXNrVG9DYW5jZWwuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuXHQgICAgfVxuXHQgICAgY2IoKTtcblx0ICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHRcblx0ICAgIGlmICgha2V5cy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdIDoge30pO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBjb21wbGV0ZWRDb3VudCA9IDA7XG5cdCAgICB2YXIgY29tcGxldGVkID0gdm9pZCAwO1xuXHQgICAgdmFyIHJlc3VsdHMgPSB7fTtcblx0ICAgIHZhciBjaGlsZENicyA9IHt9O1xuXHRcblx0ICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuXHQgICAgICBpZiAoY29tcGxldGVkQ291bnQgPT09IGtleXMubGVuZ3RoKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgY2IuY2FuY2VsKCk7XG5cdCAgICAgICAgICBjYihyZXMsIGlzRXJyKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuXHQgICAgICAgICAgY29tcGxldGVkQ291bnQrKztcblx0ICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghY29tcGxldGVkKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgcmV0dXJuIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcblx0ICAgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCB0cnVlKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG5cdCAgICAgICAgICB2YXIgX3Jlc3BvbnNlO1xuXHRcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIHZhciByZXNwb25zZSA9IChfcmVzcG9uc2UgPSB7fSwgX3Jlc3BvbnNlW2tleV0gPSByZXMsIF9yZXNwb25zZSk7XG5cdCAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH07XG5cdCAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0ICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gcHJldmVudHMgdW5uZWNlc3NhcnkgY2FuY2VsbGF0aW9uXG5cdCAgICAgIGlmICghY29tcGxldGVkKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG5cdCAgICB2YXIgc2VsZWN0b3IgPSBfcmVmNy5zZWxlY3Rvcixcblx0ICAgICAgICBhcmdzID0gX3JlZjcuYXJncztcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgc3RhdGUgPSBzZWxlY3Rvci5hcHBseSh1bmRlZmluZWQsIFtnZXRTdGF0ZSgpXS5jb25jYXQoYXJncykpO1xuXHQgICAgICBjYihzdGF0ZSk7XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuXHQgICAgdmFyIHBhdHRlcm4gPSBfcmVmOC5wYXR0ZXJuLFxuXHQgICAgICAgIGJ1ZmZlciA9IF9yZWY4LmJ1ZmZlcjtcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSBtYXRjaGVyKHBhdHRlcm4pO1xuXHQgICAgbWF0Y2gucGF0dGVybiA9IHBhdHRlcm47XG5cdCAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcblx0ICAgIGNiKCEhbWFpblRhc2suaXNDYW5jZWxsZWQpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuRmx1c2hFZmZlY3QoY2hhbm5lbCwgY2IpIHtcblx0ICAgIGNoYW5uZWwuZmx1c2goY2IpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuR2V0Q29udGV4dEVmZmVjdChwcm9wLCBjYikge1xuXHQgICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcblx0ICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG5cdCAgICBjYigpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gbmV3VGFzayhpZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpIHtcblx0ICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXHRcblx0ICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IG51bGw7XG5cdCAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmIChpdGVyYXRvci5fZGVmZXJyZWRFbmQpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmF0b3IuX2RlZmVycmVkRW5kLnByb21pc2U7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIGRlZiA9ICgwLCBfdXRpbHMuZGVmZXJyZWQpKCk7XG5cdCAgICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gZGVmO1xuXHQgICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgaXRlcmF0b3IuX2Vycm9yID8gZGVmLnJlamVjdChpdGVyYXRvci5fZXJyb3IpIDogZGVmLnJlc29sdmUoaXRlcmF0b3IuX3Jlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcblx0ICAgICAgfVxuXHQgICAgfSwgX3JlZjkuY29udCA9IGNvbnQsIF9yZWY5LmpvaW5lcnMgPSBbXSwgX3JlZjkuY2FuY2VsID0gY2FuY2VsLCBfcmVmOS5pc1J1bm5pbmcgPSBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuXHQgICAgfSwgX3JlZjkuaXNDYW5jZWxsZWQgPSBmdW5jdGlvbiBpc0NhbmNlbGxlZCgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZDtcblx0ICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0Fib3J0ZWQ7XG5cdCAgICB9LCBfcmVmOS5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuXHQgICAgfSwgX3JlZjkuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9lcnJvcjtcblx0ICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG5cdCAgICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgndGFzaycsIHByb3BzKSk7XG5cdCAgICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG5cdCAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG5cdCAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzYXAgPSBhc2FwO1xuXHRleHBvcnRzLnN1c3BlbmQgPSBzdXNwZW5kO1xuXHRleHBvcnRzLmZsdXNoID0gZmx1c2g7XG5cdHZhciBxdWV1ZSA9IFtdO1xuXHQvKipcblx0ICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG5cdCAgLSBJbmNyZW1lbnRpbmcgYWRkcyBhIGxvY2sgYW5kIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlIChpZiBpdCdzIG5vdFxuXHQgICAgYWxyZWFkeSBzdXNwZW5kZWQpXG5cdCAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcblx0ICAgIHRyaWdnZXJzIGZsdXNoaW5nIHRoZSBxdWV1ZWQgdGFza3MuXG5cdCoqL1xuXHR2YXIgc2VtYXBob3JlID0gMDtcblx0XG5cdC8qKlxuXHQgIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcblx0ICBhbmQgZmx1c2hlZCBhZnRlciB0aGlzIHRhc2sgaGFzIGZpbmlzaGVkIChhc3N1bWluZyB0aGUgc2NoZWR1bGVyIGVuZHVwIGluIGEgcmVsZWFzZWRcblx0ICBzdGF0ZSkuXG5cdCoqL1xuXHRmdW5jdGlvbiBleGVjKHRhc2spIHtcblx0ICB0cnkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgdGFzaygpO1xuXHQgIH0gZmluYWxseSB7XG5cdCAgICByZWxlYXNlKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBvciBxdWV1ZXMgYSB0YXNrIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgdGhlIHNjaGVkdWxlciAoYHN1c3BlbmRlZGAgb3IgYHJlbGVhc2VkYClcblx0KiovXG5cdGZ1bmN0aW9uIGFzYXAodGFzaykge1xuXHQgIHF1ZXVlLnB1c2godGFzayk7XG5cdFxuXHQgIGlmICghc2VtYXBob3JlKSB7XG5cdCAgICBzdXNwZW5kKCk7XG5cdCAgICBmbHVzaCgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHN1c3BlbmRlZGAgc3RhdGUuIFNjaGVkdWxlZCB0YXNrcyB3aWxsIGJlIHF1ZXVlZCB1bnRpbCB0aGVcblx0ICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG5cdCoqL1xuXHRmdW5jdGlvbiBzdXNwZW5kKCkge1xuXHQgIHNlbWFwaG9yZSsrO1xuXHR9XG5cdFxuXHQvKipcblx0ICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLlxuXHQqKi9cblx0ZnVuY3Rpb24gcmVsZWFzZSgpIHtcblx0ICBzZW1hcGhvcmUtLTtcblx0fVxuXHRcblx0LyoqXG5cdCAgUmVsZWFzZXMgdGhlIGN1cnJlbnQgbG9jay4gRXhlY3V0ZXMgYWxsIHF1ZXVlZCB0YXNrcyBpZiB0aGUgc2NoZWR1bGVyIGlzIGluIHRoZSByZWxlYXNlZCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQgIHJlbGVhc2UoKTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDA7XG5cdCAgd2hpbGUgKCFzZW1hcGhvcmUgJiYgKHRhc2sgPSBxdWV1ZS5zaGlmdCgpKSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICBleGVjKHRhc2spO1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5cdGV4cG9ydHMudGFrZSA9IHRha2U7XG5cdGV4cG9ydHMucHV0ID0gcHV0O1xuXHRleHBvcnRzLmFsbCA9IGFsbDtcblx0ZXhwb3J0cy5yYWNlID0gcmFjZTtcblx0ZXhwb3J0cy5jYWxsID0gY2FsbDtcblx0ZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuXHRleHBvcnRzLmNwcyA9IGNwcztcblx0ZXhwb3J0cy5mb3JrID0gZm9yaztcblx0ZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuXHRleHBvcnRzLmpvaW4gPSBqb2luO1xuXHRleHBvcnRzLmNhbmNlbCA9IGNhbmNlbDtcblx0ZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5cdGV4cG9ydHMuYWN0aW9uQ2hhbm5lbCA9IGFjdGlvbkNoYW5uZWw7XG5cdGV4cG9ydHMuY2FuY2VsbGVkID0gY2FuY2VsbGVkO1xuXHRleHBvcnRzLmZsdXNoID0gZmx1c2g7XG5cdGV4cG9ydHMuZ2V0Q29udGV4dCA9IGdldENvbnRleHQ7XG5cdGV4cG9ydHMuc2V0Q29udGV4dCA9IHNldENvbnRleHQ7XG5cdGV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuXHRleHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuXHRleHBvcnRzLnRocm90dGxlID0gdGhyb3R0bGU7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0dmFyIElPID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuc3ltKSgnSU8nKTtcblx0dmFyIFRBS0UgPSAnVEFLRSc7XG5cdHZhciBQVVQgPSAnUFVUJztcblx0dmFyIEFMTCA9ICdBTEwnO1xuXHR2YXIgUkFDRSA9ICdSQUNFJztcblx0dmFyIENBTEwgPSAnQ0FMTCc7XG5cdHZhciBDUFMgPSAnQ1BTJztcblx0dmFyIEZPUksgPSAnRk9SSyc7XG5cdHZhciBKT0lOID0gJ0pPSU4nO1xuXHR2YXIgQ0FOQ0VMID0gJ0NBTkNFTCc7XG5cdHZhciBTRUxFQ1QgPSAnU0VMRUNUJztcblx0dmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcblx0dmFyIENBTkNFTExFRCA9ICdDQU5DRUxMRUQnO1xuXHR2YXIgRkxVU0ggPSAnRkxVU0gnO1xuXHR2YXIgR0VUX0NPTlRFWFQgPSAnR0VUX0NPTlRFWFQnO1xuXHR2YXIgU0VUX0NPTlRFWFQgPSAnU0VUX0NPTlRFWFQnO1xuXHRcblx0dmFyIFRFU1RfSElOVCA9ICdcXG4oSElOVDogaWYgeW91IGFyZSBnZXR0aW5nIHRoaXMgZXJyb3JzIGluIHRlc3RzLCBjb25zaWRlciB1c2luZyBjcmVhdGVNb2NrVGFzayBmcm9tIHJlZHV4LXNhZ2EvdXRpbHMpJztcblx0XG5cdHZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuXHQgIHZhciBfcmVmO1xuXHRcblx0ICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xuXHR9O1xuXHRcblx0dmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGFzRWZmZWN0LmZvcmsoZWZmKSwgX3V0aWxzLmlzLm9iamVjdCwgJ2RldGFjaChlZmYpOiBhcmd1bWVudCBtdXN0IGJlIGEgZm9yayBlZmZlY3QnKTtcblx0ICBlZmZbRk9SS10uZGV0YWNoZWQgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiB0YWtlKCkge1xuXHQgIHZhciBwYXR0ZXJuT3JDaGFubmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnKic7XG5cdFxuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShhcmd1bWVudHNbMF0sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IHBhdHRlcm5PckNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgfVxuXHQgIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG5cdCAgfVxuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IGNoYW5uZWw6IHBhdHRlcm5PckNoYW5uZWwgfSk7XG5cdCAgfVxuXHQgIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG5cdH1cblx0XG5cdHRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHRha2UuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIGVmZltUQUtFXS5tYXliZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBwdXQoY2hhbm5lbCwgYWN0aW9uKSB7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgYSB2YWxpZCBjaGFubmVsJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG5cdCAgICBhY3Rpb24gPSBjaGFubmVsO1xuXHQgICAgY2hhbm5lbCA9IG51bGw7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xuXHR9XG5cdFxuXHRwdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbUFVUXS5yZXNvbHZlID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0cHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblx0XG5cdGZ1bmN0aW9uIGFsbChlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcblx0ICByZXR1cm4gZWZmZWN0KFJBQ0UsIGVmZmVjdHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRGbkNhbGxEZXNjKG1ldGgsIGZuLCBhcmdzKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5ub3RVbmRlZiwgbWV0aCArICc6IGFyZ3VtZW50IGZuIGlzIHVuZGVmaW5lZCcpO1xuXHRcblx0ICB2YXIgY29udGV4dCA9IG51bGw7XG5cdCAgaWYgKF91dGlscy5pcy5hcnJheShmbikpIHtcblx0ICAgIHZhciBfZm4gPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm5bMF07XG5cdCAgICBmbiA9IF9mblsxXTtcblx0ICB9IGVsc2UgaWYgKGZuLmZuKSB7XG5cdCAgICB2YXIgX2ZuMiA9IGZuO1xuXHQgICAgY29udGV4dCA9IF9mbjIuY29udGV4dDtcblx0ICAgIGZuID0gX2ZuMi5mbjtcblx0ICB9XG5cdCAgaWYgKGNvbnRleHQgJiYgX3V0aWxzLmlzLnN0cmluZyhmbikgJiYgX3V0aWxzLmlzLmZ1bmMoY29udGV4dFtmbl0pKSB7XG5cdCAgICBmbiA9IGNvbnRleHRbZm5dO1xuXHQgIH1cblx0ICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLmZ1bmMsIG1ldGggKyAnOiBhcmd1bWVudCAnICsgZm4gKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdFxuXHQgIHJldHVybiB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYWxsKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG5cdCAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcHMoZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdCAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDUFMsIGdldEZuQ2FsbERlc2MoJ2NwcycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZvcmsoZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG5cdCAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGVmZmVjdChGT1JLLCBnZXRGbkNhbGxEZXNjKCdmb3JrJywgZm4sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3Bhd24oZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG5cdCAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gam9pbigpIHtcblx0ICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcblx0ICAgIHRhc2tzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG5cdCAgfVxuXHRcblx0ICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuXHQgICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgcmV0dXJuIGpvaW4odCk7XG5cdCAgICB9KSk7XG5cdCAgfVxuXHQgIHZhciB0YXNrID0gdGFza3NbMF07XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnam9pbih0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcblx0ICByZXR1cm4gZWZmZWN0KEpPSU4sIHRhc2spO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgZm9yICh2YXIgX2xlbjYgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW42KSwgX2tleTYgPSAwOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG5cdCAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBjYW5jZWwodCk7XG5cdCAgICB9KSk7XG5cdCAgfVxuXHQgIHZhciB0YXNrID0gdGFza3NbMF07XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdjYW5jZWwodGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2sgfHwgX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG5cdCAgZm9yICh2YXIgX2xlbjcgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjcgPiAxID8gX2xlbjcgLSAxIDogMCksIF9rZXk3ID0gMTsgX2tleTcgPCBfbGVuNzsgX2tleTcrKykge1xuXHQgICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcblx0ICB9XG5cdFxuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdCAgICBzZWxlY3RvciA9IF91dGlscy5pZGVudDtcblx0ICB9IGVsc2Uge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgIGNoYW5uZWwocGF0dGVybiwgW2J1ZmZlcl0pICAgID0+IGNyZWF0ZXMgYW4gZXZlbnQgY2hhbm5lbCBmb3Igc3RvcmUgYWN0aW9uc1xuXHQqKi9cblx0ZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShwYXR0ZXJuLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sLi4uKTogYXJndW1lbnQgcGF0dGVybiBpcyB1bmRlZmluZWQnKTtcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50ICcgKyBidWZmZXIgKyAnIGlzIG5vdCBhIHZhbGlkIGJ1ZmZlcicpO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChDQU5DRUxMRUQsIHt9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAnZmx1c2goY2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCcpO1xuXHQgIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wLCBfdXRpbHMuaXMuc3RyaW5nLCAnZ2V0Q29udGV4dChwcm9wKTogYXJndW1lbnQgJyArIHByb3AgKyAnIGlzIG5vdCBhIHN0cmluZycpO1xuXHQgIHJldHVybiBlZmZlY3QoR0VUX0NPTlRFWFQsIHByb3ApO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG5cdCAgcmV0dXJuIGVmZmVjdChTRVRfQ09OVEVYVCwgcHJvcHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjggPiAyID8gX2xlbjggLSAyIDogMCksIF9rZXk4ID0gMjsgX2tleTggPCBfbGVuODsgX2tleTgrKykge1xuXHQgICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOSA+IDIgPyBfbGVuOSAtIDIgOiAwKSwgX2tleTkgPSAyOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG5cdCAgICBhcmdzW19rZXk5IC0gMl0gPSBhcmd1bWVudHNbX2tleTldO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3RIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUobXMsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG5cdCAgICBhcmdzW19rZXkxMCAtIDNdID0gYXJndW1lbnRzW19rZXkxMF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGhyb3R0bGVIZWxwZXIsIG1zLCBwYXR0ZXJuLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdHZhciBjcmVhdGVBc0VmZmVjdFR5cGUgPSBmdW5jdGlvbiBjcmVhdGVBc0VmZmVjdFR5cGUodHlwZSkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoZWZmZWN0KSB7XG5cdCAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgYXNFZmZlY3QgPSBleHBvcnRzLmFzRWZmZWN0ID0ge1xuXHQgIHRha2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoVEFLRSksXG5cdCAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG5cdCAgYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFMTCksXG5cdCAgcmFjZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShSQUNFKSxcblx0ICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuXHQgIGNwczogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDUFMpLFxuXHQgIGZvcms6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRk9SSyksXG5cdCAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcblx0ICBjYW5jZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMKSxcblx0ICBzZWxlY3Q6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VMRUNUKSxcblx0ICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcblx0ICBjYW5jZWxsZWQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMTEVEKSxcblx0ICBmbHVzaDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGTFVTSCksXG5cdCAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG5cdCAgc2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRVRfQ09OVEVYVClcblx0fTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnRocm90dGxlSGVscGVyID0gZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3Rha2VFdmVyeSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NSk7XG5cdFxuXHR2YXIgX3Rha2VFdmVyeTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUV2ZXJ5KTtcblx0XG5cdHZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VMYXRlc3QpO1xuXHRcblx0dmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MCk7XG5cdFxuXHR2YXIgX3Rocm90dGxlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aHJvdHRsZSk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcblx0ICByZXR1cm4gJ2ltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYVxcJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYS9lZmZlY3RzXFwnLlxcblRoZSBsYXR0ZXIgd2lsbCBub3Qgd29yayB3aXRoIHlpZWxkKiwgYXMgaGVscGVyIGVmZmVjdHMgYXJlIHdyYXBwZWQgYXV0b21hdGljYWxseSBmb3IgeW91IGluIGZvcmsgZWZmZWN0LlxcblRoZXJlZm9yZSB5aWVsZCAnICsgaGVscGVyTmFtZSArICcgd2lsbCByZXR1cm4gdGFzayBkZXNjcmlwdG9yIHRvIHlvdXIgc2FnYSBhbmQgZXhlY3V0ZSBuZXh0IGxpbmVzIG9mIGNvZGUuJztcblx0fTtcblx0XG5cdHZhciB0YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlRXZlcnkyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VFdmVyeScpKTtcblx0dmFyIHRha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlTGF0ZXN0Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlTGF0ZXN0JykpO1xuXHR2YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cdFxuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IF90YWtlRXZlcnkyLmRlZmF1bHQ7XG5cdGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRocm90dGxlSGVscGVyID0gX3Rocm90dGxlMi5kZWZhdWx0O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VFdmVyeTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIHRha2VFdmVyeShwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcblx0ICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcblx0ICB9O1xuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuXHQgICAgfSxcblx0ICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcblx0ICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pXTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnFFbmQgPSB1bmRlZmluZWQ7XG5cdGV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZnNtSXRlcmF0b3I7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG5cdHZhciBxRW5kID0gZXhwb3J0cy5xRW5kID0ge307XG5cdFxuXHRmdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG5cdCAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG5cdCAgICByZXR1cm4gJ2NoYW5uZWwnO1xuXHQgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcblx0ICAgICAgcmV0dXJuIFN0cmluZyhlbnRyeSk7XG5cdCAgICB9KSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCk7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdpdGVyYXRvcic7XG5cdFxuXHQgIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcblx0ICAgICAgcU5leHQgPSBxMDtcblx0XG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG5cdCAgICBpZiAocU5leHQgPT09IHFFbmQpIHtcblx0ICAgICAgcmV0dXJuIGRvbmU7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGVycm9yKSB7XG5cdCAgICAgIHFOZXh0ID0gcUVuZDtcblx0ICAgICAgdGhyb3cgZXJyb3I7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXHRcblx0ICAgICAgdmFyIF9mc20kcU5leHQgPSBmc21bcU5leHRdKCksXG5cdCAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcblx0ICAgICAgICAgIG91dHB1dCA9IF9mc20kcU5leHRbMV0sXG5cdCAgICAgICAgICBfdXBkYXRlU3RhdGUgPSBfZnNtJHFOZXh0WzJdO1xuXHRcblx0ICAgICAgcU5leHQgPSBxO1xuXHQgICAgICB1cGRhdGVTdGF0ZSA9IF91cGRhdGVTdGF0ZTtcblx0ICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikobmV4dCwgZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICByZXR1cm4gbmV4dChudWxsLCBlcnJvcik7XG5cdCAgfSwgbmFtZSwgdHJ1ZSk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5JTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuaXNFbmQgPSBleHBvcnRzLkVORCA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHRleHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuXHRleHBvcnRzLmNoYW5uZWwgPSBjaGFubmVsO1xuXHRleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV2ZW50Q2hhbm5lbDtcblx0ZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdHZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQyKTtcblx0XG5cdHZhciBDSEFOTkVMX0VORF9UWVBFID0gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG5cdHZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xuXHR2YXIgaXNFbmQgPSBleHBvcnRzLmlzRW5kID0gZnVuY3Rpb24gaXNFbmQoYSkge1xuXHQgIHJldHVybiBhICYmIGEudHlwZSA9PT0gQ0hBTk5FTF9FTkRfVFlQRTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIGVtaXR0ZXIoKSB7XG5cdCAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cdFxuXHQgIGZ1bmN0aW9uIHN1YnNjcmliZShzdWIpIHtcblx0ICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkoc3Vic2NyaWJlcnMsIHN1Yik7XG5cdCAgICB9O1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG5cdCAgICB2YXIgYXJyID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgYXJyW2ldKGl0ZW0pO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuXHQgICAgZW1pdDogZW1pdFxuXHQgIH07XG5cdH1cblx0XG5cdHZhciBJTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSAnaW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGNoYW5uZWwgZmFjdG9yeSBmdW5jdGlvbic7XG5cdHZhciBVTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9ICdTYWdhIHdhcyBwcm92aWRlZCB3aXRoIGFuIHVuZGVmaW5lZCBhY3Rpb24nO1xuXHRcblx0aWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcblx0ICBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IFVOREVGSU5FRF9JTlBVVF9FUlJPUiArPSAnXFxuSGludHM6XFxuICAgIC0gY2hlY2sgdGhhdCB5b3VyIEFjdGlvbiBDcmVhdG9yIHJldHVybnMgYSBub24tdW5kZWZpbmVkIHZhbHVlXFxuICAgIC0gaWYgdGhlIFNhZ2Egd2FzIHN0YXJ0ZWQgdXNpbmcgcnVuU2FnYSwgY2hlY2sgdGhhdCB5b3VyIHN1YnNjcmliZSBzb3VyY2UgcHJvdmlkZXMgdGhlIGFjdGlvbiB0byBpdHMgbGlzdGVuZXJzXFxuICAnO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjaGFubmVsKCkge1xuXHQgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblx0XG5cdCAgdmFyIGNsb3NlZCA9IGZhbHNlO1xuXHQgIHZhciB0YWtlcnMgPSBbXTtcblx0XG5cdCAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCBJTlZBTElEX0JVRkZFUik7XG5cdFxuXHQgIGZ1bmN0aW9uIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCkge1xuXHQgICAgaWYgKGNsb3NlZCAmJiB0YWtlcnMubGVuZ3RoKSB7XG5cdCAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0YWtlcnMubGVuZ3RoICYmICFidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHB1dChpbnB1dCkge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG5cdCAgICBpZiAoY2xvc2VkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmICghdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gYnVmZmVyLnB1dChpbnB1dCk7XG5cdCAgICB9XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRha2Vycy5sZW5ndGg7IGkrKykge1xuXHQgICAgICB2YXIgY2IgPSB0YWtlcnNbaV07XG5cdCAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuXHQgICAgICAgIHRha2Vycy5zcGxpY2UoaSwgMSk7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gdGFrZShjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdFxuXHQgICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIGNiKEVORCk7XG5cdCAgICB9IGVsc2UgaWYgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIGNiKGJ1ZmZlci50YWtlKCkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGFrZXJzLnB1c2goY2IpO1xuXHQgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGZsdXNoKGNiKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwuZmx1c2gnIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjYihidWZmZXIuZmx1c2goKSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjbG9zZSgpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICBpZiAoIWNsb3NlZCkge1xuXHQgICAgICBjbG9zZWQgPSB0cnVlO1xuXHQgICAgICBpZiAodGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICAgIHZhciBhcnIgPSB0YWtlcnM7XG5cdCAgICAgICAgdGFrZXJzID0gW107XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICAgICAgYXJyW2ldKEVORCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgdGFrZTogdGFrZSxcblx0ICAgIHB1dDogcHV0LFxuXHQgICAgZmx1c2g6IGZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlLFxuXHQgICAgZ2V0IF9fdGFrZXJzX18oKSB7XG5cdCAgICAgIHJldHVybiB0YWtlcnM7XG5cdCAgICB9LFxuXHQgICAgZ2V0IF9fY2xvc2VkX18oKSB7XG5cdCAgICAgIHJldHVybiBjbG9zZWQ7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZXZlbnRDaGFubmVsKHN1YnNjcmliZSkge1xuXHQgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9idWZmZXJzLmJ1ZmZlcnMubm9uZSgpO1xuXHQgIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXHRcblx0ICAvKipcblx0ICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuXHQgICAgc2VlIFBSICMyNzMgZm9yIGEgYmFja2dyb3VuZCBkaXNjdXNzaW9uXG5cdCAgKiovXG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgJ0ludmFsaWQgbWF0Y2ggZnVuY3Rpb24gcGFzc2VkIHRvIGV2ZW50Q2hhbm5lbCcpO1xuXHQgIH1cblx0XG5cdCAgdmFyIGNoYW4gPSBjaGFubmVsKGJ1ZmZlcik7XG5cdCAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgICBpZiAodW5zdWJzY3JpYmUpIHtcblx0ICAgICAgICB1bnN1YnNjcmliZSgpO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4uY2xvc2UoKTtcblx0ICAgIH1cblx0ICB9O1xuXHQgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgIGlmIChpc0VuZChpbnB1dCkpIHtcblx0ICAgICAgY2xvc2UoKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNoYW4ucHV0KGlucHV0KTtcblx0ICB9KTtcblx0ICBpZiAoY2hhbi5fX2Nsb3NlZF9fKSB7XG5cdCAgICB1bnN1YnNjcmliZSgpO1xuXHQgIH1cblx0XG5cdCAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignaW4gZXZlbnRDaGFubmVsOiBzdWJzY3JpYmUgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuc3Vic2NyaWJlJyk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgdGFrZTogY2hhbi50YWtlLFxuXHQgICAgZmx1c2g6IGNoYW4uZmx1c2gsXG5cdCAgICBjbG9zZTogY2xvc2Vcblx0ICB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzdGRDaGFubmVsKHN1YnNjcmliZSkge1xuXHQgIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuXHQgICAgcmV0dXJuIHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgaWYgKGlucHV0W191dGlscy5TQUdBX0FDVElPTl0pIHtcblx0ICAgICAgICBjYihpbnB1dCk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcblx0ICAgIHRha2U6IGZ1bmN0aW9uIHRha2UoY2IsIG1hdGNoZXIpIHtcblx0ICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICAgICAgY2JbX3V0aWxzLk1BVENIXSA9IG1hdGNoZXI7XG5cdCAgICAgIH1cblx0ICAgICAgY2hhbi50YWtlKGNiKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fVxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXHRcblx0dmFyIE9OX09WRVJGTE9XX1RIUk9XID0gMTtcblx0dmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xuXHR2YXIgT05fT1ZFUkZMT1dfU0xJREUgPSAzO1xuXHR2YXIgT05fT1ZFUkZMT1dfRVhQQU5EID0gNDtcblx0XG5cdHZhciB6ZXJvQnVmZmVyID0geyBpc0VtcHR5OiBfdXRpbHMua1RydWUsIHB1dDogX3V0aWxzLm5vb3AsIHRha2U6IF91dGlscy5ub29wIH07XG5cdFxuXHRmdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuXHQgIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMTA7XG5cdCAgdmFyIG92ZXJmbG93QWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXHRcblx0ICB2YXIgYXJyID0gbmV3IEFycmF5KGxpbWl0KTtcblx0ICB2YXIgbGVuZ3RoID0gMDtcblx0ICB2YXIgcHVzaEluZGV4ID0gMDtcblx0ICB2YXIgcG9wSW5kZXggPSAwO1xuXHRcblx0ICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcblx0ICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG5cdCAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgIGxlbmd0aCsrO1xuXHQgIH07XG5cdFxuXHQgIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcblx0ICAgIGlmIChsZW5ndGggIT0gMCkge1xuXHQgICAgICB2YXIgaXQgPSBhcnJbcG9wSW5kZXhdO1xuXHQgICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcblx0ICAgICAgbGVuZ3RoLS07XG5cdCAgICAgIHBvcEluZGV4ID0gKHBvcEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgICAgcmV0dXJuIGl0O1xuXHQgICAgfVxuXHQgIH07XG5cdFxuXHQgIHZhciBmbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQgICAgdmFyIGl0ZW1zID0gW107XG5cdCAgICB3aGlsZSAobGVuZ3RoKSB7XG5cdCAgICAgIGl0ZW1zLnB1c2godGFrZSgpKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBpdGVtcztcblx0ICB9O1xuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcblx0ICAgICAgcmV0dXJuIGxlbmd0aCA9PSAwO1xuXHQgICAgfSxcblx0ICAgIHB1dDogZnVuY3Rpb24gcHV0KGl0KSB7XG5cdCAgICAgIGlmIChsZW5ndGggPCBsaW1pdCkge1xuXHQgICAgICAgIHB1c2goaXQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkb3VibGVkTGltaXQgPSB2b2lkIDA7XG5cdCAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19USFJPVzpcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEJVRkZFUl9PVkVSRkxPVyk7XG5cdCAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuXHQgICAgICAgICAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgICAgICAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19FWFBBTkQ6XG5cdCAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblx0XG5cdCAgICAgICAgICAgIGFyciA9IGZsdXNoKCk7XG5cdFxuXHQgICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXHQgICAgICAgICAgICBwdXNoSW5kZXggPSBhcnIubGVuZ3RoO1xuXHQgICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cdFxuXHQgICAgICAgICAgICBhcnIubGVuZ3RoID0gZG91YmxlZExpbWl0O1xuXHQgICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblx0XG5cdCAgICAgICAgICAgIHB1c2goaXQpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAvLyBEUk9QXG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgdGFrZTogdGFrZSxcblx0ICAgIGZsdXNoOiBmbHVzaFxuXHQgIH07XG5cdH1cblx0XG5cdHZhciBidWZmZXJzID0gZXhwb3J0cy5idWZmZXJzID0ge1xuXHQgIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG5cdCAgICByZXR1cm4gemVyb0J1ZmZlcjtcblx0ICB9LFxuXHQgIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1RIUk9XKTtcblx0ICB9LFxuXHQgIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX0RST1ApO1xuXHQgIH0sXG5cdCAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1NMSURFKTtcblx0ICB9LFxuXHQgIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG5cdCAgICByZXR1cm4gcmluZ0J1ZmZlcihpbml0aWFsU2l6ZSwgT05fT1ZFUkZMT1dfRVhQQU5EKTtcblx0ICB9XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gdGFrZUxhdGVzdDtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0ICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbmNlbCkodGFzaykgfTtcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFzayA9IHZvaWQgMCxcblx0ICAgICAgYWN0aW9uID0gdm9pZCAwO1xuXHQgIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG5cdCAgICByZXR1cm4gdGFzayA9IHQ7XG5cdCAgfTtcblx0ICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuXHQgICAgfSxcblx0ICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcblx0ICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGFrZUxhdGVzdCgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gdGhyb3R0bGU7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0aHJvdHRsZShkZWxheUxlbmd0aCwgcGF0dGVybiwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAzXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBhY3Rpb24gPSB2b2lkIDAsXG5cdCAgICAgIGNoYW5uZWwgPSB2b2lkIDA7XG5cdFxuXHQgIHZhciB5QWN0aW9uQ2hhbm5lbCA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmFjdGlvbkNoYW5uZWwpKHBhdHRlcm4sIF9idWZmZXJzLmJ1ZmZlcnMuc2xpZGluZygxKSkgfTtcblx0ICB2YXIgeVRha2UgPSBmdW5jdGlvbiB5VGFrZSgpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0ICB2YXIgeURlbGF5ID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uY2FsbCkoX3V0aWxzLmRlbGF5LCBkZWxheUxlbmd0aCkgfTtcblx0XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdCAgdmFyIHNldENoYW5uZWwgPSBmdW5jdGlvbiBzZXRDaGFubmVsKGNoKSB7XG5cdCAgICByZXR1cm4gY2hhbm5lbCA9IGNoO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeUFjdGlvbkNoYW5uZWwsIHNldENoYW5uZWxdO1xuXHQgICAgfSxcblx0ICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcblx0ICAgICAgcmV0dXJuIFsncTMnLCB5VGFrZSgpLCBzZXRBY3Rpb25dO1xuXHQgICAgfSxcblx0ICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcblx0ICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTQnLCB5Rm9yayhhY3Rpb24pXTtcblx0ICAgIH0sXG5cdCAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeURlbGF5XTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gc2FnYU1pZGRsZXdhcmVGYWN0b3J5O1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzM5KTtcblx0XG5cdGZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblx0XG5cdGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlRmFjdG9yeSgpIHtcblx0ICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cdFxuXHQgIHZhciBfcmVmJGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG5cdCAgICAgIGNvbnRleHQgPSBfcmVmJGNvbnRleHQgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZiRjb250ZXh0LFxuXHQgICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblx0XG5cdCAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG5cdCAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cdFxuXHRcblx0ICBpZiAoX3V0aWxzLmlzLmZ1bmMob3B0aW9ucykpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBwYXNzZWQgYSBmdW5jdGlvbiB0byB0aGUgU2FnYSBtaWRkbGV3YXJlLiBZb3UgYXJlIGxpa2VseSB0cnlpbmcgdG8gc3RhcnQgYSAgICAgICAgU2FnYSBieSBkaXJlY3RseSBwYXNzaW5nIGl0IHRvIHRoZSBtaWRkbGV3YXJlLiBUaGlzIGlzIG5vIGxvbmdlciBwb3NzaWJsZSBzdGFydGluZyBmcm9tIDAuMTAuMC4gICAgICAgIFRvIHJ1biBhIFNhZ2EsIHlvdSBtdXN0IGRvIGl0IGR5bmFtaWNhbGx5IEFGVEVSIG1vdW50aW5nIHRoZSBtaWRkbGV3YXJlIGludG8gdGhlIHN0b3JlLlxcbiAgICAgICAgRXhhbXBsZTpcXG4gICAgICAgICAgaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXFwncmVkdXgtc2FnYVxcJ1xcbiAgICAgICAgICAuLi4gb3RoZXIgaW1wb3J0c1xcblxcbiAgICAgICAgICBjb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKClcXG4gICAgICAgICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKVxcbiAgICAgICAgICBzYWdhTWlkZGxld2FyZS5ydW4oc2FnYSwgLi4uYXJncylcXG4gICAgICAnKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMubG9nZ2VyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiBvcHRpb25zLm9uZXJyb3IpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25lcnJvcmAgd2FzIHJlbW92ZWQuIFVzZSBgb3B0aW9ucy5vbkVycm9yYCBpbnN0ZWFkLicpO1xuXHQgIH1cblx0XG5cdCAgaWYgKG9uRXJyb3IgJiYgIV91dGlscy5pcy5mdW5jKG9uRXJyb3IpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuXHQgIH1cblx0XG5cdCAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5lbWl0dGVyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlKF9yZWYyKSB7XG5cdCAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmMi5nZXRTdGF0ZSxcblx0ICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXHRcblx0ICAgIHZhciBzYWdhRW1pdHRlciA9ICgwLCBfY2hhbm5lbC5lbWl0dGVyKSgpO1xuXHQgICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblx0XG5cdCAgICBzYWdhTWlkZGxld2FyZS5ydW4gPSBfcnVuU2FnYS5ydW5TYWdhLmJpbmQobnVsbCwge1xuXHQgICAgICBjb250ZXh0OiBjb250ZXh0LFxuXHQgICAgICBzdWJzY3JpYmU6IHNhZ2FFbWl0dGVyLnN1YnNjcmliZSxcblx0ICAgICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG5cdCAgICAgIHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyOiBsb2dnZXIsXG5cdCAgICAgIG9uRXJyb3I6IG9uRXJyb3Jcblx0ICAgIH0pO1xuXHRcblx0ICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuXHQgICAgICAgIGlmIChzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKSB7XG5cdCAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhciByZXN1bHQgPSBuZXh0KGFjdGlvbik7IC8vIGhpdCByZWR1Y2Vyc1xuXHQgICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgICB9O1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignQmVmb3JlIHJ1bm5pbmcgYSBTYWdhLCB5b3UgbXVzdCBtb3VudCB0aGUgU2FnYSBtaWRkbGV3YXJlIG9uIHRoZSBTdG9yZSB1c2luZyBhcHBseU1pZGRsZXdhcmUnKTtcblx0ICB9O1xuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3NhZ2FNaWRkbGV3YXJlJywgcHJvcHMpKTtcblx0ICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZW0nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZW07XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwdXQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8ucHV0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFsbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JhY2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8ucmFjZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbGwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY2FsbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FwcGx5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFwcGx5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3BzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNwcztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZvcmsnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZm9yaztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NwYXduJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnNwYXduO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnam9pbicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5qb2luO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NlbGVjdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZWxlY3Q7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhY3Rpb25DaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFjdGlvbkNoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWxsZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY2FuY2VsbGVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZmx1c2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZmx1c2g7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdnZXRDb250ZXh0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmdldENvbnRleHQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZXRDb250ZXh0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnNldENvbnRleHQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1RBU0snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuVEFTSztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NBR0FfQUNUSU9OJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlNBR0FfQUNUSU9OO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnbm9vcCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5ub29wO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnaXMnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuaXM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWZlcnJlZCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWZlcnJlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FycmF5T2ZEZWZmZXJlZCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5hcnJheU9mRGVmZmVyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcmVhdGVNb2NrVGFzaycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5jcmVhdGVNb2NrVGFzaztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2Nsb25lYWJsZUdlbmVyYXRvcicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5jbG9uZWFibGVHZW5lcmF0b3I7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhc0VmZmVjdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hc0VmZmVjdDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9wcm9jID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0hBTk5FTF9FTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcHJvYy5DSEFOTkVMX0VORDtcblx0ICB9XG5cdH0pO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHRleHBvcnRzLnJlZHVjZXIgPSByZWR1Y2VyO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfcHVsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU1KTtcblx0XG5cdHZhciBfcHVsbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wdWxsKTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdC8vIGluaXRpYWwgc3RhdGVcblx0dmFyIGluaXRpYWxTdGF0ZSA9IHtcblx0ICAgIHNlbGVjdEFsbDogdHJ1ZSxcblx0ICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgIGVycm9yOiBudWxsLFxuXHQgICAgdXNlcklkOiBudWxsLFxuXHQgICAgaXNfcmVzdHJpY3RlZDogZmFsc2UsXG5cdCAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgdXNlcl9wcm9qZWN0czogW10sXG5cdCAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuXHQgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVkdWNlcigpIHtcblx0ICAgIHZhciBfcmVkdWNlckFjdGlvbnM7XG5cdFxuXHQgICAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBpbml0aWFsU3RhdGU7XG5cdCAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHZhciByZWR1Y2VyQWN0aW9ucyA9IChfcmVkdWNlckFjdGlvbnMgPSB7fSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5TRVRfU1RPUkUsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIGRhdGEgPSBhY3Rpb24uZGF0YTtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBkYXRhKTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9HRVRfSU5JVCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9HRVRfU1VDQ0VTUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgX2FjdGlvbiRkYXRhID0gYWN0aW9uLmRhdGEsXG5cdCAgICAgICAgICAgIGFsbF9wcm9qZWN0cyA9IF9hY3Rpb24kZGF0YS5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgVXNlclByb2plY3RzIGRhdGFcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyAmJiB1c2VyX3Byb2plY3RzLnByb2plY3RzIHx8IFtdLFxuXHQgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCB8fCBmYWxzZVxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX0dFVF9GQUlMVVJFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBbXSxcblx0ICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX1BVVF9JTklULCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IHRydWUsXG5cdCAgICAgICAgICAgIGVycm9yOiBudWxsXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfUFVUX1NVQ0NFU1MsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIHVzZXJfcHJvamVjdHMgPSBhY3Rpb24uZGF0YS51c2VyX3Byb2plY3RzO1xuXHRcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgLy8gTk9URTogd2UncmUgXCJ1bndyYXBwaW5nXCIgdGhlIGxpc3Qgb2YgcHJvamVjdHMgaGVyZSwgdG8gc2ltcGxpZnkgdGhlIHN0b3JlXG5cdCAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcblx0ICAgICAgICAgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX1BVVF9GQUlMVVJFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBuZXdTdGF0ZSA9IF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGwsXG5cdCAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICB9KTtcblx0ICAgICAgICAvLyBPdmVyd3JpdGUgaWYgd2UgaGF2ZSBhbiBvcmlnaW5hbCB2YWx1ZVxuXHQgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgIG5ld1N0YXRlLmlzX3Jlc3RyaWN0ZWQgPSBzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cyAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICBuZXdTdGF0ZS51c2VyX3Byb2plY3RzID0gc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cztcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBwcm9qZWN0SWQgPSBhY3Rpb24uZGF0YS5wcm9qZWN0SWQ7XG5cdFxuXHQgICAgICAgIHZhciBvcmlnaW5hbF91c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHN0YXRlLnVzZXJfcHJvamVjdHMpKTtcblx0ICAgICAgICB2YXIgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdFxuXHQgICAgICAgICgwLCBfdXRpbHMuaW5BcnJheSkocHJvamVjdElkLCB1c2VyX3Byb2plY3RzKSA/ICgwLCBfcHVsbDIuZGVmYXVsdCkodXNlcl9wcm9qZWN0cywgcHJvamVjdElkKSA6IHVzZXJfcHJvamVjdHMucHVzaChwcm9qZWN0SWQpO1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogb3JpZ2luYWxfdXNlcl9wcm9qZWN0cywgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLlVQREFURV9JU19SRVNUUklDVEVELCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBpc19yZXN0cmljdGVkID0gYWN0aW9uLmRhdGEuaXNfcmVzdHJpY3RlZDtcblx0XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgeyBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLCBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBzdGF0ZS5pc19yZXN0cmljdGVkIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIG9yaWdpbmFsX3VzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgIHZhciB1c2VyX3Byb2plY3RzID0gdm9pZCAwLFxuXHQgICAgICAgICAgICBfc3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUpLFxuXHQgICAgICAgICAgICBzZWxlY3RBbGwgPSBfc3RhdGUuc2VsZWN0QWxsO1xuXHRcblx0ICAgICAgICBpZiAoc2VsZWN0QWxsKSB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBzdGF0ZS5hbGxfcHJvamVjdHMubWFwKGZ1bmN0aW9uIChwcm9qZWN0KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdC5pZDtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IFtdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBzZWxlY3RBbGwgPSAhc2VsZWN0QWxsO1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG9yaWdpbmFsX3VzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfcmVkdWNlckFjdGlvbnMpO1xuXHQgICAgaWYgKHJlZHVjZXJBY3Rpb25zLmhhc093blByb3BlcnR5KGFjdGlvbi50eXBlKSkge1xuXHQgICAgICAgIHJldHVybiByZWR1Y2VyQWN0aW9uc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBzdGF0ZTtcblx0ICAgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlUmVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU2KSxcblx0ICAgIHB1bGxBbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2Myk7XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgZ2l2ZW4gdmFsdWVzIGZyb20gYGFycmF5YCB1c2luZ1xuXHQgKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuXHQgKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG5cdCAqXG5cdCAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcblx0ICogdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gYW4gYXJyYXkgYnkgcHJlZGljYXRlLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjAuMFxuXHQgKiBAY2F0ZWdvcnkgQXJyYXlcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHsuLi4qfSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcblx0ICpcblx0ICogXy5wdWxsKGFycmF5LCAnYScsICdjJyk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0dmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gcHVsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KSxcblx0ICAgIG92ZXJSZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTcpLFxuXHQgICAgc2V0VG9TdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1OSk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcblx0ICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBhcHBseSA9IF9fd2VicGFja19yZXF1aXJlX18oNzU4KTtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXHRcblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG5cdCAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuXHQgICAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuXHQgICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblx0XG5cdCAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuXHQgICAgfVxuXHQgICAgaW5kZXggPSAtMTtcblx0ICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuXHQgICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuXHQgICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG5cdCAgICB9XG5cdCAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcblx0ICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuXHQgKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG5cdCAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuXHQgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cblx0ICovXG5cdGZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcblx0ICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG5cdCAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG5cdCAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG5cdCAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG5cdCAgfVxuXHQgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VTZXRUb1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzYwKSxcblx0ICAgIHNob3J0T3V0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjIpO1xuXHRcblx0LyoqXG5cdCAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGNvbnN0YW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjEpLFxuXHQgICAgZGVmaW5lUHJvcGVydHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyOCksXG5cdCAgICBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuXHQgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG5cdCAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcblx0ICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG5cdCAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuXHQgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjQuMFxuXHQgKiBAY2F0ZWdvcnkgVXRpbFxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuXHQgKlxuXHQgKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcblx0ICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG5cdCAqXG5cdCAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuXHQgKiAvLyA9PiB0cnVlXG5cdCAqL1xuXHRmdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB2YWx1ZTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xuXHR2YXIgSE9UX0NPVU5UID0gODAwLFxuXHQgICAgSE9UX1NQQU4gPSAxNjtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuXHQgKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcblx0ICogbWlsbGlzZWNvbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuXHQgIHZhciBjb3VudCA9IDAsXG5cdCAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcblx0ICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXHRcblx0ICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcblx0ICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG5cdCAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuXHQgICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNvdW50ID0gMDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VQdWxsQWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjQpO1xuXHRcblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKlxuXHQgKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDQuMC4wXG5cdCAqIEBjYXRlZ29yeSBBcnJheVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG5cdCAqXG5cdCAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0ZnVuY3Rpb24gcHVsbEFsbChhcnJheSwgdmFsdWVzKSB7XG5cdCAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG5cdCAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG5cdCAgICA6IGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXJyYXlNYXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzNCksXG5cdCAgICBiYXNlSW5kZXhPZiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY1KSxcblx0ICAgIGJhc2VJbmRleE9mV2l0aCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY5KSxcblx0ICAgIGJhc2VVbmFyeSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU2KSxcblx0ICAgIGNvcHlBcnJheSA9IF9fd2VicGFja19yZXF1aXJlX18oNzcwKTtcblx0XG5cdC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cblx0dmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cdFxuXHQvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cblx0dmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBbGxCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuXHQgKiBzaG9ydGhhbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG5cdCAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG5cdCAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG5cdCAgICAgIHNlZW4gPSBhcnJheTtcblx0XG5cdCAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcblx0ICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuXHQgIH1cblx0ICBpZiAoaXRlcmF0ZWUpIHtcblx0ICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG5cdCAgfVxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICB2YXIgZnJvbUluZGV4ID0gMCxcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF0sXG5cdCAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXHRcblx0ICAgIHdoaWxlICgoZnJvbUluZGV4ID0gaW5kZXhPZihzZWVuLCBjb21wdXRlZCwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSkgPiAtMSkge1xuXHQgICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcblx0ICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgICB9XG5cdCAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZUZpbmRJbmRleCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY2KSxcblx0ICAgIGJhc2VJc05hTiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY3KSxcblx0ICAgIHN0cmljdEluZGV4T2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OCk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuXHQgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcblx0ICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcblx0ICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcblx0ICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG5cdCAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcblx0ICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblx0XG5cdCAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcblx0ICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuXHQgKiBjb21wYXJpc29ucyBvZiB2YWx1ZXMsIGkuZS4gYD09PWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcblx0ICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuXHQgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuXHQgIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG5cdCAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGlmIChjb21wYXJhdG9yKGFycmF5W2luZGV4XSwgdmFsdWUpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG5cdCAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG5cdCAgdmFyIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cdFxuXHQgIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmdldElzUmVzdHJpY3RlZCA9IGV4cG9ydHMuZ2V0VXNlclByb2plY3RzID0gZXhwb3J0cy5nZXRVc2VySWQgPSB1bmRlZmluZWQ7XG5cdGV4cG9ydHMuZmV0Y2hEYXRhID0gZmV0Y2hEYXRhO1xuXHRleHBvcnRzLnB1dERhdGEgPSBwdXREYXRhO1xuXHRleHBvcnRzLmdldFNhZ2EgPSBnZXRTYWdhO1xuXHRleHBvcnRzLnB1dFNhZ2EgPSBwdXRTYWdhO1xuXHRleHBvcnRzLndhdGNoZXJTYWdhID0gd2F0Y2hlclNhZ2E7XG5cdFxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Mik7XG5cdFxuXHR2YXIgX2VmZmVjdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgX2F4aW9zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzMpO1xuXHRcblx0dmFyIF9heGlvczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9heGlvcyk7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMzI0KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIF9tYXJrZWQgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoZ2V0U2FnYSksXG5cdCAgICBfbWFya2VkMiA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhwdXRTYWdhKSxcblx0ICAgIF9tYXJrZWQzID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKHdhdGNoZXJTYWdhKTsgLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XG5cdC8vIFRoaXMgaW1wb3J0IGlzIG5lY2Vzc2FyeSB0byBiZSBhYmxlIHRvIHRlc3Qgc2FnYXMuXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkdXgtc2FnYS9yZWR1eC1zYWdhL2lzc3Vlcy8yODAjaXNzdWVjb21tZW50LTI5MTEzMzAyM1xuXHRcblx0XG5cdGZ1bmN0aW9uIGNhbGxBeGlvcyhjb25maWcpIHtcblx0ICAgIHJldHVybiAoMCwgX2F4aW9zMi5kZWZhdWx0KShjb25maWcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdCAgICAgICAgcmV0dXJuIHsgcmVzcG9uc2U6IHJlc3BvbnNlIH07XG5cdCAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgICByZXR1cm4geyBlcnJvcjogZXJyb3IgfTtcblx0ICAgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmZXRjaERhdGEodXNlcklkKSB7XG5cdCAgICB2YXIgY29uZmlnID0ge1xuXHQgICAgICAgIG1ldGhvZDogXCJnZXRcIixcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIlxuXHQgICAgfTtcblx0ICAgIHJldHVybiBjYWxsQXhpb3MoY29uZmlnKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcHV0RGF0YSh1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpIHtcblx0ICAgIHZhciBjb25maWcgPSB7XG5cdCAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxuXHQgICAgICAgIGhlYWRlcnM6IHtcblx0ICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiAoMCwgX3V0aWxzLmdldENvb2tpZSkoXCJjc3JmdG9rZW5cIilcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHVybDogXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIHVzZXJJZCArIFwiL1wiLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuXHQgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHByb2plY3RzOiB1c2VyX3Byb2plY3RzXG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRTYWdhKGFjdGlvbikge1xuXHQgICAgdmFyIHVzZXJJZCwgX3JlZiwgcmVzcG9uc2UsIGVycm9yO1xuXHRcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBnZXRTYWdhJChfY29udGV4dCkge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBhY3Rpb24uZGF0YS51c2VySWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShmZXRjaERhdGEsIHVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAzOlxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWYgPSBfY29udGV4dC5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX3JlZi5yZXNwb25zZTtcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvciA9IF9yZWYuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDExO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSA5O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX0dFVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX0ZBSUxVUkUsIGVycm9yOiBlcnJvciB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkLCB0aGlzKTtcblx0fVxuXHRcblx0dmFyIGdldFVzZXJJZCA9IGV4cG9ydHMuZ2V0VXNlcklkID0gZnVuY3Rpb24gZ2V0VXNlcklkKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUudXNlcklkO1xuXHR9O1xuXHR2YXIgZ2V0VXNlclByb2plY3RzID0gZXhwb3J0cy5nZXRVc2VyUHJvamVjdHMgPSBmdW5jdGlvbiBnZXRVc2VyUHJvamVjdHMoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VyX3Byb2plY3RzO1xuXHR9O1xuXHR2YXIgZ2V0SXNSZXN0cmljdGVkID0gZXhwb3J0cy5nZXRJc1Jlc3RyaWN0ZWQgPSBmdW5jdGlvbiBnZXRJc1Jlc3RyaWN0ZWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS5pc19yZXN0cmljdGVkO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcHV0U2FnYShhY3Rpb24pIHtcblx0ICAgIHZhciB1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMsIF9yZWYyLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIHB1dFNhZ2EkKF9jb250ZXh0Mikge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQyLnByZXYgPSBfY29udGV4dDIubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRVc2VySWQpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDc7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldElzUmVzdHJpY3RlZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA3OlxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDEwO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRVc2VyUHJvamVjdHMpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShwdXREYXRhLCB1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZjIgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9yZWYyLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZjIuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDE5O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTk6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIxOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yOiBlcnJvciB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDIsIHRoaXMpO1xuXHR9XG5cdFxuXHQvLyB3YXRjaGVyIHNhZ2E6IHdhdGNoZXMgZm9yIGFjdGlvbnMgZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmUsIHN0YXJ0cyB3b3JrZXIgc2FnYVxuXHRmdW5jdGlvbiB3YXRjaGVyU2FnYSgpIHtcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiB3YXRjaGVyU2FnYSQoX2NvbnRleHQzKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDMucHJldiA9IF9jb250ZXh0My5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5BUElfR0VUX0lOSVQsIGdldFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMsIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDg7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9JU19SRVNUUklDVEVELCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkMywgdGhpcyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuXHQgKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXHQgKlxuXHQgKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcblx0ICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuXHQgKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cblx0ICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuXHQgKi9cblx0XG5cdCEoZnVuY3Rpb24oZ2xvYmFsKSB7XG5cdCAgXCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHQgIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG5cdCAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuXHQgIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuXHQgIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG5cdCAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcblx0ICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuXHQgIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cdFxuXHQgIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG5cdCAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuXHQgIGlmIChydW50aW1lKSB7XG5cdCAgICBpZiAoaW5Nb2R1bGUpIHtcblx0ICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuXHQgICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuXHQgICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG5cdCAgICB9XG5cdCAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG5cdCAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHRcblx0ICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcblx0ICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG5cdCAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cdFxuXHQgIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcblx0ICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuXHQgICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG5cdCAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuXHQgICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cdFxuXHQgICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuXHQgICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuXHQgICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXHRcblx0ICAgIHJldHVybiBnZW5lcmF0b3I7XG5cdCAgfVxuXHQgIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cdFxuXHQgIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuXHQgIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuXHQgIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuXHQgIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2Vcblx0ICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG5cdCAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuXHQgIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG5cdCAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG5cdCAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuXHQgIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cblx0ICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcblx0ICAgIHRyeSB7XG5cdCAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcblx0ICAgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcblx0ICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcblx0ICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuXHQgIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cdFxuXHQgIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcblx0ICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG5cdCAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblx0XG5cdCAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG5cdCAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG5cdCAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcblx0ICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblx0XG5cdCAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuXHQgIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG5cdCAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cdCAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0XG5cdCAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuXHQgIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcblx0ICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcblx0ICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG5cdCAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcblx0ICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG5cdCAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG5cdCAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuXHQgIH1cblx0XG5cdCAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cblx0ICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcblx0ICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cblx0ICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXHRcblx0ICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuXHQgIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG5cdCAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuXHQgICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG5cdCAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG5cdCAgICAgIH07XG5cdCAgICB9KTtcblx0ICB9XG5cdFxuXHQgIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuXHQgICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuXHQgICAgcmV0dXJuIGN0b3Jcblx0ICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuXHQgICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cblx0ICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG5cdCAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG5cdCAgICAgIDogZmFsc2U7XG5cdCAgfTtcblx0XG5cdCAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG5cdCAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG5cdCAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcblx0ICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuXHQgICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcblx0ICAgIHJldHVybiBnZW5GdW47XG5cdCAgfTtcblx0XG5cdCAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG5cdCAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3Rcblx0ICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG5cdCAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cblx0ICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG5cdCAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuXHQgICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcblx0ICAgICAgICBpZiAodmFsdWUgJiZcblx0ICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG5cdCAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcblx0ICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cdCAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcblx0ICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG5cdCAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcblx0ICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG5cdCAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuXHQgICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3Rcblx0ICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2Vcblx0ICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cblx0ICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuXHQgICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG5cdCAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuXHQgICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG5cdCAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG5cdCAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG5cdCAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcblx0ICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuXHQgICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuXHQgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgICAgIH0sIHJlamVjdCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXHRcblx0ICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcblx0ICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cblx0ICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG5cdCAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG5cdCAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuXHQgICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG5cdCAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG5cdCAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cblx0ICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG5cdCAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcblx0ICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuXHQgICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG5cdCAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcblx0ICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG5cdCAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG5cdCAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcblx0ICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG5cdCAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG5cdCAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuXHQgICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG5cdCAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cblx0ICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG5cdCAgfVxuXHRcblx0ICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuXHQgIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0ICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXHRcblx0ICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG5cdCAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG5cdCAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG5cdCAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG5cdCAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuXHQgICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuXHQgICAgKTtcblx0XG5cdCAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG5cdCAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG5cdCAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0ICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuXHQgICAgICAgIH0pO1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuXHQgICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG5cdCAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG5cdCAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICB0aHJvdyBhcmc7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuXHQgICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcblx0ICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcblx0ICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cdFxuXHQgICAgICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG5cdCAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG5cdCAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblx0ICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuXHQgICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuXHQgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG5cdCAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3Ncblx0ICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG5cdCAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG5cdCAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cdCAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXHRcblx0ICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cdCAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG5cdCAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG5cdCAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG5cdCAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuXHQgICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG5cdCAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblx0XG5cdCAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuXHQgICAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICByZXR1cm4ge1xuXHQgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcblx0ICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG5cdCAgICAgICAgICB9O1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cdCAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG5cdCAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH1cblx0XG5cdCAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG5cdCAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuXHQgIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuXHQgIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuXHQgIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcblx0ICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG5cdCAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG5cdCAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHRcblx0ICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG5cdCAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG5cdCAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXHRcblx0ICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG5cdCAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuXHQgICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcblx0ICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblx0XG5cdCAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXHRcblx0ICAgIGlmICghIGluZm8pIHtcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGluZm8uZG9uZSkge1xuXHQgICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuXHQgICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuXHQgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblx0XG5cdCAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cblx0ICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblx0XG5cdCAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuXHQgICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG5cdCAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG5cdCAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuXHQgICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuXHQgICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG5cdCAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG5cdCAgICAgIHJldHVybiBpbmZvO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG5cdCAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuXHQgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICB9XG5cdFxuXHQgIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG5cdCAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuXHQgIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cdFxuXHQgIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cdFxuXHQgIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG5cdCAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcblx0ICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuXHQgIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuXHQgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfTtcblx0XG5cdCAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG5cdCAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXHRcblx0ICAgIGlmICgxIGluIGxvY3MpIHtcblx0ICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmICgyIGluIGxvY3MpIHtcblx0ICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG5cdCAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcblx0ICAgIH1cblx0XG5cdCAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG5cdCAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcblx0ICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcblx0ICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuXHQgICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcblx0ICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuXHQgICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuXHQgICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuXHQgICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcblx0ICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcblx0ICAgIHRoaXMucmVzZXQodHJ1ZSk7XG5cdCAgfVxuXHRcblx0ICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcblx0ICAgIHZhciBrZXlzID0gW107XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgIGtleXMucHVzaChrZXkpO1xuXHQgICAgfVxuXHQgICAga2V5cy5yZXZlcnNlKCk7XG5cdFxuXHQgICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcblx0ICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG5cdCAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG5cdCAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG5cdCAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG5cdCAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG5cdCAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuXHQgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbmV4dDtcblx0ICAgIH07XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG5cdCAgICBpZiAoaXRlcmFibGUpIHtcblx0ICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuXHQgICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcblx0ICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuXHQgICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcblx0ICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXHRcblx0ICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgIH07XG5cdFxuXHQgICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuXHQgICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuXHQgIH1cblx0ICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblx0XG5cdCAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcblx0ICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcblx0ICB9XG5cdFxuXHQgIENvbnRleHQucHJvdG90eXBlID0ge1xuXHQgICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cdFxuXHQgICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcblx0ICAgICAgdGhpcy5wcmV2ID0gMDtcblx0ICAgICAgdGhpcy5uZXh0ID0gMDtcblx0ICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3Ncblx0ICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cblx0ICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcblx0ICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG5cdCAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXHRcblx0ICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblx0XG5cdCAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuXHQgICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuXHQgICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcblx0ICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcblx0ICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuXHQgICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcblx0ICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgc3RvcDogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cdFxuXHQgICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuXHQgICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuXHQgICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHRoaXMucnZhbDtcblx0ICAgIH0sXG5cdFxuXHQgICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuXHQgICAgICBpZiAodGhpcy5kb25lKSB7XG5cdCAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG5cdCAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuXHQgICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG5cdCAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXHRcblx0ICAgICAgICBpZiAoY2F1Z2h0KSB7XG5cdCAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuXHQgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cdFxuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG5cdCAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuXHQgICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG5cdCAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuXHQgICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG5cdCAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcblx0ICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblx0XG5cdCAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcblx0ICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcblx0ICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuXHQgICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcblx0ICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcblx0ICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG5cdCAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuXHQgICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuXHQgICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cblx0ICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcblx0ICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuXHQgICAgICByZWNvcmQuYXJnID0gYXJnO1xuXHRcblx0ICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuXHQgICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG5cdCAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG5cdCAgICB9LFxuXHRcblx0ICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcblx0ICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcblx0ICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuXHQgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcblx0ICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuXHQgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfSxcblx0XG5cdCAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuXHQgICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG5cdCAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcblx0ICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuXHQgICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cdCAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcblx0ICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICByZXR1cm4gdGhyb3duO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG5cdCAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuXHQgICAgfSxcblx0XG5cdCAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuXHQgICAgICB0aGlzLmRlbGVnYXRlID0ge1xuXHQgICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuXHQgICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG5cdCAgICAgICAgbmV4dExvYzogbmV4dExvY1xuXHQgICAgICB9O1xuXHRcblx0ICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuXHQgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG5cdCAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuXHQgICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0ICB9O1xuXHR9KShcblx0ICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuXHQgIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cblx0ICAvLyBvZiBpbmRpcmVjdCBldmFsIHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LlxuXHQgIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzczOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzQpO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBBeGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc4KTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcblx0ICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcblx0ICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2Vcblx0ICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cdFxuXHQgIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cdFxuXHQgIHJldHVybiBpbnN0YW5jZTtcblx0fVxuXHRcblx0Ly8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5cdHZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblx0XG5cdC8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuXHRheGlvcy5BeGlvcyA9IEF4aW9zO1xuXHRcblx0Ly8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuXHRheGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcblx0ICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG5cdH07XG5cdFxuXHQvLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cblx0YXhpb3MuQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRheGlvcy5DYW5jZWxUb2tlbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzk3KTtcblx0YXhpb3MuaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Myk7XG5cdFxuXHQvLyBFeHBvc2UgYWxsL3NwcmVhZFxuXHRheGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcblx0ICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHR9O1xuXHRheGlvcy5zcHJlYWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OCk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXHRcblx0Ly8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5cdG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBiaW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHR2YXIgaXNCdWZmZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nyk7XG5cdFxuXHQvKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblx0XG5cdC8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cdFxuXHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcblx0ICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG5cdCAgdmFyIHJlc3VsdDtcblx0ICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG5cdCAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuXHQgIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuXHQgIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuXHQgKi9cblx0ZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0ICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG5cdCAqXG5cdCAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG5cdCAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cblx0ICpcblx0ICogd2ViIHdvcmtlcnM6XG5cdCAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuXHQgKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuXHQgKlxuXHQgKiByZWFjdC1uYXRpdmU6XG5cdCAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgcmV0dXJuIChcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG5cdCAgKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuXHQgKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0ICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcblx0ICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHRcblx0ICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcblx0ICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgb2JqID0gW29ial07XG5cdCAgfVxuXHRcblx0ICBpZiAoaXNBcnJheShvYmopKSB7XG5cdCAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuXHQgICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cblx0ICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG5cdCAqXG5cdCAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG5cdCAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cblx0ICpcblx0ICogRXhhbXBsZTpcblx0ICpcblx0ICogYGBganNcblx0ICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuXHQgKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcblx0ICovXG5cdGZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuXHQgIHZhciByZXN1bHQgPSB7fTtcblx0ICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcblx0ICovXG5cdGZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG5cdCAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBhW2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfSk7XG5cdCAgcmV0dXJuIGE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgIGlzQXJyYXk6IGlzQXJyYXksXG5cdCAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcblx0ICBpc0J1ZmZlcjogaXNCdWZmZXIsXG5cdCAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcblx0ICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG5cdCAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuXHQgIGlzTnVtYmVyOiBpc051bWJlcixcblx0ICBpc09iamVjdDogaXNPYmplY3QsXG5cdCAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuXHQgIGlzRGF0ZTogaXNEYXRlLFxuXHQgIGlzRmlsZTogaXNGaWxlLFxuXHQgIGlzQmxvYjogaXNCbG9iLFxuXHQgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG5cdCAgaXNTdHJlYW06IGlzU3RyZWFtLFxuXHQgIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcblx0ICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG5cdCAgZm9yRWFjaDogZm9yRWFjaCxcblx0ICBtZXJnZTogbWVyZ2UsXG5cdCAgZXh0ZW5kOiBleHRlbmQsXG5cdCAgdHJpbTogdHJpbVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG5cdCAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHQgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiFcblx0ICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuXHQgKlxuXHQgKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuXHQgKiBAbGljZW5zZSAgTUlUXG5cdCAqL1xuXHRcblx0Ly8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuXHQvLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcblx0ICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxuXHR9XG5cdFxuXHQvLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuXHRmdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxuXHR9XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIEludGVyY2VwdG9yTWFuYWdlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzkwKTtcblx0dmFyIGRpc3BhdGNoUmVxdWVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkxKTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRmdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuXHQgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcblx0ICB0aGlzLmludGVyY2VwdG9ycyA9IHtcblx0ICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcblx0ICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcblx0ICB9O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuXHQgKi9cblx0QXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcblx0ICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcblx0ICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcblx0ICAgICAgdXJsOiBhcmd1bWVudHNbMF1cblx0ICAgIH0sIGFyZ3VtZW50c1sxXSk7XG5cdCAgfVxuXHRcblx0ICBjb25maWcgPSB1dGlscy5tZXJnZShkZWZhdWx0cywge21ldGhvZDogJ2dldCd9LCB0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXHQgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHQgIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcblx0ICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXHQgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cdFxuXHQgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcblx0ICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG5cdCAgfSk7XG5cdFxuXHQgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcblx0ICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblx0XG5cdC8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybFxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybCxcblx0ICAgICAgZGF0YTogZGF0YVxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgwKTtcblx0XG5cdHZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcblx0ICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuXHQgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG5cdCAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG5cdCAgdmFyIGFkYXB0ZXI7XG5cdCAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MSk7XG5cdCAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MSk7XG5cdCAgfVxuXHQgIHJldHVybiBhZGFwdGVyO1xuXHR9XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdCAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblx0XG5cdCAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuXHQgICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcblx0ICAgICkge1xuXHQgICAgICByZXR1cm4gZGF0YTtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuXHQgICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuXHQgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG5cdCAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHQgICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZGF0YTtcblx0ICB9XSxcblx0XG5cdCAgLyoqXG5cdCAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG5cdCAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cblx0ICAgKi9cblx0ICB0aW1lb3V0OiAwLFxuXHRcblx0ICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuXHQgIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblx0XG5cdCAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cdFxuXHQgIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcblx0ICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcblx0ICB9XG5cdH07XG5cdFxuXHRkZWZhdWx0cy5oZWFkZXJzID0ge1xuXHQgIGNvbW1vbjoge1xuXHQgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG5cdCAgfVxuXHR9O1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xuXHR9KTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xuXHR9KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cdFxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG5cdCAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG5cdCAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG5cdCAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG5cdCAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciBzZXR0bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Mik7XG5cdHZhciBidWlsZFVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzg1KTtcblx0dmFyIHBhcnNlSGVhZGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg2KTtcblx0dmFyIGlzVVJMU2FtZU9yaWdpbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzg3KTtcblx0dmFyIGNyZWF0ZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODMpO1xuXHR2YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcblx0ICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG5cdCAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblx0XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcblx0ICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuXHQgICAgfVxuXHRcblx0ICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdCAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG5cdCAgICB2YXIgeERvbWFpbiA9IGZhbHNlO1xuXHRcblx0ICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG5cdCAgICAvLyBPbmx5IHN1cHBvcnRzIFBPU1QgYW5kIEdFVCBjYWxscyBhbmQgZG9lc24ndCByZXR1cm5zIHRoZSByZXNwb25zZSBoZWFkZXJzLlxuXHQgICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuXHQgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcblx0ICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG5cdCAgICAgIHJlcXVlc3QgPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cdCAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuXHQgICAgICB4RG9tYWluID0gdHJ1ZTtcblx0ICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7fTtcblx0ICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuXHQgICAgaWYgKGNvbmZpZy5hdXRoKSB7XG5cdCAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuXHQgICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcblx0ICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcblx0ICAgIH1cblx0XG5cdCAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXHRcblx0ICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG5cdCAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblx0XG5cdCAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG5cdCAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuXHQgICAgICBpZiAoIXJlcXVlc3QgfHwgKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCAmJiAheERvbWFpbikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuXHQgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuXHQgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuXHQgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG5cdCAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2Vcblx0ICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuXHQgICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHQgICAgICB2YXIgcmVzcG9uc2UgPSB7XG5cdCAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuXHQgICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuXHQgICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiByZXF1ZXN0LnN0YXR1cyxcblx0ICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcblx0ICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG5cdCAgICAgICAgY29uZmlnOiBjb25maWcsXG5cdCAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuXHQgICAgICB9O1xuXHRcblx0ICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuXHQgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG5cdCAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuXHQgICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3Jcblx0ICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgdGltZW91dFxuXHQgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcblx0ICAgICAgICByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuXHQgICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblx0ICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG5cdCAgICAgIHZhciBjb29raWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODkpO1xuXHRcblx0ICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG5cdCAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG5cdCAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG5cdCAgICAgICAgICB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICBpZiAoeHNyZlZhbHVlKSB7XG5cdCAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG5cdCAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcblx0ICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuXHQgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuXHQgICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuXHQgICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG5cdCAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpIHtcblx0ICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblx0ICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuXHQgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuXHQgICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG5cdCAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuXHQgICAgICAgICAgdGhyb3cgZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG5cdCAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuXHQgICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG5cdCAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG5cdCAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG5cdCAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuXHQgICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcblx0ICB9KTtcblx0fTtcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdFxuXHQvKipcblx0ICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG5cdCAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG5cdCAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcblx0ICAgIHJlc29sdmUocmVzcG9uc2UpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWplY3QoY3JlYXRlRXJyb3IoXG5cdCAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG5cdCAgICAgIHJlc3BvbnNlLmNvbmZpZyxcblx0ICAgICAgbnVsbCxcblx0ICAgICAgcmVzcG9uc2UucmVxdWVzdCxcblx0ICAgICAgcmVzcG9uc2Vcblx0ICAgICkpO1xuXHQgIH1cblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBlbmhhbmNlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NCk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdCAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cblx0ICpcblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICBlcnJvci5jb25maWcgPSBjb25maWc7XG5cdCAgaWYgKGNvZGUpIHtcblx0ICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuXHQgIH1cblx0ICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcblx0ICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuXHQgIHJldHVybiBlcnJvcjtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdGZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcblx0ICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG5cdCAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG5cdCAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG5cdCAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cblx0ICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cblx0ICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuXHQgICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuXHQgICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIGlmICghcGFyYW1zKSB7XG5cdCAgICByZXR1cm4gdXJsO1xuXHQgIH1cblx0XG5cdCAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG5cdCAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHZhciBwYXJ0cyA9IFtdO1xuXHRcblx0ICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcblx0ICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuXHQgICAgICAgIGtleSA9IGtleSArICdbXSc7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFsID0gW3ZhbF07XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcblx0ICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG5cdCAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcblx0ICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdFxuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG5cdCAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gdXJsO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0Ly8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcblx0Ly8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xuXHR2YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG5cdCAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcblx0ICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG5cdCAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuXHQgICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5cdF07XG5cdFxuXHQvKipcblx0ICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuXHQgKlxuXHQgKiBgYGBcblx0ICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcblx0ICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG5cdCAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcblx0ICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcblx0ICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3Rcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICB2YXIgcGFyc2VkID0ge307XG5cdCAgdmFyIGtleTtcblx0ICB2YXIgdmFsO1xuXHQgIHZhciBpO1xuXHRcblx0ICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXHRcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuXHQgICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuXHQgICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcblx0ICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblx0XG5cdCAgICBpZiAoa2V5KSB7XG5cdCAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gcGFyc2VkO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuXHQgIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdCAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdCAgICB2YXIgb3JpZ2luVVJMO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuXHQgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgKi9cblx0ICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG5cdCAgICAgIHZhciBocmVmID0gdXJsO1xuXHRcblx0ICAgICAgaWYgKG1zaWUpIHtcblx0ICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG5cdCAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdCAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHRcblx0ICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuXHQgICAgICByZXR1cm4ge1xuXHQgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG5cdCAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcblx0ICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuXHQgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcblx0ICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcblx0ICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuXHQgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cblx0ICAgICAgICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuXHQgICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHRcblx0ICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3Rcblx0ICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuXHQgICAgKi9cblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuXHQgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuXHQgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG5cdCAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG5cdCAgICB9O1xuXHQgIH0pKCkgOlxuXHRcblx0ICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0Ly8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cdFxuXHR2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXHRcblx0ZnVuY3Rpb24gRSgpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcblx0fVxuXHRFLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcblx0RS5wcm90b3R5cGUuY29kZSA9IDU7XG5cdEUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblx0XG5cdGZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcblx0ICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcblx0ICB2YXIgb3V0cHV0ID0gJyc7XG5cdCAgZm9yIChcblx0ICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG5cdCAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycztcblx0ICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcblx0ICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG5cdCAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG5cdCAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuXHQgICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcblx0ICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuXHQgICkge1xuXHQgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuXHQgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuXHQgICAgICB0aHJvdyBuZXcgRSgpO1xuXHQgICAgfVxuXHQgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG5cdCAgfVxuXHQgIHJldHVybiBvdXRwdXQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gKFxuXHQgIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXHRcblx0ICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcblx0ICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuXHQgICAgICAgIHZhciBjb29raWUgPSBbXTtcblx0ICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG5cdCAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcblx0ICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuXHQgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cblx0ICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG5cdCAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG5cdCAgICB9O1xuXHQgIH0pKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdGZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcblx0ICB0aGlzLmhhbmRsZXJzID0gW107XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcblx0ICpcblx0ICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuXHQgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG5cdCAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcblx0ICAgIHJlamVjdGVkOiByZWplY3RlZFxuXHQgIH0pO1xuXHQgIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG5cdH07XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuXHQgIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuXHQgICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuXHQgKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuXHQgKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3Jcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcblx0ICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcblx0ICAgIGlmIChoICE9PSBudWxsKSB7XG5cdCAgICAgIGZuKGgpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciB0cmFuc2Zvcm1EYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTIpO1xuXHR2YXIgaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Myk7XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIGlzQWJzb2x1dGVVUkwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NCk7XG5cdHZhciBjb21iaW5lVVJMcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzk1KTtcblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcblx0ICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG5cdCAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuXHQgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuXHQgIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuXHQgICAgY29uZmlnLnVybCA9IGNvbWJpbmVVUkxzKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcblx0ICB9XG5cdFxuXHQgIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG5cdCAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblx0XG5cdCAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuXHQgIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgIGNvbmZpZy5kYXRhLFxuXHQgICAgY29uZmlnLmhlYWRlcnMsXG5cdCAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuXHQgICk7XG5cdFxuXHQgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuXHQgIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG5cdCAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG5cdCAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG5cdCAgKTtcblx0XG5cdCAgdXRpbHMuZm9yRWFjaChcblx0ICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuXHQgICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG5cdCAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuXHQgICAgfVxuXHQgICk7XG5cdFxuXHQgIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblx0XG5cdCAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcblx0ICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXHQgICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgIHJlc3BvbnNlLmRhdGEsXG5cdCAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG5cdCAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgKTtcblx0XG5cdCAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuXHQgICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG5cdCAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG5cdCAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgICAgICk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcblx0ICB9KTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdC8qKlxuXHQgKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuXHQgKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuXHQgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG5cdCAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBkYXRhO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuXHQgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuXHQgIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cblx0ICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcblx0ICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cblx0ICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcblx0ICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuXHQgIHJldHVybiByZWxhdGl2ZVVSTFxuXHQgICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcblx0ICAgIDogYmFzZVVSTDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cblx0ICpcblx0ICogQGNsYXNzXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG5cdCAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xuXHR9O1xuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIENhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk2KTtcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcblx0ICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG5cdCAgfVxuXHRcblx0ICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cdCAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcblx0ICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcblx0ICB9KTtcblx0XG5cdCAgdmFyIHRva2VuID0gdGhpcztcblx0ICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuXHQgICAgaWYgKHRva2VuLnJlYXNvbikge1xuXHQgICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHRcblx0ICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG5cdCAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cblx0ICovXG5cdENhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcblx0ICBpZiAodGhpcy5yZWFzb24pIHtcblx0ICAgIHRocm93IHRoaXMucmVhc29uO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG5cdCAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG5cdCAqL1xuXHRDYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG5cdCAgdmFyIGNhbmNlbDtcblx0ICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuXHQgICAgY2FuY2VsID0gYztcblx0ICB9KTtcblx0ICByZXR1cm4ge1xuXHQgICAgdG9rZW46IHRva2VuLFxuXHQgICAgY2FuY2VsOiBjYW5jZWxcblx0ICB9O1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cblx0ICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuXHQgKiAgZi5hcHBseShudWxsLCBhcmdzKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cblx0ICpcblx0ICogIGBgYGpzXG5cdCAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG5cdCAqICBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcblx0ICogQHJldHVybnMge0Z1bmN0aW9ufVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcblx0ICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDExMjY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gcmVzdHJpY3RlZFVzZXJQcm9qZWN0c0J5T3JnID0gW3tcblx0ICAgIG9yZ2FuaXNhdGlvbnM6IFwiRVVURiwgU05WXCIsXG5cdCAgICBwcm9qZWN0czogW3tcblx0ICAgICAgICBpZDogMSxcblx0ICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDFcIixcblx0ICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDEgc3VidGl0bGVcIixcblx0ICAgICAgICBhY2Nlc3M6IHRydWVcblx0ICAgIH0sIHtcblx0ICAgICAgICBpZDogMixcblx0ICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDJcIixcblx0ICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDIgc3VidGl0bGVcIixcblx0ICAgICAgICBhY2Nlc3M6IHRydWVcblx0ICAgIH0sIHtcblx0ICAgICAgICBpZDogMyxcblx0ICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDNcIixcblx0ICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDMgc3VidGl0bGVcIixcblx0ICAgICAgICBhY2Nlc3M6IHRydWVcblx0ICAgIH1dXG5cdH0sIHtcblx0ICAgIG9yZ2FuaXNhdGlvbnM6IFwiRVVURiwgR0laXCIsXG5cdCAgICBwcm9qZWN0czogW3tcblx0ICAgICAgICBpZDogNCxcblx0ICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDRcIixcblx0ICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDQgc3VidGl0bGVcIixcblx0ICAgICAgICBhY2Nlc3M6IHRydWVcblx0ICAgIH0sIHtcblx0ICAgICAgICBpZDogNSxcblx0ICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDVcIixcblx0ICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDUgc3VidGl0bGVcIixcblx0ICAgICAgICBhY2Nlc3M6IHRydWVcblx0ICAgIH1dXG5cdH0sIHtcblx0ICAgIG9yZ2FuaXNhdGlvbnM6IFwiRVVURlwiLFxuXHQgICAgcHJvamVjdHM6IFt7XG5cdCAgICAgICAgaWQ6IDYsXG5cdCAgICAgICAgdGl0bGU6IFwiUHJvamVjdCA2XCIsXG5cdCAgICAgICAgc3VidGl0bGU6IFwiUHJvamVjdCA2IHN1YnRpdGxlXCIsXG5cdCAgICAgICAgYWNjZXNzOiB0cnVlXG5cdCAgICB9LCB7XG5cdCAgICAgICAgaWQ6IDcsXG5cdCAgICAgICAgdGl0bGU6IFwiUHJvamVjdCA3XCIsXG5cdCAgICAgICAgc3VidGl0bGU6IFwiUHJvamVjdCA3IHN1YnRpdGxlXCIsXG5cdCAgICAgICAgYWNjZXNzOiB0cnVlXG5cdCAgICB9XVxuXHR9XTtcblxuLyoqKi8gfSlcblxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCIvKlxuIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XG5cbmltcG9ydCBBcHAgZnJvbSBcIi4vY29tcG9uZW50cy9BcHBcIjtcblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSB9IGZyb20gXCJyZWR1eFwiO1xuaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXCJyZWR1eC1zYWdhXCI7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuXG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSBcIi4vcmVkdWNlclwiO1xuaW1wb3J0IHsgd2F0Y2hlclNhZ2EgfSBmcm9tIFwiLi9zYWdhc1wiO1xuXG4vLyBjcmVhdGUgdGhlIHNhZ2EgbWlkZGxld2FyZVxuY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpO1xuXG4vLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuY29uc3QgcmVkdXhEZXZUb29scyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCk7XG5cbmxldCBzdG9yZTtcbmlmIChyZWR1eERldlRvb2xzKSB7XG4gICAgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBjb21wb3NlKGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSksIHJlZHV4RGV2VG9vbHMpKTtcbn0gZWxzZSB7XG4gICAgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKTtcbn1cblxuc2FnYU1pZGRsZXdhcmUucnVuKHdhdGNoZXJTYWdhKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgICAgIDxBcHAgLz5cbiAgICAgICAgPC9Qcm92aWRlcj4sXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclByb2plY3RzXCIpXG4gICAgKTtcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvYXBwLmpzIiwiLypcbiAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IF8sIGRhdGFGcm9tRWxlbWVudCwgaW5BcnJheSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuLi9jb25zdFwiO1xuXG5pbXBvcnQgcHJvamVjdHMgZnJvbSBcIi4uL21vY2stZGF0YVwiXG5cbmNvbnN0IElzUmVzdHJpY3RlZCA9ICh7IF8sIGlzX3Jlc3RyaWN0ZWQsIG9uQ2hhbmdlSXNSZXN0cmljdGVkIH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJpc19yZXN0cmljdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgey8qIFRoZSBzdHJpbmdzIGluY2x1ZGUgPHN0cm9uZz4gdGFncyB3aGljaCByZXF1aXJlcyB0aGUgdXNlIG9mXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICovfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IGlzX3Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB7aXNfcmVzdHJpY3RlZCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlc3RyaWN0ZWRJbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBfKFwicmVzdHJpY3RlZF9pbmZvXCIpIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jb25zdCBQcm9qZWN0ID0gKHsgXywgcHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgfSkgPT4ge1xuICAgIC8vIE5PVEU6IHRoZSBjaGVja2VkIHZhbHVlIGlzIHNldCB0byB0cnVlIGlmIGlzX3Jlc3RyaWN0ZWQgaXMgZmFsc2UuIFRoaXMgaXMgc28gdGhhdCB0aGUgbGlzdCBvZlxuICAgIC8vIHByb2plY3RzIGxvb2tzIGxpa2UgYWxsIHByb2plY3RzIGFyZSBzZWxlY3RlZCB3aGVuIHJlc3RyaWN0aW9ucyBhcmUgbm90IGluIGZvcmNlLlxuICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cbiAgICBjb25zdCB1aVNldHRpbmdzID0gKHByb2plY3QsIHVzZXJfcHJvamVjdHMsIGlzX3Jlc3RyaWN0ZWQpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9ICFpc19yZXN0cmljdGVkIHx8ICh1c2VyX3Byb2plY3RzICYmIGluQXJyYXkocHJvamVjdC5pZCwgdXNlcl9wcm9qZWN0cykpLFxuICAgICAgICAgICAgZGlzYWJsZWQgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgIHByb2plY3RTZWxlY3RlZCA9IGNoZWNrZWQgPyBcIiBwcm9qZWN0U2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgICAgICB0ckNsYXNzTmFtZSA9IGRpc2FibGVkICsgcHJvamVjdFNlbGVjdGVkLFxuICAgICAgICAgICAgaWRDbGFzc05hbWUgPSBkaXNhYmxlZCArIFwiIGlkXCI7XG4gICAgICAgIHJldHVybiB7IGNoZWNrZWQsIHRyQ2xhc3NOYW1lLCBpZENsYXNzTmFtZSB9O1xuICAgIH07XG4gICAgY29uc3QgeyBjaGVja2VkLCB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWUgfSA9IHVpU2V0dGluZ3MocHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHRyXG4gICAgICAgICAgICBrZXk9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBpZD17cHJvamVjdC5pZH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2hhbmdlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0ckNsYXNzTmFtZX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZD17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgICAgICByZWFkT25seT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2lkQ2xhc3NOYW1lfT57cHJvamVjdC5pZH08L3RkPlxuICAgICAgICAgICAgPHRkPntwcm9qZWN0LnRpdGxlIHx8IF8oXCJub190aXRsZVwiKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICk7XG59O1xuXG5jb25zdCBTZWxlY3RBbGwgPSAoeyBfLCBzZWxlY3RBbGwsIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCwgaXNfcmVzdHJpY3RlZCB9KSA9PiB7XG4gICAgY29uc3QgdWlTZXR0aW5ncyA9IGlzX3Jlc3RyaWN0ZWQgPT4ge1xuICAgICAgICBjb25zdCBidXR0b25DbGFzcyA9IFwic2VsZWN0QWxsUHJvamVjdHNcIiArIChpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiIGRpc2FibGVkXCIpLFxuICAgICAgICAgICAgZGlzYWJsZWQgPSAhaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgIGRpdkNsYXNzID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgICAgIHJldHVybiB7IGJ1dHRvbkNsYXNzLCBkaXNhYmxlZCwgZGl2Q2xhc3MgfTtcbiAgICB9O1xuICAgIGNvbnN0IHsgZGl2Q2xhc3MsIGRpc2FibGVkLCBidXR0b25DbGFzcyB9ID0gdWlTZXR0aW5ncyhpc19yZXN0cmljdGVkKTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17ZGl2Q2xhc3N9PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9IGRpc2FibGVkPXtkaXNhYmxlZH0gY2xhc3NOYW1lPXtidXR0b25DbGFzc30+XG4gICAgICAgICAgICAgICAge3NlbGVjdEFsbCA/IF8oXCJjaGVja19hbGxfcHJvamVjdHNcIikgOiBfKFwidW5jaGVja19hbGxfcHJvamVjdHNcIil9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmNvbnN0IEVycm9yID0gKHsgXywgZXJyb3IgfSkgPT4ge1xuICAgIHJldHVybiBlcnJvciA/IDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JcIj57XyhcImFuX2Vycm9yX29jY3VyZWRcIikgKyBlcnJvci5tZXNzYWdlfTwvZGl2PiA6IG51bGw7XG59O1xuXG5jb25zdCBQcm9qZWN0cyA9ICh7XG4gICAgXyxcbiAgICBlcnJvcixcbiAgICBwcm9qZWN0cyxcbiAgICAvLyB1c2VyX3Byb2plY3RzLFxuICAgIC8vIGlzX3Jlc3RyaWN0ZWQsXG4gICAgc2VsZWN0QWxsLFxuICAgIC8vIG9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcbiAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxufSkgPT4ge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPEVycm9yIF89e199IGVycm9yPXtlcnJvcn0gLz5cbiAgICAgICAgICAgIHsvKjxJc1Jlc3RyaWN0ZWQqL31cbiAgICAgICAgICAgICAgICB7LypfPXtffSovfVxuICAgICAgICAgICAgICAgIHsvKmlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9Ki99XG4gICAgICAgICAgICAgICAgey8qb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ9e29uQ2hhbmdlSXNSZXN0cmljdGVkfSovfVxuICAgICAgICAgICAgey8qLz4qL31cbiAgICAgICAgICAgIDxTZWxlY3RBbGxcbiAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHRhYmxlPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcImFjY2Vzc1wiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcInByb2plY3RfaWRcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJwcm9qZWN0X3RpdGxlXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHthbGxfcHJvamVjdHMubWFwKHByb2plY3QgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFByb2plY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXtwcm9qZWN0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM9e3VzZXJfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCA9IHRoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl8gPSB0aGlzLl8uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuICAgIF8ocykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcbiAgICB9XG5cbiAgICB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBwYXJzZUludCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVByb2plY3RTZWxlY3Rpb24oaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IGRhdGFGcm9tRWxlbWVudChcInVzZXItdG8tcmVzdHJpY3RcIikuaWQ7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyB1c2VySWQgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IGRhdGFGcm9tRWxlbWVudChcInVzZXItcHJvamVjdHMtdGV4dFwiKTtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHN0cmluZ3MgfSk7XG5cbiAgICAgICAgLy8gdGhpcy5wcm9wcy5vbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBwcm9qZWN0cyB9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsLCBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gYWxsX3Byb2plY3RzID8gKFxuICAgICAgICAgICAgPFByb2plY3RzXG4gICAgICAgICAgICAgICAgXz17dGhpcy5ffVxuICAgICAgICAgICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgICAgICAgICAvLyBpc19yZXN0cmljdGVkPXtpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIHByb2plY3RzPXthbGxfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgLy8gdXNlcl9wcm9qZWN0cz17dXNlcl9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICAvLyBvbkNoYW5nZUlzUmVzdHJpY3RlZD17dGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXt0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXY+e18oXCJsb2FkaW5nXCIpfTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgICAgZmV0Y2hpbmcsXG4gICAgICAgIGVycm9yLFxuICAgICAgICBhbGxfcHJvamVjdHMsXG4gICAgICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgIHNlbGVjdEFsbCxcbiAgICAgICAgdXNlcl9wcm9qZWN0cyxcbiAgICAgICAgc3RyaW5nc1xuICAgIH0gPSBzdGF0ZTtcbiAgICByZXR1cm4geyBmZXRjaGluZywgZXJyb3IsIGFsbF9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsLCB1c2VyX3Byb2plY3RzLCBzdHJpbmdzIH07XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSBkaXNwYXRjaCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb25GZXRjaFVzZXJQcm9qZWN0czogdXNlcklkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5BUElfR0VUX0lOSVQsXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgIHNldFN0b3JlOiBkYXRhID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5TRVRfU1RPUkUsXG4gICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgfSksXG4gICAgICAgIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbjogcHJvamVjdElkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sXG4gICAgICAgICAgICAgICAgZGF0YTogeyBwcm9qZWN0SWQgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgIG9uVXBkYXRlSXNSZXN0cmljdGVkOiBpc19yZXN0cmljdGVkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzX3Jlc3RyaWN0ZWQgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgIG9uVXBkYXRlU2VsZWN0QWxsOiAoKSA9PiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgfSlcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQXBwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbXBvbmVudHMvQXBwLmpzeCIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IHN0b3JlIGZyb20gXCIuLi9teS1yZXN1bHRzL3N0b3JlXCI7XG5cbmV4cG9ydCBjb25zdCBlbmRwb2ludHMgPSB7XG4gICAgdXNlcl9wcm9qZWN0c19hY2Nlc3M6IGlkID0+IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke2lkfS8/Zm9ybWF0PWpzb25gXG59O1xuXG5leHBvcnQgY29uc3QgaW5BcnJheSA9IChvYmosIGFycikgPT4gYXJyICYmIGFyci5pbmRleE9mKG9iaikgIT09IC0xO1xuXG5leHBvcnQgY29uc3QgZGF0YUZyb21FbGVtZW50ID0gZWxlbWVudE5hbWUgPT4ge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKS5pbm5lckhUTUwpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG4vLyBhY3Rpb24gdHlwZXNcbmV4cG9ydCBjb25zdCAvL1xuICAgIFNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG4gICAgLy9cbiAgICBBUElfR0VUX0lOSVQgPSBcIkFQSV9HRVRfSU5JVFwiLFxuICAgIEFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG4gICAgQVBJX0dFVF9GQUlMVVJFID0gXCJBUElfR0VUX0ZBSUxVUkVcIixcbiAgICAvL1xuICAgIEFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG4gICAgQVBJX1BVVF9TVUNDRVNTID0gXCJBUElfUFVUX1NVQ0NFU1NcIixcbiAgICBBUElfUFVUX0ZBSUxVUkUgPSBcIkFQSV9QVVRfRkFJTFVSRVwiLFxuICAgIC8vXG4gICAgVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OID0gXCJVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT05cIixcbiAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IFwiVVBEQVRFX0lTX1JFU1RSSUNURURcIixcbiAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IFwiVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFNcIjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblxudmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvcnVuU2FnYScpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuICB9XG59KTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvY2hhbm5lbCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0VORCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLkVORDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2V2ZW50Q2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLmV2ZW50Q2hhbm5lbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NoYW5uZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5jaGFubmVsO1xuICB9XG59KTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvYnVmZmVycycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2J1ZmZlcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYnVmZmVycy5idWZmZXJzO1xuICB9XG59KTtcblxudmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3NhZ2FIZWxwZXJzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VFdmVyeTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUxhdGVzdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRocm90dGxlO1xuICB9XG59KTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3V0aWxzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVsYXknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuZGVsYXk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdDQU5DRUwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuQ0FOQ0VMO1xuICB9XG59KTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGV0YWNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmRldGFjaDtcbiAgfVxufSk7XG5cbnZhciBfbWlkZGxld2FyZSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL21pZGRsZXdhcmUnKTtcblxudmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblxudmFyIF9lZmZlY3RzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZWZmZWN0cycpO1xuXG52YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cbnZhciBfdXRpbHMyID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIHV0aWxzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF91dGlsczIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBfbWlkZGxld2FyZTIuZGVmYXVsdDtcbmV4cG9ydHMuZWZmZWN0cyA9IGVmZmVjdHM7XG5leHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Mzhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5ydW5TYWdhID0gcnVuU2FnYTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Byb2MnKTtcblxudmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFJVTl9TQUdBX1NJR05BVFVSRSA9ICdydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhLCAuLi5hcmdzKSc7XG52YXIgTk9OX0dFTkVSQVRPUl9FUlIgPSBSVU5fU0FHQV9TSUdOQVRVUkUgKyAnOiBzYWdhIGFyZ3VtZW50IG11c3QgYmUgYSBHZW5lcmF0b3IgZnVuY3Rpb24hJztcblxuZnVuY3Rpb24gcnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblxuICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHN0b3JlSW50ZXJmYWNlKSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgKDAsIF91dGlscy5sb2cpKCd3YXJuJywgJ3J1blNhZ2EoaXRlcmF0b3IsIHN0b3JlSW50ZXJmYWNlKSBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBSVU5fU0FHQV9TSUdOQVRVUkUpO1xuICAgIH1cbiAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuICAgIHN0b3JlSW50ZXJmYWNlID0gc2FnYTtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuICAgIGl0ZXJhdG9yID0gc2FnYS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PTl9HRU5FUkFUT1JfRVJSKTtcbiAgfVxuXG4gIHZhciBfc3RvcmVJbnRlcmZhY2UgPSBzdG9yZUludGVyZmFjZSxcbiAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG4gICAgICBkaXNwYXRjaCA9IF9zdG9yZUludGVyZmFjZS5kaXNwYXRjaCxcbiAgICAgIGdldFN0YXRlID0gX3N0b3JlSW50ZXJmYWNlLmdldFN0YXRlLFxuICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuICAgICAgc2FnYU1vbml0b3IgPSBfc3RvcmVJbnRlcmZhY2Uuc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXIgPSBfc3RvcmVJbnRlcmZhY2UubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXG5cbiAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cbiAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG4gICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkID0gc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCA9IHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgfHwgX3V0aWxzLm5vb3A7XG5cbiAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQoeyBlZmZlY3RJZDogZWZmZWN0SWQsIHJvb3Q6IHRydWUsIHBhcmVudEVmZmVjdElkOiAwLCBlZmZlY3Q6IHsgcm9vdDogdHJ1ZSwgc2FnYTogc2FnYSwgYXJnczogYXJncyB9IH0pO1xuICB9XG5cbiAgdmFyIHRhc2sgPSAoMCwgX3Byb2MyLmRlZmF1bHQpKGl0ZXJhdG9yLCBzdWJzY3JpYmUsICgwLCBfdXRpbHMud3JhcFNhZ2FEaXNwYXRjaCkoZGlzcGF0Y2gpLCBnZXRTdGF0ZSwgY29udGV4dCwgeyBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsIGxvZ2dlcjogbG9nZ2VyLCBvbkVycm9yOiBvbkVycm9yIH0sIGVmZmVjdElkLCBzYWdhLm5hbWUpO1xuXG4gIGlmIChzYWdhTW9uaXRvcikge1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCB0YXNrKTtcbiAgfVxuXG4gIHJldHVybiB0YXNrO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzXG4vLyBtb2R1bGUgaWQgPSA3Mzlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuY2hlY2sgPSBjaGVjaztcbmV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG5leHBvcnRzLmRlZmVycmVkID0gZGVmZXJyZWQ7XG5leHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcbmV4cG9ydHMuZGVsYXkgPSBkZWxheTtcbmV4cG9ydHMuY3JlYXRlTW9ja1Rhc2sgPSBjcmVhdGVNb2NrVGFzaztcbmV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5leHBvcnRzLm1ha2VJdGVyYXRvciA9IG1ha2VJdGVyYXRvcjtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG52YXIgc3ltID0gZXhwb3J0cy5zeW0gPSBmdW5jdGlvbiBzeW0oaWQpIHtcbiAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvJyArIGlkO1xufTtcblxudmFyIFRBU0sgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5UQVNLID0gc3ltKCdUQVNLJyk7XG52YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcbnZhciBNQVRDSCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLk1BVENIID0gc3ltKCdNQVRDSCcpO1xudmFyIENBTkNFTCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkNBTkNFTCA9IHN5bSgnQ0FOQ0VMX1BST01JU0UnKTtcbnZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xudmFyIFNFTEZfQ0FOQ0VMTEFUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0VMRl9DQU5DRUxMQVRJT04gPSBzeW0oJ1NFTEZfQ0FOQ0VMTEFUSU9OJyk7XG52YXIga29uc3QgPSBleHBvcnRzLmtvbnN0ID0gZnVuY3Rpb24ga29uc3Qodikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB2O1xuICB9O1xufTtcbnZhciBrVHJ1ZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtUcnVlID0ga29uc3QodHJ1ZSk7XG52YXIga0ZhbHNlID0gLyojX19QVVJFX18qL2V4cG9ydHMua0ZhbHNlID0ga29uc3QoZmFsc2UpO1xudmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG52YXIgaWRlbnQgPSBleHBvcnRzLmlkZW50ID0gZnVuY3Rpb24gaWRlbnQodikge1xuICByZXR1cm4gdjtcbn07XG5cbmZ1bmN0aW9uIGNoZWNrKHZhbHVlLCBwcmVkaWNhdGUsIGVycm9yKSB7XG4gIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgY2hlY2snLCBlcnJvcik7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgfVxufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaGFzT3duKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgcmV0dXJuIGlzLm5vdFVuZGVmKG9iamVjdCkgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcbn1cblxudmFyIGlzID0gZXhwb3J0cy5pcyA9IHtcbiAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcbiAgICByZXR1cm4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQ7XG4gIH0sXG4gIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG4gICAgcmV0dXJuIHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkO1xuICB9LFxuICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcbiAgICByZXR1cm4gdHlwZW9mIGYgPT09ICdmdW5jdGlvbic7XG4gIH0sXG4gIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09ICdudW1iZXInO1xuICB9LFxuICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzID09PSAnc3RyaW5nJztcbiAgfSxcbiAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG4gIG9iamVjdDogZnVuY3Rpb24gb2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgIWlzLmFycmF5KG9iaikgJiYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG9iaikpID09PSAnb2JqZWN0JztcbiAgfSxcbiAgcHJvbWlzZTogZnVuY3Rpb24gcHJvbWlzZShwKSB7XG4gICAgcmV0dXJuIHAgJiYgaXMuZnVuYyhwLnRoZW4pO1xuICB9LFxuICBpdGVyYXRvcjogZnVuY3Rpb24gaXRlcmF0b3IoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhpdC5uZXh0KSAmJiBpcy5mdW5jKGl0LnRocm93KTtcbiAgfSxcbiAgaXRlcmFibGU6IGZ1bmN0aW9uIGl0ZXJhYmxlKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoU3ltYm9sKSA/IGlzLmZ1bmMoaXRbU3ltYm9sLml0ZXJhdG9yXSkgOiBpcy5hcnJheShpdCk7XG4gIH0sXG4gIHRhc2s6IGZ1bmN0aW9uIHRhc2sodCkge1xuICAgIHJldHVybiB0ICYmIHRbVEFTS107XG4gIH0sXG4gIG9ic2VydmFibGU6IGZ1bmN0aW9uIG9ic2VydmFibGUob2IpIHtcbiAgICByZXR1cm4gb2IgJiYgaXMuZnVuYyhvYi5zdWJzY3JpYmUpO1xuICB9LFxuICBidWZmZXI6IGZ1bmN0aW9uIGJ1ZmZlcihidWYpIHtcbiAgICByZXR1cm4gYnVmICYmIGlzLmZ1bmMoYnVmLmlzRW1wdHkpICYmIGlzLmZ1bmMoYnVmLnRha2UpICYmIGlzLmZ1bmMoYnVmLnB1dCk7XG4gIH0sXG4gIHBhdHRlcm46IGZ1bmN0aW9uIHBhdHRlcm4ocGF0KSB7XG4gICAgcmV0dXJuIHBhdCAmJiAoaXMuc3RyaW5nKHBhdCkgfHwgKHR5cGVvZiBwYXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhdCkpID09PSAnc3ltYm9sJyB8fCBpcy5mdW5jKHBhdCkgfHwgaXMuYXJyYXkocGF0KSk7XG4gIH0sXG4gIGNoYW5uZWw6IGZ1bmN0aW9uIGNoYW5uZWwoY2gpIHtcbiAgICByZXR1cm4gY2ggJiYgaXMuZnVuYyhjaC50YWtlKSAmJiBpcy5mdW5jKGNoLmNsb3NlKTtcbiAgfSxcbiAgaGVscGVyOiBmdW5jdGlvbiBoZWxwZXIoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXRbSEVMUEVSXTtcbiAgfSxcbiAgc3RyaW5nYWJsZUZ1bmM6IGZ1bmN0aW9uIHN0cmluZ2FibGVGdW5jKGYpIHtcbiAgICByZXR1cm4gaXMuZnVuYyhmKSAmJiBoYXNPd24oZiwgJ3RvU3RyaW5nJyk7XG4gIH1cbn07XG5cbnZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcbiAgYXNzaWduOiBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBpIGluIHNvdXJjZSkge1xuICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG4gICAgICAgIHRhcmdldFtpXSA9IHNvdXJjZVtpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICBpZiAoaW5kZXggPj0gMCkge1xuICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn1cblxudmFyIGFycmF5ID0gZXhwb3J0cy5hcnJheSA9IHtcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcbiAgICB2YXIgYXJyID0gQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuICAgICAgICBhcnJbaV0gPSBvYmpbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGRlZmVycmVkKCkge1xuICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBkZWYgPSBfZXh0ZW5kcyh7fSwgcHJvcHMpO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBkZWYucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgZGVmLnJlamVjdCA9IHJlamVjdDtcbiAgfSk7XG4gIGRlZi5wcm9taXNlID0gcHJvbWlzZTtcbiAgcmV0dXJuIGRlZjtcbn1cblxuZnVuY3Rpb24gYXJyYXlPZkRlZmZlcmVkKGxlbmd0aCkge1xuICB2YXIgYXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChkZWZlcnJlZCgpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBkZWxheShtcykge1xuICB2YXIgdmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXG4gIHZhciB0aW1lb3V0SWQgPSB2b2lkIDA7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHZhbCk7XG4gICAgfSwgbXMpO1xuICB9KTtcblxuICBwcm9taXNlW0NBTkNFTF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICB9O1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcbiAgdmFyIF9yZWY7XG5cbiAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuICB2YXIgX3Jlc3VsdCA9IHZvaWQgMCxcbiAgICAgIF9lcnJvciA9IHZvaWQgMDtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW1RBU0tdID0gdHJ1ZSwgX3JlZi5pc1J1bm5pbmcgPSBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG4gICAgcmV0dXJuIHJ1bm5pbmc7XG4gIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuICAgIHJldHVybiBfcmVzdWx0O1xuICB9LCBfcmVmLmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgcmV0dXJuIF9lcnJvcjtcbiAgfSwgX3JlZi5zZXRSdW5uaW5nID0gZnVuY3Rpb24gc2V0UnVubmluZyhiKSB7XG4gICAgcmV0dXJuIHJ1bm5pbmcgPSBiO1xuICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG4gICAgcmV0dXJuIF9yZXN1bHQgPSByO1xuICB9LCBfcmVmLnNldEVycm9yID0gZnVuY3Rpb24gc2V0RXJyb3IoZSkge1xuICAgIHJldHVybiBfZXJyb3IgPSBlO1xuICB9LCBfcmVmO1xufVxuXG5mdW5jdGlvbiBhdXRvSW5jKCkge1xuICB2YXIgc2VlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiArK3NlZWQ7XG4gIH07XG59XG5cbnZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cbnZhciBrVGhyb3cgPSBmdW5jdGlvbiBrVGhyb3coZXJyKSB7XG4gIHRocm93IGVycjtcbn07XG52YXIga1JldHVybiA9IGZ1bmN0aW9uIGtSZXR1cm4odmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG59O1xuZnVuY3Rpb24gbWFrZUl0ZXJhdG9yKG5leHQpIHtcbiAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuICB2YXIgaXNIZWxwZXIgPSBhcmd1bWVudHNbM107XG5cbiAgdmFyIGl0ZXJhdG9yID0geyBuYW1lOiBuYW1lLCBuZXh0OiBuZXh0LCB0aHJvdzogdGhybywgcmV0dXJuOiBrUmV0dXJuIH07XG5cbiAgaWYgKGlzSGVscGVyKSB7XG4gICAgaXRlcmF0b3JbSEVMUEVSXSA9IHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvcjtcbiAgICB9O1xuICB9XG4gIHJldHVybiBpdGVyYXRvcjtcbn1cblxuLyoqXG4gIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICAod2l0aCBleHBhbmRhYmxlIGVycm9yIHN0YWNrIHRyYWNlcyksIG9yIGluIGEgbm9kZS5qcyBlbnZpcm9ubWVudFxuICAodGV4dC1vbmx5IGxvZyBvdXRwdXQpXG4gKiovXG5mdW5jdGlvbiBsb2cobGV2ZWwsIG1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblxuICAvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZVtsZXZlbF0obWVzc2FnZSwgZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSBsb2coJ3dhcm4nLCBkZXByZWNhdGlvbldhcm5pbmcpO1xuICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbnZhciB1cGRhdGVJbmNlbnRpdmUgPSBleHBvcnRzLnVwZGF0ZUluY2VudGl2ZSA9IGZ1bmN0aW9uIHVwZGF0ZUluY2VudGl2ZShkZXByZWNhdGVkLCBwcmVmZXJyZWQpIHtcbiAgcmV0dXJuIGRlcHJlY2F0ZWQgKyAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIHByZWZlcnJlZCArICcsIHBsZWFzZSB1cGRhdGUgeW91ciBjb2RlJztcbn07XG5cbnZhciBpbnRlcm5hbEVyciA9IGV4cG9ydHMuaW50ZXJuYWxFcnIgPSBmdW5jdGlvbiBpbnRlcm5hbEVycihlcnIpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcbn07XG5cbnZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG4gIHJldHVybiAoY3R4ID8gY3R4ICsgJy4nIDogJycpICsgJ3NldENvbnRleHQocHJvcHMpOiBhcmd1bWVudCAnICsgcHJvcHMgKyAnIGlzIG5vdCBhIHBsYWluIG9iamVjdCc7XG59O1xuXG52YXIgd3JhcFNhZ2FEaXNwYXRjaCA9IGV4cG9ydHMud3JhcFNhZ2FEaXNwYXRjaCA9IGZ1bmN0aW9uIHdyYXBTYWdhRGlzcGF0Y2goZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuICB9O1xufTtcblxudmFyIGNsb25lYWJsZUdlbmVyYXRvciA9IGV4cG9ydHMuY2xvbmVhYmxlR2VuZXJhdG9yID0gZnVuY3Rpb24gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgaGlzdG9yeSA9IFtdO1xuICAgIHZhciBnZW4gPSBnZW5lcmF0b3JGdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uIG5leHQoYXJnKSB7XG4gICAgICAgIGhpc3RvcnkucHVzaChhcmcpO1xuICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcbiAgICAgIH0sXG4gICAgICBjbG9uZTogZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgaGlzdG9yeS5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICByZXR1cm4gY2xvbmVkR2VuLm5leHQoYXJnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbG9uZWRHZW47XG4gICAgICB9LFxuICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBnZW4ucmV0dXJuKHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuICAgICAgICByZXR1cm4gZ2VuLnRocm93KGV4Y2VwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vYnVmZmVycycpO1xuXG5mdW5jdGlvbiBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMob2JqLCBkZXNjcykgeyBmb3IgKHZhciBrZXkgaW4gZGVzY3MpIHsgdmFyIGRlc2MgPSBkZXNjc1trZXldOyBkZXNjLmNvbmZpZ3VyYWJsZSA9IGRlc2MuZW51bWVyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzYykgZGVzYy53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgZGVzYyk7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgTk9UX0lURVJBVE9SX0VSUk9SID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSAncHJvYyBmaXJzdCBhcmd1bWVudCAoU2FnYSBmdW5jdGlvbiByZXN1bHQpIG11c3QgYmUgYW4gaXRlcmF0b3InO1xuXG52YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuICB9XG59O1xudmFyIFRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5UQVNLX0NBTkNFTCA9IHtcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQEByZWR1eC1zYWdhL1RBU0tfQ0FOQ0VMJztcbiAgfVxufTtcblxudmFyIG1hdGNoZXJzID0ge1xuICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5rVHJ1ZTtcbiAgfSxcbiAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuICAgIHJldHVybiAodHlwZW9mIHBhdHRlcm4gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhdHRlcm4pKSA9PT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBpbnB1dC50eXBlID09PSBwYXR0ZXJuO1xuICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBpbnB1dC50eXBlID09PSBTdHJpbmcocGF0dGVybik7XG4gICAgfTtcbiAgfSxcbiAgYXJyYXk6IGZ1bmN0aW9uIGFycmF5KHBhdHRlcm5zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIocCkoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSxcbiAgcHJlZGljYXRlOiBmdW5jdGlvbiBwcmVkaWNhdGUoX3ByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBfcHJlZGljYXRlKGlucHV0KTtcbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIHJldHVybiAocGF0dGVybiA9PT0gJyonID8gbWF0Y2hlcnMud2lsZGNhcmQgOiBfdXRpbHMuaXMuYXJyYXkocGF0dGVybikgPyBtYXRjaGVycy5hcnJheSA6IF91dGlscy5pcy5zdHJpbmdhYmxlRnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLmRlZmF1bHQgOiBfdXRpbHMuaXMuZnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLnByZWRpY2F0ZSA6IG1hdGNoZXJzLmRlZmF1bHQpKHBhdHRlcm4pO1xufVxuXG4vKipcbiAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3NcbiAgSW4gdGhlIG5ldyBmb3JrIG1vZGVsLCBmb3JrZWQgdGFza3MgYXJlIGF0dGFjaGVkIGJ5IGRlZmF1bHQgdG8gdGhlaXIgcGFyZW50XG4gIFdlIG1vZGVsIHRoaXMgdXNpbmcgdGhlIGNvbmNlcHQgb2YgUGFyZW50IHRhc2sgJiYgbWFpbiBUYXNrXG4gIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcbiAgYWdncmVnYXRpb24gb2YgdGhlIG1haW4gdGFza3MgKyBhbGwgaXRzIGZvcmtlZCB0YXNrcy5cbiAgVGh1cyB0aGUgd2hvbGUgbW9kZWwgcmVwcmVzZW50cyBhbiBleGVjdXRpb24gdHJlZSB3aXRoIG11bHRpcGxlIGJyYW5jaGVzICh2cyB0aGVcbiAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cbiAgQSBwYXJlbnQgdGFza3MgaGFzIHRoZSBmb2xsb3dpbmcgc2VtYW50aWNzXG4gIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcbiAgLSBJZiBpdCdzIGNhbmNlbGxlZCwgYWxsIGZvcmtzIGFyZSBjYW5jZWxsZWQgYXMgd2VsbFxuICAtIEl0IGFib3J0cyBpZiBhbnkgdW5jYXVnaHQgZXJyb3IgYnViYmxlcyB1cCBmcm9tIGZvcmtzXG4gIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuKiovXG5mdW5jdGlvbiBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGNiKSB7XG4gIHZhciB0YXNrcyA9IFtdLFxuICAgICAgcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgY29tcGxldGVkID0gZmFsc2U7XG4gIGFkZFRhc2sobWFpblRhc2spO1xuXG4gIGZ1bmN0aW9uIGFib3J0KGVycikge1xuICAgIGNhbmNlbEFsbCgpO1xuICAgIGNiKGVyciwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYXNrKHRhc2spIHtcbiAgICB0YXNrcy5wdXNoKHRhc2spO1xuICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG4gICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgKDAsIF91dGlscy5yZW1vdmUpKHRhc2tzLCB0YXNrKTtcbiAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgIGFib3J0KHJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFzayA9PT0gbWFpblRhc2spIHtcbiAgICAgICAgICByZXN1bHQgPSByZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIHRhc2suY29udC5jYW5jZWwgPSB0YXNrLmNhbmNlbFxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsQWxsKCkge1xuICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICB0LmNvbnQgPSBfdXRpbHMubm9vcDtcbiAgICAgIHQuY2FuY2VsKCk7XG4gICAgfSk7XG4gICAgdGFza3MgPSBbXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWRkVGFzazogYWRkVGFzayxcbiAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcbiAgICBhYm9ydDogYWJvcnQsXG4gICAgZ2V0VGFza3M6IGZ1bmN0aW9uIGdldFRhc2tzKCkge1xuICAgICAgcmV0dXJuIHRhc2tzO1xuICAgIH0sXG4gICAgdGFza05hbWVzOiBmdW5jdGlvbiB0YXNrTmFtZXMoKSB7XG4gICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0Lm5hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhc2tJdGVyYXRvcihfcmVmKSB7XG4gIHZhciBjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgZm4gPSBfcmVmLmZuLFxuICAgICAgYXJncyA9IF9yZWYuYXJncztcblxuICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MiBhbmQgIzQ0MVxuICB2YXIgcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgZXJyb3IgPSB2b2lkIDA7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVycm9yID0gZXJyO1xuICB9XG5cbiAgLy8gaS5lLiBhIGdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5zIGFuIGl0ZXJhdG9yXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuICAvLyBpbnN0ZWFkIGNyZWF0ZSBhIGZhaWxlZCB0YXNrLiBTZWUgIzE1MiBhbmQgIzQ0MVxuICByZXR1cm4gZXJyb3IgPyAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuICAgIHRocm93IGVycm9yO1xuICB9KSA6ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBjID0gdm9pZCAwO1xuICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG4gICAgdmFyIHJldCA9IGZ1bmN0aW9uIHJldCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH07XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgICAgaWYgKCFwYykge1xuICAgICAgICBwYyA9IHRydWU7XG4gICAgICAgIHJldHVybiBlZmY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSgpKTtcbn1cblxudmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuICByZXR1cm4geyBmbjogaGVscGVyIH07XG59O1xuXG5mdW5jdGlvbiBwcm9jKGl0ZXJhdG9yKSB7XG4gIHZhciBzdWJzY3JpYmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG4gIH07XG4gIHZhciBkaXNwYXRjaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogX3V0aWxzLm5vb3A7XG4gIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG4gIHZhciBwYXJlbnRDb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiB7fTtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IHt9O1xuICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDcgJiYgYXJndW1lbnRzWzddICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbN10gOiAnYW5vbnltb3VzJztcbiAgdmFyIGNvbnQgPSBhcmd1bWVudHNbOF07XG5cbiAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9UX0lURVJBVE9SX0VSUk9SKTtcblxuICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuICB2YXIgcnVuUGFyYWxsZWxFZmZlY3QgPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkocnVuQWxsRWZmZWN0LCAoMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoZWZmZWN0c1N0cmluZywgJ2FsbCgnICsgZWZmZWN0c1N0cmluZyArICcpJykpO1xuXG4gIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cbiAgdmFyIGxvZyA9IGxvZ2dlciB8fCBfdXRpbHMubG9nO1xuICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbiBsb2dFcnJvcihlcnIpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cbiAgICBpZiAoIW1lc3NhZ2UgJiYgZXJyLnN0YWNrKSB7XG4gICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuICAgIH1cblxuICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcbiAgfTtcbiAgdmFyIHN0ZENoYW5uZWwgPSAoMCwgX2NoYW5uZWwuc3RkQ2hhbm5lbCkoc3Vic2NyaWJlKTtcbiAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcbiAgLyoqXG4gICAgVHJhY2tzIHRoZSBjdXJyZW50IGVmZmVjdCBjYW5jZWxsYXRpb25cbiAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuICAgIG9uIGl0LiBJdCBhbGxvd3MgcHJvcGFnYXRpbmcgY2FuY2VsbGF0aW9uIHRvIGNoaWxkIGVmZmVjdHNcbiAgKiovXG4gIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cbiAgLyoqXG4gICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuICAgIHRvIHRyYWNrIHRoZSBtYWluIGZsb3cgKGJlc2lkZXMgb3RoZXIgZm9ya2VkIHRhc2tzKVxuICAqKi9cbiAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG4gIHZhciBtYWluVGFzayA9IHsgbmFtZTogbmFtZSwgY2FuY2VsOiBjYW5jZWxNYWluLCBpc1J1bm5pbmc6IHRydWUgfTtcbiAgdmFyIHRhc2tRdWV1ZSA9IGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgZW5kKTtcblxuICAvKipcbiAgICBjYW5jZWxsYXRpb24gb2YgdGhlIG1haW4gdGFzay4gV2UnbGwgc2ltcGx5IHJlc3VtZSB0aGUgR2VuZXJhdG9yIHdpdGggYSBDYW5jZWxcbiAgKiovXG4gIGZ1bmN0aW9uIGNhbmNlbE1haW4oKSB7XG4gICAgaWYgKG1haW5UYXNrLmlzUnVubmluZyAmJiAhbWFpblRhc2suaXNDYW5jZWxsZWQpIHtcbiAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIG5leHQoVEFTS19DQU5DRUwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG4gICAgY2FuY2VsIGFsbCBwZW5kaW5nIHRhc2tzIChpbmNsdWRpbmcgdGhlIG1haW4gdGFzayksIHRoZW4gZW5kIHRoZSBjdXJyZW50IHRhc2suXG4gICAgIENhbmNlbGxhdGlvbiBwcm9wYWdhdGVzIGRvd24gdG8gdGhlIHdob2xlIGV4ZWN1dGlvbiB0cmVlIGhvbGRlZCBieSB0aGlzIFBhcmVudCB0YXNrXG4gICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG4gICAgIENhbmNlbGxhdGlvbiBpcyBub29wIGZvciB0ZXJtaW5hdGVkL0NhbmNlbGxlZCB0YXNrcyB0YXNrc1xuICAqKi9cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIC8qKlxuICAgICAgV2UgbmVlZCB0byBjaGVjayBib3RoIFJ1bm5pbmcgYW5kIENhbmNlbGxlZCBzdGF0dXNcbiAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcbiAgICAqKi9cbiAgICBpZiAoaXRlcmF0b3IuX2lzUnVubmluZyAmJiAhaXRlcmF0b3IuX2lzQ2FuY2VsbGVkKSB7XG4gICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgdGFza1F1ZXVlLmNhbmNlbEFsbCgpO1xuICAgICAgLyoqXG4gICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcbiAgICAgICoqL1xuICAgICAgZW5kKFRBU0tfQ0FOQ0VMKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuICAgIHRoaXMgd2lsbCBwZXJtaXQgY2FuY2VsbGF0aW9uIHRvIHByb3BhZ2F0ZSBkb3duIHRoZSBjYWxsIGNoYWluXG4gICoqL1xuICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cbiAgLy8gdHJhY2tzIHRoZSBydW5uaW5nIHN0YXR1c1xuICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblxuICAvLyBraWNrcyB1cCB0aGUgZ2VuZXJhdG9yXG4gIG5leHQoKTtcblxuICAvLyB0aGVuIHJldHVybiB0aGUgdGFzayBkZXNjcmlwdG9yIHRvIHRoZSBjYWxsZXJcbiAgcmV0dXJuIHRhc2s7XG5cbiAgLyoqXG4gICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuICAgIEl0J3MgYSByZWN1cnNpdmUgYXN5bmMvY29udGludWF0aW9uIGZ1bmN0aW9uIHdoaWNoIGNhbGxzIGl0c2VsZlxuICAgIHVudGlsIHRoZSBnZW5lcmF0b3IgdGVybWluYXRlcyBvciB0aHJvd3NcbiAgKiovXG4gIGZ1bmN0aW9uIG5leHQoYXJnLCBpc0Vycikge1xuICAgIC8vIFByZXZlbnRpdmUgbWVhc3VyZS4gSWYgd2UgZW5kIHVwIGhlcmUsIHRoZW4gdGhlcmUgaXMgcmVhbGx5IHNvbWV0aGluZyB3cm9uZ1xuICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byByZXN1bWUgYW4gYWxyZWFkeSBmaW5pc2hlZCBnZW5lcmF0b3InKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIGlmIChpc0Vycikge1xuICAgICAgICByZXN1bHQgPSBpdGVyYXRvci50aHJvdyhhcmcpO1xuICAgICAgfSBlbHNlIGlmIChhcmcgPT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgIGdldHRpbmcgVEFTS19DQU5DRUwgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSBtYWluIHRhc2tcbiAgICAgICAgICBXZSBjYW4gZ2V0IHRoaXMgdmFsdWUgaGVyZVxuICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG4gICAgICAgICAgLSBCeSBqb2luaW5nIGEgQ2FuY2VsbGVkIHRhc2tcbiAgICAgICAgKiovXG4gICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAgQ2FuY2VscyB0aGUgY3VycmVudCBlZmZlY3Q7IHRoaXMgd2lsbCBwcm9wYWdhdGUgdGhlIGNhbmNlbGxhdGlvbiBkb3duIHRvIGFueSBjYWxsZWQgdGFza3NcbiAgICAgICAgKiovXG4gICAgICAgIG5leHQuY2FuY2VsKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcbiAgICAgICAgICBUaGlzIHdpbGwganVtcCB0byB0aGUgZmluYWxseSBibG9ja1xuICAgICAgICAqKi9cbiAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuICAgICAgfSBlbHNlIGlmIChhcmcgPT09IENIQU5ORUxfRU5EKSB7XG4gICAgICAgIC8vIFdlIGdldCBDSEFOTkVMX0VORCBieSB0YWtpbmcgZnJvbSBhIGNoYW5uZWwgdGhhdCBlbmRlZCB1c2luZyBgdGFrZWAgKGFuZCBub3QgYHRha2VtYCB1c2VkIHRvIHRyYXAgRW5kIG9mIGNoYW5uZWxzKVxuICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoYXJnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXN1bHQuZG9uZSkge1xuICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG4gICAgICAgICoqL1xuICAgICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcbiAgICAgICAgbG9nRXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuICAgICAgbWFpblRhc2suY29udChlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5kKHJlc3VsdCwgaXNFcnIpIHtcbiAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgc3RkQ2hhbm5lbC5jbG9zZSgpO1xuICAgIGlmICghaXNFcnIpIHtcbiAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlc29sdmUocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsICdzYWdhU3RhY2snLCB7XG4gICAgICAgICAgdmFsdWU6ICdhdCAnICsgbmFtZSArICcgXFxuICcgKyAocmVzdWx0LnNhZ2FTdGFjayB8fCByZXN1bHQuc3RhY2spLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghdGFzay5jb250KSB7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvciAmJiBvbkVycm9yKSB7XG4gICAgICAgICAgb25FcnJvcihyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ0Vycm9yKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLl9lcnJvciA9IHJlc3VsdDtcbiAgICAgIGl0ZXJhdG9yLl9pc0Fib3J0ZWQgPSB0cnVlO1xuICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcbiAgICB9XG4gICAgdGFzay5jb250ICYmIHRhc2suY29udChyZXN1bHQsIGlzRXJyKTtcbiAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuICAgICAgcmV0dXJuIGouY2IocmVzdWx0LCBpc0Vycik7XG4gICAgfSk7XG4gICAgdGFzay5qb2luZXJzID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG4gICAgdmFyIGxhYmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgICB2YXIgY2IgPSBhcmd1bWVudHNbM107XG5cbiAgICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcbiAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQoeyBlZmZlY3RJZDogZWZmZWN0SWQsIHBhcmVudEVmZmVjdElkOiBwYXJlbnRFZmZlY3RJZCwgbGFiZWw6IGxhYmVsLCBlZmZlY3Q6IGVmZmVjdCB9KTtcblxuICAgIC8qKlxuICAgICAgY29tcGxldGlvbiBjYWxsYmFjayBhbmQgY2FuY2VsIGNhbGxiYWNrIGFyZSBtdXR1YWxseSBleGNsdXNpdmVcbiAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3RcbiAgICAgIEFuZCBXZSBjYW4ndCBjb21wbGV0ZSBhbiBhbHJlYWR5IGNhbmNlbGxlZCBlZmZlY3RJZFxuICAgICoqL1xuICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXG4gICAgLy8gQ29tcGxldGlvbiBjYWxsYmFjayBwYXNzZWQgdG8gdGhlIGFwcHJvcHJpYXRlIGVmZmVjdCBydW5uZXJcbiAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcbiAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuICAgICAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgICAgIGlzRXJyID8gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQoZWZmZWN0SWQsIHJlcykgOiBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgcmVzKTtcbiAgICAgIH1cbiAgICAgIGNiKHJlcywgaXNFcnIpO1xuICAgIH1cbiAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcbiAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cbiAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHByZXZlbnRzIGNhbmNlbGxpbmcgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG4gICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuICAgICAgLyoqXG4gICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG4gICAgICAgIGNhdGNoIHVuY2F1Z2h0IGNhbmNlbGxhdGlvbnMgZXJyb3JzOyBzaW5jZSB3ZSBjYW4gbm8gbG9uZ2VyIGNhbGwgdGhlIGNvbXBsZXRpb25cbiAgICAgICAgY2FsbGJhY2ssIGxvZyBlcnJvcnMgcmFpc2VkIGR1cmluZyBjYW5jZWxsYXRpb25zIGludG8gdGhlIGNvbnNvbGVcbiAgICAgICoqL1xuICAgICAgdHJ5IHtcbiAgICAgICAgY3VyckNiLmNhbmNlbCgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGxvZ0Vycm9yKGVycik7XG4gICAgICB9XG4gICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cbiAgICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZChlZmZlY3RJZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuICAgICAgaXQgYWxsb3dzIHRoaXMgZ2VuZXJhdG9yIHRvIHByb3BhZ2F0ZSBjYW5jZWxsYXRpb24gZG93bndhcmQuXG4gICAgICAgQVRURU5USU9OISBlZmZlY3QgcnVubmVycyBtdXN0IHNldHVwIHRoZSBjYW5jZWwgbG9naWMgYnkgc2V0dGluZyBjYi5jYW5jZWwgPSBbY2FuY2VsTWV0aG9kXVxuICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuICAgICAgIFRoaXMgaXMgYSBzb3J0IG9mIGludmVyc2lvbiBvZiBjb250cm9sOiBjYWxsZWQgYXN5bmMgZnVuY3Rpb25zIGFyZSByZXNwb25zaWJsZVxuICAgICAgZm9yIGNvbXBsZXRpbmcgdGhlIGZsb3cgYnkgY2FsbGluZyB0aGUgcHJvdmlkZWQgY29udGludWF0aW9uOyB3aGlsZSBjYWxsZXIgZnVuY3Rpb25zXG4gICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG4gICAgICAgTGlicmFyeSB1c2VycyBjYW4gYXR0YWNoIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWMgdG8gcHJvbWlzZXMgYnkgZGVmaW5pbmcgYVxuICAgICAgcHJvbWlzZVtDQU5DRUxdIG1ldGhvZCBpbiB0aGVpciByZXR1cm5lZCBwcm9taXNlc1xuICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3RcbiAgICAqKi9cbiAgICB2YXIgZGF0YSA9IHZvaWQgMDtcbiAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICByZXR1cm4gKFxuICAgICAgLy8gTm9uIGRlY2xhcmF0aXZlIGVmZmVjdFxuICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblxuICAgICAgLy8gZGVjbGFyYXRpdmUgZWZmZWN0c1xuICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgY2IpIHtcbiAgICB2YXIgY2FuY2VsUHJvbWlzZSA9IHByb21pc2VbX3V0aWxzLkNBTkNFTF07XG4gICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG4gICAgICBjYi5jYW5jZWwgPSBjYW5jZWxQcm9taXNlO1xuICAgIH0gZWxzZSBpZiAoX3V0aWxzLmlzLmZ1bmMocHJvbWlzZS5hYm9ydCkpIHtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UuYWJvcnQoKTtcbiAgICAgIH07XG4gICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG4gICAgICAvLyBhZGRpbmcgY2FuY2VsIHN1cHBvcnRcbiAgICB9XG4gICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlSXRlcmF0b3IoaXRlcmF0b3IsIGVmZmVjdElkLCBuYW1lLCBjYikge1xuICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBfcmVmMi5jaGFubmVsLFxuICAgICAgICBwYXR0ZXJuID0gX3JlZjIucGF0dGVybixcbiAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblxuICAgIGNoYW5uZWwgPSBjaGFubmVsIHx8IHN0ZENoYW5uZWw7XG4gICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcbiAgICAgIHJldHVybiBpbnAgaW5zdGFuY2VvZiBFcnJvciA/IGNiKGlucCwgdHJ1ZSkgOiAoMCwgX2NoYW5uZWwuaXNFbmQpKGlucCkgJiYgIW1heWJlID8gY2IoQ0hBTk5FTF9FTkQpIDogY2IoaW5wKTtcbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLnRha2UodGFrZUNiLCBtYXRjaGVyKHBhdHRlcm4pKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuICAgIH1cbiAgICBjYi5jYW5jZWwgPSB0YWtlQ2IuY2FuY2VsO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuUHV0RWZmZWN0KF9yZWYzLCBjYikge1xuICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcbiAgICAgICAgYWN0aW9uID0gX3JlZjMuYWN0aW9uLFxuICAgICAgICByZXNvbHZlID0gX3JlZjMucmVzb2x2ZTtcblxuICAgIC8qKlxuICAgICAgU2NoZWR1bGUgdGhlIHB1dCBpbiBjYXNlIGFub3RoZXIgc2FnYSBpcyBob2xkaW5nIGEgbG9jay5cbiAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcbiAgICAgIHRoaXMgcHV0IGhhcyB0ZXJtaW5hdGVkLlxuICAgICoqL1xuICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgY2hhbm5lbCBvciBgcHV0LnJlc29sdmVgIHdhcyB1c2VkIHRoZW4gYnViYmxlIHVwIHRoZSBlcnJvci5cbiAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICAgICAgbG9nRXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZSAmJiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpKSB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gUHV0IGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbGxFZmZlY3QoX3JlZjQsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjQuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNC5mbixcbiAgICAgICAgYXJncyA9IF9yZWY0LmFyZ3M7XG5cbiAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkgPyByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpID8gcmVzb2x2ZUl0ZXJhdG9yKHJlc3VsdCwgZWZmZWN0SWQsIGZuLm5hbWUsIGNiKSA6IGNiKHJlc3VsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5DUFNFZmZlY3QoX3JlZjUsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNS5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY1LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjUuYXJncztcblxuICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuICAgIC8vIGJ5IHNldHRpbmcgY2FuY2VsIGZpZWxkIG9uIHRoZSBjYlxuXG4gICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG4gICAgdHJ5IHtcbiAgICAgIHZhciBjcHNDYiA9IGZ1bmN0aW9uIGNwc0NiKGVyciwgcmVzKSB7XG4gICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuICAgICAgfTtcbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KGNwc0NiKSk7XG4gICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG4gICAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3BzQ2IuY2FuY2VsKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcnVuRm9ya0VmZmVjdChfcmVmNiwgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNi5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY2LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjYuYXJncyxcbiAgICAgICAgZGV0YWNoZWQgPSBfcmVmNi5kZXRhY2hlZDtcblxuICAgIHZhciB0YXNrSXRlcmF0b3IgPSBjcmVhdGVUYXNrSXRlcmF0b3IoeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfSk7XG5cbiAgICB0cnkge1xuICAgICAgKDAsIF9zY2hlZHVsZXIuc3VzcGVuZCkoKTtcbiAgICAgIHZhciBfdGFzayA9IHByb2ModGFza0l0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBmbi5uYW1lLCBkZXRhY2hlZCA/IG51bGwgOiBfdXRpbHMubm9vcCk7XG5cbiAgICAgIGlmIChkZXRhY2hlZCkge1xuICAgICAgICBjYihfdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFza0l0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcbiAgICAgICAgICB0YXNrUXVldWUuYWRkVGFzayhfdGFzayk7XG4gICAgICAgICAgY2IoX3Rhc2spO1xuICAgICAgICB9IGVsc2UgaWYgKHRhc2tJdGVyYXRvci5fZXJyb3IpIHtcbiAgICAgICAgICB0YXNrUXVldWUuYWJvcnQodGFza0l0ZXJhdG9yLl9lcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2IoX3Rhc2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICgwLCBfc2NoZWR1bGVyLmZsdXNoKSgpO1xuICAgIH1cbiAgICAvLyBGb3JrIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkpvaW5FZmZlY3QodCwgY2IpIHtcbiAgICBpZiAodC5pc1J1bm5pbmcoKSkge1xuICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG4gICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodC5qb2luZXJzLCBqb2luZXIpO1xuICAgICAgfTtcbiAgICAgIHQuam9pbmVycy5wdXNoKGpvaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FuY2VsRWZmZWN0KHRhc2tUb0NhbmNlbCwgY2IpIHtcbiAgICBpZiAodGFza1RvQ2FuY2VsID09PSBfdXRpbHMuU0VMRl9DQU5DRUxMQVRJT04pIHtcbiAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG4gICAgfVxuICAgIGlmICh0YXNrVG9DYW5jZWwuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcbiAgICB9XG4gICAgY2IoKTtcbiAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7XG5cbiAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10gOiB7fSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBsZXRlZENvdW50ID0gMDtcbiAgICB2YXIgY29tcGxldGVkID0gdm9pZCAwO1xuICAgIHZhciByZXN1bHRzID0ge307XG4gICAgdmFyIGNoaWxkQ2JzID0ge307XG5cbiAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcbiAgICAgIGlmIChjb21wbGV0ZWRDb3VudCA9PT0ga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG4gICAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjYihyZXMsIGlzRXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzW2tleV0gPSByZXM7XG4gICAgICAgICAgY29tcGxldGVkQ291bnQrKztcbiAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcbiAgICB9KTtcblxuICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29tcGxldGVkID0gdm9pZCAwO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7XG4gICAgdmFyIGNoaWxkQ2JzID0ge307XG5cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG4gICAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY2IocmVzLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAgIHZhciBfcmVzcG9uc2U7XG5cbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgIHZhciByZXNwb25zZSA9IChfcmVzcG9uc2UgPSB7fSwgX3Jlc3BvbnNlW2tleV0gPSByZXMsIF9yZXNwb25zZSk7XG4gICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG4gICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuICAgIH0pO1xuXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcHJldmVudHMgdW5uZWNlc3NhcnkgY2FuY2VsbGF0aW9uXG4gICAgICBpZiAoIWNvbXBsZXRlZCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuICAgIHZhciBzZWxlY3RvciA9IF9yZWY3LnNlbGVjdG9yLFxuICAgICAgICBhcmdzID0gX3JlZjcuYXJncztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgc3RhdGUgPSBzZWxlY3Rvci5hcHBseSh1bmRlZmluZWQsIFtnZXRTdGF0ZSgpXS5jb25jYXQoYXJncykpO1xuICAgICAgY2Ioc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcbiAgICB2YXIgcGF0dGVybiA9IF9yZWY4LnBhdHRlcm4sXG4gICAgICAgIGJ1ZmZlciA9IF9yZWY4LmJ1ZmZlcjtcblxuICAgIHZhciBtYXRjaCA9IG1hdGNoZXIocGF0dGVybik7XG4gICAgbWF0Y2gucGF0dGVybiA9IHBhdHRlcm47XG4gICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG4gICAgY2IoISFtYWluVGFzay5pc0NhbmNlbGxlZCk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5GbHVzaEVmZmVjdChjaGFubmVsLCBjYikge1xuICAgIGNoYW5uZWwuZmx1c2goY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuR2V0Q29udGV4dEVmZmVjdChwcm9wLCBjYikge1xuICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG4gICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcbiAgICBjYigpO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3VGFzayhpZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpIHtcbiAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblxuICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IG51bGw7XG4gICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3IuX2RlZmVycmVkRW5kLnByb21pc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVmID0gKDAsIF91dGlscy5kZWZlcnJlZCkoKTtcbiAgICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gZGVmO1xuICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcbiAgICAgICAgICBpdGVyYXRvci5fZXJyb3IgPyBkZWYucmVqZWN0KGl0ZXJhdG9yLl9lcnJvcikgOiBkZWYucmVzb2x2ZShpdGVyYXRvci5fcmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICB9XG4gICAgfSwgX3JlZjkuY29udCA9IGNvbnQsIF9yZWY5LmpvaW5lcnMgPSBbXSwgX3JlZjkuY2FuY2VsID0gY2FuY2VsLCBfcmVmOS5pc1J1bm5pbmcgPSBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcbiAgICB9LCBfcmVmOS5pc0NhbmNlbGxlZCA9IGZ1bmN0aW9uIGlzQ2FuY2VsbGVkKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZDtcbiAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQWJvcnRlZDtcbiAgICB9LCBfcmVmOS5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcbiAgICB9LCBfcmVmOS5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9lcnJvcjtcbiAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuICAgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCd0YXNrJywgcHJvcHMpKTtcbiAgICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG4gICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3Byb2MuanNcbi8vIG1vZHVsZSBpZCA9IDc0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYXNhcCA9IGFzYXA7XG5leHBvcnRzLnN1c3BlbmQgPSBzdXNwZW5kO1xuZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xudmFyIHF1ZXVlID0gW107XG4vKipcbiAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuICAtIEluY3JlbWVudGluZyBhZGRzIGEgbG9jayBhbmQgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHN1c3BlbmRlZGAgc3RhdGUgKGlmIGl0J3Mgbm90XG4gICAgYWxyZWFkeSBzdXNwZW5kZWQpXG4gIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG4gICAgdHJpZ2dlcnMgZmx1c2hpbmcgdGhlIHF1ZXVlZCB0YXNrcy5cbioqL1xudmFyIHNlbWFwaG9yZSA9IDA7XG5cbi8qKlxuICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG4gIGFuZCBmbHVzaGVkIGFmdGVyIHRoaXMgdGFzayBoYXMgZmluaXNoZWQgKGFzc3VtaW5nIHRoZSBzY2hlZHVsZXIgZW5kdXAgaW4gYSByZWxlYXNlZFxuICBzdGF0ZSkuXG4qKi9cbmZ1bmN0aW9uIGV4ZWModGFzaykge1xuICB0cnkge1xuICAgIHN1c3BlbmQoKTtcbiAgICB0YXNrKCk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVsZWFzZSgpO1xuICB9XG59XG5cbi8qKlxuICBFeGVjdXRlcyBvciBxdWV1ZXMgYSB0YXNrIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgdGhlIHNjaGVkdWxlciAoYHN1c3BlbmRlZGAgb3IgYHJlbGVhc2VkYClcbioqL1xuZnVuY3Rpb24gYXNhcCh0YXNrKSB7XG4gIHF1ZXVlLnB1c2godGFzayk7XG5cbiAgaWYgKCFzZW1hcGhvcmUpIHtcbiAgICBzdXNwZW5kKCk7XG4gICAgZmx1c2goKTtcbiAgfVxufVxuXG4vKipcbiAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHN1c3BlbmRlZGAgc3RhdGUuIFNjaGVkdWxlZCB0YXNrcyB3aWxsIGJlIHF1ZXVlZCB1bnRpbCB0aGVcbiAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuKiovXG5mdW5jdGlvbiBzdXNwZW5kKCkge1xuICBzZW1hcGhvcmUrKztcbn1cblxuLyoqXG4gIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuXG4qKi9cbmZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gIHNlbWFwaG9yZS0tO1xufVxuXG4vKipcbiAgUmVsZWFzZXMgdGhlIGN1cnJlbnQgbG9jay4gRXhlY3V0ZXMgYWxsIHF1ZXVlZCB0YXNrcyBpZiB0aGUgc2NoZWR1bGVyIGlzIGluIHRoZSByZWxlYXNlZCBzdGF0ZS5cbioqL1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIHJlbGVhc2UoKTtcblxuICB2YXIgdGFzayA9IHZvaWQgMDtcbiAgd2hpbGUgKCFzZW1hcGhvcmUgJiYgKHRhc2sgPSBxdWV1ZS5zaGlmdCgpKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZXhlYyh0YXNrKTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zY2hlZHVsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDc0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuZXhwb3J0cy50YWtlID0gdGFrZTtcbmV4cG9ydHMucHV0ID0gcHV0O1xuZXhwb3J0cy5hbGwgPSBhbGw7XG5leHBvcnRzLnJhY2UgPSByYWNlO1xuZXhwb3J0cy5jYWxsID0gY2FsbDtcbmV4cG9ydHMuYXBwbHkgPSBhcHBseTtcbmV4cG9ydHMuY3BzID0gY3BzO1xuZXhwb3J0cy5mb3JrID0gZm9yaztcbmV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcbmV4cG9ydHMuam9pbiA9IGpvaW47XG5leHBvcnRzLmNhbmNlbCA9IGNhbmNlbDtcbmV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuZXhwb3J0cy5hY3Rpb25DaGFubmVsID0gYWN0aW9uQ2hhbm5lbDtcbmV4cG9ydHMuY2FuY2VsbGVkID0gY2FuY2VsbGVkO1xuZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuZXhwb3J0cy5nZXRDb250ZXh0ID0gZ2V0Q29udGV4dDtcbmV4cG9ydHMuc2V0Q29udGV4dCA9IHNldENvbnRleHQ7XG5leHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcbmV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5leHBvcnRzLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vc2FnYUhlbHBlcnMnKTtcblxudmFyIElPID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuc3ltKSgnSU8nKTtcbnZhciBUQUtFID0gJ1RBS0UnO1xudmFyIFBVVCA9ICdQVVQnO1xudmFyIEFMTCA9ICdBTEwnO1xudmFyIFJBQ0UgPSAnUkFDRSc7XG52YXIgQ0FMTCA9ICdDQUxMJztcbnZhciBDUFMgPSAnQ1BTJztcbnZhciBGT1JLID0gJ0ZPUksnO1xudmFyIEpPSU4gPSAnSk9JTic7XG52YXIgQ0FOQ0VMID0gJ0NBTkNFTCc7XG52YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG52YXIgQUNUSU9OX0NIQU5ORUwgPSAnQUNUSU9OX0NIQU5ORUwnO1xudmFyIENBTkNFTExFRCA9ICdDQU5DRUxMRUQnO1xudmFyIEZMVVNIID0gJ0ZMVVNIJztcbnZhciBHRVRfQ09OVEVYVCA9ICdHRVRfQ09OVEVYVCc7XG52YXIgU0VUX0NPTlRFWFQgPSAnU0VUX0NPTlRFWFQnO1xuXG52YXIgVEVTVF9ISU5UID0gJ1xcbihISU5UOiBpZiB5b3UgYXJlIGdldHRpbmcgdGhpcyBlcnJvcnMgaW4gdGVzdHMsIGNvbnNpZGVyIHVzaW5nIGNyZWF0ZU1vY2tUYXNrIGZyb20gcmVkdXgtc2FnYS91dGlscyknO1xuXG52YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcbiAgdmFyIF9yZWY7XG5cbiAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcbn07XG5cbnZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoYXNFZmZlY3QuZm9yayhlZmYpLCBfdXRpbHMuaXMub2JqZWN0LCAnZGV0YWNoKGVmZik6IGFyZ3VtZW50IG11c3QgYmUgYSBmb3JrIGVmZmVjdCcpO1xuICBlZmZbRk9SS10uZGV0YWNoZWQgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxuZnVuY3Rpb24gdGFrZSgpIHtcbiAgdmFyIHBhdHRlcm5PckNoYW5uZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcqJztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGFyZ3VtZW50c1swXSwgX3V0aWxzLmlzLm5vdFVuZGVmLCAndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogcGF0dGVybk9yQ2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcbiAgfVxuICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gZWZmZWN0KFRBS0UsIHsgcGF0dGVybjogcGF0dGVybk9yQ2hhbm5lbCB9KTtcbiAgfVxuICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gZWZmZWN0KFRBS0UsIHsgY2hhbm5lbDogcGF0dGVybk9yQ2hhbm5lbCB9KTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xufVxuXG50YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWZmID0gdGFrZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIGVmZltUQUtFXS5tYXliZSA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG52YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXG5mdW5jdGlvbiBwdXQoY2hhbm5lbCwgYWN0aW9uKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBjaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgYSB2YWxpZCBjaGFubmVsJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gICAgYWN0aW9uID0gY2hhbm5lbDtcbiAgICBjaGFubmVsID0gbnVsbDtcbiAgfVxuICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcbn1cblxucHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZmYgPSBwdXQuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICBlZmZbUFVUXS5yZXNvbHZlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbnB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cbmZ1bmN0aW9uIGFsbChlZmZlY3RzKSB7XG4gIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcbn1cblxuZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG4gIHJldHVybiBlZmZlY3QoUkFDRSwgZWZmZWN0cyk7XG59XG5cbmZ1bmN0aW9uIGdldEZuQ2FsbERlc2MobWV0aCwgZm4sIGFyZ3MpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5ub3RVbmRlZiwgbWV0aCArICc6IGFyZ3VtZW50IGZuIGlzIHVuZGVmaW5lZCcpO1xuXG4gIHZhciBjb250ZXh0ID0gbnVsbDtcbiAgaWYgKF91dGlscy5pcy5hcnJheShmbikpIHtcbiAgICB2YXIgX2ZuID0gZm47XG4gICAgY29udGV4dCA9IF9mblswXTtcbiAgICBmbiA9IF9mblsxXTtcbiAgfSBlbHNlIGlmIChmbi5mbikge1xuICAgIHZhciBfZm4yID0gZm47XG4gICAgY29udGV4dCA9IF9mbjIuY29udGV4dDtcbiAgICBmbiA9IF9mbjIuZm47XG4gIH1cbiAgaWYgKGNvbnRleHQgJiYgX3V0aWxzLmlzLnN0cmluZyhmbikgJiYgX3V0aWxzLmlzLmZ1bmMoY29udGV4dFtmbl0pKSB7XG4gICAgZm4gPSBjb250ZXh0W2ZuXTtcbiAgfVxuICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLmZ1bmMsIG1ldGggKyAnOiBhcmd1bWVudCAnICsgZm4gKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cbiAgcmV0dXJuIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH07XG59XG5cbmZ1bmN0aW9uIGNhbGwoZm4pIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogW107XG5cbiAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gY3BzKGZuKSB7XG4gIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChDUFMsIGdldEZuQ2FsbERlc2MoJ2NwcycsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGZvcmsoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KEZPUkssIGdldEZuQ2FsbERlc2MoJ2ZvcmsnLCBmbiwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBzcGF3bihmbikge1xuICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgfVxuXG4gIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG59XG5cbmZ1bmN0aW9uIGpvaW4oKSB7XG4gIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgIHRhc2tzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gIH1cblxuICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gam9pbih0KTtcbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRhc2sgPSB0YXNrc1swXTtcbiAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnam9pbih0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcbiAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG4gIHJldHVybiBlZmZlY3QoSk9JTiwgdGFzayk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgZm9yICh2YXIgX2xlbjYgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW42KSwgX2tleTYgPSAwOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG4gICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcbiAgfVxuXG4gIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBjYW5jZWwodCk7XG4gICAgfSkpO1xuICB9XG4gIHZhciB0YXNrID0gdGFza3NbMF07XG4gIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdjYW5jZWwodGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdjYW5jZWwodGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KENBTkNFTCwgdGFzayB8fCBfdXRpbHMuU0VMRl9DQU5DRUxMQVRJT04pO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Qoc2VsZWN0b3IpIHtcbiAgZm9yICh2YXIgX2xlbjcgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjcgPiAxID8gX2xlbjcgLSAxIDogMCksIF9rZXk3ID0gMTsgX2tleTcgPCBfbGVuNzsgX2tleTcrKykge1xuICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHNlbGVjdG9yID0gX3V0aWxzLmlkZW50O1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLmZ1bmMsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCAnICsgc2VsZWN0b3IgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xufVxuXG4vKipcbiAgY2hhbm5lbChwYXR0ZXJuLCBbYnVmZmVyXSkgICAgPT4gY3JlYXRlcyBhbiBldmVudCBjaGFubmVsIGZvciBzdG9yZSBhY3Rpb25zXG4qKi9cbmZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKHBhdHRlcm4sIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwuLi4pOiBhcmd1bWVudCBwYXR0ZXJuIGlzIHVuZGVmaW5lZCcpO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgJyArIGJ1ZmZlciArICcgaXMgbm90IGEgdmFsaWQgYnVmZmVyJyk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuICByZXR1cm4gZWZmZWN0KENBTkNFTExFRCwge30pO1xufVxuXG5mdW5jdGlvbiBmbHVzaChjaGFubmVsKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAnZmx1c2goY2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCcpO1xuICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKHByb3AsIF91dGlscy5pcy5zdHJpbmcsICdnZXRDb250ZXh0KHByb3ApOiBhcmd1bWVudCAnICsgcHJvcCArICcgaXMgbm90IGEgc3RyaW5nJyk7XG4gIHJldHVybiBlZmZlY3QoR0VUX0NPTlRFWFQsIHByb3ApO1xufVxuXG5mdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuICByZXR1cm4gZWZmZWN0KFNFVF9DT05URVhULCBwcm9wcyk7XG59XG5cbmZ1bmN0aW9uIHRha2VFdmVyeShwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjggPiAyID8gX2xlbjggLSAyIDogMCksIF9rZXk4ID0gMjsgX2tleTggPCBfbGVuODsgX2tleTgrKykge1xuICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW45ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW45ID4gMiA/IF9sZW45IC0gMiA6IDApLCBfa2V5OSA9IDI7IF9rZXk5IDwgX2xlbjk7IF9rZXk5KyspIHtcbiAgICBhcmdzW19rZXk5IC0gMl0gPSBhcmd1bWVudHNbX2tleTldO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3RIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gdGhyb3R0bGUobXMsIHBhdHRlcm4sIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuICAgIGFyZ3NbX2tleTEwIC0gM10gPSBhcmd1bWVudHNbX2tleTEwXTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50aHJvdHRsZUhlbHBlciwgbXMsIHBhdHRlcm4sIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxudmFyIGNyZWF0ZUFzRWZmZWN0VHlwZSA9IGZ1bmN0aW9uIGNyZWF0ZUFzRWZmZWN0VHlwZSh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZWZmZWN0KSB7XG4gICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcbiAgfTtcbn07XG5cbnZhciBhc0VmZmVjdCA9IGV4cG9ydHMuYXNFZmZlY3QgPSB7XG4gIHRha2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoVEFLRSksXG4gIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuICBhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUxMKSxcbiAgcmFjZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShSQUNFKSxcbiAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcbiAgY3BzOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENQUyksXG4gIGZvcms6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRk9SSyksXG4gIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG4gIGNhbmNlbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQU5DRUwpLFxuICBzZWxlY3Q6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VMRUNUKSxcbiAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG4gIGNhbmNlbGxlZDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQU5DRUxMRUQpLFxuICBmbHVzaDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGTFVTSCksXG4gIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuICBzZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFVF9DT05URVhUKVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanNcbi8vIG1vZHVsZSBpZCA9IDc0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnRocm90dGxlSGVscGVyID0gZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSB1bmRlZmluZWQ7XG5cbnZhciBfdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGFrZUV2ZXJ5Jyk7XG5cbnZhciBfdGFrZUV2ZXJ5MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlRXZlcnkpO1xuXG52YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90YWtlTGF0ZXN0Jyk7XG5cbnZhciBfdGFrZUxhdGVzdDIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUxhdGVzdCk7XG5cbnZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90aHJvdHRsZScpO1xuXG52YXIgX3Rocm90dGxlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aHJvdHRsZSk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG4gIHJldHVybiAnaW1wb3J0IHsgJyArIGhlbHBlck5hbWUgKyAnIH0gZnJvbSBcXCdyZWR1eC1zYWdhXFwnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgaW1wb3J0IHsgJyArIGhlbHBlck5hbWUgKyAnIH0gZnJvbSBcXCdyZWR1eC1zYWdhL2VmZmVjdHNcXCcuXFxuVGhlIGxhdHRlciB3aWxsIG5vdCB3b3JrIHdpdGggeWllbGQqLCBhcyBoZWxwZXIgZWZmZWN0cyBhcmUgd3JhcHBlZCBhdXRvbWF0aWNhbGx5IGZvciB5b3UgaW4gZm9yayBlZmZlY3QuXFxuVGhlcmVmb3JlIHlpZWxkICcgKyBoZWxwZXJOYW1lICsgJyB3aWxsIHJldHVybiB0YXNrIGRlc2NyaXB0b3IgdG8geW91ciBzYWdhIGFuZCBleGVjdXRlIG5leHQgbGluZXMgb2YgY29kZS4nO1xufTtcblxudmFyIHRha2VFdmVyeSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VFdmVyeTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUV2ZXJ5JykpO1xudmFyIHRha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlTGF0ZXN0Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlTGF0ZXN0JykpO1xudmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXG5leHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcbmV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5leHBvcnRzLnRocm90dGxlID0gdGhyb3R0bGU7XG5leHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IF90YWtlRXZlcnkyLmRlZmF1bHQ7XG5leHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcbmV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBfdGhyb3R0bGUyLmRlZmF1bHQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NDRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gdGFrZUV2ZXJ5O1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRha2VFdmVyeShwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG5cbiAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcbiAgICAgIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuICAgIHJldHVybiBhY3Rpb24gPSBhYztcbiAgfTtcblxuICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG4gICAgfSxcbiAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG4gICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogWydxMScsIHlGb3JrKGFjdGlvbildO1xuICAgIH1cbiAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlRXZlcnkuanNcbi8vIG1vZHVsZSBpZCA9IDc0NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnFFbmQgPSB1bmRlZmluZWQ7XG5leHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5leHBvcnRzLmRlZmF1bHQgPSBmc21JdGVyYXRvcjtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG52YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xudmFyIHFFbmQgPSBleHBvcnRzLnFFbmQgPSB7fTtcblxuZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gJ2NoYW5uZWwnO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgcmV0dXJuIFN0cmluZyhlbnRyeSk7XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ2l0ZXJhdG9yJztcblxuICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG4gICAgICBxTmV4dCA9IHEwO1xuXG4gIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuICAgIGlmIChxTmV4dCA9PT0gcUVuZCkge1xuICAgICAgcmV0dXJuIGRvbmU7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBxTmV4dCA9IHFFbmQ7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblxuICAgICAgdmFyIF9mc20kcU5leHQgPSBmc21bcU5leHRdKCksXG4gICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG4gICAgICAgICAgb3V0cHV0ID0gX2ZzbSRxTmV4dFsxXSxcbiAgICAgICAgICBfdXBkYXRlU3RhdGUgPSBfZnNtJHFOZXh0WzJdO1xuXG4gICAgICBxTmV4dCA9IHE7XG4gICAgICB1cGRhdGVTdGF0ZSA9IF91cGRhdGVTdGF0ZTtcbiAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShuZXh0LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gbmV4dChudWxsLCBlcnJvcik7XG4gIH0sIG5hbWUsIHRydWUpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9mc21JdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gNzQ2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5JTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuaXNFbmQgPSBleHBvcnRzLkVORCA9IHVuZGVmaW5lZDtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcbmV4cG9ydHMuY2hhbm5lbCA9IGNoYW5uZWw7XG5leHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV2ZW50Q2hhbm5lbDtcbmV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9idWZmZXJzJyk7XG5cbnZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG5cbnZhciBDSEFOTkVMX0VORF9UWVBFID0gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG52YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcbnZhciBpc0VuZCA9IGV4cG9ydHMuaXNFbmQgPSBmdW5jdGlvbiBpc0VuZChhKSB7XG4gIHJldHVybiBhICYmIGEudHlwZSA9PT0gQ0hBTk5FTF9FTkRfVFlQRTtcbn07XG5cbmZ1bmN0aW9uIGVtaXR0ZXIoKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXG4gIGZ1bmN0aW9uIHN1YnNjcmliZShzdWIpIHtcbiAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkoc3Vic2NyaWJlcnMsIHN1Yik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuICAgIHZhciBhcnIgPSBzdWJzY3JpYmVycy5zbGljZSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFycltpXShpdGVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGVtaXQ6IGVtaXRcbiAgfTtcbn1cblxudmFyIElOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5JTlZBTElEX0JVRkZFUiA9ICdpbnZhbGlkIGJ1ZmZlciBwYXNzZWQgdG8gY2hhbm5lbCBmYWN0b3J5IGZ1bmN0aW9uJztcbnZhciBVTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9ICdTYWdhIHdhcyBwcm92aWRlZCB3aXRoIGFuIHVuZGVmaW5lZCBhY3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IFVOREVGSU5FRF9JTlBVVF9FUlJPUiArPSAnXFxuSGludHM6XFxuICAgIC0gY2hlY2sgdGhhdCB5b3VyIEFjdGlvbiBDcmVhdG9yIHJldHVybnMgYSBub24tdW5kZWZpbmVkIHZhbHVlXFxuICAgIC0gaWYgdGhlIFNhZ2Egd2FzIHN0YXJ0ZWQgdXNpbmcgcnVuU2FnYSwgY2hlY2sgdGhhdCB5b3VyIHN1YnNjcmliZSBzb3VyY2UgcHJvdmlkZXMgdGhlIGFjdGlvbiB0byBpdHMgbGlzdGVuZXJzXFxuICAnO1xufVxuXG5mdW5jdGlvbiBjaGFubmVsKCkge1xuICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cbiAgdmFyIGNsb3NlZCA9IGZhbHNlO1xuICB2YXIgdGFrZXJzID0gW107XG5cbiAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCBJTlZBTElEX0JVRkZFUik7XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKSB7XG4gICAgaWYgKGNsb3NlZCAmJiB0YWtlcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG4gICAgfVxuICAgIGlmICh0YWtlcnMubGVuZ3RoICYmICFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHV0KGlucHV0KSB7XG4gICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuICAgIGlmIChjbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0YWtlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gYnVmZmVyLnB1dChpbnB1dCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2IgPSB0YWtlcnNbaV07XG4gICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcbiAgICAgICAgdGFrZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0YWtlKGNiKSB7XG4gICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG4gICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihFTkQpO1xuICAgIH0gZWxzZSBpZiAoIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKGJ1ZmZlci50YWtlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWtlcnMucHVzaChjYik7XG4gICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKGNiKSB7XG4gICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC5mbHVzaCcgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoRU5EKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcbiAgICBpZiAoIWNsb3NlZCkge1xuICAgICAgY2xvc2VkID0gdHJ1ZTtcbiAgICAgIGlmICh0YWtlcnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBhcnIgPSB0YWtlcnM7XG4gICAgICAgIHRha2VycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgYXJyW2ldKEVORCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRha2U6IHRha2UsXG4gICAgcHV0OiBwdXQsXG4gICAgZmx1c2g6IGZsdXNoLFxuICAgIGNsb3NlOiBjbG9zZSxcbiAgICBnZXQgX190YWtlcnNfXygpIHtcbiAgICAgIHJldHVybiB0YWtlcnM7XG4gICAgfSxcbiAgICBnZXQgX19jbG9zZWRfXygpIHtcbiAgICAgIHJldHVybiBjbG9zZWQ7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBldmVudENoYW5uZWwoc3Vic2NyaWJlKSB7XG4gIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9idWZmZXJzLmJ1ZmZlcnMubm9uZSgpO1xuICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblxuICAvKipcbiAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cbiAgICBzZWUgUFIgIzI3MyBmb3IgYSBiYWNrZ3JvdW5kIGRpc2N1c3Npb25cbiAgKiovXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCAnSW52YWxpZCBtYXRjaCBmdW5jdGlvbiBwYXNzZWQgdG8gZXZlbnRDaGFubmVsJyk7XG4gIH1cblxuICB2YXIgY2hhbiA9IGNoYW5uZWwoYnVmZmVyKTtcbiAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcbiAgICAgIGlmICh1bnN1YnNjcmliZSkge1xuICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgY2hhbi5jbG9zZSgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIHVuc3Vic2NyaWJlID0gc3Vic2NyaWJlKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpc0VuZChpbnB1dCkpIHtcbiAgICAgIGNsb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGFuLnB1dChpbnB1dCk7XG4gIH0pO1xuICBpZiAoY2hhbi5fX2Nsb3NlZF9fKSB7XG4gICAgdW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbiBldmVudENoYW5uZWw6IHN1YnNjcmliZSBzaG91bGQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5zdWJzY3JpYmUnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFrZTogY2hhbi50YWtlLFxuICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuICAgIGNsb3NlOiBjbG9zZVxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGRDaGFubmVsKHN1YnNjcmliZSkge1xuICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgaWYgKGlucHV0W191dGlscy5TQUdBX0FDVElPTl0pIHtcbiAgICAgICAgY2IoaW5wdXQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYihpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG4gICAgdGFrZTogZnVuY3Rpb24gdGFrZShjYiwgbWF0Y2hlcikge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICBjYltfdXRpbHMuTUFUQ0hdID0gbWF0Y2hlcjtcbiAgICAgIH1cbiAgICAgIGNoYW4udGFrZShjYik7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZShcIi4vdXRpbHNcIik7XG5cbnZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblxudmFyIE9OX09WRVJGTE9XX1RIUk9XID0gMTtcbnZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcbnZhciBPTl9PVkVSRkxPV19TTElERSA9IDM7XG52YXIgT05fT1ZFUkZMT1dfRVhQQU5EID0gNDtcblxudmFyIHplcm9CdWZmZXIgPSB7IGlzRW1wdHk6IF91dGlscy5rVHJ1ZSwgcHV0OiBfdXRpbHMubm9vcCwgdGFrZTogX3V0aWxzLm5vb3AgfTtcblxuZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcbiAgdmFyIGxpbWl0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAxMDtcbiAgdmFyIG92ZXJmbG93QWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXG4gIHZhciBhcnIgPSBuZXcgQXJyYXkobGltaXQpO1xuICB2YXIgbGVuZ3RoID0gMDtcbiAgdmFyIHB1c2hJbmRleCA9IDA7XG4gIHZhciBwb3BJbmRleCA9IDA7XG5cbiAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG4gICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcbiAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcbiAgICBsZW5ndGgrKztcbiAgfTtcblxuICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG4gICAgaWYgKGxlbmd0aCAhPSAwKSB7XG4gICAgICB2YXIgaXQgPSBhcnJbcG9wSW5kZXhdO1xuICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG4gICAgICBsZW5ndGgtLTtcbiAgICAgIHBvcEluZGV4ID0gKHBvcEluZGV4ICsgMSkgJSBsaW1pdDtcbiAgICAgIHJldHVybiBpdDtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgd2hpbGUgKGxlbmd0aCkge1xuICAgICAgaXRlbXMucHVzaCh0YWtlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbXM7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpc0VtcHR5OiBmdW5jdGlvbiBpc0VtcHR5KCkge1xuICAgICAgcmV0dXJuIGxlbmd0aCA9PSAwO1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbiBwdXQoaXQpIHtcbiAgICAgIGlmIChsZW5ndGggPCBsaW1pdCkge1xuICAgICAgICBwdXNoKGl0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkb3VibGVkTGltaXQgPSB2b2lkIDA7XG4gICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1RIUk9XOlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEJVRkZFUl9PVkVSRkxPVyk7XG4gICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcbiAgICAgICAgICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG4gICAgICAgICAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcbiAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19FWFBBTkQ6XG4gICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cbiAgICAgICAgICAgIGFyciA9IGZsdXNoKCk7XG5cbiAgICAgICAgICAgIGxlbmd0aCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICBwdXNoSW5kZXggPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBhcnIubGVuZ3RoID0gZG91YmxlZExpbWl0O1xuICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cbiAgICAgICAgICAgIHB1c2goaXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBEUk9QXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHRha2U6IHRha2UsXG4gICAgZmx1c2g6IGZsdXNoXG4gIH07XG59XG5cbnZhciBidWZmZXJzID0gZXhwb3J0cy5idWZmZXJzID0ge1xuICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuICAgIHJldHVybiB6ZXJvQnVmZmVyO1xuICB9LFxuICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfVEhST1cpO1xuICB9LFxuICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfRFJPUCk7XG4gIH0sXG4gIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfU0xJREUpO1xuICB9LFxuICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGluaXRpYWxTaXplLCBPTl9PVkVSRkxPV19FWFBBTkQpO1xuICB9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9idWZmZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gdGFrZUxhdGVzdDtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcbiAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uY2FuY2VsKSh0YXNrKSB9O1xuICB9O1xuXG4gIHZhciB0YXNrID0gdm9pZCAwLFxuICAgICAgYWN0aW9uID0gdm9pZCAwO1xuICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuICAgIHJldHVybiB0YXNrID0gdDtcbiAgfTtcbiAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuICAgIHJldHVybiBhY3Rpb24gPSBhYztcbiAgfTtcblxuICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG4gICAgfSxcbiAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG4gICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcbiAgICB9LFxuICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcbiAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG4gICAgfVxuICB9LCAncTEnLCAndGFrZUxhdGVzdCgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NDlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gdGhyb3R0bGU7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2J1ZmZlcnMnKTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB0aHJvdHRsZShkZWxheUxlbmd0aCwgcGF0dGVybiwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDNdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcbiAgICAgIGNoYW5uZWwgPSB2b2lkIDA7XG5cbiAgdmFyIHlBY3Rpb25DaGFubmVsID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uYWN0aW9uQ2hhbm5lbCkocGF0dGVybiwgX2J1ZmZlcnMuYnVmZmVycy5zbGlkaW5nKDEpKSB9O1xuICB2YXIgeVRha2UgPSBmdW5jdGlvbiB5VGFrZSgpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcbiAgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuICB2YXIgeURlbGF5ID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uY2FsbCkoX3V0aWxzLmRlbGF5LCBkZWxheUxlbmd0aCkgfTtcblxuICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuICB2YXIgc2V0Q2hhbm5lbCA9IGZ1bmN0aW9uIHNldENoYW5uZWwoY2gpIHtcbiAgICByZXR1cm4gY2hhbm5lbCA9IGNoO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5QWN0aW9uQ2hhbm5lbCwgc2V0Q2hhbm5lbF07XG4gICAgfSxcbiAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG4gICAgICByZXR1cm4gWydxMycsIHlUYWtlKCksIHNldEFjdGlvbl07XG4gICAgfSxcbiAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG4gICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogWydxNCcsIHlGb3JrKGFjdGlvbildO1xuICAgIH0sXG4gICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5RGVsYXldO1xuICAgIH1cbiAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rocm90dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gc2FnYU1pZGRsZXdhcmVGYWN0b3J5O1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9ydW5TYWdhJyk7XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gc2FnYU1pZGRsZXdhcmVGYWN0b3J5KCkge1xuICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIF9yZWYkY29udGV4dCA9IF9yZWYuY29udGV4dCxcbiAgICAgIGNvbnRleHQgPSBfcmVmJGNvbnRleHQgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZiRjb250ZXh0LFxuICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cbiAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblxuXG4gIGlmIChfdXRpbHMuaXMuZnVuYyhvcHRpb25zKSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBwYXNzZWQgYSBmdW5jdGlvbiB0byB0aGUgU2FnYSBtaWRkbGV3YXJlLiBZb3UgYXJlIGxpa2VseSB0cnlpbmcgdG8gc3RhcnQgYSAgICAgICAgU2FnYSBieSBkaXJlY3RseSBwYXNzaW5nIGl0IHRvIHRoZSBtaWRkbGV3YXJlLiBUaGlzIGlzIG5vIGxvbmdlciBwb3NzaWJsZSBzdGFydGluZyBmcm9tIDAuMTAuMC4gICAgICAgIFRvIHJ1biBhIFNhZ2EsIHlvdSBtdXN0IGRvIGl0IGR5bmFtaWNhbGx5IEFGVEVSIG1vdW50aW5nIHRoZSBtaWRkbGV3YXJlIGludG8gdGhlIHN0b3JlLlxcbiAgICAgICAgRXhhbXBsZTpcXG4gICAgICAgICAgaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXFwncmVkdXgtc2FnYVxcJ1xcbiAgICAgICAgICAuLi4gb3RoZXIgaW1wb3J0c1xcblxcbiAgICAgICAgICBjb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKClcXG4gICAgICAgICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKVxcbiAgICAgICAgICBzYWdhTWlkZGxld2FyZS5ydW4oc2FnYSwgLi4uYXJncylcXG4gICAgICAnKTtcbiAgICB9XG4gIH1cblxuICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5sb2dnZXJgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIG9wdGlvbnMub25lcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25lcnJvcmAgd2FzIHJlbW92ZWQuIFVzZSBgb3B0aW9ucy5vbkVycm9yYCBpbnN0ZWFkLicpO1xuICB9XG5cbiAgaWYgKG9uRXJyb3IgJiYgIV91dGlscy5pcy5mdW5jKG9uRXJyb3IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmVtaXR0ZXJgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2FnYU1pZGRsZXdhcmUoX3JlZjIpIHtcbiAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmMi5nZXRTdGF0ZSxcbiAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblxuICAgIHZhciBzYWdhRW1pdHRlciA9ICgwLCBfY2hhbm5lbC5lbWl0dGVyKSgpO1xuICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cbiAgICBzYWdhTWlkZGxld2FyZS5ydW4gPSBfcnVuU2FnYS5ydW5TYWdhLmJpbmQobnVsbCwge1xuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIHN1YnNjcmliZTogc2FnYUVtaXR0ZXIuc3Vic2NyaWJlLFxuICAgICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuICAgICAgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyOiBsb2dnZXIsXG4gICAgICBvbkVycm9yOiBvbkVycm9yXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmIChzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKSB7XG4gICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXh0KGFjdGlvbik7IC8vIGhpdCByZWR1Y2Vyc1xuICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCZWZvcmUgcnVubmluZyBhIFNhZ2EsIHlvdSBtdXN0IG1vdW50IHRoZSBTYWdhIG1pZGRsZXdhcmUgb24gdGhlIFN0b3JlIHVzaW5nIGFwcGx5TWlkZGxld2FyZScpO1xuICB9O1xuXG4gIHNhZ2FNaWRkbGV3YXJlLnNldENvbnRleHQgPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3NhZ2FNaWRkbGV3YXJlJywgcHJvcHMpKTtcbiAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG4gIH07XG5cbiAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlbScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlbTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3B1dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5wdXQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhbGwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYWxsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncmFjZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5yYWNlO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FsbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYWxsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXBwbHknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYXBwbHk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcHMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY3BzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZm9yaycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5mb3JrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc3Bhd24nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc3Bhd247XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdqb2luJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmpvaW47XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FuY2VsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2VsZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNlbGVjdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FjdGlvbkNoYW5uZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYWN0aW9uQ2hhbm5lbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbGxlZCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYW5jZWxsZWQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmbHVzaCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5mbHVzaDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2dldENvbnRleHQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZ2V0Q29udGV4dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NldENvbnRleHQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc2V0Q29udGV4dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlRXZlcnk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VMYXRlc3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50aHJvdHRsZTtcbiAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2VmZmVjdHMuanNcbi8vIG1vZHVsZSBpZCA9IDc1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC91dGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1RBU0snLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuVEFTSztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NBR0FfQUNUSU9OJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLlNBR0FfQUNUSU9OO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnbm9vcCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5ub29wO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnaXMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuaXM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWZlcnJlZCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5kZWZlcnJlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FycmF5T2ZEZWZmZXJlZCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5hcnJheU9mRGVmZmVyZWQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcmVhdGVNb2NrVGFzaycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5jcmVhdGVNb2NrVGFzaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2Nsb25lYWJsZUdlbmVyYXRvcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5jbG9uZWFibGVHZW5lcmF0b3I7XG4gIH1cbn0pO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhc0VmZmVjdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hc0VmZmVjdDtcbiAgfVxufSk7XG5cbnZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3Byb2MnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdDSEFOTkVMX0VORCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9wcm9jLkNIQU5ORUxfRU5EO1xuICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4vY29uc3RcIjtcbmltcG9ydCBwdWxsIGZyb20gXCJsb2Rhc2gvcHVsbFwiO1xuaW1wb3J0IHsgaW5BcnJheSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIGluaXRpYWwgc3RhdGVcbmxldCBpbml0aWFsU3RhdGUgPSB7XG4gICAgc2VsZWN0QWxsOiB0cnVlLFxuICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICBlcnJvcjogbnVsbCxcbiAgICB1c2VySWQ6IG51bGwsXG4gICAgaXNfcmVzdHJpY3RlZDogZmFsc2UsXG4gICAgYWxsX3Byb2plY3RzOiBbXSxcbiAgICB1c2VyX3Byb2plY3RzOiBbXSxcbiAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgICBjb25zdCByZWR1Y2VyQWN0aW9ucyA9IHtcbiAgICAgICAgW2MuU0VUX1NUT1JFXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCAuLi5kYXRhIH07XG4gICAgICAgIH0sXG4gICAgICAgIFtjLkFQSV9HRVRfSU5JVF06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZmV0Y2hpbmc6IHRydWUsIGVycm9yOiBudWxsIH07XG4gICAgICAgIH0sXG4gICAgICAgIFtjLkFQSV9HRVRfU1VDQ0VTU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGFsbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cyB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMsXG4gICAgICAgICAgICAgICAgLy8gTk9URTogd2UncmUgXCJ1bndyYXBwaW5nXCIgdGhlIFVzZXJQcm9qZWN0cyBkYXRhXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogKHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5wcm9qZWN0cykgfHwgW10sXG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogKHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5pc19yZXN0cmljdGVkKSB8fCBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuQVBJX0dFVF9GQUlMVVJFXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogW10sXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogW10sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuQVBJX1BVVF9JTklUXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIFtjLkFQSV9QVVRfU1VDQ0VTU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHVzZXJfcHJvamVjdHMgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gTk9URTogd2UncmUgXCJ1bndyYXBwaW5nXCIgdGhlIGxpc3Qgb2YgcHJvamVjdHMgaGVyZSwgdG8gc2ltcGxpZnkgdGhlIHN0b3JlXG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogdXNlcl9wcm9qZWN0cy5pc19yZXN0cmljdGVkLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBbYy5BUElfUFVUX0ZBSUxVUkVdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbCxcbiAgICAgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGUuaXNfcmVzdHJpY3RlZCA9IHN0YXRlLm9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlLnVzZXJfcHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbF91c2VyX3Byb2plY3RzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgICB9LFxuICAgICAgICBbYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT05dOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBwcm9qZWN0SWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuICAgICAgICAgICAgY29uc3QgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuXG4gICAgICAgICAgICBpbkFycmF5KHByb2plY3RJZCwgdXNlcl9wcm9qZWN0cylcbiAgICAgICAgICAgICAgICA/IHB1bGwodXNlcl9wcm9qZWN0cywgcHJvamVjdElkKVxuICAgICAgICAgICAgICAgIDogdXNlcl9wcm9qZWN0cy5wdXNoKHByb2plY3RJZCk7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgb3JpZ2luYWxfdXNlcl9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cyB9O1xuICAgICAgICB9LFxuICAgICAgICBbYy5VUERBVEVfSVNfUkVTVFJJQ1RFRF06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGlzX3Jlc3RyaWN0ZWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGlzX3Jlc3RyaWN0ZWQsIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IHN0YXRlLmlzX3Jlc3RyaWN0ZWQgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFNdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuICAgICAgICAgICAgbGV0IHVzZXJfcHJvamVjdHMsXG4gICAgICAgICAgICAgICAgeyBzZWxlY3RBbGwgfSA9IHsgLi4uc3RhdGUgfTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RBbGwpIHtcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gc3RhdGUuYWxsX3Byb2plY3RzLm1hcChwcm9qZWN0ID0+IHByb2plY3QuaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxlY3RBbGwgPSAhc2VsZWN0QWxsO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVkdWNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoYWN0aW9uLnR5cGUpKSB7XG4gICAgICAgIHJldHVybiByZWR1Y2VyQWN0aW9uc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ2YXIgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIHB1bGxBbGwgPSByZXF1aXJlKCcuL3B1bGxBbGwnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcbiAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xudmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fb3ZlclJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hcHBseS5qc1xuLy8gbW9kdWxlIGlkID0gNzU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9jb25zdGFudC5qc1xuLy8gbW9kdWxlIGlkID0gNzYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3Nob3J0T3V0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VQdWxsQWxsID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBbGwnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG5mdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG4gICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvcHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzYzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpLFxuICAgIGJhc2VJbmRleE9mV2l0aCA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mV2l0aCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBzZWVuID0gYXJyYXk7XG5cbiAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcbiAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcbiAgfVxuICBpZiAoaXRlcmF0ZWUpIHtcbiAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGZyb21JbmRleCA9IDAsXG4gICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG4gICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcbiAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNOYU4uanNcbi8vIG1vZHVsZSBpZCA9IDc2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanNcbi8vIG1vZHVsZSBpZCA9IDc2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qc1xuLy8gbW9kdWxlIGlkID0gNzY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gVGhpcyBpbXBvcnQgaXMgbmVjZXNzYXJ5IHRvIGJlIGFibGUgdG8gdGVzdCBzYWdhcy5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkdXgtc2FnYS9yZWR1eC1zYWdhL2lzc3Vlcy8yODAjaXNzdWVjb21tZW50LTI5MTEzMzAyM1xuaW1wb3J0IFwicmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lXCI7XG5cbmltcG9ydCB7IHRha2VMYXRlc3QsIGNhbGwsIHB1dCwgc2VsZWN0IH0gZnJvbSBcInJlZHV4LXNhZ2EvZWZmZWN0c1wiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuL2NvbnN0XCI7XG5pbXBvcnQgeyBnZXRDb29raWUgfSBmcm9tIFwiLi4vbXktcmVzdWx0cy91dGlsc1wiO1xuXG5mdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG4gICAgcmV0dXJuIGF4aW9zKGNvbmZpZylcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gKHsgcmVzcG9uc2UgfSkpXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiAoeyBlcnJvciB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaERhdGEodXNlcklkKSB7XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gXG4gICAgfTtcbiAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXREYXRhKHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZShcImNzcmZ0b2tlblwiKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGdldFNhZ2EoYWN0aW9uKSB7XG4gICAgY29uc3QgeyB1c2VySWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgIGNvbnN0IHsgcmVzcG9uc2UsIGVycm9yIH0gPSB5aWVsZCBjYWxsKGZldGNoRGF0YSwgdXNlcklkKTtcbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFVzZXJJZCA9IHN0YXRlID0+IHN0YXRlLnVzZXJJZDtcbmV4cG9ydCBjb25zdCBnZXRVc2VyUHJvamVjdHMgPSBzdGF0ZSA9PiBzdGF0ZS51c2VyX3Byb2plY3RzO1xuZXhwb3J0IGNvbnN0IGdldElzUmVzdHJpY3RlZCA9IHN0YXRlID0+IHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiogcHV0U2FnYShhY3Rpb24pIHtcbiAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcbiAgICBjb25zdCB1c2VySWQgPSB5aWVsZCBzZWxlY3QoZ2V0VXNlcklkKTtcbiAgICBjb25zdCBpc19yZXN0cmljdGVkID0geWllbGQgc2VsZWN0KGdldElzUmVzdHJpY3RlZCk7XG4gICAgY29uc3QgdXNlcl9wcm9qZWN0cyA9IHlpZWxkIHNlbGVjdChnZXRVc2VyUHJvamVjdHMpO1xuXG4gICAgY29uc3QgeyByZXNwb25zZSwgZXJyb3IgfSA9IHlpZWxkIGNhbGwocHV0RGF0YSwgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKTtcbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuLy8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2FcbmV4cG9ydCBmdW5jdGlvbiogd2F0Y2hlclNhZ2EoKSB7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3Mvc2FnYXMuanMiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cbiAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cbiAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanNcbi8vIG1vZHVsZSBpZCA9IDc3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaXMtYnVmZmVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Nzdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9BeGlvcy5qc1xuLy8gbW9kdWxlIGlkID0gNzc4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9kZWZhdWx0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzc5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J0b2EnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblxuICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG4gICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cbiAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG4gICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG4gICAgICB4RG9tYWluID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG4gICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1xuLy8gbW9kdWxlIGlkID0gNzgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9zZXR0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc4MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgcmV0dXJuIGVycm9yO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDc4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xuLy8gbW9kdWxlIGlkID0gNzg3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cbnZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbmZ1bmN0aW9uIEUoKSB7XG4gIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xufVxuRS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5FLnByb3RvdHlwZS5jb2RlID0gNTtcbkUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICBmb3IgKFxuICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG4gICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcbiAgKSB7XG4gICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgIHRocm93IG5ldyBFKCk7XG4gICAgfVxuICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDc5MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG4gIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gIH1cblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc5MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNzkyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcbi8vIG1vZHVsZSBpZCA9IDc5N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXG4vLyBtb2R1bGUgaWQgPSA3OThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCByZXN0cmljdGVkVXNlclByb2plY3RzQnlPcmcgPSBbXG4gICAge1xuICAgICAgICBvcmdhbmlzYXRpb25zOiBcIkVVVEYsIFNOVlwiLFxuICAgICAgICBwcm9qZWN0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlByb2plY3QgMVwiLFxuICAgICAgICAgICAgICAgIHN1YnRpdGxlOiBcIlByb2plY3QgMSBzdWJ0aXRsZVwiLFxuICAgICAgICAgICAgICAgIGFjY2VzczogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDJcIixcbiAgICAgICAgICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDIgc3VidGl0bGVcIixcbiAgICAgICAgICAgICAgICBhY2Nlc3M6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiUHJvamVjdCAzXCIsXG4gICAgICAgICAgICAgICAgc3VidGl0bGU6IFwiUHJvamVjdCAzIHN1YnRpdGxlXCIsXG4gICAgICAgICAgICAgICAgYWNjZXNzOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgb3JnYW5pc2F0aW9uczogXCJFVVRGLCBHSVpcIixcbiAgICAgICAgcHJvamVjdHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogNCxcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJQcm9qZWN0IDRcIixcbiAgICAgICAgICAgICAgICBzdWJ0aXRsZTogXCJQcm9qZWN0IDQgc3VidGl0bGVcIixcbiAgICAgICAgICAgICAgICBhY2Nlc3M6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDUsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiUHJvamVjdCA1XCIsXG4gICAgICAgICAgICAgICAgc3VidGl0bGU6IFwiUHJvamVjdCA1IHN1YnRpdGxlXCIsXG4gICAgICAgICAgICAgICAgYWNjZXNzOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgb3JnYW5pc2F0aW9uczogXCJFVVRGXCIsXG4gICAgICAgIHByb2plY3RzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IDYsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiUHJvamVjdCA2XCIsXG4gICAgICAgICAgICAgICAgc3VidGl0bGU6IFwiUHJvamVjdCA2IHN1YnRpdGxlXCIsXG4gICAgICAgICAgICAgICAgYWNjZXNzOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiA3LFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlByb2plY3QgN1wiLFxuICAgICAgICAgICAgICAgIHN1YnRpdGxlOiBcIlByb2plY3QgNyBzdWJ0aXRsZVwiLFxuICAgICAgICAgICAgICAgIGFjY2VzczogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL21vY2stZGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=