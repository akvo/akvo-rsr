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


gulp.task('lint', function() {
  return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jsx', function () {
  return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.jsx')
    .pipe(plumber())
    .pipe(react())
    .pipe(gulp.dest('../../akvo/rsr/static/rsr/v3'));
});

gulp.task('sass', function() {
  return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.scss')
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('../../akvo/rsr/static/rsr/v3'));
});

gulp.task('watch', function() {
    gulp.watch('../../akvo/rsr/static/rsr/v3/css/**/*.scss', ['sass']);
    gulp.watch('../../akvo/rsr/static/rsr/v3/js/**/*.jsx', ['jsx']);
});

// Default Task
gulp.task('default', ['sass', 'jsx']);
