const gulp = require('gulp');
const sass = require('gulp-sass');

const sassSrc = 'src/client/scss/**/*.scss';
const sassDest = 'src/client/css/';

gulp.task('compile-sass', () =>
    gulp.src(sassSrc)
        .pipe(sass({includePaths: ['./']}).on('error', sass.logError))
        .pipe(gulp.dest(sassDest))
);

//Run 'gulp' on its own
gulp.task('default', () =>
    gulp.watch(sassSrc, ['compile-sass'])
);