const gulp = require('gulp');

// var gulpIf = require('gulp-if');
// var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var gls = require('gulp-live-server');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var del = require('del');
var babel = require('gulp-babel');

//Build task concatenate external tool, minify JS and CSS
gulp.task('build', function(){
	console.log('Building files');
	return gulp.src('*.html')
		  // Minify JS
    	// .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

//Move JS file
gulp.task('jsfile', function(){
  return gulp.src('js/main.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest('dist/js'))
});
gulp.task('tools', function(){
  return gulp.src('js/tools/*.js')
  .pipe(gulp.dest('dist/js/tools'))
});
//Move CSS Styles
gulp.task('styles', function(){
  return gulp.src('css/style.css')
	// Minify CSS
  .pipe(cssnano())
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

gulp.task('default', function(callback) {
  runSequence('clean', ['build', 'jsfile', 'tools', 'styles', 'images', 'data', 'templates'], 'serve', 'open', callback);
});