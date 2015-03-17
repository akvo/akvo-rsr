/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var DeleteModal = React.createClass({displayName: "DeleteModal",
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
            React.createElement(Modal, {title: "Remove user from organisation"}, 
              React.createElement("div", {className: "modal-body"}, 
                'Are you sure you want to remove ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' from ' + this.props.employment.organisation_full.name + '?'
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                React.createElement(Button, {onClick: this.deleteEmployment, bsStyle: "danger"}, "Remove")
              )
            )
          );
    }
});

var ApproveModal = React.createClass({displayName: "ApproveModal",
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
            React.createElement(Modal, {title: "Approve user"}, 
              React.createElement("div", {className: "modal-body"}, 
                'Are you sure you want to approve ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' at ' + this.props.employment.organisation_full.long_name + '?'
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement(Button, {onClick: this.props.onRequestHide}, "Close"), 
                React.createElement(Button, {onClick: this.approveEmployment, bsStyle: "success"}, "Approve")
              )
            )
          );
    }
});

var TriggerModal = React.createClass({displayName: "TriggerModal",
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
                ? React.createElement(ModalTrigger, {modal: React.createElement(DeleteModal, {employment: this.props.employment, onDeleteToggle: this.props.onDeleteToggle})}, 
                    React.createElement(Button, {bsStyle: "danger", bsSize: "xsmall"}, "X")
                  )
                : React.createElement(ModalTrigger, {modal: React.createElement(ApproveModal, {employment: this.props.employment, onApproveToggle: this.onApprove})}, 
                    React.createElement(Button, {bsStyle: "success", bsSize: "xsmall"}, "√")
                  );
        } else {
            return React.createElement("span", null);
        }
    }
});

var DropDownItem = React.createClass({displayName: "DropDownItem",
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
        this.props.onSetGroup(React.createElement("i", null, "Loading..."));
        this.setGroup();
        this.props.loading(false);
    },

    render: function() {
        return (
            React.createElement(MenuItem, {eventKey: this.props.group.id, onClick: this.handleSetGroup}, this.props.group.name)
            );
    }
});

var CountryJobTitle = React.createClass({displayName: "CountryJobTitle",
    render: function() {
        var country = this.props.country;
        var job_title = this.props.job_title;
        if (country == "" && job_title == "") {
            return (
                React.createElement("span", null, " ")
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
                React.createElement("span", {className: "small"}, text, "   ")
                )
        }
    }
});

var Employment = React.createClass({displayName: "Employment",
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
            React.createElement(DropDownItem, {group: group, employment_id: employment_id, onSetGroup: setGroupName, old_group: old_title, loading: loading})
          )
        });
        return this.state.visible
            ? React.createElement("span", null, this.props.employment.organisation_full.long_name, " ", 
              React.createElement(CountryJobTitle, {country: this.props.employment.country_full, job_title: this.props.employment.job_title}), 
              React.createElement(DropdownButton, {title: this.state.button_title, disabled: this.state.loading}, other_groups), "    ", 
              React.createElement(TriggerModal, {employment: this.props.employment, onDeleteToggle: this.onDelete, delete: true}), "  ", 
              React.createElement(TriggerModal, {employment: this.props.employment, onDeleteToggle: this.onDelete, delete: false}), React.createElement("br", null), React.createElement("br", null))
            : React.createElement("span", null);
    }
});

var EmploymentList = React.createClass({displayName: "EmploymentList",
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
                React.createElement(Employment, {employment: employment})
                )
        });
        return (
                React.createElement("span", null, employments)
            );
    }
});

var UserRow = React.createClass({displayName: "UserRow",
    render: function() {
        return (
            React.createElement("tr", null, 
              React.createElement("td", null, this.props.user.email), 
              React.createElement("td", null, this.props.user.first_name), 
              React.createElement("td", null, this.props.user.last_name), 
              React.createElement("td", null, React.createElement(EmploymentList, {user: this.props.user}))
            )
            );
    }
});

var UserTable = React.createClass({displayName: "UserTable",
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
            React.createElement(UserRow, {user: user})
          )
        });
        return (
            React.createElement(Table, {striped: true}, 
                React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Email"), React.createElement("th", null, "First name"), React.createElement("th", null, "Last name"), React.createElement("th", null, "Organisations"))), 
                React.createElement("tbody", null, users)
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(React.createElement(UserTable, {source: initial_data}), document.getElementById('user_table'));
