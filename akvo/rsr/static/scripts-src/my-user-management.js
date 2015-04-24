/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var ApproveModal,
    Button = ReactBootstrap.Button,
    CountryJobTitle,
    DeleteModal,
    DropDownItem,
    DropdownButton = ReactBootstrap.DropdownButton,
    Employment,
    EmploymentList,
    MenuItem = ReactBootstrap.MenuItem,
    Modal = ReactBootstrap.Modal,
    ModalTrigger = ReactBootstrap.ModalTrigger,
    Table = ReactBootstrap.Table,
    TriggerModal,
    UserTable,
    initial_data;


DeleteModal = React.createClass({displayName: 'DeleteModal',
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
      Modal( {title:i18n.remove_user_text}, 
      React.DOM.div( {className:"modal-body"}, 
      i18n.remove_text + ' ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' ' + i18n.from_text + ' ' + this.props.employment.organisation_full.name + '?'
      ),
      React.DOM.div( {className:"modal-footer"}, 
      Button( {onClick:this.props.onRequestHide}, i18n.close_text),
      Button( {onClick:this.deleteEmployment, bsStyle:"danger"}, i18n.remove_button_text)
      )
      )
    );
  }
});


ApproveModal = React.createClass({displayName: 'ApproveModal',
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
      Modal( {title:"Approve user"}, 
      React.DOM.div( {className:"modal-body"}, 
      i18n.approve_text + ' ' + this.props.employment.user_full.first_name + ' ' + this.props.employment.user_full.last_name + ' ' + i18n.at_text + ' ' + this.props.employment.organisation_full.long_name + '?'
      ),
      React.DOM.div( {className:"modal-footer"}, 
      Button( {onClick:this.props.onRequestHide}, i18n.close_text),
      Button( {onClick:this.approveEmployment, bsStyle:"success"}, i18n.approve_button_text)
      )
      )
    );
  }
});


TriggerModal = React.createClass({displayName: 'TriggerModal',
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

  render: function() {
    if ( !this.state.visible ) {
      return React.DOM.span(null);
    }
    if (this.props.delete) {
      return (
      ModalTrigger( {modal:DeleteModal( {employment:this.props.employment, onDeleteToggle:this.props.onDeleteToggle} )}, 
      Button( {bsStyle:"danger", bsSize:"xsmall"}, "X")
      )
      );
    } else {
      return (
        ModalTrigger( {modal:ApproveModal( {employment:this.props.employment, onApproveToggle:this.onApprove} )}, 
        Button( {bsStyle:"success", bsSize:"xsmall"}, "√")
        )
      );
    }
  }

});


DropDownItem = React.createClass({displayName: 'DropDownItem',
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
    this.props.onSetGroup(React.DOM.i(null, i18n.loading_text));
    this.setGroup();
    this.props.loading(false);
  },

  render: function() {
    return (
      MenuItem( {eventKey:this.props.group.id, onClick:this.handleSetGroup}, this.props.group.name)
    );
  }
});


CountryJobTitle = React.createClass({displayName: 'CountryJobTitle',
  render: function() {
    var country = this.props.country;
    var job_title = this.props.job_title;
    if (country === "" && job_title === "") {
      return (
        React.DOM.span(null, " ")
      );
    } else {
      var text = "(";
      if (job_title !== "") {
        text += job_title;
      }
      if (country !== "") {
        if (job_title !== "") {
          text += " ";
        }
        text += i18n.in_text + ' ' + country.name;
      }
      text += ")";
      return (
        React.DOM.span( {className:"small"}, text,"   ")
      );
    }
  }
});


Employment = React.createClass({displayName: 'Employment',
  getInitialState: function() {
    return {
      visible: true,
      button_title: '(' + i18n.none_text + ')',
      loading: !this.props.employment.actions
    };
  },

  componentDidMount: function() {
    var group = this.props.employment.group;
    if (this.isMounted() && group !== null) {
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
    var user_id = this.props.employment.user_full.id;
    var other_groups = this.props.employment.other_groups.map(function(group) {
      return (
        DropDownItem(
        {key:group.id,
        group:group, employment_id:employment_id, onSetGroup:setGroupName, old_group:old_title, loading:loading} )
      );
    });
    if ( !this.state.visible ) {
      return React.DOM.span(null);
    } else {
      return (
        React.DOM.span(null, 
        this.props.employment.organisation_full.long_name," ",
        CountryJobTitle( {country:this.props.employment.country_full, job_title:this.props.employment.job_title} ),
        DropdownButton( {title:this.state.button_title, disabled:this.state.loading}, other_groups), "    ",
        TriggerModal( {employment:this.props.employment, onDeleteToggle:this.onDelete, delete:true} ), "  ",
        TriggerModal( {employment:this.props.employment, onDeleteToggle:this.onDelete, delete:false} ),React.DOM.br(null ),React.DOM.br(null )
        )
      );
    }
  }
});


EmploymentList = React.createClass({displayName: 'EmploymentList',
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
        Employment( {key:employment.id, employment:employment} )
      );
    });
    return (
      React.DOM.span(null, employments)
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
      React.DOM.td( {className:"text-right"}, EmploymentList( {user:this.props.user} ))
      )
    );
  }
});


UserTable = React.createClass({displayName: 'UserTable',
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
        UserRow( {key:user.id, user:user} )
      );
    });
    return (
      Table( {striped:true}, 
          React.DOM.thead(null, 
              React.DOM.tr(null, 
                  React.DOM.th(null, i18n.email_text),
                  React.DOM.th(null, i18n.first_name_text),
                  React.DOM.th(null, i18n.last_name_text),
                  React.DOM.th( {className:"text-right"}, i18n.organisations_text)
              )
          ),
          React.DOM.tbody(null, users)
      )
    );
  }
});


initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
i18n = JSON.parse(document.getElementById("user-management-text").innerHTML);

React.renderComponent(UserTable( {source:initial_data} ),
                      document.getElementById('user_table'));
