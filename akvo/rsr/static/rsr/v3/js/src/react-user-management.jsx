/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var DeleteModal = React.createClass({
    deleteEmployment: function() {
        $.ajax({
            type: "DELETE",
            url: "/rest/v1/employment/" + this.props.employment.id + '/?format=json',
            success: function(data) {
                this.handleDelete();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleDelete: function() {
        this.props.onDeleteToggle();
    },

    render: function() {
        return this.transferPropsTo(
            <Modal title="Remove link to organisation">
              <div className="modal-body">
                {'Are you sure you want to remove ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' from ' + this.props.employment.organisation_full.name + '?'}
              </div>
              <div className="modal-footer">
                <Button onClick={this.props.onRequestHide}>Close</Button>
                <Button onClick={this.deleteEmployment} bsStyle="danger">Remove</Button>
              </div>
            </Modal>
          );
    }
});

var ApproveModal = React.createClass({
    approveEmployment: function() {
        $.ajax({
            type: "POST",
            url: "/rest/v1/employment/" + this.props.employment.id + '/approve/',
            success: function(data) {
                this.handleApprove();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleApprove: function() {
        this.props.onRequestHide();
        this.props.onApproveToggle();
    },

    render: function() {
        return this.transferPropsTo(
            <Modal title="Remove link to organisation">
              <div className="modal-body">
                {'Are you sure you want to approve ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' at ' + this.props.employment.organisation_full.long_name + '?'}
              </div>
              <div className="modal-footer">
                <Button onClick={this.props.onRequestHide}>Close</Button>
                <Button onClick={this.approveEmployment} bsStyle="success">Approve</Button>
              </div>
            </Modal>
          );
    }
});

var TriggerModal = React.createClass({
    getInitialState: function() {
        return {
            visible: false,
            approved: false
        };
    },

    componentDidMount: function() {
        var visible = this.props.employment.actions;
        var approved = this.props.employment.is_approved;
        if (this.isMounted()) {
            this.setState({
                visible: visible,
                approved: approved
            });
        }
    },

    onApprove: function() {
        this.setState({approved: true});
    },

    render: function () {
        if (this.state.visible) {
            return this.state.approved
                ? <ModalTrigger modal={<DeleteModal employment={this.props.employment} onDeleteToggle={this.props.onDeleteToggle} />}>
                    <Button bsStyle="danger" bsSize="xsmall">X</Button>
                  </ModalTrigger>
                : <ModalTrigger modal={<ApproveModal employment={this.props.employment} onApproveToggle={this.onApprove} />}>
                    <Button bsStyle="success" bsSize="xsmall">&radic;</Button>
                  </ModalTrigger>;
        } else {
            return <span/>;
        }


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
            ? <li>{this.props.employment.organisation_full.long_name} <TriggerModal employment={this.props.employment} onDeleteToggle={this.onDelete} /></li>
            : <span/>;
    }
});

var EmploymentList = React.createClass({
    getInitialState: function() {
        return { employments: [] };
    },

    componentDidMount: function() {
        var employments = this.props.user.employments;
        if (this.isMounted()) {
            this.setState({
                employments: employments
            });
        }
    },

    render: function () {
        var employments = this.state.employments.map(function(employment) {
            return (
                <Employment employment={employment}/>
                )
        });
        return (
            <ul>{employments}</ul>
            );
    }
});

var UserRow = React.createClass({
    render: function() {
        return (
            <tr>
              <td>{this.props.user.email}</td>
              <td>{this.props.user.first_name}</td>
              <td>{this.props.user.last_name}</td>
              <td><EmploymentList user={this.props.user} /></td>
              <td><i>to do</i></td>
            </tr>
            );
    }
});

var UserTable = React.createClass({
    getInitialState: function() {
        return { users: [] };
    },

    componentDidMount: function() {
        var users = this.props.source.users;
        if (this.isMounted()) {
            this.setState({
                users: users
            });
        }
      },

    render: function() {
        var users = this.state.users.map(function(user) {
          return (
            <UserRow user={user} />
          )
        });
        return (
            <Table striped>
                <thead><tr><th>Email</th><th>First name</th><th>Last name</th><th>Organisations</th><th>Permissions</th></tr></thead>
                <tbody>{users}</tbody>
            </Table>
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(<UserTable source={initial_data} />, document.getElementById('user_table'));
