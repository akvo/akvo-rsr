/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var filtersWrapper = document.getElementById('wrapper'),
    options_cache = {};

var Filter = React.createClass({displayName: "Filter",
    render: function(){
        var Typeahead = ReactBootstrapTypeahead.Typeahead;
        return (
            React.createElement("div", null, 
                React.createElement("label", null, this.props.display_name), 
                React.createElement(Typeahead, {
                    ref: "typeahead", 
                    name: this.props.name, 
                    selected: this.props.selected, 
                    options: this.props.options, 
                    onChange: this.onChange, 
                    filterBy: ['filterBy'], 
                    label: "label", 
                    clearButton: true, 
                    disabled: this.props.disabled}
                )
            )
        );
    },
    onChange: function(values){
        this.props.onChange(this.props.name, values);
    }
});

var FilterForm = React.createClass({displayName: "FilterForm",
    /* React class methods */
    getInitialState: function(){
        var options = {
            "keyword": [],
            "location": [],
            "status": [],
            "organisation": [],
            "sector": [],
        };
        var state = {
            "options": options,
            "selected": this.getStateFromUrl(),
            "initial_selection": {},
            disabled: true
        };
        return state;
    },
    componentDidMount: function(){
        this.fetchFilterOptions(true);
        window.advanced_filter_form = this;
    },
    render: function(){
        var create_filter = function(filter_name){
            return (
                React.createElement(Filter, {
                    ref: filter_name, 
                    key: filter_name, 
                    options: this.state.options[filter_name], 
                    name: filter_name, 
                    display_name: this.props.i18n[filter_name+'_text'], 
                    selected: this.state.initial_selection[filter_name]||[], 
                    onChange: this.onChange, 
                    disabled: this.state.disabled}
                )
            );
        };
        var project_count = this.state.disabled?(React.createElement("a", null, this.props.i18n.loading_text)):(
            React.createElement("p", null, this.props.i18n.search_text + ' ' + this.state.project_count + ' ' + this.props.i18n.projects_text
            )
        );
        return (
            React.createElement("aside", {id: "sidebar-wrapper"}, 
                React.createElement("div", {id: "filter"}, 
                    this.props.filters.map(create_filter, this), 
                    React.createElement("div", null, 
                        React.createElement("nav", {id: "advanced-filter-nav"}, 
                            React.createElement("ul", {className: "nav nav-pills nav-stacked"}, 
                                React.createElement("li", null, 
                                    React.createElement("a", {className: "showFilters text-center", 
                                       id: "apply-filter", 
                                       onClick: this.submitForm}, 
                                        this.props.i18n.apply_filter_text
                                    )
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {className: "showFilters menu-toggle text-center", onClick: this.toggleForm}, 
                                        React.createElement("i", {className: "fa fa-toggle-off"}), 
                                        React.createElement("span", null, " ", this.props.i18n.close_this_text)
                                    )
                                ), 
                                React.createElement("li", {id: "advanced-filter-status"}, 
                                    project_count
                                )
                            )
                        )
                    )
                )
            )
        );
    },
    /* Event handlers */
    onChange: function(field_name, values){
        var update = {};
        Object.assign(update, this.state.selected);
        if (values.length > 0){
            update[field_name] = values[0].id;
        } else {
            delete update[field_name];
        }
        this.setState({"selected": update}, this.fetchFilterOptions);
    },
    submitForm: function(){
        this.preSubmitHack();
        this.setState({disabled: true});
        document.getElementById('filterForm').submit();
    },
    toggleForm: function(){
        document.querySelector('.menu-toggle').click();
    },

    /* Helper methods */
    cacheAllOptions: function(){
        // Cache the options to show when there are no selections
        var self = this;
        var url = this.getOptionsUrl({});
        if (!options_cache[url]) {
            fetch(url, {})
                .then(self.parseResponse)
                .then(function(options){
                    if (options) {
                        self.cacheOptions(url, options);
                    }
                });
        }
    },
    cacheOptions: function(url, options){
        // Adds the specified options to the cache, for the given url
        options_cache[url] = options;
    },
    fetchFilterOptions: function(mountedNow){
        var url = this.getOptionsUrl(this.state.selected),
            cached_options = options_cache[url];
        if (cached_options && cached_options.project_count){
            this.updateState(Object.assign({}, cached_options));
        } else {
            this.setState({disabled: true});
            var self = this;
            fetch(url, {})
                .then(self.parseResponse)
                .then(function(options){
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
    getOptionsUrl: function(selected){
        var params = {format: "json"};
        params = Object.keys(Object.assign(params, selected)).map(
            function(key){
                return key + '=' + encodeURIComponent(params[key]);
            }
        ).join('&');
        return this.props.options_url + '?' + params;
    },
    getStateFromUrl: function(){
        var selected = {};
        var query = location.search.substring(1);
        if (query === '') { return selected; }
        query.split('&').map(function(query_term){
            var pair = query_term.split('='),
                key = decodeURIComponent(pair[0]),
                value = decodeURIComponent(pair[1]);
            if (value !== '' && (this.props.filters.indexOf(key) > -1)) {
                selected[key] = value;
            }
        }, this);
        return selected;
    },
    parseResponse: function(response){
        if (response.status >=200 && response.status < 300) {
            return response.json();
        }
    },
    preSubmitHack: function(){
        /* HACK: The fields in the typeaheads are not option/selection fields,
           but simple input fields. Submitting the form submits the display text,
           but we would like to use the ids. */
        var set_id_as_value = function(key){
            var id = this.state.selected[key];
            var input = ReactDOM.findDOMNode(this.refs[key].refs.typeahead.getInstance()).querySelector('input');
            input.value = id;
        };
        Object.getOwnPropertyNames(this.state.selected).map(set_id_as_value, this);
    },
    processOptions: function(options){
        // Add a filterBy attribute to all items
        var make_typeahead_item = function(item){
            // Check various fields depending on type of options
            // NOTE: name always appears after long_name, since we
            // prefer long_name for organisations
            var label = item.label || item.long_name || item.name || '';
            // Stringify the id;
            item.id = String(item.id);
            item.filterBy = (label + ' ' + item.id).trim();
            item.label = label;
        };
        for (var key in options) {
            if (this.props.filters.indexOf(key) >= 0) {
                var value = options[key];
                value.forEach(make_typeahead_item);
            }
        }
        return options;
    },
    setInitialSelectionState: function(options){
        // NOTE: This function should always be called after process options,
        // since it needs the processed options
        var initial_selection = {};
        var set_initial_selection = function (key){
            var id = this.state.selected[key];
            var find_function = function(option){return option.id == id;};
            initial_selection[key] = [options[key].find(find_function)];
        };
        Object.keys(this.state.selected).map(set_initial_selection, this);
        this.setState({"initial_selection": initial_selection});
        if (Object.keys(initial_selection).length > 0) { this.toggleForm(); }
    },
    updateState: function(options, mountedNow){
        var project_count = options.project_count;
        this.setState({
            "options": this.processOptions(options),
            disabled: false,
            project_count: project_count
        });
        if (mountedNow) {
            this.setInitialSelectionState(options);
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    var i18n = JSON.parse(document.getElementById("typeahead-text").innerHTML);
    var filters = ['keyword', 'location', 'status', 'organisation', 'sector'];
    var url = '/rest/v1/typeaheads/project_filters';

    ReactDOM.render(
        React.createElement(FilterForm, {filters: filters, options_url: url, i18n: i18n}),
        filtersWrapper);
});
