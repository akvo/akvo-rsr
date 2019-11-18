// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var options_cache = {};

var Filter = React.createClass({
    render: function() {
        var Typeahead = ReactBootstrapTypeahead.Typeahead;
        var show_indented = function(item) {
            return "\u00A0".repeat(item.indent) + item.label;
        };
        return (
            <div className="advanced-filter">
                <Typeahead
                    ref="typeahead"
                    name={this.props.name}
                    selected={this.props.selected}
                    options={this.props.options}
                    onChange={this.onChange}
                    filterBy={["filterBy"]}
                    labelKey="label"
                    highlightOnlyResult={true}
                    placeholder={this.props.display_name}
                    disabled={this.props.disabled}
                    renderMenuItemChildren={show_indented}
                    maxResults={10000}
                />
                <span className="caret" />
            </div>
        );
    },
    componentWillReceiveProps: function(nextProps) {
        // Clear the typeaheads, when selections have been removed programmatically
        if (this.props.selected.length > 0 && nextProps.selected.length == 0) {
            this.refs.typeahead.getInstance().clear();
        }
    },
    onChange: function(values) {
        this.props.onChange(this.props.name, values);
    }
});

var changeNodeMarkerIcon = function(domNode, animation) {
    var projectId = domNode.id;
    console.log(projectId);
    mapMarkers.forEach(function(marker) {
        if ("#" + projectId == marker.highlightId) {
            marker.setAnimation(animation);
        }
    });
};

var Project = React.createClass({
    highlightMarker: function() {
        return changeNodeMarkerIcon(this.getDOMNode(), google.maps.Animation.BOUNCE);
    },
    unHighlightMarker: function() {
        return changeNodeMarkerIcon(this.getDOMNode(), null);
    },
    render: function() {
        var project = this.props.project,
            countries =
                " " +
                (project.countries.length > 0
                    ? project.countries.join(", ")
                    : this.props.i18n.no_location_text),
            element_id = "project-" + project.id;
        return (
            <li
                id={element_id}
                onMouseEnter={this.highlightMarker}
                onMouseLeave={this.unHighlightMarker}
            >
                <div className="contents">
                    <div className="thumbImg">
                        <a href={project.url}>
                            <img src={project.image} alt={project.title} />
                        </a>
                    </div>
                    <div className="text">
                        <h1>
                            <a href={project.url}>{project.title}</a>
                        </h1>
                        <p className="projectOrg">
                            <a href={project.organisation_url}>{project.organisation}</a>
                        </p>
                        <p className="projectLocation">
                            <i className="fa fa-map-marker" />
                            {countries}
                        </p>
                    </div>
                </div>
            </li>
        );
    }
});

var Update = React.createClass({
    highlightMarker: function() {
        return changeNodeMarkerIcon(this.getDOMNode(), google.maps.Animation.BOUNCE);
    },
    unHighlightMarker: function() {
        return changeNodeMarkerIcon(this.getDOMNode(), null);
    },
    render: function() {
        var project = this.props.project,
            element_id = "project-" + project.id;
        return (
            <li
                id={element_id}
                onMouseEnter={this.highlightMarker}
                onMouseLeave={this.unHighlightMarker}
                className="updateAsset"
            >
                <div className="thumbImg">
                    <a href={project.url}>
                        <img src={project.image} alt={project.title} />
                    </a>
                </div>
                <div>
                    <h1>
                        <a href={project.url}>{project.title}</a>
                    </h1>
                    <div>
                        <span>Project: </span>
                        <a href={project.project_url} class="projectTitle">
                            {project.project}
                        </a>
                    </div>
                    <div>
                        <span>Created by: </span>
                        <span class="userFullName">{project.user_fullname}</span>
                    </div>
                    <div>
                        <span>Org: </span>
                        <a href={project.organisation_url} class="orgName">
                            {project.organisation}
                        </a>
                    </div>
                    <div class="upDateTime">{project.event_date}</div>
                </div>
            </li>
        );
    }
});

var Organisation = React.createClass({
    render: function() {
        var organisation = this.props.organisation,
            element_id = "organisation-" + organisation.id;
        return (
            <li id={element_id}>
                <div>
                    <a href={organisation.url}>
                        <img src={organisation.image} alt={organisation.title} />
                    </a>
                </div>
                <div>
                    <h1>
                        <a href={organisation.url}>{organisation.name}</a>
                    </h1>
                    <div className="orgType">{organisation.organisation_type}</div>
                </div>
                <div className="hidden-xs hidden-sm additionalInfo">
                    <div>
                        <span>{organisation.project_count} projects</span>
                    </div>
                </div>
            </li>
        );
    }
});

