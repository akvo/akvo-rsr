/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// based on https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.s9m3fh1fa

var node = __dirname + '/../../../../npm/node_modules/';
var webpack = require(node + "webpack");
var path = require(node + "path");


module.exports = {
    entry: {
        app: "./app.js",
        vendors: [
            "isomorphic-fetch", "react", "redux", "redux-logger", "redux-thunk"
        ]
    },
    output: {
        filename: "../bundle.js"
    },
    devtool: '#inline-source-map',
    debug: true,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendors", "../vendors.bundle.js")
    ],
    resolveLoader: { root: node },
    module: {
        loaders: [
            {
                test: [/\.js$/, /\.es6$/, /\.jsx$/],
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [
                        require.resolve(node + 'babel-preset-es2015'),
                        require.resolve(node + 'babel-preset-react'),
                        require.resolve(node + 'babel-preset-stage-0')
                    ],
                    plugins: [
                        require.resolve(node + 'babel-plugin-transform-decorators-legacy')
                    ]
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        root: [
            path.resolve('./'),
            path.resolve(node)
        ],
        extensions: ['', '.js', '.es6', '.jsx']
    },
};
