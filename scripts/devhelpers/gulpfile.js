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

var jsfiles = [
    '../../akvo/rsr/static/scripts-src/**/*.js',
    // excluded files
    '!../../akvo/rsr/static/scripts-src/**/bundle.js',
    '!../../akvo/rsr/static/scripts-src/**/vendors.js',
    '!../../akvo/rsr/static/scripts-src/**/vendors.bundle.js',
    // Ignored since webpack is used to build this code, and linting these files
    // here doesn't really help the developers while working on this code.
    '!../../akvo/rsr/static/scripts-src/**/app.js',
    '!../../akvo/rsr/static/scripts-src/my-results/**/*.js',
];

gulp.task('lint', function() {
  return gulp.src(jsfiles)
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
    gulp.watch(jsfiles, ['lint']);
});

// Default Task
gulp.task('default', ['sass', 'jsx']);
