/** @jsx React.DOM */
// jshint asi:true

var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Input = ReactBootstrap.Input;

var ResetModal = React.createClass({
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
            <Modal title="Reset your password">
              <div className="modal-body">
                <p>{'Fill in your email address in the field below. We will send you instructions on how to reset your password.'}</p>
                <Input className="form-control" id="id_email" maxLength="254" name="email" placeholder="Email" required="required" title="" type="email" />
              </div>
              <div className="modal-footer">
                <Button onClick={this.resetPassword} bsStyle='info'>Reset password</Button>
              </div>
            </Modal>
          );
    }
});

var TriggerModal = React.createClass({
    render: function () {
        return (
            <ModalTrigger modal={<ResetModal />}><a href="#">I forgot my password</a></ModalTrigger>
        );
    }
});

var resetPW = React.renderComponent(<TriggerModal />, document.getElementById('reset-pw'));
