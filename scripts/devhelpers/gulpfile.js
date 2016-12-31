// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// Include Gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var react = require('gulp-react');
var sass = require('gulp-sass');

var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var notify = require('gulp-notify');
var gutil = require('gulp-util');

var preset_react = require('babel-preset-react');
var preset_es2015 = require('babel-preset-es2015');

// TODO: Split my-new-results.jsx into multiple files each with one React component plus a main

var development = true;

/* vendor bundling */

var vendors = {
    packages: [
        'react',
        'react-dom',
        'rc-collapse',
        'immutability-helper',
        'isomorphic-fetch',
        'es6-promise'
    ],
    dest: '../../akvo/rsr/static/scripts-src/'
};

gulp.task('vendors', function () {
    var stream = browserify({
        debug: development,
        require: vendors.packages
    });
    stream.bundle()
          .pipe(source('vendors.js'))
          .pipe(gulp.dest(vendors.dest));
    return stream;
});

/* my-new-result bundling */
// TODO: migrate to webpack?!? I don't understand how imports work in browserify :-p
var options = {
    debug: development,
    entries: [
        '../../akvo/rsr/static/scripts-src/my-results/App.jsx',
        '../../akvo/rsr/static/scripts-src/my-results/Level.jsx',
        '../../akvo/rsr/static/scripts-src/my-results/Comments.jsx',
        '../../akvo/rsr/static/scripts-src/my-results/Updates.jsx',
        '../../akvo/rsr/static/scripts-src/my-results/utils.js'
    ],
    transform: [
        [babelify, {presets: [preset_react, preset_es2015]}]
    ]
};

var opts = Object.assign(watchify.args, options);
var b = watchify(browserify(opts));

function bundle() {
    // based loosely on http://christianalfoni.github.io/javascript/2014/10/30/react-js-workflow-part2.html
    var start = new Date();
    console.log('Building result');
    vendors.packages.forEach(function(vendor) {
        b.external(vendor);
    });

    return b
        .bundle()
        .on('error', gutil.log)
        .pipe(source('my-new-results.js'))
        .pipe(gulp.dest('../../akvo/rsr/static/scripts-src/'))
        .pipe(notify(function () {
            console.log('Result bundle built in ' + (Date.now() - start) + 'ms');
        }));
}

gulp.task('results', bundle);
b.on('update', bundle);

/* legacy bundling */

gulp.task('lint', function() {
  return gulp.src('../../akvo/rsr/static/scripts-src/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jsx', function () {
  return gulp.src('../../akvo/rsr/static/scripts-src/**/*.jsx')
    .pipe(plumber())
    .pipe(react())
    .pipe(gulp.dest('../../akvo/rsr/static/scripts-src'));
});

gulp.task('sass', function() {
  return gulp.src('../../akvo/rsr/static/styles-src/**/*.scss')
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('../../akvo/rsr/static/styles-src'));
});

gulp.task('watch', function() {
    gulp.watch('../../akvo/rsr/static/styles-src/**/*.scss', ['sass']);
    gulp.watch('../../akvo/rsr/static/scripts-src/**/*.jsx', ['jsx']);
    gulp.watch('../../akvo/rsr/static/scripts-src/**/*.js', ['lint']);
});

// Default Task
gulp.task('default', ['sass', 'jsx']);
