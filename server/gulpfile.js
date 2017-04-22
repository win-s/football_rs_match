var gulp = require('gulp');

gulp.task('public_eonasdan',()=>{
    var eonasdan_bootstrap_datetimepicker = [
        { src:'bower_components/moment/min/moment.min.js',des:'public/js/eonasdan' },
        { src:'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',des:'public/js/eonasdan' },
        { src:'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',des:'public/css/eonasdan' },
    ];

    eonasdan_bootstrap_datetimepicker.forEach((item)=>{
        gulp.src(item.src)
            .pipe( gulp.dest(item.des));
    });
});

gulp.task('public',[
    "public_eonasdan"
]);