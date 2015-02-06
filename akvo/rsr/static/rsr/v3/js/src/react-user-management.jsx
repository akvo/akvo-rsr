/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

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
            <Modal title="Remove user from organisation">
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
            url: "/rest/v1/employment/" + this.props.employment.id + '/approve/?format=json',
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
            <Modal title="Approve user">
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
            visible: false
        };
    },

    componentDidMount: function() {
        var visible = this.props.employment.actions;
        var approved = this.props.employment.is_approved;
        if (this.isMounted() && this.props.delete) {
            this.setState({
                visible: visible
            });
        } else if (this.isMounted() && !this.props.delete) {
            this.setState({
                visible: visible && !approved
            });
        }
    },

    onApprove: function() {
        this.setState({
            visible: false
        });
    },

    render: function () {
        if (this.state.visible) {
            return this.props.delete
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

var DropDownItem = React.createClass({
    setGroup: function() {
        $.ajax({
            type: "POST",
            url: "/rest/v1/employment/" + this.props.employment_id + '/set_group/' + this.props.group.id + '/?format=json',
            success: function(data) {
                this.props.onSetGroup(this.props.group.name);
            }.bind(this),
            error: function(xhr, status, err) {
                this.props.onSetGroup(this.props.old_group);
            }.bind(this)
        });
    },

    handleSetGroup: function() {
        // Ugly jQuery hack to close dropdown
        $("div.btn-group").removeClass("open");

        this.props.loading(true);
        this.props.onSetGroup(<i>Loading...</i>);
        this.setGroup();
        this.props.loading(false);
    },

    render: function() {
        return (
            <MenuItem eventKey={this.props.group.id} onClick={this.handleSetGroup}>{this.props.group.name}</MenuItem>
            );
    }
});

var CountryJobTitle = React.createClass({
    render: function() {
        var country = this.props.country;
        var job_title = this.props.job_title;
        if (country == "" && job_title == "") {
            return (
                <span>&nbsp;</span>
                )
        } else {
            var text = "(";
            if (job_title != "") {
                text += job_title
            }
            if (country != "") {
                if (job_title != "") {
                    text += " "
                }
                text += "in " + country.name
            }
            text += ")";
            return (
                <span className="small">{text}&nbsp; &nbsp;</span>
                )
        }
    }
});

var Employment = React.createClass({
    getInitialState: function() {
        return {
            visible: true,
            button_title: '(None)',
            loading: !this.props.employment.actions
        };
    },

    componentDidMount: function() {
        var group = this.props.employment.group;
        if (this.isMounted() && group != null) {
            this.setState({
                button_title: group.name
            });
        }
    },

    isLoading: function(boolean) {
        this.setState({
            loading: boolean
        });
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    setGroupName: function(group) {
        this.setState({
            button_title: group
        });
    },

    render: function() {
        var employment_id = this.props.employment.id;
        var setGroupName = this.setGroupName;
        var old_title = this.state.button_title;
        var loading = this.isLoading;
        var other_groups = this.props.employment.other_groups.map(function(group) {
          return (
            <DropDownItem group={group} employment_id={employment_id} onSetGroup={setGroupName} old_group={old_title} loading={loading} />
          )
        });
        return this.state.visible
            ? <span>{this.props.employment.organisation_full.long_name}&nbsp;
              <CountryJobTitle country={this.props.employment.country_full} job_title={this.props.employment.job_title} />
              <DropdownButton title={this.state.button_title} disabled={this.state.loading}>{other_groups}</DropdownButton> &nbsp; &nbsp;
              <TriggerModal employment={this.props.employment} onDeleteToggle={this.onDelete} delete={true} /> &nbsp;
              <TriggerModal employment={this.props.employment} onDeleteToggle={this.onDelete} delete={false} /><br /><br /></span>
            : <span />;
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
                <Employment employment={employment} />
                )
        });
        return (
                <span>{employments}</span>
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
            </tr>
            );
    }
});

var UserTable = React.createClass({
    getInitialState: function() {
        return {
            users: []
        };
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
                <thead><tr><th>Email</th><th>First name</th><th>Last name</th><th>Organisations</th></tr></thead>
                <tbody>{users}</tbody>
            </Table>
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(<UserTable source={initial_data} />, document.getElementById('user_table'));
