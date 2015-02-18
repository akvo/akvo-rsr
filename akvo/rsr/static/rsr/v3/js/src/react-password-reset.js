/** @jsx React.DOM */

var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Input = ReactBootstrap.Input;

var ResetModal = React.createClass({displayName: 'ResetModal',
    resetPassword: function() {
        form_data = this.getFormData();
        $.ajax({
            type: "POST",
            url: "/sign_in/",
            data : form_data,
            success: function(data) {
                this.props.onRequestHide();
            }.bind(this),
            error: function(xhr, status, err) {
                this.props.onRequestHide();
            }.bind(this)
        });
    },

    getFormData: function() {
        var data = {
            email: $('#id_email').val()
        };
        return data
    },

    render: function() {
        return this.transferPropsTo(
            Modal( {title:"Reset your password"}, 
              React.DOM.div( {className:"modal-body"}, 
                React.DOM.p(null, 'Fill in your email address in the field below. We will send you instructions on how to reset your password.'),
                Input( {className:"form-control", id:"id_email", maxLength:"254", name:"email", placeholder:"Email", required:"required", title:"", type:"email"} )
              ),
              React.DOM.div( {className:"modal-footer"}, 
                Button( {onClick:this.resetPassword, bsStyle:"info"}, "Reset password")
              )
            )
          );
    }
});

var TriggerModal = React.createClass({displayName: 'TriggerModal',
    render: function () {
        return (
            ModalTrigger( {modal:ResetModal(null )}, React.DOM.a( {href:"#"}, "I forgot my password"))
            );
    }
});

React.renderComponent(TriggerModal(null ), document.getElementById('reset-pw'));
