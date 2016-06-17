// Gulp utils
var gulp = require('gulp-help')(require('gulp'));
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var spawn = require('child_process').spawn;
var plumber = require('gulp-plumber');
var sequence = require('run-sequence');
var parallel = require('concurrent-transform');
var os = require('os');

// Include Our Plugins
var bs = require('browser-sync');
var reload = bs.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var resize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');

// Deployment debugging
log(c.yellow('Detected environment: ' + (process.env.NODE_ENV || 'local')));


// -----------------------------------------------------------------------------
// Help
//
// Shows a command listing when `gulp` is run without args.
// -----------------------------------------------------------------------------
gulp.task('default', false, ['help']);


// -----------------------------------------------------------------------------
// Jekyll
// -----------------------------------------------------------------------------
gulp.task('jekyll', 'Compiles Jekyll site in dev mode.', function() {
  bs.notify('Jekyll building...');
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml', '--drafts', '--incremental'], {stdio: 'inherit'})
    .on('close', reload);
});

// Add a second task for deploying
gulp.task('jekyll-deploy', 'Compiles Jekyll site for deployment.', function(cb) {
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml'], {stdio: 'inherit'})
    .on('close', cb);
});


// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------
gulp.task('sass', 'Compiles Sass:', ['sass-main', 'sass-fonts']);

gulp.task('sass-main', false, function () {
  bs.notify('sass-main compiling...');

  return gulp.src('_sass/styles.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'nested',
      onSuccess: function(css) {
        var dest = css.stats.entry.split('/');
        log(c.green('sass-main'), 'compiled to', dest[dest.length - 1]);
      },
      onError: function(err, res) {
        bs.notify('<span style="color: red">sass-main failed</span>');
        log(c.red('sass-main failed to compile'));
        log(c.red('> ') + err.file.split('/')[err.file.split('/').length - 1] + ' ' + c.underline('line ' + err.line) + ': ' + err.message);
      }
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(cssnano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(gulp.dest('_includes')) // for the Jekyll include
    .pipe(reload({stream: true}));
});

gulp.task('sass-fonts', false, function () {
  bs.notify('sass-fonts compiling...');

  return gulp.src('_sass/fonts.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'nested',
      onSuccess: function(css) {
        var dest = css.stats.entry.split('/');
        log(c.green('sass-fonts'), 'compiled to', dest[dest.length - 1]);
      },
      onError: function(err, res) {
        bs.notify('<span style="color: red">sass-fonts failed</span>');
        log(c.red('sass-fonts failed to compile'));
        log(c.red('> ') + err.file.split('/')[err.file.split('/').length - 1] + ' ' + c.underline('line ' + err.line) + ': ' + err.message);
      }
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(rename('fonts.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Combine/minify JS
// -----------------------------------------------------------------------------
gulp.task('js', 'Lint, bundle, minify JS', ['js-main', 'js-sphere', 'js-sw', 'js-swcp']);

// Main
gulp.task('js-main', 'Main JS', function() {
  bs.notify('Building main JS...');

  return gulp.src([
      'node_modules/fontfaceobserver/fontfaceobserver.js',
      'node_modules/picturefill/dist/picturefill.min.js',
      '_js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// Photosphere
gulp.task('js-sphere', 'Photosphere JS', function() {
  bs.notify('Building photosphere JS...');

  return gulp.src([
      'node_modules/three/three.min.js',
      'node_modules/screenfull/dist/screenfull.js',
      '_js/threejs/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('photosphere.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// Service Worker JS
gulp.task('js-sw', 'Service Worker JS', function() {
  bs.notify('Building SW JS...');

  return gulp.src([
      '_js/sw/service-worker.js'
    ])
    .pipe(plumber())
    .pipe(gulp.dest('')) // SW needs to be at site root
    .pipe(gulp.dest('_site')); // SW needs to be at site root
});

// Service Worker cache polyfill
gulp.task('js-swcp', 'Service Worker cache polyfill', function() {
  bs.notify('Building SW cache polyfill...');

  return gulp.src([
      'node_modules/serviceworker-cache-polyfill/index.js'
    ])
    .pipe(plumber())
    .pipe(concat('cache-polyfill.js'))
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Resize images
// -----------------------------------------------------------------------------
gulp.task('image-resize', 'Create different sizes for responsive images.', ['image-320', 'image-640', 'image-original', 'image-photosphere', 'image-svg']);

// Image derivative: 320
gulp.task('image-320', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/travel@320'))
    .pipe(parallel(
      resize({
        width: 320,
        crop: false,
        upscale: false,
        quality: 0.5,
      }),
      os.cpus().length
    ))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('_site/img/travel@320'));
});

// Image derivative: 640
gulp.task('image-640', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR}*'])
    .pipe(changed('_site/img/travel@640'))
    .pipe(parallel(
      resize({
        width: 640,
        crop: false,
        upscale: false,
        quality: 0.5,
      }),
      os.cpus().length
    ))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('_site/img/travel@640'));
});

// Original images
gulp.task('image-original', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/travel'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('_site/img/travel'));
});

// Photospheres
gulp.task('image-photosphere', false, function () {
  return gulp.src(['_img/photosphere/*', '!_img/photosphere/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/photosphere'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('_site/img/photosphere'));
});

// SVG icons
gulp.task('image-svg', false, function () {
  return gulp.src(['_svg/*'])
    .pipe(changed('svg'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('svg'));
});


// -----------------------------------------------------------------------------
// Development tasks
// -----------------------------------------------------------------------------
gulp.task('browser-sync', false, function() {
  bs({
    server: './_site/',
    port: 3456,
    open: false
  });
});

// Build site, run browser-sync, watch for changes.
gulp.task('bs', 'Run dev tasks:', ['build-dev', 'browser-sync', 'watch'], function (cb) {
  return cb; // allows use within sequence()
});

// Watch Files For Changes
gulp.task('watch', 'Watch various files for changes and re-compile them.', function() {
  log(c.yellow('Waiting for changes...'));
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch('_img/photosphere/*', ['image-photosphere']);
  gulp.watch('_img/travel/*', ['image-original', 'image-320', 'image-640']);
  gulp.watch('_svg/*', ['image-svg']);
  gulp.watch('_js/threejs/*', ['js-sphere']);
  gulp.watch('_js/sw/*', ['js-sw']);
  gulp.watch('_js/*', ['js-main']);
  gulp.watch(['_config*', '**/*.{md,html}', 'travel.{xml,json}', 'maps/*.kml', '!_site/**/*.*'], ['jekyll']);
});


// -----------------------------------------------------------------------------
// Build site for deployment to live server.
//
// No longer running Jekyll as part of build-deploy in order to run this as
// postinstall after node buildpack is set up. It runs inside bin/boot.sh now.
// -----------------------------------------------------------------------------
gulp.task('build-deploy', 'Do a partial build to prep for deploy.', ['sass', 'js', 'image-svg', 'image-photosphere']);


// -----------------------------------------------------------------------------
// Build site for local development.
// -----------------------------------------------------------------------------
gulp.task('build-dev', 'Do a complete build to begin development.', function(cb) {
  return sequence(
    ['sass', 'js', 'image-resize'],
    'jekyll',
    cb
  );
});
