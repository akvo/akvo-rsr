/** @jsx React.DOM */
// jshint asi:true

var Button,
    Modal,
    ModalTrigger,
    Input,
    i18n;

var ResetModal = React.createClass({
  resetPassword: function() {
    form_data = this.getFormData();
    url = '/' + AKVO_RSR.language + '/sign_in/';
    $.ajax({
      type: "POST",
      url: this.url,
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

document.addEventListener('DOMContentLoaded', function() {
    if (ReactBootstrap !== undefined) {
        // KB: Hack, do not show if ReactBootstrap can't be loaded
        Button = ReactBootstrap.Button;
        Modal = ReactBootstrap.Modal;
        ModalTrigger = ReactBootstrap.ModalTrigger;
        Input = ReactBootstrap.Input;
        i18n = JSON.parse(document.getElementById("reset-password-text").innerHTML);

        React.renderComponent(<TriggerModal />, document.getElementById('reset-pw'));
    }
});
