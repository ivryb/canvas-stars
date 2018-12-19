'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const browserify = require('browserify');
const coffeeify = require('coffeeify');
const uglify = require('gulp-uglify');

const stylus = require('gulp-stylus');
const koutoSwiss = require('kouto-swiss');

const jade = require('gulp-jade');

gulp.task('jade', () => {
  gulp.src('src/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('build'))
    .pipe(reload({ stream: true }));
});

gulp.task('stylus', () => {
  gulp.src('src/styl/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: koutoSwiss(),
      compress: true
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(reload({ stream: true }));
});

const bundler = browserify('src/coffee/main.coffee', {
  extensions: ['.coffee'],
  transform: [coffeeify]
});

gulp.task('coffee', () => {
  bundler
    .bundle()
    .on('error', console.log.bind(this, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('build/js'))
    .pipe(reload({ stream: true }));
});

gulp.task('serve', ['build'], () => {
   browserSync({
    server: { baseDir: 'build' },
    host: 'localhost',
    port: 7777
  });
});

gulp.task('watch', () => {
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/styl/**/*.styl', ['stylus']);
  gulp.watch('src/coffee/**/*.coffee', ['coffee']);
});

gulp.task('build', ['stylus', 'jade', 'coffee']);
gulp.task('default', ['build', 'serve', 'watch']);