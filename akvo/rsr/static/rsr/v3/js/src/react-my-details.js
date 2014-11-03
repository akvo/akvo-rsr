/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;

var ResponseModal = React.createClass({displayName: 'ResponseModal',
    render: function () {
        return this.transferPropsTo(
        Modal({title: this.props.title}, 
          React.DOM.div({className: "modal-body"}, this.props.response), 
          React.DOM.div({className: "modal-footer"}, Button({onClick: this.props.onRequestHide}, "Close"))
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
            ? React.DOM.li(null, this.props.employment.organisation_full.long_name, " - ", React.DOM.i(null, this.props.employment.job_title, " ", this.props.employment.country_full.name))
            : React.DOM.span(null);
    }
});

var EmploymentList = React.createClass({displayName: 'EmploymentList',
    render: function () {
        var employments = this.props.employments.map(function(employment) {
            return (
                Employment({employment: employment})
                )
        });
        return (
            React.DOM.ul(null, employments)
            );
    }
});

var OrganisationInput = React.createClass({displayName: 'OrganisationInput',
    render: function() {
        return (
                Input({type: "text", placeholder: "Organisation", id: "organisationInput"})
            );
    }
});

var CountryInput = React.createClass({displayName: 'CountryInput',
    render: function() {
        return (
                Input({type: "text", placeholder: "Country (optional)", id: "countriesInput"})
            );
    }
});

var JobTitleInput = React.createClass({displayName: 'JobTitleInput',
    render: function() {
        return (
                Input({type: "text", placeholder: "Job title (optional)", id: "jobtitleInput"})
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
            React.DOM.span(null, 
                React.DOM.h3(null, "Connect with an organisation"), 
                React.DOM.form(null, 
                    OrganisationInput({ref: "organisationInput"}), 
                    CountryInput({ref: "countryInput"}), 
                    JobTitleInput({ref: "jobtitleInput"}), 
                    ModalTrigger({modal: ResponseModal({title: this.state.title, response: this.state.response})}, 
                        Button({onClick: this.addEmployment, bsStyle: "success"}, "Request to join")
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
            React.DOM.span(null, 
                React.DOM.h2(null, "My organisations"), 
                EmploymentList({employments: this.state.employments}), 
                AddEmploymentForm({link: this.props.link, addEmployment: this.addEmployment})
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
var request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);

React.renderComponent(EmploymentApp({source: initial_data, link: request_link.link}), document.getElementById('organisations'));
