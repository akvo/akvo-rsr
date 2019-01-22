/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
//TODO: fix the actual env var!
const envIsProduction = process.env.NODE_ENV === "production";
console.log("NODE_ENV:" + process.env.NODE_ENV);

// MiniCssExtractPlugin emits an "empty" main.js. Fix by using this hack.
// See https://github.com/webpack/webpack/issues/7300#issuecomment-413959996
class MiniCssExtractPluginCleanup {
    constructor(deleteWhere = /main.js/) {
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

var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name]-[hash].css"
        }),
        new MiniCssExtractPluginCleanup(),
        new BundleTracker({ filename: "./webpack-stats.json" }),
        new CleanWebpackPlugin(["./dist/*.js", "./dist/*.map", "./dist/*.css"], {
            beforeEmit: true
        })
    ],
    devtool: "source-map",
    // replace with this line to get a quicker build but uglier source maps:
    // devtool: devMode? "cheap-eval-source-map": "source-map",

    // Skipping dev server for now. The issue I couldn't fix was the serving of images referred to
    // in main.scss using the url() directive :-( This is a limitation in webpack-bundle-tracker
    // devServer: {
    //     contentBase: "./dist",
    //     disableHostCheck: true,
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers": "*"
    //     },
    //     /*  TODO: enable hot reloading. This is a bit tricky, see
    //         https://webpack.js.org/guides/hot-module-replacement/
    //         and https://github.com/gaearon/react-hot-loader */
    //     // hotOnly: true,
    //     port: 3000
    // },
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
        updateDirectory: "./scripts-src/update-directory.jsx",
        projectMain: "./scripts-src/project-main/project-main.jsx",
        projectMainPartners: "./scripts-src/project-main/project-main-partners.jsx",
        projectMainReport: "./scripts-src/project-main/project-main-report.jsx"
    },
    output: {
        filename: "[name]-[hash].js",
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
