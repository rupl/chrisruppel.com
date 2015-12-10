// Gulp utils
var gulp = require('gulp-help')(require('gulp'));
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var merge = require('merge-stream');
var spawn = require('child_process').spawn;
var plumber = require('gulp-plumber');
var sequence = require('run-sequence');
var merge = require('merge-stream');
var parallel = require('concurrent-transform');
var os = require('os');
var connect = require('gulp-connect');

// Include Our Plugins
var bs = require('browser-sync');
var reload = bs.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minCSS = require('gulp-minify-css');
var resize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');

// Deployment config
var app_dir = (process.env.NODE_ENV === 'production') ? 'app/' : '';
log(c.yellow('Detected environment: ' + process.env.NODE_ENV));
log(c.yellow('Assuming app directory: \'' + app_dir + '\''));

// -----------------------------------------------------------------------------
// Jekyll
// -----------------------------------------------------------------------------
gulp.task('jekyll', 'Compiles Jekyll site in dev mode.', function() {
  bs.notify('Jekyll building...');
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
    .on('close', reload);
});

// Add a second task for deploying
gulp.task('jekyll-deploy', 'Compiles Jekyll site for deployment.', function(cb) {
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml'], {stdio: 'inherit'})
    .on('close', cb);
});

// -----------------------------------------------------------------------------
// BrowserSync
// -----------------------------------------------------------------------------
gulp.task('browser-sync', false, function() {
  bs({
    server: './_site/',
    port: 3456,
    open: false
  });
});

// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------
gulp.task('sass', 'Compiles Sass using libsass.', function () {
  bs.notify('Sass compiling...');

  var sass_main = gulp.src('_sass/styles.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'nested',
      onSuccess: function(css) {
        var dest = css.stats.entry.split('/');
        log(c.green('sass'), 'compiled to', dest[dest.length - 1]);
      },
      onError: function(err, res) {
        bs.notify('<span style="color: red">Sass failed</span>');
        log(c.red('Sass failed to compile'));
        log(c.red('> ') + err.file.split('/')[err.file.split('/').length - 1] + ' ' + c.underline('line ' + err.line) + ': ' + err.message);
      }
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(minCSS({processImport: false}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(gulp.dest('_includes')) // for the Jekyll include
    .pipe(reload({stream: true}));

  var sass_fonts = gulp.src('_sass/fonts.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'nested',
      onSuccess: function(css) {
        var dest = css.stats.entry.split('/');
        log(c.green('sass'), 'compiled to', dest[dest.length - 1]);
      },
      onError: function(err, res) {
        bs.notify('<span style="color: red">Fonts failed</span>');
        log(c.red('Fonts failed to compile'));
        log(c.red('> ') + err.file.split('/')[err.file.split('/').length - 1] + ' ' + c.underline('line ' + err.line) + ': ' + err.message);
      }
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(minCSS({processImport: false}))
    .pipe(rename('fonts.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest(app_dir + '_site/css'))
    .pipe(reload({stream: true}));

  return merge(sass_main, sass_fonts);
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
      '_js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest(app_dir + '_site/js'))
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
    .pipe(gulp.dest(app_dir + '_site/js'))
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
    .pipe(gulp.dest(app_dir + '_site')) // SW needs to be at site root
    .pipe(reload({stream: true}));
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
    .pipe(gulp.dest(app_dir + '_site/js'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Resize images
// -----------------------------------------------------------------------------
gulp.task('image-resize', 'Create different sizes for resposive images.', function () {

  // Eventually I'd like to do some inlining of a tiny image upfront.
  //
  // log(c.cyan('image-resize'), 'creating images @ 32...');
  // var img_32 = gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR}*'])
  //   .pipe(changed('img/travel@32'))
  //   .pipe(parallel(
  //     resize({
  //       width: 32,
  //       height: 24,
  //       crop: true,
  //       upscale: false,
  //       quality: 0.5,
  //     }),
  //     os.cpus().length
  //   ))
  //   .pipe(imagemin({
  //     progressive: true,
  //     svgoPlugins: [{removeViewBox: false}]
  //   }))
  //   .pipe(rename({
  //     dirname: ''
  //   }))
  //   .pipe(gulp.dest('img/travel@32'));

  log(c.cyan('image-resize'), 'creating images @ 320...');
  var img_320 = gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR}*'])
    .pipe(changed('img/travel@320'))
    .pipe(parallel(
      resize({
        width: 320,
        height: 320,
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
    .pipe(gulp.dest('img/travel@320'))
    .pipe(gulp.dest(app_dir + '_site/img/travel@320'));

  // Unused for now
  //
  // log(c.cyan('image-resize'), 'creating images @ 640...');
  // var img_640 = gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR}*'])
  //   .pipe(changed('img/travel@640'))
  //   .pipe(parallel(
  //     resize({
  //       width: 640,
  //       height: 640,
  //       crop: true,
  //       upscale: false,
  //       quality: 0.75,
  //     }),
  //     os.cpus().length
  //   ))
  //   .pipe(imagemin({
  //     progressive: true,
  //     svgoPlugins: [{removeViewBox: false}]
  //   }))
  //   .pipe(rename({
  //     dirname: ''
  //   }))
  //   .pipe(gulp.dest('img/travel@640'));

  log(c.cyan('image-resize'), 'minifying originals...');
  var img_orig = gulp.src(['_img/travel/*', '!_img/travel/{IMG_,DSC_,DSCF,GOPR}*'])
    .pipe(changed('img/travel'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('img/travel'))
    .pipe(gulp.dest(app_dir + '_site/img/travel'));

  log(c.cyan('image-resize'), 'minifying photospheres...');
  var img_photosphere = gulp.src(['_img/photosphere/*', '!_img/photosphere/{IMG_,DSC_,DSCF,GOPR}*'])
    .pipe(changed('img/photosphere'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('img/photosphere'))
    .pipe(gulp.dest(app_dir + '_site/img/photosphere'));

    return merge(img_320, img_orig, img_photosphere);
});

// -----------------------------------------------------------------------------
// BrowserSync + Gulp watch
// -----------------------------------------------------------------------------
gulp.task('bs', 'Run dev tasks:', ['build-dev', 'browser-sync', 'watch'], function (cb) {
  return cb; // allows use within sequence()
});

// Watch Files For Changes
gulp.task('watch', 'Watch various files for changes and re-compile them.', function() {
  log(c.yellow('Waiting for changes...'));
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch('_img/**/*', ['image-resize']);
  gulp.watch('_js/threejs/*', ['js-sphere']);
  gulp.watch('_js/sw/*', ['js-sw']);
  gulp.watch('_js/*', ['js-main']);
  gulp.watch(['_config*', '**/*.{md,html}', 'travel.{xml,json}', 'maps/*.kml', '!_site/**/*.*'], ['jekyll']);
});

// Add a default task to render the available commands.
gulp.task('default', false, ['help']);


// -----------------------------------------------------------------------------
// Build site for deployment.
//
// No longer running image as part of build-deploy to reduce runtime. It happens
// as part of deployment to Heroku.
// -----------------------------------------------------------------------------
gulp.task('build-deploy', 'Do a complete build to prep for deploy.', function(cb) {
  return sequence(
    ['sass', 'js'],
    'jekyll-deploy',
    cb
  );
});


// -----------------------------------------------------------------------------
// Build site for development.
// -----------------------------------------------------------------------------
gulp.task('build-dev', 'Do a complete build to begin development.', function(cb) {
  return sequence(
    ['sass', 'js', 'image-resize'],
    'jekyll',
    cb
  );
});
