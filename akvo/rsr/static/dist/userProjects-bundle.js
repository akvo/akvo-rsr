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
            var checked = !is_restricted || user_projects && (0, _utils.inArray)(project.id, user_projects), disabled = is_restricted ? "" : "disabled", projectSelected = checked ? " projectSelected" : "", trClassName = disabled + projectSelected, idClassName = disabled + " id";
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
            var disabled = is_restricted ? false : true, className = "selectAllProjects" + (is_restricted ? "" : " disabled");
            return _react2.default.createElement("div", {
                className: is_restricted ? undefined : "disabled"
            }, _react2.default.createElement("button", {
                onClick: onChangeProjectSelectAll,
                disabled: disabled,
                className: className
            }, selectAll ? _("check_all_projects") : _("uncheck_all_projects")));
        };
        var Error = function Error(_ref4) {
            var _ = _ref4._, error = _ref4.error;
            return error ? _react2.default.createElement("div", {
                className: "error"
            }, _("an_error_occured") + error.message) : null;
        };
        var Projects = function Projects(_ref5) {
            var _ = _ref5._, error = _ref5.error, all_projects = _ref5.all_projects, user_projects = _ref5.user_projects, is_restricted = _ref5.is_restricted, selectAll = _ref5.selectAll, onChangeIsRestricted = _ref5.onChangeIsRestricted, onChangeProjectSelectAll = _ref5.onChangeProjectSelectAll, onChangeProjectSelected = _ref5.onChangeProjectSelected;
            var className = is_restricted ? "" : "disabled";
            return _react2.default.createElement("span", null, _react2.default.createElement(Error, {
                _: _,
                error: error
            }), _react2.default.createElement(IsRestricted, {
                _: _,
                is_restricted: is_restricted,
                onChangeIsRestricted: onChangeIsRestricted
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
                    this.props.onFetchUserProjects(userId);
                }
            }, {
                key: "render",
                value: function render() {
                    var _props = this.props, is_restricted = _props.is_restricted, selectAll = _props.selectAll, all_projects = _props.all_projects, user_projects = _props.user_projects, error = _props.error;
                    return all_projects ? _react2.default.createElement(Projects, {
                        _: this._,
                        error: error,
                        is_restricted: is_restricted,
                        selectAll: selectAll,
                        all_projects: all_projects,
                        user_projects: user_projects,
                        onChangeIsRestricted: this.toggleIsRestricted,
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
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
            var action = arguments[1];
            switch (action.type) {
              case c.SET_STORE:
                {
                    var data = action.data;
                    return _extends({}, state, data);
                }

              case c.API_GET_INIT:
                {
                    return _extends({}, state, {
                        fetching: true,
                        error: null
                    });
                }

              case c.API_GET_SUCCESS:
                {
                    var _action$data = action.data, all_projects = _action$data.all_projects, user_projects = _action$data.user_projects;
                    return _extends({}, state, {
                        fetching: false,
                        all_projects: all_projects,
                        user_projects: user_projects && user_projects.projects || [],
                        is_restricted: user_projects && user_projects.is_restricted || false
                    });
                }

              case c.API_GET_FAILURE:
                {
                    return _extends({}, state, {
                        fetching: false,
                        all_projects: [],
                        user_projects: [],
                        error: action.error
                    });
                }

              case c.API_PUT_INIT:
                {
                    return _extends({}, state, {
                        fetching: true,
                        error: null
                    });
                }

              case c.API_PUT_SUCCESS:
                {
                    var _user_projects = action.data.user_projects;
                    return _extends({}, state, {
                        fetching: false,
                        is_restricted: _user_projects.is_restricted,
                        original_is_restricted: null,
                        user_projects: _user_projects.projects,
                        original_user_projects: null
                    });
                }

              case c.API_PUT_FAILURE:
                {
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
                }

              case c.UPDATE_PROJECT_SELECTION:
                {
                    var projectId = action.data.projectId;
                    var original_user_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    var _user_projects2 = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    (0, _utils.inArray)(projectId, _user_projects2) ? (0, _pull2.default)(_user_projects2, projectId) : _user_projects2.push(projectId);
                    return _extends({}, state, {
                        original_user_projects: original_user_projects,
                        user_projects: _user_projects2
                    });
                }

              case c.UPDATE_IS_RESTRICTED:
                {
                    var is_restricted = action.data.is_restricted;
                    return _extends({}, state, {
                        is_restricted: is_restricted,
                        original_is_restricted: state.is_restricted
                    });
                }

              case c.UPDATE_SELECT_ALL_PROJECTS:
                {
                    var _original_user_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    var _user_projects3 = void 0, _state = _extends({}, state), selectAll = _state.selectAll;
                    if (selectAll) {
                        _user_projects3 = state.all_projects.map(function(project) {
                            return project.id;
                        });
                    } else {
                        _user_projects3 = [];
                    }
                    selectAll = !selectAll;
                    return _extends({}, state, {
                        selectAll: selectAll,
                        original_user_projects: _original_user_projects,
                        user_projects: _user_projects3
                    });
                }

              default:
                {
                    return state;
                }
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
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHVjZXIiLCJfc2FnYXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNhZ2FNaWRkbGV3YXJlIiwicmVkdXhEZXZUb29scyIsIndpbmRvdyIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJzdG9yZSIsImNyZWF0ZVN0b3JlIiwicmVkdWNlciIsImNvbXBvc2UiLCJhcHBseU1pZGRsZXdhcmUiLCJydW4iLCJ3YXRjaGVyU2FnYSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCI3MzUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJrZXkiLCJDb25zdHJ1Y3RvciIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIl91dGlscyIsIl9jb25zdCIsImMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ld09iaiIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiSXNSZXN0cmljdGVkIiwiX3JlZiIsIl8iLCJpc19yZXN0cmljdGVkIiwib25DaGFuZ2VJc1Jlc3RyaWN0ZWQiLCJpZCIsInR5cGUiLCJjaGVja2VkIiwib25DaGFuZ2UiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImNsYXNzTmFtZSIsIlByb2plY3QiLCJfcmVmMiIsInByb2plY3QiLCJ1c2VyX3Byb2plY3RzIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQiLCJpbkFycmF5IiwiZGlzYWJsZWQiLCJwcm9qZWN0U2VsZWN0ZWQiLCJ0ckNsYXNzTmFtZSIsImlkQ2xhc3NOYW1lIiwib25DbGljayIsInJlYWRPbmx5IiwidGl0bGUiLCJTZWxlY3RBbGwiLCJfcmVmMyIsInNlbGVjdEFsbCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCIsInVuZGVmaW5lZCIsIkVycm9yIiwiX3JlZjQiLCJlcnJvciIsIm1lc3NhZ2UiLCJQcm9qZWN0cyIsIl9yZWY1IiwiYWxsX3Byb2plY3RzIiwibWFwIiwiQXBwIiwiX1JlYWN0JENvbXBvbmVudCIsInRoaXMiLCJfdGhpcyIsImdldFByb3RvdHlwZU9mIiwidG9nZ2xlUHJvamVjdFNlbGVjdGVkIiwiYmluZCIsInRvZ2dsZUlzUmVzdHJpY3RlZCIsInRvZ2dsZVByb2plY3RTZWxlY3RBbGwiLCJzIiwic3RyaW5ncyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJvblVwZGF0ZUlzUmVzdHJpY3RlZCIsIm9uVXBkYXRlU2VsZWN0QWxsIiwiY3VycmVudFRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24iLCJjb21wb25lbnREaWRNb3VudCIsInVzZXJJZCIsImRhdGFGcm9tRWxlbWVudCIsInNldFN0b3JlIiwib25GZXRjaFVzZXJQcm9qZWN0cyIsIl9wcm9wcyIsIlJlYWN0IiwiQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJmZXRjaGluZyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwiQVBJX0dFVF9JTklUIiwiZGF0YSIsIlNFVF9TVE9SRSIsInByb2plY3RJZCIsIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiIsIlVQREFURV9JU19SRVNUUklDVEVEIiwiVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMiLCJjb25uZWN0IiwiNzM2IiwiZW5kcG9pbnRzIiwiX3N0b3JlIiwiX3N0b3JlMiIsInVzZXJfcHJvamVjdHNfYWNjZXNzIiwiYXJyIiwiaW5kZXhPZiIsImVsZW1lbnROYW1lIiwiSlNPTiIsInBhcnNlIiwiaW5uZXJIVE1MIiwiNzM3IiwiQVBJX0dFVF9TVUNDRVNTIiwiQVBJX0dFVF9GQUlMVVJFIiwiQVBJX1BVVF9JTklUIiwiQVBJX1BVVF9TVUNDRVNTIiwiQVBJX1BVVF9GQUlMVVJFIiwiNzM4IiwidXRpbHMiLCJlZmZlY3RzIiwiZGV0YWNoIiwiQ0FOQ0VMIiwiZGVsYXkiLCJ0aHJvdHRsZSIsInRha2VMYXRlc3QiLCJ0YWtlRXZlcnkiLCJidWZmZXJzIiwiY2hhbm5lbCIsImV2ZW50Q2hhbm5lbCIsIkVORCIsInJ1blNhZ2EiLCJfcnVuU2FnYSIsImdldCIsIl9jaGFubmVsIiwiX2J1ZmZlcnMiLCJfc2FnYUhlbHBlcnMiLCJfaW8iLCJfbWlkZGxld2FyZSIsIl9taWRkbGV3YXJlMiIsIl9lZmZlY3RzIiwiX3V0aWxzMiIsIjczOSIsInByb2Nlc3MiLCJfcHJvYyIsIl9wcm9jMiIsIlJVTl9TQUdBX1NJR05BVFVSRSIsIk5PTl9HRU5FUkFUT1JfRVJSIiwic3RvcmVJbnRlcmZhY2UiLCJzYWdhIiwiX2xlbiIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJpdGVyYXRvciIsImlzIiwiZW52IiwiTk9ERV9FTlYiLCJsb2ciLCJjaGVjayIsImZ1bmMiLCJhcHBseSIsIl9zdG9yZUludGVyZmFjZSIsInN1YnNjcmliZSIsImdldFN0YXRlIiwiY29udGV4dCIsInNhZ2FNb25pdG9yIiwibG9nZ2VyIiwib25FcnJvciIsImVmZmVjdElkIiwidWlkIiwiZWZmZWN0VHJpZ2dlcmVkIiwibm9vcCIsImVmZmVjdFJlc29sdmVkIiwiZWZmZWN0UmVqZWN0ZWQiLCJlZmZlY3RDYW5jZWxsZWQiLCJhY3Rpb25EaXNwYXRjaGVkIiwicm9vdCIsInBhcmVudEVmZmVjdElkIiwiZWZmZWN0IiwidGFzayIsIndyYXBTYWdhRGlzcGF0Y2giLCJuYW1lIiwiNzQwIiwiX2V4dGVuZHMiLCJhc3NpZ24iLCJzb3VyY2UiLCJfdHlwZW9mIiwiU3ltYm9sIiwiaGFzT3duIiwicmVtb3ZlIiwiZGVmZXJyZWQiLCJhcnJheU9mRGVmZmVyZWQiLCJjcmVhdGVNb2NrVGFzayIsImF1dG9JbmMiLCJtYWtlSXRlcmF0b3IiLCJkZXByZWNhdGUiLCJzeW0iLCJUQVNLIiwiSEVMUEVSIiwiTUFUQ0giLCJTQUdBX0FDVElPTiIsIlNFTEZfQ0FOQ0VMTEFUSU9OIiwia29uc3QiLCJ2Iiwia1RydWUiLCJrRmFsc2UiLCJpZGVudCIsInByZWRpY2F0ZSIsIm9iamVjdCIsInByb3BlcnR5Iiwibm90VW5kZWYiLCJ1bmRlZiIsImYiLCJudW1iZXIiLCJuIiwic3RyaW5nIiwiYXJyYXkiLCJpc0FycmF5IiwicHJvbWlzZSIsInAiLCJ0aGVuIiwiaXQiLCJuZXh0IiwidGhyb3ciLCJpdGVyYWJsZSIsInQiLCJvYnNlcnZhYmxlIiwib2IiLCJidWZmZXIiLCJidWYiLCJpc0VtcHR5IiwidGFrZSIsInB1dCIsInBhdHRlcm4iLCJwYXQiLCJjaCIsImNsb3NlIiwiaGVscGVyIiwic3RyaW5nYWJsZUZ1bmMiLCJpdGVtIiwiaW5kZXgiLCJzcGxpY2UiLCJmcm9tIiwiZGVmIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwdXNoIiwibXMiLCJ2YWwiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicnVubmluZyIsIl9yZXN1bHQiLCJfZXJyb3IiLCJpc1J1bm5pbmciLCJyZXN1bHQiLCJzZXRSdW5uaW5nIiwiYiIsInNldFJlc3VsdCIsInIiLCJzZXRFcnJvciIsInNlZWQiLCJrVGhyb3ciLCJlcnIiLCJrUmV0dXJuIiwiZG9uZSIsInRocm8iLCJpc0hlbHBlciIsInJldHVybiIsImxldmVsIiwiY29uc29sZSIsInN0YWNrIiwiZm4iLCJkZXByZWNhdGlvbldhcm5pbmciLCJ1cGRhdGVJbmNlbnRpdmUiLCJkZXByZWNhdGVkIiwicHJlZmVycmVkIiwiaW50ZXJuYWxFcnIiLCJjcmVhdGVTZXRDb250ZXh0V2FybmluZyIsImN0eCIsImFjdGlvbiIsImNsb25lYWJsZUdlbmVyYXRvciIsImdlbmVyYXRvckZ1bmMiLCJoaXN0b3J5IiwiZ2VuIiwiYXJnIiwiY2xvbmUiLCJjbG9uZWRHZW4iLCJmb3JFYWNoIiwiX3JldHVybiIsIl90aHJvdyIsImV4Y2VwdGlvbiIsIjc0MSIsIlRBU0tfQ0FOQ0VMIiwiQ0hBTk5FTF9FTkQiLCJOT1RfSVRFUkFUT1JfRVJST1IiLCJwcm9jIiwiX3NjaGVkdWxlciIsIl9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyIsImRlc2NzIiwiZGVzYyIsInRvU3RyaW5nIiwibWF0Y2hlcnMiLCJ3aWxkY2FyZCIsIl9kZWZhdWx0IiwiaW5wdXQiLCJTdHJpbmciLCJwYXR0ZXJucyIsInNvbWUiLCJtYXRjaGVyIiwiX3ByZWRpY2F0ZSIsImZvcmtRdWV1ZSIsIm1haW5UYXNrIiwiY2IiLCJ0YXNrcyIsImNvbXBsZXRlZCIsImFkZFRhc2siLCJhYm9ydCIsImNhbmNlbEFsbCIsImNvbnQiLCJyZXMiLCJpc0VyciIsImNhbmNlbCIsImdldFRhc2tzIiwidGFza05hbWVzIiwiY3JlYXRlVGFza0l0ZXJhdG9yIiwicGMiLCJlZmYiLCJyZXQiLCJ3cmFwSGVscGVyIiwicGFyZW50Q29udGV4dCIsIm9wdGlvbnMiLCJlZmZlY3RzU3RyaW5nIiwicnVuUGFyYWxsZWxFZmZlY3QiLCJydW5BbGxFZmZlY3QiLCJsb2dFcnJvciIsInNhZ2FTdGFjayIsInNwbGl0Iiwic3RkQ2hhbm5lbCIsInRhc2tDb250ZXh0IiwibmV3VGFzayIsImNhbmNlbE1haW4iLCJ0YXNrUXVldWUiLCJlbmQiLCJpc0NhbmNlbGxlZCIsIl9pc1J1bm5pbmciLCJfaXNDYW5jZWxsZWQiLCJydW5FZmZlY3QiLCJpc01haW5SdW5uaW5nIiwiX2RlZmVycmVkRW5kIiwiX2lzQWJvcnRlZCIsImpvaW5lcnMiLCJqIiwibGFiZWwiLCJlZmZlY3RTZXR0bGVkIiwiY3VyckNiIiwicmVzb2x2ZVByb21pc2UiLCJydW5Gb3JrRWZmZWN0IiwicmVzb2x2ZUl0ZXJhdG9yIiwiYXNFZmZlY3QiLCJydW5UYWtlRWZmZWN0IiwicnVuUHV0RWZmZWN0IiwiYWxsIiwicmFjZSIsInJ1blJhY2VFZmZlY3QiLCJydW5DYWxsRWZmZWN0IiwiY3BzIiwicnVuQ1BTRWZmZWN0IiwiZm9yayIsImpvaW4iLCJydW5Kb2luRWZmZWN0IiwicnVuQ2FuY2VsRWZmZWN0Iiwic2VsZWN0IiwicnVuU2VsZWN0RWZmZWN0IiwiYWN0aW9uQ2hhbm5lbCIsInJ1bkNoYW5uZWxFZmZlY3QiLCJmbHVzaCIsInJ1bkZsdXNoRWZmZWN0IiwiY2FuY2VsbGVkIiwicnVuQ2FuY2VsbGVkRWZmZWN0IiwiZ2V0Q29udGV4dCIsInJ1bkdldENvbnRleHRFZmZlY3QiLCJzZXRDb250ZXh0IiwicnVuU2V0Q29udGV4dEVmZmVjdCIsImNhbmNlbFByb21pc2UiLCJtYXliZSIsInRha2VDYiIsImlucCIsImlzRW5kIiwiYXNhcCIsImNwc0NiIiwiY29uY2F0IiwiX3JlZjYiLCJkZXRhY2hlZCIsInRhc2tJdGVyYXRvciIsInN1c3BlbmQiLCJfdGFzayIsImpvaW5lciIsImlzQWJvcnRlZCIsInRhc2tUb0NhbmNlbCIsImtleXMiLCJjb21wbGV0ZWRDb3VudCIsInJlc3VsdHMiLCJjaGlsZENicyIsImNoZWNrRWZmZWN0RW5kIiwiY2hDYkF0S2V5IiwiX3Jlc3BvbnNlIiwicmVzcG9uc2UiLCJzbGljZSIsIl9yZWY3Iiwic2VsZWN0b3IiLCJfcmVmOCIsIm1hdGNoIiwiZml4ZWQiLCJwcm9wIiwiX2RvbmUiLCJfcmVmOSIsIl9tdXRhdG9yTWFwIiwiNzQyIiwicXVldWUiLCJzZW1hcGhvcmUiLCJleGVjIiwicmVsZWFzZSIsInNoaWZ0IiwiNzQzIiwidGFrZW0iLCJzcGF3biIsIklPIiwiVEFLRSIsIlBVVCIsIkFMTCIsIlJBQ0UiLCJDQUxMIiwiQ1BTIiwiRk9SSyIsIkpPSU4iLCJTRUxFQ1QiLCJBQ1RJT05fQ0hBTk5FTCIsIkNBTkNFTExFRCIsIkZMVVNIIiwiR0VUX0NPTlRFWFQiLCJTRVRfQ09OVEVYVCIsIlRFU1RfSElOVCIsInBheWxvYWQiLCJwYXR0ZXJuT3JDaGFubmVsIiwic3luYyIsImdldEZuQ2FsbERlc2MiLCJtZXRoIiwiX2ZuIiwiX2ZuMiIsIl9sZW4yIiwiX2tleTIiLCJfbGVuMyIsIl9rZXkzIiwiX2xlbjQiLCJfa2V5NCIsIl9sZW41IiwiX2tleTUiLCJfbGVuNiIsIl9rZXk2IiwiX2xlbjciLCJfa2V5NyIsIndvcmtlciIsIl9sZW44IiwiX2tleTgiLCJ0YWtlRXZlcnlIZWxwZXIiLCJfbGVuOSIsIl9rZXk5IiwidGFrZUxhdGVzdEhlbHBlciIsIl9sZW4xMCIsIl9rZXkxMCIsInRocm90dGxlSGVscGVyIiwiY3JlYXRlQXNFZmZlY3RUeXBlIiwiNzQ0IiwiX3Rha2VFdmVyeSIsIl90YWtlRXZlcnkyIiwiX3Rha2VMYXRlc3QiLCJfdGFrZUxhdGVzdDIiLCJfdGhyb3R0bGUiLCJfdGhyb3R0bGUyIiwiaGVscGVyTmFtZSIsIjc0NSIsIl9mc21JdGVyYXRvciIsIl9mc21JdGVyYXRvcjIiLCJ5VGFrZSIsInlGb3JrIiwiYWMiLCJzZXRBY3Rpb24iLCJxMSIsInEyIiwicUVuZCIsInNhZmVOYW1lIiwiNzQ2IiwiZnNtSXRlcmF0b3IiLCJlbnRyeSIsImZzbSIsInEwIiwidXBkYXRlU3RhdGUiLCJxTmV4dCIsIl9mc20kcU5leHQiLCJxIiwib3V0cHV0IiwiX3VwZGF0ZVN0YXRlIiwiNzQ3IiwiVU5ERUZJTkVEX0lOUFVUX0VSUk9SIiwiSU5WQUxJRF9CVUZGRVIiLCJlbWl0dGVyIiwiQ0hBTk5FTF9FTkRfVFlQRSIsImEiLCJzdWJzY3JpYmVycyIsInN1YiIsImVtaXQiLCJsZW4iLCJjbG9zZWQiLCJ0YWtlcnMiLCJjaGVja0ZvcmJpZGRlblN0YXRlcyIsIl9fdGFrZXJzX18iLCJfX2Nsb3NlZF9fIiwibm9uZSIsImNoYW4iLCJ1bnN1YnNjcmliZSIsIjc0OCIsIkJVRkZFUl9PVkVSRkxPVyIsIk9OX09WRVJGTE9XX1RIUk9XIiwiT05fT1ZFUkZMT1dfRFJPUCIsIk9OX09WRVJGTE9XX1NMSURFIiwiT05fT1ZFUkZMT1dfRVhQQU5EIiwiemVyb0J1ZmZlciIsInJpbmdCdWZmZXIiLCJsaW1pdCIsIm92ZXJmbG93QWN0aW9uIiwicHVzaEluZGV4IiwicG9wSW5kZXgiLCJpdGVtcyIsImRvdWJsZWRMaW1pdCIsImRyb3BwaW5nIiwic2xpZGluZyIsImV4cGFuZGluZyIsImluaXRpYWxTaXplIiwiNzQ5IiwieUNhbmNlbCIsInNldFRhc2siLCJxMyIsIjc1MCIsImRlbGF5TGVuZ3RoIiwieUFjdGlvbkNoYW5uZWwiLCJ5RGVsYXkiLCJzZXRDaGFubmVsIiwicTQiLCI3NTEiLCJzYWdhTWlkZGxld2FyZUZhY3RvcnkiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJfcmVmJGNvbnRleHQiLCJvbmVycm9yIiwic2FnYUVtaXR0ZXIiLCI3NTIiLCI3NTMiLCI3NTQiLCJfcHVsbCIsIl9wdWxsMiIsIl90b0NvbnN1bWFibGVBcnJheSIsImFycjIiLCJpbml0aWFsU3RhdGUiLCJvcmlnaW5hbF9pc19yZXN0cmljdGVkIiwib3JpZ2luYWxfdXNlcl9wcm9qZWN0cyIsIl9hY3Rpb24kZGF0YSIsInByb2plY3RzIiwibmV3U3RhdGUiLCJfdXNlcl9wcm9qZWN0czMiLCJfc3RhdGUiLCI3NTUiLCJiYXNlUmVzdCIsInB1bGxBbGwiLCJwdWxsIiwiNzU2IiwiaWRlbnRpdHkiLCJvdmVyUmVzdCIsInNldFRvU3RyaW5nIiwic3RhcnQiLCI3NTciLCJuYXRpdmVNYXgiLCJNYXRoIiwibWF4IiwidHJhbnNmb3JtIiwib3RoZXJBcmdzIiwiNzU4IiwidGhpc0FyZyIsIjc1OSIsImJhc2VTZXRUb1N0cmluZyIsInNob3J0T3V0IiwiNzYwIiwiY29uc3RhbnQiLCI3NjEiLCI3NjIiLCJIT1RfQ09VTlQiLCJIT1RfU1BBTiIsIm5hdGl2ZU5vdyIsIkRhdGUiLCJub3ciLCJjb3VudCIsImxhc3RDYWxsZWQiLCJzdGFtcCIsInJlbWFpbmluZyIsIjc2MyIsImJhc2VQdWxsQWxsIiwidmFsdWVzIiwiNzY0IiwiYXJyYXlNYXAiLCJiYXNlSW5kZXhPZiIsImJhc2VJbmRleE9mV2l0aCIsImJhc2VVbmFyeSIsImNvcHlBcnJheSIsImFycmF5UHJvdG8iLCJpdGVyYXRlZSIsImNvbXBhcmF0b3IiLCJzZWVuIiwiZnJvbUluZGV4IiwiY29tcHV0ZWQiLCI3NjUiLCJiYXNlRmluZEluZGV4IiwiYmFzZUlzTmFOIiwic3RyaWN0SW5kZXhPZiIsIjc2NiIsImZyb21SaWdodCIsIjc2NyIsIjc2OCIsIjc2OSIsIjc3MCIsIjc3MSIsImdldElzUmVzdHJpY3RlZCIsImdldFVzZXJQcm9qZWN0cyIsImdldFVzZXJJZCIsImZldGNoRGF0YSIsInB1dERhdGEiLCJnZXRTYWdhIiwicHV0U2FnYSIsIl9heGlvcyIsIl9heGlvczIiLCJfbWFya2VkIiwicmVnZW5lcmF0b3JSdW50aW1lIiwibWFyayIsIl9tYXJrZWQyIiwiX21hcmtlZDMiLCJjYWxsQXhpb3MiLCJjb25maWciLCJjYXRjaCIsIm1ldGhvZCIsInVybCIsImhlYWRlcnMiLCJYLUNTUkZUb2tlbiIsImdldENvb2tpZSIsIndyYXAiLCJnZXRTYWdhJCIsIl9jb250ZXh0IiwicHJldiIsInNlbnQiLCJzdG9wIiwicHV0U2FnYSQiLCJfY29udGV4dDIiLCJ3YXRjaGVyU2FnYSQiLCJfY29udGV4dDMiLCI3NzIiLCJnbG9iYWwiLCJPcCIsIiRTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwidG9TdHJpbmdUYWdTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImluTW9kdWxlIiwicnVudGltZSIsImlubmVyRm4iLCJvdXRlckZuIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsIkNvbnRleHQiLCJfaW52b2tlIiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwiR2VuU3RhdGVTdXNwZW5kZWRTdGFydCIsIkdlblN0YXRlU3VzcGVuZGVkWWllbGQiLCJHZW5TdGF0ZUV4ZWN1dGluZyIsIkdlblN0YXRlQ29tcGxldGVkIiwiQ29udGludWVTZW50aW5lbCIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJJdGVyYXRvclByb3RvdHlwZSIsImdldFByb3RvIiwiTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUiLCJHcCIsImRpc3BsYXlOYW1lIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImdlbkZ1biIsImN0b3IiLCJhd3JhcCIsIl9fYXdhaXQiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwicmVjb3JkIiwidW53cmFwcGVkIiwicHJldmlvdXNQcm9taXNlIiwiZW5xdWV1ZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiYXN5bmMiLCJpdGVyIiwiZG9uZVJlc3VsdCIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsImluZm8iLCJyZXN1bHROYW1lIiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwicmV2ZXJzZSIsInBvcCIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJza2lwVGVtcFJlc2V0IiwiY2hhckF0Iiwicm9vdEVudHJ5Iiwicm9vdFJlY29yZCIsInJ2YWwiLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJGdW5jdGlvbiIsIjc3MyIsIjc3NCIsIkF4aW9zIiwiZGVmYXVsdHMiLCJjcmVhdGVJbnN0YW5jZSIsImRlZmF1bHRDb25maWciLCJyZXF1ZXN0IiwiZXh0ZW5kIiwiYXhpb3MiLCJpbnN0YW5jZUNvbmZpZyIsIm1lcmdlIiwiQ2FuY2VsIiwiQ2FuY2VsVG9rZW4iLCJpc0NhbmNlbCIsInByb21pc2VzIiwic3ByZWFkIiwiNzc1IiwiaXNCdWZmZXIiLCJpc0FycmF5QnVmZmVyIiwiaXNGb3JtRGF0YSIsIkZvcm1EYXRhIiwiaXNBcnJheUJ1ZmZlclZpZXciLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1VuZGVmaW5lZCIsImlzT2JqZWN0IiwiaXNEYXRlIiwiaXNGaWxlIiwiaXNCbG9iIiwiaXNGdW5jdGlvbiIsImlzU3RyZWFtIiwicGlwZSIsImlzVVJMU2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwidHJpbSIsInN0ciIsInJlcGxhY2UiLCJpc1N0YW5kYXJkQnJvd3NlckVudiIsIm5hdmlnYXRvciIsInByb2R1Y3QiLCJsIiwiYXNzaWduVmFsdWUiLCI3NzYiLCI3NzciLCJpc1Nsb3dCdWZmZXIiLCJfaXNCdWZmZXIiLCJyZWFkRmxvYXRMRSIsIjc3OCIsIkludGVyY2VwdG9yTWFuYWdlciIsImRpc3BhdGNoUmVxdWVzdCIsImludGVyY2VwdG9ycyIsInRvTG93ZXJDYXNlIiwiY2hhaW4iLCJ1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyIsImludGVyY2VwdG9yIiwidW5zaGlmdCIsImZ1bGZpbGxlZCIsInJlamVjdGVkIiwicHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzIiwiZm9yRWFjaE1ldGhvZE5vRGF0YSIsImZvckVhY2hNZXRob2RXaXRoRGF0YSIsIjc3OSIsIm5vcm1hbGl6ZUhlYWRlck5hbWUiLCJERUZBVUxUX0NPTlRFTlRfVFlQRSIsIkNvbnRlbnQtVHlwZSIsInNldENvbnRlbnRUeXBlSWZVbnNldCIsImdldERlZmF1bHRBZGFwdGVyIiwiYWRhcHRlciIsIlhNTEh0dHBSZXF1ZXN0IiwidHJhbnNmb3JtUmVxdWVzdCIsInN0cmluZ2lmeSIsInRyYW5zZm9ybVJlc3BvbnNlIiwidGltZW91dCIsInhzcmZDb29raWVOYW1lIiwieHNyZkhlYWRlck5hbWUiLCJtYXhDb250ZW50TGVuZ3RoIiwidmFsaWRhdGVTdGF0dXMiLCJzdGF0dXMiLCJjb21tb24iLCJBY2NlcHQiLCI3ODAiLCJub3JtYWxpemVkTmFtZSIsInByb2Nlc3NIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsIjc4MSIsInNldHRsZSIsImJ1aWxkVVJMIiwicGFyc2VIZWFkZXJzIiwiaXNVUkxTYW1lT3JpZ2luIiwiY3JlYXRlRXJyb3IiLCJidG9hIiwieGhyQWRhcHRlciIsImRpc3BhdGNoWGhyUmVxdWVzdCIsInJlcXVlc3REYXRhIiwicmVxdWVzdEhlYWRlcnMiLCJsb2FkRXZlbnQiLCJ4RG9tYWluIiwiWERvbWFpblJlcXVlc3QiLCJvbnByb2dyZXNzIiwiaGFuZGxlUHJvZ3Jlc3MiLCJvbnRpbWVvdXQiLCJoYW5kbGVUaW1lb3V0IiwiYXV0aCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJBdXRob3JpemF0aW9uIiwib3BlbiIsInBhcmFtcyIsInBhcmFtc1NlcmlhbGl6ZXIiLCJoYW5kbGVMb2FkIiwicmVhZHlTdGF0ZSIsInJlc3BvbnNlVVJMIiwicmVzcG9uc2VIZWFkZXJzIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2VUZXh0Iiwic3RhdHVzVGV4dCIsImhhbmRsZUVycm9yIiwiY29va2llcyIsInhzcmZWYWx1ZSIsIndpdGhDcmVkZW50aWFscyIsInJlYWQiLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25Eb3dubG9hZFByb2dyZXNzIiwib25VcGxvYWRQcm9ncmVzcyIsInVwbG9hZCIsImNhbmNlbFRva2VuIiwib25DYW5jZWxlZCIsInNlbmQiLCI3ODIiLCI3ODMiLCJlbmhhbmNlRXJyb3IiLCJjb2RlIiwiNzg0IiwiNzg1IiwiZW5jb2RlIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic2VyaWFsaXplZFBhcmFtcyIsInBhcnRzIiwic2VyaWFsaXplIiwicGFyc2VWYWx1ZSIsInRvSVNPU3RyaW5nIiwiNzg2IiwiaWdub3JlRHVwbGljYXRlT2YiLCJwYXJzZWQiLCJwYXJzZXIiLCJsaW5lIiwic3Vic3RyIiwiNzg3Iiwic3RhbmRhcmRCcm93c2VyRW52IiwibXNpZSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJ1cmxQYXJzaW5nTm9kZSIsIm9yaWdpblVSTCIsInJlc29sdmVVUkwiLCJocmVmIiwic2V0QXR0cmlidXRlIiwicHJvdG9jb2wiLCJob3N0Iiwic2VhcmNoIiwiaGFzaCIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwibG9jYXRpb24iLCJyZXF1ZXN0VVJMIiwibm9uU3RhbmRhcmRCcm93c2VyRW52IiwiNzg4IiwiY2hhcnMiLCJFIiwiYmxvY2siLCJjaGFyQ29kZSIsImlkeCIsImNoYXJDb2RlQXQiLCI3ODkiLCJ3cml0ZSIsImV4cGlyZXMiLCJwYXRoIiwiZG9tYWluIiwic2VjdXJlIiwiY29va2llIiwidG9HTVRTdHJpbmciLCJSZWdFeHAiLCJkZWNvZGVVUklDb21wb25lbnQiLCI3OTAiLCJoYW5kbGVycyIsInVzZSIsImVqZWN0IiwiZm9yRWFjaEhhbmRsZXIiLCJoIiwiNzkxIiwidHJhbnNmb3JtRGF0YSIsImlzQWJzb2x1dGVVUkwiLCJjb21iaW5lVVJMcyIsInRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQiLCJ0aHJvd0lmUmVxdWVzdGVkIiwiYmFzZVVSTCIsImNsZWFuSGVhZGVyQ29uZmlnIiwib25BZGFwdGVyUmVzb2x1dGlvbiIsIm9uQWRhcHRlclJlamVjdGlvbiIsInJlYXNvbiIsIjc5MiIsImZucyIsIjc5MyIsIl9fQ0FOQ0VMX18iLCI3OTQiLCI3OTUiLCJyZWxhdGl2ZVVSTCIsIjc5NiIsIjc5NyIsImV4ZWN1dG9yIiwicHJvbWlzZUV4ZWN1dG9yIiwidG9rZW4iLCI3OTgiLCJjYWxsYmFjayJdLCJtYXBwaW5ncyI6IkFBQUFBLGVBQWM7SUFFUkMsR0FDQSxTQUFVQyxRQUFRQyxTQUFTQztRQUVoQztRQ0VELElBQUFDLFNBQUFELG9CQUFBO1FERUMsSUFBSUUsVUFBVUMsdUJBQXVCRjtRQ0R0QyxJQUFBRyxZQUFBSixvQkFBQTtRREtDLElBQUlLLGFBQWFGLHVCQUF1QkM7UUNIekMsSUFBQUUsT0FBQU4sb0JBQUE7UURPQyxJQUFJTyxRQUFRSix1QkFBdUJHO1FDTHBDLElBQUFFLFNBQUFS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QUE7WUFDQSxJQUFBMzNCLEtBQUFnNEIsUUFBQTtnQkFDQSxNQUFBaDRCLEtBQUFnNEI7OztRQVFBaE0sWUFBQWxrQixTQUFBLFNBQUFBO1lBQ0EsSUFBQTJJO1lBQ0EsSUFBQW1vQixRQUFBLElBQUE1TSxZQUFBLFNBQUEwTSxTQUFBcDhCO2dCQUNBbVUsU0FBQW5VOztZQUVBO2dCQUNBczhCO2dCQUNBbm9COzs7UUFJQTdYLE9BQUFDLFVBQUFtekI7O0loRTJoTU02TSxLQUNBLFNBQVVqZ0MsUUFBUUM7UWlFcGxNeEI7UUFzQkFELE9BQUFDLFVBQUEsU0FBQXN6QixPQUFBMk07WUFDQSxnQkFBQTVULEtBQUFyaUI7Z0JBQ0EsT0FBQWkyQixTQUFBenlCLE1BQUEsTUFBQXhEIiwiZmlsZSI6InVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3ZWJwYWNrSnNvbnAoWzFdLHtcblxuLyoqKi8gMDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNyk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblx0XG5cdHZhciBfQXBwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzUpO1xuXHRcblx0dmFyIF9BcHAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQXBwKTtcblx0XG5cdHZhciBfcmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5Nyk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYSA9IF9fd2VicGFja19yZXF1aXJlX18oNzM4KTtcblx0XG5cdHZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3JlZHVjZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NCk7XG5cdFxuXHR2YXIgX3NhZ2FzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzEpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdC8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5cdC8qXG5cdCBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICovXG5cdFxuXHR2YXIgc2FnYU1pZGRsZXdhcmUgPSAoMCwgX3JlZHV4U2FnYTIuZGVmYXVsdCkoKTtcblx0XG5cdC8vIGRldiB0b29scyBtaWRkbGV3YXJlXG5cdHZhciByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblx0XG5cdHZhciBzdG9yZSA9IHZvaWQgMDtcblx0aWYgKHJlZHV4RGV2VG9vbHMpIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5jb21wb3NlKSgoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG5cdH0gZWxzZSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSkpO1xuXHR9XG5cdFxuXHRzYWdhTWlkZGxld2FyZS5ydW4oX3NhZ2FzLndhdGNoZXJTYWdhKTtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgIF9yZWFjdERvbTIuZGVmYXVsdC5yZW5kZXIoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG5cdCAgICAgICAgeyBzdG9yZTogc3RvcmUgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfQXBwMi5kZWZhdWx0LCBudWxsKVxuXHQgICAgKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIikpO1xuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNik7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cdFxuXHRmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH0gLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0dmFyIElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIElzUmVzdHJpY3RlZChfcmVmKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYuXyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZi5vbkNoYW5nZUlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJsYWJlbFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBcImlzX3Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZTogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICAgICAgfSksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XG5cdCAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuXHQgICAgICAgICAgICAgICAgICAgIF9faHRtbDogaXNfcmVzdHJpY3RlZCA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpIDogXyhcInVzZXJfYWNjZXNzX3VucmVzdHJpY3RlZFwiKVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBcInJlc3RyaWN0ZWRJbmZvXCIsXG5cdCAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogXyhcInJlc3RyaWN0ZWRfaW5mb1wiKSB9XG5cdCAgICAgICAgfSkgOiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBQcm9qZWN0ID0gZnVuY3Rpb24gUHJvamVjdChfcmVmMikge1xuXHQgICAgdmFyIF8gPSBfcmVmMi5fLFxuXHQgICAgICAgIHByb2plY3QgPSBfcmVmMi5wcm9qZWN0LFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcmVmMi51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmMi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjIub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgLy8gTk9URTogdGhlIGNoZWNrZWQgdmFsdWUgaXMgc2V0IHRvIHRydWUgaWYgaXNfcmVzdHJpY3RlZCBpcyBmYWxzZS4gVGhpcyBpcyBzbyB0aGF0IHRoZSBsaXN0IG9mXG5cdCAgICAvLyBwcm9qZWN0cyBsb29rcyBsaWtlIGFsbCBwcm9qZWN0cyBhcmUgc2VsZWN0ZWQgd2hlbiByZXN0cmljdGlvbnMgYXJlIG5vdCBpbiBmb3JjZS5cblx0ICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cblx0ICAgIHZhciBjaGVja2VkID0gIWlzX3Jlc3RyaWN0ZWQgfHwgdXNlcl9wcm9qZWN0cyAmJiAoMCwgX3V0aWxzLmluQXJyYXkpKHByb2plY3QuaWQsIHVzZXJfcHJvamVjdHMpLFxuXHQgICAgICAgIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG5cdCAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcblx0ICAgICAgICB0ckNsYXNzTmFtZSA9IGRpc2FibGVkICsgcHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwidHJcIixcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IHRyQ2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZCxcblx0ICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICB7IGNsYXNzTmFtZTogaWRDbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgcHJvamVjdC5pZFxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFNlbGVjdEFsbCA9IGZ1bmN0aW9uIFNlbGVjdEFsbChfcmVmMykge1xuXHQgICAgdmFyIF8gPSBfcmVmMy5fLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWYzLnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmMy5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYzLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgdmFyIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZSxcblx0ICAgICAgICBjbGFzc05hbWUgPSBcInNlbGVjdEFsbFByb2plY3RzXCIgKyAoaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcIiBkaXNhYmxlZFwiKTtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBpc19yZXN0cmljdGVkID8gdW5kZWZpbmVkIDogXCJkaXNhYmxlZFwiIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwiYnV0dG9uXCIsXG5cdCAgICAgICAgICAgIHsgb25DbGljazogb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLCBkaXNhYmxlZDogZGlzYWJsZWQsIGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA/IF8oXCJjaGVja19hbGxfcHJvamVjdHNcIikgOiBfKFwidW5jaGVja19hbGxfcHJvamVjdHNcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEVycm9yID0gZnVuY3Rpb24gRXJyb3IoX3JlZjQpIHtcblx0ICAgIHZhciBfID0gX3JlZjQuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY0LmVycm9yO1xuXHRcblx0ICAgIHJldHVybiBlcnJvciA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IFwiZXJyb3JcIiB9LFxuXHQgICAgICAgIF8oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZVxuXHQgICAgKSA6IG51bGw7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdHMgPSBmdW5jdGlvbiBQcm9qZWN0cyhfcmVmNSkge1xuXHQgICAgdmFyIF8gPSBfcmVmNS5fLFxuXHQgICAgICAgIGVycm9yID0gX3JlZjUuZXJyb3IsXG5cdCAgICAgICAgYWxsX3Byb2plY3RzID0gX3JlZjUuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcmVmNS51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmNS5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWY1LnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZCA9IF9yZWY1Lm9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCA9IF9yZWY1Lm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCA9IF9yZWY1Lm9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkO1xuXHRcblx0ICAgIHZhciBjbGFzc05hbWUgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIjtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEVycm9yLCB7IF86IF8sIGVycm9yOiBlcnJvciB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChJc1Jlc3RyaWN0ZWQsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ6IG9uQ2hhbmdlSXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsLCB7XG5cdCAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRhYmxlXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0aGVhZFwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgIFwidHJcIixcblx0ICAgICAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcImFjY2Vzc1wiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF9pZFwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF90aXRsZVwiKVxuXHQgICAgICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRib2R5XCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9qZWN0LCB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBBcHAgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuXHQgICAgX2luaGVyaXRzKEFwcCwgX1JlYWN0JENvbXBvbmVudCk7XG5cdFxuXHQgICAgZnVuY3Rpb24gQXBwKHByb3BzKSB7XG5cdCAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFwcCk7XG5cdFxuXHQgICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChBcHAuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihBcHApKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cdFxuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMuXyA9IF90aGlzLl8uYmluZChfdGhpcyk7XG5cdCAgICAgICAgcmV0dXJuIF90aGlzO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFRyYW5zbGF0aW9uIGhhbmRsaW5nXG5cdFxuXHRcblx0ICAgIF9jcmVhdGVDbGFzcyhBcHAsIFt7XG5cdCAgICAgICAga2V5OiBcIl9cIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gXyhzKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnN0cmluZ3MgJiYgdGhpcy5wcm9wcy5zdHJpbmdzW3NdO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlSXNSZXN0cmljdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZUlzUmVzdHJpY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJc1Jlc3RyaWN0ZWQoZS50YXJnZXQuY2hlY2tlZCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0ZWRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcblx0ICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihpZCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHQgICAgICAgICAgICB2YXIgdXNlcklkID0gKDAsIF91dGlscy5kYXRhRnJvbUVsZW1lbnQpKFwidXNlci10by1yZXN0cmljdFwiKS5pZDtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHVzZXJJZDogdXNlcklkIH0pO1xuXHRcblx0ICAgICAgICAgICAgdmFyIHN0cmluZ3MgPSAoMCwgX3V0aWxzLmRhdGFGcm9tRWxlbWVudCkoXCJ1c2VyLXByb2plY3RzLXRleHRcIik7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBzdHJpbmdzOiBzdHJpbmdzIH0pO1xuXHRcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJyZW5kZXJcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHQgICAgICAgICAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcyxcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcHJvcHMuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9wcm9wcy5zZWxlY3RBbGwsXG5cdCAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfcHJvcHMuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9wcm9wcy51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgZXJyb3IgPSBfcHJvcHMuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICByZXR1cm4gYWxsX3Byb2plY3RzID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdHMsIHtcblx0ICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcblx0ICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICgwLCBfdXRpbHMuXykoXCJsb2FkaW5nXCIpXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXHQgICAgfV0pO1xuXHRcblx0ICAgIHJldHVybiBBcHA7XG5cdH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cdFxuXHR2YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdCAgICB2YXIgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gc3RhdGUuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBzdGF0ZS5zZWxlY3RBbGwsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgc3RyaW5ncyA9IHN0YXRlLnN0cmluZ3M7XG5cdFxuXHQgICAgcmV0dXJuIHsgZmV0Y2hpbmc6IGZldGNoaW5nLCBlcnJvcjogZXJyb3IsIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGw6IHNlbGVjdEFsbCwgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cywgc3RyaW5nczogc3RyaW5ncyB9O1xuXHR9O1xuXHRcblx0dmFyIG1hcERpc3BhdGNoVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHQgICAgcmV0dXJuIHsgb25GZXRjaFVzZXJQcm9qZWN0czogZnVuY3Rpb24gb25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQ6IHVzZXJJZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sIHNldFN0b3JlOiBmdW5jdGlvbiBzZXRTdG9yZShkYXRhKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSwgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBmdW5jdGlvbiBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24ocHJvamVjdElkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTixcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkOiBwcm9qZWN0SWQgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LCBvblVwZGF0ZUlzUmVzdHJpY3RlZDogZnVuY3Rpb24gb25VcGRhdGVJc1Jlc3RyaWN0ZWQoaXNfcmVzdHJpY3RlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sIG9uVXBkYXRlU2VsZWN0QWxsOiBmdW5jdGlvbiBvblVwZGF0ZVNlbGVjdEFsbCgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KTtcblx0ICAgICAgICB9IH07XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuaW5BcnJheSA9IGV4cG9ydHMuZW5kcG9pbnRzID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9zdG9yZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzA0KTtcblx0XG5cdHZhciBfc3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RvcmUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBlbmRwb2ludHMgPSBleHBvcnRzLmVuZHBvaW50cyA9IHtcblx0ICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBmdW5jdGlvbiB1c2VyX3Byb2plY3RzX2FjY2VzcyhpZCkge1xuXHQgICAgICAgIHJldHVybiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgaWQgKyBcIi8/Zm9ybWF0PWpzb25cIjtcblx0ICAgIH1cblx0fTsgLypcblx0ICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgKi9cblx0XG5cdHZhciBpbkFycmF5ID0gZXhwb3J0cy5pbkFycmF5ID0gZnVuY3Rpb24gaW5BcnJheShvYmosIGFycikge1xuXHQgICAgcmV0dXJuIGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblx0fTtcblx0XG5cdHZhciBkYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGRhdGFGcm9tRWxlbWVudChlbGVtZW50TmFtZSkge1xuXHQgICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0Ly8gYWN0aW9uIHR5cGVzXG5cdHZhciAvL1xuXHRTRVRfU1RPUkUgPSBleHBvcnRzLlNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG5cdFxuXHQvL1xuXHRBUElfR0VUX0lOSVQgPSBleHBvcnRzLkFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG5cdCAgICBBUElfR0VUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfR0VUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRBUElfUFVUX0lOSVQgPSBleHBvcnRzLkFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG5cdCAgICBBUElfUFVUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfUFVUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBleHBvcnRzLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG5cdCAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IGV4cG9ydHMuVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG5cdCAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IGV4cG9ydHMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWxheTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZGV0YWNoO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTEpO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cdFxuXHR2YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Myk7XG5cdFxuXHR2YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuXHRleHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuXHRleHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0dmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcblx0dmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cdFxuXHRmdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHQgICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG5cdCAgICB9XG5cdCAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuXHQgICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgfVxuXHRcblx0ICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG5cdCAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcblx0ICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuXHQgICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXHRcblx0XG5cdCAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXHRcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG5cdCAgfVxuXHRcblx0ICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHRhc2s7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmNoZWNrID0gY2hlY2s7XG5cdGV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuXHRleHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcblx0ZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuXHRleHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcblx0ZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuXHRleHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5cdGV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5cdGV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG5cdHZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuXHQgIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcblx0fTtcblx0XG5cdHZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xuXHR2YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcblx0dmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG5cdHZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG5cdHZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xuXHR2YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcblx0dmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHY7XG5cdCAgfTtcblx0fTtcblx0dmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcblx0dmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcblx0dmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cdHZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG5cdCAgcmV0dXJuIHY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuXHQgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcblx0ICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdH1cblx0XG5cdHZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG5cdCAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9LFxuXHQgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcblx0ICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG5cdCAgfSxcblx0ICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuXHQgIH0sXG5cdCAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG5cdCAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG5cdCAgfSxcblx0ICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcblx0ICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcblx0ICB9LFxuXHQgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG5cdCAgfSxcblx0ICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuXHQgIH0sXG5cdCAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG5cdCAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuXHQgIH0sXG5cdCAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuXHQgICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcblx0ICB9LFxuXHQgIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuXHQgICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuXHQgIH0sXG5cdCAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcblx0ICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuXHQgIH0sXG5cdCAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG5cdCAgfSxcblx0ICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG5cdCAgfSxcblx0ICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuXHQgICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcblx0ICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuXHQgICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG5cdCAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG5cdCAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblx0ICBpZiAoaW5kZXggPj0gMCkge1xuXHQgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG5cdCAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcblx0ICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuXHQgICAgICAgIGFycltpXSA9IG9ialtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycjtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBkZWZlcnJlZCgpIHtcblx0ICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcblx0ICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG5cdCAgfSk7XG5cdCAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuXHQgIHJldHVybiBkZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcblx0ICB2YXIgYXJyID0gW107XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHQgICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG5cdCAgfVxuXHQgIHJldHVybiBhcnI7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlbGF5KG1zKSB7XG5cdCAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblx0XG5cdCAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdCAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcblx0ICAgIH0sIG1zKTtcblx0ICB9KTtcblx0XG5cdCAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuXHQgIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgIHJldHVybiBydW5uaW5nO1xuXHQgIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQ7XG5cdCAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgcmV0dXJuIF9lcnJvcjtcblx0ICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcblx0ICAgIHJldHVybiBydW5uaW5nID0gYjtcblx0ICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG5cdCAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcblx0ICAgIHJldHVybiBfZXJyb3IgPSBlO1xuXHQgIH0sIF9yZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGF1dG9JbmMoKSB7XG5cdCAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gKytzZWVkO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cdFxuXHR2YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuXHQgIHRocm93IGVycjtcblx0fTtcblx0dmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG5cdH07XG5cdGZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG5cdCAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblx0XG5cdCAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3I7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gaXRlcmF0b3I7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG5cdCAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuXHQgKiovXG5cdGZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuXHQgIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdFxuXHQgIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG5cdCAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcblx0ICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuXHQgIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG5cdH07XG5cdFxuXHR2YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG5cdCAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcblx0fTtcblx0XG5cdHZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG5cdCAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcblx0fTtcblx0XG5cdHZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBoaXN0b3J5ID0gW107XG5cdCAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcblx0ICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcblx0ICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcblx0ICAgICAgfSxcblx0ICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuXHQgICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcblx0ICAgICAgfSxcblx0ICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuXHQgICAgICB9LFxuXHQgICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuXHQgICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9O1xuXHR9O1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0ZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0ICB9XG5cdH07XG5cdHZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBtYXRjaGVycyA9IHtcblx0ICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuXHQgIH0sXG5cdCAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuXHQgICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcblx0ICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcblx0ICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuXHQgICAgfTtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcblx0ICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcblx0fVxuXHRcblx0LyoqXG5cdCAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3Ncblx0ICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcblx0ICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuXHQgIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcblx0ICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuXHQgIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG5cdCAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cdFxuXHQgIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuXHQgIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcblx0ICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG5cdCAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuXHQgIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuXHQqKi9cblx0ZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuXHQgIHZhciB0YXNrcyA9IFtdLFxuXHQgICAgICByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuXHQgIGFkZFRhc2sobWFpblRhc2spO1xuXHRcblx0ICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcblx0ICAgIGNhbmNlbEFsbCgpO1xuXHQgICAgY2IoZXJyLCB0cnVlKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuXHQgICAgdGFza3MucHVzaCh0YXNrKTtcblx0ICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG5cdCAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICBhYm9ydChyZXMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIGNiKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICB0LmNhbmNlbCgpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrcyA9IFtdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGFkZFRhc2s6IGFkZFRhc2ssXG5cdCAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcblx0ICAgIGFib3J0OiBhYm9ydCxcblx0ICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzO1xuXHQgICAgfSxcblx0ICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgICAgcmV0dXJuIHQubmFtZTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcblx0ICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgZm4gPSBfcmVmLmZuLFxuXHQgICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuXHQgICAgcmV0dXJuIGZuO1xuXHQgIH1cblx0XG5cdCAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgZXJyb3IgPSB2b2lkIDA7XG5cdCAgdHJ5IHtcblx0ICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgZXJyb3IgPSBlcnI7XG5cdCAgfVxuXHRcblx0ICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3Jcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuXHQgIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IGVycm9yO1xuXHQgIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYyA9IHZvaWQgMDtcblx0ICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG5cdCAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgIGlmICghcGMpIHtcblx0ICAgICAgICBwYyA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIGVmZjtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSgpKTtcblx0fVxuXHRcblx0dmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuXHQgIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcblx0ICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfTtcblx0ICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcblx0ICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuXHQgIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXHRcblx0ICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuXHQgIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0ICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG5cdCAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG5cdCAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cdFxuXHQgICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuXHQgICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuXHQgICAgfVxuXHRcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcblx0ICB9O1xuXHQgIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG5cdCAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcblx0ICAvKipcblx0ICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG5cdCAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuXHQgICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuXHQgICoqL1xuXHQgIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgIC8qKlxuXHQgICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuXHQgICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG5cdCAgKiovXG5cdCAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG5cdCAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuXHQgIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cdFxuXHQgIC8qKlxuXHQgICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcblx0ICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG5cdCAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cblx0ICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuXHQgICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG5cdCAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgLyoqXG5cdCAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG5cdCAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcblx0ICAgICoqL1xuXHQgICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuXHQgICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcblx0ICAgICAgKiovXG5cdCAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuXHQgICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cblx0ICAqKi9cblx0ICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cdFxuXHQgIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcblx0ICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblx0XG5cdCAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuXHQgIG5leHQoKTtcblx0XG5cdCAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG5cdCAgcmV0dXJuIHRhc2s7XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuXHQgICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG5cdCAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG5cdCAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3Jvbmdcblx0ICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuXHQgICAgfVxuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuXHQgICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcblx0ICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG5cdCAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbmV4dC5jYW5jZWwoKTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcblx0ICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcblx0ICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcblx0ICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0ICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG5cdCAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG5cdCAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG5cdCAgICBpZiAoIWlzRXJyKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcblx0ICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcblx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGFzay5jb250KSB7XG5cdCAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcblx0ICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcblx0ICAgIH1cblx0ICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG5cdCAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuXHQgICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcblx0ICAgIH0pO1xuXHQgICAgdGFzay5qb2luZXJzID0gbnVsbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG5cdCAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHQgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG5cdCAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG5cdCAgICAqKi9cblx0ICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXHRcblx0ICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG5cdCAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHQgICAgICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG5cdCAgICAgIH1cblx0ICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICB9XG5cdCAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcblx0ICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG5cdCAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuXHQgICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG5cdCAgICAgICoqL1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyKTtcblx0ICAgICAgfVxuXHQgICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdFxuXHQgICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuXHQgICAgfTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuXHQgICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cblx0ICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cblx0ICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuXHQgICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG5cdCAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuXHQgICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG5cdCAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG5cdCAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcblx0ICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3Rcblx0ICAgICoqL1xuXHQgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cdCAgICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3Rcblx0ICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblx0XG5cdCAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcblx0ICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcblx0ICAgICk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuXHQgICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuXHQgICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuXHQgICAgICB9O1xuXHQgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG5cdCAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuXHQgICAgfVxuXHQgICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcblx0ICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG5cdCAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG5cdCAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblx0XG5cdCAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuXHQgICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcblx0ICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuXHQgICAgfTtcblx0ICAgIHRyeSB7XG5cdCAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcblx0ICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG5cdCAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG5cdCAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcblx0ICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG5cdCAgICAqKi9cblx0ICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG5cdCAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG5cdCAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcblx0ICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNC5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblx0XG5cdCAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY1LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXHRcblx0ICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuXHQgICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cdFxuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuXHQgICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuXHQgICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG5cdCAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY2LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuXHQgICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cdFxuXHQgICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuXHQgICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXHRcblx0ICAgICAgaWYgKGRldGFjaGVkKSB7XG5cdCAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IGZpbmFsbHkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcblx0ICAgIH1cblx0ICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuXHQgICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcblx0ICAgICAgfTtcblx0ICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuXHQgICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG5cdCAgICB9XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcblx0ICAgIH1cblx0ICAgIGNiKCk7XG5cdCAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0XG5cdCAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciByZXN1bHRzID0ge307XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcblx0ICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG5cdCAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgdmFyIF9yZXNwb25zZTtcblx0XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuXHQgICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuXHQgICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG5cdCAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcblx0ICAgICAgY2Ioc3RhdGUpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcblx0ICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcblx0ICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcblx0ICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuXHQgICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG5cdCAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG5cdCAgICBjaGFubmVsLmZsdXNoKGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcblx0ICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgY2IoKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG5cdCAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblx0XG5cdCAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuXHQgICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuXHQgICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcblx0ICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG5cdCAgICAgIH1cblx0ICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcblx0ICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG5cdCAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuXHQgICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcblx0ICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG5cdCAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuXHQgICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc2FwID0gYXNhcDtcblx0ZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHR2YXIgcXVldWUgPSBbXTtcblx0LyoqXG5cdCAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuXHQgIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3Rcblx0ICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuXHQgIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG5cdCAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuXHQqKi9cblx0dmFyIHNlbWFwaG9yZSA9IDA7XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG5cdCAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG5cdCAgc3RhdGUpLlxuXHQqKi9cblx0ZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG5cdCAgdHJ5IHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIHRhc2soKTtcblx0ICB9IGZpbmFsbHkge1xuXHQgICAgcmVsZWFzZSgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG5cdCoqL1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICBxdWV1ZS5wdXNoKHRhc2spO1xuXHRcblx0ICBpZiAoIXNlbWFwaG9yZSkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgZmx1c2goKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG5cdCAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuXHQqKi9cblx0ZnVuY3Rpb24gc3VzcGVuZCgpIHtcblx0ICBzZW1hcGhvcmUrKztcblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG5cdCAgc2VtYXBob3JlLS07XG5cdH1cblx0XG5cdC8qKlxuXHQgIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICByZWxlYXNlKCk7XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwO1xuXHQgIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgZXhlYyh0YXNrKTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnRha2UgPSB0YWtlO1xuXHRleHBvcnRzLnB1dCA9IHB1dDtcblx0ZXhwb3J0cy5hbGwgPSBhbGw7XG5cdGV4cG9ydHMucmFjZSA9IHJhY2U7XG5cdGV4cG9ydHMuY2FsbCA9IGNhbGw7XG5cdGV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblx0ZXhwb3J0cy5jcHMgPSBjcHM7XG5cdGV4cG9ydHMuZm9yayA9IGZvcms7XG5cdGV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcblx0ZXhwb3J0cy5qb2luID0gam9pbjtcblx0ZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5cdGV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuXHRleHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuXHRleHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHRleHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuXHRleHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG5cdHZhciBUQUtFID0gJ1RBS0UnO1xuXHR2YXIgUFVUID0gJ1BVVCc7XG5cdHZhciBBTEwgPSAnQUxMJztcblx0dmFyIFJBQ0UgPSAnUkFDRSc7XG5cdHZhciBDQUxMID0gJ0NBTEwnO1xuXHR2YXIgQ1BTID0gJ0NQUyc7XG5cdHZhciBGT1JLID0gJ0ZPUksnO1xuXHR2YXIgSk9JTiA9ICdKT0lOJztcblx0dmFyIENBTkNFTCA9ICdDQU5DRUwnO1xuXHR2YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG5cdHZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG5cdHZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcblx0dmFyIEZMVVNIID0gJ0ZMVVNIJztcblx0dmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcblx0dmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblx0XG5cdHZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cdFxuXHR2YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcblx0fTtcblx0XG5cdHZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG5cdCAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gdGFrZSgpIHtcblx0ICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xuXHR9XG5cdFxuXHR0YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHR2YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXHRcblx0ZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgYWN0aW9uID0gY2hhbm5lbDtcblx0ICAgIGNoYW5uZWwgPSBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcblx0fVxuXHRcblx0cHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblx0XG5cdCAgdmFyIGNvbnRleHQgPSBudWxsO1xuXHQgIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG5cdCAgICB2YXIgX2ZuID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuWzBdO1xuXHQgICAgZm4gPSBfZm5bMV07XG5cdCAgfSBlbHNlIGlmIChmbi5mbikge1xuXHQgICAgdmFyIF9mbjIgPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG5cdCAgICBmbiA9IF9mbjIuZm47XG5cdCAgfVxuXHQgIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuXHQgICAgZm4gPSBjb250ZXh0W2ZuXTtcblx0ICB9XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHRcblx0ICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FsbChmbikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuXHQgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3BzKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHQgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmb3JrKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHQgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNwYXduKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuXHQgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGpvaW4oKSB7XG5cdCAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG5cdCAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBqb2luKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuXHQgICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gY2FuY2VsKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuXHQgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcblx0ICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG5cdCAgfVxuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcblx0KiovXG5cdGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcblx0ICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcblx0ICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuXHQgIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcblx0ICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuXHQgICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuXHQgICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHR2YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuXHQgICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcblx0ICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuXHQgIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuXHQgIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuXHQgIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG5cdCAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcblx0ICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcblx0ICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuXHQgIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG5cdCAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG5cdCAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG5cdCAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG5cdCAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG5cdCAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuXHQgIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuXHQgIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDUpO1xuXHRcblx0dmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblx0XG5cdHZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTApO1xuXHRcblx0dmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG5cdCAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG5cdH07XG5cdFxuXHR2YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG5cdHZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcblx0dmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXHRcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0ZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXHR2YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuICdjaGFubmVsJztcblx0ICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdCAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuXHQgICAgfSkpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXHRcblx0ICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG5cdCAgICAgIHFOZXh0ID0gcTA7XG5cdFxuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuXHQgICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG5cdCAgICAgIHJldHVybiBkb25lO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChlcnJvcikge1xuXHQgICAgICBxTmV4dCA9IHFFbmQ7XG5cdCAgICAgIHRocm93IGVycm9yO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblx0XG5cdCAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuXHQgICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG5cdCAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuXHQgICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblx0XG5cdCAgICAgIHFOZXh0ID0gcTtcblx0ICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG5cdCAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuXHQgIH0sIG5hbWUsIHRydWUpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0ZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcblx0ZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcblx0ZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5cdGV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHR2YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcblx0dmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcblx0ICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBlbWl0dGVyKCkge1xuXHQgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXHRcblx0ICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG5cdCAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuXHQgICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGFycltpXShpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0ICAgIGVtaXQ6IGVtaXRcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xuXHR2YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblx0XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2hhbm5lbCgpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cdFxuXHQgIHZhciBjbG9zZWQgPSBmYWxzZTtcblx0ICB2YXIgdGFrZXJzID0gW107XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXHRcblx0ICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcblx0ICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuXHQgICAgaWYgKGNsb3NlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuXHQgICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcblx0ICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHRha2UoY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihidWZmZXIudGFrZSgpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRha2Vycy5wdXNoKGNiKTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBmbHVzaChjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgaWYgKCFjbG9zZWQpIHtcblx0ICAgICAgY2xvc2VkID0gdHJ1ZTtcblx0ICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuXHQgICAgICAgIHRha2VycyA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICAgIGFycltpXShFTkQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBwdXQ6IHB1dCxcblx0ICAgIGZsdXNoOiBmbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZSxcblx0ICAgIGdldCBfX3Rha2Vyc19fKCkge1xuXHQgICAgICByZXR1cm4gdGFrZXJzO1xuXHQgICAgfSxcblx0ICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuXHQgICAgICByZXR1cm4gY2xvc2VkO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcblx0ICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblx0XG5cdCAgLyoqXG5cdCAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cblx0ICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuXHQgICoqL1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcblx0ICB9XG5cdFxuXHQgIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuXHQgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG5cdCAgICAgICAgdW5zdWJzY3JpYmUoKTtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLmNsb3NlKCk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG5cdCAgICAgIGNsb3NlKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjaGFuLnB1dChpbnB1dCk7XG5cdCAgfSk7XG5cdCAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgdW5zdWJzY3JpYmUoKTtcblx0ICB9XG5cdFxuXHQgIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IGNoYW4udGFrZSxcblx0ICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlXG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcblx0ICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG5cdCAgICAgICAgY2IoaW5wdXQpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG5cdCAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG5cdCAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4udGFrZShjYik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblx0XG5cdHZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG5cdHZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcblx0dmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcblx0dmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cdFxuXHR2YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXHRcblx0ZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcblx0ICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuXHQgIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG5cdCAgdmFyIGxlbmd0aCA9IDA7XG5cdCAgdmFyIHB1c2hJbmRleCA9IDA7XG5cdCAgdmFyIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG5cdCAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICBsZW5ndGgrKztcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgICBpZiAobGVuZ3RoICE9IDApIHtcblx0ICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcblx0ICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG5cdCAgICAgIGxlbmd0aC0tO1xuXHQgICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgIHJldHVybiBpdDtcblx0ICAgIH1cblx0ICB9O1xuXHRcblx0ICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHZhciBpdGVtcyA9IFtdO1xuXHQgICAgd2hpbGUgKGxlbmd0aCkge1xuXHQgICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlbXM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcblx0ICAgIH0sXG5cdCAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuXHQgICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcblx0ICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuXHQgICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcblx0ICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuXHQgICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXHRcblx0ICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXHRcblx0ICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcblx0ICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgLy8gRFJPUFxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBmbHVzaDogZmx1c2hcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcblx0ICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuXHQgICAgcmV0dXJuIHplcm9CdWZmZXI7XG5cdCAgfSxcblx0ICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG5cdCAgfSxcblx0ICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcblx0ICB9LFxuXHQgIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG5cdCAgfSxcblx0ICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDAsXG5cdCAgICAgIGFjdGlvbiA9IHZvaWQgMDtcblx0ICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuXHQgICAgcmV0dXJuIHRhc2sgPSB0O1xuXHQgIH07XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBjaGFubmVsID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG5cdCAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcblx0ICB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cdFxuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHQgIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9LFxuXHQgICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cdFxuXHRmdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG5cdCAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcblx0ICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0XG5cdCAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuXHQgICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG5cdCAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblx0XG5cdCAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcblx0ICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cdFxuXHQgICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcblx0ICAgICAgY29udGV4dDogY29udGV4dCxcblx0ICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuXHQgICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuXHQgICAgICBvbkVycm9yOiBvbkVycm9yXG5cdCAgICB9KTtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuXHQgICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcblx0ICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG5cdCAgfTtcblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VtO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnB1dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnJhY2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hcHBseTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jcHM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZvcms7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zcGF3bjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uam9pbjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2VsZWN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZsdXNoO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0ZXhwb3J0cy5yZWR1Y2VyID0gcmVkdWNlcjtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3B1bGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NSk7XG5cdFxuXHR2YXIgX3B1bGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHVsbCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzYpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdC8vIGluaXRpYWwgc3RhdGVcblx0dmFyIGluaXRpYWxTdGF0ZSA9IHtcblx0ICAgIHNlbGVjdEFsbDogdHJ1ZSxcblx0ICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgIGVycm9yOiBudWxsLFxuXHQgICAgdXNlcklkOiBudWxsLFxuXHQgICAgaXNfcmVzdHJpY3RlZDogZmFsc2UsXG5cdCAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgdXNlcl9wcm9qZWN0czogW10sXG5cdCAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuXHQgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVkdWNlcigpIHtcblx0ICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuXHQgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cdCAgICAgICAgY2FzZSBjLlNFVF9TVE9SRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBhY3Rpb24uZGF0YTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgZmV0Y2hpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX1NVQ0NFU1M6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfYWN0aW9uJGRhdGEgPSBhY3Rpb24uZGF0YSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyB8fCBbXSxcblx0ICAgICAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCB8fCBmYWxzZVxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9HRVRfRkFJTFVSRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfUFVUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzID0gYWN0aW9uLmRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IF91c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsXG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX1BVVF9GQUlMVVJFOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICB2YXIgbmV3U3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcblx0ICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGUuaXNfcmVzdHJpY3RlZCA9IHN0YXRlLm9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cyAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlLnVzZXJfcHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbF91c2VyX3Byb2plY3RzO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT046XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9qZWN0SWQgPSBhY3Rpb24uZGF0YS5wcm9qZWN0SWQ7XG5cdFxuXHQgICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsX3VzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMiA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgKDAsIF91dGlscy5pbkFycmF5KShwcm9qZWN0SWQsIF91c2VyX3Byb2plY3RzMikgPyAoMCwgX3B1bGwyLmRlZmF1bHQpKF91c2VyX3Byb2plY3RzMiwgcHJvamVjdElkKSA6IF91c2VyX3Byb2plY3RzMi5wdXNoKHByb2plY3RJZCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG9yaWdpbmFsX3VzZXJfcHJvamVjdHMsIHVzZXJfcHJvamVjdHM6IF91c2VyX3Byb2plY3RzMiB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuVVBEQVRFX0lTX1JFU1RSSUNURUQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpc19yZXN0cmljdGVkID0gYWN0aW9uLmRhdGEuaXNfcmVzdHJpY3RlZDtcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IHN0YXRlLmlzX3Jlc3RyaWN0ZWQgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX29yaWdpbmFsX3VzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMyA9IHZvaWQgMCxcblx0ICAgICAgICAgICAgICAgICAgICBfc3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUpLFxuXHQgICAgICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9zdGF0ZS5zZWxlY3RBbGw7XG5cdFxuXHQgICAgICAgICAgICAgICAgaWYgKHNlbGVjdEFsbCkge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuaWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IFtdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBfb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0czNcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VSZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTYpLFxuXHQgICAgcHVsbEFsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYzKTtcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG5cdCAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG5cdCAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cblx0ICpcblx0ICogKipOb3RlOioqIFVubGlrZSBgXy53aXRob3V0YCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLiBVc2UgYF8ucmVtb3ZlYFxuXHQgKiB0byByZW1vdmUgZWxlbWVudHMgZnJvbSBhbiBhcnJheSBieSBwcmVkaWNhdGUuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDIuMC4wXG5cdCAqIEBjYXRlZ29yeSBBcnJheVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuXHQgKlxuXHQgKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcblx0ICogY29uc29sZS5sb2coYXJyYXkpO1xuXHQgKiAvLyA9PiBbJ2InLCAnYiddXG5cdCAqL1xuXHR2YXIgcHVsbCA9IGJhc2VSZXN0KHB1bGxBbGwpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGlkZW50aXR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MzkpLFxuXHQgICAgb3ZlclJlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NyksXG5cdCAgICBzZXRUb1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzU5KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuXHQgIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFwcGx5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTgpO1xuXHRcblx0LyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xuXHR2YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cdFxuXHQvKipcblx0ICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcblx0ICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG5cdCAgICAgICAgaW5kZXggPSAtMSxcblx0ICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG5cdCAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXHRcblx0ICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG5cdCAgICB9XG5cdCAgICBpbmRleCA9IC0xO1xuXHQgICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG5cdCAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG5cdCAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcblx0ICAgIH1cblx0ICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuXHQgICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG5cdCAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cblx0ICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG5cdCAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuXHQgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcblx0ICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcblx0ICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcblx0ICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcblx0ICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVNldFRvU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjApLFxuXHQgICAgc2hvcnRPdXQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2Mik7XG5cdFxuXHQvKipcblx0ICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuXHQgKi9cblx0dmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY29uc3RhbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MSksXG5cdCAgICBkZWZpbmVQcm9wZXJ0eSA9IF9fd2VicGFja19yZXF1aXJlX18oMzI4KSxcblx0ICAgIGlkZW50aXR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MzkpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuXHQgKi9cblx0dmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG5cdCAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcblx0ICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuXHQgICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcblx0ICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG5cdCAgICAnd3JpdGFibGUnOiB0cnVlXG5cdCAgfSk7XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDIuNC4wXG5cdCAqIEBjYXRlZ29yeSBVdGlsXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG5cdCAqXG5cdCAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuXHQgKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cblx0ICpcblx0ICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG5cdCAqIC8vID0+IHRydWVcblx0ICovXG5cdGZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHZhbHVlO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG5cdHZhciBIT1RfQ09VTlQgPSA4MDAsXG5cdCAgICBIT1RfU1BBTiA9IDE2O1xuXHRcblx0LyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xuXHR2YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG5cdCAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuXHQgKiBtaWxsaXNlY29uZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG5cdCAgdmFyIGNvdW50ID0gMCxcblx0ICAgICAgbGFzdENhbGxlZCA9IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuXHQgICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cdFxuXHQgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuXHQgICAgaWYgKHJlbWFpbmluZyA+IDApIHtcblx0ICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG5cdCAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY291bnQgPSAwO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVB1bGxBbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NCk7XG5cdFxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5wdWxsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFuIGFycmF5IG9mIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqXG5cdCAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZWAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgNC4wLjBcblx0ICogQGNhdGVnb3J5IEFycmF5XG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcblx0ICpcblx0ICogXy5wdWxsQWxsKGFycmF5LCBbJ2EnLCAnYyddKTtcblx0ICogY29uc29sZS5sb2coYXJyYXkpO1xuXHQgKiAvLyA9PiBbJ2InLCAnYiddXG5cdCAqL1xuXHRmdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcblx0ICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcblx0ICAgID8gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcylcblx0ICAgIDogYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBhcnJheU1hcCA9IF9fd2VicGFja19yZXF1aXJlX18oNDM0KSxcblx0ICAgIGJhc2VJbmRleE9mID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjUpLFxuXHQgICAgYmFzZUluZGV4T2ZXaXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjkpLFxuXHQgICAgYmFzZVVuYXJ5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNTYpLFxuXHQgICAgY29weUFycmF5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzApO1xuXHRcblx0LyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuXHR2YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblx0XG5cdC8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xuXHR2YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG5cdCAqIHNob3J0aGFuZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcblx0ICB2YXIgaW5kZXhPZiA9IGNvbXBhcmF0b3IgPyBiYXNlSW5kZXhPZldpdGggOiBiYXNlSW5kZXhPZixcblx0ICAgICAgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcblx0ICAgICAgc2VlbiA9IGFycmF5O1xuXHRcblx0ICBpZiAoYXJyYXkgPT09IHZhbHVlcykge1xuXHQgICAgdmFsdWVzID0gY29weUFycmF5KHZhbHVlcyk7XG5cdCAgfVxuXHQgIGlmIChpdGVyYXRlZSkge1xuXHQgICAgc2VlbiA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcblx0ICB9XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIHZhciBmcm9tSW5kZXggPSAwLFxuXHQgICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcblx0ICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cdFxuXHQgICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG5cdCAgICAgIGlmIChzZWVuICE9PSBhcnJheSkge1xuXHQgICAgICAgIHNwbGljZS5jYWxsKHNlZW4sIGZyb21JbmRleCwgMSk7XG5cdCAgICAgIH1cblx0ICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGZyb21JbmRleCwgMSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEFsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlRmluZEluZGV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjYpLFxuXHQgICAgYmFzZUlzTmFOID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjcpLFxuXHQgICAgc3RyaWN0SW5kZXhPZiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY4KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG5cdCAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuXHQgICAgPyBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KVxuXHQgICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuXHQgKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcblx0ICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuXHQgICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXHRcblx0ICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuXHQgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcblx0ICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5kZXhPZmAgd2hpY2ggcGVyZm9ybXMgc3RyaWN0IGVxdWFsaXR5XG5cdCAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuXHQgIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG5cdCAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHN0cmljdEluZGV4T2Y7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBiYXNlSW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUluZGV4T2ZXaXRoKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSB7XG5cdCAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcblx0ICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2ZXaXRoO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cblx0ICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcblx0ICB2YXIgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblx0XG5cdCAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG5cdCAgfVxuXHQgIHJldHVybiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdGV4cG9ydHMuZ2V0SXNSZXN0cmljdGVkID0gZXhwb3J0cy5nZXRVc2VyUHJvamVjdHMgPSBleHBvcnRzLmdldFVzZXJJZCA9IHVuZGVmaW5lZDtcblx0ZXhwb3J0cy5mZXRjaERhdGEgPSBmZXRjaERhdGE7XG5cdGV4cG9ydHMucHV0RGF0YSA9IHB1dERhdGE7XG5cdGV4cG9ydHMuZ2V0U2FnYSA9IGdldFNhZ2E7XG5cdGV4cG9ydHMucHV0U2FnYSA9IHB1dFNhZ2E7XG5cdGV4cG9ydHMud2F0Y2hlclNhZ2EgPSB3YXRjaGVyU2FnYTtcblx0XG5cdF9fd2VicGFja19yZXF1aXJlX18oNzcyKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzUyKTtcblx0XG5cdHZhciBfYXhpb3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Myk7XG5cdFxuXHR2YXIgX2F4aW9zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F4aW9zKTtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMjQpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgX21hcmtlZCA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhnZXRTYWdhKSxcblx0ICAgIF9tYXJrZWQyID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKHB1dFNhZ2EpLFxuXHQgICAgX21hcmtlZDMgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsod2F0Y2hlclNhZ2EpOyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0Ly8gVGhpcyBpbXBvcnQgaXMgbmVjZXNzYXJ5IHRvIGJlIGFibGUgdG8gdGVzdCBzYWdhcy5cblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWR1eC1zYWdhL3JlZHV4LXNhZ2EvaXNzdWVzLzI4MCNpc3N1ZWNvbW1lbnQtMjkxMTMzMDIzXG5cdFxuXHRcblx0ZnVuY3Rpb24gY2FsbEF4aW9zKGNvbmZpZykge1xuXHQgICAgcmV0dXJuICgwLCBfYXhpb3MyLmRlZmF1bHQpKGNvbmZpZykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0ICAgICAgICByZXR1cm4geyByZXNwb25zZTogcmVzcG9uc2UgfTtcblx0ICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgICAgIHJldHVybiB7IGVycm9yOiBlcnJvciB9O1xuXHQgICAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZldGNoRGF0YSh1c2VySWQpIHtcblx0ICAgIHZhciBjb25maWcgPSB7XG5cdCAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuXHQgICAgICAgIHVybDogXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIHVzZXJJZCArIFwiL1wiXG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBwdXREYXRhKHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cykge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwicHV0XCIsXG5cdCAgICAgICAgaGVhZGVyczoge1xuXHQgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6ICgwLCBfdXRpbHMuZ2V0Q29va2llKShcImNzcmZ0b2tlblwiKVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdXJsOiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgdXNlcklkICsgXCIvXCIsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB7XG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBfcmVmLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGdldFNhZ2EkKF9jb250ZXh0KSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IGFjdGlvbi5kYXRhLnVzZXJJZDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKGZldGNoRGF0YSwgdXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9jb250ZXh0LnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xuXHR9XG5cdFxuXHR2YXIgZ2V0VXNlcklkID0gZXhwb3J0cy5nZXRVc2VySWQgPSBmdW5jdGlvbiBnZXRVc2VySWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VySWQ7XG5cdH07XG5cdHZhciBnZXRVc2VyUHJvamVjdHMgPSBleHBvcnRzLmdldFVzZXJQcm9qZWN0cyA9IGZ1bmN0aW9uIGdldFVzZXJQcm9qZWN0cyhzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLnVzZXJfcHJvamVjdHM7XG5cdH07XG5cdHZhciBnZXRJc1Jlc3RyaWN0ZWQgPSBleHBvcnRzLmdldElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIGdldElzUmVzdHJpY3RlZChzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBwdXRTYWdhKGFjdGlvbikge1xuXHQgICAgdmFyIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cywgX3JlZjIsIHJlc3BvbnNlLCBlcnJvcjtcblx0XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gcHV0U2FnYSQoX2NvbnRleHQyKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0SXNSZXN0cmljdGVkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTA7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJQcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKHB1dERhdGEsIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgICAgICBfcmVmMiA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX3JlZjIucmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBfcmVmMi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIxO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxOTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjE6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkMiwgdGhpcyk7XG5cdH1cblx0XG5cdC8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5cdGZ1bmN0aW9uIHdhdGNoZXJTYWdhKCkge1xuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIHdhdGNoZXJTYWdhJChfY29udGV4dDMpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDI7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA2OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gODtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQzLCB0aGlzKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG5cdCAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuXHQgKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqL1xuXHRcblx0IShmdW5jdGlvbihnbG9iYWwpIHtcblx0ICBcInVzZSBzdHJpY3RcIjtcblx0XG5cdCAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcblx0ICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG5cdCAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG5cdCAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcblx0ICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXHQgIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG5cdCAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblx0XG5cdCAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcblx0ICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG5cdCAgaWYgKHJ1bnRpbWUpIHtcblx0ICAgIGlmIChpbk1vZHVsZSkge1xuXHQgICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG5cdCAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG5cdCAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcblx0ICAgIH1cblx0ICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcblx0ICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cblx0ICAgIHJldHVybjtcblx0ICB9XG5cdFxuXHQgIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuXHQgIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cblx0ICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblx0XG5cdCAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuXHQgICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG5cdCAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcblx0ICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG5cdCAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblx0XG5cdCAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG5cdCAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG5cdCAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cdFxuXHQgICAgcmV0dXJuIGdlbmVyYXRvcjtcblx0ICB9XG5cdCAgcnVudGltZS53cmFwID0gd3JhcDtcblx0XG5cdCAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG5cdCAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG5cdCAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG5cdCAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuXHQgIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcblx0ICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG5cdCAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcblx0ICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcblx0ICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG5cdCAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuXHQgIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuXHQgICAgdHJ5IHtcblx0ICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuXHQgIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuXHQgIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG5cdCAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblx0XG5cdCAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuXHQgIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cblx0ICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXHRcblx0ICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcblx0ICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3Jcblx0ICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuXHQgIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXHRcblx0ICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG5cdCAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cblx0ICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblx0ICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHRcblx0ICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5cdCAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuXHQgIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuXHQgICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcblx0ICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuXHQgICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcblx0ICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cblx0ICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG5cdCAgfVxuXHRcblx0ICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuXHQgICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcblx0ICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuXHQgICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cdFxuXHQgIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG5cdCAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cblx0ICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG5cdCAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcblx0ICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcblx0ICAgICAgfTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG5cdCAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG5cdCAgICByZXR1cm4gY3RvclxuXHQgICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG5cdCAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuXHQgICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cblx0ICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcblx0ICAgICAgOiBmYWxzZTtcblx0ICB9O1xuXHRcblx0ICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcblx0ICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcblx0ICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuXHQgICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG5cdCAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuXHQgICAgcmV0dXJuIGdlbkZ1bjtcblx0ICB9O1xuXHRcblx0ICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cblx0ICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuXHQgIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcblx0ICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuXHQgIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcblx0ICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG5cdCAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuXHQgICAgICAgIGlmICh2YWx1ZSAmJlxuXHQgICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcblx0ICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuXHQgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuXHQgICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcblx0ICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuXHQgICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcblx0ICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG5cdCAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuXHQgICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuXHQgICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuXHQgICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG5cdCAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcblx0ICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG5cdCAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcblx0ICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcblx0ICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcblx0ICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuXHQgICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG5cdCAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG5cdCAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG5cdCAgICAgICAgfSwgcmVqZWN0KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cdFxuXHQgICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuXHQgICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuXHQgICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcblx0ICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcblx0ICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG5cdCAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cblx0ICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcblx0ICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuXHQgICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcblx0ICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuXHQgICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG5cdCAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcblx0ICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuXHQgICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cblx0ICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcblx0ICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuXHQgICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcblx0ICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cblx0ICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG5cdCAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcblx0ICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuXHQgICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcblx0ICB9XG5cdFxuXHQgIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cdCAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHQgIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cdFxuXHQgIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2Zcblx0ICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2Zcblx0ICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cblx0ICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcblx0ICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG5cdCAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG5cdCAgICApO1xuXHRcblx0ICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcblx0ICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cblx0ICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHQgICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG5cdCAgICAgICAgfSk7XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG5cdCAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXHRcblx0ICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcblx0ICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcblx0ICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIHRocm93IGFyZztcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG5cdCAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuXHQgICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IGFyZztcblx0XG5cdCAgICAgIHdoaWxlICh0cnVlKSB7XG5cdCAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcblx0ICAgICAgICBpZiAoZGVsZWdhdGUpIHtcblx0ICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXHQgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG5cdCAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG5cdCAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcblx0ICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuXHQgICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cblx0ICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcblx0ICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblx0ICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cdFxuXHQgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblx0ICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcblx0ICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cblx0ICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cblx0ICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG5cdCAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcblx0ICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXHRcblx0ICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG5cdCAgICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIHJldHVybiB7XG5cdCAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuXHQgICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcblx0ICAgICAgICAgIH07XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblx0ICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcblx0ICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcblx0ICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG5cdCAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG5cdCAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG5cdCAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuXHQgICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcblx0ICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcblx0ICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdFxuXHQgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcblx0ICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcblx0ICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cdFxuXHQgICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cblx0ICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG5cdCAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuXHQgICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXHRcblx0ICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cdFxuXHQgICAgaWYgKCEgaW5mbykge1xuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoaW5mby5kb25lKSB7XG5cdCAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG5cdCAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG5cdCAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXHRcblx0ICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuXHQgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXHRcblx0ICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG5cdCAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcblx0ICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cblx0ICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG5cdCAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG5cdCAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cblx0ICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgfVxuXHRcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cblx0ICAgICAgcmV0dXJuIGluZm87XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcblx0ICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG5cdCAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgIH1cblx0XG5cdCAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcblx0ICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG5cdCAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblx0XG5cdCAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblx0XG5cdCAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcblx0ICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuXHQgIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG5cdCAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG5cdCAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG5cdCAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHRcblx0ICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcblx0ICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cdFxuXHQgICAgaWYgKDEgaW4gbG9jcykge1xuXHQgICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKDIgaW4gbG9jcykge1xuXHQgICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcblx0ICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuXHQgICAgfVxuXHRcblx0ICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcblx0ICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuXHQgICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuXHQgICAgZGVsZXRlIHJlY29yZC5hcmc7XG5cdCAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuXHQgICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG5cdCAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG5cdCAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG5cdCAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuXHQgICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuXHQgICAgdGhpcy5yZXNldCh0cnVlKTtcblx0ICB9XG5cdFxuXHQgIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHQgICAgdmFyIGtleXMgPSBbXTtcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAga2V5cy5wdXNoKGtleSk7XG5cdCAgICB9XG5cdCAgICBrZXlzLnJldmVyc2UoKTtcblx0XG5cdCAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuXHQgICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cblx0ICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcblx0ICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuXHQgICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcblx0ICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcblx0ICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcblx0ICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG5cdCAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cdCAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgfTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcblx0ICAgIGlmIChpdGVyYWJsZSkge1xuXHQgICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG5cdCAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuXHQgICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmFibGU7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuXHQgICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG5cdCAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuXHQgICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cdFxuXHQgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgfTtcblx0XG5cdCAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG5cdCAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG5cdCAgfVxuXHQgIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXHRcblx0ICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuXHQgIH1cblx0XG5cdCAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG5cdCAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblx0XG5cdCAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuXHQgICAgICB0aGlzLnByZXYgPSAwO1xuXHQgICAgICB0aGlzLm5leHQgPSAwO1xuXHQgICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuXHQgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuXHQgICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuXHQgICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcblx0ICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cdFxuXHQgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXHRcblx0ICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG5cdCAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG5cdCAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuXHQgICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuXHQgICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG5cdCAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuXHQgICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBzdG9wOiBmdW5jdGlvbigpIHtcblx0ICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblx0XG5cdCAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG5cdCAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG5cdCAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gdGhpcy5ydmFsO1xuXHQgICAgfSxcblx0XG5cdCAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG5cdCAgICAgIGlmICh0aGlzLmRvbmUpIHtcblx0ICAgICAgICB0aHJvdyBleGNlcHRpb247XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcblx0ICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG5cdCAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG5cdCAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcblx0ICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cdFxuXHQgICAgICAgIGlmIChjYXVnaHQpIHtcblx0ICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG5cdCAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblx0XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcblx0ICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG5cdCAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cblx0ICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG5cdCAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcblx0ICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuXHQgICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXHRcblx0ICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuXHQgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuXHQgICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG5cdCAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuXHQgICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuXHQgICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcblx0ICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG5cdCAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG5cdCAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuXHQgICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuXHQgICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG5cdCAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cdFxuXHQgICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG5cdCAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcblx0ICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcblx0ICAgIH0sXG5cdFxuXHQgICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuXHQgICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuXHQgICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG5cdCAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuXHQgICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG5cdCAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcblx0ICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9LFxuXHRcblx0ICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcblx0ICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuXHQgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG5cdCAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblx0ICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuXHQgICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIHJldHVybiB0aHJvd247XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cblx0ICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG5cdCAgICB9LFxuXHRcblx0ICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG5cdCAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG5cdCAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG5cdCAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcblx0ICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG5cdCAgICAgIH07XG5cdFxuXHQgICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG5cdCAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3Rcblx0ICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG5cdCAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHQgIH07XG5cdH0pKFxuXHQgIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG5cdCAgLy8gRnVuY3Rpb24gY29uc3RydWN0b3IgaWYgd2UncmUgaW4gZ2xvYmFsIHN0cmljdCBtb2RlLiBUaGF0IGlzIHNhZGx5IGEgZm9ybVxuXHQgIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG5cdCAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0dmFyIEF4aW9zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzgpO1xuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuXHQgIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuXHQgIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXHRcblx0ICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG5cdCAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblx0XG5cdCAgcmV0dXJuIGluc3RhbmNlO1xuXHR9XG5cdFxuXHQvLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcblx0dmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXHRcblx0Ly8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5cdGF4aW9zLkF4aW9zID0gQXhpb3M7XG5cdFxuXHQvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5cdGF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuXHQgIHJldHVybiBjcmVhdGVJbnN0YW5jZSh1dGlscy5tZXJnZShkZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcblx0fTtcblx0XG5cdC8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuXHRheGlvcy5DYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Nik7XG5cdGF4aW9zLkNhbmNlbFRva2VuID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRheGlvcy5pc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0XG5cdC8vIEV4cG9zZSBhbGwvc3ByZWFkXG5cdGF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuXHQgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdH07XG5cdGF4aW9zLnNwcmVhZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cdFxuXHQvLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcblx0bW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBpc0J1ZmZlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzc3KTtcblx0XG5cdC8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXHRcblx0Ly8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3Ncblx0XG5cdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuXHQgIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcblx0ICB2YXIgcmVzdWx0O1xuXHQgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcblx0ICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG5cdCAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0RhdGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2Jcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG5cdCAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcblx0fVxuXHRcblx0LyoqXG5cdCAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmltKHN0cikge1xuXHQgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcblx0ICpcblx0ICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cblx0ICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuXHQgKlxuXHQgKiB3ZWIgd29ya2Vyczpcblx0ICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG5cdCAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG5cdCAqXG5cdCAqIHJlYWN0LW5hdGl2ZTpcblx0ICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICByZXR1cm4gKFxuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcblx0ICApO1xuXHR9XG5cdFxuXHQvKipcblx0ICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3Npbmdcblx0ICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cblx0ICovXG5cdGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuXHQgIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuXHQgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdFxuXHQgIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuXHQgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBvYmogPSBbb2JqXTtcblx0ICB9XG5cdFxuXHQgIGlmIChpc0FycmF5KG9iaikpIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcblx0ICAgIH1cblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG5cdCAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuXHQgKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cblx0ICpcblx0ICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cblx0ICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuXHQgKlxuXHQgKiBFeGFtcGxlOlxuXHQgKlxuXHQgKiBgYGBqc1xuXHQgKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG5cdCAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuXHQgKi9cblx0ZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG5cdCAgdmFyIHJlc3VsdCA9IHt9O1xuXHQgIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuXHQgICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cblx0ICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG5cdCAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcblx0ICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGFba2V5XSA9IHZhbDtcblx0ICAgIH1cblx0ICB9KTtcblx0ICByZXR1cm4gYTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgaXNBcnJheTogaXNBcnJheSxcblx0ICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuXHQgIGlzQnVmZmVyOiBpc0J1ZmZlcixcblx0ICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuXHQgIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcblx0ICBpc1N0cmluZzogaXNTdHJpbmcsXG5cdCAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuXHQgIGlzT2JqZWN0OiBpc09iamVjdCxcblx0ICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG5cdCAgaXNEYXRlOiBpc0RhdGUsXG5cdCAgaXNGaWxlOiBpc0ZpbGUsXG5cdCAgaXNCbG9iOiBpc0Jsb2IsXG5cdCAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcblx0ICBpc1N0cmVhbTogaXNTdHJlYW0sXG5cdCAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuXHQgIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcblx0ICBmb3JFYWNoOiBmb3JFYWNoLFxuXHQgIG1lcmdlOiBtZXJnZSxcblx0ICBleHRlbmQ6IGV4dGVuZCxcblx0ICB0cmltOiB0cmltXG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcblx0ICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIVxuXHQgKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG5cdCAqXG5cdCAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG5cdCAqIEBsaWNlbnNlICBNSVRcblx0ICovXG5cdFxuXHQvLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG5cdC8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG5cdCAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG5cdH1cblx0XG5cdC8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5cdGZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG5cdH1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTApO1xuXHR2YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTEpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdGZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG5cdCAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuXHQgIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuXHQgICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuXHQgICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuXHQgIH07XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhIHJlcXVlc3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG5cdCAqL1xuXHRBeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuXHQgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuXHQgICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuXHQgICAgICB1cmw6IGFyZ3VtZW50c1swXVxuXHQgICAgfSwgYXJndW1lbnRzWzFdKTtcblx0ICB9XG5cdFxuXHQgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cdCAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblx0XG5cdCAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuXHQgIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG5cdCAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG5cdCAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuXHQgIH0pO1xuXHRcblx0ICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuXHQgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXHRcblx0Ly8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG5cdHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsLFxuXHQgICAgICBkYXRhOiBkYXRhXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApO1xuXHRcblx0dmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuXHQgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG5cdCAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcblx0ICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcblx0ICB2YXIgYWRhcHRlcjtcblx0ICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9XG5cdCAgcmV0dXJuIGFkYXB0ZXI7XG5cdH1cblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0ICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG5cdCAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuXHQgICAgKSB7XG5cdCAgICAgIHJldHVybiBkYXRhO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG5cdCAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuXHQgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcblx0ICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGRhdGE7XG5cdCAgfV0sXG5cdFxuXHQgIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICAvKipcblx0ICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcblx0ICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuXHQgICAqL1xuXHQgIHRpbWVvdXQ6IDAsXG5cdFxuXHQgIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG5cdCAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXHRcblx0ICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblx0XG5cdCAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuXHQgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuXHQgIH1cblx0fTtcblx0XG5cdGRlZmF1bHRzLmhlYWRlcnMgPSB7XG5cdCAgY29tbW9uOiB7XG5cdCAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcblx0ICB9XG5cdH07XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcblx0ICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcblx0ICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcblx0ICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHNldHRsZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgyKTtcblx0dmFyIGJ1aWxkVVJMID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHR2YXIgcGFyc2VIZWFkZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODYpO1xuXHR2YXIgaXNVUkxTYW1lT3JpZ2luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODcpO1xuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdHZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuXHQgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcblx0ICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXHRcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuXHQgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0ICAgIHZhciBsb2FkRXZlbnQgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcblx0ICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cdFxuXHQgICAgLy8gRm9yIElFIDgvOSBDT1JTIHN1cHBvcnRcblx0ICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG5cdCAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmXG5cdCAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuXHQgICAgICAgICFpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpIHtcblx0ICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcblx0ICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG5cdCAgICAgIHhEb21haW4gPSB0cnVlO1xuXHQgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuXHQgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG5cdCAgICBpZiAoY29uZmlnLmF1dGgpIHtcblx0ICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG5cdCAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuXHQgICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuXHQgICAgfVxuXHRcblx0ICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cdFxuXHQgICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcblx0ICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXHRcblx0ICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcblx0ICAgIHJlcXVlc3RbbG9hZEV2ZW50XSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG5cdCAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG5cdCAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG5cdCAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG5cdCAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3Rcblx0ICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuXHQgICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG5cdCAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdCAgICAgIHZhciByZXNwb25zZSA9IHtcblx0ICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG5cdCAgICAgICAgLy8gSUUgc2VuZHMgMTIyMyBpbnN0ZWFkIG9mIDIwNCAoaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy8yMDEpXG5cdCAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuXHQgICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuXHQgICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcblx0ICAgICAgICBjb25maWc6IGNvbmZpZyxcblx0ICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG5cdCAgICAgIH07XG5cdFxuXHQgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG5cdCAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcblx0ICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG5cdCAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEhhbmRsZSB0aW1lb3V0XG5cdCAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG5cdCAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuXHQgICAgICAgIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuXHQgICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG5cdCAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXHQgICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcblx0ICAgICAgdmFyIGNvb2tpZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OSk7XG5cdFxuXHQgICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cblx0ICAgICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcblx0ICAgICAgICAgIHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIGlmICh4c3JmVmFsdWUpIHtcblx0ICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3Rcblx0ICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuXHQgICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG5cdCAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG5cdCAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3Rcblx0ICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cdCAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuXHQgICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG5cdCAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cblx0ICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG5cdCAgICAgICAgICB0aHJvdyBlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcblx0ICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuXHQgICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG5cdCAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcblx0ICAgICAgICBpZiAoIXJlcXVlc3QpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcblx0ICAgICAgICByZWplY3QoY2FuY2VsKTtcblx0ICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG5cdCAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuXHQgIH0pO1xuXHR9O1xuXHRcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBjcmVhdGVFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgzKTtcblx0XG5cdC8qKlxuXHQgKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuXHQgIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcblx0ICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3Rcblx0ICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuXHQgICAgcmVzb2x2ZShyZXNwb25zZSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlamVjdChjcmVhdGVFcnJvcihcblx0ICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcblx0ICAgICAgcmVzcG9uc2UuY29uZmlnLFxuXHQgICAgICBudWxsLFxuXHQgICAgICByZXNwb25zZS5yZXF1ZXN0LFxuXHQgICAgICByZXNwb25zZVxuXHQgICAgKSk7XG5cdCAgfVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGVuaGFuY2VFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzg0KTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0ICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcblx0ICBpZiAoY29kZSkge1xuXHQgICAgZXJyb3IuY29kZSA9IGNvZGU7XG5cdCAgfVxuXHQgIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuXHQgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG5cdCAgcmV0dXJuIGVycm9yO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuXHQgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cblx0ICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cblx0ICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cblx0ICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuXHQgICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuXHQgICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG5cdCAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG5cdCAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgaWYgKCFwYXJhbXMpIHtcblx0ICAgIHJldHVybiB1cmw7XG5cdCAgfVxuXHRcblx0ICB2YXIgc2VyaWFsaXplZFBhcmFtcztcblx0ICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcblx0ICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgdmFyIHBhcnRzID0gW107XG5cdFxuXHQgICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuXHQgICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG5cdCAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YWwgPSBbdmFsXTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuXHQgICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcblx0ICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuXHQgICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuXHQgIH1cblx0XG5cdCAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcblx0ICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcblx0ICB9XG5cdFxuXHQgIHJldHVybiB1cmw7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHQvLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuXHQvLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5cdHZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcblx0ICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuXHQgICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcblx0ICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG5cdCAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcblx0XTtcblx0XG5cdC8qKlxuXHQgKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG5cdCAqXG5cdCAqIGBgYFxuXHQgKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuXHQgKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cblx0ICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuXHQgKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuXHQgIHZhciBwYXJzZWQgPSB7fTtcblx0ICB2YXIga2V5O1xuXHQgIHZhciB2YWw7XG5cdCAgdmFyIGk7XG5cdFxuXHQgIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cdFxuXHQgIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG5cdCAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG5cdCAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXHRcblx0ICAgIGlmIChrZXkpIHtcblx0ICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuXHQgICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBwYXJzZWQ7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IChcblx0ICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblx0XG5cdCAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG5cdCAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG5cdCAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0ICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0ICAgIHZhciBvcmlnaW5VUkw7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG5cdCAgICAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAgICAqL1xuXHQgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcblx0ICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cdFxuXHQgICAgICBpZiAobXNpZSkge1xuXHQgICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcblx0ICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblx0ICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdFxuXHQgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcblx0ICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG5cdCAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG5cdCAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuXHQgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG5cdCAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuXHQgICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG5cdCAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdFxuXHQgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG5cdCAgICAqXG5cdCAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuXHQgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAgICAqL1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG5cdCAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG5cdCAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcblx0ICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5cdCAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfTtcblx0ICB9KSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvLyBidG9hIHBvbHlmaWxsIGZvciBJRTwxMCBjb3VydGVzeSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcblx0XG5cdHZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cdFxuXHRmdW5jdGlvbiBFKCkge1xuXHQgIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xuXHR9XG5cdEUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuXHRFLnByb3RvdHlwZS5jb2RlID0gNTtcblx0RS5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXHRcblx0ZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuXHQgIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpO1xuXHQgIHZhciBvdXRwdXQgPSAnJztcblx0ICBmb3IgKFxuXHQgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcblx0ICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuXHQgICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuXHQgICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcblx0ICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcblx0ICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG5cdCAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuXHQgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG5cdCAgKSB7XG5cdCAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGlkeCArPSAzIC8gNCk7XG5cdCAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG5cdCAgICAgIHRocm93IG5ldyBFKCk7XG5cdCAgICB9XG5cdCAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcblx0ICB9XG5cdCAgcmV0dXJuIG91dHB1dDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBidG9hO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG5cdCAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuXHQgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcblx0ICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuXHQgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG5cdCAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9KSgpIDpcblx0XG5cdCAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG5cdCAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuXHQgIHRoaXMuaGFuZGxlcnMgPSBbXTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG5cdCAgdGhpcy5oYW5kbGVycy5wdXNoKHtcblx0ICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuXHQgICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG5cdCAgfSk7XG5cdCAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG5cdCAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG5cdCAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG5cdCAqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG5cdCAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuXHQgIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuXHQgICAgaWYgKGggIT09IG51bGwpIHtcblx0ICAgICAgZm4oaCk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHRyYW5zZm9ybURhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Mik7XG5cdHZhciBpc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHR2YXIgaXNBYnNvbHV0ZVVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk0KTtcblx0dmFyIGNvbWJpbmVVUkxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTUpO1xuXHRcblx0LyoqXG5cdCAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuXHQgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3Rcblx0ICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG5cdCAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG5cdCAgaWYgKGNvbmZpZy5iYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKGNvbmZpZy51cmwpKSB7XG5cdCAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuXHQgIH1cblx0XG5cdCAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3Rcblx0ICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXHRcblx0ICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG5cdCAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgY29uZmlnLmRhdGEsXG5cdCAgICBjb25maWcuaGVhZGVycyxcblx0ICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG5cdCAgKTtcblx0XG5cdCAgLy8gRmxhdHRlbiBoZWFkZXJzXG5cdCAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcblx0ICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuXHQgICAgY29uZmlnLmhlYWRlcnMgfHwge31cblx0ICApO1xuXHRcblx0ICB1dGlscy5mb3JFYWNoKFxuXHQgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG5cdCAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcblx0ICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG5cdCAgICB9XG5cdCAgKTtcblx0XG5cdCAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXHRcblx0ICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuXHQgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgICAgcmVzcG9uc2UuZGF0YSxcblx0ICAgICAgcmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICApO1xuXHRcblx0ICAgIHJldHVybiByZXNwb25zZTtcblx0ICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG5cdCAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcblx0ICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblx0ICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcblx0ICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcblx0ICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuXHQgICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICAgICAgKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0LyoqXG5cdCAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2Vcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG5cdCAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcblx0ICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcblx0ICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIGRhdGE7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG5cdCAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG5cdCAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuXHQgIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuXHQgIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuXHQgIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG5cdCAgcmV0dXJuIHJlbGF0aXZlVVJMXG5cdCAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuXHQgICAgOiBiYXNlVVJMO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG5cdH07XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuXHQgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcblx0ICB9XG5cdFxuXHQgIHZhciByZXNvbHZlUHJvbWlzZTtcblx0ICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuXHQgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuXHQgIH0pO1xuXHRcblx0ICB2YXIgdG9rZW4gPSB0aGlzO1xuXHQgIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG5cdCAgICBpZiAodG9rZW4ucmVhc29uKSB7XG5cdCAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdFxuXHQgICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcblx0ICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG5cdCAgfSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0Q2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuXHQgIGlmICh0aGlzLnJlYXNvbikge1xuXHQgICAgdGhyb3cgdGhpcy5yZWFzb247XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcblx0ICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cblx0ICovXG5cdENhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcblx0ICB2YXIgY2FuY2VsO1xuXHQgIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG5cdCAgICBjYW5jZWwgPSBjO1xuXHQgIH0pO1xuXHQgIHJldHVybiB7XG5cdCAgICB0b2tlbjogdG9rZW4sXG5cdCAgICBjYW5jZWw6IGNhbmNlbFxuXHQgIH07XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG5cdCAqXG5cdCAqICBgYGBqc1xuXHQgKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuXHQgKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG5cdCAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHQgKiAgYGBgXG5cdCAqXG5cdCAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuXHQgIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuXHQgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KVxuXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuaW1wb3J0IEFwcCBmcm9tIFwiLi9jb21wb25lbnRzL0FwcFwiO1xuXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21wb3NlIH0gZnJvbSBcInJlZHV4XCI7XG5pbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcInJlZHV4LXNhZ2FcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5cbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tIFwiLi9yZWR1Y2VyXCI7XG5pbXBvcnQgeyB3YXRjaGVyU2FnYSB9IGZyb20gXCIuL3NhZ2FzXCI7XG5cbi8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5jb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKCk7XG5cbi8vIGRldiB0b29scyBtaWRkbGV3YXJlXG5jb25zdCByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblxubGV0IHN0b3JlO1xuaWYgKHJlZHV4RGV2VG9vbHMpIHtcbiAgICBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGNvbXBvc2UoYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSwgcmVkdXhEZXZUb29scykpO1xufSBlbHNlIHtcbiAgICBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpO1xufVxuXG5zYWdhTWlkZGxld2FyZS5ydW4od2F0Y2hlclNhZ2EpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgICAgICAgICAgPEFwcCAvPlxuICAgICAgICA8L1Byb3ZpZGVyPixcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIilcbiAgICApO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCIvKlxuICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IHsgXywgZGF0YUZyb21FbGVtZW50LCBpbkFycmF5IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4uL2NvbnN0XCI7XG5cbmNvbnN0IElzUmVzdHJpY3RlZCA9ICh7IF8sIGlzX3Jlc3RyaWN0ZWQsIG9uQ2hhbmdlSXNSZXN0cmljdGVkIH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJpc19yZXN0cmljdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgey8qIFRoZSBzdHJpbmdzIGluY2x1ZGUgPHN0cm9uZz4gdGFncyB3aGljaCByZXF1aXJlcyB0aGUgdXNlIG9mXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICovfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IGlzX3Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB7aXNfcmVzdHJpY3RlZCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlc3RyaWN0ZWRJbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBfKFwicmVzdHJpY3RlZF9pbmZvXCIpIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jb25zdCBQcm9qZWN0ID0gKHsgXywgcHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgfSkgPT4ge1xuICAgIC8vIE5PVEU6IHRoZSBjaGVja2VkIHZhbHVlIGlzIHNldCB0byB0cnVlIGlmIGlzX3Jlc3RyaWN0ZWQgaXMgZmFsc2UuIFRoaXMgaXMgc28gdGhhdCB0aGUgbGlzdCBvZlxuICAgIC8vIHByb2plY3RzIGxvb2tzIGxpa2UgYWxsIHByb2plY3RzIGFyZSBzZWxlY3RlZCB3aGVuIHJlc3RyaWN0aW9ucyBhcmUgbm90IGluIGZvcmNlLlxuICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cbiAgICBjb25zdCBjaGVja2VkID0gIWlzX3Jlc3RyaWN0ZWQgfHwgKHVzZXJfcHJvamVjdHMgJiYgaW5BcnJheShwcm9qZWN0LmlkLCB1c2VyX3Byb2plY3RzKSksXG4gICAgICAgIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG4gICAgICAgIHByb2plY3RTZWxlY3RlZCA9IGNoZWNrZWQgPyBcIiBwcm9qZWN0U2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG4gICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0clxuICAgICAgICAgICAga2V5PXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17dHJDbGFzc05hbWV9XG4gICAgICAgID5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtpZENsYXNzTmFtZX0+e3Byb2plY3QuaWR9PC90ZD5cbiAgICAgICAgICAgIDx0ZD57cHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIil9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICApO1xufTtcblxuY29uc3QgU2VsZWN0QWxsID0gKHsgXywgc2VsZWN0QWxsLCBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGlzX3Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgY2xhc3NOYW1lID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIik7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2lzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCJ9PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9IGRpc2FibGVkPXtkaXNhYmxlZH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHtzZWxlY3RBbGwgPyBfKFwiY2hlY2tfYWxsX3Byb2plY3RzXCIpIDogXyhcInVuY2hlY2tfYWxsX3Byb2plY3RzXCIpfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5jb25zdCBFcnJvciA9ICh7IF8sIGVycm9yIH0pID0+IHtcbiAgICByZXR1cm4gZXJyb3IgPyA8ZGl2IGNsYXNzTmFtZT1cImVycm9yXCI+e18oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZX08L2Rpdj4gOiBudWxsO1xufTtcblxuY29uc3QgUHJvamVjdHMgPSAoe1xuICAgIF8sXG4gICAgZXJyb3IsXG4gICAgYWxsX3Byb2plY3RzLFxuICAgIHVzZXJfcHJvamVjdHMsXG4gICAgaXNfcmVzdHJpY3RlZCxcbiAgICBzZWxlY3RBbGwsXG4gICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG59KSA9PiB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8RXJyb3IgXz17X30gZXJyb3I9e2Vycm9yfSAvPlxuICAgICAgICAgICAgPElzUmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17b25DaGFuZ2VJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFNlbGVjdEFsbFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwiYWNjZXNzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwicHJvamVjdF9pZFwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcInByb2plY3RfdGl0bGVcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge2FsbF9wcm9qZWN0cy5tYXAoKHByb2plY3QpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQcm9qZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdD17cHJvamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzPXt1c2VyX3Byb2plY3RzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e29uQ2hhbmdlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkID0gdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fID0gdGhpcy5fLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNsYXRpb24gaGFuZGxpbmdcbiAgICBfKHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc3RyaW5ncyAmJiB0aGlzLnByb3BzLnN0cmluZ3Nbc107XG4gICAgfVxuXG4gICAgdG9nZ2xlSXNSZXN0cmljdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZUlzUmVzdHJpY3RlZChlLnRhcmdldC5jaGVja2VkKTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCB1c2VySWQgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXByb2plY3RzLXRleHRcIik7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBzdHJpbmdzIH0pO1xuXG4gICAgICAgIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIGFsbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cywgZXJyb3IgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBhbGxfcHJvamVjdHMgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzPXthbGxfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cz17dXNlcl9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17dGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXt0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXY+e18oXCJsb2FkaW5nXCIpfTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBmZXRjaGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFsbF9wcm9qZWN0cyxcbiAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICB1c2VyX3Byb2plY3RzLFxuICAgICAgICBzdHJpbmdzXG4gICAgfSA9IHN0YXRlO1xuICAgIHJldHVybiB7IGZldGNoaW5nLCBlcnJvciwgYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHMsIHN0cmluZ3MgfTtcbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xuICAgIHJldHVybiB7IG9uRmV0Y2hVc2VyUHJvamVjdHM6IHVzZXJJZCA9PiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5BUElfR0VUX0lOSVQsXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQgfVxuICAgICAgICAgICAgfSksIHNldFN0b3JlOiBkYXRhID0+IGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9KSwgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBwcm9qZWN0SWQgPT4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkIH1cbiAgICAgICAgICAgIH0pLCBvblVwZGF0ZUlzUmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCA9PiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzX3Jlc3RyaWN0ZWQgfVxuICAgICAgICAgICAgfSksIG9uVXBkYXRlU2VsZWN0QWxsOiAoKSA9PiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgfSkgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb21wb25lbnRzL0FwcC5qc3giLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi4vbXktcmVzdWx0cy9zdG9yZVwiO1xuXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBpZCA9PiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHtpZH0vP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGNvbnN0IGluQXJyYXkgPSAob2JqLCBhcnIpID0+IGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblxuZXhwb3J0IGNvbnN0IGRhdGFGcm9tRWxlbWVudCA9IGVsZW1lbnROYW1lID0+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkuaW5uZXJIVE1MKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy91dGlscy5qcyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gYWN0aW9uIHR5cGVzXG5leHBvcnQgY29uc3QgLy9cbiAgICBTRVRfU1RPUkUgPSBcIlNFVF9TVE9SRVwiLFxuICAgIC8vXG4gICAgQVBJX0dFVF9JTklUID0gXCJBUElfR0VUX0lOSVRcIixcbiAgICBBUElfR0VUX1NVQ0NFU1MgPSBcIkFQSV9HRVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBBUElfUFVUX0lOSVQgPSBcIkFQSV9QVVRfSU5JVFwiLFxuICAgIEFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG4gICAgQVBJX1BVVF9GQUlMVVJFID0gXCJBUElfUFVUX0ZBSUxVUkVcIixcbiAgICAvL1xuICAgIFVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG4gICAgVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG4gICAgVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb25zdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudXRpbHMgPSBleHBvcnRzLmVmZmVjdHMgPSBleHBvcnRzLmRldGFjaCA9IGV4cG9ydHMuQ0FOQ0VMID0gZXhwb3J0cy5kZWxheSA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IGV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuY2hhbm5lbCA9IGV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXhwb3J0cy5FTkQgPSBleHBvcnRzLnJ1blNhZ2EgPSB1bmRlZmluZWQ7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3J1blNhZ2EnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdydW5TYWdhJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3J1blNhZ2EucnVuU2FnYTtcbiAgfVxufSk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2NoYW5uZWwnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcbiAgfVxufSk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2J1ZmZlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdidWZmZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2J1ZmZlcnMuYnVmZmVycztcbiAgfVxufSk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9zYWdhSGVscGVycycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlRXZlcnk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50aHJvdHRsZTtcbiAgfVxufSk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC91dGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlbGF5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlbGF5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0FOQ0VMJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLkNBTkNFTDtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RldGFjaCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5kZXRhY2g7XG4gIH1cbn0pO1xuXG52YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9taWRkbGV3YXJlJyk7XG5cbnZhciBfbWlkZGxld2FyZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWlkZGxld2FyZSk7XG5cbnZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2VmZmVjdHMnKTtcblxudmFyIGVmZmVjdHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2VmZmVjdHMpO1xuXG52YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciB1dGlscyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX21pZGRsZXdhcmUyLmRlZmF1bHQ7XG5leHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucnVuU2FnYSA9IHJ1blNhZ2E7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9wcm9jJyk7XG5cbnZhciBfcHJvYzIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvYyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBSVU5fU0FHQV9TSUdOQVRVUkUgPSAncnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSwgLi4uYXJncyknO1xudmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cbmZ1bmN0aW9uIHJ1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgaXRlcmF0b3IgPSB2b2lkIDA7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICgwLCBfdXRpbHMubG9nKSgnd2FybicsICdydW5TYWdhKGl0ZXJhdG9yLCBzdG9yZUludGVyZmFjZSkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgUlVOX1NBR0FfU0lHTkFUVVJFKTtcbiAgICB9XG4gICAgaXRlcmF0b3IgPSBzdG9yZUludGVyZmFjZTtcbiAgICBzdG9yZUludGVyZmFjZSA9IHNhZ2E7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2FnYSwgX3V0aWxzLmlzLmZ1bmMsIE5PTl9HRU5FUkFUT1JfRVJSKTtcbiAgICBpdGVyYXRvciA9IHNhZ2EuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG4gIH1cblxuICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG4gICAgICBzdWJzY3JpYmUgPSBfc3RvcmVJbnRlcmZhY2Uuc3Vic2NyaWJlLFxuICAgICAgZGlzcGF0Y2ggPSBfc3RvcmVJbnRlcmZhY2UuZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcbiAgICAgIGNvbnRleHQgPSBfc3RvcmVJbnRlcmZhY2UuY29udGV4dCxcbiAgICAgIHNhZ2FNb25pdG9yID0gX3N0b3JlSW50ZXJmYWNlLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBfc3RvcmVJbnRlcmZhY2Uub25FcnJvcjtcblxuXG4gIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXG4gIGlmIChzYWdhTW9uaXRvcikge1xuICAgIC8vIG1vbml0b3JzIGFyZSBleHBlY3RlZCB0byBoYXZlIGEgY2VydGFpbiBpbnRlcmZhY2UsIGxldCdzIGZpbGwtaW4gYW55IG1pc3Npbmcgb25lc1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkID0gc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXG4gICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCByb290OiB0cnVlLCBwYXJlbnRFZmZlY3RJZDogMCwgZWZmZWN0OiB7IHJvb3Q6IHRydWUsIHNhZ2E6IHNhZ2EsIGFyZ3M6IGFyZ3MgfSB9KTtcbiAgfVxuXG4gIHZhciB0YXNrID0gKDAsIF9wcm9jMi5kZWZhdWx0KShpdGVyYXRvciwgc3Vic2NyaWJlLCAoMCwgX3V0aWxzLndyYXBTYWdhRGlzcGF0Y2gpKGRpc3BhdGNoKSwgZ2V0U3RhdGUsIGNvbnRleHQsIHsgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLCBsb2dnZXI6IGxvZ2dlciwgb25FcnJvcjogb25FcnJvciB9LCBlZmZlY3RJZCwgc2FnYS5uYW1lKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgdGFzayk7XG4gIH1cblxuICByZXR1cm4gdGFzaztcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcnVuU2FnYS5qc1xuLy8gbW9kdWxlIGlkID0gNzM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmNoZWNrID0gY2hlY2s7XG5leHBvcnRzLmhhc093biA9IGhhc093bjtcbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuZXhwb3J0cy5hcnJheU9mRGVmZmVyZWQgPSBhcnJheU9mRGVmZmVyZWQ7XG5leHBvcnRzLmRlbGF5ID0gZGVsYXk7XG5leHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5leHBvcnRzLmF1dG9JbmMgPSBhdXRvSW5jO1xuZXhwb3J0cy5tYWtlSXRlcmF0b3IgPSBtYWtlSXRlcmF0b3I7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZGVwcmVjYXRlID0gZGVwcmVjYXRlO1xudmFyIHN5bSA9IGV4cG9ydHMuc3ltID0gZnVuY3Rpb24gc3ltKGlkKSB7XG4gIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcbn07XG5cbnZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xudmFyIEhFTFBFUiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkhFTFBFUiA9IHN5bSgnSEVMUEVSJyk7XG52YXIgTUFUQ0ggPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5NQVRDSCA9IHN5bSgnTUFUQ0gnKTtcbnZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG52YXIgU0FHQV9BQ1RJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TQUdBX0FDVElPTiA9IHN5bSgnU0FHQV9BQ1RJT04nKTtcbnZhciBTRUxGX0NBTkNFTExBVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNFTEZfQ0FOQ0VMTEFUSU9OID0gc3ltKCdTRUxGX0NBTkNFTExBVElPTicpO1xudmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdjtcbiAgfTtcbn07XG52YXIga1RydWUgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rVHJ1ZSA9IGtvbnN0KHRydWUpO1xudmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcbnZhciBub29wID0gZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xudmFyIGlkZW50ID0gZXhwb3J0cy5pZGVudCA9IGZ1bmN0aW9uIGlkZW50KHYpIHtcbiAgcmV0dXJuIHY7XG59O1xuXG5mdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuICBpZiAoIXByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0IGNoZWNrJywgZXJyb3IpO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093bihvYmplY3QsIHByb3BlcnR5KSB7XG4gIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG59XG5cbnZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG4gIHVuZGVmOiBmdW5jdGlvbiB1bmRlZih2KSB7XG4gICAgcmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkO1xuICB9LFxuICBub3RVbmRlZjogZnVuY3Rpb24gbm90VW5kZWYodikge1xuICAgIHJldHVybiB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgZnVuYzogZnVuY3Rpb24gZnVuYyhmKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmID09PSAnZnVuY3Rpb24nO1xuICB9LFxuICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcihuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJztcbiAgfSxcbiAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIGFycmF5OiBBcnJheS5pc0FycmF5LFxuICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG4gIH0sXG4gIHByb21pc2U6IGZ1bmN0aW9uIHByb21pc2UocCkge1xuICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcbiAgfSxcbiAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG4gIH0sXG4gIGl0ZXJhYmxlOiBmdW5jdGlvbiBpdGVyYWJsZShpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuICB9LFxuICB0YXNrOiBmdW5jdGlvbiB0YXNrKHQpIHtcbiAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuICB9LFxuICBvYnNlcnZhYmxlOiBmdW5jdGlvbiBvYnNlcnZhYmxlKG9iKSB7XG4gICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcbiAgfSxcbiAgYnVmZmVyOiBmdW5jdGlvbiBidWZmZXIoYnVmKSB7XG4gICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuICB9LFxuICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKHBhdCkge1xuICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuICB9LFxuICBjaGFubmVsOiBmdW5jdGlvbiBjaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG4gIH0sXG4gIGhlbHBlcjogZnVuY3Rpb24gaGVscGVyKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG4gIH0sXG4gIHN0cmluZ2FibGVGdW5jOiBmdW5jdGlvbiBzdHJpbmdhYmxlRnVuYyhmKSB7XG4gICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuICB9XG59O1xuXG52YXIgb2JqZWN0ID0gZXhwb3J0cy5vYmplY3QgPSB7XG4gIGFzc2lnbjogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChoYXNPd24oc291cmNlLCBpKSkge1xuICAgICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbnZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG4gIGZyb206IGZ1bmN0aW9uIGZyb20ob2JqKSB7XG4gICAgdmFyIGFyciA9IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duKG9iaiwgaSkpIHtcbiAgICAgICAgYXJyW2ldID0gb2JqW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZlcnJlZCgpIHtcbiAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZGVmLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuICBkZWYucHJvbWlzZSA9IHByb21pc2U7XG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuICB2YXIgdGltZW91dElkID0gdm9pZCAwO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh2YWwpO1xuICAgIH0sIG1zKTtcbiAgfSk7XG5cbiAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgfTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1Rhc2soKSB7XG4gIHZhciBfcmVmO1xuXG4gIHZhciBydW5uaW5nID0gdHJ1ZTtcbiAgdmFyIF9yZXN1bHQgPSB2b2lkIDAsXG4gICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cbiAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltUQVNLXSA9IHRydWUsIF9yZWYuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgIHJldHVybiBydW5uaW5nO1xuICB9LCBfcmVmLnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gX3Jlc3VsdDtcbiAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgIHJldHVybiBfZXJyb3I7XG4gIH0sIF9yZWYuc2V0UnVubmluZyA9IGZ1bmN0aW9uIHNldFJ1bm5pbmcoYikge1xuICAgIHJldHVybiBydW5uaW5nID0gYjtcbiAgfSwgX3JlZi5zZXRSZXN1bHQgPSBmdW5jdGlvbiBzZXRSZXN1bHQocikge1xuICAgIHJldHVybiBfcmVzdWx0ID0gcjtcbiAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcbiAgICByZXR1cm4gX2Vycm9yID0gZTtcbiAgfSwgX3JlZjtcbn1cblxuZnVuY3Rpb24gYXV0b0luYygpIHtcbiAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKytzZWVkO1xuICB9O1xufVxuXG52YXIgdWlkID0gLyojX19QVVJFX18qL2V4cG9ydHMudWlkID0gYXV0b0luYygpO1xuXG52YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuICB0aHJvdyBlcnI7XG59O1xudmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xufTtcbmZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG4gIHZhciB0aHJvID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBrVGhyb3c7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXG4gIHZhciBpdGVyYXRvciA9IHsgbmFtZTogbmFtZSwgbmV4dDogbmV4dCwgdGhyb3c6IHRocm8sIHJldHVybjoga1JldHVybiB9O1xuXG4gIGlmIChpc0hlbHBlcikge1xuICAgIGl0ZXJhdG9yW0hFTFBFUl0gPSB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbi8qKlxuICBQcmludCBlcnJvciBpbiBhIHVzZWZ1bCB3YXkgd2hldGhlciBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAgKHdpdGggZXhwYW5kYWJsZSBlcnJvciBzdGFjayB0cmFjZXMpLCBvciBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnRcbiAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuICoqL1xuZnVuY3Rpb24gbG9nKGxldmVsLCBtZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc29sZS5sb2coJ3JlZHV4LXNhZ2EgJyArIGxldmVsICsgJzogJyArIG1lc3NhZ2UgKyAnXFxuJyArIChlcnJvciAmJiBlcnJvci5zdGFjayB8fCBlcnJvcikpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXByZWNhdGUoZm4sIGRlcHJlY2F0aW9uV2FybmluZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcbiAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG52YXIgdXBkYXRlSW5jZW50aXZlID0gZXhwb3J0cy51cGRhdGVJbmNlbnRpdmUgPSBmdW5jdGlvbiB1cGRhdGVJbmNlbnRpdmUoZGVwcmVjYXRlZCwgcHJlZmVycmVkKSB7XG4gIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG59O1xuXG52YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ1xcbiAgcmVkdXgtc2FnYTogRXJyb3IgY2hlY2tpbmcgaG9va3MgZGV0ZWN0ZWQgYW4gaW5jb25zaXN0ZW50IHN0YXRlLiBUaGlzIGlzIGxpa2VseSBhIGJ1Z1xcbiAgaW4gcmVkdXgtc2FnYSBjb2RlIGFuZCBub3QgeW91cnMuIFRoYW5rcyBmb3IgcmVwb3J0aW5nIHRoaXMgaW4gdGhlIHByb2plY3RcXCdzIGdpdGh1YiByZXBvLlxcbiAgRXJyb3I6ICcgKyBlcnIgKyAnXFxuJyk7XG59O1xuXG52YXIgY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBleHBvcnRzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZnVuY3Rpb24gY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcoY3R4LCBwcm9wcykge1xuICByZXR1cm4gKGN0eCA/IGN0eCArICcuJyA6ICcnKSArICdzZXRDb250ZXh0KHByb3BzKTogYXJndW1lbnQgJyArIHByb3BzICsgJyBpcyBub3QgYSBwbGFpbiBvYmplY3QnO1xufTtcblxudmFyIHdyYXBTYWdhRGlzcGF0Y2ggPSBleHBvcnRzLndyYXBTYWdhRGlzcGF0Y2ggPSBmdW5jdGlvbiB3cmFwU2FnYURpc3BhdGNoKGRpc3BhdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhY3Rpb24sIFNBR0FfQUNUSU9OLCB7IHZhbHVlOiB0cnVlIH0pKTtcbiAgfTtcbn07XG5cbnZhciBjbG9uZWFibGVHZW5lcmF0b3IgPSBleHBvcnRzLmNsb25lYWJsZUdlbmVyYXRvciA9IGZ1bmN0aW9uIGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGhpc3RvcnkgPSBbXTtcbiAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcbiAgICAgICAgcmV0dXJuIGdlbi5uZXh0KGFyZyk7XG4gICAgICB9LFxuICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgICB2YXIgY2xvbmVkR2VuID0gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmVkR2VuO1xuICAgICAgfSxcbiAgICAgIHJldHVybjogZnVuY3Rpb24gX3JldHVybih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZ2VuLnJldHVybih2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgdGhyb3c6IGZ1bmN0aW9uIF90aHJvdyhleGNlcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdlbi50aHJvdyhleGNlcHRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVEFTS19DQU5DRUwgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gcHJvYztcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxuZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblxudmFyIE5PVF9JVEVSQVRPUl9FUlJPUiA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gJ3Byb2MgZmlyc3QgYXJndW1lbnQgKFNhZ2EgZnVuY3Rpb24gcmVzdWx0KSBtdXN0IGJlIGFuIGl0ZXJhdG9yJztcblxudmFyIENIQU5ORUxfRU5EID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IHtcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbiAgfVxufTtcbnZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9UQVNLX0NBTkNFTCc7XG4gIH1cbn07XG5cbnZhciBtYXRjaGVycyA9IHtcbiAgd2lsZGNhcmQ6IGZ1bmN0aW9uIHdpbGRjYXJkKCkge1xuICAgIHJldHVybiBfdXRpbHMua1RydWU7XG4gIH0sXG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIF9kZWZhdWx0KHBhdHRlcm4pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXR0ZXJuKSkgPT09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcbiAgICB9IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gU3RyaW5nKHBhdHRlcm4pO1xuICAgIH07XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbiBhcnJheShwYXR0ZXJucykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBwYXR0ZXJucy5zb21lKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVyKHApKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0sXG4gIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gX3ByZWRpY2F0ZShpbnB1dCk7XG4gICAgfTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWF0Y2hlcihwYXR0ZXJuKSB7XG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcbn1cblxuLyoqXG4gIFVzZWQgdG8gdHJhY2sgYSBwYXJlbnQgdGFzayBhbmQgaXRzIGZvcmtzXG4gIEluIHRoZSBuZXcgZm9yayBtb2RlbCwgZm9ya2VkIHRhc2tzIGFyZSBhdHRhY2hlZCBieSBkZWZhdWx0IHRvIHRoZWlyIHBhcmVudFxuICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuICBtYWluIHRhc2sgaXMgdGhlIG1haW4gZmxvdyBvZiB0aGUgY3VycmVudCBHZW5lcmF0b3IsIHRoZSBwYXJlbnQgdGFza3MgaXMgdGhlXG4gIGFnZ3JlZ2F0aW9uIG9mIHRoZSBtYWluIHRhc2tzICsgYWxsIGl0cyBmb3JrZWQgdGFza3MuXG4gIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG4gIGxpbmVhciBleGVjdXRpb24gdHJlZSBpbiBzZXF1ZW50aWFsIChub24gcGFyYWxsZWwpIHByb2dyYW1taW5nKVxuXG4gIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuICAtIEl0IGNvbXBsZXRlcyBpZiBhbGwgaXRzIGZvcmtzIGVpdGhlciBjb21wbGV0ZSBvciBhbGwgY2FuY2VsbGVkXG4gIC0gSWYgaXQncyBjYW5jZWxsZWQsIGFsbCBmb3JrcyBhcmUgY2FuY2VsbGVkIGFzIHdlbGxcbiAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuICAtIElmIGl0IGNvbXBsZXRlcywgdGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgb25lIHJldHVybmVkIGJ5IHRoZSBtYWluIHRhc2tcbioqL1xuZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuICB2YXIgdGFza3MgPSBbXSxcbiAgICAgIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuICBhZGRUYXNrKG1haW5UYXNrKTtcblxuICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcbiAgICBjYW5jZWxBbGwoKTtcbiAgICBjYihlcnIsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFzayh0YXNrKSB7XG4gICAgdGFza3MucHVzaCh0YXNrKTtcbiAgICB0YXNrLmNvbnQgPSBmdW5jdGlvbiAocmVzLCBpc0Vycikge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG4gICAgICB0YXNrLmNvbnQgPSBfdXRpbHMubm9vcDtcbiAgICAgIGlmIChpc0Vycikge1xuICAgICAgICBhYm9ydChyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2sgPT09IG1haW5UYXNrKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyB0YXNrLmNvbnQuY2FuY2VsID0gdGFzay5jYW5jZWxcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcbiAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgdGFza3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgdC5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICB0LmNhbmNlbCgpO1xuICAgIH0pO1xuICAgIHRhc2tzID0gW107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZFRhc2s6IGFkZFRhc2ssXG4gICAgY2FuY2VsQWxsOiBjYW5jZWxBbGwsXG4gICAgYWJvcnQ6IGFib3J0LFxuICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcbiAgICAgIHJldHVybiB0YXNrcztcbiAgICB9LFxuICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuICAgICAgcmV0dXJuIHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYXNrSXRlcmF0b3IoX3JlZikge1xuICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcbiAgICAgIGZuID0gX3JlZi5mbixcbiAgICAgIGFyZ3MgPSBfcmVmLmFyZ3M7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihmbikpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTIgYW5kICM0NDFcbiAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGVycm9yID0gdm9pZCAwO1xuICB0cnkge1xuICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvciA9IGVycjtcbiAgfVxuXG4gIC8vIGkuZS4gYSBnZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJucyBhbiBpdGVyYXRvclxuICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gZG8gbm90IGJ1YmJsZSB1cCBzeW5jaHJvbm91cyBmYWlsdXJlcyBmb3IgZGV0YWNoZWQgZm9ya3NcbiAgLy8gaW5zdGVhZCBjcmVhdGUgYSBmYWlsZWQgdGFzay4gU2VlICMxNTIgYW5kICM0NDFcbiAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSkgOiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYyA9IHZvaWQgMDtcbiAgICB2YXIgZWZmID0geyBkb25lOiBmYWxzZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgIHZhciByZXQgPSBmdW5jdGlvbiByZXQodmFsdWUpIHtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgIGlmICghcGMpIHtcbiAgICAgICAgcGMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZWZmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJldChhcmcpO1xuICAgICAgfVxuICAgIH07XG4gIH0oKSk7XG59XG5cbnZhciB3cmFwSGVscGVyID0gZnVuY3Rpb24gd3JhcEhlbHBlcihoZWxwZXIpIHtcbiAgcmV0dXJuIHsgZm46IGhlbHBlciB9O1xufTtcblxuZnVuY3Rpb24gcHJvYyhpdGVyYXRvcikge1xuICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF91dGlscy5ub29wO1xuICB9O1xuICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuICB2YXIgZ2V0U3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IF91dGlscy5ub29wO1xuICB2YXIgcGFyZW50Q29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcbiAgdmFyIHBhcmVudEVmZmVjdElkID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiAwO1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogJ2Fub255bW91cyc7XG4gIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PVF9JVEVSQVRPUl9FUlJPUik7XG5cbiAgdmFyIGVmZmVjdHNTdHJpbmcgPSAnWy4uLmVmZmVjdHNdJztcbiAgdmFyIHJ1blBhcmFsbGVsRWZmZWN0ID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHJ1bkFsbEVmZmVjdCwgKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKGVmZmVjdHNTdHJpbmcsICdhbGwoJyArIGVmZmVjdHNTdHJpbmcgKyAnKScpKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG4gIHZhciBsb2cgPSBsb2dnZXIgfHwgX3V0aWxzLmxvZztcbiAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBlcnIuc2FnYVN0YWNrO1xuXG4gICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuICAgICAgbWVzc2FnZSA9IGVyci5zdGFjay5zcGxpdCgnXFxuJylbMF0uaW5kZXhPZihlcnIubWVzc2FnZSkgIT09IC0xID8gZXJyLnN0YWNrIDogJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UgKyAnXFxuJyArIGVyci5zdGFjaztcbiAgICB9XG5cbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0ICcgKyBuYW1lLCBtZXNzYWdlIHx8IGVyci5tZXNzYWdlIHx8IGVycik7XG4gIH07XG4gIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG4gIHZhciB0YXNrQ29udGV4dCA9IE9iamVjdC5jcmVhdGUocGFyZW50Q29udGV4dCk7XG4gIC8qKlxuICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG4gICAgRWFjaCB0aW1lIHRoZSBnZW5lcmF0b3IgcHJvZ3Jlc3Nlcy4gY2FsbGluZyBydW5FZmZlY3Qgd2lsbCBzZXQgYSBuZXcgdmFsdWVcbiAgICBvbiBpdC4gSXQgYWxsb3dzIHByb3BhZ2F0aW5nIGNhbmNlbGxhdGlvbiB0byBjaGlsZCBlZmZlY3RzXG4gICoqL1xuICBuZXh0LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gIC8qKlxuICAgIENyZWF0ZXMgYSBuZXcgdGFzayBkZXNjcmlwdG9yIGZvciB0aGlzIGdlbmVyYXRvciwgV2UnbGwgYWxzbyBjcmVhdGUgYSBtYWluIHRhc2tcbiAgICB0byB0cmFjayB0aGUgbWFpbiBmbG93IChiZXNpZGVzIG90aGVyIGZvcmtlZCB0YXNrcylcbiAgKiovXG4gIHZhciB0YXNrID0gbmV3VGFzayhwYXJlbnRFZmZlY3RJZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpO1xuICB2YXIgbWFpblRhc2sgPSB7IG5hbWU6IG5hbWUsIGNhbmNlbDogY2FuY2VsTWFpbiwgaXNSdW5uaW5nOiB0cnVlIH07XG4gIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cbiAgLyoqXG4gICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWxNYWluKCkge1xuICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICBuZXh0KFRBU0tfQ0FOQ0VMKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBUaGlzIG1heSBiZSBjYWxsZWQgYnkgYSBwYXJlbnQgZ2VuZXJhdG9yIHRvIHRyaWdnZXIvcHJvcGFnYXRlIGNhbmNlbGxhdGlvblxuICAgIGNhbmNlbCBhbGwgcGVuZGluZyB0YXNrcyAoaW5jbHVkaW5nIHRoZSBtYWluIHRhc2spLCB0aGVuIGVuZCB0aGUgY3VycmVudCB0YXNrLlxuICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuICAgIEl0J3MgYWxzbyBwcm9wYWdhdGVkIHRvIGFsbCBqb2luZXJzIG9mIHRoaXMgdGFzayBhbmQgdGhlaXIgZXhlY3V0aW9uIHRyZWUvam9pbmVyc1xuICAgICBDYW5jZWxsYXRpb24gaXMgbm9vcCBmb3IgdGVybWluYXRlZC9DYW5jZWxsZWQgdGFza3MgdGFza3NcbiAgKiovXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAvKipcbiAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG4gICAgICBUYXNrcyBjYW4gYmUgQ2FuY2VsbGVkIGJ1dCBzdGlsbCBSdW5uaW5nXG4gICAgKiovXG4gICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuICAgICAgaXRlcmF0b3IuX2lzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIHRhc2tRdWV1ZS5jYW5jZWxBbGwoKTtcbiAgICAgIC8qKlxuICAgICAgICBFbmRpbmcgd2l0aCBhIE5ldmVyIHJlc3VsdCB3aWxsIHByb3BhZ2F0ZSB0aGUgQ2FuY2VsbGF0aW9uIHRvIGFsbCBqb2luZXJzXG4gICAgICAqKi9cbiAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgIGF0dGFjaGVzIGNhbmNlbGxhdGlvbiBsb2dpYyB0byB0aGlzIHRhc2sncyBjb250aW51YXRpb25cbiAgICB0aGlzIHdpbGwgcGVybWl0IGNhbmNlbGxhdGlvbiB0byBwcm9wYWdhdGUgZG93biB0aGUgY2FsbCBjaGFpblxuICAqKi9cbiAgY29udCAmJiAoY29udC5jYW5jZWwgPSBjYW5jZWwpO1xuXG4gIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcbiAgaXRlcmF0b3IuX2lzUnVubmluZyA9IHRydWU7XG5cbiAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuICBuZXh0KCk7XG5cbiAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG4gIHJldHVybiB0YXNrO1xuXG4gIC8qKlxuICAgIFRoaXMgaXMgdGhlIGdlbmVyYXRvciBkcml2ZXJcbiAgICBJdCdzIGEgcmVjdXJzaXZlIGFzeW5jL2NvbnRpbnVhdGlvbiBmdW5jdGlvbiB3aGljaCBjYWxscyBpdHNlbGZcbiAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG4gICoqL1xuICBmdW5jdGlvbiBuZXh0KGFyZywgaXNFcnIpIHtcbiAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3JvbmdcbiAgICBpZiAoIW1haW5UYXNrLmlzUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gcmVzdW1lIGFuIGFscmVhZHkgZmluaXNoZWQgZ2VuZXJhdG9yJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IudGhyb3coYXJnKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAvKipcbiAgICAgICAgICBnZXR0aW5nIFRBU0tfQ0FOQ0VMIGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgbWFpbiB0YXNrXG4gICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcbiAgICAgICAgICAgLSBCeSBjYW5jZWxsaW5nIHRoZSBwYXJlbnQgdGFzayBtYW51YWxseVxuICAgICAgICAgIC0gQnkgam9pbmluZyBhIENhbmNlbGxlZCB0YXNrXG4gICAgICAgICoqL1xuICAgICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG4gICAgICAgICoqL1xuICAgICAgICBuZXh0LmNhbmNlbCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICBJZiB0aGlzIEdlbmVyYXRvciBoYXMgYSBgcmV0dXJuYCBtZXRob2QgdGhlbiBpbnZva2VzIGl0XG4gICAgICAgICAgVGhpcyB3aWxsIGp1bXAgdG8gdGhlIGZpbmFsbHkgYmxvY2tcbiAgICAgICAgKiovXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oVEFTS19DQU5DRUwpIDogeyBkb25lOiB0cnVlLCB2YWx1ZTogVEFTS19DQU5DRUwgfTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBDSEFOTkVMX0VORCkge1xuICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcbiAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybigpIDogeyBkb25lOiB0cnVlIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcbiAgICAgICAgcnVuRWZmZWN0KHJlc3VsdC52YWx1ZSwgcGFyZW50RWZmZWN0SWQsICcnLCBuZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgIFRoaXMgR2VuZXJhdG9yIGhhcyBlbmRlZCwgdGVybWluYXRlIHRoZSBtYWluIHRhc2sgYW5kIG5vdGlmeSB0aGUgZm9yayBxdWV1ZVxuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuICAgICAgICBtYWluVGFzay5jb250ICYmIG1haW5UYXNrLmNvbnQocmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKG1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIG1haW5UYXNrLmNvbnQoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG4gICAgaXRlcmF0b3IuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHN0ZENoYW5uZWwuY2xvc2UoKTtcbiAgICBpZiAoIWlzRXJyKSB7XG4gICAgICBpdGVyYXRvci5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCAnc2FnYVN0YWNrJywge1xuICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRhc2suY29udCkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgJiYgb25FcnJvcikge1xuICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dFcnJvcihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5fZXJyb3IgPSByZXN1bHQ7XG4gICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVqZWN0KHJlc3VsdCk7XG4gICAgfVxuICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG4gICAgdGFzay5qb2luZXJzLmZvckVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgIHJldHVybiBqLmNiKHJlc3VsdCwgaXNFcnIpO1xuICAgIH0pO1xuICAgIHRhc2suam9pbmVycyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5FZmZlY3QoZWZmZWN0LCBwYXJlbnRFZmZlY3RJZCkge1xuICAgIHZhciBsYWJlbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXG4gICAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG4gICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cbiAgICAvKipcbiAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG4gICAgICBXZSBjYW4ndCBjYW5jZWwgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG4gICAgICBBbmQgV2UgY2FuJ3QgY29tcGxldGUgYW4gYWxyZWFkeSBjYW5jZWxsZWQgZWZmZWN0SWRcbiAgICAqKi9cbiAgICB2YXIgZWZmZWN0U2V0dGxlZCA9IHZvaWQgMDtcblxuICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG4gICAgZnVuY3Rpb24gY3VyckNiKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICBjYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcbiAgICAgIGlmIChzYWdhTW9uaXRvcikge1xuICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG4gICAgICB9XG4gICAgICBjYihyZXMsIGlzRXJyKTtcbiAgICB9XG4gICAgLy8gdHJhY2tzIGRvd24gdGhlIGN1cnJlbnQgY2FuY2VsXG4gICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gICAgLy8gc2V0dXAgY2FuY2VsbGF0aW9uIGxvZ2ljIG9uIHRoZSBwYXJlbnQgY2JcbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcbiAgICAgIC8qKlxuICAgICAgICBwcm9wYWdhdGVzIGNhbmNlbCBkb3dud2FyZFxuICAgICAgICBjYXRjaCB1bmNhdWdodCBjYW5jZWxsYXRpb25zIGVycm9yczsgc2luY2Ugd2UgY2FuIG5vIGxvbmdlciBjYWxsIHRoZSBjb21wbGV0aW9uXG4gICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG4gICAgICAqKi9cbiAgICAgIHRyeSB7XG4gICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsb2dFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXG4gICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgIGVhY2ggZWZmZWN0IHJ1bm5lciBtdXN0IGF0dGFjaCBpdHMgb3duIGxvZ2ljIG9mIGNhbmNlbGxhdGlvbiB0byB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgIGl0IGFsbG93cyB0aGlzIGdlbmVyYXRvciB0byBwcm9wYWdhdGUgY2FuY2VsbGF0aW9uIGRvd253YXJkLlxuICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cbiAgICAgIEFuZCB0aGUgc2V0dXAgbXVzdCBvY2N1ciBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2tcbiAgICAgICBUaGlzIGlzIGEgc29ydCBvZiBpbnZlcnNpb24gb2YgY29udHJvbDogY2FsbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgcmVzcG9uc2libGVcbiAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuICAgICAgYXJlIHJlc3BvbnNpYmxlIGZvciBhYm9ydGluZyB0aGUgY3VycmVudCBmbG93IGJ5IGNhbGxpbmcgdGhlIGF0dGFjaGVkIGNhbmNlbCBmdW5jdGlvblxuICAgICAgIExpYnJhcnkgdXNlcnMgY2FuIGF0dGFjaCB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHByb21pc2VzIGJ5IGRlZmluaW5nIGFcbiAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcbiAgICAgIEFUVEVOVElPTiEgY2FsbGluZyBjYW5jZWwgbXVzdCBoYXZlIG5vIGVmZmVjdCBvbiBhbiBhbHJlYWR5IGNvbXBsZXRlZCBvciBjYW5jZWxsZWQgZWZmZWN0XG4gICAgKiovXG4gICAgdmFyIGRhdGEgPSB2b2lkIDA7XG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgcmV0dXJuIChcbiAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3RcbiAgICAgIF91dGlscy5pcy5wcm9taXNlKGVmZmVjdCkgPyByZXNvbHZlUHJvbWlzZShlZmZlY3QsIGN1cnJDYikgOiBfdXRpbHMuaXMuaGVscGVyKGVmZmVjdCkgPyBydW5Gb3JrRWZmZWN0KHdyYXBIZWxwZXIoZWZmZWN0KSwgZWZmZWN0SWQsIGN1cnJDYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IoZWZmZWN0KSA/IHJlc29sdmVJdGVyYXRvcihlZmZlY3QsIGVmZmVjdElkLCBuYW1lLCBjdXJyQ2IpXG5cbiAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcbiAgICAgIDogX3V0aWxzLmlzLmFycmF5KGVmZmVjdCkgPyBydW5QYXJhbGxlbEVmZmVjdChlZmZlY3QsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QudGFrZShlZmZlY3QpKSA/IHJ1blRha2VFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnB1dChlZmZlY3QpKSA/IHJ1blB1dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWxsKGVmZmVjdCkpID8gcnVuQWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucmFjZShlZmZlY3QpKSA/IHJ1blJhY2VFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYWxsKGVmZmVjdCkpID8gcnVuQ2FsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNwcyhlZmZlY3QpKSA/IHJ1bkNQU0VmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZm9yayhlZmZlY3QpKSA/IHJ1bkZvcmtFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5qb2luKGVmZmVjdCkpID8gcnVuSm9pbkVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsKGVmZmVjdCkpID8gcnVuQ2FuY2VsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZWxlY3QoZWZmZWN0KSkgPyBydW5TZWxlY3RFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFjdGlvbkNoYW5uZWwoZWZmZWN0KSkgPyBydW5DaGFubmVsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mbHVzaChlZmZlY3QpKSA/IHJ1bkZsdXNoRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWxsZWQoZWZmZWN0KSkgPyBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmdldENvbnRleHQoZWZmZWN0KSkgPyBydW5HZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuU2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogLyogYW55dGhpbmcgZWxzZSByZXR1cm5lZCBhcyBpcyAqL2N1cnJDYihlZmZlY3QpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGNiKSB7XG4gICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuICAgIGlmIChfdXRpbHMuaXMuZnVuYyhjYW5jZWxQcm9taXNlKSkge1xuICAgICAgY2IuY2FuY2VsID0gY2FuY2VsUHJvbWlzZTtcbiAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG4gICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmFib3J0KCk7XG4gICAgICB9O1xuICAgICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgZm9yIHRoZSBmZXRjaCBBUEksIHdoZW5ldmVyIHRoZXkgZ2V0IGFyb3VuZCB0b1xuICAgICAgLy8gYWRkaW5nIGNhbmNlbCBzdXBwb3J0XG4gICAgfVxuICAgIHByb21pc2UudGhlbihjYiwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcbiAgICBwcm9jKGl0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBuYW1lLCBjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5UYWtlRWZmZWN0KF9yZWYyLCBjYikge1xuICAgIHZhciBjaGFubmVsID0gX3JlZjIuY2hhbm5lbCxcbiAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG4gICAgICAgIG1heWJlID0gX3JlZjIubWF5YmU7XG5cbiAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuICAgIHZhciB0YWtlQ2IgPSBmdW5jdGlvbiB0YWtlQ2IoaW5wKSB7XG4gICAgICByZXR1cm4gaW5wIGluc3RhbmNlb2YgRXJyb3IgPyBjYihpbnAsIHRydWUpIDogKDAsIF9jaGFubmVsLmlzRW5kKShpbnApICYmICFtYXliZSA/IGNiKENIQU5ORUxfRU5EKSA6IGNiKGlucCk7XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC50YWtlKHRha2VDYiwgbWF0Y2hlcihwYXR0ZXJuKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyLCB0cnVlKTtcbiAgICB9XG4gICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYzLmNoYW5uZWwsXG4gICAgICAgIGFjdGlvbiA9IF9yZWYzLmFjdGlvbixcbiAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cbiAgICAvKipcbiAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG4gICAgICBUaGUgcHV0IHdpbGwgYmUgZXhlY3V0ZWQgYXRvbWljYWxseS4gaWUgbmVzdGVkIHB1dHMgd2lsbCBleGVjdXRlIGFmdGVyXG4gICAgICB0aGlzIHB1dCBoYXMgdGVybWluYXRlZC5cbiAgICAqKi9cbiAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gKGNoYW5uZWwgPyBjaGFubmVsLnB1dCA6IGRpc3BhdGNoKShhY3Rpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG4gICAgICAgIGlmIChjaGFubmVsIHx8IHJlc29sdmUpIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUgJiYgX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYihyZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFB1dCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5DYWxsRWZmZWN0KF9yZWY0LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjQuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNC5hcmdzO1xuXG4gICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpID8gcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSA/IHJlc29sdmVJdGVyYXRvcihyZXN1bHQsIGVmZmVjdElkLCBmbi5uYW1lLCBjYikgOiBjYihyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ1BTRWZmZWN0KF9yZWY1LCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNS5mbixcbiAgICAgICAgYXJncyA9IF9yZWY1LmFyZ3M7XG5cbiAgICAvLyBDUFMgKGllIG5vZGUgc3R5bGUgZnVuY3Rpb25zKSBjYW4gZGVmaW5lIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWNcbiAgICAvLyBieSBzZXR0aW5nIGNhbmNlbCBmaWVsZCBvbiB0aGUgY2JcblxuICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuICAgIHRyeSB7XG4gICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuICAgICAgICByZXR1cm4gX3V0aWxzLmlzLnVuZGVmKGVycikgPyBjYihyZXMpIDogY2IoZXJyLCB0cnVlKTtcbiAgICAgIH07XG4gICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuICAgICAgaWYgKGNwc0NiLmNhbmNlbCkge1xuICAgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZvcmtFZmZlY3QoX3JlZjYsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNi5mbixcbiAgICAgICAgYXJncyA9IF9yZWY2LmFyZ3MsXG4gICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cbiAgICB2YXIgdGFza0l0ZXJhdG9yID0gY3JlYXRlVGFza0l0ZXJhdG9yKHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICgwLCBfc2NoZWR1bGVyLnN1c3BlbmQpKCk7XG4gICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXG4gICAgICBpZiAoZGV0YWNoZWQpIHtcbiAgICAgICAgY2IoX3Rhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2tJdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrSXRlcmF0b3IuX2Vycm9yKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcbiAgICB9XG4gICAgLy8gRm9yayBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5Kb2luRWZmZWN0KHQsIGNiKSB7XG4gICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHZhciBqb2luZXIgPSB7IHRhc2s6IHRhc2ssIGNiOiBjYiB9O1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcbiAgICAgIH07XG4gICAgICB0LmpvaW5lcnMucHVzaChqb2luZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LmlzQWJvcnRlZCgpID8gY2IodC5lcnJvcigpLCB0cnVlKSA6IGNiKHQucmVzdWx0KCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbEVmZmVjdCh0YXNrVG9DYW5jZWwsIGNiKSB7XG4gICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG4gICAgICB0YXNrVG9DYW5jZWwgPSB0YXNrO1xuICAgIH1cbiAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG4gICAgICB0YXNrVG9DYW5jZWwuY2FuY2VsKCk7XG4gICAgfVxuICAgIGNiKCk7XG4gICAgLy8gY2FuY2VsIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkFsbEVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXG4gICAgaWYgKCFrZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdIDoge30pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZWRDb3VudCA9IDA7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tFZmZlY3RFbmQoKSB7XG4gICAgICBpZiAoY29tcGxldGVkQ291bnQgPT09IGtleXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IF91dGlscy5hcnJheS5mcm9tKF9leHRlbmRzKHt9LCByZXN1bHRzLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0VyciB8fCAoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgfHwgcmVzID09PSBDSEFOTkVMX0VORCB8fCByZXMgPT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG4gICAgICAgICAgY2hlY2tFZmZlY3RFbmQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbXBsZXRlZCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blJhY2VFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgICAgLy8gUmFjZSBBdXRvIGNhbmNlbGxhdGlvblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoISgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSAmJiByZXMgIT09IENIQU5ORUxfRU5EICYmIHJlcyAhPT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgICB2YXIgX3Jlc3BvbnNlO1xuXG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuICAgICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdLnNsaWNlLmNhbGwoX2V4dGVuZHMoe30sIHJlc3BvbnNlLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcbiAgICB9KTtcblxuICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blNlbGVjdEVmZmVjdChfcmVmNywgY2IpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBfcmVmNy5zZWxlY3RvcixcbiAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIGNiKHN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNoYW5uZWxFZmZlY3QoX3JlZjgsIGNiKSB7XG4gICAgdmFyIHBhdHRlcm4gPSBfcmVmOC5wYXR0ZXJuLFxuICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cbiAgICB2YXIgbWF0Y2ggPSBtYXRjaGVyKHBhdHRlcm4pO1xuICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIGNiKCgwLCBfY2hhbm5lbC5ldmVudENoYW5uZWwpKHN1YnNjcmliZSwgYnVmZmVyIHx8IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKSwgbWF0Y2gpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjYikge1xuICAgIGNiKCEhbWFpblRhc2suaXNDYW5jZWxsZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRmx1c2hFZmZlY3QoY2hhbm5lbCwgY2IpIHtcbiAgICBjaGFubmVsLmZsdXNoKGNiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcbiAgICBjYih0YXNrQ29udGV4dFtwcm9wXSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZXRDb250ZXh0RWZmZWN0KHByb3BzLCBjYikge1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG4gICAgY2IoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG4gICAgdmFyIF9kb25lLCBfcmVmOSwgX211dGF0b3JNYXA7XG5cbiAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuICAgIHJldHVybiBfcmVmOSA9IHt9LCBfcmVmOVtfdXRpbHMuVEFTS10gPSB0cnVlLCBfcmVmOS5pZCA9IGlkLCBfcmVmOS5uYW1lID0gbmFtZSwgX2RvbmUgPSAnZG9uZScsIF9tdXRhdG9yTWFwID0ge30sIF9tdXRhdG9yTWFwW19kb25lXSA9IF9tdXRhdG9yTWFwW19kb25lXSB8fCB7fSwgX211dGF0b3JNYXBbX2RvbmVdLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpdGVyYXRvci5fZGVmZXJyZWRFbmQpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZiA9ICgwLCBfdXRpbHMuZGVmZXJyZWQpKCk7XG4gICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcbiAgICAgICAgaWYgKCFpdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgaXRlcmF0b3IuX2Vycm9yID8gZGVmLnJlamVjdChpdGVyYXRvci5fZXJyb3IpIDogZGVmLnJlc29sdmUoaXRlcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgfVxuICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc1J1bm5pbmc7XG4gICAgfSwgX3JlZjkuaXNDYW5jZWxsZWQgPSBmdW5jdGlvbiBpc0NhbmNlbGxlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG4gICAgfSwgX3JlZjkuaXNBYm9ydGVkID0gZnVuY3Rpb24gaXNBYm9ydGVkKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0Fib3J0ZWQ7XG4gICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9yZXN1bHQ7XG4gICAgfSwgX3JlZjkuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG4gICAgfSwgX3JlZjkuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgndGFzaycsIHByb3BzKSk7XG4gICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIH0sIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhfcmVmOSwgX211dGF0b3JNYXApLCBfcmVmOTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFzYXAgPSBhc2FwO1xuZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbnZhciBxdWV1ZSA9IFtdO1xuLyoqXG4gIFZhcmlhYmxlIHRvIGhvbGQgYSBjb3VudGluZyBzZW1hcGhvcmVcbiAgLSBJbmNyZW1lbnRpbmcgYWRkcyBhIGxvY2sgYW5kIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlIChpZiBpdCdzIG5vdFxuICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuICAtIERlY3JlbWVudGluZyByZWxlYXNlcyBhIGxvY2suIFplcm8gbG9ja3MgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS4gVGhpc1xuICAgIHRyaWdnZXJzIGZsdXNoaW5nIHRoZSBxdWV1ZWQgdGFza3MuXG4qKi9cbnZhciBzZW1hcGhvcmUgPSAwO1xuXG4vKipcbiAgRXhlY3V0ZXMgYSB0YXNrICdhdG9taWNhbGx5Jy4gVGFza3Mgc2NoZWR1bGVkIGR1cmluZyB0aGlzIGV4ZWN1dGlvbiB3aWxsIGJlIHF1ZXVlZFxuICBhbmQgZmx1c2hlZCBhZnRlciB0aGlzIHRhc2sgaGFzIGZpbmlzaGVkIChhc3N1bWluZyB0aGUgc2NoZWR1bGVyIGVuZHVwIGluIGEgcmVsZWFzZWRcbiAgc3RhdGUpLlxuKiovXG5mdW5jdGlvbiBleGVjKHRhc2spIHtcbiAgdHJ5IHtcbiAgICBzdXNwZW5kKCk7XG4gICAgdGFzaygpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2UoKTtcbiAgfVxufVxuXG4vKipcbiAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG4qKi9cbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICBxdWV1ZS5wdXNoKHRhc2spO1xuXG4gIGlmICghc2VtYXBob3JlKSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIGZsdXNoKCk7XG4gIH1cbn1cblxuLyoqXG4gIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG4gIHNjaGVkdWxlciBpcyByZWxlYXNlZC5cbioqL1xuZnVuY3Rpb24gc3VzcGVuZCgpIHtcbiAgc2VtYXBob3JlKys7XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLlxuKiovXG5mdW5jdGlvbiByZWxlYXNlKCkge1xuICBzZW1hcGhvcmUtLTtcbn1cblxuLyoqXG4gIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG4qKi9cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICByZWxlYXNlKCk7XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDA7XG4gIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuICAgIGV4ZWModGFzayk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc0VmZmVjdCA9IGV4cG9ydHMudGFrZW0gPSBleHBvcnRzLmRldGFjaCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMudGFrZSA9IHRha2U7XG5leHBvcnRzLnB1dCA9IHB1dDtcbmV4cG9ydHMuYWxsID0gYWxsO1xuZXhwb3J0cy5yYWNlID0gcmFjZTtcbmV4cG9ydHMuY2FsbCA9IGNhbGw7XG5leHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5leHBvcnRzLmNwcyA9IGNwcztcbmV4cG9ydHMuZm9yayA9IGZvcms7XG5leHBvcnRzLnNwYXduID0gc3Bhd247XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5leHBvcnRzLnNlbGVjdCA9IHNlbGVjdDtcbmV4cG9ydHMuYWN0aW9uQ2hhbm5lbCA9IGFjdGlvbkNoYW5uZWw7XG5leHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbmV4cG9ydHMuZ2V0Q29udGV4dCA9IGdldENvbnRleHQ7XG5leHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NhZ2FIZWxwZXJzJyk7XG5cbnZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG52YXIgVEFLRSA9ICdUQUtFJztcbnZhciBQVVQgPSAnUFVUJztcbnZhciBBTEwgPSAnQUxMJztcbnZhciBSQUNFID0gJ1JBQ0UnO1xudmFyIENBTEwgPSAnQ0FMTCc7XG52YXIgQ1BTID0gJ0NQUyc7XG52YXIgRk9SSyA9ICdGT1JLJztcbnZhciBKT0lOID0gJ0pPSU4nO1xudmFyIENBTkNFTCA9ICdDQU5DRUwnO1xudmFyIFNFTEVDVCA9ICdTRUxFQ1QnO1xudmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcbnZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcbnZhciBGTFVTSCA9ICdGTFVTSCc7XG52YXIgR0VUX0NPTlRFWFQgPSAnR0VUX0NPTlRFWFQnO1xudmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblxudmFyIFRFU1RfSElOVCA9ICdcXG4oSElOVDogaWYgeW91IGFyZSBnZXR0aW5nIHRoaXMgZXJyb3JzIGluIHRlc3RzLCBjb25zaWRlciB1c2luZyBjcmVhdGVNb2NrVGFzayBmcm9tIHJlZHV4LXNhZ2EvdXRpbHMpJztcblxudmFyIGVmZmVjdCA9IGZ1bmN0aW9uIGVmZmVjdCh0eXBlLCBwYXlsb2FkKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbSU9dID0gdHJ1ZSwgX3JlZlt0eXBlXSA9IHBheWxvYWQsIF9yZWY7XG59O1xuXG52YXIgZGV0YWNoID0gZXhwb3J0cy5kZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2goZWZmKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGFzRWZmZWN0LmZvcmsoZWZmKSwgX3V0aWxzLmlzLm9iamVjdCwgJ2RldGFjaChlZmYpOiBhcmd1bWVudCBtdXN0IGJlIGEgZm9yayBlZmZlY3QnKTtcbiAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbmZ1bmN0aW9uIHRha2UoKSB7XG4gIHZhciBwYXR0ZXJuT3JDaGFubmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnKic7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhcmd1bWVudHNbMF0sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IHBhdHRlcm5PckNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5wYXR0ZXJuKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IGNoYW5uZWw6IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBhcmd1bWVudCAnICsgU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCBvciBhIHZhbGlkIHBhdHRlcm4nKTtcbn1cblxudGFrZS5tYXliZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHRha2UuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxudmFyIHRha2VtID0gLyojX19QVVJFX18qL2V4cG9ydHMudGFrZW0gPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkodGFrZS5tYXliZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgndGFrZW0nLCAndGFrZS5tYXliZScpKTtcblxuZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGFjdGlvbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICAgIGFjdGlvbiA9IGNoYW5uZWw7XG4gICAgY2hhbm5lbCA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChQVVQsIHsgY2hhbm5lbDogY2hhbm5lbCwgYWN0aW9uOiBhY3Rpb24gfSk7XG59XG5cbnB1dC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5wdXQuc3luYyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkocHV0LnJlc29sdmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3B1dC5zeW5jJywgJ3B1dC5yZXNvbHZlJykpO1xuXG5mdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KEFMTCwgZWZmZWN0cyk7XG59XG5cbmZ1bmN0aW9uIHJhY2UoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KFJBQ0UsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiBnZXRGbkNhbGxEZXNjKG1ldGgsIGZuLCBhcmdzKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblxuICB2YXIgY29udGV4dCA9IG51bGw7XG4gIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG4gICAgdmFyIF9mbiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm5bMF07XG4gICAgZm4gPSBfZm5bMV07XG4gIH0gZWxzZSBpZiAoZm4uZm4pIHtcbiAgICB2YXIgX2ZuMiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG4gICAgZm4gPSBfZm4yLmZuO1xuICB9XG4gIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuICAgIGZuID0gY29udGV4dFtmbl07XG4gIH1cbiAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXG4gIHJldHVybiB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9O1xufVxuXG5mdW5jdGlvbiBjYWxsKGZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdjYWxsJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gYXBwbHkoY29udGV4dCwgZm4pIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnYXBwbHknLCB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiB9LCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGNwcyhmbikge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBmb3JrKGZuKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChGT1JLLCBnZXRGbkNhbGxEZXNjKCdmb3JrJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gc3Bhd24oZm4pIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICByZXR1cm4gZGV0YWNoKGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbZm5dLmNvbmNhdChhcmdzKSkpO1xufVxuXG5mdW5jdGlvbiBqb2luKCkge1xuICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGpvaW4odCk7XG4gICAgfSkpO1xuICB9XG4gIHZhciB0YXNrID0gdGFza3NbMF07XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnam9pbih0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICByZXR1cm4gZWZmZWN0KEpPSU4sIHRhc2spO1xufVxuXG5mdW5jdGlvbiBjYW5jZWwoKSB7XG4gIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgIHRhc2tzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gIH1cblxuICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gY2FuY2VsKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2sgfHwgX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG4gIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICBhcmdzW19rZXk3IC0gMV0gPSBhcmd1bWVudHNbX2tleTddO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvciA9IF91dGlscy5pZGVudDtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgc2VsZWN0b3IgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoU0VMRUNULCB7IHNlbGVjdG9yOiBzZWxlY3RvciwgYXJnczogYXJncyB9KTtcbn1cblxuLyoqXG4gIGNoYW5uZWwocGF0dGVybiwgW2J1ZmZlcl0pICAgID0+IGNyZWF0ZXMgYW4gZXZlbnQgY2hhbm5lbCBmb3Igc3RvcmUgYWN0aW9uc1xuKiovXG5mdW5jdGlvbiBhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwYXR0ZXJuLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sLi4uKTogYXJndW1lbnQgcGF0dGVybiBpcyB1bmRlZmluZWQnKTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50IGJ1ZmZlciBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50ICcgKyBidWZmZXIgKyAnIGlzIG5vdCBhIHZhbGlkIGJ1ZmZlcicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQUNUSU9OX0NIQU5ORUwsIHsgcGF0dGVybjogcGF0dGVybiwgYnVmZmVyOiBidWZmZXIgfSk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbGxlZCgpIHtcbiAgcmV0dXJuIGVmZmVjdChDQU5DRUxMRUQsIHt9KTtcbn1cblxuZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcbiAgcmV0dXJuIGVmZmVjdChGTFVTSCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHQocHJvcCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wLCBfdXRpbHMuaXMuc3RyaW5nLCAnZ2V0Q29udGV4dChwcm9wKTogYXJndW1lbnQgJyArIHByb3AgKyAnIGlzIG5vdCBhIHN0cmluZycpO1xuICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcbn1cblxuZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykobnVsbCwgcHJvcHMpKTtcbiAgcmV0dXJuIGVmZmVjdChTRVRfQ09OVEVYVCwgcHJvcHMpO1xufVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcbiAgICBhcmdzW19rZXk4IC0gMl0gPSBhcmd1bWVudHNbX2tleThdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VFdmVyeUhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOSA+IDIgPyBfbGVuOSAtIDIgOiAwKSwgX2tleTkgPSAyOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG4gICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjEwID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4xMCA+IDMgPyBfbGVuMTAgLSAzIDogMCksIF9rZXkxMCA9IDM7IF9rZXkxMCA8IF9sZW4xMDsgX2tleTEwKyspIHtcbiAgICBhcmdzW19rZXkxMCAtIDNdID0gYXJndW1lbnRzW19rZXkxMF07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGhyb3R0bGVIZWxwZXIsIG1zLCBwYXR0ZXJuLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbnZhciBjcmVhdGVBc0VmZmVjdFR5cGUgPSBmdW5jdGlvbiBjcmVhdGVBc0VmZmVjdFR5cGUodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuICAgIHJldHVybiBlZmZlY3QgJiYgZWZmZWN0W0lPXSAmJiBlZmZlY3RbdHlwZV07XG4gIH07XG59O1xuXG52YXIgYXNFZmZlY3QgPSBleHBvcnRzLmFzRWZmZWN0ID0ge1xuICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuICBwdXQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUFVUKSxcbiAgYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFMTCksXG4gIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG4gIGNhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FMTCksXG4gIGNwczogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDUFMpLFxuICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuICBqb2luOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEpPSU4pLFxuICBjYW5jZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMKSxcbiAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG4gIGFjdGlvbkNoYW5uZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUNUSU9OX0NIQU5ORUwpLFxuICBjYW5jZWxsZWQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMTEVEKSxcbiAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuICBnZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEdFVF9DT05URVhUKSxcbiAgc2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRVRfQ09OVEVYVClcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2lvLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXG52YXIgX3Rha2VFdmVyeSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VFdmVyeScpO1xuXG52YXIgX3Rha2VFdmVyeTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUV2ZXJ5KTtcblxudmFyIF90YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGFrZUxhdGVzdCcpO1xuXG52YXIgX3Rha2VMYXRlc3QyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VMYXRlc3QpO1xuXG52YXIgX3Rocm90dGxlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGhyb3R0bGUnKTtcblxudmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBkZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiBkZXByZWNhdGlvbldhcm5pbmcoaGVscGVyTmFtZSkge1xuICByZXR1cm4gJ2ltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYVxcJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYS9lZmZlY3RzXFwnLlxcblRoZSBsYXR0ZXIgd2lsbCBub3Qgd29yayB3aXRoIHlpZWxkKiwgYXMgaGVscGVyIGVmZmVjdHMgYXJlIHdyYXBwZWQgYXV0b21hdGljYWxseSBmb3IgeW91IGluIGZvcmsgZWZmZWN0LlxcblRoZXJlZm9yZSB5aWVsZCAnICsgaGVscGVyTmFtZSArICcgd2lsbCByZXR1cm4gdGFzayBkZXNjcmlwdG9yIHRvIHlvdXIgc2FnYSBhbmQgZXhlY3V0ZSBuZXh0IGxpbmVzIG9mIGNvZGUuJztcbn07XG5cbnZhciB0YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlRXZlcnkyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VFdmVyeScpKTtcbnZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcbnZhciB0aHJvdHRsZSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rocm90dGxlMi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0aHJvdHRsZScpKTtcblxuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gX3Rha2VMYXRlc3QyLmRlZmF1bHQ7XG5leHBvcnRzLnRocm90dGxlSGVscGVyID0gX3Rocm90dGxlMi5kZWZhdWx0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VFdmVyeTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlRXZlcnkoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUV2ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NDVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuZXhwb3J0cy5zYWZlTmFtZSA9IHNhZmVOYW1lO1xuZXhwb3J0cy5kZWZhdWx0ID0gZnNtSXRlcmF0b3I7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIGRvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbnZhciBxRW5kID0gZXhwb3J0cy5xRW5kID0ge307XG5cbmZ1bmN0aW9uIHNhZmVOYW1lKHBhdHRlcm5PckNoYW5uZWwpIHtcbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuICdjaGFubmVsJztcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuICAgIH0pKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZzbUl0ZXJhdG9yKGZzbSwgcTApIHtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdpdGVyYXRvcic7XG5cbiAgdmFyIHVwZGF0ZVN0YXRlID0gdm9pZCAwLFxuICAgICAgcU5leHQgPSBxMDtcblxuICBmdW5jdGlvbiBuZXh0KGFyZywgZXJyb3IpIHtcbiAgICBpZiAocU5leHQgPT09IHFFbmQpIHtcbiAgICAgIHJldHVybiBkb25lO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgcU5leHQgPSBxRW5kO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZVN0YXRlICYmIHVwZGF0ZVN0YXRlKGFyZyk7XG5cbiAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuICAgICAgICAgIHEgPSBfZnNtJHFOZXh0WzBdLFxuICAgICAgICAgIG91dHB1dCA9IF9mc20kcU5leHRbMV0sXG4gICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblxuICAgICAgcU5leHQgPSBxO1xuICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG4gICAgICByZXR1cm4gcU5leHQgPT09IHFFbmQgPyBkb25lIDogb3V0cHV0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikobmV4dCwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuICB9LCBuYW1lLCB0cnVlKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvZnNtSXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDc0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZW1pdHRlciA9IGVtaXR0ZXI7XG5leHBvcnRzLmNoYW5uZWwgPSBjaGFubmVsO1xuZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5leHBvcnRzLnN0ZENoYW5uZWwgPSBzdGRDaGFubmVsO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vYnVmZmVycycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xudmFyIEVORCA9IGV4cG9ydHMuRU5EID0geyB0eXBlOiBDSEFOTkVMX0VORF9UWVBFIH07XG52YXIgaXNFbmQgPSBleHBvcnRzLmlzRW5kID0gZnVuY3Rpb24gaXNFbmQoYSkge1xuICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG59O1xuXG5mdW5jdGlvbiBlbWl0dGVyKCkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG4gICAgc3Vic2NyaWJlcnMucHVzaChzdWIpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KGl0ZW0pIHtcbiAgICB2YXIgYXJyID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcnJbaV0oaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBlbWl0OiBlbWl0XG4gIH07XG59XG5cbnZhciBJTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSAnaW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGNoYW5uZWwgZmFjdG9yeSBmdW5jdGlvbic7XG52YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcbn1cblxuZnVuY3Rpb24gY2hhbm5lbCgpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpO1xuXG4gIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgdmFyIHRha2VycyA9IFtdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXG4gIGZ1bmN0aW9uIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCkge1xuICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIGEgY2xvc2VkIGNoYW5uZWwgd2l0aCBwZW5kaW5nIHRha2VycycpO1xuICAgIH1cbiAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIHBlbmRpbmcgdGFrZXJzIHdpdGggbm9uIGVtcHR5IGJ1ZmZlcicpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHB1dChpbnB1dCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaW5wdXQsIF91dGlscy5pcy5ub3RVbmRlZiwgVU5ERUZJTkVEX0lOUFVUX0VSUk9SKTtcbiAgICBpZiAoY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGFrZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRha2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuICAgICAgaWYgKCFjYltfdXRpbHMuTUFUQ0hdIHx8IGNiW191dGlscy5NQVRDSF0oaW5wdXQpKSB7XG4gICAgICAgIHRha2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybiBjYihpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGFrZShjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblxuICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoRU5EKTtcbiAgICB9IGVsc2UgaWYgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihidWZmZXIudGFrZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFrZXJzLnB1c2goY2IpO1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHRha2VycywgY2IpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaChjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7IC8vIFRPRE86IGNoZWNrIGlmIHNvbWUgbmV3IHN0YXRlIHNob3VsZCBiZSBmb3JiaWRkZW4gbm93XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwuZmx1c2gnIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNiKGJ1ZmZlci5mbHVzaCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgaWYgKCFjbG9zZWQpIHtcbiAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICBpZiAodGFrZXJzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuICAgICAgICB0YWtlcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGFycltpXShFTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiB0YWtlLFxuICAgIHB1dDogcHV0LFxuICAgIGZsdXNoOiBmbHVzaCxcbiAgICBjbG9zZTogY2xvc2UsXG4gICAgZ2V0IF9fdGFrZXJzX18oKSB7XG4gICAgICByZXR1cm4gdGFrZXJzO1xuICAgIH0sXG4gICAgZ2V0IF9fY2xvc2VkX18oKSB7XG4gICAgICByZXR1cm4gY2xvc2VkO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZXZlbnRDaGFubmVsKHN1YnNjcmliZSkge1xuICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcbiAgdmFyIG1hdGNoZXIgPSBhcmd1bWVudHNbMl07XG5cbiAgLyoqXG4gICAgc2hvdWxkIGJlIGlmKHR5cGVvZiBtYXRjaGVyICE9PSB1bmRlZmluZWQpIGluc3RlYWQ/XG4gICAgc2VlIFBSICMyNzMgZm9yIGEgYmFja2dyb3VuZCBkaXNjdXNzaW9uXG4gICoqL1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgJ0ludmFsaWQgbWF0Y2ggZnVuY3Rpb24gcGFzc2VkIHRvIGV2ZW50Q2hhbm5lbCcpO1xuICB9XG5cbiAgdmFyIGNoYW4gPSBjaGFubmVsKGJ1ZmZlcik7XG4gIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmICghY2hhbi5fX2Nsb3NlZF9fKSB7XG4gICAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIGNoYW4uY2xvc2UoKTtcbiAgICB9XG4gIH07XG4gIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG4gICAgICBjbG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobWF0Y2hlciAmJiAhbWF0Y2hlcihpbnB1dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbi5wdXQoaW5wdXQpO1xuICB9KTtcbiAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuICAgIHVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBpZiAoIV91dGlscy5pcy5mdW5jKHVuc3Vic2NyaWJlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW4gZXZlbnRDaGFubmVsOiBzdWJzY3JpYmUgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuc3Vic2NyaWJlJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRha2U6IGNoYW4udGFrZSxcbiAgICBmbHVzaDogY2hhbi5mbHVzaCxcbiAgICBjbG9zZTogY2xvc2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGNoYW4gPSBldmVudENoYW5uZWwoZnVuY3Rpb24gKGNiKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG4gICAgICAgIGNiKGlucHV0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgY2hhbiwge1xuICAgIHRha2U6IGZ1bmN0aW9uIHRha2UoY2IsIG1hdGNoZXIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBtYXRjaGVyIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgY2JbX3V0aWxzLk1BVENIXSA9IG1hdGNoZXI7XG4gICAgICB9XG4gICAgICBjaGFuLnRha2UoY2IpO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2NoYW5uZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gdW5kZWZpbmVkO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoXCIuL3V0aWxzXCIpO1xuXG52YXIgQlVGRkVSX09WRVJGTE9XID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSBcIkNoYW5uZWwncyBCdWZmZXIgb3ZlcmZsb3chXCI7XG5cbnZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG52YXIgT05fT1ZFUkZMT1dfRFJPUCA9IDI7XG52YXIgT05fT1ZFUkZMT1dfU0xJREUgPSAzO1xudmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cbnZhciB6ZXJvQnVmZmVyID0geyBpc0VtcHR5OiBfdXRpbHMua1RydWUsIHB1dDogX3V0aWxzLm5vb3AsIHRha2U6IF91dGlscy5ub29wIH07XG5cbmZ1bmN0aW9uIHJpbmdCdWZmZXIoKSB7XG4gIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMTA7XG4gIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblxuICB2YXIgYXJyID0gbmV3IEFycmF5KGxpbWl0KTtcbiAgdmFyIGxlbmd0aCA9IDA7XG4gIHZhciBwdXNoSW5kZXggPSAwO1xuICB2YXIgcG9wSW5kZXggPSAwO1xuXG4gIHZhciBwdXNoID0gZnVuY3Rpb24gcHVzaChpdCkge1xuICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG4gICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgbGVuZ3RoKys7XG4gIH07XG5cbiAgdmFyIHRha2UgPSBmdW5jdGlvbiB0YWtlKCkge1xuICAgIGlmIChsZW5ndGggIT0gMCkge1xuICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcbiAgICAgIGFycltwb3BJbmRleF0gPSBudWxsO1xuICAgICAgbGVuZ3RoLS07XG4gICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICByZXR1cm4gaXQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHdoaWxlIChsZW5ndGgpIHtcbiAgICAgIGl0ZW1zLnB1c2godGFrZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24gcHV0KGl0KSB7XG4gICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgcHVzaChpdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuICAgICAgICBzd2l0Y2ggKG92ZXJmbG93QWN0aW9uKSB7XG4gICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19USFJPVzpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfU0xJREU6XG4gICAgICAgICAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICAgICAgICBwb3BJbmRleCA9IHB1c2hJbmRleDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuICAgICAgICAgICAgZG91YmxlZExpbWl0ID0gMiAqIGxpbWl0O1xuXG4gICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHBvcEluZGV4ID0gMDtcblxuICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcbiAgICAgICAgICAgIGxpbWl0ID0gZG91YmxlZExpbWl0O1xuXG4gICAgICAgICAgICBwdXNoKGl0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gRFJPUFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB0YWtlOiB0YWtlLFxuICAgIGZsdXNoOiBmbHVzaFxuICB9O1xufVxuXG52YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcbiAgbm9uZTogZnVuY3Rpb24gbm9uZSgpIHtcbiAgICByZXR1cm4gemVyb0J1ZmZlcjtcbiAgfSxcbiAgZml4ZWQ6IGZ1bmN0aW9uIGZpeGVkKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1RIUk9XKTtcbiAgfSxcbiAgZHJvcHBpbmc6IGZ1bmN0aW9uIGRyb3BwaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX0RST1ApO1xuICB9LFxuICBzbGlkaW5nOiBmdW5jdGlvbiBzbGlkaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1NMSURFKTtcbiAgfSxcbiAgZXhwYW5kaW5nOiBmdW5jdGlvbiBleHBhbmRpbmcoaW5pdGlhbFNpemUpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihpbml0aWFsU2l6ZSwgT05fT1ZFUkZMT1dfRVhQQU5EKTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvYnVmZmVycy5qc1xuLy8gbW9kdWxlIGlkID0gNzQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5Q2FuY2VsID0gZnVuY3Rpb24geUNhbmNlbCh0YXNrKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbmNlbCkodGFzaykgfTtcbiAgfTtcblxuICB2YXIgdGFzayA9IHZvaWQgMCxcbiAgICAgIGFjdGlvbiA9IHZvaWQgMDtcbiAgdmFyIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRUYXNrKHQpIHtcbiAgICByZXR1cm4gdGFzayA9IHQ7XG4gIH07XG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IHRhc2sgPyBbJ3EzJywgeUNhbmNlbCh0YXNrKV0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG4gICAgfSxcbiAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG4gICAgICByZXR1cm4gWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH1cbiAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUxhdGVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9idWZmZXJzJyk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAzID8gX2xlbiAtIDMgOiAwKSwgX2tleSA9IDM7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAzXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBjaGFubmVsID0gdm9pZCAwO1xuXG4gIHZhciB5QWN0aW9uQ2hhbm5lbCA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmFjdGlvbkNoYW5uZWwpKHBhdHRlcm4sIF9idWZmZXJzLmJ1ZmZlcnMuc2xpZGluZygxKSkgfTtcbiAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKGNoYW5uZWwpIH07XG4gIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcbiAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cbiAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuICAgIHJldHVybiBhY3Rpb24gPSBhYztcbiAgfTtcbiAgdmFyIHNldENoYW5uZWwgPSBmdW5jdGlvbiBzZXRDaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcbiAgfTtcblxuICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeUFjdGlvbkNoYW5uZWwsIHNldENoYW5uZWxdO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIFsncTMnLCB5VGFrZSgpLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTQnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9LFxuICAgIHE0OiBmdW5jdGlvbiBxNCgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeURlbGF5XTtcbiAgICB9XG4gIH0sICdxMScsICd0aHJvdHRsZSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybikgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90aHJvdHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcnVuU2FnYScpO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlRmFjdG9yeSgpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBfcmVmJGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcbiAgICAgIG9wdGlvbnMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjb250ZXh0J10pO1xuXG4gIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cblxuICBpZiAoX3V0aWxzLmlzLmZ1bmMob3B0aW9ucykpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTYWdhIG1pZGRsZXdhcmUgbm8gbG9uZ2VyIGFjY2VwdCBHZW5lcmF0b3IgZnVuY3Rpb25zLiBVc2Ugc2FnYU1pZGRsZXdhcmUucnVuIGluc3RlYWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxvZ2dlciAmJiAhX3V0aWxzLmlzLmZ1bmMobG9nZ2VyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMubG9nZ2VyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiBvcHRpb25zLm9uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25FcnJvcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5lbWl0dGVyICYmICFfdXRpbHMuaXMuZnVuYyhvcHRpb25zLmVtaXR0ZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5lbWl0dGVyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlKF9yZWYyKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoID0gX3JlZjIuZGlzcGF0Y2g7XG5cbiAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcbiAgICBzYWdhRW1pdHRlci5lbWl0ID0gKG9wdGlvbnMuZW1pdHRlciB8fCBfdXRpbHMuaWRlbnQpKHNhZ2FFbWl0dGVyLmVtaXQpO1xuXG4gICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBzdWJzY3JpYmU6IHNhZ2FFbWl0dGVyLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcbiAgICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICAgIHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgb25FcnJvcjogb25FcnJvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuICAgICAgICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcbiAgICAgICAgc2FnYUVtaXR0ZXIuZW1pdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgc2FnYU1pZGRsZXdhcmUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQmVmb3JlIHJ1bm5pbmcgYSBTYWdhLCB5b3UgbXVzdCBtb3VudCB0aGUgU2FnYSBtaWRkbGV3YXJlIG9uIHRoZSBTdG9yZSB1c2luZyBhcHBseU1pZGRsZXdhcmUnKTtcbiAgfTtcblxuICBzYWdhTWlkZGxld2FyZS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG4gICAgX3V0aWxzLm9iamVjdC5hc3NpZ24oY29udGV4dCwgcHJvcHMpO1xuICB9O1xuXG4gIHJldHVybiBzYWdhTWlkZGxld2FyZTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvbWlkZGxld2FyZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZW0nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZW07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwdXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucHV0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JhY2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucmFjZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbGwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FwcGx5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFwcGx5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3BzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNwcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZvcmsnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZm9yaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NwYXduJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNwYXduO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnam9pbicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5qb2luO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NlbGVjdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZWxlY3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhY3Rpb25DaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFjdGlvbkNoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWxsZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FuY2VsbGVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZmx1c2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZmx1c2g7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdnZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmdldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGhyb3R0bGU7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9lZmZlY3RzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmlzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuICB9XG59KTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG4gIH1cbn0pO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9wcm9jJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0hBTk5FTF9FTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcHJvYy5DSEFOTkVMX0VORDtcbiAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuL2NvbnN0XCI7XG5pbXBvcnQgcHVsbCBmcm9tIFwibG9kYXNoL3B1bGxcIjtcbmltcG9ydCB7IGluQXJyYXkgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBpbml0aWFsIHN0YXRlXG5sZXQgaW5pdGlhbFN0YXRlID0ge1xuICAgIHNlbGVjdEFsbDogdHJ1ZSxcbiAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgZXJyb3I6IG51bGwsXG4gICAgdXNlcklkOiBudWxsLFxuICAgIGlzX3Jlc3RyaWN0ZWQ6IGZhbHNlLFxuICAgIGFsbF9wcm9qZWN0czogW10sXG4gICAgdXNlcl9wcm9qZWN0czogW10sXG4gICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcbiAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGMuU0VUX1NUT1JFOiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgLi4uZGF0YSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfSU5JVDoge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMucHJvamVjdHMpIHx8IFtdLFxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCkgfHwgZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX0dFVF9GQUlMVVJFOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX1BVVF9JTklUOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyB1c2VyX3Byb2plY3RzIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMucHJvamVjdHMsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5BUElfUFVUX0ZBSUxVUkU6IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGwsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIE92ZXJ3cml0ZSBpZiB3ZSBoYXZlIGFuIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlLmlzX3Jlc3RyaWN0ZWQgPSBzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsX3VzZXJfcHJvamVjdHMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0ZS51c2VyX3Byb2plY3RzID0gc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT046IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvamVjdElkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3VzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcblxuICAgICAgICAgICAgaW5BcnJheShwcm9qZWN0SWQsIHVzZXJfcHJvamVjdHMpXG4gICAgICAgICAgICAgICAgPyBwdWxsKHVzZXJfcHJvamVjdHMsIHByb2plY3RJZClcbiAgICAgICAgICAgICAgICA6IHVzZXJfcHJvamVjdHMucHVzaChwcm9qZWN0SWQpO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG9yaWdpbmFsX3VzZXJfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRDoge1xuICAgICAgICAgICAgY29uc3QgeyBpc19yZXN0cmljdGVkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBpc19yZXN0cmljdGVkLCBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBzdGF0ZS5pc19yZXN0cmljdGVkIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFM6IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3VzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcbiAgICAgICAgICAgIGxldCB1c2VyX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIHsgc2VsZWN0QWxsIH0gPSB7IC4uLnN0YXRlIH07XG4gICAgICAgICAgICBpZiAoc2VsZWN0QWxsKSB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAocHJvamVjdCA9PiBwcm9qZWN0LmlkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHMsXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0c1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ2YXIgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIHB1bGxBbGwgPSByZXF1aXJlKCcuL3B1bGxBbGwnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcbiAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xudmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fb3ZlclJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hcHBseS5qc1xuLy8gbW9kdWxlIGlkID0gNzU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9jb25zdGFudC5qc1xuLy8gbW9kdWxlIGlkID0gNzYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3Nob3J0T3V0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VQdWxsQWxsID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBbGwnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG5mdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG4gICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvcHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzYzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpLFxuICAgIGJhc2VJbmRleE9mV2l0aCA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mV2l0aCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBzZWVuID0gYXJyYXk7XG5cbiAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcbiAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcbiAgfVxuICBpZiAoaXRlcmF0ZWUpIHtcbiAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGZyb21JbmRleCA9IDAsXG4gICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG4gICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcbiAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNOYU4uanNcbi8vIG1vZHVsZSBpZCA9IDc2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanNcbi8vIG1vZHVsZSBpZCA9IDc2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qc1xuLy8gbW9kdWxlIGlkID0gNzY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gVGhpcyBpbXBvcnQgaXMgbmVjZXNzYXJ5IHRvIGJlIGFibGUgdG8gdGVzdCBzYWdhcy5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkdXgtc2FnYS9yZWR1eC1zYWdhL2lzc3Vlcy8yODAjaXNzdWVjb21tZW50LTI5MTEzMzAyM1xuaW1wb3J0IFwicmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lXCI7XG5cbmltcG9ydCB7IHRha2VMYXRlc3QsIGNhbGwsIHB1dCwgc2VsZWN0IH0gZnJvbSBcInJlZHV4LXNhZ2EvZWZmZWN0c1wiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuL2NvbnN0XCI7XG5pbXBvcnQgeyBnZXRDb29raWUgfSBmcm9tIFwiLi4vbXktcmVzdWx0cy91dGlsc1wiO1xuXG5mdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG4gICAgcmV0dXJuIGF4aW9zKGNvbmZpZylcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gKHsgcmVzcG9uc2UgfSkpXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiAoeyBlcnJvciB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaERhdGEodXNlcklkKSB7XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gXG4gICAgfTtcbiAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXREYXRhKHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZShcImNzcmZ0b2tlblwiKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGdldFNhZ2EoYWN0aW9uKSB7XG4gICAgY29uc3QgeyB1c2VySWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgIGNvbnN0IHsgcmVzcG9uc2UsIGVycm9yIH0gPSB5aWVsZCBjYWxsKGZldGNoRGF0YSwgdXNlcklkKTtcbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFVzZXJJZCA9IHN0YXRlID0+IHN0YXRlLnVzZXJJZDtcbmV4cG9ydCBjb25zdCBnZXRVc2VyUHJvamVjdHMgPSBzdGF0ZSA9PiBzdGF0ZS51c2VyX3Byb2plY3RzO1xuZXhwb3J0IGNvbnN0IGdldElzUmVzdHJpY3RlZCA9IHN0YXRlID0+IHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiogcHV0U2FnYShhY3Rpb24pIHtcbiAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcbiAgICBjb25zdCB1c2VySWQgPSB5aWVsZCBzZWxlY3QoZ2V0VXNlcklkKTtcbiAgICBjb25zdCBpc19yZXN0cmljdGVkID0geWllbGQgc2VsZWN0KGdldElzUmVzdHJpY3RlZCk7XG4gICAgY29uc3QgdXNlcl9wcm9qZWN0cyA9IHlpZWxkIHNlbGVjdChnZXRVc2VyUHJvamVjdHMpO1xuXG4gICAgY29uc3QgeyByZXNwb25zZSwgZXJyb3IgfSA9IHlpZWxkIGNhbGwocHV0RGF0YSwgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKTtcbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuLy8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2FcbmV4cG9ydCBmdW5jdGlvbiogd2F0Y2hlclNhZ2EoKSB7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3Mvc2FnYXMuanMiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cbiAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cbiAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanNcbi8vIG1vZHVsZSBpZCA9IDc3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaXMtYnVmZmVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Nzdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9BeGlvcy5qc1xuLy8gbW9kdWxlIGlkID0gNzc4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9kZWZhdWx0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzc5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J0b2EnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblxuICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG4gICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cbiAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG4gICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG4gICAgICB4RG9tYWluID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG4gICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1xuLy8gbW9kdWxlIGlkID0gNzgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9zZXR0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc4MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgcmV0dXJuIGVycm9yO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDc4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xuLy8gbW9kdWxlIGlkID0gNzg3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cbnZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbmZ1bmN0aW9uIEUoKSB7XG4gIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xufVxuRS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5FLnByb3RvdHlwZS5jb2RlID0gNTtcbkUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICBmb3IgKFxuICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG4gICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcbiAgKSB7XG4gICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgIHRocm93IG5ldyBFKCk7XG4gICAgfVxuICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDc5MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG4gIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gIH1cblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc5MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNzkyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcbi8vIG1vZHVsZSBpZCA9IDc5N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXG4vLyBtb2R1bGUgaWQgPSA3OThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==