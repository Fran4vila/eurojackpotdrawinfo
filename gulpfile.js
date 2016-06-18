const gulp = require('gulp');

var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var gls = require('gulp-live-server');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var del = require('del');
var babel = require('gulp-babel');

// Build task to start with main HTML
gulp.task('build', function(){
	console.log('Building files');
	return gulp.src('*.html')
    .pipe(gulp.dest('dist'))
});
// Move JS file
gulp.task('jsfile', function(){
  return gulp.src('js/main.js')
  .pipe(babel({ presets: ['es2015'] }))   // Transpile to ES5
  .pipe(gulp.dest('dist/js'))
});
// Move Tools
gulp.task('tools', function(){
  return gulp.src('js/tools/*.js')
  .pipe(gulp.dest('dist/js/tools'))
});
// Move CSS Styles
gulp.task('styles', function(){
  return gulp.src('css/style.css')
	.pipe(cssnano())   // Minify CSS
  .pipe(gulp.dest('dist/css'))
});
// Optimize images task
gulp.task('images', function(){
  return gulp.src('css/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/css/images'))
});
//Move Data Json
gulp.task('data', function(){
  return gulp.src('data/info.json')
  .pipe(gulp.dest('dist/data'))
});
//Move Templates files
gulp.task('templates', function(){
  return gulp.src('templates/*.html')
  .pipe(gulp.dest('dist/templates'))
});
//Clean dist folder
gulp.task('clean', function() {
  return del.sync('dist');
})
//Create Server
gulp.task('serve', function() {
  	var server = gls.static('dist', 8888);
  	server.start();
	// Using gulp.watch to trigger server actions(notify, start or stop) 
	gulp.watch(['dist/css/*.css', 'dist/*.html'], function (file) {
		server.notify.apply(server, [file]);
	});
});
//Open Browser with server URL
gulp.task('open', function(){
	gulp.src(__filename)
	.pipe(open({uri: 'http://localhost:8888'}));
});
// Execute everything when typing only 'gulp'
gulp.task('default', function(callback) {
  runSequence('clean', ['build', 'jsfile', 'tools', 'styles', 'images', 'data', 'templates'], 'serve', 'open', callback);
});