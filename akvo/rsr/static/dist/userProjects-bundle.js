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
        var _sagas = __webpack_require__(784);
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
            var _ = _ref2._, project = _ref2.project, isRestricted = _ref2.isRestricted, onChangeProjectSelected = _ref2.onChangeProjectSelected, firstProjectOfOrgGroup = _ref2.firstProjectOfOrgGroup, rowSpan = _ref2.rowSpan, orgs = _ref2.orgs;
            var uiSettings = function uiSettings(project, isRestricted, firstProjectOfOrgGroup) {
                var checked = project.access, disabled = isRestricted ? "" : "disabled", projectSelected = checked ? " projectSelected" : "", trClassName = disabled + projectSelected + (firstProjectOfOrgGroup ? " border-top" : ""), idClassName = disabled + " id";
                return {
                    checked: checked,
                    trClassName: trClassName,
                    idClassName: idClassName
                };
            };
            var cancelClick = function cancelClick(e) {
                e.stopPropagation();
            };
            var _uiSettings = uiSettings(project, isRestricted, firstProjectOfOrgGroup), checked = _uiSettings.checked, trClassName = _uiSettings.trClassName, idClassName = _uiSettings.idClassName;
            return _react2.default.createElement("tr", {
                key: project.id,
                id: project.id,
                onClick: onChangeProjectSelected,
                className: trClassName
            }, _react2.default.createElement("td", {
                className: "border-left"
            }, _react2.default.createElement("input", {
                id: project.id,
                type: "checkbox",
                checked: checked,
                disabled: !isRestricted,
                readOnly: true
            })), _react2.default.createElement("td", {
                className: idClassName
            }, project.id), _react2.default.createElement("td", null, project.title || _("no_title")), _react2.default.createElement("td", null, project.subtitle), firstProjectOfOrgGroup ? _react2.default.createElement("td", {
                className: "border",
                rowSpan: rowSpan,
                onClick: cancelClick
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
                return group.projects.map(function(project) {
                    var firstProjectOfOrgGroup = first;
                    first = false;
                    return _react2.default.createElement(Project, {
                        _: _,
                        key: project.id,
                        project: project,
                        isRestricted: isRestricted,
                        onChangeProjectSelected: onChangeProjectSelected,
                        firstProjectOfOrgGroup: firstProjectOfOrgGroup,
                        rowSpan: rowSpan,
                        orgs: group.organisations
                    });
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
                    var _props = this.props, projectsLoaded = _props.projectsLoaded, selectAll = _props.selectAll, groupedProjects = _props.groupedProjects, isRestricted = _props.isRestricted, error = _props.error;
                    return projectsLoaded ? _react2.default.createElement(Projects, {
                        _: this._,
                        error: error,
                        isRestricted: isRestricted,
                        selectAll: selectAll,
                        groupedProjects: groupedProjects,
                        onChangeIsRestricted: this.toggleIsRestricted,
                        onChangeProjectSelectAll: this.toggleProjectSelectAll,
                        onChangeProjectSelected: this.toggleProjectSelected
                    }) : _react2.default.createElement("div", {
                        className: "loading"
                    }, this._("loading"), " ", _react2.default.createElement("i", {
                        className: "fa fa-spin fa-spinner"
                    }));
                }
            } ]);
            return App;
        }(_react2.default.Component);
        var mapStateToProps = function mapStateToProps(state) {
            var projectsLoaded = state.projectsLoaded, fetching = state.fetching, error = state.error, groupedProjects = state.groupedProjects, isRestricted = state.isRestricted, selectAll = state.selectAll, strings = state.strings;
            return {
                projectsLoaded: projectsLoaded,
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
        var _cloneDeep = __webpack_require__(755);
        var _cloneDeep2 = _interopRequireDefault(_cloneDeep);
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
        var initialState = {
            selectAll: true,
            fetching: false,
            projectsLoaded: false,
            error: null,
            userId: null,
            groupedProjects: [],
            isRestricted: null,
            originalIsRestricted: null,
            originalGroupedProjects: null,
            originalSelectAll: null
        };
        var updateProjectAccess = function updateProjectAccess(projectId, groupedProjects) {
            return groupedProjects && groupedProjects.map(function(group) {
                return _extends({}, group, {
                    projects: group.projects.map(function(project) {
                        return _extends({}, project, {
                            access: project.id === projectId ? project.access = !project.access : project.access
                        });
                    })
                });
            });
        };
        var updateAllProjectsAccess = function updateAllProjectsAccess(access, groupedProjects) {
            return groupedProjects && groupedProjects.map(function(group) {
                return _extends({}, group, {
                    projects: group.projects.map(function(project) {
                        return _extends({}, project, {
                            access: access
                        });
                    })
                });
            });
        };
        var cloneState = function cloneState(obj) {
            return obj && (0, _cloneDeep2.default)(obj);
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
                    projectsLoaded: true,
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
                var _action$data2 = action.data, isRestricted = _action$data2.user_projects.is_restricted, groupedProjects = _action$data2.organisation_groups;
                return _extends({}, state, {
                    fetching: false,
                    isRestricted: isRestricted,
                    originalIsRestricted: null,
                    groupedProjects: groupedProjects,
                    originalGroupedProjects: null,
                    originalSelectAll: null
                });
            }), _defineProperty(_reducerActions, c.API_PUT_FAILURE, function(state, action) {
                var newState = _extends({}, state, {
                    fetching: false,
                    originalIsRestricted: null,
                    originalGroupedProjects: null,
                    originalSelectAll: null,
                    error: action.error
                });
                if (state.originalIsRestricted !== null) {
                    newState.isRestricted = state.originalIsRestricted;
                }
                if (state.originalGroupedProjects !== null) {
                    newState.groupedProjects = state.originalGroupedProjects;
                }
                if (state.originalSelectAll !== null) {
                    newState.selectAll = state.originalSelectAll;
                }
                return newState;
            }), _defineProperty(_reducerActions, c.UPDATE_PROJECT_SELECTION, function(state, action) {
                var projectId = action.data.projectId;
                var groupedProjects = updateProjectAccess(projectId, cloneState(state.groupedProjects));
                return _extends({}, state, {
                    originalGroupedProjects: cloneState(state.groupedProjects),
                    groupedProjects: groupedProjects
                });
            }), _defineProperty(_reducerActions, c.UPDATE_IS_RESTRICTED, function(state, action) {
                var isRestricted = action.data.isRestricted;
                return _extends({}, state, {
                    isRestricted: isRestricted,
                    originalIsRestricted: state.isRestricted
                });
            }), _defineProperty(_reducerActions, c.UPDATE_SELECT_ALL_PROJECTS, function(state, action) {
                var groupedProjects = updateAllProjectsAccess(state.selectAll, state.groupedProjects);
                var _state = _extends({}, state), selectAll = _state.selectAll;
                selectAll = !selectAll;
                return _extends({}, state, {
                    originalGroupedProjects: cloneState(state.groupedProjects),
                    originalSelectAll: state.selectAll,
                    groupedProjects: groupedProjects,
                    selectAll: selectAll
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
        var baseClone = __webpack_require__(756);
        var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
        function cloneDeep(value) {
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        module.exports = cloneDeep;
    },
    756: function(module, exports, __webpack_require__) {
        var Stack = __webpack_require__(366), arrayEach = __webpack_require__(757), assignValue = __webpack_require__(758), baseAssign = __webpack_require__(759), baseAssignIn = __webpack_require__(761), cloneBuffer = __webpack_require__(765), copyArray = __webpack_require__(766), copySymbols = __webpack_require__(767), copySymbolsIn = __webpack_require__(768), getAllKeys = __webpack_require__(409), getAllKeysIn = __webpack_require__(770), getTag = __webpack_require__(415), initCloneArray = __webpack_require__(771), initCloneByTag = __webpack_require__(772), initCloneObject = __webpack_require__(778), isArray = __webpack_require__(349), isBuffer = __webpack_require__(350), isMap = __webpack_require__(780), isObject = __webpack_require__(332), isSet = __webpack_require__(782), keys = __webpack_require__(344);
        var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
        var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
        var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
        function baseClone(value, bitmask, customizer, key, object, stack) {
            var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
            if (customizer) {
                result = object ? customizer(value, key, object, stack) : customizer(value);
            }
            if (result !== undefined) {
                return result;
            }
            if (!isObject(value)) {
                return value;
            }
            var isArr = isArray(value);
            if (isArr) {
                result = initCloneArray(value);
                if (!isDeep) {
                    return copyArray(value, result);
                }
            } else {
                var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
                if (isBuffer(value)) {
                    return cloneBuffer(value, isDeep);
                }
                if (tag == objectTag || tag == argsTag || isFunc && !object) {
                    result = isFlat || isFunc ? {} : initCloneObject(value);
                    if (!isDeep) {
                        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
                    }
                } else {
                    if (!cloneableTags[tag]) {
                        return object ? value : {};
                    }
                    result = initCloneByTag(value, tag, isDeep);
                }
            }
            stack || (stack = new Stack());
            var stacked = stack.get(value);
            if (stacked) {
                return stacked;
            }
            stack.set(value, result);
            if (isSet(value)) {
                value.forEach(function(subValue) {
                    result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
                });
                return result;
            }
            if (isMap(value)) {
                value.forEach(function(subValue, key) {
                    result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
                });
                return result;
            }
            var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
            var props = isArr ? undefined : keysFunc(value);
            arrayEach(props || value, function(subValue, key) {
                if (props) {
                    key = subValue;
                    subValue = value[key];
                }
                assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
            });
            return result;
        }
        module.exports = baseClone;
    },
    757: function(module, exports) {
        function arrayEach(array, iteratee) {
            var index = -1, length = array == null ? 0 : array.length;
            while (++index < length) {
                if (iteratee(array[index], index, array) === false) {
                    break;
                }
            }
            return array;
        }
        module.exports = arrayEach;
    },
    758: function(module, exports, __webpack_require__) {
        var baseAssignValue = __webpack_require__(327), eq = __webpack_require__(371);
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        function assignValue(object, key, value) {
            var objValue = object[key];
            if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
                baseAssignValue(object, key, value);
            }
        }
        module.exports = assignValue;
    },
    759: function(module, exports, __webpack_require__) {
        var copyObject = __webpack_require__(760), keys = __webpack_require__(344);
        function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
        }
        module.exports = baseAssign;
    },
    760: function(module, exports, __webpack_require__) {
        var assignValue = __webpack_require__(758), baseAssignValue = __webpack_require__(327);
        function copyObject(source, props, object, customizer) {
            var isNew = !object;
            object || (object = {});
            var index = -1, length = props.length;
            while (++index < length) {
                var key = props[index];
                var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
                if (newValue === undefined) {
                    newValue = source[key];
                }
                if (isNew) {
                    baseAssignValue(object, key, newValue);
                } else {
                    assignValue(object, key, newValue);
                }
            }
            return object;
        }
        module.exports = copyObject;
    },
    761: function(module, exports, __webpack_require__) {
        var copyObject = __webpack_require__(760), keysIn = __webpack_require__(762);
        function baseAssignIn(object, source) {
            return object && copyObject(source, keysIn(source), object);
        }
        module.exports = baseAssignIn;
    },
    762: function(module, exports, __webpack_require__) {
        var arrayLikeKeys = __webpack_require__(345), baseKeysIn = __webpack_require__(763), isArrayLike = __webpack_require__(361);
        function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        module.exports = keysIn;
    },
    763: function(module, exports, __webpack_require__) {
        var isObject = __webpack_require__(332), isPrototype = __webpack_require__(359), nativeKeysIn = __webpack_require__(764);
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        function baseKeysIn(object) {
            if (!isObject(object)) {
                return nativeKeysIn(object);
            }
            var isProto = isPrototype(object), result = [];
            for (var key in object) {
                if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
                    result.push(key);
                }
            }
            return result;
        }
        module.exports = baseKeysIn;
    },
    764: function(module, exports) {
        function nativeKeysIn(object) {
            var result = [];
            if (object != null) {
                for (var key in Object(object)) {
                    result.push(key);
                }
            }
            return result;
        }
        module.exports = nativeKeysIn;
    },
    765: function(module, exports, __webpack_require__) {
        (function(module) {
            var root = __webpack_require__(202);
            var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
            var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
            var moduleExports = freeModule && freeModule.exports === freeExports;
            var Buffer = moduleExports ? root.Buffer : undefined, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
            function cloneBuffer(buffer, isDeep) {
                if (isDeep) {
                    return buffer.slice();
                }
                var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
                buffer.copy(result);
                return result;
            }
            module.exports = cloneBuffer;
        }).call(exports, __webpack_require__(210)(module));
    },
    766: function(module, exports) {
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
    767: function(module, exports, __webpack_require__) {
        var copyObject = __webpack_require__(760), getSymbols = __webpack_require__(412);
        function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
        }
        module.exports = copySymbols;
    },
    768: function(module, exports, __webpack_require__) {
        var copyObject = __webpack_require__(760), getSymbolsIn = __webpack_require__(769);
        function copySymbolsIn(source, object) {
            return copyObject(source, getSymbolsIn(source), object);
        }
        module.exports = copySymbolsIn;
    },
    769: function(module, exports, __webpack_require__) {
        var arrayPush = __webpack_require__(411), getPrototype = __webpack_require__(206), getSymbols = __webpack_require__(412), stubArray = __webpack_require__(414);
        var nativeGetSymbols = Object.getOwnPropertySymbols;
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
            var result = [];
            while (object) {
                arrayPush(result, getSymbols(object));
                object = getPrototype(object);
            }
            return result;
        };
        module.exports = getSymbolsIn;
    },
    770: function(module, exports, __webpack_require__) {
        var baseGetAllKeys = __webpack_require__(410), getSymbolsIn = __webpack_require__(769), keysIn = __webpack_require__(762);
        function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        module.exports = getAllKeysIn;
    },
    771: function(module, exports) {
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        function initCloneArray(array) {
            var length = array.length, result = new array.constructor(length);
            if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
                result.index = array.index;
                result.input = array.input;
            }
            return result;
        }
        module.exports = initCloneArray;
    },
    772: function(module, exports, __webpack_require__) {
        var cloneArrayBuffer = __webpack_require__(773), cloneDataView = __webpack_require__(774), cloneRegExp = __webpack_require__(775), cloneSymbol = __webpack_require__(776), cloneTypedArray = __webpack_require__(777);
        var boolTag = "[object Boolean]", dateTag = "[object Date]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
        var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
        function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
              case arrayBufferTag:
                return cloneArrayBuffer(object);

              case boolTag:
              case dateTag:
                return new Ctor(+object);

              case dataViewTag:
                return cloneDataView(object, isDeep);

              case float32Tag:
              case float64Tag:
              case int8Tag:
              case int16Tag:
              case int32Tag:
              case uint8Tag:
              case uint8ClampedTag:
              case uint16Tag:
              case uint32Tag:
                return cloneTypedArray(object, isDeep);

              case mapTag:
                return new Ctor();

              case numberTag:
              case stringTag:
                return new Ctor(object);

              case regexpTag:
                return cloneRegExp(object);

              case setTag:
                return new Ctor();

              case symbolTag:
                return cloneSymbol(object);
            }
        }
        module.exports = initCloneByTag;
    },
    773: function(module, exports, __webpack_require__) {
        var Uint8Array = __webpack_require__(405);
        function cloneArrayBuffer(arrayBuffer) {
            var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
            new Uint8Array(result).set(new Uint8Array(arrayBuffer));
            return result;
        }
        module.exports = cloneArrayBuffer;
    },
    774: function(module, exports, __webpack_require__) {
        var cloneArrayBuffer = __webpack_require__(773);
        function cloneDataView(dataView, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
            return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        module.exports = cloneDataView;
    },
    775: function(module, exports) {
        var reFlags = /\w*$/;
        function cloneRegExp(regexp) {
            var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
            result.lastIndex = regexp.lastIndex;
            return result;
        }
        module.exports = cloneRegExp;
    },
    776: function(module, exports, __webpack_require__) {
        var Symbol = __webpack_require__(201);
        var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
        function cloneSymbol(symbol) {
            return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
        }
        module.exports = cloneSymbol;
    },
    777: function(module, exports, __webpack_require__) {
        var cloneArrayBuffer = __webpack_require__(773);
        function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
            return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        module.exports = cloneTypedArray;
    },
    778: function(module, exports, __webpack_require__) {
        var baseCreate = __webpack_require__(779), getPrototype = __webpack_require__(206), isPrototype = __webpack_require__(359);
        function initCloneObject(object) {
            return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        module.exports = initCloneObject;
    },
    779: function(module, exports, __webpack_require__) {
        var isObject = __webpack_require__(332);
        var objectCreate = Object.create;
        var baseCreate = function() {
            function object() {}
            return function(proto) {
                if (!isObject(proto)) {
                    return {};
                }
                if (objectCreate) {
                    return objectCreate(proto);
                }
                object.prototype = proto;
                var result = new object();
                object.prototype = undefined;
                return result;
            };
        }();
        module.exports = baseCreate;
    },
    780: function(module, exports, __webpack_require__) {
        var baseIsMap = __webpack_require__(781), baseUnary = __webpack_require__(356), nodeUtil = __webpack_require__(357);
        var nodeIsMap = nodeUtil && nodeUtil.isMap;
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        module.exports = isMap;
    },
    781: function(module, exports, __webpack_require__) {
        var getTag = __webpack_require__(415), isObjectLike = __webpack_require__(208);
        var mapTag = "[object Map]";
        function baseIsMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
        }
        module.exports = baseIsMap;
    },
    782: function(module, exports, __webpack_require__) {
        var baseIsSet = __webpack_require__(783), baseUnary = __webpack_require__(356), nodeUtil = __webpack_require__(357);
        var nodeIsSet = nodeUtil && nodeUtil.isSet;
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        module.exports = isSet;
    },
    783: function(module, exports, __webpack_require__) {
        var getTag = __webpack_require__(415), isObjectLike = __webpack_require__(208);
        var setTag = "[object Set]";
        function baseIsSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
        }
        module.exports = baseIsSet;
    },
    784: function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getIsRestricted = exports.getUserId = exports.filterProjects = undefined;
        exports.fetchData = fetchData;
        exports.putData = putData;
        exports.getSaga = getSaga;
        exports.putSaga = putSaga;
        exports.watcherSaga = watcherSaga;
        __webpack_require__(785);
        var _effects = __webpack_require__(752);
        var _axios = __webpack_require__(786);
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
        var filterProjects = exports.filterProjects = function filterProjects(state) {
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
    785: function(module, exports) {
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
    786: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(787);
    },
    787: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
        var bind = __webpack_require__(789);
        var Axios = __webpack_require__(791);
        var defaults = __webpack_require__(792);
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
        axios.Cancel = __webpack_require__(809);
        axios.CancelToken = __webpack_require__(810);
        axios.isCancel = __webpack_require__(806);
        axios.all = function all(promises) {
            return Promise.all(promises);
        };
        axios.spread = __webpack_require__(811);
        module.exports = axios;
        module.exports.default = axios;
    },
    788: function(module, exports, __webpack_require__) {
        "use strict";
        var bind = __webpack_require__(789);
        var isBuffer = __webpack_require__(790);
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
    789: function(module, exports) {
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
    790: function(module, exports) {
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
    791: function(module, exports, __webpack_require__) {
        "use strict";
        var defaults = __webpack_require__(792);
        var utils = __webpack_require__(788);
        var InterceptorManager = __webpack_require__(803);
        var dispatchRequest = __webpack_require__(804);
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
    792: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(788);
            var normalizeHeaderName = __webpack_require__(793);
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
                    adapter = __webpack_require__(794);
                } else if (typeof process !== "undefined") {
                    adapter = __webpack_require__(794);
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
    793: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
        module.exports = function normalizeHeaderName(headers, normalizedName) {
            utils.forEach(headers, function processHeader(value, name) {
                if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                    headers[normalizedName] = value;
                    delete headers[name];
                }
            });
        };
    },
    794: function(module, exports, __webpack_require__) {
        (function(process) {
            "use strict";
            var utils = __webpack_require__(788);
            var settle = __webpack_require__(795);
            var buildURL = __webpack_require__(798);
            var parseHeaders = __webpack_require__(799);
            var isURLSameOrigin = __webpack_require__(800);
            var createError = __webpack_require__(796);
            var btoa = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || __webpack_require__(801);
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
                        var cookies = __webpack_require__(802);
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
    795: function(module, exports, __webpack_require__) {
        "use strict";
        var createError = __webpack_require__(796);
        module.exports = function settle(resolve, reject, response) {
            var validateStatus = response.config.validateStatus;
            if (!response.status || !validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
            }
        };
    },
    796: function(module, exports, __webpack_require__) {
        "use strict";
        var enhanceError = __webpack_require__(797);
        module.exports = function createError(message, config, code, request, response) {
            var error = new Error(message);
            return enhanceError(error, config, code, request, response);
        };
    },
    797: function(module, exports) {
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
    798: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
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
    799: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
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
    800: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
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
    801: function(module, exports) {
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
    802: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
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
    803: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
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
    804: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
        var transformData = __webpack_require__(805);
        var isCancel = __webpack_require__(806);
        var defaults = __webpack_require__(792);
        var isAbsoluteURL = __webpack_require__(807);
        var combineURLs = __webpack_require__(808);
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
    805: function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(788);
        module.exports = function transformData(data, headers, fns) {
            utils.forEach(fns, function transform(fn) {
                data = fn(data, headers);
            });
            return data;
        };
    },
    806: function(module, exports) {
        "use strict";
        module.exports = function isCancel(value) {
            return !!(value && value.__CANCEL__);
        };
    },
    807: function(module, exports) {
        "use strict";
        module.exports = function isAbsoluteURL(url) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
        };
    },
    808: function(module, exports) {
        "use strict";
        module.exports = function combineURLs(baseURL, relativeURL) {
            return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
        };
    },
    809: function(module, exports) {
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
    810: function(module, exports, __webpack_require__) {
        "use strict";
        var Cancel = __webpack_require__(809);
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
    811: function(module, exports) {
        "use strict";
        module.exports = function spread(callback) {
            return function wrap(arr) {
                return callback.apply(null, arr);
            };
        };
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXNlclByb2plY3RzLWJ1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzLXNyYy91c2VyLXByb2plY3RzLWFjY2Vzcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29tcG9uZW50cy9BcHAuanN4Iiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbnN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9ydW5TYWdhLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9wcm9jLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvaW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9zYWdhSGVscGVycy90YWtlTGF0ZXN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9taWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4LXNhZ2EvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvY2xvbmVEZWVwLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19iYXNlQ2xvbmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VBc3NpZ25Jbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9rZXlzSW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2dldFN5bWJvbHNJbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19pbml0Q2xvbmVBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fY2xvbmVUeXBlZEFycmF5LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvaXNNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gvX2Jhc2VJc01hcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9pc1NldC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC9fYmFzZUlzU2V0LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3NhZ2FzLmpzIiwid2VicGFjazovLy8uL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL34vaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIl0sIm5hbWVzIjpbIndlYnBhY2tKc29ucCIsIjAiLCJtb2R1bGUiLCJleHBvcnRzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIl9yZWFjdCIsIl9yZWFjdDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3JlYWN0RG9tMiIsIl9BcHAiLCJfQXBwMiIsIl9yZWR1eCIsIl9yZWR1eFNhZ2EiLCJfcmVkdXhTYWdhMiIsIl9yZWFjdFJlZHV4IiwiX3JlZHVjZXIiLCJfc2FnYXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNhZ2FNaWRkbGV3YXJlIiwicmVkdXhEZXZUb29scyIsIndpbmRvdyIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJzdG9yZSIsImNyZWF0ZVN0b3JlIiwicmVkdWNlciIsImNvbXBvc2UiLCJhcHBseU1pZGRsZXdhcmUiLCJydW4iLCJ3YXRjaGVyU2FnYSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlJlYWN0RE9NIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCI3MzUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJrZXkiLCJDb25zdHJ1Y3RvciIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIl91dGlscyIsIl9jb25zdCIsImMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ld09iaiIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJzdWJDbGFzcyIsInN1cGVyQ2xhc3MiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiSXNSZXN0cmljdGVkIiwiX3JlZiIsIl8iLCJpc1Jlc3RyaWN0ZWQiLCJvbkNoYW5nZUlzUmVzdHJpY3RlZCIsImlkIiwidHlwZSIsImNoZWNrZWQiLCJvbkNoYW5nZSIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiY2xhc3NOYW1lIiwiUHJvamVjdCIsIl9yZWYyIiwicHJvamVjdCIsIm9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkIiwiZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCIsInJvd1NwYW4iLCJvcmdzIiwidWlTZXR0aW5ncyIsImFjY2VzcyIsImRpc2FibGVkIiwicHJvamVjdFNlbGVjdGVkIiwidHJDbGFzc05hbWUiLCJpZENsYXNzTmFtZSIsImNhbmNlbENsaWNrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIl91aVNldHRpbmdzIiwib25DbGljayIsInJlYWRPbmx5IiwidGl0bGUiLCJzdWJ0aXRsZSIsIlNlbGVjdEFsbCIsIl9yZWYzIiwic2VsZWN0QWxsIiwib25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsIiwiYnV0dG9uQ2xhc3MiLCJkaXZDbGFzcyIsIl91aVNldHRpbmdzMiIsIkVycm9yIiwiX3JlZjQiLCJlcnJvciIsIm1lc3NhZ2UiLCJQcm9qZWN0cyIsIl9yZWY1IiwiZ3JvdXBlZFByb2plY3RzIiwibWFwIiwiZ3JvdXAiLCJwcm9qZWN0cyIsImZpcnN0Iiwib3JnYW5pc2F0aW9ucyIsIkFwcCIsIl9SZWFjdCRDb21wb25lbnQiLCJ0aGlzIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInRvZ2dsZVByb2plY3RTZWxlY3RlZCIsImJpbmQiLCJ0b2dnbGVJc1Jlc3RyaWN0ZWQiLCJ0b2dnbGVQcm9qZWN0U2VsZWN0QWxsIiwicyIsInN0cmluZ3MiLCJvblVwZGF0ZUlzUmVzdHJpY3RlZCIsIm9uVXBkYXRlU2VsZWN0QWxsIiwiY3VycmVudFRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJvblVwZGF0ZVByb2plY3RTZWxlY3Rpb24iLCJjb21wb25lbnREaWRNb3VudCIsInVzZXJJZCIsImRhdGFGcm9tRWxlbWVudCIsInNldFN0b3JlIiwib25GZXRjaFVzZXJQcm9qZWN0cyIsIl9wcm9wcyIsInByb2plY3RzTG9hZGVkIiwiUmVhY3QiLCJDb21wb25lbnQiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsImZldGNoaW5nIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJBUElfR0VUX0lOSVQiLCJkYXRhIiwiU0VUX1NUT1JFIiwicHJvamVjdElkIiwiVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OIiwiVVBEQVRFX0lTX1JFU1RSSUNURUQiLCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyIsImNvbm5lY3QiLCI3MzYiLCJlbmRwb2ludHMiLCJ1c2VyX3Byb2plY3RzX2FjY2VzcyIsImluQXJyYXkiLCJhcnIiLCJpbmRleE9mIiwiZWxlbWVudE5hbWUiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCI3MzciLCJBUElfR0VUX1NVQ0NFU1MiLCJBUElfR0VUX0ZBSUxVUkUiLCJBUElfUFVUX0lOSVQiLCJBUElfUFVUX1NVQ0NFU1MiLCJBUElfUFVUX0ZBSUxVUkUiLCI3MzgiLCJ1dGlscyIsImVmZmVjdHMiLCJkZXRhY2giLCJDQU5DRUwiLCJkZWxheSIsInRocm90dGxlIiwidGFrZUxhdGVzdCIsInRha2VFdmVyeSIsImJ1ZmZlcnMiLCJjaGFubmVsIiwiZXZlbnRDaGFubmVsIiwiRU5EIiwicnVuU2FnYSIsInVuZGVmaW5lZCIsIl9ydW5TYWdhIiwiZ2V0IiwiX2NoYW5uZWwiLCJfYnVmZmVycyIsIl9zYWdhSGVscGVycyIsIl9pbyIsIl9taWRkbGV3YXJlIiwiX21pZGRsZXdhcmUyIiwiX2VmZmVjdHMiLCJfdXRpbHMyIiwiNzM5IiwicHJvY2VzcyIsIl9wcm9jIiwiX3Byb2MyIiwiUlVOX1NBR0FfU0lHTkFUVVJFIiwiTk9OX0dFTkVSQVRPUl9FUlIiLCJzdG9yZUludGVyZmFjZSIsInNhZ2EiLCJfbGVuIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwiX2tleSIsIml0ZXJhdG9yIiwiaXMiLCJlbnYiLCJOT0RFX0VOViIsImxvZyIsImNoZWNrIiwiZnVuYyIsImFwcGx5IiwiX3N0b3JlSW50ZXJmYWNlIiwic3Vic2NyaWJlIiwiZ2V0U3RhdGUiLCJjb250ZXh0Iiwic2FnYU1vbml0b3IiLCJsb2dnZXIiLCJvbkVycm9yIiwiZWZmZWN0SWQiLCJ1aWQiLCJlZmZlY3RUcmlnZ2VyZWQiLCJub29wIiwiZWZmZWN0UmVzb2x2ZWQiLCJlZmZlY3RSZWplY3RlZCIsImVmZmVjdENhbmNlbGxlZCIsImFjdGlvbkRpc3BhdGNoZWQiLCJyb290IiwicGFyZW50RWZmZWN0SWQiLCJlZmZlY3QiLCJ0YXNrIiwid3JhcFNhZ2FEaXNwYXRjaCIsIm5hbWUiLCI3NDAiLCJfZXh0ZW5kcyIsImFzc2lnbiIsInNvdXJjZSIsIl90eXBlb2YiLCJTeW1ib2wiLCJoYXNPd24iLCJyZW1vdmUiLCJkZWZlcnJlZCIsImFycmF5T2ZEZWZmZXJlZCIsImNyZWF0ZU1vY2tUYXNrIiwiYXV0b0luYyIsIm1ha2VJdGVyYXRvciIsImRlcHJlY2F0ZSIsInN5bSIsIlRBU0siLCJIRUxQRVIiLCJNQVRDSCIsIlNBR0FfQUNUSU9OIiwiU0VMRl9DQU5DRUxMQVRJT04iLCJrb25zdCIsInYiLCJrVHJ1ZSIsImtGYWxzZSIsImlkZW50IiwicHJlZGljYXRlIiwib2JqZWN0IiwicHJvcGVydHkiLCJub3RVbmRlZiIsInVuZGVmIiwiZiIsIm51bWJlciIsIm4iLCJzdHJpbmciLCJhcnJheSIsImlzQXJyYXkiLCJwcm9taXNlIiwicCIsInRoZW4iLCJpdCIsIm5leHQiLCJ0aHJvdyIsIml0ZXJhYmxlIiwidCIsIm9ic2VydmFibGUiLCJvYiIsImJ1ZmZlciIsImJ1ZiIsImlzRW1wdHkiLCJ0YWtlIiwicHV0IiwicGF0dGVybiIsInBhdCIsImNoIiwiY2xvc2UiLCJoZWxwZXIiLCJzdHJpbmdhYmxlRnVuYyIsIml0ZW0iLCJpbmRleCIsInNwbGljZSIsImZyb20iLCJkZWYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInB1c2giLCJtcyIsInZhbCIsInRpbWVvdXRJZCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5uaW5nIiwiX3Jlc3VsdCIsIl9lcnJvciIsImlzUnVubmluZyIsInJlc3VsdCIsInNldFJ1bm5pbmciLCJiIiwic2V0UmVzdWx0IiwiciIsInNldEVycm9yIiwic2VlZCIsImtUaHJvdyIsImVyciIsImtSZXR1cm4iLCJkb25lIiwidGhybyIsImlzSGVscGVyIiwicmV0dXJuIiwibGV2ZWwiLCJjb25zb2xlIiwic3RhY2siLCJmbiIsImRlcHJlY2F0aW9uV2FybmluZyIsInVwZGF0ZUluY2VudGl2ZSIsImRlcHJlY2F0ZWQiLCJwcmVmZXJyZWQiLCJpbnRlcm5hbEVyciIsImNyZWF0ZVNldENvbnRleHRXYXJuaW5nIiwiY3R4IiwiYWN0aW9uIiwiY2xvbmVhYmxlR2VuZXJhdG9yIiwiZ2VuZXJhdG9yRnVuYyIsImhpc3RvcnkiLCJnZW4iLCJhcmciLCJjbG9uZSIsImNsb25lZEdlbiIsImZvckVhY2giLCJfcmV0dXJuIiwiX3Rocm93IiwiZXhjZXB0aW9uIiwiNzQxIiwiVEFTS19DQU5DRUwiLCJDSEFOTkVMX0VORCIsIk5PVF9JVEVSQVRPUl9FUlJPUiIsInByb2MiLCJfc2NoZWR1bGVyIiwiX2RlZmluZUVudW1lcmFibGVQcm9wZXJ0aWVzIiwiZGVzY3MiLCJkZXNjIiwidG9TdHJpbmciLCJtYXRjaGVycyIsIndpbGRjYXJkIiwiX2RlZmF1bHQiLCJpbnB1dCIsIlN0cmluZyIsInBhdHRlcm5zIiwic29tZSIsIm1hdGNoZXIiLCJfcHJlZGljYXRlIiwiZm9ya1F1ZXVlIiwibWFpblRhc2siLCJjYiIsInRhc2tzIiwiY29tcGxldGVkIiwiYWRkVGFzayIsImFib3J0IiwiY2FuY2VsQWxsIiwiY29udCIsInJlcyIsImlzRXJyIiwiY2FuY2VsIiwiZ2V0VGFza3MiLCJ0YXNrTmFtZXMiLCJjcmVhdGVUYXNrSXRlcmF0b3IiLCJwYyIsImVmZiIsInJldCIsIndyYXBIZWxwZXIiLCJwYXJlbnRDb250ZXh0Iiwib3B0aW9ucyIsImVmZmVjdHNTdHJpbmciLCJydW5QYXJhbGxlbEVmZmVjdCIsInJ1bkFsbEVmZmVjdCIsImxvZ0Vycm9yIiwic2FnYVN0YWNrIiwic3BsaXQiLCJzdGRDaGFubmVsIiwidGFza0NvbnRleHQiLCJuZXdUYXNrIiwiY2FuY2VsTWFpbiIsInRhc2tRdWV1ZSIsImVuZCIsImlzQ2FuY2VsbGVkIiwiX2lzUnVubmluZyIsIl9pc0NhbmNlbGxlZCIsInJ1bkVmZmVjdCIsImlzTWFpblJ1bm5pbmciLCJfZGVmZXJyZWRFbmQiLCJfaXNBYm9ydGVkIiwiam9pbmVycyIsImoiLCJsYWJlbCIsImVmZmVjdFNldHRsZWQiLCJjdXJyQ2IiLCJyZXNvbHZlUHJvbWlzZSIsInJ1bkZvcmtFZmZlY3QiLCJyZXNvbHZlSXRlcmF0b3IiLCJhc0VmZmVjdCIsInJ1blRha2VFZmZlY3QiLCJydW5QdXRFZmZlY3QiLCJhbGwiLCJyYWNlIiwicnVuUmFjZUVmZmVjdCIsInJ1bkNhbGxFZmZlY3QiLCJjcHMiLCJydW5DUFNFZmZlY3QiLCJmb3JrIiwiam9pbiIsInJ1bkpvaW5FZmZlY3QiLCJydW5DYW5jZWxFZmZlY3QiLCJzZWxlY3QiLCJydW5TZWxlY3RFZmZlY3QiLCJhY3Rpb25DaGFubmVsIiwicnVuQ2hhbm5lbEVmZmVjdCIsImZsdXNoIiwicnVuRmx1c2hFZmZlY3QiLCJjYW5jZWxsZWQiLCJydW5DYW5jZWxsZWRFZmZlY3QiLCJnZXRDb250ZXh0IiwicnVuR2V0Q29udGV4dEVmZmVjdCIsInNldENvbnRleHQiLCJydW5TZXRDb250ZXh0RWZmZWN0IiwiY2FuY2VsUHJvbWlzZSIsIm1heWJlIiwidGFrZUNiIiwiaW5wIiwiaXNFbmQiLCJhc2FwIiwiY3BzQ2IiLCJjb25jYXQiLCJfcmVmNiIsImRldGFjaGVkIiwidGFza0l0ZXJhdG9yIiwic3VzcGVuZCIsIl90YXNrIiwiam9pbmVyIiwiaXNBYm9ydGVkIiwidGFza1RvQ2FuY2VsIiwia2V5cyIsImNvbXBsZXRlZENvdW50IiwicmVzdWx0cyIsImNoaWxkQ2JzIiwiY2hlY2tFZmZlY3RFbmQiLCJjaENiQXRLZXkiLCJfcmVzcG9uc2UiLCJyZXNwb25zZSIsInNsaWNlIiwiX3JlZjciLCJzZWxlY3RvciIsIl9yZWY4IiwibWF0Y2giLCJmaXhlZCIsInByb3AiLCJfZG9uZSIsIl9yZWY5IiwiX211dGF0b3JNYXAiLCI3NDIiLCJxdWV1ZSIsInNlbWFwaG9yZSIsImV4ZWMiLCJyZWxlYXNlIiwic2hpZnQiLCI3NDMiLCJ0YWtlbSIsInNwYXduIiwiSU8iLCJUQUtFIiwiUFVUIiwiQUxMIiwiUkFDRSIsIkNBTEwiLCJDUFMiLCJGT1JLIiwiSk9JTiIsIlNFTEVDVCIsIkFDVElPTl9DSEFOTkVMIiwiQ0FOQ0VMTEVEIiwiRkxVU0giLCJHRVRfQ09OVEVYVCIsIlNFVF9DT05URVhUIiwiVEVTVF9ISU5UIiwicGF5bG9hZCIsInBhdHRlcm5PckNoYW5uZWwiLCJzeW5jIiwiZ2V0Rm5DYWxsRGVzYyIsIm1ldGgiLCJfZm4iLCJfZm4yIiwiX2xlbjIiLCJfa2V5MiIsIl9sZW4zIiwiX2tleTMiLCJfbGVuNCIsIl9rZXk0IiwiX2xlbjUiLCJfa2V5NSIsIl9sZW42IiwiX2tleTYiLCJfbGVuNyIsIl9rZXk3Iiwid29ya2VyIiwiX2xlbjgiLCJfa2V5OCIsInRha2VFdmVyeUhlbHBlciIsIl9sZW45IiwiX2tleTkiLCJ0YWtlTGF0ZXN0SGVscGVyIiwiX2xlbjEwIiwiX2tleTEwIiwidGhyb3R0bGVIZWxwZXIiLCJjcmVhdGVBc0VmZmVjdFR5cGUiLCI3NDQiLCJfdGFrZUV2ZXJ5IiwiX3Rha2VFdmVyeTIiLCJfdGFrZUxhdGVzdCIsIl90YWtlTGF0ZXN0MiIsIl90aHJvdHRsZSIsIl90aHJvdHRsZTIiLCJoZWxwZXJOYW1lIiwiNzQ1IiwiX2ZzbUl0ZXJhdG9yIiwiX2ZzbUl0ZXJhdG9yMiIsInlUYWtlIiwieUZvcmsiLCJhYyIsInNldEFjdGlvbiIsInExIiwicTIiLCJxRW5kIiwic2FmZU5hbWUiLCI3NDYiLCJmc21JdGVyYXRvciIsImVudHJ5IiwiZnNtIiwicTAiLCJ1cGRhdGVTdGF0ZSIsInFOZXh0IiwiX2ZzbSRxTmV4dCIsInEiLCJvdXRwdXQiLCJfdXBkYXRlU3RhdGUiLCI3NDciLCJVTkRFRklORURfSU5QVVRfRVJST1IiLCJJTlZBTElEX0JVRkZFUiIsImVtaXR0ZXIiLCJDSEFOTkVMX0VORF9UWVBFIiwiYSIsInN1YnNjcmliZXJzIiwic3ViIiwiZW1pdCIsImxlbiIsImNsb3NlZCIsInRha2VycyIsImNoZWNrRm9yYmlkZGVuU3RhdGVzIiwiX190YWtlcnNfXyIsIl9fY2xvc2VkX18iLCJub25lIiwiY2hhbiIsInVuc3Vic2NyaWJlIiwiNzQ4IiwiQlVGRkVSX09WRVJGTE9XIiwiT05fT1ZFUkZMT1dfVEhST1ciLCJPTl9PVkVSRkxPV19EUk9QIiwiT05fT1ZFUkZMT1dfU0xJREUiLCJPTl9PVkVSRkxPV19FWFBBTkQiLCJ6ZXJvQnVmZmVyIiwicmluZ0J1ZmZlciIsImxpbWl0Iiwib3ZlcmZsb3dBY3Rpb24iLCJwdXNoSW5kZXgiLCJwb3BJbmRleCIsIml0ZW1zIiwiZG91YmxlZExpbWl0IiwiZHJvcHBpbmciLCJzbGlkaW5nIiwiZXhwYW5kaW5nIiwiaW5pdGlhbFNpemUiLCI3NDkiLCJ5Q2FuY2VsIiwic2V0VGFzayIsInEzIiwiNzUwIiwiZGVsYXlMZW5ndGgiLCJ5QWN0aW9uQ2hhbm5lbCIsInlEZWxheSIsInNldENoYW5uZWwiLCJxNCIsIjc1MSIsInNhZ2FNaWRkbGV3YXJlRmFjdG9yeSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9yZWYkY29udGV4dCIsIm9uZXJyb3IiLCJzYWdhRW1pdHRlciIsIjc1MiIsIjc1MyIsIjc1NCIsIl9jbG9uZURlZXAiLCJfY2xvbmVEZWVwMiIsIl9kZWZpbmVQcm9wZXJ0eSIsImluaXRpYWxTdGF0ZSIsIm9yaWdpbmFsSXNSZXN0cmljdGVkIiwib3JpZ2luYWxHcm91cGVkUHJvamVjdHMiLCJvcmlnaW5hbFNlbGVjdEFsbCIsInVwZGF0ZVByb2plY3RBY2Nlc3MiLCJ1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyIsImNsb25lU3RhdGUiLCJfcmVkdWNlckFjdGlvbnMiLCJyZWR1Y2VyQWN0aW9ucyIsIl9hY3Rpb24kZGF0YSIsInVzZXJfcHJvamVjdHMiLCJpc19yZXN0cmljdGVkIiwib3JnYW5pc2F0aW9uX2dyb3VwcyIsImFsbF9wcm9qZWN0cyIsIl9hY3Rpb24kZGF0YTIiLCJuZXdTdGF0ZSIsIl9zdGF0ZSIsIjc1NSIsImJhc2VDbG9uZSIsIkNMT05FX0RFRVBfRkxBRyIsIkNMT05FX1NZTUJPTFNfRkxBRyIsImNsb25lRGVlcCIsIjc1NiIsIlN0YWNrIiwiYXJyYXlFYWNoIiwiYXNzaWduVmFsdWUiLCJiYXNlQXNzaWduIiwiYmFzZUFzc2lnbkluIiwiY2xvbmVCdWZmZXIiLCJjb3B5QXJyYXkiLCJjb3B5U3ltYm9scyIsImNvcHlTeW1ib2xzSW4iLCJnZXRBbGxLZXlzIiwiZ2V0QWxsS2V5c0luIiwiZ2V0VGFnIiwiaW5pdENsb25lQXJyYXkiLCJpbml0Q2xvbmVCeVRhZyIsImluaXRDbG9uZU9iamVjdCIsImlzQnVmZmVyIiwiaXNNYXAiLCJpc09iamVjdCIsImlzU2V0IiwiQ0xPTkVfRkxBVF9GTEFHIiwiYXJnc1RhZyIsImFycmF5VGFnIiwiYm9vbFRhZyIsImRhdGVUYWciLCJlcnJvclRhZyIsImZ1bmNUYWciLCJnZW5UYWciLCJtYXBUYWciLCJudW1iZXJUYWciLCJvYmplY3RUYWciLCJyZWdleHBUYWciLCJzZXRUYWciLCJzdHJpbmdUYWciLCJzeW1ib2xUYWciLCJ3ZWFrTWFwVGFnIiwiYXJyYXlCdWZmZXJUYWciLCJkYXRhVmlld1RhZyIsImZsb2F0MzJUYWciLCJmbG9hdDY0VGFnIiwiaW50OFRhZyIsImludDE2VGFnIiwiaW50MzJUYWciLCJ1aW50OFRhZyIsInVpbnQ4Q2xhbXBlZFRhZyIsInVpbnQxNlRhZyIsInVpbnQzMlRhZyIsImNsb25lYWJsZVRhZ3MiLCJiaXRtYXNrIiwiY3VzdG9taXplciIsImlzRGVlcCIsImlzRmxhdCIsImlzRnVsbCIsImlzQXJyIiwidGFnIiwiaXNGdW5jIiwic3RhY2tlZCIsInNldCIsInN1YlZhbHVlIiwiYWRkIiwia2V5c0Z1bmMiLCJrZXlzSW4iLCI3NTciLCJpdGVyYXRlZSIsIjc1OCIsImJhc2VBc3NpZ25WYWx1ZSIsImVxIiwib2JqZWN0UHJvdG8iLCJvYmpWYWx1ZSIsIjc1OSIsImNvcHlPYmplY3QiLCI3NjAiLCJpc05ldyIsIm5ld1ZhbHVlIiwiNzYxIiwiNzYyIiwiYXJyYXlMaWtlS2V5cyIsImJhc2VLZXlzSW4iLCJpc0FycmF5TGlrZSIsIjc2MyIsImlzUHJvdG90eXBlIiwibmF0aXZlS2V5c0luIiwiaXNQcm90byIsIjc2NCIsIjc2NSIsImZyZWVFeHBvcnRzIiwibm9kZVR5cGUiLCJmcmVlTW9kdWxlIiwibW9kdWxlRXhwb3J0cyIsIkJ1ZmZlciIsImFsbG9jVW5zYWZlIiwiY29weSIsIjc2NiIsIjc2NyIsImdldFN5bWJvbHMiLCI3NjgiLCJnZXRTeW1ib2xzSW4iLCI3NjkiLCJhcnJheVB1c2giLCJnZXRQcm90b3R5cGUiLCJzdHViQXJyYXkiLCJuYXRpdmVHZXRTeW1ib2xzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwiNzcwIiwiYmFzZUdldEFsbEtleXMiLCI3NzEiLCI3NzIiLCJjbG9uZUFycmF5QnVmZmVyIiwiY2xvbmVEYXRhVmlldyIsImNsb25lUmVnRXhwIiwiY2xvbmVTeW1ib2wiLCJjbG9uZVR5cGVkQXJyYXkiLCJDdG9yIiwiNzczIiwiVWludDhBcnJheSIsImFycmF5QnVmZmVyIiwiYnl0ZUxlbmd0aCIsIjc3NCIsImRhdGFWaWV3IiwiYnl0ZU9mZnNldCIsIjc3NSIsInJlRmxhZ3MiLCJyZWdleHAiLCJsYXN0SW5kZXgiLCI3NzYiLCJzeW1ib2xQcm90byIsInN5bWJvbFZhbHVlT2YiLCJ2YWx1ZU9mIiwic3ltYm9sIiwiNzc3IiwidHlwZWRBcnJheSIsIjc3OCIsImJhc2VDcmVhdGUiLCI3NzkiLCJvYmplY3RDcmVhdGUiLCJwcm90byIsIjc4MCIsImJhc2VJc01hcCIsImJhc2VVbmFyeSIsIm5vZGVVdGlsIiwibm9kZUlzTWFwIiwiNzgxIiwiaXNPYmplY3RMaWtlIiwiNzgyIiwiYmFzZUlzU2V0Iiwibm9kZUlzU2V0IiwiNzgzIiwiNzg0IiwiZ2V0SXNSZXN0cmljdGVkIiwiZ2V0VXNlcklkIiwiZmlsdGVyUHJvamVjdHMiLCJmZXRjaERhdGEiLCJwdXREYXRhIiwiZ2V0U2FnYSIsInB1dFNhZ2EiLCJfYXhpb3MiLCJfYXhpb3MyIiwiX21hcmtlZCIsInJlZ2VuZXJhdG9yUnVudGltZSIsIm1hcmsiLCJfbWFya2VkMiIsIl9tYXJrZWQzIiwiY2FsbEF4aW9zIiwiY29uZmlnIiwiY2F0Y2giLCJtZXRob2QiLCJ1cmwiLCJwcm9qZWN0c1dpdGhBY2Nlc3MiLCJoZWFkZXJzIiwiWC1DU1JGVG9rZW4iLCJnZXRDb29raWUiLCJ3cmFwIiwiZ2V0U2FnYSQiLCJfY29udGV4dCIsInByZXYiLCJzZW50Iiwic3RvcCIsInJlZHVjZSIsImFjYyIsImZpbHRlciIsInB1dFNhZ2EkIiwiX2NvbnRleHQyIiwid2F0Y2hlclNhZ2EkIiwiX2NvbnRleHQzIiwiNzg1IiwiZ2xvYmFsIiwiT3AiLCIkU3ltYm9sIiwiaXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJpbk1vZHVsZSIsInJ1bnRpbWUiLCJpbm5lckZuIiwib3V0ZXJGbiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsIkdlblN0YXRlU3VzcGVuZGVkU3RhcnQiLCJHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkIiwiR2VuU3RhdGVFeGVjdXRpbmciLCJHZW5TdGF0ZUNvbXBsZXRlZCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJkaXNwbGF5TmFtZSIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiYXdyYXAiLCJfX2F3YWl0IiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsInJlY29yZCIsInVud3JhcHBlZCIsInByZXZpb3VzUHJvbWlzZSIsImVucXVldWUiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsImFzeW5jIiwiaXRlciIsImRvbmVSZXN1bHQiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHRMb2MiLCJwdXNoVHJ5RW50cnkiLCJsb2NzIiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsInJldmVyc2UiLCJwb3AiLCJpdGVyYXRvck1ldGhvZCIsImlzTmFOIiwic2tpcFRlbXBSZXNldCIsImNoYXJBdCIsInJvb3RFbnRyeSIsInJvb3RSZWNvcmQiLCJydmFsIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwiRnVuY3Rpb24iLCI3ODYiLCI3ODciLCJBeGlvcyIsImRlZmF1bHRzIiwiY3JlYXRlSW5zdGFuY2UiLCJkZWZhdWx0Q29uZmlnIiwicmVxdWVzdCIsImV4dGVuZCIsImF4aW9zIiwiaW5zdGFuY2VDb25maWciLCJtZXJnZSIsIkNhbmNlbCIsIkNhbmNlbFRva2VuIiwiaXNDYW5jZWwiLCJwcm9taXNlcyIsInNwcmVhZCIsIjc4OCIsImlzQXJyYXlCdWZmZXIiLCJpc0Zvcm1EYXRhIiwiRm9ybURhdGEiLCJpc0FycmF5QnVmZmVyVmlldyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzVW5kZWZpbmVkIiwiaXNEYXRlIiwiaXNGaWxlIiwiaXNCbG9iIiwiaXNGdW5jdGlvbiIsImlzU3RyZWFtIiwicGlwZSIsImlzVVJMU2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwidHJpbSIsInN0ciIsInJlcGxhY2UiLCJpc1N0YW5kYXJkQnJvd3NlckVudiIsIm5hdmlnYXRvciIsInByb2R1Y3QiLCJsIiwidGhpc0FyZyIsIjc4OSIsIjc5MCIsImlzU2xvd0J1ZmZlciIsIl9pc0J1ZmZlciIsInJlYWRGbG9hdExFIiwiNzkxIiwiSW50ZXJjZXB0b3JNYW5hZ2VyIiwiZGlzcGF0Y2hSZXF1ZXN0IiwiaW50ZXJjZXB0b3JzIiwidG9Mb3dlckNhc2UiLCJjaGFpbiIsInVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzIiwiaW50ZXJjZXB0b3IiLCJ1bnNoaWZ0IiwiZnVsZmlsbGVkIiwicmVqZWN0ZWQiLCJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCJmb3JFYWNoTWV0aG9kTm9EYXRhIiwiZm9yRWFjaE1ldGhvZFdpdGhEYXRhIiwiNzkyIiwibm9ybWFsaXplSGVhZGVyTmFtZSIsIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwiQ29udGVudC1UeXBlIiwic2V0Q29udGVudFR5cGVJZlVuc2V0IiwiZ2V0RGVmYXVsdEFkYXB0ZXIiLCJhZGFwdGVyIiwiWE1MSHR0cFJlcXVlc3QiLCJ0cmFuc2Zvcm1SZXF1ZXN0Iiwic3RyaW5naWZ5IiwidHJhbnNmb3JtUmVzcG9uc2UiLCJ0aW1lb3V0IiwieHNyZkNvb2tpZU5hbWUiLCJ4c3JmSGVhZGVyTmFtZSIsIm1heENvbnRlbnRMZW5ndGgiLCJ2YWxpZGF0ZVN0YXR1cyIsInN0YXR1cyIsImNvbW1vbiIsIkFjY2VwdCIsIjc5MyIsIm5vcm1hbGl6ZWROYW1lIiwicHJvY2Vzc0hlYWRlciIsInRvVXBwZXJDYXNlIiwiNzk0Iiwic2V0dGxlIiwiYnVpbGRVUkwiLCJwYXJzZUhlYWRlcnMiLCJpc1VSTFNhbWVPcmlnaW4iLCJjcmVhdGVFcnJvciIsImJ0b2EiLCJ4aHJBZGFwdGVyIiwiZGlzcGF0Y2hYaHJSZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImxvYWRFdmVudCIsInhEb21haW4iLCJYRG9tYWluUmVxdWVzdCIsIm9ucHJvZ3Jlc3MiLCJoYW5kbGVQcm9ncmVzcyIsIm9udGltZW91dCIsImhhbmRsZVRpbWVvdXQiLCJhdXRoIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIkF1dGhvcml6YXRpb24iLCJvcGVuIiwicGFyYW1zIiwicGFyYW1zU2VyaWFsaXplciIsImhhbmRsZUxvYWQiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VVUkwiLCJyZXNwb25zZUhlYWRlcnMiLCJnZXRBbGxSZXNwb25zZUhlYWRlcnMiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVRleHQiLCJzdGF0dXNUZXh0IiwiaGFuZGxlRXJyb3IiLCJjb29raWVzIiwieHNyZlZhbHVlIiwid2l0aENyZWRlbnRpYWxzIiwicmVhZCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbkRvd25sb2FkUHJvZ3Jlc3MiLCJvblVwbG9hZFByb2dyZXNzIiwidXBsb2FkIiwiY2FuY2VsVG9rZW4iLCJvbkNhbmNlbGVkIiwic2VuZCIsIjc5NSIsIjc5NiIsImVuaGFuY2VFcnJvciIsImNvZGUiLCI3OTciLCI3OTgiLCJlbmNvZGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzZXJpYWxpemVkUGFyYW1zIiwicGFydHMiLCJzZXJpYWxpemUiLCJwYXJzZVZhbHVlIiwidG9JU09TdHJpbmciLCI3OTkiLCJpZ25vcmVEdXBsaWNhdGVPZiIsInBhcnNlZCIsInBhcnNlciIsImxpbmUiLCJzdWJzdHIiLCI4MDAiLCJzdGFuZGFyZEJyb3dzZXJFbnYiLCJtc2llIiwidGVzdCIsInVzZXJBZ2VudCIsInVybFBhcnNpbmdOb2RlIiwib3JpZ2luVVJMIiwicmVzb2x2ZVVSTCIsImhyZWYiLCJzZXRBdHRyaWJ1dGUiLCJwcm90b2NvbCIsImhvc3QiLCJzZWFyY2giLCJoYXNoIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJsb2NhdGlvbiIsInJlcXVlc3RVUkwiLCJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCI4MDEiLCJjaGFycyIsIkUiLCJibG9jayIsImNoYXJDb2RlIiwiaWR4IiwiY2hhckNvZGVBdCIsIjgwMiIsIndyaXRlIiwiZXhwaXJlcyIsInBhdGgiLCJkb21haW4iLCJzZWN1cmUiLCJjb29raWUiLCJEYXRlIiwidG9HTVRTdHJpbmciLCJSZWdFeHAiLCJkZWNvZGVVUklDb21wb25lbnQiLCJub3ciLCI4MDMiLCJoYW5kbGVycyIsInVzZSIsImVqZWN0IiwiZm9yRWFjaEhhbmRsZXIiLCJoIiwiODA0IiwidHJhbnNmb3JtRGF0YSIsImlzQWJzb2x1dGVVUkwiLCJjb21iaW5lVVJMcyIsInRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQiLCJ0aHJvd0lmUmVxdWVzdGVkIiwiYmFzZVVSTCIsImNsZWFuSGVhZGVyQ29uZmlnIiwib25BZGFwdGVyUmVzb2x1dGlvbiIsIm9uQWRhcHRlclJlamVjdGlvbiIsInJlYXNvbiIsIjgwNSIsImZucyIsInRyYW5zZm9ybSIsIjgwNiIsIl9fQ0FOQ0VMX18iLCI4MDciLCI4MDgiLCJyZWxhdGl2ZVVSTCIsIjgwOSIsIjgxMCIsImV4ZWN1dG9yIiwicHJvbWlzZUV4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Mkk7WUFDQSxJQUFBK3VCLFFBQUEsSUFBQTdNLFlBQUEsU0FBQTJNLFNBQUE3akM7Z0JBQ0FnVixTQUFBaFY7O1lBRUE7Z0JBQ0ErakM7Z0JBQ0EvdUI7OztRQUlBMVksT0FBQUMsVUFBQTI2Qjs7STdFNm5OTThNLEtBQ0EsU0FBVTFuQyxRQUFRQztROEV0ck54QjtRQXNCQUQsT0FBQUMsVUFBQSxTQUFBODZCLE9BQUE0TTtZQUNBLGdCQUFBalUsS0FBQTdvQjtnQkFDQSxPQUFBODhCLFNBQUFyNUIsTUFBQSxNQUFBekQiLCJmaWxlIjoidXNlclByb2plY3RzLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIndlYnBhY2tKc29ucChbMV0se1xuXG4vKioqLyAwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0dmFyIF9yZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdFxuXHR2YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblx0XG5cdHZhciBfcmVhY3REb20gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3KTtcblx0XG5cdHZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXHRcblx0dmFyIF9BcHAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNSk7XG5cdFxuXHR2YXIgX0FwcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BcHApO1xuXHRcblx0dmFyIF9yZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTk3KTtcblx0XG5cdHZhciBfcmVkdXhTYWdhID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3MzgpO1xuXHRcblx0dmFyIF9yZWR1eFNhZ2EyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVkdXhTYWdhKTtcblx0XG5cdHZhciBfcmVhY3RSZWR1eCA9IF9fd2VicGFja19yZXF1aXJlX18oMTg0KTtcblx0XG5cdHZhciBfcmVkdWNlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzU0KTtcblx0XG5cdHZhciBfc2FnYXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4NCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0Ly8gY3JlYXRlIHRoZSBzYWdhIG1pZGRsZXdhcmVcblx0Lypcblx0IEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cblx0IFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcblx0IDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuXHQgKi9cblx0XG5cdHZhciBzYWdhTWlkZGxld2FyZSA9ICgwLCBfcmVkdXhTYWdhMi5kZWZhdWx0KSgpO1xuXHRcblx0Ly8gZGV2IHRvb2xzIG1pZGRsZXdhcmVcblx0dmFyIHJlZHV4RGV2VG9vbHMgPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpO1xuXHRcblx0dmFyIHN0b3JlID0gdm9pZCAwO1xuXHRpZiAocmVkdXhEZXZUb29scykge1xuXHQgICAgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShfcmVkdWNlci5yZWR1Y2VyLCAoMCwgX3JlZHV4LmNvbXBvc2UpKCgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSksIHJlZHV4RGV2VG9vbHMpKTtcblx0fSBlbHNlIHtcblx0ICAgIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIucmVkdWNlciwgKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKHNhZ2FNaWRkbGV3YXJlKSk7XG5cdH1cblx0XG5cdHNhZ2FNaWRkbGV3YXJlLnJ1bihfc2FnYXMud2F0Y2hlclNhZ2EpO1xuXHRcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgX3JlYWN0RG9tMi5kZWZhdWx0LnJlbmRlcihfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBfcmVhY3RSZWR1eC5Qcm92aWRlcixcblx0ICAgICAgICB7IHN0b3JlOiBzdG9yZSB9LFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9BcHAyLmRlZmF1bHQsIG51bGwpXG5cdCAgICApLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJQcm9qZWN0c1wiKSk7XG5cdH0pO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzM1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cdFxuXHR2YXIgX3JlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0XG5cdHZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXHRcblx0dmFyIF9yZWFjdFJlZHV4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxODQpO1xuXHRcblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzM2KTtcblx0XG5cdHZhciBfY29uc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDczNyk7XG5cdFxuXHR2YXIgYyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb25zdCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblx0XG5cdGZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfSAvKlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHR2YXIgSXNSZXN0cmljdGVkID0gZnVuY3Rpb24gSXNSZXN0cmljdGVkKF9yZWYpIHtcblx0ICAgIHZhciBfID0gX3JlZi5fLFxuXHQgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9yZWYuaXNSZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkID0gX3JlZi5vbkNoYW5nZUlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgXCJzcGFuXCIsXG5cdCAgICAgICAgbnVsbCxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJsYWJlbFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcblx0ICAgICAgICAgICAgICAgIGlkOiBcImlzUmVzdHJpY3RlZFwiLFxuXHQgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuXHQgICAgICAgICAgICAgICAgY2hlY2tlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICAgICAgb25DaGFuZ2U6IG9uQ2hhbmdlSXNSZXN0cmljdGVkXG5cdCAgICAgICAgICAgIH0pLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge1xuXHQgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcblx0ICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IGlzUmVzdHJpY3RlZCA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpIDogXyhcInVzZXJfYWNjZXNzX3VucmVzdHJpY3RlZFwiKVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgaXNSZXN0cmljdGVkID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuXHQgICAgICAgICAgICBjbGFzc05hbWU6IFwicmVzdHJpY3RlZEluZm9cIixcblx0ICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBfKFwicmVzdHJpY3RlZF9pbmZvXCIpIH1cblx0ICAgICAgICB9KSA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwpXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIFByb2plY3QgPSBmdW5jdGlvbiBQcm9qZWN0KF9yZWYyKSB7XG5cdCAgICB2YXIgXyA9IF9yZWYyLl8sXG5cdCAgICAgICAgcHJvamVjdCA9IF9yZWYyLnByb2plY3QsXG5cdCAgICAgICAgaXNSZXN0cmljdGVkID0gX3JlZjIuaXNSZXN0cmljdGVkLFxuXHQgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkID0gX3JlZjIub25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQsXG5cdCAgICAgICAgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCA9IF9yZWYyLmZpcnN0UHJvamVjdE9mT3JnR3JvdXAsXG5cdCAgICAgICAgcm93U3BhbiA9IF9yZWYyLnJvd1NwYW4sXG5cdCAgICAgICAgb3JncyA9IF9yZWYyLm9yZ3M7XG5cdFxuXHQgICAgdmFyIHVpU2V0dGluZ3MgPSBmdW5jdGlvbiB1aVNldHRpbmdzKHByb2plY3QsIGlzUmVzdHJpY3RlZCwgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCkge1xuXHQgICAgICAgIHZhciBjaGVja2VkID0gcHJvamVjdC5hY2Nlc3MsXG5cdCAgICAgICAgICAgIGRpc2FibGVkID0gaXNSZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIixcblx0ICAgICAgICAgICAgcHJvamVjdFNlbGVjdGVkID0gY2hlY2tlZCA/IFwiIHByb2plY3RTZWxlY3RlZFwiIDogXCJcIixcblx0ICAgICAgICAgICAgdHJDbGFzc05hbWUgPSBkaXNhYmxlZCArIHByb2plY3RTZWxlY3RlZCArIChmaXJzdFByb2plY3RPZk9yZ0dyb3VwID8gXCIgYm9yZGVyLXRvcFwiIDogXCJcIiksXG5cdCAgICAgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuXHQgICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IGNoZWNrZWQsIHRyQ2xhc3NOYW1lOiB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWU6IGlkQ2xhc3NOYW1lIH07XG5cdCAgICB9O1xuXHRcblx0ICAgIHZhciBjYW5jZWxDbGljayA9IGZ1bmN0aW9uIGNhbmNlbENsaWNrKGUpIHtcblx0ICAgICAgICAvLyBDYW5jZWwgdGhlIHRyIG9uQ2xpY2sgZm9yIHRoZSBvcmcgZ3JvdXAgY2VsbFxuXHQgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICB9O1xuXHRcblx0ICAgIHZhciBfdWlTZXR0aW5ncyA9IHVpU2V0dGluZ3MocHJvamVjdCwgaXNSZXN0cmljdGVkLCBmaXJzdFByb2plY3RPZk9yZ0dyb3VwKSxcblx0ICAgICAgICBjaGVja2VkID0gX3VpU2V0dGluZ3MuY2hlY2tlZCxcblx0ICAgICAgICB0ckNsYXNzTmFtZSA9IF91aVNldHRpbmdzLnRyQ2xhc3NOYW1lLFxuXHQgICAgICAgIGlkQ2xhc3NOYW1lID0gX3VpU2V0dGluZ3MuaWRDbGFzc05hbWU7XG5cdFxuXHQgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwidHJcIixcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkLFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IHRyQ2xhc3NOYW1lXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJib3JkZXItbGVmdFwiIH0sXG5cdCAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1xuXHQgICAgICAgICAgICAgICAgaWQ6IHByb2plY3QuaWQsXG5cdCAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXG5cdCAgICAgICAgICAgICAgICBjaGVja2VkOiBjaGVja2VkLFxuXHQgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICFpc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICByZWFkT25seTogdHJ1ZVxuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgICksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgeyBjbGFzc05hbWU6IGlkQ2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgIHByb2plY3QuaWRcblx0ICAgICAgICApLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcInRkXCIsXG5cdCAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgIHByb2plY3QudGl0bGUgfHwgXyhcIm5vX3RpdGxlXCIpXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgXCJ0ZFwiLFxuXHQgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICBwcm9qZWN0LnN1YnRpdGxlXG5cdCAgICAgICAgKSxcblx0ICAgICAgICBmaXJzdFByb2plY3RPZk9yZ0dyb3VwID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGRcIixcblx0ICAgICAgICAgICAgeyBjbGFzc05hbWU6IFwiYm9yZGVyXCIsIHJvd1NwYW46IHJvd1NwYW4sIG9uQ2xpY2s6IGNhbmNlbENsaWNrIH0sXG5cdCAgICAgICAgICAgIG9yZ3Ncblx0ICAgICAgICApIDogbnVsbFxuXHQgICAgKTtcblx0fTtcblx0XG5cdHZhciBTZWxlY3RBbGwgPSBmdW5jdGlvbiBTZWxlY3RBbGwoX3JlZjMpIHtcblx0ICAgIHZhciBfID0gX3JlZjMuXyxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmMy5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsID0gX3JlZjMub25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLFxuXHQgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9yZWYzLmlzUmVzdHJpY3RlZDtcblx0XG5cdCAgICB2YXIgdWlTZXR0aW5ncyA9IGZ1bmN0aW9uIHVpU2V0dGluZ3MoaXNSZXN0cmljdGVkKSB7XG5cdCAgICAgICAgdmFyIGJ1dHRvbkNsYXNzID0gXCJzZWxlY3RBbGxQcm9qZWN0c1wiICsgKGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcIiBkaXNhYmxlZFwiKSxcblx0ICAgICAgICAgICAgZGlzYWJsZWQgPSAhaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBkaXZDbGFzcyA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG5cdCAgICAgICAgcmV0dXJuIHsgYnV0dG9uQ2xhc3M6IGJ1dHRvbkNsYXNzLCBkaXNhYmxlZDogZGlzYWJsZWQsIGRpdkNsYXNzOiBkaXZDbGFzcyB9O1xuXHQgICAgfTtcblx0XG5cdCAgICB2YXIgX3VpU2V0dGluZ3MyID0gdWlTZXR0aW5ncyhpc1Jlc3RyaWN0ZWQpLFxuXHQgICAgICAgIGRpdkNsYXNzID0gX3VpU2V0dGluZ3MyLmRpdkNsYXNzLFxuXHQgICAgICAgIGRpc2FibGVkID0gX3VpU2V0dGluZ3MyLmRpc2FibGVkLFxuXHQgICAgICAgIGJ1dHRvbkNsYXNzID0gX3VpU2V0dGluZ3MyLmJ1dHRvbkNsYXNzO1xuXHRcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcImRpdlwiLFxuXHQgICAgICAgIHsgY2xhc3NOYW1lOiBkaXZDbGFzcyB9LFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICBcImJ1dHRvblwiLFxuXHQgICAgICAgICAgICB7IG9uQ2xpY2s6IG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCwgZGlzYWJsZWQ6IGRpc2FibGVkLCBjbGFzc05hbWU6IGJ1dHRvbkNsYXNzIH0sXG5cdCAgICAgICAgICAgIHNlbGVjdEFsbCA/IF8oXCJjaGVja19hbGxfcHJvamVjdHNcIikgOiBfKFwidW5jaGVja19hbGxfcHJvamVjdHNcIilcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEVycm9yID0gZnVuY3Rpb24gRXJyb3IoX3JlZjQpIHtcblx0ICAgIHZhciBfID0gX3JlZjQuXyxcblx0ICAgICAgICBlcnJvciA9IF9yZWY0LmVycm9yO1xuXHRcblx0ICAgIHJldHVybiBlcnJvciA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgIFwiZGl2XCIsXG5cdCAgICAgICAgeyBjbGFzc05hbWU6IFwiZXJyb3JcIiB9LFxuXHQgICAgICAgIF8oXCJhbl9lcnJvcl9vY2N1cmVkXCIpICsgZXJyb3IubWVzc2FnZVxuXHQgICAgKSA6IG51bGw7XG5cdH07XG5cdFxuXHR2YXIgUHJvamVjdHMgPSBmdW5jdGlvbiBQcm9qZWN0cyhfcmVmNSkge1xuXHQgICAgdmFyIF8gPSBfcmVmNS5fLFxuXHQgICAgICAgIGVycm9yID0gX3JlZjUuZXJyb3IsXG5cdCAgICAgICAgZ3JvdXBlZFByb2plY3RzID0gX3JlZjUuZ3JvdXBlZFByb2plY3RzLFxuXHQgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9yZWY1LmlzUmVzdHJpY3RlZCxcblx0ICAgICAgICBzZWxlY3RBbGwgPSBfcmVmNS5zZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQgPSBfcmVmNS5vbkNoYW5nZUlzUmVzdHJpY3RlZCxcblx0ICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwgPSBfcmVmNS5vbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQgPSBfcmVmNS5vbkNoYW5nZVByb2plY3RTZWxlY3RlZDtcblx0XG5cdCAgICB2YXIgY2xhc3NOYW1lID0gaXNSZXN0cmljdGVkID8gXCJcIiA6IFwiZGlzYWJsZWRcIjtcblx0ICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICBcInNwYW5cIixcblx0ICAgICAgICBudWxsLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEVycm9yLCB7IF86IF8sIGVycm9yOiBlcnJvciB9KSxcblx0ICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChJc1Jlc3RyaWN0ZWQsIHtcblx0ICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgaXNSZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkOiBvbkNoYW5nZUlzUmVzdHJpY3RlZFxuXHQgICAgICAgIH0pLFxuXHQgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFNlbGVjdEFsbCwge1xuXHQgICAgICAgICAgICBfOiBfLFxuXHQgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsOiBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSksXG5cdCAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgIFwidGFibGVcIixcblx0ICAgICAgICAgICAgbnVsbCxcblx0ICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICBcInRoZWFkXCIsXG5cdCAgICAgICAgICAgICAgICBudWxsLFxuXHQgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgXCJ0clwiLFxuXHQgICAgICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwidGhcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfKFwiYWNjZXNzXCIpXG5cdCAgICAgICAgICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJwcm9qZWN0X2lkXCIpXG5cdCAgICAgICAgICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF8oXCJwcm9qZWN0X3RpdGxlXCIpXG5cdCAgICAgICAgICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwiUHJvamVjdCBzdWJ0aXRsZVwiXG5cdCAgICAgICAgICAgICAgICAgICAgKSxcblx0ICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aFwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIFwiTWFuYWdpbmcgb3JnYW5pc2F0aW9uc1wiXG5cdCAgICAgICAgICAgICAgICAgICAgKVxuXHQgICAgICAgICAgICAgICAgKVxuXHQgICAgICAgICAgICApLFxuXHQgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcblx0ICAgICAgICAgICAgICAgIFwidGJvZHlcIixcblx0ICAgICAgICAgICAgICAgIG51bGwsXG5cdCAgICAgICAgICAgICAgICBncm91cGVkUHJvamVjdHMubWFwKGZ1bmN0aW9uIChncm91cCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByb3dTcGFuID0gZ3JvdXAucHJvamVjdHMubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwLnByb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCA9IGZpcnN0O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvamVjdCwge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgXzogXyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcHJvamVjdC5pZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3QsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiBvbkNoYW5nZVByb2plY3RTZWxlY3RlZCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UHJvamVjdE9mT3JnR3JvdXA6IGZpcnN0UHJvamVjdE9mT3JnR3JvdXAsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTcGFuOiByb3dTcGFuLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnczogZ3JvdXAub3JnYW5pc2F0aW9uc1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgICAgIClcblx0ICAgICAgICApXG5cdCAgICApO1xuXHR9O1xuXHRcblx0dmFyIEFwcCA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG5cdCAgICBfaW5oZXJpdHMoQXBwLCBfUmVhY3QkQ29tcG9uZW50KTtcblx0XG5cdCAgICBmdW5jdGlvbiBBcHAocHJvcHMpIHtcblx0ICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXBwKTtcblx0XG5cdCAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEFwcC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEFwcCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblx0XG5cdCAgICAgICAgX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkID0gX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkLmJpbmQoX3RoaXMpO1xuXHQgICAgICAgIF90aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZCA9IF90aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsID0gX3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbC5iaW5kKF90aGlzKTtcblx0ICAgICAgICBfdGhpcy5fID0gX3RoaXMuXy5iaW5kKF90aGlzKTtcblx0ICAgICAgICByZXR1cm4gX3RoaXM7XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gVHJhbnNsYXRpb24gaGFuZGxpbmdcblx0XG5cdFxuXHQgICAgX2NyZWF0ZUNsYXNzKEFwcCwgW3tcblx0ICAgICAgICBrZXk6IFwiX1wiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfKHMpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc3RyaW5ncyAmJiB0aGlzLnByb3BzLnN0cmluZ3Nbc107XG5cdCAgICAgICAgfVxuXHQgICAgfSwge1xuXHQgICAgICAgIGtleTogXCJ0b2dnbGVJc1Jlc3RyaWN0ZWRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlSXNSZXN0cmljdGVkKGUpIHtcblx0ICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZUlzUmVzdHJpY3RlZChlLnRhcmdldC5jaGVja2VkKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZVByb2plY3RTZWxlY3RBbGxcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUHJvamVjdFNlbGVjdEFsbChlKSB7XG5cdCAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVTZWxlY3RBbGwoKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInRvZ2dsZVByb2plY3RTZWxlY3RlZFwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVQcm9qZWN0U2VsZWN0ZWQoZSkge1xuXHQgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuXHQgICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKSkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKGlkKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIHtcblx0ICAgICAgICBrZXk6IFwiY29tcG9uZW50RGlkTW91bnRcIixcblx0ICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdCAgICAgICAgICAgIHZhciB1c2VySWQgPSAoMCwgX3V0aWxzLmRhdGFGcm9tRWxlbWVudCkoXCJ1c2VyLXRvLXJlc3RyaWN0XCIpLmlkO1xuXHQgICAgICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgdXNlcklkOiB1c2VySWQgfSk7XG5cdFxuXHQgICAgICAgICAgICB2YXIgc3RyaW5ncyA9ICgwLCBfdXRpbHMuZGF0YUZyb21FbGVtZW50KShcInVzZXItcHJvamVjdHMtdGV4dFwiKTtcblx0ICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHN0cmluZ3M6IHN0cmluZ3MgfSk7XG5cdFxuXHQgICAgICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcblx0ICAgICAgICB9XG5cdCAgICB9LCB7XG5cdCAgICAgICAga2V5OiBcInJlbmRlclwiLFxuXHQgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdCAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzLFxuXHQgICAgICAgICAgICAgICAgcHJvamVjdHNMb2FkZWQgPSBfcHJvcHMucHJvamVjdHNMb2FkZWQsXG5cdCAgICAgICAgICAgICAgICBzZWxlY3RBbGwgPSBfcHJvcHMuc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzID0gX3Byb3BzLmdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9wcm9wcy5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBlcnJvciA9IF9wcm9wcy5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgIHJldHVybiBwcm9qZWN0c0xvYWRlZCA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFByb2plY3RzLCB7XG5cdCAgICAgICAgICAgICAgICBfOiB0aGlzLl8sXG5cdCAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG5cdCAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuXHQgICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzOiBncm91cGVkUHJvamVjdHMsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZUlzUmVzdHJpY3RlZDogdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw6IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbCxcblx0ICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkOiB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZFxuXHQgICAgICAgICAgICB9KSA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuXHQgICAgICAgICAgICAgICAgXCJkaXZcIixcblx0ICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBcImxvYWRpbmdcIiB9LFxuXHQgICAgICAgICAgICAgICAgdGhpcy5fKCdsb2FkaW5nJyksXG5cdCAgICAgICAgICAgICAgICBcIiBcIixcblx0ICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiB9KVxuXHQgICAgICAgICAgICApO1xuXHQgICAgICAgIH1cblx0ICAgIH1dKTtcblx0XG5cdCAgICByZXR1cm4gQXBwO1xuXHR9KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXHRcblx0dmFyIG1hcFN0YXRlVG9Qcm9wcyA9IGZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuXHQgICAgdmFyIHByb2plY3RzTG9hZGVkID0gc3RhdGUucHJvamVjdHNMb2FkZWQsXG5cdCAgICAgICAgZmV0Y2hpbmcgPSBzdGF0ZS5mZXRjaGluZyxcblx0ICAgICAgICBlcnJvciA9IHN0YXRlLmVycm9yLFxuXHQgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IHN0YXRlLmdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBzdGF0ZS5pc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgc2VsZWN0QWxsID0gc3RhdGUuc2VsZWN0QWxsLFxuXHQgICAgICAgIHN0cmluZ3MgPSBzdGF0ZS5zdHJpbmdzO1xuXHRcblx0ICAgIHJldHVybiB7IHByb2plY3RzTG9hZGVkOiBwcm9qZWN0c0xvYWRlZCwgZmV0Y2hpbmc6IGZldGNoaW5nLCBlcnJvcjogZXJyb3IsIGdyb3VwZWRQcm9qZWN0czogZ3JvdXBlZFByb2plY3RzLCBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCwgc2VsZWN0QWxsOiBzZWxlY3RBbGwsIHN0cmluZ3M6IHN0cmluZ3MgfTtcblx0fTtcblx0XG5cdHZhciBtYXBEaXNwYXRjaFRvUHJvcHMgPSBmdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgICAgb25GZXRjaFVzZXJQcm9qZWN0czogZnVuY3Rpb24gb25GZXRjaFVzZXJQcm9qZWN0cyh1c2VySWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VySWQ6IHVzZXJJZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgc2V0U3RvcmU6IGZ1bmN0aW9uIHNldFN0b3JlKGRhdGEpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoKHtcblx0ICAgICAgICAgICAgICAgIHR5cGU6IGMuU0VUX1NUT1JFLFxuXHQgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbjogZnVuY3Rpb24gb25VcGRhdGVQcm9qZWN0U2VsZWN0aW9uKHByb2plY3RJZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuXHQgICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sXG5cdCAgICAgICAgICAgICAgICBkYXRhOiB7IHByb2plY3RJZDogcHJvamVjdElkIH1cblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogZnVuY3Rpb24gb25VcGRhdGVJc1Jlc3RyaWN0ZWQoaXNSZXN0cmljdGVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG5cdCAgICAgICAgICAgICAgICB0eXBlOiBjLlVQREFURV9JU19SRVNUUklDVEVELFxuXHQgICAgICAgICAgICAgICAgZGF0YTogeyBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6IGZ1bmN0aW9uIG9uVXBkYXRlU2VsZWN0QWxsKCkge1xuXHQgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goeyB0eXBlOiBjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTIH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEFwcCk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3MzY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICAgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHQvKlxuXHQgICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuXHQgICAgU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcblx0ICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuXHQgICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG5cdCAqL1xuXHRcblx0dmFyIGVuZHBvaW50cyA9IGV4cG9ydHMuZW5kcG9pbnRzID0ge1xuXHQgICAgdXNlcl9wcm9qZWN0c19hY2Nlc3M6IGZ1bmN0aW9uIHVzZXJfcHJvamVjdHNfYWNjZXNzKGlkKSB7XG5cdCAgICAgICAgcmV0dXJuIFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyBpZCArIFwiLz9mb3JtYXQ9anNvblwiO1xuXHQgICAgfVxuXHR9O1xuXHRcblx0dmFyIGluQXJyYXkgPSBleHBvcnRzLmluQXJyYXkgPSBmdW5jdGlvbiBpbkFycmF5KG9iaiwgYXJyKSB7XG5cdCAgICByZXR1cm4gYXJyICYmIGFyci5pbmRleE9mKG9iaikgIT09IC0xO1xuXHR9O1xuXHRcblx0dmFyIGRhdGFGcm9tRWxlbWVudCA9IGV4cG9ydHMuZGF0YUZyb21FbGVtZW50ID0gZnVuY3Rpb24gZGF0YUZyb21FbGVtZW50KGVsZW1lbnROYW1lKSB7XG5cdCAgICByZXR1cm4gSlNPTi5wYXJzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkuaW5uZXJIVE1MKTtcblx0fTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczNzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdC8qXG5cdCAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICovXG5cdFxuXHQvLyBhY3Rpb24gdHlwZXNcblx0dmFyIC8vXG5cdFNFVF9TVE9SRSA9IGV4cG9ydHMuU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcblx0XG5cdC8vXG5cdEFQSV9HRVRfSU5JVCA9IGV4cG9ydHMuQVBJX0dFVF9JTklUID0gXCJBUElfR0VUX0lOSVRcIixcblx0ICAgIEFQSV9HRVRfU1VDQ0VTUyA9IGV4cG9ydHMuQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcblx0ICAgIEFQSV9HRVRfRkFJTFVSRSA9IGV4cG9ydHMuQVBJX0dFVF9GQUlMVVJFID0gXCJBUElfR0VUX0ZBSUxVUkVcIixcblx0XG5cdC8vXG5cdEFQSV9QVVRfSU5JVCA9IGV4cG9ydHMuQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcblx0ICAgIEFQSV9QVVRfU1VDQ0VTUyA9IGV4cG9ydHMuQVBJX1BVVF9TVUNDRVNTID0gXCJBUElfUFVUX1NVQ0NFU1NcIixcblx0ICAgIEFQSV9QVVRfRkFJTFVSRSA9IGV4cG9ydHMuQVBJX1BVVF9GQUlMVVJFID0gXCJBUElfUFVUX0ZBSUxVUkVcIixcblx0XG5cdC8vXG5cdFVQREFURV9QUk9KRUNUX1NFTEVDVElPTiA9IGV4cG9ydHMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OID0gXCJVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT05cIixcblx0ICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gZXhwb3J0cy5VUERBVEVfSVNfUkVTVFJJQ1RFRCA9IFwiVVBEQVRFX0lTX1JFU1RSSUNURURcIixcblx0ICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gZXhwb3J0cy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyA9IFwiVVBEQVRFX1NFTEVDVF9BTExfUFJPSkVDVFNcIjtcblxuLyoqKi8gfSksXG5cbi8qKiovIDczODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzM5KTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Nyk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0VORCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9jaGFubmVsLkVORDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2V2ZW50Q2hhbm5lbCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9jaGFubmVsLmV2ZW50Q2hhbm5lbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NoYW5uZWwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfY2hhbm5lbC5jaGFubmVsO1xuXHQgIH1cblx0fSk7XG5cdFxuXHR2YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDgpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdidWZmZXJzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2J1ZmZlcnMuYnVmZmVycztcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9zYWdhSGVscGVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VFdmVyeScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlRXZlcnk7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlTGF0ZXN0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3Q7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0aHJvdHRsZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9zYWdhSGVscGVycy50aHJvdHRsZTtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlbGF5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLmRlbGF5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0FOQ0VMJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLkNBTkNFTDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RldGFjaCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5kZXRhY2g7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfbWlkZGxld2FyZSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MSk7XG5cdFxuXHR2YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUyKTtcblx0XG5cdHZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblx0XG5cdHZhciBfdXRpbHMyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzUzKTtcblx0XG5cdHZhciB1dGlscyA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMyKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gX21pZGRsZXdhcmUyLmRlZmF1bHQ7XG5cdGV4cG9ydHMuZWZmZWN0cyA9IGVmZmVjdHM7XG5cdGV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuLyoqKi8gfSksXG5cbi8qKiovIDczOTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucnVuU2FnYSA9IHJ1blNhZ2E7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfcHJvYyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MSk7XG5cdFxuXHR2YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBSVU5fU0FHQV9TSUdOQVRVUkUgPSAncnVuU2FnYShzdG9yZUludGVyZmFjZSwgc2FnYSwgLi4uYXJncyknO1xuXHR2YXIgTk9OX0dFTkVSQVRPUl9FUlIgPSBSVU5fU0FHQV9TSUdOQVRVUkUgKyAnOiBzYWdhIGFyZ3VtZW50IG11c3QgYmUgYSBHZW5lcmF0b3IgZnVuY3Rpb24hJztcblx0XG5cdGZ1bmN0aW9uIHJ1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXHRcblx0ICBpZiAoX3V0aWxzLmlzLml0ZXJhdG9yKHN0b3JlSW50ZXJmYWNlKSkge1xuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG5cdCAgICAgICgwLCBfdXRpbHMubG9nKSgnd2FybicsICdydW5TYWdhKGl0ZXJhdG9yLCBzdG9yZUludGVyZmFjZSkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgUlVOX1NBR0FfU0lHTkFUVVJFKTtcblx0ICAgIH1cblx0ICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG5cdCAgICBzdG9yZUludGVyZmFjZSA9IHNhZ2E7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG5cdCAgICBpdGVyYXRvciA9IHNhZ2EuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PTl9HRU5FUkFUT1JfRVJSKTtcblx0ICB9XG5cdFxuXHQgIHZhciBfc3RvcmVJbnRlcmZhY2UgPSBzdG9yZUludGVyZmFjZSxcblx0ICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcblx0ICAgICAgZGlzcGF0Y2ggPSBfc3RvcmVJbnRlcmZhY2UuZGlzcGF0Y2gsXG5cdCAgICAgIGdldFN0YXRlID0gX3N0b3JlSW50ZXJmYWNlLmdldFN0YXRlLFxuXHQgICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG5cdCAgICAgIHNhZ2FNb25pdG9yID0gX3N0b3JlSW50ZXJmYWNlLnNhZ2FNb25pdG9yLFxuXHQgICAgICBsb2dnZXIgPSBfc3RvcmVJbnRlcmZhY2UubG9nZ2VyLFxuXHQgICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cdFxuXHRcblx0ICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblx0XG5cdCAgaWYgKHNhZ2FNb25pdG9yKSB7XG5cdCAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCB8fCBfdXRpbHMubm9vcDtcblx0ICAgIHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkID0gc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgfHwgX3V0aWxzLm5vb3A7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkID0gc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkIHx8IF91dGlscy5ub29wO1xuXHQgICAgc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCA9IHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQgfHwgX3V0aWxzLm5vb3A7XG5cdFxuXHQgICAgc2FnYU1vbml0b3IuZWZmZWN0VHJpZ2dlcmVkKHsgZWZmZWN0SWQ6IGVmZmVjdElkLCByb290OiB0cnVlLCBwYXJlbnRFZmZlY3RJZDogMCwgZWZmZWN0OiB7IHJvb3Q6IHRydWUsIHNhZ2E6IHNhZ2EsIGFyZ3M6IGFyZ3MgfSB9KTtcblx0ICB9XG5cdFxuXHQgIHZhciB0YXNrID0gKDAsIF9wcm9jMi5kZWZhdWx0KShpdGVyYXRvciwgc3Vic2NyaWJlLCAoMCwgX3V0aWxzLndyYXBTYWdhRGlzcGF0Y2gpKGRpc3BhdGNoKSwgZ2V0U3RhdGUsIGNvbnRleHQsIHsgc2FnYU1vbml0b3I6IHNhZ2FNb25pdG9yLCBsb2dnZXI6IGxvZ2dlciwgb25FcnJvcjogb25FcnJvciB9LCBlZmZlY3RJZCwgc2FnYS5uYW1lKTtcblx0XG5cdCAgaWYgKHNhZ2FNb25pdG9yKSB7XG5cdCAgICBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgdGFzayk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gdGFzaztcblx0fVxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdGV4cG9ydHMuY2hlY2sgPSBjaGVjaztcblx0ZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5cdGV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuXHRleHBvcnRzLmRlZmVycmVkID0gZGVmZXJyZWQ7XG5cdGV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuXHRleHBvcnRzLmRlbGF5ID0gZGVsYXk7XG5cdGV4cG9ydHMuY3JlYXRlTW9ja1Rhc2sgPSBjcmVhdGVNb2NrVGFzaztcblx0ZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcblx0ZXhwb3J0cy5tYWtlSXRlcmF0b3IgPSBtYWtlSXRlcmF0b3I7XG5cdGV4cG9ydHMubG9nID0gbG9nO1xuXHRleHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcblx0dmFyIHN5bSA9IGV4cG9ydHMuc3ltID0gZnVuY3Rpb24gc3ltKGlkKSB7XG5cdCAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvJyArIGlkO1xuXHR9O1xuXHRcblx0dmFyIFRBU0sgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5UQVNLID0gc3ltKCdUQVNLJyk7XG5cdHZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xuXHR2YXIgTUFUQ0ggPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5NQVRDSCA9IHN5bSgnTUFUQ0gnKTtcblx0dmFyIENBTkNFTCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLkNBTkNFTCA9IHN5bSgnQ0FOQ0VMX1BST01JU0UnKTtcblx0dmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG5cdHZhciBTRUxGX0NBTkNFTExBVElPTiA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlNFTEZfQ0FOQ0VMTEFUSU9OID0gc3ltKCdTRUxGX0NBTkNFTExBVElPTicpO1xuXHR2YXIga29uc3QgPSBleHBvcnRzLmtvbnN0ID0gZnVuY3Rpb24ga29uc3Qodikge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdjtcblx0ICB9O1xuXHR9O1xuXHR2YXIga1RydWUgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rVHJ1ZSA9IGtvbnN0KHRydWUpO1xuXHR2YXIga0ZhbHNlID0gLyojX19QVVJFX18qL2V4cG9ydHMua0ZhbHNlID0ga29uc3QoZmFsc2UpO1xuXHR2YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblx0dmFyIGlkZW50ID0gZXhwb3J0cy5pZGVudCA9IGZ1bmN0aW9uIGlkZW50KHYpIHtcblx0ICByZXR1cm4gdjtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIGNoZWNrKHZhbHVlLCBwcmVkaWNhdGUsIGVycm9yKSB7XG5cdCAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG5cdCAgICBsb2coJ2Vycm9yJywgJ3VuY2F1Z2h0IGF0IGNoZWNrJywgZXJyb3IpO1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblx0ICB9XG5cdH1cblx0XG5cdHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cdGZ1bmN0aW9uIGhhc093bihvYmplY3QsIHByb3BlcnR5KSB7XG5cdCAgcmV0dXJuIGlzLm5vdFVuZGVmKG9iamVjdCkgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcblx0fVxuXHRcblx0dmFyIGlzID0gZXhwb3J0cy5pcyA9IHtcblx0ICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuXHQgICAgcmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkO1xuXHQgIH0sXG5cdCAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcblx0ICAgIHJldHVybiB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcblx0ICB9LFxuXHQgIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuXHQgICAgcmV0dXJuIHR5cGVvZiBmID09PSAnZnVuY3Rpb24nO1xuXHQgIH0sXG5cdCAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuXHQgICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJztcblx0ICB9LFxuXHQgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZyc7XG5cdCAgfSxcblx0ICBhcnJheTogQXJyYXkuaXNBcnJheSxcblx0ICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdChvYmopIHtcblx0ICAgIHJldHVybiBvYmogJiYgIWlzLmFycmF5KG9iaikgJiYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG9iaikpID09PSAnb2JqZWN0Jztcblx0ICB9LFxuXHQgIHByb21pc2U6IGZ1bmN0aW9uIHByb21pc2UocCkge1xuXHQgICAgcmV0dXJuIHAgJiYgaXMuZnVuYyhwLnRoZW4pO1xuXHQgIH0sXG5cdCAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGl0KSB7XG5cdCAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhpdC5uZXh0KSAmJiBpcy5mdW5jKGl0LnRocm93KTtcblx0ICB9LFxuXHQgIGl0ZXJhYmxlOiBmdW5jdGlvbiBpdGVyYWJsZShpdCkge1xuXHQgICAgcmV0dXJuIGl0ICYmIGlzLmZ1bmMoU3ltYm9sKSA/IGlzLmZ1bmMoaXRbU3ltYm9sLml0ZXJhdG9yXSkgOiBpcy5hcnJheShpdCk7XG5cdCAgfSxcblx0ICB0YXNrOiBmdW5jdGlvbiB0YXNrKHQpIHtcblx0ICAgIHJldHVybiB0ICYmIHRbVEFTS107XG5cdCAgfSxcblx0ICBvYnNlcnZhYmxlOiBmdW5jdGlvbiBvYnNlcnZhYmxlKG9iKSB7XG5cdCAgICByZXR1cm4gb2IgJiYgaXMuZnVuYyhvYi5zdWJzY3JpYmUpO1xuXHQgIH0sXG5cdCAgYnVmZmVyOiBmdW5jdGlvbiBidWZmZXIoYnVmKSB7XG5cdCAgICByZXR1cm4gYnVmICYmIGlzLmZ1bmMoYnVmLmlzRW1wdHkpICYmIGlzLmZ1bmMoYnVmLnRha2UpICYmIGlzLmZ1bmMoYnVmLnB1dCk7XG5cdCAgfSxcblx0ICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKHBhdCkge1xuXHQgICAgcmV0dXJuIHBhdCAmJiAoaXMuc3RyaW5nKHBhdCkgfHwgKHR5cGVvZiBwYXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhdCkpID09PSAnc3ltYm9sJyB8fCBpcy5mdW5jKHBhdCkgfHwgaXMuYXJyYXkocGF0KSk7XG5cdCAgfSxcblx0ICBjaGFubmVsOiBmdW5jdGlvbiBjaGFubmVsKGNoKSB7XG5cdCAgICByZXR1cm4gY2ggJiYgaXMuZnVuYyhjaC50YWtlKSAmJiBpcy5mdW5jKGNoLmNsb3NlKTtcblx0ICB9LFxuXHQgIGhlbHBlcjogZnVuY3Rpb24gaGVscGVyKGl0KSB7XG5cdCAgICByZXR1cm4gaXQgJiYgaXRbSEVMUEVSXTtcblx0ICB9LFxuXHQgIHN0cmluZ2FibGVGdW5jOiBmdW5jdGlvbiBzdHJpbmdhYmxlRnVuYyhmKSB7XG5cdCAgICByZXR1cm4gaXMuZnVuYyhmKSAmJiBoYXNPd24oZiwgJ3RvU3RyaW5nJyk7XG5cdCAgfVxuXHR9O1xuXHRcblx0dmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuXHQgIGFzc2lnbjogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG5cdCAgICBmb3IgKHZhciBpIGluIHNvdXJjZSkge1xuXHQgICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcblx0ICAgICAgICB0YXJnZXRbaV0gPSBzb3VyY2VbaV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcblx0ICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXHQgIGlmIChpbmRleCA+PSAwKSB7XG5cdCAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgIH1cblx0fVxuXHRcblx0dmFyIGFycmF5ID0gZXhwb3J0cy5hcnJheSA9IHtcblx0ICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuXHQgICAgdmFyIGFyciA9IEFycmF5KG9iai5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSBpbiBvYmopIHtcblx0ICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG5cdCAgICAgICAgYXJyW2ldID0gb2JqW2ldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gYXJyO1xuXHQgIH1cblx0fTtcblx0XG5cdGZ1bmN0aW9uIGRlZmVycmVkKCkge1xuXHQgIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cdFxuXHQgIHZhciBkZWYgPSBfZXh0ZW5kcyh7fSwgcHJvcHMpO1xuXHQgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgZGVmLnJlc29sdmUgPSByZXNvbHZlO1xuXHQgICAgZGVmLnJlamVjdCA9IHJlamVjdDtcblx0ICB9KTtcblx0ICBkZWYucHJvbWlzZSA9IHByb21pc2U7XG5cdCAgcmV0dXJuIGRlZjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gYXJyYXlPZkRlZmZlcmVkKGxlbmd0aCkge1xuXHQgIHZhciBhcnIgPSBbXTtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdCAgICBhcnIucHVzaChkZWZlcnJlZCgpKTtcblx0ICB9XG5cdCAgcmV0dXJuIGFycjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZGVsYXkobXMpIHtcblx0ICB2YXIgdmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXHRcblx0ICB2YXIgdGltZW91dElkID0gdm9pZCAwO1xuXHQgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0ICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gcmVzb2x2ZSh2YWwpO1xuXHQgICAgfSwgbXMpO1xuXHQgIH0pO1xuXHRcblx0ICBwcm9taXNlW0NBTkNFTF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuIHByb21pc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuXHQgIHZhciBfcmVmO1xuXHRcblx0ICB2YXIgcnVubmluZyA9IHRydWU7XG5cdCAgdmFyIF9yZXN1bHQgPSB2b2lkIDAsXG5cdCAgICAgIF9lcnJvciA9IHZvaWQgMDtcblx0XG5cdCAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltUQVNLXSA9IHRydWUsIF9yZWYuaXNSdW5uaW5nID0gZnVuY3Rpb24gaXNSdW5uaW5nKCkge1xuXHQgICAgcmV0dXJuIHJ1bm5pbmc7XG5cdCAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG5cdCAgICByZXR1cm4gX3Jlc3VsdDtcblx0ICB9LCBfcmVmLmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICByZXR1cm4gX2Vycm9yO1xuXHQgIH0sIF9yZWYuc2V0UnVubmluZyA9IGZ1bmN0aW9uIHNldFJ1bm5pbmcoYikge1xuXHQgICAgcmV0dXJuIHJ1bm5pbmcgPSBiO1xuXHQgIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcblx0ICAgIHJldHVybiBfcmVzdWx0ID0gcjtcblx0ICB9LCBfcmVmLnNldEVycm9yID0gZnVuY3Rpb24gc2V0RXJyb3IoZSkge1xuXHQgICAgcmV0dXJuIF9lcnJvciA9IGU7XG5cdCAgfSwgX3JlZjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gYXV0b0luYygpIHtcblx0ICB2YXIgc2VlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiArK3NlZWQ7XG5cdCAgfTtcblx0fVxuXHRcblx0dmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblx0XG5cdHZhciBrVGhyb3cgPSBmdW5jdGlvbiBrVGhyb3coZXJyKSB7XG5cdCAgdGhyb3cgZXJyO1xuXHR9O1xuXHR2YXIga1JldHVybiA9IGZ1bmN0aW9uIGtSZXR1cm4odmFsdWUpIHtcblx0ICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcblx0fTtcblx0ZnVuY3Rpb24gbWFrZUl0ZXJhdG9yKG5leHQpIHtcblx0ICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuXHQgIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblx0ICB2YXIgaXNIZWxwZXIgPSBhcmd1bWVudHNbM107XG5cdFxuXHQgIHZhciBpdGVyYXRvciA9IHsgbmFtZTogbmFtZSwgbmV4dDogbmV4dCwgdGhyb3c6IHRocm8sIHJldHVybjoga1JldHVybiB9O1xuXHRcblx0ICBpZiAoaXNIZWxwZXIpIHtcblx0ICAgIGl0ZXJhdG9yW0hFTFBFUl0gPSB0cnVlO1xuXHQgIH1cblx0ICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvcjtcblx0ICAgIH07XG5cdCAgfVxuXHQgIHJldHVybiBpdGVyYXRvcjtcblx0fVxuXHRcblx0LyoqXG5cdCAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG5cdCAgKHdpdGggZXhwYW5kYWJsZSBlcnJvciBzdGFjayB0cmFjZXMpLCBvciBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnRcblx0ICAodGV4dC1vbmx5IGxvZyBvdXRwdXQpXG5cdCAqKi9cblx0ZnVuY3Rpb24gbG9nKGxldmVsLCBtZXNzYWdlKSB7XG5cdCAgdmFyIGVycm9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblx0XG5cdCAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cblx0ICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgY29uc29sZVtsZXZlbF0obWVzc2FnZSwgZXJyb3IpO1xuXHQgIH1cblx0fVxuXHRcblx0ZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSBsb2coJ3dhcm4nLCBkZXByZWNhdGlvbldhcm5pbmcpO1xuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9XG5cdFxuXHR2YXIgdXBkYXRlSW5jZW50aXZlID0gZXhwb3J0cy51cGRhdGVJbmNlbnRpdmUgPSBmdW5jdGlvbiB1cGRhdGVJbmNlbnRpdmUoZGVwcmVjYXRlZCwgcHJlZmVycmVkKSB7XG5cdCAgcmV0dXJuIGRlcHJlY2F0ZWQgKyAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIHByZWZlcnJlZCArICcsIHBsZWFzZSB1cGRhdGUgeW91ciBjb2RlJztcblx0fTtcblx0XG5cdHZhciBpbnRlcm5hbEVyciA9IGV4cG9ydHMuaW50ZXJuYWxFcnIgPSBmdW5jdGlvbiBpbnRlcm5hbEVycihlcnIpIHtcblx0ICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xuXHR9O1xuXHRcblx0dmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcblx0ICByZXR1cm4gKGN0eCA/IGN0eCArICcuJyA6ICcnKSArICdzZXRDb250ZXh0KHByb3BzKTogYXJndW1lbnQgJyArIHByb3BzICsgJyBpcyBub3QgYSBwbGFpbiBvYmplY3QnO1xuXHR9O1xuXHRcblx0dmFyIHdyYXBTYWdhRGlzcGF0Y2ggPSBleHBvcnRzLndyYXBTYWdhRGlzcGF0Y2ggPSBmdW5jdGlvbiB3cmFwU2FnYURpc3BhdGNoKGRpc3BhdGNoKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0ICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG5cdCAgfTtcblx0fTtcblx0XG5cdHZhciBjbG9uZWFibGVHZW5lcmF0b3IgPSBleHBvcnRzLmNsb25lYWJsZUdlbmVyYXRvciA9IGZ1bmN0aW9uIGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGhpc3RvcnkgPSBbXTtcblx0ICAgIHZhciBnZW4gPSBnZW5lcmF0b3JGdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuXHQgICAgICAgIGhpc3RvcnkucHVzaChhcmcpO1xuXHQgICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuXHQgICAgICB9LFxuXHQgICAgICBjbG9uZTogZnVuY3Rpb24gY2xvbmUoKSB7XG5cdCAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXHQgICAgICAgIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdCAgICAgICAgICByZXR1cm4gY2xvbmVkR2VuLm5leHQoYXJnKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgICByZXR1cm4gY2xvbmVkR2VuO1xuXHQgICAgICB9LFxuXHQgICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcblx0ICAgICAgICByZXR1cm4gZ2VuLnJldHVybih2YWx1ZSk7XG5cdCAgICAgIH0sXG5cdCAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIGdlbi50aHJvdyhleGNlcHRpb24pO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH07XG5cdH07XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSlcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXHRcblx0dmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQyKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHRmdW5jdGlvbiBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMob2JqLCBkZXNjcykgeyBmb3IgKHZhciBrZXkgaW4gZGVzY3MpIHsgdmFyIGRlc2MgPSBkZXNjc1trZXldOyBkZXNjLmNvbmZpZ3VyYWJsZSA9IGRlc2MuZW51bWVyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzYykgZGVzYy53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgZGVzYyk7IH0gcmV0dXJuIG9iajsgfVxuXHRcblx0dmFyIE5PVF9JVEVSQVRPUl9FUlJPUiA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gJ3Byb2MgZmlyc3QgYXJndW1lbnQgKFNhZ2EgZnVuY3Rpb24gcmVzdWx0KSBtdXN0IGJlIGFuIGl0ZXJhdG9yJztcblx0XG5cdHZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG5cdCAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvQ0hBTk5FTF9FTkQnO1xuXHQgIH1cblx0fTtcblx0dmFyIFRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5UQVNLX0NBTkNFTCA9IHtcblx0ICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9UQVNLX0NBTkNFTCc7XG5cdCAgfVxuXHR9O1xuXHRcblx0dmFyIG1hdGNoZXJzID0ge1xuXHQgIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMua1RydWU7XG5cdCAgfSxcblx0ICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG5cdCAgICByZXR1cm4gKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwYXR0ZXJuKSkgPT09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGlucHV0KSB7XG5cdCAgICAgIHJldHVybiBpbnB1dC50eXBlID09PSBwYXR0ZXJuO1xuXHQgICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gaW5wdXQudHlwZSA9PT0gU3RyaW5nKHBhdHRlcm4pO1xuXHQgICAgfTtcblx0ICB9LFxuXHQgIGFycmF5OiBmdW5jdGlvbiBhcnJheShwYXR0ZXJucykge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuXHQgICAgICAgIHJldHVybiBtYXRjaGVyKHApKGlucHV0KTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgcHJlZGljYXRlOiBmdW5jdGlvbiBwcmVkaWNhdGUoX3ByZWRpY2F0ZSkge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuXHQgICAgICByZXR1cm4gX3ByZWRpY2F0ZShpbnB1dCk7XG5cdCAgICB9O1xuXHQgIH1cblx0fTtcblx0XG5cdGZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuXHQgIC8vIHByZXR0aWVyLWlnbm9yZVxuXHQgIHJldHVybiAocGF0dGVybiA9PT0gJyonID8gbWF0Y2hlcnMud2lsZGNhcmQgOiBfdXRpbHMuaXMuYXJyYXkocGF0dGVybikgPyBtYXRjaGVycy5hcnJheSA6IF91dGlscy5pcy5zdHJpbmdhYmxlRnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLmRlZmF1bHQgOiBfdXRpbHMuaXMuZnVuYyhwYXR0ZXJuKSA/IG1hdGNoZXJzLnByZWRpY2F0ZSA6IG1hdGNoZXJzLmRlZmF1bHQpKHBhdHRlcm4pO1xuXHR9XG5cdFxuXHQvKipcblx0ICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuXHQgIEluIHRoZSBuZXcgZm9yayBtb2RlbCwgZm9ya2VkIHRhc2tzIGFyZSBhdHRhY2hlZCBieSBkZWZhdWx0IHRvIHRoZWlyIHBhcmVudFxuXHQgIFdlIG1vZGVsIHRoaXMgdXNpbmcgdGhlIGNvbmNlcHQgb2YgUGFyZW50IHRhc2sgJiYgbWFpbiBUYXNrXG5cdCAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuXHQgIGFnZ3JlZ2F0aW9uIG9mIHRoZSBtYWluIHRhc2tzICsgYWxsIGl0cyBmb3JrZWQgdGFza3MuXG5cdCAgVGh1cyB0aGUgd2hvbGUgbW9kZWwgcmVwcmVzZW50cyBhbiBleGVjdXRpb24gdHJlZSB3aXRoIG11bHRpcGxlIGJyYW5jaGVzICh2cyB0aGVcblx0ICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblx0XG5cdCAgQSBwYXJlbnQgdGFza3MgaGFzIHRoZSBmb2xsb3dpbmcgc2VtYW50aWNzXG5cdCAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuXHQgIC0gSWYgaXQncyBjYW5jZWxsZWQsIGFsbCBmb3JrcyBhcmUgY2FuY2VsbGVkIGFzIHdlbGxcblx0ICAtIEl0IGFib3J0cyBpZiBhbnkgdW5jYXVnaHQgZXJyb3IgYnViYmxlcyB1cCBmcm9tIGZvcmtzXG5cdCAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG5cdCoqL1xuXHRmdW5jdGlvbiBmb3JrUXVldWUobmFtZSwgbWFpblRhc2ssIGNiKSB7XG5cdCAgdmFyIHRhc2tzID0gW10sXG5cdCAgICAgIHJlc3VsdCA9IHZvaWQgMCxcblx0ICAgICAgY29tcGxldGVkID0gZmFsc2U7XG5cdCAgYWRkVGFzayhtYWluVGFzayk7XG5cdFxuXHQgIGZ1bmN0aW9uIGFib3J0KGVycikge1xuXHQgICAgY2FuY2VsQWxsKCk7XG5cdCAgICBjYihlcnIsIHRydWUpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gYWRkVGFzayh0YXNrKSB7XG5cdCAgICB0YXNrcy5wdXNoKHRhc2spO1xuXHQgICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcblx0ICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgKDAsIF91dGlscy5yZW1vdmUpKHRhc2tzLCB0YXNrKTtcblx0ICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGlmIChpc0Vycikge1xuXHQgICAgICAgIGFib3J0KHJlcyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgaWYgKHRhc2sgPT09IG1haW5UYXNrKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmICghdGFza3MubGVuZ3RoKSB7XG5cdCAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuXHQgICAgICAgICAgY2IocmVzdWx0KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICAvLyB0YXNrLmNvbnQuY2FuY2VsID0gdGFzay5jYW5jZWxcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcblx0ICAgIGlmIChjb21wbGV0ZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgdC5jb250ID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIHQuY2FuY2VsKCk7XG5cdCAgICB9KTtcblx0ICAgIHRhc2tzID0gW107XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgYWRkVGFzazogYWRkVGFzayxcblx0ICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuXHQgICAgYWJvcnQ6IGFib3J0LFxuXHQgICAgZ2V0VGFza3M6IGZ1bmN0aW9uIGdldFRhc2tzKCkge1xuXHQgICAgICByZXR1cm4gdGFza3M7XG5cdCAgICB9LFxuXHQgICAgdGFza05hbWVzOiBmdW5jdGlvbiB0YXNrTmFtZXMoKSB7XG5cdCAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgICByZXR1cm4gdC5uYW1lO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcmVhdGVUYXNrSXRlcmF0b3IoX3JlZikge1xuXHQgIHZhciBjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuXHQgICAgICBmbiA9IF9yZWYuZm4sXG5cdCAgICAgIGFyZ3MgPSBfcmVmLmFyZ3M7XG5cdFxuXHQgIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG5cdCAgICByZXR1cm4gZm47XG5cdCAgfVxuXHRcblx0ICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTIgYW5kICM0NDFcblx0ICB2YXIgcmVzdWx0ID0gdm9pZCAwLFxuXHQgICAgICBlcnJvciA9IHZvaWQgMDtcblx0ICB0cnkge1xuXHQgICAgcmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdCAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICBlcnJvciA9IGVycjtcblx0ICB9XG5cdFxuXHQgIC8vIGkuZS4gYSBnZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJucyBhbiBpdGVyYXRvclxuXHQgIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSkge1xuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9XG5cdFxuXHQgIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG5cdCAgLy8gaW5zdGVhZCBjcmVhdGUgYSBmYWlsZWQgdGFzay4gU2VlICMxNTIgYW5kICM0NDFcblx0ICByZXR1cm4gZXJyb3IgPyAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuXHQgICAgdGhyb3cgZXJyb3I7XG5cdCAgfSkgOiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikoZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIHBjID0gdm9pZCAwO1xuXHQgICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcblx0ICAgIHZhciByZXQgPSBmdW5jdGlvbiByZXQodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH07XG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcblx0ICAgICAgaWYgKCFwYykge1xuXHQgICAgICAgIHBjID0gdHJ1ZTtcblx0ICAgICAgICByZXR1cm4gZWZmO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiByZXQoYXJnKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9KCkpO1xuXHR9XG5cdFxuXHR2YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG5cdCAgcmV0dXJuIHsgZm46IGhlbHBlciB9O1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcHJvYyhpdGVyYXRvcikge1xuXHQgIHZhciBzdWJzY3JpYmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMubm9vcDtcblx0ICB9O1xuXHQgIHZhciBkaXNwYXRjaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogX3V0aWxzLm5vb3A7XG5cdCAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcblx0ICB2YXIgcGFyZW50Q29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XG5cdCAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IHt9O1xuXHQgIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcblx0ICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogJ2Fub255bW91cyc7XG5cdCAgdmFyIGNvbnQgPSBhcmd1bWVudHNbOF07XG5cdFxuXHQgICgwLCBfdXRpbHMuY2hlY2spKGl0ZXJhdG9yLCBfdXRpbHMuaXMuaXRlcmF0b3IsIE5PVF9JVEVSQVRPUl9FUlJPUik7XG5cdFxuXHQgIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG5cdCAgdmFyIHJ1blBhcmFsbGVsRWZmZWN0ID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHJ1bkFsbEVmZmVjdCwgKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKGVmZmVjdHNTdHJpbmcsICdhbGwoJyArIGVmZmVjdHNTdHJpbmcgKyAnKScpKTtcblx0XG5cdCAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG5cdCAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cdFxuXHQgIHZhciBsb2cgPSBsb2dnZXIgfHwgX3V0aWxzLmxvZztcblx0ICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbiBsb2dFcnJvcihlcnIpIHtcblx0ICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblx0XG5cdCAgICBpZiAoIW1lc3NhZ2UgJiYgZXJyLnN0YWNrKSB7XG5cdCAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG5cdCAgICB9XG5cdFxuXHQgICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuXHQgIH07XG5cdCAgdmFyIHN0ZENoYW5uZWwgPSAoMCwgX2NoYW5uZWwuc3RkQ2hhbm5lbCkoc3Vic2NyaWJlKTtcblx0ICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuXHQgIC8qKlxuXHQgICAgVHJhY2tzIHRoZSBjdXJyZW50IGVmZmVjdCBjYW5jZWxsYXRpb25cblx0ICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG5cdCAgICBvbiBpdC4gSXQgYWxsb3dzIHByb3BhZ2F0aW5nIGNhbmNlbGxhdGlvbiB0byBjaGlsZCBlZmZlY3RzXG5cdCAgKiovXG5cdCAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0XG5cdCAgLyoqXG5cdCAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG5cdCAgICB0byB0cmFjayB0aGUgbWFpbiBmbG93IChiZXNpZGVzIG90aGVyIGZvcmtlZCB0YXNrcylcblx0ICAqKi9cblx0ICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcblx0ICB2YXIgbWFpblRhc2sgPSB7IG5hbWU6IG5hbWUsIGNhbmNlbDogY2FuY2VsTWFpbiwgaXNSdW5uaW5nOiB0cnVlIH07XG5cdCAgdmFyIHRhc2tRdWV1ZSA9IGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgZW5kKTtcblx0XG5cdCAgLyoqXG5cdCAgICBjYW5jZWxsYXRpb24gb2YgdGhlIG1haW4gdGFzay4gV2UnbGwgc2ltcGx5IHJlc3VtZSB0aGUgR2VuZXJhdG9yIHdpdGggYSBDYW5jZWxcblx0ICAqKi9cblx0ICBmdW5jdGlvbiBjYW5jZWxNYWluKCkge1xuXHQgICAgaWYgKG1haW5UYXNrLmlzUnVubmluZyAmJiAhbWFpblRhc2suaXNDYW5jZWxsZWQpIHtcblx0ICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICBuZXh0KFRBU0tfQ0FOQ0VMKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIC8qKlxuXHQgICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cblx0ICAgIGNhbmNlbCBhbGwgcGVuZGluZyB0YXNrcyAoaW5jbHVkaW5nIHRoZSBtYWluIHRhc2spLCB0aGVuIGVuZCB0aGUgY3VycmVudCB0YXNrLlxuXHQgICAgIENhbmNlbGxhdGlvbiBwcm9wYWdhdGVzIGRvd24gdG8gdGhlIHdob2xlIGV4ZWN1dGlvbiB0cmVlIGhvbGRlZCBieSB0aGlzIFBhcmVudCB0YXNrXG5cdCAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcblx0ICAgICBDYW5jZWxsYXRpb24gaXMgbm9vcCBmb3IgdGVybWluYXRlZC9DYW5jZWxsZWQgdGFza3MgdGFza3Ncblx0ICAqKi9cblx0ICBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgICAvKipcblx0ICAgICAgV2UgbmVlZCB0byBjaGVjayBib3RoIFJ1bm5pbmcgYW5kIENhbmNlbGxlZCBzdGF0dXNcblx0ICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuXHQgICAgKiovXG5cdCAgICBpZiAoaXRlcmF0b3IuX2lzUnVubmluZyAmJiAhaXRlcmF0b3IuX2lzQ2FuY2VsbGVkKSB7XG5cdCAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG5cdCAgICAgIHRhc2tRdWV1ZS5jYW5jZWxBbGwoKTtcblx0ICAgICAgLyoqXG5cdCAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuXHQgICAgICAqKi9cblx0ICAgICAgZW5kKFRBU0tfQ0FOQ0VMKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG5cdCAgICB0aGlzIHdpbGwgcGVybWl0IGNhbmNlbGxhdGlvbiB0byBwcm9wYWdhdGUgZG93biB0aGUgY2FsbCBjaGFpblxuXHQgICoqL1xuXHQgIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblx0XG5cdCAgLy8gdHJhY2tzIHRoZSBydW5uaW5nIHN0YXR1c1xuXHQgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXHRcblx0ICAvLyBraWNrcyB1cCB0aGUgZ2VuZXJhdG9yXG5cdCAgbmV4dCgpO1xuXHRcblx0ICAvLyB0aGVuIHJldHVybiB0aGUgdGFzayBkZXNjcmlwdG9yIHRvIHRoZSBjYWxsZXJcblx0ICByZXR1cm4gdGFzaztcblx0XG5cdCAgLyoqXG5cdCAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG5cdCAgICBJdCdzIGEgcmVjdXJzaXZlIGFzeW5jL2NvbnRpbnVhdGlvbiBmdW5jdGlvbiB3aGljaCBjYWxscyBpdHNlbGZcblx0ICAgIHVudGlsIHRoZSBnZW5lcmF0b3IgdGVybWluYXRlcyBvciB0aHJvd3Ncblx0ICAqKi9cblx0ICBmdW5jdGlvbiBuZXh0KGFyZywgaXNFcnIpIHtcblx0ICAgIC8vIFByZXZlbnRpdmUgbWVhc3VyZS4gSWYgd2UgZW5kIHVwIGhlcmUsIHRoZW4gdGhlcmUgaXMgcmVhbGx5IHNvbWV0aGluZyB3cm9uZ1xuXHQgICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gcmVzdW1lIGFuIGFscmVhZHkgZmluaXNoZWQgZ2VuZXJhdG9yJyk7XG5cdCAgICB9XG5cdFxuXHQgICAgdHJ5IHtcblx0ICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblx0ICAgICAgaWYgKGlzRXJyKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IudGhyb3coYXJnKTtcblx0ICAgICAgfSBlbHNlIGlmIChhcmcgPT09IFRBU0tfQ0FOQ0VMKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBnZXR0aW5nIFRBU0tfQ0FOQ0VMIGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgbWFpbiB0YXNrXG5cdCAgICAgICAgICBXZSBjYW4gZ2V0IHRoaXMgdmFsdWUgaGVyZVxuXHQgICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcblx0ICAgICAgICAgIC0gQnkgam9pbmluZyBhIENhbmNlbGxlZCB0YXNrXG5cdCAgICAgICAgKiovXG5cdCAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgQ2FuY2VscyB0aGUgY3VycmVudCBlZmZlY3Q7IHRoaXMgd2lsbCBwcm9wYWdhdGUgdGhlIGNhbmNlbGxhdGlvbiBkb3duIHRvIGFueSBjYWxsZWQgdGFza3Ncblx0ICAgICAgICAqKi9cblx0ICAgICAgICBuZXh0LmNhbmNlbCgpO1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuXHQgICAgICAgICAgVGhpcyB3aWxsIGp1bXAgdG8gdGhlIGZpbmFsbHkgYmxvY2tcblx0ICAgICAgICAqKi9cblx0ICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG5cdCAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBDSEFOTkVMX0VORCkge1xuXHQgICAgICAgIC8vIFdlIGdldCBDSEFOTkVMX0VORCBieSB0YWtpbmcgZnJvbSBhIGNoYW5uZWwgdGhhdCBlbmRlZCB1c2luZyBgdGFrZWAgKGFuZCBub3QgYHRha2VtYCB1c2VkIHRvIHRyYXAgRW5kIG9mIGNoYW5uZWxzKVxuXHQgICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoYXJnKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKCFyZXN1bHQuZG9uZSkge1xuXHQgICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcblx0ICAgICAgICAqKi9cblx0ICAgICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG5cdCAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuXHQgICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcblx0ICAgICAgfVxuXHQgICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG5cdCAgICAgIG1haW5UYXNrLmNvbnQoZXJyb3IsIHRydWUpO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gZW5kKHJlc3VsdCwgaXNFcnIpIHtcblx0ICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcblx0ICAgIHN0ZENoYW5uZWwuY2xvc2UoKTtcblx0ICAgIGlmICghaXNFcnIpIHtcblx0ICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcblx0ICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kICYmIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZC5yZXNvbHZlKHJlc3VsdCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCAnc2FnYVN0YWNrJywge1xuXHQgICAgICAgICAgdmFsdWU6ICdhdCAnICsgbmFtZSArICcgXFxuICcgKyAocmVzdWx0LnNhZ2FTdGFjayB8fCByZXN1bHQuc3RhY2spLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcblx0ICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgJiYgb25FcnJvcikge1xuXHQgICAgICAgICAgb25FcnJvcihyZXN1bHQpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBsb2dFcnJvcihyZXN1bHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBpdGVyYXRvci5fZXJyb3IgPSByZXN1bHQ7XG5cdCAgICAgIGl0ZXJhdG9yLl9pc0Fib3J0ZWQgPSB0cnVlO1xuXHQgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuXHQgICAgfVxuXHQgICAgdGFzay5jb250ICYmIHRhc2suY29udChyZXN1bHQsIGlzRXJyKTtcblx0ICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG5cdCAgICAgIHJldHVybiBqLmNiKHJlc3VsdCwgaXNFcnIpO1xuXHQgICAgfSk7XG5cdCAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcblx0ICAgIHZhciBsYWJlbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG5cdCAgICB2YXIgY2IgPSBhcmd1bWVudHNbM107XG5cdFxuXHQgICAgdmFyIGVmZmVjdElkID0gKDAsIF91dGlscy51aWQpKCk7XG5cdCAgICBzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQoeyBlZmZlY3RJZDogZWZmZWN0SWQsIHBhcmVudEVmZmVjdElkOiBwYXJlbnRFZmZlY3RJZCwgbGFiZWw6IGxhYmVsLCBlZmZlY3Q6IGVmZmVjdCB9KTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgY29tcGxldGlvbiBjYWxsYmFjayBhbmQgY2FuY2VsIGNhbGxiYWNrIGFyZSBtdXR1YWxseSBleGNsdXNpdmVcblx0ICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuXHQgICAgICBBbmQgV2UgY2FuJ3QgY29tcGxldGUgYW4gYWxyZWFkeSBjYW5jZWxsZWQgZWZmZWN0SWRcblx0ICAgICoqL1xuXHQgICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cdFxuXHQgICAgLy8gQ29tcGxldGlvbiBjYWxsYmFjayBwYXNzZWQgdG8gdGhlIGFwcHJvcHJpYXRlIGVmZmVjdCBydW5uZXJcblx0ICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG5cdCAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcblx0ICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG5cdCAgICAgIGlmIChzYWdhTW9uaXRvcikge1xuXHQgICAgICAgIGlzRXJyID8gc2FnYU1vbml0b3IuZWZmZWN0UmVqZWN0ZWQoZWZmZWN0SWQsIHJlcykgOiBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZChlZmZlY3RJZCwgcmVzKTtcblx0ICAgICAgfVxuXHQgICAgICBjYihyZXMsIGlzRXJyKTtcblx0ICAgIH1cblx0ICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuXHQgICAgY3VyckNiLmNhbmNlbCA9IF91dGlscy5ub29wO1xuXHRcblx0ICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHByZXZlbnRzIGNhbmNlbGxpbmcgYW4gYWxyZWFkeSBjb21wbGV0ZWQgZWZmZWN0XG5cdCAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBlZmZlY3RTZXR0bGVkID0gdHJ1ZTtcblx0ICAgICAgLyoqXG5cdCAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcblx0ICAgICAgICBjYXRjaCB1bmNhdWdodCBjYW5jZWxsYXRpb25zIGVycm9yczsgc2luY2Ugd2UgY2FuIG5vIGxvbmdlciBjYWxsIHRoZSBjb21wbGV0aW9uXG5cdCAgICAgICAgY2FsbGJhY2ssIGxvZyBlcnJvcnMgcmFpc2VkIGR1cmluZyBjYW5jZWxsYXRpb25zIGludG8gdGhlIGNvbnNvbGVcblx0ICAgICAgKiovXG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgY3VyckNiLmNhbmNlbCgpO1xuXHQgICAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgICBsb2dFcnJvcihlcnIpO1xuXHQgICAgICB9XG5cdCAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblx0XG5cdCAgICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZChlZmZlY3RJZCk7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8qKlxuXHQgICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG5cdCAgICAgIGl0IGFsbG93cyB0aGlzIGdlbmVyYXRvciB0byBwcm9wYWdhdGUgY2FuY2VsbGF0aW9uIGRvd253YXJkLlxuXHQgICAgICAgQVRURU5USU9OISBlZmZlY3QgcnVubmVycyBtdXN0IHNldHVwIHRoZSBjYW5jZWwgbG9naWMgYnkgc2V0dGluZyBjYi5jYW5jZWwgPSBbY2FuY2VsTWV0aG9kXVxuXHQgICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG5cdCAgICAgICBUaGlzIGlzIGEgc29ydCBvZiBpbnZlcnNpb24gb2YgY29udHJvbDogY2FsbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgcmVzcG9uc2libGVcblx0ICAgICAgZm9yIGNvbXBsZXRpbmcgdGhlIGZsb3cgYnkgY2FsbGluZyB0aGUgcHJvdmlkZWQgY29udGludWF0aW9uOyB3aGlsZSBjYWxsZXIgZnVuY3Rpb25zXG5cdCAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cblx0ICAgICAgIExpYnJhcnkgdXNlcnMgY2FuIGF0dGFjaCB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljIHRvIHByb21pc2VzIGJ5IGRlZmluaW5nIGFcblx0ICAgICAgcHJvbWlzZVtDQU5DRUxdIG1ldGhvZCBpbiB0aGVpciByZXR1cm5lZCBwcm9taXNlc1xuXHQgICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuXHQgICAgKiovXG5cdCAgICB2YXIgZGF0YSA9IHZvaWQgMDtcblx0ICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgLy8gTm9uIGRlY2xhcmF0aXZlIGVmZmVjdFxuXHQgICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXHRcblx0ICAgICAgLy8gZGVjbGFyYXRpdmUgZWZmZWN0c1xuXHQgICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuXHQgICAgKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGNiKSB7XG5cdCAgICB2YXIgY2FuY2VsUHJvbWlzZSA9IHByb21pc2VbX3V0aWxzLkNBTkNFTF07XG5cdCAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcblx0ICAgICAgY2IuY2FuY2VsID0gY2FuY2VsUHJvbWlzZTtcblx0ICAgIH0gZWxzZSBpZiAoX3V0aWxzLmlzLmZ1bmMocHJvbWlzZS5hYm9ydCkpIHtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiBwcm9taXNlLmFib3J0KCk7XG5cdCAgICAgIH07XG5cdCAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cblx0ICAgICAgLy8gYWRkaW5nIGNhbmNlbCBzdXBwb3J0XG5cdCAgICB9XG5cdCAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuXHQgICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiByZXNvbHZlSXRlcmF0b3IoaXRlcmF0b3IsIGVmZmVjdElkLCBuYW1lLCBjYikge1xuXHQgICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcblx0ICAgIHZhciBjaGFubmVsID0gX3JlZjIuY2hhbm5lbCxcblx0ICAgICAgICBwYXR0ZXJuID0gX3JlZjIucGF0dGVybixcblx0ICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXHRcblx0ICAgIGNoYW5uZWwgPSBjaGFubmVsIHx8IHN0ZENoYW5uZWw7XG5cdCAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuXHQgICAgICByZXR1cm4gaW5wIGluc3RhbmNlb2YgRXJyb3IgPyBjYihpbnAsIHRydWUpIDogKDAsIF9jaGFubmVsLmlzRW5kKShpbnApICYmICFtYXliZSA/IGNiKENIQU5ORUxfRU5EKSA6IGNiKGlucCk7XG5cdCAgICB9O1xuXHQgICAgdHJ5IHtcblx0ICAgICAgY2hhbm5lbC50YWtlKHRha2VDYiwgbWF0Y2hlcihwYXR0ZXJuKSk7XG5cdCAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICBjYi5jYW5jZWwgPSB0YWtlQ2IuY2FuY2VsO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuUHV0RWZmZWN0KF9yZWYzLCBjYikge1xuXHQgICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuXHQgICAgICAgIGFjdGlvbiA9IF9yZWYzLmFjdGlvbixcblx0ICAgICAgICByZXNvbHZlID0gX3JlZjMucmVzb2x2ZTtcblx0XG5cdCAgICAvKipcblx0ICAgICAgU2NoZWR1bGUgdGhlIHB1dCBpbiBjYXNlIGFub3RoZXIgc2FnYSBpcyBob2xkaW5nIGEgbG9jay5cblx0ICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuXHQgICAgICB0aGlzIHB1dCBoYXMgdGVybWluYXRlZC5cblx0ICAgICoqL1xuXHQgICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuXHQgICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcblx0ICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgY2hhbm5lbCBvciBgcHV0LnJlc29sdmVgIHdhcyB1c2VkIHRoZW4gYnViYmxlIHVwIHRoZSBlcnJvci5cblx0ICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuXHQgICAgICAgIGxvZ0Vycm9yKGVycm9yKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHJlc29sdmUgJiYgX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSkge1xuXHQgICAgICAgIHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBjYihyZXN1bHQpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIC8vIFB1dCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYWxsRWZmZWN0KF9yZWY0LCBlZmZlY3RJZCwgY2IpIHtcblx0ICAgIHZhciBjb250ZXh0ID0gX3JlZjQuY29udGV4dCxcblx0ICAgICAgICBmbiA9IF9yZWY0LmZuLFxuXHQgICAgICAgIGFyZ3MgPSBfcmVmNC5hcmdzO1xuXHRcblx0ICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cdCAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcblx0ICAgIHRyeSB7XG5cdCAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBfdXRpbHMuaXMucHJvbWlzZShyZXN1bHQpID8gcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYikgOiBfdXRpbHMuaXMuaXRlcmF0b3IocmVzdWx0KSA/IHJlc29sdmVJdGVyYXRvcihyZXN1bHQsIGVmZmVjdElkLCBmbi5uYW1lLCBjYikgOiBjYihyZXN1bHQpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuQ1BTRWZmZWN0KF9yZWY1LCBjYikge1xuXHQgICAgdmFyIGNvbnRleHQgPSBfcmVmNS5jb250ZXh0LFxuXHQgICAgICAgIGZuID0gX3JlZjUuZm4sXG5cdCAgICAgICAgYXJncyA9IF9yZWY1LmFyZ3M7XG5cdFxuXHQgICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG5cdCAgICAvLyBieSBzZXR0aW5nIGNhbmNlbCBmaWVsZCBvbiB0aGUgY2Jcblx0XG5cdCAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcblx0ICAgIHRyeSB7XG5cdCAgICAgIHZhciBjcHNDYiA9IGZ1bmN0aW9uIGNwc0NiKGVyciwgcmVzKSB7XG5cdCAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG5cdCAgICAgIH07XG5cdCAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KGNwc0NiKSk7XG5cdCAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcblx0ICAgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICByZXR1cm4gY3BzQ2IuY2FuY2VsKCk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkZvcmtFZmZlY3QoX3JlZjYsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGNvbnRleHQgPSBfcmVmNi5jb250ZXh0LFxuXHQgICAgICAgIGZuID0gX3JlZjYuZm4sXG5cdCAgICAgICAgYXJncyA9IF9yZWY2LmFyZ3MsXG5cdCAgICAgICAgZGV0YWNoZWQgPSBfcmVmNi5kZXRhY2hlZDtcblx0XG5cdCAgICB2YXIgdGFza0l0ZXJhdG9yID0gY3JlYXRlVGFza0l0ZXJhdG9yKHsgY29udGV4dDogY29udGV4dCwgZm46IGZuLCBhcmdzOiBhcmdzIH0pO1xuXHRcblx0ICAgIHRyeSB7XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLnN1c3BlbmQpKCk7XG5cdCAgICAgIHZhciBfdGFzayA9IHByb2ModGFza0l0ZXJhdG9yLCBzdWJzY3JpYmUsIGRpc3BhdGNoLCBnZXRTdGF0ZSwgdGFza0NvbnRleHQsIG9wdGlvbnMsIGVmZmVjdElkLCBmbi5uYW1lLCBkZXRhY2hlZCA/IG51bGwgOiBfdXRpbHMubm9vcCk7XG5cdFxuXHQgICAgICBpZiAoZGV0YWNoZWQpIHtcblx0ICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgaWYgKHRhc2tJdGVyYXRvci5faXNSdW5uaW5nKSB7XG5cdCAgICAgICAgICB0YXNrUXVldWUuYWRkVGFzayhfdGFzayk7XG5cdCAgICAgICAgICBjYihfdGFzayk7XG5cdCAgICAgICAgfSBlbHNlIGlmICh0YXNrSXRlcmF0b3IuX2Vycm9yKSB7XG5cdCAgICAgICAgICB0YXNrUXVldWUuYWJvcnQodGFza0l0ZXJhdG9yLl9lcnJvcik7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGNiKF90YXNrKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0gZmluYWxseSB7XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLmZsdXNoKSgpO1xuXHQgICAgfVxuXHQgICAgLy8gRm9yayBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5Kb2luRWZmZWN0KHQsIGNiKSB7XG5cdCAgICBpZiAodC5pc1J1bm5pbmcoKSkge1xuXHQgICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcblx0ICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkodC5qb2luZXJzLCBqb2luZXIpO1xuXHQgICAgICB9O1xuXHQgICAgICB0LmpvaW5lcnMucHVzaChqb2luZXIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHJ1bkNhbmNlbEVmZmVjdCh0YXNrVG9DYW5jZWwsIGNiKSB7XG5cdCAgICBpZiAodGFza1RvQ2FuY2VsID09PSBfdXRpbHMuU0VMRl9DQU5DRUxMQVRJT04pIHtcblx0ICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcblx0ICAgIH1cblx0ICAgIGlmICh0YXNrVG9DYW5jZWwuaXNSdW5uaW5nKCkpIHtcblx0ICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuXHQgICAgfVxuXHQgICAgY2IoKTtcblx0ICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG5cdCAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVmZmVjdHMpO1xuXHRcblx0ICAgIGlmICgha2V5cy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGNiKF91dGlscy5pcy5hcnJheShlZmZlY3RzKSA/IFtdIDoge30pO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBjb21wbGV0ZWRDb3VudCA9IDA7XG5cdCAgICB2YXIgY29tcGxldGVkID0gdm9pZCAwO1xuXHQgICAgdmFyIHJlc3VsdHMgPSB7fTtcblx0ICAgIHZhciBjaGlsZENicyA9IHt9O1xuXHRcblx0ICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuXHQgICAgICBpZiAoY29tcGxldGVkQ291bnQgPT09IGtleXMubGVuZ3RoKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgdmFyIGNoQ2JBdEtleSA9IGZ1bmN0aW9uIGNoQ2JBdEtleShyZXMsIGlzRXJyKSB7XG5cdCAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuXHQgICAgICAgICAgY2IuY2FuY2VsKCk7XG5cdCAgICAgICAgICBjYihyZXMsIGlzRXJyKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuXHQgICAgICAgICAgY29tcGxldGVkQ291bnQrKztcblx0ICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG5cdCAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG5cdCAgICB9KTtcblx0XG5cdCAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghY29tcGxldGVkKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdFxuXHQgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgcmV0dXJuIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuXHQgICAgdmFyIGNvbXBsZXRlZCA9IHZvaWQgMDtcblx0ICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7XG5cdCAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblx0XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcblx0ICAgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoaXNFcnIpIHtcblx0ICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY2IocmVzLCB0cnVlKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG5cdCAgICAgICAgICB2YXIgX3Jlc3BvbnNlO1xuXHRcblx0ICAgICAgICAgIGNiLmNhbmNlbCgpO1xuXHQgICAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICAgIHZhciByZXNwb25zZSA9IChfcmVzcG9uc2UgPSB7fSwgX3Jlc3BvbnNlW2tleV0gPSByZXMsIF9yZXNwb25zZSk7XG5cdCAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH07XG5cdCAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblx0ICAgICAgY2hpbGRDYnNba2V5XSA9IGNoQ2JBdEtleTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gcHJldmVudHMgdW5uZWNlc3NhcnkgY2FuY2VsbGF0aW9uXG5cdCAgICAgIGlmICghY29tcGxldGVkKSB7XG5cdCAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcblx0ICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICBpZiAoY29tcGxldGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgIHJ1bkVmZmVjdChlZmZlY3RzW2tleV0sIGVmZmVjdElkLCBrZXksIGNoaWxkQ2JzW2tleV0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG5cdCAgICB2YXIgc2VsZWN0b3IgPSBfcmVmNy5zZWxlY3Rvcixcblx0ICAgICAgICBhcmdzID0gX3JlZjcuYXJncztcblx0XG5cdCAgICB0cnkge1xuXHQgICAgICB2YXIgc3RhdGUgPSBzZWxlY3Rvci5hcHBseSh1bmRlZmluZWQsIFtnZXRTdGF0ZSgpXS5jb25jYXQoYXJncykpO1xuXHQgICAgICBjYihzdGF0ZSk7XG5cdCAgICB9IGNhdGNoIChlcnJvcikge1xuXHQgICAgICBjYihlcnJvciwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuXHQgICAgdmFyIHBhdHRlcm4gPSBfcmVmOC5wYXR0ZXJuLFxuXHQgICAgICAgIGJ1ZmZlciA9IF9yZWY4LmJ1ZmZlcjtcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSBtYXRjaGVyKHBhdHRlcm4pO1xuXHQgICAgbWF0Y2gucGF0dGVybiA9IHBhdHRlcm47XG5cdCAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcblx0ICAgIGNiKCEhbWFpblRhc2suaXNDYW5jZWxsZWQpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuRmx1c2hFZmZlY3QoY2hhbm5lbCwgY2IpIHtcblx0ICAgIGNoYW5uZWwuZmx1c2goY2IpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuR2V0Q29udGV4dEVmZmVjdChwcm9wLCBjYikge1xuXHQgICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcblx0ICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG5cdCAgICBjYigpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gbmV3VGFzayhpZCwgbmFtZSwgaXRlcmF0b3IsIGNvbnQpIHtcblx0ICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXHRcblx0ICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCA9IG51bGw7XG5cdCAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmIChpdGVyYXRvci5fZGVmZXJyZWRFbmQpIHtcblx0ICAgICAgICByZXR1cm4gaXRlcmF0b3IuX2RlZmVycmVkRW5kLnByb21pc2U7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIGRlZiA9ICgwLCBfdXRpbHMuZGVmZXJyZWQpKCk7XG5cdCAgICAgICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gZGVmO1xuXHQgICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuXHQgICAgICAgICAgaXRlcmF0b3IuX2Vycm9yID8gZGVmLnJlamVjdChpdGVyYXRvci5fZXJyb3IpIDogZGVmLnJlc29sdmUoaXRlcmF0b3IuX3Jlc3VsdCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcblx0ICAgICAgfVxuXHQgICAgfSwgX3JlZjkuY29udCA9IGNvbnQsIF9yZWY5LmpvaW5lcnMgPSBbXSwgX3JlZjkuY2FuY2VsID0gY2FuY2VsLCBfcmVmOS5pc1J1bm5pbmcgPSBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuXHQgICAgfSwgX3JlZjkuaXNDYW5jZWxsZWQgPSBmdW5jdGlvbiBpc0NhbmNlbGxlZCgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZDtcblx0ICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9pc0Fib3J0ZWQ7XG5cdCAgICB9LCBfcmVmOS5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuXHQgICAgfSwgX3JlZjkuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgcmV0dXJuIGl0ZXJhdG9yLl9lcnJvcjtcblx0ICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG5cdCAgICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgndGFzaycsIHByb3BzKSk7XG5cdCAgICAgIF91dGlscy5vYmplY3QuYXNzaWduKHRhc2tDb250ZXh0LCBwcm9wcyk7XG5cdCAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG5cdCAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmFzYXAgPSBhc2FwO1xuXHRleHBvcnRzLnN1c3BlbmQgPSBzdXNwZW5kO1xuXHRleHBvcnRzLmZsdXNoID0gZmx1c2g7XG5cdHZhciBxdWV1ZSA9IFtdO1xuXHQvKipcblx0ICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG5cdCAgLSBJbmNyZW1lbnRpbmcgYWRkcyBhIGxvY2sgYW5kIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGBzdXNwZW5kZWRgIHN0YXRlIChpZiBpdCdzIG5vdFxuXHQgICAgYWxyZWFkeSBzdXNwZW5kZWQpXG5cdCAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcblx0ICAgIHRyaWdnZXJzIGZsdXNoaW5nIHRoZSBxdWV1ZWQgdGFza3MuXG5cdCoqL1xuXHR2YXIgc2VtYXBob3JlID0gMDtcblx0XG5cdC8qKlxuXHQgIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcblx0ICBhbmQgZmx1c2hlZCBhZnRlciB0aGlzIHRhc2sgaGFzIGZpbmlzaGVkIChhc3N1bWluZyB0aGUgc2NoZWR1bGVyIGVuZHVwIGluIGEgcmVsZWFzZWRcblx0ICBzdGF0ZSkuXG5cdCoqL1xuXHRmdW5jdGlvbiBleGVjKHRhc2spIHtcblx0ICB0cnkge1xuXHQgICAgc3VzcGVuZCgpO1xuXHQgICAgdGFzaygpO1xuXHQgIH0gZmluYWxseSB7XG5cdCAgICByZWxlYXNlKCk7XG5cdCAgfVxuXHR9XG5cdFxuXHQvKipcblx0ICBFeGVjdXRlcyBvciBxdWV1ZXMgYSB0YXNrIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgdGhlIHNjaGVkdWxlciAoYHN1c3BlbmRlZGAgb3IgYHJlbGVhc2VkYClcblx0KiovXG5cdGZ1bmN0aW9uIGFzYXAodGFzaykge1xuXHQgIHF1ZXVlLnB1c2godGFzayk7XG5cdFxuXHQgIGlmICghc2VtYXBob3JlKSB7XG5cdCAgICBzdXNwZW5kKCk7XG5cdCAgICBmbHVzaCgpO1xuXHQgIH1cblx0fVxuXHRcblx0LyoqXG5cdCAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHN1c3BlbmRlZGAgc3RhdGUuIFNjaGVkdWxlZCB0YXNrcyB3aWxsIGJlIHF1ZXVlZCB1bnRpbCB0aGVcblx0ICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG5cdCoqL1xuXHRmdW5jdGlvbiBzdXNwZW5kKCkge1xuXHQgIHNlbWFwaG9yZSsrO1xuXHR9XG5cdFxuXHQvKipcblx0ICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgcmVsZWFzZWRgIHN0YXRlLlxuXHQqKi9cblx0ZnVuY3Rpb24gcmVsZWFzZSgpIHtcblx0ICBzZW1hcGhvcmUtLTtcblx0fVxuXHRcblx0LyoqXG5cdCAgUmVsZWFzZXMgdGhlIGN1cnJlbnQgbG9jay4gRXhlY3V0ZXMgYWxsIHF1ZXVlZCB0YXNrcyBpZiB0aGUgc2NoZWR1bGVyIGlzIGluIHRoZSByZWxlYXNlZCBzdGF0ZS5cblx0KiovXG5cdGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQgIHJlbGVhc2UoKTtcblx0XG5cdCAgdmFyIHRhc2sgPSB2b2lkIDA7XG5cdCAgd2hpbGUgKCFzZW1hcGhvcmUgJiYgKHRhc2sgPSBxdWV1ZS5zaGlmdCgpKSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICBleGVjKHRhc2spO1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5cdGV4cG9ydHMudGFrZSA9IHRha2U7XG5cdGV4cG9ydHMucHV0ID0gcHV0O1xuXHRleHBvcnRzLmFsbCA9IGFsbDtcblx0ZXhwb3J0cy5yYWNlID0gcmFjZTtcblx0ZXhwb3J0cy5jYWxsID0gY2FsbDtcblx0ZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuXHRleHBvcnRzLmNwcyA9IGNwcztcblx0ZXhwb3J0cy5mb3JrID0gZm9yaztcblx0ZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuXHRleHBvcnRzLmpvaW4gPSBqb2luO1xuXHRleHBvcnRzLmNhbmNlbCA9IGNhbmNlbDtcblx0ZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5cdGV4cG9ydHMuYWN0aW9uQ2hhbm5lbCA9IGFjdGlvbkNoYW5uZWw7XG5cdGV4cG9ydHMuY2FuY2VsbGVkID0gY2FuY2VsbGVkO1xuXHRleHBvcnRzLmZsdXNoID0gZmx1c2g7XG5cdGV4cG9ydHMuZ2V0Q29udGV4dCA9IGdldENvbnRleHQ7XG5cdGV4cG9ydHMuc2V0Q29udGV4dCA9IHNldENvbnRleHQ7XG5cdGV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuXHRleHBvcnRzLnRha2VMYXRlc3QgPSB0YWtlTGF0ZXN0O1xuXHRleHBvcnRzLnRocm90dGxlID0gdGhyb3R0bGU7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDQpO1xuXHRcblx0dmFyIElPID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuc3ltKSgnSU8nKTtcblx0dmFyIFRBS0UgPSAnVEFLRSc7XG5cdHZhciBQVVQgPSAnUFVUJztcblx0dmFyIEFMTCA9ICdBTEwnO1xuXHR2YXIgUkFDRSA9ICdSQUNFJztcblx0dmFyIENBTEwgPSAnQ0FMTCc7XG5cdHZhciBDUFMgPSAnQ1BTJztcblx0dmFyIEZPUksgPSAnRk9SSyc7XG5cdHZhciBKT0lOID0gJ0pPSU4nO1xuXHR2YXIgQ0FOQ0VMID0gJ0NBTkNFTCc7XG5cdHZhciBTRUxFQ1QgPSAnU0VMRUNUJztcblx0dmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcblx0dmFyIENBTkNFTExFRCA9ICdDQU5DRUxMRUQnO1xuXHR2YXIgRkxVU0ggPSAnRkxVU0gnO1xuXHR2YXIgR0VUX0NPTlRFWFQgPSAnR0VUX0NPTlRFWFQnO1xuXHR2YXIgU0VUX0NPTlRFWFQgPSAnU0VUX0NPTlRFWFQnO1xuXHRcblx0dmFyIFRFU1RfSElOVCA9ICdcXG4oSElOVDogaWYgeW91IGFyZSBnZXR0aW5nIHRoaXMgZXJyb3JzIGluIHRlc3RzLCBjb25zaWRlciB1c2luZyBjcmVhdGVNb2NrVGFzayBmcm9tIHJlZHV4LXNhZ2EvdXRpbHMpJztcblx0XG5cdHZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuXHQgIHZhciBfcmVmO1xuXHRcblx0ICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xuXHR9O1xuXHRcblx0dmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGFzRWZmZWN0LmZvcmsoZWZmKSwgX3V0aWxzLmlzLm9iamVjdCwgJ2RldGFjaChlZmYpOiBhcmd1bWVudCBtdXN0IGJlIGEgZm9yayBlZmZlY3QnKTtcblx0ICBlZmZbRk9SS10uZGV0YWNoZWQgPSB0cnVlO1xuXHQgIHJldHVybiBlZmY7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiB0YWtlKCkge1xuXHQgIHZhciBwYXR0ZXJuT3JDaGFubmVsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnKic7XG5cdFxuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShhcmd1bWVudHNbMF0sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IHBhdHRlcm5PckNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG5cdCAgfVxuXHQgIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG5cdCAgfVxuXHQgIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IGNoYW5uZWw6IHBhdHRlcm5PckNoYW5uZWwgfSk7XG5cdCAgfVxuXHQgIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG5cdH1cblx0XG5cdHRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIGVmZiA9IHRha2UuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgIGVmZltUQUtFXS5tYXliZSA9IHRydWU7XG5cdCAgcmV0dXJuIGVmZjtcblx0fTtcblx0XG5cdHZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cdFxuXHRmdW5jdGlvbiBwdXQoY2hhbm5lbCwgYWN0aW9uKSB7XG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShjaGFubmVsLCBfdXRpbHMuaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgYSB2YWxpZCBjaGFubmVsJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG5cdCAgfSBlbHNlIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG5cdCAgICBhY3Rpb24gPSBjaGFubmVsO1xuXHQgICAgY2hhbm5lbCA9IG51bGw7XG5cdCAgfVxuXHQgIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xuXHR9XG5cdFxuXHRwdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0ICBlZmZbUFVUXS5yZXNvbHZlID0gdHJ1ZTtcblx0ICByZXR1cm4gZWZmO1xuXHR9O1xuXHRcblx0cHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblx0XG5cdGZ1bmN0aW9uIGFsbChlZmZlY3RzKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcblx0ICByZXR1cm4gZWZmZWN0KFJBQ0UsIGVmZmVjdHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRGbkNhbGxEZXNjKG1ldGgsIGZuLCBhcmdzKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykoZm4sIF91dGlscy5pcy5ub3RVbmRlZiwgbWV0aCArICc6IGFyZ3VtZW50IGZuIGlzIHVuZGVmaW5lZCcpO1xuXHRcblx0ICB2YXIgY29udGV4dCA9IG51bGw7XG5cdCAgaWYgKF91dGlscy5pcy5hcnJheShmbikpIHtcblx0ICAgIHZhciBfZm4gPSBmbjtcblx0ICAgIGNvbnRleHQgPSBfZm5bMF07XG5cdCAgICBmbiA9IF9mblsxXTtcblx0ICB9IGVsc2UgaWYgKGZuLmZuKSB7XG5cdCAgICB2YXIgX2ZuMiA9IGZuO1xuXHQgICAgY29udGV4dCA9IF9mbjIuY29udGV4dDtcblx0ICAgIGZuID0gX2ZuMi5mbjtcblx0ICB9XG5cdCAgaWYgKGNvbnRleHQgJiYgX3V0aWxzLmlzLnN0cmluZyhmbikgJiYgX3V0aWxzLmlzLmZ1bmMoY29udGV4dFtmbl0pKSB7XG5cdCAgICBmbiA9IGNvbnRleHRbZm5dO1xuXHQgIH1cblx0ICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLmZ1bmMsIG1ldGggKyAnOiBhcmd1bWVudCAnICsgZm4gKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdFxuXHQgIHJldHVybiB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYWxsKGZuKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG5cdCAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXHRcblx0ICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjcHMoZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdCAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGVmZmVjdChDUFMsIGdldEZuQ2FsbERlc2MoJ2NwcycsIGZuLCBhcmdzKSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZvcmsoZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG5cdCAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGVmZmVjdChGT1JLLCBnZXRGbkNhbGxEZXNjKCdmb3JrJywgZm4sIGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc3Bhd24oZm4pIHtcblx0ICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG5cdCAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gam9pbigpIHtcblx0ICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcblx0ICAgIHRhc2tzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG5cdCAgfVxuXHRcblx0ICBpZiAodGFza3MubGVuZ3RoID4gMSkge1xuXHQgICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcblx0ICAgICAgcmV0dXJuIGpvaW4odCk7XG5cdCAgICB9KSk7XG5cdCAgfVxuXHQgIHZhciB0YXNrID0gdGFza3NbMF07XG5cdCAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnam9pbih0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcblx0ICByZXR1cm4gZWZmZWN0KEpPSU4sIHRhc2spO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgZm9yICh2YXIgX2xlbjYgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW42KSwgX2tleTYgPSAwOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG5cdCAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuXHQgIH1cblx0XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcblx0ICAgIHJldHVybiBhbGwodGFza3MubWFwKGZ1bmN0aW9uICh0KSB7XG5cdCAgICAgIHJldHVybiBjYW5jZWwodCk7XG5cdCAgICB9KSk7XG5cdCAgfVxuXHQgIHZhciB0YXNrID0gdGFza3NbMF07XG5cdCAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykodGFzaywgX3V0aWxzLmlzLnRhc2ssICdjYW5jZWwodGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcblx0ICB9XG5cdCAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2sgfHwgX3V0aWxzLlNFTEZfQ0FOQ0VMTEFUSU9OKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG5cdCAgZm9yICh2YXIgX2xlbjcgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjcgPiAxID8gX2xlbjcgLSAxIDogMCksIF9rZXk3ID0gMTsgX2tleTcgPCBfbGVuNzsgX2tleTcrKykge1xuXHQgICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcblx0ICB9XG5cdFxuXHQgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdCAgICBzZWxlY3RvciA9IF91dGlscy5pZGVudDtcblx0ICB9IGVsc2Uge1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgIGNoYW5uZWwocGF0dGVybiwgW2J1ZmZlcl0pICAgID0+IGNyZWF0ZXMgYW4gZXZlbnQgY2hhbm5lbCBmb3Igc3RvcmUgYWN0aW9uc1xuXHQqKi9cblx0ZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShwYXR0ZXJuLCBfdXRpbHMuaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sLi4uKTogYXJndW1lbnQgcGF0dGVybiBpcyB1bmRlZmluZWQnKTtcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50ICcgKyBidWZmZXIgKyAnIGlzIG5vdCBhIHZhbGlkIGJ1ZmZlcicpO1xuXHQgIH1cblx0ICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG5cdCAgcmV0dXJuIGVmZmVjdChDQU5DRUxMRUQsIHt9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuXHQgICgwLCBfdXRpbHMuY2hlY2spKGNoYW5uZWwsIF91dGlscy5pcy5jaGFubmVsLCAnZmx1c2goY2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCcpO1xuXHQgIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcblx0ICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wLCBfdXRpbHMuaXMuc3RyaW5nLCAnZ2V0Q29udGV4dChwcm9wKTogYXJndW1lbnQgJyArIHByb3AgKyAnIGlzIG5vdCBhIHN0cmluZycpO1xuXHQgIHJldHVybiBlZmZlY3QoR0VUX0NPTlRFWFQsIHByb3ApO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG5cdCAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG5cdCAgcmV0dXJuIGVmZmVjdChTRVRfQ09OVEVYVCwgcHJvcHMpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiB0YWtlRXZlcnkocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjggPiAyID8gX2xlbjggLSAyIDogMCksIF9rZXk4ID0gMjsgX2tleTggPCBfbGVuODsgX2tleTgrKykge1xuXHQgICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcblx0ICB9XG5cdFxuXHQgIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOSA+IDIgPyBfbGVuOSAtIDIgOiAwKSwgX2tleTkgPSAyOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG5cdCAgICBhcmdzW19rZXk5IC0gMl0gPSBhcmd1bWVudHNbX2tleTldO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRha2VMYXRlc3RIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdGhyb3R0bGUobXMsIHBhdHRlcm4sIHdvcmtlcikge1xuXHQgIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG5cdCAgICBhcmdzW19rZXkxMCAtIDNdID0gYXJndW1lbnRzW19rZXkxMF07XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGhyb3R0bGVIZWxwZXIsIG1zLCBwYXR0ZXJuLCB3b3JrZXJdLmNvbmNhdChhcmdzKSk7XG5cdH1cblx0XG5cdHZhciBjcmVhdGVBc0VmZmVjdFR5cGUgPSBmdW5jdGlvbiBjcmVhdGVBc0VmZmVjdFR5cGUodHlwZSkge1xuXHQgIHJldHVybiBmdW5jdGlvbiAoZWZmZWN0KSB7XG5cdCAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuXHQgIH07XG5cdH07XG5cdFxuXHR2YXIgYXNFZmZlY3QgPSBleHBvcnRzLmFzRWZmZWN0ID0ge1xuXHQgIHRha2U6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoVEFLRSksXG5cdCAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG5cdCAgYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFMTCksXG5cdCAgcmFjZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShSQUNFKSxcblx0ICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuXHQgIGNwczogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShDUFMpLFxuXHQgIGZvcms6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoRk9SSyksXG5cdCAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcblx0ICBjYW5jZWw6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMKSxcblx0ICBzZWxlY3Q6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VMRUNUKSxcblx0ICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcblx0ICBjYW5jZWxsZWQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ0FOQ0VMTEVEKSxcblx0ICBmbHVzaDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGTFVTSCksXG5cdCAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG5cdCAgc2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRVRfQ09OVEVYVClcblx0fTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc0NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnRocm90dGxlSGVscGVyID0gZXhwb3J0cy50YWtlTGF0ZXN0SGVscGVyID0gZXhwb3J0cy50YWtlRXZlcnlIZWxwZXIgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSB1bmRlZmluZWQ7XG5cdFxuXHR2YXIgX3Rha2VFdmVyeSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0NSk7XG5cdFxuXHR2YXIgX3Rha2VFdmVyeTIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGFrZUV2ZXJ5KTtcblx0XG5cdHZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OSk7XG5cdFxuXHR2YXIgX3Rha2VMYXRlc3QyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VMYXRlc3QpO1xuXHRcblx0dmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc1MCk7XG5cdFxuXHR2YXIgX3Rocm90dGxlMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aHJvdHRsZSk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHR2YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcblx0ICByZXR1cm4gJ2ltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYVxcJyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGltcG9ydCB7ICcgKyBoZWxwZXJOYW1lICsgJyB9IGZyb20gXFwncmVkdXgtc2FnYS9lZmZlY3RzXFwnLlxcblRoZSBsYXR0ZXIgd2lsbCBub3Qgd29yayB3aXRoIHlpZWxkKiwgYXMgaGVscGVyIGVmZmVjdHMgYXJlIHdyYXBwZWQgYXV0b21hdGljYWxseSBmb3IgeW91IGluIGZvcmsgZWZmZWN0LlxcblRoZXJlZm9yZSB5aWVsZCAnICsgaGVscGVyTmFtZSArICcgd2lsbCByZXR1cm4gdGFzayBkZXNjcmlwdG9yIHRvIHlvdXIgc2FnYSBhbmQgZXhlY3V0ZSBuZXh0IGxpbmVzIG9mIGNvZGUuJztcblx0fTtcblx0XG5cdHZhciB0YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlRXZlcnkyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VFdmVyeScpKTtcblx0dmFyIHRha2VMYXRlc3QgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90YWtlTGF0ZXN0Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlTGF0ZXN0JykpO1xuXHR2YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cdFxuXHRleHBvcnRzLnRha2VFdmVyeSA9IHRha2VFdmVyeTtcblx0ZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcblx0ZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuXHRleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IF90YWtlRXZlcnkyLmRlZmF1bHQ7XG5cdGV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuXHRleHBvcnRzLnRocm90dGxlSGVscGVyID0gX3Rocm90dGxlMi5kZWZhdWx0O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzQ1OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IHRha2VFdmVyeTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIHRha2VFdmVyeShwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcblx0ICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuXHQgIH1cblx0XG5cdCAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcblx0ICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcblx0ICB9O1xuXHRcblx0ICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuXHQgICAgICBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcblx0ICAgIHJldHVybiBhY3Rpb24gPSBhYztcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gKDAsIF9mc21JdGVyYXRvcjIuZGVmYXVsdCkoe1xuXHQgICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuXHQgICAgICByZXR1cm4gWydxMicsIHlUYWtlLCBzZXRBY3Rpb25dO1xuXHQgICAgfSxcblx0ICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcblx0ICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTEnLCB5Rm9yayhhY3Rpb24pXTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnFFbmQgPSB1bmRlZmluZWQ7XG5cdGV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZnNtSXRlcmF0b3I7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdHZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG5cdHZhciBxRW5kID0gZXhwb3J0cy5xRW5kID0ge307XG5cdFxuXHRmdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG5cdCAgaWYgKF91dGlscy5pcy5jaGFubmVsKHBhdHRlcm5PckNoYW5uZWwpKSB7XG5cdCAgICByZXR1cm4gJ2NoYW5uZWwnO1xuXHQgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuXHQgICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcblx0ICAgICAgcmV0dXJuIFN0cmluZyhlbnRyeSk7XG5cdCAgICB9KSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCk7XG5cdCAgfVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG5cdCAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdpdGVyYXRvcic7XG5cdFxuXHQgIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcblx0ICAgICAgcU5leHQgPSBxMDtcblx0XG5cdCAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG5cdCAgICBpZiAocU5leHQgPT09IHFFbmQpIHtcblx0ICAgICAgcmV0dXJuIGRvbmU7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGVycm9yKSB7XG5cdCAgICAgIHFOZXh0ID0gcUVuZDtcblx0ICAgICAgdGhyb3cgZXJyb3I7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXHRcblx0ICAgICAgdmFyIF9mc20kcU5leHQgPSBmc21bcU5leHRdKCksXG5cdCAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcblx0ICAgICAgICAgIG91dHB1dCA9IF9mc20kcU5leHRbMV0sXG5cdCAgICAgICAgICBfdXBkYXRlU3RhdGUgPSBfZnNtJHFOZXh0WzJdO1xuXHRcblx0ICAgICAgcU5leHQgPSBxO1xuXHQgICAgICB1cGRhdGVTdGF0ZSA9IF91cGRhdGVTdGF0ZTtcblx0ICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiAoMCwgX3V0aWxzLm1ha2VJdGVyYXRvcikobmV4dCwgZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICByZXR1cm4gbmV4dChudWxsLCBlcnJvcik7XG5cdCAgfSwgbmFtZSwgdHJ1ZSk7XG5cdH1cblxuLyoqKi8gfSksXG5cbi8qKiovIDc0Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gZXhwb3J0cy5JTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuaXNFbmQgPSBleHBvcnRzLkVORCA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cdFxuXHRleHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuXHRleHBvcnRzLmNoYW5uZWwgPSBjaGFubmVsO1xuXHRleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV2ZW50Q2hhbm5lbDtcblx0ZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIF9idWZmZXJzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ4KTtcblx0XG5cdHZhciBfc2NoZWR1bGVyID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQyKTtcblx0XG5cdHZhciBDSEFOTkVMX0VORF9UWVBFID0gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG5cdHZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xuXHR2YXIgaXNFbmQgPSBleHBvcnRzLmlzRW5kID0gZnVuY3Rpb24gaXNFbmQoYSkge1xuXHQgIHJldHVybiBhICYmIGEudHlwZSA9PT0gQ0hBTk5FTF9FTkRfVFlQRTtcblx0fTtcblx0XG5cdGZ1bmN0aW9uIGVtaXR0ZXIoKSB7XG5cdCAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cdFxuXHQgIGZ1bmN0aW9uIHN1YnNjcmliZShzdWIpIHtcblx0ICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHJldHVybiAoMCwgX3V0aWxzLnJlbW92ZSkoc3Vic2NyaWJlcnMsIHN1Yik7XG5cdCAgICB9O1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG5cdCAgICB2YXIgYXJyID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgYXJyW2ldKGl0ZW0pO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHtcblx0ICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuXHQgICAgZW1pdDogZW1pdFxuXHQgIH07XG5cdH1cblx0XG5cdHZhciBJTlZBTElEX0JVRkZFUiA9IGV4cG9ydHMuSU5WQUxJRF9CVUZGRVIgPSAnaW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGNoYW5uZWwgZmFjdG9yeSBmdW5jdGlvbic7XG5cdHZhciBVTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9ICdTYWdhIHdhcyBwcm92aWRlZCB3aXRoIGFuIHVuZGVmaW5lZCBhY3Rpb24nO1xuXHRcblx0aWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcblx0ICBleHBvcnRzLlVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IFVOREVGSU5FRF9JTlBVVF9FUlJPUiArPSAnXFxuSGludHM6XFxuICAgIC0gY2hlY2sgdGhhdCB5b3VyIEFjdGlvbiBDcmVhdG9yIHJldHVybnMgYSBub24tdW5kZWZpbmVkIHZhbHVlXFxuICAgIC0gaWYgdGhlIFNhZ2Egd2FzIHN0YXJ0ZWQgdXNpbmcgcnVuU2FnYSwgY2hlY2sgdGhhdCB5b3VyIHN1YnNjcmliZSBzb3VyY2UgcHJvdmlkZXMgdGhlIGFjdGlvbiB0byBpdHMgbGlzdGVuZXJzXFxuICAnO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjaGFubmVsKCkge1xuXHQgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblx0XG5cdCAgdmFyIGNsb3NlZCA9IGZhbHNlO1xuXHQgIHZhciB0YWtlcnMgPSBbXTtcblx0XG5cdCAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCBJTlZBTElEX0JVRkZFUik7XG5cdFxuXHQgIGZ1bmN0aW9uIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCkge1xuXHQgICAgaWYgKGNsb3NlZCAmJiB0YWtlcnMubGVuZ3RoKSB7XG5cdCAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0YWtlcnMubGVuZ3RoICYmICFidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHB1dChpbnB1dCkge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG5cdCAgICBpZiAoY2xvc2VkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmICghdGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gYnVmZmVyLnB1dChpbnB1dCk7XG5cdCAgICB9XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRha2Vycy5sZW5ndGg7IGkrKykge1xuXHQgICAgICB2YXIgY2IgPSB0YWtlcnNbaV07XG5cdCAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuXHQgICAgICAgIHRha2Vycy5zcGxpY2UoaSwgMSk7XG5cdCAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gdGFrZShjYikge1xuXHQgICAgY2hlY2tGb3JiaWRkZW5TdGF0ZXMoKTtcblx0ICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdFxuXHQgICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIGNiKEVORCk7XG5cdCAgICB9IGVsc2UgaWYgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG5cdCAgICAgIGNiKGJ1ZmZlci50YWtlKCkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGFrZXJzLnB1c2goY2IpO1xuXHQgICAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIGZsdXNoKGNiKSB7XG5cdCAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuXHQgICAgKDAsIF91dGlscy5jaGVjaykoY2IsIF91dGlscy5pcy5mdW5jLCBcImNoYW5uZWwuZmx1c2gnIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblx0ICAgIGlmIChjbG9zZWQgJiYgYnVmZmVyLmlzRW1wdHkoKSkge1xuXHQgICAgICBjYihFTkQpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgICBjYihidWZmZXIuZmx1c2goKSk7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBjbG9zZSgpIHtcblx0ICAgIGNoZWNrRm9yYmlkZGVuU3RhdGVzKCk7XG5cdCAgICBpZiAoIWNsb3NlZCkge1xuXHQgICAgICBjbG9zZWQgPSB0cnVlO1xuXHQgICAgICBpZiAodGFrZXJzLmxlbmd0aCkge1xuXHQgICAgICAgIHZhciBhcnIgPSB0YWtlcnM7XG5cdCAgICAgICAgdGFrZXJzID0gW107XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICAgICAgYXJyW2ldKEVORCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgdGFrZTogdGFrZSxcblx0ICAgIHB1dDogcHV0LFxuXHQgICAgZmx1c2g6IGZsdXNoLFxuXHQgICAgY2xvc2U6IGNsb3NlLFxuXHQgICAgZ2V0IF9fdGFrZXJzX18oKSB7XG5cdCAgICAgIHJldHVybiB0YWtlcnM7XG5cdCAgICB9LFxuXHQgICAgZ2V0IF9fY2xvc2VkX18oKSB7XG5cdCAgICAgIHJldHVybiBjbG9zZWQ7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZXZlbnRDaGFubmVsKHN1YnNjcmliZSkge1xuXHQgIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9idWZmZXJzLmJ1ZmZlcnMubm9uZSgpO1xuXHQgIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXHRcblx0ICAvKipcblx0ICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuXHQgICAgc2VlIFBSICMyNzMgZm9yIGEgYmFja2dyb3VuZCBkaXNjdXNzaW9uXG5cdCAgKiovXG5cdCAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShtYXRjaGVyLCBfdXRpbHMuaXMuZnVuYywgJ0ludmFsaWQgbWF0Y2ggZnVuY3Rpb24gcGFzc2VkIHRvIGV2ZW50Q2hhbm5lbCcpO1xuXHQgIH1cblx0XG5cdCAgdmFyIGNoYW4gPSBjaGFubmVsKGJ1ZmZlcik7XG5cdCAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UoKSB7XG5cdCAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuXHQgICAgICBpZiAodW5zdWJzY3JpYmUpIHtcblx0ICAgICAgICB1bnN1YnNjcmliZSgpO1xuXHQgICAgICB9XG5cdCAgICAgIGNoYW4uY2xvc2UoKTtcblx0ICAgIH1cblx0ICB9O1xuXHQgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgIGlmIChpc0VuZChpbnB1dCkpIHtcblx0ICAgICAgY2xvc2UoKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIGNoYW4ucHV0KGlucHV0KTtcblx0ICB9KTtcblx0ICBpZiAoY2hhbi5fX2Nsb3NlZF9fKSB7XG5cdCAgICB1bnN1YnNjcmliZSgpO1xuXHQgIH1cblx0XG5cdCAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignaW4gZXZlbnRDaGFubmVsOiBzdWJzY3JpYmUgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRvIHVuc3Vic2NyaWJlJyk7XG5cdCAgfVxuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgdGFrZTogY2hhbi50YWtlLFxuXHQgICAgZmx1c2g6IGNoYW4uZmx1c2gsXG5cdCAgICBjbG9zZTogY2xvc2Vcblx0ICB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzdGRDaGFubmVsKHN1YnNjcmliZSkge1xuXHQgIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuXHQgICAgcmV0dXJuIHN1YnNjcmliZShmdW5jdGlvbiAoaW5wdXQpIHtcblx0ICAgICAgaWYgKGlucHV0W191dGlscy5TQUdBX0FDVElPTl0pIHtcblx0ICAgICAgICBjYihpbnB1dCk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdCAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcblx0ICAgIHRha2U6IGZ1bmN0aW9uIHRha2UoY2IsIG1hdGNoZXIpIHtcblx0ICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdCAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdCAgICAgICAgY2JbX3V0aWxzLk1BVENIXSA9IG1hdGNoZXI7XG5cdCAgICAgIH1cblx0ICAgICAgY2hhbi50YWtlKGNiKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fVxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblx0XG5cdHZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDApO1xuXHRcblx0dmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXHRcblx0dmFyIE9OX09WRVJGTE9XX1RIUk9XID0gMTtcblx0dmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xuXHR2YXIgT05fT1ZFUkZMT1dfU0xJREUgPSAzO1xuXHR2YXIgT05fT1ZFUkZMT1dfRVhQQU5EID0gNDtcblx0XG5cdHZhciB6ZXJvQnVmZmVyID0geyBpc0VtcHR5OiBfdXRpbHMua1RydWUsIHB1dDogX3V0aWxzLm5vb3AsIHRha2U6IF91dGlscy5ub29wIH07XG5cdFxuXHRmdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuXHQgIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMTA7XG5cdCAgdmFyIG92ZXJmbG93QWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXHRcblx0ICB2YXIgYXJyID0gbmV3IEFycmF5KGxpbWl0KTtcblx0ICB2YXIgbGVuZ3RoID0gMDtcblx0ICB2YXIgcHVzaEluZGV4ID0gMDtcblx0ICB2YXIgcG9wSW5kZXggPSAwO1xuXHRcblx0ICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcblx0ICAgIGFycltwdXNoSW5kZXhdID0gaXQ7XG5cdCAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgIGxlbmd0aCsrO1xuXHQgIH07XG5cdFxuXHQgIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcblx0ICAgIGlmIChsZW5ndGggIT0gMCkge1xuXHQgICAgICB2YXIgaXQgPSBhcnJbcG9wSW5kZXhdO1xuXHQgICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcblx0ICAgICAgbGVuZ3RoLS07XG5cdCAgICAgIHBvcEluZGV4ID0gKHBvcEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgICAgcmV0dXJuIGl0O1xuXHQgICAgfVxuXHQgIH07XG5cdFxuXHQgIHZhciBmbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQgICAgdmFyIGl0ZW1zID0gW107XG5cdCAgICB3aGlsZSAobGVuZ3RoKSB7XG5cdCAgICAgIGl0ZW1zLnB1c2godGFrZSgpKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBpdGVtcztcblx0ICB9O1xuXHRcblx0ICByZXR1cm4ge1xuXHQgICAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcblx0ICAgICAgcmV0dXJuIGxlbmd0aCA9PSAwO1xuXHQgICAgfSxcblx0ICAgIHB1dDogZnVuY3Rpb24gcHV0KGl0KSB7XG5cdCAgICAgIGlmIChsZW5ndGggPCBsaW1pdCkge1xuXHQgICAgICAgIHB1c2goaXQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBkb3VibGVkTGltaXQgPSB2b2lkIDA7XG5cdCAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19USFJPVzpcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEJVRkZFUl9PVkVSRkxPVyk7XG5cdCAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuXHQgICAgICAgICAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuXHQgICAgICAgICAgICBwdXNoSW5kZXggPSAocHVzaEluZGV4ICsgMSkgJSBsaW1pdDtcblx0ICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSBPTl9PVkVSRkxPV19FWFBBTkQ6XG5cdCAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblx0XG5cdCAgICAgICAgICAgIGFyciA9IGZsdXNoKCk7XG5cdFxuXHQgICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXHQgICAgICAgICAgICBwdXNoSW5kZXggPSBhcnIubGVuZ3RoO1xuXHQgICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cdFxuXHQgICAgICAgICAgICBhcnIubGVuZ3RoID0gZG91YmxlZExpbWl0O1xuXHQgICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblx0XG5cdCAgICAgICAgICAgIHB1c2goaXQpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAvLyBEUk9QXG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgdGFrZTogdGFrZSxcblx0ICAgIGZsdXNoOiBmbHVzaFxuXHQgIH07XG5cdH1cblx0XG5cdHZhciBidWZmZXJzID0gZXhwb3J0cy5idWZmZXJzID0ge1xuXHQgIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG5cdCAgICByZXR1cm4gemVyb0J1ZmZlcjtcblx0ICB9LFxuXHQgIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1RIUk9XKTtcblx0ICB9LFxuXHQgIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX0RST1ApO1xuXHQgIH0sXG5cdCAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuXHQgICAgcmV0dXJuIHJpbmdCdWZmZXIobGltaXQsIE9OX09WRVJGTE9XX1NMSURFKTtcblx0ICB9LFxuXHQgIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG5cdCAgICByZXR1cm4gcmluZ0J1ZmZlcihpbml0aWFsU2l6ZSwgT05fT1ZFUkZMT1dfRVhQQU5EKTtcblx0ICB9XG5cdH07XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NDk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gdGFrZUxhdGVzdDtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDYpO1xuXHRcblx0dmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXHRcblx0dmFyIF9pbyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0Myk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0ICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuXHQgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmNhbmNlbCkodGFzaykgfTtcblx0ICB9O1xuXHRcblx0ICB2YXIgdGFzayA9IHZvaWQgMCxcblx0ICAgICAgYWN0aW9uID0gdm9pZCAwO1xuXHQgIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG5cdCAgICByZXR1cm4gdGFzayA9IHQ7XG5cdCAgfTtcblx0ICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG5cdCAgICByZXR1cm4gYWN0aW9uID0gYWM7XG5cdCAgfTtcblx0XG5cdCAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcblx0ICAgIHExOiBmdW5jdGlvbiBxMSgpIHtcblx0ICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcblx0ICAgIH0sXG5cdCAgICBxMjogZnVuY3Rpb24gcTIoKSB7XG5cdCAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuXHQgICAgfSxcblx0ICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcblx0ICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGFrZUxhdGVzdCgnICsgKDAsIF9mc21JdGVyYXRvci5zYWZlTmFtZSkocGF0dGVybk9yQ2hhbm5lbCkgKyAnLCAnICsgd29ya2VyLm5hbWUgKyAnKScpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gdGhyb3R0bGU7XG5cdFxuXHR2YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ2KTtcblx0XG5cdHZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0dmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQ3KTtcblx0XG5cdHZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0OCk7XG5cdFxuXHR2YXIgX3V0aWxzID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQwKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiB0aHJvdHRsZShkZWxheUxlbmd0aCwgcGF0dGVybiwgd29ya2VyKSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAzXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cdFxuXHQgIHZhciBhY3Rpb24gPSB2b2lkIDAsXG5cdCAgICAgIGNoYW5uZWwgPSB2b2lkIDA7XG5cdFxuXHQgIHZhciB5QWN0aW9uQ2hhbm5lbCA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLmFjdGlvbkNoYW5uZWwpKHBhdHRlcm4sIF9idWZmZXJzLmJ1ZmZlcnMuc2xpZGluZygxKSkgfTtcblx0ICB2YXIgeVRha2UgPSBmdW5jdGlvbiB5VGFrZSgpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuXHQgIH07XG5cdCAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcblx0ICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG5cdCAgfTtcblx0ICB2YXIgeURlbGF5ID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8uY2FsbCkoX3V0aWxzLmRlbGF5LCBkZWxheUxlbmd0aCkgfTtcblx0XG5cdCAgdmFyIHNldEFjdGlvbiA9IGZ1bmN0aW9uIHNldEFjdGlvbihhYykge1xuXHQgICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuXHQgIH07XG5cdCAgdmFyIHNldENoYW5uZWwgPSBmdW5jdGlvbiBzZXRDaGFubmVsKGNoKSB7XG5cdCAgICByZXR1cm4gY2hhbm5lbCA9IGNoO1xuXHQgIH07XG5cdFxuXHQgIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG5cdCAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeUFjdGlvbkNoYW5uZWwsIHNldENoYW5uZWxdO1xuXHQgICAgfSxcblx0ICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcblx0ICAgICAgcmV0dXJuIFsncTMnLCB5VGFrZSgpLCBzZXRBY3Rpb25dO1xuXHQgICAgfSxcblx0ICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcblx0ICAgICAgcmV0dXJuIGFjdGlvbiA9PT0gX2NoYW5uZWwuRU5EID8gW19mc21JdGVyYXRvci5xRW5kXSA6IFsncTQnLCB5Rm9yayhhY3Rpb24pXTtcblx0ICAgIH0sXG5cdCAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG5cdCAgICAgIHJldHVybiBbJ3EyJywgeURlbGF5XTtcblx0ICAgIH1cblx0ICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcblx0fVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gc2FnYU1pZGRsZXdhcmVGYWN0b3J5O1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHR2YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDcpO1xuXHRcblx0dmFyIF9ydW5TYWdhID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzM5KTtcblx0XG5cdGZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblx0XG5cdGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlRmFjdG9yeSgpIHtcblx0ICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cdFxuXHQgIHZhciBfcmVmJGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG5cdCAgICAgIGNvbnRleHQgPSBfcmVmJGNvbnRleHQgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZiRjb250ZXh0LFxuXHQgICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblx0XG5cdCAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG5cdCAgICAgIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cdFxuXHRcblx0ICBpZiAoX3V0aWxzLmlzLmZ1bmMob3B0aW9ucykpIHtcblx0ICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBwYXNzZWQgYSBmdW5jdGlvbiB0byB0aGUgU2FnYSBtaWRkbGV3YXJlLiBZb3UgYXJlIGxpa2VseSB0cnlpbmcgdG8gc3RhcnQgYSAgICAgICAgU2FnYSBieSBkaXJlY3RseSBwYXNzaW5nIGl0IHRvIHRoZSBtaWRkbGV3YXJlLiBUaGlzIGlzIG5vIGxvbmdlciBwb3NzaWJsZSBzdGFydGluZyBmcm9tIDAuMTAuMC4gICAgICAgIFRvIHJ1biBhIFNhZ2EsIHlvdSBtdXN0IGRvIGl0IGR5bmFtaWNhbGx5IEFGVEVSIG1vdW50aW5nIHRoZSBtaWRkbGV3YXJlIGludG8gdGhlIHN0b3JlLlxcbiAgICAgICAgRXhhbXBsZTpcXG4gICAgICAgICAgaW1wb3J0IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlIGZyb20gXFwncmVkdXgtc2FnYVxcJ1xcbiAgICAgICAgICAuLi4gb3RoZXIgaW1wb3J0c1xcblxcbiAgICAgICAgICBjb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKClcXG4gICAgICAgICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpKVxcbiAgICAgICAgICBzYWdhTWlkZGxld2FyZS5ydW4oc2FnYSwgLi4uYXJncylcXG4gICAgICAnKTtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMubG9nZ2VyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiBvcHRpb25zLm9uZXJyb3IpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMub25lcnJvcmAgd2FzIHJlbW92ZWQuIFVzZSBgb3B0aW9ucy5vbkVycm9yYCBpbnN0ZWFkLicpO1xuXHQgIH1cblx0XG5cdCAgaWYgKG9uRXJyb3IgJiYgIV91dGlscy5pcy5mdW5jKG9uRXJyb3IpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuXHQgIH1cblx0XG5cdCAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5lbWl0dGVyYCBwYXNzZWQgdG8gdGhlIFNhZ2EgbWlkZGxld2FyZSBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICB9XG5cdFxuXHQgIGZ1bmN0aW9uIHNhZ2FNaWRkbGV3YXJlKF9yZWYyKSB7XG5cdCAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmMi5nZXRTdGF0ZSxcblx0ICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXHRcblx0ICAgIHZhciBzYWdhRW1pdHRlciA9ICgwLCBfY2hhbm5lbC5lbWl0dGVyKSgpO1xuXHQgICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblx0XG5cdCAgICBzYWdhTWlkZGxld2FyZS5ydW4gPSBfcnVuU2FnYS5ydW5TYWdhLmJpbmQobnVsbCwge1xuXHQgICAgICBjb250ZXh0OiBjb250ZXh0LFxuXHQgICAgICBzdWJzY3JpYmU6IHNhZ2FFbWl0dGVyLnN1YnNjcmliZSxcblx0ICAgICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuXHQgICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG5cdCAgICAgIHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvcixcblx0ICAgICAgbG9nZ2VyOiBsb2dnZXIsXG5cdCAgICAgIG9uRXJyb3I6IG9uRXJyb3Jcblx0ICAgIH0pO1xuXHRcblx0ICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuXHQgICAgICAgIGlmIChzYWdhTW9uaXRvciAmJiBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKSB7XG5cdCAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhciByZXN1bHQgPSBuZXh0KGFjdGlvbik7IC8vIGhpdCByZWR1Y2Vyc1xuXHQgICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgICB9O1xuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignQmVmb3JlIHJ1bm5pbmcgYSBTYWdhLCB5b3UgbXVzdCBtb3VudCB0aGUgU2FnYSBtaWRkbGV3YXJlIG9uIHRoZSBTdG9yZSB1c2luZyBhcHBseU1pZGRsZXdhcmUnKTtcblx0ICB9O1xuXHRcblx0ICBzYWdhTWlkZGxld2FyZS5zZXRDb250ZXh0ID0gZnVuY3Rpb24gKHByb3BzKSB7XG5cdCAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3NhZ2FNaWRkbGV3YXJlJywgcHJvcHMpKTtcblx0ICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcblx0ICB9O1xuXHRcblx0ICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG5cdH1cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzUyOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdFxuXHR2YXIgX2lvID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQzKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZScsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZW0nLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZW07XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwdXQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8ucHV0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWxsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFsbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JhY2UnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8ucmFjZTtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbGwnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY2FsbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FwcGx5Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFwcGx5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3BzJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNwcztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZvcmsnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZm9yaztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NwYXduJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnNwYXduO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnam9pbicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5qb2luO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmNhbmNlbDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NlbGVjdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5zZWxlY3Q7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhY3Rpb25DaGFubmVsJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmFjdGlvbkNoYW5uZWw7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYW5jZWxsZWQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uY2FuY2VsbGVkO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZmx1c2gnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8uZmx1c2g7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdnZXRDb250ZXh0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLmdldENvbnRleHQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZXRDb250ZXh0Jywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX2lvLnNldENvbnRleHQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGFrZUV2ZXJ5O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby50YWtlTGF0ZXN0O1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfaW8udGhyb3R0bGU7XG5cdCAgfVxuXHR9KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc1Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRcblx0dmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fKDc0MCk7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1RBU0snLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuVEFTSztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NBR0FfQUNUSU9OJywge1xuXHQgIGVudW1lcmFibGU6IHRydWUsXG5cdCAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICByZXR1cm4gX3V0aWxzLlNBR0FfQUNUSU9OO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnbm9vcCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5ub29wO1xuXHQgIH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnaXMnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfdXRpbHMuaXM7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWZlcnJlZCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5kZWZlcnJlZDtcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FycmF5T2ZEZWZmZXJlZCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5hcnJheU9mRGVmZmVyZWQ7XG5cdCAgfVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcmVhdGVNb2NrVGFzaycsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5jcmVhdGVNb2NrVGFzaztcblx0ICB9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2Nsb25lYWJsZUdlbmVyYXRvcicsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF91dGlscy5jbG9uZWFibGVHZW5lcmF0b3I7XG5cdCAgfVxuXHR9KTtcblx0XG5cdHZhciBfaW8gPSAvKiNfX1BVUkVfXyovX193ZWJwYWNrX3JlcXVpcmVfXyg3NDMpO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhc0VmZmVjdCcsIHtcblx0ICBlbnVtZXJhYmxlOiB0cnVlLFxuXHQgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgcmV0dXJuIF9pby5hc0VmZmVjdDtcblx0ICB9XG5cdH0pO1xuXHRcblx0dmFyIF9wcm9jID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18oNzQxKTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ0hBTk5FTF9FTkQnLCB7XG5cdCAgZW51bWVyYWJsZTogdHJ1ZSxcblx0ICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgIHJldHVybiBfcHJvYy5DSEFOTkVMX0VORDtcblx0ICB9XG5cdH0pO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHRleHBvcnRzLnJlZHVjZXIgPSByZWR1Y2VyO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfY2xvbmVEZWVwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTUpO1xuXHRcblx0dmFyIF9jbG9uZURlZXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xvbmVEZWVwKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblx0XG5cdHZhciBpbml0aWFsU3RhdGUgPSB7XG5cdCAgICBzZWxlY3RBbGw6IHRydWUsXG5cdCAgICBmZXRjaGluZzogZmFsc2UsXG5cdCAgICBwcm9qZWN0c0xvYWRlZDogZmFsc2UsXG5cdCAgICBlcnJvcjogbnVsbCxcblx0ICAgIHVzZXJJZDogbnVsbCxcblx0ICAgIGdyb3VwZWRQcm9qZWN0czogW10sXG5cdCAgICBpc1Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICBvcmlnaW5hbElzUmVzdHJpY3RlZDogbnVsbCxcblx0ICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsLFxuXHQgICAgb3JpZ2luYWxTZWxlY3RBbGw6IG51bGxcblx0fTtcblx0XG5cdHZhciB1cGRhdGVQcm9qZWN0QWNjZXNzID0gZnVuY3Rpb24gdXBkYXRlUHJvamVjdEFjY2Vzcyhwcm9qZWN0SWQsIGdyb3VwZWRQcm9qZWN0cykge1xuXHQgICAgLy8gRmluZCB0aGUgY29ycmVjdCBwcm9qZWN0IGFuZCB0b2dnbGUgdGhlIHRoZSBhY2Nlc3MgZmllbGRcblx0ICAgIHJldHVybiBncm91cGVkUHJvamVjdHMgJiYgZ3JvdXBlZFByb2plY3RzLm1hcChmdW5jdGlvbiAoZ3JvdXApIHtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIGdyb3VwLCB7XG5cdCAgICAgICAgICAgIHByb2plY3RzOiBncm91cC5wcm9qZWN0cy5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgcHJvamVjdCwge1xuXHQgICAgICAgICAgICAgICAgICAgIGFjY2VzczogcHJvamVjdC5pZCA9PT0gcHJvamVjdElkID8gcHJvamVjdC5hY2Nlc3MgPSAhcHJvamVjdC5hY2Nlc3MgOiBwcm9qZWN0LmFjY2Vzc1xuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KTtcblx0fTtcblx0XG5cdHZhciB1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyA9IGZ1bmN0aW9uIHVwZGF0ZUFsbFByb2plY3RzQWNjZXNzKGFjY2VzcywgZ3JvdXBlZFByb2plY3RzKSB7XG5cdCAgICAvLyBGaW5kIHRoZSBjb3JyZWN0IHByb2plY3QgYW5kIHRvZ2dsZSB0aGUgdGhlIGFjY2VzcyBmaWVsZFxuXHQgICAgcmV0dXJuIGdyb3VwZWRQcm9qZWN0cyAmJiBncm91cGVkUHJvamVjdHMubWFwKGZ1bmN0aW9uIChncm91cCkge1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgZ3JvdXAsIHtcblx0ICAgICAgICAgICAgcHJvamVjdHM6IGdyb3VwLnByb2plY3RzLm1hcChmdW5jdGlvbiAocHJvamVjdCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBwcm9qZWN0LCB7XG5cdCAgICAgICAgICAgICAgICAgICAgYWNjZXNzOiBhY2Nlc3Ncblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0pO1xuXHQgICAgfSk7XG5cdH07XG5cdFxuXHR2YXIgY2xvbmVTdGF0ZSA9IGZ1bmN0aW9uIGNsb25lU3RhdGUob2JqKSB7XG5cdCAgICByZXR1cm4gb2JqICYmICgwLCBfY2xvbmVEZWVwMi5kZWZhdWx0KShvYmopO1xuXHR9O1xuXHRcblx0ZnVuY3Rpb24gcmVkdWNlcigpIHtcblx0ICAgIHZhciBfcmVkdWNlckFjdGlvbnM7XG5cdFxuXHQgICAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBpbml0aWFsU3RhdGU7XG5cdCAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHZhciByZWR1Y2VyQWN0aW9ucyA9IChfcmVkdWNlckFjdGlvbnMgPSB7fSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5TRVRfU1RPUkUsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIGRhdGEgPSBhY3Rpb24uZGF0YTtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBkYXRhKTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9HRVRfSU5JVCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7IGZldGNoaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9HRVRfU1VDQ0VTUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgX2FjdGlvbiRkYXRhID0gYWN0aW9uLmRhdGEsXG5cdCAgICAgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9hY3Rpb24kZGF0YS51c2VyX3Byb2plY3RzLmlzX3Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cyA9IF9hY3Rpb24kZGF0YS5vcmdhbmlzYXRpb25fZ3JvdXBzO1xuXHRcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgcHJvamVjdHNMb2FkZWQ6IHRydWUsXG5cdCAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0czogZ3JvdXBlZFByb2plY3RzLFxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZFxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuQVBJX0dFVF9GQUlMVVJFLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcblx0ICAgICAgICAgICAgZmV0Y2hpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICBncm91cGVkUHJvamVjdHM6IFtdLFxuXHQgICAgICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfUFVUX0lOSVQsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuXHQgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcblx0ICAgICAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgICAgICB9KTtcblx0ICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZHVjZXJBY3Rpb25zLCBjLkFQSV9QVVRfU1VDQ0VTUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgX2FjdGlvbiRkYXRhMiA9IGFjdGlvbi5kYXRhLFxuXHQgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQgPSBfYWN0aW9uJGRhdGEyLnVzZXJfcHJvamVjdHMuaXNfcmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzID0gX2FjdGlvbiRkYXRhMi5vcmdhbmlzYXRpb25fZ3JvdXBzO1xuXHRcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgaXNSZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsSXNSZXN0cmljdGVkOiBudWxsLFxuXHQgICAgICAgICAgICBncm91cGVkUHJvamVjdHM6IGdyb3VwZWRQcm9qZWN0cyxcblx0ICAgICAgICAgICAgb3JpZ2luYWxHcm91cGVkUHJvamVjdHM6IG51bGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsU2VsZWN0QWxsOiBudWxsXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5BUElfUFVUX0ZBSUxVUkUsIGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG5cdCAgICAgICAgdmFyIG5ld1N0YXRlID0gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IG51bGwsXG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsLFxuXHQgICAgICAgICAgICBvcmlnaW5hbFNlbGVjdEFsbDogbnVsbCxcblx0ICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIC8vIE92ZXJ3cml0ZSBpZiB3ZSBoYXZlIGFuIG9yaWdpbmFsIHZhbHVlXG5cdCAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsSXNSZXN0cmljdGVkICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgIG5ld1N0YXRlLmlzUmVzdHJpY3RlZCA9IHN0YXRlLm9yaWdpbmFsSXNSZXN0cmljdGVkO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxHcm91cGVkUHJvamVjdHMgIT09IG51bGwpIHtcblx0ICAgICAgICAgICAgbmV3U3RhdGUuZ3JvdXBlZFByb2plY3RzID0gc3RhdGUub3JpZ2luYWxHcm91cGVkUHJvamVjdHM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbFNlbGVjdEFsbCAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICBuZXdTdGF0ZS5zZWxlY3RBbGwgPSBzdGF0ZS5vcmlnaW5hbFNlbGVjdEFsbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXHQgICAgfSksIF9kZWZpbmVQcm9wZXJ0eShfcmVkdWNlckFjdGlvbnMsIGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLCBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuXHQgICAgICAgIHZhciBwcm9qZWN0SWQgPSBhY3Rpb24uZGF0YS5wcm9qZWN0SWQ7XG5cdFxuXHQgICAgICAgIHZhciBncm91cGVkUHJvamVjdHMgPSB1cGRhdGVQcm9qZWN0QWNjZXNzKHByb2plY3RJZCwgY2xvbmVTdGF0ZShzdGF0ZS5ncm91cGVkUHJvamVjdHMpKTtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBjbG9uZVN0YXRlKHN0YXRlLmdyb3VwZWRQcm9qZWN0cyksXG5cdCAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0czogZ3JvdXBlZFByb2plY3RzXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgaXNSZXN0cmljdGVkID0gYWN0aW9uLmRhdGEuaXNSZXN0cmljdGVkO1xuXHRcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIGlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkLFxuXHQgICAgICAgICAgICBvcmlnaW5hbElzUmVzdHJpY3RlZDogc3RhdGUuaXNSZXN0cmljdGVkXG5cdCAgICAgICAgfSk7XG5cdCAgICB9KSwgX2RlZmluZVByb3BlcnR5KF9yZWR1Y2VyQWN0aW9ucywgYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUywgZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcblx0ICAgICAgICB2YXIgZ3JvdXBlZFByb2plY3RzID0gdXBkYXRlQWxsUHJvamVjdHNBY2Nlc3Moc3RhdGUuc2VsZWN0QWxsLCBzdGF0ZS5ncm91cGVkUHJvamVjdHMpO1xuXHRcblx0ICAgICAgICB2YXIgX3N0YXRlID0gX2V4dGVuZHMoe30sIHN0YXRlKSxcblx0ICAgICAgICAgICAgc2VsZWN0QWxsID0gX3N0YXRlLnNlbGVjdEFsbDtcblx0XG5cdCAgICAgICAgc2VsZWN0QWxsID0gIXNlbGVjdEFsbDtcblx0ICAgICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG5cdCAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBjbG9uZVN0YXRlKHN0YXRlLmdyb3VwZWRQcm9qZWN0cyksXG5cdCAgICAgICAgICAgIG9yaWdpbmFsU2VsZWN0QWxsOiBzdGF0ZS5zZWxlY3RBbGwsXG5cdCAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0czogZ3JvdXBlZFByb2plY3RzLFxuXHQgICAgICAgICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbFxuXHQgICAgICAgIH0pO1xuXHQgICAgfSksIF9yZWR1Y2VyQWN0aW9ucyk7XG5cdCAgICBpZiAocmVkdWNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoYWN0aW9uLnR5cGUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHJlZHVjZXJBY3Rpb25zW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIHN0YXRlO1xuXHQgICAgfVxuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VDbG9uZSA9IF9fd2VicGFja19yZXF1aXJlX18oNzU2KTtcblx0XG5cdC8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG5cdHZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuXHQgICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblx0XG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmNsb25lYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBjbG9uZXMgYHZhbHVlYC5cblx0ICpcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgX1xuXHQgKiBAc2luY2UgMS4wLjBcblx0ICogQGNhdGVnb3J5IExhbmdcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmVjdXJzaXZlbHkgY2xvbmUuXG5cdCAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cblx0ICogQHNlZSBfLmNsb25lXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuXHQgKlxuXHQgKiB2YXIgZGVlcCA9IF8uY2xvbmVEZWVwKG9iamVjdHMpO1xuXHQgKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcblx0ICogLy8gPT4gZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuXHQgIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX0RFRVBfRkxBRyB8IENMT05FX1NZTUJPTFNfRkxBRyk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY2xvbmVEZWVwO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIFN0YWNrID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNjYpLFxuXHQgICAgYXJyYXlFYWNoID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTcpLFxuXHQgICAgYXNzaWduVmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc1OCksXG5cdCAgICBiYXNlQXNzaWduID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTkpLFxuXHQgICAgYmFzZUFzc2lnbkluID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjEpLFxuXHQgICAgY2xvbmVCdWZmZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NSksXG5cdCAgICBjb3B5QXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2NiksXG5cdCAgICBjb3B5U3ltYm9scyA9IF9fd2VicGFja19yZXF1aXJlX18oNzY3KSxcblx0ICAgIGNvcHlTeW1ib2xzSW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc2OCksXG5cdCAgICBnZXRBbGxLZXlzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MDkpLFxuXHQgICAgZ2V0QWxsS2V5c0luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzApLFxuXHQgICAgZ2V0VGFnID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MTUpLFxuXHQgICAgaW5pdENsb25lQXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3MSksXG5cdCAgICBpbml0Q2xvbmVCeVRhZyA9IF9fd2VicGFja19yZXF1aXJlX18oNzcyKSxcblx0ICAgIGluaXRDbG9uZU9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzc4KSxcblx0ICAgIGlzQXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0OSksXG5cdCAgICBpc0J1ZmZlciA9IF9fd2VicGFja19yZXF1aXJlX18oMzUwKSxcblx0ICAgIGlzTWFwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODApLFxuXHQgICAgaXNPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMzMiksXG5cdCAgICBpc1NldCA9IF9fd2VicGFja19yZXF1aXJlX18oNzgyKSxcblx0ICAgIGtleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0NCk7XG5cdFxuXHQvKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xuXHR2YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcblx0ICAgIENMT05FX0ZMQVRfRkxBRyA9IDIsXG5cdCAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXHRcblx0LyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xuXHR2YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuXHQgICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuXHQgICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcblx0ICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG5cdCAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG5cdCAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcblx0ICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG5cdCAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcblx0ICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuXHQgICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG5cdCAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcblx0ICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuXHQgICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG5cdCAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcblx0ICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cdFxuXHR2YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuXHQgICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuXHQgICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuXHQgICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuXHQgICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuXHQgICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG5cdCAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcblx0ICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuXHQgICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcblx0ICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG5cdCAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXHRcblx0LyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cblx0dmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcblx0Y2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cblx0Y2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5cdGNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGVUYWddID1cblx0Y2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuXHRjbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuXHRjbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9XG5cdGNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5cdGNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5cdGNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3ltYm9sVGFnXSA9XG5cdGNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cblx0Y2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcblx0Y2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cblx0Y2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3Ncblx0ICogdHJhdmVyc2VkIG9iamVjdHMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG5cdCAqICAxIC0gRGVlcCBjbG9uZVxuXHQgKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcblx0ICogIDQgLSBDbG9uZSBzeW1ib2xzXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgcGFyZW50IG9iamVjdCBvZiBgdmFsdWVgLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cblx0ICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG5cdCAgdmFyIHJlc3VsdCxcblx0ICAgICAgaXNEZWVwID0gYml0bWFzayAmIENMT05FX0RFRVBfRkxBRyxcblx0ICAgICAgaXNGbGF0ID0gYml0bWFzayAmIENMT05FX0ZMQVRfRkxBRyxcblx0ICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblx0XG5cdCAgaWYgKGN1c3RvbWl6ZXIpIHtcblx0ICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcblx0ICB9XG5cdCAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH1cblx0ICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuXHQgICAgcmV0dXJuIHZhbHVlO1xuXHQgIH1cblx0ICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcblx0ICBpZiAoaXNBcnIpIHtcblx0ICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcblx0ICAgIGlmICghaXNEZWVwKSB7XG5cdCAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuXHQgICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cdFxuXHQgICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuXHQgICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG5cdCAgICB9XG5cdCAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG5cdCAgICAgIHJlc3VsdCA9IChpc0ZsYXQgfHwgaXNGdW5jKSA/IHt9IDogaW5pdENsb25lT2JqZWN0KHZhbHVlKTtcblx0ICAgICAgaWYgKCFpc0RlZXApIHtcblx0ICAgICAgICByZXR1cm4gaXNGbGF0XG5cdCAgICAgICAgICA/IGNvcHlTeW1ib2xzSW4odmFsdWUsIGJhc2VBc3NpZ25JbihyZXN1bHQsIHZhbHVlKSlcblx0ICAgICAgICAgIDogY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuXHQgICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuXHQgICAgICB9XG5cdCAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG5cdCAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcblx0ICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldCh2YWx1ZSk7XG5cdCAgaWYgKHN0YWNrZWQpIHtcblx0ICAgIHJldHVybiBzdGFja2VkO1xuXHQgIH1cblx0ICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cdFxuXHQgIGlmIChpc1NldCh2YWx1ZSkpIHtcblx0ICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oc3ViVmFsdWUpIHtcblx0ICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICBpZiAoaXNNYXAodmFsdWUpKSB7XG5cdCAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcblx0ICAgICAgcmVzdWx0LnNldChrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHRcblx0ICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcblx0ICAgID8gKGlzRmxhdCA/IGdldEFsbEtleXNJbiA6IGdldEFsbEtleXMpXG5cdCAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblx0XG5cdCAgdmFyIHByb3BzID0gaXNBcnIgPyB1bmRlZmluZWQgOiBrZXlzRnVuYyh2YWx1ZSk7XG5cdCAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG5cdCAgICBpZiAocHJvcHMpIHtcblx0ICAgICAga2V5ID0gc3ViVmFsdWU7XG5cdCAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcblx0ICAgIH1cblx0ICAgIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG5cdCAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuXHQgIH0pO1xuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3Jcblx0ICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cblx0ICovXG5cdGZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcblx0ICB2YXIgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIGFycmF5O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzU4OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlQXNzaWduVmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyNyksXG5cdCAgICBlcSA9IF9fd2VicGFja19yZXF1aXJlX18oMzcxKTtcblx0XG5cdC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cblx0dmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblx0XG5cdC8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblx0XG5cdC8qKlxuXHQgKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG5cdCAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG5cdCAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cblx0ICovXG5cdGZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuXHQgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuXHQgIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG5cdCAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG5cdCAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcblx0ICB9XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc1OTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY29weU9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYwKSxcblx0ICAgIGtleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0NCk7XG5cdFxuXHQvKipcblx0ICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcblx0ICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuXHQgIHJldHVybiBvYmplY3QgJiYgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFzc2lnblZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTgpLFxuXHQgICAgYmFzZUFzc2lnblZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMjcpO1xuXHRcblx0LyoqXG5cdCAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuXHQgIHZhciBpc05ldyA9ICFvYmplY3Q7XG5cdCAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cdFxuXHQgIHZhciBpbmRleCA9IC0xLFxuXHQgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cdFxuXHQgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXHRcblx0ICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcblx0ICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcblx0ICAgICAgOiB1bmRlZmluZWQ7XG5cdFxuXHQgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcblx0ICAgIH1cblx0ICAgIGlmIChpc05ldykge1xuXHQgICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiBvYmplY3Q7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzYxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBjb3B5T2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjApLFxuXHQgICAga2V5c0luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjIpO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcblx0ICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUFzc2lnbkluKG9iamVjdCwgc291cmNlKSB7XG5cdCAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFycmF5TGlrZUtleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0NSksXG5cdCAgICBiYXNlS2V5c0luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjMpLFxuXHQgICAgaXNBcnJheUxpa2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM2MSk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cblx0ICpcblx0ICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDMuMC4wXG5cdCAqIEBjYXRlZ29yeSBPYmplY3Rcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiBmdW5jdGlvbiBGb28oKSB7XG5cdCAqICAgdGhpcy5hID0gMTtcblx0ICogICB0aGlzLmIgPSAyO1xuXHQgKiB9XG5cdCAqXG5cdCAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG5cdCAqXG5cdCAqIF8ua2V5c0luKG5ldyBGb28pO1xuXHQgKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcblx0ICovXG5cdGZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcblx0ICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Mzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgaXNPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMzMiksXG5cdCAgICBpc1Byb3RvdHlwZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU5KSxcblx0ICAgIG5hdGl2ZUtleXNJbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY0KTtcblx0XG5cdC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cblx0dmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblx0XG5cdC8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcblx0ICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcblx0ICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcblx0ICB9XG5cdCAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuXHQgICAgICByZXN1bHQgPSBbXTtcblx0XG5cdCAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHQgICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcblx0ICAgICAgcmVzdWx0LnB1c2goa2V5KTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5c0luO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuXHQgKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG5cdCAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cblx0ICovXG5cdGZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcblx0ICB2YXIgcmVzdWx0ID0gW107XG5cdCAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcblx0ICAgICAgcmVzdWx0LnB1c2goa2V5KTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzSW47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24obW9kdWxlKSB7dmFyIHJvb3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIwMik7XG5cdFxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdFxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG5cdHZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cdFxuXHQvKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xuXHR2YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblx0XG5cdC8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xuXHR2YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuXHQgICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuXHQgKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcblx0ICBpZiAoaXNEZWVwKSB7XG5cdCAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG5cdCAgfVxuXHQgIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuXHQgICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cdFxuXHQgIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcblx0XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDIxMCkobW9kdWxlKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NjY6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cblx0ICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcblx0ICB2YXIgaW5kZXggPSAtMSxcblx0ICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblx0XG5cdCAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG5cdCAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG5cdCAgfVxuXHQgIHJldHVybiBhcnJheTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY29weU9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYwKSxcblx0ICAgIGdldFN5bWJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQxMik7XG5cdFxuXHQvKipcblx0ICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cblx0ICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvcHlTeW1ib2xzKHNvdXJjZSwgb2JqZWN0KSB7XG5cdCAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc2ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY29weU9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzYwKSxcblx0ICAgIGdldFN5bWJvbHNJbiA9IF9fd2VicGFja19yZXF1aXJlX18oNzY5KTtcblx0XG5cdC8qKlxuXHQgKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb3B5U3ltYm9sc0luKHNvdXJjZSwgb2JqZWN0KSB7XG5cdCAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Njk6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFycmF5UHVzaCA9IF9fd2VicGFja19yZXF1aXJlX18oNDExKSxcblx0ICAgIGdldFByb3RvdHlwZSA9IF9fd2VicGFja19yZXF1aXJlX18oMjA2KSxcblx0ICAgIGdldFN5bWJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQxMiksXG5cdCAgICBzdHViQXJyYXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQxNCk7XG5cdFxuXHQvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG5cdHZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuXHQgKi9cblx0dmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG5cdCAgdmFyIHJlc3VsdCA9IFtdO1xuXHQgIHdoaWxlIChvYmplY3QpIHtcblx0ICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG5cdCAgICBvYmplY3QgPSBnZXRQcm90b3R5cGUob2JqZWN0KTtcblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3NzA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VHZXRBbGxLZXlzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MTApLFxuXHQgICAgZ2V0U3ltYm9sc0luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjkpLFxuXHQgICAga2V5c0luID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NjIpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcblx0ICogc3ltYm9scyBvZiBgb2JqZWN0YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuXHQgIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3MTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG5cdHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cdFxuXHQvKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cblx0dmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cdFxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cblx0ICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG5cdCAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcblx0ICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cdFxuXHQgIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG5cdCAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcblx0ICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuXHQgICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IF9fd2VicGFja19yZXF1aXJlX18oNzczKSxcblx0ICAgIGNsb25lRGF0YVZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3NCksXG5cdCAgICBjbG9uZVJlZ0V4cCA9IF9fd2VicGFja19yZXF1aXJlX18oNzc1KSxcblx0ICAgIGNsb25lU3ltYm9sID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzYpLFxuXHQgICAgY2xvbmVUeXBlZEFycmF5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzcpO1xuXHRcblx0LyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xuXHR2YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcblx0ICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG5cdCAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcblx0ICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuXHQgICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG5cdCAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcblx0ICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuXHQgICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cdFxuXHR2YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuXHQgICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuXHQgICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuXHQgICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuXHQgICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuXHQgICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG5cdCAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcblx0ICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuXHQgICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcblx0ICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG5cdCAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXHRcblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cblx0ICpcblx0ICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2Zcblx0ICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBNYXBgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIGBTZXRgLCBvciBgU3RyaW5nYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuXHQgIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuXHQgIHN3aXRjaCAodGFnKSB7XG5cdCAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuXHQgICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXHRcblx0ICAgIGNhc2UgYm9vbFRhZzpcblx0ICAgIGNhc2UgZGF0ZVRhZzpcblx0ICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXHRcblx0ICAgIGNhc2UgZGF0YVZpZXdUYWc6XG5cdCAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblx0XG5cdCAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcblx0ICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcblx0ICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG5cdCAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXHRcblx0ICAgIGNhc2UgbWFwVGFnOlxuXHQgICAgICByZXR1cm4gbmV3IEN0b3I7XG5cdFxuXHQgICAgY2FzZSBudW1iZXJUYWc6XG5cdCAgICBjYXNlIHN0cmluZ1RhZzpcblx0ICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cdFxuXHQgICAgY2FzZSByZWdleHBUYWc6XG5cdCAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXHRcblx0ICAgIGNhc2Ugc2V0VGFnOlxuXHQgICAgICByZXR1cm4gbmV3IEN0b3I7XG5cdFxuXHQgICAgY2FzZSBzeW1ib2xUYWc6XG5cdCAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuXHQgIH1cblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzczOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBVaW50OEFycmF5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MDUpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuXHQgKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG5cdCAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcblx0ICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBjbG9uZUFycmF5QnVmZmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NzMpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cblx0ICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cblx0ICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIGRhdGEgdmlldy5cblx0ICovXG5cdGZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuXHQgIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlcikgOiBkYXRhVmlldy5idWZmZXI7XG5cdCAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3NTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cblx0dmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgcmVnZXhwLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG5cdCAgdmFyIHJlc3VsdCA9IG5ldyByZWdleHAuY29uc3RydWN0b3IocmVnZXhwLnNvdXJjZSwgcmVGbGFncy5leGVjKHJlZ2V4cCkpO1xuXHQgIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc3Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgU3ltYm9sID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMDEpO1xuXHRcblx0LyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG5cdHZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG5cdCAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuXHQgIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGNsb25lQXJyYXlCdWZmZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3Myk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG5cdCAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG5cdCAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3Nzg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VDcmVhdGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc3OSksXG5cdCAgICBnZXRQcm90b3R5cGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIwNiksXG5cdCAgICBpc1Byb3RvdHlwZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU5KTtcblx0XG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cblx0ICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG5cdCAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG5cdCAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG5cdCAgICA6IHt9O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzc5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBpc09iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzMyKTtcblx0XG5cdC8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xuXHR2YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG5cdCAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG5cdCAqL1xuXHR2YXIgYmFzZUNyZWF0ZSA9IChmdW5jdGlvbigpIHtcblx0ICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuXHQgIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuXHQgICAgaWYgKCFpc09iamVjdChwcm90bykpIHtcblx0ICAgICAgcmV0dXJuIHt9O1xuXHQgICAgfVxuXHQgICAgaWYgKG9iamVjdENyZWF0ZSkge1xuXHQgICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcblx0ICAgIH1cblx0ICAgIG9iamVjdC5wcm90b3R5cGUgPSBwcm90bztcblx0ICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuXHQgICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfTtcblx0fSgpKTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBiYXNlSXNNYXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4MSksXG5cdCAgICBiYXNlVW5hcnkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM1NiksXG5cdCAgICBub2RlVXRpbCA9IF9fd2VicGFja19yZXF1aXJlX18oMzU3KTtcblx0XG5cdC8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG5cdHZhciBub2RlSXNNYXAgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc01hcDtcblx0XG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE1hcGAgb2JqZWN0LlxuXHQgKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBfXG5cdCAqIEBzaW5jZSA0LjMuMFxuXHQgKiBAY2F0ZWdvcnkgTGFuZ1xuXHQgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogXy5pc01hcChuZXcgTWFwKTtcblx0ICogLy8gPT4gdHJ1ZVxuXHQgKlxuXHQgKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcblx0ICogLy8gPT4gZmFsc2Vcblx0ICovXG5cdHZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBpc01hcDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzgxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBnZXRUYWcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQxNSksXG5cdCAgICBpc09iamVjdExpa2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIwOCk7XG5cdFxuXHQvKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG5cdHZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJztcblx0XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hcGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzZUlzTWFwKHZhbHVlKSB7XG5cdCAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBtYXBUYWc7XG5cdH1cblx0XG5cdG1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWFwO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODI6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGJhc2VJc1NldCA9IF9fd2VicGFja19yZXF1aXJlX18oNzgzKSxcblx0ICAgIGJhc2VVbmFyeSA9IF9fd2VicGFja19yZXF1aXJlX18oMzU2KSxcblx0ICAgIG5vZGVVdGlsID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNTcpO1xuXHRcblx0LyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cblx0dmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXHRcblx0LyoqXG5cdCAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG5cdCAqXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIF9cblx0ICogQHNpbmNlIDQuMy4wXG5cdCAqIEBjYXRlZ29yeSBMYW5nXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiBfLmlzU2V0KG5ldyBTZXQpO1xuXHQgKiAvLyA9PiB0cnVlXG5cdCAqXG5cdCAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuXHQgKiAvLyA9PiBmYWxzZVxuXHQgKi9cblx0dmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODM6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGdldFRhZyA9IF9fd2VicGFja19yZXF1aXJlX18oNDE1KSxcblx0ICAgIGlzT2JqZWN0TGlrZSA9IF9fd2VicGFja19yZXF1aXJlX18oMjA4KTtcblx0XG5cdC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cblx0dmFyIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXHRcblx0LyoqXG5cdCAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzU2V0YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc2V0LCBlbHNlIGBmYWxzZWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNlSXNTZXQodmFsdWUpIHtcblx0ICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IHNldFRhZztcblx0fVxuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNTZXQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4NDpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgICAgdmFsdWU6IHRydWVcblx0fSk7XG5cdGV4cG9ydHMuZ2V0SXNSZXN0cmljdGVkID0gZXhwb3J0cy5nZXRVc2VySWQgPSBleHBvcnRzLmZpbHRlclByb2plY3RzID0gdW5kZWZpbmVkO1xuXHRleHBvcnRzLmZldGNoRGF0YSA9IGZldGNoRGF0YTtcblx0ZXhwb3J0cy5wdXREYXRhID0gcHV0RGF0YTtcblx0ZXhwb3J0cy5nZXRTYWdhID0gZ2V0U2FnYTtcblx0ZXhwb3J0cy5wdXRTYWdhID0gcHV0U2FnYTtcblx0ZXhwb3J0cy53YXRjaGVyU2FnYSA9IHdhdGNoZXJTYWdhO1xuXHRcblx0X193ZWJwYWNrX3JlcXVpcmVfXyg3ODUpO1xuXHRcblx0dmFyIF9lZmZlY3RzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3NTIpO1xuXHRcblx0dmFyIF9heGlvcyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg2KTtcblx0XG5cdHZhciBfYXhpb3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXhpb3MpO1xuXHRcblx0dmFyIF9jb25zdCA9IF9fd2VicGFja19yZXF1aXJlX18oNzM3KTtcblx0XG5cdHZhciBjID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2NvbnN0KTtcblx0XG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyNCk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdHZhciBfbWFya2VkID0gLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKGdldFNhZ2EpLFxuXHQgICAgX21hcmtlZDIgPSAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsocHV0U2FnYSksXG5cdCAgICBfbWFya2VkMyA9IC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayh3YXRjaGVyU2FnYSk7IC8qXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFxuXHQvLyBUaGlzIGltcG9ydCBpcyBuZWNlc3NhcnkgdG8gYmUgYWJsZSB0byB0ZXN0IHNhZ2FzLlxuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4LXNhZ2EvcmVkdXgtc2FnYS9pc3N1ZXMvMjgwI2lzc3VlY29tbWVudC0yOTExMzMwMjNcblx0XG5cdFxuXHRmdW5jdGlvbiBjYWxsQXhpb3MoY29uZmlnKSB7XG5cdCAgICByZXR1cm4gKDAsIF9heGlvczIuZGVmYXVsdCkoY29uZmlnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHQgICAgICAgIHJldHVybiB7IHJlc3BvbnNlOiByZXNwb25zZSB9O1xuXHQgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdCAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yIH07XG5cdCAgICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG5cdCAgICAgICAgdXJsOiBcIi9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzL1wiICsgdXNlcklkICsgXCIvXCJcblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHB1dERhdGEodXNlcklkLCBpc1Jlc3RyaWN0ZWQsIHByb2plY3RzV2l0aEFjY2Vzcykge1xuXHQgICAgdmFyIGNvbmZpZyA9IHtcblx0ICAgICAgICBtZXRob2Q6IFwicGF0Y2hcIixcblx0ICAgICAgICBoZWFkZXJzOiB7XG5cdCAgICAgICAgICAgIFwiWC1DU1JGVG9rZW5cIjogKDAsIF91dGlscy5nZXRDb29raWUpKFwiY3NyZnRva2VuXCIpXG5cdCAgICAgICAgfSxcblx0ICAgICAgICB1cmw6IFwiL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvXCIgKyB1c2VySWQgKyBcIi9cIixcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcblx0ICAgICAgICAgICAgICAgIGlzX3Jlc3RyaWN0ZWQ6IGlzUmVzdHJpY3RlZCxcblx0ICAgICAgICAgICAgICAgIHByb2plY3RzOiBwcm9qZWN0c1dpdGhBY2Nlc3Ncblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFNhZ2EoYWN0aW9uKSB7XG5cdCAgICB2YXIgdXNlcklkLCBfcmVmLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGdldFNhZ2EkKF9jb250ZXh0KSB7XG5cdCAgICAgICAgd2hpbGUgKDEpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IGFjdGlvbi5kYXRhLnVzZXJJZDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKGZldGNoRGF0YSwgdXNlcklkKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9jb250ZXh0LnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmLnJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGVycm9yID0gX3JlZi5lcnJvcjtcblx0XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKHsgdHlwZTogYy5BUElfR0VUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxMztcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3I6IGVycm9yIH0pO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xuXHR9XG5cdFxuXHR2YXIgZmlsdGVyUHJvamVjdHMgPSBleHBvcnRzLmZpbHRlclByb2plY3RzID0gZnVuY3Rpb24gZmlsdGVyUHJvamVjdHMoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS5ncm91cGVkUHJvamVjdHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGdyb3VwKSB7XG5cdCAgICAgICAgcmV0dXJuIGFjYy5jb25jYXQoZ3JvdXAucHJvamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChwcm9qZWN0KSB7XG5cdCAgICAgICAgICAgIHJldHVybiBwcm9qZWN0LmFjY2Vzcztcblx0ICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKHByb2plY3QpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHByb2plY3QuaWQ7XG5cdCAgICAgICAgfSkpO1xuXHQgICAgfSwgW10pO1xuXHR9O1xuXHRcblx0dmFyIGdldFVzZXJJZCA9IGV4cG9ydHMuZ2V0VXNlcklkID0gZnVuY3Rpb24gZ2V0VXNlcklkKHN0YXRlKSB7XG5cdCAgICByZXR1cm4gc3RhdGUudXNlcklkO1xuXHR9O1xuXHR2YXIgZ2V0SXNSZXN0cmljdGVkID0gZXhwb3J0cy5nZXRJc1Jlc3RyaWN0ZWQgPSBmdW5jdGlvbiBnZXRJc1Jlc3RyaWN0ZWQoc3RhdGUpIHtcblx0ICAgIHJldHVybiBzdGF0ZS5pc1Jlc3RyaWN0ZWQ7XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBwdXRTYWdhKGFjdGlvbikge1xuXHQgICAgdmFyIHVzZXJJZCwgaXNSZXN0cmljdGVkLCBwcm9qZWN0c1dpdGhBY2Nlc3MsIF9yZWYyLCByZXNwb25zZSwgZXJyb3I7XG5cdFxuXHQgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIHB1dFNhZ2EkKF9jb250ZXh0Mikge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQyLnByZXYgPSBfY29udGV4dDIubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfSU5JVCB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuc2VsZWN0KShnZXRVc2VySWQpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBfY29udGV4dDIuc2VudDtcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDc7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGdldElzUmVzdHJpY3RlZCk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA3OlxuXHQgICAgICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZCA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTA7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5zZWxlY3QpKGZpbHRlclByb2plY3RzKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwOlxuXHQgICAgICAgICAgICAgICAgICAgIHByb2plY3RzV2l0aEFjY2VzcyA9IF9jb250ZXh0Mi5zZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTM7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShwdXREYXRhLCB1c2VySWQsIGlzUmVzdHJpY3RlZCwgcHJvamVjdHNXaXRoQWNjZXNzKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gX2NvbnRleHQyLnNlbnQ7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfcmVmMi5yZXNwb25zZTtcblx0ICAgICAgICAgICAgICAgICAgICBlcnJvciA9IF9yZWYyLmVycm9yO1xuXHRcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjE7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxOTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoeyB0eXBlOiBjLkFQSV9QVVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE5OlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDIzO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KSh7IHR5cGU6IGMuQVBJX1BVVF9GQUlMVVJFLCBlcnJvcjogZXJyb3IgfSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSAyMzpcblx0ICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQyLnN0b3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0sIF9tYXJrZWQyLCB0aGlzKTtcblx0fVxuXHRcblx0Ly8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2Fcblx0ZnVuY3Rpb24gd2F0Y2hlclNhZ2EoKSB7XG5cdCAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gd2F0Y2hlclNhZ2EkKF9jb250ZXh0Mykge1xuXHQgICAgICAgIHdoaWxlICgxKSB7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQzLnByZXYgPSBfY29udGV4dDMubmV4dCkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VMYXRlc3QpKGMuQVBJX0dFVF9JTklULCBnZXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA0O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04sIHB1dFNhZ2EpO1xuXHRcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDY7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy50YWtlTGF0ZXN0KShjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcblx0XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA4O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUxhdGVzdCkoYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCwgcHV0U2FnYSk7XG5cdFxuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuc3RvcCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSwgX21hcmtlZDMsIHRoaXMpO1xuXHR9XG5cbi8qKiovIH0pLFxuXG4vKioqLyA3ODU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cblx0ICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cblx0ICpcblx0ICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG5cdCAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cblx0ICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG5cdCAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cblx0ICovXG5cdFxuXHQhKGZ1bmN0aW9uKGdsb2JhbCkge1xuXHQgIFwidXNlIHN0cmljdFwiO1xuXHRcblx0ICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuXHQgIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcblx0ICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cblx0ICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuXHQgIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG5cdCAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcblx0ICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXHRcblx0ICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuXHQgIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcblx0ICBpZiAocnVudGltZSkge1xuXHQgICAgaWYgKGluTW9kdWxlKSB7XG5cdCAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcblx0ICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cblx0ICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuXHQgICAgfVxuXHQgICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuXHQgICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0XG5cdCAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG5cdCAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuXHQgIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXHRcblx0ICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG5cdCAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cblx0ICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuXHQgICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcblx0ICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXHRcblx0ICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcblx0ICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cblx0ICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblx0XG5cdCAgICByZXR1cm4gZ2VuZXJhdG9yO1xuXHQgIH1cblx0ICBydW50aW1lLndyYXAgPSB3cmFwO1xuXHRcblx0ICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cblx0ICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcblx0ICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcblx0ICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG5cdCAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuXHQgIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcblx0ICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuXHQgIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuXHQgIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcblx0ICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG5cdCAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG5cdCAgICB0cnkge1xuXHQgICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG5cdCAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG5cdCAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG5cdCAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcblx0ICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXHRcblx0ICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG5cdCAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuXHQgIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cdFxuXHQgIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuXHQgIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuXHQgIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG5cdCAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuXHQgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cblx0ICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cdFxuXHQgIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcblx0ICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuXHQgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXHQgIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdFxuXHQgIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcblx0ICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG5cdCAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG5cdCAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuXHQgICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG5cdCAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuXHQgICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuXHQgICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcblx0ICB9XG5cdFxuXHQgIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG5cdCAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG5cdCAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcblx0ICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuXHQgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG5cdCAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblx0XG5cdCAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcblx0ICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuXHQgIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcblx0ICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuXHQgICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuXHQgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuXHQgICAgICB9O1xuXHQgICAgfSk7XG5cdCAgfVxuXHRcblx0ICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcblx0ICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3Rvcjtcblx0ICAgIHJldHVybiBjdG9yXG5cdCAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcblx0ICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG5cdCAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuXHQgICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuXHQgICAgICA6IGZhbHNlO1xuXHQgIH07XG5cdFxuXHQgIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuXHQgICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuXHQgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG5cdCAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcblx0ICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG5cdCAgICByZXR1cm4gZ2VuRnVuO1xuXHQgIH07XG5cdFxuXHQgIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuXHQgIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG5cdCAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuXHQgIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG5cdCAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuXHQgICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG5cdCAgfTtcblx0XG5cdCAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcblx0ICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG5cdCAgICAgICAgaWYgKHZhbHVlICYmXG5cdCAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuXHQgICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG5cdCAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuXHQgICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG5cdCAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuXHQgICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG5cdCAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuXHQgICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcblx0ICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG5cdCAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG5cdCAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG5cdCAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcblx0ICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuXHQgICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcblx0ICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuXHQgICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuXHQgICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuXHQgICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG5cdCAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cblx0ICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcblx0ICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcblx0ICAgICAgICB9LCByZWplY3QpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblx0XG5cdCAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG5cdCAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuXHQgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG5cdCAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuXHQgICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuXHQgICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcblx0ICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuXHQgICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuXHQgICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG5cdCAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuXHQgICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG5cdCAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcblx0ICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuXHQgICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG5cdCAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuXHQgICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuXHQgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG5cdCAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuXHQgICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuXHQgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcblx0ICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuXHQgICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG5cdCAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuXHQgIH1cblx0XG5cdCAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblx0ICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdCAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblx0XG5cdCAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuXHQgIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuXHQgIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuXHQgIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuXHQgICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcblx0ICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcblx0ICAgICk7XG5cdFxuXHQgICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuXHQgICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuXHQgICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdCAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcblx0ICAgICAgICB9KTtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcblx0ICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cdFxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuXHQgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuXHQgICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgdGhyb3cgYXJnO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcblx0ICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG5cdCAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXHRcblx0ICAgICAgd2hpbGUgKHRydWUpIHtcblx0ICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuXHQgICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuXHQgICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cdCAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcblx0ICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcblx0ICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuXHQgICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG5cdCAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuXHQgICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXHRcblx0ICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuXHQgICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXHQgICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblx0XG5cdCAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXHQgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuXHQgICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuXHQgICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuXHQgICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcblx0ICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuXHQgICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cdFxuXHQgICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcblx0ICAgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG5cdCAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuXHQgICAgICAgICAgfTtcblx0XG5cdCAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXHQgICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuXHQgICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cblx0ICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICB9XG5cdFxuXHQgIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuXHQgIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcblx0ICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcblx0ICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cblx0ICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG5cdCAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuXHQgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuXHQgICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuXHQgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblx0XG5cdCAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuXHQgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuXHQgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuXHQgICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblx0XG5cdCAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuXHQgICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cblx0ICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcblx0ICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG5cdCAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cdFxuXHQgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG5cdCAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblx0XG5cdCAgICBpZiAoISBpbmZvKSB7XG5cdCAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuXHQgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcblx0ICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cdCAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChpbmZvLmRvbmUpIHtcblx0ICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3Jhcnlcblx0ICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cblx0ICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cdFxuXHQgICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG5cdCAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cdFxuXHQgICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcblx0ICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuXHQgICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuXHQgICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcblx0ICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcblx0ICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuXHQgICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcblx0ICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuXHQgICAgICB9XG5cdFxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuXHQgICAgICByZXR1cm4gaW5mbztcblx0ICAgIH1cblx0XG5cdCAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuXHQgICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cblx0ICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXHQgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgfVxuXHRcblx0ICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuXHQgIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cblx0ICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXHRcblx0ICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXHRcblx0ICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuXHQgIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG5cdCAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3Jcblx0ICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cblx0ICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cblx0ICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH07XG5cdFxuXHQgIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcblx0ICB9O1xuXHRcblx0ICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuXHQgICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblx0XG5cdCAgICBpZiAoMSBpbiBsb2NzKSB7XG5cdCAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoMiBpbiBsb2NzKSB7XG5cdCAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuXHQgICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG5cdCAgICB9XG5cdFxuXHQgICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuXHQgIH1cblx0XG5cdCAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuXHQgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG5cdCAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG5cdCAgICBkZWxldGUgcmVjb3JkLmFyZztcblx0ICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG5cdCAgfVxuXHRcblx0ICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG5cdCAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcblx0ICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cblx0ICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cblx0ICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG5cdCAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG5cdCAgICB0aGlzLnJlc2V0KHRydWUpO1xuXHQgIH1cblx0XG5cdCAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdCAgICB2YXIga2V5cyA9IFtdO1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHQgICAgICBrZXlzLnB1c2goa2V5KTtcblx0ICAgIH1cblx0ICAgIGtleXMucmV2ZXJzZSgpO1xuXHRcblx0ICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG5cdCAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuXHQgICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuXHQgICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuXHQgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuXHQgICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuXHQgICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cblx0ICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblx0ICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICB9O1xuXHQgIH07XG5cdFxuXHQgIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuXHQgICAgaWYgKGl0ZXJhYmxlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcblx0ICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuXHQgICAgICAgIHJldHVybiBpdGVyYWJsZTtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG5cdCAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcblx0ICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG5cdCAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuXHQgICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblx0XG5cdCAgICAgICAgICByZXR1cm4gbmV4dDtcblx0ICAgICAgICB9O1xuXHRcblx0ICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHRcblx0ICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cblx0ICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcblx0ICB9XG5cdCAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cdFxuXHQgIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG5cdCAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG5cdCAgfVxuXHRcblx0ICBDb250ZXh0LnByb3RvdHlwZSA9IHtcblx0ICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXHRcblx0ICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG5cdCAgICAgIHRoaXMucHJldiA9IDA7XG5cdCAgICAgIHRoaXMubmV4dCA9IDA7XG5cdCAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG5cdCAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG5cdCAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG5cdCAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuXHQgICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblx0XG5cdCAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG5cdCAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cdFxuXHQgICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcblx0ICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcblx0ICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG5cdCAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG5cdCAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcblx0ICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG5cdCAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHRcblx0ICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuXHQgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXHRcblx0ICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcblx0ICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcblx0ICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG5cdCAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG5cdCAgICB9LFxuXHRcblx0ICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcblx0ICAgICAgaWYgKHRoaXMuZG9uZSkge1xuXHQgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuXHQgICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcblx0ICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcblx0ICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuXHQgICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblx0XG5cdCAgICAgICAgaWYgKGNhdWdodCkge1xuXHQgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcblx0ICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG5cdCAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuXHQgICAgICB9XG5cdFxuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXHRcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuXHQgICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcblx0ICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuXHQgICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cblx0ICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuXHQgICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG5cdCAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cdFxuXHQgICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcblx0ICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG5cdCAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG5cdCAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuXHQgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuXHQgICAgICAgICAgICB9XG5cdFxuXHQgICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG5cdCAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcblx0ICAgICAgICAgICAgfVxuXHRcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0XG5cdCAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuXHQgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuXHQgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG5cdCAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcblx0ICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG5cdCAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG5cdCAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuXHQgICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcblx0ICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuXHQgICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcblx0ICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG5cdCAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG5cdCAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcblx0ICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblx0XG5cdCAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcblx0ICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuXHQgICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuXHQgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuXHQgICAgfSxcblx0XG5cdCAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuXHQgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuXHQgICAgICAgIHRocm93IHJlY29yZC5hcmc7XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG5cdCAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcblx0ICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuXHQgICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcblx0ICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG5cdCAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcblx0ICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuXHQgICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgIH0sXG5cdFxuXHQgICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG5cdCAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG5cdCAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcblx0ICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuXHQgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdFxuXHQgICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcblx0ICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcblx0ICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcblx0ICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXHQgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcblx0ICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG5cdCAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgcmV0dXJuIHRocm93bjtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuXHQgICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcblx0ICAgIH0sXG5cdFxuXHQgICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcblx0ICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcblx0ICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcblx0ICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuXHQgICAgICAgIG5leHRMb2M6IG5leHRMb2Ncblx0ICAgICAgfTtcblx0XG5cdCAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcblx0ICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuXHQgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cblx0ICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG5cdCAgICB9XG5cdCAgfTtcblx0fSkoXG5cdCAgLy8gSW4gc2xvcHB5IG1vZGUsIHVuYm91bmQgYHRoaXNgIHJlZmVycyB0byB0aGUgZ2xvYmFsIG9iamVjdCwgZmFsbGJhY2sgdG9cblx0ICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG5cdCAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cblx0ICAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg3KTtcblxuLyoqKi8gfSksXG5cbi8qKiovIDc4Nzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdHZhciBiaW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODkpO1xuXHR2YXIgQXhpb3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5MSk7XG5cdHZhciBkZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNzkyKTtcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3Ncblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2Vcblx0ICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG5cdCAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG5cdCAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cdFxuXHQgIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG5cdCAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXHRcblx0ICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2Vcblx0ICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXHRcblx0ICByZXR1cm4gaW5zdGFuY2U7XG5cdH1cblx0XG5cdC8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuXHR2YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cdFxuXHQvLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2Vcblx0YXhpb3MuQXhpb3MgPSBBeGlvcztcblx0XG5cdC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcblx0YXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG5cdCAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xuXHR9O1xuXHRcblx0Ly8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5cdGF4aW9zLkNhbmNlbCA9IF9fd2VicGFja19yZXF1aXJlX18oODA5KTtcblx0YXhpb3MuQ2FuY2VsVG9rZW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgxMCk7XG5cdGF4aW9zLmlzQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4MDYpO1xuXHRcblx0Ly8gRXhwb3NlIGFsbC9zcHJlYWRcblx0YXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG5cdCAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0fTtcblx0YXhpb3Muc3ByZWFkID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4MTEpO1xuXHRcblx0bW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblx0XG5cdC8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxuXHRtb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc4ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oNzg5KTtcblx0dmFyIGlzQnVmZmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTApO1xuXHRcblx0LypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cdFxuXHQvLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXHRcblx0dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG5cdCAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuXHQgIHZhciByZXN1bHQ7XG5cdCAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuXHQgICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc051bWJlcih2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcblx0ICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3Rcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuXHQgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG5cdCAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcblx0ICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcblx0ICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcblx0ICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xuXHR9XG5cdFxuXHQvKipcblx0ICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2Vcblx0ICovXG5cdGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG5cdCAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuXHQgKlxuXHQgKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuXHQgKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG5cdCAqXG5cdCAqIHdlYiB3b3JrZXJzOlxuXHQgKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcblx0ICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcblx0ICpcblx0ICogcmVhY3QtbmF0aXZlOlxuXHQgKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG5cdCAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIHJldHVybiAoXG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuXHQgICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuXHQgICk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cblx0ICpcblx0ICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuXHQgKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cblx0ICpcblx0ICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3Npbmdcblx0ICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuXHQgKi9cblx0ZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG5cdCAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG5cdCAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0XG5cdCAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG5cdCAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG5cdCAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAgIG9iaiA9IFtvYmpdO1xuXHQgIH1cblx0XG5cdCAgaWYgKGlzQXJyYXkob2JqKSkge1xuXHQgICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuXHQgICAgfVxuXHQgIH0gZWxzZSB7XG5cdCAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0ICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcblx0ICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG5cdCAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuXHQgKlxuXHQgKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuXHQgKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG5cdCAqXG5cdCAqIEV4YW1wbGU6XG5cdCAqXG5cdCAqIGBgYGpzXG5cdCAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcblx0ICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG5cdCAqIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2Vcblx0ICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRmdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcblx0ICB2YXIgcmVzdWx0ID0ge307XG5cdCAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcblx0ICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXN1bHRba2V5XSA9IHZhbDtcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcblx0ICB9XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuXHQgKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cblx0ICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG5cdCAqL1xuXHRmdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuXHQgIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcblx0ICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYVtrZXldID0gdmFsO1xuXHQgICAgfVxuXHQgIH0pO1xuXHQgIHJldHVybiBhO1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICBpc0FycmF5OiBpc0FycmF5LFxuXHQgIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG5cdCAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuXHQgIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG5cdCAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuXHQgIGlzU3RyaW5nOiBpc1N0cmluZyxcblx0ICBpc051bWJlcjogaXNOdW1iZXIsXG5cdCAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuXHQgIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcblx0ICBpc0RhdGU6IGlzRGF0ZSxcblx0ICBpc0ZpbGU6IGlzRmlsZSxcblx0ICBpc0Jsb2I6IGlzQmxvYixcblx0ICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuXHQgIGlzU3RyZWFtOiBpc1N0cmVhbSxcblx0ICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG5cdCAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuXHQgIGZvckVhY2g6IGZvckVhY2gsXG5cdCAgbWVyZ2U6IG1lcmdlLFxuXHQgIGV4dGVuZDogZXh0ZW5kLFxuXHQgIHRyaW06IHRyaW1cblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzg5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuXHQgIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuXHQgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcblx0ICB9O1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTA6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyohXG5cdCAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcblx0ICpcblx0ICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cblx0ICogQGxpY2Vuc2UgIE1JVFxuXHQgKi9cblx0XG5cdC8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcblx0Ly8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG5cdCAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcblx0fVxuXHRcblx0Ly8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cblx0ZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcblx0ICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcblx0fVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTE6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGRlZmF1bHRzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTIpO1xuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdHZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwMyk7XG5cdHZhciBkaXNwYXRjaFJlcXVlc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwNCk7XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0ZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcblx0ICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG5cdCAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG5cdCAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG5cdCAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG5cdCAgfTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERpc3BhdGNoIGEgcmVxdWVzdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcblx0ICovXG5cdEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG5cdCAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG5cdCAgICBjb25maWcgPSB1dGlscy5tZXJnZSh7XG5cdCAgICAgIHVybDogYXJndW1lbnRzWzBdXG5cdCAgICB9LCBhcmd1bWVudHNbMV0pO1xuXHQgIH1cblx0XG5cdCAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblx0ICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuXHRcblx0ICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG5cdCAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcblx0ICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXHRcblx0ICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcblx0ICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG5cdCAgfSk7XG5cdFxuXHQgIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG5cdCAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuXHQgIH0pO1xuXHRcblx0ICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG5cdCAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cdFxuXHQvLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcblx0dXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG5cdCAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cblx0ICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG5cdCAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuXHQgICAgICBtZXRob2Q6IG1ldGhvZCxcblx0ICAgICAgdXJsOiB1cmxcblx0ICAgIH0pKTtcblx0ICB9O1xuXHR9KTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG5cdCAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cblx0ICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG5cdCAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuXHQgICAgICBtZXRob2Q6IG1ldGhvZCxcblx0ICAgICAgdXJsOiB1cmwsXG5cdCAgICAgIGRhdGE6IGRhdGFcblx0ICAgIH0pKTtcblx0ICB9O1xuXHR9KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Mjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24ocHJvY2Vzcykgeyd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0dmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Myk7XG5cdFxuXHR2YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG5cdCAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG5cdH07XG5cdFxuXHRmdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcblx0ICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuXHQgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcblx0ICB9XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuXHQgIHZhciBhZGFwdGVyO1xuXHQgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG5cdCAgICBhZGFwdGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTQpO1xuXHQgIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG5cdCAgICBhZGFwdGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTQpO1xuXHQgIH1cblx0ICByZXR1cm4gYWRhcHRlcjtcblx0fVxuXHRcblx0dmFyIGRlZmF1bHRzID0ge1xuXHQgIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cdFxuXHQgIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcblx0ICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXHQgICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuXHQgICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcblx0ICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG5cdCAgICApIHtcblx0ICAgICAgcmV0dXJuIGRhdGE7XG5cdCAgICB9XG5cdCAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcblx0ICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuXHQgICAgfVxuXHQgICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG5cdCAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcblx0ICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcblx0ICAgIH1cblx0ICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuXHQgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuXHQgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZGF0YTtcblx0ICB9XSxcblx0XG5cdCAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG5cdCAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblx0ICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGRhdGE7XG5cdCAgfV0sXG5cdFxuXHQgIC8qKlxuXHQgICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuXHQgICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG5cdCAgICovXG5cdCAgdGltZW91dDogMCxcblx0XG5cdCAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcblx0ICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cdFxuXHQgIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXHRcblx0ICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG5cdCAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZGVmYXVsdHMuaGVhZGVycyA9IHtcblx0ICBjb21tb246IHtcblx0ICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuXHQgIH1cblx0fTtcblx0XG5cdHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcblx0ICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcblx0fSk7XG5cdFxuXHR1dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuXHQgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcblx0fSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXHRcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMykpKVxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzkzOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuXHQgIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuXHQgICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuXHQgICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuXHQgICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk0OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHR2YXIgc2V0dGxlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTUpO1xuXHR2YXIgYnVpbGRVUkwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OCk7XG5cdHZhciBwYXJzZUhlYWRlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5OSk7XG5cdHZhciBpc1VSTFNhbWVPcmlnaW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwMCk7XG5cdHZhciBjcmVhdGVFcnJvciA9IF9fd2VicGFja19yZXF1aXJlX18oNzk2KTtcblx0dmFyIGJ0b2EgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmJ0b2EgJiYgd2luZG93LmJ0b2EuYmluZCh3aW5kb3cpKSB8fCBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwMSk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuXHQgICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cdFxuXHQgICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG5cdCAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcblx0ICAgIH1cblx0XG5cdCAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuXHQgICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblx0XG5cdCAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuXHQgICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cblx0ICAgIC8vIERPTidUIGRvIHRoaXMgZm9yIHRlc3RpbmcgYi9jIFhNTEh0dHBSZXF1ZXN0IGlzIG1vY2tlZCwgbm90IFhEb21haW5SZXF1ZXN0LlxuXHQgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcblx0ICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuXHQgICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCAmJiAhKCd3aXRoQ3JlZGVudGlhbHMnIGluIHJlcXVlc3QpICYmXG5cdCAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuXHQgICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuXHQgICAgICBsb2FkRXZlbnQgPSAnb25sb2FkJztcblx0ICAgICAgeERvbWFpbiA9IHRydWU7XG5cdCAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG5cdCAgICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHt9O1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cblx0ICAgIGlmIChjb25maWcuYXV0aCkge1xuXHQgICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcblx0ICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgfHwgJyc7XG5cdCAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG5cdCAgICB9XG5cdFxuXHQgICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblx0XG5cdCAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuXHQgICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cdFxuXHQgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuXHQgICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcblx0ICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcblx0ICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcblx0ICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcblx0ICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuXHQgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG5cdCAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcblx0ICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcblx0ICAgICAgdmFyIHJlc3BvbnNlID0ge1xuXHQgICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcblx0ICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcblx0ICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG5cdCAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAnTm8gQ29udGVudCcgOiByZXF1ZXN0LnN0YXR1c1RleHQsXG5cdCAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuXHQgICAgICAgIGNvbmZpZzogY29uZmlnLFxuXHQgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3Rcblx0ICAgICAgfTtcblx0XG5cdCAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblx0XG5cdCAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgcmVxdWVzdCA9IG51bGw7XG5cdCAgICB9O1xuXHRcblx0ICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcblx0ICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuXHQgICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcblx0ICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG5cdCAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gSGFuZGxlIHRpbWVvdXRcblx0ICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcblx0ICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG5cdCAgICAgICAgcmVxdWVzdCkpO1xuXHRcblx0ICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXHQgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgIH07XG5cdFxuXHQgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG5cdCAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cblx0ICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG5cdCAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuXHQgICAgICB2YXIgY29va2llcyA9IF9fd2VicGFja19yZXF1aXJlX18oODAyKTtcblx0XG5cdCAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuXHQgICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuXHQgICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuXHQgICAgICAgICAgdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuXHQgICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuXHQgICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG5cdCAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcblx0ICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcblx0ICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcblx0ICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuXHQgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblx0ICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG5cdCAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cdCAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcblx0ICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cblx0ICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuXHQgICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcblx0ICAgICAgICAgIHRocm93IGU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuXHQgICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcblx0ICAgIH1cblx0XG5cdCAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuXHQgICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuXHQgICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG5cdCAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cblx0ICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuXHQgICAgICAgIGlmICghcmVxdWVzdCkge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuXHQgICAgICAgIHJlamVjdChjYW5jZWwpO1xuXHQgICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3Rcblx0ICAgICAgICByZXF1ZXN0ID0gbnVsbDtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuXHQgICAgfVxuXHRcblx0ICAgIC8vIFNlbmQgdGhlIHJlcXVlc3Rcblx0ICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG5cdCAgfSk7XG5cdH07XG5cdFxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygzKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTU6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIGNyZWF0ZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTYpO1xuXHRcblx0LyoqXG5cdCAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG5cdCAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuXHQgIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuXHQgIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG5cdCAgICByZXNvbHZlKHJlc3BvbnNlKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuXHQgICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuXHQgICAgICByZXNwb25zZS5jb25maWcsXG5cdCAgICAgIG51bGwsXG5cdCAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG5cdCAgICAgIHJlc3BvbnNlXG5cdCAgICApKTtcblx0ICB9XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5Njpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgZW5oYW5jZUVycm9yID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3OTcpO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cdCAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuXHQgIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA3OTc6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cdCAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuXHQgIGlmIChjb2RlKSB7XG5cdCAgICBlcnJvci5jb2RlID0gY29kZTtcblx0ICB9XG5cdCAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG5cdCAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcblx0ICByZXR1cm4gZXJyb3I7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDc5ODpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdFxuXHRmdW5jdGlvbiBlbmNvZGUodmFsKSB7XG5cdCAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuXHQgICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuXHQgICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuXHQgICAgcmVwbGFjZSgvJTI0L2csICckJykuXG5cdCAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG5cdCAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cblx0ICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cblx0ICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcblx0ICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcblx0ICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cblx0ICBpZiAoIXBhcmFtcykge1xuXHQgICAgcmV0dXJuIHVybDtcblx0ICB9XG5cdFxuXHQgIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuXHQgIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG5cdCAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuXHQgIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuXHQgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB2YXIgcGFydHMgPSBbXTtcblx0XG5cdCAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG5cdCAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcblx0ICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhbCA9IFt2YWxdO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuXHQgICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG5cdCAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG5cdCAgfVxuXHRcblx0ICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuXHQgICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuXHQgIH1cblx0XG5cdCAgcmV0dXJuIHVybDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gNzk5OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0XG5cdC8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG5cdC8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcblx0dmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuXHQgICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG5cdCAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuXHQgICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcblx0ICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXHRdO1xuXHRcblx0LyoqXG5cdCAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3Rcblx0ICpcblx0ICogYGBgXG5cdCAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG5cdCAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuXHQgKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG5cdCAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG5cdCAqIGBgYFxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG5cdCAgdmFyIHBhcnNlZCA9IHt9O1xuXHQgIHZhciBrZXk7XG5cdCAgdmFyIHZhbDtcblx0ICB2YXIgaTtcblx0XG5cdCAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblx0XG5cdCAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcblx0ICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcblx0ICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cdFxuXHQgICAgaWYgKGtleSkge1xuXHQgICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG5cdCAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9KTtcblx0XG5cdCAgcmV0dXJuIHBhcnNlZDtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gODAwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciB1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNzg4KTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gKFxuXHQgIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXHRcblx0ICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3Rcblx0ICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cblx0ICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHQgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHQgICAgdmFyIG9yaWdpblVSTDtcblx0XG5cdCAgICAvKipcblx0ICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG5cdCAgICAqXG5cdCAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcblx0ICAgICogQHJldHVybnMge09iamVjdH1cblx0ICAgICovXG5cdCAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuXHQgICAgICB2YXIgaHJlZiA9IHVybDtcblx0XG5cdCAgICAgIGlmIChtc2llKSB7XG5cdCAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuXHQgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHQgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuXHQgICAgICB9XG5cdFxuXHQgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblx0XG5cdCAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcblx0ICAgICAgcmV0dXJuIHtcblx0ICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuXHQgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG5cdCAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcblx0ICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG5cdCAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcblx0ICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG5cdCAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcblx0ICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG5cdCAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcblx0ICAgICAgICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcblx0ICAgICAgfTtcblx0ICAgIH1cblx0XG5cdCAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblx0XG5cdCAgICAvKipcblx0ICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG5cdCAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2Vcblx0ICAgICovXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcblx0ICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcblx0ICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuXHQgICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuXHQgICAgfTtcblx0ICB9KSgpIDpcblx0XG5cdCAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cblx0ICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9O1xuXHQgIH0pKClcblx0KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gODAxOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdC8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXHRcblx0dmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89Jztcblx0XG5cdGZ1bmN0aW9uIEUoKSB7XG5cdCAgdGhpcy5tZXNzYWdlID0gJ1N0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3Rlcic7XG5cdH1cblx0RS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5cdEUucHJvdG90eXBlLmNvZGUgPSA1O1xuXHRFLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cdFxuXHRmdW5jdGlvbiBidG9hKGlucHV0KSB7XG5cdCAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG5cdCAgdmFyIG91dHB1dCA9ICcnO1xuXHQgIGZvciAoXG5cdCAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuXHQgICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG5cdCAgICAvLyBpZiB0aGUgbmV4dCBzdHIgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG5cdCAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuXHQgICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuXHQgICAgc3RyLmNoYXJBdChpZHggfCAwKSB8fCAobWFwID0gJz0nLCBpZHggJSAxKTtcblx0ICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG5cdCAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcblx0ICApIHtcblx0ICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcblx0ICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcblx0ICAgICAgdGhyb3cgbmV3IEUoKTtcblx0ICAgIH1cblx0ICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuXHQgIH1cblx0ICByZXR1cm4gb3V0cHV0O1xuXHR9XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwMjpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IChcblx0ICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblx0XG5cdCAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG5cdCAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcblx0ICAgICAgICB2YXIgY29va2llID0gW107XG5cdCAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXHRcblx0ICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuXHQgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcblx0ICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG5cdCAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcblx0ICAgICAgfSxcblx0XG5cdCAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuXHQgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG5cdCAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcblx0ICAgICAgfSxcblx0XG5cdCAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcblx0ICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgIH0pKCkgOlxuXHRcblx0ICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5cdCAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuXHQgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcblx0ICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuXHQgICAgfTtcblx0ICB9KSgpXG5cdCk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwMzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdFxuXHRmdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG5cdCAgdGhpcy5oYW5kbGVycyA9IFtdO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG5cdCAqXG5cdCAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcblx0ICovXG5cdEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcblx0ICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuXHQgICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG5cdCAgICByZWplY3RlZDogcmVqZWN0ZWRcblx0ICB9KTtcblx0ICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuXHQgKlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcblx0ICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcblx0ICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcblx0ICB9XG5cdH07XG5cdFxuXHQvKipcblx0ICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcblx0ICpcblx0ICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcblx0ICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG5cdCAqL1xuXHRJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG5cdCAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG5cdCAgICBpZiAoaCAhPT0gbnVsbCkge1xuXHQgICAgICBmbihoKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA4MDQ6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3ODgpO1xuXHR2YXIgdHJhbnNmb3JtRGF0YSA9IF9fd2VicGFja19yZXF1aXJlX18oODA1KTtcblx0dmFyIGlzQ2FuY2VsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4MDYpO1xuXHR2YXIgZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc5Mik7XG5cdHZhciBpc0Fic29sdXRlVVJMID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4MDcpO1xuXHR2YXIgY29tYmluZVVSTHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwOCk7XG5cdFxuXHQvKipcblx0ICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG5cdCAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuXHQgICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcblx0ICB9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcblx0ICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgIC8vIFN1cHBvcnQgYmFzZVVSTCBjb25maWdcblx0ICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcblx0ICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG5cdCAgfVxuXHRcblx0ICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuXHQgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cdFxuXHQgIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcblx0ICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG5cdCAgICBjb25maWcuZGF0YSxcblx0ICAgIGNvbmZpZy5oZWFkZXJzLFxuXHQgICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3Rcblx0ICApO1xuXHRcblx0ICAvLyBGbGF0dGVuIGhlYWRlcnNcblx0ICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuXHQgICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuXHQgICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG5cdCAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuXHQgICk7XG5cdFxuXHQgIHV0aWxzLmZvckVhY2goXG5cdCAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcblx0ICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuXHQgICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcblx0ICAgIH1cblx0ICApO1xuXHRcblx0ICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cdFxuXHQgIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG5cdCAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblx0ICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuXHQgICAgICByZXNwb25zZS5kYXRhLFxuXHQgICAgICByZXNwb25zZS5oZWFkZXJzLFxuXHQgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2Vcblx0ICAgICk7XG5cdFxuXHQgICAgcmV0dXJuIHJlc3BvbnNlO1xuXHQgIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcblx0ICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuXHQgICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cdFxuXHQgICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXHQgICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuXHQgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcblx0ICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuXHQgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG5cdCAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2Vcblx0ICAgICAgICApO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdFxuXHQgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG5cdCAgfSk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwNTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDc4OCk7XG5cdFxuXHQvKipcblx0ICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcblx0ICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2Vcblx0ICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuXHQgKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG5cdCAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG5cdCAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuXHQgICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuXHQgIH0pO1xuXHRcblx0ICByZXR1cm4gZGF0YTtcblx0fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gODA2OlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcblx0ICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwNzpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2Vcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcblx0ICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG5cdCAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG5cdCAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG5cdCAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xuXHR9O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyA4MDg6XG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcblx0ICByZXR1cm4gcmVsYXRpdmVVUkxcblx0ICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG5cdCAgICA6IGJhc2VVUkw7XG5cdH07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgwOTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuXHQgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0XG5cdENhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcblx0fTtcblx0XG5cdENhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cdFxuXHRtb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gODEwOlxuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBDYW5jZWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgwOSk7XG5cdFxuXHQvKipcblx0ICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cblx0ICpcblx0ICogQGNsYXNzXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG5cdCAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuXHQgIH1cblx0XG5cdCAgdmFyIHJlc29sdmVQcm9taXNlO1xuXHQgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG5cdCAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG5cdCAgfSk7XG5cdFxuXHQgIHZhciB0b2tlbiA9IHRoaXM7XG5cdCAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcblx0ICAgIGlmICh0b2tlbi5yZWFzb24pIHtcblx0ICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0XG5cdCAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuXHQgICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcblx0ICB9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRDYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG5cdCAgaWYgKHRoaXMucmVhc29uKSB7XG5cdCAgICB0aHJvdyB0aGlzLnJlYXNvbjtcblx0ICB9XG5cdH07XG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuXHQgKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuXHQgKi9cblx0Q2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuXHQgIHZhciBjYW5jZWw7XG5cdCAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcblx0ICAgIGNhbmNlbCA9IGM7XG5cdCAgfSk7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHRva2VuOiB0b2tlbixcblx0ICAgIGNhbmNlbDogY2FuY2VsXG5cdCAgfTtcblx0fTtcblx0XG5cdG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIDgxMTpcbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHQvKipcblx0ICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cblx0ICpcblx0ICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cblx0ICpcblx0ICogIGBgYGpzXG5cdCAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG5cdCAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcblx0ICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG5cdCAqICBgYGBcblx0ICpcblx0ICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG5cdCAqXG5cdCAqICBgYGBqc1xuXHQgKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuXHQgKiAgYGBgXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn1cblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG5cdCAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcblx0ICB9O1xuXHR9O1xuXG5cbi8qKiovIH0pXG5cbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB1c2VyUHJvamVjdHMtYnVuZGxlLmpzIiwiLypcbiBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgbGljZW5zZS50eHQgZmlsZSBsb2NhdGVkIGF0IHRoZSByb290IGZvbGRlciBvZiB0aGVcbiBBa3ZvIFJTUiBtb2R1bGUuIEZvciBhZGRpdGlvbmFsIGRldGFpbHMgb24gdGhlIEdOVSBsaWNlbnNlIHBsZWFzZSBzZWVcbiA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG5pbXBvcnQgQXBwIGZyb20gXCIuL2NvbXBvbmVudHMvQXBwXCI7XG5cbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUsIGNvbXBvc2UgfSBmcm9tIFwicmVkdXhcIjtcbmltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFwicmVkdXgtc2FnYVwiO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcblxuaW1wb3J0IHsgcmVkdWNlciB9IGZyb20gXCIuL3JlZHVjZXJcIjtcbmltcG9ydCB7IHdhdGNoZXJTYWdhIH0gZnJvbSBcIi4vc2FnYXNcIjtcblxuLy8gY3JlYXRlIHRoZSBzYWdhIG1pZGRsZXdhcmVcbmNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKTtcblxuLy8gZGV2IHRvb2xzIG1pZGRsZXdhcmVcbmNvbnN0IHJlZHV4RGV2VG9vbHMgPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpO1xuXG5sZXQgc3RvcmU7XG5pZiAocmVkdXhEZXZUb29scykge1xuICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgY29tcG9zZShhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUpLCByZWR1eERldlRvb2xzKSk7XG59IGVsc2Uge1xuICAgIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHNhZ2FNaWRkbGV3YXJlKSk7XG59XG5cbnNhZ2FNaWRkbGV3YXJlLnJ1bih3YXRjaGVyU2FnYSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgICAgICA8QXBwIC8+XG4gICAgICAgIDwvUHJvdmlkZXI+LFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJQcm9qZWN0c1wiKVxuICAgICk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2FwcC5qcyIsIi8qXG4gICBBa3ZvIFJTUiBpcyBjb3ZlcmVkIGJ5IHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UuXG4gICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICA8IGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9hZ3BsLmh0bWwgPi5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgeyBfLCBkYXRhRnJvbUVsZW1lbnR9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbXBvcnQgKiBhcyBjIGZyb20gXCIuLi9jb25zdFwiO1xuXG5jb25zdCBJc1Jlc3RyaWN0ZWQgPSAoeyBfLCBpc1Jlc3RyaWN0ZWQsIG9uQ2hhbmdlSXNSZXN0cmljdGVkIH0pID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJpc1Jlc3RyaWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIHsvKiBUaGUgc3RyaW5ncyBpbmNsdWRlIDxzdHJvbmc+IHRhZ3Mgd2hpY2ggcmVxdWlyZXMgdGhlIHVzZSBvZlxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTCAqL31cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgX19odG1sOiBpc1Jlc3RyaWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IF8oXCJ1c2VyX2FjY2Vzc19yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfKFwidXNlcl9hY2Nlc3NfdW5yZXN0cmljdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB7aXNSZXN0cmljdGVkID8gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVzdHJpY3RlZEluZm9cIlxuICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IF8oXCJyZXN0cmljdGVkX2luZm9cIikgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn07XG5cbmNvbnN0IFByb2plY3QgPSAoe1xuICAgIF8sXG4gICAgcHJvamVjdCxcbiAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgb25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWQsXG4gICAgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCxcbiAgICByb3dTcGFuLFxuICAgIG9yZ3Ncbn0pID0+IHtcbiAgICBjb25zdCB1aVNldHRpbmdzID0gKHByb2plY3QsIGlzUmVzdHJpY3RlZCwgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cCkgPT4ge1xuICAgICAgICBjb25zdCBjaGVja2VkID0gcHJvamVjdC5hY2Nlc3MsXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICBwcm9qZWN0U2VsZWN0ZWQgPSBjaGVja2VkID8gXCIgcHJvamVjdFNlbGVjdGVkXCIgOiBcIlwiLFxuICAgICAgICAgICAgdHJDbGFzc05hbWUgPVxuICAgICAgICAgICAgICAgIGRpc2FibGVkICsgcHJvamVjdFNlbGVjdGVkICsgKGZpcnN0UHJvamVjdE9mT3JnR3JvdXAgPyBcIiBib3JkZXItdG9wXCIgOiBcIlwiKSxcbiAgICAgICAgICAgIGlkQ2xhc3NOYW1lID0gZGlzYWJsZWQgKyBcIiBpZFwiO1xuICAgICAgICByZXR1cm4geyBjaGVja2VkLCB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWUgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FuY2VsQ2xpY2sgPSBlID0+IHtcbiAgICAgICAgLy8gQ2FuY2VsIHRoZSB0ciBvbkNsaWNrIGZvciB0aGUgb3JnIGdyb3VwIGNlbGxcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuXG4gICAgY29uc3QgeyBjaGVja2VkLCB0ckNsYXNzTmFtZSwgaWRDbGFzc05hbWUgfSA9IHVpU2V0dGluZ3MoXG4gICAgICAgIHByb2plY3QsXG4gICAgICAgIGlzUmVzdHJpY3RlZCxcbiAgICAgICAgZmlyc3RQcm9qZWN0T2ZPcmdHcm91cFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8dHJcbiAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgIGlkPXtwcm9qZWN0LmlkfVxuICAgICAgICAgICAgb25DbGljaz17b25DaGFuZ2VQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICBjbGFzc05hbWU9e3RyQ2xhc3NOYW1lfVxuICAgICAgICA+XG4gICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYm9yZGVyLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb2plY3QuaWR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgICAgICByZWFkT25seT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2lkQ2xhc3NOYW1lfT57cHJvamVjdC5pZH08L3RkPlxuICAgICAgICAgICAgPHRkPntwcm9qZWN0LnRpdGxlIHx8IF8oXCJub190aXRsZVwiKX08L3RkPlxuICAgICAgICAgICAgPHRkPntwcm9qZWN0LnN1YnRpdGxlfTwvdGQ+XG4gICAgICAgICAgICB7Zmlyc3RQcm9qZWN0T2ZPcmdHcm91cCA/IChcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYm9yZGVyXCIgcm93U3Bhbj17cm93U3Bhbn0gb25DbGljaz17Y2FuY2VsQ2xpY2t9PlxuICAgICAgICAgICAgICAgICAgICB7b3Jnc31cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvdHI+XG4gICAgKTtcbn07XG5cbmNvbnN0IFNlbGVjdEFsbCA9ICh7IF8sIHNlbGVjdEFsbCwgb25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsLCBpc1Jlc3RyaWN0ZWQgfSkgPT4ge1xuICAgIGNvbnN0IHVpU2V0dGluZ3MgPSBpc1Jlc3RyaWN0ZWQgPT4ge1xuICAgICAgICBjb25zdCBidXR0b25DbGFzcyA9IFwic2VsZWN0QWxsUHJvamVjdHNcIiArIChpc1Jlc3RyaWN0ZWQgPyBcIlwiIDogXCIgZGlzYWJsZWRcIiksXG4gICAgICAgICAgICBkaXNhYmxlZCA9ICFpc1Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICBkaXZDbGFzcyA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgICAgIHJldHVybiB7IGJ1dHRvbkNsYXNzLCBkaXNhYmxlZCwgZGl2Q2xhc3MgfTtcbiAgICB9O1xuICAgIGNvbnN0IHsgZGl2Q2xhc3MsIGRpc2FibGVkLCBidXR0b25DbGFzcyB9ID0gdWlTZXR0aW5ncyhpc1Jlc3RyaWN0ZWQpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbH0gZGlzYWJsZWQ9e2Rpc2FibGVkfSBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfT5cbiAgICAgICAgICAgICAgICB7c2VsZWN0QWxsID8gXyhcImNoZWNrX2FsbF9wcm9qZWN0c1wiKSA6IF8oXCJ1bmNoZWNrX2FsbF9wcm9qZWN0c1wiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuY29uc3QgRXJyb3IgPSAoeyBfLCBlcnJvciB9KSA9PiB7XG4gICAgcmV0dXJuIGVycm9yID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvclwiPntfKFwiYW5fZXJyb3Jfb2NjdXJlZFwiKSArIGVycm9yLm1lc3NhZ2V9PC9kaXY+IDogbnVsbDtcbn07XG5cbmNvbnN0IFByb2plY3RzID0gKHtcbiAgICBfLFxuICAgIGVycm9yLFxuICAgIGdyb3VwZWRQcm9qZWN0cyxcbiAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgc2VsZWN0QWxsLFxuICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkLFxuICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbCxcbiAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZFxufSkgPT4ge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGlzUmVzdHJpY3RlZCA/IFwiXCIgOiBcImRpc2FibGVkXCI7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8RXJyb3IgXz17X30gZXJyb3I9e2Vycm9yfSAvPlxuICAgICAgICAgICAgPElzUmVzdHJpY3RlZFxuICAgICAgICAgICAgICAgIF89e199XG4gICAgICAgICAgICAgICAgaXNSZXN0cmljdGVkPXtpc1Jlc3RyaWN0ZWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VJc1Jlc3RyaWN0ZWQ9e29uQ2hhbmdlSXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTZWxlY3RBbGxcbiAgICAgICAgICAgICAgICBfPXtffVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdEFsbD17b25DaGFuZ2VQcm9qZWN0U2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZD17aXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJhY2Nlc3NcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e18oXCJwcm9qZWN0X2lkXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPXtjbGFzc05hbWV9PntfKFwicHJvamVjdF90aXRsZVwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5Qcm9qZWN0IHN1YnRpdGxlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9e2NsYXNzTmFtZX0+TWFuYWdpbmcgb3JnYW5pc2F0aW9uczwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtncm91cGVkUHJvamVjdHMubWFwKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd1NwYW4gPSBncm91cC5wcm9qZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwLnByb2plY3RzLm1hcChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFByb2plY3RPZk9yZ0dyb3VwID0gZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UHJvamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXz17X31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cHJvamVjdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3Byb2plY3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQ9e2lzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUHJvamVjdFNlbGVjdGVkPXtvbkNoYW5nZVByb2plY3RTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UHJvamVjdE9mT3JnR3JvdXA9e2ZpcnN0UHJvamVjdE9mT3JnR3JvdXB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTcGFuPXtyb3dTcGFufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Jncz17Z3JvdXAub3JnYW5pc2F0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn07XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnRvZ2dsZVByb2plY3RTZWxlY3RlZCA9IHRoaXMudG9nZ2xlUHJvamVjdFNlbGVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudG9nZ2xlSXNSZXN0cmljdGVkID0gdGhpcy50b2dnbGVJc1Jlc3RyaWN0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsID0gdGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0QWxsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuXyA9IHRoaXMuXy5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFRyYW5zbGF0aW9uIGhhbmRsaW5nXG4gICAgXyhzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnN0cmluZ3MgJiYgdGhpcy5wcm9wcy5zdHJpbmdzW3NdO1xuICAgIH1cblxuICAgIHRvZ2dsZUlzUmVzdHJpY3RlZChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVJc1Jlc3RyaWN0ZWQoZS50YXJnZXQuY2hlY2tlZCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJvamVjdFNlbGVjdEFsbChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVTZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcm9qZWN0U2VsZWN0ZWQoZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlUHJvamVjdFNlbGVjdGlvbihpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gZGF0YUZyb21FbGVtZW50KFwidXNlci10by1yZXN0cmljdFwiKS5pZDtcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRTdG9yZSh7IHVzZXJJZCB9KTtcblxuICAgICAgICBjb25zdCBzdHJpbmdzID0gZGF0YUZyb21FbGVtZW50KFwidXNlci1wcm9qZWN0cy10ZXh0XCIpO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN0b3JlKHsgc3RyaW5ncyB9KTtcblxuICAgICAgICB0aGlzLnByb3BzLm9uRmV0Y2hVc2VyUHJvamVjdHModXNlcklkKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgcHJvamVjdHNMb2FkZWQsIHNlbGVjdEFsbCwgZ3JvdXBlZFByb2plY3RzLCBpc1Jlc3RyaWN0ZWQsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gcHJvamVjdHNMb2FkZWQgPyAoXG4gICAgICAgICAgICA8UHJvamVjdHNcbiAgICAgICAgICAgICAgICBfPXt0aGlzLl99XG4gICAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgICAgICAgIGlzUmVzdHJpY3RlZD17aXNSZXN0cmljdGVkfVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbD17c2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0cz17Z3JvdXBlZFByb2plY3RzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlSXNSZXN0cmljdGVkPXt0aGlzLnRvZ2dsZUlzUmVzdHJpY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RBbGw9e3RoaXMudG9nZ2xlUHJvamVjdFNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVByb2plY3RTZWxlY3RlZD17dGhpcy50b2dnbGVQcm9qZWN0U2VsZWN0ZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nXCI+e3RoaXMuXygnbG9hZGluZycpfSA8aSBjbGFzc05hbWU9XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIiAvPjwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4ge1xuICAgIGNvbnN0IHsgcHJvamVjdHNMb2FkZWQsIGZldGNoaW5nLCBlcnJvciwgZ3JvdXBlZFByb2plY3RzLCBpc1Jlc3RyaWN0ZWQsIHNlbGVjdEFsbCwgc3RyaW5ncyB9ID0gc3RhdGU7XG4gICAgcmV0dXJuIHsgcHJvamVjdHNMb2FkZWQsIGZldGNoaW5nLCBlcnJvciwgZ3JvdXBlZFByb2plY3RzLCBpc1Jlc3RyaWN0ZWQsIHNlbGVjdEFsbCwgc3RyaW5ncyB9O1xufTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIG9uRmV0Y2hVc2VyUHJvamVjdHM6IHVzZXJJZCA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuQVBJX0dFVF9JTklULFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcklkIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBzZXRTdG9yZTogZGF0YSA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuU0VUX1NUT1JFLFxuICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBvblVwZGF0ZVByb2plY3RTZWxlY3Rpb246IHByb2plY3RJZCA9PlxuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IGMuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgcHJvamVjdElkIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBvblVwZGF0ZUlzUmVzdHJpY3RlZDogaXNSZXN0cmljdGVkID0+XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYy5VUERBVEVfSVNfUkVTVFJJQ1RFRCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzUmVzdHJpY3RlZCB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgb25VcGRhdGVTZWxlY3RBbGw6ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUUyB9KVxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICAgIG1hcFN0YXRlVG9Qcm9wcyxcbiAgICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoQXBwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL2NvbXBvbmVudHMvQXBwLmpzeCIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuZXhwb3J0IGNvbnN0IGVuZHBvaW50cyA9IHtcbiAgICB1c2VyX3Byb2plY3RzX2FjY2VzczogaWQgPT4gYC9yZXN0L3YxL3VzZXJfcHJvamVjdHNfYWNjZXNzLyR7aWR9Lz9mb3JtYXQ9anNvbmBcbn07XG5cbmV4cG9ydCBjb25zdCBpbkFycmF5ID0gKG9iaiwgYXJyKSA9PiBhcnIgJiYgYXJyLmluZGV4T2Yob2JqKSAhPT0gLTE7XG5cbmV4cG9ydCBjb25zdCBkYXRhRnJvbUVsZW1lbnQgPSBlbGVtZW50TmFtZSA9PiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudE5hbWUpLmlubmVySFRNTCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvdXRpbHMuanMiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIGFjdGlvbiB0eXBlc1xuZXhwb3J0IGNvbnN0IC8vXG4gICAgU0VUX1NUT1JFID0gXCJTRVRfU1RPUkVcIixcbiAgICAvL1xuICAgIEFQSV9HRVRfSU5JVCA9IFwiQVBJX0dFVF9JTklUXCIsXG4gICAgQVBJX0dFVF9TVUNDRVNTID0gXCJBUElfR0VUX1NVQ0NFU1NcIixcbiAgICBBUElfR0VUX0ZBSUxVUkUgPSBcIkFQSV9HRVRfRkFJTFVSRVwiLFxuICAgIC8vXG4gICAgQVBJX1BVVF9JTklUID0gXCJBUElfUFVUX0lOSVRcIixcbiAgICBBUElfUFVUX1NVQ0NFU1MgPSBcIkFQSV9QVVRfU1VDQ0VTU1wiLFxuICAgIEFQSV9QVVRfRkFJTFVSRSA9IFwiQVBJX1BVVF9GQUlMVVJFXCIsXG4gICAgLy9cbiAgICBVUERBVEVfUFJPSkVDVF9TRUxFQ1RJT04gPSBcIlVQREFURV9QUk9KRUNUX1NFTEVDVElPTlwiLFxuICAgIFVQREFURV9JU19SRVNUUklDVEVEID0gXCJVUERBVEVfSVNfUkVTVFJJQ1RFRFwiLFxuICAgIFVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTID0gXCJVUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU1wiO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3MvY29uc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnV0aWxzID0gZXhwb3J0cy5lZmZlY3RzID0gZXhwb3J0cy5kZXRhY2ggPSBleHBvcnRzLkNBTkNFTCA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnRocm90dGxlID0gZXhwb3J0cy50YWtlTGF0ZXN0ID0gZXhwb3J0cy50YWtlRXZlcnkgPSBleHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLmNoYW5uZWwgPSBleHBvcnRzLmV2ZW50Q2hhbm5lbCA9IGV4cG9ydHMuRU5EID0gZXhwb3J0cy5ydW5TYWdhID0gdW5kZWZpbmVkO1xuXG52YXIgX3J1blNhZ2EgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9ydW5TYWdhJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncnVuU2FnYScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ydW5TYWdhLnJ1blNhZ2E7XG4gIH1cbn0pO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9jaGFubmVsJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuRU5EO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZXZlbnRDaGFubmVsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYW5uZWwuZXZlbnRDaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jaGFubmVsLmNoYW5uZWw7XG4gIH1cbn0pO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9idWZmZXJzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYnVmZmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9idWZmZXJzLmJ1ZmZlcnM7XG4gIH1cbn0pO1xuXG52YXIgX3NhZ2FIZWxwZXJzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvc2FnYUhlbHBlcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0YWtlRXZlcnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGFrZUV2ZXJ5O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUxhdGVzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zYWdhSGVscGVycy50YWtlTGF0ZXN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGhyb3R0bGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2FnYUhlbHBlcnMudGhyb3R0bGU7XG4gIH1cbn0pO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvdXRpbHMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZWxheScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5kZWxheTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NBTkNFTCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5DQU5DRUw7XG4gIH1cbn0pO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvaW8nKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdkZXRhY2gnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uZGV0YWNoO1xuICB9XG59KTtcblxudmFyIF9taWRkbGV3YXJlID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvbWlkZGxld2FyZScpO1xuXG52YXIgX21pZGRsZXdhcmUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21pZGRsZXdhcmUpO1xuXG52YXIgX2VmZmVjdHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9lZmZlY3RzJyk7XG5cbnZhciBlZmZlY3RzID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9lZmZlY3RzKTtcblxudmFyIF91dGlsczIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbHMgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9taWRkbGV3YXJlMi5kZWZhdWx0O1xuZXhwb3J0cy5lZmZlY3RzID0gZWZmZWN0cztcbmV4cG9ydHMudXRpbHMgPSB1dGlscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDczOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLnJ1blNhZ2EgPSBydW5TYWdhO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vcHJvYycpO1xuXG52YXIgX3Byb2MyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb2MpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUlVOX1NBR0FfU0lHTkFUVVJFID0gJ3J1blNhZ2Eoc3RvcmVJbnRlcmZhY2UsIHNhZ2EsIC4uLmFyZ3MpJztcbnZhciBOT05fR0VORVJBVE9SX0VSUiA9IFJVTl9TQUdBX1NJR05BVFVSRSArICc6IHNhZ2EgYXJndW1lbnQgbXVzdCBiZSBhIEdlbmVyYXRvciBmdW5jdGlvbiEnO1xuXG5mdW5jdGlvbiBydW5TYWdhKHN0b3JlSW50ZXJmYWNlLCBzYWdhKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGl0ZXJhdG9yID0gdm9pZCAwO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3Ioc3RvcmVJbnRlcmZhY2UpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAoMCwgX3V0aWxzLmxvZykoJ3dhcm4nLCAncnVuU2FnYShpdGVyYXRvciwgc3RvcmVJbnRlcmZhY2UpIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJyArIFJVTl9TQUdBX1NJR05BVFVSRSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gc3RvcmVJbnRlcmZhY2U7XG4gICAgc3RvcmVJbnRlcmZhY2UgPSBzYWdhO1xuICB9IGVsc2Uge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNhZ2EsIF91dGlscy5pcy5mdW5jLCBOT05fR0VORVJBVE9SX0VSUik7XG4gICAgaXRlcmF0b3IgPSBzYWdhLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoaXRlcmF0b3IsIF91dGlscy5pcy5pdGVyYXRvciwgTk9OX0dFTkVSQVRPUl9FUlIpO1xuICB9XG5cbiAgdmFyIF9zdG9yZUludGVyZmFjZSA9IHN0b3JlSW50ZXJmYWNlLFxuICAgICAgc3Vic2NyaWJlID0gX3N0b3JlSW50ZXJmYWNlLnN1YnNjcmliZSxcbiAgICAgIGRpc3BhdGNoID0gX3N0b3JlSW50ZXJmYWNlLmRpc3BhdGNoLFxuICAgICAgZ2V0U3RhdGUgPSBfc3RvcmVJbnRlcmZhY2UuZ2V0U3RhdGUsXG4gICAgICBjb250ZXh0ID0gX3N0b3JlSW50ZXJmYWNlLmNvbnRleHQsXG4gICAgICBzYWdhTW9uaXRvciA9IF9zdG9yZUludGVyZmFjZS5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IF9zdG9yZUludGVyZmFjZS5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gX3N0b3JlSW50ZXJmYWNlLm9uRXJyb3I7XG5cblxuICB2YXIgZWZmZWN0SWQgPSAoMCwgX3V0aWxzLnVpZCkoKTtcblxuICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAvLyBtb25pdG9ycyBhcmUgZXhwZWN0ZWQgdG8gaGF2ZSBhIGNlcnRhaW4gaW50ZXJmYWNlLCBsZXQncyBmaWxsLWluIGFueSBtaXNzaW5nIG9uZXNcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RUcmlnZ2VyZWQgfHwgX3V0aWxzLm5vb3A7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQgPSBzYWdhTW9uaXRvci5lZmZlY3RSZXNvbHZlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdFJlamVjdGVkIHx8IF91dGlscy5ub29wO1xuICAgIHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCA9IHNhZ2FNb25pdG9yLmVmZmVjdENhbmNlbGxlZCB8fCBfdXRpbHMubm9vcDtcbiAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkID0gc2FnYU1vbml0b3IuYWN0aW9uRGlzcGF0Y2hlZCB8fCBfdXRpbHMubm9vcDtcblxuICAgIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcm9vdDogdHJ1ZSwgcGFyZW50RWZmZWN0SWQ6IDAsIGVmZmVjdDogeyByb290OiB0cnVlLCBzYWdhOiBzYWdhLCBhcmdzOiBhcmdzIH0gfSk7XG4gIH1cblxuICB2YXIgdGFzayA9ICgwLCBfcHJvYzIuZGVmYXVsdCkoaXRlcmF0b3IsIHN1YnNjcmliZSwgKDAsIF91dGlscy53cmFwU2FnYURpc3BhdGNoKShkaXNwYXRjaCksIGdldFN0YXRlLCBjb250ZXh0LCB7IHNhZ2FNb25pdG9yOiBzYWdhTW9uaXRvciwgbG9nZ2VyOiBsb2dnZXIsIG9uRXJyb3I6IG9uRXJyb3IgfSwgZWZmZWN0SWQsIHNhZ2EubmFtZSk7XG5cbiAgaWYgKHNhZ2FNb25pdG9yKSB7XG4gICAgc2FnYU1vbml0b3IuZWZmZWN0UmVzb2x2ZWQoZWZmZWN0SWQsIHRhc2spO1xuICB9XG5cbiAgcmV0dXJuIHRhc2s7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3J1blNhZ2EuanNcbi8vIG1vZHVsZSBpZCA9IDczOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xuZXhwb3J0cy5oYXNPd24gPSBoYXNPd247XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbmV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcbmV4cG9ydHMuYXJyYXlPZkRlZmZlcmVkID0gYXJyYXlPZkRlZmZlcmVkO1xuZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuZXhwb3J0cy5jcmVhdGVNb2NrVGFzayA9IGNyZWF0ZU1vY2tUYXNrO1xuZXhwb3J0cy5hdXRvSW5jID0gYXV0b0luYztcbmV4cG9ydHMubWFrZUl0ZXJhdG9yID0gbWFrZUl0ZXJhdG9yO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmRlcHJlY2F0ZSA9IGRlcHJlY2F0ZTtcbnZhciBzeW0gPSBleHBvcnRzLnN5bSA9IGZ1bmN0aW9uIHN5bShpZCkge1xuICByZXR1cm4gJ0BAcmVkdXgtc2FnYS8nICsgaWQ7XG59O1xuXG52YXIgVEFTSyA9IC8qI19fUFVSRV9fKi9leHBvcnRzLlRBU0sgPSBzeW0oJ1RBU0snKTtcbnZhciBIRUxQRVIgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5IRUxQRVIgPSBzeW0oJ0hFTFBFUicpO1xudmFyIE1BVENIID0gLyojX19QVVJFX18qL2V4cG9ydHMuTUFUQ0ggPSBzeW0oJ01BVENIJyk7XG52YXIgQ0FOQ0VMID0gLyojX19QVVJFX18qL2V4cG9ydHMuQ0FOQ0VMID0gc3ltKCdDQU5DRUxfUFJPTUlTRScpO1xudmFyIFNBR0FfQUNUSU9OID0gLyojX19QVVJFX18qL2V4cG9ydHMuU0FHQV9BQ1RJT04gPSBzeW0oJ1NBR0FfQUNUSU9OJyk7XG52YXIgU0VMRl9DQU5DRUxMQVRJT04gPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5TRUxGX0NBTkNFTExBVElPTiA9IHN5bSgnU0VMRl9DQU5DRUxMQVRJT04nKTtcbnZhciBrb25zdCA9IGV4cG9ydHMua29uc3QgPSBmdW5jdGlvbiBrb25zdCh2KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xudmFyIGtUcnVlID0gLyojX19QVVJFX18qL2V4cG9ydHMua1RydWUgPSBrb25zdCh0cnVlKTtcbnZhciBrRmFsc2UgPSAvKiNfX1BVUkVfXyovZXhwb3J0cy5rRmFsc2UgPSBrb25zdChmYWxzZSk7XG52YXIgbm9vcCA9IGV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcbnZhciBpZGVudCA9IGV4cG9ydHMuaWRlbnQgPSBmdW5jdGlvbiBpZGVudCh2KSB7XG4gIHJldHVybiB2O1xufTtcblxuZnVuY3Rpb24gY2hlY2sodmFsdWUsIHByZWRpY2F0ZSwgZXJyb3IpIHtcbiAgaWYgKCFwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCBjaGVjaycsIGVycm9yKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gaXMubm90VW5kZWYob2JqZWN0KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG52YXIgaXMgPSBleHBvcnRzLmlzID0ge1xuICB1bmRlZjogZnVuY3Rpb24gdW5kZWYodikge1xuICAgIHJldHVybiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgbm90VW5kZWY6IGZ1bmN0aW9uIG5vdFVuZGVmKHYpIHtcbiAgICByZXR1cm4gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG4gIH0sXG4gIGZ1bmM6IGZ1bmN0aW9uIGZ1bmMoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcic7XG4gIH0sXG4gIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnO1xuICB9LFxuICBhcnJheTogQXJyYXkuaXNBcnJheSxcbiAgb2JqZWN0OiBmdW5jdGlvbiBvYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiAhaXMuYXJyYXkob2JqKSAmJiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKSkgPT09ICdvYmplY3QnO1xuICB9LFxuICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKHApIHtcbiAgICByZXR1cm4gcCAmJiBpcy5mdW5jKHAudGhlbik7XG4gIH0sXG4gIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpcy5mdW5jKGl0Lm5leHQpICYmIGlzLmZ1bmMoaXQudGhyb3cpO1xuICB9LFxuICBpdGVyYWJsZTogZnVuY3Rpb24gaXRlcmFibGUoaXQpIHtcbiAgICByZXR1cm4gaXQgJiYgaXMuZnVuYyhTeW1ib2wpID8gaXMuZnVuYyhpdFtTeW1ib2wuaXRlcmF0b3JdKSA6IGlzLmFycmF5KGl0KTtcbiAgfSxcbiAgdGFzazogZnVuY3Rpb24gdGFzayh0KSB7XG4gICAgcmV0dXJuIHQgJiYgdFtUQVNLXTtcbiAgfSxcbiAgb2JzZXJ2YWJsZTogZnVuY3Rpb24gb2JzZXJ2YWJsZShvYikge1xuICAgIHJldHVybiBvYiAmJiBpcy5mdW5jKG9iLnN1YnNjcmliZSk7XG4gIH0sXG4gIGJ1ZmZlcjogZnVuY3Rpb24gYnVmZmVyKGJ1Zikge1xuICAgIHJldHVybiBidWYgJiYgaXMuZnVuYyhidWYuaXNFbXB0eSkgJiYgaXMuZnVuYyhidWYudGFrZSkgJiYgaXMuZnVuYyhidWYucHV0KTtcbiAgfSxcbiAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybihwYXQpIHtcbiAgICByZXR1cm4gcGF0ICYmIChpcy5zdHJpbmcocGF0KSB8fCAodHlwZW9mIHBhdCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0KSkgPT09ICdzeW1ib2wnIHx8IGlzLmZ1bmMocGF0KSB8fCBpcy5hcnJheShwYXQpKTtcbiAgfSxcbiAgY2hhbm5lbDogZnVuY3Rpb24gY2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaCAmJiBpcy5mdW5jKGNoLnRha2UpICYmIGlzLmZ1bmMoY2guY2xvc2UpO1xuICB9LFxuICBoZWxwZXI6IGZ1bmN0aW9uIGhlbHBlcihpdCkge1xuICAgIHJldHVybiBpdCAmJiBpdFtIRUxQRVJdO1xuICB9LFxuICBzdHJpbmdhYmxlRnVuYzogZnVuY3Rpb24gc3RyaW5nYWJsZUZ1bmMoZikge1xuICAgIHJldHVybiBpcy5mdW5jKGYpICYmIGhhc093bihmLCAndG9TdHJpbmcnKTtcbiAgfVxufTtcblxudmFyIG9iamVjdCA9IGV4cG9ydHMub2JqZWN0ID0ge1xuICBhc3NpZ246IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoaGFzT3duKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgdGFyZ2V0W2ldID0gc291cmNlW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufVxuXG52YXIgYXJyYXkgPSBleHBvcnRzLmFycmF5ID0ge1xuICBmcm9tOiBmdW5jdGlvbiBmcm9tKG9iaikge1xuICAgIHZhciBhcnIgPSBBcnJheShvYmoubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093bihvYmosIGkpKSB7XG4gICAgICAgIGFycltpXSA9IG9ialtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG4gIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIGRlZiA9IF9leHRlbmRzKHt9LCBwcm9wcyk7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGRlZi5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBkZWYucmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbiAgZGVmLnByb21pc2UgPSBwcm9taXNlO1xuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBhcnJheU9mRGVmZmVyZWQobGVuZ3RoKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGRlZmVycmVkKCkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gIHZhciB2YWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cbiAgdmFyIHRpbWVvdXRJZCA9IHZvaWQgMDtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUodmFsKTtcbiAgICB9LCBtcyk7XG4gIH0pO1xuXG4gIHByb21pc2VbQ0FOQ0VMXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gIH07XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tUYXNrKCkge1xuICB2YXIgX3JlZjtcblxuICB2YXIgcnVubmluZyA9IHRydWU7XG4gIHZhciBfcmVzdWx0ID0gdm9pZCAwLFxuICAgICAgX2Vycm9yID0gdm9pZCAwO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFTS10gPSB0cnVlLCBfcmVmLmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICByZXR1cm4gcnVubmluZztcbiAgfSwgX3JlZi5yZXN1bHQgPSBmdW5jdGlvbiByZXN1bHQoKSB7XG4gICAgcmV0dXJuIF9yZXN1bHQ7XG4gIH0sIF9yZWYuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICByZXR1cm4gX2Vycm9yO1xuICB9LCBfcmVmLnNldFJ1bm5pbmcgPSBmdW5jdGlvbiBzZXRSdW5uaW5nKGIpIHtcbiAgICByZXR1cm4gcnVubmluZyA9IGI7XG4gIH0sIF9yZWYuc2V0UmVzdWx0ID0gZnVuY3Rpb24gc2V0UmVzdWx0KHIpIHtcbiAgICByZXR1cm4gX3Jlc3VsdCA9IHI7XG4gIH0sIF9yZWYuc2V0RXJyb3IgPSBmdW5jdGlvbiBzZXRFcnJvcihlKSB7XG4gICAgcmV0dXJuIF9lcnJvciA9IGU7XG4gIH0sIF9yZWY7XG59XG5cbmZ1bmN0aW9uIGF1dG9JbmMoKSB7XG4gIHZhciBzZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICsrc2VlZDtcbiAgfTtcbn1cblxudmFyIHVpZCA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnVpZCA9IGF1dG9JbmMoKTtcblxudmFyIGtUaHJvdyA9IGZ1bmN0aW9uIGtUaHJvdyhlcnIpIHtcbiAgdGhyb3cgZXJyO1xufTtcbnZhciBrUmV0dXJuID0gZnVuY3Rpb24ga1JldHVybih2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcbn07XG5mdW5jdGlvbiBtYWtlSXRlcmF0b3IobmV4dCkge1xuICB2YXIgdGhybyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoga1Rocm93O1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJyc7XG4gIHZhciBpc0hlbHBlciA9IGFyZ3VtZW50c1szXTtcblxuICB2YXIgaXRlcmF0b3IgPSB7IG5hbWU6IG5hbWUsIG5leHQ6IG5leHQsIHRocm93OiB0aHJvLCByZXR1cm46IGtSZXR1cm4gfTtcblxuICBpZiAoaXNIZWxwZXIpIHtcbiAgICBpdGVyYXRvcltIRUxQRVJdID0gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG4vKipcbiAgUHJpbnQgZXJyb3IgaW4gYSB1c2VmdWwgd2F5IHdoZXRoZXIgaW4gYSBicm93c2VyIGVudmlyb25tZW50XG4gICh3aXRoIGV4cGFuZGFibGUgZXJyb3Igc3RhY2sgdHJhY2VzKSwgb3IgaW4gYSBub2RlLmpzIGVudmlyb25tZW50XG4gICh0ZXh0LW9ubHkgbG9nIG91dHB1dClcbiAqKi9cbmZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUubG9nKCdyZWR1eC1zYWdhICcgKyBsZXZlbCArICc6ICcgKyBtZXNzYWdlICsgJ1xcbicgKyAoZXJyb3IgJiYgZXJyb3Iuc3RhY2sgfHwgZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlW2xldmVsXShtZXNzYWdlLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBkZXByZWNhdGlvbldhcm5pbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIGxvZygnd2FybicsIGRlcHJlY2F0aW9uV2FybmluZyk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIHVwZGF0ZUluY2VudGl2ZSA9IGV4cG9ydHMudXBkYXRlSW5jZW50aXZlID0gZnVuY3Rpb24gdXBkYXRlSW5jZW50aXZlKGRlcHJlY2F0ZWQsIHByZWZlcnJlZCkge1xuICByZXR1cm4gZGVwcmVjYXRlZCArICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAnICsgcHJlZmVycmVkICsgJywgcGxlYXNlIHVwZGF0ZSB5b3VyIGNvZGUnO1xufTtcblxudmFyIGludGVybmFsRXJyID0gZXhwb3J0cy5pbnRlcm5hbEVyciA9IGZ1bmN0aW9uIGludGVybmFsRXJyKGVycikge1xuICByZXR1cm4gbmV3IEVycm9yKCdcXG4gIHJlZHV4LXNhZ2E6IEVycm9yIGNoZWNraW5nIGhvb2tzIGRldGVjdGVkIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gVGhpcyBpcyBsaWtlbHkgYSBidWdcXG4gIGluIHJlZHV4LXNhZ2EgY29kZSBhbmQgbm90IHlvdXJzLiBUaGFua3MgZm9yIHJlcG9ydGluZyB0aGlzIGluIHRoZSBwcm9qZWN0XFwncyBnaXRodWIgcmVwby5cXG4gIEVycm9yOiAnICsgZXJyICsgJ1xcbicpO1xufTtcblxudmFyIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nID0gZXhwb3J0cy5jcmVhdGVTZXRDb250ZXh0V2FybmluZyA9IGZ1bmN0aW9uIGNyZWF0ZVNldENvbnRleHRXYXJuaW5nKGN0eCwgcHJvcHMpIHtcbiAgcmV0dXJuIChjdHggPyBjdHggKyAnLicgOiAnJykgKyAnc2V0Q29udGV4dChwcm9wcyk6IGFyZ3VtZW50ICcgKyBwcm9wcyArICcgaXMgbm90IGEgcGxhaW4gb2JqZWN0Jztcbn07XG5cbnZhciB3cmFwU2FnYURpc3BhdGNoID0gZXhwb3J0cy53cmFwU2FnYURpc3BhdGNoID0gZnVuY3Rpb24gd3JhcFNhZ2FEaXNwYXRjaChkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBkaXNwYXRjaChPYmplY3QuZGVmaW5lUHJvcGVydHkoYWN0aW9uLCBTQUdBX0FDVElPTiwgeyB2YWx1ZTogdHJ1ZSB9KSk7XG4gIH07XG59O1xuXG52YXIgY2xvbmVhYmxlR2VuZXJhdG9yID0gZXhwb3J0cy5jbG9uZWFibGVHZW5lcmF0b3IgPSBmdW5jdGlvbiBjbG9uZWFibGVHZW5lcmF0b3IoZ2VuZXJhdG9yRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBoaXN0b3J5ID0gW107XG4gICAgdmFyIGdlbiA9IGdlbmVyYXRvckZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dChhcmcpIHtcbiAgICAgICAgaGlzdG9yeS5wdXNoKGFyZyk7XG4gICAgICAgIHJldHVybiBnZW4ubmV4dChhcmcpO1xuICAgICAgfSxcbiAgICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgICAgdmFyIGNsb25lZEdlbiA9IGNsb25lYWJsZUdlbmVyYXRvcihnZW5lcmF0b3JGdW5jKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICBoaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHJldHVybiBjbG9uZWRHZW4ubmV4dChhcmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZEdlbjtcbiAgICAgIH0sXG4gICAgICByZXR1cm46IGZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdlbi5yZXR1cm4odmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHRocm93OiBmdW5jdGlvbiBfdGhyb3coZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZW4udGhyb3coZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDc0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlRBU0tfQ0FOQ0VMID0gZXhwb3J0cy5DSEFOTkVMX0VORCA9IGV4cG9ydHMuTk9UX0lURVJBVE9SX0VSUk9SID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHByb2M7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX3NjaGVkdWxlciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9idWZmZXJzJyk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyhvYmosIGRlc2NzKSB7IGZvciAodmFyIGtleSBpbiBkZXNjcykgeyB2YXIgZGVzYyA9IGRlc2NzW2tleV07IGRlc2MuY29uZmlndXJhYmxlID0gZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBkZXNjKTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBOT1RfSVRFUkFUT1JfRVJST1IgPSBleHBvcnRzLk5PVF9JVEVSQVRPUl9FUlJPUiA9ICdwcm9jIGZpcnN0IGFyZ3VtZW50IChTYWdhIGZ1bmN0aW9uIHJlc3VsdCkgbXVzdCBiZSBhbiBpdGVyYXRvcic7XG5cbnZhciBDSEFOTkVMX0VORCA9IGV4cG9ydHMuQ0hBTk5FTF9FTkQgPSB7XG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ0BAcmVkdXgtc2FnYS9DSEFOTkVMX0VORCc7XG4gIH1cbn07XG52YXIgVEFTS19DQU5DRUwgPSBleHBvcnRzLlRBU0tfQ0FOQ0VMID0ge1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdAQHJlZHV4LXNhZ2EvVEFTS19DQU5DRUwnO1xuICB9XG59O1xuXG52YXIgbWF0Y2hlcnMgPSB7XG4gIHdpbGRjYXJkOiBmdW5jdGlvbiB3aWxkY2FyZCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmtUcnVlO1xuICB9LFxuICBkZWZhdWx0OiBmdW5jdGlvbiBfZGVmYXVsdChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGF0dGVybikpID09PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IHBhdHRlcm47XG4gICAgfSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0LnR5cGUgPT09IFN0cmluZyhwYXR0ZXJuKTtcbiAgICB9O1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24gYXJyYXkocGF0dGVybnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcihwKShpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICBwcmVkaWNhdGU6IGZ1bmN0aW9uIHByZWRpY2F0ZShfcHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgcmV0dXJuIF9wcmVkaWNhdGUoaW5wdXQpO1xuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hdGNoZXIocGF0dGVybikge1xuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgcmV0dXJuIChwYXR0ZXJuID09PSAnKicgPyBtYXRjaGVycy53aWxkY2FyZCA6IF91dGlscy5pcy5hcnJheShwYXR0ZXJuKSA/IG1hdGNoZXJzLmFycmF5IDogX3V0aWxzLmlzLnN0cmluZ2FibGVGdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMuZGVmYXVsdCA6IF91dGlscy5pcy5mdW5jKHBhdHRlcm4pID8gbWF0Y2hlcnMucHJlZGljYXRlIDogbWF0Y2hlcnMuZGVmYXVsdCkocGF0dGVybik7XG59XG5cbi8qKlxuICBVc2VkIHRvIHRyYWNrIGEgcGFyZW50IHRhc2sgYW5kIGl0cyBmb3Jrc1xuICBJbiB0aGUgbmV3IGZvcmsgbW9kZWwsIGZvcmtlZCB0YXNrcyBhcmUgYXR0YWNoZWQgYnkgZGVmYXVsdCB0byB0aGVpciBwYXJlbnRcbiAgV2UgbW9kZWwgdGhpcyB1c2luZyB0aGUgY29uY2VwdCBvZiBQYXJlbnQgdGFzayAmJiBtYWluIFRhc2tcbiAgbWFpbiB0YXNrIGlzIHRoZSBtYWluIGZsb3cgb2YgdGhlIGN1cnJlbnQgR2VuZXJhdG9yLCB0aGUgcGFyZW50IHRhc2tzIGlzIHRoZVxuICBhZ2dyZWdhdGlvbiBvZiB0aGUgbWFpbiB0YXNrcyArIGFsbCBpdHMgZm9ya2VkIHRhc2tzLlxuICBUaHVzIHRoZSB3aG9sZSBtb2RlbCByZXByZXNlbnRzIGFuIGV4ZWN1dGlvbiB0cmVlIHdpdGggbXVsdGlwbGUgYnJhbmNoZXMgKHZzIHRoZVxuICBsaW5lYXIgZXhlY3V0aW9uIHRyZWUgaW4gc2VxdWVudGlhbCAobm9uIHBhcmFsbGVsKSBwcm9ncmFtbWluZylcblxuICBBIHBhcmVudCB0YXNrcyBoYXMgdGhlIGZvbGxvd2luZyBzZW1hbnRpY3NcbiAgLSBJdCBjb21wbGV0ZXMgaWYgYWxsIGl0cyBmb3JrcyBlaXRoZXIgY29tcGxldGUgb3IgYWxsIGNhbmNlbGxlZFxuICAtIElmIGl0J3MgY2FuY2VsbGVkLCBhbGwgZm9ya3MgYXJlIGNhbmNlbGxlZCBhcyB3ZWxsXG4gIC0gSXQgYWJvcnRzIGlmIGFueSB1bmNhdWdodCBlcnJvciBidWJibGVzIHVwIGZyb20gZm9ya3NcbiAgLSBJZiBpdCBjb21wbGV0ZXMsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG9uZSByZXR1cm5lZCBieSB0aGUgbWFpbiB0YXNrXG4qKi9cbmZ1bmN0aW9uIGZvcmtRdWV1ZShuYW1lLCBtYWluVGFzaywgY2IpIHtcbiAgdmFyIHRhc2tzID0gW10sXG4gICAgICByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgYWRkVGFzayhtYWluVGFzayk7XG5cbiAgZnVuY3Rpb24gYWJvcnQoZXJyKSB7XG4gICAgY2FuY2VsQWxsKCk7XG4gICAgY2IoZXJyLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhc2sodGFzaykge1xuICAgIHRhc2tzLnB1c2godGFzayk7XG4gICAgdGFzay5jb250ID0gZnVuY3Rpb24gKHJlcywgaXNFcnIpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAoMCwgX3V0aWxzLnJlbW92ZSkodGFza3MsIHRhc2spO1xuICAgICAgdGFzay5jb250ID0gX3V0aWxzLm5vb3A7XG4gICAgICBpZiAoaXNFcnIpIHtcbiAgICAgICAgYWJvcnQocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrID09PSBtYWluVGFzaykge1xuICAgICAgICAgIHJlc3VsdCA9IHJlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLy8gdGFzay5jb250LmNhbmNlbCA9IHRhc2suY2FuY2VsXG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG4gICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRhc2tzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIHQuY29udCA9IF91dGlscy5ub29wO1xuICAgICAgdC5jYW5jZWwoKTtcbiAgICB9KTtcbiAgICB0YXNrcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRUYXNrOiBhZGRUYXNrLFxuICAgIGNhbmNlbEFsbDogY2FuY2VsQWxsLFxuICAgIGFib3J0OiBhYm9ydCxcbiAgICBnZXRUYXNrczogZnVuY3Rpb24gZ2V0VGFza3MoKSB7XG4gICAgICByZXR1cm4gdGFza3M7XG4gICAgfSxcbiAgICB0YXNrTmFtZXM6IGZ1bmN0aW9uIHRhc2tOYW1lcygpIHtcbiAgICAgIHJldHVybiB0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQubmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFza0l0ZXJhdG9yKF9yZWYpIHtcbiAgdmFyIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBmbiA9IF9yZWYuZm4sXG4gICAgICBhcmdzID0gX3JlZi5hcmdzO1xuXG4gIGlmIChfdXRpbHMuaXMuaXRlcmF0b3IoZm4pKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyIGFuZCAjNDQxXG4gIHZhciByZXN1bHQgPSB2b2lkIDAsXG4gICAgICBlcnJvciA9IHZvaWQgMDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IgPSBlcnI7XG4gIH1cblxuICAvLyBpLmUuIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYW4gaXRlcmF0b3JcbiAgaWYgKF91dGlscy5pcy5pdGVyYXRvcihyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBidWJibGUgdXAgc3luY2hyb25vdXMgZmFpbHVyZXMgZm9yIGRldGFjaGVkIGZvcmtzXG4gIC8vIGluc3RlYWQgY3JlYXRlIGEgZmFpbGVkIHRhc2suIFNlZSAjMTUyIGFuZCAjNDQxXG4gIHJldHVybiBlcnJvciA/ICgwLCBfdXRpbHMubWFrZUl0ZXJhdG9yKShmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0pIDogKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGMgPSB2b2lkIDA7XG4gICAgdmFyIGVmZiA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHQgfTtcbiAgICB2YXIgcmV0ID0gZnVuY3Rpb24gcmV0KHZhbHVlKSB7XG4gICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICBpZiAoIXBjKSB7XG4gICAgICAgIHBjID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXQoYXJnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KCkpO1xufVxuXG52YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIHdyYXBIZWxwZXIoaGVscGVyKSB7XG4gIHJldHVybiB7IGZuOiBoZWxwZXIgfTtcbn07XG5cbmZ1bmN0aW9uIHByb2MoaXRlcmF0b3IpIHtcbiAgdmFyIHN1YnNjcmliZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdXRpbHMubm9vcDtcbiAgfTtcbiAgdmFyIGRpc3BhdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBfdXRpbHMubm9vcDtcbiAgdmFyIGdldFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBfdXRpbHMubm9vcDtcbiAgdmFyIHBhcmVudENvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IHt9O1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDoge307XG4gIHZhciBwYXJlbnRFZmZlY3RJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gNyAmJiBhcmd1bWVudHNbN10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s3XSA6ICdhbm9ueW1vdXMnO1xuICB2YXIgY29udCA9IGFyZ3VtZW50c1s4XTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShpdGVyYXRvciwgX3V0aWxzLmlzLml0ZXJhdG9yLCBOT1RfSVRFUkFUT1JfRVJST1IpO1xuXG4gIHZhciBlZmZlY3RzU3RyaW5nID0gJ1suLi5lZmZlY3RzXSc7XG4gIHZhciBydW5QYXJhbGxlbEVmZmVjdCA9ICgwLCBfdXRpbHMuZGVwcmVjYXRlKShydW5BbGxFZmZlY3QsICgwLCBfdXRpbHMudXBkYXRlSW5jZW50aXZlKShlZmZlY3RzU3RyaW5nLCAnYWxsKCcgKyBlZmZlY3RzU3RyaW5nICsgJyknKSk7XG5cbiAgdmFyIHNhZ2FNb25pdG9yID0gb3B0aW9ucy5zYWdhTW9uaXRvcixcbiAgICAgIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyLFxuICAgICAgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcblxuICB2YXIgbG9nID0gbG9nZ2VyIHx8IF91dGlscy5sb2c7XG4gIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKGVycikge1xuICAgIHZhciBtZXNzYWdlID0gZXJyLnNhZ2FTdGFjaztcblxuICAgIGlmICghbWVzc2FnZSAmJiBlcnIuc3RhY2spIHtcbiAgICAgIG1lc3NhZ2UgPSBlcnIuc3RhY2suc3BsaXQoJ1xcbicpWzBdLmluZGV4T2YoZXJyLm1lc3NhZ2UpICE9PSAtMSA/IGVyci5zdGFjayA6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlICsgJ1xcbicgKyBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgbG9nKCdlcnJvcicsICd1bmNhdWdodCBhdCAnICsgbmFtZSwgbWVzc2FnZSB8fCBlcnIubWVzc2FnZSB8fCBlcnIpO1xuICB9O1xuICB2YXIgc3RkQ2hhbm5lbCA9ICgwLCBfY2hhbm5lbC5zdGRDaGFubmVsKShzdWJzY3JpYmUpO1xuICB2YXIgdGFza0NvbnRleHQgPSBPYmplY3QuY3JlYXRlKHBhcmVudENvbnRleHQpO1xuICAvKipcbiAgICBUcmFja3MgdGhlIGN1cnJlbnQgZWZmZWN0IGNhbmNlbGxhdGlvblxuICAgIEVhY2ggdGltZSB0aGUgZ2VuZXJhdG9yIHByb2dyZXNzZXMuIGNhbGxpbmcgcnVuRWZmZWN0IHdpbGwgc2V0IGEgbmV3IHZhbHVlXG4gICAgb24gaXQuIEl0IGFsbG93cyBwcm9wYWdhdGluZyBjYW5jZWxsYXRpb24gdG8gY2hpbGQgZWZmZWN0c1xuICAqKi9cbiAgbmV4dC5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAvKipcbiAgICBDcmVhdGVzIGEgbmV3IHRhc2sgZGVzY3JpcHRvciBmb3IgdGhpcyBnZW5lcmF0b3IsIFdlJ2xsIGFsc28gY3JlYXRlIGEgbWFpbiB0YXNrXG4gICAgdG8gdHJhY2sgdGhlIG1haW4gZmxvdyAoYmVzaWRlcyBvdGhlciBmb3JrZWQgdGFza3MpXG4gICoqL1xuICB2YXIgdGFzayA9IG5ld1Rhc2socGFyZW50RWZmZWN0SWQsIG5hbWUsIGl0ZXJhdG9yLCBjb250KTtcbiAgdmFyIG1haW5UYXNrID0geyBuYW1lOiBuYW1lLCBjYW5jZWw6IGNhbmNlbE1haW4sIGlzUnVubmluZzogdHJ1ZSB9O1xuICB2YXIgdGFza1F1ZXVlID0gZm9ya1F1ZXVlKG5hbWUsIG1haW5UYXNrLCBlbmQpO1xuXG4gIC8qKlxuICAgIGNhbmNlbGxhdGlvbiBvZiB0aGUgbWFpbiB0YXNrLiBXZSdsbCBzaW1wbHkgcmVzdW1lIHRoZSBHZW5lcmF0b3Igd2l0aCBhIENhbmNlbFxuICAqKi9cbiAgZnVuY3Rpb24gY2FuY2VsTWFpbigpIHtcbiAgICBpZiAobWFpblRhc2suaXNSdW5uaW5nICYmICFtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgbmV4dChUQVNLX0NBTkNFTCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAgVGhpcyBtYXkgYmUgY2FsbGVkIGJ5IGEgcGFyZW50IGdlbmVyYXRvciB0byB0cmlnZ2VyL3Byb3BhZ2F0ZSBjYW5jZWxsYXRpb25cbiAgICBjYW5jZWwgYWxsIHBlbmRpbmcgdGFza3MgKGluY2x1ZGluZyB0aGUgbWFpbiB0YXNrKSwgdGhlbiBlbmQgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgQ2FuY2VsbGF0aW9uIHByb3BhZ2F0ZXMgZG93biB0byB0aGUgd2hvbGUgZXhlY3V0aW9uIHRyZWUgaG9sZGVkIGJ5IHRoaXMgUGFyZW50IHRhc2tcbiAgICBJdCdzIGFsc28gcHJvcGFnYXRlZCB0byBhbGwgam9pbmVycyBvZiB0aGlzIHRhc2sgYW5kIHRoZWlyIGV4ZWN1dGlvbiB0cmVlL2pvaW5lcnNcbiAgICAgQ2FuY2VsbGF0aW9uIGlzIG5vb3AgZm9yIHRlcm1pbmF0ZWQvQ2FuY2VsbGVkIHRhc2tzIHRhc2tzXG4gICoqL1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgLyoqXG4gICAgICBXZSBuZWVkIHRvIGNoZWNrIGJvdGggUnVubmluZyBhbmQgQ2FuY2VsbGVkIHN0YXR1c1xuICAgICAgVGFza3MgY2FuIGJlIENhbmNlbGxlZCBidXQgc3RpbGwgUnVubmluZ1xuICAgICoqL1xuICAgIGlmIChpdGVyYXRvci5faXNSdW5uaW5nICYmICFpdGVyYXRvci5faXNDYW5jZWxsZWQpIHtcbiAgICAgIGl0ZXJhdG9yLl9pc0NhbmNlbGxlZCA9IHRydWU7XG4gICAgICB0YXNrUXVldWUuY2FuY2VsQWxsKCk7XG4gICAgICAvKipcbiAgICAgICAgRW5kaW5nIHdpdGggYSBOZXZlciByZXN1bHQgd2lsbCBwcm9wYWdhdGUgdGhlIENhbmNlbGxhdGlvbiB0byBhbGwgam9pbmVyc1xuICAgICAgKiovXG4gICAgICBlbmQoVEFTS19DQU5DRUwpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICBhdHRhY2hlcyBjYW5jZWxsYXRpb24gbG9naWMgdG8gdGhpcyB0YXNrJ3MgY29udGludWF0aW9uXG4gICAgdGhpcyB3aWxsIHBlcm1pdCBjYW5jZWxsYXRpb24gdG8gcHJvcGFnYXRlIGRvd24gdGhlIGNhbGwgY2hhaW5cbiAgKiovXG4gIGNvbnQgJiYgKGNvbnQuY2FuY2VsID0gY2FuY2VsKTtcblxuICAvLyB0cmFja3MgdGhlIHJ1bm5pbmcgc3RhdHVzXG4gIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSB0cnVlO1xuXG4gIC8vIGtpY2tzIHVwIHRoZSBnZW5lcmF0b3JcbiAgbmV4dCgpO1xuXG4gIC8vIHRoZW4gcmV0dXJuIHRoZSB0YXNrIGRlc2NyaXB0b3IgdG8gdGhlIGNhbGxlclxuICByZXR1cm4gdGFzaztcblxuICAvKipcbiAgICBUaGlzIGlzIHRoZSBnZW5lcmF0b3IgZHJpdmVyXG4gICAgSXQncyBhIHJlY3Vyc2l2ZSBhc3luYy9jb250aW51YXRpb24gZnVuY3Rpb24gd2hpY2ggY2FsbHMgaXRzZWxmXG4gICAgdW50aWwgdGhlIGdlbmVyYXRvciB0ZXJtaW5hdGVzIG9yIHRocm93c1xuICAqKi9cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGlzRXJyKSB7XG4gICAgLy8gUHJldmVudGl2ZSBtZWFzdXJlLiBJZiB3ZSBlbmQgdXAgaGVyZSwgdGhlbiB0aGVyZSBpcyByZWFsbHkgc29tZXRoaW5nIHdyb25nXG4gICAgaWYgKCFtYWluVGFzay5pc1J1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHJlc3VtZSBhbiBhbHJlYWR5IGZpbmlzaGVkIGdlbmVyYXRvcicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuICAgICAgaWYgKGlzRXJyKSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLnRocm93KGFyZyk7XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gVEFTS19DQU5DRUwpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAgZ2V0dGluZyBUQVNLX0NBTkNFTCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIG1haW4gdGFza1xuICAgICAgICAgIFdlIGNhbiBnZXQgdGhpcyB2YWx1ZSBoZXJlXG4gICAgICAgICAgIC0gQnkgY2FuY2VsbGluZyB0aGUgcGFyZW50IHRhc2sgbWFudWFsbHlcbiAgICAgICAgICAtIEJ5IGpvaW5pbmcgYSBDYW5jZWxsZWQgdGFza1xuICAgICAgICAqKi9cbiAgICAgICAgbWFpblRhc2suaXNDYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICBDYW5jZWxzIHRoZSBjdXJyZW50IGVmZmVjdDsgdGhpcyB3aWxsIHByb3BhZ2F0ZSB0aGUgY2FuY2VsbGF0aW9uIGRvd24gdG8gYW55IGNhbGxlZCB0YXNrc1xuICAgICAgICAqKi9cbiAgICAgICAgbmV4dC5jYW5jZWwoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAgSWYgdGhpcyBHZW5lcmF0b3IgaGFzIGEgYHJldHVybmAgbWV0aG9kIHRoZW4gaW52b2tlcyBpdFxuICAgICAgICAgIFRoaXMgd2lsbCBqdW1wIHRvIHRoZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICoqL1xuICAgICAgICByZXN1bHQgPSBfdXRpbHMuaXMuZnVuYyhpdGVyYXRvci5yZXR1cm4pID8gaXRlcmF0b3IucmV0dXJuKFRBU0tfQ0FOQ0VMKSA6IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IFRBU0tfQ0FOQ0VMIH07XG4gICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gQ0hBTk5FTF9FTkQpIHtcbiAgICAgICAgLy8gV2UgZ2V0IENIQU5ORUxfRU5EIGJ5IHRha2luZyBmcm9tIGEgY2hhbm5lbCB0aGF0IGVuZGVkIHVzaW5nIGB0YWtlYCAoYW5kIG5vdCBgdGFrZW1gIHVzZWQgdG8gdHJhcCBFbmQgb2YgY2hhbm5lbHMpXG4gICAgICAgIHJlc3VsdCA9IF91dGlscy5pcy5mdW5jKGl0ZXJhdG9yLnJldHVybikgPyBpdGVyYXRvci5yZXR1cm4oKSA6IHsgZG9uZTogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dChhcmcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgIHJ1bkVmZmVjdChyZXN1bHQudmFsdWUsIHBhcmVudEVmZmVjdElkLCAnJywgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICBUaGlzIEdlbmVyYXRvciBoYXMgZW5kZWQsIHRlcm1pbmF0ZSB0aGUgbWFpbiB0YXNrIGFuZCBub3RpZnkgdGhlIGZvcmsgcXVldWVcbiAgICAgICAgKiovXG4gICAgICAgIG1haW5UYXNrLmlzTWFpblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgbWFpblRhc2suY29udCAmJiBtYWluVGFzay5jb250KHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChtYWluVGFzay5pc0NhbmNlbGxlZCkge1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBtYWluVGFzay5pc01haW5SdW5uaW5nID0gZmFsc2U7XG4gICAgICBtYWluVGFzay5jb250KGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmQocmVzdWx0LCBpc0Vycikge1xuICAgIGl0ZXJhdG9yLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICBzdGRDaGFubmVsLmNsb3NlKCk7XG4gICAgaWYgKCFpc0Vycikge1xuICAgICAgaXRlcmF0b3IuX3Jlc3VsdCA9IHJlc3VsdDtcbiAgICAgIGl0ZXJhdG9yLl9kZWZlcnJlZEVuZCAmJiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgJ3NhZ2FTdGFjaycsIHtcbiAgICAgICAgICB2YWx1ZTogJ2F0ICcgKyBuYW1lICsgJyBcXG4gJyArIChyZXN1bHQuc2FnYVN0YWNrIHx8IHJlc3VsdC5zdGFjayksXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0YXNrLmNvbnQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yICYmIG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nRXJyb3IocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlcmF0b3IuX2Vycm9yID0gcmVzdWx0O1xuICAgICAgaXRlcmF0b3IuX2lzQWJvcnRlZCA9IHRydWU7XG4gICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgJiYgaXRlcmF0b3IuX2RlZmVycmVkRW5kLnJlamVjdChyZXN1bHQpO1xuICAgIH1cbiAgICB0YXNrLmNvbnQgJiYgdGFzay5jb250KHJlc3VsdCwgaXNFcnIpO1xuICAgIHRhc2suam9pbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICByZXR1cm4gai5jYihyZXN1bHQsIGlzRXJyKTtcbiAgICB9KTtcbiAgICB0YXNrLmpvaW5lcnMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuRWZmZWN0KGVmZmVjdCwgcGFyZW50RWZmZWN0SWQpIHtcbiAgICB2YXIgbGFiZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICcnO1xuICAgIHZhciBjYiA9IGFyZ3VtZW50c1szXTtcblxuICAgIHZhciBlZmZlY3RJZCA9ICgwLCBfdXRpbHMudWlkKSgpO1xuICAgIHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmVmZmVjdFRyaWdnZXJlZCh7IGVmZmVjdElkOiBlZmZlY3RJZCwgcGFyZW50RWZmZWN0SWQ6IHBhcmVudEVmZmVjdElkLCBsYWJlbDogbGFiZWwsIGVmZmVjdDogZWZmZWN0IH0pO1xuXG4gICAgLyoqXG4gICAgICBjb21wbGV0aW9uIGNhbGxiYWNrIGFuZCBjYW5jZWwgY2FsbGJhY2sgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgV2UgY2FuJ3QgY2FuY2VsIGFuIGFscmVhZHkgY29tcGxldGVkIGVmZmVjdFxuICAgICAgQW5kIFdlIGNhbid0IGNvbXBsZXRlIGFuIGFscmVhZHkgY2FuY2VsbGVkIGVmZmVjdElkXG4gICAgKiovXG4gICAgdmFyIGVmZmVjdFNldHRsZWQgPSB2b2lkIDA7XG5cbiAgICAvLyBDb21wbGV0aW9uIGNhbGxiYWNrIHBhc3NlZCB0byB0aGUgYXBwcm9wcmlhdGUgZWZmZWN0IHJ1bm5lclxuICAgIGZ1bmN0aW9uIGN1cnJDYihyZXMsIGlzRXJyKSB7XG4gICAgICBpZiAoZWZmZWN0U2V0dGxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVmZmVjdFNldHRsZWQgPSB0cnVlO1xuICAgICAgY2IuY2FuY2VsID0gX3V0aWxzLm5vb3A7IC8vIGRlZmVuc2l2ZSBtZWFzdXJlXG4gICAgICBpZiAoc2FnYU1vbml0b3IpIHtcbiAgICAgICAgaXNFcnIgPyBzYWdhTW9uaXRvci5lZmZlY3RSZWplY3RlZChlZmZlY3RJZCwgcmVzKSA6IHNhZ2FNb25pdG9yLmVmZmVjdFJlc29sdmVkKGVmZmVjdElkLCByZXMpO1xuICAgICAgfVxuICAgICAgY2IocmVzLCBpc0Vycik7XG4gICAgfVxuICAgIC8vIHRyYWNrcyBkb3duIHRoZSBjdXJyZW50IGNhbmNlbFxuICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDtcblxuICAgIC8vIHNldHVwIGNhbmNlbGxhdGlvbiBsb2dpYyBvbiB0aGUgcGFyZW50IGNiXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcHJldmVudHMgY2FuY2VsbGluZyBhbiBhbHJlYWR5IGNvbXBsZXRlZCBlZmZlY3RcbiAgICAgIGlmIChlZmZlY3RTZXR0bGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWZmZWN0U2V0dGxlZCA9IHRydWU7XG4gICAgICAvKipcbiAgICAgICAgcHJvcGFnYXRlcyBjYW5jZWwgZG93bndhcmRcbiAgICAgICAgY2F0Y2ggdW5jYXVnaHQgY2FuY2VsbGF0aW9ucyBlcnJvcnM7IHNpbmNlIHdlIGNhbiBubyBsb25nZXIgY2FsbCB0aGUgY29tcGxldGlvblxuICAgICAgICBjYWxsYmFjaywgbG9nIGVycm9ycyByYWlzZWQgZHVyaW5nIGNhbmNlbGxhdGlvbnMgaW50byB0aGUgY29uc29sZVxuICAgICAgKiovXG4gICAgICB0cnkge1xuICAgICAgICBjdXJyQ2IuY2FuY2VsKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGN1cnJDYi5jYW5jZWwgPSBfdXRpbHMubm9vcDsgLy8gZGVmZW5zaXZlIG1lYXN1cmVcblxuICAgICAgc2FnYU1vbml0b3IgJiYgc2FnYU1vbml0b3IuZWZmZWN0Q2FuY2VsbGVkKGVmZmVjdElkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICBlYWNoIGVmZmVjdCBydW5uZXIgbXVzdCBhdHRhY2ggaXRzIG93biBsb2dpYyBvZiBjYW5jZWxsYXRpb24gdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICBpdCBhbGxvd3MgdGhpcyBnZW5lcmF0b3IgdG8gcHJvcGFnYXRlIGNhbmNlbGxhdGlvbiBkb3dud2FyZC5cbiAgICAgICBBVFRFTlRJT04hIGVmZmVjdCBydW5uZXJzIG11c3Qgc2V0dXAgdGhlIGNhbmNlbCBsb2dpYyBieSBzZXR0aW5nIGNiLmNhbmNlbCA9IFtjYW5jZWxNZXRob2RdXG4gICAgICBBbmQgdGhlIHNldHVwIG11c3Qgb2NjdXIgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrXG4gICAgICAgVGhpcyBpcyBhIHNvcnQgb2YgaW52ZXJzaW9uIG9mIGNvbnRyb2w6IGNhbGxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIHJlc3BvbnNpYmxlXG4gICAgICBmb3IgY29tcGxldGluZyB0aGUgZmxvdyBieSBjYWxsaW5nIHRoZSBwcm92aWRlZCBjb250aW51YXRpb247IHdoaWxlIGNhbGxlciBmdW5jdGlvbnNcbiAgICAgIGFyZSByZXNwb25zaWJsZSBmb3IgYWJvcnRpbmcgdGhlIGN1cnJlbnQgZmxvdyBieSBjYWxsaW5nIHRoZSBhdHRhY2hlZCBjYW5jZWwgZnVuY3Rpb25cbiAgICAgICBMaWJyYXJ5IHVzZXJzIGNhbiBhdHRhY2ggdGhlaXIgb3duIGNhbmNlbGxhdGlvbiBsb2dpYyB0byBwcm9taXNlcyBieSBkZWZpbmluZyBhXG4gICAgICBwcm9taXNlW0NBTkNFTF0gbWV0aG9kIGluIHRoZWlyIHJldHVybmVkIHByb21pc2VzXG4gICAgICBBVFRFTlRJT04hIGNhbGxpbmcgY2FuY2VsIG11c3QgaGF2ZSBubyBlZmZlY3Qgb24gYW4gYWxyZWFkeSBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGVmZmVjdFxuICAgICoqL1xuICAgIHZhciBkYXRhID0gdm9pZCAwO1xuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgIHJldHVybiAoXG4gICAgICAvLyBOb24gZGVjbGFyYXRpdmUgZWZmZWN0XG4gICAgICBfdXRpbHMuaXMucHJvbWlzZShlZmZlY3QpID8gcmVzb2x2ZVByb21pc2UoZWZmZWN0LCBjdXJyQ2IpIDogX3V0aWxzLmlzLmhlbHBlcihlZmZlY3QpID8gcnVuRm9ya0VmZmVjdCh3cmFwSGVscGVyKGVmZmVjdCksIGVmZmVjdElkLCBjdXJyQ2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKGVmZmVjdCkgPyByZXNvbHZlSXRlcmF0b3IoZWZmZWN0LCBlZmZlY3RJZCwgbmFtZSwgY3VyckNiKVxuXG4gICAgICAvLyBkZWNsYXJhdGl2ZSBlZmZlY3RzXG4gICAgICA6IF91dGlscy5pcy5hcnJheShlZmZlY3QpID8gcnVuUGFyYWxsZWxFZmZlY3QoZWZmZWN0LCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnRha2UoZWZmZWN0KSkgPyBydW5UYWtlRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5wdXQoZWZmZWN0KSkgPyBydW5QdXRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmFsbChlZmZlY3QpKSA/IHJ1bkFsbEVmZmVjdChkYXRhLCBlZmZlY3RJZCwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LnJhY2UoZWZmZWN0KSkgPyBydW5SYWNlRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FsbChlZmZlY3QpKSA/IHJ1bkNhbGxFZmZlY3QoZGF0YSwgZWZmZWN0SWQsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5jcHMoZWZmZWN0KSkgPyBydW5DUFNFZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmZvcmsoZWZmZWN0KSkgPyBydW5Gb3JrRWZmZWN0KGRhdGEsIGVmZmVjdElkLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quam9pbihlZmZlY3QpKSA/IHJ1bkpvaW5FZmZlY3QoZGF0YSwgY3VyckNiKSA6IChkYXRhID0gX2lvLmFzRWZmZWN0LmNhbmNlbChlZmZlY3QpKSA/IHJ1bkNhbmNlbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2VsZWN0KGVmZmVjdCkpID8gcnVuU2VsZWN0RWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5hY3Rpb25DaGFubmVsKGVmZmVjdCkpID8gcnVuQ2hhbm5lbEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuZmx1c2goZWZmZWN0KSkgPyBydW5GbHVzaEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3QuY2FuY2VsbGVkKGVmZmVjdCkpID8gcnVuQ2FuY2VsbGVkRWZmZWN0KGRhdGEsIGN1cnJDYikgOiAoZGF0YSA9IF9pby5hc0VmZmVjdC5nZXRDb250ZXh0KGVmZmVjdCkpID8gcnVuR2V0Q29udGV4dEVmZmVjdChkYXRhLCBjdXJyQ2IpIDogKGRhdGEgPSBfaW8uYXNFZmZlY3Quc2V0Q29udGV4dChlZmZlY3QpKSA/IHJ1blNldENvbnRleHRFZmZlY3QoZGF0YSwgY3VyckNiKSA6IC8qIGFueXRoaW5nIGVsc2UgcmV0dXJuZWQgYXMgaXMgKi9jdXJyQ2IoZWZmZWN0KVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBjYikge1xuICAgIHZhciBjYW5jZWxQcm9taXNlID0gcHJvbWlzZVtfdXRpbHMuQ0FOQ0VMXTtcbiAgICBpZiAoX3V0aWxzLmlzLmZ1bmMoY2FuY2VsUHJvbWlzZSkpIHtcbiAgICAgIGNiLmNhbmNlbCA9IGNhbmNlbFByb21pc2U7XG4gICAgfSBlbHNlIGlmIChfdXRpbHMuaXMuZnVuYyhwcm9taXNlLmFib3J0KSkge1xuICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciB0aGUgZmV0Y2ggQVBJLCB3aGVuZXZlciB0aGV5IGdldCBhcm91bmQgdG9cbiAgICAgIC8vIGFkZGluZyBjYW5jZWwgc3VwcG9ydFxuICAgIH1cbiAgICBwcm9taXNlLnRoZW4oY2IsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJdGVyYXRvcihpdGVyYXRvciwgZWZmZWN0SWQsIG5hbWUsIGNiKSB7XG4gICAgcHJvYyhpdGVyYXRvciwgc3Vic2NyaWJlLCBkaXNwYXRjaCwgZ2V0U3RhdGUsIHRhc2tDb250ZXh0LCBvcHRpb25zLCBlZmZlY3RJZCwgbmFtZSwgY2IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuVGFrZUVmZmVjdChfcmVmMiwgY2IpIHtcbiAgICB2YXIgY2hhbm5lbCA9IF9yZWYyLmNoYW5uZWwsXG4gICAgICAgIHBhdHRlcm4gPSBfcmVmMi5wYXR0ZXJuLFxuICAgICAgICBtYXliZSA9IF9yZWYyLm1heWJlO1xuXG4gICAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgc3RkQ2hhbm5lbDtcbiAgICB2YXIgdGFrZUNiID0gZnVuY3Rpb24gdGFrZUNiKGlucCkge1xuICAgICAgcmV0dXJuIGlucCBpbnN0YW5jZW9mIEVycm9yID8gY2IoaW5wLCB0cnVlKSA6ICgwLCBfY2hhbm5lbC5pc0VuZCkoaW5wKSAmJiAhbWF5YmUgPyBjYihDSEFOTkVMX0VORCkgOiBjYihpbnApO1xuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwudGFrZSh0YWtlQ2IsIG1hdGNoZXIocGF0dGVybikpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVyciwgdHJ1ZSk7XG4gICAgfVxuICAgIGNiLmNhbmNlbCA9IHRha2VDYi5jYW5jZWw7XG4gIH1cblxuICBmdW5jdGlvbiBydW5QdXRFZmZlY3QoX3JlZjMsIGNiKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBfcmVmMy5jaGFubmVsLFxuICAgICAgICBhY3Rpb24gPSBfcmVmMy5hY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlO1xuXG4gICAgLyoqXG4gICAgICBTY2hlZHVsZSB0aGUgcHV0IGluIGNhc2UgYW5vdGhlciBzYWdhIGlzIGhvbGRpbmcgYSBsb2NrLlxuICAgICAgVGhlIHB1dCB3aWxsIGJlIGV4ZWN1dGVkIGF0b21pY2FsbHkuIGllIG5lc3RlZCBwdXRzIHdpbGwgZXhlY3V0ZSBhZnRlclxuICAgICAgdGhpcyBwdXQgaGFzIHRlcm1pbmF0ZWQuXG4gICAgKiovXG4gICAgKDAsIF9zY2hlZHVsZXIuYXNhcCkoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IChjaGFubmVsID8gY2hhbm5lbC5wdXQgOiBkaXNwYXRjaCkoYWN0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBjaGFubmVsIG9yIGBwdXQucmVzb2x2ZWAgd2FzIHVzZWQgdGhlbiBidWJibGUgdXAgdGhlIGVycm9yLlxuICAgICAgICBpZiAoY2hhbm5lbCB8fCByZXNvbHZlKSByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgICAgICBsb2dFcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlICYmIF91dGlscy5pcy5wcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocmVzdWx0LCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBQdXQgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FsbEVmZmVjdChfcmVmNCwgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGNvbnRleHQgPSBfcmVmNC5jb250ZXh0LFxuICAgICAgICBmbiA9IF9yZWY0LmZuLFxuICAgICAgICBhcmdzID0gX3JlZjQuYXJncztcblxuICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgLy8gY2F0Y2ggc3luY2hyb25vdXMgZmFpbHVyZXM7IHNlZSAjMTUyXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gX3V0aWxzLmlzLnByb21pc2UocmVzdWx0KSA/IHJlc29sdmVQcm9taXNlKHJlc3VsdCwgY2IpIDogX3V0aWxzLmlzLml0ZXJhdG9yKHJlc3VsdCkgPyByZXNvbHZlSXRlcmF0b3IocmVzdWx0LCBlZmZlY3RJZCwgZm4ubmFtZSwgY2IpIDogY2IocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkNQU0VmZmVjdChfcmVmNSwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY1LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjUuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNS5hcmdzO1xuXG4gICAgLy8gQ1BTIChpZSBub2RlIHN0eWxlIGZ1bmN0aW9ucykgY2FuIGRlZmluZSB0aGVpciBvd24gY2FuY2VsbGF0aW9uIGxvZ2ljXG4gICAgLy8gYnkgc2V0dGluZyBjYW5jZWwgZmllbGQgb24gdGhlIGNiXG5cbiAgICAvLyBjYXRjaCBzeW5jaHJvbm91cyBmYWlsdXJlczsgc2VlICMxNTJcbiAgICB0cnkge1xuICAgICAgdmFyIGNwc0NiID0gZnVuY3Rpb24gY3BzQ2IoZXJyLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5pcy51bmRlZihlcnIpID8gY2IocmVzKSA6IGNiKGVyciwgdHJ1ZSk7XG4gICAgICB9O1xuICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoY3BzQ2IpKTtcbiAgICAgIGlmIChjcHNDYi5jYW5jZWwpIHtcbiAgICAgICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjcHNDYi5jYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5Gb3JrRWZmZWN0KF9yZWY2LCBlZmZlY3RJZCwgY2IpIHtcbiAgICB2YXIgY29udGV4dCA9IF9yZWY2LmNvbnRleHQsXG4gICAgICAgIGZuID0gX3JlZjYuZm4sXG4gICAgICAgIGFyZ3MgPSBfcmVmNi5hcmdzLFxuICAgICAgICBkZXRhY2hlZCA9IF9yZWY2LmRldGFjaGVkO1xuXG4gICAgdmFyIHRhc2tJdGVyYXRvciA9IGNyZWF0ZVRhc2tJdGVyYXRvcih7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiwgYXJnczogYXJncyB9KTtcblxuICAgIHRyeSB7XG4gICAgICAoMCwgX3NjaGVkdWxlci5zdXNwZW5kKSgpO1xuICAgICAgdmFyIF90YXNrID0gcHJvYyh0YXNrSXRlcmF0b3IsIHN1YnNjcmliZSwgZGlzcGF0Y2gsIGdldFN0YXRlLCB0YXNrQ29udGV4dCwgb3B0aW9ucywgZWZmZWN0SWQsIGZuLm5hbWUsIGRldGFjaGVkID8gbnVsbCA6IF91dGlscy5ub29wKTtcblxuICAgICAgaWYgKGRldGFjaGVkKSB7XG4gICAgICAgIGNiKF90YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YXNrSXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hZGRUYXNrKF90YXNrKTtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFza0l0ZXJhdG9yLl9lcnJvcikge1xuICAgICAgICAgIHRhc2tRdWV1ZS5hYm9ydCh0YXNrSXRlcmF0b3IuX2Vycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYihfdGFzayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgKDAsIF9zY2hlZHVsZXIuZmx1c2gpKCk7XG4gICAgfVxuICAgIC8vIEZvcmsgZWZmZWN0cyBhcmUgbm9uIGNhbmNlbGxhYmxlc1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSm9pbkVmZmVjdCh0LCBjYikge1xuICAgIGlmICh0LmlzUnVubmluZygpKSB7XG4gICAgICB2YXIgam9pbmVyID0geyB0YXNrOiB0YXNrLCBjYjogY2IgfTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0LmpvaW5lcnMsIGpvaW5lcik7XG4gICAgICB9O1xuICAgICAgdC5qb2luZXJzLnB1c2goam9pbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdC5pc0Fib3J0ZWQoKSA/IGNiKHQuZXJyb3IoKSwgdHJ1ZSkgOiBjYih0LnJlc3VsdCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxFZmZlY3QodGFza1RvQ2FuY2VsLCBjYikge1xuICAgIGlmICh0YXNrVG9DYW5jZWwgPT09IF91dGlscy5TRUxGX0NBTkNFTExBVElPTikge1xuICAgICAgdGFza1RvQ2FuY2VsID0gdGFzaztcbiAgICB9XG4gICAgaWYgKHRhc2tUb0NhbmNlbC5pc1J1bm5pbmcoKSkge1xuICAgICAgdGFza1RvQ2FuY2VsLmNhbmNlbCgpO1xuICAgIH1cbiAgICBjYigpO1xuICAgIC8vIGNhbmNlbCBlZmZlY3RzIGFyZSBub24gY2FuY2VsbGFibGVzXG4gIH1cblxuICBmdW5jdGlvbiBydW5BbGxFZmZlY3QoZWZmZWN0cywgZWZmZWN0SWQsIGNiKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcblxuICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXSA6IHt9KTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVkQ291bnQgPSAwO1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRWZmZWN0RW5kKCkge1xuICAgICAgaWYgKGNvbXBsZXRlZENvdW50ID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBfdXRpbHMuYXJyYXkuZnJvbShfZXh0ZW5kcyh7fSwgcmVzdWx0cywgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFcnIgfHwgKDAsIF9jaGFubmVsLmlzRW5kKShyZXMpIHx8IHJlcyA9PT0gQ0hBTk5FTF9FTkQgfHwgcmVzID09PSBUQVNLX0NBTkNFTCkge1xuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNiKHJlcywgaXNFcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcbiAgICAgICAgICBjb21wbGV0ZWRDb3VudCsrO1xuICAgICAgICAgIGNoZWNrRWZmZWN0RW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaENiQXRLZXkuY2FuY2VsID0gX3V0aWxzLm5vb3A7XG4gICAgICBjaGlsZENic1trZXldID0gY2hDYkF0S2V5O1xuICAgIH0pO1xuXG4gICAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGRDYnNba2V5XS5jYW5jZWwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5SYWNlRWZmZWN0KGVmZmVjdHMsIGVmZmVjdElkLCBjYikge1xuICAgIHZhciBjb21wbGV0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTtcbiAgICB2YXIgY2hpbGRDYnMgPSB7fTtcblxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY2hDYkF0S2V5ID0gZnVuY3Rpb24gY2hDYkF0S2V5KHJlcywgaXNFcnIpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Vycikge1xuICAgICAgICAgIC8vIFJhY2UgQXV0byBjYW5jZWxsYXRpb25cbiAgICAgICAgICBjYi5jYW5jZWwoKTtcbiAgICAgICAgICBjYihyZXMsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCEoMCwgX2NoYW5uZWwuaXNFbmQpKHJlcykgJiYgcmVzICE9PSBDSEFOTkVMX0VORCAmJiByZXMgIT09IFRBU0tfQ0FOQ0VMKSB7XG4gICAgICAgICAgdmFyIF9yZXNwb25zZTtcblxuICAgICAgICAgIGNiLmNhbmNlbCgpO1xuICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0gKF9yZXNwb25zZSA9IHt9LCBfcmVzcG9uc2Vba2V5XSA9IHJlcywgX3Jlc3BvbnNlKTtcbiAgICAgICAgICBjYihfdXRpbHMuaXMuYXJyYXkoZWZmZWN0cykgPyBbXS5zbGljZS5jYWxsKF9leHRlbmRzKHt9LCByZXNwb25zZSwgeyBsZW5ndGg6IGtleXMubGVuZ3RoIH0pKSA6IHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNoQ2JBdEtleS5jYW5jZWwgPSBfdXRpbHMubm9vcDtcbiAgICAgIGNoaWxkQ2JzW2tleV0gPSBjaENiQXRLZXk7XG4gICAgfSk7XG5cbiAgICBjYi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBwcmV2ZW50cyB1bm5lY2Vzc2FyeSBjYW5jZWxsYXRpb25cbiAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkQ2JzW2tleV0uY2FuY2VsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcnVuRWZmZWN0KGVmZmVjdHNba2V5XSwgZWZmZWN0SWQsIGtleSwgY2hpbGRDYnNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5TZWxlY3RFZmZlY3QoX3JlZjcsIGNiKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gX3JlZjcuc2VsZWN0b3IsXG4gICAgICAgIGFyZ3MgPSBfcmVmNy5hcmdzO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdGF0ZSA9IHNlbGVjdG9yLmFwcGx5KHVuZGVmaW5lZCwgW2dldFN0YXRlKCldLmNvbmNhdChhcmdzKSk7XG4gICAgICBjYihzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNiKGVycm9yLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBydW5DaGFubmVsRWZmZWN0KF9yZWY4LCBjYikge1xuICAgIHZhciBwYXR0ZXJuID0gX3JlZjgucGF0dGVybixcbiAgICAgICAgYnVmZmVyID0gX3JlZjguYnVmZmVyO1xuXG4gICAgdmFyIG1hdGNoID0gbWF0Y2hlcihwYXR0ZXJuKTtcbiAgICBtYXRjaC5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICBjYigoMCwgX2NoYW5uZWwuZXZlbnRDaGFubmVsKShzdWJzY3JpYmUsIGJ1ZmZlciB8fCBfYnVmZmVycy5idWZmZXJzLmZpeGVkKCksIG1hdGNoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5DYW5jZWxsZWRFZmZlY3QoZGF0YSwgY2IpIHtcbiAgICBjYighIW1haW5UYXNrLmlzQ2FuY2VsbGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkZsdXNoRWZmZWN0KGNoYW5uZWwsIGNiKSB7XG4gICAgY2hhbm5lbC5mbHVzaChjYik7XG4gIH1cblxuICBmdW5jdGlvbiBydW5HZXRDb250ZXh0RWZmZWN0KHByb3AsIGNiKSB7XG4gICAgY2IodGFza0NvbnRleHRbcHJvcF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuU2V0Q29udGV4dEVmZmVjdChwcm9wcywgY2IpIHtcbiAgICBfdXRpbHMub2JqZWN0LmFzc2lnbih0YXNrQ29udGV4dCwgcHJvcHMpO1xuICAgIGNiKCk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdUYXNrKGlkLCBuYW1lLCBpdGVyYXRvciwgY29udCkge1xuICAgIHZhciBfZG9uZSwgX3JlZjksIF9tdXRhdG9yTWFwO1xuXG4gICAgaXRlcmF0b3IuX2RlZmVycmVkRW5kID0gbnVsbDtcbiAgICByZXR1cm4gX3JlZjkgPSB7fSwgX3JlZjlbX3V0aWxzLlRBU0tdID0gdHJ1ZSwgX3JlZjkuaWQgPSBpZCwgX3JlZjkubmFtZSA9IG5hbWUsIF9kb25lID0gJ2RvbmUnLCBfbXV0YXRvck1hcCA9IHt9LCBfbXV0YXRvck1hcFtfZG9uZV0gPSBfbXV0YXRvck1hcFtfZG9uZV0gfHwge30sIF9tdXRhdG9yTWFwW19kb25lXS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuX2RlZmVycmVkRW5kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvci5fZGVmZXJyZWRFbmQucHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWYgPSAoMCwgX3V0aWxzLmRlZmVycmVkKSgpO1xuICAgICAgICBpdGVyYXRvci5fZGVmZXJyZWRFbmQgPSBkZWY7XG4gICAgICAgIGlmICghaXRlcmF0b3IuX2lzUnVubmluZykge1xuICAgICAgICAgIGl0ZXJhdG9yLl9lcnJvciA/IGRlZi5yZWplY3QoaXRlcmF0b3IuX2Vycm9yKSA6IGRlZi5yZXNvbHZlKGl0ZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9LCBfcmVmOS5jb250ID0gY29udCwgX3JlZjkuam9pbmVycyA9IFtdLCBfcmVmOS5jYW5jZWwgPSBjYW5jZWwsIF9yZWY5LmlzUnVubmluZyA9IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNSdW5uaW5nO1xuICAgIH0sIF9yZWY5LmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gaXNDYW5jZWxsZWQoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2lzQ2FuY2VsbGVkO1xuICAgIH0sIF9yZWY5LmlzQWJvcnRlZCA9IGZ1bmN0aW9uIGlzQWJvcnRlZCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5faXNBYm9ydGVkO1xuICAgIH0sIF9yZWY5LnJlc3VsdCA9IGZ1bmN0aW9uIHJlc3VsdCgpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvci5fcmVzdWx0O1xuICAgIH0sIF9yZWY5LmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IuX2Vycm9yO1xuICAgIH0sIF9yZWY5LnNldENvbnRleHQgPSBmdW5jdGlvbiBzZXRDb250ZXh0KHByb3BzKSB7XG4gICAgICAoMCwgX3V0aWxzLmNoZWNrKShwcm9wcywgX3V0aWxzLmlzLm9iamVjdCwgKDAsIF91dGlscy5jcmVhdGVTZXRDb250ZXh0V2FybmluZykoJ3Rhc2snLCBwcm9wcykpO1xuICAgICAgX3V0aWxzLm9iamVjdC5hc3NpZ24odGFza0NvbnRleHQsIHByb3BzKTtcbiAgICB9LCBfZGVmaW5lRW51bWVyYWJsZVByb3BlcnRpZXMoX3JlZjksIF9tdXRhdG9yTWFwKSwgX3JlZjk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvcHJvYy5qc1xuLy8gbW9kdWxlIGlkID0gNzQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hc2FwID0gYXNhcDtcbmV4cG9ydHMuc3VzcGVuZCA9IHN1c3BlbmQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG52YXIgcXVldWUgPSBbXTtcbi8qKlxuICBWYXJpYWJsZSB0byBob2xkIGEgY291bnRpbmcgc2VtYXBob3JlXG4gIC0gSW5jcmVtZW50aW5nIGFkZHMgYSBsb2NrIGFuZCBwdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZSAoaWYgaXQncyBub3RcbiAgICBhbHJlYWR5IHN1c3BlbmRlZClcbiAgLSBEZWNyZW1lbnRpbmcgcmVsZWFzZXMgYSBsb2NrLiBaZXJvIGxvY2tzIHB1dHMgdGhlIHNjaGVkdWxlciBpbiBhIGByZWxlYXNlZGAgc3RhdGUuIFRoaXNcbiAgICB0cmlnZ2VycyBmbHVzaGluZyB0aGUgcXVldWVkIHRhc2tzLlxuKiovXG52YXIgc2VtYXBob3JlID0gMDtcblxuLyoqXG4gIEV4ZWN1dGVzIGEgdGFzayAnYXRvbWljYWxseScuIFRhc2tzIHNjaGVkdWxlZCBkdXJpbmcgdGhpcyBleGVjdXRpb24gd2lsbCBiZSBxdWV1ZWRcbiAgYW5kIGZsdXNoZWQgYWZ0ZXIgdGhpcyB0YXNrIGhhcyBmaW5pc2hlZCAoYXNzdW1pbmcgdGhlIHNjaGVkdWxlciBlbmR1cCBpbiBhIHJlbGVhc2VkXG4gIHN0YXRlKS5cbioqL1xuZnVuY3Rpb24gZXhlYyh0YXNrKSB7XG4gIHRyeSB7XG4gICAgc3VzcGVuZCgpO1xuICAgIHRhc2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZWxlYXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gIEV4ZWN1dGVzIG9yIHF1ZXVlcyBhIHRhc2sgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiB0aGUgc2NoZWR1bGVyIChgc3VzcGVuZGVkYCBvciBgcmVsZWFzZWRgKVxuKiovXG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgcXVldWUucHVzaCh0YXNrKTtcblxuICBpZiAoIXNlbWFwaG9yZSkge1xuICAgIHN1c3BlbmQoKTtcbiAgICBmbHVzaCgpO1xuICB9XG59XG5cbi8qKlxuICBQdXRzIHRoZSBzY2hlZHVsZXIgaW4gYSBgc3VzcGVuZGVkYCBzdGF0ZS4gU2NoZWR1bGVkIHRhc2tzIHdpbGwgYmUgcXVldWVkIHVudGlsIHRoZVxuICBzY2hlZHVsZXIgaXMgcmVsZWFzZWQuXG4qKi9cbmZ1bmN0aW9uIHN1c3BlbmQoKSB7XG4gIHNlbWFwaG9yZSsrO1xufVxuXG4vKipcbiAgUHV0cyB0aGUgc2NoZWR1bGVyIGluIGEgYHJlbGVhc2VkYCBzdGF0ZS5cbioqL1xuZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgc2VtYXBob3JlLS07XG59XG5cbi8qKlxuICBSZWxlYXNlcyB0aGUgY3VycmVudCBsb2NrLiBFeGVjdXRlcyBhbGwgcXVldWVkIHRhc2tzIGlmIHRoZSBzY2hlZHVsZXIgaXMgaW4gdGhlIHJlbGVhc2VkIHN0YXRlLlxuKiovXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgcmVsZWFzZSgpO1xuXG4gIHZhciB0YXNrID0gdm9pZCAwO1xuICB3aGlsZSAoIXNlbWFwaG9yZSAmJiAodGFzayA9IHF1ZXVlLnNoaWZ0KCkpICE9PSB1bmRlZmluZWQpIHtcbiAgICBleGVjKHRhc2spO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NjaGVkdWxlci5qc1xuLy8gbW9kdWxlIGlkID0gNzQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuYXNFZmZlY3QgPSBleHBvcnRzLnRha2VtID0gZXhwb3J0cy5kZXRhY2ggPSB1bmRlZmluZWQ7XG5leHBvcnRzLnRha2UgPSB0YWtlO1xuZXhwb3J0cy5wdXQgPSBwdXQ7XG5leHBvcnRzLmFsbCA9IGFsbDtcbmV4cG9ydHMucmFjZSA9IHJhY2U7XG5leHBvcnRzLmNhbGwgPSBjYWxsO1xuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuZXhwb3J0cy5jcHMgPSBjcHM7XG5leHBvcnRzLmZvcmsgPSBmb3JrO1xuZXhwb3J0cy5zcGF3biA9IHNwYXduO1xuZXhwb3J0cy5qb2luID0gam9pbjtcbmV4cG9ydHMuY2FuY2VsID0gY2FuY2VsO1xuZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5leHBvcnRzLmFjdGlvbkNoYW5uZWwgPSBhY3Rpb25DaGFubmVsO1xuZXhwb3J0cy5jYW5jZWxsZWQgPSBjYW5jZWxsZWQ7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG5leHBvcnRzLmdldENvbnRleHQgPSBnZXRDb250ZXh0O1xuZXhwb3J0cy5zZXRDb250ZXh0ID0gc2V0Q29udGV4dDtcbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfc2FnYUhlbHBlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zYWdhSGVscGVycycpO1xuXG52YXIgSU8gPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5zeW0pKCdJTycpO1xudmFyIFRBS0UgPSAnVEFLRSc7XG52YXIgUFVUID0gJ1BVVCc7XG52YXIgQUxMID0gJ0FMTCc7XG52YXIgUkFDRSA9ICdSQUNFJztcbnZhciBDQUxMID0gJ0NBTEwnO1xudmFyIENQUyA9ICdDUFMnO1xudmFyIEZPUksgPSAnRk9SSyc7XG52YXIgSk9JTiA9ICdKT0lOJztcbnZhciBDQU5DRUwgPSAnQ0FOQ0VMJztcbnZhciBTRUxFQ1QgPSAnU0VMRUNUJztcbnZhciBBQ1RJT05fQ0hBTk5FTCA9ICdBQ1RJT05fQ0hBTk5FTCc7XG52YXIgQ0FOQ0VMTEVEID0gJ0NBTkNFTExFRCc7XG52YXIgRkxVU0ggPSAnRkxVU0gnO1xudmFyIEdFVF9DT05URVhUID0gJ0dFVF9DT05URVhUJztcbnZhciBTRVRfQ09OVEVYVCA9ICdTRVRfQ09OVEVYVCc7XG5cbnZhciBURVNUX0hJTlQgPSAnXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKSc7XG5cbnZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW0lPXSA9IHRydWUsIF9yZWZbdHlwZV0gPSBwYXlsb2FkLCBfcmVmO1xufTtcblxudmFyIGRldGFjaCA9IGV4cG9ydHMuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKGVmZikge1xuICAoMCwgX3V0aWxzLmNoZWNrKShhc0VmZmVjdC5mb3JrKGVmZiksIF91dGlscy5pcy5vYmplY3QsICdkZXRhY2goZWZmKTogYXJndW1lbnQgbXVzdCBiZSBhIGZvcmsgZWZmZWN0Jyk7XG4gIGVmZltGT1JLXS5kZXRhY2hlZCA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5mdW5jdGlvbiB0YWtlKCkge1xuICB2YXIgcGF0dGVybk9yQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyonO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYXJndW1lbnRzWzBdLCBfdXRpbHMuaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICB9XG4gIGlmIChfdXRpbHMuaXMucGF0dGVybihwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBwYXR0ZXJuOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBlZmZlY3QoVEFLRSwgeyBjaGFubmVsOiBwYXR0ZXJuT3JDaGFubmVsIH0pO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndGFrZShwYXR0ZXJuT3JDaGFubmVsKTogYXJndW1lbnQgJyArIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKSArICcgaXMgbm90IHZhbGlkIGNoYW5uZWwgb3IgYSB2YWxpZCBwYXR0ZXJuJyk7XG59XG5cbnRha2UubWF5YmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn07XG5cbnZhciB0YWtlbSA9IC8qI19fUFVSRV9fKi9leHBvcnRzLnRha2VtID0gKDAsIF91dGlscy5kZXByZWNhdGUpKHRha2UubWF5YmUsIC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLnVwZGF0ZUluY2VudGl2ZSkoJ3Rha2VtJywgJ3Rha2UubWF5YmUnKSk7XG5cbmZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50IGNoYW5uZWwgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCBhIHZhbGlkIGNoYW5uZWwnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKShhY3Rpb24sIF91dGlscy5pcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLm5vdFVuZGVmLCAncHV0KGFjdGlvbik6IGFyZ3VtZW50IGFjdGlvbiBpcyB1bmRlZmluZWQnKTtcbiAgICBhY3Rpb24gPSBjaGFubmVsO1xuICAgIGNoYW5uZWwgPSBudWxsO1xuICB9XG4gIHJldHVybiBlZmZlY3QoUFVULCB7IGNoYW5uZWw6IGNoYW5uZWwsIGFjdGlvbjogYWN0aW9uIH0pO1xufVxuXG5wdXQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVmZiA9IHB1dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIGVmZltQVVRdLnJlc29sdmUgPSB0cnVlO1xuICByZXR1cm4gZWZmO1xufTtcblxucHV0LnN5bmMgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKHB1dC5yZXNvbHZlLCAvKiNfX1BVUkVfXyovKDAsIF91dGlscy51cGRhdGVJbmNlbnRpdmUpKCdwdXQuc3luYycsICdwdXQucmVzb2x2ZScpKTtcblxuZnVuY3Rpb24gYWxsKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChBTEwsIGVmZmVjdHMpO1xufVxuXG5mdW5jdGlvbiByYWNlKGVmZmVjdHMpIHtcbiAgcmV0dXJuIGVmZmVjdChSQUNFLCBlZmZlY3RzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm5DYWxsRGVzYyhtZXRoLCBmbiwgYXJncykge1xuICAoMCwgX3V0aWxzLmNoZWNrKShmbiwgX3V0aWxzLmlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuICBpZiAoX3V0aWxzLmlzLmFycmF5KGZuKSkge1xuICAgIHZhciBfZm4gPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuWzBdO1xuICAgIGZuID0gX2ZuWzFdO1xuICB9IGVsc2UgaWYgKGZuLmZuKSB7XG4gICAgdmFyIF9mbjIgPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuMi5jb250ZXh0O1xuICAgIGZuID0gX2ZuMi5mbjtcbiAgfVxuICBpZiAoY29udGV4dCAmJiBfdXRpbHMuaXMuc3RyaW5nKGZuKSAmJiBfdXRpbHMuaXMuZnVuYyhjb250ZXh0W2ZuXSkpIHtcbiAgICBmbiA9IGNvbnRleHRbZm5dO1xuICB9XG4gICgwLCBfdXRpbHMuY2hlY2spKGZuLCBfdXRpbHMuaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblxuICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcbn1cblxuZnVuY3Rpb24gY2FsbChmbikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnY2FsbCcsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5KGNvbnRleHQsIGZuKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2FwcGx5JywgeyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4gfSwgYXJncykpO1xufVxuXG5mdW5jdGlvbiBjcHMoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gZm9yayhmbikge1xuICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBlZmZlY3QoRk9SSywgZ2V0Rm5DYWxsRGVzYygnZm9yaycsIGZuLCBhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHNwYXduKGZuKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGRldGFjaChmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW2ZuXS5jb25jYXQoYXJncykpKTtcbn1cblxuZnVuY3Rpb24gam9pbigpIHtcbiAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCB0YXNrcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgdGFza3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgfVxuXG4gIGlmICh0YXNrcy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIGFsbCh0YXNrcy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiBqb2luKHQpO1xuICAgIH0pKTtcbiAgfVxuICB2YXIgdGFzayA9IHRhc2tzWzBdO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMubm90VW5kZWYsICdqb2luKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2pvaW4odGFzayk6IGFyZ3VtZW50ICcgKyB0YXNrICsgJyBpcyBub3QgYSB2YWxpZCBUYXNrIG9iamVjdCAnICsgVEVTVF9ISU5UKTtcbiAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRhc2tzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICB0YXNrc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgaWYgKHRhc2tzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYWxsKHRhc2tzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIGNhbmNlbCh0KTtcbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRhc2sgPSB0YXNrc1swXTtcbiAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHRhc2ssIF91dGlscy5pcy5ub3RVbmRlZiwgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgdGFzayBpcyB1bmRlZmluZWQnKTtcbiAgICAoMCwgX3V0aWxzLmNoZWNrKSh0YXNrLCBfdXRpbHMuaXMudGFzaywgJ2NhbmNlbCh0YXNrKTogYXJndW1lbnQgJyArIHRhc2sgKyAnIGlzIG5vdCBhIHZhbGlkIFRhc2sgb2JqZWN0ICcgKyBURVNUX0hJTlQpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMLCB0YXNrIHx8IF91dGlscy5TRUxGX0NBTkNFTExBVElPTik7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNyA+IDEgPyBfbGVuNyAtIDEgOiAwKSwgX2tleTcgPSAxOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgYXJnc1tfa2V5NyAtIDFdID0gYXJndW1lbnRzW19rZXk3XTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgc2VsZWN0b3IgPSBfdXRpbHMuaWRlbnQ7XG4gIH0gZWxzZSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykoc2VsZWN0b3IsIF91dGlscy5pcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHNlbGVjdG9yLCBfdXRpbHMuaXMuZnVuYywgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50ICcgKyBzZWxlY3RvciArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KFNFTEVDVCwgeyBzZWxlY3Rvcjogc2VsZWN0b3IsIGFyZ3M6IGFyZ3MgfSk7XG59XG5cbi8qKlxuICBjaGFubmVsKHBhdHRlcm4sIFtidWZmZXJdKSAgICA9PiBjcmVhdGVzIGFuIGV2ZW50IGNoYW5uZWwgZm9yIHN0b3JlIGFjdGlvbnNcbioqL1xuZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocGF0dGVybiwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGJ1ZmZlciwgX3V0aWxzLmlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCBidWZmZXIgaXMgdW5kZWZpbmVkJyk7XG4gICAgKDAsIF91dGlscy5jaGVjaykoYnVmZmVyLCBfdXRpbHMuaXMuYnVmZmVyLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xufVxuXG5mdW5jdGlvbiBjYW5jZWxsZWQoKSB7XG4gIHJldHVybiBlZmZlY3QoQ0FOQ0VMTEVELCB7fSk7XG59XG5cbmZ1bmN0aW9uIGZsdXNoKGNoYW5uZWwpIHtcbiAgKDAsIF91dGlscy5jaGVjaykoY2hhbm5lbCwgX3V0aWxzLmlzLmNoYW5uZWwsICdmbHVzaChjaGFubmVsKTogYXJndW1lbnQgJyArIGNoYW5uZWwgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsJyk7XG4gIHJldHVybiBlZmZlY3QoRkxVU0gsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250ZXh0KHByb3ApIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcCwgX3V0aWxzLmlzLnN0cmluZywgJ2dldENvbnRleHQocHJvcCk6IGFyZ3VtZW50ICcgKyBwcm9wICsgJyBpcyBub3QgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIGVmZmVjdChHRVRfQ09OVEVYVCwgcHJvcCk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRleHQocHJvcHMpIHtcbiAgKDAsIF91dGlscy5jaGVjaykocHJvcHMsIF91dGlscy5pcy5vYmplY3QsICgwLCBfdXRpbHMuY3JlYXRlU2V0Q29udGV4dFdhcm5pbmcpKG51bGwsIHByb3BzKSk7XG4gIHJldHVybiBlZmZlY3QoU0VUX0NPTlRFWFQsIHByb3BzKTtcbn1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDIgPyBfbGVuOCAtIDIgOiAwKSwgX2tleTggPSAyOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgYXJnc1tfa2V5OCAtIDJdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgfVxuXG4gIHJldHVybiBmb3JrLmFwcGx5KHVuZGVmaW5lZCwgW19zYWdhSGVscGVycy50YWtlRXZlcnlIZWxwZXIsIHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcl0uY29uY2F0KGFyZ3MpKTtcbn1cblxuZnVuY3Rpb24gdGFrZUxhdGVzdChwYXR0ZXJuT3JDaGFubmVsLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjkgPiAyID8gX2xlbjkgLSAyIDogMCksIF9rZXk5ID0gMjsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuICAgIGFyZ3NbX2tleTkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5OV07XG4gIH1cblxuICByZXR1cm4gZm9yay5hcHBseSh1bmRlZmluZWQsIFtfc2FnYUhlbHBlcnMudGFrZUxhdGVzdEhlbHBlciwgcGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShtcywgcGF0dGVybiwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTAgPiAzID8gX2xlbjEwIC0gMyA6IDApLCBfa2V5MTAgPSAzOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgYXJnc1tfa2V5MTAgLSAzXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuICB9XG5cbiAgcmV0dXJuIGZvcmsuYXBwbHkodW5kZWZpbmVkLCBbX3NhZ2FIZWxwZXJzLnRocm90dGxlSGVscGVyLCBtcywgcGF0dGVybiwgd29ya2VyXS5jb25jYXQoYXJncykpO1xufVxuXG52YXIgY3JlYXRlQXNFZmZlY3RUeXBlID0gZnVuY3Rpb24gY3JlYXRlQXNFZmZlY3RUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W3R5cGVdO1xuICB9O1xufTtcblxudmFyIGFzRWZmZWN0ID0gZXhwb3J0cy5hc0VmZmVjdCA9IHtcbiAgdGFrZTogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShUQUtFKSxcbiAgcHV0OiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFBVVCksXG4gIGFsbDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShBTEwpLFxuICByYWNlOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKFJBQ0UpLFxuICBjYWxsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTEwpLFxuICBjcHM6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoQ1BTKSxcbiAgZm9yazogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShGT1JLKSxcbiAgam9pbjogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShKT0lOKSxcbiAgY2FuY2VsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTCksXG4gIHNlbGVjdDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShTRUxFQ1QpLFxuICBhY3Rpb25DaGFubmVsOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEFDVElPTl9DSEFOTkVMKSxcbiAgY2FuY2VsbGVkOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKENBTkNFTExFRCksXG4gIGZsdXNoOiAvKiNfX1BVUkVfXyovY3JlYXRlQXNFZmZlY3RUeXBlKEZMVVNIKSxcbiAgZ2V0Q29udGV4dDogLyojX19QVVJFX18qL2NyZWF0ZUFzRWZmZWN0VHlwZShHRVRfQ09OVEVYVCksXG4gIHNldENvbnRleHQ6IC8qI19fUFVSRV9fKi9jcmVhdGVBc0VmZmVjdFR5cGUoU0VUX0NPTlRFWFQpXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9pby5qc1xuLy8gbW9kdWxlIGlkID0gNzQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMudGhyb3R0bGVIZWxwZXIgPSBleHBvcnRzLnRha2VMYXRlc3RIZWxwZXIgPSBleHBvcnRzLnRha2VFdmVyeUhlbHBlciA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLnRha2VMYXRlc3QgPSBleHBvcnRzLnRha2VFdmVyeSA9IHVuZGVmaW5lZDtcblxudmFyIF90YWtlRXZlcnkgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi90YWtlRXZlcnknKTtcblxudmFyIF90YWtlRXZlcnkyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rha2VFdmVyeSk7XG5cbnZhciBfdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rha2VMYXRlc3QnKTtcblxudmFyIF90YWtlTGF0ZXN0MiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWtlTGF0ZXN0KTtcblxudmFyIF90aHJvdHRsZSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gZGVwcmVjYXRpb25XYXJuaW5nKGhlbHBlck5hbWUpIHtcbiAgcmV0dXJuICdpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2FcXCcgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBpbXBvcnQgeyAnICsgaGVscGVyTmFtZSArICcgfSBmcm9tIFxcJ3JlZHV4LXNhZ2EvZWZmZWN0c1xcJy5cXG5UaGUgbGF0dGVyIHdpbGwgbm90IHdvcmsgd2l0aCB5aWVsZCosIGFzIGhlbHBlciBlZmZlY3RzIGFyZSB3cmFwcGVkIGF1dG9tYXRpY2FsbHkgZm9yIHlvdSBpbiBmb3JrIGVmZmVjdC5cXG5UaGVyZWZvcmUgeWllbGQgJyArIGhlbHBlck5hbWUgKyAnIHdpbGwgcmV0dXJuIHRhc2sgZGVzY3JpcHRvciB0byB5b3VyIHNhZ2EgYW5kIGV4ZWN1dGUgbmV4dCBsaW5lcyBvZiBjb2RlLic7XG59O1xuXG52YXIgdGFrZUV2ZXJ5ID0gLyojX19QVVJFX18qLygwLCBfdXRpbHMuZGVwcmVjYXRlKShfdGFrZUV2ZXJ5Mi5kZWZhdWx0LCAvKiNfX1BVUkVfXyovZGVwcmVjYXRpb25XYXJuaW5nKCd0YWtlRXZlcnknKSk7XG52YXIgdGFrZUxhdGVzdCA9IC8qI19fUFVSRV9fKi8oMCwgX3V0aWxzLmRlcHJlY2F0ZSkoX3Rha2VMYXRlc3QyLmRlZmF1bHQsIC8qI19fUFVSRV9fKi9kZXByZWNhdGlvbldhcm5pbmcoJ3Rha2VMYXRlc3QnKSk7XG52YXIgdGhyb3R0bGUgPSAvKiNfX1BVUkVfXyovKDAsIF91dGlscy5kZXByZWNhdGUpKF90aHJvdHRsZTIuZGVmYXVsdCwgLyojX19QVVJFX18qL2RlcHJlY2F0aW9uV2FybmluZygndGhyb3R0bGUnKSk7XG5cbmV4cG9ydHMudGFrZUV2ZXJ5ID0gdGFrZUV2ZXJ5O1xuZXhwb3J0cy50YWtlTGF0ZXN0ID0gdGFrZUxhdGVzdDtcbmV4cG9ydHMudGhyb3R0bGUgPSB0aHJvdHRsZTtcbmV4cG9ydHMudGFrZUV2ZXJ5SGVscGVyID0gX3Rha2VFdmVyeTIuZGVmYXVsdDtcbmV4cG9ydHMudGFrZUxhdGVzdEhlbHBlciA9IF90YWtlTGF0ZXN0Mi5kZWZhdWx0O1xuZXhwb3J0cy50aHJvdHRsZUhlbHBlciA9IF90aHJvdHRsZTIuZGVmYXVsdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDc0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlRXZlcnk7XG5cbnZhciBfZnNtSXRlcmF0b3IgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9mc21JdGVyYXRvcicpO1xuXG52YXIgX2ZzbUl0ZXJhdG9yMiA9IC8qI19fUFVSRV9fKi9faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mc21JdGVyYXRvcik7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vaW8nKTtcblxudmFyIF9jaGFubmVsID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2NoYW5uZWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdGFrZUV2ZXJ5KHBhdHRlcm5PckNoYW5uZWwsIHdvcmtlcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB5VGFrZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiAoMCwgX2lvLnRha2UpKHBhdHRlcm5PckNoYW5uZWwpIH07XG4gIHZhciB5Rm9yayA9IGZ1bmN0aW9uIHlGb3JrKGFjKSB7XG4gICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBfaW8uZm9yay5hcHBseSh1bmRlZmluZWQsIFt3b3JrZXJdLmNvbmNhdChhcmdzLCBbYWNdKSkgfTtcbiAgfTtcblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3ExJywgeUZvcmsoYWN0aW9uKV07XG4gICAgfVxuICB9LCAncTEnLCAndGFrZUV2ZXJ5KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VFdmVyeS5qc1xuLy8gbW9kdWxlIGlkID0gNzQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMucUVuZCA9IHVuZGVmaW5lZDtcbmV4cG9ydHMuc2FmZU5hbWUgPSBzYWZlTmFtZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZzbUl0ZXJhdG9yO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciBkb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG52YXIgcUVuZCA9IGV4cG9ydHMucUVuZCA9IHt9O1xuXG5mdW5jdGlvbiBzYWZlTmFtZShwYXR0ZXJuT3JDaGFubmVsKSB7XG4gIGlmIChfdXRpbHMuaXMuY2hhbm5lbChwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiAnY2hhbm5lbCc7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuT3JDaGFubmVsKSkge1xuICAgIHJldHVybiBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGVudHJ5KTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFN0cmluZyhwYXR0ZXJuT3JDaGFubmVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmc21JdGVyYXRvcihmc20sIHEwKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnaXRlcmF0b3InO1xuXG4gIHZhciB1cGRhdGVTdGF0ZSA9IHZvaWQgMCxcbiAgICAgIHFOZXh0ID0gcTA7XG5cbiAgZnVuY3Rpb24gbmV4dChhcmcsIGVycm9yKSB7XG4gICAgaWYgKHFOZXh0ID09PSBxRW5kKSB7XG4gICAgICByZXR1cm4gZG9uZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHFOZXh0ID0gcUVuZDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVTdGF0ZSAmJiB1cGRhdGVTdGF0ZShhcmcpO1xuXG4gICAgICB2YXIgX2ZzbSRxTmV4dCA9IGZzbVtxTmV4dF0oKSxcbiAgICAgICAgICBxID0gX2ZzbSRxTmV4dFswXSxcbiAgICAgICAgICBvdXRwdXQgPSBfZnNtJHFOZXh0WzFdLFxuICAgICAgICAgIF91cGRhdGVTdGF0ZSA9IF9mc20kcU5leHRbMl07XG5cbiAgICAgIHFOZXh0ID0gcTtcbiAgICAgIHVwZGF0ZVN0YXRlID0gX3VwZGF0ZVN0YXRlO1xuICAgICAgcmV0dXJuIHFOZXh0ID09PSBxRW5kID8gZG9uZSA6IG91dHB1dDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKDAsIF91dGlscy5tYWtlSXRlcmF0b3IpKG5leHQsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBuZXh0KG51bGwsIGVycm9yKTtcbiAgfSwgbmFtZSwgdHJ1ZSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL2ZzbUl0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5VTkRFRklORURfSU5QVVRfRVJST1IgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gZXhwb3J0cy5pc0VuZCA9IGV4cG9ydHMuRU5EID0gdW5kZWZpbmVkO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuZXhwb3J0cy5jaGFubmVsID0gY2hhbm5lbDtcbmV4cG9ydHMuZXZlbnRDaGFubmVsID0gZXZlbnRDaGFubmVsO1xuZXhwb3J0cy5zdGRDaGFubmVsID0gc3RkQ2hhbm5lbDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfYnVmZmVycyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2J1ZmZlcnMnKTtcblxudmFyIF9zY2hlZHVsZXIgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIENIQU5ORUxfRU5EX1RZUEUgPSAnQEByZWR1eC1zYWdhL0NIQU5ORUxfRU5EJztcbnZhciBFTkQgPSBleHBvcnRzLkVORCA9IHsgdHlwZTogQ0hBTk5FTF9FTkRfVFlQRSB9O1xudmFyIGlzRW5kID0gZXhwb3J0cy5pc0VuZCA9IGZ1bmN0aW9uIGlzRW5kKGEpIHtcbiAgcmV0dXJuIGEgJiYgYS50eXBlID09PSBDSEFOTkVMX0VORF9UWVBFO1xufTtcblxuZnVuY3Rpb24gZW1pdHRlcigpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gW107XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKHN1Yikge1xuICAgIHN1YnNjcmliZXJzLnB1c2goc3ViKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKShzdWJzY3JpYmVycywgc3ViKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChpdGVtKSB7XG4gICAgdmFyIGFyciA9IHN1YnNjcmliZXJzLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJyW2ldKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgZW1pdDogZW1pdFxuICB9O1xufVxuXG52YXIgSU5WQUxJRF9CVUZGRVIgPSBleHBvcnRzLklOVkFMSURfQlVGRkVSID0gJ2ludmFsaWQgYnVmZmVyIHBhc3NlZCB0byBjaGFubmVsIGZhY3RvcnkgZnVuY3Rpb24nO1xudmFyIFVOREVGSU5FRF9JTlBVVF9FUlJPUiA9IGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gJ1NhZ2Egd2FzIHByb3ZpZGVkIHdpdGggYW4gdW5kZWZpbmVkIGFjdGlvbic7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGV4cG9ydHMuVU5ERUZJTkVEX0lOUFVUX0VSUk9SID0gVU5ERUZJTkVEX0lOUFVUX0VSUk9SICs9ICdcXG5IaW50czpcXG4gICAgLSBjaGVjayB0aGF0IHlvdXIgQWN0aW9uIENyZWF0b3IgcmV0dXJucyBhIG5vbi11bmRlZmluZWQgdmFsdWVcXG4gICAgLSBpZiB0aGUgU2FnYSB3YXMgc3RhcnRlZCB1c2luZyBydW5TYWdhLCBjaGVjayB0aGF0IHlvdXIgc3Vic2NyaWJlIHNvdXJjZSBwcm92aWRlcyB0aGUgYWN0aW9uIHRvIGl0cyBsaXN0ZW5lcnNcXG4gICc7XG59XG5cbmZ1bmN0aW9uIGNoYW5uZWwoKSB7XG4gIHZhciBidWZmZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9idWZmZXJzLmJ1ZmZlcnMuZml4ZWQoKTtcblxuICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gIHZhciB0YWtlcnMgPSBbXTtcblxuICAoMCwgX3V0aWxzLmNoZWNrKShidWZmZXIsIF91dGlscy5pcy5idWZmZXIsIElOVkFMSURfQlVGRkVSKTtcblxuICBmdW5jdGlvbiBjaGVja0ZvcmJpZGRlblN0YXRlcygpIHtcbiAgICBpZiAoY2xvc2VkICYmIHRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBhIGNsb3NlZCBjaGFubmVsIHdpdGggcGVuZGluZyB0YWtlcnMnKTtcbiAgICB9XG4gICAgaWYgKHRha2Vycy5sZW5ndGggJiYgIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93ICgwLCBfdXRpbHMuaW50ZXJuYWxFcnIpKCdDYW5ub3QgaGF2ZSBwZW5kaW5nIHRha2VycyB3aXRoIG5vbiBlbXB0eSBidWZmZXInKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdXQoaW5wdXQpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGlucHV0LCBfdXRpbHMuaXMubm90VW5kZWYsIFVOREVGSU5FRF9JTlBVVF9FUlJPUik7XG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRha2Vycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBidWZmZXIucHV0KGlucHV0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjYiA9IHRha2Vyc1tpXTtcbiAgICAgIGlmICghY2JbX3V0aWxzLk1BVENIXSB8fCBjYltfdXRpbHMuTUFUQ0hdKGlucHV0KSkge1xuICAgICAgICB0YWtlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm4gY2IoaW5wdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRha2UoY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLnRha2UncyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cbiAgICBpZiAoY2xvc2VkICYmIGJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICAgIGNiKEVORCk7XG4gICAgfSBlbHNlIGlmICghYnVmZmVyLmlzRW1wdHkoKSkge1xuICAgICAgY2IoYnVmZmVyLnRha2UoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRha2Vycy5wdXNoKGNiKTtcbiAgICAgIGNiLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbHMucmVtb3ZlKSh0YWtlcnMsIGNiKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goY2IpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpOyAvLyBUT0RPOiBjaGVjayBpZiBzb21lIG5ldyBzdGF0ZSBzaG91bGQgYmUgZm9yYmlkZGVuIG5vd1xuICAgICgwLCBfdXRpbHMuY2hlY2spKGNiLCBfdXRpbHMuaXMuZnVuYywgXCJjaGFubmVsLmZsdXNoJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgaWYgKGNsb3NlZCAmJiBidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgICBjYihFTkQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYihidWZmZXIuZmx1c2goKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBjaGVja0ZvcmJpZGRlblN0YXRlcygpO1xuICAgIGlmICghY2xvc2VkKSB7XG4gICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgaWYgKHRha2Vycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IHRha2VycztcbiAgICAgICAgdGFrZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBhcnJbaV0oRU5EKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFrZTogdGFrZSxcbiAgICBwdXQ6IHB1dCxcbiAgICBmbHVzaDogZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGdldCBfX3Rha2Vyc19fKCkge1xuICAgICAgcmV0dXJuIHRha2VycztcbiAgICB9LFxuICAgIGdldCBfX2Nsb3NlZF9fKCkge1xuICAgICAgcmV0dXJuIGNsb3NlZDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV2ZW50Q2hhbm5lbChzdWJzY3JpYmUpIHtcbiAgdmFyIGJ1ZmZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX2J1ZmZlcnMuYnVmZmVycy5ub25lKCk7XG4gIHZhciBtYXRjaGVyID0gYXJndW1lbnRzWzJdO1xuXG4gIC8qKlxuICAgIHNob3VsZCBiZSBpZih0eXBlb2YgbWF0Y2hlciAhPT0gdW5kZWZpbmVkKSBpbnN0ZWFkP1xuICAgIHNlZSBQUiAjMjczIGZvciBhIGJhY2tncm91bmQgZGlzY3Vzc2lvblxuICAqKi9cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsICdJbnZhbGlkIG1hdGNoIGZ1bmN0aW9uIHBhc3NlZCB0byBldmVudENoYW5uZWwnKTtcbiAgfVxuXG4gIHZhciBjaGFuID0gY2hhbm5lbChidWZmZXIpO1xuICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBpZiAoIWNoYW4uX19jbG9zZWRfXykge1xuICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBjaGFuLmNsb3NlKCk7XG4gICAgfVxuICB9O1xuICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlzRW5kKGlucHV0KSkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXIgJiYgIW1hdGNoZXIoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW4ucHV0KGlucHV0KTtcbiAgfSk7XG4gIGlmIChjaGFuLl9fY2xvc2VkX18pIHtcbiAgICB1bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgaWYgKCFfdXRpbHMuaXMuZnVuYyh1bnN1YnNjcmliZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luIGV2ZW50Q2hhbm5lbDogc3Vic2NyaWJlIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0byB1bnN1YnNjcmliZScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWtlOiBjaGFuLnRha2UsXG4gICAgZmx1c2g6IGNoYW4uZmx1c2gsXG4gICAgY2xvc2U6IGNsb3NlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0ZENoYW5uZWwoc3Vic2NyaWJlKSB7XG4gIHZhciBjaGFuID0gZXZlbnRDaGFubmVsKGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiBzdWJzY3JpYmUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoaW5wdXRbX3V0aWxzLlNBR0FfQUNUSU9OXSkge1xuICAgICAgICBjYihpbnB1dCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICgwLCBfc2NoZWR1bGVyLmFzYXApKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNiKGlucHV0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gX2V4dGVuZHMoe30sIGNoYW4sIHtcbiAgICB0YWtlOiBmdW5jdGlvbiB0YWtlKGNiLCBtYXRjaGVyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgKDAsIF91dGlscy5jaGVjaykobWF0Y2hlciwgX3V0aWxzLmlzLmZ1bmMsIFwiY2hhbm5lbC50YWtlJ3MgbWF0Y2hlciBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGNiW191dGlscy5NQVRDSF0gPSBtYXRjaGVyO1xuICAgICAgfVxuICAgICAgY2hhbi50YWtlKGNiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi9pbnRlcm5hbC9jaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA3NDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmJ1ZmZlcnMgPSBleHBvcnRzLkJVRkZFUl9PVkVSRkxPVyA9IHVuZGVmaW5lZDtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKFwiLi91dGlsc1wiKTtcblxudmFyIEJVRkZFUl9PVkVSRkxPVyA9IGV4cG9ydHMuQlVGRkVSX09WRVJGTE9XID0gXCJDaGFubmVsJ3MgQnVmZmVyIG92ZXJmbG93IVwiO1xuXG52YXIgT05fT1ZFUkZMT1dfVEhST1cgPSAxO1xudmFyIE9OX09WRVJGTE9XX0RST1AgPSAyO1xudmFyIE9OX09WRVJGTE9XX1NMSURFID0gMztcbnZhciBPTl9PVkVSRkxPV19FWFBBTkQgPSA0O1xuXG52YXIgemVyb0J1ZmZlciA9IHsgaXNFbXB0eTogX3V0aWxzLmtUcnVlLCBwdXQ6IF91dGlscy5ub29wLCB0YWtlOiBfdXRpbHMubm9vcCB9O1xuXG5mdW5jdGlvbiByaW5nQnVmZmVyKCkge1xuICB2YXIgbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEwO1xuICB2YXIgb3ZlcmZsb3dBY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgdmFyIGFyciA9IG5ldyBBcnJheShsaW1pdCk7XG4gIHZhciBsZW5ndGggPSAwO1xuICB2YXIgcHVzaEluZGV4ID0gMDtcbiAgdmFyIHBvcEluZGV4ID0gMDtcblxuICB2YXIgcHVzaCA9IGZ1bmN0aW9uIHB1c2goaXQpIHtcbiAgICBhcnJbcHVzaEluZGV4XSA9IGl0O1xuICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgIGxlbmd0aCsrO1xuICB9O1xuXG4gIHZhciB0YWtlID0gZnVuY3Rpb24gdGFrZSgpIHtcbiAgICBpZiAobGVuZ3RoICE9IDApIHtcbiAgICAgIHZhciBpdCA9IGFycltwb3BJbmRleF07XG4gICAgICBhcnJbcG9wSW5kZXhdID0gbnVsbDtcbiAgICAgIGxlbmd0aC0tO1xuICAgICAgcG9wSW5kZXggPSAocG9wSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpdGVtcy5wdXNoKHRha2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtcztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoID09IDA7XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uIHB1dChpdCkge1xuICAgICAgaWYgKGxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgIHB1c2goaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRvdWJsZWRMaW1pdCA9IHZvaWQgMDtcbiAgICAgICAgc3dpdGNoIChvdmVyZmxvd0FjdGlvbikge1xuICAgICAgICAgIGNhc2UgT05fT1ZFUkZMT1dfVEhST1c6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQlVGRkVSX09WRVJGTE9XKTtcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX1NMSURFOlxuICAgICAgICAgICAgYXJyW3B1c2hJbmRleF0gPSBpdDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IChwdXNoSW5kZXggKyAxKSAlIGxpbWl0O1xuICAgICAgICAgICAgcG9wSW5kZXggPSBwdXNoSW5kZXg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9OX09WRVJGTE9XX0VYUEFORDpcbiAgICAgICAgICAgIGRvdWJsZWRMaW1pdCA9IDIgKiBsaW1pdDtcblxuICAgICAgICAgICAgYXJyID0gZmx1c2goKTtcblxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHB1c2hJbmRleCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICBwb3BJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGFyci5sZW5ndGggPSBkb3VibGVkTGltaXQ7XG4gICAgICAgICAgICBsaW1pdCA9IGRvdWJsZWRMaW1pdDtcblxuICAgICAgICAgICAgcHVzaChpdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIERST1BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGFrZTogdGFrZSxcbiAgICBmbHVzaDogZmx1c2hcbiAgfTtcbn1cblxudmFyIGJ1ZmZlcnMgPSBleHBvcnRzLmJ1ZmZlcnMgPSB7XG4gIG5vbmU6IGZ1bmN0aW9uIG5vbmUoKSB7XG4gICAgcmV0dXJuIHplcm9CdWZmZXI7XG4gIH0sXG4gIGZpeGVkOiBmdW5jdGlvbiBmaXhlZChsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19USFJPVyk7XG4gIH0sXG4gIGRyb3BwaW5nOiBmdW5jdGlvbiBkcm9wcGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19EUk9QKTtcbiAgfSxcbiAgc2xpZGluZzogZnVuY3Rpb24gc2xpZGluZyhsaW1pdCkge1xuICAgIHJldHVybiByaW5nQnVmZmVyKGxpbWl0LCBPTl9PVkVSRkxPV19TTElERSk7XG4gIH0sXG4gIGV4cGFuZGluZzogZnVuY3Rpb24gZXhwYW5kaW5nKGluaXRpYWxTaXplKSB7XG4gICAgcmV0dXJuIHJpbmdCdWZmZXIoaW5pdGlhbFNpemUsIE9OX09WRVJGTE9XX0VYUEFORCk7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL2J1ZmZlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0YWtlTGF0ZXN0O1xuXG52YXIgX2ZzbUl0ZXJhdG9yID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vZnNtSXRlcmF0b3InKTtcblxudmFyIF9mc21JdGVyYXRvcjIgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnNtSXRlcmF0b3IpO1xuXG52YXIgX2lvID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL2lvJyk7XG5cbnZhciBfY2hhbm5lbCA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9jaGFubmVsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRha2VMYXRlc3QocGF0dGVybk9yQ2hhbm5lbCwgd29ya2VyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHlUYWtlID0geyBkb25lOiBmYWxzZSwgdmFsdWU6ICgwLCBfaW8udGFrZSkocGF0dGVybk9yQ2hhbm5lbCkgfTtcbiAgdmFyIHlGb3JrID0gZnVuY3Rpb24geUZvcmsoYWMpIHtcbiAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IF9pby5mb3JrLmFwcGx5KHVuZGVmaW5lZCwgW3dvcmtlcl0uY29uY2F0KGFyZ3MsIFthY10pKSB9O1xuICB9O1xuICB2YXIgeUNhbmNlbCA9IGZ1bmN0aW9uIHlDYW5jZWwodGFzaykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYW5jZWwpKHRhc2spIH07XG4gIH07XG5cbiAgdmFyIHRhc2sgPSB2b2lkIDAsXG4gICAgICBhY3Rpb24gPSB2b2lkIDA7XG4gIHZhciBzZXRUYXNrID0gZnVuY3Rpb24gc2V0VGFzayh0KSB7XG4gICAgcmV0dXJuIHRhc2sgPSB0O1xuICB9O1xuICB2YXIgc2V0QWN0aW9uID0gZnVuY3Rpb24gc2V0QWN0aW9uKGFjKSB7XG4gICAgcmV0dXJuIGFjdGlvbiA9IGFjO1xuICB9O1xuXG4gIHJldHVybiAoMCwgX2ZzbUl0ZXJhdG9yMi5kZWZhdWx0KSh7XG4gICAgcTE6IGZ1bmN0aW9uIHExKCkge1xuICAgICAgcmV0dXJuIFsncTInLCB5VGFrZSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiB0YXNrID8gWydxMycsIHlDYW5jZWwodGFzayldIDogWydxMScsIHlGb3JrKGFjdGlvbiksIHNldFRhc2tdO1xuICAgIH0sXG4gICAgcTM6IGZ1bmN0aW9uIHEzKCkge1xuICAgICAgcmV0dXJuIFsncTEnLCB5Rm9yayhhY3Rpb24pLCBzZXRUYXNrXTtcbiAgICB9XG4gIH0sICdxMScsICd0YWtlTGF0ZXN0KCcgKyAoMCwgX2ZzbUl0ZXJhdG9yLnNhZmVOYW1lKShwYXR0ZXJuT3JDaGFubmVsKSArICcsICcgKyB3b3JrZXIubmFtZSArICcpJyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL3NhZ2FIZWxwZXJzL3Rha2VMYXRlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDc0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcblxudmFyIF9mc21JdGVyYXRvciA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ZzbUl0ZXJhdG9yJyk7XG5cbnZhciBfZnNtSXRlcmF0b3IyID0gLyojX19QVVJFX18qL19pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzbUl0ZXJhdG9yKTtcblxudmFyIF9pbyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuLi9pbycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vY2hhbm5lbCcpO1xuXG52YXIgX2J1ZmZlcnMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi4vYnVmZmVycycpO1xuXG52YXIgX3V0aWxzID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHRocm90dGxlKGRlbGF5TGVuZ3RoLCBwYXR0ZXJuLCB3b3JrZXIpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMyA/IF9sZW4gLSAzIDogMCksIF9rZXkgPSAzOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gM10gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgYWN0aW9uID0gdm9pZCAwLFxuICAgICAgY2hhbm5lbCA9IHZvaWQgMDtcblxuICB2YXIgeUFjdGlvbkNoYW5uZWwgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5hY3Rpb25DaGFubmVsKShwYXR0ZXJuLCBfYnVmZmVycy5idWZmZXJzLnNsaWRpbmcoMSkpIH07XG4gIHZhciB5VGFrZSA9IGZ1bmN0aW9uIHlUYWtlKCkge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby50YWtlKShjaGFubmVsKSB9O1xuICB9O1xuICB2YXIgeUZvcmsgPSBmdW5jdGlvbiB5Rm9yayhhYykge1xuICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogX2lvLmZvcmsuYXBwbHkodW5kZWZpbmVkLCBbd29ya2VyXS5jb25jYXQoYXJncywgW2FjXSkpIH07XG4gIH07XG4gIHZhciB5RGVsYXkgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogKDAsIF9pby5jYWxsKShfdXRpbHMuZGVsYXksIGRlbGF5TGVuZ3RoKSB9O1xuXG4gIHZhciBzZXRBY3Rpb24gPSBmdW5jdGlvbiBzZXRBY3Rpb24oYWMpIHtcbiAgICByZXR1cm4gYWN0aW9uID0gYWM7XG4gIH07XG4gIHZhciBzZXRDaGFubmVsID0gZnVuY3Rpb24gc2V0Q2hhbm5lbChjaCkge1xuICAgIHJldHVybiBjaGFubmVsID0gY2g7XG4gIH07XG5cbiAgcmV0dXJuICgwLCBfZnNtSXRlcmF0b3IyLmRlZmF1bHQpKHtcbiAgICBxMTogZnVuY3Rpb24gcTEoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlBY3Rpb25DaGFubmVsLCBzZXRDaGFubmVsXTtcbiAgICB9LFxuICAgIHEyOiBmdW5jdGlvbiBxMigpIHtcbiAgICAgIHJldHVybiBbJ3EzJywgeVRha2UoKSwgc2V0QWN0aW9uXTtcbiAgICB9LFxuICAgIHEzOiBmdW5jdGlvbiBxMygpIHtcbiAgICAgIHJldHVybiBhY3Rpb24gPT09IF9jaGFubmVsLkVORCA/IFtfZnNtSXRlcmF0b3IucUVuZF0gOiBbJ3E0JywgeUZvcmsoYWN0aW9uKV07XG4gICAgfSxcbiAgICBxNDogZnVuY3Rpb24gcTQoKSB7XG4gICAgICByZXR1cm4gWydxMicsIHlEZWxheV07XG4gICAgfVxuICB9LCAncTEnLCAndGhyb3R0bGUoJyArICgwLCBfZnNtSXRlcmF0b3Iuc2FmZU5hbWUpKHBhdHRlcm4pICsgJywgJyArIHdvcmtlci5uYW1lICsgJyknKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvaW50ZXJuYWwvc2FnYUhlbHBlcnMvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBzYWdhTWlkZGxld2FyZUZhY3Rvcnk7XG5cbnZhciBfdXRpbHMgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgX2NoYW5uZWwgPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfcnVuU2FnYSA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL3J1blNhZ2EnKTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBzYWdhTWlkZGxld2FyZUZhY3RvcnkoKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgX3JlZiRjb250ZXh0ID0gX3JlZi5jb250ZXh0LFxuICAgICAgY29udGV4dCA9IF9yZWYkY29udGV4dCA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGNvbnRleHQsXG4gICAgICBvcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY29udGV4dCddKTtcblxuICB2YXIgc2FnYU1vbml0b3IgPSBvcHRpb25zLnNhZ2FNb25pdG9yLFxuICAgICAgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIsXG4gICAgICBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG5cbiAgaWYgKF91dGlscy5pcy5mdW5jKG9wdGlvbnMpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2FnYSBtaWRkbGV3YXJlIG5vIGxvbmdlciBhY2NlcHQgR2VuZXJhdG9yIGZ1bmN0aW9ucy4gVXNlIHNhZ2FNaWRkbGV3YXJlLnJ1biBpbnN0ZWFkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBhIGZ1bmN0aW9uIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUuIFlvdSBhcmUgbGlrZWx5IHRyeWluZyB0byBzdGFydCBhICAgICAgICBTYWdhIGJ5IGRpcmVjdGx5IHBhc3NpbmcgaXQgdG8gdGhlIG1pZGRsZXdhcmUuIFRoaXMgaXMgbm8gbG9uZ2VyIHBvc3NpYmxlIHN0YXJ0aW5nIGZyb20gMC4xMC4wLiAgICAgICAgVG8gcnVuIGEgU2FnYSwgeW91IG11c3QgZG8gaXQgZHluYW1pY2FsbHkgQUZURVIgbW91bnRpbmcgdGhlIG1pZGRsZXdhcmUgaW50byB0aGUgc3RvcmUuXFxuICAgICAgICBFeGFtcGxlOlxcbiAgICAgICAgICBpbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcXCdyZWR1eC1zYWdhXFwnXFxuICAgICAgICAgIC4uLiBvdGhlciBpbXBvcnRzXFxuXFxuICAgICAgICAgIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKVxcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZShzYWdhTWlkZGxld2FyZSkpXFxuICAgICAgICAgIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhLCAuLi5hcmdzKVxcbiAgICAgICcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsb2dnZXIgJiYgIV91dGlscy5pcy5mdW5jKGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLmxvZ2dlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgb3B0aW9ucy5vbmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgb3B0aW9ucy5vbmVycm9yYCB3YXMgcmVtb3ZlZC4gVXNlIGBvcHRpb25zLm9uRXJyb3JgIGluc3RlYWQuJyk7XG4gIH1cblxuICBpZiAob25FcnJvciAmJiAhX3V0aWxzLmlzLmZ1bmMob25FcnJvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BvcHRpb25zLm9uRXJyb3JgIHBhc3NlZCB0byB0aGUgU2FnYSBtaWRkbGV3YXJlIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZW1pdHRlciAmJiAhX3V0aWxzLmlzLmZ1bmMob3B0aW9ucy5lbWl0dGVyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYG9wdGlvbnMuZW1pdHRlcmAgcGFzc2VkIHRvIHRoZSBTYWdhIG1pZGRsZXdhcmUgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzYWdhTWlkZGxld2FyZShfcmVmMikge1xuICAgIHZhciBnZXRTdGF0ZSA9IF9yZWYyLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaCA9IF9yZWYyLmRpc3BhdGNoO1xuXG4gICAgdmFyIHNhZ2FFbWl0dGVyID0gKDAsIF9jaGFubmVsLmVtaXR0ZXIpKCk7XG4gICAgc2FnYUVtaXR0ZXIuZW1pdCA9IChvcHRpb25zLmVtaXR0ZXIgfHwgX3V0aWxzLmlkZW50KShzYWdhRW1pdHRlci5lbWl0KTtcblxuICAgIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IF9ydW5TYWdhLnJ1blNhZ2EuYmluZChudWxsLCB7XG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgc3Vic2NyaWJlOiBzYWdhRW1pdHRlci5zdWJzY3JpYmUsXG4gICAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgICBzYWdhTW9uaXRvcjogc2FnYU1vbml0b3IsXG4gICAgICBsb2dnZXI6IGxvZ2dlcixcbiAgICAgIG9uRXJyb3I6IG9uRXJyb3JcbiAgICB9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgaWYgKHNhZ2FNb25pdG9yICYmIHNhZ2FNb25pdG9yLmFjdGlvbkRpc3BhdGNoZWQpIHtcbiAgICAgICAgICBzYWdhTW9uaXRvci5hY3Rpb25EaXNwYXRjaGVkKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IG5leHQoYWN0aW9uKTsgLy8gaGl0IHJlZHVjZXJzXG4gICAgICAgIHNhZ2FFbWl0dGVyLmVtaXQoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIHNhZ2FNaWRkbGV3YXJlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlZm9yZSBydW5uaW5nIGEgU2FnYSwgeW91IG11c3QgbW91bnQgdGhlIFNhZ2EgbWlkZGxld2FyZSBvbiB0aGUgU3RvcmUgdXNpbmcgYXBwbHlNaWRkbGV3YXJlJyk7XG4gIH07XG5cbiAgc2FnYU1pZGRsZXdhcmUuc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICgwLCBfdXRpbHMuY2hlY2spKHByb3BzLCBfdXRpbHMuaXMub2JqZWN0LCAoMCwgX3V0aWxzLmNyZWF0ZVNldENvbnRleHRXYXJuaW5nKSgnc2FnYU1pZGRsZXdhcmUnLCBwcm9wcykpO1xuICAgIF91dGlscy5vYmplY3QuYXNzaWduKGNvbnRleHQsIHByb3BzKTtcbiAgfTtcblxuICByZXR1cm4gc2FnYU1pZGRsZXdhcmU7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4LXNhZ2EvbGliL2ludGVybmFsL21pZGRsZXdhcmUuanNcbi8vIG1vZHVsZSBpZCA9IDc1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VtJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VtO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHV0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnB1dDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FsbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdyYWNlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnJhY2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjYWxsJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbGw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdhcHBseScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hcHBseTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NwcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jcHM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdmb3JrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZvcms7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzcGF3bicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zcGF3bjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2pvaW4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uam9pbjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NhbmNlbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5jYW5jZWw7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzZWxlY3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8uc2VsZWN0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYWN0aW9uQ2hhbm5lbCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5hY3Rpb25DaGFubmVsO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2FuY2VsbGVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmNhbmNlbGxlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2ZsdXNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmZsdXNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5nZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnc2V0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pby5zZXRDb250ZXh0O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndGFrZUV2ZXJ5Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRha2VFdmVyeTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rha2VMYXRlc3QnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW8udGFrZUxhdGVzdDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Rocm90dGxlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLnRocm90dGxlO1xuICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgtc2FnYS9saWIvZWZmZWN0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlscyA9IC8qI19fUFVSRV9fKi9yZXF1aXJlKCcuL2ludGVybmFsL3V0aWxzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVEFTSycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5UQVNLO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU0FHQV9BQ1RJT04nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdXRpbHMuU0FHQV9BQ1RJT047XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdub29wJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLm5vb3A7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF91dGlscy5pcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2RlZmVycmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmRlZmVycmVkO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnYXJyYXlPZkRlZmZlcmVkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmFycmF5T2ZEZWZmZXJlZDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZU1vY2tUYXNrJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNyZWF0ZU1vY2tUYXNrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY2xvbmVhYmxlR2VuZXJhdG9yJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3V0aWxzLmNsb25lYWJsZUdlbmVyYXRvcjtcbiAgfVxufSk7XG5cbnZhciBfaW8gPSAvKiNfX1BVUkVfXyovcmVxdWlyZSgnLi9pbnRlcm5hbC9pbycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2FzRWZmZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2lvLmFzRWZmZWN0O1xuICB9XG59KTtcblxudmFyIF9wcm9jID0gLyojX19QVVJFX18qL3JlcXVpcmUoJy4vaW50ZXJuYWwvcHJvYycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NIQU5ORUxfRU5EJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3Byb2MuQ0hBTk5FTF9FTkQ7XG4gIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC1zYWdhL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gICAgQWt2byBSU1IgaXMgY292ZXJlZCBieSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlLlxuICAgIFNlZSBtb3JlIGRldGFpbHMgaW4gdGhlIGxpY2Vuc2UudHh0IGZpbGUgbG9jYXRlZCBhdCB0aGUgcm9vdCBmb2xkZXIgb2YgdGhlXG4gICAgQWt2byBSU1IgbW9kdWxlLiBGb3IgYWRkaXRpb25hbCBkZXRhaWxzIG9uIHRoZSBHTlUgbGljZW5zZSBwbGVhc2Ugc2VlXG4gICAgPCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvYWdwbC5odG1sID4uXG4gKi9cblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tIFwibG9kYXNoL2Nsb25lRGVlcFwiO1xuXG5sZXQgaW5pdGlhbFN0YXRlID0ge1xuICAgIHNlbGVjdEFsbDogdHJ1ZSxcbiAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgcHJvamVjdHNMb2FkZWQ6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICAgIHVzZXJJZDogbnVsbCxcbiAgICBncm91cGVkUHJvamVjdHM6IFtdLFxuICAgIGlzUmVzdHJpY3RlZDogbnVsbCxcbiAgICBvcmlnaW5hbElzUmVzdHJpY3RlZDogbnVsbCxcbiAgICBvcmlnaW5hbEdyb3VwZWRQcm9qZWN0czogbnVsbCxcbiAgICBvcmlnaW5hbFNlbGVjdEFsbDogbnVsbFxufTtcblxuY29uc3QgdXBkYXRlUHJvamVjdEFjY2VzcyA9IChwcm9qZWN0SWQsIGdyb3VwZWRQcm9qZWN0cykgPT4ge1xuICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgcHJvamVjdCBhbmQgdG9nZ2xlIHRoZSB0aGUgYWNjZXNzIGZpZWxkXG4gICAgcmV0dXJuIChcbiAgICAgICAgZ3JvdXBlZFByb2plY3RzICYmXG4gICAgICAgIGdyb3VwZWRQcm9qZWN0cy5tYXAoZ3JvdXAgPT4gKHtcbiAgICAgICAgICAgIC4uLmdyb3VwLFxuICAgICAgICAgICAgcHJvamVjdHM6IGdyb3VwLnByb2plY3RzLm1hcChwcm9qZWN0ID0+ICh7XG4gICAgICAgICAgICAgICAgLi4ucHJvamVjdCxcbiAgICAgICAgICAgICAgICBhY2Nlc3M6XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3QuaWQgPT09IHByb2plY3RJZCA/IChwcm9qZWN0LmFjY2VzcyA9ICFwcm9qZWN0LmFjY2VzcykgOiBwcm9qZWN0LmFjY2Vzc1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pKVxuICAgICk7XG59O1xuXG5jb25zdCB1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyA9IChhY2Nlc3MsIGdyb3VwZWRQcm9qZWN0cykgPT4ge1xuICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgcHJvamVjdCBhbmQgdG9nZ2xlIHRoZSB0aGUgYWNjZXNzIGZpZWxkXG4gICAgcmV0dXJuIChcbiAgICAgICAgZ3JvdXBlZFByb2plY3RzICYmXG4gICAgICAgIGdyb3VwZWRQcm9qZWN0cy5tYXAoZ3JvdXAgPT4gKHtcbiAgICAgICAgICAgIC4uLmdyb3VwLFxuICAgICAgICAgICAgcHJvamVjdHM6IGdyb3VwLnByb2plY3RzLm1hcChwcm9qZWN0ID0+ICh7XG4gICAgICAgICAgICAgICAgLi4ucHJvamVjdCxcbiAgICAgICAgICAgICAgICBhY2Nlc3NcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KSlcbiAgICApO1xufTtcblxuY29uc3QgY2xvbmVTdGF0ZSA9IG9iaiA9PiBvYmogJiYgY2xvbmVEZWVwKG9iaik7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgICBjb25zdCByZWR1Y2VyQWN0aW9ucyA9IHtcbiAgICAgICAgW2MuU0VUX1NUT1JFXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCAuLi5kYXRhIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgW2MuQVBJX0dFVF9JTklUXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBmZXRjaGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5BUElfR0VUX1NVQ0NFU1NdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHsgaXNfcmVzdHJpY3RlZDogaXNSZXN0cmljdGVkIH0sXG4gICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uX2dyb3VwczogZ3JvdXBlZFByb2plY3RzXG4gICAgICAgICAgICB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcm9qZWN0c0xvYWRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBncm91cGVkUHJvamVjdHMsXG4gICAgICAgICAgICAgICAgaXNSZXN0cmljdGVkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLkFQSV9HRVRfRkFJTFVSRV06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxfcHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgICAgIGdyb3VwZWRQcm9qZWN0czogW10sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5BUElfUFVUX0lOSVRdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5BUElfUFVUX1NVQ0NFU1NdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHsgaXNfcmVzdHJpY3RlZDogaXNSZXN0cmljdGVkIH0sXG4gICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uX2dyb3VwczogZ3JvdXBlZFByb2plY3RzLFxuXG4gICAgICAgICAgICB9ID0gYWN0aW9uLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIGZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgZ3JvdXBlZFByb2plY3RzLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2VsZWN0QWxsOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIFtjLkFQSV9QVVRfRkFJTFVSRV06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBmZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHcm91cGVkUHJvamVjdHM6IG51bGwsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTZWxlY3RBbGw6IG51bGwsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIE92ZXJ3cml0ZSBpZiB3ZSBoYXZlIGFuIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICBpZiAoc3RhdGUub3JpZ2luYWxJc1Jlc3RyaWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0ZS5pc1Jlc3RyaWN0ZWQgPSBzdGF0ZS5vcmlnaW5hbElzUmVzdHJpY3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGF0ZS5vcmlnaW5hbEdyb3VwZWRQcm9qZWN0cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlLmdyb3VwZWRQcm9qZWN0cyA9IHN0YXRlLm9yaWdpbmFsR3JvdXBlZFByb2plY3RzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YXRlLm9yaWdpbmFsU2VsZWN0QWxsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGUuc2VsZWN0QWxsID0gc3RhdGUub3JpZ2luYWxTZWxlY3RBbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgW2MuVVBEQVRFX1BST0pFQ1RfU0VMRUNUSU9OXTogKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvamVjdElkIH0gPSBhY3Rpb24uZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwZWRQcm9qZWN0cyA9IHVwZGF0ZVByb2plY3RBY2Nlc3MoXG4gICAgICAgICAgICAgICAgcHJvamVjdElkLFxuICAgICAgICAgICAgICAgIGNsb25lU3RhdGUoc3RhdGUuZ3JvdXBlZFByb2plY3RzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHcm91cGVkUHJvamVjdHM6IGNsb25lU3RhdGUoc3RhdGUuZ3JvdXBlZFByb2plY3RzKSxcbiAgICAgICAgICAgICAgICBncm91cGVkUHJvamVjdHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgW2MuVVBEQVRFX0lTX1JFU1RSSUNURURdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBpc1Jlc3RyaWN0ZWQgfSA9IGFjdGlvbi5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgICBpc1Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxJc1Jlc3RyaWN0ZWQ6IHN0YXRlLmlzUmVzdHJpY3RlZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBbYy5VUERBVEVfU0VMRUNUX0FMTF9QUk9KRUNUU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBncm91cGVkUHJvamVjdHMgPSB1cGRhdGVBbGxQcm9qZWN0c0FjY2VzcyhzdGF0ZS5zZWxlY3RBbGwsIHN0YXRlLmdyb3VwZWRQcm9qZWN0cyk7XG4gICAgICAgICAgICBsZXQgeyBzZWxlY3RBbGwgfSA9IHsgLi4uc3RhdGUgfTtcbiAgICAgICAgICAgIHNlbGVjdEFsbCA9ICFzZWxlY3RBbGw7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsR3JvdXBlZFByb2plY3RzOiBjbG9uZVN0YXRlKHN0YXRlLmdyb3VwZWRQcm9qZWN0cyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTZWxlY3RBbGw6IHN0YXRlLnNlbGVjdEFsbCxcbiAgICAgICAgICAgICAgICBncm91cGVkUHJvamVjdHMsXG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVkdWNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoYWN0aW9uLnR5cGUpKSB7XG4gICAgICAgIHJldHVybiByZWR1Y2VyQWN0aW9uc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMtc3JjL3VzZXItcHJvamVjdHMtYWNjZXNzL3JlZHVjZXIuanMiLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uY2xvbmVgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGNsb25lcyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZWN1cnNpdmVseSBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZVxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmVEZWVwKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coZGVlcFswXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBjbG9uZURlZXAodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgQ0xPTkVfREVFUF9GTEFHIHwgQ0xPTkVfU1lNQk9MU19GTEFHKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL2Nsb25lRGVlcC5qc1xuLy8gbW9kdWxlIGlkID0gNzU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNNYXAgPSByZXF1aXJlKCcuL2lzTWFwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTZXQgPSByZXF1aXJlKCcuL2lzU2V0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfRkxBVF9GTEFHID0gMixcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gRGVlcCBjbG9uZVxuICogIDIgLSBGbGF0dGVuIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG4gKiAgNCAtIENsb25lIHN5bWJvbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBpc0RlZXAgPSBiaXRtYXNrICYgQ0xPTkVfREVFUF9GTEFHLFxuICAgICAgaXNGbGF0ID0gYml0bWFzayAmIENMT05FX0ZMQVRfRkxBRyxcbiAgICAgIGlzRnVsbCA9IGJpdG1hc2sgJiBDTE9ORV9TWU1CT0xTX0ZMQUc7XG5cbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCwgc3RhY2spIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gY29weUFycmF5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcblxuICAgIGlmIChpc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZUJ1ZmZlcih2YWx1ZSwgaXNEZWVwKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gKGlzRmxhdCB8fCBpc0Z1bmMpID8ge30gOiBpbml0Q2xvbmVPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGlzRmxhdFxuICAgICAgICAgID8gY29weVN5bWJvbHNJbih2YWx1ZSwgYmFzZUFzc2lnbkluKHJlc3VsdCwgdmFsdWUpKVxuICAgICAgICAgIDogY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgaWYgKGlzU2V0KHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oc3ViVmFsdWUpIHtcbiAgICAgIHJlc3VsdC5hZGQoYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdWJWYWx1ZSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGlzTWFwKHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgICAgcmVzdWx0LnNldChrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VDbG9uZS5qc1xuLy8gbW9kdWxlIGlkID0gNzU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hcnJheUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDc1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19hc3NpZ25WYWx1ZS5qc1xuLy8gbW9kdWxlIGlkID0gNzU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlQXNzaWduLmpzXG4vLyBtb2R1bGUgaWQgPSA3NTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDc2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzSW4nKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCwgdHJ1ZSkgOiBiYXNlS2V5c0luKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9rZXlzSW4uanNcbi8vIG1vZHVsZSBpZCA9IDc2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXNJbiA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5c0luKG9iamVjdCk7XG4gIH1cbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzSW47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlS2V5c0luLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fbmF0aXZlS2V5c0luLmpzXG4vLyBtb2R1bGUgaWQgPSA3NjRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIGFsbG9jVW5zYWZlID0gQnVmZmVyID8gQnVmZmVyLmFsbG9jVW5zYWZlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVCdWZmZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19jbG9uZUJ1ZmZlci5qc1xuLy8gbW9kdWxlIGlkID0gNzY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2NvcHlTeW1ib2xzLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fY29weVN5bWJvbHNJbi5qc1xuLy8gbW9kdWxlIGlkID0gNzY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzXG4vLyBtb2R1bGUgaWQgPSA3Njlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2dldEFsbEtleXNJbi5qc1xuLy8gbW9kdWxlIGlkID0gNzcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19pbml0Q2xvbmVBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gNzcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19pbml0Q2xvbmVCeVRhZy5qc1xuLy8gbW9kdWxlIGlkID0gNzcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanNcbi8vIG1vZHVsZSBpZCA9IDc3M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGRhdGFWaWV3YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFWaWV3IFRoZSBkYXRhIHZpZXcgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIGRhdGEgdmlldy5cbiAqL1xuZnVuY3Rpb24gY2xvbmVEYXRhVmlldyhkYXRhVmlldywgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlcikgOiBkYXRhVmlldy5idWZmZXI7XG4gIHJldHVybiBuZXcgZGF0YVZpZXcuY29uc3RydWN0b3IoYnVmZmVyLCBkYXRhVmlldy5ieXRlT2Zmc2V0LCBkYXRhVmlldy5ieXRlTGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURhdGFWaWV3O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gNzc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19jbG9uZVJlZ0V4cC5qc1xuLy8gbW9kdWxlIGlkID0gNzc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9fY2xvbmVTeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDc3NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDc3N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDc3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gvX2Jhc2VDcmVhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDc3OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZUlzTWFwID0gcmVxdWlyZSgnLi9fYmFzZUlzTWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc01hcCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzTWFwO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc01hcChuZXcgTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFwO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9pc01hcC5qc1xuLy8gbW9kdWxlIGlkID0gNzgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNNYXAuanNcbi8vIG1vZHVsZSBpZCA9IDc4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC9pc1NldC5qc1xuLy8gbW9kdWxlIGlkID0gNzgyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNTZXRgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc2V0LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1NldCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IHNldFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNTZXQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoL19iYXNlSXNTZXQuanNcbi8vIG1vZHVsZSBpZCA9IDc4M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxuICAgIEFrdm8gUlNSIGlzIGNvdmVyZWQgYnkgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZS5cbiAgICBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBsaWNlbnNlLnR4dCBmaWxlIGxvY2F0ZWQgYXQgdGhlIHJvb3QgZm9sZGVyIG9mIHRoZVxuICAgIEFrdm8gUlNSIG1vZHVsZS4gRm9yIGFkZGl0aW9uYWwgZGV0YWlscyBvbiB0aGUgR05VIGxpY2Vuc2UgcGxlYXNlIHNlZVxuICAgIDwgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2FncGwuaHRtbCA+LlxuICovXG5cbi8vIFRoaXMgaW1wb3J0IGlzIG5lY2Vzc2FyeSB0byBiZSBhYmxlIHRvIHRlc3Qgc2FnYXMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4LXNhZ2EvcmVkdXgtc2FnYS9pc3N1ZXMvMjgwI2lzc3VlY29tbWVudC0yOTExMzMwMjNcbmltcG9ydCBcInJlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZVwiO1xuXG5pbXBvcnQgeyB0YWtlTGF0ZXN0LCBjYWxsLCBwdXQsIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0ICogYXMgYyBmcm9tIFwiLi9jb25zdFwiO1xuaW1wb3J0IHsgZ2V0Q29va2llIH0gZnJvbSBcIi4uL215LXJlc3VsdHMvdXRpbHNcIjtcblxuZnVuY3Rpb24gY2FsbEF4aW9zKGNvbmZpZykge1xuICAgIHJldHVybiBheGlvcyhjb25maWcpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+ICh7IHJlc3BvbnNlIH0pKVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gKHsgZXJyb3IgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hEYXRhKHVzZXJJZCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICB1cmw6IGAvcmVzdC92MS91c2VyX3Byb2plY3RzX2FjY2Vzcy8ke3VzZXJJZH0vYFxuICAgIH07XG4gICAgcmV0dXJuIGNhbGxBeGlvcyhjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHV0RGF0YSh1c2VySWQsIGlzUmVzdHJpY3RlZCwgcHJvamVjdHNXaXRoQWNjZXNzKSB7XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBtZXRob2Q6IFwicGF0Y2hcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJYLUNTUkZUb2tlblwiOiBnZXRDb29raWUoXCJjc3JmdG9rZW5cIilcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiBgL3Jlc3QvdjEvdXNlcl9wcm9qZWN0c19hY2Nlc3MvJHt1c2VySWR9L2AsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHVzZXJfcHJvamVjdHM6IHtcbiAgICAgICAgICAgICAgICBpc19yZXN0cmljdGVkOiBpc1Jlc3RyaWN0ZWQsXG4gICAgICAgICAgICAgICAgcHJvamVjdHM6IHByb2plY3RzV2l0aEFjY2Vzc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gY2FsbEF4aW9zKGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogZ2V0U2FnYShhY3Rpb24pIHtcbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gYWN0aW9uLmRhdGE7XG4gICAgY29uc3QgeyByZXNwb25zZSwgZXJyb3IgfSA9IHlpZWxkIGNhbGwoZmV0Y2hEYXRhLCB1c2VySWQpO1xuICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9HRVRfU1VDQ0VTUywgZGF0YTogcmVzcG9uc2UuZGF0YSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB5aWVsZCBwdXQoeyB0eXBlOiBjLkFQSV9HRVRfRkFJTFVSRSwgZXJyb3IgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgZmlsdGVyUHJvamVjdHMgPSBzdGF0ZSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLmdyb3VwZWRQcm9qZWN0cy5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYy5jb25jYXQoXG4gICAgICAgICAgICBncm91cC5wcm9qZWN0cy5maWx0ZXIocHJvamVjdCA9PiBwcm9qZWN0LmFjY2VzcykubWFwKHByb2plY3QgPT4gcHJvamVjdC5pZClcbiAgICAgICAgKTtcbiAgICB9LCBbXSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlcklkID0gc3RhdGUgPT4gc3RhdGUudXNlcklkO1xuZXhwb3J0IGNvbnN0IGdldElzUmVzdHJpY3RlZCA9IHN0YXRlID0+IHN0YXRlLmlzUmVzdHJpY3RlZDtcblxuZXhwb3J0IGZ1bmN0aW9uKiBwdXRTYWdhKGFjdGlvbikge1xuICAgIHlpZWxkIHB1dCh7IHR5cGU6IGMuQVBJX1BVVF9JTklUIH0pO1xuICAgIGNvbnN0IHVzZXJJZCA9IHlpZWxkIHNlbGVjdChnZXRVc2VySWQpO1xuICAgIGNvbnN0IGlzUmVzdHJpY3RlZCA9IHlpZWxkIHNlbGVjdChnZXRJc1Jlc3RyaWN0ZWQpO1xuICAgIGNvbnN0IHByb2plY3RzV2l0aEFjY2VzcyA9IHlpZWxkIHNlbGVjdChmaWx0ZXJQcm9qZWN0cyk7XG5cbiAgICBjb25zdCB7IHJlc3BvbnNlLCBlcnJvciB9ID0geWllbGQgY2FsbChwdXREYXRhLCB1c2VySWQsIGlzUmVzdHJpY3RlZCwgcHJvamVjdHNXaXRoQWNjZXNzKTtcbiAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX1NVQ0NFU1MsIGRhdGE6IHJlc3BvbnNlLmRhdGEgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcHV0KHsgdHlwZTogYy5BUElfUFVUX0ZBSUxVUkUsIGVycm9yIH0pO1xuICAgIH1cbn1cblxuLy8gd2F0Y2hlciBzYWdhOiB3YXRjaGVzIGZvciBhY3Rpb25zIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlLCBzdGFydHMgd29ya2VyIHNhZ2FcbmV4cG9ydCBmdW5jdGlvbiogd2F0Y2hlclNhZ2EoKSB7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLkFQSV9HRVRfSU5JVCwgZ2V0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9QUk9KRUNUX1NFTEVDVElPTiwgcHV0U2FnYSk7XG4gICAgeWllbGQgdGFrZUxhdGVzdChjLlVQREFURV9TRUxFQ1RfQUxMX1BST0pFQ1RTLCBwdXRTYWdhKTtcbiAgICB5aWVsZCB0YWtlTGF0ZXN0KGMuVVBEQVRFX0lTX1JFU1RSSUNURUQsIHB1dFNhZ2EpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy1zcmMvdXNlci1wcm9qZWN0cy1hY2Nlc3Mvc2FnYXMuanMiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cbiAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cbiAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanNcbi8vIG1vZHVsZSBpZCA9IDc4NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3ODZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDc4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gNzg4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXG4vLyBtb2R1bGUgaWQgPSA3ODlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaXMtYnVmZmVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3OTBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9BeGlvcy5qc1xuLy8gbW9kdWxlIGlkID0gNzkxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9kZWZhdWx0cy5qc1xuLy8gbW9kdWxlIGlkID0gNzkyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBidG9hID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5idG9hICYmIHdpbmRvdy5idG9hLmJpbmQod2luZG93KSkgfHwgcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J0b2EnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgbG9hZEV2ZW50ID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gICAgdmFyIHhEb21haW4gPSBmYWxzZTtcblxuICAgIC8vIEZvciBJRSA4LzkgQ09SUyBzdXBwb3J0XG4gICAgLy8gT25seSBzdXBwb3J0cyBQT1NUIGFuZCBHRVQgY2FsbHMgYW5kIGRvZXNuJ3QgcmV0dXJucyB0aGUgcmVzcG9uc2UgaGVhZGVycy5cbiAgICAvLyBET04nVCBkbyB0aGlzIGZvciB0ZXN0aW5nIGIvYyBYTUxIdHRwUmVxdWVzdCBpcyBtb2NrZWQsIG5vdCBYRG9tYWluUmVxdWVzdC5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0JyAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiByZXF1ZXN0KSAmJlxuICAgICAgICAhaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSB7XG4gICAgICByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuICAgICAgbG9hZEV2ZW50ID0gJ29ubG9hZCc7XG4gICAgICB4RG9tYWluID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge307XG4gICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7fTtcbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0W2xvYWRFdmVudF0gPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQgJiYgIXhEb21haW4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIC8vIElFIHNlbmRzIDEyMjMgaW5zdGVhZCBvZiAyMDQgKGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvMjAxKVxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1xuLy8gbW9kdWxlIGlkID0gNzk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9zZXR0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDc5NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSA3OTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgcmV0dXJuIGVycm9yO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDc5N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA3OThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDc5OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xuLy8gbW9kdWxlIGlkID0gODAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gYnRvYSBwb2x5ZmlsbCBmb3IgSUU8MTAgY291cnRlc3kgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG5cbnZhciBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbmZ1bmN0aW9uIEUoKSB7XG4gIHRoaXMubWVzc2FnZSA9ICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInO1xufVxuRS5wcm90b3R5cGUgPSBuZXcgRXJyb3I7XG5FLnByb3RvdHlwZS5jb2RlID0gNTtcbkUucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuZnVuY3Rpb24gYnRvYShpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KTtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICBmb3IgKFxuICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnM7XG4gICAgLy8gaWYgdGhlIG5leHQgc3RyIGluZGV4IGRvZXMgbm90IGV4aXN0OlxuICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgIHN0ci5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcbiAgKSB7XG4gICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpZHggKz0gMyAvIDQpO1xuICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHtcbiAgICAgIHRocm93IG5ldyBFKCk7XG4gICAgfVxuICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnRvYTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzXG4vLyBtb2R1bGUgaWQgPSA4MDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA4MDJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDgwM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBTdXBwb3J0IGJhc2VVUkwgY29uZmlnXG4gIGlmIChjb25maWcuYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChjb25maWcudXJsKSkge1xuICAgIGNvbmZpZy51cmwgPSBjb21iaW5lVVJMcyhjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gIH1cblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzIHx8IHt9XG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDgwNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gODA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDgwNlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSA4MDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXG4vLyBtb2R1bGUgaWQgPSA4MDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDgwOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcbi8vIG1vZHVsZSBpZCA9IDgxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXG4vLyBtb2R1bGUgaWQgPSA4MTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==