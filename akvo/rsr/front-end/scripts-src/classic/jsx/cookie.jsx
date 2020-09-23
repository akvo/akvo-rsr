// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18nCookie,
    dropCookie,
    cookieDuration,
    cookieName,
    cookieValue;

function createDiv() {
    var cookie_text = i18nCookie.cookie_text;
    var policy_text = i18nCookie.privacy_text;
    var button_text = i18nCookie.button_text;

    var bodytag = document.getElementsByTagName("body")[0];
    var div = document.createElement("div");
    div.setAttribute("id", "cookie-law");
    div.innerHTML =
        "<p>" +
        cookie_text +
        '<a href="http://akvo.org/help/akvo-policies-and-terms-2/akvo-terms-of-use/cookie-policy/" rel="nofollow" title="Privacy &amp; Cookies Policy" target="_blank">' +
        policy_text +
        '</a>.    <a class="close-cookie-banner btn btn-primary" href="javascript:void(0);" onclick="window.removeMe();"><span>' +
        button_text +
        "</span></a></p>";
    bodytag.insertBefore(div, bodytag.firstChild); // Adds the Cookie Law Banner just after the opening <body> tag
    document.getElementsByTagName("body")[0].className += " cookiebanner"; //Adds a class to the <body> tag when the banner is visible
    Cookies.set(cookieName, cookieValue, { expires: cookieDuration }); // Create the cookie
}

function removeMe() {
    var element = document.getElementById("cookie-law");
    element.parentNode.removeChild(element);
}
window.removeMe = removeMe;

document.addEventListener("DOMContentLoaded", function() {
    // Load global settings
    i18nCookie = JSON.parse(document.getElementById("cookie-text").innerHTML); // Translation strings
    dropCookie = true; // false disables the Cookie, allowing you to style the banner
    cookieDuration = 14; // Number of days before the cookie expires, and the banner reappears
    cookieName = "complianceCookie"; // Name of our cookie
    cookieValue = "on"; // Value of cookie

    // Check for general cookie
    if (Cookies.get(cookieName) !== cookieValue) {
        createDiv();
    }
});
