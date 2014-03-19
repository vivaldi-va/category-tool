/**
 * Created by vivaldi on 19.3.2014.
 */
'use strict';


var mysql	= require('mysql');
var q		= require('q');
var log		= require('npmlog');
var dbConf	= require('../config/dbConf.json');
//log.enableColor();
var db	= mysql.createConnection(dbConf);

exports.searchProducts = function(req, res) {
	log.info('DEBUG', "Search query", req.query);
	req.checkParams('query', 'no query entered').notEmpty();

	if(req.validationErrors()) {
		res.send(require('util').inspect(req.validationErrors()), 400);
	}
	var query = req.params.query;

	//log.info('DEBUG', "query", 'SELECT * FROM products WHERE name LIKE "%' + query + '%"');
	db.query('SELECT * FROM products WHERE products.name LIKE "%' + query + '%"',
		function(err, result) {
			if (err) throw err;

			log.info('DB', result);

			if(!result || !result.length) {
				res.send('no results');
			} else {
				res.send(result);
			}

		});
};