var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	runSequence = require('run-sequence');

var browsers = require('./bower_components/bootstrap/grunt/postcss.js'),
	runTimestamp = Math.round(Date.now()/1000);

// Compilar estilos
gulp.task('styles', function () {
	return gulp
		.src('assets/sass/style.scss')
		.pipe( sass().on('error', sass.logError) )
		.pipe( autoprefixer( browsers.autoprefixer.browsers ).on('error', sass.logError) )
		.pipe( gulp.dest('assets/css/') )
		.pipe( livereload() );
});

// Compilar íconos como fuente
gulp.task('iconfont', function () {
	var fontName = 'tomaderamos-icons';
	return gulp
		.src(['assets/img/icons/*.svg'])
		.pipe(
			iconfontCss({
				fontName : fontName,
				path : 'assets/sass/templates/_icons.scss',
				targetPath : '../sass/icons.scss',
				fontPath : '../font/'
			})
		)
		.pipe(
			iconfont({
				fontName : fontName,
				prependUnicode : false,
				formats : ['ttf', 'eot', 'woff'],
				timestamp : runTimestamp
			})
		)
		.on('glyphs', function (glyphs, options) {
			console.log( glyphs );
		})
		.pipe( gulp.dest('assets/font/') );
});

// Verificar errores en CSS
gulp.task('lint', function () {
	var stylelint = require('gulp-stylelint');
	return gulp
		.src('assets/css/*.css')
		.pipe(
			stylelint({
				configFile : 'stylelint.config.js',
				reporters : [{
					formatter : 'string',
					console : true
				}]
			})
		);
});

// Build estilos
gulp.task('build', function (callback) {
	runSequence('styles', 'lint', callback);
});

// Default
gulp.task('default', function () {
	livereload.listen();
	gulp.watch('*.html', function(event){
		var htmlvalidator = require('html-validator'),
			fs = require('fs');
		var options = {
			format: 'json'
		};
		return gulp
			.src(event.path)
			.pipe( livereload() );

	});
	gulp.watch('assets/sass/*.scss', ['build'] );
	gulp.watch('assets/img/icons/*.svg', ['iconfont'] );
});