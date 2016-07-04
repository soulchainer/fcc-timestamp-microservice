// Define plugins
var gulp = require('gulp');
var bs = require('browser-sync').create();
var $ = require('gulp-load-plugins')();

// Process SASS files
gulp.task('styles', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.cleanCss({compatibility: 'ie8'}))
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));
});

// Process HTML files
gulp.task('htmlmin', function() {
  return gulp.src('./src/*.html')
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeTagWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

// Serve and watch for changes in files
gulp.task('serve', function() {
  bs.init({
    server: './public'
  });
  var appFiles = ['./public/*', './public/css/*'];
  gulp.watch('./src/scss/*.scss', ['styles']);
  gulp.watch('./src/*.html', ['htmlmin']);
  // use nodemon to monitor changes, recharge the node app & browser-sync
  $.nodemon({
    script: 'app.js',
    ext: 'js html css',
    env: { 'NODE_ENV': 'development' }
  }).on('start', bs.reload);
});

gulp.task('default', ['styles', 'htmlmin', 'serve']);
