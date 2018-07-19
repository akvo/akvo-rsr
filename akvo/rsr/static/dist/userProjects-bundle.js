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
                    var original_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    var _user_projects2 = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    (0, _utils.inArray)(projectId, _user_projects2) ? (0, _pull2.default)(_user_projects2, projectId) : _user_projects2.push(projectId);
                    return _extends({}, state, {
                        original_projects: original_user_projects,
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
                    var _original_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
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
                        original_projects: original_user_projects,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHVjZXIiLCJfc2FnYXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNhZ2FNaWRkbGV3YXJlIiwicmVkdXhEZXZUb29scyIsIndpbmRvdyIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJzdG9yZSIsImNyZWF0ZVN0b3JlIiwicmVkdWNlciIsImNvbXBvc2UiLCJhcHBseU1pZGRsZXdhcmUiLCJydW4iLCJ3YXRjaGVyU2FnYSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCI3MzUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJrZXkiLCJDb25zdHJ1Y3RvciIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIl91dGlscyIsIl9jb25zdCIsImMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ld09iaiIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiSXNSZXN0cmljdGVkIiwiX3JlZiIsIl8iLCJpc19yZXN0cmljdGVkIiwib25DaGFuZ2VJc1Jlc3RyaWN0ZWQiLCJpZCIsInR5cGUiLCJjaGVja2VkIiwib25DaGFuZ2UiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImNsYXNzTmFtZSIsIlByb2plY3QiLCJfcmVmMiIsInByb2plY3QiLCJ1c2VyX3Byb2plY3RzIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQiLCJpbkFycmF5IiwiZGlzYWJsZWQiLCJwcm9qZWN0U2VsZWN0ZWQiLCJ0ckNsYXNzTmFtZSIsImlkQ2xhc3NOYW1lIiwib25DbGljayIsInJlYWRPbmx5IiwidGl0bGUiLCJTZWxlY3RBbGwiLCJfcmVmMyIsInNlbGVjdEFsbCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCIsInVuZGVmaW5lZCIsIkVycm9yIiwiX3JlZjQiLCJlcnJvciIsIm1lc3NhZ2UiLCJQcm9qZWN0cyIsIl9yZWY1IiwiYWxsX3Byb2plY3RzIiwibWFwIiwiQXBwIiwiX1JlYWN0JENvbXBvbmVudCIsInRoaXMiLCJfdGhpcyIsImdldFByb3RvdHlwZU9mIiwidG9nZ2xlUHJvamVjdFNlbGVjdGVkIiwiYmluZCIsInRvZ2dsZUlzUmVzdHJpY3RlZCIsInRvZ2dsZVByb2plY3RTZWxlY3RBbGwiLCJzIiwic3RyaW5ncyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJvblVwZGF0ZUlzUmVzdHJpY3RlZCIsIm9uVXBkYXRlU2VsZWN0QWxsIiwiY3VycmVudFRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24iLCJjb21wb25lbnREaWRNb3VudCIsInVzZXJJZCIsImRhdGFGcm9tRWxlbWVudCIsInNldFN0b3JlIiwib25GZXRjaFVzZXJQcm9qZWN0cyIsIl9wcm9wcyIsIlJlYWN0IiwiQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJmZXRjaGluZyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwiQVBJX0dFVF9JTklUIiwiZGF0YSIsIlNFVF9TVE9SRSIsInByb2plY3RJZCIsIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiIsIlVQREFURV9JU19SRVNUUklDVEVEIiwiVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMiLCJjb25uZWN0IiwiNzM2IiwiZW5kcG9pbnRzIiwiX3N0b3JlIiwiX3N0b3JlMiIsInVzZXJfcHJvamVjdHNfYWNjZXNzIiwiYXJyIiwiaW5kZXhPZiIsImVsZW1lbnROYW1lIiwiSlNPTiIsInBhcnNlIiwiaW5uZXJIVE1MIiwiNzM3IiwiQVBJX0dFVF9TVUNDRVNTIiwiQVBJX0dFVF9GQUlMVVJFIiwiQVBJX1BVVF9JTklUIiwiQVBJX1BVVF9TVUNDRVNTIiwiQVBJX1BVVF9GQUlMVVJFIiwiNzM4IiwidXRpbHMiLCJlZmZlY3RzIiwiZGV0YWNoIiwiQ0FOQ0VMIiwiZGVsYXkiLCJ0aHJvdHRsZSIsInRha2VMYXRlc3QiLCJ0YWtlRXZlcnkiLCJidWZmZXJzIiwiY2hhbm5lbCIsImV2ZW50Q2hhbm5lbCIsIkVORCIsInJ1blNhZ2EiLCJfcnVuU2FnYSIsImdldCIsIl9jaGFubmVsIiwiX2J1ZmZlcnMiLCJfc2FnYUhlbHBlcnMiLCJfaW8iLCJfbWlkZGxld2FyZSIsIl9taWRkbGV3YXJlMiIsIl9lZmZlY3RzIiwiX3V0aWxzMiIsIjczOSIsInByb2Nlc3MiLCJfcHJvYyIsIl9wcm9jMiIsIlJVTl9TQUdBX1NJR05BVFVSRSIsIk5PTl9HRU5FUkFUT1JfRVJSIiwic3RvcmVJbnRlcmZhY2UiLCJzYWdhIiwiX2xlbiIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJpdGVyYXRvciIsImlzIiwiZW52IiwiTk9ERV9FTlYiLCJsb2ciLCJjaGVjayIsImZ1bmMiLCJhcHBseSIsIl9zdG9yZUludGVyZmFjZSIsInN1YnNjcmliZSIsImdldFN0YXRlIiwiY29udGV4dCIsInNhZ2FNb25pdG9yIiwibG9nZ2VyIiwib25FcnJvciIsImVmZmVjdElkIiwidWlkIiwiZWZmZWN0VHJpZ2dlcmVkIiwibm9vcCIsImVmZmVjdFJlc29sdmVkIiwiZWZmZWN0UmVqZWN0ZWQiLCJlZmZlY3RDYW5jZWxsZWQiLCJhY3Rpb25EaXNwYXRjaGVkIiwicm9vdCIsInBhcmVudEVmZmVjdElkIiwiZWZmZWN0IiwidGFzayIsIndyYXBTYWdhRGlzcGF0Y2giLCJuYW1lIiwiNzQwIiwiX2V4dGVuZHMiLCJhc3NpZ24iLCJzb3VyY2UiLCJfdHlwZW9mIiwiU3ltYm9sIiwiaGFzT3duIiwicmVtb3ZlIiwiZGVmZXJyZWQiLCJhcnJheU9mRGVmZmVyZWQiLCJjcmVhdGVNb2NrVGFzayIsImF1dG9JbmMiLCJtYWtlSXRlcmF0b3IiLCJkZXByZWNhdGUiLCJzeW0iLCJUQVNLIiwiSEVMUEVSIiwiTUFUQ0giLCJTQUdBX0FDVElPTiIsIlNFTEZfQ0FOQ0VMTEFUSU9OIiwia29uc3QiLCJ2Iiwia1RydWUiLCJrRmFsc2UiLCJpZGVudCIsInByZWRpY2F0ZSIsIm9iamVjdCIsInByb3BlcnR5Iiwibm90VW5kZWYiLCJ1bmRlZiIsImYiLCJudW1iZXIiLCJuIiwic3RyaW5nIiwiYXJyYXkiLCJpc0FycmF5IiwicHJvbWlzZSIsInAiLCJ0aGVuIiwiaXQiLCJuZXh0IiwidGhyb3ciLCJpdGVyYWJsZSIsInQiLCJvYnNlcnZhYmxlIiwib2IiLCJidWZmZXIiLCJidWYiLCJpc0VtcHR5IiwidGFrZSIsInB1dCIsInBhdHRlcm4iLCJwYXQiLCJjaCIsImNsb3NlIiwiaGVscGVyIiwic3RyaW5nYWJsZUZ1bmMiLCJpdGVtIiwiaW5kZXgiLCJzcGxpY2UiLCJmcm9tIiwiZGVmIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwdXNoIiwibXMiLCJ2YWwiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicnVubmluZyIsIl9yZXN1bHQiLCJfZXJyb3IiLCJpc1J1bm5pbmciLCJyZXN1bHQiLCJzZXRSdW5uaW5nIiwiYiIsInNldFJlc3VsdCIsInIiLCJzZXRFcnJvciIsInNlZWQiLCJrVGhyb3ciLCJlcnIiLCJrUmV0dXJuIiwiZG9uZSIsInRocm8iLCJpc0hlbHBlciIsInJldHVybiIsImxldmVsIiwiY29uc29sZSIsInN0YWNrIiwiZm4iLCJkZXByZWNhdGlvbldhcm5pbmciLCJ1cGRhdGVJbmNlbnRpdmUiLCJkZXByZWNhdGVkIiwicHJlZmVycmVkIiwiaW50ZXJuYWxFcnIiLCJjcmVhdGVTZXRDb250ZXh0V2FybmluZyIsImN0eCIsImFjdGlvbiIsImNsb25lYWJsZUdlbmVyYXRvciIsImdlbmVyYXRvckZ1bmMiLCJoaXN0b3J5IiwiZ2VuIiwiYXJnIiwiY2xvbmUiLCJjbG9uZWRHZW4iLCJmb3JFYWNoIiwiX3JldHVybiIsIl90aHJvdyIsImV4Y2VwdGlvbiIsIjc0MSIsIlRBU0tfQ0FOQ0VMIiwiQ0hBTk5FTF9FTkQiLCJOT1RfSVRFUkFUT1JfRVJST1IiLCJwcm9jIiwiX3NjaGVkdWxlciIsIl9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyIsImRlc2NzIiwiZGVzYyIsInRvU3RyaW5nIiwibWF0Y2hlcnMiLCJ3aWxkY2FyZCIsIl9kZWZhdWx0IiwiaW5wdXQiLCJTdHJpbmciLCJwYXR0ZXJucyIsInNvbWUiLCJtYXRjaGVyIiwiX3ByZWRpY2F0ZSIsImZvcmtRdWV1ZSIsIm1haW5UYXNrIiwiY2IiLCJ0YXNrcyIsImNvbXBsZXRlZCIsImFkZFRhc2siLCJhYm9ydCIsImNhbmNlbEFsbCIsImNvbnQiLCJyZXMiLCJpc0VyciIsImNhbmNlbCIsImdldFRhc2tzIiwidGFza05hbWVzIiwiY3JlYXRlVGFza0l0ZXJhdG9yIiwicGMiLCJlZmYiLCJyZXQiLCJ3cmFwSGVscGVyIiwicGFyZW50Q29udGV4dCIsIm9wdGlvbnMiLCJlZmZlY3RzU3RyaW5nIiwicnVuUGFyYWxsZWxFZmZlY3QiLCJydW5BbGxFZmZlY3QiLCJsb2dFcnJvciIsInNhZ2FTdGFjayIsInNwbGl0Iiwic3RkQ2hhbm5lbCIsInRhc2tDb250ZXh0IiwibmV3VGFzayIsImNhbmNlbE1haW4iLCJ0YXNrUXVldWUiLCJlbmQiLCJpc0NhbmNlbGxlZCIsIl9pc1J1bm5pbmciLCJfaXNDYW5jZWxsZWQiLCJydW5FZmZlY3QiLCJpc01haW5SdW5uaW5nIiwiX2RlZmVycmVkRW5kIiwiX2lzQWJvcnRlZCIsImpvaW5lcnMiLCJqIiwibGFiZWwiLCJlZmZlY3RTZXR0bGVkIiwiY3VyckNiIiwicmVzb2x2ZVByb21pc2UiLCJydW5Gb3JrRWZmZWN0IiwicmVzb2x2ZUl0ZXJhdG9yIiwiYXNFZmZlY3QiLCJydW5UYWtlRWZmZWN0IiwicnVuUHV0RWZmZWN0IiwiYWxsIiwicmFjZSIsInJ1blJhY2VFZmZlY3QiLCJydW5DYWxsRWZmZWN0IiwiY3BzIiwicnVuQ1BTRWZmZWN0IiwiZm9yayIsImpvaW4iLCJydW5Kb2luRWZmZWN0IiwicnVuQ2FuY2VsRWZmZWN0Iiwic2VsZWN0IiwicnVuU2VsZWN0RWZmZWN0IiwiYWN0aW9uQ2hhbm5lbCIsInJ1bkNoYW5uZWxFZmZlY3QiLCJmbHVzaCIsInJ1bkZsdXNoRWZmZWN0IiwiY2FuY2VsbGVkIiwicnVuQ2FuY2VsbGVkRWZmZWN0IiwiZ2V0Q29udGV4dCIsInJ1bkdldENvbnRleHRFZmZlY3QiLCJzZXRDb250ZXh0IiwicnVuU2V0Q29udGV4dEVmZmVjdCIsImNhbmNlbFByb21pc2UiLCJtYXliZSIsInRha2VDYiIsImlucCIsImlzRW5kIiwiYXNhcCIsImNwc0NiIiwiY29uY2F0IiwiX3JlZjYiLCJkZXRhY2hlZCIsInRhc2tJdGVyYXRvciIsInN1c3BlbmQiLCJfdGFzayIsImpvaW5lciIsImlzQWJvcnRlZCIsInRhc2tUb0NhbmNlbCIsImtleXMiLCJjb21wbGV0ZWRDb3VudCIsInJlc3VsdHMiLCJjaGlsZENicyIsImNoZWNrRWZmZWN0RW5kIiwiY2hDYkF0S2V5IiwiX3Jlc3BvbnNlIiwicmVzcG9uc2UiLCJzbGljZSIsIl9yZWY3Iiwic2VsZWN0b3IiLCJfcmVmOCIsIm1hdGNoIiwiZml4ZWQiLCJwcm9wIiwiX2RvbmUiLCJfcmVmOSIsIl9tdXRhdG9yTWFwIiwiNzQyIiwicXVldWUiLCJzZW1hcGhvcmUiLCJleGVjIiwicmVsZWFzZSIsInNoaWZ0IiwiNzQzIiwidGFrZW0iLCJzcGF3biIsIklPIiwiVEFLRSIsIlBVVCIsIkFMTCIsIlJBQ0UiLCJDQUxMIiwiQ1BTIiwiRk9SSyIsIkpPSU4iLCJTRUxFQ1QiLCJBQ1RJT05fQ0hBTk5FTCIsIkNBTkNFTExFRCIsIkZMVVNIIiwiR0VUX0NPTlRFWFQiLCJTRVRfQ09OVEVYVCIsIlRFU1RfSElOVCIsInBheWxvYWQiLCJwYXR0ZXJuT3JDaGFubmVsIiwic3luYyIsImdldEZuQ2FsbERlc2MiLCJtZXRoIiwiX2ZuIiwiX2ZuMiIsIl9sZW4yIiwiX2tleTIiLCJfbGVuMyIsIl9rZXkzIiwiX2xlbjQiLCJfa2V5NCIsIl9sZW41IiwiX2tleTUiLCJfbGVuNiIsIl9rZXk2IiwiX2xlbjciLCJfa2V5NyIsIndvcmtlciIsIl9sZW44IiwiX2tleTgiLCJ0YWtlRXZlcnlIZWxwZXIiLCJfbGVuOSIsIl9rZXk5IiwidGFrZUxhdGVzdEhlbHBlciIsIl9sZW4xMCIsIl9rZXkxMCIsInRocm90dGxlSGVscGVyIiwiY3JlYXRlQXNFZmZlY3RUeXBlIiwiNzQ0IiwiX3Rha2VFdmVyeSIsIl90YWtlRXZlcnkyIiwiX3Rha2VMYXRlc3QiLCJfdGFrZUxhdGVzdDIiLCJfdGhyb3R0bGUiLCJfdGhyb3R0bGUyIiwiaGVscGVyTmFtZSIsIjc0NSIsIl9mc21JdGVyYXRvciIsIl9mc21JdGVyYXRvcjIiLCJ5VGFrZSIsInlGb3JrIiwiYWMiLCJzZXRBY3Rpb24iLCJxMSIsInEyIiwicUVuZCIsInNhZmVOYW1lIiwiNzQ2IiwiZnNtSXRlcmF0b3IiLCJlbnRyeSIsImZzbSIsInEwIiwidXBkYXRlU3RhdGUiLCJxTmV4dCIsIl9mc20kcU5leHQiLCJxIiwib3V0cHV0IiwiX3VwZGF0ZVN0YXRlIiwiNzQ3IiwiVU5ERUZJTkVEX0lOUFVUX0VSUk9SIiwiSU5WQUxJRF9CVUZGRVIiLCJlbWl0dGVyIiwiQ0hBTk5FTF9FTkRfVFlQRSIsImEiLCJzdWJzY3JpYmVycyIsInN1YiIsImVtaXQiLCJsZW4iLCJjbG9zZWQiLCJ0YWtlcnMiLCJjaGVja0ZvcmJpZGRlblN0YXRlcyIsIl9fdGFrZXJzX18iLCJfX2Nsb3NlZF9fIiwibm9uZSIsImNoYW4iLCJ1bnN1YnNjcmliZSIsIjc0OCIsIkJVRkZFUl9PVkVSRkxPVyIsIk9OX09WRVJGTE9XX1RIUk9XIiwiT05fT1ZFUkZMT1dfRFJPUCIsIk9OX09WRVJGTE9XX1NMSURFIiwiT05fT1ZFUkZMT1dfRVhQQU5EIiwiemVyb0J1ZmZlciIsInJpbmdCdWZmZXIiLCJsaW1pdCIsIm92ZXJmbG93QWN0aW9uIiwicHVzaEluZGV4IiwicG9wSW5kZXgiLCJpdGVtcyIsImRvdWJsZWRMaW1pdCIsImRyb3BwaW5nIiwic2xpZGluZyIsImV4cGFuZGluZyIsImluaXRpYWxTaXplIiwiNzQ5IiwieUNhbmNlbCIsInNldFRhc2siLCJxMyIsIjc1MCIsImRlbGF5TGVuZ3RoIiwieUFjdGlvbkNoYW5uZWwiLCJ5RGVsYXkiLCJzZXRDaGFubmVsIiwicTQiLCI3NTEiLCJzYWdhTWlkZGxld2FyZUZhY3RvcnkiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJfcmVmJGNvbnRleHQiLCJvbmVycm9yIiwic2FnYUVtaXR0ZXIiLCI3NTIiLCI3NTMiLCI3NTQiLCJfcHVsbCIsIl9wdWxsMiIsIl90b0NvbnN1bWFibGVBcnJheSIsImFycjIiLCJpbml0aWFsU3RhdGUiLCJvcmlnaW5hbF9pc19yZXN0cmljdGVkIiwib3JpZ2luYWxfdXNlcl9wcm9qZWN0cyIsIl9hY3Rpb24kZGF0YSIsInByb2plY3RzIiwibmV3U3RhdGUiLCJvcmlnaW5hbF9wcm9qZWN0cyIsIl91c2VyX3Byb2plY3RzMyIsIl9zdGF0ZSIsIjc1NSIsImJhc2VSZXN0IiwicHVsbEFsbCIsInB1bGwiLCI3NTYiLCJpZGVudGl0eSIsIm92ZXJSZXN0Iiwic2V0VG9TdHJpbmciLCJzdGFydCIsIjc1NyIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJ0cmFuc2Zvcm0iLCJvdGhlckFyZ3MiLCI3NTgiLCJ0aGlzQXJnIiwiNzU5IiwiYmFzZVNldFRvU3RyaW5nIiwic2hvcnRPdXQiLCI3NjAiLCJjb25zdGFudCIsIjc2MSIsIjc2MiIsIkhPVF9DT1VOVCIsIkhPVF9TUEFOIiwibmF0aXZlTm93IiwiRGF0ZSIsIm5vdyIsImNvdW50IiwibGFzdENhbGxlZCIsInN0YW1wIiwicmVtYWluaW5nIiwiNzYzIiwiYmFzZVB1bGxBbGwiLCJ2YWx1ZXMiLCI3NjQiLCJhcnJheU1hcCIsImJhc2VJbmRleE9mIiwiYmFzZUluZGV4T2ZXaXRoIiwiYmFzZVVuYXJ5IiwiY29weUFycmF5IiwiYXJyYXlQcm90byIsIml0ZXJhdGVlIiwiY29tcGFyYXRvciIsInNlZW4iLCJmcm9tSW5kZXgiLCJjb21wdXRlZCIsIjc2NSIsImJhc2VGaW5kSW5kZXgiLCJiYXNlSXNOYU4iLCJzdHJpY3RJbmRleE9mIiwiNzY2IiwiZnJvbVJpZ2h0IiwiNzY3IiwiNzY4IiwiNzY5IiwiNzcwIiwiNzcxIiwiZ2V0SXNSZXN0cmljdGVkIiwiZ2V0VXNlclByb2plY3RzIiwiZ2V0VXNlcklkIiwiZmV0Y2hEYXRhIiwicHV0RGF0YSIsImdldFNhZ2EiLCJwdXRTYWdhIiwiX2F4aW9zIiwiX2F4aW9zMiIsIl9tYXJrZWQiLCJyZWdlbmVyYXRvclJ1bnRpbWUiLCJtYXJrIiwiX21hcmtlZDIiLCJfbWFya2VkMyIsImNhbGxBeGlvcyIsImNvbmZpZyIsImNhdGNoIiwibWV0aG9kIiwidXJsIiwiaGVhZGVycyIsIlgtQ1NSRlRva2VuIiwiZ2V0Q29va2llIiwid3JhcCIsImdldFNhZ2EkIiwiX2NvbnRleHQiLCJwcmV2Iiwic2VudCIsInN0b3AiLCJwdXRTYWdhJCIsIl9jb250ZXh0MiIsIndhdGNoZXJTYWdhJCIsIl9jb250ZXh0MyIsIjc3MiIsImdsb2JhbCIsIk9wIiwiJFN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiaW5Nb2R1bGUiLCJydW50aW1lIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJ0cnlMb2NzTGlzdCIsInByb3RvR2VuZXJhdG9yIiwiR2VuZXJhdG9yIiwiZ2VuZXJhdG9yIiwiQ29udGV4dCIsIl9pbnZva2UiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0IiwiR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCIsIkdlblN0YXRlRXhlY3V0aW5nIiwiR2VuU3RhdGVDb21wbGV0ZWQiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJOYXRpdmVJdGVyYXRvclByb3RvdHlwZSIsIkdwIiwiZGlzcGxheU5hbWUiLCJkZWZpbmVJdGVyYXRvck1ldGhvZHMiLCJpc0dlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuRnVuIiwiY3RvciIsImF3cmFwIiwiX19hd2FpdCIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJyZWNvcmQiLCJ1bndyYXBwZWQiLCJwcmV2aW91c1Byb21pc2UiLCJlbnF1ZXVlIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJhc3luYyIsIml0ZXIiLCJkb25lUmVzdWx0IiwiZGVsZWdhdGUiLCJkZWxlZ2F0ZVJlc3VsdCIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwibG9jcyIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJyZXZlcnNlIiwicG9wIiwiaXRlcmF0b3JNZXRob2QiLCJpc05hTiIsInNraXBUZW1wUmVzZXQiLCJjaGFyQXQiLCJyb290RW50cnkiLCJyb290UmVjb3JkIiwicnZhbCIsImhhbmRsZSIsImxvYyIsImNhdWdodCIsImhhc0NhdGNoIiwiaGFzRmluYWxseSIsImZpbmFsbHlFbnRyeSIsImNvbXBsZXRlIiwiZmluaXNoIiwidGhyb3duIiwiZGVsZWdhdGVZaWVsZCIsIkZ1bmN0aW9uIiwiNzczIiwiNzc0IiwiQXhpb3MiLCJkZWZhdWx0cyIsImNyZWF0ZUluc3RhbmNlIiwiZGVmYXVsdENvbmZpZyIsInJlcXVlc3QiLCJleHRlbmQiLCJheGlvcyIsImluc3RhbmNlQ29uZmlnIiwibWVyZ2UiLCJDYW5jZWwiLCJDYW5jZWxUb2tlbiIsImlzQ2FuY2VsIiwicHJvbWlzZXMiLCJzcHJlYWQiLCI3NzUiLCJpc0J1ZmZlciIsImlzQXJyYXlCdWZmZXIiLCJpc0Zvcm1EYXRhIiwiRm9ybURhdGEiLCJpc0FycmF5QnVmZmVyVmlldyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzVW5kZWZpbmVkIiwiaXNPYmplY3QiLCJpc0RhdGUiLCJpc0ZpbGUiLCJpc0Jsb2IiLCJpc0Z1bmN0aW9uIiwiaXNTdHJlYW0iLCJwaXBlIiwiaXNVUkxTZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0cmltIiwic3RyIiwicmVwbGFjZSIsImlzU3RhbmRhcmRCcm93c2VyRW52IiwibmF2aWdhdG9yIiwicHJvZHVjdCIsImwiLCJhc3NpZ25WYWx1ZSIsIjc3NiIsIjc3NyIsImlzU2xvd0J1ZmZlciIsIl9pc0J1ZmZlciIsInJlYWRGbG9hdExFIiwiNzc4IiwiSW50ZXJjZXB0b3JNYW5hZ2VyIiwiZGlzcGF0Y2hSZXF1ZXN0IiwiaW50ZXJjZXB0b3JzIiwidG9Mb3dlckNhc2UiLCJjaGFpbiIsInVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzIiwiaW50ZXJjZXB0b3IiLCJ1bnNoaWZ0IiwiZnVsZmlsbGVkIiwicmVqZWN0ZWQiLCJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCJmb3JFYWNoTWV0aG9kTm9EYXRhIiwiZm9yRWFjaE1ldGhvZFdpdGhEYXRhIiwiNzc5Iiwibm9ybWFsaXplSGVhZGVyTmFtZSIsIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwiQ29udGVudC1UeXBlIiwic2V0Q29udGVudFR5cGVJZlVuc2V0IiwiZ2V0RGVmYXVsdEFkYXB0ZXIiLCJhZGFwdGVyIiwiWE1MSHR0cFJlcXVlc3QiLCJ0cmFuc2Zvcm1SZXF1ZXN0Iiwic3RyaW5naWZ5IiwidHJhbnNmb3JtUmVzcG9uc2UiLCJ0aW1lb3V0IiwieHNyZkNvb2tpZU5hbWUiLCJ4c3JmSGVhZGVyTmFtZSIsIm1heENvbnRlbnRMZW5ndGgiLCJ2YWxpZGF0ZVN0YXR1cyIsInN0YXR1cyIsImNvbW1vbiIsIkFjY2VwdCIsIjc4MCIsIm5vcm1hbGl6ZWROYW1lIiwicHJvY2Vzc0hlYWRlciIsInRvVXBwZXJDYXNlIiwiNzgxIiwic2V0dGxlIiwiYnVpbGRVUkwiLCJwYXJzZUhlYWRlcnMiLCJpc1VSTFNhbWVPcmlnaW4iLCJjcmVhdGVFcnJvciIsImJ0b2EiLCJ4aHJBZGFwdGVyIiwiZGlzcGF0Y2hYaHJSZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImxvYWRFdmVudCIsInhEb21haW4iLCJYRG9tYWluUmVxdWVzdCIsIm9ucHJvZ3Jlc3MiLCJoYW5kbGVQcm9ncmVzcyIsIm9udGltZW91dCIsImhhbmRsZVRpbWVvdXQiLCJhdXRoIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIkF1dGhvcml6YXRpb24iLCJvcGVuIiwicGFyYW1zIiwicGFyYW1zU2VyaWFsaXplciIsImhhbmRsZUxvYWQiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VVUkwiLCJyZXNwb25zZUhlYWRlcnMiLCJnZXRBbGxSZXNwb25zZUhlYWRlcnMiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVRleHQiLCJzdGF0dXNUZXh0IiwiaGFuZGxlRXJyb3IiLCJjb29raWVzIiwieHNyZlZhbHVlIiwid2l0aENyZWRlbnRpYWxzIiwicmVhZCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbkRvd25sb2FkUHJvZ3Jlc3MiLCJvblVwbG9hZFByb2dyZXNzIiwidXBsb2FkIiwiY2FuY2VsVG9rZW4iLCJvbkNhbmNlbGVkIiwic2VuZCIsIjc4MiIsIjc4MyIsImVuaGFuY2VFcnJvciIsImNvZGUiLCI3ODQiLCI3ODUiLCJlbmNvZGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzZXJpYWxpemVkUGFyYW1zIiwicGFydHMiLCJzZXJpYWxpemUiLCJwYXJzZVZhbHVlIiwidG9JU09TdHJpbmciLCI3ODYiLCJpZ25vcmVEdXBsaWNhdGVPZiIsInBhcnNlZCIsInBhcnNlciIsImxpbmUiLCJzdWJzdHIiLCI3ODciLCJzdGFuZGFyZEJyb3dzZXJFbnYiLCJtc2llIiwidGVzdCIsInVzZXJBZ2VudCIsInVybFBhcnNpbmdOb2RlIiwib3JpZ2luVVJMIiwicmVzb2x2ZVVSTCIsImhyZWYiLCJzZXRBdHRyaWJ1dGUiLCJwcm90b2NvbCIsImhvc3QiLCJzZWFyY2giLCJoYXNoIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJsb2NhdGlvbiIsInJlcXVlc3RVUkwiLCJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCI3ODgiLCJjaGFycyIsIkUiLCJibG9jayIsImNoYXJDb2RlIiwiaWR4IiwiY2hhckNvZGVBdCIsIjc4OSIsIndyaXRlIiwiZXhwaXJlcyIsInBhdGgiLCJkb21haW4iLCJzZWN1cmUiLCJjb29raWUiLCJ0b0dNVFN0cmluZyIsIlJlZ0V4cCIsImRlY29kZVVSSUNvbXBvbmVudCIsIjc5MCIsImhhbmRsZXJzIiwidXNlIiwiZWplY3QiLCJmb3JFYWNoSGFuZGxlciIsImgiLCI3OTEiLCJ0cmFuc2Zvcm1EYXRhIiwiaXNBYnNvbHV0ZVVSTCIsImNvbWJpbmVVUkxzIiwidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsInRocm93SWZSZXF1ZXN0ZWQiLCJiYXNlVVJMIiwiY2xlYW5IZWFkZXJDb25maWciLCJvbkFkYXB0ZXJSZXNvbHV0aW9uIiwib25BZGFwdGVyUmVqZWN0aW9uIiwicmVhc29uIiwiNzkyIiwiZm5zIiwiNzkzIiwiX19DQU5DRUxfXyIsIjc5NCIsIjc5NSIsInJlbGF0aXZlVVJMIiwiNzk2IiwiNzk3IiwiZXhlY3V0b3IiLCJwcm9taXNlRXhlY3V0b3IiLCJ0b2tlbiIsIjc5OCIsImNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiQUFBQUEsZUFBYztJQUVSQyxHQUNBLFNBQVVDLFFBQVFDLFNBQVNDO1FBRWhDO1FDRUQsSUFBQUMsU0FBQUQsb0JBQUE7UURFQyxJQUFJRSxVQUFVQyx1QkFBdUJGO1FDRHRDLElBQUFHLFlBQUFKLG9CQUFBO1FES0MsSUFBSUssYUFBYUYsdUJBQXVCQztRQ0h6QyxJQUFBRSxPQUFBTixvQkFBQTtRRE9DLElBQUlPLFFBQVFKLHVCQUF1Qkc7UUNMcEMsSUFBQUUsU0FBQVIsb0JBQUE7UUFDQSxJQUFBUyxhQUFBVCxvQkFBQTtRRFVDLElBQUlVLGNBQWNQLHVCQUF1Qk07UUNUMUMsSUFBQUUsY0FBQVgsb0JBQUE7UUFFQSxJQUFBWSxXQUFBWixvQkFBQTtRQUNBLElBQUFhLFNBQUFiLG9CQUFBO1FEY0MsU0FBU0csdUJBQXVCVztZQUFPLE9BQU9BLE9BQU9BLElBQUlDLGFBQWFEO2dCQUFRRSxTQUFTRjs7O1FDWHhGLElBQU1HLGtCQUFpQixHQUFBUCxZQUFBTTtRQUd2QixJQUFNRSxnQkFBZ0JDLE9BQU9DLGdDQUFnQ0QsT0FBT0M7UUFFcEUsSUFBSUM7UUFDSixJQUFJSCxlQUFlO1lBQ2ZHLFNBQVEsR0FBQWIsT0FBQWMsYUFBWUMsbUJBQVMsR0FBQWYsT0FBQWdCLFVBQVEsR0FBQWhCLE9BQUFpQixpQkFBZ0JSLGlCQUFpQkM7ZUFDbkU7WUFDSEcsU0FBUSxHQUFBYixPQUFBYyxhQUFZQyxtQkFBUyxHQUFBZixPQUFBaUIsaUJBQWdCUjs7UUFHakRBLGVBQWVTLElBQUlDO1FBRW5CQyxTQUFTQyxpQkFBaUIsb0JBQW9CO1lBQzFDQyxtQkFBU0MsT0FDTDdCLFFBQUFjLFFBQUFnQixjQUFDckIsWUFBQXNCO2dCQUFTWixPQUFPQTtlQUNibkIsUUFBQWMsUUFBQWdCLGNBQUN6QixNQUFBUyxTQUFELFFBRUpZLFNBQVNNLGVBQWU7OztJRDBCMUJDLEtBQ0EsU0FBVXJDLFFBQVFDLFNBQVNDO1FBRWhDO1FBRUFvQyxPQUFPQyxlQUFldEMsU0FBUztZQUMzQnVDLE9BQU87O1FBR1gsSUFBSUMsZUFBZTtZQUFjLFNBQVNDLGlCQUFpQkMsUUFBUUM7Z0JBQVMsS0FBSyxJQUFJQyxJQUFJLEdBQUdBLElBQUlELE1BQU1FLFFBQVFELEtBQUs7b0JBQUUsSUFBSUUsYUFBYUgsTUFBTUM7b0JBQUlFLFdBQVdDLGFBQWFELFdBQVdDLGNBQWM7b0JBQU9ELFdBQVdFLGVBQWU7b0JBQU0sSUFBSSxXQUFXRixZQUFZQSxXQUFXRyxXQUFXO29CQUFNWixPQUFPQyxlQUFlSSxRQUFRSSxXQUFXSSxLQUFLSjs7O1lBQWlCLE9BQU8sU0FBVUssYUFBYUMsWUFBWUM7Z0JBQWUsSUFBSUQsWUFBWVgsaUJBQWlCVSxZQUFZRyxXQUFXRjtnQkFBYSxJQUFJQyxhQUFhWixpQkFBaUJVLGFBQWFFO2dCQUFjLE9BQU9GOzs7UUVuRWppQixJQUFBakQsU0FBQUQsb0JBQUE7UUZ1RUMsSUFBSUUsVUFBVUMsdUJBQXVCRjtRRXRFdEMsSUFBQVUsY0FBQVgsb0JBQUE7UUFDQSxJQUFBc0QsU0FBQXRELG9CQUFBO1FBRUEsSUFBQXVELFNBQUF2RCxvQkFBQTtRRjJFQyxJRTNFV3dELElGMkVIQyx3QkFBd0JGO1FBRWhDLFNBQVNFLHdCQUF3QjNDO1lBQU8sSUFBSUEsT0FBT0EsSUFBSUMsWUFBWTtnQkFBRSxPQUFPRDttQkFBWTtnQkFBRSxJQUFJNEM7Z0JBQWEsSUFBSTVDLE9BQU8sTUFBTTtvQkFBRSxLQUFLLElBQUltQyxPQUFPbkMsS0FBSzt3QkFBRSxJQUFJc0IsT0FBT2lCLFVBQVVNLGVBQWVDLEtBQUs5QyxLQUFLbUMsTUFBTVMsT0FBT1QsT0FBT25DLElBQUltQzs7O2dCQUFVUyxPQUFPMUMsVUFBVUY7Z0JBQUssT0FBTzRDOzs7UUFFbFEsU0FBU3ZELHVCQUF1Qlc7WUFBTyxPQUFPQSxPQUFPQSxJQUFJQyxhQUFhRDtnQkFBUUUsU0FBU0Y7OztRQUV2RixTQUFTK0MsZ0JBQWdCQyxVQUFVWjtZQUFlLE1BQU1ZLG9CQUFvQlosY0FBYztnQkFBRSxNQUFNLElBQUlhLFVBQVU7OztRQUVoSCxTQUFTQywyQkFBMkJDLE1BQU1MO1lBQVEsS0FBS0ssTUFBTTtnQkFBRSxNQUFNLElBQUlDLGVBQWU7O1lBQWdFLE9BQU9OLGdCQUFnQkEsU0FBUyxtQkFBbUJBLFNBQVMsY0FBY0EsT0FBT0s7O1FBRXpPLFNBQVNFLFVBQVVDLFVBQVVDO1lBQWMsV0FBV0EsZUFBZSxjQUFjQSxlQUFlLE1BQU07Z0JBQUUsTUFBTSxJQUFJTixVQUFVLG9FQUFvRU07O1lBQWVELFNBQVNmLFlBQVlqQixPQUFPa0MsT0FBT0QsY0FBY0EsV0FBV2hCO2dCQUFha0I7b0JBQWVqQyxPQUFPOEI7b0JBQVV0QixZQUFZO29CQUFPRSxVQUFVO29CQUFNRCxjQUFjOzs7WUFBVyxJQUFJc0IsWUFBWWpDLE9BQU9vQyxpQkFBaUJwQyxPQUFPb0MsZUFBZUosVUFBVUMsY0FBY0QsU0FBU0ssWUFBWUo7O1FFbkZsZSxJQUFNSyxlQUFlLFNBQWZBLGFBQWVDO1lBQWdELElBQTdDQyxJQUE2Q0QsS0FBN0NDLEdBQUdDLGdCQUEwQ0YsS0FBMUNFLGVBQWVDLHVCQUEyQkgsS0FBM0JHO1lBQ3RDLE9BQ0k1RSxRQUFBYyxRQUFBZ0IsY0FBQSxjQUNJOUIsUUFBQWMsUUFBQWdCLGNBQUEsZUFDSTlCLFFBQUFjLFFBQUFnQixjQUFBO2dCQUNJK0MsSUFBRztnQkFDSEMsTUFBSztnQkFDTEMsU0FBU0o7Z0JBQ1RLLFVBQVVKO2dCQUlkNUUsUUFBQWMsUUFBQWdCLGNBQUE7Z0JBQ0ltRDtvQkFDSUMsUUFBUVAsZ0JBQ0ZELEVBQUUsNEJBQ0ZBLEVBQUU7O2lCQUluQkMsZ0JBQ0czRSxRQUFBYyxRQUFBZ0IsY0FBQTtnQkFDSXFELFdBQVU7Z0JBQ1ZGO29CQUEyQkMsUUFBUVIsRUFBRTs7aUJBR3pDMUUsUUFBQWMsUUFBQWdCLGNBQUE7O1FBTWhCLElBQU1zRCxVQUFVLFNBQVZBLFFBQVVDO1lBQTJFLElBQXhFWCxJQUF3RVcsTUFBeEVYLEdBQUdZLFVBQXFFRCxNQUFyRUMsU0FBU0MsZ0JBQTRERixNQUE1REUsZUFBZVosZ0JBQTZDVSxNQUE3Q1YsZUFBZWEsMEJBQThCSCxNQUE5Qkc7WUFJekQsSUFBTVQsV0FBV0osaUJBQWtCWSxrQkFBaUIsR0FBQW5DLE9BQUFxQyxTQUFRSCxRQUFRVCxJQUFJVSxnQkFDcEVHLFdBQVdmLGdCQUFnQixLQUFLLFlBQ2hDZ0Isa0JBQWtCWixVQUFVLHFCQUFxQixJQUNqRGEsY0FBY0YsV0FBV0MsaUJBQ3pCRSxjQUFjSCxXQUFXO1lBQzdCLE9BQ0kxRixRQUFBYyxRQUFBZ0IsY0FBQTtnQkFDSWlCLEtBQUt1QyxRQUFRVDtnQkFDYkEsSUFBSVMsUUFBUVQ7Z0JBQ1ppQixTQUFTTjtnQkFDVEwsV0FBV1M7ZUFFWDVGLFFBQUFjLFFBQUFnQixjQUFBLFlBQ0k5QixRQUFBYyxRQUFBZ0IsY0FBQTtnQkFDSStDLElBQUlTLFFBQVFUO2dCQUNaQyxNQUFLO2dCQUNMQyxTQUFTQTtnQkFDVFcsV0FBV2Y7Z0JBQ1hvQixVQUFVO2lCQUdsQi9GLFFBQUFjLFFBQUFnQixjQUFBO2dCQUFJcUQsV0FBV1U7ZUFBY1AsUUFBUVQsS0FDckM3RSxRQUFBYyxRQUFBZ0IsY0FBQSxZQUFLd0QsUUFBUVUsU0FBU3RCLEVBQUU7O1FBS3BDLElBQU11QixZQUFZLFNBQVpBLFVBQVlDO1lBQStELElBQTVEeEIsSUFBNER3QixNQUE1RHhCLEdBQUd5QixZQUF5REQsTUFBekRDLFdBQVdDLDJCQUE4Q0YsTUFBOUNFLDBCQUEwQnpCLGdCQUFvQnVCLE1BQXBCdkI7WUFDekQsSUFBTWUsV0FBV2YsZ0JBQWdCLFFBQVEsTUFDckNRLFlBQVksdUJBQXVCUixnQkFBZ0IsS0FBSztZQUM1RCxPQUNJM0UsUUFBQWMsUUFBQWdCLGNBQUE7Z0JBQUtxRCxXQUFXUixnQkFBZ0IwQixZQUFZO2VBQ3hDckcsUUFBQWMsUUFBQWdCLGNBQUE7Z0JBQVFnRSxTQUFTTTtnQkFBMEJWLFVBQVVBO2dCQUFVUCxXQUFXQTtlQUNyRWdCLFlBQVl6QixFQUFFLHdCQUF3QkEsRUFBRTs7UUFNekQsSUFBTTRCLFFBQVEsU0FBUkEsTUFBUUM7WUFBa0IsSUFBZjdCLElBQWU2QixNQUFmN0IsR0FBRzhCLFFBQVlELE1BQVpDO1lBQ2hCLE9BQU9BLFFBQVF4RyxRQUFBYyxRQUFBZ0IsY0FBQTtnQkFBS3FELFdBQVU7ZUFBU1QsRUFBRSxzQkFBc0I4QixNQUFNQyxXQUFpQjs7UUFHMUYsSUFBTUMsV0FBVyxTQUFYQSxTQUFXQztZQVVYLElBVEZqQyxJQVNFaUMsTUFURmpDLEdBQ0E4QixRQVFFRyxNQVJGSCxPQUNBSSxlQU9FRCxNQVBGQyxjQUNBckIsZ0JBTUVvQixNQU5GcEIsZUFDQVosZ0JBS0VnQyxNQUxGaEMsZUFDQXdCLFlBSUVRLE1BSkZSLFdBQ0F2Qix1QkFHRStCLE1BSEYvQixzQkFDQXdCLDJCQUVFTyxNQUZGUCwwQkFDQVosMEJBQ0VtQixNQURGbkI7WUFFQSxJQUFNTCxZQUFZUixnQkFBZ0IsS0FBSztZQUN2QyxPQUNJM0UsUUFBQWMsUUFBQWdCLGNBQUEsY0FDSTlCLFFBQUFjLFFBQUFnQixjQUFDd0U7Z0JBQU01QixHQUFHQTtnQkFBRzhCLE9BQU9BO2dCQUNwQnhHLFFBQUFjLFFBQUFnQixjQUFDMEM7Z0JBQ0dFLEdBQUdBO2dCQUNIQyxlQUFlQTtnQkFDZkMsc0JBQXNCQTtnQkFFMUI1RSxRQUFBYyxRQUFBZ0IsY0FBQ21FO2dCQUNHdkIsR0FBR0E7Z0JBQ0h5QixXQUFXQTtnQkFDWEMsMEJBQTBCQTtnQkFDMUJ6QixlQUFlQTtnQkFFbkIzRSxRQUFBYyxRQUFBZ0IsY0FBQSxlQUNJOUIsUUFBQWMsUUFBQWdCLGNBQUEsZUFDSTlCLFFBQUFjLFFBQUFnQixjQUFBLFlBQ0k5QixRQUFBYyxRQUFBZ0IsY0FBQTtnQkFBSXFELFdBQVdBO2VBQVlULEVBQUUsWUFDN0IxRSxRQUFBYyxRQUFBZ0IsY0FBQTtnQkFBSXFELFdBQVdBO2VBQVlULEVBQUUsZ0JBQzdCMUUsUUFBQWMsUUFBQWdCLGNBQUE7Z0JBQUlxRCxXQUFXQTtlQUFZVCxFQUFFLHFCQUdyQzFFLFFBQUFjLFFBQUFnQixjQUFBLGVBQ0s4RSxhQUFhQyxJQUFJLFNBQUN2QjtnQkFBRCxPQUNkdEYsUUFBQWMsUUFBQWdCLGNBQUNzRDtvQkFDR1YsR0FBR0E7b0JBQ0gzQixLQUFLdUMsUUFBUVQ7b0JBQ2JTLFNBQVNBO29CQUNUQyxlQUFlQTtvQkFDZlosZUFBZUE7b0JBQ2ZhLHlCQUF5QkE7Ozs7UUZtSnBELElFMUlLc0IsTUYwSUssU0FBVUM7WUFDaEI5QyxVQUFVNkMsS0FBS0M7WUUxSWhCLFNBQUFELElBQVl0RTtnQkFBT21CLGdCQUFBcUQsTUFBQUY7Z0JBQUEsSUFBQUcsUUFBQW5ELDJCQUFBa0QsT0FBQUYsSUFBQXZDLGFBQUFyQyxPQUFBZ0YsZUFBQUosTUFBQXBELEtBQUFzRCxNQUNUeEU7Z0JBQ055RSxNQUFLRSx3QkFBd0JGLE1BQUtFLHNCQUFzQkMsS0FBM0JIO2dCQUM3QkEsTUFBS0kscUJBQXFCSixNQUFLSSxtQkFBbUJELEtBQXhCSDtnQkFDMUJBLE1BQUtLLHlCQUF5QkwsTUFBS0ssdUJBQXVCRixLQUE1Qkg7Z0JBQzlCQSxNQUFLdkMsSUFBSXVDLE1BQUt2QyxFQUFFMEMsS0FBUEg7Z0JBTE0sT0FBQUE7O1lGMkpsQjVFLGFBQWF5RTtnQkFDVC9ELEtBQUs7Z0JBQ0xYLE9BQU8sU0FBU3NDLEVFcEpuQjZDO29CQUNFLE9BQU9QLEtBQUt4RSxNQUFNZ0YsV0FBV1IsS0FBS3hFLE1BQU1nRixRQUFRRDs7O2dCRnVKL0N4RSxLQUFLO2dCQUNMWCxPQUFPLFNBQVNpRixtQkVySkZJO29CQUNmQSxFQUFFQztvQkFDRlYsS0FBS3hFLE1BQU1tRixxQkFBcUJGLEVBQUVsRixPQUFPd0M7OztnQkZ3SnhDaEMsS0FBSztnQkFDTFgsT0FBTyxTQUFTa0YsdUJFdEpFRztvQkFDbkJBLEVBQUVDO29CQUNGVixLQUFLeEUsTUFBTW9GOzs7Z0JGeUpWN0UsS0FBSztnQkFDTFgsT0FBTyxTQUFTK0Usc0JFdkpDTTtvQkFDbEJBLEVBQUVDO29CQUNGLElBQU1uRixTQUFTa0YsRUFBRUk7b0JBQ2pCLEtBQUt0RixPQUFPdUYsVUFBVUMsU0FBUyxhQUFhO3dCQUN4QyxJQUFNbEQsS0FBS21ELFNBQVN6RixPQUFPMEYsYUFBYTt3QkFDeENqQixLQUFLeEUsTUFBTTBGLHlCQUF5QnJEOzs7O2dCRjJKdkM5QixLQUFLO2dCQUNMWCxPQUFPLFNBQVMrRjtvQkV2SmpCLElBQU1DLFVBQVMsR0FBQWhGLE9BQUFpRixpQkFBZ0Isb0JBQW9CeEQ7b0JBQ25EbUMsS0FBS3hFLE1BQU04Rjt3QkFBV0Y7O29CQUV0QixJQUFNWixXQUFVLEdBQUFwRSxPQUFBaUYsaUJBQWdCO29CQUNoQ3JCLEtBQUt4RSxNQUFNOEY7d0JBQVdkOztvQkFFdEJSLEtBQUt4RSxNQUFNK0Ysb0JBQW9CSDs7O2dCRjJKOUJyRixLQUFLO2dCQUNMWCxPQUFPLFNBQVNQO29CRXpKWixJQUFBMkcsU0FDb0V4QixLQUFLeEUsT0FBdEVtQyxnQkFESDZELE9BQ0c3RCxlQUFld0IsWUFEbEJxQyxPQUNrQnJDLFdBQVdTLGVBRDdCNEIsT0FDNkI1QixjQUFjckIsZ0JBRDNDaUQsT0FDMkNqRCxlQUFlaUIsUUFEMURnQyxPQUMwRGhDO29CQUMvRCxPQUFPSSxlQUNINUcsUUFBQWMsUUFBQWdCLGNBQUM0RTt3QkFDR2hDLEdBQUdzQyxLQUFLdEM7d0JBQ1I4QixPQUFPQTt3QkFDUDdCLGVBQWVBO3dCQUNmd0IsV0FBV0E7d0JBQ1hTLGNBQWNBO3dCQUNkckIsZUFBZUE7d0JBQ2ZYLHNCQUFzQm9DLEtBQUtLO3dCQUMzQmpCLDBCQUEwQlksS0FBS007d0JBQy9COUIseUJBQXlCd0IsS0FBS0c7eUJBR2xDbkgsUUFBQWMsUUFBQWdCLGNBQUEsY0FBTSxHQUFBc0IsT0FBQXNCLEdBQUU7OztZRm9LZixPQUFPb0M7VUU5Tk0yQixnQkFBTUM7UUErRHhCLElBQU1DLGtCQUFrQixTQUFsQkEsZ0JBQW1CQztZQUFVLElBRTNCQyxXQU9BRCxNQVBBQyxVQUNBckMsUUFNQW9DLE1BTkFwQyxPQUNBSSxlQUtBZ0MsTUFMQWhDLGNBQ0FqQyxnQkFJQWlFLE1BSkFqRSxlQUNBd0IsWUFHQXlDLE1BSEF6QyxXQUNBWixnQkFFQXFELE1BRkFyRCxlQUNBaUMsVUFDQW9CLE1BREFwQjtZQUVKO2dCQUFTcUI7Z0JBQVVyQztnQkFBT0k7Z0JBQWNqQztnQkFBZXdCO2dCQUFXWjtnQkFBZWlDOzs7UUFHckYsSUFBTXNCLHFCQUFxQixTQUFyQkEsbUJBQXNCQztZQUN4QjtnQkFBU1IscUJBQXFCLFNBQUFBLG9CQUFBSDtvQkFBQSxPQUFVVzt3QkFDNUJqRSxNQUFNeEIsRUFBRTBGO3dCQUNSQzs0QkFBUWI7Ozs7Z0JBQ1JFLFVBQVUsU0FBQUEsU0FBQVc7b0JBQUEsT0FBUUY7d0JBQ2xCakUsTUFBTXhCLEVBQUU0Rjt3QkFDUkQ7OztnQkFDQWYsMEJBQTBCLFNBQUFBLHlCQUFBaUI7b0JBQUEsT0FBYUo7d0JBQ3ZDakUsTUFBTXhCLEVBQUU4Rjt3QkFDUkg7NEJBQVFFOzs7O2dCQUNSeEIsc0JBQXNCLFNBQUFBLHFCQUFBaEQ7b0JBQUEsT0FBaUJvRTt3QkFDdkNqRSxNQUFNeEIsRUFBRStGO3dCQUNSSjs0QkFBUXRFOzs7O2dCQUNSaUQsbUJBQW1CLFNBQUFBO29CQUFBLE9BQU1tQjt3QkFBV2pFLE1BQU14QixFQUFFZ0c7Ozs7O1FGOEszRHpKLFFBQVFpQixXRTNLTSxHQUFBTCxZQUFBOEksU0FBUVosaUJBQWlCRyxvQkFBb0JoQzs7SUYrS3REMEMsS0FDQSxTQUFVNUosUUFBUUMsU0FBU0M7UUFFaEM7UUFFQW9DLE9BQU9DLGVBQWV0QyxTQUFTO1lBQzNCdUMsT0FBTzs7UUFFWHZDLFFBQVF3SSxrQkFBa0J4SSxRQUFRNEYsVUFBVTVGLFFBQVE0SixZQUFZcEQ7UUczWmpFLElBQUFxRCxTQUFBNUosb0JBQUE7UUgrWkMsSUFBSTZKLFVBQVUxSix1QkFBdUJ5SjtRQUVyQyxTQUFTekosdUJBQXVCVztZQUFPLE9BQU9BLE9BQU9BLElBQUlDLGFBQWFEO2dCQUFRRSxTQUFTRjs7O1FHL1pqRixJQUFNNkk7WUFDVEcsc0JBQXNCLFNBQUFBLHFCQUFBL0U7Z0JBQUEsMENBQXVDQSxLQUF2Qzs7O1FBR25CLElBQU1ZLDRCQUFVLFNBQVZBLFFBQVc3RSxLQUFLaUo7WUFBTixPQUFjQSxPQUFPQSxJQUFJQyxRQUFRbEosVUFBVTs7UUFFM0QsSUFBTXlILDRDQUFrQixTQUFsQkEsZ0JBQWtCMEI7WUFDM0IsT0FBT0MsS0FBS0MsTUFBTXZJLFNBQVNNLGVBQWUrSCxhQUFhRzs7O0lIK2FyREMsS0FDQSxTQUFVdkssUUFBUUM7UUFFdkI7UUFFQXFDLE9BQU9DLGVBQWV0QyxTQUFTO1lBQzNCdUMsT0FBTzs7UUk3YkwsSUFDSDhHLGdDQUFZLGFBRVpGLHNDQUFlLGdCQUNmb0IsNENBQWtCLG1CQUNsQkMsNENBQWtCLG1CQUVsQkMsc0NBQWUsZ0JBQ2ZDLDRDQUFrQixtQkFDbEJDLDRDQUFrQixtQkFFbEJwQiw4REFBMkIsNEJBQzNCQyxzREFBdUIsd0JBQ3ZCQyxrRUFBNkI7O0lKOGMzQm1CLEtBQ0EsU0FBVTdLLFFBQVFDLFNBQVNDO1FLcGVqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUNBaEIsUUFBQTZLLFFBQUE3SyxRQUFBOEssVUFBQTlLLFFBQUErSyxTQUFBL0ssUUFBQWdMLFNBQUFoTCxRQUFBaUwsUUFBQWpMLFFBQUFrTCxXQUFBbEwsUUFBQW1MLGFBQUFuTCxRQUFBb0wsWUFBQXBMLFFBQUFxTCxVQUFBckwsUUFBQXNMLFVBQUF0TCxRQUFBdUwsZUFBQXZMLFFBQUF3TCxNQUFBeEwsUUFBQXlMLFVBQUFqRjtRQUVBLElBQUFrRixXQUFBekwsb0JBQUE7UUFFQW9DLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFELFNBQUFEOzs7UUFJQSxJQUFBRyxXQUFBM0wsb0JBQUE7UUFFQW9DLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFDLFNBQUFKOzs7UUFHQW5KLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFDLFNBQUFMOzs7UUFHQWxKLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFDLFNBQUFOOzs7UUFJQSxJQUFBTyxXQUFBNUwsb0JBQUE7UUFFQW9DLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFFLFNBQUFSOzs7UUFJQSxJQUFBUyxlQUFBN0wsb0JBQUE7UUFFQW9DLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFHLGFBQUFWOzs7UUFHQS9JLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFHLGFBQUFYOzs7UUFHQTlJLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFHLGFBQUFaOzs7UUFJQSxJQUFBM0gsU0FBQXRELG9CQUFBO1FBRUFvQyxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBcEksT0FBQTBIOzs7UUFHQTVJLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFwSSxPQUFBeUg7OztRQUlBLElBQUFlLE1BQUE5TCxvQkFBQTtRQUVBb0MsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQWhCOzs7UUFJQSxJQUFBaUIsY0FBQS9MLG9CQUFBO1FBRUEsSUFBQWdNLGVBQUE3TCx1QkFBQTRMO1FBRUEsSUFBQUUsV0FBQWpNLG9CQUFBO1FBRUEsSUFBQTZLLFVBQUFwSCx3QkFBQXdJO1FBRUEsSUFBQUMsVUFBQWxNLG9CQUFBO1FBRUEsSUFBQTRLLFFBQUFuSCx3QkFBQXlJO1FBRUEsU0FBQXpJLHdCQUFBM0M7WUFBdUMsSUFBQUEsV0FBQUMsWUFBQTtnQkFBNkIsT0FBQUQ7bUJBQWM7Z0JBQU8sSUFBQTRDO2dCQUFpQixJQUFBNUMsT0FBQTtvQkFBbUIsU0FBQW1DLE9BQUFuQyxLQUFBO3dCQUF1QixJQUFBc0IsT0FBQWlCLFVBQUFNLGVBQUFDLEtBQUE5QyxLQUFBbUMsTUFBQVMsT0FBQVQsT0FBQW5DLElBQUFtQzs7O2dCQUFnRlMsT0FBQTFDLFVBQUFGO2dCQUFzQixPQUFBNEM7OztRQUUxUCxTQUFBdkQsdUJBQUFXO1lBQXNDLE9BQUFBLFdBQUFDLGFBQUFEO2dCQUF1Q0UsU0FBQUY7OztRQUU3RWYsUUFBQWlCLFVBQUFnTCxhQUFBaEw7UUFDQWpCLFFBQUE4SztRQUNBOUssUUFBQTZLOztJTDBlTXVCLEtBQ0EsU0FBVXJNLFFBQVFDLFNBQVNDO1NNdGxCakMsU0FBQW9NO1lBQUE7WUFFQXJNLFFBQUFnQixhQUFBO1lBQ0FoQixRQUFBeUw7WUFFQSxJQUFBbEksU0FBQXRELG9CQUFBO1lBRUEsSUFBQXFNLFFBQUFyTSxvQkFBQTtZQUVBLElBQUFzTSxTQUFBbk0sdUJBQUFrTTtZQUVBLFNBQUFsTSx1QkFBQVc7Z0JBQXNDLE9BQUFBLFdBQUFDLGFBQUFEO29CQUF1Q0UsU0FBQUY7OztZQUU3RSxJQUFBeUwscUJBQUE7WUFDQSxJQUFBQyxvQkFBQUQscUJBQUE7WUFFQSxTQUFBZixRQUFBaUIsZ0JBQUFDO2dCQUNBLFNBQUFDLE9BQUFDLFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQUgsT0FBQSxJQUFBQSxPQUFBLFFBQUFJLE9BQUEsR0FBb0ZBLE9BQUFKLE1BQWFJLFFBQUE7b0JBQ2pHRixLQUFBRSxPQUFBLEtBQUFILFVBQUFHOztnQkFHQSxJQUFBQyxnQkFBQTtnQkFFQSxJQUFBMUosT0FBQTJKLEdBQUFELFNBQUFQLGlCQUFBO29CQUNBLElBQUFMLFFBQUFjLElBQUFDLGFBQUE7eUJBQ0EsR0FBQTdKLE9BQUE4SixLQUFBLCtFQUFBYjs7b0JBRUFTLFdBQUFQO29CQUNBQSxpQkFBQUM7dUJBQ0c7cUJBQ0gsR0FBQXBKLE9BQUErSixPQUFBWCxNQUFBcEosT0FBQTJKLEdBQUFLLE1BQUFkO29CQUNBUSxXQUFBTixLQUFBYSxNQUFBaEgsV0FBQXNHO3FCQUNBLEdBQUF2SixPQUFBK0osT0FBQUwsVUFBQTFKLE9BQUEySixHQUFBRCxVQUFBUjs7Z0JBR0EsSUFBQWdCLGtCQUFBZixnQkFDQWdCLFlBQUFELGdCQUFBQyxXQUNBeEUsV0FBQXVFLGdCQUFBdkUsVUFDQXlFLFdBQUFGLGdCQUFBRSxVQUNBQyxVQUFBSCxnQkFBQUcsU0FDQUMsY0FBQUosZ0JBQUFJLGFBQ0FDLFNBQUFMLGdCQUFBSyxRQUNBQyxVQUFBTixnQkFBQU07Z0JBR0EsSUFBQUMsWUFBQSxHQUFBekssT0FBQTBLO2dCQUVBLElBQUFKLGFBQUE7b0JBRUFBLFlBQUFLLGtCQUFBTCxZQUFBSyxtQkFBQTNLLE9BQUE0SztvQkFDQU4sWUFBQU8saUJBQUFQLFlBQUFPLGtCQUFBN0ssT0FBQTRLO29CQUNBTixZQUFBUSxpQkFBQVIsWUFBQVEsa0JBQUE5SyxPQUFBNEs7b0JBQ0FOLFlBQUFTLGtCQUFBVCxZQUFBUyxtQkFBQS9LLE9BQUE0SztvQkFDQU4sWUFBQVUsbUJBQUFWLFlBQUFVLG9CQUFBaEwsT0FBQTRLO29CQUVBTixZQUFBSzt3QkFBaUNGO3dCQUFBUSxNQUFBO3dCQUFBQyxnQkFBQTt3QkFBQUM7NEJBQTZERixNQUFBOzRCQUFBN0I7NEJBQUFHOzs7O2dCQUc5RixJQUFBNkIsUUFBQSxHQUFBcEMsT0FBQXRMLFNBQUFnTSxVQUFBUyxZQUFBLEdBQUFuSyxPQUFBcUwsa0JBQUExRixXQUFBeUUsVUFBQUM7b0JBQWtIQztvQkFBQUM7b0JBQUFDO21CQUE2REMsVUFBQXJCLEtBQUFrQztnQkFFL0ssSUFBQWhCLGFBQUE7b0JBQ0FBLFlBQUFPLGVBQUFKLFVBQUFXOztnQkFHQSxPQUFBQTs7V04wbEI4QjlLLEtBQUs3RCxTQUFTQyxvQkFBb0I7O0lBSTFENk8sS0FDQSxTQUFVL08sUUFBUUMsU0FBU0M7U08vcEJqQyxTQUFBb007WUFBQTtZQUVBck0sUUFBQWdCLGFBQUE7WUFFQSxJQUFBK04sV0FBQTFNLE9BQUEyTSxVQUFBLFNBQUF0TTtnQkFBbUQsU0FBQUUsSUFBQSxHQUFnQkEsSUFBQWlLLFVBQUFoSyxRQUFzQkQsS0FBQTtvQkFBTyxJQUFBcU0sU0FBQXBDLFVBQUFqSztvQkFBMkIsU0FBQU0sT0FBQStMLFFBQUE7d0JBQTBCLElBQUE1TSxPQUFBaUIsVUFBQU0sZUFBQUMsS0FBQW9MLFFBQUEvTCxNQUFBOzRCQUF5RFIsT0FBQVEsT0FBQStMLE9BQUEvTDs7OztnQkFBaUMsT0FBQVI7O1lBRS9PLElBQUF3TSxpQkFBQUMsV0FBQSxxQkFBQUEsT0FBQWxDLGFBQUEsb0JBQUFsTTtnQkFBb0csY0FBQUE7Z0JBQXFCLFNBQUFBO2dCQUFtQixPQUFBQSxjQUFBb08sV0FBQSxjQUFBcE8sSUFBQXlELGdCQUFBMkssVUFBQXBPLFFBQUFvTyxPQUFBN0wsWUFBQSxrQkFBQXZDOztZQUU1SWYsUUFBQXNOO1lBQ0F0TixRQUFBb1A7WUFDQXBQLFFBQUFxUDtZQUNBclAsUUFBQXNQO1lBQ0F0UCxRQUFBdVA7WUFDQXZQLFFBQUFpTDtZQUNBakwsUUFBQXdQO1lBQ0F4UCxRQUFBeVA7WUFDQXpQLFFBQUEwUDtZQUNBMVAsUUFBQXFOO1lBQ0FyTixRQUFBMlA7WUFDQSxJQUFBQyxNQUFBNVAsUUFBQTRQLE1BQUEsU0FBQUEsSUFBQTVLO2dCQUNBLHlCQUFBQTs7WUFHQSxJQUFBNkssT0FBQTdQLFFBQUE2UCxPQUFBRCxJQUFBO1lBQ0EsSUFBQUUsU0FBQTlQLFFBQUE4UCxTQUFBRixJQUFBO1lBQ0EsSUFBQUcsUUFBQS9QLFFBQUErUCxRQUFBSCxJQUFBO1lBQ0EsSUFBQTVFLFNBQUFoTCxRQUFBZ0wsU0FBQTRFLElBQUE7WUFDQSxJQUFBSSxjQUFBaFEsUUFBQWdRLGNBQUFKLElBQUE7WUFDQSxJQUFBSyxvQkFBQWpRLFFBQUFpUSxvQkFBQUwsSUFBQTtZQUNBLElBQUFNLFFBQUFsUSxRQUFBa1EsUUFBQSxTQUFBQSxNQUFBQztnQkFDQTtvQkFDQSxPQUFBQTs7O1lBR0EsSUFBQUMsUUFBQXBRLFFBQUFvUSxRQUFBRixNQUFBO1lBQ0EsSUFBQUcsU0FBQXJRLFFBQUFxUSxTQUFBSCxNQUFBO1lBQ0EsSUFBQS9CLE9BQUFuTyxRQUFBbU8sT0FBQSxTQUFBQTtZQUNBLElBQUFtQyxRQUFBdFEsUUFBQXNRLFFBQUEsU0FBQUEsTUFBQUg7Z0JBQ0EsT0FBQUE7O1lBR0EsU0FBQTdDLE1BQUEvSyxPQUFBZ08sV0FBQTVKO2dCQUNBLEtBQUE0SixVQUFBaE8sUUFBQTtvQkFDQThLLElBQUEsOEJBQUExRztvQkFDQSxVQUFBRixNQUFBRTs7O1lBSUEsSUFBQS9DLGlCQUFBdkIsT0FBQWlCLFVBQUFNO1lBQ0EsU0FBQXdMLE9BQUFvQixRQUFBQztnQkFDQSxPQUFBdkQsR0FBQXdELFNBQUFGLFdBQUE1TSxlQUFBQyxLQUFBMk0sUUFBQUM7O1lBR0EsSUFBQXZELEtBQUFsTixRQUFBa047Z0JBQ0F5RCxPQUFBLFNBQUFBLE1BQUFSO29CQUNBLE9BQUFBLE1BQUEsUUFBQUEsTUFBQTNKOztnQkFFQWtLLFVBQUEsU0FBQUEsU0FBQVA7b0JBQ0EsT0FBQUEsTUFBQSxRQUFBQSxNQUFBM0o7O2dCQUVBK0csTUFBQSxTQUFBQSxLQUFBcUQ7b0JBQ0EsY0FBQUEsTUFBQTs7Z0JBRUFDLFFBQUEsU0FBQUEsT0FBQUM7b0JBQ0EsY0FBQUEsTUFBQTs7Z0JBRUFDLFFBQUEsU0FBQUEsT0FBQXJKO29CQUNBLGNBQUFBLE1BQUE7O2dCQUVBc0osT0FBQWpFLE1BQUFrRTtnQkFDQVQsUUFBQSxTQUFBQSxPQUFBelA7b0JBQ0EsT0FBQUEsUUFBQW1NLEdBQUE4RCxNQUFBalEsd0JBQUEsNEJBQUFtTyxRQUFBbk8sVUFBQTs7Z0JBRUFtUSxTQUFBLFNBQUFBLFFBQUFDO29CQUNBLE9BQUFBLEtBQUFqRSxHQUFBSyxLQUFBNEQsRUFBQUM7O2dCQUVBbkUsVUFBQSxTQUFBQSxTQUFBb0U7b0JBQ0EsT0FBQUEsTUFBQW5FLEdBQUFLLEtBQUE4RCxHQUFBQyxTQUFBcEUsR0FBQUssS0FBQThELEdBQUFFOztnQkFFQUMsVUFBQSxTQUFBQSxTQUFBSDtvQkFDQSxPQUFBQSxNQUFBbkUsR0FBQUssS0FBQTRCLFVBQUFqQyxHQUFBSyxLQUFBOEQsR0FBQWxDLE9BQUFsQyxhQUFBQyxHQUFBOEQsTUFBQUs7O2dCQUVBMUMsTUFBQSxTQUFBQSxLQUFBOEM7b0JBQ0EsT0FBQUEsT0FBQTVCOztnQkFFQTZCLFlBQUEsU0FBQUEsV0FBQUM7b0JBQ0EsT0FBQUEsTUFBQXpFLEdBQUFLLEtBQUFvRSxHQUFBakU7O2dCQUVBa0UsUUFBQSxTQUFBQSxPQUFBQztvQkFDQSxPQUFBQSxPQUFBM0UsR0FBQUssS0FBQXNFLElBQUFDLFlBQUE1RSxHQUFBSyxLQUFBc0UsSUFBQUUsU0FBQTdFLEdBQUFLLEtBQUFzRSxJQUFBRzs7Z0JBRUFDLFNBQUEsU0FBQUEsUUFBQUM7b0JBQ0EsT0FBQUEsUUFBQWhGLEdBQUE2RCxPQUFBbUIsd0JBQUEsNEJBQUFoRCxRQUFBZ0QsVUFBQSxZQUFBaEYsR0FBQUssS0FBQTJFLFFBQUFoRixHQUFBOEQsTUFBQWtCOztnQkFFQTVHLFNBQUEsU0FBQUEsUUFBQTZHO29CQUNBLE9BQUFBLE1BQUFqRixHQUFBSyxLQUFBNEUsR0FBQUosU0FBQTdFLEdBQUFLLEtBQUE0RSxHQUFBQzs7Z0JBRUFDLFFBQUEsU0FBQUEsT0FBQWhCO29CQUNBLE9BQUFBLFNBQUF2Qjs7Z0JBRUF3QyxnQkFBQSxTQUFBQSxlQUFBMUI7b0JBQ0EsT0FBQTFELEdBQUFLLEtBQUFxRCxNQUFBeEIsT0FBQXdCLEdBQUE7OztZQUlBLElBQUFKLFNBQUF4USxRQUFBd1E7Z0JBQ0F4QixRQUFBLFNBQUFBLE9BQUF0TSxRQUFBdU07b0JBQ0EsU0FBQXJNLEtBQUFxTSxRQUFBO3dCQUNBLElBQUFHLE9BQUFILFFBQUFyTSxJQUFBOzRCQUNBRixPQUFBRSxLQUFBcU0sT0FBQXJNOzs7OztZQU1BLFNBQUF5TSxPQUFBMkIsT0FBQXVCO2dCQUNBLElBQUFDLFFBQUF4QixNQUFBL0csUUFBQXNJO2dCQUNBLElBQUFDLFNBQUE7b0JBQ0F4QixNQUFBeUIsT0FBQUQsT0FBQTs7O1lBSUEsSUFBQXhCLFFBQUFoUixRQUFBZ1I7Z0JBQ0EwQixNQUFBLFNBQUFBLEtBQUEzUjtvQkFDQSxJQUFBaUosTUFBQStDLE1BQUFoTSxJQUFBOEI7b0JBQ0EsU0FBQUQsS0FBQTdCLEtBQUE7d0JBQ0EsSUFBQXFPLE9BQUFyTyxLQUFBNkIsSUFBQTs0QkFDQW9ILElBQUFwSCxLQUFBN0IsSUFBQTZCOzs7b0JBR0EsT0FBQW9IOzs7WUFJQSxTQUFBc0Y7Z0JBQ0EsSUFBQTNNLFFBQUFrSyxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7Z0JBRUEsSUFBQThGLE1BQUE1RCxhQUF1QnBNO2dCQUN2QixJQUFBdU8sVUFBQSxJQUFBMEIsUUFBQSxTQUFBQyxTQUFBQztvQkFDQUgsSUFBQUU7b0JBQ0FGLElBQUFHOztnQkFFQUgsSUFBQXpCO2dCQUNBLE9BQUF5Qjs7WUFHQSxTQUFBcEQsZ0JBQUExTTtnQkFDQSxJQUFBbUg7Z0JBQ0EsU0FBQXBILElBQUEsR0FBaUJBLElBQUFDLFFBQVlELEtBQUE7b0JBQzdCb0gsSUFBQStJLEtBQUF6RDs7Z0JBRUEsT0FBQXRGOztZQUdBLFNBQUFpQixNQUFBK0g7Z0JBQ0EsSUFBQUMsTUFBQXBHLFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQTtnQkFFQSxJQUFBcUcsaUJBQUE7Z0JBQ0EsSUFBQWhDLFVBQUEsSUFBQTBCLFFBQUEsU0FBQUM7b0JBQ0FLLFlBQUFDLFdBQUE7d0JBQ0EsT0FBQU4sUUFBQUk7dUJBQ0tEOztnQkFHTDlCLFFBQUFsRyxVQUFBO29CQUNBLE9BQUFvSSxhQUFBRjs7Z0JBR0EsT0FBQWhDOztZQUdBLFNBQUExQjtnQkFDQSxJQUFBNUs7Z0JBRUEsSUFBQXlPLFVBQUE7Z0JBQ0EsSUFBQUMsZUFBQSxHQUNBQyxjQUFBO2dCQUVBLE9BQUEzTyxXQUFrQkEsS0FBQWlMLFFBQUEsTUFBQWpMLEtBQUE0TyxZQUFBLFNBQUFBO29CQUNsQixPQUFBSDttQkFDR3pPLEtBQUE2TyxTQUFBLFNBQUFBO29CQUNILE9BQUFIO21CQUNHMU8sS0FBQStCLFFBQUEsU0FBQUE7b0JBQ0gsT0FBQTRNO21CQUNHM08sS0FBQThPLGFBQUEsU0FBQUEsV0FBQUM7b0JBQ0gsT0FBQU4sVUFBQU07bUJBQ0cvTyxLQUFBZ1AsWUFBQSxTQUFBQSxVQUFBQztvQkFDSCxPQUFBUCxVQUFBTzttQkFDR2pQLEtBQUFrUCxXQUFBLFNBQUFBLFNBQUFsTTtvQkFDSCxPQUFBMkwsU0FBQTNMO21CQUNHaEQ7O1lBR0gsU0FBQTZLO2dCQUNBLElBQUFzRSxPQUFBbEgsVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBO2dCQUVBO29CQUNBLFNBQUFrSDs7O1lBSUEsSUFBQTlGLE1BQUFqTyxRQUFBaU8sTUFBQXdCO1lBRUEsSUFBQXVFLFNBQUEsU0FBQUEsT0FBQUM7Z0JBQ0EsTUFBQUE7O1lBRUEsSUFBQUMsVUFBQSxTQUFBQSxRQUFBM1I7Z0JBQ0E7b0JBQVVBO29CQUFBNFIsTUFBQTs7O1lBRVYsU0FBQXpFLGFBQUE0QjtnQkFDQSxJQUFBOEMsT0FBQXZILFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQSxLQUFBbUg7Z0JBQ0EsSUFBQW5GLE9BQUFoQyxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7Z0JBQ0EsSUFBQXdILFdBQUF4SCxVQUFBO2dCQUVBLElBQUFJO29CQUFrQjRCO29CQUFBeUM7b0JBQUFDLE9BQUE2QztvQkFBQUUsUUFBQUo7O2dCQUVsQixJQUFBRyxVQUFBO29CQUNBcEgsU0FBQTZDLFVBQUE7O2dCQUVBLFdBQUFYLFdBQUE7b0JBQ0FsQyxTQUFBa0MsT0FBQWxDLFlBQUE7d0JBQ0EsT0FBQUE7OztnQkFHQSxPQUFBQTs7WUFRQSxTQUFBSSxJQUFBa0gsT0FBQTNOO2dCQUNBLElBQUFELFFBQUFrRyxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7Z0JBR0EsV0FBQXpMLFdBQUE7b0JBQ0FvVCxRQUFBbkgsSUFBQSxnQkFBQWtILFFBQUEsT0FBQTNOLFVBQUEsUUFBQUQsZUFBQThOLFNBQUE5Tjt1QkFDRztvQkFDSDZOLFFBQUFELE9BQUEzTixTQUFBRDs7O1lBSUEsU0FBQWdKLFVBQUErRSxJQUFBQztnQkFDQTtvQkFDQSxJQUFBdEksUUFBQWMsSUFBQUMsYUFBQSxlQUFBQyxJQUFBLFFBQUFzSDtvQkFDQSxPQUFBRCxHQUFBbEgsTUFBQWhILFdBQUFxRzs7O1lBSUEsSUFBQStILGtCQUFBNVUsUUFBQTRVLGtCQUFBLFNBQUFBLGdCQUFBQyxZQUFBQztnQkFDQSxPQUFBRCxhQUFBLHNDQUFBQyxZQUFBOztZQUdBLElBQUFDLGNBQUEvVSxRQUFBK1UsY0FBQSxTQUFBQSxZQUFBZDtnQkFDQSxXQUFBeE4sTUFBQSxzTUFBQXdOLE1BQUE7O1lBR0EsSUFBQWUsMEJBQUFoVixRQUFBZ1YsMEJBQUEsU0FBQUEsd0JBQUFDLEtBQUF0UztnQkFDQSxRQUFBc1MsWUFBQSw2Q0FBQXRTLFFBQUE7O1lBR0EsSUFBQWlNLG1CQUFBNU8sUUFBQTRPLG1CQUFBLFNBQUFBLGlCQUFBMUY7Z0JBQ0EsZ0JBQUFnTTtvQkFDQSxPQUFBaE0sU0FBQTdHLE9BQUFDLGVBQUE0UyxRQUFBbEY7d0JBQWdFek4sT0FBQTs7OztZQUloRSxJQUFBNFMscUJBQUFuVixRQUFBbVYscUJBQUEsU0FBQUEsbUJBQUFDO2dCQUNBO29CQUNBLFNBQUF4SSxPQUFBQyxVQUFBaEssUUFBQWlLLE9BQUFDLE1BQUFILE9BQUFJLE9BQUEsR0FBbUVBLE9BQUFKLE1BQWFJLFFBQUE7d0JBQ2hGRixLQUFBRSxRQUFBSCxVQUFBRzs7b0JBR0EsSUFBQXFJO29CQUNBLElBQUFDLE1BQUFGLGNBQUE1SCxNQUFBaEgsV0FBQXNHO29CQUNBO3dCQUNBd0UsTUFBQSxTQUFBQSxLQUFBaUU7NEJBQ0FGLFFBQUF0QyxLQUFBd0M7NEJBQ0EsT0FBQUQsSUFBQWhFLEtBQUFpRTs7d0JBRUFDLE9BQUEsU0FBQUE7NEJBQ0EsSUFBQUMsWUFBQU4sbUJBQUFDLGVBQUE1SCxNQUFBaEgsV0FBQXNHOzRCQUNBdUksUUFBQUssUUFBQSxTQUFBSDtnQ0FDQSxPQUFBRSxVQUFBbkUsS0FBQWlFOzs0QkFFQSxPQUFBRTs7d0JBRUFuQixRQUFBLFNBQUFxQixRQUFBcFQ7NEJBQ0EsT0FBQStTLElBQUFoQixPQUFBL1I7O3dCQUVBZ1AsT0FBQSxTQUFBcUUsT0FBQUM7NEJBQ0EsT0FBQVAsSUFBQS9ELE1BQUFzRTs7Ozs7V1BzcUI4QmhTLEtBQUs3RCxTQUFTQyxvQkFBb0I7O0lBSTFENlYsS0FDQSxTQUFVL1YsUUFBUUMsU0FBU0M7UVEvOEJqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUNBaEIsUUFBQStWLGNBQUEvVixRQUFBZ1csY0FBQWhXLFFBQUFpVyxxQkFBQXpQO1FBRUEsSUFBQXVJLFdBQUExTSxPQUFBMk0sVUFBQSxTQUFBdE07WUFBbUQsU0FBQUUsSUFBQSxHQUFnQkEsSUFBQWlLLFVBQUFoSyxRQUFzQkQsS0FBQTtnQkFBTyxJQUFBcU0sU0FBQXBDLFVBQUFqSztnQkFBMkIsU0FBQU0sT0FBQStMLFFBQUE7b0JBQTBCLElBQUE1TSxPQUFBaUIsVUFBQU0sZUFBQUMsS0FBQW9MLFFBQUEvTCxNQUFBO3dCQUF5RFIsT0FBQVEsT0FBQStMLE9BQUEvTDs7OztZQUFpQyxPQUFBUjs7UUFFL08sSUFBQXdNLGlCQUFBQyxXQUFBLHFCQUFBQSxPQUFBbEMsYUFBQSxvQkFBQWxNO1lBQW9HLGNBQUFBO1lBQXFCLFNBQUFBO1lBQW1CLE9BQUFBLGNBQUFvTyxXQUFBLGNBQUFwTyxJQUFBeUQsZ0JBQUEySyxVQUFBcE8sUUFBQW9PLE9BQUE3TCxZQUFBLGtCQUFBdkM7O1FBRTVJZixRQUFBaUIsVUFBQWlWO1FBRUEsSUFBQTNTLFNBQUF0RCxvQkFBQTtRQUVBLElBQUFrVyxhQUFBbFcsb0JBQUE7UUFFQSxJQUFBOEwsTUFBQTlMLG9CQUFBO1FBRUEsSUFBQTJMLFdBQUEzTCxvQkFBQTtRQUVBLElBQUE0TCxXQUFBNUwsb0JBQUE7UUFFQSxTQUFBbVcsNEJBQUFyVixLQUFBc1Y7WUFBa0QsU0FBQW5ULE9BQUFtVCxPQUFBO2dCQUF5QixJQUFBQyxPQUFBRCxNQUFBblQ7Z0JBQXVCb1QsS0FBQXRULGVBQUFzVCxLQUFBdlQsYUFBQTtnQkFBNEMsZUFBQXVULFdBQUFyVCxXQUFBO2dCQUEyQ1osT0FBQUMsZUFBQXZCLEtBQUFtQyxLQUFBb1Q7O1lBQXlDLE9BQUF2Vjs7UUFFbE8sSUFBQWtWLHFCQUFBalcsUUFBQWlXLHFCQUFBO1FBRUEsSUFBQUQsY0FBQWhXLFFBQUFnVztZQUNBTyxVQUFBLFNBQUFBO2dCQUNBOzs7UUFHQSxJQUFBUixjQUFBL1YsUUFBQStWO1lBQ0FRLFVBQUEsU0FBQUE7Z0JBQ0E7OztRQUlBLElBQUFDO1lBQ0FDLFVBQUEsU0FBQUE7Z0JBQ0EsT0FBQWxULE9BQUE2TTs7WUFFQW5QLFNBQUEsU0FBQXlWLFNBQUF6RTtnQkFDQSxlQUFBQSxZQUFBLDRCQUFBL0MsUUFBQStDLGNBQUEsb0JBQUEwRTtvQkFDQSxPQUFBQSxNQUFBMVIsU0FBQWdOO29CQUNLLFNBQUEwRTtvQkFDTCxPQUFBQSxNQUFBMVIsU0FBQTJSLE9BQUEzRTs7O1lBR0FqQixPQUFBLFNBQUFBLE1BQUE2RjtnQkFDQSxnQkFBQUY7b0JBQ0EsT0FBQUUsU0FBQUMsS0FBQSxTQUFBM0Y7d0JBQ0EsT0FBQTRGLFFBQUE1RixHQUFBd0Y7Ozs7WUFJQXBHLFdBQUEsU0FBQUEsVUFBQXlHO2dCQUNBLGdCQUFBTDtvQkFDQSxPQUFBSyxXQUFBTDs7OztRQUtBLFNBQUFJLFFBQUE5RTtZQUVBLFFBQUFBLFlBQUEsTUFBQXVFLFNBQUFDLFdBQUFsVCxPQUFBMkosR0FBQThELE1BQUFpQixXQUFBdUUsU0FBQXhGLFFBQUF6TixPQUFBMkosR0FBQW9GLGVBQUFMLFdBQUF1RSxTQUFBdlYsVUFBQXNDLE9BQUEySixHQUFBSyxLQUFBMEUsV0FBQXVFLFNBQUFqRyxZQUFBaUcsU0FBQXZWLFNBQUFnUjs7UUFrQkEsU0FBQWdGLFVBQUFwSSxNQUFBcUksVUFBQUM7WUFDQSxJQUFBQyxZQUNBM0QsY0FBQSxHQUNBNEQsWUFBQTtZQUNBQyxRQUFBSjtZQUVBLFNBQUFLLE1BQUF0RDtnQkFDQXVEO2dCQUNBTCxHQUFBbEQsS0FBQTs7WUFHQSxTQUFBcUQsUUFBQTNJO2dCQUNBeUksTUFBQXJFLEtBQUFwRTtnQkFDQUEsS0FBQThJLE9BQUEsU0FBQUMsS0FBQUM7b0JBQ0EsSUFBQU4sV0FBQTt3QkFDQTs7cUJBR0EsR0FBQTlULE9BQUE4TCxRQUFBK0gsT0FBQXpJO29CQUNBQSxLQUFBOEksT0FBQWxVLE9BQUE0SztvQkFDQSxJQUFBd0osT0FBQTt3QkFDQUosTUFBQUc7MkJBQ087d0JBQ1AsSUFBQS9JLFNBQUF1SSxVQUFBOzRCQUNBekQsU0FBQWlFOzt3QkFFQSxLQUFBTixNQUFBdlUsUUFBQTs0QkFDQXdVLFlBQUE7NEJBQ0FGLEdBQUExRDs7Ozs7WUFPQSxTQUFBK0Q7Z0JBQ0EsSUFBQUgsV0FBQTtvQkFDQTs7Z0JBRUFBLFlBQUE7Z0JBQ0FELE1BQUExQixRQUFBLFNBQUFqRTtvQkFDQUEsRUFBQWdHLE9BQUFsVSxPQUFBNEs7b0JBQ0FzRCxFQUFBbUc7O2dCQUVBUjs7WUFHQTtnQkFDQUU7Z0JBQ0FFO2dCQUNBRDtnQkFDQU0sVUFBQSxTQUFBQTtvQkFDQSxPQUFBVDs7Z0JBRUFVLFdBQUEsU0FBQUE7b0JBQ0EsT0FBQVYsTUFBQXBRLElBQUEsU0FBQXlLO3dCQUNBLE9BQUFBLEVBQUE1Qzs7Ozs7UUFNQSxTQUFBa0osbUJBQUFuVDtZQUNBLElBQUFnSixVQUFBaEosS0FBQWdKLFNBQ0E4RyxLQUFBOVAsS0FBQThQLElBQ0E1SCxPQUFBbEksS0FBQWtJO1lBRUEsSUFBQXZKLE9BQUEySixHQUFBRCxTQUFBeUgsS0FBQTtnQkFDQSxPQUFBQTs7WUFJQSxJQUFBakIsY0FBQSxHQUNBOU0sYUFBQTtZQUNBO2dCQUNBOE0sU0FBQWlCLEdBQUFsSCxNQUFBSSxTQUFBZDtjQUNHLE9BQUFtSDtnQkFDSHROLFFBQUFzTjs7WUFJQSxJQUFBMVEsT0FBQTJKLEdBQUFELFNBQUF3RyxTQUFBO2dCQUNBLE9BQUFBOztZQUtBLE9BQUE5TSxTQUFBLEdBQUFwRCxPQUFBbU0sY0FBQTtnQkFDQSxNQUFBL0k7a0JBQ0csR0FBQXBELE9BQUFtTSxjQUFBO2dCQUNILElBQUFzSSxVQUFBO2dCQUNBLElBQUFDO29CQUFlOUQsTUFBQTtvQkFBQTVSLE9BQUFrUjs7Z0JBQ2YsSUFBQXlFLE1BQUEsU0FBQUEsSUFBQTNWO29CQUNBO3dCQUFjNFIsTUFBQTt3QkFBQTVSOzs7Z0JBRWQsZ0JBQUFnVDtvQkFDQSxLQUFBeUMsSUFBQTt3QkFDQUEsS0FBQTt3QkFDQSxPQUFBQzsyQkFDTzt3QkFDUCxPQUFBQyxJQUFBM0M7Ozs7O1FBTUEsSUFBQTRDLGFBQUEsU0FBQUEsV0FBQTlGO1lBQ0E7Z0JBQVVxQyxJQUFBckM7OztRQUdWLFNBQUE2RCxLQUFBako7WUFDQSxJQUFBUyxZQUFBYixVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7Z0JBQ0EsT0FBQXRKLE9BQUE0Szs7WUFFQSxJQUFBakYsV0FBQTJELFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQSxLQUFBdEosT0FBQTRLO1lBQ0EsSUFBQVIsV0FBQWQsVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBLEtBQUF0SixPQUFBNEs7WUFDQSxJQUFBaUssZ0JBQUF2TCxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7WUFDQSxJQUFBd0wsVUFBQXhMLFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQTtZQUNBLElBQUE0QixpQkFBQTVCLFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQTtZQUNBLElBQUFnQyxPQUFBaEMsVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBO1lBQ0EsSUFBQTRLLE9BQUE1SyxVQUFBO2FBRUEsR0FBQXRKLE9BQUErSixPQUFBTCxVQUFBMUosT0FBQTJKLEdBQUFELFVBQUFnSjtZQUVBLElBQUFxQyxnQkFBQTtZQUNBLElBQUFDLHFCQUFBLEdBQUFoVixPQUFBb00sV0FBQTZJLGVBQUEsR0FBQWpWLE9BQUFxUixpQkFBQTBELGVBQUEsU0FBQUEsZ0JBQUE7WUFFQSxJQUFBekssY0FBQXdLLFFBQUF4SyxhQUNBQyxTQUFBdUssUUFBQXZLLFFBQ0FDLFVBQUFzSyxRQUFBdEs7WUFFQSxJQUFBVixNQUFBUyxVQUFBdkssT0FBQThKO1lBQ0EsSUFBQW9MLFdBQUEsU0FBQUEsU0FBQXhFO2dCQUNBLElBQUFyTixVQUFBcU4sSUFBQXlFO2dCQUVBLEtBQUE5UixXQUFBcU4sSUFBQVEsT0FBQTtvQkFDQTdOLFVBQUFxTixJQUFBUSxNQUFBa0UsTUFBQSxTQUFBMU8sUUFBQWdLLElBQUFyTixjQUFBLElBQUFxTixJQUFBUSxRQUFBLFlBQUFSLElBQUFyTixVQUFBLE9BQUFxTixJQUFBUTs7Z0JBR0FwSCxJQUFBLDBCQUFBd0IsTUFBQWpJLFdBQUFxTixJQUFBck4sV0FBQXFOOztZQUVBLElBQUEyRSxjQUFBLEdBQUFoTixTQUFBZ04sWUFBQWxMO1lBQ0EsSUFBQW1MLGNBQUF4VyxPQUFBa0MsT0FBQTZUO1lBTUE5RyxLQUFBc0csU0FBQXJVLE9BQUE0SztZQU1BLElBQUFRLE9BQUFtSyxRQUFBckssZ0JBQUFJLE1BQUE1QixVQUFBd0s7WUFDQSxJQUFBUDtnQkFBa0JySTtnQkFBQStJLFFBQUFtQjtnQkFBQXZGLFdBQUE7O1lBQ2xCLElBQUF3RixZQUFBL0IsVUFBQXBJLE1BQUFxSSxVQUFBK0I7WUFLQSxTQUFBRjtnQkFDQSxJQUFBN0IsU0FBQTFELGNBQUEwRCxTQUFBZ0MsYUFBQTtvQkFDQWhDLFNBQUFnQyxjQUFBO29CQUNBNUgsS0FBQXlFOzs7WUFXQSxTQUFBNkI7Z0JBS0EsSUFBQTNLLFNBQUFrTSxlQUFBbE0sU0FBQW1NLGNBQUE7b0JBQ0FuTSxTQUFBbU0sZUFBQTtvQkFDQUosVUFBQXhCO29CQUlBeUIsSUFBQWxEOzs7WUFPQTBCLGNBQUFHO1lBR0EzSyxTQUFBa00sYUFBQTtZQUdBN0g7WUFHQSxPQUFBM0M7WUFPQSxTQUFBMkMsS0FBQWlFLEtBQUFvQztnQkFFQSxLQUFBVCxTQUFBMUQsV0FBQTtvQkFDQSxVQUFBL00sTUFBQTs7Z0JBR0E7b0JBQ0EsSUFBQWdOLGNBQUE7b0JBQ0EsSUFBQWtFLE9BQUE7d0JBQ0FsRSxTQUFBeEcsU0FBQXNFLE1BQUFnRTsyQkFDTyxJQUFBQSxRQUFBUSxhQUFBO3dCQU9QbUIsU0FBQWdDLGNBQUE7d0JBSUE1SCxLQUFBc0c7d0JBS0FuRSxTQUFBbFEsT0FBQTJKLEdBQUFLLEtBQUFOLFNBQUFxSCxVQUFBckgsU0FBQXFILE9BQUF5Qjs0QkFBbUY1QixNQUFBOzRCQUFBNVIsT0FBQXdUOzsyQkFDNUUsSUFBQVIsUUFBQVMsYUFBQTt3QkFFUHZDLFNBQUFsUSxPQUFBMkosR0FBQUssS0FBQU4sU0FBQXFILFVBQUFySCxTQUFBcUg7NEJBQXdFSCxNQUFBOzsyQkFDakU7d0JBQ1BWLFNBQUF4RyxTQUFBcUUsS0FBQWlFOztvQkFHQSxLQUFBOUIsT0FBQVUsTUFBQTt3QkFDQWtGLFVBQUE1RixPQUFBbFIsT0FBQWtNLGdCQUFBLElBQUE2QzsyQkFDTzt3QkFJUDRGLFNBQUFvQyxnQkFBQTt3QkFDQXBDLFNBQUFPLFFBQUFQLFNBQUFPLEtBQUFoRSxPQUFBbFI7O2tCQUVLLE9BQUFvRTtvQkFDTCxJQUFBdVEsU0FBQWdDLGFBQUE7d0JBQ0FULFNBQUE5Ujs7b0JBRUF1USxTQUFBb0MsZ0JBQUE7b0JBQ0FwQyxTQUFBTyxLQUFBOVEsT0FBQTs7O1lBSUEsU0FBQXNTLElBQUF4RixRQUFBa0U7Z0JBQ0ExSyxTQUFBa00sYUFBQTtnQkFDQVAsV0FBQXhHO2dCQUNBLEtBQUF1RixPQUFBO29CQUNBMUssU0FBQXFHLFVBQUFHO29CQUNBeEcsU0FBQXNNLGdCQUFBdE0sU0FBQXNNLGFBQUExRyxRQUFBWTt1QkFDSztvQkFDTCxJQUFBQSxrQkFBQWhOLE9BQUE7d0JBQ0FwRSxPQUFBQyxlQUFBbVIsUUFBQTs0QkFDQWxSLE9BQUEsUUFBQXNNLE9BQUEsVUFBQTRFLE9BQUFpRixhQUFBakYsT0FBQWdCOzRCQUNBelIsY0FBQTs7O29CQUdBLEtBQUEyTCxLQUFBOEksTUFBQTt3QkFDQSxJQUFBaEUsa0JBQUFoTixTQUFBc0gsU0FBQTs0QkFDQUEsUUFBQTBGOytCQUNTOzRCQUNUZ0YsU0FBQWhGOzs7b0JBR0F4RyxTQUFBc0csU0FBQUU7b0JBQ0F4RyxTQUFBdU0sYUFBQTtvQkFDQXZNLFNBQUFzTSxnQkFBQXRNLFNBQUFzTSxhQUFBekcsT0FBQVc7O2dCQUVBOUUsS0FBQThJLFFBQUE5SSxLQUFBOEksS0FBQWhFLFFBQUFrRTtnQkFDQWhKLEtBQUE4SyxRQUFBL0QsUUFBQSxTQUFBZ0U7b0JBQ0EsT0FBQUEsRUFBQXZDLEdBQUExRCxRQUFBa0U7O2dCQUVBaEosS0FBQThLLFVBQUE7O1lBR0EsU0FBQUosVUFBQTNLLFFBQUFEO2dCQUNBLElBQUFrTCxRQUFBOU0sVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBO2dCQUNBLElBQUFzSyxLQUFBdEssVUFBQTtnQkFFQSxJQUFBbUIsWUFBQSxHQUFBekssT0FBQTBLO2dCQUNBSiwyQkFBQUs7b0JBQWdERjtvQkFBQVM7b0JBQUFrTDtvQkFBQWpMOztnQkFPaEQsSUFBQWtMLHFCQUFBO2dCQUdBLFNBQUFDLE9BQUFuQyxLQUFBQztvQkFDQSxJQUFBaUMsZUFBQTt3QkFDQTs7b0JBR0FBLGdCQUFBO29CQUNBekMsR0FBQVMsU0FBQXJVLE9BQUE0SztvQkFDQSxJQUFBTixhQUFBO3dCQUNBOEosUUFBQTlKLFlBQUFRLGVBQUFMLFVBQUEwSixPQUFBN0osWUFBQU8sZUFBQUosVUFBQTBKOztvQkFFQVAsR0FBQU8sS0FBQUM7O2dCQUdBa0MsT0FBQWpDLFNBQUFyVSxPQUFBNEs7Z0JBR0FnSixHQUFBUyxTQUFBO29CQUVBLElBQUFnQyxlQUFBO3dCQUNBOztvQkFHQUEsZ0JBQUE7b0JBTUE7d0JBQ0FDLE9BQUFqQztzQkFDTyxPQUFBM0Q7d0JBQ1B3RSxTQUFBeEU7O29CQUVBNEYsT0FBQWpDLFNBQUFyVSxPQUFBNEs7b0JBRUFOLDJCQUFBUyxnQkFBQU47O2dCQWVBLElBQUE1RSxZQUFBO2dCQUVBLE9BRUE3RixPQUFBMkosR0FBQWdFLFFBQUF4QyxVQUFBb0wsZUFBQXBMLFFBQUFtTCxVQUFBdFcsT0FBQTJKLEdBQUFtRixPQUFBM0QsVUFBQXFMLGNBQUE1QixXQUFBekosU0FBQVYsVUFBQTZMLFVBQUF0VyxPQUFBMkosR0FBQUQsU0FBQXlCLFVBQUFzTCxnQkFBQXRMLFFBQUFWLFVBQUFhLE1BQUFnTCxVQUdBdFcsT0FBQTJKLEdBQUE4RCxNQUFBdEMsVUFBQTZKLGtCQUFBN0osUUFBQVYsVUFBQTZMLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFsSSxLQUFBckQsV0FBQXdMLGNBQUE5USxNQUFBeVEsV0FBQXpRLE9BQUEyQyxJQUFBa08sU0FBQWpJLElBQUF0RCxXQUFBeUwsYUFBQS9RLE1BQUF5USxXQUFBelEsT0FBQTJDLElBQUFrTyxTQUFBRyxJQUFBMUwsV0FBQThKLGFBQUFwUCxNQUFBNEUsVUFBQTZMLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFJLEtBQUEzTCxXQUFBNEwsY0FBQWxSLE1BQUE0RSxVQUFBNkwsV0FBQXpRLE9BQUEyQyxJQUFBa08sU0FBQXBXLEtBQUE2SyxXQUFBNkwsY0FBQW5SLE1BQUE0RSxVQUFBNkwsV0FBQXpRLE9BQUEyQyxJQUFBa08sU0FBQU8sSUFBQTlMLFdBQUErTCxhQUFBclIsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFTLEtBQUFoTSxXQUFBcUwsY0FBQTNRLE1BQUE0RSxVQUFBNkwsV0FBQXpRLE9BQUEyQyxJQUFBa08sU0FBQVUsS0FBQWpNLFdBQUFrTSxjQUFBeFIsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFyQyxPQUFBbEosV0FBQW1NLGdCQUFBelIsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFhLE9BQUFwTSxXQUFBcU0sZ0JBQUEzUixNQUFBeVEsV0FBQXpRLE9BQUEyQyxJQUFBa08sU0FBQWUsY0FBQXRNLFdBQUF1TSxpQkFBQTdSLE1BQUF5USxXQUFBelEsT0FBQTJDLElBQUFrTyxTQUFBaUIsTUFBQXhNLFdBQUF5TSxlQUFBL1IsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFtQixVQUFBMU0sV0FBQTJNLG1CQUFBalMsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUFxQixXQUFBNU0sV0FBQTZNLG9CQUFBblMsTUFBQXlRLFdBQUF6USxPQUFBMkMsSUFBQWtPLFNBQUF1QixXQUFBOU0sV0FBQStNLG9CQUFBclMsTUFBQXlRLGlCQUFBbkw7O1lBSUEsU0FBQW9MLGVBQUE1SSxTQUFBaUc7Z0JBQ0EsSUFBQXVFLGdCQUFBeEssUUFBQTNOLE9BQUF5SDtnQkFDQSxJQUFBekgsT0FBQTJKLEdBQUFLLEtBQUFtTyxnQkFBQTtvQkFDQXZFLEdBQUFTLFNBQUE4RDt1QkFDSyxJQUFBblksT0FBQTJKLEdBQUFLLEtBQUEyRCxRQUFBcUcsUUFBQTtvQkFDTEosR0FBQVMsU0FBQTt3QkFDQSxPQUFBMUcsUUFBQXFHOzs7Z0JBS0FyRyxRQUFBRSxLQUFBK0YsSUFBQSxTQUFBeFE7b0JBQ0EsT0FBQXdRLEdBQUF4USxPQUFBOzs7WUFJQSxTQUFBcVQsZ0JBQUEvTSxVQUFBZSxVQUFBYSxNQUFBc0k7Z0JBQ0FqQixLQUFBakosVUFBQVMsV0FBQXhFLFVBQUF5RSxVQUFBa0wsYUFBQVIsU0FBQXJLLFVBQUFhLE1BQUFzSTs7WUFHQSxTQUFBK0MsY0FBQTFVLE9BQUEyUjtnQkFDQSxJQUFBN0wsVUFBQTlGLE1BQUE4RixTQUNBMkcsVUFBQXpNLE1BQUF5TSxTQUNBMEosUUFBQW5XLE1BQUFtVztnQkFFQXJRLHFCQUFBc047Z0JBQ0EsSUFBQWdELFNBQUEsU0FBQUEsT0FBQUM7b0JBQ0EsT0FBQUEsZUFBQXBWLFFBQUEwUSxHQUFBMEUsS0FBQSxZQUFBalEsU0FBQWtRLE9BQUFELFNBQUFGLFFBQUF4RSxHQUFBbkIsZUFBQW1CLEdBQUEwRTs7Z0JBRUE7b0JBQ0F2USxRQUFBeUcsS0FBQTZKLFFBQUE3RSxRQUFBOUU7a0JBQ0ssT0FBQWdDO29CQUNMLE9BQUFrRCxHQUFBbEQsS0FBQTs7Z0JBRUFrRCxHQUFBUyxTQUFBZ0UsT0FBQWhFOztZQUdBLFNBQUF1QyxhQUFBOVQsT0FBQThRO2dCQUNBLElBQUE3TCxVQUFBakYsTUFBQWlGLFNBQ0E0SixTQUFBN08sTUFBQTZPLFFBQ0FyQyxVQUFBeE0sTUFBQXdNO2lCQU9BLEdBQUFzRCxXQUFBNEYsTUFBQTtvQkFDQSxJQUFBdEksY0FBQTtvQkFDQTt3QkFDQUEsVUFBQW5JLGtCQUFBMEcsTUFBQTlJLFVBQUFnTTtzQkFDTyxPQUFBdk87d0JBRVAsSUFBQTJFLFdBQUF1SCxTQUFBLE9BQUFzRSxHQUFBeFEsT0FBQTt3QkFDQThSLFNBQUE5Ujs7b0JBR0EsSUFBQWtNLFdBQUF0UCxPQUFBMkosR0FBQWdFLFFBQUF1QyxTQUFBO3dCQUNBcUcsZUFBQXJHLFFBQUEwRDsyQkFDTzt3QkFDUCxPQUFBQSxHQUFBMUQ7Ozs7WUFNQSxTQUFBOEcsY0FBQTdULE9BQUFzSCxVQUFBbUo7Z0JBQ0EsSUFBQXZKLFVBQUFsSCxNQUFBa0gsU0FDQThHLEtBQUFoTyxNQUFBZ08sSUFDQTVILE9BQUFwRyxNQUFBb0c7Z0JBRUEsSUFBQTJHLGNBQUE7Z0JBRUE7b0JBQ0FBLFNBQUFpQixHQUFBbEgsTUFBQUksU0FBQWQ7a0JBQ0ssT0FBQW5HO29CQUNMLE9BQUF3USxHQUFBeFEsT0FBQTs7Z0JBRUEsT0FBQXBELE9BQUEySixHQUFBZ0UsUUFBQXVDLFVBQUFxRyxlQUFBckcsUUFBQTBELE1BQUE1VCxPQUFBMkosR0FBQUQsU0FBQXdHLFVBQUF1RyxnQkFBQXZHLFFBQUF6RixVQUFBMEcsR0FBQTdGLE1BQUFzSSxTQUFBMUQ7O1lBR0EsU0FBQWdILGFBQUEzVCxPQUFBcVE7Z0JBQ0EsSUFBQXZKLFVBQUE5RyxNQUFBOEcsU0FDQThHLEtBQUE1TixNQUFBNE4sSUFDQTVILE9BQUFoRyxNQUFBZ0c7Z0JBTUE7b0JBQ0EsSUFBQWtQLFFBQUEsU0FBQUEsTUFBQS9ILEtBQUF5RDt3QkFDQSxPQUFBblUsT0FBQTJKLEdBQUF5RCxNQUFBc0QsT0FBQWtELEdBQUFPLE9BQUFQLEdBQUFsRCxLQUFBOztvQkFFQVMsR0FBQWxILE1BQUFJLFNBQUFkLEtBQUFtUCxPQUFBRDtvQkFDQSxJQUFBQSxNQUFBcEUsUUFBQTt3QkFDQVQsR0FBQVMsU0FBQTs0QkFDQSxPQUFBb0UsTUFBQXBFOzs7a0JBR0ssT0FBQWpSO29CQUNMLE9BQUF3USxHQUFBeFEsT0FBQTs7O1lBSUEsU0FBQW9ULGNBQUFtQyxPQUFBbE8sVUFBQW1KO2dCQUNBLElBQUF2SixVQUFBc08sTUFBQXRPLFNBQ0E4RyxLQUFBd0gsTUFBQXhILElBQ0E1SCxPQUFBb1AsTUFBQXBQLE1BQ0FxUCxXQUFBRCxNQUFBQztnQkFFQSxJQUFBQyxlQUFBckU7b0JBQTJDbks7b0JBQUE4RztvQkFBQTVIOztnQkFFM0M7cUJBQ0EsR0FBQXFKLFdBQUFrRztvQkFDQSxJQUFBQyxRQUFBcEcsS0FBQWtHLGNBQUExTyxXQUFBeEUsVUFBQXlFLFVBQUFrTCxhQUFBUixTQUFBckssVUFBQTBHLEdBQUE3RixNQUFBc04sV0FBQSxPQUFBNVksT0FBQTRLO29CQUVBLElBQUFnTyxVQUFBO3dCQUNBaEYsR0FBQW1GOzJCQUNPO3dCQUNQLElBQUFGLGFBQUFqRCxZQUFBOzRCQUNBSCxVQUFBMUIsUUFBQWdGOzRCQUNBbkYsR0FBQW1GOytCQUNTLElBQUFGLGFBQUE3SSxRQUFBOzRCQUNUeUYsVUFBQXpCLE1BQUE2RSxhQUFBN0k7K0JBQ1M7NEJBQ1Q0RCxHQUFBbUY7OztrQkFHSztxQkFDTCxHQUFBbkcsV0FBQStFOzs7WUFLQSxTQUFBTixjQUFBbkosR0FBQTBGO2dCQUNBLElBQUExRixFQUFBK0IsYUFBQTtvQkFDQSxJQUFBK0k7d0JBQW9CNU47d0JBQUF3STs7b0JBQ3BCQSxHQUFBUyxTQUFBO3dCQUNBLFdBQUFyVSxPQUFBOEwsUUFBQW9DLEVBQUFnSSxTQUFBOEM7O29CQUVBOUssRUFBQWdJLFFBQUExRyxLQUFBd0o7dUJBQ0s7b0JBQ0w5SyxFQUFBK0ssY0FBQXJGLEdBQUExRixFQUFBOUssU0FBQSxRQUFBd1EsR0FBQTFGLEVBQUFnQzs7O1lBSUEsU0FBQW9ILGdCQUFBNEIsY0FBQXRGO2dCQUNBLElBQUFzRixpQkFBQWxaLE9BQUEwTSxtQkFBQTtvQkFDQXdNLGVBQUE5Tjs7Z0JBRUEsSUFBQThOLGFBQUFqSixhQUFBO29CQUNBaUosYUFBQTdFOztnQkFFQVQ7O1lBSUEsU0FBQXFCLGFBQUExTixTQUFBa0QsVUFBQW1KO2dCQUNBLElBQUF1RixPQUFBcmEsT0FBQXFhLEtBQUE1UjtnQkFFQSxLQUFBNFIsS0FBQTdaLFFBQUE7b0JBQ0EsT0FBQXNVLEdBQUE1VCxPQUFBMkosR0FBQThELE1BQUFsRzs7Z0JBR0EsSUFBQTZSLGlCQUFBO2dCQUNBLElBQUF0RixpQkFBQTtnQkFDQSxJQUFBdUY7Z0JBQ0EsSUFBQUM7Z0JBRUEsU0FBQUM7b0JBQ0EsSUFBQUgsbUJBQUFELEtBQUE3WixRQUFBO3dCQUNBd1UsWUFBQTt3QkFDQUYsR0FBQTVULE9BQUEySixHQUFBOEQsTUFBQWxHLFdBQUF2SCxPQUFBeU4sTUFBQTBCLEtBQUEzRCxhQUFtRTZOOzRCQUFZL1osUUFBQTZaLEtBQUE3Wjs4QkFBc0IrWjs7O2dCQUlyR0YsS0FBQWhILFFBQUEsU0FBQXhTO29CQUNBLElBQUE2WixZQUFBLFNBQUFBLFVBQUFyRixLQUFBQzt3QkFDQSxJQUFBTixXQUFBOzRCQUNBOzt3QkFFQSxJQUFBTSxVQUFBLEdBQUEvTCxTQUFBa1EsT0FBQXBFLGdCQUFBMUIsZUFBQTBCLFFBQUEzQixhQUFBOzRCQUNBb0IsR0FBQVM7NEJBQ0FULEdBQUFPLEtBQUFDOytCQUNTOzRCQUNUaUYsUUFBQTFaLE9BQUF3VTs0QkFDQWlGOzRCQUNBRzs7O29CQUdBQyxVQUFBbkYsU0FBQXJVLE9BQUE0SztvQkFDQTBPLFNBQUEzWixPQUFBNlo7O2dCQUdBNUYsR0FBQVMsU0FBQTtvQkFDQSxLQUFBUCxXQUFBO3dCQUNBQSxZQUFBO3dCQUNBcUYsS0FBQWhILFFBQUEsU0FBQXhTOzRCQUNBLE9BQUEyWixTQUFBM1osS0FBQTBVOzs7O2dCQUtBOEUsS0FBQWhILFFBQUEsU0FBQXhTO29CQUNBLE9BQUFtVyxVQUFBdk8sUUFBQTVILE1BQUE4SyxVQUFBOUssS0FBQTJaLFNBQUEzWjs7O1lBSUEsU0FBQW9YLGNBQUF4UCxTQUFBa0QsVUFBQW1KO2dCQUNBLElBQUFFLGlCQUFBO2dCQUNBLElBQUFxRixPQUFBcmEsT0FBQXFhLEtBQUE1UjtnQkFDQSxJQUFBK1I7Z0JBRUFILEtBQUFoSCxRQUFBLFNBQUF4UztvQkFDQSxJQUFBNlosWUFBQSxTQUFBQSxVQUFBckYsS0FBQUM7d0JBQ0EsSUFBQU4sV0FBQTs0QkFDQTs7d0JBR0EsSUFBQU0sT0FBQTs0QkFFQVIsR0FBQVM7NEJBQ0FULEdBQUFPLEtBQUE7K0JBQ1MsU0FBQTlMLFNBQUFrUSxPQUFBcEUsZ0JBQUExQixlQUFBMEIsUUFBQTNCLGFBQUE7NEJBQ1QsSUFBQWlIOzRCQUVBN0YsR0FBQVM7NEJBQ0FQLFlBQUE7NEJBQ0EsSUFBQTRGLFlBQUFELGdCQUF3Q0EsVUFBQTlaLE9BQUF3VSxLQUFBc0Y7NEJBQ3hDN0YsR0FBQTVULE9BQUEySixHQUFBOEQsTUFBQWxHLGNBQUFvUyxNQUFBclosS0FBQWtMLGFBQWlFa087Z0NBQWFwYSxRQUFBNlosS0FBQTdaO2tDQUFzQm9hOzs7b0JBR3BHRixVQUFBbkYsU0FBQXJVLE9BQUE0SztvQkFDQTBPLFNBQUEzWixPQUFBNlo7O2dCQUdBNUYsR0FBQVMsU0FBQTtvQkFFQSxLQUFBUCxXQUFBO3dCQUNBQSxZQUFBO3dCQUNBcUYsS0FBQWhILFFBQUEsU0FBQXhTOzRCQUNBLE9BQUEyWixTQUFBM1osS0FBQTBVOzs7O2dCQUlBOEUsS0FBQWhILFFBQUEsU0FBQXhTO29CQUNBLElBQUFtVSxXQUFBO3dCQUNBOztvQkFFQWdDLFVBQUF2TyxRQUFBNUgsTUFBQThLLFVBQUE5SyxLQUFBMlosU0FBQTNaOzs7WUFJQSxTQUFBNlgsZ0JBQUFvQyxPQUFBaEc7Z0JBQ0EsSUFBQWlHLFdBQUFELE1BQUFDLFVBQ0F0USxPQUFBcVEsTUFBQXJRO2dCQUVBO29CQUNBLElBQUEvRCxRQUFBcVUsU0FBQTVQLE1BQUFoSCxhQUFBbUgsYUFBQXNPLE9BQUFuUDtvQkFDQXFLLEdBQUFwTztrQkFDSyxPQUFBcEM7b0JBQ0x3USxHQUFBeFEsT0FBQTs7O1lBSUEsU0FBQXNVLGlCQUFBb0MsT0FBQWxHO2dCQUNBLElBQUFsRixVQUFBb0wsTUFBQXBMLFNBQ0FMLFNBQUF5TCxNQUFBekw7Z0JBRUEsSUFBQTBMLFFBQUF2RyxRQUFBOUU7Z0JBQ0FxTCxNQUFBckw7Z0JBQ0FrRixJQUFBLEdBQUF2TCxTQUFBTCxjQUFBbUMsV0FBQWtFLFVBQUEvRixTQUFBUixRQUFBa1MsU0FBQUQ7O1lBR0EsU0FBQWpDLG1CQUFBalMsTUFBQStOO2dCQUNBQSxLQUFBRCxTQUFBZ0M7O1lBR0EsU0FBQWlDLGVBQUE3UCxTQUFBNkw7Z0JBQ0E3TCxRQUFBNFAsTUFBQS9EOztZQUdBLFNBQUFvRSxvQkFBQWlDLE1BQUFyRztnQkFDQUEsR0FBQTBCLFlBQUEyRTs7WUFHQSxTQUFBL0Isb0JBQUE5WSxPQUFBd1U7Z0JBQ0E1VCxPQUFBaU4sT0FBQXhCLE9BQUE2SixhQUFBbFc7Z0JBQ0F3VTs7WUFHQSxTQUFBMkIsUUFBQTlULElBQUE2SixNQUFBNUIsVUFBQXdLO2dCQUNBLElBQUFnRyxPQUFBQyxPQUFBQztnQkFFQTFRLFNBQUFzTSxlQUFBO2dCQUNBLE9BQUFtRSxZQUFxQkEsTUFBQW5hLE9BQUFzTSxRQUFBLE1BQUE2TixNQUFBMVksU0FBQTBZLE1BQUE3TztnQkFBQTRPLFFBQUEsUUFBQUUsa0JBQStGQSxZQUFBRixTQUFBRSxZQUFBRjtnQkFBK0NFLFlBQUFGLE9BQUE5UixNQUFBO29CQUNuSyxJQUFBc0IsU0FBQXNNLGNBQUE7d0JBQ0EsT0FBQXRNLFNBQUFzTSxhQUFBckk7MkJBQ087d0JBQ1AsSUFBQXlCLE9BQUEsR0FBQXBQLE9BQUErTDt3QkFDQXJDLFNBQUFzTSxlQUFBNUc7d0JBQ0EsS0FBQTFGLFNBQUFrTSxZQUFBOzRCQUNBbE0sU0FBQXNHLFNBQUFaLElBQUFHLE9BQUE3RixTQUFBc0csVUFBQVosSUFBQUUsUUFBQTVGLFNBQUFxRzs7d0JBRUEsT0FBQVgsSUFBQXpCOzttQkFFS3dNLE1BQUFqRyxhQUFBaUcsTUFBQWpFLGNBQUFpRSxNQUFBOUYsaUJBQUE4RixNQUFBbEssWUFBQSxTQUFBQTtvQkFDTCxPQUFBdkcsU0FBQWtNO21CQUNLdUUsTUFBQXhFLGNBQUEsU0FBQUE7b0JBQ0wsT0FBQWpNLFNBQUFtTTttQkFDS3NFLE1BQUFsQixZQUFBLFNBQUFBO29CQUNMLE9BQUF2UCxTQUFBdU07bUJBQ0trRSxNQUFBakssU0FBQSxTQUFBQTtvQkFDTCxPQUFBeEcsU0FBQXFHO21CQUNLb0ssTUFBQS9XLFFBQUEsU0FBQUE7b0JBQ0wsT0FBQXNHLFNBQUFzRzttQkFDS21LLE1BQUFsQyxhQUFBLFNBQUFBLFdBQUE3WTtxQkFDTCxHQUFBWSxPQUFBK0osT0FBQTNLLE9BQUFZLE9BQUEySixHQUFBc0QsU0FBQSxHQUFBak4sT0FBQXlSLHlCQUFBLFFBQUFyUztvQkFDQVksT0FBQWlOLE9BQUF4QixPQUFBNkosYUFBQWxXO21CQUNLeVQsNEJBQUFzSCxPQUFBQyxjQUFBRDs7OztJUnU5QkNFLEtBQ0EsU0FBVTdkLFFBQVFDO1FTenREeEI7UUFFQUEsUUFBQWdCLGFBQUE7UUFDQWhCLFFBQUErYjtRQUNBL2IsUUFBQXFjO1FBQ0FyYyxRQUFBa2I7UUFDQSxJQUFBMkM7UUFRQSxJQUFBQyxZQUFBO1FBT0EsU0FBQUMsS0FBQXBQO1lBQ0E7Z0JBQ0EwTjtnQkFDQTFOO2NBQ0c7Z0JBQ0hxUDs7O1FBT0EsU0FBQWpDLEtBQUFwTjtZQUNBa1AsTUFBQTlLLEtBQUFwRTtZQUVBLEtBQUFtUCxXQUFBO2dCQUNBekI7Z0JBQ0FuQjs7O1FBUUEsU0FBQW1CO1lBQ0F5Qjs7UUFNQSxTQUFBRTtZQUNBRjs7UUFNQSxTQUFBNUM7WUFDQThDO1lBRUEsSUFBQXJQLFlBQUE7WUFDQSxRQUFBbVAsY0FBQW5QLE9BQUFrUCxNQUFBSSxhQUFBelgsV0FBQTtnQkFDQXVYLEtBQUFwUDs7OztJVGl1RE11UCxLQUNBLFNBQVVuZSxRQUFRQyxTQUFTQztRVW55RGpDO1FBRUFELFFBQUFnQixhQUFBO1FBQ0FoQixRQUFBaWEsV0FBQWphLFFBQUFtZSxRQUFBbmUsUUFBQStLLFNBQUF2RTtRQUNBeEcsUUFBQStSO1FBQ0EvUixRQUFBZ1M7UUFDQWhTLFFBQUFvYTtRQUNBcGEsUUFBQXFhO1FBQ0FyYSxRQUFBNkQ7UUFDQTdELFFBQUF3TjtRQUNBeE4sUUFBQXdhO1FBQ0F4YSxRQUFBMGE7UUFDQTFhLFFBQUFvZTtRQUNBcGUsUUFBQTJhO1FBQ0EzYSxRQUFBNFg7UUFDQTVYLFFBQUE4YTtRQUNBOWEsUUFBQWdiO1FBQ0FoYixRQUFBb2I7UUFDQXBiLFFBQUFrYjtRQUNBbGIsUUFBQXNiO1FBQ0F0YixRQUFBd2I7UUFDQXhiLFFBQUFvTDtRQUNBcEwsUUFBQW1MO1FBQ0FuTCxRQUFBa0w7UUFFQSxJQUFBM0gsU0FBQXRELG9CQUFBO1FBRUEsSUFBQTZMLGVBQUE3TCxvQkFBQTtRQUVBLElBQUFvZSxNQUFBLEdBQUE5YSxPQUFBcU0sS0FBQTtRQUNBLElBQUEwTyxPQUFBO1FBQ0EsSUFBQUMsTUFBQTtRQUNBLElBQUFDLE1BQUE7UUFDQSxJQUFBQyxPQUFBO1FBQ0EsSUFBQUMsT0FBQTtRQUNBLElBQUFDLE1BQUE7UUFDQSxJQUFBQyxPQUFBO1FBQ0EsSUFBQUMsT0FBQTtRQUNBLElBQUE3VCxTQUFBO1FBQ0EsSUFBQThULFNBQUE7UUFDQSxJQUFBQyxpQkFBQTtRQUNBLElBQUFDLFlBQUE7UUFDQSxJQUFBQyxRQUFBO1FBQ0EsSUFBQUMsY0FBQTtRQUNBLElBQUFDLGNBQUE7UUFFQSxJQUFBQyxZQUFBO1FBRUEsSUFBQTFRLFNBQUEsU0FBQUEsT0FBQXpKLE1BQUFvYTtZQUNBLElBQUF6YTtZQUVBLE9BQUFBLFdBQWtCQSxLQUFBeVosTUFBQSxNQUFBelosS0FBQUssUUFBQW9hLFNBQUF6YTs7UUFHbEIsSUFBQW1HLFNBQUEvSyxRQUFBK0ssU0FBQSxTQUFBQSxPQUFBa047YUFDQSxHQUFBMVUsT0FBQStKLE9BQUEyTSxTQUFBUyxLQUFBekMsTUFBQTFVLE9BQUEySixHQUFBc0QsUUFBQTtZQUNBeUgsSUFBQTJHLE1BQUF6QyxXQUFBO1lBQ0EsT0FBQWxFOztRQUdBLFNBQUFsRztZQUNBLElBQUF1TixtQkFBQXpTLFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQTtZQUVBLElBQUFBLFVBQUFoSyxRQUFBO2lCQUNBLEdBQUFVLE9BQUErSixPQUFBVCxVQUFBLElBQUF0SixPQUFBMkosR0FBQXdELFVBQUE7O1lBRUEsSUFBQW5OLE9BQUEySixHQUFBK0UsUUFBQXFOLG1CQUFBO2dCQUNBLE9BQUE1USxPQUFBNFA7b0JBQXlCck0sU0FBQXFOOzs7WUFFekIsSUFBQS9iLE9BQUEySixHQUFBNUIsUUFBQWdVLG1CQUFBO2dCQUNBLE9BQUE1USxPQUFBNFA7b0JBQXlCaFQsU0FBQWdVOzs7WUFFekIsVUFBQTdZLE1BQUEsc0NBQUFtUSxPQUFBMEksb0JBQUE7O1FBR0F2TixLQUFBNEosUUFBQTtZQUNBLElBQUExRCxNQUFBbEcsS0FBQXZFLE1BQUFoSCxXQUFBcUc7WUFDQW9MLElBQUFxRyxNQUFBM0MsUUFBQTtZQUNBLE9BQUExRDs7UUFHQSxJQUFBa0csUUFBQW5lLFFBQUFtZSxTQUFBLEdBQUE1YSxPQUFBb00sV0FBQW9DLEtBQUE0SixRQUFBLEdBQUFwWSxPQUFBcVIsaUJBQUE7UUFFQSxTQUFBNUMsSUFBQTFHLFNBQUE0SjtZQUNBLElBQUFySSxVQUFBaEssU0FBQTtpQkFDQSxHQUFBVSxPQUFBK0osT0FBQWhDLFNBQUEvSCxPQUFBMkosR0FBQXdELFVBQUE7aUJBQ0EsR0FBQW5OLE9BQUErSixPQUFBaEMsU0FBQS9ILE9BQUEySixHQUFBNUIsU0FBQSxvQ0FBQUEsVUFBQTtpQkFDQSxHQUFBL0gsT0FBQStKLE9BQUE0SCxRQUFBM1IsT0FBQTJKLEdBQUF3RCxVQUFBO21CQUNHO2lCQUNILEdBQUFuTixPQUFBK0osT0FBQWhDLFNBQUEvSCxPQUFBMkosR0FBQXdELFVBQUE7Z0JBQ0F3RSxTQUFBNUo7Z0JBQ0FBLFVBQUE7O1lBRUEsT0FBQW9ELE9BQUE2UDtnQkFBc0JqVDtnQkFBQTRKOzs7UUFHdEJsRCxJQUFBYSxVQUFBO1lBQ0EsSUFBQW9GLE1BQUFqRyxJQUFBeEUsTUFBQWhILFdBQUFxRztZQUNBb0wsSUFBQXNHLEtBQUExTCxVQUFBO1lBQ0EsT0FBQW9GOztRQUdBakcsSUFBQXVOLFFBQUEsR0FBQWhjLE9BQUFvTSxXQUFBcUMsSUFBQWEsVUFBQSxHQUFBdFAsT0FBQXFSLGlCQUFBO1FBRUEsU0FBQXdGLElBQUF0UDtZQUNBLE9BQUE0RCxPQUFBOFAsS0FBQTFUOztRQUdBLFNBQUF1UCxLQUFBdlA7WUFDQSxPQUFBNEQsT0FBQStQLE1BQUEzVDs7UUFHQSxTQUFBMFUsY0FBQUMsTUFBQS9LLElBQUE1SDthQUNBLEdBQUF2SixPQUFBK0osT0FBQW9ILElBQUFuUixPQUFBMkosR0FBQXdELFVBQUErTyxPQUFBO1lBRUEsSUFBQTdSLFVBQUE7WUFDQSxJQUFBckssT0FBQTJKLEdBQUE4RCxNQUFBMEQsS0FBQTtnQkFDQSxJQUFBZ0wsTUFBQWhMO2dCQUNBOUcsVUFBQThSLElBQUE7Z0JBQ0FoTCxLQUFBZ0wsSUFBQTttQkFDRyxJQUFBaEwsT0FBQTtnQkFDSCxJQUFBaUwsT0FBQWpMO2dCQUNBOUcsVUFBQStSLEtBQUEvUjtnQkFDQThHLEtBQUFpTCxLQUFBakw7O1lBRUEsSUFBQTlHLFdBQUFySyxPQUFBMkosR0FBQTZELE9BQUEyRCxPQUFBblIsT0FBQTJKLEdBQUFLLEtBQUFLLFFBQUE4RyxNQUFBO2dCQUNBQSxLQUFBOUcsUUFBQThHOzthQUVBLEdBQUFuUixPQUFBK0osT0FBQW9ILElBQUFuUixPQUFBMkosR0FBQUssTUFBQWtTLE9BQUEsZ0JBQUEvSyxLQUFBO1lBRUE7Z0JBQVU5RztnQkFBQThHO2dCQUFBNUg7OztRQUdWLFNBQUFqSixLQUFBNlE7WUFDQSxTQUFBOUgsT0FBQUMsVUFBQWhLLFFBQUFpSyxPQUFBQyxNQUFBSCxPQUFBLElBQUFBLE9BQUEsUUFBQUksT0FBQSxHQUFvRkEsT0FBQUosTUFBYUksUUFBQTtnQkFDakdGLEtBQUFFLE9BQUEsS0FBQUgsVUFBQUc7O1lBR0EsT0FBQTBCLE9BQUFnUSxNQUFBYyxjQUFBLFFBQUE5SyxJQUFBNUg7O1FBR0EsU0FBQVUsTUFBQUksU0FBQThHO1lBQ0EsSUFBQTVILE9BQUFELFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQTtZQUVBLE9BQUE2QixPQUFBZ1EsTUFBQWMsY0FBQTtnQkFBOEM1UjtnQkFBQThHO2VBQTJCNUg7O1FBR3pFLFNBQUEwTixJQUFBOUY7WUFDQSxTQUFBa0wsUUFBQS9TLFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQTZTLFFBQUEsSUFBQUEsUUFBQSxRQUFBQyxRQUFBLEdBQXdGQSxRQUFBRCxPQUFlQyxTQUFBO2dCQUN2Ry9TLEtBQUErUyxRQUFBLEtBQUFoVCxVQUFBZ1Q7O1lBR0EsT0FBQW5SLE9BQUFpUSxLQUFBYSxjQUFBLE9BQUE5SyxJQUFBNUg7O1FBR0EsU0FBQTROLEtBQUFoRztZQUNBLFNBQUFvTCxRQUFBalQsVUFBQWhLLFFBQUFpSyxPQUFBQyxNQUFBK1MsUUFBQSxJQUFBQSxRQUFBLFFBQUFDLFFBQUEsR0FBd0ZBLFFBQUFELE9BQWVDLFNBQUE7Z0JBQ3ZHalQsS0FBQWlULFFBQUEsS0FBQWxULFVBQUFrVDs7WUFHQSxPQUFBclIsT0FBQWtRLE1BQUFZLGNBQUEsUUFBQTlLLElBQUE1SDs7UUFHQSxTQUFBc1IsTUFBQTFKO1lBQ0EsU0FBQXNMLFFBQUFuVCxVQUFBaEssUUFBQWlLLE9BQUFDLE1BQUFpVCxRQUFBLElBQUFBLFFBQUEsUUFBQUMsUUFBQSxHQUF3RkEsUUFBQUQsT0FBZUMsU0FBQTtnQkFDdkduVCxLQUFBbVQsUUFBQSxLQUFBcFQsVUFBQW9UOztZQUdBLE9BQUFsVixPQUFBMlAsS0FBQWxOLE1BQUFoSCxhQUFBa08sS0FBQXVILE9BQUFuUDs7UUFHQSxTQUFBNk47WUFDQSxTQUFBdUYsUUFBQXJULFVBQUFoSyxRQUFBdVUsUUFBQXJLLE1BQUFtVCxRQUFBQyxRQUFBLEdBQXFFQSxRQUFBRCxPQUFlQyxTQUFBO2dCQUNwRi9JLE1BQUErSSxTQUFBdFQsVUFBQXNUOztZQUdBLElBQUEvSSxNQUFBdlUsU0FBQTtnQkFDQSxPQUFBdVgsSUFBQWhELE1BQUFwUSxJQUFBLFNBQUF5SztvQkFDQSxPQUFBa0osS0FBQWxKOzs7WUFHQSxJQUFBOUMsT0FBQXlJLE1BQUE7YUFDQSxHQUFBN1QsT0FBQStKLE9BQUFxQixNQUFBcEwsT0FBQTJKLEdBQUF3RCxVQUFBO2FBQ0EsR0FBQW5OLE9BQUErSixPQUFBcUIsTUFBQXBMLE9BQUEySixHQUFBeUIsTUFBQSwwQkFBQUEsT0FBQSxpQ0FBQXlRO1lBQ0EsT0FBQTFRLE9BQUFtUSxNQUFBbFE7O1FBR0EsU0FBQWlKO1lBQ0EsU0FBQXdJLFFBQUF2VCxVQUFBaEssUUFBQXVVLFFBQUFySyxNQUFBcVQsUUFBQUMsUUFBQSxHQUFxRUEsUUFBQUQsT0FBZUMsU0FBQTtnQkFDcEZqSixNQUFBaUosU0FBQXhULFVBQUF3VDs7WUFHQSxJQUFBakosTUFBQXZVLFNBQUE7Z0JBQ0EsT0FBQXVYLElBQUFoRCxNQUFBcFEsSUFBQSxTQUFBeUs7b0JBQ0EsT0FBQW1HLE9BQUFuRzs7O1lBR0EsSUFBQTlDLE9BQUF5SSxNQUFBO1lBQ0EsSUFBQUEsTUFBQXZVLFdBQUE7aUJBQ0EsR0FBQVUsT0FBQStKLE9BQUFxQixNQUFBcEwsT0FBQTJKLEdBQUF3RCxVQUFBO2lCQUNBLEdBQUFuTixPQUFBK0osT0FBQXFCLE1BQUFwTCxPQUFBMkosR0FBQXlCLE1BQUEsNEJBQUFBLE9BQUEsaUNBQUF5UTs7WUFFQSxPQUFBMVEsT0FBQTFELFFBQUEyRCxRQUFBcEwsT0FBQTBNOztRQUdBLFNBQUE2SyxPQUFBc0M7WUFDQSxTQUFBa0QsUUFBQXpULFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQXVULFFBQUEsSUFBQUEsUUFBQSxRQUFBQyxRQUFBLEdBQXdGQSxRQUFBRCxPQUFlQyxTQUFBO2dCQUN2R3pULEtBQUF5VCxRQUFBLEtBQUExVCxVQUFBMFQ7O1lBR0EsSUFBQTFULFVBQUFoSyxXQUFBO2dCQUNBdWEsV0FBQTdaLE9BQUErTTttQkFDRztpQkFDSCxHQUFBL00sT0FBQStKLE9BQUE4UCxVQUFBN1osT0FBQTJKLEdBQUF3RCxVQUFBO2lCQUNBLEdBQUFuTixPQUFBK0osT0FBQThQLFVBQUE3WixPQUFBMkosR0FBQUssTUFBQSxzQ0FBQTZQLFdBQUE7O1lBRUEsT0FBQTFPLE9BQUFvUTtnQkFBeUIxQjtnQkFBQXRROzs7UUFNekIsU0FBQWtPLGNBQUEvSSxTQUFBTDthQUNBLEdBQUFyTyxPQUFBK0osT0FBQTJFLFNBQUExTyxPQUFBMkosR0FBQXdELFVBQUE7WUFDQSxJQUFBN0QsVUFBQWhLLFNBQUE7aUJBQ0EsR0FBQVUsT0FBQStKLE9BQUFzRSxRQUFBck8sT0FBQTJKLEdBQUF3RCxVQUFBO2lCQUNBLEdBQUFuTixPQUFBK0osT0FBQXNFLFFBQUFyTyxPQUFBMkosR0FBQTBFLFFBQUEsOENBQUFBLFNBQUE7O1lBRUEsT0FBQWxELE9BQUFxUTtnQkFBaUM5TTtnQkFBQUw7OztRQUdqQyxTQUFBd0o7WUFDQSxPQUFBMU0sT0FBQXNROztRQUdBLFNBQUE5RCxNQUFBNVA7YUFDQSxHQUFBL0gsT0FBQStKLE9BQUFoQyxTQUFBL0gsT0FBQTJKLEdBQUE1QixTQUFBLDhCQUFBQSxVQUFBO1lBQ0EsT0FBQW9ELE9BQUF1USxPQUFBM1Q7O1FBR0EsU0FBQWdRLFdBQUFrQzthQUNBLEdBQUFqYSxPQUFBK0osT0FBQWtRLE1BQUFqYSxPQUFBMkosR0FBQTZELFFBQUEsZ0NBQUF5TSxPQUFBO1lBQ0EsT0FBQTlPLE9BQUF3USxhQUFBMUI7O1FBR0EsU0FBQWhDLFdBQUE3WTthQUNBLEdBQUFZLE9BQUErSixPQUFBM0ssT0FBQVksT0FBQTJKLEdBQUFzRCxTQUFBLEdBQUFqTixPQUFBeVIseUJBQUEsTUFBQXJTO1lBQ0EsT0FBQStMLE9BQUF5USxhQUFBeGM7O1FBR0EsU0FBQXlJLFVBQUFrVSxrQkFBQWtCO1lBQ0EsU0FBQUMsUUFBQTVULFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQTBULFFBQUEsSUFBQUEsUUFBQSxRQUFBQyxRQUFBLEdBQXdGQSxRQUFBRCxPQUFlQyxTQUFBO2dCQUN2RzVULEtBQUE0VCxRQUFBLEtBQUE3VCxVQUFBNlQ7O1lBR0EsT0FBQWhHLEtBQUFsTixNQUFBaEgsYUFBQXNGLGFBQUE2VSxpQkFBQXJCLGtCQUFBa0IsU0FBQXZFLE9BQUFuUDs7UUFHQSxTQUFBM0IsV0FBQW1VLGtCQUFBa0I7WUFDQSxTQUFBSSxRQUFBL1QsVUFBQWhLLFFBQUFpSyxPQUFBQyxNQUFBNlQsUUFBQSxJQUFBQSxRQUFBLFFBQUFDLFFBQUEsR0FBd0ZBLFFBQUFELE9BQWVDLFNBQUE7Z0JBQ3ZHL1QsS0FBQStULFFBQUEsS0FBQWhVLFVBQUFnVTs7WUFHQSxPQUFBbkcsS0FBQWxOLE1BQUFoSCxhQUFBc0YsYUFBQWdWLGtCQUFBeEIsa0JBQUFrQixTQUFBdkUsT0FBQW5QOztRQUdBLFNBQUE1QixTQUFBOEgsSUFBQWYsU0FBQXVPO1lBQ0EsU0FBQU8sU0FBQWxVLFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQWdVLFNBQUEsSUFBQUEsU0FBQSxRQUFBQyxTQUFBLEdBQTRGQSxTQUFBRCxRQUFpQkMsVUFBQTtnQkFDN0dsVSxLQUFBa1UsU0FBQSxLQUFBblUsVUFBQW1VOztZQUdBLE9BQUF0RyxLQUFBbE4sTUFBQWhILGFBQUFzRixhQUFBbVYsZ0JBQUFqTyxJQUFBZixTQUFBdU8sU0FBQXZFLE9BQUFuUDs7UUFHQSxJQUFBb1UscUJBQUEsU0FBQUEsbUJBQUFqYztZQUNBLGdCQUFBeUo7Z0JBQ0EsT0FBQUEsaUJBQUEyUCxPQUFBM1AsT0FBQXpKOzs7UUFJQSxJQUFBZ1YsV0FBQWphLFFBQUFpYTtZQUNBbEksTUFBQW1QLG1CQUFBNUM7WUFDQXRNLEtBQUFrUCxtQkFBQTNDO1lBQ0FuRSxLQUFBOEcsbUJBQUExQztZQUNBbkUsTUFBQTZHLG1CQUFBekM7WUFDQTVhLE1BQUFxZCxtQkFBQXhDO1lBQ0FsRSxLQUFBMEcsbUJBQUF2QztZQUNBakUsTUFBQXdHLG1CQUFBdEM7WUFDQWpFLE1BQUF1RyxtQkFBQXJDO1lBQ0FqSCxRQUFBc0osbUJBQUFsVztZQUNBOFAsUUFBQW9HLG1CQUFBcEM7WUFDQTlELGVBQUFrRyxtQkFBQW5DO1lBQ0EzRCxXQUFBOEYsbUJBQUFsQztZQUNBOUQsT0FBQWdHLG1CQUFBakM7WUFDQTNELFlBQUE0RixtQkFBQWhDO1lBQ0ExRCxZQUFBMEYsbUJBQUEvQjs7O0lWMHlETWdDLEtBQ0EsU0FBVXBoQixRQUFRQyxTQUFTQztRV2xsRWpDO1FBRUFELFFBQUFnQixhQUFBO1FBQ0FoQixRQUFBaWhCLGlCQUFBamhCLFFBQUE4Z0IsbUJBQUE5Z0IsUUFBQTJnQixrQkFBQTNnQixRQUFBa0wsV0FBQWxMLFFBQUFtTCxhQUFBbkwsUUFBQW9MLFlBQUE1RTtRQUVBLElBQUE0YSxhQUFBbmhCLG9CQUFBO1FBRUEsSUFBQW9oQixjQUFBamhCLHVCQUFBZ2hCO1FBRUEsSUFBQUUsY0FBQXJoQixvQkFBQTtRQUVBLElBQUFzaEIsZUFBQW5oQix1QkFBQWtoQjtRQUVBLElBQUFFLFlBQUF2aEIsb0JBQUE7UUFFQSxJQUFBd2hCLGFBQUFyaEIsdUJBQUFvaEI7UUFFQSxJQUFBamUsU0FBQXRELG9CQUFBO1FBRUEsU0FBQUcsdUJBQUFXO1lBQXNDLE9BQUFBLFdBQUFDLGFBQUFEO2dCQUF1Q0UsU0FBQUY7OztRQUU3RSxJQUFBNFQscUJBQUEsU0FBQUEsbUJBQUErTTtZQUNBLHFCQUFrQkEsYUFBQSxtRUFBa0ZBLGFBQUEsK0pBQXFCQSxhQUFBOztRQUd6SCxJQUFBdFcsYUFBQSxHQUFBN0gsT0FBQW9NLFdBQUEwUixZQUFBcGdCLFNBQUEwVCxtQkFBQTtRQUNBLElBQUF4SixjQUFBLEdBQUE1SCxPQUFBb00sV0FBQTRSLGFBQUF0Z0IsU0FBQTBULG1CQUFBO1FBQ0EsSUFBQXpKLFlBQUEsR0FBQTNILE9BQUFvTSxXQUFBOFIsV0FBQXhnQixTQUFBMFQsbUJBQUE7UUFFQTNVLFFBQUFvTDtRQUNBcEwsUUFBQW1MO1FBQ0FuTCxRQUFBa0w7UUFDQWxMLFFBQUEyZ0Isa0JBQUFVLFlBQUFwZ0I7UUFDQWpCLFFBQUE4Z0IsbUJBQUFTLGFBQUF0Z0I7UUFDQWpCLFFBQUFpaEIsaUJBQUFRLFdBQUF4Z0I7O0lYd2xFTTBnQixLQUNBLFNBQVU1aEIsUUFBUUMsU0FBU0M7UVkzbkVqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUNBaEIsUUFBQWlCLFVBQUFtSztRQUVBLElBQUF3VyxlQUFBM2hCLG9CQUFBO1FBRUEsSUFBQTRoQixnQkFBQXpoQix1QkFBQXdoQjtRQUVBLElBQUE3VixNQUFBOUwsb0JBQUE7UUFFQSxJQUFBMkwsV0FBQTNMLG9CQUFBO1FBRUEsU0FBQUcsdUJBQUFXO1lBQXNDLE9BQUFBLFdBQUFDLGFBQUFEO2dCQUF1Q0UsU0FBQUY7OztRQUU3RSxTQUFBcUssVUFBQWtVLGtCQUFBa0I7WUFDQSxTQUFBNVQsT0FBQUMsVUFBQWhLLFFBQUFpSyxPQUFBQyxNQUFBSCxPQUFBLElBQUFBLE9BQUEsUUFBQUksT0FBQSxHQUFvRkEsT0FBQUosTUFBYUksUUFBQTtnQkFDakdGLEtBQUFFLE9BQUEsS0FBQUgsVUFBQUc7O1lBR0EsSUFBQThVO2dCQUFlM04sTUFBQTtnQkFBQTVSLFFBQUEsR0FBQXdKLElBQUFnRyxNQUFBdU47O1lBQ2YsSUFBQXlDLFFBQUEsU0FBQUEsTUFBQUM7Z0JBQ0E7b0JBQVk3TixNQUFBO29CQUFBNVIsT0FBQXdKLElBQUEyTyxLQUFBbE4sTUFBQWhILGFBQUFnYSxTQUFBdkUsT0FBQW5QLFFBQUFrVjs7O1lBR1osSUFBQTlNLGNBQUEsR0FDQStNLFlBQUEsU0FBQUEsVUFBQUQ7Z0JBQ0EsT0FBQTlNLFNBQUE4TTs7WUFHQSxXQUFBSCxjQUFBNWdCO2dCQUNBaWhCLElBQUEsU0FBQUE7b0JBQ0EsZUFBQUosT0FBQUc7O2dCQUVBRSxJQUFBLFNBQUFBO29CQUNBLE9BQUFqTixXQUFBdEosU0FBQUosUUFBQW9XLGFBQUFRLFdBQUEsTUFBQUwsTUFBQTdNOztlQUVHLHlCQUFBME0sYUFBQVMsVUFBQS9DLG9CQUFBLE9BQUFrQixPQUFBM1IsT0FBQTs7O0laa29FR3lULEtBQ0EsU0FBVXZpQixRQUFRQyxTQUFTQztRYXhxRWpDO1FBRUFELFFBQUFnQixhQUFBO1FBQ0FoQixRQUFBb2lCLE9BQUE1YjtRQUNBeEcsUUFBQXFpQjtRQUNBcmlCLFFBQUFpQixVQUFBc2hCO1FBRUEsSUFBQWhmLFNBQUF0RCxvQkFBQTtRQUVBLElBQUFrVTtZQUFZQSxNQUFBO1lBQUE1UixPQUFBaUU7O1FBQ1osSUFBQTRiLE9BQUFwaUIsUUFBQW9pQjtRQUVBLFNBQUFDLFNBQUEvQztZQUNBLElBQUEvYixPQUFBMkosR0FBQTVCLFFBQUFnVSxtQkFBQTtnQkFDQTttQkFDRyxJQUFBdlMsTUFBQWtFLFFBQUFxTyxtQkFBQTtnQkFDSCxPQUFBMUksT0FBQTBJLGlCQUFBdFksSUFBQSxTQUFBd2I7b0JBQ0EsT0FBQTVMLE9BQUE0TDs7bUJBRUc7Z0JBQ0gsT0FBQTVMLE9BQUEwSTs7O1FBSUEsU0FBQWlELFlBQUFFLEtBQUFDO1lBQ0EsSUFBQTdULE9BQUFoQyxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7WUFFQSxJQUFBOFYsbUJBQUEsR0FDQUMsUUFBQUY7WUFFQSxTQUFBcFIsS0FBQWlFLEtBQUE1TztnQkFDQSxJQUFBaWMsVUFBQVIsTUFBQTtvQkFDQSxPQUFBak87O2dCQUdBLElBQUF4TixPQUFBO29CQUNBaWMsUUFBQVI7b0JBQ0EsTUFBQXpiO3VCQUNLO29CQUNMZ2MsMkJBQUFwTjtvQkFFQSxJQUFBc04sYUFBQUosSUFBQUcsVUFDQUUsSUFBQUQsV0FBQSxJQUNBRSxTQUFBRixXQUFBLElBQ0FHLGVBQUFILFdBQUE7b0JBRUFELFFBQUFFO29CQUNBSCxjQUFBSztvQkFDQSxPQUFBSixVQUFBUixPQUFBak8sT0FBQTRPOzs7WUFJQSxXQUFBeGYsT0FBQW1NLGNBQUE0QixNQUFBLFNBQUEzSztnQkFDQSxPQUFBMkssS0FBQSxNQUFBM0s7ZUFDR2tJLE1BQUE7OztJYitxRUdvVSxLQUNBLFNBQVVsakIsUUFBUUMsU0FBU0M7U2N0dUVqQyxTQUFBb007WUFBQTtZQUVBck0sUUFBQWdCLGFBQUE7WUFDQWhCLFFBQUFrakIsd0JBQUFsakIsUUFBQW1qQixpQkFBQW5qQixRQUFBOGIsUUFBQTliLFFBQUF3TCxNQUFBaEY7WUFFQSxJQUFBdUksV0FBQTFNLE9BQUEyTSxVQUFBLFNBQUF0TTtnQkFBbUQsU0FBQUUsSUFBQSxHQUFnQkEsSUFBQWlLLFVBQUFoSyxRQUFzQkQsS0FBQTtvQkFBTyxJQUFBcU0sU0FBQXBDLFVBQUFqSztvQkFBMkIsU0FBQU0sT0FBQStMLFFBQUE7d0JBQTBCLElBQUE1TSxPQUFBaUIsVUFBQU0sZUFBQUMsS0FBQW9MLFFBQUEvTCxNQUFBOzRCQUF5RFIsT0FBQVEsT0FBQStMLE9BQUEvTDs7OztnQkFBaUMsT0FBQVI7O1lBRS9PMUMsUUFBQW9qQjtZQUNBcGpCLFFBQUFzTDtZQUNBdEwsUUFBQXVMO1lBQ0F2TCxRQUFBNFk7WUFFQSxJQUFBclYsU0FBQXRELG9CQUFBO1lBRUEsSUFBQTRMLFdBQUE1TCxvQkFBQTtZQUVBLElBQUFrVyxhQUFBbFcsb0JBQUE7WUFFQSxJQUFBb2pCLG1CQUFBO1lBQ0EsSUFBQTdYLE1BQUF4TCxRQUFBd0w7Z0JBQXlCdkcsTUFBQW9lOztZQUN6QixJQUFBdkgsUUFBQTliLFFBQUE4YixRQUFBLFNBQUFBLE1BQUF3SDtnQkFDQSxPQUFBQSxPQUFBcmUsU0FBQW9lOztZQUdBLFNBQUFEO2dCQUNBLElBQUFHO2dCQUVBLFNBQUE3VixVQUFBOFY7b0JBQ0FELFlBQUF4USxLQUFBeVE7b0JBQ0E7d0JBQ0EsV0FBQWpnQixPQUFBOEwsUUFBQWtVLGFBQUFDOzs7Z0JBSUEsU0FBQUMsS0FBQWxSO29CQUNBLElBQUF2SSxNQUFBdVosWUFBQXJHO29CQUNBLFNBQUF0YSxJQUFBLEdBQUE4Z0IsTUFBQTFaLElBQUFuSCxRQUFxQ0QsSUFBQThnQixLQUFTOWdCLEtBQUE7d0JBQzlDb0gsSUFBQXBILEdBQUEyUDs7O2dCQUlBO29CQUNBN0U7b0JBQ0ErVjs7O1lBSUEsSUFBQU4saUJBQUFuakIsUUFBQW1qQixpQkFBQTtZQUNBLElBQUFELHdCQUFBbGpCLFFBQUFrakIsd0JBQUE7WUFFQSxJQUFBN1csUUFBQWMsSUFBQUMsYUFBQTtnQkFDQXBOLFFBQUFrakIsaURBQUE7O1lBR0EsU0FBQTVYO2dCQUNBLElBQUFzRyxTQUFBL0UsVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBLEtBQUFoQixTQUFBUixRQUFBa1M7Z0JBRUEsSUFBQW9HLFNBQUE7Z0JBQ0EsSUFBQUM7aUJBRUEsR0FBQXJnQixPQUFBK0osT0FBQXNFLFFBQUFyTyxPQUFBMkosR0FBQTBFLFFBQUF1UjtnQkFFQSxTQUFBVTtvQkFDQSxJQUFBRixVQUFBQyxPQUFBL2dCLFFBQUE7d0JBQ0EsVUFBQVUsT0FBQXdSLGFBQUE7O29CQUVBLElBQUE2TyxPQUFBL2dCLFdBQUErTyxPQUFBRSxXQUFBO3dCQUNBLFVBQUF2TyxPQUFBd1IsYUFBQTs7O2dCQUlBLFNBQUEvQyxJQUFBMkU7b0JBQ0FrTjtxQkFDQSxHQUFBdGdCLE9BQUErSixPQUFBcUosT0FBQXBULE9BQUEySixHQUFBd0QsVUFBQXdTO29CQUNBLElBQUFTLFFBQUE7d0JBQ0E7O29CQUVBLEtBQUFDLE9BQUEvZ0IsUUFBQTt3QkFDQSxPQUFBK08sT0FBQUksSUFBQTJFOztvQkFFQSxTQUFBL1QsSUFBQSxHQUFtQkEsSUFBQWdoQixPQUFBL2dCLFFBQW1CRCxLQUFBO3dCQUN0QyxJQUFBdVUsS0FBQXlNLE9BQUFoaEI7d0JBQ0EsS0FBQXVVLEdBQUE1VCxPQUFBd00sVUFBQW9ILEdBQUE1VCxPQUFBd00sT0FBQTRHLFFBQUE7NEJBQ0FpTixPQUFBblIsT0FBQTdQLEdBQUE7NEJBQ0EsT0FBQXVVLEdBQUFSOzs7O2dCQUtBLFNBQUE1RSxLQUFBb0Y7b0JBQ0EwTTtxQkFDQSxHQUFBdGdCLE9BQUErSixPQUFBNkosSUFBQTVULE9BQUEySixHQUFBSyxNQUFBO29CQUVBLElBQUFvVyxVQUFBL1IsT0FBQUUsV0FBQTt3QkFDQXFGLEdBQUEzTDsyQkFDSyxLQUFBb0csT0FBQUUsV0FBQTt3QkFDTHFGLEdBQUF2RixPQUFBRzsyQkFDSzt3QkFDTDZSLE9BQUE3USxLQUFBb0U7d0JBQ0FBLEdBQUFTLFNBQUE7NEJBQ0EsV0FBQXJVLE9BQUE4TCxRQUFBdVUsUUFBQXpNOzs7O2dCQUtBLFNBQUErRCxNQUFBL0Q7b0JBQ0EwTTtxQkFDQSxHQUFBdGdCLE9BQUErSixPQUFBNkosSUFBQTVULE9BQUEySixHQUFBSyxNQUFBO29CQUNBLElBQUFvVyxVQUFBL1IsT0FBQUUsV0FBQTt3QkFDQXFGLEdBQUEzTDt3QkFDQTs7b0JBRUEyTCxHQUFBdkYsT0FBQXNKOztnQkFHQSxTQUFBOUk7b0JBQ0F5UjtvQkFDQSxLQUFBRixRQUFBO3dCQUNBQSxTQUFBO3dCQUNBLElBQUFDLE9BQUEvZ0IsUUFBQTs0QkFDQSxJQUFBbUgsTUFBQTRaOzRCQUNBQTs0QkFDQSxTQUFBaGhCLElBQUEsR0FBQThnQixNQUFBMVosSUFBQW5ILFFBQXlDRCxJQUFBOGdCLEtBQVM5Z0IsS0FBQTtnQ0FDbERvSCxJQUFBcEgsR0FBQTRJOzs7OztnQkFNQTtvQkFDQXVHO29CQUNBQztvQkFDQWtKO29CQUNBOUk7b0JBQ0EwUjt3QkFDQSxPQUFBRjs7b0JBRUFHO3dCQUNBLE9BQUFKOzs7O1lBS0EsU0FBQXBZLGFBQUFtQztnQkFDQSxJQUFBa0UsU0FBQS9FLFVBQUFoSyxTQUFBLEtBQUFnSyxVQUFBLE9BQUFyRyxZQUFBcUcsVUFBQSxLQUFBaEIsU0FBQVIsUUFBQTJZO2dCQUNBLElBQUFqTixVQUFBbEssVUFBQTtnQkFNQSxJQUFBQSxVQUFBaEssU0FBQTtxQkFDQSxHQUFBVSxPQUFBK0osT0FBQXlKLFNBQUF4VCxPQUFBMkosR0FBQUssTUFBQTs7Z0JBR0EsSUFBQTBXLE9BQUEzWSxRQUFBc0c7Z0JBQ0EsSUFBQVEsUUFBQSxTQUFBQTtvQkFDQSxLQUFBNlIsS0FBQUYsWUFBQTt3QkFDQSxJQUFBRyxhQUFBOzRCQUNBQTs7d0JBRUFELEtBQUE3Ujs7O2dCQUdBLElBQUE4UixjQUFBeFcsVUFBQSxTQUFBaUo7b0JBQ0EsSUFBQW1GLE1BQUFuRixRQUFBO3dCQUNBdkU7d0JBQ0E7O29CQUVBLElBQUEyRSxvQkFBQUosUUFBQTt3QkFDQTs7b0JBRUFzTixLQUFBalMsSUFBQTJFOztnQkFFQSxJQUFBc04sS0FBQUYsWUFBQTtvQkFDQUc7O2dCQUdBLEtBQUEzZ0IsT0FBQTJKLEdBQUFLLEtBQUEyVyxjQUFBO29CQUNBLFVBQUF6ZCxNQUFBOztnQkFHQTtvQkFDQXNMLE1BQUFrUyxLQUFBbFM7b0JBQ0FtSixPQUFBK0ksS0FBQS9JO29CQUNBOUk7OztZQUlBLFNBQUF3RyxXQUFBbEw7Z0JBQ0EsSUFBQXVXLE9BQUExWSxhQUFBLFNBQUE0TDtvQkFDQSxPQUFBekosVUFBQSxTQUFBaUo7d0JBQ0EsSUFBQUEsTUFBQXBULE9BQUF5TSxjQUFBOzRCQUNBbUgsR0FBQVI7NEJBQ0E7O3lCQUVBLEdBQUFSLFdBQUE0RixNQUFBOzRCQUNBLE9BQUE1RSxHQUFBUjs7OztnQkFLQSxPQUFBNUgsYUFBb0JrVjtvQkFDcEJsUyxNQUFBLFNBQUFBLEtBQUFvRixJQUFBSjt3QkFDQSxJQUFBbEssVUFBQWhLLFNBQUE7NkJBQ0EsR0FBQVUsT0FBQStKLE9BQUF5SixTQUFBeFQsT0FBQTJKLEdBQUFLLE1BQUE7NEJBQ0E0SixHQUFBNVQsT0FBQXdNLFNBQUFnSDs7d0JBRUFrTixLQUFBbFMsS0FBQW9GOzs7O1dkNHVFOEJ0VCxLQUFLN0QsU0FBU0Msb0JBQW9COztJQUkxRGtrQixLQUNBLFNBQVVwa0IsUUFBUUMsU0FBU0M7UWVqOEVqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUNBaEIsUUFBQXFMLFVBQUFyTCxRQUFBb2tCLGtCQUFBNWQ7UUFFQSxJQUFBakQsU0FBQXRELG9CQUFBO1FBRUEsSUFBQW1rQixrQkFBQXBrQixRQUFBb2tCLGtCQUFBO1FBRUEsSUFBQUMsb0JBQUE7UUFDQSxJQUFBQyxtQkFBQTtRQUNBLElBQUFDLG9CQUFBO1FBQ0EsSUFBQUMscUJBQUE7UUFFQSxJQUFBQztZQUFrQjNTLFNBQUF2TyxPQUFBNk07WUFBQTRCLEtBQUF6TyxPQUFBNEs7WUFBQTRELE1BQUF4TyxPQUFBNEs7O1FBRWxCLFNBQUF1VztZQUNBLElBQUFDLFFBQUE5WCxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUE7WUFDQSxJQUFBK1gsaUJBQUEvWCxVQUFBO1lBRUEsSUFBQTdDLE1BQUEsSUFBQStDLE1BQUE0WDtZQUNBLElBQUE5aEIsU0FBQTtZQUNBLElBQUFnaUIsWUFBQTtZQUNBLElBQUFDLFdBQUE7WUFFQSxJQUFBL1IsT0FBQSxTQUFBQSxLQUFBMUI7Z0JBQ0FySCxJQUFBNmEsYUFBQXhUO2dCQUNBd1QseUJBQUEsS0FBQUY7Z0JBQ0E5aEI7O1lBR0EsSUFBQWtQLE9BQUEsU0FBQUE7Z0JBQ0EsSUFBQWxQLFVBQUE7b0JBQ0EsSUFBQXdPLEtBQUFySCxJQUFBOGE7b0JBQ0E5YSxJQUFBOGEsWUFBQTtvQkFDQWppQjtvQkFDQWlpQix1QkFBQSxLQUFBSDtvQkFDQSxPQUFBdFQ7OztZQUlBLElBQUE2SixRQUFBLFNBQUFBO2dCQUNBLElBQUE2SjtnQkFDQSxPQUFBbGlCLFFBQUE7b0JBQ0FraUIsTUFBQWhTLEtBQUFoQjs7Z0JBRUEsT0FBQWdUOztZQUdBO2dCQUNBalQsU0FBQSxTQUFBQTtvQkFDQSxPQUFBalAsVUFBQTs7Z0JBRUFtUCxLQUFBLFNBQUFBLElBQUFYO29CQUNBLElBQUF4TyxTQUFBOGhCLE9BQUE7d0JBQ0E1UixLQUFBMUI7MkJBQ087d0JBQ1AsSUFBQTJULG9CQUFBO3dCQUNBLFFBQUFKOzBCQUNBLEtBQUFQOzRCQUNBLFVBQUE1ZCxNQUFBMmQ7OzBCQUNBLEtBQUFHOzRCQUNBdmEsSUFBQTZhLGFBQUF4VDs0QkFDQXdULHlCQUFBLEtBQUFGOzRCQUNBRyxXQUFBRDs0QkFDQTs7MEJBQ0EsS0FBQUw7NEJBQ0FRLGVBQUEsSUFBQUw7NEJBRUEzYSxNQUFBa1I7NEJBRUFyWSxTQUFBbUgsSUFBQW5IOzRCQUNBZ2lCLFlBQUE3YSxJQUFBbkg7NEJBQ0FpaUIsV0FBQTs0QkFFQTlhLElBQUFuSCxTQUFBbWlCOzRCQUNBTCxRQUFBSzs0QkFFQWpTLEtBQUExQjs0QkFDQTs7MEJBQ0E7OztnQkFLQVU7Z0JBQ0FtSjs7O1FBSUEsSUFBQTdQLFVBQUFyTCxRQUFBcUw7WUFDQTJZLE1BQUEsU0FBQUE7Z0JBQ0EsT0FBQVM7O1lBRUFsSCxPQUFBLFNBQUFBLE1BQUFvSDtnQkFDQSxPQUFBRCxXQUFBQyxPQUFBTjs7WUFFQVksVUFBQSxTQUFBQSxTQUFBTjtnQkFDQSxPQUFBRCxXQUFBQyxPQUFBTDs7WUFFQVksU0FBQSxTQUFBQSxRQUFBUDtnQkFDQSxPQUFBRCxXQUFBQyxPQUFBSjs7WUFFQVksV0FBQSxTQUFBQSxVQUFBQztnQkFDQSxPQUFBVixXQUFBVSxhQUFBWjs7OztJZnk4RU1hLEtBQ0EsU0FBVXRsQixRQUFRQyxTQUFTQztRZ0JsakZqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUNBaEIsUUFBQWlCLFVBQUFrSztRQUVBLElBQUF5VyxlQUFBM2hCLG9CQUFBO1FBRUEsSUFBQTRoQixnQkFBQXpoQix1QkFBQXdoQjtRQUVBLElBQUE3VixNQUFBOUwsb0JBQUE7UUFFQSxJQUFBMkwsV0FBQTNMLG9CQUFBO1FBRUEsU0FBQUcsdUJBQUFXO1lBQXNDLE9BQUFBLFdBQUFDLGFBQUFEO2dCQUF1Q0UsU0FBQUY7OztRQUU3RSxTQUFBb0ssV0FBQW1VLGtCQUFBa0I7WUFDQSxTQUFBNVQsT0FBQUMsVUFBQWhLLFFBQUFpSyxPQUFBQyxNQUFBSCxPQUFBLElBQUFBLE9BQUEsUUFBQUksT0FBQSxHQUFvRkEsT0FBQUosTUFBYUksUUFBQTtnQkFDakdGLEtBQUFFLE9BQUEsS0FBQUgsVUFBQUc7O1lBR0EsSUFBQThVO2dCQUFlM04sTUFBQTtnQkFBQTVSLFFBQUEsR0FBQXdKLElBQUFnRyxNQUFBdU47O1lBQ2YsSUFBQXlDLFFBQUEsU0FBQUEsTUFBQUM7Z0JBQ0E7b0JBQVk3TixNQUFBO29CQUFBNVIsT0FBQXdKLElBQUEyTyxLQUFBbE4sTUFBQWhILGFBQUFnYSxTQUFBdkUsT0FBQW5QLFFBQUFrVjs7O1lBRVosSUFBQXNELFVBQUEsU0FBQUEsUUFBQTNXO2dCQUNBO29CQUFZd0YsTUFBQTtvQkFBQTVSLFFBQUEsR0FBQXdKLElBQUE2TCxRQUFBako7OztZQUdaLElBQUFBLFlBQUEsR0FDQXVHLGNBQUE7WUFDQSxJQUFBcVEsVUFBQSxTQUFBQSxRQUFBOVQ7Z0JBQ0EsT0FBQTlDLE9BQUE4Qzs7WUFFQSxJQUFBd1EsWUFBQSxTQUFBQSxVQUFBRDtnQkFDQSxPQUFBOU0sU0FBQThNOztZQUdBLFdBQUFILGNBQUE1Z0I7Z0JBQ0FpaEIsSUFBQSxTQUFBQTtvQkFDQSxlQUFBSixPQUFBRzs7Z0JBRUFFLElBQUEsU0FBQUE7b0JBQ0EsT0FBQWpOLFdBQUF0SixTQUFBSixRQUFBb1csYUFBQVEsU0FBQXpULFNBQUEsTUFBQTJXLFFBQUEzVyxZQUFBLE1BQUFvVCxNQUFBN00sU0FBQXFROztnQkFFQUMsSUFBQSxTQUFBQTtvQkFDQSxlQUFBekQsTUFBQTdNLFNBQUFxUTs7ZUFFRywwQkFBQTNELGFBQUFTLFVBQUEvQyxvQkFBQSxPQUFBa0IsT0FBQTNSLE9BQUE7OztJaEJ5akZHNFcsS0FDQSxTQUFVMWxCLFFBQVFDLFNBQVNDO1FpQnptRmpDO1FBRUFELFFBQUFnQixhQUFBO1FBQ0FoQixRQUFBaUIsVUFBQWlLO1FBRUEsSUFBQTBXLGVBQUEzaEIsb0JBQUE7UUFFQSxJQUFBNGhCLGdCQUFBemhCLHVCQUFBd2hCO1FBRUEsSUFBQTdWLE1BQUE5TCxvQkFBQTtRQUVBLElBQUEyTCxXQUFBM0wsb0JBQUE7UUFFQSxJQUFBNEwsV0FBQTVMLG9CQUFBO1FBRUEsSUFBQXNELFNBQUF0RCxvQkFBQTtRQUVBLFNBQUFHLHVCQUFBVztZQUFzQyxPQUFBQSxXQUFBQyxhQUFBRDtnQkFBdUNFLFNBQUFGOzs7UUFFN0UsU0FBQW1LLFNBQUF3YSxhQUFBelQsU0FBQXVPO1lBQ0EsU0FBQTVULE9BQUFDLFVBQUFoSyxRQUFBaUssT0FBQUMsTUFBQUgsT0FBQSxJQUFBQSxPQUFBLFFBQUFJLE9BQUEsR0FBb0ZBLE9BQUFKLE1BQWFJLFFBQUE7Z0JBQ2pHRixLQUFBRSxPQUFBLEtBQUFILFVBQUFHOztZQUdBLElBQUFrSSxjQUFBLEdBQ0E1SixlQUFBO1lBRUEsSUFBQXFhO2dCQUF3QnhSLE1BQUE7Z0JBQUE1UixRQUFBLEdBQUF3SixJQUFBaVAsZUFBQS9JLFNBQUFwRyxTQUFBUixRQUFBNlosUUFBQTs7WUFDeEIsSUFBQXBELFFBQUEsU0FBQUE7Z0JBQ0E7b0JBQVkzTixNQUFBO29CQUFBNVIsUUFBQSxHQUFBd0osSUFBQWdHLE1BQUF6Rzs7O1lBRVosSUFBQXlXLFFBQUEsU0FBQUEsTUFBQUM7Z0JBQ0E7b0JBQVk3TixNQUFBO29CQUFBNVIsT0FBQXdKLElBQUEyTyxLQUFBbE4sTUFBQWhILGFBQUFnYSxTQUFBdkUsT0FBQW5QLFFBQUFrVjs7O1lBRVosSUFBQTREO2dCQUFnQnpSLE1BQUE7Z0JBQUE1UixRQUFBLEdBQUF3SixJQUFBbEksTUFBQU4sT0FBQTBILE9BQUF5YTs7WUFFaEIsSUFBQXpELFlBQUEsU0FBQUEsVUFBQUQ7Z0JBQ0EsT0FBQTlNLFNBQUE4TTs7WUFFQSxJQUFBNkQsYUFBQSxTQUFBQSxXQUFBMVQ7Z0JBQ0EsT0FBQTdHLFVBQUE2Rzs7WUFHQSxXQUFBMFAsY0FBQTVnQjtnQkFDQWloQixJQUFBLFNBQUFBO29CQUNBLGVBQUF5RCxnQkFBQUU7O2dCQUVBMUQsSUFBQSxTQUFBQTtvQkFDQSxlQUFBTCxTQUFBRzs7Z0JBRUF1RCxJQUFBLFNBQUFBO29CQUNBLE9BQUF0USxXQUFBdEosU0FBQUosUUFBQW9XLGFBQUFRLFdBQUEsTUFBQUwsTUFBQTdNOztnQkFFQTRRLElBQUEsU0FBQUE7b0JBQ0EsZUFBQUY7O2VBRUcsd0JBQUFoRSxhQUFBUyxVQUFBcFEsV0FBQSxPQUFBdU8sT0FBQTNSLE9BQUE7OztJakJnbkZHa1gsS0FDQSxTQUFVaG1CLFFBQVFDLFNBQVNDO1NrQnpxRmpDLFNBQUFvTTtZQUFBO1lBRUFyTSxRQUFBZ0IsYUFBQTtZQUNBaEIsUUFBQWlCLFVBQUEra0I7WUFFQSxJQUFBemlCLFNBQUF0RCxvQkFBQTtZQUVBLElBQUEyTCxXQUFBM0wsb0JBQUE7WUFFQSxJQUFBeUwsV0FBQXpMLG9CQUFBO1lBRUEsU0FBQWdtQix5QkFBQWxsQixLQUFBMmI7Z0JBQThDLElBQUFoYTtnQkFBaUIsU0FBQUUsS0FBQTdCLEtBQUE7b0JBQXFCLElBQUEyYixLQUFBelMsUUFBQXJILE1BQUE7b0JBQW9DLEtBQUFQLE9BQUFpQixVQUFBTSxlQUFBQyxLQUFBOUMsS0FBQTZCLElBQUE7b0JBQTZERixPQUFBRSxLQUFBN0IsSUFBQTZCOztnQkFBc0IsT0FBQUY7O1lBRTNNLFNBQUFzakI7Z0JBQ0EsSUFBQXBoQixPQUFBaUksVUFBQWhLLFNBQUEsS0FBQWdLLFVBQUEsT0FBQXJHLFlBQUFxRyxVQUFBO2dCQUVBLElBQUFxWixlQUFBdGhCLEtBQUFnSixTQUNBQSxVQUFBc1ksaUJBQUExZixpQkFBK0MwZixjQUMvQzdOLFVBQUE0Tix5QkFBQXJoQixRQUFBO2dCQUVBLElBQUFpSixjQUFBd0ssUUFBQXhLLGFBQ0FDLFNBQUF1SyxRQUFBdkssUUFDQUMsVUFBQXNLLFFBQUF0SztnQkFHQSxJQUFBeEssT0FBQTJKLEdBQUFLLEtBQUE4SyxVQUFBO29CQUNBLElBQUFoTSxRQUFBYyxJQUFBQyxhQUFBO3dCQUNBLFVBQUEzRyxNQUFBOzJCQUNLO3dCQUNMLFVBQUFBLE1BQUE7OztnQkFJQSxJQUFBcUgsV0FBQXZLLE9BQUEySixHQUFBSyxLQUFBTyxTQUFBO29CQUNBLFVBQUFySCxNQUFBOztnQkFHQSxJQUFBNEYsUUFBQWMsSUFBQUMsYUFBQSxpQkFBQWlMLFFBQUE4TixTQUFBO29CQUNBLFVBQUExZixNQUFBOztnQkFHQSxJQUFBc0gsWUFBQXhLLE9BQUEySixHQUFBSyxLQUFBUSxVQUFBO29CQUNBLFVBQUF0SCxNQUFBOztnQkFHQSxJQUFBNFIsUUFBQStLLFlBQUE3ZixPQUFBMkosR0FBQUssS0FBQThLLFFBQUErSyxVQUFBO29CQUNBLFVBQUEzYyxNQUFBOztnQkFHQSxTQUFBdkYsZUFBQXNFO29CQUNBLElBQUFtSSxXQUFBbkksTUFBQW1JLFVBQ0F6RSxXQUFBMUQsTUFBQTBEO29CQUVBLElBQUFrZCxlQUFBLEdBQUF4YSxTQUFBd1g7b0JBQ0FnRCxZQUFBM0MsUUFBQXBMLFFBQUErSyxXQUFBN2YsT0FBQStNLE9BQUE4VixZQUFBM0M7b0JBRUF2aUIsZUFBQVMsTUFBQStKLFNBQUFELFFBQUFsRSxLQUFBO3dCQUNBcUc7d0JBQ0FGLFdBQUEwWSxZQUFBMVk7d0JBQ0F4RTt3QkFDQXlFO3dCQUNBRTt3QkFDQUM7d0JBQ0FDOztvQkFHQSxnQkFBQXVEO3dCQUNBLGdCQUFBNEQ7NEJBQ0EsSUFBQXJILDJCQUFBVSxrQkFBQTtnQ0FDQVYsWUFBQVUsaUJBQUEyRzs7NEJBRUEsSUFBQXpCLFNBQUFuQyxLQUFBNEQ7NEJBQ0FrUixZQUFBM0MsS0FBQXZPOzRCQUNBLE9BQUF6Qjs7OztnQkFLQXZTLGVBQUFTLE1BQUE7b0JBQ0EsVUFBQThFLE1BQUE7O2dCQUdBdkYsZUFBQXNhLGFBQUEsU0FBQTdZO3FCQUNBLEdBQUFZLE9BQUErSixPQUFBM0ssT0FBQVksT0FBQTJKLEdBQUFzRCxTQUFBLEdBQUFqTixPQUFBeVIseUJBQUEsa0JBQUFyUztvQkFDQVksT0FBQWlOLE9BQUF4QixPQUFBcEIsU0FBQWpMOztnQkFHQSxPQUFBekI7O1dsQjZxRjhCMkMsS0FBSzdELFNBQVNDLG9CQUFvQjs7SUFJMURvbUIsS0FDQSxTQUFVdG1CLFFBQVFDLFNBQVNDO1FtQnp3RmpDO1FBRUFELFFBQUFnQixhQUFBO1FBRUEsSUFBQStLLE1BQUE5TCxvQkFBQTtRQUVBb0MsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQWdHOzs7UUFHQTFQLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUFvUzs7O1FBR0E5YixPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBaUc7OztRQUdBM1AsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQXFPOzs7UUFHQS9YLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUFzTzs7O1FBR0FoWSxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBbEk7OztRQUdBeEIsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQXlCOzs7UUFHQW5MLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUF5Tzs7O1FBR0FuWSxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBMk87OztRQUdBclksT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQXFTOzs7UUFHQS9iLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUE0Tzs7O1FBR0F0WSxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBNkw7OztRQUdBdlYsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQStPOzs7UUFHQXpZLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUFpUDs7O1FBR0EzWSxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBcVA7OztRQUdBL1ksT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQW1QOzs7UUFHQTdZLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFJLElBQUF1UDs7O1FBR0FqWixPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBSSxJQUFBeVA7OztRQUdBblosT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQVg7OztRQUdBL0ksT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQVo7OztRQUdBOUksT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQWI7Ozs7SW5CaXhGTW9iLEtBQ0EsU0FBVXZtQixRQUFRQyxTQUFTQztRb0JuNUZqQztRQUVBRCxRQUFBZ0IsYUFBQTtRQUVBLElBQUF1QyxTQUFBdEQsb0JBQUE7UUFFQW9DLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFwSSxPQUFBc007OztRQUdBeE4sT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQXBJLE9BQUF5TTs7O1FBR0EzTixPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBcEksT0FBQTRLOzs7UUFHQTlMLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFwSSxPQUFBMko7OztRQUdBN0ssT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQXBJLE9BQUErTDs7O1FBR0FqTixPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBcEksT0FBQWdNOzs7UUFHQWxOLE9BQUFDLGVBQUF0QyxTQUFBO1lBQ0ErQyxZQUFBO1lBQ0E0SSxLQUFBLFNBQUFBO2dCQUNBLE9BQUFwSSxPQUFBaU07OztRQUdBbk4sT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQXBJLE9BQUE0Ujs7O1FBSUEsSUFBQXBKLE1BQUE5TCxvQkFBQTtRQUVBb0MsT0FBQUMsZUFBQXRDLFNBQUE7WUFDQStDLFlBQUE7WUFDQTRJLEtBQUEsU0FBQUE7Z0JBQ0EsT0FBQUksSUFBQWtPOzs7UUFJQSxJQUFBM04sUUFBQXJNLG9CQUFBO1FBRUFvQyxPQUFBQyxlQUFBdEMsU0FBQTtZQUNBK0MsWUFBQTtZQUNBNEksS0FBQSxTQUFBQTtnQkFDQSxPQUFBVyxNQUFBMEo7Ozs7SXBCMjVGTXVRLEtBQ0EsU0FBVXhtQixRQUFRQyxTQUFTQztRQUVoQztRQUVBb0MsT0FBT0MsZUFBZXRDLFNBQVM7WUFDM0J1QyxPQUFPOztRQUdYLElBQUl3TSxXQUFXMU0sT0FBTzJNLFVBQVUsU0FBVXRNO1lBQVUsS0FBSyxJQUFJRSxJQUFJLEdBQUdBLElBQUlpSyxVQUFVaEssUUFBUUQsS0FBSztnQkFBRSxJQUFJcU0sU0FBU3BDLFVBQVVqSztnQkFBSSxLQUFLLElBQUlNLE9BQU8rTCxRQUFRO29CQUFFLElBQUk1TSxPQUFPaUIsVUFBVU0sZUFBZUMsS0FBS29MLFFBQVEvTCxNQUFNO3dCQUFFUixPQUFPUSxPQUFPK0wsT0FBTy9MOzs7O1lBQVksT0FBT1I7O1FBT3ZQMUMsUXFCeDlGZXdCO1FBakJoQixJQUFBZ0MsU0FBQXZELG9CQUFBO1FyQjYrRkMsSXFCNytGV3dELElyQjYrRkhDLHdCQUF3QkY7UXFCNStGakMsSUFBQWdqQixRQUFBdm1CLG9CQUFBO1FyQmcvRkMsSUFBSXdtQixTQUFTcm1CLHVCQUF1Qm9tQjtRcUIvK0ZyQyxJQUFBampCLFNBQUF0RCxvQkFBQTtRckJtL0ZDLFNBQVNHLHVCQUF1Qlc7WUFBTyxPQUFPQSxPQUFPQSxJQUFJQyxhQUFhRDtnQkFBUUUsU0FBU0Y7OztRQUV2RixTQUFTMkMsd0JBQXdCM0M7WUFBTyxJQUFJQSxPQUFPQSxJQUFJQyxZQUFZO2dCQUFFLE9BQU9EO21CQUFZO2dCQUFFLElBQUk0QztnQkFBYSxJQUFJNUMsT0FBTyxNQUFNO29CQUFFLEtBQUssSUFBSW1DLE9BQU9uQyxLQUFLO3dCQUFFLElBQUlzQixPQUFPaUIsVUFBVU0sZUFBZUMsS0FBSzlDLEtBQUttQyxNQUFNUyxPQUFPVCxPQUFPbkMsSUFBSW1DOzs7Z0JBQVVTLE9BQU8xQyxVQUFVRjtnQkFBSyxPQUFPNEM7OztRQUVsUSxTQUFTK2lCLG1CQUFtQjFjO1lBQU8sSUFBSStDLE1BQU1rRSxRQUFRakgsTUFBTTtnQkFBRSxLQUFLLElBQUlwSCxJQUFJLEdBQUcrakIsT0FBTzVaLE1BQU0vQyxJQUFJbkgsU0FBU0QsSUFBSW9ILElBQUluSCxRQUFRRCxLQUFLO29CQUFFK2pCLEtBQUsvakIsS0FBS29ILElBQUlwSDs7Z0JBQU0sT0FBTytqQjttQkFBYTtnQkFBRSxPQUFPNVosTUFBTTJGLEtBQUsxSTs7O1FxQnAvRjNMLElBQUk0YztZQUNBdGdCLFdBQVc7WUFDWDBDLFVBQVU7WUFDVnJDLE9BQU87WUFDUDRCLFFBQVE7WUFDUnpELGVBQWU7WUFDZmlDO1lBQ0FyQjtZQUNBbWhCLHdCQUF3QjtZQUN4QkMsd0JBQXdCOztRQUdyQixTQUFTdGxCO1lBQXNDLElBQTlCdUgsUUFBOEI4RCxVQUFBaEssU0FBQSxLQUFBZ0ssVUFBQSxPQUFBckcsWUFBQXFHLFVBQUEsS0FBdEIrWjtZQUFzQixJQUFSMVIsU0FBUXJJLFVBQUE7WUFDbEQsUUFBUXFJLE9BQU9qUTtjQUNYLEtBQUt4QixFQUFFNEY7Z0JBQVc7b0JBQ2QsSUFBTUQsT0FBTzhMLE9BQU85TDtvQkFDcEIsT0FBQTJGLGFBQVloRyxPQUFVSzs7O2NBRzFCLEtBQUszRixFQUFFMEY7Z0JBQWM7b0JBQ2pCLE9BQUE0RixhQUFZaEc7d0JBQU9DLFVBQVU7d0JBQU1yQyxPQUFPOzs7O2NBRzlDLEtBQUtsRCxFQUFFOEc7Z0JBQWlCO29CQUFBLElBQUF3YyxlQUNvQjdSLE9BQU85TCxNQUF2Q3JDLGVBRFlnZ0IsYUFDWmhnQixjQUFjckIsZ0JBREZxaEIsYUFDRXJoQjtvQkFDdEIsT0FBQXFKLGFBQ09oRzt3QkFDSEMsVUFBVTt3QkFDVmpDO3dCQUVBckIsZUFBZ0JBLGlCQUFpQkEsY0FBY3NoQjt3QkFDL0NsaUIsZUFBZ0JZLGlCQUFpQkEsY0FBY1osaUJBQWtCOzs7O2NBSXpFLEtBQUtyQixFQUFFK0c7Z0JBQWlCO29CQUNwQixPQUFBdUUsYUFDT2hHO3dCQUNIQyxVQUFVO3dCQUNWakM7d0JBQ0FyQjt3QkFDQWlCLE9BQU91TyxPQUFPdk87Ozs7Y0FJdEIsS0FBS2xELEVBQUVnSDtnQkFBYztvQkFDakIsT0FBQXNFLGFBQ09oRzt3QkFDSEMsVUFBVTt3QkFDVnJDLE9BQU87Ozs7Y0FJZixLQUFLbEQsRUFBRWlIO2dCQUFpQjtvQkFBQSxJQUNaaEYsaUJBQWtCd1AsT0FBTzlMLEtBQXpCMUQ7b0JBQ1IsT0FBQXFKLGFBQ09oRzt3QkFDSEMsVUFBVTt3QkFFVmxFLGVBQWVZLGVBQWNaO3dCQUM3QitoQix3QkFBd0I7d0JBQ3hCbmhCLGVBQWVBLGVBQWNzaEI7d0JBQzdCRix3QkFBd0I7Ozs7Y0FJaEMsS0FBS3JqQixFQUFFa0g7Z0JBQWlCO29CQUNwQixJQUFNc2Msd0JBQ0NsZTt3QkFDSEMsVUFBVTt3QkFDVjZkLHdCQUF3Qjt3QkFDeEJDLHdCQUF3Qjt3QkFDeEJuZ0IsT0FBT3VPLE9BQU92Tzs7b0JBR2xCLElBQUlvQyxNQUFNOGQsMkJBQTJCLE1BQU07d0JBQ3ZDSSxTQUFTbmlCLGdCQUFnQmlFLE1BQU04ZDs7b0JBRW5DLElBQUk5ZCxNQUFNK2QsMkJBQTJCLE1BQU07d0JBQ3ZDRyxTQUFTdmhCLGdCQUFnQnFELE1BQU0rZDs7b0JBRW5DLE9BQU9HOzs7Y0FHWCxLQUFLeGpCLEVBQUU4RjtnQkFBMEI7b0JBQUEsSUFDckJELFlBQWM0TCxPQUFPOUwsS0FBckJFO29CQUNSLElBQU00ZCxvQkFBb0JuZSxNQUFNckQsb0JBQU51VyxPQUFBeUssbUJBQTJCM2QsTUFBTXJEO29CQUMzRCxJQUFNQSxrQkFBZ0JxRCxNQUFNckQsb0JBQU51VyxPQUFBeUssbUJBQTJCM2QsTUFBTXJEO3FCQUV2RCxHQUFBbkMsT0FBQXFDLFNBQVEwRCxXQUFXNUQsb0JBQ2IsR0FBQStnQixPQUFBeGxCLFNBQUt5RSxpQkFBZTRELGFBQ3BCNUQsZ0JBQWNxTixLQUFLeko7b0JBQ3pCLE9BQUF5RixhQUFZaEc7d0JBQU9tZSxtQkFBbUJKO3dCQUF3QnBoQjs7OztjQUdsRSxLQUFLakMsRUFBRStGO2dCQUFzQjtvQkFBQSxJQUNqQjFFLGdCQUFrQm9RLE9BQU85TCxLQUF6QnRFO29CQUNSLE9BQUFpSyxhQUFZaEc7d0JBQU9qRTt3QkFBZStoQix3QkFBd0I5ZCxNQUFNakU7Ozs7Y0FHcEUsS0FBS3JCLEVBQUVnRztnQkFBNEI7b0JBQy9CLElBQU15ZCxxQkFBb0JuZSxNQUFNckQsb0JBQU51VyxPQUFBeUssbUJBQTJCM2QsTUFBTXJEO29CQUN2RCxJQUFBeWhCLHVCQUFBLEdBQUFDLFNBQUFyWSxhQUNxQmhHLFFBQW5CekMsWUFERjhnQixPQUNFOWdCO29CQUNOLElBQUlBLFdBQVc7d0JBQ1haLGtCQUFnQnFELE1BQU1oQyxhQUFhQyxJQUFJLFNBQUF2Qjs0QkFBQSxPQUFXQSxRQUFRVDs7MkJBQ3ZEO3dCQUNIVTs7b0JBRUpZLGFBQWFBO29CQUNiLE9BQUF5SSxhQUNPaEc7d0JBQ0h6Qzt3QkFDQTRnQixtQkFBbUJKO3dCQUNuQnBoQjs7OztjQUlSO2dCQUFTO29CQUNMLE9BQU9xRDs7Ozs7SXJCOGdHYnNlLEtBQ0EsU0FBVXRuQixRQUFRQyxTQUFTQztRc0JscEdqQyxJQUFBcW5CLFdBQUFybkIsb0JBQUEsTUFDQXNuQixVQUFBdG5CLG9CQUFBO1FBeUJBLElBQUF1bkIsT0FBQUYsU0FBQUM7UUFFQXhuQixPQUFBQyxVQUFBd25COztJdEJ5cEdNQyxLQUNBLFNBQVUxbkIsUUFBUUMsU0FBU0M7UXVCdHJHakMsSUFBQXluQixXQUFBem5CLG9CQUFBLE1BQ0EwbkIsV0FBQTFuQixvQkFBQSxNQUNBMm5CLGNBQUEzbkIsb0JBQUE7UUFVQSxTQUFBcW5CLFNBQUEvWixNQUFBc2E7WUFDQSxPQUFBRCxZQUFBRCxTQUFBcGEsTUFBQXNhLE9BQUFILFdBQUFuYSxPQUFBOztRQUdBeE4sT0FBQUMsVUFBQXNuQjs7SXZCNnJHTVEsS0FDQSxTQUFVL25CLFFBQVFDLFNBQVNDO1F3QjlzR2pDLElBQUF1TixRQUFBdk4sb0JBQUE7UUFHQSxJQUFBOG5CLFlBQUFDLEtBQUFDO1FBV0EsU0FBQU4sU0FBQXBhLE1BQUFzYSxPQUFBSztZQUNBTCxRQUFBRSxVQUFBRixVQUFBcmhCLFlBQUErRyxLQUFBMUssU0FBQSxJQUFBZ2xCLE9BQUE7WUFDQTtnQkFDQSxJQUFBL2EsT0FBQUQsV0FDQTJGLFNBQUEsR0FDQTNQLFNBQUFrbEIsVUFBQWpiLEtBQUFqSyxTQUFBZ2xCLE9BQUEsSUFDQTdXLFFBQUFqRSxNQUFBbEs7Z0JBRUEsU0FBQTJQLFFBQUEzUCxRQUFBO29CQUNBbU8sTUFBQXdCLFNBQUExRixLQUFBK2EsUUFBQXJWOztnQkFFQUEsU0FBQTtnQkFDQSxJQUFBMlYsWUFBQXBiLE1BQUE4YSxRQUFBO2dCQUNBLFNBQUFyVixRQUFBcVYsT0FBQTtvQkFDQU0sVUFBQTNWLFNBQUExRixLQUFBMEY7O2dCQUVBMlYsVUFBQU4sU0FBQUssVUFBQWxYO2dCQUNBLE9BQUF4RCxNQUFBRCxNQUFBcEcsTUFBQWdoQjs7O1FBSUFwb0IsT0FBQUMsVUFBQTJuQjs7SXhCcXRHTVMsS0FDQSxTQUFVcm9CLFFBQVFDO1F5Qi91R3hCLFNBQUF3TixNQUFBRCxNQUFBOGEsU0FBQXZiO1lBQ0EsUUFBQUEsS0FBQWpLO2NBQ0E7Z0JBQUEsT0FBQTBLLEtBQUExSixLQUFBd2tCOztjQUNBO2dCQUFBLE9BQUE5YSxLQUFBMUosS0FBQXdrQixTQUFBdmIsS0FBQTs7Y0FDQTtnQkFBQSxPQUFBUyxLQUFBMUosS0FBQXdrQixTQUFBdmIsS0FBQSxJQUFBQSxLQUFBOztjQUNBO2dCQUFBLE9BQUFTLEtBQUExSixLQUFBd2tCLFNBQUF2YixLQUFBLElBQUFBLEtBQUEsSUFBQUEsS0FBQTs7WUFFQSxPQUFBUyxLQUFBQyxNQUFBNmEsU0FBQXZiOztRQUdBL00sT0FBQUMsVUFBQXdOOztJekJnd0dNOGEsS0FDQSxTQUFVdm9CLFFBQVFDLFNBQVNDO1EwQnJ4R2pDLElBQUFzb0Isa0JBQUF0b0Isb0JBQUEsTUFDQXVvQixXQUFBdm9CLG9CQUFBO1FBVUEsSUFBQTJuQixjQUFBWSxTQUFBRDtRQUVBeG9CLE9BQUFDLFVBQUE0bkI7O0kxQjR4R01hLEtBQ0EsU0FBVTFvQixRQUFRQyxTQUFTQztRMkIxeUdqQyxJQUFBeW9CLFdBQUF6b0Isb0JBQUEsTUFDQXFDLGlCQUFBckMsb0JBQUEsTUFDQXluQixXQUFBem5CLG9CQUFBO1FBVUEsSUFBQXNvQixtQkFBQWptQixpQkFBQW9sQixXQUFBLFNBQUFuYSxNQUFBd0Q7WUFDQSxPQUFBek8sZUFBQWlMLE1BQUE7Z0JBQ0F2SyxjQUFBO2dCQUNBRCxZQUFBO2dCQUNBUixPQUFBbW1CLFNBQUEzWDtnQkFDQTlOLFVBQUE7OztRQUlBbEQsT0FBQUMsVUFBQXVvQjs7STNCaXpHTUksS0FDQSxTQUFVNW9CLFFBQVFDO1E0QnB6R3hCLFNBQUEwb0IsU0FBQW5tQjtZQUNBO2dCQUNBLE9BQUFBOzs7UUFJQXhDLE9BQUFDLFVBQUEwb0I7O0k1QjgwR01FLEtBQ0EsU0FBVTdvQixRQUFRQztRNkJ2Mkd4QixJQUFBNm9CLFlBQUEsS0FDQUMsV0FBQTtRQUdBLElBQUFDLFlBQUFDLEtBQUFDO1FBV0EsU0FBQVQsU0FBQWpiO1lBQ0EsSUFBQTJiLFFBQUEsR0FDQUMsYUFBQTtZQUVBO2dCQUNBLElBQUFDLFFBQUFMLGFBQ0FNLFlBQUFQLFlBQUFNLFFBQUFEO2dCQUVBQSxhQUFBQztnQkFDQSxJQUFBQyxZQUFBO29CQUNBLE1BQUFILFNBQUFMLFdBQUE7d0JBQ0EsT0FBQWhjLFVBQUE7O3VCQUVLO29CQUNMcWMsUUFBQTs7Z0JBRUEsT0FBQTNiLEtBQUFDLE1BQUFoSCxXQUFBcUc7OztRQUlBOU0sT0FBQUMsVUFBQXdvQjs7STdCKzJHTWMsS0FDQSxTQUFVdnBCLFFBQVFDLFNBQVNDO1E4QnA1R2pDLElBQUFzcEIsY0FBQXRwQixvQkFBQTtRQXNCQSxTQUFBc25CLFFBQUF2VyxPQUFBd1k7WUFDQSxPQUFBeFksZUFBQW5PLFVBQUEybUIsaUJBQUEzbUIsU0FDQTBtQixZQUFBdlksT0FBQXdZLFVBQ0F4WTs7UUFHQWpSLE9BQUFDLFVBQUF1bkI7O0k5QjI1R01rQyxLQUNBLFNBQVUxcEIsUUFBUUMsU0FBU0M7UStCeDdHakMsSUFBQXlwQixXQUFBenBCLG9CQUFBLE1BQ0EwcEIsY0FBQTFwQixvQkFBQSxNQUNBMnBCLGtCQUFBM3BCLG9CQUFBLE1BQ0E0cEIsWUFBQTVwQixvQkFBQSxNQUNBNnBCLFlBQUE3cEIsb0JBQUE7UUFHQSxJQUFBOHBCLGFBQUFoZCxNQUFBeko7UUFHQSxJQUFBbVAsU0FBQXNYLFdBQUF0WDtRQWFBLFNBQUE4VyxZQUFBdlksT0FBQXdZLFFBQUFRLFVBQUFDO1lBQ0EsSUFBQWhnQixVQUFBZ2dCLGFBQUFMLGtCQUFBRCxhQUNBblgsU0FBQSxHQUNBM1AsU0FBQTJtQixPQUFBM21CLFFBQ0FxbkIsT0FBQWxaO1lBRUEsSUFBQUEsVUFBQXdZLFFBQUE7Z0JBQ0FBLFNBQUFNLFVBQUFOOztZQUVBLElBQUFRLFVBQUE7Z0JBQ0FFLE9BQUFSLFNBQUExWSxPQUFBNlksVUFBQUc7O1lBRUEsU0FBQXhYLFFBQUEzUCxRQUFBO2dCQUNBLElBQUFzbkIsWUFBQSxHQUNBNW5CLFFBQUFpbkIsT0FBQWhYLFFBQ0E0WCxXQUFBSixvQkFBQXpuQjtnQkFFQSxRQUFBNG5CLFlBQUFsZ0IsUUFBQWlnQixNQUFBRSxVQUFBRCxXQUFBRixnQkFBQTtvQkFDQSxJQUFBQyxTQUFBbFosT0FBQTt3QkFDQXlCLE9BQUE1TyxLQUFBcW1CLE1BQUFDLFdBQUE7O29CQUVBMVgsT0FBQTVPLEtBQUFtTixPQUFBbVosV0FBQTs7O1lBR0EsT0FBQW5aOztRQUdBalIsT0FBQUMsVUFBQXVwQjs7SS9CKzdHTWMsS0FDQSxTQUFVdHFCLFFBQVFDLFNBQVNDO1FnQ2wvR2pDLElBQUFxcUIsZ0JBQUFycUIsb0JBQUEsTUFDQXNxQixZQUFBdHFCLG9CQUFBLE1BQ0F1cUIsZ0JBQUF2cUIsb0JBQUE7UUFXQSxTQUFBMHBCLFlBQUEzWSxPQUFBek8sT0FBQTRuQjtZQUNBLE9BQUE1bkIsa0JBQ0Fpb0IsY0FBQXhaLE9BQUF6TyxPQUFBNG5CLGFBQ0FHLGNBQUF0WixPQUFBdVosV0FBQUo7O1FBR0FwcUIsT0FBQUMsVUFBQTJwQjs7SWhDeS9HTWMsS0FDQSxTQUFVMXFCLFFBQVFDO1FpQ2xnSHhCLFNBQUFzcUIsY0FBQXRaLE9BQUFULFdBQUE0WixXQUFBTztZQUNBLElBQUE3bkIsU0FBQW1PLE1BQUFuTyxRQUNBMlAsUUFBQTJYLGFBQUFPLFlBQUE7WUFFQSxPQUFBQSxZQUFBbFksb0JBQUEzUCxRQUFBO2dCQUNBLElBQUEwTixVQUFBUyxNQUFBd0IsZUFBQXhCLFFBQUE7b0JBQ0EsT0FBQXdCOzs7WUFHQTs7UUFHQXpTLE9BQUFDLFVBQUFzcUI7O0lqQ29oSE1LLEtBQ0EsU0FBVTVxQixRQUFRQztRa0NyaUh4QixTQUFBdXFCLFVBQUFob0I7WUFDQSxPQUFBQTs7UUFHQXhDLE9BQUFDLFVBQUF1cUI7O0lsQ21qSE1LLEtBQ0EsU0FBVTdxQixRQUFRQztRbUNyakh4QixTQUFBd3FCLGNBQUF4WixPQUFBek8sT0FBQTRuQjtZQUNBLElBQUEzWCxRQUFBMlgsWUFBQSxHQUNBdG5CLFNBQUFtTyxNQUFBbk87WUFFQSxTQUFBMlAsUUFBQTNQLFFBQUE7Z0JBQ0EsSUFBQW1PLE1BQUF3QixXQUFBalEsT0FBQTtvQkFDQSxPQUFBaVE7OztZQUdBOztRQUdBelMsT0FBQUMsVUFBQXdxQjs7SW5Dc2tITUssS0FDQSxTQUFVOXFCLFFBQVFDO1FvQ25sSHhCLFNBQUE0cEIsZ0JBQUE1WSxPQUFBek8sT0FBQTRuQixXQUFBRjtZQUNBLElBQUF6WCxRQUFBMlgsWUFBQSxHQUNBdG5CLFNBQUFtTyxNQUFBbk87WUFFQSxTQUFBMlAsUUFBQTNQLFFBQUE7Z0JBQ0EsSUFBQW9uQixXQUFBalosTUFBQXdCLFFBQUFqUSxRQUFBO29CQUNBLE9BQUFpUTs7O1lBR0E7O1FBR0F6UyxPQUFBQyxVQUFBNHBCOztJcENvbUhNa0IsS0FDQSxTQUFVL3FCLFFBQVFDO1FxQ25uSHhCLFNBQUE4cEIsVUFBQTdhLFFBQUErQjtZQUNBLElBQUF3QixTQUFBLEdBQ0EzUCxTQUFBb00sT0FBQXBNO1lBRUFtTyxrQkFBQWpFLE1BQUFsSztZQUNBLFNBQUEyUCxRQUFBM1AsUUFBQTtnQkFDQW1PLE1BQUF3QixTQUFBdkQsT0FBQXVEOztZQUVBLE9BQUF4Qjs7UUFHQWpSLE9BQUFDLFVBQUE4cEI7O0lyQ2tvSE1pQixLQUNBLFNBQVVockIsUUFBUUMsU0FBU0M7UUFFaEM7UUFFQW9DLE9BQU9DLGVBQWV0QyxTQUFTO1lBQzNCdUMsT0FBTzs7UUFFWHZDLFFBQVFnckIsa0JBQWtCaHJCLFFBQVFpckIsa0JBQWtCanJCLFFBQVFrckIsWUFBWTFrQjtRQUN4RXhHLFFzQ3ZvSGVtckI7UXRDd29IZm5yQixRc0Nob0hlb3JCO1F0Q2lvSGZwckIsUXNDaG5IZ0JxckI7UXRDaW5IaEJyckIsUXNDbm1IZ0JzckI7UXRDb21IaEJ0ckIsUXNDcmxIZ0I0QjtRQXBFakIzQixvQkFBQTtRQUVBLElBQUFpTSxXQUFBak0sb0JBQUE7UUFDQSxJQUFBc3JCLFNBQUF0ckIsb0JBQUE7UXRDOHBIQyxJQUFJdXJCLFVBQVVwckIsdUJBQXVCbXJCO1FzQzVwSHRDLElBQUEvbkIsU0FBQXZELG9CQUFBO1F0Q2dxSEMsSXNDaHFIV3dELEl0Q2dxSEhDLHdCQUF3QkY7UXNDL3BIakMsSUFBQUQsU0FBQXRELG9CQUFBO1F0Q21xSEMsU0FBU3lELHdCQUF3QjNDO1lBQU8sSUFBSUEsT0FBT0EsSUFBSUMsWUFBWTtnQkFBRSxPQUFPRDttQkFBWTtnQkFBRSxJQUFJNEM7Z0JBQWEsSUFBSTVDLE9BQU8sTUFBTTtvQkFBRSxLQUFLLElBQUltQyxPQUFPbkMsS0FBSzt3QkFBRSxJQUFJc0IsT0FBT2lCLFVBQVVNLGVBQWVDLEtBQUs5QyxLQUFLbUMsTUFBTVMsT0FBT1QsT0FBT25DLElBQUltQzs7O2dCQUFVUyxPQUFPMUMsVUFBVUY7Z0JBQUssT0FBTzRDOzs7UUFFbFEsU0FBU3ZELHVCQUF1Qlc7WUFBTyxPQUFPQSxPQUFPQSxJQUFJQyxhQUFhRDtnQkFBUUUsU0FBU0Y7OztRQUV2RixJQUFJMHFCLFVBQXVCQyxtQkFBbUJDLEtzQ3RvSDlCTixVdEN1b0haTyxXQUF3QkYsbUJBQW1CQyxLc0N6bkgvQkwsVXRDMG5IWk8sV0FBd0JILG1CQUFtQkMsS3NDM21IL0IvcEI7UUE1RGpCLFNBQVNrcUIsVUFBVUM7WUFDZixRQUFPLEdBQUFQLFFBQUF2cUIsU0FBTThxQixRQUNSM2EsS0FBSyxTQUFBNkw7Z0JBQUE7b0JBQWVBOztlQUNwQitPLE1BQU0sU0FBQXJsQjtnQkFBQTtvQkFBWUE7Ozs7UUFHcEIsU0FBU3drQixVQUFVNWlCO1lBQ3RCLElBQU13akI7Z0JBQ0ZFLFFBQVE7Z0JBQ1JDLHdDQUFzQzNqQixTQUF0Qzs7WUFFSixPQUFPdWpCLFVBQVVDOztRQUdkLFNBQVNYLFFBQVE3aUIsUUFBUXpELGVBQWVZO1lBQzNDLElBQU1xbUI7Z0JBQ0ZFLFFBQVE7Z0JBQ1JFO29CQUNJQyxnQkFBZSxHQUFBN29CLE9BQUE4b0IsV0FBVTs7Z0JBRTdCSCx3Q0FBc0MzakIsU0FBdEM7Z0JBQ0FhO29CQUNJMUQ7d0JBQ0laO3dCQUNBa2lCLFVBQVV0aEI7Ozs7WUFJdEIsT0FBT29tQixVQUFVQzs7UUFHZCxTQUFVVixRQUFRblc7WUFBbEIsSUFBQTNNLFFBQUEzRCxNQUFBcVksVUFBQXRXO1lBQUEsT0FBQStrQixtQkFBQVksS0FBQSxTQUFBQyxTQUFBQztnQkFBQTtvQkFBQSxRQUFBQSxTQUFBQyxPQUFBRCxTQUFBbGI7c0JBQUE7d0JBQ0svSSxTQUFXMk0sT0FBTzlMLEtBQWxCYjt3QkFETGlrQixTQUFBbGIsT0FBQTt3QkFBQSxRQUUrQixHQUFBcEYsU0FBQXJJLE1BQUtzbkIsV0FBVzVpQjs7c0JBRi9DO3dCQUFBM0QsT0FBQTRuQixTQUFBRTt3QkFFS3pQLFdBRkxyWSxLQUVLcVk7d0JBQVV0VyxRQUZmL0IsS0FFZStCO3dCQUZmLEtBR0NzVyxVQUhEOzRCQUFBdVAsU0FBQWxiLE9BQUE7NEJBQUE7O3dCQUFBa2IsU0FBQWxiLE9BQUE7d0JBQUEsUUFJTyxHQUFBcEYsU0FBQThGOzRCQUFNL00sTUFBTXhCLEVBQUU4Rzs0QkFBaUJuQixNQUFNNlQsU0FBUzdUOzs7c0JBSnJEO3dCQUFBb2pCLFNBQUFsYixPQUFBO3dCQUFBOztzQkFBQTt3QkFBQWtiLFNBQUFsYixPQUFBO3dCQUFBLFFBTU8sR0FBQXBGLFNBQUE4Rjs0QkFBTS9NLE1BQU14QixFQUFFK0c7NEJBQWlCN0Q7OztzQkFOdEM7c0JBQUE7d0JBQUEsT0FBQTZsQixTQUFBRzs7O2VBQUFsQixTQUFBdGtCOztRQVVBLElBQU0rakIsZ0NBQVksU0FBWkEsVUFBWW5pQjtZQUFBLE9BQVNBLE1BQU1SOztRQUNqQyxJQUFNMGlCLDRDQUFrQixTQUFsQkEsZ0JBQWtCbGlCO1lBQUEsT0FBU0EsTUFBTXJEOztRQUN2QyxJQUFNc2xCLDRDQUFrQixTQUFsQkEsZ0JBQWtCamlCO1lBQUEsT0FBU0EsTUFBTWpFOztRQUV2QyxTQUFVd21CLFFBQVFwVztZQUFsQixJQUFBM00sUUFBQXpELGVBQUFZLGVBQUFGLE9BQUF5WCxVQUFBdFc7WUFBQSxPQUFBK2tCLG1CQUFBWSxLQUFBLFNBQUFNLFNBQUFDO2dCQUFBO29CQUFBLFFBQUFBLFVBQUFKLE9BQUFJLFVBQUF2YjtzQkFBQTt3QkFBQXViLFVBQUF2YixPQUFBO3dCQUFBLFFBQ0csR0FBQXBGLFNBQUE4Rjs0QkFBTS9NLE1BQU14QixFQUFFZ0g7OztzQkFEakI7d0JBQUFvaUIsVUFBQXZiLE9BQUE7d0JBQUEsUUFFa0IsR0FBQXBGLFNBQUE0TyxRQUFPb1E7O3NCQUZ6Qjt3QkFFRzNpQixTQUZIc2tCLFVBQUFIO3dCQUFBRyxVQUFBdmIsT0FBQTt3QkFBQSxRQUd5QixHQUFBcEYsU0FBQTRPLFFBQU9rUTs7c0JBSGhDO3dCQUdHbG1CLGdCQUhIK25CLFVBQUFIO3dCQUFBRyxVQUFBdmIsT0FBQTt3QkFBQSxRQUl5QixHQUFBcEYsU0FBQTRPLFFBQU9tUTs7c0JBSmhDO3dCQUlHdmxCLGdCQUpIbW5CLFVBQUFIO3dCQUFBRyxVQUFBdmIsT0FBQTt3QkFBQSxRQU0rQixHQUFBcEYsU0FBQXJJLE1BQUt1bkIsU0FBUzdpQixRQUFRekQsZUFBZVk7O3NCQU5wRTt3QkFBQUYsUUFBQXFuQixVQUFBSDt3QkFNS3pQLFdBTkx6WCxNQU1LeVg7d0JBQVV0VyxRQU5mbkIsTUFNZW1CO3dCQU5mLEtBT0NzVyxVQVBEOzRCQUFBNFAsVUFBQXZiLE9BQUE7NEJBQUE7O3dCQUFBdWIsVUFBQXZiLE9BQUE7d0JBQUEsUUFRTyxHQUFBcEYsU0FBQThGOzRCQUFNL00sTUFBTXhCLEVBQUVpSDs0QkFBaUJ0QixNQUFNNlQsU0FBUzdUOzs7c0JBUnJEO3dCQUFBeWpCLFVBQUF2YixPQUFBO3dCQUFBOztzQkFBQTt3QkFBQXViLFVBQUF2YixPQUFBO3dCQUFBLFFBVU8sR0FBQXBGLFNBQUE4Rjs0QkFBTS9NLE1BQU14QixFQUFFa0g7NEJBQWlCaEU7OztzQkFWdEM7c0JBQUE7d0JBQUEsT0FBQWttQixVQUFBRjs7O2VBQUFmLFVBQUF6a0I7O1FBZUEsU0FBVXZGO1lBQVYsT0FBQThwQixtQkFBQVksS0FBQSxTQUFBUSxhQUFBQztnQkFBQTtvQkFBQSxRQUFBQSxVQUFBTixPQUFBTSxVQUFBemI7c0JBQUE7d0JBQUF5YixVQUFBemIsT0FBQTt3QkFBQSxRQUNHLEdBQUFwRixTQUFBZixZQUFXMUgsRUFBRTBGLGNBQWNraUI7O3NCQUQ5Qjt3QkFBQTBCLFVBQUF6YixPQUFBO3dCQUFBLFFBRUcsR0FBQXBGLFNBQUFmLFlBQVcxSCxFQUFFOEYsMEJBQTBCK2hCOztzQkFGMUM7d0JBQUF5QixVQUFBemIsT0FBQTt3QkFBQSxRQUdHLEdBQUFwRixTQUFBZixZQUFXMUgsRUFBRWdHLDRCQUE0QjZoQjs7c0JBSDVDO3dCQUFBeUIsVUFBQXpiLE9BQUE7d0JBQUEsUUFJRyxHQUFBcEYsU0FBQWYsWUFBVzFILEVBQUUrRixzQkFBc0I4aEI7O3NCQUp0QztzQkFBQTt3QkFBQSxPQUFBeUIsVUFBQUo7OztlQUFBZCxVQUFBMWtCOzs7SXRDa3lIRDZsQixLQUNBLFNBQVVqdEIsUUFBUUM7U3VDdDJIeEIsU0FBQWl0QjtZQUNBO1lBRUEsSUFBQUMsS0FBQTdxQixPQUFBaUI7WUFDQSxJQUFBOEwsU0FBQThkLEdBQUF0cEI7WUFDQSxJQUFBNEM7WUFDQSxJQUFBMm1CLGlCQUFBaGUsV0FBQSxhQUFBQTtZQUNBLElBQUFpZSxpQkFBQUQsUUFBQWxnQixZQUFBO1lBQ0EsSUFBQW9nQixzQkFBQUYsUUFBQUcsaUJBQUE7WUFDQSxJQUFBQyxvQkFBQUosUUFBQUssZUFBQTtZQUVBLElBQUFDLGtCQUFBMXRCLFdBQUE7WUFDQSxJQUFBMnRCLFVBQUFULE9BQUF2QjtZQUNBLElBQUFnQyxTQUFBO2dCQUNBLElBQUFELFVBQUE7b0JBR0ExdEIsT0FBQUMsVUFBQTB0Qjs7Z0JBSUE7O1lBS0FBLFVBQUFULE9BQUF2QixxQkFBQStCLFdBQUExdEIsT0FBQUM7WUFFQSxTQUFBc3NCLEtBQUFxQixTQUFBQyxTQUFBMXBCLE1BQUEycEI7Z0JBRUEsSUFBQUMsaUJBQUFGLG1CQUFBdHFCLHFCQUFBeXFCLFlBQUFILFVBQUFHO2dCQUNBLElBQUFDLFlBQUEzckIsT0FBQWtDLE9BQUF1cEIsZUFBQXhxQjtnQkFDQSxJQUFBc0ssVUFBQSxJQUFBcWdCLFFBQUFKO2dCQUlBRyxVQUFBRSxVQUFBQyxpQkFBQVIsU0FBQXpwQixNQUFBMEo7Z0JBRUEsT0FBQW9nQjs7WUFFQU4sUUFBQXBCO1lBWUEsU0FBQThCLFNBQUExWixJQUFBM1QsS0FBQXdVO2dCQUNBO29CQUNBO3dCQUFjdFEsTUFBQTt3QkFBQXNRLEtBQUFiLEdBQUE3USxLQUFBOUMsS0FBQXdVOztrQkFDVCxPQUFBdEI7b0JBQ0w7d0JBQWNoUCxNQUFBO3dCQUFBc1EsS0FBQXRCOzs7O1lBSWQsSUFBQW9hLHlCQUFBO1lBQ0EsSUFBQUMseUJBQUE7WUFDQSxJQUFBQyxvQkFBQTtZQUNBLElBQUFDLG9CQUFBO1lBSUEsSUFBQUM7WUFNQSxTQUFBVjtZQUNBLFNBQUFXO1lBQ0EsU0FBQUM7WUFJQSxJQUFBQztZQUNBQSxrQkFBQXhCLGtCQUFBO2dCQUNBLE9BQUFqbUI7O1lBR0EsSUFBQTBuQixXQUFBeHNCLE9BQUFnRjtZQUNBLElBQUF5bkIsMEJBQUFELDhCQUFBckY7WUFDQSxJQUFBc0YsMkJBQ0FBLDRCQUFBNUIsTUFDQTlkLE9BQUF2TCxLQUFBaXJCLHlCQUFBMUIsaUJBQUE7Z0JBR0F3QixvQkFBQUU7O1lBR0EsSUFBQUMsS0FBQUosMkJBQUFyckIsWUFDQXlxQixVQUFBenFCLFlBQUFqQixPQUFBa0MsT0FBQXFxQjtZQUNBRixrQkFBQXByQixZQUFBeXJCLEdBQUF2cUIsY0FBQW1xQjtZQUNBQSwyQkFBQW5xQixjQUFBa3FCO1lBQ0FDLDJCQUFBcEIscUJBQ0FtQixrQkFBQU0sY0FBQTtZQUlBLFNBQUFDLHNCQUFBM3JCO2tCQUNBLDRCQUFBb1MsUUFBQSxTQUFBdVc7b0JBQ0Ezb0IsVUFBQTJvQixVQUFBLFNBQUExVzt3QkFDQSxPQUFBcE8sS0FBQSttQixRQUFBakMsUUFBQTFXOzs7O1lBS0FtWSxRQUFBd0Isc0JBQUEsU0FBQUM7Z0JBQ0EsSUFBQUMsY0FBQUQsV0FBQSxjQUFBQSxPQUFBM3FCO2dCQUNBLE9BQUE0cUIsT0FDQUEsU0FBQVYsc0JBR0FVLEtBQUFKLGVBQUFJLEtBQUF2Z0IsVUFBQSxzQkFDQTs7WUFHQTZlLFFBQUEvQixPQUFBLFNBQUF3RDtnQkFDQSxJQUFBOXNCLE9BQUFvQyxnQkFBQTtvQkFDQXBDLE9BQUFvQyxlQUFBMHFCLFFBQUFSO3VCQUNLO29CQUNMUSxPQUFBenFCLFlBQUFpcUI7b0JBQ0EsTUFBQXBCLHFCQUFBNEIsU0FBQTt3QkFDQUEsT0FBQTVCLHFCQUFBOzs7Z0JBR0E0QixPQUFBN3JCLFlBQUFqQixPQUFBa0MsT0FBQXdxQjtnQkFDQSxPQUFBSTs7WUFPQXpCLFFBQUEyQixRQUFBLFNBQUE5WjtnQkFDQTtvQkFBWStaLFNBQUEvWjs7O1lBR1osU0FBQWdhLGNBQUF2QjtnQkFDQSxTQUFBd0IsT0FBQXZELFFBQUExVyxLQUFBMUMsU0FBQUM7b0JBQ0EsSUFBQTJjLFNBQUFyQixTQUFBSixVQUFBL0IsU0FBQStCLFdBQUF6WTtvQkFDQSxJQUFBa2EsT0FBQXhxQixTQUFBO3dCQUNBNk4sT0FBQTJjLE9BQUFsYTsyQkFDTzt3QkFDUCxJQUFBOUIsU0FBQWdjLE9BQUFsYTt3QkFDQSxJQUFBaFQsUUFBQWtSLE9BQUFsUjt3QkFDQSxJQUFBQSxnQkFDQUEsVUFBQSxZQUNBNk0sT0FBQXZMLEtBQUF0QixPQUFBOzRCQUNBLE9BQUFxUSxRQUFBQyxRQUFBdFEsTUFBQStzQixTQUFBbGUsS0FBQSxTQUFBN087Z0NBQ0FpdEIsT0FBQSxRQUFBanRCLE9BQUFzUSxTQUFBQzsrQkFDVyxTQUFBbUI7Z0NBQ1h1YixPQUFBLFNBQUF2YixLQUFBcEIsU0FBQUM7Ozt3QkFJQSxPQUFBRixRQUFBQyxRQUFBdFEsT0FBQTZPLEtBQUEsU0FBQXNlOzRCQWdCQWpjLE9BQUFsUixRQUFBbXRCOzRCQUNBN2MsUUFBQVk7MkJBQ1NYOzs7Z0JBSVQsSUFBQTZjO2dCQUVBLFNBQUFDLFFBQUEzRCxRQUFBMVc7b0JBQ0EsU0FBQXNhO3dCQUNBLFdBQUFqZCxRQUFBLFNBQUFDLFNBQUFDOzRCQUNBMGMsT0FBQXZELFFBQUExVyxLQUFBMUMsU0FBQUM7OztvQkFJQSxPQUFBNmMsa0JBYUFBLGtDQUFBdmUsS0FDQXllLDRCQUdBQSw4QkFDQUE7O2dCQUtBMW9CLEtBQUErbUIsVUFBQTBCOztZQUdBWCxzQkFBQU0sY0FBQWpzQjtZQUNBaXNCLGNBQUFqc0IsVUFBQStwQix1QkFBQTtnQkFDQSxPQUFBbG1COztZQUVBdW1CLFFBQUE2QjtZQUtBN0IsUUFBQW9DLFFBQUEsU0FBQW5DLFNBQUFDLFNBQUExcEIsTUFBQTJwQjtnQkFDQSxJQUFBa0MsT0FBQSxJQUFBUixjQUNBakQsS0FBQXFCLFNBQUFDLFNBQUExcEIsTUFBQTJwQjtnQkFHQSxPQUFBSCxRQUFBd0Isb0JBQUF0QixXQUNBbUMsT0FDQUEsS0FBQXplLE9BQUFGLEtBQUEsU0FBQXFDO29CQUNBLE9BQUFBLE9BQUFVLE9BQUFWLE9BQUFsUixRQUFBd3RCLEtBQUF6ZTs7O1lBSUEsU0FBQTZjLGlCQUFBUixTQUFBenBCLE1BQUEwSjtnQkFDQSxJQUFBN0UsUUFBQXNsQjtnQkFFQSxnQkFBQW1CLE9BQUF2RCxRQUFBMVc7b0JBQ0EsSUFBQXhNLFVBQUF3bEIsbUJBQUE7d0JBQ0EsVUFBQTluQixNQUFBOztvQkFHQSxJQUFBc0MsVUFBQXlsQixtQkFBQTt3QkFDQSxJQUFBdkMsV0FBQTs0QkFDQSxNQUFBMVc7O3dCQUtBLE9BQUF5YTs7b0JBR0FwaUIsUUFBQXFlO29CQUNBcmUsUUFBQTJIO29CQUVBO3dCQUNBLElBQUEwYSxXQUFBcmlCLFFBQUFxaUI7d0JBQ0EsSUFBQUEsVUFBQTs0QkFDQSxJQUFBQyxpQkFBQUMsb0JBQUFGLFVBQUFyaUI7NEJBQ0EsSUFBQXNpQixnQkFBQTtnQ0FDQSxJQUFBQSxtQkFBQXpCLGtCQUFBO2dDQUNBLE9BQUF5Qjs7O3dCQUlBLElBQUF0aUIsUUFBQXFlLFdBQUE7NEJBR0FyZSxRQUFBOGUsT0FBQTllLFFBQUF3aUIsUUFBQXhpQixRQUFBMkg7K0JBRVMsSUFBQTNILFFBQUFxZSxXQUFBOzRCQUNULElBQUFsakIsVUFBQXNsQix3QkFBQTtnQ0FDQXRsQixRQUFBeWxCO2dDQUNBLE1BQUE1Z0IsUUFBQTJIOzs0QkFHQTNILFFBQUF5aUIsa0JBQUF6aUIsUUFBQTJIOytCQUVTLElBQUEzSCxRQUFBcWUsV0FBQTs0QkFDVHJlLFFBQUEwaUIsT0FBQSxVQUFBMWlCLFFBQUEySDs7d0JBR0F4TSxRQUFBd2xCO3dCQUVBLElBQUFrQixTQUFBckIsU0FBQVQsU0FBQXpwQixNQUFBMEo7d0JBQ0EsSUFBQTZoQixPQUFBeHFCLFNBQUE7NEJBR0E4RCxRQUFBNkUsUUFBQXVHLE9BQ0FxYSxvQkFDQUY7NEJBRUEsSUFBQW1CLE9BQUFsYSxRQUFBa1osa0JBQUE7Z0NBQ0E7OzRCQUdBO2dDQUNBbHNCLE9BQUFrdEIsT0FBQWxhO2dDQUNBcEIsTUFBQXZHLFFBQUF1Rzs7K0JBR1MsSUFBQXNiLE9BQUF4cUIsU0FBQTs0QkFDVDhELFFBQUF5bEI7NEJBR0E1Z0IsUUFBQXFlLFNBQUE7NEJBQ0FyZSxRQUFBMkgsTUFBQWthLE9BQUFsYTs7Ozs7WUFVQSxTQUFBNGEsb0JBQUFGLFVBQUFyaUI7Z0JBQ0EsSUFBQXFlLFNBQUFnRSxTQUFBaGpCLFNBQUFXLFFBQUFxZTtnQkFDQSxJQUFBQSxXQUFBemxCLFdBQUE7b0JBR0FvSCxRQUFBcWlCLFdBQUE7b0JBRUEsSUFBQXJpQixRQUFBcWUsV0FBQTt3QkFDQSxJQUFBZ0UsU0FBQWhqQixTQUFBcUgsUUFBQTs0QkFHQTFHLFFBQUFxZSxTQUFBOzRCQUNBcmUsUUFBQTJILE1BQUEvTzs0QkFDQTJwQixvQkFBQUYsVUFBQXJpQjs0QkFFQSxJQUFBQSxRQUFBcWUsV0FBQTtnQ0FHQSxPQUFBd0M7Ozt3QkFJQTdnQixRQUFBcWUsU0FBQTt3QkFDQXJlLFFBQUEySCxNQUFBLElBQUF2UixVQUNBOztvQkFHQSxPQUFBeXFCOztnQkFHQSxJQUFBZ0IsU0FBQXJCLFNBQUFuQyxRQUFBZ0UsU0FBQWhqQixVQUFBVyxRQUFBMkg7Z0JBRUEsSUFBQWthLE9BQUF4cUIsU0FBQTtvQkFDQTJJLFFBQUFxZSxTQUFBO29CQUNBcmUsUUFBQTJILE1BQUFrYSxPQUFBbGE7b0JBQ0EzSCxRQUFBcWlCLFdBQUE7b0JBQ0EsT0FBQXhCOztnQkFHQSxJQUFBOEIsT0FBQWQsT0FBQWxhO2dCQUVBLEtBQUFnYixNQUFBO29CQUNBM2lCLFFBQUFxZSxTQUFBO29CQUNBcmUsUUFBQTJILE1BQUEsSUFBQXZSLFVBQUE7b0JBQ0E0SixRQUFBcWlCLFdBQUE7b0JBQ0EsT0FBQXhCOztnQkFHQSxJQUFBOEIsS0FBQXBjLE1BQUE7b0JBR0F2RyxRQUFBcWlCLFNBQUFPLGNBQUFELEtBQUFodUI7b0JBR0FxTCxRQUFBMEQsT0FBQTJlLFNBQUFRO29CQVFBLElBQUE3aUIsUUFBQXFlLFdBQUE7d0JBQ0FyZSxRQUFBcWUsU0FBQTt3QkFDQXJlLFFBQUEySCxNQUFBL087O3VCQUdLO29CQUVMLE9BQUErcEI7O2dCQUtBM2lCLFFBQUFxaUIsV0FBQTtnQkFDQSxPQUFBeEI7O1lBS0FRLHNCQUFBRjtZQUVBQSxHQUFBeEIscUJBQUE7WUFPQXdCLEdBQUEzQixrQkFBQTtnQkFDQSxPQUFBam1COztZQUdBNG5CLEdBQUF4WSxXQUFBO2dCQUNBOztZQUdBLFNBQUFtYSxhQUFBQztnQkFDQSxJQUFBbk87b0JBQWlCb08sUUFBQUQsS0FBQTs7Z0JBRWpCLFNBQUFBLE1BQUE7b0JBQ0FuTyxNQUFBcU8sV0FBQUYsS0FBQTs7Z0JBR0EsU0FBQUEsTUFBQTtvQkFDQW5PLE1BQUFzTyxhQUFBSCxLQUFBO29CQUNBbk8sTUFBQXVPLFdBQUFKLEtBQUE7O2dCQUdBeHBCLEtBQUE2cEIsV0FBQWplLEtBQUF5UDs7WUFHQSxTQUFBeU8sY0FBQXpPO2dCQUNBLElBQUFpTixTQUFBak4sTUFBQTBPO2dCQUNBekIsT0FBQXhxQixPQUFBO3VCQUNBd3FCLE9BQUFsYTtnQkFDQWlOLE1BQUEwTyxhQUFBekI7O1lBR0EsU0FBQXhCLFFBQUFKO2dCQUlBMW1CLEtBQUE2cEI7b0JBQXdCSixRQUFBOztnQkFDeEIvQyxZQUFBblksUUFBQWdiLGNBQUF2cEI7Z0JBQ0FBLEtBQUFncUIsTUFBQTs7WUFHQXpELFFBQUFoUixPQUFBLFNBQUFsTTtnQkFDQSxJQUFBa007Z0JBQ0EsU0FBQXhaLE9BQUFzTixRQUFBO29CQUNBa00sS0FBQTNKLEtBQUE3UDs7Z0JBRUF3WixLQUFBMFU7Z0JBSUEsZ0JBQUE5ZjtvQkFDQSxPQUFBb0wsS0FBQTdaLFFBQUE7d0JBQ0EsSUFBQUssTUFBQXdaLEtBQUEyVTt3QkFDQSxJQUFBbnVCLE9BQUFzTixRQUFBOzRCQUNBYyxLQUFBL08sUUFBQVc7NEJBQ0FvTyxLQUFBNkMsT0FBQTs0QkFDQSxPQUFBN0M7OztvQkFPQUEsS0FBQTZDLE9BQUE7b0JBQ0EsT0FBQTdDOzs7WUFJQSxTQUFBa1ksT0FBQWhZO2dCQUNBLElBQUFBLFVBQUE7b0JBQ0EsSUFBQThmLGlCQUFBOWYsU0FBQTRiO29CQUNBLElBQUFrRSxnQkFBQTt3QkFDQSxPQUFBQSxlQUFBenRCLEtBQUEyTjs7b0JBR0EsV0FBQUEsU0FBQUYsU0FBQTt3QkFDQSxPQUFBRTs7b0JBR0EsS0FBQStmLE1BQUEvZixTQUFBM08sU0FBQTt3QkFDQSxJQUFBRCxLQUFBLEdBQUEwTyxPQUFBLFNBQUFBOzRCQUNBLFNBQUExTyxJQUFBNE8sU0FBQTNPLFFBQUE7Z0NBQ0EsSUFBQXVNLE9BQUF2TCxLQUFBMk4sVUFBQTVPLElBQUE7b0NBQ0EwTyxLQUFBL08sUUFBQWlQLFNBQUE1TztvQ0FDQTBPLEtBQUE2QyxPQUFBO29DQUNBLE9BQUE3Qzs7OzRCQUlBQSxLQUFBL08sUUFBQWlFOzRCQUNBOEssS0FBQTZDLE9BQUE7NEJBRUEsT0FBQTdDOzt3QkFHQSxPQUFBQTs7O2dCQUtBO29CQUFZQSxNQUFBMGU7OztZQUVadEMsUUFBQWxFO1lBRUEsU0FBQXdHO2dCQUNBO29CQUFZenRCLE9BQUFpRTtvQkFBQTJOLE1BQUE7OztZQUdaOFosUUFBQTNxQjtnQkFDQWtCLGFBQUF5cEI7Z0JBRUFrRCxPQUFBLFNBQUFLO29CQUNBcnFCLEtBQUFzbEIsT0FBQTtvQkFDQXRsQixLQUFBbUssT0FBQTtvQkFHQW5LLEtBQUF1bEIsT0FBQXZsQixLQUFBaXBCLFFBQUE1cEI7b0JBQ0FXLEtBQUFnTixPQUFBO29CQUNBaE4sS0FBQThvQixXQUFBO29CQUVBOW9CLEtBQUE4a0IsU0FBQTtvQkFDQTlrQixLQUFBb08sTUFBQS9PO29CQUVBVyxLQUFBNnBCLFdBQUF0YixRQUFBdWI7b0JBRUEsS0FBQU8sZUFBQTt3QkFDQSxTQUFBM2lCLFFBQUExSCxNQUFBOzRCQUVBLElBQUEwSCxLQUFBNGlCLE9BQUEsY0FDQXJpQixPQUFBdkwsS0FBQXNELE1BQUEwSCxVQUNBMGlCLE9BQUExaUIsS0FBQXFPLE1BQUE7Z0NBQ0EvVixLQUFBMEgsUUFBQXJJOzs7OztnQkFNQW1tQixNQUFBO29CQUNBeGxCLEtBQUFnTixPQUFBO29CQUVBLElBQUF1ZCxZQUFBdnFCLEtBQUE2cEIsV0FBQTtvQkFDQSxJQUFBVyxhQUFBRCxVQUFBUjtvQkFDQSxJQUFBUyxXQUFBMXNCLFNBQUE7d0JBQ0EsTUFBQTBzQixXQUFBcGM7O29CQUdBLE9BQUFwTyxLQUFBeXFCOztnQkFHQXZCLG1CQUFBLFNBQUF4YTtvQkFDQSxJQUFBMU8sS0FBQWdOLE1BQUE7d0JBQ0EsTUFBQTBCOztvQkFHQSxJQUFBakksVUFBQXpHO29CQUNBLFNBQUEwcUIsT0FBQUMsS0FBQUM7d0JBQ0F0QyxPQUFBeHFCLE9BQUE7d0JBQ0F3cUIsT0FBQWxhLE1BQUFNO3dCQUNBakksUUFBQTBELE9BQUF3Z0I7d0JBRUEsSUFBQUMsUUFBQTs0QkFHQW5rQixRQUFBcWUsU0FBQTs0QkFDQXJlLFFBQUEySCxNQUFBL087O3dCQUdBLFNBQUF1ckI7O29CQUdBLFNBQUFudkIsSUFBQXVFLEtBQUE2cEIsV0FBQW51QixTQUFBLEdBQThDRCxLQUFBLEtBQVFBLEdBQUE7d0JBQ3RELElBQUE0ZixRQUFBcmIsS0FBQTZwQixXQUFBcHVCO3dCQUNBLElBQUE2c0IsU0FBQWpOLE1BQUEwTzt3QkFFQSxJQUFBMU8sTUFBQW9PLFdBQUE7NEJBSUEsT0FBQWlCLE9BQUE7O3dCQUdBLElBQUFyUCxNQUFBb08sVUFBQXpwQixLQUFBc2xCLE1BQUE7NEJBQ0EsSUFBQXVGLFdBQUE1aUIsT0FBQXZMLEtBQUEyZSxPQUFBOzRCQUNBLElBQUF5UCxhQUFBN2lCLE9BQUF2TCxLQUFBMmUsT0FBQTs0QkFFQSxJQUFBd1AsWUFBQUMsWUFBQTtnQ0FDQSxJQUFBOXFCLEtBQUFzbEIsT0FBQWpLLE1BQUFxTyxVQUFBO29DQUNBLE9BQUFnQixPQUFBclAsTUFBQXFPLFVBQUE7dUNBQ2EsSUFBQTFwQixLQUFBc2xCLE9BQUFqSyxNQUFBc08sWUFBQTtvQ0FDYixPQUFBZSxPQUFBclAsTUFBQXNPOzttQ0FHVyxJQUFBa0IsVUFBQTtnQ0FDWCxJQUFBN3FCLEtBQUFzbEIsT0FBQWpLLE1BQUFxTyxVQUFBO29DQUNBLE9BQUFnQixPQUFBclAsTUFBQXFPLFVBQUE7O21DQUdXLElBQUFvQixZQUFBO2dDQUNYLElBQUE5cUIsS0FBQXNsQixPQUFBakssTUFBQXNPLFlBQUE7b0NBQ0EsT0FBQWUsT0FBQXJQLE1BQUFzTzs7bUNBR1c7Z0NBQ1gsVUFBQXJxQixNQUFBOzs7OztnQkFNQTZwQixRQUFBLFNBQUFyckIsTUFBQXNRO29CQUNBLFNBQUEzUyxJQUFBdUUsS0FBQTZwQixXQUFBbnVCLFNBQUEsR0FBOENELEtBQUEsS0FBUUEsR0FBQTt3QkFDdEQsSUFBQTRmLFFBQUFyYixLQUFBNnBCLFdBQUFwdUI7d0JBQ0EsSUFBQTRmLE1BQUFvTyxVQUFBenBCLEtBQUFzbEIsUUFDQXJkLE9BQUF2TCxLQUFBMmUsT0FBQSxpQkFDQXJiLEtBQUFzbEIsT0FBQWpLLE1BQUFzTyxZQUFBOzRCQUNBLElBQUFvQixlQUFBMVA7NEJBQ0E7OztvQkFJQSxJQUFBMFAsaUJBQ0FqdEIsU0FBQSxXQUNBQSxTQUFBLGVBQ0FpdEIsYUFBQXRCLFVBQUFyYixPQUNBQSxPQUFBMmMsYUFBQXBCLFlBQUE7d0JBR0FvQixlQUFBOztvQkFHQSxJQUFBekMsU0FBQXlDLDRCQUFBaEI7b0JBQ0F6QixPQUFBeHFCO29CQUNBd3FCLE9BQUFsYTtvQkFFQSxJQUFBMmMsY0FBQTt3QkFDQS9xQixLQUFBOGtCLFNBQUE7d0JBQ0E5a0IsS0FBQW1LLE9BQUE0Z0IsYUFBQXBCO3dCQUNBLE9BQUFyQzs7b0JBR0EsT0FBQXRuQixLQUFBZ3JCLFNBQUExQzs7Z0JBR0EwQyxVQUFBLFNBQUExQyxRQUFBc0I7b0JBQ0EsSUFBQXRCLE9BQUF4cUIsU0FBQTt3QkFDQSxNQUFBd3FCLE9BQUFsYTs7b0JBR0EsSUFBQWthLE9BQUF4cUIsU0FBQSxXQUNBd3FCLE9BQUF4cUIsU0FBQTt3QkFDQWtDLEtBQUFtSyxPQUFBbWUsT0FBQWxhOzJCQUNPLElBQUFrYSxPQUFBeHFCLFNBQUE7d0JBQ1BrQyxLQUFBeXFCLE9BQUF6cUIsS0FBQW9PLE1BQUFrYSxPQUFBbGE7d0JBQ0FwTyxLQUFBOGtCLFNBQUE7d0JBQ0E5a0IsS0FBQW1LLE9BQUE7MkJBQ08sSUFBQW1lLE9BQUF4cUIsU0FBQSxZQUFBOHJCLFVBQUE7d0JBQ1A1cEIsS0FBQW1LLE9BQUF5Zjs7b0JBR0EsT0FBQXRDOztnQkFHQTJELFFBQUEsU0FBQXRCO29CQUNBLFNBQUFsdUIsSUFBQXVFLEtBQUE2cEIsV0FBQW51QixTQUFBLEdBQThDRCxLQUFBLEtBQVFBLEdBQUE7d0JBQ3RELElBQUE0ZixRQUFBcmIsS0FBQTZwQixXQUFBcHVCO3dCQUNBLElBQUE0ZixNQUFBc08sMkJBQUE7NEJBQ0EzcEIsS0FBQWdyQixTQUFBM1AsTUFBQTBPLFlBQUExTyxNQUFBdU87NEJBQ0FFLGNBQUF6Tzs0QkFDQSxPQUFBaU07Ozs7Z0JBS0F6QyxPQUFBLFNBQUE0RTtvQkFDQSxTQUFBaHVCLElBQUF1RSxLQUFBNnBCLFdBQUFudUIsU0FBQSxHQUE4Q0QsS0FBQSxLQUFRQSxHQUFBO3dCQUN0RCxJQUFBNGYsUUFBQXJiLEtBQUE2cEIsV0FBQXB1Qjt3QkFDQSxJQUFBNGYsTUFBQW9PLG1CQUFBOzRCQUNBLElBQUFuQixTQUFBak4sTUFBQTBPOzRCQUNBLElBQUF6QixPQUFBeHFCLFNBQUE7Z0NBQ0EsSUFBQW90QixTQUFBNUMsT0FBQWxhO2dDQUNBMGIsY0FBQXpPOzs0QkFFQSxPQUFBNlA7OztvQkFNQSxVQUFBNXJCLE1BQUE7O2dCQUdBNnJCLGVBQUEsU0FBQTlnQixVQUFBZ2YsWUFBQUM7b0JBQ0F0cEIsS0FBQThvQjt3QkFDQWhqQixVQUFBdWMsT0FBQWhZO3dCQUNBZ2Y7d0JBQ0FDOztvQkFHQSxJQUFBdHBCLEtBQUE4a0IsV0FBQTt3QkFHQTlrQixLQUFBb08sTUFBQS9POztvQkFHQSxPQUFBaW9COzs7VUFPQTtZQUFlLE9BQUF0bkI7ZUFBY29yQixTQUFBOztJdkN3M0h2QkMsS0FDQSxTQUFVenlCLFFBQVFDLFNBQVNDO1F3Q2psSmpDRixPQUFBQyxVQUFBQyxvQkFBQTs7SXhDdWxKTXd5QixLQUNBLFNBQVUxeUIsUUFBUUMsU0FBU0M7UXlDeGxKakM7UUFFQSxJQUFBNEssUUFBQTVLLG9CQUFBO1FBQ0EsSUFBQXNILE9BQUF0SCxvQkFBQTtRQUNBLElBQUF5eUIsUUFBQXp5QixvQkFBQTtRQUNBLElBQUEweUIsV0FBQTF5QixvQkFBQTtRQVFBLFNBQUEyeUIsZUFBQUM7WUFDQSxJQUFBamxCLFVBQUEsSUFBQThrQixNQUFBRztZQUNBLElBQUE5dUIsV0FBQXdELEtBQUFtckIsTUFBQXB2QixVQUFBd3ZCLFNBQUFsbEI7WUFHQS9DLE1BQUFrb0IsT0FBQWh2QixVQUFBMnVCLE1BQUFwdkIsV0FBQXNLO1lBR0EvQyxNQUFBa29CLE9BQUFodkIsVUFBQTZKO1lBRUEsT0FBQTdKOztRQUlBLElBQUFpdkIsUUFBQUosZUFBQUQ7UUFHQUssTUFBQU47UUFHQU0sTUFBQXp1QixTQUFBLFNBQUFBLE9BQUEwdUI7WUFDQSxPQUFBTCxlQUFBL25CLE1BQUFxb0IsTUFBQVAsVUFBQU07O1FBSUFELE1BQUFHLFNBQUFsekIsb0JBQUE7UUFDQSt5QixNQUFBSSxjQUFBbnpCLG9CQUFBO1FBQ0EreUIsTUFBQUssV0FBQXB6QixvQkFBQTtRQUdBK3lCLE1BQUE1WSxNQUFBLFNBQUFBLElBQUFrWjtZQUNBLE9BQUExZ0IsUUFBQXdILElBQUFrWjs7UUFFQU4sTUFBQU8sU0FBQXR6QixvQkFBQTtRQUVBRixPQUFBQyxVQUFBZ3pCO1FBR0FqekIsT0FBQUMsUUFBQWlCLFVBQUEreEI7O0l6QytsSk1RLEtBQ0EsU0FBVXp6QixRQUFRQyxTQUFTQztRMENucEpqQztRQUVBLElBQUFzSCxPQUFBdEgsb0JBQUE7UUFDQSxJQUFBd3pCLFdBQUF4ekIsb0JBQUE7UUFNQSxJQUFBc1csV0FBQWxVLE9BQUFpQixVQUFBaVQ7UUFRQSxTQUFBdEYsUUFBQWdDO1lBQ0EsT0FBQXNELFNBQUExUyxLQUFBb1AsU0FBQTs7UUFTQSxTQUFBeWdCLGNBQUF6Z0I7WUFDQSxPQUFBc0QsU0FBQTFTLEtBQUFvUCxTQUFBOztRQVNBLFNBQUEwZ0IsV0FBQTFnQjtZQUNBLGNBQUEyZ0IsYUFBQSxlQUFBM2dCLGVBQUEyZ0I7O1FBU0EsU0FBQUMsa0JBQUE1Z0I7WUFDQSxJQUFBUTtZQUNBLFdBQUFxZ0IsZ0JBQUEsZUFBQUEsWUFBQTtnQkFDQXJnQixTQUFBcWdCLFlBQUFDLE9BQUE5Z0I7bUJBQ0c7Z0JBQ0hRLFNBQUEsT0FBQVIsSUFBQSxVQUFBQSxJQUFBckIsa0JBQUFraUI7O1lBRUEsT0FBQXJnQjs7UUFTQSxTQUFBdWdCLFNBQUEvZ0I7WUFDQSxjQUFBQSxRQUFBOztRQVNBLFNBQUFnaEIsU0FBQWhoQjtZQUNBLGNBQUFBLFFBQUE7O1FBU0EsU0FBQWloQixZQUFBamhCO1lBQ0EsY0FBQUEsUUFBQTs7UUFTQSxTQUFBa2hCLFNBQUFsaEI7WUFDQSxPQUFBQSxRQUFBLGVBQUFBLFFBQUE7O1FBU0EsU0FBQW1oQixPQUFBbmhCO1lBQ0EsT0FBQXNELFNBQUExUyxLQUFBb1AsU0FBQTs7UUFTQSxTQUFBb2hCLE9BQUFwaEI7WUFDQSxPQUFBc0QsU0FBQTFTLEtBQUFvUCxTQUFBOztRQVNBLFNBQUFxaEIsT0FBQXJoQjtZQUNBLE9BQUFzRCxTQUFBMVMsS0FBQW9QLFNBQUE7O1FBU0EsU0FBQXNoQixXQUFBdGhCO1lBQ0EsT0FBQXNELFNBQUExUyxLQUFBb1AsU0FBQTs7UUFTQSxTQUFBdWhCLFNBQUF2aEI7WUFDQSxPQUFBa2hCLFNBQUFsaEIsUUFBQXNoQixXQUFBdGhCLElBQUF3aEI7O1FBU0EsU0FBQUMsa0JBQUF6aEI7WUFDQSxjQUFBMGhCLG9CQUFBLGVBQUExaEIsZUFBQTBoQjs7UUFTQSxTQUFBQyxLQUFBQztZQUNBLE9BQUFBLElBQUFDLFFBQUEsWUFBQUEsUUFBQTs7UUFnQkEsU0FBQUM7WUFDQSxXQUFBQyxjQUFBLGVBQUFBLFVBQUFDLFlBQUE7Z0JBQ0E7O1lBRUEsY0FDQTd6QixXQUFBLHNCQUNBUyxhQUFBOztRQWdCQSxTQUFBNlQsUUFBQTNVLEtBQUEyVDtZQUVBLElBQUEzVCxRQUFBLGVBQUFBLFFBQUE7Z0JBQ0E7O1lBSUEsV0FBQUEsUUFBQTtnQkFFQUE7O1lBR0EsSUFBQWtRLFFBQUFsUSxNQUFBO2dCQUVBLFNBQUE2QixJQUFBLEdBQUFzeUIsSUFBQW4wQixJQUFBOEIsUUFBbUNELElBQUFzeUIsR0FBT3R5QixLQUFBO29CQUMxQzhSLEdBQUE3USxLQUFBLE1BQUE5QyxJQUFBNkIsT0FBQTdCOzttQkFFRztnQkFFSCxTQUFBbUMsT0FBQW5DLEtBQUE7b0JBQ0EsSUFBQXNCLE9BQUFpQixVQUFBTSxlQUFBQyxLQUFBOUMsS0FBQW1DLE1BQUE7d0JBQ0F3UixHQUFBN1EsS0FBQSxNQUFBOUMsSUFBQW1DLFdBQUFuQzs7Ozs7UUF1QkEsU0FBQW15QjtZQUNBLElBQUF6ZjtZQUNBLFNBQUEwaEIsWUFBQWxpQixLQUFBL1A7Z0JBQ0EsV0FBQXVRLE9BQUF2USxTQUFBLG1CQUFBK1AsUUFBQTtvQkFDQVEsT0FBQXZRLE9BQUFnd0IsTUFBQXpmLE9BQUF2USxNQUFBK1A7dUJBQ0s7b0JBQ0xRLE9BQUF2USxPQUFBK1A7OztZQUlBLFNBQUFyUSxJQUFBLEdBQUFzeUIsSUFBQXJvQixVQUFBaEssUUFBdUNELElBQUFzeUIsR0FBT3R5QixLQUFBO2dCQUM5QzhTLFFBQUE3SSxVQUFBakssSUFBQXV5Qjs7WUFFQSxPQUFBMWhCOztRQVdBLFNBQUFzZixPQUFBelAsR0FBQTNQLEdBQUEwVTtZQUNBM1MsUUFBQS9CLEdBQUEsU0FBQXdoQixZQUFBbGlCLEtBQUEvUDtnQkFDQSxJQUFBbWxCLGtCQUFBcFYsUUFBQTtvQkFDQXFRLEVBQUFwZ0IsT0FBQXFFLEtBQUEwTCxLQUFBb1Y7dUJBQ0s7b0JBQ0wvRSxFQUFBcGdCLE9BQUErUDs7O1lBR0EsT0FBQXFROztRQUdBdmpCLE9BQUFDO1lBQ0FpUjtZQUNBeWlCO1lBQ0FEO1lBQ0FFO1lBQ0FFO1lBQ0FHO1lBQ0FDO1lBQ0FFO1lBQ0FEO1lBQ0FFO1lBQ0FDO1lBQ0FDO1lBQ0FDO1lBQ0FDO1lBQ0FFO1lBQ0FLO1lBQ0FyZjtZQUNBd2Q7WUFDQUg7WUFDQTZCOzs7STFDMnBKTVEsS0FDQSxTQUFVcjFCLFFBQVFDO1EyQ3o4SnhCO1FBRUFELE9BQUFDLFVBQUEsU0FBQXVILEtBQUFtTixJQUFBMlQ7WUFDQSxnQkFBQWlFO2dCQUNBLElBQUF4ZixPQUFBLElBQUFDLE1BQUFGLFVBQUFoSztnQkFDQSxTQUFBRCxJQUFBLEdBQW1CQSxJQUFBa0ssS0FBQWpLLFFBQWlCRCxLQUFBO29CQUNwQ2tLLEtBQUFsSyxLQUFBaUssVUFBQWpLOztnQkFFQSxPQUFBOFIsR0FBQWxILE1BQUE2YSxTQUFBdmI7Ozs7STNDazlKTXVvQixLQUNBLFNBQVV0MUIsUUFBUUM7UTRDbDlKeEJELE9BQUFDLFVBQUEsU0FBQWU7WUFDQSxPQUFBQSxPQUFBLFNBQUEweUIsU0FBQTF5QixRQUFBdTBCLGFBQUF2MEIsY0FBQXcwQjs7UUFHQSxTQUFBOUIsU0FBQTF5QjtZQUNBLFNBQUFBLElBQUF5RCxzQkFBQXpELElBQUF5RCxZQUFBaXZCLGFBQUEsY0FBQTF5QixJQUFBeUQsWUFBQWl2QixTQUFBMXlCOztRQUlBLFNBQUF1MEIsYUFBQXYwQjtZQUNBLGNBQUFBLElBQUF5MEIsZ0JBQUEscUJBQUF6MEIsSUFBQW1jLFVBQUEsY0FBQXVXLFNBQUExeUIsSUFBQW1jLE1BQUE7OztJNUNtK0pNdVksS0FDQSxTQUFVMTFCLFFBQVFDLFNBQVNDO1E2Q3YvSmpDO1FBRUEsSUFBQTB5QixXQUFBMXlCLG9CQUFBO1FBQ0EsSUFBQTRLLFFBQUE1SyxvQkFBQTtRQUNBLElBQUF5MUIscUJBQUF6MUIsb0JBQUE7UUFDQSxJQUFBMDFCLGtCQUFBMTFCLG9CQUFBO1FBT0EsU0FBQXl5QixNQUFBTztZQUNBOXJCLEtBQUF3ckIsV0FBQU07WUFDQTlyQixLQUFBeXVCO2dCQUNBOUMsU0FBQSxJQUFBNEM7Z0JBQ0F6WSxVQUFBLElBQUF5WTs7O1FBU0FoRCxNQUFBcHZCLFVBQUF3dkIsVUFBQSxTQUFBQSxRQUFBL0c7WUFHQSxXQUFBQSxXQUFBO2dCQUNBQSxTQUFBbGhCLE1BQUFxb0I7b0JBQ0FoSCxLQUFBcmYsVUFBQTttQkFDS0EsVUFBQTs7WUFHTGtmLFNBQUFsaEIsTUFBQXFvQixNQUFBUDtnQkFBa0MxRyxRQUFBO2VBQWM5a0IsS0FBQXdyQixVQUFBNUc7WUFDaERBLE9BQUFFLFNBQUFGLE9BQUFFLE9BQUE0SjtZQUdBLElBQUFDLFVBQUFILGlCQUFBbnZCO1lBQ0EsSUFBQTBLLFVBQUEwQixRQUFBQyxRQUFBa1o7WUFFQTVrQixLQUFBeXVCLGFBQUE5QyxRQUFBcGQsUUFBQSxTQUFBcWdCLDJCQUFBQztnQkFDQUYsTUFBQUcsUUFBQUQsWUFBQUUsV0FBQUYsWUFBQUc7O1lBR0FodkIsS0FBQXl1QixhQUFBM1ksU0FBQXZILFFBQUEsU0FBQTBnQix5QkFBQUo7Z0JBQ0FGLE1BQUEvaUIsS0FBQWlqQixZQUFBRSxXQUFBRixZQUFBRzs7WUFHQSxPQUFBTCxNQUFBanpCLFFBQUE7Z0JBQ0FxTyxrQkFBQUUsS0FBQTBrQixNQUFBN1gsU0FBQTZYLE1BQUE3WDs7WUFHQSxPQUFBL007O1FBSUFyRyxNQUFBNkssVUFBQSwrQ0FBQTJnQixvQkFBQXBLO1lBRUF5RyxNQUFBcHZCLFVBQUEyb0IsVUFBQSxTQUFBQyxLQUFBSDtnQkFDQSxPQUFBNWtCLEtBQUEyckIsUUFBQWpvQixNQUFBcW9CLE1BQUFuSDtvQkFDQUU7b0JBQ0FDOzs7O1FBS0FyaEIsTUFBQTZLLFVBQUEsbUNBQUE0Z0Isc0JBQUFySztZQUVBeUcsTUFBQXB2QixVQUFBMm9CLFVBQUEsU0FBQUMsS0FBQTlpQixNQUFBMmlCO2dCQUNBLE9BQUE1a0IsS0FBQTJyQixRQUFBam9CLE1BQUFxb0IsTUFBQW5IO29CQUNBRTtvQkFDQUM7b0JBQ0E5aUI7Ozs7UUFLQXJKLE9BQUFDLFVBQUEweUI7O0k3QzgvSk02RCxLQUNBLFNBQVV4MkIsUUFBUUMsU0FBU0M7UzhDN2tLakMsU0FBQW9NO1lBQUE7WUFFQSxJQUFBeEIsUUFBQTVLLG9CQUFBO1lBQ0EsSUFBQXUyQixzQkFBQXYyQixvQkFBQTtZQUVBLElBQUF3MkI7Z0JBQ0FDLGdCQUFBOztZQUdBLFNBQUFDLHNCQUFBeEssU0FBQTVwQjtnQkFDQSxLQUFBc0ksTUFBQXFwQixZQUFBL0gsWUFBQXRoQixNQUFBcXBCLFlBQUEvSCxRQUFBO29CQUNBQSxRQUFBLGtCQUFBNXBCOzs7WUFJQSxTQUFBcTBCO2dCQUNBLElBQUFDO2dCQUNBLFdBQUFDLG1CQUFBO29CQUVBRCxVQUFBNTJCLG9CQUFBO3VCQUNHLFdBQUFvTSxZQUFBO29CQUVId3FCLFVBQUE1MkIsb0JBQUE7O2dCQUVBLE9BQUE0MkI7O1lBR0EsSUFBQWxFO2dCQUNBa0UsU0FBQUQ7Z0JBRUFHLG9CQUFBLFNBQUFBLGlCQUFBM3RCLE1BQUEraUI7b0JBQ0FxSyxvQkFBQXJLLFNBQUE7b0JBQ0EsSUFBQXRoQixNQUFBOG9CLFdBQUF2cUIsU0FDQXlCLE1BQUE2b0IsY0FBQXRxQixTQUNBeUIsTUFBQTRvQixTQUFBcnFCLFNBQ0F5QixNQUFBMnBCLFNBQUFwckIsU0FDQXlCLE1BQUF3cEIsT0FBQWpyQixTQUNBeUIsTUFBQXlwQixPQUFBbHJCLE9BQ0E7d0JBQ0EsT0FBQUE7O29CQUVBLElBQUF5QixNQUFBZ3BCLGtCQUFBenFCLE9BQUE7d0JBQ0EsT0FBQUEsS0FBQXdJOztvQkFFQSxJQUFBL0csTUFBQTZwQixrQkFBQXRyQixPQUFBO3dCQUNBdXRCLHNCQUFBeEssU0FBQTt3QkFDQSxPQUFBL2lCLEtBQUFtTjs7b0JBRUEsSUFBQTFMLE1BQUFzcEIsU0FBQS9xQixPQUFBO3dCQUNBdXRCLHNCQUFBeEssU0FBQTt3QkFDQSxPQUFBaGlCLEtBQUE2c0IsVUFBQTV0Qjs7b0JBRUEsT0FBQUE7O2dCQUdBNnRCLHFCQUFBLFNBQUFBLGtCQUFBN3RCO29CQUVBLFdBQUFBLFNBQUE7d0JBQ0E7NEJBQ0FBLE9BQUFlLEtBQUFDLE1BQUFoQjswQkFDTyxPQUFBeEI7O29CQUVQLE9BQUF3Qjs7Z0JBT0E4dEIsU0FBQTtnQkFFQUMsZ0JBQUE7Z0JBQ0FDLGdCQUFBO2dCQUVBQyxtQkFBQTtnQkFFQUMsZ0JBQUEsU0FBQUEsZUFBQUM7b0JBQ0EsT0FBQUEsVUFBQSxPQUFBQSxTQUFBOzs7WUFJQTVFLFNBQUF4RztnQkFDQXFMO29CQUNBQyxRQUFBOzs7WUFJQTVzQixNQUFBNkssVUFBQSxvQ0FBQTJnQixvQkFBQXBLO2dCQUNBMEcsU0FBQXhHLFFBQUFGOztZQUdBcGhCLE1BQUE2SyxVQUFBLG1DQUFBNGdCLHNCQUFBcks7Z0JBQ0EwRyxTQUFBeEcsUUFBQUYsVUFBQXBoQixNQUFBcW9CLE1BQUF1RDs7WUFHQTEyQixPQUFBQyxVQUFBMnlCO1c5Q2lsSzhCOXVCLEtBQUs3RCxTQUFTQyxvQkFBb0I7O0lBSTFEeTNCLEtBQ0EsU0FBVTMzQixRQUFRQyxTQUFTQztRK0NycktqQztRQUVBLElBQUE0SyxRQUFBNUssb0JBQUE7UUFFQUYsT0FBQUMsVUFBQSxTQUFBdzJCLG9CQUFBckssU0FBQXdMO1lBQ0E5c0IsTUFBQTZLLFFBQUF5VyxTQUFBLFNBQUF5TCxjQUFBcjFCLE9BQUFzTTtnQkFDQSxJQUFBQSxTQUFBOG9CLGtCQUFBOW9CLEtBQUFncEIsa0JBQUFGLGVBQUFFLGVBQUE7b0JBQ0ExTCxRQUFBd0wsa0JBQUFwMUI7MkJBQ0E0cEIsUUFBQXRkOzs7OztJL0MrcktNaXBCLEtBQ0EsU0FBVS8zQixRQUFRQyxTQUFTQztTZ0R4c0tqQyxTQUFBb007WUFBQTtZQUVBLElBQUF4QixRQUFBNUssb0JBQUE7WUFDQSxJQUFBODNCLFNBQUE5M0Isb0JBQUE7WUFDQSxJQUFBKzNCLFdBQUEvM0Isb0JBQUE7WUFDQSxJQUFBZzRCLGVBQUFoNEIsb0JBQUE7WUFDQSxJQUFBaTRCLGtCQUFBajRCLG9CQUFBO1lBQ0EsSUFBQWs0QixjQUFBbDRCLG9CQUFBO1lBQ0EsSUFBQW00QixjQUFBaDNCLFdBQUEsZUFBQUEsT0FBQWczQixRQUFBaDNCLE9BQUFnM0IsS0FBQTd3QixLQUFBbkcsV0FBQW5CLG9CQUFBO1lBRUFGLE9BQUFDLFVBQUEsU0FBQXE0QixXQUFBdE07Z0JBQ0EsV0FBQW5aLFFBQUEsU0FBQTBsQixtQkFBQXpsQixTQUFBQztvQkFDQSxJQUFBeWxCLGNBQUF4TSxPQUFBM2lCO29CQUNBLElBQUFvdkIsaUJBQUF6TSxPQUFBSTtvQkFFQSxJQUFBdGhCLE1BQUE4b0IsV0FBQTRFLGNBQUE7K0JBQ0FDLGVBQUE7O29CQUdBLElBQUExRixVQUFBLElBQUFnRTtvQkFDQSxJQUFBMkIsWUFBQTtvQkFDQSxJQUFBQyxVQUFBO29CQUtBLElBQUFyc0IsUUFBQWMsSUFBQUMsYUFBQSxpQkFDQWhNLFdBQUEsZUFDQUEsT0FBQXUzQixvQkFBQSxxQkFBQTdGLGFBQ0FvRixnQkFBQW5NLE9BQUFHLE1BQUE7d0JBQ0E0RyxVQUFBLElBQUExeEIsT0FBQXUzQjt3QkFDQUYsWUFBQTt3QkFDQUMsVUFBQTt3QkFDQTVGLFFBQUE4RixhQUFBLFNBQUFDO3dCQUNBL0YsUUFBQWdHLFlBQUEsU0FBQUM7O29CQUlBLElBQUFoTixPQUFBaU4sTUFBQTt3QkFDQSxJQUFBQyxXQUFBbE4sT0FBQWlOLEtBQUFDLFlBQUE7d0JBQ0EsSUFBQUMsV0FBQW5OLE9BQUFpTixLQUFBRSxZQUFBO3dCQUNBVixlQUFBVyxnQkFBQSxXQUFBZixLQUFBYSxXQUFBLE1BQUFDOztvQkFHQXBHLFFBQUFzRyxLQUFBck4sT0FBQUUsT0FBQTRMLGVBQUFHLFNBQUFqTSxPQUFBRyxLQUFBSCxPQUFBc04sUUFBQXROLE9BQUF1TixtQkFBQTtvQkFHQXhHLFFBQUFvRSxVQUFBbkwsT0FBQW1MO29CQUdBcEUsUUFBQTJGLGFBQUEsU0FBQWM7d0JBQ0EsS0FBQXpHLG1CQUFBMEcsZUFBQSxNQUFBZCxTQUFBOzRCQUNBOzt3QkFPQSxJQUFBNUYsUUFBQXlFLFdBQUEsT0FBQXpFLFFBQUEyRyxlQUFBM0csUUFBQTJHLFlBQUF4dkIsUUFBQTs0QkFDQTs7d0JBSUEsSUFBQXl2QixrQkFBQSwyQkFBQTVHLFVBQUFtRixhQUFBbkYsUUFBQTZHLDJCQUFBO3dCQUNBLElBQUFDLGdCQUFBN04sT0FBQThOLGdCQUFBOU4sT0FBQThOLGlCQUFBLFNBQUEvRyxRQUFBZ0gsZUFBQWhILFFBQUE3Vjt3QkFDQSxJQUFBQTs0QkFDQTdULE1BQUF3d0I7NEJBRUFyQyxRQUFBekUsUUFBQXlFLFdBQUEsYUFBQXpFLFFBQUF5RTs0QkFDQXdDLFlBQUFqSCxRQUFBeUUsV0FBQSxzQkFBQXpFLFFBQUFpSDs0QkFDQTVOLFNBQUF1Tjs0QkFDQTNOOzRCQUNBK0c7O3dCQUdBaUYsT0FBQWxsQixTQUFBQyxRQUFBbUs7d0JBR0E2VixVQUFBOztvQkFJQUEsUUFBQTNNLFVBQUEsU0FBQTZUO3dCQUdBbG5CLE9BQUFxbEIsWUFBQSxpQkFBQXBNLFFBQUEsTUFBQStHO3dCQUdBQSxVQUFBOztvQkFJQUEsUUFBQWdHLFlBQUEsU0FBQUM7d0JBQ0FqbUIsT0FBQXFsQixZQUFBLGdCQUFBcE0sT0FBQW1MLFVBQUEsZUFBQW5MLFFBQUEsZ0JBQ0ErRzt3QkFHQUEsVUFBQTs7b0JBTUEsSUFBQWpvQixNQUFBa3FCLHdCQUFBO3dCQUNBLElBQUFrRixVQUFBaDZCLG9CQUFBO3dCQUdBLElBQUFpNkIsYUFBQW5PLE9BQUFvTyxtQkFBQWpDLGdCQUFBbk0sT0FBQUcsU0FBQUgsT0FBQW9MLGlCQUNBOEMsUUFBQUcsS0FBQXJPLE9BQUFvTCxrQkFDQTN3Qjt3QkFFQSxJQUFBMHpCLFdBQUE7NEJBQ0ExQixlQUFBek0sT0FBQXFMLGtCQUFBOEM7OztvQkFLQSwwQkFBQXBILFNBQUE7d0JBQ0Fqb0IsTUFBQTZLLFFBQUE4aUIsZ0JBQUEsU0FBQTZCLGlCQUFBcG5CLEtBQUEvUDs0QkFDQSxXQUFBcTFCLGdCQUFBLGVBQUFyMUIsSUFBQTJ5QixrQkFBQTt1Q0FFQTJDLGVBQUF0MUI7bUNBQ1M7Z0NBRVQ0dkIsUUFBQXVILGlCQUFBbjNCLEtBQUErUDs7OztvQkFNQSxJQUFBOFksT0FBQW9PLGlCQUFBO3dCQUNBckgsUUFBQXFILGtCQUFBOztvQkFJQSxJQUFBcE8sT0FBQThOLGNBQUE7d0JBQ0E7NEJBQ0EvRyxRQUFBK0csZUFBQTlOLE9BQUE4TjswQkFDTyxPQUFBanlCOzRCQUdQLElBQUFta0IsT0FBQThOLGlCQUFBO2dDQUNBLE1BQUFqeUI7Ozs7b0JBTUEsV0FBQW1rQixPQUFBdU8sdUJBQUE7d0JBQ0F4SCxRQUFBaHhCLGlCQUFBLFlBQUFpcUIsT0FBQXVPOztvQkFJQSxXQUFBdk8sT0FBQXdPLHFCQUFBLGNBQUF6SCxRQUFBMEgsUUFBQTt3QkFDQTFILFFBQUEwSCxPQUFBMTRCLGlCQUFBLFlBQUFpcUIsT0FBQXdPOztvQkFHQSxJQUFBeE8sT0FBQTBPLGFBQUE7d0JBRUExTyxPQUFBME8sWUFBQXZwQixRQUFBRSxLQUFBLFNBQUFzcEIsV0FBQTlpQjs0QkFDQSxLQUFBa2IsU0FBQTtnQ0FDQTs7NEJBR0FBLFFBQUF2Yjs0QkFDQXpFLE9BQUE4RTs0QkFFQWtiLFVBQUE7OztvQkFJQSxJQUFBeUYsZ0JBQUEveEIsV0FBQTt3QkFDQSt4QixjQUFBOztvQkFJQXpGLFFBQUE2SCxLQUFBcEM7OztXaEQ4c0s4QjEwQixLQUFLN0QsU0FBU0Msb0JBQW9COztJQUkxRDI2QixLQUNBLFNBQVU3NkIsUUFBUUMsU0FBU0M7UWlEcDRLakM7UUFFQSxJQUFBazRCLGNBQUFsNEIsb0JBQUE7UUFTQUYsT0FBQUMsVUFBQSxTQUFBKzNCLE9BQUFsbEIsU0FBQUMsUUFBQW1LO1lBQ0EsSUFBQXFhLGlCQUFBcmEsU0FBQThPLE9BQUF1TDtZQUVBLEtBQUFyYSxTQUFBc2EsV0FBQUQsaUNBQUFyYSxTQUFBc2EsU0FBQTtnQkFDQTFrQixRQUFBb0s7bUJBQ0c7Z0JBQ0huSyxPQUFBcWxCLFlBQ0EscUNBQUFsYixTQUFBc2EsUUFDQXRhLFNBQUE4TyxRQUNBLE1BQ0E5TyxTQUFBNlYsU0FDQTdWOzs7O0lqRDg0S000ZCxLQUNBLFNBQVU5NkIsUUFBUUMsU0FBU0M7UWtEcjZLakM7UUFFQSxJQUFBNjZCLGVBQUE3NkIsb0JBQUE7UUFZQUYsT0FBQUMsVUFBQSxTQUFBbTRCLFlBQUF2eEIsU0FBQW1sQixRQUFBZ1AsTUFBQWpJLFNBQUE3VjtZQUNBLElBQUF0VyxRQUFBLElBQUFGLE1BQUFHO1lBQ0EsT0FBQWswQixhQUFBbjBCLE9BQUFvbEIsUUFBQWdQLE1BQUFqSSxTQUFBN1Y7OztJbEQ2NktNK2QsS0FDQSxTQUFVajdCLFFBQVFDO1FtRDk3S3hCO1FBWUFELE9BQUFDLFVBQUEsU0FBQTg2QixhQUFBbjBCLE9BQUFvbEIsUUFBQWdQLE1BQUFqSSxTQUFBN1Y7WUFDQXRXLE1BQUFvbEI7WUFDQSxJQUFBZ1AsTUFBQTtnQkFDQXAwQixNQUFBbzBCOztZQUVBcDBCLE1BQUFtc0I7WUFDQW5zQixNQUFBc1c7WUFDQSxPQUFBdFc7OztJbkRzOEtNczBCLEtBQ0EsU0FBVWw3QixRQUFRQyxTQUFTQztRb0QxOUtqQztRQUVBLElBQUE0SyxRQUFBNUssb0JBQUE7UUFFQSxTQUFBaTdCLE9BQUFqb0I7WUFDQSxPQUFBa29CLG1CQUFBbG9CLEtBQ0E2aEIsUUFBQSxjQUNBQSxRQUFBLGNBQ0FBLFFBQUEsYUFDQUEsUUFBQSxjQUNBQSxRQUFBLGFBQ0FBLFFBQUEsY0FDQUEsUUFBQTs7UUFVQS8wQixPQUFBQyxVQUFBLFNBQUFnNEIsU0FBQTlMLEtBQUFtTixRQUFBQztZQUVBLEtBQUFELFFBQUE7Z0JBQ0EsT0FBQW5OOztZQUdBLElBQUFrUDtZQUNBLElBQUE5QixrQkFBQTtnQkFDQThCLG1CQUFBOUIsaUJBQUFEO21CQUNHLElBQUF4dUIsTUFBQTZwQixrQkFBQTJFLFNBQUE7Z0JBQ0grQixtQkFBQS9CLE9BQUE5aUI7bUJBQ0c7Z0JBQ0gsSUFBQThrQjtnQkFFQXh3QixNQUFBNkssUUFBQTJqQixRQUFBLFNBQUFpQyxVQUFBcm9CLEtBQUEvUDtvQkFDQSxJQUFBK1AsUUFBQSxlQUFBQSxRQUFBO3dCQUNBOztvQkFHQSxJQUFBcEksTUFBQW9HLFFBQUFnQyxNQUFBO3dCQUNBL1AsWUFBQTsyQkFDTzt3QkFDUCtQOztvQkFHQXBJLE1BQUE2SyxRQUFBekMsS0FBQSxTQUFBc29CLFdBQUFwckI7d0JBQ0EsSUFBQXRGLE1BQUF1cEIsT0FBQWprQixJQUFBOzRCQUNBQSxNQUFBcXJCOytCQUNTLElBQUEzd0IsTUFBQXNwQixTQUFBaGtCLElBQUE7NEJBQ1RBLElBQUFoRyxLQUFBNnNCLFVBQUE3bUI7O3dCQUVBa3JCLE1BQUF0b0IsS0FBQW1vQixPQUFBaDRCLE9BQUEsTUFBQWc0QixPQUFBL3FCOzs7Z0JBSUFpckIsbUJBQUFDLE1BQUExZ0IsS0FBQTs7WUFHQSxJQUFBeWdCLGtCQUFBO2dCQUNBbFAsWUFBQWppQixRQUFBLDJCQUFBbXhCOztZQUdBLE9BQUFsUDs7O0lwRGsrS011UCxLQUNBLFNBQVUxN0IsUUFBUUMsU0FBU0M7UXFEbmlMakM7UUFFQSxJQUFBNEssUUFBQTVLLG9CQUFBO1FBSUEsSUFBQXk3QixzQkFDQSxrRUFDQSx1RUFDQSxvRUFDQTtRQWdCQTM3QixPQUFBQyxVQUFBLFNBQUFpNEIsYUFBQTlMO1lBQ0EsSUFBQXdQO1lBQ0EsSUFBQXo0QjtZQUNBLElBQUErUDtZQUNBLElBQUFyUTtZQUVBLEtBQUF1cEIsU0FBQTtnQkFBaUIsT0FBQXdQOztZQUVqQjl3QixNQUFBNkssUUFBQXlXLFFBQUF4VCxNQUFBLGdCQUFBaWpCLE9BQUFDO2dCQUNBajVCLElBQUFpNUIsS0FBQTV4QixRQUFBO2dCQUNBL0csTUFBQTJILE1BQUErcEIsS0FBQWlILEtBQUFDLE9BQUEsR0FBQWw1QixJQUFBaXpCO2dCQUNBNWlCLE1BQUFwSSxNQUFBK3BCLEtBQUFpSCxLQUFBQyxPQUFBbDVCLElBQUE7Z0JBRUEsSUFBQU0sS0FBQTtvQkFDQSxJQUFBeTRCLE9BQUF6NEIsUUFBQXc0QixrQkFBQXp4QixRQUFBL0csUUFBQTt3QkFDQTs7b0JBRUEsSUFBQUEsUUFBQTt3QkFDQXk0QixPQUFBejRCLFFBQUF5NEIsT0FBQXo0QixPQUFBeTRCLE9BQUF6NEIsV0FBQStZLFNBQUFoSjsyQkFDTzt3QkFDUDBvQixPQUFBejRCLE9BQUF5NEIsT0FBQXo0QixPQUFBeTRCLE9BQUF6NEIsT0FBQSxPQUFBK1A7Ozs7WUFLQSxPQUFBMG9COzs7SXJEMmlMTUksS0FDQSxTQUFVaDhCLFFBQVFDLFNBQVNDO1FzRC9sTGpDO1FBRUEsSUFBQTRLLFFBQUE1SyxvQkFBQTtRQUVBRixPQUFBQyxVQUNBNkssTUFBQWtxQix5QkFJQSxTQUFBaUg7WUFDQSxJQUFBQyxPQUFBLGtCQUFBQyxLQUFBbEgsVUFBQW1IO1lBQ0EsSUFBQUMsaUJBQUF2NkIsU0FBQUksY0FBQTtZQUNBLElBQUFvNkI7WUFRQSxTQUFBQyxXQUFBcFE7Z0JBQ0EsSUFBQXFRLE9BQUFyUTtnQkFFQSxJQUFBK1AsTUFBQTtvQkFFQUcsZUFBQUksYUFBQSxRQUFBRDtvQkFDQUEsT0FBQUgsZUFBQUc7O2dCQUdBSCxlQUFBSSxhQUFBLFFBQUFEO2dCQUdBO29CQUNBQSxNQUFBSCxlQUFBRztvQkFDQUUsVUFBQUwsZUFBQUssV0FBQUwsZUFBQUssU0FBQTNILFFBQUE7b0JBQ0E0SCxNQUFBTixlQUFBTTtvQkFDQUMsUUFBQVAsZUFBQU8sU0FBQVAsZUFBQU8sT0FBQTdILFFBQUE7b0JBQ0E4SCxNQUFBUixlQUFBUSxPQUFBUixlQUFBUSxLQUFBOUgsUUFBQTtvQkFDQStILFVBQUFULGVBQUFTO29CQUNBQyxNQUFBVixlQUFBVTtvQkFDQUMsVUFBQVgsZUFBQVcsU0FBQXRMLE9BQUEsYUFDQTJLLGVBQUFXLFdBQ0EsTUFBQVgsZUFBQVc7OztZQUlBVixZQUFBQyxXQUFBbDdCLE9BQUE0N0IsU0FBQVQ7WUFRQSxnQkFBQXJFLGdCQUFBK0U7Z0JBQ0EsSUFBQXRCLFNBQUE5d0IsTUFBQW1wQixTQUFBaUosY0FBQVgsV0FBQVc7Z0JBQ0EsT0FBQXRCLE9BQUFjLGFBQUFKLFVBQUFJLFlBQ0FkLE9BQUFlLFNBQUFMLFVBQUFLOztjQUtBLFNBQUFRO1lBQ0EsZ0JBQUFoRjtnQkFDQTs7OztJdER5bUxNaUYsS0FDQSxTQUFVcDlCLFFBQVFDO1F1RDFxTHhCO1FBSUEsSUFBQW85QixRQUFBO1FBRUEsU0FBQUM7WUFDQWwyQixLQUFBUCxVQUFBOztRQUVBeTJCLEVBQUEvNUIsWUFBQSxJQUFBbUQ7UUFDQTQyQixFQUFBLzVCLFVBQUF5M0IsT0FBQTtRQUNBc0MsRUFBQS81QixVQUFBdUwsT0FBQTtRQUVBLFNBQUF1cEIsS0FBQXpoQjtZQUNBLElBQUFrZSxNQUFBamUsT0FBQUQ7WUFDQSxJQUFBb00sU0FBQTtZQUNBLEtBRUEsSUFBQXVhLE9BQUFDLFVBQUFDLE1BQUEsR0FBQXgyQixNQUFBbzJCLE9BSUF2SSxJQUFBcEQsT0FBQStMLE1BQUEsT0FBQXgyQixNQUFBO1lBQUF3MkIsTUFBQSxJQUVBemEsVUFBQS9iLElBQUF5cUIsT0FBQSxLQUFBNkwsU0FBQSxJQUFBRSxNQUFBLFFBQ0E7Z0JBQ0FELFdBQUExSSxJQUFBNEksV0FBQUQsT0FBQTtnQkFDQSxJQUFBRCxXQUFBO29CQUNBLFVBQUFGOztnQkFFQUMsaUJBQUEsSUFBQUM7O1lBRUEsT0FBQXhhOztRQUdBaGpCLE9BQUFDLFVBQUFvNEI7O0l2RGlyTE1zRixLQUNBLFNBQVUzOUIsUUFBUUMsU0FBU0M7UXdEcnRMakM7UUFFQSxJQUFBNEssUUFBQTVLLG9CQUFBO1FBRUFGLE9BQUFDLFVBQ0E2SyxNQUFBa3FCLHlCQUdBLFNBQUFpSDtZQUNBO2dCQUNBMkIsT0FBQSxTQUFBQSxNQUFBOXVCLE1BQUF0TSxPQUFBcTdCLFNBQUFDLE1BQUFDLFFBQUFDO29CQUNBLElBQUFDO29CQUNBQSxPQUFBanJCLEtBQUFsRSxPQUFBLE1BQUFzc0IsbUJBQUE1NEI7b0JBRUEsSUFBQXNJLE1BQUFvcEIsU0FBQTJKLFVBQUE7d0JBQ0FJLE9BQUFqckIsS0FBQSxpQkFBQWlXLEtBQUE0VSxTQUFBSzs7b0JBR0EsSUFBQXB6QixNQUFBbXBCLFNBQUE2SixPQUFBO3dCQUNBRyxPQUFBanJCLEtBQUEsVUFBQThxQjs7b0JBR0EsSUFBQWh6QixNQUFBbXBCLFNBQUE4SixTQUFBO3dCQUNBRSxPQUFBanJCLEtBQUEsWUFBQStxQjs7b0JBR0EsSUFBQUMsV0FBQTt3QkFDQUMsT0FBQWpyQixLQUFBOztvQkFHQWxSLFNBQUFtOEIsZ0JBQUFyakIsS0FBQTs7Z0JBR0F5ZixNQUFBLFNBQUFBLEtBQUF2ckI7b0JBQ0EsSUFBQXlPLFFBQUF6YixTQUFBbThCLE9BQUExZ0IsTUFBQSxJQUFBNGdCLE9BQUEsZUFBMERydkIsT0FBQTtvQkFDMUQsT0FBQXlPLFFBQUE2Z0IsbUJBQUE3Z0IsTUFBQTs7Z0JBR0FqTyxRQUFBLFNBQUFBLE9BQUFSO29CQUNBMUgsS0FBQXcyQixNQUFBOXVCLE1BQUEsSUFBQW1hLEtBQUFDLFFBQUE7OztjQU1BLFNBQUFpVTtZQUNBO2dCQUNBUyxPQUFBLFNBQUFBO2dCQUNBdkQsTUFBQSxTQUFBQTtvQkFBNkI7O2dCQUM3Qi9xQixRQUFBLFNBQUFBOzs7O0l4RCt0TE0rdUIsS0FDQSxTQUFVcitCLFFBQVFDLFNBQVNDO1F5RGp4TGpDO1FBRUEsSUFBQTRLLFFBQUE1SyxvQkFBQTtRQUVBLFNBQUF5MUI7WUFDQXZ1QixLQUFBazNCOztRQVdBM0ksbUJBQUFweUIsVUFBQWc3QixNQUFBLFNBQUFBLElBQUFwSSxXQUFBQztZQUNBaHZCLEtBQUFrM0IsU0FBQXRyQjtnQkFDQW1qQjtnQkFDQUM7O1lBRUEsT0FBQWh2QixLQUFBazNCLFNBQUF4N0IsU0FBQTs7UUFRQTZ5QixtQkFBQXB5QixVQUFBaTdCLFFBQUEsU0FBQUEsTUFBQXY1QjtZQUNBLElBQUFtQyxLQUFBazNCLFNBQUFyNUIsS0FBQTtnQkFDQW1DLEtBQUFrM0IsU0FBQXI1QixNQUFBOzs7UUFZQTB3QixtQkFBQXB5QixVQUFBb1MsVUFBQSxTQUFBQSxRQUFBaEI7WUFDQTdKLE1BQUE2SyxRQUFBdk8sS0FBQWszQixVQUFBLFNBQUFHLGVBQUFDO2dCQUNBLElBQUFBLE1BQUE7b0JBQ0EvcEIsR0FBQStwQjs7OztRQUtBMStCLE9BQUFDLFVBQUEwMUI7O0l6RHd4TE1nSixLQUNBLFNBQVUzK0IsUUFBUUMsU0FBU0M7UTBENTBMakM7UUFFQSxJQUFBNEssUUFBQTVLLG9CQUFBO1FBQ0EsSUFBQTArQixnQkFBQTErQixvQkFBQTtRQUNBLElBQUFvekIsV0FBQXB6QixvQkFBQTtRQUNBLElBQUEweUIsV0FBQTF5QixvQkFBQTtRQUNBLElBQUEyK0IsZ0JBQUEzK0Isb0JBQUE7UUFDQSxJQUFBNCtCLGNBQUE1K0Isb0JBQUE7UUFLQSxTQUFBNitCLDZCQUFBL1M7WUFDQSxJQUFBQSxPQUFBME8sYUFBQTtnQkFDQTFPLE9BQUEwTyxZQUFBc0U7OztRQVVBaC9CLE9BQUFDLFVBQUEsU0FBQTIxQixnQkFBQTVKO1lBQ0ErUyw2QkFBQS9TO1lBR0EsSUFBQUEsT0FBQWlULFlBQUFKLGNBQUE3UyxPQUFBRyxNQUFBO2dCQUNBSCxPQUFBRyxNQUFBMlMsWUFBQTlTLE9BQUFpVCxTQUFBalQsT0FBQUc7O1lBSUFILE9BQUFJLFVBQUFKLE9BQUFJO1lBR0FKLE9BQUEzaUIsT0FBQXUxQixjQUNBNVMsT0FBQTNpQixNQUNBMmlCLE9BQUFJLFNBQ0FKLE9BQUFnTDtZQUlBaEwsT0FBQUksVUFBQXRoQixNQUFBcW9CLE1BQ0FuSCxPQUFBSSxRQUFBcUwsY0FDQXpMLE9BQUFJLFFBQUFKLE9BQUFFLGVBQ0FGLE9BQUFJO1lBR0F0aEIsTUFBQTZLLFVBQ0EsNkRBQ0EsU0FBQXVwQixrQkFBQWhUO3VCQUNBRixPQUFBSSxRQUFBRjs7WUFJQSxJQUFBNEssVUFBQTlLLE9BQUE4SyxXQUFBbEUsU0FBQWtFO1lBRUEsT0FBQUEsUUFBQTlLLFFBQUEzYSxLQUFBLFNBQUE4dEIsb0JBQUFqaUI7Z0JBQ0E2aEIsNkJBQUEvUztnQkFHQTlPLFNBQUE3VCxPQUFBdTFCLGNBQ0ExaEIsU0FBQTdULE1BQ0E2VCxTQUFBa1AsU0FDQUosT0FBQWtMO2dCQUdBLE9BQUFoYTtlQUNHLFNBQUFraUIsbUJBQUFDO2dCQUNILEtBQUEvTCxTQUFBK0wsU0FBQTtvQkFDQU4sNkJBQUEvUztvQkFHQSxJQUFBcVQsaUJBQUFuaUIsVUFBQTt3QkFDQW1pQixPQUFBbmlCLFNBQUE3VCxPQUFBdTFCLGNBQ0FTLE9BQUFuaUIsU0FBQTdULE1BQ0FnMkIsT0FBQW5pQixTQUFBa1AsU0FDQUosT0FBQWtMOzs7Z0JBS0EsT0FBQXJrQixRQUFBRSxPQUFBc3NCOzs7O0kxRHExTE1DLEtBQ0EsU0FBVXQvQixRQUFRQyxTQUFTQztRMkR6NkxqQztRQUVBLElBQUE0SyxRQUFBNUssb0JBQUE7UUFVQUYsT0FBQUMsVUFBQSxTQUFBMitCLGNBQUF2MUIsTUFBQStpQixTQUFBbVQ7WUFFQXowQixNQUFBNkssUUFBQTRwQixLQUFBLFNBQUFwWCxVQUFBeFQ7Z0JBQ0F0TCxPQUFBc0wsR0FBQXRMLE1BQUEraUI7O1lBR0EsT0FBQS9pQjs7O0kzRGk3TE1tMkIsS0FDQSxTQUFVeC9CLFFBQVFDO1E0RHA4THhCO1FBRUFELE9BQUFDLFVBQUEsU0FBQXF6QixTQUFBOXdCO1lBQ0EsVUFBQUEsZUFBQWk5Qjs7O0k1RDQ4TE1DLEtBQ0EsU0FBVTEvQixRQUFRQztRNkRoOUx4QjtRQVFBRCxPQUFBQyxVQUFBLFNBQUE0K0IsY0FBQTFTO1lBSUEsdUNBQUFnUSxLQUFBaFE7OztJN0R3OUxNd1QsS0FDQSxTQUFVMy9CLFFBQVFDO1E4RHIrTHhCO1FBU0FELE9BQUFDLFVBQUEsU0FBQTYrQixZQUFBRyxTQUFBVztZQUNBLE9BQUFBLGNBQ0FYLFFBQUFsSyxRQUFBLG9CQUFBNkssWUFBQTdLLFFBQUEsY0FDQWtLOzs7STlENitMTVksS0FDQSxTQUFVNy9CLFFBQVFDO1ErRDEvTHhCO1FBUUEsU0FBQW16QixPQUFBdnNCO1lBQ0FPLEtBQUFQOztRQUdBdXNCLE9BQUE3dkIsVUFBQWlULFdBQUEsU0FBQUE7WUFDQSxtQkFBQXBQLEtBQUFQLFVBQUEsT0FBQU8sS0FBQVAsVUFBQTs7UUFHQXVzQixPQUFBN3ZCLFVBQUFrOEIsYUFBQTtRQUVBei9CLE9BQUFDLFVBQUFtekI7O0kvRGlnTU0wTSxLQUNBLFNBQVU5L0IsUUFBUUMsU0FBU0M7UWdFcGhNakM7UUFFQSxJQUFBa3pCLFNBQUFsekIsb0JBQUE7UUFRQSxTQUFBbXpCLFlBQUEwTTtZQUNBLFdBQUFBLGFBQUE7Z0JBQ0EsVUFBQTk3QixVQUFBOztZQUdBLElBQUE4VjtZQUNBM1MsS0FBQStKLFVBQUEsSUFBQTBCLFFBQUEsU0FBQW10QixnQkFBQWx0QjtnQkFDQWlILGlCQUFBakg7O1lBR0EsSUFBQW10QixRQUFBNzRCO1lBQ0EyNEIsU0FBQSxTQUFBbG9CLE9BQUFoUjtnQkFDQSxJQUFBbzVCLE1BQUFaLFFBQUE7b0JBRUE7O2dCQUdBWSxNQUFBWixTQUFBLElBQUFqTSxPQUFBdnNCO2dCQUNBa1QsZUFBQWttQixNQUFBWjs7O1FBT0FoTSxZQUFBOXZCLFVBQUF5N0IsbUJBQUEsU0FBQUE7WUFDQSxJQUFBNTNCLEtBQUFpNEIsUUFBQTtnQkFDQSxNQUFBajRCLEtBQUFpNEI7OztRQVFBaE0sWUFBQW5rQixTQUFBLFNBQUFBO1lBQ0EsSUFBQTJJO1lBQ0EsSUFBQW9vQixRQUFBLElBQUE1TSxZQUFBLFNBQUEwTSxTQUFBcjhCO2dCQUNBbVUsU0FBQW5VOztZQUVBO2dCQUNBdThCO2dCQUNBcG9COzs7UUFJQTdYLE9BQUFDLFVBQUFvekI7O0loRTJoTU02TSxLQUNBLFNBQVVsZ0MsUUFBUUM7UWlFcGxNeEI7UUFzQkFELE9BQUFDLFVBQUEsU0FBQXV6QixPQUFBMk07WUFDQSxnQkFBQTVULEtBQUF0aUI7Z0JBQ0EsT0FBQWsyQixTQUFBMXlCLE1BQUEsTUFBQXhEIiwiZmlsZSI6InVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3ZWJwYWNrSnNvbnAoWzFdLHtcblxuLyoqKi8gMDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNyk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblx0XG5cdHZhciBfQXBwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzUpO1xuXHRcblx0dmFyIF9BcHAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQXBwKTtcblx0XG5cdHZhciBfcmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5Nyk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYSA9IF9fd2VicGFja19yZXF1aXJlX18oNzM4KTtcblx0XG5cdHZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3JlZHVjZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NCk7XG5cdFxuXHR2YXIgX3NhZ2FzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzEpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdC8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5cdC8qXG5cdCBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICovXG5cdFxuXHR2YXIgc2FnYU1pZGRsZXdhcmUgPSAoMCwgX3JlZHV4U2FnYTIuZGVmYXVsdCkoKTtcblx0XG5cdC8vIGRldiB0b29scyBtaWRkbGV3YXJlXG5cdHZhciByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblx0XG5cdHZhciBzdG9yZSA9IHZvaWQgMDtcblx0aWYgKHJlZHV4RGV2VG9vbHMpIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5jb21wb3NlKSgoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG5cdH0gZWxzZSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSkpO1xuXHR9XG5cdFxuXHRzYWdhTWlkZGxld2FyZS5ydW4oX3NhZ2FzLndhdGNoZXJTYWdhKTtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgIF9yZWFjdERvbTIuZGVmYXVsdC5yZW5kZXIoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG5cdCAgICAgICAgeyBzdG9yZTogc3RvcmUgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfQXBwMi5kZWZhdWx0LCBudWxsKVxuXHQgICAgKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIikpO1xuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNik7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cdFxuXHRmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH0gLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0dmFyIElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIElzUmVzdHJpY3RlZChfcmVmKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYuXyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZi5vbkNoYW5nZUlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJsYWJlbFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBcImlzX3Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZTogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICAgICAgfSksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XG5cdCAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuXHQgICAgICAgICAgICAgICAgICAgIF9faHRtbDogaXNfcmVzdHJpY3RlZCA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpIDogXyhcInVzZXJfYWNjZXNzX3VucmVzdHJpY3RlZFwiKVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBcInJlc3RyaWN0ZWRJbmZvXCIsXG5cdCAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogXyhcInJlc3RyaWN0ZWRfaW5mb1wiKSB9XG5cdCAgICAgICAgfSkgOiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBQcm9qZWN0ID0gZnVuY3Rpb24gUHJvamVjdChfcmVmMikge1xuXHQgICAgdmFyIF8gPSBfcmVmMi5fLFxuXHQgICAgICAgIHByb2plY3QgPSBfcmVmMi5wcm9qZWN0LFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcmVmMi51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmMi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjIub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgLy8gTk9URTogdGhlIGNoZWNrZWQgdmFsdWUgaXMgc2V0IHRvIHRydWUgaWYgaXNfcmVzdHJpY3RlZCBpcyBmYWxzZS4gVGhpcyBpcyBzbyB0aGF0IHRoZSBsaXN0IG9mXG5cdCAgICAvLyBwcm9qZWN0cyBsb29rcyBsaWtlIGFsbCBwcm9qZWN0cyBhcmUgc2VsZWN0ZWQgd2hlbiByZXN0cmljdGlvbnMgYXJlIG5vdCBpbiBmb3JjZS5cblx0ICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cblx0ICAgIHZhciBjaGVja2VkID0gIWlzX3Jlc3RyaWN0ZWQgfHwgdXNlcl9wcm9qZWN0cyAmJiAoMCwgX3V0aWxzLmluQXJyYXkpKHByb2plY3QuaWQsIHVzZXJfcHJvamVjdHMpLFxuXHQgICAgICAgIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG5cdCAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcblx0ICAgICAgICB0ckNsYXNzTmFtZSA9IGRpc2FibGVkICsgcHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwidHJcIixcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IHRyQ2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZCxcblx0ICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICB7IGNsYXNzTmFtZTogaWRDbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgcHJvamVjdC5pZFxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFNlbGVjdEFsbCA9IGZ1bmN0aW9uIFNlbGVjdEFsbChfcmVmMykge1xuXHQgICAgdmFyIF8gPSBfcmVmMy5fLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWYzLnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmMy5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYzLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgdmFyIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZSxcblx0ICAgICAgICBjbGFzc05hbWUgPSBcInNlbGVjdEFsbFByb2plY3RzXCIgKyAoaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcIiBkaXNhYmxlZFwiKTtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBpc19yZXN0cmljdGVkID8gdW5kZWZpbmVkIDogXCJkaXNhYmxlZFwiIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwiYnV0dG9uXCIsXG5cdCAgICAgICAgICAgIHsgb25DbGljazogb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLCBkaXNhYmxlZDogZGlzYWJsZWQsIGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA/IF8oXCJjaGVja19hbGxfcHJvamVjdHNcIikgOiBfKFwidW5jaGVja19hbGxfcHJvamVjdHNcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEVycm9yID0gZnVuY3Rpb24gRXJyb3IoX3JlZjQpIHtcblx0ICAgIHZhciBfID0gX3JlZjQuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY0LmVycm9yO1xuXHRcblx0ICAgIHJldHVybiBlcnJvciA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IFwiZXJyb3JcIiB9LFxuXHQgICAgICAgIF8oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZVxuXHQgICAgKSA6IG51bGw7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdHMgPSBmdW5jdGlvbiBQcm9qZWN0cyhfcmVmNSkge1xuXHQgICAgdmFyIF8gPSBfcmVmNS5fLFxuXHQgICAgICAgIGVycm9yID0gX3JlZjUuZXJyb3IsXG5cdCAgICAgICAgYWxsX3Byb2plY3RzID0gX3JlZjUuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcmVmNS51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmNS5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWY1LnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZCA9IF9yZWY1Lm9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCA9IF9yZWY1Lm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCA9IF9yZWY1Lm9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkO1xuXHRcblx0ICAgIHZhciBjbGFzc05hbWUgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIjtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEVycm9yLCB7IF86IF8sIGVycm9yOiBlcnJvciB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChJc1Jlc3RyaWN0ZWQsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ6IG9uQ2hhbmdlSXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsLCB7XG5cdCAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRhYmxlXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0aGVhZFwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgIFwidHJcIixcblx0ICAgICAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcImFjY2Vzc1wiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF9pZFwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF90aXRsZVwiKVxuXHQgICAgICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRib2R5XCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9qZWN0LCB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBBcHAgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuXHQgICAgX2luaGVyaXRzKEFwcCwgX1JlYWN0JENvbXBvbmVudCk7XG5cdFxuXHQgICAgZnVuY3Rpb24gQXBwKHByb3BzKSB7XG5cdCAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFwcCk7XG5cdFxuXHQgICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChBcHAuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihBcHApKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cdFxuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMuXyA9IF90aGlzLl8uYmluZChfdGhpcyk7XG5cdCAgICAgICAgcmV0dXJuIF90aGlzO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFRyYW5zbGF0aW9uIGhhbmRsaW5nXG5cdFxuXHRcblx0ICAgIF9jcmVhdGVDbGFzcyhBcHAsIFt7XG5cdCAgICAgICAga2V5OiBcIl9cIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gXyhzKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnN0cmluZ3MgJiYgdGhpcy5wcm9wcy5zdHJpbmdzW3NdO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlSXNSZXN0cmljdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZUlzUmVzdHJpY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJc1Jlc3RyaWN0ZWQoZS50YXJnZXQuY2hlY2tlZCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0ZWRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcblx0ICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihpZCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHQgICAgICAgICAgICB2YXIgdXNlcklkID0gKDAsIF91dGlscy5kYXRhRnJvbUVsZW1lbnQpKFwidXNlci10by1yZXN0cmljdFwiKS5pZDtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHVzZXJJZDogdXNlcklkIH0pO1xuXHRcblx0ICAgICAgICAgICAgdmFyIHN0cmluZ3MgPSAoMCwgX3V0aWxzLmRhdGFGcm9tRWxlbWVudCkoXCJ1c2VyLXByb2plY3RzLXRleHRcIik7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBzdHJpbmdzOiBzdHJpbmdzIH0pO1xuXHRcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJyZW5kZXJcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHQgICAgICAgICAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcyxcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcHJvcHMuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9wcm9wcy5zZWxlY3RBbGwsXG5cdCAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfcHJvcHMuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9wcm9wcy51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgZXJyb3IgPSBfcHJvcHMuZXJyb3I7XG5cdFxuXHQgICAgICAgICAgICByZXR1cm4gYWxsX3Byb2plY3RzID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdHMsIHtcblx0ICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcblx0ICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICgwLCBfdXRpbHMuXykoXCJsb2FkaW5nXCIpXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXHQgICAgfV0pO1xuXHRcblx0ICAgIHJldHVybiBBcHA7XG5cdH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cdFxuXHR2YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdCAgICB2YXIgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gc3RhdGUuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBzdGF0ZS5zZWxlY3RBbGwsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgc3RyaW5ncyA9IHN0YXRlLnN0cmluZ3M7XG5cdFxuXHQgICAgcmV0dXJuIHsgZmV0Y2hpbmc6IGZldGNoaW5nLCBlcnJvcjogZXJyb3IsIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGw6IHNlbGVjdEFsbCwgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cywgc3RyaW5nczogc3RyaW5ncyB9O1xuXHR9O1xuXHRcblx0dmFyIG1hcERpc3BhdGNoVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHQgICAgcmV0dXJuIHsgb25GZXRjaFVzZXJQcm9qZWN0czogZnVuY3Rpb24gb25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQ6IHVzZXJJZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sIHNldFN0b3JlOiBmdW5jdGlvbiBzZXRTdG9yZShkYXRhKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSwgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBmdW5jdGlvbiBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24ocHJvamVjdElkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTixcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkOiBwcm9qZWN0SWQgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LCBvblVwZGF0ZUlzUmVzdHJpY3RlZDogZnVuY3Rpb24gb25VcGRhdGVJc1Jlc3RyaWN0ZWQoaXNfcmVzdHJpY3RlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sIG9uVXBkYXRlU2VsZWN0QWxsOiBmdW5jdGlvbiBvblVwZGF0ZVNlbGVjdEFsbCgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KTtcblx0ICAgICAgICB9IH07XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuaW5BcnJheSA9IGV4cG9ydHMuZW5kcG9pbnRzID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9zdG9yZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzA0KTtcblx0XG5cdHZhciBfc3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RvcmUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBlbmRwb2ludHMgPSBleHBvcnRzLmVuZHBvaW50cyA9IHtcblx0ICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBmdW5jdGlvbiB1c2VyX3Byb2plY3RzX2FjY2VzcyhpZCkge1xuXHQgICAgICAgIHJldHVybiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgaWQgKyBcIi8/Zm9ybWF0PWpzb25cIjtcblx0ICAgIH1cblx0fTsgLypcblx0ICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgKi9cblx0XG5cdHZhciBpbkFycmF5ID0gZXhwb3J0cy5pbkFycmF5ID0gZnVuY3Rpb24gaW5BcnJheShvYmosIGFycikge1xuXHQgICAgcmV0dXJuIGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblx0fTtcblx0XG5cdHZhciBkYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGRhdGFGcm9tRWxlbWVudChlbGVtZW50TmFtZSkge1xuXHQgICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0Ly8gYWN0aW9uIHR5cGVzXG5cdHZhciAvL1xuXHRTRVRfU1RPUkUgPSBleHBvcnRzLlNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG5cdFxuXHQvL1xuXHRBUElfR0VUX0lOSVQgPSBleHBvcnRzLkFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG5cdCAgICBBUElfR0VUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfR0VUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRBUElfUFVUX0lOSVQgPSBleHBvcnRzLkFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG5cdCAgICBBUElfUFVUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfUFVUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBleHBvcnRzLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG5cdCAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IGV4cG9ydHMuVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG5cdCAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IGV4cG9ydHMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWxheTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZGV0YWNoO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTEpO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cdFxuXHR2YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Myk7XG5cdFxuXHR2YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuXHRleHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuXHRleHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0dmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcblx0dmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cdFxuXHRmdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHQgICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG5cdCAgICB9XG5cdCAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuXHQgICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgfVxuXHRcblx0ICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG5cdCAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcblx0ICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuXHQgICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXHRcblx0XG5cdCAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXHRcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG5cdCAgfVxuXHRcblx0ICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHRhc2s7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmNoZWNrID0gY2hlY2s7XG5cdGV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuXHRleHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcblx0ZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuXHRleHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcblx0ZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuXHRleHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5cdGV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5cdGV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG5cdHZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuXHQgIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcblx0fTtcblx0XG5cdHZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xuXHR2YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcblx0dmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG5cdHZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG5cdHZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xuXHR2YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcblx0dmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHY7XG5cdCAgfTtcblx0fTtcblx0dmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcblx0dmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcblx0dmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cdHZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG5cdCAgcmV0dXJuIHY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuXHQgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcblx0ICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdH1cblx0XG5cdHZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG5cdCAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9LFxuXHQgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcblx0ICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG5cdCAgfSxcblx0ICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuXHQgIH0sXG5cdCAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG5cdCAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG5cdCAgfSxcblx0ICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcblx0ICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcblx0ICB9LFxuXHQgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG5cdCAgfSxcblx0ICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuXHQgIH0sXG5cdCAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG5cdCAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuXHQgIH0sXG5cdCAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuXHQgICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcblx0ICB9LFxuXHQgIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuXHQgICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuXHQgIH0sXG5cdCAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcblx0ICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuXHQgIH0sXG5cdCAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG5cdCAgfSxcblx0ICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG5cdCAgfSxcblx0ICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuXHQgICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcblx0ICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuXHQgICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG5cdCAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG5cdCAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblx0ICBpZiAoaW5kZXggPj0gMCkge1xuXHQgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG5cdCAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcblx0ICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuXHQgICAgICAgIGFycltpXSA9IG9ialtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycjtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBkZWZlcnJlZCgpIHtcblx0ICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcblx0ICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG5cdCAgfSk7XG5cdCAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuXHQgIHJldHVybiBkZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcblx0ICB2YXIgYXJyID0gW107XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHQgICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG5cdCAgfVxuXHQgIHJldHVybiBhcnI7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlbGF5KG1zKSB7XG5cdCAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblx0XG5cdCAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdCAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcblx0ICAgIH0sIG1zKTtcblx0ICB9KTtcblx0XG5cdCAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuXHQgIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgIHJldHVybiBydW5uaW5nO1xuXHQgIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQ7XG5cdCAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgcmV0dXJuIF9lcnJvcjtcblx0ICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcblx0ICAgIHJldHVybiBydW5uaW5nID0gYjtcblx0ICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG5cdCAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcblx0ICAgIHJldHVybiBfZXJyb3IgPSBlO1xuXHQgIH0sIF9yZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGF1dG9JbmMoKSB7XG5cdCAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gKytzZWVkO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cdFxuXHR2YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuXHQgIHRocm93IGVycjtcblx0fTtcblx0dmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG5cdH07XG5cdGZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG5cdCAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblx0XG5cdCAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3I7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gaXRlcmF0b3I7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG5cdCAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuXHQgKiovXG5cdGZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuXHQgIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdFxuXHQgIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG5cdCAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcblx0ICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuXHQgIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG5cdH07XG5cdFxuXHR2YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG5cdCAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcblx0fTtcblx0XG5cdHZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG5cdCAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcblx0fTtcblx0XG5cdHZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBoaXN0b3J5ID0gW107XG5cdCAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcblx0ICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcblx0ICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcblx0ICAgICAgfSxcblx0ICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuXHQgICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcblx0ICAgICAgfSxcblx0ICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuXHQgICAgICB9LFxuXHQgICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuXHQgICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9O1xuXHR9O1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0ZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0ICB9XG5cdH07XG5cdHZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBtYXRjaGVycyA9IHtcblx0ICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuXHQgIH0sXG5cdCAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuXHQgICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcblx0ICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcblx0ICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuXHQgICAgfTtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcblx0ICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcblx0fVxuXHRcblx0LyoqXG5cdCAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3Ncblx0ICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcblx0ICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuXHQgIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcblx0ICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuXHQgIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG5cdCAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cdFxuXHQgIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuXHQgIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcblx0ICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG5cdCAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuXHQgIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuXHQqKi9cblx0ZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuXHQgIHZhciB0YXNrcyA9IFtdLFxuXHQgICAgICByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuXHQgIGFkZFRhc2sobWFpblRhc2spO1xuXHRcblx0ICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcblx0ICAgIGNhbmNlbEFsbCgpO1xuXHQgICAgY2IoZXJyLCB0cnVlKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuXHQgICAgdGFza3MucHVzaCh0YXNrKTtcblx0ICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG5cdCAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICBhYm9ydChyZXMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIGNiKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICB0LmNhbmNlbCgpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrcyA9IFtdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGFkZFRhc2s6IGFkZFRhc2ssXG5cdCAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcblx0ICAgIGFib3J0OiBhYm9ydCxcblx0ICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzO1xuXHQgICAgfSxcblx0ICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgICAgcmV0dXJuIHQubmFtZTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcblx0ICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgZm4gPSBfcmVmLmZuLFxuXHQgICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuXHQgICAgcmV0dXJuIGZuO1xuXHQgIH1cblx0XG5cdCAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgZXJyb3IgPSB2b2lkIDA7XG5cdCAgdHJ5IHtcblx0ICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgZXJyb3IgPSBlcnI7XG5cdCAgfVxuXHRcblx0ICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3Jcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuXHQgIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IGVycm9yO1xuXHQgIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYyA9IHZvaWQgMDtcblx0ICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG5cdCAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgIGlmICghcGMpIHtcblx0ICAgICAgICBwYyA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIGVmZjtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSgpKTtcblx0fVxuXHRcblx0dmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuXHQgIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcblx0ICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfTtcblx0ICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcblx0ICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuXHQgIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXHRcblx0ICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuXHQgIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0ICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG5cdCAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG5cdCAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cdFxuXHQgICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuXHQgICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuXHQgICAgfVxuXHRcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcblx0ICB9O1xuXHQgIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG5cdCAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcblx0ICAvKipcblx0ICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG5cdCAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuXHQgICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuXHQgICoqL1xuXHQgIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgIC8qKlxuXHQgICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuXHQgICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG5cdCAgKiovXG5cdCAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG5cdCAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuXHQgIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cdFxuXHQgIC8qKlxuXHQgICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcblx0ICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG5cdCAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cblx0ICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuXHQgICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG5cdCAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgLyoqXG5cdCAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG5cdCAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcblx0ICAgICoqL1xuXHQgICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuXHQgICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcblx0ICAgICAgKiovXG5cdCAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuXHQgICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cblx0ICAqKi9cblx0ICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cdFxuXHQgIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcblx0ICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblx0XG5cdCAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuXHQgIG5leHQoKTtcblx0XG5cdCAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG5cdCAgcmV0dXJuIHRhc2s7XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuXHQgICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG5cdCAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG5cdCAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3Jvbmdcblx0ICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuXHQgICAgfVxuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuXHQgICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcblx0ICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG5cdCAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbmV4dC5jYW5jZWwoKTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcblx0ICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcblx0ICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcblx0ICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0ICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG5cdCAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG5cdCAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG5cdCAgICBpZiAoIWlzRXJyKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcblx0ICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcblx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGFzay5jb250KSB7XG5cdCAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcblx0ICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcblx0ICAgIH1cblx0ICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG5cdCAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuXHQgICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcblx0ICAgIH0pO1xuXHQgICAgdGFzay5qb2luZXJzID0gbnVsbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG5cdCAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHQgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG5cdCAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG5cdCAgICAqKi9cblx0ICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXHRcblx0ICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG5cdCAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHQgICAgICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG5cdCAgICAgIH1cblx0ICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICB9XG5cdCAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcblx0ICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG5cdCAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuXHQgICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG5cdCAgICAgICoqL1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyKTtcblx0ICAgICAgfVxuXHQgICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdFxuXHQgICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuXHQgICAgfTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuXHQgICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cblx0ICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cblx0ICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuXHQgICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG5cdCAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuXHQgICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG5cdCAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG5cdCAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcblx0ICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3Rcblx0ICAgICoqL1xuXHQgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cdCAgICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3Rcblx0ICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblx0XG5cdCAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcblx0ICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcblx0ICAgICk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuXHQgICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuXHQgICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuXHQgICAgICB9O1xuXHQgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG5cdCAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuXHQgICAgfVxuXHQgICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcblx0ICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG5cdCAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG5cdCAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblx0XG5cdCAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuXHQgICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcblx0ICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuXHQgICAgfTtcblx0ICAgIHRyeSB7XG5cdCAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcblx0ICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG5cdCAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG5cdCAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcblx0ICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG5cdCAgICAqKi9cblx0ICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG5cdCAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG5cdCAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcblx0ICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNC5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblx0XG5cdCAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY1LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXHRcblx0ICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuXHQgICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cdFxuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuXHQgICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuXHQgICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG5cdCAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY2LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuXHQgICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cdFxuXHQgICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuXHQgICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXHRcblx0ICAgICAgaWYgKGRldGFjaGVkKSB7XG5cdCAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IGZpbmFsbHkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcblx0ICAgIH1cblx0ICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuXHQgICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcblx0ICAgICAgfTtcblx0ICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuXHQgICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG5cdCAgICB9XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcblx0ICAgIH1cblx0ICAgIGNiKCk7XG5cdCAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0XG5cdCAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciByZXN1bHRzID0ge307XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcblx0ICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG5cdCAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgdmFyIF9yZXNwb25zZTtcblx0XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuXHQgICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuXHQgICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG5cdCAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcblx0ICAgICAgY2Ioc3RhdGUpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcblx0ICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcblx0ICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcblx0ICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuXHQgICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG5cdCAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG5cdCAgICBjaGFubmVsLmZsdXNoKGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcblx0ICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgY2IoKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG5cdCAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblx0XG5cdCAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuXHQgICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuXHQgICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcblx0ICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG5cdCAgICAgIH1cblx0ICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcblx0ICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG5cdCAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuXHQgICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcblx0ICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG5cdCAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuXHQgICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc2FwID0gYXNhcDtcblx0ZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHR2YXIgcXVldWUgPSBbXTtcblx0LyoqXG5cdCAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuXHQgIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3Rcblx0ICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuXHQgIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG5cdCAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuXHQqKi9cblx0dmFyIHNlbWFwaG9yZSA9IDA7XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG5cdCAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG5cdCAgc3RhdGUpLlxuXHQqKi9cblx0ZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG5cdCAgdHJ5IHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIHRhc2soKTtcblx0ICB9IGZpbmFsbHkge1xuXHQgICAgcmVsZWFzZSgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG5cdCoqL1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICBxdWV1ZS5wdXNoKHRhc2spO1xuXHRcblx0ICBpZiAoIXNlbWFwaG9yZSkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgZmx1c2goKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG5cdCAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuXHQqKi9cblx0ZnVuY3Rpb24gc3VzcGVuZCgpIHtcblx0ICBzZW1hcGhvcmUrKztcblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG5cdCAgc2VtYXBob3JlLS07XG5cdH1cblx0XG5cdC8qKlxuXHQgIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICByZWxlYXNlKCk7XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwO1xuXHQgIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgZXhlYyh0YXNrKTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnRha2UgPSB0YWtlO1xuXHRleHBvcnRzLnB1dCA9IHB1dDtcblx0ZXhwb3J0cy5hbGwgPSBhbGw7XG5cdGV4cG9ydHMucmFjZSA9IHJhY2U7XG5cdGV4cG9ydHMuY2FsbCA9IGNhbGw7XG5cdGV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblx0ZXhwb3J0cy5jcHMgPSBjcHM7XG5cdGV4cG9ydHMuZm9yayA9IGZvcms7XG5cdGV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcblx0ZXhwb3J0cy5qb2luID0gam9pbjtcblx0ZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5cdGV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuXHRleHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuXHRleHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHRleHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuXHRleHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG5cdHZhciBUQUtFID0gJ1RBS0UnO1xuXHR2YXIgUFVUID0gJ1BVVCc7XG5cdHZhciBBTEwgPSAnQUxMJztcblx0dmFyIFJBQ0UgPSAnUkFDRSc7XG5cdHZhciBDQUxMID0gJ0NBTEwnO1xuXHR2YXIgQ1BTID0gJ0NQUyc7XG5cdHZhciBGT1JLID0gJ0ZPUksnO1xuXHR2YXIgSk9JTiA9ICdKT0lOJztcblx0dmFyIENBTkNFTCA9ICdDQU5DRUwnO1xuXHR2YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG5cdHZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG5cdHZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcblx0dmFyIEZMVVNIID0gJ0ZMVVNIJztcblx0dmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcblx0dmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblx0XG5cdHZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cdFxuXHR2YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcblx0fTtcblx0XG5cdHZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG5cdCAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gdGFrZSgpIHtcblx0ICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xuXHR9XG5cdFxuXHR0YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHR2YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXHRcblx0ZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgYWN0aW9uID0gY2hhbm5lbDtcblx0ICAgIGNoYW5uZWwgPSBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcblx0fVxuXHRcblx0cHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblx0XG5cdCAgdmFyIGNvbnRleHQgPSBudWxsO1xuXHQgIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG5cdCAgICB2YXIgX2ZuID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuWzBdO1xuXHQgICAgZm4gPSBfZm5bMV07XG5cdCAgfSBlbHNlIGlmIChmbi5mbikge1xuXHQgICAgdmFyIF9mbjIgPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG5cdCAgICBmbiA9IF9mbjIuZm47XG5cdCAgfVxuXHQgIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuXHQgICAgZm4gPSBjb250ZXh0W2ZuXTtcblx0ICB9XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHRcblx0ICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FsbChmbikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuXHQgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3BzKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHQgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmb3JrKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHQgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNwYXduKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuXHQgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGpvaW4oKSB7XG5cdCAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG5cdCAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBqb2luKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuXHQgICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gY2FuY2VsKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuXHQgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcblx0ICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG5cdCAgfVxuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcblx0KiovXG5cdGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcblx0ICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcblx0ICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuXHQgIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcblx0ICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuXHQgICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuXHQgICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHR2YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuXHQgICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcblx0ICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuXHQgIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuXHQgIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuXHQgIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG5cdCAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcblx0ICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcblx0ICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuXHQgIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG5cdCAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG5cdCAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG5cdCAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG5cdCAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG5cdCAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuXHQgIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuXHQgIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDUpO1xuXHRcblx0dmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblx0XG5cdHZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTApO1xuXHRcblx0dmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG5cdCAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG5cdH07XG5cdFxuXHR2YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG5cdHZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcblx0dmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXHRcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0ZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXHR2YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuICdjaGFubmVsJztcblx0ICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdCAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuXHQgICAgfSkpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXHRcblx0ICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG5cdCAgICAgIHFOZXh0ID0gcTA7XG5cdFxuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuXHQgICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG5cdCAgICAgIHJldHVybiBkb25lO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChlcnJvcikge1xuXHQgICAgICBxTmV4dCA9IHFFbmQ7XG5cdCAgICAgIHRocm93IGVycm9yO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblx0XG5cdCAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuXHQgICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG5cdCAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuXHQgICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblx0XG5cdCAgICAgIHFOZXh0ID0gcTtcblx0ICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG5cdCAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuXHQgIH0sIG5hbWUsIHRydWUpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0ZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcblx0ZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcblx0ZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5cdGV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHR2YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcblx0dmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcblx0ICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBlbWl0dGVyKCkge1xuXHQgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXHRcblx0ICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG5cdCAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuXHQgICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGFycltpXShpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0ICAgIGVtaXQ6IGVtaXRcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xuXHR2YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblx0XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2hhbm5lbCgpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cdFxuXHQgIHZhciBjbG9zZWQgPSBmYWxzZTtcblx0ICB2YXIgdGFrZXJzID0gW107XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXHRcblx0ICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcblx0ICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuXHQgICAgaWYgKGNsb3NlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuXHQgICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcblx0ICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHRha2UoY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihidWZmZXIudGFrZSgpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRha2Vycy5wdXNoKGNiKTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBmbHVzaChjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgaWYgKCFjbG9zZWQpIHtcblx0ICAgICAgY2xvc2VkID0gdHJ1ZTtcblx0ICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuXHQgICAgICAgIHRha2VycyA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICAgIGFycltpXShFTkQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBwdXQ6IHB1dCxcblx0ICAgIGZsdXNoOiBmbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZSxcblx0ICAgIGdldCBfX3Rha2Vyc19fKCkge1xuXHQgICAgICByZXR1cm4gdGFrZXJzO1xuXHQgICAgfSxcblx0ICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuXHQgICAgICByZXR1cm4gY2xvc2VkO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcblx0ICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblx0XG5cdCAgLyoqXG5cdCAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cblx0ICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuXHQgICoqL1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcblx0ICB9XG5cdFxuXHQgIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuXHQgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG5cdCAgICAgICAgdW5zdWJzY3JpYmUoKTtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLmNsb3NlKCk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG5cdCAgICAgIGNsb3NlKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjaGFuLnB1dChpbnB1dCk7XG5cdCAgfSk7XG5cdCAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgdW5zdWJzY3JpYmUoKTtcblx0ICB9XG5cdFxuXHQgIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IGNoYW4udGFrZSxcblx0ICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlXG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcblx0ICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG5cdCAgICAgICAgY2IoaW5wdXQpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG5cdCAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG5cdCAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4udGFrZShjYik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblx0XG5cdHZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG5cdHZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcblx0dmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcblx0dmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cdFxuXHR2YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXHRcblx0ZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcblx0ICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuXHQgIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG5cdCAgdmFyIGxlbmd0aCA9IDA7XG5cdCAgdmFyIHB1c2hJbmRleCA9IDA7XG5cdCAgdmFyIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG5cdCAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICBsZW5ndGgrKztcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgICBpZiAobGVuZ3RoICE9IDApIHtcblx0ICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcblx0ICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG5cdCAgICAgIGxlbmd0aC0tO1xuXHQgICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgIHJldHVybiBpdDtcblx0ICAgIH1cblx0ICB9O1xuXHRcblx0ICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHZhciBpdGVtcyA9IFtdO1xuXHQgICAgd2hpbGUgKGxlbmd0aCkge1xuXHQgICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlbXM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcblx0ICAgIH0sXG5cdCAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuXHQgICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcblx0ICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuXHQgICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcblx0ICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuXHQgICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXHRcblx0ICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXHRcblx0ICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcblx0ICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgLy8gRFJPUFxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBmbHVzaDogZmx1c2hcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcblx0ICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuXHQgICAgcmV0dXJuIHplcm9CdWZmZXI7XG5cdCAgfSxcblx0ICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG5cdCAgfSxcblx0ICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcblx0ICB9LFxuXHQgIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG5cdCAgfSxcblx0ICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDAsXG5cdCAgICAgIGFjdGlvbiA9IHZvaWQgMDtcblx0ICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuXHQgICAgcmV0dXJuIHRhc2sgPSB0O1xuXHQgIH07XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBjaGFubmVsID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG5cdCAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcblx0ICB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cdFxuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHQgIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9LFxuXHQgICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cdFxuXHRmdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG5cdCAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcblx0ICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0XG5cdCAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuXHQgICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG5cdCAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblx0XG5cdCAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcblx0ICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cdFxuXHQgICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcblx0ICAgICAgY29udGV4dDogY29udGV4dCxcblx0ICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuXHQgICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuXHQgICAgICBvbkVycm9yOiBvbkVycm9yXG5cdCAgICB9KTtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuXHQgICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcblx0ICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG5cdCAgfTtcblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VtO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnB1dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnJhY2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hcHBseTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jcHM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZvcms7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zcGF3bjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uam9pbjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2VsZWN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZsdXNoO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0ZXhwb3J0cy5yZWR1Y2VyID0gcmVkdWNlcjtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3B1bGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NSk7XG5cdFxuXHR2YXIgX3B1bGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHVsbCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzYpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdC8vIGluaXRpYWwgc3RhdGVcblx0dmFyIGluaXRpYWxTdGF0ZSA9IHtcblx0ICAgIHNlbGVjdEFsbDogdHJ1ZSxcblx0ICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgIGVycm9yOiBudWxsLFxuXHQgICAgdXNlcklkOiBudWxsLFxuXHQgICAgaXNfcmVzdHJpY3RlZDogZmFsc2UsXG5cdCAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgdXNlcl9wcm9qZWN0czogW10sXG5cdCAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuXHQgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVkdWNlcigpIHtcblx0ICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuXHQgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cdCAgICAgICAgY2FzZSBjLlNFVF9TVE9SRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBhY3Rpb24uZGF0YTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgZmV0Y2hpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX1NVQ0NFU1M6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfYWN0aW9uJGRhdGEgPSBhY3Rpb24uZGF0YSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyB8fCBbXSxcblx0ICAgICAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCB8fCBmYWxzZVxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9HRVRfRkFJTFVSRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfUFVUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzID0gYWN0aW9uLmRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IF91c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsXG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX1BVVF9GQUlMVVJFOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICB2YXIgbmV3U3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcblx0ICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGUuaXNfcmVzdHJpY3RlZCA9IHN0YXRlLm9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cyAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlLnVzZXJfcHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbF91c2VyX3Byb2plY3RzO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT046XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9qZWN0SWQgPSBhY3Rpb24uZGF0YS5wcm9qZWN0SWQ7XG5cdFxuXHQgICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHN0YXRlLnVzZXJfcHJvamVjdHMpKTtcblx0ICAgICAgICAgICAgICAgIHZhciBfdXNlcl9wcm9qZWN0czIgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHRcblx0ICAgICAgICAgICAgICAgICgwLCBfdXRpbHMuaW5BcnJheSkocHJvamVjdElkLCBfdXNlcl9wcm9qZWN0czIpID8gKDAsIF9wdWxsMi5kZWZhdWx0KShfdXNlcl9wcm9qZWN0czIsIHByb2plY3RJZCkgOiBfdXNlcl9wcm9qZWN0czIucHVzaChwcm9qZWN0SWQpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgeyBvcmlnaW5hbF9wcm9qZWN0czogb3JpZ2luYWxfdXNlcl9wcm9qZWN0cywgdXNlcl9wcm9qZWN0czogX3VzZXJfcHJvamVjdHMyIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRDpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlzX3Jlc3RyaWN0ZWQgPSBhY3Rpb24uZGF0YS5pc19yZXN0cmljdGVkO1xuXHRcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCwgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogc3RhdGUuaXNfcmVzdHJpY3RlZCB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFM6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMyA9IHZvaWQgMCxcblx0ICAgICAgICAgICAgICAgICAgICBfc3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUpLFxuXHQgICAgICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9zdGF0ZS5zZWxlY3RBbGw7XG5cdFxuXHQgICAgICAgICAgICAgICAgaWYgKHNlbGVjdEFsbCkge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuaWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IFtdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF9wcm9qZWN0czogb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0czNcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VSZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTYpLFxuXHQgICAgcHVsbEFsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYzKTtcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG5cdCAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG5cdCAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cblx0ICpcblx0ICogKipOb3RlOioqIFVubGlrZSBgXy53aXRob3V0YCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLiBVc2UgYF8ucmVtb3ZlYFxuXHQgKiB0byByZW1vdmUgZWxlbWVudHMgZnJvbSBhbiBhcnJheSBieSBwcmVkaWNhdGUuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDIuMC4wXG5cdCAqIEBjYXRlZ29yeSBBcnJheVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuXHQgKlxuXHQgKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcblx0ICogY29uc29sZS5sb2coYXJyYXkpO1xuXHQgKiAvLyA9PiBbJ2InLCAnYiddXG5cdCAqL1xuXHR2YXIgcHVsbCA9IGJhc2VSZXN0KHB1bGxBbGwpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGlkZW50aXR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MzkpLFxuXHQgICAgb3ZlclJlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NyksXG5cdCAgICBzZXRUb1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzU5KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuXHQgIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFwcGx5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTgpO1xuXHRcblx0LyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xuXHR2YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cdFxuXHQvKipcblx0ICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcblx0ICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG5cdCAgICAgICAgaW5kZXggPSAtMSxcblx0ICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG5cdCAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXHRcblx0ICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG5cdCAgICB9XG5cdCAgICBpbmRleCA9IC0xO1xuXHQgICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG5cdCAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG5cdCAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcblx0ICAgIH1cblx0ICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuXHQgICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG5cdCAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cblx0ICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG5cdCAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuXHQgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcblx0ICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcblx0ICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcblx0ICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcblx0ICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVNldFRvU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjApLFxuXHQgICAgc2hvcnRPdXQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2Mik7XG5cdFxuXHQvKipcblx0ICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuXHQgKi9cblx0dmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY29uc3RhbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MSksXG5cdCAgICBkZWZpbmVQcm9wZXJ0eSA9IF9fd2VicGFja19yZXF1aXJlX18oMzI4KSxcblx0ICAgIGlkZW50aXR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MzkpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuXHQgKi9cblx0dmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG5cdCAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcblx0ICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuXHQgICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcblx0ICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG5cdCAgICAnd3JpdGFibGUnOiB0cnVlXG5cdCAgfSk7XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDIuNC4wXG5cdCAqIEBjYXRlZ29yeSBVdGlsXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG5cdCAqXG5cdCAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuXHQgKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cblx0ICpcblx0ICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG5cdCAqIC8vID0+IHRydWVcblx0ICovXG5cdGZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHZhbHVlO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG5cdHZhciBIT1RfQ09VTlQgPSA4MDAsXG5cdCAgICBIT1RfU1BBTiA9IDE2O1xuXHRcblx0LyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xuXHR2YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG5cdCAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuXHQgKiBtaWxsaXNlY29uZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG5cdCAgdmFyIGNvdW50ID0gMCxcblx0ICAgICAgbGFzdENhbGxlZCA9IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuXHQgICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cdFxuXHQgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuXHQgICAgaWYgKHJlbWFpbmluZyA+IDApIHtcblx0ICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG5cdCAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY291bnQgPSAwO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVB1bGxBbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NCk7XG5cdFxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5wdWxsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFuIGFycmF5IG9mIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqXG5cdCAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZWAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgNC4wLjBcblx0ICogQGNhdGVnb3J5IEFycmF5XG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcblx0ICpcblx0ICogXy5wdWxsQWxsKGFycmF5LCBbJ2EnLCAnYyddKTtcblx0ICogY29uc29sZS5sb2coYXJyYXkpO1xuXHQgKiAvLyA9PiBbJ2InLCAnYiddXG5cdCAqL1xuXHRmdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcblx0ICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcblx0ICAgID8gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcylcblx0ICAgIDogYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBhcnJheU1hcCA9IF9fd2VicGFja19yZXF1aXJlX18oNDM0KSxcblx0ICAgIGJhc2VJbmRleE9mID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjUpLFxuXHQgICAgYmFzZUluZGV4T2ZXaXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjkpLFxuXHQgICAgYmFzZVVuYXJ5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNTYpLFxuXHQgICAgY29weUFycmF5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzApO1xuXHRcblx0LyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuXHR2YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblx0XG5cdC8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xuXHR2YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG5cdCAqIHNob3J0aGFuZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcblx0ICB2YXIgaW5kZXhPZiA9IGNvbXBhcmF0b3IgPyBiYXNlSW5kZXhPZldpdGggOiBiYXNlSW5kZXhPZixcblx0ICAgICAgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcblx0ICAgICAgc2VlbiA9IGFycmF5O1xuXHRcblx0ICBpZiAoYXJyYXkgPT09IHZhbHVlcykge1xuXHQgICAgdmFsdWVzID0gY29weUFycmF5KHZhbHVlcyk7XG5cdCAgfVxuXHQgIGlmIChpdGVyYXRlZSkge1xuXHQgICAgc2VlbiA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcblx0ICB9XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIHZhciBmcm9tSW5kZXggPSAwLFxuXHQgICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcblx0ICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cdFxuXHQgICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG5cdCAgICAgIGlmIChzZWVuICE9PSBhcnJheSkge1xuXHQgICAgICAgIHNwbGljZS5jYWxsKHNlZW4sIGZyb21JbmRleCwgMSk7XG5cdCAgICAgIH1cblx0ICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGZyb21JbmRleCwgMSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEFsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlRmluZEluZGV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjYpLFxuXHQgICAgYmFzZUlzTmFOID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjcpLFxuXHQgICAgc3RyaWN0SW5kZXhPZiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY4KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG5cdCAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuXHQgICAgPyBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KVxuXHQgICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuXHQgKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcblx0ICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuXHQgICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXHRcblx0ICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuXHQgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcblx0ICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5kZXhPZmAgd2hpY2ggcGVyZm9ybXMgc3RyaWN0IGVxdWFsaXR5XG5cdCAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuXHQgIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG5cdCAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHN0cmljdEluZGV4T2Y7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBiYXNlSW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUluZGV4T2ZXaXRoKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSB7XG5cdCAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcblx0ICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2ZXaXRoO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cblx0ICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcblx0ICB2YXIgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblx0XG5cdCAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG5cdCAgfVxuXHQgIHJldHVybiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdGV4cG9ydHMuZ2V0SXNSZXN0cmljdGVkID0gZXhwb3J0cy5nZXRVc2VyUHJvamVjdHMgPSBleHBvcnRzLmdldFVzZXJJZCA9IHVuZGVmaW5lZDtcblx0ZXhwb3J0cy5mZXRjaERhdGEgPSBmZXRjaERhdGE7XG5cdGV4cG9ydHMucHV0RGF0YSA9IHB1dERhdGE7XG5cdGV4cG9ydHMuZ2V0U2FnYSA9IGdldFNhZ2E7XG5cdGV4cG9ydHMucHV0U2FnYSA9IHB1dFNhZ2E7XG5cdGV4cG9ydHMud2F0Y2hlclNhZ2EgPSB3YXRjaGVyU2FnYTtcblx0XG5cdF9fd2VicGFja19yZXF1aXJlX18oNzcyKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzUyKTtcblx0XG5cdHZhciBfYXhpb3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Myk7XG5cdFxuXHR2YXIgX2F4aW9zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F4aW9zKTtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMjQpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgX21hcmtlZCA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhnZXRTYWdhKSxcblx0ICAgIF9tYXJrZWQyID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKHB1dFNhZ2EpLFxuXHQgICAgX21hcmtlZDMgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsod2F0Y2hlclNhZ2EpOyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0Ly8gVGhpcyBpbXBvcnQgaXMgbmVjZXNzYXJ5IHRvIGJlIGFibGUgdG8gdGVzdCBzYWdhcy5cblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWR1eC1zYWdhL3JlZHV4LXNhZ2EvaXNzdWVzLzI4MCNpc3N1ZWNvbW1lbnQtMjkxMTMzMDIzXG5cdFxuXHRcblx0ZnVuY3Rpb24gY2FsbEF4aW9zKGNvbmZpZykge1xuXHQgICAgcmV0dXJuICgwLCBfYXhpb3MyLmRlZmF1bHQpKGNvbmZpZykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0ICAgICAgICByZXR1cm4geyByZXNwb25zZTogcmVzcG9uc2UgfTtcblx0ICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgICAgIHJldHVybiB7IGVycm9yOiBlcnJvciB9O1xuXHQgICAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZldGNoRGF0YSh1c2VySWQpIHtcblx0ICAgIHZhciBjb25maWcgPSB7XG5cdCAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuXHQgICAgICAgIHVybDogXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIHVzZXJJZCArIFwiL1wiXG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBwdXREYXRhKHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cykge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwicHV0XCIsXG5cdCAgICAgICAgaGVhZGVyczoge1xuXHQgICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6ICgwLCBfdXRpbHMuZ2V0Q29va2llKShcImNzcmZ0b2tlblwiKVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdXJsOiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgdXNlcklkICsgXCIvXCIsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB7XG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBfcmVmLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGdldFNhZ2EkKF9jb250ZXh0KSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IGFjdGlvbi5kYXRhLnVzZXJJZDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKGZldGNoRGF0YSwgdXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9jb250ZXh0LnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xuXHR9XG5cdFxuXHR2YXIgZ2V0VXNlcklkID0gZXhwb3J0cy5nZXRVc2VySWQgPSBmdW5jdGlvbiBnZXRVc2VySWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VySWQ7XG5cdH07XG5cdHZhciBnZXRVc2VyUHJvamVjdHMgPSBleHBvcnRzLmdldFVzZXJQcm9qZWN0cyA9IGZ1bmN0aW9uIGdldFVzZXJQcm9qZWN0cyhzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLnVzZXJfcHJvamVjdHM7XG5cdH07XG5cdHZhciBnZXRJc1Jlc3RyaWN0ZWQgPSBleHBvcnRzLmdldElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIGdldElzUmVzdHJpY3RlZChzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBwdXRTYWdhKGFjdGlvbikge1xuXHQgICAgdmFyIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cywgX3JlZjIsIHJlc3BvbnNlLCBlcnJvcjtcblx0XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gcHV0U2FnYSQoX2NvbnRleHQyKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0SXNSZXN0cmljdGVkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTA7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJQcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKHB1dERhdGEsIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgICAgICBfcmVmMiA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX3JlZjIucmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBfcmVmMi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIxO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxOTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjE6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkMiwgdGhpcyk7XG5cdH1cblx0XG5cdC8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5cdGZ1bmN0aW9uIHdhdGNoZXJTYWdhKCkge1xuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIHdhdGNoZXJTYWdhJChfY29udGV4dDMpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDI7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA2OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gODtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQzLCB0aGlzKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG5cdCAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuXHQgKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqL1xuXHRcblx0IShmdW5jdGlvbihnbG9iYWwpIHtcblx0ICBcInVzZSBzdHJpY3RcIjtcblx0XG5cdCAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcblx0ICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG5cdCAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG5cdCAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcblx0ICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXHQgIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG5cdCAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblx0XG5cdCAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcblx0ICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG5cdCAgaWYgKHJ1bnRpbWUpIHtcblx0ICAgIGlmIChpbk1vZHVsZSkge1xuXHQgICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG5cdCAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG5cdCAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcblx0ICAgIH1cblx0ICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcblx0ICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cblx0ICAgIHJldHVybjtcblx0ICB9XG5cdFxuXHQgIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuXHQgIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cblx0ICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblx0XG5cdCAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuXHQgICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG5cdCAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcblx0ICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG5cdCAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblx0XG5cdCAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG5cdCAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG5cdCAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cdFxuXHQgICAgcmV0dXJuIGdlbmVyYXRvcjtcblx0ICB9XG5cdCAgcnVudGltZS53cmFwID0gd3JhcDtcblx0XG5cdCAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG5cdCAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG5cdCAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG5cdCAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuXHQgIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcblx0ICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG5cdCAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcblx0ICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcblx0ICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG5cdCAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuXHQgIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuXHQgICAgdHJ5IHtcblx0ICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuXHQgIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuXHQgIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG5cdCAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblx0XG5cdCAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuXHQgIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cblx0ICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXHRcblx0ICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcblx0ICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3Jcblx0ICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuXHQgIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG5cdCAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXHRcblx0ICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG5cdCAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cblx0ICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblx0ICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHRcblx0ICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5cdCAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuXHQgIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuXHQgICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcblx0ICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuXHQgICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcblx0ICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cblx0ICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG5cdCAgfVxuXHRcblx0ICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuXHQgICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcblx0ICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuXHQgICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cdFxuXHQgIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG5cdCAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cblx0ICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG5cdCAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcblx0ICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcblx0ICAgICAgfTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG5cdCAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG5cdCAgICByZXR1cm4gY3RvclxuXHQgICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG5cdCAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuXHQgICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cblx0ICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcblx0ICAgICAgOiBmYWxzZTtcblx0ICB9O1xuXHRcblx0ICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcblx0ICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcblx0ICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuXHQgICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG5cdCAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuXHQgICAgcmV0dXJuIGdlbkZ1bjtcblx0ICB9O1xuXHRcblx0ICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cblx0ICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuXHQgIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcblx0ICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuXHQgIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcblx0ICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG5cdCAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuXHQgICAgICAgIGlmICh2YWx1ZSAmJlxuXHQgICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcblx0ICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuXHQgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuXHQgICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcblx0ICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuXHQgICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcblx0ICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG5cdCAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuXHQgICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuXHQgICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuXHQgICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG5cdCAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcblx0ICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG5cdCAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcblx0ICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcblx0ICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcblx0ICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuXHQgICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG5cdCAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG5cdCAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG5cdCAgICAgICAgfSwgcmVqZWN0KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cdFxuXHQgICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuXHQgICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuXHQgICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcblx0ICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcblx0ICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG5cdCAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cblx0ICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcblx0ICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuXHQgICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcblx0ICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuXHQgICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG5cdCAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcblx0ICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuXHQgICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cblx0ICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcblx0ICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuXHQgICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcblx0ICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cblx0ICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG5cdCAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcblx0ICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuXHQgICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcblx0ICB9XG5cdFxuXHQgIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cdCAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHQgIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cdFxuXHQgIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2Zcblx0ICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2Zcblx0ICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cblx0ICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcblx0ICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG5cdCAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG5cdCAgICApO1xuXHRcblx0ICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcblx0ICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cblx0ICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHQgICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG5cdCAgICAgICAgfSk7XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG5cdCAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXHRcblx0ICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcblx0ICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcblx0ICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIHRocm93IGFyZztcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG5cdCAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuXHQgICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IGFyZztcblx0XG5cdCAgICAgIHdoaWxlICh0cnVlKSB7XG5cdCAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcblx0ICAgICAgICBpZiAoZGVsZWdhdGUpIHtcblx0ICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXHQgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG5cdCAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG5cdCAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcblx0ICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuXHQgICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cblx0ICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcblx0ICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblx0ICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cdFxuXHQgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblx0ICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcblx0ICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cblx0ICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cblx0ICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG5cdCAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcblx0ICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXHRcblx0ICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG5cdCAgICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIHJldHVybiB7XG5cdCAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuXHQgICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcblx0ICAgICAgICAgIH07XG5cdFxuXHQgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblx0ICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcblx0ICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcblx0ICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG5cdCAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG5cdCAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG5cdCAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuXHQgICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcblx0ICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcblx0ICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdFxuXHQgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcblx0ICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcblx0ICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cdFxuXHQgICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cblx0ICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG5cdCAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuXHQgICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXHRcblx0ICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cdFxuXHQgICAgaWYgKCEgaW5mbykge1xuXHQgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG5cdCAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoaW5mby5kb25lKSB7XG5cdCAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG5cdCAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG5cdCAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXHRcblx0ICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuXHQgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXHRcblx0ICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG5cdCAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcblx0ICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cblx0ICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG5cdCAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG5cdCAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cblx0ICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG5cdCAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgfVxuXHRcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cblx0ICAgICAgcmV0dXJuIGluZm87XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcblx0ICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG5cdCAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0ICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgIH1cblx0XG5cdCAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcblx0ICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG5cdCAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblx0XG5cdCAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblx0XG5cdCAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcblx0ICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuXHQgIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG5cdCAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG5cdCAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG5cdCAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXHRcblx0ICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcblx0ICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cdFxuXHQgICAgaWYgKDEgaW4gbG9jcykge1xuXHQgICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKDIgaW4gbG9jcykge1xuXHQgICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcblx0ICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuXHQgICAgfVxuXHRcblx0ICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcblx0ICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuXHQgICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuXHQgICAgZGVsZXRlIHJlY29yZC5hcmc7XG5cdCAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuXHQgICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG5cdCAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG5cdCAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG5cdCAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuXHQgICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuXHQgICAgdGhpcy5yZXNldCh0cnVlKTtcblx0ICB9XG5cdFxuXHQgIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHQgICAgdmFyIGtleXMgPSBbXTtcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAga2V5cy5wdXNoKGtleSk7XG5cdCAgICB9XG5cdCAgICBrZXlzLnJldmVyc2UoKTtcblx0XG5cdCAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuXHQgICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cblx0ICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcblx0ICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuXHQgICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcblx0ICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcblx0ICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcblx0ICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG5cdCAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cdCAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgfTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcblx0ICAgIGlmIChpdGVyYWJsZSkge1xuXHQgICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG5cdCAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuXHQgICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmFibGU7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuXHQgICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG5cdCAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuXHQgICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcblx0ICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cdFxuXHQgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgfTtcblx0XG5cdCAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG5cdCAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG5cdCAgfVxuXHQgIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXHRcblx0ICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuXHQgIH1cblx0XG5cdCAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG5cdCAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblx0XG5cdCAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuXHQgICAgICB0aGlzLnByZXYgPSAwO1xuXHQgICAgICB0aGlzLm5leHQgPSAwO1xuXHQgICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuXHQgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuXHQgICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuXHQgICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcblx0ICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cdFxuXHQgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXHRcblx0ICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG5cdCAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG5cdCAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuXHQgICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuXHQgICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG5cdCAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuXHQgICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBzdG9wOiBmdW5jdGlvbigpIHtcblx0ICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblx0XG5cdCAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG5cdCAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG5cdCAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gdGhpcy5ydmFsO1xuXHQgICAgfSxcblx0XG5cdCAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG5cdCAgICAgIGlmICh0aGlzLmRvbmUpIHtcblx0ICAgICAgICB0aHJvdyBleGNlcHRpb247XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcblx0ICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG5cdCAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG5cdCAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcblx0ICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cdFxuXHQgICAgICAgIGlmIChjYXVnaHQpIHtcblx0ICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG5cdCAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblx0XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcblx0ICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG5cdCAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cblx0ICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG5cdCAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcblx0ICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuXHQgICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXHRcblx0ICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuXHQgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuXHQgICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuXHQgICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG5cdCAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuXHQgICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuXHQgICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcblx0ICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG5cdCAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG5cdCAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuXHQgICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuXHQgICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG5cdCAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cdFxuXHQgICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG5cdCAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcblx0ICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcblx0ICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcblx0ICAgIH0sXG5cdFxuXHQgICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcblx0ICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuXHQgICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuXHQgICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG5cdCAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuXHQgICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG5cdCAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcblx0ICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9LFxuXHRcblx0ICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcblx0ICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuXHQgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG5cdCAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblx0ICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuXHQgICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIHJldHVybiB0aHJvd247XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cblx0ICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG5cdCAgICB9LFxuXHRcblx0ICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG5cdCAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG5cdCAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG5cdCAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcblx0ICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG5cdCAgICAgIH07XG5cdFxuXHQgICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG5cdCAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3Rcblx0ICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG5cdCAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHQgIH07XG5cdH0pKFxuXHQgIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG5cdCAgLy8gRnVuY3Rpb24gY29uc3RydWN0b3IgaWYgd2UncmUgaW4gZ2xvYmFsIHN0cmljdCBtb2RlLiBUaGF0IGlzIHNhZGx5IGEgZm9ybVxuXHQgIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG5cdCAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0dmFyIEF4aW9zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzgpO1xuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuXHQgIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuXHQgIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXHRcblx0ICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG5cdCAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblx0XG5cdCAgcmV0dXJuIGluc3RhbmNlO1xuXHR9XG5cdFxuXHQvLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcblx0dmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXHRcblx0Ly8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5cdGF4aW9zLkF4aW9zID0gQXhpb3M7XG5cdFxuXHQvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5cdGF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuXHQgIHJldHVybiBjcmVhdGVJbnN0YW5jZSh1dGlscy5tZXJnZShkZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcblx0fTtcblx0XG5cdC8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuXHRheGlvcy5DYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Nik7XG5cdGF4aW9zLkNhbmNlbFRva2VuID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRheGlvcy5pc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0XG5cdC8vIEV4cG9zZSBhbGwvc3ByZWFkXG5cdGF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuXHQgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdH07XG5cdGF4aW9zLnNwcmVhZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cdFxuXHQvLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcblx0bW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBpc0J1ZmZlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzc3KTtcblx0XG5cdC8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXHRcblx0Ly8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3Ncblx0XG5cdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuXHQgIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcblx0ICB2YXIgcmVzdWx0O1xuXHQgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcblx0ICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG5cdCAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0RhdGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2Jcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG5cdCAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcblx0fVxuXHRcblx0LyoqXG5cdCAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmltKHN0cikge1xuXHQgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcblx0ICpcblx0ICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cblx0ICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuXHQgKlxuXHQgKiB3ZWIgd29ya2Vyczpcblx0ICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG5cdCAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG5cdCAqXG5cdCAqIHJlYWN0LW5hdGl2ZTpcblx0ICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICByZXR1cm4gKFxuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcblx0ICApO1xuXHR9XG5cdFxuXHQvKipcblx0ICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3Npbmdcblx0ICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cblx0ICovXG5cdGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuXHQgIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuXHQgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdFxuXHQgIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuXHQgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBvYmogPSBbb2JqXTtcblx0ICB9XG5cdFxuXHQgIGlmIChpc0FycmF5KG9iaikpIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcblx0ICAgIH1cblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG5cdCAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuXHQgKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cblx0ICpcblx0ICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cblx0ICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuXHQgKlxuXHQgKiBFeGFtcGxlOlxuXHQgKlxuXHQgKiBgYGBqc1xuXHQgKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG5cdCAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuXHQgKi9cblx0ZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG5cdCAgdmFyIHJlc3VsdCA9IHt9O1xuXHQgIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuXHQgICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cblx0ICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG5cdCAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcblx0ICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGFba2V5XSA9IHZhbDtcblx0ICAgIH1cblx0ICB9KTtcblx0ICByZXR1cm4gYTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgaXNBcnJheTogaXNBcnJheSxcblx0ICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuXHQgIGlzQnVmZmVyOiBpc0J1ZmZlcixcblx0ICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuXHQgIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcblx0ICBpc1N0cmluZzogaXNTdHJpbmcsXG5cdCAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuXHQgIGlzT2JqZWN0OiBpc09iamVjdCxcblx0ICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG5cdCAgaXNEYXRlOiBpc0RhdGUsXG5cdCAgaXNGaWxlOiBpc0ZpbGUsXG5cdCAgaXNCbG9iOiBpc0Jsb2IsXG5cdCAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcblx0ICBpc1N0cmVhbTogaXNTdHJlYW0sXG5cdCAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuXHQgIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcblx0ICBmb3JFYWNoOiBmb3JFYWNoLFxuXHQgIG1lcmdlOiBtZXJnZSxcblx0ICBleHRlbmQ6IGV4dGVuZCxcblx0ICB0cmltOiB0cmltXG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcblx0ICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIVxuXHQgKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG5cdCAqXG5cdCAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG5cdCAqIEBsaWNlbnNlICBNSVRcblx0ICovXG5cdFxuXHQvLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG5cdC8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG5cdCAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG5cdH1cblx0XG5cdC8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5cdGZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG5cdH1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTApO1xuXHR2YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTEpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdGZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG5cdCAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuXHQgIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuXHQgICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuXHQgICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuXHQgIH07XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhIHJlcXVlc3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG5cdCAqL1xuXHRBeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuXHQgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuXHQgICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuXHQgICAgICB1cmw6IGFyZ3VtZW50c1swXVxuXHQgICAgfSwgYXJndW1lbnRzWzFdKTtcblx0ICB9XG5cdFxuXHQgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cdCAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblx0XG5cdCAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuXHQgIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG5cdCAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG5cdCAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuXHQgIH0pO1xuXHRcblx0ICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuXHQgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXHRcblx0Ly8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG5cdHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsLFxuXHQgICAgICBkYXRhOiBkYXRhXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApO1xuXHRcblx0dmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuXHQgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG5cdCAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcblx0ICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcblx0ICB2YXIgYWRhcHRlcjtcblx0ICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9XG5cdCAgcmV0dXJuIGFkYXB0ZXI7XG5cdH1cblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0ICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG5cdCAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuXHQgICAgKSB7XG5cdCAgICAgIHJldHVybiBkYXRhO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG5cdCAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuXHQgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcblx0ICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGRhdGE7XG5cdCAgfV0sXG5cdFxuXHQgIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICAvKipcblx0ICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcblx0ICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuXHQgICAqL1xuXHQgIHRpbWVvdXQ6IDAsXG5cdFxuXHQgIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG5cdCAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXHRcblx0ICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblx0XG5cdCAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuXHQgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuXHQgIH1cblx0fTtcblx0XG5cdGRlZmF1bHRzLmhlYWRlcnMgPSB7XG5cdCAgY29tbW9uOiB7XG5cdCAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcblx0ICB9XG5cdH07XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcblx0ICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcblx0ICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcblx0ICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHNldHRsZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgyKTtcblx0dmFyIGJ1aWxkVVJMID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHR2YXIgcGFyc2VIZWFkZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODYpO1xuXHR2YXIgaXNVUkxTYW1lT3JpZ2luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODcpO1xuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdHZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuXHQgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcblx0ICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXHRcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuXHQgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0ICAgIHZhciBsb2FkRXZlbnQgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcblx0ICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cdFxuXHQgICAgLy8gRm9yIElFIDgvOSBDT1JTIHN1cHBvcnRcblx0ICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG5cdCAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmXG5cdCAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuXHQgICAgICAgICFpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpIHtcblx0ICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcblx0ICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG5cdCAgICAgIHhEb21haW4gPSB0cnVlO1xuXHQgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuXHQgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG5cdCAgICBpZiAoY29uZmlnLmF1dGgpIHtcblx0ICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG5cdCAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuXHQgICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuXHQgICAgfVxuXHRcblx0ICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cdFxuXHQgICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcblx0ICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXHRcblx0ICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcblx0ICAgIHJlcXVlc3RbbG9hZEV2ZW50XSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG5cdCAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG5cdCAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG5cdCAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG5cdCAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3Rcblx0ICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuXHQgICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG5cdCAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdCAgICAgIHZhciByZXNwb25zZSA9IHtcblx0ICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG5cdCAgICAgICAgLy8gSUUgc2VuZHMgMTIyMyBpbnN0ZWFkIG9mIDIwNCAoaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy8yMDEpXG5cdCAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuXHQgICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuXHQgICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcblx0ICAgICAgICBjb25maWc6IGNvbmZpZyxcblx0ICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG5cdCAgICAgIH07XG5cdFxuXHQgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG5cdCAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcblx0ICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG5cdCAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEhhbmRsZSB0aW1lb3V0XG5cdCAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG5cdCAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuXHQgICAgICAgIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuXHQgICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG5cdCAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXHQgICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcblx0ICAgICAgdmFyIGNvb2tpZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OSk7XG5cdFxuXHQgICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cblx0ICAgICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcblx0ICAgICAgICAgIHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIGlmICh4c3JmVmFsdWUpIHtcblx0ICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3Rcblx0ICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuXHQgICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG5cdCAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG5cdCAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3Rcblx0ICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cdCAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuXHQgICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG5cdCAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cblx0ICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG5cdCAgICAgICAgICB0aHJvdyBlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcblx0ICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuXHQgICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG5cdCAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcblx0ICAgICAgICBpZiAoIXJlcXVlc3QpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcblx0ICAgICAgICByZWplY3QoY2FuY2VsKTtcblx0ICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG5cdCAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuXHQgIH0pO1xuXHR9O1xuXHRcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBjcmVhdGVFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgzKTtcblx0XG5cdC8qKlxuXHQgKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuXHQgIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcblx0ICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3Rcblx0ICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuXHQgICAgcmVzb2x2ZShyZXNwb25zZSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlamVjdChjcmVhdGVFcnJvcihcblx0ICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcblx0ICAgICAgcmVzcG9uc2UuY29uZmlnLFxuXHQgICAgICBudWxsLFxuXHQgICAgICByZXNwb25zZS5yZXF1ZXN0LFxuXHQgICAgICByZXNwb25zZVxuXHQgICAgKSk7XG5cdCAgfVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGVuaGFuY2VFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzg0KTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0ICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcblx0ICBpZiAoY29kZSkge1xuXHQgICAgZXJyb3IuY29kZSA9IGNvZGU7XG5cdCAgfVxuXHQgIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuXHQgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG5cdCAgcmV0dXJuIGVycm9yO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuXHQgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cblx0ICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cblx0ICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cblx0ICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuXHQgICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuXHQgICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG5cdCAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG5cdCAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgaWYgKCFwYXJhbXMpIHtcblx0ICAgIHJldHVybiB1cmw7XG5cdCAgfVxuXHRcblx0ICB2YXIgc2VyaWFsaXplZFBhcmFtcztcblx0ICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcblx0ICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgdmFyIHBhcnRzID0gW107XG5cdFxuXHQgICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuXHQgICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG5cdCAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YWwgPSBbdmFsXTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuXHQgICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcblx0ICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuXHQgICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuXHQgIH1cblx0XG5cdCAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcblx0ICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcblx0ICB9XG5cdFxuXHQgIHJldHVybiB1cmw7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHQvLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuXHQvLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5cdHZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcblx0ICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuXHQgICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcblx0ICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG5cdCAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcblx0XTtcblx0XG5cdC8qKlxuXHQgKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG5cdCAqXG5cdCAqIGBgYFxuXHQgKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuXHQgKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cblx0ICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuXHQgKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuXHQgIHZhciBwYXJzZWQgPSB7fTtcblx0ICB2YXIga2V5O1xuXHQgIHZhciB2YWw7XG5cdCAgdmFyIGk7XG5cdFxuXHQgIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cdFxuXHQgIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG5cdCAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG5cdCAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXHRcblx0ICAgIGlmIChrZXkpIHtcblx0ICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuXHQgICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBwYXJzZWQ7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IChcblx0ICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblx0XG5cdCAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG5cdCAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG5cdCAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0ICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0ICAgIHZhciBvcmlnaW5VUkw7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG5cdCAgICAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAgICAqL1xuXHQgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcblx0ICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cdFxuXHQgICAgICBpZiAobXNpZSkge1xuXHQgICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcblx0ICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblx0ICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdFxuXHQgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcblx0ICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG5cdCAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG5cdCAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuXHQgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG5cdCAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuXHQgICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG5cdCAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdFxuXHQgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG5cdCAgICAqXG5cdCAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuXHQgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAgICAqL1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG5cdCAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG5cdCAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcblx0ICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5cdCAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfTtcblx0ICB9KSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvLyBidG9hIHBvbHlmaWxsIGZvciBJRTwxMCBjb3VydGVzeSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcblx0XG5cdHZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cdFxuXHRmdW5jdGlvbiBFKCkge1xuXHQgIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xuXHR9XG5cdEUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuXHRFLnByb3RvdHlwZS5jb2RlID0gNTtcblx0RS5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXHRcblx0ZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuXHQgIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpO1xuXHQgIHZhciBvdXRwdXQgPSAnJztcblx0ICBmb3IgKFxuXHQgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcblx0ICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuXHQgICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuXHQgICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcblx0ICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcblx0ICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG5cdCAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuXHQgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG5cdCAgKSB7XG5cdCAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGlkeCArPSAzIC8gNCk7XG5cdCAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG5cdCAgICAgIHRocm93IG5ldyBFKCk7XG5cdCAgICB9XG5cdCAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcblx0ICB9XG5cdCAgcmV0dXJuIG91dHB1dDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBidG9hO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG5cdCAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuXHQgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcblx0ICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuXHQgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG5cdCAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9KSgpIDpcblx0XG5cdCAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG5cdCAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuXHQgIHRoaXMuaGFuZGxlcnMgPSBbXTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG5cdCAgdGhpcy5oYW5kbGVycy5wdXNoKHtcblx0ICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuXHQgICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG5cdCAgfSk7XG5cdCAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG5cdCAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG5cdCAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG5cdCAqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG5cdCAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuXHQgIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuXHQgICAgaWYgKGggIT09IG51bGwpIHtcblx0ICAgICAgZm4oaCk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHRyYW5zZm9ybURhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Mik7XG5cdHZhciBpc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHR2YXIgaXNBYnNvbHV0ZVVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk0KTtcblx0dmFyIGNvbWJpbmVVUkxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTUpO1xuXHRcblx0LyoqXG5cdCAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuXHQgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3Rcblx0ICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG5cdCAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG5cdCAgaWYgKGNvbmZpZy5iYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKGNvbmZpZy51cmwpKSB7XG5cdCAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuXHQgIH1cblx0XG5cdCAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3Rcblx0ICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXHRcblx0ICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG5cdCAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgY29uZmlnLmRhdGEsXG5cdCAgICBjb25maWcuaGVhZGVycyxcblx0ICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG5cdCAgKTtcblx0XG5cdCAgLy8gRmxhdHRlbiBoZWFkZXJzXG5cdCAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcblx0ICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuXHQgICAgY29uZmlnLmhlYWRlcnMgfHwge31cblx0ICApO1xuXHRcblx0ICB1dGlscy5mb3JFYWNoKFxuXHQgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG5cdCAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcblx0ICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG5cdCAgICB9XG5cdCAgKTtcblx0XG5cdCAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXHRcblx0ICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuXHQgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgICAgcmVzcG9uc2UuZGF0YSxcblx0ICAgICAgcmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICApO1xuXHRcblx0ICAgIHJldHVybiByZXNwb25zZTtcblx0ICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG5cdCAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcblx0ICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblx0ICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcblx0ICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcblx0ICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuXHQgICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICAgICAgKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0LyoqXG5cdCAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2Vcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG5cdCAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcblx0ICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcblx0ICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIGRhdGE7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG5cdCAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG5cdCAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuXHQgIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuXHQgIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuXHQgIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG5cdCAgcmV0dXJuIHJlbGF0aXZlVVJMXG5cdCAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuXHQgICAgOiBiYXNlVVJMO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG5cdH07XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuXHQgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcblx0ICB9XG5cdFxuXHQgIHZhciByZXNvbHZlUHJvbWlzZTtcblx0ICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuXHQgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuXHQgIH0pO1xuXHRcblx0ICB2YXIgdG9rZW4gPSB0aGlzO1xuXHQgIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG5cdCAgICBpZiAodG9rZW4ucmVhc29uKSB7XG5cdCAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdFxuXHQgICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcblx0ICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG5cdCAgfSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0Q2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuXHQgIGlmICh0aGlzLnJlYXNvbikge1xuXHQgICAgdGhyb3cgdGhpcy5yZWFzb247XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcblx0ICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cblx0ICovXG5cdENhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcblx0ICB2YXIgY2FuY2VsO1xuXHQgIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG5cdCAgICBjYW5jZWwgPSBjO1xuXHQgIH0pO1xuXHQgIHJldHVybiB7XG5cdCAgICB0b2tlbjogdG9rZW4sXG5cdCAgICBjYW5jZWw6IGNhbmNlbFxuXHQgIH07XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG5cdCAqXG5cdCAqICBgYGBqc1xuXHQgKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuXHQgKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG5cdCAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHQgKiAgYGBgXG5cdCAqXG5cdCAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuXHQgIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuXHQgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KVxuXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuaW1wb3J0IEFwcCBmcm9tIFwiLi9jb21wb25lbnRzL0FwcFwiO1xuXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21wb3NlIH0gZnJvbSBcInJlZHV4XCI7XG5pbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcInJlZHV4LXNhZ2FcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5cbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tIFwiLi9yZWR1Y2VyXCI7XG5pbXBvcnQgeyB3YXRjaGVyU2FnYSB9IGZyb20gXCIuL3NhZ2FzXCI7XG5cbi8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5jb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKCk7XG5cbi8vIGRldiB0b29scyBtaWRkbGV3YXJlXG5jb25zdCByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblxubGV0IHN0b3JlO1xuaWYgKHJlZHV4RGV2VG9vbHMpIHtcbiAgICBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGNvbXBvc2UoYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSwgcmVkdXhEZXZUb29scykpO1xufSBlbHNlIHtcbiAgICBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpO1xufVxuXG5zYWdhTWlkZGxld2FyZS5ydW4od2F0Y2hlclNhZ2EpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgICAgICAgICAgPEFwcCAvPlxuICAgICAgICA8L1Byb3ZpZGVyPixcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIilcbiAgICApO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCIvKlxuICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IHsgXywgZGF0YUZyb21FbGVtZW50LCBpbkFycmF5IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4uL2NvbnN0XCI7XG5cbmNvbnN0IElzUmVzdHJpY3RlZCA9ICh7IF8sIGlzX3Jlc3RyaWN0ZWQsIG9uQ2hhbmdlSXNSZXN0cmljdGVkIH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJpc19yZXN0cmljdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgey8qIFRoZSBzdHJpbmdzIGluY2x1ZGUgPHN0cm9uZz4gdGFncyB3aGljaCByZXF1aXJlcyB0aGUgdXNlIG9mXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICovfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IGlzX3Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB7aXNfcmVzdHJpY3RlZCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlc3RyaWN0ZWRJbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBfKFwicmVzdHJpY3RlZF9pbmZvXCIpIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jb25zdCBQcm9qZWN0ID0gKHsgXywgcHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgfSkgPT4ge1xuICAgIC8vIE5PVEU6IHRoZSBjaGVja2VkIHZhbHVlIGlzIHNldCB0byB0cnVlIGlmIGlzX3Jlc3RyaWN0ZWQgaXMgZmFsc2UuIFRoaXMgaXMgc28gdGhhdCB0aGUgbGlzdCBvZlxuICAgIC8vIHByb2plY3RzIGxvb2tzIGxpa2UgYWxsIHByb2plY3RzIGFyZSBzZWxlY3RlZCB3aGVuIHJlc3RyaWN0aW9ucyBhcmUgbm90IGluIGZvcmNlLlxuICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cbiAgICBjb25zdCBjaGVja2VkID0gIWlzX3Jlc3RyaWN0ZWQgfHwgKHVzZXJfcHJvamVjdHMgJiYgaW5BcnJheShwcm9qZWN0LmlkLCB1c2VyX3Byb2plY3RzKSksXG4gICAgICAgIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG4gICAgICAgIHByb2plY3RTZWxlY3RlZCA9IGNoZWNrZWQgPyBcIiBwcm9qZWN0U2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG4gICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0clxuICAgICAgICAgICAga2V5PXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17dHJDbGFzc05hbWV9XG4gICAgICAgID5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPXtpZENsYXNzTmFtZX0+e3Byb2plY3QuaWR9PC90ZD5cbiAgICAgICAgICAgIDx0ZD57cHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIil9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICApO1xufTtcblxuY29uc3QgU2VsZWN0QWxsID0gKHsgXywgc2VsZWN0QWxsLCBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGlzX3Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgY2xhc3NOYW1lID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIik7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2lzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCJ9PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9IGRpc2FibGVkPXtkaXNhYmxlZH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHtzZWxlY3RBbGwgPyBfKFwiY2hlY2tfYWxsX3Byb2plY3RzXCIpIDogXyhcInVuY2hlY2tfYWxsX3Byb2plY3RzXCIpfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5jb25zdCBFcnJvciA9ICh7IF8sIGVycm9yIH0pID0+IHtcbiAgICByZXR1cm4gZXJyb3IgPyA8ZGl2IGNsYXNzTmFtZT1cImVycm9yXCI+e18oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZX08L2Rpdj4gOiBudWxsO1xufTtcblxuY29uc3QgUHJvamVjdHMgPSAoe1xuICAgIF8sXG4gICAgZXJyb3IsXG4gICAgYWxsX3Byb2plY3RzLFxuICAgIHVzZXJfcHJvamVjdHMsXG4gICAgaXNfcmVzdHJpY3RlZCxcbiAgICBzZWxlY3RBbGwsXG4gICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG59KSA9PiB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8RXJyb3IgXz17X30gZXJyb3I9e2Vycm9yfSAvPlxuICAgICAgICAgICAgPElzUmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17b25DaGFuZ2VJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFNlbGVjdEFsbFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwiYWNjZXNzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwicHJvamVjdF9pZFwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcInByb2plY3RfdGl0bGVcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge2FsbF9wcm9qZWN0cy5tYXAoKHByb2plY3QpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQcm9qZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdD17cHJvamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzPXt1c2VyX3Byb2plY3RzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e29uQ2hhbmdlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkID0gdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fID0gdGhpcy5fLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNsYXRpb24gaGFuZGxpbmdcbiAgICBfKHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc3RyaW5ncyAmJiB0aGlzLnByb3BzLnN0cmluZ3Nbc107XG4gICAgfVxuXG4gICAgdG9nZ2xlSXNSZXN0cmljdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZUlzUmVzdHJpY3RlZChlLnRhcmdldC5jaGVja2VkKTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCB1c2VySWQgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXByb2plY3RzLXRleHRcIik7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBzdHJpbmdzIH0pO1xuXG4gICAgICAgIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIGFsbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cywgZXJyb3IgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBhbGxfcHJvamVjdHMgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzPXthbGxfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cz17dXNlcl9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17dGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXt0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXY+e18oXCJsb2FkaW5nXCIpfTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBmZXRjaGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFsbF9wcm9qZWN0cyxcbiAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICB1c2VyX3Byb2plY3RzLFxuICAgICAgICBzdHJpbmdzXG4gICAgfSA9IHN0YXRlO1xuICAgIHJldHVybiB7IGZldGNoaW5nLCBlcnJvciwgYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHMsIHN0cmluZ3MgfTtcbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xuICAgIHJldHVybiB7IG9uRmV0Y2hVc2VyUHJvamVjdHM6IHVzZXJJZCA9PiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5BUElfR0VUX0lOSVQsXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQgfVxuICAgICAgICAgICAgfSksIHNldFN0b3JlOiBkYXRhID0+IGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9KSwgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBwcm9qZWN0SWQgPT4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkIH1cbiAgICAgICAgICAgIH0pLCBvblVwZGF0ZUlzUmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCA9PiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzX3Jlc3RyaWN0ZWQgfVxuICAgICAgICAgICAgfSksIG9uVXBkYXRlU2VsZWN0QWxsOiAoKSA9PiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgfSkgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb21wb25lbnRzL0FwcC5qc3giLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi4vbXktcmVzdWx0cy9zdG9yZVwiO1xuXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBpZCA9PiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHtpZH0vP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGNvbnN0IGluQXJyYXkgPSAob2JqLCBhcnIpID0+IGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblxuZXhwb3J0IGNvbnN0IGRhdGFGcm9tRWxlbWVudCA9IGVsZW1lbnROYW1lID0+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkuaW5uZXJIVE1MKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy91dGlscy5qcyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gYWN0aW9uIHR5cGVzXG5leHBvcnQgY29uc3QgLy9cbiAgICBTRVRfU1RPUkUgPSBcIlNFVF9TVE9SRVwiLFxuICAgIC8vXG4gICAgQVBJX0dFVF9JTklUID0gXCJBUElfR0VUX0lOSVRcIixcbiAgICBBUElfR0VUX1NVQ0NFU1MgPSBcIkFQSV9HRVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBBUElfUFVUX0lOSVQgPSBcIkFQSV9QVVRfSU5JVFwiLFxuICAgIEFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG4gICAgQVBJX1BVVF9GQUlMVVJFID0gXCJBUElfUFVUX0ZBSUxVUkVcIixcbiAgICAvL1xuICAgIFVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG4gICAgVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG4gICAgVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb25zdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudXRpbHMgPSBleHBvcnRzLmVmZmVjdHMgPSBleHBvcnRzLmRldGFjaCA9IGV4cG9ydHMuQ0FOQ0VMID0gZXhwb3J0cy5kZWxheSA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IGV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuY2hhbm5lbCA9IGV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXhwb3J0cy5FTkQgPSBleHBvcnRzLnJ1blNhZ2EgPSB1bmRlZmluZWQ7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3J1blNhZ2EnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdydW5TYWdhJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3J1blNhZ2EucnVuU2FnYTtcbiAgfVxufSk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2NoYW5uZWwnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcbiAgfVxufSk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2J1ZmZlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdidWZmZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2J1ZmZlcnMuYnVmZmVycztcbiAgfVxufSk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9zYWdhSGVscGVycycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlRXZlcnk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50aHJvdHRsZTtcbiAgfVxufSk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC91dGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlbGF5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlbGF5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0FOQ0VMJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLkNBTkNFTDtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RldGFjaCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5kZXRhY2g7XG4gIH1cbn0pO1xuXG52YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9taWRkbGV3YXJlJyk7XG5cbnZhciBfbWlkZGxld2FyZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWlkZGxld2FyZSk7XG5cbnZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2VmZmVjdHMnKTtcblxudmFyIGVmZmVjdHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2VmZmVjdHMpO1xuXG52YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciB1dGlscyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX21pZGRsZXdhcmUyLmRlZmF1bHQ7XG5leHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucnVuU2FnYSA9IHJ1blNhZ2E7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9wcm9jJyk7XG5cbnZhciBfcHJvYzIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvYyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBSVU5fU0FHQV9TSUdOQVRVUkUgPSAncnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSwgLi4uYXJncyknO1xudmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cbmZ1bmN0aW9uIHJ1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgaXRlcmF0b3IgPSB2b2lkIDA7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICgwLCBfdXRpbHMubG9nKSgnd2FybicsICdydW5TYWdhKGl0ZXJhdG9yLCBzdG9yZUludGVyZmFjZSkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgUlVOX1NBR0FfU0lHTkFUVVJFKTtcbiAgICB9XG4gICAgaXRlcmF0b3IgPSBzdG9yZUludGVyZmFjZTtcbiAgICBzdG9yZUludGVyZmFjZSA9IHNhZ2E7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2FnYSwgX3V0aWxzLmlzLmZ1bmMsIE5PTl9HRU5FUkFUT1JfRVJSKTtcbiAgICBpdGVyYXRvciA9IHNhZ2EuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG4gIH1cblxuICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG4gICAgICBzdWJzY3JpYmUgPSBfc3RvcmVJbnRlcmZhY2Uuc3Vic2NyaWJlLFxuICAgICAgZGlzcGF0Y2ggPSBfc3RvcmVJbnRlcmZhY2UuZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcbiAgICAgIGNvbnRleHQgPSBfc3RvcmVJbnRlcmZhY2UuY29udGV4dCxcbiAgICAgIHNhZ2FNb25pdG9yID0gX3N0b3JlSW50ZXJmYWNlLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBfc3RvcmVJbnRlcmZhY2Uub25FcnJvcjtcblxuXG4gIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXG4gIGlmIChzYWdhTW9uaXRvcikge1xuICAgIC8vIG1vbml0b3JzIGFyZSBleHBlY3RlZCB0byBoYXZlIGEgY2VydGFpbiBpbnRlcmZhY2UsIGxldCdzIGZpbGwtaW4gYW55IG1pc3Npbmcgb25lc1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkID0gc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXG4gICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCByb290OiB0cnVlLCBwYXJlbnRFZmZlY3RJZDogMCwgZWZmZWN0OiB7IHJvb3Q6IHRydWUsIHNhZ2E6IHNhZ2EsIGFyZ3M6IGFyZ3MgfSB9KTtcbiAgfVxuXG4gIHZhciB0YXNrID0gKDAsIF9wcm9jMi5kZWZhdWx0KShpdGVyYXRvciwgc3Vic2NyaWJlLCAoMCwgX3V0aWxzLndyYXBTYWdhRGlzcGF0Y2gpKGRpc3BhdGNoKSwgZ2V0U3RhdGUsIGNvbnRleHQsIHsgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLCBsb2dnZXI6IGxvZ2dlciwgb25FcnJvcjogb25FcnJvciB9LCBlZmZlY3RJZCwgc2FnYS5uYW1lKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgdGFzayk7XG4gIH1cblxuICByZXR1cm4gdGFzaztcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcnVuU2FnYS5qc1xuLy8gbW9kdWxlIGlkID0gNzM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmNoZWNrID0gY2hlY2s7XG5leHBvcnRzLmhhc093biA9IGhhc093bjtcbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuZXhwb3J0cy5hcnJheU9mRGVmZmVyZWQgPSBhcnJheU9mRGVmZmVyZWQ7XG5leHBvcnRzLmRlbGF5ID0gZGVsYXk7XG5leHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5leHBvcnRzLmF1dG9JbmMgPSBhdXRvSW5jO1xuZXhwb3J0cy5tYWtlSXRlcmF0b3IgPSBtYWtlSXRlcmF0b3I7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZGVwcmVjYXRlID0gZGVwcmVjYXRlO1xudmFyIHN5bSA9IGV4cG9ydHMuc3ltID0gZnVuY3Rpb24gc3ltKGlkKSB7XG4gIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcbn07XG5cbnZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xudmFyIEhFTFBFUiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkhFTFBFUiA9IHN5bSgnSEVMUEVSJyk7XG52YXIgTUFUQ0ggPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5NQVRDSCA9IHN5bSgnTUFUQ0gnKTtcbnZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG52YXIgU0FHQV9BQ1RJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TQUdBX0FDVElPTiA9IHN5bSgnU0FHQV9BQ1RJT04nKTtcbnZhciBTRUxGX0NBTkNFTExBVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNFTEZfQ0FOQ0VMTEFUSU9OID0gc3ltKCdTRUxGX0NBTkNFTExBVElPTicpO1xudmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdjtcbiAgfTtcbn07XG52YXIga1RydWUgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rVHJ1ZSA9IGtvbnN0KHRydWUpO1xudmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcbnZhciBub29wID0gZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xudmFyIGlkZW50ID0gZXhwb3J0cy5pZGVudCA9IGZ1bmN0aW9uIGlkZW50KHYpIHtcbiAgcmV0dXJuIHY7XG59O1xuXG5mdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuICBpZiAoIXByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0IGNoZWNrJywgZXJyb3IpO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093bihvYmplY3QsIHByb3BlcnR5KSB7XG4gIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG59XG5cbnZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG4gIHVuZGVmOiBmdW5jdGlvbiB1bmRlZih2KSB7XG4gICAgcmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkO1xuICB9LFxuICBub3RVbmRlZjogZnVuY3Rpb24gbm90VW5kZWYodikge1xuICAgIHJldHVybiB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgZnVuYzogZnVuY3Rpb24gZnVuYyhmKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmID09PSAnZnVuY3Rpb24nO1xuICB9LFxuICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcihuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJztcbiAgfSxcbiAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIGFycmF5OiBBcnJheS5pc0FycmF5LFxuICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG4gIH0sXG4gIHByb21pc2U6IGZ1bmN0aW9uIHByb21pc2UocCkge1xuICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcbiAgfSxcbiAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG4gIH0sXG4gIGl0ZXJhYmxlOiBmdW5jdGlvbiBpdGVyYWJsZShpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuICB9LFxuICB0YXNrOiBmdW5jdGlvbiB0YXNrKHQpIHtcbiAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuICB9LFxuICBvYnNlcnZhYmxlOiBmdW5jdGlvbiBvYnNlcnZhYmxlKG9iKSB7XG4gICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcbiAgfSxcbiAgYnVmZmVyOiBmdW5jdGlvbiBidWZmZXIoYnVmKSB7XG4gICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuICB9LFxuICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKHBhdCkge1xuICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuICB9LFxuICBjaGFubmVsOiBmdW5jdGlvbiBjaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG4gIH0sXG4gIGhlbHBlcjogZnVuY3Rpb24gaGVscGVyKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG4gIH0sXG4gIHN0cmluZ2FibGVGdW5jOiBmdW5jdGlvbiBzdHJpbmdhYmxlRnVuYyhmKSB7XG4gICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuICB9XG59O1xuXG52YXIgb2JqZWN0ID0gZXhwb3J0cy5vYmplY3QgPSB7XG4gIGFzc2lnbjogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChoYXNPd24oc291cmNlLCBpKSkge1xuICAgICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbnZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG4gIGZyb206IGZ1bmN0aW9uIGZyb20ob2JqKSB7XG4gICAgdmFyIGFyciA9IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duKG9iaiwgaSkpIHtcbiAgICAgICAgYXJyW2ldID0gb2JqW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZlcnJlZCgpIHtcbiAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZGVmLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuICBkZWYucHJvbWlzZSA9IHByb21pc2U7XG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuICB2YXIgdGltZW91dElkID0gdm9pZCAwO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh2YWwpO1xuICAgIH0sIG1zKTtcbiAgfSk7XG5cbiAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgfTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1Rhc2soKSB7XG4gIHZhciBfcmVmO1xuXG4gIHZhciBydW5uaW5nID0gdHJ1ZTtcbiAgdmFyIF9yZXN1bHQgPSB2b2lkIDAsXG4gICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cbiAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltUQVNLXSA9IHRydWUsIF9yZWYuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgIHJldHVybiBydW5uaW5nO1xuICB9LCBfcmVmLnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gX3Jlc3VsdDtcbiAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgIHJldHVybiBfZXJyb3I7XG4gIH0sIF9yZWYuc2V0UnVubmluZyA9IGZ1bmN0aW9uIHNldFJ1bm5pbmcoYikge1xuICAgIHJldHVybiBydW5uaW5nID0gYjtcbiAgfSwgX3JlZi5zZXRSZXN1bHQgPSBmdW5jdGlvbiBzZXRSZXN1bHQocikge1xuICAgIHJldHVybiBfcmVzdWx0ID0gcjtcbiAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcbiAgICByZXR1cm4gX2Vycm9yID0gZTtcbiAgfSwgX3JlZjtcbn1cblxuZnVuY3Rpb24gYXV0b0luYygpIHtcbiAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKytzZWVkO1xuICB9O1xufVxuXG52YXIgdWlkID0gLyojX19QVVJFX18qL2V4cG9ydHMudWlkID0gYXV0b0luYygpO1xuXG52YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuICB0aHJvdyBlcnI7XG59O1xudmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xufTtcbmZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG4gIHZhciB0aHJvID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBrVGhyb3c7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXG4gIHZhciBpdGVyYXRvciA9IHsgbmFtZTogbmFtZSwgbmV4dDogbmV4dCwgdGhyb3c6IHRocm8sIHJldHVybjoga1JldHVybiB9O1xuXG4gIGlmIChpc0hlbHBlcikge1xuICAgIGl0ZXJhdG9yW0hFTFBFUl0gPSB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbi8qKlxuICBQcmludCBlcnJvciBpbiBhIHVzZWZ1bCB3YXkgd2hldGhlciBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAgKHdpdGggZXhwYW5kYWJsZSBlcnJvciBzdGFjayB0cmFjZXMpLCBvciBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnRcbiAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuICoqL1xuZnVuY3Rpb24gbG9nKGxldmVsLCBtZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc29sZS5sb2coJ3JlZHV4LXNhZ2EgJyArIGxldmVsICsgJzogJyArIG1lc3NhZ2UgKyAnXFxuJyArIChlcnJvciAmJiBlcnJvci5zdGFjayB8fCBlcnJvcikpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXByZWNhdGUoZm4sIGRlcHJlY2F0aW9uV2FybmluZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcbiAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG52YXIgdXBkYXRlSW5jZW50aXZlID0gZXhwb3J0cy51cGRhdGVJbmNlbnRpdmUgPSBmdW5jdGlvbiB1cGRhdGVJbmNlbnRpdmUoZGVwcmVjYXRlZCwgcHJlZmVycmVkKSB7XG4gIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG59O1xuXG52YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ1xcbiAgcmVkdXgtc2FnYTogRXJyb3IgY2hlY2tpbmcgaG9va3MgZGV0ZWN0ZWQgYW4gaW5jb25zaXN0ZW50IHN0YXRlLiBUaGlzIGlzIGxpa2VseSBhIGJ1Z1xcbiAgaW4gcmVkdXgtc2FnYSBjb2RlIGFuZCBub3QgeW91cnMuIFRoYW5rcyBmb3IgcmVwb3J0aW5nIHRoaXMgaW4gdGhlIHByb2plY3RcXCdzIGdpdGh1YiByZXBvLlxcbiAgRXJyb3I6ICcgKyBlcnIgKyAnXFxuJyk7XG59O1xuXG52YXIgY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBleHBvcnRzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZnVuY3Rpb24gY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcoY3R4LCBwcm9wcykge1xuICByZXR1cm4gKGN0eCA/IGN0eCArICcuJyA6ICcnKSArICdzZXRDb250ZXh0KHByb3BzKTogYXJndW1lbnQgJyArIHByb3BzICsgJyBpcyBub3QgYSBwbGFpbiBvYmplY3QnO1xufTtcblxudmFyIHdyYXBTYWdhRGlzcGF0Y2ggPSBleHBvcnRzLndyYXBTYWdhRGlzcGF0Y2ggPSBmdW5jdGlvbiB3cmFwU2FnYURpc3BhdGNoKGRpc3BhdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhY3Rpb24sIFNBR0FfQUNUSU9OLCB7IHZhbHVlOiB0cnVlIH0pKTtcbiAgfTtcbn07XG5cbnZhciBjbG9uZWFibGVHZW5lcmF0b3IgPSBleHBvcnRzLmNsb25lYWJsZUdlbmVyYXRvciA9IGZ1bmN0aW9uIGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGhpc3RvcnkgPSBbXTtcbiAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcbiAgICAgICAgcmV0dXJuIGdlbi5uZXh0KGFyZyk7XG4gICAgICB9LFxuICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgICB2YXIgY2xvbmVkR2VuID0gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmVkR2VuO1xuICAgICAgfSxcbiAgICAgIHJldHVybjogZnVuY3Rpb24gX3JldHVybih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZ2VuLnJldHVybih2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgdGhyb3c6IGZ1bmN0aW9uIF90aHJvdyhleGNlcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdlbi50aHJvdyhleGNlcHRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVEFTS19DQU5DRUwgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gcHJvYztcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxuZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblxudmFyIE5PVF9JVEVSQVRPUl9FUlJPUiA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gJ3Byb2MgZmlyc3QgYXJndW1lbnQgKFNhZ2EgZnVuY3Rpb24gcmVzdWx0KSBtdXN0IGJlIGFuIGl0ZXJhdG9yJztcblxudmFyIENIQU5ORUxfRU5EID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IHtcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbiAgfVxufTtcbnZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9UQVNLX0NBTkNFTCc7XG4gIH1cbn07XG5cbnZhciBtYXRjaGVycyA9IHtcbiAgd2lsZGNhcmQ6IGZ1bmN0aW9uIHdpbGRjYXJkKCkge1xuICAgIHJldHVybiBfdXRpbHMua1RydWU7XG4gIH0sXG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIF9kZWZhdWx0KHBhdHRlcm4pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXR0ZXJuKSkgPT09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcbiAgICB9IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gU3RyaW5nKHBhdHRlcm4pO1xuICAgIH07XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbiBhcnJheShwYXR0ZXJucykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBwYXR0ZXJucy5zb21lKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVyKHApKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0sXG4gIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gX3ByZWRpY2F0ZShpbnB1dCk7XG4gICAgfTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWF0Y2hlcihwYXR0ZXJuKSB7XG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcbn1cblxuLyoqXG4gIFVzZWQgdG8gdHJhY2sgYSBwYXJlbnQgdGFzayBhbmQgaXRzIGZvcmtzXG4gIEluIHRoZSBuZXcgZm9yayBtb2RlbCwgZm9ya2VkIHRhc2tzIGFyZSBhdHRhY2hlZCBieSBkZWZhdWx0IHRvIHRoZWlyIHBhcmVudFxuICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuICBtYWluIHRhc2sgaXMgdGhlIG1haW4gZmxvdyBvZiB0aGUgY3VycmVudCBHZW5lcmF0b3IsIHRoZSBwYXJlbnQgdGFza3MgaXMgdGhlXG4gIGFnZ3JlZ2F0aW9uIG9mIHRoZSBtYWluIHRhc2tzICsgYWxsIGl0cyBmb3JrZWQgdGFza3MuXG4gIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG4gIGxpbmVhciBleGVjdXRpb24gdHJlZSBpbiBzZXF1ZW50aWFsIChub24gcGFyYWxsZWwpIHByb2dyYW1taW5nKVxuXG4gIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuICAtIEl0IGNvbXBsZXRlcyBpZiBhbGwgaXRzIGZvcmtzIGVpdGhlciBjb21wbGV0ZSBvciBhbGwgY2FuY2VsbGVkXG4gIC0gSWYgaXQncyBjYW5jZWxsZWQsIGFsbCBmb3JrcyBhcmUgY2FuY2VsbGVkIGFzIHdlbGxcbiAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuICAtIElmIGl0IGNvbXBsZXRlcywgdGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgb25lIHJldHVybmVkIGJ5IHRoZSBtYWluIHRhc2tcbioqL1xuZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuICB2YXIgdGFza3MgPSBbXSxcbiAgICAgIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuICBhZGRUYXNrKG1haW5UYXNrKTtcblxuICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcbiAgICBjYW5jZWxBbGwoKTtcbiAgICBjYihlcnIsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFzayh0YXNrKSB7XG4gICAgdGFza3MucHVzaCh0YXNrKTtcbiAgICB0YXNrLmNvbnQgPSBmdW5jdGlvbiAocmVzLCBpc0Vycikge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG4gICAgICB0YXNrLmNvbnQgPSBfdXRpbHMubm9vcDtcbiAgICAgIGlmIChpc0Vycikge1xuICAgICAgICBhYm9ydChyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2sgPT09IG1haW5UYXNrKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyB0YXNrLmNvbnQuY2FuY2VsID0gdGFzay5jYW5jZWxcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcbiAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgdGFza3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgdC5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICB0LmNhbmNlbCgpO1xuICAgIH0pO1xuICAgIHRhc2tzID0gW107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZFRhc2s6IGFkZFRhc2ssXG4gICAgY2FuY2VsQWxsOiBjYW5jZWxBbGwsXG4gICAgYWJvcnQ6IGFib3J0LFxuICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcbiAgICAgIHJldHVybiB0YXNrcztcbiAgICB9LFxuICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuICAgICAgcmV0dXJuIHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYXNrSXRlcmF0b3IoX3JlZikge1xuICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcbiAgICAgIGZuID0gX3JlZi5mbixcbiAgICAgIGFyZ3MgPSBfcmVmLmFyZ3M7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihmbikpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTIgYW5kICM0NDFcbiAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGVycm9yID0gdm9pZCAwO1xuICB0cnkge1xuICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvciA9IGVycjtcbiAgfVxuXG4gIC8vIGkuZS4gYSBnZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJucyBhbiBpdGVyYXRvclxuICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gZG8gbm90IGJ1YmJsZSB1cCBzeW5jaHJvbm91cyBmYWlsdXJlcyBmb3IgZGV0YWNoZWQgZm9ya3NcbiAgLy8gaW5zdGVhZCBjcmVhdGUgYSBmYWlsZWQgdGFzay4gU2VlICMxNTIgYW5kICM0NDFcbiAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSkgOiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYyA9IHZvaWQgMDtcbiAgICB2YXIgZWZmID0geyBkb25lOiBmYWxzZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgIHZhciByZXQgPSBmdW5jdGlvbiByZXQodmFsdWUpIHtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgIGlmICghcGMpIHtcbiAgICAgICAgcGMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZWZmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJldChhcmcpO1xuICAgICAgfVxuICAgIH07XG4gIH0oKSk7XG59XG5cbnZhciB3cmFwSGVscGVyID0gZnVuY3Rpb24gd3JhcEhlbHBlcihoZWxwZXIpIHtcbiAgcmV0dXJuIHsgZm46IGhlbHBlciB9O1xufTtcblxuZnVuY3Rpb24gcHJvYyhpdGVyYXRvcikge1xuICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF91dGlscy5ub29wO1xuICB9O1xuICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuICB2YXIgZ2V0U3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IF91dGlscy5ub29wO1xuICB2YXIgcGFyZW50Q29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcbiAgdmFyIHBhcmVudEVmZmVjdElkID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiAwO1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogJ2Fub255bW91cyc7XG4gIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PVF9JVEVSQVRPUl9FUlJPUik7XG5cbiAgdmFyIGVmZmVjdHNTdHJpbmcgPSAnWy4uLmVmZmVjdHNdJztcbiAgdmFyIHJ1blBhcmFsbGVsRWZmZWN0ID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHJ1bkFsbEVmZmVjdCwgKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKGVmZmVjdHNTdHJpbmcsICdhbGwoJyArIGVmZmVjdHNTdHJpbmcgKyAnKScpKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG4gIHZhciBsb2cgPSBsb2dnZXIgfHwgX3V0aWxzLmxvZztcbiAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBlcnIuc2FnYVN0YWNrO1xuXG4gICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuICAgICAgbWVzc2FnZSA9IGVyci5zdGFjay5zcGxpdCgnXFxuJylbMF0uaW5kZXhPZihlcnIubWVzc2FnZSkgIT09IC0xID8gZXJyLnN0YWNrIDogJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UgKyAnXFxuJyArIGVyci5zdGFjaztcbiAgICB9XG5cbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0ICcgKyBuYW1lLCBtZXNzYWdlIHx8IGVyci5tZXNzYWdlIHx8IGVycik7XG4gIH07XG4gIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG4gIHZhciB0YXNrQ29udGV4dCA9IE9iamVjdC5jcmVhdGUocGFyZW50Q29udGV4dCk7XG4gIC8qKlxuICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG4gICAgRWFjaCB0aW1lIHRoZSBnZW5lcmF0b3IgcHJvZ3Jlc3Nlcy4gY2FsbGluZyBydW5FZmZlY3Qgd2lsbCBzZXQgYSBuZXcgdmFsdWVcbiAgICBvbiBpdC4gSXQgYWxsb3dzIHByb3BhZ2F0aW5nIGNhbmNlbGxhdGlvbiB0byBjaGlsZCBlZmZlY3RzXG4gICoqL1xuICBuZXh0LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gIC8qKlxuICAgIENyZWF0ZXMgYSBuZXcgdGFzayBkZXNjcmlwdG9yIGZvciB0aGlzIGdlbmVyYXRvciwgV2UnbGwgYWxzbyBjcmVhdGUgYSBtYWluIHRhc2tcbiAgICB0byB0cmFjayB0aGUgbWFpbiBmbG93IChiZXNpZGVzIG90aGVyIGZvcmtlZCB0YXNrcylcbiAgKiovXG4gIHZhciB0YXNrID0gbmV3VGFzayhwYXJlbnRFZmZlY3RJZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpO1xuICB2YXIgbWFpblRhc2sgPSB7IG5hbWU6IG5hbWUsIGNhbmNlbDogY2FuY2VsTWFpbiwgaXNSdW5uaW5nOiB0cnVlIH07XG4gIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cbiAgLyoqXG4gICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWxNYWluKCkge1xuICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICBuZXh0KFRBU0tfQ0FOQ0VMKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBUaGlzIG1heSBiZSBjYWxsZWQgYnkgYSBwYXJlbnQgZ2VuZXJhdG9yIHRvIHRyaWdnZXIvcHJvcGFnYXRlIGNhbmNlbGxhdGlvblxuICAgIGNhbmNlbCBhbGwgcGVuZGluZyB0YXNrcyAoaW5jbHVkaW5nIHRoZSBtYWluIHRhc2spLCB0aGVuIGVuZCB0aGUgY3VycmVudCB0YXNrLlxuICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuICAgIEl0J3MgYWxzbyBwcm9wYWdhdGVkIHRvIGFsbCBqb2luZXJzIG9mIHRoaXMgdGFzayBhbmQgdGhlaXIgZXhlY3V0aW9uIHRyZWUvam9pbmVyc1xuICAgICBDYW5jZWxsYXRpb24gaXMgbm9vcCBmb3IgdGVybWluYXRlZC9DYW5jZWxsZWQgdGFza3MgdGFza3NcbiAgKiovXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAvKipcbiAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG4gICAgICBUYXNrcyBjYW4gYmUgQ2FuY2VsbGVkIGJ1dCBzdGlsbCBSdW5uaW5nXG4gICAgKiovXG4gICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuICAgICAgaXRlcmF0b3IuX2lzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIHRhc2tRdWV1ZS5jYW5jZWxBbGwoKTtcbiAgICAgIC8qKlxuICAgICAgICBFbmRpbmcgd2l0aCBhIE5ldmVyIHJlc3VsdCB3aWxsIHByb3BhZ2F0ZSB0aGUgQ2FuY2VsbGF0aW9uIHRvIGFsbCBqb2luZXJzXG4gICAgICAqKi9cbiAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgIGF0dGFjaGVzIGNhbmNlbGxhdGlvbiBsb2dpYyB0byB0aGlzIHRhc2sncyBjb250aW51YXRpb25cbiAgICB0aGlzIHdpbGwgcGVybWl0IGNhbmNlbGxhdGlvbiB0byBwcm9wYWdhdGUgZG93biB0aGUgY2FsbCBjaGFpblxuICAqKi9cbiAgY29udCAmJiAoY29udC5jYW5jZWwgPSBjYW5jZWwpO1xuXG4gIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcbiAgaXRlcmF0b3IuX2lzUnVubmluZyA9IHRydWU7XG5cbiAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuICBuZXh0KCk7XG5cbiAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG4gIHJldHVybiB0YXNrO1xuXG4gIC8qKlxuICAgIFRoaXMgaXMgdGhlIGdlbmVyYXRvciBkcml2ZXJcbiAgICBJdCdzIGEgcmVjdXJzaXZlIGFzeW5jL2NvbnRpbnVhdGlvbiBmdW5jdGlvbiB3aGljaCBjYWxscyBpdHNlbGZcbiAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG4gICoqL1xuICBmdW5jdGlvbiBuZXh0KGFyZywgaXNFcnIpIHtcbiAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3JvbmdcbiAgICBpZiAoIW1haW5UYXNrLmlzUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gcmVzdW1lIGFuIGFscmVhZHkgZmluaXNoZWQgZ2VuZXJhdG9yJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IudGhyb3coYXJnKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAvKipcbiAgICAgICAgICBnZXR0aW5nIFRBU0tfQ0FOQ0VMIGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgbWFpbiB0YXNrXG4gICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcbiAgICAgICAgICAgLSBCeSBjYW5jZWxsaW5nIHRoZSBwYXJlbnQgdGFzayBtYW51YWxseVxuICAgICAgICAgIC0gQnkgam9pbmluZyBhIENhbmNlbGxlZCB0YXNrXG4gICAgICAgICoqL1xuICAgICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG4gICAgICAgICoqL1xuICAgICAgICBuZXh0LmNhbmNlbCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICBJZiB0aGlzIEdlbmVyYXRvciBoYXMgYSBgcmV0dXJuYCBtZXRob2QgdGhlbiBpbnZva2VzIGl0XG4gICAgICAgICAgVGhpcyB3aWxsIGp1bXAgdG8gdGhlIGZpbmFsbHkgYmxvY2tcbiAgICAgICAgKiovXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oVEFTS19DQU5DRUwpIDogeyBkb25lOiB0cnVlLCB2YWx1ZTogVEFTS19DQU5DRUwgfTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBDSEFOTkVMX0VORCkge1xuICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcbiAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybigpIDogeyBkb25lOiB0cnVlIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcbiAgICAgICAgcnVuRWZmZWN0KHJlc3VsdC52YWx1ZSwgcGFyZW50RWZmZWN0SWQsICcnLCBuZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgIFRoaXMgR2VuZXJhdG9yIGhhcyBlbmRlZCwgdGVybWluYXRlIHRoZSBtYWluIHRhc2sgYW5kIG5vdGlmeSB0aGUgZm9yayBxdWV1ZVxuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuICAgICAgICBtYWluVGFzay5jb250ICYmIG1haW5UYXNrLmNvbnQocmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKG1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIG1haW5UYXNrLmNvbnQoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG4gICAgaXRlcmF0b3IuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHN0ZENoYW5uZWwuY2xvc2UoKTtcbiAgICBpZiAoIWlzRXJyKSB7XG4gICAgICBpdGVyYXRvci5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCAnc2FnYVN0YWNrJywge1xuICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRhc2suY29udCkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgJiYgb25FcnJvcikge1xuICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dFcnJvcihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5fZXJyb3IgPSByZXN1bHQ7XG4gICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVqZWN0KHJlc3VsdCk7XG4gICAgfVxuICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG4gICAgdGFzay5qb2luZXJzLmZvckVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgIHJldHVybiBqLmNiKHJlc3VsdCwgaXNFcnIpO1xuICAgIH0pO1xuICAgIHRhc2suam9pbmVycyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5FZmZlY3QoZWZmZWN0LCBwYXJlbnRFZmZlY3RJZCkge1xuICAgIHZhciBsYWJlbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXG4gICAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG4gICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cbiAgICAvKipcbiAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG4gICAgICBXZSBjYW4ndCBjYW5jZWwgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG4gICAgICBBbmQgV2UgY2FuJ3QgY29tcGxldGUgYW4gYWxyZWFkeSBjYW5jZWxsZWQgZWZmZWN0SWRcbiAgICAqKi9cbiAgICB2YXIgZWZmZWN0U2V0dGxlZCA9IHZvaWQgMDtcblxuICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG4gICAgZnVuY3Rpb24gY3VyckNiKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICBjYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcbiAgICAgIGlmIChzYWdhTW9uaXRvcikge1xuICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG4gICAgICB9XG4gICAgICBjYihyZXMsIGlzRXJyKTtcbiAgICB9XG4gICAgLy8gdHJhY2tzIGRvd24gdGhlIGN1cnJlbnQgY2FuY2VsXG4gICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gICAgLy8gc2V0dXAgY2FuY2VsbGF0aW9uIGxvZ2ljIG9uIHRoZSBwYXJlbnQgY2JcbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcbiAgICAgIC8qKlxuICAgICAgICBwcm9wYWdhdGVzIGNhbmNlbCBkb3dud2FyZFxuICAgICAgICBjYXRjaCB1bmNhdWdodCBjYW5jZWxsYXRpb25zIGVycm9yczsgc2luY2Ugd2UgY2FuIG5vIGxvbmdlciBjYWxsIHRoZSBjb21wbGV0aW9uXG4gICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG4gICAgICAqKi9cbiAgICAgIHRyeSB7XG4gICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsb2dFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXG4gICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgIGVhY2ggZWZmZWN0IHJ1bm5lciBtdXN0IGF0dGFjaCBpdHMgb3duIGxvZ2ljIG9mIGNhbmNlbGxhdGlvbiB0byB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgIGl0IGFsbG93cyB0aGlzIGdlbmVyYXRvciB0byBwcm9wYWdhdGUgY2FuY2VsbGF0aW9uIGRvd253YXJkLlxuICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cbiAgICAgIEFuZCB0aGUgc2V0dXAgbXVzdCBvY2N1ciBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2tcbiAgICAgICBUaGlzIGlzIGEgc29ydCBvZiBpbnZlcnNpb24gb2YgY29udHJvbDogY2FsbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgcmVzcG9uc2libGVcbiAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuICAgICAgYXJlIHJlc3BvbnNpYmxlIGZvciBhYm9ydGluZyB0aGUgY3VycmVudCBmbG93IGJ5IGNhbGxpbmcgdGhlIGF0dGFjaGVkIGNhbmNlbCBmdW5jdGlvblxuICAgICAgIExpYnJhcnkgdXNlcnMgY2FuIGF0dGFjaCB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHByb21pc2VzIGJ5IGRlZmluaW5nIGFcbiAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcbiAgICAgIEFUVEVOVElPTiEgY2FsbGluZyBjYW5jZWwgbXVzdCBoYXZlIG5vIGVmZmVjdCBvbiBhbiBhbHJlYWR5IGNvbXBsZXRlZCBvciBjYW5jZWxsZWQgZWZmZWN0XG4gICAgKiovXG4gICAgdmFyIGRhdGEgPSB2b2lkIDA7XG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgcmV0dXJuIChcbiAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3RcbiAgICAgIF91dGlscy5pcy5wcm9taXNlKGVmZmVjdCkgPyByZXNvbHZlUHJvbWlzZShlZmZlY3QsIGN1cnJDYikgOiBfdXRpbHMuaXMuaGVscGVyKGVmZmVjdCkgPyBydW5Gb3JrRWZmZWN0KHdyYXBIZWxwZXIoZWZmZWN0KSwgZWZmZWN0SWQsIGN1cnJDYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IoZWZmZWN0KSA/IHJlc29sdmVJdGVyYXRvcihlZmZlY3QsIGVmZmVjdElkLCBuYW1lLCBjdXJyQ2IpXG5cbiAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcbiAgICAgIDogX3V0aWxzLmlzLmFycmF5KGVmZmVjdCkgPyBydW5QYXJhbGxlbEVmZmVjdChlZmZlY3QsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QudGFrZShlZmZlY3QpKSA/IHJ1blRha2VFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnB1dChlZmZlY3QpKSA/IHJ1blB1dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWxsKGVmZmVjdCkpID8gcnVuQWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucmFjZShlZmZlY3QpKSA/IHJ1blJhY2VFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYWxsKGVmZmVjdCkpID8gcnVuQ2FsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNwcyhlZmZlY3QpKSA/IHJ1bkNQU0VmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZm9yayhlZmZlY3QpKSA/IHJ1bkZvcmtFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5qb2luKGVmZmVjdCkpID8gcnVuSm9pbkVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsKGVmZmVjdCkpID8gcnVuQ2FuY2VsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZWxlY3QoZWZmZWN0KSkgPyBydW5TZWxlY3RFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFjdGlvbkNoYW5uZWwoZWZmZWN0KSkgPyBydW5DaGFubmVsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mbHVzaChlZmZlY3QpKSA/IHJ1bkZsdXNoRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWxsZWQoZWZmZWN0KSkgPyBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmdldENvbnRleHQoZWZmZWN0KSkgPyBydW5HZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuU2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogLyogYW55dGhpbmcgZWxzZSByZXR1cm5lZCBhcyBpcyAqL2N1cnJDYihlZmZlY3QpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGNiKSB7XG4gICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuICAgIGlmIChfdXRpbHMuaXMuZnVuYyhjYW5jZWxQcm9taXNlKSkge1xuICAgICAgY2IuY2FuY2VsID0gY2FuY2VsUHJvbWlzZTtcbiAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG4gICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmFib3J0KCk7XG4gICAgICB9O1xuICAgICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgZm9yIHRoZSBmZXRjaCBBUEksIHdoZW5ldmVyIHRoZXkgZ2V0IGFyb3VuZCB0b1xuICAgICAgLy8gYWRkaW5nIGNhbmNlbCBzdXBwb3J0XG4gICAgfVxuICAgIHByb21pc2UudGhlbihjYiwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcbiAgICBwcm9jKGl0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBuYW1lLCBjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5UYWtlRWZmZWN0KF9yZWYyLCBjYikge1xuICAgIHZhciBjaGFubmVsID0gX3JlZjIuY2hhbm5lbCxcbiAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG4gICAgICAgIG1heWJlID0gX3JlZjIubWF5YmU7XG5cbiAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuICAgIHZhciB0YWtlQ2IgPSBmdW5jdGlvbiB0YWtlQ2IoaW5wKSB7XG4gICAgICByZXR1cm4gaW5wIGluc3RhbmNlb2YgRXJyb3IgPyBjYihpbnAsIHRydWUpIDogKDAsIF9jaGFubmVsLmlzRW5kKShpbnApICYmICFtYXliZSA/IGNiKENIQU5ORUxfRU5EKSA6IGNiKGlucCk7XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC50YWtlKHRha2VDYiwgbWF0Y2hlcihwYXR0ZXJuKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyLCB0cnVlKTtcbiAgICB9XG4gICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYzLmNoYW5uZWwsXG4gICAgICAgIGFjdGlvbiA9IF9yZWYzLmFjdGlvbixcbiAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cbiAgICAvKipcbiAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG4gICAgICBUaGUgcHV0IHdpbGwgYmUgZXhlY3V0ZWQgYXRvbWljYWxseS4gaWUgbmVzdGVkIHB1dHMgd2lsbCBleGVjdXRlIGFmdGVyXG4gICAgICB0aGlzIHB1dCBoYXMgdGVybWluYXRlZC5cbiAgICAqKi9cbiAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gKGNoYW5uZWwgPyBjaGFubmVsLnB1dCA6IGRpc3BhdGNoKShhY3Rpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG4gICAgICAgIGlmIChjaGFubmVsIHx8IHJlc29sdmUpIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUgJiYgX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYihyZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFB1dCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5DYWxsRWZmZWN0KF9yZWY0LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjQuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNC5hcmdzO1xuXG4gICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpID8gcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSA/IHJlc29sdmVJdGVyYXRvcihyZXN1bHQsIGVmZmVjdElkLCBmbi5uYW1lLCBjYikgOiBjYihyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ1BTRWZmZWN0KF9yZWY1LCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNS5mbixcbiAgICAgICAgYXJncyA9IF9yZWY1LmFyZ3M7XG5cbiAgICAvLyBDUFMgKGllIG5vZGUgc3R5bGUgZnVuY3Rpb25zKSBjYW4gZGVmaW5lIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWNcbiAgICAvLyBieSBzZXR0aW5nIGNhbmNlbCBmaWVsZCBvbiB0aGUgY2JcblxuICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuICAgIHRyeSB7XG4gICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuICAgICAgICByZXR1cm4gX3V0aWxzLmlzLnVuZGVmKGVycikgPyBjYihyZXMpIDogY2IoZXJyLCB0cnVlKTtcbiAgICAgIH07XG4gICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuICAgICAgaWYgKGNwc0NiLmNhbmNlbCkge1xuICAgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZvcmtFZmZlY3QoX3JlZjYsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNi5mbixcbiAgICAgICAgYXJncyA9IF9yZWY2LmFyZ3MsXG4gICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cbiAgICB2YXIgdGFza0l0ZXJhdG9yID0gY3JlYXRlVGFza0l0ZXJhdG9yKHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICgwLCBfc2NoZWR1bGVyLnN1c3BlbmQpKCk7XG4gICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXG4gICAgICBpZiAoZGV0YWNoZWQpIHtcbiAgICAgICAgY2IoX3Rhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2tJdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrSXRlcmF0b3IuX2Vycm9yKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcbiAgICB9XG4gICAgLy8gRm9yayBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5Kb2luRWZmZWN0KHQsIGNiKSB7XG4gICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHZhciBqb2luZXIgPSB7IHRhc2s6IHRhc2ssIGNiOiBjYiB9O1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcbiAgICAgIH07XG4gICAgICB0LmpvaW5lcnMucHVzaChqb2luZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LmlzQWJvcnRlZCgpID8gY2IodC5lcnJvcigpLCB0cnVlKSA6IGNiKHQucmVzdWx0KCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbEVmZmVjdCh0YXNrVG9DYW5jZWwsIGNiKSB7XG4gICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG4gICAgICB0YXNrVG9DYW5jZWwgPSB0YXNrO1xuICAgIH1cbiAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG4gICAgICB0YXNrVG9DYW5jZWwuY2FuY2VsKCk7XG4gICAgfVxuICAgIGNiKCk7XG4gICAgLy8gY2FuY2VsIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkFsbEVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXG4gICAgaWYgKCFrZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdIDoge30pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZWRDb3VudCA9IDA7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tFZmZlY3RFbmQoKSB7XG4gICAgICBpZiAoY29tcGxldGVkQ291bnQgPT09IGtleXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IF91dGlscy5hcnJheS5mcm9tKF9leHRlbmRzKHt9LCByZXN1bHRzLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0VyciB8fCAoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgfHwgcmVzID09PSBDSEFOTkVMX0VORCB8fCByZXMgPT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG4gICAgICAgICAgY2hlY2tFZmZlY3RFbmQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbXBsZXRlZCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blJhY2VFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgICAgLy8gUmFjZSBBdXRvIGNhbmNlbGxhdGlvblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoISgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSAmJiByZXMgIT09IENIQU5ORUxfRU5EICYmIHJlcyAhPT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgICB2YXIgX3Jlc3BvbnNlO1xuXG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuICAgICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdLnNsaWNlLmNhbGwoX2V4dGVuZHMoe30sIHJlc3BvbnNlLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcbiAgICB9KTtcblxuICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blNlbGVjdEVmZmVjdChfcmVmNywgY2IpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBfcmVmNy5zZWxlY3RvcixcbiAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIGNiKHN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNoYW5uZWxFZmZlY3QoX3JlZjgsIGNiKSB7XG4gICAgdmFyIHBhdHRlcm4gPSBfcmVmOC5wYXR0ZXJuLFxuICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cbiAgICB2YXIgbWF0Y2ggPSBtYXRjaGVyKHBhdHRlcm4pO1xuICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIGNiKCgwLCBfY2hhbm5lbC5ldmVudENoYW5uZWwpKHN1YnNjcmliZSwgYnVmZmVyIHx8IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKSwgbWF0Y2gpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjYikge1xuICAgIGNiKCEhbWFpblRhc2suaXNDYW5jZWxsZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRmx1c2hFZmZlY3QoY2hhbm5lbCwgY2IpIHtcbiAgICBjaGFubmVsLmZsdXNoKGNiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcbiAgICBjYih0YXNrQ29udGV4dFtwcm9wXSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZXRDb250ZXh0RWZmZWN0KHByb3BzLCBjYikge1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG4gICAgY2IoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG4gICAgdmFyIF9kb25lLCBfcmVmOSwgX211dGF0b3JNYXA7XG5cbiAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuICAgIHJldHVybiBfcmVmOSA9IHt9LCBfcmVmOVtfdXRpbHMuVEFTS10gPSB0cnVlLCBfcmVmOS5pZCA9IGlkLCBfcmVmOS5uYW1lID0gbmFtZSwgX2RvbmUgPSAnZG9uZScsIF9tdXRhdG9yTWFwID0ge30sIF9tdXRhdG9yTWFwW19kb25lXSA9IF9tdXRhdG9yTWFwW19kb25lXSB8fCB7fSwgX211dGF0b3JNYXBbX2RvbmVdLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpdGVyYXRvci5fZGVmZXJyZWRFbmQpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZiA9ICgwLCBfdXRpbHMuZGVmZXJyZWQpKCk7XG4gICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcbiAgICAgICAgaWYgKCFpdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgaXRlcmF0b3IuX2Vycm9yID8gZGVmLnJlamVjdChpdGVyYXRvci5fZXJyb3IpIDogZGVmLnJlc29sdmUoaXRlcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgfVxuICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc1J1bm5pbmc7XG4gICAgfSwgX3JlZjkuaXNDYW5jZWxsZWQgPSBmdW5jdGlvbiBpc0NhbmNlbGxlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG4gICAgfSwgX3JlZjkuaXNBYm9ydGVkID0gZnVuY3Rpb24gaXNBYm9ydGVkKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0Fib3J0ZWQ7XG4gICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9yZXN1bHQ7XG4gICAgfSwgX3JlZjkuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG4gICAgfSwgX3JlZjkuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgndGFzaycsIHByb3BzKSk7XG4gICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIH0sIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhfcmVmOSwgX211dGF0b3JNYXApLCBfcmVmOTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFzYXAgPSBhc2FwO1xuZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbnZhciBxdWV1ZSA9IFtdO1xuLyoqXG4gIFZhcmlhYmxlIHRvIGhvbGQgYSBjb3VudGluZyBzZW1hcGhvcmVcbiAgLSBJbmNyZW1lbnRpbmcgYWRkcyBhIGxvY2sgYW5kIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlIChpZiBpdCdzIG5vdFxuICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuICAtIERlY3JlbWVudGluZyByZWxlYXNlcyBhIGxvY2suIFplcm8gbG9ja3MgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS4gVGhpc1xuICAgIHRyaWdnZXJzIGZsdXNoaW5nIHRoZSBxdWV1ZWQgdGFza3MuXG4qKi9cbnZhciBzZW1hcGhvcmUgPSAwO1xuXG4vKipcbiAgRXhlY3V0ZXMgYSB0YXNrICdhdG9taWNhbGx5Jy4gVGFza3Mgc2NoZWR1bGVkIGR1cmluZyB0aGlzIGV4ZWN1dGlvbiB3aWxsIGJlIHF1ZXVlZFxuICBhbmQgZmx1c2hlZCBhZnRlciB0aGlzIHRhc2sgaGFzIGZpbmlzaGVkIChhc3N1bWluZyB0aGUgc2NoZWR1bGVyIGVuZHVwIGluIGEgcmVsZWFzZWRcbiAgc3RhdGUpLlxuKiovXG5mdW5jdGlvbiBleGVjKHRhc2spIHtcbiAgdHJ5IHtcbiAgICBzdXNwZW5kKCk7XG4gICAgdGFzaygpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2UoKTtcbiAgfVxufVxuXG4vKipcbiAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG4qKi9cbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICBxdWV1ZS5wdXNoKHRhc2spO1xuXG4gIGlmICghc2VtYXBob3JlKSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIGZsdXNoKCk7XG4gIH1cbn1cblxuLyoqXG4gIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG4gIHNjaGVkdWxlciBpcyByZWxlYXNlZC5cbioqL1xuZnVuY3Rpb24gc3VzcGVuZCgpIHtcbiAgc2VtYXBob3JlKys7XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLlxuKiovXG5mdW5jdGlvbiByZWxlYXNlKCkge1xuICBzZW1hcGhvcmUtLTtcbn1cblxuLyoqXG4gIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG4qKi9cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICByZWxlYXNlKCk7XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDA7XG4gIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuICAgIGV4ZWModGFzayk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc0VmZmVjdCA9IGV4cG9ydHMudGFrZW0gPSBleHBvcnRzLmRldGFjaCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMudGFrZSA9IHRha2U7XG5leHBvcnRzLnB1dCA9IHB1dDtcbmV4cG9ydHMuYWxsID0gYWxsO1xuZXhwb3J0cy5yYWNlID0gcmFjZTtcbmV4cG9ydHMuY2FsbCA9IGNhbGw7XG5leHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5leHBvcnRzLmNwcyA9IGNwcztcbmV4cG9ydHMuZm9yayA9IGZvcms7XG5leHBvcnRzLnNwYXduID0gc3Bhd247XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5leHBvcnRzLnNlbGVjdCA9IHNlbGVjdDtcbmV4cG9ydHMuYWN0aW9uQ2hhbm5lbCA9IGFjdGlvbkNoYW5uZWw7XG5leHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbmV4cG9ydHMuZ2V0Q29udGV4dCA9IGdldENvbnRleHQ7XG5leHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NhZ2FIZWxwZXJzJyk7XG5cbnZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG52YXIgVEFLRSA9ICdUQUtFJztcbnZhciBQVVQgPSAnUFVUJztcbnZhciBBTEwgPSAnQUxMJztcbnZhciBSQUNFID0gJ1JBQ0UnO1xudmFyIENBTEwgPSAnQ0FMTCc7XG52YXIgQ1BTID0gJ0NQUyc7XG52YXIgRk9SSyA9ICdGT1JLJztcbnZhciBKT0lOID0gJ0pPSU4nO1xudmFyIENBTkNFTCA9ICdDQU5DRUwnO1xudmFyIFNFTEVDVCA9ICdTRUxFQ1QnO1xudmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcbnZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcbnZhciBGTFVTSCA9ICdGTFVTSCc7XG52YXIgR0VUX0NPTlRFWFQgPSAnR0VUX0NPTlRFWFQnO1xudmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblxudmFyIFRFU1RfSElOVCA9ICdcXG4oSElOVDogaWYgeW91IGFyZSBnZXR0aW5nIHRoaXMgZXJyb3JzIGluIHRlc3RzLCBjb25zaWRlciB1c2luZyBjcmVhdGVNb2NrVGFzayBmcm9tIHJlZHV4LXNhZ2EvdXRpbHMpJztcblxudmFyIGVmZmVjdCA9IGZ1bmN0aW9uIGVmZmVjdCh0eXBlLCBwYXlsb2FkKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbSU9dID0gdHJ1ZSwgX3JlZlt0eXBlXSA9IHBheWxvYWQsIF9yZWY7XG59O1xuXG52YXIgZGV0YWNoID0gZXhwb3J0cy5kZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2goZWZmKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGFzRWZmZWN0LmZvcmsoZWZmKSwgX3V0aWxzLmlzLm9iamVjdCwgJ2RldGFjaChlZmYpOiBhcmd1bWVudCBtdXN0IGJlIGEgZm9yayBlZmZlY3QnKTtcbiAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbmZ1bmN0aW9uIHRha2UoKSB7XG4gIHZhciBwYXR0ZXJuT3JDaGFubmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnKic7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhcmd1bWVudHNbMF0sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IHBhdHRlcm5PckNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5wYXR0ZXJuKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IGNoYW5uZWw6IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBhcmd1bWVudCAnICsgU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCBvciBhIHZhbGlkIHBhdHRlcm4nKTtcbn1cblxudGFrZS5tYXliZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHRha2UuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxudmFyIHRha2VtID0gLyojX19QVVJFX18qL2V4cG9ydHMudGFrZW0gPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkodGFrZS5tYXliZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgndGFrZW0nLCAndGFrZS5tYXliZScpKTtcblxuZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGFjdGlvbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICAgIGFjdGlvbiA9IGNoYW5uZWw7XG4gICAgY2hhbm5lbCA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChQVVQsIHsgY2hhbm5lbDogY2hhbm5lbCwgYWN0aW9uOiBhY3Rpb24gfSk7XG59XG5cbnB1dC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5wdXQuc3luYyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkocHV0LnJlc29sdmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3B1dC5zeW5jJywgJ3B1dC5yZXNvbHZlJykpO1xuXG5mdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KEFMTCwgZWZmZWN0cyk7XG59XG5cbmZ1bmN0aW9uIHJhY2UoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KFJBQ0UsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiBnZXRGbkNhbGxEZXNjKG1ldGgsIGZuLCBhcmdzKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblxuICB2YXIgY29udGV4dCA9IG51bGw7XG4gIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG4gICAgdmFyIF9mbiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm5bMF07XG4gICAgZm4gPSBfZm5bMV07XG4gIH0gZWxzZSBpZiAoZm4uZm4pIHtcbiAgICB2YXIgX2ZuMiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG4gICAgZm4gPSBfZm4yLmZuO1xuICB9XG4gIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuICAgIGZuID0gY29udGV4dFtmbl07XG4gIH1cbiAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXG4gIHJldHVybiB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9O1xufVxuXG5mdW5jdGlvbiBjYWxsKGZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdjYWxsJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gYXBwbHkoY29udGV4dCwgZm4pIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnYXBwbHknLCB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiB9LCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGNwcyhmbikge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBmb3JrKGZuKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChGT1JLLCBnZXRGbkNhbGxEZXNjKCdmb3JrJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gc3Bhd24oZm4pIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICByZXR1cm4gZGV0YWNoKGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbZm5dLmNvbmNhdChhcmdzKSkpO1xufVxuXG5mdW5jdGlvbiBqb2luKCkge1xuICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGpvaW4odCk7XG4gICAgfSkpO1xuICB9XG4gIHZhciB0YXNrID0gdGFza3NbMF07XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnam9pbih0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICByZXR1cm4gZWZmZWN0KEpPSU4sIHRhc2spO1xufVxuXG5mdW5jdGlvbiBjYW5jZWwoKSB7XG4gIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgIHRhc2tzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gIH1cblxuICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gY2FuY2VsKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2sgfHwgX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG4gIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICBhcmdzW19rZXk3IC0gMV0gPSBhcmd1bWVudHNbX2tleTddO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvciA9IF91dGlscy5pZGVudDtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgc2VsZWN0b3IgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoU0VMRUNULCB7IHNlbGVjdG9yOiBzZWxlY3RvciwgYXJnczogYXJncyB9KTtcbn1cblxuLyoqXG4gIGNoYW5uZWwocGF0dGVybiwgW2J1ZmZlcl0pICAgID0+IGNyZWF0ZXMgYW4gZXZlbnQgY2hhbm5lbCBmb3Igc3RvcmUgYWN0aW9uc1xuKiovXG5mdW5jdGlvbiBhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwYXR0ZXJuLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sLi4uKTogYXJndW1lbnQgcGF0dGVybiBpcyB1bmRlZmluZWQnKTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50IGJ1ZmZlciBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50ICcgKyBidWZmZXIgKyAnIGlzIG5vdCBhIHZhbGlkIGJ1ZmZlcicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQUNUSU9OX0NIQU5ORUwsIHsgcGF0dGVybjogcGF0dGVybiwgYnVmZmVyOiBidWZmZXIgfSk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbGxlZCgpIHtcbiAgcmV0dXJuIGVmZmVjdChDQU5DRUxMRUQsIHt9KTtcbn1cblxuZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcbiAgcmV0dXJuIGVmZmVjdChGTFVTSCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHQocHJvcCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wLCBfdXRpbHMuaXMuc3RyaW5nLCAnZ2V0Q29udGV4dChwcm9wKTogYXJndW1lbnQgJyArIHByb3AgKyAnIGlzIG5vdCBhIHN0cmluZycpO1xuICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcbn1cblxuZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykobnVsbCwgcHJvcHMpKTtcbiAgcmV0dXJuIGVmZmVjdChTRVRfQ09OVEVYVCwgcHJvcHMpO1xufVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcbiAgICBhcmdzW19rZXk4IC0gMl0gPSBhcmd1bWVudHNbX2tleThdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VFdmVyeUhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOSA+IDIgPyBfbGVuOSAtIDIgOiAwKSwgX2tleTkgPSAyOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG4gICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjEwID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4xMCA+IDMgPyBfbGVuMTAgLSAzIDogMCksIF9rZXkxMCA9IDM7IF9rZXkxMCA8IF9sZW4xMDsgX2tleTEwKyspIHtcbiAgICBhcmdzW19rZXkxMCAtIDNdID0gYXJndW1lbnRzW19rZXkxMF07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGhyb3R0bGVIZWxwZXIsIG1zLCBwYXR0ZXJuLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbnZhciBjcmVhdGVBc0VmZmVjdFR5cGUgPSBmdW5jdGlvbiBjcmVhdGVBc0VmZmVjdFR5cGUodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuICAgIHJldHVybiBlZmZlY3QgJiYgZWZmZWN0W0lPXSAmJiBlZmZlY3RbdHlwZV07XG4gIH07XG59O1xuXG52YXIgYXNFZmZlY3QgPSBleHBvcnRzLmFzRWZmZWN0ID0ge1xuICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuICBwdXQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUFVUKSxcbiAgYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFMTCksXG4gIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG4gIGNhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FMTCksXG4gIGNwczogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDUFMpLFxuICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuICBqb2luOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEpPSU4pLFxuICBjYW5jZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMKSxcbiAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG4gIGFjdGlvbkNoYW5uZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUNUSU9OX0NIQU5ORUwpLFxuICBjYW5jZWxsZWQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMTEVEKSxcbiAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuICBnZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEdFVF9DT05URVhUKSxcbiAgc2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRVRfQ09OVEVYVClcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2lvLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXG52YXIgX3Rha2VFdmVyeSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VFdmVyeScpO1xuXG52YXIgX3Rha2VFdmVyeTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUV2ZXJ5KTtcblxudmFyIF90YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGFrZUxhdGVzdCcpO1xuXG52YXIgX3Rha2VMYXRlc3QyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VMYXRlc3QpO1xuXG52YXIgX3Rocm90dGxlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGhyb3R0bGUnKTtcblxudmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBkZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiBkZXByZWNhdGlvbldhcm5pbmcoaGVscGVyTmFtZSkge1xuICByZXR1cm4gJ2ltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYVxcJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYS9lZmZlY3RzXFwnLlxcblRoZSBsYXR0ZXIgd2lsbCBub3Qgd29yayB3aXRoIHlpZWxkKiwgYXMgaGVscGVyIGVmZmVjdHMgYXJlIHdyYXBwZWQgYXV0b21hdGljYWxseSBmb3IgeW91IGluIGZvcmsgZWZmZWN0LlxcblRoZXJlZm9yZSB5aWVsZCAnICsgaGVscGVyTmFtZSArICcgd2lsbCByZXR1cm4gdGFzayBkZXNjcmlwdG9yIHRvIHlvdXIgc2FnYSBhbmQgZXhlY3V0ZSBuZXh0IGxpbmVzIG9mIGNvZGUuJztcbn07XG5cbnZhciB0YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlRXZlcnkyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VFdmVyeScpKTtcbnZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcbnZhciB0aHJvdHRsZSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rocm90dGxlMi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0aHJvdHRsZScpKTtcblxuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gX3Rha2VMYXRlc3QyLmRlZmF1bHQ7XG5leHBvcnRzLnRocm90dGxlSGVscGVyID0gX3Rocm90dGxlMi5kZWZhdWx0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VFdmVyeTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlRXZlcnkoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUV2ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NDVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuZXhwb3J0cy5zYWZlTmFtZSA9IHNhZmVOYW1lO1xuZXhwb3J0cy5kZWZhdWx0ID0gZnNtSXRlcmF0b3I7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIGRvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbnZhciBxRW5kID0gZXhwb3J0cy5xRW5kID0ge307XG5cbmZ1bmN0aW9uIHNhZmVOYW1lKHBhdHRlcm5PckNoYW5uZWwpIHtcbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuICdjaGFubmVsJztcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuICAgIH0pKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZzbUl0ZXJhdG9yKGZzbSwgcTApIHtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdpdGVyYXRvcic7XG5cbiAgdmFyIHVwZGF0ZVN0YXRlID0gdm9pZCAwLFxuICAgICAgcU5leHQgPSBxMDtcblxuICBmdW5jdGlvbiBuZXh0KGFyZywgZXJyb3IpIHtcbiAgICBpZiAocU5leHQgPT09IHFFbmQpIHtcbiAgICAgIHJldHVybiBkb25lO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgcU5leHQgPSBxRW5kO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZVN0YXRlICYmIHVwZGF0ZVN0YXRlKGFyZyk7XG5cbiAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuICAgICAgICAgIHEgPSBfZnNtJHFOZXh0WzBdLFxuICAgICAgICAgIG91dHB1dCA9IF9mc20kcU5leHRbMV0sXG4gICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblxuICAgICAgcU5leHQgPSBxO1xuICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG4gICAgICByZXR1cm4gcU5leHQgPT09IHFFbmQgPyBkb25lIDogb3V0cHV0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikobmV4dCwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuICB9LCBuYW1lLCB0cnVlKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvZnNtSXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDc0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZW1pdHRlciA9IGVtaXR0ZXI7XG5leHBvcnRzLmNoYW5uZWwgPSBjaGFubmVsO1xuZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5leHBvcnRzLnN0ZENoYW5uZWwgPSBzdGRDaGFubmVsO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vYnVmZmVycycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xudmFyIEVORCA9IGV4cG9ydHMuRU5EID0geyB0eXBlOiBDSEFOTkVMX0VORF9UWVBFIH07XG52YXIgaXNFbmQgPSBleHBvcnRzLmlzRW5kID0gZnVuY3Rpb24gaXNFbmQoYSkge1xuICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG59O1xuXG5mdW5jdGlvbiBlbWl0dGVyKCkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG4gICAgc3Vic2NyaWJlcnMucHVzaChzdWIpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KGl0ZW0pIHtcbiAgICB2YXIgYXJyID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcnJbaV0oaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBlbWl0OiBlbWl0XG4gIH07XG59XG5cbnZhciBJTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSAnaW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGNoYW5uZWwgZmFjdG9yeSBmdW5jdGlvbic7XG52YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcbn1cblxuZnVuY3Rpb24gY2hhbm5lbCgpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpO1xuXG4gIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgdmFyIHRha2VycyA9IFtdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXG4gIGZ1bmN0aW9uIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCkge1xuICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIGEgY2xvc2VkIGNoYW5uZWwgd2l0aCBwZW5kaW5nIHRha2VycycpO1xuICAgIH1cbiAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIHBlbmRpbmcgdGFrZXJzIHdpdGggbm9uIGVtcHR5IGJ1ZmZlcicpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHB1dChpbnB1dCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaW5wdXQsIF91dGlscy5pcy5ub3RVbmRlZiwgVU5ERUZJTkVEX0lOUFVUX0VSUk9SKTtcbiAgICBpZiAoY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGFrZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRha2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuICAgICAgaWYgKCFjYltfdXRpbHMuTUFUQ0hdIHx8IGNiW191dGlscy5NQVRDSF0oaW5wdXQpKSB7XG4gICAgICAgIHRha2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybiBjYihpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGFrZShjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblxuICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoRU5EKTtcbiAgICB9IGVsc2UgaWYgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihidWZmZXIudGFrZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFrZXJzLnB1c2goY2IpO1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHRha2VycywgY2IpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaChjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7IC8vIFRPRE86IGNoZWNrIGlmIHNvbWUgbmV3IHN0YXRlIHNob3VsZCBiZSBmb3JiaWRkZW4gbm93XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwuZmx1c2gnIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNiKGJ1ZmZlci5mbHVzaCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgaWYgKCFjbG9zZWQpIHtcbiAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICBpZiAodGFrZXJzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuICAgICAgICB0YWtlcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGFycltpXShFTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiB0YWtlLFxuICAgIHB1dDogcHV0LFxuICAgIGZsdXNoOiBmbHVzaCxcbiAgICBjbG9zZTogY2xvc2UsXG4gICAgZ2V0IF9fdGFrZXJzX18oKSB7XG4gICAgICByZXR1cm4gdGFrZXJzO1xuICAgIH0sXG4gICAgZ2V0IF9fY2xvc2VkX18oKSB7XG4gICAgICByZXR1cm4gY2xvc2VkO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZXZlbnRDaGFubmVsKHN1YnNjcmliZSkge1xuICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcbiAgdmFyIG1hdGNoZXIgPSBhcmd1bWVudHNbMl07XG5cbiAgLyoqXG4gICAgc2hvdWxkIGJlIGlmKHR5cGVvZiBtYXRjaGVyICE9PSB1bmRlZmluZWQpIGluc3RlYWQ/XG4gICAgc2VlIFBSICMyNzMgZm9yIGEgYmFja2dyb3VuZCBkaXNjdXNzaW9uXG4gICoqL1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgJ0ludmFsaWQgbWF0Y2ggZnVuY3Rpb24gcGFzc2VkIHRvIGV2ZW50Q2hhbm5lbCcpO1xuICB9XG5cbiAgdmFyIGNoYW4gPSBjaGFubmVsKGJ1ZmZlcik7XG4gIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmICghY2hhbi5fX2Nsb3NlZF9fKSB7XG4gICAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIGNoYW4uY2xvc2UoKTtcbiAgICB9XG4gIH07XG4gIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG4gICAgICBjbG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobWF0Y2hlciAmJiAhbWF0Y2hlcihpbnB1dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbi5wdXQoaW5wdXQpO1xuICB9KTtcbiAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuICAgIHVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBpZiAoIV91dGlscy5pcy5mdW5jKHVuc3Vic2NyaWJlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW4gZXZlbnRDaGFubmVsOiBzdWJzY3JpYmUgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuc3Vic2NyaWJlJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRha2U6IGNoYW4udGFrZSxcbiAgICBmbHVzaDogY2hhbi5mbHVzaCxcbiAgICBjbG9zZTogY2xvc2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGNoYW4gPSBldmVudENoYW5uZWwoZnVuY3Rpb24gKGNiKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG4gICAgICAgIGNiKGlucHV0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgY2hhbiwge1xuICAgIHRha2U6IGZ1bmN0aW9uIHRha2UoY2IsIG1hdGNoZXIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBtYXRjaGVyIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgY2JbX3V0aWxzLk1BVENIXSA9IG1hdGNoZXI7XG4gICAgICB9XG4gICAgICBjaGFuLnRha2UoY2IpO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2NoYW5uZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gdW5kZWZpbmVkO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoXCIuL3V0aWxzXCIpO1xuXG52YXIgQlVGRkVSX09WRVJGTE9XID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSBcIkNoYW5uZWwncyBCdWZmZXIgb3ZlcmZsb3chXCI7XG5cbnZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG52YXIgT05fT1ZFUkZMT1dfRFJPUCA9IDI7XG52YXIgT05fT1ZFUkZMT1dfU0xJREUgPSAzO1xudmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cbnZhciB6ZXJvQnVmZmVyID0geyBpc0VtcHR5OiBfdXRpbHMua1RydWUsIHB1dDogX3V0aWxzLm5vb3AsIHRha2U6IF91dGlscy5ub29wIH07XG5cbmZ1bmN0aW9uIHJpbmdCdWZmZXIoKSB7XG4gIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMTA7XG4gIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblxuICB2YXIgYXJyID0gbmV3IEFycmF5KGxpbWl0KTtcbiAgdmFyIGxlbmd0aCA9IDA7XG4gIHZhciBwdXNoSW5kZXggPSAwO1xuICB2YXIgcG9wSW5kZXggPSAwO1xuXG4gIHZhciBwdXNoID0gZnVuY3Rpb24gcHVzaChpdCkge1xuICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG4gICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgbGVuZ3RoKys7XG4gIH07XG5cbiAgdmFyIHRha2UgPSBmdW5jdGlvbiB0YWtlKCkge1xuICAgIGlmIChsZW5ndGggIT0gMCkge1xuICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcbiAgICAgIGFycltwb3BJbmRleF0gPSBudWxsO1xuICAgICAgbGVuZ3RoLS07XG4gICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICByZXR1cm4gaXQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHdoaWxlIChsZW5ndGgpIHtcbiAgICAgIGl0ZW1zLnB1c2godGFrZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24gcHV0KGl0KSB7XG4gICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgcHVzaChpdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuICAgICAgICBzd2l0Y2ggKG92ZXJmbG93QWN0aW9uKSB7XG4gICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19USFJPVzpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfU0xJREU6XG4gICAgICAgICAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICAgICAgICBwb3BJbmRleCA9IHB1c2hJbmRleDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuICAgICAgICAgICAgZG91YmxlZExpbWl0ID0gMiAqIGxpbWl0O1xuXG4gICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHBvcEluZGV4ID0gMDtcblxuICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcbiAgICAgICAgICAgIGxpbWl0ID0gZG91YmxlZExpbWl0O1xuXG4gICAgICAgICAgICBwdXNoKGl0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gRFJPUFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB0YWtlOiB0YWtlLFxuICAgIGZsdXNoOiBmbHVzaFxuICB9O1xufVxuXG52YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcbiAgbm9uZTogZnVuY3Rpb24gbm9uZSgpIHtcbiAgICByZXR1cm4gemVyb0J1ZmZlcjtcbiAgfSxcbiAgZml4ZWQ6IGZ1bmN0aW9uIGZpeGVkKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1RIUk9XKTtcbiAgfSxcbiAgZHJvcHBpbmc6IGZ1bmN0aW9uIGRyb3BwaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX0RST1ApO1xuICB9LFxuICBzbGlkaW5nOiBmdW5jdGlvbiBzbGlkaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1NMSURFKTtcbiAgfSxcbiAgZXhwYW5kaW5nOiBmdW5jdGlvbiBleHBhbmRpbmcoaW5pdGlhbFNpemUpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihpbml0aWFsU2l6ZSwgT05fT1ZFUkZMT1dfRVhQQU5EKTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvYnVmZmVycy5qc1xuLy8gbW9kdWxlIGlkID0gNzQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5Q2FuY2VsID0gZnVuY3Rpb24geUNhbmNlbCh0YXNrKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbmNlbCkodGFzaykgfTtcbiAgfTtcblxuICB2YXIgdGFzayA9IHZvaWQgMCxcbiAgICAgIGFjdGlvbiA9IHZvaWQgMDtcbiAgdmFyIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRUYXNrKHQpIHtcbiAgICByZXR1cm4gdGFzayA9IHQ7XG4gIH07XG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IHRhc2sgPyBbJ3EzJywgeUNhbmNlbCh0YXNrKV0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG4gICAgfSxcbiAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG4gICAgICByZXR1cm4gWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH1cbiAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUxhdGVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9idWZmZXJzJyk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAzID8gX2xlbiAtIDMgOiAwKSwgX2tleSA9IDM7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAzXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBjaGFubmVsID0gdm9pZCAwO1xuXG4gIHZhciB5QWN0aW9uQ2hhbm5lbCA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmFjdGlvbkNoYW5uZWwpKHBhdHRlcm4sIF9idWZmZXJzLmJ1ZmZlcnMuc2xpZGluZygxKSkgfTtcbiAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKGNoYW5uZWwpIH07XG4gIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcbiAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cbiAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuICAgIHJldHVybiBhY3Rpb24gPSBhYztcbiAgfTtcbiAgdmFyIHNldENoYW5uZWwgPSBmdW5jdGlvbiBzZXRDaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcbiAgfTtcblxuICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeUFjdGlvbkNoYW5uZWwsIHNldENoYW5uZWxdO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIFsncTMnLCB5VGFrZSgpLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTQnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9LFxuICAgIHE0OiBmdW5jdGlvbiBxNCgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeURlbGF5XTtcbiAgICB9XG4gIH0sICdxMScsICd0aHJvdHRsZSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybikgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90aHJvdHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcnVuU2FnYScpO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlRmFjdG9yeSgpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBfcmVmJGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcbiAgICAgIG9wdGlvbnMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjb250ZXh0J10pO1xuXG4gIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cblxuICBpZiAoX3V0aWxzLmlzLmZ1bmMob3B0aW9ucykpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTYWdhIG1pZGRsZXdhcmUgbm8gbG9uZ2VyIGFjY2VwdCBHZW5lcmF0b3IgZnVuY3Rpb25zLiBVc2Ugc2FnYU1pZGRsZXdhcmUucnVuIGluc3RlYWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxvZ2dlciAmJiAhX3V0aWxzLmlzLmZ1bmMobG9nZ2VyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMubG9nZ2VyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiBvcHRpb25zLm9uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25FcnJvcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5lbWl0dGVyICYmICFfdXRpbHMuaXMuZnVuYyhvcHRpb25zLmVtaXR0ZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5lbWl0dGVyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlKF9yZWYyKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoID0gX3JlZjIuZGlzcGF0Y2g7XG5cbiAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcbiAgICBzYWdhRW1pdHRlci5lbWl0ID0gKG9wdGlvbnMuZW1pdHRlciB8fCBfdXRpbHMuaWRlbnQpKHNhZ2FFbWl0dGVyLmVtaXQpO1xuXG4gICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBzdWJzY3JpYmU6IHNhZ2FFbWl0dGVyLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcbiAgICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICAgIHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgb25FcnJvcjogb25FcnJvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuICAgICAgICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcbiAgICAgICAgc2FnYUVtaXR0ZXIuZW1pdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgc2FnYU1pZGRsZXdhcmUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQmVmb3JlIHJ1bm5pbmcgYSBTYWdhLCB5b3UgbXVzdCBtb3VudCB0aGUgU2FnYSBtaWRkbGV3YXJlIG9uIHRoZSBTdG9yZSB1c2luZyBhcHBseU1pZGRsZXdhcmUnKTtcbiAgfTtcblxuICBzYWdhTWlkZGxld2FyZS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG4gICAgX3V0aWxzLm9iamVjdC5hc3NpZ24oY29udGV4dCwgcHJvcHMpO1xuICB9O1xuXG4gIHJldHVybiBzYWdhTWlkZGxld2FyZTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvbWlkZGxld2FyZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZW0nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZW07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwdXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucHV0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JhY2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucmFjZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbGwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FwcGx5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFwcGx5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3BzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNwcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZvcmsnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZm9yaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NwYXduJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNwYXduO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnam9pbicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5qb2luO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NlbGVjdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZWxlY3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhY3Rpb25DaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFjdGlvbkNoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWxsZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FuY2VsbGVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZmx1c2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZmx1c2g7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdnZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmdldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGhyb3R0bGU7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9lZmZlY3RzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmlzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuICB9XG59KTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG4gIH1cbn0pO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9wcm9jJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0hBTk5FTF9FTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcHJvYy5DSEFOTkVMX0VORDtcbiAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuL2NvbnN0XCI7XG5pbXBvcnQgcHVsbCBmcm9tIFwibG9kYXNoL3B1bGxcIjtcbmltcG9ydCB7IGluQXJyYXkgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBpbml0aWFsIHN0YXRlXG5sZXQgaW5pdGlhbFN0YXRlID0ge1xuICAgIHNlbGVjdEFsbDogdHJ1ZSxcbiAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgZXJyb3I6IG51bGwsXG4gICAgdXNlcklkOiBudWxsLFxuICAgIGlzX3Jlc3RyaWN0ZWQ6IGZhbHNlLFxuICAgIGFsbF9wcm9qZWN0czogW10sXG4gICAgdXNlcl9wcm9qZWN0czogW10sXG4gICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcbiAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGMuU0VUX1NUT1JFOiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgLi4uZGF0YSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfSU5JVDoge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMucHJvamVjdHMpIHx8IFtdLFxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCkgfHwgZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX0dFVF9GQUlMVVJFOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX1BVVF9JTklUOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyB1c2VyX3Byb2plY3RzIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMucHJvamVjdHMsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5BUElfUFVUX0ZBSUxVUkU6IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGwsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIE92ZXJ3cml0ZSBpZiB3ZSBoYXZlIGFuIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlLmlzX3Jlc3RyaWN0ZWQgPSBzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsX3VzZXJfcHJvamVjdHMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0ZS51c2VyX3Byb2plY3RzID0gc3RhdGUub3JpZ2luYWxfdXNlcl9wcm9qZWN0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT046IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvamVjdElkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG4gICAgICAgICAgICBjb25zdCB1c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG5cbiAgICAgICAgICAgIGluQXJyYXkocHJvamVjdElkLCB1c2VyX3Byb2plY3RzKVxuICAgICAgICAgICAgICAgID8gcHVsbCh1c2VyX3Byb2plY3RzLCBwcm9qZWN0SWQpXG4gICAgICAgICAgICAgICAgOiB1c2VyX3Byb2plY3RzLnB1c2gocHJvamVjdElkKTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBvcmlnaW5hbF9wcm9qZWN0czogb3JpZ2luYWxfdXNlcl9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLlVQREFURV9JU19SRVNUUklDVEVEOiB7XG4gICAgICAgICAgICBjb25zdCB7IGlzX3Jlc3RyaWN0ZWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGlzX3Jlc3RyaWN0ZWQsIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IHN0YXRlLmlzX3Jlc3RyaWN0ZWQgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUzoge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcbiAgICAgICAgICAgIGxldCB1c2VyX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIHsgc2VsZWN0QWxsIH0gPSB7IC4uLnN0YXRlIH07XG4gICAgICAgICAgICBpZiAoc2VsZWN0QWxsKSB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAocHJvamVjdCA9PiBwcm9qZWN0LmlkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3Byb2plY3RzOiBvcmlnaW5hbF91c2VyX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9yZWR1Y2VyLmpzIiwidmFyIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBwdWxsQWxsID0gcmVxdWlyZSgnLi9wdWxsQWxsJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwgZ2l2ZW4gdmFsdWVzIGZyb20gYGFycmF5YCB1c2luZ1xuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLndpdGhvdXRgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuIFVzZSBgXy5yZW1vdmVgXG4gKiB0byByZW1vdmUgZWxlbWVudHMgZnJvbSBhbiBhcnJheSBieSBwcmVkaWNhdGUuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHsuLi4qfSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG4gKlxuICogXy5wdWxsKGFycmF5LCAnYScsICdjJyk7XG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbJ2InLCAnYiddXG4gKi9cbnZhciBwdWxsID0gYmFzZVJlc3QocHVsbEFsbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvcHVsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VSZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYXBwbHkuanNcbi8vIG1vZHVsZSBpZCA9IDc1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZVNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVNldFRvU3RyaW5nJyksXG4gICAgc2hvcnRPdXQgPSByZXF1aXJlKCcuL19zaG9ydE91dCcpO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDc1OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgY29uc3RhbnQgPSByZXF1aXJlKCcuL2NvbnN0YW50JyksXG4gICAgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcbiAgICAnd3JpdGFibGUnOiB0cnVlXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDc2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvY29uc3RhbnQuanNcbi8vIG1vZHVsZSBpZCA9IDc2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zaG9ydE91dC5qc1xuLy8gbW9kdWxlIGlkID0gNzYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlUHVsbEFsbCA9IHJlcXVpcmUoJy4vX2Jhc2VQdWxsQWxsJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5wdWxsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFuIGFycmF5IG9mIHZhbHVlcyB0byByZW1vdmUuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5kaWZmZXJlbmNlYCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG4gKlxuICogXy5wdWxsQWxsKGFycmF5LCBbJ2EnLCAnYyddKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xuZnVuY3Rpb24gcHVsbEFsbChhcnJheSwgdmFsdWVzKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoICYmIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoKVxuICAgID8gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcylcbiAgICA6IGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL3B1bGxBbGwuanNcbi8vIG1vZHVsZSBpZCA9IDc2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKSxcbiAgICBiYXNlSW5kZXhPZldpdGggPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZldpdGgnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBbGxCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXhPZiA9IGNvbXBhcmF0b3IgPyBiYXNlSW5kZXhPZldpdGggOiBiYXNlSW5kZXhPZixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgc2VlbiA9IGFycmF5O1xuXG4gIGlmIChhcnJheSA9PT0gdmFsdWVzKSB7XG4gICAgdmFsdWVzID0gY29weUFycmF5KHZhbHVlcyk7XG4gIH1cbiAgaWYgKGl0ZXJhdGVlKSB7XG4gICAgc2VlbiA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBmcm9tSW5kZXggPSAwLFxuICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHdoaWxlICgoZnJvbUluZGV4ID0gaW5kZXhPZihzZWVuLCBjb21wdXRlZCwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSkgPiAtMSkge1xuICAgICAgaWYgKHNlZW4gIT09IGFycmF5KSB7XG4gICAgICAgIHNwbGljZS5jYWxsKHNlZW4sIGZyb21JbmRleCwgMSk7XG4gICAgICB9XG4gICAgICBzcGxpY2UuY2FsbChhcnJheSwgZnJvbUluZGV4LCAxKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQdWxsQWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanNcbi8vIG1vZHVsZSBpZCA9IDc2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXNOYU4gPSByZXF1aXJlKCcuL19iYXNlSXNOYU4nKSxcbiAgICBzdHJpY3RJbmRleE9mID0gcmVxdWlyZSgnLi9fc3RyaWN0SW5kZXhPZicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlXG4gICAgPyBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KVxuICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUluZGV4T2YuanNcbi8vIG1vZHVsZSBpZCA9IDc2NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUZpbmRJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmFOO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUlzTmFOLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5kZXhPZmAgd2hpY2ggcGVyZm9ybXMgc3RyaWN0IGVxdWFsaXR5XG4gKiBjb21wYXJpc29ucyBvZiB2YWx1ZXMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmljdEluZGV4T2Y7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zdHJpY3RJbmRleE9mLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGJhc2VJbmRleE9mYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlSW5kZXhPZldpdGgoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKGFycmF5W2luZGV4XSwgdmFsdWUpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZldpdGg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSW5kZXhPZldpdGguanNcbi8vIG1vZHVsZSBpZCA9IDc2OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19jb3B5QXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDc3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIFRoaXMgaW1wb3J0IGlzIG5lY2Vzc2FyeSB0byBiZSBhYmxlIHRvIHRlc3Qgc2FnYXMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4LXNhZ2EvcmVkdXgtc2FnYS9pc3N1ZXMvMjgwI2lzc3VlY29tbWVudC0yOTExMzMwMjNcbmltcG9ydCBcInJlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZVwiO1xuXG5pbXBvcnQgeyB0YWtlTGF0ZXN0LCBjYWxsLCBwdXQsIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHsgZ2V0Q29va2llIH0gZnJvbSBcIi4uL215LXJlc3VsdHMvdXRpbHNcIjtcblxuZnVuY3Rpb24gY2FsbEF4aW9zKGNvbmZpZykge1xuICAgIHJldHVybiBheGlvcyhjb25maWcpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+ICh7IHJlc3BvbnNlIH0pKVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gKHsgZXJyb3IgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYFxuICAgIH07XG4gICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHV0RGF0YSh1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpIHtcbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIG1ldGhvZDogXCJwdXRcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoXCJjc3JmdG9rZW5cIilcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHt1c2VySWR9L2AsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkLFxuICAgICAgICAgICAgICAgIHByb2plY3RzOiB1c2VyX3Byb2plY3RzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBjYWxsQXhpb3MoY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBnZXRTYWdhKGFjdGlvbikge1xuICAgIGNvbnN0IHsgdXNlcklkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICBjb25zdCB7IHJlc3BvbnNlLCBlcnJvciB9ID0geWllbGQgY2FsbChmZXRjaERhdGEsIHVzZXJJZCk7XG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VySWQgPSBzdGF0ZSA9PiBzdGF0ZS51c2VySWQ7XG5leHBvcnQgY29uc3QgZ2V0VXNlclByb2plY3RzID0gc3RhdGUgPT4gc3RhdGUudXNlcl9wcm9qZWN0cztcbmV4cG9ydCBjb25zdCBnZXRJc1Jlc3RyaWN0ZWQgPSBzdGF0ZSA9PiBzdGF0ZS5pc19yZXN0cmljdGVkO1xuXG5leHBvcnQgZnVuY3Rpb24qIHB1dFNhZ2EoYWN0aW9uKSB7XG4gICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX0lOSVQgfSk7XG4gICAgY29uc3QgdXNlcklkID0geWllbGQgc2VsZWN0KGdldFVzZXJJZCk7XG4gICAgY29uc3QgaXNfcmVzdHJpY3RlZCA9IHlpZWxkIHNlbGVjdChnZXRJc1Jlc3RyaWN0ZWQpO1xuICAgIGNvbnN0IHVzZXJfcHJvamVjdHMgPSB5aWVsZCBzZWxlY3QoZ2V0VXNlclByb2plY3RzKTtcblxuICAgIGNvbnN0IHsgcmVzcG9uc2UsIGVycm9yIH0gPSB5aWVsZCBjYWxsKHB1dERhdGEsIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cyk7XG4gICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhOiByZXNwb25zZS5kYXRhIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbi8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5leHBvcnQgZnVuY3Rpb24qIHdhdGNoZXJTYWdhKCkge1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5BUElfR0VUX0lOSVQsIGdldFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9JU19SRVNUUklDVEVELCBwdXRTYWdhKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG4gIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG4gIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzczXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2F4aW9zLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qc1xuLy8gbW9kdWxlIGlkID0gNzc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2lzLWJ1ZmZlci9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzc3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcbiAgICAgIHVybDogYXJndW1lbnRzWzBdXG4gICAgfSwgYXJndW1lbnRzWzFdKTtcbiAgfVxuXG4gIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvZGVmYXVsdHMuanNcbi8vIG1vZHVsZSBpZCA9IDc3OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qc1xuLy8gbW9kdWxlIGlkID0gNzgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanNcbi8vIG1vZHVsZSBpZCA9IDc4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gNzgzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIHJldHVybiBlcnJvcjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzg1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanNcbi8vIG1vZHVsZSBpZCA9IDc4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qc1xuLy8gbW9kdWxlIGlkID0gNzg4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgfSxcblxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiB7XG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH0pKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qc1xuLy8gbW9kdWxlIGlkID0gNzg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3OTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDc5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qc1xuLy8gbW9kdWxlIGlkID0gNzk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qc1xuLy8gbW9kdWxlIGlkID0gNzk4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=