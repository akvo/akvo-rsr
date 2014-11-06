// Include Gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var react = require('gulp-react');
var sass = require('gulp-sass');

gulp.task('lint', function() {
    return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jsx', function () {
    return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('../../akvo/rsr/static/rsr/v3'));
});

gulp.task('sass', function() {
    return gulp.src('../../akvo/rsr/static/rsr/v3/**/*.scss')
          .pipe(sass())
          .pipe(gulp.dest('../../akvo/rsr/static/rsr/v3'));
});


// Default Task
gulp.task('default', ['sass', 'jsx']);
