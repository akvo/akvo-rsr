/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

const BundleTracker = require("webpack-bundle-tracker");
const path = require("path");

// MiniCssExtractPlugin emits an "empty" main.js. Fix by using this hack.
// See https://github.com/webpack/webpack/issues/7300#issuecomment-413959996
class MiniCssExtractPluginCleanup {
    constructor(deleteWhere = /main.js|akvoWordpress.js|noUiSliderCss.js|datePicker.js|admin.js|widget.js/) {
        this.shouldDelete = new RegExp(deleteWhere);
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
            Object.keys(compilation.assets).forEach(asset => {
                if (this.shouldDelete.test(asset)) {
                    delete compilation.assets[asset];
                }
            });
            callback();
        });
    }
}

const entry = {
    // "New React"
    results: "./scripts-src/my-results/app.js",
    userProjects: "./scripts-src/user-projects-access/app.js",
    vendors: [
        // NOTE: babel-polyfill always needs to be loaded before react and redux
        // https://github.com/facebook/react/issues/8379#issuecomment-316346239
        "babel-polyfill",
        "react",
        "redux",
        "redux-logger",
        "redux-thunk",
        "reselect",
        "isomorphic-fetch"
    ],

    // Sass
    main: "./styles-src/main.scss",

    // Css
    akvoWordpress: "./styles-src/akvo-wordpress.css",
    noUiSliderCss: "./lib/styles/nouislider-8.0.2.min.css",
    datePicker: "./lib/styles/react-datepicker-0.27.0.css",
    admin: [
        "./styles-src/admin/akvo_admin.css",
        "./styles-src/admin/budget_item.css"
    ],
    widget: [
        "./styles-src/widgets/projectList.css",
        "./styles-src/widgets/rsrWidgets.css",
        "./styles-src/widgets/w170px.css",
        "./styles-src/widgets/w170pxSmall.css",
        "./styles-src/widgets/w202px.css",
        "./styles-src/widgets/w468px.css",
    ],

    // "Classic RSR"
    micromarkdown: "./lib/scripts/micromarkdown-0.3.4.js",
    myChangePassword: "./scripts-src/classic/js/my-change-password.js",
    myDetails: "./scripts-src/classic/js/my-details.js",
    myProjects: "./scripts-src/classic/js/my-projects.js",
    myUpdates: "./scripts-src/classic/js/my-updates.js",
    noUiSlider: "./lib/scripts/nouislider-8.0.2.min.js",
    onClickOutside: "./lib/scripts/react-onclickoutside.js",
    polyfill: "./scripts-src/classic/js/polyfill.js",
    projectHierarchy: "./scripts-src/classic/js/project-hierarchy.js",
    reactTypeahead: "./lib/scripts/react-typeahead.js",
    rsrUtils: "./scripts-src/classic/js/rsr-utils.js",
    smoothScroll: "./lib/scripts/smooth-scroll-9.1.4.min.js",

    cookie: "./scripts-src/classic/jsx/cookie.jsx",
    directoryUtils: "./scripts-src/classic/jsx/directory-utils.jsx",
    donatePopup: "./scripts-src/classic/jsx/donate-popup.jsx",
    morePartners: "./scripts-src/classic/jsx/more-partners.jsx",
    myDetailsEmployments: "./scripts-src/classic/jsx/my-details-employments.jsx",
    myIati: "./scripts-src/classic/jsx/my-iati.jsx",
    myReports: "./scripts-src/classic/jsx/my-reports.jsx",
    myUserManagement: "./scripts-src/classic/jsx/my-user-management.jsx",
    organisationDirectory: "./scripts-src/classic/jsx/organisation-directory.jsx",
    passwordReset: "./scripts-src/classic/jsx/password-reset.jsx",
    projectDirectory: "./scripts-src/classic/jsx/project-directory.jsx",
    projectDirectoryTypeahead: "./scripts-src/classic/jsx/project-directory-typeahead.jsx",
    projectEditor: "./scripts-src/classic/jsx/project-editor.jsx",
    projectMain: "./scripts-src/project-main/project-main.jsx",
    projectMainPartners: "./scripts-src/project-main/project-main-partners.jsx",
    projectMainReport: "./scripts-src/project-main/project-main-report.jsx",
    updateDirectory: "./scripts-src/classic/jsx/update-directory.jsx"
};

const plugins = [
    new MiniCssExtractPluginCleanup(),
    new BundleTracker({ filename: "./static/webpack-stats.json" })
];

module.exports = {
    conf: {
        plugins,

        entry,

        output: {
            filename: "[name].[hash].js",
            path: path.resolve(__dirname, "static/rsr/dist")
        },

        resolve: {
            extensions: [".js", ".jsx", ".css", ".scss"]
        }
    }
};
