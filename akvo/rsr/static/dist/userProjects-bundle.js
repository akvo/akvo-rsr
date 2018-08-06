webpackJsonp([ 1 ], {
    0: function(module, exports, __webpack_require__) {
        "use strict";
        var _react = __webpack_require__(1);
        var _react2 = _interopRequireDefault(_react);
        var _reactDom = __webpack_require__(37);
        var _reactDom2 = _interopRequireDefault(_reactDom);
        var _App = __webpack_require__(739);
        var _App2 = _interopRequireDefault(_App);
        var _redux = __webpack_require__(197);
        var _reduxSaga = __webpack_require__(742);
        var _reduxSaga2 = _interopRequireDefault(_reduxSaga);
        var _reactRedux = __webpack_require__(184);
        var _reducer = __webpack_require__(758);
        var _sagas = __webpack_require__(775);
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
    739: function(module, exports, __webpack_require__) {
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
        var _utils = __webpack_require__(740);
        var _const = __webpack_require__(741);
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
    740: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.dataFromElement = exports.inArray = exports.endpoints = undefined;
        var _store = __webpack_require__(241);
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
    741: function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var SET_STORE = exports.SET_STORE = "SET_STORE", API_GET_INIT = exports.API_GET_INIT = "API_GET_INIT", API_GET_SUCCESS = exports.API_GET_SUCCESS = "API_GET_SUCCESS", API_GET_FAILURE = exports.API_GET_FAILURE = "API_GET_FAILURE", API_PUT_INIT = exports.API_PUT_INIT = "API_PUT_INIT", API_PUT_SUCCESS = exports.API_PUT_SUCCESS = "API_PUT_SUCCESS", API_PUT_FAILURE = exports.API_PUT_FAILURE = "API_PUT_FAILURE", UPDATE_PROJECT_SELECTION = exports.UPDATE_PROJECT_SELECTION = "UPDATE_PROJECT_SELECTION", UPDATE_IS_RESTRICTED = exports.UPDATE_IS_RESTRICTED = "UPDATE_IS_RESTRICTED", UPDATE_SELECT_ALL_PROJECTS = exports.UPDATE_SELECT_ALL_PROJECTS = "UPDATE_SELECT_ALL_PROJECTS";
    },
    742: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.utils = exports.effects = exports.detach = exports.CANCEL = exports.delay = exports.throttle = exports.takeLatest = exports.takeEvery = exports.buffers = exports.channel = exports.eventChannel = exports.END = exports.runSaga = undefined;
        var _runSaga = __webpack_require__(743);
        Object.defineProperty(exports, "runSaga", {
            enumerable: true,
            get: function get() {
                return _runSaga.runSaga;
            }
        });
        var _channel = __webpack_require__(751);
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
        var _buffers = __webpack_require__(752);
        Object.defineProperty(exports, "buffers", {
            enumerable: true,
            get: function get() {
                return _buffers.buffers;
            }
        });
        var _sagaHelpers = __webpack_require__(748);
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
        var _utils = __webpack_require__(744);
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
        var _io = __webpack_require__(747);
        Object.defineProperty(exports, "detach", {
            enumerable: true,
            get: function get() {
                return _io.detach;
            }
        });
        var _middleware = __webpack_require__(755);
        var _middleware2 = _interopRequireDefault(_middleware);
        var _effects = __webpack_require__(756);
        var effects = _interopRequireWildcard(_effects);
        var _utils2 = __webpack_require__(757);
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
    743: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.runSaga = runSaga;
            var _utils = __webpack_require__(744);
            var _proc = __webpack_require__(745);
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
    744: function(module, exports, __webpack_require__) {
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
    745: function(module, exports, __webpack_require__) {
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
        var _utils = __webpack_require__(744);
        var _scheduler = __webpack_require__(746);
        var _io = __webpack_require__(747);
        var _channel = __webpack_require__(751);
        var _buffers = __webpack_require__(752);
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
    746: function(module, exports) {
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
    747: function(module, exports, __webpack_require__) {
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
        var _utils = __webpack_require__(744);
        var _sagaHelpers = __webpack_require__(748);
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
    748: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.throttleHelper = exports.takeLatestHelper = exports.takeEveryHelper = exports.throttle = exports.takeLatest = exports.takeEvery = undefined;
        var _takeEvery = __webpack_require__(749);
        var _takeEvery2 = _interopRequireDefault(_takeEvery);
        var _takeLatest = __webpack_require__(753);
        var _takeLatest2 = _interopRequireDefault(_takeLatest);
        var _throttle = __webpack_require__(754);
        var _throttle2 = _interopRequireDefault(_throttle);
        var _utils = __webpack_require__(744);
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
    749: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeEvery;
        var _fsmIterator = __webpack_require__(750);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(747);
        var _channel = __webpack_require__(751);
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
    750: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.qEnd = undefined;
        exports.safeName = safeName;
        exports.default = fsmIterator;
        var _utils = __webpack_require__(744);
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
    751: function(module, exports, __webpack_require__) {
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
            var _utils = __webpack_require__(744);
            var _buffers = __webpack_require__(752);
            var _scheduler = __webpack_require__(746);
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
    752: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.buffers = exports.BUFFER_OVERFLOW = undefined;
        var _utils = __webpack_require__(744);
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
    753: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = takeLatest;
        var _fsmIterator = __webpack_require__(750);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(747);
        var _channel = __webpack_require__(751);
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
    754: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        exports.default = throttle;
        var _fsmIterator = __webpack_require__(750);
        var _fsmIterator2 = _interopRequireDefault(_fsmIterator);
        var _io = __webpack_require__(747);
        var _channel = __webpack_require__(751);
        var _buffers = __webpack_require__(752);
        var _utils = __webpack_require__(744);
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
    755: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            exports.__esModule = true;
            exports.default = sagaMiddlewareFactory;
            var _utils = __webpack_require__(744);
            var _channel = __webpack_require__(751);
            var _runSaga = __webpack_require__(743);
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
    756: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _io = __webpack_require__(747);
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
    757: function(module, exports, __webpack_require__) {
        "use strict";
        exports.__esModule = true;
        var _utils = __webpack_require__(744);
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
        var _io = __webpack_require__(747);
        Object.defineProperty(exports, "asEffect", {
            enumerable: true,
            get: function get() {
                return _io.asEffect;
            }
        });
        var _proc = __webpack_require__(745);
        Object.defineProperty(exports, "CHANNEL_END", {
            enumerable: true,
            get: function get() {
                return _proc.CHANNEL_END;
            }
        });
    },
    758: function(module, exports, __webpack_require__) {
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
        var _const = __webpack_require__(741);
        var c = _interopRequireWildcard(_const);
        var _pull = __webpack_require__(759);
        var _pull2 = _interopRequireDefault(_pull);
        var _utils = __webpack_require__(740);
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
    759: function(module, exports, __webpack_require__) {
        var baseRest = __webpack_require__(760), pullAll = __webpack_require__(767);
        var pull = baseRest(pullAll);
        module.exports = pull;
    },
    760: function(module, exports, __webpack_require__) {
        var identity = __webpack_require__(376), overRest = __webpack_require__(761), setToString = __webpack_require__(763);
        function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + "");
        }
        module.exports = baseRest;
    },
    761: function(module, exports, __webpack_require__) {
        var apply = __webpack_require__(762);
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
    762: function(module, exports) {
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
    763: function(module, exports, __webpack_require__) {
        var baseSetToString = __webpack_require__(764), shortOut = __webpack_require__(766);
        var setToString = shortOut(baseSetToString);
        module.exports = setToString;
    },
    764: function(module, exports, __webpack_require__) {
        var constant = __webpack_require__(765), defineProperty = __webpack_require__(265), identity = __webpack_require__(376);
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
    765: function(module, exports) {
        function constant(value) {
            return function() {
                return value;
            };
        }
        module.exports = constant;
    },
    766: function(module, exports) {
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
    767: function(module, exports, __webpack_require__) {
        var basePullAll = __webpack_require__(768);
        function pullAll(array, values) {
            return array && array.length && values && values.length ? basePullAll(array, values) : array;
        }
        module.exports = pullAll;
    },
    768: function(module, exports, __webpack_require__) {
        var arrayMap = __webpack_require__(371), baseIndexOf = __webpack_require__(769), baseIndexOfWith = __webpack_require__(773), baseUnary = __webpack_require__(293), copyArray = __webpack_require__(774);
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
    769: function(module, exports, __webpack_require__) {
        var baseFindIndex = __webpack_require__(770), baseIsNaN = __webpack_require__(771), strictIndexOf = __webpack_require__(772);
        function baseIndexOf(array, value, fromIndex) {
            return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        module.exports = baseIndexOf;
    },
    770: function(module, exports) {
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
    771: function(module, exports) {
        function baseIsNaN(value) {
            return value !== value;
        }
        module.exports = baseIsNaN;
    },
    772: function(module, exports) {
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
    773: function(module, exports) {
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
    774: function(module, exports) {
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
    775: function(module, exports, __webpack_require__) {
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
        __webpack_require__(776);
        var _effects = __webpack_require__(756);
        var _axios = __webpack_require__(777);
        var _axios2 = _interopRequireDefault(_axios);
        var _const = __webpack_require__(741);
        var c = _interopRequireWildcard(_const);
        var _utils = __webpack_require__(261);
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
    776: function(module, exports) {
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
    777: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(778);
    },
    778: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
        var bind = __webpack_require__(780);
        var Axios = __webpack_require__(782);
        var defaults = __webpack_require__(783);
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
        axios.Cancel = __webpack_require__(800);
        axios.CancelToken = __webpack_require__(801);
        axios.isCancel = __webpack_require__(797);
        axios.all = function all(promises) {
            return Promise.all(promises);
        };
        axios.spread = __webpack_require__(802);
        module.exports = axios;
        module.exports.default = axios;
    },
    779: function(module, exports, __webpack_require__) {
        "use strict";
        var bind = __webpack_require__(780);
        var isBuffer = __webpack_require__(781);
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
    780: function(module, exports) {
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
    781: function(module, exports) {
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
    782: function(module, exports, __webpack_require__) {
        "use strict";
        var defaults = __webpack_require__(783);
        var utils = __webpack_require__(779);
        var InterceptorManager = __webpack_require__(794);
        var dispatchRequest = __webpack_require__(795);
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
    783: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(779);
            var normalizeHeaderName = __webpack_require__(784);
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
                    adapter = __webpack_require__(785);
                } else if (typeof process !== "undefined") {
                    adapter = __webpack_require__(785);
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
    784: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
        module.exports = function normalizeHeaderName(headers, normalizedName) {
            utils.forEach(headers, function processHeader(value, name) {
                if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                    headers[normalizedName] = value;
                    delete headers[name];
                }
            });
        };
    },
    785: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(779);
            var settle = __webpack_require__(786);
            var buildURL = __webpack_require__(789);
            var parseHeaders = __webpack_require__(790);
            var isURLSameOrigin = __webpack_require__(791);
            var createError = __webpack_require__(787);
            var btoa = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || __webpack_require__(792);
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
                        var cookies = __webpack_require__(793);
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
    786: function(module, exports, __webpack_require__) {
        "use strict";
        var createError = __webpack_require__(787);
        module.exports = function settle(resolve, reject, response) {
            var validateStatus = response.config.validateStatus;
            if (!response.status || !validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
            }
        };
    },
    787: function(module, exports, __webpack_require__) {
        "use strict";
        var enhanceError = __webpack_require__(788);
        module.exports = function createError(message, config, code, request, response) {
            var error = new Error(message);
            return enhanceError(error, config, code, request, response);
        };
    },
    788: function(module, exports) {
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
    789: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
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
    790: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
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
    791: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
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
    792: function(module, exports) {
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
    793: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
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
    794: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
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
    795: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
        var transformData = __webpack_require__(796);
        var isCancel = __webpack_require__(797);
        var defaults = __webpack_require__(783);
        var isAbsoluteURL = __webpack_require__(798);
        var combineURLs = __webpack_require__(799);
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
    796: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(779);
        module.exports = function transformData(data, headers, fns) {
            utils.forEach(fns, function transform(fn) {
                data = fn(data, headers);
            });
            return data;
        };
    },
    797: function(module, exports) {
        "use strict";
        module.exports = function isCancel(value) {
            return !!(value && value.__CANCEL__);
        };
    },
    798: function(module, exports) {
        "use strict";
        module.exports = function isAbsoluteURL(url) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
        };
    },
    799: function(module, exports) {
        "use strict";
        module.exports = function combineURLs(baseURL, relativeURL) {
            return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
        };
    },
    800: function(module, exports) {
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
    801: function(module, exports, __webpack_require__) {
        "use strict";
        var Cancel = __webpack_require__(800);
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
    802: function(module, exports) {
        "use strict";
        module.exports = function spread(callback) {
            return function wrap(arr) {
                return callback.apply(null, arr);
            };
        };
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVJlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX292ZXJSZXN0LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9jb25zdGFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fc2hvcnRPdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvcHVsbEFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZVB1bGxBbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlSXNOYU4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mV2l0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weUFycmF5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHVjZXIiLCJfc2FnYXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNhZ2FNaWRkbGV3YXJlIiwicmVkdXhEZXZUb29scyIsIndpbmRvdyIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJzdG9yZSIsImNyZWF0ZVN0b3JlIiwicmVkdWNlciIsImNvbXBvc2UiLCJhcHBseU1pZGRsZXdhcmUiLCJydW4iLCJ3YXRjaGVyU2FnYSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCI3MzkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJrZXkiLCJDb25zdHJ1Y3RvciIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIl91dGlscyIsIl9jb25zdCIsImMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ld09iaiIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiSXNSZXN0cmljdGVkIiwiX3JlZiIsIl8iLCJpc19yZXN0cmljdGVkIiwib25DaGFuZ2VJc1Jlc3RyaWN0ZWQiLCJpZCIsInR5cGUiLCJjaGVja2VkIiwib25DaGFuZ2UiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImNsYXNzTmFtZSIsIlByb2plY3QiLCJfcmVmMiIsInByb2plY3QiLCJ1c2VyX3Byb2plY3RzIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQiLCJ1aVNldHRpbmdzIiwiaW5BcnJheSIsImRpc2FibGVkIiwicHJvamVjdFNlbGVjdGVkIiwidHJDbGFzc05hbWUiLCJpZENsYXNzTmFtZSIsIl91aVNldHRpbmdzIiwib25DbGljayIsInJlYWRPbmx5IiwidGl0bGUiLCJTZWxlY3RBbGwiLCJfcmVmMyIsInNlbGVjdEFsbCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCIsImJ1dHRvbkNsYXNzIiwiZGl2Q2xhc3MiLCJfdWlTZXR0aW5nczIiLCJFcnJvciIsIl9yZWY0IiwiZXJyb3IiLCJtZXNzYWdlIiwiUHJvamVjdHMiLCJfcmVmNSIsImFsbF9wcm9qZWN0cyIsIm1hcCIsIkFwcCIsIl9SZWFjdCRDb21wb25lbnQiLCJ0aGlzIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInRvZ2dsZVByb2plY3RTZWxlY3RlZCIsImJpbmQiLCJ0b2dnbGVJc1Jlc3RyaWN0ZWQiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsIiwicyIsInN0cmluZ3MiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25VcGRhdGVJc1Jlc3RyaWN0ZWQiLCJvblVwZGF0ZVNlbGVjdEFsbCIsImN1cnJlbnRUYXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInBhcnNlSW50IiwiZ2V0QXR0cmlidXRlIiwib25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uIiwiY29tcG9uZW50RGlkTW91bnQiLCJ1c2VySWQiLCJkYXRhRnJvbUVsZW1lbnQiLCJzZXRTdG9yZSIsIm9uRmV0Y2hVc2VyUHJvamVjdHMiLCJfcHJvcHMiLCJSZWFjdCIsIkNvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZmV0Y2hpbmciLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsIkFQSV9HRVRfSU5JVCIsImRhdGEiLCJTRVRfU1RPUkUiLCJwcm9qZWN0SWQiLCJVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04iLCJVUERBVEVfSVNfUkVTVFJJQ1RFRCIsIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIiwiY29ubmVjdCIsIjc0MCIsImVuZHBvaW50cyIsInVuZGVmaW5lZCIsIl9zdG9yZSIsIl9zdG9yZTIiLCJ1c2VyX3Byb2plY3RzX2FjY2VzcyIsImFyciIsImluZGV4T2YiLCJlbGVtZW50TmFtZSIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsIjc0MSIsIkFQSV9HRVRfU1VDQ0VTUyIsIkFQSV9HRVRfRkFJTFVSRSIsIkFQSV9QVVRfSU5JVCIsIkFQSV9QVVRfU1VDQ0VTUyIsIkFQSV9QVVRfRkFJTFVSRSIsIjc0MiIsInV0aWxzIiwiZWZmZWN0cyIsImRldGFjaCIsIkNBTkNFTCIsImRlbGF5IiwidGhyb3R0bGUiLCJ0YWtlTGF0ZXN0IiwidGFrZUV2ZXJ5IiwiYnVmZmVycyIsImNoYW5uZWwiLCJldmVudENoYW5uZWwiLCJFTkQiLCJydW5TYWdhIiwiX3J1blNhZ2EiLCJnZXQiLCJfY2hhbm5lbCIsIl9idWZmZXJzIiwiX3NhZ2FIZWxwZXJzIiwiX2lvIiwiX21pZGRsZXdhcmUiLCJfbWlkZGxld2FyZTIiLCJfZWZmZWN0cyIsIl91dGlsczIiLCI3NDMiLCJwcm9jZXNzIiwiX3Byb2MiLCJfcHJvYzIiLCJSVU5fU0FHQV9TSUdOQVRVUkUiLCJOT05fR0VORVJBVE9SX0VSUiIsInN0b3JlSW50ZXJmYWNlIiwic2FnYSIsIl9sZW4iLCJhcmd1bWVudHMiLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwiaXRlcmF0b3IiLCJpcyIsImVudiIsIk5PREVfRU5WIiwibG9nIiwiY2hlY2siLCJmdW5jIiwiYXBwbHkiLCJfc3RvcmVJbnRlcmZhY2UiLCJzdWJzY3JpYmUiLCJnZXRTdGF0ZSIsImNvbnRleHQiLCJzYWdhTW9uaXRvciIsImxvZ2dlciIsIm9uRXJyb3IiLCJlZmZlY3RJZCIsInVpZCIsImVmZmVjdFRyaWdnZXJlZCIsIm5vb3AiLCJlZmZlY3RSZXNvbHZlZCIsImVmZmVjdFJlamVjdGVkIiwiZWZmZWN0Q2FuY2VsbGVkIiwiYWN0aW9uRGlzcGF0Y2hlZCIsInJvb3QiLCJwYXJlbnRFZmZlY3RJZCIsImVmZmVjdCIsInRhc2siLCJ3cmFwU2FnYURpc3BhdGNoIiwibmFtZSIsIjc0NCIsIl9leHRlbmRzIiwiYXNzaWduIiwic291cmNlIiwiX3R5cGVvZiIsIlN5bWJvbCIsImhhc093biIsInJlbW92ZSIsImRlZmVycmVkIiwiYXJyYXlPZkRlZmZlcmVkIiwiY3JlYXRlTW9ja1Rhc2siLCJhdXRvSW5jIiwibWFrZUl0ZXJhdG9yIiwiZGVwcmVjYXRlIiwic3ltIiwiVEFTSyIsIkhFTFBFUiIsIk1BVENIIiwiU0FHQV9BQ1RJT04iLCJTRUxGX0NBTkNFTExBVElPTiIsImtvbnN0IiwidiIsImtUcnVlIiwia0ZhbHNlIiwiaWRlbnQiLCJwcmVkaWNhdGUiLCJvYmplY3QiLCJwcm9wZXJ0eSIsIm5vdFVuZGVmIiwidW5kZWYiLCJmIiwibnVtYmVyIiwibiIsInN0cmluZyIsImFycmF5IiwiaXNBcnJheSIsInByb21pc2UiLCJwIiwidGhlbiIsIml0IiwibmV4dCIsInRocm93IiwiaXRlcmFibGUiLCJ0Iiwib2JzZXJ2YWJsZSIsIm9iIiwiYnVmZmVyIiwiYnVmIiwiaXNFbXB0eSIsInRha2UiLCJwdXQiLCJwYXR0ZXJuIiwicGF0IiwiY2giLCJjbG9zZSIsImhlbHBlciIsInN0cmluZ2FibGVGdW5jIiwiaXRlbSIsImluZGV4Iiwic3BsaWNlIiwiZnJvbSIsImRlZiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHVzaCIsIm1zIiwidmFsIiwidGltZW91dElkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInJ1bm5pbmciLCJfcmVzdWx0IiwiX2Vycm9yIiwiaXNSdW5uaW5nIiwicmVzdWx0Iiwic2V0UnVubmluZyIsImIiLCJzZXRSZXN1bHQiLCJyIiwic2V0RXJyb3IiLCJzZWVkIiwia1Rocm93IiwiZXJyIiwia1JldHVybiIsImRvbmUiLCJ0aHJvIiwiaXNIZWxwZXIiLCJyZXR1cm4iLCJsZXZlbCIsImNvbnNvbGUiLCJzdGFjayIsImZuIiwiZGVwcmVjYXRpb25XYXJuaW5nIiwidXBkYXRlSW5jZW50aXZlIiwiZGVwcmVjYXRlZCIsInByZWZlcnJlZCIsImludGVybmFsRXJyIiwiY3JlYXRlU2V0Q29udGV4dFdhcm5pbmciLCJjdHgiLCJhY3Rpb24iLCJjbG9uZWFibGVHZW5lcmF0b3IiLCJnZW5lcmF0b3JGdW5jIiwiaGlzdG9yeSIsImdlbiIsImFyZyIsImNsb25lIiwiY2xvbmVkR2VuIiwiZm9yRWFjaCIsIl9yZXR1cm4iLCJfdGhyb3ciLCJleGNlcHRpb24iLCI3NDUiLCJUQVNLX0NBTkNFTCIsIkNIQU5ORUxfRU5EIiwiTk9UX0lURVJBVE9SX0VSUk9SIiwicHJvYyIsIl9zY2hlZHVsZXIiLCJfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMiLCJkZXNjcyIsImRlc2MiLCJ0b1N0cmluZyIsIm1hdGNoZXJzIiwid2lsZGNhcmQiLCJfZGVmYXVsdCIsImlucHV0IiwiU3RyaW5nIiwicGF0dGVybnMiLCJzb21lIiwibWF0Y2hlciIsIl9wcmVkaWNhdGUiLCJmb3JrUXVldWUiLCJtYWluVGFzayIsImNiIiwidGFza3MiLCJjb21wbGV0ZWQiLCJhZGRUYXNrIiwiYWJvcnQiLCJjYW5jZWxBbGwiLCJjb250IiwicmVzIiwiaXNFcnIiLCJjYW5jZWwiLCJnZXRUYXNrcyIsInRhc2tOYW1lcyIsImNyZWF0ZVRhc2tJdGVyYXRvciIsInBjIiwiZWZmIiwicmV0Iiwid3JhcEhlbHBlciIsInBhcmVudENvbnRleHQiLCJvcHRpb25zIiwiZWZmZWN0c1N0cmluZyIsInJ1blBhcmFsbGVsRWZmZWN0IiwicnVuQWxsRWZmZWN0IiwibG9nRXJyb3IiLCJzYWdhU3RhY2siLCJzcGxpdCIsInN0ZENoYW5uZWwiLCJ0YXNrQ29udGV4dCIsIm5ld1Rhc2siLCJjYW5jZWxNYWluIiwidGFza1F1ZXVlIiwiZW5kIiwiaXNDYW5jZWxsZWQiLCJfaXNSdW5uaW5nIiwiX2lzQ2FuY2VsbGVkIiwicnVuRWZmZWN0IiwiaXNNYWluUnVubmluZyIsIl9kZWZlcnJlZEVuZCIsIl9pc0Fib3J0ZWQiLCJqb2luZXJzIiwiaiIsImxhYmVsIiwiZWZmZWN0U2V0dGxlZCIsImN1cnJDYiIsInJlc29sdmVQcm9taXNlIiwicnVuRm9ya0VmZmVjdCIsInJlc29sdmVJdGVyYXRvciIsImFzRWZmZWN0IiwicnVuVGFrZUVmZmVjdCIsInJ1blB1dEVmZmVjdCIsImFsbCIsInJhY2UiLCJydW5SYWNlRWZmZWN0IiwicnVuQ2FsbEVmZmVjdCIsImNwcyIsInJ1bkNQU0VmZmVjdCIsImZvcmsiLCJqb2luIiwicnVuSm9pbkVmZmVjdCIsInJ1bkNhbmNlbEVmZmVjdCIsInNlbGVjdCIsInJ1blNlbGVjdEVmZmVjdCIsImFjdGlvbkNoYW5uZWwiLCJydW5DaGFubmVsRWZmZWN0IiwiZmx1c2giLCJydW5GbHVzaEVmZmVjdCIsImNhbmNlbGxlZCIsInJ1bkNhbmNlbGxlZEVmZmVjdCIsImdldENvbnRleHQiLCJydW5HZXRDb250ZXh0RWZmZWN0Iiwic2V0Q29udGV4dCIsInJ1blNldENvbnRleHRFZmZlY3QiLCJjYW5jZWxQcm9taXNlIiwibWF5YmUiLCJ0YWtlQ2IiLCJpbnAiLCJpc0VuZCIsImFzYXAiLCJjcHNDYiIsImNvbmNhdCIsIl9yZWY2IiwiZGV0YWNoZWQiLCJ0YXNrSXRlcmF0b3IiLCJzdXNwZW5kIiwiX3Rhc2siLCJqb2luZXIiLCJpc0Fib3J0ZWQiLCJ0YXNrVG9DYW5jZWwiLCJrZXlzIiwiY29tcGxldGVkQ291bnQiLCJyZXN1bHRzIiwiY2hpbGRDYnMiLCJjaGVja0VmZmVjdEVuZCIsImNoQ2JBdEtleSIsIl9yZXNwb25zZSIsInJlc3BvbnNlIiwic2xpY2UiLCJfcmVmNyIsInNlbGVjdG9yIiwiX3JlZjgiLCJtYXRjaCIsImZpeGVkIiwicHJvcCIsIl9kb25lIiwiX3JlZjkiLCJfbXV0YXRvck1hcCIsIjc0NiIsInF1ZXVlIiwic2VtYXBob3JlIiwiZXhlYyIsInJlbGVhc2UiLCJzaGlmdCIsIjc0NyIsInRha2VtIiwic3Bhd24iLCJJTyIsIlRBS0UiLCJQVVQiLCJBTEwiLCJSQUNFIiwiQ0FMTCIsIkNQUyIsIkZPUksiLCJKT0lOIiwiU0VMRUNUIiwiQUNUSU9OX0NIQU5ORUwiLCJDQU5DRUxMRUQiLCJGTFVTSCIsIkdFVF9DT05URVhUIiwiU0VUX0NPTlRFWFQiLCJURVNUX0hJTlQiLCJwYXlsb2FkIiwicGF0dGVybk9yQ2hhbm5lbCIsInN5bmMiLCJnZXRGbkNhbGxEZXNjIiwibWV0aCIsIl9mbiIsIl9mbjIiLCJfbGVuMiIsIl9rZXkyIiwiX2xlbjMiLCJfa2V5MyIsIl9sZW40IiwiX2tleTQiLCJfbGVuNSIsIl9rZXk1IiwiX2xlbjYiLCJfa2V5NiIsIl9sZW43IiwiX2tleTciLCJ3b3JrZXIiLCJfbGVuOCIsIl9rZXk4IiwidGFrZUV2ZXJ5SGVscGVyIiwiX2xlbjkiLCJfa2V5OSIsInRha2VMYXRlc3RIZWxwZXIiLCJfbGVuMTAiLCJfa2V5MTAiLCJ0aHJvdHRsZUhlbHBlciIsImNyZWF0ZUFzRWZmZWN0VHlwZSIsIjc0OCIsIl90YWtlRXZlcnkiLCJfdGFrZUV2ZXJ5MiIsIl90YWtlTGF0ZXN0IiwiX3Rha2VMYXRlc3QyIiwiX3Rocm90dGxlIiwiX3Rocm90dGxlMiIsImhlbHBlck5hbWUiLCI3NDkiLCJfZnNtSXRlcmF0b3IiLCJfZnNtSXRlcmF0b3IyIiwieVRha2UiLCJ5Rm9yayIsImFjIiwic2V0QWN0aW9uIiwicTEiLCJxMiIsInFFbmQiLCJzYWZlTmFtZSIsIjc1MCIsImZzbUl0ZXJhdG9yIiwiZW50cnkiLCJmc20iLCJxMCIsInVwZGF0ZVN0YXRlIiwicU5leHQiLCJfZnNtJHFOZXh0IiwicSIsIm91dHB1dCIsIl91cGRhdGVTdGF0ZSIsIjc1MSIsIlVOREVGSU5FRF9JTlBVVF9FUlJPUiIsIklOVkFMSURfQlVGRkVSIiwiZW1pdHRlciIsIkNIQU5ORUxfRU5EX1RZUEUiLCJhIiwic3Vic2NyaWJlcnMiLCJzdWIiLCJlbWl0IiwibGVuIiwiY2xvc2VkIiwidGFrZXJzIiwiY2hlY2tGb3JiaWRkZW5TdGF0ZXMiLCJfX3Rha2Vyc19fIiwiX19jbG9zZWRfXyIsIm5vbmUiLCJjaGFuIiwidW5zdWJzY3JpYmUiLCI3NTIiLCJCVUZGRVJfT1ZFUkZMT1ciLCJPTl9PVkVSRkxPV19USFJPVyIsIk9OX09WRVJGTE9XX0RST1AiLCJPTl9PVkVSRkxPV19TTElERSIsIk9OX09WRVJGTE9XX0VYUEFORCIsInplcm9CdWZmZXIiLCJyaW5nQnVmZmVyIiwibGltaXQiLCJvdmVyZmxvd0FjdGlvbiIsInB1c2hJbmRleCIsInBvcEluZGV4IiwiaXRlbXMiLCJkb3VibGVkTGltaXQiLCJkcm9wcGluZyIsInNsaWRpbmciLCJleHBhbmRpbmciLCJpbml0aWFsU2l6ZSIsIjc1MyIsInlDYW5jZWwiLCJzZXRUYXNrIiwicTMiLCI3NTQiLCJkZWxheUxlbmd0aCIsInlBY3Rpb25DaGFubmVsIiwieURlbGF5Iiwic2V0Q2hhbm5lbCIsInE0IiwiNzU1Iiwic2FnYU1pZGRsZXdhcmVGYWN0b3J5IiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIiwiX3JlZiRjb250ZXh0Iiwib25lcnJvciIsInNhZ2FFbWl0dGVyIiwiNzU2IiwiNzU3IiwiNzU4IiwiX3B1bGwiLCJfcHVsbDIiLCJfZGVmaW5lUHJvcGVydHkiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJhcnIyIiwiaW5pdGlhbFN0YXRlIiwib3JpZ2luYWxfaXNfcmVzdHJpY3RlZCIsIm9yaWdpbmFsX3VzZXJfcHJvamVjdHMiLCJfcmVkdWNlckFjdGlvbnMiLCJyZWR1Y2VyQWN0aW9ucyIsIl9hY3Rpb24kZGF0YSIsInByb2plY3RzIiwibmV3U3RhdGUiLCJfc3RhdGUiLCI3NTkiLCJiYXNlUmVzdCIsInB1bGxBbGwiLCJwdWxsIiwiNzYwIiwiaWRlbnRpdHkiLCJvdmVyUmVzdCIsInNldFRvU3RyaW5nIiwic3RhcnQiLCI3NjEiLCJuYXRpdmVNYXgiLCJNYXRoIiwibWF4IiwidHJhbnNmb3JtIiwib3RoZXJBcmdzIiwiNzYyIiwidGhpc0FyZyIsIjc2MyIsImJhc2VTZXRUb1N0cmluZyIsInNob3J0T3V0IiwiNzY0IiwiY29uc3RhbnQiLCI3NjUiLCI3NjYiLCJIT1RfQ09VTlQiLCJIT1RfU1BBTiIsIm5hdGl2ZU5vdyIsIkRhdGUiLCJub3ciLCJjb3VudCIsImxhc3RDYWxsZWQiLCJzdGFtcCIsInJlbWFpbmluZyIsIjc2NyIsImJhc2VQdWxsQWxsIiwidmFsdWVzIiwiNzY4IiwiYXJyYXlNYXAiLCJiYXNlSW5kZXhPZiIsImJhc2VJbmRleE9mV2l0aCIsImJhc2VVbmFyeSIsImNvcHlBcnJheSIsImFycmF5UHJvdG8iLCJpdGVyYXRlZSIsImNvbXBhcmF0b3IiLCJzZWVuIiwiZnJvbUluZGV4IiwiY29tcHV0ZWQiLCI3NjkiLCJiYXNlRmluZEluZGV4IiwiYmFzZUlzTmFOIiwic3RyaWN0SW5kZXhPZiIsIjc3MCIsImZyb21SaWdodCIsIjc3MSIsIjc3MiIsIjc3MyIsIjc3NCIsIjc3NSIsImdldElzUmVzdHJpY3RlZCIsImdldFVzZXJQcm9qZWN0cyIsImdldFVzZXJJZCIsImZldGNoRGF0YSIsInB1dERhdGEiLCJnZXRTYWdhIiwicHV0U2FnYSIsIl9heGlvcyIsIl9heGlvczIiLCJfbWFya2VkIiwicmVnZW5lcmF0b3JSdW50aW1lIiwibWFyayIsIl9tYXJrZWQyIiwiX21hcmtlZDMiLCJjYWxsQXhpb3MiLCJjb25maWciLCJjYXRjaCIsIm1ldGhvZCIsInVybCIsImhlYWRlcnMiLCJYLUNTUkZUb2tlbiIsImdldENvb2tpZSIsIndyYXAiLCJnZXRTYWdhJCIsIl9jb250ZXh0IiwicHJldiIsInNlbnQiLCJzdG9wIiwicHV0U2FnYSQiLCJfY29udGV4dDIiLCJ3YXRjaGVyU2FnYSQiLCJfY29udGV4dDMiLCI3NzYiLCJnbG9iYWwiLCJPcCIsIiRTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwidG9TdHJpbmdUYWdTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImluTW9kdWxlIiwicnVudGltZSIsImlubmVyRm4iLCJvdXRlckZuIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsIkNvbnRleHQiLCJfaW52b2tlIiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwiR2VuU3RhdGVTdXNwZW5kZWRTdGFydCIsIkdlblN0YXRlU3VzcGVuZGVkWWllbGQiLCJHZW5TdGF0ZUV4ZWN1dGluZyIsIkdlblN0YXRlQ29tcGxldGVkIiwiQ29udGludWVTZW50aW5lbCIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJJdGVyYXRvclByb3RvdHlwZSIsImdldFByb3RvIiwiTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUiLCJHcCIsImRpc3BsYXlOYW1lIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImdlbkZ1biIsImN0b3IiLCJhd3JhcCIsIl9fYXdhaXQiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwicmVjb3JkIiwidW53cmFwcGVkIiwicHJldmlvdXNQcm9taXNlIiwiZW5xdWV1ZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiYXN5bmMiLCJpdGVyIiwiZG9uZVJlc3VsdCIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsImluZm8iLCJyZXN1bHROYW1lIiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwicmV2ZXJzZSIsInBvcCIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJza2lwVGVtcFJlc2V0IiwiY2hhckF0Iiwicm9vdEVudHJ5Iiwicm9vdFJlY29yZCIsInJ2YWwiLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJGdW5jdGlvbiIsIjc3NyIsIjc3OCIsIkF4aW9zIiwiZGVmYXVsdHMiLCJjcmVhdGVJbnN0YW5jZSIsImRlZmF1bHRDb25maWciLCJyZXF1ZXN0IiwiZXh0ZW5kIiwiYXhpb3MiLCJpbnN0YW5jZUNvbmZpZyIsIm1lcmdlIiwiQ2FuY2VsIiwiQ2FuY2VsVG9rZW4iLCJpc0NhbmNlbCIsInByb21pc2VzIiwic3ByZWFkIiwiNzc5IiwiaXNCdWZmZXIiLCJpc0FycmF5QnVmZmVyIiwiaXNGb3JtRGF0YSIsIkZvcm1EYXRhIiwiaXNBcnJheUJ1ZmZlclZpZXciLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1VuZGVmaW5lZCIsImlzT2JqZWN0IiwiaXNEYXRlIiwiaXNGaWxlIiwiaXNCbG9iIiwiaXNGdW5jdGlvbiIsImlzU3RyZWFtIiwicGlwZSIsImlzVVJMU2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwidHJpbSIsInN0ciIsInJlcGxhY2UiLCJpc1N0YW5kYXJkQnJvd3NlckVudiIsIm5hdmlnYXRvciIsInByb2R1Y3QiLCJsIiwiYXNzaWduVmFsdWUiLCI3ODAiLCI3ODEiLCJpc1Nsb3dCdWZmZXIiLCJfaXNCdWZmZXIiLCJyZWFkRmxvYXRMRSIsIjc4MiIsIkludGVyY2VwdG9yTWFuYWdlciIsImRpc3BhdGNoUmVxdWVzdCIsImludGVyY2VwdG9ycyIsInRvTG93ZXJDYXNlIiwiY2hhaW4iLCJ1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyIsImludGVyY2VwdG9yIiwidW5zaGlmdCIsImZ1bGZpbGxlZCIsInJlamVjdGVkIiwicHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzIiwiZm9yRWFjaE1ldGhvZE5vRGF0YSIsImZvckVhY2hNZXRob2RXaXRoRGF0YSIsIjc4MyIsIm5vcm1hbGl6ZUhlYWRlck5hbWUiLCJERUZBVUxUX0NPTlRFTlRfVFlQRSIsIkNvbnRlbnQtVHlwZSIsInNldENvbnRlbnRUeXBlSWZVbnNldCIsImdldERlZmF1bHRBZGFwdGVyIiwiYWRhcHRlciIsIlhNTEh0dHBSZXF1ZXN0IiwidHJhbnNmb3JtUmVxdWVzdCIsInN0cmluZ2lmeSIsInRyYW5zZm9ybVJlc3BvbnNlIiwidGltZW91dCIsInhzcmZDb29raWVOYW1lIiwieHNyZkhlYWRlck5hbWUiLCJtYXhDb250ZW50TGVuZ3RoIiwidmFsaWRhdGVTdGF0dXMiLCJzdGF0dXMiLCJjb21tb24iLCJBY2NlcHQiLCI3ODQiLCJub3JtYWxpemVkTmFtZSIsInByb2Nlc3NIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsIjc4NSIsInNldHRsZSIsImJ1aWxkVVJMIiwicGFyc2VIZWFkZXJzIiwiaXNVUkxTYW1lT3JpZ2luIiwiY3JlYXRlRXJyb3IiLCJidG9hIiwieGhyQWRhcHRlciIsImRpc3BhdGNoWGhyUmVxdWVzdCIsInJlcXVlc3REYXRhIiwicmVxdWVzdEhlYWRlcnMiLCJsb2FkRXZlbnQiLCJ4RG9tYWluIiwiWERvbWFpblJlcXVlc3QiLCJvbnByb2dyZXNzIiwiaGFuZGxlUHJvZ3Jlc3MiLCJvbnRpbWVvdXQiLCJoYW5kbGVUaW1lb3V0IiwiYXV0aCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJBdXRob3JpemF0aW9uIiwib3BlbiIsInBhcmFtcyIsInBhcmFtc1NlcmlhbGl6ZXIiLCJoYW5kbGVMb2FkIiwicmVhZHlTdGF0ZSIsInJlc3BvbnNlVVJMIiwicmVzcG9uc2VIZWFkZXJzIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VUeXBlIiwicmVzcG9uc2VUZXh0Iiwic3RhdHVzVGV4dCIsImhhbmRsZUVycm9yIiwiY29va2llcyIsInhzcmZWYWx1ZSIsIndpdGhDcmVkZW50aWFscyIsInJlYWQiLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25Eb3dubG9hZFByb2dyZXNzIiwib25VcGxvYWRQcm9ncmVzcyIsInVwbG9hZCIsImNhbmNlbFRva2VuIiwib25DYW5jZWxlZCIsInNlbmQiLCI3ODYiLCI3ODciLCJlbmhhbmNlRXJyb3IiLCJjb2RlIiwiNzg4IiwiNzg5IiwiZW5jb2RlIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic2VyaWFsaXplZFBhcmFtcyIsInBhcnRzIiwic2VyaWFsaXplIiwicGFyc2VWYWx1ZSIsInRvSVNPU3RyaW5nIiwiNzkwIiwiaWdub3JlRHVwbGljYXRlT2YiLCJwYXJzZWQiLCJwYXJzZXIiLCJsaW5lIiwic3Vic3RyIiwiNzkxIiwic3RhbmRhcmRCcm93c2VyRW52IiwibXNpZSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJ1cmxQYXJzaW5nTm9kZSIsIm9yaWdpblVSTCIsInJlc29sdmVVUkwiLCJocmVmIiwic2V0QXR0cmlidXRlIiwicHJvdG9jb2wiLCJob3N0Iiwic2VhcmNoIiwiaGFzaCIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwibG9jYXRpb24iLCJyZXF1ZXN0VVJMIiwibm9uU3RhbmRhcmRCcm93c2VyRW52IiwiNzkyIiwiY2hhcnMiLCJFIiwiYmxvY2siLCJjaGFyQ29kZSIsImlkeCIsImNoYXJDb2RlQXQiLCI3OTMiLCJ3cml0ZSIsImV4cGlyZXMiLCJwYXRoIiwiZG9tYWluIiwic2VjdXJlIiwiY29va2llIiwidG9HTVRTdHJpbmciLCJSZWdFeHAiLCJkZWNvZGVVUklDb21wb25lbnQiLCI3OTQiLCJoYW5kbGVycyIsInVzZSIsImVqZWN0IiwiZm9yRWFjaEhhbmRsZXIiLCJoIiwiNzk1IiwidHJhbnNmb3JtRGF0YSIsImlzQWJzb2x1dGVVUkwiLCJjb21iaW5lVVJMcyIsInRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQiLCJ0aHJvd0lmUmVxdWVzdGVkIiwiYmFzZVVSTCIsImNsZWFuSGVhZGVyQ29uZmlnIiwib25BZGFwdGVyUmVzb2x1dGlvbiIsIm9uQWRhcHRlclJlamVjdGlvbiIsInJlYXNvbiIsIjc5NiIsImZucyIsIjc5NyIsIl9fQ0FOQ0VMX18iLCI3OTgiLCI3OTkiLCJyZWxhdGl2ZVVSTCIsIjgwMCIsIjgwMSIsImV4ZWN1dG9yIiwicHJvbWlzZUV4ZWN1dG9yIiwidG9rZW4iLCI4MDIiLCJjYWxsYmFjayJdLCJtYXBwaW5ncyI6IkFBQUFBLGVBQWM7SUFFUkMsR0FDQSxTQUFVQyxRQUFRQyxTQUFTQztRQUVoQztRQ0VELElBQUFDLFNBQUFELG9CQUFBO1FERUMsSUFBSUUsVUFBVUMsdUJBQXVCRjtRQ0R0QyxJQUFBRyxZ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QUNBbVQsZUFBQW1tQixNQUFBWjs7O1FBT0FoTSxZQUFBcHdCLFVBQUErN0IsbUJBQUEsU0FBQUE7WUFDQSxJQUFBOTNCLEtBQUFtNEIsUUFBQTtnQkFDQSxNQUFBbjRCLEtBQUFtNEI7OztRQVFBaE0sWUFBQXBrQixTQUFBLFNBQUFBO1lBQ0EsSUFBQTJJO1lBQ0EsSUFBQXFvQixRQUFBLElBQUE1TSxZQUFBLFNBQUEwTSxTQUFBMzhCO2dCQUNBd1UsU0FBQXhVOztZQUVBO2dCQUNBNjhCO2dCQUNBcm9COzs7UUFJQWxZLE9BQUFDLFVBQUEwekI7O0loRTBoTU02TSxLQUNBLFNBQVV4Z0MsUUFBUUM7UWlFbmxNeEI7UUFzQkFELE9BQUFDLFVBQUEsU0FBQTZ6QixPQUFBMk07WUFDQSxnQkFBQTVULEtBQUF2aUI7Z0JBQ0EsT0FBQW0yQixTQUFBM3lCLE1BQUEsTUFBQXhEIiwiZmlsZSI6InVzZXJQcm9qZWN0cy1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3ZWJwYWNrSnNvbnAoWzFdLHtcblxuLyoqKi8gMDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBfcmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHRcblx0dmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNyk7XG5cdFxuXHR2YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblx0XG5cdHZhciBfQXBwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzkpO1xuXHRcblx0dmFyIF9BcHAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQXBwKTtcblx0XG5cdHZhciBfcmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5Nyk7XG5cdFxuXHR2YXIgX3JlZHV4U2FnYSA9IF9fd2VicGFja19yZXF1aXJlX18oNzQyKTtcblx0XG5cdHZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cdFxuXHR2YXIgX3JlYWN0UmVkdXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4NCk7XG5cdFxuXHR2YXIgX3JlZHVjZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1OCk7XG5cdFxuXHR2YXIgX3NhZ2FzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdC8vIGNyZWF0ZSB0aGUgc2FnYSBtaWRkbGV3YXJlXG5cdC8qXG5cdCBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICovXG5cdFxuXHR2YXIgc2FnYU1pZGRsZXdhcmUgPSAoMCwgX3JlZHV4U2FnYTIuZGVmYXVsdCkoKTtcblx0XG5cdC8vIGRldiB0b29scyBtaWRkbGV3YXJlXG5cdHZhciByZWR1eERldlRvb2xzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKTtcblx0XG5cdHZhciBzdG9yZSA9IHZvaWQgMDtcblx0aWYgKHJlZHV4RGV2VG9vbHMpIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5jb21wb3NlKSgoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG5cdH0gZWxzZSB7XG5cdCAgICBzdG9yZSA9ICgwLCBfcmVkdXguY3JlYXRlU3RvcmUpKF9yZWR1Y2VyLnJlZHVjZXIsICgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSkpO1xuXHR9XG5cdFxuXHRzYWdhTWlkZGxld2FyZS5ydW4oX3NhZ2FzLndhdGNoZXJTYWdhKTtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgIF9yZWFjdERvbTIuZGVmYXVsdC5yZW5kZXIoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG5cdCAgICAgICAgeyBzdG9yZTogc3RvcmUgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfQXBwMi5kZWZhdWx0LCBudWxsKVxuXHQgICAgKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyUHJvamVjdHNcIikpO1xuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczOTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX2NvbnN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NDEpO1xuXHRcblx0dmFyIGMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY29uc3QpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cdFxuXHRmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH0gLypcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0dmFyIElzUmVzdHJpY3RlZCA9IGZ1bmN0aW9uIElzUmVzdHJpY3RlZChfcmVmKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYuXyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZi5vbkNoYW5nZUlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJsYWJlbFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBcImlzX3Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZTogb25DaGFuZ2VJc1Jlc3RyaWN0ZWRcblx0ICAgICAgICAgICAgfSksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XG5cdCAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuXHQgICAgICAgICAgICAgICAgICAgIF9faHRtbDogaXNfcmVzdHJpY3RlZCA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpIDogXyhcInVzZXJfYWNjZXNzX3VucmVzdHJpY3RlZFwiKVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBcInJlc3RyaWN0ZWRJbmZvXCIsXG5cdCAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogXyhcInJlc3RyaWN0ZWRfaW5mb1wiKSB9XG5cdCAgICAgICAgfSkgOiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBQcm9qZWN0ID0gZnVuY3Rpb24gUHJvamVjdChfcmVmMikge1xuXHQgICAgdmFyIF8gPSBfcmVmMi5fLFxuXHQgICAgICAgIHByb2plY3QgPSBfcmVmMi5wcm9qZWN0LFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcmVmMi51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmMi5pc19yZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjIub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQ7XG5cdFxuXHQgICAgLy8gTk9URTogdGhlIGNoZWNrZWQgdmFsdWUgaXMgc2V0IHRvIHRydWUgaWYgaXNfcmVzdHJpY3RlZCBpcyBmYWxzZS4gVGhpcyBpcyBzbyB0aGF0IHRoZSBsaXN0IG9mXG5cdCAgICAvLyBwcm9qZWN0cyBsb29rcyBsaWtlIGFsbCBwcm9qZWN0cyBhcmUgc2VsZWN0ZWQgd2hlbiByZXN0cmljdGlvbnMgYXJlIG5vdCBpbiBmb3JjZS5cblx0ICAgIC8vIFRoaXMgaXMgX25vdF8gcmVmbGVjdGVkIGluIHRoZSBzdG9yZS5cblx0ICAgIHZhciB1aVNldHRpbmdzID0gZnVuY3Rpb24gdWlTZXR0aW5ncyhwcm9qZWN0LCB1c2VyX3Byb2plY3RzLCBpc19yZXN0cmljdGVkKSB7XG5cdCAgICAgICAgdmFyIGNoZWNrZWQgPSAhaXNfcmVzdHJpY3RlZCB8fCB1c2VyX3Byb2plY3RzICYmICgwLCBfdXRpbHMuaW5BcnJheSkocHJvamVjdC5pZCwgdXNlcl9wcm9qZWN0cyksXG5cdCAgICAgICAgICAgIGRpc2FibGVkID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG5cdCAgICAgICAgICAgIHByb2plY3RTZWxlY3RlZCA9IGNoZWNrZWQgPyBcIiBwcm9qZWN0U2VsZWN0ZWRcIiA6IFwiXCIsXG5cdCAgICAgICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG5cdCAgICAgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuXHQgICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IGNoZWNrZWQsIHRyQ2xhc3NOYW1lOiB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWU6IGlkQ2xhc3NOYW1lIH07XG5cdCAgICB9O1xuXHRcblx0ICAgIHZhciBfdWlTZXR0aW5ncyA9IHVpU2V0dGluZ3MocHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCksXG5cdCAgICAgICAgY2hlY2tlZCA9IF91aVNldHRpbmdzLmNoZWNrZWQsXG5cdCAgICAgICAgdHJDbGFzc05hbWUgPSBfdWlTZXR0aW5ncy50ckNsYXNzTmFtZSxcblx0ICAgICAgICBpZENsYXNzTmFtZSA9IF91aVNldHRpbmdzLmlkQ2xhc3NOYW1lO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInRyXCIsXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICBrZXk6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIGlkOiBwcm9qZWN0LmlkLFxuXHQgICAgICAgICAgICBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCxcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiB0ckNsYXNzTmFtZVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG5cdCAgICAgICAgICAgICAgICBpZDogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcblx0ICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGNoZWNrZWQsXG5cdCAgICAgICAgICAgICAgICBkaXNhYmxlZDogIWlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICByZWFkT25seTogdHJ1ZVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgeyBjbGFzc05hbWU6IGlkQ2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgIHByb2plY3QuaWRcblx0ICAgICAgICApLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRkXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIHByb2plY3QudGl0bGUgfHwgXyhcIm5vX3RpdGxlXCIpXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBTZWxlY3RBbGwgPSBmdW5jdGlvbiBTZWxlY3RBbGwoX3JlZjMpIHtcblx0ICAgIHZhciBfID0gX3JlZjMuXyxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmMy5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsID0gX3JlZjMub25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgIGlzX3Jlc3RyaWN0ZWQgPSBfcmVmMy5pc19yZXN0cmljdGVkO1xuXHRcblx0ICAgIHZhciB1aVNldHRpbmdzID0gZnVuY3Rpb24gdWlTZXR0aW5ncyhpc19yZXN0cmljdGVkKSB7XG5cdCAgICAgICAgdmFyIGJ1dHRvbkNsYXNzID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIiksXG5cdCAgICAgICAgICAgIGRpc2FibGVkID0gIWlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIGRpdkNsYXNzID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG5cdCAgICAgICAgcmV0dXJuIHsgYnV0dG9uQ2xhc3M6IGJ1dHRvbkNsYXNzLCBkaXNhYmxlZDogZGlzYWJsZWQsIGRpdkNsYXNzOiBkaXZDbGFzcyB9O1xuXHQgICAgfTtcblx0XG5cdCAgICB2YXIgX3VpU2V0dGluZ3MyID0gdWlTZXR0aW5ncyhpc19yZXN0cmljdGVkKSxcblx0ICAgICAgICBkaXZDbGFzcyA9IF91aVNldHRpbmdzMi5kaXZDbGFzcyxcblx0ICAgICAgICBkaXNhYmxlZCA9IF91aVNldHRpbmdzMi5kaXNhYmxlZCxcblx0ICAgICAgICBidXR0b25DbGFzcyA9IF91aVNldHRpbmdzMi5idXR0b25DbGFzcztcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJkaXZcIixcblx0ICAgICAgICB7IGNsYXNzTmFtZTogZGl2Q2xhc3MgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJidXR0b25cIixcblx0ICAgICAgICAgICAgeyBvbkNsaWNrOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsIGRpc2FibGVkOiBkaXNhYmxlZCwgY2xhc3NOYW1lOiBidXR0b25DbGFzcyB9LFxuXHQgICAgICAgICAgICBzZWxlY3RBbGwgPyBfKFwiY2hlY2tfYWxsX3Byb2plY3RzXCIpIDogXyhcInVuY2hlY2tfYWxsX3Byb2plY3RzXCIpXG5cdCAgICAgICAgKVxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBFcnJvciA9IGZ1bmN0aW9uIEVycm9yKF9yZWY0KSB7XG5cdCAgICB2YXIgXyA9IF9yZWY0Ll8sXG5cdCAgICAgICAgZXJyb3IgPSBfcmVmNC5lcnJvcjtcblx0XG5cdCAgICByZXR1cm4gZXJyb3IgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBcImVycm9yXCIgfSxcblx0ICAgICAgICBfKFwiYW5fZXJyb3Jfb2NjdXJlZFwiKSArIGVycm9yLm1lc3NhZ2Vcblx0ICAgICkgOiBudWxsO1xuXHR9O1xuXHRcblx0dmFyIFByb2plY3RzID0gZnVuY3Rpb24gUHJvamVjdHMoX3JlZjUpIHtcblx0ICAgIHZhciBfID0gX3JlZjUuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY1LmVycm9yLFxuXHQgICAgICAgIGFsbF9wcm9qZWN0cyA9IF9yZWY1LmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICB1c2VyX3Byb2plY3RzID0gX3JlZjUudXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICBpc19yZXN0cmljdGVkID0gX3JlZjUuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmNS5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmNS5vbkNoYW5nZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmNS5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmNS5vbkNoYW5nZVByb2plY3RTZWxlY3RlZDtcblx0XG5cdCAgICB2YXIgY2xhc3NOYW1lID0gaXNfcmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChFcnJvciwgeyBfOiBfLCBlcnJvcjogZXJyb3IgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoSXNSZXN0cmljdGVkLCB7XG5cdCAgICAgICAgICAgIF86IF8sXG5cdCAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiBvbkNoYW5nZUlzUmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFNlbGVjdEFsbCwge1xuXHQgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWRcblx0ICAgICAgICB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0YWJsZVwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgIFwidGhlYWRcIixcblx0ICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICBcInRyXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJhY2Nlc3NcIilcblx0ICAgICAgICAgICAgICAgICAgICApLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcInByb2plY3RfaWRcIilcblx0ICAgICAgICAgICAgICAgICAgICApLFxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBcInRoXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXyhcInByb2plY3RfdGl0bGVcIilcblx0ICAgICAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICksXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJ0Ym9keVwiLFxuXHQgICAgICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdCwge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3QsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgIClcblx0ICAgICk7XG5cdH07XG5cdFxuXHR2YXIgQXBwID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcblx0ICAgIF9pbmhlcml0cyhBcHAsIF9SZWFjdCRDb21wb25lbnQpO1xuXHRcblx0ICAgIGZ1bmN0aW9uIEFwcChwcm9wcykge1xuXHQgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBcHApO1xuXHRcblx0ICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQXBwLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQXBwKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXHRcblx0ICAgICAgICBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQuYmluZChfdGhpcyk7XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkID0gX3RoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RBbGwgPSBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLl8gPSBfdGhpcy5fLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIHJldHVybiBfdGhpcztcblx0ICAgIH1cblx0XG5cdCAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuXHRcblx0XG5cdCAgICBfY3JlYXRlQ2xhc3MoQXBwLCBbe1xuXHQgICAgICAgIGtleTogXCJfXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF8ocykge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZUlzUmVzdHJpY3RlZFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdEFsbFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVQcm9qZWN0U2VsZWN0QWxsKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVNlbGVjdEFsbCgpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwidG9nZ2xlUHJvamVjdFNlbGVjdGVkXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVByb2plY3RTZWxlY3RlZChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdCAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVByb2plY3RTZWxlY3Rpb24oaWQpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0ICAgICAgICAgICAgdmFyIHVzZXJJZCA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItdG8tcmVzdHJpY3RcIikuaWQ7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyB1c2VySWQ6IHVzZXJJZCB9KTtcblx0XG5cdCAgICAgICAgICAgIHZhciBzdHJpbmdzID0gKDAsIF91dGlscy5kYXRhRnJvbUVsZW1lbnQpKFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5nczogc3RyaW5ncyB9KTtcblx0XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwicmVuZGVyXCIsXG5cdCAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0ICAgICAgICAgICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHMsXG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkID0gX3Byb3BzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGwgPSBfcHJvcHMuc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzID0gX3Byb3BzLmFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfcHJvcHMudXNlcl9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIGVycm9yID0gX3Byb3BzLmVycm9yO1xuXHRcblx0ICAgICAgICAgICAgcmV0dXJuIGFsbF9wcm9qZWN0cyA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFByb2plY3RzLCB7XG5cdCAgICAgICAgICAgICAgICBfOiB0aGlzLl8sXG5cdCAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG5cdCAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc19yZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG5cdCAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZDogdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICB9KSA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJkaXZcIixcblx0ICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICAoMCwgX3V0aWxzLl8pKFwibG9hZGluZ1wiKVxuXHQgICAgICAgICAgICApO1xuXHQgICAgICAgIH1cblx0ICAgIH1dKTtcblx0XG5cdCAgICByZXR1cm4gQXBwO1xuXHR9KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXHRcblx0dmFyIG1hcFN0YXRlVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHQgICAgdmFyIGZldGNoaW5nID0gc3RhdGUuZmV0Y2hpbmcsXG5cdCAgICAgICAgZXJyb3IgPSBzdGF0ZS5lcnJvcixcblx0ICAgICAgICBhbGxfcHJvamVjdHMgPSBzdGF0ZS5hbGxfcHJvamVjdHMsXG5cdCAgICAgICAgaXNfcmVzdHJpY3RlZCA9IHN0YXRlLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gc3RhdGUuc2VsZWN0QWxsLFxuXHQgICAgICAgIHVzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzLFxuXHQgICAgICAgIHN0cmluZ3MgPSBzdGF0ZS5zdHJpbmdzO1xuXHRcblx0ICAgIHJldHVybiB7IGZldGNoaW5nOiBmZXRjaGluZywgZXJyb3I6IGVycm9yLCBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCwgc2VsZWN0QWxsOiBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMsIHN0cmluZ3M6IHN0cmluZ3MgfTtcblx0fTtcblx0XG5cdHZhciBtYXBEaXNwYXRjaFRvUHJvcHMgPSBmdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgICAgb25GZXRjaFVzZXJQcm9qZWN0czogZnVuY3Rpb24gb25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQ6IHVzZXJJZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgc2V0U3RvcmU6IGZ1bmN0aW9uIHNldFN0b3JlKGRhdGEpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuU0VUX1NUT1JFLFxuXHQgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbjogZnVuY3Rpb24gb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKHByb2plY3RJZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sXG5cdCAgICAgICAgICAgICAgICBkYXRhOiB7IHByb2plY3RJZDogcHJvamVjdElkIH1cblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogZnVuY3Rpb24gb25VcGRhdGVJc1Jlc3RyaWN0ZWQoaXNfcmVzdHJpY3RlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcblx0ICAgICAgICAgICAgICAgIGRhdGE6IHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6IGZ1bmN0aW9uIG9uVXBkYXRlU2VsZWN0QWxsKCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuaW5BcnJheSA9IGV4cG9ydHMuZW5kcG9pbnRzID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9zdG9yZSA9IF9fd2VicGFja19yZXF1aXJlX18oMjQxKTtcblx0XG5cdHZhciBfc3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RvcmUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBlbmRwb2ludHMgPSBleHBvcnRzLmVuZHBvaW50cyA9IHtcblx0ICAgIHVzZXJfcHJvamVjdHNfYWNjZXNzOiBmdW5jdGlvbiB1c2VyX3Byb2plY3RzX2FjY2VzcyhpZCkge1xuXHQgICAgICAgIHJldHVybiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgaWQgKyBcIi8/Zm9ybWF0PWpzb25cIjtcblx0ICAgIH1cblx0fTsgLypcblx0ICAgICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0ICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0ICAgICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgICAgKi9cblx0XG5cdHZhciBpbkFycmF5ID0gZXhwb3J0cy5pbkFycmF5ID0gZnVuY3Rpb24gaW5BcnJheShvYmosIGFycikge1xuXHQgICAgcmV0dXJuIGFyciAmJiBhcnIuaW5kZXhPZihvYmopICE9PSAtMTtcblx0fTtcblx0XG5cdHZhciBkYXRhRnJvbUVsZW1lbnQgPSBleHBvcnRzLmRhdGFGcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGRhdGFGcm9tRWxlbWVudChlbGVtZW50TmFtZSkge1xuXHQgICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0Ly8gYWN0aW9uIHR5cGVzXG5cdHZhciAvL1xuXHRTRVRfU1RPUkUgPSBleHBvcnRzLlNFVF9TVE9SRSA9IFwiU0VUX1NUT1JFXCIsXG5cdFxuXHQvL1xuXHRBUElfR0VUX0lOSVQgPSBleHBvcnRzLkFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG5cdCAgICBBUElfR0VUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9HRVRfU1VDQ0VTUyA9IFwiQVBJX0dFVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfR0VUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9HRVRfRkFJTFVSRSA9IFwiQVBJX0dFVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRBUElfUFVUX0lOSVQgPSBleHBvcnRzLkFQSV9QVVRfSU5JVCA9IFwiQVBJX1BVVF9JTklUXCIsXG5cdCAgICBBUElfUFVUX1NVQ0NFU1MgPSBleHBvcnRzLkFQSV9QVVRfU1VDQ0VTUyA9IFwiQVBJX1BVVF9TVUNDRVNTXCIsXG5cdCAgICBBUElfUFVUX0ZBSUxVUkUgPSBleHBvcnRzLkFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG5cdFxuXHQvL1xuXHRVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBleHBvcnRzLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IFwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXCIsXG5cdCAgICBVUERBVEVfSVNfUkVTVFJJQ1RFRCA9IGV4cG9ydHMuVVBEQVRFX0lTX1JFU1RSSUNURUQgPSBcIlVQREFURV9JU19SRVNUUklDVEVEXCIsXG5cdCAgICBVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IGV4cG9ydHMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMgPSBcIlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTXCI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy51dGlscyA9IGV4cG9ydHMuZWZmZWN0cyA9IGV4cG9ydHMuZGV0YWNoID0gZXhwb3J0cy5DQU5DRUwgPSBleHBvcnRzLmRlbGF5ID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5jaGFubmVsID0gZXhwb3J0cy5ldmVudENoYW5uZWwgPSBleHBvcnRzLkVORCA9IGV4cG9ydHMucnVuU2FnYSA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3J1blNhZ2EnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcnVuU2FnYS5ydW5TYWdhO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTEpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdFTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5FTkQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdldmVudENoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5ldmVudENoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2NoYW5uZWwuY2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUyKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWxheTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZGV0YWNoO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTUpO1xuXHRcblx0dmFyIF9taWRkbGV3YXJlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9taWRkbGV3YXJlKTtcblx0XG5cdHZhciBfZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Nik7XG5cdFxuXHR2YXIgZWZmZWN0cyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfZWZmZWN0cyk7XG5cdFxuXHR2YXIgX3V0aWxzMiA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Nyk7XG5cdFxuXHR2YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuXHRleHBvcnRzLmVmZmVjdHMgPSBlZmZlY3RzO1xuXHRleHBvcnRzLnV0aWxzID0gdXRpbHM7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHR2YXIgX3Byb2MgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDUpO1xuXHRcblx0dmFyIF9wcm9jMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9jKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcblx0dmFyIE5PTl9HRU5FUkFUT1JfRVJSID0gUlVOX1NBR0FfU0lHTkFUVVJFICsgJzogc2FnYSBhcmd1bWVudCBtdXN0IGJlIGEgR2VuZXJhdG9yIGZ1bmN0aW9uISc7XG5cdFxuXHRmdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHZvaWQgMDtcblx0XG5cdCAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihzdG9yZUludGVyZmFjZSkpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHQgICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG5cdCAgICB9XG5cdCAgICBpdGVyYXRvciA9IHN0b3JlSW50ZXJmYWNlO1xuXHQgICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShzYWdhLCBfdXRpbHMuaXMuZnVuYywgTk9OX0dFTkVSQVRPUl9FUlIpO1xuXHQgICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgfVxuXHRcblx0ICB2YXIgX3N0b3JlSW50ZXJmYWNlID0gc3RvcmVJbnRlcmZhY2UsXG5cdCAgICAgIHN1YnNjcmliZSA9IF9zdG9yZUludGVyZmFjZS5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZSA9IF9zdG9yZUludGVyZmFjZS5nZXRTdGF0ZSxcblx0ICAgICAgY29udGV4dCA9IF9zdG9yZUludGVyZmFjZS5jb250ZXh0LFxuXHQgICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gX3N0b3JlSW50ZXJmYWNlLmxvZ2dlcixcblx0ICAgICAgb25FcnJvciA9IF9zdG9yZUludGVyZmFjZS5vbkVycm9yO1xuXHRcblx0XG5cdCAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgLy8gbW9uaXRvcnMgYXJlIGV4cGVjdGVkIHRvIGhhdmUgYSBjZXJ0YWluIGludGVyZmFjZSwgbGV0J3MgZmlsbC1pbiBhbnkgbWlzc2luZyBvbmVzXG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgPSBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkIHx8IF91dGlscy5ub29wO1xuXHRcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG5cdCAgfVxuXHRcblx0ICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cdFxuXHQgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHRhc2s7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmNoZWNrID0gY2hlY2s7XG5cdGV4cG9ydHMuaGFzT3duID0gaGFzT3duO1xuXHRleHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcblx0ZXhwb3J0cy5kZWZlcnJlZCA9IGRlZmVycmVkO1xuXHRleHBvcnRzLmFycmF5T2ZEZWZmZXJlZCA9IGFycmF5T2ZEZWZmZXJlZDtcblx0ZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuXHRleHBvcnRzLmNyZWF0ZU1vY2tUYXNrID0gY3JlYXRlTW9ja1Rhc2s7XG5cdGV4cG9ydHMuYXV0b0luYyA9IGF1dG9JbmM7XG5cdGV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG5cdHZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuXHQgIHJldHVybiAnQEByZWR1eC1zYWdhLycgKyBpZDtcblx0fTtcblx0XG5cdHZhciBUQVNLID0gLyojX19QVVJFX18qL2V4cG9ydHMuVEFTSyA9IHN5bSgnVEFTSycpO1xuXHR2YXIgSEVMUEVSID0gLyojX19QVVJFX18qL2V4cG9ydHMuSEVMUEVSID0gc3ltKCdIRUxQRVInKTtcblx0dmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG5cdHZhciBDQU5DRUwgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5DQU5DRUwgPSBzeW0oJ0NBTkNFTF9QUk9NSVNFJyk7XG5cdHZhciBTQUdBX0FDVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNBR0FfQUNUSU9OID0gc3ltKCdTQUdBX0FDVElPTicpO1xuXHR2YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcblx0dmFyIGtvbnN0ID0gZXhwb3J0cy5rb25zdCA9IGZ1bmN0aW9uIGtvbnN0KHYpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHY7XG5cdCAgfTtcblx0fTtcblx0dmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcblx0dmFyIGtGYWxzZSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLmtGYWxzZSA9IGtvbnN0KGZhbHNlKTtcblx0dmFyIG5vb3AgPSBleHBvcnRzLm5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cdHZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG5cdCAgcmV0dXJuIHY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBjaGVjayh2YWx1ZSwgcHJlZGljYXRlLCBlcnJvcikge1xuXHQgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcblx0ICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdCAgfVxuXHR9XG5cdFxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRmdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgIHJldHVybiBpcy5ub3RVbmRlZihvYmplY3QpICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdH1cblx0XG5cdHZhciBpcyA9IGV4cG9ydHMuaXMgPSB7XG5cdCAgdW5kZWY6IGZ1bmN0aW9uIHVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIG5vdFVuZGVmOiBmdW5jdGlvbiBub3RVbmRlZih2KSB7XG5cdCAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG5cdCAgfSxcblx0ICBmdW5jOiBmdW5jdGlvbiBmdW5jKGYpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9LFxuXHQgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKG4pIHtcblx0ICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG5cdCAgfSxcblx0ICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhzKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuXHQgIH0sXG5cdCAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG5cdCAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICFpcy5hcnJheShvYmopICYmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopKSA9PT0gJ29iamVjdCc7XG5cdCAgfSxcblx0ICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcblx0ICAgIHJldHVybiBwICYmIGlzLmZ1bmMocC50aGVuKTtcblx0ICB9LFxuXHQgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoaXQubmV4dCkgJiYgaXMuZnVuYyhpdC50aHJvdyk7XG5cdCAgfSxcblx0ICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcblx0ICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKFN5bWJvbCkgPyBpcy5mdW5jKGl0W1N5bWJvbC5pdGVyYXRvcl0pIDogaXMuYXJyYXkoaXQpO1xuXHQgIH0sXG5cdCAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG5cdCAgICByZXR1cm4gdCAmJiB0W1RBU0tdO1xuXHQgIH0sXG5cdCAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuXHQgICAgcmV0dXJuIG9iICYmIGlzLmZ1bmMob2Iuc3Vic2NyaWJlKTtcblx0ICB9LFxuXHQgIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuXHQgICAgcmV0dXJuIGJ1ZiAmJiBpcy5mdW5jKGJ1Zi5pc0VtcHR5KSAmJiBpcy5mdW5jKGJ1Zi50YWtlKSAmJiBpcy5mdW5jKGJ1Zi5wdXQpO1xuXHQgIH0sXG5cdCAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcblx0ICAgIHJldHVybiBwYXQgJiYgKGlzLnN0cmluZyhwYXQpIHx8ICh0eXBlb2YgcGF0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXQpKSA9PT0gJ3N5bWJvbCcgfHwgaXMuZnVuYyhwYXQpIHx8IGlzLmFycmF5KHBhdCkpO1xuXHQgIH0sXG5cdCAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoICYmIGlzLmZ1bmMoY2gudGFrZSkgJiYgaXMuZnVuYyhjaC5jbG9zZSk7XG5cdCAgfSxcblx0ICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGl0W0hFTFBFUl07XG5cdCAgfSxcblx0ICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuXHQgICAgcmV0dXJuIGlzLmZ1bmMoZikgJiYgaGFzT3duKGYsICd0b1N0cmluZycpO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBvYmplY3QgPSBleHBvcnRzLm9iamVjdCA9IHtcblx0ICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuXHQgICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKGhhc093bihzb3VyY2UsIGkpKSB7XG5cdCAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG5cdCAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblx0ICBpZiAoaW5kZXggPj0gMCkge1xuXHQgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBhcnJheSA9IGV4cG9ydHMuYXJyYXkgPSB7XG5cdCAgZnJvbTogZnVuY3Rpb24gZnJvbShvYmopIHtcblx0ICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChoYXNPd24ob2JqLCBpKSkge1xuXHQgICAgICAgIGFycltpXSA9IG9ialtpXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGFycjtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBkZWZlcnJlZCgpIHtcblx0ICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgZGVmID0gX2V4dGVuZHMoe30sIHByb3BzKTtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcblx0ICAgIGRlZi5yZWplY3QgPSByZWplY3Q7XG5cdCAgfSk7XG5cdCAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuXHQgIHJldHVybiBkZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFycmF5T2ZEZWZmZXJlZChsZW5ndGgpIHtcblx0ICB2YXIgYXJyID0gW107XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHQgICAgYXJyLnB1c2goZGVmZXJyZWQoKSk7XG5cdCAgfVxuXHQgIHJldHVybiBhcnI7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlbGF5KG1zKSB7XG5cdCAgdmFyIHZhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblx0XG5cdCAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcblx0ICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdCAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcblx0ICAgIH0sIG1zKTtcblx0ICB9KTtcblx0XG5cdCAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiBwcm9taXNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVNb2NrVGFzaygpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgdmFyIHJ1bm5pbmcgPSB0cnVlO1xuXHQgIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBfZXJyb3IgPSB2b2lkIDA7XG5cdFxuXHQgIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcblx0ICAgIHJldHVybiBydW5uaW5nO1xuXHQgIH0sIF9yZWYucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgcmV0dXJuIF9yZXN1bHQ7XG5cdCAgfSwgX3JlZi5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgcmV0dXJuIF9lcnJvcjtcblx0ICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcblx0ICAgIHJldHVybiBydW5uaW5nID0gYjtcblx0ICB9LCBfcmVmLnNldFJlc3VsdCA9IGZ1bmN0aW9uIHNldFJlc3VsdChyKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG5cdCAgfSwgX3JlZi5zZXRFcnJvciA9IGZ1bmN0aW9uIHNldEVycm9yKGUpIHtcblx0ICAgIHJldHVybiBfZXJyb3IgPSBlO1xuXHQgIH0sIF9yZWY7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGF1dG9JbmMoKSB7XG5cdCAgdmFyIHNlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gKytzZWVkO1xuXHQgIH07XG5cdH1cblx0XG5cdHZhciB1aWQgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy51aWQgPSBhdXRvSW5jKCk7XG5cdFxuXHR2YXIga1Rocm93ID0gZnVuY3Rpb24ga1Rocm93KGVycikge1xuXHQgIHRocm93IGVycjtcblx0fTtcblx0dmFyIGtSZXR1cm4gPSBmdW5jdGlvbiBrUmV0dXJuKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiB0cnVlIH07XG5cdH07XG5cdGZ1bmN0aW9uIG1ha2VJdGVyYXRvcihuZXh0KSB7XG5cdCAgdmFyIHRocm8gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGtUaHJvdztcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgdmFyIGlzSGVscGVyID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblx0XG5cdCAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3I7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gaXRlcmF0b3I7XG5cdH1cblx0XG5cdC8qKlxuXHQgIFByaW50IGVycm9yIGluIGEgdXNlZnVsIHdheSB3aGV0aGVyIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG5cdCAgKHRleHQtb25seSBsb2cgb3V0cHV0KVxuXHQgKiovXG5cdGZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuXHQgIHZhciBlcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdFxuXHQgIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG5cdCAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICBjb25zb2xlLmxvZygncmVkdXgtc2FnYSAnICsgbGV2ZWwgKyAnOiAnICsgbWVzc2FnZSArICdcXG4nICsgKGVycm9yICYmIGVycm9yLnN0YWNrIHx8IGVycm9yKSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgZGVwcmVjYXRpb25XYXJuaW5nKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JykgbG9nKCd3YXJuJywgZGVwcmVjYXRpb25XYXJuaW5nKTtcblx0ICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuXHQgIHJldHVybiBkZXByZWNhdGVkICsgJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mICcgKyBwcmVmZXJyZWQgKyAnLCBwbGVhc2UgdXBkYXRlIHlvdXIgY29kZSc7XG5cdH07XG5cdFxuXHR2YXIgaW50ZXJuYWxFcnIgPSBleHBvcnRzLmludGVybmFsRXJyID0gZnVuY3Rpb24gaW50ZXJuYWxFcnIoZXJyKSB7XG5cdCAgcmV0dXJuIG5ldyBFcnJvcignXFxuICByZWR1eC1zYWdhOiBFcnJvciBjaGVja2luZyBob29rcyBkZXRlY3RlZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIFRoaXMgaXMgbGlrZWx5IGEgYnVnXFxuICBpbiByZWR1eC1zYWdhIGNvZGUgYW5kIG5vdCB5b3Vycy4gVGhhbmtzIGZvciByZXBvcnRpbmcgdGhpcyBpbiB0aGUgcHJvamVjdFxcJ3MgZ2l0aHViIHJlcG8uXFxuICBFcnJvcjogJyArIGVyciArICdcXG4nKTtcblx0fTtcblx0XG5cdHZhciBjcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGV4cG9ydHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcgPSBmdW5jdGlvbiBjcmVhdGVTZXRDb250ZXh0V2FybmluZyhjdHgsIHByb3BzKSB7XG5cdCAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcblx0fTtcblx0XG5cdHZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdCAgICByZXR1cm4gZGlzcGF0Y2goT2JqZWN0LmRlZmluZVByb3BlcnR5KGFjdGlvbiwgU0FHQV9BQ1RJT04sIHsgdmFsdWU6IHRydWUgfSkpO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBoaXN0b3J5ID0gW107XG5cdCAgICB2YXIgZ2VuID0gZ2VuZXJhdG9yRnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcblx0ICAgICAgICBoaXN0b3J5LnB1c2goYXJnKTtcblx0ICAgICAgICByZXR1cm4gZ2VuLm5leHQoYXJnKTtcblx0ICAgICAgfSxcblx0ICAgICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKCkge1xuXHQgICAgICAgIHZhciBjbG9uZWRHZW4gPSBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHQgICAgICAgICAgcmV0dXJuIGNsb25lZEdlbi5uZXh0KGFyZyk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcblx0ICAgICAgfSxcblx0ICAgICAgcmV0dXJuOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuXHQgICAgICB9LFxuXHQgICAgICB0aHJvdzogZnVuY3Rpb24gX3Rocm93KGV4Y2VwdGlvbikge1xuXHQgICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9O1xuXHR9O1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5UQVNLX0NBTkNFTCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBwcm9jO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MSk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0ZnVuY3Rpb24gX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKG9iaiwgZGVzY3MpIHsgZm9yICh2YXIga2V5IGluIGRlc2NzKSB7IHZhciBkZXNjID0gZGVzY3Nba2V5XTsgZGVzYy5jb25maWd1cmFibGUgPSBkZXNjLmVudW1lcmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIGRlc2Mud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkQgPSBleHBvcnRzLkNIQU5ORUxfRU5EID0ge1xuXHQgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgIHJldHVybiAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcblx0ICB9XG5cdH07XG5cdHZhciBUQVNLX0NBTkNFTCA9IGV4cG9ydHMuVEFTS19DQU5DRUwgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuXHQgIH1cblx0fTtcblx0XG5cdHZhciBtYXRjaGVycyA9IHtcblx0ICB3aWxkY2FyZDogZnVuY3Rpb24gd2lsZGNhcmQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuXHQgIH0sXG5cdCAgZGVmYXVsdDogZnVuY3Rpb24gX2RlZmF1bHQocGF0dGVybikge1xuXHQgICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gcGF0dGVybjtcblx0ICAgIH0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcblx0ICAgIH07XG5cdCAgfSxcblx0ICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHApIHtcblx0ICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIHByZWRpY2F0ZTogZnVuY3Rpb24gcHJlZGljYXRlKF9wcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuXHQgICAgfTtcblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBtYXRjaGVyKHBhdHRlcm4pIHtcblx0ICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICByZXR1cm4gKHBhdHRlcm4gPT09ICcqJyA/IG1hdGNoZXJzLndpbGRjYXJkIDogX3V0aWxzLmlzLmFycmF5KHBhdHRlcm4pID8gbWF0Y2hlcnMuYXJyYXkgOiBfdXRpbHMuaXMuc3RyaW5nYWJsZUZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5kZWZhdWx0IDogX3V0aWxzLmlzLmZ1bmMocGF0dGVybikgPyBtYXRjaGVycy5wcmVkaWNhdGUgOiBtYXRjaGVycy5kZWZhdWx0KShwYXR0ZXJuKTtcblx0fVxuXHRcblx0LyoqXG5cdCAgVXNlZCB0byB0cmFjayBhIHBhcmVudCB0YXNrIGFuZCBpdHMgZm9ya3Ncblx0ICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcblx0ICBXZSBtb2RlbCB0aGlzIHVzaW5nIHRoZSBjb25jZXB0IG9mIFBhcmVudCB0YXNrICYmIG1haW4gVGFza1xuXHQgIG1haW4gdGFzayBpcyB0aGUgbWFpbiBmbG93IG9mIHRoZSBjdXJyZW50IEdlbmVyYXRvciwgdGhlIHBhcmVudCB0YXNrcyBpcyB0aGVcblx0ICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuXHQgIFRodXMgdGhlIHdob2xlIG1vZGVsIHJlcHJlc2VudHMgYW4gZXhlY3V0aW9uIHRyZWUgd2l0aCBtdWx0aXBsZSBicmFuY2hlcyAodnMgdGhlXG5cdCAgbGluZWFyIGV4ZWN1dGlvbiB0cmVlIGluIHNlcXVlbnRpYWwgKG5vbiBwYXJhbGxlbCkgcHJvZ3JhbW1pbmcpXG5cdFxuXHQgIEEgcGFyZW50IHRhc2tzIGhhcyB0aGUgZm9sbG93aW5nIHNlbWFudGljc1xuXHQgIC0gSXQgY29tcGxldGVzIGlmIGFsbCBpdHMgZm9ya3MgZWl0aGVyIGNvbXBsZXRlIG9yIGFsbCBjYW5jZWxsZWRcblx0ICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG5cdCAgLSBJdCBhYm9ydHMgaWYgYW55IHVuY2F1Z2h0IGVycm9yIGJ1YmJsZXMgdXAgZnJvbSBmb3Jrc1xuXHQgIC0gSWYgaXQgY29tcGxldGVzLCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIG1haW4gdGFza1xuXHQqKi9cblx0ZnVuY3Rpb24gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBjYikge1xuXHQgIHZhciB0YXNrcyA9IFtdLFxuXHQgICAgICByZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuXHQgIGFkZFRhc2sobWFpblRhc2spO1xuXHRcblx0ICBmdW5jdGlvbiBhYm9ydChlcnIpIHtcblx0ICAgIGNhbmNlbEFsbCgpO1xuXHQgICAgY2IoZXJyLCB0cnVlKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuXHQgICAgdGFza3MucHVzaCh0YXNrKTtcblx0ICAgIHRhc2suY29udCA9IGZ1bmN0aW9uIChyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgICgwLCBfdXRpbHMucmVtb3ZlKSh0YXNrcywgdGFzayk7XG5cdCAgICAgIHRhc2suY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICBhYm9ydChyZXMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIGNiKHJlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICB0YXNrcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuXHQgICAgICB0LmNhbmNlbCgpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrcyA9IFtdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGFkZFRhc2s6IGFkZFRhc2ssXG5cdCAgICBjYW5jZWxBbGw6IGNhbmNlbEFsbCxcblx0ICAgIGFib3J0OiBhYm9ydCxcblx0ICAgIGdldFRhc2tzOiBmdW5jdGlvbiBnZXRUYXNrcygpIHtcblx0ICAgICAgcmV0dXJuIHRhc2tzO1xuXHQgICAgfSxcblx0ICAgIHRhc2tOYW1lczogZnVuY3Rpb24gdGFza05hbWVzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgICAgcmV0dXJuIHQubmFtZTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcblx0ICB2YXIgY29udGV4dCA9IF9yZWYuY29udGV4dCxcblx0ICAgICAgZm4gPSBfcmVmLmZuLFxuXHQgICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKGZuKSkge1xuXHQgICAgcmV0dXJuIGZuO1xuXHQgIH1cblx0XG5cdCAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgdmFyIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgZXJyb3IgPSB2b2lkIDA7XG5cdCAgdHJ5IHtcblx0ICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgZXJyb3IgPSBlcnI7XG5cdCAgfVxuXHRcblx0ICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3Jcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkpIHtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICAvLyBkbyBub3QgYnViYmxlIHVwIHN5bmNocm9ub3VzIGZhaWx1cmVzIGZvciBkZXRhY2hlZCBmb3Jrc1xuXHQgIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG5cdCAgcmV0dXJuIGVycm9yID8gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IGVycm9yO1xuXHQgIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYyA9IHZvaWQgMDtcblx0ICAgIHZhciBlZmYgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogcmVzdWx0IH07XG5cdCAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgIGlmICghcGMpIHtcblx0ICAgICAgICBwYyA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIGVmZjtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gcmV0KGFyZyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgfSgpKTtcblx0fVxuXHRcblx0dmFyIHdyYXBIZWxwZXIgPSBmdW5jdGlvbiB3cmFwSGVscGVyKGhlbHBlcikge1xuXHQgIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcblx0ICB2YXIgc3Vic2NyaWJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG5cdCAgfTtcblx0ICB2YXIgZGlzcGF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IF91dGlscy5ub29wO1xuXHQgIHZhciBnZXRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiB7fTtcblx0ICB2YXIgcGFyZW50RWZmZWN0SWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuXHQgIHZhciBjb250ID0gYXJndW1lbnRzWzhdO1xuXHRcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXHRcblx0ICB2YXIgZWZmZWN0c1N0cmluZyA9ICdbLi4uZWZmZWN0c10nO1xuXHQgIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0ICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG5cdCAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IoZXJyKSB7XG5cdCAgICB2YXIgbWVzc2FnZSA9IGVyci5zYWdhU3RhY2s7XG5cdFxuXHQgICAgaWYgKCFtZXNzYWdlICYmIGVyci5zdGFjaykge1xuXHQgICAgICBtZXNzYWdlID0gZXJyLnN0YWNrLnNwbGl0KCdcXG4nKVswXS5pbmRleE9mKGVyci5tZXNzYWdlKSAhPT0gLTEgPyBlcnIuc3RhY2sgOiAnRXJyb3I6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICsgZXJyLnN0YWNrO1xuXHQgICAgfVxuXHRcblx0ICAgIGxvZygnZXJyb3InLCAndW5jYXVnaHQgYXQgJyArIG5hbWUsIG1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKTtcblx0ICB9O1xuXHQgIHZhciBzdGRDaGFubmVsID0gKDAsIF9jaGFubmVsLnN0ZENoYW5uZWwpKHN1YnNjcmliZSk7XG5cdCAgdmFyIHRhc2tDb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRDb250ZXh0KTtcblx0ICAvKipcblx0ICAgIFRyYWNrcyB0aGUgY3VycmVudCBlZmZlY3QgY2FuY2VsbGF0aW9uXG5cdCAgICBFYWNoIHRpbWUgdGhlIGdlbmVyYXRvciBwcm9ncmVzc2VzLiBjYWxsaW5nIHJ1bkVmZmVjdCB3aWxsIHNldCBhIG5ldyB2YWx1ZVxuXHQgICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuXHQgICoqL1xuXHQgIG5leHQuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdFxuXHQgIC8qKlxuXHQgICAgQ3JlYXRlcyBhIG5ldyB0YXNrIGRlc2NyaXB0b3IgZm9yIHRoaXMgZ2VuZXJhdG9yLCBXZSdsbCBhbHNvIGNyZWF0ZSBhIG1haW4gdGFza1xuXHQgICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG5cdCAgKiovXG5cdCAgdmFyIHRhc2sgPSBuZXdUYXNrKHBhcmVudEVmZmVjdElkLCBuYW1lLCBpdGVyYXRvciwgY29udCk7XG5cdCAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuXHQgIHZhciB0YXNrUXVldWUgPSBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGVuZCk7XG5cdFxuXHQgIC8qKlxuXHQgICAgY2FuY2VsbGF0aW9uIG9mIHRoZSBtYWluIHRhc2suIFdlJ2xsIHNpbXBseSByZXN1bWUgdGhlIEdlbmVyYXRvciB3aXRoIGEgQ2FuY2VsXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcblx0ICAgIGlmIChtYWluVGFzay5pc1J1bm5pbmcgJiYgIW1haW5UYXNrLmlzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICAvKipcblx0ICAgIFRoaXMgbWF5IGJlIGNhbGxlZCBieSBhIHBhcmVudCBnZW5lcmF0b3IgdG8gdHJpZ2dlci9wcm9wYWdhdGUgY2FuY2VsbGF0aW9uXG5cdCAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cblx0ICAgICBDYW5jZWxsYXRpb24gcHJvcGFnYXRlcyBkb3duIHRvIHRoZSB3aG9sZSBleGVjdXRpb24gdHJlZSBob2xkZWQgYnkgdGhpcyBQYXJlbnQgdGFza1xuXHQgICAgSXQncyBhbHNvIHByb3BhZ2F0ZWQgdG8gYWxsIGpvaW5lcnMgb2YgdGhpcyB0YXNrIGFuZCB0aGVpciBleGVjdXRpb24gdHJlZS9qb2luZXJzXG5cdCAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgLyoqXG5cdCAgICAgIFdlIG5lZWQgdG8gY2hlY2sgYm90aCBSdW5uaW5nIGFuZCBDYW5jZWxsZWQgc3RhdHVzXG5cdCAgICAgIFRhc2tzIGNhbiBiZSBDYW5jZWxsZWQgYnV0IHN0aWxsIFJ1bm5pbmdcblx0ICAgICoqL1xuXHQgICAgaWYgKGl0ZXJhdG9yLl9pc1J1bm5pbmcgJiYgIWl0ZXJhdG9yLl9pc0NhbmNlbGxlZCkge1xuXHQgICAgICBpdGVyYXRvci5faXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIEVuZGluZyB3aXRoIGEgTmV2ZXIgcmVzdWx0IHdpbGwgcHJvcGFnYXRlIHRoZSBDYW5jZWxsYXRpb24gdG8gYWxsIGpvaW5lcnNcblx0ICAgICAgKiovXG5cdCAgICAgIGVuZChUQVNLX0NBTkNFTCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAgYXR0YWNoZXMgY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHRoaXMgdGFzaydzIGNvbnRpbnVhdGlvblxuXHQgICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cblx0ICAqKi9cblx0ICBjb250ICYmIChjb250LmNhbmNlbCA9IGNhbmNlbCk7XG5cdFxuXHQgIC8vIHRyYWNrcyB0aGUgcnVubmluZyBzdGF0dXNcblx0ICBpdGVyYXRvci5faXNSdW5uaW5nID0gdHJ1ZTtcblx0XG5cdCAgLy8ga2lja3MgdXAgdGhlIGdlbmVyYXRvclxuXHQgIG5leHQoKTtcblx0XG5cdCAgLy8gdGhlbiByZXR1cm4gdGhlIHRhc2sgZGVzY3JpcHRvciB0byB0aGUgY2FsbGVyXG5cdCAgcmV0dXJuIHRhc2s7XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBpcyB0aGUgZ2VuZXJhdG9yIGRyaXZlclxuXHQgICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG5cdCAgICB1bnRpbCB0aGUgZ2VuZXJhdG9yIHRlcm1pbmF0ZXMgb3IgdGhyb3dzXG5cdCAgKiovXG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG5cdCAgICAvLyBQcmV2ZW50aXZlIG1lYXN1cmUuIElmIHdlIGVuZCB1cCBoZXJlLCB0aGVuIHRoZXJlIGlzIHJlYWxseSBzb21ldGhpbmcgd3Jvbmdcblx0ICAgIGlmICghbWFpblRhc2suaXNSdW5uaW5nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuXHQgICAgfVxuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuXHQgICAgICAgICAgV2UgY2FuIGdldCB0aGlzIHZhbHVlIGhlcmVcblx0ICAgICAgICAgICAtIEJ5IGNhbmNlbGxpbmcgdGhlIHBhcmVudCB0YXNrIG1hbnVhbGx5XG5cdCAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuXHQgICAgICAgICoqL1xuXHQgICAgICAgIG1haW5UYXNrLmlzQ2FuY2VsbGVkID0gdHJ1ZTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIENhbmNlbHMgdGhlIGN1cnJlbnQgZWZmZWN0OyB0aGlzIHdpbGwgcHJvcGFnYXRlIHRoZSBjYW5jZWxsYXRpb24gZG93biB0byBhbnkgY2FsbGVkIHRhc2tzXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbmV4dC5jYW5jZWwoKTtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgIElmIHRoaXMgR2VuZXJhdG9yIGhhcyBhIGByZXR1cm5gIG1ldGhvZCB0aGVuIGludm9rZXMgaXRcblx0ICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgcmVzdWx0ID0gX3V0aWxzLmlzLmZ1bmMoaXRlcmF0b3IucmV0dXJuKSA/IGl0ZXJhdG9yLnJldHVybihUQVNLX0NBTkNFTCkgOiB7IGRvbmU6IHRydWUsIHZhbHVlOiBUQVNLX0NBTkNFTCB9O1xuXHQgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcblx0ICAgICAgICAvLyBXZSBnZXQgQ0hBTk5FTF9FTkQgYnkgdGFraW5nIGZyb20gYSBjaGFubmVsIHRoYXQgZW5kZWQgdXNpbmcgYHRha2VgIChhbmQgbm90IGB0YWtlbWAgdXNlZCB0byB0cmFwIEVuZCBvZiBjaGFubmVscylcblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKCkgOiB7IGRvbmU6IHRydWUgfTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KGFyZyk7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICghcmVzdWx0LmRvbmUpIHtcblx0ICAgICAgICBydW5FZmZlY3QocmVzdWx0LnZhbHVlLCBwYXJlbnRFZmZlY3RJZCwgJycsIG5leHQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgVGhpcyBHZW5lcmF0b3IgaGFzIGVuZGVkLCB0ZXJtaW5hdGUgdGhlIG1haW4gdGFzayBhbmQgbm90aWZ5IHRoZSBmb3JrIHF1ZXVlXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICAgIG1haW5UYXNrLmNvbnQgJiYgbWFpblRhc2suY29udChyZXN1bHQudmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBpZiAobWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0ICAgICAgbWFpblRhc2suaXNNYWluUnVubmluZyA9IGZhbHNlO1xuXHQgICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVuZChyZXN1bHQsIGlzRXJyKSB7XG5cdCAgICBpdGVyYXRvci5faXNSdW5uaW5nID0gZmFsc2U7XG5cdCAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG5cdCAgICBpZiAoIWlzRXJyKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9yZXN1bHQgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcblx0ICAgICAgICAgIHZhbHVlOiAnYXQgJyArIG5hbWUgKyAnIFxcbiAnICsgKHJlc3VsdC5zYWdhU3RhY2sgfHwgcmVzdWx0LnN0YWNrKSxcblx0ICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghdGFzay5jb250KSB7XG5cdCAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcblx0ICAgICAgICAgIG9uRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuXHQgICAgICBpdGVyYXRvci5faXNBYm9ydGVkID0gdHJ1ZTtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZWplY3QocmVzdWx0KTtcblx0ICAgIH1cblx0ICAgIHRhc2suY29udCAmJiB0YXNrLmNvbnQocmVzdWx0LCBpc0Vycik7XG5cdCAgICB0YXNrLmpvaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuXHQgICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcblx0ICAgIH0pO1xuXHQgICAgdGFzay5qb2luZXJzID0gbnVsbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkVmZmVjdChlZmZlY3QsIHBhcmVudEVmZmVjdElkKSB7XG5cdCAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXHQgICAgdmFyIGNiID0gYXJndW1lbnRzWzNdO1xuXHRcblx0ICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuXHQgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCBwYXJlbnRFZmZlY3RJZDogcGFyZW50RWZmZWN0SWQsIGxhYmVsOiBsYWJlbCwgZWZmZWN0OiBlZmZlY3QgfSk7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIGNvbXBsZXRpb24gY2FsbGJhY2sgYW5kIGNhbmNlbCBjYWxsYmFjayBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG5cdCAgICAgIFdlIGNhbid0IGNhbmNlbCBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3Rcblx0ICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG5cdCAgICAqKi9cblx0ICAgIHZhciBlZmZlY3RTZXR0bGVkID0gdm9pZCAwO1xuXHRcblx0ICAgIC8vIENvbXBsZXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBhcHByb3ByaWF0ZSBlZmZlY3QgcnVubmVyXG5cdCAgICBmdW5jdGlvbiBjdXJyQ2IocmVzLCBpc0Vycikge1xuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIGNiLmNhbmNlbCA9IF91dGlscy5ub29wOyAvLyBkZWZlbnNpdmUgbWVhc3VyZVxuXHQgICAgICBpZiAoc2FnYU1vbml0b3IpIHtcblx0ICAgICAgICBpc0VyciA/IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkKGVmZmVjdElkLCByZXMpIDogc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHJlcyk7XG5cdCAgICAgIH1cblx0ICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICB9XG5cdCAgICAvLyB0cmFja3MgZG93biB0aGUgY3VycmVudCBjYW5jZWxcblx0ICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgICAvLyBzZXR1cCBjYW5jZWxsYXRpb24gbG9naWMgb24gdGhlIHBhcmVudCBjYlxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBwcmV2ZW50cyBjYW5jZWxsaW5nIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG5cdCAgICAgIC8qKlxuXHQgICAgICAgIHByb3BhZ2F0ZXMgY2FuY2VsIGRvd253YXJkXG5cdCAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuXHQgICAgICAgIGNhbGxiYWNrLCBsb2cgZXJyb3JzIHJhaXNlZCBkdXJpbmcgY2FuY2VsbGF0aW9ucyBpbnRvIHRoZSBjb25zb2xlXG5cdCAgICAgICoqL1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGN1cnJDYi5jYW5jZWwoKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgbG9nRXJyb3IoZXJyKTtcblx0ICAgICAgfVxuXHQgICAgICBjdXJyQ2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdFxuXHQgICAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RDYW5jZWxsZWQoZWZmZWN0SWQpO1xuXHQgICAgfTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgZWFjaCBlZmZlY3QgcnVubmVyIG11c3QgYXR0YWNoIGl0cyBvd24gbG9naWMgb2YgY2FuY2VsbGF0aW9uIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuXHQgICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cblx0ICAgICAgIEFUVEVOVElPTiEgZWZmZWN0IHJ1bm5lcnMgbXVzdCBzZXR1cCB0aGUgY2FuY2VsIGxvZ2ljIGJ5IHNldHRpbmcgY2IuY2FuY2VsID0gW2NhbmNlbE1ldGhvZF1cblx0ICAgICAgQW5kIHRoZSBzZXR1cCBtdXN0IG9jY3VyIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFja1xuXHQgICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG5cdCAgICAgIGZvciBjb21wbGV0aW5nIHRoZSBmbG93IGJ5IGNhbGxpbmcgdGhlIHByb3ZpZGVkIGNvbnRpbnVhdGlvbjsgd2hpbGUgY2FsbGVyIGZ1bmN0aW9uc1xuXHQgICAgICBhcmUgcmVzcG9uc2libGUgZm9yIGFib3J0aW5nIHRoZSBjdXJyZW50IGZsb3cgYnkgY2FsbGluZyB0aGUgYXR0YWNoZWQgY2FuY2VsIGZ1bmN0aW9uXG5cdCAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG5cdCAgICAgIHByb21pc2VbQ0FOQ0VMXSBtZXRob2QgaW4gdGhlaXIgcmV0dXJuZWQgcHJvbWlzZXNcblx0ICAgICAgQVRURU5USU9OISBjYWxsaW5nIGNhbmNlbCBtdXN0IGhhdmUgbm8gZWZmZWN0IG9uIGFuIGFscmVhZHkgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBlZmZlY3Rcblx0ICAgICoqL1xuXHQgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cdCAgICAvLyBwcmV0dGllci1pZ25vcmVcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIC8vIE5vbiBkZWNsYXJhdGl2ZSBlZmZlY3Rcblx0ICAgICAgX3V0aWxzLmlzLnByb21pc2UoZWZmZWN0KSA/IHJlc29sdmVQcm9taXNlKGVmZmVjdCwgY3VyckNiKSA6IF91dGlscy5pcy5oZWxwZXIoZWZmZWN0KSA/IHJ1bkZvcmtFZmZlY3Qod3JhcEhlbHBlcihlZmZlY3QpLCBlZmZlY3RJZCwgY3VyckNiKSA6IF91dGlscy5pcy5pdGVyYXRvcihlZmZlY3QpID8gcmVzb2x2ZUl0ZXJhdG9yKGVmZmVjdCwgZWZmZWN0SWQsIG5hbWUsIGN1cnJDYilcblx0XG5cdCAgICAgIC8vIGRlY2xhcmF0aXZlIGVmZmVjdHNcblx0ICAgICAgOiBfdXRpbHMuaXMuYXJyYXkoZWZmZWN0KSA/IHJ1blBhcmFsbGVsRWZmZWN0KGVmZmVjdCwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC50YWtlKGVmZmVjdCkpID8gcnVuVGFrZUVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QucHV0KGVmZmVjdCkpID8gcnVuUHV0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hbGwoZWZmZWN0KSkgPyBydW5BbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5yYWNlKGVmZmVjdCkpID8gcnVuUmFjZUVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbGwoZWZmZWN0KSkgPyBydW5DYWxsRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY3BzKGVmZmVjdCkpID8gcnVuQ1BTRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5mb3JrKGVmZmVjdCkpID8gcnVuRm9ya0VmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmpvaW4oZWZmZWN0KSkgPyBydW5Kb2luRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jYW5jZWwoZWZmZWN0KSkgPyBydW5DYW5jZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNlbGVjdChlZmZlY3QpKSA/IHJ1blNlbGVjdEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuYWN0aW9uQ2hhbm5lbChlZmZlY3QpKSA/IHJ1bkNoYW5uZWxFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZsdXNoKGVmZmVjdCkpID8gcnVuRmx1c2hFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbGxlZChlZmZlY3QpKSA/IHJ1bkNhbmNlbGxlZEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZ2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1bkdldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnNldENvbnRleHQoZWZmZWN0KSkgPyBydW5TZXRDb250ZXh0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAvKiBhbnl0aGluZyBlbHNlIHJldHVybmVkIGFzIGlzICovY3VyckNiKGVmZmVjdClcblx0ICAgICk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuXHQgICAgdmFyIGNhbmNlbFByb21pc2UgPSBwcm9taXNlW191dGlscy5DQU5DRUxdO1xuXHQgICAgaWYgKF91dGlscy5pcy5mdW5jKGNhbmNlbFByb21pc2UpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pcy5mdW5jKHByb21pc2UuYWJvcnQpKSB7XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuXHQgICAgICB9O1xuXHQgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgdGhlIGZldGNoIEFQSSwgd2hlbmV2ZXIgdGhleSBnZXQgYXJvdW5kIHRvXG5cdCAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuXHQgICAgfVxuXHQgICAgcHJvbWlzZS50aGVuKGNiLCBmdW5jdGlvbiAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUl0ZXJhdG9yKGl0ZXJhdG9yLCBlZmZlY3RJZCwgbmFtZSwgY2IpIHtcblx0ICAgIHByb2MoaXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIG5hbWUsIGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blRha2VFZmZlY3QoX3JlZjIsIGNiKSB7XG5cdCAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG5cdCAgICAgICAgcGF0dGVybiA9IF9yZWYyLnBhdHRlcm4sXG5cdCAgICAgICAgbWF5YmUgPSBfcmVmMi5tYXliZTtcblx0XG5cdCAgICBjaGFubmVsID0gY2hhbm5lbCB8fCBzdGRDaGFubmVsO1xuXHQgICAgdmFyIHRha2VDYiA9IGZ1bmN0aW9uIHRha2VDYihpbnApIHtcblx0ICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuXHQgICAgfTtcblx0ICAgIHRyeSB7XG5cdCAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuXHQgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnIsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgY2IuY2FuY2VsID0gdGFrZUNiLmNhbmNlbDtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blB1dEVmZmVjdChfcmVmMywgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjMuY2hhbm5lbCxcblx0ICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG5cdCAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmU7XG5cdFxuXHQgICAgLyoqXG5cdCAgICAgIFNjaGVkdWxlIHRoZSBwdXQgaW4gY2FzZSBhbm90aGVyIHNhZ2EgaXMgaG9sZGluZyBhIGxvY2suXG5cdCAgICAgIFRoZSBwdXQgd2lsbCBiZSBleGVjdXRlZCBhdG9taWNhbGx5LiBpZSBuZXN0ZWQgcHV0cyB3aWxsIGV4ZWN1dGUgYWZ0ZXJcblx0ICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG5cdCAgICAqKi9cblx0ICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQgPSAoY2hhbm5lbCA/IGNoYW5uZWwucHV0IDogZGlzcGF0Y2gpKGFjdGlvbik7XG5cdCAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNoYW5uZWwgb3IgYHB1dC5yZXNvbHZlYCB3YXMgdXNlZCB0aGVuIGJ1YmJsZSB1cCB0aGUgZXJyb3IuXG5cdCAgICAgICAgaWYgKGNoYW5uZWwgfHwgcmVzb2x2ZSkgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgICAgICBsb2dFcnJvcihlcnJvcik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcblx0ICAgICAgICByZXNvbHZlUHJvbWlzZShyZXN1bHQsIGNiKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIgY29udGV4dCA9IF9yZWY0LmNvbnRleHQsXG5cdCAgICAgICAgZm4gPSBfcmVmNC5mbixcblx0ICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblx0XG5cdCAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjUuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY1LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXHRcblx0ICAgIC8vIENQUyAoaWUgbm9kZSBzdHlsZSBmdW5jdGlvbnMpIGNhbiBkZWZpbmUgdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpY1xuXHQgICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cdFxuXHQgICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgY3BzQ2IgPSBmdW5jdGlvbiBjcHNDYihlcnIsIHJlcykge1xuXHQgICAgICAgIHJldHVybiBfdXRpbHMuaXMudW5kZWYoZXJyKSA/IGNiKHJlcykgOiBjYihlcnIsIHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChjcHNDYikpO1xuXHQgICAgICBpZiAoY3BzQ2IuY2FuY2VsKSB7XG5cdCAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgcmV0dXJuIGNwc0NiLmNhbmNlbCgpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIHJldHVybiBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjYuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY2LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuXHQgICAgICAgIGRldGFjaGVkID0gX3JlZjYuZGV0YWNoZWQ7XG5cdFxuXHQgICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuXHQgICAgICB2YXIgX3Rhc2sgPSBwcm9jKHRhc2tJdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgZm4ubmFtZSwgZGV0YWNoZWQgPyBudWxsIDogX3V0aWxzLm5vb3ApO1xuXHRcblx0ICAgICAgaWYgKGRldGFjaGVkKSB7XG5cdCAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFkZFRhc2soX3Rhc2spO1xuXHQgICAgICAgICAgY2IoX3Rhc2spO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuXHQgICAgICAgICAgdGFza1F1ZXVlLmFib3J0KHRhc2tJdGVyYXRvci5fZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IGZpbmFsbHkge1xuXHQgICAgICAoMCwgX3NjaGVkdWxlci5mbHVzaCkoKTtcblx0ICAgIH1cblx0ICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuXHQgICAgaWYgKHQuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdmFyIGpvaW5lciA9IHsgdGFzazogdGFzaywgY2I6IGNiIH07XG5cdCAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHQuam9pbmVycywgam9pbmVyKTtcblx0ICAgICAgfTtcblx0ICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHQuaXNBYm9ydGVkKCkgPyBjYih0LmVycm9yKCksIHRydWUpIDogY2IodC5yZXN1bHQoKSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuXHQgICAgaWYgKHRhc2tUb0NhbmNlbCA9PT0gX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbCA9IHRhc2s7XG5cdCAgICB9XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsLmlzUnVubmluZygpKSB7XG5cdCAgICAgIHRhc2tUb0NhbmNlbC5jYW5jZWwoKTtcblx0ICAgIH1cblx0ICAgIGNiKCk7XG5cdCAgICAvLyBjYW5jZWwgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQWxsRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblx0XG5cdCAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciByZXN1bHRzID0ge307XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBmdW5jdGlvbiBjaGVja0VmZmVjdEVuZCgpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gX3V0aWxzLmFycmF5LmZyb20oX2V4dGVuZHMoe30sIHJlc3VsdHMsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXN1bHRzKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHZhciBjaENiQXRLZXkgPSBmdW5jdGlvbiBjaENiQXRLZXkocmVzLCBpc0Vycikge1xuXHQgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRXJyIHx8ICgwLCBfY2hhbm5lbC5pc0VuZCkocmVzKSB8fCByZXMgPT09IENIQU5ORUxfRU5EIHx8IHJlcyA9PT0gVEFTS19DQU5DRUwpIHtcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCBpc0Vycik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcblx0ICAgICAgICAgIGNvbXBsZXRlZENvdW50Kys7XG5cdCAgICAgICAgICBjaGVja0VmZmVjdEVuZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgICAgY2hDYkF0S2V5LmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHQgICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuXHQgICAgfSk7XG5cdFxuXHQgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHRcblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIHJldHVybiBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUmFjZUVmZmVjdChlZmZlY3RzLCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHQgICAgdmFyIGNoaWxkQ2JzID0ge307XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgICAvLyBSYWNlIEF1dG8gY2FuY2VsbGF0aW9uXG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNiKHJlcywgdHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpICYmIHJlcyAhPT0gQ0hBTk5FTF9FTkQgJiYgcmVzICE9PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgdmFyIF9yZXNwb25zZTtcblx0XG5cdCAgICAgICAgICBjYi5jYW5jZWwoKTtcblx0ICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAoX3Jlc3BvbnNlID0ge30sIF9yZXNwb25zZVtrZXldID0gcmVzLCBfcmVzcG9uc2UpO1xuXHQgICAgICAgICAgY2IoX3V0aWxzLmlzLmFycmF5KGVmZmVjdHMpID8gW10uc2xpY2UuY2FsbChfZXh0ZW5kcyh7fSwgcmVzcG9uc2UsIHsgbGVuZ3RoOiBrZXlzLmxlbmd0aCB9KSkgOiByZXNwb25zZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIHVubmVjZXNzYXJ5IGNhbmNlbGxhdGlvblxuXHQgICAgICBpZiAoIWNvbXBsZXRlZCkge1xuXHQgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG5cdCAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgIHJldHVybiBjaGlsZENic1trZXldLmNhbmNlbCgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBydW5FZmZlY3QoZWZmZWN0c1trZXldLCBlZmZlY3RJZCwga2V5LCBjaGlsZENic1trZXldKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2VsZWN0RWZmZWN0KF9yZWY3LCBjYikge1xuXHQgICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG5cdCAgICAgICAgYXJncyA9IF9yZWY3LmFyZ3M7XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHN0YXRlID0gc2VsZWN0b3IuYXBwbHkodW5kZWZpbmVkLCBbZ2V0U3RhdGUoKV0uY29uY2F0KGFyZ3MpKTtcblx0ICAgICAgY2Ioc3RhdGUpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2hhbm5lbEVmZmVjdChfcmVmOCwgY2IpIHtcblx0ICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcblx0ICAgICAgICBidWZmZXIgPSBfcmVmOC5idWZmZXI7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcblx0ICAgIG1hdGNoLnBhdHRlcm4gPSBwYXR0ZXJuO1xuXHQgICAgY2IoKDAsIF9jaGFubmVsLmV2ZW50Q2hhbm5lbCkoc3Vic2NyaWJlLCBidWZmZXIgfHwgX2J1ZmZlcnMuYnVmZmVycy5maXhlZCgpLCBtYXRjaCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGNiKSB7XG5cdCAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG5cdCAgICBjaGFubmVsLmZsdXNoKGNiKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkdldENvbnRleHRFZmZlY3QocHJvcCwgY2IpIHtcblx0ICAgIGNiKHRhc2tDb250ZXh0W3Byb3BdKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1blNldENvbnRleHRFZmZlY3QocHJvcHMsIGNiKSB7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgY2IoKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIG5ld1Rhc2soaWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KSB7XG5cdCAgICB2YXIgX2RvbmUsIF9yZWY5LCBfbXV0YXRvck1hcDtcblx0XG5cdCAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBudWxsO1xuXHQgICAgcmV0dXJuIF9yZWY5ID0ge30sIF9yZWY5W191dGlscy5UQVNLXSA9IHRydWUsIF9yZWY5LmlkID0gaWQsIF9yZWY5Lm5hbWUgPSBuYW1lLCBfZG9uZSA9ICdkb25lJywgX211dGF0b3JNYXAgPSB7fSwgX211dGF0b3JNYXBbX2RvbmVdID0gX211dGF0b3JNYXBbX2RvbmVdIHx8IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0uZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5wcm9taXNlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuXHQgICAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IGRlZjtcblx0ICAgICAgICBpZiAoIWl0ZXJhdG9yLl9pc1J1bm5pbmcpIHtcblx0ICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG5cdCAgICAgIH1cblx0ICAgIH0sIF9yZWY5LmNvbnQgPSBjb250LCBfcmVmOS5qb2luZXJzID0gW10sIF9yZWY5LmNhbmNlbCA9IGNhbmNlbCwgX3JlZjkuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX2lzUnVubmluZztcblx0ICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNDYW5jZWxsZWQ7XG5cdCAgICB9LCBfcmVmOS5pc0Fib3J0ZWQgPSBmdW5jdGlvbiBpc0Fib3J0ZWQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuXHQgICAgfSwgX3JlZjkucmVzdWx0ID0gZnVuY3Rpb24gcmVzdWx0KCkge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3IuX3Jlc3VsdDtcblx0ICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fZXJyb3I7XG5cdCAgICB9LCBfcmVmOS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuXHQgICAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuXHQgICAgfSwgX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzKF9yZWY5LCBfbXV0YXRvck1hcCksIF9yZWY5O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5hc2FwID0gYXNhcDtcblx0ZXhwb3J0cy5zdXNwZW5kID0gc3VzcGVuZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHR2YXIgcXVldWUgPSBbXTtcblx0LyoqXG5cdCAgVmFyaWFibGUgdG8gaG9sZCBhIGNvdW50aW5nIHNlbWFwaG9yZVxuXHQgIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3Rcblx0ICAgIGFscmVhZHkgc3VzcGVuZGVkKVxuXHQgIC0gRGVjcmVtZW50aW5nIHJlbGVhc2VzIGEgbG9jay4gWmVybyBsb2NrcyBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLiBUaGlzXG5cdCAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuXHQqKi9cblx0dmFyIHNlbWFwaG9yZSA9IDA7XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBhIHRhc2sgJ2F0b21pY2FsbHknLiBUYXNrcyBzY2hlZHVsZWQgZHVyaW5nIHRoaXMgZXhlY3V0aW9uIHdpbGwgYmUgcXVldWVkXG5cdCAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG5cdCAgc3RhdGUpLlxuXHQqKi9cblx0ZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG5cdCAgdHJ5IHtcblx0ICAgIHN1c3BlbmQoKTtcblx0ICAgIHRhc2soKTtcblx0ICB9IGZpbmFsbHkge1xuXHQgICAgcmVsZWFzZSgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgRXhlY3V0ZXMgb3IgcXVldWVzIGEgdGFzayBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIHRoZSBzY2hlZHVsZXIgKGBzdXNwZW5kZWRgIG9yIGByZWxlYXNlZGApXG5cdCoqL1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICBxdWV1ZS5wdXNoKHRhc2spO1xuXHRcblx0ICBpZiAoIXNlbWFwaG9yZSkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgZmx1c2goKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgIFB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlLiBTY2hlZHVsZWQgdGFza3Mgd2lsbCBiZSBxdWV1ZWQgdW50aWwgdGhlXG5cdCAgc2NoZWR1bGVyIGlzIHJlbGVhc2VkLlxuXHQqKi9cblx0ZnVuY3Rpb24gc3VzcGVuZCgpIHtcblx0ICBzZW1hcGhvcmUrKztcblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG5cdCAgc2VtYXBob3JlLS07XG5cdH1cblx0XG5cdC8qKlxuXHQgIFJlbGVhc2VzIHRoZSBjdXJyZW50IGxvY2suIEV4ZWN1dGVzIGFsbCBxdWV1ZWQgdGFza3MgaWYgdGhlIHNjaGVkdWxlciBpcyBpbiB0aGUgcmVsZWFzZWQgc3RhdGUuXG5cdCoqL1xuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICByZWxlYXNlKCk7XG5cdFxuXHQgIHZhciB0YXNrID0gdm9pZCAwO1xuXHQgIHdoaWxlICghc2VtYXBob3JlICYmICh0YXNrID0gcXVldWUuc2hpZnQoKSkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgZXhlYyh0YXNrKTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzRWZmZWN0ID0gZXhwb3J0cy50YWtlbSA9IGV4cG9ydHMuZGV0YWNoID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnRha2UgPSB0YWtlO1xuXHRleHBvcnRzLnB1dCA9IHB1dDtcblx0ZXhwb3J0cy5hbGwgPSBhbGw7XG5cdGV4cG9ydHMucmFjZSA9IHJhY2U7XG5cdGV4cG9ydHMuY2FsbCA9IGNhbGw7XG5cdGV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblx0ZXhwb3J0cy5jcHMgPSBjcHM7XG5cdGV4cG9ydHMuZm9yayA9IGZvcms7XG5cdGV4cG9ydHMuc3Bhd24gPSBzcGF3bjtcblx0ZXhwb3J0cy5qb2luID0gam9pbjtcblx0ZXhwb3J0cy5jYW5jZWwgPSBjYW5jZWw7XG5cdGV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuXHRleHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuXHRleHBvcnRzLmNhbmNlbGxlZCA9IGNhbmNlbGxlZDtcblx0ZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuXHRleHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuXHRleHBvcnRzLnNldENvbnRleHQgPSBzZXRDb250ZXh0O1xuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHR2YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdHZhciBJTyA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnN5bSkoJ0lPJyk7XG5cdHZhciBUQUtFID0gJ1RBS0UnO1xuXHR2YXIgUFVUID0gJ1BVVCc7XG5cdHZhciBBTEwgPSAnQUxMJztcblx0dmFyIFJBQ0UgPSAnUkFDRSc7XG5cdHZhciBDQUxMID0gJ0NBTEwnO1xuXHR2YXIgQ1BTID0gJ0NQUyc7XG5cdHZhciBGT1JLID0gJ0ZPUksnO1xuXHR2YXIgSk9JTiA9ICdKT0lOJztcblx0dmFyIENBTkNFTCA9ICdDQU5DRUwnO1xuXHR2YXIgU0VMRUNUID0gJ1NFTEVDVCc7XG5cdHZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG5cdHZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcblx0dmFyIEZMVVNIID0gJ0ZMVVNIJztcblx0dmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcblx0dmFyIFNFVF9DT05URVhUID0gJ1NFVF9DT05URVhUJztcblx0XG5cdHZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cdFxuXHR2YXIgZWZmZWN0ID0gZnVuY3Rpb24gZWZmZWN0KHR5cGUsIHBheWxvYWQpIHtcblx0ICB2YXIgX3JlZjtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltJT10gPSB0cnVlLCBfcmVmW3R5cGVdID0gcGF5bG9hZCwgX3JlZjtcblx0fTtcblx0XG5cdHZhciBkZXRhY2ggPSBleHBvcnRzLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChlZmYpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG5cdCAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gdGFrZSgpIHtcblx0ICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLnBhdHRlcm4ocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICBpZiAoX3V0aWxzLmlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuXHQgIH1cblx0ICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xuXHR9XG5cdFxuXHR0YWtlLm1heWJlID0gZnVuY3Rpb24gKCkge1xuXHQgIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbVEFLRV0ubWF5YmUgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHR2YXIgdGFrZW0gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy50YWtlbSA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKSh0YWtlLm1heWJlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCd0YWtlbScsICd0YWtlLm1heWJlJykpO1xuXHRcblx0ZnVuY3Rpb24gcHV0KGNoYW5uZWwsIGFjdGlvbikge1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IGEgdmFsaWQgY2hhbm5lbCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYWN0aW9uLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgYWN0aW9uID0gY2hhbm5lbDtcblx0ICAgIGNoYW5uZWwgPSBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFBVVCwgeyBjaGFubmVsOiBjaGFubmVsLCBhY3Rpb246IGFjdGlvbiB9KTtcblx0fVxuXHRcblx0cHV0LnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgZWZmW1BVVF0ucmVzb2x2ZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHB1dC5zeW5jID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShwdXQucmVzb2x2ZSwgLyojX19QVVJFX18qLygwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKSgncHV0LnN5bmMnLCAncHV0LnJlc29sdmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBhbGwoZWZmZWN0cykge1xuXHQgIHJldHVybiBlZmZlY3QoQUxMLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMubm90VW5kZWYsIG1ldGggKyAnOiBhcmd1bWVudCBmbiBpcyB1bmRlZmluZWQnKTtcblx0XG5cdCAgdmFyIGNvbnRleHQgPSBudWxsO1xuXHQgIGlmIChfdXRpbHMuaXMuYXJyYXkoZm4pKSB7XG5cdCAgICB2YXIgX2ZuID0gZm47XG5cdCAgICBjb250ZXh0ID0gX2ZuWzBdO1xuXHQgICAgZm4gPSBfZm5bMV07XG5cdCAgfSBlbHNlIGlmIChmbi5mbikge1xuXHQgICAgdmFyIF9mbjIgPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm4yLmNvbnRleHQ7XG5cdCAgICBmbiA9IF9mbjIuZm47XG5cdCAgfVxuXHQgIGlmIChjb250ZXh0ICYmIF91dGlscy5pcy5zdHJpbmcoZm4pICYmIF91dGlscy5pcy5mdW5jKGNvbnRleHRbZm5dKSkge1xuXHQgICAgZm4gPSBjb250ZXh0W2ZuXTtcblx0ICB9XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5mdW5jLCBtZXRoICsgJzogYXJndW1lbnQgJyArIGZuICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHRcblx0ICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FsbChmbikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBhcHBseShjb250ZXh0LCBmbikge1xuXHQgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDQUxMLCBnZXRGbkNhbGxEZXNjKCdhcHBseScsIHsgY29udGV4dDogY29udGV4dCwgZm46IGZuIH0sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY3BzKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHQgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ1BTLCBnZXRGbkNhbGxEZXNjKCdjcHMnLCBmbiwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmb3JrKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHQgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNwYXduKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuXHQgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBkZXRhY2goZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGpvaW4oKSB7XG5cdCAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG5cdCAgICB0YXNrc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBqb2luKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgdGFza3MgPSBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuXHQgICAgdGFza3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcblx0ICB9XG5cdFxuXHQgIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG5cdCAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuXHQgICAgICByZXR1cm4gY2FuY2VsKHQpO1xuXHQgICAgfSkpO1xuXHQgIH1cblx0ICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuXHQgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy50YXNrLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgJyArIFRFU1RfSElOVCk7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuXHQgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43ID4gMSA/IF9sZW43IC0gMSA6IDApLCBfa2V5NyA9IDE7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcblx0ICAgIGFyZ3NbX2tleTcgLSAxXSA9IGFyZ3VtZW50c1tfa2V5N107XG5cdCAgfVxuXHRcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMubm90VW5kZWYsICdzZWxlY3Qoc2VsZWN0b3IsWy4uLl0pOiBhcmd1bWVudCBzZWxlY3RvciBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChTRUxFQ1QsIHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBhcmdzOiBhcmdzIH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcblx0KiovXG5cdGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5ub3RVbmRlZiwgJ2FjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKTogYXJndW1lbnQgYnVmZmVyIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChBQ1RJT05fQ0hBTk5FTCwgeyBwYXR0ZXJuOiBwYXR0ZXJuLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuXHQgIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMuY2hhbm5lbCwgJ2ZsdXNoKGNoYW5uZWwpOiBhcmd1bWVudCAnICsgY2hhbm5lbCArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwnKTtcblx0ICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0Q29udGV4dChwcm9wKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcblx0ICByZXR1cm4gZWZmZWN0KEdFVF9DT05URVhULCBwcm9wKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2V0Q29udGV4dChwcm9wcykge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKShudWxsLCBwcm9wcykpO1xuXHQgIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW44ID4gMiA/IF9sZW44IC0gMiA6IDApLCBfa2V5OCA9IDI7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcblx0ICAgIGFyZ3NbX2tleTggLSAyXSA9IGFyZ3VtZW50c1tfa2V5OF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuXHQgICAgYXJnc1tfa2V5OSAtIDJdID0gYXJndW1lbnRzW19rZXk5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlTGF0ZXN0SGVscGVyLCBwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHRocm90dGxlKG1zLCBwYXR0ZXJuLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuMTAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEwID4gMyA/IF9sZW4xMCAtIDMgOiAwKSwgX2tleTEwID0gMzsgX2tleTEwIDwgX2xlbjEwOyBfa2V5MTArKykge1xuXHQgICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xuXHR9XG5cdFxuXHR2YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKGVmZmVjdCkge1xuXHQgICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFt0eXBlXTtcblx0ICB9O1xuXHR9O1xuXHRcblx0dmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcblx0ICB0YWtlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFRBS0UpLFxuXHQgIHB1dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShQVVQpLFxuXHQgIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuXHQgIHJhY2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoUkFDRSksXG5cdCAgY2FsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDQUxMKSxcblx0ICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcblx0ICBmb3JrOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZPUkspLFxuXHQgIGpvaW46IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoSk9JTiksXG5cdCAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG5cdCAgc2VsZWN0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFNFTEVDVCksXG5cdCAgYWN0aW9uQ2hhbm5lbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBQ1RJT05fQ0hBTk5FTCksXG5cdCAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG5cdCAgZmx1c2g6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRkxVU0gpLFxuXHQgIGdldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoR0VUX0NPTlRFWFQpLFxuXHQgIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IGV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gZXhwb3J0cy50aHJvdHRsZSA9IGV4cG9ydHMudGFrZUxhdGVzdCA9IGV4cG9ydHMudGFrZUV2ZXJ5ID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDkpO1xuXHRcblx0dmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTMpO1xuXHRcblx0dmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblx0XG5cdHZhciBfdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTQpO1xuXHRcblx0dmFyIF90aHJvdHRsZTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0dmFyIGRlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIGRlcHJlY2F0aW9uV2FybmluZyhoZWxwZXJOYW1lKSB7XG5cdCAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG5cdH07XG5cdFxuXHR2YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG5cdHZhciB0YWtlTGF0ZXN0ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUxhdGVzdDIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGFrZUxhdGVzdCcpKTtcblx0dmFyIHRocm90dGxlID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGhyb3R0bGUyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rocm90dGxlJykpO1xuXHRcblx0ZXhwb3J0cy50YWtlRXZlcnkgPSB0YWtlRXZlcnk7XG5cdGV4cG9ydHMudGFrZUxhdGVzdCA9IHRha2VMYXRlc3Q7XG5cdGV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblx0ZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBfdGFrZUV2ZXJ5Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBfdGFrZUxhdGVzdDIuZGVmYXVsdDtcblx0ZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUwKTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUxKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIGFjdGlvbiA9IHZvaWQgMCxcblx0ICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VFdmVyeSgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5xRW5kID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLnNhZmVOYW1lID0gc2FmZU5hbWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHR2YXIgZG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXHR2YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXHRcblx0ZnVuY3Rpb24gc2FmZU5hbWUocGF0dGVybk9yQ2hhbm5lbCkge1xuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuICdjaGFubmVsJztcblx0ICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybk9yQ2hhbm5lbCkpIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdCAgICAgIHJldHVybiBTdHJpbmcoZW50cnkpO1xuXHQgICAgfSkpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gU3RyaW5nKHBhdHRlcm5PckNoYW5uZWwpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZnNtSXRlcmF0b3IoZnNtLCBxMCkge1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXHRcblx0ICB2YXIgdXBkYXRlU3RhdGUgPSB2b2lkIDAsXG5cdCAgICAgIHFOZXh0ID0gcTA7XG5cdFxuXHQgIGZ1bmN0aW9uIG5leHQoYXJnLCBlcnJvcikge1xuXHQgICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG5cdCAgICAgIHJldHVybiBkb25lO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChlcnJvcikge1xuXHQgICAgICBxTmV4dCA9IHFFbmQ7XG5cdCAgICAgIHRocm93IGVycm9yO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdXBkYXRlU3RhdGUgJiYgdXBkYXRlU3RhdGUoYXJnKTtcblx0XG5cdCAgICAgIHZhciBfZnNtJHFOZXh0ID0gZnNtW3FOZXh0XSgpLFxuXHQgICAgICAgICAgcSA9IF9mc20kcU5leHRbMF0sXG5cdCAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuXHQgICAgICAgICAgX3VwZGF0ZVN0YXRlID0gX2ZzbSRxTmV4dFsyXTtcblx0XG5cdCAgICAgIHFOZXh0ID0gcTtcblx0ICAgICAgdXBkYXRlU3RhdGUgPSBfdXBkYXRlU3RhdGU7XG5cdCAgICAgIHJldHVybiBxTmV4dCA9PT0gcUVuZCA/IGRvbmUgOiBvdXRwdXQ7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgcmV0dXJuIG5leHQobnVsbCwgZXJyb3IpO1xuXHQgIH0sIG5hbWUsIHRydWUpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLmlzRW5kID0gZXhwb3J0cy5FTkQgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXHRcblx0ZXhwb3J0cy5lbWl0dGVyID0gZW1pdHRlcjtcblx0ZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcblx0ZXhwb3J0cy5ldmVudENoYW5uZWwgPSBldmVudENoYW5uZWw7XG5cdGV4cG9ydHMuc3RkQ2hhbm5lbCA9IHN0ZENoYW5uZWw7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1Mik7XG5cdFxuXHR2YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nik7XG5cdFxuXHR2YXIgQ0hBTk5FTF9FTkRfVFlQRSA9ICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHR2YXIgRU5EID0gZXhwb3J0cy5FTkQgPSB7IHR5cGU6IENIQU5ORUxfRU5EX1RZUEUgfTtcblx0dmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcblx0ICByZXR1cm4gYSAmJiBhLnR5cGUgPT09IENIQU5ORUxfRU5EX1RZUEU7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBlbWl0dGVyKCkge1xuXHQgIHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXHRcblx0ICBmdW5jdGlvbiBzdWJzY3JpYmUoc3ViKSB7XG5cdCAgICBzdWJzY3JpYmVycy5wdXNoKHN1Yik7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gKDAsIF91dGlscy5yZW1vdmUpKHN1YnNjcmliZXJzLCBzdWIpO1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGVtaXQoaXRlbSkge1xuXHQgICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGFycltpXShpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiB7XG5cdCAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0ICAgIGVtaXQ6IGVtaXRcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xuXHR2YXIgVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSAnU2FnYSB3YXMgcHJvdmlkZWQgd2l0aCBhbiB1bmRlZmluZWQgYWN0aW9uJztcblx0XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBVTkRFRklORURfSU5QVVRfRVJST1IgKz0gJ1xcbkhpbnRzOlxcbiAgICAtIGNoZWNrIHRoYXQgeW91ciBBY3Rpb24gQ3JlYXRvciByZXR1cm5zIGEgbm9uLXVuZGVmaW5lZCB2YWx1ZVxcbiAgICAtIGlmIHRoZSBTYWdhIHdhcyBzdGFydGVkIHVzaW5nIHJ1blNhZ2EsIGNoZWNrIHRoYXQgeW91ciBzdWJzY3JpYmUgc291cmNlIHByb3ZpZGVzIHRoZSBhY3Rpb24gdG8gaXRzIGxpc3RlbmVyc1xcbiAgJztcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2hhbm5lbCgpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCk7XG5cdFxuXHQgIHZhciBjbG9zZWQgPSBmYWxzZTtcblx0ICB2YXIgdGFrZXJzID0gW107XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLmJ1ZmZlciwgSU5WQUxJRF9CVUZGRVIpO1xuXHRcblx0ICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcblx0ICAgIGlmIChjbG9zZWQgJiYgdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgYSBjbG9zZWQgY2hhbm5lbCB3aXRoIHBlbmRpbmcgdGFrZXJzJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFrZXJzLmxlbmd0aCAmJiAhYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aHJvdyAoMCwgX3V0aWxzLmludGVybmFsRXJyKSgnQ2Fubm90IGhhdmUgcGVuZGluZyB0YWtlcnMgd2l0aCBub24gZW1wdHkgYnVmZmVyJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShpbnB1dCwgX3V0aWxzLmlzLm5vdFVuZGVmLCBVTkRFRklORURfSU5QVVRfRVJST1IpO1xuXHQgICAgaWYgKGNsb3NlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGJ1ZmZlci5wdXQoaW5wdXQpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNiID0gdGFrZXJzW2ldO1xuXHQgICAgICBpZiAoIWNiW191dGlscy5NQVRDSF0gfHwgY2JbX3V0aWxzLk1BVENIXShpbnB1dCkpIHtcblx0ICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIHJldHVybiBjYihpbnB1dCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHRha2UoY2IpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjYiwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHRcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihidWZmZXIudGFrZSgpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRha2Vycy5wdXNoKGNiKTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodGFrZXJzLCBjYik7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBmbHVzaChjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTsgLy8gVE9ETzogY2hlY2sgaWYgc29tZSBuZXcgc3RhdGUgc2hvdWxkIGJlIGZvcmJpZGRlbiBub3dcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcblx0ICAgICAgY2IoRU5EKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY2IoYnVmZmVyLmZsdXNoKCkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuXHQgICAgaWYgKCFjbG9zZWQpIHtcblx0ICAgICAgY2xvc2VkID0gdHJ1ZTtcblx0ICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcblx0ICAgICAgICB2YXIgYXJyID0gdGFrZXJzO1xuXHQgICAgICAgIHRha2VycyA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICAgIGFycltpXShFTkQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBwdXQ6IHB1dCxcblx0ICAgIGZsdXNoOiBmbHVzaCxcblx0ICAgIGNsb3NlOiBjbG9zZSxcblx0ICAgIGdldCBfX3Rha2Vyc19fKCkge1xuXHQgICAgICByZXR1cm4gdGFrZXJzO1xuXHQgICAgfSxcblx0ICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuXHQgICAgICByZXR1cm4gY2xvc2VkO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgYnVmZmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfYnVmZmVycy5idWZmZXJzLm5vbmUoKTtcblx0ICB2YXIgbWF0Y2hlciA9IGFyZ3VtZW50c1syXTtcblx0XG5cdCAgLyoqXG5cdCAgICBzaG91bGQgYmUgaWYodHlwZW9mIG1hdGNoZXIgIT09IHVuZGVmaW5lZCkgaW5zdGVhZD9cblx0ICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuXHQgICoqL1xuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcblx0ICB9XG5cdFxuXHQgIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuXHQgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xuXHQgICAgaWYgKCFjaGFuLl9fY2xvc2VkX18pIHtcblx0ICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG5cdCAgICAgICAgdW5zdWJzY3JpYmUoKTtcblx0ICAgICAgfVxuXHQgICAgICBjaGFuLmNsb3NlKCk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICBpZiAoaXNFbmQoaW5wdXQpKSB7XG5cdCAgICAgIGNsb3NlKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXRjaGVyICYmICFtYXRjaGVyKGlucHV0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjaGFuLnB1dChpbnB1dCk7XG5cdCAgfSk7XG5cdCAgaWYgKGNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgdW5zdWJzY3JpYmUoKTtcblx0ICB9XG5cdFxuXHQgIGlmICghX3V0aWxzLmlzLmZ1bmModW5zdWJzY3JpYmUpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRha2U6IGNoYW4udGFrZSxcblx0ICAgIGZsdXNoOiBjaGFuLmZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlXG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3RkQ2hhbm5lbChzdWJzY3JpYmUpIHtcblx0ICB2YXIgY2hhbiA9IGV2ZW50Q2hhbm5lbChmdW5jdGlvbiAoY2IpIHtcblx0ICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIGlmIChpbnB1dFtfdXRpbHMuU0FHQV9BQ1RJT05dKSB7XG5cdCAgICAgICAgY2IoaW5wdXQpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICAoMCwgX3NjaGVkdWxlci5hc2FwKShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIF9leHRlbmRzKHt9LCBjaGFuLCB7XG5cdCAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG5cdCAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICgwLCBfdXRpbHMuY2hlY2spKG1hdGNoZXIsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwudGFrZSdzIG1hdGNoZXIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHQgICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4udGFrZShjYik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5idWZmZXJzID0gZXhwb3J0cy5CVUZGRVJfT1ZFUkZMT1cgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ0KTtcblx0XG5cdHZhciBCVUZGRVJfT1ZFUkZMT1cgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IFwiQ2hhbm5lbCdzIEJ1ZmZlciBvdmVyZmxvdyFcIjtcblx0XG5cdHZhciBPTl9PVkVSRkxPV19USFJPVyA9IDE7XG5cdHZhciBPTl9PVkVSRkxPV19EUk9QID0gMjtcblx0dmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcblx0dmFyIE9OX09WRVJGTE9XX0VYUEFORCA9IDQ7XG5cdFxuXHR2YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXHRcblx0ZnVuY3Rpb24gcmluZ0J1ZmZlcigpIHtcblx0ICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuXHQgIHZhciBvdmVyZmxvd0FjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG5cdCAgdmFyIGxlbmd0aCA9IDA7XG5cdCAgdmFyIHB1c2hJbmRleCA9IDA7XG5cdCAgdmFyIHBvcEluZGV4ID0gMDtcblx0XG5cdCAgdmFyIHB1c2ggPSBmdW5jdGlvbiBwdXNoKGl0KSB7XG5cdCAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICBsZW5ndGgrKztcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2UoKSB7XG5cdCAgICBpZiAobGVuZ3RoICE9IDApIHtcblx0ICAgICAgdmFyIGl0ID0gYXJyW3BvcEluZGV4XTtcblx0ICAgICAgYXJyW3BvcEluZGV4XSA9IG51bGw7XG5cdCAgICAgIGxlbmd0aC0tO1xuXHQgICAgICBwb3BJbmRleCA9IChwb3BJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgIHJldHVybiBpdDtcblx0ICAgIH1cblx0ICB9O1xuXHRcblx0ICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHZhciBpdGVtcyA9IFtdO1xuXHQgICAgd2hpbGUgKGxlbmd0aCkge1xuXHQgICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlbXM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICAgIHJldHVybiBsZW5ndGggPT0gMDtcblx0ICAgIH0sXG5cdCAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuXHQgICAgICBpZiAobGVuZ3RoIDwgbGltaXQpIHtcblx0ICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgZG91YmxlZExpbWl0ID0gdm9pZCAwO1xuXHQgICAgICAgIHN3aXRjaCAob3ZlcmZsb3dBY3Rpb24pIHtcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihCVUZGRVJfT1ZFUkZMT1cpO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19TTElERTpcblx0ICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gKHB1c2hJbmRleCArIDEpICUgbGltaXQ7XG5cdCAgICAgICAgICAgIHBvcEluZGV4ID0gcHVzaEluZGV4O1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfRVhQQU5EOlxuXHQgICAgICAgICAgICBkb3VibGVkTGltaXQgPSAyICogbGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBhcnIgPSBmbHVzaCgpO1xuXHRcblx0ICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcHVzaEluZGV4ID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSAwO1xuXHRcblx0ICAgICAgICAgICAgYXJyLmxlbmd0aCA9IGRvdWJsZWRMaW1pdDtcblx0ICAgICAgICAgICAgbGltaXQgPSBkb3VibGVkTGltaXQ7XG5cdFxuXHQgICAgICAgICAgICBwdXNoKGl0KTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgLy8gRFJPUFxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIHRha2U6IHRha2UsXG5cdCAgICBmbHVzaDogZmx1c2hcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgYnVmZmVycyA9IGV4cG9ydHMuYnVmZmVycyA9IHtcblx0ICBub25lOiBmdW5jdGlvbiBub25lKCkge1xuXHQgICAgcmV0dXJuIHplcm9CdWZmZXI7XG5cdCAgfSxcblx0ICBmaXhlZDogZnVuY3Rpb24gZml4ZWQobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG5cdCAgfSxcblx0ICBkcm9wcGluZzogZnVuY3Rpb24gZHJvcHBpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcblx0ICB9LFxuXHQgIHNsaWRpbmc6IGZ1bmN0aW9uIHNsaWRpbmcobGltaXQpIHtcblx0ICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG5cdCAgfSxcblx0ICBleHBhbmRpbmc6IGZ1bmN0aW9uIGV4cGFuZGluZyhpbml0aWFsU2l6ZSkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VMYXRlc3Q7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUwKTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUxKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0YWtlTGF0ZXN0KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgeVRha2UgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShwYXR0ZXJuT3JDaGFubmVsKSB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlDYW5jZWwgPSBmdW5jdGlvbiB5Q2FuY2VsKHRhc2spIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG5cdCAgfTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDAsXG5cdCAgICAgIGFjdGlvbiA9IHZvaWQgMDtcblx0ICB2YXIgc2V0VGFzayA9IGZ1bmN0aW9uIHNldFRhc2sodCkge1xuXHQgICAgcmV0dXJuIHRhc2sgPSB0O1xuXHQgIH07XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeVRha2UsIHNldEFjdGlvbl07XG5cdCAgICB9LFxuXHQgICAgcTI6IGZ1bmN0aW9uIHEyKCkge1xuXHQgICAgICByZXR1cm4gYWN0aW9uID09PSBfY2hhbm5lbC5FTkQgPyBbX2ZzbUl0ZXJhdG9yLnFFbmRdIDogdGFzayA/IFsncTMnLCB5Q2FuY2VsKHRhc2spXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBbJ3ExJywgeUZvcmsoYWN0aW9uKSwgc2V0VGFza107XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rha2VMYXRlc3QoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm5PckNoYW5uZWwpICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MCk7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MSk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUoZGVsYXlMZW5ndGgsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDMgPyBfbGVuIC0gMyA6IDApLCBfa2V5ID0gMzsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgfVxuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBjaGFubmVsID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG5cdCAgdmFyIHlUYWtlID0gZnVuY3Rpb24geVRha2UoKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkoY2hhbm5lbCkgfTtcblx0ICB9O1xuXHQgIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG5cdCAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlEZWxheSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbGwpKF91dGlscy5kZWxheSwgZGVsYXlMZW5ndGgpIH07XG5cdFxuXHQgIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHQgIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuXHQgICAgcmV0dXJuIGNoYW5uZWwgPSBjaDtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMzogZnVuY3Rpb24gcTMoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG5cdCAgICB9LFxuXHQgICAgcTQ6IGZ1bmN0aW9uIHE0KCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG5cdCAgICB9XG5cdCAgfSwgJ3ExJywgJ3Rocm90dGxlKCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHNhZ2FNaWRkbGV3YXJlRmFjdG9yeTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUxKTtcblx0XG5cdHZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cdFxuXHRmdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG5cdCAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXHRcblx0ICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBjb250ZXh0ID0gX3JlZiRjb250ZXh0ID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYkY29udGV4dCxcblx0ICAgICAgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvbnRleHQnXSk7XG5cdFxuXHQgIHZhciBzYWdhTW9uaXRvciA9IG9wdGlvbnMuc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXHRcblx0XG5cdCAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG5cdCAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhZ2EgbWlkZGxld2FyZSBubyBsb25nZXIgYWNjZXB0IEdlbmVyYXRvciBmdW5jdGlvbnMuIFVzZSBzYWdhTWlkZGxld2FyZS5ydW4gaW5zdGVhZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGEgZnVuY3Rpb24gdG8gdGhlIFNhZ2EgbWlkZGxld2FyZS4gWW91IGFyZSBsaWtlbHkgdHJ5aW5nIHRvIHN0YXJ0IGEgICAgICAgIFNhZ2EgYnkgZGlyZWN0bHkgcGFzc2luZyBpdCB0byB0aGUgbWlkZGxld2FyZS4gVGhpcyBpcyBubyBsb25nZXIgcG9zc2libGUgc3RhcnRpbmcgZnJvbSAwLjEwLjAuICAgICAgICBUbyBydW4gYSBTYWdhLCB5b3UgbXVzdCBkbyBpdCBkeW5hbWljYWxseSBBRlRFUiBtb3VudGluZyB0aGUgbWlkZGxld2FyZSBpbnRvIHRoZSBzdG9yZS5cXG4gICAgICAgIEV4YW1wbGU6XFxuICAgICAgICAgIGltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCdcXG4gICAgICAgICAgLi4uIG90aGVyIGltcG9ydHNcXG5cXG4gICAgICAgICAgY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpXFxuICAgICAgICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSlcXG4gICAgICAgICAgc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpXFxuICAgICAgJyk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBpZiAobG9nZ2VyICYmICFfdXRpbHMuaXMuZnVuYyhsb2dnZXIpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uZXJyb3JgIHdhcyByZW1vdmVkLiBVc2UgYG9wdGlvbnMub25FcnJvcmAgaW5zdGVhZC4nKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvbkVycm9yICYmICFfdXRpbHMuaXMuZnVuYyhvbkVycm9yKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbkVycm9yYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChvcHRpb25zLmVtaXR0ZXIgJiYgIV91dGlscy5pcy5mdW5jKG9wdGlvbnMuZW1pdHRlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuXHQgICAgdmFyIGdldFN0YXRlID0gX3JlZjIuZ2V0U3RhdGUsXG5cdCAgICAgICAgZGlzcGF0Y2ggPSBfcmVmMi5kaXNwYXRjaDtcblx0XG5cdCAgICB2YXIgc2FnYUVtaXR0ZXIgPSAoMCwgX2NoYW5uZWwuZW1pdHRlcikoKTtcblx0ICAgIHNhZ2FFbWl0dGVyLmVtaXQgPSAob3B0aW9ucy5lbWl0dGVyIHx8IF91dGlscy5pZGVudCkoc2FnYUVtaXR0ZXIuZW1pdCk7XG5cdFxuXHQgICAgc2FnYU1pZGRsZXdhcmUucnVuID0gX3J1blNhZ2EucnVuU2FnYS5iaW5kKG51bGwsIHtcblx0ICAgICAgY29udGV4dDogY29udGV4dCxcblx0ICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG5cdCAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcblx0ICAgICAgZ2V0U3RhdGU6IGdldFN0YXRlLFxuXHQgICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG5cdCAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuXHQgICAgICBvbkVycm9yOiBvbkVycm9yXG5cdCAgICB9KTtcblx0XG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgICAgICBpZiAoc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCkge1xuXHQgICAgICAgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZChhY3Rpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dChhY3Rpb24pOyAvLyBoaXQgcmVkdWNlcnNcblx0ICAgICAgICBzYWdhRW1pdHRlci5lbWl0KGFjdGlvbik7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgfVxuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG5cdCAgfTtcblx0XG5cdCAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKCdzYWdhTWlkZGxld2FyZScsIHByb3BzKSk7XG5cdCAgICBfdXRpbHMub2JqZWN0LmFzc2lnbihjb250ZXh0LCBwcm9wcyk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHNhZ2FNaWRkbGV3YXJlO1xuXHR9XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VtO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnB1dDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnJhY2U7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbGw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hcHBseTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jcHM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZvcms7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zcGF3bjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uam9pbjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5jYW5jZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uc2VsZWN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmZsdXNoO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuXHQgIH1cblx0fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUQVNLJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlRBU0s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdTQUdBX0FDVElPTicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5TQUdBX0FDVElPTjtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ25vb3AnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmlzO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZGVmZXJyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuZGVmZXJyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcnJheU9mRGVmZmVyZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuYXJyYXlPZkRlZmZlcmVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTW9ja1Rhc2snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY3JlYXRlTW9ja1Rhc2s7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjbG9uZWFibGVHZW5lcmF0b3InLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuY2xvbmVhYmxlR2VuZXJhdG9yO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXNFZmZlY3QnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uYXNFZmZlY3Q7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NSk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcblx0ZXhwb3J0cy5yZWR1Y2VyID0gcmVkdWNlcjtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHR2YXIgX3B1bGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1OSk7XG5cdFxuXHR2YXIgX3B1bGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHVsbCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHQvLyBpbml0aWFsIHN0YXRlXG5cdHZhciBpbml0aWFsU3RhdGUgPSB7XG5cdCAgICBzZWxlY3RBbGw6IHRydWUsXG5cdCAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICBlcnJvcjogbnVsbCxcblx0ICAgIHVzZXJJZDogbnVsbCxcblx0ICAgIGlzX3Jlc3RyaWN0ZWQ6IGZhbHNlLFxuXHQgICAgYWxsX3Byb2plY3RzOiBbXSxcblx0ICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuXHQgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcblx0ICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGxcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHJlZHVjZXIoKSB7XG5cdCAgICB2YXIgX3JlZHVjZXJBY3Rpb25zO1xuXHRcblx0ICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuXHQgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICB2YXIgcmVkdWNlckFjdGlvbnMgPSAoX3JlZHVjZXJBY3Rpb25zID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuU0VUX1NUT1JFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBkYXRhID0gYWN0aW9uLmRhdGE7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgZGF0YSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfR0VUX0lOSVQsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgeyBmZXRjaGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfR0VUX1NVQ0NFU1MsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIF9hY3Rpb24kZGF0YSA9IGFjdGlvbi5kYXRhLFxuXHQgICAgICAgICAgICBhbGxfcHJvamVjdHMgPSBfYWN0aW9uJGRhdGEuYWxsX3Byb2plY3RzLFxuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gX2FjdGlvbiRkYXRhLnVzZXJfcHJvamVjdHM7XG5cdFxuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICBhbGxfcHJvamVjdHM6IGFsbF9wcm9qZWN0cyxcblx0ICAgICAgICAgICAgLy8gTk9URTogd2UncmUgXCJ1bndyYXBwaW5nXCIgdGhlIFVzZXJQcm9qZWN0cyBkYXRhXG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMgJiYgdXNlcl9wcm9qZWN0cy5wcm9qZWN0cyB8fCBbXSxcblx0ICAgICAgICAgICAgaXNfcmVzdHJpY3RlZDogdXNlcl9wcm9qZWN0cyAmJiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQgfHwgZmFsc2Vcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9HRVRfRkFJTFVSRSwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgYWxsX3Byb2plY3RzOiBbXSxcblx0ICAgICAgICAgICAgdXNlcl9wcm9qZWN0czogW10sXG5cdCAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3Jcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9QVVRfSU5JVCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiB0cnVlLFxuXHQgICAgICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX1BVVF9TVUNDRVNTLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciB1c2VyX3Byb2plY3RzID0gYWN0aW9uLmRhdGEudXNlcl9wcm9qZWN0cztcblx0XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgIC8vIE5PVEU6IHdlJ3JlIFwidW53cmFwcGluZ1wiIHRoZSBsaXN0IG9mIHByb2plY3RzIGhlcmUsIHRvIHNpbXBsaWZ5IHRoZSBzdG9yZVxuXHQgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMucHJvamVjdHMsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGxcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9QVVRfRkFJTFVSRSwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgbmV3U3RhdGUgPSBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICBvcmlnaW5hbF9pc19yZXN0cmljdGVkOiBudWxsLFxuXHQgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgLy8gT3ZlcndyaXRlIGlmIHdlIGhhdmUgYW4gb3JpZ2luYWwgdmFsdWVcblx0ICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZCAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICBuZXdTdGF0ZS5pc19yZXN0cmljdGVkID0gc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsX3VzZXJfcHJvamVjdHMgIT09IG51bGwpIHtcblx0ICAgICAgICAgICAgbmV3U3RhdGUudXNlcl9wcm9qZWN0cyA9IHN0YXRlLm9yaWdpbmFsX3VzZXJfcHJvamVjdHM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgcHJvamVjdElkID0gYWN0aW9uLmRhdGEucHJvamVjdElkO1xuXHRcblx0ICAgICAgICB2YXIgb3JpZ2luYWxfdXNlcl9wcm9qZWN0cyA9IHN0YXRlLnVzZXJfcHJvamVjdHMgJiYgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShzdGF0ZS51c2VyX3Byb2plY3RzKSk7XG5cdCAgICAgICAgdmFyIHVzZXJfcHJvamVjdHMgPSBzdGF0ZS51c2VyX3Byb2plY3RzICYmIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoc3RhdGUudXNlcl9wcm9qZWN0cykpO1xuXHRcblx0ICAgICAgICAoMCwgX3V0aWxzLmluQXJyYXkpKHByb2plY3RJZCwgdXNlcl9wcm9qZWN0cykgPyAoMCwgX3B1bGwyLmRlZmF1bHQpKHVzZXJfcHJvamVjdHMsIHByb2plY3RJZCkgOiB1c2VyX3Byb2plY3RzLnB1c2gocHJvamVjdElkKTtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG9yaWdpbmFsX3VzZXJfcHJvamVjdHMsIHVzZXJfcHJvamVjdHM6IHVzZXJfcHJvamVjdHMgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgaXNfcmVzdHJpY3RlZCA9IGFjdGlvbi5kYXRhLmlzX3Jlc3RyaWN0ZWQ7XG5cdFxuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHsgaXNfcmVzdHJpY3RlZDogaXNfcmVzdHJpY3RlZCwgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogc3RhdGUuaXNfcmVzdHJpY3RlZCB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBvcmlnaW5hbF91c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHN0YXRlLnVzZXJfcHJvamVjdHMpKTtcblx0ICAgICAgICB2YXIgdXNlcl9wcm9qZWN0cyA9IHZvaWQgMCxcblx0ICAgICAgICAgICAgX3N0YXRlID0gX2V4dGVuZHMoe30sIHN0YXRlKSxcblx0ICAgICAgICAgICAgc2VsZWN0QWxsID0gX3N0YXRlLnNlbGVjdEFsbDtcblx0XG5cdCAgICAgICAgaWYgKHNlbGVjdEFsbCkge1xuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzID0gc3RhdGUuYWxsX3Byb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuaWQ7XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBbXTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBvcmlnaW5hbF91c2VyX3Byb2plY3RzLFxuXHQgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB1c2VyX3Byb2plY3RzXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX3JlZHVjZXJBY3Rpb25zKTtcblx0ICAgIGlmIChyZWR1Y2VyQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24udHlwZSkpIHtcblx0ICAgICAgICByZXR1cm4gcmVkdWNlckFjdGlvbnNbYWN0aW9uLnR5cGVdKHN0YXRlLCBhY3Rpb24pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gc3RhdGU7XG5cdCAgICB9XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYmFzZVJlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2MCksXG5cdCAgICBwdWxsQWxsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjcpO1xuXHRcblx0LyoqXG5cdCAqIFJlbW92ZXMgYWxsIGdpdmVuIHZhbHVlcyBmcm9tIGBhcnJheWAgdXNpbmdcblx0ICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcblx0ICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuXHQgKlxuXHQgKiAqKk5vdGU6KiogVW5saWtlIGBfLndpdGhvdXRgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuIFVzZSBgXy5yZW1vdmVgXG5cdCAqIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIGFuIGFycmF5IGJ5IHByZWRpY2F0ZS5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgMi4wLjBcblx0ICogQGNhdGVnb3J5IEFycmF5XG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byByZW1vdmUuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG5cdCAqXG5cdCAqIF8ucHVsbChhcnJheSwgJ2EnLCAnYycpO1xuXHQgKiBjb25zb2xlLmxvZyhhcnJheSk7XG5cdCAqIC8vID0+IFsnYicsICdiJ11cblx0ICovXG5cdHZhciBwdWxsID0gYmFzZVJlc3QocHVsbEFsbCk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHB1bGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2MDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgaWRlbnRpdHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3NiksXG5cdCAgICBvdmVyUmVzdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYxKSxcblx0ICAgIHNldFRvU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjMpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG5cdCAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXBwbHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2Mik7XG5cdFxuXHQvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG5cdHZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblx0XG5cdC8qKlxuXHQgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuXHQgIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcblx0ICAgICAgICBpbmRleCA9IC0xLFxuXHQgICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcblx0ICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cdFxuXHQgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcblx0ICAgIH1cblx0ICAgIGluZGV4ID0gLTE7XG5cdCAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcblx0ICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcblx0ICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuXHQgICAgfVxuXHQgICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG5cdCAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2Bcblx0ICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuXHQgKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cblx0ICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cblx0ICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG5cdCAqL1xuXHRmdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG5cdCAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuXHQgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuXHQgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuXHQgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHQgICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuXHQgIH1cblx0ICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlU2V0VG9TdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NCksXG5cdCAgICBzaG9ydE91dCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY2KTtcblx0XG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG5cdCAqL1xuXHR2YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBjb25zdGFudCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY1KSxcblx0ICAgIGRlZmluZVByb3BlcnR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyNjUpLFxuXHQgICAgaWRlbnRpdHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3Nik7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG5cdCAqL1xuXHR2YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcblx0ICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuXHQgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG5cdCAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuXHQgICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcblx0ICAgICd3cml0YWJsZSc6IHRydWVcblx0ICB9KTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgMi40LjBcblx0ICogQGNhdGVnb3J5IFV0aWxcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cblx0ICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcblx0ICpcblx0ICogY29uc29sZS5sb2cob2JqZWN0cyk7XG5cdCAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuXHQgKlxuXHQgKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcblx0ICogLy8gPT4gdHJ1ZVxuXHQgKi9cblx0ZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gdmFsdWU7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cblx0dmFyIEhPVF9DT1VOVCA9IDgwMCxcblx0ICAgIEhPVF9TUEFOID0gMTY7XG5cdFxuXHQvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG5cdHZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcblx0ICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG5cdCAqIG1pbGxpc2Vjb25kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcblx0ICB2YXIgY291bnQgPSAwLFxuXHQgICAgICBsYXN0Q2FsbGVkID0gMDtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG5cdCAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblx0XG5cdCAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG5cdCAgICBpZiAocmVtYWluaW5nID4gMCkge1xuXHQgICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcblx0ICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjb3VudCA9IDA7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzY3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlUHVsbEFsbCA9IF9fd2VicGFja19yZXF1aXJlX18oNzY4KTtcblx0XG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIHJlbW92ZS5cblx0ICpcblx0ICogKipOb3RlOioqIFVubGlrZSBgXy5kaWZmZXJlbmNlYCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSA0LjAuMFxuXHQgKiBAY2F0ZWdvcnkgQXJyYXlcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuXHQgKlxuXHQgKiBfLnB1bGxBbGwoYXJyYXksIFsnYScsICdjJ10pO1xuXHQgKiBjb25zb2xlLmxvZyhhcnJheSk7XG5cdCAqIC8vID0+IFsnYicsICdiJ11cblx0ICovXG5cdGZ1bmN0aW9uIHB1bGxBbGwoYXJyYXksIHZhbHVlcykge1xuXHQgIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoICYmIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoKVxuXHQgICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzKVxuXHQgICAgOiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBwdWxsQWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFycmF5TWFwID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNzEpLFxuXHQgICAgYmFzZUluZGV4T2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OSksXG5cdCAgICBiYXNlSW5kZXhPZldpdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MyksXG5cdCAgICBiYXNlVW5hcnkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI5MyksXG5cdCAgICBjb3B5QXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NCk7XG5cdFxuXHQvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG5cdHZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXHRcblx0LyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG5cdHZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQWxsQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcblx0ICogc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuXHQgIHZhciBpbmRleE9mID0gY29tcGFyYXRvciA/IGJhc2VJbmRleE9mV2l0aCA6IGJhc2VJbmRleE9mLFxuXHQgICAgICBpbmRleCA9IC0xLFxuXHQgICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuXHQgICAgICBzZWVuID0gYXJyYXk7XG5cdFxuXHQgIGlmIChhcnJheSA9PT0gdmFsdWVzKSB7XG5cdCAgICB2YWx1ZXMgPSBjb3B5QXJyYXkodmFsdWVzKTtcblx0ICB9XG5cdCAgaWYgKGl0ZXJhdGVlKSB7XG5cdCAgICBzZWVuID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuXHQgIH1cblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgdmFyIGZyb21JbmRleCA9IDAsXG5cdCAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdLFxuXHQgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblx0XG5cdCAgICB3aGlsZSAoKGZyb21JbmRleCA9IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIGZyb21JbmRleCwgY29tcGFyYXRvcikpID4gLTEpIHtcblx0ICAgICAgaWYgKHNlZW4gIT09IGFycmF5KSB7XG5cdCAgICAgICAgc3BsaWNlLmNhbGwoc2VlbiwgZnJvbUluZGV4LCAxKTtcblx0ICAgICAgfVxuXHQgICAgICBzcGxpY2UuY2FsbChhcnJheSwgZnJvbUluZGV4LCAxKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJhc2VQdWxsQWxsO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VGaW5kSW5kZXggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MCksXG5cdCAgICBiYXNlSXNOYU4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MSksXG5cdCAgICBzdHJpY3RJbmRleE9mID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzIpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcblx0ICByZXR1cm4gdmFsdWUgPT09IHZhbHVlXG5cdCAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG5cdCAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzcwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG5cdCAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuXHQgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG5cdCAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cdFxuXHQgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG5cdCAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuXHQgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmFOO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcblx0ICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG5cdCAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcblx0ICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzczOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGJhc2VJbmRleE9mYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSW5kZXhPZldpdGgoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgsIGNvbXBhcmF0b3IpIHtcblx0ICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuXHQgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoY29tcGFyYXRvcihhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZldpdGg7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKipcblx0ICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuXHQgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuXHQgIHZhciBpbmRleCA9IC0xLFxuXHQgICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXHRcblx0ICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcblx0ICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHQgICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcblx0ICB9XG5cdCAgcmV0dXJuIGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0ZXhwb3J0cy5nZXRJc1Jlc3RyaWN0ZWQgPSBleHBvcnRzLmdldFVzZXJQcm9qZWN0cyA9IGV4cG9ydHMuZ2V0VXNlcklkID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLmZldGNoRGF0YSA9IGZldGNoRGF0YTtcblx0ZXhwb3J0cy5wdXREYXRhID0gcHV0RGF0YTtcblx0ZXhwb3J0cy5nZXRTYWdhID0gZ2V0U2FnYTtcblx0ZXhwb3J0cy5wdXRTYWdhID0gcHV0U2FnYTtcblx0ZXhwb3J0cy53YXRjaGVyU2FnYSA9IHdhdGNoZXJTYWdhO1xuXHRcblx0X193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTYpO1xuXHRcblx0dmFyIF9heGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc3KTtcblx0XG5cdHZhciBfYXhpb3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXhpb3MpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI2MSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBfbWFya2VkID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKGdldFNhZ2EpLFxuXHQgICAgX21hcmtlZDIgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsocHV0U2FnYSksXG5cdCAgICBfbWFya2VkMyA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayh3YXRjaGVyU2FnYSk7IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHQvLyBUaGlzIGltcG9ydCBpcyBuZWNlc3NhcnkgdG8gYmUgYWJsZSB0byB0ZXN0IHNhZ2FzLlxuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4LXNhZ2EvcmVkdXgtc2FnYS9pc3N1ZXMvMjgwI2lzc3VlY29tbWVudC0yOTExMzMwMjNcblx0XG5cdFxuXHRmdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG5cdCAgICByZXR1cm4gKDAsIF9heGlvczIuZGVmYXVsdCkoY29uZmlnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHQgICAgICAgIHJldHVybiB7IHJlc3BvbnNlOiByZXNwb25zZSB9O1xuXHQgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yIH07XG5cdCAgICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG5cdCAgICAgICAgdXJsOiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgdXNlcklkICsgXCIvXCJcblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKSB7XG5cdCAgICB2YXIgY29uZmlnID0ge1xuXHQgICAgICAgIG1ldGhvZDogXCJwdXRcIixcblx0ICAgICAgICBoZWFkZXJzOiB7XG5cdCAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogKDAsIF91dGlscy5nZXRDb29raWUpKFwiY3NyZnRva2VuXCIpXG5cdCAgICAgICAgfSxcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIixcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBwcm9qZWN0czogdXNlcl9wcm9qZWN0c1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0ICAgIHJldHVybiBjYWxsQXhpb3MoY29uZmlnKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0U2FnYShhY3Rpb24pIHtcblx0ICAgIHZhciB1c2VySWQsIF9yZWYsIHJlc3BvbnNlLCBlcnJvcjtcblx0XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gZ2V0U2FnYSQoX2NvbnRleHQpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gYWN0aW9uLmRhdGEudXNlcklkO1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoZmV0Y2hEYXRhLCB1c2VySWQpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2NvbnRleHQuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9yZWYucmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBfcmVmLmVycm9yO1xuXHRcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gOTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDEzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTE6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDEzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX0dFVF9GQUlMVVJFLCBlcnJvcjogZXJyb3IgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZCwgdGhpcyk7XG5cdH1cblx0XG5cdHZhciBnZXRVc2VySWQgPSBleHBvcnRzLmdldFVzZXJJZCA9IGZ1bmN0aW9uIGdldFVzZXJJZChzdGF0ZSkge1xuXHQgICAgcmV0dXJuIHN0YXRlLnVzZXJJZDtcblx0fTtcblx0dmFyIGdldFVzZXJQcm9qZWN0cyA9IGV4cG9ydHMuZ2V0VXNlclByb2plY3RzID0gZnVuY3Rpb24gZ2V0VXNlclByb2plY3RzKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUudXNlcl9wcm9qZWN0cztcblx0fTtcblx0dmFyIGdldElzUmVzdHJpY3RlZCA9IGV4cG9ydHMuZ2V0SXNSZXN0cmljdGVkID0gZnVuY3Rpb24gZ2V0SXNSZXN0cmljdGVkKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUuaXNfcmVzdHJpY3RlZDtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIHB1dFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzLCBfcmVmMiwgcmVzcG9uc2UsIGVycm9yO1xuXHRcblx0ICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBwdXRTYWdhJChfY29udGV4dDIpIHtcblx0ICAgICAgICB3aGlsZSAoMSkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0Mi5wcmV2ID0gX2NvbnRleHQyLm5leHQpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfUFVUX0lOSVQgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0VXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA3O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRJc1Jlc3RyaWN0ZWQpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzpcblx0ICAgICAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMDtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnNlbGVjdCkoZ2V0VXNlclByb2plY3RzKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDEzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkocHV0RGF0YSwgdXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmMi5yZXNwb25zZTtcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvciA9IF9yZWYyLmVycm9yO1xuXHRcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxOTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvcjogZXJyb3IgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyMzpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQyLnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQyLCB0aGlzKTtcblx0fVxuXHRcblx0Ly8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2Fcblx0ZnVuY3Rpb24gd2F0Y2hlclNhZ2EoKSB7XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gd2F0Y2hlclNhZ2EkKF9jb250ZXh0Mykge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQzLnByZXYgPSBfY29udGV4dDMubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuQVBJX0dFVF9JTklULCBnZXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDY7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA4O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDMsIHRoaXMpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cblx0ICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cblx0ICpcblx0ICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG5cdCAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cblx0ICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG5cdCAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cblx0ICovXG5cdFxuXHQhKGZ1bmN0aW9uKGdsb2JhbCkge1xuXHQgIFwidXNlIHN0cmljdFwiO1xuXHRcblx0ICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuXHQgIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcblx0ICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cblx0ICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuXHQgIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG5cdCAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcblx0ICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXHRcblx0ICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuXHQgIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcblx0ICBpZiAocnVudGltZSkge1xuXHQgICAgaWYgKGluTW9kdWxlKSB7XG5cdCAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcblx0ICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cblx0ICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuXHQgICAgfVxuXHQgICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuXHQgICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0XG5cdCAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG5cdCAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuXHQgIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXHRcblx0ICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG5cdCAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cblx0ICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuXHQgICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcblx0ICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXHRcblx0ICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcblx0ICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cblx0ICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblx0XG5cdCAgICByZXR1cm4gZ2VuZXJhdG9yO1xuXHQgIH1cblx0ICBydW50aW1lLndyYXAgPSB3cmFwO1xuXHRcblx0ICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cblx0ICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcblx0ICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcblx0ICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG5cdCAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuXHQgIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcblx0ICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuXHQgIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuXHQgIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcblx0ICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG5cdCAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG5cdCAgICB0cnkge1xuXHQgICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG5cdCAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG5cdCAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG5cdCAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcblx0ICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXHRcblx0ICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG5cdCAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuXHQgIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cdFxuXHQgIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuXHQgIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuXHQgIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG5cdCAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cdFxuXHQgIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcblx0ICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuXHQgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXHQgIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdFxuXHQgIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcblx0ICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG5cdCAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG5cdCAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuXHQgICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG5cdCAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuXHQgICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuXHQgICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcblx0ICB9XG5cdFxuXHQgIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG5cdCAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcblx0ICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG5cdCAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblx0XG5cdCAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcblx0ICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuXHQgIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcblx0ICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuXHQgICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuXHQgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuXHQgICAgICB9O1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcblx0ICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3Rvcjtcblx0ICAgIHJldHVybiBjdG9yXG5cdCAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcblx0ICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG5cdCAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuXHQgICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuXHQgICAgICA6IGZhbHNlO1xuXHQgIH07XG5cdFxuXHQgIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuXHQgICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuXHQgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG5cdCAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcblx0ICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG5cdCAgICByZXR1cm4gZ2VuRnVuO1xuXHQgIH07XG5cdFxuXHQgIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuXHQgIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG5cdCAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuXHQgIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG5cdCAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuXHQgICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcblx0ICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG5cdCAgICAgICAgaWYgKHZhbHVlICYmXG5cdCAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuXHQgICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG5cdCAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuXHQgICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG5cdCAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuXHQgICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG5cdCAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuXHQgICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcblx0ICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG5cdCAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG5cdCAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG5cdCAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcblx0ICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuXHQgICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcblx0ICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuXHQgICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuXHQgICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuXHQgICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG5cdCAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cblx0ICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcblx0ICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcblx0ICAgICAgICB9LCByZWplY3QpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblx0XG5cdCAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG5cdCAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuXHQgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG5cdCAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuXHQgICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuXHQgICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcblx0ICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuXHQgICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuXHQgICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG5cdCAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuXHQgICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG5cdCAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcblx0ICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuXHQgICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG5cdCAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuXHQgICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuXHQgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG5cdCAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuXHQgICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuXHQgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcblx0ICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuXHQgICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG5cdCAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuXHQgIH1cblx0XG5cdCAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblx0ICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdCAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblx0XG5cdCAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuXHQgIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuXHQgIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuXHQgIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuXHQgICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcblx0ICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcblx0ICAgICk7XG5cdFxuXHQgICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuXHQgICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuXHQgICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdCAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcblx0ICAgICAgICB9KTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcblx0ICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cdFxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuXHQgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuXHQgICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgdGhyb3cgYXJnO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcblx0ICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG5cdCAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXHRcblx0ICAgICAgd2hpbGUgKHRydWUpIHtcblx0ICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuXHQgICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuXHQgICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cdCAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcblx0ICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcblx0ICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuXHQgICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG5cdCAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuXHQgICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuXHQgICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXHQgICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblx0XG5cdCAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXHQgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuXHQgICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuXHQgICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuXHQgICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcblx0ICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuXHQgICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cdFxuXHQgICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcblx0ICAgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG5cdCAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuXHQgICAgICAgICAgfTtcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXHQgICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuXHQgICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuXHQgIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcblx0ICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcblx0ICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cblx0ICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG5cdCAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuXHQgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuXHQgICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0XG5cdCAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuXHQgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuXHQgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblx0XG5cdCAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuXHQgICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cblx0ICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG5cdCAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cdFxuXHQgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblx0XG5cdCAgICBpZiAoISBpbmZvKSB7XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChpbmZvLmRvbmUpIHtcblx0ICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3Jhcnlcblx0ICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cblx0ICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cdFxuXHQgICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG5cdCAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cdFxuXHQgICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcblx0ICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuXHQgICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuXHQgICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcblx0ICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcblx0ICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuXHQgICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICB9XG5cdFxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuXHQgICAgICByZXR1cm4gaW5mbztcblx0ICAgIH1cblx0XG5cdCAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuXHQgICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cblx0ICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgfVxuXHRcblx0ICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuXHQgIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cblx0ICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXHRcblx0ICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXHRcblx0ICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuXHQgIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG5cdCAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3Jcblx0ICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cblx0ICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cblx0ICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdFxuXHQgIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuXHQgICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblx0XG5cdCAgICBpZiAoMSBpbiBsb2NzKSB7XG5cdCAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoMiBpbiBsb2NzKSB7XG5cdCAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuXHQgICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG5cdCAgICB9XG5cdFxuXHQgICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuXHQgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG5cdCAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG5cdCAgICBkZWxldGUgcmVjb3JkLmFyZztcblx0ICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG5cdCAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcblx0ICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cblx0ICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cblx0ICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG5cdCAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG5cdCAgICB0aGlzLnJlc2V0KHRydWUpO1xuXHQgIH1cblx0XG5cdCAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdCAgICB2YXIga2V5cyA9IFtdO1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHQgICAgICBrZXlzLnB1c2goa2V5KTtcblx0ICAgIH1cblx0ICAgIGtleXMucmV2ZXJzZSgpO1xuXHRcblx0ICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG5cdCAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuXHQgICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuXHQgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuXHQgICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuXHQgICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cblx0ICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblx0ICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICB9O1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuXHQgICAgaWYgKGl0ZXJhYmxlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcblx0ICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuXHQgICAgICAgIHJldHVybiBpdGVyYWJsZTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG5cdCAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcblx0ICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG5cdCAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblx0XG5cdCAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICB9O1xuXHRcblx0ICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cblx0ICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcblx0ICB9XG5cdCAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cdFxuXHQgIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG5cdCAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG5cdCAgfVxuXHRcblx0ICBDb250ZXh0LnByb3RvdHlwZSA9IHtcblx0ICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXHRcblx0ICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG5cdCAgICAgIHRoaXMucHJldiA9IDA7XG5cdCAgICAgIHRoaXMubmV4dCA9IDA7XG5cdCAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG5cdCAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG5cdCAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG5cdCAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuXHQgICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblx0XG5cdCAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cdFxuXHQgICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcblx0ICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcblx0ICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG5cdCAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG5cdCAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcblx0ICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG5cdCAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuXHQgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXHRcblx0ICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcblx0ICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcblx0ICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG5cdCAgICB9LFxuXHRcblx0ICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcblx0ICAgICAgaWYgKHRoaXMuZG9uZSkge1xuXHQgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuXHQgICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcblx0ICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcblx0ICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuXHQgICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblx0XG5cdCAgICAgICAgaWYgKGNhdWdodCkge1xuXHQgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcblx0ICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXHRcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuXHQgICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcblx0ICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuXHQgICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cblx0ICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuXHQgICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG5cdCAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cdFxuXHQgICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG5cdCAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG5cdCAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcblx0ICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG5cdCAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG5cdCAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuXHQgICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcblx0ICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcblx0ICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG5cdCAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG5cdCAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcblx0ICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblx0XG5cdCAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcblx0ICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuXHQgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuXHQgICAgfSxcblx0XG5cdCAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHRocm93IHJlY29yZC5hcmc7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG5cdCAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcblx0ICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcblx0ICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuXHQgICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH0sXG5cdFxuXHQgICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuXHQgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcblx0ICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXHQgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgcmV0dXJuIHRocm93bjtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuXHQgICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcblx0ICAgIH0sXG5cdFxuXHQgICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcblx0ICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcblx0ICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcblx0ICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuXHQgICAgICAgIG5leHRMb2M6IG5leHRMb2Ncblx0ICAgICAgfTtcblx0XG5cdCAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcblx0ICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuXHQgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cblx0ICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdCAgfTtcblx0fSkoXG5cdCAgLy8gSW4gc2xvcHB5IG1vZGUsIHVuYm91bmQgYHRoaXNgIHJlZmVycyB0byB0aGUgZ2xvYmFsIG9iamVjdCwgZmFsbGJhY2sgdG9cblx0ICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG5cdCAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cblx0ICAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc4KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc3ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdHZhciBiaW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApO1xuXHR2YXIgQXhpb3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Mik7XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzgzKTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2Vcblx0ICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG5cdCAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG5cdCAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cdFxuXHQgIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG5cdCAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXHRcblx0ICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2Vcblx0ICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXHRcblx0ICByZXR1cm4gaW5zdGFuY2U7XG5cdH1cblx0XG5cdC8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuXHR2YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cdFxuXHQvLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2Vcblx0YXhpb3MuQXhpb3MgPSBBeGlvcztcblx0XG5cdC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcblx0YXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG5cdCAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xuXHR9O1xuXHRcblx0Ly8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5cdGF4aW9zLkNhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oODAwKTtcblx0YXhpb3MuQ2FuY2VsVG9rZW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwMSk7XG5cdGF4aW9zLmlzQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRcblx0Ly8gRXhwb3NlIGFsbC9zcHJlYWRcblx0YXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG5cdCAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0fTtcblx0YXhpb3Muc3ByZWFkID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4MDIpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblx0XG5cdC8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxuXHRtb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzgwKTtcblx0dmFyIGlzQnVmZmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODEpO1xuXHRcblx0LypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cdFxuXHQvLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXHRcblx0dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG5cdCAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuXHQgIHZhciByZXN1bHQ7XG5cdCAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuXHQgICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc051bWJlcih2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcblx0ICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcblx0ICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xuXHR9XG5cdFxuXHQvKipcblx0ICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2Vcblx0ICovXG5cdGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG5cdCAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgKlxuXHQgKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuXHQgKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG5cdCAqXG5cdCAqIHdlYiB3b3JrZXJzOlxuXHQgKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcblx0ICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcblx0ICpcblx0ICogcmVhY3QtbmF0aXZlOlxuXHQgKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIHJldHVybiAoXG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuXHQgICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuXHQgICk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cblx0ICpcblx0ICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuXHQgKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cblx0ICpcblx0ICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3Npbmdcblx0ICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuXHQgKi9cblx0ZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG5cdCAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG5cdCAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0XG5cdCAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG5cdCAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG5cdCAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAgIG9iaiA9IFtvYmpdO1xuXHQgIH1cblx0XG5cdCAgaWYgKGlzQXJyYXkob2JqKSkge1xuXHQgICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuXHQgICAgfVxuXHQgIH0gZWxzZSB7XG5cdCAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0ICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcblx0ICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG5cdCAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuXHQgKlxuXHQgKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuXHQgKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG5cdCAqXG5cdCAqIEV4YW1wbGU6XG5cdCAqXG5cdCAqIGBgYGpzXG5cdCAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcblx0ICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG5cdCAqIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2Vcblx0ICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRmdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcblx0ICB2YXIgcmVzdWx0ID0ge307XG5cdCAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcblx0ICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXN1bHRba2V5XSA9IHZhbDtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuXHQgKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cblx0ICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG5cdCAqL1xuXHRmdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuXHQgIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcblx0ICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYVtrZXldID0gdmFsO1xuXHQgICAgfVxuXHQgIH0pO1xuXHQgIHJldHVybiBhO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICBpc0FycmF5OiBpc0FycmF5LFxuXHQgIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG5cdCAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuXHQgIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG5cdCAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuXHQgIGlzU3RyaW5nOiBpc1N0cmluZyxcblx0ICBpc051bWJlcjogaXNOdW1iZXIsXG5cdCAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuXHQgIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcblx0ICBpc0RhdGU6IGlzRGF0ZSxcblx0ICBpc0ZpbGU6IGlzRmlsZSxcblx0ICBpc0Jsb2I6IGlzQmxvYixcblx0ICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuXHQgIGlzU3RyZWFtOiBpc1N0cmVhbSxcblx0ICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG5cdCAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuXHQgIGZvckVhY2g6IGZvckVhY2gsXG5cdCAgbWVyZ2U6IG1lcmdlLFxuXHQgIGV4dGVuZDogZXh0ZW5kLFxuXHQgIHRyaW06IHRyaW1cblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuXHQgIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuXHQgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcblx0ICB9O1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyohXG5cdCAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcblx0ICpcblx0ICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cblx0ICogQGxpY2Vuc2UgIE1JVFxuXHQgKi9cblx0XG5cdC8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcblx0Ly8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG5cdCAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcblx0fVxuXHRcblx0Ly8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cblx0ZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcblx0ICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcblx0fVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODMpO1xuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdHZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NCk7XG5cdHZhciBkaXNwYXRjaFJlcXVlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5NSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0ZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcblx0ICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG5cdCAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG5cdCAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG5cdCAgfTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERpc3BhdGNoIGEgcmVxdWVzdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcblx0ICovXG5cdEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG5cdCAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG5cdCAgICBjb25maWcgPSB1dGlscy5tZXJnZSh7XG5cdCAgICAgIHVybDogYXJndW1lbnRzWzBdXG5cdCAgICB9LCBhcmd1bWVudHNbMV0pO1xuXHQgIH1cblx0XG5cdCAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblx0ICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuXHRcblx0ICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG5cdCAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcblx0ICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXHRcblx0ICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcblx0ICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG5cdCAgfSk7XG5cdFxuXHQgIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG5cdCAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuXHQgIH0pO1xuXHRcblx0ICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG5cdCAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cdFxuXHQvLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcblx0dXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG5cdCAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cblx0ICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG5cdCAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuXHQgICAgICBtZXRob2Q6IG1ldGhvZCxcblx0ICAgICAgdXJsOiB1cmxcblx0ICAgIH0pKTtcblx0ICB9O1xuXHR9KTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG5cdCAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cblx0ICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG5cdCAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuXHQgICAgICBtZXRob2Q6IG1ldGhvZCxcblx0ICAgICAgdXJsOiB1cmwsXG5cdCAgICAgIGRhdGE6IGRhdGFcblx0ICAgIH0pKTtcblx0ICB9O1xuXHR9KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0dmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NCk7XG5cdFxuXHR2YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG5cdCAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG5cdH07XG5cdFxuXHRmdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcblx0ICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuXHQgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuXHQgIHZhciBhZGFwdGVyO1xuXHQgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG5cdCAgICBhZGFwdGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHQgIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG5cdCAgICBhZGFwdGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHQgIH1cblx0ICByZXR1cm4gYWRhcHRlcjtcblx0fVxuXHRcblx0dmFyIGRlZmF1bHRzID0ge1xuXHQgIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cdFxuXHQgIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcblx0ICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXHQgICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG5cdCAgICApIHtcblx0ICAgICAgcmV0dXJuIGRhdGE7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcblx0ICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG5cdCAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcblx0ICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuXHQgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuXHQgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZGF0YTtcblx0ICB9XSxcblx0XG5cdCAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG5cdCAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblx0ICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGRhdGE7XG5cdCAgfV0sXG5cdFxuXHQgIC8qKlxuXHQgICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuXHQgICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG5cdCAgICovXG5cdCAgdGltZW91dDogMCxcblx0XG5cdCAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcblx0ICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cdFxuXHQgIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXHRcblx0ICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG5cdCAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZGVmYXVsdHMuaGVhZGVycyA9IHtcblx0ICBjb21tb246IHtcblx0ICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuXHQgIH1cblx0fTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcblx0ICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcblx0fSk7XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuXHQgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcblx0fSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXHRcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuXHQgIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuXHQgICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuXHQgICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuXHQgICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHR2YXIgc2V0dGxlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODYpO1xuXHR2YXIgYnVpbGRVUkwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OSk7XG5cdHZhciBwYXJzZUhlYWRlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5MCk7XG5cdHZhciBpc1VSTFNhbWVPcmlnaW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5MSk7XG5cdHZhciBjcmVhdGVFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzg3KTtcblx0dmFyIGJ0b2EgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmJ0b2EgJiYgd2luZG93LmJ0b2EuYmluZCh3aW5kb3cpKSB8fCBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Mik7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuXHQgICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cdFxuXHQgICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG5cdCAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuXHQgICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblx0XG5cdCAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuXHQgICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cblx0ICAgIC8vIERPTidUIGRvIHRoaXMgZm9yIHRlc3RpbmcgYi9jIFhNTEh0dHBSZXF1ZXN0IGlzIG1vY2tlZCwgbm90IFhEb21haW5SZXF1ZXN0LlxuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcblx0ICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuXHQgICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCAmJiAhKCd3aXRoQ3JlZGVudGlhbHMnIGluIHJlcXVlc3QpICYmXG5cdCAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuXHQgICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuXHQgICAgICBsb2FkRXZlbnQgPSAnb25sb2FkJztcblx0ICAgICAgeERvbWFpbiA9IHRydWU7XG5cdCAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG5cdCAgICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHt9O1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cblx0ICAgIGlmIChjb25maWcuYXV0aCkge1xuXHQgICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcblx0ICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgfHwgJyc7XG5cdCAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG5cdCAgICB9XG5cdFxuXHQgICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblx0XG5cdCAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuXHQgICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cdFxuXHQgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuXHQgICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcblx0ICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcblx0ICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcblx0ICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcblx0ICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuXHQgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG5cdCAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcblx0ICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcblx0ICAgICAgdmFyIHJlc3BvbnNlID0ge1xuXHQgICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcblx0ICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcblx0ICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG5cdCAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAnTm8gQ29udGVudCcgOiByZXF1ZXN0LnN0YXR1c1RleHQsXG5cdCAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuXHQgICAgICAgIGNvbmZpZzogY29uZmlnLFxuXHQgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3Rcblx0ICAgICAgfTtcblx0XG5cdCAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcblx0ICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuXHQgICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcblx0ICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG5cdCAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gSGFuZGxlIHRpbWVvdXRcblx0ICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcblx0ICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG5cdCAgICAgICAgcmVxdWVzdCkpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG5cdCAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cblx0ICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG5cdCAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuXHQgICAgICB2YXIgY29va2llcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzkzKTtcblx0XG5cdCAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuXHQgICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuXHQgICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuXHQgICAgICAgICAgdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuXHQgICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuXHQgICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG5cdCAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcblx0ICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcblx0ICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcblx0ICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuXHQgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblx0ICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG5cdCAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cdCAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcblx0ICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cblx0ICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuXHQgICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcblx0ICAgICAgICAgIHRocm93IGU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuXHQgICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuXHQgICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuXHQgICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG5cdCAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cblx0ICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuXHQgICAgICAgIGlmICghcmVxdWVzdCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuXHQgICAgICAgIHJlamVjdChjYW5jZWwpO1xuXHQgICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFNlbmQgdGhlIHJlcXVlc3Rcblx0ICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG5cdCAgfSk7XG5cdH07XG5cdFxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGNyZWF0ZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODcpO1xuXHRcblx0LyoqXG5cdCAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG5cdCAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuXHQgIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuXHQgIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG5cdCAgICByZXNvbHZlKHJlc3BvbnNlKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuXHQgICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuXHQgICAgICByZXNwb25zZS5jb25maWcsXG5cdCAgICAgIG51bGwsXG5cdCAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG5cdCAgICAgIHJlc3BvbnNlXG5cdCAgICApKTtcblx0ICB9XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgZW5oYW5jZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cdCAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuXHQgIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cdCAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuXHQgIGlmIChjb2RlKSB7XG5cdCAgICBlcnJvci5jb2RlID0gY29kZTtcblx0ICB9XG5cdCAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG5cdCAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcblx0ICByZXR1cm4gZXJyb3I7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHRmdW5jdGlvbiBlbmNvZGUodmFsKSB7XG5cdCAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuXHQgICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuXHQgICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuXHQgICAgcmVwbGFjZSgvJTI0L2csICckJykuXG5cdCAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG5cdCAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cblx0ICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cblx0ICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcblx0ICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICBpZiAoIXBhcmFtcykge1xuXHQgICAgcmV0dXJuIHVybDtcblx0ICB9XG5cdFxuXHQgIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuXHQgIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuXHQgIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB2YXIgcGFydHMgPSBbXTtcblx0XG5cdCAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG5cdCAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcblx0ICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhbCA9IFt2YWxdO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuXHQgICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG5cdCAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuXHQgICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHVybDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0XG5cdC8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG5cdC8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcblx0dmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuXHQgICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG5cdCAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuXHQgICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcblx0ICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXHRdO1xuXHRcblx0LyoqXG5cdCAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3Rcblx0ICpcblx0ICogYGBgXG5cdCAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG5cdCAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuXHQgKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG5cdCAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG5cdCAqIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG5cdCAgdmFyIHBhcnNlZCA9IHt9O1xuXHQgIHZhciBrZXk7XG5cdCAgdmFyIHZhbDtcblx0ICB2YXIgaTtcblx0XG5cdCAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblx0XG5cdCAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcblx0ICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcblx0ICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cdFxuXHQgICAgaWYgKGtleSkge1xuXHQgICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG5cdCAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIHBhcnNlZDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzc5KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gKFxuXHQgIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXHRcblx0ICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3Rcblx0ICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cblx0ICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHQgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHQgICAgdmFyIG9yaWdpblVSTDtcblx0XG5cdCAgICAvKipcblx0ICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG5cdCAgICAqXG5cdCAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcblx0ICAgICogQHJldHVybnMge09iamVjdH1cblx0ICAgICovXG5cdCAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuXHQgICAgICB2YXIgaHJlZiA9IHVybDtcblx0XG5cdCAgICAgIGlmIChtc2llKSB7XG5cdCAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuXHQgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHQgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblx0XG5cdCAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcblx0ICAgICAgcmV0dXJuIHtcblx0ICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuXHQgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG5cdCAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcblx0ICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG5cdCAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcblx0ICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG5cdCAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcblx0ICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG5cdCAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcblx0ICAgICAgICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcblx0ICAgICAgfTtcblx0ICAgIH1cblx0XG5cdCAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0XG5cdCAgICAvKipcblx0ICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG5cdCAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2Vcblx0ICAgICovXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcblx0ICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcblx0ICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuXHQgICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuXHQgICAgfTtcblx0ICB9KSgpIDpcblx0XG5cdCAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cblx0ICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9O1xuXHQgIH0pKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXHRcblx0dmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89Jztcblx0XG5cdGZ1bmN0aW9uIEUoKSB7XG5cdCAgdGhpcy5tZXNzYWdlID0gJ1N0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3Rlcic7XG5cdH1cblx0RS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5cdEUucHJvdG90eXBlLmNvZGUgPSA1O1xuXHRFLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cdFxuXHRmdW5jdGlvbiBidG9hKGlucHV0KSB7XG5cdCAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG5cdCAgdmFyIG91dHB1dCA9ICcnO1xuXHQgIGZvciAoXG5cdCAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuXHQgICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG5cdCAgICAvLyBpZiB0aGUgbmV4dCBzdHIgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG5cdCAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuXHQgICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuXHQgICAgc3RyLmNoYXJBdChpZHggfCAwKSB8fCAobWFwID0gJz0nLCBpZHggJSAxKTtcblx0ICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG5cdCAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcblx0ICApIHtcblx0ICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcblx0ICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcblx0ICAgICAgdGhyb3cgbmV3IEUoKTtcblx0ICAgIH1cblx0ICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuXHQgIH1cblx0ICByZXR1cm4gb3V0cHV0O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IChcblx0ICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblx0XG5cdCAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG5cdCAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcblx0ICAgICAgICB2YXIgY29va2llID0gW107XG5cdCAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcblx0ICAgICAgfSxcblx0XG5cdCAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuXHQgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG5cdCAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcblx0ICAgICAgfSxcblx0XG5cdCAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcblx0ICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH0pKCkgOlxuXHRcblx0ICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5cdCAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuXHQgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcblx0ICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuXHQgICAgfTtcblx0ICB9KSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHRmdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG5cdCAgdGhpcy5oYW5kbGVycyA9IFtdO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG5cdCAqXG5cdCAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcblx0ICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuXHQgICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG5cdCAgICByZWplY3RlZDogcmVqZWN0ZWRcblx0ICB9KTtcblx0ICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuXHQgKlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcblx0ICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcblx0ICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcblx0ICB9XG5cdH07XG5cdFxuXHQvKipcblx0ICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcblx0ICpcblx0ICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcblx0ICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG5cdCAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG5cdCAgICBpZiAoaCAhPT0gbnVsbCkge1xuXHQgICAgICBmbihoKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzkpO1xuXHR2YXIgdHJhbnNmb3JtRGF0YSA9IF9fd2VicGFja19yZXF1aXJlX18oNzk2KTtcblx0dmFyIGlzQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4Myk7XG5cdHZhciBpc0Fic29sdXRlVVJMID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTgpO1xuXHR2YXIgY29tYmluZVVSTHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OSk7XG5cdFxuXHQvKipcblx0ICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG5cdCAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuXHQgICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcblx0ICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgIC8vIFN1cHBvcnQgYmFzZVVSTCBjb25maWdcblx0ICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcblx0ICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG5cdCAgfVxuXHRcblx0ICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuXHQgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cdFxuXHQgIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcblx0ICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICBjb25maWcuZGF0YSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzLFxuXHQgICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3Rcblx0ICApO1xuXHRcblx0ICAvLyBGbGF0dGVuIGhlYWRlcnNcblx0ICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuXHQgICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuXHQgICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG5cdCAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuXHQgICk7XG5cdFxuXHQgIHV0aWxzLmZvckVhY2goXG5cdCAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcblx0ICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuXHQgICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcblx0ICAgIH1cblx0ICApO1xuXHRcblx0ICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cdFxuXHQgIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG5cdCAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblx0ICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgICByZXNwb25zZS5kYXRhLFxuXHQgICAgICByZXNwb25zZS5oZWFkZXJzLFxuXHQgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2Vcblx0ICAgICk7XG5cdFxuXHQgICAgcmV0dXJuIHJlc3BvbnNlO1xuXHQgIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcblx0ICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuXHQgICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXHQgICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuXHQgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuXHQgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG5cdCAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2Vcblx0ICAgICAgICApO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG5cdCAgfSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSk7XG5cdFxuXHQvKipcblx0ICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcblx0ICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2Vcblx0ICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuXHQgKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuXHQgICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gZGF0YTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk3OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcblx0ICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcblx0ICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG5cdCAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG5cdCAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG5cdCAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcblx0ICByZXR1cm4gcmVsYXRpdmVVUkxcblx0ICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG5cdCAgICA6IGJhc2VVUkw7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwMDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuXHQgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0XG5cdENhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcblx0fTtcblx0XG5cdENhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gODAxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwMCk7XG5cdFxuXHQvKipcblx0ICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cblx0ICpcblx0ICogQGNsYXNzXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG5cdCAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuXHQgIH1cblx0XG5cdCAgdmFyIHJlc29sdmVQcm9taXNlO1xuXHQgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG5cdCAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG5cdCAgfSk7XG5cdFxuXHQgIHZhciB0b2tlbiA9IHRoaXM7XG5cdCAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcblx0ICAgIGlmICh0b2tlbi5yZWFzb24pIHtcblx0ICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0XG5cdCAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuXHQgICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcblx0ICB9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRDYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG5cdCAgaWYgKHRoaXMucmVhc29uKSB7XG5cdCAgICB0aHJvdyB0aGlzLnJlYXNvbjtcblx0ICB9XG5cdH07XG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuXHQgKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuXHQgKi9cblx0Q2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuXHQgIHZhciBjYW5jZWw7XG5cdCAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcblx0ICAgIGNhbmNlbCA9IGM7XG5cdCAgfSk7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRva2VuOiB0b2tlbixcblx0ICAgIGNhbmNlbDogY2FuY2VsXG5cdCAgfTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwMjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cblx0ICpcblx0ICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cblx0ICpcblx0ICogIGBgYGpzXG5cdCAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG5cdCAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcblx0ICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG5cdCAqICBgYGBcblx0ICpcblx0ICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG5cdCAqXG5cdCAqICBgYGBqc1xuXHQgKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuXHQgKiAgYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn1cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG5cdCAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcblx0ICB9O1xuXHR9O1xuXG5cbi8qKiovIH0pXG5cbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB1c2VyUHJvamVjdHMtYnVuZGxlLmpzIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG5pbXBvcnQgQXBwIGZyb20gXCIuL2NvbXBvbmVudHMvQXBwXCI7XG5cbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUsIGNvbXBvc2UgfSBmcm9tIFwicmVkdXhcIjtcbmltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFwicmVkdXgtc2FnYVwiO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcblxuaW1wb3J0IHsgcmVkdWNlciB9IGZyb20gXCIuL3JlZHVjZXJcIjtcbmltcG9ydCB7IHdhdGNoZXJTYWdhIH0gZnJvbSBcIi4vc2FnYXNcIjtcblxuLy8gY3JlYXRlIHRoZSBzYWdhIG1pZGRsZXdhcmVcbmNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKTtcblxuLy8gZGV2IHRvb2xzIG1pZGRsZXdhcmVcbmNvbnN0IHJlZHV4RGV2VG9vbHMgPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpO1xuXG5sZXQgc3RvcmU7XG5pZiAocmVkdXhEZXZUb29scykge1xuICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgY29tcG9zZShhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG59IGVsc2Uge1xuICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSk7XG59XG5cbnNhZ2FNaWRkbGV3YXJlLnJ1bih3YXRjaGVyU2FnYSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgICAgICA8QXBwIC8+XG4gICAgICAgIDwvUHJvdmlkZXI+LFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJQcm9qZWN0c1wiKVxuICAgICk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2FwcC5qcyIsIi8qXG4gICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgeyBfLCBkYXRhRnJvbUVsZW1lbnQsIGluQXJyYXkgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi4vY29uc3RcIjtcblxuY29uc3QgSXNSZXN0cmljdGVkID0gKHsgXywgaXNfcmVzdHJpY3RlZCwgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZD1cImlzX3Jlc3RyaWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc19yZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2VJc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7LyogVGhlIHN0cmluZ3MgaW5jbHVkZSA8c3Ryb25nPiB0YWdzIHdoaWNoIHJlcXVpcmVzIHRoZSB1c2Ugb2ZcbiAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgKi99XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIF9faHRtbDogaXNfcmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXyhcInVzZXJfYWNjZXNzX3Jlc3RyaWN0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IF8oXCJ1c2VyX2FjY2Vzc191bnJlc3RyaWN0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIHtpc19yZXN0cmljdGVkID8gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVzdHJpY3RlZEluZm9cIlxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IF8oXCJyZXN0cmljdGVkX2luZm9cIikgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn07XG5cbmNvbnN0IFByb2plY3QgPSAoeyBfLCBwcm9qZWN0LCB1c2VyX3Byb2plY3RzLCBpc19yZXN0cmljdGVkLCBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCB9KSA9PiB7XG4gICAgLy8gTk9URTogdGhlIGNoZWNrZWQgdmFsdWUgaXMgc2V0IHRvIHRydWUgaWYgaXNfcmVzdHJpY3RlZCBpcyBmYWxzZS4gVGhpcyBpcyBzbyB0aGF0IHRoZSBsaXN0IG9mXG4gICAgLy8gcHJvamVjdHMgbG9va3MgbGlrZSBhbGwgcHJvamVjdHMgYXJlIHNlbGVjdGVkIHdoZW4gcmVzdHJpY3Rpb25zIGFyZSBub3QgaW4gZm9yY2UuXG4gICAgLy8gVGhpcyBpcyBfbm90XyByZWZsZWN0ZWQgaW4gdGhlIHN0b3JlLlxuICAgIGNvbnN0IHVpU2V0dGluZ3MgPSAocHJvamVjdCwgdXNlcl9wcm9qZWN0cywgaXNfcmVzdHJpY3RlZCkgPT4ge1xuICAgICAgICBjb25zdCBjaGVja2VkID0gIWlzX3Jlc3RyaWN0ZWQgfHwgKHVzZXJfcHJvamVjdHMgJiYgaW5BcnJheShwcm9qZWN0LmlkLCB1c2VyX3Byb2plY3RzKSksXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgICAgIHRyQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBwcm9qZWN0U2VsZWN0ZWQsXG4gICAgICAgICAgICBpZENsYXNzTmFtZSA9IGRpc2FibGVkICsgXCIgaWRcIjtcbiAgICAgICAgcmV0dXJuIHsgY2hlY2tlZCwgdHJDbGFzc05hbWUsIGlkQ2xhc3NOYW1lIH07XG4gICAgfTtcbiAgICBjb25zdCB7IGNoZWNrZWQsIHRyQ2xhc3NOYW1lLCBpZENsYXNzTmFtZSB9ID0gdWlTZXR0aW5ncyhwcm9qZWN0LCB1c2VyX3Byb2plY3RzLCBpc19yZXN0cmljdGVkKTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8dHJcbiAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgIGlkPXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgb25DbGljaz17b25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICBjbGFzc05hbWU9e3RyQ2xhc3NOYW1lfVxuICAgICAgICA+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGlkPXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtjaGVja2VkfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5PXt0cnVlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT17aWRDbGFzc05hbWV9Pntwcm9qZWN0LmlkfTwvdGQ+XG4gICAgICAgICAgICA8dGQ+e3Byb2plY3QudGl0bGUgfHwgXyhcIm5vX3RpdGxlXCIpfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgKTtcbn07XG5cbmNvbnN0IFNlbGVjdEFsbCA9ICh7IF8sIHNlbGVjdEFsbCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLCBpc19yZXN0cmljdGVkIH0pID0+IHtcbiAgICBjb25zdCB1aVNldHRpbmdzID0gaXNfcmVzdHJpY3RlZCA9PiB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNsYXNzID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIiksXG4gICAgICAgICAgICBkaXNhYmxlZCA9ICFpc19yZXN0cmljdGVkLFxuICAgICAgICAgICAgZGl2Q2xhc3MgPSBpc19yZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIjtcbiAgICAgICAgcmV0dXJuIHsgYnV0dG9uQ2xhc3MsIGRpc2FibGVkLCBkaXZDbGFzcyB9O1xuICAgIH07XG4gICAgY29uc3QgeyBkaXZDbGFzcywgZGlzYWJsZWQsIGJ1dHRvbkNsYXNzIH0gPSB1aVNldHRpbmdzKGlzX3Jlc3RyaWN0ZWQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbH0gZGlzYWJsZWQ9e2Rpc2FibGVkfSBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfT5cbiAgICAgICAgICAgICAgICB7c2VsZWN0QWxsID8gXyhcImNoZWNrX2FsbF9wcm9qZWN0c1wiKSA6IF8oXCJ1bmNoZWNrX2FsbF9wcm9qZWN0c1wiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuY29uc3QgRXJyb3IgPSAoeyBfLCBlcnJvciB9KSA9PiB7XG4gICAgcmV0dXJuIGVycm9yID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvclwiPntfKFwiYW5fZXJyb3Jfb2NjdXJlZFwiKSArIGVycm9yLm1lc3NhZ2V9PC9kaXY+IDogbnVsbDtcbn07XG5cbmNvbnN0IFByb2plY3RzID0gKHtcbiAgICBfLFxuICAgIGVycm9yLFxuICAgIGFsbF9wcm9qZWN0cyxcbiAgICB1c2VyX3Byb2plY3RzLFxuICAgIGlzX3Jlc3RyaWN0ZWQsXG4gICAgc2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcbiAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxufSkgPT4ge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGlzX3Jlc3RyaWN0ZWQgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPEVycm9yIF89e199IGVycm9yPXtlcnJvcn0gLz5cbiAgICAgICAgICAgIDxJc1Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTZWxlY3RBbGxcbiAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ9e2lzX3Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHRhYmxlPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcImFjY2Vzc1wiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57XyhcInByb2plY3RfaWRcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJwcm9qZWN0X3RpdGxlXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHthbGxfcHJvamVjdHMubWFwKHByb2plY3QgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFByb2plY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXtwcm9qZWN0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM9e3VzZXJfcHJvamVjdHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWQgPSB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCA9IHRoaXMudG9nZ2xlSXNSZXN0cmljdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCA9IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl8gPSB0aGlzLl8uYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2xhdGlvbiBoYW5kbGluZ1xuICAgIF8ocykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJpbmdzICYmIHRoaXMucHJvcHMuc3RyaW5nc1tzXTtcbiAgICB9XG5cbiAgICB0b2dnbGVJc1Jlc3RyaWN0ZWQoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlSXNSZXN0cmljdGVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuICAgIH1cblxuICAgIHRvZ2dsZVByb2plY3RTZWxlY3RBbGwoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlU2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJvamVjdFNlbGVjdGVkKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBwYXJzZUludCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZVByb2plY3RTZWxlY3Rpb24oaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IGRhdGFGcm9tRWxlbWVudChcInVzZXItdG8tcmVzdHJpY3RcIikuaWQ7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0U3RvcmUoeyB1c2VySWQgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RyaW5ncyA9IGRhdGFGcm9tRWxlbWVudChcInVzZXItcHJvamVjdHMtdGV4dFwiKTtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHN0cmluZ3MgfSk7XG5cbiAgICAgICAgdGhpcy5wcm9wcy5vbkZldGNoVXNlclByb2plY3RzKHVzZXJJZCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGlzX3Jlc3RyaWN0ZWQsIHNlbGVjdEFsbCwgYWxsX3Byb2plY3RzLCB1c2VyX3Byb2plY3RzLCBlcnJvciB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIGFsbF9wcm9qZWN0cyA/IChcbiAgICAgICAgICAgIDxQcm9qZWN0c1xuICAgICAgICAgICAgICAgIF89e3RoaXMuX31cbiAgICAgICAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZD17aXNfcmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBzZWxlY3RBbGw9e3NlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM9e2FsbF9wcm9qZWN0c31cbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzPXt1c2VyX3Byb2plY3RzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkPXt0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17dGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdj57XyhcImxvYWRpbmdcIil9PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdGF0ZSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBmZXRjaGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFsbF9wcm9qZWN0cyxcbiAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICB1c2VyX3Byb2plY3RzLFxuICAgICAgICBzdHJpbmdzXG4gICAgfSA9IHN0YXRlO1xuICAgIHJldHVybiB7IGZldGNoaW5nLCBlcnJvciwgYWxsX3Byb2plY3RzLCBpc19yZXN0cmljdGVkLCBzZWxlY3RBbGwsIHVzZXJfcHJvamVjdHMsIHN0cmluZ3MgfTtcbn07XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBvbkZldGNoVXNlclByb2plY3RzOiB1c2VySWQgPT5cbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLkFQSV9HRVRfSU5JVCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJJZCB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgc2V0U3RvcmU6IGRhdGEgPT5cbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLlNFVF9TVE9SRSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uOiBwcm9qZWN0SWQgPT5cbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTixcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHByb2plY3RJZCB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgb25VcGRhdGVJc1Jlc3RyaWN0ZWQ6IGlzX3Jlc3RyaWN0ZWQgPT5cbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9JU19SRVNUUklDVEVELFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgaXNfcmVzdHJpY3RlZCB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KVxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShBcHApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4IiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4uL215LXJlc3VsdHMvc3RvcmVcIjtcblxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICB1c2VyX3Byb2plY3RzX2FjY2VzczogaWQgPT4gYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7aWR9Lz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBjb25zdCBpbkFycmF5ID0gKG9iaiwgYXJyKSA9PiBhcnIgJiYgYXJyLmluZGV4T2Yob2JqKSAhPT0gLTE7XG5cbmV4cG9ydCBjb25zdCBkYXRhRnJvbUVsZW1lbnQgPSBlbGVtZW50TmFtZSA9PiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvdXRpbHMuanMiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIGFjdGlvbiB0eXBlc1xuZXhwb3J0IGNvbnN0IC8vXG4gICAgU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcbiAgICAvL1xuICAgIEFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG4gICAgQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcbiAgICBBUElfR0VUX0ZBSUxVUkUgPSBcIkFQSV9HRVRfRkFJTFVSRVwiLFxuICAgIC8vXG4gICAgQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcbiAgICBBUElfUFVUX1NVQ0NFU1MgPSBcIkFQSV9QVVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBcIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTlwiLFxuICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gXCJVUERBVEVfSVNfUkVTVFJJQ1RFRFwiLFxuICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gXCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU1wiO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29uc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXG52YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9ydW5TYWdhJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG4gIH1cbn0pO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9jaGFubmVsJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuRU5EO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZXZlbnRDaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuZXZlbnRDaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLmNoYW5uZWw7XG4gIH1cbn0pO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9idWZmZXJzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG4gIH1cbn0pO1xuXG52YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvc2FnYUhlbHBlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG4gIH1cbn0pO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5kZWxheTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG4gIH1cbn0pO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZGV0YWNoO1xuICB9XG59KTtcblxudmFyIF9taWRkbGV3YXJlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvbWlkZGxld2FyZScpO1xuXG52YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXG52YXIgX2VmZmVjdHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9lZmZlY3RzJyk7XG5cbnZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblxudmFyIF91dGlsczIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuZXhwb3J0cy5lZmZlY3RzID0gZWZmZWN0cztcbmV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcHJvYycpO1xuXG52YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcbnZhciBOT05fR0VORVJBVE9SX0VSUiA9IFJVTl9TQUdBX1NJR05BVFVSRSArICc6IHNhZ2EgYXJndW1lbnQgbXVzdCBiZSBhIEdlbmVyYXRvciBmdW5jdGlvbiEnO1xuXG5mdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3Ioc3RvcmVJbnRlcmZhY2UpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG4gICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG4gICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9OX0dFTkVSQVRPUl9FUlIpO1xuICB9XG5cbiAgdmFyIF9zdG9yZUludGVyZmFjZSA9IHN0b3JlSW50ZXJmYWNlLFxuICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuICAgICAgZ2V0U3RhdGUgPSBfc3RvcmVJbnRlcmZhY2UuZ2V0U3RhdGUsXG4gICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG4gICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IF9zdG9yZUludGVyZmFjZS5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cblxuICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkID0gc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCB8fCBfdXRpbHMubm9vcDtcblxuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG4gIH1cblxuICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cbiAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuICB9XG5cbiAgcmV0dXJuIHRhc2s7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3J1blNhZ2EuanNcbi8vIG1vZHVsZSBpZCA9IDc0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xuZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbmV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcbmV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuZXhwb3J0cy5jcmVhdGVNb2NrVGFzayA9IGNyZWF0ZU1vY2tUYXNrO1xuZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcbmV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcbnZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuICByZXR1cm4gJ0BAcmVkdXgtc2FnYS8nICsgaWQ7XG59O1xuXG52YXIgVEFTSyA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlRBU0sgPSBzeW0oJ1RBU0snKTtcbnZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xudmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG52YXIgQ0FOQ0VMID0gLyojX19QVVJFX18qL2V4cG9ydHMuQ0FOQ0VMID0gc3ltKCdDQU5DRUxfUFJPTUlTRScpO1xudmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG52YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcbnZhciBrb25zdCA9IGV4cG9ydHMua29uc3QgPSBmdW5jdGlvbiBrb25zdCh2KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xudmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcbnZhciBrRmFsc2UgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rRmFsc2UgPSBrb25zdChmYWxzZSk7XG52YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcbnZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG4gIHJldHVybiB2O1xufTtcblxuZnVuY3Rpb24gY2hlY2sodmFsdWUsIHByZWRpY2F0ZSwgZXJyb3IpIHtcbiAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gaXMubm90VW5kZWYob2JqZWN0KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG52YXIgaXMgPSBleHBvcnRzLmlzID0ge1xuICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcbiAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG4gIH0sXG4gIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG4gIH0sXG4gIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuICB9LFxuICBhcnJheTogQXJyYXkuaXNBcnJheSxcbiAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiAhaXMuYXJyYXkob2JqKSAmJiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKSkgPT09ICdvYmplY3QnO1xuICB9LFxuICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcbiAgICByZXR1cm4gcCAmJiBpcy5mdW5jKHAudGhlbik7XG4gIH0sXG4gIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKGl0Lm5leHQpICYmIGlzLmZ1bmMoaXQudGhyb3cpO1xuICB9LFxuICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhTeW1ib2wpID8gaXMuZnVuYyhpdFtTeW1ib2wuaXRlcmF0b3JdKSA6IGlzLmFycmF5KGl0KTtcbiAgfSxcbiAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG4gICAgcmV0dXJuIHQgJiYgdFtUQVNLXTtcbiAgfSxcbiAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuICAgIHJldHVybiBvYiAmJiBpcy5mdW5jKG9iLnN1YnNjcmliZSk7XG4gIH0sXG4gIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuICAgIHJldHVybiBidWYgJiYgaXMuZnVuYyhidWYuaXNFbXB0eSkgJiYgaXMuZnVuYyhidWYudGFrZSkgJiYgaXMuZnVuYyhidWYucHV0KTtcbiAgfSxcbiAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcbiAgICByZXR1cm4gcGF0ICYmIChpcy5zdHJpbmcocGF0KSB8fCAodHlwZW9mIHBhdCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0KSkgPT09ICdzeW1ib2wnIHx8IGlzLmZ1bmMocGF0KSB8fCBpcy5hcnJheShwYXQpKTtcbiAgfSxcbiAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaCAmJiBpcy5mdW5jKGNoLnRha2UpICYmIGlzLmZ1bmMoY2guY2xvc2UpO1xuICB9LFxuICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpdFtIRUxQRVJdO1xuICB9LFxuICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuICAgIHJldHVybiBpcy5mdW5jKGYpICYmIGhhc093bihmLCAndG9TdHJpbmcnKTtcbiAgfVxufTtcblxudmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufVxuXG52YXIgYXJyYXkgPSBleHBvcnRzLmFycmF5ID0ge1xuICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG4gICAgICAgIGFycltpXSA9IG9ialtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG4gIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIGRlZiA9IF9leHRlbmRzKHt9LCBwcm9wcyk7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBkZWYucmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbiAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBhcnJheU9mRGVmZmVyZWQobGVuZ3RoKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGRlZmVycmVkKCkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gIHZhciB2YWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cbiAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcbiAgICB9LCBtcyk7XG4gIH0pO1xuXG4gIHByb21pc2VbQ0FOQ0VMXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gIH07XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuICB2YXIgX3JlZjtcblxuICB2YXIgcnVubmluZyA9IHRydWU7XG4gIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgX2Vycm9yID0gdm9pZCAwO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICByZXR1cm4gcnVubmluZztcbiAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG4gICAgcmV0dXJuIF9yZXN1bHQ7XG4gIH0sIF9yZWYuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICByZXR1cm4gX2Vycm9yO1xuICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcbiAgICByZXR1cm4gcnVubmluZyA9IGI7XG4gIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcbiAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG4gIH0sIF9yZWYuc2V0RXJyb3IgPSBmdW5jdGlvbiBzZXRFcnJvcihlKSB7XG4gICAgcmV0dXJuIF9lcnJvciA9IGU7XG4gIH0sIF9yZWY7XG59XG5cbmZ1bmN0aW9uIGF1dG9JbmMoKSB7XG4gIHZhciBzZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICsrc2VlZDtcbiAgfTtcbn1cblxudmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblxudmFyIGtUaHJvdyA9IGZ1bmN0aW9uIGtUaHJvdyhlcnIpIHtcbiAgdGhyb3cgZXJyO1xufTtcbnZhciBrUmV0dXJuID0gZnVuY3Rpb24ga1JldHVybih2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcbn07XG5mdW5jdGlvbiBtYWtlSXRlcmF0b3IobmV4dCkge1xuICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gIHZhciBpc0hlbHBlciA9IGFyZ3VtZW50c1szXTtcblxuICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblxuICBpZiAoaXNIZWxwZXIpIHtcbiAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG4vKipcbiAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG4gICh0ZXh0LW9ubHkgbG9nIG91dHB1dClcbiAqKi9cbmZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlW2xldmVsXShtZXNzYWdlLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGxvZygnd2FybicsIGRlcHJlY2F0aW9uV2FybmluZyk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuICByZXR1cm4gZGVwcmVjYXRlZCArICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgcHJlZmVycmVkICsgJywgcGxlYXNlIHVwZGF0ZSB5b3VyIGNvZGUnO1xufTtcblxudmFyIGludGVybmFsRXJyID0gZXhwb3J0cy5pbnRlcm5hbEVyciA9IGZ1bmN0aW9uIGludGVybmFsRXJyKGVycikge1xuICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xufTtcblxudmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcbiAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcbn07XG5cbnZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG4gIH07XG59O1xuXG52YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBoaXN0b3J5ID0gW107XG4gICAgdmFyIGdlbiA9IGdlbmVyYXRvckZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcbiAgICAgICAgaGlzdG9yeS5wdXNoKGFyZyk7XG4gICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuICAgICAgfSxcbiAgICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHJldHVybiBjbG9uZWRHZW4ubmV4dChhcmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcbiAgICAgIH0sXG4gICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9idWZmZXJzJyk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhvYmosIGRlc2NzKSB7IGZvciAodmFyIGtleSBpbiBkZXNjcykgeyB2YXIgZGVzYyA9IGRlc2NzW2tleV07IGRlc2MuY29uZmlndXJhYmxlID0gZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBkZXNjKTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cbnZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG4gIH1cbn07XG52YXIgVEFTS19DQU5DRUwgPSBleHBvcnRzLlRBU0tfQ0FOQ0VMID0ge1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuICB9XG59O1xuXG52YXIgbWF0Y2hlcnMgPSB7XG4gIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuICB9LFxuICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IHBhdHRlcm47XG4gICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcbiAgICB9O1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICBwcmVkaWNhdGU6IGZ1bmN0aW9uIHByZWRpY2F0ZShfcHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgcmV0dXJuIChwYXR0ZXJuID09PSAnKicgPyBtYXRjaGVycy53aWxkY2FyZCA6IF91dGlscy5pcy5hcnJheShwYXR0ZXJuKSA/IG1hdGNoZXJzLmFycmF5IDogX3V0aWxzLmlzLnN0cmluZ2FibGVGdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMuZGVmYXVsdCA6IF91dGlscy5pcy5mdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMucHJlZGljYXRlIDogbWF0Y2hlcnMuZGVmYXVsdCkocGF0dGVybik7XG59XG5cbi8qKlxuICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcbiAgV2UgbW9kZWwgdGhpcyB1c2luZyB0aGUgY29uY2VwdCBvZiBQYXJlbnQgdGFzayAmJiBtYWluIFRhc2tcbiAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuICBUaHVzIHRoZSB3aG9sZSBtb2RlbCByZXByZXNlbnRzIGFuIGV4ZWN1dGlvbiB0cmVlIHdpdGggbXVsdGlwbGUgYnJhbmNoZXMgKHZzIHRoZVxuICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblxuICBBIHBhcmVudCB0YXNrcyBoYXMgdGhlIGZvbGxvd2luZyBzZW1hbnRpY3NcbiAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG4gIC0gSXQgYWJvcnRzIGlmIGFueSB1bmNhdWdodCBlcnJvciBidWJibGVzIHVwIGZyb20gZm9ya3NcbiAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG4qKi9cbmZ1bmN0aW9uIGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgY2IpIHtcbiAgdmFyIHRhc2tzID0gW10sXG4gICAgICByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgYWRkVGFzayhtYWluVGFzayk7XG5cbiAgZnVuY3Rpb24gYWJvcnQoZXJyKSB7XG4gICAgY2FuY2VsQWxsKCk7XG4gICAgY2IoZXJyLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuICAgIHRhc2tzLnB1c2godGFzayk7XG4gICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAoMCwgX3V0aWxzLnJlbW92ZSkodGFza3MsIHRhc2spO1xuICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgYWJvcnQocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuICAgICAgICAgIHJlc3VsdCA9IHJlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG4gICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuICAgICAgdC5jYW5jZWwoKTtcbiAgICB9KTtcbiAgICB0YXNrcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRUYXNrOiBhZGRUYXNrLFxuICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuICAgIGFib3J0OiBhYm9ydCxcbiAgICBnZXRUYXNrczogZnVuY3Rpb24gZ2V0VGFza3MoKSB7XG4gICAgICByZXR1cm4gdGFza3M7XG4gICAgfSxcbiAgICB0YXNrTmFtZXM6IGZ1bmN0aW9uIHRhc2tOYW1lcygpIHtcbiAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQubmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcbiAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBmbiA9IF9yZWYuZm4sXG4gICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG4gIHZhciByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBlcnJvciA9IHZvaWQgMDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IgPSBlcnI7XG4gIH1cblxuICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3JcbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG4gIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG4gIHJldHVybiBlcnJvciA/ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGMgPSB2b2lkIDA7XG4gICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcbiAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICBpZiAoIXBjKSB7XG4gICAgICAgIHBjID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXQoYXJnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KCkpO1xufVxuXG52YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG4gIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcbn07XG5cbmZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcbiAgdmFyIHN1YnNjcmliZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfTtcbiAgdmFyIGRpc3BhdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBfdXRpbHMubm9vcDtcbiAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcbiAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDoge307XG4gIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuICB2YXIgY29udCA9IGFyZ3VtZW50c1s4XTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXG4gIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG4gIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cbiAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblxuICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG4gIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKGVycikge1xuICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblxuICAgIGlmICghbWVzc2FnZSAmJiBlcnIuc3RhY2spIHtcbiAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuICB9O1xuICB2YXIgc3RkQ2hhbm5lbCA9ICgwLCBfY2hhbm5lbC5zdGRDaGFubmVsKShzdWJzY3JpYmUpO1xuICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuICAvKipcbiAgICBUcmFja3MgdGhlIGN1cnJlbnQgZWZmZWN0IGNhbmNlbGxhdGlvblxuICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG4gICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuICAqKi9cbiAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAvKipcbiAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG4gICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG4gICoqL1xuICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcbiAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuICB2YXIgdGFza1F1ZXVlID0gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBlbmQpO1xuXG4gIC8qKlxuICAgIGNhbmNlbGxhdGlvbiBvZiB0aGUgbWFpbiB0YXNrLiBXZSdsbCBzaW1wbHkgcmVzdW1lIHRoZSBHZW5lcmF0b3Igd2l0aCBhIENhbmNlbFxuICAqKi9cbiAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcbiAgICBpZiAobWFpblRhc2suaXNSdW5uaW5nICYmICFtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cbiAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgQ2FuY2VsbGF0aW9uIHByb3BhZ2F0ZXMgZG93biB0byB0aGUgd2hvbGUgZXhlY3V0aW9uIHRyZWUgaG9sZGVkIGJ5IHRoaXMgUGFyZW50IHRhc2tcbiAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcbiAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgLyoqXG4gICAgICBXZSBuZWVkIHRvIGNoZWNrIGJvdGggUnVubmluZyBhbmQgQ2FuY2VsbGVkIHN0YXR1c1xuICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuICAgICoqL1xuICAgIGlmIChpdGVyYXRvci5faXNSdW5uaW5nICYmICFpdGVyYXRvci5faXNDYW5jZWxsZWQpIHtcbiAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG4gICAgICAvKipcbiAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuICAgICAgKiovXG4gICAgICBlbmQoVEFTS19DQU5DRUwpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG4gICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cbiAgKiovXG4gIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblxuICAvLyB0cmFja3MgdGhlIHJ1bm5pbmcgc3RhdHVzXG4gIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXG4gIC8vIGtpY2tzIHVwIHRoZSBnZW5lcmF0b3JcbiAgbmV4dCgpO1xuXG4gIC8vIHRoZW4gcmV0dXJuIHRoZSB0YXNrIGRlc2NyaXB0b3IgdG8gdGhlIGNhbGxlclxuICByZXR1cm4gdGFzaztcblxuICAvKipcbiAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG4gICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG4gICAgdW50aWwgdGhlIGdlbmVyYXRvciB0ZXJtaW5hdGVzIG9yIHRocm93c1xuICAqKi9cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG4gICAgLy8gUHJldmVudGl2ZSBtZWFzdXJlLiBJZiB3ZSBlbmQgdXAgaGVyZSwgdGhlbiB0aGVyZSBpcyByZWFsbHkgc29tZXRoaW5nIHdyb25nXG4gICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuICAgICAgICAgIFdlIGNhbiBnZXQgdGhpcyB2YWx1ZSBoZXJlXG4gICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcbiAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICBDYW5jZWxzIHRoZSBjdXJyZW50IGVmZmVjdDsgdGhpcyB3aWxsIHByb3BhZ2F0ZSB0aGUgY2FuY2VsbGF0aW9uIGRvd24gdG8gYW55IGNhbGxlZCB0YXNrc1xuICAgICAgICAqKi9cbiAgICAgICAgbmV4dC5jYW5jZWwoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICoqL1xuICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcbiAgICAgICAgLy8gV2UgZ2V0IENIQU5ORUxfRU5EIGJ5IHRha2luZyBmcm9tIGEgY2hhbm5lbCB0aGF0IGVuZGVkIHVzaW5nIGB0YWtlYCAoYW5kIG5vdCBgdGFrZW1gIHVzZWQgdG8gdHJhcCBFbmQgb2YgY2hhbm5lbHMpXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dChhcmcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcbiAgICAgICAgKiovXG4gICAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG4gICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmQocmVzdWx0LCBpc0Vycikge1xuICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG4gICAgaWYgKCFpc0Vycikge1xuICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcbiAgICAgICAgICB2YWx1ZTogJ2F0ICcgKyBuYW1lICsgJyBcXG4gJyArIChyZXN1bHQuc2FnYVN0YWNrIHx8IHJlc3VsdC5zdGFjayksXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2lzQWJvcnRlZCA9IHRydWU7XG4gICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuICAgIH1cbiAgICB0YXNrLmNvbnQgJiYgdGFzay5jb250KHJlc3VsdCwgaXNFcnIpO1xuICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcbiAgICB9KTtcbiAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcbiAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuICAgIHZhciBjYiA9IGFyZ3VtZW50c1szXTtcblxuICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcGFyZW50RWZmZWN0SWQ6IHBhcmVudEVmZmVjdElkLCBsYWJlbDogbGFiZWwsIGVmZmVjdDogZWZmZWN0IH0pO1xuXG4gICAgLyoqXG4gICAgICBjb21wbGV0aW9uIGNhbGxiYWNrIGFuZCBjYW5jZWwgY2FsbGJhY2sgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG4gICAgKiovXG4gICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cbiAgICAvLyBDb21wbGV0aW9uIGNhbGxiYWNrIHBhc3NlZCB0byB0aGUgYXBwcm9wcmlhdGUgZWZmZWN0IHJ1bm5lclxuICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG4gICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG4gICAgICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAgICAgaXNFcnIgPyBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZChlZmZlY3RJZCwgcmVzKSA6IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCByZXMpO1xuICAgICAgfVxuICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgfVxuICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcHJldmVudHMgY2FuY2VsbGluZyBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3RcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICAvKipcbiAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcbiAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuICAgICAgICBjYWxsYmFjaywgbG9nIGVycm9ycyByYWlzZWQgZHVyaW5nIGNhbmNlbGxhdGlvbnMgaW50byB0aGUgY29uc29sZVxuICAgICAgKiovXG4gICAgICB0cnkge1xuICAgICAgICBjdXJyQ2IuY2FuY2VsKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblxuICAgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkKGVmZmVjdElkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cbiAgICAgICBBVFRFTlRJT04hIGVmZmVjdCBydW5uZXJzIG11c3Qgc2V0dXAgdGhlIGNhbmNlbCBsb2dpYyBieSBzZXR0aW5nIGNiLmNhbmNlbCA9IFtjYW5jZWxNZXRob2RdXG4gICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG4gICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG4gICAgICBmb3IgY29tcGxldGluZyB0aGUgZmxvdyBieSBjYWxsaW5nIHRoZSBwcm92aWRlZCBjb250aW51YXRpb247IHdoaWxlIGNhbGxlciBmdW5jdGlvbnNcbiAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cbiAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG4gICAgICBwcm9taXNlW0NBTkNFTF0gbWV0aG9kIGluIHRoZWlyIHJldHVybmVkIHByb21pc2VzXG4gICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuICAgICoqL1xuICAgIHZhciBkYXRhID0gdm9pZCAwO1xuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiAoXG4gICAgICAvLyBOb24gZGVjbGFyYXRpdmUgZWZmZWN0XG4gICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXG4gICAgICAvLyBkZWNsYXJhdGl2ZSBlZmZlY3RzXG4gICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuICAgIHZhciBjYW5jZWxQcm9taXNlID0gcHJvbWlzZVtfdXRpbHMuQ0FOQ0VMXTtcbiAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcbiAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG4gICAgfSBlbHNlIGlmIChfdXRpbHMuaXMuZnVuYyhwcm9taXNlLmFib3J0KSkge1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cbiAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuICAgIH1cbiAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJdGVyYXRvcihpdGVyYXRvciwgZWZmZWN0SWQsIG5hbWUsIGNiKSB7XG4gICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG4gICAgICAgIHBhdHRlcm4gPSBfcmVmMi5wYXR0ZXJuLFxuICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXG4gICAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgc3RkQ2hhbm5lbDtcbiAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG4gICAgfVxuICAgIGNiLmNhbmNlbCA9IHRha2VDYi5jYW5jZWw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5QdXRFZmZlY3QoX3JlZjMsIGNiKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlO1xuXG4gICAgLyoqXG4gICAgICBTY2hlZHVsZSB0aGUgcHV0IGluIGNhc2UgYW5vdGhlciBzYWdhIGlzIGhvbGRpbmcgYSBsb2NrLlxuICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG4gICAgKiovXG4gICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBjaGFubmVsIG9yIGBwdXQucmVzb2x2ZWAgd2FzIHVzZWQgdGhlbiBidWJibGUgdXAgdGhlIGVycm9yLlxuICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNC5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY0LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblxuICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY1LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjUuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXG4gICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG4gICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgdmFyIGNwc0NiID0gZnVuY3Rpb24gY3BzQ2IoZXJyLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG4gICAgICB9O1xuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoY3BzQ2IpKTtcbiAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcbiAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjcHNDYi5jYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY2LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjYuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuICAgICAgICBkZXRhY2hlZCA9IF9yZWY2LmRldGFjaGVkO1xuXG4gICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblxuICAgIHRyeSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuICAgICAgdmFyIF90YXNrID0gcHJvYyh0YXNrSXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIGZuLm5hbWUsIGRldGFjaGVkID8gbnVsbCA6IF91dGlscy5ub29wKTtcblxuICAgICAgaWYgKGRldGFjaGVkKSB7XG4gICAgICAgIGNiKF90YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hZGRUYXNrKF90YXNrKTtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hYm9ydCh0YXNrSXRlcmF0b3IuX2Vycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgKDAsIF9zY2hlZHVsZXIuZmx1c2gpKCk7XG4gICAgfVxuICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuICAgIGlmICh0LmlzUnVubmluZygpKSB7XG4gICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0LmpvaW5lcnMsIGpvaW5lcik7XG4gICAgICB9O1xuICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuICAgIGlmICh0YXNrVG9DYW5jZWwgPT09IF91dGlscy5TRUxGX0NBTkNFTExBVElPTikge1xuICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcbiAgICB9XG4gICAgaWYgKHRhc2tUb0NhbmNlbC5pc1J1bm5pbmcoKSkge1xuICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuICAgIH1cbiAgICBjYigpO1xuICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblxuICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgaXNFcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcbiAgICAgICAgICBjb21wbGV0ZWRDb3VudCsrO1xuICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG4gICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuICAgIH0pO1xuXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Vycikge1xuICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjYihyZXMsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgdmFyIF9yZXNwb25zZTtcblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gKF9yZXNwb25zZSA9IHt9LCBfcmVzcG9uc2Vba2V5XSA9IHJlcywgX3Jlc3BvbnNlKTtcbiAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyB1bm5lY2Vzc2FyeSBjYW5jZWxsYXRpb25cbiAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG4gICAgICAgIGFyZ3MgPSBfcmVmNy5hcmdzO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdGF0ZSA9IHNlbGVjdG9yLmFwcGx5KHVuZGVmaW5lZCwgW2dldFN0YXRlKCldLmNvbmNhdChhcmdzKSk7XG4gICAgICBjYihzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcbiAgICAgICAgYnVmZmVyID0gX3JlZjguYnVmZmVyO1xuXG4gICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcbiAgICBtYXRjaC5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcbiAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG4gICAgY2hhbm5lbC5mbHVzaChjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5HZXRDb250ZXh0RWZmZWN0KHByb3AsIGNiKSB7XG4gICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcbiAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIGNiKCk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdUYXNrKGlkLCBuYW1lLCBpdGVyYXRvciwgY29udCkge1xuICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXG4gICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gbnVsbDtcbiAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuICAgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBkZWY7XG4gICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9LCBfcmVmOS5jb250ID0gY29udCwgX3JlZjkuam9pbmVycyA9IFtdLCBfcmVmOS5jYW5jZWwgPSBjYW5jZWwsIF9yZWY5LmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQ2FuY2VsbGVkO1xuICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuICAgIH0sIF9yZWY5LnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2Vycm9yO1xuICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG4gICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuICAgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcbiAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcHJvYy5qc1xuLy8gbW9kdWxlIGlkID0gNzQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc2FwID0gYXNhcDtcbmV4cG9ydHMuc3VzcGVuZCA9IHN1c3BlbmQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG52YXIgcXVldWUgPSBbXTtcbi8qKlxuICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG4gIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3RcbiAgICBhbHJlYWR5IHN1c3BlbmRlZClcbiAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcbiAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuKiovXG52YXIgc2VtYXBob3JlID0gMDtcblxuLyoqXG4gIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcbiAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG4gIHN0YXRlKS5cbioqL1xuZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG4gIHRyeSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIHRhc2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gIEV4ZWN1dGVzIG9yIHF1ZXVlcyBhIHRhc2sgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiB0aGUgc2NoZWR1bGVyIChgc3VzcGVuZGVkYCBvciBgcmVsZWFzZWRgKVxuKiovXG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgcXVldWUucHVzaCh0YXNrKTtcblxuICBpZiAoIXNlbWFwaG9yZSkge1xuICAgIHN1c3BlbmQoKTtcbiAgICBmbHVzaCgpO1xuICB9XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZS4gU2NoZWR1bGVkIHRhc2tzIHdpbGwgYmUgcXVldWVkIHVudGlsIHRoZVxuICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG4qKi9cbmZ1bmN0aW9uIHN1c3BlbmQoKSB7XG4gIHNlbWFwaG9yZSsrO1xufVxuXG4vKipcbiAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cbioqL1xuZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgc2VtYXBob3JlLS07XG59XG5cbi8qKlxuICBSZWxlYXNlcyB0aGUgY3VycmVudCBsb2NrLiBFeGVjdXRlcyBhbGwgcXVldWVkIHRhc2tzIGlmIHRoZSBzY2hlZHVsZXIgaXMgaW4gdGhlIHJlbGVhc2VkIHN0YXRlLlxuKiovXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgcmVsZWFzZSgpO1xuXG4gIHZhciB0YXNrID0gdm9pZCAwO1xuICB3aGlsZSAoIXNlbWFwaG9yZSAmJiAodGFzayA9IHF1ZXVlLnNoaWZ0KCkpICE9PSB1bmRlZmluZWQpIHtcbiAgICBleGVjKHRhc2spO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NjaGVkdWxlci5qc1xuLy8gbW9kdWxlIGlkID0gNzQ2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5leHBvcnRzLnRha2UgPSB0YWtlO1xuZXhwb3J0cy5wdXQgPSBwdXQ7XG5leHBvcnRzLmFsbCA9IGFsbDtcbmV4cG9ydHMucmFjZSA9IHJhY2U7XG5leHBvcnRzLmNhbGwgPSBjYWxsO1xuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuZXhwb3J0cy5jcHMgPSBjcHM7XG5leHBvcnRzLmZvcmsgPSBmb3JrO1xuZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuZXhwb3J0cy5qb2luID0gam9pbjtcbmV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5leHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuZXhwb3J0cy5jYW5jZWxsZWQgPSBjYW5jZWxsZWQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG5leHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuZXhwb3J0cy5zZXRDb250ZXh0ID0gc2V0Q29udGV4dDtcbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zYWdhSGVscGVycycpO1xuXG52YXIgSU8gPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5zeW0pKCdJTycpO1xudmFyIFRBS0UgPSAnVEFLRSc7XG52YXIgUFVUID0gJ1BVVCc7XG52YXIgQUxMID0gJ0FMTCc7XG52YXIgUkFDRSA9ICdSQUNFJztcbnZhciBDQUxMID0gJ0NBTEwnO1xudmFyIENQUyA9ICdDUFMnO1xudmFyIEZPUksgPSAnRk9SSyc7XG52YXIgSk9JTiA9ICdKT0lOJztcbnZhciBDQU5DRUwgPSAnQ0FOQ0VMJztcbnZhciBTRUxFQ1QgPSAnU0VMRUNUJztcbnZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG52YXIgQ0FOQ0VMTEVEID0gJ0NBTkNFTExFRCc7XG52YXIgRkxVU0ggPSAnRkxVU0gnO1xudmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcbnZhciBTRVRfQ09OVEVYVCA9ICdTRVRfQ09OVEVYVCc7XG5cbnZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cbnZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xufTtcblxudmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG4gIGVmZltGT1JLXS5kZXRhY2hlZCA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5mdW5jdGlvbiB0YWtlKCkge1xuICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICB9XG4gIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG59XG5cbnRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbnZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cbmZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCBhIHZhbGlkIGNoYW5uZWwnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgICBhY3Rpb24gPSBjaGFubmVsO1xuICAgIGNoYW5uZWwgPSBudWxsO1xuICB9XG4gIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xufVxuXG5wdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIGVmZltQVVRdLnJlc29sdmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxucHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblxuZnVuY3Rpb24gYWxsKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuICBpZiAoX3V0aWxzLmlzLmFycmF5KGZuKSkge1xuICAgIHZhciBfZm4gPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuWzBdO1xuICAgIGZuID0gX2ZuWzFdO1xuICB9IGVsc2UgaWYgKGZuLmZuKSB7XG4gICAgdmFyIF9mbjIgPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuMi5jb250ZXh0O1xuICAgIGZuID0gX2ZuMi5mbjtcbiAgfVxuICBpZiAoY29udGV4dCAmJiBfdXRpbHMuaXMuc3RyaW5nKGZuKSAmJiBfdXRpbHMuaXMuZnVuYyhjb250ZXh0W2ZuXSkpIHtcbiAgICBmbiA9IGNvbnRleHRbZm5dO1xuICB9XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblxuICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcbn1cblxuZnVuY3Rpb24gY2FsbChmbikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBjcHMoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gZm9yayhmbikge1xuICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHNwYXduKGZuKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcbn1cblxuZnVuY3Rpb24gam9pbigpIHtcbiAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgdGFza3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgfVxuXG4gIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBqb2luKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdqb2luKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcbiAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGNhbmNlbCh0KTtcbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRhc2sgPSB0YXNrc1swXTtcbiAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNyA+IDEgPyBfbGVuNyAtIDEgOiAwKSwgX2tleTcgPSAxOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG59XG5cbi8qKlxuICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcbioqL1xuZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG59XG5cbmZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdmbHVzaChjaGFubmVsKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsJyk7XG4gIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIGVmZmVjdChHRVRfQ09OVEVYVCwgcHJvcCk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG4gIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcbn1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDIgPyBfbGVuOCAtIDIgOiAwKSwgX2tleTggPSAyOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuICAgIGFyZ3NbX2tleTkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5OV07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUxhdGVzdEhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShtcywgcGF0dGVybiwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG52YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuICB9O1xufTtcblxudmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcbiAgdGFrZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShUQUtFKSxcbiAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG4gIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuICByYWNlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFJBQ0UpLFxuICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcbiAgZm9yazogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGT1JLKSxcbiAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcbiAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG4gIHNlbGVjdDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRUxFQ1QpLFxuICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcbiAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG4gIGZsdXNoOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZMVVNIKSxcbiAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG4gIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9pby5qc1xuLy8gbW9kdWxlIGlkID0gNzQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IHVuZGVmaW5lZDtcblxudmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90YWtlRXZlcnknKTtcblxudmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cbnZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VMYXRlc3QnKTtcblxudmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblxudmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcbiAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG59O1xuXG52YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG52YXIgdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VMYXRlc3QyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VMYXRlc3QnKSk7XG52YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcbmV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gX3Rha2VFdmVyeTIuZGVmYXVsdDtcbmV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG4gICAgfVxuICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qc1xuLy8gbW9kdWxlIGlkID0gNzQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucUVuZCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG52YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXG5mdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiAnY2hhbm5lbCc7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGVudHJ5KTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXG4gIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcbiAgICAgIHFOZXh0ID0gcTA7XG5cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG4gICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG4gICAgICByZXR1cm4gZG9uZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHFOZXh0ID0gcUVuZDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXG4gICAgICB2YXIgX2ZzbSRxTmV4dCA9IGZzbVtxTmV4dF0oKSxcbiAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcbiAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuICAgICAgICAgIF91cGRhdGVTdGF0ZSA9IF9mc20kcU5leHRbMl07XG5cbiAgICAgIHFOZXh0ID0gcTtcbiAgICAgIHVwZGF0ZVN0YXRlID0gX3VwZGF0ZVN0YXRlO1xuICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBuZXh0KG51bGwsIGVycm9yKTtcbiAgfSwgbmFtZSwgdHJ1ZSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5pc0VuZCA9IGV4cG9ydHMuRU5EID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcbmV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXZlbnRDaGFubmVsO1xuZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxudmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIENIQU5ORUxfRU5EX1RZUEUgPSAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbnZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xudmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcbiAgcmV0dXJuIGEgJiYgYS50eXBlID09PSBDSEFOTkVMX0VORF9UWVBFO1xufTtcblxuZnVuY3Rpb24gZW1pdHRlcigpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKHN1Yikge1xuICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKShzdWJzY3JpYmVycywgc3ViKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG4gICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJyW2ldKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgZW1pdDogZW1pdFxuICB9O1xufVxuXG52YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xudmFyIFVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gJ1NhZ2Egd2FzIHByb3ZpZGVkIHdpdGggYW4gdW5kZWZpbmVkIGFjdGlvbic7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gVU5ERUZJTkVEX0lOUFVUX0VSUk9SICs9ICdcXG5IaW50czpcXG4gICAgLSBjaGVjayB0aGF0IHlvdXIgQWN0aW9uIENyZWF0b3IgcmV0dXJucyBhIG5vbi11bmRlZmluZWQgdmFsdWVcXG4gICAgLSBpZiB0aGUgU2FnYSB3YXMgc3RhcnRlZCB1c2luZyBydW5TYWdhLCBjaGVjayB0aGF0IHlvdXIgc3Vic2NyaWJlIHNvdXJjZSBwcm92aWRlcyB0aGUgYWN0aW9uIHRvIGl0cyBsaXN0ZW5lcnNcXG4gICc7XG59XG5cbmZ1bmN0aW9uIGNoYW5uZWwoKSB7XG4gIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblxuICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gIHZhciB0YWtlcnMgPSBbXTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsIElOVkFMSURfQlVGRkVSKTtcblxuICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcbiAgICBpZiAoY2xvc2VkICYmIHRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcbiAgICB9XG4gICAgaWYgKHRha2Vycy5sZW5ndGggJiYgIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBidWZmZXIucHV0KGlucHV0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjYiA9IHRha2Vyc1tpXTtcbiAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRha2UoY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoYnVmZmVyLnRha2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRha2Vycy5wdXNoKGNiKTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihFTkQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYihidWZmZXIuZmx1c2goKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgIGlmICghY2xvc2VkKSB7XG4gICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IHRha2VycztcbiAgICAgICAgdGFrZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBhcnJbaV0oRU5EKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFrZTogdGFrZSxcbiAgICBwdXQ6IHB1dCxcbiAgICBmbHVzaDogZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGdldCBfX3Rha2Vyc19fKCkge1xuICAgICAgcmV0dXJuIHRha2VycztcbiAgICB9LFxuICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuICAgICAgcmV0dXJuIGNsb3NlZDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX2J1ZmZlcnMuYnVmZmVycy5ub25lKCk7XG4gIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXG4gIC8qKlxuICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuICAqKi9cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcbiAgfVxuXG4gIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBjaGFuLmNsb3NlKCk7XG4gICAgfVxuICB9O1xuICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlzRW5kKGlucHV0KSkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW4ucHV0KGlucHV0KTtcbiAgfSk7XG4gIGlmIChjaGFuLl9fY2xvc2VkX18pIHtcbiAgICB1bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiBjaGFuLnRha2UsXG4gICAgZmx1c2g6IGNoYW4uZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0ZENoYW5uZWwoc3Vic2NyaWJlKSB7XG4gIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoaW5wdXRbX3V0aWxzLlNBR0FfQUNUSU9OXSkge1xuICAgICAgICBjYihpbnB1dCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcbiAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuICAgICAgfVxuICAgICAgY2hhbi50YWtlKGNiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9jaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKFwiLi91dGlsc1wiKTtcblxudmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXG52YXIgT05fT1ZFUkZMT1dfVEhST1cgPSAxO1xudmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xudmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcbnZhciBPTl9PVkVSRkxPV19FWFBBTkQgPSA0O1xuXG52YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXG5mdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuICB2YXIgb3ZlcmZsb3dBY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG4gIHZhciBsZW5ndGggPSAwO1xuICB2YXIgcHVzaEluZGV4ID0gMDtcbiAgdmFyIHBvcEluZGV4ID0gMDtcblxuICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcbiAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgIGxlbmd0aCsrO1xuICB9O1xuXG4gIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcbiAgICBpZiAobGVuZ3RoICE9IDApIHtcbiAgICAgIHZhciBpdCA9IGFycltwb3BJbmRleF07XG4gICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcbiAgICAgIGxlbmd0aC0tO1xuICAgICAgcG9wSW5kZXggPSAocG9wSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtcztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoID09IDA7XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuICAgICAgaWYgKGxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgIHB1c2goaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRvdWJsZWRMaW1pdCA9IHZvaWQgMDtcbiAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX09WRVJGTE9XKTtcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX0VYUEFORDpcbiAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblxuICAgICAgICAgICAgYXJyID0gZmx1c2goKTtcblxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGFyci5sZW5ndGggPSBkb3VibGVkTGltaXQ7XG4gICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblxuICAgICAgICAgICAgcHVzaChpdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIERST1BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGFrZTogdGFrZSxcbiAgICBmbHVzaDogZmx1c2hcbiAgfTtcbn1cblxudmFyIGJ1ZmZlcnMgPSBleHBvcnRzLmJ1ZmZlcnMgPSB7XG4gIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG4gICAgcmV0dXJuIHplcm9CdWZmZXI7XG4gIH0sXG4gIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG4gIH0sXG4gIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcbiAgfSxcbiAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG4gIH0sXG4gIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlTGF0ZXN0O1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG4gIH07XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDAsXG4gICAgICBhY3Rpb24gPSB2b2lkIDA7XG4gIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG4gICAgcmV0dXJuIHRhc2sgPSB0O1xuICB9O1xuICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlTGF0ZXN0KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VMYXRlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vYnVmZmVycycpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRocm90dGxlKGRlbGF5TGVuZ3RoLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgY2hhbm5lbCA9IHZvaWQgMDtcblxuICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG4gIHZhciB5VGFrZSA9IGZ1bmN0aW9uIHlUYWtlKCkge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuICB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5RGVsYXkgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYWxsKShfdXRpbHMuZGVsYXksIGRlbGF5TGVuZ3RoKSB9O1xuXG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG4gIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaGFubmVsID0gY2g7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG4gICAgfSxcbiAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG4gICAgfVxuICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBzYWdhTWlkZGxld2FyZUZhY3Rvcnk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3J1blNhZ2EnKTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgY29udGV4dCA9IF9yZWYkY29udGV4dCA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNvbnRleHQsXG4gICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG5cbiAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBhIGZ1bmN0aW9uIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUuIFlvdSBhcmUgbGlrZWx5IHRyeWluZyB0byBzdGFydCBhICAgICAgICBTYWdhIGJ5IGRpcmVjdGx5IHBhc3NpbmcgaXQgdG8gdGhlIG1pZGRsZXdhcmUuIFRoaXMgaXMgbm8gbG9uZ2VyIHBvc3NpYmxlIHN0YXJ0aW5nIGZyb20gMC4xMC4wLiAgICAgICAgVG8gcnVuIGEgU2FnYSwgeW91IG11c3QgZG8gaXQgZHluYW1pY2FsbHkgQUZURVIgbW91bnRpbmcgdGhlIG1pZGRsZXdhcmUgaW50byB0aGUgc3RvcmUuXFxuICAgICAgICBFeGFtcGxlOlxcbiAgICAgICAgICBpbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcXCdyZWR1eC1zYWdhXFwnXFxuICAgICAgICAgIC4uLiBvdGhlciBpbXBvcnRzXFxuXFxuICAgICAgICAgIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKVxcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpXFxuICAgICAgICAgIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhLCAuLi5hcmdzKVxcbiAgICAgICcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbmVycm9yYCB3YXMgcmVtb3ZlZC4gVXNlIGBvcHRpb25zLm9uRXJyb3JgIGluc3RlYWQuJyk7XG4gIH1cblxuICBpZiAob25FcnJvciAmJiAhX3V0aWxzLmlzLmZ1bmMob25FcnJvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYyLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXG4gICAgdmFyIHNhZ2FFbWl0dGVyID0gKDAsIF9jaGFubmVsLmVtaXR0ZXIpKCk7XG4gICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblxuICAgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IF9ydW5TYWdhLnJ1blNhZ2EuYmluZChudWxsLCB7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG4gICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXI6IGxvZ2dlcixcbiAgICAgIG9uRXJyb3I6IG9uRXJyb3JcbiAgICB9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgaWYgKHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQpIHtcbiAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IG5leHQoYWN0aW9uKTsgLy8gaGl0IHJlZHVjZXJzXG4gICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG4gIH07XG5cbiAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgnc2FnYU1pZGRsZXdhcmUnLCBwcm9wcykpO1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcbiAgfTtcblxuICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL21pZGRsZXdhcmUuanNcbi8vIG1vZHVsZSBpZCA9IDc1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VtO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnB1dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnJhY2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hcHBseTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jcHM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZvcms7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zcGF3bjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uam9pbjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYW5jZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc2VsZWN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZsdXNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3V0aWxzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVEFTSycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5UQVNLO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU0FHQV9BQ1RJT04nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuU0FHQV9BQ1RJT047XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdub29wJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5pcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlZmVycmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlZmVycmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXJyYXlPZkRlZmZlcmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmFycmF5T2ZEZWZmZXJlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZU1vY2tUYXNrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNyZWF0ZU1vY2tUYXNrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2xvbmVhYmxlR2VuZXJhdG9yJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNsb25lYWJsZUdlbmVyYXRvcjtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FzRWZmZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFzRWZmZWN0O1xuICB9XG59KTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvcHJvYycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzU3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHB1bGwgZnJvbSBcImxvZGFzaC9wdWxsXCI7XG5pbXBvcnQgeyBpbkFycmF5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gaW5pdGlhbCBzdGF0ZVxubGV0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBzZWxlY3RBbGw6IHRydWUsXG4gICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICAgIHVzZXJJZDogbnVsbCxcbiAgICBpc19yZXN0cmljdGVkOiBmYWxzZSxcbiAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgIHVzZXJfcHJvamVjdHM6IFtdLFxuICAgIG9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgb3JpZ2luYWxfdXNlcl9wcm9qZWN0czogbnVsbFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuICAgIGNvbnN0IHJlZHVjZXJBY3Rpb25zID0ge1xuICAgICAgICBbYy5TRVRfU1RPUkVdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIC4uLmRhdGEgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuQVBJX0dFVF9JTklUXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBmZXRjaGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuQVBJX0dFVF9TVUNDRVNTXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWxsX3Byb2plY3RzLCB1c2VyX3Byb2plY3RzIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFsbF9wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgVXNlclByb2plY3RzIGRhdGFcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiAodXNlcl9wcm9qZWN0cyAmJiB1c2VyX3Byb2plY3RzLnByb2plY3RzKSB8fCBbXSxcbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiAodXNlcl9wcm9qZWN0cyAmJiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQpIHx8IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBbYy5BUElfR0VUX0ZBSUxVUkVdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWxsX3Byb2plY3RzOiBbXSxcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiBbXSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBbYy5BUElfUFVUX0lOSVRdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgW2MuQVBJX1BVVF9TVUNDRVNTXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlcl9wcm9qZWN0cyB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSdyZSBcInVud3JhcHBpbmdcIiB0aGUgbGlzdCBvZiBwcm9qZWN0cyBoZXJlLCB0byBzaW1wbGlmeSB0aGUgc3RvcmVcbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiB1c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB1c2VyX3Byb2plY3RzLnByb2plY3RzLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX3VzZXJfcHJvamVjdHM6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIFtjLkFQSV9QVVRfRkFJTFVSRV06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzOiBudWxsLFxuICAgICAgICAgICAgICAgIGVycm9yOiBhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBPdmVyd3JpdGUgaWYgd2UgaGF2ZSBhbiBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsX2lzX3Jlc3RyaWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0ZS5pc19yZXN0cmljdGVkID0gc3RhdGUub3JpZ2luYWxfaXNfcmVzdHJpY3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbF91c2VyX3Byb2plY3RzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGUudXNlcl9wcm9qZWN0cyA9IHN0YXRlLm9yaWdpbmFsX3VzZXJfcHJvamVjdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIFtjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTl06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHByb2plY3RJZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbF91c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG4gICAgICAgICAgICBjb25zdCB1c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG5cbiAgICAgICAgICAgIGluQXJyYXkocHJvamVjdElkLCB1c2VyX3Byb2plY3RzKVxuICAgICAgICAgICAgICAgID8gcHVsbCh1c2VyX3Byb2plY3RzLCBwcm9qZWN0SWQpXG4gICAgICAgICAgICAgICAgOiB1c2VyX3Byb2plY3RzLnB1c2gocHJvamVjdElkKTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBvcmlnaW5hbF91c2VyX3Byb2plY3RzLCB1c2VyX3Byb2plY3RzIH07XG4gICAgICAgIH0sXG4gICAgICAgIFtjLlVQREFURV9JU19SRVNUUklDVEVEXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNfcmVzdHJpY3RlZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaXNfcmVzdHJpY3RlZCwgb3JpZ2luYWxfaXNfcmVzdHJpY3RlZDogc3RhdGUuaXNfcmVzdHJpY3RlZCB9O1xuICAgICAgICB9LFxuICAgICAgICBbYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbF91c2VyX3Byb2plY3RzID0gc3RhdGUudXNlcl9wcm9qZWN0cyAmJiBbLi4uc3RhdGUudXNlcl9wcm9qZWN0c107XG4gICAgICAgICAgICBsZXQgdXNlcl9wcm9qZWN0cyxcbiAgICAgICAgICAgICAgICB7IHNlbGVjdEFsbCB9ID0geyAuLi5zdGF0ZSB9O1xuICAgICAgICAgICAgaWYgKHNlbGVjdEFsbCkge1xuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBzdGF0ZS5hbGxfcHJvamVjdHMubWFwKHByb2plY3QgPT4gcHJvamVjdC5pZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdEFsbCA9ICFzZWxlY3RBbGw7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF91c2VyX3Byb2plY3RzLFxuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmIChyZWR1Y2VyQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24udHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlZHVjZXJBY3Rpb25zW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvcmVkdWNlci5qcyIsInZhciBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgcHVsbEFsbCA9IHJlcXVpcmUoJy4vcHVsbEFsbCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGdpdmVuIHZhbHVlcyBmcm9tIGBhcnJheWAgdXNpbmdcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy53aXRob3V0YCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLiBVc2UgYF8ucmVtb3ZlYFxuICogdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gYW4gYXJyYXkgYnkgcHJlZGljYXRlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuICpcbiAqIF8ucHVsbChhcnJheSwgJ2EnLCAnYycpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydiJywgJ2InXVxuICovXG52YXIgcHVsbCA9IGJhc2VSZXN0KHB1bGxBbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1bGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL3B1bGwuanNcbi8vIG1vZHVsZSBpZCA9IDc1OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlUmVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzYwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19vdmVyUmVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2FwcGx5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VTZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VTZXRUb1N0cmluZycpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZVNldFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL2NvbnN0YW50LmpzXG4vLyBtb2R1bGUgaWQgPSA3NjVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fc2hvcnRPdXQuanNcbi8vIG1vZHVsZSBpZCA9IDc2NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZVB1bGxBbGwgPSByZXF1aXJlKCcuL19iYXNlUHVsbEFsbCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZWAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuICpcbiAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbJ2InLCAnYiddXG4gKi9cbmZ1bmN0aW9uIHB1bGxBbGwoYXJyYXksIHZhbHVlcykge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcbiAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG4gICAgOiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsQWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9wdWxsQWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyksXG4gICAgYmFzZUluZGV4T2ZXaXRoID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2ZXaXRoJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQWxsQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHNlZW4gPSBhcnJheTtcblxuICBpZiAoYXJyYXkgPT09IHZhbHVlcykge1xuICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuICB9XG4gIGlmIChpdGVyYXRlZSkge1xuICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZnJvbUluZGV4ID0gMCxcbiAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB3aGlsZSAoKGZyb21JbmRleCA9IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIGZyb21JbmRleCwgY29tcGFyYXRvcikpID4gLTEpIHtcbiAgICAgIGlmIChzZWVuICE9PSBhcnJheSkge1xuICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGZyb21JbmRleCwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEFsbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VQdWxsQWxsLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUlzTmFOID0gcmVxdWlyZSgnLi9fYmFzZUlzTmFOJyksXG4gICAgc3RyaWN0SW5kZXhPZiA9IHJlcXVpcmUoJy4vX3N0cmljdEluZGV4T2YnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcbiAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VJc05hTi5qc1xuLy8gbW9kdWxlIGlkID0gNzcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fc3RyaWN0SW5kZXhPZi5qc1xuLy8gbW9kdWxlIGlkID0gNzcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBiYXNlSW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2ZXaXRoKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoY29tcGFyYXRvcihhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2ZXaXRoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUluZGV4T2ZXaXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA3NzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fY29weUFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSA3NzRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcbiAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiAgICBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG4vLyBUaGlzIGltcG9ydCBpcyBuZWNlc3NhcnkgdG8gYmUgYWJsZSB0byB0ZXN0IHNhZ2FzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWR1eC1zYWdhL3JlZHV4LXNhZ2EvaXNzdWVzLzI4MCNpc3N1ZWNvbW1lbnQtMjkxMTMzMDIzXG5pbXBvcnQgXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIjtcblxuaW1wb3J0IHsgdGFrZUxhdGVzdCwgY2FsbCwgcHV0LCBzZWxlY3QgfSBmcm9tIFwicmVkdXgtc2FnYS9lZmZlY3RzXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCAqIGFzIGMgZnJvbSBcIi4vY29uc3RcIjtcbmltcG9ydCB7IGdldENvb2tpZSB9IGZyb20gXCIuLi9teS1yZXN1bHRzL3V0aWxzXCI7XG5cbmZ1bmN0aW9uIGNhbGxBeGlvcyhjb25maWcpIHtcbiAgICByZXR1cm4gYXhpb3MoY29uZmlnKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiAoeyByZXNwb25zZSB9KSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+ICh7IGVycm9yIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoRGF0YSh1c2VySWQpIHtcbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgdXJsOiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHt1c2VySWR9L2BcbiAgICB9O1xuICAgIHJldHVybiBjYWxsQXhpb3MoY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc19yZXN0cmljdGVkLCB1c2VyX3Byb2plY3RzKSB7XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwicHV0XCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogZ2V0Q29va2llKFwiY3NyZnRva2VuXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHVybDogYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7dXNlcklkfS9gLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1c2VyX3Byb2plY3RzOiB7XG4gICAgICAgICAgICAgICAgaXNfcmVzdHJpY3RlZCxcbiAgICAgICAgICAgICAgICBwcm9qZWN0czogdXNlcl9wcm9qZWN0c1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogZ2V0U2FnYShhY3Rpb24pIHtcbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgY29uc3QgeyByZXNwb25zZSwgZXJyb3IgfSA9IHlpZWxkIGNhbGwoZmV0Y2hEYXRhLCB1c2VySWQpO1xuICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9HRVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3IgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0VXNlcklkID0gc3RhdGUgPT4gc3RhdGUudXNlcklkO1xuZXhwb3J0IGNvbnN0IGdldFVzZXJQcm9qZWN0cyA9IHN0YXRlID0+IHN0YXRlLnVzZXJfcHJvamVjdHM7XG5leHBvcnQgY29uc3QgZ2V0SXNSZXN0cmljdGVkID0gc3RhdGUgPT4gc3RhdGUuaXNfcmVzdHJpY3RlZDtcblxuZXhwb3J0IGZ1bmN0aW9uKiBwdXRTYWdhKGFjdGlvbikge1xuICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuICAgIGNvbnN0IHVzZXJJZCA9IHlpZWxkIHNlbGVjdChnZXRVc2VySWQpO1xuICAgIGNvbnN0IGlzX3Jlc3RyaWN0ZWQgPSB5aWVsZCBzZWxlY3QoZ2V0SXNSZXN0cmljdGVkKTtcbiAgICBjb25zdCB1c2VyX3Byb2plY3RzID0geWllbGQgc2VsZWN0KGdldFVzZXJQcm9qZWN0cyk7XG5cbiAgICBjb25zdCB7IHJlc3BvbnNlLCBlcnJvciB9ID0geWllbGQgY2FsbChwdXREYXRhLCB1c2VySWQsIGlzX3Jlc3RyaWN0ZWQsIHVzZXJfcHJvamVjdHMpO1xuICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9QVVRfRkFJTFVSRSwgZXJyb3IgfSk7XG4gICAgfVxufVxuXG4vLyB3YXRjaGVyIHNhZ2E6IHdhdGNoZXMgZm9yIGFjdGlvbnMgZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmUsIHN0YXJ0cyB3b3JrZXIgc2FnYVxuZXhwb3J0IGZ1bmN0aW9uKiB3YXRjaGVyU2FnYSgpIHtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuQVBJX0dFVF9JTklULCBnZXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBwdXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFMsIHB1dFNhZ2EpO1xuICAgIHlpZWxkIHRha2VMYXRlc3QoYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgcHV0U2FnYSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9zYWdhcy5qcyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gSW4gc2xvcHB5IG1vZGUsIHVuYm91bmQgYHRoaXNgIHJlZmVycyB0byB0aGUgZ2xvYmFsIG9iamVjdCwgZmFsbGJhY2sgdG9cbiAgLy8gRnVuY3Rpb24gY29uc3RydWN0b3IgaWYgd2UncmUgaW4gZ2xvYmFsIHN0cmljdCBtb2RlLiBUaGF0IGlzIHNhZGx5IGEgZm9ybVxuICAvLyBvZiBpbmRpcmVjdCBldmFsIHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LlxuICAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qc1xuLy8gbW9kdWxlIGlkID0gNzc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc3N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZSh1dGlscy5tZXJnZShkZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9heGlvcy5qc1xuLy8gbW9kdWxlIGlkID0gNzc4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSA3Nzlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanNcbi8vIG1vZHVsZSBpZCA9IDc4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9pcy1idWZmZXIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vLi4vZGVmYXVsdHMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSB1dGlscy5tZXJnZSh7XG4gICAgICB1cmw6IGFyZ3VtZW50c1swXVxuICAgIH0sIGFyZ3VtZW50c1sxXSk7XG4gIH1cblxuICBjb25maWcgPSB1dGlscy5tZXJnZShkZWZhdWx0cywge21ldGhvZDogJ2dldCd9LCB0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmxcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2RlZmF1bHRzLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanNcbi8vIG1vZHVsZSBpZCA9IDc4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIGJ0b2EgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmJ0b2EgJiYgd2luZG93LmJ0b2EuYmluZCh3aW5kb3cpKSB8fCByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnRvYScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBsb2FkRXZlbnQgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbiAgICB2YXIgeERvbWFpbiA9IGZhbHNlO1xuXG4gICAgLy8gRm9yIElFIDgvOSBDT1JTIHN1cHBvcnRcbiAgICAvLyBPbmx5IHN1cHBvcnRzIFBPU1QgYW5kIEdFVCBjYWxscyBhbmQgZG9lc24ndCByZXR1cm5zIHRoZSByZXNwb25zZSBoZWFkZXJzLlxuICAgIC8vIERPTidUIGRvIHRoaXMgZm9yIHRlc3RpbmcgYi9jIFhNTEh0dHBSZXF1ZXN0IGlzIG1vY2tlZCwgbm90IFhEb21haW5SZXF1ZXN0LlxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCAmJiAhKCd3aXRoQ3JlZGVudGlhbHMnIGluIHJlcXVlc3QpICYmXG4gICAgICAgICFpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpIHtcbiAgICAgIHJlcXVlc3QgPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG4gICAgICBsb2FkRXZlbnQgPSAnb25sb2FkJztcbiAgICAgIHhEb21haW4gPSB0cnVlO1xuICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7fTtcbiAgICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHt9O1xuICAgIH1cblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgfHwgJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3RbbG9hZEV2ZW50XSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCAmJiAheERvbWFpbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgLy8gSUUgc2VuZHMgMTIyMyBpbnN0ZWFkIG9mIDIwNCAoaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy8yMDEpXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAnTm8gQ29udGVudCcgOiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIHZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcblxuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3RcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNzg2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDc4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICByZXR1cm4gZXJyb3I7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gNzg4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanNcbi8vIG1vZHVsZSBpZCA9IDc4OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qc1xuLy8gbW9kdWxlIGlkID0gNzkwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdmFyIG9yaWdpblVSTDtcblxuICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICB9XG5cbiAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKClcbik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBidG9hIHBvbHlmaWxsIGZvciBJRTwxMCBjb3VydGVzeSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcblxudmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZnVuY3Rpb24gRSgpIHtcbiAgdGhpcy5tZXNzYWdlID0gJ1N0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3Rlcic7XG59XG5FLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcbkUucHJvdG90eXBlLmNvZGUgPSA1O1xuRS5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXG5mdW5jdGlvbiBidG9hKGlucHV0KSB7XG4gIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpO1xuICB2YXIgb3V0cHV0ID0gJyc7XG4gIGZvciAoXG4gICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcbiAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycztcbiAgICAvLyBpZiB0aGUgbmV4dCBzdHIgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG4gICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcbiAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgc3RyLmNoYXJBdChpZHggfCAwKSB8fCAobWFwID0gJz0nLCBpZHggJSAxKTtcbiAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuICApIHtcbiAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGlkeCArPSAzIC8gNCk7XG4gICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgdGhyb3cgbmV3IEUoKTtcbiAgICB9XG4gICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidG9hO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J0b2EuanNcbi8vIG1vZHVsZSBpZCA9IDc5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiB7XG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDc5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gNzk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIFN1cHBvcnQgYmFzZVVSTCBjb25maWdcbiAgaWYgKGNvbmZpZy5iYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKGNvbmZpZy51cmwpKSB7XG4gICAgY29uZmlnLnVybCA9IGNvbWJpbmVVUkxzKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnMgfHwge31cbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qc1xuLy8gbW9kdWxlIGlkID0gNzk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qc1xuLy8gbW9kdWxlIGlkID0gNzk3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanNcbi8vIG1vZHVsZSBpZCA9IDc5OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanNcbi8vIG1vZHVsZSBpZCA9IDc5OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qc1xuLy8gbW9kdWxlIGlkID0gODAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qc1xuLy8gbW9kdWxlIGlkID0gODAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanNcbi8vIG1vZHVsZSBpZCA9IDgwMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwic291cmNlUm9vdCI6IiJ9