var ProjectDirectory = React.createClass({
    componentDidUpdate: function(prevProps) {
        // If projects changed
        if (this.props.projects != prevProps.projects) {
            // Update map
            if (!this.props.hide_map) {
                window.render_map(
                    document.querySelector("#akvo_map_projects"),
                    this.getMapConfig()
                );
            }
            // Scroll the project list container to the top
            ReactDOM.findDOMNode(this).querySelector("#projList").scrollTop = 0;
        }
    },
    getLocations: function() {
        var projects = this.props.projects;
        return projects
            .filter(function(project) {
                return project.latitude !== null && project.longitude !== null;
            })
            .map(function(project) {
                return {
                    latitude: project.latitude,
                    longitude: project.longitude,
                    url: project.url,
                    text: project.title,
                    icon: this.props.mapMarker,
                    image: project.image,
                    highlightId: "#project-" + project.id
                };
            }, this);
    },
    getMapConfig: function() {
        return {
            dynamic: true,
            locations: this.getLocations(),
            clickCallback: this.props.setCountry
        };
    },
    // FIXME: Need to have a better display when things are loading....
    render: function() {
        var project_count_text =
                this.props.project_count != undefined
                    ? this.props.project_count + " " + this.props.elements_text
                    : this.props.i18n.loading_text,
            filtered = this.props.filtered ? " filtered" : "",
            listWidth = this.props.hide_map ? "col-sm-12" : "col-sm-7",
            listMsg = this.props.i18n.list_message_text,
            allProjects = this.props.i18n.all_projects_text,
            allUpdates = this.props.i18n.all_updates_text;

        return (
            <section className="main-list projects">
                <div className="container-fluid">
                    <div className="row">
                        {this.props.disabled ? (
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "calc(100vh - 160px)",
                                    background: "white",
                                    margin: "auto",
                                    padding: "20px",
                                    zIndex: "100000",
                                    textAlign: "center"
                                }}
                            >
                                <div style={{ marginTop: "calc(25vh)" }}>
                                    <i className="fa fa-spin fa-spinner" />
                                </div>
                            </div>
                        ) : (
                            undefined
                        )}

                        <div
                            className={listWidth + " projectListUlcontain " + filtered}
                            id="projList"
                        >
                            <p className="text-center listMsg">{listMsg}</p>
                            <p className="submenu-footer-stead">
                                <a href="/en/projects">{allProjects}</a>
                                <a href="/en/updates">{allUpdates}</a>
                            </p>
                            <ul className="projectListUl group">
                                {this.props.projects.map(function(project) {
                                    if (this.props.type == "projects") {
                                        return (
                                            <Project
                                                project={project}
                                                i18n={this.props.i18n}
                                                key={"project" + project.id}
                                            />
                                        );
                                    } else if (this.props.type == "updates") {
                                        return (
                                            <Update
                                                project={project}
                                                i18n={this.props.i18n}
                                                key={"project" + project.id}
                                            />
                                        );
                                    } else if (this.props.type == "organisations") {
                                        return (
                                            <Organisation
                                                organisation={project}
                                                i18n={this.props.i18n}
                                                key={"organisation" + project.id}
                                            />
                                        );
                                    }
                                }, this)}
                            </ul>
                            <div className="container-fluid pageStatus text-center">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <span className="label label-info projectTotal">
                                            {project_count_text}
                                        </span>
                                        <Pagination
                                            onChange={this.props.onChange}
                                            page={this.props.page}
                                            limit={this.props.limit}
                                            project_count={this.props.project_count}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.props.hide_map ? (
                            undefined
                        ) : (
                            <div className="col-sm-5">
                                <section id="map" className="touch-navbar">
                                    <div id="akvo_map_projects" className="rsr_map" />
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }
});

var Pagination = React.createClass({
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
            <div className="center-text pgWrap ">
                <Pagination
                    boundaryLinks={true}
                    activePage={parseInt(this.props.page)}
                    items={this.getPages()}
                    maxButtons={3}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }
});

