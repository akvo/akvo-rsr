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
                <label>{this.props.title}</label>
                <Typeahead
                    ref='typeahead'
                    clearButton={true}
                    name={this.props.title}
                    selected={this.props.selected}
                    options={this.props.options}
                    onChange={this.onChange}
                    filterBy={['filterBy']}
                    label='label'
                />
            </div>
        );
    },
    onChange: function(values){
        this.props.onChange(this.props.title, values);
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
        return {"options": options, "selected": {}};
    },
    componentDidMount: function(){
        this.fetchFilterOptions();
    },
    fetchFilterOptions: function(){
        var options = {};
        var self = this;
        var params = {format: "json"};
        params = Object.keys(Object.assign(params, this.state.selected)).map(
            function(key){
                return key + '=' + encodeURIComponent(params[key]);
            }
        ).join('&');
        var url = this.props.options_url + '?' + params;
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
                self.setState({"options": self.processOptions(options)});
            });
    },
    processOptions: function(options){
        // Add a filterBy attribute to all items
        var make_typeahead_item = function(item){
            // Check various fields depending on type of options
            // NOTE: name always appears after long_name, since we
            // prefer long_name for organisations
            var label = item.label || item.long_name || item.name || '';
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
    submitForm: function(){
        /* HACK: The fields in the typeaheads are not option/selection fields,
           but simple input fields. Submitting the form submits the display text,
           but we would like to use the ids. */
        var set_id_as_value = function(key){
            var id = this.state.selected[key];
            var input = ReactDOM.findDOMNode(this.refs[key].refs.typeahead.getInstance()).querySelector('input');
            input.value = id;
        };
        Object.keys(this.state.selected).map(set_id_as_value, this);
        document.getElementById('filterForm').submit();
    },
    render: function(){
        var self = this;
        return (
            <aside id="sidebar-wrapper">
                <div id="filter">
                    {this.props.filters.map(function(filter_name){
                         return (
                             <Filter
                                 ref={filter_name}
                                 key={filter_name}
                                 options={self.state.options[filter_name]}
                                 title={filter_name}
                                 selected={[]}
                                 onChange={self.onChange}
                             />
                         );
                     })}
                    <div>
                        <nav>
                            <ul className="nav nav-pills nav-stacked">
                                {/* FIXME: Use translation strings for 'apply filter' and 'close this' */}
                                <li>
                                    <a className="showFilters text-center"
                                       id="apply-filter"
                                       onClick={this.submitForm}>
                                        Apply filter
                                    </a>
                                </li>
                                <li>
                                    {/* FIXME: Button doesn't work */}
                                    <a className="showFilters menu-toggle text-center">
                                        <i className="fa fa-toggle-off"></i>Close this
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
    ReactDOM.render(
        <FilterForm filters={filters} options_url={url}/>,
        filtersWrapper);
});
