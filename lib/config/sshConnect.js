/**
 * Created by vivaldi on 19.3.2014.
 */

'use strict';
var q			= require('q');
var SSH			= require('ssh2');
var log			= require('npmlog');
var authConf	= require('./authConf.json');
log.enableColor();

module.exports = function() {
	var dfd = q.defer();
	var c = new SSH();

	c.on('ready', function() {
		log.info('Connection::ready');

		c.forwardIn('127.0.0.1', 3306, function(err) {
			if (err) throw err;
			log.info("Listening to connections on port 3306");
			dfd.resolve();
		});

	});

	c.on('error', function(err) {
		log.error('Connection::error::', err);
	});
	c.on('end', function() {
		log.warn('Connection::end');
	});
	c.on('close', function(hadError) {
		log.warn('Connection::close');
	});
	c.connect({
		host: authConf.host,
		port: authConf.port,
		username: authConf.username,
		privateKey: require('fs').readFileSync(authConf.privateKey),
		passphrase: authConf.passphrase
	});

	return dfd.promise;
};