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
            }), _("restrict_access")));
        };
        var Project = function Project(_ref2) {
            var _ = _ref2._, project = _ref2.project, user_projects = _ref2.user_projects, is_restricted = _ref2.is_restricted, onChangeProjectSelected = _ref2.onChangeProjectSelected;
            var checked = user_projects && (0, _utils.inArray)(project.id, user_projects);
            return _react2.default.createElement("tr", {
                key: project.id,
                id: project.id,
                onClick: onChangeProjectSelected,
                className: checked ? "projectSelected" : undefined
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
            return _react2.default.createElement("div", {
                className: is_restricted ? undefined : "disabled"
            }, _react2.default.createElement("button", {
                onClick: onChangeProjectSelectAll,
                disabled: is_restricted ? false : true
            }, selectAll ? _("select_all") : _("deselect_all")));
        };
        var Projects = function Projects(_ref4) {
            var _ = _ref4._, all_projects = _ref4.all_projects, user_projects = _ref4.user_projects, is_restricted = _ref4.is_restricted, selectAll = _ref4.selectAll, onChangeIsRestricted = _ref4.onChangeIsRestricted, onChangeProjectSelectAll = _ref4.onChangeProjectSelectAll, onChangeProjectSelected = _ref4.onChangeProjectSelected;
            return _react2.default.createElement("span", null, _react2.default.createElement(IsRestricted, {
                _: _,
                is_restricted: is_restricted,
                onChangeIsRestricted: onChangeIsRestricted
            }), _react2.default.createElement(SelectAll, {
                _: _,
                selectAll: selectAll,
                onChangeProjectSelectAll: onChangeProjectSelectAll,
                is_restricted: is_restricted
            }), _react2.default.createElement("table", {
                className: is_restricted ? undefined : "disabled"
            }, _react2.default.createElement("thead", null, _react2.default.createElement("tr", null, _react2.default.createElement("th", null, _("can_access")), _react2.default.createElement("th", null, _("project_id")), _react2.default.createElement("th", null, _("project_title")))), _react2.default.createElement("tbody", null, all_projects.map(function(project) {
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
                    var _props = this.props, is_restricted = _props.is_restricted, selectAll = _props.selectAll, all_projects = _props.all_projects, user_projects = _props.user_projects;
                    return all_projects ? _react2.default.createElement(Projects, {
                        _: this._,
                        is_restricted: is_restricted,
                        selectAll: selectAll,
                        all_projects: all_projects,
                        user_projects: user_projects,
                        onChangeIsRestricted: this.toggleIsRestricted,
                        onChangeProjectSelectAll: this.toggleProjectSelectAll,
                        onChangeProjectSelected: this.toggleProjectSelected
                    }) : _react2.default.createElement("div", null, "Loading...");
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
                        user_projects: _user_projects.projects,
                        original_projects: null
                    });
                }

              case c.API_PUT_FAILURE:
                {
                    return _extends({}, state, {
                        fetching: false,
                        is_restricted: _extends({}, state).original_is_restricted,
                        user_projects: _extends({}, state).original_projects,
                        original_is_restricted: null,
                        original_projects: null,
                        error: action.error
                    });
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
                    var original_is_restricted = _extends({}, state).is_restricted;
                    var is_restricted = action.data.is_restricted;
                    return _extends({}, state, {
                        original_is_restricted: original_is_restricted,
                        is_restricted: is_restricted
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHV4RGV2dG9vbHNFeHRlbnNpb24iLCJfcmVkdWNlciIsIl9zYWdhcyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0Iiwic2FnYU1pZGRsZXdhcmUiLCJyZWR1eERldlRvb2xzIiwid2luZG93IiwiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyIsInN0b3JlIiwiY3JlYXRlU3RvcmUiLCJyZWR1Y2VyIiwiY29tcG9zZSIsImFwcGx5TWlkZGxld2FyZSIsInJ1biIsIndhdGNoZXJTYWdhIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiUmVhY3RET00iLCJyZW5kZXIiLCJjcmVhdGVFbGVtZW50IiwiUHJvdmlkZXIiLCJnZXRFbGVtZW50QnlJZCIsIjczNSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidGFyZ2V0IiwicHJvcHMiLCJpIiwibGVuZ3RoIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImtleSIsIkNvbnN0cnVjdG9yIiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwicHJvdG90eXBlIiwiX3V0aWxzIiwiX2NvbnN0IiwiYyIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwibmV3T2JqIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJUeXBlRXJyb3IiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsInNlbGYiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJJc1Jlc3RyaWN0ZWQiLCJfcmVmIiwiXyIsImlzX3Jlc3RyaWN0ZWQiLCJvbkNoYW5nZUlzUmVzdHJpY3RlZCIsImlkIiwidHlwZSIsImNoZWNrZWQiLCJvbkNoYW5nZSIsIlByb2plY3QiLCJfcmVmMiIsInByb2plY3QiLCJ1c2VyX3Byb2plY3RzIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQiLCJpbkFycmF5Iiwib25DbGljayIsImNsYXNzTmFtZSIsInVuZGVmaW5lZCIsImRpc2FibGVkIiwicmVhZE9ubHkiLCJ0aXRsZSIsIlNlbGVjdEFsbCIsIl9yZWYzIiwic2VsZWN0QWxsIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsIiwiUHJvamVjdHMiLCJfcmVmNCIsImFsbF9wcm9qZWN0cyIsIm1hcCIsIkFwcCIsIl9SZWFjdCRDb21wb25lbnQiLCJ0aGlzIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInRvZ2dsZVByb2plY3RTZWxlY3RlZCIsImJpbmQiLCJ0b2dnbGVJc1Jlc3RyaWN0ZWQiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsIiwicyIsInN0cmluZ3MiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25VcGRhdGVJc1Jlc3RyaWN0ZWQiLCJvblVwZGF0ZVNlbGVjdEFsbCIsImN1cnJlbnRUYXJnZXQiLCJjbG9zZXN0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsIm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbiIsImNvbXBvbmVudERpZE1vdW50IiwidXNlcklkIiwiZGF0YUZyb21FbGVtZW50Iiwic2V0U3RvcmUiLCJvbkZldGNoVXNlclByb2plY3RzIiwiX3Byb3BzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsImZldGNoaW5nIiwiZXJyb3IiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsIkFQSV9HRVRfSU5JVCIsImRhdGEiLCJTRVRfU1RPUkUiLCJwcm9qZWN0SWQiLCJVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04iLCJVUERBVEVfSVNfUkVTVFJJQ1RFRCIsIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIiwiY29ubmVjdCIsIjczNiIsImVuZHBvaW50cyIsIl9zdG9yZSIsIl9zdG9yZTIiLCJ1c2VyX3Byb2plY3RzX2FjY2VzcyIsImFyciIsImluZGV4T2YiLCJlbGVtZW50TmFtZSIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsIjczNyIsIkFQSV9HRVRfU1VDQ0VTUyIsIkFQSV9HRVRfRkFJTFVSRSIsIkFQSV9QVVRfSU5JVCIsIkFQSV9QVVRfU1VDQ0VTUyIsIkFQSV9QVVRfRkFJTFVSRSIsIjczOCIsInV0aWxzIiwiZWZmZWN0cyIsImRldGFjaCIsIkNBTkNFTCIsImRlbGF5IiwidGhyb3R0bGUiLCJ0YWtlTGF0ZXN0IiwidGFrZUV2ZXJ5IiwiYnVmZmVycyIsImNoYW5uZWwiLCJldmVudENoYW5uZWwiLCJFTkQiLCJydW5TYWdhIiwiX3J1blNhZ2EiLCJnZXQiLCJfY2hhbm5lbCIsIl9idWZmZXJzIiwiX3NhZ2FIZWxwZXJzIiwiX2lvIiwiX21pZGRsZXdhcmUiLCJfbWlkZGxld2FyZTIiLCJfZWZmZWN0cyIsIl91dGlsczIiLCI3MzkiLCJwcm9jZXNzIiwiX3Byb2MiLCJfcHJvYzIiLCJSVU5fU0FHQV9TSUdOQVRVUkUiLCJOT05fR0VORVJBVE9SX0VSUiIsInN0b3JlSW50ZXJmYWNlIiwic2FnYSIsIl9sZW4iLCJhcmd1bWVudHMiLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwiaXRlcmF0b3IiLCJpcyIsImVudiIsIk5PREVfRU5WIiwibG9nIiwiY2hlY2siLCJmdW5jIiwiYXBwbHkiLCJfc3RvcmVJbnRlcmZhY2UiLCJzdWJzY3JpYmUiLCJnZXRTdGF0ZSIsImNvbnRleHQiLCJzYWdhTW9uaXRvciIsImxvZ2dlciIsIm9uRXJyb3IiLCJlZmZlY3RJZCIsInVpZCIsImVmZmVjdFRyaWdnZXJlZCIsIm5vb3AiLCJlZmZlY3RSZXNvbHZlZCIsImVmZmVjdFJlamVjdGVkIiwiZWZmZWN0Q2FuY2VsbGVkIiwiYWN0aW9uRGlzcGF0Y2hlZCIsInJvb3QiLCJwYXJlbnRFZmZlY3RJZCIsImVmZmVjdCIsInRhc2siLCJ3cmFwU2FnYURpc3BhdGNoIiwibmFtZSIsIjc0MCIsIl9leHRlbmRzIiwiYXNzaWduIiwic291cmNlIiwiX3R5cGVvZiIsIlN5bWJvbCIsImhhc093biIsInJlbW92ZSIsImRlZmVycmVkIiwiYXJyYXlPZkRlZmZlcmVkIiwiY3JlYXRlTW9ja1Rhc2siLCJhdXRvSW5jIiwibWFrZUl0ZXJhdG9yIiwiZGVwcmVjYXRlIiwic3ltIiwiVEFTSyIsIkhFTFBFUiIsIk1BVENIIiwiU0FHQV9BQ1RJT04iLCJTRUxGX0NBTkNFTExBVElPTiIsImtvbnN0IiwidiIsImtUcnVlIiwia0ZhbHNlIiwiaWRlbnQiLCJwcmVkaWNhdGUiLCJFcnJvciIsIm9iamVjdCIsInByb3BlcnR5Iiwibm90VW5kZWYiLCJ1bmRlZiIsImYiLCJudW1iZXIiLCJuIiwic3RyaW5nIiwiYXJyYXkiLCJpc0FycmF5IiwicHJvbWlzZSIsInAiLCJ0aGVuIiwiaXQiLCJuZXh0IiwidGhyb3ciLCJpdGVyYWJsZSIsInQiLCJvYnNlcnZhYmxlIiwib2IiLCJidWZmZXIiLCJidWYiLCJpc0VtcHR5IiwidGFrZSIsInB1dCIsInBhdHRlcm4iLCJwYXQiLCJjaCIsImNsb3NlIiwiaGVscGVyIiwic3RyaW5nYWJsZUZ1bmMiLCJpdGVtIiwiaW5kZXgiLCJzcGxpY2UiLCJmcm9tIiwiZGVmIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwdXNoIiwibXMiLCJ2YWwiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicnVubmluZyIsIl9yZXN1bHQiLCJfZXJyb3IiLCJpc1J1bm5pbmciLCJyZXN1bHQiLCJzZXRSdW5uaW5nIiwiYiIsInNldFJlc3VsdCIsInIiLCJzZXRFcnJvciIsInNlZWQiLCJrVGhyb3ciLCJlcnIiLCJrUmV0dXJuIiwiZG9uZSIsInRocm8iLCJpc0hlbHBlciIsInJldHVybiIsImxldmVsIiwibWVzc2FnZSIsImNvbnNvbGUiLCJzdGFjayIsImZuIiwiZGVwcmVjYXRpb25XYXJuaW5nIiwidXBkYXRlSW5jZW50aXZlIiwiZGVwcmVjYXRlZCIsInByZWZlcnJlZCIsImludGVybmFsRXJyIiwiY3JlYXRlU2V0Q29udGV4dFdhcm5pbmciLCJjdHgiLCJhY3Rpb24iLCJjbG9uZWFibGVHZW5lcmF0b3IiLCJnZW5lcmF0b3JGdW5jIiwiaGlzdG9yeSIsImdlbiIsImFyZyIsImNsb25lIiwiY2xvbmVkR2VuIiwiZm9yRWFjaCIsIl9yZXR1cm4iLCJfdGhyb3ciLCJleGNlcHRpb24iLCI3NDEiLCJUQVNLX0NBTkNFTCIsIkNIQU5ORUxfRU5EIiwiTk9UX0lURVJBVE9SX0VSUk9SIiwicHJvYyIsIl9zY2hlZHVsZXIiLCJfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMiLCJkZXNjcyIsImRlc2MiLCJ0b1N0cmluZyIsIm1hdGNoZXJzIiwid2lsZGNhcmQiLCJfZGVmYXVsdCIsImlucHV0IiwiU3RyaW5nIiwicGF0dGVybnMiLCJzb21lIiwibWF0Y2hlciIsIl9wcmVkaWNhdGUiLCJmb3JrUXVldWUiLCJtYWluVGFzayIsImNiIiwidGFza3MiLCJjb21wbGV0ZWQiLCJhZGRUYXNrIiwiYWJvcnQiLCJjYW5jZWxBbGwiLCJjb250IiwicmVzIiwiaXNFcnIiLCJjYW5jZWwiLCJnZXRUYXNrcyIsInRhc2tOYW1lcyIsImNyZWF0ZVRhc2tJdGVyYXRvciIsInBjIiwiZWZmIiwicmV0Iiwid3JhcEhlbHBlciIsInBhcmVudENvbnRleHQiLCJvcHRpb25zIiwiZWZmZWN0c1N0cmluZyIsInJ1blBhcmFsbGVsRWZmZWN0IiwicnVuQWxsRWZmZWN0IiwibG9nRXJyb3IiLCJzYWdhU3RhY2siLCJzcGxpdCIsInN0ZENoYW5uZWwiLCJ0YXNrQ29udGV4dCIsIm5ld1Rhc2siLCJjYW5jZWxNYWluIiwidGFza1F1ZXVlIiwiZW5kIiwiaXNDYW5jZWxsZWQiLCJfaXNSdW5uaW5nIiwiX2lzQ2FuY2VsbGVkIiwicnVuRWZmZWN0IiwiaXNNYWluUnVubmluZyIsIl9kZWZlcnJlZEVuZCIsIl9pc0Fib3J0ZWQiLCJqb2luZXJzIiwiaiIsImxhYmVsIiwiZWZmZWN0U2V0dGxlZCIsImN1cnJDYiIsInJlc29sdmVQcm9taXNlIiwicnVuRm9ya0VmZmVjdCIsInJlc29sdmVJdGVyYXRvciIsImFzRWZmZWN0IiwicnVuVGFrZUVmZmVjdCIsInJ1blB1dEVmZmVjdCIsImFsbCIsInJhY2UiLCJydW5SYWNlRWZmZWN0IiwicnVuQ2FsbEVmZmVjdCIsImNwcyIsInJ1bkNQU0VmZmVjdCIsImZvcmsiLCJqb2luIiwicnVuSm9pbkVmZmVjdCIsInJ1bkNhbmNlbEVmZmVjdCIsInNlbGVjdCIsInJ1blNlbGVjdEVmZmVjdCIsImFjdGlvbkNoYW5uZWwiLCJydW5DaGFubmVsRWZmZWN0IiwiZmx1c2giLCJydW5GbHVzaEVmZmVjdCIsImNhbmNlbGxlZCIsInJ1bkNhbmNlbGxlZEVmZmVjdCIsImdldENvbnRleHQiLCJydW5HZXRDb250ZXh0RWZmZWN0Iiwic2V0Q29udGV4dCIsInJ1blNldENvbnRleHRFZmZlY3QiLCJjYW5jZWxQcm9taXNlIiwibWF5YmUiLCJ0YWtlQ2IiLCJpbnAiLCJpc0VuZCIsImFzYXAiLCJfcmVmNSIsImNwc0NiIiwiY29uY2F0IiwiX3JlZjYiLCJkZXRhY2hlZCIsInRhc2tJdGVyYXRvciIsInN1c3BlbmQiLCJfdGFzayIsImpvaW5lciIsImlzQWJvcnRlZCIsInRhc2tUb0NhbmNlbCIsImtleXMiLCJjb21wbGV0ZWRDb3VudCIsInJlc3VsdHMiLCJjaGlsZENicyIsImNoZWNrRWZmZWN0RW5kIiwiY2hDYkF0S2V5IiwiX3Jlc3BvbnNlIiwicmVzcG9uc2UiLCJzbGljZSIsIl9yZWY3Iiwic2VsZWN0b3IiLCJfcmVmOCIsIm1hdGNoIiwiZml4ZWQiLCJwcm9wIiwiX2RvbmUiLCJfcmVmOSIsIl9tdXRhdG9yTWFwIiwiNzQyIiwicXVldWUiLCJzZW1hcGhvcmUiLCJleGVjIiwicmVsZWFzZSIsInNoaWZ0IiwiNzQzIiwidGFrZW0iLCJzcGF3biIsIklPIiwiVEFLRSIsIlBVVCIsIkFMTCIsIlJBQ0UiLCJDQUxMIiwiQ1BTIiwiRk9SSyIsIkpPSU4iLCJTRUxFQ1QiLCJBQ1RJT05fQ0hBTk5FTCIsIkNBTkNFTExFRCIsIkZMVVNIIiwiR0VUX0NPTlRFWFQiLCJTRVRfQ09OVEVYVCIsIlRFU1RfSElOVCIsInBheWxvYWQiLCJwYXR0ZXJuT3JDaGFubmVsIiwic3luYyIsImdldEZuQ2FsbERlc2MiLCJtZXRoIiwiX2ZuIiwiX2ZuMiIsIl9sZW4yIiwiX2tleTIiLCJfbGVuMyIsIl9rZXkzIiwiX2xlbjQiLCJfa2V5NCIsIl9sZW41IiwiX2tleTUiLCJfbGVuNiIsIl9rZXk2IiwiX2xlbjciLCJfa2V5NyIsIndvcmtlciIsIl9sZW44IiwiX2tleTgiLCJ0YWtlRXZlcnlIZWxwZXIiLCJfbGVuOSIsIl9rZXk5IiwidGFrZUxhdGVzdEhlbHBlciIsIl9sZW4xMCIsIl9rZXkxMCIsInRocm90dGxlSGVscGVyIiwiY3JlYXRlQXNFZmZlY3RUeXBlIiwiNzQ0IiwiX3Rha2VFdmVyeSIsIl90YWtlRXZlcnkyIiwiX3Rha2VMYXRlc3QiLCJfdGFrZUxhdGVzdDIiLCJfdGhyb3R0bGUiLCJfdGhyb3R0bGUyIiwiaGVscGVyTmFtZSIsIjc0NSIsIl9mc21JdGVyYXRvciIsIl9mc21JdGVyYXRvcjIiLCJ5VGFrZSIsInlGb3JrIiwiYWMiLCJzZXRBY3Rpb24iLCJxMSIsInEyIiwicUVuZCIsInNhZmVOYW1lIiwiNzQ2IiwiZnNtSXRlcmF0b3IiLCJlbnRyeSIsImZzbSIsInEwIiwidXBkYXRlU3RhdGUiLCJxTmV4dCIsIl9mc20kcU5leHQiLCJxIiwib3V0cHV0IiwiX3VwZGF0ZVN0YXRlIiwiNzQ3IiwiVU5ERUZJTkVEX0lOUFVUX0VSUk9SIiwiSU5WQUxJRF9CVUZGRVIiLCJlbWl0dGVyIiwiQ0hBTk5FTF9FTkRfVFlQRSIsImEiLCJzdWJzY3JpYmVycyIsInN1YiIsImVtaXQiLCJsZW4iLCJjbG9zZWQiLCJ0YWtlcnMiLCJjaGVja0ZvcmJpZGRlblN0YXRlcyIsIl9fdGFrZXJzX18iLCJfX2Nsb3NlZF9fIiwibm9uZSIsImNoYW4iLCJ1bnN1YnNjcmliZSIsIjc0OCIsIkJVRkZFUl9PVkVSRkxPVyIsIk9OX09WRVJGTE9XX1RIUk9XIiwiT05fT1ZFUkZMT1dfRFJPUCIsIk9OX09WRVJGTE9XX1NMSURFIiwiT05fT1ZFUkZMT1dfRVhQQU5EIiwiemVyb0J1ZmZlciIsInJpbmdCdWZmZXIiLCJsaW1pdCIsIm92ZXJmbG93QWN0aW9uIiwicHVzaEluZGV4IiwicG9wSW5kZXgiLCJpdGVtcyIsImRvdWJsZWRMaW1pdCIsImRyb3BwaW5nIiwic2xpZGluZyIsImV4cGFuZGluZyIsImluaXRpYWxTaXplIiwiNzQ5IiwieUNhbmNlbCIsInNldFRhc2siLCJxMyIsIjc1MCIsImRlbGF5TGVuZ3RoIiwieUFjdGlvbkNoYW5uZWwiLCJ5RGVsYXkiLCJzZXRDaGFubmVsIiwicTQiLCI3NTEiLCJzYWdhTWlkZGxld2FyZUZhY3RvcnkiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJfcmVmJGNvbnRleHQiLCJvbmVycm9yIiwic2FnYUVtaXR0ZXIiLCI3NTIiLCI3NTMiLCI3NTQiLCJjb21wb3NlV2l0aERldlRvb2xzIiwiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIiwiZGV2VG9vbHNFbmhhbmNlciIsIjc1NSIsIl9wdWxsIiwiX3B1bGwyIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiYXJyMiIsImluaXRpYWxTdGF0ZSIsIm9yaWdpbmFsX3Byb2plY3RzIiwiX2FjdGlvbiRkYXRhIiwicHJvamVjdHMiLCJvcmlnaW5hbF9pc19yZXN0cmljdGVkIiwiX3VzZXJfcHJvamVjdHMzIiwiX3N0YXRlIiwiNzU2IiwiYmFzZVJlc3QiLCJwdWxsQWxsIiwicHVsbCIsIjc1NyIsImlkZW50aXR5Iiwib3ZlclJlc3QiLCJzZXRUb1N0cmluZyIsInN0YXJ0IiwiNzU4IiwibmF0aXZlTWF4IiwiTWF0aCIsIm1heCIsInRyYW5zZm9ybSIsIm90aGVyQXJncyIsIjc1OSIsInRoaXNBcmciLCI3NjAiLCJiYXNlU2V0VG9TdHJpbmciLCJzaG9ydE91dCIsIjc2MSIsImNvbnN0YW50IiwiNzYyIiwiNzYzIiwiSE9UX0NPVU5UIiwiSE9UX1NQQU4iLCJuYXRpdmVOb3ciLCJEYXRlIiwibm93IiwiY291bnQiLCJsYXN0Q2FsbGVkIiwic3RhbXAiLCJyZW1haW5pbmciLCI3NjQiLCJiYXNlUHVsbEFsbCIsInZhbHVlcyIsIjc2NSIsImFycmF5TWFwIiwiYmFzZUluZGV4T2YiLCJiYXNlSW5kZXhPZldpdGgiLCJiYXNlVW5hcnkiLCJjb3B5QXJyYXkiLCJhcnJheVByb3RvIiwiaXRlcmF0ZWUiLCJjb21wYXJhdG9yIiwic2VlbiIsImZyb21JbmRleCIsImNvbXB1dGVkIiwiNzY2IiwiYmFzZUZpbmRJbmRleCIsImJhc2VJc05hTiIsInN0cmljdEluZGV4T2YiLCI3NjciLCJmcm9tUmlnaHQiLCI3NjgiLCI3NjkiLCI3NzAiLCI3NzEiLCI3NzIiLCJfYXhpb3MiLCJfYXhpb3MyIiwiX21hcmtlZCIsInJlZ2VuZXJhdG9yUnVudGltZSIsIm1hcmsiLCJnZXRTYWdhIiwiX21hcmtlZDIiLCJwdXRTYWdhIiwiX21hcmtlZDMiLCJmZXRjaERhdGEiLCJtZXRob2QiLCJ1cmwiLCJwdXREYXRhIiwiaGVhZGVycyIsIlgtQ1NSRlRva2VuIiwiZ2V0Q29va2llIiwid3JhcCIsImdldFNhZ2EkIiwiX2NvbnRleHQiLCJwcmV2Iiwic2VudCIsInQwIiwic3RvcCIsImdldFVzZXJJZCIsImdldFVzZXJQcm9qZWN0cyIsImdldElzUmVzdHJpY3RlZCIsInB1dFNhZ2EkIiwiX2NvbnRleHQyIiwid2F0Y2hlclNhZ2EkIiwiX2NvbnRleHQzIiwiNzczIiwiNzc0IiwiQXhpb3MiLCJkZWZhdWx0cyIsImNyZWF0ZUluc3RhbmNlIiwiZGVmYXVsdENvbmZpZyIsInJlcXVlc3QiLCJleHRlbmQiLCJheGlvcyIsImluc3RhbmNlQ29uZmlnIiwibWVyZ2UiLCJDYW5jZWwiLCJDYW5jZWxUb2tlbiIsImlzQ2FuY2VsIiwicHJvbWlzZXMiLCJzcHJlYWQiLCI3NzUiLCJpc0J1ZmZlciIsImlzQXJyYXlCdWZmZXIiLCJpc0Zvcm1EYXRhIiwiRm9ybURhdGEiLCJpc0FycmF5QnVmZmVyVmlldyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzVW5kZWZpbmVkIiwiaXNPYmplY3QiLCJpc0RhdGUiLCJpc0ZpbGUiLCJpc0Jsb2IiLCJpc0Z1bmN0aW9uIiwiaXNTdHJlYW0iLCJwaXBlIiwiaXNVUkxTZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0cmltIiwic3RyIiwicmVwbGFjZSIsImlzU3RhbmRhcmRCcm93c2VyRW52IiwibmF2aWdhdG9yIiwicHJvZHVjdCIsImwiLCJhc3NpZ25WYWx1ZSIsIjc3NiIsIjc3NyIsImlzU2xvd0J1ZmZlciIsIl9pc0J1ZmZlciIsInJlYWRGbG9hdExFIiwiNzc4IiwiSW50ZXJjZXB0b3JNYW5hZ2VyIiwiZGlzcGF0Y2hSZXF1ZXN0IiwiaW50ZXJjZXB0b3JzIiwiY29uZmlnIiwidG9Mb3dlckNhc2UiLCJjaGFpbiIsInVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzIiwiaW50ZXJjZXB0b3IiLCJ1bnNoaWZ0IiwiZnVsZmlsbGVkIiwicmVqZWN0ZWQiLCJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCJmb3JFYWNoTWV0aG9kTm9EYXRhIiwiZm9yRWFjaE1ldGhvZFdpdGhEYXRhIiwiNzc5Iiwibm9ybWFsaXplSGVhZGVyTmFtZSIsIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwiQ29udGVudC1UeXBlIiwic2V0Q29udGVudFR5cGVJZlVuc2V0IiwiZ2V0RGVmYXVsdEFkYXB0ZXIiLCJhZGFwdGVyIiwiWE1MSHR0cFJlcXVlc3QiLCJ0cmFuc2Zvcm1SZXF1ZXN0Iiwic3RyaW5naWZ5IiwidHJhbnNmb3JtUmVzcG9uc2UiLCJ0aW1lb3V0IiwieHNyZkNvb2tpZU5hbWUiLCJ4c3JmSGVhZGVyTmFtZSIsIm1heENvbnRlbnRMZW5ndGgiLCJ2YWxpZGF0ZVN0YXR1cyIsInN0YXR1cyIsImNvbW1vbiIsIkFjY2VwdCIsIjc4MCIsIm5vcm1hbGl6ZWROYW1lIiwicHJvY2Vzc0hlYWRlciIsInRvVXBwZXJDYXNlIiwiNzgxIiwic2V0dGxlIiwiYnVpbGRVUkwiLCJwYXJzZUhlYWRlcnMiLCJpc1VSTFNhbWVPcmlnaW4iLCJjcmVhdGVFcnJvciIsImJ0b2EiLCJ4aHJBZGFwdGVyIiwiZGlzcGF0Y2hYaHJSZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImxvYWRFdmVudCIsInhEb21haW4iLCJYRG9tYWluUmVxdWVzdCIsIm9ucHJvZ3Jlc3MiLCJoYW5kbGVQcm9ncmVzcyIsIm9udGltZW91dCIsImhhbmRsZVRpbWVvdXQiLCJhdXRoIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIkF1dGhvcml6YXRpb24iLCJvcGVuIiwicGFyYW1zIiwicGFyYW1zU2VyaWFsaXplciIsImhhbmRsZUxvYWQiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VVUkwiLCJyZXNwb25zZUhlYWRlcnMiLCJnZXRBbGxSZXNwb25zZUhlYWRlcnMiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVRleHQiLCJzdGF0dXNUZXh0IiwiaGFuZGxlRXJyb3IiLCJjb29raWVzIiwieHNyZlZhbHVlIiwid2l0aENyZWRlbnRpYWxzIiwicmVhZCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbkRvd25sb2FkUHJvZ3Jlc3MiLCJvblVwbG9hZFByb2dyZXNzIiwidXBsb2FkIiwiY2FuY2VsVG9rZW4iLCJvbkNhbmNlbGVkIiwic2VuZCIsIjc4MiIsIjc4MyIsImVuaGFuY2VFcnJvciIsImNvZGUiLCI3ODQiLCI3ODUiLCJlbmNvZGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzZXJpYWxpemVkUGFyYW1zIiwicGFydHMiLCJzZXJpYWxpemUiLCJwYXJzZVZhbHVlIiwidG9JU09TdHJpbmciLCI3ODYiLCJpZ25vcmVEdXBsaWNhdGVPZiIsInBhcnNlZCIsInBhcnNlciIsImxpbmUiLCJzdWJzdHIiLCI3ODciLCJzdGFuZGFyZEJyb3dzZXJFbnYiLCJtc2llIiwidGVzdCIsInVzZXJBZ2VudCIsInVybFBhcnNpbmdOb2RlIiwib3JpZ2luVVJMIiwicmVzb2x2ZVVSTCIsImhyZWYiLCJzZXRBdHRyaWJ1dGUiLCJwcm90b2NvbCIsImhvc3QiLCJzZWFyY2giLCJoYXNoIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJjaGFyQXQiLCJsb2NhdGlvbiIsInJlcXVlc3RVUkwiLCJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCI3ODgiLCJjaGFycyIsIkUiLCJibG9jayIsImNoYXJDb2RlIiwiaWR4IiwiY2hhckNvZGVBdCIsIjc4OSIsIndyaXRlIiwiZXhwaXJlcyIsInBhdGgiLCJkb21haW4iLCJzZWN1cmUiLCJjb29raWUiLCJ0b0dNVFN0cmluZyIsIlJlZ0V4cCIsImRlY29kZVVSSUNvbXBvbmVudCIsIjc5MCIsImhhbmRsZXJzIiwidXNlIiwiZWplY3QiLCJmb3JFYWNoSGFuZGxlciIsImgiLCI3OTEiLCJ0cmFuc2Zvcm1EYXRhIiwiaXNBYnNvbHV0ZVVSTCIsImNvbWJpbmVVUkxzIiwidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsInRocm93SWZSZXF1ZXN0ZWQiLCJiYXNlVVJMIiwiY2xlYW5IZWFkZXJDb25maWciLCJvbkFkYXB0ZXJSZXNvbHV0aW9uIiwib25BZGFwdGVyUmVqZWN0aW9uIiwicmVhc29uIiwiNzkyIiwiZm5zIiwiNzkzIiwiX19DQU5DRUxfXyIsIjc5NCIsIjc5NSIsInJlbGF0aXZlVVJMIiwiNzk2IiwiNzk3IiwiZXhlY3V0b3IiLCJwcm9taXNlRXhlY3V0b3IiLCJ0b2tlbiIsIjc5OCIsImNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiQUFBQUEsZUFBYztJQUVSQyxHQUNBLFNBQVVDLFFBQVFDLFNBQVNDO1FBRWhDO1FDRUQsSUFBQUMsU0FBQUQsb0JBQUE7UURFQyxJQUFJRSxVQUFVQyx1QkFBdUJGO1FDRHRDLElBQUFHLFlBQUFKLG9CQUFBO1FES0MsSUFBSUssYUFBYUYsdUJBQXVCQztRQ0h6QyxJQUFBRSxPQUFBTixvQkFBQTtRRE9DLElBQUlPLFFBQVFKLHVCQUF1Qkc7UUNMcEMsSUFBQUUsU0FBQVIsb0JBQUE7UUFDQSxJQUFBUyxhQUFBVCxvQkFBQTtRRFVDLElBQUlVLGNBQWNQLHVCQUF1Qk07UUNUMUMsSUFBQUUsY0FBQVgsb0JBQUE7UUFDQSxJQUFBWSwwQkFBQVosb0JBQUE7UUFFQSxJQUFBYSxXQUFBYixvQkFBQTtRQUNBLElBQUFjLFNBQUFkLG9CQUFBO1FEZUMsU0FBU0csdUJBQXVCWTtZQUFPLE9BQU9BLE9BQU9BLElBQUlDLGFBQWFEO2dCQUFRRSxTQUFTRjs7O1FDWnhGLElBQU1HLGtCQUFpQixHQUFBUixZ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QWxxQixVQUFBKzFCLG1CQUFBLFNBQUFBO1lBQ0EsSUFBQTN5QixLQUFBZ3pCLFFBQUE7Z0JBQ0EsTUFBQWh6QixLQUFBZ3pCOzs7UUFRQWxNLFlBQUE5ZSxTQUFBLFNBQUFBO1lBQ0EsSUFBQTZJO1lBQ0EsSUFBQStpQixRQUFBLElBQUE5TSxZQUFBLFNBQUE0TSxTQUFBMzJCO2dCQUNBOFQsU0FBQTlUOztZQUVBO2dCQUNBNjJCO2dCQUNBL2lCOzs7UUFJQXpYLE9BQUFDLFVBQUF5dEI7O0loRXF3S00rTSxLQUNBLFNBQVV6NkIsUUFBUUM7UWlFOXpLeEI7UUFzQkFELE9BQUFDLFVBQUEsU0FBQTR0QixPQUFBNk07WUFDQSxnQkFBQTFPLEtBQUFyaUI7Z0JBQ0EsT0FBQSt3QixTQUFBdnRCLE1BQUEsTUFBQXhEIiwiZmlsZSI6InVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3ZWJwYWNrSnNvbnAoWzFdLHtcblxuLyoqKi8gMDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNyk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblx0XG5cdHZhciBfQXBwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzUpO1xuXHRcblx0dmFyIF9BcHAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQXBwKTtcblx0XG5cdHZhciBfcmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5Nyk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYSA9IF9fd2VicGFja19yZXF1aXJlX18oNzM4KTtcblx0XG5cdHZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3JlZHV4RGV2dG9vbHNFeHRlbnNpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NCk7XG5cdFxuXHR2YXIgX3JlZHVjZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NSk7XG5cdFxuXHR2YXIgX3NhZ2FzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzIpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdC8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5cdHZhciBzYWdhTWlkZGxld2FyZSA9ICgwLCBfcmVkdXhTYWdhMi5kZWZhdWx0KSgpO1xuXHRcblx0Ly8gZGV2IHRvb2xzIG1pZGRsZXdhcmVcblx0Lypcblx0IEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0IFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0IDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgKi9cblx0XG5cdHZhciByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblx0XG5cdHZhciBzdG9yZSA9IHZvaWQgMDtcblx0aWYgKHJlZHV4RGV2VG9vbHMpIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5jb21wb3NlKSgoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG5cdH0gZWxzZSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSkpO1xuXHR9XG5cdFxuXHRzYWdhTWlkZGxld2FyZS5ydW4oX3NhZ2FzLndhdGNoZXJTYWdhKTtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgIF9yZWFjdERvbTIuZGVmYXVsdC5yZW5kZXIoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG5cdCAgICAgICAgeyBzdG9yZTogc3RvcmUgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfQXBwMi5kZWZhdWx0LCBudWxsKVxuXHQgICAgKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIikpO1xuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNik7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cdFxuXHRmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH0gLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0dmFyIElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIElzUmVzdHJpY3RlZChfcmVmKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYuXyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZi5vbkNoYW5nZUlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJsYWJlbFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBcImlzX3Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZTogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICAgICAgfSksXG5cdCAgICAgICAgICAgIF8oXCJyZXN0cmljdF9hY2Nlc3NcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFByb2plY3QgPSBmdW5jdGlvbiBQcm9qZWN0KF9yZWYyKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYyLl8sXG5cdCAgICAgICAgcHJvamVjdCA9IF9yZWYyLnByb2plY3QsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9yZWYyLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYyLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmMi5vbkNoYW5nZVByb2plY3RTZWxlY3RlZDtcblx0XG5cdCAgICB2YXIgY2hlY2tlZCA9IHVzZXJfcHJvamVjdHMgJiYgKDAsIF91dGlscy5pbkFycmF5KShwcm9qZWN0LmlkLCB1c2VyX3Byb2plY3RzKTtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInRyXCIsXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICBrZXk6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCxcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBjaGVja2VkID8gXCJwcm9qZWN0U2VsZWN0ZWRcIiA6IHVuZGVmaW5lZFxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdCAgICAgICAgICAgICAgICBpZDogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGNoZWNrZWQsXG5cdCAgICAgICAgICAgICAgICBkaXNhYmxlZDogIWlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICByZWFkT25seTogdHJ1ZVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC5pZFxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgcHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFNlbGVjdEFsbCA9IGZ1bmN0aW9uIFNlbGVjdEFsbChfcmVmMykge1xuXHQgICAgdmFyIF8gPSBfcmVmMy5fLFxuXHQgICAgICAgIHNlbGVjdEFsbCA9IF9yZWYzLnNlbGVjdEFsbCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmMy5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9yZWYzLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IGlzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCIgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJidXR0b25cIixcblx0ICAgICAgICAgICAgeyBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGRpc2FibGVkOiBpc19yZXN0cmljdGVkID8gZmFsc2UgOiB0cnVlIH0sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA/IF8oXCJzZWxlY3RfYWxsXCIpIDogXyhcImRlc2VsZWN0X2FsbFwiKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdHMgPSBmdW5jdGlvbiBQcm9qZWN0cyhfcmVmNCkge1xuXHQgICAgdmFyIF8gPSBfcmVmNC5fLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IF9yZWY0LmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICB1c2VyX3Byb2plY3RzID0gX3JlZjQudXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZjQuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmNC5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmNC5vbkNoYW5nZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmNC5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmNC5vbkNoYW5nZVByb2plY3RTZWxlY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChJc1Jlc3RyaWN0ZWQsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ6IG9uQ2hhbmdlSXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsLCB7XG5cdCAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRhYmxlXCIsXG5cdCAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBpc19yZXN0cmljdGVkID8gdW5kZWZpbmVkIDogXCJkaXNhYmxlZFwiIH0sXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0aGVhZFwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgIFwidHJcIixcblx0ICAgICAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJjYW5fYWNjZXNzXCIpXG5cdCAgICAgICAgICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwicHJvamVjdF9pZFwiKVxuXHQgICAgICAgICAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcInByb2plY3RfdGl0bGVcIilcblx0ICAgICAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0Ym9keVwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdCwge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3QsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgQXBwID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcblx0ICAgIF9pbmhlcml0cyhBcHAsIF9SZWFjdCRDb21wb25lbnQpO1xuXHRcblx0ICAgIGZ1bmN0aW9uIEFwcChwcm9wcykge1xuXHQgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBcHApO1xuXHRcblx0ICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQXBwLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQXBwKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXHRcblx0ICAgICAgICBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkID0gX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLl8gPSBfdGhpcy5fLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIHJldHVybiBfdGhpcztcblx0ICAgIH1cblx0XG5cdCAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuXHRcblx0XG5cdCAgICBfY3JlYXRlQ2xhc3MoQXBwLCBbe1xuXHQgICAgICAgIGtleTogXCJfXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF8ocykge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZUlzUmVzdHJpY3RlZFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdEFsbFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdCAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsb3Nlc3QoXCJ0YWJsZVwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwiY29tcG9uZW50RGlkTW91bnRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdCAgICAgICAgICAgIHZhciB1c2VySWQgPSAoMCwgX3V0aWxzLmRhdGFGcm9tRWxlbWVudCkoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkOiB1c2VySWQgfSk7XG5cdFxuXHQgICAgICAgICAgICB2YXIgc3RyaW5ncyA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItcHJvamVjdHMtdGV4dFwiKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHN0cmluZ3M6IHN0cmluZ3MgfSk7XG5cdFxuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInJlbmRlclwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdCAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzLFxuXHQgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCA9IF9wcm9wcy5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gX3Byb3BzLnNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cyA9IF9wcm9wcy5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX3Byb3BzLnVzZXJfcHJvamVjdHM7XG5cdFxuXHQgICAgICAgICAgICByZXR1cm4gYWxsX3Byb2plY3RzID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdHMsIHtcblx0ICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbDogdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkXG5cdCAgICAgICAgICAgIH0pIDogX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIFwiTG9hZGluZy4uLlwiXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXHQgICAgfV0pO1xuXHRcblx0ICAgIHJldHVybiBBcHA7XG5cdH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cdFxuXHR2YXIgbWFwU3RhdGVUb1Byb3BzID0gZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG5cdCAgICB2YXIgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gc3RhdGUuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBzdGF0ZS5zZWxlY3RBbGwsXG5cdCAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgc3RyaW5ncyA9IHN0YXRlLnN0cmluZ3M7XG5cdFxuXHQgICAgcmV0dXJuIHsgZmV0Y2hpbmc6IGZldGNoaW5nLCBlcnJvcjogZXJyb3IsIGFsbF9wcm9qZWN0czogYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGw6IHNlbGVjdEFsbCwgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cywgc3RyaW5nczogc3RyaW5ncyB9O1xuXHR9O1xuXHRcblx0dmFyIG1hcERpc3BhdGNoVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBvbkZldGNoVXNlclByb2plY3RzOiBmdW5jdGlvbiBvbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goeyB0eXBlOiBjLkFQSV9HRVRfSU5JVCwgZGF0YTogeyB1c2VySWQ6IHVzZXJJZCB9IH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgc2V0U3RvcmU6IGZ1bmN0aW9uIHNldFN0b3JlKGRhdGEpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5TRVRfU1RPUkUsIGRhdGE6IGRhdGEgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb246IGZ1bmN0aW9uIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihwcm9qZWN0SWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIGRhdGE6IHsgcHJvamVjdElkOiBwcm9qZWN0SWQgfSB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlSXNSZXN0cmljdGVkOiBmdW5jdGlvbiBvblVwZGF0ZUlzUmVzdHJpY3RlZChpc19yZXN0cmljdGVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIGRhdGE6IHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCB9IH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6IGZ1bmN0aW9uIG9uVXBkYXRlU2VsZWN0QWxsKCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuaW5BcnJheSA9IGV4cG9ydHMuZW5kcG9pbnRzID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9zdG9yZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzA0KTtcblx0XG5cdHZhciBfc3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RvcmUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBlbmRwb2ludHMgPSBleHBvcnRzLmVuZHBvaW50cyA9IHtcblx0ICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBmdW5jdGlvbiB1c2VyX3Byb2plY3RzX2FjY2VzcyhpZCkge1xuXHQgICAgICAgIHJldHVybiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgaWQgKyBcIi8/Zm9ybWF0PWpzb25cIjtcblx0ICAgIH1cblx0fTsgLypcblx0ICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgKi9cblx0XG5cdHZhciBpbkFycmF5ID0gZXhwb3J0cy5pbkFycmF5ID0gZnVuY3Rpb24gaW5BcnJheShvYmosIGFycikge1xuXHQgICAgcmV0dXJuIGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblx0fTtcblx0XG5cdHZhciBkYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGRhdGFGcm9tRWxlbWVudChlbGVtZW50TmFtZSkge1xuXHQgICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0Ly8gYWN0aW9uIHR5cGVzXG5cdHZhciAvL1xuXHRTRVRfU1RPUkUgPSBleHBvcnRzLlNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG5cdFxuXHQvL1xuXHRBUElfR0VUX0lOSVQgPSBleHBvcnRzLkFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG5cdCAgICBBUElfR0VUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfR0VUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRBUElfUFVUX0lOSVQgPSBleHBvcnRzLkFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG5cdCAgICBBUElfUFVUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfUFVUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBleHBvcnRzLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG5cdCAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IGV4cG9ydHMuVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG5cdCAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IGV4cG9ydHMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWxheTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZGV0YWNoO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTEpO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cdFxuXHR2YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Myk7XG5cdFxuXHR2YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuXHRleHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuXHRleHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Mzk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0dmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcblx0dmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cdFxuXHRmdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHQgICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG5cdCAgICB9XG5cdCAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuXHQgICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgfVxuXHRcblx0ICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG5cdCAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcblx0ICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuXHQgICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXHRcblx0XG5cdCAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXHRcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG5cdCAgfVxuXHRcblx0ICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHRhc2s7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmNoZWNrID0gY2hlY2s7XG5cdGV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuXHRleHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcblx0ZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuXHRleHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcblx0ZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuXHRleHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5cdGV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5cdGV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG5cdHZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuXHQgIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcblx0fTtcblx0XG5cdHZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xuXHR2YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcblx0dmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG5cdHZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG5cdHZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xuXHR2YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcblx0dmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHY7XG5cdCAgfTtcblx0fTtcblx0dmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcblx0dmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcblx0dmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cdHZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG5cdCAgcmV0dXJuIHY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuXHQgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcblx0ICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdH1cblx0XG5cdHZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG5cdCAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9LFxuXHQgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcblx0ICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG5cdCAgfSxcblx0ICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuXHQgIH0sXG5cdCAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG5cdCAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG5cdCAgfSxcblx0ICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcblx0ICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcblx0ICB9LFxuXHQgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG5cdCAgfSxcblx0ICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuXHQgIH0sXG5cdCAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG5cdCAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuXHQgIH0sXG5cdCAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuXHQgICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcblx0ICB9LFxuXHQgIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuXHQgICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuXHQgIH0sXG5cdCAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcblx0ICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuXHQgIH0sXG5cdCAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG5cdCAgfSxcblx0ICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG5cdCAgfSxcblx0ICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuXHQgICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcblx0ICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuXHQgICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG5cdCAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG5cdCAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblx0ICBpZiAoaW5kZXggPj0gMCkge1xuXHQgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG5cdCAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcblx0ICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuXHQgICAgICAgIGFycltpXSA9IG9ialtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycjtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBkZWZlcnJlZCgpIHtcblx0ICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcblx0ICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG5cdCAgfSk7XG5cdCAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuXHQgIHJldHVybiBkZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcblx0ICB2YXIgYXJyID0gW107XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHQgICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG5cdCAgfVxuXHQgIHJldHVybiBhcnI7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlbGF5KG1zKSB7XG5cdCAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblx0XG5cdCAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdCAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcblx0ICAgIH0sIG1zKTtcblx0ICB9KTtcblx0XG5cdCAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuXHQgIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgIHJldHVybiBydW5uaW5nO1xuXHQgIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQ7XG5cdCAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgcmV0dXJuIF9lcnJvcjtcblx0ICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcblx0ICAgIHJldHVybiBydW5uaW5nID0gYjtcblx0ICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG5cdCAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcblx0ICAgIHJldHVybiBfZXJyb3IgPSBlO1xuXHQgIH0sIF9yZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGF1dG9JbmMoKSB7XG5cdCAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gKytzZWVkO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cdFxuXHR2YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuXHQgIHRocm93IGVycjtcblx0fTtcblx0dmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG5cdH07XG5cdGZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG5cdCAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblx0XG5cdCAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3I7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gaXRlcmF0b3I7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG5cdCAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuXHQgKiovXG5cdGZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuXHQgIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdFxuXHQgIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG5cdCAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcblx0ICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuXHQgIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG5cdH07XG5cdFxuXHR2YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG5cdCAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcblx0fTtcblx0XG5cdHZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG5cdCAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcblx0fTtcblx0XG5cdHZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBoaXN0b3J5ID0gW107XG5cdCAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcblx0ICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcblx0ICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcblx0ICAgICAgfSxcblx0ICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuXHQgICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcblx0ICAgICAgfSxcblx0ICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuXHQgICAgICB9LFxuXHQgICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuXHQgICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9O1xuXHR9O1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0ZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0ICB9XG5cdH07XG5cdHZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBtYXRjaGVycyA9IHtcblx0ICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuXHQgIH0sXG5cdCAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuXHQgICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcblx0ICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcblx0ICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuXHQgICAgfTtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcblx0ICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcblx0fVxuXHRcblx0LyoqXG5cdCAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3Ncblx0ICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcblx0ICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuXHQgIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcblx0ICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuXHQgIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG5cdCAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cdFxuXHQgIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuXHQgIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcblx0ICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG5cdCAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuXHQgIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuXHQqKi9cblx0ZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuXHQgIHZhciB0YXNrcyA9IFtdLFxuXHQgICAgICByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuXHQgIGFkZFRhc2sobWFpblRhc2spO1xuXHRcblx0ICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcblx0ICAgIGNhbmNlbEFsbCgpO1xuXHQgICAgY2IoZXJyLCB0cnVlKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuXHQgICAgdGFza3MucHVzaCh0YXNrKTtcblx0ICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG5cdCAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICBhYm9ydChyZXMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIGNiKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICB0LmNhbmNlbCgpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrcyA9IFtdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGFkZFRhc2s6IGFkZFRhc2ssXG5cdCAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcblx0ICAgIGFib3J0OiBhYm9ydCxcblx0ICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzO1xuXHQgICAgfSxcblx0ICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgICAgcmV0dXJuIHQubmFtZTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcblx0ICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgZm4gPSBfcmVmLmZuLFxuXHQgICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuXHQgICAgcmV0dXJuIGZuO1xuXHQgIH1cblx0XG5cdCAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgZXJyb3IgPSB2b2lkIDA7XG5cdCAgdHJ5IHtcblx0ICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgZXJyb3IgPSBlcnI7XG5cdCAgfVxuXHRcblx0ICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3Jcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuXHQgIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IGVycm9yO1xuXHQgIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYyA9IHZvaWQgMDtcblx0ICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG5cdCAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgIGlmICghcGMpIHtcblx0ICAgICAgICBwYyA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIGVmZjtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSgpKTtcblx0fVxuXHRcblx0dmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuXHQgIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcblx0ICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfTtcblx0ICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcblx0ICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuXHQgIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXHRcblx0ICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuXHQgIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0ICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG5cdCAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG5cdCAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cdFxuXHQgICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuXHQgICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuXHQgICAgfVxuXHRcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcblx0ICB9O1xuXHQgIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG5cdCAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcblx0ICAvKipcblx0ICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG5cdCAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuXHQgICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuXHQgICoqL1xuXHQgIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgIC8qKlxuXHQgICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuXHQgICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG5cdCAgKiovXG5cdCAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG5cdCAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuXHQgIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cdFxuXHQgIC8qKlxuXHQgICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcblx0ICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG5cdCAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cblx0ICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuXHQgICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG5cdCAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgLyoqXG5cdCAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG5cdCAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcblx0ICAgICoqL1xuXHQgICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuXHQgICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcblx0ICAgICAgKiovXG5cdCAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuXHQgICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cblx0ICAqKi9cblx0ICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cdFxuXHQgIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcblx0ICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblx0XG5cdCAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuXHQgIG5leHQoKTtcblx0XG5cdCAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG5cdCAgcmV0dXJuIHRhc2s7XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuXHQgICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG5cdCAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG5cdCAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3Jvbmdcblx0ICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuXHQgICAgfVxuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuXHQgICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcblx0ICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG5cdCAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbmV4dC5jYW5jZWwoKTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcblx0ICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcblx0ICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcblx0ICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0ICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG5cdCAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG5cdCAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG5cdCAgICBpZiAoIWlzRXJyKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcblx0ICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcblx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGFzay5jb250KSB7XG5cdCAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcblx0ICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcblx0ICAgIH1cblx0ICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG5cdCAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuXHQgICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcblx0ICAgIH0pO1xuXHQgICAgdGFzay5qb2luZXJzID0gbnVsbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG5cdCAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHQgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG5cdCAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG5cdCAgICAqKi9cblx0ICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXHRcblx0ICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG5cdCAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHQgICAgICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG5cdCAgICAgIH1cblx0ICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICB9XG5cdCAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcblx0ICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG5cdCAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuXHQgICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG5cdCAgICAgICoqL1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyKTtcblx0ICAgICAgfVxuXHQgICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdFxuXHQgICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuXHQgICAgfTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuXHQgICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cblx0ICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cblx0ICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuXHQgICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG5cdCAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuXHQgICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG5cdCAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG5cdCAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcblx0ICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3Rcblx0ICAgICoqL1xuXHQgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cdCAgICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3Rcblx0ICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblx0XG5cdCAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcblx0ICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcblx0ICAgICk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuXHQgICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuXHQgICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuXHQgICAgICB9O1xuXHQgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG5cdCAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuXHQgICAgfVxuXHQgICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcblx0ICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG5cdCAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG5cdCAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblx0XG5cdCAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuXHQgICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcblx0ICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuXHQgICAgfTtcblx0ICAgIHRyeSB7XG5cdCAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcblx0ICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG5cdCAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG5cdCAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcblx0ICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG5cdCAgICAqKi9cblx0ICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG5cdCAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG5cdCAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcblx0ICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNC5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblx0XG5cdCAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY1LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXHRcblx0ICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuXHQgICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cdFxuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuXHQgICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuXHQgICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG5cdCAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY2LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuXHQgICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cdFxuXHQgICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuXHQgICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXHRcblx0ICAgICAgaWYgKGRldGFjaGVkKSB7XG5cdCAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IGZpbmFsbHkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcblx0ICAgIH1cblx0ICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuXHQgICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcblx0ICAgICAgfTtcblx0ICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuXHQgICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG5cdCAgICB9XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcblx0ICAgIH1cblx0ICAgIGNiKCk7XG5cdCAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0XG5cdCAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciByZXN1bHRzID0ge307XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcblx0ICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG5cdCAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgdmFyIF9yZXNwb25zZTtcblx0XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuXHQgICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuXHQgICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG5cdCAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcblx0ICAgICAgY2Ioc3RhdGUpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcblx0ICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcblx0ICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcblx0ICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuXHQgICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG5cdCAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG5cdCAgICBjaGFubmVsLmZsdXNoKGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcblx0ICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgY2IoKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG5cdCAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblx0XG5cdCAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuXHQgICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuXHQgICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcblx0ICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG5cdCAgICAgIH1cblx0ICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcblx0ICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG5cdCAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuXHQgICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcblx0ICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG5cdCAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuXHQgICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc2FwID0gYXNhcDtcblx0ZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHR2YXIgcXVldWUgPSBbXTtcblx0LyoqXG5cdCAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuXHQgIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3Rcblx0ICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuXHQgIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG5cdCAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuXHQqKi9cblx0dmFyIHNlbWFwaG9yZSA9IDA7XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG5cdCAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG5cdCAgc3RhdGUpLlxuXHQqKi9cblx0ZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG5cdCAgdHJ5IHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIHRhc2soKTtcblx0ICB9IGZpbmFsbHkge1xuXHQgICAgcmVsZWFzZSgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG5cdCoqL1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICBxdWV1ZS5wdXNoKHRhc2spO1xuXHRcblx0ICBpZiAoIXNlbWFwaG9yZSkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgZmx1c2goKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG5cdCAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuXHQqKi9cblx0ZnVuY3Rpb24gc3VzcGVuZCgpIHtcblx0ICBzZW1hcGhvcmUrKztcblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG5cdCAgc2VtYXBob3JlLS07XG5cdH1cblx0XG5cdC8qKlxuXHQgIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICByZWxlYXNlKCk7XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwO1xuXHQgIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgZXhlYyh0YXNrKTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnRha2UgPSB0YWtlO1xuXHRleHBvcnRzLnB1dCA9IHB1dDtcblx0ZXhwb3J0cy5hbGwgPSBhbGw7XG5cdGV4cG9ydHMucmFjZSA9IHJhY2U7XG5cdGV4cG9ydHMuY2FsbCA9IGNhbGw7XG5cdGV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblx0ZXhwb3J0cy5jcHMgPSBjcHM7XG5cdGV4cG9ydHMuZm9yayA9IGZvcms7XG5cdGV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcblx0ZXhwb3J0cy5qb2luID0gam9pbjtcblx0ZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5cdGV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuXHRleHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuXHRleHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHRleHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuXHRleHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG5cdHZhciBUQUtFID0gJ1RBS0UnO1xuXHR2YXIgUFVUID0gJ1BVVCc7XG5cdHZhciBBTEwgPSAnQUxMJztcblx0dmFyIFJBQ0UgPSAnUkFDRSc7XG5cdHZhciBDQUxMID0gJ0NBTEwnO1xuXHR2YXIgQ1BTID0gJ0NQUyc7XG5cdHZhciBGT1JLID0gJ0ZPUksnO1xuXHR2YXIgSk9JTiA9ICdKT0lOJztcblx0dmFyIENBTkNFTCA9ICdDQU5DRUwnO1xuXHR2YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG5cdHZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG5cdHZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcblx0dmFyIEZMVVNIID0gJ0ZMVVNIJztcblx0dmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcblx0dmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblx0XG5cdHZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cdFxuXHR2YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcblx0fTtcblx0XG5cdHZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG5cdCAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gdGFrZSgpIHtcblx0ICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xuXHR9XG5cdFxuXHR0YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHR2YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXHRcblx0ZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgYWN0aW9uID0gY2hhbm5lbDtcblx0ICAgIGNoYW5uZWwgPSBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcblx0fVxuXHRcblx0cHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblx0XG5cdCAgdmFyIGNvbnRleHQgPSBudWxsO1xuXHQgIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG5cdCAgICB2YXIgX2ZuID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuWzBdO1xuXHQgICAgZm4gPSBfZm5bMV07XG5cdCAgfSBlbHNlIGlmIChmbi5mbikge1xuXHQgICAgdmFyIF9mbjIgPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG5cdCAgICBmbiA9IF9mbjIuZm47XG5cdCAgfVxuXHQgIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuXHQgICAgZm4gPSBjb250ZXh0W2ZuXTtcblx0ICB9XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHRcblx0ICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FsbChmbikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuXHQgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3BzKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHQgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmb3JrKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHQgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNwYXduKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuXHQgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGpvaW4oKSB7XG5cdCAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG5cdCAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBqb2luKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuXHQgICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gY2FuY2VsKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuXHQgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcblx0ICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG5cdCAgfVxuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcblx0KiovXG5cdGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcblx0ICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcblx0ICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuXHQgIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcblx0ICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuXHQgICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuXHQgICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHR2YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuXHQgICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcblx0ICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuXHQgIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuXHQgIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuXHQgIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG5cdCAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcblx0ICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcblx0ICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuXHQgIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG5cdCAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG5cdCAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG5cdCAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG5cdCAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG5cdCAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuXHQgIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuXHQgIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDUpO1xuXHRcblx0dmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblx0XG5cdHZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTApO1xuXHRcblx0dmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG5cdCAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG5cdH07XG5cdFxuXHR2YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG5cdHZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcblx0dmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXHRcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0ZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXHR2YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuICdjaGFubmVsJztcblx0ICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdCAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuXHQgICAgfSkpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXHRcblx0ICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG5cdCAgICAgIHFOZXh0ID0gcTA7XG5cdFxuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuXHQgICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG5cdCAgICAgIHJldHVybiBkb25lO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChlcnJvcikge1xuXHQgICAgICBxTmV4dCA9IHFFbmQ7XG5cdCAgICAgIHRocm93IGVycm9yO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblx0XG5cdCAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuXHQgICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG5cdCAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuXHQgICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblx0XG5cdCAgICAgIHFOZXh0ID0gcTtcblx0ICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG5cdCAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuXHQgIH0sIG5hbWUsIHRydWUpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0ZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcblx0ZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcblx0ZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5cdGV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Mik7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHR2YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcblx0dmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcblx0ICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBlbWl0dGVyKCkge1xuXHQgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXHRcblx0ICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG5cdCAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuXHQgICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGFycltpXShpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0ICAgIGVtaXQ6IGVtaXRcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xuXHR2YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblx0XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2hhbm5lbCgpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cdFxuXHQgIHZhciBjbG9zZWQgPSBmYWxzZTtcblx0ICB2YXIgdGFrZXJzID0gW107XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXHRcblx0ICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcblx0ICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuXHQgICAgaWYgKGNsb3NlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuXHQgICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcblx0ICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHRha2UoY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihidWZmZXIudGFrZSgpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRha2Vycy5wdXNoKGNiKTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBmbHVzaChjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgaWYgKCFjbG9zZWQpIHtcblx0ICAgICAgY2xvc2VkID0gdHJ1ZTtcblx0ICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuXHQgICAgICAgIHRha2VycyA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICAgIGFycltpXShFTkQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBwdXQ6IHB1dCxcblx0ICAgIGZsdXNoOiBmbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZSxcblx0ICAgIGdldCBfX3Rha2Vyc19fKCkge1xuXHQgICAgICByZXR1cm4gdGFrZXJzO1xuXHQgICAgfSxcblx0ICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuXHQgICAgICByZXR1cm4gY2xvc2VkO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcblx0ICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblx0XG5cdCAgLyoqXG5cdCAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cblx0ICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuXHQgICoqL1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcblx0ICB9XG5cdFxuXHQgIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuXHQgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG5cdCAgICAgICAgdW5zdWJzY3JpYmUoKTtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLmNsb3NlKCk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG5cdCAgICAgIGNsb3NlKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjaGFuLnB1dChpbnB1dCk7XG5cdCAgfSk7XG5cdCAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgdW5zdWJzY3JpYmUoKTtcblx0ICB9XG5cdFxuXHQgIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IGNoYW4udGFrZSxcblx0ICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlXG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcblx0ICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG5cdCAgICAgICAgY2IoaW5wdXQpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG5cdCAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG5cdCAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4udGFrZShjYik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblx0XG5cdHZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG5cdHZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcblx0dmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcblx0dmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cdFxuXHR2YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXHRcblx0ZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcblx0ICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuXHQgIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG5cdCAgdmFyIGxlbmd0aCA9IDA7XG5cdCAgdmFyIHB1c2hJbmRleCA9IDA7XG5cdCAgdmFyIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG5cdCAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICBsZW5ndGgrKztcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgICBpZiAobGVuZ3RoICE9IDApIHtcblx0ICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcblx0ICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG5cdCAgICAgIGxlbmd0aC0tO1xuXHQgICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgIHJldHVybiBpdDtcblx0ICAgIH1cblx0ICB9O1xuXHRcblx0ICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHZhciBpdGVtcyA9IFtdO1xuXHQgICAgd2hpbGUgKGxlbmd0aCkge1xuXHQgICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlbXM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcblx0ICAgIH0sXG5cdCAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuXHQgICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcblx0ICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuXHQgICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcblx0ICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuXHQgICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXHRcblx0ICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXHRcblx0ICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcblx0ICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgLy8gRFJPUFxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBmbHVzaDogZmx1c2hcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcblx0ICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuXHQgICAgcmV0dXJuIHplcm9CdWZmZXI7XG5cdCAgfSxcblx0ICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG5cdCAgfSxcblx0ICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcblx0ICB9LFxuXHQgIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG5cdCAgfSxcblx0ICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDAsXG5cdCAgICAgIGFjdGlvbiA9IHZvaWQgMDtcblx0ICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuXHQgICAgcmV0dXJuIHRhc2sgPSB0O1xuXHQgIH07XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBjaGFubmVsID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG5cdCAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcblx0ICB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cdFxuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHQgIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9LFxuXHQgICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDczOSk7XG5cdFxuXHRmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cdFxuXHRmdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG5cdCAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcblx0ICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0XG5cdCAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuXHQgICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG5cdCAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblx0XG5cdCAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcblx0ICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cdFxuXHQgICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcblx0ICAgICAgY29udGV4dDogY29udGV4dCxcblx0ICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuXHQgICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuXHQgICAgICBvbkVycm9yOiBvbkVycm9yXG5cdCAgICB9KTtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuXHQgICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcblx0ICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG5cdCAgfTtcblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VtO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnB1dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnJhY2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hcHBseTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jcHM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZvcms7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zcGF3bjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uam9pbjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2VsZWN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZsdXNoO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBjb21wb3NlID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOTcpLmNvbXBvc2U7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmNvbXBvc2VXaXRoRGV2VG9vbHMgPSAoXG5cdCAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA/XG5cdCAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIDpcblx0ICAgIGZ1bmN0aW9uKCkge1xuXHQgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcblx0ICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSByZXR1cm4gY29tcG9zZTtcblx0ICAgICAgcmV0dXJuIGNvbXBvc2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0ICAgIH1cblx0KTtcblx0XG5cdGV4cG9ydHMuZGV2VG9vbHNFbmhhbmNlciA9IChcblx0ICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyA/XG5cdCAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyA6XG5cdCAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGZ1bmN0aW9uKG5vb3ApIHsgcmV0dXJuIG5vb3A7IH0gfVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XG5cdGV4cG9ydHMucmVkdWNlciA9IHJlZHVjZXI7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzcpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0dmFyIF9wdWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTYpO1xuXHRcblx0dmFyIF9wdWxsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B1bGwpO1xuXHRcblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzM2KTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHQvLyBpbml0aWFsIHN0YXRlXG5cdHZhciBpbml0aWFsU3RhdGUgPSB7XG5cdCAgICBzZWxlY3RBbGw6IHRydWUsXG5cdCAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICBlcnJvcjogbnVsbCxcblx0ICAgIHVzZXJJZDogbnVsbCxcblx0ICAgIGlzX3Jlc3RyaWN0ZWQ6IGZhbHNlLFxuXHQgICAgYWxsX3Byb2plY3RzOiBbXSxcblx0ICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuXHQgICAgb3JpZ2luYWxfcHJvamVjdHM6IG51bGxcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHJlZHVjZXIoKSB7XG5cdCAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGluaXRpYWxTdGF0ZTtcblx0ICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuXHQgICAgICAgIGNhc2UgYy5TRVRfU1RPUkU6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBkYXRhID0gYWN0aW9uLmRhdGE7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBkYXRhKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX0dFVF9JTklUOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX0dFVF9TVUNDRVNTOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX2FjdGlvbiRkYXRhID0gYWN0aW9uLmRhdGEsXG5cdCAgICAgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzID0gX2FjdGlvbiRkYXRhLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX2FjdGlvbiRkYXRhLnVzZXJfcHJvamVjdHM7XG5cdFxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgVXNlclByb2plY3RzIGRhdGFcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMucHJvamVjdHMgfHwgW10sXG5cdCAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogdXNlcl9wcm9qZWN0cyAmJiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQgfHwgZmFsc2Vcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfR0VUX0ZBSUxVUkU6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzOiBbXSxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBbXSxcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX1BVVF9JTklUOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IHRydWUsXG5cdCAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5BUElfUFVUX1NVQ0NFU1M6XG5cdCAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfdXNlcl9wcm9qZWN0cyA9IGFjdGlvbi5kYXRhLnVzZXJfcHJvamVjdHM7XG5cdFxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgbGlzdCBvZiBwcm9qZWN0cyBoZXJlLCB0byBzaW1wbGlmeSB0aGUgc3RvcmVcblx0ICAgICAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBfdXNlcl9wcm9qZWN0cy5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IF91c2VyX3Byb2plY3RzLnByb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsX3Byb2plY3RzOiBudWxsXG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICBjYXNlIGMuQVBJX1BVVF9GQUlMVVJFOlxuXHQgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IF9leHRlbmRzKHt9LCBzdGF0ZSkub3JpZ2luYWxfaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBfZXh0ZW5kcyh7fSwgc3RhdGUpLm9yaWdpbmFsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxfcHJvamVjdHM6IG51bGwsXG5cdCAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgY2FzZSBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTjpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIHByb2plY3RJZCA9IGFjdGlvbi5kYXRhLnByb2plY3RJZDtcblx0XG5cdCAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHQgICAgICAgICAgICAgICAgdmFyIF91c2VyX3Byb2plY3RzMiA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgKDAsIF91dGlscy5pbkFycmF5KShwcm9qZWN0SWQsIF91c2VyX3Byb2plY3RzMikgPyAoMCwgX3B1bGwyLmRlZmF1bHQpKF91c2VyX3Byb2plY3RzMiwgcHJvamVjdElkKSA6IF91c2VyX3Byb2plY3RzMi5wdXNoKHByb2plY3RJZCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IG9yaWdpbmFsX3Byb2plY3RzOiBvcmlnaW5hbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0czogX3VzZXJfcHJvamVjdHMyIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRDpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQgPSBfZXh0ZW5kcyh7fSwgc3RhdGUpLmlzX3Jlc3RyaWN0ZWQ7XG5cdCAgICAgICAgICAgICAgICB2YXIgaXNfcmVzdHJpY3RlZCA9IGFjdGlvbi5kYXRhLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgeyBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBvcmlnaW5hbF9pc19yZXN0cmljdGVkLCBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkIH0pO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgIGNhc2UgYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUzpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgdmFyIF9vcmlnaW5hbF9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdCAgICAgICAgICAgICAgICB2YXIgX3VzZXJfcHJvamVjdHMzID0gdm9pZCAwLFxuXHQgICAgICAgICAgICAgICAgICAgIF9zdGF0ZSA9IF9leHRlbmRzKHt9LCBzdGF0ZSksXG5cdCAgICAgICAgICAgICAgICAgICAgc2VsZWN0QWxsID0gX3N0YXRlLnNlbGVjdEFsbDtcblx0ICAgICAgICAgICAgICAgIGlmIChzZWxlY3RBbGwpIHtcblx0ICAgICAgICAgICAgICAgICAgICBfdXNlcl9wcm9qZWN0czMgPSBzdGF0ZS5hbGxfcHJvamVjdHMubWFwKGZ1bmN0aW9uIChwcm9qZWN0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0LmlkO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBfdXNlcl9wcm9qZWN0czMgPSBbXTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHNlbGVjdEFsbCA9ICFzZWxlY3RBbGw7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IHNlbGVjdEFsbDogc2VsZWN0QWxsLCBvcmlnaW5hbF9wcm9qZWN0czogX29yaWdpbmFsX3Byb2plY3RzLCB1c2VyX3Byb2plY3RzOiBfdXNlcl9wcm9qZWN0czMgfSk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuXHQgICAgICAgICAgICB9XG5cdCAgICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVJlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1NyksXG5cdCAgICBwdWxsQWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjQpO1xuXHRcblx0LyoqXG5cdCAqIFJlbW92ZXMgYWxsIGdpdmVuIHZhbHVlcyBmcm9tIGBhcnJheWAgdXNpbmdcblx0ICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcblx0ICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuXHQgKlxuXHQgKiAqKk5vdGU6KiogVW5saWtlIGBfLndpdGhvdXRgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuIFVzZSBgXy5yZW1vdmVgXG5cdCAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgMi4wLjBcblx0ICogQGNhdGVnb3J5IEFycmF5XG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG5cdCAqXG5cdCAqIF8ucHVsbChhcnJheSwgJ2EnLCAnYycpO1xuXHQgKiBjb25zb2xlLmxvZyhhcnJheSk7XG5cdCAqIC8vID0+IFsnYicsICdiJ11cblx0ICovXG5cdHZhciBwdWxsID0gYmFzZVJlc3QocHVsbEFsbCk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHB1bGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgaWRlbnRpdHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzOSksXG5cdCAgICBvdmVyUmVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzU4KSxcblx0ICAgIHNldFRvU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjApO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG5cdCAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXBwbHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1OSk7XG5cdFxuXHQvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG5cdHZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblx0XG5cdC8qKlxuXHQgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuXHQgIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcblx0ICAgICAgICBpbmRleCA9IC0xLFxuXHQgICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcblx0ICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cdFxuXHQgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcblx0ICAgIH1cblx0ICAgIGluZGV4ID0gLTE7XG5cdCAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcblx0ICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcblx0ICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuXHQgICAgfVxuXHQgICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG5cdCAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2Bcblx0ICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuXHQgKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cblx0ICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cblx0ICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG5cdCAqL1xuXHRmdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG5cdCAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuXHQgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuXHQgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuXHQgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHQgICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuXHQgIH1cblx0ICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlU2V0VG9TdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MSksXG5cdCAgICBzaG9ydE91dCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYzKTtcblx0XG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG5cdCAqL1xuXHR2YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBjb25zdGFudCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYyKSxcblx0ICAgIGRlZmluZVByb3BlcnR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMjgpLFxuXHQgICAgaWRlbnRpdHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzOSk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG5cdCAqL1xuXHR2YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcblx0ICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuXHQgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG5cdCAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuXHQgICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcblx0ICAgICd3cml0YWJsZSc6IHRydWVcblx0ICB9KTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgMi40LjBcblx0ICogQGNhdGVnb3J5IFV0aWxcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcblx0ICpcblx0ICogY29uc29sZS5sb2cob2JqZWN0cyk7XG5cdCAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuXHQgKlxuXHQgKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcblx0ICogLy8gPT4gdHJ1ZVxuXHQgKi9cblx0ZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gdmFsdWU7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cblx0dmFyIEhPVF9DT1VOVCA9IDgwMCxcblx0ICAgIEhPVF9TUEFOID0gMTY7XG5cdFxuXHQvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG5cdHZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcblx0ICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG5cdCAqIG1pbGxpc2Vjb25kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcblx0ICB2YXIgY291bnQgPSAwLFxuXHQgICAgICBsYXN0Q2FsbGVkID0gMDtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG5cdCAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblx0XG5cdCAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG5cdCAgICBpZiAocmVtYWluaW5nID4gMCkge1xuXHQgICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcblx0ICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjb3VudCA9IDA7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlUHVsbEFsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY1KTtcblx0XG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICpcblx0ICogKipOb3RlOioqIFVubGlrZSBgXy5kaWZmZXJlbmNlYCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSA0LjAuMFxuXHQgKiBAY2F0ZWdvcnkgQXJyYXlcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuXHQgKlxuXHQgKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuXHQgKiBjb25zb2xlLmxvZyhhcnJheSk7XG5cdCAqIC8vID0+IFsnYicsICdiJ11cblx0ICovXG5cdGZ1bmN0aW9uIHB1bGxBbGwoYXJyYXksIHZhbHVlcykge1xuXHQgIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoICYmIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoKVxuXHQgICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuXHQgICAgOiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBwdWxsQWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFycmF5TWFwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MzQpLFxuXHQgICAgYmFzZUluZGV4T2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NiksXG5cdCAgICBiYXNlSW5kZXhPZldpdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MCksXG5cdCAgICBiYXNlVW5hcnkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM1NiksXG5cdCAgICBjb3B5QXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MSk7XG5cdFxuXHQvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG5cdHZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXHRcblx0LyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG5cdHZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQWxsQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcblx0ICogc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuXHQgIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuXHQgICAgICBpbmRleCA9IC0xLFxuXHQgICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuXHQgICAgICBzZWVuID0gYXJyYXk7XG5cdFxuXHQgIGlmIChhcnJheSA9PT0gdmFsdWVzKSB7XG5cdCAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcblx0ICB9XG5cdCAgaWYgKGl0ZXJhdGVlKSB7XG5cdCAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuXHQgIH1cblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgdmFyIGZyb21JbmRleCA9IDAsXG5cdCAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdLFxuXHQgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblx0XG5cdCAgICB3aGlsZSAoKGZyb21JbmRleCA9IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIGZyb21JbmRleCwgY29tcGFyYXRvcikpID4gLTEpIHtcblx0ICAgICAgaWYgKHNlZW4gIT09IGFycmF5KSB7XG5cdCAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcblx0ICAgICAgfVxuXHQgICAgICBzcGxpY2UuY2FsbChhcnJheSwgZnJvbUluZGV4LCAxKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VQdWxsQWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VGaW5kSW5kZXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NyksXG5cdCAgICBiYXNlSXNOYU4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OCksXG5cdCAgICBzdHJpY3RJbmRleE9mID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjkpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcblx0ICByZXR1cm4gdmFsdWUgPT09IHZhbHVlXG5cdCAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG5cdCAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG5cdCAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuXHQgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG5cdCAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cdFxuXHQgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG5cdCAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuXHQgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmFOO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcblx0ICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG5cdCAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcblx0ICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGJhc2VJbmRleE9mYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSW5kZXhPZldpdGgoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpIHtcblx0ICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuXHQgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoY29tcGFyYXRvcihhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZldpdGg7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuXHQgIHZhciBpbmRleCA9IC0xLFxuXHQgICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXHRcblx0ICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcblx0ICB9XG5cdCAgcmV0dXJuIGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0ZXhwb3J0cy53YXRjaGVyU2FnYSA9IHdhdGNoZXJTYWdhO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0dmFyIF9heGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzczKTtcblx0XG5cdHZhciBfYXhpb3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXhpb3MpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyNCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBfbWFya2VkID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKGdldFNhZ2EpLFxuXHQgICAgX21hcmtlZDIgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsocHV0U2FnYSksXG5cdCAgICBfbWFya2VkMyA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayh3YXRjaGVyU2FnYSk7IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHRmdW5jdGlvbiBmZXRjaERhdGEodXNlcklkKSB7XG5cdCAgICByZXR1cm4gKDAsIF9heGlvczIuZGVmYXVsdCkoe1xuXHQgICAgICAgIG1ldGhvZDogXCJnZXRcIixcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIlxuXHQgICAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKSB7XG5cdCAgICByZXR1cm4gKDAsIF9heGlvczIuZGVmYXVsdCkoe1xuXHQgICAgICAgIG1ldGhvZDogXCJwdXRcIixcblx0ICAgICAgICBoZWFkZXJzOiB7XG5cdCAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogKDAsIF91dGlscy5nZXRDb29raWUpKFwiY3NyZnRva2VuXCIpXG5cdCAgICAgICAgfSxcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIixcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBwcm9qZWN0czogdXNlcl9wcm9qZWN0c1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCByZXNwb25zZSwgZGF0YTtcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBnZXRTYWdhJChfY29udGV4dCkge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBhY3Rpb24uZGF0YS51c2VySWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQucHJldiA9IDE7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShmZXRjaERhdGEsIHVzZXJJZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX2NvbnRleHQuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuZGF0YTtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gODtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfU1VDQ0VTUywgZGF0YTogZGF0YSB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDE0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQucHJldiA9IDEwO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0LnQwID0gX2NvbnRleHRbXCJjYXRjaFwiXSgxKTtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX0ZBSUxVUkUsIGVycm9yOiBfY29udGV4dC50MCB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE0OlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LCBfbWFya2VkLCB0aGlzLCBbWzEsIDEwXV0pO1xuXHR9XG5cdFxuXHR2YXIgZ2V0VXNlcklkID0gZnVuY3Rpb24gZ2V0VXNlcklkKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUudXNlcklkO1xuXHR9O1xuXHR2YXIgZ2V0VXNlclByb2plY3RzID0gZnVuY3Rpb24gZ2V0VXNlclByb2plY3RzKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUudXNlcl9wcm9qZWN0cztcblx0fTtcblx0dmFyIGdldElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIGdldElzUmVzdHJpY3RlZChzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBwdXRTYWdhKGFjdGlvbikge1xuXHQgICAgdmFyIHVzZXJJZCwgaXNfcmVzdHJpY3RlZCwgdXNlcl9wcm9qZWN0cywgcmVzcG9uc2UsIGRhdGE7XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gcHV0U2FnYSQoX2NvbnRleHQyKSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLnByZXYgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA1O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRVc2VySWQpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDg7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldElzUmVzdHJpY3RlZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDExO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRVc2VyUHJvamVjdHMpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTE6XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShwdXREYXRhLCB1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuZGF0YTtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDE4O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9TVUNDRVNTLCBkYXRhOiBkYXRhIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTg6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyNDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5wcmV2ID0gMjA7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLnQwID0gX2NvbnRleHQyW1wiY2F0Y2hcIl0oMCk7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfRkFJTFVSRSwgZXJyb3I6IF9jb250ZXh0Mi50MCB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI0OlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDIsIHRoaXMsIFtbMCwgMjBdXSk7XG5cdH1cblx0XG5cdC8vIHdhdGNoZXIgc2FnYTogd2F0Y2hlcyBmb3IgYWN0aW9ucyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSwgc3RhcnRzIHdvcmtlciBzYWdhXG5cdGZ1bmN0aW9uIHdhdGNoZXJTYWdhKCkge1xuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIHdhdGNoZXJTYWdhJChfY29udGV4dDMpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDI7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA2OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gODtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQzLCB0aGlzKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzczOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzQpO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIGJpbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nik7XG5cdHZhciBBeGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc4KTtcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcblx0ICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcblx0ICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblx0XG5cdCAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2Vcblx0ICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cdFxuXHQgIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuXHQgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cdFxuXHQgIHJldHVybiBpbnN0YW5jZTtcblx0fVxuXHRcblx0Ly8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5cdHZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblx0XG5cdC8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuXHRheGlvcy5BeGlvcyA9IEF4aW9zO1xuXHRcblx0Ly8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuXHRheGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcblx0ICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG5cdH07XG5cdFxuXHQvLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cblx0YXhpb3MuQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRheGlvcy5DYW5jZWxUb2tlbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzk3KTtcblx0YXhpb3MuaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Myk7XG5cdFxuXHQvLyBFeHBvc2UgYWxsL3NwcmVhZFxuXHRheGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcblx0ICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHR9O1xuXHRheGlvcy5zcHJlYWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OCk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXHRcblx0Ly8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5cdG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBiaW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHR2YXIgaXNCdWZmZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Nyk7XG5cdFxuXHQvKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblx0XG5cdC8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cdFxuXHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcblx0ICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG5cdCAgdmFyIHJlc3VsdDtcblx0ICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG5cdCAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuXHQgIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuXHQgIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuXHQgKi9cblx0ZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0ICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG5cdCAqXG5cdCAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG5cdCAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cblx0ICpcblx0ICogd2ViIHdvcmtlcnM6XG5cdCAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuXHQgKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuXHQgKlxuXHQgKiByZWFjdC1uYXRpdmU6XG5cdCAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgcmV0dXJuIChcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG5cdCAgKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG5cdCAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuXHQgKlxuXHQgKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuXHQgKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0ICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcblx0ICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHRcblx0ICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcblx0ICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgb2JqID0gW29ial07XG5cdCAgfVxuXHRcblx0ICBpZiAoaXNBcnJheShvYmopKSB7XG5cdCAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuXHQgICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cblx0ICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG5cdCAqXG5cdCAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG5cdCAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cblx0ICpcblx0ICogRXhhbXBsZTpcblx0ICpcblx0ICogYGBganNcblx0ICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuXHQgKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcblx0ICovXG5cdGZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuXHQgIHZhciByZXN1bHQgPSB7fTtcblx0ICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuXHQgIH1cblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcblx0ICovXG5cdGZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG5cdCAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuXHQgICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBhW2tleV0gPSB2YWw7XG5cdCAgICB9XG5cdCAgfSk7XG5cdCAgcmV0dXJuIGE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgIGlzQXJyYXk6IGlzQXJyYXksXG5cdCAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcblx0ICBpc0J1ZmZlcjogaXNCdWZmZXIsXG5cdCAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcblx0ICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG5cdCAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuXHQgIGlzTnVtYmVyOiBpc051bWJlcixcblx0ICBpc09iamVjdDogaXNPYmplY3QsXG5cdCAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuXHQgIGlzRGF0ZTogaXNEYXRlLFxuXHQgIGlzRmlsZTogaXNGaWxlLFxuXHQgIGlzQmxvYjogaXNCbG9iLFxuXHQgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG5cdCAgaXNTdHJlYW06IGlzU3RyZWFtLFxuXHQgIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcblx0ICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG5cdCAgZm9yRWFjaDogZm9yRWFjaCxcblx0ICBtZXJnZTogbWVyZ2UsXG5cdCAgZXh0ZW5kOiBleHRlbmQsXG5cdCAgdHJpbTogdHJpbVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG5cdCAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHQgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiFcblx0ICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuXHQgKlxuXHQgKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuXHQgKiBAbGljZW5zZSAgTUlUXG5cdCAqL1xuXHRcblx0Ly8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuXHQvLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcblx0ICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxuXHR9XG5cdFxuXHQvLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuXHRmdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuXHQgIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxuXHR9XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0dmFyIEludGVyY2VwdG9yTWFuYWdlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzkwKTtcblx0dmFyIGRpc3BhdGNoUmVxdWVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzkxKTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRmdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuXHQgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcblx0ICB0aGlzLmludGVyY2VwdG9ycyA9IHtcblx0ICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcblx0ICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcblx0ICB9O1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGlzcGF0Y2ggYSByZXF1ZXN0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuXHQgKi9cblx0QXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcblx0ICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcblx0ICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcblx0ICAgICAgdXJsOiBhcmd1bWVudHNbMF1cblx0ICAgIH0sIGFyZ3VtZW50c1sxXSk7XG5cdCAgfVxuXHRcblx0ICBjb25maWcgPSB1dGlscy5tZXJnZShkZWZhdWx0cywge21ldGhvZDogJ2dldCd9LCB0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXHQgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHQgIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcblx0ICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXHQgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cdFxuXHQgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuXHQgICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcblx0ICB9KTtcblx0XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcblx0ICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG5cdCAgfSk7XG5cdFxuXHQgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcblx0ICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblx0XG5cdC8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xuXHR1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybFxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcblx0ICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXHQgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcblx0ICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG5cdCAgICAgIG1ldGhvZDogbWV0aG9kLFxuXHQgICAgICB1cmw6IHVybCxcblx0ICAgICAgZGF0YTogZGF0YVxuXHQgICAgfSkpO1xuXHQgIH07XG5cdH0pO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHR2YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzgwKTtcblx0XG5cdHZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcblx0ICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuXHQgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG5cdCAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG5cdCAgdmFyIGFkYXB0ZXI7XG5cdCAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MSk7XG5cdCAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcblx0ICAgIGFkYXB0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MSk7XG5cdCAgfVxuXHQgIHJldHVybiBhZGFwdGVyO1xuXHR9XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdCAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblx0XG5cdCAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuXHQgICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG5cdCAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcblx0ICAgICkge1xuXHQgICAgICByZXR1cm4gZGF0YTtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuXHQgICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcblx0ICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuXHQgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG5cdCAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG5cdCAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBkYXRhO1xuXHQgIH1dLFxuXHRcblx0ICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcblx0ICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHQgICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZGF0YTtcblx0ICB9XSxcblx0XG5cdCAgLyoqXG5cdCAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG5cdCAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cblx0ICAgKi9cblx0ICB0aW1lb3V0OiAwLFxuXHRcblx0ICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuXHQgIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblx0XG5cdCAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cdFxuXHQgIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcblx0ICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcblx0ICB9XG5cdH07XG5cdFxuXHRkZWZhdWx0cy5oZWFkZXJzID0ge1xuXHQgIGNvbW1vbjoge1xuXHQgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG5cdCAgfVxuXHR9O1xuXHRcblx0dXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuXHQgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xuXHR9KTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG5cdCAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xuXHR9KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cdFxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG5cdCAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG5cdCAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG5cdCAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG5cdCAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciBzZXR0bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Mik7XG5cdHZhciBidWlsZFVSTCA9IF9fd2VicGFja19yZXF1aXJlX18oNzg1KTtcblx0dmFyIHBhcnNlSGVhZGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg2KTtcblx0dmFyIGlzVVJMU2FtZU9yaWdpbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzg3KTtcblx0dmFyIGNyZWF0ZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODMpO1xuXHR2YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcblx0ICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG5cdCAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblx0XG5cdCAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcblx0ICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuXHQgICAgfVxuXHRcblx0ICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdCAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG5cdCAgICB2YXIgeERvbWFpbiA9IGZhbHNlO1xuXHRcblx0ICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG5cdCAgICAvLyBPbmx5IHN1cHBvcnRzIFBPU1QgYW5kIEdFVCBjYWxscyBhbmQgZG9lc24ndCByZXR1cm5zIHRoZSByZXNwb25zZSBoZWFkZXJzLlxuXHQgICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuXHQgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG5cdCAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcblx0ICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG5cdCAgICAgIHJlcXVlc3QgPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cdCAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuXHQgICAgICB4RG9tYWluID0gdHJ1ZTtcblx0ICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7fTtcblx0ICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuXHQgICAgaWYgKGNvbmZpZy5hdXRoKSB7XG5cdCAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuXHQgICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcblx0ICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcblx0ICAgIH1cblx0XG5cdCAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXHRcblx0ICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG5cdCAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblx0XG5cdCAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG5cdCAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuXHQgICAgICBpZiAoIXJlcXVlc3QgfHwgKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCAmJiAheERvbWFpbikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuXHQgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuXHQgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuXHQgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG5cdCAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2Vcblx0ICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuXHQgICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHQgICAgICB2YXIgcmVzcG9uc2UgPSB7XG5cdCAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuXHQgICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuXHQgICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiByZXF1ZXN0LnN0YXR1cyxcblx0ICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcblx0ICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG5cdCAgICAgICAgY29uZmlnOiBjb25maWcsXG5cdCAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuXHQgICAgICB9O1xuXHRcblx0ICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuXHQgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG5cdCAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuXHQgICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3Jcblx0ICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBIYW5kbGUgdGltZW91dFxuXHQgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuXHQgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcblx0ICAgICAgICByZXF1ZXN0KSk7XG5cdFxuXHQgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cdCAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgfTtcblx0XG5cdCAgICAvLyBBZGQgeHNyZiBoZWFkZXJcblx0ICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuXHQgICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblx0ICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG5cdCAgICAgIHZhciBjb29raWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODkpO1xuXHRcblx0ICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG5cdCAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG5cdCAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG5cdCAgICAgICAgICB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICBpZiAoeHNyZlZhbHVlKSB7XG5cdCAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG5cdCAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcblx0ICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuXHQgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuXHQgICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuXHQgICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG5cdCAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXHQgICAgaWYgKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpIHtcblx0ICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblx0ICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuXHQgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuXHQgICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG5cdCAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuXHQgICAgICAgICAgdGhyb3cgZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG5cdCAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG5cdCAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcblx0ICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuXHQgICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG5cdCAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG5cdCAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG5cdCAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICAgIHJlcXVlc3QgPSBudWxsO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuXHQgICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcblx0ICB9KTtcblx0fTtcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgY3JlYXRlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdFxuXHQvKipcblx0ICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG5cdCAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG5cdCAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcblx0ICAgIHJlc29sdmUocmVzcG9uc2UpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWplY3QoY3JlYXRlRXJyb3IoXG5cdCAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG5cdCAgICAgIHJlc3BvbnNlLmNvbmZpZyxcblx0ICAgICAgbnVsbCxcblx0ICAgICAgcmVzcG9uc2UucmVxdWVzdCxcblx0ICAgICAgcmVzcG9uc2Vcblx0ICAgICkpO1xuXHQgIH1cblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBlbmhhbmNlRXJyb3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NCk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdCAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cblx0ICpcblx0ICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcblx0ICBlcnJvci5jb25maWcgPSBjb25maWc7XG5cdCAgaWYgKGNvZGUpIHtcblx0ICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuXHQgIH1cblx0ICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcblx0ICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuXHQgIHJldHVybiBlcnJvcjtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdGZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcblx0ICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG5cdCAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG5cdCAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG5cdCAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cblx0ICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cblx0ICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuXHQgICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuXHQgICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuXHQgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuXHQgIGlmICghcGFyYW1zKSB7XG5cdCAgICByZXR1cm4gdXJsO1xuXHQgIH1cblx0XG5cdCAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG5cdCAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHZhciBwYXJ0cyA9IFtdO1xuXHRcblx0ICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcblx0ICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuXHQgICAgICAgIGtleSA9IGtleSArICdbXSc7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFsID0gW3ZhbF07XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcblx0ICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG5cdCAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcblx0ICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdFxuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG5cdCAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gdXJsO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0Ly8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcblx0Ly8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xuXHR2YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG5cdCAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcblx0ICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG5cdCAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuXHQgICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5cdF07XG5cdFxuXHQvKipcblx0ICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuXHQgKlxuXHQgKiBgYGBcblx0ICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcblx0ICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG5cdCAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcblx0ICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcblx0ICogYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcblx0ICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3Rcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICB2YXIgcGFyc2VkID0ge307XG5cdCAgdmFyIGtleTtcblx0ICB2YXIgdmFsO1xuXHQgIHZhciBpO1xuXHRcblx0ICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXHRcblx0ICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuXHQgICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuXHQgICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcblx0ICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblx0XG5cdCAgICBpZiAoa2V5KSB7XG5cdCAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcblx0ICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gcGFyc2VkO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSAoXG5cdCAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cdFxuXHQgIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuXHQgIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuXHQgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdCAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdCAgICB2YXIgb3JpZ2luVVJMO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuXHQgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgKi9cblx0ICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG5cdCAgICAgIHZhciBocmVmID0gdXJsO1xuXHRcblx0ICAgICAgaWYgKG1zaWUpIHtcblx0ICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG5cdCAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdCAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHRcblx0ICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuXHQgICAgICByZXR1cm4ge1xuXHQgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG5cdCAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcblx0ICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuXHQgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcblx0ICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuXHQgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcblx0ICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuXHQgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cblx0ICAgICAgICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuXHQgICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHRcblx0ICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXHRcblx0ICAgIC8qKlxuXHQgICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuXHQgICAgKlxuXHQgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3Rcblx0ICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuXHQgICAgKi9cblx0ICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuXHQgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuXHQgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG5cdCAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG5cdCAgICB9O1xuXHQgIH0pKCkgOlxuXHRcblx0ICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuXHQgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH07XG5cdCAgfSkoKVxuXHQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0Ly8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cdFxuXHR2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXHRcblx0ZnVuY3Rpb24gRSgpIHtcblx0ICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcblx0fVxuXHRFLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcblx0RS5wcm90b3R5cGUuY29kZSA9IDU7XG5cdEUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblx0XG5cdGZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcblx0ICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcblx0ICB2YXIgb3V0cHV0ID0gJyc7XG5cdCAgZm9yIChcblx0ICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG5cdCAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycztcblx0ICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcblx0ICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG5cdCAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG5cdCAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuXHQgICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcblx0ICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuXHQgICkge1xuXHQgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuXHQgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuXHQgICAgICB0aHJvdyBuZXcgRSgpO1xuXHQgICAgfVxuXHQgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG5cdCAgfVxuXHQgIHJldHVybiBvdXRwdXQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gKFxuXHQgIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXHRcblx0ICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcblx0ICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuXHQgICAgICAgIHZhciBjb29raWUgPSBbXTtcblx0ICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG5cdCAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcblx0ICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuXHQgICAgICB9LFxuXHRcblx0ICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuXHQgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSkoKSA6XG5cdFxuXHQgIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cblx0ICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG5cdCAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuXHQgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG5cdCAgICB9O1xuXHQgIH0pKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdGZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcblx0ICB0aGlzLmhhbmRsZXJzID0gW107XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcblx0ICpcblx0ICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuXHQgKi9cblx0SW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuXHQgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG5cdCAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcblx0ICAgIHJlamVjdGVkOiByZWplY3RlZFxuXHQgIH0pO1xuXHQgIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG5cdH07XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuXHQgIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuXHQgICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuXHQgKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuXHQgKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3Jcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcblx0ICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcblx0ICAgIGlmIChoICE9PSBudWxsKSB7XG5cdCAgICAgIGZuKGgpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NSk7XG5cdHZhciB0cmFuc2Zvcm1EYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTIpO1xuXHR2YXIgaXNDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Myk7XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIGlzQWJzb2x1dGVVUkwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NCk7XG5cdHZhciBjb21iaW5lVVJMcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzk1KTtcblx0XG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcblx0ICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG5cdCAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuXHQgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuXHQgIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuXHQgICAgY29uZmlnLnVybCA9IGNvbWJpbmVVUkxzKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcblx0ICB9XG5cdFxuXHQgIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG5cdCAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblx0XG5cdCAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuXHQgIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgIGNvbmZpZy5kYXRhLFxuXHQgICAgY29uZmlnLmhlYWRlcnMsXG5cdCAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuXHQgICk7XG5cdFxuXHQgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuXHQgIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG5cdCAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG5cdCAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG5cdCAgKTtcblx0XG5cdCAgdXRpbHMuZm9yRWFjaChcblx0ICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuXHQgICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG5cdCAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuXHQgICAgfVxuXHQgICk7XG5cdFxuXHQgIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblx0XG5cdCAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcblx0ICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXHQgICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICAgIHJlc3BvbnNlLmRhdGEsXG5cdCAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG5cdCAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgKTtcblx0XG5cdCAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuXHQgICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG5cdCAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblx0XG5cdCAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cdCAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG5cdCAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG5cdCAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcblx0ICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuXHQgICAgICAgICk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcblx0ICB9KTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KTtcblx0XG5cdC8qKlxuXHQgKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuXHQgKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuXHQgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG5cdCAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG5cdCAgfSk7XG5cdFxuXHQgIHJldHVybiBkYXRhO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuXHQgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuXHQgIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cblx0ICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcblx0ICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cblx0ICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcblx0ICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuXHQgIHJldHVybiByZWxhdGl2ZVVSTFxuXHQgICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcblx0ICAgIDogYmFzZVVSTDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cblx0ICpcblx0ICogQGNsYXNzXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG5cdCAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xuXHR9O1xuXHRcblx0Q2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIENhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzk2KTtcblx0XG5cdC8qKlxuXHQgKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuXHQgKlxuXHQgKiBAY2xhc3Ncblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcblx0ICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG5cdCAgfVxuXHRcblx0ICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cdCAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcblx0ICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcblx0ICB9KTtcblx0XG5cdCAgdmFyIHRva2VuID0gdGhpcztcblx0ICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuXHQgICAgaWYgKHRva2VuLnJlYXNvbikge1xuXHQgICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHRcblx0ICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG5cdCAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cblx0ICovXG5cdENhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcblx0ICBpZiAodGhpcy5yZWFzb24pIHtcblx0ICAgIHRocm93IHRoaXMucmVhc29uO1xuXHQgIH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG5cdCAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG5cdCAqL1xuXHRDYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG5cdCAgdmFyIGNhbmNlbDtcblx0ICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuXHQgICAgY2FuY2VsID0gYztcblx0ICB9KTtcblx0ICByZXR1cm4ge1xuXHQgICAgdG9rZW46IHRva2VuLFxuXHQgICAgY2FuY2VsOiBjYW5jZWxcblx0ICB9O1xuXHR9O1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8qKlxuXHQgKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuXHQgKlxuXHQgKiAgYGBganNcblx0ICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cblx0ICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuXHQgKiAgZi5hcHBseShudWxsLCBhcmdzKTtcblx0ICogIGBgYFxuXHQgKlxuXHQgKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cblx0ICpcblx0ICogIGBgYGpzXG5cdCAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG5cdCAqICBgYGBcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcblx0ICogQHJldHVybnMge0Z1bmN0aW9ufVxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcblx0ICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuXHQgIH07XG5cdH07XG5cblxuLyoqKi8gfSlcblxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCIvKlxuIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XG5cbmltcG9ydCBBcHAgZnJvbSBcIi4vY29tcG9uZW50cy9BcHBcIjtcblxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSB9IGZyb20gXCJyZWR1eFwiO1xuaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXCJyZWR1eC1zYWdhXCI7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IHsgY29tcG9zZVdpdGhEZXZUb29scyB9IGZyb20gJ3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvbic7XG5cbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tIFwiLi9yZWR1Y2VyXCI7XG5pbXBvcnQgeyB3YXRjaGVyU2FnYSB9IGZyb20gXCIuL3NhZ2FzXCI7XG5cbi8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5jb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKCk7XG5cblxuLy8gZGV2IHRvb2xzIG1pZGRsZXdhcmVcbmNvbnN0IHJlZHV4RGV2VG9vbHMgPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpO1xuXG5sZXQgc3RvcmU7XG5pZiAocmVkdXhEZXZUb29scykge1xuICAgIHN0b3JlICA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGNvbXBvc2UoYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSwgcmVkdXhEZXZUb29scykpXG59IGVsc2Uge1xuICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSk7XG59XG5cbnNhZ2FNaWRkbGV3YXJlLnJ1bih3YXRjaGVyU2FnYSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgICAgICA8QXBwIC8+XG4gICAgICAgIDwvUHJvdmlkZXI+LFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJQcm9qZWN0c1wiKVxuICAgICk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2FwcC5qcyIsIi8qXG4gICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgeyBfLCBkYXRhRnJvbUVsZW1lbnQsIGluQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi4vY29uc3RcIjtcblxuY29uc3QgSXNSZXN0cmljdGVkID0gKHsgXywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZD1cImlzX3Jlc3RyaWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2VJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7XyhcInJlc3RyaWN0X2FjY2Vzc1wiKX1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufTtcblxuY29uc3QgUHJvamVjdCA9ICh7IF8sIHByb2plY3QsIHVzZXJfcHJvamVjdHMsIGlzX3Jlc3RyaWN0ZWQsIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkIH0pID0+IHtcbiAgICBjb25zdCBjaGVja2VkID0gdXNlcl9wcm9qZWN0cyAmJiBpbkFycmF5KHByb2plY3QuaWQsIHVzZXJfcHJvamVjdHMpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0clxuICAgICAgICAgICAga2V5PXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2hlY2tlZCA/IFwicHJvamVjdFNlbGVjdGVkXCIgOiB1bmRlZmluZWR9XG4gICAgICAgID5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQ+e3Byb2plY3QuaWR9PC90ZD5cbiAgICAgICAgICAgIDx0ZD57cHJvamVjdC50aXRsZSB8fCBfKFwibm9fdGl0bGVcIil9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICApO1xufTtcblxuY29uc3QgU2VsZWN0QWxsID0gKHsgXywgc2VsZWN0QWxsLCBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGlzX3Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtpc19yZXN0cmljdGVkID8gdW5kZWZpbmVkIDogXCJkaXNhYmxlZFwifT5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsfSBkaXNhYmxlZD17aXNfcmVzdHJpY3RlZCA/IGZhbHNlIDogdHJ1ZX0+XG4gICAgICAgICAgICAgICAge3NlbGVjdEFsbCA/IF8oXCJzZWxlY3RfYWxsXCIpIDogXyhcImRlc2VsZWN0X2FsbFwiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuY29uc3QgUHJvamVjdHMgPSAoe1xuICAgIF8sXG4gICAgYWxsX3Byb2plY3RzLFxuICAgIHVzZXJfcHJvamVjdHMsXG4gICAgaXNfcmVzdHJpY3RlZCxcbiAgICBzZWxlY3RBbGwsXG4gICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkXG59KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8SXNSZXN0cmljdGVkXG4gICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkPXtpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkPXtvbkNoYW5nZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8U2VsZWN0QWxsXG4gICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICBzZWxlY3RBbGw9e3NlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw9e29uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkPXtpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9e2lzX3Jlc3RyaWN0ZWQgPyB1bmRlZmluZWQgOiBcImRpc2FibGVkXCJ9PlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPntfKFwiY2FuX2FjY2Vzc1wiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPntfKFwicHJvamVjdF9pZFwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPntfKFwicHJvamVjdF90aXRsZVwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7YWxsX3Byb2plY3RzLm1hcChwcm9qZWN0ID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQcm9qZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdD17cHJvamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzPXt1c2VyX3Byb2plY3RzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ9e29uQ2hhbmdlUHJvamVjdFNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkID0gdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQgPSB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fID0gdGhpcy5fLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNsYXRpb24gaGFuZGxpbmdcbiAgICBfKHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc3RyaW5ncyAmJiB0aGlzLnByb3BzLnN0cmluZ3Nbc107XG4gICAgfVxuXG4gICAgdG9nZ2xlSXNSZXN0cmljdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZUlzUmVzdHJpY3RlZChlLnRhcmdldC5jaGVja2VkKTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgaWYgKCF0YXJnZXQuY2xvc2VzdChcInRhYmxlXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gZGF0YUZyb21FbGVtZW50KFwidXNlci10by1yZXN0cmljdFwiKS5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHVzZXJJZCB9KTtcblxuICAgICAgICBjb25zdCBzdHJpbmdzID0gZGF0YUZyb21FbGVtZW50KFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5ncyB9KTtcblxuICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsLCBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBhbGxfcHJvamVjdHMgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBzZWxlY3RBbGw9e3NlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM9e2FsbF9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzPXt1c2VyX3Byb2plY3RzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkPXt0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17dGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdj5Mb2FkaW5nLi4uPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdGF0ZSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBmZXRjaGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFsbF9wcm9qZWN0cyxcbiAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICB1c2VyX3Byb2plY3RzLFxuICAgICAgICBzdHJpbmdzXG4gICAgfSA9IHN0YXRlO1xuICAgIHJldHVybiB7IGZldGNoaW5nLCBlcnJvciwgYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHMsIHN0cmluZ3MgfTtcbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBvbkZldGNoVXNlclByb2plY3RzOiB1c2VySWQgPT4gZGlzcGF0Y2goeyB0eXBlOiBjLkFQSV9HRVRfSU5JVCwgZGF0YTogeyB1c2VySWQgfSB9KSxcbiAgICAgICAgc2V0U3RvcmU6IGRhdGEgPT4gZGlzcGF0Y2goeyB0eXBlOiBjLlNFVF9TVE9SRSwgZGF0YSB9KSxcbiAgICAgICAgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBwcm9qZWN0SWQgPT5cbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIGRhdGE6IHsgcHJvamVjdElkIH0gfSksXG4gICAgICAgIG9uVXBkYXRlSXNSZXN0cmljdGVkOiBpc19yZXN0cmljdGVkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIGRhdGE6IHsgaXNfcmVzdHJpY3RlZCB9IH0pLFxuICAgICAgICBvblVwZGF0ZVNlbGVjdEFsbDogKCkgPT4gZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIH0pXG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb21wb25lbnRzL0FwcC5qc3giLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi4vbXktcmVzdWx0cy9zdG9yZVwiO1xuXG5leHBvcnQgY29uc3QgZW5kcG9pbnRzID0ge1xuICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBpZCA9PiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHtpZH0vP2Zvcm1hdD1qc29uYFxufTtcblxuZXhwb3J0IGNvbnN0IGluQXJyYXkgPSAob2JqLCBhcnIpID0+IGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblxuZXhwb3J0IGNvbnN0IGRhdGFGcm9tRWxlbWVudCA9IGVsZW1lbnROYW1lID0+IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkuaW5uZXJIVE1MKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy91dGlscy5qcyIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuLy8gYWN0aW9uIHR5cGVzXG5leHBvcnQgY29uc3QgLy9cbiAgICBTRVRfU1RPUkUgPSBcIlNFVF9TVE9SRVwiLFxuICAgIC8vXG4gICAgQVBJX0dFVF9JTklUID0gXCJBUElfR0VUX0lOSVRcIixcbiAgICBBUElfR0VUX1NVQ0NFU1MgPSBcIkFQSV9HRVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBBUElfUFVUX0lOSVQgPSBcIkFQSV9QVVRfSU5JVFwiLFxuICAgIEFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG4gICAgQVBJX1BVVF9GQUlMVVJFID0gXCJBUElfUFVUX0ZBSUxVUkVcIixcbiAgICAvL1xuICAgIFVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG4gICAgVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG4gICAgVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9jb25zdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudXRpbHMgPSBleHBvcnRzLmVmZmVjdHMgPSBleHBvcnRzLmRldGFjaCA9IGV4cG9ydHMuQ0FOQ0VMID0gZXhwb3J0cy5kZWxheSA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IGV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuY2hhbm5lbCA9IGV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXhwb3J0cy5FTkQgPSBleHBvcnRzLnJ1blNhZ2EgPSB1bmRlZmluZWQ7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3J1blNhZ2EnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdydW5TYWdhJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3J1blNhZ2EucnVuU2FnYTtcbiAgfVxufSk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2NoYW5uZWwnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcbiAgfVxufSk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2J1ZmZlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdidWZmZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2J1ZmZlcnMuYnVmZmVycztcbiAgfVxufSk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9zYWdhSGVscGVycycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlRXZlcnk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50aHJvdHRsZTtcbiAgfVxufSk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC91dGlscycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlbGF5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlbGF5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0FOQ0VMJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLkNBTkNFTDtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RldGFjaCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5kZXRhY2g7XG4gIH1cbn0pO1xuXG52YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9taWRkbGV3YXJlJyk7XG5cbnZhciBfbWlkZGxld2FyZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWlkZGxld2FyZSk7XG5cbnZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2VmZmVjdHMnKTtcblxudmFyIGVmZmVjdHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2VmZmVjdHMpO1xuXG52YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciB1dGlscyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX21pZGRsZXdhcmUyLmRlZmF1bHQ7XG5leHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucnVuU2FnYSA9IHJ1blNhZ2E7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9wcm9jJyk7XG5cbnZhciBfcHJvYzIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvYyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBSVU5fU0FHQV9TSUdOQVRVUkUgPSAncnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSwgLi4uYXJncyknO1xudmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cbmZ1bmN0aW9uIHJ1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgaXRlcmF0b3IgPSB2b2lkIDA7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICgwLCBfdXRpbHMubG9nKSgnd2FybicsICdydW5TYWdhKGl0ZXJhdG9yLCBzdG9yZUludGVyZmFjZSkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgUlVOX1NBR0FfU0lHTkFUVVJFKTtcbiAgICB9XG4gICAgaXRlcmF0b3IgPSBzdG9yZUludGVyZmFjZTtcbiAgICBzdG9yZUludGVyZmFjZSA9IHNhZ2E7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2FnYSwgX3V0aWxzLmlzLmZ1bmMsIE5PTl9HRU5FUkFUT1JfRVJSKTtcbiAgICBpdGVyYXRvciA9IHNhZ2EuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG4gIH1cblxuICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG4gICAgICBzdWJzY3JpYmUgPSBfc3RvcmVJbnRlcmZhY2Uuc3Vic2NyaWJlLFxuICAgICAgZGlzcGF0Y2ggPSBfc3RvcmVJbnRlcmZhY2UuZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcbiAgICAgIGNvbnRleHQgPSBfc3RvcmVJbnRlcmZhY2UuY29udGV4dCxcbiAgICAgIHNhZ2FNb25pdG9yID0gX3N0b3JlSW50ZXJmYWNlLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBfc3RvcmVJbnRlcmZhY2Uub25FcnJvcjtcblxuXG4gIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXG4gIGlmIChzYWdhTW9uaXRvcikge1xuICAgIC8vIG1vbml0b3JzIGFyZSBleHBlY3RlZCB0byBoYXZlIGEgY2VydGFpbiBpbnRlcmZhY2UsIGxldCdzIGZpbGwtaW4gYW55IG1pc3Npbmcgb25lc1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkID0gc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXG4gICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCByb290OiB0cnVlLCBwYXJlbnRFZmZlY3RJZDogMCwgZWZmZWN0OiB7IHJvb3Q6IHRydWUsIHNhZ2E6IHNhZ2EsIGFyZ3M6IGFyZ3MgfSB9KTtcbiAgfVxuXG4gIHZhciB0YXNrID0gKDAsIF9wcm9jMi5kZWZhdWx0KShpdGVyYXRvciwgc3Vic2NyaWJlLCAoMCwgX3V0aWxzLndyYXBTYWdhRGlzcGF0Y2gpKGRpc3BhdGNoKSwgZ2V0U3RhdGUsIGNvbnRleHQsIHsgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLCBsb2dnZXI6IGxvZ2dlciwgb25FcnJvcjogb25FcnJvciB9LCBlZmZlY3RJZCwgc2FnYS5uYW1lKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgdGFzayk7XG4gIH1cblxuICByZXR1cm4gdGFzaztcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcnVuU2FnYS5qc1xuLy8gbW9kdWxlIGlkID0gNzM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmNoZWNrID0gY2hlY2s7XG5leHBvcnRzLmhhc093biA9IGhhc093bjtcbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuZXhwb3J0cy5hcnJheU9mRGVmZmVyZWQgPSBhcnJheU9mRGVmZmVyZWQ7XG5leHBvcnRzLmRlbGF5ID0gZGVsYXk7XG5leHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5leHBvcnRzLmF1dG9JbmMgPSBhdXRvSW5jO1xuZXhwb3J0cy5tYWtlSXRlcmF0b3IgPSBtYWtlSXRlcmF0b3I7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZGVwcmVjYXRlID0gZGVwcmVjYXRlO1xudmFyIHN5bSA9IGV4cG9ydHMuc3ltID0gZnVuY3Rpb24gc3ltKGlkKSB7XG4gIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcbn07XG5cbnZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xudmFyIEhFTFBFUiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkhFTFBFUiA9IHN5bSgnSEVMUEVSJyk7XG52YXIgTUFUQ0ggPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5NQVRDSCA9IHN5bSgnTUFUQ0gnKTtcbnZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG52YXIgU0FHQV9BQ1RJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TQUdBX0FDVElPTiA9IHN5bSgnU0FHQV9BQ1RJT04nKTtcbnZhciBTRUxGX0NBTkNFTExBVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNFTEZfQ0FOQ0VMTEFUSU9OID0gc3ltKCdTRUxGX0NBTkNFTExBVElPTicpO1xudmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdjtcbiAgfTtcbn07XG52YXIga1RydWUgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rVHJ1ZSA9IGtvbnN0KHRydWUpO1xudmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcbnZhciBub29wID0gZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xudmFyIGlkZW50ID0gZXhwb3J0cy5pZGVudCA9IGZ1bmN0aW9uIGlkZW50KHYpIHtcbiAgcmV0dXJuIHY7XG59O1xuXG5mdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuICBpZiAoIXByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0IGNoZWNrJywgZXJyb3IpO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093bihvYmplY3QsIHByb3BlcnR5KSB7XG4gIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG59XG5cbnZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG4gIHVuZGVmOiBmdW5jdGlvbiB1bmRlZih2KSB7XG4gICAgcmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkO1xuICB9LFxuICBub3RVbmRlZjogZnVuY3Rpb24gbm90VW5kZWYodikge1xuICAgIHJldHVybiB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgZnVuYzogZnVuY3Rpb24gZnVuYyhmKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmID09PSAnZnVuY3Rpb24nO1xuICB9LFxuICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcihuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJztcbiAgfSxcbiAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIGFycmF5OiBBcnJheS5pc0FycmF5LFxuICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG4gIH0sXG4gIHByb21pc2U6IGZ1bmN0aW9uIHByb21pc2UocCkge1xuICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcbiAgfSxcbiAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG4gIH0sXG4gIGl0ZXJhYmxlOiBmdW5jdGlvbiBpdGVyYWJsZShpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuICB9LFxuICB0YXNrOiBmdW5jdGlvbiB0YXNrKHQpIHtcbiAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuICB9LFxuICBvYnNlcnZhYmxlOiBmdW5jdGlvbiBvYnNlcnZhYmxlKG9iKSB7XG4gICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcbiAgfSxcbiAgYnVmZmVyOiBmdW5jdGlvbiBidWZmZXIoYnVmKSB7XG4gICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuICB9LFxuICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKHBhdCkge1xuICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuICB9LFxuICBjaGFubmVsOiBmdW5jdGlvbiBjaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG4gIH0sXG4gIGhlbHBlcjogZnVuY3Rpb24gaGVscGVyKGl0KSB7XG4gICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG4gIH0sXG4gIHN0cmluZ2FibGVGdW5jOiBmdW5jdGlvbiBzdHJpbmdhYmxlRnVuYyhmKSB7XG4gICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuICB9XG59O1xuXG52YXIgb2JqZWN0ID0gZXhwb3J0cy5vYmplY3QgPSB7XG4gIGFzc2lnbjogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChoYXNPd24oc291cmNlLCBpKSkge1xuICAgICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbnZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG4gIGZyb206IGZ1bmN0aW9uIGZyb20ob2JqKSB7XG4gICAgdmFyIGFyciA9IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duKG9iaiwgaSkpIHtcbiAgICAgICAgYXJyW2ldID0gb2JqW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZlcnJlZCgpIHtcbiAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZGVmLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuICBkZWYucHJvbWlzZSA9IHByb21pc2U7XG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuICB2YXIgdGltZW91dElkID0gdm9pZCAwO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh2YWwpO1xuICAgIH0sIG1zKTtcbiAgfSk7XG5cbiAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgfTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1Rhc2soKSB7XG4gIHZhciBfcmVmO1xuXG4gIHZhciBydW5uaW5nID0gdHJ1ZTtcbiAgdmFyIF9yZXN1bHQgPSB2b2lkIDAsXG4gICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cbiAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltUQVNLXSA9IHRydWUsIF9yZWYuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgIHJldHVybiBydW5uaW5nO1xuICB9LCBfcmVmLnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gX3Jlc3VsdDtcbiAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgIHJldHVybiBfZXJyb3I7XG4gIH0sIF9yZWYuc2V0UnVubmluZyA9IGZ1bmN0aW9uIHNldFJ1bm5pbmcoYikge1xuICAgIHJldHVybiBydW5uaW5nID0gYjtcbiAgfSwgX3JlZi5zZXRSZXN1bHQgPSBmdW5jdGlvbiBzZXRSZXN1bHQocikge1xuICAgIHJldHVybiBfcmVzdWx0ID0gcjtcbiAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcbiAgICByZXR1cm4gX2Vycm9yID0gZTtcbiAgfSwgX3JlZjtcbn1cblxuZnVuY3Rpb24gYXV0b0luYygpIHtcbiAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKytzZWVkO1xuICB9O1xufVxuXG52YXIgdWlkID0gLyojX19QVVJFX18qL2V4cG9ydHMudWlkID0gYXV0b0luYygpO1xuXG52YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuICB0aHJvdyBlcnI7XG59O1xudmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xufTtcbmZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG4gIHZhciB0aHJvID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBrVGhyb3c7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcbiAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXG4gIHZhciBpdGVyYXRvciA9IHsgbmFtZTogbmFtZSwgbmV4dDogbmV4dCwgdGhyb3c6IHRocm8sIHJldHVybjoga1JldHVybiB9O1xuXG4gIGlmIChpc0hlbHBlcikge1xuICAgIGl0ZXJhdG9yW0hFTFBFUl0gPSB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbi8qKlxuICBQcmludCBlcnJvciBpbiBhIHVzZWZ1bCB3YXkgd2hldGhlciBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAgKHdpdGggZXhwYW5kYWJsZSBlcnJvciBzdGFjayB0cmFjZXMpLCBvciBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnRcbiAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuICoqL1xuZnVuY3Rpb24gbG9nKGxldmVsLCBtZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc29sZS5sb2coJ3JlZHV4LXNhZ2EgJyArIGxldmVsICsgJzogJyArIG1lc3NhZ2UgKyAnXFxuJyArIChlcnJvciAmJiBlcnJvci5zdGFjayB8fCBlcnJvcikpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXByZWNhdGUoZm4sIGRlcHJlY2F0aW9uV2FybmluZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcbiAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG52YXIgdXBkYXRlSW5jZW50aXZlID0gZXhwb3J0cy51cGRhdGVJbmNlbnRpdmUgPSBmdW5jdGlvbiB1cGRhdGVJbmNlbnRpdmUoZGVwcmVjYXRlZCwgcHJlZmVycmVkKSB7XG4gIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG59O1xuXG52YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ1xcbiAgcmVkdXgtc2FnYTogRXJyb3IgY2hlY2tpbmcgaG9va3MgZGV0ZWN0ZWQgYW4gaW5jb25zaXN0ZW50IHN0YXRlLiBUaGlzIGlzIGxpa2VseSBhIGJ1Z1xcbiAgaW4gcmVkdXgtc2FnYSBjb2RlIGFuZCBub3QgeW91cnMuIFRoYW5rcyBmb3IgcmVwb3J0aW5nIHRoaXMgaW4gdGhlIHByb2plY3RcXCdzIGdpdGh1YiByZXBvLlxcbiAgRXJyb3I6ICcgKyBlcnIgKyAnXFxuJyk7XG59O1xuXG52YXIgY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBleHBvcnRzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZnVuY3Rpb24gY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcoY3R4LCBwcm9wcykge1xuICByZXR1cm4gKGN0eCA/IGN0eCArICcuJyA6ICcnKSArICdzZXRDb250ZXh0KHByb3BzKTogYXJndW1lbnQgJyArIHByb3BzICsgJyBpcyBub3QgYSBwbGFpbiBvYmplY3QnO1xufTtcblxudmFyIHdyYXBTYWdhRGlzcGF0Y2ggPSBleHBvcnRzLndyYXBTYWdhRGlzcGF0Y2ggPSBmdW5jdGlvbiB3cmFwU2FnYURpc3BhdGNoKGRpc3BhdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhY3Rpb24sIFNBR0FfQUNUSU9OLCB7IHZhbHVlOiB0cnVlIH0pKTtcbiAgfTtcbn07XG5cbnZhciBjbG9uZWFibGVHZW5lcmF0b3IgPSBleHBvcnRzLmNsb25lYWJsZUdlbmVyYXRvciA9IGZ1bmN0aW9uIGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGhpc3RvcnkgPSBbXTtcbiAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcbiAgICAgICAgcmV0dXJuIGdlbi5uZXh0KGFyZyk7XG4gICAgICB9LFxuICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgICB2YXIgY2xvbmVkR2VuID0gY2xvbmVhYmxlR2VuZXJhdG9yKGdlbmVyYXRvckZ1bmMpLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmVkR2VuO1xuICAgICAgfSxcbiAgICAgIHJldHVybjogZnVuY3Rpb24gX3JldHVybih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZ2VuLnJldHVybih2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgdGhyb3c6IGZ1bmN0aW9uIF90aHJvdyhleGNlcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdlbi50aHJvdyhleGNlcHRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVEFTS19DQU5DRUwgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0gZXhwb3J0cy5OT1RfSVRFUkFUT1JfRVJST1IgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gcHJvYztcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxuZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblxudmFyIE5PVF9JVEVSQVRPUl9FUlJPUiA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gJ3Byb2MgZmlyc3QgYXJndW1lbnQgKFNhZ2EgZnVuY3Rpb24gcmVzdWx0KSBtdXN0IGJlIGFuIGl0ZXJhdG9yJztcblxudmFyIENIQU5ORUxfRU5EID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IHtcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbiAgfVxufTtcbnZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9UQVNLX0NBTkNFTCc7XG4gIH1cbn07XG5cbnZhciBtYXRjaGVycyA9IHtcbiAgd2lsZGNhcmQ6IGZ1bmN0aW9uIHdpbGRjYXJkKCkge1xuICAgIHJldHVybiBfdXRpbHMua1RydWU7XG4gIH0sXG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIF9kZWZhdWx0KHBhdHRlcm4pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXR0ZXJuKSkgPT09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcbiAgICB9IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gU3RyaW5nKHBhdHRlcm4pO1xuICAgIH07XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbiBhcnJheShwYXR0ZXJucykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHJldHVybiBwYXR0ZXJucy5zb21lKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVyKHApKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0sXG4gIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gX3ByZWRpY2F0ZShpbnB1dCk7XG4gICAgfTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWF0Y2hlcihwYXR0ZXJuKSB7XG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcbn1cblxuLyoqXG4gIFVzZWQgdG8gdHJhY2sgYSBwYXJlbnQgdGFzayBhbmQgaXRzIGZvcmtzXG4gIEluIHRoZSBuZXcgZm9yayBtb2RlbCwgZm9ya2VkIHRhc2tzIGFyZSBhdHRhY2hlZCBieSBkZWZhdWx0IHRvIHRoZWlyIHBhcmVudFxuICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuICBtYWluIHRhc2sgaXMgdGhlIG1haW4gZmxvdyBvZiB0aGUgY3VycmVudCBHZW5lcmF0b3IsIHRoZSBwYXJlbnQgdGFza3MgaXMgdGhlXG4gIGFnZ3JlZ2F0aW9uIG9mIHRoZSBtYWluIHRhc2tzICsgYWxsIGl0cyBmb3JrZWQgdGFza3MuXG4gIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG4gIGxpbmVhciBleGVjdXRpb24gdHJlZSBpbiBzZXF1ZW50aWFsIChub24gcGFyYWxsZWwpIHByb2dyYW1taW5nKVxuXG4gIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuICAtIEl0IGNvbXBsZXRlcyBpZiBhbGwgaXRzIGZvcmtzIGVpdGhlciBjb21wbGV0ZSBvciBhbGwgY2FuY2VsbGVkXG4gIC0gSWYgaXQncyBjYW5jZWxsZWQsIGFsbCBmb3JrcyBhcmUgY2FuY2VsbGVkIGFzIHdlbGxcbiAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuICAtIElmIGl0IGNvbXBsZXRlcywgdGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgb25lIHJldHVybmVkIGJ5IHRoZSBtYWluIHRhc2tcbioqL1xuZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuICB2YXIgdGFza3MgPSBbXSxcbiAgICAgIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuICBhZGRUYXNrKG1haW5UYXNrKTtcblxuICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcbiAgICBjYW5jZWxBbGwoKTtcbiAgICBjYihlcnIsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFzayh0YXNrKSB7XG4gICAgdGFza3MucHVzaCh0YXNrKTtcbiAgICB0YXNrLmNvbnQgPSBmdW5jdGlvbiAocmVzLCBpc0Vycikge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG4gICAgICB0YXNrLmNvbnQgPSBfdXRpbHMubm9vcDtcbiAgICAgIGlmIChpc0Vycikge1xuICAgICAgICBhYm9ydChyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2sgPT09IG1haW5UYXNrKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyB0YXNrLmNvbnQuY2FuY2VsID0gdGFzay5jYW5jZWxcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcbiAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgdGFza3MuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgdC5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICB0LmNhbmNlbCgpO1xuICAgIH0pO1xuICAgIHRhc2tzID0gW107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZFRhc2s6IGFkZFRhc2ssXG4gICAgY2FuY2VsQWxsOiBjYW5jZWxBbGwsXG4gICAgYWJvcnQ6IGFib3J0LFxuICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcbiAgICAgIHJldHVybiB0YXNrcztcbiAgICB9LFxuICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuICAgICAgcmV0dXJuIHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYXNrSXRlcmF0b3IoX3JlZikge1xuICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcbiAgICAgIGZuID0gX3JlZi5mbixcbiAgICAgIGFyZ3MgPSBfcmVmLmFyZ3M7XG5cbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihmbikpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTIgYW5kICM0NDFcbiAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcbiAgICAgIGVycm9yID0gdm9pZCAwO1xuICB0cnkge1xuICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvciA9IGVycjtcbiAgfVxuXG4gIC8vIGkuZS4gYSBnZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJucyBhbiBpdGVyYXRvclxuICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gZG8gbm90IGJ1YmJsZSB1cCBzeW5jaHJvbm91cyBmYWlsdXJlcyBmb3IgZGV0YWNoZWQgZm9ya3NcbiAgLy8gaW5zdGVhZCBjcmVhdGUgYSBmYWlsZWQgdGFzay4gU2VlICMxNTIgYW5kICM0NDFcbiAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSkgOiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYyA9IHZvaWQgMDtcbiAgICB2YXIgZWZmID0geyBkb25lOiBmYWxzZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgIHZhciByZXQgPSBmdW5jdGlvbiByZXQodmFsdWUpIHtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgIGlmICghcGMpIHtcbiAgICAgICAgcGMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZWZmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJldChhcmcpO1xuICAgICAgfVxuICAgIH07XG4gIH0oKSk7XG59XG5cbnZhciB3cmFwSGVscGVyID0gZnVuY3Rpb24gd3JhcEhlbHBlcihoZWxwZXIpIHtcbiAgcmV0dXJuIHsgZm46IGhlbHBlciB9O1xufTtcblxuZnVuY3Rpb24gcHJvYyhpdGVyYXRvcikge1xuICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF91dGlscy5ub29wO1xuICB9O1xuICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuICB2YXIgZ2V0U3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IF91dGlscy5ub29wO1xuICB2YXIgcGFyZW50Q29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcbiAgdmFyIHBhcmVudEVmZmVjdElkID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiAwO1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogJ2Fub255bW91cyc7XG4gIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PVF9JVEVSQVRPUl9FUlJPUik7XG5cbiAgdmFyIGVmZmVjdHNTdHJpbmcgPSAnWy4uLmVmZmVjdHNdJztcbiAgdmFyIHJ1blBhcmFsbGVsRWZmZWN0ID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHJ1bkFsbEVmZmVjdCwgKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKGVmZmVjdHNTdHJpbmcsICdhbGwoJyArIGVmZmVjdHNTdHJpbmcgKyAnKScpKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG4gIHZhciBsb2cgPSBsb2dnZXIgfHwgX3V0aWxzLmxvZztcbiAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBlcnIuc2FnYVN0YWNrO1xuXG4gICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuICAgICAgbWVzc2FnZSA9IGVyci5zdGFjay5zcGxpdCgnXFxuJylbMF0uaW5kZXhPZihlcnIubWVzc2FnZSkgIT09IC0xID8gZXJyLnN0YWNrIDogJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UgKyAnXFxuJyArIGVyci5zdGFjaztcbiAgICB9XG5cbiAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0ICcgKyBuYW1lLCBtZXNzYWdlIHx8IGVyci5tZXNzYWdlIHx8IGVycik7XG4gIH07XG4gIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG4gIHZhciB0YXNrQ29udGV4dCA9IE9iamVjdC5jcmVhdGUocGFyZW50Q29udGV4dCk7XG4gIC8qKlxuICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG4gICAgRWFjaCB0aW1lIHRoZSBnZW5lcmF0b3IgcHJvZ3Jlc3Nlcy4gY2FsbGluZyBydW5FZmZlY3Qgd2lsbCBzZXQgYSBuZXcgdmFsdWVcbiAgICBvbiBpdC4gSXQgYWxsb3dzIHByb3BhZ2F0aW5nIGNhbmNlbGxhdGlvbiB0byBjaGlsZCBlZmZlY3RzXG4gICoqL1xuICBuZXh0LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gIC8qKlxuICAgIENyZWF0ZXMgYSBuZXcgdGFzayBkZXNjcmlwdG9yIGZvciB0aGlzIGdlbmVyYXRvciwgV2UnbGwgYWxzbyBjcmVhdGUgYSBtYWluIHRhc2tcbiAgICB0byB0cmFjayB0aGUgbWFpbiBmbG93IChiZXNpZGVzIG90aGVyIGZvcmtlZCB0YXNrcylcbiAgKiovXG4gIHZhciB0YXNrID0gbmV3VGFzayhwYXJlbnRFZmZlY3RJZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpO1xuICB2YXIgbWFpblRhc2sgPSB7IG5hbWU6IG5hbWUsIGNhbmNlbDogY2FuY2VsTWFpbiwgaXNSdW5uaW5nOiB0cnVlIH07XG4gIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cbiAgLyoqXG4gICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWxNYWluKCkge1xuICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICBuZXh0KFRBU0tfQ0FOQ0VMKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICBUaGlzIG1heSBiZSBjYWxsZWQgYnkgYSBwYXJlbnQgZ2VuZXJhdG9yIHRvIHRyaWdnZXIvcHJvcGFnYXRlIGNhbmNlbGxhdGlvblxuICAgIGNhbmNlbCBhbGwgcGVuZGluZyB0YXNrcyAoaW5jbHVkaW5nIHRoZSBtYWluIHRhc2spLCB0aGVuIGVuZCB0aGUgY3VycmVudCB0YXNrLlxuICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuICAgIEl0J3MgYWxzbyBwcm9wYWdhdGVkIHRvIGFsbCBqb2luZXJzIG9mIHRoaXMgdGFzayBhbmQgdGhlaXIgZXhlY3V0aW9uIHRyZWUvam9pbmVyc1xuICAgICBDYW5jZWxsYXRpb24gaXMgbm9vcCBmb3IgdGVybWluYXRlZC9DYW5jZWxsZWQgdGFza3MgdGFza3NcbiAgKiovXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAvKipcbiAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG4gICAgICBUYXNrcyBjYW4gYmUgQ2FuY2VsbGVkIGJ1dCBzdGlsbCBSdW5uaW5nXG4gICAgKiovXG4gICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuICAgICAgaXRlcmF0b3IuX2lzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIHRhc2tRdWV1ZS5jYW5jZWxBbGwoKTtcbiAgICAgIC8qKlxuICAgICAgICBFbmRpbmcgd2l0aCBhIE5ldmVyIHJlc3VsdCB3aWxsIHByb3BhZ2F0ZSB0aGUgQ2FuY2VsbGF0aW9uIHRvIGFsbCBqb2luZXJzXG4gICAgICAqKi9cbiAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgIGF0dGFjaGVzIGNhbmNlbGxhdGlvbiBsb2dpYyB0byB0aGlzIHRhc2sncyBjb250aW51YXRpb25cbiAgICB0aGlzIHdpbGwgcGVybWl0IGNhbmNlbGxhdGlvbiB0byBwcm9wYWdhdGUgZG93biB0aGUgY2FsbCBjaGFpblxuICAqKi9cbiAgY29udCAmJiAoY29udC5jYW5jZWwgPSBjYW5jZWwpO1xuXG4gIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcbiAgaXRlcmF0b3IuX2lzUnVubmluZyA9IHRydWU7XG5cbiAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuICBuZXh0KCk7XG5cbiAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG4gIHJldHVybiB0YXNrO1xuXG4gIC8qKlxuICAgIFRoaXMgaXMgdGhlIGdlbmVyYXRvciBkcml2ZXJcbiAgICBJdCdzIGEgcmVjdXJzaXZlIGFzeW5jL2NvbnRpbnVhdGlvbiBmdW5jdGlvbiB3aGljaCBjYWxscyBpdHNlbGZcbiAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG4gICoqL1xuICBmdW5jdGlvbiBuZXh0KGFyZywgaXNFcnIpIHtcbiAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3JvbmdcbiAgICBpZiAoIW1haW5UYXNrLmlzUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gcmVzdW1lIGFuIGFscmVhZHkgZmluaXNoZWQgZ2VuZXJhdG9yJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IudGhyb3coYXJnKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAvKipcbiAgICAgICAgICBnZXR0aW5nIFRBU0tfQ0FOQ0VMIGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgbWFpbiB0YXNrXG4gICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcbiAgICAgICAgICAgLSBCeSBjYW5jZWxsaW5nIHRoZSBwYXJlbnQgdGFzayBtYW51YWxseVxuICAgICAgICAgIC0gQnkgam9pbmluZyBhIENhbmNlbGxlZCB0YXNrXG4gICAgICAgICoqL1xuICAgICAgICBtYWluVGFzay5pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG4gICAgICAgICoqL1xuICAgICAgICBuZXh0LmNhbmNlbCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICBJZiB0aGlzIEdlbmVyYXRvciBoYXMgYSBgcmV0dXJuYCBtZXRob2QgdGhlbiBpbnZva2VzIGl0XG4gICAgICAgICAgVGhpcyB3aWxsIGp1bXAgdG8gdGhlIGZpbmFsbHkgYmxvY2tcbiAgICAgICAgKiovXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oVEFTS19DQU5DRUwpIDogeyBkb25lOiB0cnVlLCB2YWx1ZTogVEFTS19DQU5DRUwgfTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBDSEFOTkVMX0VORCkge1xuICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcbiAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybigpIDogeyBkb25lOiB0cnVlIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcbiAgICAgICAgcnVuRWZmZWN0KHJlc3VsdC52YWx1ZSwgcGFyZW50RWZmZWN0SWQsICcnLCBuZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgIFRoaXMgR2VuZXJhdG9yIGhhcyBlbmRlZCwgdGVybWluYXRlIHRoZSBtYWluIHRhc2sgYW5kIG5vdGlmeSB0aGUgZm9yayBxdWV1ZVxuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuICAgICAgICBtYWluVGFzay5jb250ICYmIG1haW5UYXNrLmNvbnQocmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKG1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIG1haW5UYXNrLmNvbnQoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG4gICAgaXRlcmF0b3IuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHN0ZENoYW5uZWwuY2xvc2UoKTtcbiAgICBpZiAoIWlzRXJyKSB7XG4gICAgICBpdGVyYXRvci5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCAnc2FnYVN0YWNrJywge1xuICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRhc2suY29udCkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgJiYgb25FcnJvcikge1xuICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dFcnJvcihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5fZXJyb3IgPSByZXN1bHQ7XG4gICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVqZWN0KHJlc3VsdCk7XG4gICAgfVxuICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG4gICAgdGFzay5qb2luZXJzLmZvckVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgIHJldHVybiBqLmNiKHJlc3VsdCwgaXNFcnIpO1xuICAgIH0pO1xuICAgIHRhc2suam9pbmVycyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5FZmZlY3QoZWZmZWN0LCBwYXJlbnRFZmZlY3RJZCkge1xuICAgIHZhciBsYWJlbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXG4gICAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG4gICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cbiAgICAvKipcbiAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG4gICAgICBXZSBjYW4ndCBjYW5jZWwgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG4gICAgICBBbmQgV2UgY2FuJ3QgY29tcGxldGUgYW4gYWxyZWFkeSBjYW5jZWxsZWQgZWZmZWN0SWRcbiAgICAqKi9cbiAgICB2YXIgZWZmZWN0U2V0dGxlZCA9IHZvaWQgMDtcblxuICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG4gICAgZnVuY3Rpb24gY3VyckNiKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICBjYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcbiAgICAgIGlmIChzYWdhTW9uaXRvcikge1xuICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG4gICAgICB9XG4gICAgICBjYihyZXMsIGlzRXJyKTtcbiAgICB9XG4gICAgLy8gdHJhY2tzIGRvd24gdGhlIGN1cnJlbnQgY2FuY2VsXG4gICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wO1xuXG4gICAgLy8gc2V0dXAgY2FuY2VsbGF0aW9uIGxvZ2ljIG9uIHRoZSBwYXJlbnQgY2JcbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgaWYgKGVmZmVjdFNldHRsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcbiAgICAgIC8qKlxuICAgICAgICBwcm9wYWdhdGVzIGNhbmNlbCBkb3dud2FyZFxuICAgICAgICBjYXRjaCB1bmNhdWdodCBjYW5jZWxsYXRpb25zIGVycm9yczsgc2luY2Ugd2UgY2FuIG5vIGxvbmdlciBjYWxsIHRoZSBjb21wbGV0aW9uXG4gICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG4gICAgICAqKi9cbiAgICAgIHRyeSB7XG4gICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsb2dFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXG4gICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgIGVhY2ggZWZmZWN0IHJ1bm5lciBtdXN0IGF0dGFjaCBpdHMgb3duIGxvZ2ljIG9mIGNhbmNlbGxhdGlvbiB0byB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgIGl0IGFsbG93cyB0aGlzIGdlbmVyYXRvciB0byBwcm9wYWdhdGUgY2FuY2VsbGF0aW9uIGRvd253YXJkLlxuICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cbiAgICAgIEFuZCB0aGUgc2V0dXAgbXVzdCBvY2N1ciBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2tcbiAgICAgICBUaGlzIGlzIGEgc29ydCBvZiBpbnZlcnNpb24gb2YgY29udHJvbDogY2FsbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgcmVzcG9uc2libGVcbiAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuICAgICAgYXJlIHJlc3BvbnNpYmxlIGZvciBhYm9ydGluZyB0aGUgY3VycmVudCBmbG93IGJ5IGNhbGxpbmcgdGhlIGF0dGFjaGVkIGNhbmNlbCBmdW5jdGlvblxuICAgICAgIExpYnJhcnkgdXNlcnMgY2FuIGF0dGFjaCB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHByb21pc2VzIGJ5IGRlZmluaW5nIGFcbiAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcbiAgICAgIEFUVEVOVElPTiEgY2FsbGluZyBjYW5jZWwgbXVzdCBoYXZlIG5vIGVmZmVjdCBvbiBhbiBhbHJlYWR5IGNvbXBsZXRlZCBvciBjYW5jZWxsZWQgZWZmZWN0XG4gICAgKiovXG4gICAgdmFyIGRhdGEgPSB2b2lkIDA7XG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgcmV0dXJuIChcbiAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3RcbiAgICAgIF91dGlscy5pcy5wcm9taXNlKGVmZmVjdCkgPyByZXNvbHZlUHJvbWlzZShlZmZlY3QsIGN1cnJDYikgOiBfdXRpbHMuaXMuaGVscGVyKGVmZmVjdCkgPyBydW5Gb3JrRWZmZWN0KHdyYXBIZWxwZXIoZWZmZWN0KSwgZWZmZWN0SWQsIGN1cnJDYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IoZWZmZWN0KSA/IHJlc29sdmVJdGVyYXRvcihlZmZlY3QsIGVmZmVjdElkLCBuYW1lLCBjdXJyQ2IpXG5cbiAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcbiAgICAgIDogX3V0aWxzLmlzLmFycmF5KGVmZmVjdCkgPyBydW5QYXJhbGxlbEVmZmVjdChlZmZlY3QsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QudGFrZShlZmZlY3QpKSA/IHJ1blRha2VFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnB1dChlZmZlY3QpKSA/IHJ1blB1dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWxsKGVmZmVjdCkpID8gcnVuQWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucmFjZShlZmZlY3QpKSA/IHJ1blJhY2VFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYWxsKGVmZmVjdCkpID8gcnVuQ2FsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNwcyhlZmZlY3QpKSA/IHJ1bkNQU0VmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZm9yayhlZmZlY3QpKSA/IHJ1bkZvcmtFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5qb2luKGVmZmVjdCkpID8gcnVuSm9pbkVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsKGVmZmVjdCkpID8gcnVuQ2FuY2VsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZWxlY3QoZWZmZWN0KSkgPyBydW5TZWxlY3RFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFjdGlvbkNoYW5uZWwoZWZmZWN0KSkgPyBydW5DaGFubmVsRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mbHVzaChlZmZlY3QpKSA/IHJ1bkZsdXNoRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWxsZWQoZWZmZWN0KSkgPyBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmdldENvbnRleHQoZWZmZWN0KSkgPyBydW5HZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5zZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuU2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogLyogYW55dGhpbmcgZWxzZSByZXR1cm5lZCBhcyBpcyAqL2N1cnJDYihlZmZlY3QpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGNiKSB7XG4gICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuICAgIGlmIChfdXRpbHMuaXMuZnVuYyhjYW5jZWxQcm9taXNlKSkge1xuICAgICAgY2IuY2FuY2VsID0gY2FuY2VsUHJvbWlzZTtcbiAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG4gICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmFib3J0KCk7XG4gICAgICB9O1xuICAgICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgZm9yIHRoZSBmZXRjaCBBUEksIHdoZW5ldmVyIHRoZXkgZ2V0IGFyb3VuZCB0b1xuICAgICAgLy8gYWRkaW5nIGNhbmNlbCBzdXBwb3J0XG4gICAgfVxuICAgIHByb21pc2UudGhlbihjYiwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcbiAgICBwcm9jKGl0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBuYW1lLCBjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5UYWtlRWZmZWN0KF9yZWYyLCBjYikge1xuICAgIHZhciBjaGFubmVsID0gX3JlZjIuY2hhbm5lbCxcbiAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG4gICAgICAgIG1heWJlID0gX3JlZjIubWF5YmU7XG5cbiAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuICAgIHZhciB0YWtlQ2IgPSBmdW5jdGlvbiB0YWtlQ2IoaW5wKSB7XG4gICAgICByZXR1cm4gaW5wIGluc3RhbmNlb2YgRXJyb3IgPyBjYihpbnAsIHRydWUpIDogKDAsIF9jaGFubmVsLmlzRW5kKShpbnApICYmICFtYXliZSA/IGNiKENIQU5ORUxfRU5EKSA6IGNiKGlucCk7XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC50YWtlKHRha2VDYiwgbWF0Y2hlcihwYXR0ZXJuKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyLCB0cnVlKTtcbiAgICB9XG4gICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYzLmNoYW5uZWwsXG4gICAgICAgIGFjdGlvbiA9IF9yZWYzLmFjdGlvbixcbiAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cbiAgICAvKipcbiAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG4gICAgICBUaGUgcHV0IHdpbGwgYmUgZXhlY3V0ZWQgYXRvbWljYWxseS4gaWUgbmVzdGVkIHB1dHMgd2lsbCBleGVjdXRlIGFmdGVyXG4gICAgICB0aGlzIHB1dCBoYXMgdGVybWluYXRlZC5cbiAgICAqKi9cbiAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gKGNoYW5uZWwgPyBjaGFubmVsLnB1dCA6IGRpc3BhdGNoKShhY3Rpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG4gICAgICAgIGlmIChjaGFubmVsIHx8IHJlc29sdmUpIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUgJiYgX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYihyZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFB1dCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5DYWxsRWZmZWN0KF9yZWY0LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjQuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNC5hcmdzO1xuXG4gICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpID8gcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSA/IHJlc29sdmVJdGVyYXRvcihyZXN1bHQsIGVmZmVjdElkLCBmbi5uYW1lLCBjYikgOiBjYihyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ1BTRWZmZWN0KF9yZWY1LCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNS5mbixcbiAgICAgICAgYXJncyA9IF9yZWY1LmFyZ3M7XG5cbiAgICAvLyBDUFMgKGllIG5vZGUgc3R5bGUgZnVuY3Rpb25zKSBjYW4gZGVmaW5lIHRoZWlyIG93biBjYW5jZWxsYXRpb24gbG9naWNcbiAgICAvLyBieSBzZXR0aW5nIGNhbmNlbCBmaWVsZCBvbiB0aGUgY2JcblxuICAgIC8vIGNhdGNoIHN5bmNocm9ub3VzIGZhaWx1cmVzOyBzZWUgIzE1MlxuICAgIHRyeSB7XG4gICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuICAgICAgICByZXR1cm4gX3V0aWxzLmlzLnVuZGVmKGVycikgPyBjYihyZXMpIDogY2IoZXJyLCB0cnVlKTtcbiAgICAgIH07XG4gICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuICAgICAgaWYgKGNwc0NiLmNhbmNlbCkge1xuICAgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZvcmtFZmZlY3QoX3JlZjYsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcbiAgICAgICAgZm4gPSBfcmVmNi5mbixcbiAgICAgICAgYXJncyA9IF9yZWY2LmFyZ3MsXG4gICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cbiAgICB2YXIgdGFza0l0ZXJhdG9yID0gY3JlYXRlVGFza0l0ZXJhdG9yKHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICgwLCBfc2NoZWR1bGVyLnN1c3BlbmQpKCk7XG4gICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXG4gICAgICBpZiAoZGV0YWNoZWQpIHtcbiAgICAgICAgY2IoX3Rhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhc2tJdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrSXRlcmF0b3IuX2Vycm9yKSB7XG4gICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNiKF90YXNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcbiAgICB9XG4gICAgLy8gRm9yayBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5Kb2luRWZmZWN0KHQsIGNiKSB7XG4gICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHZhciBqb2luZXIgPSB7IHRhc2s6IHRhc2ssIGNiOiBjYiB9O1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcbiAgICAgIH07XG4gICAgICB0LmpvaW5lcnMucHVzaChqb2luZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0LmlzQWJvcnRlZCgpID8gY2IodC5lcnJvcigpLCB0cnVlKSA6IGNiKHQucmVzdWx0KCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbEVmZmVjdCh0YXNrVG9DYW5jZWwsIGNiKSB7XG4gICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG4gICAgICB0YXNrVG9DYW5jZWwgPSB0YXNrO1xuICAgIH1cbiAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG4gICAgICB0YXNrVG9DYW5jZWwuY2FuY2VsKCk7XG4gICAgfVxuICAgIGNiKCk7XG4gICAgLy8gY2FuY2VsIGVmZmVjdHMgYXJlIG5vbiBjYW5jZWxsYWJsZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkFsbEVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXG4gICAgaWYgKCFrZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdIDoge30pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZWRDb3VudCA9IDA7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tFZmZlY3RFbmQoKSB7XG4gICAgICBpZiAoY29tcGxldGVkQ291bnQgPT09IGtleXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IF91dGlscy5hcnJheS5mcm9tKF9leHRlbmRzKHt9LCByZXN1bHRzLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0VyciB8fCAoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgfHwgcmVzID09PSBDSEFOTkVMX0VORCB8fCByZXMgPT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG4gICAgICAgICAgY2hlY2tFZmZlY3RFbmQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbXBsZXRlZCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blJhY2VFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuICAgIHZhciBjaGlsZENicyA9IHt9O1xuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgICAgLy8gUmFjZSBBdXRvIGNhbmNlbGxhdGlvblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoISgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSAmJiByZXMgIT09IENIQU5ORUxfRU5EICYmIHJlcyAhPT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgICB2YXIgX3Jlc3BvbnNlO1xuXG4gICAgICAgICAgY2IuY2FuY2VsKCk7XG4gICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuICAgICAgICAgIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdLnNsaWNlLmNhbGwoX2V4dGVuZHMoe30sIHJlc3BvbnNlLCB7IGxlbmd0aDoga2V5cy5sZW5ndGggfSkpIDogcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcbiAgICB9KTtcblxuICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blNlbGVjdEVmZmVjdChfcmVmNywgY2IpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBfcmVmNy5zZWxlY3RvcixcbiAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIGNiKHN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNoYW5uZWxFZmZlY3QoX3JlZjgsIGNiKSB7XG4gICAgdmFyIHBhdHRlcm4gPSBfcmVmOC5wYXR0ZXJuLFxuICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cbiAgICB2YXIgbWF0Y2ggPSBtYXRjaGVyKHBhdHRlcm4pO1xuICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIGNiKCgwLCBfY2hhbm5lbC5ldmVudENoYW5uZWwpKHN1YnNjcmliZSwgYnVmZmVyIHx8IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKSwgbWF0Y2gpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjYikge1xuICAgIGNiKCEhbWFpblRhc2suaXNDYW5jZWxsZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRmx1c2hFZmZlY3QoY2hhbm5lbCwgY2IpIHtcbiAgICBjaGFubmVsLmZsdXNoKGNiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcbiAgICBjYih0YXNrQ29udGV4dFtwcm9wXSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZXRDb250ZXh0RWZmZWN0KHByb3BzLCBjYikge1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG4gICAgY2IoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG4gICAgdmFyIF9kb25lLCBfcmVmOSwgX211dGF0b3JNYXA7XG5cbiAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuICAgIHJldHVybiBfcmVmOSA9IHt9LCBfcmVmOVtfdXRpbHMuVEFTS10gPSB0cnVlLCBfcmVmOS5pZCA9IGlkLCBfcmVmOS5uYW1lID0gbmFtZSwgX2RvbmUgPSAnZG9uZScsIF9tdXRhdG9yTWFwID0ge30sIF9tdXRhdG9yTWFwW19kb25lXSA9IF9tdXRhdG9yTWFwW19kb25lXSB8fCB7fSwgX211dGF0b3JNYXBbX2RvbmVdLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpdGVyYXRvci5fZGVmZXJyZWRFbmQpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZiA9ICgwLCBfdXRpbHMuZGVmZXJyZWQpKCk7XG4gICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcbiAgICAgICAgaWYgKCFpdGVyYXRvci5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgaXRlcmF0b3IuX2Vycm9yID8gZGVmLnJlamVjdChpdGVyYXRvci5fZXJyb3IpIDogZGVmLnJlc29sdmUoaXRlcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgfVxuICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc1J1bm5pbmc7XG4gICAgfSwgX3JlZjkuaXNDYW5jZWxsZWQgPSBmdW5jdGlvbiBpc0NhbmNlbGxlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG4gICAgfSwgX3JlZjkuaXNBYm9ydGVkID0gZnVuY3Rpb24gaXNBYm9ydGVkKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0Fib3J0ZWQ7XG4gICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9yZXN1bHQ7XG4gICAgfSwgX3JlZjkuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG4gICAgfSwgX3JlZjkuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgndGFzaycsIHByb3BzKSk7XG4gICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIH0sIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhfcmVmOSwgX211dGF0b3JNYXApLCBfcmVmOTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmFzYXAgPSBhc2FwO1xuZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbnZhciBxdWV1ZSA9IFtdO1xuLyoqXG4gIFZhcmlhYmxlIHRvIGhvbGQgYSBjb3VudGluZyBzZW1hcGhvcmVcbiAgLSBJbmNyZW1lbnRpbmcgYWRkcyBhIGxvY2sgYW5kIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlIChpZiBpdCdzIG5vdFxuICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuICAtIERlY3JlbWVudGluZyByZWxlYXNlcyBhIGxvY2suIFplcm8gbG9ja3MgcHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS4gVGhpc1xuICAgIHRyaWdnZXJzIGZsdXNoaW5nIHRoZSBxdWV1ZWQgdGFza3MuXG4qKi9cbnZhciBzZW1hcGhvcmUgPSAwO1xuXG4vKipcbiAgRXhlY3V0ZXMgYSB0YXNrICdhdG9taWNhbGx5Jy4gVGFza3Mgc2NoZWR1bGVkIGR1cmluZyB0aGlzIGV4ZWN1dGlvbiB3aWxsIGJlIHF1ZXVlZFxuICBhbmQgZmx1c2hlZCBhZnRlciB0aGlzIHRhc2sgaGFzIGZpbmlzaGVkIChhc3N1bWluZyB0aGUgc2NoZWR1bGVyIGVuZHVwIGluIGEgcmVsZWFzZWRcbiAgc3RhdGUpLlxuKiovXG5mdW5jdGlvbiBleGVjKHRhc2spIHtcbiAgdHJ5IHtcbiAgICBzdXNwZW5kKCk7XG4gICAgdGFzaygpO1xuICB9IGZpbmFsbHkge1xuICAgIHJlbGVhc2UoKTtcbiAgfVxufVxuXG4vKipcbiAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG4qKi9cbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICBxdWV1ZS5wdXNoKHRhc2spO1xuXG4gIGlmICghc2VtYXBob3JlKSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIGZsdXNoKCk7XG4gIH1cbn1cblxuLyoqXG4gIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG4gIHNjaGVkdWxlciBpcyByZWxlYXNlZC5cbioqL1xuZnVuY3Rpb24gc3VzcGVuZCgpIHtcbiAgc2VtYXBob3JlKys7XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLlxuKiovXG5mdW5jdGlvbiByZWxlYXNlKCkge1xuICBzZW1hcGhvcmUtLTtcbn1cblxuLyoqXG4gIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG4qKi9cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICByZWxlYXNlKCk7XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDA7XG4gIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuICAgIGV4ZWModGFzayk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc0VmZmVjdCA9IGV4cG9ydHMudGFrZW0gPSBleHBvcnRzLmRldGFjaCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMudGFrZSA9IHRha2U7XG5leHBvcnRzLnB1dCA9IHB1dDtcbmV4cG9ydHMuYWxsID0gYWxsO1xuZXhwb3J0cy5yYWNlID0gcmFjZTtcbmV4cG9ydHMuY2FsbCA9IGNhbGw7XG5leHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5leHBvcnRzLmNwcyA9IGNwcztcbmV4cG9ydHMuZm9yayA9IGZvcms7XG5leHBvcnRzLnNwYXduID0gc3Bhd247XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5leHBvcnRzLnNlbGVjdCA9IHNlbGVjdDtcbmV4cG9ydHMuYWN0aW9uQ2hhbm5lbCA9IGFjdGlvbkNoYW5uZWw7XG5leHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbmV4cG9ydHMuZ2V0Q29udGV4dCA9IGdldENvbnRleHQ7XG5leHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NhZ2FIZWxwZXJzJyk7XG5cbnZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG52YXIgVEFLRSA9ICdUQUtFJztcbnZhciBQVVQgPSAnUFVUJztcbnZhciBBTEwgPSAnQUxMJztcbnZhciBSQUNFID0gJ1JBQ0UnO1xudmFyIENBTEwgPSAnQ0FMTCc7XG52YXIgQ1BTID0gJ0NQUyc7XG52YXIgRk9SSyA9ICdGT1JLJztcbnZhciBKT0lOID0gJ0pPSU4nO1xudmFyIENBTkNFTCA9ICdDQU5DRUwnO1xudmFyIFNFTEVDVCA9ICdTRUxFQ1QnO1xudmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcbnZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcbnZhciBGTFVTSCA9ICdGTFVTSCc7XG52YXIgR0VUX0NPTlRFWFQgPSAnR0VUX0NPTlRFWFQnO1xudmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblxudmFyIFRFU1RfSElOVCA9ICdcXG4oSElOVDogaWYgeW91IGFyZSBnZXR0aW5nIHRoaXMgZXJyb3JzIGluIHRlc3RzLCBjb25zaWRlciB1c2luZyBjcmVhdGVNb2NrVGFzayBmcm9tIHJlZHV4LXNhZ2EvdXRpbHMpJztcblxudmFyIGVmZmVjdCA9IGZ1bmN0aW9uIGVmZmVjdCh0eXBlLCBwYXlsb2FkKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbSU9dID0gdHJ1ZSwgX3JlZlt0eXBlXSA9IHBheWxvYWQsIF9yZWY7XG59O1xuXG52YXIgZGV0YWNoID0gZXhwb3J0cy5kZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2goZWZmKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGFzRWZmZWN0LmZvcmsoZWZmKSwgX3V0aWxzLmlzLm9iamVjdCwgJ2RldGFjaChlZmYpOiBhcmd1bWVudCBtdXN0IGJlIGEgZm9yayBlZmZlY3QnKTtcbiAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbmZ1bmN0aW9uIHRha2UoKSB7XG4gIHZhciBwYXR0ZXJuT3JDaGFubmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnKic7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhcmd1bWVudHNbMF0sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IHBhdHRlcm5PckNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5wYXR0ZXJuKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IGNoYW5uZWw6IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBhcmd1bWVudCAnICsgU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCBvciBhIHZhbGlkIHBhdHRlcm4nKTtcbn1cblxudGFrZS5tYXliZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHRha2UuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxudmFyIHRha2VtID0gLyojX19QVVJFX18qL2V4cG9ydHMudGFrZW0gPSAoMCwgX3V0aWxzLmRlcHJlY2F0ZSkodGFrZS5tYXliZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgndGFrZW0nLCAndGFrZS5tYXliZScpKTtcblxuZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGFjdGlvbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICAgIGFjdGlvbiA9IGNoYW5uZWw7XG4gICAgY2hhbm5lbCA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChQVVQsIHsgY2hhbm5lbDogY2hhbm5lbCwgYWN0aW9uOiBhY3Rpb24gfSk7XG59XG5cbnB1dC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5wdXQuc3luYyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkocHV0LnJlc29sdmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3B1dC5zeW5jJywgJ3B1dC5yZXNvbHZlJykpO1xuXG5mdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KEFMTCwgZWZmZWN0cyk7XG59XG5cbmZ1bmN0aW9uIHJhY2UoZWZmZWN0cykge1xuICByZXR1cm4gZWZmZWN0KFJBQ0UsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiBnZXRGbkNhbGxEZXNjKG1ldGgsIGZuLCBhcmdzKSB7XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblxuICB2YXIgY29udGV4dCA9IG51bGw7XG4gIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG4gICAgdmFyIF9mbiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm5bMF07XG4gICAgZm4gPSBfZm5bMV07XG4gIH0gZWxzZSBpZiAoZm4uZm4pIHtcbiAgICB2YXIgX2ZuMiA9IGZuO1xuICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG4gICAgZm4gPSBfZm4yLmZuO1xuICB9XG4gIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuICAgIGZuID0gY29udGV4dFtmbl07XG4gIH1cbiAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXG4gIHJldHVybiB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9O1xufVxuXG5mdW5jdGlvbiBjYWxsKGZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdjYWxsJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gYXBwbHkoY29udGV4dCwgZm4pIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnYXBwbHknLCB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiB9LCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGNwcyhmbikge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBmb3JrKGZuKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChGT1JLLCBnZXRGbkNhbGxEZXNjKCdmb3JrJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gc3Bhd24oZm4pIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICByZXR1cm4gZGV0YWNoKGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbZm5dLmNvbmNhdChhcmdzKSkpO1xufVxuXG5mdW5jdGlvbiBqb2luKCkge1xuICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGpvaW4odCk7XG4gICAgfSkpO1xuICB9XG4gIHZhciB0YXNrID0gdGFza3NbMF07XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG4gICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnam9pbih0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICByZXR1cm4gZWZmZWN0KEpPSU4sIHRhc2spO1xufVxuXG5mdW5jdGlvbiBjYW5jZWwoKSB7XG4gIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgIHRhc2tzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gIH1cblxuICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gY2FuY2VsKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2sgfHwgX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG4gIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICBhcmdzW19rZXk3IC0gMV0gPSBhcmd1bWVudHNbX2tleTddO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvciA9IF91dGlscy5pZGVudDtcbiAgfSBlbHNlIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShzZWxlY3RvciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgc2VsZWN0b3IgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoU0VMRUNULCB7IHNlbGVjdG9yOiBzZWxlY3RvciwgYXJnczogYXJncyB9KTtcbn1cblxuLyoqXG4gIGNoYW5uZWwocGF0dGVybiwgW2J1ZmZlcl0pICAgID0+IGNyZWF0ZXMgYW4gZXZlbnQgY2hhbm5lbCBmb3Igc3RvcmUgYWN0aW9uc1xuKiovXG5mdW5jdGlvbiBhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwYXR0ZXJuLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sLi4uKTogYXJndW1lbnQgcGF0dGVybiBpcyB1bmRlZmluZWQnKTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50IGJ1ZmZlciBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50ICcgKyBidWZmZXIgKyAnIGlzIG5vdCBhIHZhbGlkIGJ1ZmZlcicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQUNUSU9OX0NIQU5ORUwsIHsgcGF0dGVybjogcGF0dGVybiwgYnVmZmVyOiBidWZmZXIgfSk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbGxlZCgpIHtcbiAgcmV0dXJuIGVmZmVjdChDQU5DRUxMRUQsIHt9KTtcbn1cblxuZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcbiAgcmV0dXJuIGVmZmVjdChGTFVTSCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHQocHJvcCkge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wLCBfdXRpbHMuaXMuc3RyaW5nLCAnZ2V0Q29udGV4dChwcm9wKTogYXJndW1lbnQgJyArIHByb3AgKyAnIGlzIG5vdCBhIHN0cmluZycpO1xuICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcbn1cblxuZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykobnVsbCwgcHJvcHMpKTtcbiAgcmV0dXJuIGVmZmVjdChTRVRfQ09OVEVYVCwgcHJvcHMpO1xufVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcbiAgICBhcmdzW19rZXk4IC0gMl0gPSBhcmd1bWVudHNbX2tleThdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VFdmVyeUhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOSA+IDIgPyBfbGVuOSAtIDIgOiAwKSwgX2tleTkgPSAyOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG4gICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjEwID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4xMCA+IDMgPyBfbGVuMTAgLSAzIDogMCksIF9rZXkxMCA9IDM7IF9rZXkxMCA8IF9sZW4xMDsgX2tleTEwKyspIHtcbiAgICBhcmdzW19rZXkxMCAtIDNdID0gYXJndW1lbnRzW19rZXkxMF07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGhyb3R0bGVIZWxwZXIsIG1zLCBwYXR0ZXJuLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG59XG5cbnZhciBjcmVhdGVBc0VmZmVjdFR5cGUgPSBmdW5jdGlvbiBjcmVhdGVBc0VmZmVjdFR5cGUodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuICAgIHJldHVybiBlZmZlY3QgJiYgZWZmZWN0W0lPXSAmJiBlZmZlY3RbdHlwZV07XG4gIH07XG59O1xuXG52YXIgYXNFZmZlY3QgPSBleHBvcnRzLmFzRWZmZWN0ID0ge1xuICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuICBwdXQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUFVUKSxcbiAgYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFMTCksXG4gIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG4gIGNhbGw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FMTCksXG4gIGNwczogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDUFMpLFxuICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuICBqb2luOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEpPSU4pLFxuICBjYW5jZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMKSxcbiAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG4gIGFjdGlvbkNoYW5uZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQUNUSU9OX0NIQU5ORUwpLFxuICBjYW5jZWxsZWQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMTEVEKSxcbiAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuICBnZXRDb250ZXh0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEdFVF9DT05URVhUKSxcbiAgc2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRVRfQ09OVEVYVClcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2lvLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXG52YXIgX3Rha2VFdmVyeSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VFdmVyeScpO1xuXG52YXIgX3Rha2VFdmVyeTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUV2ZXJ5KTtcblxudmFyIF90YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGFrZUxhdGVzdCcpO1xuXG52YXIgX3Rha2VMYXRlc3QyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VMYXRlc3QpO1xuXG52YXIgX3Rocm90dGxlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdGhyb3R0bGUnKTtcblxudmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBkZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiBkZXByZWNhdGlvbldhcm5pbmcoaGVscGVyTmFtZSkge1xuICByZXR1cm4gJ2ltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYVxcJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYS9lZmZlY3RzXFwnLlxcblRoZSBsYXR0ZXIgd2lsbCBub3Qgd29yayB3aXRoIHlpZWxkKiwgYXMgaGVscGVyIGVmZmVjdHMgYXJlIHdyYXBwZWQgYXV0b21hdGljYWxseSBmb3IgeW91IGluIGZvcmsgZWZmZWN0LlxcblRoZXJlZm9yZSB5aWVsZCAnICsgaGVscGVyTmFtZSArICcgd2lsbCByZXR1cm4gdGFzayBkZXNjcmlwdG9yIHRvIHlvdXIgc2FnYSBhbmQgZXhlY3V0ZSBuZXh0IGxpbmVzIG9mIGNvZGUuJztcbn07XG5cbnZhciB0YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlRXZlcnkyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VFdmVyeScpKTtcbnZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcbnZhciB0aHJvdHRsZSA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rocm90dGxlMi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0aHJvdHRsZScpKTtcblxuZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5leHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gX3Rha2VMYXRlc3QyLmRlZmF1bHQ7XG5leHBvcnRzLnRocm90dGxlSGVscGVyID0gX3Rocm90dGxlMi5kZWZhdWx0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VFdmVyeTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlRXZlcnkoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUV2ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NDVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuZXhwb3J0cy5zYWZlTmFtZSA9IHNhZmVOYW1lO1xuZXhwb3J0cy5kZWZhdWx0ID0gZnNtSXRlcmF0b3I7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIGRvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbnZhciBxRW5kID0gZXhwb3J0cy5xRW5kID0ge307XG5cbmZ1bmN0aW9uIHNhZmVOYW1lKHBhdHRlcm5PckNoYW5uZWwpIHtcbiAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuICdjaGFubmVsJztcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuICAgIH0pKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZzbUl0ZXJhdG9yKGZzbSwgcTApIHtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdpdGVyYXRvcic7XG5cbiAgdmFyIHVwZGF0ZVN0YXRlID0gdm9pZCAwLFxuICAgICAgcU5leHQgPSBxMDtcblxuICBmdW5jdGlvbiBuZXh0KGFyZywgZXJyb3IpIHtcbiAgICBpZiAocU5leHQgPT09IHFFbmQpIHtcbiAgICAgIHJldHVybiBkb25lO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgcU5leHQgPSBxRW5kO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZVN0YXRlICYmIHVwZGF0ZVN0YXRlKGFyZyk7XG5cbiAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuICAgICAgICAgIHEgPSBfZnNtJHFOZXh0WzBdLFxuICAgICAgICAgIG91dHB1dCA9IF9mc20kcU5leHRbMV0sXG4gICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblxuICAgICAgcU5leHQgPSBxO1xuICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG4gICAgICByZXR1cm4gcU5leHQgPT09IHFFbmQgPyBkb25lIDogb3V0cHV0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikobmV4dCwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuICB9LCBuYW1lLCB0cnVlKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvZnNtSXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDc0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZW1pdHRlciA9IGVtaXR0ZXI7XG5leHBvcnRzLmNoYW5uZWwgPSBjaGFubmVsO1xuZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5leHBvcnRzLnN0ZENoYW5uZWwgPSBzdGRDaGFubmVsO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vYnVmZmVycycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xudmFyIEVORCA9IGV4cG9ydHMuRU5EID0geyB0eXBlOiBDSEFOTkVMX0VORF9UWVBFIH07XG52YXIgaXNFbmQgPSBleHBvcnRzLmlzRW5kID0gZnVuY3Rpb24gaXNFbmQoYSkge1xuICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG59O1xuXG5mdW5jdGlvbiBlbWl0dGVyKCkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG4gICAgc3Vic2NyaWJlcnMucHVzaChzdWIpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KGl0ZW0pIHtcbiAgICB2YXIgYXJyID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcnJbaV0oaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBlbWl0OiBlbWl0XG4gIH07XG59XG5cbnZhciBJTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSAnaW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGNoYW5uZWwgZmFjdG9yeSBmdW5jdGlvbic7XG52YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcbn1cblxuZnVuY3Rpb24gY2hhbm5lbCgpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpO1xuXG4gIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgdmFyIHRha2VycyA9IFtdO1xuXG4gICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXG4gIGZ1bmN0aW9uIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCkge1xuICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIGEgY2xvc2VkIGNoYW5uZWwgd2l0aCBwZW5kaW5nIHRha2VycycpO1xuICAgIH1cbiAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgdGhyb3cgKDAsIF91dGlscy5pbnRlcm5hbEVycikoJ0Nhbm5vdCBoYXZlIHBlbmRpbmcgdGFrZXJzIHdpdGggbm9uIGVtcHR5IGJ1ZmZlcicpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHB1dChpbnB1dCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaW5wdXQsIF91dGlscy5pcy5ub3RVbmRlZiwgVU5ERUZJTkVEX0lOUFVUX0VSUk9SKTtcbiAgICBpZiAoY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGFrZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRha2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuICAgICAgaWYgKCFjYltfdXRpbHMuTUFUQ0hdIHx8IGNiW191dGlscy5NQVRDSF0oaW5wdXQpKSB7XG4gICAgICAgIHRha2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybiBjYihpbnB1dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGFrZShjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblxuICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoRU5EKTtcbiAgICB9IGVsc2UgaWYgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihidWZmZXIudGFrZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFrZXJzLnB1c2goY2IpO1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHRha2VycywgY2IpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaChjYikge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7IC8vIFRPRE86IGNoZWNrIGlmIHNvbWUgbmV3IHN0YXRlIHNob3VsZCBiZSBmb3JiaWRkZW4gbm93XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwuZmx1c2gnIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNiKGJ1ZmZlci5mbHVzaCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG4gICAgaWYgKCFjbG9zZWQpIHtcbiAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICBpZiAodGFrZXJzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuICAgICAgICB0YWtlcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGFycltpXShFTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiB0YWtlLFxuICAgIHB1dDogcHV0LFxuICAgIGZsdXNoOiBmbHVzaCxcbiAgICBjbG9zZTogY2xvc2UsXG4gICAgZ2V0IF9fdGFrZXJzX18oKSB7XG4gICAgICByZXR1cm4gdGFrZXJzO1xuICAgIH0sXG4gICAgZ2V0IF9fY2xvc2VkX18oKSB7XG4gICAgICByZXR1cm4gY2xvc2VkO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZXZlbnRDaGFubmVsKHN1YnNjcmliZSkge1xuICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcbiAgdmFyIG1hdGNoZXIgPSBhcmd1bWVudHNbMl07XG5cbiAgLyoqXG4gICAgc2hvdWxkIGJlIGlmKHR5cGVvZiBtYXRjaGVyICE9PSB1bmRlZmluZWQpIGluc3RlYWQ/XG4gICAgc2VlIFBSICMyNzMgZm9yIGEgYmFja2dyb3VuZCBkaXNjdXNzaW9uXG4gICoqL1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgJ0ludmFsaWQgbWF0Y2ggZnVuY3Rpb24gcGFzc2VkIHRvIGV2ZW50Q2hhbm5lbCcpO1xuICB9XG5cbiAgdmFyIGNoYW4gPSBjaGFubmVsKGJ1ZmZlcik7XG4gIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGlmICghY2hhbi5fX2Nsb3NlZF9fKSB7XG4gICAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIGNoYW4uY2xvc2UoKTtcbiAgICB9XG4gIH07XG4gIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG4gICAgICBjbG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobWF0Y2hlciAmJiAhbWF0Y2hlcihpbnB1dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbi5wdXQoaW5wdXQpO1xuICB9KTtcbiAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuICAgIHVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBpZiAoIV91dGlscy5pcy5mdW5jKHVuc3Vic2NyaWJlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW4gZXZlbnRDaGFubmVsOiBzdWJzY3JpYmUgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuc3Vic2NyaWJlJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRha2U6IGNoYW4udGFrZSxcbiAgICBmbHVzaDogY2hhbi5mbHVzaCxcbiAgICBjbG9zZTogY2xvc2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGNoYW4gPSBldmVudENoYW5uZWwoZnVuY3Rpb24gKGNiKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG4gICAgICAgIGNiKGlucHV0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgY2hhbiwge1xuICAgIHRha2U6IGZ1bmN0aW9uIHRha2UoY2IsIG1hdGNoZXIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBtYXRjaGVyIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgY2JbX3V0aWxzLk1BVENIXSA9IG1hdGNoZXI7XG4gICAgICB9XG4gICAgICBjaGFuLnRha2UoY2IpO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2NoYW5uZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYnVmZmVycyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gdW5kZWZpbmVkO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoXCIuL3V0aWxzXCIpO1xuXG52YXIgQlVGRkVSX09WRVJGTE9XID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSBcIkNoYW5uZWwncyBCdWZmZXIgb3ZlcmZsb3chXCI7XG5cbnZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG52YXIgT05fT1ZFUkZMT1dfRFJPUCA9IDI7XG52YXIgT05fT1ZFUkZMT1dfU0xJREUgPSAzO1xudmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cbnZhciB6ZXJvQnVmZmVyID0geyBpc0VtcHR5OiBfdXRpbHMua1RydWUsIHB1dDogX3V0aWxzLm5vb3AsIHRha2U6IF91dGlscy5ub29wIH07XG5cbmZ1bmN0aW9uIHJpbmdCdWZmZXIoKSB7XG4gIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMTA7XG4gIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblxuICB2YXIgYXJyID0gbmV3IEFycmF5KGxpbWl0KTtcbiAgdmFyIGxlbmd0aCA9IDA7XG4gIHZhciBwdXNoSW5kZXggPSAwO1xuICB2YXIgcG9wSW5kZXggPSAwO1xuXG4gIHZhciBwdXNoID0gZnVuY3Rpb24gcHVzaChpdCkge1xuICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG4gICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgbGVuZ3RoKys7XG4gIH07XG5cbiAgdmFyIHRha2UgPSBmdW5jdGlvbiB0YWtlKCkge1xuICAgIGlmIChsZW5ndGggIT0gMCkge1xuICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcbiAgICAgIGFycltwb3BJbmRleF0gPSBudWxsO1xuICAgICAgbGVuZ3RoLS07XG4gICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICByZXR1cm4gaXQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHdoaWxlIChsZW5ndGgpIHtcbiAgICAgIGl0ZW1zLnB1c2godGFrZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24gcHV0KGl0KSB7XG4gICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgcHVzaChpdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuICAgICAgICBzd2l0Y2ggKG92ZXJmbG93QWN0aW9uKSB7XG4gICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19USFJPVzpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfU0xJREU6XG4gICAgICAgICAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG4gICAgICAgICAgICBwb3BJbmRleCA9IHB1c2hJbmRleDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuICAgICAgICAgICAgZG91YmxlZExpbWl0ID0gMiAqIGxpbWl0O1xuXG4gICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHBvcEluZGV4ID0gMDtcblxuICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcbiAgICAgICAgICAgIGxpbWl0ID0gZG91YmxlZExpbWl0O1xuXG4gICAgICAgICAgICBwdXNoKGl0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gRFJPUFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB0YWtlOiB0YWtlLFxuICAgIGZsdXNoOiBmbHVzaFxuICB9O1xufVxuXG52YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcbiAgbm9uZTogZnVuY3Rpb24gbm9uZSgpIHtcbiAgICByZXR1cm4gemVyb0J1ZmZlcjtcbiAgfSxcbiAgZml4ZWQ6IGZ1bmN0aW9uIGZpeGVkKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1RIUk9XKTtcbiAgfSxcbiAgZHJvcHBpbmc6IGZ1bmN0aW9uIGRyb3BwaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX0RST1ApO1xuICB9LFxuICBzbGlkaW5nOiBmdW5jdGlvbiBzbGlkaW5nKGxpbWl0KSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1NMSURFKTtcbiAgfSxcbiAgZXhwYW5kaW5nOiBmdW5jdGlvbiBleHBhbmRpbmcoaW5pdGlhbFNpemUpIHtcbiAgICByZXR1cm4gcmluZ0J1ZmZlcihpbml0aWFsU2l6ZSwgT05fT1ZFUkZMT1dfRVhQQU5EKTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvYnVmZmVycy5qc1xuLy8gbW9kdWxlIGlkID0gNzQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5Q2FuY2VsID0gZnVuY3Rpb24geUNhbmNlbCh0YXNrKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbmNlbCkodGFzaykgfTtcbiAgfTtcblxuICB2YXIgdGFzayA9IHZvaWQgMCxcbiAgICAgIGFjdGlvbiA9IHZvaWQgMDtcbiAgdmFyIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRUYXNrKHQpIHtcbiAgICByZXR1cm4gdGFzayA9IHQ7XG4gIH07XG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IHRhc2sgPyBbJ3EzJywgeUNhbmNlbCh0YXNrKV0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG4gICAgfSxcbiAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG4gICAgICByZXR1cm4gWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH1cbiAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGFrZUxhdGVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9idWZmZXJzJyk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAzID8gX2xlbiAtIDMgOiAwKSwgX2tleSA9IDM7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAzXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBhY3Rpb24gPSB2b2lkIDAsXG4gICAgICBjaGFubmVsID0gdm9pZCAwO1xuXG4gIHZhciB5QWN0aW9uQ2hhbm5lbCA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmFjdGlvbkNoYW5uZWwpKHBhdHRlcm4sIF9idWZmZXJzLmJ1ZmZlcnMuc2xpZGluZygxKSkgfTtcbiAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKGNoYW5uZWwpIH07XG4gIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcbiAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cbiAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuICAgIHJldHVybiBhY3Rpb24gPSBhYztcbiAgfTtcbiAgdmFyIHNldENoYW5uZWwgPSBmdW5jdGlvbiBzZXRDaGFubmVsKGNoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcbiAgfTtcblxuICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeUFjdGlvbkNoYW5uZWwsIHNldENoYW5uZWxdO1xuICAgIH0sXG4gICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuICAgICAgcmV0dXJuIFsncTMnLCB5VGFrZSgpLCBzZXRBY3Rpb25dO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTQnLCB5Rm9yayhhY3Rpb24pXTtcbiAgICB9LFxuICAgIHE0OiBmdW5jdGlvbiBxNCgpIHtcbiAgICAgIHJldHVybiBbJ3EyJywgeURlbGF5XTtcbiAgICB9XG4gIH0sICdxMScsICd0aHJvdHRsZSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybikgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90aHJvdHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcnVuU2FnYScpO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlRmFjdG9yeSgpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBfcmVmJGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcbiAgICAgIG9wdGlvbnMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjb250ZXh0J10pO1xuXG4gIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcixcbiAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cblxuICBpZiAoX3V0aWxzLmlzLmZ1bmMob3B0aW9ucykpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTYWdhIG1pZGRsZXdhcmUgbm8gbG9uZ2VyIGFjY2VwdCBHZW5lcmF0b3IgZnVuY3Rpb25zLiBVc2Ugc2FnYU1pZGRsZXdhcmUucnVuIGluc3RlYWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxvZ2dlciAmJiAhX3V0aWxzLmlzLmZ1bmMobG9nZ2VyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMubG9nZ2VyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiBvcHRpb25zLm9uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25FcnJvcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5lbWl0dGVyICYmICFfdXRpbHMuaXMuZnVuYyhvcHRpb25zLmVtaXR0ZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5lbWl0dGVyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlKF9yZWYyKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoID0gX3JlZjIuZGlzcGF0Y2g7XG5cbiAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcbiAgICBzYWdhRW1pdHRlci5lbWl0ID0gKG9wdGlvbnMuZW1pdHRlciB8fCBfdXRpbHMuaWRlbnQpKHNhZ2FFbWl0dGVyLmVtaXQpO1xuXG4gICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBzdWJzY3JpYmU6IHNhZ2FFbWl0dGVyLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcbiAgICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICAgIHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgb25FcnJvcjogb25FcnJvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuICAgICAgICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcbiAgICAgICAgc2FnYUVtaXR0ZXIuZW1pdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgc2FnYU1pZGRsZXdhcmUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQmVmb3JlIHJ1bm5pbmcgYSBTYWdhLCB5b3UgbXVzdCBtb3VudCB0aGUgU2FnYSBtaWRkbGV3YXJlIG9uIHRoZSBTdG9yZSB1c2luZyBhcHBseU1pZGRsZXdhcmUnKTtcbiAgfTtcblxuICBzYWdhTWlkZGxld2FyZS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG4gICAgX3V0aWxzLm9iamVjdC5hc3NpZ24oY29udGV4dCwgcHJvcHMpO1xuICB9O1xuXG4gIHJldHVybiBzYWdhTWlkZGxld2FyZTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvbWlkZGxld2FyZS5qc1xuLy8gbW9kdWxlIGlkID0gNzUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZW0nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZW07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwdXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucHV0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JhY2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8ucmFjZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbGwnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FsbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FwcGx5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFwcGx5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3BzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNwcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZvcmsnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZm9yaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NwYXduJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNwYXduO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnam9pbicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5qb2luO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NlbGVjdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZWxlY3Q7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhY3Rpb25DaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFjdGlvbkNoYW5uZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWxsZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uY2FuY2VsbGVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZmx1c2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZmx1c2g7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdnZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmdldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZXRDb250ZXh0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnNldENvbnRleHQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGhyb3R0bGU7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9lZmZlY3RzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmlzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuICB9XG59KTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL2lvJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG4gIH1cbn0pO1xuXG52YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9wcm9jJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0hBTk5FTF9FTkQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcHJvYy5DSEFOTkVMX0VORDtcbiAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb21wb3NlID0gcmVxdWlyZSgncmVkdXgnKS5jb21wb3NlO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jb21wb3NlV2l0aERldlRvb2xzID0gKFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fID9cbiAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIDpcbiAgICBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSByZXR1cm4gY29tcG9zZTtcbiAgICAgIHJldHVybiBjb21wb3NlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuKTtcblxuZXhwb3J0cy5kZXZUb29sc0VuaGFuY2VyID0gKFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyA/XG4gICAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gOlxuICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gZnVuY3Rpb24obm9vcCkgeyByZXR1cm4gbm9vcDsgfSB9XG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvbi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNzU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHB1bGwgZnJvbSBcImxvZGFzaC9wdWxsXCI7XG5pbXBvcnQgeyBpbkFycmF5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gaW5pdGlhbCBzdGF0ZVxubGV0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBzZWxlY3RBbGw6IHRydWUsXG4gICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICAgIHVzZXJJZDogbnVsbCxcbiAgICBpc19yZXN0cmljdGVkOiBmYWxzZSxcbiAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuICAgIG9yaWdpbmFsX3Byb2plY3RzOiBudWxsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGMuU0VUX1NUT1JFOiB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgLi4uZGF0YSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfSU5JVDoge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfU1VDQ0VTUzoge1xuICAgICAgICAgICAgY29uc3QgeyBhbGxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBVc2VyUHJvamVjdHMgZGF0YVxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6ICh1c2VyX3Byb2plY3RzICYmIHVzZXJfcHJvamVjdHMucHJvamVjdHMpIHx8IFtdLFxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5pc19yZXN0cmljdGVkIHx8IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9HRVRfRkFJTFVSRToge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzOiBbXSxcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBjLkFQSV9QVVRfSU5JVDoge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5BUElfUFVUX1NVQ0NFU1M6IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlcl9wcm9qZWN0cyB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgbGlzdCBvZiBwcm9qZWN0cyBoZXJlLCB0byBzaW1wbGlmeSB0aGUgc3RvcmVcbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9wcm9qZWN0czogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5BUElfUFVUX0ZBSUxVUkU6IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IHsgLi4uc3RhdGUgfS5vcmlnaW5hbF9pc19yZXN0cmljdGVkLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHsgLi4uc3RhdGUgfS5vcmlnaW5hbF9wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3Byb2plY3RzOiBudWxsLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OOiB7XG4gICAgICAgICAgICBjb25zdCB7IHByb2plY3RJZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuICAgICAgICAgICAgY29uc3QgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgWy4uLnN0YXRlLnVzZXJfcHJvamVjdHNdO1xuXG4gICAgICAgICAgICBpbkFycmF5KHByb2plY3RJZCwgdXNlcl9wcm9qZWN0cylcbiAgICAgICAgICAgICAgICA/IHB1bGwodXNlcl9wcm9qZWN0cywgcHJvamVjdElkKVxuICAgICAgICAgICAgICAgIDogdXNlcl9wcm9qZWN0cy5wdXNoKHByb2plY3RJZCk7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgb3JpZ2luYWxfcHJvamVjdHMsIHVzZXJfcHJvamVjdHMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRDoge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZCA9IHsgLi4uc3RhdGUgfS5pc19yZXN0cmljdGVkO1xuICAgICAgICAgICAgY29uc3QgeyBpc19yZXN0cmljdGVkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBvcmlnaW5hbF9pc19yZXN0cmljdGVkLCBpc19yZXN0cmljdGVkIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFM6IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG4gICAgICAgICAgICBsZXQgdXNlcl9wcm9qZWN0cywgeyBzZWxlY3RBbGwgfSA9IHsuLi5zdGF0ZX07XG4gICAgICAgICAgICBpZiAoc2VsZWN0QWxsKSB7XG4gICAgICAgICAgICAgICAgdXNlcl9wcm9qZWN0cyA9IHN0YXRlLmFsbF9wcm9qZWN0cy5tYXAocHJvamVjdCA9PiBwcm9qZWN0LmlkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdEFsbCA9ICFzZWxlY3RBbGw7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VsZWN0QWxsLCBvcmlnaW5hbF9wcm9qZWN0cywgdXNlcl9wcm9qZWN0cyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvcmVkdWNlci5qcyIsInZhciBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgcHVsbEFsbCA9IHJlcXVpcmUoJy4vcHVsbEFsbCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGdpdmVuIHZhbHVlcyBmcm9tIGBhcnJheWAgdXNpbmdcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy53aXRob3V0YCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLiBVc2UgYF8ucmVtb3ZlYFxuICogdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gYW4gYXJyYXkgYnkgcHJlZGljYXRlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuICpcbiAqIF8ucHVsbChhcnJheSwgJ2EnLCAnYycpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG52YXIgcHVsbCA9IGJhc2VSZXN0KHB1bGxBbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1bGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL3B1bGwuanNcbi8vIG1vZHVsZSBpZCA9IDc1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUmVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzU3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19vdmVyUmVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2FwcGx5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VTZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VTZXRUb1N0cmluZycpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVNldFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL2NvbnN0YW50LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fc2hvcnRPdXQuanNcbi8vIG1vZHVsZSBpZCA9IDc2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZVB1bGxBbGwgPSByZXF1aXJlKCcuL19iYXNlUHVsbEFsbCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZWAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuICpcbiAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbJ2InLCAnYiddXG4gKi9cbmZ1bmN0aW9uIHB1bGxBbGwoYXJyYXksIHZhbHVlcykge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcbiAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG4gICAgOiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsQWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsQWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyksXG4gICAgYmFzZUluZGV4T2ZXaXRoID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2ZXaXRoJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQWxsQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHNlZW4gPSBhcnJheTtcblxuICBpZiAoYXJyYXkgPT09IHZhbHVlcykge1xuICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuICB9XG4gIGlmIChpdGVyYXRlZSkge1xuICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZnJvbUluZGV4ID0gMCxcbiAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB3aGlsZSAoKGZyb21JbmRleCA9IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIGZyb21JbmRleCwgY29tcGFyYXRvcikpID4gLTEpIHtcbiAgICAgIGlmIChzZWVuICE9PSBhcnJheSkge1xuICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGZyb21JbmRleCwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VQdWxsQWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUlzTmFOID0gcmVxdWlyZSgnLi9fYmFzZUlzTmFOJyksXG4gICAgc3RyaWN0SW5kZXhPZiA9IHJlcXVpcmUoJy4vX3N0cmljdEluZGV4T2YnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcbiAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJc05hTi5qc1xuLy8gbW9kdWxlIGlkID0gNzY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fc3RyaWN0SW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBiYXNlSW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2ZXaXRoKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoY29tcGFyYXRvcihhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2ZXaXRoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUluZGV4T2ZXaXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fY29weUFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NzFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgeyB0YWtlTGF0ZXN0LCBjYWxsLCBwdXQsIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHsgZ2V0Q29va2llIH0gZnJvbSBcIi4uL215LXJlc3VsdHMvdXRpbHNcIjtcblxuZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuICAgIHJldHVybiBheGlvcyh7XG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgdXJsOiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHt1c2VySWR9L2BcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcHV0RGF0YSh1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpIHtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgICBtZXRob2Q6IFwicHV0XCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKFwiY3NyZnRva2VuXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB7XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBwcm9qZWN0czogdXNlcl9wcm9qZWN0c1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uKiBnZXRTYWdhKGFjdGlvbikge1xuICAgIGNvbnN0IHsgdXNlcklkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGNhbGwoZmV0Y2hEYXRhLCB1c2VySWQpO1xuICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGEgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfR0VUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuY29uc3QgZ2V0VXNlcklkID0gc3RhdGUgPT4gc3RhdGUudXNlcklkO1xuY29uc3QgZ2V0VXNlclByb2plY3RzID0gc3RhdGUgPT4gc3RhdGUudXNlcl9wcm9qZWN0cztcbmNvbnN0IGdldElzUmVzdHJpY3RlZCA9IHN0YXRlID0+IHN0YXRlLmlzX3Jlc3RyaWN0ZWQ7XG5cbmZ1bmN0aW9uKiBwdXRTYWdhKGFjdGlvbikge1xuICAgIHRyeSB7XG4gICAgICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuICAgICAgICBjb25zdCB1c2VySWQgPSB5aWVsZCBzZWxlY3QoZ2V0VXNlcklkKTtcbiAgICAgICAgY29uc3QgaXNfcmVzdHJpY3RlZCA9IHlpZWxkIHNlbGVjdChnZXRJc1Jlc3RyaWN0ZWQpO1xuICAgICAgICBjb25zdCB1c2VyX3Byb2plY3RzID0geWllbGQgc2VsZWN0KGdldFVzZXJQcm9qZWN0cyk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgY2FsbChwdXREYXRhLCB1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpO1xuICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGEgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuLy8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2FcbmV4cG9ydCBmdW5jdGlvbiogd2F0Y2hlclNhZ2EoKSB7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3Mvc2FnYXMuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3NzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaXMtYnVmZmVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3Nzdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9BeGlvcy5qc1xuLy8gbW9kdWxlIGlkID0gNzc4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9kZWZhdWx0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzc5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J0b2EnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblxuICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG4gICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cbiAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG4gICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG4gICAgICB4RG9tYWluID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG4gICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1xuLy8gbW9kdWxlIGlkID0gNzgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9zZXR0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc4MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgcmV0dXJuIGVycm9yO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDc4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xuLy8gbW9kdWxlIGlkID0gNzg3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cbnZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbmZ1bmN0aW9uIEUoKSB7XG4gIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xufVxuRS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5FLnByb3RvdHlwZS5jb2RlID0gNTtcbkUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICBmb3IgKFxuICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG4gICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcbiAgKSB7XG4gICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgIHRocm93IG5ldyBFKCk7XG4gICAgfVxuICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDc5MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG4gIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gIH1cblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc5MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNzkyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDc5NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcbi8vIG1vZHVsZSBpZCA9IDc5N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXG4vLyBtb2R1bGUgaWQgPSA3OThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==