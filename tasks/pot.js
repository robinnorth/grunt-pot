/*
 * grunt-pot
 * https://github.com/stephenharris/grunt-potW
 *
 * Copyright (c) 2013 Stephen Harris
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('pot', 'Scan files and create a .pot file using xgettext', function() {

	var dest = false, inputFiles = "", headerOptions ="";

	var pkg = grunt.file.readJSON('package.json');

    var options = this.options({
		dest: false,
		overwrite: true,
		keywords: false,
		language: false,
		from_code: false,
		text_domain: 'messages',
		package_version: pkg.version,
		package_name: pkg.name,
		msgid_bugs_address: false,
		omit_header: false,
		copyright_holder: false,
		comment_tag: '/'
	});

	grunt.verbose.writeflags(options, 'Pot options');

	//If destination is a directory, build a file based on text domain
	if( options.dest && detectDestType(options.dest) === 'directory' ) {
		options.dest = options.dest.replace(/\/$/, "") + "/"+options.text_domain+".pot";
        }

	if( !grunt.file.exists(options.dest) ){
        grunt.file.write(options.dest);
    }

	grunt.log.writeln('Destination: ' + options.dest);

	//Set join mode
	var join = ( !options.overwrite ? " --join-existing" : "" );

	//Implode keywards
	var keywords = ( options.keywords ? " --keyword=" + options.keywords.join( " --keyword=" ) : "" );

	//Set input files language, if specified
	var language = ( options.language ? " --language="+options.language : "" );

	//Set input files encoding, if required
	var encoding = ( options.from_code ? " --from-code="+options.from_code : "" );

	//Generate header
	if( options.package_version ){
		headerOptions += " --package-version="+options.package_version;
	}

	if( options.package_name ){
		headerOptions += " --package-name="+options.package_name;
	}

	if( options.msgid_bugs_address ){
		headerOptions += " --msgid-bugs-address="+ options.msgid_bugs_address;
	}

	if( options.omit_header ){
		headerOptions += " --omit-header";
	}

	if( options.copyright_holder ){
		headerOptions += " --copyright-holder='"+options.copyright_holder+"'";
	}

	if( options.comment_tag ){
		headerOptions += " --add-comments='"+options.comment_tag+"'";
	}

	//Generate list of files to scan
	this.files.forEach(function(file) {
		inputFiles +=  " " + file.src[0];
	});

	//Compile and run command
	var exec = require('child_process').exec;
	var command = 'xgettext' + join + ' --default-domain=' + options.text_domain + ' -o '+options.dest + language + encoding + keywords + headerOptions + inputFiles;

	grunt.verbose.writeln('Executing: ' + command);
	exec(command);
  });

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

};
