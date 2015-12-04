var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var react      = require('react');
var uglify     = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp.src('app/*.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('default', ['scripts']);
