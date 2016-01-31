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
});

gulp.task('build:top', function() {
  gulp.src('app/top.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('build:artist', function() {
  gulp.src('app/artist.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('build:group', function() {
  gulp.src('app/group.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('build:signup', function() {
  gulp.src('app/signup.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('build:howto', function() {
  gulp.src('app/howto.js')
    .pipe(browserify({
      debug: true,
      transform: ["babelify"],
    }))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(print(function(filepath) {
      return "built: " + filepath;
    }));
});

gulp.task('watch:top', function() {
  gulp.watch('./components/*.js', ['build:top']);
});

gulp.task('watch:artist', function() {
  gulp.watch('./components/*.js', ['build:artist']);
});

gulp.task('watch:group', function() {
  gulp.watch('./components/*.js', ['build:group']);
});

gulp.task('watch:signup', function() {
  gulp.watch('./components/*.js', ['build:signup']);
});

gulp.task('watch:howto', function() {
  gulp.watch('./components/*.js', ['build:howto']);
});