var TextSearch = React.createClass({
    getInitialState: function() {
        return {
            value: "",
            options: []
        };
    },
    componentDidMount: function() {
        var options = this.fetchOptions();
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({ value: nextProps.text || "" });
    },
    fetchOptions: function() {
        var url = this.props.typeaheadUrl,
            app = this;

        fetch(url, {})
            .then(function(response) {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
            })
            .then(function(options) {
                app.setState({ options: app.mungeOptions(options.results) || [] });
            });
        return [];
    },
    getUrl: function(entry) {
        if (this.props.type == "projects") {
            return "../project/" + entry.id;
        } else if (this.props.type == "updates") {
            return "../project/" + entry.project + "/update/" + entry.id;
        } else if (this.props.type == "organisations") {
            return "../organisation/" + entry.id;
        }
    },
    mungeOptions: function(options) {
        return options.map(function(option) {
            option.id = String(option.id);
            return option;
        });
    },
    onChange: function(projects) {
        var project = projects[0],
            url = this.getUrl(project);

        window.location.href = url;
    },
    onInputChange: function(value) {
        this.setState({ value: value });
    },
    onSubmit: function(e) {
        this.props.onChange("title_or_subtitle", this.state.value);
    },
    render: function() {
        var Typeahead = ReactBootstrapTypeahead.Typeahead,
            filterBy;

        if (this.props.type == "projects") {
            filterBy = ["id", "title", "subtitle"];
        } else if (this.props.type == "updates") {
            filterBy = ["title"];
        } else if (this.props.type == "organisations") {
            filterBy = ["name", "long_name"];
        }

        return (
            <div className="form-inline col-lg-4 col-md-4 text-search" role="form">
                <div className="form-group">
                    <div className="input-group">
                        <Typeahead
                            name={this.props.name}
                            options={this.state.options}
                            onChange={this.onChange}
                            onInputChange={this.onInputChange}
                            filterBy={filterBy}
                            labelKey={function(x) {
                                return x.title || x.name;
                            }}
                            highlightOnlyResult={true}
                            placeholder={this.props.text_placeholder}
                            disabled={this.props.disabled}
                            maxResults={10}
                            minLength={3}
                        />

                        <span className="input-group-btn">
                            <button className="btn btn-primary" onClick={this.onSubmit}>
                                {this.props.i18n.search_text}
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        var get_selection = function(filter_name) {
            var options = this.props.options,
                id = this.props.selected[filter_name],
                dropdown_field = this.props.filters.indexOf(filter_name) > -1,
                find_function = function(option) {
                    return option.id == id;
                },
                selection = dropdown_field ? options[filter_name].find(find_function) : id,
                selection_clone = dropdown_field ? Object.assign({}, selection) : id;
            return dropdown_field ? (_.isEmpty(selection_clone) ? [] : [selection_clone]) : id;
        };
        var create_filter = function(filter_name) {
            var selection = get_selection.call(this, filter_name);
            return (
                <Filter
                    ref={filter_name}
                    key={filter_name}
                    options={this.props.options[filter_name]}
                    name={filter_name}
                    display_name={this.props.i18n[filter_name + "_text"]}
                    selected={selection}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
            );
        };
        var create_custom_filter_options = function(custom_filter) {
            let options = [];
            const create_item = (option, id, parent_item) => {
                const level = parent_item === undefined ? 0 : parent_item.level + 1;
                const item = {
                    label: option.name,
                    filterBy:
                        parent_item === undefined
                            ? option.name
                            : `${parent_item.filterBy} {option.name}`,
                    id: parent_item === undefined ? id : `${parent_item.id}__${id}`,
                    level: level,
                    indent: level * 4
                };
                options.push(item);
                if (option.options) {
                    option.options.map((sub_option, sub_id) => {
                        create_item(sub_option, sub_id, item);
                    });
                }
                return item;
            };

            custom_filter.dropdown_options.options.forEach((option, index) => {
                create_item(option, index);
            });
            return options;
        };
        var create_custom_filter = function(custom_filter) {
            const display_name = custom_filter.name;
            const filter_name = `custom_field__${custom_filter.id}`;
            const options = create_custom_filter_options(custom_filter);
            console.log(options);
            return (
                <Filter
                    ref={filter_name}
                    key={filter_name}
                    options={options}
                    name={filter_name}
                    display_name={display_name}
                    selected={[]}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
            );
        };
        var reset_button = _.isEmpty(
            _.pick(this.props.selected, "location", "organisation", "sector", "title_or_subtitle")
        ) ? (
            undefined
        ) : (
            <span className="pull-right">
                <a className="btn" onClick={this.props.resetFilters}>
                    X {this.props.i18n.reset_filters_text}
                </a>
            </span>
        );
        return (
            <section id="search-filter" className="container-fluid">
                <div id="search" className="row searchBar">
                    <TextSearch
                        type={this.props.type}
                        typeaheadUrl={this.props.typeaheadUrl}
                        text={this.props.selected.title_or_subtitle}
                        i18n={this.props.i18n}
                        text_placeholder={this.props.text_placeholder}
                        projects={this.props.projects}
                        onChange={this.props.onChange}
                    />
                    <div id="filter-wrapper col-sm-12 col-lg-6 col-md-6 col-lg-offset-2 col-md-offset-2">
                        <div>
                            {this.props.filters.map(create_filter, this)}
                            {this.props.options.custom_fields !== undefined
                                ? this.props.options.custom_fields.map(create_custom_filter, this)
                                : undefined}
                            {reset_button}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});

var App = React.createClass({
    /* React class methods */
    getInitialState: function() {
        var options = {
            keyword: [],
            location: [],
            organisation: [],
            sector: [],
            custom_fields: []
        };
        var urlState = this.getStateFromUrl();
        var state = {
            options: options,
            selected: urlState,
            filtered: Object.keys(urlState).length > 0,
            disabled: true,
            projects: []
        };
        return state;
    },
    componentDidMount: function() {
        var app = this;
        this.fetchData(true);
        window.onpopstate = function(popstate) {
            if (!_.isEqual(app.state.selected, popstate.state)) {
                app.setState({ selected: popstate.state || {} }, app.fetchData);
            }
        };
    },
    render: function() {
        var elements_text = this.props.i18n[this.props.type + "_text"];
        return (
            <div>
                <SearchBar
                    typeaheadUrl={this.props.typeahead_url}
                    resetFilters={this.resetFilters}
                    onChange={this.onFilterChange}
                    filters={this.props.dropdown_filters}
                    disabled={this.state.disabled}
                    projects={this.state.projects}
                    project_count={this.state.project_count}
                    i18n={this.props.i18n}
                    options={this.state.options}
                    selected={this.state.selected}
                    text_placeholder={elements_text}
                    type={this.props.type}
                />
                <ProjectDirectory
                    hide_map={this.props.hide_map}
                    mapMarker={this.props.mapMarker}
                    type={this.props.type}
                    onChange={this.onFilterChange}
                    limitOptions={this.state.options.limit}
                    page={this.state.selected.page || 1}
                    limit={this.state.selected.limit || this.state.page_size_default || 16}
                    projects={this.state.projects}
                    project_count={this.state.project_count}
                    i18n={this.props.i18n}
                    elements_text={elements_text}
                    disabled={this.state.disabled}
                    filtered={this.state.filtered}
                    setCountry={this.setCountry}
                />
            </div>
        );
    },

    /* Event handlers */
    onFilterChange: function(field_name, values) {
        var update = {};
        Object.assign(update, this.state.selected);
        if (values.length > 0) {
            update[field_name] = typeof values == "string" ? values : values[0].id;
            if (field_name !== "page" && update[field_name] !== this.state.selected[field_name]) {
                update["page"] = 1;
            }
        } else {
            delete update[field_name];
        }
        this.setState(
            { selected: update, filtered: Object.keys(update).length > 0 },
            this.fetchData
        );
        this.updateHistory(update);
    },
    resetFilters: function() {
        this.setState({ selected: {}, filtered: false }, this.fetchData);
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
                        self.cacheOptions(url, self.processOptions(options));
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
                        var processedOptions = self.processOptions(options);
                        self.updateState(processedOptions, mountedNow);
                        self.cacheOptions(url, processedOptions);
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
        // Allow using partner as a query param for organisation
        query = query.replace("partner", "organisation");
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
            var label = item.label || item.long_name || item.name || "",
                spaces = label.match(/\s+/i);
            // Stringify the id;
            item.id = String(item.id);
            item.filterBy = label.trim() + " " + item.id;
            item.indent = parseInt((spaces ? spaces[0].length : 0) / 4) * 4;
            item.label = label.trim();
        };
        for (var key in options) {
            if (this.isFilter(key, true)) {
                var value = options[key];
                value.forEach(make_typeahead_item);
            }
        }
        return options;
    },
    setCountry: function(name) {
        console.log(name);
        var locations = this.state.options.location;
        for (var i in locations) {
            if (locations[i].label == name) {
                this.onFilterChange("location", [locations[i]]);
                break;
            }
        }
    },
    updateHistory: function(state) {
        if (_.isEqual(state, history.state)) {
            // Don't update if current state is same as new state
            return;
        }
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
            }),
            url = queries.length > 0 ? "?" + queries.join("&") : "./";

        window.history.pushState(state, document.title + " " + title.join(", "), url);
    },
    updateState: function(options, mountedNow) {
        this.setState({
            options: options,
            disabled: false,
            project_count: options.project_count,
            page_size_default: options.page_size_default,
            projects: options.projects
        });
    }
});

// Add global variables for other scripts to use
window.DirectoryApp = App;
