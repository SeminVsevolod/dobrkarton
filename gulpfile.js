var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var gutil = require( 'gulp-util' );
var ftp = require('vinyl-ftp');
var htmlmin = require('gulp-htmlmin');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'/*,'minify'*/], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/sass/**/*.sass", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/sass/**/*.sass")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('deploy', function() {
  var conn = ftp.create({
    host:      'ftp.elegantcode.ru',
    user:      'a0177931',
    password:  'esiguzwiim',
    parallel:  10,
    log: gutil.log
  });
  var globs = [
        'src/**',
        'css/**',
        'js/**',
        'fonts/**',
        'index.html'
    ];
  return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/domains/elegantcode.ru/public_html/dobrkarton.ru/' ) ) // only upload newer files
        .pipe( conn.dest( '/domains/elegantcode.ru/public_html/dobrkarton.ru/' ) );
});

// gulp.task('minify', function() {
//   return gulp.src('src/html/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('src'));
// });

gulp.task('default', ['serve']);