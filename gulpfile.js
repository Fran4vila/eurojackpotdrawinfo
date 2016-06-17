var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');

function bundle() {
  return bundler
    .bundle()
    .pipe(source('JS/Applications/main.js'))
    .pipe(gulp.dest('./'))
}

gulp.task('build', function() {
  bundle()
});
gulp.task('serve', function(done) {
  gulp.src('')
    .pipe(server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          cb(true)
        }
      },
      open: true
    }));
});
gulp.task('default', ['build', 'serve']);