'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', () => {
  return gulp.src('./styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('./styles/*.scss', ['styles']);
  gulp.watch('./scripts/*.js', ['scripts'], reload);
  gulp.watch('*.html', reload);
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: '.'  
  })
});

gulp.task('scripts', () => {
  gulp.src('./scripts/scripts.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./scripts'))
});


gulp.task('default', ['browser-sync','styles', 'scripts', 'watch']);
