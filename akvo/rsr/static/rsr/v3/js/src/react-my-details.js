/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;

var ResponseModal = React.createClass({displayName: 'ResponseModal',
    render: function () {
        return this.transferPropsTo(
        React.createElement(Modal, {title: this.props.title}, 
          React.createElement("div", {className: "modal-body"}, this.props.response), 
          React.createElement("div", {className: "modal-footer"}, React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"))
        )
            );
    }
});

var Employment = React.createClass({displayName: 'Employment',
    getInitialState: function() {
        return {visible: true};
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    render: function() {
        return this.state.visible
            ? React.createElement("li", null, this.props.employment.organisation_full.long_name, 
              " - ", 
              React.createElement("i", null, this.props.employment.job_title, 
              " ", this.props.employment.country_full.name
              )
              )
            : React.createElement("span", null);
    }
});

var EmploymentList = React.createClass({displayName: 'EmploymentList',
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

var OrganisationInput = React.createClass({displayName: 'OrganisationInput',
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Organisation", id: "organisationInput"})
            );
    }
});

var CountryInput = React.createClass({displayName: 'CountryInput',
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Country (optional)", id: "countriesInput"})
            );
    }
});

var JobTitleInput = React.createClass({displayName: 'JobTitleInput',
    render: function() {
        return (
                React.createElement(Input, {type: "text", placeholder: "Job title (optional)", id: "jobtitleInput"})
            );
    }
});

var AddEmploymentForm = React.createClass({displayName: 'AddEmploymentForm',
    getInitialState: function() {
        return {
            title: "",
            response: ""
        };
    },

    addEmployment: function() {
        this.setState({
            title: "Sending request",
            response: "Waiting..."
        });

        serializedData = this.getFormData();

        $.ajax({
            type: "POST",
            url: this.props.link + "?format=json",
            data : JSON.stringify(serializedData),
            contentType : 'application/json; charset=UTF-8',
            success: function(response) {
                this.setState({
                    title: "Request successful",
                    response: "Your request is now pending and will have to be approved."
                });
                this.handleAddEmployment(response);
            }.bind(this),
            error: function(response) {
                this.setState({
                    title: "Request failed",
                    response: "Your request failed."
                })
            }.bind(this)
        });
    },

    getFormData: function() {
        var data = {
            organisation: $('#organisationInput').attr('value_id'),
            country: $('#countriesInput').attr('value_id'),
            job_title: $('#jobtitleInput').val()
        };
        return data
    },

    handleAddEmployment: function(employment) {
        this.props.addEmployment(employment);
    },

    render: function() {
        return (
            React.createElement("span", null, 
                React.createElement("h3", null, "Connect with an organisation"), 
                React.createElement("form", null, 
                    React.createElement(OrganisationInput, {ref: "organisationInput"}), 
                    React.createElement(CountryInput, {ref: "countryInput"}), 
                    React.createElement(JobTitleInput, {ref: "jobtitleInput"}), 
                    React.createElement(ModalTrigger, {modal: React.createElement(ResponseModal, {title: this.state.title, response: this.state.response})}, 
                        React.createElement(Button, {onClick: this.addEmployment, bsStyle: "success"}, "Request to join")
                    )
                )
            )
            );
    }
});

var EmploymentApp = React.createClass({displayName: 'EmploymentApp',
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
                React.createElement("h2", null, "My organisations"), 
                React.createElement(EmploymentList, {employments: this.state.employments}), 
                React.createElement(AddEmploymentForm, {link: this.props.link, addEmployment: this.addEmployment})
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
var request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);

React.renderComponent(
    React.createElement(EmploymentApp, {source: initial_data, link: request_link.link}),
    document.getElementById('organisations')
);
