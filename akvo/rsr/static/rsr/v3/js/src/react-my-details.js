/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;

var ResponseModal = React.createClass({displayName: "ResponseModal",
    render: function () {
        return this.transferPropsTo(
        React.createElement(Modal, {title: this.props.title}, 
          React.createElement("div", {className: "modal-body"}, this.props.response), 
          React.createElement("div", {className: "modal-footer"}, React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"))
        )
            );
    }
});

var Employment = React.createClass({displayName: "Employment",
    getInitialState: function() {
        return {visible: true};
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    render: function() {
        if (this.props.employment.is_approved) {
            return this.state.visible
                ? React.createElement("li", null, this.props.employment.organisation_full.name)
                : React.createElement("span", null);
        } else {
            return this.state.visible
                ? React.createElement("li", null, this.props.employment.organisation_full.name, " ", React.createElement("i", null, "(Not approved)"))
                : React.createElement("span", null);
        }
    }
});

var EmploymentList = React.createClass({displayName: "EmploymentList",
    render: function () {
        var employments = this.props.employments.map(function(employment) {
            return (
                React.createElement(Employment, {employment: employment})
                )
        });
        return (
            React.createElement("ul", null, employments)
            );
    }
});

var OrganisationInput = React.createClass({displayName: "OrganisationInput",
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Organisation", id: "organisationInput"})
            );
    }
});

var CountryInput = React.createClass({displayName: "CountryInput",
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Country (optional)", id: "countriesInput"})
            );
    }
});

var JobTitleInput = React.createClass({displayName: "JobTitleInput",
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Job title (optional)", id: "jobtitleInput"})
            );
    }
});

var AddEmploymentForm = React.createClass({displayName: "AddEmploymentForm",
    getInitialState: function() {
        return {
            title: "",
            response: ""
        };
    },

    postEmployment: function( data ) {
        this.setState({
            response: "Linking user to organisation..."
        });
        $.ajax({
            type: "POST",
            url: this.props.link + "?format=json",
            data : JSON.stringify( data ),
            contentType : 'application/json; charset=UTF-8',
            success: function(response) {
                this.handleAddEmployment(response);
                this.setState({
                    title: "Request successful",
                    response: "Your request is now pending and will have to be approved."
                });
            }.bind(this),
            error: function(xhr, status, err) {
                if (xhr.status == 409) {
                    this.setState({
                        title: "Request failed",
                        response: "You are already connected to this organisation. Only one connection per organisation is allowed."
                    })
                } else {
                    this.setState({
                        title: "Request failed",
                        response: "Request failed, could not connect to organisation."
                    })
                }
            }.bind(this)
        });
    },

    getCountryByName: function( serializedData ) {
        this.setState({
            response: "Retrieving country information..."
        });
        var name = $('#countriesInput').val();
        $.get(this.props.country_link + "?format=json&name=" + name, function( data ) {
            if (data.count == 1) {
                serializedData.country = data.results[0].id;
            }
            this.postEmployment( serializedData );
        }.bind(this))
            .fail(function() {
                this.postEmployment( serializedData );
            }.bind(this)
        );
    },

    getOrgByName: function( serializedData ) {
        this.setState({
            response: "Retrieving organisation information..."
        });
        var name = $('#organisationInput').val();
        $.get(this.props.org_link + "?format=json&name=" + name, function( data ) {
            if (data.count == 1) {
                serializedData.organisation = data.results[0].id;
                this.getCountryByName( serializedData );
            } else if (data.count > 1) {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, multiple organisations named \"" + name + "\" found. " +
                        "Please send a mail to support@akvo.org to get this resolved."
                })
            } else {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, could not find organisation \"" + name + "\"."
                })
            }
        }.bind(this))
            .fail(function() {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, could not find organisation \"" + name + "\"."
                })
            }.bind(this)
        );
    },

    addEmployment: function() {
        this.setState({
            title: "Sending request",
            response: "Waiting..."
        });

        var serializedData = this.getFormData();
        this.getOrgByName( serializedData );
    },

    getFormData: function() {
        return {
            organisation: $('#organisationInput').attr('value_id'),
            country: $('#countriesInput').attr('value_id'),
            job_title: $('#jobtitleInput').val()
        }
    },

    handleAddEmployment: function(employment) {
        this.props.addEmployment(employment);
    },

    render: function() {
        return (
            React.createElement("span", null, 
                React.createElement("h4", null, "Connect with your employer"), 
                React.createElement("form", null, 
                    React.createElement(OrganisationInput, {ref: "organisationInput"}), 
                    React.createElement(CountryInput, {ref: "countryInput"}), 
                    React.createElement(JobTitleInput, {ref: "jobtitleInput"}), 
                    React.createElement(ModalTrigger, {modal: React.createElement(ResponseModal, {title: this.state.title, response: this.state.response})}, 
                        React.createElement(Button, {onClick: this.addEmployment, bsStyle: "primary"}, "Request to join")
                    )
                )
            )
            );
    }
});

var EmploymentApp = React.createClass({displayName: "EmploymentApp",
    getInitialState: function() {
        return { employments: [] }
    },

    componentDidMount: function() {
        var employments = this.props.source.user.employments;
        if (this.isMounted()) {
            this.setState({
                employments: employments
            });
        }
    },

    addEmployment: function(employment) {
        this.setState({
            employments: this.state.employments.concat([employment])
        })
    },

    render: function() {
        return (
            React.createElement("span", null, 
                React.createElement("h3", null, React.createElement("i", {className: "fa fa-users"}), " My organisations"), 
                React.createElement(EmploymentList, {employments: this.state.employments}), 
                React.createElement(AddEmploymentForm, {link: this.props.link, org_link: this.props.org_link, 
                    country_link: this.props.country_link, addEmployment: this.addEmployment})
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
var request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);

React.renderComponent(
    React.createElement(EmploymentApp, {source: initial_data, link: request_link.link, org_link: request_link.org_rest_link, 
        country_link: request_link.country_rest_link}),
    document.getElementById('organisations')
);
