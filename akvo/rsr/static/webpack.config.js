/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// MiniCssExtractPlugin emits an "empty" main.js. Fix by using this hack.
// See https://github.com/webpack/webpack/issues/7300#issuecomment-413959996
class MiniCssExtractPluginCleanup {
  constructor(deleteWhere = /main.js/) {
    this.shouldDelete = new RegExp(deleteWhere)
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
      Object.keys(compilation.assets).forEach((asset) => {
        if (this.shouldDelete.test(asset)) {
          delete compilation.assets[asset]
        }
      });
      callback()
    })
  }
}

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new MiniCssExtractPluginCleanup()
    ],
    devtool: "source-map",
    entry: {
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

        // "Old React"
        cookie: "./scripts-src/cookie.jsx",
        directoryUtils: "./scripts-src/directory-utils.jsx",
        donatePopup: "./scripts-src/donate-popup.jsx",
        morePartners: "./scripts-src/more-partners.jsx",
        myDetailsEmployments: "./scripts-src/my-details-employments.jsx",
        myIati: "./scripts-src/my-iati.jsx",
        myReports: "./scripts-src/my-reports.jsx",
        myUserManagement: "./scripts-src/my-user-management.jsx",
        organisationDirectory: "./scripts-src/organisation-directory.jsx",
        passwordReset: "./scripts-src/password-reset.jsx",
        projectDirectory: "./scripts-src/project-directory.jsx",
        projectDirectoryTypeahead: "./scripts-src/project-directory-typeahead.jsx",
        projectEditor: "./scripts-src/project-editor.jsx",
        updateDirectory: "./scripts-src/update-directory.jsx"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: "babel-loader"
            },
            {
                test: /\.(scss|css)$/,
                exclude: [/node_modules/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".css", ".scss"]
    }
};
