/** @jsx React.DOM */
// jshint asi:true

var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;
var Input = ReactBootstrap.Input;
var i18n;

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
        <Modal title={i18n.reset_your_password_text}>
        <div className="modal-body">
        <p>{i18n.fill_email_text}</p>
        <Input className="form-control" id="id_email" maxLength="254" name="email" placeholder={i18n.email_text} required="required" title="" type="email" />
        </div>
        <div className="modal-footer">
        <Button onClick={this.resetPassword} bsStyle='info'>{i18n.reset_password_text}</Button>
        </div>
        </Modal>
    );
  }
});

var TriggerModal = React.createClass({
  render: function () {
    return (
        <ModalTrigger modal={<ResetModal />}><a href="#">{i18n.forgot_password_text}</a></ModalTrigger>
    );
  }
});

// Initial data
i18n = JSON.parse(document.getElementById("reset-password-text").innerHTML);

React.renderComponent(<TriggerModal />, document.getElementById('reset-pw'));
