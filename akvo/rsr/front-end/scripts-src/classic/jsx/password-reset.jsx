// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Button, Modal, Input, i18n;

function initReact() {
    // Load globals
    Button = ReactBootstrap.Button;
    Modal = ReactBootstrap.Modal;
    Input = ReactBootstrap.Input;

    var ResetModal = React.createClass({
        getInitialState: function() {
            return {
                showModal: false
            };
        },

        close: function() {
            this.setState({
                showModal: false
            });
        },

        open: function() {
            this.setState({
                showModal: true
            });
        },

        resetPassword: function() {
            var thisModal = this;

            form_data = this.getFormData();
            url = "/" + AKVO_RSR.language + "/sign_in/";
            $.ajax({
                type: "POST",
                url: this.url,
                data: form_data,
                success: function(data) {
                    thisModal.close();
                }.bind(this),
                error: function(xhr, status, err) {
                    thisModal.close();
                }.bind(this)
            });
        },

        getFormData: function() {
            return { email: $("#id_email").val() };
        },

        render: function() {
            var modalLink = React.createElement(
                "a",
                { onClick: this.open },
                i18n.forgot_password_text
            );

            var thisModal = React.createElement(
                Modal,
                {
                    show: this.state.showModal,
                    onHide: this.close
                },
                React.createElement(
                    Modal.Header,
                    { closeButton: true },
                    React.createElement(Modal.Title, null, i18n.reset_your_password_text)
                ),
                React.createElement(
                    Modal.Body,
                    null,
                    React.createElement("p", null, i18n.fill_email_text),
                    React.createElement(Input, {
                        className: "form-control",
                        id: "id_email",
                        maxLength: "254",
                        name: "email",
                        placeholder: i18n.email_text,
                        required: true,
                        title: "",
                        type: "email"
                    })
                ),
                React.createElement(
                    Modal.Footer,
                    null,
                    React.createElement(Button, { onClick: this.close }, i18n.close_text),
                    React.createElement(
                        Button,
                        { onClick: this.resetPassword, bsStyle: "info" },
                        i18n.reset_password_text
                    )
                )
            );

            return (
                <span>
                    {modalLink}
                    {thisModal}
                </span>
            );
        }
    });

    // Initialise app
    ReactDOM.render(React.createElement(ResetModal), document.getElementById("reset-pw"));
}

var loadJS = function(url, implementationCode, location) {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement("script");
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactBootstrap() {
        var reactBootstrapSrc = document.getElementById("react-bootstrap").src;
        loadJS(reactBootstrapSrc, initReact, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById("react-dom").src;
        loadJS(reactDOMSrc, loadReactBootstrap, document.body);
    }

    console.log("No React, load again.");
    var reactSrc = document.getElementById("react").src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

document.addEventListener("DOMContentLoaded", function() {
    // Get translations
    i18n = JSON.parse(document.getElementById("reset-password-text").innerHTML);

    // Check if React is loaded
    if (
        typeof React !== "undefined" &&
        typeof ReactDOM !== "undefined" &&
        typeof ReactBootstrap !== "undefined"
    ) {
        initReact();
    } else {
        loadAndRenderReact();
    }
});
