var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var react      = require('react');

gulp.task('scripts', function() {
  gulp.src(['app/signup.js'])
    .pipe(browserify({
      debug: true,
      transform: ["reactify"],
    }))
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['scripts']);

