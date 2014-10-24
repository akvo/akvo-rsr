/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var ConfirmModal = React.createClass({displayName: 'ConfirmModal',
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
        Modal({title: "Delete user"}, 
          React.DOM.div({className: "modal-body"}, 
            'Are you sure you want to delete user: ' + this.props.user.first_name + ' ' + this.props.user.last_name + '?'
          ), 
          React.DOM.div({className: "modal-footer"}, 
            Button({onClick: this.props.onRequestHide}, "Close"), 
            Button({onClick: this.deleteUser, bsStyle: "danger"}, "Delete user")
          )
        )
      );
  }
});

var TriggerConfirmModal = React.createClass({displayName: 'TriggerConfirmModal',
    render: function () {
        return (
            ModalTrigger({modal: ConfirmModal({user: this.props.user, onDeleteToggle: this.props.onDeleteToggle})}, 
                Button({bsStyle: "danger"}, "X")
            )
            );
    }
});

var OrganisationList = React.createClass({displayName: 'OrganisationList',
    render: function () {
        var organisations = this.props.organisations.map(function(org) {
            return (
                React.DOM.li(null, org.name)
                )
        });
        return (
            React.DOM.ul(null, organisations)
            );
    }
});

var UserRow = React.createClass({displayName: 'UserRow',
    getInitialState: function() {
        return {visible: true};
    },

    onDelete: function() {
        this.setState({visible: false});
    },

    render: function() {
        return this.state.visible
           ? React.DOM.tr(null, 
              React.DOM.td(null, this.props.user.email), 
              React.DOM.td(null, this.props.user.first_name), 
              React.DOM.td(null, this.props.user.last_name), 
              React.DOM.td(null, OrganisationList({organisations: this.props.user.organisations})), 
              React.DOM.td(null, React.DOM.i(null, "To do")), 
              React.DOM.td(null, TriggerConfirmModal({user: this.props.user, onDeleteToggle: this.onDelete}))
             )
            : React.DOM.tr(null, React.DOM.td(null, React.DOM.i(null, "User Deleted")), React.DOM.td(null), React.DOM.td(null), React.DOM.td(null), React.DOM.td(null), React.DOM.td(null));
    }
});

var UserTable = React.createClass({displayName: 'UserTable',
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
            UserRow({user: user})
          )
        });
        return (
            Table({striped: true}, 
                React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Email"), React.DOM.th(null, "First name"), React.DOM.th(null, "Last name"), React.DOM.th(null, "Organisation"), React.DOM.th(null, "Permissions"), React.DOM.th(null, "Delete"))), 
                React.DOM.tbody(null, users)
            )
            );
    }
});

React.renderComponent(UserTable({source: "/rest/v1/user/?format=json"}), document.getElementById('user_table'));
