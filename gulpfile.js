/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  browserSync = require('browser-sync').create(),
  argv = require('minimist')(process.argv.slice(2)),

  plumber = require('gulp-plumber'),

  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps');


// Function for plumber to handle errors
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            // Custom error titles go here
            title: errTitle || 'Error running Gulp',
            message: "<%= error.message %>",
            sound: 'Submarine',
        })
    });
}


/******************************************************
 * COPY TASKS - stream assets from source to destination
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  return gulp.src('**/*.js', {cwd: path.resolve(paths().source.js)} )
    .pipe(gulp.dest(path.resolve(paths().public.js)));
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().source.images)} )
    .pipe(gulp.dest(path.resolve(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: path.resolve(paths().source.root)} )
    .pipe(gulp.dest(path.resolve(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('*', {cwd: path.resolve(paths().source.fonts)})
    .pipe(gulp.dest(path.resolve(paths().public.fonts)));
});

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(path.resolve(paths().source.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream());
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/!(*.css)'))
    .pipe(gulp.dest(path.resolve(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/*.css'))
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return path.resolve(path.join(paths().public.styleguide, 'css'));
    }))
    .pipe(browserSync.stream());
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
******************************************************/
//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-copy:js',
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    'pl-copy:css',
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:build', gulp.series('pl-assets', build, function(done){
  done();
}));

/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return path.resolve(paths().source.patterns, '**/*' + dotExtension);
  });
}

function reload() {
  browserSync.reload();
}

function watch() {
  gulp.watch(path.resolve(paths().source.css, '**/*.css')).on('change', gulp.series('pl-copy:css', reload));
  gulp.watch(path.resolve(paths().source.styleguide, '**/*.*')).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reload));

  gulp.watch(path.resolve(paths().source.sass, '**/**/*.scss')).on('change', gulp.series('sass', 'pl-copy:css', reload));

  var patternWatches = [
    path.resolve(paths().source.patterns, '**/*.json'),
    path.resolve(paths().source.patterns, '**/*.md'),
    path.resolve(paths().source.data, '*.json'),
    path.resolve(paths().source.fonts + '/*'),
    path.resolve(paths().source.images + '/*'),
    path.resolve(paths().source.meta, '*'),
    path.resolve(paths().source.annotations + '/*')
  ].concat(getTemplateWatches());

  gulp.watch(patternWatches).on('change', gulp.series(build, reload));
}

gulp.task('patternlab:connect', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: path.resolve(paths().public.root)
    },
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function(){
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
  });
  done();
}));

/******************************************************
 * CUSTOM TASKS
******************************************************/


// Converts the Sass partials into a single CSS file
gulp.task('sass', function () {
    
    var sassOptions = { 
        outputStyle: 'expanded',
    };

    var autoprefixerOptions = {
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    };

  return gulp
    .src('source/_sass/main.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sourcemaps.init())
    // Write Sass for either dev or prod
    .pipe(sass(sassOptions))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(rename("style.css"))
    // Sends the Sass file to either the app or dist folder
    .pipe(gulp.dest('source/css'))
    .pipe(notify({ message: 'Sass Processed!', onLast: true }))
    .pipe(browserSync.stream());
});


/******************************************************
 * COMPOUND TASKS
******************************************************/
gulp.task('default', gulp.series('patternlab:build'));
gulp.task('patternlab:watch', gulp.series('patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('sass', 'patternlab:build', 'patternlab:connect', watch));
