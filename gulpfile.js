// Gulp utils
var gulp = require('gulp');
var log = require('fancy-log');
var c = require('chalk');
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
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var resize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var toGeoJson = require('./_gulp/togeojson.js');

// Deployment debugging
log(c.yellow('Detected environment: ' + c.black.bgYellow((process.env.NODE_ENV || 'local'))));
var isProduction = process.env.NODE_ENV === 'production';


//——————————————————————————————————————————————————————————————————————————————
// Eleventy
//——————————————————————————————————————————————————————————————————————————————
function eleventyDev() {
  bs.notify('Eleventy building...');
  return spawn('npm', ['run', 'build'], {stdio: 'inherit'})
    .on('close', reload);
};
module.exports['11ty-dev'] = eleventyDev;


//——————————————————————————————————————————————————————————————————————————————
// Sass
//——————————————————————————————————————————————————————————————————————————————
gulp.task('sass', () => {
  bs.notify('sass-main compiling...');

  return gulp.src('_sass/styles.scss')
    .pipe(plumber())
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      cssnano(),
    ]))
    .pipe(rename('main.min.css'))
    .pipe(gulpif(!isProduction, sourcemaps.write('./')))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(gulp.dest('_includes')) // for the site includes
    .pipe(reload({stream: true}));
});
module.exports.sass = gulp.series('sass');


//——————————————————————————————————————————————————————————————————————————————
// Combine/minify JS
//——————————————————————————————————————————————————————————————————————————————

// Main
gulp.task('js-main', () => {
  bs.notify('Building main JS...');

  return gulp.src([
      '_js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

// Photosphere
gulp.task('js-sphere', () => {
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
gulp.task('js-sw', () => {
  bs.notify('Building SW JS...');

  return gulp.src([
      '_js/sw/service-worker.js'
    ])
    .pipe(plumber())
    .pipe(gulp.dest('./')) // SW needs to be at site root
    .pipe(gulp.dest('_site')); // SW needs to be at site root
});

// Custom scripts, usually used on a single page
gulp.task('js-custom', () => {
  bs.notify('Building custom scripts...');

  return gulp.src(['_js/custom/*.js'])
    .pipe(plumber())
    .pipe(gulp.dest('js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(reload({stream: true}));
});

const jsTask = gulp.task('js', gulp.parallel('js-main', 'js-sphere', 'js-sw', 'js-custom'));

module.exports.js = jsTask;

//——————————————————————————————————————————————————————————————————————————————
// Resize images
//——————————————————————————————————————————————————————————————————————————————

// Image derivative: 320
gulp.task('image-320', () => {
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
gulp.task('image-640', () => {
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
gulp.task('image-original', () => {
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
gulp.task('image-photosphere', () => {
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
gulp.task('image-svg', () => {
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
gulp.task('image-blog', () => {
  return gulp.src(['_img/blog/*', '!_img/blog/{IMG_,DSC_,DSCF,GOPR,Frame}*'])
    .pipe(changed('_site/img/blog'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('_site/img/blog'));
});

const imageResizeTask = gulp.task('image-resize', gulp.parallel('image-320', 'image-640', 'image-original', 'image-photosphere', 'image-svg', 'image-blog'));
module.exports['image-resize'] = imageResizeTask;

//——————————————————————————————————————————————————————————————————————————————
// Convert KML to GeoJSON
//——————————————————————————————————————————————————————————————————————————————
gulp.task('kml-to-geojson', () => {
  return gulp.src('_includes/maps/*.kml')
    .pipe(toGeoJson())
    .pipe(rename({ extname: '.json' }))
    .pipe(gulp.dest('_includes/maps/'));
});

//——————————————————————————————————————————————————————————————————————————————
// Build site for deployment to live server.
//——————————————————————————————————————————————————————————————————————————————
const buildDeployTask = gulp.task('build-deploy', gulp.parallel('sass', 'js', 'image-svg', 'image-photosphere', 'kml-to-geojson'));
module.exports['build-deploy'] = buildDeployTask;

//——————————————————————————————————————————————————————————————————————————————
// Build site for local development.
//——————————————————————————————————————————————————————————————————————————————
gulp.task('build-dev', gulp.series(
  gulp.parallel('sass', 'js', 'image-resize'),
  eleventyDev,
));

//——————————————————————————————————————————————————————————————————————————————
// Development tasks
//
// Build site, run browser-sync, watch for changes.
//——————————————————————————————————————————————————————————————————————————————

gulp.task('browser-sync', () => {
  return bs({
    server: './_site/',
    port: 3456,
    open: false
  });
});

// Watch Files For Changes
gulp.task('watch', (done) => {
  log(c.yellow('Waiting for changes...'));
  gulp.watch('_sass/**/*.scss', gulp.series('sass'));
  gulp.watch('_img/blog/*', gulp.series('image-blog'));
  gulp.watch('_img/photosphere/*', gulp.series('image-photosphere'));
  gulp.watch('_img/travel/*', gulp.parallel('image-original', 'image-320', 'image-640'));
  gulp.watch('_svg/*', gulp.series('image-svg'));
  gulp.watch('_js/threejs/*', gulp.series('js-sphere'));
  gulp.watch('_js/sw/*', gulp.series('js-sw'));
  gulp.watch('_js/*', gulp.series('js-main'));
  gulp.watch('_js/custom/*', gulp.series('js-custom'));
  gulp.watch(['_config*', '**/*.{md,html}', 'travel.{xml,json}', 'maps/*.kml', '!_site/**/*.*'], eleventyDev);
  done();
});

module.exports.bs = gulp.series('build-dev', 'watch', 'browser-sync');
