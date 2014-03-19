'use strict';

var express = require('express');
var ssh		= require('ssh2');
var log		= require('npmlog');
var q		= require('q');
var sshConn = require('./lib/config/sshConnect');
log.enableColor();



// connect to server via ssh

sshConn()
	.then(
		function() {
			log.info('SSH connection open');
		}
	);



// if successful resume with creating listen server



/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;