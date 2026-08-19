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
    constructor(deleteWhere = /main.js|akvoWordpress.js|datePicker.js|admin.js|widget.js/) {
        this.shouldDelete = new RegExp(deleteWhere);
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
            Object.keys(compilation.assets).forEach(asset => {
                if (this.shouldDelete.test(asset)) {
                    delete compilation.assets[asset];
                }
            });
            // Remove the ignored files from the chunks as well
            // Necessary to make https://github.com/django-webpack/django-webpack-loader work
            // Otherwise it tries to find chunk not present in the assets
            for(let chunkGroup of compilation.chunkGroups){
                for(let chunk of chunkGroup.chunks){
                    console.log("files", chunk.files);
                    chunk.files = chunk.files.filter(value => !this.shouldDelete.test(value));
                }
            }
            callback();
        });
    }
}

const entry = {
    // Sass
    main: "./styles-src/main.scss",

    // Css
    akvoWordpress: "./styles-src/akvo-wordpress.css",
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
    onClickOutside: "./lib/scripts/react-onclickoutside.js",
    polyfill: "./scripts-src/classic/js/polyfill.js",
    projectHierarchy: "./scripts-src/classic/js/project-hierarchy.js",
    reactTypeahead: "./lib/scripts/react-typeahead.js",
    rsrUtils: "./scripts-src/classic/js/rsr-utils.js",

    cookie: "./scripts-src/classic/jsx/cookie.jsx",
    directoryUtils: "./scripts-src/classic/jsx/directory-utils.jsx",
    organisationDirectory: "./scripts-src/classic/jsx/organisation-directory.jsx",
    passwordReset: "./scripts-src/classic/jsx/password-reset.jsx",
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
