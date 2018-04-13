// Gulp utils
var gulp = require('gulp-help')(require('gulp'));
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var spawn = require('child_process').spawn;
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var sequence = require('run-sequence');
var parallel = require('concurrent-transform');
var os = require('os');

// Include Our Plugins
var bs = require('browser-sync');
var reload = bs.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('autoprefixer');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var resize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');

// Deployment debugging
log(c.yellow('Detected environment: ' + (process.env.NODE_ENV || 'local')));
var isProduction = process.env.NODE_ENV === 'production';

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
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml', '--drafts'], {stdio: 'inherit'})
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
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      prefix({
        browsers: ['last 2 versions'],
        cascade: false,
      }),
      cssnano(),
    ]))
    .pipe(rename('main.min.css'))
    .pipe(gulpif(!isProduction, sourcemaps.write('./')))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(gulp.dest('_includes')) // for the Jekyll include
    .pipe(reload({stream: true}));
});

gulp.task('sass-fonts', false, function () {
  bs.notify('sass-fonts compiling...');

  return gulp.src('_sass/fonts.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('fonts.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Combine/minify JS
// -----------------------------------------------------------------------------
gulp.task('js', 'Lint, bundle, minify JS:', ['js-head', 'js-ffo', 'js-main', 'js-sphere', 'js-sw', 'js-swcp', 'js-custom']);

// Head JS
gulp.task('js-head', 'Head JS', function() {
  return gulp.src([
      'node_modules/fg-loadcss/src/loadCSS.js',
      'node_modules/fg-loadcss/src/cssrelpreload.js',
    ])
    .pipe(plumber())
    .pipe(concat('_head.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_includes'))
    .pipe(reload({stream: true}));
});

// Head JS
gulp.task('js-ffo', 'FFO JS', function() {
  return gulp.src([
      'node_modules/fontfaceobserver/fontfaceobserver.js',
    ])
    .pipe(plumber())
    .pipe(concat('_ffo.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_includes'))
    .pipe(reload({stream: true}));
});

// Main
gulp.task('js-main', 'Main JS', function() {
  bs.notify('Building main JS...');

  return gulp.src([
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
      'node_modules/three/build/three.min.js',
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

// Custom scripts, usually used on a single page
gulp.task('js-custom', 'Custom scripts', function() {
  bs.notify('Building custom scripts...');

  return gulp.src(['_js/custom/*.js'])
    .pipe(plumber())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Resize images
// -----------------------------------------------------------------------------
gulp.task('image-resize', 'Create different sizes for responsive images.', ['image-320', 'image-640', 'image-original', 'image-photosphere', 'image-svg', 'image-blog']);

// Image derivative: 320
gulp.task('image-320', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR,Frame,P1}*'])
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
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('_site/img/travel@320'));
});

// Image derivative: 640
gulp.task('image-640', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR,Frame,P1}*'])
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
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('_site/img/travel@640'));
});

// Original images
gulp.task('image-original', false, function () {
  return gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR,Frame,P1}*'])
    .pipe(changed('_site/img/travel'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('_site/img/travel'));
});

// Photospheres
gulp.task('image-photosphere', false, function () {
  return gulp.src(['_img/photosphere/*', '!_img/photosphere/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/photosphere'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('_site/img/photosphere'));
});

// SVG icons
gulp.task('image-svg', false, function () {
  return gulp.src(['_svg/**/*'])
    .pipe(changed('svg'))
    .pipe(imagemin([
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
    ]))
    .pipe(gulp.dest('svg'));
});

// Blog images - some stuff just isn't gallery-friendly.
gulp.task('image-blog', false, function () {
  return gulp.src(['_img/blog/*', '!_img/blog/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/blog'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('_site/img/blog'));
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
  gulp.watch('_img/blog/*', ['image-blog']);
  gulp.watch('_img/photosphere/*', ['image-photosphere']);
  gulp.watch('_img/travel/*', ['image-original', 'image-320', 'image-640']);
  gulp.watch('_svg/*', ['image-svg']);
  gulp.watch('_js/threejs/*', ['js-sphere']);
  gulp.watch('_js/sw/*', ['js-sw']);
  gulp.watch('_js/*', ['js-main']);
  gulp.watch('_js/custom/*', ['js-custom']);
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
