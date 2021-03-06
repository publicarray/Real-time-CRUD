'use strict';
var outputDir = 'public/lib/';
var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');

gulp.task('default', ['bootstrap', 'jquery', 'tablesort']);

gulp.task('bootstrap', function () {
  gulp.src('node_modules/@bower_components/bootstrap/dist/**/bootstrap.min*')
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(outputDir));

  gulp.src('node_modules/@bower_components/bootstrap/dist/fonts/*')
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(outputDir + 'fonts'));
});

gulp.task('jquery', function () {
  gulp.src('node_modules/@bower_components/jquery/dist/**/jquery.slim.min.*')
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(outputDir));
});

gulp.task('tablesort', function () {
  gulp.src('node_modules/@bower_components/tablesort/**/tablesort.*.js')
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(outputDir));
});

gulp.task('clean', function () {
  del([outputDir]);
});
