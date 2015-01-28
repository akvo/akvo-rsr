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
        if (this.props.employment.is_approved) {
            return this.state.visible
                ? <li>{this.props.employment.organisation_full.long_name}</li>
                : <span/>;
        } else {
            return this.state.visible
                ? <li>{this.props.employment.organisation_full.long_name} <i>(Not approved)</i></li>
                : <span/>;
        }
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

    postEmployment: function( data ) {
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

    getOrgByName: function( serializedData ) {
        var name = $('#organisationInput').val();
        $.get(this.props.org_link + "?format=json&name=" + name, function( data ) {
            if (data.count == 1) {
                serializedData.organisation = data.results[0].id;
                this.postEmployment( serializedData );
            } else if (data.count > 1) {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, multiple organisations found."
                })
            } else {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, organisation not found."
                })
            }
        }.bind(this))
            .fail(function() {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, organisation not found."
                })
            }.bind(this)
        );
    },

    getOrgByLongName: function( serializedData ) {
        this.setState({
            response: "Retrieving organisation information..."
        });
        var name = $('#organisationInput').val();
        $.get(this.props.org_link + "?format=json&long_name=" + name, function( data ) {
            if (data.count == 1) {
                serializedData.organisation = data.results[0].id;
                this.postEmployment( serializedData );
            } else if (data.count > 1) {
                this.setState({
                    title: "Request failed",
                    response: "Request failed, multiple organisations found."
                })
            } else {
                this.getOrgByName( serializedData );
            }
        }.bind(this))
            .fail(function() {
                this.getOrgByName( serializedData )
            }.bind(this)
        );
    },

    addEmployment: function() {
        this.setState({
            title: "Sending request",
            response: "Waiting..."
        });

        var serializedData = this.getFormData();

        if (typeof serializedData.organisation === "undefined") {
            this.getOrgByLongName( serializedData );
        } else {
            this.postEmployment( serializedData );
        }
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
                <AddEmploymentForm link={this.props.link} org_link={this.props.org_link} addEmployment={this.addEmployment} />
            </span>
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
var request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);

React.renderComponent(
    <EmploymentApp source={initial_data} link={request_link.link} org_link={request_link.org_rest_link} />,
    document.getElementById('organisations')
);
