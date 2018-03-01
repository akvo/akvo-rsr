/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var projectDirectory = document.getElementById("project-directory"),
    options_cache = {};

var trim_label = function(obj) {
    if (obj.hasOwnProperty("label")) {
        obj.label = obj.label.trim();
    }
    return obj;
};

var Filter = React.createClass({displayName: "Filter",
    render: function() {
        var Typeahead = ReactBootstrapTypeahead.Typeahead;
        return (
            React.createElement("div", {className: "advanced-filter"}, 
                React.createElement(Typeahead, {
                    ref: "typeahead", 
                    name: this.props.name, 
                    selected: this.props.selected, 
                    options: this.props.options, 
                    onChange: this.onChange, 
                    filterBy: ["filterBy"], 
                    labelKey: "label", 
                    highlightOnlyResult: true, 
                    placeholder: this.props.display_name, 
                    disabled: this.props.disabled}
                ), 
                React.createElement("span", {className: "caret"})
            )
        );
    },
    onChange: function(values) {
        this.props.onChange(this.props.name, values);
        if (values.length > 0) {
            trim_label(values[0]);
        }
    }
});

var Project = React.createClass({displayName: "Project",
    render: function() {
        var project = this.props.project,
            countries =
                " " +
                (project.countries.length > 0
                    ? project.countries.join(", ")
                    : this.props.i18n.no_location_text);
        return (
            React.createElement("li", null, 
                React.createElement("div", {className: "thumbImg"}, 
                    React.createElement("a", {href: project.url}, 
                        React.createElement("img", {src: project.image, alt: project.title})
                    )
                ), 
                React.createElement("div", null, 
                    React.createElement("h1", null, 
                        React.createElement("a", {href: project.url}, project.title)
                    ), 
                    React.createElement("p", {className: "projectSubT"}, project.subtitle), 
                    React.createElement("p", {className: "projectLocation"}, 
                        React.createElement("i", {className: "fa fa-map-marker"}), 
                        countries
                    )
                )
            )
        );
    }
});

var ProjectDirectory = React.createClass({displayName: "ProjectDirectory",
    componentDidUpdate: function(prevProps) {
        // Update map
        if (this.props.projects != prevProps.projects) {
            window.render_map(document.querySelector("#akvo_map_projects"), this.getMapConfig());
        }
    },
    getLocations: function() {
        var projects = this.props.projects;
        return projects.map(function(project) {
            return {
                latitude: project.latitude,
                longitude: project.longitude,
                url: project.url,
                text: project.title,
                icon: "/static/images/maps/blueMarker.png",
                image: project.image
            };
        }, this);
    },
    getMapConfig: function() {
        return {
            dynamic: true,
            locations: this.getLocations()
        };
    },
    // FIXME: Need to have a better display when things are loading....
    render: function() {
        var project_count_text =
            this.props.project_count != undefined
                ? this.props.project_count + " " + this.props.i18n.projects_text
                : this.props.i18n.loading_text;
        return (
            React.createElement("section", {className: "main-list projects"}, 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-sm-7"}, 
                            React.createElement("ul", {className: "projectListUl"}, 
                                this.props.projects.map(function(project) {
                                    return (
                                        React.createElement(Project, {
                                            project: project, 
                                            i18n: this.props.i18n, 
                                            key: "project" + project.id}
                                        )
                                    );
                                }, this)
                            ), 
                            React.createElement("div", {className: "row container-fluid"}, 
                                React.createElement("div", {className: "verticalPadding col-xs-3"}, 
                                    React.createElement("h3", null, 
                                        React.createElement("span", {className: "label label-info"}, 
                                            project_count_text
                                        )
                                    )
                                ), 
                                React.createElement(Pagination, {
                                    onChange: this.props.onChange, 
                                    page: this.props.page, 
                                    limit: this.props.limit, 
                                    project_count: this.props.project_count}
                                ), 
                                React.createElement(PageLimitDropdown, {
                                    i18n: this.props.i18n, 
                                    onChange: this.props.onChange, 
                                    limit: this.props.limit, 
                                    options: this.props.limitOptions}
                                )
                            )
                        ), 
                        React.createElement("div", {className: "col-sm-5"}, 
                            React.createElement("section", {id: "map", className: "touch-navbar"}, 
                                React.createElement("div", {id: "akvo_map_projects", className: "rsr_map"})
                            )
                        )
                    )
                )
            )
        );
    }
});

var PageLimitDropdown = React.createClass({displayName: "PageLimitDropdown",
    onSelect: function(e) {
        e.preventDefault();
        this.props.onChange("limit", e.target.text);
    },
    render: function() {
        var DropdownButton = ReactBootstrap.DropdownButton,
            MenuItem = ReactBootstrap.MenuItem,
            options = this.props.options || [],
            disabled = options.length == 0,
            title = this.props.limit
                ? this.props.i18n.page_limit_text + ": " + this.props.limit
                : this.props.i18n.page_limit_text;

        return (
            React.createElement("div", {className: "verticalPadding col-sm-3 hidden-xs"}, 
                React.createElement("div", {className: "pull-right"}, 
                    React.createElement(DropdownButton, {
                        dropup: true, 
                        id: "limit", 
                        bsStyle: "default", 
                        title: title, 
                        onSelect: this.onSelect, 
                        disabled: disabled
                    }, 
                        options.map(function(option) {
                            var active = option == this.props.limit;
                            return (
                                React.createElement(MenuItem, {key: option, active: active}, 
                                    option
                                )
                            );
                        }, this)
                    )
                )
            )
        );
    }
});

