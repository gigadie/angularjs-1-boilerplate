var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var del = require('del');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var	source = require('vinyl-source-stream');
var	gutil = require('gulp-util');
var	buffer = require('vinyl-buffer');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var template = require('gulp-template');
var argv = require('yargs').argv;
var replace = require('gulp-replace-task');

// Config
var now = new Date();
var config = {
	buildLabel: '' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds(),
	buildMode: null,
	version: process.env.BUILD_NUMBER || 'dev'
};

// Karma Server instance
var KarmaServer = require('karma').Server;

/*****************************TASKS********************************/
/**************************COMMON TASKS****************************/
// Config DEV
gulp.task('config:dev', function() {
	config.buildMode = 'dev';
});

// Config PROD
gulp.task('config:prod', function() {
	config.buildMode = 'prod';
});

// Clean CSS
gulp.task('clean:css', function() {
	return del([
		'./dist/css/**/*',
		'./dist/fonts/**/*'
	]);
});

// Clean JS
gulp.task('clean:js', function() {
	return del([
		'./dist/js/**/*'
	]);
});

// Clean Everything
gulp.task('clean', ['clean:js', 'clean:css'], function() {
	return true;
});

gulp.task('copy:res', function() {
	gulp.src(['./img/**/*'], {
		base: './img/'
	}).pipe(gulp.dest('./dist/img/'));

	gulp.src(['./favicon.ico'], {
		base: './'
	}).pipe(gulp.dest('./dist/'));

	// We can copy the font files into the dist folder, otherwise we could use the CDN
	// and override the variable $fa-font-path: "//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts" !default;
	// Copy font files
	return gulp.src(['./node_modules/font-awesome/fonts/**/*'], {
		base: './node_modules/font-awesome/fonts/'
	}).pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('compile:css', function() {
	// myAccount.scss should have: @import "../node_modules/font-awesome/scss/font-awesome.scss";
	// compiling the style
	return gulp.src('./style/main.scss')
		// The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
		.pipe(sass({
			onError: function(e) {
				console.log(e);
				gutil.log(e);
			}
		}))
		// Optionally add autoprefixer
		.pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
		.pipe(rename('style.css'))
		.pipe(gulpif(config.buildMode === 'prod', minifyCSS()))
		.pipe(gulp.dest('./dist/style/'));
});

gulp.task('build:style', function() {
	runSequence(['copy:res', 'compile:css']);
});

// create module for templates
gulp.task('create:templates', function() {
	gulp.src('./js/src/**/*.html')
		.pipe(templateCache({
			transformUrl: function(url) {
				return './js/' + url;
			}
		}))
		.pipe(gulp.dest('./js/src/templates'));
});

// JSHint task
gulp.task('lint:js', function() {
	return gulp.src(['./js/src/**/*.js', '!./js/src/templates/**/*.js'])
		.pipe(jshint())
		// You can look into pretty reporters as well, but that's another story
		.pipe(jshint.reporter('default'));
});

gulp.task('build:indexfile', function() {
	return gulp.src('./index.html')
		// And put it in the dist folder
		.pipe(template({
			version: config.version,
			buildLabel: config.buildLabel
		}))
		// .pipe(preprocess({
		// 	context: {
		// 		ENV: 'prod',
		// 		DEBUG: true
		// 	}
		// }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build:del:tempfiles', function() {
	// to clean temp files
});

// build for development
gulp.task('build:dev', function() {
	runSequence(
		['clean', 'config:dev'],
		['build:style', 'lint:js'],
		['build:angular', 'build:indexfile'],
		['build:del:tempfiles']
	);
});

//  build for production
gulp.task('build:prod', function() {
	runSequence(
		['clean', 'config:prod'],
		['build:style', 'lint:js'],
		['build:angular', 'build:indexfile'],
		['build:del:tempfiles']
	);
});

// watchers
gulp.task('watch', ['build:dev'], function() {
	// JS watcher
	gulp.watch([
		'./index.html',
		'./js/src/**/*.html',
		'./js/src/**/*.js'
	], [
		'lint:js',
		'build:angular:connect'
	]);

	// SCSS watcher
	gulp.watch([
		'./style/**/*.scss'
	], ['compile:css']);
});

/*************************APP*************************/

gulp.task('build:js', ['create:templates'], function() {
	console.log('AngJS build version: ' + config.buildMode);

	// set up the browserify instance on a task basis
	var b = browserify({
		entries: './js/src/main.js',
		debug: true
	});

	return b.bundle()
		.pipe(source('angularjs.all.js'))
		.pipe(buffer())
		// .pipe(cachebust.resources())
		.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
			// only if in production UGLIFY
			.pipe(gulpif(config.buildMode === 'prod', uglify()))
			.on('error', function(error) {
				console.log(error);
				gutil.log(error);
			})
		.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('build:angular', function() {
	runSequence(
		['build:js']
	);
});

// Test task, single run and exit
gulp.task('test', function(done) {
	del(['./coverage']);

	new KarmaServer({
		configFile: __dirname + '/karma.conf.unit.js',
		singleRun: true
	}, done).start();
});

// Test task, continuous testing
gulp.task('tdd', function(done) {
	del(['./coverage']);

	new KarmaServer({
		configFile: __dirname + '/karma.conf.unit.js'
	}, done).start();
});

// Run unit tests in Chrome and enable debug mode
gulp.task('test:debug', function(done) {
	del(['./coverage']);

	new KarmaServer({
		configFile: __dirname + '/karma.conf.unit.debug.js'
	}, done).start();
});


// Generators

// Component Generation -- Template in Base -- Will abstract to gulp plugin
// to use: gulp g:component --name <insert name here>
gulp.task('g:component', function(){
	// Gets structure from base

	// Copy base template file
	gulp.src('./base/**/*.html')
		.pipe(rename(argv.name+'.template.html'))
		.pipe(gulp.dest('./js/src/'+argv.name+'/'));

	// Copy component and rename 
	gulp.src('./base/**/base.component.js')
		.pipe(replace({
	      patterns: [
	        {
	          match: /base/g,
		      replacement: function () {
		        return argv.name;
		      }
	        },
	        {
	          match: /Base/g,
		      replacement: function () {
		        return argv.name.charAt(0).toUpperCase() + argv.name.slice(1);
		      }
	        }
	      ]
	    }))
		.pipe(rename(argv.name+'.component.js'))
		.pipe(gulp.dest('./js/src/'+argv.name+'/'));

	// Copy module and rename
	gulp.src('./base/**/module.js')
		.pipe(replace({
		      patterns: [
		        {
		          match: /base/g,
			      replacement: function () {
			        return argv.name;
			      }
		        },
		        {
		          match: /Base/g,
			      replacement: function () {
			        return argv.name.charAt(0).toUpperCase() + argv.name.slice(1);
			      }
		        }
		      ]
		    }))
		.pipe(gulp.dest('./js/src/'+argv.name+'/'));

		console.log(argv.name+' component created');

})