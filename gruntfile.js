module.exports = function(grunt) {
    grunt.initConfig({
        sass: {
            options: {
				"sourcemap=none": '',
				noCache: true,
				outputStyle: 'compressed'
            },
            dist: {
                files: [{
					expand: true,
					cwd: "views/styles",
					src: ["**/*.scss"],
					dest: "public/css",
					ext: ".css"
                }]
            }
        },
        watch: {
            scss: {
                files: 'views/styles/**/*.scss',
                tasks: 'sass'
            },
        },
    });

    // Load the npm installed tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    // The default tasks to run when you type: grunt
    grunt.registerTask('default', ['sass', 'watch']);
};
