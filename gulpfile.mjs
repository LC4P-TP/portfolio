import gulp from 'gulp';
import ts from 'gulp-typescript';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);
const tsProject = ts.createProject('tsconfig.json');
const PATHS = {
  dist: './dist',
};

import eslint from 'gulp-eslint-new';
import prettier from 'gulp-prettier';

gulp.task('clean', () => {
  return del(PATHS.dist);
});

gulp.task('format_html', () => {
  return gulp
    .src('./src/**/*.html')
    .pipe(prettier())
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('format_scss', () => {
  return gulp
    .src('./src/**/*.scss')
    .pipe(prettier())
    .pipe(gulp.dest((file) => file.base));
});

gulp.task('lint', () => {
  return gulp
    .src('./src/**/*.ts')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.fix())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('typescript', () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(PATHS.dist));
});

gulp.task('sass', () => {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('copy', () => {
  return gulp.src('./src/**/*.html').pipe(gulp.dest(PATHS.dist));
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    'lint',
    'format_scss',
    gulp.parallel('typescript', 'sass', 'format_html')
  )
);

gulp.task('validate_style', () => {
  return gulp.src('./src/**/!(*.ts)').pipe(prettier.check());
});

gulp.task('validate_code', () => {
  return gulp
    .src('./src/**/*.ts')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('validate', gulp.series('validate_style', 'validate_code'));
