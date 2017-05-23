/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var filtersWrapper = document.getElementById('wrapper');

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
    }
});

var FilterForm = React.createClass({
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
    getStateFromUrl: function(){
        var selected = {};
        var query = location.search.substring(1);
        if (query === '') { return selected };
        query.split('&').map(function(query_term){
            var pair = query_term.split('=');
            if (pair[1] !== '') {
                selected[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        });
        return selected;
    },
    componentDidMount: function(){
        this.fetchFilterOptions(true);
        window.advanced_filter_form = this;
    },
    fetchFilterOptions: function(mountedNow){
        var options = {};
        var self = this;
        var params = {format: "json"};
        params = Object.keys(Object.assign(params, this.state.selected)).map(
            function(key){
                return key + '=' + encodeURIComponent(params[key]);
            }
        ).join('&');
        var url = this.props.options_url + '?' + params;
        this.setState({disabled: true});
        fetch(url, options)
            .then(
                function(response){
                    if (response.status >=200 && response.status < 300) {
                        return response.json();
                    }
                }
            )
            .then(function(options){
                if (!options) {return;}
                self.setState({"options": self.processOptions(options), disabled: false});
                if (mountedNow) {
                    self.setInitialSelectionState(options);
                }
            });
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
            if (options.hasOwnProperty(key)) {
                var value = options[key];
                value.forEach(make_typeahead_item);
            }
        }
        return options;
    },
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
    submitForm: function(){
        this.preSubmitHack();
        this.setState({disabled: true});
        document.getElementById('filterForm').submit();
    },
    toggleForm: function(){
        document.querySelector('.menu-toggle').click();
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
        return (
            <aside id="sidebar-wrapper">
                <div id="filter">
                    {this.props.filters.map(create_filter, this)}
                    <div>
                        <nav>
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
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        );
    }
});


var filters = ['keyword', 'location', 'status', 'organisation', 'sector'];
var url = '/rest/v1/typeaheads/project_filters';

document.addEventListener('DOMContentLoaded', function() {
    i18n = JSON.parse(document.getElementById("typeahead-text").innerHTML);
    ReactDOM.render(
        <FilterForm filters={filters} options_url={url} i18n={i18n}/>,
        filtersWrapper);
});
