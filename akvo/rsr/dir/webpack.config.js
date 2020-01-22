const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = () => {
  const env = {
    LOCALDEV: true
  }
  // Object.keys(process.env).forEach(key => { env[key] = JSON.stringify(process.env[key]) })
  return {
    stats: {
      maxModules: 0
    },
    mode: 'development',
    devtool: 'source-map',

    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:8081',
      'webpack/hot/only-dev-server',
      './main.js',
      './styles/main.scss',
    ],

    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '',
    },

    context: resolve(__dirname, 'app'),

    devServer: {
      host: '0.0.0.0',
      port: 8081,
      disableHostCheck: true,
      hot: true,
      contentBase: resolve(__dirname, 'build'),
      historyApiFallback: true,
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.jsx?$/,
          loaders: [
            'babel-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(css|scss)$/,
          use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'sass-loader',
                query: {
                  sourceMap: true,
                },
              },
            ],
            publicPath: '../'
          })),
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'image/png',
                name: 'images/[name].[ext]',
              }
            }
          ],
        },
        {
          test: /\.eot(\?v=\d+.\d+.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          ],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'application/font-woff',
                name: 'fonts/[name].[ext]',
              }
            }
          ],
        },
        {
          test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'application/octet-stream',
                name: 'fonts/[name].[ext]',
              }
            }
          ],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'raw-loader'
            }
          ],
        },
      ]
    },

    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.LoaderOptionsPlugin({
        test: /\.jsx?$/,
        options: {
          eslint: {
            configFile: resolve(__dirname, '.eslintrc'),
            cache: false,
          }
        },
      }),
      // new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({env}),
    ]
  }
}

module.exports = config
