/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var filtersWrapper = document.getElementById('wrapper'),
    options_cache = {};


// Polyfill from MDN to add Object.assign
// Object.assign is not available on any version of IE!
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

var trim_label = function(obj) {
    if (obj.hasOwnProperty('label')) {
        obj.label = obj.label.trim();
    }
    return obj;
};

var Filter = React.createClass({
    render: function(){
        var Typeahead = ReactBootstrapTypeahead.Typeahead;
        return (
            <div>
                <label>{this.props.display_name}</label>
                <Typeahead
                    ref='typeahead'
                    name={this.props.name}
                    selected={this.props.selected}
                    options={this.props.options}
                    onChange={this.onChange}
                    filterBy={['filterBy']}
                    label='label'
                    clearButton={true}
                    disabled={this.props.disabled}
                />
            </div>
        );
    },
    onChange: function(values){
        this.props.onChange(this.props.name, values);
        if (values.length > 0) { trim_label(values[0]); }
    }
});

var FilterForm = React.createClass({
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
        if (Cookies.get('showAdvancedFilters') === 'on') {
            document.querySelector('#search-view').scrollIntoView();
        }
    },
    render: function(){
        var create_filter = function(filter_name){
            return (
                <Filter
                    ref={filter_name}
                    key={filter_name}
                    options={this.state.options[filter_name]}
                    name={filter_name}
                    display_name={this.props.i18n[filter_name+'_text']}
                    selected={this.state.initial_selection[filter_name]||[]}
                    onChange={this.onChange}
                    disabled={this.state.disabled}
                />
            );
        };
        var project_count = this.state.disabled?(<a>{this.props.i18n.loading_text}</a>):(
            <p>{this.props.i18n.search_text + ' ' + this.state.project_count + ' ' + this.props.i18n.projects_text}
            </p>
        );
        return (
            <aside id="sidebar-wrapper">
                <div id="filter">
                    {this.props.filters.map(create_filter, this)}
                    <div>
                        <nav id="advanced-filter-nav">
                            <ul className="nav nav-pills nav-stacked">
                                <li>
                                    <a className="showFilters text-center"
                                       id="apply-filter"
                                       onClick={this.submitForm}>
                                        {this.props.i18n.apply_filter_text}
                                    </a>
                                </li>
                                <li>
                                    <a className="showFilters menu-toggle text-center" onClick={this.toggleForm}>
                                        <i className="fa fa-toggle-off"></i>
                                        <span> {this.props.i18n.close_this_text}</span>
                                    </a>
                                </li>
                                <li id="advanced-filter-status">
                                    {project_count}
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
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
        // Treat iati_status query param as status param
        query = query.replace('iati_status', 'status');
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
            var id = this.state.selected[key],
                find_function = function(option){return option.id == id;},
                selection = options[key].find(find_function),
                selection_clone = Object.assign({}, selection);
            initial_selection[key] = [trim_label(selection_clone)];
        };
        Object.keys(this.state.selected).map(set_initial_selection, this);
        this.setState({"initial_selection": initial_selection});
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
        <FilterForm filters={filters} options_url={url} i18n={i18n}/>,
        filtersWrapper);
});
