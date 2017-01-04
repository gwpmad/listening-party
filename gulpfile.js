const gulp = require('gulp');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');

const sassSrc = 'src/client/scss/**/*.scss';
const sassDest = 'src/client/css/';

gulp.task('compile-sass', () =>
    gulp.src(sassSrc)
        .pipe(sass({ includePaths: ['./'] }).on('error', sass.logError))
        .pipe(autoPrefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulp.dest(sassDest))
);

// Run 'gulp' on its own
gulp.task('default', () =>
    gulp.watch(sassSrc, ['compile-sass'])
);
