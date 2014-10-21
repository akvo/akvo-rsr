/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var ConfirmModal = React.createClass({displayName: 'ConfirmModal',
  deleteEmployment: function() {
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
        Modal({title: "Remove link to organisation"}, 
          React.DOM.div({className: "modal-body"}, 
            'Are you sure you want to remove the link to this organisation: ' + this.props.employment.organisation_name + '?'
          ), 
          React.DOM.div({className: "modal-footer"}, 
            Button({onClick: this.props.onRequestHide}, "Close"), 
            Button({onClick: this.deleteEmployment, bsStyle: "danger"}, "Remove")
          )
        )
      );
  }
});

var TriggerConfirmModal = React.createClass({displayName: 'TriggerConfirmModal',
    render: function () {
        return (
            ModalTrigger({modal: ConfirmModal({employment: this.props.employment, onDeleteToggle: this.props.onDeleteToggle})}, 
                Button({bsStyle: "danger", bsSize: "xsmall"}, "X")
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
            ? React.DOM.li(null, this.props.employment.organisation_name, " ", TriggerConfirmModal({employment: this.props.employment, onDeleteToggle: this.onDelete}))
            : React.DOM.span(null);
    }
});

var EmploymentList = React.createClass({displayName: 'EmploymentList',
    getInitialState: function() {
        return { employments: [] };
    },

    componentDidMount: function() {
        $.get(this.props.source, function(result) {
            var employments = result.results;
            if (this.isMounted()) {
                this.setState({
                    employments: employments
                });
            }
        }.bind(this));
    },

    render: function () {
        var employments = this.state.employments.map(function(employment) {
            return (
                Employment({employment: employment})
                )
        });
        return (
            React.DOM.ul(null, employments)
            );
    }
});

var UserRow = React.createClass({displayName: 'UserRow',
    render: function() {
        return (
            React.DOM.tr(null, 
              React.DOM.td(null, this.props.user.email), 
              React.DOM.td(null, this.props.user.first_name), 
              React.DOM.td(null, this.props.user.last_name), 
              React.DOM.td(null, EmploymentList({source: "/rest/v1/employment/?format=json&user=" + this.props.user.id})), 
              React.DOM.td(null, React.DOM.i(null, "to do"))
            )
            );
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
                React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Email"), React.DOM.th(null, "First name"), React.DOM.th(null, "Last name"), React.DOM.th(null, "Organisations"), React.DOM.th(null, "Permissions"))), 
                React.DOM.tbody(null, users)
            )
            );
    }
});

React.renderComponent(UserTable({source: "/rest/v1/user/?format=json"}), document.getElementById('user_table'));
