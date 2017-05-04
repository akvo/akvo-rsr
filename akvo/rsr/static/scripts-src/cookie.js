/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18nCookie,
    dropCookie,
    cookieDuration,
    cookieName,
    cookieValue,
    protectCookieDuration,
    protectCookieName,
    protectPassword,
    testEnvironments;


function createDiv() {
    var cookie_text = i18nCookie.cookie_text;
    var policy_text = i18nCookie.privacy_text;
    var button_text = i18nCookie.button_text;

    var bodytag = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.setAttribute('id','cookie-law');
    div.innerHTML = '<p>' + cookie_text + '<a href="http://akvo.org/help/akvo-policies-and-terms-2/akvo-terms-of-use/cookie-policy/" rel="nofollow" title="Privacy &amp; Cookies Policy" target="_blank">' + policy_text + '</a>.    <a class="close-cookie-banner btn btn-primary" href="javascript:void(0);" onclick="window.removeMe();"><span>' + button_text + '</span></a></p>';
    bodytag.insertBefore(div,bodytag.firstChild); // Adds the Cookie Law Banner just after the opening <body> tag
    document.getElementsByTagName('body')[0].className+=' cookiebanner'; //Adds a class to the <body> tag when the banner is visible
    createCookie(cookieName, cookieValue, cookieDuration); // Create the cookie
}


function createModal(){
    var Modal = ReactBootstrap.Modal;
    var Button = ReactBootstrap.Button;

    var CookieModal = React.createClass({displayName: 'CookieModal',
        getInitialState: function() {
            return {
                showModal: true,
                passwordField: '',
                showError: false
            };
        },

        close: function() {
            this.setState({
                showModal: false
            });
        },

        createProtectionCookie: function() {
            createCookie(protectCookieName, cookieValue, protectCookieDuration);
        },

        checkPassword: function() {
            this.setState({showError: false});

            if (this.state.passwordField === protectPassword) {
                this.createProtectionCookie();
                this.close();
            } else {
                this.setState({showError: true});
            }
        },

        handleChange: function(event) {
            this.setState({passwordField: event.target.value});
        },

        render: function() {
            var errorNode,
                formGroupClass = 'form-group';

            if (this.state.showError) {
                errorNode = React.createElement(
                    'span',
                    {
                        className: 'help-block-error'
                    },
                    i18nCookie.incorrect_password
                );
                formGroupClass += ' has-error';
            } else {
                errorNode = React.createElement('span');
            }

            return (
                React.createElement(
                    Modal, {
                        autoFocus: true,
                        backdrop: 'static',
                        bsSize: 'large',
                        keyboard: false,
                        show: this.state.showModal,
                        onHide: this.close
                    },
                    React.createElement(
                        Modal.Header,
                        {
                            closeButton: false
                        },
                        React.createElement(
                            Modal.Title,
                            null,
                            i18nCookie.password_environment
                        )
                    ),
                    React.createElement(
                        Modal.Body,
                        null,
                        i18nCookie.password_environment_desc,
                        React.createElement('br'),
                        React.createElement('br'),
                        React.createElement(
                            'div',
                            {
                                className: formGroupClass
                            },
                            React.createElement(
                                'input',
                                {
                                    type: "password",
                                    value: this.state.passwordField,
                                    onChange: this.handleChange,
                                    className: 'form-control'
                                }
                            )
                        ),
                        errorNode,
                        React.createElement('br'),
                        i18nCookie.password_environment_avail
                    ),
                    React.createElement(
                        Modal.Footer,
                        null,
                        React.createElement(
                            Button,
                            {
                                onClick: this.checkPassword,
                                bsStyle: "success"
                            },
                            i18nCookie.continue_to_rsr
                        )
                    )
                )
            ) ;
        }
    });

    ReactDOM.render(
        React.createElement(CookieModal), document.getElementById('cookieModal')
    );
}


function createCookie(name,value,days) {
    var date, expires = "";
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    if(dropCookie) {
        document.cookie = name+"="+value+expires+"; path=/";
    }
}

function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function removeMe(){
	var element = document.getElementById('cookie-law');
	element.parentNode.removeChild(element);
}
window.removeMe = removeMe;

var loadJS = function(url, implementationCode, location){
    // url is URL of external file, implementationCode is the code to be called from the file,
    // location is the location to insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactBootstrap() {
        var reactBootstrapSrc = document.getElementById('react-bootstrap').src;
        loadJS(reactBootstrapSrc, createModal, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadReactBootstrap, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

function loadReactForModal() {
    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactBootstrap !== 'undefined') {
        // Render React components
        createModal();
    } else {
        loadAndRenderReact();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load global settings
    i18nCookie = JSON.parse(document.getElementById("cookie-text").innerHTML);    // Translation strings
    dropCookie = true;                      // false disables the Cookie, allowing you to style the banner
    cookieDuration = 14;                    // Number of days before the cookie expires, and the banner reappears
    cookieName = 'complianceCookie';        // Name of our cookie
    cookieValue = 'on';                     // Value of cookie
    protectCookieDuration = 7;              // Number of days before the protection cookie expires, and the modal reappears
    protectCookieName = 'protectCookie';    // Name of our protection cookie
    protectPassword = 'TesTing!';           // No need to encrypt this password, it's not vital
    testEnvironments = ['test', 'uat'];     // Set the test environments that need a password

    // Check for a protection cookie on Test or UAT
    if (checkCookie(protectCookieName)!== cookieValue) {
        var hostnameArray = window.location.hostname.split(".");
        for (var i = 0; i < testEnvironments.length; i++) {
            if (hostnameArray.indexOf(testEnvironments[i]) > -1) {
                loadReactForModal();
                break;
            }
        }
    }

    // Check for general cookie
    if (checkCookie(cookieName) !== cookieValue) {
        createDiv();
    }
});
