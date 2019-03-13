/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const merge = require("webpack-merge");
const { conf, entryGroups } = require("./webpack.config.base");

const plugins = [
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
    }),
    new CleanWebpackPlugin([
        "./static/rsr/dist/*.js",
        "./static/rsr/dist/*.map",
        "./static/rsr/dist/*.css"
    ])
];

module.exports = merge.smart(conf, {
    plugins,

    devtool: "source-map",

    output: {
        filename: "[name].[contenthash].js"
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
                            sourceMap: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            }
        ]
    }
});
