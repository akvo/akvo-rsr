/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var ConfirmModal = React.createClass({
  deleteUser: function() {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.ajax({
        type: "DELETE",
        url: "/rest/v1/user/" + this.props.user.id + '/?format=json',
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
        <Modal title="Delete user">
          <div className="modal-body">
            {'Are you sure you want to delete user: ' + this.props.user.first_name + ' ' + this.props.user.last_name + '?'}
          </div>
          <div className="modal-footer">
            <Button onClick={this.props.onRequestHide}>Close</Button>
            <Button onClick={this.deleteUser} bsStyle="danger">Delete user</Button>
          </div>
        </Modal>
      );
  }
});

var TriggerConfirmModal = React.createClass({
    render: function () {
        return (
            <ModalTrigger modal={<ConfirmModal user={this.props.user} onDeleteToggle={this.props.onDeleteToggle} />}>
                <Button bsStyle="danger">X</Button>
            </ModalTrigger>
            );
    }
});

var OrganisationList = React.createClass({
    render: function () {
        var organisations = this.props.organisations.map(function(org) {
            return (
                <li>{org.name}</li>
                )
        });
        return (
            <ul>{organisations}</ul>
            );
    }
});

var UserRow = React.createClass({
    getInitialState: function() {
        return {visible: true};
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    render: function() {
        return this.state.visible
           ? <tr>
              <td>{this.props.user.email}</td>
              <td>{this.props.user.first_name}</td>
              <td>{this.props.user.last_name}</td>
              <td><OrganisationList organisations={this.props.user.organisations} /></td>
              <td><i>To do</i></td>
              <td><TriggerConfirmModal user={this.props.user} onDeleteToggle={this.onDelete} /></td>
             </tr>
            : <tr><td><i>User Deleted</i></td><td></td><td></td><td></td><td></td><td></td></tr>;
    }
});

var UserTable = React.createClass({
    getInitialState: function() {
        return { users: [] };
    },

    componentDidMount: function() {
        $.get(this.props.source, function(result) {
            var users = result.results;
            if (this.isMounted()) {
                this.setState({
                    users: users
                });
            }
        }.bind(this));
      },

    render: function() {
        var users = this.state.users.map(function(user) {
          return (
            <UserRow user={user} />
          )
        });
        return (
            <Table striped>
                <thead><tr><th>Email</th><th>First name</th><th>Last name</th><th>Organisation</th><th>Permissions</th><th>Delete</th></tr></thead>
                <tbody>{users}</tbody>
            </Table>
            );
    }
});

React.renderComponent(<UserTable source="/rest/v1/user/?format=json" />, document.getElementById('user_table'));
