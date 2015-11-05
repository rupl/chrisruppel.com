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
var deploy = require('gulp-gh-pages');

// -----------------------------------------------------------------------------
// Jekyll
// -----------------------------------------------------------------------------
gulp.task('jekyll', 'Compiles Jekyll site in dev mode.', function() {
  bs.notify('Jekyll building...');
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
    .on('close', reload);
});

// Add a second task for deploying
gulp.task('jekyll-deploy', 'Compiles Jekyll site for deployment to gh-pages.', function(cb) {
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml'], {stdio: 'inherit'})
    .on('close', cb);
});

// -----------------------------------------------------------------------------
// BrowserSync
// -----------------------------------------------------------------------------
gulp.task('browser-sync', false, function() {
  bs({
    server: './_site/',
    open: false
  });
});

// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------
gulp.task('sass', 'Compiles Sass using libsass.', function () {
  bs.notify('Sass compiling...');

  return gulp.src('_sass/**/*.scss')
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
    .pipe(gulp.dest('_includes'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Combine/minify JS
// -----------------------------------------------------------------------------
gulp.task('js', 'Lint, bundle, minify JS', function() {
  bs.notify('Building JS...');

  var main = gulp.src([
      'node_modules/fontfaceobserver/fontfaceobserver.js',
      '_js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));

  var three = gulp.src([
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

  return merge(main, three);
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
    .pipe(gulp.dest('img/travel@320'));

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
    .pipe(gulp.dest('img/travel'));

    return merge(img_320, img_orig);
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
  gulp.watch('_js/**/*', ['js']);
  gulp.watch(['_config*', '**/*.{md,html}', 'travel.{xml,json}', 'maps/*.kml', '!_site/**/*.*'], ['jekyll']);
});

// Add a default task to render the available commands.
gulp.task('default', false, ['help']);


// -----------------------------------------------------------------------------
// Build site for deployment.
// -----------------------------------------------------------------------------
gulp.task('build-deploy', 'Do a complete build to prep for deploy.', ['jekyll-deploy'], function(cb) {
  return sequence(
    ['sass', 'js', 'image-resize'],
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


// -----------------------------------------------------------------------------
// Deploy to gh-pages
// -----------------------------------------------------------------------------
gulp.task('deploy', 'Deploy site to gh-pages', ['build-deploy'], function() {
  return gulp.src('./_site/**/*')
    .pipe(deploy());
});

// -----------------------------------------------------------------------------
// Serve from Heroku
// -----------------------------------------------------------------------------
gulp.task('serve', 'Serves the site from Heroku', function() {
  connect.server({
    root: '_site',
    port: process.env.PORT || 5000,
    livereload: false
  });
});
