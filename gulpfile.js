// Gulp utils
var gulp = require('gulp-help')(require('gulp'));
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var spawn = require('child_process').spawn;
var plumber = require('gulp-plumber');
var sequence = require('run-sequence');

// Include Our Plugins
var bs = require('browser-sync');
var reload = bs.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minCSS = require('gulp-minify-css');
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
gulp.task('jekyll-deploy', 'Compiles Jekyll site to deploy.', function() {
  return spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml'], {stdio: 'inherit'});
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
    .pipe(minCSS())
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

  return gulp.src(['node_modules/fontfaceobserver/fontfaceobserver.js', '_js/**/*.js'])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// -----------------------------------------------------------------------------
// Minify images
// -----------------------------------------------------------------------------
gulp.task('imagemin', 'Compress images.', function() {
  return gulp.src('_img/**/*')
    .pipe(changed('img'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('img'));
});


// -----------------------------------------------------------------------------
// BrowserSync + Gulp watch
// -----------------------------------------------------------------------------
gulp.task('bs', 'Run dev tasks:', ['build-dev', 'browser-sync', 'watch'], function (cb) {
  return cb;
});

// Watch Files For Changes
gulp.task('watch', 'Watch various files for changes and re-compile them.', function() {
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch('_img/**/*', ['imagemin']);
  gulp.watch('_js/**/*', ['js']);
  gulp.watch(['_config*', '**/*.{md,html}', 'travel.{xml,json}', '!_site/**/*.*'], ['jekyll']);
});

// Add a default task to render the available commands.
gulp.task('default', false, ['help']);


// -----------------------------------------------------------------------------
// Build site for deployment.
// -----------------------------------------------------------------------------
gulp.task('build-deploy', 'Do a complete build to prep for deploy.', function(cb) {
  return sequence(
    'jekyll-deploy', // for whatever reason, I find this needing to be run before and after
    ['sass', 'js', 'imagemin'],
    'jekyll-deploy',
    cb
  );
});


// -----------------------------------------------------------------------------
// Build site for development.
// -----------------------------------------------------------------------------
gulp.task('build-dev', 'Do a complete build to begin development.', function(cb) {
  return sequence(
    ['sass', 'js', 'imagemin'],
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
