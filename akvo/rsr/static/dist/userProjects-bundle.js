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
        var _reduxDevtoolsExtension = __webpack_require__(754);
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
            var _ = _ref._, is_restricted = _ref.is_restricted, onChangeIsRestricted = _ref.onChangeIsRestricted;
            return _react2.default.createElement("span", null, _react2.default.createElement("label", null, _react2.default.createElement("input", {
                id: "is_restricted",
                type: "checkbox",
                checked: is_restricted,
                onChange: onChangeIsRestricted
            }), _("grant_access")));
        };
        var Project = function Project(_ref2) {
            var _ = _ref2._, project = _ref2.project, user_projects = _ref2.user_projects, is_restricted = _ref2.is_restricted, onChangeProjectSelected = _ref2.onChangeProjectSelected;
            var checked = user_projects && (0, _utils.inArray)(project.id, user_projects), selected = checked ? " projectSelected" : "", className = (is_restricted ? "" : "disabled") + selected;
            return _react2.default.createElement("tr", {
                key: project.id,
                id: project.id,
                onClick: onChangeProjectSelected,
                className: className
            }, _react2.default.createElement("td", null, _react2.default.createElement("input", {
                id: project.id,
                type: "checkbox",
                checked: checked,
                disabled: !is_restricted,
                readOnly: true
            })), _react2.default.createElement("td", null, project.id), _react2.default.createElement("td", null, project.title || _("no_title")));
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
            }, selectAll ? _("select_all") : _("deselect_all")));
        };
        var Error = function Error(_ref4) {
            var _ = _ref4._, error = _ref4.error;
            return error ? _react2.default.createElement("div", null, _("an_error_occured") + error.message) : null;
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
            }, _("can_access")), _react2.default.createElement("th", {
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
                    if (!target.closest("table").classList.contains("disabled")) {
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
        var compose = __webpack_require__(197).compose;
        exports.__esModule = true;
        exports.composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
            if (arguments.length === 0) return undefined;
            if (typeof arguments[0] === "object") return compose;
            return compose.apply(null, arguments);
        };
        exports.devToolsEnhancer = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ : function() {
            return function(noop) {
                return noop;
            };
        };
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
            original_projects: null
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
                        original_projects: null
                    });
                }

              case c.API_PUT_FAILURE:
                {
                    var new_state = _extends({}, state, {
                        fetching: false,
                        original_is_restricted: null,
                        original_projects: null,
                        error: action.error
                    });
                    if (state.original_is_restricted !== null) {
                        new_state.is_restricted = state.original_is_restricted;
                    }
                    if (state.original_projects !== null) {
                        new_state.user_projects = state.original_projects;
                    }
                    return new_state;
                }

              case c.UPDATE_PROJECT_SELECTION:
                {
                    var projectId = action.data.projectId;
                    var original_projects = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    var _user_projects2 = state.user_projects && [].concat(_toConsumableArray(state.user_projects));
                    (0, _utils.inArray)(projectId, _user_projects2) ? (0, _pull2.default)(_user_projects2, projectId) : _user_projects2.push(projectId);
                    return _extends({}, state, {
                        original_projects: original_projects,
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
                        original_projects: _original_projects,
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
        exports.watcherSaga = watcherSaga;
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
        function fetchData(userId) {
            return (0, _axios2.default)({
                method: "get",
                url: "/rest/v1/user_projects_access/" + userId + "/"
            });
        }
        function putData(userId, is_restricted, user_projects) {
            return (0, _axios2.default)({
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
            });
        }
        function getSaga(action) {
            var userId, response, data;
            return regeneratorRuntime.wrap(function getSaga$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        userId = action.data.userId;
                        _context.prev = 1;
                        _context.next = 4;
                        return (0, _effects.call)(fetchData, userId);

                      case 4:
                        response = _context.sent;
                        data = response.data;
                        _context.next = 8;
                        return (0, _effects.put)({
                            type: c.API_GET_SUCCESS,
                            data: data
                        });

                      case 8:
                        _context.next = 14;
                        break;

                      case 10:
                        _context.prev = 10;
                        _context.t0 = _context["catch"](1);
                        _context.next = 14;
                        return (0, _effects.put)({
                            type: c.API_GET_FAILURE,
                            error: _context.t0
                        });

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                }
            }, _marked, this, [ [ 1, 10 ] ]);
        }
        var getUserId = function getUserId(state) {
            return state.userId;
        };
        var getUserProjects = function getUserProjects(state) {
            return state.user_projects;
        };
        var getIsRestricted = function getIsRestricted(state) {
            return state.is_restricted;
        };
        function putSaga(action) {
            var userId, is_restricted, user_projects, response, data;
            return regeneratorRuntime.wrap(function putSaga$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return (0, _effects.put)({
                            type: c.API_PUT_INIT
                        });

                      case 3:
                        _context2.next = 5;
                        return (0, _effects.select)(getUserId);

                      case 5:
                        userId = _context2.sent;
                        _context2.next = 8;
                        return (0, _effects.select)(getIsRestricted);

                      case 8:
                        is_restricted = _context2.sent;
                        _context2.next = 11;
                        return (0, _effects.select)(getUserProjects);

                      case 11:
                        user_projects = _context2.sent;
                        _context2.next = 14;
                        return (0, _effects.call)(putData, userId, is_restricted, user_projects);

                      case 14:
                        response = _context2.sent;
                        data = response.data;
                        _context2.next = 18;
                        return (0, _effects.put)({
                            type: c.API_PUT_SUCCESS,
                            data: data
                        });

                      case 18:
                        _context2.next = 24;
                        break;

                      case 20:
                        _context2.prev = 20;
                        _context2.t0 = _context2["catch"](0);
                        _context2.next = 24;
                        return (0, _effects.put)({
                            type: c.API_PUT_FAILURE,
                            error: _context2.t0
                        });

                      case 24:
                      case "end":
                        return _context2.stop();
                    }
                }
            }, _marked2, this, [ [ 0, 20 ] ]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHV4RGV2dG9vbHNFeHRlbnNpb24iLCJfcmVkdWNlciIsIl9zYWdhcyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0Iiwic2FnYU1pZGRsZXdhcmUiLCJyZWR1eERldlRvb2xzIiwid2luZG93IiwiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyIsInN0b3JlIiwiY3JlYXRlU3RvcmUiLCJyZWR1Y2VyIiwiY29tcG9zZSIsImFwcGx5TWlkZGxld2FyZSIsInJ1biIsIndhdGNoZXJTYWdhIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiUmVhY3RET00iLCJyZW5kZXIiLCJjcmVhdGVFbGVtZW50IiwiUHJvdmlkZXIiLCJnZXRFbGVtZW50QnlJZCIsIjczNSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidGFyZ2V0IiwicHJvcHMiLCJpIiwibGVuZ3RoIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImtleSIsIkNvbnN0cnVjdG9yIiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwicHJvdG90eXBlIiwiX3V0aWxzIiwiX2NvbnN0IiwiYyIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwibmV3T2JqIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJUeXBlRXJyb3IiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsInNlbGYiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJJc1Jlc3RyaWN0ZWQiLCJfcmVmIiwiXyIsImlzX3Jlc3RyaWN0ZWQiLCJvbkNoYW5nZUlzUmVzdHJpY3RlZCIsImlkIiwidHlwZSIsImNoZWNrZWQiLCJvbkNoYW5nZSIsIlByb2plY3QiLCJfcmVmMiIsInByb2plY3QiLCJ1c2VyX3Byb2plY3RzIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQiLCJpbkFycmF5Iiwic2VsZWN0ZWQiLCJjbGFzc05hbWUiLCJvbkNsaWNrIiwiZGlzYWJsZWQiLCJyZWFkT25seSIsInRpdGxlIiwiU2VsZWN0QWxsIiwiX3JlZjMiLCJzZWxlY3RBbGwiLCJvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwiLCJ1bmRlZmluZWQiLCJFcnJvciIsIl9yZWY0IiwiZXJyb3IiLCJtZXNzYWdlIiwiUHJvamVjdHMiLCJfcmVmNSIsImFsbF9wcm9qZWN0cyIsIm1hcCIsIkFwcCIsIl9SZWFjdCRDb21wb25lbnQiLCJ0aGlzIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInRvZ2dsZVByb2plY3RTZWxlY3RlZCIsImJpbmQiLCJ0b2dnbGVJc1Jlc3RyaWN0ZWQiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsIiwicyIsInN0cmluZ3MiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25VcGRhdGVJc1Jlc3RyaWN0ZWQiLCJvblVwZGF0ZVNlbGVjdEFsbCIsImN1cnJlbnRUYXJnZXQiLCJjbG9zZXN0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsIm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbiIsImNvbXBvbmVudERpZE1vdW50IiwidXNlcklkIiwiZGF0YUZyb21FbGVtZW50Iiwic2V0U3RvcmUiLCJvbkZldGNoVXNlclByb2plY3RzIiwiX3Byb3BzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsImZldGNoaW5nIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJBUElfR0VUX0lOSVQiLCJkYXRhIiwiU0VUX1NUT1JFIiwicHJvamVjdElkIiwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OIiwiVVBEQVRFX0lTX1JFU1RSSUNURUQiLCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyIsImNvbm5lY3QiLCI3MzYiLCJlbmRwb2ludHMiLCJfc3RvcmUiLCJfc3RvcmUyIiwidXNlcl9wcm9qZWN0c19hY2Nlc3MiLCJhcnIiLCJpbmRleE9mIiwiZWxlbWVudE5hbWUiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCI3MzciLCJBUElfR0VUX1NVQ0NFU1MiLCJBUElfR0VUX0ZBSUxVUkUiLCJBUElfUFVUX0lOSVQiLCJBUElfUFVUX1NVQ0NFU1MiLCJBUElfUFVUX0ZBSUxVUkUiLCI3MzgiLCJ1dGlscyIsImVmZmVjdHMiLCJkZXRhY2giLCJDQU5DRUwiLCJkZWxheSIsInRocm90dGxlIiwidGFrZUxhdGVzdCIsInRha2VFdmVyeSIsImJ1ZmZlcnMiLCJjaGFubmVsIiwiZXZlbnRDaGFubmVsIiwiRU5EIiwicnVuU2FnYSIsIl9ydW5TYWdhIiwiZ2V0IiwiX2NoYW5uZWwiLCJfYnVmZmVycyIsIl9zYWdhSGVscGVycyIsIl9pbyIsIl9taWRkbGV3YXJlIiwiX21pZGRsZXdhcmUyIiwiX2VmZmVjdHMiLCJfdXRpbHMyIiwiNzM5IiwicHJvY2VzcyIsIl9wcm9jIiwiX3Byb2MyIiwiUlVOX1NBR0FfU0lHTkFUVVJFIiwiTk9OX0dFTkVSQVRPUl9FUlIiLCJzdG9yZUludGVyZmFjZSIsInNhZ2EiLCJfbGVuIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwiX2tleSIsIml0ZXJhdG9yIiwiaXMiLCJlbnYiLCJOT0RFX0VOViIsImxvZyIsImNoZWNrIiwiZnVuYyIsImFwcGx5IiwiX3N0b3JlSW50ZXJmYWNlIiwic3Vic2NyaWJlIiwiZ2V0U3RhdGUiLCJjb250ZXh0Iiwic2FnYU1vbml0b3IiLCJsb2dnZXIiLCJvbkVycm9yIiwiZWZmZWN0SWQiLCJ1aWQiLCJlZmZlY3RUcmlnZ2VyZWQiLCJub29wIiwiZWZmZWN0UmVzb2x2ZWQiLCJlZmZlY3RSZWplY3RlZCIsImVmZmVjdENhbmNlbGxlZCIsImFjdGlvbkRpc3BhdGNoZWQiLCJyb290IiwicGFyZW50RWZmZWN0SWQiLCJlZmZlY3QiLCJ0YXNrIiwid3JhcFNhZ2FEaXNwYXRjaCIsIm5hbWUiLCI3NDAiLCJfZXh0ZW5kcyIsImFzc2lnbiIsInNvdXJjZSIsIl90eXBlb2YiLCJTeW1ib2wiLCJoYXNPd24iLCJyZW1vdmUiLCJkZWZlcnJlZCIsImFycmF5T2ZEZWZmZXJlZCIsImNyZWF0ZU1vY2tUYXNrIiwiYXV0b0luYyIsIm1ha2VJdGVyYXRvciIsImRlcHJlY2F0ZSIsInN5bSIsIlRBU0siLCJIRUxQRVIiLCJNQVRDSCIsIlNBR0FfQUNUSU9OIiwiU0VMRl9DQU5DRUxMQVRJT04iLCJrb25zdCIsInYiLCJrVHJ1ZSIsImtGYWxzZSIsImlkZW50IiwicHJlZGljYXRlIiwib2JqZWN0IiwicHJvcGVydHkiLCJub3RVbmRlZiIsInVuZGVmIiwiZiIsIm51bWJlciIsIm4iLCJzdHJpbmciLCJhcnJheSIsImlzQXJyYXkiLCJwcm9taXNlIiwicCIsInRoZW4iLCJpdCIsIm5leHQiLCJ0aHJvdyIsIml0ZXJhYmxlIiwidCIsIm9ic2VydmFibGUiLCJvYiIsImJ1ZmZlciIsImJ1ZiIsImlzRW1wdHkiLCJ0YWtlIiwicHV0IiwicGF0dGVybiIsInBhdCIsImNoIiwiY2xvc2UiLCJoZWxwZXIiLCJzdHJpbmdhYmxlRnVuYyIsIml0ZW0iLCJpbmRleCIsInNwbGljZSIsImZyb20iLCJkZWYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInB1c2giLCJtcyIsInZhbCIsInRpbWVvdXRJZCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5uaW5nIiwiX3Jlc3VsdCIsIl9lcnJvciIsImlzUnVubmluZyIsInJlc3VsdCIsInNldFJ1bm5pbmciLCJiIiwic2V0UmVzdWx0IiwiciIsInNldEVycm9yIiwic2VlZCIsImtUaHJvdyIsImVyciIsImtSZXR1cm4iLCJkb25lIiwidGhybyIsImlzSGVscGVyIiwicmV0dXJuIiwibGV2ZWwiLCJjb25zb2xlIiwic3RhY2siLCJmbiIsImRlcHJlY2F0aW9uV2FybmluZyIsInVwZGF0ZUluY2VudGl2ZSIsImRlcHJlY2F0ZWQiLCJwcmVmZXJyZWQiLCJpbnRlcm5hbEVyciIsImNyZWF0ZVNldENvbnRleHRXYXJuaW5nIiwiY3R4IiwiYWN0aW9uIiwiY2xvbmVhYmxlR2VuZXJhdG9yIiwiZ2VuZXJhdG9yRnVuYyIsImhpc3RvcnkiLCJnZW4iLCJhcmciLCJjbG9uZSIsImNsb25lZEdlbiIsImZvckVhY2giLCJfcmV0dXJuIiwiX3Rocm93IiwiZXhjZXB0aW9uIiwiNzQxIiwiVEFTS19DQU5DRUwiLCJDSEFOTkVMX0VORCIsIk5PVF9JVEVSQVRPUl9FUlJPUiIsInByb2MiLCJfc2NoZWR1bGVyIiwiX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzIiwiZGVzY3MiLCJkZXNjIiwidG9TdHJpbmciLCJtYXRjaGVycyIsIndpbGRjYXJkIiwiX2RlZmF1bHQiLCJpbnB1dCIsIlN0cmluZyIsInBhdHRlcm5zIiwic29tZSIsIm1hdGNoZXIiLCJfcHJlZGljYXRlIiwiZm9ya1F1ZXVlIiwibWFpblRhc2siLCJjYiIsInRhc2tzIiwiY29tcGxldGVkIiwiYWRkVGFzayIsImFib3J0IiwiY2FuY2VsQWxsIiwiY29udCIsInJlcyIsImlzRXJyIiwiY2FuY2VsIiwiZ2V0VGFza3MiLCJ0YXNrTmFtZXMiLCJjcmVhdGVUYXNrSXRlcmF0b3IiLCJwYyIsImVmZiIsInJldCIsIndyYXBIZWxwZXIiLCJwYXJlbnRDb250ZXh0Iiwib3B0aW9ucyIsImVmZmVjdHNTdHJpbmciLCJydW5QYXJhbGxlbEVmZmVjdCIsInJ1bkFsbEVmZmVjdCIsImxvZ0Vycm9yIiwic2FnYVN0YWNrIiwic3BsaXQiLCJzdGRDaGFubmVsIiwidGFza0NvbnRleHQiLCJuZXdUYXNrIiwiY2FuY2VsTWFpbiIsInRhc2tRdWV1ZSIsImVuZCIsImlzQ2FuY2VsbGVkIiwiX2lzUnVubmluZyIsIl9pc0NhbmNlbGxlZCIsInJ1bkVmZmVjdCIsImlzTWFpblJ1bm5pbmciLCJfZGVmZXJyZWRFbmQiLCJfaXNBYm9ydGVkIiwiam9pbmVycyIsImoiLCJsYWJlbCIsImVmZmVjdFNldHRsZWQiLCJjdXJyQ2IiLCJyZXNvbHZlUHJvbWlzZSIsInJ1bkZvcmtFZmZlY3QiLCJyZXNvbHZlSXRlcmF0b3IiLCJhc0VmZmVjdCIsInJ1blRha2VFZmZlY3QiLCJydW5QdXRFZmZlY3QiLCJhbGwiLCJyYWNlIiwicnVuUmFjZUVmZmVjdCIsInJ1bkNhbGxFZmZlY3QiLCJjcHMiLCJydW5DUFNFZmZlY3QiLCJmb3JrIiwiam9pbiIsInJ1bkpvaW5FZmZlY3QiLCJydW5DYW5jZWxFZmZlY3QiLCJzZWxlY3QiLCJydW5TZWxlY3RFZmZlY3QiLCJhY3Rpb25DaGFubmVsIiwicnVuQ2hhbm5lbEVmZmVjdCIsImZsdXNoIiwicnVuRmx1c2hFZmZlY3QiLCJjYW5jZWxsZWQiLCJydW5DYW5jZWxsZWRFZmZlY3QiLCJnZXRDb250ZXh0IiwicnVuR2V0Q29udGV4dEVmZmVjdCIsInNldENvbnRleHQiLCJydW5TZXRDb250ZXh0RWZmZWN0IiwiY2FuY2VsUHJvbWlzZSIsIm1heWJlIiwidGFrZUNiIiwiaW5wIiwiaXNFbmQiLCJhc2FwIiwiY3BzQ2IiLCJjb25jYXQiLCJfcmVmNiIsImRldGFjaGVkIiwidGFza0l0ZXJhdG9yIiwic3VzcGVuZCIsIl90YXNrIiwiam9pbmVyIiwiaXNBYm9ydGVkIiwidGFza1RvQ2FuY2VsIiwia2V5cyIsImNvbXBsZXRlZENvdW50IiwicmVzdWx0cyIsImNoaWxkQ2JzIiwiY2hlY2tFZmZlY3RFbmQiLCJjaENiQXRLZXkiLCJfcmVzcG9uc2UiLCJyZXNwb25zZSIsInNsaWNlIiwiX3JlZjciLCJzZWxlY3RvciIsIl9yZWY4IiwibWF0Y2giLCJmaXhlZCIsInByb3AiLCJfZG9uZSIsIl9yZWY5IiwiX211dGF0b3JNYXAiLCI3NDIiLCJxdWV1ZSIsInNlbWFwaG9yZSIsImV4ZWMiLCJyZWxlYXNlIiwic2hpZnQiLCI3NDMiLCJ0YWtlbSIsInNwYXduIiwiSU8iLCJUQUtFIiwiUFVUIiwiQUxMIiwiUkFDRSIsIkNBTEwiLCJDUFMiLCJGT1JLIiwiSk9JTiIsIlNFTEVDVCIsIkFDVElPTl9DSEFOTkVMIiwiQ0FOQ0VMTEVEIiwiRkxVU0giLCJHRVRfQ09OVEVYVCIsIlNFVF9DT05URVhUIiwiVEVTVF9ISU5UIiwicGF5bG9hZCIsInBhdHRlcm5PckNoYW5uZWwiLCJzeW5jIiwiZ2V0Rm5DYWxsRGVzYyIsIm1ldGgiLCJfZm4iLCJfZm4yIiwiX2xlbjIiLCJfa2V5MiIsIl9sZW4zIiwiX2tleTMiLCJfbGVuNCIsIl9rZXk0IiwiX2xlbjUiLCJfa2V5NSIsIl9sZW42IiwiX2tleTYiLCJfbGVuNyIsIl9rZXk3Iiwid29ya2VyIiwiX2xlbjgiLCJfa2V5OCIsInRha2VFdmVyeUhlbHBlciIsIl9sZW45IiwiX2tleTkiLCJ0YWtlTGF0ZXN0SGVscGVyIiwiX2xlbjEwIiwiX2tleTEwIiwidGhyb3R0bGVIZWxwZXIiLCJjcmVhdGVBc0VmZmVjdFR5cGUiLCI3NDQiLCJfdGFrZUV2ZXJ5IiwiX3Rha2VFdmVyeTIiLCJfdGFrZUxhdGVzdCIsIl90YWtlTGF0ZXN0MiIsIl90aHJvdHRsZSIsIl90aHJvdHRsZTIiLCJoZWxwZXJOYW1lIiwiNzQ1IiwiX2ZzbUl0ZXJhdG9yIiwiX2ZzbUl0ZXJhdG9yMiIsInlUYWtlIiwieUZvcmsiLCJhYyIsInNldEFjdGlvbiIsInExIiwicTIiLCJxRW5kIiwic2FmZU5hbWUiLCI3NDYiLCJmc21JdGVyYXRvciIsImVudHJ5IiwiZnNtIiwicTAiLCJ1cGRhdGVTdGF0ZSIsInFOZXh0IiwiX2ZzbSRxTmV4dCIsInEiLCJvdXRwdXQiLCJfdXBkYXRlU3RhdGUiLCI3NDciLCJVTkRFRklORURfSU5QVVRfRVJST1IiLCJJTlZBTElEX0JVRkZFUiIsImVtaXR0ZXIiLCJDSEFOTkVMX0VORF9UWVBFIiwiYSIsInN1YnNjcmliZXJzIiwic3ViIiwiZW1pdCIsImxlbiIsImNsb3NlZCIsInRha2VycyIsImNoZWNrRm9yYmlkZGVuU3RhdGVzIiwiX190YWtlcnNfXyIsIl9fY2xvc2VkX18iLCJub25lIiwiY2hhbiIsInVuc3Vic2NyaWJlIiwiNzQ4IiwiQlVGRkVSX09WRVJGTE9XIiwiT05fT1ZFUkZMT1dfVEhST1ciLCJPTl9PVkVSRkxPV19EUk9QIiwiT05fT1ZFUkZMT1dfU0xJREUiLCJPTl9PVkVSRkxPV19FWFBBTkQiLCJ6ZXJvQnVmZmVyIiwicmluZ0J1ZmZlciIsImxpbWl0Iiwib3ZlcmZsb3dBY3Rpb24iLCJwdXNoSW5kZXgiLCJwb3BJbmRleCIsIml0ZW1zIiwiZG91YmxlZExpbWl0IiwiZHJvcHBpbmciLCJzbGlkaW5nIiwiZXhwYW5kaW5nIiwiaW5pdGlhbFNpemUiLCI3NDkiLCJ5Q2FuY2VsIiwic2V0VGFzayIsInEzIiwiNzUwIiwiZGVsYXlMZW5ndGgiLCJ5QWN0aW9uQ2hhbm5lbCIsInlEZWxheSIsInNldENoYW5uZWwiLCJxNCIsIjc1MSIsInNhZ2FNaWRkbGV3YXJlRmFjdG9yeSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9yZWYkY29udGV4dCIsIm9uZXJyb3IiLCJzYWdhRW1pdHRlciIsIjc1MiIsIjc1MyIsIjc1NCIsImNvbXBvc2VXaXRoRGV2VG9vbHMiLCJfX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18iLCJkZXZUb29sc0VuaGFuY2VyIiwiNzU1IiwiX3B1bGwiLCJfcHVsbDIiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJhcnIyIiwiaW5pdGlhbFN0YXRlIiwib3JpZ2luYWxfaXNfcmVzdHJpY3RlZCIsIm9yaWdpbmFsX3Byb2plY3RzIiwiX2FjdGlvbiRkYXRhIiwicHJvamVjdHMiLCJuZXdfc3RhdGUiLCJfdXNlcl9wcm9qZWN0czMiLCJfc3RhdGUiLCI3NTYiLCJiYXNlUmVzdCIsInB1bGxBbGwiLCJwdWxsIiwiNzU3IiwiaWRlbnRpdHkiLCJvdmVyUmVzdCIsInNldFRvU3RyaW5nIiwic3RhcnQiLCI3NTgiLCJuYXRpdmVNYXgiLCJNYXRoIiwibWF4IiwidHJhbnNmb3JtIiwib3RoZXJBcmdzIiwiNzU5IiwidGhpc0FyZyIsIjc2MCIsImJhc2VTZXRUb1N0cmluZyIsInNob3J0T3V0IiwiNzYxIiwiY29uc3RhbnQiLCI3NjIiLCI3NjMiLCJIT1RfQ09VTlQiLCJIT1RfU1BBTiIsIm5hdGl2ZU5vdyIsIkRhdGUiLCJub3ciLCJjb3VudCIsImxhc3RDYWxsZWQiLCJzdGFtcCIsInJlbWFpbmluZyIsIjc2NCIsImJhc2VQdWxsQWxsIiwidmFsdWVzIiwiNzY1IiwiYXJyYXlNYXAiLCJiYXNlSW5kZXhPZiIsImJhc2VJbmRleE9mV2l0aCIsImJhc2VVbmFyeSIsImNvcHlBcnJheSIsImFycmF5UHJvdG8iLCJpdGVyYXRlZSIsImNvbXBhcmF0b3IiLCJzZWVuIiwiZnJvbUluZGV4IiwiY29tcHV0ZWQiLCI3NjYiLCJiYXNlRmluZEluZGV4IiwiYmFzZUlzTmFOIiwic3RyaWN0SW5kZXhPZiIsIjc2NyIsImZyb21SaWdodCIsIjc2OCIsIjc2OSIsIjc3MCIsIjc3MSIsIjc3MiIsIl9heGlvcyIsIl9heGlvczIiLCJfbWFya2VkIiwicmVnZW5lcmF0b3JSdW50aW1lIiwibWFyayIsImdldFNhZ2EiLCJfbWFya2VkMiIsInB1dFNhZ2EiLCJfbWFya2VkMyIsImZldGNoRGF0YSIsIm1ldGhvZCIsInVybCIsInB1dERhdGEiLCJoZWFkZXJzIiwiWC1DU1JGVG9rZW4iLCJnZXRDb29raWUiLCJ3cmFwIiwiZ2V0U2FnYSQiLCJfY29udGV4dCIsInByZXYiLCJzZW50IiwidDAiLCJzdG9wIiwiZ2V0VXNlcklkIiwiZ2V0VXNlclByb2plY3RzIiwiZ2V0SXNSZXN0cmljdGVkIiwicHV0U2FnYSQiLCJfY29udGV4dDIiLCJ3YXRjaGVyU2FnYSQiLCJfY29udGV4dDMiLCI3NzMiLCI3NzQiLCJBeGlvcyIsImRlZmF1bHRzIiwiY3JlYXRlSW5zdGFuY2UiLCJkZWZhdWx0Q29uZmlnIiwicmVxdWVzdCIsImV4dGVuZCIsImF4aW9zIiwiaW5zdGFuY2VDb25maWciLCJtZXJnZSIsIkNhbmNlbCIsIkNhbmNlbFRva2VuIiwiaXNDYW5jZWwiLCJwcm9taXNlcyIsInNwcmVhZCIsIjc3NSIsImlzQnVmZmVyIiwiaXNBcnJheUJ1ZmZlciIsImlzRm9ybURhdGEiLCJGb3JtRGF0YSIsImlzQXJyYXlCdWZmZXJWaWV3IiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNVbmRlZmluZWQiLCJpc09iamVjdCIsImlzRGF0ZSIsImlzRmlsZSIsImlzQmxvYiIsImlzRnVuY3Rpb24iLCJpc1N0cmVhbSIsInBpcGUiLCJpc1VSTFNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInRyaW0iLCJzdHIiLCJyZXBsYWNlIiwiaXNTdGFuZGFyZEJyb3dzZXJFbnYiLCJuYXZpZ2F0b3IiLCJwcm9kdWN0IiwibCIsImFzc2lnblZhbHVlIiwiNzc2IiwiNzc3IiwiaXNTbG93QnVmZmVyIiwiX2lzQnVmZmVyIiwicmVhZEZsb2F0TEUiLCI3NzgiLCJJbnRlcmNlcHRvck1hbmFnZXIiLCJkaXNwYXRjaFJlcXVlc3QiLCJpbnRlcmNlcHRvcnMiLCJjb25maWciLCJ0b0xvd2VyQ2FzZSIsImNoYWluIiwidW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMiLCJpbnRlcmNlcHRvciIsInVuc2hpZnQiLCJmdWxmaWxsZWQiLCJyZWplY3RlZCIsInB1c2hSZXNwb25zZUludGVyY2VwdG9ycyIsImZvckVhY2hNZXRob2ROb0RhdGEiLCJmb3JFYWNoTWV0aG9kV2l0aERhdGEiLCI3NzkiLCJub3JtYWxpemVIZWFkZXJOYW1lIiwiREVGQVVMVF9DT05URU5UX1RZUEUiLCJDb250ZW50LVR5cGUiLCJzZXRDb250ZW50VHlwZUlmVW5zZXQiLCJnZXREZWZhdWx0QWRhcHRlciIsImFkYXB0ZXIiLCJYTUxIdHRwUmVxdWVzdCIsInRyYW5zZm9ybVJlcXVlc3QiLCJzdHJpbmdpZnkiLCJ0cmFuc2Zvcm1SZXNwb25zZSIsInRpbWVvdXQiLCJ4c3JmQ29va2llTmFtZSIsInhzcmZIZWFkZXJOYW1lIiwibWF4Q29udGVudExlbmd0aCIsInZhbGlkYXRlU3RhdHVzIiwic3RhdHVzIiwiY29tbW9uIiwiQWNjZXB0IiwiNzgwIiwibm9ybWFsaXplZE5hbWUiLCJwcm9jZXNzSGVhZGVyIiwidG9VcHBlckNhc2UiLCI3ODEiLCJzZXR0bGUiLCJidWlsZFVSTCIsInBhcnNlSGVhZGVycyIsImlzVVJMU2FtZU9yaWdpbiIsImNyZWF0ZUVycm9yIiwiYnRvYSIsInhockFkYXB0ZXIiLCJkaXNwYXRjaFhoclJlcXVlc3QiLCJyZXF1ZXN0RGF0YSIsInJlcXVlc3RIZWFkZXJzIiwibG9hZEV2ZW50IiwieERvbWFpbiIsIlhEb21haW5SZXF1ZXN0Iiwib25wcm9ncmVzcyIsImhhbmRsZVByb2dyZXNzIiwib250aW1lb3V0IiwiaGFuZGxlVGltZW91dCIsImF1dGgiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiQXV0aG9yaXphdGlvbiIsIm9wZW4iLCJwYXJhbXMiLCJwYXJhbXNTZXJpYWxpemVyIiwiaGFuZGxlTG9hZCIsInJlYWR5U3RhdGUiLCJyZXNwb25zZVVSTCIsInJlc3BvbnNlSGVhZGVycyIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlVHlwZSIsInJlc3BvbnNlVGV4dCIsInN0YXR1c1RleHQiLCJoYW5kbGVFcnJvciIsImNvb2tpZXMiLCJ4c3JmVmFsdWUiLCJ3aXRoQ3JlZGVudGlhbHMiLCJyZWFkIiwic2V0UmVxdWVzdEhlYWRlciIsIm9uRG93bmxvYWRQcm9ncmVzcyIsIm9uVXBsb2FkUHJvZ3Jlc3MiLCJ1cGxvYWQiLCJjYW5jZWxUb2tlbiIsIm9uQ2FuY2VsZWQiLCJzZW5kIiwiNzgyIiwiNzgzIiwiZW5oYW5jZUVycm9yIiwiY29kZSIsIjc4NCIsIjc4NSIsImVuY29kZSIsImVuY29kZVVSSUNvbXBvbmVudCIsInNlcmlhbGl6ZWRQYXJhbXMiLCJwYXJ0cyIsInNlcmlhbGl6ZSIsInBhcnNlVmFsdWUiLCJ0b0lTT1N0cmluZyIsIjc4NiIsImlnbm9yZUR1cGxpY2F0ZU9mIiwicGFyc2VkIiwicGFyc2VyIiwibGluZSIsInN1YnN0ciIsIjc4NyIsInN0YW5kYXJkQnJvd3NlckVudiIsIm1zaWUiLCJ0ZXN0IiwidXNlckFnZW50IiwidXJsUGFyc2luZ05vZGUiLCJvcmlnaW5VUkwiLCJyZXNvbHZlVVJMIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInByb3RvY29sIiwiaG9zdCIsInNlYXJjaCIsImhhc2giLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsImNoYXJBdCIsImxvY2F0aW9uIiwicmVxdWVzdFVSTCIsIm5vblN0YW5kYXJkQnJvd3NlckVudiIsIjc4OCIsImNoYXJzIiwiRSIsImJsb2NrIiwiY2hhckNvZGUiLCJpZHgiLCJjaGFyQ29kZUF0IiwiNzg5Iiwid3JpdGUiLCJleHBpcmVzIiwicGF0aCIsImRvbWFpbiIsInNlY3VyZSIsImNvb2tpZSIsInRvR01UU3RyaW5nIiwiUmVnRXhwIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiNzkwIiwiaGFuZGxlcnMiLCJ1c2UiLCJlamVjdCIsImZvckVhY2hIYW5kbGVyIiwiaCIsIjc5MSIsInRyYW5zZm9ybURhdGEiLCJpc0Fic29sdXRlVVJMIiwiY29tYmluZVVSTHMiLCJ0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkIiwidGhyb3dJZlJlcXVlc3RlZCIsImJhc2VVUkwiLCJjbGVhbkhlYWRlckNvbmZpZyIsIm9uQWRhcHRlclJlc29sdXRpb24iLCJvbkFkYXB0ZXJSZWplY3Rpb24iLCJyZWFzb24iLCI3OTIiLCJmbnMiLCI3OTMiLCJfX0NBTkNFTF9fIiwiNzk0IiwiNzk1IiwicmVsYXRpdmVVUkwiLCI3OTYiLCI3OTciLCJleGVjdXRvciIsInByb21pc2VFeGVjdXRvciIsInRva2VuIiwiNzk4IiwiY2FsbGJhY2siXSwibWFwcGluZ3MiOiJBQUFBQSxlQUFjO0lBRVJDLEdBQ0EsU0FBVUMsUUFBUUMsU0FBU0M7UUFFaEM7UUNFRCxJQUFBQyxTQUFBRCxvQkFBQTtRREVDLElBQUlFLFVBQVVDLHVCQUF1QkY7UUNEdEMsSUFBQUcsWUFBQUosb0JBQUE7UURLQyxJQUFJSyxhQUFhRix1QkFBdUJDO1FDSHpDLElBQUFFLE9BQUFOLG9CQUFBO1FET0MsSUFBSU8sUUFBUUosdUJBQXVCRztRQ0xwQyxJQUFBRSxTQUFBUixvQkFBQTtRQUNBLElBQUFTLGFBQUFULG9CQUFBO1FEVUMsSUFBSVUsY0FBY1AsdUJBQXVCTTtRQ1QxQyxJQUFBRSxjQUFBWCxvQkFBQTtRQUNBLElBQUFZLDBCQUFBWixvQkFBQTtRQUVBLElBQUFhLFdBQUFiLG9CQUFBO1FBQ0EsSUFBQWMsU0FBQWQsb0JBQUE7UURlQyxTQUFTRyx1QkFBdUJZO1lBQU8sT0FBT0EsT0FBT0EsSUFBSUMsYUFBYUQ7Z0JBQVFFLFNBQVNGOzs7UUNa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QUFydEIsTUFBQSxNQUFBeEQiLCJmaWxlIjoidXNlclByb2plY3RzLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIndlYnBhY2tKc29ucChbMV0se1xuXG4vKioqLyAwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3REb20gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3KTtcblx0XG5cdHZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXHRcblx0dmFyIF9BcHAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNSk7XG5cdFxuXHR2YXIgX0FwcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BcHApO1xuXHRcblx0dmFyIF9yZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTk3KTtcblx0XG5cdHZhciBfcmVkdXhTYWdhID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzgpO1xuXHRcblx0dmFyIF9yZWR1eFNhZ2EyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVkdXhTYWdhKTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfcmVkdXhEZXZ0b29sc0V4dGVuc2lvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzU0KTtcblx0XG5cdHZhciBfcmVkdWNlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzU1KTtcblx0XG5cdHZhciBfc2FnYXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Mik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0Ly8gY3JlYXRlIHRoZSBzYWdhIG1pZGRsZXdhcmVcblx0dmFyIHNhZ2FNaWRkbGV3YXJlID0gKDAsIF9yZWR1eFNhZ2EyLmRlZmF1bHQpKCk7XG5cdFxuXHQvLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuXHQvKlxuXHQgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0IEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0dmFyIHJlZHV4RGV2VG9vbHMgPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpO1xuXHRcblx0dmFyIHN0b3JlID0gdm9pZCAwO1xuXHRpZiAocmVkdXhEZXZUb29scykge1xuXHQgICAgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShfcmVkdWNlci5yZWR1Y2VyLCAoMCwgX3JlZHV4LmNvbXBvc2UpKCgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSksIHJlZHV4RGV2VG9vbHMpKTtcblx0fSBlbHNlIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKHNhZ2FNaWRkbGV3YXJlKSk7XG5cdH1cblx0XG5cdHNhZ2FNaWRkbGV3YXJlLnJ1bihfc2FnYXMud2F0Y2hlclNhZ2EpO1xuXHRcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgX3JlYWN0RG9tMi5kZWZhdWx0LnJlbmRlcihfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBfcmVhY3RSZWR1eC5Qcm92aWRlcixcblx0ICAgICAgICB7IHN0b3JlOiBzdG9yZSB9LFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9BcHAyLmRlZmF1bHQsIG51bGwpXG5cdCAgICApLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJQcm9qZWN0c1wiKSk7XG5cdH0pO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cdFxuXHR2YXIgX3JlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0XG5cdHZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXHRcblx0dmFyIF9yZWFjdFJlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxODQpO1xuXHRcblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzM2KTtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblx0XG5cdGZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfSAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHR2YXIgSXNSZXN0cmljdGVkID0gZnVuY3Rpb24gSXNSZXN0cmljdGVkKF9yZWYpIHtcblx0ICAgIHZhciBfID0gX3JlZi5fLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmLm9uQ2hhbmdlSXNSZXN0cmljdGVkO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcImxhYmVsXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHQgICAgICAgICAgICAgICAgaWQ6IFwiaXNfcmVzdHJpY3RlZFwiLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBvbkNoYW5nZUlzUmVzdHJpY3RlZFxuXHQgICAgICAgICAgICB9KSxcblx0ICAgICAgICAgICAgXyhcImdyYW50X2FjY2Vzc1wiKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdCA9IGZ1bmN0aW9uIFByb2plY3QoX3JlZjIpIHtcblx0ICAgIHZhciBfID0gX3JlZjIuXyxcblx0ICAgICAgICBwcm9qZWN0ID0gX3JlZjIucHJvamVjdCxcblx0ICAgICAgICB1c2VyX3Byb2plY3RzID0gX3JlZjIudXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZjIuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCA9IF9yZWYyLm9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkO1xuXHRcblx0ICAgIHZhciBjaGVja2VkID0gdXNlcl9wcm9qZWN0cyAmJiAoMCwgX3V0aWxzLmluQXJyYXkpKHByb2plY3QuaWQsIHVzZXJfcHJvamVjdHMpLFxuXHQgICAgICAgIHNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcblx0ICAgICAgICBjbGFzc05hbWUgPSAoaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIpICsgc2VsZWN0ZWQ7XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJ0clwiLFxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAga2V5OiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICBpZDogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgb25DbGljazogb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQsXG5cdCAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZCxcblx0ICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBwcm9qZWN0LmlkXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBwcm9qZWN0LnRpdGxlIHx8IF8oXCJub190aXRsZVwiKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgU2VsZWN0QWxsID0gZnVuY3Rpb24gU2VsZWN0QWxsKF9yZWYzKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYzLl8sXG5cdCAgICAgICAgc2VsZWN0QWxsID0gX3JlZjMuc2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCA9IF9yZWYzLm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZjMuaXNfcmVzdHJpY3RlZDtcblx0XG5cdCAgICB2YXIgZGlzYWJsZWQgPSBpc19yZXN0cmljdGVkID8gZmFsc2UgOiB0cnVlLFxuXHQgICAgICAgIGNsYXNzTmFtZSA9IFwic2VsZWN0QWxsUHJvamVjdHNcIiArIChpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiIGRpc2FibGVkXCIpO1xuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IGlzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCIgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJidXR0b25cIixcblx0ICAgICAgICAgICAgeyBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGRpc2FibGVkOiBkaXNhYmxlZCwgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgc2VsZWN0QWxsID8gXyhcInNlbGVjdF9hbGxcIikgOiBfKFwiZGVzZWxlY3RfYWxsXCIpXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBFcnJvciA9IGZ1bmN0aW9uIEVycm9yKF9yZWY0KSB7XG5cdCAgICB2YXIgXyA9IF9yZWY0Ll8sXG5cdCAgICAgICAgZXJyb3IgPSBfcmVmNC5lcnJvcjtcblx0XG5cdCAgICByZXR1cm4gZXJyb3IgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIG51bGwsXG5cdCAgICAgICAgXyhcImFuX2Vycm9yX29jY3VyZWRcIikgKyBlcnJvci5tZXNzYWdlXG5cdCAgICApIDogbnVsbDtcblx0fTtcblx0XG5cdHZhciBQcm9qZWN0cyA9IGZ1bmN0aW9uIFByb2plY3RzKF9yZWY1KSB7XG5cdCAgICB2YXIgXyA9IF9yZWY1Ll8sXG5cdCAgICAgICAgZXJyb3IgPSBfcmVmNS5lcnJvcixcblx0ICAgICAgICBhbGxfcHJvamVjdHMgPSBfcmVmNS5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9yZWY1LnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWY1LmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gX3JlZjUuc2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZjUub25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjUub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwic3BhblwiLFxuXHQgICAgICAgIG51bGwsXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoRXJyb3IsIHsgXzogXywgZXJyb3I6IGVycm9yIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KElzUmVzdHJpY3RlZCwge1xuXHQgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZDogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChTZWxlY3RBbGwsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkXG5cdCAgICAgICAgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGFibGVcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRoZWFkXCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgXCJ0clwiLFxuXHQgICAgICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwiY2FuX2FjY2Vzc1wiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF9pZFwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF90aXRsZVwiKVxuXHQgICAgICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgICAgIClcblx0ICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRib2R5XCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9qZWN0LCB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBBcHAgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuXHQgICAgX2luaGVyaXRzKEFwcCwgX1JlYWN0JENvbXBvbmVudCk7XG5cdFxuXHQgICAgZnVuY3Rpb24gQXBwKHByb3BzKSB7XG5cdCAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFwcCk7XG5cdFxuXHQgICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChBcHAuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihBcHApKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cdFxuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSBfdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMuXyA9IF90aGlzLl8uYmluZChfdGhpcyk7XG5cdCAgICAgICAgcmV0dXJuIF90aGlzO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFRyYW5zbGF0aW9uIGhhbmRsaW5nXG5cdFxuXHRcblx0ICAgIF9jcmVhdGVDbGFzcyhBcHAsIFt7XG5cdCAgICAgICAga2V5OiBcIl9cIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gXyhzKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnN0cmluZ3MgJiYgdGhpcy5wcm9wcy5zdHJpbmdzW3NdO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlSXNSZXN0cmljdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZUlzUmVzdHJpY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJc1Jlc3RyaWN0ZWQoZS50YXJnZXQuY2hlY2tlZCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVQcm9qZWN0U2VsZWN0ZWRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcblx0ICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xvc2VzdChcInRhYmxlXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVByb2plY3RTZWxlY3Rpb24oaWQpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0ICAgICAgICAgICAgdmFyIHVzZXJJZCA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItdG8tcmVzdHJpY3RcIikuaWQ7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyB1c2VySWQ6IHVzZXJJZCB9KTtcblx0XG5cdCAgICAgICAgICAgIHZhciBzdHJpbmdzID0gKDAsIF91dGlscy5kYXRhRnJvbUVsZW1lbnQpKFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5nczogc3RyaW5ncyB9KTtcblx0XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwicmVuZGVyXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0ICAgICAgICAgICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHMsXG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkID0gX3Byb3BzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGwgPSBfcHJvcHMuc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzID0gX3Byb3BzLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcHJvcHMudXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIGVycm9yID0gX3Byb3BzLmVycm9yO1xuXHRcblx0ICAgICAgICAgICAgcmV0dXJuIGFsbF9wcm9qZWN0cyA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFByb2plY3RzLCB7XG5cdCAgICAgICAgICAgICAgICBfOiB0aGlzLl8sXG5cdCAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZDogdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICB9KSA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJkaXZcIixcblx0ICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICAoMCwgX3V0aWxzLl8pKFwibG9hZGluZ1wiKVxuXHQgICAgICAgICAgICApO1xuXHQgICAgICAgIH1cblx0ICAgIH1dKTtcblx0XG5cdCAgICByZXR1cm4gQXBwO1xuXHR9KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXHRcblx0dmFyIG1hcFN0YXRlVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHQgICAgdmFyIGZldGNoaW5nID0gc3RhdGUuZmV0Y2hpbmcsXG5cdCAgICAgICAgZXJyb3IgPSBzdGF0ZS5lcnJvcixcblx0ICAgICAgICBhbGxfcHJvamVjdHMgPSBzdGF0ZS5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IHN0YXRlLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gc3RhdGUuc2VsZWN0QWxsLFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIHN0cmluZ3MgPSBzdGF0ZS5zdHJpbmdzO1xuXHRcblx0ICAgIHJldHVybiB7IGZldGNoaW5nOiBmZXRjaGluZywgZXJyb3I6IGVycm9yLCBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsOiBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsIHN0cmluZ3M6IHN0cmluZ3MgfTtcblx0fTtcblx0XG5cdHZhciBtYXBEaXNwYXRjaFRvUHJvcHMgPSBmdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgICAgb25GZXRjaFVzZXJQcm9qZWN0czogZnVuY3Rpb24gb25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5BUElfR0VUX0lOSVQsIGRhdGE6IHsgdXNlcklkOiB1c2VySWQgfSB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHNldFN0b3JlOiBmdW5jdGlvbiBzZXRTdG9yZShkYXRhKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7IHR5cGU6IGMuU0VUX1NUT1JFLCBkYXRhOiBkYXRhIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBmdW5jdGlvbiBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24ocHJvamVjdElkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBkYXRhOiB7IHByb2plY3RJZDogcHJvamVjdElkIH0gfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogZnVuY3Rpb24gb25VcGRhdGVJc1Jlc3RyaWN0ZWQoaXNfcmVzdHJpY3RlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9JU19SRVNUUklDVEVELCBkYXRhOiB7IGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQgfSB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlU2VsZWN0QWxsOiBmdW5jdGlvbiBvblVwZGF0ZVNlbGVjdEFsbCgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShBcHApO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0ZXhwb3J0cy5kYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmluQXJyYXkgPSBleHBvcnRzLmVuZHBvaW50cyA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfc3RvcmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMwNCk7XG5cdFxuXHR2YXIgX3N0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0b3JlKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgZW5kcG9pbnRzID0gZXhwb3J0cy5lbmRwb2ludHMgPSB7XG5cdCAgICB1c2VyX3Byb2plY3RzX2FjY2VzczogZnVuY3Rpb24gdXNlcl9wcm9qZWN0c19hY2Nlc3MoaWQpIHtcblx0ICAgICAgICByZXR1cm4gXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIGlkICsgXCIvP2Zvcm1hdD1qc29uXCI7XG5cdCAgICB9XG5cdH07IC8qXG5cdCAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICovXG5cdFxuXHR2YXIgaW5BcnJheSA9IGV4cG9ydHMuaW5BcnJheSA9IGZ1bmN0aW9uIGluQXJyYXkob2JqLCBhcnIpIHtcblx0ICAgIHJldHVybiBhcnIgJiYgYXJyLmluZGV4T2Yob2JqKSAhPT0gLTE7XG5cdH07XG5cdFxuXHR2YXIgZGF0YUZyb21FbGVtZW50ID0gZXhwb3J0cy5kYXRhRnJvbUVsZW1lbnQgPSBmdW5jdGlvbiBkYXRhRnJvbUVsZW1lbnQoZWxlbWVudE5hbWUpIHtcblx0ICAgIHJldHVybiBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKS5pbm5lckhUTUwpO1xuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0Lypcblx0ICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgKi9cblx0XG5cdC8vIGFjdGlvbiB0eXBlc1xuXHR2YXIgLy9cblx0U0VUX1NUT1JFID0gZXhwb3J0cy5TRVRfU1RPUkUgPSBcIlNFVF9TVE9SRVwiLFxuXHRcblx0Ly9cblx0QVBJX0dFVF9JTklUID0gZXhwb3J0cy5BUElfR0VUX0lOSVQgPSBcIkFQSV9HRVRfSU5JVFwiLFxuXHQgICAgQVBJX0dFVF9TVUNDRVNTID0gZXhwb3J0cy5BUElfR0VUX1NVQ0NFU1MgPSBcIkFQSV9HRVRfU1VDQ0VTU1wiLFxuXHQgICAgQVBJX0dFVF9GQUlMVVJFID0gZXhwb3J0cy5BUElfR0VUX0ZBSUxVUkUgPSBcIkFQSV9HRVRfRkFJTFVSRVwiLFxuXHRcblx0Ly9cblx0QVBJX1BVVF9JTklUID0gZXhwb3J0cy5BUElfUFVUX0lOSVQgPSBcIkFQSV9QVVRfSU5JVFwiLFxuXHQgICAgQVBJX1BVVF9TVUNDRVNTID0gZXhwb3J0cy5BUElfUFVUX1NVQ0NFU1MgPSBcIkFQSV9QVVRfU1VDQ0VTU1wiLFxuXHQgICAgQVBJX1BVVF9GQUlMVVJFID0gZXhwb3J0cy5BUElfUFVUX0ZBSUxVUkUgPSBcIkFQSV9QVVRfRkFJTFVSRVwiLFxuXHRcblx0Ly9cblx0VVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OID0gZXhwb3J0cy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBcIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTlwiLFxuXHQgICAgVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBleHBvcnRzLlVQREFURV9JU19SRVNUUklDVEVEID0gXCJVUERBVEVfSVNfUkVTVFJJQ1RFRFwiLFxuXHQgICAgVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBleHBvcnRzLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gXCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU1wiO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMudXRpbHMgPSBleHBvcnRzLmVmZmVjdHMgPSBleHBvcnRzLmRldGFjaCA9IGV4cG9ydHMuQ0FOQ0VMID0gZXhwb3J0cy5kZWxheSA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IGV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuY2hhbm5lbCA9IGV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXhwb3J0cy5FTkQgPSBleHBvcnRzLnJ1blNhZ2EgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3MzkpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdydW5TYWdhJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3J1blNhZ2EucnVuU2FnYTtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuRU5EO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZXZlbnRDaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuZXZlbnRDaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9jaGFubmVsLmNoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2J1ZmZlcnMnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfYnVmZmVycy5idWZmZXJzO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVsYXknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVsYXk7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdDQU5DRUwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuQ0FOQ0VMO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGV0YWNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmRldGFjaDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUxKTtcblx0XG5cdHZhciBfbWlkZGxld2FyZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWlkZGxld2FyZSk7XG5cdFxuXHR2YXIgX2VmZmVjdHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0dmFyIGVmZmVjdHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2VmZmVjdHMpO1xuXHRcblx0dmFyIF91dGlsczIgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTMpO1xuXHRcblx0dmFyIHV0aWxzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF91dGlsczIpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBfbWlkZGxld2FyZTIuZGVmYXVsdDtcblx0ZXhwb3J0cy5lZmZlY3RzID0gZWZmZWN0cztcblx0ZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5ydW5TYWdhID0gcnVuU2FnYTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9wcm9jID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdHZhciBfcHJvYzIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvYyk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIFJVTl9TQUdBX1NJR05BVFVSRSA9ICdydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhLCAuLi5hcmdzKSc7XG5cdHZhciBOT05fR0VORVJBVE9SX0VSUiA9IFJVTl9TQUdBX1NJR05BVFVSRSArICc6IHNhZ2EgYXJndW1lbnQgbXVzdCBiZSBhIEdlbmVyYXRvciBmdW5jdGlvbiEnO1xuXHRcblx0ZnVuY3Rpb24gcnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSkge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB2b2lkIDA7XG5cdFxuXHQgIGlmIChfdXRpbHMuaXMuaXRlcmF0b3Ioc3RvcmVJbnRlcmZhY2UpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcblx0ICAgICAgKDAsIF91dGlscy5sb2cpKCd3YXJuJywgJ3J1blNhZ2EoaXRlcmF0b3IsIHN0b3JlSW50ZXJmYWNlKSBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBSVU5fU0FHQV9TSUdOQVRVUkUpO1xuXHQgICAgfVxuXHQgICAgaXRlcmF0b3IgPSBzdG9yZUludGVyZmFjZTtcblx0ICAgIHN0b3JlSW50ZXJmYWNlID0gc2FnYTtcblx0ICB9IGVsc2Uge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoc2FnYSwgX3V0aWxzLmlzLmZ1bmMsIE5PTl9HRU5FUkFUT1JfRVJSKTtcblx0ICAgIGl0ZXJhdG9yID0gc2FnYS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgIH1cblx0XG5cdCAgdmFyIF9zdG9yZUludGVyZmFjZSA9IHN0b3JlSW50ZXJmYWNlLFxuXHQgICAgICBzdWJzY3JpYmUgPSBfc3RvcmVJbnRlcmZhY2Uuc3Vic2NyaWJlLFxuXHQgICAgICBkaXNwYXRjaCA9IF9zdG9yZUludGVyZmFjZS5kaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGUgPSBfc3RvcmVJbnRlcmZhY2UuZ2V0U3RhdGUsXG5cdCAgICAgIGNvbnRleHQgPSBfc3RvcmVJbnRlcmZhY2UuY29udGV4dCxcblx0ICAgICAgc2FnYU1vbml0b3IgPSBfc3RvcmVJbnRlcmZhY2Uuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IF9zdG9yZUludGVyZmFjZS5sb2dnZXIsXG5cdCAgICAgIG9uRXJyb3IgPSBfc3RvcmVJbnRlcmZhY2Uub25FcnJvcjtcblx0XG5cdFxuXHQgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHRcblx0ICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgIC8vIG1vbml0b3JzIGFyZSBleHBlY3RlZCB0byBoYXZlIGEgY2VydGFpbiBpbnRlcmZhY2UsIGxldCdzIGZpbGwtaW4gYW55IG1pc3Npbmcgb25lc1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkID0gc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkID0gc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCB8fCBfdXRpbHMubm9vcDtcblx0XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQoeyBlZmZlY3RJZDogZWZmZWN0SWQsIHJvb3Q6IHRydWUsIHBhcmVudEVmZmVjdElkOiAwLCBlZmZlY3Q6IHsgcm9vdDogdHJ1ZSwgc2FnYTogc2FnYSwgYXJnczogYXJncyB9IH0pO1xuXHQgIH1cblx0XG5cdCAgdmFyIHRhc2sgPSAoMCwgX3Byb2MyLmRlZmF1bHQpKGl0ZXJhdG9yLCBzdWJzY3JpYmUsICgwLCBfdXRpbHMud3JhcFNhZ2FEaXNwYXRjaCkoZGlzcGF0Y2gpLCBnZXRTdGF0ZSwgY29udGV4dCwgeyBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsIGxvZ2dlcjogbG9nZ2VyLCBvbkVycm9yOiBvbkVycm9yIH0sIGVmZmVjdElkLCBzYWdhLm5hbWUpO1xuXHRcblx0ICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCB0YXNrKTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiB0YXNrO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0dmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0ZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xuXHRleHBvcnRzLmhhc093biA9IGhhc093bjtcblx0ZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG5cdGV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcblx0ZXhwb3J0cy5hcnJheU9mRGVmZmVyZWQgPSBhcnJheU9mRGVmZmVyZWQ7XG5cdGV4cG9ydHMuZGVsYXkgPSBkZWxheTtcblx0ZXhwb3J0cy5jcmVhdGVNb2NrVGFzayA9IGNyZWF0ZU1vY2tUYXNrO1xuXHRleHBvcnRzLmF1dG9JbmMgPSBhdXRvSW5jO1xuXHRleHBvcnRzLm1ha2VJdGVyYXRvciA9IG1ha2VJdGVyYXRvcjtcblx0ZXhwb3J0cy5sb2cgPSBsb2c7XG5cdGV4cG9ydHMuZGVwcmVjYXRlID0gZGVwcmVjYXRlO1xuXHR2YXIgc3ltID0gZXhwb3J0cy5zeW0gPSBmdW5jdGlvbiBzeW0oaWQpIHtcblx0ICByZXR1cm4gJ0BAcmVkdXgtc2FnYS8nICsgaWQ7XG5cdH07XG5cdFxuXHR2YXIgVEFTSyA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlRBU0sgPSBzeW0oJ1RBU0snKTtcblx0dmFyIEhFTFBFUiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkhFTFBFUiA9IHN5bSgnSEVMUEVSJyk7XG5cdHZhciBNQVRDSCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLk1BVENIID0gc3ltKCdNQVRDSCcpO1xuXHR2YXIgQ0FOQ0VMID0gLyojX19QVVJFX18qL2V4cG9ydHMuQ0FOQ0VMID0gc3ltKCdDQU5DRUxfUFJPTUlTRScpO1xuXHR2YXIgU0FHQV9BQ1RJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TQUdBX0FDVElPTiA9IHN5bSgnU0FHQV9BQ1RJT04nKTtcblx0dmFyIFNFTEZfQ0FOQ0VMTEFUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0VMRl9DQU5DRUxMQVRJT04gPSBzeW0oJ1NFTEZfQ0FOQ0VMTEFUSU9OJyk7XG5cdHZhciBrb25zdCA9IGV4cG9ydHMua29uc3QgPSBmdW5jdGlvbiBrb25zdCh2KSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB2O1xuXHQgIH07XG5cdH07XG5cdHZhciBrVHJ1ZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtUcnVlID0ga29uc3QodHJ1ZSk7XG5cdHZhciBrRmFsc2UgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rRmFsc2UgPSBrb25zdChmYWxzZSk7XG5cdHZhciBub29wID0gZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXHR2YXIgaWRlbnQgPSBleHBvcnRzLmlkZW50ID0gZnVuY3Rpb24gaWRlbnQodikge1xuXHQgIHJldHVybiB2O1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gY2hlY2sodmFsdWUsIHByZWRpY2F0ZSwgZXJyb3IpIHtcblx0ICBpZiAoIXByZWRpY2F0ZSh2YWx1ZSkpIHtcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgY2hlY2snLCBlcnJvcik7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuXHQgIH1cblx0fVxuXHRcblx0dmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblx0ZnVuY3Rpb24gaGFzT3duKG9iamVjdCwgcHJvcGVydHkpIHtcblx0ICByZXR1cm4gaXMubm90VW5kZWYob2JqZWN0KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xuXHR9XG5cdFxuXHR2YXIgaXMgPSBleHBvcnRzLmlzID0ge1xuXHQgIHVuZGVmOiBmdW5jdGlvbiB1bmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBub3RVbmRlZjogZnVuY3Rpb24gbm90VW5kZWYodikge1xuXHQgICAgcmV0dXJuIHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkO1xuXHQgIH0sXG5cdCAgZnVuYzogZnVuY3Rpb24gZnVuYyhmKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIGYgPT09ICdmdW5jdGlvbic7XG5cdCAgfSxcblx0ICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcihuKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIG4gPT09ICdudW1iZXInO1xuXHQgIH0sXG5cdCAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcocykge1xuXHQgICAgcmV0dXJuIHR5cGVvZiBzID09PSAnc3RyaW5nJztcblx0ICB9LFxuXHQgIGFycmF5OiBBcnJheS5pc0FycmF5LFxuXHQgIG9iamVjdDogZnVuY3Rpb24gb2JqZWN0KG9iaikge1xuXHQgICAgcmV0dXJuIG9iaiAmJiAhaXMuYXJyYXkob2JqKSAmJiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKSkgPT09ICdvYmplY3QnO1xuXHQgIH0sXG5cdCAgcHJvbWlzZTogZnVuY3Rpb24gcHJvbWlzZShwKSB7XG5cdCAgICByZXR1cm4gcCAmJiBpcy5mdW5jKHAudGhlbik7XG5cdCAgfSxcblx0ICBpdGVyYXRvcjogZnVuY3Rpb24gaXRlcmF0b3IoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKGl0Lm5leHQpICYmIGlzLmZ1bmMoaXQudGhyb3cpO1xuXHQgIH0sXG5cdCAgaXRlcmFibGU6IGZ1bmN0aW9uIGl0ZXJhYmxlKGl0KSB7XG5cdCAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhTeW1ib2wpID8gaXMuZnVuYyhpdFtTeW1ib2wuaXRlcmF0b3JdKSA6IGlzLmFycmF5KGl0KTtcblx0ICB9LFxuXHQgIHRhc2s6IGZ1bmN0aW9uIHRhc2sodCkge1xuXHQgICAgcmV0dXJuIHQgJiYgdFtUQVNLXTtcblx0ICB9LFxuXHQgIG9ic2VydmFibGU6IGZ1bmN0aW9uIG9ic2VydmFibGUob2IpIHtcblx0ICAgIHJldHVybiBvYiAmJiBpcy5mdW5jKG9iLnN1YnNjcmliZSk7XG5cdCAgfSxcblx0ICBidWZmZXI6IGZ1bmN0aW9uIGJ1ZmZlcihidWYpIHtcblx0ICAgIHJldHVybiBidWYgJiYgaXMuZnVuYyhidWYuaXNFbXB0eSkgJiYgaXMuZnVuYyhidWYudGFrZSkgJiYgaXMuZnVuYyhidWYucHV0KTtcblx0ICB9LFxuXHQgIHBhdHRlcm46IGZ1bmN0aW9uIHBhdHRlcm4ocGF0KSB7XG5cdCAgICByZXR1cm4gcGF0ICYmIChpcy5zdHJpbmcocGF0KSB8fCAodHlwZW9mIHBhdCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0KSkgPT09ICdzeW1ib2wnIHx8IGlzLmZ1bmMocGF0KSB8fCBpcy5hcnJheShwYXQpKTtcblx0ICB9LFxuXHQgIGNoYW5uZWw6IGZ1bmN0aW9uIGNoYW5uZWwoY2gpIHtcblx0ICAgIHJldHVybiBjaCAmJiBpcy5mdW5jKGNoLnRha2UpICYmIGlzLmZ1bmMoY2guY2xvc2UpO1xuXHQgIH0sXG5cdCAgaGVscGVyOiBmdW5jdGlvbiBoZWxwZXIoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpdFtIRUxQRVJdO1xuXHQgIH0sXG5cdCAgc3RyaW5nYWJsZUZ1bmM6IGZ1bmN0aW9uIHN0cmluZ2FibGVGdW5jKGYpIHtcblx0ICAgIHJldHVybiBpcy5mdW5jKGYpICYmIGhhc093bihmLCAndG9TdHJpbmcnKTtcblx0ICB9XG5cdH07XG5cdFxuXHR2YXIgb2JqZWN0ID0gZXhwb3J0cy5vYmplY3QgPSB7XG5cdCAgYXNzaWduOiBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcblx0ICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG5cdCAgICAgIGlmIChoYXNPd24oc291cmNlLCBpKSkge1xuXHQgICAgICAgIHRhcmdldFtpXSA9IHNvdXJjZVtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblx0XG5cdGZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuXHQgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cdCAgaWYgKGluZGV4ID49IDApIHtcblx0ICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgYXJyYXkgPSBleHBvcnRzLmFycmF5ID0ge1xuXHQgIGZyb206IGZ1bmN0aW9uIGZyb20ob2JqKSB7XG5cdCAgICB2YXIgYXJyID0gQXJyYXkob2JqLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBpIGluIG9iaikge1xuXHQgICAgICBpZiAoaGFzT3duKG9iaiwgaSkpIHtcblx0ICAgICAgICBhcnJbaV0gPSBvYmpbaV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBhcnI7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG5cdCAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblx0XG5cdCAgdmFyIGRlZiA9IF9leHRlbmRzKHt9LCBwcm9wcyk7XG5cdCAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICBkZWYucmVzb2x2ZSA9IHJlc29sdmU7XG5cdCAgICBkZWYucmVqZWN0ID0gcmVqZWN0O1xuXHQgIH0pO1xuXHQgIGRlZi5wcm9taXNlID0gcHJvbWlzZTtcblx0ICByZXR1cm4gZGVmO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcnJheU9mRGVmZmVyZWQobGVuZ3RoKSB7XG5cdCAgdmFyIGFyciA9IFtdO1xuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0ICAgIGFyci5wdXNoKGRlZmVycmVkKCkpO1xuXHQgIH1cblx0ICByZXR1cm4gYXJyO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBkZWxheShtcykge1xuXHQgIHZhciB2YWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cdFxuXHQgIHZhciB0aW1lb3V0SWQgPSB2b2lkIDA7XG5cdCAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHQgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHJldHVybiByZXNvbHZlKHZhbCk7XG5cdCAgICB9LCBtcyk7XG5cdCAgfSk7XG5cdFxuXHQgIHByb21pc2VbQ0FOQ0VMXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBjbGVhclRpbWVvdXQodGltZW91dElkKTtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gcHJvbWlzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlTW9ja1Rhc2soKSB7XG5cdCAgdmFyIF9yZWY7XG5cdFxuXHQgIHZhciBydW5uaW5nID0gdHJ1ZTtcblx0ICB2YXIgX3Jlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgX2Vycm9yID0gdm9pZCAwO1xuXHRcblx0ICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW1RBU0tdID0gdHJ1ZSwgX3JlZi5pc1J1bm5pbmcgPSBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG5cdCAgICByZXR1cm4gcnVubmluZztcblx0ICB9LCBfcmVmLnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcblx0ICAgIHJldHVybiBfcmVzdWx0O1xuXHQgIH0sIF9yZWYuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgIHJldHVybiBfZXJyb3I7XG5cdCAgfSwgX3JlZi5zZXRSdW5uaW5nID0gZnVuY3Rpb24gc2V0UnVubmluZyhiKSB7XG5cdCAgICByZXR1cm4gcnVubmluZyA9IGI7XG5cdCAgfSwgX3JlZi5zZXRSZXN1bHQgPSBmdW5jdGlvbiBzZXRSZXN1bHQocikge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQgPSByO1xuXHQgIH0sIF9yZWYuc2V0RXJyb3IgPSBmdW5jdGlvbiBzZXRFcnJvcihlKSB7XG5cdCAgICByZXR1cm4gX2Vycm9yID0gZTtcblx0ICB9LCBfcmVmO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhdXRvSW5jKCkge1xuXHQgIHZhciBzZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuICsrc2VlZDtcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgdWlkID0gLyojX19QVVJFX18qL2V4cG9ydHMudWlkID0gYXV0b0luYygpO1xuXHRcblx0dmFyIGtUaHJvdyA9IGZ1bmN0aW9uIGtUaHJvdyhlcnIpIHtcblx0ICB0aHJvdyBlcnI7XG5cdH07XG5cdHZhciBrUmV0dXJuID0gZnVuY3Rpb24ga1JldHVybih2YWx1ZSkge1xuXHQgIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xuXHR9O1xuXHRmdW5jdGlvbiBtYWtlSXRlcmF0b3IobmV4dCkge1xuXHQgIHZhciB0aHJvID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBrVGhyb3c7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgIHZhciBpc0hlbHBlciA9IGFyZ3VtZW50c1szXTtcblx0XG5cdCAgdmFyIGl0ZXJhdG9yID0geyBuYW1lOiBuYW1lLCBuZXh0OiBuZXh0LCB0aHJvdzogdGhybywgcmV0dXJuOiBrUmV0dXJuIH07XG5cdFxuXHQgIGlmIChpc0hlbHBlcikge1xuXHQgICAgaXRlcmF0b3JbSEVMUEVSXSA9IHRydWU7XG5cdCAgfVxuXHQgIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuXHQgICAgfTtcblx0ICB9XG5cdCAgcmV0dXJuIGl0ZXJhdG9yO1xuXHR9XG5cdFxuXHQvKipcblx0ICBQcmludCBlcnJvciBpbiBhIHVzZWZ1bCB3YXkgd2hldGhlciBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcblx0ICAod2l0aCBleHBhbmRhYmxlIGVycm9yIHN0YWNrIHRyYWNlcyksIG9yIGluIGEgbm9kZS5qcyBlbnZpcm9ubWVudFxuXHQgICh0ZXh0LW9ubHkgbG9nIG91dHB1dClcblx0ICoqL1xuXHRmdW5jdGlvbiBsb2cobGV2ZWwsIG1lc3NhZ2UpIHtcblx0ICB2YXIgZXJyb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHRcblx0ICAvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuXHQgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgY29uc29sZS5sb2coJ3JlZHV4LXNhZ2EgJyArIGxldmVsICsgJzogJyArIG1lc3NhZ2UgKyAnXFxuJyArIChlcnJvciAmJiBlcnJvci5zdGFjayB8fCBlcnJvcikpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBjb25zb2xlW2xldmVsXShtZXNzYWdlLCBlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBkZXByZWNhdGUoZm4sIGRlcHJlY2F0aW9uV2FybmluZykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGxvZygnd2FybicsIGRlcHJlY2F0aW9uV2FybmluZyk7XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1cGRhdGVJbmNlbnRpdmUgPSBleHBvcnRzLnVwZGF0ZUluY2VudGl2ZSA9IGZ1bmN0aW9uIHVwZGF0ZUluY2VudGl2ZShkZXByZWNhdGVkLCBwcmVmZXJyZWQpIHtcblx0ICByZXR1cm4gZGVwcmVjYXRlZCArICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgcHJlZmVycmVkICsgJywgcGxlYXNlIHVwZGF0ZSB5b3VyIGNvZGUnO1xuXHR9O1xuXHRcblx0dmFyIGludGVybmFsRXJyID0gZXhwb3J0cy5pbnRlcm5hbEVyciA9IGZ1bmN0aW9uIGludGVybmFsRXJyKGVycikge1xuXHQgIHJldHVybiBuZXcgRXJyb3IoJ1xcbiAgcmVkdXgtc2FnYTogRXJyb3IgY2hlY2tpbmcgaG9va3MgZGV0ZWN0ZWQgYW4gaW5jb25zaXN0ZW50IHN0YXRlLiBUaGlzIGlzIGxpa2VseSBhIGJ1Z1xcbiAgaW4gcmVkdXgtc2FnYSBjb2RlIGFuZCBub3QgeW91cnMuIFRoYW5rcyBmb3IgcmVwb3J0aW5nIHRoaXMgaW4gdGhlIHByb2plY3RcXCdzIGdpdGh1YiByZXBvLlxcbiAgRXJyb3I6ICcgKyBlcnIgKyAnXFxuJyk7XG5cdH07XG5cdFxuXHR2YXIgY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBleHBvcnRzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZnVuY3Rpb24gY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcoY3R4LCBwcm9wcykge1xuXHQgIHJldHVybiAoY3R4ID8gY3R4ICsgJy4nIDogJycpICsgJ3NldENvbnRleHQocHJvcHMpOiBhcmd1bWVudCAnICsgcHJvcHMgKyAnIGlzIG5vdCBhIHBsYWluIG9iamVjdCc7XG5cdH07XG5cdFxuXHR2YXIgd3JhcFNhZ2FEaXNwYXRjaCA9IGV4cG9ydHMud3JhcFNhZ2FEaXNwYXRjaCA9IGZ1bmN0aW9uIHdyYXBTYWdhRGlzcGF0Y2goZGlzcGF0Y2gpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuXHQgICAgcmV0dXJuIGRpc3BhdGNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhY3Rpb24sIFNBR0FfQUNUSU9OLCB7IHZhbHVlOiB0cnVlIH0pKTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGNsb25lYWJsZUdlbmVyYXRvciA9IGV4cG9ydHMuY2xvbmVhYmxlR2VuZXJhdG9yID0gZnVuY3Rpb24gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgaGlzdG9yeSA9IFtdO1xuXHQgICAgdmFyIGdlbiA9IGdlbmVyYXRvckZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIG5leHQ6IGZ1bmN0aW9uIG5leHQoYXJnKSB7XG5cdCAgICAgICAgaGlzdG9yeS5wdXNoKGFyZyk7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5uZXh0KGFyZyk7XG5cdCAgICAgIH0sXG5cdCAgICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcblx0ICAgICAgICB2YXIgY2xvbmVkR2VuID0gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAgICAgaGlzdG9yeS5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcblx0ICAgICAgICAgIHJldHVybiBjbG9uZWRHZW4ubmV4dChhcmcpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHJldHVybiBjbG9uZWRHZW47XG5cdCAgICAgIH0sXG5cdCAgICAgIHJldHVybjogZnVuY3Rpb24gX3JldHVybih2YWx1ZSkge1xuXHQgICAgICAgIHJldHVybiBnZW4ucmV0dXJuKHZhbHVlKTtcblx0ICAgICAgfSxcblx0ICAgICAgdGhyb3c6IGZ1bmN0aW9uIF90aHJvdyhleGNlcHRpb24pIHtcblx0ICAgICAgICByZXR1cm4gZ2VuLnRocm93KGV4Y2VwdGlvbik7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfTtcblx0fTtcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuVEFTS19DQU5DRUwgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0dmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gcHJvYztcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDIpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdGZ1bmN0aW9uIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhvYmosIGRlc2NzKSB7IGZvciAodmFyIGtleSBpbiBkZXNjcykgeyB2YXIgZGVzYyA9IGRlc2NzW2tleV07IGRlc2MuY29uZmlndXJhYmxlID0gZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBkZXNjKTsgfSByZXR1cm4gb2JqOyB9XG5cdFxuXHR2YXIgTk9UX0lURVJBVE9SX0VSUk9SID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSAncHJvYyBmaXJzdCBhcmd1bWVudCAoU2FnYSBmdW5jdGlvbiByZXN1bHQpIG11c3QgYmUgYW4gaXRlcmF0b3InO1xuXHRcblx0dmFyIENIQU5ORUxfRU5EID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IHtcblx0ICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG5cdCAgfVxuXHR9O1xuXHR2YXIgVEFTS19DQU5DRUwgPSBleHBvcnRzLlRBU0tfQ0FOQ0VMID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL1RBU0tfQ0FOQ0VMJztcblx0ICB9XG5cdH07XG5cdFxuXHR2YXIgbWF0Y2hlcnMgPSB7XG5cdCAgd2lsZGNhcmQ6IGZ1bmN0aW9uIHdpbGRjYXJkKCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5rVHJ1ZTtcblx0ICB9LFxuXHQgIGRlZmF1bHQ6IGZ1bmN0aW9uIF9kZWZhdWx0KHBhdHRlcm4pIHtcblx0ICAgIHJldHVybiAodHlwZW9mIHBhdHRlcm4gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhdHRlcm4pKSA9PT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IHBhdHRlcm47XG5cdCAgICB9IDogZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIHJldHVybiBpbnB1dC50eXBlID09PSBTdHJpbmcocGF0dGVybik7XG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgYXJyYXk6IGZ1bmN0aW9uIGFycmF5KHBhdHRlcm5zKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIHJldHVybiBwYXR0ZXJucy5zb21lKGZ1bmN0aW9uIChwKSB7XG5cdCAgICAgICAgcmV0dXJuIG1hdGNoZXIocCkoaW5wdXQpO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBwcmVkaWNhdGU6IGZ1bmN0aW9uIHByZWRpY2F0ZShfcHJlZGljYXRlKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIHJldHVybiBfcHJlZGljYXRlKGlucHV0KTtcblx0ICAgIH07XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gbWF0Y2hlcihwYXR0ZXJuKSB7XG5cdCAgLy8gcHJldHRpZXItaWdub3JlXG5cdCAgcmV0dXJuIChwYXR0ZXJuID09PSAnKicgPyBtYXRjaGVycy53aWxkY2FyZCA6IF91dGlscy5pcy5hcnJheShwYXR0ZXJuKSA/IG1hdGNoZXJzLmFycmF5IDogX3V0aWxzLmlzLnN0cmluZ2FibGVGdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMuZGVmYXVsdCA6IF91dGlscy5pcy5mdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMucHJlZGljYXRlIDogbWF0Y2hlcnMuZGVmYXVsdCkocGF0dGVybik7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFVzZWQgdG8gdHJhY2sgYSBwYXJlbnQgdGFzayBhbmQgaXRzIGZvcmtzXG5cdCAgSW4gdGhlIG5ldyBmb3JrIG1vZGVsLCBmb3JrZWQgdGFza3MgYXJlIGF0dGFjaGVkIGJ5IGRlZmF1bHQgdG8gdGhlaXIgcGFyZW50XG5cdCAgV2UgbW9kZWwgdGhpcyB1c2luZyB0aGUgY29uY2VwdCBvZiBQYXJlbnQgdGFzayAmJiBtYWluIFRhc2tcblx0ICBtYWluIHRhc2sgaXMgdGhlIG1haW4gZmxvdyBvZiB0aGUgY3VycmVudCBHZW5lcmF0b3IsIHRoZSBwYXJlbnQgdGFza3MgaXMgdGhlXG5cdCAgYWdncmVnYXRpb24gb2YgdGhlIG1haW4gdGFza3MgKyBhbGwgaXRzIGZvcmtlZCB0YXNrcy5cblx0ICBUaHVzIHRoZSB3aG9sZSBtb2RlbCByZXByZXNlbnRzIGFuIGV4ZWN1dGlvbiB0cmVlIHdpdGggbXVsdGlwbGUgYnJhbmNoZXMgKHZzIHRoZVxuXHQgIGxpbmVhciBleGVjdXRpb24gdHJlZSBpbiBzZXF1ZW50aWFsIChub24gcGFyYWxsZWwpIHByb2dyYW1taW5nKVxuXHRcblx0ICBBIHBhcmVudCB0YXNrcyBoYXMgdGhlIGZvbGxvd2luZyBzZW1hbnRpY3Ncblx0ICAtIEl0IGNvbXBsZXRlcyBpZiBhbGwgaXRzIGZvcmtzIGVpdGhlciBjb21wbGV0ZSBvciBhbGwgY2FuY2VsbGVkXG5cdCAgLSBJZiBpdCdzIGNhbmNlbGxlZCwgYWxsIGZvcmtzIGFyZSBjYW5jZWxsZWQgYXMgd2VsbFxuXHQgIC0gSXQgYWJvcnRzIGlmIGFueSB1bmNhdWdodCBlcnJvciBidWJibGVzIHVwIGZyb20gZm9ya3Ncblx0ICAtIElmIGl0IGNvbXBsZXRlcywgdGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgb25lIHJldHVybmVkIGJ5IHRoZSBtYWluIHRhc2tcblx0KiovXG5cdGZ1bmN0aW9uIGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgY2IpIHtcblx0ICB2YXIgdGFza3MgPSBbXSxcblx0ICAgICAgcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcblx0ICBhZGRUYXNrKG1haW5UYXNrKTtcblx0XG5cdCAgZnVuY3Rpb24gYWJvcnQoZXJyKSB7XG5cdCAgICBjYW5jZWxBbGwoKTtcblx0ICAgIGNiKGVyciwgdHJ1ZSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBhZGRUYXNrKHRhc2spIHtcblx0ICAgIHRhc2tzLnB1c2godGFzayk7XG5cdCAgICB0YXNrLmNvbnQgPSBmdW5jdGlvbiAocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAoMCwgX3V0aWxzLnJlbW92ZSkodGFza3MsIHRhc2spO1xuXHQgICAgICB0YXNrLmNvbnQgPSBfdXRpbHMubm9vcDtcblx0ICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgYWJvcnQocmVzKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZiAodGFzayA9PT0gbWFpblRhc2spIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlcztcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICBjYihyZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICAgIC8vIHRhc2suY29udC5jYW5jZWwgPSB0YXNrLmNhbmNlbFxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2FuY2VsQWxsKCkge1xuXHQgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgdGFza3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuXHQgICAgICB0LmNvbnQgPSBfdXRpbHMubm9vcDtcblx0ICAgICAgdC5jYW5jZWwoKTtcblx0ICAgIH0pO1xuXHQgICAgdGFza3MgPSBbXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBhZGRUYXNrOiBhZGRUYXNrLFxuXHQgICAgY2FuY2VsQWxsOiBjYW5jZWxBbGwsXG5cdCAgICBhYm9ydDogYWJvcnQsXG5cdCAgICBnZXRUYXNrczogZnVuY3Rpb24gZ2V0VGFza3MoKSB7XG5cdCAgICAgIHJldHVybiB0YXNrcztcblx0ICAgIH0sXG5cdCAgICB0YXNrTmFtZXM6IGZ1bmN0aW9uIHRhc2tOYW1lcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICAgIHJldHVybiB0Lm5hbWU7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNyZWF0ZVRhc2tJdGVyYXRvcihfcmVmKSB7XG5cdCAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG5cdCAgICAgIGZuID0gX3JlZi5mbixcblx0ICAgICAgYXJncyA9IF9yZWYuYXJncztcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihmbikpIHtcblx0ICAgIHJldHVybiBmbjtcblx0ICB9XG5cdFxuXHQgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MiBhbmQgIzQ0MVxuXHQgIHZhciByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGVycm9yID0gdm9pZCAwO1xuXHQgIHRyeSB7XG5cdCAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICB9IGNhdGNoIChlcnIpIHtcblx0ICAgIGVycm9yID0gZXJyO1xuXHQgIH1cblx0XG5cdCAgLy8gaS5lLiBhIGdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5zIGFuIGl0ZXJhdG9yXG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpKSB7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH1cblx0XG5cdCAgLy8gZG8gbm90IGJ1YmJsZSB1cCBzeW5jaHJvbm91cyBmYWlsdXJlcyBmb3IgZGV0YWNoZWQgZm9ya3Ncblx0ICAvLyBpbnN0ZWFkIGNyZWF0ZSBhIGZhaWxlZCB0YXNrLiBTZWUgIzE1MiBhbmQgIzQ0MVxuXHQgIHJldHVybiBlcnJvciA/ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBlcnJvcjtcblx0ICB9KSA6ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgcGMgPSB2b2lkIDA7XG5cdCAgICB2YXIgZWZmID0geyBkb25lOiBmYWxzZSwgdmFsdWU6IHJlc3VsdCB9O1xuXHQgICAgdmFyIHJldCA9IGZ1bmN0aW9uIHJldCh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdmFsdWUgfTtcblx0ICAgIH07XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICBpZiAoIXBjKSB7XG5cdCAgICAgICAgcGMgPSB0cnVlO1xuXHQgICAgICAgIHJldHVybiBlZmY7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIHJldChhcmcpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH0oKSk7XG5cdH1cblx0XG5cdHZhciB3cmFwSGVscGVyID0gZnVuY3Rpb24gd3JhcEhlbHBlcihoZWxwZXIpIHtcblx0ICByZXR1cm4geyBmbjogaGVscGVyIH07XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBwcm9jKGl0ZXJhdG9yKSB7XG5cdCAgdmFyIHN1YnNjcmliZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5ub29wO1xuXHQgIH07XG5cdCAgdmFyIGRpc3BhdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBfdXRpbHMubm9vcDtcblx0ICB2YXIgZ2V0U3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBwYXJlbnRDb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiB7fTtcblx0ICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDoge307XG5cdCAgdmFyIHBhcmVudEVmZmVjdElkID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiAwO1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDcgJiYgYXJndW1lbnRzWzddICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbN10gOiAnYW5vbnltb3VzJztcblx0ICB2YXIgY29udCA9IGFyZ3VtZW50c1s4XTtcblx0XG5cdCAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9UX0lURVJBVE9SX0VSUk9SKTtcblx0XG5cdCAgdmFyIGVmZmVjdHNTdHJpbmcgPSAnWy4uLmVmZmVjdHNdJztcblx0ICB2YXIgcnVuUGFyYWxsZWxFZmZlY3QgPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkocnVuQWxsRWZmZWN0LCAoMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoZWZmZWN0c1N0cmluZywgJ2FsbCgnICsgZWZmZWN0c1N0cmluZyArICcpJykpO1xuXHRcblx0ICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuXHQgICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblx0XG5cdCAgdmFyIGxvZyA9IGxvZ2dlciB8fCBfdXRpbHMubG9nO1xuXHQgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKGVycikge1xuXHQgICAgdmFyIG1lc3NhZ2UgPSBlcnIuc2FnYVN0YWNrO1xuXHRcblx0ICAgIGlmICghbWVzc2FnZSAmJiBlcnIuc3RhY2spIHtcblx0ICAgICAgbWVzc2FnZSA9IGVyci5zdGFjay5zcGxpdCgnXFxuJylbMF0uaW5kZXhPZihlcnIubWVzc2FnZSkgIT09IC0xID8gZXJyLnN0YWNrIDogJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UgKyAnXFxuJyArIGVyci5zdGFjaztcblx0ICAgIH1cblx0XG5cdCAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0ICcgKyBuYW1lLCBtZXNzYWdlIHx8IGVyci5tZXNzYWdlIHx8IGVycik7XG5cdCAgfTtcblx0ICB2YXIgc3RkQ2hhbm5lbCA9ICgwLCBfY2hhbm5lbC5zdGRDaGFubmVsKShzdWJzY3JpYmUpO1xuXHQgIHZhciB0YXNrQ29udGV4dCA9IE9iamVjdC5jcmVhdGUocGFyZW50Q29udGV4dCk7XG5cdCAgLyoqXG5cdCAgICBUcmFja3MgdGhlIGN1cnJlbnQgZWZmZWN0IGNhbmNlbGxhdGlvblxuXHQgICAgRWFjaCB0aW1lIHRoZSBnZW5lcmF0b3IgcHJvZ3Jlc3Nlcy4gY2FsbGluZyBydW5FZmZlY3Qgd2lsbCBzZXQgYSBuZXcgdmFsdWVcblx0ICAgIG9uIGl0LiBJdCBhbGxvd3MgcHJvcGFnYXRpbmcgY2FuY2VsbGF0aW9uIHRvIGNoaWxkIGVmZmVjdHNcblx0ICAqKi9cblx0ICBuZXh0LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHRcblx0ICAvKipcblx0ICAgIENyZWF0ZXMgYSBuZXcgdGFzayBkZXNjcmlwdG9yIGZvciB0aGlzIGdlbmVyYXRvciwgV2UnbGwgYWxzbyBjcmVhdGUgYSBtYWluIHRhc2tcblx0ICAgIHRvIHRyYWNrIHRoZSBtYWluIGZsb3cgKGJlc2lkZXMgb3RoZXIgZm9ya2VkIHRhc2tzKVxuXHQgICoqL1xuXHQgIHZhciB0YXNrID0gbmV3VGFzayhwYXJlbnRFZmZlY3RJZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpO1xuXHQgIHZhciBtYWluVGFzayA9IHsgbmFtZTogbmFtZSwgY2FuY2VsOiBjYW5jZWxNYWluLCBpc1J1bm5pbmc6IHRydWUgfTtcblx0ICB2YXIgdGFza1F1ZXVlID0gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBlbmQpO1xuXHRcblx0ICAvKipcblx0ICAgIGNhbmNlbGxhdGlvbiBvZiB0aGUgbWFpbiB0YXNrLiBXZSdsbCBzaW1wbHkgcmVzdW1lIHRoZSBHZW5lcmF0b3Igd2l0aCBhIENhbmNlbFxuXHQgICoqL1xuXHQgIGZ1bmN0aW9uIGNhbmNlbE1haW4oKSB7XG5cdCAgICBpZiAobWFpblRhc2suaXNSdW5uaW5nICYmICFtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuXHQgICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG5cdCAgICAgIG5leHQoVEFTS19DQU5DRUwpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgLyoqXG5cdCAgICBUaGlzIG1heSBiZSBjYWxsZWQgYnkgYSBwYXJlbnQgZ2VuZXJhdG9yIHRvIHRyaWdnZXIvcHJvcGFnYXRlIGNhbmNlbGxhdGlvblxuXHQgICAgY2FuY2VsIGFsbCBwZW5kaW5nIHRhc2tzIChpbmNsdWRpbmcgdGhlIG1haW4gdGFzayksIHRoZW4gZW5kIHRoZSBjdXJyZW50IHRhc2suXG5cdCAgICAgQ2FuY2VsbGF0aW9uIHByb3BhZ2F0ZXMgZG93biB0byB0aGUgd2hvbGUgZXhlY3V0aW9uIHRyZWUgaG9sZGVkIGJ5IHRoaXMgUGFyZW50IHRhc2tcblx0ICAgIEl0J3MgYWxzbyBwcm9wYWdhdGVkIHRvIGFsbCBqb2luZXJzIG9mIHRoaXMgdGFzayBhbmQgdGhlaXIgZXhlY3V0aW9uIHRyZWUvam9pbmVyc1xuXHQgICAgIENhbmNlbGxhdGlvbiBpcyBub29wIGZvciB0ZXJtaW5hdGVkL0NhbmNlbGxlZCB0YXNrcyB0YXNrc1xuXHQgICoqL1xuXHQgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcblx0ICAgIC8qKlxuXHQgICAgICBXZSBuZWVkIHRvIGNoZWNrIGJvdGggUnVubmluZyBhbmQgQ2FuY2VsbGVkIHN0YXR1c1xuXHQgICAgICBUYXNrcyBjYW4gYmUgQ2FuY2VsbGVkIGJ1dCBzdGlsbCBSdW5uaW5nXG5cdCAgICAqKi9cblx0ICAgIGlmIChpdGVyYXRvci5faXNSdW5uaW5nICYmICFpdGVyYXRvci5faXNDYW5jZWxsZWQpIHtcblx0ICAgICAgaXRlcmF0b3IuX2lzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgdGFza1F1ZXVlLmNhbmNlbEFsbCgpO1xuXHQgICAgICAvKipcblx0ICAgICAgICBFbmRpbmcgd2l0aCBhIE5ldmVyIHJlc3VsdCB3aWxsIHByb3BhZ2F0ZSB0aGUgQ2FuY2VsbGF0aW9uIHRvIGFsbCBqb2luZXJzXG5cdCAgICAgICoqL1xuXHQgICAgICBlbmQoVEFTS19DQU5DRUwpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgIGF0dGFjaGVzIGNhbmNlbGxhdGlvbiBsb2dpYyB0byB0aGlzIHRhc2sncyBjb250aW51YXRpb25cblx0ICAgIHRoaXMgd2lsbCBwZXJtaXQgY2FuY2VsbGF0aW9uIHRvIHByb3BhZ2F0ZSBkb3duIHRoZSBjYWxsIGNoYWluXG5cdCAgKiovXG5cdCAgY29udCAmJiAoY29udC5jYW5jZWwgPSBjYW5jZWwpO1xuXHRcblx0ICAvLyB0cmFja3MgdGhlIHJ1bm5pbmcgc3RhdHVzXG5cdCAgaXRlcmF0b3IuX2lzUnVubmluZyA9IHRydWU7XG5cdFxuXHQgIC8vIGtpY2tzIHVwIHRoZSBnZW5lcmF0b3Jcblx0ICBuZXh0KCk7XG5cdFxuXHQgIC8vIHRoZW4gcmV0dXJuIHRoZSB0YXNrIGRlc2NyaXB0b3IgdG8gdGhlIGNhbGxlclxuXHQgIHJldHVybiB0YXNrO1xuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgaXMgdGhlIGdlbmVyYXRvciBkcml2ZXJcblx0ICAgIEl0J3MgYSByZWN1cnNpdmUgYXN5bmMvY29udGludWF0aW9uIGZ1bmN0aW9uIHdoaWNoIGNhbGxzIGl0c2VsZlxuXHQgICAgdW50aWwgdGhlIGdlbmVyYXRvciB0ZXJtaW5hdGVzIG9yIHRocm93c1xuXHQgICoqL1xuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBpc0Vycikge1xuXHQgICAgLy8gUHJldmVudGl2ZSBtZWFzdXJlLiBJZiB3ZSBlbmQgdXAgaGVyZSwgdGhlbiB0aGVyZSBpcyByZWFsbHkgc29tZXRoaW5nIHdyb25nXG5cdCAgICBpZiAoIW1haW5UYXNrLmlzUnVubmluZykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byByZXN1bWUgYW4gYWxyZWFkeSBmaW5pc2hlZCBnZW5lcmF0b3InKTtcblx0ICAgIH1cblx0XG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci50aHJvdyhhcmcpO1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIGdldHRpbmcgVEFTS19DQU5DRUwgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSBtYWluIHRhc2tcblx0ICAgICAgICAgIFdlIGNhbiBnZXQgdGhpcyB2YWx1ZSBoZXJlXG5cdCAgICAgICAgICAgLSBCeSBjYW5jZWxsaW5nIHRoZSBwYXJlbnQgdGFzayBtYW51YWxseVxuXHQgICAgICAgICAgLSBCeSBqb2luaW5nIGEgQ2FuY2VsbGVkIHRhc2tcblx0ICAgICAgICAqKi9cblx0ICAgICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBDYW5jZWxzIHRoZSBjdXJyZW50IGVmZmVjdDsgdGhpcyB3aWxsIHByb3BhZ2F0ZSB0aGUgY2FuY2VsbGF0aW9uIGRvd24gdG8gYW55IGNhbGxlZCB0YXNrc1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG5leHQuY2FuY2VsKCk7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBJZiB0aGlzIEdlbmVyYXRvciBoYXMgYSBgcmV0dXJuYCBtZXRob2QgdGhlbiBpbnZva2VzIGl0XG5cdCAgICAgICAgICBUaGlzIHdpbGwganVtcCB0byB0aGUgZmluYWxseSBibG9ja1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oVEFTS19DQU5DRUwpIDogeyBkb25lOiB0cnVlLCB2YWx1ZTogVEFTS19DQU5DRUwgfTtcblx0ICAgICAgfSBlbHNlIGlmIChhcmcgPT09IENIQU5ORUxfRU5EKSB7XG5cdCAgICAgICAgLy8gV2UgZ2V0IENIQU5ORUxfRU5EIGJ5IHRha2luZyBmcm9tIGEgY2hhbm5lbCB0aGF0IGVuZGVkIHVzaW5nIGB0YWtlYCAoYW5kIG5vdCBgdGFrZW1gIHVzZWQgdG8gdHJhcCBFbmQgb2YgY2hhbm5lbHMpXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybigpIDogeyBkb25lOiB0cnVlIH07XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dChhcmcpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG5cdCAgICAgICAgcnVuRWZmZWN0KHJlc3VsdC52YWx1ZSwgcGFyZW50RWZmZWN0SWQsICcnLCBuZXh0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIFRoaXMgR2VuZXJhdG9yIGhhcyBlbmRlZCwgdGVybWluYXRlIHRoZSBtYWluIHRhc2sgYW5kIG5vdGlmeSB0aGUgZm9yayBxdWV1ZVxuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcblx0ICAgICAgICBtYWluVGFzay5jb250ICYmIG1haW5UYXNrLmNvbnQocmVzdWx0LnZhbHVlKTtcblx0ICAgICAgfVxuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgaWYgKG1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyb3IpO1xuXHQgICAgICB9XG5cdCAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcblx0ICAgICAgbWFpblRhc2suY29udChlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBlbmQocmVzdWx0LCBpc0Vycikge1xuXHQgICAgaXRlcmF0b3IuX2lzUnVubmluZyA9IGZhbHNlO1xuXHQgICAgc3RkQ2hhbm5lbC5jbG9zZSgpO1xuXHQgICAgaWYgKCFpc0Vycikge1xuXHQgICAgICBpdGVyYXRvci5fcmVzdWx0ID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlc29sdmUocmVzdWx0KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuXHQgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsICdzYWdhU3RhY2snLCB7XG5cdCAgICAgICAgICB2YWx1ZTogJ2F0ICcgKyBuYW1lICsgJyBcXG4gJyArIChyZXN1bHQuc2FnYVN0YWNrIHx8IHJlc3VsdC5zdGFjayksXG5cdCAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoIXRhc2suY29udCkge1xuXHQgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvciAmJiBvbkVycm9yKSB7XG5cdCAgICAgICAgICBvbkVycm9yKHJlc3VsdCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGxvZ0Vycm9yKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGl0ZXJhdG9yLl9lcnJvciA9IHJlc3VsdDtcblx0ICAgICAgaXRlcmF0b3IuX2lzQWJvcnRlZCA9IHRydWU7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVqZWN0KHJlc3VsdCk7XG5cdCAgICB9XG5cdCAgICB0YXNrLmNvbnQgJiYgdGFzay5jb250KHJlc3VsdCwgaXNFcnIpO1xuXHQgICAgdGFzay5qb2luZXJzLmZvckVhY2goZnVuY3Rpb24gKGopIHtcblx0ICAgICAgcmV0dXJuIGouY2IocmVzdWx0LCBpc0Vycik7XG5cdCAgICB9KTtcblx0ICAgIHRhc2suam9pbmVycyA9IG51bGw7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5FZmZlY3QoZWZmZWN0LCBwYXJlbnRFZmZlY3RJZCkge1xuXHQgICAgdmFyIGxhYmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblx0ICAgIHZhciBjYiA9IGFyZ3VtZW50c1szXTtcblx0XG5cdCAgICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblx0ICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcGFyZW50RWZmZWN0SWQ6IHBhcmVudEVmZmVjdElkLCBsYWJlbDogbGFiZWwsIGVmZmVjdDogZWZmZWN0IH0pO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgICBjb21wbGV0aW9uIGNhbGxiYWNrIGFuZCBjYW5jZWwgY2FsbGJhY2sgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuXHQgICAgICBXZSBjYW4ndCBjYW5jZWwgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG5cdCAgICAgIEFuZCBXZSBjYW4ndCBjb21wbGV0ZSBhbiBhbHJlYWR5IGNhbmNlbGxlZCBlZmZlY3RJZFxuXHQgICAgKiovXG5cdCAgICB2YXIgZWZmZWN0U2V0dGxlZCA9IHZvaWQgMDtcblx0XG5cdCAgICAvLyBDb21wbGV0aW9uIGNhbGxiYWNrIHBhc3NlZCB0byB0aGUgYXBwcm9wcmlhdGUgZWZmZWN0IHJ1bm5lclxuXHQgICAgZnVuY3Rpb24gY3VyckNiKHJlcywgaXNFcnIpIHtcblx0ICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuXHQgICAgICBjYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblx0ICAgICAgaWYgKHNhZ2FNb25pdG9yKSB7XG5cdCAgICAgICAgaXNFcnIgPyBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZChlZmZlY3RJZCwgcmVzKSA6IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCByZXMpO1xuXHQgICAgICB9XG5cdCAgICAgIGNiKHJlcywgaXNFcnIpO1xuXHQgICAgfVxuXHQgICAgLy8gdHJhY2tzIGRvd24gdGhlIGN1cnJlbnQgY2FuY2VsXG5cdCAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgICAgLy8gc2V0dXAgY2FuY2VsbGF0aW9uIGxvZ2ljIG9uIHRoZSBwYXJlbnQgY2Jcblx0ICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gcHJldmVudHMgY2FuY2VsbGluZyBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuXHQgICAgICAvKipcblx0ICAgICAgICBwcm9wYWdhdGVzIGNhbmNlbCBkb3dud2FyZFxuXHQgICAgICAgIGNhdGNoIHVuY2F1Z2h0IGNhbmNlbGxhdGlvbnMgZXJyb3JzOyBzaW5jZSB3ZSBjYW4gbm8gbG9uZ2VyIGNhbGwgdGhlIGNvbXBsZXRpb25cblx0ICAgICAgICBjYWxsYmFjaywgbG9nIGVycm9ycyByYWlzZWQgZHVyaW5nIGNhbmNlbGxhdGlvbnMgaW50byB0aGUgY29uc29sZVxuXHQgICAgICAqKi9cblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBjdXJyQ2IuY2FuY2VsKCk7XG5cdCAgICAgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgICAgIGxvZ0Vycm9yKGVycik7XG5cdCAgICAgIH1cblx0ICAgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHRcblx0ICAgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkKGVmZmVjdElkKTtcblx0ICAgIH07XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGVhY2ggZWZmZWN0IHJ1bm5lciBtdXN0IGF0dGFjaCBpdHMgb3duIGxvZ2ljIG9mIGNhbmNlbGxhdGlvbiB0byB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcblx0ICAgICAgaXQgYWxsb3dzIHRoaXMgZ2VuZXJhdG9yIHRvIHByb3BhZ2F0ZSBjYW5jZWxsYXRpb24gZG93bndhcmQuXG5cdCAgICAgICBBVFRFTlRJT04hIGVmZmVjdCBydW5uZXJzIG11c3Qgc2V0dXAgdGhlIGNhbmNlbCBsb2dpYyBieSBzZXR0aW5nIGNiLmNhbmNlbCA9IFtjYW5jZWxNZXRob2RdXG5cdCAgICAgIEFuZCB0aGUgc2V0dXAgbXVzdCBvY2N1ciBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2tcblx0ICAgICAgIFRoaXMgaXMgYSBzb3J0IG9mIGludmVyc2lvbiBvZiBjb250cm9sOiBjYWxsZWQgYXN5bmMgZnVuY3Rpb25zIGFyZSByZXNwb25zaWJsZVxuXHQgICAgICBmb3IgY29tcGxldGluZyB0aGUgZmxvdyBieSBjYWxsaW5nIHRoZSBwcm92aWRlZCBjb250aW51YXRpb247IHdoaWxlIGNhbGxlciBmdW5jdGlvbnNcblx0ICAgICAgYXJlIHJlc3BvbnNpYmxlIGZvciBhYm9ydGluZyB0aGUgY3VycmVudCBmbG93IGJ5IGNhbGxpbmcgdGhlIGF0dGFjaGVkIGNhbmNlbCBmdW5jdGlvblxuXHQgICAgICAgTGlicmFyeSB1c2VycyBjYW4gYXR0YWNoIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWMgdG8gcHJvbWlzZXMgYnkgZGVmaW5pbmcgYVxuXHQgICAgICBwcm9taXNlW0NBTkNFTF0gbWV0aG9kIGluIHRoZWlyIHJldHVybmVkIHByb21pc2VzXG5cdCAgICAgIEFUVEVOVElPTiEgY2FsbGluZyBjYW5jZWwgbXVzdCBoYXZlIG5vIGVmZmVjdCBvbiBhbiBhbHJlYWR5IGNvbXBsZXRlZCBvciBjYW5jZWxsZWQgZWZmZWN0XG5cdCAgICAqKi9cblx0ICAgIHZhciBkYXRhID0gdm9pZCAwO1xuXHQgICAgLy8gcHJldHRpZXItaWdub3JlXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICAvLyBOb24gZGVjbGFyYXRpdmUgZWZmZWN0XG5cdCAgICAgIF91dGlscy5pcy5wcm9taXNlKGVmZmVjdCkgPyByZXNvbHZlUHJvbWlzZShlZmZlY3QsIGN1cnJDYikgOiBfdXRpbHMuaXMuaGVscGVyKGVmZmVjdCkgPyBydW5Gb3JrRWZmZWN0KHdyYXBIZWxwZXIoZWZmZWN0KSwgZWZmZWN0SWQsIGN1cnJDYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IoZWZmZWN0KSA/IHJlc29sdmVJdGVyYXRvcihlZmZlY3QsIGVmZmVjdElkLCBuYW1lLCBjdXJyQ2IpXG5cdFxuXHQgICAgICAvLyBkZWNsYXJhdGl2ZSBlZmZlY3RzXG5cdCAgICAgIDogX3V0aWxzLmlzLmFycmF5KGVmZmVjdCkgPyBydW5QYXJhbGxlbEVmZmVjdChlZmZlY3QsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QudGFrZShlZmZlY3QpKSA/IHJ1blRha2VFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnB1dChlZmZlY3QpKSA/IHJ1blB1dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWxsKGVmZmVjdCkpID8gcnVuQWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucmFjZShlZmZlY3QpKSA/IHJ1blJhY2VFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYWxsKGVmZmVjdCkpID8gcnVuQ2FsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNwcyhlZmZlY3QpKSA/IHJ1bkNQU0VmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZm9yayhlZmZlY3QpKSA/IHJ1bkZvcmtFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5qb2luKGVmZmVjdCkpID8gcnVuSm9pbkVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsKGVmZmVjdCkpID8gcnVuQ2FuY2VsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZWxlY3QoZWZmZWN0KSkgPyBydW5TZWxlY3RFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFjdGlvbkNoYW5uZWwoZWZmZWN0KSkgPyBydW5DaGFubmVsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mbHVzaChlZmZlY3QpKSA/IHJ1bkZsdXNoRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWxsZWQoZWZmZWN0KSkgPyBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmdldENvbnRleHQoZWZmZWN0KSkgPyBydW5HZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuU2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogLyogYW55dGhpbmcgZWxzZSByZXR1cm5lZCBhcyBpcyAqL2N1cnJDYihlZmZlY3QpXG5cdCAgICApO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgY2IpIHtcblx0ICAgIHZhciBjYW5jZWxQcm9taXNlID0gcHJvbWlzZVtfdXRpbHMuQ0FOQ0VMXTtcblx0ICAgIGlmIChfdXRpbHMuaXMuZnVuYyhjYW5jZWxQcm9taXNlKSkge1xuXHQgICAgICBjYi5jYW5jZWwgPSBjYW5jZWxQcm9taXNlO1xuXHQgICAgfSBlbHNlIGlmIChfdXRpbHMuaXMuZnVuYyhwcm9taXNlLmFib3J0KSkge1xuXHQgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIHByb21pc2UuYWJvcnQoKTtcblx0ICAgICAgfTtcblx0ICAgICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgZm9yIHRoZSBmZXRjaCBBUEksIHdoZW5ldmVyIHRoZXkgZ2V0IGFyb3VuZCB0b1xuXHQgICAgICAvLyBhZGRpbmcgY2FuY2VsIHN1cHBvcnRcblx0ICAgIH1cblx0ICAgIHByb21pc2UudGhlbihjYiwgZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJlc29sdmVJdGVyYXRvcihpdGVyYXRvciwgZWZmZWN0SWQsIG5hbWUsIGNiKSB7XG5cdCAgICBwcm9jKGl0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBuYW1lLCBjYik7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5UYWtlRWZmZWN0KF9yZWYyLCBjYikge1xuXHQgICAgdmFyIGNoYW5uZWwgPSBfcmVmMi5jaGFubmVsLFxuXHQgICAgICAgIHBhdHRlcm4gPSBfcmVmMi5wYXR0ZXJuLFxuXHQgICAgICAgIG1heWJlID0gX3JlZjIubWF5YmU7XG5cdFxuXHQgICAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgc3RkQ2hhbm5lbDtcblx0ICAgIHZhciB0YWtlQ2IgPSBmdW5jdGlvbiB0YWtlQ2IoaW5wKSB7XG5cdCAgICAgIHJldHVybiBpbnAgaW5zdGFuY2VvZiBFcnJvciA/IGNiKGlucCwgdHJ1ZSkgOiAoMCwgX2NoYW5uZWwuaXNFbmQpKGlucCkgJiYgIW1heWJlID8gY2IoQ0hBTk5FTF9FTkQpIDogY2IoaW5wKTtcblx0ICAgIH07XG5cdCAgICB0cnkge1xuXHQgICAgICBjaGFubmVsLnRha2UodGFrZUNiLCBtYXRjaGVyKHBhdHRlcm4pKTtcblx0ICAgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgICByZXR1cm4gY2IoZXJyLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIGNiLmNhbmNlbCA9IHRha2VDYi5jYW5jZWw7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5QdXRFZmZlY3QoX3JlZjMsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYzLmNoYW5uZWwsXG5cdCAgICAgICAgYWN0aW9uID0gX3JlZjMuYWN0aW9uLFxuXHQgICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgICBTY2hlZHVsZSB0aGUgcHV0IGluIGNhc2UgYW5vdGhlciBzYWdhIGlzIGhvbGRpbmcgYSBsb2NrLlxuXHQgICAgICBUaGUgcHV0IHdpbGwgYmUgZXhlY3V0ZWQgYXRvbWljYWxseS4gaWUgbmVzdGVkIHB1dHMgd2lsbCBleGVjdXRlIGFmdGVyXG5cdCAgICAgIHRoaXMgcHV0IGhhcyB0ZXJtaW5hdGVkLlxuXHQgICAgKiovXG5cdCAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgcmVzdWx0ID0gKGNoYW5uZWwgPyBjaGFubmVsLnB1dCA6IGRpc3BhdGNoKShhY3Rpb24pO1xuXHQgICAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICAgIC8vIElmIHdlIGhhdmUgYSBjaGFubmVsIG9yIGBwdXQucmVzb2x2ZWAgd2FzIHVzZWQgdGhlbiBidWJibGUgdXAgdGhlIGVycm9yLlxuXHQgICAgICAgIGlmIChjaGFubmVsIHx8IHJlc29sdmUpIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyb3IpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAocmVzb2x2ZSAmJiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpKSB7XG5cdCAgICAgICAgcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYik7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKHJlc3VsdCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgLy8gUHV0IGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNhbGxFZmZlY3QoX3JlZjQsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGNvbnRleHQgPSBfcmVmNC5jb250ZXh0LFxuXHQgICAgICAgIGZuID0gX3JlZjQuZm4sXG5cdCAgICAgICAgYXJncyA9IF9yZWY0LmFyZ3M7XG5cdFxuXHQgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuXHQgICAgdHJ5IHtcblx0ICAgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkgPyByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpID8gcmVzb2x2ZUl0ZXJhdG9yKHJlc3VsdCwgZWZmZWN0SWQsIGZuLm5hbWUsIGNiKSA6IGNiKHJlc3VsdCk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DUFNFZmZlY3QoX3JlZjUsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY1LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNS5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjUuYXJncztcblx0XG5cdCAgICAvLyBDUFMgKGllIG5vZGUgc3R5bGUgZnVuY3Rpb25zKSBjYW4gZGVmaW5lIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWNcblx0ICAgIC8vIGJ5IHNldHRpbmcgY2FuY2VsIGZpZWxkIG9uIHRoZSBjYlxuXHRcblx0ICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIGNwc0NiID0gZnVuY3Rpb24gY3BzQ2IoZXJyLCByZXMpIHtcblx0ICAgICAgICByZXR1cm4gX3V0aWxzLmlzLnVuZGVmKGVycikgPyBjYihyZXMpIDogY2IoZXJyLCB0cnVlKTtcblx0ICAgICAgfTtcblx0ICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoY3BzQ2IpKTtcblx0ICAgICAgaWYgKGNwc0NiLmNhbmNlbCkge1xuXHQgICAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIHJldHVybiBjcHNDYi5jYW5jZWwoKTtcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuRm9ya0VmZmVjdChfcmVmNiwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY2LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNi5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjYuYXJncyxcblx0ICAgICAgICBkZXRhY2hlZCA9IF9yZWY2LmRldGFjaGVkO1xuXHRcblx0ICAgIHZhciB0YXNrSXRlcmF0b3IgPSBjcmVhdGVUYXNrSXRlcmF0b3IoeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfSk7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgKDAsIF9zY2hlZHVsZXIuc3VzcGVuZCkoKTtcblx0ICAgICAgdmFyIF90YXNrID0gcHJvYyh0YXNrSXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIGZuLm5hbWUsIGRldGFjaGVkID8gbnVsbCA6IF91dGlscy5ub29wKTtcblx0XG5cdCAgICAgIGlmIChkZXRhY2hlZCkge1xuXHQgICAgICAgIGNiKF90YXNrKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZiAodGFza0l0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIHRhc2tRdWV1ZS5hZGRUYXNrKF90YXNrKTtcblx0ICAgICAgICAgIGNiKF90YXNrKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKHRhc2tJdGVyYXRvci5fZXJyb3IpIHtcblx0ICAgICAgICAgIHRhc2tRdWV1ZS5hYm9ydCh0YXNrSXRlcmF0b3IuX2Vycm9yKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgKDAsIF9zY2hlZHVsZXIuZmx1c2gpKCk7XG5cdCAgICB9XG5cdCAgICAvLyBGb3JrIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkpvaW5FZmZlY3QodCwgY2IpIHtcblx0ICAgIGlmICh0LmlzUnVubmluZygpKSB7XG5cdCAgICAgIHZhciBqb2luZXIgPSB7IHRhc2s6IHRhc2ssIGNiOiBjYiB9O1xuXHQgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0LmpvaW5lcnMsIGpvaW5lcik7XG5cdCAgICAgIH07XG5cdCAgICAgIHQuam9pbmVycy5wdXNoKGpvaW5lcik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0LmlzQWJvcnRlZCgpID8gY2IodC5lcnJvcigpLCB0cnVlKSA6IGNiKHQucmVzdWx0KCkpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsRWZmZWN0KHRhc2tUb0NhbmNlbCwgY2IpIHtcblx0ICAgIGlmICh0YXNrVG9DYW5jZWwgPT09IF91dGlscy5TRUxGX0NBTkNFTExBVElPTikge1xuXHQgICAgICB0YXNrVG9DYW5jZWwgPSB0YXNrO1xuXHQgICAgfVxuXHQgICAgaWYgKHRhc2tUb0NhbmNlbC5pc1J1bm5pbmcoKSkge1xuXHQgICAgICB0YXNrVG9DYW5jZWwuY2FuY2VsKCk7XG5cdCAgICB9XG5cdCAgICBjYigpO1xuXHQgICAgLy8gY2FuY2VsIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkFsbEVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7XG5cdFxuXHQgICAgaWYgKCFrZXlzLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10gOiB7fSk7XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGNvbXBsZXRlZENvdW50ID0gMDtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIgcmVzdWx0cyA9IHt9O1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAgZnVuY3Rpb24gY2hlY2tFZmZlY3RFbmQoKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWRDb3VudCA9PT0ga2V5cy5sZW5ndGgpIHtcblx0ICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IF91dGlscy5hcnJheS5mcm9tKF9leHRlbmRzKHt9LCByZXN1bHRzLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzdWx0cyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcblx0ICAgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChpc0VyciB8fCAoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgfHwgcmVzID09PSBDSEFOTkVMX0VORCB8fCByZXMgPT09IFRBU0tfQ0FOQ0VMKSB7XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgaXNFcnIpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICByZXN1bHRzW2tleV0gPSByZXM7XG5cdCAgICAgICAgICBjb21wbGV0ZWRDb3VudCsrO1xuXHQgICAgICAgICAgY2hlY2tFZmZlY3RFbmQoKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH07XG5cdCAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0ICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcblx0ICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICByZXR1cm4gcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG5cdCAgICB9KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blJhY2VFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29tcGxldGVkID0gdm9pZCAwO1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0ICAgIHZhciBjaGlsZENicyA9IHt9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgICAgLy8gUmFjZSBBdXRvIGNhbmNlbGxhdGlvblxuXHQgICAgICAgICAgY2IuY2FuY2VsKCk7XG5cdCAgICAgICAgICBjYihyZXMsIHRydWUpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoISgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSAmJiByZXMgIT09IENIQU5ORUxfRU5EICYmIHJlcyAhPT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIHZhciBfcmVzcG9uc2U7XG5cdFxuXHQgICAgICAgICAgY2IuY2FuY2VsKCk7XG5cdCAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgICAgdmFyIHJlc3BvbnNlID0gKF9yZXNwb25zZSA9IHt9LCBfcmVzcG9uc2Vba2V5XSA9IHJlcywgX3Jlc3BvbnNlKTtcblx0ICAgICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdLnNsaWNlLmNhbGwoX2V4dGVuZHMoe30sIHJlc3BvbnNlLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzcG9uc2UpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyB1bm5lY2Vzc2FyeSBjYW5jZWxsYXRpb25cblx0ICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcblx0ICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG5cdCAgICB9KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNlbGVjdEVmZmVjdChfcmVmNywgY2IpIHtcblx0ICAgIHZhciBzZWxlY3RvciA9IF9yZWY3LnNlbGVjdG9yLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNy5hcmdzO1xuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciBzdGF0ZSA9IHNlbGVjdG9yLmFwcGx5KHVuZGVmaW5lZCwgW2dldFN0YXRlKCldLmNvbmNhdChhcmdzKSk7XG5cdCAgICAgIGNiKHN0YXRlKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNoYW5uZWxFZmZlY3QoX3JlZjgsIGNiKSB7XG5cdCAgICB2YXIgcGF0dGVybiA9IF9yZWY4LnBhdHRlcm4sXG5cdCAgICAgICAgYnVmZmVyID0gX3JlZjguYnVmZmVyO1xuXHRcblx0ICAgIHZhciBtYXRjaCA9IG1hdGNoZXIocGF0dGVybik7XG5cdCAgICBtYXRjaC5wYXR0ZXJuID0gcGF0dGVybjtcblx0ICAgIGNiKCgwLCBfY2hhbm5lbC5ldmVudENoYW5uZWwpKHN1YnNjcmliZSwgYnVmZmVyIHx8IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKSwgbWF0Y2gpKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjYikge1xuXHQgICAgY2IoISFtYWluVGFzay5pc0NhbmNlbGxlZCk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5GbHVzaEVmZmVjdChjaGFubmVsLCBjYikge1xuXHQgICAgY2hhbm5lbC5mbHVzaChjYik7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5HZXRDb250ZXh0RWZmZWN0KHByb3AsIGNiKSB7XG5cdCAgICBjYih0YXNrQ29udGV4dFtwcm9wXSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5TZXRDb250ZXh0RWZmZWN0KHByb3BzLCBjYikge1xuXHQgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcblx0ICAgIGNiKCk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBuZXdUYXNrKGlkLCBuYW1lLCBpdGVyYXRvciwgY29udCkge1xuXHQgICAgdmFyIF9kb25lLCBfcmVmOSwgX211dGF0b3JNYXA7XG5cdFxuXHQgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gbnVsbDtcblx0ICAgIHJldHVybiBfcmVmOSA9IHt9LCBfcmVmOVtfdXRpbHMuVEFTS10gPSB0cnVlLCBfcmVmOS5pZCA9IGlkLCBfcmVmOS5uYW1lID0gbmFtZSwgX2RvbmUgPSAnZG9uZScsIF9tdXRhdG9yTWFwID0ge30sIF9tdXRhdG9yTWFwW19kb25lXSA9IF9tdXRhdG9yTWFwW19kb25lXSB8fCB7fSwgX211dGF0b3JNYXBbX2RvbmVdLmdldCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCkge1xuXHQgICAgICAgIHJldHVybiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucHJvbWlzZTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZGVmID0gKDAsIF91dGlscy5kZWZlcnJlZCkoKTtcblx0ICAgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBkZWY7XG5cdCAgICAgICAgaWYgKCFpdGVyYXRvci5faXNSdW5uaW5nKSB7XG5cdCAgICAgICAgICBpdGVyYXRvci5fZXJyb3IgPyBkZWYucmVqZWN0KGl0ZXJhdG9yLl9lcnJvcikgOiBkZWYucmVzb2x2ZShpdGVyYXRvci5fcmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuXHQgICAgICB9XG5cdCAgICB9LCBfcmVmOS5jb250ID0gY29udCwgX3JlZjkuam9pbmVycyA9IFtdLCBfcmVmOS5jYW5jZWwgPSBjYW5jZWwsIF9yZWY5LmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc1J1bm5pbmc7XG5cdCAgICB9LCBfcmVmOS5pc0NhbmNlbGxlZCA9IGZ1bmN0aW9uIGlzQ2FuY2VsbGVkKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQ2FuY2VsbGVkO1xuXHQgICAgfSwgX3JlZjkuaXNBYm9ydGVkID0gZnVuY3Rpb24gaXNBYm9ydGVkKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQWJvcnRlZDtcblx0ICAgIH0sIF9yZWY5LnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9yZXN1bHQ7XG5cdCAgICB9LCBfcmVmOS5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2Vycm9yO1xuXHQgICAgfSwgX3JlZjkuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcblx0ICAgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCd0YXNrJywgcHJvcHMpKTtcblx0ICAgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcblx0ICAgIH0sIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhfcmVmOSwgX211dGF0b3JNYXApLCBfcmVmOTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuYXNhcCA9IGFzYXA7XG5cdGV4cG9ydHMuc3VzcGVuZCA9IHN1c3BlbmQ7XG5cdGV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcblx0dmFyIHF1ZXVlID0gW107XG5cdC8qKlxuXHQgIFZhcmlhYmxlIHRvIGhvbGQgYSBjb3VudGluZyBzZW1hcGhvcmVcblx0ICAtIEluY3JlbWVudGluZyBhZGRzIGEgbG9jayBhbmQgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHN1c3BlbmRlZGAgc3RhdGUgKGlmIGl0J3Mgbm90XG5cdCAgICBhbHJlYWR5IHN1c3BlbmRlZClcblx0ICAtIERlY3JlbWVudGluZyByZWxlYXNlcyBhIGxvY2suIFplcm8gbG9ja3MgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS4gVGhpc1xuXHQgICAgdHJpZ2dlcnMgZmx1c2hpbmcgdGhlIHF1ZXVlZCB0YXNrcy5cblx0KiovXG5cdHZhciBzZW1hcGhvcmUgPSAwO1xuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgYSB0YXNrICdhdG9taWNhbGx5Jy4gVGFza3Mgc2NoZWR1bGVkIGR1cmluZyB0aGlzIGV4ZWN1dGlvbiB3aWxsIGJlIHF1ZXVlZFxuXHQgIGFuZCBmbHVzaGVkIGFmdGVyIHRoaXMgdGFzayBoYXMgZmluaXNoZWQgKGFzc3VtaW5nIHRoZSBzY2hlZHVsZXIgZW5kdXAgaW4gYSByZWxlYXNlZFxuXHQgIHN0YXRlKS5cblx0KiovXG5cdGZ1bmN0aW9uIGV4ZWModGFzaykge1xuXHQgIHRyeSB7XG5cdCAgICBzdXNwZW5kKCk7XG5cdCAgICB0YXNrKCk7XG5cdCAgfSBmaW5hbGx5IHtcblx0ICAgIHJlbGVhc2UoKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIEV4ZWN1dGVzIG9yIHF1ZXVlcyBhIHRhc2sgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiB0aGUgc2NoZWR1bGVyIChgc3VzcGVuZGVkYCBvciBgcmVsZWFzZWRgKVxuXHQqKi9cblx0ZnVuY3Rpb24gYXNhcCh0YXNrKSB7XG5cdCAgcXVldWUucHVzaCh0YXNrKTtcblx0XG5cdCAgaWYgKCFzZW1hcGhvcmUpIHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIGZsdXNoKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZS4gU2NoZWR1bGVkIHRhc2tzIHdpbGwgYmUgcXVldWVkIHVudGlsIHRoZVxuXHQgIHNjaGVkdWxlciBpcyByZWxlYXNlZC5cblx0KiovXG5cdGZ1bmN0aW9uIHN1c3BlbmQoKSB7XG5cdCAgc2VtYXBob3JlKys7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiByZWxlYXNlKCkge1xuXHQgIHNlbWFwaG9yZS0tO1xuXHR9XG5cdFxuXHQvKipcblx0ICBSZWxlYXNlcyB0aGUgY3VycmVudCBsb2NrLiBFeGVjdXRlcyBhbGwgcXVldWVkIHRhc2tzIGlmIHRoZSBzY2hlZHVsZXIgaXMgaW4gdGhlIHJlbGVhc2VkIHN0YXRlLlxuXHQqKi9cblx0ZnVuY3Rpb24gZmx1c2goKSB7XG5cdCAgcmVsZWFzZSgpO1xuXHRcblx0ICB2YXIgdGFzayA9IHZvaWQgMDtcblx0ICB3aGlsZSAoIXNlbWFwaG9yZSAmJiAodGFzayA9IHF1ZXVlLnNoaWZ0KCkpICE9PSB1bmRlZmluZWQpIHtcblx0ICAgIGV4ZWModGFzayk7XG5cdCAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc0VmZmVjdCA9IGV4cG9ydHMudGFrZW0gPSBleHBvcnRzLmRldGFjaCA9IHVuZGVmaW5lZDtcblx0ZXhwb3J0cy50YWtlID0gdGFrZTtcblx0ZXhwb3J0cy5wdXQgPSBwdXQ7XG5cdGV4cG9ydHMuYWxsID0gYWxsO1xuXHRleHBvcnRzLnJhY2UgPSByYWNlO1xuXHRleHBvcnRzLmNhbGwgPSBjYWxsO1xuXHRleHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5cdGV4cG9ydHMuY3BzID0gY3BzO1xuXHRleHBvcnRzLmZvcmsgPSBmb3JrO1xuXHRleHBvcnRzLnNwYXduID0gc3Bhd247XG5cdGV4cG9ydHMuam9pbiA9IGpvaW47XG5cdGV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuXHRleHBvcnRzLnNlbGVjdCA9IHNlbGVjdDtcblx0ZXhwb3J0cy5hY3Rpb25DaGFubmVsID0gYWN0aW9uQ2hhbm5lbDtcblx0ZXhwb3J0cy5jYW5jZWxsZWQgPSBjYW5jZWxsZWQ7XG5cdGV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcblx0ZXhwb3J0cy5nZXRDb250ZXh0ID0gZ2V0Q29udGV4dDtcblx0ZXhwb3J0cy5zZXRDb250ZXh0ID0gc2V0Q29udGV4dDtcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHR2YXIgSU8gPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5zeW0pKCdJTycpO1xuXHR2YXIgVEFLRSA9ICdUQUtFJztcblx0dmFyIFBVVCA9ICdQVVQnO1xuXHR2YXIgQUxMID0gJ0FMTCc7XG5cdHZhciBSQUNFID0gJ1JBQ0UnO1xuXHR2YXIgQ0FMTCA9ICdDQUxMJztcblx0dmFyIENQUyA9ICdDUFMnO1xuXHR2YXIgRk9SSyA9ICdGT1JLJztcblx0dmFyIEpPSU4gPSAnSk9JTic7XG5cdHZhciBDQU5DRUwgPSAnQ0FOQ0VMJztcblx0dmFyIFNFTEVDVCA9ICdTRUxFQ1QnO1xuXHR2YXIgQUNUSU9OX0NIQU5ORUwgPSAnQUNUSU9OX0NIQU5ORUwnO1xuXHR2YXIgQ0FOQ0VMTEVEID0gJ0NBTkNFTExFRCc7XG5cdHZhciBGTFVTSCA9ICdGTFVTSCc7XG5cdHZhciBHRVRfQ09OVEVYVCA9ICdHRVRfQ09OVEVYVCc7XG5cdHZhciBTRVRfQ09OVEVYVCA9ICdTRVRfQ09OVEVYVCc7XG5cdFxuXHR2YXIgVEVTVF9ISU5UID0gJ1xcbihISU5UOiBpZiB5b3UgYXJlIGdldHRpbmcgdGhpcyBlcnJvcnMgaW4gdGVzdHMsIGNvbnNpZGVyIHVzaW5nIGNyZWF0ZU1vY2tUYXNrIGZyb20gcmVkdXgtc2FnYS91dGlscyknO1xuXHRcblx0dmFyIGVmZmVjdCA9IGZ1bmN0aW9uIGVmZmVjdCh0eXBlLCBwYXlsb2FkKSB7XG5cdCAgdmFyIF9yZWY7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbSU9dID0gdHJ1ZSwgX3JlZlt0eXBlXSA9IHBheWxvYWQsIF9yZWY7XG5cdH07XG5cdFxuXHR2YXIgZGV0YWNoID0gZXhwb3J0cy5kZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2goZWZmKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykoYXNFZmZlY3QuZm9yayhlZmYpLCBfdXRpbHMuaXMub2JqZWN0LCAnZGV0YWNoKGVmZik6IGFyZ3VtZW50IG11c3QgYmUgYSBmb3JrIGVmZmVjdCcpO1xuXHQgIGVmZltGT1JLXS5kZXRhY2hlZCA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgdmFyIHBhdHRlcm5PckNoYW5uZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcqJztcblx0XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGFyZ3VtZW50c1swXSwgX3V0aWxzLmlzLm5vdFVuZGVmLCAndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogcGF0dGVybk9yQ2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcblx0ICB9XG5cdCAgaWYgKF91dGlscy5pcy5wYXR0ZXJuKHBhdHRlcm5PckNoYW5uZWwpKSB7XG5cdCAgICByZXR1cm4gZWZmZWN0KFRBS0UsIHsgcGF0dGVybjogcGF0dGVybk9yQ2hhbm5lbCB9KTtcblx0ICB9XG5cdCAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG5cdCAgICByZXR1cm4gZWZmZWN0KFRBS0UsIHsgY2hhbm5lbDogcGF0dGVybk9yQ2hhbm5lbCB9KTtcblx0ICB9XG5cdCAgdGhyb3cgbmV3IEVycm9yKCd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBhcmd1bWVudCAnICsgU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCBvciBhIHZhbGlkIHBhdHRlcm4nKTtcblx0fVxuXHRcblx0dGFrZS5tYXliZSA9IGZ1bmN0aW9uICgpIHtcblx0ICB2YXIgZWZmID0gdGFrZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0dmFyIHRha2VtID0gLyojX19QVVJFX18qL2V4cG9ydHMudGFrZW0gPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkodGFrZS5tYXliZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgndGFrZW0nLCAndGFrZS5tYXliZScpKTtcblx0XG5cdGZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBjaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCBhIHZhbGlkIGNoYW5uZWwnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGFjdGlvbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcblx0ICAgIGFjdGlvbiA9IGNoYW5uZWw7XG5cdCAgICBjaGFubmVsID0gbnVsbDtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChQVVQsIHsgY2hhbm5lbDogY2hhbm5lbCwgYWN0aW9uOiBhY3Rpb24gfSk7XG5cdH1cblx0XG5cdHB1dC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSBwdXQuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIGVmZltQVVRdLnJlc29sdmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHRwdXQuc3luYyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkocHV0LnJlc29sdmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3B1dC5zeW5jJywgJ3B1dC5yZXNvbHZlJykpO1xuXHRcblx0ZnVuY3Rpb24gYWxsKGVmZmVjdHMpIHtcblx0ICByZXR1cm4gZWZmZWN0KEFMTCwgZWZmZWN0cyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJhY2UoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoUkFDRSwgZWZmZWN0cyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldEZuQ2FsbERlc2MobWV0aCwgZm4sIGFyZ3MpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cdFxuXHQgIHZhciBjb250ZXh0ID0gbnVsbDtcblx0ICBpZiAoX3V0aWxzLmlzLmFycmF5KGZuKSkge1xuXHQgICAgdmFyIF9mbiA9IGZuO1xuXHQgICAgY29udGV4dCA9IF9mblswXTtcblx0ICAgIGZuID0gX2ZuWzFdO1xuXHQgIH0gZWxzZSBpZiAoZm4uZm4pIHtcblx0ICAgIHZhciBfZm4yID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuMi5jb250ZXh0O1xuXHQgICAgZm4gPSBfZm4yLmZuO1xuXHQgIH1cblx0ICBpZiAoY29udGV4dCAmJiBfdXRpbHMuaXMuc3RyaW5nKGZuKSAmJiBfdXRpbHMuaXMuZnVuYyhjb250ZXh0W2ZuXSkpIHtcblx0ICAgIGZuID0gY29udGV4dFtmbl07XG5cdCAgfVxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0XG5cdCAgcmV0dXJuIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNhbGwoZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdjYWxsJywgZm4sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gYXBwbHkoY29udGV4dCwgZm4pIHtcblx0ICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogW107XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnYXBwbHknLCB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiB9LCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNwcyhmbikge1xuXHQgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcblx0ICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZm9yayhmbikge1xuXHQgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcblx0ICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KEZPUkssIGdldEZuQ2FsbERlc2MoJ2ZvcmsnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzcGF3bihmbikge1xuXHQgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcblx0ICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZGV0YWNoKGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbZm5dLmNvbmNhdChhcmdzKSkpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBqb2luKCkge1xuXHQgIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuXHQgICAgdGFza3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gam9pbih0KTtcblx0ICAgIH0pKTtcblx0ICB9XG5cdCAgdmFyIHRhc2sgPSB0YXNrc1swXTtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdqb2luKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnam9pbih0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuXHQgIHJldHVybiBlZmZlY3QoSk9JTiwgdGFzayk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNhbmNlbCgpIHtcblx0ICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcblx0ICAgIHRhc2tzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG5cdCAgfVxuXHRcblx0ICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuXHQgICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgcmV0dXJuIGNhbmNlbCh0KTtcblx0ICAgIH0pKTtcblx0ICB9XG5cdCAgdmFyIHRhc2sgPSB0YXNrc1swXTtcblx0ICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdjYW5jZWwodGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KENBTkNFTCwgdGFzayB8fCBfdXRpbHMuU0VMRl9DQU5DRUxMQVRJT04pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzZWxlY3Qoc2VsZWN0b3IpIHtcblx0ICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNyA+IDEgPyBfbGVuNyAtIDEgOiAwKSwgX2tleTcgPSAxOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG5cdCAgICBhcmdzW19rZXk3IC0gMV0gPSBhcmd1bWVudHNbX2tleTddO1xuXHQgIH1cblx0XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0ICAgIHNlbGVjdG9yID0gX3V0aWxzLmlkZW50O1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgc2VsZWN0b3IgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLmZ1bmMsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCAnICsgc2VsZWN0b3IgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoU0VMRUNULCB7IHNlbGVjdG9yOiBzZWxlY3RvciwgYXJnczogYXJncyB9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAgY2hhbm5lbChwYXR0ZXJuLCBbYnVmZmVyXSkgICAgPT4gY3JlYXRlcyBhbiBldmVudCBjaGFubmVsIGZvciBzdG9yZSBhY3Rpb25zXG5cdCoqL1xuXHRmdW5jdGlvbiBhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcikge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHBhdHRlcm4sIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwuLi4pOiBhcmd1bWVudCBwYXR0ZXJuIGlzIHVuZGVmaW5lZCcpO1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50IGJ1ZmZlciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgJyArIGJ1ZmZlciArICcgaXMgbm90IGEgdmFsaWQgYnVmZmVyJyk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQUNUSU9OX0NIQU5ORUwsIHsgcGF0dGVybjogcGF0dGVybiwgYnVmZmVyOiBidWZmZXIgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNhbmNlbGxlZCgpIHtcblx0ICByZXR1cm4gZWZmZWN0KENBTkNFTExFRCwge30pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmbHVzaChjaGFubmVsKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdmbHVzaChjaGFubmVsKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsJyk7XG5cdCAgcmV0dXJuIGVmZmVjdChGTFVTSCwgY2hhbm5lbCk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldENvbnRleHQocHJvcCkge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3AsIF91dGlscy5pcy5zdHJpbmcsICdnZXRDb250ZXh0KHByb3ApOiBhcmd1bWVudCAnICsgcHJvcCArICcgaXMgbm90IGEgc3RyaW5nJyk7XG5cdCAgcmV0dXJuIGVmZmVjdChHRVRfQ09OVEVYVCwgcHJvcCk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykobnVsbCwgcHJvcHMpKTtcblx0ICByZXR1cm4gZWZmZWN0KFNFVF9DT05URVhULCBwcm9wcyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VFdmVyeShwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDIgPyBfbGVuOCAtIDIgOiAwKSwgX2tleTggPSAyOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG5cdCAgICBhcmdzW19rZXk4IC0gMl0gPSBhcmd1bWVudHNbX2tleThdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VFdmVyeUhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW45ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW45ID4gMiA/IF9sZW45IC0gMiA6IDApLCBfa2V5OSA9IDI7IF9rZXk5IDwgX2xlbjk7IF9rZXk5KyspIHtcblx0ICAgIGFyZ3NbX2tleTkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5OV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUxhdGVzdEhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiB0aHJvdHRsZShtcywgcGF0dGVybiwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjEwID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4xMCA+IDMgPyBfbGVuMTAgLSAzIDogMCksIF9rZXkxMCA9IDM7IF9rZXkxMCA8IF9sZW4xMDsgX2tleTEwKyspIHtcblx0ICAgIGFyZ3NbX2tleTEwIC0gM10gPSBhcmd1bWVudHNbX2tleTEwXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50aHJvdHRsZUhlbHBlciwgbXMsIHBhdHRlcm4sIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcblx0fVxuXHRcblx0dmFyIGNyZWF0ZUFzRWZmZWN0VHlwZSA9IGZ1bmN0aW9uIGNyZWF0ZUFzRWZmZWN0VHlwZSh0eXBlKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIChlZmZlY3QpIHtcblx0ICAgIHJldHVybiBlZmZlY3QgJiYgZWZmZWN0W0lPXSAmJiBlZmZlY3RbdHlwZV07XG5cdCAgfTtcblx0fTtcblx0XG5cdHZhciBhc0VmZmVjdCA9IGV4cG9ydHMuYXNFZmZlY3QgPSB7XG5cdCAgdGFrZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShUQUtFKSxcblx0ICBwdXQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUFVUKSxcblx0ICBhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUxMKSxcblx0ICByYWNlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFJBQ0UpLFxuXHQgIGNhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FMTCksXG5cdCAgY3BzOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENQUyksXG5cdCAgZm9yazogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGT1JLKSxcblx0ICBqb2luOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEpPSU4pLFxuXHQgIGNhbmNlbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQU5DRUwpLFxuXHQgIHNlbGVjdDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRUxFQ1QpLFxuXHQgIGFjdGlvbkNoYW5uZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUNUSU9OX0NIQU5ORUwpLFxuXHQgIGNhbmNlbGxlZDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQU5DRUxMRUQpLFxuXHQgIGZsdXNoOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZMVVNIKSxcblx0ICBnZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEdFVF9DT05URVhUKSxcblx0ICBzZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFVF9DT05URVhUKVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ1KTtcblx0XG5cdHZhciBfdGFrZUV2ZXJ5MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlRXZlcnkpO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ5KTtcblx0XG5cdHZhciBfdGFrZUxhdGVzdDIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUxhdGVzdCk7XG5cdFxuXHR2YXIgX3Rocm90dGxlID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUwKTtcblx0XG5cdHZhciBfdGhyb3R0bGUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBkZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiBkZXByZWNhdGlvbldhcm5pbmcoaGVscGVyTmFtZSkge1xuXHQgIHJldHVybiAnaW1wb3J0IHsgJyArIGhlbHBlck5hbWUgKyAnIH0gZnJvbSBcXCdyZWR1eC1zYWdhXFwnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgaW1wb3J0IHsgJyArIGhlbHBlck5hbWUgKyAnIH0gZnJvbSBcXCdyZWR1eC1zYWdhL2VmZmVjdHNcXCcuXFxuVGhlIGxhdHRlciB3aWxsIG5vdCB3b3JrIHdpdGggeWllbGQqLCBhcyBoZWxwZXIgZWZmZWN0cyBhcmUgd3JhcHBlZCBhdXRvbWF0aWNhbGx5IGZvciB5b3UgaW4gZm9yayBlZmZlY3QuXFxuVGhlcmVmb3JlIHlpZWxkICcgKyBoZWxwZXJOYW1lICsgJyB3aWxsIHJldHVybiB0YXNrIGRlc2NyaXB0b3IgdG8geW91ciBzYWdhIGFuZCBleGVjdXRlIG5leHQgbGluZXMgb2YgY29kZS4nO1xuXHR9O1xuXHRcblx0dmFyIHRha2VFdmVyeSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VFdmVyeTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUV2ZXJ5JykpO1xuXHR2YXIgdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VMYXRlc3QyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VMYXRlc3QnKSk7XG5cdHZhciB0aHJvdHRsZSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rocm90dGxlMi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0aHJvdHRsZScpKTtcblx0XG5cdGV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuXHRleHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuXHRleHBvcnRzLnRocm90dGxlID0gdGhyb3R0bGU7XG5cdGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gX3Rha2VFdmVyeTIuZGVmYXVsdDtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gX3Rha2VMYXRlc3QyLmRlZmF1bHQ7XG5cdGV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBfdGhyb3R0bGUyLmRlZmF1bHQ7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gdGFrZUV2ZXJ5O1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdFxuXHQgIHZhciBhY3Rpb24gPSB2b2lkIDAsXG5cdCAgICAgIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogWydxMScsIHlGb3JrKGFjdGlvbildO1xuXHQgICAgfVxuXHQgIH0sICdxMScsICd0YWtlRXZlcnkoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucUVuZCA9IHVuZGVmaW5lZDtcblx0ZXhwb3J0cy5zYWZlTmFtZSA9IHNhZmVOYW1lO1xuXHRleHBvcnRzLmRlZmF1bHQgPSBmc21JdGVyYXRvcjtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIGRvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcblx0dmFyIHFFbmQgPSBleHBvcnRzLnFFbmQgPSB7fTtcblx0XG5cdGZ1bmN0aW9uIHNhZmVOYW1lKHBhdHRlcm5PckNoYW5uZWwpIHtcblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiAnY2hhbm5lbCc7XG5cdCAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm5PckNoYW5uZWwpKSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuXHQgICAgICByZXR1cm4gU3RyaW5nKGVudHJ5KTtcblx0ICAgIH0pKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZzbUl0ZXJhdG9yKGZzbSwgcTApIHtcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ2l0ZXJhdG9yJztcblx0XG5cdCAgdmFyIHVwZGF0ZVN0YXRlID0gdm9pZCAwLFxuXHQgICAgICBxTmV4dCA9IHEwO1xuXHRcblx0ICBmdW5jdGlvbiBuZXh0KGFyZywgZXJyb3IpIHtcblx0ICAgIGlmIChxTmV4dCA9PT0gcUVuZCkge1xuXHQgICAgICByZXR1cm4gZG9uZTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoZXJyb3IpIHtcblx0ICAgICAgcU5leHQgPSBxRW5kO1xuXHQgICAgICB0aHJvdyBlcnJvcjtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHVwZGF0ZVN0YXRlICYmIHVwZGF0ZVN0YXRlKGFyZyk7XG5cdFxuXHQgICAgICB2YXIgX2ZzbSRxTmV4dCA9IGZzbVtxTmV4dF0oKSxcblx0ICAgICAgICAgIHEgPSBfZnNtJHFOZXh0WzBdLFxuXHQgICAgICAgICAgb3V0cHV0ID0gX2ZzbSRxTmV4dFsxXSxcblx0ICAgICAgICAgIF91cGRhdGVTdGF0ZSA9IF9mc20kcU5leHRbMl07XG5cdFxuXHQgICAgICBxTmV4dCA9IHE7XG5cdCAgICAgIHVwZGF0ZVN0YXRlID0gX3VwZGF0ZVN0YXRlO1xuXHQgICAgICByZXR1cm4gcU5leHQgPT09IHFFbmQgPyBkb25lIDogb3V0cHV0O1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShuZXh0LCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgIHJldHVybiBuZXh0KG51bGwsIGVycm9yKTtcblx0ICB9LCBuYW1lLCB0cnVlKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5pc0VuZCA9IGV4cG9ydHMuRU5EID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblx0XG5cdGV4cG9ydHMuZW1pdHRlciA9IGVtaXR0ZXI7XG5cdGV4cG9ydHMuY2hhbm5lbCA9IGNoYW5uZWw7XG5cdGV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXZlbnRDaGFubmVsO1xuXHRleHBvcnRzLnN0ZENoYW5uZWwgPSBzdGRDaGFubmVsO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0dmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDIpO1xuXHRcblx0dmFyIENIQU5ORUxfRU5EX1RZUEUgPSAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0dmFyIEVORCA9IGV4cG9ydHMuRU5EID0geyB0eXBlOiBDSEFOTkVMX0VORF9UWVBFIH07XG5cdHZhciBpc0VuZCA9IGV4cG9ydHMuaXNFbmQgPSBmdW5jdGlvbiBpc0VuZChhKSB7XG5cdCAgcmV0dXJuIGEgJiYgYS50eXBlID09PSBDSEFOTkVMX0VORF9UWVBFO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gZW1pdHRlcigpIHtcblx0ICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblx0XG5cdCAgZnVuY3Rpb24gc3Vic2NyaWJlKHN1Yikge1xuXHQgICAgc3Vic2NyaWJlcnMucHVzaChzdWIpO1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKShzdWJzY3JpYmVycywgc3ViKTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBlbWl0KGl0ZW0pIHtcblx0ICAgIHZhciBhcnIgPSBzdWJzY3JpYmVycy5zbGljZSgpO1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBhcnJbaV0oaXRlbSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG5cdCAgICBlbWl0OiBlbWl0XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIElOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5JTlZBTElEX0JVRkZFUiA9ICdpbnZhbGlkIGJ1ZmZlciBwYXNzZWQgdG8gY2hhbm5lbCBmYWN0b3J5IGZ1bmN0aW9uJztcblx0dmFyIFVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gJ1NhZ2Egd2FzIHByb3ZpZGVkIHdpdGggYW4gdW5kZWZpbmVkIGFjdGlvbic7XG5cdFxuXHRpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuXHQgIGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gVU5ERUZJTkVEX0lOUFVUX0VSUk9SICs9ICdcXG5IaW50czpcXG4gICAgLSBjaGVjayB0aGF0IHlvdXIgQWN0aW9uIENyZWF0b3IgcmV0dXJucyBhIG5vbi11bmRlZmluZWQgdmFsdWVcXG4gICAgLSBpZiB0aGUgU2FnYSB3YXMgc3RhcnRlZCB1c2luZyBydW5TYWdhLCBjaGVjayB0aGF0IHlvdXIgc3Vic2NyaWJlIHNvdXJjZSBwcm92aWRlcyB0aGUgYWN0aW9uIHRvIGl0cyBsaXN0ZW5lcnNcXG4gICc7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNoYW5uZWwoKSB7XG5cdCAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpO1xuXHRcblx0ICB2YXIgY2xvc2VkID0gZmFsc2U7XG5cdCAgdmFyIHRha2VycyA9IFtdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsIElOVkFMSURfQlVGRkVSKTtcblx0XG5cdCAgZnVuY3Rpb24gY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKSB7XG5cdCAgICBpZiAoY2xvc2VkICYmIHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIGEgY2xvc2VkIGNoYW5uZWwgd2l0aCBwZW5kaW5nIHRha2VycycpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRha2Vycy5sZW5ndGggJiYgIWJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIHBlbmRpbmcgdGFrZXJzIHdpdGggbm9uIGVtcHR5IGJ1ZmZlcicpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcHV0KGlucHV0KSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoaW5wdXQsIF91dGlscy5pcy5ub3RVbmRlZiwgVU5ERUZJTkVEX0lOUFVUX0VSUk9SKTtcblx0ICAgIGlmIChjbG9zZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgaWYgKCF0YWtlcnMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBidWZmZXIucHV0KGlucHV0KTtcblx0ICAgIH1cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFrZXJzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIHZhciBjYiA9IHRha2Vyc1tpXTtcblx0ICAgICAgaWYgKCFjYltfdXRpbHMuTUFUQ0hdIHx8IGNiW191dGlscy5NQVRDSF0oaW5wdXQpKSB7XG5cdCAgICAgICAgdGFrZXJzLnNwbGljZShpLCAxKTtcblx0ICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiB0YWtlKGNiKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgIH0gZWxzZSBpZiAoIWJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoYnVmZmVyLnRha2UoKSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0YWtlcnMucHVzaChjYik7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHRha2VycywgY2IpO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gZmx1c2goY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7IC8vIFRPRE86IGNoZWNrIGlmIHNvbWUgbmV3IHN0YXRlIHNob3VsZCBiZSBmb3JiaWRkZW4gbm93XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC5mbHVzaCcgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIGNiKEVORCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNiKGJ1ZmZlci5mbHVzaCgpKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcblx0ICAgIGlmICghY2xvc2VkKSB7XG5cdCAgICAgIGNsb3NlZCA9IHRydWU7XG5cdCAgICAgIGlmICh0YWtlcnMubGVuZ3RoKSB7XG5cdCAgICAgICAgdmFyIGFyciA9IHRha2Vycztcblx0ICAgICAgICB0YWtlcnMgPSBbXTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgICAgICBhcnJbaV0oRU5EKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICB0YWtlOiB0YWtlLFxuXHQgICAgcHV0OiBwdXQsXG5cdCAgICBmbHVzaDogZmx1c2gsXG5cdCAgICBjbG9zZTogY2xvc2UsXG5cdCAgICBnZXQgX190YWtlcnNfXygpIHtcblx0ICAgICAgcmV0dXJuIHRha2Vycztcblx0ICAgIH0sXG5cdCAgICBnZXQgX19jbG9zZWRfXygpIHtcblx0ICAgICAgcmV0dXJuIGNsb3NlZDtcblx0ICAgIH1cblx0ICB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBldmVudENoYW5uZWwoc3Vic2NyaWJlKSB7XG5cdCAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX2J1ZmZlcnMuYnVmZmVycy5ub25lKCk7XG5cdCAgdmFyIG1hdGNoZXIgPSBhcmd1bWVudHNbMl07XG5cdFxuXHQgIC8qKlxuXHQgICAgc2hvdWxkIGJlIGlmKHR5cGVvZiBtYXRjaGVyICE9PSB1bmRlZmluZWQpIGluc3RlYWQ/XG5cdCAgICBzZWUgUFIgIzI3MyBmb3IgYSBiYWNrZ3JvdW5kIGRpc2N1c3Npb25cblx0ICAqKi9cblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCAnSW52YWxpZCBtYXRjaCBmdW5jdGlvbiBwYXNzZWQgdG8gZXZlbnRDaGFubmVsJyk7XG5cdCAgfVxuXHRcblx0ICB2YXIgY2hhbiA9IGNoYW5uZWwoYnVmZmVyKTtcblx0ICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcblx0ICAgIGlmICghY2hhbi5fX2Nsb3NlZF9fKSB7XG5cdCAgICAgIGlmICh1bnN1YnNjcmliZSkge1xuXHQgICAgICAgIHVuc3Vic2NyaWJlKCk7XG5cdCAgICAgIH1cblx0ICAgICAgY2hhbi5jbG9zZSgpO1xuXHQgICAgfVxuXHQgIH07XG5cdCAgdmFyIHVuc3Vic2NyaWJlID0gc3Vic2NyaWJlKGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgaWYgKGlzRW5kKGlucHV0KSkge1xuXHQgICAgICBjbG9zZSgpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAobWF0Y2hlciAmJiAhbWF0Y2hlcihpbnB1dCkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2hhbi5wdXQoaW5wdXQpO1xuXHQgIH0pO1xuXHQgIGlmIChjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgIHVuc3Vic2NyaWJlKCk7XG5cdCAgfVxuXHRcblx0ICBpZiAoIV91dGlscy5pcy5mdW5jKHVuc3Vic2NyaWJlKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdpbiBldmVudENoYW5uZWw6IHN1YnNjcmliZSBzaG91bGQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gdW5zdWJzY3JpYmUnKTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICB0YWtlOiBjaGFuLnRha2UsXG5cdCAgICBmbHVzaDogY2hhbi5mbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHN0ZENoYW5uZWwoc3Vic2NyaWJlKSB7XG5cdCAgdmFyIGNoYW4gPSBldmVudENoYW5uZWwoZnVuY3Rpb24gKGNiKSB7XG5cdCAgICByZXR1cm4gc3Vic2NyaWJlKGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICBpZiAoaW5wdXRbX3V0aWxzLlNBR0FfQUNUSU9OXSkge1xuXHQgICAgICAgIGNiKGlucHV0KTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBfZXh0ZW5kcyh7fSwgY2hhbiwge1xuXHQgICAgdGFrZTogZnVuY3Rpb24gdGFrZShjYiwgbWF0Y2hlcikge1xuXHQgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBtYXRjaGVyIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0ICAgICAgICBjYltfdXRpbHMuTUFUQ0hdID0gbWF0Y2hlcjtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLnRha2UoY2IpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgQlVGRkVSX09WRVJGTE9XID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSBcIkNoYW5uZWwncyBCdWZmZXIgb3ZlcmZsb3chXCI7XG5cdFxuXHR2YXIgT05fT1ZFUkZMT1dfVEhST1cgPSAxO1xuXHR2YXIgT05fT1ZFUkZMT1dfRFJPUCA9IDI7XG5cdHZhciBPTl9PVkVSRkxPV19TTElERSA9IDM7XG5cdHZhciBPTl9PVkVSRkxPV19FWFBBTkQgPSA0O1xuXHRcblx0dmFyIHplcm9CdWZmZXIgPSB7IGlzRW1wdHk6IF91dGlscy5rVHJ1ZSwgcHV0OiBfdXRpbHMubm9vcCwgdGFrZTogX3V0aWxzLm5vb3AgfTtcblx0XG5cdGZ1bmN0aW9uIHJpbmdCdWZmZXIoKSB7XG5cdCAgdmFyIGxpbWl0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAxMDtcblx0ICB2YXIgb3ZlcmZsb3dBY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHZhciBhcnIgPSBuZXcgQXJyYXkobGltaXQpO1xuXHQgIHZhciBsZW5ndGggPSAwO1xuXHQgIHZhciBwdXNoSW5kZXggPSAwO1xuXHQgIHZhciBwb3BJbmRleCA9IDA7XG5cdFxuXHQgIHZhciBwdXNoID0gZnVuY3Rpb24gcHVzaChpdCkge1xuXHQgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuXHQgICAgbGVuZ3RoKys7XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRha2UgPSBmdW5jdGlvbiB0YWtlKCkge1xuXHQgICAgaWYgKGxlbmd0aCAhPSAwKSB7XG5cdCAgICAgIHZhciBpdCA9IGFycltwb3BJbmRleF07XG5cdCAgICAgIGFycltwb3BJbmRleF0gPSBudWxsO1xuXHQgICAgICBsZW5ndGgtLTtcblx0ICAgICAgcG9wSW5kZXggPSAocG9wSW5kZXggKyAxKSAlIGxpbWl0O1xuXHQgICAgICByZXR1cm4gaXQ7XG5cdCAgICB9XG5cdCAgfTtcblx0XG5cdCAgdmFyIGZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG5cdCAgICB2YXIgaXRlbXMgPSBbXTtcblx0ICAgIHdoaWxlIChsZW5ndGgpIHtcblx0ICAgICAgaXRlbXMucHVzaCh0YWtlKCkpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGl0ZW1zO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBpc0VtcHR5OiBmdW5jdGlvbiBpc0VtcHR5KCkge1xuXHQgICAgICByZXR1cm4gbGVuZ3RoID09IDA7XG5cdCAgICB9LFxuXHQgICAgcHV0OiBmdW5jdGlvbiBwdXQoaXQpIHtcblx0ICAgICAgaWYgKGxlbmd0aCA8IGxpbWl0KSB7XG5cdCAgICAgICAgcHVzaChpdCk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIGRvdWJsZWRMaW1pdCA9IHZvaWQgMDtcblx0ICAgICAgICBzd2l0Y2ggKG92ZXJmbG93QWN0aW9uKSB7XG5cdCAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1RIUk9XOlxuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX09WRVJGTE9XKTtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfU0xJREU6XG5cdCAgICAgICAgICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG5cdCAgICAgICAgICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuXHQgICAgICAgICAgICBwb3BJbmRleCA9IHB1c2hJbmRleDtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX0VYUEFORDpcblx0ICAgICAgICAgICAgZG91YmxlZExpbWl0ID0gMiAqIGxpbWl0O1xuXHRcblx0ICAgICAgICAgICAgYXJyID0gZmx1c2goKTtcblx0XG5cdCAgICAgICAgICAgIGxlbmd0aCA9IGFyci5sZW5ndGg7XG5cdCAgICAgICAgICAgIHB1c2hJbmRleCA9IGFyci5sZW5ndGg7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgICAgICAgICAgIGFyci5sZW5ndGggPSBkb3VibGVkTGltaXQ7XG5cdCAgICAgICAgICAgIGxpbWl0ID0gZG91YmxlZExpbWl0O1xuXHRcblx0ICAgICAgICAgICAgcHVzaChpdCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgIC8vIERST1Bcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdCAgICB0YWtlOiB0YWtlLFxuXHQgICAgZmx1c2g6IGZsdXNoXG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIGJ1ZmZlcnMgPSBleHBvcnRzLmJ1ZmZlcnMgPSB7XG5cdCAgbm9uZTogZnVuY3Rpb24gbm9uZSgpIHtcblx0ICAgIHJldHVybiB6ZXJvQnVmZmVyO1xuXHQgIH0sXG5cdCAgZml4ZWQ6IGZ1bmN0aW9uIGZpeGVkKGxpbWl0KSB7XG5cdCAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfVEhST1cpO1xuXHQgIH0sXG5cdCAgZHJvcHBpbmc6IGZ1bmN0aW9uIGRyb3BwaW5nKGxpbWl0KSB7XG5cdCAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfRFJPUCk7XG5cdCAgfSxcblx0ICBzbGlkaW5nOiBmdW5jdGlvbiBzbGlkaW5nKGxpbWl0KSB7XG5cdCAgICByZXR1cm4gcmluZ0J1ZmZlcihsaW1pdCwgT05fT1ZFUkZMT1dfU0xJREUpO1xuXHQgIH0sXG5cdCAgZXhwYW5kaW5nOiBmdW5jdGlvbiBleHBhbmRpbmcoaW5pdGlhbFNpemUpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGluaXRpYWxTaXplLCBPTl9PVkVSRkxPV19FWFBBTkQpO1xuXHQgIH1cblx0fTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlTGF0ZXN0O1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcblx0ICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcblx0ICB9O1xuXHQgIHZhciB5Q2FuY2VsID0gZnVuY3Rpb24geUNhbmNlbCh0YXNrKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uY2FuY2VsKSh0YXNrKSB9O1xuXHQgIH07XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwLFxuXHQgICAgICBhY3Rpb24gPSB2b2lkIDA7XG5cdCAgdmFyIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRUYXNrKHQpIHtcblx0ICAgIHJldHVybiB0YXNrID0gdDtcblx0ICB9O1xuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuXHQgICAgfSxcblx0ICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcblx0ICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IHRhc2sgPyBbJ3EzJywgeUNhbmNlbCh0YXNrKV0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9LFxuXHQgICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuXHQgICAgICByZXR1cm4gWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuXHQgICAgfVxuXHQgIH0sICdxMScsICd0YWtlTGF0ZXN0KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKGRlbGF5TGVuZ3RoLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAzID8gX2xlbiAtIDMgOiAwKSwgX2tleSA9IDM7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDNdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgY2hhbm5lbCA9IHZvaWQgMDtcblx0XG5cdCAgdmFyIHlBY3Rpb25DaGFubmVsID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uYWN0aW9uQ2hhbm5lbCkocGF0dGVybiwgX2J1ZmZlcnMuYnVmZmVycy5zbGlkaW5nKDEpKSB9O1xuXHQgIHZhciB5VGFrZSA9IGZ1bmN0aW9uIHlUYWtlKCkge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKGNoYW5uZWwpIH07XG5cdCAgfTtcblx0ICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcblx0ICB9O1xuXHQgIHZhciB5RGVsYXkgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYWxsKShfdXRpbHMuZGVsYXksIGRlbGF5TGVuZ3RoKSB9O1xuXHRcblx0ICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0ICB2YXIgc2V0Q2hhbm5lbCA9IGZ1bmN0aW9uIHNldENoYW5uZWwoY2gpIHtcblx0ICAgIHJldHVybiBjaGFubmVsID0gY2g7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5QWN0aW9uQ2hhbm5lbCwgc2V0Q2hhbm5lbF07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gWydxMycsIHlUYWtlKCksIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogWydxNCcsIHlGb3JrKGFjdGlvbildO1xuXHQgICAgfSxcblx0ICAgIHE0OiBmdW5jdGlvbiBxNCgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5RGVsYXldO1xuXHQgICAgfVxuXHQgIH0sICdxMScsICd0aHJvdHRsZSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybikgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSBzYWdhTWlkZGxld2FyZUZhY3Rvcnk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3MzkpO1xuXHRcblx0ZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXHRcblx0ZnVuY3Rpb24gc2FnYU1pZGRsZXdhcmVGYWN0b3J5KCkge1xuXHQgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblx0XG5cdCAgdmFyIF9yZWYkY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgY29udGV4dCA9IF9yZWYkY29udGV4dCA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNvbnRleHQsXG5cdCAgICAgIG9wdGlvbnMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjb250ZXh0J10pO1xuXHRcblx0ICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuXHQgICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblx0XG5cdFxuXHQgIGlmIChfdXRpbHMuaXMuZnVuYyhvcHRpb25zKSkge1xuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdTYWdhIG1pZGRsZXdhcmUgbm8gbG9uZ2VyIGFjY2VwdCBHZW5lcmF0b3IgZnVuY3Rpb25zLiBVc2Ugc2FnYU1pZGRsZXdhcmUucnVuIGluc3RlYWQnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBhIGZ1bmN0aW9uIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUuIFlvdSBhcmUgbGlrZWx5IHRyeWluZyB0byBzdGFydCBhICAgICAgICBTYWdhIGJ5IGRpcmVjdGx5IHBhc3NpbmcgaXQgdG8gdGhlIG1pZGRsZXdhcmUuIFRoaXMgaXMgbm8gbG9uZ2VyIHBvc3NpYmxlIHN0YXJ0aW5nIGZyb20gMC4xMC4wLiAgICAgICAgVG8gcnVuIGEgU2FnYSwgeW91IG11c3QgZG8gaXQgZHluYW1pY2FsbHkgQUZURVIgbW91bnRpbmcgdGhlIG1pZGRsZXdhcmUgaW50byB0aGUgc3RvcmUuXFxuICAgICAgICBFeGFtcGxlOlxcbiAgICAgICAgICBpbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcXCdyZWR1eC1zYWdhXFwnXFxuICAgICAgICAgIC4uLiBvdGhlciBpbXBvcnRzXFxuXFxuICAgICAgICAgIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKVxcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpXFxuICAgICAgICAgIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhLCAuLi5hcmdzKVxcbiAgICAgICcpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgaWYgKGxvZ2dlciAmJiAhX3V0aWxzLmlzLmZ1bmMobG9nZ2VyKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5sb2dnZXJgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuXHQgIH1cblx0XG5cdCAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIG9wdGlvbnMub25lcnJvcikge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbmVycm9yYCB3YXMgcmVtb3ZlZC4gVXNlIGBvcHRpb25zLm9uRXJyb3JgIGluc3RlYWQuJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAob25FcnJvciAmJiAhX3V0aWxzLmlzLmZ1bmMob25FcnJvcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25FcnJvcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAob3B0aW9ucy5lbWl0dGVyICYmICFfdXRpbHMuaXMuZnVuYyhvcHRpb25zLmVtaXR0ZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmVtaXR0ZXJgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gc2FnYU1pZGRsZXdhcmUoX3JlZjIpIHtcblx0ICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYyLmdldFN0YXRlLFxuXHQgICAgICAgIGRpc3BhdGNoID0gX3JlZjIuZGlzcGF0Y2g7XG5cdFxuXHQgICAgdmFyIHNhZ2FFbWl0dGVyID0gKDAsIF9jaGFubmVsLmVtaXR0ZXIpKCk7XG5cdCAgICBzYWdhRW1pdHRlci5lbWl0ID0gKG9wdGlvbnMuZW1pdHRlciB8fCBfdXRpbHMuaWRlbnQpKHNhZ2FFbWl0dGVyLmVtaXQpO1xuXHRcblx0ICAgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IF9ydW5TYWdhLnJ1blNhZ2EuYmluZChudWxsLCB7XG5cdCAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG5cdCAgICAgIHN1YnNjcmliZTogc2FnYUVtaXR0ZXIuc3Vic2NyaWJlLFxuXHQgICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG5cdCAgICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcblx0ICAgICAgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLFxuXHQgICAgICBsb2dnZXI6IGxvZ2dlcixcblx0ICAgICAgb25FcnJvcjogb25FcnJvclxuXHQgICAgfSk7XG5cdFxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICAgICAgaWYgKHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQpIHtcblx0ICAgICAgICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQoYWN0aW9uKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdmFyIHJlc3VsdCA9IG5leHQoYWN0aW9uKTsgLy8gaGl0IHJlZHVjZXJzXG5cdCAgICAgICAgc2FnYUVtaXR0ZXIuZW1pdChhY3Rpb24pO1xuXHQgICAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICAgIH07XG5cdCAgICB9O1xuXHQgIH1cblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUucnVuID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdCZWZvcmUgcnVubmluZyBhIFNhZ2EsIHlvdSBtdXN0IG1vdW50IHRoZSBTYWdhIG1pZGRsZXdhcmUgb24gdGhlIFN0b3JlIHVzaW5nIGFwcGx5TWlkZGxld2FyZScpO1xuXHQgIH07XG5cdFxuXHQgIHNhZ2FNaWRkbGV3YXJlLnNldENvbnRleHQgPSBmdW5jdGlvbiAocHJvcHMpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgnc2FnYU1pZGRsZXdhcmUnLCBwcm9wcykpO1xuXHQgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24oY29udGV4dCwgcHJvcHMpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBzYWdhTWlkZGxld2FyZTtcblx0fVxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlbScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlbTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3B1dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5wdXQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhbGwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYWxsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncmFjZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5yYWNlO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYWxsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXBwbHknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXBwbHk7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcHMnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY3BzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZm9yaycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5mb3JrO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc3Bhd24nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc3Bhd247XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdqb2luJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmpvaW47XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY2FuY2VsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2VsZWN0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnNlbGVjdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FjdGlvbkNoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYWN0aW9uQ2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbGxlZCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWxsZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmbHVzaCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5mbHVzaDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2dldENvbnRleHQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZ2V0Q29udGV4dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NldENvbnRleHQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2V0Q29udGV4dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlRXZlcnk7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VMYXRlc3Q7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50aHJvdHRsZTtcblx0ICB9XG5cdH0pO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVEFTSycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5UQVNLO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU0FHQV9BQ1RJT04nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuU0FHQV9BQ1RJT047XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdub29wJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5pcztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlZmVycmVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmRlZmVycmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXJyYXlPZkRlZmZlcmVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmFycmF5T2ZEZWZmZXJlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZU1vY2tUYXNrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmNyZWF0ZU1vY2tUYXNrO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2xvbmVhYmxlR2VuZXJhdG9yJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmNsb25lYWJsZUdlbmVyYXRvcjtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FzRWZmZWN0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFzRWZmZWN0O1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdDSEFOTkVMX0VORCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9wcm9jLkNIQU5ORUxfRU5EO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHR2YXIgY29tcG9zZSA9IF9fd2VicGFja19yZXF1aXJlX18oMTk3KS5jb21wb3NlO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5jb21wb3NlV2l0aERldlRvb2xzID0gKFxuXHQgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18gP1xuXHQgICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA6XG5cdCAgICBmdW5jdGlvbigpIHtcblx0ICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XG5cdCAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JykgcmV0dXJuIGNvbXBvc2U7XG5cdCAgICAgIHJldHVybiBjb21wb3NlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdCAgICB9XG5cdCk7XG5cdFxuXHRleHBvcnRzLmRldlRvb2xzRW5oYW5jZXIgPSAoXG5cdCAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gP1xuXHQgICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gOlxuXHQgICAgZnVuY3Rpb24oKSB7IHJldHVybiBmdW5jdGlvbihub29wKSB7IHJldHVybiBub29wOyB9IH1cblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHRleHBvcnRzLnJlZHVjZXIgPSByZWR1Y2VyO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfcHVsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU2KTtcblx0XG5cdHZhciBfcHVsbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wdWxsKTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXHRcblx0Ly8gaW5pdGlhbCBzdGF0ZVxuXHR2YXIgaW5pdGlhbFN0YXRlID0ge1xuXHQgICAgc2VsZWN0QWxsOiB0cnVlLFxuXHQgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgZXJyb3I6IG51bGwsXG5cdCAgICB1c2VySWQ6IG51bGwsXG5cdCAgICBpc19yZXN0cmljdGVkOiBmYWxzZSxcblx0ICAgIGFsbF9wcm9qZWN0czogW10sXG5cdCAgICB1c2VyX3Byb2plY3RzOiBbXSxcblx0ICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICBvcmlnaW5hbF9wcm9qZWN0czogbnVsbFxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVkdWNlcigpIHtcblx0ICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuXHQgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG5cdCAgICAgICAgY2FzZSBjLlNFVF9TVE9SRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBhY3Rpb24uZGF0YTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgZmV0Y2hpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX1NVQ0NFU1M6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfYWN0aW9uJGRhdGEgPSBhY3Rpb24uZGF0YSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyB8fCBbXSxcblx0ICAgICAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCB8fCBmYWxzZVxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9HRVRfRkFJTFVSRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfUFVUX0lOSVQ6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzID0gYWN0aW9uLmRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IF91c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF9wcm9qZWN0czogbnVsbFxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLkFQSV9QVVRfRkFJTFVSRTpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIG5ld19zdGF0ZSA9IF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsX3Byb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcblx0ICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbmV3X3N0YXRlLmlzX3Jlc3RyaWN0ZWQgPSBzdGF0ZS5vcmlnaW5hbF9pc19yZXN0cmljdGVkO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsX3Byb2plY3RzICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbmV3X3N0YXRlLnVzZXJfcHJvamVjdHMgPSBzdGF0ZS5vcmlnaW5hbF9wcm9qZWN0cztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXdfc3RhdGU7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTjpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIHByb2plY3RJZCA9IGFjdGlvbi5kYXRhLnByb2plY3RJZDtcblx0XG5cdCAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMiA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgKDAsIF91dGlscy5pbkFycmF5KShwcm9qZWN0SWQsIF91c2VyX3Byb2plY3RzMikgPyAoMCwgX3B1bGwyLmRlZmF1bHQpKF91c2VyX3Byb2plY3RzMiwgcHJvamVjdElkKSA6IF91c2VyX3Byb2plY3RzMi5wdXNoKHByb2plY3RJZCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IG9yaWdpbmFsX3Byb2plY3RzOiBvcmlnaW5hbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0czogX3VzZXJfcHJvamVjdHMyIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRDpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlzX3Jlc3RyaWN0ZWQgPSBhY3Rpb24uZGF0YS5pc19yZXN0cmljdGVkO1xuXHRcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCwgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogc3RhdGUuaXNfcmVzdHJpY3RlZCB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFM6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMyA9IHZvaWQgMCxcblx0ICAgICAgICAgICAgICAgICAgICBfc3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUpLFxuXHQgICAgICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9IF9zdGF0ZS5zZWxlY3RBbGw7XG5cdFxuXHQgICAgICAgICAgICAgICAgaWYgKHNlbGVjdEFsbCkge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuaWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIF91c2VyX3Byb2plY3RzMyA9IFtdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgc2VsZWN0QWxsOiBzZWxlY3RBbGwsIG9yaWdpbmFsX3Byb2plY3RzOiBfb3JpZ2luYWxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHM6IF91c2VyX3Byb2plY3RzMyB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlUmVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU3KSxcblx0ICAgIHB1bGxBbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NCk7XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgZ2l2ZW4gdmFsdWVzIGZyb20gYGFycmF5YCB1c2luZ1xuXHQgKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuXHQgKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG5cdCAqXG5cdCAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcblx0ICogdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gYW4gYXJyYXkgYnkgcHJlZGljYXRlLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjAuMFxuXHQgKiBAY2F0ZWdvcnkgQXJyYXlcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHsuLi4qfSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcblx0ICpcblx0ICogXy5wdWxsKGFycmF5LCAnYScsICdjJyk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0dmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gcHVsbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KSxcblx0ICAgIG92ZXJSZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTgpLFxuXHQgICAgc2V0VG9TdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MCk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcblx0ICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBhcHBseSA9IF9fd2VicGFja19yZXF1aXJlX18oNzU5KTtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXHRcblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG5cdCAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuXHQgICAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuXHQgICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblx0XG5cdCAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuXHQgICAgfVxuXHQgICAgaW5kZXggPSAtMTtcblx0ICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuXHQgICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuXHQgICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG5cdCAgICB9XG5cdCAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcblx0ICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuXHQgIH07XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuXHQgKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG5cdCAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuXHQgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cblx0ICovXG5cdGZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcblx0ICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG5cdCAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG5cdCAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG5cdCAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG5cdCAgfVxuXHQgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VTZXRUb1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzYxKSxcblx0ICAgIHNob3J0T3V0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjMpO1xuXHRcblx0LyoqXG5cdCAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGNvbnN0YW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjIpLFxuXHQgICAgZGVmaW5lUHJvcGVydHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyOCksXG5cdCAgICBpZGVudGl0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNDM5KTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cblx0ICovXG5cdHZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuXHQgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG5cdCAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcblx0ICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG5cdCAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuXHQgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSAyLjQuMFxuXHQgKiBAY2F0ZWdvcnkgVXRpbFxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuXHQgKlxuXHQgKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcblx0ICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG5cdCAqXG5cdCAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuXHQgKiAvLyA9PiB0cnVlXG5cdCAqL1xuXHRmdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuXHQgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB2YWx1ZTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xuXHR2YXIgSE9UX0NPVU5UID0gODAwLFxuXHQgICAgSE9UX1NQQU4gPSAxNjtcblx0XG5cdC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cblx0dmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuXHQgKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcblx0ICogbWlsbGlzZWNvbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuXHQgIHZhciBjb3VudCA9IDAsXG5cdCAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcblx0ICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXHRcblx0ICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcblx0ICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG5cdCAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuXHQgICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNvdW50ID0gMDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VQdWxsQWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjUpO1xuXHRcblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKlxuXHQgKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDQuMC4wXG5cdCAqIEBjYXRlZ29yeSBBcnJheVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG5cdCAqXG5cdCAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG5cdCAqIGNvbnNvbGUubG9nKGFycmF5KTtcblx0ICogLy8gPT4gWydiJywgJ2InXVxuXHQgKi9cblx0ZnVuY3Rpb24gcHVsbEFsbChhcnJheSwgdmFsdWVzKSB7XG5cdCAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG5cdCAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG5cdCAgICA6IGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXJyYXlNYXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzNCksXG5cdCAgICBiYXNlSW5kZXhPZiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY2KSxcblx0ICAgIGJhc2VJbmRleE9mV2l0aCA9IF9fd2VicGFja19yZXF1aXJlX18oNzcwKSxcblx0ICAgIGJhc2VVbmFyeSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU2KSxcblx0ICAgIGNvcHlBcnJheSA9IF9fd2VicGFja19yZXF1aXJlX18oNzcxKTtcblx0XG5cdC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cblx0dmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cdFxuXHQvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cblx0dmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBbGxCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuXHQgKiBzaG9ydGhhbmRzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuXHQgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG5cdCAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG5cdCAgICAgIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG5cdCAgICAgIHNlZW4gPSBhcnJheTtcblx0XG5cdCAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcblx0ICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuXHQgIH1cblx0ICBpZiAoaXRlcmF0ZWUpIHtcblx0ICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG5cdCAgfVxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICB2YXIgZnJvbUluZGV4ID0gMCxcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF0sXG5cdCAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXHRcblx0ICAgIHdoaWxlICgoZnJvbUluZGV4ID0gaW5kZXhPZihzZWVuLCBjb21wdXRlZCwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSkgPiAtMSkge1xuXHQgICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcblx0ICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgICB9XG5cdCAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZUZpbmRJbmRleCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY3KSxcblx0ICAgIGJhc2VJc05hTiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY4KSxcblx0ICAgIHN0cmljdEluZGV4T2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OSk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuXHQgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcblx0ICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcblx0ICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcblx0ICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG5cdCAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcblx0ICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblx0XG5cdCAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcblx0ICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuXHQgKiBjb21wYXJpc29ucyBvZiB2YWx1ZXMsIGkuZS4gYD09PWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcblx0ICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuXHQgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuXHQgIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG5cdCAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGlmIChjb21wYXJhdG9yKGFycmF5W2luZGV4XSwgdmFsdWUpKSB7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG5cdCAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG5cdCAgdmFyIGluZGV4ID0gLTEsXG5cdCAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cdFxuXHQgIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuXHQgIH1cblx0ICByZXR1cm4gYXJyYXk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLndhdGNoZXJTYWdhID0gd2F0Y2hlclNhZ2E7XG5cdFxuXHR2YXIgX2VmZmVjdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgX2F4aW9zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzMpO1xuXHRcblx0dmFyIF9heGlvczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9heGlvcyk7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oMzI0KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIF9tYXJrZWQgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoZ2V0U2FnYSksXG5cdCAgICBfbWFya2VkMiA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhwdXRTYWdhKSxcblx0ICAgIF9tYXJrZWQzID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKHdhdGNoZXJTYWdhKTsgLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XG5cdGZ1bmN0aW9uIGZldGNoRGF0YSh1c2VySWQpIHtcblx0ICAgIHJldHVybiAoMCwgX2F4aW9zMi5kZWZhdWx0KSh7XG5cdCAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuXHQgICAgICAgIHVybDogXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIHVzZXJJZCArIFwiL1wiXG5cdCAgICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcHV0RGF0YSh1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpIHtcblx0ICAgIHJldHVybiAoMCwgX2F4aW9zMi5kZWZhdWx0KSh7XG5cdCAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxuXHQgICAgICAgIGhlYWRlcnM6IHtcblx0ICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiAoMCwgX3V0aWxzLmdldENvb2tpZSkoXCJjc3JmdG9rZW5cIilcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHVybDogXCIvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy9cIiArIHVzZXJJZCArIFwiL1wiLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuXHQgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHByb2plY3RzOiB1c2VyX3Byb2plY3RzXG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0U2FnYShhY3Rpb24pIHtcblx0ICAgIHZhciB1c2VySWQsIHJlc3BvbnNlLCBkYXRhO1xuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGdldFNhZ2EkKF9jb250ZXh0KSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IGFjdGlvbi5kYXRhLnVzZXJJZDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5wcmV2ID0gMTtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKGZldGNoRGF0YSwgdXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfY29udGV4dC5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSA4O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX0dFVF9TVUNDRVNTLCBkYXRhOiBkYXRhIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5wcmV2ID0gMTA7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQudDAgPSBfY29udGV4dFtcImNhdGNoXCJdKDEpO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3I6IF9jb250ZXh0LnQwIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQsIHRoaXMsIFtbMSwgMTBdXSk7XG5cdH1cblx0XG5cdHZhciBnZXRVc2VySWQgPSBmdW5jdGlvbiBnZXRVc2VySWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VySWQ7XG5cdH07XG5cdHZhciBnZXRVc2VyUHJvamVjdHMgPSBmdW5jdGlvbiBnZXRVc2VyUHJvamVjdHMoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS51c2VyX3Byb2plY3RzO1xuXHR9O1xuXHR2YXIgZ2V0SXNSZXN0cmljdGVkID0gZnVuY3Rpb24gZ2V0SXNSZXN0cmljdGVkKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUuaXNfcmVzdHJpY3RlZDtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHB1dFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzLCByZXNwb25zZSwgZGF0YTtcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBwdXRTYWdhJChfY29udGV4dDIpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0Mi5wcmV2ID0gX2NvbnRleHQyLm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIucHJldiA9IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDU7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA1OlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gODtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0SXNSZXN0cmljdGVkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTE7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldFVzZXJQcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMTpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKHB1dERhdGEsIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cyk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxNDpcblx0ICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IGRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxODpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLnByZXYgPSAyMDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIudDAgPSBfY29udGV4dDJbXCJjYXRjaFwiXSgwKTtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvcjogX2NvbnRleHQyLnQwIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjQ6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkMiwgdGhpcywgW1swLCAyMF1dKTtcblx0fVxuXHRcblx0Ly8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2Fcblx0ZnVuY3Rpb24gd2F0Y2hlclNhZ2EoKSB7XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gd2F0Y2hlclNhZ2EkKF9jb250ZXh0Mykge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQzLnByZXYgPSBfY29udGV4dDMubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuQVBJX0dFVF9JTklULCBnZXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDY7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA4O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDMsIHRoaXMpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzc2KTtcblx0dmFyIEF4aW9zID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzgpO1xuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuXHQgIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuXHQgIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXHRcblx0ICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG5cdCAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblx0XG5cdCAgcmV0dXJuIGluc3RhbmNlO1xuXHR9XG5cdFxuXHQvLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcblx0dmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXHRcblx0Ly8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5cdGF4aW9zLkF4aW9zID0gQXhpb3M7XG5cdFxuXHQvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5cdGF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuXHQgIHJldHVybiBjcmVhdGVJbnN0YW5jZSh1dGlscy5tZXJnZShkZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcblx0fTtcblx0XG5cdC8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuXHRheGlvcy5DYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Nik7XG5cdGF4aW9zLkNhbmNlbFRva2VuID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRheGlvcy5pc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0XG5cdC8vIEV4cG9zZSBhbGwvc3ByZWFkXG5cdGF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuXHQgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdH07XG5cdGF4aW9zLnNwcmVhZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cdFxuXHQvLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcblx0bW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBpc0J1ZmZlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzc3KTtcblx0XG5cdC8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXHRcblx0Ly8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3Ncblx0XG5cdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuXHQgIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcblx0ICB2YXIgcmVzdWx0O1xuXHQgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcblx0ICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG5cdCAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0RhdGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2Jcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG5cdCAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcblx0fVxuXHRcblx0LyoqXG5cdCAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmltKHN0cikge1xuXHQgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcblx0ICpcblx0ICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cblx0ICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuXHQgKlxuXHQgKiB3ZWIgd29ya2Vyczpcblx0ICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG5cdCAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG5cdCAqXG5cdCAqIHJlYWN0LW5hdGl2ZTpcblx0ICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICByZXR1cm4gKFxuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcblx0ICApO1xuXHR9XG5cdFxuXHQvKipcblx0ICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3Npbmdcblx0ICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG5cdCAqXG5cdCAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cblx0ICovXG5cdGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuXHQgIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuXHQgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdFxuXHQgIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuXHQgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBvYmogPSBbb2JqXTtcblx0ICB9XG5cdFxuXHQgIGlmIChpc0FycmF5KG9iaikpIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcblx0ICAgIH1cblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG5cdCAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuXHQgKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cblx0ICpcblx0ICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cblx0ICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuXHQgKlxuXHQgKiBFeGFtcGxlOlxuXHQgKlxuXHQgKiBgYGBqc1xuXHQgKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG5cdCAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuXHQgKi9cblx0ZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG5cdCAgdmFyIHJlc3VsdCA9IHt9O1xuXHQgIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuXHQgICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cblx0ICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG5cdCAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcblx0ICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG5cdCAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGFba2V5XSA9IHZhbDtcblx0ICAgIH1cblx0ICB9KTtcblx0ICByZXR1cm4gYTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgaXNBcnJheTogaXNBcnJheSxcblx0ICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuXHQgIGlzQnVmZmVyOiBpc0J1ZmZlcixcblx0ICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuXHQgIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcblx0ICBpc1N0cmluZzogaXNTdHJpbmcsXG5cdCAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuXHQgIGlzT2JqZWN0OiBpc09iamVjdCxcblx0ICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG5cdCAgaXNEYXRlOiBpc0RhdGUsXG5cdCAgaXNGaWxlOiBpc0ZpbGUsXG5cdCAgaXNCbG9iOiBpc0Jsb2IsXG5cdCAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcblx0ICBpc1N0cmVhbTogaXNTdHJlYW0sXG5cdCAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuXHQgIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcblx0ICBmb3JFYWNoOiBmb3JFYWNoLFxuXHQgIG1lcmdlOiBtZXJnZSxcblx0ICBleHRlbmQ6IGV4dGVuZCxcblx0ICB0cmltOiB0cmltXG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcblx0ICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIVxuXHQgKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG5cdCAqXG5cdCAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG5cdCAqIEBsaWNlbnNlICBNSVRcblx0ICovXG5cdFxuXHQvLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG5cdC8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG5cdCAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG5cdH1cblx0XG5cdC8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5cdGZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG5cdH1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTApO1xuXHR2YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTEpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdGZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG5cdCAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuXHQgIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuXHQgICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuXHQgICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuXHQgIH07XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhIHJlcXVlc3Rcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG5cdCAqL1xuXHRBeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuXHQgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuXHQgICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuXHQgICAgICB1cmw6IGFyZ3VtZW50c1swXVxuXHQgICAgfSwgYXJndW1lbnRzWzFdKTtcblx0ICB9XG5cdFxuXHQgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cdCAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblx0XG5cdCAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuXHQgIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG5cdCAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG5cdCAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuXHQgIH0pO1xuXHRcblx0ICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuXHQgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXHRcblx0Ly8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG5cdHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuXHQgIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cdCAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuXHQgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcblx0ICAgICAgbWV0aG9kOiBtZXRob2QsXG5cdCAgICAgIHVybDogdXJsLFxuXHQgICAgICBkYXRhOiBkYXRhXG5cdCAgICB9KSk7XG5cdCAgfTtcblx0fSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApO1xuXHRcblx0dmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuXHQgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG5cdCAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcblx0ICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcblx0ICB2YXIgYWRhcHRlcjtcblx0ICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuXHQgICAgYWRhcHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgxKTtcblx0ICB9XG5cdCAgcmV0dXJuIGFkYXB0ZXI7XG5cdH1cblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0ICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG5cdCAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuXHQgICAgKSB7XG5cdCAgICAgIHJldHVybiBkYXRhO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG5cdCAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuXHQgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcblx0ICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGRhdGE7XG5cdCAgfV0sXG5cdFxuXHQgIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuXHQgICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICAvKipcblx0ICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcblx0ICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuXHQgICAqL1xuXHQgIHRpbWVvdXQ6IDAsXG5cdFxuXHQgIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG5cdCAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXHRcblx0ICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblx0XG5cdCAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuXHQgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuXHQgIH1cblx0fTtcblx0XG5cdGRlZmF1bHRzLmhlYWRlcnMgPSB7XG5cdCAgY29tbW9uOiB7XG5cdCAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcblx0ICB9XG5cdH07XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcblx0ICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcblx0ICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcblx0ICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHNldHRsZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgyKTtcblx0dmFyIGJ1aWxkVVJMID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHR2YXIgcGFyc2VIZWFkZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODYpO1xuXHR2YXIgaXNVUkxTYW1lT3JpZ2luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODcpO1xuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdHZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuXHQgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcblx0ICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXHRcblx0ICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuXHQgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0ICAgIHZhciBsb2FkRXZlbnQgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcblx0ICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cdFxuXHQgICAgLy8gRm9yIElFIDgvOSBDT1JTIHN1cHBvcnRcblx0ICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG5cdCAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmXG5cdCAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0ICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuXHQgICAgICAgICFpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpIHtcblx0ICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcblx0ICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG5cdCAgICAgIHhEb21haW4gPSB0cnVlO1xuXHQgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuXHQgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG5cdCAgICBpZiAoY29uZmlnLmF1dGgpIHtcblx0ICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG5cdCAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuXHQgICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuXHQgICAgfVxuXHRcblx0ICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cdFxuXHQgICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcblx0ICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXHRcblx0ICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcblx0ICAgIHJlcXVlc3RbbG9hZEV2ZW50XSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG5cdCAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG5cdCAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG5cdCAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG5cdCAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3Rcblx0ICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuXHQgICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG5cdCAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdCAgICAgIHZhciByZXNwb25zZSA9IHtcblx0ICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG5cdCAgICAgICAgLy8gSUUgc2VuZHMgMTIyMyBpbnN0ZWFkIG9mIDIwNCAoaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy8yMDEpXG5cdCAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuXHQgICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuXHQgICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcblx0ICAgICAgICBjb25maWc6IGNvbmZpZyxcblx0ICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG5cdCAgICAgIH07XG5cdFxuXHQgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG5cdCAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcblx0ICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG5cdCAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEhhbmRsZSB0aW1lb3V0XG5cdCAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG5cdCAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuXHQgICAgICAgIHJlcXVlc3QpKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuXHQgICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG5cdCAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXHQgICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcblx0ICAgICAgdmFyIGNvb2tpZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OSk7XG5cdFxuXHQgICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cblx0ICAgICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcblx0ICAgICAgICAgIHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIGlmICh4c3JmVmFsdWUpIHtcblx0ICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3Rcblx0ICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuXHQgICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG5cdCAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG5cdCAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3Rcblx0ICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cdCAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuXHQgICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG5cdCAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cblx0ICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG5cdCAgICAgICAgICB0aHJvdyBlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcblx0ICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcblx0ICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuXHQgICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG5cdCAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcblx0ICAgICAgICBpZiAoIXJlcXVlc3QpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcblx0ICAgICAgICByZWplY3QoY2FuY2VsKTtcblx0ICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG5cdCAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuXHQgIH0pO1xuXHR9O1xuXHRcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBjcmVhdGVFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzgzKTtcblx0XG5cdC8qKlxuXHQgKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuXHQgIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcblx0ICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3Rcblx0ICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuXHQgICAgcmVzb2x2ZShyZXNwb25zZSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlamVjdChjcmVhdGVFcnJvcihcblx0ICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcblx0ICAgICAgcmVzcG9uc2UuY29uZmlnLFxuXHQgICAgICBudWxsLFxuXHQgICAgICByZXNwb25zZS5yZXF1ZXN0LFxuXHQgICAgICByZXNwb25zZVxuXHQgICAgKSk7XG5cdCAgfVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGVuaGFuY2VFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzg0KTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0ICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuXHQgIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcblx0ICBpZiAoY29kZSkge1xuXHQgICAgZXJyb3IuY29kZSA9IGNvZGU7XG5cdCAgfVxuXHQgIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuXHQgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG5cdCAgcmV0dXJuIGVycm9yO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuXHQgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cblx0ICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cblx0ICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cblx0ICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuXHQgICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuXHQgICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG5cdCAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG5cdCAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgaWYgKCFwYXJhbXMpIHtcblx0ICAgIHJldHVybiB1cmw7XG5cdCAgfVxuXHRcblx0ICB2YXIgc2VyaWFsaXplZFBhcmFtcztcblx0ICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcblx0ICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgdmFyIHBhcnRzID0gW107XG5cdFxuXHQgICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuXHQgICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG5cdCAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YWwgPSBbdmFsXTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuXHQgICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcblx0ICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuXHQgICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuXHQgIH1cblx0XG5cdCAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcblx0ICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcblx0ICB9XG5cdFxuXHQgIHJldHVybiB1cmw7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHQvLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuXHQvLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5cdHZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcblx0ICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuXHQgICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcblx0ICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG5cdCAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcblx0XTtcblx0XG5cdC8qKlxuXHQgKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG5cdCAqXG5cdCAqIGBgYFxuXHQgKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuXHQgKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cblx0ICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuXHQgKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuXHQgIHZhciBwYXJzZWQgPSB7fTtcblx0ICB2YXIga2V5O1xuXHQgIHZhciB2YWw7XG5cdCAgdmFyIGk7XG5cdFxuXHQgIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cdFxuXHQgIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG5cdCAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG5cdCAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXHRcblx0ICAgIGlmIChrZXkpIHtcblx0ICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuXHQgICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBwYXJzZWQ7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IChcblx0ICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblx0XG5cdCAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG5cdCAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG5cdCAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0ICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0ICAgIHZhciBvcmlnaW5VUkw7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG5cdCAgICAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAgICAqL1xuXHQgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcblx0ICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cdFxuXHQgICAgICBpZiAobXNpZSkge1xuXHQgICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcblx0ICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblx0ICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdFxuXHQgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcblx0ICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG5cdCAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG5cdCAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuXHQgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG5cdCAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuXHQgICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG5cdCAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdFxuXHQgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG5cdCAgICAqXG5cdCAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuXHQgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAgICAqL1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG5cdCAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG5cdCAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcblx0ICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5cdCAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfTtcblx0ICB9KSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvLyBidG9hIHBvbHlmaWxsIGZvciBJRTwxMCBjb3VydGVzeSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcblx0XG5cdHZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cdFxuXHRmdW5jdGlvbiBFKCkge1xuXHQgIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xuXHR9XG5cdEUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuXHRFLnByb3RvdHlwZS5jb2RlID0gNTtcblx0RS5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXHRcblx0ZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuXHQgIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpO1xuXHQgIHZhciBvdXRwdXQgPSAnJztcblx0ICBmb3IgKFxuXHQgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcblx0ICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuXHQgICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuXHQgICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcblx0ICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcblx0ICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG5cdCAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuXHQgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG5cdCAgKSB7XG5cdCAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGlkeCArPSAzIC8gNCk7XG5cdCAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG5cdCAgICAgIHRocm93IG5ldyBFKCk7XG5cdCAgICB9XG5cdCAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcblx0ICB9XG5cdCAgcmV0dXJuIG91dHB1dDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBidG9hO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG5cdCAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuXHQgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcblx0ICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuXHQgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG5cdCAgICAgIH0sXG5cdFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG5cdCAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9KSgpIDpcblx0XG5cdCAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG5cdCAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuXHQgIHRoaXMuaGFuZGxlcnMgPSBbXTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG5cdCAgdGhpcy5oYW5kbGVycy5wdXNoKHtcblx0ICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuXHQgICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG5cdCAgfSk7XG5cdCAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG5cdCAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG5cdCAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG5cdCAqXG5cdCAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG5cdCAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuXHQgIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuXHQgICAgaWYgKGggIT09IG51bGwpIHtcblx0ICAgICAgZm4oaCk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIHRyYW5zZm9ybURhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Mik7XG5cdHZhciBpc0NhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHR2YXIgaXNBYnNvbHV0ZVVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk0KTtcblx0dmFyIGNvbWJpbmVVUkxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTUpO1xuXHRcblx0LyoqXG5cdCAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuXHQgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3Rcblx0ICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG5cdCAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG5cdCAgaWYgKGNvbmZpZy5iYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKGNvbmZpZy51cmwpKSB7XG5cdCAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuXHQgIH1cblx0XG5cdCAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3Rcblx0ICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXHRcblx0ICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG5cdCAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgY29uZmlnLmRhdGEsXG5cdCAgICBjb25maWcuaGVhZGVycyxcblx0ICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG5cdCAgKTtcblx0XG5cdCAgLy8gRmxhdHRlbiBoZWFkZXJzXG5cdCAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcblx0ICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuXHQgICAgY29uZmlnLmhlYWRlcnMgfHwge31cblx0ICApO1xuXHRcblx0ICB1dGlscy5mb3JFYWNoKFxuXHQgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG5cdCAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcblx0ICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG5cdCAgICB9XG5cdCAgKTtcblx0XG5cdCAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXHRcblx0ICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuXHQgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgICAgcmVzcG9uc2UuZGF0YSxcblx0ICAgICAgcmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICApO1xuXHRcblx0ICAgIHJldHVybiByZXNwb25zZTtcblx0ICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG5cdCAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcblx0ICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXHRcblx0ICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblx0ICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcblx0ICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcblx0ICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuXHQgICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG5cdCAgICAgICAgKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0LyoqXG5cdCAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2Vcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG5cdCAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcblx0ICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcblx0ICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIGRhdGE7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG5cdCAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG5cdCAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuXHQgIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuXHQgIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuXHQgIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG5cdCAgcmV0dXJuIHJlbGF0aXZlVVJMXG5cdCAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuXHQgICAgOiBiYXNlVVJMO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG5cdH07XG5cdFxuXHRDYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRcblx0LyoqXG5cdCAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuXHQgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcblx0ICB9XG5cdFxuXHQgIHZhciByZXNvbHZlUHJvbWlzZTtcblx0ICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuXHQgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuXHQgIH0pO1xuXHRcblx0ICB2YXIgdG9rZW4gPSB0aGlzO1xuXHQgIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG5cdCAgICBpZiAodG9rZW4ucmVhc29uKSB7XG5cdCAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdFxuXHQgICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcblx0ICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG5cdCAgfSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0Q2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuXHQgIGlmICh0aGlzLnJlYXNvbikge1xuXHQgICAgdGhyb3cgdGhpcy5yZWFzb247XG5cdCAgfVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcblx0ICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cblx0ICovXG5cdENhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcblx0ICB2YXIgY2FuY2VsO1xuXHQgIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG5cdCAgICBjYW5jZWwgPSBjO1xuXHQgIH0pO1xuXHQgIHJldHVybiB7XG5cdCAgICB0b2tlbjogdG9rZW4sXG5cdCAgICBjYW5jZWw6IGNhbmNlbFxuXHQgIH07XG5cdH07XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG5cdCAqXG5cdCAqICBgYGBqc1xuXHQgKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuXHQgKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG5cdCAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHQgKiAgYGBgXG5cdCAqXG5cdCAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuXHQgIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuXHQgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG5cdCAgfTtcblx0fTtcblxuXG4vKioqLyB9KVxuXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIi8qXG4gQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuaW1wb3J0IEFwcCBmcm9tIFwiLi9jb21wb25lbnRzL0FwcFwiO1xuXG5pbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21wb3NlIH0gZnJvbSBcInJlZHV4XCI7XG5pbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcInJlZHV4LXNhZ2FcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgeyBjb21wb3NlV2l0aERldlRvb2xzIH0gZnJvbSAncmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uJztcblxuaW1wb3J0IHsgcmVkdWNlciB9IGZyb20gXCIuL3JlZHVjZXJcIjtcbmltcG9ydCB7IHdhdGNoZXJTYWdhIH0gZnJvbSBcIi4vc2FnYXNcIjtcblxuLy8gY3JlYXRlIHRoZSBzYWdhIG1pZGRsZXdhcmVcbmNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKTtcblxuXG4vLyBkZXYgdG9vbHMgbWlkZGxld2FyZVxuY29uc3QgcmVkdXhEZXZUb29scyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCk7XG5cbmxldCBzdG9yZTtcbmlmIChyZWR1eERldlRvb2xzKSB7XG4gICAgc3RvcmUgID0gY3JlYXRlU3RvcmUocmVkdWNlciwgY29tcG9zZShhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSlcbn0gZWxzZSB7XG4gICAgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKTtcbn1cblxuc2FnYU1pZGRsZXdhcmUucnVuKHdhdGNoZXJTYWdhKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgICAgIDxBcHAgLz5cbiAgICAgICAgPC9Qcm92aWRlcj4sXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclByb2plY3RzXCIpXG4gICAgKTtcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvYXBwLmpzIiwiLypcbiAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IF8sIGRhdGFGcm9tRWxlbWVudCwgaW5BcnJheSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuLi9jb25zdFwiO1xuXG5jb25zdCBJc1Jlc3RyaWN0ZWQgPSAoeyBfLCBpc19yZXN0cmljdGVkLCBvbkNoYW5nZUlzUmVzdHJpY3RlZCB9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGlkPVwiaXNfcmVzdHJpY3RlZFwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIHtfKFwiZ3JhbnRfYWNjZXNzXCIpfVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jb25zdCBQcm9qZWN0ID0gKHsgXywgcHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IGNoZWNrZWQgPSB1c2VyX3Byb2plY3RzICYmIGluQXJyYXkocHJvamVjdC5pZCwgdXNlcl9wcm9qZWN0cyksXG4gICAgICAgIHNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiOiBcIlwiLFxuICAgICAgICBjbGFzc05hbWUgPSAoaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIpICsgc2VsZWN0ZWQ7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHRyXG4gICAgICAgICAgICBrZXk9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBpZD17cHJvamVjdC5pZH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2hhbmdlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgID5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQ+e3Byb2plY3QuaWR9PC90ZD5cbiAgICAgICAgICAgIDx0ZD57cHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIil9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICApO1xufTtcblxuY29uc3QgU2VsZWN0QWxsID0gKHsgXywgc2VsZWN0QWxsLCBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGlzX3Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgY2xhc3NOYW1lID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIik7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2lzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCJ9PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9IGRpc2FibGVkPXtkaXNhYmxlZH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHtzZWxlY3RBbGwgPyBfKFwic2VsZWN0X2FsbFwiKSA6IF8oXCJkZXNlbGVjdF9hbGxcIil9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmNvbnN0IEVycm9yID0gKHsgXywgZXJyb3IgfSkgPT4ge1xuICAgIHJldHVybiBlcnJvciA/IDxkaXY+e18oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZX08L2Rpdj4gOiBudWxsO1xufTtcblxuY29uc3QgUHJvamVjdHMgPSAoe1xuICAgIF8sXG4gICAgZXJyb3IsXG4gICAgYWxsX3Byb2plY3RzLFxuICAgIHVzZXJfcHJvamVjdHMsXG4gICAgaXNfcmVzdHJpY3RlZCxcbiAgICBzZWxlY3RBbGwsXG4gICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG59KSA9PiB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8RXJyb3IgXz17X30gZXJyb3I9e2Vycm9yfSAvPlxuICAgICAgICAgICAgPElzUmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17b25DaGFuZ2VJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFNlbGVjdEFsbFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXtvbkNoYW5nZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwiY2FuX2FjY2Vzc1wiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcInByb2plY3RfaWRcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJwcm9qZWN0X3RpdGxlXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHthbGxfcHJvamVjdHMubWFwKHByb2plY3QgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFByb2plY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXtwcm9qZWN0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM9e3VzZXJfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCA9IHRoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl8gPSB0aGlzLl8uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuICAgIF8ocykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcbiAgICB9XG5cbiAgICB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBpZiAoIXRhcmdldC5jbG9zZXN0KFwidGFibGVcIikuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCB1c2VySWQgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBkYXRhRnJvbUVsZW1lbnQoXCJ1c2VyLXByb2plY3RzLXRleHRcIik7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyBzdHJpbmdzIH0pO1xuXG4gICAgICAgIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIGFsbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cywgZXJyb3IgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBhbGxfcHJvamVjdHMgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsPXtzZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzPXthbGxfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cz17dXNlcl9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZD17dGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsPXt0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXY+e18oXCJsb2FkaW5nXCIpfTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgICAgZmV0Y2hpbmcsXG4gICAgICAgIGVycm9yLFxuICAgICAgICBhbGxfcHJvamVjdHMsXG4gICAgICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgIHNlbGVjdEFsbCxcbiAgICAgICAgdXNlcl9wcm9qZWN0cyxcbiAgICAgICAgc3RyaW5nc1xuICAgIH0gPSBzdGF0ZTtcbiAgICByZXR1cm4geyBmZXRjaGluZywgZXJyb3IsIGFsbF9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsLCB1c2VyX3Byb2plY3RzLCBzdHJpbmdzIH07XG59O1xuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSBkaXNwYXRjaCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb25GZXRjaFVzZXJQcm9qZWN0czogdXNlcklkID0+IGRpc3BhdGNoKHsgdHlwZTogYy5BUElfR0VUX0lOSVQsIGRhdGE6IHsgdXNlcklkIH0gfSksXG4gICAgICAgIHNldFN0b3JlOiBkYXRhID0+IGRpc3BhdGNoKHsgdHlwZTogYy5TRVRfU1RPUkUsIGRhdGEgfSksXG4gICAgICAgIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbjogcHJvamVjdElkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBkYXRhOiB7IHByb2plY3RJZCB9IH0pLFxuICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9JU19SRVNUUklDVEVELCBkYXRhOiB7IGlzX3Jlc3RyaWN0ZWQgfSB9KSxcbiAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KVxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShBcHApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4uL215LXJlc3VsdHMvc3RvcmVcIjtcblxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICB1c2VyX3Byb2plY3RzX2FjY2VzczogaWQgPT4gYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7aWR9Lz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBjb25zdCBpbkFycmF5ID0gKG9iaiwgYXJyKSA9PiBhcnIgJiYgYXJyLmluZGV4T2Yob2JqKSAhPT0gLTE7XG5cbmV4cG9ydCBjb25zdCBkYXRhRnJvbUVsZW1lbnQgPSBlbGVtZW50TmFtZSA9PiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvdXRpbHMuanMiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIGFjdGlvbiB0eXBlc1xuZXhwb3J0IGNvbnN0IC8vXG4gICAgU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcbiAgICAvL1xuICAgIEFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG4gICAgQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcbiAgICBBUElfR0VUX0ZBSUxVUkUgPSBcIkFQSV9HRVRfRkFJTFVSRVwiLFxuICAgIC8vXG4gICAgQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcbiAgICBBUElfUFVUX1NVQ0NFU1MgPSBcIkFQSV9QVVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBcIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTlwiLFxuICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gXCJVUERBVEVfSVNfUkVTVFJJQ1RFRFwiLFxuICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gXCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU1wiO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29uc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXG52YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9ydW5TYWdhJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG4gIH1cbn0pO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9jaGFubmVsJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuRU5EO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZXZlbnRDaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuZXZlbnRDaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLmNoYW5uZWw7XG4gIH1cbn0pO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9idWZmZXJzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG4gIH1cbn0pO1xuXG52YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvc2FnYUhlbHBlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG4gIH1cbn0pO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5kZWxheTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG4gIH1cbn0pO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZGV0YWNoO1xuICB9XG59KTtcblxudmFyIF9taWRkbGV3YXJlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvbWlkZGxld2FyZScpO1xuXG52YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXG52YXIgX2VmZmVjdHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9lZmZlY3RzJyk7XG5cbnZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblxudmFyIF91dGlsczIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuZXhwb3J0cy5lZmZlY3RzID0gZWZmZWN0cztcbmV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDczOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcHJvYycpO1xuXG52YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcbnZhciBOT05fR0VORVJBVE9SX0VSUiA9IFJVTl9TQUdBX1NJR05BVFVSRSArICc6IHNhZ2EgYXJndW1lbnQgbXVzdCBiZSBhIEdlbmVyYXRvciBmdW5jdGlvbiEnO1xuXG5mdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3Ioc3RvcmVJbnRlcmZhY2UpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG4gICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG4gICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9OX0dFTkVSQVRPUl9FUlIpO1xuICB9XG5cbiAgdmFyIF9zdG9yZUludGVyZmFjZSA9IHN0b3JlSW50ZXJmYWNlLFxuICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuICAgICAgZ2V0U3RhdGUgPSBfc3RvcmVJbnRlcmZhY2UuZ2V0U3RhdGUsXG4gICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG4gICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IF9zdG9yZUludGVyZmFjZS5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cblxuICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkID0gc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCB8fCBfdXRpbHMubm9vcDtcblxuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG4gIH1cblxuICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cbiAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuICB9XG5cbiAgcmV0dXJuIHRhc2s7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3J1blNhZ2EuanNcbi8vIG1vZHVsZSBpZCA9IDczOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xuZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbmV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcbmV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuZXhwb3J0cy5jcmVhdGVNb2NrVGFzayA9IGNyZWF0ZU1vY2tUYXNrO1xuZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcbmV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcbnZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuICByZXR1cm4gJ0BAcmVkdXgtc2FnYS8nICsgaWQ7XG59O1xuXG52YXIgVEFTSyA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlRBU0sgPSBzeW0oJ1RBU0snKTtcbnZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xudmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG52YXIgQ0FOQ0VMID0gLyojX19QVVJFX18qL2V4cG9ydHMuQ0FOQ0VMID0gc3ltKCdDQU5DRUxfUFJPTUlTRScpO1xudmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG52YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcbnZhciBrb25zdCA9IGV4cG9ydHMua29uc3QgPSBmdW5jdGlvbiBrb25zdCh2KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xudmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcbnZhciBrRmFsc2UgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rRmFsc2UgPSBrb25zdChmYWxzZSk7XG52YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcbnZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG4gIHJldHVybiB2O1xufTtcblxuZnVuY3Rpb24gY2hlY2sodmFsdWUsIHByZWRpY2F0ZSwgZXJyb3IpIHtcbiAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gaXMubm90VW5kZWYob2JqZWN0KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG52YXIgaXMgPSBleHBvcnRzLmlzID0ge1xuICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcbiAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG4gIH0sXG4gIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG4gIH0sXG4gIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuICB9LFxuICBhcnJheTogQXJyYXkuaXNBcnJheSxcbiAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiAhaXMuYXJyYXkob2JqKSAmJiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKSkgPT09ICdvYmplY3QnO1xuICB9LFxuICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcbiAgICByZXR1cm4gcCAmJiBpcy5mdW5jKHAudGhlbik7XG4gIH0sXG4gIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKGl0Lm5leHQpICYmIGlzLmZ1bmMoaXQudGhyb3cpO1xuICB9LFxuICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhTeW1ib2wpID8gaXMuZnVuYyhpdFtTeW1ib2wuaXRlcmF0b3JdKSA6IGlzLmFycmF5KGl0KTtcbiAgfSxcbiAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG4gICAgcmV0dXJuIHQgJiYgdFtUQVNLXTtcbiAgfSxcbiAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuICAgIHJldHVybiBvYiAmJiBpcy5mdW5jKG9iLnN1YnNjcmliZSk7XG4gIH0sXG4gIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuICAgIHJldHVybiBidWYgJiYgaXMuZnVuYyhidWYuaXNFbXB0eSkgJiYgaXMuZnVuYyhidWYudGFrZSkgJiYgaXMuZnVuYyhidWYucHV0KTtcbiAgfSxcbiAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcbiAgICByZXR1cm4gcGF0ICYmIChpcy5zdHJpbmcocGF0KSB8fCAodHlwZW9mIHBhdCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0KSkgPT09ICdzeW1ib2wnIHx8IGlzLmZ1bmMocGF0KSB8fCBpcy5hcnJheShwYXQpKTtcbiAgfSxcbiAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaCAmJiBpcy5mdW5jKGNoLnRha2UpICYmIGlzLmZ1bmMoY2guY2xvc2UpO1xuICB9LFxuICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpdFtIRUxQRVJdO1xuICB9LFxuICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuICAgIHJldHVybiBpcy5mdW5jKGYpICYmIGhhc093bihmLCAndG9TdHJpbmcnKTtcbiAgfVxufTtcblxudmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufVxuXG52YXIgYXJyYXkgPSBleHBvcnRzLmFycmF5ID0ge1xuICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG4gICAgICAgIGFycltpXSA9IG9ialtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG4gIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIGRlZiA9IF9leHRlbmRzKHt9LCBwcm9wcyk7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBkZWYucmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbiAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBhcnJheU9mRGVmZmVyZWQobGVuZ3RoKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGRlZmVycmVkKCkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gIHZhciB2YWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cbiAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcbiAgICB9LCBtcyk7XG4gIH0pO1xuXG4gIHByb21pc2VbQ0FOQ0VMXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gIH07XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuICB2YXIgX3JlZjtcblxuICB2YXIgcnVubmluZyA9IHRydWU7XG4gIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgX2Vycm9yID0gdm9pZCAwO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICByZXR1cm4gcnVubmluZztcbiAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG4gICAgcmV0dXJuIF9yZXN1bHQ7XG4gIH0sIF9yZWYuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICByZXR1cm4gX2Vycm9yO1xuICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcbiAgICByZXR1cm4gcnVubmluZyA9IGI7XG4gIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcbiAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG4gIH0sIF9yZWYuc2V0RXJyb3IgPSBmdW5jdGlvbiBzZXRFcnJvcihlKSB7XG4gICAgcmV0dXJuIF9lcnJvciA9IGU7XG4gIH0sIF9yZWY7XG59XG5cbmZ1bmN0aW9uIGF1dG9JbmMoKSB7XG4gIHZhciBzZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICsrc2VlZDtcbiAgfTtcbn1cblxudmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblxudmFyIGtUaHJvdyA9IGZ1bmN0aW9uIGtUaHJvdyhlcnIpIHtcbiAgdGhyb3cgZXJyO1xufTtcbnZhciBrUmV0dXJuID0gZnVuY3Rpb24ga1JldHVybih2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcbn07XG5mdW5jdGlvbiBtYWtlSXRlcmF0b3IobmV4dCkge1xuICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gIHZhciBpc0hlbHBlciA9IGFyZ3VtZW50c1szXTtcblxuICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblxuICBpZiAoaXNIZWxwZXIpIHtcbiAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG4vKipcbiAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG4gICh0ZXh0LW9ubHkgbG9nIG91dHB1dClcbiAqKi9cbmZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlW2xldmVsXShtZXNzYWdlLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGxvZygnd2FybicsIGRlcHJlY2F0aW9uV2FybmluZyk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuICByZXR1cm4gZGVwcmVjYXRlZCArICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgcHJlZmVycmVkICsgJywgcGxlYXNlIHVwZGF0ZSB5b3VyIGNvZGUnO1xufTtcblxudmFyIGludGVybmFsRXJyID0gZXhwb3J0cy5pbnRlcm5hbEVyciA9IGZ1bmN0aW9uIGludGVybmFsRXJyKGVycikge1xuICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xufTtcblxudmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcbiAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcbn07XG5cbnZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG4gIH07XG59O1xuXG52YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBoaXN0b3J5ID0gW107XG4gICAgdmFyIGdlbiA9IGdlbmVyYXRvckZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcbiAgICAgICAgaGlzdG9yeS5wdXNoKGFyZyk7XG4gICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuICAgICAgfSxcbiAgICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHJldHVybiBjbG9uZWRHZW4ubmV4dChhcmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcbiAgICAgIH0sXG4gICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9idWZmZXJzJyk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhvYmosIGRlc2NzKSB7IGZvciAodmFyIGtleSBpbiBkZXNjcykgeyB2YXIgZGVzYyA9IGRlc2NzW2tleV07IGRlc2MuY29uZmlndXJhYmxlID0gZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBkZXNjKTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cbnZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG4gIH1cbn07XG52YXIgVEFTS19DQU5DRUwgPSBleHBvcnRzLlRBU0tfQ0FOQ0VMID0ge1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuICB9XG59O1xuXG52YXIgbWF0Y2hlcnMgPSB7XG4gIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuICB9LFxuICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IHBhdHRlcm47XG4gICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcbiAgICB9O1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICBwcmVkaWNhdGU6IGZ1bmN0aW9uIHByZWRpY2F0ZShfcHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgcmV0dXJuIChwYXR0ZXJuID09PSAnKicgPyBtYXRjaGVycy53aWxkY2FyZCA6IF91dGlscy5pcy5hcnJheShwYXR0ZXJuKSA/IG1hdGNoZXJzLmFycmF5IDogX3V0aWxzLmlzLnN0cmluZ2FibGVGdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMuZGVmYXVsdCA6IF91dGlscy5pcy5mdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMucHJlZGljYXRlIDogbWF0Y2hlcnMuZGVmYXVsdCkocGF0dGVybik7XG59XG5cbi8qKlxuICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcbiAgV2UgbW9kZWwgdGhpcyB1c2luZyB0aGUgY29uY2VwdCBvZiBQYXJlbnQgdGFzayAmJiBtYWluIFRhc2tcbiAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuICBUaHVzIHRoZSB3aG9sZSBtb2RlbCByZXByZXNlbnRzIGFuIGV4ZWN1dGlvbiB0cmVlIHdpdGggbXVsdGlwbGUgYnJhbmNoZXMgKHZzIHRoZVxuICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblxuICBBIHBhcmVudCB0YXNrcyBoYXMgdGhlIGZvbGxvd2luZyBzZW1hbnRpY3NcbiAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG4gIC0gSXQgYWJvcnRzIGlmIGFueSB1bmNhdWdodCBlcnJvciBidWJibGVzIHVwIGZyb20gZm9ya3NcbiAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG4qKi9cbmZ1bmN0aW9uIGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgY2IpIHtcbiAgdmFyIHRhc2tzID0gW10sXG4gICAgICByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgYWRkVGFzayhtYWluVGFzayk7XG5cbiAgZnVuY3Rpb24gYWJvcnQoZXJyKSB7XG4gICAgY2FuY2VsQWxsKCk7XG4gICAgY2IoZXJyLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuICAgIHRhc2tzLnB1c2godGFzayk7XG4gICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAoMCwgX3V0aWxzLnJlbW92ZSkodGFza3MsIHRhc2spO1xuICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgYWJvcnQocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuICAgICAgICAgIHJlc3VsdCA9IHJlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG4gICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuICAgICAgdC5jYW5jZWwoKTtcbiAgICB9KTtcbiAgICB0YXNrcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRUYXNrOiBhZGRUYXNrLFxuICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuICAgIGFib3J0OiBhYm9ydCxcbiAgICBnZXRUYXNrczogZnVuY3Rpb24gZ2V0VGFza3MoKSB7XG4gICAgICByZXR1cm4gdGFza3M7XG4gICAgfSxcbiAgICB0YXNrTmFtZXM6IGZ1bmN0aW9uIHRhc2tOYW1lcygpIHtcbiAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQubmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcbiAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBmbiA9IF9yZWYuZm4sXG4gICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG4gIHZhciByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBlcnJvciA9IHZvaWQgMDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IgPSBlcnI7XG4gIH1cblxuICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3JcbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG4gIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG4gIHJldHVybiBlcnJvciA/ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGMgPSB2b2lkIDA7XG4gICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcbiAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICBpZiAoIXBjKSB7XG4gICAgICAgIHBjID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXQoYXJnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KCkpO1xufVxuXG52YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG4gIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcbn07XG5cbmZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcbiAgdmFyIHN1YnNjcmliZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfTtcbiAgdmFyIGRpc3BhdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBfdXRpbHMubm9vcDtcbiAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcbiAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDoge307XG4gIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuICB2YXIgY29udCA9IGFyZ3VtZW50c1s4XTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXG4gIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG4gIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cbiAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblxuICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG4gIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKGVycikge1xuICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblxuICAgIGlmICghbWVzc2FnZSAmJiBlcnIuc3RhY2spIHtcbiAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuICB9O1xuICB2YXIgc3RkQ2hhbm5lbCA9ICgwLCBfY2hhbm5lbC5zdGRDaGFubmVsKShzdWJzY3JpYmUpO1xuICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuICAvKipcbiAgICBUcmFja3MgdGhlIGN1cnJlbnQgZWZmZWN0IGNhbmNlbGxhdGlvblxuICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG4gICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuICAqKi9cbiAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAvKipcbiAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG4gICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG4gICoqL1xuICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcbiAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuICB2YXIgdGFza1F1ZXVlID0gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBlbmQpO1xuXG4gIC8qKlxuICAgIGNhbmNlbGxhdGlvbiBvZiB0aGUgbWFpbiB0YXNrLiBXZSdsbCBzaW1wbHkgcmVzdW1lIHRoZSBHZW5lcmF0b3Igd2l0aCBhIENhbmNlbFxuICAqKi9cbiAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcbiAgICBpZiAobWFpblRhc2suaXNSdW5uaW5nICYmICFtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cbiAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgQ2FuY2VsbGF0aW9uIHByb3BhZ2F0ZXMgZG93biB0byB0aGUgd2hvbGUgZXhlY3V0aW9uIHRyZWUgaG9sZGVkIGJ5IHRoaXMgUGFyZW50IHRhc2tcbiAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcbiAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgLyoqXG4gICAgICBXZSBuZWVkIHRvIGNoZWNrIGJvdGggUnVubmluZyBhbmQgQ2FuY2VsbGVkIHN0YXR1c1xuICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuICAgICoqL1xuICAgIGlmIChpdGVyYXRvci5faXNSdW5uaW5nICYmICFpdGVyYXRvci5faXNDYW5jZWxsZWQpIHtcbiAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG4gICAgICAvKipcbiAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuICAgICAgKiovXG4gICAgICBlbmQoVEFTS19DQU5DRUwpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG4gICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cbiAgKiovXG4gIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblxuICAvLyB0cmFja3MgdGhlIHJ1bm5pbmcgc3RhdHVzXG4gIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXG4gIC8vIGtpY2tzIHVwIHRoZSBnZW5lcmF0b3JcbiAgbmV4dCgpO1xuXG4gIC8vIHRoZW4gcmV0dXJuIHRoZSB0YXNrIGRlc2NyaXB0b3IgdG8gdGhlIGNhbGxlclxuICByZXR1cm4gdGFzaztcblxuICAvKipcbiAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG4gICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG4gICAgdW50aWwgdGhlIGdlbmVyYXRvciB0ZXJtaW5hdGVzIG9yIHRocm93c1xuICAqKi9cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG4gICAgLy8gUHJldmVudGl2ZSBtZWFzdXJlLiBJZiB3ZSBlbmQgdXAgaGVyZSwgdGhlbiB0aGVyZSBpcyByZWFsbHkgc29tZXRoaW5nIHdyb25nXG4gICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuICAgICAgICAgIFdlIGNhbiBnZXQgdGhpcyB2YWx1ZSBoZXJlXG4gICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcbiAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICBDYW5jZWxzIHRoZSBjdXJyZW50IGVmZmVjdDsgdGhpcyB3aWxsIHByb3BhZ2F0ZSB0aGUgY2FuY2VsbGF0aW9uIGRvd24gdG8gYW55IGNhbGxlZCB0YXNrc1xuICAgICAgICAqKi9cbiAgICAgICAgbmV4dC5jYW5jZWwoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICoqL1xuICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcbiAgICAgICAgLy8gV2UgZ2V0IENIQU5ORUxfRU5EIGJ5IHRha2luZyBmcm9tIGEgY2hhbm5lbCB0aGF0IGVuZGVkIHVzaW5nIGB0YWtlYCAoYW5kIG5vdCBgdGFrZW1gIHVzZWQgdG8gdHJhcCBFbmQgb2YgY2hhbm5lbHMpXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dChhcmcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcbiAgICAgICAgKiovXG4gICAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG4gICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmQocmVzdWx0LCBpc0Vycikge1xuICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG4gICAgaWYgKCFpc0Vycikge1xuICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcbiAgICAgICAgICB2YWx1ZTogJ2F0ICcgKyBuYW1lICsgJyBcXG4gJyArIChyZXN1bHQuc2FnYVN0YWNrIHx8IHJlc3VsdC5zdGFjayksXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2lzQWJvcnRlZCA9IHRydWU7XG4gICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuICAgIH1cbiAgICB0YXNrLmNvbnQgJiYgdGFzay5jb250KHJlc3VsdCwgaXNFcnIpO1xuICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcbiAgICB9KTtcbiAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcbiAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuICAgIHZhciBjYiA9IGFyZ3VtZW50c1szXTtcblxuICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcGFyZW50RWZmZWN0SWQ6IHBhcmVudEVmZmVjdElkLCBsYWJlbDogbGFiZWwsIGVmZmVjdDogZWZmZWN0IH0pO1xuXG4gICAgLyoqXG4gICAgICBjb21wbGV0aW9uIGNhbGxiYWNrIGFuZCBjYW5jZWwgY2FsbGJhY2sgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG4gICAgKiovXG4gICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cbiAgICAvLyBDb21wbGV0aW9uIGNhbGxiYWNrIHBhc3NlZCB0byB0aGUgYXBwcm9wcmlhdGUgZWZmZWN0IHJ1bm5lclxuICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG4gICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG4gICAgICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAgICAgaXNFcnIgPyBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZChlZmZlY3RJZCwgcmVzKSA6IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCByZXMpO1xuICAgICAgfVxuICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgfVxuICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcHJldmVudHMgY2FuY2VsbGluZyBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3RcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICAvKipcbiAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcbiAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuICAgICAgICBjYWxsYmFjaywgbG9nIGVycm9ycyByYWlzZWQgZHVyaW5nIGNhbmNlbGxhdGlvbnMgaW50byB0aGUgY29uc29sZVxuICAgICAgKiovXG4gICAgICB0cnkge1xuICAgICAgICBjdXJyQ2IuY2FuY2VsKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblxuICAgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkKGVmZmVjdElkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cbiAgICAgICBBVFRFTlRJT04hIGVmZmVjdCBydW5uZXJzIG11c3Qgc2V0dXAgdGhlIGNhbmNlbCBsb2dpYyBieSBzZXR0aW5nIGNiLmNhbmNlbCA9IFtjYW5jZWxNZXRob2RdXG4gICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG4gICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG4gICAgICBmb3IgY29tcGxldGluZyB0aGUgZmxvdyBieSBjYWxsaW5nIHRoZSBwcm92aWRlZCBjb250aW51YXRpb247IHdoaWxlIGNhbGxlciBmdW5jdGlvbnNcbiAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cbiAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG4gICAgICBwcm9taXNlW0NBTkNFTF0gbWV0aG9kIGluIHRoZWlyIHJldHVybmVkIHByb21pc2VzXG4gICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuICAgICoqL1xuICAgIHZhciBkYXRhID0gdm9pZCAwO1xuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiAoXG4gICAgICAvLyBOb24gZGVjbGFyYXRpdmUgZWZmZWN0XG4gICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXG4gICAgICAvLyBkZWNsYXJhdGl2ZSBlZmZlY3RzXG4gICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuICAgIHZhciBjYW5jZWxQcm9taXNlID0gcHJvbWlzZVtfdXRpbHMuQ0FOQ0VMXTtcbiAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcbiAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG4gICAgfSBlbHNlIGlmIChfdXRpbHMuaXMuZnVuYyhwcm9taXNlLmFib3J0KSkge1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cbiAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuICAgIH1cbiAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJdGVyYXRvcihpdGVyYXRvciwgZWZmZWN0SWQsIG5hbWUsIGNiKSB7XG4gICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG4gICAgICAgIHBhdHRlcm4gPSBfcmVmMi5wYXR0ZXJuLFxuICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXG4gICAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgc3RkQ2hhbm5lbDtcbiAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG4gICAgfVxuICAgIGNiLmNhbmNlbCA9IHRha2VDYi5jYW5jZWw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5QdXRFZmZlY3QoX3JlZjMsIGNiKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlO1xuXG4gICAgLyoqXG4gICAgICBTY2hlZHVsZSB0aGUgcHV0IGluIGNhc2UgYW5vdGhlciBzYWdhIGlzIGhvbGRpbmcgYSBsb2NrLlxuICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG4gICAgKiovXG4gICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBjaGFubmVsIG9yIGBwdXQucmVzb2x2ZWAgd2FzIHVzZWQgdGhlbiBidWJibGUgdXAgdGhlIGVycm9yLlxuICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNC5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY0LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblxuICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY1LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjUuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXG4gICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG4gICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgdmFyIGNwc0NiID0gZnVuY3Rpb24gY3BzQ2IoZXJyLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG4gICAgICB9O1xuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoY3BzQ2IpKTtcbiAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcbiAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjcHNDYi5jYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY2LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjYuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuICAgICAgICBkZXRhY2hlZCA9IF9yZWY2LmRldGFjaGVkO1xuXG4gICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblxuICAgIHRyeSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuICAgICAgdmFyIF90YXNrID0gcHJvYyh0YXNrSXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIGZuLm5hbWUsIGRldGFjaGVkID8gbnVsbCA6IF91dGlscy5ub29wKTtcblxuICAgICAgaWYgKGRldGFjaGVkKSB7XG4gICAgICAgIGNiKF90YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hZGRUYXNrKF90YXNrKTtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hYm9ydCh0YXNrSXRlcmF0b3IuX2Vycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgKDAsIF9zY2hlZHVsZXIuZmx1c2gpKCk7XG4gICAgfVxuICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuICAgIGlmICh0LmlzUnVubmluZygpKSB7XG4gICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0LmpvaW5lcnMsIGpvaW5lcik7XG4gICAgICB9O1xuICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuICAgIGlmICh0YXNrVG9DYW5jZWwgPT09IF91dGlscy5TRUxGX0NBTkNFTExBVElPTikge1xuICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcbiAgICB9XG4gICAgaWYgKHRhc2tUb0NhbmNlbC5pc1J1bm5pbmcoKSkge1xuICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuICAgIH1cbiAgICBjYigpO1xuICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblxuICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgaXNFcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcbiAgICAgICAgICBjb21wbGV0ZWRDb3VudCsrO1xuICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG4gICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuICAgIH0pO1xuXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Vycikge1xuICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjYihyZXMsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgdmFyIF9yZXNwb25zZTtcblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gKF9yZXNwb25zZSA9IHt9LCBfcmVzcG9uc2Vba2V5XSA9IHJlcywgX3Jlc3BvbnNlKTtcbiAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyB1bm5lY2Vzc2FyeSBjYW5jZWxsYXRpb25cbiAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG4gICAgICAgIGFyZ3MgPSBfcmVmNy5hcmdzO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdGF0ZSA9IHNlbGVjdG9yLmFwcGx5KHVuZGVmaW5lZCwgW2dldFN0YXRlKCldLmNvbmNhdChhcmdzKSk7XG4gICAgICBjYihzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcbiAgICAgICAgYnVmZmVyID0gX3JlZjguYnVmZmVyO1xuXG4gICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcbiAgICBtYXRjaC5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcbiAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG4gICAgY2hhbm5lbC5mbHVzaChjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5HZXRDb250ZXh0RWZmZWN0KHByb3AsIGNiKSB7XG4gICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcbiAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIGNiKCk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdUYXNrKGlkLCBuYW1lLCBpdGVyYXRvciwgY29udCkge1xuICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXG4gICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gbnVsbDtcbiAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuICAgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBkZWY7XG4gICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9LCBfcmVmOS5jb250ID0gY29udCwgX3JlZjkuam9pbmVycyA9IFtdLCBfcmVmOS5jYW5jZWwgPSBjYW5jZWwsIF9yZWY5LmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQ2FuY2VsbGVkO1xuICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuICAgIH0sIF9yZWY5LnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2Vycm9yO1xuICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG4gICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuICAgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcbiAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcHJvYy5qc1xuLy8gbW9kdWxlIGlkID0gNzQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc2FwID0gYXNhcDtcbmV4cG9ydHMuc3VzcGVuZCA9IHN1c3BlbmQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG52YXIgcXVldWUgPSBbXTtcbi8qKlxuICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG4gIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3RcbiAgICBhbHJlYWR5IHN1c3BlbmRlZClcbiAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcbiAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuKiovXG52YXIgc2VtYXBob3JlID0gMDtcblxuLyoqXG4gIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcbiAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG4gIHN0YXRlKS5cbioqL1xuZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG4gIHRyeSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIHRhc2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gIEV4ZWN1dGVzIG9yIHF1ZXVlcyBhIHRhc2sgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiB0aGUgc2NoZWR1bGVyIChgc3VzcGVuZGVkYCBvciBgcmVsZWFzZWRgKVxuKiovXG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgcXVldWUucHVzaCh0YXNrKTtcblxuICBpZiAoIXNlbWFwaG9yZSkge1xuICAgIHN1c3BlbmQoKTtcbiAgICBmbHVzaCgpO1xuICB9XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZS4gU2NoZWR1bGVkIHRhc2tzIHdpbGwgYmUgcXVldWVkIHVudGlsIHRoZVxuICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG4qKi9cbmZ1bmN0aW9uIHN1c3BlbmQoKSB7XG4gIHNlbWFwaG9yZSsrO1xufVxuXG4vKipcbiAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cbioqL1xuZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgc2VtYXBob3JlLS07XG59XG5cbi8qKlxuICBSZWxlYXNlcyB0aGUgY3VycmVudCBsb2NrLiBFeGVjdXRlcyBhbGwgcXVldWVkIHRhc2tzIGlmIHRoZSBzY2hlZHVsZXIgaXMgaW4gdGhlIHJlbGVhc2VkIHN0YXRlLlxuKiovXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgcmVsZWFzZSgpO1xuXG4gIHZhciB0YXNrID0gdm9pZCAwO1xuICB3aGlsZSAoIXNlbWFwaG9yZSAmJiAodGFzayA9IHF1ZXVlLnNoaWZ0KCkpICE9PSB1bmRlZmluZWQpIHtcbiAgICBleGVjKHRhc2spO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NjaGVkdWxlci5qc1xuLy8gbW9kdWxlIGlkID0gNzQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5leHBvcnRzLnRha2UgPSB0YWtlO1xuZXhwb3J0cy5wdXQgPSBwdXQ7XG5leHBvcnRzLmFsbCA9IGFsbDtcbmV4cG9ydHMucmFjZSA9IHJhY2U7XG5leHBvcnRzLmNhbGwgPSBjYWxsO1xuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuZXhwb3J0cy5jcHMgPSBjcHM7XG5leHBvcnRzLmZvcmsgPSBmb3JrO1xuZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuZXhwb3J0cy5qb2luID0gam9pbjtcbmV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5leHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuZXhwb3J0cy5jYW5jZWxsZWQgPSBjYW5jZWxsZWQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG5leHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuZXhwb3J0cy5zZXRDb250ZXh0ID0gc2V0Q29udGV4dDtcbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zYWdhSGVscGVycycpO1xuXG52YXIgSU8gPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5zeW0pKCdJTycpO1xudmFyIFRBS0UgPSAnVEFLRSc7XG52YXIgUFVUID0gJ1BVVCc7XG52YXIgQUxMID0gJ0FMTCc7XG52YXIgUkFDRSA9ICdSQUNFJztcbnZhciBDQUxMID0gJ0NBTEwnO1xudmFyIENQUyA9ICdDUFMnO1xudmFyIEZPUksgPSAnRk9SSyc7XG52YXIgSk9JTiA9ICdKT0lOJztcbnZhciBDQU5DRUwgPSAnQ0FOQ0VMJztcbnZhciBTRUxFQ1QgPSAnU0VMRUNUJztcbnZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG52YXIgQ0FOQ0VMTEVEID0gJ0NBTkNFTExFRCc7XG52YXIgRkxVU0ggPSAnRkxVU0gnO1xudmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcbnZhciBTRVRfQ09OVEVYVCA9ICdTRVRfQ09OVEVYVCc7XG5cbnZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cbnZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xufTtcblxudmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG4gIGVmZltGT1JLXS5kZXRhY2hlZCA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5mdW5jdGlvbiB0YWtlKCkge1xuICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICB9XG4gIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG59XG5cbnRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbnZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cbmZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCBhIHZhbGlkIGNoYW5uZWwnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgICBhY3Rpb24gPSBjaGFubmVsO1xuICAgIGNoYW5uZWwgPSBudWxsO1xuICB9XG4gIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xufVxuXG5wdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIGVmZltQVVRdLnJlc29sdmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxucHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblxuZnVuY3Rpb24gYWxsKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuICBpZiAoX3V0aWxzLmlzLmFycmF5KGZuKSkge1xuICAgIHZhciBfZm4gPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuWzBdO1xuICAgIGZuID0gX2ZuWzFdO1xuICB9IGVsc2UgaWYgKGZuLmZuKSB7XG4gICAgdmFyIF9mbjIgPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuMi5jb250ZXh0O1xuICAgIGZuID0gX2ZuMi5mbjtcbiAgfVxuICBpZiAoY29udGV4dCAmJiBfdXRpbHMuaXMuc3RyaW5nKGZuKSAmJiBfdXRpbHMuaXMuZnVuYyhjb250ZXh0W2ZuXSkpIHtcbiAgICBmbiA9IGNvbnRleHRbZm5dO1xuICB9XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblxuICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcbn1cblxuZnVuY3Rpb24gY2FsbChmbikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBjcHMoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gZm9yayhmbikge1xuICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHNwYXduKGZuKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcbn1cblxuZnVuY3Rpb24gam9pbigpIHtcbiAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgdGFza3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgfVxuXG4gIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBqb2luKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdqb2luKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcbiAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGNhbmNlbCh0KTtcbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRhc2sgPSB0YXNrc1swXTtcbiAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNyA+IDEgPyBfbGVuNyAtIDEgOiAwKSwgX2tleTcgPSAxOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG59XG5cbi8qKlxuICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcbioqL1xuZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG59XG5cbmZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdmbHVzaChjaGFubmVsKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsJyk7XG4gIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIGVmZmVjdChHRVRfQ09OVEVYVCwgcHJvcCk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG4gIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcbn1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDIgPyBfbGVuOCAtIDIgOiAwKSwgX2tleTggPSAyOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuICAgIGFyZ3NbX2tleTkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5OV07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUxhdGVzdEhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShtcywgcGF0dGVybiwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG52YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuICB9O1xufTtcblxudmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcbiAgdGFrZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShUQUtFKSxcbiAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG4gIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuICByYWNlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFJBQ0UpLFxuICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcbiAgZm9yazogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGT1JLKSxcbiAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcbiAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG4gIHNlbGVjdDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRUxFQ1QpLFxuICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcbiAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG4gIGZsdXNoOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZMVVNIKSxcbiAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG4gIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9pby5qc1xuLy8gbW9kdWxlIGlkID0gNzQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IHVuZGVmaW5lZDtcblxudmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90YWtlRXZlcnknKTtcblxudmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cbnZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VMYXRlc3QnKTtcblxudmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblxudmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcbiAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG59O1xuXG52YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG52YXIgdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VMYXRlc3QyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VMYXRlc3QnKSk7XG52YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcbmV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gX3Rha2VFdmVyeTIuZGVmYXVsdDtcbmV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG4gICAgfVxuICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qc1xuLy8gbW9kdWxlIGlkID0gNzQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucUVuZCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG52YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXG5mdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiAnY2hhbm5lbCc7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGVudHJ5KTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXG4gIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcbiAgICAgIHFOZXh0ID0gcTA7XG5cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG4gICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG4gICAgICByZXR1cm4gZG9uZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHFOZXh0ID0gcUVuZDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXG4gICAgICB2YXIgX2ZzbSRxTmV4dCA9IGZzbVtxTmV4dF0oKSxcbiAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcbiAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuICAgICAgICAgIF91cGRhdGVTdGF0ZSA9IF9mc20kcU5leHRbMl07XG5cbiAgICAgIHFOZXh0ID0gcTtcbiAgICAgIHVwZGF0ZVN0YXRlID0gX3VwZGF0ZVN0YXRlO1xuICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBuZXh0KG51bGwsIGVycm9yKTtcbiAgfSwgbmFtZSwgdHJ1ZSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5pc0VuZCA9IGV4cG9ydHMuRU5EID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcbmV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXZlbnRDaGFubmVsO1xuZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxudmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIENIQU5ORUxfRU5EX1RZUEUgPSAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbnZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xudmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcbiAgcmV0dXJuIGEgJiYgYS50eXBlID09PSBDSEFOTkVMX0VORF9UWVBFO1xufTtcblxuZnVuY3Rpb24gZW1pdHRlcigpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKHN1Yikge1xuICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKShzdWJzY3JpYmVycywgc3ViKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG4gICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJyW2ldKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgZW1pdDogZW1pdFxuICB9O1xufVxuXG52YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xudmFyIFVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gJ1NhZ2Egd2FzIHByb3ZpZGVkIHdpdGggYW4gdW5kZWZpbmVkIGFjdGlvbic7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gVU5ERUZJTkVEX0lOUFVUX0VSUk9SICs9ICdcXG5IaW50czpcXG4gICAgLSBjaGVjayB0aGF0IHlvdXIgQWN0aW9uIENyZWF0b3IgcmV0dXJucyBhIG5vbi11bmRlZmluZWQgdmFsdWVcXG4gICAgLSBpZiB0aGUgU2FnYSB3YXMgc3RhcnRlZCB1c2luZyBydW5TYWdhLCBjaGVjayB0aGF0IHlvdXIgc3Vic2NyaWJlIHNvdXJjZSBwcm92aWRlcyB0aGUgYWN0aW9uIHRvIGl0cyBsaXN0ZW5lcnNcXG4gICc7XG59XG5cbmZ1bmN0aW9uIGNoYW5uZWwoKSB7XG4gIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblxuICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gIHZhciB0YWtlcnMgPSBbXTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsIElOVkFMSURfQlVGRkVSKTtcblxuICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcbiAgICBpZiAoY2xvc2VkICYmIHRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcbiAgICB9XG4gICAgaWYgKHRha2Vycy5sZW5ndGggJiYgIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBidWZmZXIucHV0KGlucHV0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjYiA9IHRha2Vyc1tpXTtcbiAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRha2UoY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoYnVmZmVyLnRha2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRha2Vycy5wdXNoKGNiKTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihFTkQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYihidWZmZXIuZmx1c2goKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgIGlmICghY2xvc2VkKSB7XG4gICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IHRha2VycztcbiAgICAgICAgdGFrZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBhcnJbaV0oRU5EKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFrZTogdGFrZSxcbiAgICBwdXQ6IHB1dCxcbiAgICBmbHVzaDogZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGdldCBfX3Rha2Vyc19fKCkge1xuICAgICAgcmV0dXJuIHRha2VycztcbiAgICB9LFxuICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuICAgICAgcmV0dXJuIGNsb3NlZDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX2J1ZmZlcnMuYnVmZmVycy5ub25lKCk7XG4gIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXG4gIC8qKlxuICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuICAqKi9cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcbiAgfVxuXG4gIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBjaGFuLmNsb3NlKCk7XG4gICAgfVxuICB9O1xuICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlzRW5kKGlucHV0KSkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW4ucHV0KGlucHV0KTtcbiAgfSk7XG4gIGlmIChjaGFuLl9fY2xvc2VkX18pIHtcbiAgICB1bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiBjaGFuLnRha2UsXG4gICAgZmx1c2g6IGNoYW4uZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0ZENoYW5uZWwoc3Vic2NyaWJlKSB7XG4gIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoaW5wdXRbX3V0aWxzLlNBR0FfQUNUSU9OXSkge1xuICAgICAgICBjYihpbnB1dCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcbiAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuICAgICAgfVxuICAgICAgY2hhbi50YWtlKGNiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9jaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKFwiLi91dGlsc1wiKTtcblxudmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXG52YXIgT05fT1ZFUkZMT1dfVEhST1cgPSAxO1xudmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xudmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcbnZhciBPTl9PVkVSRkxPV19FWFBBTkQgPSA0O1xuXG52YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXG5mdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuICB2YXIgb3ZlcmZsb3dBY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG4gIHZhciBsZW5ndGggPSAwO1xuICB2YXIgcHVzaEluZGV4ID0gMDtcbiAgdmFyIHBvcEluZGV4ID0gMDtcblxuICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcbiAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgIGxlbmd0aCsrO1xuICB9O1xuXG4gIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcbiAgICBpZiAobGVuZ3RoICE9IDApIHtcbiAgICAgIHZhciBpdCA9IGFycltwb3BJbmRleF07XG4gICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcbiAgICAgIGxlbmd0aC0tO1xuICAgICAgcG9wSW5kZXggPSAocG9wSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtcztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoID09IDA7XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuICAgICAgaWYgKGxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgIHB1c2goaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRvdWJsZWRMaW1pdCA9IHZvaWQgMDtcbiAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX09WRVJGTE9XKTtcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX0VYUEFORDpcbiAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblxuICAgICAgICAgICAgYXJyID0gZmx1c2goKTtcblxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGFyci5sZW5ndGggPSBkb3VibGVkTGltaXQ7XG4gICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblxuICAgICAgICAgICAgcHVzaChpdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIERST1BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGFrZTogdGFrZSxcbiAgICBmbHVzaDogZmx1c2hcbiAgfTtcbn1cblxudmFyIGJ1ZmZlcnMgPSBleHBvcnRzLmJ1ZmZlcnMgPSB7XG4gIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG4gICAgcmV0dXJuIHplcm9CdWZmZXI7XG4gIH0sXG4gIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG4gIH0sXG4gIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcbiAgfSxcbiAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG4gIH0sXG4gIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlTGF0ZXN0O1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG4gIH07XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDAsXG4gICAgICBhY3Rpb24gPSB2b2lkIDA7XG4gIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG4gICAgcmV0dXJuIHRhc2sgPSB0O1xuICB9O1xuICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlTGF0ZXN0KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VMYXRlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vYnVmZmVycycpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRocm90dGxlKGRlbGF5TGVuZ3RoLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgY2hhbm5lbCA9IHZvaWQgMDtcblxuICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG4gIHZhciB5VGFrZSA9IGZ1bmN0aW9uIHlUYWtlKCkge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuICB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5RGVsYXkgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYWxsKShfdXRpbHMuZGVsYXksIGRlbGF5TGVuZ3RoKSB9O1xuXG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG4gIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaGFubmVsID0gY2g7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG4gICAgfSxcbiAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG4gICAgfVxuICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBzYWdhTWlkZGxld2FyZUZhY3Rvcnk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3J1blNhZ2EnKTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgY29udGV4dCA9IF9yZWYkY29udGV4dCA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNvbnRleHQsXG4gICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG5cbiAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBhIGZ1bmN0aW9uIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUuIFlvdSBhcmUgbGlrZWx5IHRyeWluZyB0byBzdGFydCBhICAgICAgICBTYWdhIGJ5IGRpcmVjdGx5IHBhc3NpbmcgaXQgdG8gdGhlIG1pZGRsZXdhcmUuIFRoaXMgaXMgbm8gbG9uZ2VyIHBvc3NpYmxlIHN0YXJ0aW5nIGZyb20gMC4xMC4wLiAgICAgICAgVG8gcnVuIGEgU2FnYSwgeW91IG11c3QgZG8gaXQgZHluYW1pY2FsbHkgQUZURVIgbW91bnRpbmcgdGhlIG1pZGRsZXdhcmUgaW50byB0aGUgc3RvcmUuXFxuICAgICAgICBFeGFtcGxlOlxcbiAgICAgICAgICBpbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcXCdyZWR1eC1zYWdhXFwnXFxuICAgICAgICAgIC4uLiBvdGhlciBpbXBvcnRzXFxuXFxuICAgICAgICAgIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKVxcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpXFxuICAgICAgICAgIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhLCAuLi5hcmdzKVxcbiAgICAgICcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbmVycm9yYCB3YXMgcmVtb3ZlZC4gVXNlIGBvcHRpb25zLm9uRXJyb3JgIGluc3RlYWQuJyk7XG4gIH1cblxuICBpZiAob25FcnJvciAmJiAhX3V0aWxzLmlzLmZ1bmMob25FcnJvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYyLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXG4gICAgdmFyIHNhZ2FFbWl0dGVyID0gKDAsIF9jaGFubmVsLmVtaXR0ZXIpKCk7XG4gICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblxuICAgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IF9ydW5TYWdhLnJ1blNhZ2EuYmluZChudWxsLCB7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG4gICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXI6IGxvZ2dlcixcbiAgICAgIG9uRXJyb3I6IG9uRXJyb3JcbiAgICB9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgaWYgKHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQpIHtcbiAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IG5leHQoYWN0aW9uKTsgLy8gaGl0IHJlZHVjZXJzXG4gICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG4gIH07XG5cbiAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgnc2FnYU1pZGRsZXdhcmUnLCBwcm9wcykpO1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcbiAgfTtcblxuICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL21pZGRsZXdhcmUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VtO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnB1dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnJhY2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hcHBseTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jcHM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZvcms7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zcGF3bjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uam9pbjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYW5jZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc2VsZWN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZsdXNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3V0aWxzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVEFTSycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5UQVNLO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU0FHQV9BQ1RJT04nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuU0FHQV9BQ1RJT047XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdub29wJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5pcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlZmVycmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlZmVycmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXJyYXlPZkRlZmZlcmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmFycmF5T2ZEZWZmZXJlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZU1vY2tUYXNrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNyZWF0ZU1vY2tUYXNrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2xvbmVhYmxlR2VuZXJhdG9yJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNsb25lYWJsZUdlbmVyYXRvcjtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FzRWZmZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFzRWZmZWN0O1xuICB9XG59KTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvcHJvYycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29tcG9zZSA9IHJlcXVpcmUoJ3JlZHV4JykuY29tcG9zZTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY29tcG9zZVdpdGhEZXZUb29scyA9IChcbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA/XG4gICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA6XG4gICAgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JykgcmV0dXJuIGNvbXBvc2U7XG4gICAgICByZXR1cm4gY29tcG9zZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbik7XG5cbmV4cG9ydHMuZGV2VG9vbHNFbmhhbmNlciA9IChcbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gP1xuICAgIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fIDpcbiAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGZ1bmN0aW9uKG5vb3ApIHsgcmV0dXJuIG5vb3A7IH0gfVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1kZXZ0b29scy1leHRlbnNpb24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4vY29uc3RcIjtcbmltcG9ydCBwdWxsIGZyb20gXCJsb2Rhc2gvcHVsbFwiO1xuaW1wb3J0IHsgaW5BcnJheSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIGluaXRpYWwgc3RhdGVcbmxldCBpbml0aWFsU3RhdGUgPSB7XG4gICAgc2VsZWN0QWxsOiB0cnVlLFxuICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICBlcnJvcjogbnVsbCxcbiAgICB1c2VySWQ6IG51bGwsXG4gICAgaXNfcmVzdHJpY3RlZDogZmFsc2UsXG4gICAgYWxsX3Byb2plY3RzOiBbXSxcbiAgICB1c2VyX3Byb2plY3RzOiBbXSxcbiAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgIG9yaWdpbmFsX3Byb2plY3RzOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGMuU0VUX1NUT1JFOiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgLi4uZGF0YSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfSU5JVDoge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMucHJvamVjdHMpIHx8IFtdLFxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCkgfHwgZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX0dFVF9GQUlMVVJFOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX1BVVF9JTklUOiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9QVVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyB1c2VyX3Byb2plY3RzIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMucHJvamVjdHMsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfcHJvamVjdHM6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuQVBJX1BVVF9GQUlMVVJFOiB7XG4gICAgICAgICAgICBjb25zdCBuZXdfc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfcHJvamVjdHM6IG51bGwsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIE92ZXJ3cml0ZSBpZiB3ZSBoYXZlIGFuIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld19zdGF0ZS5pc19yZXN0cmljdGVkID0gc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF9wcm9qZWN0cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld19zdGF0ZS51c2VyX3Byb2plY3RzID0gc3RhdGUub3JpZ2luYWxfcHJvamVjdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3X3N0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTjoge1xuICAgICAgICAgICAgY29uc3QgeyBwcm9qZWN0SWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFsuLi5zdGF0ZS51c2VyX3Byb2plY3RzXTtcblxuICAgICAgICAgICAgaW5BcnJheShwcm9qZWN0SWQsIHVzZXJfcHJvamVjdHMpXG4gICAgICAgICAgICAgICAgPyBwdWxsKHVzZXJfcHJvamVjdHMsIHByb2plY3RJZClcbiAgICAgICAgICAgICAgICA6IHVzZXJfcHJvamVjdHMucHVzaChwcm9qZWN0SWQpO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG9yaWdpbmFsX3Byb2plY3RzLCB1c2VyX3Byb2plY3RzIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuVVBEQVRFX0lTX1JFU1RSSUNURUQ6IHtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNfcmVzdHJpY3RlZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaXNfcmVzdHJpY3RlZCwgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogc3RhdGUuaXNfcmVzdHJpY3RlZCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTOiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuICAgICAgICAgICAgbGV0IHVzZXJfcHJvamVjdHMsXG4gICAgICAgICAgICAgICAgeyBzZWxlY3RBbGwgfSA9IHsgLi4uc3RhdGUgfTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RBbGwpIHtcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gc3RhdGUuYWxsX3Byb2plY3RzLm1hcChwcm9qZWN0ID0+IHByb2plY3QuaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxlY3RBbGwgPSAhc2VsZWN0QWxsO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlbGVjdEFsbCwgb3JpZ2luYWxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ2YXIgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIHB1bGxBbGwgPSByZXF1aXJlKCcuL3B1bGxBbGwnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBnaXZlbiB2YWx1ZXMgZnJvbSBgYXJyYXlgIHVzaW5nXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8ud2l0aG91dGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC4gVXNlIGBfLnJlbW92ZWBcbiAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGwoYXJyYXksICdhJywgJ2MnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xudmFyIHB1bGwgPSBiYXNlUmVzdChwdWxsQWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fb3ZlclJlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hcHBseS5qc1xuLy8gbW9kdWxlIGlkID0gNzU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19zZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9jb25zdGFudC5qc1xuLy8gbW9kdWxlIGlkID0gNzYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3Nob3J0T3V0LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VQdWxsQWxsID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBbGwnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnYScsICdiJywgJ2MnXTtcbiAqXG4gKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG5mdW5jdGlvbiBwdWxsQWxsKGFycmF5LCB2YWx1ZXMpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG4gICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvcHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpLFxuICAgIGJhc2VJbmRleE9mV2l0aCA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mV2l0aCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHVsbEFsbEJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBzZWVuID0gYXJyYXk7XG5cbiAgaWYgKGFycmF5ID09PSB2YWx1ZXMpIHtcbiAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcbiAgfVxuICBpZiAoaXRlcmF0ZWUpIHtcbiAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGZyb21JbmRleCA9IDAsXG4gICAgICAgIHZhbHVlID0gdmFsdWVzW2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgd2hpbGUgKChmcm9tSW5kZXggPSBpbmRleE9mKHNlZW4sIGNvbXB1dGVkLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpKSA+IC0xKSB7XG4gICAgICBpZiAoc2VlbiAhPT0gYXJyYXkpIHtcbiAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBmcm9tSW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUHVsbEFsbC5qc1xuLy8gbW9kdWxlIGlkID0gNzY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Njdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNOYU4uanNcbi8vIG1vZHVsZSBpZCA9IDc2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanNcbi8vIG1vZHVsZSBpZCA9IDc2OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYmFzZUluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mV2l0aChhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mV2l0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qc1xuLy8gbW9kdWxlIGlkID0gNzcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0IHsgdGFrZUxhdGVzdCwgY2FsbCwgcHV0LCBzZWxlY3QgfSBmcm9tIFwicmVkdXgtc2FnYS9lZmZlY3RzXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4vY29uc3RcIjtcbmltcG9ydCB7IGdldENvb2tpZSB9IGZyb20gXCIuLi9teS1yZXN1bHRzL3V0aWxzXCI7XG5cbmZ1bmN0aW9uIGZldGNoRGF0YSh1c2VySWQpIHtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKSB7XG4gICAgcmV0dXJuIGF4aW9zKHtcbiAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIlgtQ1NSRlRva2VuXCI6IGdldENvb2tpZShcImNzcmZ0b2tlblwiKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcl9wcm9qZWN0czoge1xuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgcHJvamVjdHM6IHVzZXJfcHJvamVjdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiogZ2V0U2FnYShhY3Rpb24pIHtcbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCBjYWxsKGZldGNoRGF0YSwgdXNlcklkKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9TVUNDRVNTLCBkYXRhIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX0dFVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbmNvbnN0IGdldFVzZXJJZCA9IHN0YXRlID0+IHN0YXRlLnVzZXJJZDtcbmNvbnN0IGdldFVzZXJQcm9qZWN0cyA9IHN0YXRlID0+IHN0YXRlLnVzZXJfcHJvamVjdHM7XG5jb25zdCBnZXRJc1Jlc3RyaWN0ZWQgPSBzdGF0ZSA9PiBzdGF0ZS5pc19yZXN0cmljdGVkO1xuXG5mdW5jdGlvbiogcHV0U2FnYShhY3Rpb24pIHtcbiAgICB0cnkge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcbiAgICAgICAgY29uc3QgdXNlcklkID0geWllbGQgc2VsZWN0KGdldFVzZXJJZCk7XG4gICAgICAgIGNvbnN0IGlzX3Jlc3RyaWN0ZWQgPSB5aWVsZCBzZWxlY3QoZ2V0SXNSZXN0cmljdGVkKTtcbiAgICAgICAgY29uc3QgdXNlcl9wcm9qZWN0cyA9IHlpZWxkIHNlbGVjdChnZXRVc2VyUHJvamVjdHMpO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGNhbGwocHV0RGF0YSwgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvciB9KTtcbiAgICB9XG59XG5cbi8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5leHBvcnQgZnVuY3Rpb24qIHdhdGNoZXJTYWdhKCkge1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5BUElfR0VUX0lOSVQsIGdldFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9JU19SRVNUUklDVEVELCBwdXRTYWdhKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzczXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2F4aW9zLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qc1xuLy8gbW9kdWxlIGlkID0gNzc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2lzLWJ1ZmZlci9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzc3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcbiAgICAgIHVybDogYXJndW1lbnRzWzBdXG4gICAgfSwgYXJndW1lbnRzWzFdKTtcbiAgfVxuXG4gIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvZGVmYXVsdHMuanNcbi8vIG1vZHVsZSBpZCA9IDc3OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qc1xuLy8gbW9kdWxlIGlkID0gNzgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanNcbi8vIG1vZHVsZSBpZCA9IDc4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gNzgzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIHJldHVybiBlcnJvcjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzg1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanNcbi8vIG1vZHVsZSBpZCA9IDc4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qc1xuLy8gbW9kdWxlIGlkID0gNzg4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgfSxcblxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiB7XG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH0pKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qc1xuLy8gbW9kdWxlIGlkID0gNzg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3OTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDc5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qc1xuLy8gbW9kdWxlIGlkID0gNzk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qc1xuLy8gbW9kdWxlIGlkID0gNzk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qc1xuLy8gbW9kdWxlIGlkID0gNzk4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=