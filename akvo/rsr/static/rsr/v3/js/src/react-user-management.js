/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var ConfirmModal = React.createClass({displayName: 'ConfirmModal',
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
            React.createElement(Modal, {title: "Remove link to organisation"}, 
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

var TriggerConfirmModal = React.createClass({displayName: 'TriggerConfirmModal',
    render: function () {
        return (
            React.createElement(ModalTrigger, {modal: React.createElement(ConfirmModal, {employment: this.props.employment, onDeleteToggle: this.props.onDeleteToggle})}, 
                React.createElement(Button, {bsStyle: "danger", bsSize: "xsmall"}, "X")
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
            ? React.createElement("li", null, this.props.employment.organisation_full.long_name, " ", React.createElement(TriggerConfirmModal, {employment: this.props.employment, onDeleteToggle: this.onDelete}))
            : React.createElement("span", null);
    }
});

var EmploymentList = React.createClass({displayName: 'EmploymentList',
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
            React.createElement("ul", null, employments)
            );
    }
});

var UserRow = React.createClass({displayName: 'UserRow',
    render: function() {
        return (
            React.createElement("tr", null, 
              React.createElement("td", null, this.props.user.email), 
              React.createElement("td", null, this.props.user.first_name), 
              React.createElement("td", null, this.props.user.last_name), 
              React.createElement("td", null, React.createElement(EmploymentList, {user: this.props.user})), 
              React.createElement("td", null, React.createElement("i", null, "to do"))
            )
            );
    }
});

var UserTable = React.createClass({displayName: 'UserTable',
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
            React.createElement(UserRow, {user: user})
          )
        });
        return (
            React.createElement(Table, {striped: true}, 
                React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Email"), React.createElement("th", null, "First name"), React.createElement("th", null, "Last name"), React.createElement("th", null, "Organisations"), React.createElement("th", null, "Permissions"))), 
                React.createElement("tbody", null, users)
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(React.createElement(UserTable, {source: initial_data}), document.getElementById('user_table'));
