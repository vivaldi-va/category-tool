'use strict';

var express = require('express');
var ssh = require('ssh2');
var log = require('npmlog');
var q = require('q');
var sshConn = require('./lib/config/sshConnect');


log.enableColor();


// connect to server via ssh

sshConn()
	.then(
	function () {
		log.info('SSH connection open');

		/**
		 * Main application file
		 */

			// Set default node environment to development
		process.env.NODE_ENV = process.env.NODE_ENV || 'development';

		// Application Config
		var config = require('./lib/config/config');
		log.info("Configuration loaded");
		var app = express();

		// Express settings
		require('./lib/config/express')(app);
		require('./lib/config/serv')();
		log.info("express config loaded");

		// Routing
		require('./lib/routes')(app);
		log.info("router loaded");

		// Start server
		app.listen(config.port, function () {
			log.info('Express server listening on port ' + config.port + " in " + app.get('env') + " mode");
		});

		// Expose app
		exports = module.exports = app;
	}
);


// if successful resume with creating listen server


