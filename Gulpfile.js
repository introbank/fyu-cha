var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var react      = require('react');
var uglify     = require('gulp-uglify');
var print      = require('gulp-print');

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

gulp.task('js', function() {
  gulp.src('app/*.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('watch', function() {
  gulp.watch('./components/*.js', ['js']);
})
