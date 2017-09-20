/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// based on https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.s9m3fh1fa

var webpack = require("webpack");
var path = require("path");


module.exports = {
    entry: {
        app: './scripts-src/my-results/app.js',
        vendors: [
            // NOTE: babel-polyfill always needs to be loaded before react and redux
            // https://github.com/facebook/react/issues/8379#issuecomment-316346239
            'babel-polyfill', 'react', 'redux',
            'redux-logger', 'redux-thunk', 'reselect',
            'isomorphic-fetch',
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
