/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var filtersWrapper = document.getElementById('wrapper');

var Filter = React.createClass({displayName: "Filter",
    render: function(){
        var Typeahead = ReactBootstrapTypeahead.Typeahead;
        return (
            React.createElement("div", null, 
                React.createElement("label", null, this.props.title), 
                React.createElement(Typeahead, {
                    ref: "typeahead", 
                    name: this.props.title, 
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
        this.props.onChange(this.props.title, values);
    }
});

var FilterForm = React.createClass({displayName: "FilterForm",
    getInitialState: function(){
        var options = {
            "keyword": [],
            "location": [],
            "status": [],
            "organisation": [],
            "sector": [],
        };
        return {"options": options, "selected": {}, disabled: true};
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
        this.setState({disabled: true});
        document.getElementById('filterForm').submit();

    },
    closeForm: function(){
        document.querySelector('.menu-toggle').click();
    },
    render: function(){
        var create_filter = function(filter_name){
            return (
                React.createElement(Filter, {
                    ref: filter_name, 
                    key: filter_name, 
                    options: this.state.options[filter_name], 
                    title: filter_name, 
                    selected: [], 
                    onChange: this.onChange, 
                    disabled: this.state.disabled}
                )
            );
        };
        return (
            React.createElement("aside", {id: "sidebar-wrapper"}, 
                React.createElement("div", {id: "filter"}, 
                    this.props.filters.map(create_filter, this), 
                    React.createElement("div", null, 
                        React.createElement("nav", null, 
                            React.createElement("ul", {className: "nav nav-pills nav-stacked"}, 
                                /* FIXME: Use translation strings for 'apply filter' and 'close this' */
                                React.createElement("li", null, 
                                    React.createElement("a", {className: "showFilters text-center", 
                                       id: "apply-filter", 
                                       onClick: this.submitForm}, 
                                        "Apply filter"
                                    )
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {className: "showFilters menu-toggle text-center", onClick: this.closeForm}, 
                                        React.createElement("i", {className: "fa fa-toggle-off"}), 
                                        React.createElement("span", null, " Close this")
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});


var filters = ['keyword', 'location', 'status', 'organisation', 'sector'];
var url = '/rest/v1/typeaheads/project_filters';

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        React.createElement(FilterForm, {filters: filters, options_url: url}),
        filtersWrapper);
});
