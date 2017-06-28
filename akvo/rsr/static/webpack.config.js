/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// based on https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.s9m3fh1fa

// var node = __dirname + '/../../../../npm/node_modules/';
var webpack = require("webpack");
var path = require("path");


module.exports = {
    entry: {
        app: './scripts-src/my-results/app.js',
        vendors: [
            "isomorphic-fetch", "react", "redux", "redux-logger", "redux-thunk", "reselect"
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: '#inline-source-map',
    debug: true,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            "vendors",
            "./vendors.bundle.js"
        ),
        new webpack.optimize.UglifyJsPlugin(
            { comments: false, compress: false, mangle: false, beautify: true }
        )
    ],
    // resolveLoader: { root: node },
    module: {
        loaders: [
            {
                test: [/\.js$/, /\.jsx$/],
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [
                        "env",
                        'babel-preset-stage-0',
                    ],
                    plugins: [
                        'babel-plugin-transform-decorators-legacy'
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
            // path.resolve(node)
        ],
        extensions: ['', '.js', '.es6', '.jsx']
    },
};





// var path = require('path');
// var webpack = require('webpack');
//
// module.exports = {
//     resolve: {
//         root: [
//             path.resolve('./'),
//         ],
//         extensions: ['', '.js', '.es6', '.jsx']
//     },
//     entry: [
//         'react-hot-loader/patch',
//         // activate HMR for React
//
//         'webpack-dev-server/client?http://localhost:3000',
//         // bundle the client for webpack-dev-server
//         // and connect to the provided endpoint
//
//         'webpack/hot/only-dev-server',
//         // bundle the client for hot reloading
//         // only- means to only hot reload for successful updates
//
//         // path.resolve(__dirname, './scripts-src/my-results/app.js'),
//         // path.resolve(__dirname, './scripts-src/my-results/app.js'),
//         './scripts-src/my-results/app.js',
//         // the entry point of our app
//     ],
//
//     output: {
//         filename: 'bundle.js',
//         // the output bundle
//
//         path: path.resolve(__dirname, 'dist'),
//
//         publicPath: '/static/'
//         // necessary for HMR to know where to load the hot update chunks
//     },
//
//     devtool: 'inline-source-map',
//
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 include: [path.resolve(__dirname, 'scripts-src/my-results/')],
//                 exclude: /node_modules/,
//                 use: [
//                     'babel-loader',
//                 ],
//             },
//         ],
//     },
//
//     plugins: [
//         new webpack.HotModuleReplacementPlugin(),
//         // enable HMR globally
//
//         new webpack.NamedModulesPlugin(),
//         // prints more readable module names in the browser console on HMR updates
//
//         new webpack.NoEmitOnErrorsPlugin(),
//         // do not emit compiled assets that include errors
//     ],
//
//     devServer: {
//         host: 'localhost',
//         port: 3000,
//
//         historyApiFallback: true,
//         // respond to 404s with index.html
//
//         hot: true,
//         // enable HMR on the server
//     },
//     resolve: {
//         root: [
//             path.resolve('./scripts-src/my-results/'),
//         ],
//         extensions: ['', '.js', '.es6', '.jsx']
//     },
// };


// var path = require('path');
// var webpack = require('webpack');
//
// module.exports = {
//     entry: [
//         'react-hot-loader/patch',
//         'webpack-dev-server/client?http://localhost:9876',
//         'webpack/hot/only-dev-server',
//         './scripts-src/my-results/app_test.js',
//     ],
//     output: {
//         filename: "bundle.js",
//         path: path.resolve(__dirname, 'dist'),
//         publicPath: '/'
//     },
//     module:{
//         rules:[{
//             test: /\.(js|jsx)$/,
//             include:[path.resolve(__dirname, 'scripts-src/my-results')],
//             exclude: [path.resolve(__dirname,"node_modules")],
//             loader: "babel-loader"
//         }]
//     },
//     devtool: "source-map",
//     devServer: {
//         hot: true,
//         contentBase: path.resolve(__dirname, 'dist'),
//         publicPath: '/',
//         port:9876
//     },
//     plugins: [
//         new webpack.HotModuleReplacementPlugin(),
//         new webpack.NamedModulesPlugin(),
//     ],
// };
