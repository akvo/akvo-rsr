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
// var watchify = require('watchify');
var babelify = require('babelify');

var preset_react = require('babel-preset-react');
var preset_es2015 = require('babel-preset-es2015');

// TODO: Split my-new-results.jsx into multiple files each with one React component plus a main
// TODO: Set up watchify
gulp.task('build-results', function() {
    return browserify({
        debug: true,
        entries: '../../akvo/rsr/static/scripts-src/my-new-results.jsx',
        transform: [
            [babelify, {presets: [preset_react, preset_es2015]}]
        ]
    })
    .bundle()
    .pipe(source('my-new-results.js'))
    .pipe(gulp.dest('../../akvo/rsr/static/scripts-src/'));
});

gulp.task('build', ['build-results']);

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