var Pagination = React.createClass({displayName: "Pagination",
    getPages: function() {
        return Math.ceil(this.props.project_count / this.props.limit);
    },
    onSelect: function(e) {
        e.preventDefault();
        this.props.onChange("page", e.target.text);
    },
    render: function() {
        var Pagination = ReactBootstrap.Pagination;
        return (
            React.createElement("div", {className: "center-text col-xs-6"}, 
                React.createElement(Pagination, {
                    boundaryLinks: true, 
                    activePage: parseInt(this.props.page), 
                    items: this.getPages(), 
                    maxButtons: 3, 
                    onSelect: this.onSelect}
                )
            )
        );
    }
});

var TextSearch = React.createClass({displayName: "TextSearch",
    getInitialState: function() {
        return { value: "" };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({ value: nextProps.text || "" });
    },
    onChange: function(e) {
        console.log(e.target.value);
        this.setState({ value: e.target.value });
    },
    onEnter: function(e) {
        if (e.keyCode === 13) {
            return this.onSubmit();
        }
    },
    onSubmit: function(e) {
        this.props.onChange("title_or_subtitle", this.state.value);
    },
    render: function() {
        return (
            React.createElement("div", {className: "form-inline col-lg-4 col-md-12", role: "form"}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("div", {className: "input-group"}, 
                        React.createElement("input", {
                            type: "text", 
                            onKeyUp: this.onEnter, 
                            onChange: this.onChange, 
                            value: this.state.value}
                        ), 
                        React.createElement("span", {className: "input-group-btn"}, 
                            React.createElement("button", {className: "btn btn-primary", onClick: this.onSubmit}, 
                                this.props.i18n.search_text + " ›"
                            )
                        )
                    )
                )
            )
        );
    }
});

var SearchBar = React.createClass({displayName: "SearchBar",
    render: function() {
        var create_filter = function(filter_name) {
            return (
                React.createElement(Filter, {
                    ref: filter_name, 
                    key: filter_name, 
                    options: this.props.options[filter_name], 
                    name: filter_name, 
                    display_name: this.props.i18n[filter_name + "_text"], 
                    selected: this.props.initial_selection[filter_name] || [], 
                    onChange: this.props.onChange, 
                    disabled: this.props.disabled}
                )
            );
        };
        return (
            React.createElement("section", {id: "search-filter", className: "container-fluid"}, 
                React.createElement("div", {id: "search", className: "row searchBar"}, 
                    React.createElement(TextSearch, {
                        text: this.props.selected.title_or_subtitle, 
                        i18n: this.props.i18n, 
                        projects: this.props.projects, 
                        onChange: this.props.onChange}
                    ), 
                    React.createElement("div", {id: "filter-wrapper"}, 
                        React.createElement("div", null, this.props.filters.map(create_filter, this))
                    )
                )
            )
        );
    }
});

