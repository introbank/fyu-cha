var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var react      = require('react');

gulp.task('scripts', function() {
  gulp.src('app/*.js')
    .pipe(browserify({
      debug: true,
      transform: ["reactify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('default', ['scripts']);
