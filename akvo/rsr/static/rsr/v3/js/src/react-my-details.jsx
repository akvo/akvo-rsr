/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Input = ReactBootstrap.Input;

var ResponseModal = React.createClass({
    render: function () {
        return this.transferPropsTo(
        <Modal title={this.props.title}>
          <div className="modal-body">{this.props.response}</div>
          <div className="modal-footer"><Button onClick={this.props.onRequestHide}>Close</Button></div>
        </Modal>
            );
    }
});

var Employment = React.createClass({
    getInitialState: function() {
        return {visible: true};
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    render: function() {
        return this.state.visible
            ? <li>{this.props.employment.organisation_full.long_name} - <i>{this.props.employment.job_title} {this.props.employment.country_full.name}</i></li>
            : <span/>;
    }
});

var EmploymentList = React.createClass({
    render: function () {
        var employments = this.props.employments.map(function(employment) {
            return (
                <Employment employment={employment}/>
                )
        });
        return (
            <ul>{employments}</ul>
            );
    }
});

var OrganisationInput = React.createClass({
    render: function() {
        return (
                <Input type="text" placeholder="Organisation" id="organisationInput" />
            );
    }
});

var CountryInput = React.createClass({
    render: function() {
        return (
                <Input type="text" placeholder="Country (optional)" id="countriesInput" />
            );
    }
});

var JobTitleInput = React.createClass({
    render: function() {
        return (
                <Input type="text" placeholder="Job title (optional)" id="jobtitleInput" />
            );
    }
});

var AddEmploymentForm = React.createClass({
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
        serializedData['user'] = this.props.user_id;

        $.ajax({
            type: "POST",
            url: "/rest/v1/employment/?format=json",
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
                if (response['status'] == 500) {
                    this.setState({
                        title: "Request failed",
                        response: "You're already connected to this organisation, only one link is possible."
                    })
                } else {
                    this.setState({
                        title: "Request failed",
                        response: "Something went wrong..."
                    })
                }
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
            <span>
                <h3>Connect with an organisation</h3>
                <form>
                    <OrganisationInput ref="organisationInput" />
                    <CountryInput ref="countryInput" />
                    <JobTitleInput ref="jobtitleInput" />
                    <ModalTrigger modal={<ResponseModal title={this.state.title} response={this.state.response} />}>
                        <Button onClick={this.addEmployment} bsStyle='success'>Request to join</Button>
                    </ModalTrigger>
                </form>
            </span>
            );
    }
});

var EmploymentApp = React.createClass({
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
            <span>
                <h2>My organisations</h2>
                <EmploymentList employments={this.state.employments} />
                <AddEmploymentForm user_id={this.props.source.user.id} addEmployment={this.addEmployment} />
            </span>
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(<EmploymentApp source={initial_data} />, document.getElementById('organisations'));
