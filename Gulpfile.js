var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
gulp.task('sass', function() {
   return gulp.src('public/scss/*.scss')
   .pipe(sass({outputStyle:'compressed',sourceComments:'map'},{errLogToConsole:true}))
   .pipe(prefix("last 2 versions","> 1%","ie 8","Android 2","Firefox ESR"))
   .pipe(gulp.dest('public/css'))
   .pipe(reload({stream:true}))
});



gulp.task('nodemon',function (cb) {
    var callbackCalled = false;
    return nodemon({
      script: 'bin/www',
      ext:'js',
      legacyWatch:true,
      ignore:["public/js/**"]
     }).on('start', function() {
      if(!callbackCalled) {
        callbackCalled = true;
        cb();
      }
    })
})


gulp.task('watch',function() {
  gulp.watch(["views/pages/**/*.scss"],["sass"]);
  gulp.watch(["public/scss/*.scss"],["sass"]);
  gulp.watch(["public/js/modules/*.js"],reload);
  gulp.watch(["views/**/**/*.ejs"],reload);
})

gulp.task('default',['sass','nodemon','watch']);
