/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// FIXME: Lots of duplicated code from password-reset.jsx
function showDonatePopup(url) {

    if (this.donateComponent !== undefined) {
        this.donateComponent.open();
        return;
    }

    var Button = ReactBootstrap.Button;
    var Modal = ReactBootstrap.Modal;
    var Input = ReactBootstrap.Input;

    var DonateModal = React.createClass({

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

        render: function() {
            var thisModal = React.createElement(Modal, {
                show: this.state.showModal,
                onHide: this.close,
                url: this.props.url
            },
                React.createElement(Modal.Header, {closeButton: true},
                    React.createElement(Modal.Title, null, i18n.donate_heading)
                ),
                React.createElement(Modal.Body, null,
                    React.createElement('p', null, i18n.donate_summary)
                ),
                React.createElement(Modal.Footer, null,
                    React.createElement(Button, {onClick: this.close}, i18n.donate_confirm_cancel_text),
                    React.createElement(Button, {onClick: this.close},
                        React.createElement('a', {href: this.props.url, target: "_blank"}, i18n.donate_text)
                    )
                )
            );

            return (
                <div> {thisModal} </div>
            );
        }
    });

    // Initialise the dialog
    var body = document.getElementsByTagName('body')[0],
    donate_info = document.createElement('div');

    body.appendChild(donate_info);
    donate_info.setAttribute('id', 'donate-info');
    this.donateComponent = ReactDOM.render(React.createElement(DonateModal, {url: url}), donate_info);

    // Open the dialog
    this.donateComponent.open();
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    var data_element = document.getElementById("project-main-text") || document.getElementById("donate-text");
    i18n = JSON.parse(data_element.innerHTML);

    // Hack to make this name available to onClick in HTML.
    window.showDonatePopup = showDonatePopup;
});
