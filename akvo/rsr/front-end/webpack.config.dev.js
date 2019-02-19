/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const merge = require("webpack-merge");
const { conf } = require("./webpack.config.base");

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

const plugins = [
    new MiniCssExtractPlugin({
        filename: "[name].css"
    })
];

module.exports = merge.smart(conf, {
    plugins,

    devtool: "source-map",

    output: {
        filename: "[name].js"
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
    }
});
