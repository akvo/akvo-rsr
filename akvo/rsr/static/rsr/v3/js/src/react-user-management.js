/** @jsx React.DOM */

var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

var DeleteModal = React.createClass({displayName: 'DeleteModal',
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
            Modal( {title:"Remove link to organisation"}, 
              React.DOM.div( {className:"modal-body"}, 
                'Are you sure you want to remove ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' from ' + this.props.employment.organisation_full.name + '?'
              ),
              React.DOM.div( {className:"modal-footer"}, 
                Button( {onClick:this.props.onRequestHide}, "Close"),
                Button( {onClick:this.deleteEmployment, bsStyle:"danger"}, "Remove")
              )
            )
          );
    }
});

var ApproveModal = React.createClass({displayName: 'ApproveModal',
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
            Modal( {title:"Remove link to organisation"}, 
              React.DOM.div( {className:"modal-body"}, 
                'Are you sure you want to approve ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' at ' + this.props.employment.organisation_full.long_name + '?'
              ),
              React.DOM.div( {className:"modal-footer"}, 
                Button( {onClick:this.props.onRequestHide}, "Close"),
                Button( {onClick:this.approveEmployment, bsStyle:"success"}, "Approve")
              )
            )
          );
    }
});

var TriggerModal = React.createClass({displayName: 'TriggerModal',
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
                ? ModalTrigger( {modal:DeleteModal( {employment:this.props.employment, onDeleteToggle:this.props.onDeleteToggle} )}, 
                    Button( {bsStyle:"danger", bsSize:"xsmall"}, "X")
                  )
                : ModalTrigger( {modal:ApproveModal( {employment:this.props.employment, onApproveToggle:this.onApprove} )}, 
                    Button( {bsStyle:"success", bsSize:"xsmall"}, "√")
                  );
        } else {
            return React.DOM.span(null);
        }


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
            ? React.DOM.li(null, this.props.employment.organisation_full.long_name, " ", TriggerModal( {employment:this.props.employment, onDeleteToggle:this.onDelete} ))
            : React.DOM.span(null);
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
                Employment( {employment:employment})
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
              React.DOM.td(null, EmploymentList( {user:this.props.user} )),
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
            UserRow( {user:user} )
          )
        });
        return (
            Table( {striped:true}, 
                React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Email"),React.DOM.th(null, "First name"),React.DOM.th(null, "Last name"),React.DOM.th(null, "Organisations"),React.DOM.th(null, "Permissions"))),
                React.DOM.tbody(null, users)
            )
            );
    }
});

var initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);

React.renderComponent(UserTable( {source:initial_data} ), document.getElementById('user_table'));