var App = React.createClass({displayName: "App",
    /* React class methods */
    getInitialState: function() {
        var options = {
            keyword: [],
            location: [],
            organisation: [],
            sector: []
        };
        var state = {
            options: options,
            selected: this.getStateFromUrl(),
            initial_selection: {},
            disabled: true,
            projects: []
        };
        return state;
    },
    componentDidMount: function() {
        var app = this;
        this.fetchData(true);
        window.onpopstate = function(popstate) {
            if (!_.isEmpty(popstate.state) && popstate.state != app.state.selected) {
                app.setState({ selected: popstate.state }, app.fetchData);
            }
        };
    },
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(SearchBar, {
                    onChange: this.onFilterChange, 
                    filters: this.props.dropdown_filters, 
                    disabled: this.state.disabled, 
                    projects: this.state.projects, 
                    project_count: this.state.project_count, 
                    i18n: this.props.i18n, 
                    options: this.state.options, 
                    selected: this.state.selected, 
                    initial_selection: this.state.initial_selection}
                ), 
                React.createElement(ProjectDirectory, {
                    onChange: this.onFilterChange, 
                    limitOptions: this.state.options.limit, 
                    page: this.state.selected.page || 1, 
                    limit: this.state.selected.limit || 15, 
                    projects: this.state.projects, 
                    project_count: this.state.project_count, 
                    i18n: this.props.i18n}
                )
            )
        );
    },

    /* Event handlers */
    onFilterChange: function(field_name, values) {
        var update = {};
        Object.assign(update, this.state.selected);
        if (values.length > 0) {
            update[field_name] = typeof values == "string" ? values : values[0].id;
        } else {
            delete update[field_name];
        }
        this.setState({ selected: update }, this.fetchData);
        this.updateHistory(update);
    },

    /* Helper methods */
    cacheAllOptions: function() {
        // Cache the options to show when there are no selections
        var self = this;
        var url = this.getOptionsUrl({});
        if (!options_cache[url]) {
            fetch(url, {})
                .then(self.parseResponse)
                .then(function(options) {
                    if (options) {
                        self.cacheOptions(url, options);
                    }
                });
        }
    },
    cacheOptions: function(url, options) {
        // Adds the specified options to the cache, for the given url
        options_cache[url] = options;
    },
    fetchData: function(mountedNow) {
        var url = this.getOptionsUrl(this.state.selected),
            cached_options = options_cache[url];
        if (cached_options && cached_options.project_count) {
            this.updateState(Object.assign({}, cached_options));
        } else {
            this.setState({ disabled: true });
            var self = this;
            fetch(url, {})
                .then(self.parseResponse)
                .then(function(options) {
                    if (options) {
                        self.updateState(options, mountedNow);
                        self.cacheOptions(url, options);
                        if (mountedNow) {
                            self.cacheAllOptions();
                        }
                    }
                });
        }
    },
    getOptionsUrl: function(selected) {
        var params = { format: "json" };
        params = Object.keys(Object.assign(params, selected))
            .map(function(key) {
                return key + "=" + encodeURIComponent(params[key]);
            })
            .join("&");
        return this.props.options_url + "?" + params;
    },
    getProjectUrl: function(project) {
        return "../project/" + project.id;
    },
    getStateFromUrl: function() {
        var selected = {};
        var query = location.search.substring(1);
        // Treat iati_status query param as status param
        query = query.replace("iati_status", "status");
        if (query === "") {
            return selected;
        }
        query.split("&").map(function(query_term) {
            var pair = query_term.split("="),
                key = decodeURIComponent(pair[0]),
                value = decodeURIComponent(pair[1]);
            if (value !== "" && this.isFilter(key)) {
                selected[key] = value;
            }
        }, this);
        return selected;
    },
    isFilter: function(name, dropdown) {
        return dropdown
            ? this.props.dropdown_filters.indexOf(name) > -1
            : this.props.dropdown_filters.indexOf(name) > -1 ||
                  this.props.hidden_or_other.indexOf(name) > -1;
    },
    parseResponse: function(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
    },
    processOptions: function(options) {
        // Add a filterBy attribute to all items
        var make_typeahead_item = function(item) {
            // Check various fields depending on type of options
            // NOTE: name always appears after long_name, since we
            // prefer long_name for organisations
            var label = item.label || item.long_name || item.name || "";
            // Stringify the id;
            item.id = String(item.id);
            item.filterBy = (label + " " + item.id).trim();
            item.label = label;
        };
        for (var key in options) {
            if (this.isFilter(key, true)) {
                var value = options[key];
                value.forEach(make_typeahead_item);
            }
        }
        return options;
    },
    setInitialSelectionState: function(options) {
        // NOTE: This function should always be called after process options,
        // since it needs the processed options
        var initial_selection = {};
        var set_initial_selection = function(key) {
            var id = this.state.selected[key],
                dropdown_field = this.props.dropdown_filters.indexOf(key) > -1,
                find_function = function(option) {
                    return option.id == id;
                },
                selection = dropdown_field ? options[key].find(find_function) : id,
                selection_clone = dropdown_field ? Object.assign({}, selection) : id;
            initial_selection[key] = dropdown_field ? [trim_label(selection_clone)] : id;
        };
        Object.keys(this.state.selected).map(set_initial_selection, this);
        this.setState({ initial_selection: initial_selection });
    },
    updateHistory: function(state) {
        // Update the browser URL
        var queries = _.pairs(state).map(function(q) {
                var key = q[0],
                    val = q[1];
                return key + "=" + encodeURI(val);
            }),
            title = _.pairs(state).map(function(q) {
                var key = q[0],
                    val = q[1];
                return key + ": " + encodeURI(val);
            });

        console.log("pushing", state);
        window.history.pushState(
            state,
            document.title + " " + title.join(", "),
            "?" + queries.join("&")
        );
    },
    updateState: function(options, mountedNow) {
        this.setState({
            options: this.processOptions(options),
            disabled: false,
            project_count: options.project_count,
            projects: options.projects
        });
        if (mountedNow) {
            this.setInitialSelectionState(options);
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var i18n = JSON.parse(document.getElementById("typeahead-text").innerHTML),
        dropdown_filters = ["location", "organisation", "sector"],
        hidden_or_other = ["title_or_subtitle", "keyword", "status", "page", "limit"],
        url = "/rest/v1/typeaheads/project_filters";

    ReactDOM.render(
        React.createElement(App, {
            dropdown_filters: dropdown_filters, 
            hidden_or_other: hidden_or_other, 
            options_url: url, 
            i18n: i18n}
        ),
        projectDirectory
    );
});
